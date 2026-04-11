"use client";

import { useScroll } from "./ScrollContext";
import { useEffect, useState } from "react";

// Generate grass blades with deterministic randomness
function blade(seed: number) {
  const r = ((Math.sin(seed * 127.1 + 311.7) * 43758.5453) % 1 + 1) % 1;
  return r;
}

export default function AnimeGrass() {
  const { scrollY } = useScroll();
  const [time, setTime] = useState(0);

  // Animate wind gusts
  useEffect(() => {
    let frame: number;
    let t = 0;
    function tick() {
      t += 0.016; // ~60fps
      setTime(t);
      frame = requestAnimationFrame(tick);
    }
    tick();
    return () => cancelAnimationFrame(frame);
  }, []);

  // Fade out as you scroll past the surface
  const fadeOut = Math.max(0, 1 - scrollY / 600);
  if (fadeOut <= 0) return null;

  // Wind simulation — gusts come and go
  const windBase = Math.sin(time * 0.8) * 0.3; // slow sway
  const windGust = Math.sin(time * 2.5) * Math.sin(time * 0.3) * 0.6; // occasional gusts
  const wind = windBase + windGust;

  const bladeCount = 80;

  return (
    <div
      className="pointer-events-none absolute bottom-[8%] left-0 right-0 z-[8]"
      style={{
        height: "120px",
        opacity: fadeOut,
        transform: `translateY(${scrollY * 0.5}px)`,
      }}
    >
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 w-full h-full"
        style={{ overflow: "visible" }}
      >
        {Array.from({ length: bladeCount }, (_, i) => {
          const x = blade(i * 7) * 1440;
          const height = 25 + blade(i * 13) * 50; // 25-75px tall
          const width = 2 + blade(i * 19) * 3; // 2-5px wide
          const baseY = 100 + blade(i * 23) * 15; // slight Y variation

          // Each blade sways with wind, but with phase offset for natural look
          const phaseOffset = blade(i * 31) * Math.PI * 2;
          const bladeWind = wind * (0.5 + blade(i * 37) * 0.5); // each blade responds differently
          const sway = Math.sin(time * 1.2 + phaseOffset) * 3 + bladeWind * 15;

          // Color variation — dark greens with some lighter highlights
          const greenBase = 25 + Math.floor(blade(i * 41) * 35); // 25-60
          const greenR = 15 + Math.floor(blade(i * 43) * 25);
          const greenB = 5 + Math.floor(blade(i * 47) * 15);
          const alpha = 0.5 + blade(i * 53) * 0.4;

          // Control points for the curved blade
          const tipX = x + sway;
          const tipY = baseY - height;
          const cp1X = x + sway * 0.3;
          const cp1Y = baseY - height * 0.6;
          const cp2X = x + sway * 0.7;
          const cp2Y = baseY - height * 0.85;

          return (
            <path
              key={i}
              d={`M${x - width / 2},${baseY} C${cp1X - width / 3},${cp1Y} ${cp2X},${cp2Y} ${tipX},${tipY} C${cp2X + width / 3},${cp2Y} ${cp1X + width / 2},${cp1Y} ${x + width / 2},${baseY} Z`}
              fill={`rgba(${greenR},${greenBase},${greenB},${alpha})`}
              stroke={`rgba(${Math.max(0, greenR - 5)},${Math.max(0, greenBase - 10)},${greenB},${alpha * 0.5})`}
              strokeWidth="0.5"
            />
          );
        })}

        {/* Second layer — shorter grass in front for depth */}
        {Array.from({ length: 40 }, (_, i) => {
          const x = blade(i * 11 + 500) * 1440;
          const height = 15 + blade(i * 17 + 500) * 25;
          const width = 2 + blade(i * 23 + 500) * 2;
          const baseY = 108 + blade(i * 29 + 500) * 8;

          const phaseOffset = blade(i * 37 + 500) * Math.PI * 2;
          const bladeWind = wind * (0.6 + blade(i * 41 + 500) * 0.4);
          const sway = Math.sin(time * 1.5 + phaseOffset) * 2 + bladeWind * 10;

          const greenBase = 30 + Math.floor(blade(i * 43 + 500) * 30);
          const greenR = 20 + Math.floor(blade(i * 47 + 500) * 20);

          const tipX = x + sway;
          const tipY = baseY - height;

          return (
            <path
              key={`f${i}`}
              d={`M${x - width / 2},${baseY} Q${x + sway * 0.5},${baseY - height * 0.6} ${tipX},${tipY} Q${x + sway * 0.5 + width / 2},${baseY - height * 0.6} ${x + width / 2},${baseY} Z`}
              fill={`rgba(${greenR},${greenBase},8,0.6)`}
              stroke={`rgba(${greenR - 5},${greenBase - 8},5,0.3)`}
              strokeWidth="0.3"
            />
          );
        })}
      </svg>
    </div>
  );
}
