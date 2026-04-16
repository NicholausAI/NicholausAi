"use client";

import { forwardRef, type InputHTMLAttributes } from "react";

interface AdminInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const AdminInput = forwardRef<HTMLInputElement, AdminInputProps>(
  ({ label, error, hint, className = "", id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[var(--foreground)]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-3 py-2 bg-[var(--surface)] border rounded-lg
            text-[var(--foreground)] placeholder-[var(--muted)]
            focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent
            transition-all
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

AdminInput.displayName = "AdminInput";
