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
        <svg width="160" height="70" viewBox="0 0 160 70">
          {/* Fuselage */}
          <ellipse cx="80" cy="35" rx="65" ry="16" fill="#2a2a2a" stroke="rgba(60,60,60,0.6)" strokeWidth="2" />
          {/* Cockpit windshield */}
          <path d="M135,28 Q145,35 135,42" fill="rgba(100,150,200,0.3)" stroke="rgba(80,80,80,0.5)" strokeWidth="1" />
          {/* Tail */}
          <path d="M18,35 L5,12 L25,28" fill="#2a2a2a" stroke="rgba(60,60,60,0.5)" strokeWidth="1.5" />
          <path d="M18,35 L10,50 L25,42" fill="#2a2a2a" stroke="rgba(60,60,60,0.5)" strokeWidth="1" />
          {/* Wing */}
          <path d="M60,35 L45,55 L110,55 L95,35" fill="#222" stroke="rgba(60,60,60,0.4)" strokeWidth="1" />
          {/* Windows */}
          {[55, 68, 81, 94, 107].map((x, i) => (
            <circle key={i} cx={x} cy={32} r={3} fill="rgba(180,220,255,0.15)" stroke="rgba(100,100,100,0.3)" strokeWidth="0.5" />
          ))}
          {/* Worm visible in one window */}
          <circle cx={81} cy={32} r={3} fill="rgba(200,60,50,0.4)" stroke="rgba(100,100,100,0.3)" strokeWidth="0.5" />
          {/* Engine */}
          <ellipse cx="70" cy="55" rx="8" ry="5" fill="#1a1a1a" stroke="rgba(60,60,60,0.5)" strokeWidth="1" />
          <ellipse cx="100" cy="55" rx="8" ry="5" fill="#1a1a1a" stroke="rgba(60,60,60,0.5)" strokeWidth="1" />
          {/* Red stripe — Wurmz branding */}
          <rect x="20" y="33" width="120" height="3" rx="1.5" fill="#C43A3A" opacity="0.6" />
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
