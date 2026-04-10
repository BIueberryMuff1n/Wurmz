"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import RotatingTagline from "./RotatingTagline";
import ScrollIndicator from "./ScrollIndicator";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6">
      {/* Logo with glow ring */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative"
      >
        <div
          className="rounded-full overflow-hidden"
          style={{
            animation: "glow-pulse 4s ease-in-out infinite",
            width: 280,
            height: 280,
          }}
        >
          <Image
            src="/logo.png"
            alt="Wurmz — Organic Living Soil"
            width={280}
            height={280}
            priority
            className="rounded-full scale-110"
            style={{ objectFit: "cover" }}
          />
        </div>
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
