"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll } from "./ScrollContext";

interface Worm {
  // Array of segment positions [x, y]
  segments: [number, number][];
  speed: number;
  baseSpeed: number;       // original speed for hover reset
  angle: number;       // current heading
  turnRate: number;     // how much it turns
  turnTimer: number;    // time until next direction change
  thickness: number;
  color: { r: number; g: number; b: number };
  waveOffset: number;   // phase offset for body wave
  waveSpeed: number;
  depth: number;        // 0 = far back, 1 = foreground
  isQueen: boolean;     // queen worm with crown
  isGolden: boolean;    // rare golden worm
  seed: number;         // stored seed for identification
}

export default function WormPit() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wormsRef = useRef<Worm[]>([]);
  const animRef = useRef<number>(0);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const hoveredWormRef = useRef<Worm | null>(null);
  const [visible, setVisible] = useState(false);

  const { progress } = useScroll();
  const progressRef = useRef(progress);
  progressRef.current = progress;

  useEffect(() => {
    setVisible(progress > 0.45); // start showing worms earlier
  }, [progress]);

  useEffect(() => {
    if (!visible) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    // Mouse tracking for hover interaction
    function onMouseMove(e: MouseEvent) {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    }
    function onMouseLeave() {
      mouseRef.current = null;
      // Reset hovered worm speed
      if (hoveredWormRef.current) {
        hoveredWormRef.current.speed = hoveredWormRef.current.baseSpeed;
        hoveredWormRef.current = null;
      }
    }
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    // Initialize worms if empty
    if (wormsRef.current.length === 0) {
      const isMobile = window.innerWidth < 768;
      const count = Math.floor(isMobile ? window.innerWidth / 1.5 : window.innerWidth / 0.55); // ~500 on mobile, ~2600 on desktop
      for (let i = 0; i < count; i++) {
        wormsRef.current.push(createWorm(canvas.width, canvas.height, i));
      }
      // Sort by depth so deeper worms draw first (painter's algorithm)
      wormsRef.current.sort((a, b) => a.depth - b.depth);
    }

    let time = 0;

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time++;

      const worms = wormsRef.current;

      // Hover: find nearest worm to mouse and boost its speed
      const mouse = mouseRef.current;
      if (mouse) {
        let nearestDist = Infinity;
        let nearestWorm: Worm | null = null;
        for (const worm of worms) {
          const head = worm.segments[0];
          const dx = head[0] - mouse.x;
          const dy = head[1] - mouse.y;
          const dist = dx * dx + dy * dy;
          if (dist < nearestDist) {
            nearestDist = dist;
            nearestWorm = worm;
          }
        }
        // Only affect worms within 120px radius
        if (nearestWorm && nearestDist < 120 * 120) {
          // Reset previous hovered worm
          if (hoveredWormRef.current && hoveredWormRef.current !== nearestWorm) {
            hoveredWormRef.current.speed = hoveredWormRef.current.baseSpeed;
          }
          nearestWorm.speed = nearestWorm.baseSpeed * 4;
          hoveredWormRef.current = nearestWorm;
        } else {
          if (hoveredWormRef.current) {
            hoveredWormRef.current.speed = hoveredWormRef.current.baseSpeed;
            hoveredWormRef.current = null;
          }
        }
      }

      // Draw worms — count increases with scroll depth
      // At progress 0.45: ~5% of worms. At 0.65: ~40%. At 0.85+: 100%
      const p = progressRef.current;
      const densityFraction = Math.min(1, Math.max(0.03, ((p - 0.45) / 0.4) ** 1.5));
      const drawCount = Math.max(3, Math.floor(worms.length * densityFraction));

      for (let i = 0; i < worms.length; i++) {
        updateWorm(worms[i], canvas.width, canvas.height, time);
        if (i < drawCount) {
          drawWorm(ctx, worms[i], time);
        }
      }

      animRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [visible]);

  if (!visible) return null;

  // Opacity ramps up: faint at 0.45, solid at 0.85+
  const pitOpacity = Math.min(0.9, Math.max(0, (progress - 0.45) / 0.35) * 0.9);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-auto fixed inset-0 z-[4]"
      style={{ opacity: pitOpacity }}
    />
  );
}

function createWorm(w: number, h: number, seed: number): Worm {
  const isQueen = seed === 42;
  const isGolden = seed === 137;

  const segCount = 14 + Math.floor(pseudoRandom(seed * 7) * 10);
  const x = pseudoRandom(seed * 13) * w;
  // Bias Y toward the bottom — square the random to cluster low
  // Most worms end up in the bottom 40% of the screen
  const yRandom = pseudoRandom(seed * 17);
  const y = h * (yRandom * yRandom); // squared = bottom-heavy
  const angle = pseudoRandom(seed * 23) * Math.PI * 2;

  const segments: [number, number][] = [];
  for (let i = 0; i < segCount; i++) {
    segments.push([
      x - Math.cos(angle) * i * 4,
      y - Math.sin(angle) * i * 4,
    ]);
  }

  // Color: golden worm gets gold, queen and others get brownish-reds
  let color: { r: number; g: number; b: number };
  if (isGolden) {
    color = { r: 218, g: 165, b: 32 };
  } else {
    const rBase = 120 + Math.floor(pseudoRandom(seed * 29) * 80);
    const gBase = 35 + Math.floor(pseudoRandom(seed * 31) * 30);
    const bBase = 30 + Math.floor(pseudoRandom(seed * 37) * 25);
    color = { r: rBase, g: gBase, b: bBase };
  }

  // Worms near the bottom are bigger (macro view feel)
  const depthFactor = y / h; // 0 at top, 1 at bottom
  let sizeMultiplier = 0.4 + depthFactor * 3.6; // 0.4x at top, 4x at bottom — VERY fat worms at bottom

  // Queen is slightly larger
  if (isQueen) {
    sizeMultiplier *= 1.3;
  }

  // Depth layering: random depth value 0-1
  const depth = pseudoRandom(seed * 67);

  const baseSpeed = (0.08 + pseudoRandom(seed * 41) * 0.12) * sizeMultiplier;

  return {
    segments,
    speed: baseSpeed,
    baseSpeed,
    angle,
    turnRate: 0.005 + pseudoRandom(seed * 43) * 0.01, // gentle turns
    turnTimer: Math.floor(80 + pseudoRandom(seed * 47) * 200), // long between turns
    thickness: (3 + pseudoRandom(seed * 53) * 4) * sizeMultiplier,
    color,
    waveOffset: pseudoRandom(seed * 59) * Math.PI * 2,
    waveSpeed: 0.012 + pseudoRandom(seed * 61) * 0.015, // slow undulation
    depth,
    isQueen,
    isGolden,
    seed,
  };
}

function updateWorm(worm: Worm, w: number, h: number, time: number) {
  // Direction changes
  worm.turnTimer--;
  if (worm.turnTimer <= 0) {
    worm.turnRate = (Math.random() - 0.5) * 0.02; // gentle direction changes
    worm.turnTimer = 100 + Math.floor(Math.random() * 250); // long intervals
  }

  // Update heading with organic turning
  worm.angle += worm.turnRate;

  // Body wave — sinusoidal motion propagating along the body
  const waveAmp = 0.3 + worm.thickness * 0.05;
  const headWave = Math.sin(time * worm.waveSpeed + worm.waveOffset) * waveAmp;
  worm.angle += headWave * 0.02;

  // Move head
  const head = worm.segments[0];
  const newX = head[0] + Math.cos(worm.angle) * worm.speed;
  const newY = head[1] + Math.sin(worm.angle) * worm.speed;

  // Wrap around edges (worms reappear on other side)
  const margin = 50;
  worm.segments[0] = [
    ((newX + margin) % (w + margin * 2)) - margin,
    ((newY + margin) % (h + margin * 2)) - margin,
  ];

  // Each segment follows the one ahead — creates the wave propagation
  for (let i = 1; i < worm.segments.length; i++) {
    const prev = worm.segments[i - 1];
    const curr = worm.segments[i];
    const dx = prev[0] - curr[0];
    const dy = prev[1] - curr[1];
    const dist = Math.sqrt(dx * dx + dy * dy);
    const segSpacing = 3.5 + worm.thickness * 0.15;

    if (dist > segSpacing) {
      const ratio = segSpacing / dist;
      curr[0] = prev[0] - dx * ratio;
      curr[1] = prev[1] - dy * ratio;
    }

    // Add perpendicular wave to each segment (phase-delayed)
    const wavePhase = time * worm.waveSpeed + worm.waveOffset + i * 0.4;
    const perpAmp = Math.sin(wavePhase) * waveAmp * 0.5;
    const segAngle = Math.atan2(dy, dx);
    curr[0] += Math.cos(segAngle + Math.PI / 2) * perpAmp * 0.15;
    curr[1] += Math.sin(segAngle + Math.PI / 2) * perpAmp * 0.15;
  }
}

function drawWorm(ctx: CanvasRenderingContext2D, worm: Worm, time: number) {
  const segs = worm.segments;
  if (segs.length < 2) return;

  const { r, g, b } = worm.color;

  // Depth-based alpha: deeper worms (lower depth) are dimmer
  // depth 0 -> alphaMultiplier 0.5, depth 1 -> alphaMultiplier 1.0
  // Multiplied by 0.6 to reduce overall worm intensity so content stays readable
  const alphaMultiplier = 0.5 + worm.depth * 0.5; // depth layering only, no extra reduction

  // Draw body as a thick smooth path
  // Outer dark outline
  ctx.beginPath();
  ctx.moveTo(segs[0][0], segs[0][1]);
  for (let i = 1; i < segs.length; i++) {
    const prev = segs[i - 1];
    const curr = segs[i];
    const mx = (prev[0] + curr[0]) / 2;
    const my = (prev[1] + curr[1]) / 2;
    ctx.quadraticCurveTo(prev[0], prev[1], mx, my);
  }
  ctx.strokeStyle = `rgba(${Math.max(0, r - 50)}, ${Math.max(0, g - 20)}, ${Math.max(0, b - 15)}, ${0.6 * alphaMultiplier})`;
  ctx.lineWidth = worm.thickness + 2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.stroke();

  // Main body
  ctx.beginPath();
  ctx.moveTo(segs[0][0], segs[0][1]);
  for (let i = 1; i < segs.length; i++) {
    const prev = segs[i - 1];
    const curr = segs[i];
    const mx = (prev[0] + curr[0]) / 2;
    const my = (prev[1] + curr[1]) / 2;
    ctx.quadraticCurveTo(prev[0], prev[1], mx, my);
  }
  ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.8 * alphaMultiplier})`;
  ctx.lineWidth = worm.thickness;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.stroke();

  // Highlight stripe along top
  ctx.beginPath();
  ctx.moveTo(segs[0][0], segs[0][1]);
  for (let i = 1; i < segs.length; i++) {
    const prev = segs[i - 1];
    const curr = segs[i];
    const mx = (prev[0] + curr[0]) / 2;
    const my = (prev[1] + curr[1]) / 2;
    ctx.quadraticCurveTo(prev[0], prev[1], mx, my);
  }
  ctx.strokeStyle = `rgba(${Math.min(255, r + 40)}, ${Math.min(255, g + 25)}, ${Math.min(255, b + 20)}, ${0.2 * alphaMultiplier})`;
  ctx.lineWidth = worm.thickness * 0.4;
  ctx.lineCap = "round";
  ctx.stroke();

  // Segment rings — subtle darker bands
  for (let i = 2; i < segs.length - 1; i += 2) {
    const seg = segs[i];
    const prev = segs[i - 1];
    const angle = Math.atan2(seg[1] - prev[1], seg[0] - prev[0]);
    const perpX = Math.cos(angle + Math.PI / 2);
    const perpY = Math.sin(angle + Math.PI / 2);
    const halfW = worm.thickness * 0.4;

    ctx.beginPath();
    ctx.moveTo(seg[0] + perpX * halfW, seg[1] + perpY * halfW);
    ctx.lineTo(seg[0] - perpX * halfW, seg[1] - perpY * halfW);
    ctx.strokeStyle = `rgba(${Math.max(0, r - 30)}, ${Math.max(0, g - 10)}, ${Math.max(0, b - 8)}, ${0.25 * alphaMultiplier})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Queen crown: 3 small golden triangles above the head
  if (worm.isQueen) {
    drawCrown(ctx, worm);
  }
}

function drawCrown(ctx: CanvasRenderingContext2D, worm: Worm) {
  const segs = worm.segments;
  const head = segs[0];
  const next = segs[1];

  // Direction the worm is facing
  const headAngle = Math.atan2(head[1] - next[1], head[0] - next[0]);
  // Crown sits perpendicular to the body, on top of the head
  const crownUp = headAngle - Math.PI / 2;

  const crownBase = worm.thickness * 0.8;
  const crownHeight = worm.thickness * 1.2;

  // Base center of crown: offset from head center in the "up" direction
  const baseX = head[0] + Math.cos(crownUp) * worm.thickness * 0.5;
  const baseY = head[1] + Math.sin(crownUp) * worm.thickness * 0.5;

  // Perpendicular to crownUp for spreading the triangles
  const perpAngle = crownUp + Math.PI / 2;

  ctx.save();
  ctx.fillStyle = "rgba(255, 215, 0, 0.6)"; // #FFD700 at 0.6 opacity

  // Draw 3 small triangles (left, center, right)
  const offsets = [-1, 0, 1];
  for (const offset of offsets) {
    const spread = offset * crownBase * 0.5;
    const triBaseX = baseX + Math.cos(perpAngle) * spread;
    const triBaseY = baseY + Math.sin(perpAngle) * spread;

    const tipX = triBaseX + Math.cos(crownUp) * crownHeight;
    const tipY = triBaseY + Math.sin(crownUp) * crownHeight;

    const halfBase = crownBase * 0.25;
    const leftX = triBaseX + Math.cos(perpAngle) * halfBase;
    const leftY = triBaseY + Math.sin(perpAngle) * halfBase;
    const rightX = triBaseX - Math.cos(perpAngle) * halfBase;
    const rightY = triBaseY - Math.sin(perpAngle) * halfBase;

    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(leftX, leftY);
    ctx.lineTo(rightX, rightY);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}

function pseudoRandom(seed: number): number {
  return ((Math.sin(seed * 127.1 + 311.7) * 43758.5453) % 1 + 1) % 1;
}
