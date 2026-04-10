"use client";

import { useState, useEffect } from "react";

interface PlaneIntroProps {
  onJump: () => void;
  hasJumped: boolean;
}

export default function PlaneIntro({ onJump, hasJumped }: PlaneIntroProps) {
  const [planeX, setPlaneX] = useState(-20);
  const [showPrompt, setShowPrompt] = useState(false);

  // Plane flies in from left and stops at center
  useEffect(() => {
    if (hasJumped) return;

    let frame: number;
    let x = -20;
    const targetX = 42; // stops near center

    function animate() {
      if (x < targetX) {
        x += (targetX - x) * 0.015; // ease-out approach
        setPlaneX(x);
        frame = requestAnimationFrame(animate);
      } else {
        setPlaneX(targetX);
        setShowPrompt(true);
      }
    }
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [hasJumped]);

  // After jump — plane flies off to the right
  const [flyOff, setFlyOff] = useState(false);

  useEffect(() => {
    if (hasJumped) {
      setShowPrompt(false);
      setFlyOff(true);
    }
  }, [hasJumped]);

  useEffect(() => {
    if (!flyOff) return;
    let frame: number;
    let x = planeX;
    function animate() {
      x += 0.8;
      setPlaneX(x);
      if (x < 120) {
        frame = requestAnimationFrame(animate);
      }
    }
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [flyOff]);

  if (hasJumped && planeX > 110) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[15]">
      {/* Plane */}
      <div
        className="absolute"
        style={{
          left: `${planeX}%`,
          top: "15%",
          transform: "translateX(-50%)",
          transition: flyOff ? "none" : undefined,
        }}
      >
        <svg width="180" height="90" viewBox="0 0 180 90">
          {/* === BEAT-UP PROP PLANE — barely flying === */}

          {/* Fuselage — dented, uneven, patched */}
          <path
            d="M25,42 Q15,38 18,28 L140,25 Q150,28 148,42 Q150,52 140,55 L25,52 Q15,48 25,42Z"
            fill="#5A5040"
            stroke="rgba(40,30,20,0.8)"
            strokeWidth="2"
          />
          {/* Rust patches */}
          <ellipse cx="60" cy="35" rx="8" ry="5" fill="#6B4A2A" opacity="0.4" />
          <ellipse cx="100" cy="45" rx="6" ry="4" fill="#5A3A1A" opacity="0.3" />
          {/* Duct tape patch */}
          <rect x="85" y="28" width="12" height="8" rx="1" fill="#888" opacity="0.25" />
          <line x1="85" y1="32" x2="97" y2="32" stroke="rgba(120,120,120,0.2)" strokeWidth="0.5" />

          {/* Cockpit — cracked windshield */}
          <path d="M138,30 Q148,38 138,48" fill="rgba(80,120,160,0.2)" stroke="rgba(60,60,60,0.6)" strokeWidth="1.5" />
          {/* Crack in windshield */}
          <path d="M140,33 L143,38 L141,43" fill="none" stroke="rgba(200,200,200,0.2)" strokeWidth="0.5" />

          {/* Tail — bent slightly */}
          <path d="M22,40 L8,15 L28,30" fill="#4A4030" stroke="rgba(40,30,20,0.6)" strokeWidth="1.5" />
          <path d="M22,42 L12,58 L28,48" fill="#4A4030" stroke="rgba(40,30,20,0.5)" strokeWidth="1" />

          {/* Wings — one drooping more than the other */}
          <path d="M50,42 L38,62 L120,64 L108,42" fill="#4A4030" stroke="rgba(40,30,20,0.5)" strokeWidth="1.5" />
          {/* Wing patch */}
          <rect x="70" y="52" width="15" height="6" rx="1" fill="#888" opacity="0.15" />

          {/* Propeller — spinning (front) */}
          <circle cx="150" cy="38" r="3" fill="#333" />
          <line x1="150" y1="24" x2="150" y2="52" stroke="#444" strokeWidth="2.5" strokeLinecap="round" opacity="0.3">
            <animateTransform attributeName="transform" type="rotate" values="0 150 38;360 150 38" dur="0.15s" repeatCount="indefinite" />
          </line>

          {/* Windows — mismatched, some boarded up */}
          <circle cx="55" cy="36" r="3.5" fill="rgba(180,200,220,0.1)" stroke="rgba(80,70,60,0.5)" strokeWidth="1" />
          <circle cx="70" cy="35" r="3.5" fill="rgba(180,200,220,0.1)" stroke="rgba(80,70,60,0.5)" strokeWidth="1" />
          {/* Boarded up window */}
          <circle cx="85" cy="35" r="3.5" fill="#5A5040" stroke="rgba(80,70,60,0.5)" strokeWidth="1" />
          <line x1="82" y1="33" x2="88" y2="37" stroke="#6B5A40" strokeWidth="1.5" />
          <line x1="82" y1="37" x2="88" y2="33" stroke="#6B5A40" strokeWidth="1.5" />
          {/* Worm in window — red glow */}
          <circle cx="100" cy="35" r="3.5" fill="rgba(200,60,50,0.35)" stroke="rgba(80,70,60,0.5)" strokeWidth="1" />
          <circle cx="115" cy="36" r="3.5" fill="rgba(180,200,220,0.08)" stroke="rgba(80,70,60,0.5)" strokeWidth="1" />

          {/* ENGINE — left side, SMOKING */}
          <ellipse cx="60" cy="64" rx="10" ry="6" fill="#333" stroke="rgba(40,30,20,0.6)" strokeWidth="1.5" />
          {/* Engine smoke — black puffs trailing behind */}
          {[0, 1, 2, 3, 4].map((i) => (
            <circle
              key={`smoke-${i}`}
              cx={60 - 12 - i * 14}
              cy={64 + i * 2}
              r={4 + i * 3}
              fill="rgba(20,15,10,0.15)"
            >
              <animate
                attributeName="cy"
                values={`${64 + i * 2};${60 + i * 2};${64 + i * 2}`}
                dur={`${2 + i * 0.5}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="r"
                values={`${4 + i * 3};${6 + i * 3};${4 + i * 3}`}
                dur={`${2.5 + i * 0.3}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}

          {/* Right engine — working fine */}
          <ellipse cx="105" cy="64" rx="10" ry="6" fill="#333" stroke="rgba(40,30,20,0.5)" strokeWidth="1" />
        </svg>

        {/* "Click to Jump" prompt */}
        {showPrompt && !hasJumped && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onJump();
            }}
            className="pointer-events-auto absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap cursor-pointer"
            style={{
              animation: "bounce-soft 2s ease-in-out infinite",
            }}
          >
            <span className="font-display text-lg md:text-xl text-crimson-neon hover:text-mycelium transition-colors"
              style={{
                textShadow: "0 0 15px rgba(230,52,98,0.4)",
              }}
            >
              Click to Jump
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
