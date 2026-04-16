"use client";

import { useState, useRef, type FormEvent } from "react";
import { useParams } from "next/navigation";
import { Header, Footer } from "@/components/layout";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  ChevronDown,
  Zap,
  Play,
  Shield,
  Star,
  ArrowDown,
} from "lucide-react";

/* ─────────────────────────────────────────────
   SERVICE DATA
   ───────────────────────────────────────────── */

interface ServiceData {
  title: string;
  headline: string;
  subheadline: string;
  heroStats: { value: string; label: string }[];
  problem: { title: string; points: string[] };
  solution: { title: string; description: string; points: { title: string; desc: string }[] };
  howItWorks: { step: string; desc: string }[];
  results: { metric: string; label: string; detail: string }[];
  testimonial: { quote: string; name: string; role: string };
  includes: string[];
  faqs: { q: string; a: string }[];
}

const services: Record<string, ServiceData> = {
  "ai-chatbot": {
    title: "AI Chatbot & Lead Capture",
    headline: "Stop losing leads while you sleep.",
    subheadline:
      "An AI-powered chatbot that engages every website visitor, qualifies them in real time, and books jobs on your calendar — 24 hours a day, 7 days a week.",
    heroStats: [
      { value: "3x", label: "More leads from same traffic" },
      { value: "24/7", label: "Always-on lead capture" },
      { value: "<5s", label: "Response time" },
    ],
    problem: {
      title: "Right now, your website is a brochure. Visitors land. They look around. They leave.",
      points: [
        "97% of website visitors leave without ever contacting you",
        "After-hours visitors have zero way to engage — and they're going to your competitor instead",
        "You're paying for ad traffic that bounces because nobody's there to respond",
        "Contact forms sit untouched — nobody wants to fill out a form and wait 24 hours",
      ],
    },
    solution: {
      title: "What if every single visitor was greeted, qualified, and captured — automatically?",
      description:
        "Your AI chatbot is trained on your business — your services, your area, your pricing, your availability. It starts a natural conversation, asks the right questions, and captures their info before they bounce.",
      points: [
        {
          title: "Instant engagement",
          desc: "The moment someone lands on your site, the bot starts a conversation. No waiting, no friction.",
        },
        {
          title: "Smart qualification",
          desc: "It asks what service they need, where they're located, and their timeline — then routes hot leads to your phone.",
        },
        {
          title: "Auto-booking",
          desc: "Connects to your calendar and lets visitors pick a time slot. Jobs get booked while you're on the job site.",
        },
        {
          title: "Learns and improves",
          desc: "Conversations are reviewed monthly. The bot gets smarter. Your conversion rate goes up.",
        },
      ],
    },
    howItWorks: [
      {
        step: "Audit & strategy",
        desc: "Your current site, traffic, and lead flow get reviewed. A custom chatbot strategy is built around your business.",
      },
      {
        step: "Build & train",
        desc: "The AI gets loaded with your services, FAQs, pricing, and brand voice. It's customized to sound like you — not a robot.",
      },
      {
        step: "Launch & optimize",
        desc: "The widget goes live on your site in minutes. Leads start flowing immediately. Monthly optimization keeps improving results.",
      },
    ],
    results: [
      { metric: "312%", label: "Increase in leads", detail: "Average across first 90 days" },
      { metric: "47", label: "Leads per month", detail: "From a site that was getting 11" },
      { metric: "$23", label: "Cost per lead", detail: "Down from $84 on forms alone" },
      { metric: "< 5 sec", label: "Response time", detail: "vs. 4+ hours for most contractors" },
    ],
    testimonial: {
      quote: "We went from maybe 10 leads a month to over 40. The chatbot does the work of a full-time receptionist — except it never takes a day off.",
      name: "Mike R.",
      role: "Plumbing Contractor, Austin TX",
    },
    includes: [
      "Custom AI chatbot trained on your business",
      "24/7 lead capture and qualification",
      "Auto-booking integration with your calendar",
      "Lead delivery to your CRM, email, or phone",
      "Monthly conversation review and optimization",
      "Real-time notifications for hot leads",
      "Analytics dashboard — see exactly what's working",
      "Unlimited conversations — no per-message fees",
    ],
    faqs: [
      {
        q: "Will it sound robotic?",
        a: "No. It's trained specifically on your business and speaks in natural language. Most visitors don't realize they're talking to AI.",
      },
      {
        q: "What happens when it can't answer something?",
        a: "It gracefully captures the visitor's contact info and flags the conversation for your team to follow up personally.",
      },
      {
        q: "How long does setup take?",
        a: "Most chatbots are live within 5-7 business days. The widget installs in under 10 minutes on any website.",
      },
      {
        q: "Do I need to change my website?",
        a: "No. One line of code gets added — works with WordPress, Wix, Squarespace, custom sites, anything.",
      },
      {
        q: "What does it cost?",
        a: "Pricing depends on your volume and customization. Start with a free audit — you'll get a clear recommendation with no obligation.",
      },
      {
        q: "Is there a contract?",
        a: "No long-term contracts. Month-to-month. The results keep you — not a contract.",
      },
    ],
  },
};

/* ─────────────────────────────────────────────
   PAGE
   ───────────────────────────────────────────── */

export default function ServicePage() {
  const params = useParams();
  const slug = params.slug as string;
  const data = services[slug];

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-32">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Coming Soon</h1>
            <p className="text-[var(--muted)] mb-6">This service page is being built.</p>
            <a href="/#contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--accent)] text-force-white font-semibold hover:bg-[var(--accent-hover)] transition-all">
              Get in touch <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <HeroSection data={data} />
        <SocialProofBar />
        <ProblemSection data={data} />
        <VideoSection data={data} />
        <SolutionSection data={data} />
        <MidPageCTA />
        <HowItWorksSection data={data} />
        <ResultsSection data={data} />
        <IncludesSection data={data} />
        <FAQSection data={data} />
        <FinalCTASection data={data} />
      </main>

      <Footer />
    </div>
  );
}

/* ─────────────────────────────────────────────
   HERO — Full width, big and bold
   ───────────────────────────────────────────── */

function HeroSection({ data }: { data: ServiceData }) {
  return (
    <section className="relative py-12 sm:py-16 overflow-hidden bg-blueprint">
      <div className="relative z-10 w-full max-w-[1100px] mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-[1fr_1fr] gap-12 lg:gap-16 items-center">
          {/* Left — Copy */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--accent-glow)] border border-[var(--accent)]/15 mb-6"
            >
              <Zap className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span className="text-[13px] font-medium text-[var(--accent)]">{data.title}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.1] tracking-tight"
            >
              {data.headline}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 text-[var(--muted)] text-lg max-w-[500px] leading-relaxed"
            >
              {data.subheadline}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row gap-3 mt-8"
            >
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[var(--accent)] text-force-white font-semibold hover:bg-[var(--accent-hover)] transition-all hover:-translate-y-0.5"
              >
                Get a free audit
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#solution"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-[var(--border)] text-[var(--foreground)] font-semibold hover:border-[var(--foreground)] transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                Watch how it works
              </a>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.75 }}
              className="flex items-center gap-3 mt-8"
            >
              <div className="flex -space-x-2">
                {["M", "C", "S", "J"].map((letter, i) => (
                  <div
                    key={letter}
                    className="w-8 h-8 rounded-full bg-[var(--surface)] border-2 border-[var(--background)] flex items-center justify-center text-xs font-bold text-[var(--muted)]"
                    style={{ zIndex: 4 - i }}
                  >
                    {letter}
                  </div>
                ))}
              </div>
              <p className="text-sm text-[var(--muted)]">
                Trusted by <span className="font-semibold text-[var(--foreground)]">50+</span> contractors
              </p>
            </motion.div>
          </div>

          {/* Right — Stats card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="rounded-2xl p-8 sm:p-10 bg-[var(--surface)] border border-[var(--border)]"
          >
            <p className="text-[13px] font-bold text-[var(--accent)] uppercase tracking-wider mb-6">Average results</p>
            <div className="space-y-6">
              {data.heroStats.map((s, i) => (
                <div key={s.label} className={`pb-6 ${i < data.heroStats.length - 1 ? "border-b border-[var(--border)]" : ""}`}>
                  <p className="text-4xl sm:text-5xl font-bold text-[var(--accent)]">{s.value}</p>
                  <p className="text-[15px] text-[var(--muted)] mt-1">{s.label}</p>
                </div>
              ))}
            </div>
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 w-full mt-6 px-6 py-3.5 rounded-lg bg-[var(--accent)] text-force-white font-bold text-[16px] hover:bg-[var(--accent-hover)] transition-all hover:-translate-y-0.5"
            >
              Get these results
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SOCIAL PROOF BAR — Trust strip
   ───────────────────────────────────────────── */

function SocialProofBar() {
  return (
    <section className="border-b border-[var(--border)] py-6">
      <div className="max-w-[1100px] mx-auto px-5 sm:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {["M", "C", "S", "J", "R"].map((letter, i) => (
                <div
                  key={letter}
                  className="w-9 h-9 rounded-full bg-[var(--surface)] border-2 border-[var(--background)] flex items-center justify-center text-xs font-bold text-[var(--muted)]"
                  style={{ zIndex: 5 - i }}
                >
                  {letter}
                </div>
              ))}
            </div>
            <div>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[var(--accent)] text-[var(--accent)]" />
                ))}
              </div>
              <p className="text-[13px] text-[var(--muted)]">Trusted by 50+ contractors</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-[13px] text-[var(--muted)]">
            <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-[var(--accent)]" /> No contracts</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-[var(--accent)]" /> Live in days</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-[var(--accent)]" /> Free audit</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   PROBLEM — Agitate the pain
   ───────────────────────────────────────────── */

function ProblemSection({ data }: { data: ServiceData }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 sm:py-28">
      <div className="max-w-[900px] mx-auto px-5 sm:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-[1.1] tracking-tight text-[var(--foreground)] mb-12"
        >
          {data.problem.title}
        </motion.h2>

        <div className="space-y-4">
          {data.problem.points.map((point, i) => (
            <motion.div
              key={point}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              className="flex items-start gap-4 py-4 border-b border-[var(--border)]"
            >
              <span className="w-8 h-8 rounded-full bg-red-50 border border-red-200 flex items-center justify-center shrink-0 mt-0.5 text-red-500 text-[14px] font-bold">
                {i + 1}
              </span>
              <p className="text-[17px] text-[var(--foreground)] leading-relaxed">{point}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   VIDEO — Demo / explainer
   ───────────────────────────────────────────── */

function VideoSection({ data }: { data: ServiceData }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 sm:py-28 bg-[var(--surface)] border-y border-[var(--border)]">
      <div className="max-w-[1000px] mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="text-[13px] font-bold text-[var(--accent)] uppercase tracking-wider block mb-3">
            See it in action
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Watch how it works in 2 minutes.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative rounded-xl overflow-hidden aspect-video bg-[var(--background)] border border-[var(--border)] flex items-center justify-center group cursor-pointer"
        >
          <div className="relative z-10 text-center">
            <div className="w-20 h-20 rounded-full bg-[var(--accent-glow)] border border-[var(--accent)]/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-[var(--accent)] transition-all">
              <Play className="w-8 h-8 text-[var(--accent)] fill-[var(--accent)] ml-1 group-hover:text-force-white" />
            </div>
            <p className="text-[15px] font-medium text-[var(--muted)]">Click to play</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 text-center"
        >
          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-[var(--accent)] font-semibold text-[16px] hover:underline"
          >
            Ready to get started? Skip to the form <ArrowDown className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SOLUTION — Full width dark band
   ───────────────────────────────────────────── */

function SolutionSection({ data }: { data: ServiceData }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} id="solution" className="py-20 sm:py-28 border-t border-[var(--border)]">
      <div className="max-w-[1100px] mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-[700px] mb-16"
        >
          <span className="text-[13px] font-bold text-[var(--accent)] uppercase tracking-wider block mb-4">
            The solution
          </span>
          <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-[1.1] tracking-tight mb-6">
            {data.solution.title}
          </h2>
          <p className="text-[18px] text-[var(--muted)] leading-relaxed">
            {data.solution.description}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {data.solution.points.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              className="p-6 rounded-lg bg-[var(--surface)] border border-[var(--border)]"
            >
              <h3 className="text-[18px] font-bold mb-2">{p.title}</h3>
              <p className="text-[15px] text-[var(--muted)] leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12"
        >
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-[var(--accent)] text-force-white font-bold text-[17px] hover:bg-[var(--accent-hover)] transition-all hover:-translate-y-0.5"
          >
            Get started today
            <ArrowRight className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   MID-PAGE CTA — Conversion break
   ───────────────────────────────────────────── */

function MidPageCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-16 sm:py-20 border-y border-[var(--border)]">
      <div className="max-w-[900px] mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left"
        >
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] mb-2">
              Seen enough? Let&apos;s talk.
            </h3>
            <p className="text-[16px] text-[var(--muted)]">
              Get a free audit — takes 30 seconds, no commitment.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg bg-[var(--accent)] text-force-white font-bold text-[16px] hover:bg-[var(--accent-hover)] transition-all hover:-translate-y-0.5"
            >
              Get a free audit
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#faq"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg border border-[var(--border)] text-[var(--foreground)] font-semibold text-[16px] hover:border-[var(--foreground)] transition-all"
            >
              Read the FAQ
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   HOW IT WORKS — Timeline
   ───────────────────────────────────────────── */

function HowItWorksSection({ data }: { data: ServiceData }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 sm:py-28">
      <div className="max-w-[900px] mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[13px] font-bold text-[var(--accent)] uppercase tracking-wider block mb-3">
            How it works
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Live in days, not months.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-0">
          {data.howItWorks.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.15 }}
              className="relative p-8 text-center"
            >
              {i < data.howItWorks.length - 1 && (
                <div className="hidden md:block absolute top-12 right-0 w-px h-16 bg-[var(--border)]" style={{ transform: "rotate(90deg)", transformOrigin: "top" }} />
              )}
              <div className="w-14 h-14 rounded-full bg-[var(--accent)] text-force-white flex items-center justify-center mx-auto mb-5 text-[20px] font-bold">
                {i + 1}
              </div>
              <h3 className="text-[19px] font-bold text-[var(--foreground)] mb-2">{s.step}</h3>
              <p className="text-[15px] text-[var(--muted)] leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   RESULTS — Full width with testimonial
   ───────────────────────────────────────────── */

function ResultsSection({ data }: { data: ServiceData }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="bg-[var(--surface)] py-20 sm:py-28 border-y border-[var(--border)]">
      <div className="max-w-[1100px] mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[13px] font-bold text-[var(--accent)] uppercase tracking-wider block mb-3">
            Results
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Numbers that pay the bills.
          </h2>
        </motion.div>

        {/* Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {data.results.map((r, i) => (
            <motion.div
              key={r.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              className="bg-[var(--background)] border border-[var(--border)] rounded-lg p-6 text-center"
            >
              <p className="text-4xl sm:text-5xl font-bold text-[var(--accent)] mb-1">{r.metric}</p>
              <p className="text-[15px] font-semibold text-[var(--foreground)] mb-1">{r.label}</p>
              <p className="text-[13px] text-[var(--text-tertiary)]">{r.detail}</p>
            </motion.div>
          ))}
        </div>

        {/* Testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="max-w-[700px] mx-auto text-center"
        >
          <div className="flex justify-center gap-1 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-[var(--accent)] text-[var(--accent)]" />
            ))}
          </div>
          <blockquote className="text-[20px] sm:text-[22px] text-[var(--foreground)] leading-relaxed font-medium mb-6">
            &ldquo;{data.testimonial.quote}&rdquo;
          </blockquote>
          <div>
            <p className="text-[15px] font-semibold text-[var(--foreground)]">{data.testimonial.name}</p>
            <p className="text-[14px] text-[var(--muted)]">{data.testimonial.role}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   INCLUDES — Checklist
   ───────────────────────────────────────────── */

function IncludesSection({ data }: { data: ServiceData }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 sm:py-28">
      <div className="max-w-[900px] mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-[1fr_1fr] gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[13px] font-bold text-[var(--accent)] uppercase tracking-wider block mb-3">
              What&apos;s included
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Everything you need. Nothing you don&apos;t.
            </h2>
            <p className="text-[16px] text-[var(--muted)] leading-relaxed mb-6">
              No hidden fees, no upsells, no nickel-and-diming. Here&apos;s exactly what you get.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 text-[var(--accent)] font-semibold text-[16px] hover:underline"
            >
              Get started <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="space-y-3"
          >
            {data.includes.map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: 20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.06 }}
                className="flex items-start gap-3 py-3 border-b border-[var(--border)]"
              >
                <CheckCircle className="w-5 h-5 text-[var(--accent)] shrink-0 mt-0.5" />
                <span className="text-[16px] text-[var(--foreground)]">{item}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   FAQ
   ───────────────────────────────────────────── */

function FAQSection({ data }: { data: ServiceData }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section ref={ref} id="faq" className="py-20 sm:py-28 bg-[var(--surface)] border-y border-[var(--border)]">
      <div className="max-w-[800px] mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-[13px] font-bold text-[var(--accent)] uppercase tracking-wider block mb-3">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Questions? Answered.
          </h2>
        </motion.div>

        <div className="space-y-2">
          {data.faqs.map((faq, i) => (
            <motion.div
              key={faq.q}
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.2 + i * 0.06 }}
              className="bg-[var(--background)] border border-[var(--border)] rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex items-center justify-between w-full px-6 py-5 text-left text-[16px] font-semibold text-[var(--foreground)] hover:bg-[var(--surface)] transition-colors"
              >
                {faq.q}
                <ChevronDown className={`w-5 h-5 text-[var(--muted)] shrink-0 ml-4 transition-transform ${openIndex === i ? "rotate-180" : ""}`} />
              </button>
              {openIndex === i && (
                <div className="px-6 pb-5 text-[15px] text-[var(--muted)] leading-relaxed">
                  {faq.a}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   FINAL CTA — Full width dark
   ───────────────────────────────────────────── */

function FinalCTASection({ data }: { data: ServiceData }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: [
            `Service: ${data.title}`,
            form.phone && `Phone: ${form.phone}`,
            form.message,
          ].filter(Boolean).join("\n"),
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const inputClass =
    "w-full px-4 py-3.5 rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent)] transition-colors text-[15px]";

  return (
    <section ref={ref} id="contact" className="py-20 sm:py-28 border-t border-[var(--border)]">
      <div className="max-w-[1100px] mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[13px] font-bold text-[var(--accent)] uppercase tracking-wider block mb-4">
              Get started
            </span>
            <h2 className="text-[clamp(2rem,5vw,3rem)] font-bold leading-[1.1] tracking-tight mb-6">
              Ready to stop leaving money on the table?
            </h2>
            <p className="text-[18px] text-[var(--muted)] leading-relaxed mb-10">
              Get a free audit of your current setup. No pitch, no pressure — just a clear look at what&apos;s possible.
            </p>

            <div className="space-y-4 mb-10">
              {[
                { icon: Shield, text: "Free — no credit card, no commitment" },
                { icon: Clock, text: "Detailed audit delivered in 48 hours" },
                { icon: CheckCircle, text: "Custom recommendations for your business" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 text-[var(--accent)] shrink-0" />
                  <span className="text-[16px] text-[var(--muted)]">{item.text}</span>
                </div>
              ))}
            </div>

            {/* Mini testimonial */}
            <div className="p-5 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
              <div className="flex gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[var(--accent)] text-[var(--accent)]" />
                ))}
              </div>
              <p className="text-[15px] text-[var(--foreground)] italic mb-2">
                &ldquo;{data.testimonial.quote.slice(0, 100)}...&rdquo;
              </p>
              <p className="text-[13px] text-[var(--muted)]">{data.testimonial.name} — {data.testimonial.role}</p>
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {status === "success" ? (
              <div className="p-12 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-center">
                <CheckCircle className="w-12 h-12 text-[var(--accent)] mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Request received.</h3>
                <p className="text-[16px] text-[var(--muted)]">Expect your audit within 48 hours.</p>
              </div>
            ) : (
              <form onSubmit={submit} className="p-8 sm:p-10 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-4">
                <div>
                  <h3 className="text-[20px] font-bold mb-1">Get your free audit</h3>
                  <p className="text-[14px] text-[var(--muted)] mb-4">Takes 30 seconds. No obligation.</p>
                </div>
                <div>
                  <label htmlFor="f-name" className="block text-[14px] font-medium mb-1.5">Name</label>
                  <input id="f-name" required value={form.name} onChange={set("name")} className={inputClass} placeholder="Your name" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="f-email" className="block text-[14px] font-medium mb-1.5">Email</label>
                    <input id="f-email" type="email" required value={form.email} onChange={set("email")} className={inputClass} placeholder="you@email.com" />
                  </div>
                  <div>
                    <label htmlFor="f-phone" className="block text-[14px] font-medium mb-1.5">Phone</label>
                    <input id="f-phone" type="tel" value={form.phone} onChange={set("phone")} className={inputClass} placeholder="(555) 123-4567" />
                  </div>
                </div>
                <div>
                  <label htmlFor="f-msg" className="block text-[14px] font-medium mb-1.5">What can we help with?</label>
                  <textarea id="f-msg" rows={3} value={form.message} onChange={set("message")} className={inputClass + " resize-none"} placeholder="Tell us about your business..." />
                </div>

                {status === "error" && (
                  <p className="text-red-400 text-[14px]">Something went wrong. Try again.</p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg bg-[var(--accent)] text-force-white font-bold text-[17px] hover:bg-[var(--accent-hover)] transition-all hover:-translate-y-0.5 disabled:opacity-50"
                >
                  {status === "loading" ? (
                    <><Clock className="w-5 h-5 animate-spin" /> Sending...</>
                  ) : (
                    <>Get my free audit <ArrowRight className="w-5 h-5" /></>
                  )}
                </button>

                <p className="text-[12px] text-[#ffffff50] text-center">
                  No spam. No contracts. No pressure.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
