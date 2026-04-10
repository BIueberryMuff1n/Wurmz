"use client";

import { useEffect, useState } from "react";

export default function ParachuteWorm() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    function handleScroll() {
      setScrollY(window.scrollY);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Worm descends through the sky portion (first ~600px of scroll)
  // After that it "lands" and disappears (tunnel worm takes over)
  const landingScroll = 500;
  const progress = Math.min(1, scrollY / landingScroll);

  // Start at top of viewport, land at ~65% down (soil line)
  const startY = 5;
  const endY = 58;
  const yPos = startY + progress * (endY - startY);

  // Slight horizontal sway
  const sway = Math.sin(scrollY * 0.01) * 3;

  // Parachute shrinks/collapses as worm lands
  const chuteScale = Math.max(0, 1 - progress * 1.2);
  const chuteOpacity = Math.max(0, 1 - progress * 1.5);

  // Worm opacity — visible during descent, fades at landing
  const wormOpacity = progress >= 0.95 ? Math.max(0, 1 - (progress - 0.95) / 0.05) : 0.9;

  // Don't render after landing
  if (progress >= 1) return null;

  return (
    <div
      className="pointer-events-none fixed z-[8]"
      style={{
        left: `calc(50% + ${sway}vw)`,
        top: `${yPos}vh`,
        transform: "translateX(-50%)",
        opacity: wormOpacity,
      }}
    >
      {/* Parachute */}
      <svg
        width="120"
        height="80"
        viewBox="0 0 120 80"
        className="absolute bottom-full left-1/2 -translate-x-1/2"
        style={{
          opacity: chuteOpacity,
          transform: `translateX(-50%) scale(${chuteScale})`,
          transformOrigin: "bottom center",
        }}
      >
        {/* Canopy — rough, graffiti style */}
        <path
          d="M10,50 Q20,5 60,5 Q100,5 110,50"
          fill="none"
          stroke="rgba(40,12,8,0.6)"
          strokeWidth="4"
        />
        <path
          d="M10,50 Q20,5 60,5 Q100,5 110,50"
          fill="#C43A3A"
          opacity="0.8"
        />
        {/* Canopy panels */}
        <path d="M35,10 Q38,48 35,50" stroke="rgba(40,12,8,0.3)" strokeWidth="1.5" fill="none" />
        <path d="M60,5 Q60,45 60,50" stroke="rgba(40,12,8,0.3)" strokeWidth="1.5" fill="none" />
        <path d="M85,10 Q82,48 85,50" stroke="rgba(40,12,8,0.3)" strokeWidth="1.5" fill="none" />
        {/* Strings */}
        <line x1="15" y1="50" x2="50" y2="75" stroke="rgba(61,43,31,0.5)" strokeWidth="1" />
        <line x1="60" y1="50" x2="60" y2="75" stroke="rgba(61,43,31,0.5)" strokeWidth="1" />
        <line x1="105" y1="50" x2="70" y2="75" stroke="rgba(61,43,31,0.5)" strokeWidth="1" />
      </svg>

      {/* Worm body — same style as tunnel worm */}
      <svg width="80" height="30" viewBox="0 0 80 30">
        {/* Dark outline */}
        <rect
          x="2"
          y="2"
          width="76"
          height="26"
          rx="13"
          ry="13"
          fill="none"
          stroke="rgba(40,12,8,0.7)"
          strokeWidth="3"
        />
        {/* Body fill */}
        <rect
          x="2"
          y="2"
          width="76"
          height="26"
          rx="13"
          ry="13"
          fill="#B83228"
          opacity="0.9"
        />
        {/* Segment lines */}
        {[20, 35, 50, 65].map((x, i) => (
          <line
            key={i}
            x1={x}
            y1={6}
            x2={x}
            y2={24}
            stroke="rgba(60,15,10,0.2)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        ))}
      </svg>
    </div>
  );
}
