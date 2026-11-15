import React from "react";
import { Bean } from "../ui/Bean";
import { Big, Book, C, Card, FEET, HORIZON, Ink, LW, Museum, Parchment, Rays, Scene, ShotProps, Stamp, Timber, ZeroCard, mix, move, pop, ramp, wob } from "./kit";

const SANDC = "#E3C98F";
const Arena: React.FC<{ f: number; crowd?: boolean }> = ({ f, crowd = true }) => (
  <g>
    <rect x={0} y={0} width={1080} height={1920} fill="#9FC3D4" />
    <rect x={0} y={260} width={1080} height={HORIZON - 260} fill="#C9A77A" stroke={C.line} strokeWidth={LW} />
    {Array.from({ length: 6 }, (_, k) => <path key={k} d={`M${k * 200 - 20} 330 a90 120 0 0 1 180 0 L${k * 200 + 160} 560 L${k * 200 - 20} 560 Z`} fill="#8C6A44" stroke={C.line} strokeWidth={8} />)}
    {crowd ? Array.from({ length: 3 }, (_, r) => Array.from({ length: 9 }, (_, k) => (
      <circle key={`${r}-${k}`} cx={60 + k * 120 + (r % 2) * 60} cy={680 + r * 110 - Math.abs(wob(f + k * 3 + r * 5, 2.4, 10))} r={34} fill={[C.skin, "#E8C9A8", "#D9B08C"][(k + r) % 3]} stroke={C.line} strokeWidth={7} />
    ))) : null}
    <rect x={0} y={HORIZON - 120} width={1080} height={120} fill="#B5835A" stroke={C.line} strokeWidth={LW} />
    <rect x={0} y={HORIZON} width={1080} height={770} fill={SANDC} stroke={C.line} strokeWidth={LW} />
  </g>
);
/** A fist with the thumb at angle a (degrees, 0 = up, 180 = down); hidden = thumb tucked */
const Thumb: React.FC<{ x: number; y: number; s?: number; a: number; hidden?: boolean; color?: string }> = ({ x, y, s = 1, a, hidden, color = C.skin }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-70} y={-60} width={140} height={120} rx={44} fill={color} stroke={C.line} strokeWidth={LW} />
    {[-35, 0, 35].map((xx) => <path key={xx} d={`M${xx} -40 L${xx} 0`} stroke={C.line} strokeWidth={6} strokeLinecap="round" />)}
    {!hidden ? <g transform={`rotate(${a})`}><rect x={-22} y={-150} width={44} height={110} rx={22} fill={color} stroke={C.line} strokeWidth={LW} /></g> : null}
  </g>
);
const EMPEROR = { coat: "#7E4A8C", hat: "laurel" as const };
const GLAD = { coat: "#9C5B3A", hat: "gladiator" as const };
const Gladius: React.FC = () => <g><path d="M0 0 L0 -150" stroke={C.line} strokeWidth={26} strokeLinecap="round" /><path d="M0 0 L0 -150" stroke="#C9CED6" strokeWidth={12} strokeLinecap="round" /><path d="M-24 -8 L24 -8" stroke={C.beam} strokeWidth={14} strokeLinecap="round" /></g>;
const emperorPose = (f: number, down = 1) => (
  <>
    <Arena f={f} />
    <Bean x={400} y={FEET} s={1.5} {...EMPEROR} face="smug" armR={150} armL={20} />
    <Thumb x={660} y={760} s={1.0} a={mix(0, 180, down)} />
  </>
);

export const g01: React.FC<ShotProps> = ({ f }) => <Scene f={f}>{emperorPose(f, ramp(f, 8, 20, move))}</Scene>;
export const g02: React.FC<ShotProps> = ({ f }) => {
  const k = ramp(f, 8, 22, move);
  return (
    <Scene f={f}>
      <Arena f={f} />
      <Bean x={400} y={FEET} s={1.5} {...EMPEROR} face={k > 0.4 ? "panic" : "smug"} armR={150} armL={k > 0.4 ? 150 : 20} />
      <Thumb x={660} y={760} s={1.0} a={180} />
      <g transform={`translate(660 560) scale(${pop(f, 16)})`}><Big x={0} y={0} size={200}>?</Big></g>
    </Scene>
  );
};
export const g03: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Arena f={f} />
    <Bean x={540} y={FEET} s={1.15} {...GLAD} face="deadpan" armR={110} armL={20} holdR={<Gladius />} />
    <g transform={`translate(540 330) scale(${mix(1.3, 1, pop(f, 2, 6))}) translate(-540 -330)`}>
      <Big x={540} y={290} size={130}>GLADIATORS</Big>
      <Big x={540} y={410} size={90} color={C.yellow}>THUMBS DOWN?</Big>
    </g>
  </Scene>
);
export const g04: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <Book x={540} y={760} s={1.6} open={1} />
    <g transform={`translate(540 780) scale(${pop(f, 6)})`}>
      <rect x={-300} y={-60} width={600} height={110} fill={C.yellow} opacity={0.75} />
      <Ink x={0} y={20} size={70} serif>"pollice verso"</Ink>
    </g>
    <g transform={`translate(540 1040) scale(${pop(f, 18)})`}><Ink x={0} y={0} size={46}>= "with a turned thumb"</Ink></g>
  </Scene>
);
export const g05: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <Thumb x={540} y={820} s={1.6} a={f * 9} />
    <g transform={`translate(540 440) scale(${pop(f, 10)})`}><Big x={0} y={0} size={150}>WHICH WAY?</Big></g>
  </Scene>
);
export const g06: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <g transform={`scale(${pop(f, 2)})`} style={{}}><Thumb x={330} y={820} s={1.2} a={0} /></g>
    {pop(f, 18) > 0 ? <Thumb x={760} y={820} s={1.2 * pop(f, 18)} a={90} /> : null}
    <g transform="translate(330 520)"><Big x={0} y={0} size={90} color={C.yellow}>UP?</Big></g>
    {pop(f, 18) > 0 ? <g transform="translate(760 520)"><Big x={0} y={0} size={90} color={C.yellow}>SIDEWAYS?</Big></g> : null}
  </Scene>
);
export const g07: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Arena f={f} />
    <Thumb x={540} y={760} s={1.5} a={0} hidden />
    <g transform={`translate(540 480) scale(${pop(f, 12)})`}><Big x={0} y={0} size={130} color={C.yellow}>MERCY?</Big></g>
  </Scene>
);
export const g08: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Arena f={f} />
    <Bean x={540} y={FEET} s={1.5} {...EMPEROR} face="deadpan" armR={-40 + wob(f, 2, 10)} armL={20} />
    <g transform={`translate(800 520) scale(${pop(f, 6)})`}><Big x={0} y={0} size={220}>?</Big></g>
  </Scene>
);
const Painting: React.FC<{ f: number; k?: number }> = ({ f, k = 1 }) => (
  <g transform="translate(540 760)">
    <rect x={-380} y={-300} width={760} height={560} fill="#C9A77A" stroke={C.yellow} strokeWidth={30} />
    <rect x={-380} y={-300} width={760} height={560} fill="none" stroke={C.line} strokeWidth={8} />
    {[0, 1, 2, 3, 4].map((i) => <Thumb key={i} x={-280 + i * 140} y={-150} s={0.45} a={180 * k} color={[C.skin, "#E8C9A8"][i % 2]} />)}
    <g transform="translate(0 220) scale(0.55)"><Bean x={0} y={0} s={1} coat="#9C5B3A" hat="gladiator" face="smug" armR={110} armL={20} holdR={<Gladius />} /></g>
  </g>
);
export const g09: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Museum />
    <Painting f={f} />
    <g transform={`translate(540 340) scale(${pop(f, 10)})`}><Big x={0} y={0} size={160} color={C.yellow}>1872</Big></g>
  </Scene>
);
export const g10: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Timber />
    <Painting f={f} k={ramp(f, 10, 30, move)} />
    <Bean x={160} y={FEET + 120} s={0.9} coat={C.navy} face="happy" armR={110 + wob(f, 1.5, 12)} armL={20} holdR={<path d="M0 0 L40 -60" stroke={C.line} strokeWidth={10} strokeLinecap="round" />} />
  </Scene>
);
export const g11: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Museum />
    <g transform="translate(0 -120) scale(1)"><Painting f={f} /></g>
    {Array.from({ length: 5 }, (_, k) => <Bean key={k} x={140 + k * 200} y={FEET + 260 - Math.abs(wob(f + k * 5, 2.2, 10))} s={0.7} coat={[C.navy, "#7E4A8C", C.slate, C.red, "#3D6E8C"][k]} hat={k % 2 ? "tophat" : "none"} face="happy" armL={150} armR={150} />)}
  </Scene>
);
export const g12: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <rect x={0} y={0} width={1080} height={1920} fill="#2A2530" />
    <rect x={90} y={360} width={900} height={560} fill="#E8DFC8" stroke={C.line} strokeWidth={14} />
    <g transform="translate(540 640)"><Thumb x={0} y={0} s={1.3} a={180} /></g>
    {Array.from({ length: 6 }, (_, k) => <circle key={k} cx={180 + k * 144} cy={1100 + (k % 2) * 30} r={48} fill="#4A4250" stroke={C.line} strokeWidth={8} />)}
    <g transform={`translate(540 280) scale(${pop(f, 10)})`}><Big x={0} y={0} size={110} color={C.yellow}>AT THE MOVIES</Big></g>
  </Scene>
);
export const g13: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Arena f={f} />
    <Bean x={340} y={FEET} s={1.3} {...GLAD} face="happy" armR={150} armL={20} holdR={<Gladius />} />
    <Bean x={740} y={FEET} s={1.3} coat="#5E7A4A" hat="gladiator" face="happy" armL={20} armR={150} flip holdR={<Gladius />} />
    <g transform={`translate(540 480) scale(${pop(f, 14)})`}><Big x={0} y={0} size={130} color={C.yellow}>MOSTLY FINE</Big></g>
  </Scene>
);
export const g14: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Timber />
    <Bean x={360} y={FEET} s={1.4} {...GLAD} face="smug" armR={110} armL={20} holdR={<Gladius />} />
    {[0, 1, 2, 3, 4].map((i) => { const k = pop(f, 6 + i * 5); return k > 0 ? <g key={i} transform={`translate(780 ${1100 - i * 60}) scale(${k})`}><ellipse cx={0} cy={0} rx={80} ry={26} fill={C.yellow} stroke={C.line} strokeWidth={8} /></g> : null; })}
    <g transform={`translate(780 520) scale(${pop(f, 30)})`}><Big x={0} y={0} size={140} color={C.yellow}>$$$</Big></g>
  </Scene>
);
export const g15: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <g transform={`translate(540 860) rotate(${ramp(f, 14, 24, move) * -8})`}>
      <path d="M-330 40 L-300 -60 L-150 -110 L120 -110 L250 -50 L330 -20 L330 60 L-330 60 Z" fill={C.red} stroke={C.line} strokeWidth={LW} strokeLinejoin="round" />
      <circle cx={-200} cy={70} r={60} fill={C.line} /><circle cx={200} cy={70} r={60} fill={C.line} />
      <path d="M-120 -100 L-60 -40 L120 -40 L90 -100 Z" fill="#9FC3D4" stroke={C.line} strokeWidth={8} strokeLinejoin="round" />
    </g>
    <Stamp f={f} a={18} x={540} y={520} text="WRECKED" size={110} />
  </Scene>
);
export const g16: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Arena f={f} crowd={false} />
    <Bean x={mix(540, 300, ramp(f, 4, 40, move))} y={FEET} s={1.4} {...GLAD} face="happy" armR={150} armL={150 + wob(f, 3, 10)} />
    <g transform={`translate(760 520) scale(${pop(f, 14)})`}><Big x={0} y={0} size={140} color={C.yellow}>ALIVE</Big></g>
  </Scene>
);
export const g17: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Arena f={f} />
    <Rays f={f} x={540} y={900} o={0.35} />
    <Bean x={540} y={FEET} s={1.5} {...GLAD} face="smug" armR={150} armL={150} />
    {[0, 1, 2].map((i) => { const k = pop(f, 6 + i * 8); return k > 0 ? <g key={i} transform={`translate(${260 + i * 280} 460) scale(${k})`}><Big x={0} y={0} size={110} color={C.yellow}>★</Big></g> : null; })}
  </Scene>
);
export const g18: React.FC<ShotProps> = ({ f }) => <Scene f={f}><ZeroCard f={f} label="THUMB DIRECTION" value="???" /></Scene>;
export const g19: React.FC<ShotProps> = ({ f }) => <Scene f={f}><ZeroCard f={f} label={'SAYS "DOWN"'} /></Scene>;
/** The loop: back to the opening (wrong) version. */
export const g20: React.FC<ShotProps> = ({ f }) => <Scene f={f + 5}>{emperorPose(f, ramp(f, 8, 20, move))}</Scene>;

export const SHOT_VIEWS: Record<string, React.FC<ShotProps>> = { g01, g02, g03, g04, g05, g06, g07, g08, g09, g10, g11, g12, g13, g14, g15, g16, g17, g18, g19, g20 };
void Card;
