# Storyboard: Why Claude Code (9:16, 20 s, 60 fps, 1200 frames)

Single canonical shot plan. Scenes read times from `src/data/timeline.json`; frames below are
`round(seconds * 60)`.

## Act table

| act | lines | frames | place | hero | colour | sound (when added) |
|---|---|---|---|---|---|---|
| A. The prompt | hook | 0-149 | A dark, warm room of floating glass layers, one key light from upper left, dust in the light | The terminal panel, a cursor typing | charcoal and warm brown, cream type | soft keys |
| B. The work | read, edit, test | 150-593 | The camera pulls back: the project's files float around the terminal at depth like a library | File cards, diff lines, test rows | terracotta accent on edits, green ticks | whooshes as files fly, ticks on tests |
| C. Quiet | quiet | 594-755 | Everything dims; only the terminal remains | One blinking cursor and a "Review" button | near black, one warm glow | silence |
| D. Ship | ship | 756-911 | A branch line runs off into depth | The commit dot travelling to "merged" | terracotta line, green merge | tap, then a rising whoosh |
| E. Everywhere | where, cta | 912-1199 | The merge dot opens into four windows, which fold into the name | Four windows, then the wordmark "Claude Code" | warm cream light | music swell |

## Object chain

1. A cursor blinks inside the terminal panel and types the prompt `add dark mode to tidepool` (hook).
2. The prompt's light runs outwards; the project's files fly in out of depth and line up around the
   terminal; a scan line passes over each (read).
3. Three files slide forward; their diff lines unfold: red lines out, terracotta-highlighted lines in (edit).
4. The diffs collapse into a test list: 12 rows tick green, one goes red, gets fixed, flips green (test).
5. All other layers dim to near black; the terminal shows `Ready for review` with a blinking cursor (quiet).
6. A cursor presses Review; the files collapse into one commit dot that runs along a branch line and
   joins the main line with a "Merged" badge (ship).
7. The merge dot opens into four small windows: Terminal, IDE, Desktop, Web (where).
8. The four windows fold together into the wordmark "Claude Code" (cta).

No crossfades: every change is carried by the terminal, its files, or the camera.

## Per line

| line | time | frames | hero | entrance / exit | camera | text on screen | transition | cue |
|---|---|---|---|---|---|---|---|---|
| hook | 0.3-2.3 | 18-138, accent 96 | terminal panel with typing | E1 out of depth, haze clearing; prompt typed letter by letter | slow push in from frame 0 | **You describe it.** **It** *builds* **it.** | camera pulls back as files arrive | keys |
| read | 2.7-4.7 | 162-282, accent 216 | about 14 file cards (`app.tsx`, `theme.ts`, ...) | E1 fly in out of depth, stagger 3 frames | pull back and rise | **It reads your** *whole* **codebase first.** | three cards slide forward | whoosh |
| edit | 5.1-7.1 | 306-426, accent 384 | 3 file cards with diffs | E2 diff lines unfold from each card | orbit 6 degrees | **Plans the change. Edits** *every* **file.** | diffs fold into the test list | ticks |
| test | 7.5-9.6 | 450-576, accent 534 | test list, 13 rows | E2 unfold from the folded diffs | slow push | **Runs the tests.** *Fixes* **what breaks.** | everything but the terminal dims | red then green tick |
| quiet | 10.1-12.4 | 606-744, accent 696 | terminal, cursor, Review button | E5 camera travels to the button | nearly still | **Then it waits for** *your* **review.** | cursor presses Review | silence |
| ship | 12.8-15.0 | 768-900, accent 864 | commit dot on a branch line, "Merged" badge | E2 dot condenses out of the files | track along the line | **Commits, opens the PR,** *ships.* | merge dot opens up | tap, whoosh |
| where | 15.4-17.0 | 924-1020, accent 996 | 4 windows with their names | E2 unfold from the merge dot, stagger 4 frames | push back | **Terminal. IDE. Desktop.** *Web.* | windows fold together | 4 ticks |
| cta | 17.4-19.8 | 1044-1188, accent 1098 | wordmark "Claude Code" | E3 mask reveal out of the folded windows | settles to a still by f1170 | **Claude Code.** Your *best* teammate. | holds as the end poster | swell |

## Camera keys (one continuous path per act)

- A: (0, 0, 9) -> (0, 0, 6.5) by f149.
- B: (0, 0, 6.5) -> (0, 1.2, 11) by f282 -> orbit 6 degrees to f426 -> push to (0, 0.4, 8) by f593.
- C: locked on the terminal, 0.2 % drift.
- D: track along the branch line from left to right, slight roll 2 degrees.
- E: pull back to (0, 0, 10) for the four windows, then settle in front of the wordmark by f1170.

## Motion-blur windows

- f150-190 (files fly in), f580-600 (dim and push), f880-925 (dot races to merge).

## Pop-in audit

| element | entrance |
|---|---|
| terminal panel | E1 out of depth |
| prompt text | typed (E2 from the cursor) |
| file cards | E1 out of depth |
| diff lines | E2 unfold from the cards |
| test rows | E2 unfold from the diffs |
| Review button | E5 camera travels to it |
| commit dot and branch line | E2 condensed out of the files; the line draws (E3) |
| four windows | E2 unfold from the merge dot |
| wordmark | E3 mask reveal |
| every line of type | E3 mask reveal by line; the accent word flies in E1 |

## Done when (per line)

- hook: the cursor moves on frame 0; the prompt is readable by f96.
- read: file names readable at 34 px or more; the accent lands on f216.
- edit: red and terracotta diff lines clearly read as code changes.
- test: one red row visibly turns green at f534.
- quiet: f696 is near black apart from the terminal; it reads as a pause.
- ship: "Merged" badge lands on f864.
- where: four windows, each named, by f996.
- cta: the last frame is a clean poster with "Claude Code" and the line.

Verification frames: 0, 18, 96, 162, 216, 306, 384, 450, 534, 606, 696, 768, 864, 924, 996, 1044, 1098, 1199.
