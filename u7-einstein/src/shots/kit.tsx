import React from "react";
import { arrive, leave, mix, move, ramp } from "../lib/ease";
import { C } from "../lib/style";
import { FONT } from "../fonts";

/** Shared kit for the Under 7 Minutes shorts: backgrounds, lettering, props. 1080×1920, feet line at FEET. */
export type ShotProps = { f: number; d: number };
export const LW = 11;
export const HORIZON = 1150;
export const FEET = 1190;
export const pop = (f: number, a: number, d = 6) => ramp(f, a, a + d, arrive);
export const wob = (f: number, sp = 5, amp = 1) => Math.sin(f / sp) * amp;
export { arrive, leave, mix, move, ramp, C, FONT };

export const Cloud: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <path transform={`translate(${x} ${y}) scale(${s})`} d="M-120 30 C -150 30 -150 -14 -112 -18 C -104 -64 -40 -70 -24 -36 C -6 -80 70 -74 74 -24 C 120 -28 134 30 96 30 Z"
    fill={C.cloud} stroke={C.line} strokeWidth={LW / s} strokeLinejoin="round" />
);
export const Sky: React.FC<{ f: number; color?: string }> = ({ f, color = C.sky }) => (
  <g>
    <rect x={0} y={0} width={1080} height={1920} fill={color} />
    <Cloud x={200 + f * 0.3} y={330} s={1.3} />
    <Cloud x={820 - f * 0.2} y={520} s={1} />
    <Cloud x={560 + f * 0.25} y={190} s={0.8} />
  </g>
);
export const Field: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <Sky f={f} />
    <path d={`M0 ${HORIZON - 120} C 300 ${HORIZON - 220} 700 ${HORIZON - 80} 1080 ${HORIZON - 180} L1080 1920 L0 1920 Z`} fill={C.hillFar} stroke={C.line} strokeWidth={LW} />
    <path d={`M0 ${HORIZON} C 300 ${HORIZON - 40} 700 ${HORIZON + 30} 1080 ${HORIZON - 20} L1080 1920 L0 1920 Z`} fill={C.hillNear} stroke={C.line} strokeWidth={LW} />
  </g>
);
export const Street: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <Sky f={f} color="#D8D2C4" />
    {[0, 1, 2, 3].map((k) => {
      const x = k * 280 - 20, h = 520 + (k % 2) * 120;
      return (
        <g key={k}>
          <rect x={x} y={HORIZON - h} width={260} height={h} fill={k % 2 ? "#C9B79A" : "#B7A383"} stroke={C.line} strokeWidth={LW} />
          <path d={`M${x - 10} ${HORIZON - h} L${x + 130} ${HORIZON - h - 90} L${x + 270} ${HORIZON - h} Z`} fill={C.slate} stroke={C.line} strokeWidth={LW} strokeLinejoin="round" />
          {[0, 1].map((r) => [0, 1].map((c) => <rect key={`${r}${c}`} x={x + 40 + c * 110} y={HORIZON - h + 70 + r * 170} width={70} height={100} fill="#5B6B7A" stroke={C.line} strokeWidth={8} />))}
        </g>
      );
    })}
    <rect x={0} y={HORIZON} width={1080} height={770} fill="#9C927E" stroke={C.line} strokeWidth={LW} />
  </g>
);
export const Palace: React.FC = () => (
  <g>
    <rect x={0} y={0} width={1080} height={1920} fill="#E9C7CF" />
    {[160, 920].map((x) => <rect key={x} x={x - 30} y={0} width={60} height={HORIZON} fill="#D9AFBA" stroke={C.line} strokeWidth={8} />)}
    <rect x={380} y={330} width={320} height={420} rx={20} fill="#F6E7C6" stroke={C.yellow} strokeWidth={22} />
    <rect x={380} y={330} width={320} height={420} rx={20} fill="none" stroke={C.line} strokeWidth={8} />
    <rect x={0} y={HORIZON} width={1080} height={770} fill="#B88A5A" stroke={C.line} strokeWidth={LW} />
    {Array.from({ length: 9 }, (_, k) => <path key={k} d={`M${k * 135} ${HORIZON} L${k * 135 - 120} 1920`} stroke="#9E7448" strokeWidth={6} />)}
  </g>
);
export const Timber: React.FC = () => (
  <g>
    <rect x={0} y={0} width={1080} height={1920} fill={C.timber} />
    {[120, 540, 960].map((x) => <rect key={x} x={x - 22} y={0} width={44} height={HORIZON} fill={C.beam} stroke={C.line} strokeWidth={8} />)}
    <rect x={0} y={260} width={1080} height={40} fill={C.beam} stroke={C.line} strokeWidth={8} />
    <rect x={0} y={HORIZON} width={1080} height={770} fill="#8B6440" stroke={C.line} strokeWidth={LW} />
  </g>
);
export const Dungeon: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect x={0} y={0} width={1080} height={1920} fill="#5E6168" />
    {Array.from({ length: 12 }, (_, r) => Array.from({ length: 5 }, (_, c) => (
      <rect key={`${r}-${c}`} x={c * 240 - (r % 2) * 120} y={r * 100} width={236} height={96} fill={(r + c) % 3 ? "#6E727A" : "#676B73"} stroke="#4A4D53" strokeWidth={6} />
    )))}
    <g transform={`translate(900 520)`}>
      <rect x={-12} y={0} width={24} height={90} fill={C.beam} stroke={C.line} strokeWidth={6} />
      <path d={`M0 -10 C ${-26 + wob(f, 2, 6)} -60 ${10 + wob(f, 3, 6)} -90 0 -120 C 30 -80 30 -40 0 -10 Z`} fill={C.yellow} stroke={C.line} strokeWidth={6} />
    </g>
    <rect x={0} y={HORIZON} width={1080} height={770} fill="#45484E" stroke={C.line} strokeWidth={LW} />
  </g>
);
export const Museum: React.FC<{ f?: number }> = () => (
  <g>
    <rect x={0} y={0} width={1080} height={1920} fill="#E3DCCB" />
    <rect x={0} y={170} width={1080} height={30} fill="#CFC5AE" stroke={C.line} strokeWidth={6} />
    {[200, 880].map((x) => <rect key={x} x={x - 70} y={380} width={140} height={180} fill="#F3EFE4" stroke={C.line} strokeWidth={8} />)}
    <rect x={0} y={HORIZON} width={1080} height={770} fill="#B9A98A" stroke={C.line} strokeWidth={LW} />
    {Array.from({ length: 6 }, (_, k) => <path key={k} d={`M0 ${HORIZON + 60 + k * 120} L1080 ${HORIZON + 60 + k * 120}`} stroke="#A4957A" strokeWidth={5} />)}
  </g>
);
export const Classroom: React.FC = () => (
  <g>
    <rect x={0} y={0} width={1080} height={1920} fill="#C9D3C0" />
    <rect x={90} y={300} width={900} height={560} rx={16} fill="#2F4A3A" stroke={C.beam} strokeWidth={26} />
    <rect x={90} y={300} width={900} height={560} rx={16} fill="none" stroke={C.line} strokeWidth={8} />
    <rect x={0} y={HORIZON} width={1080} height={770} fill="#A9865E" stroke={C.line} strokeWidth={LW} />
  </g>
);
export const Parchment: React.FC = () => (
  <g>
    <rect x={0} y={0} width={1080} height={1920} fill={C.parchment} />
    {Array.from({ length: 30 }, (_, k) => <path key={k} d={`M0 ${k * 70} L1080 ${k * 70}`} stroke={C.parchLo} strokeWidth={3} />)}
  </g>
);
export const Night: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect x={0} y={0} width={1080} height={1920} fill="#2B3350" />
    {Array.from({ length: 24 }, (_, k) => <circle key={k} cx={(k * 197) % 1080} cy={120 + ((k * 89) % 700)} r={4 + (k % 3)} fill={C.cloud} opacity={0.5 + 0.5 * Math.abs(Math.sin(f / 9 + k))} />)}
    <rect x={0} y={HORIZON} width={1080} height={770} fill="#3A3F52" stroke={C.line} strokeWidth={LW} />
  </g>
);
export const Rays: React.FC<{ f: number; x: number; y: number; o?: number; color?: string }> = ({ f, x, y, o = 0.5, color = C.yellow }) => (
  <g transform={`translate(${x} ${y}) rotate(${f * 0.6})`} opacity={o}>
    {Array.from({ length: 12 }, (_, k) => <path key={k} d="M0 0 L-60 -900 L60 -900 Z" fill={color} transform={`rotate(${k * 30})`} />)}
  </g>
);
export const Scene: React.FC<{ children: React.ReactNode; f: number; zoom?: number }> = ({ children, f, zoom = 1 }) => {
  const snap = mix(1.05, 1, pop(f, 0, 5)) * zoom; // every cut lands with a small snap
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
      <g transform={`translate(540 ${FEET}) scale(${snap}) translate(-540 -${FEET})`}>{children}</g>
    </svg>
  );
};
/** Big outlined lettering: white over a heavy black stroke. */
export const Big: React.FC<{ x: number; y: number; size: number; children: React.ReactNode; color?: string; anchor?: "middle" | "start" }> = ({ x, y, size, children, color = C.white, anchor = "middle" }) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={FONT.hero} fontWeight={900} fontSize={size} letterSpacing={-size * 0.02} fill={color}
    stroke={C.line} strokeWidth={size * 0.14} strokeLinejoin="round" paintOrder="stroke">{children}</text>
);
/** Plain dark lettering for signs and paper. */
export const Ink: React.FC<{ x: number; y: number; size: number; children: React.ReactNode; color?: string; anchor?: "middle" | "start"; serif?: boolean }> = ({ x, y, size, children, color = C.line, anchor = "middle", serif }) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={serif ? FONT.accent : FONT.hero} fontStyle={serif ? "italic" : "normal"} fontWeight={serif ? 400 : 900} fontSize={size} fill={color}>{children}</text>
);
/** Rubber stamp that slams down on frame a. */
export const Stamp: React.FC<{ f: number; a: number; x: number; y: number; text: string; color?: string; size?: number; rot?: number }> = ({ f, a, x, y, text, color = C.red, size = 130, rot = -8 }) => {
  const k = ramp(f, a, a + 8, leave); if (k <= 0) return null;
  const w = text.length * size * 0.66 + 80;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${mix(2.2, 1, k)})`} opacity={k}>
      <rect x={-w / 2} y={-size * 0.85} width={w} height={size * 1.4} rx={20} fill="none" stroke={color} strokeWidth={size * 0.17} />
      <text x={0} y={size * 0.36} textAnchor="middle" fontFamily={FONT.hero} fontWeight={900} fontSize={size} fill={color}>{text}</text>
    </g>
  );
};
/** A paper card / sign with lines of text. */
export const Card: React.FC<{ x: number; y: number; w: number; h: number; rot?: number; children?: React.ReactNode; fill?: string }> = ({ x, y, w, h, rot = 0, children, fill = C.white }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={14} fill={fill} stroke={C.line} strokeWidth={LW} />
    {children}
  </g>
);
export const Book: React.FC<{ x: number; y: number; s?: number; title?: string; open?: number }> = ({ x, y, s = 1, title = "", open = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {open > 0.5 ? (
      <g>
        <path d="M-260 -160 Q-130 -190 0 -150 L0 170 Q-130 130 -260 160 Z" fill={C.white} stroke={C.line} strokeWidth={LW} strokeLinejoin="round" />
        <path d="M260 -160 Q130 -190 0 -150 L0 170 Q130 130 260 160 Z" fill={C.white} stroke={C.line} strokeWidth={LW} strokeLinejoin="round" />
        {Array.from({ length: 6 }, (_, k) => <path key={k} d={`M-220 ${-100 + k * 44} L-40 ${-96 + k * 44} M40 ${-96 + k * 44} L220 ${-100 + k * 44}`} stroke={C.parchLo} strokeWidth={8} />)}
      </g>
    ) : (
      <g>
        <rect x={-150} y={-200} width={300} height={400} rx={12} fill="#7A3B2E" stroke={C.line} strokeWidth={LW} />
        <rect x={-110} y={-130} width={220} height={90} fill={C.parchment} stroke={C.line} strokeWidth={6} />
        <Ink x={0} y={-72} size={40}>{title}</Ink>
      </g>
    )}
  </g>
);
export const Newspaper: React.FC<{ x: number; y: number; s?: number; rot?: number; head: string; sub?: string }> = ({ x, y, s = 1, rot = 0, head, sub }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-300} y={-380} width={600} height={760} fill="#F1ECE0" stroke={C.line} strokeWidth={LW} />
    <Ink x={0} y={-300} size={46} serif>The Daily Clarion</Ink>
    <path d="M-260 -270 L260 -270" stroke={C.line} strokeWidth={6} />
    <Ink x={0} y={-180} size={78}>{head}</Ink>
    {sub ? <Ink x={0} y={-110} size={36}>{sub}</Ink> : null}
    {Array.from({ length: 9 }, (_, k) => <path key={k} d={`M-260 ${-40 + k * 44} L${k % 3 === 2 ? 120 : 260} ${-40 + k * 44}`} stroke={C.parchLo} strokeWidth={10} />)}
  </g>
);
/** The "zero" counter card used near the end of every short. */
export const ZeroCard: React.FC<{ f: number; label: string; value?: string; color?: string }> = ({ f, label, value = "0", color = C.yellow }) => (
  <g>
    <Parchment />
    <Big x={540} y={520} size={86}>{label}</Big>
    <g transform={`translate(540 980) scale(${pop(f, 3, 6)})`}><Big x={0} y={0} size={value.length > 2 ? 230 : 420} color={color}>{value}</Big></g>
  </g>
);
export const Arrow: React.FC<{ x1: number; y1: number; x2: number; y2: number; k?: number; color?: string }> = ({ x1, y1, x2, y2, k = 1, color = C.red }) => {
  const x = mix(x1, x2, k), y = mix(y1, y2, k), a = Math.atan2(y2 - y1, x2 - x1);
  return (
    <g>
      <path d={`M${x1} ${y1} L${x} ${y}`} stroke={C.line} strokeWidth={30} strokeLinecap="round" />
      <path d={`M${x1} ${y1} L${x} ${y}`} stroke={color} strokeWidth={14} strokeLinecap="round" />
      {k > 0.9 ? <path d={`M${x} ${y} L${x - 50 * Math.cos(a - 0.5)} ${y - 50 * Math.sin(a - 0.5)} L${x - 50 * Math.cos(a + 0.5)} ${y - 50 * Math.sin(a + 0.5)} Z`} fill={color} stroke={C.line} strokeWidth={8} strokeLinejoin="round" /> : null}
    </g>
  );
};
