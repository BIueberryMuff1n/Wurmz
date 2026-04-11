"use client";

import { useScroll } from "./ScrollContext";

// Artifacts buried at various depths in the soil
// Each appears at a specific scroll range with very low opacity
const artifacts = [
  // Straw/topsoil zone (0.15-0.30)
  { type: "bottle-cap", x: 15, peakProgress: 0.20, sigma: 0.04, rotation: 25 },
  { type: "coin", x: 78, peakProgress: 0.25, sigma: 0.05, rotation: -15 },

  // Living soil zone (0.35-0.55)
  { type: "raw-pack", x: 85, peakProgress: 0.42, sigma: 0.06, rotation: 12 },
  { type: "key", x: 22, peakProgress: 0.48, sigma: 0.05, rotation: -30 },
  { type: "bone", x: 65, peakProgress: 0.38, sigma: 0.04, rotation: 45 },

  // Deep zone (0.55-0.75)
  { type: "lighter", x: 35, peakProgress: 0.62, sigma: 0.05, rotation: -20 },
  { type: "seed", x: 90, peakProgress: 0.58, sigma: 0.04, rotation: 10 },

  // Very deep (0.75-0.90) — ancient artifacts + skeleton
  { type: "trex-skull", x: 70, peakProgress: 0.82, sigma: 0.06, rotation: 15 },
  { type: "ammonite", x: 25, peakProgress: 0.78, sigma: 0.05, rotation: -25 },
  { type: "ribcage", x: 15, peakProgress: 0.88, sigma: 0.05, rotation: 8 },
  { type: "femur", x: 55, peakProgress: 0.85, sigma: 0.04, rotation: -35 },
  { type: "hand-bones", x: 82, peakProgress: 0.90, sigma: 0.05, rotation: 20 },

  // Geological artifacts — scientifically accurate deep soil
  { type: "quartz-cluster", x: 40, peakProgress: 0.92, sigma: 0.05, rotation: 0 },
  { type: "clay-layer", x: 50, peakProgress: 0.88, sigma: 0.08, rotation: 0 },
  { type: "bedrock", x: 10, peakProgress: 0.94, sigma: 0.04, rotation: 5 },
  { type: "bedrock", x: 75, peakProgress: 0.93, sigma: 0.04, rotation: -10 },
  { type: "humus-pocket", x: 60, peakProgress: 0.80, sigma: 0.06, rotation: 12 },
  { type: "groundwater", x: 30, peakProgress: 0.95, sigma: 0.05, rotation: 0 },
];

function gaussian(progress: number, peak: number, sigma: number): number {
  const diff = progress - peak;
  return Math.exp(-(diff * diff) / (2 * sigma * sigma));
}

export default function BuriedArtifacts() {
  const { progress } = useScroll();

  return (
    <div className="pointer-events-none fixed inset-0 z-[5]">
      {artifacts.map((artifact, i) => {
        // Deep artifacts (fossils) get higher opacity since they're special
        const baseOpacity = artifact.peakProgress > 0.7 ? 0.18 : 0.1;
        const opacity = gaussian(progress, artifact.peakProgress, artifact.sigma) * baseOpacity;
        if (opacity < 0.005) return null;

        // Y offset — artifact moves upward as you scroll past it
        // Creates the feeling of passing by, not frozen in place
        const scrollDelta = (progress - artifact.peakProgress) * 300;

        return (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${artifact.x}%`,
              top: `calc(45% - ${scrollDelta}px)`,
              opacity,
              transform: `rotate(${artifact.rotation}deg)`,
            }}
          >
            <ArtifactSVG type={artifact.type} />
          </div>
        );
      })}
    </div>
  );
}

function ArtifactSVG({ type }: { type: string }) {
  switch (type) {
    case "bottle-cap":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="9" fill="#888" stroke="#666" strokeWidth="1" />
          <circle cx="10" cy="10" r="6" fill="none" stroke="#777" strokeWidth="0.5" strokeDasharray="2 1" />
        </svg>
      );

    case "coin":
      return (
        <svg width="18" height="18" viewBox="0 0 18 18">
          <circle cx="9" cy="9" r="8" fill="#B8960A" stroke="#8A7008" strokeWidth="1" />
          <circle cx="9" cy="9" r="5.5" fill="none" stroke="#8A7008" strokeWidth="0.5" />
        </svg>
      );

    case "raw-pack":
      return (
        <svg width="35" height="22" viewBox="0 0 35 22">
          {/* RAW rolling paper pack — crumpled */}
          <rect x="1" y="1" width="33" height="20" rx="2" ry="2"
            fill="#C8A868" stroke="#A08040" strokeWidth="1" />
          {/* RAW branding area */}
          <rect x="4" y="4" width="27" height="14" rx="1" ry="1"
            fill="#B89850" opacity="0.6" />
          {/* RAW text */}
          <text x="8" y="14" fontSize="7" fill="#6B5020" fontFamily="sans-serif" fontWeight="bold" opacity="0.7">
            RAW
          </text>
          {/* Crumple fold lines */}
          <line x1="12" y1="1" x2="14" y2="21" stroke="rgba(100,75,35,0.15)" strokeWidth="0.5" />
          <line x1="25" y1="1" x2="23" y2="21" stroke="rgba(100,75,35,0.15)" strokeWidth="0.5" />
        </svg>
      );

    case "key":
      return (
        <svg width="22" height="10" viewBox="0 0 22 10">
          <rect x="0" y="3" width="14" height="4" rx="1" fill="#8B7355" />
          <circle cx="18" cy="5" r="4" fill="none" stroke="#8B7355" strokeWidth="2" />
          <rect x="4" y="5" width="2" height="3" fill="#8B7355" />
          <rect x="8" y="5" width="2" height="2.5" fill="#8B7355" />
        </svg>
      );

    case "bone":
      return (
        <svg width="24" height="8" viewBox="0 0 24 8">
          <rect x="5" y="2.5" width="14" height="3" rx="1.5" fill="#E8DCC8" />
          <circle cx="4" cy="2" r="2" fill="#E8DCC8" />
          <circle cx="4" cy="6" r="2" fill="#E8DCC8" />
          <circle cx="20" cy="2" r="2" fill="#E8DCC8" />
          <circle cx="20" cy="6" r="2" fill="#E8DCC8" />
        </svg>
      );

    case "lighter":
      return (
        <svg width="10" height="22" viewBox="0 0 10 22">
          <rect x="1" y="4" width="8" height="17" rx="2" ry="1" fill="#E63462" stroke="rgba(40,12,8,0.4)" strokeWidth="0.8" />
          <rect x="2.5" y="1" width="5" height="5" rx="1" fill="#888" />
          <circle cx="5" cy="3" r="1.5" fill="#AAA" />
        </svg>
      );

    case "seed":
      return (
        <svg width="8" height="12" viewBox="0 0 8 12">
          <ellipse cx="4" cy="6" rx="3.5" ry="5.5" fill="#4A3520" />
          <ellipse cx="4" cy="5" rx="2" ry="3" fill="#5A4530" opacity="0.5" />
          <line x1="4" y1="1" x2="4" y2="11" stroke="#3A2510" strokeWidth="0.3" />
        </svg>
      );

    case "trex-skull":
      return (
        <svg width="180" height="140" viewBox="0 0 90 70">
          {/* Concrete block — buried chunk of foundation */}
          <rect x="5" y="20" width="80" height="48" rx="3" ry="3"
            fill="#4A4540" stroke="rgba(60,55,50,0.6)" strokeWidth="2" />
          {/* Concrete texture — cracks and pitting */}
          <line x1="10" y1="35" x2="35" y2="38" stroke="rgba(80,75,65,0.3)" strokeWidth="0.5" />
          <line x1="50" y1="25" x2="70" y2="30" stroke="rgba(80,75,65,0.25)" strokeWidth="0.5" />
          <line x1="25" y1="55" x2="60" y2="52" stroke="rgba(80,75,65,0.2)" strokeWidth="0.5" />
          {/* Rebar sticking out */}
          <line x1="82" y1="30" x2="88" y2="28" stroke="#6B5A45" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="82" y1="50" x2="87" y2="52" stroke="#6B5A45" strokeWidth="1.5" strokeLinecap="round" />

          {/* === GRAFFITI T-REX SKULL on the concrete === */}
          {/* Drawn with thick spray-paint style strokes */}
          {/* Cranium — bold outline */}
          <path d="M18,42 C18,32 28,26 40,26 C52,26 60,32 62,40 C63,44 62,48 58,50"
            fill="none" stroke="#E63462" strokeWidth="2.5" strokeLinecap="round" />
          {/* Jaw */}
          <path d="M18,42 C18,48 22,54 30,56 C38,58 48,56 58,50"
            fill="none" stroke="#E63462" strokeWidth="2.5" strokeLinecap="round" />
          {/* Eye socket — hollow circle */}
          <circle cx="44" cy="36" r="5" fill="none" stroke="#E63462" strokeWidth="2" />
          {/* Teeth — jagged */}
          <path d="M24,44 L26,50 L28,44 L31,51 L34,44 L37,50 L40,44 L43,50 L46,45 L49,50"
            fill="none" stroke="#8B5CF6" strokeWidth="1.8" strokeLinecap="round" />
          {/* Nostril */}
          <circle cx="57" cy="44" r="2.5" fill="none" stroke="#E63462" strokeWidth="1.5" />
          {/* Spray paint drips */}
          <line x1="25" y1="56" x2="25" y2="62" stroke="#E63462" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
          <line x1="40" y1="58" x2="40" y2="64" stroke="#8B5CF6" strokeWidth="0.8" strokeLinecap="round" opacity="0.4" />
          {/* "WURMZ" tag below the skull */}
          <text x="22" y="66" fontSize="6" fill="#E63462" fontFamily="sans-serif" fontWeight="bold" opacity="0.6"
            transform="rotate(-3 22 66)">WURMZ</text>
        </svg>
      );

    case "ammonite":
      return (
        <svg width="30" height="30" viewBox="0 0 30 30">
          {/* Ammonite fossil — spiral shell */}
          <path d="M15,15 C15,10 20,8 22,12 C24,16 20,20 16,18 C12,16 14,12 17,13 C19,14 18,16 16,16" fill="none" stroke="#B8A88A" strokeWidth="1.2" />
          {/* Outer spiral */}
          <circle cx="15" cy="15" r="12" fill="none" stroke="#B8A88A" strokeWidth="1" />
          {/* Ridge lines */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => {
            const rad = (deg * Math.PI) / 180;
            return (
              <line key={i}
                x1={15 + Math.cos(rad) * 8} y1={15 + Math.sin(rad) * 8}
                x2={15 + Math.cos(rad) * 12} y2={15 + Math.sin(rad) * 12}
                stroke="#A09070" strokeWidth="0.5" opacity="0.4"
              />
            );
          })}
        </svg>
      );

    case "ribcage":
      return (
        <svg width="120" height="80" viewBox="0 0 60 40">
          {/* Spine */}
          <line x1="30" y1="2" x2="30" y2="38" stroke="#D4C8B0" strokeWidth="2" strokeLinecap="round" />
          {/* Ribs — curved bones off the spine */}
          {[6, 12, 18, 24, 30].map((y, i) => (
            <g key={i}>
              <path d={`M30,${y} C22,${y - 2} 14,${y + 1} 10,${y + 4}`} fill="none" stroke="#D4C8B0" strokeWidth="1.2" strokeLinecap="round" />
              <path d={`M30,${y} C38,${y - 2} 46,${y + 1} 50,${y + 4}`} fill="none" stroke="#D4C8B0" strokeWidth="1.2" strokeLinecap="round" />
            </g>
          ))}
        </svg>
      );

    case "femur":
      return (
        <svg width="80" height="30" viewBox="0 0 50 18">
          {/* Femur bone — classic bone shape */}
          <path d="M5,9 C5,5 8,4 10,6 L40,6 C42,4 45,5 45,9 C45,13 42,14 40,12 L10,12 C8,14 5,13 5,9Z" fill="#D4C8B0" stroke="#B8A890" strokeWidth="0.8" />
          {/* Joint knobs */}
          <circle cx="7" cy="9" r="4" fill="#D4C8B0" stroke="#B8A890" strokeWidth="0.6" />
          <circle cx="43" cy="9" r="4" fill="#D4C8B0" stroke="#B8A890" strokeWidth="0.6" />
        </svg>
      );

    case "hand-bones":
      return (
        <svg width="60" height="70" viewBox="0 0 30 35">
          {/* Metacarpals — 5 finger bones */}
          {[4, 10, 16, 22, 26].map((x, i) => (
            <g key={i}>
              <line x1={x} y1={28} x2={x + (i - 2) * 1.5} y2={8 - i * 0.5} stroke="#D4C8B0" strokeWidth="1.2" strokeLinecap="round" />
              {/* Knuckle */}
              <circle cx={x + (i - 2) * 1.5} cy={8 - i * 0.5} r="1.5" fill="#D4C8B0" />
              {/* Fingertip bone */}
              <line x1={x + (i - 2) * 1.5} y1={8 - i * 0.5} x2={x + (i - 2) * 2.5} y2={2 - i * 0.3} stroke="#D4C8B0" strokeWidth="1" strokeLinecap="round" />
            </g>
          ))}
          {/* Palm */}
          <rect x="2" y="25" width="26" height="8" rx="3" fill="#D4C8B0" stroke="#B8A890" strokeWidth="0.5" />
        </svg>
      );

    case "quartz-cluster":
      return (
        <svg width="70" height="60" viewBox="0 0 35 30">
          {/* Quartz crystal cluster — hexagonal prisms */}
          {/* Tall center crystal */}
          <polygon points="17,2 20,4 20,18 17,20 14,18 14,4" fill="rgba(220,225,240,0.4)" stroke="rgba(200,210,230,0.6)" strokeWidth="0.6" />
          {/* Left crystal — shorter, angled */}
          <polygon points="10,8 13,6 13,18 10,20 7,18 7,10" fill="rgba(210,220,235,0.35)" stroke="rgba(190,200,220,0.5)" strokeWidth="0.5" />
          {/* Right crystal */}
          <polygon points="24,6 27,8 27,20 24,22 21,20 21,8" fill="rgba(215,222,238,0.3)" stroke="rgba(195,205,225,0.5)" strokeWidth="0.5" />
          {/* Small crystal */}
          <polygon points="5,14 7,13 7,20 5,21 3,20 3,15" fill="rgba(205,215,230,0.25)" stroke="rgba(185,195,215,0.4)" strokeWidth="0.4" />
          {/* Internal facet highlights */}
          <line x1="17" y1="4" x2="17" y2="18" stroke="rgba(240,245,255,0.15)" strokeWidth="0.3" />
          <line x1="24" y1="9" x2="24" y2="19" stroke="rgba(240,245,255,0.12)" strokeWidth="0.3" />
        </svg>
      );

    case "clay-layer":
      return (
        <svg width="200" height="20" viewBox="0 0 100 10">
          {/* Sedimentary clay band — horizontal stripe */}
          <rect x="0" y="2" width="100" height="6" rx="1" fill="rgba(120,85,55,0.25)" />
          <rect x="0" y="3" width="100" height="4" rx="0.5" fill="rgba(100,70,45,0.2)" />
          {/* Undulating top edge */}
          <path d="M0,2 Q10,1 20,2.5 Q30,3.5 40,2 Q50,0.5 60,2 Q70,3 80,1.5 Q90,0 100,2" fill="none" stroke="rgba(110,78,48,0.2)" strokeWidth="0.5" />
        </svg>
      );

    case "bedrock":
      return (
        <svg width="80" height="50" viewBox="0 0 40 25">
          {/* Angular bedrock fragment */}
          <polygon points="5,20 8,5 15,2 25,4 35,8 38,18 30,23 12,22" fill="rgba(80,75,70,0.3)" stroke="rgba(100,95,88,0.25)" strokeWidth="0.8" />
          {/* Crack lines */}
          <line x1="15" y1="3" x2="22" y2="15" stroke="rgba(60,55,50,0.15)" strokeWidth="0.4" />
          <line x1="25" y1="5" x2="28" y2="18" stroke="rgba(60,55,50,0.12)" strokeWidth="0.3" />
          {/* Mineral vein */}
          <path d="M10,10 Q18,8 26,12 Q32,14 36,16" fill="none" stroke="rgba(180,170,150,0.15)" strokeWidth="0.5" />
        </svg>
      );

    case "humus-pocket":
      return (
        <svg width="60" height="40" viewBox="0 0 30 20">
          {/* Decomposed organic matter — dark rich pocket */}
          <ellipse cx="15" cy="10" rx="14" ry="9" fill="rgba(25,18,10,0.35)" />
          <ellipse cx="15" cy="10" rx="11" ry="7" fill="rgba(35,25,15,0.25)" />
          {/* Organic fibers */}
          {[0, 1, 2, 3, 4].map((i) => (
            <line key={i}
              x1={5 + i * 5} y1={7 + (i % 2) * 3}
              x2={8 + i * 5} y2={12 - (i % 2) * 2}
              stroke="rgba(50,35,20,0.2)" strokeWidth="0.4" strokeLinecap="round"
            />
          ))}
        </svg>
      );

    case "groundwater":
      return (
        <svg width="140" height="30" viewBox="0 0 70 15">
          {/* Groundwater seepage — wet horizontal band with blue tint */}
          <rect x="0" y="4" width="70" height="7" rx="2" fill="rgba(40,60,90,0.12)" />
          {/* Water droplets / moisture */}
          {[8, 22, 35, 48, 60].map((x, i) => (
            <ellipse key={i} cx={x} cy={7 + (i % 2)} rx={2 + i % 3} ry={1.5} fill="rgba(60,90,130,0.1)" />
          ))}
          {/* Wet sheen */}
          <path d="M5,6 Q20,5 35,7 Q50,8 65,6" fill="none" stroke="rgba(80,120,170,0.08)" strokeWidth="0.5" />
        </svg>
      );

    default:
      return null;
  }
}
