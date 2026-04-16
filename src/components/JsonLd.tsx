import type { Post } from "@/types";

interface WebsiteJsonLdProps {
  siteUrl: string;
}

export function WebsiteJsonLd({ siteUrl }: WebsiteJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Nicholaus.ai",
    description:
      "Join fellow cave dwellers for weekly insights on coding, trading, and building in the digital age.",
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/blog?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface ArticleJsonLdProps {
  post: Post;
  siteUrl: string;
}

export function ArticleJsonLd({ post, siteUrl }: ArticleJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    url: `${siteUrl}/blog/${post.slug}`,
    author: {
      "@type": "Person",
      name: post.author?.name || "Nicholaus.ai",
    },
    publisher: {
      "@type": "Organization",
      name: "Nicholaus.ai",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog/${post.slug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface PersonJsonLdProps {
  name: string;
  siteUrl: string;
}

export function PersonJsonLd({ name, siteUrl }: PersonJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    url: siteUrl,
    sameAs: [
      // Add social profiles here
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
