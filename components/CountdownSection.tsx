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
        <h2 className="font-display text-3xl md:text-5xl text-mycelium mb-3">
          First Drop
        </h2>
        <p className="font-mono text-lg md:text-xl text-mycelium/50 tracking-[0.3em] mb-10 md:mb-14">
          4 &middot; 20 &middot; 2026
        </p>
        <CountdownTimer />
      </motion.div>
    </section>
  );
}
