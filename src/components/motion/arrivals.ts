"use client";

/*
  One observer for the whole page.

  Every arrival on this site — a reveal, a split heading — needs the same
  question answered: has this element come far enough up the screen yet? Asking
  it with a fresh IntersectionObserver per element means thirty observers, each
  with its own callback and its own entry list, all firing in the same frame.
  One observer with a map of callbacks costs the same information for a
  fraction of the bookkeeping, and it disconnects itself the moment the last
  subscriber goes.

  The threshold is deliberately generous (a hair over nothing, with the bottom
  of the viewport pulled up 8%) so an element arrives slightly after it is
  technically visible, which is when it feels like it arrived rather than like
  it was late.
*/

type Handler = () => void;

let observer: IntersectionObserver | null = null;
const handlers = new WeakMap<Element, Handler>();
let watched = 0;

function ensureObserver(): IntersectionObserver | null {
  if (typeof IntersectionObserver === "undefined") return null;
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const handler = handlers.get(entry.target);
          if (handler) handler();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
    );
  }
  return observer;
}

/**
 * Calls `onEnter` once, the first time `element` reaches the arrival line, then
 * forgets it. Returns a teardown for the caller's effect.
 */
export function onArrival(element: Element, onEnter: Handler): () => void {
  const io = ensureObserver();
  if (!io) return () => {};

  let done = false;
  const stop = () => {
    if (done) return;
    done = true;
    io.unobserve(element);
    handlers.delete(element);
    watched -= 1;
    if (watched === 0) {
      io.disconnect();
      observer = null;
    }
  };

  handlers.set(element, () => {
    stop();
    onEnter();
  });
  watched += 1;
  io.observe(element);

  return stop;
}

/**
 * Is this element already on screen?
 *
 * The check every scroll-reveal forgets. An element the visitor is *already
 * looking at* when hydration lands must be left exactly as the server drew it:
 * hiding it so it can fade back in is a flash, not a reveal. It happens on a
 * slow phone, and it happens every time a browser restores a scroll position.
 */
export function alreadyOnScreen(element: Element): boolean {
  const viewport = window.innerHeight || document.documentElement.clientHeight;
  return element.getBoundingClientRect().top < viewport * 0.92;
}
