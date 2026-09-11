import { SITE } from "@/lib/site";
import { DepthLayer } from "@/components/motion/DepthLayer";
import { Seam } from "@/components/ui/Seam";
import { SplitText } from "@/components/ui/SplitText";

/*
  The closing ask.

  An invitation, which means it has to be warm and it has to be finished — no
  countdown, no "limited spots", nothing that would make a woman feel hurried
  into handing over her details. The panel is the only large dark surface at
  the end of the page, which is what gives the scroll a floor to land on.

  Every colour here was measured against the darkest and the lightest point of
  the gradient, not against the flat base: the pink glow lifts the ground
  under the heading, and text that passes on #2c1a5c can quietly fail on the
  lit part of the same panel.

  It is still a Server Component. The two moving parts — the panel arriving,
  the heading arriving a word at a time — are client boundaries around content
  that is rendered on the server and handed to them as children, so the copy
  and the links are in the HTML exactly once.
*/

/*
  The panel comes towards you and stops.

  Not a there-and-back drift: this is the last thing on the page and it should
  settle, not keep moving under the buttons a woman is trying to press. The
  `settle` curve runs the whole travel in the first 55% of the passage and then
  holds at rest — which is also the value the server renders, so a page without
  JavaScript shows the settled panel and nothing else.
*/
const PANEL = { scale: [0.945, 1] } as const;
const GLOW = { y: [50, -50] } as const;

/** The footer's ground, rising into the page's. */
const FOOTER_GROUND = "#1a0f38";

export function FinalCta() {
  return (
    <section
      id="join"
      aria-labelledby="join-heading"
      className="relative isolate scroll-mt-28 bg-canvas px-4 pt-4 pb-28 sm:px-6 sm:pb-32 md:pb-40 lg:px-10"
    >
      {/* Into the footer without a line across the page. */}
      <Seam from={FOOTER_GROUND} edge="bottom" depth="7rem" />

      <DepthLayer
        ranges={PANEL}
        curve="settle"
        className="relative isolate mx-auto w-full max-w-[1440px] overflow-hidden rounded-[1.75rem] bg-brand-900 sm:rounded-[2.25rem]"
      >
        {/* The lit corner drifts against the panel as it passes — the only
            movement inside the panel, and it is light rather than text. */}
        <DepthLayer
          decorative
          ranges={GLOW}
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage:
              "radial-gradient(75% 90% at 88% 8%, rgba(225,96,164,0.34), transparent 62%), radial-gradient(65% 85% at 4% 96%, rgba(143,106,232,0.34), transparent 60%), radial-gradient(90% 120% at 50% 120%, rgba(26,15,56,0.55), transparent 70%)",
          }}
        />
        <span aria-hidden className="u-grain -z-10" />

        <div className="relative mx-auto max-w-[760px] px-5 py-16 text-center sm:px-8 sm:py-20 md:py-28">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-white">
            <span aria-hidden className="size-1.5 rounded-full bg-gold" />
            Free to join
          </p>

          {/*
            The one line on the page that answers the circle.

            The section above ends with six places and only five women in them.
            This sentence is what that empty seat meant, so it arrives a word at
            a time rather than all at once — the only headline on the page,
            besides the pillars', that is given that weight.
          */}
          <h2
            id="join-heading"
            className="u-balance mt-7 font-display text-[clamp(2.25rem,6.2vw,4.25rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-white"
          >
            <SplitText stagger={0.06} delay={0.05}>
              There is room for you here.
            </SplitText>
          </h2>

          <p className="u-balance mx-auto mt-6 max-w-[52ch] text-[1.0625rem] leading-relaxed text-brand-100 sm:text-xl">
            Learn a skill, find work that respects you, sell what you make — and
            do it beside women who have already done it. Free to join, and free
            to stay.
          </p>

          {/*
            The buttons sit low and centre, where the pink glow has already
            fallen away. Sampled off the rendered page, the ground under the
            focus ring is #28-2d1a5a, which puts the shared brand-500 ring at
            3.78-4.31:1 — over the 3:1 SC 1.4.11 asks of a focus indicator.
            Move them up into the lit corner and that stops being true.
          */}
          <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <a
              href={SITE.signup}
              className="inline-flex min-h-[56px] items-center justify-center gap-2 rounded-full bg-white px-8 text-[1.0625rem] font-semibold text-brand-800 shadow-[0_20px_44px_-20px_rgba(0,0,0,0.9)] transition-[background-color,transform] duration-200 hover:bg-brand-50 active:translate-y-px"
            >
              Join {SITE.name}
              <svg viewBox="0 0 20 20" aria-hidden className="size-[18px]" fill="none">
                <path
                  d="M4.5 10h10m-4-4.5 4.5 4.5-4.5 4.5"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a
              href={SITE.signin}
              className="inline-flex min-h-[56px] items-center justify-center rounded-full border border-white/45 px-8 text-[1.0625rem] font-semibold text-white transition-colors duration-200 hover:bg-white/12"
            >
              I already have an account
            </a>
          </div>

          <ul className="mx-auto mt-9 flex max-w-[44ch] flex-wrap items-center justify-center gap-x-5 gap-y-2.5 text-[0.875rem] text-brand-200">
            {[
              "Women only",
              "A real person reviews every account",
              "No fee to learn, or to be paid",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <svg
                  viewBox="0 0 16 16"
                  aria-hidden
                  className="size-4 shrink-0 text-brand-300"
                  fill="none"
                >
                  <path
                    d="m3.4 8.4 3 3 6.2-7"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </DepthLayer>
    </section>
  );
}

export default FinalCta;
