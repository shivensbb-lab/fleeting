import React from "react";
import { Bean } from "../ui/Bean";
import { Big, Book, C, Card, FEET, HORIZON, Ink, LW, Night, Parchment, Scene, ShotProps, Stamp, Timber, ZeroCard, mix, move, pop, ramp, wob } from "./kit";

const REVERE = { coat: "#3D5A80", hat: "tricorn" as const };
const REDCOAT = { coat: C.red, hat: "tricorn" as const };
const Horse: React.FC<{ x: number; y: number; s?: number; f: number; rider?: React.ReactNode; color?: string }> = ({ x, y, s = 1, f, rider, color = "#8C5A34" }) => {
  const g = Math.sin(f / 2.2);
  return (
    <g transform={`translate(${x} ${y + Math.abs(g) * -12}) scale(${s})`}>
      {[[-110, 1], [-70, -1], [80, 1], [120, -1]].map(([lx, ph], i) => <path key={i} d={`M${lx} -150 L${Number(lx) + g * Number(ph) * 30} -10`} stroke={C.line} strokeWidth={26} strokeLinecap="round" />)}
      {[[-110, 1], [-70, -1], [80, 1], [120, -1]].map(([lx, ph], i) => <path key={`c${i}`} d={`M${lx} -150 L${Number(lx) + g * Number(ph) * 30} -10`} stroke={color} strokeWidth={12} strokeLinecap="round" />)}
      <ellipse cx={0} cy={-200} rx={170} ry={80} fill={color} stroke={C.line} strokeWidth={LW} />
      <path d="M130 -240 L210 -350 L270 -330 L200 -210 Z" fill={color} stroke={C.line} strokeWidth={LW} strokeLinejoin="round" />
      <path d="M200 -350 L190 -390 L220 -360 Z" fill={color} stroke={C.line} strokeWidth={6} />
      <circle cx={240} cy={-330} r={6} fill={C.line} />
      <path d="M-170 -220 C -230 -200 -230 -120 -200 -90" stroke={C.line} strokeWidth={14} fill="none" strokeLinecap="round" />
      {rider ? <g transform="translate(-10 -150)">{rider}</g> : null}
    </g>
  );
};
const Road: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <Night f={f} />
    <circle cx={850} cy={300} r={80} fill="#F6F1D8" stroke={C.line} strokeWidth={LW} />
    {[0, 1, 2, 3].map((k) => { const x = ((k * 360 - f * 14) % 1440 + 1440) % 1440 - 180; return <g key={k}><rect x={x - 12} y={HORIZON - 260} width={24} height={260} fill="#2A2C30" /><circle cx={x} cy={HORIZON - 300} r={100} fill="#2E3B2E" stroke={C.line} strokeWidth={8} /></g>; })}
  </g>
);
const ridePose = (f: number, shout = true) => (
  <>
    <Road f={f} />
    <Horse x={520} y={FEET} s={1.0} f={f} rider={<Bean x={0} y={0} s={0.85} {...REVERE} face={shout ? "panic" : "deadpan"} armR={160} armL={30} />} />
    {shout ? <g transform={`translate(700 420) scale(${pop(f, 6)})`}>
      <path d="M-300 -110 L300 -110 L300 80 L-80 80 L-200 170 L-160 80 L-300 80 Z" fill={C.white} stroke={C.line} strokeWidth={10} strokeLinejoin="round" />
      <Ink x={0} y={-20} size={54}>THE BRITISH</Ink><Ink x={0} y={44} size={54}>ARE COMING!</Ink>
    </g> : null}
  </>
);

export const r01: React.FC<ShotProps> = ({ f }) => <Scene f={f}>{ridePose(f)}</Scene>;
export const r02: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    {ridePose(f)}
    <Stamp f={f} a={12} x={540} y={700} text="NEVER SAID" size={110} />
  </Scene>
);
export const r03: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Road f={f} />
    <Horse x={520} y={FEET} s={0.8} f={f} rider={<Bean x={0} y={0} s={0.85} {...REVERE} face="deadpan" armR={30} armL={30} />} />
    <g transform={`translate(540 330) scale(${mix(1.3, 1, pop(f, 2, 6))}) translate(-540 -330)`}>
      <Big x={540} y={290} size={120}>PAUL REVERE</Big>
      <Big x={540} y={410} size={84} color={C.yellow}>THE MIDNIGHT RIDE</Big>
    </g>
  </Scene>
);
export const r04: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    {ridePose(f, false)}
    <Stamp f={f} a={14} x={540} y={420} text="TOP SECRET" size={110} />
  </Scene>
);
export const r05: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Road f={f * 0} />
    {[220, 540, 860].map((x, i) => <Bean key={x} x={x} y={FEET} s={1.1} {...REDCOAT} face="angry" armR={40 + wob(f + i * 6, 6, 10)} armL={20}
      holdR={<path d="M0 0 L20 -180" stroke={C.beam} strokeWidth={12} strokeLinecap="round" />} />)}
  </Scene>
);
export const r06: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Road f={f} />
    <Horse x={360} y={FEET} s={0.8} f={f} rider={<Bean x={0} y={0} s={0.85} {...REVERE} face="panic" armR={160} armL={30} />} />
    <Bean x={860} y={FEET} s={1.1} {...REDCOAT} face="angry" armR={150} armL={20} flip />
    <g transform={`translate(860 480) scale(${pop(f, 12)})`}><Big x={0} y={0} size={160}>!</Big></g>
  </Scene>
);
export const r07: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <rect x={0} y={0} width={1080} height={1920} fill="#C7D3D6" />
    <rect x={0} y={HORIZON} width={1080} height={770} fill="#8B9767" stroke={C.line} strokeWidth={LW} />
    {[180, 400, 620, 840].map((x, i) => <Bean key={x} x={x} y={FEET} s={0.9} coat={i % 2 ? C.red : "#3D5A80"} hat="tricorn" face="happy" armL={20} armR={20} />)}
    <g transform={`translate(540 480) scale(${pop(f, 10)})`}><Big x={0} y={0} size={120} color={C.yellow}>ALL BRITISH</Big></g>
  </Scene>
);
export const r08: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <rect x={0} y={0} width={1080} height={1920} fill="#C7D3D6" />
    <rect x={0} y={HORIZON} width={1080} height={770} fill="#8B9767" stroke={C.line} strokeWidth={LW} />
    {[260, 540, 820].map((x) => <Bean key={x} x={x} y={FEET} s={1.1} coat="#3D5A80" hat="tricorn" face="deadpan" armR={-30 + wob(f, 2, 8)} armL={20} />)}
    <g transform={`translate(540 480) scale(${pop(f, 8)})`}><Big x={0} y={0} size={200}>???</Big></g>
  </Scene>
);
export const r09: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    {ridePose(f, false)}
    <g transform={`translate(640 440) scale(${pop(f, 8)})`}>
      <path d="M-320 -110 L320 -110 L320 80 L-80 80 L-200 170 L-160 80 L-320 80 Z" fill={C.white} stroke={C.line} strokeWidth={10} strokeLinejoin="round" />
      <Ink x={0} y={-20} size={50}>The Regulars are</Ink><Ink x={0} y={44} size={50}>coming out.</Ink>
    </g>
  </Scene>
);
export const r10: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <Bean x={540} y={FEET} s={1.5} {...REDCOAT} face="angry" armR={40} armL={20} holdR={<path d="M0 0 L20 -180" stroke={C.beam} strokeWidth={12} strokeLinecap="round" />} />
    <g transform={`translate(540 420) scale(${pop(f, 8)})`}><Big x={0} y={0} size={120} color={C.yellow}>= REGULARS</Big></g>
  </Scene>
);
const ThreeRiders: React.FC<{ f: number; show: number; caught?: boolean; win?: boolean }> = ({ f, show, caught, win }) => (
  <>
    <Road f={f} />
    <Horse x={300} y={FEET - 140} s={0.55} f={f} rider={<Bean x={0} y={0} s={0.85} {...REVERE} face={caught ? "panic" : "deadpan"} armR={30} armL={30} />} />
    {show >= 2 ? <Horse x={700} y={FEET - 60} s={0.55} f={f + 7} color="#5A4232" rider={<Bean x={0} y={0} s={0.85} coat="#5E7A4A" hat="tricorn" face="deadpan" armR={30} armL={30} />} /> : null}
    {show >= 3 ? <Horse x={480} y={FEET + 120} s={0.6} f={f + 3} color="#B08A5A" rider={<Bean x={0} y={0} s={0.85} coat="#7E4A8C" hat="tricorn" face={win ? "happy" : "deadpan"} armR={win ? 160 : 30} armL={30} />} /> : null}
  </>
);
export const r11: React.FC<ShotProps> = ({ f }) => <Scene f={f}><ThreeRiders f={f} show={pop(f, 14) > 0 ? 2 : 1} /></Scene>;
export const r12: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}><ThreeRiders f={f} show={2} /><g transform={`translate(700 560) scale(${pop(f, 6)})`}><Big x={0} y={0} size={90} color={C.yellow}>DAWES</Big></g></Scene>
);
export const r13: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Road f={f * 0} />
    <Bean x={400} y={FEET} s={1.2} {...REVERE} face="panic" armL={150} armR={150} />
    {[640, 860].map((x) => <Bean key={x} x={x} y={FEET} s={1.2} {...REDCOAT} face="smug" armR={60} armL={20} flip />)}
    <Stamp f={f} a={14} x={540} y={460} text="CAUGHT" size={130} />
  </Scene>
);
export const r14: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}><ThreeRiders f={f} show={3} caught win /><g transform={`translate(480 640) scale(${pop(f, 10)})`}><Big x={0} y={0} size={90} color={C.yellow}>PRESCOTT</Big></g></Scene>
);
export const r15: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Road f={f} />
    <Bean x={540} y={FEET} s={1.5} {...REVERE} face="deadpan" armR={-40 + wob(f, 2, 10)} armL={20} />
    <g transform={`translate(800 520) scale(${pop(f, 6)})`}><Big x={0} y={0} size={220}>?</Big></g>
  </Scene>
);
export const r16: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <Book x={540} y={760} s={1.5} open={1} />
    <g transform={`translate(540 760) scale(${pop(f, 6)})`}><Ink x={0} y={0} size={56} serif>"Listen, my children..."</Ink></g>
    <g transform={`translate(540 400) scale(${pop(f, 16)})`}><Big x={0} y={0} size={150} color={C.yellow}>1861</Big></g>
  </Scene>
);
export const r17: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Timber />
    <Bean x={300} y={FEET} s={1.3} coat="#5D6470" beard="#E9E6DE" face="happy" armR={100 + wob(f, 1.6, 10)} armL={20} holdR={<path d="M0 0 L40 -70" stroke={C.line} strokeWidth={10} strokeLinecap="round" />} />
    <g transform={`translate(760 780) scale(${pop(f, 10)})`}>
      <Card x={0} y={0} w={380} h={460} fill={C.parchment}>
        <g transform="translate(0 180) scale(0.55)"><Bean x={0} y={0} s={1} {...REVERE} face="happy" armR={160} armL={30} /></g>
        <Ink x={0} y={-160} size={50}>HERO!</Ink>
      </Card>
    </g>
  </Scene>
);
export const r18: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    {[[320, "#5E7A4A"], [760, "#7E4A8C"]].map(([x, c], i) => (
      <g key={i}>
        <Bean x={Number(x)} y={FEET} s={1.3} coat={String(c)} hat="tricorn" face="deadpan" armL={20} armR={20} />
        {pop(f, 10 + i * 8) > 0 ? <path d={`M${Number(x) - 120} ${FEET - 520} L${Number(x) + 120} ${FEET - 100} M${Number(x) + 120} ${FEET - 520} L${Number(x) - 120} ${FEET - 100}`} stroke={C.red} strokeWidth={20} strokeLinecap="round" opacity={pop(f, 10 + i * 8)} /> : null}
      </g>
    ))}
    <g transform={`translate(540 400) scale(${pop(f, 4)})`}><Big x={0} y={0} size={110} color={C.yellow}>LEFT OUT</Big></g>
  </Scene>
);
export const r19: React.FC<ShotProps> = ({ f }) => <Scene f={f}><ZeroCard f={f} label="TIMES HE SHOUTED" /></Scene>;
/** The loop: back to the opening (wrong) version. */
export const r20: React.FC<ShotProps> = ({ f }) => <Scene f={f + 5}>{ridePose(f)}</Scene>;

export const SHOT_VIEWS: Record<string, React.FC<ShotProps>> = { r01, r02, r03, r04, r05, r06, r07, r08, r09, r10, r11, r12, r13, r14, r15, r16, r17, r18, r19, r20 };
void Timber; void move; void ramp;
