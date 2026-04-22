'use client'

import { useState } from 'react'

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
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-cyan-400 text-sm font-medium tracking-wider uppercase">FAQ</span>
          <h2 className="text-4xl font-bold text-white mt-4">
            Questions you probably have
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border border-white/10 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/5 transition-colors"
              >
                <span className="font-medium text-white pr-4">{faq.q}</span>
                <svg
                  className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {open === i && (
                <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
