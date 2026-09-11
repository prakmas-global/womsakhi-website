"use client";

import { useMemo, type RefObject } from "react";
import {
  useIsomorphicLayoutEffect,
  useMotionValue,
  useScroll,
  type MotionValue,
} from "motion/react";
import { DESKTOP, mix, onMotionEnv } from "./env";

type ScrollOffset = NonNullable<NonNullable<Parameters<typeof useScroll>[0]>["offset"]>;

/**
 * One measurement, shared by every plane in a composition.
 *
 * `useScroll` with a target reads that element's box on every scroll frame.
 * Giving each parallax layer its own call would mean five reads per row and
 * twenty for the section — twenty forced layout reads a frame to answer a
 * question that has one answer. So the section measures itself once, and every
 * layer is a pure function of that number.
 */
export function useSectionProgress(
  target: RefObject<HTMLElement | null>,
  offset?: ScrollOffset,
): MotionValue<number> {
  const { scrollYProgress } = useScroll({
    target,
    offset: offset ?? ["start end", "end start"],
  });
  return scrollYProgress;
}

/** A channel and the two ends it travels between, across the section's passage. */
export type DepthRanges = {
  /** Pixels. Negative is up — so a layer that ends higher than it started is
      moving faster than the page, and reads as nearer. */
  y?: readonly [number, number];
  /** Pixels. Negative is left. */
  x?: readonly [number, number];
  /** Multiplier. 1 is untouched. */
  scale?: readonly [number, number];
  /** 0..1. */
  opacity?: readonly [number, number];
  /** Degrees. */
  rotate?: readonly [number, number];
};

export type DepthOptions = {
  /** Only move when this media query matches. Defaults to tablet-and-up. */
  media?: string | null;
  /** Reshape the linear 0..1 before it is mapped. */
  curve?: (progress: number) => number;
};

/**
 * One plane of a parallax composition.
 *
 * The values it hands back start at rest — y 0, x 0, scale 1, opacity 1,
 * rotate 0 — and they are still at rest when the server renders, when the
 * browser first paints, and when React hydrates. `motion` serialises that
 * exact set as `transform: none`, which is what the server writes and what the
 * client's first render writes, so the two agree by construction rather than
 * by a flag.
 *
 * Movement is attached afterwards, in a layout effect, which is the only place
 * it is safe to ask the browser about reduced motion or viewport width. It is
 * also where it is detached: with Reduce Motion on, or below the breakpoint,
 * the subscription is never made and every value stays at its resting number
 * for the life of the page. Stood down, not damped.
 *
 * Only `transform` and `opacity` are ever written. Nothing here can cause a
 * layout or a paint on a scroll frame.
 */
export function useDepth(
  progress: MotionValue<number>,
  ranges: DepthRanges,
  options: DepthOptions = {},
) {
  const { media = DESKTOP, curve } = options;

  const y = useMotionValue(0);
  const x = useMotionValue(0);
  const scale = useMotionValue(1);
  const opacity = useMotionValue(1);
  const rotate = useMotionValue(0);

  /*
    The ranges arrive as a fresh object literal on every render. Keying the
    effect off their contents rather than their identity is the difference
    between wiring the subscription once and tearing it down and rebuilding it
    on every parent render.
  */
  const key = JSON.stringify(ranges);

  useIsomorphicLayoutEffect(() => {
    const spec: DepthRanges = JSON.parse(key);

    return onMotionEnv(media ?? undefined, (enabled) => {
      if (!enabled) {
        // Stood down: put every channel back where the server left it.
        y.set(0);
        x.set(0);
        scale.set(1);
        opacity.set(1);
        rotate.set(0);
        return;
      }

      const apply = (p: number) => {
        const t = curve ? curve(p) : p;
        if (spec.y) y.set(mix(spec.y[0], spec.y[1], t));
        if (spec.x) x.set(mix(spec.x[0], spec.x[1], t));
        if (spec.scale) scale.set(mix(spec.scale[0], spec.scale[1], t));
        if (spec.opacity) opacity.set(mix(spec.opacity[0], spec.opacity[1], t));
        if (spec.rotate) rotate.set(mix(spec.rotate[0], spec.rotate[1], t));
      };

      /*
        Caught up before the browser paints, so a reload halfway down the page
        does not show the resting frame and then jump. This is a layout effect
        for that reason alone.
      */
      apply(progress.get());
      return progress.on("change", apply);
    });
  }, [key, media, curve, progress, y, x, scale, opacity, rotate]);

  return useMemo(
    () => ({ y, x, scale, opacity, rotate }),
    [y, x, scale, opacity, rotate],
  );
}
