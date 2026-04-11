"use client";

import { motion } from "framer-motion";

export default function PhilosophySection() {
  return (
    <section className="px-6 py-24 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
        className="bg-deep-earth/90 backdrop-blur-sm rounded-sm p-6 md:p-10 max-w-2xl mx-auto text-center"
      >
        <h2 className="font-display text-3xl md:text-5xl text-crimson-neon mb-6">
          Why Living Soil?
        </h2>
        <p className="font-mono text-base md:text-lg text-mycelium/70 leading-relaxed mb-6">
          The soil does the work. Billions of organisms break down natural
          inputs into exactly what the plant needs. The result is flower
          with depth that synthetics can&apos;t touch.
        </p>
        <p className="font-mono text-lg md:text-xl text-mycelium/90 leading-relaxed font-semibold">
          Better soil. Better flower.
        </p>
      </motion.div>
    </section>
  );
}
