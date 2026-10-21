import React from "react";
import { AB, J3, MAP, Pose, Vec } from "../lib/camera";
import { arrive, leave, mix, move, ramp } from "../lib/ease";
import { COLOR } from "../lib/format";
import { dusk } from "../lib/light";
import { LF } from "../lib/time";
import { FONT } from "../fonts";
import { Place } from "./Place";

const MW = 1200;
const MH = 900;
const px = (p: Vec) => ({ x: MW / 2 + (p[0] - MAP[0]) * 100, y: MH / 2 - (p[1] - MAP[1]) * 100 });

const Pin: React.FC<{ x: number; y: number; scale: number; shadow: number }> = ({ x, y, scale, shadow }) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx={0} cy={4} rx={34 * shadow} ry={10 * shadow} fill="rgba(30,27,46,0.22)" />
    <g transform={`translate(0 ${-(1 - shadow) * 0}) scale(${scale})`}>
      <path d="M0 0 C -14 -24 -44 -40 -44 -72 A44 44 0 1 1 44 -72 C 44 -40 14 -24 0 0 Z" fill={COLOR.accent} />
      <circle cx={0} cy={-72} r={17} fill={COLOR.white} />
    </g>
  </g>
);

const Label: React.FC<{ x: number; y: number; t: number; title: string; tag?: string }> = ({ x, y, t, title, tag }) => (
  <div style={{ position: "absolute", left: x, top: y, overflow: "hidden", padding: "6px 10px 16px" }}>
    <div style={{ transform: `translateY(${(1 - t) * 110}%)`, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 10 }}>
      <div style={{ background: COLOR.white, borderRadius: 40, padding: "14px 30px", fontFamily: FONT.hero, fontWeight: 800, fontSize: 56,
        letterSpacing: "-0.02em", color: COLOR.ink, boxShadow: "0 10px 30px rgba(80,40,30,0.16)", whiteSpace: "nowrap" }}>{title}</div>
      {tag ? (
        <div style={{ background: COLOR.accent, borderRadius: 30, padding: "8px 22px", fontFamily: FONT.mono, fontWeight: 500, fontSize: 44,
          color: COLOR.white, whiteSpace: "nowrap" }}>{tag}</div>
      ) : null}
    </div>
  </div>
);

export const MapCard: React.FC<{ frame: number; pose: Pose }> = ({ frame, pose }) => {
  const place = LF("place");
  const quiet = LF("quiet");
  const ab = LF("ab");
  const free = LF("free");
  if (frame < place.start - 26 || frame > free.start) return null;

  // E1: the map floats in out of depth, haze clearing; it folds into the button at the end
  const enter = ramp(frame, place.start - 26, place.start + 16);
  const fold = ramp(frame, free.start - 26, free.start - 4, leave);
  const at: Vec = [mix(MAP[0], 0, fold), mix(MAP[1], 0.3, fold), mix(-22, 0, enter)];
  const roads = ramp(frame, place.start - 4, place.start + 34, move);

  const j3 = px(J3);
  const born = ramp(frame, place.start + 4, place.start + 22, arrive);
  const drop = ramp(frame, place.accent - 16, place.accent, arrive);
  const j3Y = mix(j3.y - 160, j3.y, drop);
  const j3Label = ramp(frame, place.accent, place.accent + 16);

  const abP = px(AB);
  const abDrop = ramp(frame, ab.accent - 20, ab.accent, arrive);
  const abLabel = ramp(frame, ab.accent, ab.accent + 16);
  const line = ramp(frame, ab.start + 4, ab.accent - 8, move);

  const pulseOn = frame > quiet.start - 8 && frame < ab.start + 24;
  return (
    <Place pose={pose} at={at} w={MW} h={MH} grow={mix(1, 0.12, fold)} opacity={1 - ramp(frame, free.start - 12, free.start - 2)}
      filter={`blur(${((1 - enter) * 16).toFixed(2)}px) brightness(${mix(1, 0.62, dusk(frame)).toFixed(3)})`}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 40, overflow: "hidden", background: "#F6EEE4",
        border: "1px solid rgba(255,255,255,0.9)", boxShadow: "0 50px 140px rgba(80,40,30,0.22), inset 0 1px 0 #fff" }}>
        <svg width={MW} height={MH} style={{ position: "absolute", inset: 0 }}>
          <path d="M0 0 L520 0 C 430 120 300 160 180 300 C 110 380 40 420 0 430 Z" fill="#DCE7EA" />
          <path d="M520 0 C 430 120 300 160 180 300 C 110 380 40 420 0 430" fill="none" stroke="#C9D8DC" strokeWidth={6} />
          {[
            "M260 900 L560 260 L700 0",
            "M0 760 L1200 760",
            "M760 900 L1000 0",
            "M300 160 L1200 560",
            "M1200 220 L620 900",
          ].map((d, i) => (
            <path key={i} d={d} fill="none" stroke="#FFFFFF" strokeWidth={18} strokeLinecap="round" pathLength={1} strokeDasharray={1}
              strokeDashoffset={1 - ramp(frame, place.start - 4 + i * 4, place.start + 26 + i * 4, move)} />
          ))}
          <path d="M60 700 L1160 62" fill="none" stroke="#FFFFFF" strokeWidth={34} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - roads} />
          <path d="M60 700 L1160 62" fill="none" stroke="rgba(167,20,76,0.28)" strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - roads} />
          <text transform="translate(640 404) rotate(-30)" fontFamily={FONT.mono} fontWeight={500} fontSize={44} fill={COLOR.muted} opacity={ramp(frame, place.start + 20, place.start + 34)}>Al Wasl Rd</text>
          {line > 0 ? (
            <>
              <defs>
                <mask id="abline" maskUnits="userSpaceOnUse" x={0} y={0} width={MW} height={MH}>
                  <path d={`M${j3.x} ${j3.y - 70} Q ${(j3.x + abP.x) / 2} ${Math.min(j3.y, abP.y) - 220} ${abP.x} ${abP.y - 70}`} fill="none" stroke="#fff"
                    strokeWidth={24} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - line} />
                </mask>
              </defs>
              <path d={`M${j3.x} ${j3.y - 70} Q ${(j3.x + abP.x) / 2} ${Math.min(j3.y, abP.y) - 220} ${abP.x} ${abP.y - 70}`} fill="none" stroke={COLOR.accent}
                strokeWidth={8} strokeLinecap="round" strokeDasharray="4 22" opacity={0.85} mask="url(#abline)" />
            </>
          ) : null}
          {pulseOn
            ? [0, 1, 2].map((r) => {
                const ph = (((frame - quiet.start + r * 26) % 78) + 78) % 78 / 78;
                return <circle key={r} cx={j3.x} cy={j3.y} r={30 + ph * 170} fill="none" stroke={COLOR.accent} strokeWidth={5} opacity={(1 - ph) * 0.55} />;
              })
            : null}
          {born > 0 ? <Pin x={j3.x} y={j3Y} scale={mix(0.25, 1, born)} shadow={drop} /> : null}
          {abDrop > 0 ? <Pin x={abP.x} y={mix(abP.y - 300, abP.y, abDrop)} scale={1} shadow={abDrop} /> : null}
        </svg>
        {j3Label > 0 ? <Label x={j3.x + 52} y={j3.y - 130} t={j3Label} title="J3 Mall" /> : null}
        {abLabel > 0 ? <Label x={abP.x - 200} y={abP.y + 30} t={abLabel} title="AB Centre" tag="Opening soon" /> : null}
      </div>
    </Place>
  );
};
