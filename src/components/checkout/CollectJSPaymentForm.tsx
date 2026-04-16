"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Script from "next/script";
import { AlertCircle } from "lucide-react";

// Collect.js global type declarations
declare global {
  interface Window {
    CollectJS?: {
      configure: (config: CollectJSConfig) => void;
      startPaymentRequest: () => void;
    };
  }
}

interface CollectJSConfig {
  variant: string;
  callback: (response: CollectJSResponse) => void;
  validationCallback?: (field: string, valid: boolean, message: string) => void;
  fieldsAvailableCallback?: () => void;
  fields?: Record<string, CollectJSFieldConfig>;
  customCss?: Record<string, string>;
  invalidCss?: Record<string, string>;
  focusCss?: Record<string, string>;
  placeholderCss?: Record<string, string>;
}

interface CollectJSFieldConfig {
  selector: string;
  title?: string;
  placeholder?: string;
}

interface CollectJSResponse {
  token: string;
  card?: {
    number: string;
    bin: string;
    exp: string;
    hash: string;
    type: string;
  };
}

interface BillingAddress {
  address1?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

interface CollectJSPaymentFormProps {
  productSlug: string;
  customerEmail: string;
  customerName: string;
  billingAddress?: BillingAddress;
  onSuccess: (transactionId: string, purchaseId: string) => void;
  onError: (error: string) => void;
  disabled?: boolean;
}

type PaymentState = "loading" | "ready" | "processing" | "success" | "error";
type FieldValidity = Record<string, boolean>;

export default function CollectJSPaymentForm({
  productSlug,
  customerEmail,
  customerName,
  billingAddress,
  onSuccess,
  onError,
  disabled = false,
}: CollectJSPaymentFormProps) {
  const [paymentState, setPaymentState] = useState<PaymentState>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldValidity, setFieldValidity] = useState<FieldValidity>({});
  const idempotencyKeyRef = useRef(crypto.randomUUID());
  const configuredRef = useRef(false);

  const tokenizationKey = process.env.NEXT_PUBLIC_NMI_TOKENIZATION_KEY;

  const handleToken = useCallback(
    async (response: CollectJSResponse) => {
      if (paymentState === "processing") return; // Prevent double-submit
      setPaymentState("processing");
      setErrorMessage("");

      try {
        const res = await fetch("/api/payments/charge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentToken: response.token,
            productSlug,
            customerEmail,
            customerName,
            idempotencyKey: idempotencyKeyRef.current,
            billingAddress,
          }),
        });

        const data = await res.json();

        if (data.success) {
          setPaymentState("success");
          onSuccess(data.transactionId, data.purchaseId);
        } else {
          setPaymentState("error");
          const msg = data.error || "Payment was declined. Please try again.";
          setErrorMessage(msg);
          onError(msg);
          // Generate new idempotency key for retry
          idempotencyKeyRef.current = crypto.randomUUID();
        }
      } catch {
        setPaymentState("error");
        const msg = "A network error occurred. Please try again.";
        setErrorMessage(msg);
        onError(msg);
        idempotencyKeyRef.current = crypto.randomUUID();
      }
    },
    [productSlug, customerEmail, customerName, billingAddress, onSuccess, onError, paymentState]
  );

  const configureCollectJS = useCallback(() => {
    if (!window.CollectJS || configuredRef.current) return;
    configuredRef.current = true;

    window.CollectJS.configure({
      variant: "inline",
      callback: handleToken,
      fieldsAvailableCallback: () => {
        setPaymentState("ready");
      },
      validationCallback: (field: string, valid: boolean) => {
        setFieldValidity((prev) => ({ ...prev, [field]: valid }));
      },
      fields: {
        ccnumber: {
          selector: "#collectjs-ccnumber",
          title: "Card Number",
          placeholder: "0000 0000 0000 0000",
        },
        ccexp: {
          selector: "#collectjs-ccexp",
          title: "Expiration Date",
          placeholder: "MM / YY",
        },
        cvv: {
          selector: "#collectjs-cvv",
          title: "CVV",
          placeholder: "***",
        },
      },
      customCss: {
        "border-color": "var(--border)",
        "background-color": "var(--background)",
        color: "var(--foreground)",
        "font-size": "15px",
        "font-family":
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        padding: "12px 16px",
        "border-radius": "3px",
        "border-style": "solid",
        "border-width": "1px",
        height: "48px",
      },
      focusCss: {
        "border-color": "var(--accent)",
        "box-shadow": "0 0 0 2px rgba(253,216,53,0.4)",
        outline: "none",
      },
      invalidCss: {
        "border-color": "#ef4444",
      },
      placeholderCss: {
        color: "var(--muted)",
        opacity: "0.5",
      },
    });
  }, [handleToken]);

  useEffect(() => {
    // If Collect.js already loaded before our effect ran
    if (window.CollectJS && !configuredRef.current) {
      configureCollectJS();
    }
  }, [configureCollectJS]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentState !== "ready" && paymentState !== "error") return;
    if (disabled) return;

    // Validate customer fields
    if (!customerEmail || !customerName) {
      setErrorMessage("Please fill in your contact information above.");
      setPaymentState("error");
      return;
    }

    setPaymentState("processing");
    window.CollectJS?.startPaymentRequest();
  };

  const getFieldBorderClass = (field: string) => {
    if (fieldValidity[field] === false)
      return "border-red-500";
    if (fieldValidity[field] === true)
      return "border-green-500/50";
    return "border-[var(--border)]";
  };

  return (
    <>
      {tokenizationKey && (
        <Script
          src="https://secure.nmi.com/token/Collect.js"
          data-tokenization-key={tokenizationKey}
          data-variant="inline"
          strategy="afterInteractive"
          onLoad={configureCollectJS}
        />
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-[1fr_100px_80px] gap-2.5 mb-3">
          <div
            className={`rounded-[3px] border overflow-hidden transition-colors ${getFieldBorderClass("ccnumber")}`}
          >
            <div
              id="collectjs-ccnumber"
              className="min-h-[48px]"
              style={
                paymentState === "loading"
                  ? { background: "var(--background)" }
                  : undefined
              }
            />
          </div>
          <div
            className={`rounded-[3px] border overflow-hidden transition-colors ${getFieldBorderClass("ccexp")}`}
          >
            <div
              id="collectjs-ccexp"
              className="min-h-[48px]"
              style={
                paymentState === "loading"
                  ? { background: "var(--background)" }
                  : undefined
              }
            />
          </div>
          <div
            className={`rounded-[3px] border overflow-hidden transition-colors ${getFieldBorderClass("cvv")}`}
          >
            <div
              id="collectjs-cvv"
              className="min-h-[48px]"
              style={
                paymentState === "loading"
                  ? { background: "var(--background)" }
                  : undefined
              }
            />
          </div>
        </div>

        {/* Error banner */}
        {paymentState === "error" && errorMessage && (
          <div className="flex items-start gap-2.5 p-3 mb-3 bg-red-500/10 border border-red-500/20 rounded-[3px]">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <p className="text-[13px] text-red-500">{errorMessage}</p>
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={
            disabled ||
            paymentState === "loading" ||
            paymentState === "processing" ||
            paymentState === "success"
          }
          className="w-full px-6 py-4 rounded-[3px] bg-[var(--accent)] text-force-white font-extrabold text-[17px] hover:bg-[var(--accent-hover)] transition-all hover:-translate-y-0.5 disabled:opacity-60 shadow-lg shadow-[var(--accent)]/15"
        >
          {paymentState === "loading" && "Loading..."}
          {paymentState === "ready" && "Complete Purchase"}
          {paymentState === "processing" && "Processing..."}
          {paymentState === "success" && "Payment successful!"}
          {paymentState === "error" && "Try Again"}
        </button>
      </form>
    </>
  );
}
