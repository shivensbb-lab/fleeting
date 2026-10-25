import "./fonts";
import React from "react";
import { Composition } from "remotion";
import { H, W } from "./lib/style";
import { DURATION_FRAMES, FPS } from "./lib/time";
import { Short } from "./shots/Short";

export const Root: React.FC = () => (
  <Composition id="NapoleonV2" component={Short} width={W} height={H} fps={FPS} durationInFrames={DURATION_FRAMES} />
);
