import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getResource, updateResource, deleteResource } from "@/lib/strapi-admin";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const resource = await getResource(id);
    if (!resource) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }
    return NextResponse.json(resource);
  } catch (error) {
    console.error("Error fetching resource:", error);
    return NextResponse.json({ error: "Failed to fetch resource" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const data = await request.json();

    const resource = await updateResource(id, {
      name: data.name,
      description: data.description,
      url: data.url,
      category: data.category,
      featured: data.featured,
      affiliateLink: data.affiliateLink,
    });

    return NextResponse.json(resource);
  } catch (error) {
    console.error("Error updating resource:", error);
    return NextResponse.json({ error: "Failed to update resource" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await deleteResource(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting resource:", error);
    return NextResponse.json({ error: "Failed to delete resource" }, { status: 500 });
  }
}
