"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { motion, type useScroll } from "motion/react";
import { useDepth, useSectionProgress, type DepthRanges } from "./useDepth";
import { CURVES, type CurveName } from "./env";

type ScrollOffset = NonNullable<NonNullable<Parameters<typeof useScroll>[0]>["offset"]>;

export type DepthLayerProps = {
  children?: ReactNode;
  ranges: DepthRanges;
  /** Only move when this media query matches. Defaults to tablet-and-up. */
  media?: string | null;
  /**
   * Named, not passed. A Server Component cannot hand a function across the
   * client boundary, and this component exists precisely so that sections can
   * stay on the server.
   */
  curve?: CurveName;
  offset?: ScrollOffset;
  className?: string;
  style?: CSSProperties;
  /** Hide from assistive technology — for layers that are only ever light. */
  decorative?: boolean;
};

/**
 * A single moving plane, for sections that are otherwise Server Components.
 *
 * The four sections of this page do not all need to ship to the browser. The
 * closing call to action is static markup and two links; turning the whole
 * file into a Client Component so that one panel could scale would send its
 * copy down twice — once in the HTML, once in the RSC payload — to buy an
 * eight-per-cent zoom.
 *
 * So the movement is the client boundary and the content is not. The panel's
 * markup stays on the server and arrives here as `children`, already rendered;
 * this component adds a ref, one scroll subscription and a transform.
 */
export function DepthLayer({
  children,
  ranges,
  offset,
  className,
  style,
  decorative,
  media,
  curve,
}: DepthLayerProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const progress = useSectionProgress(ref, offset);
  const depth = useDepth(progress, ranges, {
    media,
    curve: curve ? CURVES[curve] : undefined,
  });

  return (
    <motion.div
      ref={ref}
      aria-hidden={decorative ? "true" : undefined}
      className={className}
      style={{
        ...style,
        y: depth.y,
        x: depth.x,
        scale: depth.scale,
        opacity: depth.opacity,
        rotate: depth.rotate,
        willChange: "transform",
      }}
    >
      {children}
    </motion.div>
  );
}

export default DepthLayer;
