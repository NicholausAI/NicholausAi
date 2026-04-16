"use client";

import { EmailForm } from "@/components/email";

export function SidebarOptin() {
  return (
    <div className="sticky top-24 p-6 bg-[var(--surface)] rounded-xl border border-[var(--border)]">
      <div className="w-10 h-10 rounded-lg bg-[var(--accent-glow)] border border-[var(--accent)]/20 flex items-center justify-center mb-4">
        <svg
          className="w-5 h-5 text-[var(--accent)]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      </div>
      <h3 className="font-bold text-lg mb-2">
        Get more like this
      </h3>
      <p className="text-sm text-[var(--muted)] mb-5 leading-relaxed">
        Weekly insights on development, trading, and building. No spam.
      </p>
      <EmailForm variant="stacked" buttonText="Subscribe" />
    </div>
  );
}
