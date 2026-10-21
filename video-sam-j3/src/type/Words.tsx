import React from "react";
import { arrive, leave, mix, ramp } from "../lib/ease";
import { COLOR } from "../lib/format";
import { dusk } from "../lib/light";
import { LINES, Line, toFrame } from "../lib/time";
import { FONT } from "../fonts";

const HERO = 150;
const KICK = 64;
const EXIT = 14;
/** Lines whose accent word takes the one saturated colour. */
const HOT = new Set(["hook", "model", "place", "ab", "free", "cta"]);

type Word = { text: string; accent: boolean; glue?: boolean };
/** Splits "plain *accent words*tail" into words; the accent span may hold spaces and stays one unit. */
const words = (s: string): Word[] => {
  const out: Word[] = [];
  const re = /\*([^*]+)\*(\S*)|(\S+)/g;
  for (let m = re.exec(s); m; m = re.exec(s)) {
    if (m[1] !== undefined) {
      out.push({ text: m[1], accent: true });
      if (m[2]) out.push({ text: m[2], accent: false, glue: true });
    } else {
      out.push({ text: m[3], accent: false });
    }
  }
  return out;
};

/** E3: a word rises out of its own mask; it leaves upward through the same mask. */
const Masked: React.FC<{ t: number; out: number; children: React.ReactNode; gap?: boolean }> = ({ t, out, children, gap = true }) => (
  <span style={{ display: "inline-block", overflow: "hidden", paddingBottom: "0.12em", marginBottom: "-0.12em", marginRight: gap ? "0.24em" : 0 }}>
    <span style={{ display: "inline-block", transform: `translateY(${((1 - t) + out) * 110 * (out > 0 ? -1 : 1)}%)` }}>{children}</span>
  </span>
);

const LineView: React.FC<{ line: Line; frame: number; last: boolean }> = ({ line, frame, last }) => {
  const start = toFrame(line.start);
  const end = toFrame(line.end);
  const accent = toFrame(line.accent);
  if (frame < start - 1 || (!last && frame > end + EXIT)) return null;
  const out = last ? 0 : ramp(frame, end, end + EXIT, leave);
  const kicker = line.kicker ? line.kicker.split(" ") : [];
  const hero = words(line.hero);
  const heroStart = start + (kicker.length ? 6 : 0);
  const night = dusk(start + 10) > 0.5;
  return (
    <div style={{ position: "absolute", left: 72, right: 72, bottom: 440, display: "flex", flexDirection: "column", gap: 14,
      textShadow: `0 2px 30px rgba(${night ? "20,18,32,0.55" : "251,246,239,0.9"})` }}>
      {kicker.length ? (
        <div style={{ fontFamily: FONT.hero, fontWeight: 800, fontSize: KICK, letterSpacing: "-0.02em", lineHeight: 1.08, color: night ? "rgba(251,246,239,0.8)" : "rgba(30,27,46,0.68)" }}>
          {kicker.map((w, i) => (
            <Masked key={i} t={ramp(frame, start + i * 3, start + i * 3 + 16)} out={out}>{w}</Masked>
          ))}
        </div>
      ) : null}
      <div style={{ fontFamily: FONT.hero, fontWeight: 900, fontSize: HERO, letterSpacing: "-0.04em", lineHeight: 0.95, color: night ? COLOR.paper : COLOR.ink }}>
        {hero.map((w, i) => {
          const glued = i + 1 < hero.length && hero[i + 1].glue === true;
          if (!w.accent) {
            return (
              <Masked key={i} t={ramp(frame, heroStart + i * 3, heroStart + i * 3 + 16)} out={out} gap={!glued}>{w.text}</Masked>
            );
          }
          // E1: the accent word flies in out of depth and lands on its beat
          const a = ramp(frame, accent - 16, accent, arrive);
          const gone = out;
          return (
            <span key={i} style={{ display: "inline-block", marginRight: glued ? 0 : "0.24em", fontFamily: FONT.accent, fontStyle: "italic", fontWeight: 400,
              fontSize: HERO * 1.12, letterSpacing: "-0.01em", color: HOT.has(line.id) ? COLOR.accent : night ? "#F3B7CC" : COLOR.ink,
              opacity: a * (1 - gone), filter: a < 1 || gone > 0 ? `blur(${((1 - a) * 14 + gone * 10).toFixed(2)}px)` : undefined,
              transform: `translateY(${mix(-30, 0, a) - gone * 60}px) scale(${mix(1.45, 1, a)})`, transformOrigin: "50% 70%" }}>
              {w.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export const Words: React.FC<{ frame: number }> = ({ frame }) => (
  <>
    {LINES.map((line, i) => (
      <LineView key={line.id} line={line} frame={frame} last={i === LINES.length - 1} />
    ))}
  </>
);
