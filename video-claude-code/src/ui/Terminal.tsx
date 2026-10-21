import React from "react";
import { Pose } from "../lib/camera";
import { arrive, leave, mix, move, ramp } from "../lib/ease";
import { COLOR } from "../lib/format";
import { LF } from "../lib/time";
import { FONT } from "../fonts";
import { Check, Cross, Pointer } from "./Icons";
import { Place } from "./Place";

const TW = 1100;
const TH = 600;
const MONO = 56;
const ROW = 84;
const PROMPT = "add dark mode to tidepool";

/** The terminal's world position, scale and opacity over the whole film. */
export const terminalState = (frame: number) => {
  const edit = LF("edit");
  const test = LF("test");
  const ship = LF("ship");
  const enter = ramp(frame, 0, 54);
  const back = ramp(frame, edit.start - 22, edit.start + 8, move) * (1 - ramp(frame, test.start - 28, test.start - 2, move));
  const shrink = ramp(frame, ship.start + 2, ship.start + 20, leave);
  const z = mix(-38, 0, enter) - 10 * back;
  return {
    at: [0, 0, z] as [number, number, number],
    haze: 1 - ramp(frame, 0, 40),
    opacity: mix(0.35, 1, enter) * mix(1, 0.55, back),
    grow: mix(1, 0.03, shrink),
    gone: frame > ship.start + 20,
  };
};

/** A typed run of text: characters appear one by one from frame a, cps characters a second. */
const typed = (text: string, frame: number, a: number, perChar: number) =>
  text.slice(0, Math.max(0, Math.min(text.length, Math.floor((frame - a) / perChar))));

const Row: React.FC<{ frame: number; at: number; children: React.ReactNode; color?: string }> = ({ frame, at, children, color = COLOR.cream }) => {
  // E3: each row unfolds out of a mask
  const t = ramp(frame, at, at + 14);
  if (t <= 0) return null;
  return (
    <div style={{ height: ROW, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 22, height: ROW, color, transform: `translateY(${(1 - t) * 100}%)` }}>{children}</div>
    </div>
  );
};

const Caret: React.FC<{ frame: number; solid?: boolean }> = ({ frame, solid }) => (
  <span style={{ display: "inline-block", width: MONO * 0.58, height: MONO * 1.05, marginLeft: 6, verticalAlign: "-0.18em",
    background: COLOR.accent, opacity: solid || Math.floor(frame / 30) % 2 === 0 ? 1 : 0 }} />
);

const Body: React.FC<{ frame: number }> = ({ frame }) => {
  const hook = LF("hook");
  const read = LF("read");
  const test = LF("test");
  const quiet = LF("quiet");
  const ship = LF("ship");
  const typeStart = hook.start - 6;
  const text = typed(PROMPT, frame, typeStart, 3);
  const typing = frame < typeStart + PROMPT.length * 3 + 8;
  const phase = frame < test.start - 6 ? "work" : frame < quiet.start - 10 ? "test" : "review";

  if (phase === "work") {
    const progress = ramp(frame, read.start + 6, read.end - 6, move);
    return (
      <>
        <Row frame={frame} at={-20} color={COLOR.muted}>~/tidepool</Row>
        <Row frame={frame} at={-20}>
          <span style={{ color: COLOR.accent }}>&gt;</span>
          <span>{text}{frame < read.start ? <Caret frame={frame} solid={typing} /> : null}</span>
        </Row>
        <Row frame={frame} at={read.start - 4} color={COLOR.muted}>Reading {Math.round(progress * 14)} of 14 files</Row>
        {frame >= read.start ? (
          <div style={{ height: 14, borderRadius: 7, background: "rgba(244,237,228,0.12)", marginTop: 18, overflow: "hidden" }}>
            <div style={{ width: `${progress * 100}%`, height: "100%", background: COLOR.accent }} />
          </div>
        ) : null}
        <Row frame={frame} at={read.end + 2} color={COLOR.muted}>Editing 3 files</Row>
      </>
    );
  }

  if (phase === "test") {
    const fix = test.accent;
    const tests: { name: string; at: number }[] = [
      { name: "toggles theme", at: test.start - 2 },
      { name: "saves choice", at: test.start + 4 },
      { name: "contrast check", at: test.start + 10 },
    ];
    const passed = Math.min(13, Math.max(0, Math.floor((frame - test.start) / 4)));
    return (
      <>
        <Row frame={frame} at={test.start - 8} color={COLOR.muted}>Running 13 tests</Row>
        {tests.map((t, i) => {
          const red = i === 2 && frame < fix;
          return (
            <Row key={t.name} frame={frame} at={t.at}>
              {red ? <Cross size={52} /> : <Check size={52} draw={i === 2 ? ramp(frame, fix - 8, fix + 2) : ramp(frame, t.at + 8, t.at + 18)} />}
              <span style={{ color: red ? COLOR.red : COLOR.cream }}>{t.name}</span>
            </Row>
          );
        })}
        <Row frame={frame} at={test.start + 16} color={frame >= fix ? COLOR.green : COLOR.muted}>
          {frame >= fix ? "13 passed" : `${Math.min(12, passed)} passed, 1 failing`}
        </Row>
      </>
    );
  }

  // review: the quiet beat, then the press that ships it
  const press = ship.start - 4;
  const pointerIn = ramp(frame, quiet.accent - 10, press - 2, move);
  const pressed = ramp(frame, press, press + 6);
  return (
    <>
      <Row frame={frame} at={quiet.start - 10}>
        <Check size={52} /> <span style={{ color: COLOR.green }}>13 passed</span>
      </Row>
      <Row frame={frame} at={quiet.start - 4}>Ready for review<Caret frame={frame} /></Row>
      <div style={{ height: 40 }} />
      <Row frame={frame} at={quiet.start + 8}>
        <div style={{ position: "relative", padding: "0 40px", height: 82, display: "flex", alignItems: "center", borderRadius: 41,
          border: `3px solid ${COLOR.accent}`, background: `rgba(217,119,87,${0.08 + pressed * 0.92})`,
          color: pressed > 0.5 ? "#1a1210" : COLOR.accent, transform: `scale(${1 - 0.05 * Math.sin(pressed * Math.PI)})` }}>
          Review changes
        </div>
      </Row>
      {frame >= quiet.accent - 10 ? (
        <div style={{ position: "absolute", left: mix(980, 380, pointerIn), top: mix(640, 300, pointerIn),
          transform: `scale(${1 - 0.12 * Math.sin(pressed * Math.PI)})`, transformOrigin: "0 0" }}>
          <Pointer size={84} />
        </div>
      ) : null}
    </>
  );
};

/** The glass terminal: the one hero object that carries the story. */
export const Terminal: React.FC<{ frame: number; pose: Pose }> = ({ frame, pose }) => {
  const s = terminalState(frame);
  if (s.gone) return null;
  const hook = LF("hook");
  const ship = LF("ship");
  // specular sweep across the glass on the hook accent and just before the ship
  const sweepA = ramp(frame, hook.accent - 12, hook.accent + 24, arrive);
  const sweepB = ramp(frame, ship.start - 30, ship.start + 4, arrive);
  const sweep = frame < ship.start - 30 ? sweepA : sweepB;
  return (
    <Place pose={pose} at={s.at} w={TW} h={TH} grow={s.grow}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 30, overflow: "hidden", opacity: s.opacity,
        background: "rgba(255,255,255,0.11)", backdropFilter: "blur(30px) saturate(175%)", WebkitBackdropFilter: "blur(30px) saturate(175%)",
        border: "1px solid rgba(255,255,255,0.18)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.28), 0 50px 140px rgba(0,0,0,0.55)" }}>
        <div style={{ height: 92, display: "flex", alignItems: "center", gap: 16, padding: "0 36px", borderBottom: "1px solid rgba(255,255,255,0.10)" }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ width: 22, height: 22, borderRadius: 11, background: "rgba(244,237,228,0.22)" }} />
          ))}
          <div style={{ marginLeft: 18, fontFamily: FONT.mono, fontWeight: 500, fontSize: 40, color: COLOR.muted }}>claude</div>
        </div>
        <div style={{ position: "relative", padding: "34px 52px", fontFamily: FONT.mono, fontWeight: 500, fontSize: MONO, filter: s.haze > 0 ? `blur(${s.haze * 10}px)` : undefined }}>
          <Body frame={frame} />
        </div>
        <div style={{ position: "absolute", top: -400, bottom: -400, width: 260, left: mix(-500, TW + 300, sweep),
          transform: "rotate(18deg)", background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,245,235,0.16), rgba(255,255,255,0))" }} />
      </div>
    </Place>
  );
};
