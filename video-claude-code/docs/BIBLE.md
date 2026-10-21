# Design bible: Why Claude Code

## Format
- 9:16, 1080x1920, 60 fps. Text safe zone x 60-1020, y 220-1480.
- Portrait bands: the world (terminal, files, windows) sits in the upper band, centred on y = 600
  (the camera's principal point is shifted there); the words sit in the lower band, y 1110-1480.

## Type (all from the kit)
- Hero words: Inter Tight 900, 150 px, tracking -0.04em, line height 0.95, cream #F4EDE4.
- Kicker above the hero row: Inter Tight 800, 64 px, cream at 72 %.
- Accent word (one per line): Instrument Serif Italic 400 at 1.12x the hero size, no negative tracking.
- UI and code: JetBrains Mono 500, never under 34 px as seen.

## Colour
- World: warm charcoal #120E0C to umber #2A1F1A, light from a warm window upper left.
- Cream #F4EDE4 for type; muted #9C8F84 for secondary UI.
- One saturated accent, terracotta #D97757: the cursor, edits, the hook, test fix, ship and CTA accents.
- Diff red #C8574B (removed lines), success green #8DBF7F (ticks, merged) as UI semantics only.
- Never flat: gradients, light beam, dust, grain and vignette over everything.

## Light
- One key light, warm (#FFD8B0), from upper left (-30, 40, 30); soft hemisphere fill.
- Act C (quiet) dims the world to 12 % light; it relights for the ship.

## Camera
- Vertical FOV 50 degrees over the 1920 frame, never animated. Always drifting a little.
- One Catmull-Rom path per act, eased (0.65, 0, 0.35, 1) over the act.
- World units: 1 unit = 100 authored px at 1:1 scale (distance 20.6). DOM in the world is authored
  at its resting size divided by its resting scale, so it rests at 1:1 or smaller.

## Motion
- Arrivals cubic-bezier(0.16, 1, 0.3, 1); camera (0.65, 0, 0.35, 1); exits (0.7, 0, 0.84, 0).
- Stagger 2-6 frames. Nothing appears or disappears in under 6 frames.
- Entrances: E1 out of depth with blur clearing, E2 emitted by another object, E3 mask reveal,
  E5 camera travels to it. Opacity alone is never an entrance.
- Fast moves get depth blur (E1 blur) rather than a motion-blur pass; no CameraMotionBlur is used.

## Glass
- Only the terminal panel is glass: blur(30px) saturate(175%), rgba(255,255,255,0.12), 1 px
  inner highlight, soft shadow, specular sweep on the hook and ship. It fades with its own opacity;
  no ancestor gets opacity, filter, mask or blend mode.

## Banned
Crossfades between shots, spinning cards, glitch, zoom spam, particle spam, karaoke subtitles,
emoji, tiny text, real brand logos (the name is set in type only).
