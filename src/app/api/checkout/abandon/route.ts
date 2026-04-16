import { NextRequest, NextResponse } from "next/server";
import { handleEmailEvent } from "@/lib/email-events";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, productSlug, productName } = body;

    if (!email || !productSlug) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    await handleEmailEvent({
      type: "checkout.abandoned",
      email,
      productSlug,
      productName: productName || productSlug,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Checkout abandon error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
