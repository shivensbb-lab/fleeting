import { Easing, interpolate } from "remotion";

export const arrive = Easing.bezier(0.16, 1, 0.3, 1);
export const move = Easing.bezier(0.65, 0, 0.35, 1);
export const leave = Easing.bezier(0.7, 0, 0.84, 0);

/** 0 to 1 between frames a and b, clamped. */
export const ramp = (frame: number, a: number, b: number, ease: (t: number) => number = arrive) =>
  interpolate(frame, [a, b], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
