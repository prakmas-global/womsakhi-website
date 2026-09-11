import type { RefObject } from "react";

/**
 * Where the pointer is, in the hero's own coordinates.
 *
 * `x` and `y` are -1..1 across the hero box, y up. `presence` is 0 when the
 * pointer has never been in the hero (or has left it) and eases to 1 while it is
 * inside, so the scene can fade its reaction in rather than snapping to it —
 * and so a touch device, which never reports a hover, simply gets the calm
 * ambient version of the scene instead of a stuck attractor.
 *
 * It is a ref rather than state on purpose: pointermove fires up to 120 times a
 * second and not one of those events should cost React a render.
 */
export type PointerState = {
  x: number;
  y: number;
  presence: number;
};

export type PointerRef = RefObject<PointerState>;

export function createPointerState(): PointerState {
  return { x: 0, y: 0, presence: 0 };
}
