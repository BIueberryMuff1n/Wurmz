"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Grow",
    description: "Seeds go into rich, living soil. No synthetics, no shortcuts. The microbiome does the heavy lifting.",
  },
  {
    number: "02",
    title: "Harvest",
    description: "Hand trimmed at peak ripeness. Every bud gets individual attention — that's the micro license difference.",
  },
  {
    number: "03",
    title: "Wash",
    description: "Fresh frozen flower goes through ice water extraction. Pure trichome heads, nothing else.",
  },
  {
    number: "04",
    title: "Press",
    description: "Hash gets pressed into solventless rosin. Heat and pressure only — no chemicals, no solvents, ever.",
  },
];

export default function ProcessSection() {
  return (
    <section className="px-6 py-24 md:py-32">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="font-display text-3xl md:text-5xl text-center text-mycelium mb-4"
      >
        The Process
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
        className="font-mono text-base text-center text-mycelium/50 mb-16 max-w-lg mx-auto"
      >
        Seed to sale, all under one roof. Single source means full control.
      </motion.p>

      <div className="max-w-3xl mx-auto space-y-12">
        {steps.map((step, i) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true, margin: "-80px" }}
            className="flex gap-3 md:gap-6 items-start"
          >
            <span className="font-display text-2xl md:text-6xl text-crimson-neon/30 flex-shrink-0 leading-none">
              {step.number}
            </span>
            <div>
              <h3 className="font-display text-xl md:text-2xl text-mycelium mb-2">
                {step.title}
              </h3>
              <p className="font-mono text-sm md:text-base text-mycelium/60 leading-relaxed">
                {step.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
