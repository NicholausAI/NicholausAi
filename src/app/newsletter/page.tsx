"use client";

import { useRef, type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Header, Footer } from "@/components/layout";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
} from "framer-motion";
import {
  CheckCircle,
  Mail,
  Zap,
  TrendingUp,
  Clock,
  ArrowRight,
  BarChart3,
  Bot,
  Target,
  Users,
  Shield,
} from "lucide-react";

/* ━━━ EMAIL OPTIN ━━━ */
function EmailOptin({
  id,
  buttonText = "Subscribe",
  className = "",
  size = "default",
}: {
  id: string;
  buttonText?: string;
  className?: string;
  size?: "default" | "large";
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {}
    setStatus("success");
    setEmail("");
    router.push("/offer");
  };

  if (status === "success")
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <CheckCircle className="w-5 h-5 text-[var(--accent)]" />
        <span className="text-[16px] font-semibold">
          Redirecting...
        </span>
      </div>
    );

  const py = size === "large" ? "py-4" : "py-3.5";
  const text = size === "large" ? "text-[16px]" : "text-[15px]";

  return (
    <form onSubmit={submit} className={`flex gap-2 ${className}`}>
      <input
        id={id}
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className={`flex-1 min-w-0 px-4 ${py} ${text} rounded-[3px] border border-[var(--border-default)] text-[var(--foreground)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--foreground)] transition-colors bg-[var(--background)]`}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className={`px-6 ${py} rounded-[3px] bg-[var(--accent)] text-force-white font-bold ${text} hover:bg-[var(--accent-hover)] transition-all shrink-0 disabled:opacity-60`}
      >
        {status === "loading" ? "..." : buttonText}
      </button>
    </form>
  );
}

/* ━━━ REVEAL WRAPPER ━━━ */
function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ━━━ DATA ━━━ */
const VALUE_PROPS = [
  {
    icon: Bot,
    title: "AI Systems & Agents",
    description:
      "Practical breakdowns of AI automations that replace manual work — lead routing, follow-ups, quoting, and more.",
  },
  {
    icon: TrendingUp,
    title: "Growth Strategies",
    description:
      "Acquisition frameworks, funnel teardowns, and conversion tactics tested on real service businesses.",
  },
  {
    icon: BarChart3,
    title: "Ops Playbooks",
    description:
      "Step-by-step systems for scheduling, invoicing, and client management that scale without adding headcount.",
  },
  {
    icon: Target,
    title: "Lead Generation",
    description:
      "What's actually working right now to generate qualified leads — paid, organic, referral, and hybrid.",
  },
  {
    icon: Zap,
    title: "Automation Blueprints",
    description:
      "Copy-paste workflows for tools like Make, Zapier, and custom APIs that save 20+ hours a week.",
  },
  {
    icon: Shield,
    title: "No Fluff Guarantee",
    description:
      "Every issue is built around one actionable idea you can implement the same week. Signal only.",
  },
];

const PAST_TOPICS = [
  "How I built a $0 lead-gen system that books 12 calls/week",
  "The AI agent stack replacing a $60k/yr admin hire",
  "3 automations every contractor should run on day one",
  "Why your CRM is losing you money (and what to use instead)",
  "Quoting in 90 seconds: the GPT-powered estimator",
  "From 2 to 40 reviews/month without asking twice",
];

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   PAGE
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function NewsletterPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* ─── HERO ─── */}
        <section
          ref={heroRef}
          className="relative min-h-[92vh] flex items-center overflow-hidden bg-blueprint"
        >
          {/* Accent glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--accent-glow)] via-transparent to-transparent opacity-60 pointer-events-none" />

          {/* Animated envelope SVG background */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <svg
              className="absolute bottom-0 left-0 w-full"
              viewBox="0 0 1440 400"
              preserveAspectRatio="none"
              style={{ height: "45%" }}
            >
              <motion.path
                d="M0,400 L0,320 C200,310 400,280 600,240 C800,200 1000,180 1200,140 C1320,110 1380,95 1440,80 L1440,400 Z"
                fill="url(#nlGlow)"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
              />
              <motion.path
                d="M0,320 C200,310 400,280 600,240 C800,200 1000,180 1200,140 C1320,110 1380,95 1440,80"
                fill="none"
                stroke="#FDD835"
                strokeWidth="2.5"
                strokeOpacity="0.4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2.5, delay: 0.3, ease: "easeOut" }}
              />
              <motion.path
                d="M0,320 C200,310 400,280 600,240 C800,200 1000,180 1200,140 C1320,110 1380,95 1440,80"
                fill="none"
                stroke="#FDD835"
                strokeWidth="8"
                strokeOpacity="0.12"
                style={{ filter: "blur(4px)" }}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2.5, delay: 0.3, ease: "easeOut" }}
              />
              <motion.circle
                r="4"
                fill="#FDD835"
                initial={{ offsetDistance: "0%" }}
                animate={{ offsetDistance: "100%" }}
                transition={{
                  duration: 10,
                  delay: 1,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "loop",
                }}
                style={{
                  offsetPath:
                    "path('M0,320 C200,310 400,280 600,240 C800,200 1000,180 1200,140 C1320,110 1380,95 1440,80')",
                }}
              />
              <defs>
                <linearGradient id="nlGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FDD835" stopOpacity="0.12" />
                  <stop offset="50%" stopColor="#FDD835" stopOpacity="0.04" />
                  <stop offset="100%" stopColor="#FDD835" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <motion.div
            style={{ y: heroY, opacity: heroOpacity }}
            className="relative z-10 max-w-[680px] mx-auto px-5 sm:px-8 text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--surface)] border border-[var(--border)] mb-8"
            >
              <Mail className="w-4 h-4 text-[var(--accent)]" />
              <span className="text-sm font-medium text-[var(--muted)]">
                Free weekly newsletter
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-[clamp(2.2rem,5vw,3.5rem)] font-extrabold leading-[1.1] tracking-tight mb-5"
            >
              The systems playbook for{" "}
              <span className="gradient-text">service businesses</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-[16px] sm:text-[17px] text-[var(--muted)] leading-[1.7] mb-5 max-w-[520px] mx-auto"
            >
              Every week I break down one AI system, automation, or growth
              strategy you can steal and deploy in your business — no theory,
              just things that work.
            </motion.p>

            {/* Inline stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-baseline justify-center gap-5 sm:gap-8 mb-8 flex-wrap"
            >
              {[
                { stat: "Weekly", label: "issues" },
                { stat: "5 min", label: "read" },
                { stat: "100%", label: "free" },
              ].map((s) => (
                <div key={s.label} className="flex items-baseline gap-1.5">
                  <span className="text-[16px] sm:text-[18px] font-extrabold tracking-tight">
                    {s.stat}
                  </span>
                  <span className="text-[11px] sm:text-[12px] text-[var(--text-tertiary)]">
                    {s.label}
                  </span>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="max-w-[460px] mx-auto mb-4"
            >
              <EmailOptin
                id="hero-nl"
                buttonText="Get the playbook →"
                size="large"
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
              className="text-[12px] text-[var(--text-tertiary)]"
            >
              No spam. Unsubscribe in one click.
            </motion.p>
          </motion.div>
        </section>

        {/* ─── WHAT YOU GET ─── */}
        <section className="py-24 sm:py-32 relative">
          <div className="max-w-[1100px] mx-auto px-5 sm:px-8">
            <Reveal>
              <div className="text-center mb-16">
                <p className="text-[13px] font-semibold text-[var(--accent)] mb-3 tracking-wide uppercase">
                  What&apos;s inside
                </p>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
                  Built for operators,{" "}
                  <span className="text-[var(--accent)]">not spectators</span>
                </h2>
                <p className="text-[var(--muted)] text-[16px] max-w-xl mx-auto leading-relaxed">
                  Every issue is designed to give you one concrete system you can
                  implement this week to save time, generate leads, or cut costs.
                </p>
              </div>
            </Reveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {VALUE_PROPS.map((item, i) => (
                <Reveal key={item.title} delay={i * 0.08}>
                  <div className="group p-6 rounded-[3px] border border-[var(--border)] bg-[var(--background)] hover:border-[var(--accent)] transition-all duration-300 h-full">
                    <div className="w-10 h-10 rounded-[3px] bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center mb-4 group-hover:border-[var(--accent)] transition-colors">
                      <item.icon className="w-5 h-5 text-[var(--accent)]" />
                    </div>
                    <h3 className="text-[15px] font-bold mb-2">{item.title}</h3>
                    <p className="text-[14px] text-[var(--muted)] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ─── PAST ISSUES ─── */}
        <section className="py-24 sm:py-32 bg-[var(--surface)] relative">
          <div className="max-w-[720px] mx-auto px-5 sm:px-8">
            <Reveal>
              <div className="text-center mb-12">
                <p className="text-[13px] font-semibold text-[var(--accent)] mb-3 tracking-wide uppercase">
                  Recent issues
                </p>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  A sample of what{" "}
                  <span className="text-[var(--accent)]">you&apos;ll get</span>
                </h2>
              </div>
            </Reveal>

            <div className="space-y-3">
              {PAST_TOPICS.map((topic, i) => (
                <Reveal key={topic} delay={i * 0.06}>
                  <div className="flex items-start gap-4 p-4 rounded-[3px] bg-[var(--background)] border border-[var(--border)] hover:border-[var(--accent)] transition-colors group">
                    <div className="w-8 h-8 rounded-[3px] bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center shrink-0 mt-0.5 group-hover:border-[var(--accent)] transition-colors">
                      <span className="text-[12px] font-bold text-[var(--accent)]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <p className="text-[15px] font-medium leading-snug">
                      {topic}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ─── SOCIAL PROOF ─── */}
        <section className="py-24 sm:py-32 relative">
          <div className="max-w-[900px] mx-auto px-5 sm:px-8">
            <Reveal>
              <div className="text-center mb-14">
                <p className="text-[13px] font-semibold text-[var(--accent)] mb-3 tracking-wide uppercase">
                  From subscribers
                </p>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  What readers{" "}
                  <span className="text-[var(--accent)]">are saying</span>
                </h2>
              </div>
            </Reveal>

            <div className="grid sm:grid-cols-2 gap-6">
              {[
                {
                  quote:
                    "This newsletter paid for itself in week one. Implemented the AI follow-up system and booked 8 extra jobs that month.",
                  name: "Jake M.",
                  role: "Landscaping Co. Owner",
                },
                {
                  quote:
                    "I was spending 15 hours a week on admin. After three issues, I automated half of it. Genuinely changed how I run my business.",
                  name: "Sarah T.",
                  role: "Cleaning Service Founder",
                },
                {
                  quote:
                    "No fluff, no filler. Every issue has something I can actually use. It's the only newsletter I read the day it hits my inbox.",
                  name: "Marcus R.",
                  role: "HVAC Business Owner",
                },
                {
                  quote:
                    "The lead gen automation alone was worth subscribing. Went from 4 to 18 qualified leads a week without spending an extra dollar on ads.",
                  name: "Diana K.",
                  role: "Property Manager",
                },
              ].map((t, i) => (
                <Reveal key={t.name} delay={i * 0.1}>
                  <div className="p-6 rounded-[3px] border border-[var(--border)] bg-[var(--background)] h-full flex flex-col">
                    <p className="text-[15px] text-[var(--muted)] leading-relaxed mb-5 flex-1">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center">
                        <Users className="w-4 h-4 text-[var(--accent)]" />
                      </div>
                      <div>
                        <p className="text-[14px] font-semibold">{t.name}</p>
                        <p className="text-[12px] text-[var(--text-tertiary)]">
                          {t.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FINAL CTA ─── */}
        <section className="py-24 sm:py-32 relative overflow-hidden">
          {/* Dark background */}
          <div className="absolute inset-0 bg-[var(--primary)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(253,216,53,0.06)] to-transparent" />

          <div className="relative z-10 max-w-[580px] mx-auto px-5 sm:px-8 text-center">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] mb-8">
                <Zap className="w-4 h-4 text-[var(--accent)]" />
                <span className="text-sm font-medium text-[rgba(255,255,255,0.5)]">
                  Start this week
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
                Stop reading about systems.
                <br />
                <span className="gradient-text">Start building them.</span>
              </h2>

              <p className="text-[16px] text-[rgba(255,255,255,0.5)] leading-relaxed mb-8 max-w-md mx-auto">
                Join operators who are using AI and automation to run leaner,
                more profitable service businesses. One actionable issue, every
                week.
              </p>

              <div className="max-w-[420px] mx-auto mb-4">
                <EmailOptin
                  id="footer-nl"
                  buttonText="Subscribe free →"
                  size="large"
                />
              </div>

              <p className="text-[12px] text-[rgba(255,255,255,0.3)]">
                Free forever. Unsubscribe anytime. No spam — ever.
              </p>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
