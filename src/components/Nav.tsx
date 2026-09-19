"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { NAV, SITE } from "@/lib/site";
import { ArrowRight, CloseIcon, Lotus, MenuIcon, SearchIcon } from "@/components/home/marks";

/*
  The site header, drawn to the reference design: lotus and serif wordmark
  with its small tagline, six links with the current one underlined, a search
  button, and the two pills.

  It is rendered on every route. It sits transparently on the blush ground at
  the top of the page and takes a frosted background once the page scrolls.

  The search button opens a field that searches the member app — the only
  search that exists — rather than pretending this marketing site has one.

  On a phone the links move into a sheet. The sheet traps focus while open,
  closes on Escape and on any link, and gives focus back to the button that
  opened it.
*/

function isCurrent(pathname: string, href: string) {
  if (href.includes("#")) return false;
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Nav() {
  const pathname = usePathname() ?? "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const sheetId = useId();
  const searchId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchBtnRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      setScrolled(window.scrollY > 8);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  /* The desktop search popover: Escape or a click elsewhere closes it. */
  useEffect(() => {
    if (!searching) return;
    const box = searchRef.current;
    box?.querySelector("input")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearching(false);
        searchBtnRef.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (box && !box.contains(t) && !searchBtnRef.current?.contains(t)) setSearching(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [searching]);

  /* The phone sheet: lock the page, trap focus, Escape to leave. */
  useEffect(() => {
    if (!open) return;
    const sheet = sheetRef.current;
    if (!sheet) return;
    const trigger = triggerRef.current;
    const body = document.body;
    const previous = body.style.overflow;
    body.style.overflow = "hidden";

    const focusable = () =>
      Array.from(sheet.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input'));

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusable();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !sheet.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !sheet.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    focusable()[0]?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      body.style.overflow = previous;
      trigger?.focus();
    };
  }, [open]);

  return (
    <>
    <header className="ws ws-header" data-scrolled={scrolled || undefined}>
      <div className="ws-canvas ws-header-bar">
        <Link href="/" className="ws-brand" aria-label={`${SITE.name} home`}>
          <Lotus className="ws-lotus" />
          <span className="ws-brand-text">
            <span className="ws-wordmark">{SITE.name}</span>
            <span className="ws-tagline">Stronger women. Brighter tomorrows.</span>
          </span>
        </Link>

        <nav aria-label="Main">
          <ul className="ws-nav">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          ref={searchBtnRef}
          type="button"
          className="ws-search"
          aria-label="Search WomSakhi"
          aria-expanded={searching}
          aria-controls={searchId}
          onClick={() => setSearching((v) => !v)}
        >
          <SearchIcon />
        </button>

        {searching && (
          <div ref={searchRef} id={searchId} className="ws-search-pop" role="search">
            <form action={SITE.search} method="get">
              <label className="ws-sr" htmlFor={`${searchId}-q`}>
                Search courses, mentors and topics
              </label>
              <input id={`${searchId}-q`} name="q" type="search" placeholder="Search courses, mentors, topics" />
              <button type="submit">Search</button>
            </form>
            <p>Searches the WomSakhi member app. You may be asked to sign in.</p>
          </div>
        )}

        <a href={SITE.signin} className="ws-pill ws-pill-outline ws-signin">
          Sign In
        </a>
        <a href={SITE.signup} className="ws-pill ws-pill-berry ws-getstarted">
          Get Started
        </a>

        <button
          ref={triggerRef}
          type="button"
          className="ws-menu-btn"
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls={sheetId}
          onClick={() => setOpen(true)}
        >
          <MenuIcon />
        </button>
      </div>
    </header>

      {/* Outside the header: the header's backdrop blur would otherwise become
          the containing block of this fixed sheet once the page has scrolled. */}
      {open && (
        <div
          ref={sheetRef}
          id={sheetId}
          className="ws ws-sheet"
          role="dialog"
          aria-modal="true"
          aria-label={`${SITE.name} menu`}
          data-lenis-prevent
        >
          <div className="ws-sheet-top">
            <Link href="/" className="ws-brand" onClick={close} aria-label={`${SITE.name} home`}>
              <Lotus className="ws-lotus" />
              <span className="ws-brand-text">
                <span className="ws-wordmark">{SITE.name}</span>
              </span>
            </Link>
            <button type="button" className="ws-sheet-close" aria-label="Close menu" onClick={close}>
              <CloseIcon />
            </button>
          </div>

          <nav aria-label="Main">
            <ul>
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={close}
                    aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
                  >
                    {item.label}
                    <ArrowRight className="" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <form className="ws-sheet-search" action={SITE.search} method="get" role="search">
            <label className="ws-sr" htmlFor={`${sheetId}-q`}>
              Search courses, mentors and topics
            </label>
            <input id={`${sheetId}-q`} name="q" type="search" placeholder="Search courses, mentors…" />
            <button type="submit">Search</button>
          </form>

          <div className="ws-sheet-cta">
            <a href={SITE.signup} className="ws-pill ws-pill-berry" onClick={close}>
              Get Started
              <ArrowRight />
            </a>
            <a href={SITE.signin} className="ws-pill ws-pill-outline" onClick={close}>
              Sign In
            </a>
          </div>
          <p className="ws-sheet-script">Stronger Together ♡</p>
        </div>
      )}
    </>
  );
}

export default Nav;
