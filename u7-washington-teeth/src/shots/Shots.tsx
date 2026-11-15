import React from "react";
import { Bean } from "../ui/Bean";
import { Big, C, Card, FEET, Field, HORIZON, Ink, LW, Museum, Parchment, Rays, Scene, ShotProps, Stamp, Timber, ZeroCard, mix, move, pop, ramp, wob } from "./kit";

const GW = { coat: C.navy, hat: "tricorn" as const };
const WOOD = "#9C6B3E";
/** Dentures: gums + a row of teeth; mat sets the tooth colour; open separates the jaws. */
const Dentures: React.FC<{ x: number; y: number; s?: number; tooth?: string; open?: number; grain?: boolean }> = ({ x, y, s = 1, tooth = "#F4EEDC", open = 0, grain }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[-1, 1].map((side) => (
      <g key={side} transform={`translate(0 ${side * (20 + open * 60)})`}>
        <path d={`M-170 0 Q0 ${side * 80} 170 0 Q0 ${side * 40} -170 0 Z`} fill="#E28A8A" stroke={C.line} strokeWidth={10} strokeLinejoin="round" />
        {Array.from({ length: 8 }, (_, k) => {
          const tx = -140 + k * 40, ty = side * (Math.abs(k - 3.5) * -4 + 6);
          return <rect key={k} x={tx - 16} y={side > 0 ? ty - 44 : ty} width={32} height={44} rx={8} fill={tooth} stroke={C.line} strokeWidth={6} />;
        })}
        {grain ? Array.from({ length: 4 }, (_, k) => <path key={k} d={`M${-130 + k * 80} ${side * 10} q10 ${side * 14} 0 ${side * 28}`} stroke="#6E4A2A" strokeWidth={4} fill="none" />) : null}
      </g>
    ))}
    <path d="M-170 0 C -200 -60 -200 60 -170 0 M170 0 C 200 -60 200 60 170 0" stroke="#B8B8B8" strokeWidth={8} fill="none" />
  </g>
);
const gwPose = (f: number) => (
  <>
    <Field f={f} />
    <Bean x={400} y={FEET} s={1.5} {...GW} face="happy" armR={110} armL={20} holdR={<g transform="translate(30 -10) scale(0.45)"><Dentures x={0} y={0} tooth="#C08A54" grain /></g>} />
    <g transform={`translate(780 640) scale(${pop(f, 6)})`}><Dentures x={0} y={0} s={0.9} tooth="#C08A54" grain /></g>
  </>
);

export const t01: React.FC<ShotProps> = ({ f }) => <Scene f={f}>{gwPose(f)}</Scene>;
export const t02: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    {gwPose(f)}
    <Stamp f={f} a={12} x={540} y={400} text="NO WOOD" size={130} />
  </Scene>
);
export const t03: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Field f={f} />
    <Bean x={540} y={FEET} s={1.15} {...GW} face="deadpan" />
    <g transform={`translate(540 330) scale(${mix(1.3, 1, pop(f, 2, 6))}) translate(-540 -330)`}>
      <Big x={540} y={290} size={120}>WASHINGTON</Big>
      <Big x={540} y={410} size={84} color={C.yellow}>THE WOODEN TEETH</Big>
    </g>
  </Scene>
);
export const t04: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Timber />
    <Bean x={540} y={FEET} s={1.5} {...GW} face="panic" armL={150} armR={40 + wob(f, 2, 8)} />
    {[0, 1, 2].map((i) => { const k = pop(f, 6 + i * 6); return k > 0 ? <g key={i} transform={`translate(${760 + i * 60} ${520 - i * 60}) scale(${k})`}><Big x={0} y={0} size={70} color={C.red}>OW</Big></g> : null; })}
  </Scene>
);
export const t05: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <g transform="translate(540 820)">
      <path d="M-260 -40 Q0 120 260 -40 Q0 40 -260 -40 Z" fill="#E28A8A" stroke={C.line} strokeWidth={12} strokeLinejoin="round" />
      <g transform={`scale(${pop(f, 8)})`}><rect x={-26} y={-10} width={52} height={70} rx={12} fill="#F4EEDC" stroke={C.line} strokeWidth={8} /></g>
    </g>
    <g transform={`translate(540 480) scale(${pop(f, 16)})`}><Big x={0} y={0} size={140} color={C.yellow}>1 TOOTH</Big></g>
  </Scene>
);
export const t06: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <Rays f={f} x={540} y={760} o={0.3} />
    <g transform={`translate(540 760) scale(${pop(f, 4)})`}><Dentures x={0} y={0} s={1.8} open={0.5 + Math.abs(wob(f, 3, 0.4))} /></g>
  </Scene>
);
const Material: React.FC<{ f: number; label: string; children: React.ReactNode }> = ({ f, label, children }) => (
  <Scene f={f}>
    <Parchment />
    <g transform={`translate(540 760) scale(${pop(f, 4)})`}>{children}</g>
    <g transform={`translate(540 420) scale(${pop(f, 10)})`}><Big x={0} y={0} size={130} color={C.yellow}>{label}</Big></g>
  </Scene>
);
export const t07: React.FC<ShotProps> = ({ f }) => (
  <Material f={f} label="HIPPO IVORY">
    <path d="M-180 60 C -200 -40 -120 -120 0 -120 C 120 -120 200 -40 180 60 C 150 100 -150 100 -180 60 Z" fill="#9A8FA0" stroke={C.line} strokeWidth={LW} />
    <circle cx={-80} cy={-50} r={14} fill={C.line} /><circle cx={80} cy={-50} r={14} fill={C.line} />
    <rect x={-70} y={40} width={40} height={60} rx={10} fill="#F4EEDC" stroke={C.line} strokeWidth={7} /><rect x={30} y={40} width={40} height={60} rx={10} fill="#F4EEDC" stroke={C.line} strokeWidth={7} />
  </Material>
);
export const t08: React.FC<ShotProps> = ({ f }) => (
  <Material f={f} label="COW & HORSE">
    {[-200, 0, 200].map((x, i) => <rect key={x} x={x - 50} y={-80} width={100} height={150} rx={30} fill="#F4EEDC" stroke={C.line} strokeWidth={10} transform={`rotate(${(i - 1) * 10} ${x} 0)`} />)}
  </Material>
);
export const t09: React.FC<ShotProps> = ({ f }) => (
  <Material f={f} label="SPRINGS & LEAD">
    <path d={Array.from({ length: 12 }, (_, k) => `${k ? "L" : "M"}${-220 + k * 40} ${k % 2 ? -50 : 50}`).join(" ")} fill="none" stroke="#B8B8B8" strokeWidth={18} strokeLinejoin="round" />
    <path d={Array.from({ length: 12 }, (_, k) => `${k ? "L" : "M"}${-220 + k * 40} ${k % 2 ? -50 : 50}`).join(" ")} fill="none" stroke={C.line} strokeWidth={4} />
    <rect x={-140} y={90} width={280} height={70} rx={10} fill="#6E727A" stroke={C.line} strokeWidth={10} />
  </Material>
);
export const t10: React.FC<ShotProps> = ({ f }) => (
  <Material f={f} label="HUMAN TEETH">
    <Dentures x={0} y={0} s={1.4} />
  </Material>
);
export const t11: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <Card x={540} y={760} w={760} h={620} fill="#F1E7CF">
      <Ink x={0} y={-220} size={46} serif>Mount Vernon ledger, 1784</Ink>
      <path d="M-320 -180 L320 -180" stroke={C.line} strokeWidth={5} />
      {Array.from({ length: 6 }, (_, k) => <path key={k} d={`M-300 ${-110 + k * 60} L${k === 2 ? 40 : 300} ${-110 + k * 60}`} stroke={C.parchLo} strokeWidth={10} />)}
      <g opacity={ramp(f, 8, 16)}><rect x={-310} y={-20} width={620} height={70} fill={C.yellow} opacity={0.5} /><Ink x={0} y={26} size={38} serif>paid ... for 9 teeth</Ink></g>
    </Card>
  </Scene>
);
export const t12: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <g transform="translate(540 760)"><Dentures x={0} y={0} s={1.8} open={mix(0, 0.9, ramp(f, 6, 20, move))} /></g>
    <g transform={`translate(540 420) scale(${pop(f, 20)})`}><Big x={0} y={0} size={130} color={C.yellow}>BOING</Big></g>
  </Scene>
);
export const t13: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Timber />
    <Bean x={540} y={FEET} s={1.5} {...GW} face="angry" armL={150} armR={150} />
    <g transform="translate(540 760)"><path d="M-60 0 L60 0" stroke={C.line} strokeWidth={10} strokeLinecap="round" /></g>
  </Scene>
);
export const t14: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <g transform={`translate(540 780) rotate(-4) scale(${pop(f, 4)})`}>
      <rect x={-420} y={-200} width={840} height={400} rx={20} fill="#C9D8B8" stroke={C.line} strokeWidth={LW} />
      <rect x={-390} y={-170} width={780} height={340} rx={14} fill="none" stroke="#7E9A6A" strokeWidth={8} />
      <ellipse cx={0} cy={0} rx={130} ry={150} fill="#E8EDDC" stroke={C.line} strokeWidth={8} />
      <g transform="translate(0 110) scale(0.62)"><Bean x={0} y={0} s={1} coat="#5A6E52" face="deadpan" /></g>
      <Big x={-300} y={-100} size={80} color="#E8EDDC">1</Big><Big x={300} y={140} size={80} color="#E8EDDC">1</Big>
    </g>
  </Scene>
);
export const t15: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Field f={f} />
    <Bean x={540} y={FEET} s={1.5} {...GW} face="deadpan" armR={-40 + wob(f, 2, 10)} armL={20} />
    <g transform={`translate(800 520) scale(${pop(f, 6)})`}><Big x={0} y={0} size={220}>?</Big></g>
  </Scene>
);
export const t16: React.FC<ShotProps> = ({ f }) => {
  const k = ramp(f, 6, 40, move);
  return (
    <Scene f={f}>
      <Parchment />
      <g transform="translate(540 760)"><Dentures x={0} y={0} s={1.8} tooth={k > 0.5 ? "#C9A06A" : "#F4EEDC"} grain={k > 0.7} /></g>
      <g transform={`translate(540 420) scale(${pop(f, 6)})`}><Big x={0} y={0} size={120} color={C.yellow}>{k > 0.5 ? "+200 YEARS" : "NEW"}</Big></g>
    </Scene>
  );
};
export const t17: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Museum />
    <rect x={340} y={600} width={400} height={300} fill="none" stroke={C.line} strokeWidth={8} />
    <g transform="translate(540 750)"><Dentures x={0} y={0} s={0.9} tooth="#B88C5A" grain /></g>
    {[260, 820].map((x, i) => <Bean key={x} x={x} y={FEET + 120} s={0.8} coat={i ? "#7E4A8C" : C.slate} face="smug" armL={20} armR={i ? 20 : 70} />)}
    <g transform={`translate(540 440) scale(${pop(f, 16)})`}><Card x={0} y={0} w={420} h={110}><Ink x={0} y={16} size={46}>"Wood?"</Ink></Card></g>
  </Scene>
);
export const t18: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <g transform="translate(540 760)"><Dentures x={0} y={0} s={1.6} tooth={WOOD} grain /></g>
    {[0, 1, 2, 3].map((i) => { const k = pop(f, 10 + i * 5); return k > 0 ? <circle key={i} cx={400 + i * 90} cy={700 + (i % 2) * 70} r={18 * k} fill="#5E7A4A" opacity={0.85} /> : null; })}
    <Stamp f={f} a={26} x={540} y={420} text="ROT" size={140} />
  </Scene>
);
export const t19: React.FC<ShotProps> = ({ f }) => <Scene f={f}><ZeroCard f={f} label="WOODEN TEETH" /></Scene>;
/** The loop: back to the opening (wrong) version. */
export const t20: React.FC<ShotProps> = ({ f }) => <Scene f={f + 5}>{gwPose(f)}</Scene>;

export const SHOT_VIEWS: Record<string, React.FC<ShotProps>> = { t01, t02, t03, t04, t05, t06, t07, t08, t09, t10, t11, t12, t13, t14, t15, t16, t17, t18, t19, t20 };
void HORIZON;
