import { useCurrentFrame } from "remotion";
import timeline from "../data/timeline.json";

export type Line = {
  id: string;
  text: string;
  kicker: string;
  hero: string;
  start: number;
  end: number;
  accent: number;
};

export const FPS: number = timeline.fps;
export const DURATION_FRAMES = Math.round(timeline.duration * FPS);
export const LINES: Line[] = timeline.lines;

export const L = (id: string): Line => {
  const line = LINES.find((l) => l.id === id);
  if (!line) throw new Error(`No line "${id}" in timeline.json`);
  return line;
};

/** n frames, in seconds */
export const F = (n: number) => n / FPS;
export const toFrame = (s: number) => Math.round(s * FPS);

/** A line's start, end and accent as whole frames. */
export const LF = (id: string) => {
  const l = L(id);
  return { start: toFrame(l.start), end: toFrame(l.end), accent: toFrame(l.accent) };
};

export const useTime = () => {
  const frame = useCurrentFrame();
  return { frame, t: frame / FPS };
};
