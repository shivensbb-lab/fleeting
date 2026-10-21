import React from "react";
import { Pose, Vec } from "../lib/camera";
import { arrive, leave, mix, move, ramp } from "../lib/ease";
import { COLOR } from "../lib/format";
import { lightLevel } from "../lib/light";
import { LF } from "../lib/time";
import { FONT } from "../fonts";
import { Place } from "./Place";

type Diff = { sign: "+" | "-"; code: string };
type File = { name: string; base: Vec; front?: Vec; diff?: Diff[] };

const FILES: File[] = [
  { name: "theme.ts", base: [-7.5, 5.2, -5], front: [0, 3.3, 6], diff: [{ sign: "-", code: "bg: '#ffffff'," }, { sign: "+", code: "bg: tokens.surface," }] },
  { name: "app.tsx", base: [7.8, 4.4, -6], front: [0, -0.4, 6.4], diff: [{ sign: "-", code: "<App />" }, { sign: "+", code: "<ThemeProvider><App />" }] },
  { name: "settings.tsx", base: [-8.2, -4.6, -6], front: [0, -4.1, 6], diff: [{ sign: "+", code: "<Toggle label='Dark' />" }, { sign: "+", code: "saveTheme(choice)" }] },
  { name: "store.ts", base: [8.6, -3.8, -8] },
  { name: "list.tsx", base: [0.5, 7.6, -9] },
  { name: "item.tsx", base: [-3.8, -6.4, -10] },
  { name: "api.ts", base: [4.4, -6.0, -11] },
  { name: "db.ts", base: [-11.5, 0.6, -12] },
  { name: "header.tsx", base: [11.8, 0.2, -12] },
  { name: "utils.ts", base: [-5.2, 9.5, -14] },
  { name: "hooks.ts", base: [6.5, 9.8, -15] },
  { name: "styles.css", base: [-12.5, -8.5, -16] },
  { name: "index.ts", base: [12.8, -9.2, -16] },
  { name: "tidepool.spec.ts", base: [-9.8, 8.4, -15] },
];

const lerpV = (a: Vec, b: Vec, t: number): Vec => [mix(a[0], b[0], t), mix(a[1], b[1], t), mix(a[2], b[2], t)];

const SMALL = { w: 560, h: 190 };
const BIG = { w: 900, h: 330 };

const DiffRow: React.FC<{ d: Diff; t: number }> = ({ d, t }) => {
  const add = d.sign === "+";
  return (
    <div style={{ height: 76, overflow: "hidden", borderRadius: 10 }}>
      <div style={{ height: 76, display: "flex", alignItems: "center", gap: 18, padding: "0 20px", fontSize: 46,
        background: add ? "rgba(217,119,87,0.16)" : "rgba(200,87,75,0.14)", color: add ? COLOR.cream : "#E59A90",
        transform: `translateX(${(1 - t) * -105}%)` }}>
        <span style={{ color: add ? COLOR.accent : COLOR.red }}>{d.sign}</span>
        <span>{d.code}</span>
      </div>
    </div>
  );
};

export const Files: React.FC<{ frame: number; pose: Pose }> = ({ frame, pose }) => {
  const read = LF("read");
  const edit = LF("edit");
  const test = LF("test");
  const ship = LF("ship");
  const lv = lightLevel(frame);
  return (
    <>
      {FILES.map((file, i) => {
        // E1: out of depth, haze and blur clearing
        const inA = read.start - 10 + i * 3;
        const enter = ramp(frame, inA, inA + 30);
        if (enter <= 0) return null;
        const scan = ramp(frame, read.start + 8 + i * 5, read.start + 22 + i * 5, move);
        let at = lerpV([file.base[0] * 1.6, file.base[1] * 1.6, file.base[2] - 45], file.base, enter);
        let size = SMALL;
        let grow = 1;
        let dim = 1;
        let opacity = enter;
        let diffT = 0;
        if (file.front) {
          // the three edited files come forward and unfold their diffs
          const fwd = ramp(frame, edit.start - 22 + i * 4, edit.start + 6 + i * 4, move);
          const into = ramp(frame, test.start - 26 + i * 3, test.start - 6 + i * 3, leave);
          at = lerpV(lerpV(at, file.front, fwd), [0, 0, -4], into);
          size = { w: mix(SMALL.w, BIG.w, fwd), h: mix(SMALL.h, BIG.h, fwd) };
          grow = mix(1, 0.12, into);
          opacity = enter * (1 - ramp(frame, test.start - 12 + i * 3, test.start - 4 + i * 3));
          diffT = fwd;
        } else {
          // the rest settle back, then condense into the commit dot
          const back = ramp(frame, edit.start - 20, edit.start + 12, move);
          const gather = ramp(frame, ship.start + 0, ship.start + 22, leave);
          at = lerpV([at[0], at[1], at[2] - 14 * back], [0, 0, 0], gather);
          grow = mix(1, 0.05, gather);
          dim = mix(1, 0.55, back);
          opacity = enter * (1 - ramp(frame, ship.start + 14, ship.start + 22));
        }
        if (opacity <= 0.001) return null;
        const blur = (1 - enter) * 16;
        const bright = dim * lv;
        return (
          <Place key={file.name} pose={pose} at={at} w={size.w} h={size.h} grow={grow} opacity={opacity}
            filter={`blur(${blur.toFixed(2)}px) brightness(${bright.toFixed(3)})`}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 22, overflow: "hidden",
              background: "linear-gradient(160deg, #2b211c, #1a1412)", border: "1px solid rgba(244,237,228,0.14)",
              boxShadow: "0 30px 80px rgba(0,0,0,0.5)", fontFamily: FONT.mono, fontWeight: 500, padding: "26px 30px" }}>
              <div style={{ fontSize: diffT > 0 ? mix(64, 52, diffT) : 64, lineHeight: 1, color: scan > 0.5 ? COLOR.cream : COLOR.muted, whiteSpace: "nowrap" }}>
                {file.name}
              </div>
              {diffT > 0 && file.diff ? (
                <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 12 }}>
                  {file.diff.map((d, k) => (
                    <DiffRow key={k} d={d} t={ramp(frame, edit.start + i * 8 + k * 6, edit.start + i * 8 + k * 6 + 16, arrive)} />
                  ))}
                </div>
              ) : (
                <div style={{ marginTop: 24, display: "flex", gap: 14 }}>
                  {[0.32, 0.18, 0.26].map((w, k) => (
                    <div key={k} style={{ height: 16, width: `${w * 100}%`, borderRadius: 8, background: k === 1 ? "rgba(217,119,87,0.45)" : "rgba(244,237,228,0.16)" }} />
                  ))}
                </div>
              )}
              {scan > 0 && scan < 1 ? (
                <div style={{ position: "absolute", left: 0, right: 0, top: `${scan * 100}%`, height: 4, background: COLOR.accent,
                  boxShadow: `0 0 24px ${COLOR.accent}` }} />
              ) : null}
            </div>
          </Place>
        );
      })}
    </>
  );
};
