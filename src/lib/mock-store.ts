// Shared in-memory mock data store
// This allows admin edits to appear on public pages during development

import type { Post as AdminPost, Newsletter, Resource } from "@/types/admin";
import type { Post as PublicPost } from "@/types";

// In-memory storage (persists during server runtime)
let postsStorage: AdminPost[] | null = null;
let newslettersStorage: Newsletter[] | null = null;
let resourcesStorage: Resource[] | null = null;

// Default mock posts with full content
function getDefaultPosts(): AdminPost[] {
  return [
    {
      id: 1,
      title: "Why I Trade From My Cave",
      slug: "why-i-trade-from-my-cave",
      excerpt: "The modern trader doesn't need a Wall Street office. Here's why working from your cave gives you an edge in the markets.",
      content: `## Nicholaus.ai Trader's Edge

In the age of algorithmic trading and instant information, the solo trader working from home has an unexpected advantage. While institutional traders battle office politics and committee decisions, the cave dweller moves with agility.

### Focus Without Distraction

The modern trading floor is chaos. Screens flashing, phones ringing, colleagues interrupting. In your cave, you control the environment. No one breaks your concentration during a critical trade setup.

### The Power of Deep Analysis

Markets reward those who see what others miss. This requires hours of uninterrupted analysis—the kind that's impossible in an open office. In your cave, you can dive deep into charts, fundamentals, and market psychology without the constant pull of office chatter.

### Building Your Own Systems

The best traders develop proprietary systems. This creative work requires space and silence. Your cave becomes a laboratory for ideas, backtests, and strategy refinement.

## Embrace the Cave

The next time someone tells you to "come out of your cave," smile. They don't understand that your cave is where the edge is built.`,
      blockContent: {
        type: "doc",
        content: [
          { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Nicholaus.ai Trader's Edge" }] },
          { type: "paragraph", content: [{ type: "text", text: "In the age of algorithmic trading and instant information, the solo trader working from home has an unexpected advantage. While institutional traders battle office politics and committee decisions, the cave dweller moves with agility." }] },
        ],
      },
      status: "published",
      publishedAt: "2025-01-15T00:00:00.000Z",
      createdAt: "2025-01-15T00:00:00.000Z",
      updatedAt: "2025-01-15T00:00:00.000Z",
    },
    {
      id: 2,
      title: "Building in Public: A Caveman's Guide",
      slug: "building-in-public-caveman-guide",
      excerpt: "Forget the polished launches. Real builders share their journey, warts and all. Here's how to embrace transparency.",
      content: `## Why Build in Public?

The traditional startup playbook says to build in stealth, then reveal your masterpiece. But there's a better way—one that the most successful indie hackers have discovered.

### The Benefits of Transparency

When you build in public, you create accountability. Your audience becomes invested in your success. They root for you, provide feedback, and become your first customers.

### How to Start

1. **Share your daily progress** - Even small wins count
2. **Be honest about failures** - They make success more meaningful
3. **Engage with feedback** - Your audience has insights you lack

### Nicholaus.aiman Paradox

Here's the irony: building in public from your cave creates more genuine connections than networking events ever could. Authenticity travels further than elevator pitches.

## Start Today

Pick your platform—Twitter, a blog, YouTube—and start sharing. The cave dweller's superpower is depth of thought. Share that depth with the world.`,
      blockContent: {
        type: "doc",
        content: [
          { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Why Build in Public?" }] },
          { type: "paragraph", content: [{ type: "text", text: "The traditional startup playbook says to build in stealth, then reveal your masterpiece. But there's a better way—one that the most successful indie hackers have discovered." }] },
        ],
      },
      status: "published",
      publishedAt: "2025-01-08T00:00:00.000Z",
      createdAt: "2025-01-08T00:00:00.000Z",
      updatedAt: "2025-01-08T00:00:00.000Z",
    },
    {
      id: 3,
      title: "The Art of Deep Work",
      slug: "art-of-deep-work",
      excerpt: "In a world of constant notifications, the cave dweller's ability to focus becomes a superpower. Master it.",
      content: `## The Attention Economy

Every app, every platform, every notification is competing for your attention. They're winning—and you're paying the price in fragmented thinking and shallow work.

### Nicholaus.ai Dweller's Advantage

While others scroll, you can focus. While others react, you can create. The cave provides the environment; you must cultivate the discipline.

### Building Your Focus Practice

**Morning ritual**: Start with your hardest, most important work. No email, no social media, no exceptions.

**Time blocking**: Schedule 3-4 hour blocks for deep work. Protect them like your most important meetings.

**Environment design**: Remove distractions physically. If your phone isn't in the room, you can't check it.

### The Compound Effect

An hour of deep work is worth four hours of shallow work. Compound that over weeks, months, years, and you've built something most people only dream about.

## Nicholaus.ai as Sanctuary

Your cave isn't just where you work—it's where you think deeply, create meaningfully, and build things that last. Treat it accordingly.`,
      blockContent: {
        type: "doc",
        content: [
          { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "The Attention Economy" }] },
          { type: "paragraph", content: [{ type: "text", text: "Every app, every platform, every notification is competing for your attention. They're winning—and you're paying the price in fragmented thinking and shallow work." }] },
        ],
      },
      status: "published",
      publishedAt: "2025-01-01T00:00:00.000Z",
      createdAt: "2025-01-01T00:00:00.000Z",
      updatedAt: "2025-01-01T00:00:00.000Z",
    },
  ];
}

function getDefaultNewsletters(): Newsletter[] {
  return [
    {
      id: 1,
      title: "Welcome Newsletter",
      subject: "Welcome to Nicholaus.ai!",
      content: { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Welcome to our newsletter!" }] }] },
      status: "draft",
      scheduledAt: null,
      sentAt: null,
      recipientCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
}

function getDefaultResources(): Resource[] {
  return [
    // Development
    {
      id: 1,
      name: "Cursor",
      description: "AI-powered code editor. The best IDE for modern development with built-in AI assistance.",
      url: "https://cursor.com",
      category: "Development",
      featured: true,
      affiliateLink: true,
      order: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 2,
      name: "Vercel",
      description: "Deploy your Next.js apps with zero configuration. The best hosting for frontend projects.",
      url: "https://vercel.com",
      category: "Development",
      featured: true,
      affiliateLink: true,
      order: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 3,
      name: "Railway",
      description: "Deploy databases and backend services in seconds. Perfect for Strapi, Postgres, and more.",
      url: "https://railway.app",
      category: "Development",
      featured: false,
      affiliateLink: false,
      order: 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 4,
      name: "GitHub Copilot",
      description: "AI pair programmer that helps you write code faster with intelligent suggestions.",
      url: "https://github.com/features/copilot",
      category: "Development",
      featured: false,
      affiliateLink: false,
      order: 4,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    // Design
    {
      id: 5,
      name: "Figma",
      description: "Collaborative design tool for creating interfaces, prototypes, and design systems.",
      url: "https://figma.com",
      category: "Design",
      featured: true,
      affiliateLink: true,
      order: 5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 6,
      name: "Framer",
      description: "Build and publish stunning websites with no code. Great for landing pages.",
      url: "https://framer.com",
      category: "Design",
      featured: false,
      affiliateLink: false,
      order: 6,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    // Productivity
    {
      id: 7,
      name: "Notion",
      description: "All-in-one workspace for notes, docs, wikis, and project management.",
      url: "https://notion.so",
      category: "Productivity",
      featured: true,
      affiliateLink: true,
      order: 7,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 8,
      name: "Linear",
      description: "Issue tracking built for modern software teams. Fast, beautiful, and powerful.",
      url: "https://linear.app",
      category: "Productivity",
      featured: false,
      affiliateLink: false,
      order: 8,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 9,
      name: "Raycast",
      description: "Blazingly fast launcher for Mac. Replaces Spotlight with superpowers.",
      url: "https://raycast.com",
      category: "Productivity",
      featured: false,
      affiliateLink: false,
      order: 9,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    // Trading
    {
      id: 10,
      name: "TradingView",
      description: "Advanced charting platform with real-time data and social features.",
      url: "https://tradingview.com",
      category: "Trading",
      featured: true,
      affiliateLink: true,
      order: 10,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 11,
      name: "Coinglass",
      description: "Crypto derivatives data and analytics. Essential for trading futures.",
      url: "https://coinglass.com",
      category: "Trading",
      featured: false,
      affiliateLink: false,
      order: 11,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    // Email & Marketing
    {
      id: 12,
      name: "Resend",
      description: "Modern email API built for developers. Powers this very newsletter.",
      url: "https://resend.com",
      category: "Email & Marketing",
      featured: true,
      affiliateLink: true,
      order: 12,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 13,
      name: "Beehiiv",
      description: "Newsletter platform built for growth. Great analytics and monetization tools.",
      url: "https://beehiiv.com",
      category: "Email & Marketing",
      featured: false,
      affiliateLink: false,
      order: 13,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
}

// Posts store
export function getMockPosts(): AdminPost[] {
  if (!postsStorage) {
    postsStorage = getDefaultPosts();
  }
  return postsStorage;
}

export function getMockPostById(id: string | number): AdminPost | null {
  const posts = getMockPosts();
  return posts.find((p) => String(p.id) === String(id)) || null;
}

export function getMockPostBySlug(slug: string): AdminPost | null {
  const posts = getMockPosts();
  return posts.find((p) => p.slug === slug) || null;
}

export function getPublishedMockPosts(): PublicPost[] {
  const posts = getMockPosts();
  return posts
    .filter((p) => p.status === "published" && p.publishedAt)
    .map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      content: p.content,
      publishedAt: p.publishedAt!,
    }));
}

export function getPublishedMockPostBySlug(slug: string): PublicPost | null {
  const post = getMockPostBySlug(slug);
  if (!post || post.status !== "published" || !post.publishedAt) {
    return null;
  }
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    publishedAt: post.publishedAt,
  };
}

export function createMockPost(data: Partial<AdminPost>): AdminPost {
  const posts = getMockPosts();
  const newPost: AdminPost = {
    id: Date.now(),
    title: data.title || "Untitled",
    slug: data.slug || `post-${Date.now()}`,
    excerpt: data.excerpt || "",
    content: data.content || "",
    blockContent: data.blockContent,
    status: data.publishedAt ? "published" : "draft",
    publishedAt: data.publishedAt || null,
    seoTitle: data.seoTitle,
    seoDescription: data.seoDescription,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  posts.unshift(newPost);
  return newPost;
}

export function updateMockPost(id: string | number, data: Partial<AdminPost>): AdminPost {
  const posts = getMockPosts();
  const index = posts.findIndex((p) => String(p.id) === String(id));
  if (index === -1) {
    throw new Error("Post not found");
  }

  // Convert blockContent to markdown content if provided
  let content = data.content;
  if (data.blockContent && !content) {
    content = blockContentToMarkdown(data.blockContent);
  }

  posts[index] = {
    ...posts[index],
    ...data,
    content: content || posts[index].content,
    status: data.publishedAt ? "published" : (data.publishedAt === null ? "draft" : posts[index].status),
    updatedAt: new Date().toISOString(),
  };
  return posts[index];
}

export function deleteMockPost(id: string | number): void {
  const posts = getMockPosts();
  const index = posts.findIndex((p) => String(p.id) === String(id));
  if (index !== -1) {
    posts.splice(index, 1);
  }
}

// Newsletters store
export function getMockNewsletters(): Newsletter[] {
  if (!newslettersStorage) {
    newslettersStorage = getDefaultNewsletters();
  }
  return newslettersStorage;
}

export function getMockNewsletterById(id: string | number): Newsletter | null {
  const newsletters = getMockNewsletters();
  return newsletters.find((n) => String(n.id) === String(id)) || null;
}

export function createMockNewsletter(data: Partial<Newsletter>): Newsletter {
  const newsletters = getMockNewsletters();
  const newNewsletter: Newsletter = {
    id: Date.now(),
    title: data.title || "Untitled",
    subject: data.subject || "",
    content: data.content || { type: "doc", content: [] },
    status: "draft",
    scheduledAt: null,
    sentAt: null,
    recipientCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  newsletters.push(newNewsletter);
  return newNewsletter;
}

export function updateMockNewsletter(id: string | number, data: Partial<Newsletter>): Newsletter {
  const newsletters = getMockNewsletters();
  const index = newsletters.findIndex((n) => String(n.id) === String(id));
  if (index === -1) {
    throw new Error("Newsletter not found");
  }
  newsletters[index] = { ...newsletters[index], ...data, updatedAt: new Date().toISOString() };
  return newsletters[index];
}

export function deleteMockNewsletter(id: string | number): void {
  const newsletters = getMockNewsletters();
  const index = newsletters.findIndex((n) => String(n.id) === String(id));
  if (index !== -1) {
    newsletters.splice(index, 1);
  }
}

// Resources store
export function getMockResources(): Resource[] {
  if (!resourcesStorage) {
    resourcesStorage = getDefaultResources();
  }
  return resourcesStorage;
}

export function getMockResourceById(id: string | number): Resource | null {
  const resources = getMockResources();
  return resources.find((r) => String(r.id) === String(id)) || null;
}

export function createMockResource(data: Partial<Resource>): Resource {
  const resources = getMockResources();
  const newResource: Resource = {
    id: Date.now(),
    name: data.name || "Untitled",
    description: data.description || "",
    url: data.url || "",
    category: data.category || "General",
    featured: data.featured || false,
    affiliateLink: data.affiliateLink || false,
    order: resources.length + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  resources.push(newResource);
  return newResource;
}

export function updateMockResource(id: string | number, data: Partial<Resource>): Resource {
  const resources = getMockResources();
  const index = resources.findIndex((r) => String(r.id) === String(id));
  if (index === -1) {
    throw new Error("Resource not found");
  }
  resources[index] = { ...resources[index], ...data, updatedAt: new Date().toISOString() };
  return resources[index];
}

export function deleteMockResource(id: string | number): void {
  const resources = getMockResources();
  const index = resources.findIndex((r) => String(r.id) === String(id));
  if (index !== -1) {
    resources.splice(index, 1);
  }
}

// Helper to convert TipTap JSON to markdown (simplified)
interface TipTapTextNode {
  type: string;
  text?: string;
  marks?: Array<{ type: string }>;
}

interface TipTapNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: Array<TipTapTextNode | TipTapNode>;
}

function blockContentToMarkdown(content: Record<string, unknown>): string {
  if (!content || !content.content) return "";

  const nodes = content.content as Array<TipTapNode>;

  return nodes.map((node) => {
    if (node.type === "heading") {
      const level = (node.attrs?.level as number) || 1;
      const text = node.content?.map((c) => (c as TipTapTextNode).text || "").join("") || "";
      return "#".repeat(level) + " " + text;
    }
    if (node.type === "paragraph") {
      return node.content?.map((c) => {
        const textNode = c as TipTapTextNode;
        let text = textNode.text || "";
        if (textNode.marks) {
          textNode.marks.forEach((mark) => {
            if (mark.type === "bold") text = `**${text}**`;
            if (mark.type === "italic") text = `*${text}*`;
            if (mark.type === "code") text = `\`${text}\``;
          });
        }
        return text;
      }).join("") || "";
    }
    if (node.type === "bulletList" || node.type === "orderedList") {
      return ""; // Simplified - full implementation would recurse
    }
    if (node.type === "blockquote") {
      const text = node.content?.map((c) => {
        const paragraphNode = c as TipTapNode;
        return paragraphNode.content?.map((t) => (t as TipTapTextNode).text || "").join("") || "";
      }).join("\n") || "";
      return "> " + text;
    }
    if (node.type === "codeBlock") {
      const text = node.content?.map((c) => (c as TipTapTextNode).text || "").join("") || "";
      return "```\n" + text + "\n```";
    }
    return "";
  }).filter(Boolean).join("\n\n");
}
