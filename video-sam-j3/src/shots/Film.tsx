import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { cameraPose } from "../lib/camera";
import { COLOR } from "../lib/format";
import { Words } from "../type/Words";
import { Bar } from "../ui/Bar";
import { EndCard } from "../ui/EndCard";
import { MapCard } from "../ui/Map";
import { Post } from "../ui/Post";
import { World } from "../world/World";

export const Film: React.FC = () => {
  const frame = useCurrentFrame();
  const pose = cameraPose(frame);
  return (
    <AbsoluteFill style={{ background: COLOR.paper, overflow: "hidden" }}>
      <World />
      {/* the DOM world: a flat container, so the glass card has no filtered ancestor */}
      <AbsoluteFill>
        <MapCard frame={frame} pose={pose} />
        <Bar frame={frame} pose={pose} />
        <EndCard frame={frame} pose={pose} />
      </AbsoluteFill>
      <Post frame={frame} />
      <AbsoluteFill style={{ zIndex: 40000 }}>
        <Words frame={frame} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
