import React from "react";
import { Bean } from "../ui/Bean";
import { Big, Book, C, Card, FEET, HORIZON, Ink, LW, Newspaper, Parchment, Rays, Scene, ShotProps, Stamp, Timber, ZeroCard, mix, move, pop, ramp, wob } from "./kit";

const WALL = "#B9A27A";
const Hills: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect x={0} y={0} width={1080} height={1920} fill="#CFE3E2" />
    <path d={`M0 ${HORIZON - 240} C 200 ${HORIZON - 420} 360 ${HORIZON - 160} 560 ${HORIZON - 360} C 760 ${HORIZON - 540} 900 ${HORIZON - 220} 1080 ${HORIZON - 320} L1080 1920 L0 1920 Z`} fill="#8B9767" stroke={C.line} strokeWidth={LW} />
    <path d={`M0 ${HORIZON - 260} C 200 ${HORIZON - 440} 360 ${HORIZON - 180} 560 ${HORIZON - 380} C 760 ${HORIZON - 560} 900 ${HORIZON - 240} 1080 ${HORIZON - 340}`} fill="none" stroke={C.line} strokeWidth={46} />
    <path d={`M0 ${HORIZON - 260} C 200 ${HORIZON - 440} 360 ${HORIZON - 180} 560 ${HORIZON - 380} C 760 ${HORIZON - 560} 900 ${HORIZON - 240} 1080 ${HORIZON - 340}`} fill="none" stroke={WALL} strokeWidth={30} />
    {[[200, HORIZON - 400], [560, HORIZON - 420], [900, HORIZON - 330]].map(([x, y], i) => <rect key={i} x={x - 40} y={y - 70} width={80} height={90} fill={WALL} stroke={C.line} strokeWidth={9} />)}
    <path d={`M0 ${HORIZON} C 300 ${HORIZON - 40} 700 ${HORIZON + 30} 1080 ${HORIZON - 20} L1080 1920 L0 1920 Z`} fill="#A9B892" stroke={C.line} strokeWidth={LW} />
    {wob(f, 1) > 9 ? null : null}
  </g>
);
const Space: React.FC<{ f: number; earth?: number; night?: boolean }> = ({ f, earth = 1, night }) => (
  <g>
    <rect x={0} y={0} width={1080} height={1920} fill="#14172A" />
    {Array.from({ length: 40 }, (_, k) => <circle key={k} cx={(k * 197) % 1080} cy={(k * 131) % 1100} r={2 + (k % 3)} fill={C.cloud} opacity={0.4 + 0.6 * Math.abs(Math.sin(f / 11 + k))} />)}
    <circle cx={540} cy={1180 + 2600 * (1 - earth)} r={1700 * earth + 200} fill={night ? "#1E2740" : "#4F7FB5"} stroke={C.line} strokeWidth={LW} />
    {!night ? <path d={`M-100 ${1000 + 2600 * (1 - earth)} C 200 ${900 + 2600 * (1 - earth)} 400 ${1100 + 2600 * (1 - earth)} 760 ${960 + 2600 * (1 - earth)} C 900 ${910 + 2600 * (1 - earth)} 1100 ${1000 + 2600 * (1 - earth)} 1200 ${1040 + 2600 * (1 - earth)} L1200 1920 L-100 1920 Z`} fill="#B7A27A" stroke={C.line} strokeWidth={8} /> : null}
  </g>
);
const ASTRO = { coat: C.white, hat: "astronaut" as const };
const Capsule: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-120 140 L-60 -120 L60 -120 L120 140 Z" fill="#D8DCE0" stroke={C.line} strokeWidth={LW} strokeLinejoin="round" />
    <circle cx={0} cy={10} r={48} fill="#9FC3D4" stroke={C.line} strokeWidth={10} />
    <rect x={-160} y={20} width={60} height={20} fill={C.navy} stroke={C.line} strokeWidth={6} /><rect x={100} y={20} width={60} height={20} fill={C.navy} stroke={C.line} strokeWidth={6} />
  </g>
);
const wallPose = (f: number) => (
  <>
    <Space f={f} />
    <path d="M140 1180 C 300 1100 520 1240 760 1140 C 860 1100 940 1150 1000 1120" fill="none" stroke={C.line} strokeWidth={34} />
    <path d="M140 1180 C 300 1100 520 1240 760 1140 C 860 1100 940 1150 1000 1120" fill="none" stroke={C.yellow} strokeWidth={18} />
    <Capsule x={760} y={480} s={1.1} />
    <Bean x={360} y={760} s={1.0} {...ASTRO} face="happy" armR={150} armL={30} />
  </>
);

export const w01: React.FC<ShotProps> = ({ f }) => <Scene f={f}>{wallPose(f)}</Scene>;
export const w02: React.FC<ShotProps> = ({ f }) => {
  const k = ramp(f, 8, 20, move);
  return (
    <Scene f={f}>
      <Space f={f} />
      <g opacity={1 - k}>
        <path d="M140 1180 C 300 1100 520 1240 760 1140 C 860 1100 940 1150 1000 1120" fill="none" stroke={C.yellow} strokeWidth={18 * (1 - k)} />
      </g>
      <Capsule x={760} y={480} s={1.1} />
      <Bean x={360} y={760} s={1.0} {...ASTRO} face={k > 0.5 ? "panic" : "happy"} armR={150} armL={k > 0.5 ? 150 : 30} />
    </Scene>
  );
};
export const w03: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Hills f={f} />
    <g transform={`translate(540 330) scale(${mix(1.3, 1, pop(f, 2, 6))}) translate(-540 -330)`}>
      <Big x={540} y={290} size={130}>THE GREAT</Big>
      <Big x={540} y={420} size={130} color={C.yellow}>WALL MYTH</Big>
    </g>
  </Scene>
);
export const w04: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Hills f={f} />
    <g transform={`translate(540 420) scale(${pop(f, 10)})`}><Big x={0} y={0} size={110} color={C.yellow}>1000s OF MILES</Big></g>
  </Scene>
);
export const w05: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <rect x={0} y={0} width={1080} height={1920} fill="#CFE3E2" />
    <rect x={0} y={760} width={1080} height={300} fill={WALL} stroke={C.line} strokeWidth={LW} />
    {Array.from({ length: 7 }, (_, k) => <rect key={k} x={k * 160} y={700} width={100} height={70} fill={WALL} stroke={C.line} strokeWidth={8} />)}
    <rect x={0} y={1060} width={1080} height={860} fill="#A9B892" stroke={C.line} strokeWidth={LW} />
    <Bean x={540} y={1060} s={0.9} coat={C.red} face="happy" armL={20} armR={20} />
    <g opacity={ramp(f, 8, 14)}><path d="M120 640 L960 640" stroke={C.line} strokeWidth={8} /><path d="M120 610 L120 670 M960 610 L960 670" stroke={C.line} strokeWidth={8} /></g>
    <g transform={`translate(540 560) scale(${pop(f, 12)})`}><Big x={0} y={0} size={110} color={C.yellow}>A FEW METRES</Big></g>
  </Scene>
);
export const w06: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <Bean x={200} y={FEET} s={0.9} coat={C.navy} face="deadpan" armR={60} armL={20} />
    <path d={`M${mix(320, 960, ramp(f, 4, 30, move))} 860 L320 860`} stroke={C.line} strokeWidth={6} strokeDasharray="20 16" />
    <g transform="translate(980 860)"><path d="M0 -60 C 10 -20 -10 20 0 60" fill="none" stroke={C.line} strokeWidth={3} /></g>
    <g transform={`translate(640 520) scale(${pop(f, 12)})`}><Big x={0} y={0} size={110} color={C.yellow}>A HAIR</Big><Big x={0} y={120} size={80}>from miles away</Big></g>
  </Scene>
);
export const w07: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <rect x={0} y={0} width={1080} height={1920} fill="#B7A27A" />
    {Array.from({ length: 14 }, (_, k) => <circle key={k} cx={(k * 173) % 1080} cy={300 + ((k * 97) % 1000)} r={30 + (k % 4) * 14} fill="#A8936C" />)}
    <path d="M0 900 C 300 860 600 960 1080 880" fill="none" stroke="#B2A076" strokeWidth={22} />
    <g transform={`translate(540 520) scale(${pop(f, 10)})`}><Big x={0} y={0} size={110}>WHERE IS IT?</Big></g>
  </Scene>
);
export const w08: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Space f={f} earth={0.8} />
    <Capsule x={540} y={560} s={1.5} />
    <g transform={`translate(540 280) scale(${pop(f, 10)})`}><Big x={0} y={0} size={150} color={C.yellow}>2003</Big></g>
  </Scene>
);
export const w09: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Space f={f} earth={0.8} />
    <Bean x={540} y={1000} s={1.5} {...ASTRO} face="deadpan" armR={140 + wob(f, 3, 8)} armL={20} />
    <g transform={`translate(800 440) scale(${pop(f, 10)})`}><Big x={0} y={0} size={200}>?</Big></g>
  </Scene>
);
export const w10: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Hills f={f} />
    <Bean x={540} y={FEET} s={1.5} coat={C.red} face="deadpan" armR={-40 + wob(f, 2, 10)} armL={20} />
    <g transform={`translate(800 520) scale(${pop(f, 6)})`}><Big x={0} y={0} size={220}>?</Big></g>
  </Scene>
);
export const w11: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Timber />
    <Bean x={360} y={FEET} s={1.4} coat={C.navy} hat="tophat" face="smug" armR={150} armL={20} />
    <g transform={`translate(760 600) scale(${pop(f, 8)})`}>
      <path d="M-200 -90 L200 -90 L200 60 L-40 60 L-110 130 L-90 60 L-200 60 Z" fill={C.white} stroke={C.line} strokeWidth={10} strokeLinejoin="round" />
      <Ink x={0} y={0} size={44}>Totally visible!</Ink>
    </g>
    <Stamp f={f} a={24} x={540} y={380} text="NO ROCKETS YET" size={80} />
  </Scene>
);
export const w12: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <g transform={`translate(540 ${800 - pop(f, 2, 8) * 40}) rotate(${mix(-20, -3, pop(f, 2, 8))}) scale(${mix(0.4, 1.05, pop(f, 2, 8))})`}>
      <Newspaper x={0} y={0} head="SEEN FROM" sub="THE MOON!" />
    </g>
    <g transform={`translate(830 380) scale(${pop(f, 20)})`}><Big x={0} y={0} size={130} color={C.yellow}>1932</Big></g>
  </Scene>
);
export const w13: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <rect x={0} y={0} width={1080} height={1920} fill="#14172A" />
    <circle cx={540} cy={720} r={220} fill="#4F7FB5" stroke={C.line} strokeWidth={LW} />
    <path d="M400 640 C 460 600 520 640 560 610 C 600 650 560 700 500 720 C 450 730 420 690 400 640 Z" fill="#B7C48E" />
    <path d={`M0 ${HORIZON} C 300 ${HORIZON - 40} 700 ${HORIZON + 30} 1080 ${HORIZON - 20} L1080 1920 L0 1920 Z`} fill="#BDBDC2" stroke={C.line} strokeWidth={LW} />
    <Bean x={540} y={FEET + 40} s={1.2} {...ASTRO} face="deadpan" armL={20} armR={20} />
  </Scene>
);
export const w14: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Timber />
    {[0, 1, 2].map((i) => { const k = pop(f, 4 + i * 8); return k > 0 ? <g key={i} transform={`translate(${280 + i * 260} ${900 - i * 30}) rotate(${(i - 1) * 6}) scale(${k})`}><Book x={0} y={0} s={0.7} title="Facts!" /></g> : null; })}
    <g transform={`translate(540 420) scale(${pop(f, 28)})`}><Big x={0} y={0} size={120} color={C.yellow}>FOR DECADES</Big></g>
  </Scene>
);
export const w15: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Space f={f} night />
    {Array.from({ length: 30 }, (_, k) => <circle key={k} cx={100 + (k * 137) % 900} cy={1100 + ((k * 61) % 500)} r={6 + (k % 4) * 4} fill={C.yellow} opacity={0.7 + 0.3 * Math.abs(Math.sin(f / 7 + k))} />)}
    <g transform={`translate(540 420) scale(${pop(f, 12)})`}><Big x={0} y={0} size={120} color={C.yellow}>CITY LIGHTS</Big></g>
  </Scene>
);
export const w16: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Space f={f} earth={0.8} />
    <g transform="translate(540 760)">
      <rect x={-260} y={-160} width={360} height={320} rx={30} fill="#3A3F52" stroke={C.line} strokeWidth={LW} />
      <rect x={100} y={-90} width={mix(80, 260, ramp(f, 6, 30, move))} height={180} fill="#2B2E3A" stroke={C.line} strokeWidth={LW} />
      <circle cx={-80} cy={0} r={90} fill="#9FC3D4" stroke={C.line} strokeWidth={10} />
    </g>
    <g transform={`translate(540 420) scale(${pop(f, 20)})`}><Big x={0} y={0} size={130} color={C.yellow}>MAYBE</Big></g>
  </Scene>
);
export const w17: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Space f={f} earth={0.8} />
    <Bean x={540} y={1000} s={1.5} {...ASTRO} face="deadpan" armL={20} armR={20} />
    <Stamp f={f} a={12} x={540} y={420} text="NAKED EYE: NO" size={90} />
  </Scene>
);
export const w18: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Hills f={f} />
    <Rays f={f} x={540} y={800} o={0.3} />
    <Bean x={540} y={FEET} s={1.4} coat={C.red} face="happy" armL={150 + wob(f, 3, 10)} armR={150 - wob(f, 3, 10)} />
  </Scene>
);
export const w19: React.FC<ShotProps> = ({ f }) => <Scene f={f}><ZeroCard f={f} label="SEEN FROM THE MOON" /></Scene>;
/** The loop: back to the opening (wrong) version. */
export const w20: React.FC<ShotProps> = ({ f }) => <Scene f={f + 5}>{wallPose(f)}</Scene>;

export const SHOT_VIEWS: Record<string, React.FC<ShotProps>> = { w01, w02, w03, w04, w05, w06, w07, w08, w09, w10, w11, w12, w13, w14, w15, w16, w17, w18, w19, w20 };
void Card;
