"use client";

import { useState, useEffect } from "react";

const DROP_DATE = new Date("2026-04-20T00:00:00").getTime();

export default function DropClock() {
  const [now, setNow] = useState(Date.now());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  const diff = DROP_DATE - now;
  if (diff <= 0) {
    return (
      <div className="fixed top-4 left-4 z-[100] font-mono text-xs">
        <div className="flex items-center gap-1.5 bg-crimson-neon/20 border border-crimson-neon/40 rounded px-2.5 py-1.5 backdrop-blur-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-crimson-neon animate-pulse" />
          <span className="text-crimson-neon font-semibold tracking-wider">LIVE</span>
        </div>
      </div>
    );
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="fixed top-4 left-4 z-[100] font-mono text-xs select-none">
      <div
        className="flex items-center gap-2 rounded px-2.5 py-1.5 backdrop-blur-sm"
        style={{
          background: "rgba(30,23,16,0.7)",
          border: "1px solid rgba(230,52,98,0.25)",
          boxShadow: "0 0 8px rgba(230,52,98,0.1), inset 0 0 12px rgba(230,52,98,0.05)",
        }}
      >
        {/* Pulse dot */}
        <div className="w-1.5 h-1.5 rounded-full bg-crimson-neon/70 animate-pulse" />

        {/* Timer */}
        <span className="text-crimson-neon/80 tracking-widest" style={{ fontVariantNumeric: "tabular-nums" }}>
          {pad(days)}:{pad(hours)}:{pad(minutes)}:{pad(seconds)}
        </span>

        {/* Label + date */}
        <span className="text-mycelium/30 text-[9px] uppercase tracking-wider flex flex-col leading-tight">
          <span>drop</span>
          <span>4.20.26</span>
        </span>
      </div>
    </div>
  );
}
