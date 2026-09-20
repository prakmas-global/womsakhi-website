"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

export const APP = process.env.NEXT_PUBLIC_APP_URL || "https://app.womsakhi.com";

export const NAV: [string, string][] = [
  ["Home", "/"],
  ["About", "/about"],
  ["Programs", "/programs"],
  ["Community", "/community"],
  ["Resources", "/resources"],
  ["Contact", "/contact"],
];

/**
 * One header for the home page and every marketing route. It was two near
 * identical copies before, which is how the two drifted apart.
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panel = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  // Close the panel when the route changes, including on back/forward. This is
  // the "adjust state during render" pattern rather than an effect, so the
  // panel is already closed in the same render the new route appears in.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    if (open) setOpen(false);
  }

  // Close the panel on Escape, on an outside click and whenever the route
  // changes, and hand focus back to the button that opened it.
  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    }
    function onPointer(event: PointerEvent) {
      const target = event.target as Node;
      if (panel.current?.contains(target) || trigger.current?.contains(target)) return;
      setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);


  return (
    <header className="header marketingHeader">
      <Link className="brand brandOfficial brandWordOnly" href="/" aria-label="WomSakhi home">
        <Image className="brandMarkLight" src="/assets/womsakhi-wordmark.png" alt="WomSakhi" width={150} height={50} priority />
        <Image className="brandMarkDark" src="/assets/womsakhi-wordmark-dark.png" alt="" aria-hidden="true" width={150} height={50} priority />
      </Link>

      <div className="navPanel" id="site-nav" ref={panel} data-open={open ? "true" : "false"}>
        <nav aria-label="Primary" className={open ? "open" : ""}>
          {NAV.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className={pathname === href ? "active" : ""}
              aria-current={pathname === href ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
        </nav>
        {/* Repeated inside the panel so phone visitors keep both account
            actions — the header versions are hidden at small widths. */}
        <div className="navPanelActions">
          <a className="ghost" href={`${APP}/signin`}>Sign In</a>
          <a className="primary" href={`${APP}/signup`}>Get Started</a>
        </div>
      </div>

      <div className="headerActions">
        <a className="searchAction" aria-label="Search WomSakhi" href={`${APP}/app/search`}>
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <circle cx="10.8" cy="10.8" r="6.4" />
            <path d="m15.6 15.6 4 4" strokeLinecap="round" />
          </svg>
        </a>
        <ThemeToggle />
        <a className="ghost headerSignIn" href={`${APP}/signin`}>Sign In</a>
        <a className="primary headerStart" href={`${APP}/signup`}>Get Started</a>
      </div>

      <button
        ref={trigger}
        className="menu"
        type="button"
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open}
        aria-controls="site-nav"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="menuBars" data-open={open ? "true" : "false"} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </button>
    </header>
  );
}
