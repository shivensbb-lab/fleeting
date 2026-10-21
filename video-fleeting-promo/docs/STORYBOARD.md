# Storyboard: Fleeting promo (9:16, 20 s, 60 fps, 1200 frames)

Single canonical shot plan. Scenes read times from `src/data/timeline.json`; frames below are
`round(seconds * 60)`.

## Act table

| act | lines | frames | place | hero | colour | sound (when added) |
|---|---|---|---|---|---|---|
| A. Dusk city | hook, near | 0-293 | Above a city at golden hour, haze, skyline layers at depth | The deal card (glass) with an orange countdown ring | warm amber sky, deep indigo shadows | music in, whoosh on card arrival |
| B. Deal stream | cats, deal | 294-611 | Card hovers in the sky; the city lights come on below | Four category cards, then one big "50%" | dusk to blue hour, orange accent on the number | 4 ticks on the cards, hit on "today" |
| C. Blackout | gone | 612-785 | Same sky, the lights cut; near black | The countdown ring draining to 0:00 | near black, one orange ring | music drops out: silent beat |
| D. Booked | book | 786-947 | Inside the phone screen | Phone with a booking UI, cursor taps twice, QR draws | night, warm screen glow | 2 taps, chime on QR |
| E. Wordmark | cta | 948-1199 | Back out to the city skyline at night, lights on again | "Fleeting" wordmark and the CTA | night blue, orange wordmark dot | music back for the end |

## Object chain

1. The **deal card** drops out of the haze and lands in front of the camera (hook).
2. The camera glides down past it toward the city; small location pins light up below (near).
3. The card **splits** into four category cards fanned in depth (cats), which fold back into one.
4. Its discount badge **grows** into the giant "50%" (deal).
5. Its countdown **ring** detaches and fills the frame; it drains, the city lights cut out (gone).
6. The ring **shrinks into** the phone's booking button; two taps, the QR code draws itself (book).
7. The phone screen's glow **becomes** the flash that relights the city; the wordmark rises (cta).

No crossfades: every change is carried by the card, its ring, or the camera.

## Per line

| line | time | frames | hero | entrance / exit | camera | text on screen | transition | cue |
|---|---|---|---|---|---|---|---|---|
| hook | 0.3-2.2 | 18-132, accent 78 | deal card "Sunset Dhow Cruise Dinner, 40% off, 1:58:00 left" | E1 out of depth through haze; exits as camera passes it | slow push in from frame 0, slight roll | **The best deals** *vanish* **fast.** | camera tilts down past the card | whoosh-1 at 0.4 |
| near | 2.6-4.7 | 156-282, accent 240 | city with 5 orange pins | pins E2: emitted as beams from the card's light | crane down toward the skyline | **Last-minute openings,** right *near* **you.** | card rises back into frame | tick at 2.6 |
| cats | 5.1-7.3 | 306-438, accent 402 | 4 cards: Dinners, Classes, Salons, Spas | E2 unfold from the one card, stagger 4 frames | orbit 8 degrees | **Dinners. Classes. Salons.** *Spas.* (one word per card hit) | cards fold back into one | 4 ticks |
| deal | 7.7-9.9 | 462-594, accent 552 | "50%" in orange, huge | E2 grows out of the card's badge | push in | **Up to 50% off,** *today* **only.** | the ring peels off the card | hit on "today" |
| gone | 10.4-12.9 | 624-774, accent 738 | countdown ring 0:03, 0:02, 0:01, 0:00 | ring E5, camera travels to it | dead still, then a tiny drift | **When the timer hits zero,** it's *gone.* | city lights cut on "gone"; black | silence |
| book | 13.3-15.5 | 798-930, accent 840 | phone with booking screen, QR | E2: the ring shrinks into the Book button | push to the screen, 1:1 for reading | **Book in two** *taps.* **Show your QR.** | screen glow flares | tap, tap, chime |
| cta | 16.0-19.7 | 960-1182, accent 1014 | "Fleeting" wordmark over the lit city | E3 mask reveal out of the flare | slow rise to the skyline, settles for the last frame | **Fleeting** / Grab it *before* it's gone. / Flash deals near you | hold as the end poster | music swell |

## Camera keys (one continuous path per act)

- A: (0, 2, 12) -> (0, 0.5, 6) by f132 -> (0, -1.5, 4), looking down over the city by f293.
- B: orbit around the card (radius 5, 0 to 8 degrees), slow push in to f611.
- C: locked on the ring, 0.2 % drift only.
- D: push from (0, 0, 6) to (0, 0, 3.2) at the phone; rests from f840 so the UI reads at 1:1.
- E: rise from the street-level horizon to the skyline, ease to a stop by f1170.

## Motion-blur windows

- f100-150 (camera passes the card), f430-470 (cards fold back), f776-800 (ring shrinks into the button).

## Pop-in audit

| element | entrance |
|---|---|
| deal card | E1 out of depth |
| city pins | E2 emitted by the card's light |
| category cards | E2 unfold from the card |
| 50% | E2 grows from the badge |
| ring | E5 camera travels to it |
| phone and booking UI | E2 the ring becomes the button; phone E1 out of the dark |
| QR code | E3 mask reveal, drawn row by row |
| wordmark and CTA | E3 mask reveal |
| every line of type | E3 mask reveal by line, accent word flies in E1 |

## Done when (per line)

- hook: card sharp and readable by f78, text in the safe zone, motion on frame 0.
- near: pins visible over the skyline, the accent hits on f240.
- cats: four distinct cards, labels at 34 px or more.
- deal: "50%" lands exactly on f552 in orange.
- gone: frame f738 is near black with only the ring; it reads as a pause.
- book: two taps visible, QR complete by f900.
- cta: last frame is a clean poster with the wordmark and the line.

Verification frames: 18, 78, 132, 156, 240, 306, 402, 462, 552, 624, 738, 798, 840, 960, 1014, 1199.
