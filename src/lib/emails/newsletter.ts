export function getNewsletterHtml(
  subject: string,
  content: Record<string, unknown>
): string {
  let bodyContent = "";

  if (content && typeof content === "object" && "content" in content) {
    const blocks = (
      content as {
        content: Array<{
          type: string;
          content?: Array<{ type: string; text?: string }>;
        }>;
      }
    ).content || [];
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

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="font-family: Georgia, serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #37352f;">
  <div style="text-align: center; margin-bottom: 40px;">
    <div style="display: inline-block; width: 60px; height: 60px; background: #FDD835; border-radius: 4px; margin-bottom: 16px;"></div>
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
</html>`;
}
