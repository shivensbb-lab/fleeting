export const W = 1080;
export const H = 1920;
/** The world's principal point: the hero band is centred here. */
export const CX = 540;
export const CY = 600;
/** Vertical field of view over the 1920 frame, fixed. */
export const FOV = 50;
export const FOCAL = H / 2 / Math.tan(((FOV / 2) * Math.PI) / 180);
/** Authored px per world unit. */
export const PX = 100;

export const COLOR = {
  night: "#06110F",
  deep: "#0B1F1C",
  mint: "#E8FFF4",
  muted: "#7FA597",
  accent: "#4CF2A4",
  glow: "rgba(76,242,164,0.55)",
} as const;
