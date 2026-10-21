import React from "react";
import { J3, Pose, Vec } from "../lib/camera";
import { arrive, leave, mix, move, ramp } from "../lib/ease";
import { COLOR } from "../lib/format";
import { hash } from "../lib/noise";
import { LF } from "../lib/time";
import { FONT } from "../fonts";
import { Place } from "./Place";

const UNIT = 1.1; // block size in world units
const GAP = 0.16;
const BAR_Y = 0.6;
const CARD = { w: 1000, h: 680 };

const blockX = (i: number, gap: number) => (i - 3) * (UNIT + gap);

/** Small blocks: 180 of them, 15 x 12. */
const COLS = 15;
const ROWS = 12;
const CELL = 0.6;
const GRID_Y = -0.9;
const N = COLS * ROWS;
const cellPos = (k: number): Vec => {
  const col = k % COLS;
  const row = Math.floor(k / COLS);
  return [(col - (COLS - 1) / 2) * CELL, GRID_Y + ((ROWS - 1) / 2 - row) * CELL, 0];
};
const lerp = (a: Vec, b: Vec, t: number): Vec => [mix(a[0], b[0], t), mix(a[1], b[1], t), mix(a[2], b[2], t)];

/** Where the pin is born: the stream of blocks gathers here, above J3 Mall. */
export const PIN_BIRTH: Vec = [J3[0], J3[1] + 1.6, 0];

const Brace: React.FC<{ x0: number; x1: number; y: number; up: boolean; draw: number }> = ({ x0, x1, y, up, draw }) => {
  const d = up ? -1 : 1;
  const m = (x0 + x1) / 2;
  const path = `M${x0} ${y} q0 ${14 * d} 16 ${14 * d} L${m - 16} ${y + 14 * d} q16 0 16 ${14 * d} q0 ${-14 * d} 16 ${-14 * d} L${x1 - 16} ${y + 14 * d} q16 0 16 ${-14 * d}`;
  return <path d={path} fill="none" stroke={COLOR.ink} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} opacity={0.75} />;
};

export const Bar: React.FC<{ frame: number; pose: Pose }> = ({ frame, pose }) => {
  const hook = LF("hook");
  const model = LF("model");
  const count = LF("count");
  const place = LF("place");
  if (frame > place.start + 30) return null;

  const enter = ramp(frame, 0, 46);
  const split = ramp(frame, hook.accent - 10, hook.accent, arrive);
  const gap = GAP * split;
  const toInk = ramp(frame, model.start, model.start + 24, move);
  const emitted = ramp(frame, count.start - 10, count.start + 12, leave);

  // the glass card: an E3 mask that opens from the centre, closes before the crowd
  const cardOpen = ramp(frame, model.start - 14, model.start + 12, arrive) * (1 - ramp(frame, count.start - 18, count.start - 2, leave));
  const cw = CARD.w;
  const cx = (x: number) => cw / 2 + x * 100;
  const cy = (y: number) => CARD.h / 2 - y * 100;
  const barL = cx(blockX(0, GAP) - UNIT / 2);
  const barR = cx(blockX(6, GAP) + UNIT / 2);
  const split3 = cx(blockX(2, GAP) + UNIT / 2 + GAP / 2);
  const draw = (a: number) => ramp(frame, a, a + 16, move);
  const solved = frame >= model.accent - 2;

  // the counter
  const arrivedAt = (k: number) => count.start - 8 + Math.floor(k * 0.33) + 20;
  let arrived = 0;
  for (let k = 0; k < N; k++) if (frame >= arrivedAt(k)) arrived++;
  const counterIn = ramp(frame, count.start - 4, count.start + 12);
  const counterOut = ramp(frame, place.start - 10, place.start + 4, leave);
  const plus = ramp(frame, count.accent - 14, count.accent, arrive);

  return (
    <>
      {cardOpen > 0 ? (
        <Place pose={pose} at={[0, 0, -0.02]} w={CARD.w} h={CARD.h}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 36, clipPath: `inset(${(1 - cardOpen) * 50}% 0 ${(1 - cardOpen) * 50}% 0 round 36px)`,
            background: "rgba(255,255,255,0.46)", backdropFilter: "blur(26px) saturate(170%)", WebkitBackdropFilter: "blur(26px) saturate(170%)",
            border: "1px solid rgba(255,255,255,0.8)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9), 0 40px 120px rgba(80,40,30,0.18)" }}>
            <svg width={CARD.w} height={CARD.h} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
              <Brace x0={barL} x1={barR} y={cy(BAR_Y + UNIT / 2) - 18} up draw={draw(model.start + 10)} />
              <Brace x0={barL} x1={split3 - 6} y={cy(BAR_Y - UNIT / 2) + 18} up={false} draw={draw(model.start + 18)} />
              <Brace x0={split3 + 6} x1={barR} y={cy(BAR_Y - UNIT / 2) + 18} up={false} draw={draw(model.start + 24)} />
            </svg>
            {[
              { x: (barL + barR) / 2, y: cy(BAR_Y + UNIT / 2) - 92, text: solved ? "7" : "?", at: model.start + 18, hot: solved },
              { x: (barL + split3) / 2, y: cy(BAR_Y - UNIT / 2) + 82, text: "3", at: model.start + 26, hot: false },
              { x: (split3 + barR) / 2, y: cy(BAR_Y - UNIT / 2) + 82, text: "4", at: model.start + 32, hot: false },
            ].map((l, i) => {
              const t = ramp(frame, l.at, l.at + 14);
              const pop = i === 0 ? 1 + 0.18 * Math.sin(ramp(frame, model.accent - 2, model.accent + 10) * Math.PI) : 1;
              return (
                <div key={i} style={{ position: "absolute", left: l.x - 80, top: l.y - 50, width: 160, height: 100, overflow: "hidden", textAlign: "center",
                  fontFamily: FONT.hero, fontWeight: 900, fontSize: 84, lineHeight: "100px", color: l.hot ? COLOR.accent : COLOR.ink }}>
                  <div style={{ transform: `translateY(${(1 - t) * 100}%) scale(${pop})` }}>{l.text}</div>
                </div>
              );
            })}
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 52, textAlign: "center", fontFamily: FONT.mono, fontWeight: 500, fontSize: 56,
              color: COLOR.ink, opacity: ramp(frame, model.start + 30, model.start + 44) }}>
              3 + 4 = <span style={{ color: COLOR.accent, opacity: solved ? 1 : 0.25 }}>{solved ? "7" : "?"}</span>
            </div>
          </div>
        </Place>
      ) : null}

      {emitted < 1
        ? Array.from({ length: 7 }, (_, i) => {
            // E1: the bar flies in out of depth; it splits into 7 on the accent
            const at: Vec = [blockX(i, gap), BAR_Y, mix(-10, 0, enter)];
            const color = i < 3 ? COLOR.accent : `color-mix(in srgb, ${COLOR.ink} ${toInk * 100}%, ${COLOR.accent})`;
            return (
              <Place key={i} pose={pose} at={[at[0], at[1], at[2] + 0.01]} w={UNIT * 100 + 1} h={UNIT * 100} grow={1 - emitted}
                filter={enter < 1 ? `blur(${((1 - enter) * 8).toFixed(2)}px)` : undefined} opacity={mix(0.85, 1, enter)}>
                <div style={{ position: "absolute", inset: 0, borderRadius: 6 + 16 * split, background: color,
                  boxShadow: `inset 0 2px 0 rgba(255,255,255,0.35), inset 0 -6px 0 rgba(0,0,0,0.14), 0 ${10 + 14 * split}px ${30 * split}px rgba(120,20,60,${0.25 * split})` }} />
              </Place>
            );
          })
        : null}

      {frame >= count.start - 8
        ? Array.from({ length: N }, (_, k) => {
            // E2: each small block is emitted by one of the seven, flies to its cell, then streams into the pin
            const a = count.start - 8 + Math.floor(k * 0.33);
            const t = ramp(frame, a, a + 20, arrive);
            if (t <= 0) return null;
            const parent = k % 7;
            const from: Vec = [blockX(parent, GAP), BAR_Y, 0];
            const cell = cellPos(k);
            const sA = place.start - 18 + Math.floor((N - k) * 0.12);
            const s = ramp(frame, sA, sA + 20, move);
            if (s >= 1) return null;
            let at = lerp(from, cell, t);
            at = [at[0], at[1], at[2] + Math.sin(t * Math.PI) * 3];
            at = lerp(at, PIN_BIRTH, s);
            const r = hash(k * 31 + 7);
            const color = r < 0.24 ? COLOR.accent : r < 0.36 ? COLOR.ink : COLOR.white;
            return (
              <Place key={k} pose={pose} at={at} w={46} h={46} grow={mix(0.35, 1, t) * mix(1, 0.2, s)}>
                <div style={{ position: "absolute", inset: 0, borderRadius: 9, background: color,
                  border: color === COLOR.white ? "1px solid rgba(30,27,46,0.12)" : undefined, boxShadow: "0 6px 14px rgba(80,40,30,0.18)" }} />
              </Place>
            );
          })
        : null}

      {counterIn > 0 && counterOut < 1 ? (
        <Place pose={pose} at={[0, 4.4, 0]} w={800} h={280}>
          <div style={{ position: "absolute", inset: 0, overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "center",
            fontFamily: FONT.hero, fontWeight: 900, fontSize: 250, letterSpacing: "-0.05em", color: COLOR.ink }}>
            <div style={{ display: "flex", alignItems: "center", transform: `translateY(${((1 - counterIn) + counterOut) * 100 * (counterOut > 0 ? -1 : 1)}%)` }}>
              <span>{arrived}</span>
              <span style={{ color: COLOR.accent, display: "inline-block", opacity: plus, filter: plus < 1 ? `blur(${((1 - plus) * 12).toFixed(2)}px)` : undefined,
                transform: `scale(${mix(1.6, 1, plus)})`, marginLeft: 6 }}>+</span>
            </div>
          </div>
        </Place>
      ) : null}
    </>
  );
};
