"use client";

import { useEffect, useState } from "react";

export default function SurfaceScene() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    function handleScroll() {
      setScrollY(window.scrollY);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const skyOffset = scrollY * 0.2;
  const fadeOut = Math.max(0, 1 - scrollY / 800);

  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-[7] overflow-hidden"
      style={{ height: "100vh", opacity: fadeOut }}
    >
      {/* Night sky gradient */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translateY(${skyOffset}px)`,
          background: `linear-gradient(
            180deg,
            #0a0f1a 0%,
            #111827 15%,
            #1a1f3a 30%,
            #2d1f3d 45%,
            #3d1f2d 55%,
            #2a1a18 70%,
            #1a1208 85%,
            #110D08 100%
          )`,
        }}
      />

      {/* Stars */}
      <div
        className="absolute inset-0"
        style={{ transform: `translateY(${skyOffset * 0.5}px)` }}
      >
        {[
          { x: 10, y: 5, s: 1.5, o: 0.6 },
          { x: 25, y: 12, s: 1, o: 0.4 },
          { x: 40, y: 3, s: 2, o: 0.7 },
          { x: 55, y: 8, s: 1, o: 0.5 },
          { x: 70, y: 15, s: 1.5, o: 0.6 },
          { x: 85, y: 6, s: 1, o: 0.3 },
          { x: 15, y: 20, s: 1, o: 0.4 },
          { x: 60, y: 18, s: 1.5, o: 0.5 },
          { x: 90, y: 10, s: 2, o: 0.6 },
          { x: 35, y: 22, s: 1, o: 0.3 },
          { x: 78, y: 2, s: 1.5, o: 0.5 },
          { x: 48, y: 25, s: 1, o: 0.4 },
        ].map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.s,
              height: star.s,
              opacity: star.o,
              animation: `twinkle ${3 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}
      </div>

      {/* Moon */}
      <div
        className="absolute"
        style={{
          right: "15%",
          top: "8%",
          transform: `translateY(${skyOffset * 0.3}px)`,
        }}
      >
        <div
          className="rounded-full"
          style={{
            width: 60,
            height: 60,
            background:
              "radial-gradient(circle at 40% 35%, #f5f0e8 0%, #d4c5a9 50%, #b8a88a 100%)",
            boxShadow:
              "0 0 40px rgba(245,240,232,0.15), 0 0 80px rgba(245,240,232,0.05)",
          }}
        />
      </div>

      {/* Ground fade — just atmosphere, no illustrated plant */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: "35%",
          background: `linear-gradient(180deg,
            transparent 0%,
            rgba(30,23,16,0.3) 15%,
            rgba(30,23,16,0.7) 40%,
            #1E1710 60%,
            #170F0A 100%
          )`,
        }}
      />
    </div>
  );
}
