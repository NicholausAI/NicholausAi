import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!RESEND_API_KEY || !RESEND_AUDIENCE_ID) {
    return NextResponse.json({
      subscribers: [],
      message: "Resend not configured",
    });
  }

  try {
    const response = await fetch(
      `https://api.resend.com/audiences/${RESEND_AUDIENCE_ID}/contacts`,
      {
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch subscribers");
    }

    const data = await response.json();
    return NextResponse.json({ subscribers: data.data || [] });
  } catch (error) {
    console.error("Error fetching subscribers:", error);
    return NextResponse.json({ subscribers: [], error: "Failed to fetch" });
  }
}
