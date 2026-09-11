"use client";

import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { SIMPLEX_3D } from "./glsl";

/**
 * The veil: the women, as a slow galaxy.
 *
 * Every particle is a point on a ring, and every one of them moves entirely on
 * the GPU. The CPU builds three float arrays once at mount and then never
 * touches them again — no per-frame JS loop over ten thousand positions, no
 * `needsUpdate = true`, no buffer re-upload. The only thing that crosses the bus
 * each frame is a handful of uniforms.
 *
 * The rotation is *differential*: the inner ring turns faster than the outer
 * one, the way a galaxy does. A rigid rotation reads as a spinning wheel — a
 * mechanism. Shearing rotation reads as something alive.
 */

type VeilUniforms = {
  uTime: THREE.IUniform<number>;
  uDpr: THREE.IUniform<number>;
  uSize: THREE.IUniform<number>;
  uPointer: THREE.IUniform<THREE.Vector2>;
  uPresence: THREE.IUniform<number>;
  uOpacity: THREE.IUniform<number>;
  uColorInner: THREE.IUniform<THREE.Color>;
  uColorMid: THREE.IUniform<THREE.Color>;
  uColorOuter: THREE.IUniform<THREE.Color>;
};

const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uDpr;
uniform float uSize;
uniform vec2  uPointer;
uniform float uPresence;

attribute float aSeed;
attribute float aScale;

varying float vTint;
varying float vAlpha;

${SIMPLEX_3D}

void main() {
  float radius = length(position.xy);
  float angle  = atan(position.y, position.x);

  // Differential rotation. 1/(0.6 + r) falls off with distance, so the hub
  // turns roughly three times for every turn of the rim.
  angle += uTime * 0.20 / (0.55 + radius * 0.42);

  vec3 p = vec3(cos(angle) * radius, sin(angle) * radius, position.z);

  // Two decorrelated noise samples: one drifts the particle in the plane, the
  // other lifts it out of the plane and drives its brightness, so the bright
  // ones are also the near ones and the field gains depth for free.
  float n1 = snoise(vec3(p.xy * 0.42, uTime * 0.055 + aSeed * 7.3));
  float n2 = snoise(vec3(p.yx * 0.37 + 21.7, uTime * 0.047 + aSeed * 4.1));

  p.xy += vec2(n1, n2) * 0.30;
  p.z  += n2 * 0.42;

  // A breath, a little under three seconds. Different phase per particle so the
  // ring never pulses as one object.
  p.xy *= 1.0 + 0.022 * sin(uTime * 0.42 + aSeed * 6.2831853);

  // The pointer. A gaussian well rather than an inverse-square one: it has no
  // singularity at the centre, so nothing can be flung across the screen, and
  // it dies to nothing about two units out instead of dragging the whole field.
  vec2 toPointer = uPointer - p.xy;
  float dist = length(toPointer);
  float well = uPresence * exp(-dist * dist * 0.55);
  vec2 dir = toPointer / max(dist, 0.0001);
  p.xy += dir * well * (0.30 + aSeed * 0.55);
  // and a touch of swirl, so the swarm arrives with a curve rather than head-on
  p.xy += vec2(-dir.y, dir.x) * well * 0.42;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;

  gl_PointSize = min(uSize * aScale * uDpr / max(-mv.z, 0.001), 96.0);

  vTint = clamp((radius - 0.6) / 2.5, 0.0, 1.0);

  float twinkle = smoothstep(-0.75, 0.85, n1);
  // Fade the outermost particles out rather than letting the ring end on a line.
  float rim = 1.0 - smoothstep(2.35, 3.3, radius);
  vAlpha = (0.20 + 0.80 * twinkle) * rim * (0.55 + 0.45 * well);
}
`;

const fragmentShader = /* glsl */ `
uniform float uOpacity;
uniform vec3  uColorInner;
uniform vec3  uColorMid;
uniform vec3  uColorOuter;

varying float vTint;
varying float vAlpha;

void main() {
  // A soft disc, squared to pull the energy into the core. Cheaper and cleaner
  // than a sprite texture, and it stays sharp at any device pixel ratio.
  float d = length(gl_PointCoord - 0.5);
  float shape = smoothstep(0.5, 0.04, d);
  shape *= shape;
  if (shape < 0.004) discard;

  vec3 col = mix(uColorInner, uColorMid, smoothstep(0.0, 0.55, vTint));
  col = mix(col, uColorOuter, smoothstep(0.5, 1.0, vTint));

  gl_FragColor = vec4(col, shape * vAlpha * uOpacity);
  #include <colorspace_fragment>
}
`;

/** Deterministic PRNG, so the still frame a reduced-motion visitor sees is the
 *  same picture every time she loads the page rather than a new random one. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function ParticleVeil({
  count,
  pointer,
  presence,
  size,
}: {
  count: number;
  /** Damped pointer position in this group's local space. Mutated in place. */
  pointer: THREE.Vector2;
  /** Damped 0..1 — is the pointer anywhere near this hero at all. */
  presence: { value: number };
  /** Base point size in pixels at one device pixel ratio. */
  size: number;
}) {
  const geometry = useMemo(() => {
    const rand = mulberry32(0x5a4b1e);
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    const scales = new Float32Array(count);

    // Three uniforms summed is a serviceable bell curve and costs nothing.
    const bell = () => rand() + rand() + rand() - 1.5;

    for (let i = 0; i < count; i++) {
      const angle = rand() * Math.PI * 2;
      const radius = THREE.MathUtils.clamp(1.95 + bell() * 0.78, 0.32, 3.25);
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius;
      positions[i * 3 + 2] = bell() * 0.5;
      seeds[i] = rand();
      // Squared, so most particles are dust and only a few are lamps.
      scales[i] = 0.4 + rand() * rand() * 1.9;
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    g.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    // The vertex shader moves points well outside their authored positions, so
    // an auto-computed sphere would cull the field the moment it drifts.
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 6);
    return g;
  }, [count]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  const uniforms = useMemo<VeilUniforms>(
    () => ({
      uTime: { value: 0 },
      uDpr: { value: 1 },
      uSize: { value: size },
      uPointer: { value: pointer },
      uPresence: { value: 0 },
      uOpacity: { value: 0.9 },
      uColorInner: { value: new THREE.Color("#5b32a6") },
      uColorMid: { value: new THREE.Color("#e160a4") },
      uColorOuter: { value: new THREE.Color("#a98bf5") },
    }),
    [pointer, size],
  );

  /*
    React Compiler's immutability rule cannot tell a uniform buffer from React
    state, and it is right to be wary of both. This is neither: the object goes
    straight to a THREE.ShaderMaterial, no render ever reads it, and writing to
    it sixty times a second is not a side effect of drawing a frame — it is how
    a frame gets drawn.
  */
  /* eslint-disable react-hooks/immutability */
  useFrame((state, delta) => {
    // Clamped: a backgrounded tab hands back a delta of several seconds on
    // return, which would teleport the whole field.
    uniforms.uTime.value += Math.min(delta, 0.05);
    uniforms.uDpr.value = state.viewport.dpr;
    uniforms.uPresence.value = presence.value;
  });
  /* eslint-enable react-hooks/immutability */

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        depthTest={false}
        blending={THREE.NormalBlending}
      />
    </points>
  );
}
