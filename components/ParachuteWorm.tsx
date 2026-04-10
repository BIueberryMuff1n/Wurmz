"use client";

import { useScroll } from "./ScrollContext";

export default function ParachuteWorm() {
  const { scrollY } = useScroll();

  const landingScroll = 600;
  const progress = Math.min(1, scrollY / landingScroll);

  const yPos = 8 + progress * 54;
  const sway = Math.sin(scrollY * 0.008) * 2;
  const scale = 0.3 + progress * 0.7;
  const chuteOpacity = Math.max(0, 1 - Math.max(0, (progress - 0.7) / 0.3));
  const wormOpacity = progress >= 0.85 ? Math.max(0, 1 - (progress - 0.85) / 0.15) : 1;

  return (
    <>
      {/* === DESCENDING WORM WITH PARACHUTE + BACKPACK === */}
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
            {/* Canopy — crimson with panels */}
            <path
              d="M8,55 Q10,8 60,5 Q110,8 112,55"
              fill="#C43A3A"
              opacity="0.85"
              stroke="rgba(40,12,8,0.6)"
              strokeWidth="2.5"
            />
            {/* Canopy highlight */}
            <path
              d="M25,15 Q60,5 95,15"
              fill="none"
              stroke="rgba(220,100,80,0.3)"
              strokeWidth="2"
            />
            {/* Panel lines */}
            <path d="M35,10 Q36,50 34,55" stroke="rgba(40,12,8,0.3)" strokeWidth="1" fill="none" />
            <path d="M60,5 Q60,48 60,55" stroke="rgba(40,12,8,0.3)" strokeWidth="1" fill="none" />
            <path d="M85,10 Q84,50 86,55" stroke="rgba(40,12,8,0.3)" strokeWidth="1" fill="none" />
            {/* Strings */}
            <line x1="14" y1="55" x2="48" y2="80" stroke="rgba(61,43,31,0.5)" strokeWidth="0.8" />
            <line x1="38" y1="55" x2="52" y2="80" stroke="rgba(61,43,31,0.4)" strokeWidth="0.6" />
            <line x1="60" y1="55" x2="60" y2="80" stroke="rgba(61,43,31,0.5)" strokeWidth="0.8" />
            <line x1="82" y1="55" x2="68" y2="80" stroke="rgba(61,43,31,0.4)" strokeWidth="0.6" />
            <line x1="106" y1="55" x2="72" y2="80" stroke="rgba(61,43,31,0.5)" strokeWidth="0.8" />
          </svg>

          {/* Worm body with backpack */}
          <svg width="70" height="45" viewBox="0 0 70 45">
            {/* Backpack — behind the worm, olive green */}
            <rect
              x="8" y="2" width="20" height="24" rx="4" ry="4"
              fill="#4A5A30"
              stroke="rgba(30,40,15,0.7)"
              strokeWidth="2"
            />
            {/* Backpack flap */}
            <rect
              x="10" y="2" width="16" height="8" rx="3" ry="3"
              fill="#556B35"
              stroke="rgba(30,40,15,0.5)"
              strokeWidth="1"
            />
            {/* Backpack buckle */}
            <rect x="16" y="9" width="4" height="3" rx="1" fill="#8B7355" />
            {/* Backpack strap visible */}
            <line x1="18" y1="14" x2="28" y2="16" stroke="rgba(30,40,15,0.5)" strokeWidth="1.5" />

            {/* Worm body */}
            <rect
              x="5" y="12" width="58" height="26" rx="13" ry="13"
              fill="none" stroke="rgba(40,12,8,0.7)" strokeWidth="2.5"
            />
            <rect
              x="5" y="12" width="58" height="26" rx="13" ry="13"
              fill="#B83228" opacity="0.9"
            />
            {/* Segments */}
            {[20, 32, 44].map((x, i) => (
              <line
                key={i} x1={x} y1={16} x2={x} y2={34}
                stroke="rgba(60,15,10,0.2)" strokeWidth="1.5" strokeLinecap="round"
              />
            ))}
          </svg>
        </div>
      )}

      {/* === ABANDONED GEAR — stays on the surface after landing === */}
      {progress >= 0.85 && (
        <div
          className="pointer-events-none fixed z-[7]"
          style={{
            left: `calc(50% + 2vw)`,
            top: "62vh",
            opacity: Math.min(1, (progress - 0.85) / 0.15) * 0.4,
            transform: "rotate(15deg)",
          }}
        >
          <svg width="80" height="50" viewBox="0 0 80 50">
            {/* Collapsed parachute — crumpled fabric */}
            <ellipse cx="50" cy="15" rx="25" ry="8" fill="#9E2828" opacity="0.5" />
            <ellipse cx="48" cy="13" rx="18" ry="5" fill="#C43A3A" opacity="0.4" />
            {/* Tangled strings */}
            <path d="M30,15 Q35,25 40,20 Q45,15 50,22" stroke="rgba(61,43,31,0.3)" strokeWidth="0.6" fill="none" />
            <path d="M55,18 Q58,25 52,28" stroke="rgba(61,43,31,0.25)" strokeWidth="0.5" fill="none" />

            {/* Backpack — dropped on ground */}
            <rect
              x="5" y="20" width="22" height="26" rx="5" ry="5"
              fill="#4A5A30"
              stroke="rgba(30,40,15,0.5)"
              strokeWidth="1.5"
              opacity="0.6"
            />
            <rect
              x="7" y="20" width="18" height="9" rx="3" ry="3"
              fill="#556B35" opacity="0.5"
            />
            {/* Buckle */}
            <rect x="13" y="28" width="4" height="3" rx="1" fill="#8B7355" opacity="0.5" />
            {/* Dangling strap */}
            <path d="M15,46 Q20,50 25,48" stroke="rgba(30,40,15,0.3)" strokeWidth="1" fill="none" />
          </svg>
        </div>
      )}
    </>
  );
}
