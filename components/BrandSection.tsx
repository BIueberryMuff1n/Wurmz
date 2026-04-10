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
        className="max-w-3xl rounded-2xl border border-root-brown bg-deep-earth p-8 md:p-12"
      >
        <h2 className="font-display text-3xl md:text-5xl text-crimson-neon mb-6">
          Grown From the Ground Up
        </h2>
        <p className="font-mono text-base md:text-lg text-mycelium/80 leading-relaxed">
          Wurmz is craft cannabis cultivated the way nature intended — in rich,
          living soil teeming with life. No synthetic nutrients, no chemical
          shortcuts. Just worms, microbes, and millions of years of evolution
          doing what they do best. Every harvest carries the terroir of the soil
          it grew in.
        </p>
      </motion.div>
    </section>
  );
}
