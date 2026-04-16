import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getByName = query({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("navigationMenus")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .first();
  },
});

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("navigationMenus").collect();
  },
});

export const upsert = mutation({
  args: {
    name: v.string(),
    items: v.any(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("navigationMenus")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { items: args.items });
      return existing._id;
    }

    return await ctx.db.insert("navigationMenus", args);
  },
});
