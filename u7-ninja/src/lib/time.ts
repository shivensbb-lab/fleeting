import data from "../data/shots.json";

export type Shot = { id: string; text: string; frames: number; from: number };
export const FPS: number = data.fps;
/** Each shot lasts as long as its voice line (plus a beat), so cuts land on the narration. */
export const SHOTS: Shot[] = (() => { let at = 0; return data.shots.map((s: { id: string; text: string; frames: number }) => { const o = { ...s, from: at }; at += s.frames; return o; }); })();
export const DURATION_FRAMES = SHOTS.reduce((a, s) => a + s.frames, 0);
