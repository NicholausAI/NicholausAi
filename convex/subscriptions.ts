import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  handler: async (ctx) => {
    const subs = await ctx.db.query("subscriptions").order("desc").collect();
    return await Promise.all(
      subs.map(async (sub) => {
        const product = await ctx.db.get(sub.productId);
        return { ...sub, product };
      })
    );
  },
});

export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const subs = await ctx.db
      .query("subscriptions")
      .withIndex("by_email", (q) => q.eq("customerEmail", args.email))
      .order("desc")
      .collect();

    return await Promise.all(
      subs.map(async (sub) => {
        const product = await ctx.db.get(sub.productId);
        return { ...sub, product };
      })
    );
  },
});

export const getByNmiSubscriptionId = query({
  args: { nmiSubscriptionId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("subscriptions")
      .withIndex("by_nmiSubscriptionId", (q) =>
        q.eq("nmiSubscriptionId", args.nmiSubscriptionId)
      )
      .first();
  },
});

export const create = mutation({
  args: {
    customerEmail: v.string(),
    customerName: v.string(),
    productId: v.id("products"),
    nmiSubscriptionId: v.string(),
    nmiCustomerVaultId: v.optional(v.string()),
    planAmount: v.number(),
    currency: v.string(),
    interval: v.union(v.literal("monthly"), v.literal("yearly")),
    status: v.union(
      v.literal("active"),
      v.literal("paused"),
      v.literal("cancelled"),
      v.literal("past_due"),
      v.literal("expired")
    ),
    currentPeriodStart: v.optional(v.number()),
    currentPeriodEnd: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("subscriptions", args);
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("subscriptions"),
    status: v.union(
      v.literal("active"),
      v.literal("paused"),
      v.literal("cancelled"),
      v.literal("past_due"),
      v.literal("expired")
    ),
    cancelledAt: v.optional(v.number()),
    currentPeriodStart: v.optional(v.number()),
    currentPeriodEnd: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    const updates: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) updates[key] = value;
    }
    await ctx.db.patch(id, updates);
  },
});

export const cancel = mutation({
  args: { id: v.id("subscriptions") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: "cancelled",
      cancelledAt: Date.now(),
    });
  },
});
