import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("customerVault")
      .withIndex("by_email", (q) => q.eq("customerEmail", args.email))
      .collect();
  },
});

export const getByNmiVaultId = query({
  args: { nmiCustomerVaultId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("customerVault")
      .withIndex("by_nmiVaultId", (q) =>
        q.eq("nmiCustomerVaultId", args.nmiCustomerVaultId)
      )
      .first();
  },
});

export const create = mutation({
  args: {
    customerEmail: v.string(),
    customerName: v.string(),
    nmiCustomerVaultId: v.string(),
    lastFour: v.optional(v.string()),
    cardType: v.optional(v.string()),
    expiryMonth: v.optional(v.string()),
    expiryYear: v.optional(v.string()),
    isDefault: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("customerVault", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("customerVault") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
