"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Hero() {
  const [typedText, setTypedText] = useState("");
  const fullText = "Stop Answering the Phone to Schedule Lessons";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= fullText.length) {
        setTypedText(fullText.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 55);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="max-w-4xl">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
          <span className="w-2 h-2 bg-cyan-400 rounded-full" />
          <span className="text-gray-400 text-sm">Built for Tennessee driving schools</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            {typedText}
          </span>
          <span className="inline-block w-0.5 h-10 md:h-14 bg-cyan-400 ml-1 animate-pulse align-middle" />
        </h1>

        {/* Subheadline */}
        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Online booking, automated SMS reminders, student tracking, and compliance tools — all in one platform. Replace your phone, Google Forms, and spreadsheets.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link
            href="/signup"
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white font-semibold text-lg hover:opacity-90 transition-opacity"
          >
            Start Free — No Credit Card
          </Link>
          <Link
            href="/demo"
            className="px-8 py-4 bg-white/5 border border-white/20 rounded-xl text-white font-medium text-lg hover:bg-white/10 transition-colors"
          >
            Watch 2-Min Demo
          </Link>
        </div>

        {/* Trust signals */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-gray-500 text-sm">
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center">
              <svg className="w-2.5 h-2.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </span>
            TCA compliance built in
          </span>
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center">
              <svg className="w-2.5 h-2.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </span>
            48h + 4h SMS reminders
          </span>
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center">
              <svg className="w-2.5 h-2.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </span>
            Import students in 30 seconds
          </span>
        </div>
      </div>
    </section>
  );
}