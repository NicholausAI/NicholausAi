import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("leadMagnets").order("desc").collect();
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("leadMagnets")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

export const getById = query({
  args: { id: v.id("leadMagnets") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    fileUrl: v.optional(v.string()),
    formFields: v.any(),
    thankYouMsg: v.optional(v.string()),
    redirectUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("leadMagnets", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("leadMagnets"),
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
    description: v.optional(v.string()),
    fileUrl: v.optional(v.string()),
    formFields: v.optional(v.any()),
    thankYouMsg: v.optional(v.string()),
    redirectUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
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
  args: { id: v.id("leadMagnets") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Submissions
export const submitForm = mutation({
  args: {
    leadMagnetId: v.id("leadMagnets"),
    data: v.any(),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    utmSource: v.optional(v.string()),
    utmMedium: v.optional(v.string()),
    utmCampaign: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("leadSubmissions", args);
  },
});

export const listSubmissions = query({
  args: {
    leadMagnetId: v.optional(v.id("leadMagnets")),
  },
  handler: async (ctx, args) => {
    if (args.leadMagnetId) {
      return await ctx.db
        .query("leadSubmissions")
        .withIndex("by_leadMagnet", (q) => q.eq("leadMagnetId", args.leadMagnetId!))
        .order("desc")
        .collect();
    }
    return await ctx.db.query("leadSubmissions").order("desc").collect();
  },
});
