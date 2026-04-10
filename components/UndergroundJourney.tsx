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

  // Phase breakpoints
  // 0.0 - 0.15: Surface / plant zone (green tones)
  // 0.15 - 0.4: Light soil (warm brown)
  // 0.4 - 0.7: Dark soil (deep brown, roots visible)
  // 0.7 - 1.0: Deep underground (near black, worms)

  // Background color interpolation
  const bgColor = getBackgroundColor(scrollProgress);

  // Layer opacities
  const surfaceOpacity = Math.max(0, 1 - scrollProgress / 0.2);
  const lightSoilOpacity = smoothStep(0.1, 0.2, scrollProgress) * (1 - smoothStep(0.4, 0.55, scrollProgress));
  const darkSoilOpacity = smoothStep(0.35, 0.5, scrollProgress) * (1 - smoothStep(0.75, 0.9, scrollProgress));
  const deepOpacity = smoothStep(0.65, 0.8, scrollProgress);

  // Root visibility
  const rootOpacity = smoothStep(0.25, 0.4, scrollProgress) * (1 - smoothStep(0.7, 0.85, scrollProgress));

  // Worm visibility
  const wormOpacity = smoothStep(0.6, 0.8, scrollProgress);

  return (
    <div className="pointer-events-none fixed inset-0 z-[2] transition-[background-color] duration-300">
      {/* Base background color */}
      <div className="absolute inset-0" style={{ backgroundColor: bgColor }} />

      {/* Surface layer — green foliage hints */}
      <div
        className="absolute inset-0"
        style={{
          opacity: surfaceOpacity,
          background:
            "linear-gradient(180deg, rgba(34,85,34,0.15) 0%, rgba(28,60,28,0.08) 40%, transparent 70%)",
        }}
      />

      {/* Surface grass/plant silhouettes at very top */}
      <svg
        className="absolute top-0 left-0 w-full"
        style={{ opacity: surfaceOpacity, height: "200px" }}
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
      >
        {/* Grass blades */}
        <g fill="rgba(34, 85, 34, 0.12)">
          <path d="M100,200 Q105,120 95,80 Q90,120 100,200Z" />
          <path d="M200,200 Q210,100 195,60 Q185,110 200,200Z" />
          <path d="M350,200 Q355,130 345,90 Q340,130 350,200Z" />
          <path d="M500,200 Q508,110 493,50 Q485,100 500,200Z" />
          <path d="M650,200 Q655,140 645,100 Q640,140 650,200Z" />
          <path d="M800,200 Q810,90 790,40 Q780,100 800,200Z" />
          <path d="M950,200 Q955,120 945,70 Q940,120 950,200Z" />
          <path d="M1100,200 Q1108,100 1093,55 Q1085,110 1100,200Z" />
          <path d="M1250,200 Q1255,130 1245,85 Q1240,130 1250,200Z" />
          <path d="M1380,200 Q1385,110 1375,60 Q1370,115 1380,200Z" />
        </g>
        {/* Cannabis leaf silhouette — center */}
        <g
          fill="rgba(34, 85, 34, 0.18)"
          transform="translate(720, 160) scale(0.8)"
        >
          <path d="M0,-80 C-5,-60 -20,-40 -8,-20 C-25,-35 -45,-30 -35,-10 C-50,-15 -55,5 -30,10 C-15,5 -5,15 0,30 C5,15 15,5 30,10 C55,5 50,-15 35,-10 C45,-30 25,-35 8,-20 C20,-40 5,-60 0,-80Z" />
        </g>
      </svg>

      {/* Light soil texture */}
      <div
        className="absolute inset-0"
        style={{
          opacity: lightSoilOpacity * 0.4,
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(101,67,33,0.2) 0%, transparent 60%)",
        }}
      />

      {/* Root system — visible in middle zone */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ opacity: rootOpacity * 0.15 }}
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
      >
        <g stroke="#654321" fill="none" strokeLinecap="round">
          {/* Main taproot */}
          <path d="M720,0 C710,150 730,300 715,450 C700,600 725,750 720,900" strokeWidth="4" opacity="0.6" />
          {/* Branching roots */}
          <path d="M720,150 C650,200 550,180 450,220" strokeWidth="2.5" opacity="0.4" />
          <path d="M720,150 C790,200 890,180 990,220" strokeWidth="2.5" opacity="0.4" />
          <path d="M715,350 C630,380 520,360 400,400" strokeWidth="2" opacity="0.3" />
          <path d="M715,350 C800,380 920,360 1040,400" strokeWidth="2" opacity="0.3" />
          <path d="M720,550 C660,590 580,570 480,610" strokeWidth="1.5" opacity="0.25" />
          <path d="M720,550 C780,590 860,570 960,610" strokeWidth="1.5" opacity="0.25" />
          {/* Fine root hairs */}
          <path d="M450,220 C400,250 350,240 300,270" strokeWidth="1" opacity="0.2" />
          <path d="M990,220 C1040,250 1090,240 1140,270" strokeWidth="1" opacity="0.2" />
          <path d="M400,400 C350,430 280,420 220,460" strokeWidth="1" opacity="0.15" />
          <path d="M1040,400 C1090,430 1160,420 1220,460" strokeWidth="1" opacity="0.15" />
        </g>
      </svg>

      {/* Dark soil layer */}
      <div
        className="absolute inset-0"
        style={{
          opacity: darkSoilOpacity * 0.3,
          background:
            "linear-gradient(180deg, transparent 10%, rgba(30,23,16,0.4) 40%, rgba(17,13,8,0.6) 80%)",
        }}
      />

      {/* Worm layer — SVG worms that wriggle */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ opacity: wormOpacity }}
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
      >
        {/* Worm 1 — large, slow */}
        <path
          d="M200,300 C230,280 260,320 290,300 C320,280 350,320 380,300"
          stroke="rgba(180,120,90,0.25)"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        >
          <animate
            attributeName="d"
            dur="4s"
            repeatCount="indefinite"
            values="
              M200,300 C230,280 260,320 290,300 C320,280 350,320 380,300;
              M200,305 C230,325 260,285 290,305 C320,325 350,285 380,305;
              M200,300 C230,280 260,320 290,300 C320,280 350,320 380,300
            "
          />
        </path>

        {/* Worm 2 — medium, faster */}
        <path
          d="M800,500 C820,480 840,520 860,500 C880,480 900,520 920,500"
          stroke="rgba(160,100,70,0.3)"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        >
          <animate
            attributeName="d"
            dur="3s"
            repeatCount="indefinite"
            values="
              M800,500 C820,480 840,520 860,500 C880,480 900,520 920,500;
              M800,510 C820,530 840,490 860,510 C880,530 900,490 920,510;
              M800,500 C820,480 840,520 860,500 C880,480 900,520 920,500
            "
          />
        </path>

        {/* Worm 3 — small, wriggly */}
        <path
          d="M1100,650 C1115,635 1130,665 1145,650 C1160,635 1175,665 1190,650"
          stroke="rgba(170,110,80,0.2)"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        >
          <animate
            attributeName="d"
            dur="2.5s"
            repeatCount="indefinite"
            values="
              M1100,650 C1115,635 1130,665 1145,650 C1160,635 1175,665 1190,650;
              M1100,655 C1115,670 1130,640 1145,655 C1160,670 1175,640 1190,655;
              M1100,650 C1115,635 1130,665 1145,650 C1160,635 1175,665 1190,650
            "
          />
        </path>

        {/* Worm 4 — crossing from left */}
        <path
          d="M50,750 C90,730 130,770 170,750 C210,730 250,770 290,750 C330,730 370,770 410,750"
          stroke="rgba(150,95,65,0.2)"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        >
          <animate
            attributeName="d"
            dur="5s"
            repeatCount="indefinite"
            values="
              M50,750 C90,730 130,770 170,750 C210,730 250,770 290,750 C330,730 370,770 410,750;
              M55,755 C90,775 130,735 170,755 C210,775 250,735 290,755 C330,775 370,735 410,755;
              M50,750 C90,730 130,770 170,750 C210,730 250,770 290,750 C330,730 370,770 410,750
            "
          />
        </path>

        {/* Worm 5 — deep bottom, thick */}
        <path
          d="M600,800 C630,780 660,820 690,800 C720,780 750,820 780,800 C810,780 840,820 870,800"
          stroke="rgba(180,120,90,0.22)"
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
        >
          <animate
            attributeName="d"
            dur="6s"
            repeatCount="indefinite"
            values="
              M600,800 C630,780 660,820 690,800 C720,780 750,820 780,800 C810,780 840,820 870,800;
              M600,808 C630,828 660,788 690,808 C720,828 750,788 780,808 C810,828 840,788 870,808;
              M600,800 C630,780 660,820 690,800 C720,780 750,820 780,800 C810,780 840,820 870,800
            "
          />
        </path>

        {/* Worm 6 — right side, small */}
        <path
          d="M1200,850 C1215,835 1230,865 1245,850 C1260,835 1275,865 1290,850"
          stroke="rgba(160,100,70,0.18)"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        >
          <animate
            attributeName="d"
            dur="3.5s"
            repeatCount="indefinite"
            values="
              M1200,850 C1215,835 1230,865 1245,850 C1260,835 1275,865 1290,850;
              M1200,855 C1215,870 1230,840 1245,855 C1260,870 1275,840 1290,855;
              M1200,850 C1215,835 1230,865 1245,850 C1260,835 1275,865 1290,850
            "
          />
        </path>
      </svg>

      {/* Deep underground vignette */}
      <div
        className="absolute inset-0"
        style={{
          opacity: deepOpacity,
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 20%, rgba(17,13,8,0.5) 80%)",
        }}
      />
    </div>
  );
}

// Smooth interpolation helper
function smoothStep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

// Background color that transitions through soil layers
function getBackgroundColor(progress: number): string {
  // Surface: dark green-brown → Light soil: warm brown → Dark soil: deep brown → Deep: near black
  const colors = [
    { r: 22, g: 18, b: 12 },    // 0.0 - surface (dark with green hint)
    { r: 40, g: 28, b: 16 },    // 0.3 - light soil
    { r: 28, g: 20, b: 12 },    // 0.6 - dark soil
    { r: 14, g: 10, b: 6 },     // 1.0 - deep underground
  ];
  const stops = [0, 0.3, 0.6, 1.0];

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
