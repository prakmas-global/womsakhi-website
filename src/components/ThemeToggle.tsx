"use client";

import { useCallback, useSyncExternalStore } from "react";

export const THEME_KEY = "womsakhi-theme";

/**
 * The theme is external state: it lives in a `data-theme` attribute on <html>
 * that the inline script in layout.tsx writes before first paint, falling back
 * to the OS preference. `useSyncExternalStore` is the right way to read it —
 * it subscribes to both sources and gives React a server snapshot to hydrate
 * against, with no setState-in-effect and no hydration mismatch.
 *
 * The icons themselves are swapped in CSS, so the button looks correct during
 * the hydration render regardless of what the server assumed.
 */
function subscribe(onChange: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  media.addEventListener("change", onChange);
  return () => {
    observer.disconnect();
    media.removeEventListener("change", onChange);
  };
}

function getSnapshot() {
  const chosen = document.documentElement.getAttribute("data-theme");
  if (chosen === "dark") return true;
  if (chosen === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

/** The server cannot know the visitor's preference; CSS covers the difference. */
function getServerSnapshot() {
  return false;
}

export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback(() => {
    const next = !getSnapshot();
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
    try {
      localStorage.setItem(THEME_KEY, next ? "dark" : "light");
    } catch {
      /* private mode — the choice simply does not persist */
    }
  }, []);

  const label = dark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      className="themeToggle"
      onClick={toggle}
      aria-label={label}
      title={label}
      aria-pressed={dark}
    >
      <svg className="themeIcon themeIconSun" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="4.4" />
        <g strokeLinecap="round">
          <path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6" />
        </g>
      </svg>
      <svg className="themeIcon themeIconMoon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M20.1 14.6A8.4 8.4 0 0 1 9.4 3.9a8.4 8.4 0 1 0 10.7 10.7Z" />
      </svg>
    </button>
  );
}
