import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {
    published: v.optional(v.boolean()),
    type: v.optional(
      v.union(
        v.literal("course"),
        v.literal("audit"),
        v.literal("template"),
        v.literal("ebook"),
        v.literal("consultation")
      )
    ),
  },
  handler: async (ctx, args) => {
    if (args.type) {
      return await ctx.db
        .query("products")
        .withIndex("by_type", (q) => q.eq("type", args.type!))
        .collect();
    }
    if (args.published !== undefined) {
      return await ctx.db
        .query("products")
        .withIndex("by_published", (q) => q.eq("published", args.published!))
        .collect();
    }
    return await ctx.db.query("products").order("desc").collect();
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

export const getById = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    content: v.optional(v.any()),
    type: v.union(
      v.literal("course"),
      v.literal("audit"),
      v.literal("template"),
      v.literal("ebook"),
      v.literal("consultation")
    ),
    price: v.number(),
    currency: v.string(),
    coverImageUrl: v.optional(v.string()),
    published: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("products", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("products"),
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
    description: v.optional(v.string()),
    content: v.optional(v.any()),
    type: v.optional(
      v.union(
        v.literal("course"),
        v.literal("audit"),
        v.literal("template"),
        v.literal("ebook"),
        v.literal("consultation")
      )
    ),
    price: v.optional(v.number()),
    currency: v.optional(v.string()),
    coverImageUrl: v.optional(v.string()),
    published: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Product not found");

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
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
