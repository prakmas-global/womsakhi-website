"use client";

import {
  Fragment,
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import clsx from "clsx";
import { alreadyOnScreen, onArrival } from "@/components/motion/arrivals";
import { onMotionEnv } from "@/components/motion/env";

type SplitTag = "span" | "p" | "h1" | "h2" | "h3" | "h4";

export type SplitTextProps = {
  /** Plain text. Split on whitespace; the words keep their order and spaces. */
  children: string;
  /**
   * The element that wraps the whole thing. A heading passes `as="h3"`.
   *
   * Deliberately a closed list rather than `ElementType`: every tag here
   * accepts exactly the props this component sets, which is what lets the
   * single cast below be honest instead of a shrug.
   */
  as?: SplitTag;
  className?: string;
  id?: string;
  /** Seconds before the first word moves. */
  delay?: number;
  /** Seconds between one word leaving and the next. */
  stagger?: number;
  /** Screen-reader-only prefix, e.g. "Step 2: ". */
  prefix?: ReactNode;
};

/**
 * A headline that arrives a word at a time.
 *
 * The generic version of this effect — every element on the page fading up by
 * the same 24 pixels over the same 600ms — is the tell that nobody chose
 * anything. So this exists for the two or three headlines that carry the
 * argument, and everything else on the page uses the quieter `Reveal` or
 * nothing at all.
 *
 * Three things it is careful about:
 *
 * **It reads before it moves.** The words are in the server's HTML at full
 * opacity with no transform. The hidden state is a `data-split` attribute this
 * component writes onto the DOM after mount; with JavaScript off, or reduced
 * motion on, or the heading already on screen at hydration, the attribute is
 * never written and the heading simply is. Nothing is ever parked invisible
 * waiting for an observer to free it.
 *
 * **It stays one sentence.** Each word is a span, but the spaces between them
 * are real text nodes, so the accessible name of an `h2` built this way is the
 * sentence, not a list of words. A screen reader reads "A skill you can charge
 * for" — the splitting is invisible to it.
 *
 * **It clips without cropping.** Each word sits in an `overflow: hidden`
 * wrapper so it rises out of nothing rather than fading in mid-air, and the
 * wrapper carries padding with a matching negative margin so a descender — the
 * tail of a `g`, the hook of a `y` — is inside the clip rather than sliced off
 * it. The padding is static, so it costs no layout at runtime.
 */
export function SplitText({
  children,
  as: tag = "span",
  className,
  id,
  delay = 0,
  stagger = 0.045,
  prefix,
}: SplitTextProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const words = children.split(/\s+/).filter(Boolean);
  const last = (delay + Math.max(0, words.length - 1) * stagger) * 1000 + 1060;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    return onMotionEnv(undefined, (enabled) => {
      if (!enabled || alreadyOnScreen(el)) {
        el.removeAttribute("data-split");
        return;
      }

      el.setAttribute("data-split", "armed");

      let raf = 0;
      let settle = 0;
      const stop = onArrival(el, () => {
        raf = requestAnimationFrame(() => {
          raf = requestAnimationFrame(() => {
            el.setAttribute("data-split", "in");
            // Every word holds a compositor layer while it travels; once the
            // last one has landed the attribute comes off and they are all
            // released. The rendered result is identical.
            settle = window.setTimeout(() => el.removeAttribute("data-split"), last);
          });
        });
      });

      return () => {
        stop();
        cancelAnimationFrame(raf);
        clearTimeout(settle);
        el.removeAttribute("data-split");
      };
    });
  }, [last]);

  // Every member of `SplitTag` takes the same props, so one stands for all.
  const Tag = tag as "span";

  return (
    <Tag
      ref={ref}
      id={id}
      className={clsx("u-split", className)}
      style={
        { "--sp-d": `${delay}s`, "--sp-g": `${stagger}s` } as CSSProperties
      }
    >
      {prefix}
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          {index > 0 ? " " : null}
          <span className="u-split-w">
            <span className="u-split-i" style={{ "--sp-i": index } as CSSProperties}>
              {word}
            </span>
          </span>
        </Fragment>
      ))}
    </Tag>
  );
}
