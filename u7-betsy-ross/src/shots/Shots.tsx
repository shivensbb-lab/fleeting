import React from "react";
import { Bean } from "../ui/Bean";
import { Big, Book, C, Card, FEET, HORIZON, Ink, LW, Parchment, Rays, Scene, ShotProps, Stamp, Timber, ZeroCard, mix, move, pop, ramp, wob } from "./kit";

const BETSY = { coat: "#3D6E8C", hat: "bonnet" as const };
const GW = { coat: C.navy, hat: "tricorn" as const };
const OldFlag: React.FC<{ s?: number; k?: number }> = ({ s = 1, k = 1 }) => (
  <g transform={`scale(${s})`}>
    <rect x={-240} y={-150} width={480} height={300} fill={C.white} stroke={C.line} strokeWidth={9} />
    {Array.from({ length: 7 }, (_, i) => <rect key={i} x={-240} y={-150 + i * (300 / 6.5)} width={480} height={300 / 13} fill={C.red} />)}
    <rect x={-240} y={-150} width={200} height={160} fill={C.navy} stroke={C.line} strokeWidth={6} />
    {Array.from({ length: 13 }, (_, i) => { const a = (i / 13) * Math.PI * 2; return i / 13 < k ? <circle key={i} cx={-140 + Math.cos(a) * 55} cy={-70 + Math.sin(a) * 55} r={8} fill={C.white} /> : null; })}
    <rect x={-240} y={-150} width={480} height={300} fill="none" stroke={C.line} strokeWidth={9} />
  </g>
);
const Shop: React.FC = () => (
  <g>
    <Timber />
    <rect x={520} y={860} width={480} height={50} fill={C.beam} stroke={C.line} strokeWidth={LW} />
    <rect x={540} y={910} width={30} height={280} fill={C.beam} stroke={C.line} strokeWidth={8} /><rect x={950} y={910} width={30} height={280} fill={C.beam} stroke={C.line} strokeWidth={8} />
  </g>
);
const Needle: React.FC = () => <g><path d="M0 0 L36 -60" stroke="#B8B8B8" strokeWidth={6} strokeLinecap="round" /><path d="M36 -60 Q80 -80 60 -20" stroke={C.red} strokeWidth={3} fill="none" /></g>;
const betsyPose = (f: number) => (
  <>
    <Shop />
    <g transform={`translate(760 700) scale(${pop(f, 4)})`}><OldFlag s={0.75} k={mix(0.3, 1, ramp(f, 4, 40))} /></g>
    <Bean x={300} y={FEET} s={1.3} {...BETSY} face="happy" armR={90 + wob(f, 1.4, 12)} armL={20} holdR={<Needle />} />
  </>
);

export const h01: React.FC<ShotProps> = ({ f }) => <Scene f={f}>{betsyPose(f)}<g transform={`translate(540 340) scale(${pop(f, 8)})`}><Big x={0} y={0} size={140} color={C.yellow}>1776</Big></g></Scene>;
export const h02: React.FC<ShotProps> = ({ f }) => <Scene f={f}>{betsyPose(f)}<Stamp f={f} a={12} x={540} y={380} text="FAMILY STORY" size={96} /></Scene>;
export const h03: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Shop />
    <Bean x={540} y={FEET} s={1.15} {...BETSY} face="deadpan" />
    <g transform={`translate(540 330) scale(${mix(1.3, 1, pop(f, 2, 6))}) translate(-540 -330)`}>
      <Big x={540} y={290} size={140}>BETSY ROSS</Big>
      <Big x={540} y={410} size={90} color={C.yellow}>THE FLAG MYTH</Big>
    </g>
  </Scene>
);
export const h04: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Shop />
    <Bean x={300} y={FEET} s={1.3} {...BETSY} face="happy" armL={20} armR={30} />
    <Bean x={mix(1200, 760, ramp(f, 2, 22, move))} y={FEET} s={1.4} {...GW} face="smug" armL={60} armR={20} flip />
  </Scene>
);
export const h05: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Shop />
    <Bean x={300} y={FEET} s={1.3} {...BETSY} face="happy" armL={20} armR={30} />
    <Bean x={760} y={FEET} s={1.4} {...GW} face="smug" armL={110} armR={20} flip />
    <g transform={`translate(560 560) scale(${pop(f, 8)})`}><path d="M-200 -90 L200 -90 L200 60 L60 60 L0 130 L-20 60 L-200 60 Z" fill={C.white} stroke={C.line} strokeWidth={10} strokeLinejoin="round" /><Ink x={0} y={0} size={44}>Sew me a flag?</Ink></g>
  </Scene>
);
export const h06: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <Book x={540} y={760} s={1.5} open={1} />
    <g transform={`translate(540 760) scale(${pop(f, 8)})`}><Big x={0} y={0} size={140}>1776:</Big><Big x={0} y={150} size={110} color={C.red}>NOTHING</Big></g>
  </Scene>
);
export const h07: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    {["LETTERS", "DIARIES", "RECEIPTS"].map((t, i) => <g key={t} transform={`translate(${200 + i * 340} 800)`}><g transform={`scale(${pop(f, 2 + i * 8)})`}><Card x={0} y={0} w={280} h={360}><Ink x={0} y={-120} size={38}>{t}</Ink></Card></g>{pop(f, 8 + i * 8) > 0 ? <g transform={`scale(${pop(f, 8 + i * 8)})`}><Big x={0} y={60} size={220} color={C.red}>✗</Big></g> : null}</g>)}
  </Scene>
);
export const h08: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <Card x={540} y={760} w={560} h={600} rot={-3}>
      <rect x={-280} y={-300} width={560} height={130} fill={C.red} stroke={C.line} strokeWidth={10} />
      <Ink x={0} y={-215} size={60} color={C.white}>FIRST TOLD</Ink>
      <g transform={`scale(${pop(f, 6)})`}><Big x={0} y={110} size={190} color={C.yellow}>1870</Big></g>
    </Card>
  </Scene>
);
export const h09: React.FC<ShotProps> = ({ f }) => {
  const x = (yr: number) => 120 + ((yr - 1760) / 130) * 840, k = ramp(f, 4, 30, move);
  return (
    <Scene f={f}>
      <Parchment />
      <path d="M100 900 L980 900" stroke={C.line} strokeWidth={14} strokeLinecap="round" />
      <g transform={`translate(${x(1776)} 900)`}><circle cx={0} cy={0} r={24} fill={C.red} stroke={C.line} strokeWidth={8} /><Ink x={0} y={-50} size={40}>1776</Ink></g>
      <path d={`M${x(1776)} 820 L${mix(x(1776), x(1870), k)} 820`} stroke={C.yellow} strokeWidth={22} strokeLinecap="round" />
      {k > 0.95 ? <g transform={`translate(${x(1870)} 900)`}><circle cx={0} cy={0} r={24} fill={C.yellow} stroke={C.line} strokeWidth={8} /><Ink x={0} y={80} size={40}>1870</Ink></g> : null}
      <g transform={`translate(540 520) scale(${pop(f, 30)})`}><Big x={0} y={0} size={120} color={C.yellow}>~100 YEARS</Big></g>
    </Scene>
  );
};
export const h10: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Timber />
    <rect x={160} y={960} width={760} height={240} fill={C.beam} stroke={C.line} strokeWidth={LW} />
    <Bean x={540} y={960} s={1.3} coat="#3A3A44" beard="#8C6A44" face="happy" armR={130 + wob(f, 2, 8)} armL={20} />
    <g transform={`translate(540 340) scale(${pop(f, 10)})`}><Big x={0} y={0} size={110} color={C.yellow}>HER GRANDSON</Big></g>
  </Scene>
);
export const h11: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Shop />
    {[260, 540, 820].map((x, i) => <Bean key={x} x={x} y={FEET} s={1.1} coat={["#7E4A8C", "#3D6E8C", "#7A5A3C"][i]} hat={i === 1 ? "bonnet" : "none"} face="smug" armL={20} armR={i === 1 ? 20 : 120} flip={i === 2} />)}
    {[0, 1].map((i) => { const k = pop(f, 6 + i * 10); return k > 0 ? <g key={i} transform={`translate(${400 + i * 280} 620) scale(${k})`}><Card x={0} y={0} w={240} h={100}><Ink x={0} y={16} size={40}>Grandma said...</Ink></Card></g> : null; })}
  </Scene>
);
export const h12: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Shop />
    <Rays f={f} x={540} y={900} o={0.3} />
    <Bean x={540} y={FEET} s={1.5} {...BETSY} face="happy" armL={150} armR={150} />
    <Stamp f={f} a={12} x={540} y={420} text="REAL" size={140} color="#3E8E4E" />
  </Scene>
);
export const h13: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Shop />
    <g transform="translate(300 1040)"><rect x={-180} y={-60} width={360} height={80} rx={20} fill="#B85C3E" stroke={C.line} strokeWidth={LW} /><rect x={-180} y={-140} width={60} height={160} rx={20} fill="#B85C3E" stroke={C.line} strokeWidth={LW} /></g>
    <g transform="translate(760 760)"><OldFlag s={0.6} /></g>
    <Bean x={540} y={FEET} s={1.2} {...BETSY} face="happy" armR={90 + wob(f, 1.4, 12)} armL={20} holdR={<Needle />} />
  </Scene>
);
export const h14: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <Card x={540} y={760} w={760} h={560} fill="#F1E7CF">
      <Ink x={0} y={-190} size={44} serif>Navy Board, 1777</Ink>
      <path d="M-320 -150 L320 -150" stroke={C.line} strokeWidth={5} />
      <g opacity={ramp(f, 8, 16)}><rect x={-310} y={-60} width={620} height={80} fill={C.yellow} opacity={0.5} /><Ink x={0} y={-6} size={40} serif>Elizabeth Ross: ship's colours</Ink></g>
      {[60, 120, 180].map((y) => <path key={y} d={`M-300 ${y} L300 ${y}`} stroke={C.parchLo} strokeWidth={10} />)}
    </Card>
  </Scene>
);
export const h15: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <g transform="translate(540 820)"><OldFlag s={1.3} /></g>
    <g transform={`translate(540 420) scale(${pop(f, 10)})`}><Big x={0} y={0} size={140} color={C.yellow}>DESIGNER?</Big></g>
  </Scene>
);
export const h16: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Timber />
    <Bean x={300} y={FEET} s={1.3} coat="#5E7A4A" hat="periwig" face="smug" armR={110} armL={20} />
    <g transform={`translate(760 760) scale(${pop(f, 8)})`}>
      <Card x={0} y={0} w={400} h={460} fill={C.parchment}>
        <Ink x={0} y={-170} size={44}>INVOICE</Ink>
        <Ink x={0} y={-90} size={34} serif>for designing</Ink><Ink x={0} y={-40} size={34} serif>the flag</Ink>
        <Big x={0} y={110} size={90} color={C.red}>$$$</Big>
      </Card>
    </g>
    <g transform={`translate(540 300) scale(${pop(f, 18)})`}><Big x={0} y={0} size={100} color={C.yellow}>HOPKINSON</Big></g>
  </Scene>
);
export const h17: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Timber />
    <Bean x={540} y={FEET} s={1.5} coat="#5E7A4A" hat="periwig" face="angry" armL={150} armR={150} />
    <Stamp f={f} a={10} x={540} y={420} text="UNPAID" size={140} />
  </Scene>
);
export const h18: React.FC<ShotProps> = ({ f }) => (
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
export const h19: React.FC<ShotProps> = ({ f }) => <Scene f={f}><ZeroCard f={f} label="PROOF SHE MADE IT" /></Scene>;
/** The loop: back to the opening (wrong) version. */
export const h20: React.FC<ShotProps> = ({ f }) => <Scene f={f + 5}>{betsyPose(f)}</Scene>;

export const SHOT_VIEWS: Record<string, React.FC<ShotProps>> = { h01, h02, h03, h04, h05, h06, h07, h08, h09, h10, h11, h12, h13, h14, h15, h16, h17, h18, h19, h20 };
void HORIZON;
