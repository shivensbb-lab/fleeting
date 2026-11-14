import React from "react";
import { Bean } from "../ui/Bean";
import { Arrow, Big, Book, C, Card, FEET, Ink, Newspaper, Palace, Parchment, Rays, Scene, ShotProps, Stamp, Street, Timber, ZeroCard, Field, mix, move, pop, ramp, wob } from "./kit";

const QUEEN = { coat: "#D98BA6", hat: "wig" as const };
const POOR = { coat: "#8B7A5E", hat: "cap" as const };
const Cake: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <path d="M-90 0 L90 0 L80 -70 L-80 -70 Z" fill="#F3D9E0" stroke={C.line} strokeWidth={9} strokeLinejoin="round" />
    <path d="M-80 -70 L80 -70 L70 -120 L-70 -120 Z" fill={C.white} stroke={C.line} strokeWidth={9} strokeLinejoin="round" />
    <circle cx={0} cy={-136} r={16} fill={C.red} stroke={C.line} strokeWidth={6} />
  </g>
);
const Brioche: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <path d="M-90 0 C -100 -60 -40 -80 0 -70 C 40 -80 100 -60 90 0 Z" fill="#D9A24E" stroke={C.line} strokeWidth={9} strokeLinejoin="round" />
    <circle cx={0} cy={-86} r={30} fill="#D9A24E" stroke={C.line} strokeWidth={9} />
  </g>
);
const queenPose = (f: number) => (
  <>
    <Palace />
    <Bean x={540} y={FEET} s={1.5} {...QUEEN} face="smug" armR={110} armL={20} holdR={<g transform="translate(20 -10)"><Cake s={0.7} /></g>} />
  </>
);

export const c01: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Street f={f} />
    {[220, 540, 860].map((x, i) => <Bean key={x} x={x} y={FEET + (i % 2) * 30} s={1.05} {...POOR} face={i === 1 ? "panic" : "angry"} armR={150 + wob(f + i * 7, 3, 14)} armL={30} />)}
    <g transform={`translate(540 520) scale(${pop(f, 6)})`}><Big x={0} y={0} size={170} color={C.yellow}>1789</Big></g>
  </Scene>
);
export const c02: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    {queenPose(f)}
    <g transform={`translate(820 540) scale(${pop(f, 10)})`}>
      <path d="M-170 -110 L170 -110 L170 70 L-40 70 L-110 140 L-90 70 L-170 70 Z" fill={C.white} stroke={C.line} strokeWidth={10} strokeLinejoin="round" />
      <Ink x={0} y={-10} size={56}>Let them</Ink><Ink x={0} y={50} size={56}>eat cake!</Ink>
    </g>
  </Scene>
);
export const c03: React.FC<ShotProps> = ({ f }) => {
  const k = ramp(f, 10, 26, move);
  return (
    <Scene f={f}>
      <Palace />
      <Bean x={540} y={FEET} s={1.5} {...QUEEN} face={k > 0.3 ? "panic" : "smug"} armR={k > 0.3 ? 150 : 110} armL={k > 0.3 ? 150 : 20}
        holdR={k < 0.3 ? <g transform="translate(20 -10)"><Cake s={0.7} /></g> : undefined} />
      {k >= 0.3 ? <g transform={`translate(${mix(650, 980, k)} ${mix(900, 1500, k * k)}) rotate(${k * 200})`}><Cake s={0.7} /></g> : null}
    </Scene>
  );
};
export const c04: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Palace />
    <Bean x={540} y={FEET} s={1.15} {...QUEEN} face="deadpan" />
    <g transform={`translate(540 330) scale(${mix(1.3, 1, pop(f, 2, 6))}) translate(-540 -330)`}>
      <Big x={540} y={270} size={110}>MARIE</Big><Big x={540} y={380} size={110}>ANTOINETTE</Big>
      <Big x={540} y={480} size={84} color={C.yellow}>THE CAKE MYTH</Big>
    </g>
  </Scene>
);
const ROUSSEAU = { coat: "#3D5A80", hat: "tophat" as const };
export const c05: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Timber />
    <Bean x={330} y={FEET} s={1.4} {...ROUSSEAU} face="smug" armR={100 + wob(f, 1.6, 10)} armL={20} holdR={<path d="M0 0 L40 -70" stroke={C.line} strokeWidth={10} strokeLinecap="round" />} />
    <g transform={`translate(760 ${900 - pop(f, 6) * 40})`}><Book x={0} y={0} s={0.9} title="Confessions" /></g>
  </Scene>
);
export const c06: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <Card x={540} y={760} w={560} h={600} rot={-3}>
      <rect x={-280} y={-300} width={560} height={130} fill={C.red} stroke={C.line} strokeWidth={10} />
      <Ink x={0} y={-215} size={60} color={C.white}>YEAR</Ink>
      <g transform={`scale(${pop(f, 6)})`}><Big x={0} y={110} size={190} color={C.yellow}>1765</Big></g>
    </Card>
  </Scene>
);
export const c07: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    <Book x={540} y={760} s={1.6} open={1} />
    <g transform={`translate(540 ${780}) scale(${pop(f, 4)})`}>
      <rect x={-330} y={-60} width={660} height={110} fill={C.yellow} opacity={0.75} />
      <Ink x={0} y={20} size={66} serif>"a great princess"</Ink>
    </g>
    <g transform={`translate(860 480) scale(${pop(f, 18)})`}><Big x={0} y={0} size={180}>?</Big></g>
  </Scene>
);
export const c08: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Field f={f} />
    <Bean x={540} y={FEET} s={0.95} coat="#D98BA6" hair face="happy" armL={140 + wob(f, 3, 10)} armR={140 - wob(f, 3, 10)} />
    <g transform={`translate(820 640) scale(${pop(f, 8)})`}><Big x={0} y={0} size={260} color={C.yellow}>9</Big></g>
  </Scene>
);
export const c09: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Field f={f} />
    <g transform="translate(250 820)">
      <rect x={-110} y={0} width={220} height={300} fill="#E8E2D2" stroke={C.line} strokeWidth={LW_} />
      <path d="M-130 0 L0 -120 L130 0 Z" fill={C.red} stroke={C.line} strokeWidth={LW_} strokeLinejoin="round" />
    </g>
    <Bean x={640} y={FEET} s={0.95} coat="#D98BA6" hair face="happy" armR={120} armL={20}
      holdR={<g><path d="M0 0 L0 -160" stroke={C.line} strokeWidth={8} /><rect x={0} y={-160} width={110} height={70} fill={C.red} stroke={C.line} strokeWidth={6} /><rect x={0} y={-137} width={110} height={24} fill={C.white} /></g>} />
    <g transform={`translate(540 480) scale(${pop(f, 6)})`}><Big x={0} y={0} size={140}>AUSTRIA</Big></g>
  </Scene>
);
const LW_ = 11;
export const c10: React.FC<ShotProps> = ({ f }) => {
  const sw = ramp(f, 16, 30, move);
  return (
    <Scene f={f}>
      <Parchment />
      <g transform={`translate(540 ${820 - sw * 0})`}>
        {sw < 0.5 ? <g transform={`scale(${2.2 * (1 - sw * 2)} 2.2)`}><Cake /></g> : <g transform={`scale(${2.2 * (sw * 2 - 1)} 2.2)`}><Brioche /></g>}
      </g>
      <g transform={`translate(540 480) scale(${pop(f, 30)})`}><Big x={0} y={0} size={150} color={C.yellow}>BRIOCHE</Big></g>
    </Scene>
  );
};
export const c11: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    {["WRONG AGE", "WRONG COUNTRY", "WRONG PASTRY"].map((t, i) => (
      <g key={t} transform={`translate(540 ${430 + i * 190}) scale(${pop(f, 4 + i * 16)})`}>
        <Big x={-60} y={0} size={86} color={i === 2 ? C.yellow : C.white}>{t}</Big>
      </g>
    ))}
    {[0, 1, 2].map((i) => <Stamp key={i} f={f} a={10 + i * 16} x={940} y={400 + i * 190} text="✗" size={70} />)}
  </Scene>
);
export const c12: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Palace />
    <Bean x={360} y={FEET} s={1.4} {...QUEEN} face="deadpan" armR={95 + wob(f, 1.6, 10)} armL={20} holdR={<path d="M0 0 L40 -70" stroke={C.line} strokeWidth={10} strokeLinecap="round" />} />
    <g transform={`translate(780 ${880 - pop(f, 6) * 30}) rotate(4)`}>
      <Card x={0} y={0} w={380} h={460} fill={C.parchment}>
        <Ink x={0} y={-150} size={42} serif>Dear Mother,</Ink>
        {Array.from({ length: 5 }, (_, k) => <path key={k} d={`M-150 ${-80 + k * 50} L${k === 4 ? 40 : 150} ${-80 + k * 50}`} stroke={C.parchLo} strokeWidth={10} />)}
        <Ink x={0} y={190} size={40} serif>help the people</Ink>
      </Card>
    </g>
  </Scene>
);
export const c13: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Street f={f} />
    <Rays f={f} x={540} y={700} o={0.25} color={C.red} />
    {[260, 540, 820].map((x, i) => <Bean key={x} x={x} y={FEET} s={1.1} {...POOR} face="angry" armR={160 + wob(f + i * 5, 2.5, 12)} armL={30} />)}
    <g transform={`translate(540 480) scale(${pop(f, 8)})`}><Big x={0} y={0} size={150} color={C.red}>VILLAIN?</Big></g>
  </Scene>
);
export const c14: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    {[[-1, 380, 640, -10], [1, 700, 760, 8], [0, 520, 960, -4]].map(([d, x, y, r], i) => {
      const k = pop(f, 2 + i * 10, 8);
      return k > 0 ? (
        <g key={i} transform={`translate(${x} ${y}) rotate(${r}) scale(${k})`}>
          <Card x={0} y={0} w={420} h={520} fill="#F1ECE0">
            <Bean x={0} y={210} s={0.55} {...QUEEN} face="angry" armR={120} armL={20} />
            <Ink x={0} y={-200} size={48}>{["SHOCKING!", "SCANDAL!", "THE QUEEN!"][i]}</Ink>
          </Card>
        </g>
      ) : null;
    })}
  </Scene>
);
export const c15: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    {queenPose(f)}
    <g transform={`translate(${mix(1300, 760, ramp(f, 4, 16, move))} 600) rotate(-6)`}>
      <Card x={0} y={0} w={420} h={160} fill={C.yellow}><Ink x={0} y={20} size={46}>"Let them eat cake"</Ink></Card>
      <circle cx={-180} cy={-60} r={16} fill={C.red} stroke={C.line} strokeWidth={6} />
    </g>
    <Stamp f={f} a={24} x={540} y={420} text="STUCK" size={120} />
  </Scene>
);
export const c16: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <rect x={0} y={0} width={1080} height={1920} fill="#B9C7D8" />
    <rect x={0} y={1150} width={1080} height={770} fill={C.slate} stroke={C.line} strokeWidth={11} />
    <g transform={`translate(330 ${960 + wob(f, 6, 8)})`}>
      <path d="M-110 -160 L110 -160 L100 120 L-100 120 Z" fill={C.white} stroke={C.line} strokeWidth={11} strokeLinejoin="round" />
      <path d="M110 -100 C 190 -100 190 60 104 60" fill="none" stroke={C.line} strokeWidth={22} />
      <g transform="translate(0 -10)"><Cake s={0.6} /></g>
    </g>
    <g transform={`translate(760 ${940 - wob(f, 6, 8)})`}>
      <path d="M-180 -200 L-90 -240 Q0 -200 90 -240 L180 -200 L150 -120 L120 -130 L120 200 L-120 200 L-120 -130 L-150 -120 Z" fill={C.red} stroke={C.line} strokeWidth={11} strokeLinejoin="round" />
      <Ink x={0} y={20} size={44} color={C.white}>LET THEM</Ink><Ink x={0} y={74} size={44} color={C.white}>EAT CAKE</Ink>
    </g>
  </Scene>
);
export const c17: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Parchment />
    {[[300, 900], [540, 860], [780, 900]].map(([x, y], i) => (
      <g key={i} transform={`translate(${x} ${y})`}>
        <circle cx={0} cy={-200} r={90} fill="#C9C3B4" stroke={C.line} strokeWidth={11} />
        <path d="M-120 60 C -120 -90 120 -90 120 60 Z" fill="#C9C3B4" stroke={C.line} strokeWidth={11} />
        <g transform={`scale(${pop(f, 6 + i * 6)})`}><Big x={0} y={-160} size={120}>?</Big></g>
      </g>
    ))}
  </Scene>
);
export const c18: React.FC<ShotProps> = ({ f }) => <Scene f={f}><ZeroCard f={f} label="CAKES OFFERED" /></Scene>;
export const c19: React.FC<ShotProps> = ({ f }) => (
  <Scene f={f}>
    <Palace />
    <Bean x={540} y={FEET} s={1.5} {...QUEEN} face="deadpan" />
    <Stamp f={f} a={22} x={540} y={520} text="FAKE QUOTE" size={110} />
  </Scene>
);
/** The loop: lands back on the opening (wrong) version so the Short repeats. */
export const c20: React.FC<ShotProps> = ({ f }) => <Scene f={f + 5}>{queenPose(f)}</Scene>;

export const SHOT_VIEWS: Record<string, React.FC<ShotProps>> = { c01, c02, c03, c04, c05, c06, c07, c08, c09, c10, c11, c12, c13, c14, c15, c16, c17, c18, c19, c20 };
void Arrow; void Newspaper;
