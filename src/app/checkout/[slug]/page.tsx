"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { motion } from "framer-motion";
import {
  Shield,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Lock,
  CheckCircle,
  Clock,
  Zap,
} from "lucide-react";
import CollectJSPaymentForm from "@/components/checkout/CollectJSPaymentForm";
import LegalConsent from "@/components/checkout/LegalConsent";

const typeLabels: Record<string, string> = {
  course: "Course",
  audit: "Audit",
  template: "Template",
  ebook: "E-Book",
  consultation: "Consultation",
};

const typeIncludes: Record<string, string[]> = {
  course: [
    "Full curriculum access",
    "Downloadable resources",
    "Lifetime updates",
    "Community access",
    "Certificate of completion",
    "Secure checkout",
  ],
  audit: [
    "Full account audit",
    "Wasted spend report",
    "Keyword review",
    "Competitor intel",
    "Landing page review",
    "Action plan",
    "Video walkthrough",
    "Secure checkout",
  ],
  template: [
    "Ready-to-use files",
    "Full documentation",
    "Customization guide",
    "Future updates",
    "Setup support",
    "Secure checkout",
  ],
  ebook: [
    "Full PDF download",
    "Worksheets included",
    "Bonus resources",
    "Future editions",
    "Secure checkout",
  ],
  consultation: [
    "1-on-1 video session",
    "Screen sharing",
    "Session recording",
    "Action plan summary",
    "Follow-up email",
    "Secure checkout",
  ],
};

function formatPrice(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0,
  }).format(amount);
}

const inp =
  "w-full px-4 py-3 text-[15px] rounded-[3px] border border-[var(--border-default)] bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--foreground)] transition-colors";

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const product = useQuery(api.products.getBySlug, { slug });

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [paymentError, setPaymentError] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const set =
    (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((p) => ({ ...p, [key]: e.target.value }));

  const customerName = `${form.firstName} ${form.lastName}`.trim();
  const contactInfoValid =
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.email.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);

  const handlePaymentSuccess = (transactionId: string) => {
    router.push(`/thank-you?product=${slug}&txn=${transactionId}`);
  };

  const handlePaymentError = (error: string) => {
    setPaymentError(error);
  };

  // Loading
  if (product === undefined) {
    return (
      <div className="h-screen bg-[var(--surface)] flex items-center justify-center">
        <div className="flex items-center gap-3 text-[var(--muted)]">
          <Loader2 className="w-5 h-5 animate-spin text-[var(--accent)]" />
          <span className="text-[15px]">Loading checkout...</span>
        </div>
      </div>
    );
  }

  // Not found
  if (product === null || !product.published) {
    return (
      <div className="h-screen bg-[var(--surface)] flex items-center justify-center px-5">
        <div className="max-w-[460px] text-center">
          <div className="w-14 h-14 rounded-full bg-[var(--background)] border border-[var(--border)] flex items-center justify-center mx-auto mb-5">
            <AlertCircle className="w-6 h-6 text-[var(--muted)]" />
          </div>
          <h1 className="text-2xl font-extrabold mb-2">Product not found</h1>
          <p className="text-[15px] text-[var(--muted)] mb-6">
            This product doesn&apos;t exist or is no longer available.
          </p>
          <Link
            href="/"
            className="text-[var(--accent)] font-semibold hover:underline"
          >
            Back to site
          </Link>
        </div>
      </div>
    );
  }

  const includes = typeIncludes[product.type] || typeIncludes.course;
  const price = formatPrice(product.price, product.currency);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--surface)]">
      {/* Top bar */}
      <div className="bg-[var(--background)] border-b border-[var(--border)]">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 py-2 flex items-center justify-between">
          <Link
            href="/"
            className="text-[13px] font-bold text-[var(--foreground)] flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </Link>
          <div className="flex items-center gap-1.5 text-[12px] text-[var(--text-tertiary)]">
            <Lock className="w-3 h-3" /> Secure checkout
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-start lg:items-center">
        <div className="w-full max-w-[1200px] mx-auto px-5 sm:px-8 py-8 lg:py-4">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-6 lg:gap-10 items-start">
            {/* LEFT — Form */}
            <div>
              {/* Contact */}
              <div className="bg-[var(--background)] rounded-[3px] border border-[var(--border)] p-5 mb-3">
                <h2 className="text-[15px] font-extrabold mb-3">
                  Contact details
                </h2>
                <div className="grid sm:grid-cols-2 gap-2.5 mb-2.5">
                  <input
                    required
                    value={form.firstName}
                    onChange={set("firstName")}
                    placeholder="First name"
                    className={inp}
                  />
                  <input
                    required
                    value={form.lastName}
                    onChange={set("lastName")}
                    placeholder="Last name"
                    className={inp}
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={set("email")}
                    placeholder="Email"
                    className={inp}
                  />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={set("phone")}
                    placeholder="Phone (optional)"
                    className={inp}
                  />
                </div>
              </div>

              {/* Payment (Collect.js) */}
              <div className="bg-[var(--background)] rounded-[3px] border border-[var(--border)] p-5 mb-3">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-[15px] font-extrabold">Payment</h2>
                  <span className="text-[11px] text-[var(--text-tertiary)] flex items-center gap-1">
                    <Lock className="w-3 h-3" /> 256-bit
                  </span>
                </div>
                <CollectJSPaymentForm
                  productSlug={slug}
                  customerEmail={form.email}
                  customerName={customerName}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  disabled={!contactInfoValid || !agreedToTerms}
                />
              </div>

              {/* Legal consent */}
              <div className="mb-3">
                <LegalConsent
                  agreed={agreedToTerms}
                  onChange={setAgreedToTerms}
                />
              </div>

              {/* Payment error */}
              {paymentError && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-3 p-4 bg-red-500/8 border border-red-500/15 rounded-[3px]"
                >
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-[14px] text-red-600">{paymentError}</p>
                  </div>
                </motion.div>
              )}

              {/* Trust row */}
              <div className="flex items-center justify-center gap-4 text-[11px] text-[var(--text-tertiary)] mt-2">
                <span className="flex items-center gap-1">
                  <Shield className="w-3 h-3" /> All sales final
                </span>
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Secure
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Instant access
                </span>
              </div>
            </div>

            {/* RIGHT — Order summary */}
            <div className="bg-[var(--background)] rounded-[3px] border border-[var(--border)] overflow-hidden">
              {/* Product */}
              <div className="p-5 border-b border-[var(--border)]">
                <h2 className="text-[15px] font-extrabold mb-3">
                  Order summary
                </h2>
                <div className="flex gap-4 mb-3">
                  {product.coverImageUrl ? (
                    <div className="w-16 h-16 rounded-[3px] overflow-hidden shrink-0 relative">
                      <Image
                        src={product.coverImageUrl}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-[3px] bg-[var(--accent)] flex items-center justify-center shrink-0 px-1.5">
                      <span className="text-force-white text-[9px] font-extrabold text-center leading-tight uppercase">
                        {product.name}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="text-[15px] font-extrabold">
                      {product.name}
                    </h3>
                    {product.description && (
                      <p className="text-[12px] text-[var(--muted)] line-clamp-2">
                        {product.description}
                      </p>
                    )}
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-[18px] font-extrabold">
                        {price}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
                  <span className="text-[15px] font-extrabold">Total</span>
                  <span className="text-[22px] font-extrabold">{price}</span>
                </div>
              </div>

              {/* Includes */}
              <div className="px-5 py-3 border-b border-[var(--border)]">
                <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                  {includes.map((item) => (
                    <div key={item} className="flex items-center gap-1.5">
                      <CheckCircle className="w-3 h-3 text-[var(--accent)] shrink-0" />
                      <span className="text-[12px]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* All sales final notice */}
              <div className="px-5 py-3 border-b border-[var(--border)] bg-[var(--surface)]">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[var(--muted)] shrink-0" />
                  <p className="text-[12px] text-[var(--muted)]">
                    <strong className="text-[var(--foreground)]">
                      All sales final
                    </strong>{" "}
                    — digital products are non-refundable. See our{" "}
                    <a
                      href="/refund"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--accent)] hover:underline"
                    >
                      refund policy
                    </a>
                    .
                  </p>
                </div>
              </div>

              {/* Footer CTA */}
              <div className="p-4">
                <p className="text-[11px] text-center text-[var(--text-tertiary)] mb-2">
                  <Zap className="w-3 h-3 inline -mt-0.5" /> Instant access
                  after purchase
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
