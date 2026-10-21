import React from "react";
import { AbsoluteFill } from "remotion";
import { H, W } from "../lib/format";

/** Grain seeded by the frame and a soft vignette, once over everything. */
export const Post: React.FC<{ frame: number }> = ({ frame }) => (
  <AbsoluteFill style={{ pointerEvents: "none", zIndex: 30000 }}>
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,8,7,0) 52%, rgba(10,8,7,0.62) 72%, rgba(10,8,7,0.8) 100%)" }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 62% at 50% 40%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)" }} />
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: 0.09, mixBlendMode: "overlay" }}>
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={frame % 997} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width={W} height={H} filter="url(#grain)" />
    </svg>
  </AbsoluteFill>
);
