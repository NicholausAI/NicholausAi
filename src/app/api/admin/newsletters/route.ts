import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getNewsletters, createNewsletter } from "@/lib/strapi-admin";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const newsletters = await getNewsletters();
    return NextResponse.json(newsletters);
  } catch (error) {
    console.error("Error fetching newsletters:", error);
    return NextResponse.json({ error: "Failed to fetch newsletters" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();

    const newsletter = await createNewsletter({
      title: data.title,
      subject: data.subject,
      content: data.content,
      status: data.status || "draft",
      scheduledAt: data.scheduledAt || null,
      sentAt: null,
      recipientCount: 0,
    });

    return NextResponse.json(newsletter);
  } catch (error) {
    console.error("Error creating newsletter:", error);
    return NextResponse.json({ error: "Failed to create newsletter" }, { status: 500 });
  }
}
