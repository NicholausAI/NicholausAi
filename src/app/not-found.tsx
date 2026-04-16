import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { Container, Button } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center py-20 relative">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--accent-glow)] to-transparent opacity-30" />

        <Container size="sm" className="relative">
          <div className="text-center">
            <div className="w-20 h-20 rounded-2xl bg-[var(--accent-glow)] border border-[var(--accent)]/20 flex items-center justify-center mx-auto mb-8">
              <svg
                className="w-10 h-10 text-[var(--accent)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-5xl font-bold mb-4">
              Page <span className="text-[var(--accent)]">not found</span>
            </h1>
            <p className="text-[var(--muted)] text-lg mb-10 max-w-md mx-auto">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
            <Link href="/">
              <Button size="lg">
                Back to Home
              </Button>
            </Link>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
