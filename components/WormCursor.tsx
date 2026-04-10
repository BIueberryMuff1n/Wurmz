"use client";

import { useEffect, useRef } from "react";

interface TrailPoint {
  x: number;
  y: number;
  age: number;
}

export default function WormCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailRef = useRef<TrailPoint[]>([]);
  const mouseRef = useRef({ x: -100, y: -100 });
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Check for touch device — skip cursor trail on mobile
    if ("ontouchstart" in window) return;

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function handleMouseMove(e: MouseEvent) {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    }
    window.addEventListener("mousemove", handleMouseMove);

    const maxTrailLength = 50;
    const maxAge = 60; // frames before fade out

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const trail = trailRef.current;
      const { x, y } = mouseRef.current;

      // Add new point if mouse has moved
      if (trail.length === 0 ||
          Math.abs(trail[0]?.x - x) > 2 ||
          Math.abs(trail[0]?.y - y) > 2) {
        trail.unshift({ x, y, age: 0 });
      }

      // Age and trim
      for (let i = trail.length - 1; i >= 0; i--) {
        trail[i].age++;
        if (trail[i].age > maxAge) {
          trail.splice(i, 1);
        }
      }
      if (trail.length > maxTrailLength) {
        trail.length = maxTrailLength;
      }

      // Draw worm body
      if (trail.length < 3) {
        animRef.current = requestAnimationFrame(animate);
        return;
      }

      for (let i = 0; i < trail.length - 1; i++) {
        const point = trail[i];
        const next = trail[i + 1];
        const progress = i / trail.length; // 0 at head, 1 at tail
        const ageAlpha = Math.max(0, 1 - point.age / maxAge);

        // Worm body width — thick in middle, thin at ends
        const bodyWidth = Math.sin(progress * Math.PI) * 4 + 1;

        // Worm undulation
        const undulate = Math.sin(Date.now() * 0.004 + i * 0.5) * 2 * (1 - progress);

        // Color shifts along body
        const r = Math.floor(230 - progress * 80);
        const g = Math.floor(52 + progress * 40);
        const b = Math.floor(98 + progress * 100);
        const alpha = ageAlpha * (1 - progress * 0.7) * 0.6;

        // Perpendicular offset for undulation
        const dx = next.x - point.x;
        const dy = next.y - point.y;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        const nx = -dy / len;
        const ny = dx / len;

        const px = point.x + nx * undulate;
        const py = point.y + ny * undulate;
        const px2 = next.x + nx * undulate;
        const py2 = next.y + ny * undulate;

        // Glow
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px2, py2);
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.3})`;
        ctx.lineWidth = bodyWidth * 4;
        ctx.lineCap = "round";
        ctx.stroke();

        // Core body
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px2, py2);
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.lineWidth = bodyWidth;
        ctx.lineCap = "round";
        ctx.stroke();
      }

      // Head glow
      if (trail.length > 0) {
        const head = trail[0];
        const headAlpha = Math.max(0, 1 - head.age / maxAge) * 0.4;
        const gradient = ctx.createRadialGradient(
          head.x, head.y, 0,
          head.x, head.y, 20
        );
        gradient.addColorStop(0, `rgba(230, 52, 98, ${headAlpha})`);
        gradient.addColorStop(1, `rgba(230, 52, 98, 0)`);
        ctx.beginPath();
        ctx.arc(head.x, head.y, 20, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[55]"
    />
  );
}
