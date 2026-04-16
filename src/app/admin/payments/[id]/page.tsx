"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { AdminHeader } from "@/components/admin/layout";
import { AdminButton, AdminBadge } from "@/components/admin/ui";
import type { Id } from "../../../../../convex/_generated/dataModel";
import { ArrowLeft, Loader2 } from "lucide-react";

function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(price);
}

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
}

const statusVariants: Record<string, "success" | "warning" | "danger" | "info" | "default"> = {
  completed: "success",
  pending: "warning",
  failed: "danger",
  refunded: "info",
};

const avsDescriptions: Record<string, string> = {
  A: "Address match, ZIP no match",
  B: "Address match (international)",
  C: "No match (international)",
  D: "Address + ZIP match (international)",
  E: "AVS error",
  G: "Non-US issuer, does not participate",
  I: "Address not verified (international)",
  M: "Address + ZIP match (international)",
  N: "No match",
  P: "ZIP match (international)",
  R: "System unavailable",
  S: "AVS not supported",
  U: "Address info unavailable",
  W: "9-digit ZIP match, address no match",
  X: "Exact match (address + 9-digit ZIP)",
  Y: "Address + 5-digit ZIP match",
  Z: "5-digit ZIP match, address no match",
};

const cvvDescriptions: Record<string, string> = {
  M: "CVV match",
  N: "CVV no match",
  P: "Not processed",
  S: "Merchant indicated CVV not present",
  U: "Issuer not certified",
};

export default function PaymentDetailPage() {
  const params = useParams();
  const purchaseId = params.id as string;
  const [refundLoading, setRefundLoading] = useState(false);
  const [refundError, setRefundError] = useState("");
  const [refundSuccess, setRefundSuccess] = useState(false);

  const purchase = useQuery(api.purchases.getById, {
    id: purchaseId as Id<"purchases">,
  });

  const webhookEvents = useQuery(
    api.webhookEvents.listByTransactionId,
    purchase?.nmiTransactionId
      ? { nmiTransactionId: purchase.nmiTransactionId }
      : "skip"
  );

  const handleRefund = async () => {
    if (!confirm("Are you sure you want to refund this purchase?")) return;

    setRefundLoading(true);
    setRefundError("");

    try {
      const res = await fetch("/api/payments/refund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purchaseId }),
      });

      const data = await res.json();
      if (data.success) {
        setRefundSuccess(true);
      } else {
        setRefundError(data.error || "Refund failed");
      }
    } catch {
      setRefundError("Network error — please try again");
    } finally {
      setRefundLoading(false);
    }
  };

  if (purchase === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-5 h-5 animate-spin text-[var(--muted)]" />
      </div>
    );
  }

  if (purchase === null) {
    return (
      <div className="p-6">
        <p className="text-[var(--muted)]">Purchase not found.</p>
        <Link href="/admin/payments" className="text-[var(--accent)] text-sm mt-2 inline-block">
          Back to payments
        </Link>
      </div>
    );
  }

  return (
    <div>
      <AdminHeader
        title="Payment Detail"
        description={`Transaction ${purchase.nmiTransactionId || purchase.transactionId || purchase._id}`}
        actions={
          <Link href="/admin/payments">
            <AdminButton variant="secondary" icon={<ArrowLeft className="w-4 h-4" />}>
              Back
            </AdminButton>
          </Link>
        }
      />

      <div className="p-6 space-y-6">
        {/* Status + Refund */}
        <div className="flex items-center justify-between">
          <AdminBadge variant={statusVariants[purchase.status] || "default"}>
            {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
          </AdminBadge>

          {purchase.status === "completed" && !refundSuccess && (
            <AdminButton
              variant="danger"
              onClick={handleRefund}
              disabled={refundLoading}
            >
              {refundLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Processing...
                </span>
              ) : (
                "Issue Refund"
              )}
            </AdminButton>
          )}
        </div>

        {refundError && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-[5px] text-[14px] text-red-500">
            {refundError}
          </div>
        )}

        {refundSuccess && (
          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-[5px] text-[14px] text-green-600">
            Refund processed successfully.
          </div>
        )}

        {/* Details grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer info */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[5px] p-5">
            <h3 className="text-[13px] font-semibold text-[var(--foreground)] uppercase tracking-wider mb-4">
              Customer
            </h3>
            <dl className="space-y-3 text-[14px]">
              <div className="flex justify-between">
                <dt className="text-[var(--muted)]">Name</dt>
                <dd className="text-[var(--foreground)] font-medium">
                  {purchase.customerName || "—"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[var(--muted)]">Email</dt>
                <dd className="text-[var(--foreground)]">
                  {purchase.customerEmail || "—"}
                </dd>
              </div>
            </dl>
          </div>

          {/* Payment info */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[5px] p-5">
            <h3 className="text-[13px] font-semibold text-[var(--foreground)] uppercase tracking-wider mb-4">
              Payment
            </h3>
            <dl className="space-y-3 text-[14px]">
              <div className="flex justify-between">
                <dt className="text-[var(--muted)]">Amount</dt>
                <dd className="text-[var(--foreground)] font-medium">
                  {formatPrice(purchase.amount, purchase.currency)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[var(--muted)]">Product</dt>
                <dd className="text-[var(--foreground)]">
                  {purchase.product?.name || "Unknown"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[var(--muted)]">Provider</dt>
                <dd className="text-[var(--foreground)]">
                  {purchase.paymentProvider}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[var(--muted)]">Date</dt>
                <dd className="text-[var(--foreground)]">
                  {formatDate(purchase._creationTime)}
                </dd>
              </div>
              {purchase.refundedAt && (
                <div className="flex justify-between">
                  <dt className="text-[var(--muted)]">Refunded</dt>
                  <dd className="text-[var(--foreground)]">
                    {formatDate(purchase.refundedAt)}
                    {purchase.refundAmount
                      ? ` (${formatPrice(purchase.refundAmount, purchase.currency)})`
                      : ""}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* NMI response details */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[5px] p-5">
            <h3 className="text-[13px] font-semibold text-[var(--foreground)] uppercase tracking-wider mb-4">
              Gateway Response
            </h3>
            <dl className="space-y-3 text-[14px]">
              <div className="flex justify-between">
                <dt className="text-[var(--muted)]">Transaction ID</dt>
                <dd className="text-[var(--foreground)] font-mono text-[13px]">
                  {purchase.nmiTransactionId || purchase.transactionId || "—"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[var(--muted)]">Response Code</dt>
                <dd className="text-[var(--foreground)]">
                  {purchase.nmiResponseCode || "—"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[var(--muted)]">Idempotency Key</dt>
                <dd className="text-[var(--foreground)] font-mono text-[12px]">
                  {purchase.idempotencyKey || "—"}
                </dd>
              </div>
            </dl>
          </div>

          {/* AVS/CVV verification */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[5px] p-5">
            <h3 className="text-[13px] font-semibold text-[var(--foreground)] uppercase tracking-wider mb-4">
              Fraud Verification
            </h3>
            <dl className="space-y-3 text-[14px]">
              <div>
                <dt className="text-[var(--muted)] mb-1">AVS Response</dt>
                <dd className="text-[var(--foreground)]">
                  {purchase.avsResponse ? (
                    <span>
                      <span className="font-mono font-medium">{purchase.avsResponse}</span>
                      <span className="text-[var(--muted)] ml-2">
                        — {avsDescriptions[purchase.avsResponse] || "Unknown code"}
                      </span>
                    </span>
                  ) : (
                    "—"
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-[var(--muted)] mb-1">CVV Response</dt>
                <dd className="text-[var(--foreground)]">
                  {purchase.cvvResponse ? (
                    <span>
                      <span className="font-mono font-medium">{purchase.cvvResponse}</span>
                      <span className="text-[var(--muted)] ml-2">
                        — {cvvDescriptions[purchase.cvvResponse] || "Unknown code"}
                      </span>
                    </span>
                  ) : (
                    "—"
                  )}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Webhook events */}
        {webhookEvents && webhookEvents.length > 0 && (
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[5px] p-5">
            <h3 className="text-[13px] font-semibold text-[var(--foreground)] uppercase tracking-wider mb-4">
              Webhook Events
            </h3>
            <div className="space-y-3">
              {webhookEvents.map((event) => (
                <div
                  key={event._id}
                  className="flex items-center justify-between text-[14px] py-2 border-b border-[var(--border)] last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <AdminBadge
                      variant={event.processed ? "success" : "warning"}
                    >
                      {event.processed ? "Processed" : "Pending"}
                    </AdminBadge>
                    <span className="text-[var(--foreground)]">
                      {event.eventType}
                    </span>
                  </div>
                  <span className="text-[var(--muted)] text-[13px]">
                    {formatDate(event._creationTime)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
