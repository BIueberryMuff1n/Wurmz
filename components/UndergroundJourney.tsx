"use client";

import { useScroll } from "./ScrollContext";

// ═══════════════════════════════════════════════════════════════
// THE EARTH — Continuous color field with 40+ control points
// and cubic Hermite interpolation. Film-quality color grading.
// ═══════════════════════════════════════════════════════════════

// Color control points: [progress, r, g, b]
// Tuned by hand for imperceptible transitions
const COLOR_STOPS: [number, number, number, number][] = [
  // Sky zone — must exactly match SurfaceScene gradient bottom (#0a0f1a = rgb(10,15,26))
  [0.00, 10, 15, 26],    // deep night sky — exact match to SurfaceScene bottom
  [0.01, 10, 15, 26],    // hold sky color through crossfade zone
  [0.03, 12, 17, 28],    // barely shifting
  [0.05, 16, 20, 30],    // sky transitioning
  [0.07, 20, 22, 32],    // transitional — blue-toned, no purple
  [0.09, 18, 18, 28],    // dusk hint — still dark
  [0.10, 18, 16, 24],    // dusk meets earth — very subtle
  // Surface / straw zone — SUBTLE warm browns, stay dark
  [0.12, 20, 16, 18],    // first soil hint — barely visible
  [0.13, 22, 16, 16],    // warming slowly
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
  // Colony zone
  [0.72, 12, 8, 5],      // colony begins
  [0.76, 11, 8, 4],      // dense dark
  [0.80, 10, 7, 4],      // deeper
  [0.84, 9, 6, 4],       // near bottom
  [0.88, 8, 6, 3],       // almost black
  [0.92, 7, 5, 3],       // deepest
  [0.96, 6, 4, 3],       // near absolute
  [1.00, 5, 3, 2],       // the bottom
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

  const bgColor = getEarthColor(progress);

  // Texture layer opacities — gaussian curves centered at their zone
  const strawOpacity = gaussian(progress, 0.17, 0.04) * 0.35;
  const perliteOpacity = gaussian(progress, 0.28, 0.06) * 0.4;
  const rootOpacity = gaussian(progress, 0.44, 0.08) * 0.12;
  const deepVignette = rampIn(progress, 0.65, 0.85) * 0.5;

  return (
    <div className="pointer-events-none fixed inset-0 z-[2]">
      {/* Continuous color field */}
      <div className="absolute inset-0" style={{ backgroundColor: bgColor }} />

      {/* === STRAW / MULCH TEXTURE === */}
      <div
        className="absolute inset-0"
        style={{ opacity: strawOpacity }}
      >
        {/* Warm amber wash */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at 50% 50%, rgba(160,135,80,0.25) 0%, transparent 70%)",
          }}
        />
        {/* Straw fibers */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="none">
          {Array.from({ length: 35 }, (_, i) => {
            const x = (i * 41 + 15) % 1440;
            const y = 150 + (i * 29 + 7) % 600;
            const angle = -20 + (i % 9) * 5;
            const len = 25 + (i % 5) * 12;
            const rad = (angle * Math.PI) / 180;
            return (
              <line
                key={i}
                x1={x} y1={y}
                x2={x + len * Math.cos(rad)} y2={y + len * Math.sin(rad)}
                stroke={i % 3 === 0 ? "#C4A55A" : "#A8903C"}
                strokeWidth={1 + (i % 3) * 0.4}
                opacity={0.25 + (i % 4) * 0.08}
                strokeLinecap="round"
              />
            );
          })}
        </svg>
      </div>

      {/* === PERLITE / TOPSOIL TEXTURE === */}
      <div
        className="absolute inset-0"
        style={{ opacity: perliteOpacity }}
      >
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="none">
          {/* Perlite speckles — white dots */}
          {Array.from({ length: 50 }, (_, i) => {
            const x = (i * 47 + 23) % 1440;
            const y = (i * 31 + 11) % 900;
            const r = 1.2 + (i % 4) * 1;
            return (
              <circle
                key={i}
                cx={x} cy={y} r={r}
                fill={i % 5 === 0 ? "rgba(240,235,220,0.3)" : "rgba(220,210,190,0.2)"}
              />
            );
          })}
          {/* Larger perlite chunks */}
          {Array.from({ length: 12 }, (_, i) => {
            const x = (i * 97 + 50) % 1440;
            const y = (i * 67 + 30) % 900;
            return (
              <ellipse
                key={`chunk-${i}`}
                cx={x} cy={y}
                rx={2.5 + (i % 3) * 1.5}
                ry={2 + (i % 2) * 1}
                fill="rgba(235,225,205,0.18)"
                transform={`rotate(${(i * 30) % 180} ${x} ${y})`}
              />
            );
          })}
        </svg>
      </div>

      {/* === ROOT NETWORK === */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ opacity: rootOpacity }}
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
      >
        <g stroke="#654321" fill="none" strokeLinecap="round">
          <path d="M720,0 C710,150 730,300 715,450 C700,600 725,750 720,900" strokeWidth="3.5" opacity="0.5" />
          <path d="M720,150 C650,200 550,180 450,220" strokeWidth="2" opacity="0.35" />
          <path d="M720,150 C790,200 890,180 990,220" strokeWidth="2" opacity="0.35" />
          <path d="M715,350 C630,380 520,360 400,400" strokeWidth="1.5" opacity="0.25" />
          <path d="M715,350 C800,380 920,360 1040,400" strokeWidth="1.5" opacity="0.25" />
          <path d="M450,220 C400,250 350,240 300,270" strokeWidth="1" opacity="0.2" />
          <path d="M990,220 C1040,250 1090,240 1140,270" strokeWidth="1" opacity="0.2" />
        </g>
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
