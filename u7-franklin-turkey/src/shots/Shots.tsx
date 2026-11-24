import React from "react";
import { Bean } from "../ui/Bean";
import { Big, C, Card, FEET, Field, HORIZON, Ink, LW, Parchment, Rays, Scene, ShotProps, Stamp, Timber, ZeroCard, mix, move, pop, ramp, wob } from "./kit";

const FRANKLIN = { coat: "#7A5A3A", hair: true };
const Turkey: React.FC<{ x: number; y: number; s?: number; flip?: boolean; face?: "happy" | "angry" | "smug" }> = ({ x, y, s = 1, flip, face = "happy" }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    {Array.from({ length: 7 }, (_, k) => (
      <path key={k} d="M0 -150 C -40 -260 -10 -330 0 -340 C 10 -330 40 -260 0 -150 Z" transform={`rotate(${-75 + k * 25} 0 -150)`} fill={k % 2 ? "#8B5A2E" : "#B07A3E"} stroke={C.line} strokeWidth={8} strokeLinejoin="round" />
    ))}
    <path d="M-20 -10 L-20 -60 M20 -10 L20 -60" stroke="#D9A040" strokeWidth={12} strokeLinecap="round" />
    <path d="M-30 0 L-10 -10 M10 -10 L30 0" stroke="#D9A040" strokeWidth={9} strokeLinecap="round" />
    <ellipse cx={0} cy={-130} rx={95} ry={85} fill="#5A3A22" stroke={C.line} strokeWidth={LW} />
    <path d="M40 -170 C 60 -230 80 -280 70 -300" stroke={C.line} strokeWidth={34} strokeLinecap="round" fill="none" />
    <path d="M40 -170 C 60 -230 80 -280 70 -300" stroke="#9AA6C8" strokeWidth={18} strokeLinecap="round" fill="none" />
    <circle cx={70} cy={-310} r={32} fill="#9AA6C8" stroke={C.line} strokeWidth={8} />
    <path d="M96 -312 L130 -302 L96 -294 Z" fill="#D9A040" stroke={C.line} strokeWidth={5} strokeLinejoin="round" />
    <path d="M88 -292 C 100 -270 92 -250 80 -248 C 74 -262 78 -280 88 -292 Z" fill={C.red} stroke={C.line} strokeWidth={5} />
    {face === "angry" ? <path d="M58 -330 L84 -320" stroke={C.line} strokeWidth={6} strokeLinecap="round" /> : null}
    <circle cx={76} cy={-316} r={6} fill={C.line} />
  </g>
);
const Eagle: React.FC<{ x: number; y: number; s?: number; flip?: boolean; fish?: boolean; wing?: number }> = ({ x, y, s = 1, flip, fish, wing = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    {[-1, 1].map((sd) => (
      <path key={sd} transform={`rotate(${sd * wing * 30} 0 -150)`} d={`M0 -160 C ${sd * 120} -260 ${sd * 230} -220 ${sd * 250} -170 C ${sd * 200} -170 ${sd * 160} -130 ${sd * 60} -110 Z`} fill="#5A3A22" stroke={C.line} strokeWidth={LW} strokeLinejoin="round" />
    ))}
    <path d="M-20 -10 L-20 -50 M20 -10 L20 -50" stroke="#D9A040" strokeWidth={12} strokeLinecap="round" />
    <ellipse cx={0} cy={-120} rx={60} ry={80} fill="#5A3A22" stroke={C.line} strokeWidth={LW} />
    <circle cx={0} cy={-230} r={50} fill={C.white} stroke={C.line} strokeWidth={LW} />
    <path d="M36 -240 C 70 -240 80 -220 70 -200 C 60 -214 48 -218 36 -214 Z" fill={C.yellow} stroke={C.line} strokeWidth={6} strokeLinejoin="round" />
    <path d="M6 -254 L30 -244" stroke={C.line} strokeWidth={7} strokeLinecap="round" />
    <circle cx={18} cy={-238} r={6} fill={C.line} />
    {fish ? <g transform="translate(90 -200)"><ellipse cx={0} cy={0} rx={48} ry={20} fill="#9FC3D4" stroke={C.line} strokeWidth={6} /><path d="M44 0 L70 -18 L70 18 Z" fill="#9FC3D4" stroke={C.line} strokeWidth={6} strokeLinejoin="round" /></g> : null}
  </g>
);
const Seal: React.FC<{ x: number; y: number; s?: number; children?: React.ReactNode }> = ({ x, y, s = 1, children }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle r={300} fill="#E8D7A8" stroke={C.line} strokeWidth={LW} />
    <circle r={260} fill="none" stroke={C.beam} strokeWidth={8} strokeDasharray="4 14" />
    {children}
  </g>
);
const Letter: React.FC<{ x: number; y: number; s?: number; head?: string }> = ({ x, y, s = 1, head = "Dear Sally," }) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(-3)`}>
    <rect x={-260} y={-330} width={520} height={660} fill="#F3EAD2" stroke={C.line} strokeWidth={8} />
    <Ink x={-200} y={-240} size={48} serif anchor="start">{head}</Ink>
    {Array.from({ length: 7 }, (_, k) => <path key={k} d={`M-200 ${-160 + k * 66} L${200 - (k % 3) * 50} ${-160 + k * 66}`} stroke={C.line} strokeWidth={5} opacity={0.45} />)}
    <Ink x={180} y={290} size={40} serif anchor="middle">— B.F.</Ink>
  </g>
);
const turkeyPose = (f: number) => (
  <>
    <Field f={f} />
    <Rays f={f} x={540} y={700} o={0.3} />
    <Bean x={300} y={FEET} s={1.3} {...FRANKLIN} face="happy" armR={150} armL={20} />
    <Turkey x={740} y={FEET + 10} s={1.05} flip />
    <g transform={`translate(740 ${520 + wob(f, 6, 6)})`}>
      <path d="M-120 -60 L120 -60 L120 60 L-120 60 Z" fill={C.white} stroke={C.line} strokeWidth={6} />
      {[-36, 0, 36].map((y, k) => <rect key={y} x={-120} y={y - 12 - 6} width={240} height={14} fill={k === 1 ? C.white : C.red} />)}
      <rect x={-120} y={-60} width={100} height={60} fill={C.navy} stroke={C.line} strokeWidth={5} />
      <path d="M-120 -60 L-120 200" stroke={C.line} strokeWidth={10} />
    </g>
  </>
);

export const b01: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    {turkeyPose(f)}
    <g transform={`translate(540 280) scale(${pop(f, 10)})`}><Big x={0} y={0} size={110} color={C.yellow}>NATIONAL BIRD?</Big></g>
  </Scene>
);
export const b02: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    {turkeyPose(f)}
    <g transform={`translate(540 280) scale(${pop(f, 4)}) rotate(${wob(f, 3, 3)})`}><Big x={0} y={0} size={110} color={C.yellow}>GOBBLE GOBBLE</Big></g>
  </Scene>
);
export const b03: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    {turkeyPose(f)}
    <Stamp f={f} a={6} x={540} y={300} text="HE DIDN'T" size={110} />
  </Scene>
);
export const b04: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Field f={f} />
    <Turkey x={540} y={FEET + 10} s={1.1} face="smug" />
    <g transform={`translate(540 330) scale(${mix(1.3, 1, pop(f, 2, 6))}) translate(-540 -330)`}>
      <Big x={540} y={290} size={150}>FRANKLIN</Big>
      <Big x={540} y={410} size={90} color={C.yellow}>THE TURKEY MYTH</Big>
    </g>
  </Scene>
);
export const b05: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Timber />
    <Bean x={240} y={FEET} s={1.2} {...FRANKLIN} face="happy" armR={110} />
    <Bean x={840} y={FEET} s={1.2} coat="#3A3A44" hair face="deadpan" flip />
    <g transform={`translate(560 640) scale(${pop(f, 8) * 0.8})`}><Seal x={0} y={0}><Big x={0} y={30} size={70} color={C.beam}>GREAT SEAL</Big></Seal></g>
    <g transform={`translate(540 300) scale(${pop(f, 18)})`}><Big x={0} y={0} size={140} color={C.yellow}>1776</Big></g>
  </Scene>
);
export const b06: React.FC<ShotProps> = ({ f }) => {
  const k = ramp(f, 4, 26, move);
  return (
    <Scene f={f}>
      <rect x={0} y={0} width={1080} height={1920} fill="#E9C77A" />
      {[-1, 1].map((sd) => (
        <path key={sd} d={`M${540 + sd * mix(0, 170, k)} ${HORIZON} C ${540 + sd * mix(0, 220, k)} 700 ${540 + sd * mix(0, 240, k)} 500 ${540 + sd * mix(0, 300, k)} 420 L${sd > 0 ? 1080 : 0} 420 L${sd > 0 ? 1080 : 0} ${HORIZON} Z`} fill="#4F86B8" stroke={C.line} strokeWidth={LW} />
      ))}
      <rect x={0} y={HORIZON} width={1080} height={770} fill="#D9B36A" stroke={C.line} strokeWidth={LW} />
      {k > 0.5 ? <Bean x={540} y={FEET} s={1.2} coat="#8B7A5E" beard={C.white} hair face="smug" armL={150} armR={150} /> : null}
      <g transform={`translate(540 290) scale(${pop(f, 14)})`}><Big x={0} y={0} size={110} color={C.white}>MOSES!</Big></g>
    </Scene>
  );
};
export const b07: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <g transform="translate(540 760)"><path d="M0 -60 C -70 -180 -10 -260 0 -280 C 10 -260 70 -180 0 -60 Z" fill="#B07A3E" stroke={C.line} strokeWidth={9} /></g>
    <path d="M330 540 L750 980 M750 540 L330 980" stroke={C.red} strokeWidth={36} strokeLinecap="round" opacity={pop(f, 12)} />
    <g transform={`translate(540 330) scale(${pop(f, 4)})`}><Big x={0} y={0} size={110} color={C.yellow}>NO TURKEY</Big></g>
  </Scene>
);
export const b08: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <g transform={`translate(540 760) scale(${pop(f, 4) * 1.1})`}><Seal x={0} y={0}><Eagle x={0} y={150} s={1} wing={1} /></Seal></g>
    <g transform={`translate(540 330) scale(${pop(f, 16)})`}><Big x={0} y={0} size={140} color={C.yellow}>1782</Big></g>
  </Scene>
);
export const b09: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Field f={f} />
    <Turkey x={540} y={FEET + 10} s={1.1} />
    <g transform={`translate(540 330) scale(${pop(f, 8)})`}><Big x={0} y={0} size={160} color={C.yellow}>?</Big></g>
  </Scene>
);
export const b10: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Timber />
    <Bean x={250} y={FEET} s={1.2} {...FRANKLIN} face="smug" armR={120} />
    <g transform={`translate(700 760) scale(${pop(f, 6) * 0.8})`}><Letter x={0} y={0} /></g>
    <g transform={`translate(540 300) scale(${pop(f, 18)})`}><Big x={0} y={0} size={140} color={C.yellow}>1784</Big></g>
  </Scene>
);
const Badge: React.FC<{ x: number; y: number; s?: number; bird: "eagle" | "turkey" }> = ({ x, y, s = 1, bird }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-40 -330 L40 -330 L60 -230 L-60 -230 Z" fill="#3D5A80" stroke={C.line} strokeWidth={8} />
    <circle cx={0} cy={0} r={230} fill={C.yellow} stroke={C.line} strokeWidth={LW} />
    <circle cx={0} cy={0} r={190} fill="#F3EAD2" stroke={C.line} strokeWidth={6} />
    {bird === "eagle" ? <Eagle x={0} y={130} s={0.7} wing={1} /> : <Turkey x={0} y={150} s={0.7} />}
  </g>
);
export const b11: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Timber />
    {[160, 920].map((x, i) => <Bean key={x} x={x} y={FEET} s={1.05} coat="#2E3F73" hat="tricorn" face="smug" flip={i === 1} />)}
    <g transform={`translate(540 700) scale(${pop(f, 6) * 1.1})`}><Badge x={0} y={0} bird="eagle" /></g>
  </Scene>
);
export const b12: React.FC<ShotProps> = ({ f }) => {
  const k = ramp(f, 14, 24);
  return (
    <Scene f={f}>
      <Timber />
      <g transform="translate(540 700) scale(1.1)">{k < 0.5 ? <Badge x={0} y={0} bird="eagle" /> : <Badge x={0} y={0} bird="turkey" />}</g>
      <Stamp f={f} a={26} x={540} y={300} text="TURKEY?" size={110} color={C.beam} rot={-4} />
    </Scene>
  );
};
export const b13: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Field f={f} />
    <Eagle x={540} y={FEET} s={1.4} />
    <g transform={`translate(540 300) scale(${pop(f, 10)})`}><Card x={0} y={0} w={800} h={220} fill={C.white}><Ink x={0} y={-10} size={60} serif>"a bird of bad</Ink><Ink x={0} y={60} size={60} serif>moral character"</Ink></Card></g>
  </Scene>
);
export const b14: React.FC<ShotProps> = ({ f }) => {
  const k = ramp(f, 4, 26, move);
  return (
    <Scene f={f}>
      <Sky2 />
      <g transform={`translate(${mix(820, 560, k)} ${mix(560, 820, k)})`}>
        <ellipse cx={0} cy={-50} rx={60} ry={30} fill="#E8E4D6" stroke={C.line} strokeWidth={8} />
        <path d="M-60 -60 L-140 -100 L-60 -40 Z M60 -60 L140 -100 L60 -40 Z" fill="#E8E4D6" stroke={C.line} strokeWidth={6} />
        {k < 0.95 ? <g transform="translate(0 0)"><ellipse cx={0} cy={0} rx={48} ry={20} fill="#9FC3D4" stroke={C.line} strokeWidth={6} /></g> : null}
      </g>
      <Eagle x={mix(200, 360, k)} y={mix(1000, FEET, k)} s={1.0} fish={k >= 0.95} wing={1 - k} />
      <Stamp f={f} a={30} x={720} y={340} text="THIEF" size={110} />
    </Scene>
  );
};
const Sky2: React.FC = () => (
  <g>
    <rect x={0} y={0} width={1080} height={1920} fill="#CFE3E2" />
    <rect x={0} y={HORIZON} width={1080} height={770} fill="#4F86B8" stroke={C.line} strokeWidth={LW} />
    {Array.from({ length: 5 }, (_, k) => <path key={k} d={`M${k * 240 - 40} ${HORIZON + 80 + (k % 2) * 60} q40 -30 80 0 q40 30 80 0`} fill="none" stroke="#CFE3E2" strokeWidth={6} />)}
  </g>
);
export const b15: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Field f={f} />
    <Rays f={f} x={540} y={800} o={0.3} />
    <Turkey x={540} y={FEET + 10} s={1.2} face="smug" />
    <Stamp f={f} a={10} x={540} y={330} text="RESPECTABLE" size={100} color="#3E8E4E" rot={-3} />
  </Scene>
);
export const b16: React.FC<ShotProps> = ({ f }) => {
  const k = ramp(f, 16, 34, move);
  return (
    <Scene f={f}>
      <Field f={f} />
      <Bean x={mix(820, 960, k)} y={FEET} s={1.2} coat={C.brit} hat="bearskin" face={k > 0.2 ? "panic" : "smug"} flip={k < 0.2} armL={k > 0.2 ? 150 : 20} armR={k > 0.2 ? 150 : 20} />
      <Turkey x={mix(240, 600, k)} y={FEET + 10 - Math.abs(Math.sin(f / 2)) * 30 * k} s={1.0} face="angry" />
      <Stamp f={f} a={8} x={540} y={300} text="COURAGE" size={110} color={C.beam} rot={-3} />
    </Scene>
  );
};
export const b17: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <g transform="translate(540 780) scale(0.95)"><Letter x={0} y={0} /></g>
    <Stamp f={f} a={8} x={540} y={320} text="PRIVATE" size={110} color="#3D5A80" rot={-4} />
    <Stamp f={f} a={28} x={560} y={1040} text="MOSTLY A JOKE" size={80} rot={5} />
  </Scene>
);
export const b18: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Timber />
    {[620, 760, 900].map((x, i) => <Bean key={x} x={x} y={FEET} s={0.95} coat={["#3A3A44", "#2E3F73", "#5E7A4A"][i]} hair face="deadpan" flip />)}
    <Bean x={260} y={FEET} s={1.2} {...FRANKLIN} face="smug" armL={20} armR={20} />
    <g transform={`translate(540 300) scale(${pop(f, 6)})`}><Big x={0} y={0} size={110} color={C.yellow}>CONGRESS</Big></g>
    <Stamp f={f} a={18} x={540} y={480} text="NO TURKEY ASK" size={80} rot={-3} />
  </Scene>
);
export const b19: React.FC<ShotProps> = ({ f }) => <Scene f={f}><ZeroCard f={f} label="TURKEY PROPOSALS" /></Scene>;
/** The loop: back to the opening (wrong) version. */
export const b20: React.FC<ShotProps> = ({ f }) => <Scene f={f + 5}>{turkeyPose(f)}</Scene>;

export const SHOT_VIEWS: Record<string, React.FC<ShotProps>> = { b01, b02, b03, b04, b05, b06, b07, b08, b09, b10, b11, b12, b13, b14, b15, b16, b17, b18, b19, b20 };
