"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import GrowCard from "./GrowCard";
import { WormIcon, HouseIcon, ScissorsIcon } from "./GraffitiIcons";

const cards = [
  {
    icon: <WormIcon />,
    title: "Living Soil",
    description:
      "No hydroponics. No synthetics. Our plants grow in a thriving underground ecosystem \u2014 worms, fungi, and billions of microbes doing what nature does best.",
  },
  {
    icon: <HouseIcon />,
    title: "Single Source",
    description:
      "We grow the flower, wash the hash, and press the rosin \u2014 all under one roof. Seed to sale, no middlemen, no mystery. That\u2019s single source.",
  },
  {
    icon: <ScissorsIcon />,
    title: "Small Batch",
    description:
      "NYS micro license \u2014 the smallest legal canopy. Every plant gets individual attention. Hand trimmed, natural inputs, zero shortcuts.",
  },
];

export default function GrowSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number>(0);

  const handleScroll = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight;
      const viewH = window.innerHeight;
      const scrollableDistance = sectionHeight - viewH;

      if (scrollableDistance <= 0) return;

      // progress: 0 when section top hits viewport top, 1 when section bottom hits viewport bottom
      const rawProgress = -rect.top / scrollableDistance;
      setProgress(Math.min(1, Math.max(0, rawProgress)));
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [handleScroll]);

  // Calculate how far to translate the card track
  // We need to shift the track left by (trackWidth - viewportWidth) * progress
  const [translateX, setTranslateX] = useState(0);

  useEffect(() => {
    function calcTranslate() {
      const track = trackRef.current;
      if (!track) return;
      const trackWidth = track.scrollWidth;
      const viewportWidth = window.innerWidth;
      const maxShift = Math.max(0, trackWidth - viewportWidth);
      setTranslateX(-progress * maxShift);
    }
    calcTranslate();
    window.addEventListener("resize", calcTranslate);
    return () => window.removeEventListener("resize", calcTranslate);
  }, [progress]);

  // Worm moves from -10% to 100% based on progress
  const wormLeft = -10 + progress * 110;

  // Scroll hint fades out as soon as scrolling starts
  const hintOpacity = Math.max(0, 1 - progress * 5);

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: "200vh" }}
    >
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col">
        {/* Section header */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="font-display text-3xl md:text-5xl text-center text-mycelium pt-12 md:pt-16 mb-8 md:mb-12 flex-shrink-0"
        >
          The Grow
        </motion.h2>

        {/* Background worm — moves horizontally with scroll */}
        <div
          className="absolute pointer-events-none z-0"
          style={{
            top: "55%",
            left: `${wormLeft}%`,
            transform: "translateY(-50%)",
            willChange: "left",
          }}
        >
          <svg width="200" height="50" viewBox="0 0 200 50" opacity="0.25">
            <defs>
              <linearGradient id="grow-worm-body" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#7A2818" />
                <stop offset="50%" stopColor="#C43A3A" />
                <stop offset="100%" stopColor="#8B2020" />
              </linearGradient>
            </defs>
            {/* Worm body */}
            <rect
              x="10" y="5" width="180" height="40" rx="20" ry="20"
              fill="none" stroke="rgba(40,12,8,0.7)" strokeWidth="3"
            />
            <rect
              x="10" y="5" width="180" height="40" rx="20" ry="20"
              fill="url(#grow-worm-body)" opacity="0.9"
            />
            {/* Segments */}
            {[45, 75, 105, 135, 165].map((x, i) => (
              <line
                key={i} x1={x} y1={10} x2={x} y2={40}
                stroke="rgba(60,15,10,0.2)" strokeWidth="1.5" strokeLinecap="round"
              />
            ))}
            {/* Eye */}
            <ellipse cx={178} cy={18} rx={5} ry={4} fill="#1a0a05" />
            <circle cx={180} cy={17} r={1.5} fill="rgba(255,255,255,0.5)" />
            {/* Eyelid */}
            <path d="M172,14 Q178,18 184,14" fill="rgba(140,35,25,0.6)" />
            {/* Smirk */}
            <path d="M182,28 Q186,32 184,33" fill="none" stroke="#1a0a05" strokeWidth="1.5" strokeLinecap="round" />
            {/* RAW joint — simplified, no smoke animation per bible state 4 */}
            <g transform="translate(185, 27) rotate(-30)">
              <polygon points="0,-1 14,-2 14,2 0,1" fill="#C8B088" stroke="rgba(140,110,70,0.4)" strokeWidth="0.4" />
              <rect x="-1.5" y="-1" width="3" height="2" rx="1" fill="#A08050" />
              <circle cx="15" cy="0" r="1.8" fill="#D4641A" />
              <circle cx="15" cy="0" r="1.2" fill="#F0A030" opacity="0.8" />
              <circle cx="15" cy="0" r="0.6" fill="#FFD080" opacity="0.6" />
            </g>
          </svg>
        </div>

        {/* Horizontal card track — translated via transform */}
        <div className="flex-1 flex items-center overflow-hidden relative z-10">
          <div
            ref={trackRef}
            className="flex gap-6 px-8 md:px-16"
            style={{
              transform: `translateX(${translateX}px)`,
              willChange: "transform",
            }}
          >
            {cards.map((card) => (
              <div key={card.title} className="w-[85vw] md:w-[50vw] lg:w-[40vw] flex-shrink-0">
                <GrowCard {...card} delay={0} />
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint — fades out quickly */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-mycelium/30 font-mono text-sm"
          style={{ opacity: hintOpacity, transition: "opacity 0.2s ease-out" }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M10 4L10 16M10 16L7 13M10 16L13 13" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          scroll
        </div>
      </div>
    </section>
  );
}
