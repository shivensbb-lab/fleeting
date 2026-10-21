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
export const SAFE = { x0: 60, x1: 1020, y0: 220, y1: 1480 };

export const COLOR = {
  bg: "#120E0C",
  umber: "#2A1F1A",
  cream: "#F4EDE4",
  muted: "#9C8F84",
  accent: "#D97757",
  red: "#C8574B",
  green: "#8DBF7F",
} as const;
