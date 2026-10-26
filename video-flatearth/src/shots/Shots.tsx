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
const LAND = "#8FAE6A";
const ROBE = "#6B5848";

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
  </g>
);
const Ship: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-200 0 Q0 60 200 0 L240 -90 L160 -40 L-170 -40 L-230 -80 Z" fill={C.beam} stroke={C.line} strokeWidth={LW} strokeLinejoin="round" />
    <path d="M0 -40 L0 -360 M-120 -40 L-120 -260" stroke={C.line} strokeWidth={14} />
    <path d="M-110 -340 L110 -340 L100 -120 L-100 -120 Z" fill={C.white} stroke={C.line} strokeWidth={LW} strokeLinejoin="round" />
    <path d="M0 -320 L0 -140 M-60 -230 L60 -230" stroke={C.red} strokeWidth={22} />
  </g>
);
const Harbour: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <Sky f={f} />
    <rect x={0} y={HORIZON - 260} width={1080} height={300} fill={SEA} stroke={C.line} strokeWidth={LW} />
    <Ship x={820} y={HORIZON - 120 + wob(f, 9, 6)} s={0.9} />
    <rect x={0} y={HORIZON} width={1080} height={770} fill={C.beam} stroke={C.line} strokeWidth={LW} />
    {[0, 1, 2, 3].map((k) => <path key={k} d={`M0 ${HORIZON + 100 + k * 120} L1080 ${HORIZON + 100 + k * 120}`} stroke="#5A3E25" strokeWidth={6} />)}
  </g>
);
const Desert: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect x={0} y={0} width={1080} height={1920} fill="#E9D7A6" />
    <circle cx={820} cy={330} r={110} fill={C.yellow} stroke={C.line} strokeWidth={LW} />
    <path d={`M0 ${HORIZON} C 300 ${HORIZON - 40} 700 ${HORIZON + 30} 1080 ${HORIZON - 20} L1080 1920 L0 1920 Z`} fill={SAND} stroke={C.line} strokeWidth={LW} />
    {[0, 1].map((k) => <path key={k} d={`M${120 + k * 700} ${HORIZON - 30} l40 -60 l40 60 Z`} fill="#CDB57A" stroke={C.line} strokeWidth={8} opacity={0.6 + wob(f, 20, 0.1)} />)}
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
const Rays: React.FC<{ f: number; x: number; y: number; o?: number }> = ({ f, x, y, o = 0.5 }) => (
  <g transform={`translate(${x} ${y}) rotate(${f * 0.6})`} opacity={o}>
    {Array.from({ length: 12 }, (_, k) => <path key={k} d="M0 0 L-60 -900 L60 -900 Z" fill={C.yellow} transform={`rotate(${k * 30})`} />)}
  </g>
);
/** A cartoon globe: an inanimate object, no face. */
const Globe: React.FC<{ x: number; y: number; r: number; f: number }> = ({ x, y, r, f }) => {
  const sh = ((f * 1.2) % 200) - 100;
  return (
    <g transform={`translate(${x} ${y})`}>
      <defs><clipPath id={`gc${r}`}><circle r={r} /></clipPath></defs>
      <circle r={r} fill={SEA} stroke={C.line} strokeWidth={LW} />
      <g clipPath={`url(#gc${r})`}><g transform={`scale(${r / 200})`}>
        <path d={`M${-120 + sh} -90 C ${-60 + sh} -140 ${20 + sh} -110 ${10 + sh} -40 C ${0 + sh} 20 ${-60 + sh} 40 ${-90 + sh} 0 Z`} fill={LAND} stroke={C.line} strokeWidth={8} />
        <path d={`M${60 + sh} 30 C ${120 + sh} 10 ${150 + sh} 80 ${100 + sh} 130 C ${60 + sh} 140 ${40 + sh} 80 ${60 + sh} 30 Z`} fill={LAND} stroke={C.line} strokeWidth={8} />
        <path d={`M${-260 + sh} 20 C ${-200 + sh} -10 ${-170 + sh} 60 ${-220 + sh} 110 Z`} fill={LAND} stroke={C.line} strokeWidth={8} />
      </g></g>
      <circle r={r} fill="none" stroke={C.line} strokeWidth={LW} />
    </g>
  );
};
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
const COLUMBUS = { coat: C.brit, hat: "cap" as const, hair: true };
const SCHOLAR = { coat: ROBE, hat: "hood" as const };

/* ---------- cold open ---------- */
const warnPose = (f: number) => (
  <>
    <Harbour f={f} />
    {[110, 280, 800, 960].map((x, i) => (
      <Bean key={x} x={x} y={FEET + 60 - Math.abs(wob(f + i * 6, 2.4, 14))} s={1.0} coat={i % 2 ? C.slate : "#7B6A55"} face="blank" armL={140 + wob(f + i, 1.5, 15)} armR={70} />
    ))}
    <Bean x={540} y={FEET} s={1.45} {...COLUMBUS} face="smug" armL={30} armR={40} />
    <g transform={`translate(540 520) scale(${pop(f, 6, 6)})`}><Big x={0} y={0} size={240} color={C.red}>!!</Big></g>
  </>
);
export const warn: React.FC<ShotProps> = ({ f }) => <Scene f={f}>{warnPose(f)}</Scene>;

export const twist: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Harbour f={f + 75} />
    {[110, 280, 800, 960].map((x, i) => (
      <Bean key={x} x={x} y={FEET + 60} s={1.0} coat={i % 2 ? C.slate : "#7B6A55"} face="blank" armL={110} armR={110} />
    ))}
    <Bean x={540} y={FEET} s={1.45} {...COLUMBUS} face="deadpan" armL={20} armR={20} />
    <g transform={`translate(540 560) scale(${pop(f, 10, 6)})`}><Big x={0} y={0} size={200}>?</Big></g>
  </Scene>
);

export const title: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <rect x={0} y={0} width={1080} height={1920} fill="#1F2A44" />
    {Array.from({ length: 40 }, (_, k) => <circle key={k} cx={(k * 197) % 1080} cy={(k * 331) % 1150} r={4 + (k % 3) * 2} fill={C.cloud} opacity={0.7 + wob(f + k, 6, 0.3)} />)}
    <Globe x={540} y={820} r={300} f={f} />
    <g transform={`translate(540 360) scale(${mix(1.3, 1, pop(f, 2, 6))}) translate(-540 -360)`}>
      <Big x={540} y={330} size={150}>THE FLAT</Big>
      <Big x={540} y={480} size={120} color={C.yellow}>EARTH MYTH</Big>
    </g>
  </Scene>
);

/* ---------- the Greeks ---------- */
const GREEK = { coat: C.white, hat: "laurel" as const, beard: "#8A8A8A" };
export const greek: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Desert f={f} />
    <path d={`M640 ${FEET} L640 ${FEET - 360}`} stroke={C.line} strokeWidth={22} strokeLinecap="round" />
    <path d={`M640 ${FEET} L${640 + mix(40, 220, ramp(f, 0, 70, move))} ${FEET}`} stroke="#3B3B3B" strokeWidth={20} strokeLinecap="round" opacity={0.6} />
    <Bean x={370} y={FEET} s={1.45} {...GREEK} face="happy" armR={70 + wob(f, 3, 8)} armL={20} />
  </Scene>
);
export const stick: React.FC<ShotProps> = ({ f }) => {
  const ang = mix(6, 7.2, ramp(f, 0, 60, move));
  return (
    <Scene f={f}>
      <Desert f={f + 30} />
      <path d={`M540 ${FEET} L540 ${FEET - 620}`} stroke={C.line} strokeWidth={34} strokeLinecap="round" />
      <path d={`M540 ${FEET} L540 ${FEET - 620}`} stroke={C.beam} strokeWidth={16} strokeLinecap="round" />
      <path d={`M540 ${FEET} L${540 + Math.tan((ang * Math.PI) / 180) * 620} ${FEET}`} stroke="#3B3B3B" strokeWidth={26} strokeLinecap="round" opacity={0.7} />
      <path d={`M540 ${FEET - 620} L${540 + Math.tan((ang * Math.PI) / 180) * 620} ${FEET}`} stroke={C.yellow} strokeWidth={8} strokeDasharray="20 16" />
      <Big x={700} y={FEET - 300} size={90} color={C.yellow} anchor="start">7.2°</Big>
    </Scene>
  );
};
export const close: React.FC<ShotProps> = ({ f }) => {
  const wrap = ramp(f, 4, 40, move);
  return (
    <Scene f={f}>
      <Parchment />
      <Globe x={540} y={760} r={300} f={f} />
      <path d={`M240 760 A300 110 0 0 0 ${240 + wrap * 600} 760`} fill="none" stroke={C.yellow} strokeWidth={22} strokeLinecap="round" />
      <g transform={`translate(860 420) scale(${pop(f, 36, 6)})`}><Big x={0} y={0} size={180}>?</Big></g>
    </Scene>
  );
};

/* ---------- the Middle Ages ---------- */
const Desk: React.FC<{ x: number; globe?: boolean; f: number }> = ({ x, globe, f }) => (
  <g>
    <rect x={x - 170} y={880} width={340} height={40} rx={8} fill="#9A6B3E" stroke={C.line} strokeWidth={LW} />
    <path d={`M${x - 140} 920 L${x - 140} ${FEET} M${x + 140} 920 L${x + 140} ${FEET}`} stroke={C.line} strokeWidth={20} strokeLinecap="round" />
    <rect x={x - 100} y={800} width={200} height={90} fill={C.white} stroke={C.line} strokeWidth={8} transform={`rotate(-6 ${x} 845)`} />
    {globe ? <circle cx={x} cy={845} r={30} fill={SEA} stroke={C.line} strokeWidth={6} /> : null}
    <path d={`M${x + 60} 820 l${30 + wob(f, 1.5, 6)} -70`} stroke={C.line} strokeWidth={8} strokeLinecap="round" />
  </g>
);
export const monks: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Timber />
    <Desk x={300} globe f={f} />
    <Desk x={800} globe f={f + 7} />
    <Bean x={170} y={FEET} s={1.2} {...SCHOLAR} face="deadpan" armR={80 + wob(f, 1.8, 8)} />
    <Bean x={660} y={FEET} s={1.2} {...SCHOLAR} face="deadpan" armR={80 + wob(f + 5, 1.8, 8)} />
  </Scene>
);
export const sphere: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <Rays f={f} x={540} y={760} o={0.3} />
    <g transform={`translate(540 ${800 + wob(f, 10, 6)}) rotate(-4)`}>
      <rect x={-300} y={-380} width={600} height={760} rx={20} fill="#7A3E2E" stroke={C.line} strokeWidth={LW} />
      <rect x={-260} y={-340} width={520} height={680} rx={12} fill="none" stroke={C.yellow} strokeWidth={8} />
      <circle cx={0} cy={-20} r={150} fill="none" stroke={C.yellow} strokeWidth={12} />
      <path d="M-150 -20 L150 -20 M0 -170 L0 130" stroke={C.yellow} strokeWidth={8} />
      <Big x={0} y={250} size={70} color={C.yellow}>DE SPHAERA</Big>
    </g>
  </Scene>
);
const Orb: React.FC = () => (
  <g transform="translate(0 -40)">
    <circle r={44} fill={C.yellow} stroke={C.line} strokeWidth={9} />
    <path d="M-44 0 L44 0 M0 -44 L0 44" stroke={C.line} strokeWidth={5} />
    <path d="M0 -44 L0 -96 M-20 -74 L20 -74" stroke={C.line} strokeWidth={10} strokeLinecap="round" />
  </g>
);
export const orb: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Timber />
    <Rays f={f} x={540} y={700} o={0.25} />
    <Bean x={540} y={FEET} s={1.55} coat="#7E3A68" hat="crown" beard="#8A6A44" face="smug" armR={70} armL={20} holdR={<Orb />} />
  </Scene>
);
const RoundCard: React.FC<{ f: number }> = ({ f }) => (
  <Scene f={f}>
    <rect x={0} y={0} width={1080} height={1920} fill="#1F2A44" />
    {Array.from({ length: 40 }, (_, k) => <circle key={k} cx={(k * 197) % 1080} cy={(k * 331) % 1150} r={4 + (k % 3) * 2} fill={C.cloud} opacity={0.8} />)}
    <Rays f={f} x={540} y={780} o={0.25} />
    <g transform={`scale(${mix(0.7, 1, pop(f, 2, 8))})`} style={{ transformOrigin: "540px 780px" }}>
      <Globe x={540} y={780} r={320} f={f} />
    </g>
  </Scene>
);
export const round1: React.FC<ShotProps> = ({ f }) => <RoundCard f={f} />;

/* ---------- the real argument ---------- */
export const size: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <Globe x={330} y={760} r={230} f={f} />
    <Globe x={820} y={820} r={mix(230, 120, ramp(f, 10, 40, move))} f={f} />
    <g transform={`translate(560 460) scale(${pop(f, 30, 6)})`}><Big x={0} y={0} size={160}>?</Big></g>
  </Scene>
);
export const small: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Harbour f={f} />
    <Bean x={480} y={FEET} s={1.5} {...COLUMBUS} face="smug" armR={75} armL={20}
      holdR={<g transform="translate(20 -30)"><circle r={36} fill={SEA} stroke={C.line} strokeWidth={8} /><path d="M-14 -10 C 0 -24 16 -14 10 4 C 4 14 -12 10 -14 -10 Z" fill={LAND} stroke={C.line} strokeWidth={4} /></g>} />
  </Scene>
);
const Table: React.FC = () => (
  <g>
    <rect x={160} y={900} width={760} height={46} rx={10} fill="#9A6B3E" stroke={C.line} strokeWidth={LW} />
    <path d="M200 946 L200 1190 M880 946 L880 1190" stroke={C.line} strokeWidth={22} strokeLinecap="round" />
    <rect x={260} y={840} width={560} height={70} fill={C.white} stroke={C.line} strokeWidth={8} />
    <path d="M300 875 L780 875" stroke={C.red} strokeWidth={8} strokeDasharray="22 14" />
  </g>
);
export const food: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Timber />
    <Bean x={300} y={880} s={1.0} {...SCHOLAR} face="deadpan" armR={90} />
    <Bean x={780} y={880} s={1.0} {...SCHOLAR} face="angry" armL={90} />
    <Table />
    <g transform={`translate(540 ${FEET}) scale(${pop(f, 20, 8)})`}>
      <rect x={-80} y={-150} width={160} height={150} rx={30} fill={C.beam} stroke={C.line} strokeWidth={LW} />
      <path d="M-80 -100 L80 -100 M-80 -50 L80 -50" stroke={C.line} strokeWidth={8} />
      <Big x={0} y={-180} size={70}>EMPTY</Big>
    </g>
  </Scene>
);
export const right: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Timber />
    <Rays f={f} x={540} y={760} o={0.3} />
    <Bean x={330} y={FEET} s={1.4} {...SCHOLAR} face="smug" armL={30} armR={30} />
    <Bean x={750} y={FEET} s={1.4} {...SCHOLAR} face="smug" armL={30} armR={30} />
  </Scene>
);
export const america: React.FC<ShotProps> = ({ f }) => {
  const sail = ramp(f, 0, 70, move);
  const land = ramp(f, 30, 40, arrive);
  return (
    <Scene f={f}>
      <rect x={0} y={0} width={1080} height={1920} fill={SEA} />
      {[0, 1, 2, 3, 4].map((k) => <path key={k} d={`M${80 + k * 200 + wob(f + k * 9, 8, 10)} ${400 + k * 180} q30 -18 60 0 q30 18 60 0`} fill="none" stroke={C.cloud} strokeWidth={8} strokeLinecap="round" />)}
      <path d={`M1080 ${200} C ${1080 - land * 380} 300 ${1080 - land * 260} 700 ${1080 - land * 420} 1000 C ${1080 - land * 300} 1200 1080 1300 1080 1300 Z`} fill={LAND} stroke={C.line} strokeWidth={LW} />
      <Ship x={mix(160, 560, sail)} y={760} s={0.55} />
    </Scene>
  );
};

/* ---------- the inventor ---------- */
const Writer: React.FC<{ f: number; face: "smug" | "happy" }> = ({ f, face }) => (
  <Bean x={330} y={FEET} s={1.45} coat="#2F3B2E" hair face={face} armR={95 + wob(f, 1.6, 12)} armL={20}
    holdR={<path d="M0 0 L46 -80" stroke={C.line} strokeWidth={10} strokeLinecap="round" />} />
);
export const irving: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Timber />
    <rect x={460} y={880} width={520} height={46} rx={10} fill="#9A6B3E" stroke={C.line} strokeWidth={LW} />
    <path d="M500 926 L500 1190 M940 926 L940 1190" stroke={C.line} strokeWidth={22} strokeLinecap="round" />
    <rect x={600} y={790} width={240} height={100} fill={C.white} stroke={C.line} strokeWidth={8} transform="rotate(-5 720 840)" />
    <rect x={880} y={770} width={36} height={110} fill={C.cloud} stroke={C.line} strokeWidth={6} />
    <path d={`M898 770 q${wob(f, 2, 8)} -30 0 -50`} fill={C.yellow} stroke={C.line} strokeWidth={5} />
    <Writer f={f} face="smug" />
    <Big x={760} y={560} size={110} color={C.yellow}>1828</Big>
  </Scene>
);
export const drama: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Timber />
    <Rays f={f} x={330} y={760} o={0.4} />
    {[0, 1, 2, 3, 4].map((k) => {
      const t = ((f + k * 15) % 75) / 75;
      return <rect key={k} x={480 + k * 100 + t * 80} y={900 - t * 700} width={110} height={140} fill={C.white} stroke={C.line} strokeWidth={7} transform={`rotate(${t * 220 * (k % 2 ? 1 : -1)} ${535 + k * 100 + t * 80} ${970 - t * 700})`} />;
    })}
    <Writer f={f} face="happy" />
  </Scene>
);
export const books: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    {Array.from({ length: 7 }, (_, k) => {
      const t = pop(f, k * 6, 6);
      if (t <= 0) return null;
      const colors = [C.red, C.navy, "#5E7A4A", "#7A3E2E", C.slate, C.brit, "#7E3A68"];
      return (
        <g key={k} transform={`translate(${540 + (k % 2 ? 30 : -30)} ${FEET - k * 110 - (1 - t) * 300})`}>
          <rect x={-260} y={-100} width={520} height={100} rx={12} fill={colors[k]} stroke={C.line} strokeWidth={LW} />
          <path d="M-220 -50 L220 -50" stroke={C.yellow} strokeWidth={8} />
        </g>
      );
    })}
  </Scene>
);
export const round2: React.FC<ShotProps> = ({ f }) => <RoundCard f={f + 75} />;

/** The loop: back to the opening so the Short repeats. */
export const loop: React.FC<ShotProps> = ({ f }) => <Scene f={f + 5}>{warnPose(f === 74 ? 0 : f)}</Scene>;

export const SHOT_VIEWS: Record<string, React.FC<ShotProps>> = {
  warn, twist, title, greek, stick, close, monks, sphere, orb, round1, size, small, food, right, america, irving, drama, books, round2, loop,
};

export const _unused = leave;
