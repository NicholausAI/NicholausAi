import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getResources, createResource } from "@/lib/strapi-admin";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const resources = await getResources();
    return NextResponse.json(resources);
  } catch (error) {
    console.error("Error fetching resources:", error);
    return NextResponse.json({ error: "Failed to fetch resources" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();

    const resource = await createResource({
      name: data.name,
      description: data.description,
      url: data.url,
      category: data.category,
      featured: data.featured || false,
      affiliateLink: data.affiliateLink || false,
      order: 0,
    });

    return NextResponse.json(resource);
  } catch (error) {
    console.error("Error creating resource:", error);
    return NextResponse.json({ error: "Failed to create resource" }, { status: 500 });
  }
}
