"use client";

import { motion } from "framer-motion";

export default function BrandSection() {
  return (
    <section className="flex justify-center px-6 py-24 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-3xl rounded-sm border-l-4 border-crimson-neon bg-deep-earth/80 p-8 md:p-12 shadow-[4px_4px_0px_rgba(61,43,31,0.6)]"
      >
        <h2 className="font-display text-3xl md:text-5xl text-crimson-neon mb-6">
          Grown From the Ground Up
        </h2>
        <p className="font-mono text-base md:text-lg text-mycelium/80 leading-relaxed">
          Wurmz is small-batch craft cannabis grown the way nature intended —
          in living soil, hand trimmed, processed entirely in-house. We hold a
          NYS micro license, the smallest canopy allowed. No corporate farms,
          no cutting corners. Just worms, microbes, and the craft.
        </p>
      </motion.div>
    </section>
  );
}
