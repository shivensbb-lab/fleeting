import React from "react";
import { Bean } from "../ui/Bean";
import { Big, Book, C, Card, FEET, HORIZON, Ink, LW, Parchment, Rays, Scene, ShotProps, Stamp, Timber, ZeroCard, mix, move, pop, ramp, wob } from "./kit";

const SALIERI = { coat: "#3A3A52", hat: "periwig" as const };
const MOZART = { coat: C.red, hat: "periwig" as const };
const Salon: React.FC = () => (
  <g>
    <rect x={0} y={0} width={1080} height={1920} fill="#E6D3C2" />
    {[160, 920].map((x) => <rect key={x} x={x - 30} y={0} width={60} height={HORIZON} fill="#D6BFA8" stroke={C.line} strokeWidth={8} />)}
    <rect x={380} y={300} width={320} height={380} rx={20} fill="#F6E7C6" stroke={C.yellow} strokeWidth={20} />
    <rect x={380} y={300} width={320} height={380} rx={20} fill="none" stroke={C.line} strokeWidth={8} />
    <rect x={0} y={HORIZON} width={1080} height={770} fill="#9C6B3E" stroke={C.line} strokeWidth={LW} />
  </g>
);
const Bottle: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <path d="M-40 0 L-40 -90 C -40 -120 -16 -120 -16 -140 L-16 -170 L16 -170 L16 -140 C 16 -120 40 -120 40 -90 L40 0 Z" fill="#6FAA5E" stroke={C.line} strokeWidth={8} strokeLinejoin="round" />
    <rect x={-22} y={-190} width={44} height={24} fill={C.beam} stroke={C.line} strokeWidth={6} />
    <path d="M-22 -70 L22 -70 M-18 -50 L18 -30 M18 -50 L-18 -30" stroke={C.white} strokeWidth={6} strokeLinecap="round" />
  </g>
);
const Piano: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-220} y={-200} width={440} height={140} fill={C.line} stroke={C.line} strokeWidth={8} />
    <rect x={-210} y={-80} width={420} height={40} fill={C.white} stroke={C.line} strokeWidth={6} />
    {Array.from({ length: 9 }, (_, k) => <rect key={k} x={-196 + k * 46} y={-80} width={20} height={24} fill={C.line} />)}
    <rect x={-200} y={-40} width={20} height={40} fill={C.line} /><rect x={180} y={-40} width={20} height={40} fill={C.line} />
  </g>
);
const Score: React.FC<{ x: number; y: number; s?: number; rot?: number; title?: string }> = ({ x, y, s = 1, rot = 0, title }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-180} y={-240} width={360} height={480} fill={C.parchment} stroke={C.line} strokeWidth={10} />
    {title ? <Ink x={0} y={-180} size={36} serif>{title}</Ink> : null}
    {Array.from({ length: 4 }, (_, r) => <g key={r}>{Array.from({ length: 5 }, (_, l) => <path key={l} d={`M-150 ${-120 + r * 90 + l * 10} L150 ${-120 + r * 90 + l * 10}`} stroke={C.line} strokeWidth={2} />)}
      {Array.from({ length: 6 }, (_, k) => <circle key={k} cx={-120 + k * 50} cy={-110 + r * 90 + ((k * 7 + r * 3) % 5) * 8} r={7} fill={C.line} />)}</g>)}
  </g>
);
const salieriPose = (f: number) => (
  <>
    <Salon />
    <Bean x={300} y={FEET} s={1.3} {...SALIERI} face="smug" armR={110} armL={20} holdR={<g transform="translate(10 -10) scale(0.6)"><Bottle /></g>} />
    <Bean x={780} y={FEET} s={1.3} {...MOZART} face="happy" armL={20} armR={140 + wob(f, 2, 8)} />
  </>
);

export const z01: React.FC<ShotProps> = ({ f }) => <Scene f={f}>{salieriPose(f)}<g transform={`translate(540 380) scale(${pop(f, 8)})`}><Big x={0} y={0} size={140} color={C.yellow}>1791</Big></g></Scene>;
export const z02: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    {salieriPose(f)}
    <Stamp f={f} a={12} x={540} y={420} text="NO EVIDENCE" size={100} />
  </Scene>
);
export const z03: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Salon />
    {[340, 740].map((x, i) => <Bean key={x} x={x} y={FEET} s={1.1} {...(i ? MOZART : SALIERI)} face="deadpan" />)}
    <g transform={`translate(540 330) scale(${mix(1.3, 1, pop(f, 2, 6))}) translate(-540 -330)`}>
      <Big x={540} y={290} size={110}>MOZART & SALIERI</Big>
      <Big x={540} y={410} size={86} color={C.yellow}>THE POISON MYTH</Big>
    </g>
  </Scene>
);
export const z04: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Salon />
    <Piano x={540} y={FEET} s={1.2} />
    <Bean x={540} y={FEET - 60} s={1.1} {...MOZART} face="happy" armL={60} armR={60} />
    <g transform={`translate(860 520) scale(${pop(f, 8)})`}><Big x={0} y={0} size={200} color={C.yellow}>35</Big></g>
  </Scene>
);
const Bed: React.FC<{ f: number; face?: "deadpan" | "panic" }> = ({ f, face = "deadpan" }) => (
  <g>
    <Salon />
    <rect x={200} y={980} width={680} height={140} fill={C.white} stroke={C.line} strokeWidth={LW} />
    <rect x={180} y={880} width={40} height={300} fill={C.beam} stroke={C.line} strokeWidth={8} />
    <rect x={860} y={940} width={40} height={240} fill={C.beam} stroke={C.line} strokeWidth={8} />
    <g transform="translate(300 980)"><circle cx={0} cy={-40} r={56} fill={C.skin} stroke={C.line} strokeWidth={LW} /><circle cx={-18} cy={-44} r={6} fill={C.line} /><circle cx={18} cy={-44} r={6} fill={C.line} /><path d="M-12 -14 L12 -14" stroke={C.line} strokeWidth={6} /></g>
    <rect x={340} y={930} width={500} height={70} rx={30} fill="#C24A6A" stroke={C.line} strokeWidth={LW} />
    {face === "panic" ? null : null}{wob(f, 1) > 9 ? null : null}
  </g>
);
export const z05: React.FC<ShotProps> = ({ f }) => <Scene f={f}><Bed f={f} /><g transform={`translate(540 420) scale(${pop(f, 8)})`}><Big x={0} y={0} size={120} color={C.yellow}>WEEKS</Big></g></Scene>;
export const z06: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Bed f={f} />
    <Bean x={900} y={FEET + 60} s={0.9} coat={C.line} hat="tricorn" face="deadpan" armR={110} armL={20} holdR={<path d="M0 0 L0 -60" stroke={C.line} strokeWidth={10} />} />
    <g transform={`translate(540 420) scale(${pop(f, 10)})`}><Card x={0} y={0} w={340} h={120}><Ink x={0} y={20} size={60}>FEVER</Ink></Card></g>
  </Scene>
);
export const z07: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    {[[300, 900], [540, 860], [780, 900]].map(([x, y], i) => (
      <g key={i} transform={`translate(${x} ${y})`}>
        <circle cx={0} cy={-200} r={90} fill="#C9C3B4" stroke={C.line} strokeWidth={11} />
        <path d="M-120 60 C -120 -90 120 -90 120 60 Z" fill="#C9C3B4" stroke={C.line} strokeWidth={11} />
        <g transform={`scale(${pop(f, 6 + i * 6)})`}><Big x={0} y={-160} size={120}>?</Big></g>
      </g>
    ))}
  </Scene>
);
export const z08: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <g transform="translate(540 900) scale(2.4)"><Bottle /></g>
    <g transform={`translate(540 800) scale(${pop(f, 14)})`}><Big x={0} y={80} size={420} color={C.red}>✗</Big></g>
  </Scene>
);
export const z09: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Salon />
    <Bean x={540} y={FEET} s={1.5} {...SALIERI} face="smug" armL={20} armR={20} />
    <Stamp f={f} a={14} x={540} y={420} text="NOT JEALOUS" size={100} />
  </Scene>
);
export const z10: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Salon />
    <Rays f={f} x={540} y={900} o={0.3} />
    <Bean x={540} y={FEET} s={1.5} {...SALIERI} face="happy" armL={150} armR={150} />
    <g transform={`translate(540 380) scale(${pop(f, 10)})`}><Big x={0} y={0} size={110} color={C.yellow}>COURT COMPOSER</Big></g>
  </Scene>
);
export const z11: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Timber />
    <Bean x={200} y={FEET} s={1.2} {...SALIERI} face="smug" armR={100 + wob(f, 1.6, 10)} armL={20} />
    {["BEETHOVEN", "SCHUBERT", "LISZT"].map((n, i) => { const k = pop(f, 4 + i * 8); return k > 0 ? (
      <g key={n}>
        <Bean x={480 + i * 200} y={FEET} s={0.85 * k} coat={["#3D5A80", "#5E7A4A", "#7E4A8C"][i]} hair face="happy" armL={20} armR={20} />
        <g transform={`translate(${480 + i * 200} ${700 - (i % 2) * 70})`}><Big x={0} y={0} size={46} color={C.yellow}>{n}</Big></g>
      </g>) : null; })}
  </Scene>
);
export const z12: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Salon />
    <Piano x={680} y={FEET} s={1.0} />
    <Bean x={300} y={FEET} s={1.3} {...SALIERI} face="happy" armR={70} armL={20} />
    <Bean x={680} y={FEET - 40} s={0.8} coat={C.red} hair face="happy" armL={60} armR={60} />
    <g transform={`translate(680 640) scale(${pop(f, 10)})`}><Card x={0} y={0} w={380} h={110}><Ink x={0} y={18} size={46}>Mozart Jr.</Ink></Card></g>
  </Scene>
);
export const z13: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Salon />
    <Score x={540} y={760} s={0.9} title="Cantata, 1785" />
    <Bean x={200} y={FEET} s={1.1} {...SALIERI} face="happy" armR={60} armL={20} />
    <Bean x={880} y={FEET} s={1.1} {...MOZART} face="happy" armL={60} armR={20} />
  </Scene>
);
export const z14: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Timber />
    <g transform={`translate(540 ${mix(1100, 800, ramp(f, 4, 20, move))}) rotate(${mix(20, -3, ramp(f, 4, 20, move))})`}><Score x={0} y={0} s={0.9} title="Found!" /></g>
    <g transform={`translate(540 340) scale(${pop(f, 18)})`}><Big x={0} y={0} size={150} color={C.yellow}>2016</Big></g>
  </Scene>
);
export const z15: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Salon />
    <Bean x={540} y={FEET} s={1.5} {...SALIERI} face="deadpan" armR={-40 + wob(f, 2, 10)} armL={20} />
    <g transform={`translate(800 520) scale(${pop(f, 6)})`}><Big x={0} y={0} size={220}>?</Big></g>
  </Scene>
);
export const z16: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Salon />
    {[260, 540, 820].map((x, i) => <Bean key={x} x={x} y={FEET} s={1.1} coat={["#7E4A8C", "#3D6E8C", "#7A5A3C"][i]} hat="periwig" face="smug" armL={20} armR={i === 1 ? 20 : 120} flip={i === 2} />)}
    {[0, 1].map((i) => { const k = pop(f, 6 + i * 10); return k > 0 ? <g key={i} transform={`translate(${400 + i * 280} 620) scale(${k})`}><Card x={0} y={0} w={220} h={100}><Ink x={0} y={16} size={44}>psst...</Ink></Card></g> : null; })}
  </Scene>
);
export const z17: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <rect x={0} y={0} width={1080} height={1920} fill="#2A2530" />
    <rect x={90} y={360} width={900} height={560} fill="#E6D3C2" stroke={C.line} strokeWidth={14} />
    <g transform="translate(540 860) scale(0.6)"><Bean x={-200} y={0} s={1} {...SALIERI} face="smug" armR={110} armL={20} holdR={<g transform="scale(0.6)"><Bottle /></g>} /><Bean x={200} y={0} s={1} {...MOZART} face="happy" armL={20} armR={20} /></g>
    {Array.from({ length: 6 }, (_, k) => <circle key={k} cx={180 + k * 144} cy={1100 + (k % 2) * 30} r={48} fill="#4A4250" stroke={C.line} strokeWidth={8} />)}
    <g transform={`translate(540 280) scale(${pop(f, 10)})`}><Big x={0} y={0} size={110} color={C.yellow}>PLAY → MOVIE</Big></g>
  </Scene>
);
export const z18: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <Book x={540} y={760} s={1.4} title="Drama!" />
    <Stamp f={f} a={14} x={540} y={420} text="NOT HISTORY" size={100} />
  </Scene>
);
export const z19: React.FC<ShotProps> = ({ f }) => <Scene f={f}><ZeroCard f={f} label="PROOF OF POISON" /></Scene>;
/** The loop: back to the opening (wrong) version. */
export const z20: React.FC<ShotProps> = ({ f }) => <Scene f={f + 5}>{salieriPose(f)}</Scene>;

export const SHOT_VIEWS: Record<string, React.FC<ShotProps>> = { z01, z02, z03, z04, z05, z06, z07, z08, z09, z10, z11, z12, z13, z14, z15, z16, z17, z18, z19, z20 };
void HORIZON;
