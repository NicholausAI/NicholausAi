"use client";

import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { AdminHeader } from "@/components/admin/layout";
import {
  AdminButton,
  AdminCard,
  AdminTable,
  AdminBadge,
  AdminModal,
} from "@/components/admin/ui";

interface Submission {
  _id: Id<"leadSubmissions">;
  leadMagnetId: Id<"leadMagnets">;
  data: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  _creationTime: number;
}

interface LeadMagnet {
  _id: Id<"leadMagnets">;
  title: string;
}

export default function LeadSubmissionsPage() {
  const [selectedLeadMagnetId, setSelectedLeadMagnetId] = useState<
    Id<"leadMagnets"> | undefined
  >(undefined);
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);

  const leadMagnets = useQuery(api.leadMagnets.list) as
    | LeadMagnet[]
    | undefined;
  const submissions = useQuery(api.leadMagnets.listSubmissions, {
    leadMagnetId: selectedLeadMagnetId,
  }) as Submission[] | undefined;

  const isLoading = submissions === undefined;

  const leadMagnetMap = useMemo(() => {
    const map = new Map<string, string>();
    if (leadMagnets) {
      for (const lm of leadMagnets) {
        map.set(lm._id, lm.title);
      }
    }
    return map;
  }, [leadMagnets]);

  const handleExportCSV = () => {
    if (!submissions || submissions.length === 0) {
      toast.error("No submissions to export");
      return;
    }

    const dataKeys = new Set<string>();
    for (const sub of submissions) {
      if (sub.data && typeof sub.data === "object") {
        Object.keys(sub.data).forEach((key) => dataKeys.add(key));
      }
    }

    const headers = [
      "Date",
      "Lead Magnet",
      ...Array.from(dataKeys),
      "UTM Source",
      "UTM Medium",
      "UTM Campaign",
      "IP Address",
      "User Agent",
    ];

    const escapeCSV = (value: unknown): string => {
      const str = value == null ? "" : String(value);
      if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const rows = submissions.map((sub) => {
      const row = [
        format(new Date(sub._creationTime), "yyyy-MM-dd HH:mm:ss"),
        leadMagnetMap.get(sub.leadMagnetId) || "Unknown",
        ...Array.from(dataKeys).map((key) => sub.data?.[key] ?? ""),
        sub.utmSource || "",
        sub.utmMedium || "",
        sub.utmCampaign || "",
        sub.ipAddress || "",
        sub.userAgent || "",
      ];
      return row.map(escapeCSV).join(",");
    });

    const csv = [headers.map(escapeCSV).join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `lead-submissions-${format(new Date(), "yyyy-MM-dd")}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Exported ${submissions.length} submissions`);
  };

  const columns = [
    {
      key: "date",
      header: "Date",
      render: (sub: Submission) => (
        <span className="text-[var(--muted)]">
          {format(new Date(sub._creationTime), "MMM d, yyyy h:mm a")}
        </span>
      ),
    },
    {
      key: "leadMagnet",
      header: "Lead Magnet",
      render: (sub: Submission) => (
        <span className="font-medium text-[var(--foreground)]">
          {leadMagnetMap.get(sub.leadMagnetId) || "Unknown"}
        </span>
      ),
    },
    {
      key: "email",
      header: "Email",
      render: (sub: Submission) => (
        <span className="text-[var(--foreground)]">
          {sub.data?.email ? String(sub.data.email) : "\u2014"}
        </span>
      ),
    },
    {
      key: "name",
      header: "Name",
      render: (sub: Submission) => (
        <span className="text-[var(--foreground)]">
          {sub.data?.name ? String(sub.data.name) : "\u2014"}
        </span>
      ),
    },
    {
      key: "utmSource",
      header: "UTM Source",
      render: (sub: Submission) =>
        sub.utmSource ? (
          <AdminBadge variant="default">{sub.utmSource}</AdminBadge>
        ) : (
          <span className="text-[var(--muted)]">{"\u2014"}</span>
        ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (sub: Submission) => (
        <AdminButton
          variant="ghost"
          size="sm"
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            setSelectedSubmission(sub);
          }}
        >
          View
        </AdminButton>
      ),
    },
  ];

  return (
    <div>
      <AdminHeader
        title="Submissions"
        actions={
          <AdminButton onClick={handleExportCSV} variant="secondary" size="sm">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Export CSV
          </AdminButton>
        }
      />

      <div className="p-6 space-y-6">
        {/* Filter Bar */}
        <AdminCard>
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-[var(--foreground)]">
              Lead Magnet
            </label>
            <select
              value={selectedLeadMagnetId || ""}
              onChange={(e) =>
                setSelectedLeadMagnetId(
                  e.target.value
                    ? (e.target.value as Id<"leadMagnets">)
                    : undefined
                )
              }
              className="px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all"
            >
              <option value="">All Lead Magnets</option>
              {leadMagnets?.map((lm) => (
                <option key={lm._id} value={lm._id}>
                  {lm.title}
                </option>
              ))}
            </select>
            {submissions && (
              <span className="text-sm text-[var(--muted)] ml-auto">
                {submissions.length} submission
                {submissions.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </AdminCard>

        {/* Submissions Table */}
        <AdminTable
          columns={columns}
          data={submissions || []}
          keyExtractor={(sub) => sub._id}
          onRowClick={(sub) => setSelectedSubmission(sub)}
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-4 text-sm font-medium text-[var(--foreground)]">
                No submissions yet
              </h3>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Submissions will appear here when leads fill out your forms.
              </p>
            </div>
          }
        />
      </div>

      {/* Detail Modal */}
      <AdminModal
        isOpen={!!selectedSubmission}
        onClose={() => setSelectedSubmission(null)}
        title="Submission Details"
        description={
          selectedSubmission
            ? `Submitted ${format(new Date(selectedSubmission._creationTime), "MMMM d, yyyy 'at' h:mm a")}`
            : undefined
        }
        size="lg"
      >
        {selectedSubmission && (
          <div className="space-y-6">
            {/* Form Data */}
            <div>
              <h3 className="text-sm font-medium text-[var(--muted)] uppercase tracking-wider mb-3">
                Form Data
              </h3>
              <div className="space-y-2">
                {Object.entries(selectedSubmission.data || {}).map(
                  ([key, value]) => (
                    <div
                      key={key}
                      className="flex items-start gap-4 py-2 border-b border-[var(--border)] last:border-0"
                    >
                      <span className="text-sm font-medium text-[var(--muted)] min-w-[120px] capitalize">
                        {key.replace(/([A-Z])/g, " $1").replace(/_/g, " ")}
                      </span>
                      <span className="text-sm text-[var(--foreground)] break-all">
                        {String(value ?? "")}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* UTM Data */}
            {(selectedSubmission.utmSource ||
              selectedSubmission.utmMedium ||
              selectedSubmission.utmCampaign) && (
              <div>
                <h3 className="text-sm font-medium text-[var(--muted)] uppercase tracking-wider mb-3">
                  UTM Parameters
                </h3>
                <div className="space-y-2">
                  {selectedSubmission.utmSource && (
                    <div className="flex items-center gap-4 py-2 border-b border-[var(--border)] last:border-0">
                      <span className="text-sm font-medium text-[var(--muted)] min-w-[120px]">
                        Source
                      </span>
                      <AdminBadge variant="default">
                        {selectedSubmission.utmSource}
                      </AdminBadge>
                    </div>
                  )}
                  {selectedSubmission.utmMedium && (
                    <div className="flex items-center gap-4 py-2 border-b border-[var(--border)] last:border-0">
                      <span className="text-sm font-medium text-[var(--muted)] min-w-[120px]">
                        Medium
                      </span>
                      <AdminBadge variant="default">
                        {selectedSubmission.utmMedium}
                      </AdminBadge>
                    </div>
                  )}
                  {selectedSubmission.utmCampaign && (
                    <div className="flex items-center gap-4 py-2 border-b border-[var(--border)] last:border-0">
                      <span className="text-sm font-medium text-[var(--muted)] min-w-[120px]">
                        Campaign
                      </span>
                      <AdminBadge variant="default">
                        {selectedSubmission.utmCampaign}
                      </AdminBadge>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Technical Data */}
            {(selectedSubmission.ipAddress ||
              selectedSubmission.userAgent) && (
              <div>
                <h3 className="text-sm font-medium text-[var(--muted)] uppercase tracking-wider mb-3">
                  Technical Info
                </h3>
                <div className="space-y-2">
                  {selectedSubmission.ipAddress && (
                    <div className="flex items-start gap-4 py-2 border-b border-[var(--border)] last:border-0">
                      <span className="text-sm font-medium text-[var(--muted)] min-w-[120px]">
                        IP Address
                      </span>
                      <span className="text-sm text-[var(--foreground)] font-mono">
                        {selectedSubmission.ipAddress}
                      </span>
                    </div>
                  )}
                  {selectedSubmission.userAgent && (
                    <div className="flex items-start gap-4 py-2 border-b border-[var(--border)] last:border-0">
                      <span className="text-sm font-medium text-[var(--muted)] min-w-[120px]">
                        User Agent
                      </span>
                      <span className="text-sm text-[var(--foreground)] font-mono break-all text-xs">
                        {selectedSubmission.userAgent}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Lead Magnet */}
            <div>
              <h3 className="text-sm font-medium text-[var(--muted)] uppercase tracking-wider mb-3">
                Lead Magnet
              </h3>
              <span className="text-sm text-[var(--foreground)]">
                {leadMagnetMap.get(selectedSubmission.leadMagnetId) || "Unknown"}
              </span>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
}
