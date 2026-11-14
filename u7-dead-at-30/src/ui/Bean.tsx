import React from "react";
import { C } from "../lib/style";

export type Face = "smug" | "panic" | "deadpan" | "happy" | "angry" | "blank";
export type Hat = "bicorne" | "bearskin" | "shako" | "viking" | "horned" | "party" | "wig" | "crown" | "hood" | "tophat" | "einstein" | "cap" | "none";

type Props = {
  x: number;
  y: number; // feet
  s?: number;
  coat?: string;
  hat?: Hat;
  face?: Face;
  hair?: boolean;
  armL?: number; // degrees from straight down, outward positive
  armR?: number;
  legs?: number;
  flip?: boolean;
  holdR?: React.ReactNode;
  beard?: string;
  /** 0..1: how far the horns have flown off (for the pop gag) */
  hornsOff?: number;
  /** moustache colour */
  tache?: string;
  /** skin tone override */
  skin?: string;
};

const rad = (d: number) => (d * Math.PI) / 180;
const LW = 11;

/** A chunky bean character: heavy body, short legs, round head, thick black outline. Feet at (x, y). */
export const Bean: React.FC<Props> = ({ x, y, s = 1, coat = C.navy, hat = "none", face = "deadpan", hair = false, armL = 18, armR = 18, legs = 22, flip = false, holdR, beard, hornsOff = 0, tache, skin }) => {
  const limb = (x1: number, y1: number, x2: number, y2: number, color: string) => (
    <g>
      <path d={`M${x1} ${y1} L${x2} ${y2}`} stroke={C.line} strokeWidth={30} strokeLinecap="round" />
      <path d={`M${x1} ${y1} L${x2} ${y2}`} stroke={color} strokeWidth={30 - LW * 1.6} strokeLinecap="round" />
    </g>
  );
  const arm = (side: -1 | 1, a: number) => {
    const sx = side * 52, sy = -188, len = 92;
    const ex = sx + Math.sin(rad(a) * side) * len, ey = sy + Math.cos(rad(a)) * len;
    return { ex, ey, node: limb(sx, sy, ex, ey, coat) };
  };
  const L = arm(-1, armL), R = arm(1, armR);
  const head = -300;
  const blank = face === "blank";
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      {limb(-legs, -6, -16, -78, C.slate)}
      {limb(legs, -6, 16, -78, C.slate)}
      <ellipse cx={-legs - 8} cy={0} rx={24} ry={11} fill={C.line} />
      <ellipse cx={legs + 8} cy={0} rx={24} ry={11} fill={C.line} />
      {L.node}
      <path d="M-64 -150 C -70 -230 -40 -262 0 -262 C 40 -262 70 -230 64 -150 C 60 -92 36 -70 0 -70 C -36 -70 -60 -92 -64 -150 Z"
        fill={coat} stroke={C.line} strokeWidth={LW} strokeLinejoin="round" />
      {coat === C.navy ? <path d="M-30 -258 L0 -205 L30 -258" fill="none" stroke={C.red} strokeWidth={14} strokeLinejoin="round" /> : null}
      {coat === C.navy ? <path d="M-58 -110 L58 -110" stroke={C.white} strokeWidth={10} /> : null}
      {R.node}
      {holdR ? <g transform={`translate(${R.ex} ${R.ey})`}>{holdR}</g> : null}
      <circle cx={0} cy={head} r={58} fill={blank ? C.white : skin || C.skin} stroke={C.line} strokeWidth={LW} />
      {hair ? <path d={`M-52 ${head - 18} C -50 ${head - 64} 40 ${head - 74} 54 ${head - 20} C 30 ${head - 40} -20 ${head - 44} -52 ${head - 18} Z`} fill={C.hair} stroke={C.line} strokeWidth={8} /> : null}
      {beard && !blank ? <path d={`M-50 ${head + 6} C -52 ${head + 70} -20 ${head + 96} 0 ${head + 98} C 20 ${head + 96} 52 ${head + 70} 50 ${head + 6} C 30 ${head + 30} -30 ${head + 30} -50 ${head + 6} Z`} fill={beard} stroke={C.line} strokeWidth={8} strokeLinejoin="round" /> : null}
      {!blank ? <Expression face={face} y={head} /> : null}
      {tache && !blank ? <path d={`M-34 ${head + 20} C -20 ${head + 6} -4 ${head + 10} 0 ${head + 16} C 4 ${head + 10} 20 ${head + 6} 34 ${head + 20} C 20 ${head + 30} 6 ${head + 24} 0 ${head + 20} C -6 ${head + 24} -20 ${head + 30} -34 ${head + 20} Z`} fill={tache} stroke={C.line} strokeWidth={5} strokeLinejoin="round" /> : null}
      <HatShape hat={hat} y={head - 52} hornsOff={hornsOff} />
    </g>
  );
};

const Expression: React.FC<{ face: Face; y: number }> = ({ face, y }) => {
  const line = { stroke: C.line, strokeWidth: 7, strokeLinecap: "round" as const, fill: "none" };
  if (face === "smug")
    return (
      <g>
        <path d={`M-28 ${y + 2} Q-18 ${y - 8} -8 ${y + 2} M8 ${y + 2} Q18 ${y - 8} 28 ${y + 2}`} {...line} />
        <path d={`M-12 ${y + 26} Q6 ${y + 32} 20 ${y + 20}`} {...line} />
      </g>
    );
  if (face === "panic")
    return (
      <g>
        <circle cx={-18} cy={y - 6} r={5} fill={C.line} />
        <circle cx={18} cy={y - 6} r={5} fill={C.line} />
        <ellipse cx={0} cy={y + 26} rx={18} ry={20} fill={C.line} />
        <path d={`M-34 ${y - 26} L-12 ${y - 20} M12 ${y - 20} L34 ${y - 26}`} {...line} />
      </g>
    );
  if (face === "angry")
    return (
      <g>
        <circle cx={-18} cy={y} r={6} fill={C.line} />
        <circle cx={18} cy={y} r={6} fill={C.line} />
        <path d={`M-34 ${y - 22} L-8 ${y - 10} M8 ${y - 10} L34 ${y - 22}`} {...line} />
        <path d={`M-14 ${y + 28} Q0 ${y + 18} 14 ${y + 28}`} {...line} />
      </g>
    );
  if (face === "happy")
    return (
      <g>
        <circle cx={-18} cy={y - 2} r={6} fill={C.line} />
        <circle cx={18} cy={y - 2} r={6} fill={C.line} />
        <path d={`M-20 ${y + 16} Q0 ${y + 38} 20 ${y + 16}`} {...line} />
      </g>
    );
  // deadpan
  return (
    <g>
      <circle cx={-18} cy={y} r={6} fill={C.line} />
      <circle cx={18} cy={y} r={6} fill={C.line} />
      <path d={`M-30 ${y - 12} L-8 ${y - 12} M8 ${y - 12} L30 ${y - 12}`} {...line} />
      <path d={`M-12 ${y + 26} L12 ${y + 26}`} {...line} />
    </g>
  );
};

const Horn: React.FC<{ side: -1 | 1; y: number; off: number }> = ({ side, y, off }) => (
  <g transform={`translate(${side * (60 + off * 260)} ${y - 6 - off * 300 + off * off * 160}) rotate(${side * off * 260})`}>
    <path d={`M0 0 C ${side * 46} -6 ${side * 70} -50 ${side * 52} -104 C ${side * 40} -66 ${side * 20} -40 ${side * -10} -30 Z`} fill="#EFE6D2" stroke={C.line} strokeWidth={9} strokeLinejoin="round" />
  </g>
);

const HatShape: React.FC<{ hat: Hat; y: number; hornsOff?: number }> = ({ hat, y, hornsOff = 0 }) => {
  if (hat === "viking" || hat === "horned" || hat === "party") {
    const metal = hat === "party" ? "#E8D24A" : "#9AA0A8";
    return (
      <g>
        {hat !== "viking" ? <><Horn side={-1} y={y + 10} off={hornsOff} /><Horn side={1} y={y + 10} off={hornsOff} /></> : null}
        <path d={`M-62 ${y + 34} C -62 ${y - 40} 62 ${y - 40} 62 ${y + 34} Z`} fill={metal} stroke={C.line} strokeWidth={11} strokeLinejoin="round" />
        <path d={`M0 ${y - 22} L0 ${y + 34}`} stroke={C.line} strokeWidth={8} />
        {hat === "viking" ? <path d={`M-40 ${y + 34} Q-20 ${y + 70} 0 ${y + 40} Q20 ${y + 70} 40 ${y + 34}`} fill="none" stroke={C.line} strokeWidth={9} /> : null}
      </g>
    );
  }
  if (hat === "bicorne")
    return (
      <g transform={`translate(0 ${y + 14})`}>
        <path d="M-96 0 Q0 -100 96 0 Q0 -24 -96 0 Z" fill={C.line} />
        <circle cx={0} cy={-30} r={15} fill={C.white} stroke={C.line} strokeWidth={4} />
        <circle cx={0} cy={-30} r={9} fill={C.red} />
        <circle cx={0} cy={-30} r={4} fill={C.navy} />
      </g>
    );
  if (hat === "wig")
    return (
      <g>
        <path d={`M-70 ${y + 60} C -96 ${y + 10} -90 ${y - 60} -60 ${y - 110} C -50 ${y - 190} 50 ${y - 190} 60 ${y - 110} C 90 ${y - 60} 96 ${y + 10} 70 ${y + 60} C 50 ${y + 20} -50 ${y + 20} -70 ${y + 60} Z`} fill="#F1EEF4" stroke={C.line} strokeWidth={LW} strokeLinejoin="round" />
        {[-40, 0, 40].map((k) => <circle key={k} cx={k} cy={y - 120 + Math.abs(k) * 0.4} r={20} fill="none" stroke="#C9C3D6" strokeWidth={6} />)}
        <path d={`M-30 ${y - 168} L0 ${y - 150} L30 ${y - 168} L30 ${y - 132} L0 ${y - 150} L-30 ${y - 132} Z`} fill="#7FA8D9" stroke={C.line} strokeWidth={6} strokeLinejoin="round" />
      </g>
    );
  if (hat === "crown")
    return <path d={`M-50 ${y + 20} L-56 ${y - 50} L-28 ${y - 20} L0 ${y - 66} L28 ${y - 20} L56 ${y - 50} L50 ${y + 20} Z`} fill={C.yellow} stroke={C.line} strokeWidth={LW} strokeLinejoin="round" />;
  if (hat === "hood")
    return <path d={`M-74 ${y + 110} C -84 ${y - 20} -60 ${y - 80} 0 ${y - 82} C 60 ${y - 80} 84 ${y - 20} 74 ${y + 110} L58 ${y + 110} C 64 ${y + 20} 40 ${y - 30} 0 ${y - 30} C -40 ${y - 30} -64 ${y + 20} -58 ${y + 110} Z`} fill="#7B5B3A" stroke={C.line} strokeWidth={LW} strokeLinejoin="round" />;
  if (hat === "tophat")
    return (
      <g>
        <path d={`M-80 ${y + 22} L80 ${y + 22}`} stroke={C.line} strokeWidth={18} strokeLinecap="round" />
        <rect x={-46} y={y - 100} width={92} height={120} fill={C.line} />
        <rect x={-46} y={y - 6} width={92} height={14} fill={C.red} />
      </g>
    );
  if (hat === "cap")
    return <path d={`M-62 ${y + 30} C -62 ${y - 30} 62 ${y - 30} 62 ${y + 30} L96 ${y + 34} L60 ${y + 40} L-62 ${y + 30} Z`} fill="#5D6470" stroke={C.line} strokeWidth={LW} strokeLinejoin="round" />;
  if (hat === "einstein")
    return (
      <path d={`M-58 ${y + 64} C -100 ${y + 40} -96 ${y - 6} -76 ${y - 10} C -104 ${y - 40} -70 ${y - 74} -46 ${y - 56} C -44 ${y - 100} 0 ${y - 96} 4 ${y - 64} C 20 ${y - 104} 70 ${y - 90} 60 ${y - 52} C 100 ${y - 60} 108 ${y - 10} 80 ${y - 4} C 106 ${y + 20} 96 ${y + 56} 58 ${y + 64} C 66 ${y + 24} 40 ${y + 4} 0 ${y + 6} C -40 ${y + 4} -66 ${y + 24} -58 ${y + 64} Z`}
        fill="#F2F0EA" stroke={C.line} strokeWidth={9} strokeLinejoin="round" />
    );
  if (hat === "bearskin")
    return <path d={`M-56 ${y + 18} L-60 ${y - 110} Q-56 ${y - 160} 0 ${y - 164} Q56 ${y - 160} 60 ${y - 110} L56 ${y + 18} Z`} fill="#2b2522" stroke={C.line} strokeWidth={LW} />;
  if (hat === "shako")
    return (
      <g>
        <path d={`M-42 ${y + 12} L-36 ${y - 62} L36 ${y - 62} L42 ${y + 12} Z`} fill={C.line} />
        <circle cx={0} cy={y - 74} r={12} fill={C.red} stroke={C.line} strokeWidth={4} />
      </g>
    );
  return null;
};
