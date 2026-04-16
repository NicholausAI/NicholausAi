import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const saveFile = mutation({
  args: {
    storageId: v.id("_storage"),
    filename: v.string(),
    mimeType: v.string(),
    size: v.number(),
    alt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const url = await ctx.storage.getUrl(args.storageId);
    if (!url) throw new Error("Failed to get storage URL");

    return await ctx.db.insert("mediaFiles", {
      storageId: args.storageId,
      filename: args.filename,
      url,
      mimeType: args.mimeType,
      size: args.size,
      alt: args.alt,
    });
  },
});

export const list = query({
  args: {
    mimeType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.mimeType) {
      return await ctx.db
        .query("mediaFiles")
        .withIndex("by_mimeType", (q) => q.eq("mimeType", args.mimeType!))
        .order("desc")
        .collect();
    }
    return await ctx.db.query("mediaFiles").order("desc").collect();
  },
});

export const getById = query({
  args: { id: v.id("mediaFiles") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const updateAlt = mutation({
  args: {
    id: v.id("mediaFiles"),
    alt: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { alt: args.alt });
  },
});

export const remove = mutation({
  args: { id: v.id("mediaFiles") },
  handler: async (ctx, args) => {
    const file = await ctx.db.get(args.id);
    if (file) {
      await ctx.storage.delete(file.storageId);
      await ctx.db.delete(args.id);
    }
  },
});

export const getUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});
