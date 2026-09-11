import type { ReactNode } from "react";
import { PROMISES } from "@/lib/site";

/*
  The trust section.

  This one is asked to do more work than a marketing section normally does.
  The woman reading it is about to upload a government identity document to a
  company she has never heard of, and every instinct she has learned about the
  internet is telling her not to. Salesmanship makes that worse, not better —
  so the section is built like a printed guarantee: four plain statements,
  ruled apart, on white, with nothing moving.

  It also refuses to bury the third one. "We never hold your money" is the
  promise a platform is tempted to hide because it sounds like a limitation.
  It is the opposite: it is the reason a woman's earnings cannot be frozen,
  skimmed or lost by us. So it gets drawn, not softened.

  ─────────────────────────────────────────────────────────────────────────

  And it stays still. That is a decision, not an omission.

  This section sits immediately after the longest piece of choreography on the
  page — a pinned circle that a woman watches assemble itself over a screen and
  a half of scrolling. Following that with another arrival would say that the
  page is trying to impress her. Following it with four sentences that are
  simply THERE, flat on white, is the only way this section's actual claim
  reads as true: we are not performing for you, here are the terms.

  The one thing it does take from the rest of the page is the crossing above
  it. The dark section hands its ground back to the canvas across eleven rems
  rather than at a line, so this arrives as the page coming back into daylight
  rather than as a slide change. That transition belongs to `HowItWorks`,
  which owns the edge it is on.

  Nothing here is scroll-driven, nothing here is deferred behind an observer,
  and there is no client boundary in this file at all: it is the one section
  that ships to the browser as HTML and nothing else.
*/

const ICONS: readonly ReactNode[] = [
  // Women only — a shield that has been checked by hand.
  <>
    <path d="M12 3.2 4.8 6v5.3c0 4.4 3 8 7.2 9.4 4.2-1.4 7.2-5 7.2-9.4V6L12 3.2Z" />
    <path d="m9.1 11.9 2.1 2.2 3.9-4.2" />
  </>,
  // Free to join — a price tag with nothing written on it.
  <>
    <path d="M20.3 12.7 12.5 4.9a1.6 1.6 0 0 0-1.1-.4H5.9a1.4 1.4 0 0 0-1.4 1.4v5.5c0 .4.2.8.4 1.1l7.8 7.8a1.4 1.4 0 0 0 2 0l5.6-5.6a1.4 1.4 0 0 0 0-2Z" />
    <path d="M8.4 8.4h.01" />
  </>,
  // We never hold your money — one dot to another, and no stop in between.
  <>
    <circle cx="4.9" cy="12" r="2.1" />
    <circle cx="19.1" cy="12" r="2.1" />
    <path d="M7.4 12h9.1" />
    <path d="m14.2 9.4 2.6 2.6-2.6 2.6" />
  </>,
  // Your documents stay yours — a closed lock, not an open one.
  <>
    <rect x="4.6" y="10.4" width="14.8" height="9.6" rx="2.6" />
    <path d="M8.1 10.4V7.9a3.9 3.9 0 0 1 7.8 0v2.5" />
    <path d="M12 14.3v2" />
  </>,
];

export function Promises() {
  return (
    <section
      id="trust"
      aria-labelledby="trust-heading"
      className="scroll-mt-28 bg-canvas py-20 sm:py-24 md:py-32"
    >
      <div className="mx-auto grid w-full max-w-[1440px] gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:gap-16 lg:px-10 xl:gap-24">
        <div className="lg:self-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-3.5 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-brand-700">
            <span aria-hidden className="size-1.5 rounded-full bg-pink-deep" />
            Our promises
          </p>

          <h2
            id="trust-heading"
            className="u-balance mt-6 font-display text-[clamp(2rem,4.6vw,3.4rem)] font-semibold leading-[1.05] tracking-[-0.025em] text-ink"
          >
            Before you hand us anything, read this.
          </h2>

          <p className="mt-5 max-w-[46ch] text-[1.0625rem] leading-relaxed text-muted sm:text-lg">
            Four promises, in the same words the app uses. We would rather lose
            a sign-up than quietly break one of them — so they are written down
            here, where you can hold us to them.
          </p>

          <p className="mt-6 flex items-start gap-3 rounded-2xl border border-line bg-surface p-4 text-[0.9375rem] leading-relaxed text-ink-2">
            <svg
              viewBox="0 0 24 24"
              aria-hidden
              className="mt-0.5 size-5 shrink-0 text-brand-600"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="8.6" />
              <path d="M12 11.2v5" />
              <path d="M12 7.9h.01" />
            </svg>
            <span>
              Nothing below is a feature that can be switched off later. They
              are the terms the platform is built on.
            </span>
          </p>
        </div>

        <ul className="divide-y divide-line overflow-hidden rounded-3xl border border-line bg-surface shadow-[0_30px_70px_-50px_rgba(20,16,42,0.55)]">
          {PROMISES.map((promise, index) => (
            <li
              key={promise.title}
              className="flex gap-4 p-5 sm:gap-5 sm:p-7 lg:p-8"
            >
              <span
                aria-hidden
                className="grid size-11 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-700 ring-1 ring-brand-100"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="size-[22px]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {ICONS[index]}
                </svg>
              </span>

              <div className="min-w-0">
                <h3 className="font-display text-[1.25rem] font-semibold leading-snug tracking-[-0.01em] text-ink sm:text-[1.375rem]">
                  {promise.title}
                </h3>
                <p className="mt-2 text-[0.9875rem] leading-relaxed text-muted sm:text-base">
                  {promise.body}
                </p>
                {index === 2 && <MoneyPath />}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/*
  The money promise, drawn.

  Two named ends and a line between them, with our own name sitting off the
  line rather than on it. It is the whole claim in one glance, and it is the
  claim a woman most needs to believe before she lets a platform anywhere near
  the money she has earned.
*/
function MoneyPath() {
  return (
    <div className="mt-4 rounded-2xl border border-brand-100 bg-brand-50/70 p-3.5 sm:p-4">
      <div className="flex items-center gap-2 sm:gap-3">
        <span className="rounded-full bg-surface px-3 py-1.5 text-[0.8125rem] font-semibold text-ink ring-1 ring-brand-100">
          Buyer
        </span>
        <span aria-hidden className="flex min-w-0 flex-1 items-center">
          <span className="h-px flex-1 bg-gradient-to-r from-brand-300 to-brand-500" />
          <svg viewBox="0 0 12 12" className="size-3 text-brand-500" fill="none">
            <path
              d="m4 2 4 4-4 4"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className="rounded-full bg-surface px-3 py-1.5 text-[0.8125rem] font-semibold text-ink ring-1 ring-brand-100">
          You
        </span>
      </div>
      <p className="mt-2.5 text-[0.8125rem] leading-snug text-ink-2">
        WomSakhi is not a step on that line. There is no wallet of ours for
        your money to sit in.
      </p>
    </div>
  );
}

export default Promises;
