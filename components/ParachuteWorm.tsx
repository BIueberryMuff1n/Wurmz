"use client";

import { useScroll } from "./ScrollContext";
import { useJump } from "./JumpController";

export default function ParachuteWorm() {
  const { scrollY } = useScroll();
  const { hasJumped } = useJump();

  if (!hasJumped) return null;

  const landingScroll = 600;
  const progress = Math.min(1, scrollY / landingScroll);

  const yPos = 15 + progress * 50;
  const sway = Math.sin(scrollY * 0.008) * 2;
  const scale = (0.25 + progress * 0.75);
  const chuteOpacity = Math.max(0, 1 - Math.max(0, (progress - 0.65) / 0.35));
  const wormOpacity = progress >= 0.85 ? Math.max(0, 1 - (progress - 0.85) / 0.15) : 1;

  return (
    <>
      {/* === DESCENDING WORM WITH PARACHUTE + SKATEBOARD + BACKPACK === */}
      {progress < 1 && (
        <div
          className="pointer-events-none fixed z-[8]"
          style={{
            left: `calc(50% + ${sway}vw)`,
            top: `${yPos}vh`,
            transform: `translateX(-50%) scale(${scale})`,
            opacity: wormOpacity,
            transformOrigin: "center center",
          }}
        >
          {/* Parachute */}
          <svg
            width="120"
            height="85"
            viewBox="0 0 120 85"
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1"
            style={{ opacity: chuteOpacity }}
          >
            {/* Canopy */}
            <path
              d="M8,55 Q10,8 60,5 Q110,8 112,55"
              fill="#C43A3A"
              opacity="0.85"
              stroke="rgba(40,12,8,0.6)"
              strokeWidth="2.5"
            />
            <path d="M25,15 Q60,5 95,15" fill="none" stroke="rgba(220,100,80,0.3)" strokeWidth="2" />
            <path d="M35,10 Q36,50 34,55" stroke="rgba(40,12,8,0.3)" strokeWidth="1" fill="none" />
            <path d="M60,5 Q60,48 60,55" stroke="rgba(40,12,8,0.3)" strokeWidth="1" fill="none" />
            <path d="M85,10 Q84,50 86,55" stroke="rgba(40,12,8,0.3)" strokeWidth="1" fill="none" />
            <line x1="14" y1="55" x2="48" y2="80" stroke="rgba(61,43,31,0.5)" strokeWidth="0.8" />
            <line x1="60" y1="55" x2="60" y2="80" stroke="rgba(61,43,31,0.5)" strokeWidth="0.8" />
            <line x1="106" y1="55" x2="72" y2="80" stroke="rgba(61,43,31,0.5)" strokeWidth="0.8" />
          </svg>

          {/* Worm + skateboard + backpack */}
          <svg width="80" height="55" viewBox="0 0 80 55">
            <defs>
              <linearGradient id="chute-worm-body" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#7A2818" />
                <stop offset="50%" stopColor="#C43A3A" />
                <stop offset="100%" stopColor="#8B2020" />
              </linearGradient>
            </defs>

            {/* Backpack — behind worm */}
            <rect x="6" y="2" width="18" height="20" rx="4" ry="4"
              fill="#4A3520" stroke="rgba(40,25,12,0.7)" strokeWidth="1.5" />
            <rect x="8" y="2" width="14" height="7" rx="3" ry="3"
              fill="#5A4530" stroke="rgba(40,25,12,0.5)" strokeWidth="0.8" />
            <rect x="13" y="8" width="4" height="2.5" rx="1" fill="#8B7355" />

            {/* Worm body */}
            <rect x="5" y="10" width="58" height="24" rx="12" ry="12"
              fill="none" stroke="rgba(40,12,8,0.7)" strokeWidth="2.5" />
            <rect x="5" y="10" width="58" height="24" rx="12" ry="12"
              fill="url(#chute-worm-body)" opacity="0.9" />
            {[20, 32, 44].map((x, i) => (
              <line key={i} x1={x} y1={14} x2={x} y2={30}
                stroke="rgba(60,15,10,0.2)" strokeWidth="1.5" strokeLinecap="round" />
            ))}

            {/* Face — side profile */}
            {/* Eye */}
            <ellipse cx="57" cy="17" rx="3" ry="2.5" fill="#1a0a05" />
            <circle cx="58" cy="16.5" r="1" fill="rgba(255,255,255,0.5)" />
            {/* Eyelid — droopy */}
            <path d="M53,14 Q57,17.5 61,14" fill="rgba(140,35,25,0.6)" />
            {/* Smirk */}
            <path d="M59,25 Q62,28 60,29" fill="none" stroke="#1a0a05" strokeWidth="1" strokeLinecap="round" />

            {/* RAW joint — tilted up from mouth */}
            <g transform="translate(60, 25) rotate(-30)">
              <polygon points="0,-0.8 12,-1.5 12,1.5 0,0.8" fill="#C8B088" stroke="rgba(140,110,70,0.4)" strokeWidth="0.3" />
              <rect x="-1.2" y="-0.8" width="2.4" height="1.6" rx="0.8" fill="#A08050" />
              <text x="3" y="0.5" fontSize="1.8" fill="rgba(100,80,45,0.12)" fontFamily="sans-serif" fontWeight="bold">RAW</text>
              <circle cx="13" cy="0" r="1.5" fill="#D4641A" />
              <circle cx="13" cy="0" r="1" fill="#F0A030" opacity="0.8" />
              <circle cx="13" cy="0" r="0.5" fill="#FFD080" opacity="0.6" />
              {/* Smoke */}
              <circle cx="15" cy="-2" r="1" fill="rgba(200,200,200,0.08)">
                <animate attributeName="cy" values="-2;-5;-2" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx="16" cy="-5" r="1.5" fill="rgba(200,200,200,0.05)">
                <animate attributeName="cy" values="-5;-8;-5" dur="4s" repeatCount="indefinite" />
              </circle>
            </g>

            {/* === SKATEBOARD === */}
            {/* Deck */}
            <rect x="10" y="36" width="50" height="5" rx="2.5" ry="2.5"
              fill="#2a2a2a" stroke="rgba(60,60,60,0.5)" strokeWidth="1" />
            {/* Grip tape texture */}
            <rect x="12" y="36.5" width="46" height="4" rx="2" ry="2"
              fill="#1a1a1a" opacity="0.6" />
            {/* Deck graphic — crimson stripe */}
            <rect x="20" y="38" width="20" height="1.5" rx="0.75" fill="#C43A3A" opacity="0.5" />
            {/* Kicktail — nose */}
            <path d="M58,38 Q64,36 62,34" fill="#2a2a2a" stroke="rgba(60,60,60,0.4)" strokeWidth="0.8" />
            {/* Kicktail — tail */}
            <path d="M12,38 Q6,36 8,34" fill="#2a2a2a" stroke="rgba(60,60,60,0.4)" strokeWidth="0.8" />
            {/* Trucks */}
            <rect x="18" y="41" width="10" height="2" rx="1" fill="#888" />
            <rect x="42" y="41" width="10" height="2" rx="1" fill="#888" />
            {/* Wheels */}
            <circle cx="19" cy="45" r="3" fill="#E8DCC8" stroke="#CCC" strokeWidth="0.5" />
            <circle cx="27" cy="45" r="3" fill="#E8DCC8" stroke="#CCC" strokeWidth="0.5" />
            <circle cx="43" cy="45" r="3" fill="#E8DCC8" stroke="#CCC" strokeWidth="0.5" />
            <circle cx="51" cy="45" r="3" fill="#E8DCC8" stroke="#CCC" strokeWidth="0.5" />
            {/* Wheel bearings */}
            <circle cx="19" cy="45" r="1" fill="#666" />
            <circle cx="27" cy="45" r="1" fill="#666" />
            <circle cx="43" cy="45" r="1" fill="#666" />
            <circle cx="51" cy="45" r="1" fill="#666" />
          </svg>
        </div>
      )}

      {/* === ABANDONED GEAR — stays on surface after landing === */}
      {progress >= 0.85 && (
        <div
          className="pointer-events-none fixed z-[7]"
          style={{
            left: "calc(50% + 1vw)",
            top: "63vh",
            opacity: Math.min(1, (progress - 0.85) / 0.15) * 0.35,
            transform: "rotate(8deg)",
          }}
        >
          <svg width="100" height="60" viewBox="0 0 100 60">
            {/* Collapsed parachute */}
            <ellipse cx="55" cy="10" rx="22" ry="7" fill="#9E2828" opacity="0.4" />
            <ellipse cx="53" cy="8" rx="15" ry="4" fill="#C43A3A" opacity="0.3" />
            <path d="M35,10 Q40,18 45,14 Q50,10 55,16" stroke="rgba(61,43,31,0.2)" strokeWidth="0.5" fill="none" />

            {/* Backpack */}
            <rect x="8" y="18" width="18" height="22" rx="4" ry="4"
              fill="#4A3520" opacity="0.4" stroke="rgba(40,25,12,0.3)" strokeWidth="1" />
            <rect x="10" y="18" width="14" height="7" rx="3" ry="3"
              fill="#5A4530" opacity="0.35" />

            {/* Skateboard — tipped on its side */}
            <g transform="translate(40, 35) rotate(-15)">
              <rect x="0" y="0" width="45" height="4" rx="2" ry="2"
                fill="#2a2a2a" opacity="0.4" stroke="rgba(60,60,60,0.2)" strokeWidth="0.5" />
              <circle cx="10" cy="5" r="2.5" fill="#E8DCC8" opacity="0.3" />
              <circle cx="35" cy="5" r="2.5" fill="#E8DCC8" opacity="0.3" />
            </g>
          </svg>
        </div>
      )}
    </>
  );
}
