import { ConvexHttpClient } from "convex/browser";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://placeholder.convex.cloud";

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  console.warn("NEXT_PUBLIC_CONVEX_URL not set — Convex queries will fail at runtime");
}

export const convex = new ConvexHttpClient(convexUrl);
