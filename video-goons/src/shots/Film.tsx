import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { cameraPose } from "../lib/camera";
import { COLOR } from "../lib/format";
import { Words } from "../type/Words";
import { Post } from "../ui/Post";
import { Credits, Crest, DAworld, Games, Noise, Players, Wordmark } from "../ui/Scenes";
import { World } from "../world/World";

export const Film: React.FC = () => {
  const frame = useCurrentFrame();
  const pose = cameraPose(frame);
  return (
    <AbsoluteFill style={{ background: COLOR.night, overflow: "hidden" }}>
      <World />
      <AbsoluteFill>
        <Crest frame={frame} pose={pose} />
        <DAworld frame={frame} pose={pose} />
        <Noise frame={frame} pose={pose} />
        <Players frame={frame} />
        <Games frame={frame} />
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
