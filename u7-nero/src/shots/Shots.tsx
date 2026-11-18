import React from "react";
import { Bean } from "../ui/Bean";
import { Big, Book, C, Card, FEET, HORIZON, Ink, LW, Parchment, Rays, Scene, ShotProps, Stamp, ZeroCard, mix, move, pop, ramp, wob } from "./kit";

const NERO = { coat: "#7E4A8C", hat: "laurel" as const };
const ROMAN = { coat: "#C9B79A" };
const Rome: React.FC<{ f: number; fire?: number; night?: boolean }> = ({ f, fire = 0, night = true }) => (
  <g>
    <rect x={0} y={0} width={1080} height={1920} fill={night ? "#3A2A3A" : "#E8D8B8"} />
    {fire > 0 ? <rect x={0} y={0} width={1080} height={HORIZON} fill="#C2552E" opacity={0.35 * fire} /> : null}
    {[[90, 300], [330, 420], [560, 360], [800, 460], [1000, 320]].map(([x, h], i) => (
      <g key={i}>
        <rect x={x - 110} y={HORIZON - h} width={220} height={h} fill={i % 2 ? "#D9C7A4" : "#CBB690"} stroke={C.line} strokeWidth={LW} />
        {[0, 1].map((r) => [0, 1].map((c) => <rect key={`${r}${c}`} x={x - 70 + c * 90} y={HORIZON - h + 50 + r * 110} width={50} height={70} fill="#5A4A3A" stroke={C.line} strokeWidth={6} />))}
        {fire > 0 && i % 2 === 0 ? <path d={`M${x - 60} ${HORIZON - h} C ${x - 80} ${HORIZON - h - 80} ${x - 20 + wob(f + i * 5, 2, 12)} ${HORIZON - h - 120} ${x} ${HORIZON - h - 200 * fire} C ${x + 40} ${HORIZON - h - 110} ${x + 80} ${HORIZON - h - 80} ${x + 60} ${HORIZON - h} Z`} fill="#F08A2A" stroke={C.line} strokeWidth={8} strokeLinejoin="round" /> : null}
      </g>
    ))}
    <rect x={0} y={HORIZON} width={1080} height={770} fill="#8C7A60" stroke={C.line} strokeWidth={LW} />
  </g>
);
const Villa: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect x={0} y={0} width={1080} height={1920} fill="#BFD8E2" />
    <rect x={0} y={HORIZON - 200} width={1080} height={200} fill="#5E8FAE" />
    {[0, 1, 2].map((k) => <path key={k} d={`M${(k * 360 + f * 2) % 1180 - 100} ${HORIZON - 120 + k * 40} q30 -14 60 0 q30 14 60 0`} fill="none" stroke="#DCEBF2" strokeWidth={7} strokeLinecap="round" />)}
    {[260, 540, 820].map((x) => <rect key={x} x={x - 30} y={HORIZON - 460} width={60} height={460} fill={C.white} stroke={C.line} strokeWidth={LW} />)}
    <path d={`M180 ${HORIZON - 460} L540 ${HORIZON - 600} L900 ${HORIZON - 460} Z`} fill="#E8D8B8" stroke={C.line} strokeWidth={LW} strokeLinejoin="round" />
    <rect x={0} y={HORIZON} width={1080} height={770} fill="#E8D8B8" stroke={C.line} strokeWidth={LW} />
  </g>
);
const Fiddle: React.FC = () => (
  <g transform="rotate(-30)">
    <path d="M-30 -60 C -60 -60 -60 -20 -36 -10 C -60 0 -60 50 -30 60 L30 60 C 60 50 60 0 36 -10 C 60 -20 60 -60 30 -60 Z" fill="#B0603A" stroke={C.line} strokeWidth={8} />
    <rect x={-8} y={-140} width={16} height={86} fill={C.line} />
    <path d="M60 -90 L-80 60" stroke={C.beam} strokeWidth={8} strokeLinecap="round" />
  </g>
);
const Lyre: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <path d="M-60 40 C -90 -40 -60 -110 -40 -130 M60 40 C 90 -40 60 -110 40 -130" stroke={C.yellow} strokeWidth={16} fill="none" strokeLinecap="round" />
    <path d="M-60 40 C -90 -40 -60 -110 -40 -130 M60 40 C 90 -40 60 -110 40 -130" stroke={C.line} strokeWidth={4} fill="none" />
    <path d="M-56 -100 L56 -100" stroke={C.beam} strokeWidth={14} strokeLinecap="round" />
    <path d="M-60 40 L60 40" stroke={C.beam} strokeWidth={18} strokeLinecap="round" />
    {[-30, -10, 10, 30].map((x) => <path key={x} d={`M${x} -100 L${x} 40`} stroke={C.line} strokeWidth={3} />)}
  </g>
);
const neroPose = (f: number) => (
  <>
    <Rome f={f} fire={1} />
    <Bean x={540} y={FEET} s={1.5} {...NERO} face="happy" armR={100 + wob(f, 1.4, 14)} armL={150} holdR={<g transform="translate(10 -30)"><Fiddle /></g>} />
  </>
);

export const x01: React.FC<ShotProps> = ({ f }) => <Scene f={f}>{neroPose(f)}<g transform={`translate(540 360) scale(${pop(f, 8)})`}><Big x={0} y={0} size={140} color={C.yellow}>AD 64</Big></g></Scene>;
export const x02: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    {neroPose(f)}
    <Stamp f={f} a={12} x={540} y={420} text="WRONG" size={140} />
  </Scene>
);
export const x03: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Rome f={f} fire={0.6} />
    <Bean x={540} y={FEET} s={1.15} {...NERO} face="deadpan" />
    <g transform={`translate(540 330) scale(${mix(1.3, 1, pop(f, 2, 6))}) translate(-540 -330)`}>
      <Big x={540} y={290} size={150}>NERO</Big>
      <Big x={540} y={410} size={86} color={C.yellow}>THE FIDDLING MYTH</Big>
    </g>
  </Scene>
);
export const x04: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <g transform="translate(540 800) scale(2.2)"><Fiddle /></g>
    <g transform={`translate(540 800) scale(${pop(f, 10)})`}><Big x={0} y={80} size={400} color={C.red}>✗</Big></g>
  </Scene>
);
export const x05: React.FC<ShotProps> = ({ f }) => {
  const x = (yr: number) => 120 + ((yr - 0) / 1700) * 840, k = ramp(f, 6, 30, move);
  return (
    <Scene f={f}>
      <Parchment />
      <path d="M100 900 L980 900" stroke={C.line} strokeWidth={14} strokeLinecap="round" />
      <g transform={`translate(${x(64)} 900)`}><circle cx={0} cy={0} r={24} fill={C.red} stroke={C.line} strokeWidth={8} /><Ink x={0} y={-50} size={40}>Nero</Ink></g>
      <path d={`M${x(64)} 820 L${mix(x(64), x(1550), k)} 820`} stroke={C.yellow} strokeWidth={22} strokeLinecap="round" />
      {k > 0.95 ? <g transform={`translate(${x(1550)} 900)`}><circle cx={0} cy={0} r={24} fill={C.yellow} stroke={C.line} strokeWidth={8} /><Ink x={0} y={80} size={40}>violin</Ink></g> : null}
      <g transform={`translate(540 520) scale(${pop(f, 30)})`}><Big x={0} y={0} size={120} color={C.yellow}>1,500 YEARS</Big></g>
    </Scene>
  );
};
export const x06: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <Rays f={f} x={540} y={800} o={0.3} />
    <g transform={`translate(540 820) scale(${pop(f, 4) * 2.2})`}><Lyre /></g>
    <g transform={`translate(540 440) scale(${pop(f, 12)})`}><Big x={0} y={0} size={140} color={C.yellow}>LYRE</Big></g>
  </Scene>
);
export const x07: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Rome f={f} fire={1} />
    <rect x={390} y={600} width={300} height={590} fill="none" stroke={C.white} strokeWidth={10} strokeDasharray="30 22" />
    <g transform={`translate(540 860) scale(${pop(f, 8)})`}><Big x={0} y={0} size={200}>?</Big></g>
  </Scene>
);
export const x08: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Villa f={f} />
    <Bean x={540} y={FEET} s={1.4} {...NERO} face="happy" armL={20} armR={30} />
    <g transform={`translate(540 360) scale(${pop(f, 10)})`}><Big x={0} y={0} size={130} color={C.yellow}>ANTIUM</Big></g>
  </Scene>
);
export const x09: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Villa f={f} />
    <Bean x={mix(540, 1300, ramp(f, 14, 34, move))} y={FEET} s={1.4} {...NERO} face="panic" armL={150} armR={150} />
    {f < 14 ? <g transform={`translate(760 520) scale(${pop(f, 2)})`}><Big x={0} y={0} size={180}>!</Big></g> : null}
  </Scene>
);
export const x10: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <rect x={0} y={0} width={1080} height={1920} fill="#D9E3D0" />
    {[200, 880].map((x) => <g key={x}><rect x={x - 14} y={HORIZON - 300} width={28} height={300} fill={C.beam} /><circle cx={x} cy={HORIZON - 340} r={120} fill="#7FA05A" stroke={C.line} strokeWidth={LW} /></g>)}
    <rect x={0} y={HORIZON} width={1080} height={770} fill="#A9B892" stroke={C.line} strokeWidth={LW} />
    {[320, 480, 640, 800].map((x, i) => <Bean key={x} x={x} y={FEET + (i % 2) * 30} s={0.9} {...ROMAN} face="happy" armL={20} armR={20} />)}
    <Bean x={160} y={FEET} s={1.1} {...NERO} face="smug" armR={110} armL={20} />
  </Scene>
);
export const x11: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <rect x={0} y={0} width={1080} height={1920} fill="#E8D8B8" />
    <rect x={0} y={HORIZON} width={1080} height={770} fill="#B7A383" stroke={C.line} strokeWidth={LW} />
    <g transform={`translate(${mix(1300, 540, ramp(f, 2, 22, move))} ${FEET})`}>
      <rect x={-260} y={-220} width={520} height={160} fill={C.beam} stroke={C.line} strokeWidth={LW} />
      {[-180, -60, 60, 180].map((x) => <ellipse key={x} cx={x} cy={-240} rx={50} ry={34} fill="#D9A24E" stroke={C.line} strokeWidth={7} />)}
      {[-180, 180].map((x) => <circle key={x} cx={x} cy={-40} r={44} fill={C.line} />)}
    </g>
  </Scene>
);
export const x12: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Rome f={f} night={false} />
    <Bean x={540} y={FEET} s={1.5} {...NERO} face="deadpan" armR={-40 + wob(f, 2, 10)} armL={20} />
    <g transform={`translate(800 520) scale(${pop(f, 6)})`}><Big x={0} y={0} size={220}>?</Big></g>
  </Scene>
);
export const x13: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Rome f={f} night={false} />
    {[300, 780].map((x, i) => <Bean key={x} x={x} y={FEET} s={1.2} {...ROMAN} face="smug" armL={20} armR={i ? 20 : 120} flip={i === 1} />)}
    <g transform={`translate(540 640) scale(${pop(f, 4)})`}><Card x={0} y={0} w={260} h={120}><Ink x={0} y={20} size={60}>psst...</Ink></Card></g>
  </Scene>
);
export const x14: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <rect x={0} y={0} width={1080} height={1920} fill="#2A2530" />
    <rect x={160} y={HORIZON - 120} width={760} height={120} fill={C.beam} stroke={C.line} strokeWidth={LW} />
    <Bean x={540} y={HORIZON - 120} s={1.3} {...NERO} face="happy" armR={100 + wob(f, 1.4, 12)} armL={150} holdR={<g transform="translate(20 -60)"><Lyre s={0.6} /></g>} />
    <rect x={0} y={HORIZON} width={1080} height={770} fill="#3A3F52" stroke={C.line} strokeWidth={LW} />
    <g transform={`translate(540 360) scale(${pop(f, 12)})`}><Big x={0} y={0} size={120} color={C.yellow}>TROY</Big></g>
  </Scene>
);
export const x15: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <Book x={540} y={760} s={1.5} open={1} />
    <g transform={`translate(540 780) scale(${pop(f, 6)})`}><rect x={-260} y={-60} width={520} height={110} fill={C.yellow} opacity={0.75} /><Ink x={0} y={20} size={60} serif>"a rumour"</Ink></g>
    <g transform={`translate(540 420) scale(${pop(f, 16)})`}><Big x={0} y={0} size={120}>TACITUS</Big></g>
  </Scene>
);
export const x16: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Rome f={f} night={false} />
    {[200, 380, 700, 880].map((x, i) => <Bean key={x} x={x} y={FEET} s={0.9} {...ROMAN} face="angry" armR={150 + wob(f + i * 5, 3, 10)} armL={20} />)}
    <Bean x={540} y={FEET} s={1.1} {...NERO} face="panic" armL={150} armR={150} />
    <Stamp f={f} a={22} x={540} y={420} text="STUCK" size={130} />
  </Scene>
);
export const x17: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Rome f={f} night={false} />
    <Bean x={540} y={FEET} s={1.5} {...NERO} face="smug" armL={20} armR={20} />
    <g transform={`translate(540 380) scale(${pop(f, 14)})`}><Big x={0} y={0} size={110} color={C.red}>NOT GREAT</Big></g>
  </Scene>
);
export const x18: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Villa f={f} />
    <Bean x={540} y={FEET} s={1.5} {...NERO} face="deadpan" armL={20} armR={20} />
    <Stamp f={f} a={10} x={540} y={420} text="NO FIDDLE" size={110} />
  </Scene>
);
export const x19: React.FC<ShotProps> = ({ f }) => <Scene f={f}><ZeroCard f={f} label="FIDDLES IN ROME" /></Scene>;
/** The loop: back to the opening (wrong) version. */
export const x20: React.FC<ShotProps> = ({ f }) => <Scene f={f + 5}>{neroPose(f)}</Scene>;

export const SHOT_VIEWS: Record<string, React.FC<ShotProps>> = { x01, x02, x03, x04, x05, x06, x07, x08, x09, x10, x11, x12, x13, x14, x15, x16, x17, x18, x19, x20 };
