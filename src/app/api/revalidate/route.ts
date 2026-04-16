import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const secret = request.headers.get("x-webhook-secret");

    // Validate webhook secret
    if (secret !== process.env.STRAPI_WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: "Invalid webhook secret" },
        { status: 401 }
      );
    }

    // Revalidate pages based on the event
    const { model, entry } = body;

    if (model === "post") {
      // Revalidate the specific post
      if (entry?.slug) {
        revalidatePath(`/blog/${entry.slug}`);
      }
      // Revalidate blog listing and home
      revalidatePath("/blog");
      revalidatePath("/");
    }

    if (model === "site-setting") {
      // Revalidate all pages
      revalidatePath("/", "layout");
    }

    return NextResponse.json({ revalidated: true });
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json(
      { error: "Revalidation failed" },
      { status: 500 }
    );
  }
}
