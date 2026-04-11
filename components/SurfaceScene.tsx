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

      {/* Very faint NYC skyline — rendered above ground fade */}
      <svg
        className="absolute bottom-[12%] left-0 w-full"
        style={{
          transform: `translateY(${skyOffset * 0.6}px)`,
          opacity: 0.06,
          zIndex: 2,
        }}
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        height="50"
      >
        {/* Dense, filled skyline silhouette */}
        <path
          d={[
            "M0,80",
            // Jersey City cluster
            "L30,80 L30,68 L35,68 L35,62 L38,62 L38,55 L42,55 L42,62 L48,62 L48,58 L52,58 L52,62 L58,62 L58,65 L65,65 L65,60 L70,60 L70,65 L78,65 L78,58 L82,58 L82,52 L86,52 L86,58 L92,58 L92,62 L100,62 L100,68 L110,68 L110,80",
            // Hoboken low-rises
            "L130,80 L130,72 L138,72 L138,68 L145,68 L145,72 L155,72 L155,80",
            // Gap — Hudson River
            "L200,80",
            // Battery Park / Lower Manhattan starts
            "L240,80 L240,68 L245,68 L245,62 L250,62 L250,58 L255,58 L255,52 L258,52 L258,48 L262,48 L262,52 L268,52 L268,45 L272,45 L272,42 L275,42 L275,38 L278,38 L278,42 L282,42 L282,48 L288,48 L288,52 L292,52 L292,55 L298,55 L298,80",
            // One WTC — tallest, thin spire with antenna
            "L310,80 L310,50 L312,50 L312,30 L313,30 L313,18 L313.5,8 L314,4 L314.5,8 L315,18 L315,30 L316,30 L316,50 L318,50 L318,80",
            // WTC neighbors
            "L325,80 L325,48 L328,48 L328,42 L332,42 L332,48 L336,48 L336,52 L340,52 L340,45 L344,45 L344,40 L348,40 L348,45 L352,45 L352,55 L358,55 L358,80",
            // Financial district fill
            "L365,80 L365,58 L370,58 L370,52 L374,52 L374,48 L378,48 L378,52 L382,52 L382,56 L388,56 L388,60 L395,60 L395,65 L400,65 L400,80",
            // Brooklyn Bridge
            "L420,80 L425,74 L430,70 L436,66 L442,63 L448,61 L454,60 L460,61 L466,63 L472,66 L478,70 L484,74 L490,80",
            // Brooklyn Heights
            "L505,80 L505,70 L510,70 L510,66 L515,66 L515,70 L522,70 L522,65 L528,65 L528,68 L535,68 L535,72 L545,72 L545,80",
            // Downtown Brooklyn
            "L560,80 L560,68 L565,68 L565,60 L568,60 L568,55 L572,55 L572,60 L576,60 L576,65 L582,65 L582,70 L590,70 L590,80",
            // Gap
            "L620,80",
            // Midtown from distance — Empire State
            "L680,80 L680,65 L685,65 L685,58 L688,58 L688,52 L690,52 L690,45 L692,45 L692,38 L694,38 L694,32 L695,28 L695.5,22 L696,16 L696.5,22 L697,28 L698,32 L700,38 L702,45 L704,52 L706,52 L706,58 L710,58 L710,62 L715,62 L715,65 L720,65 L720,80",
            // Hudson Yards / Penn area
            "L735,80 L735,62 L740,62 L740,55 L744,55 L744,50 L748,50 L748,55 L752,55 L752,48 L756,48 L756,52 L760,52 L760,58 L768,58 L768,62 L775,62 L775,80",
            // Chrysler / UN area
            "L795,80 L795,60 L798,60 L798,52 L800,52 L800,45 L801,42 L801.5,38 L802,34 L802.5,38 L803,42 L804,45 L806,52 L808,52 L808,58 L812,58 L812,55 L816,55 L816,50 L820,50 L820,55 L824,55 L824,62 L830,62 L830,80",
            // 432 Park / Billionaire's Row
            "L850,80 L850,58 L854,58 L854,48 L856,48 L856,28 L858,28 L858,48 L862,48 L862,55 L866,55 L866,50 L870,50 L870,45 L872,45 L872,50 L876,50 L876,58 L882,58 L882,80",
            // Upper East Side
            "L900,80 L900,68 L905,68 L905,64 L910,64 L910,60 L915,60 L915,64 L920,64 L920,68 L928,68 L928,72 L935,72 L935,68 L940,68 L940,72 L950,72 L950,80",
            // Harlem / Upper Manhattan fade
            "L970,80 L970,74 L978,74 L978,70 L985,70 L985,74 L995,74 L995,78 L1010,78 L1010,80",
            // GWB hint
            "L1060,80 L1065,76 L1070,74 L1080,73 L1090,74 L1095,76 L1100,80",
            // Bronx low
            "L1130,80 L1130,76 L1140,76 L1140,74 L1150,74 L1150,76 L1165,76 L1165,80",
            "L1440,80"
          ].join(" ")}
          fill="rgba(160,165,185,0.9)"
        />
        {/* Window lights — tiny dots scattered on buildings */}
        {[
          [42,54], [52,59], [82,53], [255,50], [262,46], [275,40],
          [313,25], [328,44], [344,42], [370,54], [565,62], [572,57],
          [692,40], [695,25], [700,36], [740,57], [752,50], [800,48],
          [856,32], [870,47], [910,62], [920,66]
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={0.8} fill="rgba(255,240,180,0.5)">
            <animate attributeName="opacity" values="0.3;0.7;0.3" dur={`${2 + (i % 3)}s`} repeatCount="indefinite" />
          </circle>
        ))}
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
