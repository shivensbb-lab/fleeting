import React from "react";
import { AbsoluteFill, Composition, Img, registerRoot, staticFile } from "remotion";

type Props = { count: number; cols: number; every: number; cellW: number; cellH: number };

const Sheet: React.FC<Props> = ({ count, cols, every, cellW, cellH }) => (
  <AbsoluteFill style={{ background: "#111", padding: 8, display: "grid", gap: 6, alignContent: "start",
    gridTemplateColumns: `repeat(${cols}, ${cellW}px)`, gridAutoRows: `${cellH}px` }}>
    {Array.from({ length: count }, (_, i) => (
      <div key={i} style={{ position: "relative" }}>
        <Img src={staticFile(`f_${String(i + 1).padStart(3, "0")}.jpg`)} style={{ width: cellW, height: cellH, display: "block" }} />
        <span style={{ position: "absolute", left: 4, top: 4, font: "600 14px sans-serif", color: "#fff",
          background: "rgba(0,0,0,.6)", padding: "1px 4px" }}>{(i * every).toFixed(1)} s</span>
      </div>
    ))}
  </AbsoluteFill>
);

const Root: React.FC = () => (
  <Composition id="Sheet" component={Sheet} fps={1} durationInFrames={1}
    defaultProps={{ count: 1, cols: 12, every: 0.5, cellW: 160, cellH: 284 }}
    calculateMetadata={({ props }) => {
      const rows = Math.ceil(props.count / props.cols);
      return { width: 16 + props.cols * props.cellW + (props.cols - 1) * 6,
               height: 16 + rows * props.cellH + (rows - 1) * 6 };
    }} />
);

registerRoot(Root);
