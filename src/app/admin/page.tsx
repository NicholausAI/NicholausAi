"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { AdminHeader } from "@/components/admin/layout";
import { StatsCard, RecentPosts, QuickActions } from "@/components/admin/dashboard";

export default function AdminDashboard() {
  const posts = useQuery(api.posts.list, {});
  const newsletters = useQuery(api.newsletters.list);
  const subscriberCount = useQuery(api.subscribers.count);

  const isLoading = posts === undefined || newsletters === undefined;

  const publishedPosts = posts?.filter((p) => p.published).length ?? 0;
  const sentNewsletters = newsletters?.filter((n) => n.status === "sent").length ?? 0;

  const recentPosts = (posts ?? []).slice(0, 5).map((post) => ({
    id: post._id as unknown as number,
    title: post.title,
    status: (post.published ? "published" : "draft") as "draft" | "published" | "archived",
    publishedAt: post.publishedAt ? new Date(post.publishedAt).toISOString() : null,
    updatedAt: new Date(post._creationTime).toISOString(),
  }));

  return (
    <div>
      <AdminHeader
        title="Dashboard"
        description="Welcome back to Nicholaus.ai admin"
      />

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Posts"
            value={isLoading ? "..." : (posts?.length ?? 0)}
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          />
          <StatsCard
            title="Published"
            value={isLoading ? "..." : publishedPosts}
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
              </svg>
            }
          />
          <StatsCard
            title="Newsletters Sent"
            value={isLoading ? "..." : sentNewsletters}
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
          />
          <StatsCard
            title="Subscribers"
            value={isLoading ? "..." : (subscriberCount ?? "—")}
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentPosts posts={recentPosts} />
          </div>
          <div>
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  );
}
