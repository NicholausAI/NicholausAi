"use client";

import Link from "next/link";
import { format } from "date-fns";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { AdminHeader } from "@/components/admin/layout";
import { AdminButton, AdminTable, AdminBadge } from "@/components/admin/ui";

interface PostRow {
  _id: string;
  title: string;
  slug: string;
  published: boolean;
  publishedAt?: number;
  _creationTime: number;
}

export default function PostsPage() {
  const posts = useQuery(api.posts.list, {});

  const columns = [
    {
      key: "title",
      header: "Title",
      render: (post: PostRow) => (
        <div>
          <p className="font-medium text-[var(--foreground)]">{post.title}</p>
          <p className="text-xs text-[var(--muted)] mt-0.5">/{post.slug}</p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (post: PostRow) => (
        <AdminBadge variant={post.published ? "success" : "default"}>
          {post.published ? "published" : "draft"}
        </AdminBadge>
      ),
    },
    {
      key: "publishedAt",
      header: "Date",
      render: (post: PostRow) => (
        <span className="text-[var(--muted)]">
          {post.publishedAt
            ? format(new Date(post.publishedAt), "MMM d, yyyy")
            : "Draft"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (post: PostRow) => (
        <Link
          href={`/admin/posts/${post._id}`}
          className="text-[var(--accent)] hover:text-[var(--accent-hover)] text-sm"
        >
          Edit
        </Link>
      ),
    },
  ];

  return (
    <div>
      <AdminHeader
        title="Posts"
        description="Manage your blog posts"
        actions={
          <Link href="/admin/posts/new">
            <AdminButton
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              }
            >
              New Post
            </AdminButton>
          </Link>
        }
      />

      <div className="p-6">
        <AdminTable
          columns={columns}
          data={(posts as PostRow[] | undefined) ?? []}
          keyExtractor={(post) => post._id}
          onRowClick={(post) => {
            window.location.href = `/admin/posts/${post._id}`;
          }}
          isLoading={posts === undefined}
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
                No posts yet
              </h3>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Get started by creating your first post.
              </p>
              <div className="mt-6">
                <Link href="/admin/posts/new">
                  <AdminButton>Create Post</AdminButton>
                </Link>
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
}
