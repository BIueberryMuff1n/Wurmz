"use client";

import { useEffect, useState, useRef } from "react";
import { useScroll } from "./ScrollContext";

export default function WormTunnel() {
  const { progress: scrollProgress, documentHeight: pageHeight } = useScroll();
  const [wriggle, setWriggle] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    let frame: number;
    let t = 0;
    function tick() {
      t += 0.05;
      setWriggle(Math.sin(t) * 8);
      frame = requestAnimationFrame(tick);
    }
    tick();
    return () => cancelAnimationFrame(frame);
  }, []);

  // Tunnel path — starts at the soil line (not in the sky!)
  // The parachute worm handles the sky descent, tunnel begins underground
  const tunnelPath = [
    "M720,700",                          // Start at soil line
    "C700,800 750,900 720,1000",         // Initial dig down
    "C680,1100 -100,1150 -200,1200",     // EXIT LEFT — Brand section
    "C-300,1250 -100,1300 200,1350",     // Curve back from left
    "C500,1400 750,1450 720,1550",       // Re-center
    "C690,1650 1600,1700 1700,1800",     // EXIT RIGHT — Grow section
    "C1800,1900 1500,2000 1100,2050",    // Curve back from right
    "C700,2100 750,2200 720,2350",       // Re-center for countdown
    "C690,2500 -150,2550 -200,2650",     // EXIT LEFT — signup
    "C-250,2750 300,2800 720,2900",      // Curve back
    "C750,3000 680,3100 720,3200",       // Final descent
    "C740,3300 720,3350 720,3400",       // Bottom
  ].join(" ");

  const totalLength = 8800;

  // Tunnel only starts after parachute landing (~12% scroll)
  const tunnelStart = 0.12;
  const adjustedProgress = Math.max(0, (scrollProgress - tunnelStart) / (1 - tunnelStart));
  const wormProgress = adjustedProgress;

  // Tunnel reveals BEHIND the worm — never ahead.
  // Tunnel must always lag behind worm position.
  const tunnelReveal = Math.max(0, adjustedProgress * totalLength * 0.65);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[6]"
      style={{ height: pageHeight }}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 1440 3400"
        preserveAspectRatio="xMidYMin slice"
        className="absolute top-0 left-0 w-full"
        style={{ height: pageHeight }}
      >
        <defs>
          <filter id="tunnel-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="15" />
          </filter>

          {/* Tunnel interior gradient — matches soil layers, darker in center */}
          <linearGradient id="tunnel-soil" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3a2a18" /> {/* lighter soil at top */}
            <stop offset="30%" stopColor="#2a1c10" />
            <stop offset="60%" stopColor="#1a1008" /> {/* rich dark soil */}
            <stop offset="100%" stopColor="#0e0804" /> {/* deepest */}
          </linearGradient>

          {/* Worm gradient — brownish to bright red */}
          <linearGradient id="worm-body" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7A2818" />
            <stop offset="25%" stopColor="#A03020" />
            <stop offset="50%" stopColor="#C43A3A" />
            <stop offset="75%" stopColor="#B83228" />
            <stop offset="100%" stopColor="#8B2020" />
          </linearGradient>

          {/* Worm body vertical gradient for roundness */}
          <linearGradient id="worm-body-v" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,150,100,0.15)" />
            <stop offset="40%" stopColor="rgba(255,150,100,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.2)" />
          </linearGradient>
        </defs>

        {/* === TUNNEL (revealed behind the worm — hidden until parachute lands) === */}
        {adjustedProgress > 0.01 && <g>

        {/* Outer edge — rough dirt border */}
        <path
          d={tunnelPath}
          fill="none"
          stroke="rgba(61,43,31,0.4)"
          strokeWidth="56"
          strokeLinecap="round"
          strokeDasharray={totalLength}
          strokeDashoffset={totalLength - tunnelReveal}
        />

        {/* Tunnel wall — dark carved earth */}
        <path
          d={tunnelPath}
          fill="none"
          stroke="rgba(30,20,10,0.7)"
          strokeWidth="50"
          strokeLinecap="round"
          strokeDasharray={totalLength}
          strokeDashoffset={totalLength - tunnelReveal}
        />

        {/* Inner soil gradient — matches surrounding layers */}
        <path
          d={tunnelPath}
          fill="none"
          stroke="url(#tunnel-soil)"
          strokeWidth="46"
          strokeLinecap="round"
          strokeDasharray={totalLength}
          strokeDashoffset={totalLength - tunnelReveal}
        />

        {/* Tunnel depth shadow — darker center line */}
        <path
          d={tunnelPath}
          fill="none"
          stroke="rgba(10,6,3,0.4)"
          strokeWidth="20"
          strokeLinecap="round"
          strokeDasharray={totalLength}
          strokeDashoffset={totalLength - tunnelReveal}
        />

        {/* Subtle crimson glow along tunnel */}
        <path
          d={tunnelPath}
          fill="none"
          stroke="rgba(230,52,98,0.04)"
          strokeWidth="70"
          strokeLinecap="round"
          filter="url(#tunnel-glow)"
          strokeDasharray={totalLength}
          strokeDashoffset={totalLength - tunnelReveal}
        />

        </g>}

        {/* === THE WORM (at the digging front) — hidden until after parachute lands === */}
        {adjustedProgress > 0.01 && (
          <WormBody tunnelPath={tunnelPath} progress={wormProgress} />
        )}
      </svg>
    </div>
  );
}

function WormBody({
  tunnelPath,
  progress,
}: {
  tunnelPath: string;
  progress: number;
}) {
  const bodyLen = 180; // longer worm
  const bodyR = 22; // fills the tunnel width

  return (
    <g
      style={{
        offsetPath: `path("${tunnelPath}")`,
        offsetDistance: `${progress * 100}%`,
        offsetRotate: "auto",
      }}
    >
      {/* Outer stroke — thick dark outline, graffiti ink style */}
      <rect
        x={-bodyLen / 2}
        y={-bodyR - 1}
        width={bodyLen}
        height={bodyR * 2 + 2}
        rx={bodyR}
        ry={bodyR}
        fill="none"
        stroke="rgba(40,12,8,0.7)"
        strokeWidth="4"
      />

      {/* Main body fill */}
      <rect
        x={-bodyLen / 2}
        y={-bodyR}
        width={bodyLen}
        height={bodyR * 2}
        rx={bodyR}
        ry={bodyR}
        fill="url(#worm-body)"
        opacity="0.9"
      />

      {/* 3D roundness overlay */}
      <rect
        x={-bodyLen / 2}
        y={-bodyR}
        width={bodyLen}
        height={bodyR * 2}
        rx={bodyR}
        ry={bodyR}
        fill="url(#worm-body-v)"
      />

      {/* Segment lines — subtle rings */}
      {[-70, -50, -30, -10, 10, 30, 50, 70].map((x, i) => (
        <line
          key={i}
          x1={x}
          y1={-bodyR + 4}
          x2={x}
          y2={bodyR - 4}
          stroke="rgba(60,15,10,0.2)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      ))}

      {/* === FACE (side profile view — looking right) === */}
      {/* Single eye — half-lidded, stoned */}
      <ellipse cx={bodyLen / 2 - 12} cy={-5} rx={5} ry={4} fill="#1a0a05" />
      {/* Eye white/iris */}
      <ellipse cx={bodyLen / 2 - 11} cy={-5} rx={3} ry={2.5} fill="#2a1510" />
      <circle cx={bodyLen / 2 - 10} cy={-4.5} r={1.5} fill="#1a0a05" />
      {/* Eye shine */}
      <circle cx={bodyLen / 2 - 9} cy={-6} r={1} fill="rgba(255,255,255,0.6)" />
      {/* Heavy eyelid — droopy, stoned */}
      <path
        d={`M${bodyLen / 2 - 18},${-8} Q${bodyLen / 2 - 12},${-3} ${bodyLen / 2 - 6},${-7}`}
        fill="rgba(140,35,25,0.7)"
      />
      {/* Mouth — slight smirk, side view */}
      <path
        d={`M${bodyLen / 2 - 5},${4} Q${bodyLen / 2},${7} ${bodyLen / 2 + 3},${5}`}
        fill="none"
        stroke="#1a0a05"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* === JOINT (cone-shaped, tilted upward) === */}
      <g transform={`translate(${bodyLen / 2}, 3) rotate(-30)`}>
      {/* Joint positioned relative to mouth, rotated -30deg (tilted up) */}
      {/* Joint body — cone shape, wider at lit end */}
      <polygon
        points="-4,-2 22,-3.5 22,3.5 -4,2"
        fill="#E2D5B8"
        stroke="rgba(180,160,130,0.4)"
        strokeWidth="0.5"
      />
      {/* Paper crinkle lines */}
      <line x1={4} y1={-1.8} x2={4} y2={1.8} stroke="rgba(160,140,110,0.2)" strokeWidth="0.5" />
      <line x1={10} y1={-2.5} x2={10} y2={2.5} stroke="rgba(160,140,110,0.2)" strokeWidth="0.5" />
      <line x1={16} y1={-3} x2={16} y2={3} stroke="rgba(160,140,110,0.2)" strokeWidth="0.5" />
      {/* Filter/crutch */}
      <rect x={-5} y={-2} width={6} height={4} rx={1} ry={1} fill="#B89E6A" />
      {/* Twisted tip */}
      <path d="M22,-3 Q26,-1 24,0 Q26,1 22,3" fill="#D4C8A8" opacity="0.7" />
      {/* Cherry/ember */}
      <ellipse cx={24} cy={0} rx={3} ry={2.5} fill="#D4641A" />
      <ellipse cx={24} cy={0} rx={2} ry={1.5} fill="#F09030" opacity="0.8" />
      <ellipse cx={24} cy={0} rx={5} ry={4} fill="rgba(240,144,48,0.15)" />
      </g>

      {/* === SMOKE TRAIL (from tilted joint tip) === */}
      {[
        { cx: bodyLen / 2 + 18, cy: -12, r: 3, o: 0.15 },
        { cx: bodyLen / 2 + 20, cy: -20, r: 4, o: 0.12 },
        { cx: bodyLen / 2 + 19, cy: -30, r: 5.5, o: 0.09 },
        { cx: bodyLen / 2 + 16, cy: -42, r: 7, o: 0.06 },
        { cx: bodyLen / 2 + 13, cy: -55, r: 8, o: 0.04 },
      ].map((puff, i) => (
        <circle
          key={`smoke-${i}`}
          cx={puff.cx}
          cy={puff.cy}
          r={puff.r}
          fill={`rgba(200,200,200,${puff.o})`}
        >
          <animate
            attributeName="cy"
            values={`${puff.cy};${puff.cy - 8};${puff.cy}`}
            dur={`${3 + i * 0.5}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="cx"
            values={`${puff.cx};${puff.cx + 4};${puff.cx}`}
            dur={`${4 + i * 0.7}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="r"
            values={`${puff.r};${puff.r + 2};${puff.r}`}
            dur={`${3.5 + i * 0.4}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values={`${puff.o};${puff.o * 0.5};${puff.o}`}
            dur={`${3 + i * 0.6}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </g>
  );
}
