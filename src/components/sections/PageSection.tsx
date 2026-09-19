import type { ReactNode } from "react";
import clsx from "clsx";

/*
  A section of an ordinary page: the heading on the left, the argument on the
  right, the way `Promises` does it on the home page.

  Two columns rather than one centred block, because the thing that makes long
  prose readable is a measure of about sixty-five characters — and on a 1440px
  screen a single column either runs to a hundred and forty characters or
  leaves two hundred pixels of white on each side pretending to be design. The
  heading takes the left-hand space and the text keeps its measure.

  On a phone the two stack, which is the same document with the grid taken
  away. No JavaScript, no observer, nothing that starts invisible.
*/

export function PageSection({
  id,
  eyebrow,
  title,
  children,
  className,
}: {
  id: string;
  eyebrow?: string;
  title: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={clsx("scroll-mt-28 py-14 sm:py-20", className)}
    >
      <div className="mx-auto grid w-full max-w-[1440px] gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,20rem)_minmax(0,36rem)] lg:gap-16 lg:px-10 xl:gap-24">
        <div className="lg:self-start">
          {eyebrow ? (
            <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.16em] text-brand-600">
              {eyebrow}
            </p>
          ) : null}
          <h2
            id={`${id}-heading`}
            className={clsx(
              "u-balance font-display text-[clamp(1.875rem,3.4vw,2.75rem)] font-semibold leading-[1.08] tracking-[-0.025em] text-ink",
              eyebrow && "mt-3",
            )}
          >
            {title}
          </h2>
        </div>

        <div className="min-w-0 space-y-5 text-[1.0625rem] leading-[1.75] text-ink-2 sm:text-[1.125rem]">
          {children}
        </div>
      </div>
    </section>
  );
}

export default PageSection;
