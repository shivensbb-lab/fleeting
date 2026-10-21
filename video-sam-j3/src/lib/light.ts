import { mix, ramp } from "./ease";
import { LF } from "./time";

/** World light level: full daylight, a dusk dip for the quiet beat, then back up. */
export const lightLevel = (frame: number) => {
  const q = LF("quiet");
  const a = LF("ab");
  const down = ramp(frame, q.start - 24, q.start + 10);
  const up = ramp(frame, a.start - 10, a.start + 20);
  return mix(1, 0.42, down * (1 - up));
};

/** 0 in daylight, 1 at the bottom of the quiet dip. */
export const dusk = (frame: number) => (1 - lightLevel(frame)) / 0.58;
