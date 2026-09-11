import clsx from "clsx";
import type { CSSProperties, ReactNode } from "react";

type ButtonProps = {
  href: string;
  children: ReactNode;
  /** Any hex from the palette. The whole button is drawn from it. */
  accent?: string;
  variant?: "soft" | "solid";
  className?: string;
};

/**
 * A link that looks like a button — an `<a>`, because it navigates.
 *
 * The accent arrives as a CSS custom property rather than four generated
 * classes, so a pillar can hand it its own colour without Tailwind needing to
 * have seen that colour at build time.
 */
export function Button({
  href,
  children,
  accent = "#7648b3",
  variant = "soft",
  className,
}: ButtonProps) {
  const vars = { "--ws-accent": accent } as CSSProperties;

  return (
    <a
      href={href}
      style={vars}
      className={clsx(
        "group inline-flex items-center gap-2.5 rounded-full px-6 py-3.5 text-sm font-semibold",
        "transition-[background-color,color,border-color,box-shadow,transform] duration-300",
        "ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5",
        variant === "solid"
          ? "border border-[var(--ws-accent)] bg-[var(--ws-accent)] text-white hover:shadow-[0_16px_34px_-14px_var(--ws-accent)]"
          : [
              "border border-[color-mix(in_oklab,var(--ws-accent)_26%,transparent)]",
              "bg-[color-mix(in_oklab,var(--ws-accent)_9%,transparent)] text-[var(--ws-accent)]",
              "hover:border-[var(--ws-accent)] hover:bg-[var(--ws-accent)] hover:text-white",
              "hover:shadow-[0_16px_34px_-14px_var(--ws-accent)]",
            ],
        className,
      )}
    >
      <span>{children}</span>
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        className="h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2.5 8h11M9.5 4l4 4-4 4" />
      </svg>
    </a>
  );
}
