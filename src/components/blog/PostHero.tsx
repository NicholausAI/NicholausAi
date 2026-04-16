"use client";

import { useState, useRef, type FormEvent } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Container } from "@/components/ui";
import { Mail, CheckCircle, ArrowRight } from "lucide-react";

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

const socials = [
  { href: "https://twitter.com/nicholausai", icon: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
  { href: "https://linkedin.com", icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
  { href: "https://facebook.com", icon: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
];

function HeroOptin() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {}
    setStatus("success");
    setEmail("");
  };

  if (status === "success")
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center justify-center gap-2 py-3"
      >
        <CheckCircle className="w-5 h-5 text-[var(--accent)]" />
        <span className="text-[15px] font-semibold">You&apos;re in. Check your inbox.</span>
      </motion.div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="max-w-[400px] mx-auto"
    >
      <form onSubmit={submit}>
        <div className="relative flex items-center rounded-[4px] bg-[var(--background)] border border-[var(--border)] shadow-sm hover:border-[var(--accent)]/40 transition-colors pl-4 pr-1.5 py-1.5">
          <Mail className="w-4 h-4 text-[var(--text-tertiary)] shrink-0 mr-2" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Get weekly posts — enter your email"
            className="flex-1 min-w-0 text-[13px] bg-transparent text-[var(--foreground)] placeholder:text-[var(--text-tertiary)] focus:outline-none"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-[3px] bg-[var(--accent)] text-force-white font-bold text-[12px] hover:bg-[var(--accent-hover)] transition-all disabled:opacity-60"
          >
            {status === "loading" ? "..." : (
              <>Subscribe <ArrowRight className="w-3 h-3" /></>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

export function PostHero({
  title,
  publishedAt,
  showEmailForm = true,
  author,
}: PostHeroProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const formattedDate = new Date(publishedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const authorName = author?.name || "Nicholaus";
  const twitterHandle = author?.twitterHandle || "nicholausai";

  return (
    <section
      ref={ref}
      className="relative pt-10 sm:pt-14 pb-16 sm:pb-24 overflow-hidden bg-blueprint"
    >
      {/* Chart bg */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg
          className="absolute bottom-0 left-0 w-full"
          viewBox="0 0 1440 400"
          preserveAspectRatio="none"
          style={{ height: "50%" }}
        >
          <motion.path
            d="M0,400 L0,350 C180,340 360,300 540,250 C720,200 900,170 1080,120 C1260,70 1350,45 1440,30 L1440,400 Z"
            fill="url(#postHeroGrad)"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
          />
          <motion.path
            d="M0,350 C180,340 360,300 540,250 C720,200 900,170 1080,120 C1260,70 1350,45 1440,30"
            fill="none"
            stroke="#FDD835"
            strokeWidth="3"
            strokeOpacity="0.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.5, delay: 0.3, ease: "easeOut" }}
          />
          <motion.path
            d="M0,350 C180,340 360,300 540,250 C720,200 900,170 1080,120 C1260,70 1350,45 1440,30"
            fill="none"
            stroke="#FDD835"
            strokeWidth="8"
            strokeOpacity="0.15"
            style={{ filter: "blur(4px)" }}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.5, delay: 0.3, ease: "easeOut" }}
          />
          <motion.circle
            r="5"
            fill="#FDD835"
            initial={{ offsetDistance: "0%" }}
            animate={{ offsetDistance: "100%" }}
            transition={{
              duration: 10,
              delay: 1,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "loop",
            }}
            style={{
              offsetPath:
                "path('M0,350 C180,340 360,300 540,250 C720,200 900,170 1080,120 C1260,70 1350,45 1440,30')",
            }}
          />
          <defs>
            <linearGradient id="postHeroGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FDD835" stopOpacity="0.15" />
              <stop offset="50%" stopColor="#FDD835" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#FDD835" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <motion.div
        style={{ y, opacity }}
        className="relative z-10"
      >
        <Container size="xl">
          <div className="max-w-3xl mx-auto text-center">
            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-[clamp(2.25rem,5vw,3.5rem)] font-bold leading-[1.08] tracking-tight text-[var(--foreground)] mb-5"
            >
              {title}
            </motion.h1>

            {/* Author · Date row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center justify-center gap-3 mb-8"
            >
              <div className="flex items-center gap-2">
                {author?.avatarUrl ? (
                  <img src={author.avatarUrl} alt={authorName} className="w-7 h-7 rounded-full object-cover" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[var(--accent)] flex items-center justify-center">
                    <span className="text-[10px] font-bold text-force-white">{authorName.charAt(0)}</span>
                  </div>
                )}
                <span className="text-[13px] font-medium text-[var(--foreground)]">{authorName}</span>
              </div>
              <span className="w-px h-4 bg-[var(--border)]" />
              <div className="flex items-center gap-1.5">
                {socials.map((s) => (
                  <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center px-3 py-2 rounded-[3px] border border-[var(--border)] text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d={s.icon} /></svg>
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Email optin */}
            {showEmailForm && <HeroOptin />}
          </div>
        </Container>
      </motion.div>
    </section>
  );
}
