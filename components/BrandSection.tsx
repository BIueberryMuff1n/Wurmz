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
        className="relative max-w-3xl bg-deep-earth/92 backdrop-blur-sm p-5 md:p-12"
        style={{ border: "3px solid rgba(80,65,50,0.6)", borderLeft: "4px solid #E63462", boxShadow: "inset 0 0 20px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.4)" }}
      >
        {/* Corner bolts */}
        <div className="absolute top-2 left-2 w-2.5 h-2.5 rounded-full bg-root-brown/50 border border-root-brown/30" />
        <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-root-brown/50 border border-root-brown/30" />
        <div className="absolute bottom-2 left-2 w-2.5 h-2.5 rounded-full bg-root-brown/50 border border-root-brown/30" />
        <div className="absolute bottom-2 right-2 w-2.5 h-2.5 rounded-full bg-root-brown/50 border border-root-brown/30" />
        {/* Grate lines */}
        <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.04, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 18px, rgba(80,65,50,0.8) 18px, rgba(80,65,50,0.8) 19px)" }} />
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
