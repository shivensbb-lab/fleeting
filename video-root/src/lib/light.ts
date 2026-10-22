import { mix, ramp } from "./ease";
import { LF } from "./time";

/** World light: full, a dip for the quiet "crew" beat, a flare for "grow". */
export const lightLevel = (frame: number) => {
  const c = LF("crew");
  const g = LF("grow");
  const down = ramp(frame, c.start - 20, c.start + 10);
  const up = ramp(frame, g.start - 10, g.start + 20);
  return mix(1, 0.35, down * (1 - up)) * mix(1, 1.25, ramp(frame, g.start, g.accent));
};
