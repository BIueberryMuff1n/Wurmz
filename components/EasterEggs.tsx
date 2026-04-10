"use client";

import { useEffect, useRef } from "react";
import { useScroll } from "./ScrollContext";

export default function EasterEggs() {
  const { progress } = useScroll();
  const hasLoggedBottom = useRef(false);

  // Console log on mount
  useEffect(() => {
    console.log("🪱 You're looking at the roots. Respect.");
  }, []);

  // Update document title based on scroll progress
  useEffect(() => {
    if (progress < 0.1) {
      document.title = "Wurmz — Organic Living Soil";
    } else if (progress < 0.3) {
      document.title = "Wurmz — digging...";
    } else if (progress < 0.6) {
      document.title = "Wurmz — deeper...";
    } else if (progress < 0.85) {
      document.title = "Wurmz — 🪱🪱🪱";
    } else {
      document.title = "Wurmz — welcome home";
    }
  }, [progress]);

  // Console log when reaching the bottom
  useEffect(() => {
    if (progress >= 0.85 && !hasLoggedBottom.current) {
      hasLoggedBottom.current = true;
      console.log("🪱🪱🪱 You made it to the bottom. Welcome home.");
    }
  }, [progress]);

  return null;
}
