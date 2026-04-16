import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header, Footer } from "@/components/layout";
import { Container } from "@/components/ui";
import { PostHero } from "@/components/blog/PostHero";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { SidebarOptin } from "@/components/blog/SidebarOptin";
import { SocialShare } from "@/components/blog/SocialShare";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { ArticleJsonLd } from "@/components/JsonLd";
import { getPostBySlug, getPosts } from "@/lib/strapi";
import { extractHeadings, markdownToHtml } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `${siteUrl}/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      url: `${siteUrl}/blog/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const headings = extractHeadings(post.content);
  const htmlContent = markdownToHtml(post.content);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const postUrl = `${siteUrl}/blog/${slug}`;

  return (
    <>
      <ArticleJsonLd post={post} siteUrl={siteUrl} />

      <div className="min-h-screen flex flex-col">
        <ReadingProgress />
        <Header />

        <main className="flex-1">
          <PostHero title={post.title} publishedAt={post.publishedAt} />

          <Container size="xl">
            <div className="py-8 lg:py-10">
              {/* Three-column layout */}
              <div className="lg:grid lg:grid-cols-[200px_1fr_280px] lg:gap-12">
                {/* Left sidebar - Table of Contents */}
                <aside className="hidden lg:block">
                  <TableOfContents items={headings} />
                </aside>

                {/* Main content */}
                <article className="prose max-w-none lg:max-w-2xl mx-auto">
                  <div
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                    className="prose-headings:scroll-mt-24"
                  />

                  <hr className="my-12 border-[var(--border)]" />

                  <div className="flex justify-center">
                    <SocialShare url={postUrl} title={post.title} />
                  </div>
                </article>

                {/* Right sidebar - Email optin */}
                <aside className="hidden lg:block">
                  <SidebarOptin />
                </aside>
              </div>
            </div>
          </Container>
        </main>

        <Footer />
      </div>
    </>
  );
}
