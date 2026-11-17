import React from "react";
import { Bean } from "../ui/Bean";
import { Big, Book, C, Card, FEET, HORIZON, Ink, LW, Night, Parchment, Scene, ShotProps, Stamp, ZeroCard, mix, move, pop, ramp, wob } from "./kit";

const NINJA = { coat: "#1E1E24", hat: "ninja" as const };
const Village: React.FC<{ f: number; night?: boolean }> = ({ f, night }) => (
  <g>
    {night ? <Night f={f} /> : <rect x={0} y={0} width={1080} height={1920} fill="#D9E3D0" />}
    {[[120, 0], [540, 1], [920, 0]].map(([x, t], i) => (
      <g key={i}>
        <rect x={Number(x) - 150} y={HORIZON - 300} width={300} height={300} fill={night ? "#3A3F52" : "#E8DCC0"} stroke={C.line} strokeWidth={LW} />
        <path d={`M${Number(x) - 210} ${HORIZON - 290} Q${Number(x)} ${HORIZON - 420} ${Number(x) + 210} ${HORIZON - 290} Z`} fill={night ? "#23262F" : "#5D6470"} stroke={C.line} strokeWidth={LW} strokeLinejoin="round" />
        {[-80, 0, 80].map((dx) => <path key={dx} d={`M${Number(x) + dx} ${HORIZON - 280} L${Number(x) + dx} ${HORIZON - 40}`} stroke={night ? "#2A2C30" : "#B9A98A"} strokeWidth={8} />)}
      </g>
    ))}
    <rect x={0} y={HORIZON} width={1080} height={770} fill={night ? "#3A3F52" : "#B7A383"} stroke={C.line} strokeWidth={LW} />
  </g>
);
const Stage: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect x={0} y={0} width={1080} height={1920} fill="#2A2530" />
    <rect x={60} y={260} width={960} height={HORIZON - 260} fill="#C7A06A" stroke={C.line} strokeWidth={LW} />
    {[0, 1, 2, 3, 4, 5].map((k) => <path key={k} d={`M${60 + k * 160} 260 L${60 + k * 160} ${HORIZON}`} stroke="#A9834E" strokeWidth={6} />)}
    <path d={`M60 260 Q540 380 1020 260 L1020 320 Q540 440 60 320 Z`} fill={C.red} stroke={C.line} strokeWidth={LW} />
    <rect x={0} y={HORIZON} width={1080} height={770} fill="#6E4C2E" stroke={C.line} strokeWidth={LW} />
    {[0, 1, 2, 3, 4, 5].map((k) => <circle key={k} cx={120 + k * 168} cy={HORIZON + 470 - Math.abs(wob(f + k * 5, 2.4, 6))} r={56} fill="#4A4250" stroke={C.line} strokeWidth={8} />)}
  </g>
);
const Katana: React.FC = () => <g><path d="M0 0 L0 -200" stroke={C.line} strokeWidth={20} strokeLinecap="round" /><path d="M0 -20 L0 -200" stroke="#D8DCE0" strokeWidth={9} strokeLinecap="round" /><path d="M-20 -20 L20 -20" stroke={C.yellow} strokeWidth={10} strokeLinecap="round" /></g>;
const ninjaPose = (f: number) => (
  <>
    <Village f={f} night />
    <Bean x={540} y={FEET} s={1.5} {...NINJA} face="smug" armR={140 + wob(f, 4, 6)} armL={20} holdR={<Katana />} />
  </>
);

export const n01: React.FC<ShotProps> = ({ f }) => <Scene f={f}>{ninjaPose(f)}</Scene>;
export const n02: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    {ninjaPose(f)}
    <Stamp f={f} a={12} x={540} y={420} text="PROBABLY NOT" size={96} />
  </Scene>
);
export const n03: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Village f={f} night />
    <Bean x={540} y={FEET} s={1.15} {...NINJA} face="deadpan" />
    <g transform={`translate(540 330) scale(${mix(1.3, 1, pop(f, 2, 6))}) translate(-540 -330)`}>
      <Big x={540} y={290} size={150}>NINJAS</Big>
      <Big x={540} y={410} size={84} color={C.yellow}>THE BLACK OUTFIT</Big>
    </g>
  </Scene>
);
export const n04: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Village f={f} />
    <Bean x={540} y={FEET} s={1.4} coat="#8B7A5E" hat="cap" face="smug" armR={70} armL={20} />
    <g transform={`translate(780 560) scale(${pop(f, 10)})`}><Card x={0} y={0} w={300} h={110}><Ink x={0} y={16} size={50}>SHINOBI</Ink></Card></g>
  </Scene>
);
export const n05: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Village f={f} />
    {[200, 380, 560, 740, 900].map((x, i) => <Bean key={x} x={x} y={FEET + (i % 2) * 40} s={0.95} coat={["#8B7A5E", "#5E7A4A", "#7A5A3C", "#8B7A5E", "#6E7F96"][i]} face={i === 2 ? "smug" : "happy"} armL={20} armR={20} />)}
    <g transform={`translate(560 640) scale(${pop(f, 14)})`}><path d="M-40 -40 L0 0 L40 -40" fill="none" stroke={C.red} strokeWidth={12} strokeLinecap="round" /></g>
  </Scene>
);
export const n06: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Village f={f} />
    <Bean x={540} y={FEET} s={1.5} coat="#8B7A5E" face="happy" armL={20} armR={20} />
    <g transform={`translate(540 420) scale(${pop(f, 10)})`}><Big x={0} y={0} size={110} color={C.yellow}>JUST A GUY</Big></g>
  </Scene>
);
export const n07: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Village f={f} />
    {[["#8B7A5E", "cap"], ["#7A5A3C", "tophat"], ["#C9A06A", "none"]].map(([c, h], i) => { const k = pop(f, 2 + i * 12); return k > 0 ? <Bean key={i} x={240 + i * 300} y={FEET} s={1.1 * k} coat={String(c)} hat={h === "tophat" ? "none" : (h as "cap" | "none")} face="smug" armL={20} armR={20} /> : null; })}
    {["FARMER", "MERCHANT", "MONK"].map((t, i) => pop(f, 4 + i * 12) > 0 ? <g key={t} transform={`translate(${240 + i * 300} 640)`}><Big x={0} y={0} size={56} color={C.yellow}>{t}</Big></g> : null)}
  </Scene>
);
export const n08: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Village f={f} />
    {[220, 860].map((x) => <Bean key={x} x={x} y={FEET} s={1.0} coat="#8B7A5E" face="panic" armL={150} armR={60} />)}
    <Bean x={540} y={FEET} s={1.3} {...NINJA} face="panic" armL={20} armR={20} />
    <g transform={`translate(540 440) scale(${pop(f, 10)})`}><Big x={0} y={0} size={110} color={C.red}>SUSPICIOUS</Big></g>
  </Scene>
);
export const n09: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Village f={f} night />
    <Bean x={540} y={FEET} s={1.5} {...NINJA} face="deadpan" armR={-40 + wob(f, 2, 10)} armL={20} />
    <g transform={`translate(800 520) scale(${pop(f, 6)})`}><Big x={0} y={0} size={220}>?</Big></g>
  </Scene>
);
export const n10: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Stage f={f} />
    <g transform={`translate(540 500) scale(${pop(f, 6)})`}><Big x={0} y={0} size={150} color={C.yellow}>KABUKI</Big></g>
  </Scene>
);
export const n11: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Stage f={f} />
    <Bean x={400} y={FEET - 20} s={1.2} coat="#C24A6A" hair face="happy" armL={150} armR={60} />
    <Bean x={mix(1000, 720, ramp(f, 4, 20, move))} y={FEET - 20} s={1.1} {...NINJA} face="blank" armR={100} armL={20} />
  </Scene>
);
export const n12: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Stage f={f} />
    <Bean x={400} y={FEET - 20} s={1.2} coat="#C24A6A" hair face="happy" armL={150} armR={60} />
    <g opacity={0.35}><Bean x={720} y={FEET - 20} s={1.1} {...NINJA} face="blank" armR={100} armL={20} /></g>
    <g transform={`translate(720 520) scale(${pop(f, 10)})`}><Big x={0} y={0} size={90} color={C.yellow}>"INVISIBLE"</Big></g>
  </Scene>
);
export const n13: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Stage f={f} />
    <Bean x={400} y={FEET - 20} s={1.2} coat="#C24A6A" hair face={f > 18 ? "panic" : "happy"} armL={150} armR={60} />
    <Bean x={720} y={FEET - 20} s={1.2} {...NINJA} face="smug" armR={150} armL={20} holdR={<Katana />} />
  </Scene>
);
export const n14: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Stage f={f} />
    <Bean x={540} y={FEET - 20} s={1.4} {...NINJA} face="smug" armL={20} armR={20} />
    {[0, 1, 2].map((i) => { const k = pop(f, 8 + i * 6); return k > 0 ? <g key={i} transform={`translate(${260 + i * 280} 520) scale(${k})`}><Big x={0} y={0} size={100} color={C.yellow}>★</Big></g> : null; })}
  </Scene>
);
export const n15: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    {[[330, -6], [760, 5]].map(([x, r], i) => { const k = pop(f, 4 + i * 12); return k > 0 ? (
      <g key={i} transform={`translate(${x} 780) rotate(${r}) scale(${k})`}>
        <Card x={0} y={0} w={400} h={560} fill={i ? "#E8DFC8" : "#F3E9D2"}>
          <g transform="translate(0 220) scale(0.62)"><Bean x={0} y={0} s={1} {...NINJA} face="smug" armR={150} armL={20} holdR={<Katana />} /></g>
          <Ink x={0} y={-220} size={44}>{i ? "MOVIE" : "PRINT"}</Ink>
        </Card>
      </g>) : null; })}
  </Scene>
);
export const n16: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Village f={f} night />
    {[200, 380, 560, 740, 900].map((x, i) => <Bean key={x} x={x} y={FEET + (i % 2) * 40} s={0.9} {...NINJA} face="smug" armR={140} armL={20} holdR={<Katana />} />)}
  </Scene>
);
export const n17: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Village f={f} />
    {[200, 380, 560, 740, 900].map((x, i) => <Bean key={x} x={x} y={FEET + (i % 2) * 40} s={0.95} coat={["#8B7A5E", "#5E7A4A", "#7A5A3C", "#8B7A5E", "#6E7F96"][i]} face={i === 3 ? "smug" : "happy"} armL={20} armR={20} />)}
    <g transform={`translate(540 440) scale(${pop(f, 18)})`}><Big x={0} y={0} size={110} color={C.yellow}>WHICH ONE?</Big></g>
  </Scene>
);
export const n18: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <Book x={540} y={760} s={1.5} open={1} />
    {["monk", "merchant", "actor", "farmer"].map((w, i) => { const k = pop(f, 6 + i * 5); return k > 0 ? <g key={w} transform={`translate(${i % 2 ? 680 : 400} ${700 + Math.floor(i / 2) * 110}) scale(${k})`}><Ink x={0} y={0} size={44} serif>{w}</Ink></g> : null; })}
    <g transform={`translate(540 420) scale(${pop(f, 30)})`}><Big x={0} y={0} size={120} color={C.yellow}>DISGUISES</Big></g>
  </Scene>
);
export const n19: React.FC<ShotProps> = ({ f }) => <Scene f={f}><ZeroCard f={f} label="BLACK SUIT PROOF" value="THIN" /></Scene>;
/** The loop: back to the opening (wrong) version. */
export const n20: React.FC<ShotProps> = ({ f }) => <Scene f={f + 5}>{ninjaPose(f)}</Scene>;

export const SHOT_VIEWS: Record<string, React.FC<ShotProps>> = { n01, n02, n03, n04, n05, n06, n07, n08, n09, n10, n11, n12, n13, n14, n15, n16, n17, n18, n19, n20 };
