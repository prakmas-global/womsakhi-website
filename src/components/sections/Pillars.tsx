"use client";

import Image from "next/image";
import { useRef } from "react";
import clsx from "clsx";
import { motion } from "motion/react";
import { PILLARS } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SplitText } from "@/components/ui/SplitText";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useDepth, useSectionProgress } from "@/components/motion/useDepth";
import { CURVES, DESKTOP, WIDE } from "@/components/motion/env";

type Pillar = (typeof PILLARS)[number];

/**
 * The four pictures are not four pictures of the same shape.
 *
 * `lm-banner-v2` is a 1900x649 banner with its own lettering baked in;
 * `scene-woman-climbing-steps` is a 699x760 portrait; `earn-market` is a small
 * 440x440 square; `circle-hands-joined` is 1100x825. Forcing one crop on all
 * four either guillotines the banner's lettering or hands the portrait a
 * ceiling it doesn't have. So each frame keeps close to its picture's own
 * shape, and a shared *height* cap — not a shared aspect ratio — is what makes
 * the four feel like a set. The cap also keeps the 440px square from ever
 * being asked to fill 700px and going soft.
 */
type Frame = {
  ratio: number;
  /** object-position, chosen per picture rather than defaulted to centre. */
  position: string;
  sizes: string;
  alt: string;
};

const FRAMES: Record<Pillar["id"], Frame> = {
  learn: {
    ratio: 16 / 9,
    // Hard left: at anything above 0% this banner's own lettering is cut
    // through the middle of a word, which reads as a broken image.
    position: "0% 50%",
    sizes: "(max-width: 1024px) 92vw, 560px",
    alt: "A woman smiling at her laptop beside the words “Small steps, big changes”.",
  },
  work: {
    ratio: 7 / 8,
    position: "50% 50%",
    sizes: "(max-width: 1024px) 92vw, 420px",
    alt: "An illustration of a woman climbing a flight of steps towards a flag at the top.",
  },
  earn: {
    ratio: 1,
    position: "50% 50%",
    sizes: "(max-width: 1024px) 92vw, 480px",
    alt: "An illustration of a market stall under a pink awning, its cloth reading “Support women, support dreams”.",
  },
  circle: {
    ratio: 4 / 3,
    position: "50% 45%",
    sizes: "(max-width: 1024px) 92vw, 560px",
    alt: "Five women sitting close together with their hands joined in the middle.",
  },
};

/**
 * The near plane: a second, smaller picture that overlaps the card at the
 * corner where the two columns meet.
 *
 * It is what makes the parallax read as depth rather than as drift. A single
 * card sliding against a background is ambiguous — it could be the card moving
 * or the ground. Something clearly in FRONT of the card, travelling further in
 * the same time, is unambiguous, and it is the cue that separates a parallax
 * that works from one you have to be told about.
 *
 * Each one also says the pillar's third promise in a picture: the certificate
 * you can show, the employer who paid, the order going out, the woman a few
 * steps ahead of you.
 */
const NEAR: Record<Pillar["id"], string> = {
  learn: "/art/course-holding-certificate.webp",
  work: "/art/scene-women-business-handshake.webp",
  earn: "/art/scene-woman-packing-orders.webp",
  circle: "/art/scene-elder-woman-mentoring.webp",
};

function Tick({ accent }: { accent: string }) {
  return (
    <span
      aria-hidden="true"
      className="mt-[0.3rem] grid h-[1.125rem] w-[1.125rem] shrink-0 place-items-center rounded-full"
      style={{ backgroundColor: `${accent}1f`, color: accent }}
    >
      <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2.5 6.4l2.4 2.4L9.6 3.6" />
      </svg>
    </span>
  );
}

/*
  Four planes, and the rates are the whole point.

  Parallax that reads as depth needs the layers to disagree by a lot. A 22px
  drift on one card and nothing on anything else is a wobble — the eye reads it
  as an imperfection rather than as distance. These four are spread across
  320px of relative travel:

    ghost word   y -92 →  92   lags the page hardest      — furthest away
    glow         y -38 →  38   lags gently                — behind the card
    card         y  22 → -22   leads the page slightly    — the subject
    near picture y  84 → -84   leads hardest, and rotates — in front of it

  A layer whose `y` ENDS lower than it started is falling behind the scroll and
  recedes; one that ends higher is outrunning it and comes forward. Nothing
  here is decorative noise: it is one consistent camera.
*/
const GHOST = { y: [-92, 92], x: [-14, 14] } as const;
const GLOW = { y: [-38, 38] } as const;
const CARD = { y: [22, -22] } as const;
const NEAR_PLANE = { y: [84, -84], rotate: [-5, 5] } as const;
const COPY = { y: [30, -30] } as const;
/* The picture inside the frame is at its true crop when the row is centred,
   and eases wider as the row leaves in either direction. Because 1 is also the
   resting value, nothing is cropped that is not cropped today. */
const ZOOM = { scale: [1, 1.12] } as const;

function PillarRow({ pillar, index }: { pillar: Pillar; index: number }) {
  const rowRef = useRef<HTMLElement | null>(null);

  // One subscription per row, read once a frame, shared by all five planes.
  const progress = useSectionProgress(rowRef);

  const ghost = useDepth(progress, GHOST, { media: WIDE });
  const glow = useDepth(progress, GLOW);
  const card = useDepth(progress, CARD);
  const near = useDepth(progress, NEAR_PLANE, { media: WIDE });
  const copy = useDepth(progress, COPY);
  const zoom = useDepth(progress, ZOOM, { curve: CURVES.throughCentre, media: DESKTOP });

  const frame = FRAMES[pillar.id];
  const nearArt = NEAR[pillar.id];
  const accent = pillar.accent;
  const imageFirst = index % 2 === 0;
  const points: readonly string[] = pillar.points;

  return (
    <article
      ref={rowRef}
      aria-labelledby={`pillar-${pillar.id}-title`}
      className="relative grid grid-cols-1 items-center gap-10 sm:gap-12 lg:grid-cols-12 lg:gap-x-16"
    >
      {/* PLANE 0 — the deepest thing in the row. The pillar's own name, the
          same word the nav uses, passing behind the composition like a chapter
          title. Hidden from assistive technology: the h3 below is the heading,
          and this is the same word again at 1/20th the contrast. */}
      <motion.span
        aria-hidden="true"
        className={clsx(
          "pointer-events-none absolute top-1/2 -z-10 hidden select-none font-display",
          "text-[13rem] leading-none font-semibold tracking-[-0.04em] xl:text-[17rem] lg:block",
          imageFirst ? "left-[-3.5rem] xl:left-[-6rem]" : "right-[-3.5rem] xl:right-[-6rem]",
        )}
        style={{
          y: ghost.y,
          x: ghost.x,
          color: `${accent}12`,
          marginTop: "-0.52em",
        }}
      >
        {pillar.eyebrow}
      </motion.span>

      <Reveal
        distance={32}
        scaleFrom={1.035}
        className={clsx(
          "relative flex",
          imageFirst
            ? "justify-center lg:col-span-6 lg:col-start-1 lg:justify-start"
            : "justify-center lg:col-span-6 lg:col-start-7 lg:justify-end",
        )}
      >
        <motion.div
          className="relative w-full"
          style={{ maxWidth: `calc(var(--ws-cap) * ${frame.ratio})`, y: card.y }}
        >
          {/* PLANE 1 — the accent glow, drifting the other way and slower.
              `will-change` is not a superstition here: this element carries a
              64px blur, and a blurred element that moves without its own
              compositor layer is re-rasterised on every frame. Promoted once,
              the blur is drawn once and only the layer moves. */}
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute -inset-6 -z-10 rounded-[3rem] blur-3xl sm:-inset-10"
            style={{
              y: glow.y,
              willChange: "transform",
              background: `radial-gradient(58% 58% at 50% 46%, ${accent}38, transparent 72%)`,
            }}
          />

          {/* PLANE 2 — the card. */}
          <figure
            className="relative w-full overflow-hidden rounded-[1.5rem] bg-surface shadow-[0_30px_70px_-32px_rgba(20,16,42,0.42)] sm:rounded-[2rem]"
            style={{ aspectRatio: `${frame.ratio}` }}
          >
            {/* The zoom. The frame is fixed and clips; only the picture inside
                it scales, so the card's radius, its ring and its shadow are
                never distorted and the layout never moves. */}
            <motion.div className="absolute inset-0" style={{ scale: zoom.scale }}>
              <Image
                src={pillar.art}
                alt={frame.alt}
                fill
                sizes={frame.sizes}
                className="object-cover"
                style={{ objectPosition: frame.position }}
              />
            </motion.div>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-[inherit]"
              style={{ boxShadow: `inset 0 0 0 1px ${accent}33` }}
            />
          </figure>

          {/* PLANE 3 — in front of the card, and travelling furthest. */}
          <motion.div
            aria-hidden="true"
            className={clsx(
              "pointer-events-none absolute bottom-[-2.25rem] hidden w-[9.5rem] lg:block xl:w-[11rem]",
              imageFirst ? "right-[-2.75rem]" : "left-[-2.75rem]",
            )}
            style={{ y: near.y, rotate: near.rotate }}
          >
            <span
              className="relative block aspect-square overflow-hidden rounded-[1.35rem] bg-surface"
              style={{
                boxShadow: `0 26px 54px -22px rgba(20,16,42,0.5), inset 0 0 0 1px ${accent}40`,
              }}
            >
              <Image
                src={nearArt}
                alt=""
                fill
                sizes="176px"
                className="object-cover"
              />
            </span>
          </motion.div>
        </motion.div>
      </Reveal>

      <Reveal
        delay={0.08}
        distance={26}
        className={clsx(
          "self-center",
          imageFirst
            ? "lg:col-span-6 lg:col-start-7"
            : "lg:col-span-6 lg:col-start-1 lg:row-start-1",
        )}
      >
        <motion.div style={{ y: copy.y }}>
          <p
            className="flex items-center gap-3 text-[0.7rem] font-bold uppercase tracking-[0.24em]"
            style={{ color: accent }}
          >
            <span aria-hidden="true" className="h-px w-7" style={{ backgroundColor: accent }} />
            {pillar.eyebrow}
          </p>

          {/* The one headline in this row that gets choreographed. Everything
              else in the column arrives together, which is what makes the
              heading's word-by-word entrance read as emphasis rather than as
              the house style applied again. */}
          <SplitText
            as="h3"
            id={`pillar-${pillar.id}-title`}
            delay={0.1}
            stagger={0.05}
            className="u-balance mt-5 block font-display text-[1.875rem] leading-[1.1] tracking-[-0.022em] text-ink sm:text-[2.25rem] lg:text-[2.5rem]"
          >
            {pillar.title}
          </SplitText>

          <p className="mt-5 max-w-[46ch] text-[1.0625rem] leading-[1.75] text-ink-2">
            {pillar.body}
          </p>

          <ul className="mt-7 space-y-3.5">
            {points.map((point) => (
              <li key={point} className="flex items-start gap-3 text-[0.95rem] leading-6 text-ink-2">
                <Tick accent={accent} />
                <span>{point}</span>
              </li>
            ))}
          </ul>

          <div className="mt-9">
            <Button href={pillar.href} accent={accent}>
              Open {pillar.eyebrow}
            </Button>
          </div>
        </motion.div>
      </Reveal>
    </article>
  );
}

export function Pillars() {
  return (
    <section
      id="pillars"
      aria-labelledby="pillars-title"
      /*
        `overflow-x-clip`, not `overflow-hidden`: the media reveals in from
        scale 1.035, the ghost word bleeds off the outer edge by design, and
        for those few hundred milliseconds the accent glow behind a full-width
        card is wider than the viewport — enough to hand a phone a few pixels
        of sideways scroll. Clipping the axis kills it without creating a
        scroll container, which `overflow-hidden` would, and which would break
        the sticky stage in the section below.
      */
      className="relative isolate overflow-x-clip bg-canvas py-24 sm:py-28 lg:py-36"
    >
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-12">
        <Reveal distance={20}>
          <SectionHeading
            id="pillars-title"
            title="Four things you can do here"
          />
        </Reveal>

        <div className="mt-20 space-y-28 [--ws-cap:100rem] sm:mt-24 lg:mt-28 lg:space-y-44 lg:[--ws-cap:27rem] xl:[--ws-cap:30rem]">
          {PILLARS.map((pillar, index) => (
            <PillarRow key={pillar.id} pillar={pillar} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Pillars;
