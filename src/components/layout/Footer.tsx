"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Code2, Globe } from "lucide-react";

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const navigateLinks = [
  { label: "Blog", href: "/blog" },
  { label: "Resources", href: "/resources" },
  { label: "Contact", href: "/#contact" },
];

const socialLinks = [
  { label: "Twitter", href: "https://twitter.com", icon: XIcon },
  { label: "LinkedIn", href: "https://linkedin.com", icon: Globe },
  { label: "GitHub", href: "https://github.com", icon: Code2 },
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.5 },
};

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <footer className="border-t border-[var(--border)] mt-auto bg-[var(--bg-secondary)]">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
        <div className="py-14 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
            {/* Brand */}
            <motion.div {...fadeInUp} className="lg:col-span-4">
              <Link href="/" className="group mb-4 inline-block">
                <div className="w-16 h-9 rounded-[3px] bg-[var(--accent)] flex items-center justify-center group-hover:bg-[var(--accent-hover)] transition-colors">
                  <span className="text-force-white text-[22px]" style={{ fontFamily: "var(--font-league-spartan)", fontWeight: 900, letterSpacing: "-0.08em", marginTop: "-1px" }}>U.</span>
                </div>
              </Link>
              <p className="text-sm text-[var(--muted)] leading-relaxed mb-5 max-w-xs">
                AI-powered marketing and operations automation for contractors.
              </p>
              <div className="flex items-center gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-md border border-[var(--border)] flex items-center justify-center text-[var(--text-tertiary)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all"
                    aria-label={social.label}
                  >
                    <social.icon className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Navigate */}
            <motion.div {...fadeInUp} transition={{ duration: 0.5, delay: 0.1 }} className="lg:col-span-3">
              <h4 className="text-[12px] font-semibold text-[var(--foreground)] uppercase tracking-wider mb-3">
                Navigate
              </h4>
              <ul className="space-y-2">
                {navigateLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Newsletter */}
            <motion.div {...fadeInUp} transition={{ duration: 0.5, delay: 0.2 }} className="lg:col-span-5">
              <h4 className="text-[12px] font-semibold text-[var(--foreground)] uppercase tracking-wider mb-3">
                Stay in the loop
              </h4>
              <p className="text-sm text-[var(--muted)] mb-3">
                Insights on AI, automation, and growth.
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 min-w-0 px-3 py-2 text-sm bg-[var(--surface-elevated)] border border-[var(--border)] rounded-md text-[var(--foreground)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold rounded-md bg-[var(--accent)] text-force-white hover:bg-[var(--accent-hover)] transition-all flex items-center gap-1.5 shrink-0"
                >
                  Subscribe
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
              {subscribed && (
                <motion.p
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-[var(--accent)] mt-2"
                >
                  Thanks for subscribing!
                </motion.p>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-[var(--border)]">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
          <div className="py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--text-tertiary)]">
            <p>&copy; {currentYear} Nicholaus, LLC. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="hover:text-[var(--accent)] transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-[var(--accent)] transition-colors">Terms of Service</Link>
              <Link href="/refund" className="hover:text-[var(--accent)] transition-colors">Refund Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
