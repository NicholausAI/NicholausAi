import { Metadata } from "next";
import { Header, Footer } from "@/components/layout";
import { Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "Refund Policy for Nicholaus, LLC. All sales are final.",
};

export default function RefundPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-20">
        <Container size="sm">
          <div className="mb-12">
            <p className="text-[13px] font-semibold text-[var(--accent)] mb-3 tracking-wide uppercase">
              Legal
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
              Refund Policy
            </h1>
            <p className="text-[14px] text-[var(--text-tertiary)]">
              Last updated: April 7, 2026
            </p>
          </div>

          <div className="space-y-10 text-[15px] text-[var(--muted)] leading-relaxed">
            {/* Banner */}
            <section>
              <div className="p-5 border-2 border-[var(--foreground)] rounded-[3px] bg-[var(--surface)] text-center">
                <p className="text-[22px] font-extrabold text-[var(--foreground)] tracking-tight">
                  ALL SALES ARE FINAL
                </p>
                <p className="text-[15px] text-[var(--muted)] mt-1">
                  No refunds, returns, or exchanges on any product or service.
                </p>
              </div>
            </section>

            {/* 1 */}
            <section>
              <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-3">
                1. Digital Products
              </h2>
              <p>
                All products and services offered by Nicholaus, LLC are digital in nature and are
                delivered electronically or performed remotely. Due to the instant and intangible
                nature of digital goods, all purchases are final and non-refundable once the
                transaction is completed.
              </p>
              <p className="mt-3">
                This applies to all product types including, but not limited to: online courses,
                digital audits, templates, e-books, consulting sessions, strategy blueprints, and
                any other digital deliverable.
              </p>
            </section>

            {/* 2 */}
            <section>
              <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-3">
                2. Subjective Nature of Deliverables
              </h2>
              <p>
                Many of our products involve professional analysis, strategic recommendations, and
                creative deliverables that are inherently subjective in nature. The value and
                effectiveness of audits, consulting sessions, strategies, and educational content
                depend on numerous factors including individual effort, business conditions, market
                variables, and implementation quality — factors that are beyond our control.
              </p>
              <p className="mt-3">
                Nicholaus, LLC does not guarantee specific outcomes, revenue increases, or
                measurable results from the use of any product or service. Dissatisfaction with
                subjective deliverables does not constitute grounds for a refund.
              </p>
            </section>

            {/* 3 */}
            <section>
              <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-3">
                3. What You Agree To at Checkout
              </h2>
              <p>
                Before completing any purchase, you are required to acknowledge and accept this
                Refund Policy by checking the consent box at checkout. By doing so, you expressly
                agree that:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-1.5">
                <li>You understand that all sales are final and non-refundable</li>
                <li>
                  You waive any right to request a refund, chargeback, or payment reversal
                </li>
                <li>
                  You have reviewed the product description and pricing before purchasing
                </li>
                <li>
                  You accept full responsibility for your purchase decision
                </li>
              </ul>
            </section>

            {/* 4 */}
            <section>
              <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-3">
                4. Chargebacks
              </h2>
              <p>
                Initiating a chargeback or payment dispute with your bank or credit card company
                after agreeing to these terms constitutes a breach of this agreement. In the event
                of a chargeback:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-1.5">
                <li>
                  Nicholaus, LLC will dispute the chargeback and provide evidence of your agreement
                  to this no-refund policy, including records of the consent checkbox at checkout
                </li>
                <li>
                  Your access to all purchased products and services will be immediately revoked
                </li>
                <li>
                  You may be held liable for all costs incurred by Nicholaus, LLC in disputing the
                  chargeback, including administrative fees, processing fees, and reasonable
                  attorneys&apos; fees
                </li>
                <li>
                  Unresolved disputes may be referred to a collections agency
                </li>
              </ul>
              <p className="mt-3">
                You agree to contact us directly at{" "}
                <a
                  href="mailto:info@nicholaus.ai"
                  className="text-[var(--accent)] hover:underline"
                >
                  info@nicholaus.ai
                </a>{" "}
                to resolve any issues before initiating a chargeback with your financial
                institution.
              </p>
            </section>

            {/* 5 */}
            <section>
              <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-3">
                5. No Exceptions
              </h2>
              <p>
                This no-refund policy applies without exception. No refunds will be issued for:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-1.5">
                <li>Dissatisfaction with the content, quality, or scope of a deliverable</li>
                <li>Change of mind after purchase</li>
                <li>Failure to use, access, or implement the purchased product</li>
                <li>Duplicate purchases (contact us for assistance before repurchasing)</li>
                <li>
                  Incompatibility with your business, industry, or technical environment
                </li>
                <li>
                  Expectation of specific results that were not explicitly guaranteed
                </li>
              </ul>
            </section>

            {/* 6 */}
            <section>
              <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-3">
                6. Questions Before Purchasing
              </h2>
              <p>
                We encourage you to review all product descriptions, pricing, and deliverables
                carefully before making a purchase. If you have any questions about what is included
                in a product or service, please contact us{" "}
                <strong className="text-[var(--foreground)]">before</strong> completing your
                purchase.
              </p>
              <div className="mt-4 p-4 bg-[var(--surface)] border border-[var(--border)] rounded-[3px]">
                <p className="font-semibold text-[var(--foreground)]">Nicholaus, LLC</p>
                <p>
                  Email:{" "}
                  <a
                    href="mailto:info@nicholaus.ai"
                    className="text-[var(--accent)] hover:underline"
                  >
                    info@nicholaus.ai
                  </a>
                </p>
                <p className="mt-2 text-[13px] text-[var(--text-tertiary)]">
                  We are happy to answer any questions and help you determine if a product is right
                  for you — before you buy.
                </p>
              </div>
            </section>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
