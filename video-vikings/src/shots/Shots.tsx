import React from "react";
import { arrive, leave, mix, move, ramp } from "../lib/ease";
import { C } from "../lib/style";
import { FONT } from "../fonts";
import { Bean } from "../ui/Bean";

type ShotProps = { f: number };
const LW = 11;
const pop = (f: number, a: number, d = 6) => ramp(f, a, a + d, arrive);
const wob = (f: number, sp = 5, amp = 1) => Math.sin(f / sp) * amp;
const HORIZON = 1150;
const FEET = 1190;
const SEA = "#7FA9B3";
const SAND = "#D9C48E";
const FUR = "#8A6A44";
const BEARD = "#C9873A";
const TUNIC = "#5E7A4A";

/* ---------- shared pieces ---------- */
const Cloud: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <path transform={`translate(${x} ${y}) scale(${s})`} d="M-120 30 C -150 30 -150 -14 -112 -18 C -104 -64 -40 -70 -24 -36 C -6 -80 70 -74 74 -24 C 120 -28 134 30 96 30 Z"
    fill={C.cloud} stroke={C.line} strokeWidth={LW / s} strokeLinejoin="round" />
);
const Sky: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect x={0} y={0} width={1080} height={1920} fill={C.sky} />
    <Cloud x={200 + f * 0.3} y={330} s={1.3} />
    <Cloud x={820 - f * 0.2} y={520} s={1} />
    <Cloud x={560 + f * 0.25} y={190} s={0.8} />
  </g>
);
const Beach: React.FC<{ f: number; ship?: boolean }> = ({ f, ship = true }) => (
  <g>
    <Sky f={f} />
    <rect x={0} y={HORIZON - 260} width={1080} height={300} fill={SEA} stroke={C.line} strokeWidth={LW} />
    {[0, 1, 2].map((k) => <path key={k} d={`M${80 + k * 340 + wob(f + k * 9, 8, 14)} ${HORIZON - 170 + k * 40} q30 -18 60 0 q30 18 60 0`} fill="none" stroke={C.cloud} strokeWidth={8} strokeLinecap="round" />)}
    {ship ? (
      <g transform={`translate(860 ${HORIZON - 150 + wob(f, 9, 6)})`}>
        <path d="M-200 0 Q0 70 200 0 L230 -60 Q200 -10 180 -8 L-180 -8 Q-200 -10 -230 -60 Z" fill={C.beam} stroke={C.line} strokeWidth={LW} strokeLinejoin="round" />
        <path d="M0 -8 L0 -300" stroke={C.line} strokeWidth={14} />
        <path d="M-120 -280 L120 -280 L110 -60 L-110 -60 Z" fill={C.red} stroke={C.line} strokeWidth={LW} strokeLinejoin="round" />
        <path d="M-110 -200 L110 -200 M-110 -130 L110 -130" stroke={C.white} strokeWidth={14} />
      </g>
    ) : null}
    <path d={`M0 ${HORIZON + 20} C 300 ${HORIZON - 30} 700 ${HORIZON + 40} 1080 ${HORIZON - 10} L1080 1920 L0 1920 Z`} fill={SAND} stroke={C.line} strokeWidth={LW} />
  </g>
);
const Farm: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <Sky f={f} />
    <path d={`M0 ${HORIZON - 160} L200 ${HORIZON - 420} L380 ${HORIZON - 200} L560 ${HORIZON - 460} L800 ${HORIZON - 180} L1080 ${HORIZON - 380} L1080 1920 L0 1920 Z`} fill={C.slate} stroke={C.line} strokeWidth={LW} strokeLinejoin="round" />
    <path d={`M150 ${HORIZON - 340} L200 ${HORIZON - 420} L250 ${HORIZON - 350} Z M510 ${HORIZON - 380} L560 ${HORIZON - 460} L610 ${HORIZON - 380} Z`} fill={C.cloud} stroke={C.line} strokeWidth={8} strokeLinejoin="round" />
    <path d={`M0 ${HORIZON} C 300 ${HORIZON - 40} 700 ${HORIZON + 30} 1080 ${HORIZON - 20} L1080 1920 L0 1920 Z`} fill={C.hillNear} stroke={C.line} strokeWidth={LW} />
  </g>
);
const Timber: React.FC = () => (
  <g>
    <rect x={0} y={0} width={1080} height={1920} fill={C.timber} />
    {[120, 540, 960].map((x) => <rect key={x} x={x - 22} y={0} width={44} height={HORIZON} fill={C.beam} stroke={C.line} strokeWidth={8} />)}
    <rect x={0} y={260} width={1080} height={40} fill={C.beam} stroke={C.line} strokeWidth={8} />
    <rect x={0} y={HORIZON} width={1080} height={770} fill="#8B6440" stroke={C.line} strokeWidth={LW} />
  </g>
);
const Parchment: React.FC = () => (
  <g>
    <rect x={0} y={0} width={1080} height={1920} fill={C.parchment} />
    {Array.from({ length: 30 }, (_, k) => <path key={k} d={`M0 ${k * 70} L1080 ${k * 70}`} stroke={C.parchLo} strokeWidth={3} />)}
  </g>
);
const Stage: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect x={0} y={0} width={1080} height={1920} fill="#3A2630" />
    <rect x={60} y={200} width={960} height={HORIZON - 200} fill="#5C3B48" stroke={C.line} strokeWidth={LW} />
    <path d={`M60 200 Q220 ${520 + wob(f, 20, 10)} 140 ${HORIZON} L60 ${HORIZON} Z M1020 200 Q860 ${520 - wob(f, 20, 10)} 940 ${HORIZON} L1020 ${HORIZON} Z`} fill={C.red} stroke={C.line} strokeWidth={LW} />
    <path d="M60 200 Q540 330 1020 200 L1020 260 Q540 390 60 260 Z" fill={C.red} stroke={C.line} strokeWidth={LW} />
    <rect x={0} y={HORIZON} width={1080} height={770} fill={C.beam} stroke={C.line} strokeWidth={LW} />
    {[0, 1, 2, 3, 4, 5].map((k) => <circle key={k} cx={120 + k * 168} cy={HORIZON + 20} r={16} fill={C.yellow} stroke={C.line} strokeWidth={6} />)}
  </g>
);
const Rays: React.FC<{ f: number; x: number; y: number; o?: number }> = ({ f, x, y, o = 0.5 }) => (
  <g transform={`translate(${x} ${y}) rotate(${f * 0.6})`} opacity={o}>
    {Array.from({ length: 12 }, (_, k) => <path key={k} d="M0 0 L-60 -900 L60 -900 Z" fill={C.yellow} transform={`rotate(${k * 30})`} />)}
  </g>
);
const Axe: React.FC = () => (
  <g>
    <path d="M0 0 L0 -190" stroke={C.line} strokeWidth={24} strokeLinecap="round" />
    <path d="M0 0 L0 -190" stroke={C.beam} strokeWidth={11} strokeLinecap="round" />
    <path d="M0 -190 C 60 -210 80 -150 60 -110 C 40 -130 20 -140 0 -140 Z" fill="#C9CED6" stroke={C.line} strokeWidth={8} strokeLinejoin="round" />
  </g>
);
const Scene: React.FC<{ children: React.ReactNode; f: number; zoom?: number }> = ({ children, f, zoom = 1 }) => {
  const snap = mix(1.05, 1, pop(f, 0, 5)) * zoom; // every cut lands with a small snap
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
      <g transform={`translate(540 ${FEET}) scale(${snap}) translate(-540 -${FEET})`}>{children}</g>
    </svg>
  );
};
/** Big outlined lettering: white over a heavy black stroke. */
const Big: React.FC<{ x: number; y: number; size: number; children: React.ReactNode; color?: string; anchor?: "middle" | "start" }> = ({ x, y, size, children, color = C.white, anchor = "middle" }) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={FONT.hero} fontWeight={900} fontSize={size} letterSpacing={-size * 0.02} fill={color}
    stroke={C.line} strokeWidth={size * 0.14} strokeLinejoin="round" paintOrder="stroke">{children}</text>
);
const VIKING = { coat: TUNIC, beard: BEARD };

/* ---------- cold open ---------- */
const raidPose = (f: number) => (
  <>
    <Beach f={f} />
    <Rays f={f} x={540} y={760} o={0.4} />
    <Bean x={520} y={FEET} s={1.55} {...VIKING} hat="horned" face="angry" armR={165} armL={40} holdR={<Axe />} />
  </>
);
export const raid: React.FC<ShotProps> = ({ f }) => <Scene f={f}>{raidPose(f)}</Scene>;

export const pop_: React.FC<ShotProps> = ({ f }) => {
  const off = ramp(f, 14, 40, move);
  return (
    <Scene f={f}>
      <Beach f={f + 75} />
      <Bean x={520} y={FEET} s={1.55} {...VIKING} hat="horned" hornsOff={off} face={off > 0.1 ? "panic" : "angry"} armR={off > 0.1 ? 150 : 165} armL={off > 0.1 ? 150 : 40} holdR={off > 0.1 ? undefined : <Axe />} />
    </Scene>
  );
};

export const title: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Beach f={f + 150} />
    <Bean x={520} y={FEET} s={1.55} {...VIKING} hat="viking" face="deadpan" />
    <g transform={`translate(540 430) scale(${mix(1.3, 1, pop(f, 2, 6))}) translate(-540 -430)`}>
      <Big x={540} y={390} size={176}>VIKINGS</Big>
      <Big x={540} y={530} size={96}>THE HORN MYTH</Big>
    </g>
  </Scene>
);

/* ---------- the evidence ---------- */
const Helmet: React.FC<{ s: number }> = ({ s }) => (
  <g transform={`scale(${s})`}>
    <path d="M-150 60 C -150 -150 150 -150 150 60 Z" fill="#8C939C" stroke={C.line} strokeWidth={LW} strokeLinejoin="round" />
    <path d="M0 -102 L0 60 M-150 10 L150 10" stroke={C.line} strokeWidth={9} />
    <path d="M-100 60 Q-60 140 -10 70 L10 70 Q60 140 100 60" fill="#8C939C" stroke={C.line} strokeWidth={LW} strokeLinejoin="round" />
    <circle cx={-56} cy={84} r={22} fill={C.line} />
    <circle cx={56} cy={84} r={22} fill={C.line} />
  </g>
);
export const dig: React.FC<ShotProps> = ({ f }) => {
  const lift = ramp(f, 20, 44, arrive);
  return (
    <Scene f={f}>
      <Farm f={f} />
      <ellipse cx={640} cy={FEET + 10} rx={170} ry={46} fill={C.beam} stroke={C.line} strokeWidth={LW} />
      <Bean x={360} y={FEET} s={1.45} coat={C.slate} face="happy" armR={110} armL={30}
        holdR={<g transform={`translate(${lift * 60} ${-lift * 120})`}><Helmet s={0.45} /></g>} />
    </Scene>
  );
};
export const helmet: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <Rays f={f} x={540} y={760} o={0.35} />
    <g transform={`translate(540 ${780 + wob(f, 10, 8)})`}><Helmet s={1.6} /></g>
  </Scene>
);
const Zero: React.FC<{ f: number; still?: boolean }> = ({ f, still }) => (
  <Scene f={f}>
    <Parchment />
    <g transform="translate(300 760)"><Helmet s={0.9} /></g>
    <g transform={`translate(760 ${860}) scale(${pop(f, 3, 6)})`}>
      <Big x={0} y={0} size={420} color={C.yellow}>0</Big>
    </g>
    {still ? <Bean x={540} y={FEET + 60} s={1.0} {...VIKING} hat="viking" face="deadpan" /> : null}
  </Scene>
);
export const zero1: React.FC<ShotProps> = ({ f }) => <Zero f={f} />;

export const grab: React.FC<ShotProps> = ({ f }) => {
  const yank = ramp(f, 16, 30, arrive);
  return (
    <Scene f={f}>
      <Beach f={f} ship={false} />
      <Bean x={mix(640, 600, yank)} y={FEET} s={1.4} {...VIKING} hat="horned" face={yank > 0.5 ? "panic" : "angry"} armL={40} armR={30} />
      <Bean x={300} y={FEET} s={1.4} coat={C.slate} beard="#5A3A22" hat="viking" face="smug" armR={mix(60, 112, yank)} armL={30} />
    </Scene>
  );
};

/* ---------- the real horns ---------- */
export const where: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Beach f={f} />
    <Bean x={540} y={FEET} s={1.5} {...VIKING} hat="viking" face="deadpan" armR={-40 + wob(f, 2, 10)} armL={20} />
    <g transform={`translate(800 520) scale(${pop(f, 6, 6)})`}><Big x={0} y={0} size={200}>?</Big></g>
  </Scene>
);
const Stones: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <Sky f={f} />
    <path d={`M0 ${HORIZON} C 300 ${HORIZON - 40} 700 ${HORIZON + 30} 1080 ${HORIZON - 20} L1080 1920 L0 1920 Z`} fill={C.hillFar} stroke={C.line} strokeWidth={LW} />
    {[80, 980].map((x) => <rect key={x} x={x - 60} y={HORIZON - 380} width={120} height={400} rx={30} fill={C.stone} stroke={C.line} strokeWidth={LW} />)}
  </g>
);
const BronzePair: React.FC<{ f: number }> = ({ f }) => (
  <>
    <Bean x={360} y={FEET} s={1.3} coat="#A0773C" hat="horned" face="happy" armL={150 + wob(f, 6, 8)} armR={150 - wob(f, 6, 8)} />
    <Bean x={720} y={FEET} s={1.3} coat="#A0773C" hat="horned" face="happy" armL={150 - wob(f, 6, 8)} armR={150 + wob(f, 6, 8)} />
  </>
);
export const bronze: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Stones f={f} />
    <BronzePair f={f} />
  </Scene>
);
export const years: React.FC<ShotProps> = ({ f }) => {
  const run = ramp(f, 4, 40, move);
  return (
    <Scene f={f}>
      <Parchment />
      <path d={`M120 1060 L${120 + run * 840} 1060`} stroke={C.line} strokeWidth={18} strokeLinecap="round" />
      <path d={`M120 1060 L${120 + run * 840} 1060`} stroke={C.yellow} strokeWidth={8} strokeLinecap="round" />
      <Bean x={170} y={1020} s={0.8} coat="#A0773C" hat="horned" face="happy" />
      {run > 0.95 ? <Bean x={920} y={1020} s={0.8} {...VIKING} hat="viking" face="deadpan" /> : null}
      <Big x={540} y={560} size={150} color={C.yellow}>1,700 yrs</Big>
    </Scene>
  );
};
export const ritual: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Stones f={f} />
    <BronzePair f={f} />
    {[0, 1, 2].map((k) => {
      const t = pop(f, 4 + k * 8, 6);
      return t > 0 ? <Big key={k} x={260 + k * 280} y={520 + (k % 2) * 80 - Math.abs(wob(f + k * 5, 3, 20))} size={200 * t}>?</Big> : null;
    })}
  </Scene>
);

/* ---------- the makeover ---------- */
const Easel: React.FC<{ f: number; done: number }> = ({ f, done }) => (
  <g transform="translate(720 0)">
    <path d={`M-150 ${FEET} L-40 520 M150 ${FEET} L40 520 M0 520 L0 ${FEET}`} stroke={C.beam} strokeWidth={22} strokeLinecap="round" />
    <rect x={-200} y={480} width={400} height={480} fill={C.white} stroke={C.line} strokeWidth={LW} />
    <g transform="translate(0 900)">
      <Bean x={0} y={0} s={0.7 * done} {...VIKING} hat="horned" face="angry" armR={160 + wob(f, 3, 8)} armL={40} />
    </g>
  </g>
);
export const painter: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Timber />
    <Easel f={f} done={mix(0.4, 1, ramp(f, 0, 50, move))} />
    <Bean x={300} y={FEET} s={1.4} coat={C.navy} face="happy" armR={95 + wob(f, 1.8, 12)} armL={20}
      holdR={<path d="M0 0 L50 -60" stroke={C.line} strokeWidth={12} strokeLinecap="round" />} />
  </Scene>
);
export const cool: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Timber />
    <Rays f={f} x={720} y={720} o={0.35} />
    <Easel f={f} done={1} />
    <Bean x={300} y={FEET} s={1.4} coat={C.navy} face="smug" armL={30} armR={30} />
  </Scene>
);
export const opera: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Stage f={f} />
    <Bean x={380} y={FEET - 10} s={1.3} coat="#7E4A8C" beard={BEARD} hat="horned" face="happy" armL={150} armR={60 + wob(f, 3, 20)} />
    <Bean x={720} y={FEET - 10} s={1.3} coat="#3D6E8C" hat="horned" face="happy" armL={60 - wob(f, 3, 20)} armR={150} />
  </Scene>
);
export const clap: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <rect x={0} y={0} width={1080} height={1920} fill="#3A2630" />
    {[0, 1, 2].map((row) =>
      [0, 1, 2, 3, 4].map((k) => (
        <Bean key={`${row}-${k}`} x={110 + k * 215 + (row % 2) * 60} y={760 + row * 240 - Math.abs(wob(f + k * 5 + row * 7, 2.2, 12))} s={0.7}
          coat={row % 2 ? C.slate : C.brit} face="blank" armL={140 + wob(f + k, 1.2, 25)} armR={140 - wob(f + k, 1.2, 25)} />
      )),
    )}
  </Scene>
);
export const stuck: React.FC<ShotProps> = ({ f }) => {
  const slam = ramp(f, 4, 12, leave);
  return (
    <Scene f={f}>
      <Parchment />
      <g transform={`translate(540 760) rotate(-8) scale(${mix(2.2, 1, slam)})`} opacity={slam}>
        <rect x={-320} y={-110} width={640} height={220} rx={20} fill="none" stroke={C.red} strokeWidth={22} />
        <text x={0} y={46} textAnchor="middle" fontFamily={FONT.hero} fontWeight={900} fontSize={130} fill={C.red}>STUCK</text>
      </g>
    </Scene>
  );
};

/* ---------- today ---------- */
export const costume: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <rect x={0} y={0} width={1080} height={1920} fill="#B9C7D8" />
    {[[180, 300, C.red], [880, 380, C.yellow], [560, 220, C.navy]].map(([x, y, c], i) => (
      <g key={i} transform={`translate(${x} ${Number(y) + wob(f + i * 9, 6, 12)})`}>
        <ellipse cx={0} cy={0} rx={60} ry={74} fill={String(c)} stroke={C.line} strokeWidth={9} />
        <path d="M0 74 L0 260" stroke={C.line} strokeWidth={5} />
      </g>
    ))}
    <rect x={0} y={HORIZON} width={1080} height={770} fill={C.slate} stroke={C.line} strokeWidth={LW} />
    <Bean x={540} y={FEET} s={1.5} coat="#E07A3C" hat="party" face="happy" armL={150 + wob(f, 3, 12)} armR={150 - wob(f, 3, 12)} />
  </Scene>
);
export const real: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Beach f={f} />
    <Bean x={540} y={FEET} s={1.6} {...VIKING} hat="viking" face="deadpan" armL={20} armR={20} />
  </Scene>
);
export const zero2: React.FC<ShotProps> = ({ f }) => <Zero f={f} still />;

/** The loop: lands back on the opening (wrong) pose so the Short repeats. */
export const loop: React.FC<ShotProps> = ({ f }) => <Scene f={f + 5}>{raidPose(f === 74 ? 0 : f)}</Scene>;

export const SHOT_VIEWS: Record<string, React.FC<ShotProps>> = {
  raid, pop: pop_, title, dig, helmet, zero1, grab, where, bronze, years, ritual, painter, cool, opera, clap, stuck, costume, real, zero2, loop,
};
