"use client";

import { useEffect, useState, useRef, useCallback } from "react";

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

  // Worm wriggle animation
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

  // The tunnel path — winding through the page
  // Goes OFF SCREEN at key content sections (Brand ~20%, Grow ~45%)
  // so the viewer focuses on the content, then the worm comes back
  const tunnelPath = [
    "M720,0",           // Start center top
    "C700,100 750,200 720,300",    // Gentle curve down through hero
    "C680,400 -100,450 -200,500",  // EXIT LEFT — during Brand section
    "C-300,550 -100,600 200,650",  // Curve back from left
    "C500,700 750,750 720,850",    // Re-center
    "C690,950 1600,1000 1700,1100", // EXIT RIGHT — during Grow section
    "C1800,1200 1500,1300 1100,1350", // Curve back from right
    "C700,1400 750,1500 720,1600", // Re-center for countdown
    "C690,1700 -150,1750 -200,1850", // EXIT LEFT — during signup
    "C-250,1950 300,2000 720,2100", // Curve back
    "C750,2200 680,2400 720,2600", // Deep descent
    "C760,2800 700,3000 720,3200", // Final depth
    "C740,3300 720,3350 720,3400", // Bottom
  ].join(" ");

  const totalLength = 5800; // approximate
  const revealLength = scrollProgress * totalLength;
  const wormProgress = Math.max(0, scrollProgress - 0.015);

  return (
    <div className="pointer-events-none absolute inset-0 z-[6]" style={{ height: pageHeight }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 1440 3400`}
        preserveAspectRatio="xMidYMin slice"
        className="absolute top-0 left-0 w-full"
        style={{ height: pageHeight }}
      >
        <defs>
          <filter id="tunnel-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="15" />
          </filter>
          <linearGradient id="worm-body" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8B2020" />
            <stop offset="30%" stopColor="#C43A3A" />
            <stop offset="60%" stopColor="#E63462" />
            <stop offset="100%" stopColor="#9E2828" />
          </linearGradient>
        </defs>

        {/* Outer glow — crimson bioluminescent trail */}
        <path
          d={tunnelPath}
          fill="none"
          stroke="rgba(230,52,98,0.05)"
          strokeWidth="90"
          strokeLinecap="round"
          filter="url(#tunnel-glow)"
          strokeDasharray={totalLength}
          strokeDashoffset={totalLength - revealLength}
        />

        {/* Tunnel carved path */}
        <path
          d={tunnelPath}
          fill="none"
          stroke="rgba(25,18,10,0.6)"
          strokeWidth="44"
          strokeLinecap="round"
          strokeDasharray={totalLength}
          strokeDashoffset={totalLength - revealLength}
        />

        {/* Tunnel edge highlight */}
        <path
          d={tunnelPath}
          fill="none"
          stroke="rgba(61,43,31,0.25)"
          strokeWidth="48"
          strokeLinecap="round"
          strokeDasharray={totalLength}
          strokeDashoffset={totalLength - revealLength}
        />
        <path
          d={tunnelPath}
          fill="none"
          stroke="rgba(17,13,8,0.5)"
          strokeWidth="40"
          strokeLinecap="round"
          strokeDasharray={totalLength}
          strokeDashoffset={totalLength - revealLength}
        />

        {/* THE WORM */}
        <WormBody
          tunnelPath={tunnelPath}
          progress={wormProgress}
          wriggle={wriggle}
        />

        {/* Dirt particles at dig front */}
        {[...Array(8)].map((_, i) => {
          const angle = (i / 8) * Math.PI * 2 + wriggle * 0.15;
          const dist = 28 + Math.sin(wriggle * 0.8 + i * 1.2) * 12;
          return (
            <circle
              key={i}
              r={1.5 + (i % 3)}
              fill={`rgba(101,67,33,${0.15 + (i % 3) * 0.08})`}
              style={{
                offsetPath: `path("${tunnelPath}")`,
                offsetDistance: `${Math.min(100, (wormProgress + 0.008) * 100)}%`,
                offsetRotate: "0deg",
                transform: `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px)`,
              }}
            />
          );
        })}
      </svg>
    </div>
  );
}

function WormBody({
  tunnelPath,
  progress,
  wriggle,
}: {
  tunnelPath: string;
  progress: number;
  wriggle: number;
}) {
  return (
    <g
      style={{
        offsetPath: `path("${tunnelPath}")`,
        offsetDistance: `${progress * 100}%`,
        offsetRotate: "auto",
      }}
    >
      <g transform={`translate(0, ${wriggle * 0.5})`}>
        {/* Worm glow — crimson */}
        <ellipse
          cx="0"
          cy="0"
          rx="35"
          ry="14"
          fill="rgba(230,52,98,0.15)"
          filter="url(#tunnel-glow)"
        />

        {/* Tail */}
        <ellipse cx="-22" cy={wriggle * 0.3} rx="6" ry="4.5" fill="#8B2020" opacity="0.8" />

        {/* Body */}
        <ellipse cx="0" cy="0" rx="24" ry="8" fill="url(#worm-body)" />

        {/* Segment lines */}
        {[-16, -10, -4, 2, 8, 14].map((x, i) => (
          <line
            key={i}
            x1={x}
            y1={-7}
            x2={x}
            y2={7}
            stroke="rgba(80,15,15,0.3)"
            strokeWidth="0.8"
          />
        ))}

        {/* Clitellum band */}
        <rect x="-3" y="-8.5" width="10" height="17" rx="5" fill="rgba(230,52,98,0.25)" />

        {/* Head */}
        <ellipse cx="22" cy={wriggle * 0.25} rx="6" ry="6.5" fill="#C43A3A" />

        {/* Head highlight */}
        <ellipse cx="24" cy={wriggle * 0.25 - 2} rx="3" ry="2.5" fill="rgba(230,100,100,0.3)" />
      </g>
    </g>
  );
}
