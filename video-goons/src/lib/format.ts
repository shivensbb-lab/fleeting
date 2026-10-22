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
  night: "#070816",
  deep: "#11163A",
  mint: "#EAF6FF",
  muted: "#8C93B8",
  accent: "#3DE0FF",
  violet: "#8B5CFF",
  glow: "rgba(61,224,255,0.55)",
} as const;
