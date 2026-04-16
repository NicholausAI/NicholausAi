"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { AdminHeader } from "@/components/admin/layout";
import { AdminTable, AdminBadge, AdminButton } from "@/components/admin/ui";
import { Loader2 } from "lucide-react";
import type { Id } from "../../../../convex/_generated/dataModel";

interface SubscriptionRow {
  _id: Id<"subscriptions">;
  customerEmail: string;
  customerName: string;
  planAmount: number;
  currency: string;
  interval: "monthly" | "yearly";
  status: "active" | "paused" | "cancelled" | "past_due" | "expired";
  nmiSubscriptionId: string;
  currentPeriodEnd?: number;
  cancelledAt?: number;
  _creationTime: number;
  product?: {
    name: string;
  } | null;
}

const statusVariants: Record<
  SubscriptionRow["status"],
  "success" | "warning" | "danger" | "info" | "default"
> = {
  active: "success",
  paused: "warning",
  cancelled: "default",
  past_due: "danger",
  expired: "default",
};

function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(price);
}

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function SubscriptionsPage() {
  const subscriptions = useQuery(api.subscriptions.list);
  const cancelSubscription = useMutation(api.subscriptions.cancel);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredSubs = (subscriptions as SubscriptionRow[] | undefined)?.filter(
    (s) => statusFilter === "all" || s.status === statusFilter
  );

  const handleCancel = async (id: Id<"subscriptions">, nmiSubId: string) => {
    if (!confirm("Cancel this subscription? The customer will lose access at the end of their current billing period.")) return;

    setCancellingId(id);
    try {
      // Cancel in NMI
      await fetch("/api/payments/subscribe", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionId: nmiSubId }),
      });

      // Cancel locally
      await cancelSubscription({ id });
    } catch (err) {
      console.error("Cancel error:", err);
    } finally {
      setCancellingId(null);
    }
  };

  const columns = [
    {
      key: "customer",
      header: "Customer",
      render: (s: SubscriptionRow) => (
        <div>
          <p className="font-medium text-[var(--foreground)] text-[14px]">
            {s.customerName}
          </p>
          <p className="text-xs text-[var(--muted)] mt-0.5">{s.customerEmail}</p>
        </div>
      ),
    },
    {
      key: "product",
      header: "Product",
      render: (s: SubscriptionRow) => (
        <span className="text-[14px] text-[var(--foreground)]">
          {s.product?.name || "Unknown"}
        </span>
      ),
    },
    {
      key: "plan",
      header: "Plan",
      render: (s: SubscriptionRow) => (
        <span className="text-[14px] text-[var(--foreground)]">
          {formatPrice(s.planAmount, s.currency)}/{s.interval === "monthly" ? "mo" : "yr"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (s: SubscriptionRow) => (
        <AdminBadge variant={statusVariants[s.status]}>
          {s.status === "past_due"
            ? "Past Due"
            : s.status.charAt(0).toUpperCase() + s.status.slice(1)}
        </AdminBadge>
      ),
    },
    {
      key: "nextBilling",
      header: "Next Billing",
      render: (s: SubscriptionRow) => (
        <span className="text-[13px] text-[var(--muted)]">
          {s.status === "active" && s.currentPeriodEnd
            ? formatDate(s.currentPeriodEnd)
            : "—"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (s: SubscriptionRow) =>
        s.status === "active" ? (
          <AdminButton
            variant="danger"
            size="sm"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              handleCancel(s._id, s.nmiSubscriptionId);
            }}
            disabled={cancellingId === s._id}
          >
            {cancellingId === s._id ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              "Cancel"
            )}
          </AdminButton>
        ) : null,
    },
  ];

  return (
    <div>
      <AdminHeader
        title="Subscriptions"
        description="Manage recurring billing"
      />

      <div className="p-6">
        {/* Filter */}
        <div className="mb-6">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 text-[14px] bg-[var(--surface)] border border-[var(--border)] rounded-[5px] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="past_due">Past Due</option>
            <option value="cancelled">Cancelled</option>
            <option value="paused">Paused</option>
            <option value="expired">Expired</option>
          </select>
        </div>

        <AdminTable
          columns={columns}
          data={filteredSubs ?? []}
          keyExtractor={(s) => s._id}
          isLoading={subscriptions === undefined}
          emptyState={
            <div className="text-center py-12">
              <h3 className="text-sm font-medium text-[var(--foreground)]">
                No subscriptions yet
              </h3>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Subscriptions will appear here when customers sign up for recurring plans.
              </p>
            </div>
          }
        />
      </div>
    </div>
  );
}
