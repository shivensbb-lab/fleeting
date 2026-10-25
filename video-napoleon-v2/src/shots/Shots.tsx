import React from "react";
import { arrive, mix, move, ramp } from "../lib/ease";
import { C } from "../lib/style";
import { FONT } from "../fonts";
import { Bean } from "../ui/Bean";

type ShotProps = { f: number };
const LW = 11;
const pop = (f: number, a: number, d = 6) => ramp(f, a, a + d, arrive);
const wob = (f: number, sp = 5, amp = 1) => Math.sin(f / sp) * amp;
const HORIZON = 1150;
const FEET = 1190;

/* ---------- backgrounds ---------- */
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
const Field: React.FC<{ f: number; smoke?: boolean }> = ({ f, smoke = true }) => (
  <g>
    <Sky f={f} />
    <path d={`M0 ${HORIZON - 120} C 240 ${HORIZON - 220} 420 ${HORIZON - 90} 640 ${HORIZON - 160} C 820 ${HORIZON - 220} 980 ${HORIZON - 140} 1080 ${HORIZON - 170} L1080 1920 L0 1920 Z`}
      fill={C.hillFar} stroke={C.line} strokeWidth={LW} />
    <path d={`M0 ${HORIZON} C 300 ${HORIZON - 40} 700 ${HORIZON + 30} 1080 ${HORIZON - 20} L1080 1920 L0 1920 Z`} fill={C.ground} stroke={C.line} strokeWidth={LW} />
    {smoke ? [0, 1, 2].map((k) => (
      <circle key={k} cx={140 + k * 380 + wob(f + k * 20, 12, 10)} cy={HORIZON - 170 - k * 20} r={46 + k * 10} fill={C.cloud} stroke={C.line} strokeWidth={8} opacity={0.9} />
    )) : null}
  </g>
);
const Timber: React.FC<{ window?: boolean }> = ({ window = true }) => (
  <g>
    <rect x={0} y={0} width={1080} height={1920} fill={C.timber} />
    {[120, 540, 960].map((x) => <rect key={x} x={x - 22} y={0} width={44} height={HORIZON} fill={C.beam} stroke={C.line} strokeWidth={8} />)}
    <rect x={0} y={260} width={1080} height={40} fill={C.beam} stroke={C.line} strokeWidth={8} />
    {window ? (
      <g>
        <rect x={650} y={420} width={250} height={300} fill="#BFD6DD" stroke={C.line} strokeWidth={LW} />
        <path d="M775 420 L775 720 M650 570 L900 570" stroke={C.line} strokeWidth={9} />
      </g>
    ) : null}
    <rect x={0} y={HORIZON} width={1080} height={770} fill="#8B6440" stroke={C.line} strokeWidth={LW} />
    {[0, 1, 2, 3].map((k) => <path key={k} d={`M0 ${HORIZON + 90 + k * 110} L1080 ${HORIZON + 90 + k * 110}`} stroke="#6E4C2E" strokeWidth={6} />)}
  </g>
);
const Parchment: React.FC = () => (
  <g>
    <rect x={0} y={0} width={1080} height={1920} fill={C.parchment} />
    {Array.from({ length: 30 }, (_, k) => <path key={k} d={`M0 ${k * 70} L1080 ${k * 70}`} stroke={C.parchLo} strokeWidth={3} />)}
  </g>
);
const Street: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <Sky f={f} />
    {[0, 1, 2].map((k) => (
      <g key={k} transform={`translate(${k * 360} 0)`}>
        <path d={`M0 ${HORIZON} L0 520 L180 360 L360 520 L360 ${HORIZON} Z`} fill={C.parchment} stroke={C.line} strokeWidth={LW} strokeLinejoin="round" />
        <path d={`M0 520 L360 520 M0 760 L360 760 M60 520 L60 ${HORIZON} M300 520 L300 ${HORIZON} M60 760 L300 520`} stroke={C.beam} strokeWidth={14} />
        <rect x={140} y={880} width={80} height={HORIZON - 880} fill={C.beam} stroke={C.line} strokeWidth={8} />
      </g>
    ))}
    <rect x={0} y={HORIZON} width={1080} height={770} fill={C.stone} stroke={C.line} strokeWidth={LW} />
  </g>
);
const Rays: React.FC<{ f: number; x: number; y: number; o?: number }> = ({ f, x, y, o = 0.55 }) => (
  <g transform={`translate(${x} ${y}) rotate(${f * 0.6})`} opacity={o}>
    {Array.from({ length: 12 }, (_, k) => (
      <path key={k} d="M0 0 L-60 -900 L60 -900 Z" fill={C.yellow} transform={`rotate(${k * 30})`} />
    ))}
  </g>
);
const Sword: React.FC = () => (
  <g>
    <path d="M0 0 L0 -170" stroke={C.line} strokeWidth={26} strokeLinecap="round" />
    <path d="M0 0 L0 -170" stroke="#D9DEE6" strokeWidth={12} strokeLinecap="round" />
    <path d="M-30 -8 L30 -8" stroke={C.line} strokeWidth={18} strokeLinecap="round" />
  </g>
);
const Checkbox: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-150} y={-150} width={300} height={300} rx={34} fill={C.white} stroke={C.line} strokeWidth={22} />
  </g>
);
const Poster: React.FC<{ x: number; y: number; s: number; f: number }> = ({ x, y, s, f }) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(3)`}>
    <rect x={-170} y={-230} width={340} height={430} fill={C.white} stroke={C.line} strokeWidth={LW} />
    <circle cx={0} cy={-214} r={12} fill={C.red} />
    <Bean x={0} y={160} s={0.5} hat="bicorne" face="angry" hair armL={150 + wob(f, 1.5, 25)} armR={150 - wob(f, 1.5, 25)} />
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
/** Big outlined lettering: white fill over a heavy black stroke, like the reference's title text. */
const Big: React.FC<{ x: number; y: number; size: number; children: React.ReactNode; color?: string; anchor?: "middle" | "start" }> = ({ x, y, size, children, color = C.white, anchor = "middle" }) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={FONT.hero} fontWeight={900} fontSize={size} letterSpacing={-size * 0.02} fill={color}
    stroke={C.line} strokeWidth={size * 0.14} strokeLinejoin="round" paintOrder="stroke">{children}</text>
);

/* ---------- the twenty shots ---------- */
const NAP = { hat: "bicorne" as const, hair: true };

const heroPose = (f: number) => (
  <>
    <Field f={f} />
    <Rays f={f} x={540} y={760} o={0.45} />
    <Bean x={540} y={FEET} s={1.55} {...NAP} face="smug" armR={165} armL={35} holdR={<Sword />} />
  </>
);
export const battle: React.FC<ShotProps> = ({ f }) => <Scene f={f}>{heroPose(f)}</Scene>;

export const squash: React.FC<ShotProps> = ({ f }) => {
  const shrink = ramp(f, 22, 28, arrive);
  const nib = ramp(f, 4, 22, move);
  return (
    <Scene f={f}>
      <Field f={f + 75} />
      <Bean x={540} y={FEET} s={mix(1.55, 0.6, shrink)} {...NAP} face={shrink > 0.5 ? "panic" : "smug"} armR={shrink > 0.5 ? 150 : 165} armL={shrink > 0.5 ? 150 : 35} holdR={shrink > 0.5 ? undefined : <Sword />} />
      <g transform={`translate(${mix(900, 640, nib)} ${mix(-200, 700, nib) - shrink * 60}) rotate(35)`}>
        <path d="M-40 -600 L40 -600 L40 -60 L0 30 L-40 -60 Z" fill={C.brit} stroke={C.line} strokeWidth={LW} strokeLinejoin="round" />
        <path d="M-40 -60 L0 30 L40 -60 Z" fill="#E5E1D8" stroke={C.line} strokeWidth={LW} strokeLinejoin="round" />
      </g>
      {shrink > 0 ? [0, 1, 2, 3].map((k) => <path key={k} d="M0 -40 L0 -90" stroke={C.line} strokeWidth={10} strokeLinecap="round" transform={`translate(540 ${FEET - 120}) rotate(${-60 + k * 40}) translate(0 ${-shrink * 60})`} />) : null}
    </Scene>
  );
};

export const title: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Field f={f + 150} />
    <Bean x={540} y={FEET} s={1.55} {...NAP} face="deadpan" armL={20} armR={20} />
    <g transform={`translate(540 430) scale(${mix(1.3, 1, pop(f, 2, 6))}) translate(-540 -430)`}>
      <Big x={540} y={380} size={168}>NAPOLEON</Big>
      <Big x={540} y={540} size={140}>BONAPARTE</Big>
    </g>
  </Scene>
);

export const same: React.FC<ShotProps> = ({ f }) => {
  const line = ramp(f, 14, 34, move);
  return (
    <Scene f={f}>
      <Field f={f} smoke={false} />
      <Bean x={360} y={FEET} s={1.4} {...NAP} face="deadpan" />
      <Bean x={720} y={FEET} s={1.4} hat="shako" face="blank" />
      <path d={`M200 ${FEET - 1.4 * 358} L${200 + line * 690} ${FEET - 1.4 * 358}`} stroke={C.yellow} strokeWidth={16} strokeDasharray="34 22" strokeLinecap="round" />
    </Scene>
  );
};

export const crowd: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Field f={f} smoke={false} />
    {[[110, 1.3], [270, 1.5], [810, 1.35], [970, 1.25]].map(([x, s], i) => (
      <Bean key={i} x={x} y={FEET - 30} s={s * 0.85} coat={i % 2 ? C.slate : "#7B6A55"} face="blank" />
    ))}
    <Bean x={540} y={FEET} s={1.42} {...NAP} face="smug" armL={20} armR={20} />
  </Scene>
);

export const autopsy: React.FC<ShotProps> = ({ f }) => {
  const unroll = ramp(f, 6, 26, move);
  return (
    <Scene f={f}>
      <Timber window={false} />
      <Bean x={300} y={FEET} s={1.45} coat={C.white} face="blank" armR={70} armL={20} />
      <g transform="translate(560 640)">
        <rect x={0} y={0} width={380} height={40 + unroll * 380} rx={10} fill={C.white} stroke={C.line} strokeWidth={LW} />
        <rect x={-14} y={-18} width={408} height={40} rx={20} fill={C.parchLo} stroke={C.line} strokeWidth={LW} />
        {unroll > 0.6 ? <Big x={190} y={250} size={90} color={C.white}>5 ft 2</Big> : null}
      </g>
    </Scene>
  );
};

const RulerBar: React.FC<{ y: number; color: string; unit: number; label: string; f: number; from: number }> = ({ y, color, unit, label, f, from }) => {
  const t = ramp(f, 0, 10, arrive);
  return (
    <g transform={`translate(${90 + from * (1 - t) * 1000} ${y})`}>
      <Big x={0} y={-40} size={80} anchor="start">{label}</Big>
      <rect x={0} y={0} width={unit * 3.4} height={150} rx={16} fill={color} stroke={C.line} strokeWidth={LW} />
      {Array.from({ length: 14 }, (_, k) => <path key={k} d={`M${(k * unit) / 4} 0 L${(k * unit) / 4} ${k % 4 ? 46 : 90}`} stroke={C.white} strokeWidth={k % 4 ? 6 : 10} />)}
    </g>
  );
};
export const rulers: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <RulerBar y={560} color={C.navy} unit={271} label="FRENCH" f={f} from={-1} />
    <RulerBar y={920} color={C.brit} unit={254} label="BRITISH" f={f} from={1} />
  </Scene>
);

export const blocks: React.FC<ShotProps> = ({ f }) => {
  const g = ramp(f, 8, 30, move);
  const k = 3;
  return (
    <Scene f={f}>
      <Parchment />
      <Big x={90} y={500} size={64} anchor="start">2.71 cm</Big>
      <rect x={90} y={530} width={mix(254, 271, g) * k} height={170} rx={18} fill={C.navy} stroke={C.line} strokeWidth={LW} />
      <Big x={90} y={840} size={64} anchor="start">2.54 cm</Big>
      <rect x={90} y={870} width={254 * k} height={170} rx={18} fill={C.brit} stroke={C.line} strokeWidth={LW} />
      <path d={`M${90 + 254 * k} 500 L${90 + 254 * k} 1070`} stroke={C.yellow} strokeWidth={12} strokeDasharray="26 18" />
      {pop(f, 40, 6) > 0 ? <Big x={540} y={1230} size={72}>5'2" FR = 5'7" UK</Big> : null}
    </Scene>
  );
};

export const nobody1: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <Checkbox x={540} y={660} s={mix(0.6, 1, pop(f, 2, 8))} />
    <Bean x={170} y={FEET} s={1.2} {...NAP} face="deadpan" />
  </Scene>
);

const Cartoonist: React.FC<{ f: number; x: number; s: number; face?: "smug" | "happy" }> = ({ f, x, s, face = "smug" }) => (
  <Bean x={x} y={FEET} s={s} coat={C.brit} face={face} armR={95 + wob(f, 1.8, 10)} armL={20}
    holdR={<path d="M0 0 L46 -80" stroke={C.line} strokeWidth={10} strokeLinecap="round" />} />
);
export const shop: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Timber />
    <rect x={430} y={880} width={560} height={46} rx={10} fill="#9A6B3E" stroke={C.line} strokeWidth={LW} />
    <path d="M470 926 L470 1190 M950 926 L950 1190" stroke={C.line} strokeWidth={22} strokeLinecap="round" />
    <rect x={560} y={760} width={320} height={130} rx={6} fill={C.white} stroke={C.line} strokeWidth={9} transform="rotate(-5 720 820)" />
    <Cartoonist f={f} x={330} s={1.45} />
  </Scene>
);

export const doodle: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <rect x={0} y={0} width={1080} height={1920} fill={C.timber} />
    <rect x={90} y={250} width={900} height={1060} rx={12} fill={C.white} stroke={C.line} strokeWidth={LW} transform="rotate(-2 540 780)" />
    {[0, 1, 2].map((k) => <path key={k} d={`M${300 + k * 160} ${1100 + wob(f + k * 4, 1.2, 8)} q20 -30 40 0 q20 30 40 0`} fill="none" stroke={C.line} strokeWidth={6} />)}
    <Bean x={540 + wob(f, 1.3, 10)} y={1080} s={1.15} hat="bicorne" hair face="angry" armL={150 + wob(f, 1.2, 30)} armR={150 - wob(f, 1.2, 30)} legs={36 + wob(f, 1, 10)} />
  </Scene>
);

export const street: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Street f={f} />
    <Poster x={540} y={700} s={1} f={f} />
    {[150, 330, 750, 930].map((x, i) => (
      <Bean key={x} x={x} y={FEET + 120 - Math.abs(wob(f + i * 9, 2.5, 18))} s={1.05} coat={i % 2 ? C.brit : C.slate} face="blank" armL={140 + wob(f, 2, 15)} armR={40} />
    ))}
  </Scene>
);

export const normal: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Street f={f} />
    <Poster x={780} y={640} s={0.8} f={f} />
    <Bean x={390} y={FEET} s={1.5} {...NAP} face="deadpan" armR={-30} armL={20} />
  </Scene>
);

export const sure: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Street f={f} />
    <Poster x={300} y={640} s={0.8} f={f} />
    <Bean x={700} y={FEET} s={1.5} coat={C.brit} face="smug" armL={40} armR={40} />
  </Scene>
);

export const guards: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f} zoom={mix(1.08, 1.0, ramp(f, 0, 75, move))}>
    <Field f={f} smoke={false} />
    <Bean x={210} y={FEET} s={1.95} hat="bearskin" face="blank" armL={10} armR={10} />
    <Bean x={870} y={FEET} s={1.95} hat="bearskin" face="blank" armL={10} armR={10} />
    <Bean x={540} y={FEET} s={1.3} {...NAP} face="deadpan" armL={20} armR={20} />
  </Scene>
);

const Cheering: React.FC<{ f: number }> = ({ f }) => (
  <>
    {[110, 290, 790, 970].map((x, i) => (
      <Bean key={x} x={x} y={FEET + 40 - Math.abs(wob(f + i * 7, 2.6, 26))} s={1.1} hat="shako" face="blank" armL={160 + wob(f + i, 1.6, 14)} armR={160 - wob(f + i, 1.6, 14)} />
    ))}
  </>
);
export const corporal: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Field f={f} />
    <Cheering f={f} />
    <Bean x={540} y={FEET} s={1.45} {...NAP} face="happy" />
  </Scene>
);

export const nobody2: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Field f={f + 75} />
    <Cheering f={f + 75} />
    <Bean x={540} y={FEET} s={1.45} {...NAP} face="deadpan" />
    {[0, 1, 2, 3].map((k) => {
      const t = ((f + k * 20) % 75) / 75;
      return <path key={k} transform={`translate(${220 + k * 210} ${760 - t * 420}) scale(${2 - t})`} d="M0 12 C -34 -22 -12 -46 0 -20 C 12 -46 34 -22 0 12 Z" fill={C.red} stroke={C.line} strokeWidth={4} opacity={1 - t} />;
    })}
    <Checkbox x={540} y={420} s={0.55 * pop(f, 30, 6)} />
  </Scene>
);

const Book: React.FC<{ flag?: number }> = ({ flag = 0 }) => (
  <g transform={`translate(540 ${FEET - 40})`}>
    <path d="M-380 0 L-380 -300 Q-190 -340 0 -300 Q190 -340 380 -300 L380 0 Q190 -40 0 0 Q-190 -40 -380 0 Z" fill={C.white} stroke={C.line} strokeWidth={LW} strokeLinejoin="round" />
    <path d="M0 -300 L0 0" stroke={C.line} strokeWidth={8} />
    {[0, 1, 2, 3].map((k) => <path key={k} d={`M-320 ${-240 + k * 56} L-60 ${-240 + k * 56} M60 ${-240 + k * 56} L320 ${-240 + k * 56}`} stroke={C.parchLo} strokeWidth={14} strokeLinecap="round" />)}
    {flag > 0 ? (
      <g transform={`translate(0 ${-300 - (1 - flag) * 200}) scale(${flag})`}>
        <path d="M0 0 L0 -420" stroke={C.line} strokeWidth={16} strokeLinecap="round" />
        <rect x={0} y={-420} width={110} height={200} fill={C.navy} stroke={C.line} strokeWidth={8} />
        <rect x={110} y={-420} width={110} height={200} fill={C.white} stroke={C.line} strokeWidth={8} />
        <rect x={220} y={-420} width={110} height={200} fill={C.red} stroke={C.line} strokeWidth={8} />
      </g>
    ) : null}
  </g>
);
export const argue: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Timber window={false} />
    <Book />
    {[0, 1, 2].map((k) => {
      const t = pop(f, 4 + k * 8, 6);
      return t > 0 ? <Big key={k} x={260 + k * 280} y={620 + (k % 2) * 80 - Math.abs(wob(f + k * 5, 3, 20))} size={200 * t}>?</Big> : null;
    })}
  </Scene>
);
export const french: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Timber window={false} />
    <Rays f={f} x={540} y={700} o={0.4} />
    <Book flag={pop(f, 4, 10)} />
  </Scene>
);

/** The loop: ends on the exact opening pose so the Short repeats seamlessly. */
export const loop: React.FC<ShotProps> = ({ f }) => <Scene f={f + 5}>{heroPose(f === 74 ? 0 : f)}</Scene>;

export const SHOT_VIEWS: Record<string, React.FC<ShotProps>> = {
  battle, squash, title, same, crowd, autopsy, rulers, blocks, nobody1, shop, doodle, street, normal, sure, guards, corporal, nobody2, argue, french, loop,
};
