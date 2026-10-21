import React from "react";
import { Pose, project, Vec } from "../lib/camera";

type Props = {
  pose: Pose;
  at: Vec;
  /** authored size in px (100 px per world unit) */
  w: number;
  h: number;
  /** extra scale on top of perspective, for grow/shrink moves */
  grow?: number;
  /** only for elements that are not glass and hold no glass */
  filter?: string;
  opacity?: number;
  children: React.ReactNode;
};

/** Pins authored DOM to a point in the world, using the one camera. */
export const Place: React.FC<Props> = ({ pose, at, w, h, grow = 1, filter, opacity, children }) => {
  const p = project(at, pose);
  if (!p.visible || grow <= 0.001) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: w,
        height: h,
        transformOrigin: "50% 50%",
        transform: `translate(${p.x - w / 2}px, ${p.y - h / 2}px) scale(${p.scale * grow})`,
        zIndex: Math.round(10000 - p.depth * 100),
        filter,
        opacity,
      }}
    >
      {children}
    </div>
  );
};
