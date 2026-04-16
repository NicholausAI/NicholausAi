import type { Post, Newsletter, Resource, SiteSettings } from "@/types/admin";
import { convex } from "./convex";
import { api } from "../../convex/_generated/api";

// Posts
export async function getAdminPosts(): Promise<Post[]> {
  const posts = await convex.query(api.posts.list, {});
  return posts.map((p) => ({
    id: p._id as unknown as number,
    documentId: p._id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt ?? "",
    content: p.content,
    blockContent: p.blockContent,
    status: p.published ? ("published" as const) : ("draft" as const),
    publishedAt: p.publishedAt ? new Date(p.publishedAt).toISOString() : null,
    seoTitle: p.seoTitle,
    seoDescription: p.seoDescription,
    createdAt: new Date(p._creationTime).toISOString(),
    updatedAt: new Date(p._creationTime).toISOString(),
  }));
}

export async function getAdminPost(id: string): Promise<Post | null> {
  try {
    const p = await convex.query(api.posts.getById, { id: id as never });
    if (!p) return null;
    return {
      id: p._id as unknown as number,
      documentId: p._id,
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt ?? "",
      content: p.content,
      blockContent: p.blockContent,
      status: p.published ? ("published" as const) : ("draft" as const),
      publishedAt: p.publishedAt ? new Date(p.publishedAt).toISOString() : null,
      seoTitle: p.seoTitle,
      seoDescription: p.seoDescription,
      createdAt: new Date(p._creationTime).toISOString(),
      updatedAt: new Date(p._creationTime).toISOString(),
    };
  } catch {
    return null;
  }
}

export async function createPost(data: Partial<Post>): Promise<Post> {
  const id = await convex.mutation(api.posts.create, {
    title: data.title ?? "Untitled",
    slug: data.slug ?? `post-${Date.now()}`,
    content: data.content ?? "",
    blockContent: data.blockContent,
    excerpt: data.excerpt,
    published: !!data.publishedAt,
    publishedAt: data.publishedAt ? new Date(data.publishedAt).getTime() : undefined,
    seoTitle: data.seoTitle,
    seoDescription: data.seoDescription,
  });

  return {
    id: id as unknown as number,
    documentId: id,
    title: data.title ?? "Untitled",
    slug: data.slug ?? `post-${Date.now()}`,
    excerpt: data.excerpt ?? "",
    content: data.content ?? "",
    blockContent: data.blockContent,
    status: data.publishedAt ? "published" : "draft",
    publishedAt: data.publishedAt ?? null,
    seoTitle: data.seoTitle,
    seoDescription: data.seoDescription,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export async function updatePost(id: string, data: Partial<Post>): Promise<Post> {
  await convex.mutation(api.posts.update, {
    id: id as never,
    title: data.title,
    slug: data.slug,
    content: data.content,
    blockContent: data.blockContent,
    excerpt: data.excerpt,
    published: data.publishedAt !== undefined ? !!data.publishedAt : undefined,
    publishedAt: data.publishedAt ? new Date(data.publishedAt).getTime() : undefined,
    seoTitle: data.seoTitle,
    seoDescription: data.seoDescription,
  });

  const post = await getAdminPost(id);
  return post!;
}

export async function deletePost(id: string): Promise<void> {
  await convex.mutation(api.posts.remove, { id: id as never });
}

// Newsletters
export async function getNewsletters(): Promise<Newsletter[]> {
  const newsletters = await convex.query(api.newsletters.list, {});
  return newsletters.map((n) => ({
    id: n._id as unknown as number,
    documentId: n._id,
    title: n.title,
    subject: n.subject,
    content: n.content,
    status: n.status,
    scheduledAt: n.scheduledAt ? new Date(n.scheduledAt).toISOString() : null,
    sentAt: n.sentAt ? new Date(n.sentAt).toISOString() : null,
    recipientCount: n.recipientCount,
    createdAt: new Date(n._creationTime).toISOString(),
    updatedAt: new Date(n._creationTime).toISOString(),
  }));
}

export async function getNewsletter(id: string): Promise<Newsletter | null> {
  try {
    const n = await convex.query(api.newsletters.getById, { id: id as never });
    if (!n) return null;
    return {
      id: n._id as unknown as number,
      documentId: n._id,
      title: n.title,
      subject: n.subject,
      content: n.content,
      status: n.status,
      scheduledAt: n.scheduledAt ? new Date(n.scheduledAt).toISOString() : null,
      sentAt: n.sentAt ? new Date(n.sentAt).toISOString() : null,
      recipientCount: n.recipientCount,
      createdAt: new Date(n._creationTime).toISOString(),
      updatedAt: new Date(n._creationTime).toISOString(),
    };
  } catch {
    return null;
  }
}

export async function createNewsletter(data: Partial<Newsletter>): Promise<Newsletter> {
  const id = await convex.mutation(api.newsletters.create, {
    title: data.title ?? "Untitled",
    subject: data.subject ?? "",
    content: data.content ?? { type: "doc", content: [] },
  });

  return {
    id: id as unknown as number,
    documentId: id,
    title: data.title ?? "Untitled",
    subject: data.subject ?? "",
    content: data.content ?? { type: "doc", content: [] },
    status: "draft",
    scheduledAt: null,
    sentAt: null,
    recipientCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export async function updateNewsletter(id: string, data: Partial<Newsletter>): Promise<Newsletter> {
  await convex.mutation(api.newsletters.update, {
    id: id as never,
    title: data.title,
    subject: data.subject,
    content: data.content,
    status: data.status as "draft" | "scheduled" | "sending" | "sent" | undefined,
    scheduledAt: data.scheduledAt ? new Date(data.scheduledAt).getTime() : undefined,
    sentAt: data.sentAt ? new Date(data.sentAt).getTime() : undefined,
    recipientCount: data.recipientCount,
  });

  const newsletter = await getNewsletter(id);
  return newsletter!;
}

export async function deleteNewsletter(id: string): Promise<void> {
  await convex.mutation(api.newsletters.remove, { id: id as never });
}

// Resources
export async function getResources(): Promise<Resource[]> {
  const resources = await convex.query(api.resources.list, {});
  return resources.map((r) => ({
    id: r._id as unknown as number,
    documentId: r._id,
    name: r.name,
    description: r.description,
    url: r.url,
    category: r.category,
    featured: r.featured,
    affiliateLink: r.affiliateLink,
    order: r.order,
    createdAt: new Date(r._creationTime).toISOString(),
    updatedAt: new Date(r._creationTime).toISOString(),
  }));
}

export async function getResource(id: string): Promise<Resource | null> {
  try {
    const r = await convex.query(api.resources.getById, { id: id as never });
    if (!r) return null;
    return {
      id: r._id as unknown as number,
      documentId: r._id,
      name: r.name,
      description: r.description,
      url: r.url,
      category: r.category,
      featured: r.featured,
      affiliateLink: r.affiliateLink,
      order: r.order,
      createdAt: new Date(r._creationTime).toISOString(),
      updatedAt: new Date(r._creationTime).toISOString(),
    };
  } catch {
    return null;
  }
}

export async function createResource(data: Partial<Resource>): Promise<Resource> {
  const id = await convex.mutation(api.resources.create, {
    name: data.name ?? "Untitled",
    description: data.description ?? "",
    url: data.url ?? "",
    category: data.category ?? "General",
    featured: data.featured ?? false,
    affiliateLink: data.affiliateLink ?? false,
    order: data.order ?? 0,
  });

  return {
    id: id as unknown as number,
    documentId: id,
    name: data.name ?? "Untitled",
    description: data.description ?? "",
    url: data.url ?? "",
    category: data.category ?? "General",
    featured: data.featured ?? false,
    affiliateLink: data.affiliateLink ?? false,
    order: data.order ?? 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export async function updateResource(id: string, data: Partial<Resource>): Promise<Resource> {
  await convex.mutation(api.resources.update, {
    id: id as never,
    name: data.name,
    description: data.description,
    url: data.url,
    category: data.category,
    featured: data.featured,
    affiliateLink: data.affiliateLink,
    order: data.order,
  });

  const resource = await getResource(id);
  return resource!;
}

export async function deleteResource(id: string): Promise<void> {
  await convex.mutation(api.resources.remove, { id: id as never });
}

// Site Settings
export async function getSiteSettings(): Promise<SiteSettings> {
  const settings = await convex.query(api.settings.get, {});
  return {
    siteName: settings.siteName ?? "Nicholaus.ai",
    tagline: settings.tagline ?? "AI Agent Engineering",
    heroHeadline: settings.heroHeadline ?? "",
    heroSubtext: settings.heroSubtext ?? "",
    socialLinks: (settings as Record<string, unknown>).socialLinks as SiteSettings["socialLinks"],
  };
}

export async function updateSiteSettings(data: Partial<SiteSettings>): Promise<SiteSettings> {
  await convex.mutation(api.settings.upsert, {
    siteName: data.siteName,
    tagline: data.tagline,
    heroHeadline: data.heroHeadline,
    heroSubtext: data.heroSubtext,
    socialLinks: data.socialLinks,
  });

  return getSiteSettings();
}

// Stats
export async function getDashboardStats() {
  const [posts, newsletters] = await Promise.all([
    getAdminPosts(),
    getNewsletters(),
  ]);

  const publishedPosts = posts.filter((p) => p.status === "published").length;
  const draftPosts = posts.filter((p) => p.status === "draft").length;
  const sentNewsletters = newsletters.filter((n) => n.status === "sent").length;

  let subscriberCount = 0;
  try {
    subscriberCount = await convex.query(api.subscribers.count, {});
  } catch {
    // ignore
  }

  return {
    totalPosts: posts.length,
    publishedPosts,
    draftPosts,
    totalNewsletters: newsletters.length,
    sentNewsletters,
    subscribers: subscriberCount,
  };
}
