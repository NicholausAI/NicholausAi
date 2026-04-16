"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle,
  Shield,
  Lock,
  Clock,
  Star,
  Zap,
  AlertCircle,
} from "lucide-react";
import CollectJSPaymentForm from "@/components/checkout/CollectJSPaymentForm";
import LegalConsent from "@/components/checkout/LegalConsent";

export default function AuditCheckout() {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    website: "",
  });
  const [addUpsell, setAddUpsell] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const set =
    (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((p) => ({ ...p, [key]: e.target.value }));

  const total = addUpsell ? 694 : 497;
  const productSlug = addUpsell ? "google-ads-audit-bundle" : "google-ads-audit";
  const customerName = `${form.firstName} ${form.lastName}`.trim();

  const contactInfoValid =
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.email.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);

  const handlePaymentSuccess = (transactionId: string) => {
    router.push(`/thank-you?product=${productSlug}&txn=${transactionId}`);
  };

  const handlePaymentError = (error: string) => {
    setPaymentError(error);
  };

  const inp =
    "w-full px-4 py-3 text-[15px] rounded-[3px] border border-[var(--border-default)] bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--foreground)] transition-colors";

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
          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-1 text-[12px] text-[var(--muted)]">
              info@nicholaus.ai
            </span>
            <span className="flex items-center gap-1 text-[11px] text-[var(--text-tertiary)]">
              <Lock className="w-3 h-3" /> Secure
            </span>
          </div>
        </div>
      </div>

      {/* Urgency */}
      <div className="bg-[var(--accent)] py-1.5 text-center">
        <p className="text-[12px] font-bold text-force-white flex items-center justify-center gap-1.5">
          <Zap className="w-3 h-3" /> Only 3 audit slots left this month
        </p>
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
                <div className="grid sm:grid-cols-3 gap-2.5">
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
                    placeholder="Phone"
                    className={inp}
                  />
                  <input
                    required
                    value={form.website}
                    onChange={set("website")}
                    placeholder="Website URL"
                    className={inp}
                  />
                </div>
              </div>

              {/* Payment */}
              <div className="bg-[var(--background)] rounded-[3px] border border-[var(--border)] p-5 mb-3">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-[15px] font-extrabold">Payment</h2>
                  <span className="text-[11px] text-[var(--text-tertiary)] flex items-center gap-1">
                    <Lock className="w-3 h-3" /> 256-bit
                  </span>
                </div>
                <CollectJSPaymentForm
                  productSlug={productSlug}
                  customerEmail={form.email}
                  customerName={customerName}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  disabled={!contactInfoValid || !agreedToTerms}
                />
              </div>

              {/* Payment error */}
              {paymentError && (
                <div className="mb-3 p-4 bg-red-500/10 border border-red-500/20 rounded-[3px]">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-[13px] text-red-600">{paymentError}</p>
                  </div>
                </div>
              )}

              {/* Order bump */}
              <div
                className={
                  "rounded-[3px] border-2 p-4 mb-3 cursor-pointer transition-all " +
                  (addUpsell
                    ? "border-[var(--accent)] bg-[var(--accent-glow)]"
                    : "border-[var(--border)] bg-[var(--background)]")
                }
                onClick={() => setAddUpsell(!addUpsell)}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={
                      "w-5 h-5 rounded-[3px] border-2 flex items-center justify-center shrink-0 mt-0.5 " +
                      (addUpsell
                        ? "bg-[var(--accent)] border-[var(--accent)]"
                        : "border-[var(--border)]")
                    }
                  >
                    {addUpsell && (
                      <CheckCircle className="w-3 h-3 text-force-white" />
                    )}
                  </div>
                  <div>
                    <p className="text-[14px] font-extrabold">
                      YES! Add the Funnel Strategy Blueprint —{" "}
                      <span className="text-[var(--accent)]">$197</span>{" "}
                      <span className="text-[12px] text-[var(--text-tertiary)] line-through font-normal">
                        $497
                      </span>
                    </p>
                    <p className="text-[13px] text-[var(--muted)] leading-snug mt-0.5">
                      Custom funnel architecture.{" "}
                      <strong>82% of buyers add this.</strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* Legal consent */}
              <div className="mb-4">
                <LegalConsent
                  agreed={agreedToTerms}
                  onChange={setAgreedToTerms}
                />
              </div>

              {/* Trust row */}
              <div className="flex items-center justify-center gap-4 text-[11px] text-[var(--text-tertiary)]">
                <span className="flex items-center gap-1">
                  <Shield className="w-3 h-3" /> All sales final
                </span>
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Secure
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> 5-day delivery
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
                  <div className="w-14 h-18 rounded-[3px] bg-[var(--accent)] flex items-center justify-center shrink-0 px-1.5 py-3">
                    <span className="text-force-white text-[9px] font-extrabold text-center leading-tight">
                      GOOGLE ADS AUDIT
                    </span>
                  </div>
                  <div>
                    <h3 className="text-[15px] font-extrabold">
                      Google Ads Audit
                    </h3>
                    <p className="text-[12px] text-[var(--muted)]">
                      12-page report + video walkthrough
                    </p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-[12px] text-[var(--text-tertiary)] line-through">
                        $997
                      </span>
                      <span className="text-[18px] font-extrabold">$497</span>
                    </div>
                  </div>
                </div>
                {addUpsell && (
                  <div className="flex items-center justify-between py-2 border-t border-[var(--border)]">
                    <span className="text-[13px] font-bold">
                      Funnel Blueprint
                    </span>
                    <span className="text-[15px] font-extrabold">$197</span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
                  <span className="text-[15px] font-extrabold">Total</span>
                  <span className="text-[22px] font-extrabold">${total}</span>
                </div>
              </div>

              {/* Includes */}
              <div className="px-5 py-3 border-b border-[var(--border)]">
                <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                  {[
                    "Full account audit",
                    "Wasted spend report",
                    "Keyword review",
                    "Competitor intel",
                    "Landing page review",
                    "Action plan",
                    "Video walkthrough",
                    "5-day delivery",
                  ].map((item) => (
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

              {/* Testimonial */}
              <div className="px-5 py-3 border-b border-[var(--border)]">
                <div className="flex items-start gap-2">
                  <div className="flex gap-0.5 shrink-0 mt-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className="w-3 h-3 fill-[var(--accent)] text-[var(--accent)]"
                      />
                    ))}
                  </div>
                  <div>
                    <p className="text-[12px] italic leading-snug">
                      Found $1,800/mo in wasted spend. Paid for itself in a
                      week.
                    </p>
                    <p className="text-[10px] text-[var(--text-tertiary)] mt-1">
                      — Mike R., Plumber, Austin TX
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom */}
              <div className="p-4">
                <p className="text-[11px] text-center text-[var(--text-tertiary)]">
                  <Zap className="w-3 h-3 inline -mt-0.5" /> Delivered within 5
                  business days
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
