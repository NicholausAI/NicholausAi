"use client";

import { CheckCircle } from "lucide-react";

interface LegalConsentProps {
  agreed: boolean;
  onChange: (agreed: boolean) => void;
}

export default function LegalConsent({ agreed, onChange }: LegalConsentProps) {
  return (
    <div
      className={
        "rounded-[3px] border-2 p-4 cursor-pointer transition-all select-none " +
        (agreed
          ? "border-[var(--accent)] bg-[var(--accent-glow)]"
          : "border-[var(--border)] bg-[var(--background)]")
      }
      onClick={() => onChange(!agreed)}
    >
      <div className="flex items-start gap-3">
        <div
          className={
            "w-5 h-5 rounded-[3px] border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors " +
            (agreed
              ? "bg-[var(--accent)] border-[var(--accent)]"
              : "border-[var(--border-strong)]")
          }
        >
          {agreed && (
            <CheckCircle className="w-3 h-3 text-force-white" />
          )}
        </div>
        <p className="text-[13px] text-[var(--muted)] leading-relaxed">
          I agree to the{" "}
          <a
            href="/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] hover:underline font-medium"
            onClick={(e) => e.stopPropagation()}
          >
            Terms of Service
          </a>
          ,{" "}
          <a
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] hover:underline font-medium"
            onClick={(e) => e.stopPropagation()}
          >
            Privacy Policy
          </a>
          , and{" "}
          <a
            href="/refund"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] hover:underline font-medium"
            onClick={(e) => e.stopPropagation()}
          >
            Refund Policy
          </a>
          . I understand that{" "}
          <strong className="text-[var(--foreground)]">
            all sales are final and non-refundable
          </strong>
          .
        </p>
      </div>
    </div>
  );
}
