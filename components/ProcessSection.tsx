"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { SeedlingIcon, LeafIcon, WaterDropIcon, PressIcon } from "./GraffitiIcons";

const steps: { number: string; title: string; description: string; icon: ReactNode }[] = [
  {
    number: "01",
    title: "Grow",
    icon: <SeedlingIcon />,
    description: "Seeds go into rich, living soil. No synthetics, no shortcuts. The microbiome does the heavy lifting.",
  },
  {
    number: "02",
    title: "Harvest",
    icon: <LeafIcon />,
    description: "Hand trimmed at peak ripeness. Every bud gets individual attention — that's the micro license difference.",
  },
  {
    number: "03",
    title: "Wash",
    icon: <WaterDropIcon />,
    description: "Fresh frozen flower goes through ice water extraction. Pure trichome heads, nothing else.",
  },
  {
    number: "04",
    title: "Press",
    icon: <PressIcon />,
    description: "Hash gets pressed into solventless rosin. Heat and pressure only — no chemicals, no solvents, ever.",
  },
];

export default function ProcessSection() {
  return (
    <section className="px-6 py-24 md:py-32">
      <div className="bg-deep-earth/90 backdrop-blur-sm rounded-sm p-6 md:p-10">
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
              <div className="flex items-center gap-3 mb-2">
                {step.icon}
                <h3 className="font-display text-xl md:text-2xl text-mycelium">
                  {step.title}
                </h3>
              </div>
              <p className="font-mono text-sm md:text-base text-mycelium/60 leading-relaxed">
                {step.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
      </div>
    </section>
  );
}
