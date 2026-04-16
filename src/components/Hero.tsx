import { Container } from "@/components/ui";
import { EmailForm } from "@/components/email";

interface HeroProps {
  headline?: string;
  subheadline?: string;
  showEmailForm?: boolean;
}

export function Hero({
  headline = "Insights from the depths",
  subheadline = "Join fellow professionals for weekly thoughts on development, trading, and building in the digital age. No fluff, just signal.",
  showEmailForm = true,
}: HeroProps) {
  return (
    <section className="py-24 sm:py-32 lg:py-40 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--accent-glow)] to-transparent opacity-50" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <Container size="md" className="relative">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--surface)] border border-[var(--border)] mb-8">
            <svg
              className="w-4 h-4 text-[var(--accent)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <span className="text-sm font-medium text-[var(--muted)]">Nicholaus.ai</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6">
            <span className="text-[var(--foreground)]">{headline.split(' ').slice(0, -2).join(' ')}</span>
            {' '}
            <span className="text-[var(--accent)]">{headline.split(' ').slice(-2).join(' ')}</span>
          </h1>

          <p className="text-lg sm:text-xl text-[var(--muted)] mb-12 max-w-2xl mx-auto leading-relaxed">
            {subheadline}
          </p>

          {showEmailForm && (
            <div id="subscribe" className="max-w-md mx-auto">
              <EmailForm
                variant="inline"
                buttonText="Subscribe Now"
                placeholder="you@example.com"
              />
              <p className="text-sm text-[var(--muted)] mt-4">
                No spam. Unsubscribe anytime.
              </p>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
