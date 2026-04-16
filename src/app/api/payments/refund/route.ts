import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { convex } from "@/lib/convex";
import { api } from "../../../../../convex/_generated/api";
import { refundTransaction, isApproved } from "@/lib/nmi";
import { handleEmailEvent } from "@/lib/email-events";
import type { Id } from "../../../../../convex/_generated/dataModel";

const refundSchema = z.object({
  purchaseId: z.string().min(1, "Purchase ID is required"),
  amount: z.number().positive().optional(), // optional for partial refunds
});

export async function POST(request: NextRequest) {
  try {
    // Admin-only — require NextAuth session
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = refundSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { purchaseId, amount } = parsed.data;

    // Fetch purchase
    const purchase = await convex.query(api.purchases.getById, {
      id: purchaseId as Id<"purchases">,
    });
    if (!purchase) {
      return NextResponse.json(
        { error: "Purchase not found" },
        { status: 404 }
      );
    }

    if (purchase.status !== "completed") {
      return NextResponse.json(
        { error: "Only completed purchases can be refunded" },
        { status: 400 }
      );
    }

    const nmiTransactionId =
      purchase.nmiTransactionId || purchase.transactionId;
    if (!nmiTransactionId) {
      return NextResponse.json(
        { error: "No transaction ID found for this purchase" },
        { status: 400 }
      );
    }

    const refundAmount = amount || purchase.amount;

    // Process refund through NMI
    const nmiResponse = await refundTransaction(nmiTransactionId, refundAmount);

    if (isApproved(nmiResponse)) {
      await convex.mutation(api.purchases.updatePaymentDetails, {
        id: purchaseId as Id<"purchases">,
        status: "refunded",
        refundedAt: Date.now(),
        refundAmount,
      });

      // Handle refund email event
      if (purchase.customerEmail && purchase.product) {
        handleEmailEvent({
          type: "refund.processed",
          email: purchase.customerEmail,
          name: purchase.customerName || "Customer",
          productName: purchase.product.name,
          refundAmount,
          currency: purchase.currency,
          transactionId: nmiResponse.transactionid,
        }).catch((err) =>
          console.error("Failed to handle refund event:", err)
        );
      }

      return NextResponse.json({
        success: true,
        refundTransactionId: nmiResponse.transactionid,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: nmiResponse.responsetext || "Refund failed",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Refund error:", error);
    return NextResponse.json(
      { error: "Failed to process refund" },
      { status: 500 }
    );
  }
}
