"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { AdminHeader } from "@/components/admin/layout";
import { AdminTable, AdminBadge, AdminCard } from "@/components/admin/ui";

interface Subscriber {
  id: string;
  email: string;
  created_at: string;
  unsubscribed: boolean;
}

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, active: 0, unsubscribed: 0 });

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const response = await fetch("/api/admin/subscribers");
        if (response.ok) {
          const data = await response.json();
          setSubscribers(data.subscribers || []);
          setStats({
            total: data.subscribers?.length || 0,
            active: data.subscribers?.filter((s: Subscriber) => !s.unsubscribed).length || 0,
            unsubscribed: data.subscribers?.filter((s: Subscriber) => s.unsubscribed).length || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching subscribers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscribers();
  }, []);

  const columns = [
    {
      key: "email",
      header: "Email",
      render: (subscriber: Subscriber) => (
        <span className="font-medium text-[var(--foreground)]">{subscriber.email}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (subscriber: Subscriber) => (
        <AdminBadge variant={subscriber.unsubscribed ? "default" : "success"}>
          {subscriber.unsubscribed ? "Unsubscribed" : "Active"}
        </AdminBadge>
      ),
    },
    {
      key: "created_at",
      header: "Subscribed",
      render: (subscriber: Subscriber) => (
        <span className="text-[var(--muted)]">
          {format(new Date(subscriber.created_at), "MMM d, yyyy")}
        </span>
      ),
    },
  ];

  return (
    <div>
      <AdminHeader
        title="Subscribers"
        description="Manage your email subscribers"
      />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AdminCard>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-[var(--accent)]/10">
                <svg className="w-6 h-6 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--foreground)]">{stats.total}</p>
                <p className="text-sm text-[var(--muted)]">Total Subscribers</p>
              </div>
            </div>
          </AdminCard>
          <AdminCard>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-500/10">
                <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--foreground)]">{stats.active}</p>
                <p className="text-sm text-[var(--muted)]">Active</p>
              </div>
            </div>
          </AdminCard>
          <AdminCard>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-red-500/10">
                <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--foreground)]">{stats.unsubscribed}</p>
                <p className="text-sm text-[var(--muted)]">Unsubscribed</p>
              </div>
            </div>
          </AdminCard>
        </div>

        {/* Subscribers Table */}
        <AdminTable
          columns={columns}
          data={subscribers}
          keyExtractor={(subscriber) => subscriber.id}
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <h3 className="mt-4 text-sm font-medium text-[var(--foreground)]">
                No subscribers yet
              </h3>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Subscribers will appear here when people sign up for your newsletter.
              </p>
              <p className="mt-4 text-xs text-[var(--muted)]">
                Make sure RESEND_API_KEY and RESEND_AUDIENCE_ID are configured in .env.local
              </p>
            </div>
          }
        />
      </div>
    </div>
  );
}
