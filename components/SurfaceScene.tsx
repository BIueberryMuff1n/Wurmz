"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function SurfaceScene() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    function handleScroll() {
      setScrollY(window.scrollY);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Parallax speeds
  const skyOffset = scrollY * 0.2;
  const plantOffset = scrollY * 0.4;
  const groundOffset = scrollY * 0.6;

  // Fade out as you scroll past hero
  const fadeOut = Math.max(0, 1 - scrollY / 800);

  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-[7] overflow-hidden"
      style={{ height: "100vh", opacity: fadeOut }}
    >
      {/* Sky gradient — dawn/dusk warmth */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translateY(${skyOffset}px)`,
          background: `linear-gradient(
            180deg,
            #0a0f1a 0%,
            #111827 15%,
            #1a1f3a 30%,
            #2d1f3d 45%,
            #3d1f2d 55%,
            #2a1a18 70%,
            #1a1208 85%,
            #110D08 100%
          )`,
        }}
      />

      {/* Stars */}
      <div
        className="absolute inset-0"
        style={{ transform: `translateY(${skyOffset * 0.5}px)` }}
      >
        {[
          { x: 10, y: 5, s: 1.5, o: 0.6 },
          { x: 25, y: 12, s: 1, o: 0.4 },
          { x: 40, y: 3, s: 2, o: 0.7 },
          { x: 55, y: 8, s: 1, o: 0.5 },
          { x: 70, y: 15, s: 1.5, o: 0.6 },
          { x: 85, y: 6, s: 1, o: 0.3 },
          { x: 15, y: 20, s: 1, o: 0.4 },
          { x: 60, y: 18, s: 1.5, o: 0.5 },
          { x: 90, y: 10, s: 2, o: 0.6 },
          { x: 35, y: 22, s: 1, o: 0.3 },
          { x: 78, y: 2, s: 1.5, o: 0.5 },
          { x: 48, y: 25, s: 1, o: 0.4 },
        ].map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.s,
              height: star.s,
              opacity: star.o,
              animation: `twinkle ${3 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}
      </div>

      {/* Moon */}
      <div
        className="absolute"
        style={{
          right: "15%",
          top: "8%",
          transform: `translateY(${skyOffset * 0.3}px)`,
        }}
      >
        <div
          className="rounded-full"
          style={{
            width: 60,
            height: 60,
            background: "radial-gradient(circle at 40% 35%, #f5f0e8 0%, #d4c5a9 50%, #b8a88a 100%)",
            boxShadow: "0 0 40px rgba(245,240,232,0.15), 0 0 80px rgba(245,240,232,0.05)",
          }}
        />
      </div>

      {/* Cannabis plant — comic/graffiti style matching logo */}
      <svg
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{
          transform: `translateX(-50%) translateY(${plantOffset * 0.3}px)`,
          width: "420px",
          height: "520px",
        }}
        viewBox="0 0 420 520"
        fill="none"
      >
        {/* Glow behind plant */}
        <ellipse cx="210" cy="250" rx="120" ry="200" fill="rgba(230,52,98,0.04)" />

        {/* Main stem — thick, rough, hand-drawn feel */}
        <path
          d="M210,520 C208,480 214,420 210,360 C206,300 213,240 210,180 C208,150 211,130 210,110"
          stroke="#1a3d10"
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* Stem highlight */}
        <path
          d="M210,520 C208,480 214,420 210,360 C206,300 213,240 210,180 C208,150 211,130 210,110"
          stroke="#2d6a1e"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* Stem inner line */}
        <path
          d="M210,520 C209,480 212,420 210,360 C208,300 211,240 210,180"
          stroke="#3a8526"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.5"
        />

        {/* Branch stems — thick with dark outlines */}
        {[
          { d: "M210,190 C185,170 155,165 125,175", w: 5 },
          { d: "M210,190 C235,170 265,165 295,175", w: 5 },
          { d: "M210,270 C180,250 145,255 115,270", w: 4.5 },
          { d: "M210,270 C240,250 275,255 305,270", w: 4.5 },
          { d: "M210,350 C185,335 155,340 130,355", w: 4 },
          { d: "M210,350 C235,335 265,340 290,355", w: 4 },
        ].map((branch, i) => (
          <g key={i}>
            <path d={branch.d} stroke="#1a3d10" strokeWidth={branch.w + 3} strokeLinecap="round" />
            <path d={branch.d} stroke="#2d6a1e" strokeWidth={branch.w} strokeLinecap="round" />
          </g>
        ))}

        {/* Fan leaves — bold outlines, comic style */}
        <g transform="translate(125, 175) rotate(-15)">
          <LeafShape scale={1} />
        </g>
        <g transform="translate(295, 175) rotate(15) scale(-1,1)">
          <LeafShape scale={1} />
        </g>
        <g transform="translate(115, 270) rotate(-20)">
          <LeafShape scale={1.2} />
        </g>
        <g transform="translate(305, 270) rotate(20) scale(-1,1)">
          <LeafShape scale={1.2} />
        </g>
        <g transform="translate(130, 355) rotate(-25)">
          <LeafShape scale={0.9} />
        </g>
        <g transform="translate(290, 355) rotate(25) scale(-1,1)">
          <LeafShape scale={0.9} />
        </g>

        {/* Top cola — chunky, bold, comic style */}
        <g transform="translate(210, 110)">
          {/* Cola outline */}
          <ellipse cx="0" cy="0" rx="18" ry="28" fill="#1a3d10" />
          {/* Cola fill */}
          <ellipse cx="0" cy="0" rx="15" ry="25" fill="#2d6a1e" />
          <ellipse cx="-4" cy="-4" rx="11" ry="18" fill="#3a8526" opacity="0.7" />
          <ellipse cx="4" cy="-2" rx="9" ry="16" fill="#2d7520" opacity="0.5" />
          {/* Pistils — orange/amber, comic style */}
          {[...Array(10)].map((_, i) => {
            const angle = (i / 10) * Math.PI * 2;
            return (
              <line
                key={i}
                x1={Math.cos(angle) * 10}
                y1={Math.sin(angle) * 16 - 3}
                x2={Math.cos(angle) * 18}
                y2={Math.sin(angle) * 24 - 3}
                stroke="#E6852E"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.7"
              />
            );
          })}
          {/* Purple trichome splashes — matching logo purple */}
          <circle cx="-8" cy="-10" r="2" fill="#8B5CF6" opacity="0.3" />
          <circle cx="6" cy="-15" r="1.5" fill="#8B5CF6" opacity="0.25" />
          <circle cx="10" cy="5" r="2.5" fill="#8B5CF6" opacity="0.2" />
        </g>

        {/* Small buds at branch junctions */}
        {[
          { x: 125, y: 175 },
          { x: 295, y: 175 },
          { x: 115, y: 270 },
          { x: 305, y: 270 },
        ].map((bud, i) => (
          <g key={i} transform={`translate(${bud.x}, ${bud.y})`}>
            <ellipse cx="0" cy="0" rx="6" ry="9" fill="#1a3d10" />
            <ellipse cx="0" cy="0" rx="4.5" ry="7" fill="#2d6a1e" />
          </g>
        ))}

        {/* Crimson/pink accent splashes — graffiti style, matching logo */}
        <circle cx="160" cy="200" r="4" fill="#E63462" opacity="0.15" />
        <circle cx="280" cy="240" r="3" fill="#E63462" opacity="0.12" />
        <circle cx="140" cy="310" r="5" fill="#8B5CF6" opacity="0.1" />
        <circle cx="290" cy="180" r="3.5" fill="#8B5CF6" opacity="0.12" />
      </svg>

      {/* Ground / soil line */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: "30%",
          transform: `translateY(${groundOffset * 0.1}px)`,
          background: `linear-gradient(180deg,
            transparent 0%,
            rgba(30,23,16,0.3) 10%,
            rgba(30,23,16,0.7) 30%,
            #1E1710 50%,
            #170F0A 100%
          )`,
        }}
      />

      {/* Soil texture at ground level */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: "20%",
          transform: `translateY(${groundOffset * 0.05}px)`,
          background: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='d'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' seed='3'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23d)' opacity='0.15'/%3E%3C/svg%3E\")",
          backgroundSize: "256px",
          mixBlendMode: "overlay",
          opacity: 0.5,
        }}
      />
    </div>
  );
}

function LeafShape({ scale = 1 }: { scale?: number }) {
  // Comic/graffiti style — thick outlines, bold fills, rougher edges
  const fingers = [
    // [path] — center finger (longest)
    "M0,0 C-5,-28 -4,-55 0,-75 C4,-55 5,-28 0,0Z",
    // Inner pair
    "M0,0 C-12,-22 -20,-45 -17,-62 C-11,-43 -6,-24 0,0Z",
    "M0,0 C12,-22 20,-45 17,-62 C11,-43 6,-24 0,0Z",
    // Middle pair
    "M0,0 C-17,-16 -33,-30 -35,-48 C-27,-30 -14,-16 0,0Z",
    "M0,0 C17,-16 33,-30 35,-48 C27,-30 14,-16 0,0Z",
    // Outer pair
    "M0,0 C-20,-9 -38,-14 -42,-28 C-33,-16 -17,-9 0,0Z",
    "M0,0 C20,-9 38,-14 42,-28 C33,-16 17,-9 0,0Z",
  ];

  return (
    <g transform={`scale(${scale})`}>
      {/* Dark outline layer — comic book style */}
      <g fill="#0d2a08" opacity="0.9">
        {fingers.map((d, i) => (
          <path key={`outline-${i}`} d={d} stroke="#0d2a08" strokeWidth="3" strokeLinejoin="round" />
        ))}
      </g>
      {/* Fill layer */}
      <g fill="#2d6a1e" opacity="0.9">
        {fingers.map((d, i) => (
          <path key={`fill-${i}`} d={d} />
        ))}
      </g>
      {/* Highlight layer */}
      <g fill="#3a8526" opacity="0.4">
        {fingers.slice(0, 3).map((d, i) => (
          <path key={`hl-${i}`} d={d} transform="translate(1, -2) scale(0.85)" />
        ))}
      </g>
      {/* Veins — bold */}
      <g stroke="#1a4a12" strokeWidth="1.2" opacity="0.5" fill="none" strokeLinecap="round">
        <path d="M0,-2 L0,-68" />
        <path d="M0,-2 L-15,-55" />
        <path d="M0,-2 L15,-55" />
        <path d="M0,-2 L-30,-42" />
        <path d="M0,-2 L30,-42" />
        <path d="M0,-2 L-36,-24" />
        <path d="M0,-2 L36,-24" />
      </g>
    </g>
  );
}
