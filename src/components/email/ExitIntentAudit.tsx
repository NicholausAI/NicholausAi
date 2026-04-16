"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, TrendingDown, DollarSign, Target, CheckCircle, ArrowRight, Shield, Clock, Zap } from "lucide-react";

const DISMISS_KEY = "exit_audit_dismissed";

function shouldShow(): boolean {
  if (typeof window === "undefined") return false;
  const dismissed = localStorage.getItem(DISMISS_KEY);
  if (dismissed) {
    const expiry = parseInt(dismissed, 10);
    if (Date.now() < expiry) return false;
    localStorage.removeItem(DISMISS_KEY);
  }
  return true;
}

export function ExitIntentAudit() {
  const [visible, setVisible] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [purchased, setPurchased] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", website: "" });

  useEffect(() => {
    if (!shouldShow() || visible) return;

    let enabled = false;

    const enable = () => { enabled = true; };
    const timer = setTimeout(enable, 5000);

    const handleMouseOut = (e: MouseEvent) => {
      if (!enabled) return;
      // Only trigger when mouse leaves toward the top of the viewport
      if (e.clientY <= 0 || e.relatedTarget === null) {
        setVisible(true);
      }
    };

    document.documentElement.addEventListener("mouseout", handleMouseOut);

    return () => {
      clearTimeout(timer);
      document.documentElement.removeEventListener("mouseout", handleMouseOut);
    };
  }, [visible]);

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [visible]);

  const dismiss = useCallback(() => {
    const threeDays = 3 * 24 * 60 * 60 * 1000;
    localStorage.setItem(DISMISS_KEY, String(Date.now() + threeDays));
    setVisible(false);
  }, []);

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    setPurchasing(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: `GOOGLE ADS AUDIT PURCHASE — $497\nWebsite: ${form.website}`,
        }),
      });
    } catch {}
    setPurchased(true);
    setPurchasing(false);
  };

  useEffect(() => {
    if (!visible) return;
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") dismiss(); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [visible, dismiss]);

  // Animated report data
  const reportMetrics = [
    { label: "Wasted Spend", value: "34%", status: "bad", icon: DollarSign },
    { label: "Quality Score", value: "4.2", status: "bad", icon: TrendingDown },
    { label: "CTR", value: "1.8%", status: "warn", icon: Target },
    { label: "Conv. Rate", value: "2.1%", status: "warn", icon: AlertTriangle },
  ];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[200] flex items-center justify-center"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dismiss}
          />

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-[960px] max-h-[90vh] overflow-y-auto mx-4 bg-[var(--background)] rounded-[5px] shadow-2xl"
          >
            {/* Close */}
            <button onClick={dismiss} className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--border)] transition-colors">
              <X className="w-4 h-4" />
            </button>

            {purchased ? (
              /* Success state */
              <div className="p-12 sm:p-16 text-center">
                <div className="w-16 h-16 rounded-full bg-[var(--accent)] flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-force-white" />
                </div>
                <h2 className="text-3xl font-extrabold mb-3">You&apos;re in.</h2>
                <p className="text-[16px] text-[var(--muted)] mb-2">Your Google Ads audit has been booked.</p>
                <p className="text-[14px] text-[var(--text-tertiary)]">Check your inbox — you&apos;ll get next steps within 24 hours.</p>
                <button onClick={dismiss} className="mt-8 text-[var(--accent)] font-semibold hover:underline">Close</button>
              </div>
            ) : (
              <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
                {/* Left — Pain + report mockup */}
                <div className="p-8 sm:p-12 lg:p-16 bg-[var(--surface)] flex flex-col justify-center">
                  {/* Urgency bar */}
                  <div className="flex items-center gap-2 mb-6 px-3 py-2 rounded-[3px] bg-[var(--accent)] text-force-white text-[13px] font-bold">
                    <Zap className="w-4 h-4" />
                    Limited time — only 5 audit slots left this month
                  </div>

                  <h2 className="text-[13px] font-bold text-[var(--accent)] uppercase tracking-wider mb-2">Wait — before you go</h2>
                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-4 leading-[1.1]">
                    You&apos;re probably wasting 30-40% of your ad budget right now.
                  </h3>
                  <p className="text-[15px] text-[var(--muted)] leading-relaxed mb-6">
                    Most contractors are bleeding money on Google Ads — wrong keywords, bad structure, zero tracking. This audit finds exactly where the money&apos;s going and how to fix it.
                  </p>

                  {/* Interactive report mockup */}
                  <div className="rounded-[5px] bg-[var(--background)] border border-[var(--border)] overflow-hidden mb-6">
                    {/* Report header */}
                    <div className="px-5 py-3 border-b border-[var(--border)] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-400" />
                        <span className="text-[12px] font-bold text-[var(--foreground)]">Google Ads Health Report</span>
                      </div>
                      <span className="text-[11px] text-[var(--text-tertiary)]">Sample audit</span>
                    </div>

                    {/* Metrics grid */}
                    <div className="grid grid-cols-2 gap-px bg-[var(--border)]">
                      {reportMetrics.map((m, i) => (
                        <motion.div
                          key={m.label}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + i * 0.15 }}
                          className="bg-[var(--background)] p-4"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <m.icon className={`w-3.5 h-3.5 ${m.status === "bad" ? "text-red-500" : "text-yellow-500"}`} />
                            <span className="text-[11px] text-[var(--text-tertiary)] uppercase tracking-wider">{m.label}</span>
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className={`text-[24px] font-extrabold ${m.status === "bad" ? "text-red-500" : "text-yellow-600"}`}>{m.value}</span>
                            <span className={`text-[11px] font-bold uppercase ${m.status === "bad" ? "text-red-400" : "text-yellow-500"}`}>
                              {m.status === "bad" ? "Critical" : "Needs work"}
                            </span>
                          </div>
                          {/* Animated bar */}
                          <div className="mt-2 h-1.5 bg-[var(--surface)] rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full rounded-full ${m.status === "bad" ? "bg-red-400" : "bg-yellow-400"}`}
                              initial={{ width: 0 }}
                              animate={{ width: m.status === "bad" ? "34%" : "55%" }}
                              transition={{ delay: 0.5 + i * 0.15, duration: 0.8 }}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Bottom verdict */}
                    <div className="px-5 py-3 border-t border-[var(--border)] flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      <span className="text-[13px] font-semibold text-red-600">Estimated $1,200–$3,400/mo in wasted spend detected</span>
                    </div>
                  </div>

                  <p className="text-[13px] text-[var(--text-tertiary)] italic">
                    ^ This is what a real audit uncovers. Yours could be worse — or better. Only one way to find out.
                  </p>
                </div>

                {/* Right — Offer + checkout */}
                <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-3 mb-1">
                      <span className="text-[14px] text-[var(--text-tertiary)] line-through">$997</span>
                      <span className="text-[36px] font-extrabold text-[var(--foreground)]">$497</span>
                    </div>
                    <p className="text-[14px] text-[var(--muted)]">One-time payment. Full audit delivered in 5 business days.</p>
                  </div>

                  {/* What's included */}
                  <div className="space-y-2.5 mb-8">
                    {[
                      "Full Google Ads account audit",
                      "Wasted spend analysis with dollar amounts",
                      "Keyword & search term review",
                      "Competitor ad intelligence report",
                      "Landing page conversion assessment",
                      "Custom action plan with priorities",
                      "30-min video walkthrough of findings",
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-2.5">
                        <CheckCircle className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
                        <span className="text-[14px] text-[var(--foreground)]">{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* Checkout form */}
                  <form onSubmit={handlePurchase} className="space-y-3 mb-4">
                    <input
                      required value={form.name}
                      onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                      placeholder="Your name"
                      className="w-full px-4 py-3 text-[15px] rounded-[5px] border border-[var(--border-default)] bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--foreground)] transition-colors"
                    />
                    <input
                      type="email" required value={form.email}
                      onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                      placeholder="Email"
                      className="w-full px-4 py-3 text-[15px] rounded-[5px] border border-[var(--border-default)] bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--foreground)] transition-colors"
                    />
                    <input
                      required value={form.website}
                      onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))}
                      placeholder="Website or Google Ads account URL"
                      className="w-full px-4 py-3 text-[15px] rounded-[5px] border border-[var(--border-default)] bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--foreground)] transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={purchasing}
                      className="w-full px-6 py-4 rounded-[5px] bg-[var(--accent)] text-force-white font-extrabold text-[17px] hover:bg-[var(--accent-hover)] transition-all hover:-translate-y-0.5 disabled:opacity-60"
                    >
                      {purchasing ? "Processing..." : "Get My Audit — $497 →"}
                    </button>
                  </form>

                  {/* Trust */}
                  <div className="space-y-2 mt-auto">
                    <div className="flex items-center gap-4 text-[12px] text-[var(--text-tertiary)]">
                      <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Money-back guarantee</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Delivered in 5 days</span>
                    </div>
                    <p className="text-[11px] text-[var(--text-tertiary)]">
                      Secure checkout. No recurring charges. If the audit doesn&apos;t find at least $497 in savings, you get a full refund.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
