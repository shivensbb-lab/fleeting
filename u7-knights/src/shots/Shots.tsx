import React from "react";
import { Bean } from "../ui/Bean";
import { Big, C, Card, FEET, Field, HORIZON, Ink, LW, Parchment, Rays, Scene, ShotProps, Stamp, Timber, ZeroCard, mix, move, pop, ramp, wob } from "./kit";

const STEEL = "#AEB4BC";
const KNIGHT = { coat: STEEL, hat: "helm" as const };
const SADDLE = FEET - 330; // where a rider's feet go

const Horse: React.FC<{ x: number; y?: number; s?: number; flip?: boolean; trot?: number }> = ({ x, y = FEET, s = 1, flip, trot = 0 }) => {
  const leg = (lx: number, ph: number) => (
    <g>
      <path d={`M${lx} -190 L${lx + Math.sin(trot + ph) * 22} -10`} stroke={C.line} strokeWidth={36} strokeLinecap="round" />
      <path d={`M${lx} -190 L${lx + Math.sin(trot + ph) * 22} -10`} stroke="#8B5A2E" strokeWidth={20} strokeLinecap="round" />
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      {leg(-150, 0)}{leg(-100, Math.PI)}{leg(110, Math.PI)}{leg(160, 0)}
      <path d="M-200 -210 C -240 -280 -200 -330 -140 -330 L140 -330 C 200 -330 230 -280 210 -210 C 190 -170 -180 -170 -200 -210 Z" fill="#8B5A2E" stroke={C.line} strokeWidth={LW} strokeLinejoin="round" />
      <path d="M150 -310 C 180 -400 210 -450 250 -470 L300 -430 C 270 -400 240 -340 210 -260 Z" fill="#8B5A2E" stroke={C.line} strokeWidth={LW} strokeLinejoin="round" />
      <path d="M240 -480 C 280 -500 350 -470 360 -430 C 364 -410 340 -400 320 -404 L270 -410 C 250 -420 236 -450 240 -480 Z" fill="#8B5A2E" stroke={C.line} strokeWidth={LW} strokeLinejoin="round" />
      <path d="M244 -486 L256 -520 L270 -488" fill="#8B5A2E" stroke={C.line} strokeWidth={7} strokeLinejoin="round" />
      <circle cx={300} cy={-458} r={7} fill={C.line} />
      <path d="M170 -320 C 200 -400 230 -440 250 -470" stroke="#3A2A1E" strokeWidth={18} fill="none" strokeLinecap="round" />
      <path d="M-200 -250 C -250 -230 -260 -170 -250 -130" stroke="#3A2A1E" strokeWidth={22} fill="none" strokeLinecap="round" />
      <path d="M-90 -332 L90 -332 L70 -230 L-70 -230 Z" fill={C.red} stroke={C.line} strokeWidth={8} strokeLinejoin="round" />
      <path d="M-70 -270 L70 -270" stroke={C.yellow} strokeWidth={10} />
    </g>
  );
};
const Crane: React.FC<{ x: number; rope: number }> = ({ x, rope }) => (
  <g transform={`translate(${x} 0)`}>
    <path d={`M-260 ${HORIZON + 10} L-220 260 M260 ${HORIZON + 10} L220 260`} stroke={C.line} strokeWidth={50} strokeLinecap="round" />
    <path d={`M-260 ${HORIZON + 10} L-220 260 M260 ${HORIZON + 10} L220 260`} stroke={C.beam} strokeWidth={32} strokeLinecap="round" />
    <rect x={-260} y={230} width={520} height={56} fill={C.beam} stroke={C.line} strokeWidth={LW} />
    <circle cx={0} cy={300} r={36} fill="#9AA0A8" stroke={C.line} strokeWidth={8} />
    <path d={`M0 300 L0 ${rope}`} stroke="#C8A77A" strokeWidth={12} />
    <path d={`M0 300 L0 ${rope}`} stroke={C.line} strokeWidth={3} strokeDasharray="8 8" />
    <path d={`M0 ${rope} C -60 ${rope + 10} -70 ${rope + 70} -50 ${rope + 100} M0 ${rope} C 60 ${rope + 10} 70 ${rope + 70} 50 ${rope + 100}`} stroke="#C8A77A" strokeWidth={10} fill="none" />
    <path d={`M250 600 L320 600 L320 700`} stroke={C.line} strokeWidth={10} fill="none" />
    <circle cx={320} cy={720} r={30} fill="#9AA0A8" stroke={C.line} strokeWidth={8} />
  </g>
);
/** knight hanging from the crane over a horse; k = 0 up high, 1 seated */
const craned = (f: number, k: number) => {
  const feet = mix(SADDLE - 360, SADDLE + 40, k);
  const top = feet - 380 * 1.0;
  return (
    <>
      <Field f={f} />
      <Horse x={560} />
      <Crane x={560} rope={top + 20} />
      <Bean x={560} y={feet} s={1.0} {...KNIGHT} armL={160} armR={160} legs={10 + wob(f, 3, 8)} />
      <Bean x={900} y={FEET} s={0.95} coat="#5E7A4A" hair face="angry" flip armR={140} armL={140} />
    </>
  );
};

export const b01: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    {craned(f, ramp(f, 4, 60, move))}
    <g transform={`translate(540 160) scale(${pop(f, 20)})`}><Big x={0} y={0} size={100} color={C.yellow}>A CRANE?!</Big></g>
  </Scene>
);
const Turtle: React.FC<{ f: number }> = ({ f }) => (
  <g transform={`translate(540 ${FEET - 600}) rotate(180)`}>
    <Bean x={0} y={-150} s={1.2} {...KNIGHT} armL={140 + wob(f, 2, 20)} armR={140 - wob(f, 2, 20)} legs={30 + wob(f, 2, 12)} />
  </g>
);
export const b02: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Field f={f} />
    <Turtle f={f} />
    <g transform={`translate(540 330) scale(${pop(f, 14)})`}><Big x={0} y={0} size={110} color={C.yellow}>STUCK!</Big></g>
  </Scene>
);
export const b03: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    {craned(f, 0.5)}
    <Stamp f={f} a={4} x={540} y={160} text="NOT EVEN CLOSE" size={90} />
  </Scene>
);
export const b04: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Field f={f} />
    <Bean x={540} y={FEET} s={1.2} {...KNIGHT} />
    <g transform={`translate(540 330) scale(${mix(1.3, 1, pop(f, 2, 6))}) translate(-540 -330)`}>
      <Big x={540} y={290} size={150}>KNIGHTS</Big>
      <Big x={540} y={410} size={90} color={C.yellow}>THE CRANE MYTH</Big>
    </g>
  </Scene>
);
const Scale: React.FC<{ f: number; label: string }> = ({ f, label }) => (
  <g transform="translate(540 1000)">
    <rect x={-200} y={-40} width={400} height={80} rx={14} fill="#D2C5AA" stroke={C.line} strokeWidth={LW} />
    <rect x={-110} y={-20} width={220} height={50} rx={6} fill="#2B3350" stroke={C.line} strokeWidth={6} />
    <Ink x={0} y={20} size={40} color={C.yellow}>{f > 10 ? label : "..."}</Ink>
  </g>
);
export const b05: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Timber />
    <Bean x={540} y={960} s={1.25} {...KNIGHT} armL={30} armR={30} />
    <Scale f={f} label="15-25 KG" />
    <g transform={`translate(540 300) scale(${pop(f, 14)})`}><Big x={0} y={0} size={120} color={C.yellow}>15-25 KG</Big></g>
  </Scene>
);
const SOLDIER = { coat: "#6F7A50", hat: "cap" as const };
const Pack: React.FC = () => <g><rect x={-80} y={-260} width={160} height={190} rx={20} fill="#5E6A40" stroke={C.line} strokeWidth={9} /><path d="M-60 -200 L60 -200" stroke={C.line} strokeWidth={6} /></g>;
export const b06: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Field f={f} />
    <Bean x={300} y={FEET} s={1.2} {...KNIGHT} />
    <g transform={`translate(780 ${FEET}) scale(1.2)`}><g transform="translate(-40 0)"><Pack /></g></g>
    <Bean x={780} y={FEET} s={1.2} {...SOLDIER} face="deadpan" />
    <g transform={`translate(540 300) scale(${pop(f, 10)})`}><Big x={0} y={0} size={100} color={C.yellow}>LIGHTER LOAD</Big></g>
  </Scene>
);
export const b07: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <Bean x={540} y={FEET} s={1.6} {...KNIGHT} armL={40} armR={40} />
    {[[540, 640], [400, 860], [680, 860], [490, 1140], [590, 1140]].map(([x, y], k) => pop(f, 4 + k * 4) > 0 ? <circle key={k} cx={x} cy={y} r={30 * pop(f, 4 + k * 4)} fill={C.yellow} stroke={C.line} strokeWidth={6} /> : null)}
    <g transform={`translate(540 280) scale(${pop(f, 26)})`}><Big x={0} y={0} size={100} color={C.yellow}>SPREAD OUT</Big></g>
  </Scene>
);
export const b08: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Field f={f} />
    <Bean x={360} y={FEET} s={0.8} {...KNIGHT} armR={130} holdR={<path d="M0 0 L0 -160" stroke={C.beam} strokeWidth={16} strokeLinecap="round" />} />
    <Bean x={700} y={FEET} s={1.2} coat="#5E7A4A" hair beard="#C9C3B4" face="happy" flip armR={110} />
    <g transform={`translate(540 300) scale(${pop(f, 10)})`}><Big x={0} y={0} size={100} color={C.yellow}>TRAINING</Big></g>
  </Scene>
);
export const b09: React.FC<ShotProps> = ({ f }) => {
  const ph = Math.floor(f / 14) % 3;
  return (
    <Scene f={f}>
      <Field f={f} />
      {ph === 0 ? <Bean x={mix(200, 880, (f % 14) / 14)} y={FEET - Math.abs(Math.sin(f / 2)) * 30} s={1.2} {...KNIGHT} armL={60} armR={60} legs={10 + wob(f, 1, 26)} /> : null}
      {ph === 1 ? <g transform={`translate(540 ${FEET - 200}) rotate(${(f % 14) * 26})`}><Bean x={0} y={200} s={1.2} {...KNIGHT} armL={150} armR={150} /></g> : null}
      {ph === 2 ? <Bean x={540} y={FEET} s={1.2} {...KNIGHT} armL={160} armR={160} /> : null}
      <g transform="translate(540 300)"><Big x={0} y={0} size={110} color={C.yellow}>{["RUN", "ROLL", "UP!"][ph]}</Big></g>
    </Scene>
  );
};
export const b10: React.FC<ShotProps> = ({ f }) => {
  const k = ramp(f, 6, 28, move);
  const jump = Math.sin(k * Math.PI) * 160;
  return (
    <Scene f={f}>
      <Field f={f} />
      <Horse x={600} />
      <Bean x={mix(260, 600, k)} y={mix(FEET, SADDLE + 40, k) - jump} s={1.0} {...KNIGHT} armL={mix(30, 150, k)} armR={mix(30, 150, k)} legs={10} />
      <Stamp f={f} a={32} x={540} y={300} text="NO CRANE" size={110} color="#3E8E4E" rot={-4} />
    </Scene>
  );
};
export const b11: React.FC<ShotProps> = ({ f }) => {
  const k = ramp(f, 4, 22, move);
  const jump = Math.sin(k * Math.PI) * 300;
  return (
    <Scene f={f}>
      <Field f={f} />
      <Rays f={f} x={600} y={600} o={0.25} />
      <Horse x={600} />
      <Bean x={mix(200, 600, k)} y={mix(FEET, SADDLE + 40, k) - jump} s={1.0} {...KNIGHT} armL={160} armR={160} legs={k < 1 ? 36 : 10} />
      <g transform={`translate(540 280) scale(${pop(f, 24)})`}><Big x={0} y={0} size={110} color={C.yellow}>LEAP!</Big></g>
    </Scene>
  );
};
export const b12: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    {craned(f, 0.2)}
    <g transform={`translate(860 300) scale(${pop(f, 8)})`}><Big x={0} y={0} size={160} color={C.yellow}>?</Big></g>
  </Scene>
);
const Cinema: React.FC<{ f: number; children: React.ReactNode }> = ({ f, children }) => (
  <g>
    <rect x={0} y={0} width={1080} height={1920} fill="#2A2228" />
    <rect x={70} y={300} width={940} height={760} fill="#F3EFE4" stroke={C.line} strokeWidth={LW} />
    <svg x={80} y={310} width={920} height={740} viewBox="80 300 920 760"><g filter="url(#bw)">{children}</g></svg>
    <defs><filter id="bw"><feColorMatrix type="saturate" values={String(0.05 + 0.02 * wob(f, 3))} /></filter></defs>
    {Array.from({ length: 6 }, (_, k) => <circle key={k} cx={180 + k * 150} cy={1200} r={70} fill="#1A1418" stroke={C.line} strokeWidth={6} />)}
    <rect x={0} y={1180} width={1080} height={200} fill="#1A1418" />
  </g>
);
export const b13: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Cinema f={f}>{craned(f, ramp(f, 4, 60))}</Cinema>
    <g transform={`translate(540 200) scale(${pop(f, 6)})`}><Big x={0} y={0} size={110} color={C.yellow}>HENRY V (1944)</Big></g>
  </Scene>
);
export const b14: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Cinema f={f}>{craned(f, ramp(f, 0, 50, move))}</Cinema>
    <g transform={`translate(540 200) scale(${pop(f, 6)})`}><Big x={0} y={0} size={100} color={C.yellow}>ROPES!</Big></g>
  </Scene>
);
export const b15: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <rect x={0} y={0} width={1080} height={1920} fill="#2A2228" />
    {[160, 360, 560, 760, 940].map((x, i) => <Bean key={x} x={x} y={900} s={0.8} coat={["#3D5A80", "#7E4A8C", "#5E7A4A", "#B8A06A", "#8B4A3A"][i]} hair face="happy" armL={150} armR={150} />)}
    {pop(f, 18) > 0 ? <Bean x={540} y={FEET + 60} s={1.25} coat="#3A3A44" hair beard="#C9C3B4" face="angry" armR={150} holdR={<g transform="translate(0 -20) scale(0.8)"><rect x={-40} y={-50} width={80} height={100} fill={C.white} stroke={C.line} strokeWidth={6} /></g>} /> : null}
    <Stamp f={f} a={22} x={540} y={300} text="HISTORIANS: NO" size={80} />
  </Scene>
);
const Joust: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <Field f={f} />
    <rect x={0} y={HORIZON - 80} width={1080} height={50} fill={C.yellow} stroke={C.line} strokeWidth={8} />
    {Array.from({ length: 6 }, (_, k) => <rect key={k} x={k * 200 + 40} y={HORIZON - 120} width={30} height={100} fill={C.beam} stroke={C.line} strokeWidth={6} />)}
  </g>
);
export const b16: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Joust f={f} />
    <Horse x={560} trot={f / 3} />
    <Bean x={560} y={SADDLE + 40} s={1.15} coat="#8C9098" hat="helm" armR={90} legs={10} holdR={<g transform="rotate(-90)"><path d="M0 0 L0 -420" stroke={C.line} strokeWidth={30} strokeLinecap="round" /><path d="M0 0 L0 -420" stroke={C.white} strokeWidth={16} strokeLinecap="round" /></g>} />
    <Stamp f={f} a={14} x={540} y={300} text="FOR SPORT" size={110} color={C.beam} rot={-3} />
  </Scene>
);
export const b17: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Joust f={f} />
    <Horse x={560} />
    <Bean x={mix(250, 560, ramp(f, 4, 22, move))} y={mix(FEET, SADDLE + 40, ramp(f, 4, 22, move)) - Math.sin(ramp(f, 4, 22) * Math.PI) * 120} s={1.0} {...KNIGHT} armL={140} armR={140} legs={10} />
    <Stamp f={f} a={20} x={540} y={300} text="NO CRANES" size={110} color="#3E8E4E" rot={-4} />
  </Scene>
);
export const b18: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Field f={f} />
    <g transform={`translate(540 ${FEET - 200}) rotate(${wob(f, 4, 10)}) translate(-540 ${-FEET + 200})`}>
      <Bean x={540} y={FEET} s={1.4} {...KNIGHT} armL={60 + wob(f, 3, 50)} armR={60 - wob(f, 3, 50)} legs={22 + wob(f, 3, 14)} />
    </g>
    <Stamp f={f} a={14} x={540} y={300} text="BUILT TO MOVE" size={100} color="#3E8E4E" rot={-3} />
  </Scene>
);
export const b19: React.FC<ShotProps> = ({ f }) => <Scene f={f}><ZeroCard f={f} label="CRANE LIFTS" /></Scene>;
/** The loop: back to the opening (wrong) version. */
export const b20: React.FC<ShotProps> = ({ f }) => <Scene f={f + 5}>{craned(f, ramp(f, 4, 60, move))}</Scene>;

export const SHOT_VIEWS: Record<string, React.FC<ShotProps>> = { b01, b02, b03, b04, b05, b06, b07, b08, b09, b10, b11, b12, b13, b14, b15, b16, b17, b18, b19, b20 };
