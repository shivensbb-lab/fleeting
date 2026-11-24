import React from "react";
import { Bean } from "../ui/Bean";
import { Big, Book, C, Card, FEET, HORIZON, Ink, LW, Parchment, Scene, ShotProps, Stamp, ZeroCard, mix, move, pop, ramp, wob } from "./kit";

const TOGA = "#EDE6D6";
const CAESAR = { coat: TOGA, hat: "laurel" as const };
const BRUTUS = { coat: "#7E4A8C", hair: true };
const SENATORS = ["#B8A06A", "#5E7A4A", "#3D5A80", "#8B4A3A"];

const Senate: React.FC = () => (
  <g>
    <rect x={0} y={0} width={1080} height={1920} fill="#E6DCC8" />
    <path d="M0 200 L1080 200 L1080 250 L0 250 Z" fill="#D2C5AA" stroke={C.line} strokeWidth={8} />
    {[110, 400, 680, 970].map((x) => (
      <g key={x}>
        <rect x={x - 50} y={250} width={100} height={HORIZON - 250} fill="#F2ECDF" stroke={C.line} strokeWidth={8} />
        {[-24, 0, 24].map((d) => <path key={d} d={`M${x + d} 270 L${x + d} ${HORIZON - 20}`} stroke="#D2C5AA" strokeWidth={6} />)}
        <rect x={x - 66} y={230} width={132} height={30} fill="#D2C5AA" stroke={C.line} strokeWidth={7} />
      </g>
    ))}
    <rect x={0} y={HORIZON} width={1080} height={770} fill="#B9A98A" stroke={C.line} strokeWidth={LW} />
    {Array.from({ length: 6 }, (_, k) => <path key={k} d={`M${k * 200 - 40} ${HORIZON} L${k * 200 - 160} 1920`} stroke="#A4957A" strokeWidth={6} />)}
  </g>
);
const Dagger: React.FC<{ rot?: number }> = ({ rot = 0 }) => (
  <g transform={`rotate(${rot})`}>
    <path d="M-8 0 L8 0 L4 -90 L0 -110 L-4 -90 Z" fill="#C9CED6" stroke={C.line} strokeWidth={5} strokeLinejoin="round" />
    <rect x={-22} y={-4} width={44} height={12} rx={4} fill={C.yellow} stroke={C.line} strokeWidth={5} />
    <rect x={-6} y={8} width={12} height={30} fill={C.beam} stroke={C.line} strokeWidth={5} />
  </g>
);
const ScrollDoc: React.FC<{ x: number; y: number; s?: number; head: string; lines?: number }> = ({ x, y, s = 1, head, lines = 4 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-220} y={-260} width={440} height={520} fill="#F3EAD2" stroke={C.line} strokeWidth={8} />
    <rect x={-240} y={-290} width={480} height={40} rx={20} fill={C.parchLo} stroke={C.line} strokeWidth={8} />
    <rect x={-240} y={250} width={480} height={40} rx={20} fill={C.parchLo} stroke={C.line} strokeWidth={8} />
    <Ink x={0} y={-170} size={52} serif>{head}</Ink>
    {Array.from({ length: lines }, (_, k) => <path key={k} d={`M-170 ${-90 + k * 70} L${150 - (k % 2) * 60} ${-90 + k * 70}`} stroke={C.line} strokeWidth={6} opacity={0.5} />)}
  </g>
);
const stabbing = (f: number, brutusIn = true) => (
  <>
    <Senate />
    {[[150, 0], [340, 1], [760, 2], [930, 3]].map(([x, k]) => (
      <Bean key={k} x={x} y={FEET + (k % 2) * 20} s={1.0} coat={SENATORS[k]} hair face="angry" flip={x > 540} armR={130 + wob(f + k * 7, 2, 12)} holdR={<g transform="translate(0 -10)"><Dagger rot={x > 540 ? -40 : 40} /></g>} />
    ))}
    {brutusIn ? <Bean x={790} y={FEET + 60} s={1.15} {...BRUTUS} face="deadpan" flip armR={120} holdR={<g transform="translate(0 -10)"><Dagger rot={-40} /></g>} /> : null}
    <Bean x={540} y={FEET + 40} s={1.3} {...CAESAR} face="panic" armL={150} armR={150} />
  </>
);

export const b01: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    {stabbing(f, false)}
    <g transform={`translate(540 300) scale(${pop(f, 6)})`}><Big x={0} y={0} size={110} color={C.yellow}>15 MARCH, 44 BC</Big></g>
  </Scene>
);
const etTu = (f: number) => (
  <>
    {stabbing(f)}
    <g transform={`translate(540 340) scale(${pop(f, 10)})`}><Card x={0} y={0} w={760} h={190}><Big x={0} y={50} size={110} color={C.red}>ET TU, BRUTE?</Big></Card></g>
  </>
);
export const b02: React.FC<ShotProps> = ({ f }) => <Scene f={f}>{etTu(f)}</Scene>;
export const b03: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    {stabbing(f)}
    <Stamp f={f} a={6} x={540} y={340} text="PROBABLY NOT" size={100} />
  </Scene>
);
export const b04: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Senate />
    <Bean x={540} y={FEET} s={1.15} {...CAESAR} face="deadpan" />
    <g transform={`translate(540 330) scale(${mix(1.3, 1, pop(f, 2, 6))}) translate(-540 -330)`}>
      <Big x={540} y={290} size={150}>CAESAR</Big>
      <Big x={540} y={410} size={80} color={C.yellow}>THE SHAKESPEARE MYTH</Big>
    </g>
  </Scene>
);
const Stage: React.FC = () => (
  <g>
    <rect x={0} y={0} width={1080} height={1920} fill="#3A2A2E" />
    <path d="M0 0 L300 0 Q 220 600 120 1150 L0 1150 Z" fill={C.red} stroke={C.line} strokeWidth={LW} />
    <path d="M1080 0 L780 0 Q 860 600 960 1150 L1080 1150 Z" fill={C.red} stroke={C.line} strokeWidth={LW} />
    <rect x={0} y={HORIZON} width={1080} height={770} fill="#8B6440" stroke={C.line} strokeWidth={LW} />
    {Array.from({ length: 8 }, (_, k) => <path key={k} d={`M0 ${HORIZON + 40 + k * 100} L1080 ${HORIZON + 40 + k * 100}`} stroke="#6E4C2E" strokeWidth={5} />)}
  </g>
);
const SHAKES = { coat: "#3A3A44", hair: true, beard: C.hair, tache: C.hair };
export const b05: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Stage />
    <Bean x={540} y={FEET} s={1.4} {...SHAKES} face="smug" armR={130} holdR={<g transform="translate(0 -10) rotate(30)"><path d="M0 0 C 10 -40 40 -90 60 -120 C 30 -100 10 -60 0 0 Z" fill={C.white} stroke={C.line} strokeWidth={5} /></g>} />
    <g transform={`translate(540 330) scale(${pop(f, 10)})`}><Big x={0} y={0} size={110} color={C.yellow}>SHAKESPEARE</Big></g>
  </Scene>
);
export const b06: React.FC<ShotProps> = ({ f }) => {
  const k = ramp(f, 4, 40, move);
  const yr = Math.round(mix(-44, 1599, k));
  return (
    <Scene f={f}>
      <Parchment />
      <path d="M120 760 L960 760" stroke={C.line} strokeWidth={10} />
      <circle cx={120} cy={760} r={22} fill={C.red} stroke={C.line} strokeWidth={6} />
      <circle cx={mix(120, 960, k)} cy={760} r={22} fill={C.yellow} stroke={C.line} strokeWidth={6} />
      <Ink x={140} y={850} size={46}>44 BC</Ink>
      <Ink x={940} y={850} size={46}>1599</Ink>
      <g transform="translate(540 520)"><Big x={0} y={0} size={130} color={C.yellow}>{yr < 0 ? `${-yr} BC` : `AD ${yr}`}</Big></g>
      {k > 0.95 ? <Stamp f={f} a={42} x={540} y={1030} text="1,600+ YEARS" size={90} rot={-4} /> : null}
    </Scene>
  );
};
export const b07: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Senate />
    {[260, 540, 820].map((x, i) => pop(f, 4 + i * 6) > 0 ? <ScrollDoc key={x} x={x} y={720} s={0.55 * pop(f, 4 + i * 6)} head="?" /> : null)}
  </Scene>
);
export const b08: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <ScrollDoc x={300} y={720} s={0.8} head="SUETONIUS" />
    <Bean x={800} y={FEET} s={1.15} {...CAESAR} face="blank" />
    <g transform={`translate(800 470) scale(${pop(f, 14)})`}><Card x={0} y={0} w={300} h={140}><Big x={0} y={40} size={90} color={C.line}>UGH.</Big></Card></g>
  </Scene>
);
export const b09: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <ScrollDoc x={540} y={720} s={0.9} head="SUETONIUS" />
    <Stamp f={f} a={10} x={540} y={300} text="SOME SAY..." size={100} color="#3D5A80" rot={-3} />
  </Scene>
);
export const b10: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    {stabbing(f)}
    <g transform={`translate(540 330) scale(${pop(f, 8)})`}>
      <Card x={0} y={0} w={780} h={260}>
        <Big x={0} y={-10} size={90} color={C.red}>ΚΑΙ ΣΥ, ΤΕΚΝΟΝ;</Big>
        <Ink x={0} y={80} size={52}>"You too, child?"</Ink>
      </Card>
    </g>
  </Scene>
);
export const b11: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Senate />
    <Bean x={330} y={FEET} s={1.25} coat="#3D5A80" hair face="smug" armR={110} tache={C.hair} />
    <Bean x={750} y={FEET} s={1.25} coat="#B8A06A" hair face="smug" flip armR={110} />
    <g transform={`translate(540 340) scale(${pop(f, 6)})`}><Big x={0} y={0} size={120} color={C.yellow}>ΑΛΦΑ ΒΗΤΑ</Big></g>
    <Stamp f={f} a={22} x={540} y={520} text="FANCY" size={90} color="#7E4A8C" rot={4} />
  </Scene>
);
export const b12: React.FC<ShotProps> = ({ f }) => {
  const k = ramp(f, 30, 44, move);
  return (
    <Scene f={f}>
      <Senate />
      <Bean x={760} y={FEET} s={1.15} {...BRUTUS} face="deadpan" flip armR={120} holdR={<g transform="translate(0 -10)"><Dagger rot={-40} /></g>} />
      <Bean x={340} y={FEET} s={1.3} {...CAESAR} face={k > 0.5 ? "blank" : "panic"} armL={mix(20, 170, k)} armR={mix(20, 170, k)} />
      {k > 0 ? <path transform={`translate(340 ${FEET - 300 * 1.3}) scale(1.3)`} d={`M-70 ${mix(60, -80, k)} C -80 ${mix(20, -130, k)} 80 ${mix(20, -130, k)} 70 ${mix(60, -80, k)} L70 60 C 40 70 -40 70 -70 60 Z`} fill={TOGA} stroke={C.line} strokeWidth={9} strokeLinejoin="round" /> : null}
      <g transform={`translate(540 300) scale(${pop(f, 6)})`}><Big x={0} y={0} size={110} color={C.yellow}>PLUTARCH</Big></g>
    </Scene>
  );
};
export const b13: React.FC<ShotProps> = ({ f }) => {
  const n = Math.min(23, Math.floor(ramp(f, 2, 36) * 23) + 1);
  return (
    <Scene f={f}>
      <Parchment />
      {Array.from({ length: n }, (_, k) => <g key={k} transform={`translate(${200 + (k % 6) * 136} ${620 + Math.floor(k / 6) * 150}) scale(0.7)`}><Dagger rot={-20} /></g>)}
      <g transform="translate(540 330)"><Big x={0} y={0} size={160} color={C.red}>{n}</Big></g>
    </Scene>
  );
};
export const b14: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Senate />
    <Bean x={330} y={FEET} s={1.25} coat={TOGA} hair beard="#C9C3B4" face="deadpan" armR={120} holdR={<g transform="translate(0 -20) scale(0.22)"><Book x={0} y={0} title="" /></g>} />
    <g transform="translate(760 760)">
      {Array.from({ length: 6 }, (_, k) => <circle key={k} cx={(k % 3) * 90 - 90} cy={Math.floor(k / 3) * 110 - 50} r={28} fill={k === 1 && f > 14 ? C.red : "#C9C3B4"} stroke={C.line} strokeWidth={6} />)}
    </g>
    <Stamp f={f} a={14} x={760} y={480} text="ONE DEADLY" size={80} />
  </Scene>
);
export const b15: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <g transform={`translate(540 720) scale(${pop(f, 4)})`}><Card x={0} y={0} w={760} h={220}><Big x={0} y={50} size={110} color={C.red}>ET TU, BRUTE?</Big></Card></g>
    <g transform={`translate(540 400) scale(${pop(f, 16)})`}><Big x={0} y={0} size={160} color={C.yellow}>?</Big></g>
  </Scene>
);
export const b16: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Stage />
    {[0, 1, 2].map((k) => pop(f, 4 + k * 8) > 0 ? <ScrollDoc key={k} x={260 + k * 280} y={760} s={0.5 * pop(f, 4 + k * 8)} head="PLAY" /> : null)}
    <Stamp f={f} a={26} x={540} y={380} text="BEFORE 1599" size={90} rot={-3} />
  </Scene>
);
export const b17: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Stage />
    <Rays f={f} x={540} y={700} o={0.3} />
    <Bean x={540} y={FEET} s={1.4} {...SHAKES} face="happy" armL={150} armR={150} />
    <g transform={`translate(540 330) scale(${pop(f, 8)})`}><Big x={0} y={0} size={130} color={C.yellow}>FAMOUS</Big></g>
  </Scene>
);
const Rays: React.FC<{ f: number; x: number; y: number; o?: number }> = ({ f, x, y, o = 0.5 }) => (
  <g transform={`translate(${x} ${y}) rotate(${f * 0.6})`} opacity={o}>
    {Array.from({ length: 12 }, (_, k) => <path key={k} d="M0 0 L-60 -900 L60 -900 Z" fill={C.yellow} transform={`rotate(${k * 30})`} />)}
  </g>
);
export const b18: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Senate />
    <Bean x={540} y={FEET} s={1.3} {...CAESAR} face="deadpan" />
    <g transform={`translate(540 380) scale(${pop(f, 8)})`}><Card x={0} y={0} w={600} h={160}><Big x={0} y={50} size={110} color={C.line}>? ? ?</Big></Card></g>
  </Scene>
);
export const b19: React.FC<ShotProps> = ({ f }) => <Scene f={f}><ZeroCard f={f} label="PROOF HE SAID IT" /></Scene>;
/** The loop: back to the opening (wrong) version. */
export const b20: React.FC<ShotProps> = ({ f }) => <Scene f={f + 5}>{etTu(f + 10)}</Scene>;

export const SHOT_VIEWS: Record<string, React.FC<ShotProps>> = { b01, b02, b03, b04, b05, b06, b07, b08, b09, b10, b11, b12, b13, b14, b15, b16, b17, b18, b19, b20 };
