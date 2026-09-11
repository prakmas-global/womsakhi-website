import clsx from "clsx";
import type { ReactNode } from "react";

type SectionHeadingProps = {
  /** Anchor for the section's `aria-labelledby`. */
  id?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
};

/**
 * The one heading a section is allowed. It renders an `h2` and nothing that
 * pretends to be one, so the document outline stays honest: section > h2, and
 * every card underneath is an h3.
 */
export function SectionHeading({
  id,
  title,
  lead,
  align = "left",
  tone = "light",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={clsx(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <h2
        id={id}
        className={clsx(
          "u-balance font-display text-[2.125rem] leading-[1.06] tracking-[-0.025em] sm:text-5xl lg:text-[3.25rem]",
          tone === "dark" ? "text-white" : "text-ink",
        )}
      >
        {title}
      </h2>
      {lead ? (
        <p
          className={clsx(
            "u-balance mt-5 text-lg leading-[1.7] sm:text-xl",
            tone === "dark" ? "text-brand-200/80" : "text-muted",
          )}
        >
          {lead}
        </p>
      ) : null}
    </div>
  );
}
