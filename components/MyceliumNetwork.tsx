"use client";

import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  pulsePhase: number;
  pulseSpeed: number;
  connections: number[];
}

export default function MyceliumNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const nodesRef = useRef<Node[]>([]);
  const animRef = useRef<number>(0);

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

    // Create nodes
    const nodeCount = Math.floor((window.innerWidth * window.innerHeight) / 25000);
    const nodes: Node[] = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        radius: 1.5 + Math.random() * 2,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.005 + Math.random() * 0.01,
        connections: [],
      });
    }
    nodesRef.current = nodes;

    // Pre-compute connections (nearest neighbors)
    const maxDist = 180;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        if (Math.sqrt(dx * dx + dy * dy) < maxDist) {
          nodes[i].connections.push(j);
        }
      }
    }

    function handleMouseMove(e: MouseEvent) {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    }
    window.addEventListener("mousemove", handleMouseMove);

    let time = 0;

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time++;

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        // Slow organic movement
        node.x += node.vx;
        node.y += node.vy;
        node.pulsePhase += node.pulseSpeed;

        // Bounce off edges softly
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        // Mouse influence — nodes gently push away
        const dmx = node.x - mx;
        const dmy = node.y - my;
        const mouseDist = Math.sqrt(dmx * dmx + dmy * dmy);
        const mouseInfluence = Math.max(0, 1 - mouseDist / 200);

        // Pulse glow
        const pulse = 0.3 + 0.7 * Math.sin(node.pulsePhase) * 0.5 + 0.5;
        const glow = pulse + mouseInfluence * 0.6;

        // Draw connections first
        for (const j of node.connections) {
          const other = nodes[j];
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > maxDist) continue;

          const alpha = (1 - dist / maxDist) * 0.12 * glow;

          // Connection color shifts between crimson and violet
          const colorPhase = Math.sin(time * 0.002 + i * 0.1);
          const r = Math.floor(230 - colorPhase * 50);
          const g = Math.floor(52 + colorPhase * 20);
          const b = Math.floor(98 + colorPhase * 80);

          ctx.beginPath();
          ctx.moveTo(node.x, node.y);

          // Organic curved connections (not straight lines)
          const midX = (node.x + other.x) / 2 + Math.sin(time * 0.003 + i) * 8;
          const midY = (node.y + other.y) / 2 + Math.cos(time * 0.003 + j) * 8;
          ctx.quadraticCurveTo(midX, midY, other.x, other.y);

          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          ctx.lineWidth = 0.8 + mouseInfluence * 1.5;
          ctx.stroke();
        }

        // Draw node
        const nodeAlpha = 0.15 * glow + mouseInfluence * 0.4;
        const nodeR = node.radius * (1 + pulse * 0.3 + mouseInfluence * 2);

        // Glow
        const gradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, nodeR * 4
        );
        const colorPhase2 = Math.sin(time * 0.001 + node.pulsePhase);
        const cr = Math.floor(230 - colorPhase2 * 60);
        const cg = Math.floor(52 + colorPhase2 * 30);
        const cb = Math.floor(98 + colorPhase2 * 100);

        gradient.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, ${nodeAlpha})`);
        gradient.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0)`);

        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeR * 4, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeR * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${nodeAlpha * 2})`;
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
      className="pointer-events-none fixed inset-0 z-[3]"
      style={{ opacity: 0.7 }}
    />
  );
}
