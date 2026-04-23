"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

function Counter({ target, suffix = "", prefix = "", duration = 2200 }: {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!isInView) return;
    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, target, duration]);

  return (
    <div ref={ref}>
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-5xl md:text-6xl font-black gradient-text counter-stat mb-3"
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {prefix}{count.toLocaleString()}{suffix}
      </motion.div>
    </div>
  );
}

export default function Stats() {
  const stats = [
    { value: 23, suffix: "%", label: "Avg. no-show rate without reminders", prefix: "" },
    { value: 3, suffix: "%", label: "No-show rate with our 48h+4h reminders", prefix: "" },
    { value: 48, suffix: "h", label: "Optimal first reminder window", prefix: "" },
    { value: 2, suffix: " min", label: "Average time to set up a school", prefix: "" },
  ];

  return (
    <section id="stats" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-cyan-400 text-sm font-medium tracking-wider uppercase">Results</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
            Why automated reminders change everything
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: index * 0.12, duration: 0.6, ease: "easeOut" }}
              whileHover={{
                scale: 1.04,
                transition: { duration: 0.2 },
                boxShadow: "0 0 30px rgba(6,182,212,0.2)",
              }}
              className="glass-card rounded-2xl p-8 text-center"
            >
              <Counter
                target={stat.value}
                suffix={stat.suffix}
                prefix={stat.prefix}
              />
              <div className="text-gray-400 text-sm leading-snug">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
