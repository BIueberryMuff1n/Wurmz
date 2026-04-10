"use client";

import { useEffect, useState } from "react";

export default function UndergroundJourney() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    function handleScroll() {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(maxScroll > 0 ? window.scrollY / maxScroll : 0);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Soil layer phases:
  // 0.0 - 0.12: Sky / surface
  // 0.12 - 0.25: Straw/mulch top layer (golden, fibrous)
  // 0.25 - 0.45: Light soil with perlite (tan/brown with white speckles)
  // 0.45 - 0.7: Rich living soil (dark brown, organic)
  // 0.7 - 1.0: Deep earth (near black, dense)

  const bgColor = getBackgroundColor(scrollProgress);

  // Layer opacities
  const strawOpacity = smoothStep(0.1, 0.15, scrollProgress) * (1 - smoothStep(0.25, 0.35, scrollProgress));
  const perliteOpacity = smoothStep(0.2, 0.3, scrollProgress) * (1 - smoothStep(0.45, 0.55, scrollProgress));
  const richSoilOpacity = smoothStep(0.4, 0.5, scrollProgress) * (1 - smoothStep(0.75, 0.85, scrollProgress));
  const deepOpacity = smoothStep(0.7, 0.85, scrollProgress);

  // Root visibility in the rich soil zone
  const rootOpacity = smoothStep(0.35, 0.5, scrollProgress) * (1 - smoothStep(0.7, 0.85, scrollProgress));

  // Worm visibility at the deep zone
  const wormOpacity = smoothStep(0.65, 0.8, scrollProgress);

  return (
    <div className="pointer-events-none fixed inset-0 z-[2]">
      {/* Base background color */}
      <div className="absolute inset-0" style={{ backgroundColor: bgColor }} />

      {/* === STRAW / MULCH TOP LAYER === */}
      {/* Golden straw color wash */}
      <div
        className="absolute inset-0"
        style={{
          opacity: strawOpacity * 0.5,
          background: "linear-gradient(180deg, rgba(180,155,100,0.2) 0%, rgba(150,120,60,0.15) 50%, transparent 100%)",
        }}
      />
      {/* Straw fiber texture — horizontal streaks */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ opacity: strawOpacity * 0.3 }}
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
      >
        {/* Straw/hay fibers — thin golden lines at various angles */}
        {Array.from({ length: 40 }, (_, i) => {
          const x = (i * 37 + 15) % 1440;
          const y = 200 + (i * 23 + 7) % 500;
          const angle = -15 + (i % 7) * 5;
          const len = 30 + (i % 5) * 15;
          return (
            <line
              key={`straw-${i}`}
              x1={x}
              y1={y}
              x2={x + len * Math.cos((angle * Math.PI) / 180)}
              y2={y + len * Math.sin((angle * Math.PI) / 180)}
              stroke={i % 3 === 0 ? "#C4A55A" : "#A8903C"}
              strokeWidth={1 + (i % 3) * 0.5}
              opacity={0.3 + (i % 4) * 0.1}
              strokeLinecap="round"
            />
          );
        })}
      </svg>

      {/* === PERLITE / LIGHT SOIL LAYER === */}
      {/* Warm tan base */}
      <div
        className="absolute inset-0"
        style={{
          opacity: perliteOpacity * 0.3,
          background: "radial-gradient(ellipse at 50% 50%, rgba(120,90,50,0.25) 0%, transparent 70%)",
        }}
      />
      {/* Perlite speckles — white/light dots scattered */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ opacity: perliteOpacity * 0.5 }}
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
      >
        {Array.from({ length: 60 }, (_, i) => {
          const x = (i * 47 + 23) % 1440;
          const y = (i * 31 + 11) % 900;
          const r = 1.5 + (i % 4) * 1.2;
          return (
            <circle
              key={`perl-${i}`}
              cx={x}
              cy={y}
              r={r}
              fill={i % 5 === 0 ? "rgba(240,235,220,0.35)" : "rgba(220,210,190,0.25)"}
            />
          );
        })}
        {/* Larger perlite chunks */}
        {Array.from({ length: 15 }, (_, i) => {
          const x = (i * 97 + 50) % 1440;
          const y = (i * 67 + 30) % 900;
          return (
            <ellipse
              key={`chunk-${i}`}
              cx={x}
              cy={y}
              rx={3 + (i % 3) * 2}
              ry={2 + (i % 2) * 1.5}
              fill="rgba(235,225,205,0.2)"
              transform={`rotate(${(i * 30) % 180} ${x} ${y})`}
            />
          );
        })}
      </svg>

      {/* === RICH LIVING SOIL === */}
      <div
        className="absolute inset-0"
        style={{
          opacity: richSoilOpacity * 0.4,
          background: "linear-gradient(180deg, transparent 10%, rgba(40,28,15,0.4) 40%, rgba(25,18,10,0.5) 80%)",
        }}
      />
      {/* Root system */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ opacity: rootOpacity * 0.12 }}
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
      >
        <g stroke="#654321" fill="none" strokeLinecap="round">
          <path d="M720,0 C710,150 730,300 715,450 C700,600 725,750 720,900" strokeWidth="4" opacity="0.5" />
          <path d="M720,150 C650,200 550,180 450,220" strokeWidth="2.5" opacity="0.35" />
          <path d="M720,150 C790,200 890,180 990,220" strokeWidth="2.5" opacity="0.35" />
          <path d="M715,350 C630,380 520,360 400,400" strokeWidth="2" opacity="0.25" />
          <path d="M715,350 C800,380 920,360 1040,400" strokeWidth="2" opacity="0.25" />
          <path d="M450,220 C400,250 350,240 300,270" strokeWidth="1" opacity="0.2" />
          <path d="M990,220 C1040,250 1090,240 1140,270" strokeWidth="1" opacity="0.2" />
        </g>
      </svg>

      {/* === DEEP EARTH === */}
      <div
        className="absolute inset-0"
        style={{
          opacity: deepOpacity,
          background: "radial-gradient(ellipse at 50% 50%, transparent 20%, rgba(10,6,3,0.5) 80%)",
        }}
      />

      {/* Deep worms — red, matching logo */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ opacity: wormOpacity }}
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
      >
        {[
          { d: "M200,300 C230,280 260,320 290,300 C320,280 350,320 380,300", w: 6, dur: "4s" },
          { d: "M800,500 C820,480 840,520 860,500 C880,480 900,520 920,500", w: 5, dur: "3s" },
          { d: "M1100,650 C1115,635 1130,665 1145,650 C1160,635 1175,665 1190,650", w: 4, dur: "2.5s" },
          { d: "M50,750 C90,730 130,770 170,750 C210,730 250,770 290,750 C330,730 370,770 410,750", w: 5, dur: "5s" },
          { d: "M600,800 C630,780 660,820 690,800 C720,780 750,820 780,800 C810,780 840,820 870,800", w: 7, dur: "6s" },
          { d: "M1200,850 C1215,835 1230,865 1245,850 C1260,835 1275,865 1290,850", w: 4, dur: "3.5s" },
        ].map((worm, i) => {
          const altD = worm.d.replace(
            /(\d+),(\d+)/g,
            (_, x, y) => `${x},${parseInt(y) + (parseInt(y) % 2 === 0 ? 12 : -12)}`
          );
          return (
            <path
              key={i}
              d={worm.d}
              stroke="rgba(200,50,60,0.2)"
              strokeWidth={worm.w}
              fill="none"
              strokeLinecap="round"
            >
              <animate
                attributeName="d"
                dur={worm.dur}
                repeatCount="indefinite"
                values={`${worm.d};${altD};${worm.d}`}
              />
            </path>
          );
        })}
      </svg>
    </div>
  );
}

function smoothStep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function getBackgroundColor(progress: number): string {
  const colors = [
    { r: 17, g: 15, b: 10 },    // 0.0 — sky/surface dark
    { r: 45, g: 35, b: 20 },    // 0.15 — straw/mulch (warmer, golden-brown)
    { r: 55, g: 40, b: 22 },    // 0.3 — light soil with perlite (tan)
    { r: 35, g: 25, b: 14 },    // 0.5 — rich living soil (dark brown)
    { r: 20, g: 14, b: 8 },     // 0.7 — deep soil
    { r: 12, g: 8, b: 5 },      // 1.0 — deepest earth
  ];
  const stops = [0, 0.15, 0.3, 0.5, 0.7, 1.0];

  let i = 0;
  for (; i < stops.length - 1; i++) {
    if (progress <= stops[i + 1]) break;
  }
  i = Math.min(i, stops.length - 2);

  const t = (progress - stops[i]) / (stops[i + 1] - stops[i]);
  const c1 = colors[i];
  const c2 = colors[i + 1];

  const r = Math.round(c1.r + (c2.r - c1.r) * t);
  const g = Math.round(c1.g + (c2.g - c1.g) * t);
  const b = Math.round(c1.b + (c2.b - c1.b) * t);

  return `rgb(${r}, ${g}, ${b})`;
}
