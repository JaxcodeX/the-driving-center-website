"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Sign up and set up your school",
    description:
      "Create your account, enter your school name, and claim your public booking URL — something like /school/your-school-name. Takes 2 minutes.",
  },
  {
    number: "02",
    title: "Import your students",
    description:
      "Drop your existing Excel or CSV file into the import wizard. Names, dates of birth, permit numbers — we encrypt everything and have it loaded in under a minute.",
  },
  {
    number: "03",
    title: "Set your availability once",
    description:
      "Tell us which instructors work which hours on which days. Students will only see slots when someone is actually available. Never double-book again.",
  },
  {
    number: "04",
    title: "Students book online — no more phone tag",
    description:
      "Share your booking link. Students pick their lesson type, choose a time, and pay a deposit. You get a notification. Done.",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-cyan-400 text-sm font-medium tracking-wider uppercase">How It Works</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-4">
            Up and running in under an hour
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            No training required. No 30-day implementation. Just sign up, import, and start taking bookings.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {steps.map((step) => (
            <motion.div
              key={step.number}
              variants={cardVariants}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 },
                boxShadow: "0 0 20px rgba(6,182,212,0.15)",
              }}
              className="glass-card rounded-2xl p-8 relative"
            >
              {/* Numbered badge */}
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_16px_rgba(6,182,212,0.2)]">
                  <span className="text-cyan-400 font-black text-base tracking-wider">
                    {step.number}
                  </span>
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/30 to-transparent hidden md:block" />
              </div>

              <h3 className="text-lg font-semibold text-white mb-3">{step.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
