import React from "react";
import { arrive, leave, mix, move, ramp } from "../lib/ease";
import { C } from "../lib/style";
import { FONT } from "../fonts";
import { Stick } from "../ui/Stick";

const pop = (f: number, a: number, d = 12) => ramp(f, a, a + d, arrive);
const wob = (f: number, speed = 6, amp = 1) => Math.sin(f / speed) * amp;

/* ---------- props ---------- */
const Tent: React.FC = () => (
  <g>
    <path d="M0 160 L540 60 L1080 160 L1080 1080 L0 1080 Z" fill={C.tent} />
    <path d="M540 60 L540 1080" stroke={C.tentLo} strokeWidth={10} />
    <path d="M0 160 L540 60 L380 1080 L0 1080 Z" fill={C.tentLo} opacity={0.45} />
    <rect x={0} y={1080} width={1080} height={140} fill={C.woodLo} opacity={0.35} />
  </g>
);
const MapTable: React.FC<{ x: number }> = ({ x }) => (
  <g transform={`translate(${x} 0)`}>
    <rect x={-190} y={780} width={380} height={34} rx={8} fill={C.wood} stroke={C.ink} strokeWidth={8} />
    <path d="M-160 814 L-160 1080 M160 814 L160 1080" stroke={C.ink} strokeWidth={12} strokeLinecap="round" />
    <rect x={-150} y={756} width={300} height={30} rx={4} fill={C.paperHi} stroke={C.ink} strokeWidth={5} transform="skewX(-12)" />
    <circle cx={-70} cy={770} r={9} fill={C.navy} />
    <path d="M30 762 l18 16 m0 -16 l-18 16" stroke={C.red} strokeWidth={6} strokeLinecap="round" />
  </g>
);
const Crate: React.FC<{ x: number; y: number; w: number; h: number }> = ({ x, y, w, h }) => (
  <g>
    <rect x={x - w / 2} y={y - h} width={w} height={h} rx={6} fill={C.wood} stroke={C.ink} strokeWidth={8} />
    <path d={`M${x - w / 2} ${y - h} L${x + w / 2} ${y} M${x + w / 2} ${y - h} L${x - w / 2} ${y}`} stroke={C.woodLo} strokeWidth={8} />
  </g>
);
const Ground: React.FC = () => <rect x={0} y={1080} width={1080} height={140} fill={C.paperLo} />;
const Checkbox: React.FC<{ f: number; at: number; x?: number; y?: number }> = ({ f, at, x = 880, y = 300 }) => {
  const t = pop(f, at, 10);
  if (t <= 0) return null;
  return (
    <g transform={`translate(${x} ${y}) scale(${t}) rotate(${wob(f, 9, 4)})`}>
      <rect x={-56} y={-56} width={112} height={112} rx={14} fill={C.paperHi} stroke={C.ink} strokeWidth={10} />
      <text x={0} y={104} textAnchor="middle" fontFamily={FONT.mono} fontWeight={500} fontSize={30} fill={C.muted}>checked?</text>
    </g>
  );
};
const Bubble: React.FC<{ f: number; at: number; x: number; y: number; text: string; tail: "left" | "right"; color?: string }> = ({ f, at, x, y, text, tail, color = C.ink }) => {
  const t = pop(f, at, 10);
  if (t <= 0) return null;
  const w = text.length * 27 + 70;
  return (
    <g transform={`translate(${x} ${y}) scale(${t})`}>
      <rect x={-w / 2} y={-60} width={w} height={120} rx={60} fill={C.paperHi} stroke={color} strokeWidth={8} />
      <path d={tail === "left" ? `M${-w / 2 + 70} 52 l-40 60 l70 -52` : `M${w / 2 - 70} 52 l40 60 l-70 -52`} fill={C.paperHi} stroke={color} strokeWidth={8} strokeLinejoin="round" />
      <rect x={tail === "left" ? -w / 2 + 40 : w / 2 - 110} y={44} width={70} height={16} fill={C.paperHi} />
      <text x={0} y={17} textAnchor="middle" fontFamily={FONT.hero} fontWeight={800} fontSize={50} fill={C.ink}>{text}</text>
    </g>
  );
};
const Frame: React.FC<{ children: React.ReactNode; zoom?: number }> = ({ children, zoom = 1 }) => (
  <svg width={1080} height={1220} viewBox="0 0 1080 1220" style={{ position: "absolute", left: 0, top: 0 }}>
    <g transform={`translate(540 1080) scale(${zoom}) translate(-540 -1080)`}>{children}</g>
  </svg>
);

/* ---------- shots (f = frame within the 150-frame shot) ---------- */
export const A01_1: React.FC<{ f: number }> = ({ f }) => (
  <Frame zoom={mix(1.32, 1.4, ramp(f, 0, 150, move))}>
    <Tent />
    <MapTable x={720} />
    <Crate x={400} y={1080} w={170} h={150} />
    <Stick x={400} y={930 - Math.abs(wob(f, 5, 16))} s={0.6} hat="bicorne" face="angry" armR={110 + wob(f, 4, 14)} elbowR={-20} armL={30} look={1} />
  </Frame>
);

export const A01_2: React.FC<{ f: number }> = ({ f }) => {
  const step = ramp(f, 8, 34, move);
  const grow = ramp(f, 36, 60, arrive);
  const line = ramp(f, 66, 90, move);
  const s = mix(0.6, 1, grow);
  return (
    <Frame zoom={1.32}>
      <Tent />
      <MapTable x={760} />
      <Crate x={mix(400, 300, step)} y={1080} w={170} h={150} />
      <Stick x={mix(400, 470, step)} y={mix(930, 1080, step) - Math.sin(step * Math.PI) * 80} s={s} hat="bicorne" face="deadpan" armL={20} armR={20} look={1} />
      <Stick x={700} y={1080} s={1} hat="shako" face="flat" coat={C.navy} armL={15} armR={15} look={-1} />
      {line > 0 ? (
        <g>
          <path d={`M330 ${1080 - 336} L${330 + line * 520} ${1080 - 336}`} stroke={C.gold} strokeWidth={8} strokeDasharray="22 16" strokeLinecap="round" />
          <text x={540} y={1080 - 440} textAnchor="middle" fontFamily={FONT.mono} fontWeight={500} fontSize={36} fill={C.ink} opacity={line}>same height</text>
        </g>
      ) : null}
    </Frame>
  );
};

const Ruler: React.FC<{ y: number; color: string; label: string; unit: number; f: number; from: number }> = ({ y, color, label, unit, f, from }) => {
  const t = ramp(f, 0, 20, arrive);
  const x0 = 110 + from * (1 - t) * 900;
  return (
    <g transform={`translate(${x0} ${y})`}>
      <text x={0} y={-40} fontFamily={FONT.mono} fontWeight={500} fontSize={44} fill={C.ink}>{label}</text>
      <rect x={0} y={0} width={unit * 3.2} height={110} rx={12} fill={color} stroke={C.ink} strokeWidth={8} />
      {Array.from({ length: 4 }, (_, k) => (
        <path key={k} d={`M${k * unit} 0 L${k * unit} 70`} stroke={C.paperHi} strokeWidth={8} />
      ))}
      {Array.from({ length: 12 }, (_, k) => (
        <path key={k} d={`M${(k * unit) / 4} 0 L${(k * unit) / 4} 34`} stroke={C.paperHi} strokeWidth={5} opacity={0.8} />
      ))}
    </g>
  );
};
export const A02_1: React.FC<{ f: number }> = ({ f }) => {
  const note = pop(f, 46, 14);
  return (
    <Frame>
      <rect x={0} y={0} width={1080} height={1220} fill={C.paper} />
      <Ruler y={520} color={C.navy} label="French ruler" unit={271} f={f} from={-1} />
      <Ruler y={820} color={C.brit} label="British ruler" unit={254} f={f} from={1} />
      {note > 0 ? (
        <g transform={`translate(540 330) scale(${note}) rotate(-3)`}>
          <rect x={-300} y={-62} width={600} height={124} rx={18} fill={C.paperHi} stroke={C.ink} strokeWidth={8} />
          <text x={0} y={18} textAnchor="middle" fontFamily={FONT.mono} fontWeight={500} fontSize={46} fill={C.ink}>autopsy: 5 ft 2 in</text>
        </g>
      ) : null}
    </Frame>
  );
};

export const A02_2: React.FC<{ f: number }> = ({ f }) => {
  const g = ramp(f, 24, 56, move);
  const fr = mix(254, 271, g) * 2.4;
  const br = 254 * 2.4;
  const eq = pop(f, 72, 14);
  return (
    <Frame>
      <rect x={0} y={0} width={1080} height={1220} fill={C.paper} />
      <text x={110} y={380} fontFamily={FONT.mono} fontWeight={500} fontSize={40} fill={C.ink}>1 French inch = 2.71 cm</text>
      <rect x={110} y={410} width={fr} height={120} rx={14} fill={C.navy} stroke={C.ink} strokeWidth={8} />
      <text x={110} y={640} fontFamily={FONT.mono} fontWeight={500} fontSize={40} fill={C.ink}>1 British inch = 2.54 cm</text>
      <rect x={110} y={670} width={br} height={120} rx={14} fill={C.brit} stroke={C.ink} strokeWidth={8} />
      {g > 0.05 ? <path d={`M${110 + br} 400 L${110 + br} 800`} stroke={C.gold} strokeWidth={6} strokeDasharray="14 12" /> : null}
      {eq > 0 ? (
        <g transform={`translate(540 960) scale(${eq})`}>
          <text x={0} y={0} textAnchor="middle" fontFamily={FONT.hero} fontWeight={900} fontSize={60} fill={C.ink} letterSpacing={-2}>5'2" French = 5'7" British</text>
        </g>
      ) : null}
      <Checkbox f={f} at={100} />
    </Frame>
  );
};

const Shop: React.FC = () => (
  <g>
    <rect x={0} y={0} width={1080} height={1080} fill="#E6D9C2" />
    <rect x={640} y={220} width={300} height={300} rx={10} fill="#CFE0EA" stroke={C.ink} strokeWidth={10} />
    <path d="M790 220 L790 520 M640 370 L940 370" stroke={C.ink} strokeWidth={8} />
    {[260, 380].map((y) => (
      <g key={y}>
        <path d={`M90 ${y} L520 ${y}`} stroke={C.woodLo} strokeWidth={14} strokeLinecap="round" />
        {[0, 1, 2, 3, 4].map((k) => <rect key={k} x={110 + k * 70} y={y - 70 + (k % 2) * 10} width={44} height={70 - (k % 2) * 10} fill={k % 2 ? C.navy : C.brit} opacity={0.75} />)}
      </g>
    ))}
    <Ground />
  </g>
);
const Doodle: React.FC<{ t: number; f: number }> = ({ t, f }) => (
  <g transform={`scale(${t})`}>
    <Stick x={0} y={70} s={0.3} hat="bicorne" face="angry" armL={150 + wob(f, 2, 20)} armR={150 - wob(f, 2, 20)} legs={20} />
  </g>
);
export const A03_1: React.FC<{ f: number }> = ({ f }) => (
  <Frame zoom={1.22}>
    <Shop />
    <rect x={460} y={800} width={480} height={36} rx={8} fill={C.wood} stroke={C.ink} strokeWidth={8} />
    <path d="M500 836 L500 1080 M900 836 L900 1080" stroke={C.ink} strokeWidth={12} strokeLinecap="round" />
    <g transform="translate(720 790) rotate(-4)">
      <rect x={-130} y={-150} width={260} height={160} rx={6} fill={C.paperHi} stroke={C.ink} strokeWidth={6} />
      <g transform="translate(0 -40)"><Doodle t={pop(f, 18, 30) * 1.35} f={f} /></g>
    </g>
    <Stick x={330} y={1080} s={1} coat={C.brit} hat="tuft" face="grin" armR={92 + wob(f, 2.5, 10)} elbowR={-30} armL={20} look={1}
      holding={<path d="M0 0 L40 -70" stroke={C.ink} strokeWidth={6} strokeLinecap="round" />} />
  </Frame>
);

export const A03_2: React.FC<{ f: number }> = ({ f }) => (
  <Frame zoom={1.1}>
    <rect x={0} y={0} width={1080} height={1080} fill="#E9DFCF" />
    <Ground />
    <g transform={`translate(760 520) rotate(${3 + wob(f, 30, 1)})`}>
      <rect x={-200} y={-230} width={400} height={460} rx={8} fill={C.paperHi} stroke={C.ink} strokeWidth={8} />
      <circle cx={0} cy={-212} r={12} fill={C.red} />
      <Doodle t={1.9} f={f} />
    </g>
    <Stick x={300} y={1080} s={1} hat="bicorne" face="deadpan" armL={15} armR={15} look={1} />
    <Bubble f={f} at={8} x={380} y={480} text="I am a normal size." tail="left" />
    <Bubble f={f} at={72} x={700} y={900} text="Sure you are." tail="right" color={C.brit} />
  </Frame>
);

export const A04_1: React.FC<{ f: number }> = ({ f }) => {
  const look = f < 60 ? -1 : f < 100 ? 1 : 0;
  return (
    <Frame zoom={mix(1.12, 1.05, ramp(f, 0, 150, move))}>
      <rect x={0} y={0} width={1080} height={1080} fill="#DDE3EA" />
      <Ground />
      <Stick x={235} y={1080} s={1.38} hat="bearskin" face="flat" coat={C.navy} armL={10} armR={10} />
      <Stick x={845} y={1080} s={1.38} hat="bearskin" face="flat" coat={C.navy} armL={10} armR={10} />
      <Stick x={540} y={1080} s={1} hat="bicorne" face="deadpan" armL={20} armR={20} look={look} />
    </Frame>
  );
};

export const A04_2: React.FC<{ f: number }> = ({ f }) => (
  <Frame zoom={1.2}>
    <rect x={0} y={0} width={1080} height={1080} fill="#E2E8DD" />
    <Ground />
    {[120, 300, 780, 960].map((x, i) => (
      <Stick key={x} x={x} y={1080 - Math.abs(wob(f + i * 7, 4, 22))} s={0.82} hat="shako" face="happy" armL={160 + wob(f + i * 5, 3, 14)} armR={160 - wob(f + i * 5, 3, 14)} />
    ))}
    <Stick x={540} y={1080} s={1} hat="bicorne" face="flat" armL={20} armR={20} />
    {[0, 1, 2, 3, 4].map((k) => {
      const t = ((f + k * 30) % 120) / 120;
      return <path key={k} transform={`translate(${200 + k * 170} ${700 - t * 400}) scale(${1 - t * 0.3})`} d="M0 10 C -30 -20 -10 -40 0 -18 C 10 -40 30 -20 0 10 Z" fill={C.red} opacity={1 - t} />;
    })}
    <Checkbox f={f} at={96} />
  </Frame>
);

export const A05_1: React.FC<{ f: number }> = ({ f }) => {
  const slam = ramp(f, 62, 74, leave);
  const puff = ramp(f, 74, 100);
  return (
    <Frame>
      <rect x={0} y={0} width={1080} height={1080} fill="#E6DCCB" />
      <rect x={0} y={900} width={1080} height={320} fill={C.wood} />
      <g transform="translate(540 820)">
        <rect x={-380} y={-280} width={380} height={300} fill={C.paperHi} stroke={C.ink} strokeWidth={8} />
        <rect x={0} y={-280} width={380} height={300} fill={C.paperHi} stroke={C.ink} strokeWidth={8} />
        <g transform="translate(-190 -100)"><Doodle t={1.3} f={f} /></g>
        {[0, 1, 2, 3, 4].map((k) => <path key={k} d={`M40 ${-230 + k * 46} L${300 - (k % 2) * 60} ${-230 + k * 46}`} stroke={C.muted} strokeWidth={8} strokeLinecap="round" />)}
        {slam > 0 ? <rect x={-380} y={-286} width={760 * slam} height={312} rx={10} fill={C.navy} stroke={C.ink} strokeWidth={8} /> : null}
        {puff > 0 ? [-1, 1].map((d) => <circle key={d} cx={d * (400 + puff * 80)} cy={0} r={30 * (1 - puff) + 6} fill={C.paperLo} opacity={1 - puff} />) : null}
      </g>
      {[0, 1, 2].map((k) => {
        const t = pop(f, 14 + k * 8, 10) * (1 - ramp(f, 58, 66));
        return t > 0 ? <text key={k} x={300 + k * 240} y={360 + (k % 2) * 40} textAnchor="middle" fontFamily={FONT.hero} fontWeight={900} fontSize={120 * t} fill={C.ink} transform={`rotate(${(k - 1) * 10} ${300 + k * 240} 360)`}>?</text> : null;
      })}
      {pop(f, 96) > 0 ? (
        <g transform={`translate(540 380) scale(${pop(f, 96)})`}>
          <rect x={-60} y={-80} width={40} height={120} fill={C.navy} />
          <rect x={-20} y={-80} width={40} height={120} fill={C.paperHi} />
          <rect x={20} y={-80} width={40} height={120} fill={C.red} />
          <path d="M-60 -80 L-60 140" stroke={C.ink} strokeWidth={10} strokeLinecap="round" />
        </g>
      ) : null}
    </Frame>
  );
};

export const A05_2: React.FC<{ f: number }> = ({ f }) => {
  const card = pop(f, 64, 16);
  return (
    <Frame>
      <rect x={0} y={0} width={1080} height={1080} fill={C.paper} />
      <Ground />
      <Stick x={540} y={1080} s={1.05} hat="bicorne" face="deadpan" armL={15} armR={15} elbowL={-105} elbowR={-105} />
      <Checkbox f={f} at={30} x={860} y={820} />
      {card > 0 ? (
        <g transform={`translate(540 500) scale(${card})`}>
          <text x={0} y={-30} textAnchor="middle" fontFamily={FONT.hero} fontWeight={900} fontSize={96} fill={C.ink} letterSpacing={-3}>UNDER 7 MINUTES</text>
          <text x={0} y={50} textAnchor="middle" fontFamily={FONT.accent} fontStyle="italic" fontSize={64} fill={C.red}>Big history, shorter stories.</text>
          <g transform="translate(0 140)">
            <rect x={-170} y={-44} width={340} height={88} rx={44} fill={C.red} />
            <text x={0} y={16} textAnchor="middle" fontFamily={FONT.hero} fontWeight={800} fontSize={44} fill={C.paperHi}>SUBSCRIBE</text>
          </g>
        </g>
      ) : null}
    </Frame>
  );
};
