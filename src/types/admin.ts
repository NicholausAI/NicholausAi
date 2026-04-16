export interface AdminUser {
  id: string;
  email: string;
  name: string;
}

export interface Post {
  id: number;
  documentId?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  blockContent?: Record<string, unknown>;
  status: "draft" | "published" | "archived";
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface Newsletter {
  id: number;
  documentId?: string;
  title: string;
  subject: string;
  content: Record<string, unknown>;
  status: "draft" | "scheduled" | "sending" | "sent";
  scheduledAt: string | null;
  sentAt: string | null;
  recipientCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Resource {
  id: number;
  documentId?: string;
  name: string;
  description: string;
  url: string;
  category: string;
  featured: boolean;
  affiliateLink: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Subscriber {
  id: string;
  email: string;
  createdAt: string;
  unsubscribed: boolean;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  heroHeadline: string;
  heroSubtext: string;
  socialLinks?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
  subscriberCount?: number;
}

export interface AnalyticsStats {
  pageviews: number;
  visitors: number;
  bounceRate: number;
  avgVisitDuration: number;
}

export interface PageViewData {
  date: string;
  pageviews: number;
  visitors: number;
}

export interface TopPage {
  path: string;
  title: string;
  views: number;
}

export interface Referrer {
  source: string;
  visitors: number;
}
