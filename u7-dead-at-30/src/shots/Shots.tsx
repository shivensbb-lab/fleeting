import React from "react";
import { Bean } from "../ui/Bean";
import { Big, C, Card, FEET, Field, Ink, Parchment, Rays, Scene, ShotProps, Stamp, Timber, ZeroCard, mix, move, pop, ramp, wob } from "./kit";

const PEASANT = { coat: "#8B7A5E", hat: "hood" as const };
const ELDER = { coat: "#6F6A86", hat: "hood" as const, beard: "#E9E6DE" };
const Cane: React.FC = () => <path d="M0 0 L10 150 Q14 170 30 166" fill="none" stroke={C.beam} strokeWidth={14} strokeLinecap="round" />;
const Baby: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={0} rx={70} ry={46} fill={C.white} stroke={C.line} strokeWidth={10} />
    <circle cx={-40} cy={-30} r={40} fill={C.skin} stroke={C.line} strokeWidth={10} />
    <circle cx={-52} cy={-34} r={5} fill={C.line} /><circle cx={-30} cy={-34} r={5} fill={C.line} />
  </g>
);
const Bar: React.FC<{ x: number; base: number; h: number; w?: number; color: string; label: string; k: number }> = ({ x, base, h, w = 200, color, label, k }) => (
  <g>
    <rect x={x - w / 2} y={base - h * k} width={w} height={h * k} fill={color} stroke={C.line} strokeWidth={10} />
    <Ink x={x} y={base + 70} size={50}>{label}</Ink>
  </g>
);
const oldPose = (f: number) => (
  <>
    <Field f={f} />
    <Bean x={540} y={FEET} s={1.5} {...ELDER} face="panic" armR={30} armL={20} holdR={<Cane />} />
  </>
);

export const m01: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    {oldPose(f)}
    <g transform={`translate(820 520) scale(${pop(f, 8)})`}><Big x={0} y={0} size={220} color={C.yellow}>30</Big></g>
  </Scene>
);
export const m02: React.FC<ShotProps> = ({ f }) => {
  const k = ramp(f, 10, 24, move);
  return (
    <Scene f={f}>
      <Field f={f} />
      <Bean x={540} y={FEET} s={1.5} {...(k > 0.5 ? PEASANT : ELDER)} face={k > 0.5 ? "happy" : "panic"} armR={k > 0.5 ? 150 : 30} armL={k > 0.5 ? 150 : 20} holdR={k > 0.5 ? undefined : <Cane />} />
      {k > 0.5 ? <g transform={`translate(${mix(700, 1100, k)} ${mix(1200, 1600, k)}) rotate(${k * 300})`}><Cane /></g> : null}
    </Scene>
  );
};
export const m03: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Field f={f} />
    <Bean x={540} y={FEET} s={1.2} {...PEASANT} face="deadpan" />
    <g transform={`translate(540 330) scale(${mix(1.3, 1, pop(f, 2, 6))}) translate(-540 -330)`}>
      <Big x={540} y={290} size={140}>DEAD AT 30?</Big>
      <Big x={540} y={420} size={86} color={C.yellow}>THE AVERAGE TRICK</Big>
    </g>
  </Scene>
);
export const m04: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <Card x={540} y={760} w={640} h={560}>
      <Ink x={0} y={-160} size={52}>LIFE EXPECTANCY</Ink>
      <g transform={`scale(${pop(f, 8)})`}><Big x={0} y={120} size={260} color={C.yellow}>~30</Big></g>
    </Card>
  </Scene>
);
export const m05: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <Card x={540} y={760} w={640} h={560}><Ink x={0} y={-160} size={52}>LIFE EXPECTANCY</Ink><Big x={0} y={120} size={260} color={C.yellow}>~30</Big></Card>
    <Stamp f={f} a={14} x={540} y={420} text="AVERAGE" size={120} />
  </Scene>
);
export const m06: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Timber />
    {[0, 1, 2, 3].map((i) => { const k = pop(f, 4 + i * 6); return k > 0 ? <Baby key={i} x={220 + i * 220} y={1000 - (i % 2) * 40} s={k} /> : null; })}
    <g transform={`translate(540 520) scale(${pop(f, 30)})`}><Big x={0} y={0} size={130} color={C.yellow}>UNDER 5</Big></g>
  </Scene>
);
export const m07: React.FC<ShotProps> = ({ f }) => {
  const k = ramp(f, 6, 36, move);
  return (
    <Scene f={f}>
      <Parchment />
      <rect x={160} y={1100} width={760} height={10} fill={C.line} />
      <Bar x={540} base={1100} h={mix(600, 300, k)} w={300} color={C.yellow} label="AVERAGE" k={1} />
      <g transform={`translate(540 ${mix(500, 800, k)})`}><path d="M0 -60 L0 60 M-40 20 L0 60 L40 20" stroke={C.red} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" fill="none" /></g>
    </Scene>
  );
};
export const m08: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Field f={f} />
    <g transform={`translate(300 1100) scale(${pop(f, 4)}) translate(-300 -1100)`}><Baby x={300} y={1100} s={1.4} /></g>
    {pop(f, 16) > 0 ? <Bean x={760} y={FEET} s={1.4 * pop(f, 16)} {...ELDER} face="happy" armR={30} armL={20} holdR={<Cane />} /> : null}
    <g transform={`translate(300 820) scale(${pop(f, 8)})`}><Big x={0} y={0} size={140} color={C.yellow}>0</Big></g>
    <g transform={`translate(760 560) scale(${pop(f, 20)})`}><Big x={0} y={0} size={140} color={C.yellow}>60</Big></g>
  </Scene>
);
export const m09: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <g transform={`translate(540 640) scale(${pop(f, 4)})`}><Big x={0} y={0} size={140}>(0 + 60) ÷ 2</Big></g>
    <g transform={`translate(540 960) scale(${pop(f, 16)})`}><Big x={0} y={0} size={300} color={C.yellow}>= 30</Big></g>
  </Scene>
);
export const m10: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Field f={f} />
    <Baby x={300} y={1100} s={1.4} />
    <Bean x={760} y={FEET} s={1.4} {...ELDER} face="smug" armR={30} armL={20} holdR={<Cane />} />
    <Stamp f={f} a={12} x={540} y={520} text="NOT 30" size={130} />
  </Scene>
);
export const m11: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Field f={f} />
    <Bean x={540} y={FEET} s={1.5} coat="#6F6A86" hat="hood" face="happy" armL={150 + wob(f, 3, 10)} armR={150 - wob(f, 3, 10)} />
    <g transform={`translate(820 520) scale(${pop(f, 10)})`}><Big x={0} y={0} size={220} color={C.yellow}>50</Big></g>
  </Scene>
);
export const m12: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Field f={f} />
    <Bean x={540} y={FEET} s={1.5} {...ELDER} face="happy" armR={30} armL={150} holdR={<Cane />} />
    <g transform={`translate(260 520) scale(${pop(f, 4)})`}><Big x={0} y={0} size={180}>60</Big></g>
    <g transform={`translate(820 520) scale(${pop(f, 20)})`}><Big x={0} y={0} size={180} color={C.yellow}>70</Big></g>
  </Scene>
);
export const m13: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Timber />
    {[0, 1, 2, 3, 4].map((k) => <Bean key={k} x={140 + k * 200} y={FEET - (k % 2) * 30} s={0.85} {...ELDER} coat={["#6F6A86", "#8B7A5E", "#5E7A4A", "#7A3B2E", "#3D5A80"][k]} face="happy" armL={20 + wob(f + k * 7, 4, 10)} armR={30} holdR={<Cane />} />)}
  </Scene>
);
export const m14: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <Rays f={f} x={540} y={800} o={0.3} />
    <Bean x={540} y={FEET} s={1.5} coat="#7E4A8C" hat="crown" face="smug" armL={20} armR={20} />
    <g transform={`translate(820 520) scale(${pop(f, 16)})`}><Big x={0} y={0} size={200} color={C.yellow}>~80</Big></g>
  </Scene>
);
export const m15: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Field f={f} />
    <Bean x={540} y={FEET} s={1.5} {...PEASANT} face="deadpan" armR={-40 + wob(f, 2, 10)} armL={20} />
    <g transform={`translate(800 520) scale(${pop(f, 6)})`}><Big x={0} y={0} size={220}>?</Big></g>
  </Scene>
);
export const m16: React.FC<ShotProps> = ({ f }) => {
  const k = ramp(f, 10, 30, move);
  return (
    <Scene f={f}>
      <Parchment />
      <Card x={540} y={760} w={760} h={420}>
        <Ink x={0} y={-80} size={60}>{k < 0.5 ? "AVERAGE: 30" : "LIFESPAN: 30"}</Ink>
        <Ink x={0} y={40} size={44}>{k < 0.5 ? "(all births)" : "(wrong)"}</Ink>
      </Card>
      {k >= 0.5 ? <Stamp f={f} a={30} x={540} y={1060} text="MISREAD" size={110} /> : null}
    </Scene>
  );
};
export const m17: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <rect x={120} y={1100} width={840} height={10} fill={C.line} />
    <Bar x={340} base={1100} h={300} color={C.yellow} label="AVERAGE" k={pop(f, 4, 10)} />
    <Bar x={740} base={1100} h={620} color={C.red} label="ADULTS" k={pop(f, 14, 12)} />
  </Scene>
);
export const m18: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Field f={f} />
    <Bean x={300} y={FEET} s={1.2} {...PEASANT} face="happy" armL={20} armR={20} />
    <Bean x={760} y={FEET} s={1.4} {...ELDER} face="smug" armR={30} armL={20} holdR={<Cane />} />
    <g transform={`translate(300 600) scale(${pop(f, 4)})`}><Big x={0} y={0} size={140} color={C.yellow}>30</Big></g>
    <g transform={`translate(760 520) scale(${pop(f, 18)})`}><Big x={0} y={0} size={140} color={C.yellow}>70+</Big></g>
  </Scene>
);
export const m19: React.FC<ShotProps> = ({ f }) => <Scene f={f}><ZeroCard f={f} label="DEAD AT 30?" value="NOPE" color={C.yellow} /></Scene>;
/** The loop: back to the opening (wrong) version. */
export const m20: React.FC<ShotProps> = ({ f }) => <Scene f={f + 5}>{oldPose(f)}<g transform="translate(820 520)"><Big x={0} y={0} size={220} color={C.yellow}>30</Big></g></Scene>;

export const SHOT_VIEWS: Record<string, React.FC<ShotProps>> = { m01, m02, m03, m04, m05, m06, m07, m08, m09, m10, m11, m12, m13, m14, m15, m16, m17, m18, m19, m20 };
