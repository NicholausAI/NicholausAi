import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getNewsletter, updateNewsletter } from "@/lib/strapi-admin";
import { sendCampaign, resolveGroupId } from "@/lib/mailerlite";
import { getNewsletterHtml } from "@/lib/emails/newsletter";

export async function POST(
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

    if (newsletter.status === "sent") {
      return NextResponse.json({ error: "Newsletter already sent" }, { status: 400 });
    }

    await updateNewsletter(id, { status: "sending" });

    const html = getNewsletterHtml(newsletter.subject, newsletter.content);
    const groupId = await resolveGroupId("newsletter");

    try {
      const result = await sendCampaign({
        subject: newsletter.subject,
        html,
        groupId,
        name: newsletter.title || newsletter.subject,
      });

      await updateNewsletter(id, {
        status: "sent",
        sentAt: new Date().toISOString(),
        recipientCount: 0,
      });

      return NextResponse.json({
        success: true,
        campaignId: result.id,
      });
    } catch {
      await updateNewsletter(id, { status: "draft" });
      return NextResponse.json({ error: "Failed to send" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error sending newsletter:", error);
    return NextResponse.json({ error: "Failed to send newsletter" }, { status: 500 });
  }
}
