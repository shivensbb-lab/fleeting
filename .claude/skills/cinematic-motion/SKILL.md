---
name: cinematic-motion
description: Turn a plain-language description into a studio-grade motion video made in code with Remotion, React and three.js (3D camera moves, kinetic typography, glass UI, light), with music and sound effects from audio files the user owns, rendered to MP4 in 9:16 and/or 16:9. Use when the user asks for a motion design video, an animated ad, a product launch film, an intro, a promo, an explainer or "a video like this", or wants to change, fix or re-render a video made with this skill.
---

# Cinematic motion

You are the director, motion designer and Remotion engineer at once. The user describes the video in
plain words; you plan it, build it, check it frame by frame and render it. The user is not a
programmer: never ask them to run a command, edit a file or pick between technical options. Decide,
and say in one line what you chose.

This file is a method, not a toolchain. You write the video's own source (scenes, data, styles) and
run only the stock Remotion commands written below: `remotion still`, `remotion render` and the
ffmpeg and ffprobe that ship with Remotion.

Quality bar: every frame survives as a still ad. Reject your own work when it looks like a template,
a keynote slide, a wireframe or a Remotion demo.

## 0. Ground rules

- Work only inside the current folder. Never delete or overwrite a file you did not make with this
  skill. A video project folder made with this skill (`video-<short-name>`, with its `docs/BRIEF.md`)
  is yours to change on a later run, as Step 11 describes; everything else that was there before
  stays untouched. Your own scratch (`.renders/`) and deliverables (`out/`) are yours to replace.
- No symbolic links. Before you create, write or empty anything, check its path: it must resolve
  inside the current folder and no part of it may be a symbolic link. If one is, stop and ask the
  user. Create `.renders/` and `out/` yourself as plain folders. Empty a folder by deleting the
  files you made in it, one by one, never with a recursive delete that could follow a link.
- Names in paths and commands. Every name you pick that goes into a file path or a command is
  checked against its pattern before its first use; a name that does not match is replaced by
  another name, never escaped or trimmed:
  - folder and short names (`<short-name>`, `<name>`), line ids, cue ids, audio file names (before
    the extension) and scene names (`<scene>`): `^[a-z0-9][a-z0-9-]{0,39}$`;
  - composition ids (`<Comp>`): `^[A-Za-z][A-Za-z0-9]{0,39}$`;
  - frame numbers (`<frame>`, `<a>`, `<b>`, `<frames>`): whole numbers matching `^\d{1,7}$`;
  - loudness values (`<input_i>` and the others from Step 9): copied from the JSON ffmpeg printed,
    each matching `^-?\d{1,3}(\.\d{1,2})?$`; anything else (`-inf`, text) means stop and fix the mix.
- Never build a command from free text. The user's words, the names of files they give you and
  anything read from a file go into JSON or source files, never onto a command line. Copy a file the
  user gives you into `public/` under a name you choose that matches the first pattern, plus a
  lowercase extension matching `^\.[a-z0-9]{1,5}$`. Run each command below one at a time, exactly
  as written, with only its placeholders filled in, and put every placeholder that holds a name in
  single quotes, as the commands do.
- Write no scripts that start programs: no Node or Python helpers, no `scripts` in package.json,
  nothing with `shell: true`, `exec` or a command string. Besides the commands in this file, run
  only read-only checks (a version, a hash, a file listing, free memory) and plain folder and file
  operations inside the project.
- Install only from the pinned kit (section 1). Never `npm install`, `npm update`, a global install,
  `npx` of anything that is not already in `node_modules`, or `sudo`. Before each install or
  download, tell the user in one line what it is and wait for their OK.
- Beyond the kit and the checked render browser (section 1), download nothing: no fonts, music,
  sound effects, images or models from the web. Fonts come from the kit; audio, logos and images
  come only from the user.
- Deterministic: every frame is a pure function of the frame number. No `Math.random`, `Date`,
  timers, `useFrame` or `THREE.Clock` for animation, no live network data. Seeded noise only.
- No real brand logos (Adobe, Apple, Instagram and so on) unless the user gives you their own logo
  for their own brand. Mock content uses fictional brands.
- Judge real rendered frames (PNG stills, frames decoded from the MP4), never browser or Studio
  screenshots.

## 1. The kit

These files sit next to this SKILL.md. Check every hash before you use a file; on a mismatch stop and
tell the user.

| file | SHA-256 |
|---|---|
| package.json | 5b765ec5b9ce033a1bf7f4bc925ea6dc00e55bb590ca79c380f84d0d29e3d66b |
| package-lock.json | a92264f8a7777bb6fe465756af9abe03aec285942af7dd00f1d51f3eba7fa25f |

If one is missing, download it byte for byte from
`https://blog.alekseimedia.com/assets/kits/glass-skill/<file>` and check the hash.

It pins Remotion 4.0.534 (`remotion`, `@remotion/cli`, `three`, `fonts`, `motion-blur`), three
0.186.1, @react-three/fiber 9.8.1, React 19.3.0, TypeScript 5.9.3 and their types, and the three
typefaces of the design bible as font files: `@fontsource/inter-tight`, `@fontsource/instrument-serif`
and `@fontsource/jetbrains-mono` 5.3.0 (SIL Open Font License). The lock pins every package by its
integrity hash, so the install in step 3 checks every file it installs, the fonts included.

New video project:
1. Node.js 20 or newer (`node --version`). If it is missing, ask the user to install Node.js LTS from
   nodejs.org with its normal installer, then wait.
2. Make a folder for the video inside the current folder, `video-<short-name>`, with a short name
   that matches its pattern (ground rules); if the name is taken, pick another.
3. Copy `package.json` and `package-lock.json` from this skill folder into it, check both hashes, run
   `npm ci --ignore-scripts`. Never add, update or remove a package: build what you need from the kit.
4. The render browser, Chrome Headless Shell 157.0.8080.0, the version Remotion 4.0.534 is tested
   with. Left alone, Remotion downloads it on the first still or render without checking it, so
   never let it: fetch the zip for this computer yourself, check it and point Remotion at it, once
   per video project. Nothing else is fetched while rendering: the fonts are files inside the
   installed packages.
   - Pick the row: macOS on Apple silicon (`uname -m` prints `arm64`), macOS on Intel (`x86_64`),
     Windows on x64, or Linux on x64 with glibc 2.35 or newer (`ldd --version`). Any other system
     is not supported: say so and stop.

| system | zip | bytes | SHA-256 | browser file |
|---|---|---|---|---|
| macOS arm64 | `https://remotion.media/chromium-headless-shell-mac-arm64-157.0.8080.0.zip` | 179230663 | `3d9fd9a997915fa295ba6fbd66b2eaad2b9578101aa9dcde5e2eb737afa4f459` | `chrome-headless-shell-mac-arm64/chrome-headless-shell` |
| macOS x64 | `https://storage.googleapis.com/chrome-for-testing-public/157.0.8080.0/mac-x64/chrome-headless-shell-mac-x64.zip` | 109113968 | `b4a3f7e8aed11e7814fdaf49ddadab0ec3e0c7527f0ffeed5b208d7a856ebf6a` | `chrome-headless-shell-mac-x64/chrome-headless-shell` |
| Windows x64 | `https://storage.googleapis.com/chrome-for-testing-public/157.0.8080.0/win64/chrome-headless-shell-win64.zip` | 125915690 | `ad0fe78fbe0783035fd71f81cd876a2e81962a40ac7de6b4f7afcbeb00901c11` | `chrome-headless-shell-win64/chrome-headless-shell.exe` |
| Linux x64 | `https://remotion.media/chromium-headless-shell-linux-x64-157.0.8080.0.zip` | 103668996 | `7c4a2751b361aeb3cff3ed788fa18b7a0849371b983d478bb9205b6cc25a8c52` | `chrome-headless-shell-linux64/chrome-headless-shell` |

   - Tell the user it is a 100 to 180 MB download and wait for their OK. Make a new folder
     `.browser-download/` in the video folder (if it exists or any part of its path is a symbolic
     link, stop and ask) and save the zip byte for byte into it:
     `curl -fL --proto '=https' -o '.browser-download/chrome.zip' '<zip>'` (on Windows `curl.exe`,
     which ships with Windows 10 and 11), with `<zip>` copied exactly from the row.
   - Check its size and SHA-256 against the row. On any mismatch delete `chrome.zip` and the folder,
     use nothing and stop.
   - Only when both match, extract it from inside `.browser-download/` with the system's own tool:
     `unzip -q chrome.zip` on Linux (if `unzip` is missing, ask the user to install it),
     `ditto -x -k chrome.zip .` on macOS, and on Windows the tar that ships with Windows,
     `C:\Windows\System32\tar.exe -xf chrome.zip` (the `tar` of Git Bash cannot read zip files).
     Then delete `chrome.zip`, check that the row's browser file is a regular file and that no part
     of its path is a symbolic link, then rename `.browser-download/` to `.browser/` in one step
     (if `.browser/` exists, stop and ask).
   - Point `remotion.config.ts` at it (Step 5): `Config.setBrowserExecutable(".browser/<browser file>")`.
     With that set, Remotion starts this file and downloads nothing. If a command ever prints that it
     is downloading a browser, the path is wrong: fix it before you render anything else.
5. ffmpeg and ffprobe: only the copies bundled with Remotion, `npx --no-install remotion ffmpeg ...`
   and `npx --no-install remotion ffprobe ...`. That build has no `tile`, `fps` or `drawtext` filter;
   every command below uses only what it has. Every ffmpeg command below that writes a file writes
   only this project's own `.renders/` or `out/` files and starts with `-y`, so a re-render replaces
   them: without it ffmpeg refuses an existing file and still exits 0. ffmpeg never creates
   folders, so make the output folder first, and after each command check that the output exists
   and is new.

## 2. Workflow

Do the steps in order. Never skip one: each step is cheaper than the mistakes it catches.

### Step 1. Brief

Ask once, in one short message, only what you cannot decide: what the video is for and who watches
it; length (default 20 to 30 s); format (9:16 1080x1920 for Reels/TikTok/Shorts, 16:9 1920x1080 for
screens, or both); the words on screen (or you write them); the call to action; brand colour and
logo files; references (screenshots or links); music and sound effects as audio files they own or
have a license for, and the music's tempo if they know it. Decide the rest. Write `docs/BRIEF.md`.

This skill makes no voiceover and no sound of its own: the film runs on words on screen, picture,
and the user's audio. If the user asks for a voice, say so in one line and go on without one.

English only: the fonts module loads only their `latin` files. Every character on screen must be
printable Latin, U+0020 to U+007E or U+00A0 to U+00FF except U+00AD, or one of U+2013, U+2014
(dashes), U+2018, U+2019, U+201C, U+201D (curly quotes), U+2026 (the ellipsis) and U+20AC (the
euro sign); no control, zero-width or direction characters. Check the timeline's text against
that before the first still. If the user wants another language or script,
say that this skill does English only and stop, rather than render on a fallback font.

If you write the words: one idea per line, 3 to 8 words, one accent word per line.

### Step 2. Master clock

One file times the whole film, `src/data/timeline.json`:

```json
{ "fps": 60, "duration": 24.0, "bpm": 120,
  "lines": [ { "id": "hook", "text": "What if one file could do this?", "start": 0.3, "end": 2.4,
               "accent": 1.1 } ] }
```

- Time lines by reading speed (about 3 words per second, at least 1.2 s a line, 0.3 to 0.5 s of air
  between lines) and snap line starts to the beat (60 / bpm seconds). Without a known tempo, use
  reading speed alone and leave `bpm` out.
- `src/lib/time.ts` exposes `FPS`, `L(id)` (the line), `F(n)` (n frames in seconds), `toFrame(s)`
  and `useTime()`. Scenes never hard-code seconds or frames: `L("cta").start + F(6)`,
  `L("hook").accent`. A new pace rewrites timeline.json and the whole film re-times itself.
- A new visual on every line start. The accent word's visual hit lands on its time, within 2 frames.
- Sound cues live in `src/data/cues.json`: `{ "id": "whoosh-1", "file": "whoosh.wav", "t": 3.42,
  "syncAt": 0.31, "gainDb": -6 }`. `t` is the film time of the sync point in seconds, computed from
  the timeline; `syncAt` is where that sync point sits inside the file, in seconds from its start
  (Step 8); `file` is one of the audio files in `public/audio/`. Scenes time every motion that has
  a sound from the same `t`, so picture and sound cannot drift.
- Convert to frames once, then work in integers: a window that ends between two frames leaves a
  one-frame gap where a layer vanishes.

### Step 3. Storyboard: one canonical shot plan

`docs/STORYBOARD.md` is the single plan every scene is built from. If you try alternatives, merge
the winner into this file; scenes follow this file and nothing else. It holds:

- an act table: lines, frames, place, hero, colour, music;
- the object chain: how each hero becomes the next (a card falls into a screen, the screen's light
  becomes the flash). Transitions are objects and camera moves, not crossfades;
- per line: time and frames, ONE hero, each element's entrance, timing and exit, the camera move,
  the exact on-screen text, the transition, the sound cue;
- one camera key list per act, as one continuous path;
- motion-blur windows (fast moves only);
- a pop-in audit: every element and its entrance type;
- a "done when" list per line and the verification frames (every line start, accent and
  transition).

What makes it read as expensive, so plan for it: a place, not a background (sky, light, depth,
parallax layers); real 3D objects lit by one light; motion from frame 0; a designed type pairing;
UI that is operated (a cursor, typing, a press), not just shown; one contrast beat (a dark or silent
moment) that breaks the rhythm; a recurring object or character that carries the story; a cut on the
beat; a motivated arrival for every element; a sound under every move the user's effects can cover.

Show the user a short version (a table: time, what is on screen, which sound) and ask for an OK or
changes. This is the cheapest moment for changes.

### Step 4. Design bible

`docs/BIBLE.md` is the contract every scene codes against:

- Formats. 9:16 1080x1920, text safe zone x 60 to 1020, y 220 to 1480 (platform UI covers the
  rest). 16:9 1920x1080, safe zone x 110 to 1810, y 80 to 1000. Both come from the same scenes,
  timeline and audio, recomposed with `pick(format, portraitValue, landscapeValue)`, never cropped:
  portrait stacks hero and type in opposite bands, landscape puts type left and the hero right of
  centre.
- Type. A heavy grotesque for hero words (Inter Tight 800 to 900, tracking -0.04em), an italic serif
  for the one accent word of a line (Instrument Serif Italic), a mono for UI (JetBrains Mono 500),
  all from the kit. Nothing meant to be read under 34 px in 9:16 or 28 px in 16:9. Hero 150 to
  220 px (9:16), 120 to 170 px (16:9). A brand font goes in only as a file the user gives you,
  copied into `public/fonts/` and loaded the same way with `staticFile`.
- Colour. One world palette plus ONE saturated accent on a few key beats. No flat backgrounds:
  gradients, light, depth, grain.
- Light. One key light direction (a sun) for every 3D object, plus a soft fill.
- Camera. Field of view fixed per format (50 degrees 9:16, 34 degrees 16:9) and never animated: move
  the camera instead of zooming. Always drifting a little, moving from frame 0. Continuous velocity:
  one spline per act, not a chain of eases that stop and start.
- Motion. Arrivals ease `cubic-bezier(0.16, 1, 0.3, 1)`, camera moves `(0.65, 0, 0.35, 1)`, exits
  `(0.7, 0, 0.84, 0)`. Nothing linear except constant drift. Overshoot 2 % at most. Parts of a group
  stagger 2 to 6 frames. One idea per shot.
- Entrances, no pop-ins. Every element enters in exactly one way: E1 flies in along the camera path
  or out of depth, haze and blur clearing over 10+ frames; E2 is emitted by or unfolds from another
  object; E3 a mask reveal; E4 carried by a character; E5 the camera travels to it. Opacity alone is
  never an entrance. Nothing appears or disappears in under 6 frames except flashes.
- Banned: crossfades between shots, spinning cards, glitch, zoom spam, particle spam, karaoke
  subtitles, emoji, tiny text, two animation styles for one element type, real brand logos.

### Step 5. Build

```
video-<name>/
  package.json  package-lock.json  remotion.config.ts  tsconfig.json
  docs/         BRIEF.md  STORYBOARD.md  BIBLE.md
  src/index.ts  src/Root.tsx  src/fonts.ts  src/assets.d.ts   entry, compositions, fonts
  src/data/     timeline.json  cues.json
  src/lib/      time.ts  ease.ts  format.ts  camera.ts  noise.ts
  src/world/    3D canvas, lights, objects
  src/ui/  src/type/  src/shots/  src/sound/                 glass, kinetic type, acts, audio
  src/sheet/index.tsx                                        contact sheet entry (Step 10)
  public/       audio/, images (loaded with staticFile)
  .renders/     scratch        out/   deliverables
```

No file over about 400 lines. `tsconfig.json`: strict, `"jsx": "react-jsx"`, `"module": "ESNext"`,
`"moduleResolution": "bundler"`, `"resolveJsonModule": true`, `"skipLibCheck": true`,
`"noEmit": true`, `"include": ["src", "remotion.config.ts"]`. Typecheck after every change set:
`npx --no-install tsc --noEmit -p .`

`remotion.config.ts`:

```ts
import { Config } from "@remotion/cli/config";
Config.setChromiumOpenGlRenderer("angle"); // no working GPU or black WebGL frames: "swangle" (software, slower)
Config.setConcurrency(1);                  // rule 2
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(94);
Config.setDelayRenderTimeoutInMilliseconds(120000);
Config.setBrowserExecutable(".browser/chrome-headless-shell-linux64/chrome-headless-shell"); // the browser file from section 1 for this computer
```

Entry and fonts (rule 1). The fonts load from the installed `@fontsource` files through
`@remotion/fonts`, which holds every frame with `delayRender` until its file is loaded and cancels
the render if one fails, so nothing ever renders on a fallback font:

```ts
// src/index.ts
import "remotion/no-react"; // keep this the first import
import { registerRoot } from "remotion";
import { Root } from "./Root";
registerRoot(Root);
```

```ts
// src/fonts.ts, imported first in Root.tsx, before any scene
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
```

```ts
// src/assets.d.ts: font files imported from the @fontsource packages are URLs
declare module "*.woff2" {
  const url: string;
  export default url;
}
```

Load only the weights and styles the bible uses; a weight you did not load is a fallback.

3D and layers:
- `<ThreeCanvas width height>` from `@remotion/three`, with @react-three/fiber elements inside.
  Animate from `useCurrentFrame()` only.
- One camera pose function per act (position, target, roll) sampled from the frame. WebGL and any
  DOM placed in 3D use the same pose, so they stay locked together.
- At most 2 WebGL canvases live at once; unmount a canvas outside its frames. Each canvas is a WebGL
  context and costs memory in every render tab.
- Load anything async (textures, images, JSON) behind `delayRender` / `continueRender`, and call
  `cancelRender` on failure, so no frame renders half-loaded.
- Heavy looks (volumetric clouds, soft skies) are drawn once into images and placed on quads at real
  depths, so the camera gets parallax for the price of a texture.
- Glass (DOM): `backdrop-filter: blur(24-36px) saturate(160-190%)`, background
  `rgba(255,255,255,0.10-0.22)`, a 1 px inner highlight, a soft shadow, a specular sweep on key beats.
  `backdrop-filter` breaks when any ancestor has opacity below 1, `filter`, `mask` or
  `mix-blend-mode`, and can seam inside a shared `preserve-3d` context: keep glass in a flat container
  and fade it with its own opacity. At most 2 live glass panels.
- DOM text placed in 3D blurs when magnified: author it at 1.25x or more of the size it is seen at,
  and let UI rest at 1:1 when it is read.
- Motion blur only inside the storyboard's windows: `CameraMotionBlur` from `@remotion/motion-blur`
  around the moving element only, never around a `ThreeCanvas` or glass. Everything else stays sharp.
- Post: subtle grain seeded by the frame and a soft vignette, applied once over everything.
- To iterate on one scene fast, give it a small entry of its own (`src/dev/<scene>.tsx` registering
  just that scene) and render stills from that entry.

### Step 6. Stills check, before any clip or full render

Check free memory first (rule 3), then render one still per command:

`npx --no-install remotion still src/index.ts '<Comp>' '.renders/stills/<Comp>-f<frame>.png' --frame=<frame> --scale=0.5`

Render every line start, accent and transition frame from the storyboard, in BOTH formats. Read each
PNG and critique it honestly: one clear hero? text inside the safe zone and big enough? the right
typeface (a fallback font means a font did not load: stop and fix)? anything frozen mid-entrance
that will read as a pop-in? flat or empty areas? type contrast over bright areas? one consistent
light? Fix and render again. At least two rounds; say what changed each round. Show the user 3 or 4
key stills (hook, main moment, call to action) as a first look.

### Step 7. Clip check

Render clips of 3 s or less around each entrance and transition:
`npx --no-install remotion render src/index.ts '<Comp>' '.renders/clip.mp4' --frames=<a>-<b> --scale=0.5 --concurrency=1`.
Make `.renders/clip/` or empty it first, decode every frame into it
(`npx --no-install remotion ffmpeg -y -i '.renders/clip.mp4' -vf scale=360:-1 '.renders/clip/f_%03d.png'`)
and look at consecutive frames around every entrance: pop-ins and one-frame gaps hide there. Camera
speed must not jump more than about 20 % between consecutive frames, except on a hidden cut.

Time one 60-frame clip of the heaviest act at full scale (the same command without `--scale`): its
seconds per frame times the total frames is the full-render estimate. Tell the user the estimate
before the full render.

### Step 8. Sound

Sound comes only from audio files the user gives you and owns or has a license for: a music track
and sound effects. Never synthesize audio in code, never download it.

- Copy each file into `public/audio/` under a checked name (ground rules) and list what it is in
  `docs/BRIEF.md`.
- Find each effect's sync point inside its file and write it into its cue as `syncAt`: the
  transient for hits and clicks, the loudest moment for whooshes, the end for risers.
  Leading silence (the transient of a hit is where it ends):
  `npx --no-install remotion ffmpeg -i 'public/audio/<file>' -af silencedetect=noise=-40dB:d=0.005 -f null -`
  prints `silence_end` when the file starts with silence; without that line the sound starts at 0.
  Length (the end of a riser):
  `npx --no-install remotion ffprobe -v error -show_entries format=duration -of json 'public/audio/<file>'`.
  For a whoosh, take the middle of its audible part unless the user says where its peak is.
- Place sounds in the composition with Remotion's own components: `<Sequence from={...}>` around
  `<Html5Audio src={staticFile("audio/<file>")} />` (`Html5Audio` is Remotion's audio component,
  formerly called `Audio`). `src/sound/Sound.tsx` maps `cues.json` to one `Sequence` per cue, so
  the file's sync point, not its first sample, lands on `t`: the file starts at
  `start = toFrame(cue.t) - toFrame(cue.syncAt)`. When `start` is below 0, the `Sequence` starts at
  frame 0 and `trimBefore={-start}` (in frames) drops only the part that would play before the film
  begins; otherwise `from={start}` and nothing is trimmed, so attacks and risers stay whole. The
  music sits in one `Sequence` from frame 0. Keep `volume` at 1 or below (`10 ** (gainDb / 20)`).
- Music: fade in over the first 6 to 12 frames and out over the last second with a `volume`
  function of the frame; dip it 4 to 6 dB under dense effects. Snap cuts and accents to its beat
  when the tempo is known.
- No audio from the user: the film is silent. Say so in one line before the full render, never fill
  the gap yourself.

### Step 9. Full render

Rule 2: compositions with a `ThreeCanvas` render with `--concurrency=1`. Rule 3: one render at a
time, after the memory check. Keep the computer awake.

1. Render the whole composition in one command:
   `npx --no-install remotion render src/index.ts '<Comp>' '.renders/<Comp>.mp4' --codec=h264 --crf=18 --concurrency=1`.
   If it fails, read the error and fix the cause (a render that dies exactly at the delayRender
   timeout: rule 1 first), then render again.
2. Count its frames:
   `npx --no-install remotion ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames -of json '.renders/<Comp>.mp4'`
   must give exactly the composition's `durationInFrames` (set in `src/Root.tsx` from the timeline).
3. With audio, master it to -14 LUFS integrated, true peak -1.5 dBTP, with loudnorm in two passes.
   Pass 1 measures:
   `npx --no-install remotion ffmpeg -i '.renders/<Comp>.mp4' -map 0:a:0 -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null -`.
   Pass 2 copies the picture untouched and applies the measured values (each checked against its
   pattern, ground rules) into `out/` (make it first):
   `npx --no-install remotion ffmpeg -y -i '.renders/<Comp>.mp4' -map 0:v:0 -map 0:a:0 -c:v copy -af loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=<input_i>:measured_TP=<input_tp>:measured_LRA=<input_lra>:measured_thresh=<input_thresh>:offset=<target_offset>:linear=true -c:a aac -b:a 256k -ar 48000 -movflags +faststart 'out/<name>-9x16.mp4'`.
   Without audio:
   `npx --no-install remotion ffmpeg -y -i '.renders/<Comp>.mp4' -map 0:v:0 -c copy -movflags +faststart 'out/<name>-9x16.mp4'`.
4. Check the MP4 you just wrote:
   `npx --no-install remotion ffprobe -v error -show_entries stream=codec_type:format=duration -of json 'out/<name>-9x16.mp4'`
   must show exactly one video stream, exactly one audio stream when the film has audio (none
   without), and a length within one frame of `durationInFrames / fps`; the `-count_frames` check
   from step 2 on this MP4 must give exactly `durationInFrames`. With audio, measure the MP4 again
   with the pass 1 command on `'out/<name>-9x16.mp4'`: `input_i` must be within 1 LU of -14 and
   `input_tp` at most -1.0, since the AAC encode can move peaks; if not, run pass 2 again from these
   new values. Anything else, stop and fix it before the contact sheet.

The 16:9 version is the same steps with its own composition and `out/<name>-16x9.mp4`.

### Step 10. Contact sheet and self-review

1. Make `.renders/sheet/` or empty it first, so no frame of an older sheet is left, then take two
   frames per second from the FINAL file:
   `npx --no-install remotion ffmpeg -y -i 'out/<name>-9x16.mp4' -r 2 -vf scale=160:-1 -q:v 3 '.renders/sheet/f_%03d.jpg'`
   (16:9 uses `scale=240:-1`). Count the files it wrote: that is `<frames>`.
2. The bundled ffmpeg cannot tile, so the sheet is a Remotion still from its own entry, with
   `.renders/sheet` as its public folder (the film's bundle never sees these frames):

```tsx
// src/sheet/index.tsx
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
```

   `npx --no-install remotion still src/sheet/index.tsx Sheet 'out/<name>-9x16-sheet.jpg' --public-dir=.renders/sheet --props='{"count":<frames>,"cols":12,"every":0.5,"cellW":160,"cellH":284}'`
   (16:9: `'out/<name>-16x9-sheet.jpg'` with `"cols":8,"cellW":240,"cellH":135`). The sheet goes
   straight into `out/` next to the film it shows, and each new sheet replaces the last one.
3. Read the sheet. Check: motion from frame 0; a new visual on every line; no blank, black or broken
   frames you did not plan; text readable; the call to action clear. The sheet shows two frames a
   second, so also make `.renders/ends/` or empty it, decode the first and the last quarter second
   of the final file
   (`npx --no-install remotion ffmpeg -y -t 0.25 -i 'out/<name>-9x16.mp4' -vf scale=360:-1 '.renders/ends/first_%02d.png'`
   and `npx --no-install remotion ffmpeg -y -sseof -0.25 -i 'out/<name>-9x16.mp4' -vf scale=360:-1 '.renders/ends/last_%02d.png'`)
   and look at every one of them: the first frame already moving, the last a poster-quality still.
   Single broken frames between those are what the clip checks of Step 7 catch. Then decode a few
   frames around three or four accents and check them against the timeline.
4. Fix what you found, run Step 9 again, make a new sheet. Do at least one fix round unless the
   sheet is clean, and say what changed.

### Step 11. Deliver

`out/<name>-9x16.mp4` and/or `out/<name>-16x9.mp4` (H.264, yuv420p, AAC, faststart), their contact
sheets `out/<name>-9x16-sheet.jpg` and `out/<name>-16x9-sheet.jpg` (Step 10), and `docs/`. Tell the
user where the out folder is, open it for them, and say in two lines how to change something:
describe it in plain words to Claude Code in this folder. For a change, find the storyboard line it
touches, change that scene only, check its stills, run Step 9 again, make a new contact sheet.

## 3. Hard-won rules

From the film this skill comes from (42.85 s, 60 fps, 2,571 frames, 1080x1920 and 1920x1080,
three.js in Remotion). Rules 1 to 3 each killed full renders there; the rest are the production
rules that came out of it.

1. **`import "remotion/no-react"` comes first** in the entry file and in the fonts module. Remotion
   4.0.355, the version that film started on, reset `window.remotion_delayRenderTimeouts` when
   `remotion/no-react` (imported by `@remotion/three`) first loaded. Font `delayRender` handles made
   before that lost their timer entries, `continueRender` could no longer clear them, and every
   render died exactly at the delayRender timeout while frames were still coming out. The pinned
   4.0.534 guards that reset; keep the import first anyway, it costs nothing and protects older
   projects and upgrades. If a render ever dies exactly at the timeout, check this first.
2. **Render 3D with `--concurrency=1`.** Every tab holds its own WebGL context. Extra tabs gave no
   speed-up with software WebGL, multiplied the memory (four tabs pushed an 8 GB machine into
   swap), and one stalled tab holds up the whole render. Raise it only for compositions without
   WebGL, or after a timed test shows it is faster and memory stays free.
3. **One heavy job at a time, and check free memory first.** Before every still round, clip and full
   render, check available memory with the system's own tool (Linux: the `available` column of
   `free -m`; macOS: `memory_pressure`; Windows: `FreePhysicalMemory` from
   `Get-CimInstance Win32_OperatingSystem`). Below about 2.5 GB, ask the user to close other apps,
   or wait, before you start. Never start a still, clip or render while another one runs, in this
   session or any other, and never run renders side by side in the background. On the 8 GB server
   the film was made on, parallel jobs pushed renders into swap and the out-of-memory killer ended
   them mid-render.
4. **Storyboard first, on a time grid.** One canonical shot plan, timed from the timeline. Scenes
   read `L` and cue times and never hard-code seconds, so a new pace re-times everything and nothing
   drifts.
5. **Stills before the full render.** Stills at every key frame in both formats, looked at and fixed,
   before spending render hours. Most problems show up on a still.
6. **Contact sheet after the render.** Review the final file at 2 frames per second, fix, render
   again. The render is not done until the sheet is clean.
7. **Never render on a fallback font.** Fonts come from the kit and a font that fails cancels the
   render; never catch that and go on.
8. **Never ship cut short or out of sync.** Sounds are placed from the same cues the scenes read,
   and the MP4 is frame-counted against the composition before delivery.
9. **Glass needs a flat, unfiltered parent** and at most two live panels.
10. **Frames, not seconds,** for every window boundary.
11. **Deterministic or nothing.** A frame that depends on time of day, randomness or the network
    renders differently in every tab and every render.
