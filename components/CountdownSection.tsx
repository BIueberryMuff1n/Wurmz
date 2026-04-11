"use client";

import { motion } from "framer-motion";
import CountdownTimer from "./CountdownTimer";

export default function CountdownSection() {
  return (
    <section className="px-6 py-24 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
        className="flex flex-col items-center text-center"
      >
        <div className="relative bg-deep-earth/92 backdrop-blur-sm p-6 md:p-10" style={{ border: "3px solid rgba(80,65,50,0.6)", boxShadow: "inset 0 0 20px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.4)" }}>
        {/* Corner bolts */}
        <div className="absolute top-2 left-2 w-2.5 h-2.5 rounded-full bg-root-brown/50 border border-root-brown/30" />
        <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-root-brown/50 border border-root-brown/30" />
        <div className="absolute bottom-2 left-2 w-2.5 h-2.5 rounded-full bg-root-brown/50 border border-root-brown/30" />
        <div className="absolute bottom-2 right-2 w-2.5 h-2.5 rounded-full bg-root-brown/50 border border-root-brown/30" />
        {/* Grate lines */}
        <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.04, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 18px, rgba(80,65,50,0.8) 18px, rgba(80,65,50,0.8) 19px)" }} />
        <h2 className="font-display text-3xl md:text-5xl text-mycelium mb-3">
          First Drop
        </h2>
        <p className="font-mono text-lg md:text-xl text-mycelium/50 tracking-[0.3em] mb-10 md:mb-14">
          4 &middot; 20 &middot; 2026
        </p>
        <CountdownTimer />
        </div>
      </motion.div>
    </section>
  );
}
