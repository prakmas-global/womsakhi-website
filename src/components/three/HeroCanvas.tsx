"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree, type Frameloop } from "@react-three/fiber";
import { ParticleVeil } from "./ParticleVeil";
import { ThreadRing } from "./ThreadRing";
import type { PointerRef } from "./pointer";

/**
 * The hero scene: a circle of women, drawn as light.
 *
 * Three woven threads turning at different speeds and in different directions
 * around a drifting field of particles. Nothing here is literal — no faces, no
 * joined hands — because a stock illustration of solidarity is exactly the
 * thing this brand's voice refuses. What it is instead: many separate small
 * things, moving on their own, that together are unmistakably one ring.
 *
 * Everything about the loop is deliberate and measurable:
 *   - `dpr={[1, 2]}`  — a 3x phone renders 9 pixels where 4 will do, and the
 *     battery pays for all nine.
 *   - `frameloop` is a prop, not a constant. Its parent hands down "never" when
 *     the hero leaves the viewport or the tab is hidden, and R3F's rAF loop
 *     then cancels itself outright rather than idling.
 *   - `flat` turns off ACES tone mapping. These are brand colours, chosen in
 *     hex; a film curve would quietly desaturate every one of them.
 *   - `antialias: false` — the ribbons fade out at their own edges and the
 *     particles are round sprites. There is no hard geometry edge here for MSAA
 *     to fix, so it would be pure cost.
 */

const CAMERA_Z = 7.4;

export type HeroQuality = "high" | "low";

export type HeroCanvasProps = {
  pointer: PointerRef;
  frameloop: Frameloop;
  quality: HeroQuality;
  onFailure: () => void;
  /** Fired once the GL context exists, so the page can cross-fade the CSS
   *  stand-in out rather than popping the artwork in. */
  onReady: () => void;
};

type RingSpec = {
  radius: number;
  width: number;
  phase: number;
  spin: number;
  warp: number;
  threads: number;
  opacity: number;
  colorA: string;
  colorB: string;
  tilt: [number, number, number];
};

/** Three threads, deliberately mismatched. Equal spacing and equal speed would
 *  read as a diagram of a circle rather than as a circle of people. */
const RINGS: readonly RingSpec[] = [
  {
    radius: 1.42,
    width: 0.3,
    phase: 0,
    spin: 0.055,
    warp: 0.3,
    threads: 26,
    opacity: 0.6,
    colorA: "#7648b3",
    colorB: "#e160a4",
    tilt: [0.42, -0.3, 0.15],
  },
  {
    radius: 2.06,
    width: 0.44,
    phase: 2.1,
    spin: -0.041,
    warp: 0.36,
    threads: 34,
    opacity: 0.46,
    colorA: "#5b32a6",
    colorB: "#a98bf5",
    tilt: [-0.34, 0.26, -0.22],
  },
  {
    radius: 2.64,
    width: 0.24,
    phase: 4.3,
    spin: 0.03,
    warp: 0.44,
    threads: 20,
    opacity: 0.36,
    colorA: "#e160a4",
    colorB: "#f5b544",
    tilt: [0.18, 0.44, 0.35],
  },
];

/**
 * One frame, then silence.
 *
 * For a reduced-motion visitor the canvas runs on `frameloop="demand"` and
 * nothing ever calls `invalidate` again, so R3F draws the scene and then
 * cancels its own requestAnimationFrame. This asks for that one frame
 * explicitly rather than trusting the mount commit to have produced it.
 */
function StillFrame() {
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    invalidate();
  }, [invalidate]);
  return null;
}

/** A lost GPU context is a real thing on a laptop that has just woken up. When
 *  it happens, hand the page back to the CSS gradient instead of a black hole. */
function ContextGuard({ onFailure }: { onFailure: () => void }) {
  const gl = useThree((state) => state.gl);
  useEffect(() => {
    const el = gl.domElement;
    const onLost = (event: Event) => {
      event.preventDefault();
      onFailure();
    };
    el.addEventListener("webglcontextlost", onLost);
    return () => el.removeEventListener("webglcontextlost", onLost);
  }, [gl, onFailure]);
  return null;
}

function Scene({ pointer, quality }: { pointer: PointerRef; quality: HeroQuality }) {
  const viewport = useThree((state) => state.viewport);
  const groupRef = useRef<THREE.Group>(null);

  // Shared, mutated in place, never reallocated. Both shaders hold this exact
  // Vector2 as their uniform value, so one damped number reaches both.
  const damped = useMemo(() => new THREE.Vector2(), []);
  const presence = useMemo(() => ({ value: 0 }), []);

  /**
   * Where the ring sits, given the shape of the window.
   *
   * On anything landscape the ring moves right, out from under the headline, so
   * the text never has to fight it for contrast. On a phone it centres and
   * rises, and shrinks to fit the narrow axis — the scene simplifies, but it
   * never becomes the grey rectangle that a `hidden md:block` would leave.
   */
  const layout = useMemo(() => {
    const wide = viewport.aspect >= 1.15;
    // On a phone the ring is scaled to the narrow axis and lifted, so it sits
    // behind the headline as a halo rather than under the body copy where the
    // legibility wash would erase it.
    const fit = viewport.width / (wide ? 8.9 : 5.2);
    return {
      scale: THREE.MathUtils.clamp(fit, 0.4, 1.15),
      x: wide ? Math.min(viewport.width * 0.18, 2.95) : 0,
      y: wide ? 0 : viewport.height * 0.15,
    };
  }, [viewport.aspect, viewport.width, viewport.height]);

  /*
    React Compiler's immutability rule cannot tell a uniform buffer from React
    state, and it is right to be wary of both. This is neither: the object goes
    straight to a THREE.ShaderMaterial, no render ever reads it, and writing to
    it sixty times a second is not a side effect of drawing a frame — it is how
    a frame gets drawn.
  */
  /* eslint-disable react-hooks/immutability */
  useFrame((state, delta) => {
    // A tab that has been in the background hands back a delta of whole
    // seconds. Clamped, or every damped value snaps to its target at once.
    const dt = Math.min(delta, 0.05);
    const p = pointer.current;

    // -1..1 across the hero, into the ring group's own space.
    const worldX = p.x * state.viewport.width * 0.5;
    const worldY = p.y * state.viewport.height * 0.5;

    damped.x = THREE.MathUtils.damp(damped.x, (worldX - layout.x) / layout.scale, 3.1, dt);
    damped.y = THREE.MathUtils.damp(damped.y, (worldY - layout.y) / layout.scale, 3.1, dt);
    presence.value = THREE.MathUtils.damp(presence.value, p.presence, 2.4, dt);

    const group = groupRef.current;
    if (group) {
      // Parallax, kept under ten degrees. Any more and the ring stops being a
      // ring and starts being a thing that follows your cursor.
      group.rotation.x = THREE.MathUtils.damp(group.rotation.x, -p.y * 0.13 * p.presence, 2.1, dt);
      group.rotation.y = THREE.MathUtils.damp(group.rotation.y, p.x * 0.17 * p.presence, 2.1, dt);
      group.rotation.z = THREE.MathUtils.damp(group.rotation.z, p.x * 0.05 * p.presence, 1.6, dt);
    }
  });
  /* eslint-enable react-hooks/immutability */

  const dense = quality === "high";

  return (
    <group ref={groupRef} position={[layout.x, layout.y, 0]} scale={layout.scale}>
      {RINGS.map((ring) => (
        <ThreadRing
          key={ring.phase}
          {...ring}
          segments={dense ? 240 : 132}
          pointer={damped}
          presence={presence}
        />
      ))}
      <ParticleVeil
        count={dense ? 12000 : 4600}
        size={dense ? 92 : 78}
        pointer={damped}
        presence={presence}
      />
    </group>
  );
}

export default function HeroCanvas({
  pointer,
  frameloop,
  quality,
  onFailure,
  onReady,
}: HeroCanvasProps) {
  return (
    <Canvas
      frameloop={frameloop}
      dpr={[1, 2]}
      flat
      gl={{
        antialias: false,
        alpha: true,
        stencil: false,
        depth: false,
        powerPreference: "high-performance",
        failIfMajorPerformanceCaveat: false,
      }}
      camera={{ position: [0, 0, CAMERA_Z], fov: 42, near: 0.1, far: 30 }}
      // Lenis fires scroll constantly; re-measuring the canvas box on every one
      // of those events is work for an answer that has not changed.
      resize={{ scroll: false, debounce: { scroll: 200, resize: 120 } }}
      style={{ width: "100%", height: "100%", display: "block" }}
      onCreated={({ gl }) => {
        gl.setClearAlpha(0);
        onReady();
      }}
    >
      <ContextGuard onFailure={onFailure} />
      {frameloop === "demand" ? <StillFrame /> : null}
      <Scene pointer={pointer} quality={quality} />
    </Canvas>
  );
}
