"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    q: "Do my students need to create an account to book?",
    a: "No. Students select a time slot, enter their name, email, and phone number, then pay the deposit. No account needed — it just works. They'll receive a confirmation email with a link to reschedule if needed.",
  },
  {
    q: "What happens if a student cancels?",
    a: "If a student cancels more than 24 hours before the lesson, the deposit auto-refunds. If it's within 24 hours, the deposit is kept by the school — that's the no-show protection built into the price.",
  },
  {
    q: "How do the SMS reminders work?",
    a: "Every booking automatically gets two SMS reminders: one at 48 hours before the lesson, and one at 4 hours before. Students can reply C to confirm or R to request a reschedule — no phone call required.",
  },
  {
    q: "Is this TCA compliant for Tennessee?",
    a: "Yes. We track the 6-hour classroom + 6-hour behind-the-wheel requirement per T.C.A. § 40-35-102. Schools can issue a certificate of completion directly from the platform when a student finishes the program.",
  },
  {
    q: "Can I import my existing student list?",
    a: "Yes. Drop a CSV file with your student names, dates of birth, permit numbers, and contact info — we'll import everything in under a minute. All PII is encrypted immediately after import.",
  },
  {
    q: "Do I need to sign a contract?",
    a: "No. Month-to-month at $99/mo. Cancel any time from your dashboard. No setup fee, no cancellation fee.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-cyan-400 text-sm font-medium tracking-wider uppercase">FAQ</span>
          <h2 className="text-4xl font-bold text-white mt-4">
            Questions you probably have
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="glass-card rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-white/[0.04] transition-colors"
                >
                  <span className="font-medium text-white pr-4 text-[15px] leading-snug">{faq.q}</span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="shrink-0"
                  >
                    <svg
                      className="w-5 h-5 text-cyan-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed border-t border-white/[0.06] pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
