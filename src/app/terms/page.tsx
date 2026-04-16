import { Metadata } from "next";
import { Header, Footer } from "@/components/layout";
import { Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Nicholaus, LLC.",
};

export default function TermsPage() {
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
              Terms of Service
            </h1>
            <p className="text-[14px] text-[var(--text-tertiary)]">
              Last updated: April 7, 2026
            </p>
          </div>

          <div className="space-y-10 text-[15px] text-[var(--muted)] leading-relaxed">
            {/* 1 */}
            <section>
              <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-3">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing, browsing, or purchasing any product or service from Nicholaus, LLC
                (&ldquo;Company,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;),
                you (&ldquo;Customer,&rdquo; &ldquo;you,&rdquo; or &ldquo;your&rdquo;) acknowledge
                that you have read, understood, and agree to be bound by these Terms of Service
                (&ldquo;Terms&rdquo;). If you do not agree, do not use our website or purchase any
                products or services.
              </p>
              <p className="mt-3">
                These Terms constitute a legally binding agreement between you and Nicholaus, LLC.
                Your use of the website and/or completion of a purchase constitutes your acceptance
                of these Terms in their entirety.
              </p>
            </section>

            {/* 2 */}
            <section>
              <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-3">
                2. Products and Services
              </h2>
              <p>
                Nicholaus, LLC provides digital products and professional services including, but not
                limited to: online courses, digital audits, templates, e-books, consulting sessions,
                and other digital deliverables (&ldquo;Products&rdquo;). All Products are delivered
                electronically and/or performed remotely. No physical goods are shipped.
              </p>
              <p className="mt-3">
                Product descriptions, pricing, and availability are subject to change at any time
                without prior notice. We reserve the right to modify, discontinue, or update any
                Product at our sole discretion.
              </p>
            </section>

            {/* 3 */}
            <section>
              <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-3">
                3. All Sales Final — No Refunds
              </h2>
              <div className="p-4 border-2 border-[var(--foreground)] rounded-[3px] bg-[var(--surface)] mb-4">
                <p className="font-extrabold text-[var(--foreground)] text-[16px]">
                  ALL SALES ARE FINAL. NO REFUNDS WILL BE ISSUED UNDER ANY CIRCUMSTANCES.
                </p>
              </div>
              <p>
                Due to the digital and immediately accessible nature of our Products, all purchases
                are non-refundable. Once a transaction is completed, the sale is final. This policy
                applies to all Products without exception, including but not limited to:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-1.5">
                <li>Courses and educational materials</li>
                <li>Audits, reports, and analysis deliverables</li>
                <li>Templates, frameworks, and digital downloads</li>
                <li>E-books and written content</li>
                <li>Consulting and advisory sessions</li>
              </ul>
              <p className="mt-3">
                By completing a purchase, you expressly acknowledge and agree that: (a) you are
                purchasing a digital product or service that is delivered immediately or within the
                stated timeframe; (b) you waive any right to a refund, chargeback, or reversal of
                payment; and (c) you have read and accepted the{" "}
                <a href="/refund" className="text-[var(--accent)] hover:underline">
                  Refund Policy
                </a>{" "}
                in full.
              </p>
            </section>

            {/* 4 */}
            <section>
              <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-3">
                4. Intellectual Property
              </h2>
              <p>
                All Products, content, materials, methodologies, frameworks, and deliverables
                provided by Nicholaus, LLC are and shall remain the exclusive intellectual property
                of Nicholaus, LLC. Upon purchase, you are granted a limited, non-exclusive,
                non-transferable, revocable license to use the Product for your own personal or
                internal business purposes only.
              </p>
              <p className="mt-3">You may not:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1.5">
                <li>Redistribute, resell, share, or sublicense any Product or its contents</li>
                <li>Reproduce, duplicate, or copy any Product for distribution to third parties</li>
                <li>
                  Modify or create derivative works based on our Products for commercial
                  distribution
                </li>
                <li>
                  Claim authorship or ownership of any Product or deliverable created by Nicholaus,
                  LLC
                </li>
              </ul>
              <p className="mt-3">
                Violation of these intellectual property provisions may result in immediate
                termination of your license and legal action.
              </p>
            </section>

            {/* 5 */}
            <section>
              <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-3">
                5. User Representations
              </h2>
              <p>By using our website and purchasing Products, you represent and warrant that:</p>
              <ul className="list-disc pl-6 mt-3 space-y-1.5">
                <li>You are at least 18 years of age</li>
                <li>You have the legal capacity and authority to enter into a binding agreement</li>
                <li>
                  All information you provide is accurate, current, and complete
                </li>
                <li>
                  You are authorized to use the payment method provided for the purchase
                </li>
                <li>
                  You will not use our Products for any unlawful or unauthorized purpose
                </li>
              </ul>
            </section>

            {/* 6 */}
            <section>
              <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-3">
                6. Limitation of Liability
              </h2>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL NICHOLAUS, LLC,
                ITS OWNERS, MEMBERS, MANAGERS, EMPLOYEES, AGENTS, OR AFFILIATES BE LIABLE FOR ANY
                INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT
                LIMITED TO LOSS OF PROFITS, REVENUE, DATA, BUSINESS OPPORTUNITIES, OR GOODWILL,
                ARISING OUT OF OR IN CONNECTION WITH YOUR PURCHASE OR USE OF ANY PRODUCT, REGARDLESS
                OF THE THEORY OF LIABILITY.
              </p>
              <p className="mt-3">
                IN ALL CASES, THE TOTAL AGGREGATE LIABILITY OF NICHOLAUS, LLC SHALL NOT EXCEED THE
                AMOUNT ACTUALLY PAID BY YOU FOR THE SPECIFIC PRODUCT GIVING RISE TO THE CLAIM.
              </p>
            </section>

            {/* 7 */}
            <section>
              <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-3">
                7. Indemnification and Hold Harmless
              </h2>
              <p>
                You agree to indemnify, defend, and hold harmless Nicholaus, LLC, its owners,
                members, managers, employees, agents, and affiliates from and against any and all
                claims, damages, losses, liabilities, costs, and expenses (including reasonable
                attorneys&apos; fees) arising out of or related to: (a) your use of any Product;
                (b) your breach of these Terms; (c) your violation of any applicable law or
                regulation; (d) any dispute between you and a third party related to the Products;
                or (e) any action taken by you based on the content, recommendations, or strategies
                provided in any Product.
              </p>
            </section>

            {/* 8 */}
            <section>
              <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-3">
                8. Disclaimer of Warranties — No Guarantee of Results
              </h2>
              <p>
                ALL PRODUCTS AND SERVICES ARE PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS
                AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR
                STATUTORY, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY,
                FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
              <p className="mt-3">
                Nicholaus, LLC makes no representation, warranty, or guarantee that: (a) any Product
                will produce specific results, outcomes, or revenue; (b) the strategies,
                recommendations, or information provided will be suitable for your particular
                business or circumstances; (c) the use of any Product will result in increased
                leads, sales, revenue, or any other measurable business outcome.
              </p>
              <p className="mt-3">
                Results vary based on individual effort, business conditions, market factors, and
                numerous other variables beyond our control. Any examples, case studies, or
                testimonials referenced are illustrative only and do not guarantee similar results.
              </p>
            </section>

            {/* 9 */}
            <section>
              <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-3">
                9. Dispute Resolution
              </h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the
                State of Florida, without regard to its conflict of law provisions.
              </p>
              <p className="mt-3">
                Any dispute, controversy, or claim arising out of or relating to these Terms, or the
                breach, termination, or invalidity thereof, shall be resolved through binding
                arbitration administered in the State of Florida in accordance with the rules of the
                American Arbitration Association. The arbitrator&apos;s decision shall be final and
                binding.
              </p>
              <p className="mt-3 font-semibold text-[var(--foreground)]">
                YOU AGREE TO WAIVE ANY RIGHT TO PARTICIPATE IN A CLASS ACTION LAWSUIT OR CLASS-WIDE
                ARBITRATION AGAINST NICHOLAUS, LLC.
              </p>
              <p className="mt-3">
                Before initiating arbitration, you agree to first attempt to resolve any dispute by
                contacting us directly at info@nicholaus.ai. You agree to attempt resolution in good
                faith for a period of at least thirty (30) days before commencing arbitration
                proceedings.
              </p>
            </section>

            {/* 10 */}
            <section>
              <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-3">
                10. Modifications
              </h2>
              <p>
                Nicholaus, LLC reserves the right to modify, update, or revise these Terms at any
                time at its sole discretion. Changes will be effective immediately upon posting to
                this page. Your continued use of the website or any Product after such changes
                constitutes your acceptance of the revised Terms. It is your responsibility to review
                these Terms periodically.
              </p>
            </section>

            {/* 11 */}
            <section>
              <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-3">
                11. Severability
              </h2>
              <p>
                If any provision of these Terms is found to be invalid, illegal, or unenforceable by
                a court of competent jurisdiction, such invalidity shall not affect the remaining
                provisions, which shall continue in full force and effect. The invalid provision
                shall be modified to the minimum extent necessary to make it valid and enforceable.
              </p>
            </section>

            {/* 12 */}
            <section>
              <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-3">
                12. Contact
              </h2>
              <p>
                For questions regarding these Terms of Service, contact us at:
              </p>
              <div className="mt-3 p-4 bg-[var(--surface)] border border-[var(--border)] rounded-[3px]">
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
              </div>
            </section>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
