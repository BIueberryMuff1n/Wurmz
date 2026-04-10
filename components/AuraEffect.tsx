"use client";

export default function AuraEffect() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[5] overflow-hidden">
      {/* Primary aura orb — slow breathing crimson/violet */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: "80vmax",
          height: "80vmax",
          background:
            "radial-gradient(circle, rgba(230,52,98,0.08) 0%, rgba(139,92,246,0.05) 40%, transparent 70%)",
          animation: "aura-breathe 8s ease-in-out infinite",
        }}
      />

      {/* Secondary orb — drifts slowly, offset */}
      <div
        className="absolute top-1/3 left-1/4 rounded-full"
        style={{
          width: "60vmax",
          height: "60vmax",
          background:
            "radial-gradient(circle, rgba(139,92,246,0.06) 0%, rgba(230,52,98,0.03) 50%, transparent 70%)",
          animation: "aura-drift 12s ease-in-out infinite",
          filter: "blur(40px)",
        }}
      />

      {/* Tertiary orb — slower, warmer */}
      <div
        className="absolute bottom-1/4 right-1/4 rounded-full"
        style={{
          width: "50vmax",
          height: "50vmax",
          background:
            "radial-gradient(circle, rgba(230,52,98,0.05) 0%, rgba(192,132,252,0.04) 40%, transparent 65%)",
          animation: "aura-drift 16s ease-in-out infinite reverse",
          filter: "blur(60px)",
        }}
      />

      {/* Bloom haze — fullscreen soft color wash that slowly shifts */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(139,92,246,0.03) 0%, transparent 60%)",
          animation: "aura-color-shift 20s ease-in-out infinite",
        }}
      />
    </div>
  );
}
