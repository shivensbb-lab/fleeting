import { mix, ramp } from "./ease";
import { LF } from "./time";

/** World light: full, a dip for the quiet crew beat, a flare for the finale. */
export const lightLevel = (frame: number) => {
  const c = LF("crew");
  const r = LF("ready");
  const cta = LF("cta");
  const down = ramp(frame, c.start - 20, c.start + 10);
  const up = ramp(frame, r.start - 10, r.accent);
  return mix(1, 0.35, down * (1 - up)) * mix(1, 1.25, ramp(frame, cta.start, cta.accent));
};
