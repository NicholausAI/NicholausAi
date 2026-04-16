"use client";

import { useState, type FormEvent } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Header, Footer } from "@/components/layout";
import { motion } from "framer-motion";
import { CheckCircle, Download, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

interface FormField {
  id: string;
  label: string;
  type: string;
  required?: boolean;
  options?: string[];
}

export default function LeadMagnetPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;

  const leadMagnet = useQuery(api.leadMagnets.getBySlug, { slug });
  const submitForm = useMutation(api.leadMagnets.submitForm);

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const updateField = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  const validate = (fields: FormField[]): boolean => {
    const newErrors: Record<string, string> = {};
    for (const field of fields) {
      if (field.required && !formData[field.id]?.trim()) {
        newErrors[field.id] = `${field.label} is required`;
      }
      if (field.type === "email" && formData[field.id]?.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData[field.id])) {
          newErrors[field.id] = "Please enter a valid email";
        }
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!leadMagnet) return;

    const fields: FormField[] =
      typeof leadMagnet.formFields === "string"
        ? JSON.parse(leadMagnet.formFields)
        : leadMagnet.formFields;

    if (!validate(fields)) return;

    setStatus("loading");
    try {
      await submitForm({
        leadMagnetId: leadMagnet._id,
        data: formData,
        userAgent:
          typeof navigator !== "undefined" ? navigator.userAgent : undefined,
        utmSource: searchParams.get("utm_source") ?? undefined,
        utmMedium: searchParams.get("utm_medium") ?? undefined,
        utmCampaign: searchParams.get("utm_campaign") ?? undefined,
      });
      setStatus("success");

      if (leadMagnet.redirectUrl) {
        window.location.href = leadMagnet.redirectUrl;
      }
    } catch {
      setStatus("idle");
    }
  };

  // Loading state
  if (leadMagnet === undefined) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--background)]">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-3 text-[var(--muted)]">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-[15px]">Loading...</span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Not found state
  if (leadMagnet === null) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--background)]">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-extrabold mb-2">Not found</h1>
            <p className="text-[15px] text-[var(--muted)] mb-6">
              This resource doesn&apos;t exist or has been removed.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[14px] font-semibold text-[var(--accent)] hover:underline"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Back to home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const fields: FormField[] =
    typeof leadMagnet.formFields === "string"
      ? JSON.parse(leadMagnet.formFields)
      : leadMagnet.formFields;

  const ic =
    "w-full px-4 py-4 text-[16px] rounded-[5px] border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--foreground)] transition-colors";

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <Header />

      <main className="flex-1 flex items-center">
        <section className="w-full py-12 sm:py-16">
          <div className="max-w-[1100px] mx-auto px-5 sm:px-8">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
              {/* Left — Info */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="lg:sticky lg:top-24"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-glow)] text-[var(--accent)] text-[12px] font-semibold mb-5 border border-[var(--accent)]/15">
                  Free Resource
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 leading-tight">
                  {leadMagnet.name}
                </h1>

                {leadMagnet.description && (
                  <p className="text-[16px] leading-relaxed text-[var(--muted)]">
                    {leadMagnet.description}
                  </p>
                )}
              </motion.div>

              {/* Right — Form / Thank You */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="rounded-[5px] border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
                  <div className="p-5 sm:p-7">
                    {status === "success" && !leadMagnet.redirectUrl ? (
                      /* Thank you state */
                      <div className="text-center py-8">
                        <div className="w-14 h-14 rounded-full bg-[var(--accent)] flex items-center justify-center mx-auto mb-5">
                          <CheckCircle className="w-7 h-7 text-force-white" />
                        </div>
                        <h3 className="text-xl font-extrabold mb-2">
                          {leadMagnet.thankYouMsg || "Thank you! Check your email."}
                        </h3>

                        {leadMagnet.fileUrl && (
                          <a
                            href={leadMagnet.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 mt-5 px-6 py-3.5 rounded-[5px] bg-[var(--accent)] text-force-white font-extrabold text-[15px] hover:bg-[var(--accent-hover)] transition-all hover:-translate-y-0.5"
                          >
                            <Download className="w-4 h-4" />
                            Download Now
                          </a>
                        )}

                        <div className="mt-6">
                          <Link
                            href="/"
                            className="text-[14px] text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
                          >
                            &larr; Back to home
                          </Link>
                        </div>
                      </div>
                    ) : (
                      /* Form state */
                      <>
                        <h2 className="text-lg font-extrabold mb-5">
                          Get instant access
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                          {fields.map((field) => (
                            <div key={field.id}>
                              <label className="block text-[13px] font-semibold mb-1.5">
                                {field.label}
                                {field.required && (
                                  <span className="text-red-500 ml-0.5">*</span>
                                )}
                              </label>

                              {field.type === "textarea" ? (
                                <textarea
                                  rows={3}
                                  value={formData[field.id] || ""}
                                  onChange={(e) =>
                                    updateField(field.id, e.target.value)
                                  }
                                  required={field.required}
                                  className={ic + " resize-none"}
                                />
                              ) : field.type === "select" ? (
                                <select
                                  value={formData[field.id] || ""}
                                  onChange={(e) =>
                                    updateField(field.id, e.target.value)
                                  }
                                  required={field.required}
                                  className={ic + " appearance-none cursor-pointer"}
                                >
                                  <option value="">Select...</option>
                                  {field.options?.map((opt) => (
                                    <option key={opt} value={opt}>
                                      {opt}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <input
                                  type={field.type || "text"}
                                  value={formData[field.id] || ""}
                                  onChange={(e) =>
                                    updateField(field.id, e.target.value)
                                  }
                                  required={field.required}
                                  className={ic}
                                />
                              )}

                              {errors[field.id] && (
                                <p className="mt-1.5 text-[13px] text-red-500">
                                  {errors[field.id]}
                                </p>
                              )}
                            </div>
                          ))}

                          <button
                            type="submit"
                            disabled={status === "loading"}
                            className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-[5px] bg-[var(--accent)] text-force-white font-extrabold text-[16px] hover:bg-[var(--accent-hover)] transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
                          >
                            {status === "loading" ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Submitting...
                              </>
                            ) : (
                              <>
                                Get Access
                                <ArrowRight className="w-4 h-4" />
                              </>
                            )}
                          </button>
                        </form>

                        <p className="text-[12px] text-[var(--muted)] text-center mt-4">
                          No spam. Unsubscribe anytime.
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
