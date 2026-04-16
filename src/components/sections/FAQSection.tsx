"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  questions?: FAQItem[];
}

const defaultQuestions: FAQItem[] = [
  {
    question: "What types of AI agents do you build?",
    answer:
      "We build custom AI agents for workflow automation, data processing, customer support, document analysis, and internal tooling. Our agents integrate with your existing stack -- Slack, email, CRMs, databases, and APIs -- to automate repetitive manual work and free up your team for higher-value tasks.",
  },
  {
    question: "How long does a typical AI agent project take?",
    answer:
      "Most projects follow a 3-phase approach: Discovery & scoping (1-2 weeks), MVP build (2-4 weeks), and iteration & deployment (1-2 weeks). A focused single-agent project can be live in as little as 4 weeks. More complex multi-agent systems typically take 8-12 weeks.",
  },
  {
    question: "What's the typical ROI for AI automation?",
    answer:
      "Our clients typically see 5-10x ROI within the first 6 months. The biggest wins come from eliminating 20-40 hours per week of manual data entry, report generation, and routine decision-making. Use our ROI calculator above to estimate your potential savings.",
  },
  {
    question: "Do you work with startups or enterprise companies?",
    answer:
      "Both. We work with growth-stage startups looking to scale operations without scaling headcount, and enterprise teams that need to modernize legacy workflows. Our approach adapts to your team size, budget, and technical maturity.",
  },
  {
    question: "What technologies do you use?",
    answer:
      "We're model-agnostic and use the best tools for each project: OpenAI, Anthropic Claude, open-source models, LangChain, vector databases, and custom orchestration frameworks. We prioritize reliability, cost-efficiency, and maintainability over hype.",
  },
  {
    question: "How do you handle data privacy and security?",
    answer:
      "Security is built into every project from day one. We support on-premise deployments, private cloud hosting, and data anonymization pipelines. All agents are built with audit logging, access controls, and compliance requirements (SOC 2, GDPR, HIPAA) in mind.",
  },
];

function FAQAccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-[rgba(255,255,255,0.06)] last:border-b-0">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full py-5 text-left group"
        aria-expanded={isOpen}
      >
        <span
          className={`text-base sm:text-lg font-medium pr-4 transition-colors duration-200 ${
            isOpen ? "text-[#00d4aa]" : "text-white group-hover:text-[#00d4aa]"
          }`}
        >
          {item.question}
        </span>
        <span
          className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
            isOpen
              ? "bg-[#00d4aa]/10 text-[#00d4aa]"
              : "bg-[rgba(255,255,255,0.04)] text-[#a1a1aa] group-hover:text-[#00d4aa]"
          }`}
        >
          {isOpen ? (
            <Minus className="w-4 h-4" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] as [number, number, number, number] }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-[#a1a1aa] text-sm sm:text-base leading-relaxed pr-12">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQSection({ questions = defaultQuestions }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="w-full">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-[#a1a1aa] text-lg">
            Everything you need to know about our AI agent engineering services
          </p>
        </div>

        <div className="p-[1px] rounded-2xl bg-gradient-to-br from-[#00d4aa]/20 via-transparent to-[#7c3aed]/20">
          <div className="bg-[#111113] rounded-2xl px-6 sm:px-8">
            {questions.map((item, index) => (
              <FAQAccordionItem
                key={index}
                item={item}
                isOpen={openIndex === index}
                onToggle={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
