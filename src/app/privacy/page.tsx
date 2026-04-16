import { Metadata } from "next";
import { Header, Footer } from "@/components/layout";
import { Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Nicholaus, LLC.",
};

export default function PrivacyPage() {
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
              Privacy Policy
            </h1>
            <p className="text-[14px] text-[var(--text-tertiary)]">
              Last updated: April 7, 2026
            </p>
          </div>

          <div className="space-y-10 text-[15px] text-[var(--muted)] leading-relaxed">
            {/* Intro */}
            <section>
              <p>
                Nicholaus, LLC (&ldquo;Company,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or
                &ldquo;our&rdquo;) respects your privacy. This Privacy Policy describes how we
                collect, use, store, and protect your personal information when you visit our
                website or purchase our products and services.
              </p>
            </section>

            {/* 1 */}
            <section>
              <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-3">
                1. Information We Collect
              </h2>
              <p>We collect the following information when you interact with our website:</p>
              <ul className="list-disc pl-6 mt-3 space-y-1.5">
                <li>
                  <strong className="text-[var(--foreground)]">Contact information:</strong> Full
                  name, email address, phone number (optional), and website URL (when applicable)
                </li>
                <li>
                  <strong className="text-[var(--foreground)]">Payment information:</strong> Credit
                  or debit card details are collected and processed exclusively by our third-party
                  payment processor, NMI (Network Merchants, Inc.). We do not receive, store, or
                  have access to your full card number, CVV, or expiration date.
                </li>
                <li>
                  <strong className="text-[var(--foreground)]">Transaction records:</strong>{" "}
                  Purchase history, transaction IDs, and order details for fulfillment and support
                  purposes
                </li>
                <li>
                  <strong className="text-[var(--foreground)]">Communications:</strong> Any
                  messages, emails, or information you voluntarily provide when contacting us
                </li>
              </ul>
            </section>

            {/* 2 */}
            <section>
              <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-3">
                2. How We Use Your Information
              </h2>
              <p>We use the information collected to:</p>
              <ul className="list-disc pl-6 mt-3 space-y-1.5">
                <li>Process and fulfill your orders and transactions</li>
                <li>Deliver purchased digital products and services</li>
                <li>Send transactional emails including order confirmations and receipts</li>
                <li>Provide customer support and respond to inquiries</li>
                <li>
                  Send periodic newsletters and updates (only if you have opted in; you may
                  unsubscribe at any time)
                </li>
                <li>Improve our products, services, and website experience</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            {/* 3 */}
            <section>
              <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-3">
                3. Payment Processing
              </h2>
              <p>
                All payment transactions are processed by{" "}
                <strong className="text-[var(--foreground)]">
                  NMI (Network Merchants, Inc.)
                </strong>
                , a PCI DSS Level 1 compliant third-party payment processor. When you enter your
                payment details at checkout, your card information is tokenized directly by NMI
                using their Collect.js library. This means:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-1.5">
                <li>Your card details are encrypted in transit using 256-bit SSL/TLS encryption</li>
                <li>
                  Card data is sent directly to NMI&apos;s secure servers — it never passes through
                  or is stored on our servers
                </li>
                <li>We receive only a secure payment token to process the transaction</li>
                <li>
                  We never see, access, or store your full card number, CVV, or expiration date
                </li>
              </ul>
            </section>

            {/* 4 */}
            <section>
              <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-3">
                4. Data Sharing
              </h2>
              <p>
                We do not sell, rent, trade, or otherwise share your personal information with third
                parties for their marketing purposes. We share information only with the following
                service providers, solely to operate our business:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-1.5">
                <li>
                  <strong className="text-[var(--foreground)]">NMI</strong> — payment processing
                </li>
                <li>
                  <strong className="text-[var(--foreground)]">MailerLite</strong> — transactional email
                  delivery (receipts, confirmations)
                </li>
              </ul>
              <p className="mt-3">
                We may also disclose information if required by law, court order, or governmental
                regulation, or if necessary to protect our rights, property, or safety.
              </p>
            </section>

            {/* 5 */}
            <section>
              <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-3">
                5. Cookies and Analytics
              </h2>
              <p>
                Our website uses cookies, tracking pixels, and similar technologies to operate,
                analyze performance, and deliver targeted advertising. These include:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-1.5">
                <li>
                  <strong className="text-[var(--foreground)]">Analytics:</strong> We use Umami
                  Analytics and other analytics tools to measure website traffic, user behavior,
                  and conversion performance.
                </li>
                <li>
                  <strong className="text-[var(--foreground)]">Advertising pixels and tags:</strong>{" "}
                  We use tracking pixels, conversion APIs, and tags from advertising platforms
                  (including but not limited to Google Ads, Meta/Facebook, and other ad networks)
                  to measure ad performance, build retargeting audiences, and deliver personalized
                  advertisements to you across other websites and platforms.
                </li>
                <li>
                  <strong className="text-[var(--foreground)]">Retargeting:</strong> When you visit
                  our website, third-party advertising partners may collect information about your
                  browsing activity using cookies and pixels to show you relevant ads on other
                  websites, social media platforms, and email.
                </li>
                <li>
                  <strong className="text-[var(--foreground)]">Email marketing and outbound:</strong>{" "}
                  We may use your email address and other contact information for marketing
                  communications, including newsletters, promotional offers, and outbound outreach.
                  You may opt out of marketing emails at any time by clicking the unsubscribe link
                  in any email.
                </li>
                <li>
                  <strong className="text-[var(--foreground)]">Functional cookies:</strong>{" "}
                  Essential cookies used to maintain website functionality, remember preferences,
                  and support the checkout process.
                </li>
              </ul>
              <p className="mt-3">
                By using our website, you consent to the use of cookies, pixels, and tracking
                technologies as described above. You may manage cookie preferences through your
                browser settings, though disabling cookies may affect website functionality.
              </p>
            </section>

            {/* 6 */}
            <section>
              <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-3">
                6. Data Retention
              </h2>
              <p>
                We retain your personal information for as long as necessary to fulfill the purposes
                described in this policy, including to comply with legal, accounting, or reporting
                obligations. Purchase records and transaction data are retained for business and tax
                compliance purposes.
              </p>
              <p className="mt-3">
                If you request deletion of your data, we will remove your personal information from
                our active systems, except where retention is required by law or for legitimate
                business purposes (e.g., transaction records for tax compliance).
              </p>
            </section>

            {/* 7 */}
            <section>
              <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-3">
                7. Your Rights
              </h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 mt-3 space-y-1.5">
                <li>
                  <strong className="text-[var(--foreground)]">Access</strong> the personal
                  information we hold about you
                </li>
                <li>
                  <strong className="text-[var(--foreground)]">Correct</strong> any inaccurate or
                  incomplete information
                </li>
                <li>
                  <strong className="text-[var(--foreground)]">Request deletion</strong> of your
                  personal data, subject to legal retention requirements
                </li>
                <li>
                  <strong className="text-[var(--foreground)]">Unsubscribe</strong> from marketing
                  emails at any time
                </li>
              </ul>
              <p className="mt-3">
                To exercise any of these rights, contact us at{" "}
                <a
                  href="mailto:info@nicholaus.ai"
                  className="text-[var(--accent)] hover:underline"
                >
                  info@nicholaus.ai
                </a>
                . We will respond to your request within thirty (30) days.
              </p>
            </section>

            {/* 8 */}
            <section>
              <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-3">
                8. Security
              </h2>
              <p>
                We take reasonable administrative, technical, and physical measures to protect your
                personal information. All data transmitted between your browser and our website is
                encrypted using SSL/TLS protocols. Payment data is tokenized by NMI and never stored
                on our servers.
              </p>
              <p className="mt-3">
                However, no method of electronic transmission or storage is 100% secure. While we
                strive to protect your information, we cannot guarantee absolute security.
              </p>
            </section>

            {/* 9 */}
            <section>
              <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-3">
                9. Changes to This Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time. Changes will be effective
                immediately upon posting to this page. The &ldquo;Last updated&rdquo; date at the
                top of this page reflects the most recent revision. We encourage you to review this
                policy periodically.
              </p>
            </section>

            {/* 10 */}
            <section>
              <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-3">
                10. Contact
              </h2>
              <p>
                For questions or concerns regarding this Privacy Policy, contact us at:
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
