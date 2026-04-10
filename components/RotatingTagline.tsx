"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const taglines = [
  "Organic Living Soil",
  "From the Ground Up",
  "Nature Does the Work",
];

export default function RotatingTagline() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % taglines.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-8 md:h-12 flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.p
          key={taglines[index]}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="text-iridescent font-mono text-sm md:text-lg lg:text-xl tracking-widest uppercase absolute text-center whitespace-nowrap"
        >
          {taglines[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
