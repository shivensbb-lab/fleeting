import React from "react";
import { AbsoluteFill } from "remotion";
import { H, W } from "../lib/format";
import { dusk } from "../lib/light";
import { mix } from "../lib/ease";

/** A scrim under the words, grain seeded by the frame and a soft vignette, once over everything. */
export const Post: React.FC<{ frame: number }> = ({ frame }) => {
  const d = dusk(frame);
  const scrim = `rgba(${Math.round(mix(251, 24, d))},${Math.round(mix(246, 22, d))},${Math.round(mix(239, 36, d))},`;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 30000 }}>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${scrim}0) 54%, ${scrim}0.7) 70%, ${scrim}0.9) 100%)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 80% 65% at 50% 40%, rgba(60,30,40,0) 60%, rgba(60,30,40,${mix(0.08, 0.4, d)}) 100%)` }} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: 0.045, mixBlendMode: "multiply" }}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={frame % 997} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width={W} height={H} filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};
