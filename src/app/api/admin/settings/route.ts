import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getSiteSettings, updateSiteSettings } from "@/lib/strapi-admin";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const settings = await getSiteSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();

    const settings = await updateSiteSettings({
      siteName: data.siteName,
      tagline: data.tagline,
      heroHeadline: data.heroHeadline,
      heroSubtext: data.heroSubtext,
      socialLinks: data.socialLinks,
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
