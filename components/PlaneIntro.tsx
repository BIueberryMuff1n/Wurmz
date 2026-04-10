"use client";

import { useState, useEffect } from "react";
import { useScroll } from "./ScrollContext";

interface PlaneIntroProps {
  onJump: () => void;
  hasJumped: boolean;
}

export default function PlaneIntro({ onJump, hasJumped }: PlaneIntroProps) {
  const [planeX, setPlaneX] = useState(-20);
  const [showPrompt, setShowPrompt] = useState(false);

  // Plane loops slowly across the sky until you click
  useEffect(() => {
    if (hasJumped) return;

    let frame: number;
    let x = -25;
    const speed = 0.04; // slow cruise

    function animate() {
      x += speed;
      // Loop — when it goes off right, come back from left
      if (x > 110) x = -25;
      setPlaneX(x);
      setShowPrompt(true); // always show prompt while looping
      frame = requestAnimationFrame(animate);
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

  const { scrollY } = useScroll();

  // Plane fades out with the sky — same rate as surface scene
  const planeFadeOut = Math.max(0, 1 - scrollY / 800);

  if (planeFadeOut <= 0) return null;
  if (hasJumped && planeX > 110) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[15]"
      style={{
        opacity: planeFadeOut,
        transform: `translateY(${-scrollY * 0.2}px)`,
      }}
    >
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
        <svg className="w-[120px] h-[66px] md:w-[200px] md:h-[110px]" viewBox="0 0 200 110">
          {/* === VINTAGE BIPLANE — Wurmz colors, graffiti-covered === */}

          {/* === LOWER WING (behind fuselage) === */}
          <path d="M35,72 L25,78 L155,78 L145,72" fill="#E63462" stroke="rgba(30,18,10,0.7)" strokeWidth="1.5" />
          {/* Wing wear/rust */}
          <ellipse cx="80" cy="75" rx="15" ry="2.5" fill="#3D2B1F" opacity="0.3" />
          <ellipse cx="120" cy="76" rx="10" ry="2" fill="#8B5CF6" opacity="0.2" />

          {/* === FUSELAGE — dark earth brown, round nose === */}
          <path
            d="M30,48 Q20,44 22,38 L145,35 Q160,38 162,48 Q160,58 145,60 L30,58 Q20,54 30,48Z"
            fill="#3D2B1F"
            stroke="rgba(20,12,6,0.9)"
            strokeWidth="2"
          />

          {/* Graffiti on fuselage */}
          <ellipse cx="65" cy="46" rx="12" ry="6" fill="#E63462" opacity="0.3" />
          <ellipse cx="100" cy="50" rx="8" ry="5" fill="#8B5CF6" opacity="0.25" />
          <rect x="95" y="53" width="3" height="6" rx="1.5" fill="#8B5CF6" opacity="0.15" /> {/* drip */}
          <ellipse cx="130" cy="45" rx="10" ry="5" fill="#E63462" opacity="0.2" />
          {/* Tags */}
          <text x="55" y="52" fontSize="5" fill="#E63462" opacity="0.45" fontFamily="sans-serif" fontWeight="bold" transform="rotate(-3 55 52)">WURMZ</text>
          <text x="108" y="43" fontSize="3.5" fill="#F5F0E8" opacity="0.15" fontFamily="sans-serif" transform="rotate(2 108 43)">DIG DEEP</text>
          <text x="78" y="56" fontSize="4" fill="#8B5CF6" opacity="0.3" fontFamily="sans-serif" fontWeight="bold">420</text>

          {/* Duct tape */}
          <rect x="88" y="38" width="12" height="7" rx="1" fill="#777" opacity="0.18" />

          {/* === RADIAL ENGINE NOSE — round, rusty === */}
          <circle cx="162" cy="48" r="10" fill="#1E1710" stroke="rgba(20,12,6,0.8)" strokeWidth="2" />
          {/* Engine cylinders */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
            const angle = (i / 8) * Math.PI * 2;
            return (
              <circle
                key={`cyl-${i}`}
                cx={162 + Math.cos(angle) * 7}
                cy={48 + Math.sin(angle) * 7}
                r={2}
                fill="#2a1c10"
                stroke="rgba(20,12,6,0.5)"
                strokeWidth="0.5"
              />
            );
          })}
          <circle cx="162" cy="48" r="3" fill="#3D2B1F" />

          {/* === PROPELLER — spinning === */}
          <g>
            <line x1="172" y1="34" x2="172" y2="62" stroke="#3D2B1F" strokeWidth="3.5" strokeLinecap="round" opacity="0.5">
              <animateTransform attributeName="transform" type="rotate" values="0 172 48;360 172 48" dur="0.12s" repeatCount="indefinite" />
            </line>
          </g>

          {/* === UPPER WING (in front) === */}
          <path d="M35,28 L25,22 L155,22 L145,28" fill="#E63462" stroke="rgba(30,18,10,0.7)" strokeWidth="1.5" />
          {/* Wing graffiti */}
          <ellipse cx="90" cy="25" rx="20" ry="2.5" fill="#3D2B1F" opacity="0.3" />
          <text x="75" y="26" fontSize="3.5" fill="#F5F0E8" opacity="0.12" fontFamily="sans-serif" fontWeight="bold">SOIL GANG</text>

          {/* Wing struts connecting upper and lower */}
          <line x1="50" y1="28" x2="50" y2="72" stroke="#4A3520" strokeWidth="1.5" />
          <line x1="130" y1="28" x2="130" y2="72" stroke="#4A3520" strokeWidth="1.5" />
          {/* Cross wires */}
          <line x1="50" y1="28" x2="130" y2="72" stroke="#4A3520" strokeWidth="0.5" opacity="0.4" />
          <line x1="130" y1="28" x2="50" y2="72" stroke="#4A3520" strokeWidth="0.5" opacity="0.4" />

          {/* === TAIL === */}
          <path d="M28,45 L10,22 L30,35" fill="#E63462" stroke="rgba(30,18,10,0.6)" strokeWidth="1.5" />
          <path d="M28,52 L10,70 L30,60" fill="#E63462" stroke="rgba(30,18,10,0.5)" strokeWidth="1" />
          {/* Tail tag */}
          <circle cx="18" cy="30" r="4" fill="#8B5CF6" opacity="0.25" />

          {/* === OPEN COCKPIT === */}
          <path d="M115,35 Q120,28 140,30 L140,38 Q125,36 115,35" fill="rgba(40,60,80,0.1)" stroke="rgba(30,18,10,0.5)" strokeWidth="1" />
          {/* Cockpit rim */}
          <path d="M118,36 L138,34" stroke="rgba(30,18,10,0.6)" strokeWidth="2" strokeLinecap="round" />

          {/* === WORM ON THE EDGE — same capsule style as tunnel worm === */}
          {/* Body — horizontal capsule sitting on the cockpit rim */}
          <rect
            x="118" y="26" width="28" height="11" rx="5.5" ry="5.5"
            fill="none" stroke="rgba(40,12,8,0.7)" strokeWidth="1.5"
          />
          <rect
            x="118" y="26" width="28" height="11" rx="5.5" ry="5.5"
            fill="#B83228" opacity="0.9"
          />
          {/* Segment lines */}
          {[126, 132, 138].map((x, i) => (
            <line key={`seg-${i}`} x1={x} y1={28} x2={x} y2={35}
              stroke="rgba(60,15,10,0.2)" strokeWidth="0.8" strokeLinecap="round" />
          ))}

          {/* Face — side profile, same as tunnel worm */}
          {/* Eye */}
          <ellipse cx="143" cy="29" rx="2" ry="1.5" fill="#1a0a05" />
          <circle cx="144" cy="28.5" r="0.6" fill="rgba(255,255,255,0.5)" />
          {/* Eyelid — droopy */}
          <path d="M141,27.5 Q143,29 145,27.5" fill="rgba(140,35,25,0.5)" />
          {/* Smirk */}
          <path d="M144,33 Q146,34.5 144.5,35" fill="none" stroke="#1a0a05" strokeWidth="0.8" strokeLinecap="round" />

          {/* RAW joint — tilted up from mouth */}
          <g transform="translate(145, 33) rotate(-30)">
            <polygon points="0,-0.7 10,-1.2 10,1.2 0,0.7" fill="#C8B088" stroke="rgba(140,110,70,0.4)" strokeWidth="0.3" />
            <rect x="-1" y="-0.7" width="2" height="1.4" rx="0.7" fill="#A08050" />
            <circle cx="11" cy="0" r="1.2" fill="#D4641A" />
            <circle cx="11" cy="0" r="0.8" fill="#F0A030" opacity="0.8" />
            {/* Smoke */}
            <circle cx="13" cy="-2" r="0.8" fill="rgba(200,200,200,0.12)">
              <animate attributeName="cy" values="-2;-4;-2" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle cx="14" cy="-4" r="1.2" fill="rgba(200,200,200,0.08)">
              <animate attributeName="cy" values="-4;-7;-4" dur="4s" repeatCount="indefinite" />
            </circle>
          </g>

          {/* Tail end dangling off the edge */}
          <path d="M118,32 Q114,35 115,40" stroke="#B83228" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M118,32 Q114,35 115,40" stroke="rgba(40,12,8,0.5)" strokeWidth="4" strokeLinecap="round" fill="none" />

          {/* Skateboard leaning against cockpit wall */}
          <g transform="translate(138, 28) rotate(15)">
            <rect x="0" y="0" width="14" height="2.5" rx="1.2" fill="#1E1710" stroke="rgba(30,18,10,0.5)" strokeWidth="0.5" />
            <rect x="1" y="0.3" width="12" height="2" rx="1" fill="#2a2a2a" />
            {/* Deck graphic */}
            <rect x="4" y="0.8" width="6" height="0.8" rx="0.4" fill="#E63462" opacity="0.4" />
            {/* Wheels */}
            <circle cx="3" cy="3.5" r="1.2" fill="#E8DCC8" />
            <circle cx="11" cy="3.5" r="1.2" fill="#E8DCC8" />
          </g>

          {/* === LANDING GEAR — dangling, wobbly === */}
          <line x1="70" y1="78" x2="65" y2="92" stroke="#4A3520" strokeWidth="1.5" />
          <line x1="110" y1="78" x2="115" y2="92" stroke="#4A3520" strokeWidth="1.5" />
          <circle cx="65" cy="95" r="5" fill="#1E1710" stroke="rgba(20,12,6,0.6)" strokeWidth="1.5" />
          <circle cx="115" cy="95" r="5" fill="#1E1710" stroke="rgba(20,12,6,0.6)" strokeWidth="1.5" />
          {/* Wheel detail */}
          <circle cx="65" cy="95" r="2" fill="#2a1c10" />
          <circle cx="115" cy="95" r="2" fill="#2a1c10" />

          {/* === ENGINE SMOKE — black, trailing behind === */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <circle
              key={`smoke-${i}`}
              cx={30 - i * 12}
              cy={48 + i * 3}
              r={3 + i * 3.5}
              fill={`rgba(10,6,3,${0.2 - i * 0.03})`}
            >
              <animate
                attributeName="cy"
                values={`${48 + i * 3};${44 + i * 3};${48 + i * 3}`}
                dur={`${2 + i * 0.4}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="r"
                values={`${3 + i * 3.5};${5 + i * 3.5};${3 + i * 3.5}`}
                dur={`${2.5 + i * 0.3}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
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
            <span className="font-display text-sm md:text-lg lg:text-xl text-crimson-neon hover:text-mycelium transition-colors"
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
