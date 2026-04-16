"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Header, Footer } from "@/components/layout";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValueEvent,
} from "framer-motion";
import {
  ArrowRight, CheckCircle, Play, Bot, Target, Wrench,
  TrendingUp, Mic, BookOpen, Mail, BarChart3, Zap,
  Users, MessageSquare, Shield, Lock, Clock, DollarSign, Star,
} from "lucide-react";

/* ━━━ EMAIL OPTIN ━━━ */
function EmailOptin({ id, buttonText = "Subscribe", className = "" }: { id: string; buttonText?: string; className?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try { await fetch("/api/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) }); } catch {}
    setStatus("success");
    setEmail("");
    router.push("/offer");
  };
  if (status === "success") return <div className={`flex items-center gap-2 ${className}`}><CheckCircle className="w-5 h-5 text-[var(--accent)]" /><span className="text-[16px] font-semibold">Redirecting...</span></div>;
  return (
    <form onSubmit={submit} className={`flex gap-2 ${className}`}>
      <input id={id} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email"
        className="flex-1 min-w-0 px-4 py-3.5 text-[15px] rounded-[3px] border border-[var(--border-default)] text-[var(--foreground)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--foreground)] transition-colors bg-[var(--background)]" />
      <button type="submit" disabled={status === "loading"}
        className="px-6 py-3.5 rounded-[3px] bg-[var(--accent)] text-force-white font-bold text-[15px] hover:bg-[var(--accent-hover)] transition-all shrink-0 disabled:opacity-60">
        {status === "loading" ? "..." : buttonText}
      </button>
    </form>
  );
}

/* ━━━ REVEAL WRAPPER ━━━ */
function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   HERO
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.97]);

  return (
    <section ref={ref} className="relative pt-10 sm:pt-16 pb-20 sm:pb-28 overflow-hidden bg-blueprint">
      {/* Chart bg */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 400" preserveAspectRatio="none" style={{ height: "50%" }}>
          {/* Glow fill */}
          <motion.path
            d="M0,400 L0,350 C180,340 360,300 540,250 C720,200 900,170 1080,120 C1260,70 1350,45 1440,30 L1440,400 Z"
            fill="url(#hc)"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
          />
          {/* Main line */}
          <motion.path
            d="M0,350 C180,340 360,300 540,250 C720,200 900,170 1080,120 C1260,70 1350,45 1440,30"
            fill="none" stroke="#FDD835" strokeWidth="3" strokeOpacity="0.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.5, delay: 0.3, ease: "easeOut" }}
          />
          {/* Glow line (thicker, blurred) */}
          <motion.path
            d="M0,350 C180,340 360,300 540,250 C720,200 900,170 1080,120 C1260,70 1350,45 1440,30"
            fill="none" stroke="#FDD835" strokeWidth="8" strokeOpacity="0.15"
            style={{ filter: "blur(4px)" }}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.5, delay: 0.3, ease: "easeOut" }}
          />
          {/* Animated dot on the line */}
          <motion.circle
            r="5" fill="#FDD835"
            initial={{ offsetDistance: "0%" }}
            animate={{ offsetDistance: "100%" }}
            transition={{ duration: 10, delay: 1, ease: "easeInOut", repeat: Infinity, repeatType: "loop" }}
            style={{ offsetPath: "path('M0,350 C180,340 360,300 540,250 C720,200 900,170 1080,120 C1260,70 1350,45 1440,30')" }}
          />
          <defs>
            <linearGradient id="hc" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FDD835" stopOpacity="0.15" />
              <stop offset="50%" stopColor="#FDD835" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#FDD835" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <motion.div style={{ y, opacity, scale }} className="relative z-10 max-w-[1200px] mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left — Copy + form */}
          <div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }}
              className="text-[13px] font-semibold text-[var(--accent)] mb-4">
              Weekly &middot; AI for Service Businesses
            </motion.p>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="text-[clamp(2rem,4.5vw,3rem)] font-extrabold leading-[1.12] tracking-tight mb-4">
              Engineering automated systems for leads, ops&nbsp;&&nbsp;sales.
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
              className="text-[15px] text-[var(--muted)] leading-[1.65] mb-4 max-w-[440px]">
              Weekly insights on AI agents, systems and strategies built to get you more leads, close more jobs and cut admin hours — saving 20+ hours a week.
            </motion.p>

            {/* Stats inline */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-baseline gap-3 sm:gap-5 mb-6 flex-wrap">
              {[
                { stat: "40%", label: "less waste" },
                { stat: "20hrs/wk", label: "saved" },
                { stat: "2–4x", label: "leads" },
              ].map((s) => (
                <div key={s.label} className="flex items-baseline gap-1">
                  <span className="text-[15px] sm:text-[18px] font-extrabold tracking-tight">{s.stat}</span>
                  <span className="text-[11px] sm:text-[12px] text-[var(--text-tertiary)]">{s.label}</span>
                </div>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}
              className="mb-3 max-w-[440px]">
              <EmailOptin id="hero" buttonText="Get the systems →" />
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}
              className="flex items-center gap-4 text-[12px] text-[var(--text-tertiary)]">
              {["Free", "5 min read", "Unsubscribe anytime"].map((t) => (
                <span key={t} className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-[var(--accent)]" /> {t}</span>
              ))}
            </motion.div>
          </div>

          {/* Right — Newsletter preview mockup */}
          <motion.div initial={{ opacity: 0, y: 25, rotate: 1 }} animate={{ opacity: 1, y: 0, rotate: 1 }} transition={{ duration: 0.9, delay: 0.3 }} className="hidden lg:block">
            <div className="rounded-[4px] bg-[var(--background)] border border-[var(--border)] shadow-xl shadow-black/[0.05] p-5 relative">
              {/* Email chrome */}
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[var(--border)]">
                <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center shrink-0">
                  <span className="text-force-white text-[11px] font-bold">TC</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold">Nicholaus Weekly</p>
                  <p className="text-[11px] text-[var(--text-tertiary)]">Every Thursday</p>
                </div>
                <span className="text-[11px] text-[var(--text-tertiary)] bg-[var(--surface)] px-2 py-0.5 rounded-[3px]">5 min</span>
              </div>

              {/* Subject */}
              <h3 className="text-[16px] font-bold mb-2">How one plumber cut ad spend by 60% with AI</h3>
              <p className="text-[13px] text-[var(--muted)] leading-relaxed mb-4">The exact Google Ads structure, an AI chatbot walkthrough, and why most contractor sites don&apos;t convert...</p>

              {/* Content preview lines */}
              <div className="space-y-2 mb-4">
                <div className="h-2.5 bg-[var(--border)] rounded-full w-full opacity-40" />
                <div className="h-2.5 bg-[var(--border)] rounded-full w-[93%] opacity-40" />
                <div className="h-2.5 bg-[var(--border)] rounded-full w-[87%] opacity-40" />
                <div className="h-2.5 bg-[var(--border)] rounded-full w-[60%] opacity-40" />
              </div>

              {/* Inline code block preview */}
              <div className="rounded-[3px] bg-[#1a1a1a] p-3 mb-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="w-2 h-2 rounded-full bg-[#ff5f57]" />
                  <span className="w-2 h-2 rounded-full bg-[#febc2e]" />
                  <span className="w-2 h-2 rounded-full bg-[#28c840]" />
                </div>
                <div className="space-y-1.5">
                  <p className="text-[11px] font-mono" style={{ color: "#999" }}>// AI follow-up sequence</p>
                  <p className="text-[11px] font-mono" style={{ color: "#e5e5e5" }}>agent.<span style={{ color: "var(--accent)" }}>onNewLead</span>((lead) =&gt; {"{"}</p>
                  <p className="text-[11px] font-mono pl-3" style={{ color: "#e5e5e5" }}>send.<span style={{ color: "#6ec6ff" }}>sms</span>(lead, templates.intro)</p>
                  <p className="text-[11px] font-mono pl-3" style={{ color: "#e5e5e5" }}>schedule.<span style={{ color: "#6ec6ff" }}>followUp</span>(lead, &quot;24h&quot;)</p>
                  <p className="text-[11px] font-mono" style={{ color: "#e5e5e5" }}>{"}"})</p>
                </div>
              </div>

              {/* More blurred lines */}
              <div className="space-y-2">
                <div className="h-2.5 bg-[var(--border)] rounded-full w-full opacity-30" />
                <div className="h-2.5 bg-[var(--border)] rounded-full w-[80%] opacity-30" />
              </div>

              {/* Badge */}
              <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-[var(--accent)] text-force-white text-[11px] font-bold shadow-lg shadow-[var(--accent)]/20">
                Latest issue
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

/* ━━━ VIDEO SECTION ━━━ */
function VideoSection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        <Reveal>
          <div className="grid lg:grid-cols-[1.3fr_1fr] gap-10 lg:gap-16 items-center">
            {/* Left — Video */}
            <div className="relative rounded-[4px] overflow-hidden bg-[#0a0a0a] aspect-video flex items-center justify-center group cursor-pointer shadow-xl shadow-black/[0.06]">
              <div className="relative z-10 text-center">
                <div className="w-16 h-16 rounded-full bg-[var(--accent)] flex items-center justify-center shadow-lg shadow-[var(--accent)]/25 group-hover:scale-110 transition-transform duration-500 mx-auto mb-3">
                  <Play className="w-7 h-7 ml-1 text-force-white" style={{ fill: "#fff" }} />
                </div>
                <p className="text-[15px] font-semibold" style={{ color: "#fff" }}>Watch the intro</p>
                <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.5)" }}>2 minutes</p>
              </div>
            </div>

            {/* Right — Copy */}
            <div>
              <span className="text-[13px] font-bold text-[var(--accent)] uppercase tracking-wider block mb-2">Behind Nicholaus</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-4">Not another agency. A systems architect who builds what&nbsp;works.</h2>
              <p className="text-[15px] text-[var(--muted)] leading-[1.7] mb-5">
                AI agents, ad systems, CRM automation, and operational workflows — designed, built, and deployed for businesses that want to scale without scaling headcount.
              </p>
              <div className="flex items-baseline gap-5">
                {[
                  { stat: "50+", label: "businesses" },
                  { stat: "20hrs/wk", label: "avg saved" },
                  { stat: "70%+", label: "automated" },
                ].map((s) => (
                  <div key={s.label} className="flex items-baseline gap-1">
                    <span className="text-[18px] font-extrabold tracking-tight">{s.stat}</span>
                    <span className="text-[12px] text-[var(--text-tertiary)]">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ━━━ TICKER ━━━ */
const tickerItems = [
  "Autonomous AI Agents", "Multi-Step Workflow Orchestration", "Predictive Lead Scoring",
  "Dynamic Bid Optimization", "RAG-Powered Knowledge Bases", "Webhook-Driven Automations",
  "Custom GPT Deployments", "Conversion Rate Engineering", "First-Party Data Pipelines",
  "Programmatic Ad Buying", "Server-Side Event Tracking", "Multi-Touch Attribution",
  "Revenue Cycle Automation", "AI Appointment Setters", "Headless CRM Architecture",
  "Geo-Fenced Targeting", "LLM-Driven Outbound", "Smart Lead Distribution",
  "Behavioral Retargeting", "Zero-Party Data Collection", "API-First Integration",
  "Voice AI Inbound", "Churn Prediction Models", "Cross-Channel Analytics",
];

function Ticker() {
  const row = [...tickerItems, ...tickerItems, ...tickerItems];
  return (
    <div className="relative -rotate-[0.8deg] -mx-16 overflow-hidden select-none" style={{ background: "#000" }}>
      <div className="flex whitespace-nowrap py-4" style={{ animation: "ts 50s linear infinite", willChange: "transform" }}>
        {row.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-4 px-5 text-[18px] uppercase tracking-wider" style={{ color: "#fff", fontWeight: 700, fontFamily: "var(--font-oswald)" }}>
            {item}<span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--accent)" }} />
          </span>
        ))}
      </div>
      <style jsx>{`@keyframes ts { 0% { transform: translateX(0); } 100% { transform: translateX(-33.333%); } }`}</style>
    </div>
  );
}

/* ━━━ TOPICS — Staggered card grid ━━━ */
function Topics() {
  const cards = [
    { icon: Bot, label: "AI Agents", desc: "Building, deploying, and scaling autonomous agents that handle real work." },
    { icon: Target, label: "Paid Ads", desc: "Google Ads, retargeting, and programmatic campaigns that print leads." },
    { icon: TrendingUp, label: "Growth Systems", desc: "Funnels, landing pages, and conversion optimization end to end." },
    { icon: Wrench, label: "Operations", desc: "CRM automation, scheduling, invoicing — the backend that makes you faster." },
    { icon: BarChart3, label: "Data & Analytics", desc: "Dashboards, attribution, and reporting that actually tell you what's working." },
    { icon: MessageSquare, label: "Outreach", desc: "Email sequences, SMS campaigns, and AI-powered follow-up systems." },
    { icon: Users, label: "Sales", desc: "Pipeline automation, lead scoring, and AI sales assistants." },
    { icon: Zap, label: "AI Strategy", desc: "What to automate, when, and how — roadmaps that don't collect dust." },
  ];

  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        <Reveal>
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-[13px] font-bold text-[var(--accent)] uppercase tracking-wider block mb-2">What I cover</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Deep dives, not surface-level takes.</h2>
            </div>
            <a href="/blog" className="hidden sm:flex items-center gap-1 text-[14px] font-semibold text-[var(--accent)] hover:underline">Read the blog <ArrowRight className="w-3.5 h-3.5" /></a>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {cards.map((c, i) => (
            <Reveal key={c.label} delay={i * 0.05}>
              <div className="group p-5 rounded-[4px] bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)]/40 hover:shadow-lg hover:shadow-black/[0.03] transition-all duration-300 h-full">
                <c.icon className="w-5 h-5 text-[var(--accent)] mb-3 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-[15px] font-bold mb-1 group-hover:text-[var(--accent)] transition-colors duration-200">{c.label}</h3>
                <p className="text-[13px] text-[var(--muted)] leading-relaxed">{c.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ━━━ LATEST ISSUES ━━━ */
function LeadMagnet() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const submit = async (e: FormEvent) => {
    e.preventDefault(); setStatus("loading");
    try { await fetch("/api/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) }); } catch {}
    setStatus("success"); setEmail("");
  };

  const videos = [
    { num: 1, title: "Campaign Structure", desc: "The exact account setup that reduces wasted spend from day one." },
    { num: 2, title: "Targeting & Keywords", desc: "How to find the buyers — not the browsers — in your service area." },
    { num: 3, title: "Ads That Convert", desc: "Writing ad copy that gets clicks from people ready to book." },
  ];

  return (
    <section className="py-20 sm:py-28 bg-[var(--surface)] border-y border-[var(--border)]">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-[1fr_1fr] gap-12 lg:gap-20 items-center">
          {/* Left — Product visual: 3 stacked DVD/video cards */}
          <Reveal>
            <div className="relative flex justify-center items-end h-[320px]">
              {videos.map((v, i) => (
                <div
                  key={v.num}
                  className="absolute bg-[var(--background)] border border-[var(--border)] rounded-[5px] shadow-xl shadow-black/[0.06] overflow-hidden"
                  style={{
                    width: "260px",
                    height: "280px",
                    transform: `rotate(${(i - 1) * 6}deg) translateX(${(i - 1) * 60}px)`,
                    zIndex: i === 1 ? 10 : 5 - Math.abs(i - 1),
                  }}
                >
                  {/* Top accent bar */}
                  <div className="h-1.5 bg-[var(--accent)]" />

                  {/* Video number disc */}
                  <div className="flex items-center justify-center pt-8 pb-4">
                    <div className="w-20 h-20 rounded-full border-4 border-[var(--accent)] flex items-center justify-center relative">
                      <div className="w-6 h-6 rounded-full bg-[var(--accent)]" />
                      <div className="absolute inset-0 rounded-full border-2 border-dashed border-[var(--accent)]/30" style={{ margin: "6px" }} />
                    </div>
                  </div>

                  {/* Label */}
                  <div className="px-5 text-center">
                    <p className="text-[11px] font-bold text-[var(--accent)] uppercase tracking-wider mb-1">Video {v.num} of 3</p>
                    <h4 className="text-[15px] font-extrabold text-[var(--foreground)] mb-1">{v.title}</h4>
                    <p className="text-[12px] text-[var(--muted)] leading-snug">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Right — Copy + optin */}
          <Reveal delay={0.1}>
            <span className="text-[13px] font-bold text-[var(--accent)] uppercase tracking-wider block mb-2">Free video course</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-4">
              Google Ads for Contractors — The 3-Part Setup Guide
            </h2>
            <p className="text-[15px] text-[var(--muted)] leading-[1.65] mb-4">
              Three short videos that walk through the exact Google Ads structure, targeting, and ad copy that&apos;s working for service businesses right now. No theory — just the setup.
            </p>

            <ul className="space-y-2 mb-6">
              {videos.map((v) => (
                <li key={v.num} className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[var(--accent)] flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold text-force-white">{v.num}</span>
                  </span>
                  <span className="text-[14px] text-[var(--foreground)]"><strong>{v.title}</strong> — {v.desc}</span>
                </li>
              ))}
            </ul>

            {status === "success" ? (
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[var(--accent)]" />
                <span className="text-[15px] font-semibold">Check your inbox — the videos are on their way.</span>
              </div>
            ) : (
              <>
                <form onSubmit={submit} className="flex gap-2 mb-2">
                  <input
                    type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 min-w-0 px-4 py-3.5 text-[15px] rounded-[5px] border border-[var(--border-default)] text-[var(--foreground)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--foreground)] transition-colors bg-[var(--background)]"
                  />
                  <button type="submit" disabled={status === "loading"}
                    className="px-6 py-3.5 rounded-[5px] bg-[var(--accent)] text-force-white font-bold text-[15px] hover:bg-[var(--accent-hover)] transition-all shrink-0 disabled:opacity-60">
                    {status === "loading" ? "..." : "Send me the course →"}
                  </button>
                </form>
                <p className="text-[12px] text-[var(--text-tertiary)]">Free. No spam. Instant access.</p>
              </>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ━━━ MID OPTIN — Horizontal, tight ━━━ */
function AuditOffer() {
  const [form, setForm] = useState({ name: "", email: "", website: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const submit = async (e: FormEvent) => {
    e.preventDefault(); setStatus("loading");
    try { await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.name, email: form.email, message: `GOOGLE ADS AUDIT — $497\nWebsite: ${form.website}` }) }); } catch {}
    setStatus("success");
  };

  const wastedKeywords = [
    { keyword: "plumber near me free", waste: "$340", pct: 90 },
    { keyword: "diy pipe repair", waste: "$280", pct: 75 },
    { keyword: "plumbing jobs hiring", waste: "$220", pct: 60 },
    { keyword: "cheap plumber reddit", waste: "$190", pct: 50 },
  ];

  const spendData = [65, 70, 68, 75, 80, 72, 85, 90, 82, 88, 78, 92];

  return (
    <section ref={ref} className="py-20 sm:py-28 border-y border-[var(--border)]">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        {/* Section header */}
        <Reveal>
          <div className="text-center mb-10">
            <span className="text-[13px] font-bold text-[var(--accent)] uppercase tracking-wider block mb-2">Google Ads Audit</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">See exactly where your ad budget is going.</h2>
            <p className="text-[15px] text-[var(--muted)]">A sample of what the full audit delivers — 47 data points across 6 categories.</p>
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-[1fr_1fr] gap-6 lg:gap-8 items-start">

          {/* Left — 3D stacked report + details */}
          <Reveal>
            <div className="flex gap-8 items-center">
              {/* 3D report */}
              <div className="relative shrink-0" style={{ perspective: "600px", width: "200px", height: "270px" }}>
                {[4, 3, 2, 1].map((i) => (
                  <div key={i} className="absolute bg-[var(--background)] border border-[var(--border)]"
                    style={{ width: "190px", height: "260px", borderRadius: "3px",
                      transform: `rotateY(-10deg) translateZ(${-i * 3}px) translateX(${i * 1.5}px) translateY(${i}px)`,
                      zIndex: 5 - i, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                    <div className="p-4 pt-5">
                      <div className="h-1 bg-[var(--accent)] w-8 rounded-full mb-3" />
                      <div className="space-y-1.5">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <div key={j} className="h-1.5 bg-[var(--border)] rounded-full" style={{ width: `${50 + Math.random() * 40}%`, opacity: 0.4 }} />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                {/* Front cover */}
                <div className="absolute bg-[var(--background)] border border-[var(--border)] shadow-lg shadow-black/[0.06] overflow-hidden"
                  style={{ width: "190px", height: "260px", borderRadius: "3px", transform: "rotateY(-10deg)", zIndex: 10 }}>
                  <div className="h-1.5 bg-[var(--accent)]" />
                  <div className="p-5">
                    <div className="flex items-center gap-1.5 mb-3">
                      <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                      <span className="text-[9px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">Audit Report</span>
                    </div>
                    <p className="text-[15px] font-extrabold leading-tight mb-1">Google Ads</p>
                    <p className="text-[10px] text-[var(--text-tertiary)] mb-5">12-page analysis</p>
                    {[
                      { l: "Wasted Spend", v: "$2,340/mo" },
                      { l: "Missed Leads", v: "47/mo" },
                      { l: "Cost Per Lead", v: "$84" },
                    ].map((m) => (
                      <div key={m.l} className="mb-2.5">
                        <div className="flex justify-between text-[8px] text-[var(--text-tertiary)] uppercase tracking-wider"><span>{m.l}</span><span className="font-bold text-[var(--foreground)]">{m.v}</span></div>
                        <div className="h-1 bg-[var(--border)] rounded-full mt-1"><div className="h-full bg-[var(--accent)] rounded-full" style={{ width: "38%" }} /></div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Badge */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full bg-[var(--accent)] text-force-white text-[11px] font-bold shadow-md">12 pages</div>
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-extrabold tracking-tight mb-3">What you get</h3>
                <div className="space-y-2 mb-4">
                  {["Full account audit", "Wasted spend analysis", "Keyword & search review", "Competitor intelligence", "Landing page assessment", "Custom action plan", "30-min video walkthrough"].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                      <span className="text-[14px] text-[var(--foreground)]">{item}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[12px] text-[var(--text-tertiary)]">Delivered in 5 business days. Money-back guarantee.</p>
              </div>
            </div>
          </Reveal>

          {/* Right — Price + CTA only */}
          <Reveal delay={0.15}>
            <div className="rounded-[5px] border border-[var(--border)] bg-[var(--background)] overflow-hidden sticky top-24">
              <div className="p-8 text-center">
                <div className="flex items-baseline justify-center gap-2 mb-2">
                  <span className="text-[14px] text-[var(--text-tertiary)] line-through">$997</span>
                  <span className="text-[42px] font-extrabold tracking-tight">$497</span>
                </div>
                <p className="text-[14px] text-[var(--muted)] mb-6">One-time payment. Delivered in 5 days.</p>

                <a href="/checkout/audit"
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-[4px] bg-[var(--accent)] text-force-white font-extrabold text-[17px] hover:bg-[var(--accent-hover)] transition-all hover:-translate-y-0.5 mb-4">
                  Buy Now <ArrowRight className="w-4 h-4" />
                </a>

                <div className="flex items-center justify-center gap-4 text-[12px] text-[var(--text-tertiary)]">
                  <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Money-back</span>
                  <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Secure</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 5 days</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ━━━ ABOUT — Parallax photo + bio ━━━ */
function About() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const photoY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section ref={ref} className="py-20 sm:py-28 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-20 items-center">
          <Reveal>
            <motion.div style={{ y: photoY }}>
              <div className="aspect-[3/4] rounded-[4px] bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center shadow-xl shadow-black/[0.04]">
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full bg-[var(--accent)] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[var(--accent)]/20">
                    <span className="text-force-white text-3xl font-extrabold">NT</span>
                  </div>
                  <p className="text-[14px] text-[var(--muted)]">Photo coming soon</p>
                </div>
              </div>
            </motion.div>
          </Reveal>

          <Reveal delay={0.1}>
            <span className="text-[13px] font-bold text-[var(--accent)] uppercase tracking-wider block mb-3">About</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-6">Building systems that run businesses — so the owners don&apos;t have to.</h2>
            <div className="space-y-4 text-[16px] text-[var(--muted)] leading-[1.75]">
              <p>Nicholaus started as a weekly email to a handful of contractor friends who kept asking: <em className="text-[var(--foreground)] not-italic font-semibold">&ldquo;How do I get more leads without hiring more people?&rdquo;</em></p>
              <p>Now it&apos;s a newsletter, a consulting practice, and a growing library of playbooks on using AI and automation to run a tighter, more profitable business.</p>
              <p>The focus: <strong className="text-[var(--foreground)]">AI agents, paid ads, sales automation, and operations</strong> — for people who build things for a living.</p>
            </div>
            <div className="flex flex-wrap gap-2 mt-6">
              {["AI & Automation", "Google Ads", "CRM Systems", "Revenue Ops", "Sales Funnels"].map((tag) => (
                <span key={tag} className="px-3 py-1.5 text-[12px] font-semibold bg-[var(--surface)] border border-[var(--border)] rounded-[3px] text-[var(--foreground)] uppercase tracking-wider">{tag}</span>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ━━━ MORE CONTENT ━━━ */
function MoreContent() {
  const items = [
    { icon: Mic, title: "Podcast", desc: "Deep dives on AI, automation, and building a business that runs itself.", href: "/podcast" },
    { icon: BookOpen, title: "Blog", desc: "Long-form breakdowns, tutorials, and strategies.", href: "/blog" },
    { icon: Wrench, title: "Resources", desc: "Tools, templates, and guides — all free.", href: "/resources" },
  ];

  return (
    <section className="py-20 sm:py-28 bg-[var(--surface)] border-y border-[var(--border)]">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        <Reveal>
          <span className="text-[13px] font-bold text-[var(--accent)] uppercase tracking-wider block mb-2">Go deeper</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-12">More ways to learn.</h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-4">
          {items.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.08}>
              <a href={item.href} className="group flex flex-col p-6 rounded-[4px] bg-[var(--background)] border border-[var(--border)] hover:border-[var(--accent)]/30 hover:shadow-lg hover:shadow-black/[0.03] transition-all duration-300 h-full">
                <item.icon className="w-6 h-6 text-[var(--accent)] mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-[17px] font-bold mb-1 group-hover:text-[var(--accent)] transition-colors duration-200">{item.title}</h3>
                <p className="text-[14px] text-[var(--muted)] leading-relaxed mb-4 flex-1">{item.desc}</p>
                <span className="text-[14px] font-semibold text-[var(--accent)] inline-flex items-center gap-1 group-hover:gap-2 transition-all duration-200">Explore <ArrowRight className="w-3.5 h-3.5" /></span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ━━━ FUNNEL FACTORY ━━━ */
function FunnelFactory() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const stages = [
    { label: "Strangers", count: "10,000", width: "100%", icon: Users, desc: "People searching for your services" },
    { label: "Visitors", count: "2,400", width: "72%", icon: Target, desc: "Land on your site or ad" },
    { label: "Leads", count: "340", width: "48%", icon: Mail, desc: "Fill a form, call, or chat" },
    { label: "Booked", count: "85", width: "30%", icon: Clock, desc: "Schedule an appointment" },
    { label: "Closed", count: "47", width: "18%", icon: CheckCircle, desc: "Paying customer" },
  ];

  return (
    <section ref={ref} className="py-20 sm:py-28 border-t border-[var(--border)]">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-10 lg:gap-16 items-center">

          {/* Left — Mind board with data pipes */}
          <Reveal>
            <div>
              <span className="text-[13px] font-bold text-[var(--accent)] uppercase tracking-wider block mb-2">Your lead system</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-8">Every piece connected. Nothing leaking.</h2>

              {/* Funnel area chart */}
              <div className="rounded-[5px] border border-[var(--border)] bg-[var(--background)] overflow-hidden shadow-lg shadow-black/[0.04]">
                {/* Chart header */}
                <div className="px-5 py-3 border-b border-[var(--border)] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                    <span className="text-[12px] font-bold">Lead Funnel Performance</span>
                  </div>
                  <span className="text-[11px] text-[var(--text-tertiary)]">Last 12 months</span>
                </div>

                {/* Stacked area chart */}
                <div className="px-5 pt-5 pb-3">
                  <svg className="w-full" viewBox="0 0 500 200" preserveAspectRatio="none" style={{ height: "180px" }}>
                    {/* Revenue area (bottom, smallest) */}
                    <motion.path
                      d="M0,200 L0,170 C42,168 83,162 125,155 C167,148 208,140 250,132 C292,124 333,118 375,110 C417,102 458,95 500,88 L500,200 Z"
                      fill="var(--accent)" fillOpacity="0.5"
                      initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.8, duration: 0.8 }}
                    />
                    {/* Booked area */}
                    <motion.path
                      d="M0,200 L0,155 C42,150 83,140 125,128 C167,116 208,105 250,95 C292,85 333,76 375,65 C417,54 458,45 500,38 L500,200 Z"
                      fill="var(--accent)" fillOpacity="0.2"
                      initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.6, duration: 0.8 }}
                    />
                    {/* Leads area */}
                    <motion.path
                      d="M0,200 L0,135 C42,128 83,112 125,98 C167,84 208,72 250,62 C292,52 333,42 375,32 C417,22 458,15 500,10 L500,200 Z"
                      fill="var(--accent)" fillOpacity="0.08"
                      initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.4, duration: 0.8 }}
                    />

                    {/* Revenue line */}
                    <motion.path
                      d="M0,170 C42,168 83,162 125,155 C167,148 208,140 250,132 C292,124 333,118 375,110 C417,102 458,95 500,88"
                      fill="none" stroke="var(--accent)" strokeWidth="2.5"
                      initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ delay: 0.8, duration: 1.5 }}
                    />
                    {/* Booked line */}
                    <motion.path
                      d="M0,155 C42,150 83,140 125,128 C167,116 208,105 250,95 C292,85 333,76 375,65 C417,54 458,45 500,38"
                      fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeOpacity="0.5"
                      initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ delay: 0.6, duration: 1.5 }}
                    />
                    {/* Leads line */}
                    <motion.path
                      d="M0,135 C42,128 83,112 125,98 C167,84 208,72 250,62 C292,52 333,42 375,32 C417,22 458,15 500,10"
                      fill="none" stroke="var(--accent)" strokeWidth="1" strokeOpacity="0.3"
                      initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ delay: 0.4, duration: 1.5 }}
                    />
                  </svg>

                  {/* Legend */}
                  <div className="flex items-center gap-5 mt-3">
                    <span className="flex items-center gap-1.5 text-[11px] text-[var(--text-tertiary)]"><span className="w-3 h-2 rounded-[1px] bg-[var(--accent)] opacity-50" /> Revenue</span>
                    <span className="flex items-center gap-1.5 text-[11px] text-[var(--text-tertiary)]"><span className="w-3 h-2 rounded-[1px] bg-[var(--accent)] opacity-20" /> Booked</span>
                    <span className="flex items-center gap-1.5 text-[11px] text-[var(--text-tertiary)]"><span className="w-3 h-2 rounded-[1px] bg-[var(--accent)] opacity-8" /> Leads</span>
                  </div>
                </div>

                {/* Bottom metrics */}
                <div className="grid grid-cols-4 gap-px bg-[var(--border)] border-t border-[var(--border)]">
                  {[
                    { label: "Leads/mo", value: "340", change: "+180%" },
                    { label: "Booked/mo", value: "85", change: "+220%" },
                    { label: "Closed/mo", value: "47", change: "+310%" },
                    { label: "Revenue/mo", value: "$28K+", change: "+275%" },
                  ].map((m, i) => (
                    <motion.div
                      key={m.label}
                      className="bg-[var(--background)] p-4 text-center"
                      initial={{ opacity: 0, y: 10 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 1.2 + i * 0.1, duration: 0.4 }}
                    >
                      <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider mb-0.5">{m.label}</p>
                      <p className="text-[20px] font-extrabold tracking-tight">{m.value}</p>
                      <p className="text-[11px] font-semibold text-[var(--accent)]">{m.change}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Right — Funnel strategy offer */}
          <Reveal delay={0.2}>
            <div className="rounded-[5px] border border-[var(--border)] bg-[var(--background)] overflow-hidden">
              <div className="p-8 text-center border-b border-[var(--border)]">
                <span className="text-[12px] font-bold text-[var(--accent)] uppercase tracking-wider block mb-2">Custom Funnel Strategy</span>
                <div className="flex items-baseline justify-center gap-2 mb-2">
                  <span className="text-[14px] text-[var(--text-tertiary)] line-through">$997</span>
                  <span className="text-[42px] font-extrabold tracking-tight">$497</span>
                </div>
                <p className="text-[14px] text-[var(--muted)]">A complete funnel blueprint built for your business.</p>
              </div>

              <div className="p-6">
                <div className="space-y-2.5 mb-6">
                  {[
                    "Full lead journey audit",
                    "Drop-off analysis at every stage",
                    "Custom funnel architecture",
                    "Ad → landing page → follow-up flow",
                    "Tech stack recommendations",
                    "Implementation roadmap",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                      <span className="text-[13px] text-[var(--foreground)]">{item}</span>
                    </div>
                  ))}
                </div>

                <a href="/checkout/audit"
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-[4px] bg-[var(--accent)] text-force-white font-extrabold text-[16px] hover:bg-[var(--accent-hover)] transition-all hover:-translate-y-0.5 mb-3">
                  Get My Funnel Strategy <ArrowRight className="w-4 h-4" />
                </a>

                <div className="flex items-center justify-center gap-4 text-[11px] text-[var(--text-tertiary)]">
                  <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Money-back</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 7-day delivery</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ━━━ FINAL CTA ━━━ */
function FinalCTA() {
  return (
    <section className="py-24 sm:py-36">
      <div className="max-w-[560px] mx-auto px-5 sm:px-8 text-center">
        <Reveal>
          <h2 className="text-3xl sm:text-[2.75rem] font-extrabold tracking-tight leading-[1.08] mb-4">The next one drops Thursday.</h2>
          <p className="text-[16px] text-[var(--muted)] leading-relaxed mb-8">Strategies that are moving the needle — straight to your inbox.</p>
          <EmailOptin id="final" buttonText="Subscribe →" />
          <p className="text-[13px] text-[var(--text-tertiary)] mt-4">Free. No spam. Unsubscribe anytime.</p>
        </Reveal>
      </div>
    </section>
  );
}

/* ━━━ PAGE ━━━ */
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 overflow-x-clip">
        <Hero />
        <Ticker />
        <Topics />
        <LeadMagnet />
        <VideoSection />
        <AuditOffer />
        <About />
        <MoreContent />
        <FunnelFactory />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
