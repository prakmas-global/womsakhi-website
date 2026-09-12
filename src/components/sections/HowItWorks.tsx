"use client";

import { useRef } from "react";
import {
  motion,
  useIsomorphicLayoutEffect,
  useMotionValue,
  type MotionValue,
} from "motion/react";
import { STEPS } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";
import { Seam } from "@/components/ui/Seam";
import { SplitText } from "@/components/ui/SplitText";
import { CircleOfWomen } from "@/components/ui/CircleOfWomen";
import { useSectionProgress } from "@/components/motion/useDepth";
import { WIDE, clamp01, easeOut, mix, onMotionEnv } from "@/components/motion/env";

/**
 * Violet to gold, in the order the steps happen. The four are palette values
 * (brand-400, brand-300, pink-brand, gold) rather than an invented ramp, so
 * the sequence warms as you descend it without introducing a fifth colour to
 * the site.
 */
const STEP_ACCENTS = ["#a98bf5", "#c9a8f7", "#e160a4", "#f5b544"] as const;

/** The ground the visitor arrives from, and returns to. */
const CANVAS = "#faf8ff";

/*
  A pinned sequence without a pinned section.

  The usual way to do this is to give a wrapper 400vh of height and pin a child
  with JavaScript. Both halves of that are traps. The height has to be applied
  only when the choreography is on — otherwise a phone with reduced motion
  scrolls through four empty screens — and applying it at hydration is a
  four-thousand-pixel layout shift, which is the single worst CLS you can ship.

  So there is no added height and nothing is pinned by script. The four steps
  are ordinary blocks in ordinary flow; they are simply tall, because a step in
  a process deserves a screen. The stage beside them is `position: sticky`,
  which the browser handles on the compositor for free. The document is exactly
  as tall in every mode — with JavaScript, without it, on a phone — so there is
  nothing to shift.

  `align-items: start` on the grid is what makes the sticky column work: a
  stretched grid item fills its area and has no room left to travel in.
*/

function StepCard({
  progress,
  step,
  index,
}: {
  progress: MotionValue<number>;
  step: (typeof STEPS)[number];
  index: number;
}) {
  const accent = STEP_ACCENTS[index];

  /*
    The active step is marked by light, never by dimming the others.

    Fading an inactive card to 40% opacity is the obvious move and it is an
    accessibility failure: `brand-200` on `brand-950` is a 9:1 contrast ratio at
    full strength and about 3:1 at 40%, so three quarters of this section would
    fail SC 1.4.3 for as long as it was inactive. Instead the text never
    changes and an accent overlay behind it comes up — opacity on a decorative
    layer, which costs nothing and reads the same.
  */
  const glow = useMotionValue(0);
  const lift = useMotionValue(0);

  useIsomorphicLayoutEffect(
    () =>
      onMotionEnv(WIDE, (enabled) => {
        if (!enabled) {
          glow.set(0);
          lift.set(0);
          return;
        }

        // Each step owns a quarter of the sequence — which ends at 88% of the
        // track, not at 100%, because the last tenth is the hold on the
        // finished circle and nothing should be lighting up during it.
        const centre = ((index + 0.5) / STEPS.length) * 0.88;
        const apply = (p: number) => {
          const distance = Math.abs(p - centre) / (0.64 / STEPS.length);
          const near = easeOut(clamp01(1 - distance));
          glow.set(near);
          lift.set(mix(0, -8, near));
        };

        apply(progress.get());
        return progress.on("change", apply);
      }),
    [progress, index, glow, lift],
  );

  return (
    <li className="relative lg:flex lg:min-h-[54svh] lg:items-center">
      <Reveal distance={26} className="w-full">
        <motion.div
          className="relative overflow-hidden rounded-3xl border border-white/12 bg-white/[0.06] p-6 sm:p-7 lg:p-8"
          style={{ x: lift, willChange: "transform" }}
        >
          {/* The light that marks "you are here". Decorative, so it may fade
              all the way to nothing without taking any content with it. */}
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{
              opacity: glow,
              background: `linear-gradient(115deg, ${accent}24, transparent 62%)`,
              boxShadow: `inset 0 0 0 1px ${accent}59`,
            }}
          />

          <div className="relative flex items-center gap-4">
            <span
              aria-hidden="true"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full border font-display text-[0.9375rem] font-semibold"
              style={{
                borderColor: `${accent}80`,
                color: accent,
                boxShadow: `0 0 22px -8px ${accent}`,
              }}
            >
              {step.n}
            </span>
            <h3 className="font-display text-2xl leading-tight tracking-[-0.015em] text-white sm:text-[1.6rem]">
              <span className="sr-only">{`Step ${Number(step.n)}: `}</span>
              {step.title}
            </h3>
          </div>

          <p className="relative mt-4 text-[1rem] leading-[1.7] text-brand-200/85">
            {step.body}
          </p>
        </motion.div>
      </Reveal>
    </li>
  );
}

export function HowItWorks() {
  const trackRef = useRef<HTMLDivElement | null>(null);

  /*
    `start start` to `end end` is the pin window exactly: 0 the moment the
    track's top reaches the top of the viewport — which is when the sticky
    stage stops scrolling — and 1 when its bottom reaches the bottom, which is
    when the stage lets go again. Everything in the sequence is a window on
    this one number, so the whole thing costs a single measurement per frame.
  */
  const progress = useSectionProgress(trackRef, ["start start", "end end"]);

  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-title"
      className="relative isolate bg-brand-950 pt-32 pb-40 text-white sm:pt-36 sm:pb-44 lg:pt-44 lg:pb-44"
    >
      {/* The page descends from pale violet into near-black and back out
          again. Butted straight together those read as separate pages; crossed
          over eleven rems they read as one. */}
      <Seam from={CANVAS} edge="top" depth="9rem" />
      <Seam from={CANVAS} edge="bottom" depth="10rem" />

      <span aria-hidden="true" className="u-grain" />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20"
        style={{
          background:
            "radial-gradient(60% 45% at 12% 0%, rgba(118,72,179,0.45), transparent 70%), radial-gradient(55% 45% at 88% 100%, rgba(186,68,132,0.35), transparent 72%)",
        }}
      />

      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8">
        <Reveal distance={20}>
          <div className="max-w-3xl text-center lg:mx-auto">
            <h2
              id="how-it-works-title"
              className="u-balance font-display text-[2.125rem] leading-[1.06] tracking-[-0.025em] text-white sm:text-5xl lg:text-[3.25rem]"
            >
              <SplitText stagger={0.07}>How it works</SplitText>
            </h2>
            <p className="u-balance mt-5 text-lg leading-[1.7] text-brand-200/80 sm:text-xl">
              Four steps, in the order they actually happen — and a circle that
              is one place short.
            </p>
          </div>
        </Reveal>

        <div
          ref={trackRef}
          className="mt-14 sm:mt-16 lg:mt-12 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:items-start lg:gap-16 xl:gap-24"
        >
          {/* The stage. Sticky, so the browser pins it on the compositor and
              no script has to fight the scroll for it. */}
          <div className="flex justify-center lg:sticky lg:top-0 lg:h-[100svh] lg:items-center">
            <CircleOfWomen progress={progress} />
          </div>

          <ol className="mt-14 space-y-10 sm:space-y-12 lg:mt-0 lg:space-y-0 lg:pb-[12svh]">
            {STEPS.map((step, index) => (
              <StepCard key={step.n} progress={progress} step={step} index={index} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
