import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.category) {
      return await ctx.db
        .query("resources")
        .withIndex("by_category", (q) => q.eq("category", args.category!))
        .collect();
    }
    return await ctx.db
      .query("resources")
      .withIndex("by_order")
      .collect();
  },
});

export const getById = query({
  args: { id: v.id("resources") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    url: v.string(),
    category: v.string(),
    featured: v.boolean(),
    affiliateLink: v.boolean(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("resources", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("resources"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    url: v.optional(v.string()),
    category: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    affiliateLink: v.optional(v.boolean()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Resource not found");

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
  args: { id: v.id("resources") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
