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
  // The sky fades but the GROUND stays opaque longer
  // This prevents the line where two different browns meet at partial opacity
  const skyFade = Math.max(0, 1 - scrollY / 600); // sky elements fade faster
  const groundFade = Math.max(0, 1 - scrollY / 1400); // ground stays much longer
  const fadeOut = skyFade; // used by the main container

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

  // Periodic shooting stars — only after mount to avoid hydration mismatch
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;
    let clearTimerId: ReturnType<typeof setTimeout> | null = null;

    function triggerStar() {
      setShootingStar({
        x: 10 + Math.random() * 60,
        y: 2 + Math.random() * 20,
        angle: 15 + Math.random() * 30,
        key: Date.now(),
      });
      // Clear after animation
      clearTimerId = setTimeout(() => setShootingStar(null), 1500);
    }

    // First one after 5-15 seconds, then every 15-40 seconds
    const firstDelay = 5000 + Math.random() * 10000;
    const firstTimer = setTimeout(() => {
      triggerStar();
      intervalId = setInterval(() => {
        triggerStar();
      }, 15000 + Math.random() * 25000);
    }, firstDelay);

    return () => {
      clearTimeout(firstTimer);
      if (intervalId) clearInterval(intervalId);
      if (clearTimerId) clearTimeout(clearTimerId);
    };
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
            #221820 45%,
            #1a1418 55%,
            #161622 70%,
            #10131e 85%,
            #0c0a08 100%
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
        {/* NYC skyline — full Manhattan panorama silhouette */}
        <path
          d={[
            "M0,80",

            // === FAR LEFT — low buildings + church steeple ===
            "L40,80 L40,72 L45,72 L45,68 L48,68 L48,72 L55,72 L55,65 L58,65 L58,70 L65,70",
            // Church steeple
            "L68,70 L68,60 L69,55 L69.5,48 L70,55 L70,60 L72,70",
            "L78,70 L78,66 L82,66 L82,62 L86,62 L86,58 L90,58 L90,62 L95,62 L95,66 L100,66 L100,70 L108,70 L108,80",

            // Small gap
            "L120,80",

            // === STEPPING UP — toward downtown ===
            "L120,72 L125,72 L125,65 L130,65 L130,60 L134,60 L134,56 L138,56 L138,52 L142,52 L142,58 L148,58 L148,50 L152,50 L152,54 L156,54 L156,46 L160,46 L160,50 L165,50 L165,44 L170,44 L170,48 L175,48",

            // === DENSE CLUSTER — downtown towers ===
            "L175,42 L180,42 L180,38 L184,38 L184,42 L188,42 L188,35 L192,35 L192,40 L196,40 L196,34 L200,34 L200,38 L204,38 L204,30 L208,30 L208,34 L212,34 L212,28 L216,28",

            // === ONE WTC — tallest spike ===
            "L220,28 L220,20 L222,20 L222,12 L223,10 L223.5,5 L224,2 L224.5,5 L225,10 L226,12 L226,20 L228,20 L228,28",

            // === RIGHT OF WTC — dense towers ===
            "L232,28 L232,24 L236,24 L236,30 L240,30 L240,26 L244,26 L244,32 L248,32 L248,28 L252,28 L252,34 L256,34 L256,30 L260,30 L260,36 L264,36 L264,32 L268,32 L268,38 L272,38 L272,34 L276,34 L276,40",

            // === MID-SECTION — slightly lower, varied ===
            "L280,40 L280,44 L284,44 L284,38 L288,38 L288,42 L292,42 L292,46 L296,46",
            // Church/pointy spire
            "L298,46 L298,38 L299,34 L299.5,28 L300,34 L300,38 L302,46",
            "L306,46 L306,42 L310,42 L310,48 L314,48 L314,44 L318,44 L318,50",

            // === EMPIRE STATE AREA — tall with antenna ===
            "L330,50 L330,42 L332,42 L332,34 L334,34 L334,28 L335,24 L335.5,18 L336,12 L336.5,18 L337,24 L338,28 L340,34 L342,42 L344,42 L344,50",

            // === DENSE MIDTOWN — many towers ===
            "L348,50 L348,44 L352,44 L352,40 L356,40 L356,36 L360,36 L360,40 L364,40 L364,34 L368,34 L368,38 L372,38 L372,32 L376,32 L376,36 L380,36 L380,40 L384,40 L384,36 L388,36 L388,42 L392,42 L392,38 L396,38 L396,44",

            // Thin antenna tower
            "L400,44 L401,44 L401,30 L401.5,22 L402,16 L402.5,22 L403,30 L403,44",

            // === CHRYSLER-LIKE SPIRE ===
            "L410,44 L410,38 L412,38 L412,32 L413,28 L413.5,22 L414,18 L414.5,22 L415,28 L416,32 L418,38 L420,44",

            // === STEPPING DOWN — upper east ===
            "L424,44 L424,48 L428,48 L428,42 L432,42 L432,46 L436,46 L436,50 L440,50 L440,54 L444,54 L444,50 L448,50 L448,56 L452,56 L452,52 L456,52 L456,58 L460,58 L460,62",

            // === FAR RIGHT — scattered, trailing off ===
            "L466,62 L466,58 L470,58 L470,55 L473,55 L473,50 L475,50 L475,46 L477,46 L477,50 L480,50 L480,55 L484,55 L484,60 L488,60 L488,64 L492,64 L492,68",
            "L500,68 L500,64 L504,64 L504,60 L506,60 L506,56 L508,56 L508,60 L510,60 L510,66 L515,66 L515,70 L520,70 L520,74 L530,74 L530,78 L540,78 L540,80",

            "L1440,80"
          ].join(" ")}
          fill="rgba(140,145,165,0.85)"
        />
        {/* Window lights — scattered across the full panorama */}
        {[
          [160,44], [192,36], [224,8], [236,26], [260,32], [288,40],
          [336,16], [356,38], [376,34], [402,20], [414,22], [432,44],
          [200,32], [248,30], [300,36], [370,36], [448,52], [474,48],
          [506,58], [152,48], [272,36], [392,40]
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={0.5} fill="rgba(255,240,180,0.5)">
            <animate attributeName="opacity" values="0.15;0.6;0.15" dur={`${2.5 + (i % 4) * 0.5}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </svg>

      {/* Ground transition — stays opaque longer than the sky to prevent line */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: "50%",
          opacity: Math.min(1, groundFade * 1.5), // ground stays visible longer
          background: `linear-gradient(180deg,
            transparent 0%,
            rgba(12,10,8,0.2) 15%,
            rgba(12,10,8,0.4) 30%,
            rgba(12,10,8,0.6) 45%,
            rgba(12,10,8,0.8) 60%,
            rgba(12,10,8,0.9) 75%,
            rgba(12,10,8,0.95) 90%,
            rgba(12,10,8,1) 100%
          )`,
        }}
      />

      {/* Tease roots — faint lines poking down from the grass zone */}
      <svg
        className="absolute bottom-0 left-0 right-0"
        style={{ height: "12%", opacity: 1, zIndex: 1 }}
        preserveAspectRatio="none"
        viewBox="0 0 1000 100"
      >
        <path
          d="M180,5 C178,25 170,50 165,75"
          fill="none"
          stroke="rgba(80,55,30,0.12)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M420,2 C425,30 430,55 440,85"
          fill="none"
          stroke="rgba(80,55,30,0.12)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M650,8 C645,28 640,48 632,70"
          fill="none"
          stroke="rgba(80,55,30,0.12)"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          d="M860,4 C862,22 858,45 850,65"
          fill="none"
          stroke="rgba(80,55,30,0.12)"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
      </svg>

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
