"use client";

import { motion } from "framer-motion";

interface GrowCardProps {
  icon: string;
  title: string;
  description: string;
  delay: number;
}

export default function GrowCard({
  icon,
  title,
  description,
  delay,
}: GrowCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      viewport={{ once: true, margin: "-80px" }}
      className="rounded-xl border-t-3 border-crimson-neon bg-deep-earth p-6 md:p-8"
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="font-display text-xl md:text-2xl text-mycelium mb-3">
        {title}
      </h3>
      <p className="font-mono text-sm md:text-base text-mycelium/70 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
