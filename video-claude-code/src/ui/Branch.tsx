import React from "react";
import { MERGE, Pose } from "../lib/camera";
import { arrive, leave, mix, move, ramp } from "../lib/ease";
import { COLOR } from "../lib/format";
import { LF } from "../lib/time";
import { FONT } from "../fonts";
import { Place } from "./Place";

// World box of the drawing: x -7..17, y -3..1.8. 100 px per unit.
const X0 = -7;
const Y1 = 1.8;
const BW = 2400;
const BH = 480;
const sx = (x: number) => (x - X0) * 100;
const sy = (y: number) => (Y1 - y) * 100;

const P = [
  [0, 0],
  [4.5, 0],
  [5.5, MERGE[1]],
  [MERGE[0], MERGE[1]],
] as const;

const bez = (t: number) => {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return [a * P[0][0] + b * P[1][0] + c * P[2][0] + d * P[3][0], a * P[0][1] + b * P[1][1] + c * P[2][1] + d * P[3][1]];
};

/** Where the commit dot is, in world units, at a frame. */
export const dotState = (frame: number) => {
  const ship = LF("ship");
  const where = LF("where");
  const t = ramp(frame, ship.start + 18, ship.accent, move);
  const [x, y] = bez(t);
  const born = ramp(frame, ship.start + 10, ship.start + 24);
  const open = ramp(frame, where.start - 6, where.start + 10, leave);
  return { x, y, t, r: mix(4, 26, born) * (1 - open), visible: born > 0 && open < 1 };
};

export const Branch: React.FC<{ frame: number; pose: Pose }> = ({ frame, pose }) => {
  const ship = LF("ship");
  const where = LF("where");
  if (frame < ship.start) return null;
  const main = ramp(frame, ship.start, ship.start + 30, move);
  const label = ramp(frame, ship.start + 14, ship.start + 30);
  const dot = dotState(frame);
  const cta = LF("cta");
  const badgeIn = ramp(frame, ship.accent - 14, ship.accent + 2, arrive);
  const badgeOut = ramp(frame, where.start - 8, where.start + 6, leave);
  const fade = mix(1, 0.3, ramp(frame, where.start - 8, where.start + 12)) * (1 - ramp(frame, cta.start - 20, cta.start + 4));
  const path = `M${sx(P[0][0])} ${sy(P[0][1])} C${sx(P[1][0])} ${sy(P[1][1])} ${sx(P[2][0])} ${sy(P[2][1])} ${sx(P[3][0])} ${sy(P[3][1])}`;
  const mainY = sy(MERGE[1]);
  const badge = { x: mix(sx(dot.x), sx(MERGE[0]), badgeIn), y: mix(sy(dot.y), sy(MERGE[1] + 1.55), badgeIn) };
  return (
    <Place pose={pose} at={[X0 + BW / 200, Y1 - BH / 200, 0]} w={BW} h={BH}>
      <svg width={BW} height={BH} viewBox={`0 0 ${BW} ${BH}`} style={{ overflow: "visible" }}>
        <defs>
          <filter id="glow" x="-1" y="-1" width="3" height="3">
            <feGaussianBlur stdDeviation="12" />
          </filter>
        </defs>
        <g opacity={fade}>
          <line x1={sx(-6)} y1={mainY} x2={sx(-6) + (sx(16) - sx(-6)) * main} y2={mainY} stroke="rgba(244,237,228,0.32)" strokeWidth={8} strokeLinecap="round" />
          {[-4, -1.5, 1.5].map((x, i) => (
            <circle key={x} cx={sx(x)} cy={mainY} r={18 * ramp(frame, ship.start + 6 + i * 4, ship.start + 20 + i * 4)} fill="#6f645b" />
          ))}
          <text x={sx(-6)} y={mainY + 80} fontFamily={FONT.mono} fontWeight={500} fontSize={48} fill={COLOR.muted} opacity={label}>main</text>
          <path d={path} fill="none" stroke={COLOR.accent} strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - dot.t} />
          <text x={sx(0.4)} y={sy(0.55)} fontFamily={FONT.mono} fontWeight={500} fontSize={48} fill={COLOR.accent} opacity={label}>dark-mode</text>
        </g>
        {dot.visible ? (
          <>
            <circle cx={sx(dot.x)} cy={sy(dot.y)} r={dot.r * 1.8} fill={COLOR.accent} opacity={0.55} filter="url(#glow)" />
            <circle cx={sx(dot.x)} cy={sy(dot.y)} r={dot.r} fill={COLOR.accent} />
          </>
        ) : null}
        {badgeIn > 0 && badgeOut < 1 ? (
          <g transform={`translate(${badge.x} ${badge.y}) scale(${mix(0.25, 1, badgeIn) * (1 - badgeOut)})`}>
            <rect x={-215} y={-50} width={430} height={100} rx={50} fill="rgba(141,191,127,0.16)" stroke={COLOR.green} strokeWidth={3} />
            <circle cx={-148} cy={0} r={24} fill="none" stroke={COLOR.green} strokeWidth={4} />
            <path d="M-160 1l8 8 16-17" fill="none" stroke={COLOR.green} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
            <text x={-100} y={17} fontFamily={FONT.mono} fontWeight={500} fontSize={50} fill={COLOR.green}>PR merged</text>
          </g>
        ) : null}
      </svg>
    </Place>
  );
};
