"use client";

import {
  Component,
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import dynamic from "next/dynamic";
import type { Frameloop } from "@react-three/fiber";
import { createPointerState, type PointerState } from "./pointer";

/**
 * Everything that decides whether the hero's WebGL should be running at all.
 *
 * The canvas itself knows nothing about the page. This component knows nothing
 * about three.js. It answers four questions — can this browser do WebGL, is the
 * hero on screen, is the tab in front, and has this woman asked for less motion
 * — and hands the answer down as one `frameloop` string.
 *
 * `ssr: false` is the important half of the import: three.js touches `window`
 * at module scope, so a server render of it throws. Next 16 only allows that
 * option inside a Client Component, which is why this file carries the
 * `"use client"` directive and `Hero.tsx` — where the headline lives — does not.
 */
const HeroCanvas = dynamic(() => import("./HeroCanvas"), {
  ssr: false,
  loading: () => null,
});

/* ── Browser facts, read the way React 19 wants browser facts read ─────────
   Each of these is state that lives outside React, so each is subscribed to
   with `useSyncExternalStore` rather than copied into `useState` from an
   effect. The third argument is the server's answer, and both server answers
   are the cautious ones: no WebGL, and reduced motion. A page that guesses
   wrong for one paint should guess in the direction of doing less. */

let motionQuery: MediaQueryList | null = null;
function getMotionQuery(): MediaQueryList | null {
  if (typeof window === "undefined") return null;
  motionQuery ??= window.matchMedia("(prefers-reduced-motion: reduce)");
  return motionQuery;
}

function subscribeMotion(onChange: () => void): () => void {
  const query = getMotionQuery();
  if (!query) return () => {};
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** Defaults to "yes, reduce" if the query cannot be read at all. */
const getMotionSnapshot = (): boolean => getMotionQuery()?.matches ?? true;
const getMotionServerSnapshot = (): boolean => true;

function subscribeVisibility(onChange: () => void): () => void {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

const getVisibilitySnapshot = (): boolean => document.visibilityState !== "hidden";
const getVisibilityServerSnapshot = (): boolean => true;

/** Cached: creating a probe context is not free, and the answer cannot change. */
let webglSupport: boolean | null = null;
function getWebGLSnapshot(): boolean {
  webglSupport ??= detectWebGL();
  return webglSupport;
}
const getWebGLServerSnapshot = (): boolean => false;
const neverChanges = () => () => {};

function detectWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    if (!gl) return false;
    // Free it immediately — browsers cap the number of live contexts, and the
    // real one is about to ask for its own.
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

/** If the scene throws for any reason, the page keeps its background and the
 *  visitor never sees a broken rectangle where the artwork should be. */
class CanvasBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * The scene, in CSS.
 *
 * Shown while the three.js chunk is still in flight, and left in place forever
 * on a machine that cannot do WebGL at all. It is the same composition — a
 * bloom and three leaning rings, offset right on a wide screen — so the
 * fallback is a quieter version of the artwork rather than an apology for its
 * absence.
 */
function GradientRings({ visible }: { visible: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 transition-opacity duration-1000 ease-out ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 lg:left-[68%] lg:top-1/2">
        <div
          className="h-[min(78vmin,620px)] w-[min(78vmin,620px)] rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, rgba(225,96,164,0.22), rgba(169,139,245,0.14) 55%, rgba(250,248,255,0) 78%)",
          }}
        />
        {[0.42, 0.62, 0.82].map((ratio, i) => (
          <div
            key={ratio}
            className="absolute left-1/2 top-1/2 rounded-full"
            style={{
              width: `min(${78 * ratio}vmin, ${620 * ratio}px)`,
              height: `min(${78 * ratio}vmin, ${620 * ratio}px)`,
              border: `1.5px solid rgba(${i === 1 ? "225,96,164" : "118,72,179"},${0.3 - i * 0.07})`,
              transform: `translate(-50%,-50%) rotate(${i * 24 - 18}deg) scaleY(${0.86 + i * 0.06})`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function HeroCanvasMount({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const pointer = useRef<PointerState>(createPointerState());

  const reduced = useSyncExternalStore(subscribeMotion, getMotionSnapshot, getMotionServerSnapshot);
  const tabVisible = useSyncExternalStore(
    subscribeVisibility,
    getVisibilitySnapshot,
    getVisibilityServerSnapshot,
  );
  const hasWebGL = useSyncExternalStore(neverChanges, getWebGLSnapshot, getWebGLServerSnapshot);

  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  // If IntersectionObserver is missing, assume on screen rather than never
  // starting: a browser that old is not the one to withhold the artwork from.
  const [onScreen, setOnScreen] = useState(() => typeof IntersectionObserver === "undefined");

  const supported = hasWebGL && !failed;
  const fail = useCallback(() => setFailed(true), []);
  const markReady = useCallback(() => setReady(true), []);

  /* On screen. A hero is above the fold, so this is nearly always true on load —
     it earns its keep the moment the visitor scrolls past it, at which point
     the loop is told to stop rather than to slow down. */
  useEffect(() => {
    const host = hostRef.current;
    if (!host || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { rootMargin: "96px", threshold: 0 },
    );
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  /* The pointer, tracked on the window rather than on the canvas, so the scene
     still answers while the cursor is over the headline and the buttons — which
     is most of the hero. Nothing here calls setState: the values land in a ref
     that the render loop reads, so a 120Hz mouse costs React nothing. */
  useEffect(() => {
    if (reduced || !supported) return;
    const host = hostRef.current;
    if (!host) return;

    let rect = host.getBoundingClientRect();
    let stale = false;
    const remeasure = () => {
      stale = true;
    };

    const onMove = (event: PointerEvent) => {
      if (stale) {
        rect = host.getBoundingClientRect();
        stale = false;
      }
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const inside = x >= 0 && x <= 1 && y >= 0 && y <= 1;
      const state = pointer.current;
      state.x = x * 2 - 1;
      state.y = -(y * 2 - 1);
      state.presence = inside ? 1 : 0;
    };

    // A finger has no hover. When it lifts, the attraction lets go with it.
    const onRelease = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") pointer.current.presence = 0;
    };
    const onLeave = () => {
      pointer.current.presence = 0;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onRelease, { passive: true });
    window.addEventListener("pointercancel", onRelease, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", remeasure, { passive: true });
    window.addEventListener("resize", remeasure, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onRelease);
      window.removeEventListener("pointercancel", onRelease);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", remeasure);
      window.removeEventListener("resize", remeasure);
    };
  }, [reduced, supported]);

  /* One string, four inputs.
     - reduced motion → "demand", and nothing ever demands a second frame, so
       R3F draws once and cancels its own requestAnimationFrame.
     - off screen, or a backgrounded tab → "never", which skips the update
       entirely and lets the loop cancel itself on the same tick.
     - otherwise → "always". */
  const frameloop: Frameloop = reduced ? "demand" : onScreen && tabVisible ? "always" : "never";

  /* A low-power pass for phones and thin laptops: a third of the particles and
     half the ribbon segments. It is still the same scene, just less of it. */
  const [quality] = useState<"high" | "low">(() => {
    if (typeof window === "undefined") return "high";
    const narrow = window.matchMedia("(max-width: 760px)").matches;
    const thin = (navigator.hardwareConcurrency ?? 8) <= 4;
    return narrow || thin ? "low" : "high";
  });

  return (
    /* `pointer-events-none` matters: the canvas covers the whole hero, and R3F
       would otherwise raycast the scene on every pointer move for events this
       hero never uses — while the CTAs sitting above it stay clickable either
       way, because the artwork is decorative and must never be in the way. */
    <div ref={hostRef} aria-hidden="true" className={`pointer-events-none ${className ?? ""}`}>
      <GradientRings visible={!ready} />
      {supported ? (
        <CanvasBoundary onError={fail}>
          <div
            className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
              ready ? "opacity-100" : "opacity-0"
            }`}
          >
            <HeroCanvas
              pointer={pointer}
              frameloop={frameloop}
              quality={quality}
              onFailure={fail}
              onReady={markReady}
            />
          </div>
        </CanvasBoundary>
      ) : null}
    </div>
  );
}
