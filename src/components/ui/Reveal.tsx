"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import clsx from "clsx";
import { alreadyOnScreen, onArrival } from "@/components/motion/arrivals";
import { onMotionEnv } from "@/components/motion/env";

export type RevealProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Seconds to hold before moving, for staggering a group. */
  delay?: number;
  /** How far below its resting place the element starts, in pixels. */
  distance?: number;
  /** Grow from this scale. 1 means "don't". */
  scaleFrom?: number;
};

/**
 * An arrival, not a gate.
 *
 * Two rules, and the second one is why this component no longer renders a
 * `motion.div`.
 *
 * The first: the page is readable the instant the server's HTML paints.
 * Nothing here starts at `opacity: 0` — the resting state IS the visible
 * state, and the hidden state is only ever assumed by JavaScript that has
 * already proved it can put it back. No observer, no arming. Reduced motion,
 * no arming. And anything already on screen when hydration lands is left
 * exactly as it was drawn.
 *
 * The second: nothing about the environment may reach the render output. The
 * hidden state is a `data-reveal` attribute set imperatively on the DOM node,
 * never a React prop — so the server's HTML and the browser's first render are
 * byte-identical by construction, not by a flag. Motion values in `style`
 * cannot make that promise: they serialise whatever they happen to hold at
 * render time, on each side separately, which is precisely how this component
 * used to produce a hydration mismatch.
 *
 * The travel itself is a CSS transition on `transform` and `opacity` only, so
 * it runs on the compositor rather than through React.
 */
export function Reveal({
  children,
  className,
  style,
  delay = 0,
  distance = 24,
  scaleFrom = 1,
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    return onMotionEnv(undefined, (enabled) => {
      if (!enabled || alreadyOnScreen(el)) {
        el.removeAttribute("data-reveal");
        return;
      }

      el.setAttribute("data-reveal", "armed");

      let raf = 0;
      let settle = 0;
      // Two frames: one for the browser to take the armed state as the start
      // of the transition, one to be sure it has been through style
      // resolution. Flipping in the same frame is a jump, not a transition.
      const stop = onArrival(el, () => {
        raf = requestAnimationFrame(() => {
          raf = requestAnimationFrame(() => {
            el.setAttribute("data-reveal", "in");
            // Once it has arrived, drop the attribute altogether. The computed
            // styles are identical either way, but this releases the
            // compositor layer `will-change` asked for — twenty elements each
            // holding a layer for the life of the page is memory spent on an
            // animation that finished.
            settle = window.setTimeout(
              () => el.removeAttribute("data-reveal"),
              delay * 1000 + 980,
            );
          });
        });
      });

      return () => {
        stop();
        cancelAnimationFrame(raf);
        clearTimeout(settle);
        el.removeAttribute("data-reveal");
      };
    });
  }, [delay]);

  return (
    <div
      ref={ref}
      className={clsx("u-reveal", className)}
      style={
        {
          ...style,
          "--rv-y": `${distance}px`,
          "--rv-s": scaleFrom,
          "--rv-d": `${delay}s`,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
