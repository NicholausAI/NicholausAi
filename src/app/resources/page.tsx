import { Metadata } from "next";
import { Header, Footer } from "@/components/layout";
import { Container } from "@/components/ui";
import { EmailForm } from "@/components/email";
import { CategoryNav } from "@/components/resources";
import { convex } from "@/lib/convex";
import { api } from "../../../convex/_generated/api";

export const metadata: Metadata = {
  title: "Resources",
  description: "Tools, software, and resources I use and recommend for coding, trading, and building.",
};

export const dynamic = "force-dynamic";

interface Resource {
  id: string;
  name: string;
  description: string;
  category: string;
  url: string;
  featured?: boolean;
  affiliateLink?: boolean;
}

async function getResources(): Promise<Resource[]> {
  const resources = await convex.query(api.resources.list, {});
  return resources.map((r) => ({
    id: r._id,
    name: r.name,
    description: r.description,
    url: r.url,
    category: r.category,
    featured: r.featured,
    affiliateLink: r.affiliateLink,
  }));
}

export default async function ResourcesPage() {
  const resources = await getResources();
  const categories = [...new Set(resources.map((r) => r.category))];

  // Count resources per category
  const resourceCounts = categories.reduce((acc, category) => {
    acc[category] = resources.filter((r) => r.category === category).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero */}
      <section className="relative pt-12 sm:pt-20 pb-16 sm:pb-24 overflow-hidden bg-blueprint">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 400" preserveAspectRatio="none" style={{ height: "45%" }}>
            <path d="M0,400 L0,340 C200,330 400,290 600,250 C800,210 1000,185 1200,150 C1320,125 1380,110 1440,95 L1440,400 Z" fill="url(#resGlow)" />
            <path d="M0,340 C200,330 400,290 600,250 C800,210 1000,185 1200,150 C1320,125 1380,110 1440,95" fill="none" stroke="#FDD835" strokeWidth="2" strokeOpacity="0.2" />
            <defs>
              <linearGradient id="resGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FDD835" stopOpacity="0.06" />
                <stop offset="100%" stopColor="#FDD835" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="relative z-10 max-w-[1200px] mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left — Copy + optin */}
            <div>
              <p className="text-[13px] font-semibold text-[var(--muted)] mb-4 tracking-wide uppercase">Resources</p>
              <h1 className="text-[clamp(2rem,4.5vw,3rem)] font-extrabold leading-[1.12] tracking-tight mb-4">
                The exact tools used to build every system.
              </h1>
              <p className="text-[15px] text-[var(--muted)] leading-[1.65] mb-6 max-w-[440px]">
                Get weekly how-tos, video walkthroughs, and tool breakdowns — learn the exact stack used to automate leads, ops, and growth.
              </p>
              <div className="max-w-[440px] mb-3">
                <EmailForm
                  variant="inline"
                  buttonText="Get the guides →"
                  placeholder="Enter your email"
                  redirectTo="/offer"
                />
              </div>
              <p className="text-[12px] text-[var(--muted)]">Free weekly. Unsubscribe anytime.</p>
            </div>

            {/* Right — Tool stack preview */}
            <div className="hidden lg:block">
              <div className="rounded-[3px] bg-white border border-[var(--border)] shadow-xl shadow-black/[0.04] p-5">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--border)]">
                  <p className="text-[13px] font-bold">Tool Stack</p>
                  <p className="text-[11px] text-[var(--muted)]">{resources.length} tools</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {resources.slice(0, 6).map((r) => (
                    <div key={r.id} className="flex items-center gap-2.5 p-2.5 rounded-[3px] bg-[var(--surface)] border border-[var(--border)]">
                      <div className="w-7 h-7 rounded-[3px] bg-white border border-[var(--border)] flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-extrabold text-[var(--foreground)]">{r.name.charAt(0)}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[12px] font-semibold truncate">{r.name}</p>
                        <p className="text-[10px] text-[var(--muted)] truncate">{r.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {resources.length > 6 && (
                  <p className="text-[11px] text-[var(--muted)] text-center mt-3">
                    +{resources.length - 6} more below ↓
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="flex-1 py-16">
        <Container size="lg">

          {/* Featured Resources */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <svg
                className="w-5 h-5 text-[var(--foreground)]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Featured
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources
                .filter((r) => r.featured)
                .map((resource) => (
                  <a
                    key={resource.name}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group p-6 bg-[var(--background)] border border-[var(--border)] rounded-[5px] hover:border-[var(--accent)]/30 hover:shadow-lg hover:shadow-black/[0.03] transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-[5px] bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center shrink-0">
                        <span className="text-[var(--foreground)] font-bold text-sm">
                          {resource.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-lg group-hover:text-[var(--accent)] transition-colors">
                            {resource.name}
                          </h3>
                          {resource.affiliateLink && (
                            <span className="text-xs text-[var(--muted)]">Affiliate</span>
                          )}
                          <svg
                            className="w-4 h-4 text-[var(--muted)] group-hover:text-[var(--accent)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </div>
                        <p className="text-sm text-[var(--muted)] leading-relaxed">
                          {resource.description}
                        </p>
                        <span className="inline-block mt-3 text-xs text-[var(--muted)] font-medium">
                          {resource.category}
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
            </div>
          </section>

          {/* Email Capture CTA */}
          <section className="mb-16 py-12 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 bg-[var(--surface)] border-y border-[var(--border)]">
            <div className="text-center max-w-xl mx-auto">
              <div className="w-12 h-12 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-[var(--foreground)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">Get weekly tool recommendations</h3>
              <p className="text-[var(--muted)] mb-6">
                I review and test new tools every week. Subscribe to get my honest takes delivered to your inbox.
              </p>
              <div className="max-w-md mx-auto">
                <EmailForm
                  variant="inline"
                  buttonText="Subscribe"
                  placeholder="Enter your email"
                />
              </div>
            </div>
          </section>

          {/* Category Navigation */}
          <CategoryNav categories={categories} resourceCounts={resourceCounts} />

          {/* All Resources by Category */}
          {categories.map((category) => (
            <section
              key={category}
              id={category.toLowerCase().replace(/\s+/g, "-")}
              className="mb-12 scroll-mt-32"
            >
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                <span className="w-8 h-[2px] bg-[var(--accent)]" />
                {category}
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {resources
                  .filter((r) => r.category === category)
                  .map((resource) => (
                    <a
                      key={resource.name}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 p-4 bg-[var(--background)] border border-[var(--border)] rounded-[5px] hover:border-[var(--accent)]/30 hover:shadow-lg hover:shadow-black/[0.03] transition-all duration-300"
                    >
                      <div className="w-10 h-10 rounded-[5px] bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center shrink-0 group-hover:border-[var(--accent)]/30 transition-colors">
                        <span className="text-[var(--muted)] font-bold text-sm group-hover:text-[var(--accent)] transition-colors">
                          {resource.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold group-hover:text-[var(--accent)] transition-colors">
                            {resource.name}
                          </h3>
                          {resource.affiliateLink && (
                            <span className="text-xs text-[var(--muted)]">Affiliate</span>
                          )}
                        </div>
                        <p className="text-sm text-[var(--muted)]">
                          {resource.description}
                        </p>
                      </div>
                      <svg
                        className="w-5 h-5 text-[var(--muted)] group-hover:text-[var(--accent)] shrink-0"
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
                    </a>
                  ))}
              </div>
            </section>
          ))}

          {/* Bottom Email CTA */}
          <section className="mt-16 mb-8 p-8 bg-[var(--surface)] border border-[var(--border)] rounded-2xl text-center">
            <h3 className="text-xl font-bold mb-2">Never miss a new tool review</h3>
            <p className="text-[var(--muted)] mb-6 max-w-md mx-auto">
              Join 1,247+ professionals getting weekly insights on the best tools for development, trading, and productivity.
            </p>
            <div className="max-w-sm mx-auto">
              <EmailForm
                variant="inline"
                buttonText="Join Free"
                placeholder="you@email.com"
              />
            </div>
          </section>

          {/* Disclaimer */}
          <div className="p-6 bg-[var(--surface)] border border-[var(--border)] rounded-[5px] text-center">
            <p className="text-sm text-[var(--muted)]">
              <strong className="text-[var(--foreground)]">Affiliate Disclosure:</strong> Some links on this page are affiliate links. I may earn a commission if you make a purchase through these links, at no extra cost to you. I only recommend products I personally use and believe in.
            </p>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
