/**
 * Build all MailerLite automation sequences with proper step ordering and delays.
 * Run: MAILERLITE_API_KEY=... npx tsx scripts/build-automations.ts
 */

const API = "https://connect.mailerlite.com/api";
const KEY = process.env.MAILERLITE_API_KEY!;
const FROM = "imnickthomson@gmail.com"; // Change to info@nicholaus.ai once verified
const FROM_NAME = "Nicholaus";
const SITE = "https://nicholaus.ai";

async function ml<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const r = await fetch(`${API}${path}`, {
    ...opts,
    headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json", Accept: "application/json" },
  });
  const text = await r.text();
  if (!r.ok) throw new Error(`${r.status} ${path}: ${text}`);
  return text ? JSON.parse(text) : ({} as T);
}

async function groupId(name: string): Promise<string> {
  const res = await ml<{ data: { id: string; name: string }[] }>(`/groups?filter[name]=${encodeURIComponent(name)}`);
  const g = res.data?.find((x) => x.name.toLowerCase() === name.toLowerCase());
  if (!g) throw new Error(`Group "${name}" not found`);
  return g.id;
}

function wrap(body: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.7;max-width:600px;margin:0 auto;padding:40px 20px;color:#1a1a1a;background:#fafafa;"><div style="background:#fff;border-radius:4px;padding:40px;border:1px solid #e5e5e5;">${body}</div><p style="font-size:12px;color:#999;text-align:center;margin-top:24px;">Nicholaus, LLC<br><a href="{$unsubscribe}" style="color:#999;">Unsubscribe</a></p></body></html>`;
}

type Step = { type: "email"; subject: string; html: string } | { type: "delay"; value: number; unit: "hours" | "days" };

async function buildAutomation(name: string, triggerGroupId: string | null, steps: Step[]) {
  // Create automation
  const res = await ml<{ data: { id: string } }>("/automations", {
    method: "POST",
    body: JSON.stringify({ name, type: "automation" }),
  });
  const autoId = res.data.id;

  // Add trigger if provided
  if (triggerGroupId) {
    await ml(`/automations/${autoId}/triggers`, {
      method: "POST",
      body: JSON.stringify({ type: "subscriber_joins_group", group_id: triggerGroupId }),
    });
  }

  // Add steps sequentially with parent chaining
  let parentId: string | null = null;

  for (const step of steps) {
    if (step.type === "email") {
      // Create email step
      const body: Record<string, unknown> = { type: "email" };
      if (parentId) body.parent_id = parentId;

      const r = await ml<{ data: { id: string } }>(`/automations/${autoId}/steps`, {
        method: "POST",
        body: JSON.stringify(body),
      });
      const stepId = r.data.id;

      // Update with content
      await ml(`/automations/${autoId}/steps/${stepId}`, {
        method: "PUT",
        body: JSON.stringify({
          data: {
            subject: step.subject,
            from: FROM,
            from_name: FROM_NAME,
            reply_to: FROM,
            content: wrap(step.html),
          },
        }),
      });

      parentId = stepId;
    } else if (step.type === "delay") {
      // Create delay step
      const body: Record<string, unknown> = { type: "delay" };
      if (parentId) body.parent_id = parentId;

      const r = await ml<{ data: { id: string } }>(`/automations/${autoId}/steps`, {
        method: "POST",
        body: JSON.stringify(body),
      });
      const stepId = r.data.id;

      // Configure delay value
      await ml(`/automations/${autoId}/steps/${stepId}`, {
        method: "PUT",
        body: JSON.stringify({
          data: { value: step.value, unit: step.unit },
        }),
      });

      parentId = stepId;
    }
  }

  return autoId;
}

// ━━━ EMAIL CONTENT ━━━

const EMAILS = {
  welcome: `<h1 style="font-size:24px;margin:0 0 16px;">Welcome aboard.</h1><p>You made a great decision. Every week, I'll send you one actionable system you can deploy in your service business — AI agents, automations, and growth strategies that actually work.</p><p><strong>Here's what you can expect:</strong></p><ul style="margin:16px 0;"><li>One deep-dive email per week (5 min read, max)</li><li>Real systems I've built and deployed — not theory</li><li>Strategies that save 20+ hours/week</li></ul><p>I don't do fluff. Every email has something you can use the same day.</p><p>Hit reply and tell me: <strong>what's your biggest bottleneck right now?</strong> I read every response.</p><p style="margin-top:24px;">— Nicholaus</p>`,

  quickWin: `<h1 style="font-size:24px;margin:0 0 16px;">Your first quick win.</h1><p>Most service businesses lose leads because they respond too slowly. The data is brutal: <strong>78% of customers buy from whoever responds first.</strong></p><p>Here's a 10-minute fix:</p><ol style="margin:16px 0;"><li>Open your Google Business Profile</li><li>Turn on the messaging feature</li><li>Set up an auto-reply: <em>"Thanks for reaching out! I'll get back to you within 1 hour. In the meantime, here's a link to book a time that works for you: [your calendar link]"</em></li></ol><p>That's it. One auto-reply. You just beat 90% of your competitors on response time.</p><p style="margin-top:24px;">— Nicholaus</p>`,

  origin: `<h1 style="font-size:24px;margin:0 0 16px;">I used to work 70-hour weeks.</h1><p>Three years ago, I was running a service business and drowning. Every lead required a manual follow-up. Every invoice was sent by hand. Every client onboarding was a copy-paste disaster.</p><p>I was making good money but I had zero freedom. Sound familiar?</p><p>Then I built my first automation — a simple lead follow-up sequence that sent a text + email within 60 seconds of an inquiry. <strong>Close rate went from 12% to 34% overnight.</strong></p><p>That was the moment everything changed. I realized the bottleneck was never talent or effort — it was <em>systems.</em></p><p>Since then, I've built AI agents and automations for dozens of service businesses. The ones that win aren't working harder. They're working on the right systems.</p><p style="margin-top:24px;">— Nicholaus</p>`,

  caseStudy1: `<h1 style="font-size:24px;margin:0 0 16px;">From chaos to clockwork.</h1><p>Mike runs a 6-person plumbing company in Austin. When he came to me, he was:</p><ul style="margin:16px 0;"><li>Spending 3 hours/day on follow-ups and quoting</li><li>Losing 40% of leads to slow response times</li><li>Paying a part-time admin $2,400/mo just to manage scheduling</li></ul><p><strong>What we built:</strong></p><ol style="margin:16px 0;"><li>AI agent that responds to new leads in under 60 seconds</li><li>Automated quoting system from a simple form</li><li>Smart scheduling synced with his crew's availability</li></ol><p><strong>Results after 30 days:</strong></p><ul style="margin:16px 0;"><li>Lead response time: 4 hours → 47 seconds</li><li>Close rate: 18% → 41%</li><li>Admin hours saved: 20+/week</li><li>Eliminated the part-time admin role entirely</li></ul><p style="margin-top:24px;">— Nicholaus</p>`,

  mistake: `<h1 style="font-size:24px;margin:0 0 16px;">You're probably making this mistake.</h1><p>The #1 lead killer I see across every industry:</p><p style="font-size:18px;font-weight:bold;text-align:center;padding:20px;background:#f9f9f9;border-radius:4px;margin:24px 0;">You're treating all leads the same.</p><p><strong>The fix is lead scoring + routing:</strong></p><ul style="margin:16px 0;"><li><strong>Hot leads</strong> (referrals, repeat) → instant call-back within 5 min</li><li><strong>Warm leads</strong> (form fills, ad clicks) → automated text + email within 60 sec</li><li><strong>Cold leads</strong> (social, general) → automated nurture sequence over 7 days</li></ul><p>This alone can 2x your close rate without spending an extra dollar on ads.</p><p style="margin-top:24px;">— Nicholaus</p>`,

  freeResource: `<h1 style="font-size:24px;margin:0 0 16px;">I made this for you.</h1><p><strong>The Lead Response Checklist — 7 steps to never lose a lead again:</strong></p><div style="padding:20px;background:#f9f9f9;border-radius:4px;margin:24px 0;"><p style="margin:0 0 8px;font-weight:bold;">✓ Auto-reply within 60 seconds</p><p style="margin:0 0 8px;font-weight:bold;">✓ Personal follow-up within 1 hour</p><p style="margin:0 0 8px;font-weight:bold;">✓ Qualify with 3 questions before quoting</p><p style="margin:0 0 8px;font-weight:bold;">✓ Send quote within 24 hours</p><p style="margin:0 0 8px;font-weight:bold;">✓ Follow up at 24hr, 72hr, and 7 days</p><p style="margin:0 0 8px;font-weight:bold;">✓ Add unconverted leads to 30-day nurture</p><p style="margin:0;font-weight:bold;">✓ Review and improve monthly</p></div><p>Screenshot this. Share it with your team. It works.</p><p style="margin-top:24px;">— Nicholaus</p>`,

  behindScenes: `<h1 style="font-size:24px;margin:0 0 16px;">Let me show you my setup.</h1><p>Here's what runs in my business, 100% automated:</p><p><strong>Lead capture → qualification → booking:</strong> An AI agent scores leads, sends personalized responses, and books calls. I don't see the lead until the call starts.</p><p><strong>Client onboarding:</strong> Welcome email, project creation, shared folder, kickoff call — all triggered by a signed contract.</p><p><strong>Invoicing:</strong> Auto-generated based on milestones. Late payment reminders at 3, 7, and 14 days.</p><p>Total time on ops per week: <strong>about 2 hours.</strong></p><p>This isn't about being lazy. It's about putting your time where it moves the needle.</p><p style="margin-top:24px;">— Nicholaus</p>`,

  caseStudy2: `<h1 style="font-size:24px;margin:0 0 16px;">She thought she needed more ad budget.</h1><p>Sarah runs a cleaning company. $1,200/mo on Google Ads, 4 leads/week. She wanted to double her budget.</p><p>I said: <strong>"You don't have a traffic problem. You have a conversion problem."</strong></p><p><strong>What we changed (zero increase in ad spend):</strong></p><ol style="margin:16px 0;"><li>Instant auto-reply + SMS within 60 seconds</li><li>5-touch follow-up sequence over 7 days</li><li>Post-service review request automation</li><li>Referral program with automated tracking</li></ol><p><strong>Results after 60 days:</strong></p><ul style="margin:16px 0;"><li>Leads: 4/week → 40/week (same ad spend)</li><li>Google reviews: 12 → 89</li><li>Revenue: up 340%</li></ul><p style="margin-top:24px;">— Nicholaus</p>`,

  mythBust: `<h1 style="font-size:24px;margin:0 0 16px;">Let me bust this myth.</h1><p><em>"AI sounds great, but my business is too hands-on. Clients expect a human."</em></p><p><strong>AI doesn't replace the human touch. It protects it.</strong></p><p>When you automate the admin — follow-ups, scheduling, invoicing — you free up time for the work that requires a human: the consultation, the relationship, the craft.</p><p>Businesses <em>without</em> automation deliver a worse human experience because the owner is buried in admin.</p><p><strong>You don't need to be technical.</strong> The tools exist. You need someone to connect the dots.</p><p style="margin-top:24px;">— Nicholaus</p>`,

  socialProof: `<h1 style="font-size:24px;margin:0 0 16px;">You're in good company.</h1><p>What subscribers have built:</p><div style="padding:16px;background:#f9f9f9;border-radius:4px;margin:16px 0;border-left:3px solid #FDD835;"><p style="margin:0;font-style:italic;">"Built the auto-reply system from your Day 1 email. Already seeing more bookings."</p><p style="margin:8px 0 0;font-size:13px;color:#666;">— Jake M., Landscaping</p></div><div style="padding:16px;background:#f9f9f9;border-radius:4px;margin:16px 0;border-left:3px solid #FDD835;"><p style="margin:0;font-style:italic;">"The review automation alone was worth subscribing. Google ranking jumped from page 3 to top 5."</p><p style="margin:8px 0 0;font-size:13px;color:#666;">— Diana K., Property Management</p></div><div style="padding:16px;background:#f9f9f9;border-radius:4px;margin:16px 0;border-left:3px solid #FDD835;"><p style="margin:0;font-style:italic;">"Saved $1,800/mo by replacing my VA with the automation stack."</p><p style="margin:8px 0 0;font-size:13px;color:#666;">— Marcus R., HVAC</p></div><p>Your turn. Hit reply and tell me what you've built.</p><p style="margin-top:24px;">— Nicholaus</p>`,

  theGap: `<h1 style="font-size:24px;margin:0 0 16px;">Two businesses. Same revenue. Different futures.</h1><p>Business A: Owner handles every lead personally. Quotes take 48 hours. No documented processes. Hiring feels impossible.</p><p>Business B: Leads auto-qualified and routed. Quotes in minutes. New hires ramp in days because every process is documented and automated.</p><p>Both make $500k/year today. In 2 years, A will still be at $500k. B will be at $1.5M.</p><p><strong>The gap isn't talent or effort. It's systems.</strong></p><p>I have something that can accelerate this. More in a few days.</p><p style="margin-top:24px;">— Nicholaus</p>`,

  tripwirePitch: `<h1 style="font-size:24px;margin:0 0 16px;">A thank-you for sticking around.</h1><p>I built something for people like you: <strong>AI Automation 101</strong> — a step-by-step course that turns everything I've shared into a system you can deploy this week.</p><ul style="margin:16px 0;"><li>5 video modules (2+ hours)</li><li>Build your first AI agent in under 60 minutes</li><li>Copy-paste automation templates</li><li>Lifetime access + updates</li></ul><p>Normally $97. For subscribers: <strong>$17</strong>.</p><p style="text-align:center;margin:24px 0;"><a href="${SITE}/offer" style="display:inline-block;padding:14px 32px;background:#FDD835;color:#0A0A0A;font-weight:800;text-decoration:none;border-radius:3px;font-size:16px;">Get AI Automation 101 — $17</a></p><p style="font-size:13px;color:#666;text-align:center;">One-time payment. Lifetime access. All sales final.</p><p style="margin-top:24px;">— Nicholaus</p>`,

  coreOfferPitch: `<h1 style="font-size:24px;margin:0 0 16px;">Ready to go deeper?</h1><p>Generic frameworks only get you so far. Your business has specific bottlenecks and a specific growth ceiling.</p><p>The <strong>Google Ads Audit</strong> is a deep-dive into your ad account that finds wasted spend, missed opportunities, and the exact levers to pull.</p><ul style="margin:16px 0;"><li>12-page custom audit report</li><li>Wasted spend analysis (avg finding: $500+/mo)</li><li>Competitor intel + keyword gaps</li><li>Landing page review</li><li>Video walkthrough of findings</li></ul><p style="text-align:center;margin:24px 0;"><a href="${SITE}/checkout/audit" style="display:inline-block;padding:14px 32px;background:#FDD835;color:#0A0A0A;font-weight:800;text-decoration:none;border-radius:3px;font-size:16px;">Book Your Audit — $497</a></p><p>Most clients find it pays for itself within the first week.</p><p style="margin-top:24px;">— Nicholaus</p>`,
};

// ━━━ BUILD ALL ━━━

async function main() {
  console.log("🚀 Building MailerLite Automations\n");

  const gNewsletter = await groupId("newsletter");
  const gTripwireBought = await groupId("tripwire_bought");
  const gCheckoutAbandoned = await groupId("checkout_abandoned");
  const gBuyerAll = await groupId("buyer_all");

  // 1. WELCOME + TRUST (30-day)
  console.log("📧 1/5: Welcome + Trust Building (30-day nurture)...");
  await buildAutomation("Welcome + Trust Building (30-day)", gNewsletter, [
    { type: "email", subject: "Welcome to Nicholaus.ai — here's what to expect", html: EMAILS.welcome },
    { type: "delay", value: 1, unit: "days" },
    { type: "email", subject: "Do this one thing today (takes 10 minutes)", html: EMAILS.quickWin },
    { type: "delay", value: 2, unit: "days" },
    { type: "email", subject: "Why I started building systems (personal story)", html: EMAILS.origin },
    { type: "delay", value: 2, unit: "days" },
    { type: "email", subject: "Case study: How a plumber saved 20hrs/week", html: EMAILS.caseStudy1 },
    { type: "delay", value: 2, unit: "days" },
    { type: "email", subject: "The #1 mistake killing your leads (and the fix)", html: EMAILS.mistake },
    { type: "delay", value: 3, unit: "days" },
    { type: "email", subject: "Free resource: The Lead Response Checklist", html: EMAILS.freeResource },
    { type: "delay", value: 3, unit: "days" },
    { type: "email", subject: "Behind the scenes: How I automate my own business", html: EMAILS.behindScenes },
    { type: "delay", value: 3, unit: "days" },
    { type: "email", subject: "Case study: From 4 to 40 leads/week (cleaning company)", html: EMAILS.caseStudy2 },
    { type: "delay", value: 3, unit: "days" },
    { type: "email", subject: "Myth: \"AI is too complicated for my business\"", html: EMAILS.mythBust },
    { type: "delay", value: 3, unit: "days" },
    { type: "email", subject: "What subscribers are building (real results)", html: EMAILS.socialProof },
    { type: "delay", value: 3, unit: "days" },
    { type: "email", subject: "The gap between businesses that scale and those that stall", html: EMAILS.theGap },
    { type: "delay", value: 3, unit: "days" },
    { type: "email", subject: "I made a course for subscribers like you ($17)", html: EMAILS.tripwirePitch },
    { type: "delay", value: 2, unit: "days" },
    { type: "email", subject: "Ready to go deeper? Here's the next step.", html: EMAILS.coreOfferPitch },
  ]);
  console.log("  ✅ 13 emails + 12 delays\n");

  // 2. POST-TRIPWIRE
  console.log("📧 2/5: Post-Tripwire → Core Offer...");
  await buildAutomation("Post-Tripwire → Core Offer", gTripwireBought, [
    { type: "email", subject: "Your course is ready — start here", html: `<h1 style="font-size:24px;margin:0 0 16px;">You're in. Let's go.</h1><p>Your AI Automation 101 course is ready.</p><p><strong>Start with Module 1.</strong> It's 20 minutes and gives you the framework for everything that follows.</p><p>Then jump to Module 2 and build your first agent. By the end, you'll have a working automation in your business.</p><p>Pro tip: <strong>implement as you watch.</strong> Don't binge.</p><p>Questions? Reply to this email.</p><p style="margin-top:24px;">— Nicholaus</p>` },
    { type: "delay", value: 3, unit: "days" },
    { type: "email", subject: "How's Module 1 going?", html: `<h1 style="font-size:24px;margin:0 0 16px;">Quick check-in.</h1><p>You've had the course for a few days. How's it going?</p><p>If you haven't started — <strong>the businesses that implement within the first week see 3x the results.</strong></p><p>Open the course and spend 20 minutes today. That's all it takes.</p><p style="margin-top:24px;">— Nicholaus</p>` },
    { type: "delay", value: 4, unit: "days" },
    { type: "email", subject: "Your business on autopilot — what's next", html: `<h1 style="font-size:24px;margin:0 0 16px;">You've built the foundation. Here's the next level.</h1><p>The course gives you the systems. But every business has unique bottlenecks that generic templates can't solve.</p><p>The <strong>Google Ads Audit</strong> shows you exactly where you're wasting money and what to fix.</p><p style="text-align:center;margin:24px 0;"><a href="${SITE}/checkout/audit" style="display:inline-block;padding:14px 32px;background:#FDD835;color:#0A0A0A;font-weight:800;text-decoration:none;border-radius:3px;font-size:16px;">Book Your Audit — $497</a></p><p style="margin-top:24px;">— Nicholaus</p>` },
  ]);
  console.log("  ✅ 3 emails + 2 delays\n");

  // 3. CHECKOUT ABANDONMENT
  console.log("📧 3/5: Checkout Abandonment Recovery...");
  await buildAutomation("Checkout Abandonment Recovery", gCheckoutAbandoned, [
    { type: "delay", value: 1, unit: "hours" },
    { type: "email", subject: "You left something behind", html: `<h1 style="font-size:24px;margin:0 0 16px;">Still interested?</h1><p>I noticed you started checkout but didn't finish. No pressure — just making sure nothing went wrong.</p><p>If you had a technical issue or a question, hit reply.</p><p style="text-align:center;margin:24px 0;"><a href="${SITE}/checkout/audit" style="display:inline-block;padding:14px 32px;background:#FDD835;color:#0A0A0A;font-weight:800;text-decoration:none;border-radius:3px;font-size:16px;">Complete Your Purchase</a></p><p style="margin-top:24px;">— Nicholaus</p>` },
    { type: "delay", value: 1, unit: "days" },
    { type: "email", subject: "Here's what others are saying", html: `<h1 style="font-size:24px;margin:0 0 16px;">Don't just take my word for it.</h1><div style="padding:16px;background:#f9f9f9;border-radius:4px;margin:16px 0;border-left:3px solid #FDD835;"><p style="margin:0;font-style:italic;">"Found $1,800/mo in wasted ad spend. Paid for itself in a week."</p><p style="margin:8px 0 0;font-size:13px;color:#666;">— Mike R., Plumber, Austin TX</p></div><p style="text-align:center;margin:24px 0;"><a href="${SITE}/checkout/audit" style="display:inline-block;padding:14px 32px;background:#FDD835;color:#0A0A0A;font-weight:800;text-decoration:none;border-radius:3px;font-size:16px;">Complete Your Purchase</a></p><p style="margin-top:24px;">— Nicholaus</p>` },
    { type: "delay", value: 2, unit: "days" },
    { type: "email", subject: "Last chance — final reminder", html: `<h1 style="font-size:24px;margin:0 0 16px;">Final reminder.</h1><p>This is my last email about this. If now's not the right time, no hard feelings.</p><p>But if the only thing stopping you is procrastination:</p><p style="font-size:18px;font-weight:bold;text-align:center;padding:20px;background:#f9f9f9;border-radius:4px;margin:24px 0;">Every week you wait is another week of wasted ad spend.</p><p style="text-align:center;margin:24px 0;"><a href="${SITE}/checkout/audit" style="display:inline-block;padding:14px 32px;background:#FDD835;color:#0A0A0A;font-weight:800;text-decoration:none;border-radius:3px;font-size:16px;">Complete Your Purchase</a></p><p style="margin-top:24px;">— Nicholaus</p>` },
  ]);
  console.log("  ✅ 3 emails + 3 delays (1hr, 1day, 2days)\n");

  // 4. POST-PURCHASE
  console.log("📧 4/5: Post-Purchase Onboarding + Review...");
  await buildAutomation("Post-Purchase Onboarding + Review", gBuyerAll, [
    { type: "delay", value: 3, unit: "days" },
    { type: "email", subject: "How's everything going?", html: `<h1 style="font-size:24px;margin:0 0 16px;">Quick check-in.</h1><p>Just making sure you got everything you need from your recent purchase.</p><p>If you have any questions or need help, reply to this email. I respond personally.</p><p style="margin-top:24px;">— Nicholaus</p>` },
    { type: "delay", value: 4, unit: "days" },
    { type: "email", subject: "Quick favor? (30 seconds)", html: `<h1 style="font-size:24px;margin:0 0 16px;">Would you leave a quick review?</h1><p>If you've gotten value from your purchase, I'd really appreciate a quick testimonial.</p><p>Just reply to this email with 1-2 sentences about your experience. That's it.</p><p>Thank you — it means more than you know.</p><p style="margin-top:24px;">— Nicholaus</p>` },
  ]);
  console.log("  ✅ 2 emails + 2 delays\n");

  // 5. RE-ENGAGEMENT
  console.log("📧 5/5: Re-engagement (inactive)...");
  await buildAutomation("Re-engagement (Inactive 60 days)", null, [
    { type: "email", subject: "Haven't heard from you in a while", html: `<h1 style="font-size:24px;margin:0 0 16px;">Still there?</h1><p>I noticed you haven't opened an email in a while. No hard feelings.</p><p>Here's what you missed:</p><ul style="margin:16px 0;"><li>How a plumber saved 20hrs/week with 3 automations</li><li>The lead response framework that 2x'd close rates</li><li>My personal automation stack (behind the scenes)</li></ul><p>If you want to stay, no action needed. If not, the unsubscribe link is below.</p><p style="margin-top:24px;">— Nicholaus</p>` },
    { type: "delay", value: 7, unit: "days" },
    { type: "email", subject: "Last email unless you want to stay", html: `<h1 style="font-size:24px;margin:0 0 16px;">Should I remove you?</h1><p>I only email people who find this valuable.</p><p>If you want to keep receiving weekly systems insights, click below:</p><p style="text-align:center;margin:24px 0;"><a href="${SITE}/newsletter" style="display:inline-block;padding:14px 32px;background:#FDD835;color:#0A0A0A;font-weight:800;text-decoration:none;border-radius:3px;font-size:16px;">Yes, keep me subscribed</a></p><p>If I don't hear from you, I'll remove you in a few days. No hard feelings.</p><p style="margin-top:24px;">— Nicholaus</p>` },
  ]);
  console.log("  ✅ 2 emails + 1 delay\n");

  console.log("✅ All 5 automations built!");
  console.log("\n📋 Next steps:");
  console.log("  1. Go to MailerLite → Automations");
  console.log("  2. Review email content in each automation");
  console.log("  3. Set Re-engagement trigger to 'inactive 60 days' in dashboard");
  console.log("  4. Enable each automation when ready");
  console.log("  5. Verify info@nicholaus.ai as sender in MailerLite settings");
}

main().catch(console.error);
