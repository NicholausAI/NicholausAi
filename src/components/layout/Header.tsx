"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { WelcomeMat } from "@/components/email";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, Compass, BookOpen, Mail, Wrench, MessageSquare, Bot, Target, TrendingUp, BarChart3, Users, Zap, ChevronDown } from "lucide-react";

const navLinks = [
  { label: "Start Here", href: "/start", icon: Compass },
  { label: "Blog", href: "/blog", icon: BookOpen },
  { label: "Newsletter", href: "#newsletter", icon: Mail },
  { label: "Resources", href: "/resources", icon: Wrench },
  { label: "Contact", href: "/contact", icon: MessageSquare },
];

export function Header() {
  const [showWelcomeMat, setShowWelcomeMat] = useState(false);
  const [showIntake, setShowIntake] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 20);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    document.body.style.overflow = (mobileOpen || showIntake) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen, showIntake]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 pt-2 transition-all duration-300 ${
          scrolled
            ? "bg-[var(--background)]/95 backdrop-blur-md border-b border-[var(--border)]"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
          <nav className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="group shrink-0">
              <div className="w-16 h-9 rounded-[3px] bg-[var(--accent)] flex items-center justify-center group-hover:bg-[var(--accent-hover)] transition-colors">
                <span className="text-force-white text-[22px]" style={{ fontFamily: "var(--font-league-spartan)", fontWeight: 900, letterSpacing: "-0.08em", marginTop: "-1px" }}>U.</span>
              </div>
            </Link>

            {/* Desktop nav — centered */}
            <div className="hidden lg:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[15px] font-semibold text-[#000000] hover:text-[var(--accent)] transition-colors rounded-[3px]"
                  >
                    <Icon className="w-3.5 h-3.5 opacity-50" />
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* CTA button — desktop */}
            <div className="hidden lg:block">
              <button
                onClick={() => setShowIntake(true)}
                className="inline-flex items-center gap-1.5 px-5 py-2 text-[14px] font-semibold rounded-[3px] bg-[var(--accent)] text-force-white hover:bg-[var(--accent-hover)] transition-all"
              >
                Work with me
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mobile — CTA + hamburger */}
            <div className="flex items-center gap-3 lg:hidden">
              <button
                onClick={() => setShowIntake(true)}
                className="inline-flex items-center h-9 px-3 text-[12px] font-bold rounded-[3px] bg-[var(--accent)] text-force-white"
              >
                Work with me
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-1 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-[80vw] max-w-[320px] bg-[var(--background)] border-l border-[var(--border)] z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-6 pt-16">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 py-3.5 text-[17px] font-medium text-[var(--foreground)] border-b border-[var(--border)] hover:text-[var(--accent)] transition-colors"
                    >
                      <Icon className="w-4 h-4 opacity-40" />
                      {link.label}
                    </Link>
                  );
                })}
                <button
                  onClick={() => { setMobileOpen(false); setShowIntake(true); }}
                  className="flex items-center justify-center gap-2 w-full mt-6 px-5 py-3 text-[15px] font-semibold rounded-md bg-[var(--accent)] text-force-white"
                >
                  Work with me <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Full-screen intake form */}
      <AnimatePresence>
        {showIntake && <IntakeForm onClose={() => setShowIntake(false)} />}
      </AnimatePresence>

      <div className="h-20" />

      <WelcomeMat isOpen={showWelcomeMat} onClose={() => setShowWelcomeMat(false)} />
    </>
  );
}

/* ── FULL-SCREEN MULTI-STEP INTAKE ── */

// Icons already imported at top

const steps = [
  {
    question: "What do you need help with?",
    subtitle: "Select all that apply.",
    type: "multi" as const,
    options: [
      { label: "More leads & customers", icon: Target },
      { label: "AI agents & chatbots", icon: Bot },
      { label: "Ads & paid campaigns", icon: TrendingUp },
      { label: "Sales & follow-up automation", icon: Users },
      { label: "Operations & workflows", icon: Wrench },
      { label: "Data & reporting", icon: BarChart3 },
      { label: "Email & SMS marketing", icon: Mail },
      { label: "Full-stack AI strategy", icon: Zap },
    ],
  },
  {
    question: "What's your monthly budget?",
    subtitle: "Pick the closest range.",
    type: "stack" as const,
    options: [
      { label: "Under $2,000/mo", desc: "Getting started with automation" },
      { label: "$2,000 — $5,000/mo", desc: "Scaling lead gen and operations" },
      { label: "$5,000 — $10,000/mo", desc: "Full-service AI implementation" },
      { label: "$10,000 — $25,000/mo", desc: "Enterprise-level transformation" },
      { label: "$25,000+/mo", desc: "Custom engagement" },
    ],
  },
  {
    question: "How fast do you need this?",
    subtitle: "No wrong answer.",
    type: "stack" as const,
    options: [
      { label: "ASAP — yesterday", desc: "Urgent, ready to move now" },
      { label: "Within 30 days", desc: "Have a timeline, need to get started" },
      { label: "Next quarter", desc: "Planning ahead, doing research" },
      { label: "Just exploring", desc: "Curious what's possible" },
    ],
  },
];

function IntakeForm({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState<string[][]>([[], [], []]);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [contact, setContact] = useState({ name: "", email: "", company: "", website: "" });

  const isLastStep = step === steps.length;
  const totalSteps = steps.length + 1;
  const progress = ((step + 1) / totalSteps) * 100;

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const toggleOption = (label: string) => {
    const current = selections[step] || [];
    const stepData = steps[step];
    if (stepData.type === "single" || stepData.type === "stack") {
      const updated = [...selections];
      updated[step] = [label];
      setSelections(updated);
      // Auto-advance on single select
      setTimeout(() => setStep((s) => s + 1), 300);
    } else {
      const updated = [...selections];
      updated[step] = current.includes(label) ? current.filter((s) => s !== label) : [...current, label];
      setSelections(updated);
    }
  };

  const canAdvance = (selections[step] || []).length > 0;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contact.name,
          email: contact.email,
          message: [
            `Company: ${contact.company}`,
            contact.website && `Website: ${contact.website}`,
            `Needs: ${selections[0].join(", ")}`,
            `Budget: ${selections[1][0]}`,
            `Timeline: ${selections[2][0]}`,
          ].filter(Boolean).join("\n"),
        }),
      });
      setStatus("success");
    } catch {
      setStatus("success");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] bg-[var(--background)] flex flex-col"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 sm:px-10 py-5 shrink-0">
        <span className="text-[15px] font-bold text-[var(--foreground)]">NICHOLAUS.</span>
        <div className="flex items-center gap-4">
          <span className="text-[13px] text-[var(--text-tertiary)]">{step + 1} of {totalSteps}</span>
          <button onClick={onClose} className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-[var(--border)] shrink-0">
        <motion.div
          className="h-full bg-[var(--accent)]"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Content area */}
      <div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-8 overflow-y-auto">
        <div className="w-full max-w-[600px]">
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full bg-[var(--accent-glow)] flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold mb-3">You&apos;re in.</h2>
                <p className="text-[var(--muted)] text-[18px] mb-8">Expect a personal response within 24 hours.</p>
                <button onClick={onClose} className="text-[var(--accent)] font-semibold text-[16px] hover:underline">Back to site</button>
              </motion.div>
            ) : isLastStep ? (
              /* Contact info step */
              <motion.div
                key="contact"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-full bg-[var(--accent)] flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="#fff" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <p className="text-[14px] text-[var(--accent)] font-semibold mb-1">Almost there</p>
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">Drop your details to start the conversation.</h2>
                <p className="text-[var(--muted)] text-[15px] mb-10">No commitment. Just a real reply within 24 hours.</p>

                <form onSubmit={submit} className="text-left">
                  <div className="grid sm:grid-cols-2 gap-x-6 gap-y-0">
                    {[
                      { key: "name", label: "Name", placeholder: "Your name", required: true, type: "text" },
                      { key: "email", label: "Email", placeholder: "you@company.com", required: true, type: "email" },
                      { key: "company", label: "Company", placeholder: "Company name", required: true, type: "text" },
                      { key: "website", label: "Website", placeholder: "yoursite.com", required: false, type: "text" },
                    ].map((field) => (
                      <div key={field.key} className="relative mb-6">
                        <input
                          type={field.type}
                          required={field.required}
                          value={contact[field.key as keyof typeof contact]}
                          onChange={(e) => setContact((p) => ({ ...p, [field.key]: e.target.value }))}
                          placeholder=" "
                          className="peer w-full pt-6 pb-2 px-0 text-[17px] bg-transparent border-0 border-b border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:border-[var(--foreground)] transition-colors"
                        />
                        <label className="absolute left-0 top-0 text-[12px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider peer-placeholder-shown:top-5 peer-placeholder-shown:text-[16px] peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-0 peer-focus:text-[12px] peer-focus:font-medium peer-focus:uppercase peer-focus:tracking-wider transition-all">
                          {field.label}{field.required ? "" : " (optional)"}
                        </label>
                      </div>
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full mt-2 px-6 py-4 rounded-lg bg-[var(--accent)] text-force-white font-bold text-[17px] hover:bg-[var(--accent-hover)] transition-all hover:-translate-y-0.5 disabled:opacity-60"
                  >
                    {status === "loading" ? "Sending..." : "Start the conversation →"}
                  </button>
                </form>
              </motion.div>
            ) : (
              /* Selection steps */
              <motion.div
                key={`step-${step}`}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
              >
                <h2 className="text-2xl sm:text-3xl font-bold mb-1">{steps[step].question}</h2>
                <p className="text-[var(--muted)] text-[16px] mb-8">{steps[step].subtitle}</p>

                {steps[step].type === "stack" ? (
                  /* Vertical stacked options */
                  <div className="space-y-3">
                    {steps[step].options.map((opt) => {
                      const selected = (selections[step] || []).includes(opt.label);
                      return (
                        <button
                          key={opt.label}
                          type="button"
                          onClick={() => toggleOption(opt.label)}
                          className={`w-full flex items-center justify-between p-5 rounded-xl border-2 text-left transition-all group ${
                            selected
                              ? "border-[var(--accent)] bg-[var(--accent-glow)]"
                              : "border-[var(--border)] hover:border-[var(--accent)]/40"
                          }`}
                        >
                          <div>
                            <span className={`text-[17px] font-semibold block ${selected ? "text-[var(--accent)]" : "text-[var(--foreground)]"}`}>
                              {opt.label}
                            </span>
                            {"desc" in opt && (
                              <span className="text-[14px] text-[var(--muted)] mt-0.5 block">{opt.desc}</span>
                            )}
                          </div>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                            selected ? "border-[var(--accent)] bg-[var(--accent)]" : "border-[var(--border)]"
                          }`}>
                            {selected && (
                              <svg className="w-3.5 h-3.5" fill="none" stroke="#fff" strokeWidth={3} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  /* Grid card options */
                  <div className={`grid ${steps[step].options.length > 5 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-2 sm:grid-cols-3"} gap-3`}>
                    {steps[step].options.map((opt) => {
                      const selected = (selections[step] || []).includes(opt.label);
                      const Icon = "icon" in opt ? opt.icon : null;
                      return (
                        <button
                          key={opt.label}
                          type="button"
                          onClick={() => toggleOption(opt.label)}
                          className={`flex flex-col items-center gap-2 p-5 rounded-xl border-2 text-center transition-all ${
                            selected
                              ? "border-[var(--accent)] bg-[var(--accent-glow)]"
                              : "border-[var(--border)] hover:border-[var(--accent)]/40"
                          }`}
                        >
                          {Icon && <Icon className={`w-6 h-6 ${selected ? "text-[var(--accent)]" : "text-[var(--muted)]"}`} />}
                          <span className={`text-[14px] font-medium leading-tight ${selected ? "text-[var(--accent)]" : "text-[var(--foreground)]"}`}>
                            {opt.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {(steps[step].type === "multi") && (
                  <button
                    onClick={() => setStep((s) => s + 1)}
                    disabled={!canAdvance}
                    className="mt-8 w-full px-6 py-4 rounded-lg bg-[var(--accent)] text-force-white font-bold text-[16px] hover:bg-[var(--accent-hover)] transition-all hover:-translate-y-0.5 disabled:opacity-30 disabled:hover:translate-y-0"
                  >
                    Continue →
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Back button */}
      {step > 0 && status !== "success" && (
        <div className="shrink-0 px-6 sm:px-10 pb-6">
          <button onClick={() => setStep((s) => s - 1)} className="text-[14px] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
            ← Back
          </button>
        </div>
      )}
    </motion.div>
  );
}
