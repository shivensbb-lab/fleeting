import data from "../data/shots.json";

export type Shot = { id: string; text: string };
export const FPS: number = data.fps;
export const SHOT = data.shotSeconds * data.fps;
export const SHOTS: Shot[] = data.shots;
export const DURATION_FRAMES = SHOTS.length * SHOT;
