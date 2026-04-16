import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { convex } from "@/lib/convex";
import { api } from "../../../../../convex/_generated/api";
import { processPayment, isApproved } from "@/lib/nmi";
import { handleEmailEvent } from "@/lib/email-events";
import { checkRateLimit } from "@/lib/rate-limit";

const chargeSchema = z.object({
  paymentToken: z.string().min(1, "Payment token is required"),
  productSlug: z.string().min(1, "Product slug is required"),
  customerEmail: z.string().email("Valid email is required"),
  customerName: z.string().min(1).max(100, "Name is required"),
  idempotencyKey: z.string().uuid("Valid idempotency key is required"),
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
    // Rate limit by IP
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const rateLimitResult = checkRateLimit(`charge:${ip}`, 10, 15 * 60 * 1000);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: "Too many payment attempts. Please try again later." },
        { status: 429 }
      );
    }

    // Validate request body
    const body = await request.json();
    const parsed = chargeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { paymentToken, productSlug, customerEmail, customerName, idempotencyKey, billingAddress } = parsed.data;

    // Idempotency check — return existing result if already processed
    const existingPurchase = await convex.query(
      api.purchases.getByIdempotencyKey,
      { idempotencyKey }
    );
    if (existingPurchase && existingPurchase.status === "completed") {
      return NextResponse.json({
        success: true,
        transactionId: existingPurchase.nmiTransactionId || existingPurchase.transactionId,
        purchaseId: existingPurchase._id,
        alreadyProcessed: true,
      });
    }

    // Server-side price validation — fetch authoritative price from DB
    const product = await convex.query(api.products.getBySlug, { slug: productSlug });
    if (!product || !product.published) {
      return NextResponse.json(
        { error: "Product not found or unavailable" },
        { status: 404 }
      );
    }

    // Create pending purchase record before calling NMI
    const purchaseId = await convex.mutation(api.purchases.create, {
      productId: product._id,
      amount: product.price,
      currency: product.currency,
      paymentProvider: "nmi",
      status: "pending",
      customerEmail,
      customerName,
      idempotencyKey,
    });

    // Process payment through NMI with server-validated amount
    const nmiResponse = await processPayment({
      paymentToken,
      amount: product.price, // authoritative price from DB
      orderId: purchaseId,
      orderDescription: product.name,
      customerEmail,
      customerName,
      billingAddress,
    });

    if (isApproved(nmiResponse)) {
      // Update purchase as completed
      await convex.mutation(api.purchases.updatePaymentDetails, {
        id: purchaseId,
        status: "completed",
        nmiTransactionId: nmiResponse.transactionid,
        nmiResponseCode: nmiResponse.response_code,
        avsResponse: nmiResponse.avsresponse,
        cvvResponse: nmiResponse.cvvresponse,
        transactionId: nmiResponse.transactionid,
      });

      // Handle email event (don't block response)
      handleEmailEvent({
        type: "product.purchased",
        email: customerEmail,
        name: customerName,
        productSlug: product.slug,
        productName: product.name,
        productType: product.type,
        amount: product.price,
        currency: product.currency,
        transactionId: nmiResponse.transactionid,
      }).catch((err) => console.error("Failed to handle purchase event:", err));

      return NextResponse.json({
        success: true,
        transactionId: nmiResponse.transactionid,
        purchaseId,
      });
    } else {
      // Payment declined or error
      await convex.mutation(api.purchases.updatePaymentDetails, {
        id: purchaseId,
        status: "failed",
        nmiTransactionId: nmiResponse.transactionid,
        nmiResponseCode: nmiResponse.response_code,
        avsResponse: nmiResponse.avsresponse,
        cvvResponse: nmiResponse.cvvresponse,
      });

      return NextResponse.json(
        {
          success: false,
          error: nmiResponse.responsetext || "Payment declined",
          code: nmiResponse.response_code,
        },
        { status: 402 }
      );
    }
  } catch (error) {
    console.error("Payment charge error:", error);
    return NextResponse.json(
      { error: "An error occurred processing your payment. Please try again." },
      { status: 500 }
    );
  }
}
