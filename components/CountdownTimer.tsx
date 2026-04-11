"use client";

import { useState, useEffect } from "react";

const TARGET_DATE = new Date("2026-04-20T00:00:00").getTime();

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(): TimeLeft | null {
  const diff = TARGET_DATE - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="rounded-xl border border-root-brown bg-deep-earth px-4 py-2 md:px-8 md:py-4 w-[76px] md:w-[120px] overflow-visible">
        <span
          className="text-iridescent font-display text-2xl md:text-5xl block text-center"
          style={{
            textShadow: "0 0 20px rgba(230, 52, 98, 0.5), 0 0 40px rgba(230, 52, 98, 0.2)",
          }}
        >
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="font-mono text-xs md:text-sm text-mycelium/50 mt-2 uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeLeft(getTimeLeft());
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return (
      <div className="flex gap-3 md:gap-6">
        {["Days", "Hours", "Min", "Sec"].map((label) => (
          <TimeBlock key={label} value={0} label={label} />
        ))}
      </div>
    );
  }

  if (!timeLeft) {
    return (
      <div className="text-center">
        <p
          className="font-display text-4xl md:text-6xl text-iridescent"
          style={{
            textShadow: "0 0 30px rgba(230, 52, 98, 0.6), 0 0 60px rgba(230, 52, 98, 0.3)",
          }}
        >
          THE DROP IS LIVE
        </p>
      </div>
    );
  }

  return (
    <div className="flex gap-3 md:gap-6">
      <TimeBlock value={timeLeft.days} label="Days" />
      <TimeBlock value={timeLeft.hours} label="Hours" />
      <TimeBlock value={timeLeft.minutes} label="Min" />
      <TimeBlock value={timeLeft.seconds} label="Sec" />
    </div>
  );
}
