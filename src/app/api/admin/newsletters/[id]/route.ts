import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getNewsletter, updateNewsletter, deleteNewsletter } from "@/lib/strapi-admin";

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
    const newsletter = await getNewsletter(id);
    if (!newsletter) {
      return NextResponse.json({ error: "Newsletter not found" }, { status: 404 });
    }
    return NextResponse.json(newsletter);
  } catch (error) {
    console.error("Error fetching newsletter:", error);
    return NextResponse.json({ error: "Failed to fetch newsletter" }, { status: 500 });
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

    const newsletter = await updateNewsletter(id, {
      title: data.title,
      subject: data.subject,
      content: data.content,
      status: data.status,
      scheduledAt: data.scheduledAt,
    });

    return NextResponse.json(newsletter);
  } catch (error) {
    console.error("Error updating newsletter:", error);
    return NextResponse.json({ error: "Failed to update newsletter" }, { status: 500 });
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
    await deleteNewsletter(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting newsletter:", error);
    return NextResponse.json({ error: "Failed to delete newsletter" }, { status: 500 });
  }
}
