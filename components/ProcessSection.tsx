"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { SeedlingIcon, LeafIcon, WaterDropIcon, PressIcon } from "./GraffitiIcons";

const steps: { number: string; title: string; description: string; icon: ReactNode }[] = [
  {
    number: "01",
    title: "Grow",
    icon: <SeedlingIcon />,
    description: "Living soil. The microbiome does the work.",
  },
  {
    number: "02",
    title: "Harvest",
    icon: <LeafIcon />,
    description: "Hand trimmed at peak ripeness.",
  },
  {
    number: "03",
    title: "Wash",
    icon: <WaterDropIcon />,
    description: "Ice water. Pure trichome heads.",
  },
  {
    number: "04",
    title: "Press",
    icon: <PressIcon />,
    description: "Heat and pressure. No solvents, ever.",
  },
];

export default function ProcessSection() {
  return (
    <section className="px-6 py-24 md:py-32">
      <div
        className="relative bg-deep-earth/90 backdrop-blur-sm rounded-sm p-6 md:p-10"
        style={{ border: "3px solid rgba(80,65,50,0.6)", boxShadow: "inset 0 0 20px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.35)" }}
      >
      {/* Corner bolts */}
      <div className="absolute top-2 left-2 w-2.5 h-2.5 rounded-full bg-root-brown/50 border border-root-brown/30" />
      <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-root-brown/50 border border-root-brown/30" />
      <div className="absolute bottom-2 left-2 w-2.5 h-2.5 rounded-full bg-root-brown/50 border border-root-brown/30" />
      <div className="absolute bottom-2 right-2 w-2.5 h-2.5 rounded-full bg-root-brown/50 border border-root-brown/30" />
      {/* Grate lines */}
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.04, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 18px, rgba(80,65,50,0.8) 18px, rgba(80,65,50,0.8) 19px)" }} />
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
        One roof. Four steps. No middlemen.
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
