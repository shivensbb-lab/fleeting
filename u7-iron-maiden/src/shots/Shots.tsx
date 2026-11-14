import React from "react";
import { Bean } from "../ui/Bean";
import { Big, Book, C, Card, Dungeon, FEET, Ink, Museum, Newspaper, Night, Parchment, Rays, Scene, ShotProps, Stamp, Timber, ZeroCard, mix, move, pop, ramp, wob } from "./kit";

const IRON = "#7C838C";
/** The cabinet: a tall iron figure-shaped box with a face; doors closed (open > 0 shows an empty interior with blunt studs). */
const Maiden: React.FC<{ x: number; y: number; s?: number; open?: number; tag?: string }> = ({ x, y, s = 1, open = 0, tag }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-150 0 L-170 -520 C -170 -640 -90 -700 0 -700 C 90 -700 170 -640 170 -520 L150 0 Z" fill={open > 0 ? "#3A3D42" : IRON} stroke={C.line} strokeWidth={12} strokeLinejoin="round" />
    {open > 0 ? Array.from({ length: 12 }, (_, k) => <circle key={k} cx={-80 + (k % 3) * 80} cy={-520 + Math.floor(k / 3) * 120} r={12} fill="#9AA0A8" stroke={C.line} strokeWidth={5} />) : (
      <g>
        <circle cx={0} cy={-560} r={70} fill="#9AA0A8" stroke={C.line} strokeWidth={9} />
        <path d="M-30 -575 L-12 -575 M12 -575 L30 -575 M-16 -530 L16 -530" stroke={C.line} strokeWidth={8} strokeLinecap="round" />
        <path d="M0 -480 L0 -20" stroke={C.line} strokeWidth={8} />
        {[-300, -150].map((yy) => <rect key={yy} x={-120} y={yy} width={240} height={26} fill="#5E646C" stroke={C.line} strokeWidth={6} />)}
      </g>
    )}
    {open > 0 ? <path d={`M150 0 L150 -620 L${150 + 240 * open} -580 L${150 + 220 * open} 20 Z`} fill={IRON} stroke={C.line} strokeWidth={12} strokeLinejoin="round" /> : null}
    {tag ? <g transform="translate(220 -200) rotate(8)"><Card x={0} y={0} w={240} h={110} fill={C.parchment}><Ink x={0} y={14} size={40}>{tag}</Ink></Card></g> : null}
  </g>
);
const KNIGHT = { coat: "#8C939C", hat: "viking" as const };
const GUARD = { coat: "#7A3B2E", hat: "hood" as const };
const maidenPose = (f: number) => (
  <>
    <Dungeon f={f} />
    <Maiden x={640} y={FEET} s={1.15} />
    <Bean x={280} y={FEET} s={1.3} {...GUARD} face="angry" armR={140 + wob(f, 4, 6)} armL={20} />
  </>
);

export const i01: React.FC<ShotProps> = ({ f }) => <Scene f={f}>{maidenPose(f)}</Scene>;
export const i02: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    {maidenPose(f)}
    <Stamp f={f} a={14} x={540} y={520} text="FAKE?" size={150} />
  </Scene>
);
export const i03: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Dungeon f={f} />
    <Maiden x={540} y={FEET} s={0.95} />
    <g transform={`translate(540 320) scale(${mix(1.3, 1, pop(f, 2, 6))}) translate(-540 -320)`}>
      <Big x={540} y={290} size={130}>THE IRON</Big><Big x={540} y={420} size={130}>MAIDEN</Big>
    </g>
  </Scene>
);
export const i04: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Timber />
    <Bean x={300} y={FEET} s={1.3} coat="#5C4A7A" hat="hood" face="deadpan" armR={120 + wob(f, 1.5, 8)} armL={20} />
    <g transform="translate(740 820)"><Book x={0} y={0} s={1.0} open={1} /></g>
    <g transform={`translate(740 820) scale(${pop(f, 10)})`}><Big x={0} y={30} size={160} color={C.red}>✗</Big></g>
  </Scene>
);
export const i05: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <Card x={540} y={760} w={560} h={600} rot={-3}>
      <rect x={-280} y={-300} width={560} height={130} fill={C.red} stroke={C.line} strokeWidth={10} />
      <Ink x={0} y={-215} size={60} color={C.white}>YEAR</Ink>
      <g transform={`scale(${pop(f, 6)})`}><Big x={0} y={110} size={190} color={C.yellow}>1793</Big></g>
    </Card>
  </Scene>
);
export const i06: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Timber />
    <Bean x={360} y={FEET} s={1.4} coat="#3D5A80" hat="tophat" face="smug" armR={100 + wob(f, 1.6, 10)} armL={20} holdR={<path d="M0 0 L40 -70" stroke={C.line} strokeWidth={10} strokeLinecap="round" />} />
    <g transform={`translate(780 ${900 - pop(f, 6) * 40})`}><Book x={0} y={0} s={0.9} title="History" /></g>
  </Scene>
);
export const i07: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <g transform={`translate(540 760) scale(${pop(f, 2, 8)})`}>
      <path d="M-330 -230 L330 -230 L330 170 L-40 170 L-140 270 L-120 170 L-330 170 Z" fill={C.white} stroke={C.line} strokeWidth={10} strokeLinejoin="round" />
      <Ink x={0} y={-110} size={52}>"A forger was put</Ink><Ink x={0} y={-40} size={52}>in one, in 1515."</Ink>
      <Ink x={0} y={60} size={40} serif>— trust me</Ink>
    </g>
  </Scene>
);
export const i08: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <Book x={540} y={760} s={1.5} open={1} />
    <g transform={`translate(540 760) scale(${pop(f, 8)})`}><Big x={0} y={0} size={140}>SOURCES:</Big></g>
    <Stamp f={f} a={20} x={540} y={960} text="NONE" size={130} />
  </Scene>
);
export const i09: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Museum />
    <rect x={390} y={600} width={300} height={560} fill="none" stroke={C.line} strokeWidth={10} strokeDasharray="30 22" />
    <Bean x={240} y={FEET} s={1.2} coat={C.navy} hat="tophat" face="happy" armR={70} armL={20} />
    <Bean x={840} y={FEET} s={1.2} coat="#7E4A8C" hat="tophat" face="happy" armL={70} armR={20} flip />
    <g transform={`translate(540 860) scale(${pop(f, 8)})`}><Big x={0} y={0} size={200}>?</Big></g>
  </Scene>
);
export const i10: React.FC<ShotProps> = ({ f }) => {
  const k = ramp(f, 4, 50, move);
  return (
    <Scene f={f}>
      <Timber />
      <g opacity={1}><Maiden x={640} y={FEET} s={1.0 * mix(0.6, 1, k)} /></g>
      <Bean x={300} y={FEET} s={1.3} coat="#5D6470" hat="cap" face="happy" armR={100 + wob(f, 1.2, 25)} armL={20}
        holdR={<g transform="rotate(-30)"><path d="M0 0 L0 -90" stroke={C.beam} strokeWidth={16} strokeLinecap="round" /><rect x={-30} y={-120} width={60} height={36} fill={C.slate} stroke={C.line} strokeWidth={6} /></g>} />
      <g transform={`translate(540 380) scale(${pop(f, 10)})`}><Big x={0} y={0} size={140} color={C.yellow}>1800s</Big></g>
    </Scene>
  );
};
export const i11: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Timber />
    {[["helmet", 260, 640], ["armour", 540, 720], ["gate", 820, 640]].map(([t, x, y], i) => {
      const k = ramp(f, 4 + i * 6, 30 + i * 6, move);
      return (
        <g key={String(t)} transform={`translate(${mix(Number(x), 540, k)} ${mix(Number(y), 900, k)}) scale(${mix(1, 0.6, k)})`}>
          {i === 0 ? <path d="M-90 40 C -90 -90 90 -90 90 40 Z" fill={IRON} stroke={C.line} strokeWidth={10} /> : i === 1 ? <path d="M-80 -90 L80 -90 L60 90 L-60 90 Z" fill={IRON} stroke={C.line} strokeWidth={10} /> : <g>{[-60, -20, 20, 60].map((xx) => <rect key={xx} x={xx - 8} y={-90} width={16} height={180} fill={IRON} stroke={C.line} strokeWidth={5} />)}</g>}
        </g>
      );
    })}
    <g transform={`translate(540 380) scale(${pop(f, 30)})`}><Big x={0} y={0} size={110} color={C.yellow}>SPARE PARTS</Big></g>
  </Scene>
);
export const i12: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Museum />
    <Maiden x={540} y={FEET} s={1.05} tag="NUREMBERG" />
    <Stamp f={f} a={24} x={540} y={420} text="ASSEMBLED" size={100} />
  </Scene>
);
export const i13: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Museum />
    <Maiden x={540} y={FEET - 180} s={0.75} />
    {Array.from({ length: 2 }, (_, row) => Array.from({ length: 5 }, (_, k) => (
      <Bean key={`${row}-${k}`} x={110 + k * 215 + (row % 2) * 60} y={FEET + 120 + row * 200 - Math.abs(wob(f + k * 5 + row * 7, 2.2, 10))} s={0.7}
        coat={[C.navy, "#7E4A8C", C.slate, C.red, "#3D6E8C"][(k + row) % 5]} hat={(k + row) % 2 ? "tophat" : "none"} face="happy" armL={30} armR={30} />
    )))}
  </Scene>
);
export const i14: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Night f={f} />
    {[0, 1, 2].map((i) => <path key={i} d={`M${200 + i * 300} 0 L${260 + i * 300} 900`} stroke="#F6F4EC" strokeWidth={40} opacity={0.12} />)}
    <g transform="translate(540 1150)">
      <rect x={-300} y={-420} width={600} height={420} fill="#5D5A66" stroke={C.line} strokeWidth={11} />
      <path d="M-340 -420 L0 -560 L340 -420 Z" fill="#45434E" stroke={C.line} strokeWidth={11} strokeLinejoin="round" />
    </g>
    <g transform={`translate(540 420) scale(${pop(f, 12)})`}><Big x={0} y={0} size={160} color={C.yellow}>1944</Big></g>
  </Scene>
);
export const i15: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Museum />
    {[260, 540, 820].map((x, i) => <Maiden key={x} x={x} y={FEET} s={0.6} tag={i === 1 ? "REPLICA" : undefined} />)}
    <Bean x={540} y={FEET + 200} s={0.8} coat={C.navy} face="deadpan" />
  </Scene>
);
export const i16: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Dungeon f={f} />
    <g transform="translate(540 900)">
      <rect x={-330} y={-60} width={660} height={60} fill={C.beam} stroke={C.line} strokeWidth={10} />
      {[-200, 0, 200].map((x) => <circle key={x} cx={x} cy={-100} r={44} fill="none" stroke={C.line} strokeWidth={14} />)}
      <rect x={-330} y={0} width={60} height={240} fill={C.beam} stroke={C.line} strokeWidth={10} />
      <rect x={270} y={0} width={60} height={240} fill={C.beam} stroke={C.line} strokeWidth={10} />
    </g>
    <Bean x={540} y={FEET + 80} s={0.8} {...KNIGHT} face="panic" armL={150} armR={150} />
    <g transform={`translate(540 420) scale(${pop(f, 12)})`}><Big x={0} y={0} size={110} color={C.red}>BAD ENOUGH</Big></g>
  </Scene>
);
export const i17: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Dungeon f={f} />
    <Maiden x={540} y={FEET} s={1.0} />
    <Stamp f={f} a={14} x={540} y={720} text="NOT NEEDED" size={100} />
  </Scene>
);
export const i18: React.FC<ShotProps> = ({ f }) => <Scene f={f}><ZeroCard f={f} label="MEDIEVAL ONES FOUND" /></Scene>;
export const i19: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Museum />
    {[180, 400, 620, 840].map((x, i) => { const k = pop(f, 4 + i * 7); return k > 0 ? <g key={x} transform={`translate(${x} ${FEET}) scale(${k}) translate(${-x} ${-FEET})`}><Maiden x={x} y={FEET} s={0.5} /></g> : null; })}
    <g transform={`translate(540 420) scale(${pop(f, 30)})`}><Big x={0} y={0} size={120} color={C.yellow}>SEVERAL</Big></g>
  </Scene>
);
/** The loop: back to the opening (wrong) version. */
export const i20: React.FC<ShotProps> = ({ f }) => <Scene f={f + 5}>{maidenPose(f)}</Scene>;

export const SHOT_VIEWS: Record<string, React.FC<ShotProps>> = { i01, i02, i03, i04, i05, i06, i07, i08, i09, i10, i11, i12, i13, i14, i15, i16, i17, i18, i19, i20 };
void Rays; void Newspaper;
