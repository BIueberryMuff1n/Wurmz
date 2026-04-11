"use client";

import { useEffect, useState, useRef } from "react";
import { useScroll } from "./ScrollContext";

export default function WormTunnel() {
  const { progress: scrollProgress, documentHeight: pageHeight } = useScroll();
  const [wriggle, setWriggle] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const prevProgressRef = useRef(scrollProgress);
  const [isScrollingDown, setIsScrollingDown] = useState(true);

  useEffect(() => {
    const delta = scrollProgress - prevProgressRef.current;
    if (Math.abs(delta) > 0.001) {
      setIsScrollingDown(delta > 0);
    }
    prevProgressRef.current = scrollProgress;
  }, [scrollProgress]);

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
    "C500,1400 720,1450 720,1500",       // Approaching Grow section
    "C720,1550 -200,1600 -300,1650",     // EXIT LEFT — disappear into horizontal tunnel
    "C-400,1700 -300,1800 -200,1850",    // Stay hidden off-screen during Grow scroll
    "C-100,1900 200,1950 720,2000",      // Re-emerge after Grow
    "C750,2100 720,2200 720,2350",       // Re-center for Process
    "C690,2500 -150,2550 -200,2650",     // EXIT LEFT — signup
    "C-250,2750 300,2800 720,2900",      // Curve back
    "C750,3000 680,3100 720,3200",       // Final descent
    "C740,3300 720,3350 720,3400",       // Bottom
  ].join(" ");

  const totalLength = 8800;
  // Segmented worm: 6 segments spaced 0.008 apart = 0.04 total span + segment half-width
  const wormBodyLen = 0.01 * totalLength + 15; // ~103px effective body length with tight spacing

  // Tunnel only starts after parachute landing (~12% scroll)
  const tunnelStart = 0.12;
  const adjustedProgress = Math.max(0, (scrollProgress - tunnelStart) / (1 - tunnelStart));
  const wormProgress = adjustedProgress;

  // Tunnel reveals BEHIND the worm — never ahead.
  // The worm center is at adjustedProgress * totalLength along the path.
  // The worm's TAIL is half its body length behind center.
  // Clamp tunnel reveal to never exceed the worm's tail position.
  const wormCenter = adjustedProgress * totalLength;
  const wormTail = Math.max(0, wormCenter - wormBodyLen / 2);
  const tunnelReveal = Math.min(wormTail, adjustedProgress * totalLength * 0.85);

  // Fade out as worm approaches colony zone (0.75 → 0.9 = fully invisible)
  const fadeOpacity = adjustedProgress > 0.75
    ? Math.max(0, 1 - (adjustedProgress - 0.75) / 0.15)
    : 1;

  // Cherry flare: gaussian proximity to content section zones (0.25, 0.45, 0.65)
  const sectionZones = [0.25, 0.45, 0.65];
  const cherryFlare = sectionZones.reduce((max, zone) => {
    const dist = adjustedProgress - zone;
    const gauss = Math.exp(-(dist * dist) / (2 * 0.015 * 0.015)); // sigma=0.015
    return Math.max(max, gauss);
  }, 0);

  // Backward glance: at ~50% adjusted progress, the eye looks back
  const glanceDist = Math.abs(adjustedProgress - 0.5);
  const isGlancingBack = glanceDist < 0.02;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[3]"
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
        {adjustedProgress > 0.01 && <g opacity={fadeOpacity}>

        {/* Outer edge — rough dirt border */}
        <path
          d={tunnelPath}
          fill="none"
          stroke="rgba(61,43,31,0.25)"
          strokeWidth="40"
          strokeLinecap="round"
          strokeDasharray={totalLength}
          strokeDashoffset={totalLength - tunnelReveal}
        />

        {/* Tunnel wall — dark carved earth */}
        <path
          d={tunnelPath}
          fill="none"
          stroke="rgba(30,20,10,0.5)"
          strokeWidth="36"
          strokeLinecap="round"
          strokeDasharray={totalLength}
          strokeDashoffset={totalLength - tunnelReveal}
        />

        {/* Inner soil gradient — matches surrounding layers */}
        <path
          d={tunnelPath}
          fill="none"
          stroke="url(#tunnel-soil)"
          strokeWidth="32"
          strokeLinecap="round"
          strokeDasharray={totalLength}
          strokeDashoffset={totalLength - tunnelReveal}
        />

        {/* Tunnel depth shadow — darker center line */}
        <path
          d={tunnelPath}
          fill="none"
          stroke="rgba(10,6,3,0.4)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={totalLength}
          strokeDashoffset={totalLength - tunnelReveal}
        />

        {/* Subtle crimson glow along tunnel */}
        <path
          d={tunnelPath}
          fill="none"
          stroke="rgba(230,52,98,0.02)"
          strokeWidth="50"
          strokeLinecap="round"
          filter="url(#tunnel-glow)"
          strokeDasharray={totalLength}
          strokeDashoffset={totalLength - tunnelReveal}
        />

        {/* === HIDDEN EASTER EGG GRAFFITI scratched into tunnel walls === */}

        {/* ~15%: "dig deeper" */}
        {tunnelReveal >= totalLength * 0.15 && (
          <text
            style={{
              offsetPath: `path("${tunnelPath}")`,
              offsetDistance: "15%",
              offsetRotate: "auto",
            }}
            fontSize="5"
            fontFamily="'Courier New', monospace"
            fontWeight="bold"
            fill="#3D2B1F"
            opacity="0.07"
            dy={-28}
            letterSpacing="1.5"
            paintOrder="stroke"
            stroke="#3D2B1F"
            strokeWidth="0.3"
          >
            dig deeper
          </text>
        )}

        {/* ~25%: tiny scratched leaf doodle */}
        {tunnelReveal >= totalLength * 0.25 && (
          <g
            style={{
              offsetPath: `path("${tunnelPath}")`,
              offsetDistance: "25%",
              offsetRotate: "auto",
            }}
          >
            <path
              d="M0,-30 C2,-34 6,-35 8,-32 C6,-30 2,-29 0,-30 M1,-31 L5,-36 M3,-31.5 L4,-35"
              fill="none"
              stroke="#3D2B1F"
              strokeWidth="0.5"
              strokeLinecap="round"
              opacity="0.06"
            />
          </g>
        )}

        {/* ~35%: "wuz here" with worm emoji */}
        {tunnelReveal >= totalLength * 0.35 && (
          <text
            style={{
              offsetPath: `path("${tunnelPath}")`,
              offsetDistance: "35%",
              offsetRotate: "auto",
            }}
            fontSize="4.5"
            fontFamily="'Courier New', monospace"
            fontWeight="bold"
            fill="#F5F0E8"
            opacity="0.06"
            dy={30}
            letterSpacing="1"
            paintOrder="stroke"
            stroke="#F5F0E8"
            strokeWidth="0.2"
          >
            🪱 wuz here
          </text>
        )}

        {/* ~45%: "feed the soil" */}
        {tunnelReveal >= totalLength * 0.45 && (
          <text
            style={{
              offsetPath: `path("${tunnelPath}")`,
              offsetDistance: "45%",
              offsetRotate: "auto",
            }}
            fontSize="4"
            fontFamily="'Courier New', monospace"
            fontWeight="bold"
            fill="#3D2B1F"
            opacity="0.08"
            dy={-26}
            letterSpacing="2"
            paintOrder="stroke"
            stroke="#3D2B1F"
            strokeWidth="0.3"
          >
            feed the soil
          </text>
        )}

        {/* ~55%: small scratched mushroom doodle */}
        {tunnelReveal >= totalLength * 0.55 && (
          <g
            style={{
              offsetPath: `path("${tunnelPath}")`,
              offsetDistance: "55%",
              offsetRotate: "auto",
            }}
          >
            <path
              d="M0,-26 C-4,-30 -3,-35 0,-36 C3,-35 4,-30 0,-26 M0,-26 L0,-22 M-2,-23 L2,-23"
              fill="none"
              stroke="#F5F0E8"
              strokeWidth="0.5"
              strokeLinecap="round"
              opacity="0.06"
            />
          </g>
        )}

        {/* ~65%: "no shortcuts" */}
        {tunnelReveal >= totalLength * 0.65 && (
          <text
            style={{
              offsetPath: `path("${tunnelPath}")`,
              offsetDistance: "65%",
              offsetRotate: "auto",
            }}
            fontSize="4.5"
            fontFamily="'Courier New', monospace"
            fontWeight="bold"
            fill="#F5F0E8"
            opacity="0.07"
            dy={28}
            letterSpacing="1.5"
            paintOrder="stroke"
            stroke="#F5F0E8"
            strokeWidth="0.2"
          >
            no shortcuts
          </text>
        )}

        {/* ~72%: "420" */}
        {tunnelReveal >= totalLength * 0.72 && (
          <text
            style={{
              offsetPath: `path("${tunnelPath}")`,
              offsetDistance: "72%",
              offsetRotate: "auto",
            }}
            fontSize="6"
            fontFamily="'Courier New', monospace"
            fontWeight="bold"
            fill="#3D2B1F"
            opacity="0.09"
            dy={-27}
            letterSpacing="3"
            paintOrder="stroke"
            stroke="#3D2B1F"
            strokeWidth="0.4"
          >
            420
          </text>
        )}

        {/* ~78%: "if you can read this, you're underground" */}
        {tunnelReveal >= totalLength * 0.78 && (
          <text
            style={{
              offsetPath: `path("${tunnelPath}")`,
              offsetDistance: "78%",
              offsetRotate: "auto",
            }}
            fontSize="3.5"
            fontFamily="'Courier New', monospace"
            fontWeight="bold"
            fill="#F5F0E8"
            opacity="0.05"
            dy={30}
            letterSpacing="0.8"
            paintOrder="stroke"
            stroke="#F5F0E8"
            strokeWidth="0.15"
          >
            {"if you can read this, you're underground"}
          </text>
        )}

        </g>}

        {/* === THE WORM (at the digging front) — hidden until after parachute lands === */}
        {adjustedProgress > 0.01 && (
          <g opacity={fadeOpacity}>
            <WormBody tunnelPath={tunnelPath} progress={wormProgress} cherryFlare={cherryFlare} isGlancingBack={isGlancingBack} isScrollingDown={isScrollingDown} />
          </g>
        )}
      </svg>
    </div>
  );
}

function WormBody({
  tunnelPath,
  progress,
  cherryFlare,
  isGlancingBack,
  isScrollingDown,
}: {
  tunnelPath: string;
  progress: number;
  cherryFlare: number;
  isGlancingBack: boolean;
  isScrollingDown: boolean;
}) {
  const bodyLen = 140; // total worm length (logical)
  const bodyR = 16; // fills the tunnel width
  const segCount = 6; // number of body segments
  const segWidth = 30; // each segment width
  const segSpacing = 0.002; // 0.2% of path (~18px) — tight overlap, reads as one body
  const pathStyle = `path("${tunnelPath}")`;

  // Segment 0 = head (highest offset-distance), segment N-1 = tail (lowest)
  const segments = Array.from({ length: segCount }, (_, i) => {
    const segProgress = Math.max(0, progress - i * segSpacing);
    return {
      index: i,
      progress: segProgress,
      isHead: i === 0,
      isTail: i === segCount - 1,
    };
  });

  return (
    <>
      {/* Render segments tail-first so head draws on top */}
      {[...segments].reverse().map((seg) => (
        <g
          key={seg.index}
          style={{
            offsetPath: pathStyle,
            offsetDistance: `${seg.progress * 100}%`,
            offsetRotate: "auto",
          }}
        >
          {/* Outer stroke — thick dark outline */}
          <rect
            x={-segWidth / 2}
            y={-bodyR - 1}
            width={segWidth}
            height={bodyR * 2 + 2}
            rx={bodyR}
            ry={bodyR}
            fill="none"
            stroke="rgba(40,12,8,0.7)"
            strokeWidth="3"
          />

          {/* Main body fill */}
          <rect
            x={-segWidth / 2}
            y={-bodyR}
            width={segWidth}
            height={bodyR * 2}
            rx={bodyR}
            ry={bodyR}
            fill="url(#worm-body)"
            opacity="0.9"
          />

          {/* 3D roundness overlay */}
          <rect
            x={-segWidth / 2}
            y={-bodyR}
            width={segWidth}
            height={bodyR * 2}
            rx={bodyR}
            ry={bodyR}
            fill="url(#worm-body-v)"
          />

          {/* === SKATEBOARD on tail segment === */}
          {seg.isTail && isScrollingDown && (
            <g
              style={{
                transition: "opacity 0.3s ease-in-out",
              }}
            >
              {/* Deck */}
              <rect
                x={-20}
                y={bodyR + 2}
                width={40}
                height={4}
                rx={2}
                ry={2}
                fill="#2a2a2a"
                stroke="rgba(60,60,60,0.3)"
                strokeWidth="0.5"
              />
              {/* Front truck */}
              <rect x={-14} y={bodyR + 6} width={6} height={2} rx={0.5} ry={0.5} fill="#555" />
              {/* Rear truck */}
              <rect x={8} y={bodyR + 6} width={6} height={2} rx={0.5} ry={0.5} fill="#555" />
              {/* Wheels */}
              <circle cx={-14} cy={bodyR + 10} r={2.5} fill="#E8DCC8" opacity={0.6} />
              <circle cx={-8} cy={bodyR + 10} r={2.5} fill="#E8DCC8" opacity={0.6} />
              <circle cx={8} cy={bodyR + 10} r={2.5} fill="#E8DCC8" opacity={0.6} />
              <circle cx={14} cy={bodyR + 10} r={2.5} fill="#E8DCC8" opacity={0.6} />
            </g>
          )}

          {/* === FACE + JOINT + SMOKE on head segment === */}
          {seg.isHead && (
            <>
              {/* Eye group — flips during backward glance */}
              <g
                style={{
                  transformOrigin: `${segWidth / 2 - 4}px -5px`,
                  transform: isGlancingBack ? 'scaleX(-1)' : 'scaleX(1)',
                  transition: 'transform 0.25s ease-in-out',
                }}
              >
                {/* Single eye — half-lidded, stoned */}
                <ellipse cx={segWidth / 2 - 4} cy={-5} rx={5} ry={4} fill="#1a0a05" />
                {/* Eye white/iris */}
                <ellipse cx={segWidth / 2 - 3} cy={-5} rx={3} ry={2.5} fill="#2a1510" />
                <circle cx={segWidth / 2 - 2} cy={-4.5} r={1.5} fill="#1a0a05" />
                {/* Eye shine */}
                <circle cx={segWidth / 2 - 1} cy={-6} r={1} fill="rgba(255,255,255,0.6)" />
                {/* Heavy eyelid — droopy, stoned */}
                <path
                  d={`M${segWidth / 2 - 10},${-8} Q${segWidth / 2 - 4},${-3} ${segWidth / 2 + 2},${-7}`}
                  fill="rgba(140,35,25,0.7)"
                />
              </g>
              {/* Mouth — slight smirk */}
              <path
                d={`M${segWidth / 2 + 3},${4} Q${segWidth / 2 + 8},${7} ${segWidth / 2 + 11},${5}`}
                fill="none"
                stroke="#1a0a05"
                strokeWidth="1.5"
                strokeLinecap="round"
              />

              {/* === RAW JOINT === */}
              <g transform={`translate(${segWidth / 2 + 8}, 3) rotate(-30)`}>
                {/* Cone body */}
                <polygon
                  points="-4,-1.8 24,-3.5 24,3.5 -4,1.8"
                  fill="#C8B088"
                  stroke="rgba(140,110,70,0.5)"
                  strokeWidth="0.6"
                />
                {/* RAW paper texture */}
                <polygon
                  points="-3,-1.5 23,-3 23,3 -3,1.5"
                  fill="#D4BE95"
                  opacity="0.4"
                />
                {/* Paper crinkle/fold lines */}
                <line x1={3} y1={-1.6} x2={3} y2={1.6} stroke="rgba(120,95,55,0.15)" strokeWidth="0.4" />
                <line x1={8} y1={-2.2} x2={8} y2={2.2} stroke="rgba(120,95,55,0.15)" strokeWidth="0.4" />
                <line x1={13} y1={-2.6} x2={13} y2={2.6} stroke="rgba(120,95,55,0.12)" strokeWidth="0.4" />
                <line x1={18} y1={-3} x2={18} y2={3} stroke="rgba(120,95,55,0.12)" strokeWidth="0.4" />
                {/* RAW watermark */}
                <text x="6" y="0.8" fontSize="2.5" fill="rgba(100,80,45,0.12)" fontFamily="sans-serif" fontWeight="bold">RAW</text>
                {/* Crutch/filter */}
                <rect x={-5} y={-1.8} width={5} height={3.6} rx={1.5} ry={1.5} fill="#A08050" />
                <rect x={-4.5} y={-1.2} width={4} height={2.4} rx={1} ry={1} fill="#B89060" opacity="0.6" />
                {/* Spiral lines on crutch */}
                <line x1={-4} y1={-0.8} x2={-4} y2={0.8} stroke="rgba(80,60,30,0.2)" strokeWidth="0.3" />
                <line x1={-2.5} y1={-1} x2={-2.5} y2={1} stroke="rgba(80,60,30,0.2)" strokeWidth="0.3" />
                {/* Twisted tip */}
                <path d="M24,-3 Q28,-1 26,0 Q28,1 24,3" fill="#C4AA80" opacity="0.6" />
                {/* Cherry/ember */}
                <ellipse cx={26} cy={0} rx={3 + cherryFlare * 1.5} ry={2.5 + cherryFlare * 1} fill="#D4641A" />
                <ellipse cx={26} cy={0} rx={2 + cherryFlare * 1} ry={1.5 + cherryFlare * 0.8} fill="#F0A030" opacity={0.8 + cherryFlare * 0.2} />
                <ellipse cx={26} cy={0} rx={1 + cherryFlare * 0.8} ry={0.8 + cherryFlare * 0.5} fill="#FFD080" opacity={0.5 + cherryFlare * 0.5} />
                {/* Ember glow */}
                <ellipse cx={26} cy={0} rx={6 + cherryFlare * 5} ry={4.5 + cherryFlare * 4} fill={`rgba(240,144,48,${0.1 + cherryFlare * 0.2})`} />
              </g>

              {/* === SMOKE TRAIL === */}
              {[
                { cx: segWidth / 2 + 26, cy: -12, r: 1.5, o: 0.08 },
                { cx: segWidth / 2 + 28, cy: -20, r: 2, o: 0.06 },
                { cx: segWidth / 2 + 27, cy: -30, r: 2.75, o: 0.05 },
                { cx: segWidth / 2 + 24, cy: -42, r: 3.5, o: 0.03 },
                { cx: segWidth / 2 + 21, cy: -55, r: 4, o: 0.02 },
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
            </>
          )}
        </g>
      ))}
    </>
  );
}
