import Link from "next/link";
import { Metadata } from "next";
import { Header, Footer } from "@/components/layout";
import { Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "You're Subscribed",
  description: "Welcome to the newsletter.",
};

export default function SubscriptionConfirmedPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-16 sm:py-24">
        <Container size="sm">
          <div className="text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-[var(--accent-glow)] flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-[var(--accent)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
              You&apos;re subscribed!
            </h1>

            <p className="text-[16px] text-[var(--muted)] mb-8 leading-relaxed">
              Check your inbox for a welcome email. Your first issue drops this
              week — actionable systems you can deploy right away.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-[15px] font-semibold rounded-[3px] bg-[var(--accent)] text-force-white hover:bg-[var(--accent-hover)] transition-all w-full sm:w-auto"
              >
                Back to site
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-[15px] font-medium rounded-[3px] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors w-full sm:w-auto"
              >
                Read the blog
              </Link>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
