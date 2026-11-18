import React from "react";
import { Bean } from "../ui/Bean";
import { Big, Book, C, Card, FEET, Field, HORIZON, Ink, LW, Parchment, Rays, Scene, ShotProps, Stamp, Timber, ZeroCard, mix, move, pop, ramp, wob } from "./kit";

const ABE = { coat: C.line, hat: "tophat" as const, beard: "#3A2620" };
const EVERETT = { coat: "#5D6470", beard: "#E9E6DE" };
const Envelope: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <rect x={-140} y={-90} width={280} height={180} fill="#E8D9B8" stroke={C.line} strokeWidth={9} />
    <path d="M-140 -90 L0 20 L140 -90" fill="none" stroke={C.line} strokeWidth={7} />
    {[0, 1, 2].map((k) => <path key={k} d={`M-110 ${30 + k * 20} q30 -10 60 0 q30 10 60 0 q30 -10 60 0`} stroke={C.navy} strokeWidth={4} fill="none" />)}
  </g>
);
const Sheet: React.FC<{ x: number; y: number; s?: number; rot?: number; head?: string; lines?: number; strike?: boolean }> = ({ x, y, s = 1, rot = 0, head, lines = 9, strike }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-200} y={-280} width={400} height={560} fill={C.white} stroke={C.line} strokeWidth={10} />
    {head ? <Ink x={0} y={-220} size={30} serif>{head}</Ink> : null}
    {Array.from({ length: lines }, (_, k) => <path key={k} d={`M-160 ${-160 + k * 46} q40 -8 80 0 q40 8 80 0 q40 -8 80 0 q40 8 80 0`} stroke={C.navy} strokeWidth={4} fill="none" />)}
    {strike ? [1, 4, 6].map((k) => <path key={k} d={`M-120 ${-160 + k * 46} L80 ${-160 + k * 46}`} stroke={C.red} strokeWidth={6} />) : null}
  </g>
);
const Train: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect x={0} y={0} width={1080} height={1920} fill="#C9B79A" />
    <rect x={120} y={360} width={840} height={420} rx={30} fill="#9FC3D4" stroke={C.beam} strokeWidth={30} />
    {[0, 1, 2].map((k) => { const x = ((k * 400 - f * 10) % 1200 + 1200) % 1200; return <g key={k}><rect x={x - 10} y={560} width={20} height={220} fill="#6E5A44" /><circle cx={x} cy={540} r={70} fill="#7FA05A" stroke={C.line} strokeWidth={6} /></g>; })}
    <rect x={120} y={360} width={840} height={420} rx={30} fill="none" stroke={C.line} strokeWidth={8} />
    <rect x={0} y={HORIZON} width={1080} height={770} fill="#7A3B2E" stroke={C.line} strokeWidth={LW} />
  </g>
);
const abePose = (f: number) => (
  <>
    <Train f={f} />
    <Bean x={420} y={FEET} s={1.4} {...ABE} face="deadpan" armR={100 + wob(f, 1.4, 12)} armL={20} holdR={<path d="M0 0 L40 -70" stroke={C.line} strokeWidth={10} strokeLinecap="round" />} />
    <g transform={`translate(760 900) rotate(-6) scale(${pop(f, 6)})`}><Envelope s={1.3} /></g>
  </>
);

export const y01: React.FC<ShotProps> = ({ f }) => <Scene f={f}>{abePose(f)}<g transform={`translate(540 300) scale(${pop(f, 8)})`}><Big x={0} y={0} size={140} color={C.yellow}>1863</Big></g></Scene>;
export const y02: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    {abePose(f)}
    <Stamp f={f} a={12} x={540} y={420} text="NO ENVELOPE" size={100} />
  </Scene>
);
export const y03: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Field f={f} />
    <Bean x={540} y={FEET} s={1.15} {...ABE} face="deadpan" />
    <g transform={`translate(540 330) scale(${mix(1.3, 1, pop(f, 2, 6))}) translate(-540 -330)`}>
      <Big x={540} y={290} size={120}>GETTYSBURG</Big>
      <Big x={540} y={410} size={86} color={C.yellow}>THE ENVELOPE MYTH</Big>
    </g>
  </Scene>
);
export const y04: React.FC<ShotProps> = ({ f }) => <Scene f={f}>{abePose(f)}</Scene>;
export const y05: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <g transform={`translate(540 800) rotate(${wob(f, 3, 4)}) scale(${pop(f, 4)})`}><Envelope s={2.4} /></g>
    <g transform={`translate(540 420) scale(${pop(f, 14)})`}><Big x={0} y={0} size={110} color={C.yellow}>LAST MINUTE?</Big></g>
  </Scene>
);
const Office: React.FC = () => (
  <g>
    <Timber />
    <rect x={540} y={780} width={460} height={60} fill={C.beam} stroke={C.line} strokeWidth={LW} />
    <rect x={560} y={840} width={30} height={350} fill={C.beam} stroke={C.line} strokeWidth={8} /><rect x={950} y={840} width={30} height={350} fill={C.beam} stroke={C.line} strokeWidth={8} />
  </g>
);
export const y06: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Office />
    <Bean x={360} y={FEET} s={1.4} {...ABE} face="deadpan" armR={90 + wob(f, 1.6, 10)} armL={20} holdR={<path d="M0 0 L40 -70" stroke={C.line} strokeWidth={10} strokeLinecap="round" />} />
    <Sheet x={770} y={700} s={0.4} />
    <g transform={`translate(540 380) scale(${pop(f, 12)})`}><Big x={0} y={0} size={110} color={C.yellow}>WASHINGTON</Big></g>
  </Scene>
);
export const y07: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}><Parchment /><g transform={`translate(540 780) scale(${pop(f, 4)})`}><Sheet x={0} y={0} s={1.3} head="EXECUTIVE MANSION" /></g></Scene>
);
export const y08: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <Sheet x={540} y={780} s={1.3} head="EXECUTIVE MANSION" strike={f > 10} />
    <g transform={`translate(780 380) scale(${pop(f, 16)})`}><Big x={0} y={0} size={110} color={C.yellow}>v2, v3...</Big></g>
  </Scene>
);
export const y09: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    {[0, 1, 2, 3, 4].map((i) => { const k = pop(f, 2 + i * 5); return k > 0 ? <g key={i} transform={`translate(${200 + i * 170} ${780 + (i % 2) * 60}) rotate(${(i - 2) * 5}) scale(${k})`}><Sheet x={0} y={0} s={0.42} /></g> : null; })}
    <g transform={`translate(540 380) scale(${pop(f, 28)})`}><Big x={0} y={0} size={160} color={C.yellow}>5 COPIES</Big></g>
  </Scene>
);
export const y10: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <g transform="translate(540 800)"><Envelope s={2.2} /></g>
    <g transform={`translate(540 800) scale(${pop(f, 10)})`}><Big x={0} y={80} size={420} color={C.red}>✗</Big></g>
  </Scene>
);
const Podium: React.FC<{ f: number; who: "abe" | "everett"; speaking?: boolean }> = ({ f, who, speaking = true }) => (
  <g>
    <Field f={f} />
    <rect x={380} y={960} width={320} height={260} fill={C.beam} stroke={C.line} strokeWidth={LW} />
    {who === "abe" ? <Bean x={540} y={1000} s={1.3} {...ABE} face="deadpan" armR={speaking ? 120 + wob(f, 2, 8) : 20} armL={20} />
      : <Bean x={540} y={1000} s={1.3} {...EVERETT} face="happy" armR={150 + wob(f, 1.5, 12)} armL={140 - wob(f, 1.5, 12)} />}
  </g>
);
const Clock: React.FC<{ f: number; mins: number; x: number; y: number }> = ({ f, mins, x, y }) => {
  const k = ramp(f, 4, 30, move), a = (mins / 60) * Math.PI * 2 * k;
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle cx={0} cy={0} r={110} fill={C.white} stroke={C.line} strokeWidth={LW} />
      <path d={`M0 0 L${Math.sin(a) * 80} ${-Math.cos(a) * 80}`} stroke={C.red} strokeWidth={12} strokeLinecap="round" />
      <path d="M0 0 L0 -50" stroke={C.line} strokeWidth={12} strokeLinecap="round" />
    </g>
  );
};
export const y11: React.FC<ShotProps> = ({ f }) => <Scene f={f}><Podium f={f} who="abe" /><Clock f={f} mins={2} x={830} y={520} /><g transform={`translate(830 340) scale(${pop(f, 8)})`}><Big x={0} y={0} size={100} color={C.yellow}>2 MIN</Big></g></Scene>;
export const y12: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}><Podium f={f} who="everett" /><Clock f={f} mins={120} x={830} y={520} /><g transform={`translate(830 340) scale(${pop(f, 8)})`}><Big x={0} y={0} size={100} color={C.yellow}>2 HOURS</Big></g></Scene>
);
export const y13: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Timber />
    <Bean x={300} y={FEET} s={1.3} {...EVERETT} face="smug" armR={100 + wob(f, 1.6, 10)} armL={20} holdR={<path d="M0 0 L40 -70" stroke={C.line} strokeWidth={10} strokeLinecap="round" />} />
    <g transform={`translate(760 760) scale(${pop(f, 6)})`}>
      <Card x={0} y={0} w={420} h={480} fill={C.parchment}>
        <Ink x={0} y={-170} size={40} serif>Dear Mr. Lincoln,</Ink>
        <Big x={-90} y={0} size={80} color={C.yellow}>2 min</Big><Ink x={60} y={-6} size={50}>&gt;</Ink><Big x={0} y={110} size={80}>2 hrs</Big>
      </Card>
    </g>
  </Scene>
);
export const y14: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Field f={f} />
    <Bean x={540} y={FEET} s={1.5} {...ABE} face="deadpan" armR={-40 + wob(f, 2, 10)} armL={20} />
    <g transform={`translate(800 520) scale(${pop(f, 6)})`}><Big x={0} y={0} size={220}>?</Big></g>
  </Scene>
);
export const y15: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <Book x={540} y={780} s={1.2} title="A Tribute" />
    <g transform={`translate(540 380) scale(${pop(f, 10)})`}><Big x={0} y={0} size={150} color={C.yellow}>1906</Big></g>
  </Scene>
);
export const y16: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    {abePose(f)}
    <g transform={`translate(540 300) scale(${pop(f, 10)})`}><Card x={0} y={0} w={420} h={120} fill="#C9A06A"><Ink x={0} y={20} size={52}>BROWN PAPER</Ink></Card></g>
  </Scene>
);
export const y17: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Timber />
    {[0, 1, 2, 3, 4].map((k) => <Bean key={k} x={140 + k * 200} y={FEET - Math.abs(wob(f + k * 5, 2.2, 8))} s={0.85} coat={["#7E4A8C", "#3D6E8C", C.slate, C.red, "#5E7A4A"][k]} face="happy" armR={110} armL={20} holdR={<g transform="translate(10 -30) scale(0.25)"><Book x={0} y={0} title="" /></g>} />)}
    <g transform={`translate(540 420) scale(${pop(f, 14)})`}><Big x={0} y={0} size={130} color={C.yellow}>LEGEND</Big></g>
  </Scene>
);
export const y18: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Office />
    <Rays f={f} x={360} y={800} o={0.25} />
    <Bean x={360} y={FEET} s={1.4} {...ABE} face="smug" armR={90} armL={20} holdR={<path d="M0 0 L40 -70" stroke={C.line} strokeWidth={10} strokeLinecap="round" />} />
    <Sheet x={770} y={700} s={0.4} />
    <Stamp f={f} a={14} x={540} y={380} text="CAREFUL" size={120} color="#3E8E4E" />
  </Scene>
);
export const y19: React.FC<ShotProps> = ({ f }) => <Scene f={f}><ZeroCard f={f} label="ENVELOPES INVOLVED" /></Scene>;
/** The loop: back to the opening (wrong) version. */
export const y20: React.FC<ShotProps> = ({ f }) => <Scene f={f + 5}>{abePose(f)}</Scene>;

export const SHOT_VIEWS: Record<string, React.FC<ShotProps>> = { y01, y02, y03, y04, y05, y06, y07, y08, y09, y10, y11, y12, y13, y14, y15, y16, y17, y18, y19, y20 };
