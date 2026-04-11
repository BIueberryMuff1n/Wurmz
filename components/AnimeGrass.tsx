"use client";

import { useEffect, useState } from "react";

// Generate grass blades with deterministic randomness
function blade(seed: number) {
  const r = ((Math.sin(seed * 127.1 + 311.7) * 43758.5453) % 1 + 1) % 1;
  return r;
}

export default function AnimeGrass() {
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

  // Natural wind — mostly still, occasional gusts
  // Grass is calm most of the time, then a gust rolls through
  const gustCycle = Math.sin(time * 0.08); // very slow cycle — ~40 second period
  const isGusting = gustCycle > 0.7; // only gusting ~15% of the time
  const windStrength = isGusting ? 0.3 + (gustCycle - 0.7) * 1.5 : 0.03; // calm baseline, strong during gust
  const gustIntensity = isGusting ? Math.sin(time * 0.5) * 0.4 : 0;

  const bladeCount = 120;

  return (
    <div
      className="pointer-events-none absolute bottom-[10%] left-0 right-0"
      style={{ height: "120px" }}
    >
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 w-full h-full"
        style={{ overflow: "visible" }}
      >
        {Array.from({ length: bladeCount }, (_, i) => {
          const x = blade(i * 7) * 1440;
          const height = 30 + blade(i * 13) * 55; // 30-85px tall
          const width = 4 + blade(i * 19) * 5; // 4-9px wide — lush, thick blades
          const baseY = 90 + blade(i * 23) * 25; // staggered Y (range 90-115) to soften grass base

          // Wind wave propagates left to right — blades respond based on X position
          const wavePhase = x / 300 - time * 1.5; // wave moves right at speed 1.5
          const localWind = windStrength * Math.sin(wavePhase) + gustIntensity * Math.sin(wavePhase * 0.5 + time);
          const naturalVariation = blade(i * 31) * 0.4; // each blade slightly different
          const sway = localWind * (12 + naturalVariation * 8);

          // Color variation — vivid greens with dried/yellow and darker blades
          const colorRoll = blade(i * 61);
          let greenBase: number, greenR: number, greenB: number;
          if (colorRoll < 0.2) {
            // 20% dried/yellow-ish blades
            greenR = 60 + Math.floor(blade(i * 43) * 20); // 60-80
            greenBase = 40 + Math.floor(blade(i * 41) * 20); // 40-60
            greenB = 2 + Math.floor(blade(i * 47) * 5);
          } else if (colorRoll < 0.3) {
            // 10% darker green blades
            greenR = 10 + Math.floor(blade(i * 43) * 10); // 10-20
            greenBase = 30 + Math.floor(blade(i * 41) * 20); // 30-50
            greenB = 2 + Math.floor(blade(i * 47) * 6);
          } else {
            // 70% normal vivid greens
            greenBase = 50 + Math.floor(blade(i * 41) * 60); // 50-110
            greenR = 20 + Math.floor(blade(i * 43) * 30);
            greenB = 5 + Math.floor(blade(i * 47) * 10);
          }
          const alpha = 0.6 + blade(i * 53) * 0.35;

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

        {/* Extra-short blades to soften the grass base edge */}
        {Array.from({ length: 30 }, (_, i) => {
          const x = blade(i * 9 + 900) * 1440;
          const height = 6 + blade(i * 13 + 900) * 12; // very short: 6-18px
          const width = 2 + blade(i * 19 + 900) * 3;
          const baseY = 108 + blade(i * 23 + 900) * 12; // start lower: 108-120

          const wavePhase = x / 300 - time * 1.5;
          const localWind = windStrength * Math.sin(wavePhase);
          const sway = localWind * 4;

          const colorRoll = blade(i * 61 + 900);
          let gR: number, gG: number, gB: number;
          if (colorRoll < 0.3) {
            gR = 50 + Math.floor(blade(i * 43 + 900) * 20);
            gG = 35 + Math.floor(blade(i * 41 + 900) * 20);
            gB = 3;
          } else {
            gR = 15 + Math.floor(blade(i * 43 + 900) * 20);
            gG = 40 + Math.floor(blade(i * 41 + 900) * 40);
            gB = 5;
          }

          const tipX = x + sway;
          const tipY = baseY - height;

          return (
            <path
              key={`e${i}`}
              d={`M${x - width / 2},${baseY} Q${x + sway * 0.5},${baseY - height * 0.6} ${tipX},${tipY} Q${x + sway * 0.5 + width / 2},${baseY - height * 0.6} ${x + width / 2},${baseY} Z`}
              fill={`rgba(${gR},${gG},${gB},0.5)`}
              stroke={`rgba(${gR - 5},${gG - 8},${gB},0.25)`}
              strokeWidth="0.3"
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
          const fgWavePhase = x / 250 - time * 1.8;
          const fgWind = windStrength * Math.sin(fgWavePhase) + gustIntensity * Math.sin(fgWavePhase * 0.7 + time * 1.2);
          const sway = fgWind * (8 + blade(i * 41 + 500) * 6);

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
