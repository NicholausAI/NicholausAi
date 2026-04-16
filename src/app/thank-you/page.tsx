import Link from "next/link";
import { convex } from "@/lib/convex";
import { api } from "../../../convex/_generated/api";
import { Header, Footer } from "@/components/layout";
import { Container } from "@/components/ui";

const typeLabels: Record<string, string> = {
  course: "Course",
  audit: "Audit",
  template: "Template",
  ebook: "E-Book",
  consultation: "Consultation",
};

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string; txn?: string }>;
}) {
  const { product: productSlug, txn: transactionId } = await searchParams;

  let product: {
    name: string;
    type: string;
    description?: string;
  } | null = null;

  if (productSlug) {
    try {
      product = await convex.query(api.products.getBySlug, { slug: productSlug });
    } catch {
      product = null;
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-[60vh] flex items-center justify-center py-16 sm:py-24">
        <Container size="sm">
          <div className="text-center max-w-md mx-auto">
            {/* Success icon */}
            <div className="w-16 h-16 rounded-full bg-[var(--accent-glow)] flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-[var(--accent)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-3">
              Thank you for your purchase!
            </h1>

            {/* Product-specific or generic message */}
            {product ? (
              <div className="mb-8">
                <p className="text-[16px] text-[var(--muted)] mb-2">
                  You now have access to:
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-[5px]">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)] bg-[var(--accent-glow)] px-1.5 py-0.5 rounded-[3px]">
                    {typeLabels[product.type] || product.type}
                  </span>
                  <span className="text-[15px] font-semibold text-[var(--foreground)]">
                    {product.name}
                  </span>
                </div>
                {product.description && (
                  <p className="text-[14px] text-[var(--muted)] mt-3 leading-relaxed">
                    {product.description}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-[16px] text-[var(--muted)] mb-8">
                Your order has been confirmed. Check your email for details.
              </p>
            )}

            {/* Transaction ID */}
            {transactionId && (
              <div className="mb-8 text-center">
                <p className="text-[13px] text-[var(--muted)]">
                  Transaction ID:{" "}
                  <span className="font-mono text-[var(--foreground)]">{transactionId}</span>
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-[15px] font-semibold rounded-[5px] bg-[var(--accent)] text-force-white hover:bg-[var(--accent-hover)] transition-all w-full sm:w-auto"
              >
                Access your purchase
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-[15px] font-medium rounded-[5px] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors w-full sm:w-auto"
              >
                Continue browsing
              </Link>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
