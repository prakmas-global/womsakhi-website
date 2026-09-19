import type { CSSProperties } from "react";
import clsx from "clsx";

type SeamProps = {
  /** The ground the visitor is arriving from. */
  from: string;
  /** Which end of this section the seam sits at. */
  edge: "top" | "bottom";
  /** How long the crossing takes, as a CSS length. */
  depth?: string;
  /** The colour the crossing travels THROUGH. See below — this is the point. */
  via?: string;
  /**
   * An extra layer painted at the far end, for a seam that has to meet a
   * ground that is not flat. Raw CSS background-image syntax.
   */
  glow?: string;
  className?: string;
};

/**
 * The join between two grounds, as a crossing rather than a cut.
 *
 * This page runs pale violet, then near-black, then pale violet again, then
 * near-black under the footer. Butted straight against each other those read
 * as four separate pages stapled together — the eye registers the edge, not
 * the change. A band of the previous colour, faded out over eight or ten rems
 * of the new one, turns the same four grounds into one continuous descent.
 *
 * It is painted once: absolutely positioned, `aria-hidden`, behind the
 * content, and never animated. A gradient that moves is a repaint on every
 * frame; a gradient that sits still costs one paint for the life of the page.
 *
 * ── Why it travels through a third colour ──────────────────────────────────
 *
 * Fading #faf8ff out over #1a0f38 is not the same as blending one into the
 * other. Alpha compositing takes the shortest path through the colour cube,
 * and the shortest path between this page's two grounds runs straight through
 * neutral: sampled off the rendered page, the old two-stop version passed
 * through #a39bb6, #867d9c and #665e7f — a hundred and twenty pixels of
 * dishwater grey lying across the foot of the page.
 *
 * Naming the midpoint fixes it. The crossing is pinned to a real violet from
 * the palette partway along, so it descends canvas → violet → near-black and
 * never leaves the brand's own hue. Same two ends, same eight rems, and the
 * middle now looks like dusk instead of fog.
 */
export function Seam({
  from,
  edge,
  depth = "10rem",
  /*
    Halfway to brand-500, in oklab so the mix is perceptual rather than a naive
    average of sRGB numbers. It reads as "this ground, lit" for a pale `from`
    and as "this ground, opening up" for a dark one, which is why one default
    serves crossings running in both directions.
  */
  via,
  glow,
  className,
}: SeamProps) {
  const direction = edge === "top" ? "180deg" : "0deg";
  const bridge = via ?? `color-mix(in oklab, ${from} 42%, #8f6ae8)`;

  const layers = [
    glow,
    `linear-gradient(${direction},` +
      ` ${from} 0%,` +
      ` ${from} 8%,` +
      ` color-mix(in oklab, ${from} 55%, ${bridge}) 24%,` +
      ` ${bridge} 46%,` +
      ` color-mix(in oklab, ${bridge} 58%, transparent) 66%,` +
      ` color-mix(in oklab, ${bridge} 22%, transparent) 84%,` +
      ` transparent 100%)`,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <span
      aria-hidden="true"
      className={clsx(
        "pointer-events-none absolute inset-x-0 -z-10",
        edge === "top" ? "top-0" : "bottom-0",
        className,
      )}
      style={{ height: depth, backgroundImage: layers } as CSSProperties}
    />
  );
}

export default Seam;
