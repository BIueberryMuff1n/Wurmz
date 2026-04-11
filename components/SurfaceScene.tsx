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
        {/* NYC skyline — accurate profile from NJ/Hoboken looking east */}
        {/* Heights proportional: WTC=80, ESB=65, 432Park=63, Chrysler=47 (out of 80) */}
        <path
          d={[
            "M0,80",
            // === JERSEY CITY (left, across Hudson) ===
            // Goldman Sachs Tower + 30 Hudson St
            "L120,80 L120,70 L124,70 L124,58 L127,58 L127,52 L130,52 L130,58 L134,58 L134,55 L137,55 L137,50 L140,50 L140,55 L144,55 L144,62 L148,62 L148,58 L152,58 L152,65 L158,65 L158,70 L168,70 L168,80",

            // === HUDSON RIVER ===
            "L250,80",

            // === LOWER MANHATTAN ===
            // Brookfield Place / Battery Park
            "L300,80 L300,65 L304,65 L304,58 L308,58 L308,62 L314,62 L314,55 L318,55 L318,60 L324,60 L324,80",
            // WFC + nearby
            "L330,80 L330,55 L334,55 L334,48 L338,48 L338,52 L342,52 L342,46 L346,46 L346,52 L350,52 L350,58 L356,58 L356,80",

            // === ONE WORLD TRADE CENTER (the spike) ===
            "L370,80 L370,52 L372,52 L372,35 L373,35 L373,20 L374,14 L374.5,6 L375,2 L375.5,6 L376,14 L376,20 L377,35 L378,52 L380,52 L380,80",

            // 3WTC + 4WTC cluster
            "L386,80 L386,50 L389,50 L389,44 L392,44 L392,50 L396,50 L396,55 L400,55 L400,48 L403,48 L403,42 L406,42 L406,48 L410,48 L410,55 L416,55 L416,62 L422,62 L422,80",

            // === BRIDGES (Brooklyn + Manhattan) ===
            "L445,80 L448,76 L452,73 L458,70 L464,68 L470,67 L476,68 L482,70 L488,73 L492,76 L496,80",
            // Manhattan Bridge hint
            "L510,80 L513,77 L518,75 L524,74 L530,75 L535,77 L538,80",

            // === GAP ===
            "L600,80",

            // === MIDTOWN ===
            // Tudor City / UN area low
            "L680,80 L680,68 L684,68 L684,62 L688,62 L688,65 L694,65 L694,80",

            // Chrysler Building (art deco terraced crown)
            "L710,80 L710,60 L712,60 L712,52 L713,48 L714,44 L714.5,40 L715,36 L715.5,40 L716,44 L717,48 L718,52 L720,60 L722,60 L722,80",

            // One Vanderbilt (tall, tapered)
            "L730,80 L730,55 L732,55 L732,38 L733,34 L734,30 L735,28 L736,30 L737,34 L738,38 L740,55 L742,55 L742,80",

            // === EMPIRE STATE BUILDING (stepped setbacks + antenna) ===
            "L760,80 L760,60 L763,60 L763,52 L765,52 L765,44 L767,44 L767,36 L768,32 L769,26 L769.5,20 L770,14 L770.5,20 L771,26 L772,32 L773,36 L775,44 L777,52 L779,52 L779,60 L782,60 L782,80",

            // Penn / MSG area fill
            "L798,80 L798,65 L802,65 L802,58 L806,58 L806,62 L812,62 L812,68 L818,68 L818,80",

            // Hudson Yards (Edge / 30HY / 35HY)
            "L830,80 L830,62 L833,62 L833,52 L836,52 L836,48 L839,48 L839,52 L842,52 L842,56 L846,56 L846,50 L849,50 L849,56 L854,56 L854,62 L860,62 L860,80",

            // === 432 PARK (thin stick — unmistakable) ===
            "L880,80 L880,58 L881,58 L881,22 L882.5,22 L882.5,58 L884,58 L884,80",

            // Central Park South / Columbus Circle low
            "L900,80 L900,72 L906,72 L906,68 L912,68 L912,72 L920,72 L920,80",

            // === UPPER WEST SIDE fading ===
            "L950,80 L950,74 L958,74 L958,72 L968,72 L968,76 L978,76 L978,80",

            // === GEORGE WASHINGTON BRIDGE ===
            "L1060,80 L1062,78 L1066,76 L1074,74 L1082,73 L1090,74 L1098,76 L1102,78 L1104,80",

            // Bronx fade
            "L1150,80 L1150,78 L1160,78 L1160,76 L1175,76 L1175,78 L1190,78 L1190,80",

            "L1440,80"
          ].join(" ")}
          fill="rgba(150,155,175,0.85)"
        />
        {/* Window lights */}
        {[
          [130,54], [140,52], [304,60], [334,50], [374,10], [389,46],
          [403,44], [714,38], [734,32], [770,18], [769,24], [836,50],
          [849,52], [881,30], [881,40]
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={0.7} fill="rgba(255,240,180,0.4)">
            <animate attributeName="opacity" values="0.2;0.6;0.2" dur={`${2 + (i % 3)}s`} repeatCount="indefinite" />
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
