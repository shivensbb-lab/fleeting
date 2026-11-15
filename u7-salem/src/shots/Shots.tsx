import React from "react";
import { Bean } from "../ui/Bean";
import { Big, Book, C, Card, FEET, HORIZON, Ink, LW, Night, Parchment, Rays, Scene, ShotProps, Stamp, Timber, ZeroCard, mix, move, pop, ramp, wob } from "./kit";

const PUR = { coat: "#3A3A44", hat: "puritan" as const };
const JUDGE = { coat: "#1F1F26", hat: "puritan" as const, beard: "#E9E6DE" };
const GIRL = { coat: "#6E7F96", hair: true };
const Village: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect x={0} y={0} width={1080} height={1920} fill="#C7D3D6" />
    {[[60, 1], [420, 0], [760, 1]].map(([x, t], i) => (
      <g key={i}>
        <rect x={Number(x)} y={HORIZON - 380} width={280} height={380} fill={t ? "#7A5A3C" : "#8C6A48"} stroke={C.line} strokeWidth={LW} />
        <path d={`M${Number(x) - 20} ${HORIZON - 380} L${Number(x) + 140} ${HORIZON - 560} L${Number(x) + 300} ${HORIZON - 380} Z`} fill={C.slate} stroke={C.line} strokeWidth={LW} strokeLinejoin="round" />
        <rect x={Number(x) + 110} y={HORIZON - 160} width={60} height={160} fill={C.beam} stroke={C.line} strokeWidth={8} />
      </g>
    ))}
    <path d={`M0 ${HORIZON} C 300 ${HORIZON - 30} 700 ${HORIZON + 30} 1080 ${HORIZON - 10} L1080 1920 L0 1920 Z`} fill="#8B9767" stroke={C.line} strokeWidth={LW} />
    {wob(f, 1, 1) > 2 ? null : null}
  </g>
);
const Court: React.FC = () => (
  <g>
    <Timber />
    <rect x={160} y={720} width={760} height={240} fill={C.beam} stroke={C.line} strokeWidth={LW} />
    <rect x={160} y={700} width={760} height={40} fill="#5A3E26" stroke={C.line} strokeWidth={8} />
  </g>
);
const Fire: React.FC<{ f: number; s?: number }> = ({ f, s = 1 }) => (
  <g transform={`scale(${s})`}>
    <path d={`M-90 0 C -110 -80 -40 -120 -30 -200 C 0 -140 ${30 + wob(f, 2, 10)} -150 20 -260 C 90 -190 110 -100 90 0 Z`} fill="#F08A2A" stroke={C.line} strokeWidth={10} strokeLinejoin="round" />
    <path d={`M-40 0 C -50 -50 -10 -70 0 -120 C 30 -70 50 -50 40 0 Z`} fill={C.yellow} />
    <path d="M-120 10 L120 -10 M-110 -10 L110 14" stroke={C.beam} strokeWidth={26} strokeLinecap="round" />
  </g>
);
const salemPose = (f: number) => (
  <>
    <Village f={f} />
    <g transform="translate(540 1060)"><Fire f={f} s={1.4} /></g>
    {[200, 880].map((x, i) => <Bean key={x} x={x} y={FEET + 60} s={1.1} {...PUR} face="angry" armR={150 + wob(f + i * 6, 3, 10)} armL={30} />)}
  </>
);

export const s01: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    {salemPose(f)}
    <g transform={`translate(540 420) scale(${pop(f, 8)})`}><Big x={0} y={0} size={160} color={C.yellow}>1692</Big></g>
  </Scene>
);
export const s02: React.FC<ShotProps> = ({ f }) => {
  const k = ramp(f, 8, 20, move);
  return (
    <Scene f={f}>
      <Village f={f} />
      <g transform={`translate(540 1060) scale(${1.4 * (1 - k)})`}><Fire f={f} /></g>
      {[200, 880].map((x) => <Bean key={x} x={x} y={FEET + 60} s={1.1} {...PUR} face={k > 0.5 ? "panic" : "angry"} armR={150} armL={k > 0.5 ? 150 : 30} />)}
      <Stamp f={f} a={22} x={540} y={520} text="NO FIRE" size={130} />
    </Scene>
  );
};
export const s03: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Village f={f} />
    <Bean x={540} y={FEET} s={1.15} {...PUR} face="deadpan" />
    <g transform={`translate(540 330) scale(${mix(1.3, 1, pop(f, 2, 6))}) translate(-540 -330)`}>
      <Big x={540} y={290} size={150}>SALEM</Big>
      <Big x={540} y={410} size={86} color={C.yellow}>THE BURNING MYTH</Big>
    </g>
  </Scene>
);
export const s04: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Timber />
    {[380, 700].map((x, i) => <Bean key={x} x={x + wob(f + i * 4, 1.2, 14)} y={FEET} s={1.1} {...GIRL} face="panic" armL={150 + wob(f + i * 3, 1.3, 30)} armR={150 - wob(f + i * 3, 1.3, 30)} />)}
    <Bean x={160} y={FEET} s={1.1} {...PUR} face="panic" armL={20} armR={150} />
  </Scene>
);
export const s05: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Village f={f} />
    {Array.from({ length: 2 }, (_, r) => Array.from({ length: 5 }, (_, k) => {
      const kk = pop(f, 2 + (r * 5 + k) * 2.5);
      return kk > 0 ? <Bean key={`${r}${k}`} x={120 + k * 210 + r * 60} y={FEET - 30 + r * 170} s={0.62 * kk} coat={["#6E7F96", "#3A3A44", "#7A5A3C", "#5E7A4A", "#7E4A8C"][(k + r) % 5]} face="panic" armL={150} armR={150} /> : null;
    }))}
    <g transform={`translate(540 420) scale(${pop(f, 30)})`}><Big x={0} y={0} size={170} color={C.yellow}>200+</Big></g>
  </Scene>
);
export const s06: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Court />
    <Bean x={300} y={FEET} s={1.3} {...JUDGE} face="deadpan" armR={100} armL={20} />
    <g transform={`translate(740 540) scale(${pop(f, 8)})`}>
      <path d="M-200 60 C -260 60 -260 -30 -190 -40 C -180 -120 -60 -130 -30 -70 C 0 -150 150 -140 150 -50 C 240 -50 250 60 170 60 Z" fill={C.white} stroke={C.line} strokeWidth={10} strokeLinejoin="round" />
      <Ink x={-30} y={20} size={44}>zzz... a ghost!</Ink>
      <circle cx={-230} cy={110} r={22} fill={C.white} stroke={C.line} strokeWidth={8} /><circle cx={-280} cy={160} r={14} fill={C.white} stroke={C.line} strokeWidth={6} />
    </g>
    <Stamp f={f} a={30} x={540} y={1060} text="EVIDENCE" size={90} color={C.red} rot={-4} />
  </Scene>
);
export const s07: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <g transform={`translate(540 860) scale(${pop(f, 4)})`}><Big x={0} y={0} size={460} color={C.yellow}>19</Big></g>
  </Scene>
);
export const s08: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <g transform="translate(540 1000)"><Fire f={f} s={1.4} /></g>
    <g transform={`translate(540 860) scale(${pop(f, 12)})`}><Big x={0} y={60} size={420} color={C.red}>✗</Big></g>
    <g transform={`translate(540 420) scale(${pop(f, 4)})`}><Big x={0} y={0} size={120}>NOT FIRE</Big></g>
  </Scene>
);
export const s09: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <Book x={540} y={760} s={1.5} open={1} />
    <g transform={`translate(540 780) scale(${pop(f, 6)})`}>
      <rect x={-280} y={-60} width={560} height={110} fill={C.yellow} opacity={0.75} />
      <Ink x={0} y={20} size={66}>ENGLISH LAW</Ink>
    </g>
    <Stamp f={f} a={22} x={540} y={420} text="FELONY" size={130} />
  </Scene>
);
export const s10: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Court />
    <Bean x={540} y={FEET} s={1.5} {...JUDGE} face="angry" armR={150 - ramp(f, 10, 18) * 60} armL={20}
      holdR={<g transform="rotate(-30)"><rect x={-20} y={-110} width={40} height={110} fill={C.beam} stroke={C.line} strokeWidth={6} /><rect x={-50} y={-150} width={100} height={50} rx={10} fill={C.beam} stroke={C.line} strokeWidth={8} /></g>} />
    <g transform={`translate(540 420) scale(${pop(f, 18)})`}><Big x={0} y={0} size={130} color={C.yellow}>SAME RULES</Big></g>
  </Scene>
);
const Map: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect x={0} y={0} width={1080} height={1920} fill="#9FC3D4" />
    <path d="M520 360 C 620 300 820 320 900 420 C 980 540 900 700 820 760 C 760 820 640 840 560 780 C 480 720 460 600 500 520 C 440 470 460 400 520 360 Z" fill="#B7C48E" stroke={C.line} strokeWidth={LW} />
    <path d="M140 900 C 180 820 300 820 330 900 C 360 980 300 1080 220 1080 C 140 1080 110 980 140 900 Z" fill="#B7C48E" stroke={C.line} strokeWidth={LW} />
    {[[640, 520], [760, 620], [700, 700]].map(([x, y], i) => { const k = pop(f, 8 + i * 6); return k > 0 ? <g key={i} transform={`translate(${x} ${y}) scale(${k * 0.35})`}><Fire f={f} /></g> : null; })}
  </g>
);
export const s11: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Map f={f} />
    <g transform="translate(700 300)"><Big x={0} y={0} size={100}>EUROPE</Big></g>
    <g transform="translate(230 820)"><Ink x={0} y={0} size={50}>Salem</Ink></g>
  </Scene>
);
export const s12: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Court />
    <Bean x={300} y={FEET} s={1.3} {...JUDGE} face="angry" armR={110} armL={20} />
    <Bean x={760} y={FEET} s={1.4} coat="#7A5A3C" hat="none" beard="#C9C3B4" face="deadpan" armL={20} armR={20} />
    <g transform={`translate(760 520) scale(${pop(f, 14)})`}>
      <path d="M-200 -90 L200 -90 L200 60 L60 60 L0 130 L-20 60 L-200 60 Z" fill={C.white} stroke={C.line} strokeWidth={10} strokeLinejoin="round" />
      <Ink x={0} y={0} size={60}>No.</Ink>
    </g>
  </Scene>
);
export const s13: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <rect x={0} y={0} width={1080} height={1920} fill="#5E6168" />
    <rect x={190} y={420} width={700} height={720} fill="#45484E" stroke={C.line} strokeWidth={LW} />
    <Bean x={540} y={1120} s={1.2} coat="#6E7F96" face="deadpan" armL={20} armR={20} />
    {Array.from({ length: 7 }, (_, k) => <rect key={k} x={210 + k * 105} y={420} width={22} height={720} fill="#2A2C30" stroke={C.line} strokeWidth={6} />)}
    <rect x={0} y={HORIZON} width={1080} height={770} fill="#45484E" stroke={C.line} strokeWidth={LW} />
  </Scene>
);
export const s14: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <Card x={540} y={760} w={560} h={600} rot={-3}>
      <rect x={-280} y={-300} width={560} height={130} fill={C.red} stroke={C.line} strokeWidth={10} />
      <Ink x={0} y={-215} size={60} color={C.white}>OVER</Ink>
      <g transform={`scale(${pop(f, 6)})`}><Big x={0} y={110} size={190} color={C.yellow}>1693</Big></g>
    </Card>
  </Scene>
);
export const s15: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Court />
    {[260, 540, 820].map((x, i) => <Bean key={x} x={x} y={FEET} s={1.1} {...PUR} face="deadpan" armL={20} armR={20} />)}
    <g transform={`translate(540 520) scale(${pop(f, 10)})`}><Card x={0} y={0} w={460} h={170} fill={C.parchment}><Ink x={0} y={22} size={64} serif>We were wrong.</Ink></Card></g>
  </Scene>
);
export const s16: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <Card x={540} y={760} w={640} h={560}>
      <Ink x={0} y={-160} size={52}>ELIZABETH JOHNSON JR.</Ink>
      <g transform={`scale(${pop(f, 6)})`}><Big x={0} y={60} size={190} color={C.yellow}>2022</Big></g>
    </Card>
    <Stamp f={f} a={22} x={540} y={1020} text="CLEARED" size={110} color="#3E8E4E" />
  </Scene>
);
export const s17: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Village f={f} />
    <Bean x={540} y={FEET} s={1.5} {...PUR} face="deadpan" armR={-40 + wob(f, 2, 10)} armL={20} />
    <g transform={`translate(800 520) scale(${pop(f, 6)})`}><Big x={0} y={0} size={220}>?</Big></g>
  </Scene>
);
export const s18: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <rect x={0} y={0} width={1080} height={1920} fill="#2A2530" />
    <rect x={90} y={360} width={900} height={560} fill="#E8DFC8" stroke={C.line} strokeWidth={14} />
    <g transform="translate(540 820)"><Fire f={f} s={0.9} /></g>
    {Array.from({ length: 6 }, (_, k) => <circle key={k} cx={180 + k * 144} cy={1100 + (k % 2) * 30} r={48} fill="#4A4250" stroke={C.line} strokeWidth={8} />)}
    <g transform={`translate(540 280) scale(${pop(f, 10)})`}><Big x={0} y={0} size={110} color={C.yellow}>MIXED UP</Big></g>
  </Scene>
);
export const s19: React.FC<ShotProps> = ({ f }) => <Scene f={f}><ZeroCard f={f} label="BURNED AT SALEM" /></Scene>;
/** The loop: back to the opening (wrong) version. */
export const s20: React.FC<ShotProps> = ({ f }) => <Scene f={f + 5}>{salemPose(f)}</Scene>;

export const SHOT_VIEWS: Record<string, React.FC<ShotProps>> = { s01, s02, s03, s04, s05, s06, s07, s08, s09, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20 };
void Night; void Rays;
