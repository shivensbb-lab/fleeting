import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { C } from "../lib/style";
import { SHOT, SHOTS } from "../lib/time";
import { FONT } from "../fonts";
import { Caption } from "../ui/Caption";
import { A01_1, A01_2, A02_1, A02_2, A03_1, A03_2, A04_1, A04_2, A05_1, A05_2 } from "./Shots";

const PICTURES: Record<string, React.FC<{ f: number }>> = { A01_1, A01_2, A02_1, A02_2, A03_1, A03_2, A04_1, A04_2, A05_1, A05_2 };

const ShotView: React.FC<{ id: string; text: string }> = ({ id, text }) => {
  const f = useCurrentFrame();
  const Picture = PICTURES[id];
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <Picture f={f} />
      <Caption f={f} text={text} />
    </AbsoluteFill>
  );
};

export const Short: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      {SHOTS.map((s, i) => (
        <Sequence key={s.id} from={i * SHOT} durationInFrames={SHOT}>
          <ShotView id={s.id} text={s.text} />
        </Sequence>
      ))}
      {/* the caption band sits on clean paper, under a soft rule */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1220, height: 2, background: "rgba(31,29,36,0.12)" }} />
      <div style={{ position: "absolute", left: 60, top: 236, padding: "10px 18px", borderRadius: 999, background: "rgba(255,251,243,0.9)", opacity: frame > (SHOTS.length - 1) * SHOT + 60 ? 0 : 1,
        border: `2px solid ${C.ink}`, fontFamily: FONT.mono, fontWeight: 500, fontSize: 28, letterSpacing: "0.12em", color: C.ink }}>
        UNDER 7 MINUTES
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 0.05, mixBlendMode: "multiply", pointerEvents: "none" }}>
        <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={frame % 997} /><feColorMatrix type="saturate" values="0" /></filter>
        <rect width={1080} height={1920} filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};
