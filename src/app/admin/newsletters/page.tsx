"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { AdminHeader } from "@/components/admin/layout";
import { AdminButton, AdminTable, AdminBadge } from "@/components/admin/ui";
import type { Newsletter } from "@/types/admin";

export default function NewslettersPage() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNewsletters = async () => {
      try {
        const response = await fetch("/api/admin/newsletters");
        if (response.ok) {
          const data = await response.json();
          setNewsletters(data);
        }
      } catch (error) {
        console.error("Error fetching newsletters:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewsletters();
  }, []);

  const getStatusVariant = (status: Newsletter["status"]) => {
    switch (status) {
      case "sent":
        return "success";
      case "sending":
        return "warning";
      case "scheduled":
        return "info";
      default:
        return "default";
    }
  };

  const columns = [
    {
      key: "title",
      header: "Newsletter",
      render: (newsletter: Newsletter) => (
        <div>
          <p className="font-medium text-[var(--foreground)]">{newsletter.title}</p>
          <p className="text-xs text-[var(--muted)] mt-0.5">{newsletter.subject}</p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (newsletter: Newsletter) => (
        <AdminBadge variant={getStatusVariant(newsletter.status)}>
          {newsletter.status}
        </AdminBadge>
      ),
    },
    {
      key: "recipients",
      header: "Recipients",
      render: (newsletter: Newsletter) => (
        <span className="text-[var(--muted)]">
          {newsletter.recipientCount > 0 ? newsletter.recipientCount.toLocaleString() : "—"}
        </span>
      ),
    },
    {
      key: "date",
      header: "Date",
      render: (newsletter: Newsletter) => (
        <span className="text-[var(--muted)]">
          {newsletter.sentAt
            ? format(new Date(newsletter.sentAt), "MMM d, yyyy")
            : newsletter.scheduledAt
            ? `Scheduled: ${format(new Date(newsletter.scheduledAt), "MMM d, yyyy")}`
            : "Draft"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (newsletter: Newsletter) => (
        <Link
          href={`/admin/newsletters/${newsletter.id}`}
          className="text-[var(--accent)] hover:text-[var(--accent-hover)] text-sm"
        >
          {newsletter.status === "draft" ? "Edit" : "View"}
        </Link>
      ),
    },
  ];

  return (
    <div>
      <AdminHeader
        title="Newsletters"
        description="Create and manage email newsletters"
        actions={
          <Link href="/admin/newsletters/new">
            <AdminButton
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              }
            >
              New Newsletter
            </AdminButton>
          </Link>
        }
      />

      <div className="p-6">
        <AdminTable
          columns={columns}
          data={newsletters}
          keyExtractor={(newsletter) => newsletter.id}
          onRowClick={(newsletter) => {
            window.location.href = `/admin/newsletters/${newsletter.id}`;
          }}
          isLoading={isLoading}
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
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <h3 className="mt-4 text-sm font-medium text-[var(--foreground)]">
                No newsletters yet
              </h3>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Get started by creating your first newsletter.
              </p>
              <div className="mt-6">
                <Link href="/admin/newsletters/new">
                  <AdminButton>Create Newsletter</AdminButton>
                </Link>
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
}
