import { NextResponse } from "next/server";
import { convex } from "@/lib/convex";
import { api } from "../../../../convex/_generated/api";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const resources = await convex.query(api.resources.list, {});

    const publicResources = resources.map((r) => ({
      id: r._id,
      name: r.name,
      description: r.description,
      url: r.url,
      category: r.category,
      featured: r.featured,
      affiliateLink: r.affiliateLink,
    }));

    return NextResponse.json(publicResources);
  } catch (error) {
    console.error("Error fetching resources:", error);
    return NextResponse.json({ error: "Failed to fetch resources" }, { status: 500 });
  }
}
