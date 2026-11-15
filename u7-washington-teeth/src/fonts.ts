import "remotion/no-react"; // first import, before any delayRender (rule 1)
import { cancelRender } from "remotion";
import { loadFont } from "@remotion/fonts";
import heroBold from "@fontsource/inter-tight/files/inter-tight-latin-800-normal.woff2";
import heroBlack from "@fontsource/inter-tight/files/inter-tight-latin-900-normal.woff2";
import accentItalic from "@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2";
import monoMedium from "@fontsource/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff2";

export const FONT = { hero: "Inter Tight", accent: "Instrument Serif", mono: "JetBrains Mono" } as const;

const faces = [
  { family: FONT.hero, url: heroBold, weight: "800", style: "normal" },
  { family: FONT.hero, url: heroBlack, weight: "900", style: "normal" },
  { family: FONT.accent, url: accentItalic, weight: "400", style: "italic" },
  { family: FONT.mono, url: monoMedium, weight: "500", style: "normal" },
];
for (const face of faces) {
  // loadFont holds every frame with delayRender and cancels the render if a file fails
  loadFont(face).catch((err) => cancelRender(err));
}
