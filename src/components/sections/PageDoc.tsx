import type { ReactNode } from "react";
import clsx from "clsx";

/*
  The frame the two long documents are read in.

  Privacy and Terms are the only pages on this site where someone is looking
  for one paragraph rather than reading from the top — she wants the bit about
  her identity document, or the bit about what gets an account closed, and she
  wants it now. So the sections are numbered, addressable by their own anchor,
  and listed once at the top of the page. On a wide screen that list stops
  scrolling with the page and stays beside the text; on a phone it is a card at
  the top, which is the same list without pretending a 390px screen has a
  margin to park it in.

  There is no JavaScript in this file. The contents are plain anchors, the
  sections are plain sections, and a woman on a slow connection whose scripts
  never arrive gets the entire document exactly as it is written here.
*/

export type DocSection = {
  /** The anchor, and the key. */
  id: string;
  title: string;
};

/*
  The measure, in rem rather than in `ch`.

  `ch` is the advance width of a zero, and in Plus Jakarta Sans at 17px that is
  12.4px — so `max-w-[65ch]` computed to 809px and put ninety-odd characters on
  a line, which was measured off the rendered page rather than assumed. The
  column is 36rem instead, which lands at sixty-eight characters here.
*/
const PROSE = "text-[1.0625rem] leading-[1.75] text-ink-2";

export function PageDoc({
  sections,
  children,
}: {
  sections: readonly DocSection[];
  children: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 py-14 sm:px-6 sm:py-20 lg:grid lg:grid-cols-[minmax(0,17rem)_minmax(0,36rem)] lg:gap-x-16 xl:gap-x-24 lg:px-10">
      <nav
        aria-labelledby="doc-contents"
        className="mb-12 lg:sticky lg:top-28 lg:mb-0 lg:self-start"
      >
        <h2
          id="doc-contents"
          className="text-[0.8125rem] font-semibold uppercase tracking-[0.16em] text-muted"
        >
          On this page
        </h2>
        <ol className="mt-3 rounded-2xl border border-line bg-surface p-2 lg:border-0 lg:bg-transparent lg:p-0">
          {sections.map((section, index) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-[0.9375rem] leading-snug text-ink-2 transition-colors hover:bg-brand-50 hover:text-brand-700 lg:px-2"
              >
                <span
                  aria-hidden="true"
                  className="w-5 shrink-0 text-[0.8125rem] font-semibold tabular-nums text-brand-500"
                >
                  {index + 1}
                </span>
                {section.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <article className="min-w-0 space-y-10">{children}</article>
    </div>
  );
}

export function PageDocSection({
  id,
  index,
  title,
  children,
}: {
  id: string;
  /** Printed beside the heading, so the contents list and the document agree. */
  index: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="scroll-mt-28 border-t border-line pt-10 first:border-t-0 first:pt-0"
    >
      <h2
        id={`${id}-heading`}
        className="u-balance font-display text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.02em] text-ink sm:text-[2rem]"
      >
        <span aria-hidden="true" className="mr-3 text-brand-400 tabular-nums">
          {index}
        </span>
        {title}
      </h2>
      <div className={clsx("mt-5 space-y-5", PROSE)}>{children}</div>
    </section>
  );
}

/** A sub-heading inside a section. An h3, because the section above it is an h2. */
export function PageDocHeading({ children }: { children: ReactNode }) {
  return (
    <h3 className="pt-2 font-display text-[1.1875rem] font-semibold leading-snug tracking-[-0.01em] text-ink">
      {children}
    </h3>
  );
}

/** A list that keeps the measure and marks each line with the brand rather than a bullet glyph. */
export function PageDocList({ items }: { items: readonly ReactNode[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item, index) => (
        <li key={index} className="flex gap-3">
          <span
            aria-hidden="true"
            className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-brand-400"
          />
          <span className="min-w-0">{item}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * The box a page uses to say something about itself — that it has not been
 * near a lawyer, most often. It is `role="note"` and it is not decorative, so
 * it is drawn as firmly as the text it qualifies.
 */
export function PageDocNote({
  title,
  children,
  tone = "brand",
}: {
  title: string;
  children: ReactNode;
  tone?: "brand" | "plain";
}) {
  return (
    <aside
      className={clsx(
        "rounded-2xl border p-5 sm:p-6",
        tone === "brand"
          ? "border-brand-200 bg-brand-50"
          : "border-line bg-surface",
      )}
    >
      <h2 className="flex items-start gap-3 font-display text-[1.125rem] font-semibold leading-snug text-ink">
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
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
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-[0.9875rem] leading-[1.7] text-ink-2 sm:pl-8">
        {children}
      </div>
    </aside>
  );
}

export default PageDoc;
