# Design bible: S.A.M J3 Mall

- Format 9:16 1080x1920; safe zone x 60-1020, y 220-1480. World band centred at y 600, words y 1110-1480.
- Type: Inter Tight 900 150 px hero, Inter Tight 800 64 px kicker, Instrument Serif Italic accent word
  (S.A.M crimson), JetBrains Mono 500 for UI labels. Nothing read under 34 px.
- Colour: paper #FBF6EF, cream #F1E6D8, ink #1E1B2E, muted #6E6878, crimson #A7144C (the one accent).
  Never flat: sky gradient, sun glow, depth haze, grain, soft vignette.
- Light: one sun upper left, warm; hemisphere fill. Quiet beat dims to 45 %.
- Camera: FOV 50 degrees fixed; one eased Catmull-Rom path per act; constant drift.
- Motion: arrive (0.16,1,0.3,1), camera (0.65,0,0.35,1), exit (0.7,0,0.84,0). No pop-ins, no crossfades.
- Glass: only the bar model card and the map card, never both live at once.
