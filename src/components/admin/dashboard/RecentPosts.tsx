import Link from "next/link";
import { format } from "date-fns";
import { AdminBadge } from "../ui";

interface Post {
  id: number;
  title: string;
  status: "draft" | "published" | "archived";
  publishedAt: string | null;
  updatedAt: string;
}

interface RecentPostsProps {
  posts: Post[];
}

export function RecentPosts({ posts }: RecentPostsProps) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl">
      <div className="p-6 border-b border-[var(--border)]">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[var(--foreground)]">
            Recent Posts
          </h3>
          <Link
            href="/admin/posts"
            className="text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
          >
            View all
          </Link>
        </div>
      </div>
      <div className="divide-y divide-[var(--border)]">
        {posts.length === 0 ? (
          <div className="p-6 text-center text-[var(--muted)]">
            No posts yet. Create your first post!
          </div>
        ) : (
          posts.map((post) => (
            <Link
              key={post.id}
              href={`/admin/posts/${post.id}`}
              className="flex items-center justify-between p-4 hover:bg-[var(--surface-elevated)] transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--foreground)] truncate">
                  {post.title}
                </p>
                <p className="text-xs text-[var(--muted)] mt-1">
                  {format(
                    new Date(post.publishedAt || post.updatedAt),
                    "MMM d, yyyy"
                  )}
                </p>
              </div>
              <AdminBadge
                variant={post.status === "published" ? "success" : "default"}
              >
                {post.status}
              </AdminBadge>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
