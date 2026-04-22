"use client";

import { motion } from "framer-motion";

const features = [
  {
    title: "Online Student Booking",
    description:
      "Students pick their lesson type and time slot online — no phone calls, no Google Forms. Bookings go straight into your calendar.",
    icon: "📅",
  },
  {
    title: "Automated SMS Reminders",
    description:
      "48-hour and 4-hour reminders fire automatically. Students confirm or reschedule with one reply. No-shows drop 40–70%.",
    icon: "📱",
  },
  {
    title: "Student Progress Tracking",
    description:
      "Track classroom hours, driving hours, and permit status for every student. Know exactly where each student stands.",
    icon: "🎓",
  },
  {
    title: "TCA Compliance Built In",
    description:
      "Automatically tracks the 6hr classroom + 6hr driving requirement. Issue certificates when students complete the program.",
    icon: "✅",
  },
  {
    title: "Deposit Collection",
    description:
      "Collect a deposit when students book. If they no-show, you keep the money. If they cancel 24h out, it refunds automatically.",
    icon: "💳",
  },
  {
    title: "CSV Student Import",
    description:
      "Have an Excel sheet of existing students? Drag it in and import 200 records in 30 seconds. PII is encrypted immediately.",
    icon: "📁",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-cyan-400 text-sm font-medium tracking-wider uppercase">Features</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
            Everything you need to scale
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Built by driving school owners, for driving school owners. Every feature designed to save you time and grow your business.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-cyan-500/30 hover:bg-white/10 transition-all group cursor-pointer"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}