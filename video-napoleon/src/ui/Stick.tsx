import React from "react";
import { C } from "../lib/style";

export type Face = "deadpan" | "grin" | "angry" | "happy" | "flat";
export type Hat = "bicorne" | "bearskin" | "shako" | "tuft" | "none";

type Props = {
  x: number;
  y: number; // feet baseline
  s?: number;
  coat?: string;
  hat?: Hat;
  face?: Face;
  armL?: number; // degrees from straight down, positive swings outward
  armR?: number;
  elbowL?: number; // extra bend at the elbow
  elbowR?: number;
  legs?: number; // half-spread of the feet
  lean?: number; // degrees
  look?: number; // -1..1 eyes left/right
  holding?: React.ReactNode; // drawn at the right hand
};

const rad = (d: number) => (d * Math.PI) / 180;

/** A flat, deadpan stickman: round head, ink limbs, a coloured coat. Feet at (x, y). */
export const Stick: React.FC<Props> = ({ x, y, s = 1, coat = C.navy, hat = "none", face = "deadpan", armL = 20, armR = 20, elbowL = 0, elbowR = 0, legs = 26, lean = 0, look = 0, holding }) => {
  const hip = -118, neck = -238, headY = -286, R = 44;
  const shoulder = neck + 14;
  const arm = (side: -1 | 1, a: number, bend: number) => {
    const upper = 58, lower = 56;
    const a1 = rad(a) * side;
    const ex = side * 22 + Math.sin(a1) * upper, ey = shoulder + Math.cos(a1) * upper;
    const a2 = a1 + rad(bend) * side;
    const hx = ex + Math.sin(a2) * lower, hy = ey + Math.cos(a2) * lower;
    return { d: `M${side * 22} ${shoulder} L${ex} ${ey} L${hx} ${hy}`, hx, hy };
  };
  const L = arm(-1, armL, elbowL), Rr = arm(1, armR, elbowR);
  const ink = { stroke: C.ink, strokeWidth: 11, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };
  const ex = look * 6;
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) rotate(${lean})`}>
      {/* legs */}
      <path d={`M-10 ${hip} L${-legs} 0 M10 ${hip} L${legs} 0`} {...ink} />
      <path d={`M${-legs - 16} 0 L${-legs + 6} 0 M${legs - 6} 0 L${legs + 16} 0`} {...ink} strokeWidth={14} />
      {/* coat */}
      <path d={`M-30 ${neck + 4} L30 ${neck + 4} L34 ${hip + 18} L-34 ${hip + 18} Z`} fill={coat} stroke={C.ink} strokeWidth={8} strokeLinejoin="round" />
      {coat === C.navy ? <path d={`M-30 ${neck + 4} L30 ${neck + 4} L18 ${neck + 30} L-18 ${neck + 30} Z`} fill={C.red} /> : null}
      {/* arms */}
      <path d={L.d} {...ink} />
      <path d={Rr.d} {...ink} />
      {holding ? <g transform={`translate(${Rr.hx} ${Rr.hy})`}>{holding}</g> : null}
      {/* head */}
      <circle cx={0} cy={headY} r={R} fill={C.skin} stroke={C.ink} strokeWidth={9} />
      <Expression face={face} y={headY} ex={ex} />
      <HatShape hat={hat} y={headY - R} />
    </g>
  );
};

const Expression: React.FC<{ face: Face; y: number; ex: number }> = ({ face, y, ex }) => {
  const eye = (cx: number) => <circle cx={cx + ex} cy={y - 4} r={6} fill={C.ink} />;
  const line = { stroke: C.ink, strokeWidth: 6, strokeLinecap: "round" as const, fill: "none" };
  return (
    <g>
      {eye(-15)}
      {eye(15)}
      {face === "deadpan" ? (
        <>
          <path d={`M${-24 + ex} ${y - 13} L${-6 + ex} ${y - 13} M${6 + ex} ${y - 13} L${24 + ex} ${y - 13}`} {...line} />
          <path d={`M-12 ${y + 20} L12 ${y + 20}`} {...line} />
        </>
      ) : null}
      {face === "flat" ? <path d={`M-12 ${y + 20} L12 ${y + 20}`} {...line} /> : null}
      {face === "grin" ? <path d={`M-20 ${y + 12} Q0 ${y + 34} 20 ${y + 12}`} {...line} /> : null}
      {face === "happy" ? <path d={`M-16 ${y + 14} Q0 ${y + 28} 16 ${y + 14}`} {...line} /> : null}
      {face === "angry" ? (
        <>
          <path d={`M${-26 + ex} ${y - 22} L${-6 + ex} ${y - 12} M${6 + ex} ${y - 12} L${26 + ex} ${y - 22}`} {...line} />
          <ellipse cx={0} cy={y + 22} rx={12} ry={8} fill={C.ink} />
        </>
      ) : null}
    </g>
  );
};

const HatShape: React.FC<{ hat: Hat; y: number }> = ({ hat, y }) => {
  if (hat === "bicorne")
    return (
      <g transform={`translate(0 ${y + 10})`}>
        <path d="M-78 0 Q0 -86 78 0 Q0 -18 -78 0 Z" fill={C.ink} />
        <circle cx={0} cy={-26} r={13} fill={C.paperHi} />
        <circle cx={0} cy={-26} r={8} fill={C.red} />
        <circle cx={0} cy={-26} r={4} fill={C.navy} />
      </g>
    );
  if (hat === "bearskin")
    return (
      <g transform={`translate(0 ${y + 14})`}>
        <path d="M-46 0 L-50 -120 Q-46 -160 0 -164 Q46 -160 50 -120 L46 0 Z" fill="#2a2420" stroke={C.ink} strokeWidth={6} />
        <path d="M-50 -60 L-54 -40" stroke={C.red} strokeWidth={10} strokeLinecap="round" />
      </g>
    );
  if (hat === "shako")
    return (
      <g transform={`translate(0 ${y + 10})`}>
        <path d="M-36 0 L-30 -62 L30 -62 L36 0 Z" fill={C.ink} />
        <circle cx={0} cy={-74} r={10} fill={C.red} />
      </g>
    );
  if (hat === "tuft") return <path d={`M-20 ${y + 6} Q-10 ${y - 26} 0 ${y + 2} Q10 ${y - 30} 22 ${y + 6}`} fill="none" stroke={C.ink} strokeWidth={8} strokeLinecap="round" />;
  return null;
};
