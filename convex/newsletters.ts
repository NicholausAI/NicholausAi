import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("newsletters").order("desc").collect();
  },
});

export const getById = query({
  args: { id: v.id("newsletters") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    subject: v.string(),
    content: v.any(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("newsletters", {
      ...args,
      status: "draft",
      recipientCount: 0,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("newsletters"),
    title: v.optional(v.string()),
    subject: v.optional(v.string()),
    content: v.optional(v.any()),
    status: v.optional(
      v.union(
        v.literal("draft"),
        v.literal("scheduled"),
        v.literal("sending"),
        v.literal("sent")
      )
    ),
    scheduledAt: v.optional(v.number()),
    sentAt: v.optional(v.number()),
    recipientCount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Newsletter not found");

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
  args: { id: v.id("newsletters") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const markSent = mutation({
  args: {
    id: v.id("newsletters"),
    recipientCount: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: "sent",
      sentAt: Date.now(),
      recipientCount: args.recipientCount,
    });
  },
});
