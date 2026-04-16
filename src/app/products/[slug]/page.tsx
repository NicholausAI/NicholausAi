import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Header, Footer } from "@/components/layout";
import { Container } from "@/components/ui";
import { convex } from "@/lib/convex";
import { api } from "../../../../convex/_generated/api";

export const dynamic = "force-dynamic";

const TYPE_LABELS: Record<string, string> = {
  course: "Course",
  audit: "Audit",
  template: "Template",
  ebook: "Ebook",
  consultation: "Consultation",
};

const WHATS_INCLUDED: Record<string, string[]> = {
  course: [
    "Full video curriculum",
    "Downloadable resources",
    "Lifetime access",
    "Future updates included",
    "Community access",
  ],
  audit: [
    "Comprehensive analysis report",
    "Actionable recommendations",
    "Priority areas identified",
    "Implementation roadmap",
    "30-minute follow-up call",
  ],
  template: [
    "Ready-to-use template files",
    "Documentation & setup guide",
    "Customization instructions",
    "Free updates",
    "Email support",
  ],
  ebook: [
    "Full digital book (PDF)",
    "Bonus worksheets",
    "Resource links & references",
    "Future edition updates",
  ],
  consultation: [
    "Live 1-on-1 session",
    "Screen sharing & review",
    "Recorded session replay",
    "Written summary & action items",
    "Email follow-up support",
  ],
};

function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(price / 100);
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await convex.query(api.products.getBySlug, { slug });

  if (!product || !product.published) {
    return { title: "Product Not Found" };
  }

  return {
    title: product.name,
    description:
      product.description ||
      `${product.name} — a ${TYPE_LABELS[product.type]?.toLowerCase() || product.type} by Nicholaus.ai.`,
    openGraph: {
      title: product.name,
      description: product.description || undefined,
      images: product.coverImageUrl ? [product.coverImageUrl] : undefined,
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await convex.query(api.products.getBySlug, { slug });

  if (!product || !product.published) {
    notFound();
  }

  const included = WHATS_INCLUDED[product.type] || WHATS_INCLUDED.template;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-20">
        <Container size="lg">
          {/* Breadcrumb */}
          <nav className="mb-10 flex items-center gap-2 text-sm text-[var(--muted)]">
            <Link
              href="/products"
              className="hover:text-[var(--foreground)] transition-colors"
            >
              Products
            </Link>
            <span>/</span>
            <span className="text-[var(--foreground)]">{product.name}</span>
          </nav>

          <div className="lg:grid lg:grid-cols-[1fr_380px] lg:gap-12">
            {/* Main content */}
            <div>
              {/* Hero */}
              <div className="mb-10">
                <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[var(--accent)] mb-4">
                  {TYPE_LABELS[product.type] || product.type}
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                  {product.name}
                </h1>
                {product.description && (
                  <p className="text-lg text-[var(--muted)] leading-relaxed max-w-2xl">
                    {product.description}
                  </p>
                )}
                {/* Mobile price */}
                <div className="mt-6 lg:hidden flex items-center gap-4">
                  <span className="text-2xl font-bold">
                    {formatPrice(product.price, product.currency)}
                  </span>
                  <Link
                    href={`/checkout/${product.slug}`}
                    className="px-6 py-3 rounded-[3px] bg-[var(--accent)] text-[var(--background)] font-bold text-sm hover:opacity-90 transition-opacity"
                  >
                    Buy Now
                  </Link>
                </div>
              </div>

              {/* Cover image */}
              {product.coverImageUrl && (
                <div className="mb-12 rounded-[5px] overflow-hidden border border-[var(--border)]">
                  <Image
                    src={product.coverImageUrl}
                    alt={product.name}
                    width={960}
                    height={540}
                    className="w-full h-auto"
                    priority
                  />
                </div>
              )}

              {/* Content / details */}
              {product.content && (
                <section className="mb-12">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <svg
                      className="w-5 h-5 text-[var(--accent)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Details
                  </h2>
                  <div className="prose prose-invert max-w-none text-[var(--muted)] leading-relaxed whitespace-pre-line">
                    {typeof product.content === "string"
                      ? product.content
                      : JSON.stringify(product.content, null, 2)}
                  </div>
                </section>
              )}

              {/* Curriculum placeholder for courses */}
              {product.type === "course" && (
                <section className="mb-12">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <svg
                      className="w-5 h-5 text-[var(--accent)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                    Curriculum
                  </h2>
                  <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[5px] p-8 text-center">
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
                          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <p className="text-[var(--muted)] font-medium">
                      Full curriculum available after purchase.
                    </p>
                    <p className="text-sm text-[var(--muted)] opacity-70 mt-1">
                      Video lessons, exercises, and downloadable resources.
                    </p>
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar pricing card */}
            <div className="hidden lg:block">
              <div className="sticky top-28">
                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[5px] p-8">
                  {/* Price */}
                  <div className="mb-6">
                    <span className="text-3xl font-bold">
                      {formatPrice(product.price, product.currency)}
                    </span>
                    {product.type === "consultation" && (
                      <span className="text-sm text-[var(--muted)] ml-2">
                        per session
                      </span>
                    )}
                  </div>

                  {/* Buy button */}
                  <Link
                    href={`/checkout/${product.slug}`}
                    className="block w-full text-center px-6 py-3.5 rounded-[3px] bg-[var(--accent)] text-[var(--background)] font-bold text-[15px] hover:opacity-90 transition-opacity mb-6"
                  >
                    Buy Now
                  </Link>

                  {/* What's included */}
                  <div className="border-t border-[var(--border)] pt-6">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)] mb-4">
                      What&apos;s Included
                    </h3>
                    <ul className="space-y-3">
                      {included.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-3 text-sm"
                        >
                          <svg
                            className="w-4 h-4 text-[var(--accent)] mt-0.5 shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="text-[var(--muted)]">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Guarantee */}
                  <div className="mt-6 pt-6 border-t border-[var(--border)] text-center">
                    <div className="flex items-center justify-center gap-2 text-xs text-[var(--muted)]">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                      Secure checkout
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
