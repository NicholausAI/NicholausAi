"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { AdminHeader } from "@/components/admin/layout";
import { AdminTable, AdminBadge } from "@/components/admin/ui";

interface PurchaseRow {
  _id: string;
  customerEmail?: string;
  customerName?: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "refunded";
  nmiTransactionId?: string;
  transactionId?: string;
  paymentProvider: string;
  _creationTime: number;
  product?: {
    name: string;
    type: string;
  } | null;
}

const statusConfig: Record<
  PurchaseRow["status"],
  { variant: "info" | "success" | "warning" | "danger" | "default" }
> = {
  pending: { variant: "warning" },
  completed: { variant: "success" },
  failed: { variant: "danger" },
  refunded: { variant: "info" },
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
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function PaymentsPage() {
  const purchases = useQuery(api.purchases.listWithProducts);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPurchases = (purchases as PurchaseRow[] | undefined)?.filter(
    (p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (
        searchQuery &&
        !p.customerEmail?.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !p.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !(p.nmiTransactionId || p.transactionId || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    }
  );

  const columns = [
    {
      key: "date",
      header: "Date",
      render: (p: PurchaseRow) => (
        <span className="text-[13px] text-[var(--muted)]">
          {formatDate(p._creationTime)}
        </span>
      ),
    },
    {
      key: "customer",
      header: "Customer",
      render: (p: PurchaseRow) => (
        <div>
          <p className="font-medium text-[var(--foreground)] text-[14px]">
            {p.customerName || "—"}
          </p>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            {p.customerEmail || "—"}
          </p>
        </div>
      ),
    },
    {
      key: "product",
      header: "Product",
      render: (p: PurchaseRow) => (
        <span className="text-[14px] text-[var(--foreground)]">
          {p.product?.name || "Unknown"}
        </span>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      render: (p: PurchaseRow) => (
        <span className="text-[var(--foreground)] font-medium text-[14px]">
          {formatPrice(p.amount, p.currency)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (p: PurchaseRow) => (
        <AdminBadge variant={statusConfig[p.status].variant}>
          {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
        </AdminBadge>
      ),
    },
    {
      key: "txn",
      header: "Transaction ID",
      render: (p: PurchaseRow) => (
        <span className="text-[12px] font-mono text-[var(--muted)]">
          {p.nmiTransactionId || p.transactionId || "—"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (p: PurchaseRow) => (
        <Link
          href={`/admin/payments/${p._id}`}
          className="text-[var(--accent)] hover:text-[var(--accent-hover)] text-sm"
          onClick={(e) => e.stopPropagation()}
        >
          View
        </Link>
      ),
    },
  ];

  return (
    <div>
      <AdminHeader
        title="Payments"
        description="View and manage all transactions"
      />

      <div className="p-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by email, name, or transaction ID..."
            className="flex-1 px-4 py-2.5 text-[14px] bg-[var(--surface)] border border-[var(--border)] rounded-[5px] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 text-[14px] bg-[var(--surface)] border border-[var(--border)] rounded-[5px] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        <AdminTable
          columns={columns}
          data={filteredPurchases ?? []}
          keyExtractor={(p) => p._id}
          onRowClick={(p) => {
            window.location.href = `/admin/payments/${p._id}`;
          }}
          isLoading={purchases === undefined}
          emptyState={
            <div className="text-center py-12">
              <h3 className="text-sm font-medium text-[var(--foreground)]">
                No payments yet
              </h3>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Payments will appear here once customers complete purchases.
              </p>
            </div>
          }
        />
      </div>
    </div>
  );
}
