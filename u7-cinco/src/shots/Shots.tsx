import React from "react";
import { Bean } from "../ui/Bean";
import { Big, C, Card, FEET, Field, HORIZON, Ink, LW, Parchment, Rays, Scene, ShotProps, Stamp, Street, ZeroCard, mix, move, pop, ramp, wob } from "./kit";

const MX = { coat: "#3D5A80", hat: "cap" as const };
const FR = { coat: "#2E3F73", hat: "shako" as const };
const Flag: React.FC<{ x: number; y: number; s?: number; kind: "mx" | "fr"; f: number }> = ({ x, y, s = 1, kind, f }) => {
  const cols = kind === "mx" ? ["#3E8E4E", C.white, C.red] : ["#2E4FA0", C.white, C.red];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0 L0 -420" stroke={C.beam} strokeWidth={14} strokeLinecap="round" />
      {cols.map((c, i) => <path key={i} d={`M${i * 70} -420 q35 ${wob(f + i * 4, 4, 8)} 70 0 L${70 + i * 70} -280 q-35 ${wob(f + i * 4, 4, 8)} -70 0 Z`} fill={c} stroke={C.line} strokeWidth={7} />)}
      {kind === "mx" ? <circle cx={105} cy={-350} r={18} fill="#9C6B3E" stroke={C.line} strokeWidth={5} /> : null}
    </g>
  );
};
const Cal: React.FC<{ f: number; month: string; day: string; color?: string; t0?: number }> = ({ f, month, day, color = C.red, t0 = 6 }) => (
  <Card x={540} y={760} w={560} h={600} rot={-3}>
    <rect x={-280} y={-300} width={560} height={130} fill={color} stroke={C.line} strokeWidth={10} />
    <Ink x={0} y={-215} size={60} color={C.white}>{month}</Ink>
    <g transform={`scale(${pop(f, t0)})`}><Big x={0} y={110} size={260} color={C.yellow}>{day}</Big></g>
  </Card>
);
const partyPose = (f: number) => (
  <>
    <Street f={f} />
    {Array.from({ length: 8 }, (_, k) => <path key={k} d={`M${k * 140} 380 L${k * 140 + 70} 460 L${k * 140 + 140} 380 Z`} fill={["#3E8E4E", C.white, C.red][k % 3]} stroke={C.line} strokeWidth={5} />)}
    <path d="M0 380 L1080 380" stroke={C.line} strokeWidth={5} />
    <Bean x={300} y={FEET} s={1.2} coat="#E07A3C" hat="none" face="happy" armL={150 + wob(f, 3, 10)} armR={150 - wob(f, 3, 10)} />
    <Bean x={760} y={FEET} s={1.2} coat="#3D6E8C" hat="none" face="happy" armL={150 - wob(f, 3, 10)} armR={150 + wob(f, 3, 10)} />
    <g transform={`translate(540 640) scale(${pop(f, 6)})`}><Card x={0} y={0} w={700} h={150} fill={C.yellow}><Ink x={0} y={20} size={50}>HAPPY INDEPENDENCE!</Ink></Card></g>
  </>
);

export const c01: React.FC<ShotProps> = ({ f }) => <Scene f={f}>{partyPose(f)}</Scene>;
export const c02: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    {partyPose(f)}
    <Stamp f={f} a={12} x={540} y={900} text="WRONG DAY" size={110} />
  </Scene>
);
export const c03: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Street f={f} />
    <Bean x={540} y={FEET} s={1.15} coat="#E07A3C" face="deadpan" />
    <g transform={`translate(540 330) scale(${mix(1.3, 1, pop(f, 2, 6))}) translate(-540 -330)`}>
      <Big x={540} y={290} size={130}>CINCO DE MAYO</Big>
      <Big x={540} y={410} size={90} color={C.yellow}>THE MIX-UP</Big>
    </g>
  </Scene>
);
export const c04: React.FC<ShotProps> = ({ f }) => <Scene f={f}><Parchment /><Cal f={f} month="SEPTEMBER" day="16" color="#3E8E4E" /></Scene>;
export const c05: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Field f={f} />
    <g transform="translate(540 760)">
      <rect x={-160} y={-200} width={320} height={420} fill="#E8DCC0" stroke={C.line} strokeWidth={LW} />
      <path d="M-200 -200 L0 -360 L200 -200 Z" fill={C.red} stroke={C.line} strokeWidth={LW} strokeLinejoin="round" />
      <circle cx={0} cy={-260} r={40} fill={C.yellow} stroke={C.line} strokeWidth={8} />
    </g>
    <Bean x={540} y={FEET} s={1.2} coat={C.line} hair face="happy" armR={160} armL={20} />
    <g transform={`translate(540 330) scale(${pop(f, 8)})`}><Big x={0} y={0} size={160} color={C.yellow}>1810</Big></g>
  </Scene>
);
export const c06: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <Cal f={f} month="MAY" day="5" t0={-10} />
    <g transform={`translate(840 400) scale(${pop(f, 8)})`}><Big x={0} y={0} size={200}>?</Big></g>
  </Scene>
);
export const c07: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Field f={f} />
    <Flag x={260} y={FEET} s={0.9} kind="mx" f={f} />
    <Flag x={620} y={FEET} s={0.9} kind="fr" f={f} />
    <g transform={`translate(540 330) scale(${pop(f, 8)})`}><Big x={0} y={0} size={160} color={C.yellow}>1862</Big></g>
  </Scene>
);
export const c08: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Field f={f} />
    {[0, 1, 2, 3].map((i) => <Bean key={i} x={mix(1300, 520 + i * 150, ramp(f, 2 + i * 3, 24 + i * 3, move))} y={FEET} s={1.0} {...FR} face="smug" armR={40} armL={20} holdR={<path d="M0 0 L20 -180" stroke={C.beam} strokeWidth={12} strokeLinecap="round" />} />)}
    <Flag x={160} y={FEET} s={0.8} kind="fr" f={f} />
  </Scene>
);
export const c09: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Field f={f} />
    <Rays f={f} x={540} y={900} o={0.25} />
    {[300, 540, 780].map((x) => <Bean key={x} x={x} y={FEET} s={1.2} {...FR} face="smug" armR={40} armL={20} holdR={<path d="M0 0 L20 -180" stroke={C.beam} strokeWidth={12} strokeLinecap="round" />} />)}
    <g transform={`translate(540 380) scale(${pop(f, 10)})`}><Big x={0} y={0} size={110} color={C.yellow}>WORLD CLASS</Big></g>
  </Scene>
);
export const c10: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Field f={f} />
    <g transform="translate(540 700)"><rect x={-200} y={-120} width={400} height={240} fill="#E8DCC0" stroke={C.line} strokeWidth={LW} /><path d="M-240 -120 L0 -240 L240 -120 Z" fill={C.slate} stroke={C.line} strokeWidth={LW} strokeLinejoin="round" /><Ink x={0} y={20} size={56}>PUEBLA</Ink></g>
    {[220, 400].map((x) => <Bean key={x} x={x} y={FEET} s={1.0} {...MX} face="happy" armR={150} armL={150} />)}
    {[700, 880].map((x) => <Bean key={x} x={mix(x, x + 400, ramp(f, 10, 34, move))} y={FEET} s={1.0} {...FR} face="panic" armL={150} armR={150} flip />)}
  </Scene>
);
export const c11: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <rect x={160} y={1100} width={760} height={10} fill={C.line} />
    <rect x={300} y={1100 - 300 * pop(f, 2, 10)} width={180} height={300 * pop(f, 2, 10)} fill="#3E8E4E" stroke={C.line} strokeWidth={10} />
    <rect x={600} y={1100 - 520 * pop(f, 2, 10)} width={180} height={520 * pop(f, 2, 10)} fill="#2E4FA0" stroke={C.line} strokeWidth={10} />
    <Ink x={390} y={1170} size={44}>MEXICO</Ink><Ink x={690} y={1170} size={44}>FRANCE</Ink>
    <Stamp f={f} a={16} x={390} y={600} text="WON" size={110} color="#3E8E4E" />
  </Scene>
);
export const c12: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Street f={f} />
    {[0, 1, 2].map((i) => <Bean key={i} x={mix(1300, 360 + i * 180, ramp(f, 2 + i * 3, 24 + i * 3, move))} y={FEET} s={1.0} {...FR} face="smug" armR={40} armL={20} />)}
    <g transform={`translate(540 380) scale(${pop(f, 24)})`}><Big x={0} y={0} size={140} color={C.yellow}>1863</Big></g>
  </Scene>
);
export const c13: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <Rays f={f} x={540} y={800} o={0.35} />
    <g transform={`translate(400 ${FEET}) scale(${pop(f, 4)})`}><Flag x={0} y={0} s={1.2} kind="mx" f={f} /></g>
    <g transform={`translate(540 380) scale(${pop(f, 14)})`}><Big x={0} y={0} size={130} color={C.yellow}>SYMBOL</Big></g>
  </Scene>
);
export const c14: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Street f={f} />
    {[200, 380, 560, 740, 900].map((x, i) => <Bean key={x} x={x} y={FEET} s={0.9} {...MX} face="happy" armR={30} armL={20} holdR={i === 2 ? <g transform="scale(0.4)"><Flag x={0} y={0} kind="mx" f={f} /></g> : undefined} />)}
    <g transform={`translate(540 380) scale(${pop(f, 10)})`}><Big x={0} y={0} size={130} color={C.yellow}>PUEBLA</Big></g>
  </Scene>
);
export const c15: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Street f={f} />
    {Array.from({ length: 2 }, (_, r) => Array.from({ length: 5 }, (_, k) => <Bean key={`${r}${k}`} x={120 + k * 210 + r * 60} y={FEET - 40 + r * 160 - Math.abs(wob(f + k * 5 + r * 7, 2.2, 12))} s={0.65} coat={["#E07A3C", "#3D6E8C", "#3E8E4E", C.red, "#7E4A8C"][(k + r) % 5]} hat="none" face="happy" armL={150} armR={150} />))}
    <g transform={`translate(540 380) scale(${pop(f, 10)})`}><Big x={0} y={0} size={140} color={C.yellow}>USA</Big></g>
  </Scene>
);
export const c16: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Street f={f} />
    {[300, 540, 780].map((x, i) => <Bean key={x} x={x} y={FEET} s={1.1} coat={["#3E8E4E", "#7E4A8C", "#3D6E8C"][i]} hair face="happy" armR={i === 1 ? 160 : 30} armL={20}
      holdR={i === 1 ? <g><path d="M0 0 L0 -200" stroke={C.beam} strokeWidth={10} /><rect x={-10} y={-200} width={200} height={110} fill={C.white} stroke={C.line} strokeWidth={8} /><text x={90} y={-132} textAnchor="middle" fontFamily="Inter Tight" fontWeight={900} fontSize={40} fill={C.line}>PRIDE</text></g> : undefined} />)}
  </Scene>
);
export const c17: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <rect x={0} y={0} width={1080} height={1920} fill="#2A2530" />
    <rect x={90} y={360} width={900} height={560} fill={C.yellow} stroke={C.line} strokeWidth={14} />
    <Ink x={540} y={600} size={90}>BIG SALE!</Ink><Ink x={540} y={720} size={60}>MAY 5TH</Ink>
    {Array.from({ length: 6 }, (_, k) => <circle key={k} cx={180 + k * 144} cy={1100 + (k % 2) * 30} r={48} fill="#4A4250" stroke={C.line} strokeWidth={8} />)}
  </Scene>
);
export const c18: React.FC<ShotProps> = ({ f }) => <Scene f={f}><Parchment /><Cal f={f} month="SEPTEMBER" day="16" color="#3E8E4E" /></Scene>;
export const c19: React.FC<ShotProps> = ({ f }) => <Scene f={f}><ZeroCard f={f} label="MAY 5, 1862" value="WIN" /></Scene>;
/** The loop: back to the opening (wrong) version. */
export const c20: React.FC<ShotProps> = ({ f }) => <Scene f={f + 5}>{partyPose(f)}</Scene>;

export const SHOT_VIEWS: Record<string, React.FC<ShotProps>> = { c01, c02, c03, c04, c05, c06, c07, c08, c09, c10, c11, c12, c13, c14, c15, c16, c17, c18, c19, c20 };
void HORIZON;
