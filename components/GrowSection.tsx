"use client";

import { motion } from "framer-motion";
import GrowCard from "./GrowCard";

const cards = [
  {
    icon: "🌱",
    title: "Living Soil",
    description:
      "A thriving ecosystem beneath the surface. Our soil is alive with billions of microorganisms that feed and protect every plant naturally.",
  },
  {
    icon: "🪱",
    title: "The Microbiome",
    description:
      "Worms, fungi, and beneficial bacteria work together in a living network. No bottles, no salts — just nature doing what nature does.",
  },
  {
    icon: "🚫",
    title: "No Synthetics",
    description:
      "Zero synthetic nutrients, zero pesticides, zero shortcuts. Every harvest is powered by the soil food web, the way it was meant to be.",
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
