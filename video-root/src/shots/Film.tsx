import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { cameraPose } from "../lib/camera";
import { COLOR } from "../lib/format";
import { Words } from "../type/Words";
import { Post } from "../ui/Post";
import { Roots } from "../ui/Roots";
import { AdTag, AppCard, Credits, Noise, Wordmark } from "../ui/Scenes";
import { World } from "../world/World";

export const Film: React.FC = () => {
  const frame = useCurrentFrame();
  const pose = cameraPose(frame);
  return (
    <AbsoluteFill style={{ background: COLOR.night, overflow: "hidden" }}>
      <World />
      {/* the world in DOM: one flat container, so the glass card has no filtered ancestor */}
      <AbsoluteFill>
        <Roots frame={frame} pose={pose} />
        <Noise frame={frame} pose={pose} />
        <AppCard frame={frame} />
        <AdTag frame={frame} />
      </AbsoluteFill>
      <Post frame={frame} />
      <AbsoluteFill style={{ zIndex: 40000 }}>
        <Wordmark frame={frame} />
        <Credits frame={frame} />
        <Words frame={frame} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
