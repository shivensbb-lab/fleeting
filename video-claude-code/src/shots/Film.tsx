import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { cameraPose } from "../lib/camera";
import { COLOR } from "../lib/format";
import { Words } from "../type/Words";
import { Branch } from "../ui/Branch";
import { Files } from "../ui/Files";
import { Post } from "../ui/Post";
import { Terminal } from "../ui/Terminal";
import { Windows, Wordmark } from "../ui/Windows";
import { World } from "../world/World";

export const Film: React.FC = () => {
  const frame = useCurrentFrame();
  const pose = cameraPose(frame);
  return (
    <AbsoluteFill style={{ background: COLOR.bg, overflow: "hidden" }}>
      <World />
      {/* the DOM world: a flat container, so the glass terminal has no filtered ancestor */}
      <AbsoluteFill>
        <Files frame={frame} pose={pose} />
        <Terminal frame={frame} pose={pose} />
        <Branch frame={frame} pose={pose} />
        <Windows frame={frame} pose={pose} />
        <Wordmark frame={frame} pose={pose} />
      </AbsoluteFill>
      <Post frame={frame} />
      <AbsoluteFill style={{ zIndex: 40000 }}>
        <Words frame={frame} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
