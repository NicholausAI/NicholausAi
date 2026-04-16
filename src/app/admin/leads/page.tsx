"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { format } from "date-fns";
import { AdminHeader } from "@/components/admin/layout";
import { AdminButton, AdminTable, AdminBadge } from "@/components/admin/ui";

interface LeadMagnetRow {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  fileUrl?: string;
  formFields: unknown[];
  thankYouMsg?: string;
  redirectUrl?: string;
  _creationTime: number;
}

export default function LeadsPage() {
  const leadMagnets = useQuery(api.leadMagnets.list);
  const allSubmissions = useQuery(api.leadMagnets.listSubmissions, {});

  const submissionCounts: Record<string, number> = {};
  if (allSubmissions) {
    for (const sub of allSubmissions) {
      const id = (sub as { leadMagnetId: string }).leadMagnetId;
      submissionCounts[id] = (submissionCounts[id] || 0) + 1;
    }
  }

  const columns = [
    {
      key: "name",
      header: "Name",
      render: (lm: LeadMagnetRow) => (
        <div>
          <p className="font-medium text-[var(--foreground)]">{lm.name}</p>
          <p className="text-xs text-[var(--muted)] mt-0.5">/{lm.slug}</p>
        </div>
      ),
    },
    {
      key: "fields",
      header: "Form Fields",
      render: (lm: LeadMagnetRow) => (
        <span className="text-[var(--foreground)]">
          {Array.isArray(lm.formFields) ? lm.formFields.length : 0}
        </span>
      ),
    },
    {
      key: "submissions",
      header: "Submissions",
      render: (lm: LeadMagnetRow) => {
        const count = submissionCounts[lm._id] || 0;
        return (
          <AdminBadge variant={count > 0 ? "success" : "default"}>
            {count}
          </AdminBadge>
        );
      },
    },
    {
      key: "created",
      header: "Created",
      render: (lm: LeadMagnetRow) => (
        <span className="text-sm text-[var(--muted)]">
          {format(new Date(lm._creationTime), "MMM d, yyyy")}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (lm: LeadMagnetRow) => (
        <Link
          href={`/admin/leads/${lm._id}`}
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
        title="Lead Magnets"
        description="Manage your lead magnets and capture forms"
        actions={
          <Link href="/admin/leads/new">
            <AdminButton
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              }
            >
              New Lead Magnet
            </AdminButton>
          </Link>
        }
      />

      <div className="p-6">
        <AdminTable
          columns={columns}
          data={(leadMagnets as LeadMagnetRow[] | undefined) ?? []}
          keyExtractor={(lm) => lm._id}
          onRowClick={(lm) => {
            window.location.href = `/admin/leads/${lm._id}`;
          }}
          isLoading={leadMagnets === undefined}
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-4 text-sm font-medium text-[var(--foreground)]">
                No lead magnets yet
              </h3>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Create your first lead magnet to start capturing leads.
              </p>
              <div className="mt-6">
                <Link href="/admin/leads/new">
                  <AdminButton>Create Lead Magnet</AdminButton>
                </Link>
              </div>
            </div>
          }
        />

        {leadMagnets && leadMagnets.length > 0 && (
          <div className="mt-6">
            <Link
              href="/admin/leads/submissions"
              className="inline-flex items-center gap-2 text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              View All Submissions
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
