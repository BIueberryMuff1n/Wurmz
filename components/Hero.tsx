"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import RotatingTagline from "./RotatingTagline";
import ScrollIndicator from "./ScrollIndicator";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <Image
          src="/logo.png"
          alt="Wurmz — Organic Living Soil"
          width={280}
          height={280}
          priority
          className="rounded-full w-[200px] h-[200px] md:w-[280px] md:h-[280px]"
          style={{
            filter: "drop-shadow(0 0 25px rgba(230,52,98,0.2)) drop-shadow(0 0 50px rgba(139,92,246,0.1))",
          }}
        />
      </motion.div>

      {/* Tagline */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="mt-8"
      >
        <RotatingTagline />
      </motion.div>

      <ScrollIndicator />
    </section>
  );
}
