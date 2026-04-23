"use client";

import { motion } from "framer-motion";

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-cyan-400 text-sm font-medium tracking-wider uppercase">Pricing</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-4">
            Simple pricing. No surprises.
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            One plan covers everything. Import your students, start taking bookings, and reduce no-shows — all for $99/month.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Starter */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0, duration: 0.5 }}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
            className="glass-card rounded-2xl p-8"
          >
            <div className="text-gray-400 font-medium mb-2">Starter</div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-4xl font-bold text-white">$99</span>
              <span className="text-gray-500">/month</span>
            </div>
            <p className="text-gray-500 text-sm mb-6">For single-location schools getting started.</p>
            <ul className="space-y-3 mb-8">
              {[
                'Up to 3 instructors',
                '50 active students',
                'Unlimited bookings',
                '48h + 4h SMS reminders',
                'CSV student import',
                'Online booking page',
                'TCA hour tracking',
                'Email support',
              ].map(item => (
                <li key={item} className="flex items-center gap-3 text-sm text-gray-300">
                  <svg className="w-4 h-4 text-cyan-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <a
              href="/signup"
              className="block text-center py-3 rounded-xl text-white font-medium btn-glow-secondary hover:text-white transition-colors"
            >
              Start Free Trial
            </a>
          </motion.div>

          {/* Growth — highlighted */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.12, duration: 0.5 }}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
            className="glass-card rounded-2xl p-8 relative pricing-popular-card"
          >
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-[0_0_16px_rgba(6,182,212,0.5)]">
              Most Popular
            </div>
            <div className="text-cyan-400 font-medium mb-2 mt-1">Growth</div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-4xl font-bold text-white">$199</span>
              <span className="text-gray-500">/month</span>
            </div>
            <p className="text-gray-500 text-sm mb-6">For schools with 2+ instructors and growing volume.</p>
            <ul className="space-y-3 mb-8">
              {[
                'Up to 8 instructors',
                '200 active students',
                'Everything in Starter',
                'White-label booking page',
                'Custom domain',
                'Priority support',
                'Revenue dashboard',
              ].map(item => (
                <li key={item} className="flex items-center gap-3 text-sm text-gray-300">
                  <svg className="w-4 h-4 text-cyan-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <a
              href="/signup"
              className="block text-center py-3 rounded-xl text-white font-semibold btn-glow hover:opacity-90 transition-opacity"
            >
              Start Free Trial
            </a>
          </motion.div>

          {/* Enterprise */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.24, duration: 0.5 }}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
            className="glass-card rounded-2xl p-8"
          >
            <div className="text-gray-400 font-medium mb-2">Enterprise</div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-4xl font-bold text-white">$399</span>
              <span className="text-gray-500">/month</span>
            </div>
            <p className="text-gray-500 text-sm mb-6">For multi-location schools or franchise operations.</p>
            <ul className="space-y-3 mb-8">
              {[
                'Unlimited instructors',
                'Unlimited students',
                'Everything in Growth',
                'Multi-location management',
                'API access',
                'Dedicated support',
                'Custom integrations',
              ].map(item => (
                <li key={item} className="flex items-center gap-3 text-sm text-gray-300">
                  <svg className="w-4 h-4 text-cyan-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <a
              href="/signup"
              className="block text-center py-3 rounded-xl text-white font-medium btn-glow-secondary hover:text-white transition-colors"
            >
              Contact Us
            </a>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center text-gray-500 text-sm mt-10"
        >
          All plans include a 14-day free trial. No credit card required to start.
        </motion.p>
      </div>
    </section>
  );
}
