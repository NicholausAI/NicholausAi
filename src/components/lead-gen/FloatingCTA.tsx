"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Phone, Mail } from "lucide-react";

export function FloatingCTA() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!isMobile) return null;

  return (
    <>
      {/* Backdrop when drawer is open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[90] bg-[#0a0a0b]/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-[95] px-4 pb-6"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
          >
            <div className="bg-[#111113] border border-[rgba(255,255,255,0.06)] rounded-2xl p-6 shadow-2xl">
              {/* Handle bar */}
              <div className="w-10 h-1 bg-[rgba(255,255,255,0.1)] rounded-full mx-auto mb-5" />

              <div className="space-y-3">
                <a
                  href="/contact"
                  className="flex items-center gap-3 w-full px-5 py-4 rounded-xl text-white font-medium transition-all duration-200"
                  style={{
                    background:
                      "linear-gradient(135deg, #00d4aa, #00b4d8, #7c3aed)",
                  }}
                >
                  <Phone className="w-5 h-5" />
                  Book a Call
                </a>
                <a
                  href="/contact#message"
                  className="flex items-center gap-3 w-full px-5 py-4 rounded-xl bg-[#0a0a0b] border border-[rgba(255,255,255,0.06)] text-white font-medium hover:border-[#00d4aa] transition-all duration-200"
                >
                  <Mail className="w-5 h-5" />
                  Send a Message
                </a>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="mt-4 w-full text-center text-sm text-[#a1a1aa] hover:text-white transition-colors py-2"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            className="fixed bottom-6 right-6 z-[95] w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-[#00d4aa]/25"
            style={{
              background:
                "linear-gradient(135deg, #00d4aa, #00b4d8, #7c3aed)",
            }}
            onClick={() => setIsOpen(true)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            aria-label="Contact us"
          >
            {/* Pulsing ring */}
            <span className="absolute inset-0 rounded-full animate-ping opacity-20 bg-[#00d4aa]" />
            <span className="absolute inset-[-3px] rounded-full animate-pulse opacity-30 border-2 border-[#00d4aa]" />
            <MessageCircle className="w-6 h-6 text-white relative z-10" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
