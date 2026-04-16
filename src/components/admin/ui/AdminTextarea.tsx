"use client";

import { forwardRef, type TextareaHTMLAttributes } from "react";

interface AdminTextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const AdminTextarea = forwardRef<HTMLTextAreaElement, AdminTextareaProps>(
  ({ label, error, hint, className = "", id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-[var(--foreground)]"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={`
            w-full px-3 py-2 bg-[var(--surface)] border rounded-lg
            text-[var(--foreground)] placeholder-[var(--muted)]
            focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent
            transition-all resize-none
            ${error ? "border-red-500" : "border-[var(--border)]"}
            ${className}
          `}
          {...props}
        />
        {hint && !error && (
          <p className="text-xs text-[var(--muted)]">{hint}</p>
        )}
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);

AdminTextarea.displayName = "AdminTextarea";
