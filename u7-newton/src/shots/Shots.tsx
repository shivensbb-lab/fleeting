import React from "react";
import { Bean } from "../ui/Bean";
import { Big, Book, C, Card, FEET, Field, HORIZON, Ink, LW, Night, Parchment, Rays, Scene, ShotProps, Stamp, Timber, ZeroCard, mix, move, pop, ramp, wob } from "./kit";

const NEWTON = { coat: "#5A3A5E", hat: "periwig" as const };
const STUKELEY = { coat: "#3D5A80", hat: "tricorn" as const };
const HEAD_TOP = (s: number) => FEET - 360 * s;

const Apple: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M0 -26 C -30 -46 -62 -22 -56 12 C -50 46 -20 58 0 48 C 20 58 50 46 56 12 C 62 -22 30 -46 0 -26 Z" fill={C.red} stroke={C.line} strokeWidth={8} strokeLinejoin="round" />
    <path d="M0 -26 L6 -52" stroke={C.line} strokeWidth={7} strokeLinecap="round" />
    <path d="M6 -46 C 24 -64 44 -58 46 -50 C 34 -38 18 -38 6 -46 Z" fill="#6E9A4A" stroke={C.line} strokeWidth={6} />
    <path d="M-30 -10 Q-34 6 -26 18" stroke={C.white} strokeWidth={7} fill="none" strokeLinecap="round" opacity={0.7} />
  </g>
);
const Tree: React.FC<{ x: number; apples?: boolean }> = ({ x, apples = true }) => (
  <g transform={`translate(${x} 0)`}>
    <path d={`M-40 ${HORIZON + 20} L-30 ${HORIZON - 420} L30 ${HORIZON - 420} L44 ${HORIZON + 20} Z`} fill={C.beam} stroke={C.line} strokeWidth={LW} strokeLinejoin="round" />
    {[[-150, 520, 190], [130, 500, 200], [0, 400, 220], [-40, 620, 200], [170, 650, 150]].map(([cx, cy, r], k) => (
      <circle key={k} cx={cx} cy={cy} r={r} fill={k % 2 ? "#7E9A55" : "#6F8C4A"} stroke={C.line} strokeWidth={LW} />
    ))}
    {apples ? [[-170, 500], [90, 430], [200, 640], [-60, 640], [20, 330]].map(([ax, ay], k) => <Apple key={k} x={ax} y={ay} s={0.6} />) : null}
  </g>
);
const Garden: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <Field f={f} />
    <Tree x={760} />
  </g>
);
const bonk = (f: number) => {
  const k = ramp(f, 4, 16);
  const hit = f >= 16;
  const top = HEAD_TOP(1.3);
  const ay = hit ? top - 40 - Math.max(0, 60 - (f - 16) * 6) * Math.abs(Math.sin((f - 16) / 3)) : mix(470, top - 40, k * k);
  return (
    <>
      <Garden f={f} />
      <Bean x={600} y={FEET} s={1.3} {...NEWTON} face={hit ? "panic" : "deadpan"} armL={hit ? 150 : 20} armR={hit ? 150 : 20} />
      <Apple x={hit ? 600 + (f - 16) * 5 : 600} y={ay} s={1.1} rot={hit ? (f - 16) * 15 : 0} />
      {hit ? <g transform={`translate(600 ${top - 150}) scale(${pop(f, 16, 5)})`}><Big x={0} y={0} size={110} color={C.yellow}>BONK!</Big></g> : null}
    </>
  );
};

export const b01: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    {bonk(f)}
    <g transform={`translate(300 300) scale(${pop(f, 2)})`}><Big x={0} y={0} size={140} color={C.yellow}>1666</Big></g>
  </Scene>
);
export const b02: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Garden f={f} />
    <Rays f={f} x={600} y={600} o={0.35} />
    <Bean x={600} y={FEET} s={1.3} {...NEWTON} face="happy" armL={150} armR={150} />
    <Apple x={600} y={HEAD_TOP(1.3) - 40} s={1.1} />
    <g transform={`translate(540 330) scale(${pop(f, 6)})`}><Big x={0} y={0} size={130} color={C.yellow}>GRAVITY!</Big></g>
  </Scene>
);
export const b03: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Garden f={f} />
    <Bean x={600} y={FEET} s={1.3} {...NEWTON} face="deadpan" />
    <Apple x={600} y={HEAD_TOP(1.3) - 40} s={1.1} />
    <Stamp f={f} a={6} x={500} y={330} text="NOT QUITE" size={110} />
  </Scene>
);
export const b04: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Garden f={f} />
    <Bean x={360} y={FEET} s={1.15} {...NEWTON} face="deadpan" />
    <g transform={`translate(540 330) scale(${mix(1.3, 1, pop(f, 2, 6))}) translate(-540 -330)`}>
      <Big x={540} y={290} size={150}>NEWTON</Big>
      <Big x={540} y={410} size={90} color={C.yellow}>THE BONK MYTH</Big>
    </g>
  </Scene>
);
export const b05: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <g transform={`translate(540 720) scale(${pop(f, 2) * 3})`}><Apple x={0} y={0} /></g>
    <Stamp f={f} a={14} x={540} y={330} text="PROBABLY REAL" size={90} color="#3E8E4E" rot={-4} />
  </Scene>
);
export const b06: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Field f={f} />
    <g transform={`translate(320 ${HORIZON})`}>
      <rect x={-200} y={-300} width={400} height={300} fill="#C9B79A" stroke={C.line} strokeWidth={LW} />
      <path d="M-230 -300 L0 -460 L230 -300 Z" fill={C.slate} stroke={C.line} strokeWidth={LW} strokeLinejoin="round" />
      <rect x={-40} y={-150} width={80} height={150} fill={C.beam} stroke={C.line} strokeWidth={8} />
      {[-130, 130].map((x) => <rect key={x} x={x - 35} y={-230} width={70} height={80} fill="#5B6B7A" stroke={C.line} strokeWidth={8} />)}
    </g>
    <Bean x={760} y={FEET} s={1.2} {...NEWTON} face="panic" armL={40} armR={40} />
    <g transform={`translate(540 300) scale(${pop(f, 12)})`}><Card x={0} y={0} w={640} h={150} fill="#3A3A44"><Big x={0} y={40} size={90} color={C.white}>PLAGUE!</Big></Card></g>
  </Scene>
);
export const b07: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Timber />
    <Bean x={300} y={FEET} s={1.25} coat="#5A3A5E" hat="periwig" face="happy" armR={110} armL={20} />
    <Bean x={780} y={FEET} s={1.25} {...STUKELEY} face="happy" flip armR={20} armL={20} holdR={<g transform="translate(0 -20) scale(0.22)"><Book x={0} y={0} title="" /></g>} />
    <g transform={`translate(780 460) scale(${pop(f, 14)})`}><Big x={0} y={0} size={80} color={C.yellow}>STUKELEY</Big></g>
    {pop(f, 6) > 0 ? <g transform={`translate(330 500) scale(${pop(f, 6)})`}><Card x={0} y={0} w={240} h={150}><Apple x={0} y={6} s={1} /></Card></g> : null}
  </Scene>
);
export const b08: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Garden f={f} />
    <Bean x={400} y={FEET} s={1.3} {...NEWTON} face="deadpan" armR={140} armL={20} />
    {[0, 1, 2].map((k) => { const kk = pop(f, 6 + k * 6); return kk > 0 ? <circle key={k} cx={480 + k * 40} cy={640 - k * 60} r={(12 + k * 10) * kk} fill={C.white} stroke={C.line} strokeWidth={6} /> : null; })}
    {pop(f, 24) > 0 ? <g transform={`translate(640 380) scale(${pop(f, 24)})`}><Card x={0} y={0} w={260} h={160}><Big x={0} y={50} size={120} color={C.yellow}>?</Big></Card></g> : null}
  </Scene>
);
export const b09: React.FC<ShotProps> = ({ f }) => {
  const k = ramp(f, 6, 26);
  return (
    <Scene f={f}>
      <Garden f={f} />
      <Bean x={300} y={FEET} s={1.3} {...NEWTON} face="happy" armL={20} armR={20} />
      <Apple x={960} y={mix(660, HORIZON + 40, k * k)} s={1} rot={k * 90} />
      {k < 1 ? <path d={`M960 ${mix(660, HORIZON, k * k) - 110} L960 ${mix(660, HORIZON, k * k) - 60}`} stroke={C.line} strokeWidth={6} strokeDasharray="10 10" /> : null}
    </Scene>
  );
};
export const b10: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <Apple x={540} y={mix(420, 900, ramp(f, 4, 30, move))} s={1.6} />
    <path d="M540 420 L540 1060" stroke={C.red} strokeWidth={10} strokeDasharray="22 18" opacity={0.6} />
    <path d="M500 1030 L540 1080 L580 1030" fill="none" stroke={C.red} strokeWidth={12} strokeLinecap="round" />
    <g transform={`translate(540 280) scale(${pop(f, 14)})`}><Big x={0} y={0} size={100} color={C.yellow}>STRAIGHT DOWN?</Big></g>
  </Scene>
);
export const b11: React.FC<ShotProps> = ({ f }) => {
  const k = ramp(f, 2, 14, move), k2 = ramp(f, 22, 34, move);
  return (
    <Scene f={f}>
      <Parchment />
      <Apple x={mix(540, 880, k)} y={760} s={1.4} rot={k * 90} />
      {k2 > 0 ? <Apple x={300} y={mix(900, 420, k2)} s={1.4} rot={-k2 * 90} /> : null}
      <Stamp f={f} a={8} x={760} y={560} text="SIDEWAYS?" size={80} rot={6} />
      <Stamp f={f} a={26} x={420} y={1080} text="UP?" size={100} />
    </Scene>
  );
};
export const b12: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Night f={f} />
    <circle cx={760} cy={380} r={150} fill="#E8E4D6" stroke={C.line} strokeWidth={LW} />
    {[[-40, -30, 26], [50, 40, 20], [-20, 70, 14]].map(([dx, dy, r], k) => <circle key={k} cx={760 + dx} cy={380 + dy} r={r} fill="#CFCAB8" stroke={C.line} strokeWidth={5} />)}
    <Tree x={260} />
    <path d={`M330 520 Q 540 ${520 - 180 * ramp(f, 4, 30)} ${mix(330, 640, ramp(f, 4, 30))} ${mix(520, 420, ramp(f, 4, 30))}`} fill="none" stroke={C.yellow} strokeWidth={10} strokeDasharray="20 16" />
    <g transform={`translate(540 760) scale(${pop(f, 26)})`}><Big x={0} y={0} size={90} color={C.yellow}>SAME PULL?</Big></g>
  </Scene>
);
export const b13: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Garden f={f} />
    <Bean x={600} y={FEET} s={1.3} {...NEWTON} face="smug" />
    <Apple x={920} y={HORIZON + 40} s={1} rot={60} />
    <Arrow2 f={f} />
    <Stamp f={f} a={16} x={420} y={330} text="NO BONK" size={110} color="#3E8E4E" />
  </Scene>
);
const Arrow2: React.FC<{ f: number }> = ({ f }) => (pop(f, 10) > 0 ? <path d={`M600 ${HEAD_TOP(1.3) - 140} L600 ${HEAD_TOP(1.3) - 60}`} stroke={C.line} strokeWidth={8} strokeDasharray="12 10" opacity={pop(f, 10)} /> : null);
export const b14: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <g transform={`translate(540 640) rotate(-3) scale(${pop(f, 4)})`}>
      <Card x={0} y={0} w={760} h={560}>
        <Bean x={-80} y={240} s={0.9} {...NEWTON} face="panic" armL={150} armR={150} />
        <Apple x={-80} y={-110} s={0.9} />
        <Big x={180} y={-150} size={90} color={C.yellow}>BONK!</Big>
      </Card>
    </g>
    <Stamp f={f} a={22} x={540} y={1060} text="ADDED LATER" size={90} />
  </Scene>
);
export const b15: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Timber />
    <Bean x={540} y={FEET} s={1.3} {...NEWTON} face="deadpan" armR={110} />
    {wob(f, 2) > 0 ? <path d="M520 460 L560 380 L530 380 L570 300" stroke={C.yellow} strokeWidth={16} fill="none" strokeLinejoin="round" opacity={0.35} /> : null}
    <Stamp f={f} a={10} x={540} y={300} text="NO FLASH" size={110} />
  </Scene>
);
export const b16: React.FC<ShotProps> = ({ f }) => {
  const n = Math.min(20, Math.floor(ramp(f, 2, 50) * 20));
  return (
    <Scene f={f}>
      <Timber />
      <Bean x={300} y={FEET} s={1.2} {...NEWTON} face="deadpan" armR={110} armL={20} />
      {Array.from({ length: n }, (_, k) => <rect key={k} x={560 + (k % 4) * 100} y={980 - Math.floor(k / 4) * 70} width={90} height={60} fill={k % 2 ? "#F3EFE4" : C.parchment} stroke={C.line} strokeWidth={6} />)}
      <g transform={`translate(540 320) scale(${pop(f, 6)})`}><Big x={0} y={0} size={110} color={C.yellow}>~20 YEARS</Big></g>
    </Scene>
  );
};
export const b17: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <g transform={`translate(540 760) scale(${pop(f, 4) * 2.4})`}><Book x={0} y={0} title="PRINCIPIA" /></g>
    <g transform={`translate(540 330) scale(${pop(f, 16)})`}><Big x={0} y={0} size={140} color={C.yellow}>1687</Big></g>
  </Scene>
);
export const b18: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Field f={f} />
    <g transform={`translate(200 ${HORIZON})`}>
      <rect x={-160} y={-300} width={320} height={300} fill="#C9B79A" stroke={C.line} strokeWidth={LW} />
      <path d="M-190 -300 L0 -440 L190 -300 Z" fill={C.slate} stroke={C.line} strokeWidth={LW} strokeLinejoin="round" />
    </g>
    <g transform={`translate(0 ${wob(f, 8, 4)})`}><Tree x={720} /></g>
    <Stamp f={f} a={12} x={540} y={280} text="STILL ALIVE" size={100} color="#3E8E4E" rot={-4} />
  </Scene>
);
export const b19: React.FC<ShotProps> = ({ f }) => <Scene f={f}><ZeroCard f={f} label="APPLES TO HEAD" /></Scene>;
/** The loop: back to the opening (wrong) version. */
export const b20: React.FC<ShotProps> = ({ f }) => <Scene f={f + 5}>{bonk(f)}</Scene>;

export const SHOT_VIEWS: Record<string, React.FC<ShotProps>> = { b01, b02, b03, b04, b05, b06, b07, b08, b09, b10, b11, b12, b13, b14, b15, b16, b17, b18, b19, b20 };
