import React from "react";
import { Bean } from "../ui/Bean";
import { Big, Book, C, Card, FEET, HORIZON, Ink, LW, Parchment, Rays, Scene, ShotProps, Stamp, ZeroCard, mix, move, pop, ramp, wob } from "./kit";

const PIRATE = { coat: "#7A3B2E", hat: "pirate" as const, beard: "#3A2620" };
const SAILOR = { coat: C.navy, hat: "none" as const };
const SEA = "#5E8FAE";
const Deck: React.FC<{ f: number; plank?: boolean }> = ({ f, plank = true }) => (
  <g>
    <rect x={0} y={0} width={1080} height={1920} fill="#BFD8E2" />
    <rect x={0} y={HORIZON - 40} width={1080} height={900} fill={SEA} />
    {[0, 1, 2, 3].map((k) => <path key={k} d={`M${(k * 300 + f * 3) % 1180 - 100} ${HORIZON + 40 + k * 120} q40 -20 80 0 q40 20 80 0`} fill="none" stroke="#DCEBF2" strokeWidth={8} strokeLinecap="round" />)}
    <path d="M-40 1100 L560 1100 L520 1500 L-40 1500 Z" fill="#8B6440" stroke={C.line} strokeWidth={LW} strokeLinejoin="round" />
    {[0, 1, 2].map((k) => <path key={k} d={`M-40 ${1180 + k * 100} L${545 - k * 10} ${1180 + k * 100}`} stroke="#6E4C2E" strokeWidth={6} />)}
    <rect x={60} y={300} width={30} height={800} fill={C.beam} stroke={C.line} strokeWidth={8} />
    <path d="M90 340 L420 420 L90 700 Z" fill={C.white} stroke={C.line} strokeWidth={LW} strokeLinejoin="round" />
    {plank ? <g><rect x={500} y={1080} width={420} height={36} fill="#B8875A" stroke={C.line} strokeWidth={9} /><path d="M520 1116 L520 1160" stroke={C.line} strokeWidth={10} /></g> : null}
  </g>
);
const Chest: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-110} y={-80} width={220} height={120} fill={C.beam} stroke={C.line} strokeWidth={10} />
    <path d="M-110 -80 Q0 -170 110 -80 Z" fill="#8B6440" stroke={C.line} strokeWidth={10} />
    {[-40, 0, 40].map((x2) => <circle key={x2} cx={x2} cy={-110} r={18} fill={C.yellow} stroke={C.line} strokeWidth={5} />)}
    <rect x={-16} y={-60} width={32} height={34} fill={C.yellow} stroke={C.line} strokeWidth={5} />
  </g>
);
const plankPose = (f: number) => (
  <>
    <Deck f={f} />
    <Bean x={260} y={1100} s={1.1} {...PIRATE} face="angry" armR={120} armL={20} holdR={<path d="M0 0 L40 -120" stroke="#D8DCE0" strokeWidth={14} strokeLinecap="round" />} />
    <Bean x={mix(560, 760, ramp(f, 4, 40, move))} y={1080} s={0.9} {...SAILOR} face="panic" armL={150} armR={150} />
  </>
);

export const p01: React.FC<ShotProps> = ({ f }) => <Scene f={f}>{plankPose(f)}</Scene>;
export const p02: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    {plankPose(f)}
    <Stamp f={f} a={12} x={540} y={520} text="RARE" size={150} />
  </Scene>
);
export const p03: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Deck f={f} />
    <Bean x={300} y={1100} s={1.0} {...PIRATE} face="deadpan" />
    <g transform={`translate(540 330) scale(${mix(1.3, 1, pop(f, 2, 6))}) translate(-540 -330)`}>
      <Big x={540} y={290} size={140}>PIRATES</Big>
      <Big x={540} y={410} size={90} color={C.yellow}>THE PLANK MYTH</Big>
    </g>
  </Scene>
);
export const p04: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Deck f={f} plank={false} />
    <Bean x={260} y={1100} s={1.1} {...PIRATE} face="happy" armL={150} armR={150} />
    <g transform={`translate(780 ${1000 - pop(f, 6) * 40}) scale(${pop(f, 6)})`}><Chest x={0} y={0} s={1.3} /></g>
  </Scene>
);
export const p05: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Deck f={f} plank={false} />
    <Bean x={260} y={1100} s={1.1} {...PIRATE} face="smug" armR={60} armL={20} />
    {[600, 800].map((x) => <Bean key={x} x={x} y={1080} s={0.9} {...SAILOR} face="deadpan" armL={170} armR={170} />)}
    <g transform={`translate(1000 820) scale(${pop(f, 10)})`}><rect x={-6} y={-200} width={12} height={240} fill={C.beam} /><rect x={6} y={-200} width={110} height={70} fill={C.white} stroke={C.line} strokeWidth={6} /></g>
  </Scene>
);
export const p06: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Deck f={f} />
    <Bean x={300} y={1100} s={1.1} {...PIRATE} face="deadpan" armR={-30 + wob(f, 2, 8)} armL={20} />
    <g transform={`translate(700 700) scale(${pop(f, 10)})`}><Big x={0} y={0} size={120} color={C.yellow}>EFFORT</Big></g>
  </Scene>
);
export const p07: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Deck f={f} plank={false} />
    <Bean x={300} y={1100} s={1.1} {...PIRATE} face="angry" armR={60} armL={20} />
    <Bean x={600} y={1080} s={0.9} {...SAILOR} face="panic" armL={150} armR={150} />
  </Scene>
);
export const p08: React.FC<ShotProps> = ({ f }) => {
  const k = ramp(f, 6, 26, move);
  return (
    <Scene f={f}>
      <Deck f={f} plank={false} />
      <Bean x={300} y={1100} s={1.1} {...PIRATE} face="smug" armR={150} armL={20} />
      <g transform={`translate(${mix(600, 820, k)} ${mix(1080, 1400, k * k)}) rotate(${k * 60})`}><Bean x={0} y={0} s={0.9} {...SAILOR} face="panic" armL={150} armR={150} /></g>
      {k > 0.9 ? <g transform={`translate(820 1340) scale(${pop(f, 26)})`}><Big x={0} y={0} size={110} color={C.white}>SPLASH</Big></g> : null}
    </Scene>
  );
};
export const p09: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <rect x={0} y={0} width={1080} height={1920} fill="#BFD8E2" />
    <rect x={0} y={900} width={1080} height={1020} fill={SEA} />
    <ellipse cx={540} cy={1080} rx={360} ry={110} fill="#E8D9A8" stroke={C.line} strokeWidth={LW} />
    <path d="M600 1040 C 590 900 610 820 660 760" stroke={C.beam} strokeWidth={22} fill="none" strokeLinecap="round" />
    {[0, 1, 2, 3, 4].map((k) => <path key={k} d={`M660 760 q${-80 + k * 40} ${-30 + (k % 2) * 20} ${-120 + k * 60} ${40}`} stroke="#5E7A4A" strokeWidth={18} fill="none" strokeLinecap="round" />)}
    <Bean x={460} y={1060} s={0.9} {...SAILOR} face="deadpan" armL={20} armR={20} />
    <g transform={`translate(540 480) scale(${pop(f, 14)})`}><Big x={0} y={0} size={110} color={C.yellow}>MAROONED</Big></g>
  </Scene>
);
export const p10: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Deck f={f} />
    <Bean x={300} y={1100} s={1.1} {...PIRATE} face="deadpan" armR={-40 + wob(f, 2, 10)} armL={20} />
    <g transform={`translate(760 820) scale(${pop(f, 6)})`}><Big x={0} y={0} size={220}>?</Big></g>
  </Scene>
);
export const p11: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    {[0, 1, 2].map((i) => { const k = pop(f, 4 + i * 8); return k > 0 ? <g key={i} transform={`translate(${280 + i * 260} ${780 + (i % 2) * 60}) rotate(${(i - 1) * 6}) scale(${k})`}><Card x={0} y={0} w={240} h={320} fill="#F1ECE0"><Ink x={0} y={-100} size={36}>REPORT</Ink>{[0, 1, 2].map((j) => <path key={j} d={`M-90 ${-40 + j * 50} L90 ${-40 + j * 50}`} stroke={C.parchLo} strokeWidth={8} />)}</Card></g> : null; })}
    <g transform={`translate(540 420) scale(${pop(f, 26)})`}><Big x={0} y={0} size={140} color={C.yellow}>A FEW</Big></g>
  </Scene>
);
export const p12: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <Card x={540} y={760} w={560} h={600} rot={-3}>
      <rect x={-280} y={-300} width={560} height={130} fill={C.red} stroke={C.line} strokeWidth={10} />
      <Ink x={0} y={-215} size={60} color={C.white}>MOSTLY</Ink>
      <g transform={`scale(${pop(f, 6)})`}><Big x={0} y={110} size={190} color={C.yellow}>1800s</Big></g>
    </Card>
  </Scene>
);
export const p13: React.FC<ShotProps> = ({ f }) => {
  const x = (yr: number) => 120 + ((yr - 1600) / 300) * 840;
  return (
    <Scene f={f}>
      <Parchment />
      <path d="M100 900 L980 900" stroke={C.line} strokeWidth={14} strokeLinecap="round" />
      <rect x={x(1650)} y={860} width={(x(1730) - x(1650)) * ramp(f, 4, 20, move)} height={80} fill={C.yellow} stroke={C.line} strokeWidth={8} />
      <Ink x={(x(1650) + x(1730)) / 2} y={830} size={40}>golden age</Ink>
      {pop(f, 24) > 0 ? <g transform={`translate(${x(1829)} 900) scale(${pop(f, 24)})`}><circle cx={0} cy={0} r={24} fill={C.red} stroke={C.line} strokeWidth={8} /><Ink x={0} y={80} size={40}>plank reports</Ink></g> : null}
      <Ink x={x(1600) + 30} y={990} size={36}>1600</Ink><Ink x={x(1900) - 30} y={990} size={36}>1900</Ink>
    </Scene>
  );
};
export const p14: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Deck f={f} />
    <Bean x={300} y={1100} s={1.1} {...PIRATE} face="smug" armR={-40 + wob(f, 2, 10)} armL={20} />
    <g transform={`translate(760 820) scale(${pop(f, 6)})`}><Big x={0} y={0} size={220}>?</Big></g>
  </Scene>
);
export const p15: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <Book x={330} y={820} s={0.9} title="Pirates!" />
    <g transform={`translate(760 ${800 - pop(f, 10) * 30}) rotate(4) scale(${pop(f, 10)})`}>
      <Card x={0} y={0} w={380} h={460} fill="#F1ECE0">
        <g transform="translate(0 180) scale(0.55)"><Bean x={0} y={0} s={1} {...PIRATE} face="angry" armR={120} armL={20} /></g>
      </Card>
    </g>
  </Scene>
);
export const p16: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <rect x={0} y={0} width={1080} height={1920} fill="#2A2530" />
    <rect x={60} y={260} width={960} height={HORIZON - 260} fill="#3F5A7A" stroke={C.line} strokeWidth={LW} />
    {Array.from({ length: 20 }, (_, k) => <circle key={k} cx={100 + (k * 173) % 880} cy={320 + ((k * 89) % 400)} r={4} fill={C.cloud} />)}
    <rect x={0} y={HORIZON} width={1080} height={770} fill="#6E4C2E" stroke={C.line} strokeWidth={LW} />
    <Bean x={420} y={FEET} s={1.3} coat={C.red} hat="pirate" tache={C.line} face="smug" armR={120} armL={20}
      holdR={<path d="M0 0 C 30 -20 40 -60 10 -80" stroke="#D8DCE0" strokeWidth={14} fill="none" strokeLinecap="round" />} />
    <g transform={`translate(780 560) scale(${pop(f, 10)})`}><Big x={0} y={0} size={110} color={C.yellow}>1904</Big></g>
  </Scene>
);
export const p17: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <rect x={0} y={0} width={1080} height={1920} fill="#2A2530" />
    <rect x={90} y={360} width={900} height={560} fill="#BFD8E2" stroke={C.line} strokeWidth={14} />
    <rect x={90} y={760} width={900} height={160} fill={SEA} />
    <rect x={420} y={720} width={400} height={30} fill="#B8875A" stroke={C.line} strokeWidth={8} />
    <g transform="translate(700 720) scale(0.55)"><Bean x={0} y={0} s={1} {...SAILOR} face="panic" armL={150} armR={150} /></g>
    {Array.from({ length: 6 }, (_, k) => <circle key={k} cx={180 + k * 144} cy={1100 + (k % 2) * 30} r={48} fill="#4A4250" stroke={C.line} strokeWidth={8} />)}
  </Scene>
);
export const p18: React.FC<ShotProps> = ({ f }) => <Scene f={f}><ZeroCard f={f} label="GOLDEN AGE WALKS" value="~0" /></Scene>;
export const p19: React.FC<ShotProps> = ({ f }) => <Scene f={f}><ZeroCard f={f} label="IN THE MOVIES" value="LOTS" /></Scene>;
/** The loop: back to the opening (wrong) version. */
export const p20: React.FC<ShotProps> = ({ f }) => <Scene f={f + 5}>{plankPose(f)}</Scene>;

export const SHOT_VIEWS: Record<string, React.FC<ShotProps>> = { p01, p02, p03, p04, p05, p06, p07, p08, p09, p10, p11, p12, p13, p14, p15, p16, p17, p18, p19, p20 };
void Rays;
