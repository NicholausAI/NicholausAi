import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {
    published: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    if (args.published !== undefined) {
      const posts = await ctx.db
        .query("posts")
        .withIndex("by_published", (q) => q.eq("published", args.published!))
        .order("desc")
        .collect();
      return posts;
    }
    const posts = await ctx.db.query("posts").order("desc").collect();
    return posts;
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("posts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

export const getById = query({
  args: { id: v.id("posts") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    blockContent: v.optional(v.any()),
    excerpt: v.optional(v.string()),
    coverImageUrl: v.optional(v.string()),
    published: v.boolean(),
    publishedAt: v.optional(v.number()),
    categoryIds: v.optional(v.array(v.id("categories"))),
    tagIds: v.optional(v.array(v.id("tags"))),
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("posts", {
      ...args,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("posts"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    content: v.optional(v.string()),
    blockContent: v.optional(v.any()),
    excerpt: v.optional(v.string()),
    coverImageUrl: v.optional(v.string()),
    published: v.optional(v.boolean()),
    publishedAt: v.optional(v.number()),
    categoryIds: v.optional(v.array(v.id("categories"))),
    tagIds: v.optional(v.array(v.id("tags"))),
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Post not found");

    const updates: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) {
        updates[key] = value;
      }
    }

    await ctx.db.patch(id, updates);
    return await ctx.db.get(id);
  },
});

export const remove = mutation({
  args: { id: v.id("posts") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const listPublished = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("posts")
      .withIndex("by_published", (q) => q.eq("published", true))
      .order("desc")
      .collect();
  },
});
