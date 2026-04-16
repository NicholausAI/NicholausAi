import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Header, Footer } from "@/components/layout";
import { Container } from "@/components/ui";
import { convex } from "@/lib/convex";
import { api } from "../../../convex/_generated/api";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Products",
  description:
    "AI tools, courses, audits, templates, and ebooks to help you build smarter systems and grow faster.",
};

const TYPE_LABELS: Record<string, string> = {
  course: "Course",
  audit: "Audit",
  template: "Template",
  ebook: "Ebook",
  consultation: "Consultation",
};

function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(price / 100);
}

export default async function ProductsPage() {
  const products = await convex.query(api.products.list, { published: true });

  const types = [...new Set(products.map((p) => p.type))];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-20">
        <Container size="lg">
          {/* Hero */}
          <div className="mb-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--surface)] border border-[var(--border)] mb-6">
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
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <span className="text-sm font-medium text-[var(--muted)]">
                Products
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Digital <span className="text-[var(--accent)]">Products</span>
            </h1>
            <p className="text-lg text-[var(--muted)] max-w-2xl mx-auto">
              AI tools, courses, and resources built from real-world experience.
              Everything you need to build smarter systems and grow faster.
            </p>
          </div>

          {/* Type filters */}
          {types.length > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
              {types.map((type) => (
                <span
                  key={type}
                  className="px-4 py-1.5 text-sm font-medium rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--muted)]"
                >
                  {TYPE_LABELS[type] || type}
                </span>
              ))}
            </div>
          )}

          {/* Product grid */}
          {products.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-7 h-7 text-[var(--muted)]"
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
              <h2 className="text-xl font-bold mb-2">No products yet</h2>
              <p className="text-[var(--muted)]">
                New products are on the way. Check back soon.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Link
                  key={product._id}
                  href={`/products/${product.slug}`}
                  className="group bg-[var(--surface)] border border-[var(--border)] rounded-[5px] overflow-hidden hover:border-[var(--accent)]/30 hover:shadow-lg hover:shadow-black/[0.03] transition-all duration-300"
                >
                  {/* Cover image */}
                  <div className="aspect-[16/9] bg-[var(--background)] border-b border-[var(--border)] flex items-center justify-center overflow-hidden">
                    {product.coverImageUrl ? (
                      <Image
                        src={product.coverImageUrl}
                        alt={product.name}
                        width={640}
                        height={360}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                      />
                    ) : (
                      <span className="text-4xl font-bold text-[var(--accent)] opacity-30">
                        {product.name.charAt(0)}
                      </span>
                    )}
                  </div>

                  {/* Card body */}
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
                        {TYPE_LABELS[product.type] || product.type}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold mb-2 group-hover:text-[var(--accent)] transition-colors">
                      {product.name}
                    </h3>

                    {product.description && (
                      <p className="text-sm text-[var(--muted)] leading-relaxed mb-4 line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                      <span className="text-lg font-bold">
                        {formatPrice(product.price, product.currency)}
                      </span>
                      <span className="text-sm font-medium text-[var(--accent)] flex items-center gap-1 group-hover:gap-2 transition-all">
                        Learn More
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
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </main>

      <Footer />
    </div>
  );
}
