import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("tags").order("asc").collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("tags")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    if (existing) throw new Error("Tag with this slug already exists");
    return await ctx.db.insert("tags", args);
  },
});

export const remove = mutation({
  args: { id: v.id("tags") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
