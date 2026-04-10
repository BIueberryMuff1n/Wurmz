"use client";

import { motion } from "framer-motion";
import GrowCard from "./GrowCard";

const cards = [
  {
    icon: "🪱",
    title: "Living Soil",
    description:
      "No hydroponics. No synthetics. Our plants grow in a thriving underground ecosystem — worms, fungi, and billions of microbes doing what nature does best.",
  },
  {
    icon: "🏠",
    title: "Single Source",
    description:
      "We grow the flower, wash the hash, and press the rosin — all under one roof. Seed to sale, no middlemen, no mystery. That's single source.",
  },
  {
    icon: "✂️",
    title: "Small Batch",
    description:
      "NYS micro license — the smallest legal canopy. Every plant gets individual attention. Hand trimmed, natural inputs, zero shortcuts.",
  },
];

export default function GrowSection() {
  return (
    <section className="px-6 py-24 md:py-32">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="font-display text-3xl md:text-5xl text-center text-mycelium mb-12 md:mb-16"
      >
        The Grow
      </motion.h2>
      <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <GrowCard key={card.title} {...card} delay={i * 0.15} />
        ))}
      </div>
    </section>
  );
}
