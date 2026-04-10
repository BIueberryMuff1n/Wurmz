"use client";

import { useScroll } from "./ScrollContext";

export default function ParachuteWorm() {
  const { scrollY } = useScroll();

  const landingScroll = 600;
  const progress = Math.min(1, scrollY / landingScroll);

  const yPos = 8 + progress * 54;
  const sway = Math.sin(scrollY * 0.008) * 2;
  const scale = 0.3 + progress * 0.7;
  const chuteOpacity = Math.max(0, 1 - Math.max(0, (progress - 0.7) / 0.3));
  const wormOpacity = progress >= 0.85 ? Math.max(0, 1 - (progress - 0.85) / 0.15) : 1;

  if (progress >= 1) return null;

  return (
    <div
      className="pointer-events-none fixed z-[8]"
      style={{
        left: `calc(50% + ${sway}vw)`,
        top: `${yPos}vh`,
        transform: `translateX(-50%) scale(${scale})`,
        opacity: wormOpacity,
        transformOrigin: "center center",
      }}
    >
      {/* Parachute */}
      <svg
        width="100"
        height="70"
        viewBox="0 0 100 70"
        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1"
        style={{ opacity: chuteOpacity }}
      >
        <path
          d="M8,45 Q15,5 50,5 Q85,5 92,45"
          fill="#C43A3A"
          opacity="0.8"
          stroke="rgba(40,12,8,0.5)"
          strokeWidth="2.5"
        />
        <path d="M30,10 Q32,42 30,45" stroke="rgba(40,12,8,0.25)" strokeWidth="1" fill="none" />
        <path d="M50,5 Q50,40 50,45" stroke="rgba(40,12,8,0.25)" strokeWidth="1" fill="none" />
        <path d="M70,10 Q68,42 70,45" stroke="rgba(40,12,8,0.25)" strokeWidth="1" fill="none" />
        <line x1="12" y1="45" x2="42" y2="65" stroke="rgba(61,43,31,0.4)" strokeWidth="0.8" />
        <line x1="50" y1="45" x2="50" y2="65" stroke="rgba(61,43,31,0.4)" strokeWidth="0.8" />
        <line x1="88" y1="45" x2="58" y2="65" stroke="rgba(61,43,31,0.4)" strokeWidth="0.8" />
      </svg>

      {/* Worm body */}
      <svg width="60" height="28" viewBox="0 0 60 28">
        <rect
          x="2" y="2" width="56" height="24" rx="12" ry="12"
          fill="none" stroke="rgba(40,12,8,0.7)" strokeWidth="2.5"
        />
        <rect
          x="2" y="2" width="56" height="24" rx="12" ry="12"
          fill="#B83228" opacity="0.9"
        />
        {[16, 28, 40].map((x, i) => (
          <line
            key={i} x1={x} y1={6} x2={x} y2={22}
            stroke="rgba(60,15,10,0.2)" strokeWidth="1.5" strokeLinecap="round"
          />
        ))}
      </svg>
    </div>
  );
}
