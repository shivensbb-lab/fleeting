import React from "react";
import { ISLAND, Pose, Vec } from "../lib/camera";
import { arrive, leave, mix, move, ramp } from "../lib/ease";
import { COLOR } from "../lib/format";
import { lightLevel } from "../lib/light";
import { noise1, rnd } from "../lib/noise";
import { LF } from "../lib/time";
import { FONT } from "../fonts";
import { Place } from "./Place";

const PILLS = ["who's on?", "lobby full", "anyone??", "need 1 more", "hop on", "@everyone", "queue?", "afk", "gg", "3 online", "ping", "squad up"];

/** Hook: a pile of "who's on?" messages that collapses on "squad". */
export const Noise: React.FC<{ frame: number; pose: Pose }> = ({ frame, pose }) => {
  const hook = LF("hook");
  if (frame > hook.accent + 34) return null;
  const fall = ramp(frame, hook.accent - 6, hook.accent + 28, leave);
  return (
    <>
      {PILLS.map((label, i) => {
        const enter = ramp(frame, -24 + i * 4, 18 + i * 4);
        const base: Vec = [rnd(i * 3, -3.6, 3.6), rnd(i * 3 + 1, -3.2, 4.0), rnd(i * 3 + 2, -3, 2)];
        const at: Vec = [base[0] + noise1(frame / 6, i) * 0.12, base[1] + noise1(frame / 7, i + 20) * 0.12 - fall * rnd(i * 3 + 5, 6, 10), mix(base[2] - 20, base[2], enter) - fall * 4];
        const opacity = mix(0.4, 1, enter) * (1 - fall);
        if (opacity <= 0.01) return null;
        return (
          <Place key={i} pose={pose} at={at} w={620} h={150} opacity={opacity} filter={`blur(${((1 - enter) * 10 + fall * 14).toFixed(2)}px)`}>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "18px 30px", borderRadius: 60, background: "rgba(34,36,70,0.92)",
                border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 20px 50px rgba(0,0,0,0.5)", fontFamily: FONT.mono, fontWeight: 500, fontSize: 64, color: "#dfe3f5",
                transform: `rotate(${rnd(i * 3 + 9, -8, 8)}deg)`, whiteSpace: "nowrap" }}>
                <span style={{ width: 22, height: 22, borderRadius: 11, background: COLOR.violet, flexShrink: 0 }} />
                {label}
              </div>
            </div>
          </Place>
        );
      })}
    </>
  );
};

/** The PG crest: five nodes (five goons) linked into a pentagon around a monogram. */
const CrestArt: React.FC<{ size: number; nodes: number[]; lines: number; mono: number; blaze: number; spin: number }> = ({ size, nodes, lines, mono, blaze, spin }) => {
  const c = size / 2, r = size * 0.36;
  const pts = Array.from({ length: 5 }, (_, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5 + spin;
    return [c + Math.cos(a) * r, c + Math.sin(a) * r];
  });
  const path = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ") + " Z";
  const star = [0, 2, 4, 1, 3].map((k, i) => `${i ? "L" : "M"}${pts[k][0].toFixed(1)} ${pts[k][1].toFixed(1)}`).join(" ") + " Z";
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: "visible", filter: `drop-shadow(0 0 ${(10 + blaze * 30).toFixed(1)}px ${COLOR.glow})` }}>
      <circle cx={c} cy={c} r={r * (1.22 + blaze * 0.1)} fill="none" stroke={COLOR.violet} strokeWidth={size * 0.006} opacity={0.5 * lines} />
      <path d={path} fill="none" stroke={COLOR.accent} strokeWidth={size * 0.012} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - lines} />
      <path d={star} fill="none" stroke={COLOR.accent} strokeWidth={size * 0.005} opacity={0.55} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - lines} />
      {pts.map((p, i) => (
        <g key={i} transform={`translate(${p[0]} ${p[1]}) scale(${nodes[i]})`}>
          <circle r={size * 0.05} fill={COLOR.night} stroke={COLOR.accent} strokeWidth={size * 0.012} />
          <circle r={size * 0.022} fill={COLOR.mint} />
        </g>
      ))}
      <text x={c} y={c + size * 0.085} textAnchor="middle" fontFamily={FONT.hero} fontWeight={900} fontSize={size * 0.26} letterSpacing={-size * 0.01}
        fill={COLOR.mint} opacity={mono} style={{ clipPath: `inset(${(1 - mono) * 100}% 0 0 0)` }}>PG</text>
    </svg>
  );
};

export const Crest: React.FC<{ frame: number; pose: Pose }> = ({ frame, pose }) => {
  const intro = LF("intro");
  const best = LF("best");
  const mc = LF("mc");
  if (frame < intro.start - 22 || frame > mc.start + 8) return null;
  const nodes = Array.from({ length: 5 }, (_, i) => ramp(frame, intro.start - 22 + i * 5, intro.start - 8 + i * 5, arrive));
  const lines = ramp(frame, intro.start, intro.accent - 4, move);
  const mono = ramp(frame, intro.accent - 12, intro.accent + 4, arrive);
  const blaze = Math.max(0, Math.sin(ramp(frame, best.accent - 8, best.accent + 40) * Math.PI)) + ramp(frame, best.accent - 8, best.accent) * 0.4;
  const spin = ramp(frame, best.accent - 10, best.accent + 20, arrive) * ((2 * Math.PI) / 5);
  const drop = ramp(frame, mc.start - 26, mc.start + 8, leave);
  const at: Vec = [0, mix(0.8, ISLAND[1] + 1.6, drop), 0];
  return (
    <Place pose={pose} at={at} w={900} h={900} grow={mix(1, 0.05, drop)}>
      <div style={{ position: "absolute", inset: 0 }}>
        <CrestArt size={900} nodes={nodes} lines={lines} mono={mono} blaze={Math.min(1.4, blaze)} spin={spin} />
      </div>
    </Place>
  );
};

/** DAworld: the server's name floating above the island. */
export const DAworld: React.FC<{ frame: number; pose: Pose }> = ({ frame, pose }) => {
  const mc = LF("mc");
  const mcbest = LF("mcbest");
  const crew = LF("crew");
  if (frame < mc.accent - 8 || frame > crew.start + 30) return null;
  const open = ramp(frame, mc.accent - 8, mc.accent + 12, arrive);
  const sink = ramp(frame, mcbest.end - 6, crew.start + 30, leave);
  return (
    <Place pose={pose} at={[ISLAND[0], ISLAND[1] + 4.6 - sink * 7, ISLAND[2]]} w={1100} h={320} opacity={1 - sink}>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6,
        clipPath: `inset(0 ${(1 - open) * 50}% 0 ${(1 - open) * 50}%)` }}>
        <div style={{ fontFamily: FONT.mono, fontWeight: 500, fontSize: 44, letterSpacing: "0.3em", color: COLOR.accent, paddingLeft: "0.3em" }}>MC SERVER</div>
        <div style={{ fontFamily: FONT.hero, fontWeight: 900, fontSize: 190, letterSpacing: "-0.04em", lineHeight: 1, color: COLOR.mint, textShadow: `0 0 60px ${COLOR.glow}` }}>
          DA<span style={{ color: COLOR.accent }}>world</span>
        </div>
      </div>
    </Place>
  );
};

/** Five goons. Status: jobless. Then all five come online. */
export const Players: React.FC<{ frame: number }> = ({ frame }) => {
  const crew = LF("crew");
  const ready = LF("ready");
  const games = LF("games");
  if (frame < crew.start - 8 || frame > games.start + 4) return null;
  const out = ramp(frame, games.start - 16, games.start + 2, leave);
  const lv = lightLevel(frame);
  return (
    <div style={{ position: "absolute", left: 140, right: 140, top: 250, display: "grid", gap: 22, zIndex: 20000 }}>
      {Array.from({ length: 5 }, (_, i) => {
        const t = ramp(frame, crew.start - 8 + i * 6, crew.start + 10 + i * 6, arrive);
        const on = ramp(frame, ready.accent - 40 + i * 8, ready.accent - 32 + i * 8 + 8, arrive);
        return (
          <div key={i} style={{ overflow: "hidden", borderRadius: 26 }}>
            <div style={{ transform: `translateX(${((1 - t) + out) * 110 * (out > 0 ? -1 : 1)}%)`, display: "flex", alignItems: "center", gap: 26, padding: "18px 26px",
              borderRadius: 26, background: `rgba(22,26,64,${0.6 + 0.2 * on})`, border: `2px solid ${on > 0.5 ? COLOR.accent : "rgba(234,246,255,0.14)"}`,
              boxShadow: on > 0.5 ? `0 0 40px rgba(61,224,255,0.25)` : "none", filter: `brightness(${mix(0.85, 1, Math.max(lv, on)).toFixed(3)})` }}>
              <div style={{ width: 88, height: 88, borderRadius: 18, background: on > 0.5 ? COLOR.accent : COLOR.deep, display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: FONT.mono, fontWeight: 500, fontSize: 38, color: on > 0.5 ? COLOR.night : COLOR.muted, flexShrink: 0 }}>0{i + 1}</div>
              <div style={{ display: "grid", gap: 2, flex: 1, minWidth: 0 }}>
                <span style={{ fontFamily: FONT.hero, fontWeight: 800, fontSize: 52, letterSpacing: "-0.02em", color: COLOR.mint, lineHeight: 1.05 }}>Goon 0{i + 1}</span>
                <span style={{ fontFamily: FONT.mono, fontWeight: 500, fontSize: 34, color: COLOR.muted }}>status: jobless</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 20px", borderRadius: 30, flexShrink: 0,
                background: on > 0.5 ? "rgba(61,224,255,0.16)" : "rgba(255,255,255,0.06)", fontFamily: FONT.mono, fontWeight: 500, fontSize: 36, color: on > 0.5 ? COLOR.accent : COLOR.muted }}>
                <span style={{ width: 18, height: 18, borderRadius: 9, background: on > 0.5 ? COLOR.accent : "#5b6080", boxShadow: on > 0.5 ? `0 0 14px ${COLOR.accent}` : "none" }} />
                {on > 0.5 ? "online" : "away"}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/** The games: four titles slam in, one per beat. Type only, no logos. */
export const Games: React.FC<{ frame: number }> = ({ frame }) => {
  const games = LF("games");
  const cta = LF("cta");
  if (frame < games.start || frame > cta.start + 4) return null;
  const titles: { node: React.ReactNode; top: number }[] = [
    { top: 270, node: <div style={{ fontFamily: FONT.hero, fontWeight: 900, fontSize: 150, letterSpacing: "-0.03em", color: COLOR.mint, transform: "skewX(-9deg)" }}>FORTNITE</div> },
    { top: 470, node: <div style={{ fontFamily: FONT.hero, fontWeight: 800, fontSize: 70, letterSpacing: "0.14em", color: COLOR.mint, paddingLeft: "0.14em" }}>RAINBOW SIX <span style={{ color: COLOR.accent }}>SIEGE</span></div> },
    { top: 590, node: <div style={{ fontFamily: FONT.hero, fontWeight: 900, fontSize: 128, letterSpacing: "-0.02em", color: COLOR.mint }}>BATTLEFIELD <span style={{ color: COLOR.accent }}>6</span></div> },
    { top: 780, node: <div style={{ fontFamily: FONT.mono, fontWeight: 500, fontSize: 118, letterSpacing: "0.02em", color: COLOR.mint, textShadow: `8px 8px 0 ${COLOR.violet}` }}>MINECRAFT</div> },
  ];
  const lands = titles.map((_, i) => games.start + 30 + i * 36);
  let shake = 0;
  lands.forEach((l) => { const k = frame - l; if (k >= 0 && k < 8) shake = Math.max(shake, (8 - k) / 8); });
  const out = ramp(frame, cta.start - 16, cta.start + 2, leave);
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 20000, transform: `translate(${(noise1(frame, 3) * 10 * shake).toFixed(1)}px, ${(noise1(frame, 7) * 10 * shake).toFixed(1)}px)` }}>
      {titles.map((g, i) => {
        const t = ramp(frame, lands[i] - 12, lands[i], arrive);
        if (t <= 0) return null;
        const flash = Math.max(0, 1 - (frame - lands[i]) / 14);
        return (
          <div key={i} style={{ position: "absolute", left: 0, right: 0, top: g.top, display: "flex", justifyContent: "center", whiteSpace: "nowrap",
            opacity: t * (1 - out), filter: `blur(${((1 - t) * 16 + out * 10).toFixed(2)}px) drop-shadow(0 0 ${(30 * flash).toFixed(1)}px ${COLOR.glow})`,
            transform: `translateY(${-out * 80}px) scale(${mix(1.7, 1, t)})` }}>
            {g.node}
          </div>
        );
      })}
    </div>
  );
};

/** The finale: crest and name; for the credits it lifts out of the way. */
export const Wordmark: React.FC<{ frame: number }> = ({ frame }) => {
  const cta = LF("cta");
  const credits = LF("credits");
  if (frame < cta.start - 6) return null;
  const open = ramp(frame, cta.start - 6, cta.start + 20, arrive);
  const crest = ramp(frame, cta.start - 10, cta.start + 10, arrive);
  const lift = ramp(frame, credits.start - 14, credits.start + 18, move);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: mix(240, 110, lift), display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
      transform: `scale(${mix(1, 0.52, lift)})`, transformOrigin: "50% 0", zIndex: 25000 }}>
      <div style={{ transform: `scale(${crest})` }}>
        <CrestArt size={300} nodes={[1, 1, 1, 1, 1]} lines={crest} mono={crest} blaze={0.6} spin={0} />
      </div>
      <div style={{ overflow: "hidden" }}>
        <div style={{ transform: `translateY(${(1 - open) * 110}%)`, fontFamily: FONT.hero, fontWeight: 900, fontSize: 116, letterSpacing: "0.02em", color: COLOR.mint, lineHeight: 1 }}>PROFESSIONAL</div>
      </div>
      <div style={{ overflow: "hidden" }}>
        <div style={{ transform: `translateY(${(1 - ramp(frame, cta.start, cta.start + 24, arrive)) * 110}%)`, fontFamily: FONT.hero, fontWeight: 900, fontSize: 210,
          letterSpacing: "-0.03em", color: COLOR.accent, lineHeight: 0.95, textShadow: `0 0 60px ${COLOR.glow}` }}>GOONS</div>
      </div>
    </div>
  );
};

const CreditLine: React.FC<{ t: number; children: React.ReactNode }> = ({ t, children }) => (
  <div style={{ overflow: "hidden", paddingBottom: 8 }}>
    <div style={{ transform: `translateY(${(1 - t) * 110}%)` }}>{children}</div>
  </div>
);

const cap = (size: number, color: string): React.CSSProperties => ({
  fontFamily: FONT.mono, fontWeight: 500, fontSize: size, letterSpacing: "0.42em", textTransform: "uppercase", color, textAlign: "center", paddingLeft: "0.42em",
});

/** Credits, in professional lettering (same as the Root promo). */
export const Credits: React.FC<{ frame: number }> = ({ frame }) => {
  const credits = LF("credits");
  if (frame < credits.start - 4) return null;
  const l = (i: number) => ramp(frame, credits.start + i * 6, credits.start + i * 6 + 20, arrive);
  const rule = (i: number) => ramp(frame, credits.start + i * 6, credits.start + i * 6 + 26, move);
  const scrim = ramp(frame, credits.start - 4, credits.start + 20);
  const name: React.CSSProperties = { fontFamily: FONT.hero, fontWeight: 800, fontSize: 66, letterSpacing: "-0.02em", color: COLOR.mint, textAlign: "center", lineHeight: 1.1 };
  return (
    <>
      <div style={{ position: "absolute", inset: 0, zIndex: 24000, opacity: scrim,
        background: "radial-gradient(ellipse 70% 45% at 50% 55%, rgba(5,6,15,0.85), rgba(5,6,15,0.5) 70%, rgba(5,6,15,0.2))" }} />
      <div style={{ position: "absolute", left: 60, right: 60, top: 650, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, zIndex: 26000 }}>
        <CreditLine t={l(0)}><div style={cap(30, COLOR.muted)}>Built by</div></CreditLine>
        <CreditLine t={l(1)}><div style={{ fontFamily: FONT.accent, fontStyle: "italic", fontSize: 150, lineHeight: 1, color: COLOR.mint, textAlign: "center" }}>Shiven</div></CreditLine>
        <CreditLine t={l(2)}><div style={cap(32, COLOR.accent)}>Group Admin</div></CreditLine>
        <div style={{ width: `${rule(3) * 56}%`, height: 2, background: "rgba(234,246,255,0.25)", margin: "14px 0" }} />
        <CreditLine t={l(4)}><div style={cap(28, COLOR.muted)}>Under his command</div></CreditLine>
        <CreditLine t={l(5)}><div style={name}>Adam Buenavida</div></CreditLine>
        <CreditLine t={l(6)}><div style={name}>Andreas &middot; Vihaan</div></CreditLine>
        <div style={{ width: `${rule(7) * 56}%`, height: 2, background: "rgba(234,246,255,0.25)", margin: "14px 0" }} />
        <CreditLine t={l(8)}><div style={cap(28, COLOR.muted)}>In partnership with</div></CreditLine>
        <CreditLine t={l(9)}><div style={{ ...name, fontSize: 76 }}>Aadam Kamraan</div></CreditLine>
      </div>
    </>
  );
};
