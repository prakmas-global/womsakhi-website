import type { ReactNode } from "react";

/*
  The top of a page that is not the home page.

  The home hero earns a hundred-viewport-high stage and a WebGL ring because it
  has to stop someone who arrived by accident. These four pages have the
  opposite job: whoever is here came looking for something specific — what this
  is, how to reach a person, what happens to her identity document — and the
  fastest way to serve her is to put the question at the top in large type and
  then answer it.

  So the ground is the hero's own gradient, drawn in CSS and nothing else. It
  paints with the first byte of HTML, it does not move, and there is no
  observer anywhere in this file: the heading a woman came for is never one
  frame away from being visible.
*/

const GROUND =
  "radial-gradient(110% 76% at 82% 4%, rgba(225,96,164,0.16) 0%, rgba(225,96,164,0) 58%)," +
  "radial-gradient(90% 66% at 4% 0%, rgba(118,72,179,0.15) 0%, rgba(118,72,179,0) 62%)," +
  "linear-gradient(178deg, #f4eefd 0%, #f8f4ff 52%, #faf8ff 100%)";

export type PageHeaderProps = {
  /** The small label above the headline — the section of the site you are in. */
  eyebrow: string;
  title: ReactNode;
  lead: ReactNode;
  /** A dated line under the lead, for the pages that need one. */
  meta?: ReactNode;
};

export function PageHeader({ eyebrow, title, lead, meta }: PageHeaderProps) {
  return (
    <header className="relative isolate overflow-hidden border-b border-line">
      <div aria-hidden="true" className="absolute inset-0 -z-10" style={{ background: GROUND }} />
      <span aria-hidden="true" className="u-grain -z-10" />

      <div className="mx-auto w-full max-w-[1440px] px-4 pb-14 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:px-10 lg:pb-24 lg:pt-20">
        <p className="inline-flex items-center gap-2.5 rounded-full border border-brand-200 bg-white/70 px-3.5 py-2 text-[0.8125rem] font-semibold uppercase tracking-[0.16em] text-brand-800">
          <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-pink-brand" />
          {eyebrow}
        </p>

        <h1
          className="u-balance mt-6 max-w-[18ch] font-display text-[clamp(2.25rem,5.6vw,4rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-ink"
          style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 42, 'WONK' 1" }}
        >
          {title}
        </h1>

        <p className="mt-6 max-w-[40rem] text-[clamp(1.0625rem,1.15vw,1.25rem)] leading-[1.65] text-ink-2">
          {lead}
        </p>

        {meta ? (
          <p className="mt-6 max-w-[40rem] text-[0.875rem] leading-relaxed text-muted">{meta}</p>
        ) : null}
      </div>
    </header>
  );
}

export default PageHeader;
