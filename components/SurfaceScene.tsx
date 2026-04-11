"use client";

import { useScroll } from "./ScrollContext";
import { useEffect, useState } from "react";
import AnimeGrass from "./AnimeGrass";

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
  const [isMobile, setIsMobile] = useState(false);

  // No Y parallax — everything stays locked on Y axis, fades with opacity only
  const skyOffset = 0;
  const fadeOut = Math.max(0, 1 - scrollY / 1000);

  const [moonPhase, setMoonPhase] = useState<number | null>(null);

  useEffect(() => {
    setMoonPhase(getMoonPhase());
  }, []);

  // Detect mobile viewport
  useEffect(() => {
    function checkMobile() {
      setIsMobile(window.innerWidth < 768);
    }
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
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

      {/* Stars — fewer on mobile to reduce clutter */}
      <div
        className="absolute inset-0"
        style={{ transform: `translateY(${skyOffset * 0.5}px)` }}
      >
        {([
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
        ] as const).slice(0, isMobile ? 8 : 16).map((star, i) => (
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

      {/* Moon — real phase, smaller on mobile */}
      <div
        className="absolute"
        style={{
          right: "15%",
          top: "8%",
          transform: `translateY(${skyOffset * 0.3}px) scale(${isMobile ? 0.7 : 1})`,
          transformOrigin: "center center",
        }}
      >
        {moonPhase !== null && <MoonWithPhase phase={moonPhase} />}
      </div>

      {/* Faint chemtrails — top left area, two parallel lines */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox={isMobile ? "0 0 375 400" : undefined}
        preserveAspectRatio="none"
        style={{
          transform: `translateY(${skyOffset * 0.4}px)`,
          opacity: 0.07,
        }}
      >
        {/* Upper chemtrail — shorter on mobile */}
        <path
          d={isMobile ? "M-20,140 C80,120 180,90 280,50" : "M-20,140 C150,110 350,70 550,30"}
          fill="none"
          stroke="white"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        {/* Lower chemtrail — close parallel */}
        <path
          d={isMobile ? "M-20,148 C80,128 180,98 280,58" : "M-20,148 C150,118 350,78 550,38"}
          fill="none"
          stroke="white"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.6"
        />
      </svg>

      {/* NYC skyline — major scene element, concentrated and tall */}
      <svg
        className="absolute bottom-[14%] left-[10%] right-[10%]"
        style={{
          opacity: 0.07,
          zIndex: 2,
        }}
        viewBox="0 0 1440 80"
        preserveAspectRatio="xMidYMid meet"
        height="140"
      >
        {/* NYC skyline — concentrated lower Manhattan cluster from NJ/Hoboken */}
        {/* Based on actual photos: tight cluster in center, WTC dominant spike */}
        <path
          d={[
            "M0,80",

            // Empty water on far left
            "L350,80",

            // === LEFT EDGE — shorter buildings stepping up ===
            "L380,80 L380,68 L384,68 L384,62 L388,62 L388,58 L392,58 L392,55 L396,55 L396,52 L400,52",
            // Dense cluster stepping up toward WTC
            "L400,48 L404,48 L404,44 L408,44 L408,48 L412,48 L412,40 L416,40 L416,44 L420,44 L420,38 L424,38 L424,42 L428,42 L428,36 L432,36 L432,40 L436,40 L436,34 L440,34",

            // === DENSE DOWNTOWN CLUSTER — many towers close together ===
            "L440,32 L444,32 L444,28 L448,28 L448,32 L452,32 L452,26 L456,26 L456,30 L460,30 L460,24 L464,24 L464,28 L468,28 L468,22 L472,22 L472,26",

            // === ONE WTC — the SPIKE, dramatically taller ===
            "L480,26 L480,18 L482,18 L482,10 L483,8 L483.5,4 L484,1 L484.5,4 L485,8 L486,10 L486,18 L488,18 L488,26",

            // === RIGHT OF WTC — more towers stepping back down ===
            "L492,26 L492,22 L496,22 L496,26 L500,26 L500,20 L504,20 L504,24 L508,24 L508,28 L512,28 L512,24 L516,24 L516,30 L520,30 L520,26 L524,26 L524,32",
            "L528,32 L528,36 L532,36 L532,32 L536,32 L536,38 L540,38 L540,34 L544,34 L544,40 L548,40 L548,36 L552,36 L552,42",

            // === STEPPING DOWN — right side of cluster ===
            "L556,42 L556,46 L560,46 L560,50 L564,50 L564,48 L568,48 L568,54 L572,54 L572,50 L576,50 L576,56 L580,56 L580,52 L584,52 L584,58 L588,58 L588,62 L592,62 L592,58 L596,58 L596,64 L600,64 L600,68 L604,68 L604,72",

            // Trailing off to right
            "L610,72 L610,74 L618,74 L618,76 L626,76 L626,78 L640,78 L640,80",

            // Empty right
            "L1440,80"
          ].join(" ")}
          fill="rgba(140,145,165,0.85)"
        />
        {/* Window lights — concentrated in the cluster */}
        {[
          [420,36], [436,32], [452,24], [468,20], [484,6], [500,22],
          [516,26], [532,34], [448,30], [472,24], [504,22], [540,36],
          [560,44], [580,54], [412,42], [428,38]
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={0.6} fill="rgba(255,240,180,0.5)">
            <animate attributeName="opacity" values="0.2;0.7;0.2" dur={`${2 + (i % 3)}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </svg>

      {/* Topsoil layer — dark earth beneath the grass */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: "15%",
          background: `linear-gradient(180deg,
            transparent 0%,
            rgba(28,20,14,0.6) 30%,
            rgba(22,16,10,0.9) 70%,
            rgba(18,14,8,1) 100%
          )`,
        }}
      />
      {/* Sky-to-earth fade — gradual darkening above the topsoil */}
      <div
        className="absolute bottom-[12%] left-0 right-0"
        style={{
          height: "30%",
          background: `linear-gradient(180deg,
            transparent 0%,
            rgba(10,15,26,0.3) 40%,
            rgba(14,12,10,0.6) 80%,
            rgba(22,16,10,0.8) 100%
          )`,
        }}
      />

      {/* Anime grass at the ground line — part of surface, scrolls with it */}
      <AnimeGrass />

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
