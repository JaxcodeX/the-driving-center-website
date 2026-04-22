"use client";

import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/60 backdrop-blur-xl border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">DC</span>
          </div>
          <span className="text-white font-semibold text-lg">The Driving Center</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors text-sm">
            How It Works
          </a>
          <a href="#features" className="text-gray-400 hover:text-white transition-colors text-sm">
            Features
          </a>
          <a href="#pricing" className="text-gray-400 hover:text-white transition-colors text-sm">
            Pricing
          </a>
          <a href="#faq" className="text-gray-400 hover:text-white transition-colors text-sm">
            FAQ
          </a>
        </div>

        <div className="flex items-center gap-3">
          <a href="/login" className="px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm font-medium">
            Sign In
          </a>
          <a
            href="/signup"
            className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Get Started Free
          </a>
        </div>
      </div>
    </nav>
  );
}