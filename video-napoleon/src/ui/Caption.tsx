import React from "react";
import { arrive, ramp } from "../lib/ease";
import { C } from "../lib/style";
import { FONT } from "../fonts";

type Word = { text: string; accent: boolean };
/** "plain *accent span*" into words; the accent span can hold spaces. */
const words = (s: string): Word[] => {
  const out: Word[] = [];
  const re = /\*([^*]+)\*(\S*)|(\S+)/g;
  for (let m = re.exec(s); m; m = re.exec(s)) {
    if (m[1] !== undefined) {
      m[1].split(" ").forEach((w) => out.push({ text: w, accent: true }));
      if (m[2]) out[out.length - 1].text += m[2];
    } else out.push({ text: m[3], accent: false });
  }
  return out;
};

/** The narration as captions: each word rises out of its own mask, all in by 0.6 s. */
export const Caption: React.FC<{ f: number; text: string }> = ({ f, text }) => {
  const ws = words(text);
  return (
    <div style={{ position: "absolute", left: 70, right: 70, top: 1220, height: 270, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", fontFamily: FONT.hero, fontWeight: 800, fontSize: 66, lineHeight: 1.12, letterSpacing: "-0.02em", color: C.ink, textWrap: "balance" }}>
        {ws.map((w, i) => {
          const t = ramp(f, 2 + i * 1.5, 12 + i * 1.5, arrive);
          return (
            <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom", paddingBottom: "0.1em", marginBottom: "-0.1em", marginRight: "0.26em" }}>
              <span style={{ display: "inline-block", transform: `translateY(${(1 - t) * 110}%)`,
                ...(w.accent ? { fontFamily: FONT.accent, fontStyle: "italic", fontWeight: 400, fontSize: "1.16em", letterSpacing: 0, color: C.red } : {}) }}>
                {w.text}
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
};
