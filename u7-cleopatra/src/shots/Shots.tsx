import React from "react";
import { Bean } from "../ui/Bean";
import { Big, Book, C, Card, FEET, HORIZON, Ink, LW, Parchment, Rays, Scene, ShotProps, Stamp, Timber, ZeroCard, mix, move, pop, ramp, wob } from "./kit";

const Desert: React.FC<{ f: number; pyramids?: boolean; ruin?: boolean }> = ({ f, pyramids = true, ruin }) => (
  <g>
    <rect x={0} y={0} width={1080} height={1920} fill="#F3D9A6" />
    <circle cx={860} cy={300} r={90} fill={C.yellow} stroke={C.line} strokeWidth={LW} />
    {pyramids ? [[300, 260, 460], [700, 200, 360]].map(([x, h, w], i) => (
      <g key={i}>
        <path d={`M${x - w / 2} ${HORIZON} L${x} ${HORIZON - h * 2} L${x + w / 2} ${HORIZON} Z`} fill={ruin ? "#C9A877" : "#E3C489"} stroke={C.line} strokeWidth={LW} strokeLinejoin="round" />
        <path d={`M${x} ${HORIZON - h * 2} L${x + w / 2} ${HORIZON} L${x + w / 6} ${HORIZON} Z`} fill="#C9A877" />
        {ruin ? <path d={`M${x - w / 6} ${HORIZON - h * 0.8} l30 -20 l20 30 M${x + 30} ${HORIZON - h * 1.3} l26 -14`} stroke={C.line} strokeWidth={6} fill="none" /> : null}
      </g>
    )) : null}
    <path d={`M0 ${HORIZON} C 300 ${HORIZON - 30} 700 ${HORIZON + 30} 1080 ${HORIZON - 10} L1080 1920 L0 1920 Z`} fill="#E8C98E" stroke={C.line} strokeWidth={LW} />
    {wob(f, 1) > 9 ? null : null}
  </g>
);
const Timeline: React.FC<{ f: number; marks: { at: number; label: string; color?: string; t0: number }[]; title?: string }> = ({ f, marks, title }) => {
  const x = (yr: number) => 120 + ((yr + 2600) / 4630) * 840; // 2600 BC → 2030 AD
  return (
    <g>
      <Parchment />
      {title ? <Big x={540} y={420} size={90}>{title}</Big> : null}
      <path d={`M100 900 L980 900`} stroke={C.line} strokeWidth={14} strokeLinecap="round" />
      {marks.map((m, i) => { const k = pop(f, m.t0); return k > 0 ? (
        <g key={i} transform={`translate(${x(m.at)} 900) scale(${k})`}>
          <circle cx={0} cy={0} r={22} fill={m.color || C.yellow} stroke={C.line} strokeWidth={8} />
          <Ink x={0} y={i % 2 ? 110 : -60} size={42}>{m.label}</Ink>
        </g>) : null; })}
    </g>
  );
};
const Span: React.FC<{ f: number; a: number; b: number; y: number; t0: number; label: string; color: string }> = ({ f, a, b, y, t0, label, color }) => {
  const x = (yr: number) => 120 + ((yr + 2600) / 4630) * 840, k = ramp(f, t0, t0 + 18, move);
  return (
    <g>
      <path d={`M${x(a)} ${y} L${mix(x(a), x(b), k)} ${y}`} stroke={C.line} strokeWidth={34} strokeLinecap="round" />
      <path d={`M${x(a)} ${y} L${mix(x(a), x(b), k)} ${y}`} stroke={color} strokeWidth={20} strokeLinecap="round" />
      {k > 0.9 ? <Big x={(x(a) + x(b)) / 2} y={y - 40} size={70} color={color}>{label}</Big> : null}
    </g>
  );
};
const CLEO = { coat: C.white, hat: "nemes" as const };
const cleoPose = (f: number) => (
  <>
    <Desert f={f} />
    <Bean x={540} y={FEET} s={1.5} {...CLEO} face="smug" armR={150 + wob(f, 3, 8)} armL={20} />
  </>
);
const PY = { at: -2560, label: "Pyramid", t0: 2 }, CL = { at: -30, label: "Cleopatra", color: C.red, t0: 2 }, MO = { at: 1969, label: "Moon", color: C.navy, t0: 2 };

export const k01: React.FC<ShotProps> = ({ f }) => <Scene f={f}>{cleoPose(f)}</Scene>;
export const k02: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    {cleoPose(f)}
    <Stamp f={f} a={12} x={540} y={420} text="NOPE" size={130} />
  </Scene>
);
export const k03: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Desert f={f} />
    <Bean x={540} y={FEET} s={1.15} {...CLEO} face="deadpan" />
    <g transform={`translate(540 330) scale(${mix(1.3, 1, pop(f, 2, 6))}) translate(-540 -330)`}>
      <Big x={540} y={290} size={130}>CLEOPATRA</Big>
      <Big x={540} y={410} size={90} color={C.yellow}>THE TIMELINE</Big>
    </g>
  </Scene>
);
export const k04: React.FC<ShotProps> = ({ f }) => {
  const k = ramp(f, 4, 40, move);
  return (
    <Scene f={f}>
      <Desert f={f} pyramids={false} />
      <path d={`M300 ${HORIZON} L${300 - 230 * k} ${HORIZON} L300 ${HORIZON - 520 * k} L${300 + 230 * k} ${HORIZON} Z`} fill="#E3C489" stroke={C.line} strokeWidth={LW} strokeLinejoin="round" />
      {[0, 1, 2].map((i) => <Bean key={i} x={620 + i * 150} y={FEET} s={0.8} coat="#C9A877" face="happy" armL={150} armR={150 - wob(f + i * 5, 2, 20)} />)}
      <g transform={`translate(540 420) scale(${pop(f, 8)})`}><Big x={0} y={0} size={140} color={C.yellow}>2560 BC</Big></g>
    </Scene>
  );
};
export const k05: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Desert f={f} />
    <Bean x={540} y={FEET} s={1.5} {...CLEO} face="deadpan" armL={20} armR={20} />
    <g transform={`translate(540 420) scale(${pop(f, 8)})`}><Big x={0} y={0} size={140} color={C.yellow}>30 BC</Big></g>
  </Scene>
);
export const k06: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}><Timeline f={f} marks={[PY, { ...CL, t0: 8 }]} /><Span f={f} a={-2560} b={-30} y={760} t0={14} label="2,500 yrs" color={C.red} /></Scene>
);
export const k07: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Desert f={f} ruin />
    <Bean x={760} y={FEET} s={1.3} {...CLEO} face="smug" armR={110} armL={20}
      holdR={<g transform="translate(10 -30)"><rect x={-40} y={-50} width={80} height={60} rx={10} fill={C.slate} stroke={C.line} strokeWidth={6} /><circle cx={0} cy={-20} r={18} fill="#9FC3D4" stroke={C.line} strokeWidth={5} /></g>} />
    <g transform={`translate(400 360) scale(${pop(f, 10)})`}><Big x={0} y={0} size={120} color={C.yellow}>ANCIENT</Big></g>
  </Scene>
);
export const k08: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <rect x={0} y={0} width={1080} height={1920} fill="#14172A" />
    {Array.from({ length: 30 }, (_, k) => <circle key={k} cx={(k * 197) % 1080} cy={(k * 131) % 1000} r={3} fill={C.cloud} />)}
    <path d={`M0 ${HORIZON} C 300 ${HORIZON - 40} 700 ${HORIZON + 30} 1080 ${HORIZON - 20} L1080 1920 L0 1920 Z`} fill="#BDBDC2" stroke={C.line} strokeWidth={LW} />
    <Bean x={420} y={FEET + 30} s={1.3} coat={C.white} hat="astronaut" face="happy" armR={150} armL={20}
      holdR={<g><path d="M0 0 L0 -180" stroke={C.line} strokeWidth={8} /><rect x={0} y={-180} width={110} height={70} fill={C.white} stroke={C.line} strokeWidth={6} /></g>} />
    <g transform={`translate(760 420) scale(${pop(f, 8)})`}><Big x={0} y={0} size={150} color={C.yellow}>1969</Big></g>
  </Scene>
);
export const k09: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}><Timeline f={f} marks={[PY, CL, { ...MO, t0: 6 }]} /><Span f={f} a={-30} b={1969} y={760} t0={12} label="2,000 yrs" color={C.navy} /></Scene>
);
export const k10: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}><Timeline f={f} marks={[{ ...PY, t0: -10 }, { ...CL, t0: -10 }, { ...MO, t0: -10 }]} /><Span f={f} a={-30} b={1969} y={760} t0={-20} label="2,000" color={C.navy} />
    <g transform={`translate(${120 + ((-30 + 2600) / 4630) * 840} 1060) scale(${pop(f, 8)})`}><Big x={0} y={60} size={120} color={C.navy}>→</Big></g></Scene>
);
export const k11: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}><Timeline f={f} marks={[{ ...PY, t0: -10 }, { ...CL, t0: -10 }, { ...MO, t0: -10 }]} />
    <Span f={f} a={-30} b={1969} y={760} t0={-20} label="2,000" color={C.navy} /><Span f={f} a={-2560} b={-30} y={640} t0={2} label="2,500" color={C.red} />
    <Stamp f={f} a={26} x={540} y={1180} text="CLOSER TO US" size={90} />
  </Scene>
);
export const k12: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <rect x={0} y={0} width={1080} height={1920} fill="#9FC3D4" />
    {[260, 540, 820].map((x) => <g key={x}><rect x={x - 40} y={520} width={80} height={HORIZON - 520} fill={C.white} stroke={C.line} strokeWidth={LW} />{[0, 1, 2].map((k) => <path key={k} d={`M${x - 20 + k * 20} 540 L${x - 20 + k * 20} ${HORIZON - 20}`} stroke="#D6D2C8" strokeWidth={5} />)}</g>)}
    <path d="M180 520 L540 380 L900 520 Z" fill={C.white} stroke={C.line} strokeWidth={LW} strokeLinejoin="round" />
    <rect x={0} y={HORIZON} width={1080} height={770} fill="#E8C98E" stroke={C.line} strokeWidth={LW} />
    <Bean x={540} y={FEET} s={1.3} {...CLEO} face="happy" armL={20} armR={20} />
    <g transform={`translate(540 300) scale(${pop(f, 12)})`}><Big x={0} y={0} size={130} color={C.yellow}>GREEK</Big></g>
  </Scene>
);
export const k13: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Timber />
    {[0, 1, 2, 3, 4].map((k) => { const kk = pop(f, 2 + k * 5); return kk > 0 ? <g key={k} transform={`translate(${130 + k * 205} 760) scale(${kk})`}><rect x={-80} y={-110} width={160} height={220} fill={C.parchment} stroke={C.yellow} strokeWidth={14} /><Bean x={0} y={90} s={0.35} coat={C.white} hat={k === 4 ? "nemes" : "crown"} face="smug" /></g> : null; })}
    <g transform={`translate(540 1060) scale(${pop(f, 30)})`}><Big x={0} y={0} size={120} color={C.yellow}>~300 YEARS</Big></g>
  </Scene>
);
export const k14: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Timber />
    <Bean x={330} y={FEET} s={1.4} {...CLEO} face="happy" armR={110} armL={20} />
    <g transform={`translate(760 620) scale(${pop(f, 8)})`}>
      <path d="M-200 -110 L200 -110 L200 70 L-60 70 L-140 140 L-110 70 L-200 70 Z" fill={C.white} stroke={C.line} strokeWidth={10} strokeLinejoin="round" />
      <g transform="translate(-90 -20)"><circle cx={0} cy={-40} r={26} fill="none" stroke={C.line} strokeWidth={12} /><path d="M0 -14 L0 60 M-40 4 L40 4" stroke={C.line} strokeWidth={12} strokeLinecap="round" /></g><g transform="translate(70 -10)"><ellipse cx={0} cy={0} rx={60} ry={30} fill="none" stroke={C.line} strokeWidth={10} /><circle cx={0} cy={0} r={16} fill={C.line} /><path d="M-20 30 L-30 70 M10 30 Q30 60 50 50" stroke={C.line} strokeWidth={8} fill="none" strokeLinecap="round" /></g>
    </g>
  </Scene>
);
export const k15: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <Bean x={540} y={FEET} s={1.3} {...CLEO} face="smug" armL={20} armR={20} />
    {["Hello", "Salve", "Khaire", "Shalom", "Salaam", "..."].map((w, i) => { const k = pop(f, 4 + i * 5); const a = i * 1.05 - 2.6; return k > 0 ? <g key={i} transform={`translate(${540 + Math.cos(a) * 340} ${700 + Math.sin(a) * 260}) scale(${k})`}><Card x={0} y={0} w={220} h={90}><Ink x={0} y={16} size={42}>{w}</Ink></Card></g> : null; })}
    <g transform={`translate(540 420) scale(${pop(f, 32)})`}><Big x={0} y={0} size={140} color={C.yellow}>~9</Big></g>
  </Scene>
);
export const k16: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <path d="M100 900 L980 900" stroke={C.line} strokeWidth={14} strokeLinecap="round" />
    <path d={`M120 900 L${mix(120, 960, ramp(f, 4, 40, move))} 900`} stroke={C.yellow} strokeWidth={40} strokeLinecap="round" opacity={0.8} />
    <g transform={`translate(540 520) scale(${pop(f, 8)})`}><Big x={0} y={0} size={100}>3,000 YEARS</Big></g>
  </Scene>
);
export const k17: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <path d="M100 900 L980 900" stroke={C.line} strokeWidth={14} strokeLinecap="round" />
    <path d="M120 900 L960 900" stroke={C.yellow} strokeWidth={40} strokeLinecap="round" opacity={0.8} />
    <g transform={`translate(930 900) scale(${pop(f, 8)})`}><circle cx={0} cy={0} r={30} fill={C.red} stroke={C.line} strokeWidth={8} /><Ink x={-20} y={-60} size={44}>Cleopatra</Ink></g>
    <g transform={`translate(540 520) scale(${pop(f, 16)})`}><Big x={0} y={0} size={110} color={C.yellow}>THE VERY END</Big></g>
  </Scene>
);
export const k18: React.FC<ShotProps> = ({ f }) => <Scene f={f}><ZeroCard f={f} label="PYRAMID → CLEOPATRA" value="2,500" /></Scene>;
export const k19: React.FC<ShotProps> = ({ f }) => <Scene f={f}><ZeroCard f={f} label="CLEOPATRA → YOU" value="2,000" color={C.yellow} /></Scene>;
/** The loop: back to the opening (wrong) version — Cleopatra building a pyramid. */
export const k20: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f + 5}>
    <Desert f={f} />
    <Bean x={540} y={FEET} s={1.5} {...CLEO} face="smug" armR={110} armL={20} holdR={<g transform="translate(0 -20)"><path d="M-40 30 L0 -40 L40 30 Z" fill="#E3C489" stroke={C.line} strokeWidth={7} strokeLinejoin="round" /></g>} />
  </Scene>
);

export const SHOT_VIEWS: Record<string, React.FC<ShotProps>> = { k01, k02, k03, k04, k05, k06, k07, k08, k09, k10, k11, k12, k13, k14, k15, k16, k17, k18, k19, k20 };
void Book; void Rays;
