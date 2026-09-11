"use client";

import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RING_NOISE, SIMPLEX_3D } from "./glsl";

/**
 * A thread of women, drawn as one continuous ribbon.
 *
 * The geometry is a flat `PlaneGeometry` and nothing else — a grid of quads
 * sitting in the XY plane, uploaded once. The vertex shader is what makes it a
 * ring: `uv.x` becomes the angle around the circle and `uv.y` becomes the
 * position across the band, so a 240 x 8 plane becomes a closed, warping,
 * hand-woven-looking loop for the cost of one draw call and 2,169 vertices.
 *
 * Doing it this way rather than with `TubeGeometry` means the shape can change
 * every frame — breathe, tilt toward the pointer, ripple — without ever
 * rebuilding a buffer on the CPU.
 *
 * The fragment shader draws the weave: a sine across the band, sheared by the
 * angle, so the ribbon reads as many fine threads lying side by side rather
 * than as a flat plastic strip. That is the whole reason this is custom GLSL
 * and not a `MeshStandardMaterial`.
 */

type RingUniforms = {
  uTime: THREE.IUniform<number>;
  uRadius: THREE.IUniform<number>;
  uWidth: THREE.IUniform<number>;
  uPhase: THREE.IUniform<number>;
  uSpin: THREE.IUniform<number>;
  uWarp: THREE.IUniform<number>;
  uThreads: THREE.IUniform<number>;
  uOpacity: THREE.IUniform<number>;
  uPointer: THREE.IUniform<THREE.Vector2>;
  uPresence: THREE.IUniform<number>;
  uColorA: THREE.IUniform<THREE.Color>;
  uColorB: THREE.IUniform<THREE.Color>;
};

const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uRadius;
uniform float uWidth;
uniform float uPhase;
uniform float uSpin;
uniform float uWarp;
uniform vec2  uPointer;
uniform float uPresence;

varying float vAcross;
varying float vAngle;
varying float vDepth;

${SIMPLEX_3D}
${RING_NOISE}

void main() {
  float across = uv.y - 0.5;                 // -0.5 .. 0.5 across the band
  float angle  = uv.x * 6.2831853 + uPhase + uTime * uSpin;

  // Sampled on a circle in noise space, so the loop closes exactly at the seam.
  float wob = ringNoise(angle, 0.85, uTime * 0.10, uPhase * 3.1);
  float wob2 = ringNoise(angle * 2.0, 0.55, uTime * -0.07, uPhase * 1.7 + 9.0);

  float radius = uRadius + wob * uWarp + across * uWidth * (1.0 + 0.35 * wob2);

  vec3 p;
  p.x = cos(angle) * radius;
  p.y = sin(angle) * radius;
  // Out-of-plane travel: a low harmonic, so the ribbon reads as a loop leaning
  // through the particle field rather than as an ellipse painted on glass.
  p.z = sin(angle * 2.0 + uTime * 0.25 + uPhase) * 0.55
      + wob2 * 0.42
      + across * 0.7 * cos(angle * 3.0 + uPhase);

  // The pointer lifts the near side of the ribbon toward it, falling off with
  // distance. Enough to feel answered, not enough to notice as an effect.
  float pull = uPresence * exp(-distance(p.xy, uPointer) * 0.85);
  p.z += pull * 0.55;
  p.xy += normalize(uPointer - p.xy + 0.0001) * pull * 0.16;

  vAcross = across;
  vAngle = angle;
  vDepth = p.z;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`;

const fragmentShader = /* glsl */ `
uniform float uTime;
uniform float uThreads;
uniform float uOpacity;
uniform vec3  uColorA;
uniform vec3  uColorB;

varying float vAcross;
varying float vAngle;
varying float vDepth;

void main() {
  // Soft selvedge: the band has no cut edge, it just stops being there.
  float edge = 1.0 - abs(vAcross * 2.0);
  float body = smoothstep(0.0, 0.42, edge);

  // The weave. Shearing by the angle stops it reading as a barcode.
  float weave = 0.5 + 0.5 * sin(vAcross * uThreads + vAngle * 2.0 - uTime * 0.55);
  weave = pow(weave, 1.6);

  // Depth haze: the far side of the loop is fainter than the near side, which
  // is what tells the eye this is a ring and not an ellipse drawn on a wall.
  float haze = smoothstep(-1.6, 1.4, vDepth);

  float alpha = body * (0.28 + 0.72 * weave) * (0.42 + 0.58 * haze) * uOpacity;
  if (alpha < 0.003) discard;

  vec3 col = mix(uColorA, uColorB, 0.5 + 0.5 * sin(vAngle * 0.5 + uTime * 0.12));

  gl_FragColor = vec4(col, alpha);
  #include <colorspace_fragment>
}
`;

export type ThreadRingProps = {
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
  segments?: number;
  pointer: THREE.Vector2;
  presence: { value: number };
};

export function ThreadRing({
  radius,
  width,
  phase,
  spin,
  warp,
  threads,
  opacity,
  colorA,
  colorB,
  tilt,
  segments = 240,
  pointer,
  presence,
}: ThreadRingProps) {
  const geometry = useMemo(
    () => new THREE.PlaneGeometry(1, 1, segments, 8),
    [segments],
  );

  useEffect(() => () => geometry.dispose(), [geometry]);

  const uniforms = useMemo<RingUniforms>(
    () => ({
      uTime: { value: 0 },
      uRadius: { value: radius },
      uWidth: { value: width },
      uPhase: { value: phase },
      uSpin: { value: spin },
      uWarp: { value: warp },
      uThreads: { value: threads },
      uOpacity: { value: opacity },
      uPointer: { value: pointer },
      uPresence: { value: 0 },
      uColorA: { value: new THREE.Color(colorA) },
      uColorB: { value: new THREE.Color(colorB) },
    }),
    [radius, width, phase, spin, warp, threads, opacity, colorA, colorB, pointer],
  );

  /*
    React Compiler's immutability rule cannot tell a uniform buffer from React
    state, and it is right to be wary of both. This is neither: the object goes
    straight to a THREE.ShaderMaterial, no render ever reads it, and writing to
    it sixty times a second is not a side effect of drawing a frame — it is how
    a frame gets drawn.
  */
  /* eslint-disable react-hooks/immutability */
  useFrame((_state, delta) => {
    uniforms.uTime.value += Math.min(delta, 0.05);
    uniforms.uPresence.value = presence.value;
  });
  /* eslint-enable react-hooks/immutability */

  return (
    <mesh geometry={geometry} rotation={tilt} frustumCulled={false}>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
        depthTest={false}
        blending={THREE.NormalBlending}
      />
    </mesh>
  );
}
