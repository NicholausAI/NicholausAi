"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { AdminHeader } from "@/components/admin/layout";
import { AdminButton, AdminTable, AdminBadge } from "@/components/admin/ui";

interface ProductRow {
  _id: string;
  name: string;
  slug: string;
  type: "course" | "audit" | "template" | "ebook" | "consultation";
  price: number;
  currency: string;
  published: boolean;
  _creationTime: number;
}

const typeConfig: Record<
  ProductRow["type"],
  { label: string; variant: "info" | "success" | "warning" | "danger" | "default" }
> = {
  course: { label: "Course", variant: "info" },
  audit: { label: "Audit", variant: "warning" },
  template: { label: "Template", variant: "success" },
  ebook: { label: "eBook", variant: "default" },
  consultation: { label: "Consultation", variant: "danger" },
};

function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(price);
}

export default function ProductsPage() {
  const products = useQuery(api.products.list, {});

  const columns = [
    {
      key: "name",
      header: "Name",
      render: (product: ProductRow) => (
        <div>
          <p className="font-medium text-[var(--foreground)]">{product.name}</p>
          <p className="text-xs text-[var(--muted)] mt-0.5">/{product.slug}</p>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (product: ProductRow) => {
        const config = typeConfig[product.type];
        return (
          <AdminBadge variant={config.variant}>{config.label}</AdminBadge>
        );
      },
    },
    {
      key: "price",
      header: "Price",
      render: (product: ProductRow) => (
        <span className="text-[var(--foreground)] font-medium">
          {formatPrice(product.price, product.currency)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (product: ProductRow) => (
        <AdminBadge variant={product.published ? "success" : "default"}>
          {product.published ? "Published" : "Draft"}
        </AdminBadge>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (product: ProductRow) => (
        <Link
          href={`/admin/products/${product._id}`}
          className="text-[var(--accent)] hover:text-[var(--accent-hover)] text-sm"
          onClick={(e) => e.stopPropagation()}
        >
          Edit
        </Link>
      ),
    },
  ];

  return (
    <div>
      <AdminHeader
        title="Products"
        description="Manage your digital products"
        actions={
          <Link href="/admin/products/new">
            <AdminButton
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              }
            >
              New Product
            </AdminButton>
          </Link>
        }
      />

      <div className="p-6">
        <AdminTable
          columns={columns}
          data={(products as ProductRow[] | undefined) ?? []}
          keyExtractor={(product) => product._id}
          onRowClick={(product) => {
            window.location.href = `/admin/products/${product._id}`;
          }}
          isLoading={products === undefined}
          emptyState={
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-[var(--muted)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <h3 className="mt-4 text-sm font-medium text-[var(--foreground)]">
                No products yet
              </h3>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Get started by creating your first product.
              </p>
              <div className="mt-6">
                <Link href="/admin/products/new">
                  <AdminButton>Create Product</AdminButton>
                </Link>
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
}
