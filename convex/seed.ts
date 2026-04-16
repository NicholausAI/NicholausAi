import { mutation } from "./_generated/server";

export const seedData = mutation({
  handler: async (ctx) => {
    // Check if already seeded
    const existingPosts = await ctx.db.query("posts").first();
    if (existingPosts) {
      return "Already seeded";
    }

    // Seed posts
    await ctx.db.insert("posts", {
      title: "Why I Trade From My Cave",
      slug: "why-i-trade-from-my-cave",
      excerpt: "The modern trader doesn't need a Wall Street office. Here's why working from your cave gives you an edge in the markets.",
      content: `## The Cave Trader's Edge

In the age of algorithmic trading and instant information, the solo trader working from home has an unexpected advantage. While institutional traders battle office politics and committee decisions, the cave dweller moves with agility.

### Focus Without Distraction

The modern trading floor is chaos. Screens flashing, phones ringing, colleagues interrupting. In your cave, you control the environment. No one breaks your concentration during a critical trade setup.

### The Power of Deep Analysis

Markets reward those who see what others miss. This requires hours of uninterrupted analysis—the kind that's impossible in an open office. In your cave, you can dive deep into charts, fundamentals, and market psychology without the constant pull of office chatter.

### Building Your Own Systems

The best traders develop proprietary systems. This creative work requires space and silence. Your cave becomes a laboratory for ideas, backtests, and strategy refinement.

## Embrace the Cave

The next time someone tells you to "come out of your cave," smile. They don't understand that your cave is where the edge is built.`,
      published: true,
      publishedAt: new Date("2025-01-15").getTime(),
    });

    await ctx.db.insert("posts", {
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

### The Caveman Paradox

Here's the irony: building in public from your cave creates more genuine connections than networking events ever could. Authenticity travels further than elevator pitches.

## Start Today

Pick your platform—Twitter, a blog, YouTube—and start sharing. The cave dweller's superpower is depth of thought. Share that depth with the world.`,
      published: true,
      publishedAt: new Date("2025-01-08").getTime(),
    });

    await ctx.db.insert("posts", {
      title: "The Art of Deep Work",
      slug: "art-of-deep-work",
      excerpt: "In a world of constant notifications, the cave dweller's ability to focus becomes a superpower. Master it.",
      content: `## The Attention Economy

Every app, every platform, every notification is competing for your attention. They're winning—and you're paying the price in fragmented thinking and shallow work.

### The Cave Dweller's Advantage

While others scroll, you can focus. While others react, you can create. The cave provides the environment; you must cultivate the discipline.

### Building Your Focus Practice

**Morning ritual**: Start with your hardest, most important work. No email, no social media, no exceptions.

**Time blocking**: Schedule 3-4 hour blocks for deep work. Protect them like your most important meetings.

**Environment design**: Remove distractions physically. If your phone isn't in the room, you can't check it.

### The Compound Effect

An hour of deep work is worth four hours of shallow work. Compound that over weeks, months, years, and you've built something most people only dream about.

## The Cave as Sanctuary

Your cave isn't just where you work—it's where you think deeply, create meaningfully, and build things that last. Treat it accordingly.`,
      published: true,
      publishedAt: new Date("2025-01-01").getTime(),
    });

    // Seed newsletters
    await ctx.db.insert("newsletters", {
      title: "Welcome Newsletter",
      subject: "Welcome to The Cave!",
      content: { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Welcome to our newsletter!" }] }] },
      status: "draft",
      recipientCount: 0,
    });

    // Seed resources
    const resources = [
      { name: "Cursor", description: "AI-powered code editor. The best IDE for modern development with built-in AI assistance.", url: "https://cursor.com", category: "Development", featured: true, affiliateLink: true, order: 1 },
      { name: "Vercel", description: "Deploy your Next.js apps with zero configuration. The best hosting for frontend projects.", url: "https://vercel.com", category: "Development", featured: true, affiliateLink: true, order: 2 },
      { name: "Railway", description: "Deploy databases and backend services in seconds. Perfect for Strapi, Postgres, and more.", url: "https://railway.app", category: "Development", featured: false, affiliateLink: false, order: 3 },
      { name: "GitHub Copilot", description: "AI pair programmer that helps you write code faster with intelligent suggestions.", url: "https://github.com/features/copilot", category: "Development", featured: false, affiliateLink: false, order: 4 },
      { name: "Figma", description: "Collaborative design tool for creating interfaces, prototypes, and design systems.", url: "https://figma.com", category: "Design", featured: true, affiliateLink: true, order: 5 },
      { name: "Framer", description: "Build and publish stunning websites with no code. Great for landing pages.", url: "https://framer.com", category: "Design", featured: false, affiliateLink: false, order: 6 },
      { name: "Notion", description: "All-in-one workspace for notes, docs, wikis, and project management.", url: "https://notion.so", category: "Productivity", featured: true, affiliateLink: true, order: 7 },
      { name: "Linear", description: "Issue tracking built for modern software teams. Fast, beautiful, and powerful.", url: "https://linear.app", category: "Productivity", featured: false, affiliateLink: false, order: 8 },
      { name: "Raycast", description: "Blazingly fast launcher for Mac. Replaces Spotlight with superpowers.", url: "https://raycast.com", category: "Productivity", featured: false, affiliateLink: false, order: 9 },
      { name: "TradingView", description: "Advanced charting platform with real-time data and social features.", url: "https://tradingview.com", category: "Trading", featured: true, affiliateLink: true, order: 10 },
      { name: "Coinglass", description: "Crypto derivatives data and analytics. Essential for trading futures.", url: "https://coinglass.com", category: "Trading", featured: false, affiliateLink: false, order: 11 },
      { name: "Resend", description: "Modern email API built for developers. Powers this very newsletter.", url: "https://resend.com", category: "Email & Marketing", featured: true, affiliateLink: true, order: 12 },
      { name: "Beehiiv", description: "Newsletter platform built for growth. Great analytics and monetization tools.", url: "https://beehiiv.com", category: "Email & Marketing", featured: false, affiliateLink: false, order: 13 },
    ];

    for (const resource of resources) {
      await ctx.db.insert("resources", resource);
    }

    // Seed site settings
    await ctx.db.insert("siteSettings", {
      siteName: "The Cave",
      tagline: "AI Agent Engineering",
      heroHeadline: "AI Agent Engineering",
      heroSubtext: "We build custom AI agents for SEO, Google Ads, Analytics & CRM automation.",
    });

    return "Seeded successfully";
  },
});
