"use client";

import { useState, useRef, type FormEvent } from "react";
import { Header } from "@/components/layout";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  Mail,
  Clock,
  Send,
  MessageSquare,
  Zap,
} from "lucide-react";

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

const CHANNELS = [
  { name: "Email", desc: "info@nicholaus.ai", icon: Mail, href: "mailto:info@nicholaus.ai" },
  { name: "X / Twitter", desc: "DM for quick questions", icon: XIcon, href: "https://twitter.com" },
  { name: "LinkedIn", desc: "Connect professionally", icon: LinkedInIcon, href: "https://linkedin.com" },
  { name: "YouTube", desc: "Tutorials & breakdowns", icon: YouTubeIcon, href: "https://youtube.com" },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const set =
    (key: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((p) => ({ ...p, [key]: e.target.value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } catch {}
    setStatus("success");
  };

  const inp =
    "w-full px-4 py-3.5 text-[15px] rounded-[3px] border border-[var(--border-default)] bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--foreground)] transition-colors";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero section */}
      <section className="relative flex-1 flex items-center overflow-hidden bg-[var(--background)] bg-blueprint">

        {/* Animated SVG curve */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <svg
            className="absolute bottom-0 left-0 w-full"
            viewBox="0 0 1440 400"
            preserveAspectRatio="none"
            style={{ height: "50%" }}
          >
            <motion.path
              d="M0,400 L0,350 C180,340 360,300 540,250 C720,200 900,170 1080,120 C1260,70 1350,45 1440,30 L1440,400 Z"
              fill="url(#contactGlow)"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
            />
            <motion.path
              d="M0,350 C180,340 360,300 540,250 C720,200 900,170 1080,120 C1260,70 1350,45 1440,30"
              fill="none"
              stroke="#FDD835"
              strokeWidth="2"
              strokeOpacity="0.25"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2.5, delay: 0.3, ease: "easeOut" }}
            />
            <motion.path
              d="M0,350 C180,340 360,300 540,250 C720,200 900,170 1080,120 C1260,70 1350,45 1440,30"
              fill="none"
              stroke="#FDD835"
              strokeWidth="6"
              strokeOpacity="0.08"
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
                  "path('M0,350 C180,340 360,300 540,250 C720,200 900,170 1080,120 C1260,70 1350,45 1440,30')",
              }}
            />
            <defs>
              <linearGradient id="contactGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FDD835" stopOpacity="0.06" />
                <stop offset="100%" stopColor="#FDD835" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-[1200px] mx-auto px-5 sm:px-8 py-12 sm:py-16">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left — Copy + Channels */}
            <div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-[13px] font-semibold text-[var(--accent)] mb-4"
              >
                Get in touch
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
                Let&apos;s build something{" "}
                <span className="gradient-text">together</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-[15px] text-[var(--muted)] leading-[1.65] mb-6 max-w-[440px]"
              >
                Question, project, or just saying hey — every message gets a
                personal reply within 24 hours. No bots, no templates.
              </motion.p>

              {/* Trust stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex items-center gap-5 mb-8 flex-wrap"
              >
                {[
                  { icon: Clock, text: "<24hr reply" },
                  { icon: CheckCircle, text: "Personal response" },
                  { icon: MessageSquare, text: "Every message read" },
                ].map((item) => (
                  <div
                    key={item.text}
                    className="flex items-center gap-1.5 text-[13px] text-[var(--muted)]"
                  >
                    <item.icon className="w-3.5 h-3.5 text-[var(--accent)]" />
                    {item.text}
                  </div>
                ))}
              </motion.div>

              {/* Social channels */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="space-y-2 mb-6"
              >
                <p className="text-[12px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">
                  Or reach out directly
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {CHANNELS.map((ch, i) => (
                    <motion.a
                      key={ch.name}
                      href={ch.href}
                      target={
                        ch.href.startsWith("mailto") ? undefined : "_blank"
                      }
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.55 + i * 0.05 }}
                      className="group flex items-center gap-2.5 p-3 rounded-[3px] bg-[var(--background)] border border-[var(--border)] hover:border-[var(--accent)] transition-all"
                    >
                      <div className="w-8 h-8 rounded-[3px] bg-[var(--foreground)] flex items-center justify-center shrink-0 group-hover:bg-[var(--background)] transition-colors duration-300">
                        <ch.icon className="w-4 h-4 text-[var(--background)] group-hover:text-[var(--foreground)] transition-colors duration-300" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-bold group-hover:text-[var(--foreground)] transition-colors duration-300">
                          {ch.name}
                        </p>
                        <p className="text-[11px] text-[var(--text-tertiary)] group-hover:text-[var(--muted)] truncate transition-colors duration-300">
                          {ch.desc}
                        </p>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </motion.div>

              {/* Audit CTA */}
              <motion.a
                href="/checkout/audit"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.75 }}
                className="group flex items-center gap-4 p-4 rounded-[3px] bg-[var(--background)] border border-[var(--border)] hover:bg-[var(--foreground)] hover:border-[var(--foreground)] transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-[3px] bg-[var(--foreground)] flex items-center justify-center shrink-0 group-hover:bg-[var(--accent)] transition-colors duration-300">
                  <Zap className="w-5 h-5 text-[var(--accent)] group-hover:text-force-white transition-colors duration-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-bold group-hover:text-white transition-colors duration-300">
                    Google Ads Audit
                  </p>
                  <p className="text-[12px] text-[var(--muted)] group-hover:text-[rgba(255,255,255,0.5)] transition-colors duration-300">
                    Find wasted spend &middot; 12-page report &middot; $497
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full border border-[var(--border)] flex items-center justify-center shrink-0 group-hover:bg-[var(--accent)] group-hover:border-[var(--accent)] transition-all duration-300">
                  <ArrowRight className="w-3.5 h-3.5 text-[var(--muted)] group-hover:text-force-white transition-colors duration-300" />
                </div>
              </motion.a>
            </div>

            {/* Right — Contact form */}
            <motion.div
              initial={{ opacity: 0, y: 25, rotate: 0.5 }}
              animate={{ opacity: 1, y: 0, rotate: 0.5 }}
              transition={{ duration: 0.9, delay: 0.3 }}
            >
              <div className="rounded-[3px] bg-[var(--background)] border border-[var(--border)] shadow-xl shadow-black/[0.05] overflow-hidden">
                <div className="p-6 sm:p-8">
                  <AnimatePresence mode="wait">
                    {status === "success" ? (
                      <motion.div
                        key="ok"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-10"
                      >
                        <div className="w-16 h-16 rounded-full bg-[var(--accent)] flex items-center justify-center mx-auto mb-5">
                          <CheckCircle className="w-8 h-8 text-force-white" />
                        </div>
                        <h3 className="text-2xl font-extrabold mb-2">
                          Message sent.
                        </h3>
                        <p className="text-[15px] text-[var(--muted)]">
                          I&apos;ll reply within 24 hours.
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div key="fields">
                        <h2 className="text-xl font-extrabold mb-1">
                          Send a message
                        </h2>
                        <p className="text-[14px] text-[var(--muted)] mb-6">
                          Every message gets a real response.
                        </p>

                        <form onSubmit={submit} className="space-y-4">
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[13px] font-semibold mb-1.5">
                                Your name
                              </label>
                              <input
                                required
                                value={form.name}
                                onChange={set("name")}
                                placeholder="John Smith"
                                className={inp}
                              />
                            </div>
                            <div>
                              <label className="block text-[13px] font-semibold mb-1.5">
                                Email
                              </label>
                              <input
                                type="email"
                                required
                                value={form.email}
                                onChange={set("email")}
                                placeholder="john@company.com"
                                className={inp}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[13px] font-semibold mb-1.5">
                              What can I help with?
                            </label>
                            <textarea
                              required
                              rows={4}
                              value={form.message}
                              onChange={set("message")}
                              placeholder="Tell me about your business, what you need help with, or what you're working on..."
                              className={inp + " resize-none"}
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={status === "loading"}
                            className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-[3px] bg-[var(--accent)] text-force-white font-extrabold text-[16px] hover:bg-[var(--accent-hover)] transition-all hover:-translate-y-0.5 disabled:opacity-60 shadow-lg shadow-[var(--accent)]/15"
                          >
                            {status === "loading" ? (
                              "Sending..."
                            ) : (
                              <>
                                <Send className="w-4 h-4" /> Send message
                              </>
                            )}
                          </button>
                        </form>

                        <p className="text-[12px] text-[var(--text-tertiary)] text-center mt-4">
                          No automated replies. Every message read personally.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
