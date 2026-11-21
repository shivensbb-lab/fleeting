import React from "react";
import { Bean } from "../ui/Bean";
import { Big, Book, C, Card, FEET, HORIZON, Ink, LW, Parchment, Rays, Scene, ShotProps, Stamp, Timber, ZeroCard, mix, move, pop, ramp, wob } from "./kit";

const WORKER = { coat: "#E8DCC0" };
const PHARAOH = { coat: C.white, hat: "nemes" as const };
const Desert: React.FC<{ f: number; pyr?: number }> = ({ f, pyr = 1 }) => (
  <g>
    <rect x={0} y={0} width={1080} height={1920} fill="#F3D9A6" />
    <circle cx={860} cy={280} r={80} fill={C.yellow} stroke={C.line} strokeWidth={LW} />
    {pyr > 0 ? <g>
      <path d={`M${540 - 380 * pyr} ${HORIZON} L540 ${HORIZON - 560 * pyr} L${540 + 380 * pyr} ${HORIZON} Z`} fill="#E3C489" stroke={C.line} strokeWidth={LW} strokeLinejoin="round" />
      <path d={`M540 ${HORIZON - 560 * pyr} L${540 + 380 * pyr} ${HORIZON} L${540 + 120 * pyr} ${HORIZON} Z`} fill="#C9A877" />
    </g> : null}
    <path d={`M0 ${HORIZON} C 300 ${HORIZON - 30} 700 ${HORIZON + 30} 1080 ${HORIZON - 10} L1080 1920 L0 1920 Z`} fill="#E8C98E" stroke={C.line} strokeWidth={LW} />
    {wob(f, 1) > 9 ? null : null}
  </g>
);
const Block: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-110} y={-140} width={220} height={140} fill="#D9B97E" stroke={C.line} strokeWidth={LW} />
    <rect x={-150} y={0} width={300} height={24} fill={C.beam} stroke={C.line} strokeWidth={7} />
  </g>
);
const Haul: React.FC<{ f: number; x0?: number }> = ({ f, x0 = 0 }) => (
  <g>
    <Block x={760 + x0} y={FEET} s={1.0} />
    <path d={`M650 ${FEET - 70} L180 ${FEET - 120}`} stroke={C.beam} strokeWidth={10} />
    {[240, 380, 520].map((x, i) => <Bean key={x} x={x + Math.sin(f / 4 + i) * 6} y={FEET} s={0.95} {...WORKER} face="happy" armR={80} armL={80} />)}
  </g>
);
const moviePose = (f: number) => (
  <>
    <Desert f={f} />
    <Haul f={f} />
    <Bean x={900} y={FEET - 200} s={0.9} coat="#3A2A3A" face="angry" armR={150} armL={20} />
  </>
);

export const q01: React.FC<ShotProps> = ({ f }) => <Scene f={f}>{moviePose(f)}</Scene>;
export const q02: React.FC<ShotProps> = ({ f }) => <Scene f={f}>{moviePose(f)}<Stamp f={f} a={12} x={540} y={380} text="PROBABLY NOT" size={96} /></Scene>;
export const q03: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Desert f={f} />
    <g transform={`translate(540 330) scale(${mix(1.3, 1, pop(f, 2, 6))}) translate(-540 -330)`}>
      <Big x={540} y={290} size={140}>PYRAMIDS</Big>
      <Big x={540} y={410} size={86} color={C.yellow}>WHO BUILT THEM?</Big>
    </g>
  </Scene>
);
const Tomb: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-120 0 L-90 -160 L90 -160 L120 0 Z" fill="#C9A877" stroke={C.line} strokeWidth={LW} strokeLinejoin="round" />
    <rect x={-26} y={-90} width={52} height={90} fill="#3A2A2A" stroke={C.line} strokeWidth={7} />
  </g>
);
export const q04: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Desert f={f} pyr={0.55} />
    {[200, 880].map((x, i) => <g key={x} transform={`translate(${x} ${HORIZON + 40}) scale(${pop(f, 6 + i * 6)})`}><Tomb x={0} y={0} s={0.9} /></g>)}
    <Bean x={540} y={FEET + 80} s={1.0} coat="#7A5A3C" hat="cap" face="happy" armR={150} armL={20} holdR={<path d="M0 0 L0 -120 M-20 -110 L20 -110" stroke={C.beam} strokeWidth={10} strokeLinecap="round" />} />
    <g transform={`translate(540 300) scale(${pop(f, 10)})`}><Big x={0} y={0} size={150} color={C.yellow}>1990</Big></g>
  </Scene>
);
export const q05: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Desert f={f} />
    {[150, 300, 780, 930].map((x, i) => <g key={x} transform={`translate(${x} ${HORIZON + 30}) scale(${pop(f, 4 + i * 4)})`}><Tomb x={0} y={0} s={0.6} /></g>)}
  </Scene>
);
export const q06: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Desert f={f} />
    <Bean x={540} y={FEET} s={1.4} {...PHARAOH} face="smug" armL={20} armR={20} />
    {[160, 920].map((x) => <Tomb key={x} x={x} y={HORIZON + 30} s={0.6} />)}
    <g transform={`translate(540 300) scale(${pop(f, 12)})`}><Big x={0} y={0} size={100} color={C.yellow}>VIP SPOTS</Big></g>
  </Scene>
);
export const q07: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <g transform={`translate(380 820) scale(${pop(f, 4)})`}><ellipse cx={0} cy={0} rx={150} ry={80} fill="#D9A24E" stroke={C.line} strokeWidth={LW} /><path d="M-90 -20 Q0 -60 90 -20" stroke="#B8823A" strokeWidth={8} fill="none" /></g>
    <g transform={`translate(740 820) scale(${pop(f, 14)})`}><path d="M-70 -160 L70 -160 L50 100 L-50 100 Z" fill="#C9A877" stroke={C.line} strokeWidth={LW} strokeLinejoin="round" /><ellipse cx={0} cy={-160} rx={70} ry={20} fill="#F3E3B0" stroke={C.line} strokeWidth={8} /></g>
    <g transform={`translate(540 420) scale(${pop(f, 24)})`}><Big x={0} y={0} size={110} color={C.yellow}>BREAD & BEER</Big></g>
  </Scene>
);
export const q08: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <g transform="translate(540 800) rotate(-20)">
      <path d="M-260 -30 C -300 -60 -300 20 -260 0 L260 0 C 300 20 300 -60 260 -30 Z" fill="#F4EEDC" stroke={C.line} strokeWidth={LW} />
      <path d="M-10 -40 L10 20" stroke={C.line} strokeWidth={6} />
      {pop(f, 10) > 0 ? <ellipse cx={0} cy={-14} rx={40 * pop(f, 10)} ry={30 * pop(f, 10)} fill="none" stroke="#3E8E4E" strokeWidth={10} /> : null}
    </g>
    <g transform={`translate(540 420) scale(${pop(f, 16)})`}><Big x={0} y={0} size={130} color={C.yellow}>HEALED</Big></g>
  </Scene>
);
export const q09: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Desert f={f} pyr={0.55} />
    <Bean x={400} y={FEET} s={1.2} {...WORKER} face="happy" armL={20} armR={30} />
    <Bean x={700} y={FEET} s={1.2} coat={C.white} face="smug" armL={110} armR={20} flip />
    <g transform={`translate(400 780) rotate(-30)`}><rect x={-20} y={-10} width={110} height={30} rx={8} fill={C.white} stroke={C.line} strokeWidth={6} /></g>
  </Scene>
);
const Town: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <Desert f={f} pyr={0.4} />
    {[[180, 0], [440, 1], [700, 0], [940, 1]].map(([x, t], i) => (
      <g key={i}><rect x={Number(x) - 100} y={HORIZON - 160 - Number(t) * 30} width={200} height={160 + Number(t) * 30} fill="#E8D2A6" stroke={C.line} strokeWidth={LW} />
        <rect x={Number(x) - 26} y={HORIZON - 80} width={52} height={80} fill="#6E4C2E" stroke={C.line} strokeWidth={7} /></g>
    ))}
  </g>
);
export const q10: React.FC<ShotProps> = ({ f }) => <Scene f={f}><Town f={f} /><g transform={`translate(540 360) scale(${pop(f, 10)})`}><Big x={0} y={0} size={110} color={C.yellow}>WORKERS' TOWN</Big></g></Scene>;
export const q11: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Town f={f} />
    {["BAKERY", "BREWERY", "BUTCHER"].map((t, i) => <g key={t} transform={`translate(${200 + i * 340} ${HORIZON - 280}) scale(${pop(f, 4 + i * 8)})`}><Card x={0} y={0} w={280} h={90}><Ink x={0} y={14} size={40}>{t}</Ink></Card></g>)}
  </Scene>
);
export const q12: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Desert f={f} pyr={0.55} />
    {[240, 420, 600, 780].map((x, i) => <Bean key={x} x={x} y={FEET} s={0.9} {...WORKER} face="happy" armL={i % 2 ? 150 : 20} armR={i % 2 ? 20 : 150} />)}
    <g transform={`translate(540 640) scale(${pop(f, 10)})`}><Card x={0} y={0} w={420} h={110}><Ink x={0} y={18} size={50}>TEAM ???</Ink></Card></g>
  </Scene>
);
export const q13: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <rect x={0} y={0} width={1080} height={1920} fill="#C9A877" />
    {Array.from({ length: 10 }, (_, r) => <path key={r} d={`M0 ${r * 140} L1080 ${r * 140}`} stroke="#B08E5E" strokeWidth={6} />)}
    <g transform={`translate(540 760) rotate(-3) scale(${pop(f, 4)})`}><Big x={0} y={0} size={110} color="#7A3B2E">FRIENDS OF</Big><Big x={0} y={140} size={150} color="#7A3B2E">KHUFU</Big></g>
    <rect x={0} y={HORIZON} width={1080} height={770} fill="#E8C98E" stroke={C.line} strokeWidth={LW} />
  </Scene>
);
export const q14: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Desert f={f} pyr={0.55} />
    {[0, 1, 2].map((i) => <Bean key={i} x={mix(-200, 300 + i * 160, ramp(f, 2 + i * 3, 24 + i * 3, move))} y={FEET} s={0.9} {...WORKER} face="happy" armL={20} armR={20} />)}
    {[0, 1, 2].map((i) => <Bean key={`o${i}`} x={mix(700 + i * 120, 1300, ramp(f, 2 + i * 3, 24 + i * 3, move))} y={FEET} s={0.9} coat="#C9A877" face="happy" armL={20} armR={20} />)}
    <g transform={`translate(540 380) scale(${pop(f, 14)})`}><Big x={0} y={0} size={110} color={C.yellow}>SHIFT CHANGE</Big></g>
  </Scene>
);
export const q15: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <Stamp f={f} a={6} x={540} y={600} text="DRAFTED? MAYBE" size={86} color="#C08A1E" rot={-4} />
    <Stamp f={f} a={26} x={540} y={900} text="SLAVES? UNLIKELY" size={86} />
  </Scene>
);
export const q16: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Desert f={f} />
    <Bean x={540} y={FEET} s={1.5} {...WORKER} face="deadpan" armR={-40 + wob(f, 2, 10)} armL={20} />
    <g transform={`translate(800 520) scale(${pop(f, 6)})`}><Big x={0} y={0} size={220}>?</Big></g>
  </Scene>
);
export const q17: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <g transform={`translate(330 800) scale(${pop(f, 4)})`}><Book x={0} y={0} s={0.9} title="Histories" /></g>
    <g transform={`translate(760 780) scale(${pop(f, 16)})`}><Card x={0} y={0} w={360} h={260} fill="#2A2530"><Ink x={0} y={-20} size={44} color={C.yellow}>EPIC</Ink><Ink x={0} y={40} size={44} color={C.white}>MOVIE</Ink></Card></g>
  </Scene>
);
export const q18: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Desert f={f} />
    <Rays f={f} x={540} y={800} o={0.3} />
    <Haul f={f} x0={0} />
    <g transform={`translate(540 360) scale(${pop(f, 10)})`}><Big x={0} y={0} size={110} color={C.yellow}>SKILLED CREWS</Big></g>
  </Scene>
);
export const q19: React.FC<ShotProps> = ({ f }) => <Scene f={f}><ZeroCard f={f} label="SLAVE ARMIES FOUND" /></Scene>;
/** The loop: back to the opening (movie) version. */
export const q20: React.FC<ShotProps> = ({ f }) => <Scene f={f + 5}>{moviePose(f)}</Scene>;

export const SHOT_VIEWS: Record<string, React.FC<ShotProps>> = { q01, q02, q03, q04, q05, q06, q07, q08, q09, q10, q11, q12, q13, q14, q15, q16, q17, q18, q19, q20 };
void Timber;
