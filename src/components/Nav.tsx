"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import clsx from "clsx";
import { PILLARS, SITE } from "@/lib/site";

/*
  The bar at the top of the page.

  Two jobs, and the second one is the one that usually gets botched. The first
  is to sit transparently over the hero and then harden into a real bar once
  you have scrolled past it. The second is the mobile menu: a hamburger that
  opens a sheet a keyboard cannot leave is not a navigation, it is a trap. So
  the sheet traps focus deliberately (Tab cycles inside it), closes on Escape,
  closes when a link is taken, and hands focus back to the button that opened
  it — which is the only way a screen-reader user knows where she landed.
*/

/* The nav labels and the anchors are the pillars' own, so the two can never
   drift apart: if a pillar id changes, this changes with it. */
const LINKS = PILLARS.map((pillar) => ({
  href: `#${pillar.id}`,
  label: pillar.eyebrow,
  hint: pillar.title,
}));

/** Height of the fixed bar — also the offset an anchor has to clear. */
const BAR_OFFSET = "5.75rem";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const close = useCallback(() => setOpen(false), []);

  /* Scroll state. Read once on mount as well as on scroll, because a reload
     half-way down the page must not paint a transparent bar over content. */
  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      setScrolled(window.scrollY > 24);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });

    /* The bar is fixed, so a native `#anchor` jump would land the target
       underneath it. scroll-padding is the one-line fix, and it belongs to
       whoever owns the bar rather than to the stylesheet. */
    const root = document.documentElement;
    const previousPadding = root.style.scrollPaddingTop;
    root.style.scrollPaddingTop = BAR_OFFSET;

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      root.style.scrollPaddingTop = previousPadding;
    };
  }, []);

  /* Everything the open sheet owes the user: a locked page behind it, a focus
     ring that cannot escape it, Escape to leave, and focus returned on the
     way out. */
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;
    // Captured now, not read in the cleanup: the button we must hand focus
    // back to is the one that was on screen when the sheet opened.
    const trigger = triggerRef.current;

    const body = document.body;
    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;
    // Compensate for the scrollbar so the page behind does not jump sideways.
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

    const focusable = () =>
      Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }
      if (event.key !== "Tab") return;

      const items = focusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      const inside = active instanceof Node && panel.contains(active);

      if (event.shiftKey) {
        if (!inside || active === first) {
          event.preventDefault();
          last.focus();
        }
      } else if (!inside || active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    // Land on the close button: the shortest path back out of the sheet.
    focusable()[0]?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;

      // Only reclaim focus if it is still inside the sheet we are closing —
      // otherwise we would yank it away from wherever it legitimately went.
      const active = document.activeElement;
      const stranded =
        active === document.body ||
        active === null ||
        (active instanceof Node && panel.contains(active));
      if (stranded) trigger?.focus();
    };
  }, [open]);

  /* Close first, move second. The page is scroll-locked while the sheet is
     open, so jumping to the anchor in the same tick would be swallowed. */
  const onSheetLink = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (!href.startsWith("#")) {
        setOpen(false);
        return;
      }
      event.preventDefault();
      setOpen(false);
      window.requestAnimationFrame(() => {
        const target = document.querySelector(href);
        // `auto`, not `smooth`: Lenis drives this page's scrolling, and a
        // native smooth scroll on top of it stutters.
        if (target) target.scrollIntoView({ behavior: "auto", block: "start" });
        window.history.replaceState(null, "", href);
      });
    },
    [],
  );

  const sheetDuration = reduceMotion ? 0 : 0.2;

  return (
    <>
      <header
        className={clsx(
          "fixed inset-x-0 top-0 z-[80] border-b transition-[background-color,border-color,box-shadow] duration-300 ease-[var(--ease-out-quint)]",
          scrolled
            ? "border-line bg-canvas/85 shadow-[0_2px_28px_-18px_rgba(20,16,42,0.5)] backdrop-blur-xl backdrop-saturate-150"
            : "border-transparent bg-transparent",
        )}
      >
        <nav
          aria-label="Main"
          className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-6 md:h-20 lg:px-10"
        >
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2.5 rounded-full py-1 pr-2"
          >
            <BrandMark className="size-9 md:size-10" />
            <span className="font-display text-[1.15rem] font-semibold tracking-[-0.01em] text-ink md:text-[1.25rem]">
              {SITE.name}
            </span>
            <span className="sr-only">— {SITE.tagline}. Home.</span>
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {LINKS.map((link) => (
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

          <div className="hidden items-center gap-1.5 lg:flex">
            <a
              href={SITE.signin}
              className="inline-flex min-h-11 items-center rounded-full px-4 text-[0.95rem] font-medium text-ink-2 transition-colors hover:bg-brand-50 hover:text-brand-700"
            >
              Sign in
            </a>
            <a
              href={SITE.signup}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-brand-600 px-5 text-[0.95rem] font-semibold text-white shadow-[0_10px_24px_-12px_rgba(118,72,179,0.9)] transition-[background-color,transform] duration-200 hover:bg-brand-700 active:translate-y-px"
            >
              Join free
              <Arrow />
            </a>
          </div>

          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={open ? "Close menu" : "Open menu"}
            className="-mr-1 grid size-11 place-items-center rounded-full text-ink transition-colors hover:bg-brand-50 lg:hidden"
          >
            <span aria-hidden className="relative block h-3.5 w-6">
              <span className="absolute left-0 top-0 h-0.5 w-6 rounded-full bg-current" />
              <span className="absolute left-0 top-[6px] h-0.5 w-[18px] rounded-full bg-current" />
              <span className="absolute bottom-0 left-0 h-0.5 w-6 rounded-full bg-current" />
            </span>
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id={panelId}
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${SITE.name} menu`}
            data-lenis-prevent
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: sheetDuration, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[95] flex flex-col overflow-y-auto bg-canvas lg:hidden"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(120%_100%_at_80%_0%,rgba(225,96,164,0.16),transparent_70%),radial-gradient(120%_100%_at_0%_0%,rgba(118,72,179,0.16),transparent_70%)]" />

            <div className="relative flex h-16 shrink-0 items-center justify-between gap-3 px-4 sm:px-6">
              <span className="flex items-center gap-2.5">
                <BrandMark className="size-9" />
                <span className="font-display text-[1.15rem] font-semibold tracking-[-0.01em] text-ink">
                  {SITE.name}
                </span>
              </span>
              <button
                type="button"
                onClick={close}
                aria-label="Close menu"
                className="-mr-1 grid size-11 place-items-center rounded-full text-ink transition-colors hover:bg-brand-100"
              >
                <svg viewBox="0 0 24 24" aria-hidden className="size-6" fill="none">
                  <path
                    d="m6.5 6.5 11 11m0-11-11 11"
                    stroke="currentColor"
                    strokeWidth={1.9}
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <motion.div
              initial={{ opacity: 0, y: reduceMotion ? 0 : -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: sheetDuration,
                delay: reduceMotion ? 0 : 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative flex flex-1 flex-col px-4 pb-8 pt-2 sm:px-6"
            >
              <ul className="divide-y divide-line border-y border-line">
                {LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={(event) => onSheetLink(event, link.href)}
                      className="flex min-h-[68px] items-center justify-between gap-4 py-4 transition-colors active:bg-brand-50"
                    >
                      <span>
                        <span className="block font-display text-[1.6rem] font-semibold leading-tight tracking-[-0.01em] text-ink">
                          {link.label}
                        </span>
                        <span className="mt-0.5 block text-[0.85rem] leading-snug text-muted">
                          {link.hint}
                        </span>
                      </span>
                      <span
                        aria-hidden
                        className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-700"
                      >
                        <Arrow />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>

              {/* Absorbs the space a tall phone leaves between the links and
                  the buttons, so the sheet reads as composed rather than as a
                  list that ran out. On a short screen it collapses to nothing. */}
              <p className="my-auto py-8 text-center font-display text-[1.4rem] italic leading-snug text-brand-600">
                {SITE.tagline}
              </p>

              <div className="flex flex-col gap-3">
                <a
                  href={SITE.signup}
                  onClick={close}
                  className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-brand-600 px-6 text-base font-semibold text-white shadow-[0_16px_30px_-16px_rgba(118,72,179,0.95)] transition-colors hover:bg-brand-700"
                >
                  Join free
                  <Arrow />
                </a>
                <a
                  href={SITE.signin}
                  onClick={close}
                  className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-brand-200 bg-surface px-6 text-base font-semibold text-brand-700 transition-colors hover:bg-brand-50"
                >
                  Sign in
                </a>
                <p className="pt-2 text-center text-[0.8rem] text-muted">
                  Free to join · Women only · No fee to be paid
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* The mark is a painted illustration on a cream ground rather than a
   transparent glyph, so it is set in a circle and given a ring: a badge reads
   as intentional where a pale square reads as a broken PNG. */
function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={clsx(
        "relative shrink-0 overflow-hidden rounded-full ring-1 ring-brand-200/70",
        className,
      )}
    >
      <Image
        src="/brand-mark.png"
        alt=""
        width={80}
        height={80}
        priority
        className="size-full scale-[1.12] object-cover"
      />
    </span>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden className="size-4" fill="none">
      <path
        d="M4.5 10h10m-4-4.5 4.5 4.5-4.5 4.5"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default Nav;
