# 06 — Art Direction: Reference Board Breakdown

Source: the team's "massai mara" image-search mood board (Tripadvisor, Great Adventures Safaris, Kenya Safari Holidays, MakeMyTrip, Safari Memories, maasaimara.com, Gamewatchers Safaris, and others). These images are **reference only**. Never ship or trace them; use them to calibrate colour, light and composition. Each reference below maps to the system and parameters that reproduce it.

---

## 6.1 Reference → System Mapping

| # | Reference (what's in frame) | Season / ToD | What to Extract | Reproduce With |
|---|-----------------------------|--------------|-----------------|----------------|
| R1 | Three giraffes on a flat green plain, lone acacia, bright cumulus sky | **Long Rains**, mid-morning | Saturated green short sward, crisp far horizon, puffy fair-weather cumulus with flat bases at ~1.6–2 km, deep blue zenith | `SeasonAlpha 0.9`, Mie Scattering Scale **0.004**, Aerial Perspective Scale 1.0, Volumetric Cloud coverage 0.35 with low base; grass colour ramp at `#6E8B3D`; PCG tree density at the *low* end (0.3/ha) (§03 3.3, §04 4.1) |
| R2 | Wildebeest mass crossing, churned muddy-brown water, dust rising from the far bank, steep eroded bank | **Great Dry**, mid-day | Opaque chocolate-brown water, dust hanging above herds, wet dark bank band, the *density* of bodies | Water turbidity "Flood" preset even at low stage (crossings churn it); `NS_Atmos_HerdDust` + Local Fog Volume on the bank; bank wetness line (§02 2.4.2); Mass High-LOD ≥ 300 agents in the crossing window; RVT hoof-churn on banks (§04 4.2.3) |
| R3 | Wildebeest leaping off a high cliff-like bank into the river | Dry, crossing set-piece | Vertical drop height (3–6 m), crumbling bank edge, bodies mid-air | `UPCGMaraBankProfiler` **steep (>35°)** crossing variant; "First Jumper" event + ragdoll fall chance (§01 Migration) |
| R4 | Dense mixed herd: wildebeest foreground, zebras interleaved, pale golden grass, scattered acacias on the horizon | Dry, overcast-soft daylight | Mixed-species herd composition (zebra embedded within wildebeest), grazed-down grass in the herd's wake | Grazing succession pipeline (zebra → wildebeest → Tommy) and `GrassHeightRT` shortening behind herds (§01 1.2.1, §04 4.1.3) |
| R5 | Two zebras in tall gold grass, green *Euclea/Croton* treeline behind | Dry, midday | Gold grass vs dark evergreen thicket contrast, flat midday light, pale washed sky | Midday preset: Saturation 0.92, Film Shoulder 0.30, Local Exposure Highlight Contrast 0.7 (§03 3.3); riverine/drainage thicket Band C (§04 4.2) |
| R6 | Male lion, dark mane, **backlit** in intense orange haze, grass glowing | Golden hour (sun 1–4°) | Orange-red scattering, rim light on the mane, near-black body silhouette, hazy background | Golden-hour preset: Mie Scale **0.015**, Mie Anisotropy **0.85**, Volumetric Fog Albedo (1.0, 0.86, 0.70), dust motes ON; groom needs a strong **transmission/backscatter** term on mane tips (Substrate hair/fuzz) (§03 3.2, §01 1.1.2) |
| R7 | Maasai man in a red shúkà standing under acacias, green grass, cloudy sky | Long Rains, daylight | The **red shúkà as the single strongest colour accent** in a green/gold world | Shúkà red ≈ `#C4202A` (verify against fabric photo scans), cloth sheen via Substrate fuzz; character composition rule (§5.2). Portrait must be culturally reviewed |
| R8 | Giraffe beside a pop-top safari vehicle, gold grass, blue sky | Dry | Scale reference (giraffe ~5 m vs vehicle ~2.5 m), tourism layer | **This is the core camera/composition of the game:** the game-drive vehicle beside wildlife. Validate vehicle-to-animal scale, guests' eye height (~2.2–2.5 m from the pop-top) and photo angles (§07.3, §07.8) |
| R9 | Lions (male + lioness) resting in golden grass; a lion on a termite mound/rise against the plain | Dry, day | Lions near-invisible in grass at rest: colour match between coat and cured *Themeda* | Coat albedo and grass albedo must sit within ~10% luminance of each other. Validate in-engine with a greyscale view (this *is* the ambush gameplay) (§01 Lion, §5.5.2 C) |
| R10 | Acacia silhouette at sunset, gold sky | Golden hour / civil twilight | Flat-topped *Vachellia tortilis* silhouette readability | Tree LOD silhouettes must keep the flat crown at all HLODs; Local Exposure keeps silhouettes near-black (§03 3.2.1, §04 4.5.1) |

---

## 6.2 Palette Extracted From the Board

| Swatch | Hex (approx.) | Use |
|--------|---------------|-----|
| Cured red-oat grass (lit) | `#D2A85C` | Dry-season grass tips, midday |
| Cured grass (shade) | `#8C6B3A` | Grass body/shadow |
| Golden-hour grass rim | `#E8A33C` | Backlit grass at sun < 6° |
| Golden-hour haze | `#F07A2A` → `#FFB46B` | Sky near the sun, R6 |
| Wet-season sward | `#6E8B3D` | R1 green |
| Evergreen thicket | `#3F5530` | *Euclea/Croton* treelines (R5) |
| Mara River water (crossing) | `#6B5136` | Turbid water (R2/R3) |
| Red loam / dust | `#8C4A2F` / `#C9A57A` | Banks, dust coats |
| Wildebeest hide | `#4A4642` with silver-grey banding `#7D7A74` | Herd bodies |
| Zenith sky (clear, altitude) | `#3E6FB0` | Midday, Wet season |
| Shúkà red | `#C4202A` | Character accent (verify with real fabric) |

> Use these as **targets to check against**, not material inputs. Albedo must stay physically plausible (grass linear albedo 0.25–0.45, never above ~0.6). Match the look through lighting and grading.

---

## 6.3 Reference Accuracy Warnings

| Issue Spotted in Board | Correction |
|------------------------|------------|
| The MakeMyTrip "Maasai Mara" zebra image shows **Grévy's zebras** (narrow dense stripes, white belly, large rounded ears, broad dark dorsal stripe) | The Mara has **plains zebra** (*Equus quagga boehmi*): broad stripes reaching under the belly, smaller pointed ears. Don't use this image for zebra modelling (§01 header warning) |
| Stock photos are heavily graded (saturation pushed, orange LUTs on R6) | Treat R6 as the **upper bound** of golden-hour saturation. Gameplay grading should sit ~15–20% below it; let photo mode go further |
| Tourism images over-represent vehicles and crowds at sightings | Crowding is a real system in the game (§07.6): reproduce it in the Reserve on purpose, and make the conservancy's low-density, exclusive sightings feel like the premium |

---

## 6.4 Look-Dev Validation Shots (build these first in M0)

1. **"Lion in Grass" (R9):** a lioness lying in Dry-season grass at 40 m, at midday and golden hour. Pass: playtesters spot her < 50% of the time within 5 s.
2. **"Backlit Mane" (R6):** a male lion at sun elevation 2°, camera facing the sun. Pass: mane rim glow without the body clipping to pure black (Local Exposure).
3. **"The Crossing" (R2/R3):** 300+ Mass wildebeest, steep bank, turbid water, dust. Pass: ≥ 30 fps on PS5-class hardware with the full set-piece active.
4. **"Green Plain" (R1):** Wet season, 10 km sightline. Pass: horizon reads crisp (low Mie) and grass far-ring colour matches the mid-ring with no visible seam.
5. **"Red Accent" (R7):** shúkà-wearing character in Wet and Dry palettes. Pass: the shúkà is the highest-saturation element on screen in both.
