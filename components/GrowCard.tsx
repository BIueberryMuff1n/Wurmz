"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface GrowCardProps {
  icon: ReactNode;
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
      className="relative rounded-sm bg-deep-earth/95 backdrop-blur-sm p-6 md:p-8"
      style={{ border: "3px solid rgba(80,65,50,0.6)", borderTop: "4px solid #E63462", boxShadow: "inset 0 0 20px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.35)" }}
    >
      {/* Corner bolts */}
      <div className="absolute top-2 left-2 w-2.5 h-2.5 rounded-full bg-root-brown/50 border border-root-brown/30" />
      <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-root-brown/50 border border-root-brown/30" />
      <div className="absolute bottom-2 left-2 w-2.5 h-2.5 rounded-full bg-root-brown/50 border border-root-brown/30" />
      <div className="absolute bottom-2 right-2 w-2.5 h-2.5 rounded-full bg-root-brown/50 border border-root-brown/30" />
      {/* Grate lines */}
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.04, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 18px, rgba(80,65,50,0.8) 18px, rgba(80,65,50,0.8) 19px)" }} />
      <div className="mb-4">{icon}</div>
      <h3 className="font-display text-xl md:text-2xl text-mycelium mb-3">
        {title}
      </h3>
      <p className="font-mono text-sm md:text-base text-mycelium/70 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
