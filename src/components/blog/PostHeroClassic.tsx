"use client";

import { Container } from "@/components/ui";
import { EmailForm } from "@/components/email";
import { ArrowDown } from "lucide-react";

interface PostHeroProps {
  title: string;
  publishedAt: string;
  showEmailForm?: boolean;
  author?: {
    name?: string;
    bio?: string;
    avatarUrl?: string;
    twitterHandle?: string;
  };
}

export function PostHeroClassic({
  title,
  publishedAt,
  showEmailForm = true,
  author,
}: PostHeroProps) {
  const formattedDate = new Date(publishedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const authorName = author?.name || "Nicholaus.ai";
  const twitterHandle = author?.twitterHandle || "nicholausai";

  return (
    <section className="pt-8 pb-0">
      <Container size="xl">
        <div className="max-w-3xl mx-auto text-center">
          {/* Date pill */}
          <div className="mb-5">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[var(--accent-glow)] text-[12px] font-semibold text-[var(--accent)] uppercase tracking-wider">
              {formattedDate}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-[clamp(2.25rem,5vw,3.5rem)] font-bold leading-[1.08] tracking-tight text-[var(--foreground)] mb-6">
            {title}
          </h1>

          {/* Author + socials row */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex items-center gap-2.5">
              {author?.avatarUrl ? (
                <img src={author.avatarUrl} alt={authorName} className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center">
                  <span className="text-xs font-bold text-force-white">{authorName.charAt(0)}</span>
                </div>
              )}
              <span className="text-[14px] font-medium text-[var(--foreground)]">{authorName}</span>
            </div>
            <span className="w-px h-4 bg-[var(--border)]" />
            <div className="flex items-center gap-1.5">
              {[
                { href: `https://twitter.com/${twitterHandle}`, icon: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
                { href: "https://linkedin.com", icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
                { href: "https://facebook.com", icon: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
              ].map((s) => (
                <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center px-3 py-2 rounded-md border border-[var(--border)] text-[var(--foreground)] hover:border-[var(--foreground)] transition-colors">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d={s.icon} /></svg>
                </a>
              ))}
            </div>
          </div>

          {/* Lead gen card */}
          {showEmailForm && (
            <div className="relative p-6 rounded-[5px] bg-[var(--bg-secondary)]/50 border border-[var(--border)] text-center mb-4">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[var(--accent)] text-force-white text-[11px] font-bold uppercase tracking-wider">
                Free
              </div>
              <p className="text-[17px] font-bold text-[var(--foreground)] mb-1 mt-1">Get insights like this every week</p>
              <p className="text-[14px] text-[var(--muted)] mb-4">Join contractors who are automating smarter — delivered every Thursday.</p>
              <div className="max-w-[400px] mx-auto">
                <EmailForm
                  variant="inline"
                  buttonText="Subscribe"
                  placeholder="you@email.com"
                />
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
