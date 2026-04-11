"use client";

import { useScroll } from "./ScrollContext";

// Gaussian opacity curve
function gaussian(progress: number, peak: number, sigma: number): number {
  const diff = progress - peak;
  return Math.exp(-(diff * diff) / (2 * sigma * sigma));
}

function rampIn(progress: number, start: number, full: number): number {
  if (progress <= start) return 0;
  if (progress >= full) return 1;
  const t = (progress - start) / (full - start);
  return t * t * (3 - 2 * t);
}

export default function SoilBiology() {
  const { progress } = useScroll();

  // Each biological element peaks at a specific soil depth
  const myceliumOpacity = gaussian(progress, 0.40, 0.10) * 0.2;
  const nematodeOpacity = gaussian(progress, 0.38, 0.08) * 0.12;
  const castingsOpacity = rampIn(progress, 0.55, 0.75) * 0.15;
  const mushroomOpacity = gaussian(progress, 0.45, 0.06) * 0.18;
  const horizonOpacity = gaussian(progress, 0.20, 0.15) * 0.08;
  const waterTableOpacity = rampIn(progress, 0.85, 0.95) * 0.06;

  return (
    <div className="pointer-events-none fixed inset-0 z-[2]">

      {/* === SOIL HORIZON LABELS — faint letter marks at left edge === */}
      <div className="absolute left-3 md:left-6 inset-y-0" style={{ opacity: horizonOpacity }}>
        <div className="relative h-full">
          {/* O Horizon — organic layer */}
          <span
            className="absolute font-mono text-mycelium/40 text-[10px] tracking-widest"
            style={{ top: "25%", transform: "rotate(-90deg)" }}
          >
            O
          </span>
          {/* A Horizon — topsoil */}
          <span
            className="absolute font-mono text-mycelium/30 text-[10px] tracking-widest"
            style={{ top: "40%", transform: "rotate(-90deg)" }}
          >
            A
          </span>
          {/* B Horizon — subsoil */}
          <span
            className="absolute font-mono text-mycelium/20 text-[10px] tracking-widest"
            style={{ top: "60%", transform: "rotate(-90deg)" }}
          >
            B
          </span>
        </div>
      </div>

      {/* === MYCELIUM HYPHAL NETWORK — white branching threads === */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ opacity: myceliumOpacity }}
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
      >
        {/* Hyphal threads — thin white lines branching from root contact points */}
        <g stroke="rgba(245,240,230,0.6)" fill="none" strokeLinecap="round" strokeWidth="0.6">
          {/* Network 1 — left side */}
          <path d="M300,350 C320,340 340,345 360,330 C370,325 380,330 400,320" />
          <path d="M360,330 C365,340 370,350 380,345" />
          <path d="M400,320 C410,315 425,320 440,310" />
          <path d="M400,320 C405,330 415,335 430,340" />

          {/* Network 2 — center */}
          <path d="M680,400 C700,390 720,395 740,385 C750,380 770,385 790,375" />
          <path d="M740,385 C745,395 755,400 770,405" />
          <path d="M790,375 C800,380 815,375 830,370" />
          <path d="M680,400 C690,410 700,415 720,420" />

          {/* Network 3 — right side */}
          <path d="M1050,450 C1070,440 1090,445 1110,435" />
          <path d="M1110,435 C1120,430 1135,435 1150,425" />
          <path d="M1110,435 C1115,445 1125,450 1140,455" />
          <path d="M1050,450 C1055,460 1065,465 1080,470" />
        </g>

        {/* Hyphal nodes — small bright dots where threads connect */}
        {[
          [360,330], [400,320], [440,310], [380,345],
          [740,385], [790,375], [770,405], [720,420],
          [1110,435], [1150,425], [1140,455], [1080,470],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={1.2} fill="rgba(245,240,230,0.5)" />
        ))}
      </svg>

      {/* === NEMATODES — microscopic squiggly organisms === */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ opacity: nematodeOpacity }}
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
      >
        {[
          { x: 250, y: 380, d: "M0,0 C3,-4 8,-2 12,-5 C15,-3 18,-6 22,-4" },
          { x: 600, y: 420, d: "M0,0 C2,3 6,1 9,4 C12,2 15,5 18,3" },
          { x: 900, y: 360, d: "M0,0 C4,-3 8,-1 12,-4 C16,-2 20,-5 24,-3" },
          { x: 1100, y: 440, d: "M0,0 C2,2 5,0 8,3 C11,1 14,4 17,2" },
          { x: 400, y: 500, d: "M0,0 C3,-2 7,-4 10,-2 C13,-4 16,-1 19,-3" },
        ].map((nem, i) => (
          <g key={i} transform={`translate(${nem.x},${nem.y})`}>
            <path
              d={nem.d}
              stroke="rgba(200,180,150,0.5)"
              strokeWidth="0.8"
              fill="none"
              strokeLinecap="round"
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; 2,-1; 0,0; -1,1; 0,0"
                dur={`${4 + i}s`}
                repeatCount="indefinite"
              />
            </path>
          </g>
        ))}
      </svg>

      {/* === WORM CASTINGS — granular clusters near worm zones === */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ opacity: castingsOpacity }}
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
      >
        {Array.from({ length: 12 }, (_, i) => {
          const cx = 100 + (i * 113) % 1240;
          const cy = 400 + (i * 67) % 400;
          return (
            <g key={i} transform={`translate(${cx},${cy})`}>
              {/* Cluster of small dark granules — worm castings */}
              {Array.from({ length: 5 + (i % 4) }, (_, j) => (
                <circle
                  key={j}
                  cx={(j * 3 - 5) + Math.sin(j * 2) * 2}
                  cy={(j * 2 - 4) + Math.cos(j * 3) * 2}
                  r={1.2 + (j % 3) * 0.5}
                  fill={`rgba(30,22,12,${0.4 + (j % 3) * 0.15})`}
                />
              ))}
            </g>
          );
        })}
      </svg>

      {/* === TINY MUSHROOM FRUITING BODIES — at root/mycelium junctions === */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ opacity: mushroomOpacity }}
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
      >
        {[
          [350, 340], [730, 390], [1080, 445], [480, 420], [880, 470],
        ].map(([x, y], i) => (
          <g key={i} transform={`translate(${x},${y})`}>
            {/* Tiny mushroom — stem + cap */}
            <line x1={0} y1={0} x2={0} y2={-6} stroke="rgba(220,200,170,0.5)" strokeWidth="1" />
            <ellipse cx={0} cy={-7} rx={3} ry={2} fill="rgba(180,150,100,0.4)" />
            <ellipse cx={0} cy={-7.5} rx={2.5} ry={1.5} fill="rgba(200,170,120,0.3)" />
          </g>
        ))}
      </svg>

      {/* === WATER TABLE HINT — faint blue at the very bottom === */}
      <div
        className="absolute inset-0"
        style={{
          opacity: waterTableOpacity,
          background: "linear-gradient(180deg, transparent 85%, rgba(40,60,90,0.3) 100%)",
        }}
      />
    </div>
  );
}
