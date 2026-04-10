"use client";

import { useScroll } from "./ScrollContext";
import { useEffect, useState } from "react";

// Calculate current moon phase (0-1, 0=new, 0.5=full)
function getMoonPhase(): number {
  const now = new Date();
  // Known new moon: Jan 6, 2000
  const known = new Date(2000, 0, 6, 18, 14, 0);
  const cycle = 29.53058770576; // synodic month in days
  const diff = (now.getTime() - known.getTime()) / (1000 * 60 * 60 * 24);
  const phase = (diff % cycle) / cycle;
  return phase;
}

export default function SurfaceScene() {
  const { scrollY } = useScroll();
  const [shootingStar, setShootingStar] = useState<{ x: number; y: number; angle: number; key: number } | null>(null);

  const skyOffset = scrollY * 0.2;
  const fadeOut = Math.max(0, 1 - scrollY / 800);

  const moonPhase = getMoonPhase();

  // Periodic shooting stars
  useEffect(() => {
    function triggerStar() {
      setShootingStar({
        x: 10 + Math.random() * 60,
        y: 2 + Math.random() * 20,
        angle: 15 + Math.random() * 30,
        key: Date.now(),
      });
      // Clear after animation
      setTimeout(() => setShootingStar(null), 1500);
    }

    // First one after 5-15 seconds, then every 15-40 seconds
    const firstDelay = 5000 + Math.random() * 10000;
    const firstTimer = setTimeout(() => {
      triggerStar();
      const interval = setInterval(() => {
        triggerStar();
      }, 15000 + Math.random() * 25000);
      return () => clearInterval(interval);
    }, firstDelay);

    return () => clearTimeout(firstTimer);
  }, []);

  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-[7] overflow-hidden"
      style={{ height: "100vh", opacity: fadeOut }}
    >
      {/* Night sky gradient */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translateY(${skyOffset}px)`,
          background: `linear-gradient(
            180deg,
            #0a0f1a 0%,
            #111827 15%,
            #1a1f3a 30%,
            #2d1f3d 45%,
            #3d1f2d 55%,
            #2a1a18 70%,
            #1a1208 85%,
            #110D08 100%
          )`,
        }}
      />

      {/* Stars */}
      <div
        className="absolute inset-0"
        style={{ transform: `translateY(${skyOffset * 0.5}px)` }}
      >
        {[
          { x: 10, y: 5, s: 1.5, o: 0.6 },
          { x: 25, y: 12, s: 1, o: 0.4 },
          { x: 40, y: 3, s: 2, o: 0.7 },
          { x: 55, y: 8, s: 1, o: 0.5 },
          { x: 70, y: 15, s: 1.5, o: 0.6 },
          { x: 85, y: 6, s: 1, o: 0.3 },
          { x: 15, y: 20, s: 1, o: 0.4 },
          { x: 60, y: 18, s: 1.5, o: 0.5 },
          { x: 90, y: 10, s: 2, o: 0.6 },
          { x: 35, y: 22, s: 1, o: 0.3 },
          { x: 78, y: 2, s: 1.5, o: 0.5 },
          { x: 48, y: 25, s: 1, o: 0.4 },
          { x: 5, y: 8, s: 1, o: 0.35 },
          { x: 32, y: 14, s: 1.5, o: 0.45 },
          { x: 67, y: 4, s: 1, o: 0.5 },
          { x: 94, y: 18, s: 1.5, o: 0.4 },
        ].map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.s,
              height: star.s,
              opacity: star.o,
              animation: `twinkle ${3 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}
      </div>

      {/* Shooting star */}
      {shootingStar && (
        <div
          key={shootingStar.key}
          className="absolute"
          style={{
            left: `${shootingStar.x}%`,
            top: `${shootingStar.y}%`,
            transform: `rotate(${shootingStar.angle}deg)`,
          }}
        >
          <div
            style={{
              width: 60,
              height: 1.5,
              background: "linear-gradient(90deg, rgba(255,255,255,0.8), rgba(255,255,255,0))",
              borderRadius: 1,
              animation: "shooting-star 1.2s ease-out forwards",
            }}
          />
        </div>
      )}

      {/* Airplane contrail — slow diagonal drift */}
      <div
        className="absolute"
        style={{
          top: "12%",
          left: "-10%",
          transform: `translateY(${skyOffset * 0.3}px)`,
        }}
      >
        {/* Plane dot */}
        <div
          className="absolute"
          style={{
            width: 2,
            height: 2,
            background: "rgba(255,255,255,0.4)",
            borderRadius: "50%",
            animation: "contrail-move 60s linear infinite",
          }}
        />
        {/* Contrail line */}
        <div
          style={{
            width: 180,
            height: 1,
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.12) 70%, rgba(255,255,255,0.04) 100%)",
            transform: "rotate(-8deg)",
            borderRadius: 1,
            animation: "contrail-fade 60s linear infinite",
          }}
        />
      </div>

      {/* Moon — real phase */}
      <div
        className="absolute"
        style={{
          right: "15%",
          top: "8%",
          transform: `translateY(${skyOffset * 0.3}px)`,
        }}
      >
        <MoonWithPhase phase={moonPhase} />
      </div>

      {/* Ground fade */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: "35%",
          background: `linear-gradient(180deg,
            transparent 0%,
            rgba(30,23,16,0.3) 15%,
            rgba(30,23,16,0.7) 40%,
            #1E1710 60%,
            #170F0A 100%
          )`,
        }}
      />
    </div>
  );
}

function MoonWithPhase({ phase }: { phase: number }) {
  // phase: 0 = new moon, 0.25 = first quarter, 0.5 = full, 0.75 = last quarter
  const size = 50;
  const r = size / 2;

  // Calculate the shadow overlay to simulate moon phase
  // The shadow is an ellipse that covers part of the moon
  // Its width varies with phase, and it flips sides at 0.5
  const isWaxing = phase < 0.5;
  const phaseAngle = isWaxing ? phase * 2 : (phase - 0.5) * 2; // 0-1 within half

  // Shadow ellipse rx: full coverage at 0, no coverage at 1
  const shadowRx = r * Math.abs(1 - phaseAngle * 2);
  const shadowSide = isWaxing ? "right" : "left";

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Moon glow */}
      <circle
        cx={r} cy={r} r={r + 8}
        fill="rgba(245,240,232,0.04)"
      />
      {/* Moon base — full lit surface */}
      <circle
        cx={r} cy={r} r={r - 2}
        fill="radial-gradient(circle at 40% 35%, #f5f0e8 0%, #d4c5a9 60%, #b8a88a 100%)"
      />
      <circle
        cx={r} cy={r} r={r - 2}
        fill="#E8DCC0"
      />
      {/* Subtle crater details */}
      <circle cx={r - 5} cy={r - 3} r={3} fill="rgba(180,170,150,0.3)" />
      <circle cx={r + 6} cy={r + 5} r={2} fill="rgba(180,170,150,0.25)" />
      <circle cx={r - 2} cy={r + 8} r={2.5} fill="rgba(180,170,150,0.2)" />

      {/* Phase shadow — dark side of the moon */}
      {phase > 0.02 && phase < 0.98 && (
        <ellipse
          cx={shadowSide === "right" ? r + (phaseAngle < 0.5 ? 0 : 0) : r}
          cy={r}
          rx={shadowRx}
          ry={r - 2}
          fill="#0a0f1a"
          opacity={0.92}
          clipPath={`inset(0 ${shadowSide === "left" ? "50%" : "0"} 0 ${shadowSide === "right" ? "50%" : "0"})`}
        />
      )}

      {/* Moon outer glow */}
      <circle
        cx={r} cy={r} r={r}
        fill="none"
        style={{
          filter: "drop-shadow(0 0 15px rgba(245,240,232,0.15))",
        }}
      />
    </svg>
  );
}
