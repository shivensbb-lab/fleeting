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

/** Where the merge lands: the four windows and the wordmark sit here. */
export const MERGE: Vec = [9, -1.5, 0];

/** Act boundaries, from the timeline. */
export const ACTS = () => {
  const read = LF("read").start - 12;
  const quiet = LF("quiet").start - 12;
  const ship = LF("ship").start - 12;
  const where = LF("where").start - 12;
  return { a: 0, read, quiet, ship, where, end: DURATION_FRAMES };
};

type Key = { u: number; pos: Vec; target: Vec; roll: number };
type Act = { from: number; to: number; keys: Key[]; drift: number };

const acts = (): Act[] => {
  const A = ACTS();
  const O: Vec = [0, 0, 0];
  return [
    {
      from: A.a,
      to: A.read,
      drift: 1,
      keys: [
        { u: 0, pos: [0.6, 0.8, 34], target: O, roll: -1.2 },
        { u: 1, pos: [0, 0.2, 26], target: O, roll: 0 },
      ],
    },
    {
      from: A.read,
      to: A.quiet,
      drift: 1,
      keys: [
        { u: 0, pos: [0, 0.2, 26], target: O, roll: 0 },
        { u: 0.3, pos: [0, 2.6, 44], target: [0, 0.2, -4], roll: 0.6 },
        { u: 0.62, pos: [-3.4, 1.2, 33], target: [0, 0, 2], roll: -0.8 },
        { u: 1, pos: [0, 0.3, 27], target: O, roll: 0 },
      ],
    },
    {
      from: A.quiet,
      to: A.ship,
      drift: 0.35,
      keys: [
        { u: 0, pos: [0, 0.3, 27], target: O, roll: 0 },
        { u: 1, pos: [0, 0.1, 23.5], target: O, roll: 0 },
      ],
    },
    {
      from: A.ship,
      to: A.where,
      drift: 0.8,
      keys: [
        { u: 0, pos: [0, 0.1, 23.5], target: O, roll: 0 },
        { u: 0.45, pos: [3.4, -0.2, 27], target: [3.4, -0.6, 0], roll: 2 },
        { u: 1, pos: [5.2, -0.6, 30], target: [5.2, -0.9, 0], roll: 0 },
      ],
    },
    {
      from: A.where,
      to: A.end - 30,
      drift: 0.6,
      keys: [
        { u: 0, pos: [5.2, -0.6, 30], target: [5.2, -0.9, 0], roll: 0 },
        { u: 0.42, pos: [9, -1.2, 28], target: MERGE, roll: 0.5 },
        { u: 1, pos: [9, -1.4, 24.5], target: MERGE, roll: 0 },
      ],
    },
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
