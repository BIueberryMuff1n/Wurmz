"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useJump } from "./JumpController";

/**
 * Section waypoints for the choreographed scroll.
 * Each entry targets a CSS selector, a pause duration (ms),
 * and a scroll-speed multiplier (lower = slower crawl).
 *
 * The component queries these at play-time so it works regardless
 * of dynamic content heights.
 */
const WAYPOINTS: { selector: string; pause: number; speed: number }[] = [
  // Hero — let the logo breathe
  { selector: "main > section:nth-child(1)", pause: 3000, speed: 0.3 },
  // BrandSection
  { selector: "main > section:nth-child(2)", pause: 800, speed: 0.7 },
  // GrowSection
  { selector: "main > section:nth-child(3)", pause: 800, speed: 0.7 },
  // ProcessSection
  { selector: "main > section:nth-child(4)", pause: 800, speed: 0.7 },
  // PhilosophySection
  { selector: "main > section:nth-child(5)", pause: 800, speed: 0.7 },
  // CountdownSection — pause at the timer
  { selector: "main > section:nth-child(6)", pause: 2000, speed: 0.5 },
  // SignupSection
  { selector: "main > section:nth-child(7)", pause: 800, speed: 0.6 },
];

// Pixels per frame at "speed: 1.0" (60 fps target)
const BASE_PX_PER_FRAME = 2.4;

export default function CinematicMode() {
  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState(true);
  const rafRef = useRef<number | null>(null);
  const playingRef = useRef(false);
  const pauseUntilRef = useRef(0);
  const currentSpeedRef = useRef(0.7);
  const waypointIndexRef = useRef(0);
  const resolvedWaypoints = useRef<
    { top: number; pause: number; speed: number }[]
  >([]);

  // Keep ref in sync so rAF callback reads latest state
  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  /** Resolve waypoint selectors to absolute Y positions */
  const resolveWaypoints = useCallback(() => {
    const scrollY = window.scrollY;
    const pts = WAYPOINTS.map((wp) => {
      const el = document.querySelector(wp.selector);
      if (!el) return { top: 0, pause: wp.pause, speed: wp.speed };
      const rect = el.getBoundingClientRect();
      // Aim for ~30% into the section so content is nicely centered
      return {
        top: rect.top + scrollY + rect.height * 0.3,
        pause: wp.pause,
        speed: wp.speed,
      };
    });
    resolvedWaypoints.current = pts;
  }, []);

  /** The core scroll loop driven by requestAnimationFrame */
  const tick = useCallback(() => {
    if (!playingRef.current) return;

    const now = performance.now();

    // If we are in a pause window, just keep looping
    if (now < pauseUntilRef.current) {
      rafRef.current = requestAnimationFrame(tick);
      return;
    }

    const scrollY = window.scrollY;
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;

    // Done — reached the bottom
    if (scrollY >= maxScroll - 2) {
      setPlaying(false);
      return;
    }

    // Check if we've reached the next waypoint
    const wpIdx = waypointIndexRef.current;
    const wps = resolvedWaypoints.current;
    if (wpIdx < wps.length && scrollY >= wps[wpIdx].top) {
      // Activate this waypoint
      currentSpeedRef.current = wps[wpIdx].speed;
      if (wps[wpIdx].pause > 0) {
        pauseUntilRef.current = now + wps[wpIdx].pause;
      }
      waypointIndexRef.current = wpIdx + 1;
      rafRef.current = requestAnimationFrame(tick);
      return;
    }

    // Slow crawl into the worm colony at the very bottom
    const distFromBottom = maxScroll - scrollY;
    let speed = currentSpeedRef.current;
    if (distFromBottom < 600) {
      speed *= Math.max(0.25, distFromBottom / 600);
    }

    const delta = BASE_PX_PER_FRAME * speed;
    window.scrollTo({ top: scrollY + delta });

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const { hasJumped, jump } = useJump();

  /** Start playback */
  const play = useCallback(() => {
    // Trigger the worm jump if not already done
    if (!hasJumped) jump();

    // Scroll to top first, then begin
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Wait for the smooth-scroll to settle, then kick off rAF
    const waitForTop = () => {
      if (window.scrollY > 5) {
        requestAnimationFrame(waitForTop);
        return;
      }
      resolveWaypoints();
      waypointIndexRef.current = 0;
      currentSpeedRef.current = 0.3;
      pauseUntilRef.current = performance.now() + 1200; // brief settle
      setPlaying(true);
      rafRef.current = requestAnimationFrame(tick);
    };
    requestAnimationFrame(waitForTop);
  }, [resolveWaypoints, tick, hasJumped, jump]);

  /** Stop playback */
  const stop = useCallback(() => {
    setPlaying(false);
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  // Cancel on manual scroll / touch
  useEffect(() => {
    if (!playing) return;

    let lastY = window.scrollY;
    let userScrollDetected = false;

    const onWheel = () => {
      userScrollDetected = true;
      stop();
    };

    const onTouchStart = () => {
      userScrollDetected = true;
      stop();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      // Arrow keys, space, page up/down
      if (
        ["ArrowDown", "ArrowUp", "Space", "PageDown", "PageUp", "Home", "End"].includes(
          e.code
        )
      ) {
        userScrollDetected = true;
        stop();
      }
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [playing, stop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Hide the button once user scrolls past ~90% of the page (unless playing)
  useEffect(() => {
    const onScroll = () => {
      if (playingRef.current) return;
      const pct =
        window.scrollY /
        (document.documentElement.scrollHeight - window.innerHeight);
      setVisible(pct < 0.92);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      onClick={playing ? stop : play}
      aria-label={playing ? "Pause cinematic scroll" : "Play cinematic scroll"}
      className={`
        fixed bottom-6 right-6 z-[100]
        flex items-center gap-1.5
        rounded-full
        px-3.5 py-2
        font-mono text-xs tracking-wider
        transition-all duration-500 ease-out
        cursor-pointer select-none
        ${
          playing
            ? "bg-crimson-neon/20 text-crimson-neon border border-crimson-neon/40 shadow-[0_0_12px_rgba(230,52,98,0.25)]"
            : "bg-deep-earth/80 text-mycelium/50 border border-mycelium/10 hover:text-mycelium/80 hover:border-crimson-neon/30 hover:shadow-[0_0_8px_rgba(230,52,98,0.15)]"
        }
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}
        backdrop-blur-sm
      `}
    >
      <span className="text-sm leading-none">
        {playing ? "\u23F8" : "\u25B6"}
      </span>
      <span className="uppercase">
        {playing ? "Pause" : "Play"}
      </span>
    </button>
  );
}
