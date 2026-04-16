"use client";

import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          ref={ref}
          className={`
            w-full px-4 py-3 text-base
            bg-[var(--surface)] border border-[var(--border)] rounded-lg
            text-[var(--foreground)] placeholder:text-[var(--muted)]
            transition-all duration-200 ease-out
            focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent
            hover:border-[var(--muted)]
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? "border-red-500 focus:ring-red-500" : ""}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-2 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
