"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import GrowCard from "./GrowCard";

const cards = [
  {
    icon: "🪱",
    title: "Living Soil",
    description:
      "No hydroponics. No synthetics. Our plants grow in a thriving underground ecosystem — worms, fungi, and billions of microbes doing what nature does best.",
  },
  {
    icon: "🏠",
    title: "Single Source",
    description:
      "We grow the flower, wash the hash, and press the rosin — all under one roof. Seed to sale, no middlemen, no mystery. That's single source.",
  },
  {
    icon: "✂️",
    title: "Small Batch",
    description:
      "NYS micro license — the smallest legal canopy. Every plant gets individual attention. Hand trimmed, natural inputs, zero shortcuts.",
  },
];

export default function GrowSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollX, setScrollX] = useState(0);
  const [maxScroll, setMaxScroll] = useState(1);

  useEffect(() => {
    const section = sectionRef.current;
    const container = scrollContainerRef.current;
    if (!section || !container) return;

    function handleScroll() {
      if (!section || !container) return;
      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight;
      const viewH = window.innerHeight;

      // When section is in view, map vertical scroll to horizontal scroll
      // The section is tall (200vh) to give room for horizontal scrolling
      const scrollableWidth = container.scrollWidth - container.offsetWidth;
      setMaxScroll(scrollableWidth);

      if (rect.top < 0 && rect.bottom > viewH) {
        // We're inside the sticky zone
        const progress = Math.min(1, Math.max(0, -rect.top / (sectionHeight - viewH)));
        const xOffset = progress * scrollableWidth;
        container.scrollLeft = xOffset;
        setScrollX(xOffset);
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Worm progress across the screen (0 = left, 1 = right)
  const wormProgress = maxScroll > 0 ? scrollX / maxScroll : 0;

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: "200vh" }} // Extra height for scroll-to-horizontal mapping
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Section header */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="font-display text-3xl md:text-5xl text-center text-mycelium pt-12 md:pt-16 mb-8 md:mb-12"
        >
          The Grow
        </motion.h2>

        {/* Background worm — moves horizontally with scroll */}
        <div
          className="absolute pointer-events-none z-0"
          style={{
            top: "55%",
            left: `${-10 + wormProgress * 100}%`,
            transform: "translateY(-50%)",
            transition: "left 0.05s linear",
          }}
        >
          <svg width="200" height="50" viewBox="0 0 200 50" opacity="0.25">
            {/* Worm body */}
            <rect
              x="10" y="5" width="180" height="40" rx="20" ry="20"
              fill="none" stroke="rgba(40,12,8,0.7)" strokeWidth="3"
            />
            <rect
              x="10" y="5" width="180" height="40" rx="20" ry="20"
              fill="#B83228" opacity="0.8"
            />
            {/* Segments */}
            {[45, 75, 105, 135, 165].map((x, i) => (
              <line
                key={i} x1={x} y1={10} x2={x} y2={40}
                stroke="rgba(60,15,10,0.2)" strokeWidth="1.5"
              />
            ))}
            {/* Eye */}
            <ellipse cx={178} cy={18} rx={5} ry={4} fill="#1a0a05" />
            <circle cx={180} cy={17} r={1.5} fill="rgba(255,255,255,0.5)" />
            {/* Eyelid */}
            <path d="M172,14 Q178,18 184,14" fill="rgba(140,35,25,0.6)" />
            {/* Smirk */}
            <path d="M182,28 Q186,32 184,33" fill="none" stroke="#1a0a05" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        {/* Horizontal scroll container */}
        <div
          ref={scrollContainerRef}
          className="overflow-hidden relative z-10"
          style={{ scrollBehavior: "auto" }}
        >
          <div className="flex gap-6 px-8 md:px-16 pb-8" style={{ width: "max-content" }}>
            {cards.map((card, i) => (
              <div key={card.title} className="w-[85vw] md:w-[400px] flex-shrink-0">
                <GrowCard {...card} delay={0} />
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-mycelium/30 font-mono text-sm">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M7 10L13 10M13 10L10 7M13 10L10 13" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          scroll
        </div>
      </div>
    </section>
  );
}
