import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const create = mutation({
  args: {
    eventType: v.string(),
    nmiTransactionId: v.optional(v.string()),
    nmiSubscriptionId: v.optional(v.string()),
    rawPayload: v.any(),
    processed: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("paymentWebhookEvents", args);
  },
});

export const listRecent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query("paymentWebhookEvents")
      .order("desc")
      .take(args.limit ?? 50);
    return results;
  },
});

export const listByTransactionId = query({
  args: { nmiTransactionId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("paymentWebhookEvents")
      .withIndex("by_nmiTransactionId", (q) =>
        q.eq("nmiTransactionId", args.nmiTransactionId)
      )
      .collect();
  },
});

export const markProcessed = mutation({
  args: {
    id: v.id("paymentWebhookEvents"),
    error: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      processed: true,
      processedAt: Date.now(),
      error: args.error,
    });
  },
});
