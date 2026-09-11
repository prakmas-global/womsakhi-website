"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Momentum scrolling, and the two things that usually go wrong with it.
 *
 * First: it must not run for a woman who has asked for reduced motion. Lenis
 * hijacks the wheel, and hijacked scrolling is exactly the sensation that
 * setting exists to prevent — so it is never started, rather than started and
 * then damped.
 *
 * Second: it has to be driven by the same rAF loop as everything else and torn
 * down on unmount. A stray Lenis instance left running after a client-side
 * navigation keeps consuming wheel events, and the next page scrolls at half
 * speed for no reason anyone can see.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.05,
      // Exponential ease-out: fast to respond, long to settle. A linear ramp
      // reads as lag rather than weight.
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.6,
    });

    let id = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      id = requestAnimationFrame(raf);
    };
    id = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
    };
  }, []);

  return null;
}
