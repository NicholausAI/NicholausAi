"use client";

import { useRef, type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight, CheckCircle, Target, Wrench, TrendingUp,
  Mail, Mic, BookOpen, Play, Zap, Clock, DollarSign,
  Headphones, Megaphone, Cpu, PieChart, Workflow, FileText,
} from "lucide-react";

/* ━━━ REVEAL ━━━ */
function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 32 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

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
        className="flex-1 min-w-0 px-4 py-3.5 text-[15px] rounded-[3px] border border-[var(--border-default)] text-[var(--foreground)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--foreground)] transition-colors bg-white" />
      <button type="submit" disabled={status === "loading"}
        className="px-6 py-3.5 rounded-[3px] bg-[var(--accent)] text-force-white font-bold text-[15px] hover:bg-[var(--accent-hover)] transition-all shrink-0 disabled:opacity-60">
        {status === "loading" ? "..." : buttonText}
      </button>
    </form>
  );
}

/* ━━━ DATA ━━━ */
const SERVICES = [
  {
    icon: Target, title: "Sales Automation",
    desc: "AI-powered lead scoring, instant follow-ups, automated quoting, and pipeline management.",
    stats: [{ val: "2-4x", label: "more leads" }, { val: "47s", label: "response time" }, { val: "34%", label: "higher close rate" }],
  },
  {
    icon: Megaphone, title: "Marketing Systems",
    desc: "Retargeting, review generation, referral programs, and content distribution — all on autopilot.",
    stats: [{ val: "340%", label: "revenue increase" }, { val: "10x", label: "more reviews" }, { val: "60%", label: "lower CPL" }],
  },
  {
    icon: Workflow, title: "Operations & Admin",
    desc: "Onboarding, scheduling, invoicing, project management — automated end to end.",
    stats: [{ val: "20+", label: "hrs/wk saved" }, { val: "0", label: "dropped balls" }, { val: "1 day", label: "onboarding" }],
  },
  {
    icon: Cpu, title: "Custom AI Agents",
    desc: "Purpose-built agents for support, data analysis, content creation, and anything repetitive.",
    stats: [{ val: "$60k", label: "admin replaced" }, { val: "24/7", label: "availability" }, { val: "Days", label: "to deploy" }],
  },
];

/* ━━━ HERO ━━━ */
function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative pt-10 sm:pt-16 pb-20 sm:pb-28 overflow-hidden bg-blueprint">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 400" preserveAspectRatio="none" style={{ height: "50%" }}>
          <motion.path d="M0,400 L0,350 C180,340 360,300 540,250 C720,200 900,170 1080,120 C1260,70 1350,45 1440,30 L1440,400 Z"
            fill="url(#shGlow)" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5, delay: 0.5 }} />
          <motion.path d="M0,350 C180,340 360,300 540,250 C720,200 900,170 1080,120 C1260,70 1350,45 1440,30"
            fill="none" stroke="#FDD835" strokeWidth="2.5" strokeOpacity="0.3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.5, delay: 0.3 }} />
          <motion.circle r="5" fill="#FDD835" initial={{ offsetDistance: "0%" }} animate={{ offsetDistance: "100%" }}
            transition={{ duration: 10, delay: 1, ease: "easeInOut", repeat: Infinity, repeatType: "loop" }}
            style={{ offsetPath: "path('M0,350 C180,340 360,300 540,250 C720,200 900,170 1080,120 C1260,70 1350,45 1440,30')" }} />
          <defs>
            <linearGradient id="shGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FDD835" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#FDD835" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <motion.div style={{ y, opacity }} className="relative z-10 max-w-[1200px] mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left */}
          <div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }}
              className="text-[13px] font-semibold text-[var(--muted)] mb-4 tracking-wide uppercase">
              Start Here
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="text-[clamp(2rem,4.5vw,3rem)] font-extrabold leading-[1.12] tracking-tight mb-4">
              AI systems that run your business — so you don&apos;t have to.
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
              className="text-[15px] text-[var(--muted)] leading-[1.65] mb-5 max-w-[440px]">
              Automated lead gen, instant follow-ups, smart scheduling, and AI-powered ops — saving service businesses 20+ hours a week.
            </motion.p>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-baseline gap-3 sm:gap-5 mb-6 flex-wrap">
              {[{ stat: "20+", label: "hrs/wk saved" }, { stat: "2–4x", label: "more leads" }, { stat: "47s", label: "response time" }].map((s) => (
                <div key={s.label} className="flex items-baseline gap-1">
                  <span className="text-[15px] sm:text-[18px] font-extrabold tracking-tight">{s.stat}</span>
                  <span className="text-[11px] sm:text-[12px] text-[var(--muted)]">{s.label}</span>
                </div>
              ))}
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 mb-4 max-w-[440px]">
              <a href="#services" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-[3px] bg-[var(--accent)] text-force-white font-extrabold text-[15px] hover:bg-[var(--accent-hover)] transition-all hover:-translate-y-0.5 shadow-lg shadow-[var(--accent)]/15 flex-1">
                See the systems <ArrowRight className="w-4 h-4" />
              </a>
              <a href="/newsletter" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-[3px] border border-[var(--border-strong)] text-[var(--foreground)] font-semibold text-[15px] hover:bg-[var(--surface)] transition-all flex-1">
                Free newsletter
              </a>
            </motion.div>
          </div>

          {/* Right — Dashboard */}
          <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.3 }} className="hidden lg:block">
            <div className="rounded-[3px] bg-white border border-[var(--border)] shadow-xl shadow-black/[0.04] overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[var(--border)] bg-[var(--surface)]">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-3 py-0.5 rounded-[3px] bg-white border border-[var(--border)] text-[10px] text-[var(--muted)] font-mono">nicholaus.ai/dashboard</div>
                </div>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: "Leads This Week", value: "47", change: "+12" },
                    { label: "Response Time", value: "47s", change: "-84%" },
                    { label: "Hours Saved", value: "22", change: "+4" },
                  ].map((stat) => (
                    <div key={stat.label} className="p-3 rounded-[3px] bg-[var(--surface)] border border-[var(--border)]">
                      <p className="text-[10px] text-[var(--muted)] mb-1">{stat.label}</p>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-[20px] font-extrabold leading-none">{stat.value}</span>
                        <span className="text-[10px] font-bold text-emerald-600">{stat.change}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider mb-2">Active Automations</p>
                <div className="space-y-1.5 mb-4">
                  {[
                    { name: "Lead Follow-up Agent", icon: Target, count: "142 processed" },
                    { name: "Review Request Sequence", icon: Megaphone, count: "38 sent today" },
                    { name: "Invoice Automation", icon: Workflow, count: "12 this week" },
                    { name: "Client Onboarding Flow", icon: Cpu, count: "3 active" },
                  ].map((a) => (
                    <div key={a.name} className="flex items-center gap-3 p-2.5 rounded-[3px] border border-[var(--border)] bg-white">
                      <div className="w-7 h-7 rounded-[3px] bg-[var(--accent)] flex items-center justify-center shrink-0">
                        <a.icon className="w-3.5 h-3.5 text-force-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-semibold truncate">{a.name}</p>
                        <p className="text-[10px] text-[var(--muted)]">{a.count}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] text-emerald-600 font-semibold">Running</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 rounded-[3px] bg-[var(--accent-glow)] border border-[var(--accent)]/15">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider">Lead Volume (30d)</p>
                    <p className="text-[10px] font-bold text-emerald-600">+127%</p>
                  </div>
                  <div className="flex items-end gap-[3px] h-10">
                    {[20,25,18,30,28,35,32,40,38,45,42,50,48,55,52,60,58,65,70,68,75,72,80,78,85,82,90,88,95,92].map((h, i) => (
                      <motion.div key={i} className="flex-1 rounded-[1px] bg-[var(--accent)]"
                        initial={{ height: 0 }} animate={{ height: `${h}%` }}
                        transition={{ duration: 0.5, delay: 0.8 + i * 0.02, ease: "easeOut" }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   PAGE
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function StartHerePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />

        {/* ─── SERVICES (Clean grid) ─── */}
        <section id="services" className="py-20 sm:py-28 scroll-mt-8">
          <div className="max-w-[900px] mx-auto px-5 sm:px-8">
            <Reveal>
              <div className="text-center mb-14">
                <p className="text-[12px] font-bold text-[var(--muted)] uppercase tracking-wider mb-2">The systems</p>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">AI systems for every part of your business</h2>
              </div>
            </Reveal>

            <div className="grid sm:grid-cols-2 gap-4">
              {SERVICES.map((s, i) => (
                <Reveal key={s.title} delay={i * 0.05}>
                  <Link href="/contact"
                    className="group block p-6 rounded-[3px] border border-[var(--border)] bg-white hover:border-[var(--accent)] transition-all h-full">
                    <div className="w-10 h-10 rounded-[3px] bg-[var(--accent-glow)] border border-[var(--accent)]/15 flex items-center justify-center mb-4 group-hover:bg-[var(--accent)] transition-colors duration-300">
                      <s.icon className="w-5 h-5 text-[var(--foreground)] group-hover:text-force-white transition-colors duration-300" />
                    </div>
                    <h3 className="text-[17px] font-extrabold mb-2">{s.title}</h3>
                    <p className="text-[14px] text-[var(--muted)] leading-relaxed mb-4">{s.desc}</p>
                    <div className="flex items-center gap-4">
                      {s.stats.slice(0, 2).map((st) => (
                        <div key={st.label} className="flex items-baseline gap-1">
                          <span className="text-[16px] font-extrabold">{st.val}</span>
                          <span className="text-[11px] text-[var(--muted)]">{st.label}</span>
                        </div>
                      ))}
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.2}>
              <div className="mt-10 text-center">
                <Link href="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-[3px] bg-[var(--accent)] text-force-white font-extrabold text-[15px] hover:bg-[var(--accent-hover)] transition-all hover:-translate-y-0.5 shadow-lg shadow-[var(--accent)]/15">
                  Get a free consultation <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ─── HOW IT WORKS ─── */}
        <section className="py-20 sm:py-28 bg-[var(--surface)] border-y border-[var(--border)]">
          <div className="max-w-[900px] mx-auto px-5 sm:px-8">
            <Reveal>
              <div className="text-center mb-14">
                <p className="text-[12px] font-bold text-[var(--muted)] uppercase tracking-wider mb-2">How it works</p>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">From chaos to clockwork</h2>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="relative">
                <div className="hidden md:block absolute top-8 left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-[2px] bg-[var(--border)]" />
                <div className="grid md:grid-cols-3 gap-10 md:gap-6">
                  {[
                    { num: "01", title: "Audit", desc: "Your operations, ad spend, and workflows get mapped. Every bottleneck identified.", icon: PieChart },
                    { num: "02", title: "Build", desc: "Custom AI agents deployed — lead capture, follow-ups, scheduling, invoicing.", icon: Cpu },
                    { num: "03", title: "Scale", desc: "Systems run 24/7. New automations added as the business grows. No new hires.", icon: TrendingUp },
                  ].map((step) => (
                    <div key={step.num} className="text-center">
                      <div className="w-16 h-16 rounded-full bg-[var(--accent)] flex items-center justify-center mx-auto mb-4 relative z-10 shadow-lg shadow-[var(--accent)]/20">
                        <step.icon className="w-7 h-7 text-force-white" />
                      </div>
                      <p className="text-[11px] font-bold text-[var(--muted)] tracking-wider mb-1">STEP {step.num}</p>
                      <h3 className="text-[18px] font-extrabold mb-2">{step.title}</h3>
                      <p className="text-[14px] text-[var(--muted)] leading-relaxed">{step.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-10 text-center">
                  <Link href="/checkout/audit" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-[3px] bg-[var(--accent)] text-force-white font-extrabold text-[15px] hover:bg-[var(--accent-hover)] transition-all hover:-translate-y-0.5 shadow-lg shadow-[var(--accent)]/15">
                    Start with an audit — $497 <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ─── CASE STUDIES ─── */}
        <section className="py-20 sm:py-28">
          <div className="max-w-[1000px] mx-auto px-5 sm:px-8">
            <Reveal>
              <div className="text-center mb-14">
                <p className="text-[12px] font-bold text-[var(--muted)] uppercase tracking-wider mb-2">Results</p>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Real numbers from real businesses</h2>
              </div>
            </Reveal>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { stat: "41%", label: "close rate", prev: "was 18%", business: "Plumbing co.", location: "Austin, TX", detail: "AI follow-up cut response from 4hrs to 47s. Admin role eliminated.", icon: Target },
                { stat: "340%", label: "revenue up", prev: "same ad spend", business: "Cleaning co.", location: "Denver, CO", detail: "4 → 40 leads/week. Reviews: 12 → 89. Zero extra ad spend.", icon: TrendingUp },
                { stat: "20+", label: "hrs/wk saved", prev: "VA eliminated", business: "HVAC business", location: "Nashville, TN", detail: "Scheduling, invoicing, and follow-ups fully automated.", icon: Clock },
              ].map((cs, i) => (
                <Reveal key={cs.business} delay={i * 0.06}>
                  <div className="rounded-[3px] border border-[var(--border)] bg-white overflow-hidden h-full flex flex-col">
                    <div className="p-6 bg-[var(--surface)] border-b border-[var(--border)] text-center">
                      <cs.icon className="w-5 h-5 text-[var(--foreground)] mx-auto mb-2" />
                      <p className="text-[42px] font-extrabold text-[var(--foreground)] leading-none tracking-tight">{cs.stat}</p>
                      <p className="text-[13px] text-[var(--muted)] mt-1">{cs.label}</p>
                      <p className="text-[11px] text-[var(--text-tertiary)]">{cs.prev}</p>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <p className="text-[14px] font-extrabold">{cs.business}</p>
                      <p className="text-[12px] text-[var(--muted)] mb-2">{cs.location}</p>
                      <p className="text-[13px] text-[var(--muted)] leading-relaxed flex-1">{cs.detail}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ─── LEARN ─── */}
        <section id="learn" className="py-20 sm:py-28 bg-[var(--surface)] border-y border-[var(--border)] scroll-mt-8">
          <div className="max-w-[900px] mx-auto px-5 sm:px-8">
            <Reveal>
              <div className="text-center mb-12">
                <p className="text-[12px] font-bold text-[var(--muted)] uppercase tracking-wider mb-2">Learn</p>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Free resources to start building today</h2>
              </div>
            </Reveal>

            {/* Newsletter featured */}
            <Reveal delay={0.05}>
              <Link href="/newsletter"
                className="group flex flex-col sm:flex-row items-start sm:items-center gap-5 p-6 rounded-[3px] bg-[var(--accent)] mb-4 transition-all hover:-translate-y-0.5 shadow-lg shadow-[var(--accent)]/15">
                <div className="w-12 h-12 rounded-[3px] bg-white/20 flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-force-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-[17px] font-extrabold text-force-white mb-0.5">Weekly Newsletter</h3>
                  <p className="text-[14px] text-force-white/70 leading-relaxed">One actionable AI system every week. Free forever.</p>
                </div>
                <div className="flex items-center gap-1.5 text-[14px] font-semibold text-force-white shrink-0">
                  Subscribe <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </Reveal>

            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { icon: Play, title: "AI Automation 101", desc: "Build your first AI agent in 60 minutes. 5 modules + templates.", href: "/offer", cta: "Start for $17" },
                { icon: BookOpen, title: "Blog", desc: "Case studies, tutorials, and deep-dives on AI systems.", href: "/blog", cta: "Read" },
                { icon: Mic, title: "Podcast", desc: "Conversations with operators scaling with automation.", href: "/podcast", cta: "Listen" },
                { icon: Headphones, title: "Work With Me", desc: "Done-for-you AI agent builds, audits, and systems.", href: "/contact", cta: "Get in touch" },
              ].map((p, i) => (
                <Reveal key={p.title} delay={0.08 + i * 0.04}>
                  <Link href={p.href}
                    className="group flex items-start gap-4 p-5 rounded-[3px] border border-[var(--border)] bg-white hover:border-[var(--accent)] transition-all h-full">
                    <div className="w-10 h-10 rounded-[3px] bg-[var(--accent-glow)] border border-[var(--accent)]/15 flex items-center justify-center shrink-0 group-hover:bg-[var(--accent)] transition-colors duration-300">
                      <p.icon className="w-5 h-5 text-[var(--foreground)] group-hover:text-force-white transition-colors duration-300" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[15px] font-extrabold mb-1">{p.title}</h3>
                      <p className="text-[13px] text-[var(--muted)] leading-relaxed mb-3">{p.desc}</p>
                      <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-[var(--foreground)]">
                        {p.cta} <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA: Newsletter ─── */}
        <section className="py-20 sm:py-28 border-b border-[var(--border)]">
          <div className="max-w-[600px] mx-auto px-5 sm:px-8 text-center">
            <Reveal>
              <p className="text-[12px] font-bold text-[var(--muted)] uppercase tracking-wider mb-2">Free</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">Get the newsletter</h2>
              <p className="text-[15px] text-[var(--muted)] mb-8 max-w-md mx-auto">
                One actionable AI system every week. Build your first automation this week.
              </p>
              <div className="max-w-[460px] mx-auto mb-3">
                <EmailOptin id="start-cta" buttonText="Subscribe free →" />
              </div>
              <p className="text-[11px] text-[var(--text-tertiary)]">Free forever. Unsubscribe anytime.</p>
            </Reveal>
          </div>
        </section>

        {/* ─── CTA: Audit (Two-column) ─── */}
        <section className="py-20 sm:py-28 bg-[var(--surface)] border-t border-[var(--border)]">
          <div className="max-w-[1100px] mx-auto px-5 sm:px-8">
            <Reveal>
              <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                {/* Left — Copy */}
                <div>
                  <p className="text-[12px] font-bold text-[var(--muted)] uppercase tracking-wider mb-3">Done for you</p>
                  <h2 className="text-[clamp(1.8rem,4vw,2.5rem)] font-extrabold tracking-tight leading-tight mb-4">
                    Find out exactly where your ad budget is going
                  </h2>
                  <p className="text-[15px] text-[var(--muted)] leading-relaxed mb-6">
                    A complete deep-dive into your Google Ads account — wasted spend, keyword gaps, competitor intel, and a prioritized action plan you can implement immediately.
                  </p>

                  <div className="flex items-baseline gap-4 sm:gap-6 mb-6">
                    {[
                      { val: "$500+", label: "waste found/mo" },
                      { val: "12pg", label: "custom report" },
                      { val: "5 day", label: "delivery" },
                    ].map((s) => (
                      <div key={s.label} className="flex items-baseline gap-1">
                        <span className="text-[17px] font-extrabold">{s.val}</span>
                        <span className="text-[11px] text-[var(--muted)]">{s.label}</span>
                      </div>
                    ))}
                  </div>

                  <Link href="/checkout/audit"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-[3px] bg-[var(--accent)] text-force-white font-extrabold text-[16px] hover:bg-[var(--accent-hover)] transition-all hover:-translate-y-0.5 shadow-lg shadow-[var(--accent)]/20 mb-3">
                    Book for $497 <ArrowRight className="w-4 h-4" />
                  </Link>
                  <p className="text-[11px] text-[var(--muted)]">All sales final. Delivered in 5 business days.</p>
                </div>

                {/* Right — Deliverables visual */}
                <div className="space-y-3">
                  {[
                    { icon: Play, title: "Video Walkthrough", desc: "25-minute screen recording walking you through every finding, recommendation, and next step.", tag: "25 min" },
                    { icon: FileText, title: "12-Page Audit Report", desc: "Wasted spend analysis, keyword review, competitor gaps, landing page audit, and prioritized action plan.", tag: "Custom PDF" },
                    { icon: Wrench, title: "SOP Templates", desc: "Ready-to-deploy ad structure, landing page checklist, and budget optimization spreadsheet.", tag: "3 files" },
                  ].map((item) => (
                    <div key={item.title} className="flex items-start gap-4 p-5 rounded-[3px] bg-white border border-[var(--border)]">
                      <div className="w-10 h-10 rounded-[3px] bg-[var(--accent-glow)] border border-[var(--accent)]/15 flex items-center justify-center shrink-0">
                        <item.icon className="w-5 h-5 text-[var(--foreground)]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-[15px] font-extrabold">{item.title}</h3>
                          <span className="px-2 py-0.5 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[10px] font-semibold text-[var(--muted)]">{item.tag}</span>
                        </div>
                        <p className="text-[13px] text-[var(--muted)] leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
