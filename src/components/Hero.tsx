"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const fullText = "Stop Losing $400/Month to Student No-Shows";

export default function Hero() {
  const [typedText, setTypedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= fullText.length) {
        setTypedText(fullText.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
        // Blink cursor a few times then hide it
        setTimeout(() => setShowCursor(false), 2000);
      }
    }, 55);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative">
      {/* Subtle radial overlay to deepen the center */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.04)_0%,transparent_70%)]" />

      <div className="max-w-4xl relative z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-10"
        >
          <motion.span
            className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]"
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-gray-400 text-sm">Built for Tennessee driving schools</span>
        </motion.div>

        {/* Headline */}
        <div className="mb-8 min-h-[5rem] md:min-h-[7rem] flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="gradient-text"
            >
              {typedText}
            </motion.span>
            <AnimatePresence>
              {showCursor && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="inline-block w-0.5 h-10 md:h-14 bg-cyan-400 ml-1 align-middle"
                  style={{ animation: "typewriter-cursor 0.8s ease-in-out infinite" }}
                />
              )}
            </AnimatePresence>
          </h1>
        </div>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          Online booking, automated SMS reminders, student tracking, and compliance tools — all in one platform. Replace your phone, Google Forms, and spreadsheets.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-16"
        >
          <motion.div
            whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(6,182,212,0.6)" }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="btn-glow px-8 py-4 rounded-xl text-white font-semibold text-lg cursor-pointer"
          >
            <Link href="/signup" className="block">
              Start Free — No Credit Card
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="btn-glow-secondary px-8 py-4 rounded-xl text-white font-medium text-lg cursor-pointer"
          >
            <Link href="/book" className="block">
              Watch 2-Min Demo
            </Link>
          </motion.div>
        </motion.div>

        {/* Trust signals */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-6 text-gray-500 text-sm"
        >
          {[
            "TCA compliance built in",
            "48h + 4h SMS reminders",
            "Import students in 30 seconds",
          ].map((label, i) => (
            <motion.span
              key={label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + i * 0.1 }}
              className="flex items-center gap-2"
            >
              <span className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center shadow-[0_0_8px_rgba(34,197,94,0.3)]">
                <svg className="w-2.5 h-2.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </span>
              {label}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
