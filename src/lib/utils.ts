import type { TableOfContentsItem } from "@/types";

/**
 * Extract headings from markdown/HTML content for table of contents
 */
export function extractHeadings(content: string): TableOfContentsItem[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: TableOfContentsItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = slugify(text);

    headings.push({ id, text, level });
  }

  return headings;
}

/**
 * Convert text to URL-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .trim();
}

/**
 * Convert markdown-like content to HTML with proper heading IDs
 */
export function markdownToHtml(content: string): string {
  let html = content;

  // Convert headings with IDs
  html = html.replace(/^### (.+)$/gm, (_, text) => {
    const id = slugify(text);
    return `<h3 id="${id}">${text}</h3>`;
  });

  html = html.replace(/^## (.+)$/gm, (_, text) => {
    const id = slugify(text);
    return `<h2 id="${id}">${text}</h2>`;
  });

  // Convert bold
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  // Convert paragraphs (lines separated by blank lines)
  html = html
    .split("\n\n")
    .map((block) => {
      block = block.trim();
      if (!block) return "";
      if (block.startsWith("<h")) return block;
      if (block.startsWith("<ul") || block.startsWith("<ol")) return block;
      if (block.startsWith("-") || block.match(/^\d+\./)) {
        // Convert list items
        const items = block.split("\n").map((item) => {
          const text = item.replace(/^[-*]\s*/, "").replace(/^\d+\.\s*/, "");
          return `<li>${text}</li>`;
        });
        return `<ul>${items.join("")}</ul>`;
      }
      return `<p>${block.replace(/\n/g, " ")}</p>`;
    })
    .join("\n");

  return html;
}

/**
 * Format a date for display
 */
export function formatDate(
  date: string | Date,
  options?: Intl.DateTimeFormatOptions
): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  };

  return new Date(date).toLocaleDateString("en-US", options || defaultOptions);
}

/**
 * Estimate reading time for content
 */
export function getReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}
