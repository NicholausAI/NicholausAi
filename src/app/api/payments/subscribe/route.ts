import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { convex } from "@/lib/convex";
import { api } from "../../../../../convex/_generated/api";
import { addToVault, addRecurring, isApproved } from "@/lib/nmi";
import { handleEmailEvent } from "@/lib/email-events";
import { checkRateLimit } from "@/lib/rate-limit";

const subscribeSchema = z.object({
  paymentToken: z.string().min(1, "Payment token is required"),
  productSlug: z.string().min(1, "Product slug is required"),
  customerEmail: z.string().email("Valid email is required"),
  customerName: z.string().min(1).max(100, "Name is required"),
  interval: z.enum(["monthly", "yearly"]),
  billingAddress: z
    .object({
      address1: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zip: z.string().optional(),
      country: z.string().optional(),
    })
    .optional(),
});

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const rateLimitResult = checkRateLimit(
      `subscribe:${ip}`,
      5,
      15 * 60 * 1000
    );
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = subscribeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const {
      paymentToken,
      productSlug,
      customerEmail,
      customerName,
      interval,
      billingAddress,
    } = parsed.data;

    // Server-side product validation
    const product = await convex.query(api.products.getBySlug, {
      slug: productSlug,
    });
    if (!product || !product.published) {
      return NextResponse.json(
        { error: "Product not found or unavailable" },
        { status: 404 }
      );
    }

    if (!product.isSubscription) {
      return NextResponse.json(
        { error: "This product does not support subscriptions" },
        { status: 400 }
      );
    }

    // Determine the subscription amount
    const planAmount = product.recurringPrice ?? product.price;

    // Step 1: Add customer to NMI vault (required for recurring)
    const vaultResponse = await addToVault({
      paymentToken,
      customerEmail,
      customerName,
      billingAddress,
    });

    if (!isApproved(vaultResponse) || !vaultResponse.customer_vault_id) {
      return NextResponse.json(
        {
          success: false,
          error: vaultResponse.responsetext || "Failed to store payment method",
        },
        { status: 400 }
      );
    }

    const customerVaultId = vaultResponse.customer_vault_id;

    // Store vault record
    await convex.mutation(api.customerVault.create, {
      customerEmail,
      customerName,
      nmiCustomerVaultId: customerVaultId,
      isDefault: true,
    });

    // Step 2: Create recurring subscription in NMI
    const recurringResponse = await addRecurring({
      customerVaultId,
      planAmount,
      interval,
      orderDescription: `${product.name} — ${interval} subscription`,
    });

    if (!isApproved(recurringResponse)) {
      return NextResponse.json(
        {
          success: false,
          error:
            recurringResponse.responsetext ||
            "Failed to create subscription",
        },
        { status: 400 }
      );
    }

    const nmiSubscriptionId =
      recurringResponse.transactionid || recurringResponse.raw.subscription_id || "";

    // Calculate period dates
    const now = Date.now();
    const periodEnd =
      interval === "monthly"
        ? now + 30 * 24 * 60 * 60 * 1000
        : now + 365 * 24 * 60 * 60 * 1000;

    // Store subscription in Convex
    const subscriptionId = await convex.mutation(api.subscriptions.create, {
      customerEmail,
      customerName,
      productId: product._id,
      nmiSubscriptionId,
      nmiCustomerVaultId: customerVaultId,
      planAmount,
      currency: product.currency,
      interval,
      status: "active",
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
    });

    // Handle email event
    handleEmailEvent({
      type: "subscription.created",
      email: customerEmail,
      name: customerName,
      productName: product.name,
      amount: planAmount,
      currency: product.currency,
      interval,
    }).catch((err) =>
      console.error("Failed to handle subscription event:", err)
    );

    return NextResponse.json({
      success: true,
      subscriptionId,
      nmiSubscriptionId,
    });
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json(
      { error: "Failed to create subscription" },
      { status: 500 }
    );
  }
}
