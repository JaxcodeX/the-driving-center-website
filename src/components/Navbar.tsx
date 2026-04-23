"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/[0.06] backdrop-blur-xl border-b border-white/[0.08]"
          : "bg-transparent"
      }`}
      style={{
        boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.4)" : "none",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <motion.div
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-2"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.4)]">
            <span className="text-white font-bold text-sm">DC</span>
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">The Driving Center</span>
        </motion.div>

        <div className="hidden md:flex items-center gap-8">
          {["How It Works", "Features", "Pricing", "FAQ"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(" ", "-")}`}
              className="text-gray-400 hover:text-cyan-400 transition-colors text-sm font-medium"
            >
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/login"
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm font-medium"
          >
            Sign In
          </a>
          <motion.a
            href="/signup"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(6,182,212,0.4)]"
          >
            Get Started Free
          </motion.a>
        </div>
      </div>
    </motion.nav>
  );
}
