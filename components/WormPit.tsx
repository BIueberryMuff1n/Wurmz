"use client";

import { useEffect, useRef } from "react";
import { useScroll } from "./ScrollContext";
import { gaussian, rampIn } from "./DesignSystem";

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

  // 0-A: no visible state — always mounted, opacity drives visibility
  const { progress, scrollY } = useScroll();
  const progressRef = useRef(progress);
  progressRef.current = progress;
  const scrollYRef = useRef(scrollY);
  scrollYRef.current = scrollY;

  // 0-A: gaussian opacity curve — no hard gate, no sudden appearance
  const pitOpacity =
    gaussian(progress, 0.75, 0.18) * 0.85 +
    rampIn(progress, 0.40, 0.55) * 0.10;

  useEffect(() => {
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

    // Mouse tracking — store page-space coords for worm hover detection
    function onMouseMove(e: MouseEvent) {
      mouseRef.current = { x: e.clientX, y: e.clientY + scrollYRef.current };
    }
    function onMouseLeave() {
      mouseRef.current = null;
      if (hoveredWormRef.current) {
        hoveredWormRef.current.speed = hoveredWormRef.current.baseSpeed;
        hoveredWormRef.current = null;
      }
    }
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    // Initialize worms using full page height for world-space placement
    if (wormsRef.current.length === 0) {
      const isMobile = window.innerWidth < 768;
      const count = Math.floor(isMobile ? 40 : 150);
      const pageH = document.documentElement.scrollHeight;
      for (let i = 0; i < count; i++) {
        wormsRef.current.push(createWorm(window.innerWidth, pageH, i));
      }
      wormsRef.current.sort((a, b) => a.depth - b.depth);
    }

    let time = 0;

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time++;

      const p = progressRef.current;

      // Soil texture in viewport space (before page translation)
      if (p > 0.6) {
        const soilAlpha = Math.min(0.15, (p - 0.6) / 0.3 * 0.15);
        for (let s = 0; s < 30; s++) {
          const sx = pseudoRandom(s * 13 + time * 0.001) * canvas.width;
          const sy = pseudoRandom(s * 17 + 500) * canvas.height;
          const sr = 1 + pseudoRandom(s * 23) * 3;
          ctx.beginPath();
          ctx.arc(sx, sy, sr, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(30,22,14,${soilAlpha})`;
          ctx.fill();
        }
        for (let s = 0; s < 8; s++) {
          const cx = pseudoRandom(s * 31 + 200) * canvas.width;
          const cy = pseudoRandom(s * 37 + 200) * canvas.height;
          ctx.beginPath();
          ctx.ellipse(cx, cy, 4 + pseudoRandom(s * 41) * 6, 2 + pseudoRandom(s * 43) * 4, pseudoRandom(s * 47) * Math.PI, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(25,18,10,${soilAlpha * 0.7})`;
          ctx.fill();
        }
      }

      // 0-D: translate to page space — worms exist at fixed page coordinates and scroll with content
      ctx.save();
      ctx.translate(0, -scrollYRef.current);

      const worms = wormsRef.current;
      const pageH = document.documentElement.scrollHeight;

      // Hover check in page-space coords
      const mouse = mouseRef.current;
      if (mouse && time % 5 === 0) {
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
        if (nearestWorm && nearestDist < 120 * 120) {
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

      // 0-B: smooth density ramp — no if/else gate, continuous from 0.45 to full at 0.95
      const densityFraction = Math.pow(rampIn(p, 0.45, 0.95), 2.0);
      const drawCount = Math.max(3, Math.floor(worms.length * densityFraction));

      // DEPTH COMPOSITING: back worms → embedded objects → front worms

      // Pass 1: Update all visible worms
      for (let i = 0; i < drawCount; i++) {
        updateWorm(worms[i], canvas.width, pageH, time);
      }

      // Pass 2: Draw BACK layer worms (depth < 0.5 — dimmer, behind everything)
      for (let i = 0; i < drawCount; i++) {
        if (worms[i].depth < 0.5) {
          drawWorm(ctx, worms[i], time);
        }
      }

      // Pass 3: Draw embedded objects at fixed page position
      if (p > 0.75) {
        const blockOpacity = Math.min(0.3, (p - 0.75) / 0.15 * 0.3);
        drawConcreteBlock(ctx, canvas.width * 0.72, pageH * 0.88, blockOpacity);
      }

      // Pass 4: Draw FRONT layer worms (depth >= 0.5 — brighter, in front)
      for (let i = 0; i < drawCount; i++) {
        if (worms[i].depth >= 0.5) {
          drawWorm(ctx, worms[i], time);
        }
      }

      ctx.restore();
      animRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  // 0-A: always render canvas, use display:none below threshold to avoid layout cost
  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-auto fixed inset-0 z-[4]"
      style={{
        opacity: pitOpacity,
        display: pitOpacity < 0.002 ? "none" : undefined,
      }}
    />
  );
}

function createWorm(w: number, h: number, seed: number): Worm {
  const isQueen = seed === 42;
  const isGolden = seed === 137;

  const segCount = 10 + Math.floor(pseudoRandom(seed * 7) * 4);
  const x = pseudoRandom(seed * 13) * w;

  // 0-C: bottom-heavy distribution — mass concentrated in lower portion of page
  // Math.pow(r, 0.4) maps uniform random to a distribution heavy near r=1 (bottom)
  const yRandom = pseudoRandom(seed * 17);
  const y = h * (0.15 + Math.pow(yRandom, 0.4) * 0.85);

  const angle = pseudoRandom(seed * 23) * Math.PI * 2;

  const segments: [number, number][] = [];
  for (let i = 0; i < segCount; i++) {
    segments.push([
      x - Math.cos(angle) * i * 4,
      y - Math.sin(angle) * i * 4,
    ]);
  }

  let color: { r: number; g: number; b: number };
  if (isGolden) {
    color = { r: 218, g: 165, b: 32 };
  } else {
    const rBase = 140 + Math.floor(pseudoRandom(seed * 29) * 60);
    const gBase = 30 + Math.floor(pseudoRandom(seed * 31) * 25);
    const bBase = 20 + Math.floor(pseudoRandom(seed * 37) * 20);
    color = { r: rBase, g: gBase, b: bBase };
  }

  const depthFactor = y / h;
  let sizeMultiplier = 0.4 + depthFactor * 3.6;
  if (isQueen) sizeMultiplier *= 1.3;

  const depth = pseudoRandom(seed * 67);
  const baseSpeed = (0.02 + pseudoRandom(seed * 41) * 0.04) * sizeMultiplier;

  return {
    segments,
    speed: baseSpeed,
    baseSpeed,
    angle,
    turnRate: 0.005 + pseudoRandom(seed * 43) * 0.01,
    turnTimer: Math.floor(80 + pseudoRandom(seed * 47) * 200),
    thickness: (3 + pseudoRandom(seed * 53) * 4) * sizeMultiplier,
    color,
    waveOffset: pseudoRandom(seed * 59) * Math.PI * 2,
    waveSpeed: 0.012 + pseudoRandom(seed * 61) * 0.015,
    depth,
    isQueen,
    isGolden,
    seed,
  };
}

function updateWorm(worm: Worm, w: number, h: number, time: number) {
  worm.turnTimer--;
  if (worm.turnTimer <= 0) {
    // 0-E: deterministic pseudoRandom — no Math.random() in animation loop
    const r1 = pseudoRandom(worm.seed * 91 + time * 0.01);
    const r2 = pseudoRandom(worm.seed * 113 + time * 0.013);
    worm.turnRate = (r1 - 0.5) * 0.02;
    worm.turnTimer = 100 + Math.floor(r2 * 250);
  }

  worm.angle += worm.turnRate;

  const waveAmp = 0.3 + worm.thickness * 0.05;
  const headWave = Math.sin(time * worm.waveSpeed + worm.waveOffset) * waveAmp;
  worm.angle += headWave * 0.02;

  const head = worm.segments[0];
  const newX = head[0] + Math.cos(worm.angle) * worm.speed;
  const newY = head[1] + Math.sin(worm.angle) * worm.speed;

  const margin = 50;
  let finalX = ((newX + margin) % (w + margin * 2)) - margin;
  let finalY = newY;

  // 3-A: gravity well — worms above upper boundary are nudged downward, no teleport
  const upperBoundary = h * 0.18;
  if (finalY < upperBoundary) {
    const pressure = (upperBoundary - finalY) / upperBoundary;
    worm.angle += (Math.PI / 2 - worm.angle) * pressure * 0.04;
  }
  // Only wrap at the very bottom — bottom edge is the floor
  if (finalY > h + margin) finalY = h * 0.2;

  worm.segments[0] = [finalX, finalY];

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

  const alphaMultiplier = 0.5 + worm.depth * 0.5;

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

  // Highlight — thin lighter stroke for 3D roundness
  ctx.beginPath();
  ctx.moveTo(segs[0][0], segs[0][1]);
  for (let i = 1; i < segs.length; i++) {
    const prev = segs[i - 1];
    const curr = segs[i];
    const mx = (prev[0] + curr[0]) / 2;
    const my = (prev[1] + curr[1]) / 2;
    ctx.quadraticCurveTo(prev[0], prev[1], mx, my);
  }
  ctx.strokeStyle = `rgba(${Math.min(255, r + 50)}, ${Math.min(255, g + 30)}, ${Math.min(255, b + 25)}, ${0.2 * alphaMultiplier})`;
  ctx.lineWidth = worm.thickness * 0.35;
  ctx.lineCap = "round";
  ctx.stroke();

  // Segment rings — only for thicker worms (performance: skip thin ones)
  if (worm.thickness > 6) {
    for (let i = 2; i < segs.length - 1; i += 3) {
      const seg = segs[i];
      const prev = segs[i - 1];
      const angle = Math.atan2(seg[1] - prev[1], seg[0] - prev[0]);
      const perpX = Math.cos(angle + Math.PI / 2);
      const perpY = Math.sin(angle + Math.PI / 2);
      const halfW = worm.thickness * 0.35;
      ctx.beginPath();
      ctx.moveTo(seg[0] + perpX * halfW, seg[1] + perpY * halfW);
      ctx.lineTo(seg[0] - perpX * halfW, seg[1] - perpY * halfW);
      ctx.strokeStyle = `rgba(${Math.max(0, r - 30)}, ${Math.max(0, g - 10)}, ${Math.max(0, b - 8)}, ${0.2 * alphaMultiplier})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }
  }

  if (worm.isQueen) {
    drawCrown(ctx, worm);
  }

  // suppress unused param warning — time available for future animated effects
  void time;
}

function drawCrown(ctx: CanvasRenderingContext2D, worm: Worm) {
  const segs = worm.segments;
  const head = segs[0];
  const next = segs[1];

  const headAngle = Math.atan2(head[1] - next[1], head[0] - next[0]);
  const crownUp = headAngle - Math.PI / 2;

  const crownBase = worm.thickness * 0.8;
  const crownHeight = worm.thickness * 1.2;

  const baseX = head[0] + Math.cos(crownUp) * worm.thickness * 0.5;
  const baseY = head[1] + Math.sin(crownUp) * worm.thickness * 0.5;

  const perpAngle = crownUp + Math.PI / 2;

  ctx.save();
  ctx.fillStyle = "rgba(255, 215, 0, 0.6)";

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

function drawConcreteBlock(ctx: CanvasRenderingContext2D, x: number, y: number, opacity: number) {
  if (opacity < 0.01) return;
  ctx.save();
  ctx.globalAlpha = opacity;

  const w = 120, h = 80;
  const bx = x - w / 2, by = y - h / 2;

  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.fillRect(bx + 4, by + 4, w, h);

  ctx.fillStyle = "#4A4540";
  ctx.strokeStyle = "rgba(60,55,50,0.6)";
  ctx.lineWidth = 2;
  ctx.fillRect(bx, by, w, h);
  ctx.strokeRect(bx, by, w, h);

  ctx.strokeStyle = "rgba(80,75,65,0.25)";
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(bx + 15, by + 10);
  ctx.lineTo(bx + 50, by + 30);
  ctx.moveTo(bx + 70, by + 15);
  ctx.lineTo(bx + 90, by + 55);
  ctx.stroke();

  ctx.strokeStyle = "#6B5A45";
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(bx + w, by + 20);
  ctx.lineTo(bx + w + 8, by + 18);
  ctx.moveTo(bx + w, by + 55);
  ctx.lineTo(bx + w + 6, by + 57);
  ctx.stroke();

  // === GRAFFITI T-REX SKULL ===
  ctx.strokeStyle = "#E63462";
  ctx.lineWidth = 2.5;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.beginPath();
  ctx.moveTo(bx + 20, by + 38);
  ctx.bezierCurveTo(bx + 20, by + 25, bx + 40, by + 18, bx + 55, by + 18);
  ctx.bezierCurveTo(bx + 70, by + 18, bx + 80, by + 25, bx + 82, by + 35);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(bx + 20, by + 38);
  ctx.bezierCurveTo(bx + 20, by + 48, bx + 35, by + 55, bx + 50, by + 55);
  ctx.bezierCurveTo(bx + 65, by + 55, bx + 75, by + 50, bx + 82, by + 42);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(bx + 60, by + 30, 6, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = "#8B5CF6";
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let t = 0; t < 6; t++) {
    const tx = bx + 28 + t * 8;
    ctx.moveTo(tx, by + 40);
    ctx.lineTo(tx + 3, by + 50);
    ctx.lineTo(tx + 6, by + 40);
  }
  ctx.stroke();

  ctx.strokeStyle = "rgba(230,52,98,0.3)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(bx + 35, by + 55);
  ctx.lineTo(bx + 35, by + 65);
  ctx.moveTo(bx + 55, by + 55);
  ctx.lineTo(bx + 55, by + 63);
  ctx.stroke();

  ctx.font = "bold 8px sans-serif";
  ctx.fillStyle = "rgba(230,52,98,0.4)";
  ctx.fillText("WURMZ", bx + 25, by + 72);

  ctx.restore();
}

function pseudoRandom(seed: number): number {
  return ((Math.sin(seed * 127.1 + 311.7) * 43758.5453) % 1 + 1) % 1;
}
