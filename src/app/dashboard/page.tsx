"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Header, Footer } from "@/components/layout";
import { Container } from "@/components/ui";

export default function UserDashboard() {
  // In a real implementation, this would use useQuery with the authenticated user's ID
  // to fetch their purchases via api.purchases.listByUser
  // For now, show a placeholder dashboard

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-20">
        <Container size="md">
          <div className="mb-12">
            <h1 className="text-3xl font-bold mb-2">Your Dashboard</h1>
            <p className="text-[var(--muted)]">
              Manage your purchases and account settings.
            </p>
          </div>

          {/* Purchased Products */}
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
              <span className="w-8 h-[2px] bg-[var(--accent)]" />
              Your Products
            </h2>

            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[5px] p-12 text-center">
              <div className="w-12 h-12 rounded-full bg-[var(--accent-glow)] border border-[var(--accent)]/20 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-[var(--accent)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">No purchases yet</h3>
              <p className="text-[var(--muted)] mb-6 max-w-md mx-auto">
                Browse our digital products to find courses, templates, and tools
                to accelerate your AI implementation.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--accent)] text-white font-medium rounded-[3px] hover:bg-[var(--accent-hover)] transition-colors"
              >
                Browse Products
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </section>

          {/* Account Settings */}
          <section>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
              <span className="w-8 h-[2px] bg-[var(--accent)]" />
              Account
            </h2>

            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[5px] p-6">
              <p className="text-sm text-[var(--muted)] mb-4">
                Account management will be available once authentication is fully configured.
              </p>
              <div className="flex gap-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium bg-[var(--surface-elevated)] border border-[var(--border)] rounded-[3px] text-[var(--foreground)] hover:border-[var(--accent)] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium bg-[var(--accent)] text-white rounded-[3px] hover:bg-[var(--accent-hover)] transition-colors"
                >
                  Create Account
                </Link>
              </div>
            </div>
          </section>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
