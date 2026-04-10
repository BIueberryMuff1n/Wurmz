"use client";

import { useEffect, useRef, useState } from "react";

interface Worm {
  // Array of segment positions [x, y]
  segments: [number, number][];
  speed: number;
  angle: number;       // current heading
  turnRate: number;     // how much it turns
  turnTimer: number;    // time until next direction change
  thickness: number;
  color: { r: number; g: number; b: number };
  waveOffset: number;   // phase offset for body wave
  waveSpeed: number;
}

export default function WormPit() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wormsRef = useRef<Worm[]>([]);
  const animRef = useRef<number>(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show when scrolled to bottom 30% of page
    function checkVisibility() {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? scrollY / maxScroll : 0;
      setVisible(progress > 0.6);
    }
    window.addEventListener("scroll", checkVisibility, { passive: true });
    checkVisibility();
    return () => window.removeEventListener("scroll", checkVisibility);
  }, []);

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

    // Initialize worms if empty
    if (wormsRef.current.length === 0) {
      const count = Math.floor(window.innerWidth / 18); // ~80 on desktop
      for (let i = 0; i < count; i++) {
        wormsRef.current.push(createWorm(canvas.width, canvas.height, i));
      }
    }

    let time = 0;

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time++;

      const worms = wormsRef.current;

      for (const worm of worms) {
        updateWorm(worm, canvas.width, canvas.height, time);
        drawWorm(ctx, worm, time);
      }

      animRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[4]"
      style={{ opacity: 0.85 }}
    />
  );
}

function createWorm(w: number, h: number, seed: number): Worm {
  const segCount = 14 + Math.floor(pseudoRandom(seed * 7) * 10);
  const x = pseudoRandom(seed * 13) * w;
  const y = pseudoRandom(seed * 17) * h;
  const angle = pseudoRandom(seed * 23) * Math.PI * 2;

  const segments: [number, number][] = [];
  for (let i = 0; i < segCount; i++) {
    segments.push([
      x - Math.cos(angle) * i * 4,
      y - Math.sin(angle) * i * 4,
    ]);
  }

  // Color variation: brownish-reds, some pinker, some darker
  const rBase = 120 + Math.floor(pseudoRandom(seed * 29) * 80);
  const gBase = 35 + Math.floor(pseudoRandom(seed * 31) * 30);
  const bBase = 30 + Math.floor(pseudoRandom(seed * 37) * 25);

  return {
    segments,
    speed: 0.4 + pseudoRandom(seed * 41) * 0.6,
    angle,
    turnRate: 0.02 + pseudoRandom(seed * 43) * 0.04,
    turnTimer: Math.floor(pseudoRandom(seed * 47) * 120),
    thickness: 3 + pseudoRandom(seed * 53) * 4,
    color: { r: rBase, g: gBase, b: bBase },
    waveOffset: pseudoRandom(seed * 59) * Math.PI * 2,
    waveSpeed: 0.05 + pseudoRandom(seed * 61) * 0.05,
  };
}

function updateWorm(worm: Worm, w: number, h: number, time: number) {
  // Direction changes
  worm.turnTimer--;
  if (worm.turnTimer <= 0) {
    worm.turnRate = (Math.random() - 0.5) * 0.08;
    worm.turnTimer = 40 + Math.floor(Math.random() * 120);
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
  ctx.strokeStyle = `rgba(${Math.max(0, r - 50)}, ${Math.max(0, g - 20)}, ${Math.max(0, b - 15)}, 0.6)`;
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
  ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.8)`;
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
  ctx.strokeStyle = `rgba(${Math.min(255, r + 40)}, ${Math.min(255, g + 25)}, ${Math.min(255, b + 20)}, 0.2)`;
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
    ctx.strokeStyle = `rgba(${Math.max(0, r - 30)}, ${Math.max(0, g - 10)}, ${Math.max(0, b - 8)}, 0.25)`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

function pseudoRandom(seed: number): number {
  return ((Math.sin(seed * 127.1 + 311.7) * 43758.5453) % 1 + 1) % 1;
}
