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
  const fadeOut = Math.max(0, 1 - scrollY / 1000);

  const [moonPhase, setMoonPhase] = useState<number | null>(null);

  useEffect(() => {
    setMoonPhase(getMoonPhase());
  }, []);

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
            #241a30 55%,
            #161622 70%,
            #10131e 85%,
            #0a0f1a 100%
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

      {/* Shooting star — single stroke that races along the arc path */}
      {shootingStar && (
        <svg
          key={shootingStar.key}
          className="absolute inset-0 w-full h-full"
          style={{ overflow: "visible" }}
        >
          {/* The streak: a single path with a moving dash that shrinks */}
          <path
            d="M-50,70 C300,10 900,150 1550,420"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="120 3000"
            strokeDashoffset="120"
          >
            <animate
              attributeName="stroke-dashoffset"
              values="120;-3000"
              dur="1.6s"
              fill="freeze"
            />
            <animate
              attributeName="stroke-dasharray"
              values="0 3000;120 3000;100 3000;40 3000;0 3000"
              keyTimes="0;0.08;0.3;0.7;1"
              dur="1.6s"
              fill="freeze"
            />
            <animate
              attributeName="opacity"
              values="0;0.9;0.7;0.2;0"
              keyTimes="0;0.05;0.3;0.7;1"
              dur="1.6s"
              fill="freeze"
            />
          </path>
        </svg>
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
        {moonPhase !== null && <MoonWithPhase phase={moonPhase} />}
      </div>

      {/* Faint chemtrails — top left area, two parallel lines */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{
          transform: `translateY(${skyOffset * 0.4}px)`,
          opacity: 0.07,
        }}
      >
        {/* Upper chemtrail — steep diagonal, left side lower */}
        <path
          d="M-20,140 C150,110 350,70 550,30"
          fill="none"
          stroke="white"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        {/* Lower chemtrail — close parallel */}
        <path
          d="M-20,148 C150,118 350,78 550,38"
          fill="none"
          stroke="white"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.6"
        />
      </svg>

      {/* Very faint NYC skyline — sitting at the horizon/ground line */}
      <svg
        className="absolute bottom-[8%] left-0 w-full"
        style={{
          transform: `translateY(${skyOffset * 0.6}px)`,
          opacity: 0.035,
        }}
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        height="50"
      >
        <path
          d={[
            "M0,80",
            // Far left — low Jersey buildings
            "L80,80 L80,72 L90,72 L90,68 L95,68 L95,72 L110,72 L110,80",
            // Gap
            "L180,80",
            // One WTC — tallest, thin spire
            "L420,80 L420,55 L422,55 L422,20 L423,12 L424,20 L426,55 L428,55 L428,80",
            // WTC cluster — shorter surrounding towers
            "L435,80 L435,50 L438,50 L438,55 L445,55 L445,45 L448,45 L448,55 L455,55 L455,60 L458,60 L458,80",
            // Brooklyn Bridge cables hint
            "L490,80 L500,70 L510,65 L520,62 L530,60 L540,62 L550,65 L560,70 L570,80",
            // Lower Manhattan cluster
            "L590,80 L590,52 L593,52 L593,48 L596,48 L596,52 L600,52 L600,42 L603,42 L603,38 L605,38 L605,42 L608,42 L608,52 L615,52 L615,58 L620,58 L620,80",
            // Gap — East River
            "L680,80",
            // Midtown — Empire State Building (iconic stepped profile)
            "L780,80 L780,58 L783,58 L783,50 L785,50 L785,42 L787,42 L787,35 L788,28 L789,22 L790,28 L791,35 L793,42 L795,50 L797,50 L797,58 L800,58 L800,62 L810,62 L810,80",
            // Chrysler Building — art deco crown
            "L830,80 L830,55 L832,55 L833,48 L834,42 L835,38 L835.5,35 L836,32 L836.5,38 L837,42 L838,48 L840,55 L842,55 L842,80",
            // More midtown towers
            "L860,80 L860,55 L865,55 L865,50 L870,50 L870,55 L878,55 L878,60 L885,60 L885,80",
            // 432 Park (thin tall rectangle)
            "L920,80 L920,35 L923,35 L923,80",
            // Upper East Side — shorter, uniform
            "L960,80 L960,68 L970,68 L970,65 L980,65 L980,68 L1000,68 L1000,72 L1010,72 L1010,80",
            // Fade to nothing
            "L1100,80 L1100,74 L1110,74 L1110,78 L1130,78 L1130,80",
            "L1440,80"
          ].join(" ")}
          fill="rgba(180,185,200,0.9)"
        />
      </svg>

      {/* Ground fade — blends seamlessly into the earth system */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: "40%",
          background: `linear-gradient(180deg,
            transparent 0%,
            rgba(10,15,26,0.2) 20%,
            rgba(10,15,26,0.5) 45%,
            rgba(10,15,26,0.8) 70%,
            rgba(10,15,26,1) 100%
          )`,
        }}
      />
    </div>
  );
}

function MoonWithPhase({ phase }: { phase: number }) {
  // phase: 0 = new moon, 0.25 = first quarter, 0.5 = full, 0.75 = last quarter
  // Moon phases are the same globally — not city-specific
  const size = 60;
  const r = 26; // moon radius
  const cx = size / 2;
  const cy = size / 2;

  // The lit portion is rendered by drawing two arcs:
  // - The outer arc is always a semicircle (the moon's edge)
  // - The inner arc is an ellipse that varies with phase (the terminator)
  //
  // For waxing (0-0.5): lit side is on the RIGHT
  // For waning (0.5-1): lit side is on the LEFT

  // Convert phase to illumination angle
  // At phase 0 (new): nothing lit. At 0.5 (full): fully lit.
  // The terminator ellipse rx goes from r (matching circle = no lit area)
  // through 0 (half) to -r (matching circle on other side = full)
  let illumination: number;
  if (phase <= 0.5) {
    illumination = phase * 2; // 0 to 1 during waxing
  } else {
    illumination = (1 - phase) * 2; // 1 to 0 during waning
  }

  // The terminator rx: at illumination 0, rx = r (no light).
  // At illumination 0.5, rx = 0 (half moon). At illumination 1, rx = -r (full).
  const terminatorRx = r * (1 - illumination * 2);

  // Which side is lit?
  const litOnRight = phase <= 0.5;

  // Build the lit area path using two arcs
  // Semicircle on the lit side + terminator curve
  const topY = cy - r;
  const bottomY = cy + r;

  let litPath: string;
  if (litOnRight) {
    // Right side lit: semicircle arc on right, terminator on left
    litPath = `M${cx},${topY} A${r},${r} 0 0,1 ${cx},${bottomY} A${Math.abs(terminatorRx)},${r} 0 0,${terminatorRx < 0 ? 1 : 0} ${cx},${topY}`;
  } else {
    // Left side lit: semicircle arc on left, terminator on right
    litPath = `M${cx},${topY} A${r},${r} 0 0,0 ${cx},${bottomY} A${Math.abs(terminatorRx)},${r} 0 0,${terminatorRx < 0 ? 0 : 1} ${cx},${topY}`;
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: "visible" }}>
      {/* Dark moon base — fully transparent */}
      <circle cx={cx} cy={cy} r={r} fill="none" />

      {/* Glow — matches the lit crescent shape */}
      <defs>
        <filter id="moon-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>
      <path d={litPath} fill="rgba(230,220,190,0.12)" filter="url(#moon-glow)" />

      {/* Lit portion */}
      <path d={litPath} fill="#E0D4B8" />

      {/* Crater details — clipped to lit area only */}
      <clipPath id="moon-lit-clip">
        <path d={litPath} />
      </clipPath>
      <g clipPath="url(#moon-lit-clip)">
        <circle cx={cx - 4} cy={cy - 5} r={2.5} fill="rgba(170,160,140,0.2)" />
        <circle cx={cx + 5} cy={cy + 4} r={2} fill="rgba(170,160,140,0.15)" />
        <circle cx={cx - 1} cy={cy + 7} r={1.8} fill="rgba(170,160,140,0.12)" />
      </g>
    </svg>
  );
}
