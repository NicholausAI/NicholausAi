"use client";

import { AdminHeader } from "@/components/admin/layout";
import { AdminCard } from "@/components/admin/ui";

export default function AnalyticsPage() {
  const umamiConfigured = !!process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

  return (
    <div>
      <AdminHeader
        title="Analytics"
        description="View your site analytics and performance"
      />

      <div className="p-6 space-y-6">
        {umamiConfigured ? (
          <div className="space-y-6">
            {/* Embed Umami dashboard or show stats */}
            <AdminCard>
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-[var(--accent)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-[var(--foreground)]">
                  Umami Analytics Connected
                </h3>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  View your full analytics dashboard on Umami Cloud.
                </p>
                <a
                  href={process.env.NEXT_PUBLIC_UMAMI_URL || "https://cloud.umami.is"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-6 px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-hover)] transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Open Umami Dashboard
                </a>
              </div>
            </AdminCard>

            {/* Quick Stats Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <AdminCard>
                <div className="text-center">
                  <p className="text-3xl font-bold text-[var(--foreground)]">—</p>
                  <p className="text-sm text-[var(--muted)] mt-1">Pageviews (Today)</p>
                </div>
              </AdminCard>
              <AdminCard>
                <div className="text-center">
                  <p className="text-3xl font-bold text-[var(--foreground)]">—</p>
                  <p className="text-sm text-[var(--muted)] mt-1">Unique Visitors</p>
                </div>
              </AdminCard>
              <AdminCard>
                <div className="text-center">
                  <p className="text-3xl font-bold text-[var(--foreground)]">—</p>
                  <p className="text-sm text-[var(--muted)] mt-1">Avg. Time on Site</p>
                </div>
              </AdminCard>
            </div>

            <p className="text-center text-sm text-[var(--muted)]">
              For detailed analytics, visit your Umami dashboard.
            </p>
          </div>
        ) : (
          <AdminCard>
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
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-[var(--foreground)]">
                Analytics Not Configured
              </h3>
              <p className="mt-2 text-sm text-[var(--muted)] max-w-md mx-auto">
                Set up Umami Analytics to track your site&apos;s performance. Umami is a privacy-focused,
                open-source alternative to Google Analytics.
              </p>

              <div className="mt-8 bg-[var(--surface-elevated)] rounded-lg p-4 text-left max-w-md mx-auto">
                <p className="text-sm font-medium text-[var(--foreground)] mb-2">
                  To enable analytics:
                </p>
                <ol className="text-sm text-[var(--muted)] space-y-2 list-decimal list-inside">
                  <li>Sign up for <a href="https://cloud.umami.is" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">Umami Cloud</a> (free tier available)</li>
                  <li>Create a website and get your Website ID</li>
                  <li>Add to your <code className="bg-[var(--surface)] px-1 rounded">.env.local</code>:</li>
                </ol>
                <pre className="mt-3 bg-[var(--surface)] p-3 rounded text-xs overflow-x-auto">
                  <code>{`NEXT_PUBLIC_UMAMI_WEBSITE_ID=your-id
NEXT_PUBLIC_UMAMI_URL=https://cloud.umami.is`}</code>
                </pre>
              </div>
            </div>
          </AdminCard>
        )}
      </div>
    </div>
  );
}
