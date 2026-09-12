import Image from "next/image";
import Link from "next/link";
import { PILLARS, SITE } from "@/lib/site";

/*
  The bar for the pages that are not the home page.

  It is deliberately not `Nav`. `Nav` is built for the long scroll it sits on:
  it is a client component that watches the scroll position, opens a focus-
  trapped sheet, and points its four links at `#learn`, `#work`, `#earn` and
  `#circle` — anchors that exist on the home page and nowhere else. Rendered on
  /about, those four links would be four pieces of furniture that do nothing
  when a woman taps them.

  So this one points at `/#learn` instead, which works from any route, and it
  ships no JavaScript at all: sticky rather than scroll-watched, and no sheet
  to open because there is nothing here that needs hiding behind a hamburger.
  On a phone it carries the brand and the one link that matters, and the rest
  of the site is in the footer where it already was.
*/

const EXPLORE = PILLARS.map((pillar) => ({
  href: `/#${pillar.id}`,
  label: pillar.eyebrow,
}));

export function PageNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-canvas/90 backdrop-blur-xl backdrop-saturate-150">
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-6 md:h-20 lg:px-10"
      >
        <Link
          href="/"
          className="flex min-h-11 shrink-0 items-center gap-2.5 rounded-full pr-2"
        >
          <span className="relative size-9 shrink-0 overflow-hidden rounded-full ring-1 ring-brand-200/70 md:size-10">
            <Image
              src="/brand-mark.png"
              alt=""
              width={80}
              height={80}
              priority
              className="size-full scale-[1.12] object-cover"
            />
          </span>
          <span className="font-display text-[1.15rem] font-semibold tracking-[-0.01em] text-ink md:text-[1.25rem]">
            {SITE.name}
          </span>
          <span className="sr-only">— {SITE.tagline}. Home.</span>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {EXPLORE.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="inline-flex min-h-11 items-center rounded-full px-4 text-[0.95rem] font-medium text-ink-2 transition-colors hover:bg-brand-50 hover:text-brand-700"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1.5">
          <a
            href={SITE.signin}
            className="hidden min-h-11 items-center rounded-full px-4 text-[0.95rem] font-medium text-ink-2 transition-colors hover:bg-brand-50 hover:text-brand-700 sm:inline-flex"
          >
            Sign in
          </a>
          <a
            href={SITE.signup}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-brand-600 px-5 text-[0.95rem] font-semibold text-white shadow-[0_10px_24px_-12px_rgba(118,72,179,0.9)] transition-colors duration-200 hover:bg-brand-700"
          >
            Join free
            <svg viewBox="0 0 20 20" aria-hidden className="size-4" fill="none">
              <path
                d="M4.5 10h10m-4-4.5 4.5 4.5-4.5 4.5"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </nav>
    </header>
  );
}

export default PageNav;
