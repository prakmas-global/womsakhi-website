import type { CSSProperties } from "react";
import clsx from "clsx";

type SeamProps = {
  /** The ground the visitor is arriving from. */
  from: string;
  /** Which end of this section the seam sits at. */
  edge: "top" | "bottom";
  /** How long the crossing takes, as a CSS length. */
  depth?: string;
  /** An accent to warm the middle of the crossing. Optional. */
  tint?: string;
  className?: string;
};

/**
 * The join between two grounds, as a crossing rather than a cut.
 *
 * This page runs pale violet, then near-black, then pale violet again, then
 * near-black under the footer. Butted straight against each other those reads
 * as four separate pages stapled together — the eye registers the edge, not
 * the change. A band of the previous colour, faded out over ten or twelve rems
 * of the new one, turns the same four grounds into one continuous descent.
 *
 * It is a single painted gradient in the section's own stacking context:
 * absolutely positioned, `aria-hidden`, behind the content, and never animated.
 * A gradient that moves is a repaint on every frame; a gradient that sits
 * still costs one paint for the life of the page.
 *
 * Two stops, not one. A straight linear ramp between a very light and a very
 * dark colour spends most of its length in a dead middle grey; pulling the
 * midpoint to 46% with a shallower tail keeps the crossing feeling like light
 * falling away rather than like a fog.
 */
export function Seam({ from, edge, depth = "11rem", tint, className }: SeamProps) {
  const direction = edge === "top" ? "180deg" : "0deg";

  const layers = [
    tint
      ? `radial-gradient(120% 100% at 50% ${edge === "top" ? "100%" : "0%"}, ${tint}, transparent 70%)`
      : null,
    `linear-gradient(${direction}, ${from} 0%, ${from} 8%, color-mix(in oklab, ${from} 55%, transparent) 46%, transparent 100%)`,
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
