"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle } from "lucide-react";
import { EmailForm } from "./EmailForm";

interface WelcomeMatProps {
  isOpen: boolean;
  onClose: () => void;
}

const DISMISS_KEY = "welcomemat_dismissed";
const SUBMIT_KEY = "welcomemat_submitted";

function shouldShow(): boolean {
  if (typeof window === "undefined") return true;
  const dismissed = localStorage.getItem(DISMISS_KEY);
  if (dismissed) {
    const expiry = parseInt(dismissed, 10);
    if (Date.now() < expiry) return false;
    localStorage.removeItem(DISMISS_KEY);
  }
  const submitted = localStorage.getItem(SUBMIT_KEY);
  if (submitted) {
    const expiry = parseInt(submitted, 10);
    if (Date.now() < expiry) return false;
    localStorage.removeItem(SUBMIT_KEY);
  }
  return true;
}

const bullets = [
  "7 high-ROI automation opportunities hiding in your stack",
  "Build vs. buy decision matrix for AI agents",
  "ROI calculator spreadsheet template",
];

export function WelcomeMat({ isOpen, onClose }: WelcomeMatProps) {
  const visible = isOpen && shouldShow();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleDismiss();
    };

    if (visible) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const handleDismiss = useCallback(() => {
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    localStorage.setItem(DISMISS_KEY, String(Date.now() + sevenDays));
    onClose();
  }, [onClose]);

  const handleSuccess = useCallback(() => {
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    localStorage.setItem(SUBMIT_KEY, String(Date.now() + thirtyDays));
    setTimeout(onClose, 800);
  }, [onClose]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="welcome-mat-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-md"
            onClick={handleDismiss}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Card */}
          <motion.div
            className="relative w-full max-w-lg mx-4"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Gradient border wrapper */}
            <div className="p-[1px] rounded-2xl bg-gradient-to-br from-[#FDD835] via-[#F9A825] to-[#FDD835]">
              <div className="relative bg-[var(--background)] rounded-2xl p-8 sm:p-10">
                {/* Close button */}
                <button
                  onClick={handleDismiss}
                  className="absolute top-4 right-4 p-2 rounded-full text-[var(--text-tertiary)] hover:text-[var(--foreground)] hover:bg-[var(--surface)] transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Content */}
                <div className="text-center">
                  <h2
                    id="welcome-mat-title"
                    className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] mb-3"
                  >
                    Get the AI Agent Playbook
                  </h2>

                  <p className="text-[var(--muted)] text-base sm:text-lg mb-6">
                    The exact framework we use to automate $50K+/month in manual
                    work
                  </p>

                  {/* Bullet points */}
                  <div className="text-left space-y-3 mb-8">
                    {bullets.map((bullet) => (
                      <div key={bullet} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-[var(--accent)] shrink-0 mt-0.5" />
                        <span className="text-sm text-[var(--foreground)]/80">{bullet}</span>
                      </div>
                    ))}
                  </div>

                  {/* Email form */}
                  <div className="space-y-3">
                    <EmailForm
                      variant="stacked"
                      buttonText="Send Me the Playbook"
                      placeholder="you@company.com"
                      onSuccess={handleSuccess}
                    />
                  </div>

                  <p className="text-xs text-[var(--muted)] mt-4">
                    No spam. Unsubscribe anytime.
                  </p>

                  {/* No thanks link */}
                  <button
                    onClick={handleDismiss}
                    className="mt-4 text-sm text-[var(--muted)] hover:text-[var(--foreground)] underline underline-offset-4 transition-colors"
                  >
                    No thanks
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
