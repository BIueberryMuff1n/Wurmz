"use client";

import { useEffect, useState } from "react";

export default function DepthGradient() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    function handleScroll() {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      setScrollProgress(progress);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // As you scroll deeper, the background shifts through soil layers
  const hue = 20 + scrollProgress * 10; // warm brown shifts slightly
  const lightness = 4 - scrollProgress * 2; // gets darker as you go deeper
  const saturation = 30 + scrollProgress * 20;

  // Crimson vignette intensifies as you go deeper
  const vignetteOpacity = 0.03 + scrollProgress * 0.08;

  return (
    <div className="pointer-events-none fixed inset-0 z-[2] transition-colors duration-700">
      {/* Base depth color */}
      <div
        className="absolute inset-0"
        style={{
          background: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
          opacity: 0.3,
        }}
      />
      {/* Vignette — gets tighter/more intense as you scroll */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, transparent ${40 - scrollProgress * 15}%, rgba(17, 13, 8, ${0.7 + scrollProgress * 0.3}) 100%)`,
        }}
      />
      {/* Crimson underglow from the deep */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 80%, rgba(230, 52, 98, ${vignetteOpacity}) 0%, transparent 60%)`,
        }}
      />
    </div>
  );
}
