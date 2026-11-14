import React from "react";
import { Bean } from "../ui/Bean";
import { Big, Book, C, Card, Classroom, FEET, Ink, Newspaper, Parchment, Rays, Scene, ShotProps, Stamp, Timber, ZeroCard, Field, mix, move, pop, ramp, wob } from "./kit";

const ALBERT = { coat: "#7A6A58", hat: "einstein" as const, tache: "#E9E6DE" };
const YOUNG = { coat: "#4F6A8A", hair: true };
const Chalk: React.FC<{ x: number; y: number; size: number; children: React.ReactNode; k?: number }> = ({ x, y, size, children, k = 1 }) => (
  <g opacity={k}><text x={x} y={y} textAnchor="middle" fontFamily="Inter Tight" fontWeight={800} fontSize={size} fill="#EDEFE6">{children}</text></g>
);
const ReportCard: React.FC<{ f: number; grade: string; mark?: number; flip?: number }> = ({ f, grade, mark = 0, flip = 0 }) => (
  <Card x={540} y={760} w={640} h={720} fill={C.white}>
    <rect x={-320} y={-360} width={640} height={120} fill={C.navy} stroke={C.line} strokeWidth={10} />
    <Ink x={0} y={-280} size={56} color={C.white}>REPORT CARD</Ink>
    {["Algebra", "Geometry", "Physics"].map((s, i) => (
      <g key={s}>
        <Ink x={-240} y={-140 + i * 150} size={56} anchor="start">{s}</Ink>
        <g transform={`translate(200 ${-160 + i * 150}) scale(${pop(f, mark + i * 6)})`}><Big x={0} y={20} size={110} color={C.yellow}>{grade}</Big></g>
      </g>
    ))}
    {flip > 0 ? <Ink x={0} y={320} size={40}>6 = best · 1 = worst</Ink> : null}
  </Card>
);
const geniusPose = (f: number) => (
  <>
    <Classroom />
    <Chalk x={540} y={560} size={120}>E = mc²</Chalk>
    <Bean x={540} y={FEET} s={1.5} {...ALBERT} face="smug" armR={130 + wob(f, 3, 6)} armL={20} holdR={<path d="M0 0 L30 -40" stroke="#EDEFE6" strokeWidth={14} strokeLinecap="round" />} />
  </>
);

export const e01: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    {geniusPose(f)}
    <Stamp f={f} a={30} x={540} y={760} text="F" size={200} />
  </Scene>
);
export const e02: React.FC<ShotProps> = ({ f }) => {
  const k = ramp(f, 8, 22, move);
  return (
    <Scene f={f}>
      <Classroom />
      <Chalk x={540} y={560} size={120}>E = mc²</Chalk>
      <Bean x={540} y={FEET} s={1.5} {...ALBERT} face={k > 0.4 ? "angry" : "smug"} armR={k > 0.4 ? 150 : 130} armL={k > 0.4 ? 150 : 20} />
      <g transform={`translate(${mix(560, 1100, k)} ${mix(760, 300, k)}) rotate(${k * 360})`} opacity={1 - k}><Big x={0} y={0} size={200} color={C.red}>F</Big></g>
    </Scene>
  );
};
export const e03: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Classroom />
    <Bean x={540} y={FEET} s={1.15} {...ALBERT} face="deadpan" />
    <g transform={`translate(540 330) scale(${mix(1.3, 1, pop(f, 2, 6))}) translate(-540 -330)`}>
      <Big x={540} y={300} size={140}>EINSTEIN</Big>
      <Big x={540} y={430} size={90} color={C.yellow}>THE MATHS MYTH</Big>
    </g>
  </Scene>
);
export const e04: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Timber />
    <Bean x={330} y={FEET} s={1.2} {...YOUNG} face="happy" armR={110} armL={20} holdR={<g transform="translate(30 -40) rotate(-10)"><Book x={0} y={0} s={0.35} title="Calculus" /></g>} />
    <g transform={`translate(760 640) scale(${pop(f, 6)})`}>
      <Card x={0} y={0} w={420} h={300} fill="#2F4A3A"><Chalk x={0} y={30} size={96}>∫ dx</Chalk></Card>
    </g>
    <g transform={`translate(760 380) scale(${pop(f, 16)})`}><Big x={0} y={0} size={170} color={C.yellow}>15</Big></g>
  </Scene>
);
export const e05: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <Bean x={300} y={FEET} s={1.3} {...ALBERT} face="smug" armL={20} armR={60} />
    <g transform={`translate(700 620) scale(${pop(f, 6)})`}>
      <path d="M-300 -170 L300 -170 L300 140 L-60 140 L-180 230 L-150 140 L-300 140 Z" fill={C.white} stroke={C.line} strokeWidth={10} strokeLinejoin="round" />
      <Ink x={0} y={-60} size={56} serif>"I never failed</Ink><Ink x={0} y={20} size={56} serif>in mathematics."</Ink>
    </g>
  </Scene>
);
export const e06: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Classroom />
    <Bean x={540} y={FEET} s={1.5} {...ALBERT} face="deadpan" armR={-40 + wob(f, 2, 10)} armL={20} />
    <g transform={`translate(800 520) scale(${pop(f, 6)})`}><Big x={0} y={0} size={220}>?</Big></g>
  </Scene>
);
export const e07: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <g transform={`translate(540 ${800 - pop(f, 2, 8) * 40}) rotate(${mix(-20, -3, pop(f, 2, 8))}) scale(${mix(0.4, 1.05, pop(f, 2, 8))})`}>
      <Newspaper x={0} y={0} head="EINSTEIN" sub="FLUNKED MATHS!" />
    </g>
    <g transform={`translate(830 380) scale(${pop(f, 20)})`}><Big x={0} y={0} size={130} color={C.yellow}>1935</Big></g>
  </Scene>
);
export const e08: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Timber />
    <Bean x={540} y={FEET + Math.abs(wob(f, 2, 12))} s={1.5} {...ALBERT} face="happy" armR={110} armL={150 + wob(f, 2, 10)}
      holdR={<g transform="translate(20 -60) rotate(-12) scale(0.35)"><Newspaper x={0} y={0} head="FLUNKED" /></g>} />
    {[0, 1, 2].map((i) => { const k = pop(f, 8 + i * 8); return k > 0 ? <g key={i} transform={`translate(${760 + i * 70} ${520 - i * 90}) scale(${k})`}><Big x={0} y={0} size={90} color={C.yellow}>HA</Big></g> : null; })}
  </Scene>
);
export const e09: React.FC<ShotProps> = ({ f }) => {
  const k = ramp(f, 14, 34, move);
  return (
    <Scene f={f}>
      <Parchment />
      <g transform="translate(540 760)">
        <rect x={-380} y={-90} width={760} height={180} rx={20} fill={C.white} stroke={C.line} strokeWidth={11} />
        <g transform={`scale(${Math.cos(k * Math.PI)} 1)`}>
          <Big x={-200} y={50} size={140} color={k < 0.5 ? C.yellow : C.red}>{k < 0.5 ? "6" : "1"}</Big>
          <Big x={200} y={50} size={140} color={k < 0.5 ? C.red : C.yellow}>{k < 0.5 ? "1" : "6"}</Big>
        </g>
        <path d="M-60 0 L60 0" stroke={C.line} strokeWidth={14} strokeLinecap="round" />
      </g>
      <g transform={`translate(540 480) scale(${pop(f, 4)})`}><Big x={0} y={0} size={110}>FLIPPED?</Big></g>
    </Scene>
  );
};
export const e10: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <Rays f={f} x={540} y={760} o={0.35} />
    <g transform={`translate(540 860) scale(${pop(f, 4)})`}><Big x={0} y={0} size={460} color={C.yellow}>6</Big></g>
    <g transform={`translate(540 420) scale(${pop(f, 14)})`}><Big x={0} y={0} size={110}>= TOP MARK</Big></g>
  </Scene>
);
export const e11: React.FC<ShotProps> = ({ f }) => <Scene f={f}><Parchment /><ReportCard f={f} grade="6" mark={6} flip={1} /></Scene>;
export const e12: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Classroom />
    <Chalk x={540} y={560} size={90}>ENTRANCE EXAM</Chalk>
    <Bean x={540} y={FEET} s={1.2} {...YOUNG} face="panic" armL={150} armR={150} />
    <g transform={`translate(830 380) scale(${pop(f, 14)})`}><Big x={0} y={0} size={170} color={C.yellow}>16</Big></g>
  </Scene>
);
export const e13: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Classroom />
    <Chalk x={540} y={500} size={80}>ZURICH</Chalk>
    <Chalk x={540} y={620} size={80}>POLYTECHNIC</Chalk>
    <Bean x={300} y={FEET} s={0.95} {...YOUNG} face="deadpan" armL={20} armR={20} />
    {[600, 780, 960].map((x, i) => <Bean key={x} x={x} y={FEET} s={1.3} coat={C.slate} hair face="smug" armL={20} armR={20} />)}
    <g transform={`translate(540 320) scale(${pop(f, 14)})`}><Big x={0} y={0} size={96} color={C.yellow}>2 YEARS EARLY</Big></g>
  </Scene>
);
export const e14: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <Card x={540} y={760} w={680} h={720} fill={C.white}>
      {[["Maths", "✓", C.yellow], ["Physics", "✓", C.yellow], ["French", "✗", C.red], ["Chemistry", "✗", C.red]].map(([s, m, c], i) => (
        <g key={s}>
          <Ink x={-260} y={-220 + i * 150} size={60} anchor="start">{s}</Ink>
          <g transform={`translate(220 ${-240 + i * 150}) scale(${pop(f, 6 + i * 8)})`}><Big x={0} y={20} size={100} color={c}>{m}</Big></g>
        </g>
      ))}
    </Card>
  </Scene>
);
export const e15: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Field f={f} />
    <g transform="translate(540 760)">
      <rect x={-330} y={-120} width={660} height={500} fill="#E8E2D2" stroke={C.line} strokeWidth={11} />
      <path d="M-370 -120 L0 -300 L370 -120 Z" fill={C.slate} stroke={C.line} strokeWidth={11} strokeLinejoin="round" />
      {[-220, -110, 0, 110, 220].map((x) => <rect key={x} x={x - 26} y={-80} width={52} height={420} fill="#D6CEB8" stroke={C.line} strokeWidth={8} />)}
    </g>
    <Bean x={540} y={FEET} s={1.2} {...YOUNG} face="happy" armL={150 + wob(f, 3, 10)} armR={150 - wob(f, 3, 10)} />
    <Stamp f={f} a={16} x={540} y={420} text="ACCEPTED" size={100} color="#3E8E4E" />
  </Scene>
);
export const e16: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Timber />
    <Book x={540} y={760} s={1.4} open={1} />
    <g transform={`translate(540 760) scale(${pop(f, 6)})`}>
      <rect x={-340} y={-70} width={680} height={130} fill={C.yellow} opacity={0.8} />
      <Ink x={0} y={20} size={62}>GENIUS FAILS MATHS!</Ink>
    </g>
    {[0, 1, 2].map((i) => { const k = pop(f, 14 + i * 6); return k > 0 ? <g key={i} transform={`translate(${260 + i * 280} 420) scale(${k})`}><Big x={0} y={0} size={110} color={C.yellow}>★</Big></g> : null; })}
  </Scene>
);
export const e17: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Classroom />
    <Chalk x={540} y={560} size={84}>"He failed maths!"</Chalk>
    <Bean x={540} y={FEET} s={1.5} {...ALBERT} face="deadpan" />
    <Stamp f={f} a={14} x={540} y={760} text="STUCK" size={120} />
  </Scene>
);
export const e18: React.FC<ShotProps> = ({ f }) => <Scene f={f}><Parchment /><ReportCard f={f} grade="6" mark={4} /></Scene>;
export const e19: React.FC<ShotProps> = ({ f }) => <Scene f={f}><ZeroCard f={f} label="TIMES FAILED MATHS" /></Scene>;
/** The loop: back to the opening (wrong) version. */
export const e20: React.FC<ShotProps> = ({ f }) => <Scene f={f + 5}>{geniusPose(f)}<Stamp f={f} a={22} x={540} y={760} text="F" size={200} /></Scene>;

export const SHOT_VIEWS: Record<string, React.FC<ShotProps>> = { e01, e02, e03, e04, e05, e06, e07, e08, e09, e10, e11, e12, e13, e14, e15, e16, e17, e18, e19, e20 };
