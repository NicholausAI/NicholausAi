"use client";

import { useState, useRef, type FormEvent } from "react";
import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { BookOpen, TrendingUp, Zap, CheckCircle } from "lucide-react";

function EmailOptin() {
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
  };
  if (status === "success")
    return (
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle className="w-5 h-5 text-[var(--accent)]" />
        <span className="text-[16px] font-semibold">
          You&apos;re in. Check your inbox.
        </span>
      </div>
    );
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="mb-4 max-w-[440px]"
    >
      <form onSubmit={submit} className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 min-w-0 px-4 py-3.5 text-[15px] rounded-[3px] border border-[var(--border-default)] text-[var(--foreground)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--foreground)] transition-colors bg-[var(--background)]"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-6 py-3.5 rounded-[3px] bg-[var(--accent)] text-force-white font-bold text-[15px] hover:bg-[var(--accent-hover)] transition-all shrink-0 disabled:opacity-60"
        >
          {status === "loading" ? "..." : "Subscribe →"}
        </button>
      </form>
    </motion.div>
  );
}

export function BlogHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.97]);

  return (
    <section
      ref={ref}
      className="relative pt-10 sm:pt-16 pb-20 sm:pb-28 overflow-hidden bg-blueprint"
    >
      {/* Chart bg — same SVG as homepage */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg
          className="absolute bottom-0 left-0 w-full"
          viewBox="0 0 1440 400"
          preserveAspectRatio="none"
          style={{ height: "50%" }}
        >
          <motion.path
            d="M0,400 L0,350 C180,340 360,300 540,250 C720,200 900,170 1080,120 C1260,70 1350,45 1440,30 L1440,400 Z"
            fill="url(#blogHeroGrad)"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
          />
          <motion.path
            d="M0,350 C180,340 360,300 540,250 C720,200 900,170 1080,120 C1260,70 1350,45 1440,30"
            fill="none"
            stroke="#FDD835"
            strokeWidth="3"
            strokeOpacity="0.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.5, delay: 0.3, ease: "easeOut" }}
          />
          <motion.path
            d="M0,350 C180,340 360,300 540,250 C720,200 900,170 1080,120 C1260,70 1350,45 1440,30"
            fill="none"
            stroke="#FDD835"
            strokeWidth="8"
            strokeOpacity="0.15"
            style={{ filter: "blur(4px)" }}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.5, delay: 0.3, ease: "easeOut" }}
          />
          <motion.circle
            r="5"
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
                "path('M0,350 C180,340 360,300 540,250 C720,200 900,170 1080,120 C1260,70 1350,45 1440,30')",
            }}
          />
          <defs>
            <linearGradient id="blogHeroGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FDD835" stopOpacity="0.15" />
              <stop offset="50%" stopColor="#FDD835" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#FDD835" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <motion.div
        style={{ y, opacity, scale }}
        className="relative z-10 max-w-[1200px] mx-auto px-5 sm:px-8"
      >
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left — Copy */}
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-[13px] font-semibold text-[var(--accent)] mb-4"
            >
              Blog &middot; Delivered Weekly
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-[clamp(2rem,4.5vw,3rem)] font-extrabold leading-[1.12] tracking-tight mb-4"
            >
              Systems, strategy &amp;&nbsp;shortcuts — delivered&nbsp;weekly.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-[15px] text-[var(--muted)] leading-[1.65] mb-6 max-w-[440px]"
            >
              Actionable breakdowns on AI agents, paid media, lead
              gen, and ops — written for contractors and service businesses
              that want to grow without the guesswork.
            </motion.p>

            {/* Email optin */}
            <EmailOptin />

            {/* Topic pills */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.55 }}
              className="flex flex-wrap gap-1.5"
            >
              {[
                { icon: Zap, label: "AI Agents" },
                { icon: TrendingUp, label: "Growth" },
                { icon: BookOpen, label: "Operations" },
              ].map((t) => (
                <span
                  key={t.label}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-[3px] bg-[var(--surface)] border border-[var(--border)] text-[10px] font-medium text-[var(--muted)]"
                >
                  <t.icon className="w-2.5 h-2.5 text-[var(--accent)]" />
                  {t.label}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right — Stacked article cards mockup */}
          <motion.div
            initial={{ opacity: 0, y: 25, rotate: 1 }}
            animate={{ opacity: 1, y: 0, rotate: 1 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="hidden lg:block"
          >
            <div className="space-y-3">
              {[
                {
                  tag: "AI",
                  title: "How one plumber cut ad spend by 60% with AI",
                  excerpt:
                    "The exact Google Ads structure and AI chatbot walkthrough...",
                  time: "5 min",
                },
                {
                  tag: "Growth",
                  title: "The 3-part Google Ads setup that actually works",
                  excerpt:
                    "Most contractor campaigns bleed money. Here's a structure that doesn't...",
                  time: "7 min",
                },
                {
                  tag: "Ops",
                  title: "Automate 80% of your follow-ups in one afternoon",
                  excerpt:
                    "A step-by-step system to stop leads falling through the cracks...",
                  time: "4 min",
                },
              ].map((article, i) => (
                <motion.div
                  key={article.title}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + i * 0.12 }}
                  className="rounded-[4px] bg-[var(--background)] border border-[var(--border)] p-4 shadow-lg shadow-black/[0.04] hover:border-[var(--accent)]/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent)] bg-[var(--accent)]/10 px-2 py-0.5 rounded-[2px]">
                      {article.tag}
                    </span>
                    <span className="text-[11px] text-[var(--text-tertiary)] shrink-0">
                      {article.time}
                    </span>
                  </div>
                  <h3 className="text-[14px] font-bold mb-1 leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-[12px] text-[var(--muted)] leading-relaxed">
                    {article.excerpt}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
