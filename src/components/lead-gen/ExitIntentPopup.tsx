"use client";

import { useState, useEffect, useCallback, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import { Button, Input } from "@/components/ui";

const SESSION_KEY = "exit_intent_shown";

export function ExitIntentPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const close = useCallback(() => {
    setIsOpen(false);
    document.body.style.overflow = "";
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SESSION_KEY)) return;

    const handleMouseOut = (e: MouseEvent) => {
      if (
        e.clientY <= 0 &&
        !sessionStorage.getItem(SESSION_KEY)
      ) {
        sessionStorage.setItem(SESSION_KEY, "1");
        setIsOpen(true);
        document.body.style.overflow = "hidden";
      }
    };

    document.addEventListener("mouseout", handleMouseOut);
    return () => document.removeEventListener("mouseout", handleMouseOut);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, close]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "exit-intent-case-study" }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong"
      );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-[#0a0a0b]/80 backdrop-blur-sm"
            onClick={close}
          />

          {/* Card */}
          <motion.div
            className="relative w-full max-w-md mx-4 mb-4 sm:mb-0"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="relative bg-[#111113] border border-[rgba(255,255,255,0.06)] rounded-2xl p-8 shadow-2xl">
              {/* Close */}
              <button
                onClick={close}
                className="absolute top-4 right-4 p-2 rounded-full text-[#a1a1aa] hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">
                  Before you go...
                </h3>
                <p className="text-[#a1a1aa] mb-6">
                  See how one company automated 40 hours/week of manual work
                </p>

                {/* Primary CTA */}
                <a
                  href="/case-studies"
                  className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 text-base font-medium text-white rounded-lg transition-all duration-200"
                  style={{
                    background:
                      "linear-gradient(135deg, #00d4aa, #00b4d8, #7c3aed)",
                  }}
                >
                  Show Me the Case Study
                  <ArrowRight className="w-4 h-4" />
                </a>

                {/* Divider */}
                <div className="flex items-center gap-4 my-6">
                  <div className="flex-1 h-px bg-[rgba(255,255,255,0.06)]" />
                  <span className="text-xs text-[#a1a1aa] uppercase tracking-wider">
                    or
                  </span>
                  <div className="flex-1 h-px bg-[rgba(255,255,255,0.06)]" />
                </div>

                {/* Email form */}
                {status === "success" ? (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[#00d4aa] font-medium py-2"
                  >
                    Check your inbox for the case study PDF!
                  </motion.p>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <p className="text-sm text-[#a1a1aa] mb-3">
                      Get the case study PDF
                    </p>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      required
                      disabled={status === "loading"}
                      error={status === "error" ? errorMessage : undefined}
                    />
                    <Button
                      type="submit"
                      variant="secondary"
                      isLoading={status === "loading"}
                      className="w-full"
                    >
                      Send Me the PDF
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
