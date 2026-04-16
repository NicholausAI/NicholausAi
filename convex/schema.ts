import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    passwordHash: v.optional(v.string()),
    name: v.optional(v.string()),
    role: v.union(v.literal("admin"), v.literal("editor"), v.literal("subscriber")),
    emailVerified: v.optional(v.number()),
    image: v.optional(v.string()),
    provider: v.optional(v.string()),
    providerAccountId: v.optional(v.string()),
  })
    .index("by_email", ["email"])
    .index("by_role", ["role"])
    .index("by_provider", ["provider", "providerAccountId"]),

  posts: defineTable({
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    blockContent: v.optional(v.any()),
    excerpt: v.optional(v.string()),
    coverImage: v.optional(v.id("_storage")),
    coverImageUrl: v.optional(v.string()),
    published: v.boolean(),
    publishedAt: v.optional(v.number()),
    authorId: v.optional(v.id("users")),
    categoryIds: v.optional(v.array(v.id("categories"))),
    tagIds: v.optional(v.array(v.id("tags"))),
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
  })
    .index("by_slug", ["slug"])
    .index("by_published", ["published", "publishedAt"])
    .index("by_author", ["authorId"]),

  categories: defineTable({
    name: v.string(),
    slug: v.string(),
  })
    .index("by_slug", ["slug"])
    .index("by_name", ["name"]),

  tags: defineTable({
    name: v.string(),
    slug: v.string(),
  })
    .index("by_slug", ["slug"])
    .index("by_name", ["name"]),

  products: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    content: v.optional(v.any()),
    type: v.union(
      v.literal("course"),
      v.literal("audit"),
      v.literal("template"),
      v.literal("ebook"),
      v.literal("consultation")
    ),
    price: v.number(),
    currency: v.string(),
    coverImage: v.optional(v.id("_storage")),
    coverImageUrl: v.optional(v.string()),
    published: v.boolean(),
    // Subscription support
    isSubscription: v.optional(v.boolean()),
    recurringPrice: v.optional(v.number()),
    recurringInterval: v.optional(
      v.union(v.literal("monthly"), v.literal("yearly"))
    ),
  })
    .index("by_slug", ["slug"])
    .index("by_type", ["type"])
    .index("by_published", ["published"]),

  purchases: defineTable({
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
    // Customer info (guest checkout)
    customerEmail: v.optional(v.string()),
    customerName: v.optional(v.string()),
    // NMI-specific fields
    nmiTransactionId: v.optional(v.string()),
    nmiResponseCode: v.optional(v.string()),
    avsResponse: v.optional(v.string()),
    cvvResponse: v.optional(v.string()),
    // Idempotency
    idempotencyKey: v.optional(v.string()),
    // Refund tracking
    refundedAt: v.optional(v.number()),
    refundAmount: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_product", ["productId"])
    .index("by_status", ["status"])
    .index("by_idempotencyKey", ["idempotencyKey"])
    .index("by_email", ["customerEmail"]),

  subscriptions: defineTable({
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
    cancelledAt: v.optional(v.number()),
  })
    .index("by_email", ["customerEmail"])
    .index("by_nmiSubscriptionId", ["nmiSubscriptionId"])
    .index("by_status", ["status"])
    .index("by_product", ["productId"]),

  customerVault: defineTable({
    customerEmail: v.string(),
    customerName: v.string(),
    nmiCustomerVaultId: v.string(),
    lastFour: v.optional(v.string()),
    cardType: v.optional(v.string()),
    expiryMonth: v.optional(v.string()),
    expiryYear: v.optional(v.string()),
    isDefault: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_email", ["customerEmail"])
    .index("by_nmiVaultId", ["nmiCustomerVaultId"]),

  paymentWebhookEvents: defineTable({
    eventType: v.string(),
    nmiTransactionId: v.optional(v.string()),
    nmiSubscriptionId: v.optional(v.string()),
    rawPayload: v.any(),
    processed: v.boolean(),
    processedAt: v.optional(v.number()),
    error: v.optional(v.string()),
  })
    .index("by_processed", ["processed"])
    .index("by_nmiTransactionId", ["nmiTransactionId"]),

  mediaFiles: defineTable({
    storageId: v.id("_storage"),
    filename: v.string(),
    url: v.string(),
    mimeType: v.string(),
    size: v.number(),
    alt: v.optional(v.string()),
  })
    .index("by_mimeType", ["mimeType"]),

  navigationMenus: defineTable({
    name: v.string(),
    items: v.any(),
  })
    .index("by_name", ["name"]),

  siteSettings: defineTable({
    siteName: v.string(),
    tagline: v.optional(v.string()),
    heroHeadline: v.optional(v.string()),
    heroSubtext: v.optional(v.string()),
    logoUrl: v.optional(v.string()),
    faviconUrl: v.optional(v.string()),
    socialLinks: v.optional(v.any()),
    trackingPixels: v.optional(v.any()),
    analyticsConfig: v.optional(v.any()),
    paymentConfig: v.optional(v.any()),
  }),

  newsletters: defineTable({
    title: v.string(),
    subject: v.string(),
    content: v.any(),
    status: v.union(
      v.literal("draft"),
      v.literal("scheduled"),
      v.literal("sending"),
      v.literal("sent")
    ),
    scheduledAt: v.optional(v.number()),
    sentAt: v.optional(v.number()),
    recipientCount: v.number(),
  })
    .index("by_status", ["status"]),

  resources: defineTable({
    name: v.string(),
    description: v.string(),
    url: v.string(),
    category: v.string(),
    featured: v.boolean(),
    affiliateLink: v.boolean(),
    order: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_order", ["order"])
    .index("by_featured", ["featured"]),

  subscribers: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
    unsubscribed: v.boolean(),
  })
    .index("by_email", ["email"])
    .index("by_unsubscribed", ["unsubscribed"]),

  leadMagnets: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    fileStorageId: v.optional(v.id("_storage")),
    fileUrl: v.optional(v.string()),
    formFields: v.any(),
    thankYouMsg: v.optional(v.string()),
    redirectUrl: v.optional(v.string()),
  })
    .index("by_slug", ["slug"]),

  leadSubmissions: defineTable({
    leadMagnetId: v.id("leadMagnets"),
    data: v.any(),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    utmSource: v.optional(v.string()),
    utmMedium: v.optional(v.string()),
    utmCampaign: v.optional(v.string()),
  })
    .index("by_leadMagnet", ["leadMagnetId"]),
});
