import type { Post, SiteSettings } from "@/types";
import { convex } from "./convex";
import { api } from "../../convex/_generated/api";

export async function getPosts(): Promise<Post[]> {
  const posts = await convex.query(api.posts.listPublished, {});
  return posts.map((p) => ({
    id: p._id as unknown as number,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt ?? "",
    content: p.content,
    coverImage: p.coverImageUrl,
    publishedAt: p.publishedAt
      ? new Date(p.publishedAt).toISOString()
      : new Date(p._creationTime).toISOString(),
  }));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const p = await convex.query(api.posts.getBySlug, { slug });
  if (!p || !p.published) return null;

  return {
    id: p._id as unknown as number,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt ?? "",
    content: p.content,
    coverImage: p.coverImageUrl,
    publishedAt: p.publishedAt
      ? new Date(p.publishedAt).toISOString()
      : new Date(p._creationTime).toISOString(),
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const settings = await convex.query(api.settings.get, {});
  return {
    siteName: settings.siteName ?? "Nicholaus.ai",
    tagline: settings.tagline ?? "AI Agent Engineering",
    heroHeadline: settings.heroHeadline ?? "",
    heroSubtext: settings.heroSubtext ?? "",
  };
}
