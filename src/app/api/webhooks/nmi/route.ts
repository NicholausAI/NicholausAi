import { NextRequest, NextResponse } from "next/server";
import { convex } from "@/lib/convex";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";

/**
 * NMI Webhook Handler
 *
 * NMI sends POST requests with form-encoded data for transaction events.
 * This endpoint does NOT require authentication — NMI calls it directly.
 * Validation is done via webhook signing secret or IP allowlisting.
 *
 * Configure this URL in your NMI/EasyPayDirect merchant dashboard:
 *   https://yourdomain.com/api/webhooks/nmi
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the webhook body (NMI sends form-encoded data)
    const contentType = request.headers.get("content-type") || "";
    let payload: Record<string, string>;

    if (contentType.includes("application/x-www-form-urlencoded")) {
      const text = await request.text();
      payload = Object.fromEntries(new URLSearchParams(text));
    } else {
      // Some webhook configs may send JSON
      payload = await request.json();
    }

    const eventType = payload.event_type || payload.type || "unknown";
    const transactionId =
      payload.transaction_id || payload.transactionid || undefined;
    const subscriptionId =
      payload.subscription_id || undefined;

    // Log the raw webhook event
    const eventId = await convex.mutation(api.webhookEvents.create, {
      eventType,
      nmiTransactionId: transactionId,
      nmiSubscriptionId: subscriptionId,
      rawPayload: payload,
      processed: false,
    });

    // Process based on event type
    try {
      await processWebhookEvent(eventType, payload);

      // Mark as processed
      await convex.mutation(api.webhookEvents.markProcessed, {
        id: eventId,
      });
    } catch (processError) {
      // Log the error but still return 200 to prevent NMI from retrying
      const errorMessage =
        processError instanceof Error
          ? processError.message
          : "Unknown processing error";

      await convex.mutation(api.webhookEvents.markProcessed, {
        id: eventId,
        error: errorMessage,
      });

      console.error("Webhook processing error:", processError);
    }

    // Always return 200 — NMI retries on non-200 responses
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    // Still return 200 to prevent infinite retries
    return NextResponse.json({ received: true, error: "Processing failed" });
  }
}

async function processWebhookEvent(
  eventType: string,
  payload: Record<string, string>
) {
  const condition = payload.condition || "";
  const transactionId =
    payload.transaction_id || payload.transactionid;

  switch (condition) {
    case "complete":
    case "pendingsettlement": {
      // Transaction completed — update purchase if we have a matching record
      if (transactionId) {
        // Try to find and update the purchase
        // The orderId we sent to NMI maps to our purchase ID
        const orderId = payload.order_id || payload.orderid;
        if (orderId) {
          try {
            await convex.mutation(api.purchases.updatePaymentDetails, {
              id: orderId as Id<"purchases">,
              status: "completed",
              nmiTransactionId: transactionId,
            });
          } catch {
            // Purchase may not exist or already updated — that's fine
          }
        }
      }
      break;
    }

    case "failed":
    case "abandoned": {
      if (transactionId) {
        const orderId = payload.order_id || payload.orderid;
        if (orderId) {
          try {
            await convex.mutation(api.purchases.updatePaymentDetails, {
              id: orderId as Id<"purchases">,
              status: "failed",
              nmiTransactionId: transactionId,
            });
          } catch {
            // Purchase may not exist — that's fine
          }
        }
      }
      break;
    }

    case "refund": {
      if (transactionId) {
        const orderId = payload.order_id || payload.orderid;
        if (orderId) {
          try {
            await convex.mutation(api.purchases.updatePaymentDetails, {
              id: orderId as Id<"purchases">,
              status: "refunded",
              refundedAt: Date.now(),
            });
          } catch {
            // Purchase may not exist — that's fine
          }
        }
      }
      break;
    }

    default:
      // Unknown event type — already logged, nothing to process
      break;
  }

  // Handle recurring billing events
  const subscriptionId = payload.subscription_id;
  if (subscriptionId) {
    const sub = await convex.query(api.subscriptions.getByNmiSubscriptionId, {
      nmiSubscriptionId: subscriptionId,
    });

    if (sub) {
      if (condition === "failed" || condition === "abandoned") {
        await convex.mutation(api.subscriptions.updateStatus, {
          id: sub._id,
          status: "past_due",
        });
      } else if (
        condition === "complete" ||
        condition === "pendingsettlement"
      ) {
        const now = Date.now();
        const periodEnd =
          sub.interval === "monthly"
            ? now + 30 * 24 * 60 * 60 * 1000
            : now + 365 * 24 * 60 * 60 * 1000;

        await convex.mutation(api.subscriptions.updateStatus, {
          id: sub._id,
          status: "active",
          currentPeriodStart: now,
          currentPeriodEnd: periodEnd,
        });
      }
    }
  }
}
