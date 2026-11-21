import React from "react";
import { Bean } from "../ui/Bean";
import { Big, Book, C, Card, FEET, HORIZON, Ink, LW, Parchment, Rays, Scene, ShotProps, Stamp, Timber, ZeroCard, mix, move, pop, ramp, wob } from "./kit";

const ROMAN = { coat: "#F2EEE4", hat: "laurel" as const };
const GUEST = { coat: "#C9B79A" };
const Villa: React.FC = () => (
  <g>
    <rect x={0} y={0} width={1080} height={1920} fill="#E8C9A8" />
    {[140, 940].map((x) => <rect key={x} x={x - 34} y={0} width={68} height={HORIZON} fill={C.white} stroke={C.line} strokeWidth={8} />)}
    <rect x={0} y={260} width={1080} height={40} fill="#B85C3E" stroke={C.line} strokeWidth={8} />
    <rect x={0} y={HORIZON} width={1080} height={770} fill="#B88A5A" stroke={C.line} strokeWidth={LW} />
    {Array.from({ length: 6 }, (_, k) => <rect key={k} x={k * 180} y={HORIZON} width={90} height={770} fill="#A9784A" opacity={0.5} />)}
  </g>
);
const Table: React.FC = () => (
  <g>
    <rect x={260} y={1000} width={560} height={40} fill={C.beam} stroke={C.line} strokeWidth={LW} />
    <rect x={300} y={1040} width={24} height={150} fill={C.beam} stroke={C.line} strokeWidth={6} /><rect x={756} y={1040} width={24} height={150} fill={C.beam} stroke={C.line} strokeWidth={6} />
    {[340, 460, 620, 740].map((x, i) => <g key={x}>{i % 2 ? <circle cx={x} cy={975} r={30} fill={["#B03A3A", "#7E8538"][i % 2]} stroke={C.line} strokeWidth={6} /> : <ellipse cx={x} cy={980} rx={50} ry={24} fill="#D9A24E" stroke={C.line} strokeWidth={6} />}</g>)}
  </g>
);
const Colosseum: React.FC<{ f: number; crowd?: number }> = ({ f, crowd = 0 }) => (
  <g>
    <rect x={0} y={0} width={1080} height={1920} fill="#9FC3D4" />
    <rect x={40} y={340} width={1000} height={HORIZON - 340} fill="#D9C29A" stroke={C.line} strokeWidth={LW} />
    {[0, 1, 2].map((r) => Array.from({ length: 6 }, (_, k) => <path key={`${r}${k}`} d={`M${90 + k * 160} ${440 + r * 220} a60 80 0 0 1 120 0 L${210 + k * 160} ${590 + r * 220} L${90 + k * 160} ${590 + r * 220} Z`} fill="#6E5A44" stroke={C.line} strokeWidth={7} />))}
    {crowd > 0 ? Array.from({ length: 6 }, (_, k) => <circle key={k} cx={150 + k * 160} cy={560 + 440 + Math.abs(wob(f + k * 4, 2, 6))} r={22 * crowd} fill={C.skin} stroke={C.line} strokeWidth={5} />) : null}
    <rect x={0} y={HORIZON} width={1080} height={770} fill="#C9A877" stroke={C.line} strokeWidth={LW} />
  </g>
);
const feastPose = (f: number) => (
  <>
    <Villa />
    <Table />
    <Bean x={260} y={FEET} s={1.2} {...ROMAN} face="happy" armR={130 + wob(f, 2, 10)} armL={20} />
    <Bean x={600} y={FEET} s={1.0} {...GUEST} face="smug" armL={20} armR={60} />
    <g transform={`translate(900 ${FEET})`}><rect x={-80} y={-520} width={160} height={520} fill="#3A2A2A" stroke={C.line} strokeWidth={LW} /><g transform="translate(0 -560)"><Card x={0} y={0} w={240} h={70}><Ink x={0} y={12} size={30}>VOMITORIUM →</Ink></Card></g></g>
  </>
);

export const v01: React.FC<ShotProps> = ({ f }) => <Scene f={f}>{feastPose(f)}</Scene>;
export const v02: React.FC<ShotProps> = ({ f }) => <Scene f={f}>{feastPose(f)}<Stamp f={f} a={12} x={540} y={420} text="WRONG ROOM" size={110} /></Scene>;
export const v03: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Villa />
    <Bean x={540} y={FEET} s={1.15} {...ROMAN} face="deadpan" />
    <g transform={`translate(540 330) scale(${mix(1.3, 1, pop(f, 2, 6))}) translate(-540 -330)`}>
      <Big x={540} y={290} size={130}>VOMITORIUM</Big>
      <Big x={540} y={410} size={90} color={C.yellow}>THE MYTH</Big>
    </g>
  </Scene>
);
export const v04: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Villa />
    <Bean x={540} y={FEET} s={1.5} {...ROMAN} face="panic" skin={f > 10 ? "#CFE0B0" : undefined} armL={150} armR={60} />
  </Scene>
);
export const v05: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Villa />
    <Table />
    <Bean x={300} y={FEET} s={1.2} {...ROMAN} face="happy" armR={130 + wob(f, 1.5, 14)} armL={20} />
    <g transform={`translate(760 520) scale(${pop(f, 10)})`}><Big x={0} y={0} size={110} color={C.yellow}>MORE!</Big></g>
  </Scene>
);
export const v06: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <rect x={0} y={0} width={1080} height={1920} fill="#D9C29A" />
    <path d="M200 1500 L380 500 L700 500 L880 1500 Z" fill="#6E5A44" stroke={C.line} strokeWidth={LW} strokeLinejoin="round" />
    <path d="M380 500 L540 300 L700 500" fill="none" stroke={C.line} strokeWidth={LW} />
    <g transform={`translate(540 380) scale(${pop(f, 10)})`}><Big x={0} y={0} size={120} color={C.yellow}>A CORRIDOR</Big></g>
  </Scene>
);
export const v07: React.FC<ShotProps> = ({ f }) => <Scene f={f}><Colosseum f={f} /></Scene>;
export const v08: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <Book x={540} y={760} s={1.5} open={1} />
    <g transform={`translate(540 780) scale(${pop(f, 6)})`}><rect x={-280} y={-60} width={560} height={110} fill={C.yellow} opacity={0.75} /><Ink x={0} y={20} size={60} serif>vomere = spew out</Ink></g>
  </Scene>
);
export const v09: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Colosseum f={f} />
    {Array.from({ length: 8 }, (_, k) => { const t = ramp(f, k * 3, k * 3 + 30, move); return <Bean key={k} x={540 + (k % 3 - 1) * 60} y={mix(900, FEET, t) + (k % 2) * 30} s={0.6} coat={["#C9B79A", "#7E4A8C", "#3D6E8C", C.red][k % 4]} face="happy" armL={20} armR={20} />; })}
    <g transform={`translate(540 360) scale(${pop(f, 14)})`}><Big x={0} y={0} size={120} color={C.yellow}>CROWDS</Big></g>
  </Scene>
);
export const v10: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Colosseum f={f} />
    {Array.from({ length: 12 }, (_, k) => { const kk = pop(f, 2 + k * 2); return kk > 0 ? <circle key={k} cx={150 + (k % 6) * 160} cy={490 + Math.floor(k / 6) * 220} r={18 * kk} fill={C.yellow} stroke={C.line} strokeWidth={5} /> : null; })}
    <g transform={`translate(540 300) scale(${pop(f, 28)})`}><Big x={0} y={0} size={110} color={C.yellow}>DOZENS</Big></g>
  </Scene>
);
export const v11: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Colosseum f={f} crowd={1 - ramp(f, 4, 40, move)} />
    <g transform="translate(860 520)"><circle cx={0} cy={0} r={110} fill={C.white} stroke={C.line} strokeWidth={LW} /><path d={`M0 0 L${Math.sin(ramp(f, 4, 40) * 4) * 80} ${-Math.cos(ramp(f, 4, 40) * 4) * 80}`} stroke={C.red} strokeWidth={12} strokeLinecap="round" /></g>
  </Scene>
);
export const v12: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <rect x={0} y={0} width={1080} height={1920} fill="#9FC3D4" />
    <path d="M0 400 L1080 400 L1080 1150 L0 1150 Z" fill="#5D6470" stroke={C.line} strokeWidth={LW} />
    {Array.from({ length: 5 }, (_, r) => <path key={r} d={`M0 ${480 + r * 120} L1080 ${480 + r * 120}`} stroke="#8A94A3" strokeWidth={10} />)}
    {[270, 810].map((x) => <path key={x} d={`M${x - 70} 1150 L${x - 50} 820 L${x + 50} 820 L${x + 70} 1150 Z`} fill="#2A2C30" stroke={C.line} strokeWidth={8} />)}
    <rect x={0} y={HORIZON} width={1080} height={770} fill="#7FA05A" stroke={C.line} strokeWidth={LW} />
    <g transform={`translate(540 300) scale(${pop(f, 10)})`}><Big x={0} y={0} size={100} color={C.yellow}>STILL HERE</Big></g>
  </Scene>
);
export const v13: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Villa />
    <Bean x={540} y={FEET} s={1.5} {...ROMAN} face="deadpan" armR={-40 + wob(f, 2, 10)} armL={20} />
    <g transform={`translate(800 520) scale(${pop(f, 6)})`}><Big x={0} y={0} size={220}>?</Big></g>
  </Scene>
);
export const v14: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <g transform={`translate(540 700) scale(${pop(f, 4)})`}><Big x={0} y={0} size={150}>VOMIT-orium</Big></g>
    <g transform={`translate(540 960) scale(${pop(f, 18)})`}><Big x={0} y={0} size={90} color={C.yellow}>SOUNDS LIKE...</Big></g>
  </Scene>
);
export const v15: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Timber />
    <Bean x={300} y={FEET} s={1.3} coat={C.navy} hat="tophat" face="smug" armR={100 + wob(f, 1.6, 10)} armL={20} holdR={<path d="M0 0 L40 -70" stroke={C.line} strokeWidth={10} strokeLinecap="round" />} />
    <g transform={`translate(760 780) scale(${pop(f, 8)})`}><Book x={0} y={0} s={0.9} title="Novel" /></g>
    <g transform={`translate(540 360) scale(${pop(f, 16)})`}><Big x={0} y={0} size={140} color={C.yellow}>1900s</Big></g>
  </Scene>
);
export const v16: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Villa />
    <Table />
    <Bean x={540} y={FEET} s={1.4} {...ROMAN} face="panic" skin="#CFE0B0" armL={150} armR={60} />
    <g transform={`translate(860 520) scale(${pop(f, 12)})`}><Big x={0} y={0} size={90} color={C.yellow}>A FEW</Big></g>
  </Scene>
);
export const v17: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Villa />
    <rect x={390} y={600} width={300} height={590} fill="none" stroke={C.line} strokeWidth={10} strokeDasharray="30 22" />
    <Stamp f={f} a={10} x={540} y={420} text="NO SUCH ROOM" size={96} />
  </Scene>
);
export const v18: React.FC<ShotProps> = ({ f }) => <Scene f={f}><ZeroCard f={f} label="VOMIT ROOMS" /></Scene>;
export const v19: React.FC<ShotProps> = ({ f }) => <Scene f={f}><ZeroCard f={f} label="CROWD EXITS" value="LOTS" /></Scene>;
/** The loop: back to the opening (wrong) version. */
export const v20: React.FC<ShotProps> = ({ f }) => <Scene f={f + 5}>{feastPose(f)}</Scene>;

export const SHOT_VIEWS: Record<string, React.FC<ShotProps>> = { v01, v02, v03, v04, v05, v06, v07, v08, v09, v10, v11, v12, v13, v14, v15, v16, v17, v18, v19, v20 };
void Rays;
