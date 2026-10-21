import React from "react";
import { MERGE, Pose, Vec } from "../lib/camera";
import { arrive, leave, mix, ramp } from "../lib/ease";
import { COLOR } from "../lib/format";
import { DURATION_FRAMES, LF } from "../lib/time";
import { FONT } from "../fonts";
import { Place } from "./Place";

const WW = 480;
const WH = 340;

const Bar: React.FC<{ w: string; c?: string; h?: number }> = ({ w, c = "rgba(244,237,228,0.16)", h = 14 }) => (
  <div style={{ width: w, height: h, borderRadius: h / 2, background: c }} />
);

const Content: Record<string, React.FC<{ frame: number }>> = {
  Terminal: ({ frame }) => (
    <div style={{ fontFamily: FONT.mono, fontSize: 44, color: COLOR.cream, display: "flex", flexDirection: "column", gap: 16 }}>
      <div><span style={{ color: COLOR.accent }}>&gt;</span> claude</div>
      <Bar w="70%" />
      <Bar w="52%" />
      <div style={{ width: 24, height: 40, background: COLOR.accent, opacity: Math.floor(frame / 30) % 2 === 0 ? 1 : 0 }} />
    </div>
  ),
  IDE: () => (
    <div style={{ display: "flex", gap: 16, height: "100%" }}>
      <div style={{ width: 70, display: "flex", flexDirection: "column", gap: 12 }}>
        <Bar w="100%" /><Bar w="80%" /><Bar w="90%" /><Bar w="60%" />
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
        <Bar w="80%" /><Bar w="60%" c="rgba(217,119,87,0.5)" /><Bar w="72%" /><Bar w="44%" /><Bar w="66%" />
      </div>
      <div style={{ width: 120, borderRadius: 12, background: "rgba(217,119,87,0.14)", border: "1px solid rgba(217,119,87,0.4)" }} />
    </div>
  ),
  Desktop: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ alignSelf: "flex-end", width: "62%", height: 48, borderRadius: 24, background: "rgba(244,237,228,0.16)" }} />
      <div style={{ width: "78%", height: 74, borderRadius: 24, background: "rgba(217,119,87,0.22)" }} />
      <div style={{ alignSelf: "flex-end", width: "44%", height: 48, borderRadius: 24, background: "rgba(244,237,228,0.16)" }} />
    </div>
  ),
  Web: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ height: 58, borderRadius: 29, background: "rgba(244,237,228,0.10)", display: "flex", alignItems: "center", padding: "0 22px",
        fontFamily: FONT.mono, fontSize: 40, color: COLOR.cream }}>claude.ai/code</div>
      <Bar w="76%" /><Bar w="58%" c="rgba(217,119,87,0.5)" /><Bar w="68%" />
    </div>
  ),
};

const WINDOWS: { name: string; off: [number, number] }[] = [
  { name: "Terminal", off: [-2.55, 1.9] },
  { name: "IDE", off: [2.55, 1.9] },
  { name: "Desktop", off: [-2.55, -1.9] },
  { name: "Web", off: [2.55, -1.9] },
];

export const Windows: React.FC<{ frame: number; pose: Pose }> = ({ frame, pose }) => {
  const where = LF("where");
  const cta = LF("cta");
  if (frame < where.start - 8 || frame > cta.start + 8) return null;
  return (
    <>
      {WINDOWS.map((win, i) => {
        // E2: unfold out of the merge dot, then fold back into the wordmark
        const out = ramp(frame, where.start - 8 + i * 4, where.start + 18 + i * 4, arrive);
        const fold = ramp(frame, cta.start - 26 + i * 2, cta.start - 2, leave);
        const t = out * (1 - fold);
        if (t <= 0.01) return null;
        const at: Vec = [MERGE[0] + win.off[0] * t, MERGE[1] + win.off[1] * t, 0];
        const Body = Content[win.name];
        return (
          <Place key={win.name} pose={pose} at={at} w={WW} h={WH} grow={mix(0.05, 1, t)}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 24, overflow: "hidden", background: "linear-gradient(160deg, #2e2420, #191311)",
              border: "1px solid rgba(244,237,228,0.16)", boxShadow: "0 30px 90px rgba(0,0,0,0.55)" }}>
              <div style={{ height: 76, display: "flex", alignItems: "center", gap: 12, padding: "0 24px", borderBottom: "1px solid rgba(244,237,228,0.1)" }}>
                {[0, 1, 2].map((k) => (
                  <div key={k} style={{ width: 16, height: 16, borderRadius: 8, background: "rgba(244,237,228,0.22)" }} />
                ))}
                <div style={{ marginLeft: 10, fontFamily: FONT.mono, fontWeight: 500, fontSize: 46, color: COLOR.cream }}>{win.name}</div>
              </div>
              <div style={{ padding: 26, height: WH - 76 }}>
                <Body frame={frame} />
              </div>
            </div>
          </Place>
        );
      })}
    </>
  );
};

export const Wordmark: React.FC<{ frame: number; pose: Pose }> = ({ frame, pose }) => {
  const cta = LF("cta");
  if (frame < cta.start - 4) return null;
  // E3: a mask opens from the centre where the windows folded
  const open = ramp(frame, cta.start - 4, cta.start + 24, arrive);
  const inset = (1 - open) * 50;
  const caretOn = frame > DURATION_FRAMES - 45 || Math.floor(frame / 30) % 2 === 0;
  return (
    <Place pose={pose} at={MERGE} w={1100} h={260}>
      <div style={{ position: "absolute", left: -250, right: -250, top: -260, bottom: -260, opacity: open,
        background: "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(217,119,87,0.20), rgba(217,119,87,0) 70%)" }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
        clipPath: `inset(0 ${inset}% 0 ${inset}%)` }}>
        <div style={{ fontFamily: FONT.hero, fontWeight: 900, fontSize: 158, letterSpacing: "-0.04em", color: COLOR.cream, whiteSpace: "nowrap",
          textShadow: "0 20px 80px rgba(0,0,0,0.45)" }}>
          Claude Code
        </div>
        <div style={{ width: 58, height: 128, marginLeft: 20, background: COLOR.accent, opacity: caretOn ? 1 : 0,
          boxShadow: `0 0 50px rgba(217,119,87,0.6)` }} />
      </div>
    </Place>
  );
};
