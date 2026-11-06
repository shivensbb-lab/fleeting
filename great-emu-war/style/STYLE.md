# Under 7 Minutes Toon — Style Prompt

Made from a blank page; techniques from Mid-century Cartoon (midcentury-toon) in Lemo-Opuscar.

> Deadpan animated-history explainers: big history told as a sitcom, one sentence per picture, chunky outlined bean
> characters, blank-faced crowds, flat muted colour-plane worlds, numbers that land on the picture, a dry narrator who
> underreacts to enormous things. Copy no existing channel's characters, designs, title cards, music or catchphrases.

## 1. Essence, and what it is not

Flat colour shapes inside a **thick, even black outline** (≈ 10–12 px at 1080p), drawn crisp, never sketchy. People are
**beans**: a heavy rounded torso, short stubby legs, round heads with dot eyes and one-stroke brows and mouths; the
hero of each story gets hair, a hat or a moustache, while crowds have **blank white faces**. Rooms are not drawn in
detail: a sky or wall plane, a ground band, two or three props. The comedy is in the deadpan: small expressions,
big facts.

Not a mid-century "how to" film (it tells a story, it isn't a manual). Not rubber-hose bounce. Not anime. Not a
whiteboard explainer: everything is printed colour, nothing is drawn on in front of the viewer.

## 2. Materials & rendering

- Fills: flat, one colour per part; at most one flat darker plane for a shadow side, never a gradient on a character.
- Outline: 10–12 px black on characters and key props, 6–8 px on background shapes and small props; round joins.
- Limbs: a black ribbon with a coloured ribbon on top (sleeves, trousers); hands are rounded ends, no fingers.
- Skies: one soft vertical two-tone, flat cloud shapes with outlines. Light rays: 12 flat wedges, slowly turning, 35–55 %.
- Grain: very light (print), added at mux.

## 3. Colour logic

- Muted, slightly desaturated historical palette: sage, olive, wheat, parchment, slate, timber brown, dusty sky blue.
- **Two accents only**: a warm yellow (rays, highlights, accent words) and a red (stamps, flags, danger).
- Emus are dark brown-grey with a slate-blue neck; never on a dark-brown ground. Soldiers are khaki; officials navy.

## 4. Type & subtitles

- Captions: bold geometric sans (Inter Tight 900), white fill, black stroke ≈ 14 % of the size, centred in the bottom
  band; the accent word or phrase in yellow; one caption per narration line, held for the line + 0.6 s.
- Title cards and on-picture numbers: the same outlined lettering, much larger; numbers are digits on screen.
- Labels in the picture (a year on a calendar, a figure on a card) use the same outlined style, never small text.

## 5. Motion quality

- Hard-cut grammar: each shot lands with a small snap (scale 1.05 → 1 over 5 frames).
- Bodies hold; heads, eyes, arms and legs move. Walk and run cycles are 2–4 poses.
- Comic pops (a jammed gun, a fallen fence) may be one-frame changes; everything else eases.
- Crowds bounce in a shared rhythm with offsets; emus bob their heads.

## 6. Camera grammar

Push, pull-back reveal, horizontal tracking pan, top view, low-angle hero, shake on impact, and an iris on a round
object for the title. Key subjects ≥ 1/3 frame height and clear of the caption band. Transitions are hard cuts on the
beat inside a scene, and a colour-block wipe or iris between scenes; no dissolves.

## 7. Sound palette

- Music: a light, original comic score — plucked strings, woodblock, small snare, low pluck as bass, glockenspiel
  accents; a march feel for military scenes, half-time for the quiet beats. Not piano and strings.
- Foley for every visible action; ambience beds per location; at least two real silences.
- Voice: a dry, measured British narrator, voice ≈ 10 dB over the music; character lines in other voices.

## 8. Native moves

- **The refrain cut**: the same framing of the same character returns on the refrain line, held still.
- **The number lands on the picture**: a figure stamps onto the thing it counts, with a snap and a thud.
- **The blank-faced crowd**: a crowd that reacts only with its bodies, so the one face with features carries the joke.

## 9. Pitfalls

- Too many props: three per shot at most.
- Thin outlines read as a different style: keep the outline weight.
- Captions on the subject: keep characters' heads above the caption band.
- A gag too fast to read: hold the punchline at least 1.5 s after the line ends.

## 10. Engine

The film's own `film.js` (Canvas 2D through `Path2D`): `bean()` (character rig), `emu()`, backgrounds, props,
captions, the snap and the rays. Rendered with `$LIB/core/render/video.mjs`.

## 11. Variation space

Topic, story, cast, sets, palette within §3, pacing, music and voice are free in every film.
