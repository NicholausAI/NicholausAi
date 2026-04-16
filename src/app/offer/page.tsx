"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle,
  Shield,
  Lock,
  Clock,
  Star,
  Zap,
  AlertCircle,
  Play,
  Bot,
  Wrench,
  Users,
  FileText,
  ArrowRight,
  Timer,
  TrendingUp,
  Target,
  Mail,
} from "lucide-react";
import CollectJSPaymentForm from "@/components/checkout/CollectJSPaymentForm";
import LegalConsent from "@/components/checkout/LegalConsent";

/* ━━━ COUNTDOWN TIMER ━━━ */
function Countdown() {
  const [time, setTime] = useState({ m: 14, s: 59 });

  useEffect(() => {
    const saved = sessionStorage.getItem("tripwire_timer");
    if (saved) {
      const remaining = Math.max(0, parseInt(saved) - Date.now());
      setTime({
        m: Math.floor(remaining / 60000),
        s: Math.floor((remaining % 60000) / 1000),
      });
    } else {
      sessionStorage.setItem(
        "tripwire_timer",
        String(Date.now() + 15 * 60 * 1000)
      );
    }

    const interval = setInterval(() => {
      const end = parseInt(sessionStorage.getItem("tripwire_timer") || "0");
      const remaining = Math.max(0, end - Date.now());
      setTime({
        m: Math.floor(remaining / 60000),
        s: Math.floor((remaining % 60000) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="flex items-center gap-1.5 font-mono">
      <div className="bg-[var(--foreground)] text-[var(--background)] px-2 py-1 rounded-[3px] text-[18px] font-extrabold leading-none">
        {pad(time.m)}
      </div>
      <span className="text-[var(--foreground)] text-[18px] font-extrabold">:</span>
      <div className="bg-[var(--foreground)] text-[var(--background)] px-2 py-1 rounded-[3px] text-[18px] font-extrabold leading-none">
        {pad(time.s)}
      </div>
    </div>
  );
}

/* ━━━ REVEAL ━━━ */
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
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ━━━ MODULES DATA ━━━ */
const MODULES = [
  { num: "01", title: "The Automation Mindset", desc: "Identify the 20% of tasks eating 80% of your time" },
  { num: "02", title: "Your First AI Agent", desc: "Build a working agent from scratch in under 60 minutes" },
  { num: "03", title: "Lead Follow-Up on Autopilot", desc: "Never lose a job to slow response time again" },
  { num: "04", title: "The $60k Admin Replacement", desc: "The exact tool stack that handles scheduling, invoicing & CRM" },
  { num: "05", title: "Deploy & Scale", desc: "Copy-paste templates and SOPs you can use today" },
];

const RESULTS = [
  { stat: "20+", label: "hours saved per week", icon: Clock },
  { stat: "3x", label: "faster lead response", icon: TrendingUp },
  { stat: "$0", label: "additional software cost", icon: Target },
];

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   PAGE
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function TripwireOfferPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [alreadySeen, setAlreadySeen] = useState(false);

  useEffect(() => {
    const purchased = localStorage.getItem("tripwire_purchased");
    if (purchased) {
      setAlreadySeen(true);
    } else if (!localStorage.getItem("tripwire_seen")) {
      localStorage.setItem("tripwire_seen", String(Date.now()));
    }
  }, []);

  const set =
    (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((p) => ({ ...p, [key]: e.target.value }));

  const customerName = `${form.firstName} ${form.lastName}`.trim();
  const contactInfoValid =
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.email.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);

  const handlePaymentSuccess = (transactionId: string) => {
    localStorage.setItem("tripwire_purchased", String(Date.now()));
    router.push(`/thank-you?product=ai-automation-101&txn=${transactionId}`);
  };

  const handlePaymentError = (error: string) => {
    setPaymentError(error);
  };

  const inp =
    "w-full px-4 py-3 text-[15px] rounded-[3px] border border-[var(--border-default)] bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--foreground)] transition-colors";

  if (alreadySeen) {
    return (
      <div className="h-screen bg-[var(--surface)] flex items-center justify-center px-5">
        <div className="max-w-[460px] text-center">
          <div className="w-16 h-16 rounded-full bg-[var(--accent)] flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8 text-force-white" />
          </div>
          <h1 className="text-2xl font-extrabold mb-2">You&apos;re all set!</h1>
          <p className="text-[15px] text-[var(--muted)] mb-6">
            Check your inbox for the latest issue.
          </p>
          <Link href="/" className="text-[var(--accent)] font-semibold hover:underline">
            Back to site
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* ─── TOP BAR ─── */}
      <div className="border-b border-[var(--border)]">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 py-2 flex items-center justify-between">
          <Link
            href="/"
            className="text-[13px] font-bold text-[var(--foreground)] flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </Link>
          <div className="flex items-center gap-1.5 text-[12px] text-[var(--text-tertiary)]">
            <Lock className="w-3 h-3" /> Secure checkout
          </div>
        </div>
      </div>

      {/* ─── URGENCY BAR ─── */}
      <div className="bg-[var(--foreground)] py-2.5">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 flex items-center justify-center gap-3 sm:gap-5">
          <p className="text-[12px] sm:text-[13px] font-bold text-[var(--background)]">
            <Zap className="w-3 h-3 inline -mt-0.5 mr-1" />
            This offer expires in
          </p>
          <Countdown />
        </div>
      </div>

      {/* ─── HERO ─── */}
      <section className="relative pt-10 sm:pt-16 pb-16 sm:pb-24 overflow-hidden bg-blueprint">
        {/* Gradient glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--accent-glow)] to-transparent opacity-50 pointer-events-none" />

        {/* Chart bg */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 400" preserveAspectRatio="none" style={{ height: "45%" }}>
            <motion.path
              d="M0,400 L0,340 C200,330 400,290 600,250 C800,210 1000,185 1200,150 C1320,125 1380,110 1440,95 L1440,400 Z"
              fill="url(#offerGlow)"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
            />
            <motion.path
              d="M0,340 C200,330 400,290 600,250 C800,210 1000,185 1200,150 C1320,125 1380,110 1440,95"
              fill="none" stroke="#FDD835" strokeWidth="2.5" strokeOpacity="0.4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2.5, delay: 0.3, ease: "easeOut" }}
            />
            <motion.circle
              r="4" fill="#FDD835"
              initial={{ offsetDistance: "0%" }}
              animate={{ offsetDistance: "100%" }}
              transition={{ duration: 10, delay: 1, ease: "easeInOut", repeat: Infinity, repeatType: "loop" }}
              style={{ offsetPath: "path('M0,340 C200,330 400,290 600,250 C800,210 1000,185 1200,150 C1320,125 1380,110 1440,95')" }}
            />
            <defs>
              <linearGradient id="offerGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FDD835" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#FDD835" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="relative z-10 max-w-[1200px] mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left — Copy */}
            <div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--accent)] text-force-white text-[12px] font-bold mb-5">
                  <Zap className="w-3 h-3" />
                  NEW SUBSCRIBER EXCLUSIVE — 83% OFF
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="text-[clamp(2rem,4.5vw,3rem)] font-extrabold leading-[1.12] tracking-tight mb-4"
              >
                Build your first AI agent{" "}
                <span className="gradient-text">in under 60 minutes</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-[15px] text-[var(--muted)] leading-[1.65] mb-5 max-w-[460px]"
              >
                The step-by-step course that shows service business owners how to
                automate leads, ops, and follow-ups — saving 20+ hours a week.
                Normally <span className="line-through">$97</span>.{" "}
                <strong className="text-[var(--foreground)]">Yours today for $17.</strong>
              </motion.p>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex items-baseline gap-3 sm:gap-5 mb-6 flex-wrap"
              >
                {RESULTS.map((r) => (
                  <div key={r.label} className="flex items-baseline gap-1">
                    <span className="text-[15px] sm:text-[18px] font-extrabold tracking-tight">{r.stat}</span>
                    <span className="text-[11px] sm:text-[12px] text-[var(--text-tertiary)]">{r.label}</span>
                  </div>
                ))}
              </motion.div>

              <motion.a
                href="#checkout"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-[3px] bg-[var(--accent)] text-force-white font-extrabold text-[17px] hover:bg-[var(--accent-hover)] transition-all hover:-translate-y-0.5 shadow-lg shadow-[var(--accent)]/15 mb-4"
              >
                Get instant access — $17
                <ArrowRight className="w-5 h-5" />
              </motion.a>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.65 }}
                className="flex items-center gap-4 text-[12px] text-[var(--text-tertiary)]"
              >
                {["Instant access", "Lifetime updates", "All sales final"].map((t) => (
                  <span key={t} className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-[var(--accent)]" /> {t}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* Right — Product visual mockup */}
            <motion.div
              initial={{ opacity: 0, y: 25, rotate: 1 }}
              animate={{ opacity: 1, y: 0, rotate: 1 }}
              transition={{ duration: 0.9, delay: 0.3 }}
              className="hidden lg:block"
            >
              <div className="relative">
                {/* SOP Template Pack — back layer */}
                <motion.div
                  initial={{ opacity: 0, x: 20, rotate: 3 }}
                  animate={{ opacity: 1, x: 0, rotate: 3 }}
                  transition={{ duration: 0.7, delay: 0.6 }}
                  className="absolute -right-3 -top-3 w-[240px] rounded-[3px] bg-[var(--background)] border border-[var(--border)] shadow-lg shadow-black/[0.06] p-4 z-0"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-[3px] bg-[var(--accent-glow)] border border-[var(--accent)]/20 flex items-center justify-center">
                      <FileText className="w-3.5 h-3.5 text-[var(--accent)]" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold">SOP Templates</p>
                      <p className="text-[9px] text-[var(--text-tertiary)]">12 ready-to-use files</p>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    {["Lead_Followup_SOP.pdf", "Client_Onboarding.pdf", "AI_Agent_Setup.pdf"].map((f) => (
                      <div key={f} className="flex items-center gap-2 px-2.5 py-1.5 rounded-[3px] bg-[var(--surface)] border border-[var(--border)]">
                        <FileText className="w-3 h-3 text-[var(--muted)]" />
                        <span className="text-[10px] font-mono text-[var(--muted)] truncate">{f}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Video Course — main card */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="relative z-10 rounded-[3px] bg-[var(--background)] border border-[var(--border)] shadow-xl shadow-black/[0.06] overflow-hidden"
                >
                  {/* Video player mockup */}
                  <div className="relative bg-[var(--foreground)] aspect-[16/9] flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-[rgba(253,216,53,0.1)] to-transparent" />
                    {/* Play button */}
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.8 }}
                      className="w-16 h-16 rounded-full bg-[var(--accent)] flex items-center justify-center shadow-lg shadow-[var(--accent)]/30 relative z-10"
                    >
                      <Play className="w-7 h-7 text-force-white ml-1" />
                    </motion.div>
                    {/* Progress bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-[rgba(255,255,255,0.1)]">
                      <motion.div
                        className="h-full bg-[var(--accent)]"
                        initial={{ width: "0%" }}
                        animate={{ width: "35%" }}
                        transition={{ duration: 2, delay: 1, ease: "easeOut" }}
                      />
                    </div>
                    {/* Module label */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-[3px] bg-black/50 backdrop-blur-sm">
                      <p className="text-[10px] font-bold text-white">Module 02 — Your First AI Agent</p>
                    </div>
                    {/* Duration */}
                    <div className="absolute top-3 right-3 px-2 py-1 rounded-[3px] bg-black/50 backdrop-blur-sm">
                      <p className="text-[10px] font-mono text-white/70">24:18</p>
                    </div>
                  </div>

                  {/* Course info bar */}
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-[13px] font-bold">AI Automation 101</p>
                      <p className="text-[11px] text-[var(--text-tertiary)]">5 modules &middot; 2+ hours</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map((i) => (
                        <Star key={i} className="w-3 h-3 fill-[var(--accent)] text-[var(--accent)]" />
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Email notification — floating */}
                <motion.div
                  initial={{ opacity: 0, x: -20, y: 10 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.9 }}
                  className="absolute -left-6 bottom-12 w-[260px] rounded-[3px] bg-[var(--background)] border border-[var(--border)] shadow-lg shadow-black/[0.06] p-3 z-20"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center shrink-0 mt-0.5">
                      <Mail className="w-4 h-4 text-force-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className="text-[11px] font-bold">Course Access Granted</p>
                        <span className="text-[9px] text-[var(--text-tertiary)]">now</span>
                      </div>
                      <p className="text-[10px] text-[var(--muted)] leading-snug">
                        Your AI Automation 101 course is ready. Click to start Module 1...
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Floating badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.1 }}
                  className="absolute -right-2 bottom-20 px-3 py-1.5 rounded-full bg-[var(--foreground)] shadow-lg z-20"
                >
                  <p className="text-[11px] font-bold text-[var(--accent)]">
                    <Zap className="w-3 h-3 inline -mt-0.5 mr-0.5" />
                    83% OFF
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── WHAT'S INSIDE (Modules) ─── */}
      <section className="py-16 sm:py-20 bg-[var(--surface)]">
        <div className="max-w-[700px] mx-auto px-5 sm:px-8">
          <Reveal>
            <div className="text-center mb-10">
              <p className="text-[13px] font-semibold text-[var(--accent)] mb-2 tracking-wide uppercase">
                Course Curriculum
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                5 modules. Zero fluff.
              </h2>
            </div>
          </Reveal>

          <div className="space-y-3">
            {MODULES.map((mod, i) => (
              <Reveal key={mod.num} delay={i * 0.06}>
                <div className="flex items-start gap-4 p-4 rounded-[3px] bg-[var(--background)] border border-[var(--border)] hover:border-[var(--accent)] transition-colors group">
                  <div className="w-10 h-10 rounded-[3px] bg-[var(--foreground)] flex items-center justify-center shrink-0">
                    <span className="text-[12px] font-extrabold text-[var(--background)]">
                      {mod.num}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-[15px] font-extrabold mb-0.5">
                      {mod.title}
                    </h3>
                    <p className="text-[13px] text-[var(--muted)]">{mod.desc}</p>
                  </div>
                  <Play className="w-4 h-4 text-[var(--text-tertiary)] shrink-0 mt-3 ml-auto group-hover:text-[var(--accent)] transition-colors" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SOCIAL PROOF ─── */}
      <section className="py-16 sm:py-20">
        <div className="max-w-[800px] mx-auto px-5 sm:px-8">
          <Reveal>
            <div className="text-center mb-10">
              <p className="text-[13px] font-semibold text-[var(--accent)] mb-2 tracking-wide uppercase">
                Results
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                What others built{" "}
                <span className="text-[var(--accent)]">in week one</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                quote:
                  "Built my first automation in 45 minutes. Already saving 10 hours a week on follow-ups.",
                name: "Sarah T.",
                role: "Cleaning Service Owner",
              },
              {
                quote:
                  "The lead follow-up agent alone was worth 10x the price. Booked 6 extra jobs the first week.",
                name: "Jake M.",
                role: "Landscaping Co.",
              },
              {
                quote:
                  "I was paying a VA $1,200/mo for work this course taught me to automate in an afternoon.",
                name: "Marcus R.",
                role: "HVAC Business Owner",
              },
              {
                quote:
                  "Finally a course that's actually actionable. No theory, just systems I could deploy same day.",
                name: "Diana K.",
                role: "Property Manager",
              },
            ].map((t, i) => (
              <Reveal key={t.name} delay={i * 0.08}>
                <div className="p-5 rounded-[3px] border border-[var(--border)] bg-[var(--background)] h-full flex flex-col">
                  <div className="flex gap-0.5 mb-3">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className="w-3.5 h-3.5 fill-[var(--accent)] text-[var(--accent)]"
                      />
                    ))}
                  </div>
                  <p className="text-[14px] text-[var(--muted)] leading-relaxed mb-4 flex-1">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div>
                    <p className="text-[13px] font-semibold">{t.name}</p>
                    <p className="text-[11px] text-[var(--text-tertiary)]">
                      {t.role}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CHECKOUT ─── */}
      <section
        id="checkout"
        className="py-16 sm:py-20 bg-[var(--surface)] scroll-mt-4"
      >
        <div className="max-w-[1100px] mx-auto px-5 sm:px-8">
          <Reveal>
            <div className="text-center mb-10">
              <p className="text-[13px] font-semibold text-[var(--accent)] mb-2 tracking-wide uppercase">
                Limited time offer
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
                Get AI Automation 101 for{" "}
                <span className="gradient-text">$17</span>
              </h2>
              <p className="text-[14px] text-[var(--muted)]">
                <span className="line-through">$97</span> — 83% off for new
                subscribers only
              </p>
            </div>
          </Reveal>

          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6 lg:gap-10 items-start">
            {/* LEFT — Form */}
            <Reveal delay={0.05}>
              <div>
                {/* Contact */}
                <div className="bg-[var(--background)] rounded-[3px] border border-[var(--border)] p-5 mb-3">
                  <h2 className="text-[15px] font-extrabold mb-3">
                    Your details
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-2.5 mb-2.5">
                    <input
                      required
                      value={form.firstName}
                      onChange={set("firstName")}
                      placeholder="First name"
                      className={inp}
                    />
                    <input
                      required
                      value={form.lastName}
                      onChange={set("lastName")}
                      placeholder="Last name"
                      className={inp}
                    />
                  </div>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={set("email")}
                    placeholder="Email"
                    className={inp}
                  />
                </div>

                {/* Payment */}
                <div className="bg-[var(--background)] rounded-[3px] border border-[var(--border)] p-5 mb-3">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-[15px] font-extrabold">Payment</h2>
                    <span className="text-[11px] text-[var(--text-tertiary)] flex items-center gap-1">
                      <Lock className="w-3 h-3" /> 256-bit
                    </span>
                  </div>
                  <CollectJSPaymentForm
                    productSlug="ai-automation-101"
                    customerEmail={form.email}
                    customerName={customerName}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                    disabled={!contactInfoValid || !agreedToTerms}
                  />
                </div>

                {/* Payment error */}
                {paymentError && (
                  <div className="mb-3 p-4 bg-red-500/10 border border-red-500/20 rounded-[3px]">
                    <div className="flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <p className="text-[13px] text-red-600">{paymentError}</p>
                    </div>
                  </div>
                )}

                {/* Legal consent */}
                <div className="mb-3">
                  <LegalConsent
                    agreed={agreedToTerms}
                    onChange={setAgreedToTerms}
                  />
                </div>

                {/* Trust row */}
                <div className="flex items-center justify-center gap-4 text-[11px] text-[var(--text-tertiary)] mb-4">
                  <span className="flex items-center gap-1">
                    <Shield className="w-3 h-3" /> All sales final
                  </span>
                  <span className="flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Secure
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Instant access
                  </span>
                </div>

                {/* Skip */}
                <div className="text-center">
                  <Link
                    href="/offer/confirmed"
                    className="text-[13px] text-[var(--text-tertiary)] hover:text-[var(--muted)] transition-colors underline"
                  >
                    No thanks, I&apos;ll pass
                  </Link>
                </div>
              </div>
            </Reveal>

            {/* RIGHT — Summary */}
            <Reveal delay={0.1}>
              <div className="lg:sticky lg:top-20">
                <div className="bg-[var(--background)] rounded-[3px] border border-[var(--border)] overflow-hidden">
                  {/* Price hero */}
                  <div className="p-6 bg-[var(--foreground)] text-center">
                    <p className="text-[11px] font-bold text-[var(--accent)] uppercase tracking-wider mb-2">
                      New subscriber price
                    </p>
                    <div className="flex items-baseline justify-center gap-3">
                      <span className="text-[18px] text-[rgba(255,255,255,0.3)] line-through font-bold">
                        $97
                      </span>
                      <span className="text-[48px] font-extrabold text-white tracking-tight leading-none">
                        $17
                      </span>
                    </div>
                    <p className="text-[12px] text-[rgba(255,255,255,0.4)] mt-2">
                      One-time payment. Lifetime access.
                    </p>
                  </div>

                  {/* Includes */}
                  <div className="p-5 border-b border-[var(--border)]">
                    <p className="text-[12px] font-semibold uppercase tracking-wider text-[var(--muted)] mb-3">
                      What&apos;s included
                    </p>
                    <div className="space-y-2">
                      {[
                        "5 video modules (2+ hours)",
                        "Step-by-step walkthroughs",
                        "Copy-paste automation templates",
                        "Recommended tool stack guide",
                        "Real-world case studies",
                        "Lifetime access & future updates",
                      ].map((item) => (
                        <div key={item} className="flex items-center gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                          <span className="text-[13px]">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* All sales final */}
                  <div className="px-5 py-3 border-b border-[var(--border)] bg-[var(--surface)]">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-[var(--muted)] shrink-0" />
                      <p className="text-[12px] text-[var(--muted)]">
                        <strong className="text-[var(--foreground)]">
                          All sales final
                        </strong>{" "}
                        — digital products are non-refundable.
                      </p>
                    </div>
                  </div>

                  {/* Testimonial */}
                  <div className="p-5">
                    <div className="flex gap-0.5 mb-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className="w-3.5 h-3.5 fill-[var(--accent)] text-[var(--accent)]"
                        />
                      ))}
                    </div>
                    <p className="text-[13px] italic text-[var(--muted)] leading-relaxed mb-2">
                      &ldquo;I was paying a VA $1,200/mo for work this course
                      taught me to automate in an afternoon. Insane value for
                      $17.&rdquo;
                    </p>
                    <p className="text-[11px] text-[var(--text-tertiary)]">
                      — Marcus R., HVAC Business Owner
                    </p>
                  </div>
                </div>

                {/* Timer reminder */}
                <div className="mt-3 flex items-center justify-center gap-2 p-3 border border-[var(--border)] rounded-[3px] bg-[var(--background)]">
                  <Timer className="w-4 h-4 text-[var(--accent)]" />
                  <p className="text-[12px] text-[var(--muted)]">
                    This price is only available{" "}
                    <strong className="text-[var(--foreground)]">
                      on this page
                    </strong>
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-12 border-t border-[var(--border)]">
        <div className="max-w-[500px] mx-auto px-5 sm:px-8 text-center">
          <p className="text-[14px] text-[var(--muted)] mb-4">
            Still here? This{" "}
            <strong className="text-[var(--foreground)]">$17 offer</strong>{" "}
            disappears when you leave this page.
          </p>
          <a
            href="#checkout"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-[3px] bg-[var(--accent)] text-force-white font-extrabold text-[15px] hover:bg-[var(--accent-hover)] transition-all hover:-translate-y-0.5 shadow-lg shadow-[var(--accent)]/15"
          >
            Get instant access — $17
            <ArrowRight className="w-4 h-4" />
          </a>
          <div className="mt-4">
            <Link
              href="/offer/confirmed"
              className="text-[13px] text-[var(--text-tertiary)] hover:text-[var(--muted)] transition-colors underline"
            >
              No thanks, continue without the course
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
