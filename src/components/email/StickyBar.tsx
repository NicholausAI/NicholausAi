"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui";
import { WelcomeMat } from "./WelcomeMat";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const DISMISS_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export function StickyBar() {
  const [showWelcomeMat, setShowWelcomeMat] = useState(false);
  const [dismissedAt, setDismissedAt] = useLocalStorage<number | null>(
    "stickyBarDismissed",
    null
  );
  const [isVisible, setIsVisible] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    if (dismissedAt && Date.now() - dismissedAt < DISMISS_DURATION) {
      setIsVisible(false);
    }
  }, [dismissedAt]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setHasScrolled(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    setShowWelcomeMat(true);
  };

  const handleClose = () => {
    setShowWelcomeMat(false);
    setDismissedAt(Date.now());
    setIsVisible(false);
  };

  if (!isVisible || !hasScrolled) return null;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-[var(--surface)]/95 backdrop-blur-md border-t border-[var(--border)]">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden sm:block">
            <p className="font-medium">Get weekly insights delivered to your inbox</p>
            <p className="text-sm text-[var(--muted)]">Join 1,000+ subscribers</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleClick} size="md" className="flex-1 sm:flex-none">
              Subscribe
            </Button>
            <button
              onClick={handleClose}
              className="p-2.5 rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--accent)] transition-all"
              aria-label="Dismiss"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <WelcomeMat isOpen={showWelcomeMat} onClose={handleClose} />
    </>
  );
}
