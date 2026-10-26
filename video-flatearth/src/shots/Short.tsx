import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { C } from "../lib/style";
import { SHOT, SHOTS } from "../lib/time";
import { Caption } from "../ui/Caption";
import { SHOT_VIEWS } from "./Shots";

const ShotView: React.FC<{ id: string; text: string }> = ({ id, text }) => {
  const f = useCurrentFrame();
  const Picture = SHOT_VIEWS[id];
  return (
    <AbsoluteFill style={{ background: C.sky }}>
      <Picture f={f} />
      <Caption f={f} text={text} />
    </AbsoluteFill>
  );
};

/** Twenty hard cuts, one every 2.5 s, on the narration's beats. */
export const Short: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.sky }}>
      {SHOTS.map((s, i) => (
        <Sequence key={s.id} from={i * SHOT} durationInFrames={SHOT}>
          <ShotView id={s.id} text={s.text} />
        </Sequence>
      ))}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 0.05, mixBlendMode: "multiply", pointerEvents: "none" }}>
        <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={frame % 997} /><feColorMatrix type="saturate" values="0" /></filter>
        <rect width={1080} height={1920} filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};
