const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;
const FROM_EMAIL = process.env.FROM_EMAIL || "onboarding@resend.dev";

interface SubscribeResult {
  success: boolean;
  error?: string;
}

export async function subscribeEmail(email: string): Promise<SubscribeResult> {
  if (!RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set, skipping subscription");
    // Return success in development
    return { success: true };
  }

  try {
    // Add contact to audience
    if (RESEND_AUDIENCE_ID) {
      const contactRes = await fetch(
        `https://api.resend.com/audiences/${RESEND_AUDIENCE_ID}/contacts`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            unsubscribed: false,
          }),
        }
      );

      if (!contactRes.ok) {
        const error = await contactRes.json();
        // If already subscribed, treat as success
        if (error.message?.includes("already exists")) {
          return { success: true };
        }
        throw new Error(error.message || "Failed to add contact");
      }
    }

    // Send welcome email
    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: email,
        subject: "Welcome to Nicholaus.ai",
        html: getWelcomeEmailHtml(),
      }),
    });

    if (!emailRes.ok) {
      const error = await emailRes.json();
      console.error("Failed to send welcome email:", error);
      // Still return success if contact was added
    }

    return { success: true };
  } catch (error) {
    console.error("Subscription error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Subscription failed",
    };
  }
}

interface SendNewsletterResult {
  success: boolean;
  error?: string;
  recipientCount?: number;
}

interface NewsletterData {
  subject: string;
  content: Record<string, unknown>;
}

export async function sendNewsletter(data: NewsletterData): Promise<SendNewsletterResult> {
  if (!RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set, skipping newsletter send");
    return { success: true, recipientCount: 0 };
  }

  if (!RESEND_AUDIENCE_ID) {
    console.warn("RESEND_AUDIENCE_ID not set, cannot send newsletter");
    return { success: false, error: "Audience not configured" };
  }

  try {
    // First, get all contacts from the audience
    const contactsRes = await fetch(
      `https://api.resend.com/audiences/${RESEND_AUDIENCE_ID}/contacts`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
      }
    );

    if (!contactsRes.ok) {
      const error = await contactsRes.json();
      throw new Error(error.message || "Failed to fetch contacts");
    }

    const contactsData = await contactsRes.json();
    const contacts = contactsData.data || [];
    const activeContacts = contacts.filter((c: { unsubscribed: boolean }) => !c.unsubscribed);

    if (activeContacts.length === 0) {
      return { success: true, recipientCount: 0 };
    }

    // Convert block content to HTML
    const htmlContent = getNewsletterHtml(data.subject, data.content);

    // Send to all active contacts using batch send
    const emails = activeContacts.map((contact: { email: string }) => ({
      from: FROM_EMAIL,
      to: contact.email,
      subject: data.subject,
      html: htmlContent,
    }));

    // Resend batch API allows up to 100 emails at a time
    const batchSize = 100;
    let totalSent = 0;

    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);

      const sendRes = await fetch("https://api.resend.com/emails/batch", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(batch),
      });

      if (!sendRes.ok) {
        const error = await sendRes.json();
        console.error("Batch send error:", error);
        // Continue with other batches even if one fails
      } else {
        totalSent += batch.length;
      }
    }

    return { success: true, recipientCount: totalSent };
  } catch (error) {
    console.error("Newsletter send error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send newsletter",
    };
  }
}

function getNewsletterHtml(subject: string, content: Record<string, unknown>): string {
  // Convert block content to simple HTML
  // In a production app, you'd use a proper block-to-html converter
  let bodyContent = "";

  if (content && typeof content === "object" && "content" in content) {
    const blocks = (content as { content: Array<{ type: string; content?: Array<{ type: string; text?: string }> }> }).content || [];
    bodyContent = blocks
      .map((block) => {
        if (block.type === "paragraph" && block.content) {
          const text = block.content.map((c) => c.text || "").join("");
          return `<p style="margin: 0 0 16px; line-height: 1.6;">${text}</p>`;
        }
        if (block.type === "heading" && block.content) {
          const text = block.content.map((c) => c.text || "").join("");
          return `<h2 style="margin: 24px 0 16px; font-size: 20px; font-weight: 600;">${text}</h2>`;
        }
        return "";
      })
      .join("\n");
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="font-family: Georgia, serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #37352f;">
  <div style="text-align: center; margin-bottom: 40px;">
    <div style="display: inline-block; width: 60px; height: 60px; background: #f97316; border-radius: 12px; margin-bottom: 16px;"></div>
    <h1 style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 28px; margin: 0;">Nicholaus.ai</h1>
  </div>

  <div>
    ${bodyContent || "<p>Newsletter content</p>"}
  </div>

  <hr style="border: none; border-top: 1px solid #e3e2de; margin: 40px 0;">

  <p style="font-size: 12px; color: #787774; text-align: center;">
    You're receiving this because you subscribed at Nicholaus.ai.<br>
    <a href="{{{unsubscribe_url}}}" style="color: #787774;">Unsubscribe</a>
  </p>
</body>
</html>
  `;
}

function getWelcomeEmailHtml(): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Nicholaus.ai</title>
</head>
<body style="font-family: Georgia, serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #37352f;">
  <div style="text-align: center; margin-bottom: 40px;">
    <div style="display: inline-block; width: 60px; height: 60px; background: #f97316; border-radius: 12px; margin-bottom: 16px;"></div>
    <h1 style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 28px; margin: 0;">Welcome to Nicholaus.ai</h1>
  </div>

  <p>You're in.</p>

  <p>Welcome to a growing community of developers, traders, and entrepreneurs who embrace focused work—where real things get built.</p>

  <p>Here's what you can expect:</p>

  <ul style="margin: 24px 0;">
    <li><strong>Weekly insights</strong> on development, trading, and building in the digital age</li>
    <li><strong>No fluff</strong>—just signal and actionable ideas</li>
    <li><strong>First access</strong> to new projects and resources</li>
  </ul>

  <p>In the meantime, check out some of our most popular posts:</p>

  <div style="margin: 24px 0; padding: 20px; background: #f7f6f3; border-radius: 8px;">
    <p style="margin: 0 0 12px;"><strong>→ Why I Trade From My Cave</strong></p>
    <p style="margin: 0 0 12px;"><strong>→ Building in Public: A Guide</strong></p>
    <p style="margin: 0;"><strong>→ The Art of Deep Work</strong></p>
  </div>

  <p>Reply to this email anytime—I read and respond to every message.</p>

  <p>Best regards,<br>
  <strong>Nicholaus.ai Team</strong></p>

  <hr style="border: none; border-top: 1px solid #e3e2de; margin: 40px 0;">

  <p style="font-size: 12px; color: #787774; text-align: center;">
    You're receiving this because you subscribed at Nicholaus.ai.<br>
    <a href="{{{unsubscribe_url}}}" style="color: #787774;">Unsubscribe</a>
  </p>
</body>
</html>
  `;
}
