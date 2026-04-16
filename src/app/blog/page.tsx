import { Metadata } from "next";
import { Header, Footer } from "@/components/layout";
import { Container } from "@/components/ui";
import { BlogHero, PostCard } from "@/components/blog";
import { getPosts } from "@/lib/strapi";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Insights on coding, trading, and building in the digital age. AI systems, automation, and growth strategies for service businesses.",
};

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <BlogHero />

      <main className="flex-1 py-20">
        <Container size="md">

          <div className="divide-y divide-[var(--border)]">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                title={post.title}
                excerpt={post.excerpt}
                slug={post.slug}
                publishedAt={post.publishedAt}
              />
            ))}
          </div>

          {posts.length === 0 && (
            <div className="text-center py-16 bg-[var(--surface)] rounded-xl border border-[var(--border)]">
              <div className="w-12 h-12 rounded-xl bg-[var(--accent-glow)] border border-[var(--accent)]/20 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-[var(--accent)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
              </div>
              <p className="text-[var(--muted)]">
                No posts yet. Check back soon!
              </p>
            </div>
          )}
        </Container>
      </main>

      <Footer />
    </div>
  );
}
