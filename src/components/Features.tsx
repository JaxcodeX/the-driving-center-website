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

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

export default function Features() {
  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
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
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              whileHover={{
                scale: 1.03,
                transition: { duration: 0.25, ease: "easeOut" },
              }}
              className="glass-card rounded-2xl p-8 cursor-pointer group"
            >
              <div className="text-4xl mb-5">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
