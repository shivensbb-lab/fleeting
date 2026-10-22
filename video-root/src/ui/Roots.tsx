import React from "react";
import { Pose } from "../lib/camera";
import { clamp01, mix, move, ramp } from "../lib/ease";
import { COLOR } from "../lib/format";
import { lightLevel } from "../lib/light";
import { rnd } from "../lib/noise";
import { LF } from "../lib/time";
import { Place } from "./Place";

const RW = 1400;
const RH = 1150;
const SEED = { x: 700, y: 70 };

type Seg = { d: string; t0: number; dur: number; width: number; depth: number };
type Tip = { x: number; y: number; t: number };

/** Grows the network once, deterministically. Times are normalised to 0..1 afterwards. */
const build = () => {
  const segs: Seg[] = [];
  const tips: Tip[] = [];
  let n = 0;
  const grow = (x: number, y: number, ang: number, len: number, depth: number, t0: number, width: number) => {
    const id = n++;
    const ex = x + Math.sin(ang) * len;
    const ey = y + Math.cos(ang) * len;
    const bend = rnd(id * 7 + 1, -0.28, 0.28) * len;
    const cx = (x + ex) / 2 + Math.cos(ang) * bend;
    const cy = (y + ey) / 2 - Math.sin(ang) * bend;
    const dur = len / 900;
    segs.push({ d: `M${x.toFixed(1)} ${y.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`, t0, dur, width, depth });
    if (depth >= 6 || ey > RH - 40 || ex < 30 || ex > RW - 30) {
      tips.push({ x: ex, y: ey, t: t0 + dur });
      return;
    }
    const kids = depth < 2 ? 3 : 2;
    for (let k = 0; k < kids; k++) {
      const spread = kids === 3 ? (k - 1) * 0.62 : (k === 0 ? -0.45 : 0.45);
      let a = ang + spread + rnd(id * 7 + 3 + k, -0.22, 0.22);
      a = Math.max(-1.45, Math.min(1.45, a));
      grow(ex, ey, a, len * rnd(id * 7 + 5 + k, 0.64, 0.82), depth + 1, t0 + dur, width * 0.68);
    }
  };
  grow(SEED.x, SEED.y, 0, 210, 0, 0, 16);
  grow(SEED.x, SEED.y, 1.05, 190, 1, 0.02, 12);
  grow(SEED.x, SEED.y, -1.05, 190, 1, 0.02, 12);
  const end = Math.max(...tips.map((t) => t.t));
  segs.forEach((s) => { s.t0 /= end; s.dur /= end; });
  tips.forEach((t) => { t.t /= end; });
  return { segs, tips };
};
const NET = build();
/** Five people, picked from the tips, for the crew beat. */
const CREW = [...NET.tips].sort((a, b) => Math.abs(a.x - 700) + Math.abs(a.y - 560) - (Math.abs(b.x - 700) + Math.abs(b.y - 560))).slice(0, 5);

/** How far the network has grown, 0..1, at a frame. */
export const growth = (frame: number) => {
  const meet = LF("meet");
  const rules = LF("rules");
  const grow = LF("grow");
  const a = ramp(frame, meet.start - 6, meet.accent, move) * 0.32;
  const b = ramp(frame, meet.accent, rules.end, move) * 0.36;
  const c = ramp(frame, grow.start - 6, grow.accent, move) * 0.32;
  return a + b + c;
};

export const Roots: React.FC<{ frame: number; pose: Pose }> = ({ frame, pose }) => {
  const meet = LF("meet");
  const crew = LF("crew");
  const grow = LF("grow");
  const credits = LF("credits");
  if (frame < meet.start - 30) return null;

  // the seed: a point of light that falls into place
  const fall = ramp(frame, meet.start - 30, meet.start + 4, move);
  const seedY = mix(-260, SEED.y, fall);
  const G = growth(frame);
  const lv = lightLevel(frame);
  const quiet = ramp(frame, crew.start - 10, crew.start + 14) * (1 - ramp(frame, grow.start - 10, grow.start + 10));
  const flare = ramp(frame, grow.start, grow.accent) * (1 - ramp(frame, credits.start, credits.start + 40) * 0.8);
  const behind = 1 - 0.55 * ramp(frame, credits.start - 10, credits.start + 30);
  const pulse = (k: number) => 0.6 + 0.4 * Math.sin(frame / 9 + k);

  return (
    <Place pose={pose} at={[0, 0.2, -1]} w={RW} h={RH} filter={`drop-shadow(0 0 ${(6 + flare * 10).toFixed(1)}px ${COLOR.glow}) brightness(${(lv * behind * (1 + flare * 0.4)).toFixed(3)})`}>
      <svg width={RW} height={RH} viewBox={`0 0 ${RW} ${RH}`} style={{ overflow: "visible",
        maskImage: "linear-gradient(180deg, #000 70%, transparent 100%)", WebkitMaskImage: "linear-gradient(180deg, #000 70%, transparent 100%)" }}>
        <defs>
          <linearGradient id="rootInk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#c9ffe6" />
            <stop offset="0.5" stopColor={COLOR.accent} />
            <stop offset="1" stopColor="#1f8a62" />
          </linearGradient>
        </defs>
        <g opacity={mix(1, 0.28, quiet)}>
          {NET.segs.map((s, i) => {
            const t = clamp01((G - s.t0) / s.dur);
            if (t <= 0) return null;
            return <path key={i} d={s.d} fill="none" stroke="url(#rootInk)" strokeWidth={s.width} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - t} />;
          })}
          {NET.tips.map((tp, i) => {
            const t = ramp(G, tp.t - 0.01, tp.t + 0.04);
            if (t <= 0) return null;
            return <circle key={i} cx={tp.x} cy={tp.y} r={(5 + flare * 4 * pulse(i)) * t} fill={COLOR.mint} />;
          })}
        </g>
        {quiet > 0
          ? CREW.map((c, i) => {
              const t = ramp(frame, crew.start + i * 4, crew.start + 16 + i * 4);
              return (
                <g key={i} opacity={quiet}>
                  <circle cx={c.x} cy={c.y} r={30 * t} fill="none" stroke={COLOR.accent} strokeWidth={4} opacity={pulse(i)} />
                  <circle cx={c.x} cy={c.y} r={13 * t} fill={COLOR.accent} />
                </g>
              );
            })
          : null}
        {fall > 0 ? (
          <g>
            <circle cx={SEED.x} cy={seedY} r={46} fill={COLOR.accent} opacity={0.25 * (1 + flare)} />
            <circle cx={SEED.x} cy={seedY} r={20} fill={COLOR.mint} />
          </g>
        ) : null}
      </svg>
    </Place>
  );
};
