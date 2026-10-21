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
  paper: "#FBF6EF",
  cream: "#F1E6D8",
  ink: "#1E1B2E",
  muted: "#6E6878",
  accent: "#A7144C",
  white: "#FFFFFF",
} as const;
