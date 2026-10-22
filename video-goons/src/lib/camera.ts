import { move } from "./ease";
import { CX, CY, FOCAL, PX } from "./format";
import { noise1 } from "./noise";
import { DURATION_FRAMES, LF } from "./time";

export type Vec = [number, number, number];
export type Pose = { pos: Vec; target: Vec; roll: number };

const add = (a: Vec, b: Vec): Vec => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a: Vec, b: Vec): Vec => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mul = (a: Vec, s: number): Vec => [a[0] * s, a[1] * s, a[2] * s];
const dot = (a: Vec, b: Vec) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: Vec, b: Vec): Vec => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const norm = (a: Vec): Vec => mul(a, 1 / Math.hypot(a[0], a[1], a[2]));


type Key = { u: number; pos: Vec; target: Vec; roll: number };
type Act = { from: number; to: number; keys: Key[]; drift: number };

/** The island sits here; the camera sweeps around it. */
export const ISLAND: Vec = [0, -0.4, 0];

const acts = (): Act[] => {
  const O: Vec = [0, 0.4, 0];
  const mc = LF("mc").start - 12;
  const crew = LF("crew").start - 12;
  const games = LF("games").start - 12;
  return [
    { from: 0, to: mc, drift: 1, keys: [
      { u: 0, pos: [0.5, 0.8, 30], target: O, roll: -1 },
      { u: 1, pos: [0, 0.6, 25], target: O, roll: 0 },
    ] },
    { from: mc, to: crew, drift: 0.6, keys: [
      { u: 0, pos: [0, 0.6, 25], target: O, roll: 0 },
      { u: 0.4, pos: [0, 6.5, 24], target: [0, 1.4, 0], roll: 0 },
      { u: 0.75, pos: [16, 8, 18], target: [0, 1.6, 0], roll: 1.5 },
      { u: 1, pos: [21, 6.5, -8], target: [0, 1.6, 0], roll: 0 },
    ] },
    { from: crew, to: games, drift: 0.3, keys: [
      { u: 0, pos: [21, 6.5, -8], target: [0, 1.6, 0], roll: 0 },
      { u: 0.5, pos: [6, 1.5, 18], target: [1, 0.2, 0], roll: 0 },
      { u: 1, pos: [0, 0.4, 23], target: O, roll: 0 },
    ] },
    { from: games, to: DURATION_FRAMES - 30, drift: 0.6, keys: [
      { u: 0, pos: [0, 0.4, 23], target: O, roll: 0 },
      { u: 1, pos: [0, 0.6, 29], target: [0, 0.6, 0], roll: 0 },
    ] },
  ];
};

const catmull = (p0: number, p1: number, p2: number, p3: number, t: number) => {
  const t2 = t * t;
  const t3 = t2 * t;
  return 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
};

const sampleKeys = (keys: Key[], u: number) => {
  let i = 0;
  while (i < keys.length - 2 && u > keys[i + 1].u) i++;
  const k1 = keys[i];
  const k2 = keys[i + 1];
  const k0 = keys[Math.max(0, i - 1)];
  const k3 = keys[Math.min(keys.length - 1, i + 2)];
  const t = Math.min(1, Math.max(0, (u - k1.u) / (k2.u - k1.u)));
  const v = (get: (k: Key) => number) => catmull(get(k0), get(k1), get(k2), get(k3), t);
  const pos: Vec = [v((k) => k.pos[0]), v((k) => k.pos[1]), v((k) => k.pos[2])];
  const target: Vec = [v((k) => k.target[0]), v((k) => k.target[1]), v((k) => k.target[2])];
  return { pos, target, roll: v((k) => k.roll) };
};

/** The one camera: WebGL and the DOM placed in the world both read this. */
export const cameraPose = (frame: number): Pose => {
  const list = acts();
  const act = list.find((a) => frame < a.to) ?? list[list.length - 1];
  const u = move(Math.min(1, Math.max(0, (frame - act.from) / (act.to - act.from))));
  const s = sampleKeys(act.keys, u);
  // constant gentle drift, so the camera is never dead still
  const d = act.drift;
  const drift: Vec = [noise1(frame / 95, 1) * 0.22 * d, noise1(frame / 120, 2) * 0.16 * d, 0];
  return {
    pos: add(s.pos, drift),
    target: s.target,
    roll: ((s.roll + noise1(frame / 140, 3) * 0.35 * d) * Math.PI) / 180,
  };
};

export const basis = (pose: Pose) => {
  const f = norm(sub(pose.target, pose.pos));
  const r0 = norm(cross(f, [0, 1, 0]));
  const u0 = cross(r0, f);
  const r = add(mul(r0, Math.cos(pose.roll)), mul(u0, Math.sin(pose.roll)));
  const u = cross(r, f);
  return { f, r, u };
};

export type Projected = { x: number; y: number; scale: number; depth: number; visible: boolean };

/** World point to screen px. scale is the DOM scale for content authored at PX px per unit. */
export const project = (p: Vec, pose: Pose): Projected => {
  const { f, r, u } = basis(pose);
  const d = sub(p, pose.pos);
  const zc = dot(d, f);
  if (zc < 0.5) return { x: 0, y: 0, scale: 0, depth: zc, visible: false };
  const s = FOCAL / zc;
  return { x: CX + s * dot(d, r), y: CY - s * dot(d, u), scale: s / PX, depth: zc, visible: true };
};
