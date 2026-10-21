import { mix, ramp } from "./ease";
import { LF } from "./time";

/** World light level: 1 normally, near dark for the quiet beat, back for the ship. */
export const lightLevel = (frame: number) => {
  const q = LF("quiet").start;
  const s = LF("ship").start;
  const down = ramp(frame, q - 24, q + 8);
  const up = ramp(frame, s - 8, s + 20);
  const finale = ramp(frame, LF("cta").start - 10, LF("cta").start + 40);
  return mix(1, 0.12, down * (1 - up)) * mix(1, 1.3, finale);
};
