import "./fonts";
import React from "react";
import { Composition } from "remotion";
import { H, W } from "./lib/format";
import { DURATION_FRAMES, FPS } from "./lib/time";
import { Film } from "./shots/Film";

export const Root: React.FC = () => (
  <Composition id="RootPromo" component={Film} width={W} height={H} fps={FPS} durationInFrames={DURATION_FRAMES} />
);
