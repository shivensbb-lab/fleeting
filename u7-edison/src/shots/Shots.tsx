import React from "react";
import { Bean } from "../ui/Bean";
import { Big, Book, C, Card, FEET, HORIZON, Ink, LW, Night, Parchment, Rays, Scene, ShotProps, Stamp, Timber, ZeroCard, mix, move, pop, ramp, wob } from "./kit";

const EDISON = { coat: "#3A3A44", hair: true };
const SWAN = { coat: "#5E7A4A", beard: "#C9C3B4" };
const DAVY = { coat: "#7A3B2E", hair: true };
const Bulb: React.FC<{ s?: number; on?: number; dead?: boolean; bamboo?: boolean }> = ({ s = 1, on = 1, dead, bamboo }) => (
  <g transform={`scale(${s})`}>
    {on > 0 && !dead ? <circle cx={0} cy={-90} r={110 * on} fill={C.yellow} opacity={0.35 * on} /> : null}
    <path d="M-60 -60 C -90 -110 -70 -170 0 -170 C 70 -170 90 -110 60 -60 C 40 -30 34 -10 34 10 L-34 10 C -34 -10 -40 -30 -60 -60 Z" fill={dead ? "#C9C3B4" : on > 0.5 ? "#FFF3B0" : "#E8EEF0"} stroke={C.line} strokeWidth={8} strokeLinejoin="round" />
    <path d={bamboo ? "M-16 -10 L-16 -90 Q0 -120 16 -90 L16 -10" : "M-16 -10 L-16 -70 Q-8 -110 0 -80 Q8 -110 16 -70 L16 -10"} fill="none" stroke={dead ? C.line : bamboo ? "#7E8538" : C.red} strokeWidth={5} />
    <rect x={-36} y={10} width={72} height={50} rx={8} fill="#9AA0A8" stroke={C.line} strokeWidth={7} />
    {[22, 36].map((y) => <path key={y} d={`M-36 ${y} L36 ${y}`} stroke={C.line} strokeWidth={4} />)}
  </g>
);
const Lab: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <Timber />
    <rect x={560} y={820} width={440} height={50} fill={C.beam} stroke={C.line} strokeWidth={LW} />
    <rect x={580} y={870} width={30} height={320} fill={C.beam} stroke={C.line} strokeWidth={8} /><rect x={950} y={870} width={30} height={320} fill={C.beam} stroke={C.line} strokeWidth={8} />
    {[640, 760, 880].map((x, i) => <g key={x}><rect x={x - 20} y={760} width={40} height={60} fill="#9FC3D4" stroke={C.line} strokeWidth={6} />{wob(f + i, 2) > 0.5 ? null : null}</g>)}
  </g>
);
const edisonPose = (f: number) => (
  <>
    <Lab f={f} />
    <Rays f={f} x={540} y={600} o={0.35} />
    <g transform={`translate(540 640) scale(${pop(f, 6)})`}><Bulb s={1.6} /></g>
    <Bean x={260} y={FEET} s={1.3} {...EDISON} face="happy" armR={150} armL={150} />
  </>
);

export const b01: React.FC<ShotProps> = ({ f }) => <Scene f={f}>{edisonPose(f)}<g transform={`translate(540 280) scale(${pop(f, 8)})`}><Big x={0} y={0} size={140} color={C.yellow}>1879</Big></g></Scene>;
export const b02: React.FC<ShotProps> = ({ f }) => <Scene f={f}>{edisonPose(f)}<Stamp f={f} a={12} x={540} y={300} text="NOT EXACTLY" size={100} /></Scene>;
export const b03: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Lab f={f} />
    <Bean x={540} y={FEET} s={1.15} {...EDISON} face="deadpan" />
    <g transform={`translate(540 330) scale(${mix(1.3, 1, pop(f, 2, 6))}) translate(-540 -330)`}>
      <Big x={540} y={290} size={150}>EDISON</Big>
      <Big x={540} y={410} size={86} color={C.yellow}>THE LIGHT BULB MYTH</Big>
    </g>
  </Scene>
);
export const b04: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Night f={f} />
    {[260, 540, 820].map((x, i) => <g key={x} transform={`translate(${x} 760) scale(${pop(f, 4 + i * 6)})`}><Bulb s={1.0} on={1} /></g>)}
    <g transform={`translate(540 360) scale(${pop(f, 22)})`}><Big x={0} y={0} size={110} color={C.yellow}>ALREADY HERE</Big></g>
  </Scene>
);
export const b05: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Lab f={f} />
    <Bean x={300} y={FEET} s={1.3} {...DAVY} face="happy" armR={110} armL={20} />
    <g transform="translate(760 620)">
      <path d="M-80 0 L-10 0 M10 0 L80 0" stroke={C.line} strokeWidth={22} strokeLinecap="round" />
      {pop(f, 8) > 0 ? <g><circle cx={0} cy={0} r={120 * pop(f, 8)} fill={C.yellow} opacity={0.5} /><path d={`M-12 0 L${wob(f, 1, 6)} -14 L12 0`} stroke={C.white} strokeWidth={10} fill="none" /></g> : null}
    </g>
    <g transform={`translate(760 380) scale(${pop(f, 14)})`}><Big x={0} y={0} size={100} color={C.yellow}>ARC LIGHT</Big></g>
  </Scene>
);
export const b06: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <rect x={0} y={0} width={1080} height={1920} fill="#FFF8D8" />
    <Rays f={f} x={540} y={700} o={0.6} />
    <Bean x={540} y={FEET} s={1.5} coat="#8B7A5E" face="panic" armL={150} armR={150} />
    <rect x={0} y={HORIZON} width={1080} height={770} fill="#E8DCC0" stroke={C.line} strokeWidth={LW} />
  </Scene>
);
export const b07: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Lab f={f} />
    {Array.from({ length: 2 }, (_, r) => Array.from({ length: 5 }, (_, k) => {
      const kk = pop(f, 2 + (r * 5 + k) * 2.5);
      return kk > 0 ? <Bean key={`${r}${k}`} x={120 + k * 210 + r * 60} y={FEET - 30 + r * 170} s={0.62 * kk} coat={["#3A3A44", "#5E7A4A", "#7A3B2E", "#3D5A80", "#7E4A8C"][(k + r) % 5]} hair face="happy" armR={150} armL={20} holdR={<g transform="translate(0 -20) scale(0.3)"><Bulb on={0} /></g>} /> : null;
    }))}
  </Scene>
);
export const b08: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Lab f={f} />
    <Bean x={300} y={FEET} s={1.3} {...SWAN} face="happy" armR={150} armL={20} holdR={<g transform="translate(0 -40) scale(0.5)"><Bulb /></g>} />
    <g transform={`translate(760 520) scale(${pop(f, 10)})`}><Big x={0} y={0} size={110} color={C.yellow}>SWAN</Big></g>
  </Scene>
);
export const b09: React.FC<ShotProps> = ({ f }) => {
  const k = ramp(f, 10, 18);
  return (
    <Scene f={f}>
      <Parchment />
      <g transform="translate(540 820)"><Bulb s={2.2} on={1 - k} dead={k > 0.9} /></g>
      {k > 0.9 ? <Stamp f={f} a={18} x={540} y={420} text="PFFT" size={140} /> : null}
    </Scene>
  );
};
export const b10: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Lab f={f} />
    {Array.from({ length: 12 }, (_, k) => { const kk = pop(f, 2 + k * 2); return kk > 0 ? <g key={k} transform={`translate(${130 + (k % 6) * 165} ${520 + Math.floor(k / 6) * 160}) scale(${kk * 0.5})`}><Bulb on={0} dead={k % 3 === 0} /></g> : null; })}
    <Bean x={540} y={FEET} s={1.1} {...EDISON} face="deadpan" armR={110} armL={20} />
  </Scene>
);
export const b11: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Night f={f} />
    <g transform="translate(540 760)"><Bulb s={2.0} on={1} /></g>
    <g transform={`translate(540 360) scale(${pop(f, 12)})`}><Big x={0} y={0} size={110} color={C.yellow}>LONGER</Big></g>
  </Scene>
);
export const b12: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Night f={f} />
    <g transform="translate(540 760)"><Bulb s={2.0} on={1} bamboo /></g>
    <g transform={`translate(540 360) scale(${pop(f, 12)})`}><Big x={0} y={0} size={110} color={C.yellow}>1,000+ HRS</Big></g>
  </Scene>
);
export const b13: React.FC<ShotProps> = ({ f }) => {
  const k = ramp(f, 6, 40, move);
  return (
    <Scene f={f}>
      <Night f={f} />
      <g transform={`translate(160 ${HORIZON})`}><rect x={-80} y={-300} width={160} height={300} fill="#5D6470" stroke={C.line} strokeWidth={LW} /><rect x={-30} y={-380} width={30} height={80} fill="#3A3F52" stroke={C.line} strokeWidth={6} /></g>
      <path d={`M240 ${HORIZON - 260} L${mix(240, 1040, k)} ${HORIZON - 260}`} stroke={C.line} strokeWidth={8} />
      {[440, 640, 840].map((x, i) => (mix(240, 1040, k) > x ? <g key={x} transform={`translate(${x} ${HORIZON - 130})`}><rect x={-60} y={-110} width={120} height={110} fill="#C9B79A" stroke={C.line} strokeWidth={8} /><rect x={-24} y={-80} width={48} height={40} fill={C.yellow} stroke={C.line} strokeWidth={5} /></g> : null))}
    </Scene>
  );
};
export const b14: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    {["POWER STATION", "WIRES", "METERS"].map((t, i) => <g key={t} transform={`translate(540 ${520 + i * 200}) scale(${pop(f, 4 + i * 10)})`}><Card x={0} y={0} w={620} h={140}><Ink x={0} y={22} size={64}>{t}</Ink></Card></g>)}
  </Scene>
);
export const b15: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Lab f={f} />
    <Bean x={300} y={FEET} s={1.3} {...EDISON} face="angry" armR={150} armL={20} holdR={<g transform="translate(0 -30) scale(0.25)"><Book x={0} y={0} title="" /></g>} />
    <Bean x={760} y={FEET} s={1.3} {...SWAN} face="panic" armL={150} armR={150} flip />
    <Stamp f={f} a={14} x={540} y={420} text="SUED" size={140} />
  </Scene>
);
export const b16: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Lab f={f} />
    <Bean x={mix(260, 420, ramp(f, 4, 20, move))} y={FEET} s={1.3} {...EDISON} face="happy" armR={80} armL={20} />
    <Bean x={mix(820, 660, ramp(f, 4, 20, move))} y={FEET} s={1.3} {...SWAN} face="happy" armL={80} armR={20} flip />
  </Scene>
);
export const b17: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <g transform={`translate(540 760) scale(${pop(f, 4)})`}><Card x={0} y={0} w={800} h={300} fill={C.yellow}><Big x={0} y={50} size={150}>EDISWAN</Big></Card></g>
  </Scene>
);
export const b18: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Lab f={f} />
    <Bean x={300} y={FEET} s={1.3} {...EDISON} face="smug" armR={110} armL={20} holdR={<g transform="translate(0 -40) scale(0.5)"><Bulb /></g>} />
    <Stamp f={f} a={8} x={720} y={420} text="PRACTICAL" size={90} color="#3E8E4E" />
    <Stamp f={f} a={24} x={720} y={640} text="NOT FIRST" size={90} />
  </Scene>
);
export const b19: React.FC<ShotProps> = ({ f }) => <Scene f={f}><ZeroCard f={f} label="BULB INVENTORS" value="LOTS" /></Scene>;
/** The loop: back to the opening (wrong) version. */
export const b20: React.FC<ShotProps> = ({ f }) => <Scene f={f + 5}>{edisonPose(f)}</Scene>;

export const SHOT_VIEWS: Record<string, React.FC<ShotProps>> = { b01, b02, b03, b04, b05, b06, b07, b08, b09, b10, b11, b12, b13, b14, b15, b16, b17, b18, b19, b20 };
