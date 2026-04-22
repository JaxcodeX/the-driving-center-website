"use client";

import { motion } from "framer-motion";

const features = [
  {
    title: "Smart Scheduling",
    description: "AI-powered scheduling that automatically matches instructors with students based on availability, location, and preferences.",
    icon: "📅",
  },
  {
    title: "Student Portal",
    description: "Students book lessons, track progress, and pay invoices — all from their phone. Reduce admin work by 80%.",
    icon: "🎓",
  },
  {
    title: "Automated Reminders",
    description: "SMS and email reminders sent automatically. Never miss a lesson or lose a student to no-shows again.",
    icon: "📱",
  },
  {
    title: "Billing & Invoicing",
    description: "Generate invoices, process payments, and track revenue. Stripe integration for seamless payouts.",
    icon: "💳",
  },
  {
    title: "Instructor Management",
    description: "Manage schedules, track hours, and monitor performance across your entire instructor team.",
    icon: "👨‍🏫",
  },
  {
    title: "Compliance Made Easy",
    description: "Built-in DMV compliance tracking. Know when licenses expire, when evaluations are due, and stay audit-ready.",
    icon: "✅",
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