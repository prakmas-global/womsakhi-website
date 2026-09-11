"use client";

/*
  The one rule this whole motion layer is built on.

  A hydration mismatch is not a React quirk; it is a component asking the
  browser a question the server could not hear. `prefers-reduced-motion`,
  `window.innerWidth` and `window.scrollY` are all such questions, and every
  one of them is fatal if the answer reaches the render output — the server
  renders one transform, the browser renders another, and React gives up on
  the subtree.

  So the environment is never read during render. It is read here, from inside
  an effect, after hydration has already agreed with itself. The markup that
  leaves the server is the resting state, the browser paints it, and only then
  does anything start to move.
*/

const REDUCED = "(prefers-reduced-motion: reduce)";

/**
 * Runs `setup` with the current motion environment, and again whenever it
 * changes — a woman switching Reduce Motion on mid-page, or rotating a phone
 * across the breakpoint, gets the new answer without a reload.
 *
 * `enabled` is false when reduced motion is asked for, or when `media` is
 * given and does not match. Everything in this codebase that moves on scroll
 * is wired inside `setup` and torn down by its return, so "stood down" means
 * the subscription is gone, not damped.
 *
 * Returns a single teardown for the caller's effect.
 */
export function onMotionEnv(
  media: string | undefined,
  setup: (enabled: boolean) => (() => void) | void,
): () => void {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return () => {};
  }

  const queries = [window.matchMedia(REDUCED)];
  if (media) queries.push(window.matchMedia(media));

  let teardown: (() => void) | void;

  const run = () => {
    teardown?.();
    const enabled = !queries[0].matches && (queries.length < 2 || queries[1].matches);
    teardown = setup(enabled);
  };

  run();
  for (const query of queries) query.addEventListener("change", run);

  return () => {
    for (const query of queries) query.removeEventListener("change", run);
    teardown?.();
  };
}

/** A one-shot read, for code that only needs the answer once. */
export function motionAllowed(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return !window.matchMedia(REDUCED).matches;
}

/**
 * The line below which scroll choreography is switched off rather than made
 * gentler. A mid-range Android running four parallax planes and a pinned
 * sequence is not a website, it is a slideshow.
 */
export const DESKTOP = "(min-width: 768px)";

/** Wide enough for the pinned stage to have a column to itself. */
export const WIDE = "(min-width: 1024px)";

/** Linear interpolation. */
export const mix = (from: number, to: number, t: number) => from + (to - from) * t;

/** Clamp to 0..1. */
export const clamp01 = (value: number) => (value < 0 ? 0 : value > 1 ? 1 : value);

/**
 * Progress through a sub-window of a 0..1 track, eased.
 *
 * The staggered arrivals in the circle are all windows on one scroll value
 * rather than six scroll subscriptions, so the whole sequence costs a single
 * measurement per frame.
 */
export const windowed = (progress: number, start: number, end: number) =>
  clamp01((progress - start) / (end - start));

/** Quintic ease-out — the curve every arrival on this page uses. */
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 5);

/** Symmetrical ease, for values that travel out and back. */
export const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/**
 * The curves, by name.
 *
 * A Server Component cannot hand a function to a Client Component — functions
 * do not survive the RSC boundary — so a section that stays on the server names
 * its easing instead of passing it. They are module constants either way, which
 * also means a parent re-render cannot change their identity and tear down a
 * scroll subscription that was working perfectly well.
 */
export const CURVES = {
  /** Straight through. What parallax wants. */
  linear: (t: number) => t,
  /**
   * Out and back: 0 at the middle of the passage, 1 at both ends.
   *
   * What an image zoom wants. Mapped onto `scale: [1, 1.12]` it means the
   * picture is at its true crop when it is centred on screen and eases wider as
   * it leaves — and, because 1 is also the resting value, a page with no
   * JavaScript shows exactly the centred frame.
   */
  throughCentre: (t: number) => Math.abs(t - 0.5) * 2,
  /** All the travel in the first half of the passage, then still. */
  settle: (t: number) => easeOut(clamp01(t / 0.55)),
} as const;

export type CurveName = keyof typeof CURVES;
