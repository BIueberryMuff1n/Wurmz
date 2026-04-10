"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  type ReactNode,
} from "react";

interface ScrollState {
  /** 0 → 1, the single source of truth for the entire site */
  progress: number;
  /** Raw scrollY in pixels */
  scrollY: number;
  /** Total scrollable height */
  maxScroll: number;
  /** Viewport height */
  viewportHeight: number;
  /** Document height */
  documentHeight: number;
}

const ScrollContext = createContext<ScrollState>({
  progress: 0,
  scrollY: 0,
  maxScroll: 1,
  viewportHeight: 0,
  documentHeight: 0,
});

export function useScroll() {
  return useContext(ScrollContext);
}

export function ScrollProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ScrollState>({
    progress: 0,
    scrollY: 0,
    maxScroll: 1,
    viewportHeight: 0,
    documentHeight: 0,
  });

  const rafRef = useRef<number>(0);
  const lastScrollY = useRef(0);

  useEffect(() => {
    function update() {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const maxScroll = Math.max(1, documentHeight - viewportHeight);
      const progress = Math.min(1, Math.max(0, scrollY / maxScroll));

      // Only update state if scroll actually changed (avoid re-renders)
      if (scrollY !== lastScrollY.current) {
        lastScrollY.current = scrollY;
        setState({ progress, scrollY, maxScroll, viewportHeight, documentHeight });
      }
    }

    function onScroll() {
      // Use rAF to batch scroll updates to paint frames
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);

    // Initial state
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <ScrollContext.Provider value={state}>{children}</ScrollContext.Provider>
  );
}
