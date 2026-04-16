"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components/ui";

interface EmailFormProps {
  variant?: "inline" | "stacked";
  buttonText?: string;
  placeholder?: string;
  className?: string;
  onSuccess?: () => void;
  redirectTo?: string;
}

export function EmailForm({
  variant = "inline",
  buttonText = "Subscribe",
  placeholder = "Enter your email",
  className = "",
  onSuccess,
  redirectTo,
}: EmailFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setStatus("success");
      setEmail("");
      onSuccess?.();
      if (redirectTo) {
        router.push(redirectTo);
      }
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  if (status === "success") {
    return (
      <div className={`text-center py-4 ${className}`}>
        <div className="inline-flex items-center gap-2 text-[var(--accent)] font-sans font-medium">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>You&apos;re in! Check your inbox.</span>
        </div>
      </div>
    );
  }

  const isInline = variant === "inline";

  return (
    <form
      onSubmit={handleSubmit}
      className={`${isInline ? "flex flex-row flex-nowrap gap-2" : "flex flex-col gap-3"} ${className}`}
    >
      <div className={isInline ? "flex-1 min-w-0" : ""}>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          required
          disabled={status === "loading"}
          error={status === "error" ? errorMessage : undefined}
          className={isInline ? "text-sm" : ""}
        />
      </div>
      <Button
        type="submit"
        isLoading={status === "loading"}
        className={isInline ? "shrink-0 px-4" : "w-full"}
        size={isInline ? "md" : "lg"}
      >
        {buttonText}
      </Button>
    </form>
  );
}
