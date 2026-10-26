import React from "react";
import { arrive, mix, ramp } from "../lib/ease";
import { C } from "../lib/style";
import { FONT } from "../fonts";

/** Narration as bold outlined lettering (white over heavy black), snapping in on each cut. Accent words in yellow. */
export const Caption: React.FC<{ f: number; text: string }> = ({ f, text }) => {
  const parts: { t: string; accent: boolean }[] = [];
  const re = /\*([^*]+)\*|([^*]+)/g;
  for (let m = re.exec(text); m; m = re.exec(text)) parts.push(m[1] !== undefined ? { t: m[1], accent: true } : { t: m[2], accent: false });
  const s = mix(0.86, 1, ramp(f, 0, 5, arrive));
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 1290, height: 200, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${s})` }}>
      <div style={{ textAlign: "center", fontFamily: FONT.hero, fontWeight: 900, fontSize: 74, lineHeight: 1.08, letterSpacing: "-0.01em", color: C.white,
        WebkitTextStroke: `14px ${C.line}`, paintOrder: "stroke fill", textWrap: "balance" }}>
        {parts.map((p, i) => (
          <span key={i} style={p.accent ? { color: C.yellow } : undefined}>{p.t}</span>
        ))}
      </div>
    </div>
  );
};
