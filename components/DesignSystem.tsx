"use client";

/**
 * ═══════════════════════════════════════════════════════════════
 * WURMZ DESIGN SYSTEM
 *
 * Centralized constants, functions, and components that ENFORCE
 * the canonical design rules. Import from here instead of
 * hardcoding values. If a value isn't here, it shouldn't be
 * in the codebase.
 * ═══════════════════════════════════════════════════════════════
 */

// ─────────────────────────────────────────────────────────────
// RULE: Warm browns, NEVER olive/green (R > G > B always)
// All earth colors must pass this test
// ─────────────────────────────────────────────────────────────

export const EARTH_COLORS = {
  /** Near-black earth — deepest underground */
  abyss: "rgb(8,6,4)",
  /** Very deep soil */
  deep: "rgb(12,10,8)",
  /** Dark living soil */
  living: "rgb(18,14,10)",
  /** Rich topsoil */
  topsoil: "rgb(24,18,14)",
  /** Warm straw-tinted surface */
  surface: "rgb(32,22,14)",
  /** Peak straw/mulch warmth (brief) */
  straw: "rgb(38,26,16)",
} as const;

export const BRAND_COLORS = {
  crimson: "#E63462",
  violet: "#8B5CF6",
  mycelium: "#F5F0E8",
  deepEarth: "#1E1710",
  rootBrown: "#3D2B1F",
  soilBlack: "#110D08",
} as const;

/** Validate that a color follows R > G > B (warm brown rule) */
export function isWarmBrown(r: number, g: number, b: number): boolean {
  return r >= g && g >= b;
}

// ─────────────────────────────────────────────────────────────
// RULE: Gaussian opacity curves for all texture layers
// Never use if/else for opacity — always continuous math
// ─────────────────────────────────────────────────────────────

/** Smooth bell curve centered at `peak` */
export function gaussian(progress: number, peak: number, sigma: number): number {
  const diff = progress - peak;
  return Math.exp(-(diff * diff) / (2 * sigma * sigma));
}

/** Smooth ramp from 0 to 1 */
export function rampIn(progress: number, start: number, full: number): number {
  if (progress <= start) return 0;
  if (progress >= full) return 1;
  const t = (progress - start) / (full - start);
  return t * t * (3 - 2 * t); // hermite smoothstep
}

/** Cubic Hermite interpolation — smoother than linear */
export function hermite(t: number): number {
  return t * t * (3 - 2 * t);
}

// ─────────────────────────────────────────────────────────────
// RULE: Scroll zones — what's visible at each depth
// Single source of truth for when things appear/disappear
// ─────────────────────────────────────────────────────────────

export const SCROLL_ZONES = {
  /** Sky scene visible */
  sky: { start: 0, fadeEnd: 0.15 },
  /** Plane visible */
  plane: { start: 0, fadeEnd: 0.08 },
  /** Parachute worm descending */
  parachute: { start: 0, landAt: 0.12 },
  /** Straw/mulch texture */
  straw: { peak: 0.16, sigma: 0.05 },
  /** Perlite speckles */
  perlite: { peak: 0.26, sigma: 0.07 },
  /** Horizontal grow section — DEPTH FROZEN here */
  growFreeze: { start: 0.25, end: 0.45 },
  /** Root network */
  roots: { peak: 0.42, sigma: 0.10 },
  /** Tunnel worm visible */
  tunnel: { start: 0.12, fadeStart: 0.75, fadeEnd: 0.90 },
  /** Worm colony begins */
  colony: { start: 0.45, fullDensity: 0.90 },
  /** Buried artifacts zone */
  artifacts: { earliest: 0.20, latest: 0.95 },
} as const;

// ─────────────────────────────────────────────────────────────
// RULE: Content cards — always readable, consistent styling
// ─────────────────────────────────────────────────────────────

/** Standard content card classes — enforces readability */
export const CARD_CLASSES = "relative bg-deep-earth/95 backdrop-blur-sm p-5 md:p-10";

/** Standard card border style — sewer grate aesthetic */
export const CARD_STYLE = {
  border: "3px solid rgba(80,65,50,0.6)",
  boxShadow: "inset 0 0 20px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.35)",
} as const;

// ─────────────────────────────────────────────────────────────
// RULE: Worm character — consistent across all states
// ─────────────────────────────────────────────────────────────

export const WORM = {
  gradient: {
    start: "#7A2818",
    mid: "#C43A3A",
    end: "#8B2020",
  },
  outline: {
    color: "rgba(40,12,8,0.7)",
    width: 2.5,
  },
  segments: {
    color: "rgba(60,15,10,0.2)",
    width: 1.5,
  },
  eye: {
    fill: "#1a0a05",
    shine: "rgba(255,255,255,0.5)",
  },
  eyelid: "rgba(140,35,25,0.6)",
  joint: {
    paper: "#C8B088",
    filter: "#A08050",
    cherry: "#D4641A",
    cherryGlow: "#F0A030",
    cherryHot: "#FFD080",
  },
} as const;

// ─────────────────────────────────────────────────────────────
// RULE: Performance budget
// ─────────────────────────────────────────────────────────────

export const PERFORMANCE = {
  worms: {
    desktop: 150,
    mobile: 40,
    segmentsPerWorm: { min: 8, max: 14 },
    drawPasses: 2, // outline + body only
  },
  /** Breakpoint for mobile detection */
  mobileBreakpoint: 768,
} as const;

// ─────────────────────────────────────────────────────────────
// RULE: Z-index stack — single source of truth
// ─────────────────────────────────────────────────────────────

export const Z = {
  grungeTexture: 1,
  earth: 2,
  soilBiology: 2,
  wormTunnel: 3,
  wormColony: 4,
  buriedArtifacts: 5,
  surfaceScene: 7,
  parachuteWorm: 8,
  planeIntro: 15,
  content: 20,
  grainOverlay: 50,
  dropClock: 100,
  cinematicMode: 100,
} as const;

// ─────────────────────────────────────────────────────────────
// HELPER: Deterministic pseudo-random (no Math.random in render)
// ─────────────────────────────────────────────────────────────

export function pseudoRandom(seed: number): number {
  return ((Math.sin(seed * 127.1 + 311.7) * 43758.5453) % 1 + 1) % 1;
}

// ─────────────────────────────────────────────────────────────
// COMPONENT: Corner bolts for sewer grate styling
// ─────────────────────────────────────────────────────────────

export function CornerBolts() {
  return (
    <>
      <div className="absolute top-2 left-2 w-2.5 h-2.5 rounded-full bg-root-brown/50 border border-root-brown/30" />
      <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-root-brown/50 border border-root-brown/30" />
      <div className="absolute bottom-2 left-2 w-2.5 h-2.5 rounded-full bg-root-brown/50 border border-root-brown/30" />
      <div className="absolute bottom-2 right-2 w-2.5 h-2.5 rounded-full bg-root-brown/50 border border-root-brown/30" />
    </>
  );
}

/** Subtle grate line pattern overlay */
export function GrateLines() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        opacity: 0.04,
        backgroundImage:
          "repeating-linear-gradient(0deg, transparent, transparent 18px, rgba(80,65,50,0.8) 18px, rgba(80,65,50,0.8) 19px)",
      }}
    />
  );
}
