"use client";

import { useScroll } from "./ScrollContext";

// ═══════════════════════════════════════════════════════════════
// THE EARTH — Continuous color field with 40+ control points
// and cubic Hermite interpolation. Film-quality color grading.
// ═══════════════════════════════════════════════════════════════

// Color control points: [progress, r, g, b]
// Tuned by hand for imperceptible transitions
const COLOR_STOPS: [number, number, number, number][] = [
  // Earth starts as near-black warm brown — NO BLUE
  // The SurfaceScene handles the sky appearance; when it fades, this is what's behind
  [0.00, 12, 10, 8],     // near-black warm brown
  [0.01, 12, 10, 8],     // hold through sky crossfade
  [0.03, 14, 11, 8],     // barely warming
  [0.05, 14, 12, 9],     // still very dark
  [0.07, 16, 12, 10],    // hint of warmth
  [0.09, 16, 14, 10],    // dark earth
  [0.10, 18, 14, 10],    // earth tone established
  // Surface / straw zone — warm browns
  [0.12, 20, 16, 12],    // soil emerging
  [0.13, 22, 16, 12],    // warming
  [0.14, 24, 18, 14],    // amber hint
  [0.15, 28, 20, 14],    // straw zone — muted
  [0.16, 30, 22, 14],    // warm brown — still dark
  [0.17, 32, 22, 14],    // peak — subtle, not bright
  [0.18, 30, 22, 14],    // holding
  [0.19, 28, 20, 12],    // fading
  [0.20, 26, 18, 12],    // cooling
  // Topsoil — dark browns, subtle
  [0.22, 24, 18, 12],    // transition
  [0.24, 24, 16, 10],    // topsoil begins
  [0.26, 22, 16, 10],    // mid topsoil
  [0.28, 22, 14, 10],    // perlite zone
  [0.30, 20, 14, 10],    // deepening
  [0.32, 20, 14, 8],     // richer
  [0.34, 18, 12, 8],     // transition
  // Living soil — deep rich brown
  [0.36, 24, 16, 10],    // living soil begins
  [0.38, 22, 14, 8],     // rich
  [0.40, 20, 14, 8],     // deeper
  [0.42, 18, 12, 8],     // core living soil
  [0.44, 16, 12, 8],     // dark and rich
  [0.46, 16, 10, 7],     // deepening
  [0.48, 14, 10, 7],     // continuous
  [0.50, 14, 10, 6],     // mid-depth
  // Deep soil
  [0.53, 20, 13, 8],     // transition
  [0.56, 18, 12, 7],     // deep zone
  [0.59, 17, 11, 7],     // darker
  [0.62, 16, 10, 6],     // approaching colony
  [0.65, 14, 10, 6],     // deep
  [0.68, 14, 9, 5],      // very deep
  // Colony zone — stay VISIBLE dark brown, not black
  [0.72, 18, 12, 8],     // colony begins — rich dark earth
  [0.76, 16, 11, 7],     // darker but still brown
  [0.80, 14, 10, 6],     // deep earth brown
  [0.84, 13, 9, 6],      // getting darker
  [0.88, 12, 8, 5],      // very deep — still visibly brown
  [0.92, 11, 8, 5],      // deepest visible brown
  [0.96, 10, 7, 4],      // near bottom
  [1.00, 9, 6, 4],       // the bottom — dark but NOT black
];

// Cubic Hermite interpolation for ultra-smooth transitions
function hermite(t: number): number {
  // Smoothstep: 3t² - 2t³
  return t * t * (3 - 2 * t);
}

export function getEarthColor(progress: number): string {
  // Find the two surrounding stops
  let i = 0;
  for (; i < COLOR_STOPS.length - 1; i++) {
    if (progress <= COLOR_STOPS[i + 1][0]) break;
  }
  i = Math.min(i, COLOR_STOPS.length - 2);

  const [p0, r0, g0, b0] = COLOR_STOPS[i];
  const [p1, r1, g1, b1] = COLOR_STOPS[i + 1];

  // Normalized position between the two stops
  const range = p1 - p0;
  const t = range > 0 ? hermite((progress - p0) / range) : 0;

  const r = Math.round(r0 + (r1 - r0) * t);
  const g = Math.round(g0 + (g1 - g0) * t);
  const b = Math.round(b0 + (b1 - b0) * t);

  return `rgb(${r},${g},${b})`;
}

// Gaussian opacity curve — smooth bell curve centered at `peak`
function gaussian(progress: number, peak: number, sigma: number): number {
  const diff = progress - peak;
  return Math.exp(-(diff * diff) / (2 * sigma * sigma));
}

// One-directional ramp — fades in and stays
function rampIn(progress: number, start: number, full: number): number {
  if (progress <= start) return 0;
  if (progress >= full) return 1;
  return hermite((progress - start) / (full - start));
}

export default function UndergroundJourney() {
  const { progress } = useScroll();

  // Freeze the earth depth during horizontal Grow section (~0.25-0.45 progress)
  // The worm is going sideways, not deeper — same soil layer throughout
  const growStart = 0.25;
  const growEnd = 0.45;
  const adjustedEarthProgress = progress <= growStart
    ? progress
    : progress >= growEnd
      ? progress - (growEnd - growStart) + (growEnd - growStart) * 0 // resume after freeze
      : growStart; // frozen at growStart depth

  // Remap post-grow progress so it smoothly continues from the frozen point
  const earthProgress = progress <= growStart
    ? progress
    : progress >= growEnd
      ? growStart + (progress - growEnd) // skip the grow range
      : growStart; // frozen

  const bgColor = getEarthColor(earthProgress);

  // Texture layer opacities — use earthProgress (frozen during Grow)
  const strawOpacity = gaussian(earthProgress, 0.16, 0.05) * 0.7;
  const perliteOpacity = gaussian(earthProgress, 0.26, 0.07) * 0.65;
  const rootOpacity = gaussian(earthProgress, 0.42, 0.10) * 0.3;
  const deepVignette = rampIn(earthProgress, 0.65, 0.85) * 0.5;

  return (
    <div className="pointer-events-none fixed inset-0 z-[2]">
      {/* Continuous color field */}
      <div className="absolute inset-0" style={{ backgroundColor: bgColor }} />

      {/* === TOPSOIL / MULCH LAYER — visible straw-like texture === */}
      <div
        className="absolute inset-0"
        style={{ opacity: strawOpacity }}
      >
        {/* Warm amber base wash */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at 50% 50%, rgba(140,110,50,0.4) 0%, rgba(100,75,30,0.2) 50%, transparent 80%)",
          }}
        />
        {/* Straw/mulch fibers — short, subtle, scattered */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="none">
          {Array.from({ length: 50 }, (_, i) => {
            const x = (i * 29 + 10) % 1440;
            const y = 150 + (i * 31 + 15) % 600;
            const angle = -20 + (i % 10) * 4;
            const len = 8 + (i % 5) * 6; // shorter fibers
            const rad = (angle * Math.PI) / 180;
            return (
              <line
                key={i}
                x1={x} y1={y}
                x2={x + len * Math.cos(rad)} y2={y + len * Math.sin(rad)}
                stroke={i % 3 === 0 ? "#B89848" : "#9A8038"}
                strokeWidth={0.8 + (i % 3) * 0.4}
                opacity={0.2 + (i % 4) * 0.05}
                strokeLinecap="round"
              />
            );
          })}
        </svg>
      </div>

      {/* === PERLITE LAYER — white chunks mixed into brown soil === */}
      <div
        className="absolute inset-0"
        style={{ opacity: perliteOpacity }}
      >
        {/* Soil darkening wash for this layer */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at 50% 50%, rgba(80,55,30,0.25) 0%, transparent 70%)",
          }}
        />
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="none">
          {/* Perlite speckles — small white dots, not blobs */}
          {Array.from({ length: 120 }, (_, i) => {
            const x = (i * 12 + 5) % 1440;
            const y = (i * 17 + 3) % 900;
            const r = 0.8 + (i % 4) * 0.6;
            return (
              <circle
                key={i}
                cx={x} cy={y} r={r}
                fill={i % 3 === 0 ? "rgba(250,245,235,0.6)" : "rgba(235,225,210,0.4)"}
              />
            );
          })}
          {/* Larger perlite chunks — still small, just slightly bigger */}
          {Array.from({ length: 20 }, (_, i) => {
            const x = (i * 73 + 30) % 1440;
            const y = (i * 47 + 20) % 900;
            return (
              <ellipse
                key={`chunk-${i}`}
                cx={x} cy={y}
                rx={1.8 + (i % 3) * 1}
                ry={2 + (i % 3) * 2}
                fill={i % 2 === 0 ? "rgba(245,240,225,0.4)" : "rgba(230,220,200,0.3)"}
                transform={`rotate(${(i * 31) % 180} ${x} ${y})`}
              />
            );
          })}
          {/* Small dark soil particles between perlite */}
          {Array.from({ length: 40 }, (_, i) => {
            const x = (i * 37 + 18) % 1440;
            const y = (i * 23 + 9) % 900;
            return (
              <circle
                key={`soil-${i}`}
                cx={x} cy={y}
                r={1 + (i % 3) * 0.8}
                fill={`rgba(60,40,20,${0.2 + (i % 4) * 0.08})`}
              />
            );
          })}
        </svg>
      </div>

      {/* === ROOT NETWORK — visible in living soil zone === */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ opacity: rootOpacity }}
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
      >
        <g stroke="#7A5A30" fill="none" strokeLinecap="round">
          {/* Main taproot */}
          <path d="M720,0 C710,150 730,300 715,450 C700,600 725,750 720,900" strokeWidth="5" opacity="0.6" />
          {/* Primary branches */}
          <path d="M720,120 C620,180 500,170 380,210" strokeWidth="3.5" opacity="0.5" />
          <path d="M720,120 C820,180 940,170 1060,210" strokeWidth="3.5" opacity="0.5" />
          <path d="M715,300 C600,340 460,320 320,370" strokeWidth="3" opacity="0.45" />
          <path d="M715,300 C830,340 980,320 1120,370" strokeWidth="3" opacity="0.45" />
          <path d="M718,500 C640,540 520,530 400,570" strokeWidth="2.5" opacity="0.35" />
          <path d="M718,500 C800,540 920,530 1040,570" strokeWidth="2.5" opacity="0.35" />
          {/* Secondary branches */}
          <path d="M380,210 C320,240 260,230 180,260" strokeWidth="2" opacity="0.3" />
          <path d="M1060,210 C1120,240 1180,230 1260,260" strokeWidth="2" opacity="0.3" />
          <path d="M320,370 C260,400 180,390 100,420" strokeWidth="1.5" opacity="0.25" />
          <path d="M1120,370 C1180,400 1260,390 1340,420" strokeWidth="1.5" opacity="0.25" />
          {/* Fine root hairs */}
          <path d="M180,260 C150,280 120,275 80,300" strokeWidth="1" opacity="0.2" />
          <path d="M1260,260 C1290,280 1320,275 1360,300" strokeWidth="1" opacity="0.2" />
          <path d="M400,570 C340,600 280,590 200,620" strokeWidth="1" opacity="0.2" />
          <path d="M1040,570 C1100,600 1160,590 1240,620" strokeWidth="1" opacity="0.2" />
        </g>
        {/* Mycorrhizal network dots — fungal connections */}
        {Array.from({ length: 15 }, (_, i) => {
          const x = 200 + (i * 97) % 1040;
          const y = 200 + (i * 67) % 500;
          return (
            <circle key={`myc-${i}`} cx={x} cy={y} r={2 + (i % 3)} fill="rgba(120,90,50,0.15)" />
          );
        })}
      </svg>

      {/* === DEEP VIGNETTE === */}
      <div
        className="absolute inset-0"
        style={{
          opacity: deepVignette,
          background: "radial-gradient(ellipse at 50% 50%, transparent 15%, rgba(5,3,2,0.6) 85%)",
        }}
      />

      {/* Worms are rendered by WormPit canvas component */}
    </div>
  );
}
