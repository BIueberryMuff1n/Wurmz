"use client";

import { useEffect, useState, useRef } from "react";

export default function WormTunnel() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [pageHeight, setPageHeight] = useState(3400);
  const [wriggle, setWriggle] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    function update() {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(maxScroll > 0 ? window.scrollY / maxScroll : 0);
      setPageHeight(document.documentElement.scrollHeight);
    }
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

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

  const totalLength = 5800;

  // Tunnel only starts after parachute landing (~12% scroll)
  const tunnelStart = 0.12;
  const adjustedProgress = Math.max(0, (scrollProgress - tunnelStart) / (1 - tunnelStart));
  const wormProgress = adjustedProgress;

  // Tunnel reveals BEHIND the worm — it's the trail the worm dug.
  // Tunnel ends exactly at the worm's back edge (center minus half body length).
  // Worm body is 180px, so tunnel stops ~90px before the worm's center position.
  const tunnelReveal = Math.max(0, adjustedProgress * totalLength - 90);

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

          {/* Bold dirt texture pattern for inside the tunnel */}
          <pattern
            id="dirt-fill"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <rect width="20" height="20" fill="#1a1008" />
            {/* Dirt chunks */}
            <circle cx="3" cy="5" r="2" fill="#2a1c10" opacity="0.8" />
            <circle cx="14" cy="3" r="1.5" fill="#3d2b1f" opacity="0.6" />
            <circle cx="8" cy="12" r="2.5" fill="#2a1c10" opacity="0.7" />
            <circle cx="17" cy="15" r="1.8" fill="#3d2b1f" opacity="0.5" />
            <circle cx="5" cy="18" r="1.2" fill="#2a1c10" opacity="0.6" />
            <circle cx="12" cy="8" r="1" fill="#4a3520" opacity="0.4" />
            {/* Small rocks */}
            <rect x="1" y="14" width="2" height="1.5" rx="0.5" fill="#3d2b1f" opacity="0.5" />
            <rect x="15" y="9" width="3" height="2" rx="0.8" fill="#2a1c10" opacity="0.4" />
          </pattern>

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

        {/* === TUNNEL (revealed behind the worm) === */}

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

        {/* Inner dirt texture — bold, visible */}
        <path
          d={tunnelPath}
          fill="none"
          stroke="url(#dirt-fill)"
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

        {/* === THE WORM (at the digging front) === */}
        <WormBody tunnelPath={tunnelPath} progress={wormProgress} />
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

      {/* === FACE (front/right end) === */}
      {/* Eyes — half-lidded, chill */}
      <ellipse cx={bodyLen / 2 - 18} cy={-6} rx={4} ry={3.5} fill="#1a0a05" />
      <ellipse cx={bodyLen / 2 - 18} cy={6} rx={4} ry={3.5} fill="#1a0a05" />
      {/* Eye shine */}
      <circle cx={bodyLen / 2 - 16} cy={-7} r={1.5} fill="rgba(255,255,255,0.5)" />
      <circle cx={bodyLen / 2 - 16} cy={5} r={1.5} fill="rgba(255,255,255,0.5)" />
      {/* Eyelids — half closed, stoned look */}
      <path
        d={`M${bodyLen / 2 - 23},${-9} Q${bodyLen / 2 - 18},${-5} ${bodyLen / 2 - 13},${-9}`}
        fill="rgba(160,40,30,0.6)"
      />
      <path
        d={`M${bodyLen / 2 - 23},${3} Q${bodyLen / 2 - 18},${7} ${bodyLen / 2 - 13},${3}`}
        fill="rgba(160,40,30,0.6)"
      />
      {/* Smile — subtle smirk */}
      <path
        d={`M${bodyLen / 2 - 10},${-2} Q${bodyLen / 2 - 5},${2} ${bodyLen / 2 - 10},${2}`}
        fill="none"
        stroke="#1a0a05"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* === JOINT === */}
      {/* Joint body — white/tan cylinder sticking out of mouth */}
      <rect
        x={bodyLen / 2 - 6}
        y={-2.5}
        width={22}
        height={5}
        rx={2}
        ry={2}
        fill="#E8DCC8"
        stroke="rgba(180,160,130,0.5)"
        strokeWidth="0.5"
      />
      {/* Joint filter/tip — brown end near mouth */}
      <rect
        x={bodyLen / 2 - 6}
        y={-2.5}
        width={6}
        height={5}
        rx={1.5}
        ry={1.5}
        fill="#C4A87A"
      />
      {/* Joint cherry/lit end — glowing orange */}
      <circle cx={bodyLen / 2 + 16} cy={0} r={3} fill="#E8841A" />
      <circle cx={bodyLen / 2 + 16} cy={0} r={2} fill="#F5A623" opacity="0.8" />
      <circle cx={bodyLen / 2 + 16} cy={0} r={4} fill="rgba(245,166,35,0.2)" />

      {/* === SMOKE TRAIL === */}
      {/* Smoke puffs rising from joint tip */}
      {[
        { cx: bodyLen / 2 + 22, cy: -4, r: 3, o: 0.15 },
        { cx: bodyLen / 2 + 28, cy: -9, r: 4, o: 0.12 },
        { cx: bodyLen / 2 + 32, cy: -16, r: 5, o: 0.09 },
        { cx: bodyLen / 2 + 34, cy: -25, r: 6, o: 0.06 },
        { cx: bodyLen / 2 + 33, cy: -35, r: 7, o: 0.04 },
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
