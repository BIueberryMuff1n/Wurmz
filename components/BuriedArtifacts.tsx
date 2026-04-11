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

  // Very deep (0.75-0.90) — ancient artifacts
  { type: "trex-skull", x: 70, peakProgress: 0.82, sigma: 0.06, rotation: 15 },
  { type: "ammonite", x: 25, peakProgress: 0.78, sigma: 0.05, rotation: -25 },
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

        return (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${artifact.x}%`,
              top: "45%",
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

    default:
      return null;
  }
}
