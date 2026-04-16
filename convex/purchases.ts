import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("purchases").order("desc").collect();
  },
});

export const listWithProducts = query({
  handler: async (ctx) => {
    const purchases = await ctx.db
      .query("purchases")
      .order("desc")
      .collect();

    return await Promise.all(
      purchases.map(async (purchase) => {
        const product = await ctx.db.get(purchase.productId);
        return { ...purchase, product };
      })
    );
  },
});

export const listByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const purchases = await ctx.db
      .query("purchases")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();

    const withProducts = await Promise.all(
      purchases.map(async (purchase) => {
        const product = await ctx.db.get(purchase.productId);
        return { ...purchase, product };
      })
    );

    return withProducts;
  },
});

export const listByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const purchases = await ctx.db
      .query("purchases")
      .withIndex("by_email", (q) => q.eq("customerEmail", args.email))
      .order("desc")
      .collect();

    return await Promise.all(
      purchases.map(async (purchase) => {
        const product = await ctx.db.get(purchase.productId);
        return { ...purchase, product };
      })
    );
  },
});

export const getById = query({
  args: { id: v.id("purchases") },
  handler: async (ctx, args) => {
    const purchase = await ctx.db.get(args.id);
    if (!purchase) return null;
    const product = await ctx.db.get(purchase.productId);
    return { ...purchase, product };
  },
});

export const getByIdempotencyKey = query({
  args: { idempotencyKey: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("purchases")
      .withIndex("by_idempotencyKey", (q) =>
        q.eq("idempotencyKey", args.idempotencyKey)
      )
      .first();
  },
});

export const create = mutation({
  args: {
    userId: v.optional(v.id("users")),
    productId: v.id("products"),
    amount: v.number(),
    currency: v.string(),
    paymentProvider: v.string(),
    transactionId: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("refunded")
    ),
    customerEmail: v.optional(v.string()),
    customerName: v.optional(v.string()),
    nmiTransactionId: v.optional(v.string()),
    nmiResponseCode: v.optional(v.string()),
    avsResponse: v.optional(v.string()),
    cvvResponse: v.optional(v.string()),
    idempotencyKey: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("purchases", args);
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("purchases"),
    status: v.union(
      v.literal("pending"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("refunded")
    ),
    transactionId: v.optional(v.string()),
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

export const updatePaymentDetails = mutation({
  args: {
    id: v.id("purchases"),
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("completed"),
        v.literal("failed"),
        v.literal("refunded")
      )
    ),
    nmiTransactionId: v.optional(v.string()),
    nmiResponseCode: v.optional(v.string()),
    avsResponse: v.optional(v.string()),
    cvvResponse: v.optional(v.string()),
    transactionId: v.optional(v.string()),
    refundedAt: v.optional(v.number()),
    refundAmount: v.optional(v.number()),
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

export const getByUserAndProduct = query({
  args: {
    userId: v.id("users"),
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    const purchases = await ctx.db
      .query("purchases")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    return purchases.find(
      (p) => p.productId === args.productId && p.status === "completed"
    ) ?? null;
  },
});

export const stats = query({
  handler: async (ctx) => {
    const purchases = await ctx.db
      .query("purchases")
      .withIndex("by_status", (q) => q.eq("status", "completed"))
      .collect();

    const totalRevenue = purchases.reduce((sum, p) => sum + p.amount, 0);
    return {
      totalPurchases: purchases.length,
      totalRevenue,
    };
  },
});
