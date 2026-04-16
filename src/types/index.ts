export interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  publishedAt: string;
  author?: Author;
  seo?: SEO;
}

export interface Author {
  id: number;
  name: string;
  bio?: string;
  avatar?: string;
}

export interface SEO {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  heroHeadline: string;
  heroSubtext: string;
  subscriberCount?: number;
}

export interface TableOfContentsItem {
  id: string;
  text: string;
  level: number;
}
