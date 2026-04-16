import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("subscribers").order("desc").collect();
  },
});

export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("subscribers")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

export const subscribe = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("subscribers")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      if (existing.unsubscribed) {
        await ctx.db.patch(existing._id, { unsubscribed: false, name: args.name });
      }
      return existing._id;
    }

    return await ctx.db.insert("subscribers", {
      email: args.email,
      name: args.name,
      unsubscribed: false,
    });
  },
});

export const unsubscribe = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const subscriber = await ctx.db
      .query("subscribers")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (subscriber) {
      await ctx.db.patch(subscriber._id, { unsubscribed: true });
    }
  },
});

export const remove = mutation({
  args: { id: v.id("subscribers") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const count = query({
  handler: async (ctx) => {
    const subscribers = await ctx.db
      .query("subscribers")
      .withIndex("by_unsubscribed", (q) => q.eq("unsubscribed", false))
      .collect();
    return subscribers.length;
  },
});
