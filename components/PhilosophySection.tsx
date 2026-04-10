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
        className="max-w-2xl mx-auto text-center"
      >
        <h2 className="font-display text-3xl md:text-5xl text-crimson-neon mb-8">
          Why Living Soil?
        </h2>
        <p className="font-mono text-base md:text-lg text-mycelium/70 leading-relaxed mb-6">
          Conventional cannabis is grown in rockwool or hydroponics, fed
          synthetic nutrients from a bottle. It works, but it produces a
          one-dimensional product.
        </p>
        <p className="font-mono text-base md:text-lg text-mycelium/70 leading-relaxed mb-6">
          Living soil is different. Billions of microorganisms break down
          natural inputs into exactly what the plant needs, when it needs it.
          The result is flower with depth, complexity, and a terpene profile
          that synthetics can&apos;t replicate.
        </p>
        <p className="font-mono text-base md:text-lg text-mycelium/80 leading-relaxed font-semibold">
          Better soil. Better flower. That&apos;s the Wurmz way.
        </p>
      </motion.div>
    </section>
  );
}
