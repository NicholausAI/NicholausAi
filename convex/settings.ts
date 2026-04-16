import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const get = query({
  handler: async (ctx) => {
    const settings = await ctx.db.query("siteSettings").first();
    if (!settings) {
      return {
        siteName: "The Cave",
        tagline: "AI Agent Engineering",
        heroHeadline: "",
        heroSubtext: "",
      };
    }
    return settings;
  },
});

export const upsert = mutation({
  args: {
    siteName: v.optional(v.string()),
    tagline: v.optional(v.string()),
    heroHeadline: v.optional(v.string()),
    heroSubtext: v.optional(v.string()),
    logoUrl: v.optional(v.string()),
    faviconUrl: v.optional(v.string()),
    socialLinks: v.optional(v.any()),
    trackingPixels: v.optional(v.any()),
    analyticsConfig: v.optional(v.any()),
    paymentConfig: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("siteSettings").first();

    const updates: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(args)) {
      if (value !== undefined) {
        updates[key] = value;
      }
    }

    if (existing) {
      await ctx.db.patch(existing._id, updates);
      return existing._id;
    }

    return await ctx.db.insert("siteSettings", {
      siteName: args.siteName ?? "The Cave",
      tagline: args.tagline,
      heroHeadline: args.heroHeadline,
      heroSubtext: args.heroSubtext,
      logoUrl: args.logoUrl,
      faviconUrl: args.faviconUrl,
      socialLinks: args.socialLinks,
      trackingPixels: args.trackingPixels,
      analyticsConfig: args.analyticsConfig,
      paymentConfig: args.paymentConfig,
    });
  },
});
