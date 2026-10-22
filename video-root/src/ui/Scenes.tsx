import React from "react";
import { Pose, Vec } from "../lib/camera";
import { arrive, leave, mix, move, ramp } from "../lib/ease";
import { COLOR } from "../lib/format";
import { noise1, rnd } from "../lib/noise";
import { DURATION_FRAMES, LF } from "../lib/time";
import { FONT } from "../fonts";
import { Place } from "./Place";

const PILLS = ["99+", "@everyone", "ping", "12 unread", "#general", "@here", "47 new", "mention", "ping", "new message", "!!", "3 calls"];

/** Hook: a noisy pile of notifications that collapses into the dark on "better". */
export const Noise: React.FC<{ frame: number; pose: Pose }> = ({ frame, pose }) => {
  const hook = LF("hook");
  if (frame > hook.accent + 34) return null;
  const fall = ramp(frame, hook.accent - 6, hook.accent + 28, leave);
  return (
    <>
      {PILLS.map((label, i) => {
        const enter = ramp(frame, -24 + i * 4, 18 + i * 4);
        const base: Vec = [rnd(i * 3, -3.6, 3.6), rnd(i * 3 + 1, -3.4, 4.0), rnd(i * 3 + 2, -3, 2)];
        const jx = noise1(frame / 6, i) * 0.12, jy = noise1(frame / 7, i + 20) * 0.12;
        const at: Vec = [base[0] + jx, base[1] + jy - fall * rnd(i * 3 + 5, 6, 10), mix(base[2] - 20, base[2], enter) - fall * 4];
        const opacity = mix(0.4, 1, enter) * (1 - fall);
        if (opacity <= 0.01) return null;
        return (
          <Place key={i} pose={pose} at={at} w={620} h={150} opacity={opacity} filter={`blur(${((1 - enter) * 10 + fall * 14).toFixed(2)}px)`}>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "18px 30px", borderRadius: 60, background: "rgba(40,48,52,0.92)",
                border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 20px 50px rgba(0,0,0,0.5)", fontFamily: FONT.mono, fontWeight: 500, fontSize: 66, color: "#d9dee0",
                transform: `rotate(${rnd(i * 3 + 9, -8, 8)}deg)`, whiteSpace: "nowrap" }}>
                <span style={{ width: 22, height: 22, borderRadius: 11, background: "#ff5a5f", flexShrink: 0 }} />
                {label}
              </div>
            </div>
          </Place>
        );
      })}
    </>
  );
};

const Row: React.FC<{ frame: number; at: number; children: React.ReactNode }> = ({ frame, at, children }) => {
  const t = ramp(frame, at, at + 16);
  return (
    <div style={{ overflow: "hidden", paddingBottom: 4 }}>
      <div style={{ transform: `translateY(${(1 - t) * 110}%)` }}>{children}</div>
    </div>
  );
};

const Toggle: React.FC<{ on: number }> = ({ on }) => (
  <div style={{ width: 128, height: 70, borderRadius: 35, background: `color-mix(in srgb, ${COLOR.accent} ${on * 100}%, rgba(255,255,255,0.14))`, position: "relative", flexShrink: 0 }}>
    <div style={{ position: "absolute", top: 7, left: mix(7, 65, on), width: 56, height: 56, borderRadius: 28, background: "#fff", boxShadow: "0 4px 10px rgba(0,0,0,0.3)" }} />
  </div>
);

const Pointer: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.5))" }}>
    <path d="M3 2l15 11.5-6.6.9 3.9 7.4-3 1.5-3.8-7.5L3 20.5z" fill="#fff" stroke="#06110F" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);

/** The app card: grown from a root tip; free, then voice, then rules. Screen space, centred in the hero band. */
export const AppCard: React.FC<{ frame: number }> = ({ frame }) => {
  const free = LF("free");
  const voice = LF("voice");
  const rules = LF("rules");
  const crew = LF("crew");
  if (frame < free.start - 16 || frame > crew.start + 4) return null;
  const open = ramp(frame, free.start - 16, free.start + 12, arrive) * (1 - ramp(frame, crew.start - 16, crew.start + 4, leave));
  const phase = frame < voice.start - 6 ? "free" : frame < rules.start - 6 ? "voice" : "rules";
  const CW = 880, CH = 540;

  let body: React.ReactNode = null;
  if (phase === "free") {
    const unlock = ramp(frame, free.accent - 10, free.accent + 2, arrive);
    const lockColor = unlock > 0.5 ? COLOR.accent : COLOR.mint;
    body = (
      <div style={{ display: "flex", alignItems: "center", gap: 50, padding: "20px 10px" }}>
        <svg width={240} height={280} viewBox="0 0 120 140" style={{ flexShrink: 0, overflow: "visible" }}>
          <g transform={`translate(${86 - unlock * 0} ${58}) rotate(${-unlock * 38}) translate(-86 -58)`}>
            <path d={`M34 ${62 - unlock * 16} V40 a26 26 0 0 1 52 0 V${58}`} fill="none" stroke={lockColor} strokeWidth="12" strokeLinecap="round" />
          </g>
          <rect x="18" y="60" width="84" height="72" rx="14" fill={lockColor} />
          <circle cx="60" cy="92" r="9" fill={COLOR.night} />
          <rect x="56" y="96" width="8" height="18" rx="4" fill={COLOR.night} />
        </svg>
        <div style={{ display: "grid", gap: 14 }}>
          <Row frame={frame} at={free.start}><div style={{ fontFamily: FONT.mono, fontWeight: 500, fontSize: 38, color: COLOR.muted }}>price</div></Row>
          <Row frame={frame} at={free.start + 6}><div style={{ fontFamily: FONT.hero, fontWeight: 900, fontSize: 150, lineHeight: 0.9, letterSpacing: "-0.04em", color: COLOR.mint }}>$0</div></Row>
          <Row frame={frame} at={free.start + 12}><div style={{ fontFamily: FONT.mono, fontWeight: 500, fontSize: 40, color: COLOR.accent }}>/ month, forever</div></Row>
        </div>
      </div>
    );
  } else if (phase === "voice") {
    const ptr = ramp(frame, voice.start, voice.accent - 2, move);
    const press = ramp(frame, voice.accent - 2, voice.accent + 12);
    const live = ramp(frame, voice.accent, voice.accent + 14);
    body = (
      <div style={{ display: "flex", alignItems: "center", gap: 46, position: "relative" }}>
        <div style={{ position: "relative", width: 260, height: 260, flexShrink: 0 }}>
          <div style={{ position: "absolute", inset: -60 * live, borderRadius: "50%", border: `4px solid ${COLOR.accent}`, opacity: (1 - live) * 0.8 }} />
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: live > 0.3 ? COLOR.accent : "rgba(255,255,255,0.12)",
            display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 - 0.08 * Math.sin(press * Math.PI)})`,
            boxShadow: live > 0.3 ? `0 0 60px ${COLOR.glow}` : "none" }}>
            <svg width={110} height={110} viewBox="0 0 24 24"><rect x="8.5" y="3" width="7" height="12" rx="3.5" fill={live > 0.3 ? COLOR.night : COLOR.mint} />
              <path d="M5 11a7 7 0 0 0 14 0M12 18v3" fill="none" stroke={live > 0.3 ? COLOR.night : COLOR.mint} strokeWidth="2" strokeLinecap="round" /></svg>
          </div>
          {ptr > 0 && press < 1 ? (
            <div style={{ position: "absolute", left: mix(520, 150, ptr), top: mix(360, 150, ptr), transform: `scale(${1 - 0.12 * Math.sin(press * Math.PI)})`, transformOrigin: "0 0" }}>
              <Pointer size={100} />
            </div>
          ) : null}
        </div>
        <div style={{ display: "grid", gap: 20, flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, height: 90 }}>
            {Array.from({ length: 14 }, (_, k) => (
              <div key={k} style={{ width: 14, borderRadius: 7, background: COLOR.accent, opacity: 0.4 + 0.6 * live,
                height: 16 + live * (24 + 50 * Math.abs(Math.sin(frame / 5 + k * 0.9) * Math.cos(frame / 11 + k))) }} />
            ))}
          </div>
          {["joining voice", "on my way"].map((m, k) => {
            const t = ramp(frame, voice.accent + 8 + k * 10, voice.accent + 24 + k * 10, arrive);
            return (
              <div key={m} style={{ alignSelf: "start", justifySelf: k === 0 ? "start" : "end", overflow: "hidden" }}>
                <div style={{ transform: `translateY(${(1 - t) * 110}%)`, padding: "16px 26px", borderRadius: 30, background: k === 0 ? "rgba(255,255,255,0.12)" : "rgba(76,242,164,0.22)",
                  fontFamily: FONT.mono, fontWeight: 500, fontSize: 40, color: COLOR.mint, whiteSpace: "nowrap" }}>{m}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  } else {
    const items = ["Roles", "Channels", "Invites"];
    body = (
      <div style={{ display: "grid", gap: 26 }}>
        {items.map((name, k) => {
          const on = ramp(frame, rules.accent - 34 + k * 12, rules.accent - 24 + k * 12, arrive);
          return (
            <Row key={name} frame={frame} at={rules.start - 4 + k * 5}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 6px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                <span style={{ fontFamily: FONT.hero, fontWeight: 800, fontSize: 64, letterSpacing: "-0.02em", color: COLOR.mint }}>{name}</span>
                <Toggle on={on} />
              </div>
            </Row>
          );
        })}
      </div>
    );
  }

  const title = phase === "free" ? "the crew" : phase === "voice" ? "the crew  /  voice" : "the crew  /  settings";
  return (
    <div style={{ position: "absolute", left: 540 - CW / 2, top: 610 - CH / 2, width: CW, height: CH, borderRadius: 40, overflow: "hidden",
      clipPath: `circle(${open * 120}% at 50% 0%)`, background: "rgba(16,40,35,0.55)", backdropFilter: "blur(30px) saturate(160%)", WebkitBackdropFilter: "blur(30px) saturate(160%)",
      border: "1px solid rgba(200,255,228,0.18)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), 0 50px 140px rgba(0,0,0,0.55)", zIndex: 20000 }}>
      <div style={{ height: 100, display: "flex", alignItems: "center", gap: 18, padding: "0 40px", borderBottom: "1px solid rgba(200,255,228,0.12)" }}>
        <div style={{ width: 44, height: 44, borderRadius: 14, background: COLOR.accent, display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: FONT.hero, fontWeight: 900, fontSize: 30, color: COLOR.night }}>R</div>
        <span style={{ fontFamily: FONT.mono, fontWeight: 500, fontSize: 40, color: COLOR.mint, whiteSpace: "pre" }}>{title}</span>
      </div>
      <div style={{ padding: "40px 50px" }}>{body}</div>
    </div>
  );
};

/** Quiet beat: an "ad" tag is struck out and drops away. */
export const AdTag: React.FC<{ frame: number }> = ({ frame }) => {
  const crew = LF("crew");
  if (frame < crew.start || frame > crew.accent + 34) return null;
  const enter = ramp(frame, crew.start, crew.start + 22, arrive);
  const strike = ramp(frame, crew.accent - 16, crew.accent - 2, move);
  const drop = ramp(frame, crew.accent, crew.accent + 32, leave);
  return (
    <div style={{ position: "absolute", left: 540 - 220, top: 900 - 70, width: 440, height: 140, display: "flex", alignItems: "center", justifyContent: "center",
      opacity: enter * (1 - drop), filter: `blur(${((1 - enter) * 10 + drop * 12).toFixed(2)}px)`, transform: `translateY(${drop * 260}px) rotate(${drop * 14}deg) scale(${mix(1.3, 1, enter)})`, zIndex: 20000 }}>
      <div style={{ position: "relative", padding: "20px 40px", borderRadius: 18, border: "3px solid rgba(232,255,244,0.5)", fontFamily: FONT.mono, fontWeight: 500, fontSize: 52,
        color: "rgba(232,255,244,0.75)", letterSpacing: "0.1em", whiteSpace: "nowrap" }}>
        AD &middot; Sponsored
        <div style={{ position: "absolute", left: -10, top: "50%", height: 6, width: `${strike * 104}%`, background: COLOR.accent, borderRadius: 3, transform: "rotate(-6deg)" }} />
      </div>
    </div>
  );
};

/** Grow: the wordmark rises from the seed; for the credits it moves up out of the way. */
export const Wordmark: React.FC<{ frame: number }> = ({ frame }) => {
  const grow = LF("grow");
  const credits = LF("credits");
  if (frame < grow.start) return null;
  const open = ramp(frame, grow.start + 4, grow.accent + 6, arrive);
  const lift = ramp(frame, credits.start - 14, credits.start + 18, move);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: mix(470, 190, lift), height: 280, display: "flex", justifyContent: "center", alignItems: "center",
      transform: `scale(${mix(1, 0.6, lift)})`, zIndex: 25000 }}>
      <div style={{ fontFamily: FONT.hero, fontWeight: 900, fontSize: 280, letterSpacing: "-0.06em", lineHeight: 1, color: COLOR.mint,
        textShadow: `0 0 80px ${COLOR.glow}`, clipPath: `inset(${(1 - open) * 100}% 0 0 0)`, transform: `translateY(${(1 - open) * 40}px)` }}>
        Root<span style={{ color: COLOR.accent }}>.</span>
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

/** Credits, in professional lettering. */
export const Credits: React.FC<{ frame: number }> = ({ frame }) => {
  const credits = LF("credits");
  if (frame < credits.start - 4) return null;
  const l = (i: number) => ramp(frame, credits.start + i * 6, credits.start + i * 6 + 20, arrive);
  const rule = (i: number) => ramp(frame, credits.start + i * 6, credits.start + i * 6 + 26, move);
  const scrim = ramp(frame, credits.start - 4, credits.start + 20);
  return (
    <>
      <div style={{ position: "absolute", inset: 0, zIndex: 24000, opacity: scrim,
        background: "radial-gradient(ellipse 70% 45% at 50% 52%, rgba(4,11,10,0.82), rgba(4,11,10,0.45) 70%, rgba(4,11,10,0.2))" }} />
      <div style={{ position: "absolute", left: 60, right: 60, top: 600, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, zIndex: 26000 }}>
        <CreditLine t={l(0)}><div style={cap(30, COLOR.muted)}>Built by</div></CreditLine>
        <CreditLine t={l(1)}><div style={{ fontFamily: FONT.accent, fontStyle: "italic", fontSize: 150, lineHeight: 1, color: COLOR.mint, textAlign: "center" }}>Shiven</div></CreditLine>
        <CreditLine t={l(2)}><div style={cap(32, COLOR.accent)}>Group Admin</div></CreditLine>
        <div style={{ width: `${rule(3) * 56}%`, height: 2, background: "rgba(232,255,244,0.25)", margin: "16px 0" }} />
        <CreditLine t={l(4)}><div style={cap(28, COLOR.muted)}>Under his command</div></CreditLine>
        <CreditLine t={l(5)}><div style={{ fontFamily: FONT.hero, fontWeight: 800, fontSize: 66, letterSpacing: "-0.02em", color: COLOR.mint, textAlign: "center", lineHeight: 1.1 }}>Adam Buenavida</div></CreditLine>
        <CreditLine t={l(6)}><div style={{ fontFamily: FONT.hero, fontWeight: 800, fontSize: 66, letterSpacing: "-0.02em", color: COLOR.mint, textAlign: "center", lineHeight: 1.1 }}>Andreas &middot; Vihaan</div></CreditLine>
        <div style={{ width: `${rule(7) * 56}%`, height: 2, background: "rgba(232,255,244,0.25)", margin: "16px 0" }} />
        <CreditLine t={l(8)}><div style={cap(28, COLOR.muted)}>In partnership with</div></CreditLine>
        <CreditLine t={l(9)}><div style={{ fontFamily: FONT.hero, fontWeight: 800, fontSize: 76, letterSpacing: "-0.02em", color: COLOR.mint, textAlign: "center" }}>Aadam Kamraan</div></CreditLine>
      </div>
    </>
  );
};

export const LAST_FRAME = DURATION_FRAMES - 1;
