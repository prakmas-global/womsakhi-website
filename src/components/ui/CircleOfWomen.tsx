"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import {
  motion,
  useIsomorphicLayoutEffect,
  useMotionValue,
  type MotionValue,
} from "motion/react";
import {
  WIDE,
  easeOut,
  mix,
  onMotionEnv,
  windowed,
} from "@/components/motion/env";

/*
  The signature.

  Everything else on this page is craft; this is the argument. WomSakhi's whole
  claim is in four words the product already uses about itself — "nobody does
  this alone" — and a marketing site can either assert that in a paragraph or
  it can make the visitor watch it happen.

  So: six seats. As you scroll the four steps, five women take theirs, one at a
  time, swinging in from outside the frame and settling onto the ring. The
  sixth stays empty. It is marked "You", it is the last thing to arrive, and it
  is still open when the sequence ends — which is the exact sentence the
  closing section then says out loud: "There is room for you here."

  That is why this earns its place and a rotating-cube hero would not. It is
  not an effect applied to the content; it IS the content, and the one thing a
  visitor could describe to someone else afterwards.

  What it costs: six elements writing a transform and an opacity per frame
  while the section is on screen, and nothing at all when it is not. No layout,
  no paint, no filter. Below 1024px, and under Reduce Motion, the sequence
  never starts and the circle is simply drawn complete — which is the state the
  server renders, so a page with no JavaScript shows the finished picture.
*/

type Seat = {
  src: string;
  /** Degrees clockwise from twelve o'clock. */
  angle: number;
  /** Where the face sits in the source art, as object-position. */
  focus: string;
};

/**
 * Five women and an empty place, at sixty degrees apart.
 *
 * The empty one is at the bottom — nearest the reader, the seat you would take
 * if you sat down at this table.
 */
const SEATS: readonly Seat[] = [
  { src: "/art/avatar-woman-elder-saree.webp", angle: 0, focus: "50% 18%" },
  { src: "/art/avatar-woman-teal-shirt.webp", angle: 60, focus: "50% 16%" },
  { src: "/art/avatar-woman-hijab.webp", angle: 120, focus: "50% 16%" },
  { src: "/art/avatar-woman-blazer.webp", angle: 240, focus: "50% 16%" },
  { src: "/art/avatar-woman-purple-kurta.webp", angle: 300, focus: "50% 14%" },
];

/** Six o'clock. The place that stays open. */
const YOUR_SEAT = 180;

/** Seat `i` swings in over this slice of the section's scroll. */
const arrival = (index: number): readonly [number, number] => [
  0.06 + index * 0.14,
  0.4 + index * 0.14,
];

/** The empty place comes last, after the words. */
const YOUR_ARRIVAL: readonly [number, number] = [0.76, 0.99];
const WORDS_ARRIVAL: readonly [number, number] = [0.5, 0.82];

/*
  The seat box and the ring it sits on, as one pair of custom properties. The
  arms are positioned from them in plain CSS, so the geometry is resolved by
  the layout engine once and the animation only ever rotates and scales what is
  already in the right place.
*/
const GEOMETRY =
  "[--ring-r:6.75rem] [--seat:3.75rem] sm:[--ring-r:8.5rem] sm:[--seat:4.5rem] " +
  "lg:[--ring-r:9.25rem] lg:[--seat:5rem] xl:[--ring-r:11rem] xl:[--seat:6rem]";

function useSeatMotion(
  progress: MotionValue<number>,
  angle: number,
  windowRange: readonly [number, number],
  swing: number,
) {
  /*
    Every value starts where it ends: the base angle, full size, fully opaque.
    That is what the server serialises, what the browser first paints and what
    React hydrates against — identical on both sides because it is a constant,
    not a measurement. Nothing is read from the browser until the effect below.
  */
  const spoke = useMotionValue(angle);
  const counter = useMotionValue(-angle);
  const scale = useMotionValue(1);
  const opacity = useMotionValue(1);

  const [start, end] = windowRange;

  useIsomorphicLayoutEffect(
    () =>
      onMotionEnv(WIDE, (enabled) => {
        if (!enabled) {
          spoke.set(angle);
          counter.set(-angle);
          scale.set(1);
          opacity.set(1);
          return;
        }

        const apply = (p: number) => {
          const t = easeOut(windowed(p, start, end));
          const a = mix(angle - swing, angle, t);
          spoke.set(a);
          // Kept upright: the seat travels around the ring, the face does not
          // tip over with it.
          counter.set(-a);
          scale.set(mix(0.44, 1, t));
          opacity.set(t);
        };

        apply(progress.get());
        return progress.on("change", apply);
      }),
    [progress, angle, start, end, swing, spoke, counter, scale, opacity],
  );

  return { spoke, counter, scale, opacity };
}

function SeatOnTheRing({
  progress,
  seat,
  index,
}: {
  progress: MotionValue<number>;
  seat: Seat;
  index: number;
}) {
  const { spoke, counter, scale, opacity } = useSeatMotion(
    progress,
    seat.angle,
    arrival(index),
    58,
  );

  return (
    <motion.div className="absolute top-1/2 left-1/2 h-0 w-0" style={{ rotate: spoke }}>
      <div
        className="absolute h-[var(--seat)] w-[var(--seat)]"
        style={{
          left: "calc(var(--seat) / -2)",
          top: "calc(var(--seat) / -2 - var(--ring-r))",
        }}
      >
        <motion.div
          className="h-full w-full"
          style={{ rotate: counter, scale, opacity, willChange: "transform, opacity" }}
        >
          <span className="relative block h-full w-full overflow-hidden rounded-full bg-gradient-to-b from-brand-100 to-brand-300 shadow-[0_10px_26px_-10px_rgba(0,0,0,0.8),inset_0_0_0_1.5px_rgba(255,255,255,0.5)]">
            <Image
              src={seat.src}
              alt=""
              fill
              sizes="96px"
              className="object-cover"
              style={{ objectPosition: seat.focus }}
            />
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}

function EmptySeat({ progress }: { progress: MotionValue<number> }) {
  const { spoke, counter, scale, opacity } = useSeatMotion(
    progress,
    YOUR_SEAT,
    YOUR_ARRIVAL,
    26,
  );

  return (
    <motion.div className="absolute top-1/2 left-1/2 h-0 w-0" style={{ rotate: spoke }}>
      <div
        className="absolute h-[var(--seat)] w-[var(--seat)]"
        style={{
          left: "calc(var(--seat) / -2)",
          top: "calc(var(--seat) / -2 - var(--ring-r))",
        }}
      >
        <motion.div
          className="h-full w-full"
          style={{ rotate: counter, scale, opacity, willChange: "transform, opacity" }}
        >
          <span className="u-breathe relative grid h-full w-full place-items-center rounded-full border-2 border-dashed border-gold/70 bg-gold/10">
            <span className="font-display text-[0.8125rem] leading-none font-semibold text-gold sm:text-[0.9375rem]">
              You
            </span>
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function CircleOfWomen({
  progress,
  className,
}: {
  progress: MotionValue<number>;
  className?: string;
}) {
  /* The composition itself comes towards you as the sequence runs — the zoom,
     applied to the whole stage rather than to any one picture in it. */
  const stage = useMotionValue(1);
  const wordsOpacity = useMotionValue(1);
  const wordsY = useMotionValue(0);

  useIsomorphicLayoutEffect(
    () =>
      onMotionEnv(WIDE, (enabled) => {
        if (!enabled) {
          stage.set(1);
          wordsOpacity.set(1);
          wordsY.set(0);
          return;
        }

        const apply = (p: number) => {
          stage.set(mix(0.76, 1, easeOut(windowed(p, 0, 0.78))));
          const w = easeOut(windowed(p, WORDS_ARRIVAL[0], WORDS_ARRIVAL[1]));
          wordsOpacity.set(w);
          wordsY.set(mix(16, 0, w));
        };

        apply(progress.get());
        return progress.on("change", apply);
      }),
    [progress, stage, wordsOpacity, wordsY],
  );

  return (
    <figure className={className}>
      <motion.div
        className={`relative mx-auto aspect-square ${GEOMETRY}`}
        style={{
          width: "calc(var(--ring-r) * 2 + var(--seat) + 1.5rem)",
          scale: stage,
          willChange: "transform",
        }}
      >
        {/* Painted once and never touched again: the ring, and the light
            inside it. A gradient that moves is a repaint on every frame. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, rgba(225,96,164,0.20), rgba(169,139,245,0.12) 58%, rgba(26,15,56,0) 78%)",
          }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 rounded-full border border-white/18"
          style={
            {
              width: "calc(var(--ring-r) * 2)",
              height: "calc(var(--ring-r) * 2)",
              marginLeft: "calc(var(--ring-r) * -1)",
              marginTop: "calc(var(--ring-r) * -1)",
            } as CSSProperties
          }
        />

        {SEATS.map((seat, index) => (
          <SeatOnTheRing key={seat.src} progress={progress} seat={seat} index={index} />
        ))}
        <EmptySeat progress={progress} />

        {/* The centring is a static wrapper and the movement is a child, so
            Tailwind's translate utilities and motion's transform never write
            to the same property. */}
        <div className="absolute inset-x-[18%] top-1/2 -translate-y-1/2">
          <motion.p
            className="text-center font-display text-[1.375rem] leading-[1.15] font-semibold tracking-[-0.02em] text-white sm:text-[1.625rem] xl:text-[1.875rem]"
            style={{ opacity: wordsOpacity, y: wordsY }}
          >
            Together,
            <br />
            stronger
          </motion.p>
        </div>
      </motion.div>

      <figcaption className="sr-only">
        A circle of six places. Five are taken by women who are already here;
        the sixth is empty and marked “You”.
      </figcaption>
    </figure>
  );
}

export default CircleOfWomen;
