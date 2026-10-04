# 03 — Lumen, Lighting & Time-of-Day Atmosphere

## 3.0 Physical Ground Truth: The Equatorial Sun

The Mara sits at **~1.5° S**. Three consequences should shape every lighting decision:

1. **The sun rises and sets almost vertically.** The sun's path is close to perpendicular to the horizon, so **golden hour and twilight are short**: civil twilight lasts ~21–23 min (vs 30–60+ min at mid-latitudes). Golden hour ("sun elevation 0–10°") lasts only ~40 min. *Design: treat these moments as scarce and dramatic, and slow game-time ×0.5 across them so players get to enjoy them.*
2. **Midday sun is near zenith year-round** (elevation 65°–90°). Shadows really do pool directly under objects, and acacia canopies throw circular shade directly beneath. Shade is a resource you can find at a glance.
3. **Sunrise/sunset is ~06:30/18:40 year-round** (±15 min). Day and night are ~12 h each, with no seasonal day-length variation to simulate (simplifies ToD).

**Altitude (~1,500–2,100 m):** thinner air means slightly bluer, deeper skies and harsher UV/contrast at midday. Use `Atmosphere Height` 60 km (default) but **ground altitude offset** ~1.6 km (place the planet top so the playable area sits 1.6 km above "sea level" in the SkyAtmosphere's coordinate frame via `Transform Mode = Planet Top at Absolute World Origin` and `Ground Radius` default 6360 km, then offset the component −1.6 km).

---

## 3.1 Global Lighting Rig (`BP_MaraSkyRig`)

| Component | Key Settings (constant across ToD) |
|-----------|-------------------------------------|
| **Directional Light – Sun** | Mobility Movable · **Atmosphere Sun Light Index 0** · Source Angle **0.5357°** (real solar disc) · Use Temperature ON · Cast Cloud Shadows ON · Cloud Shadow Strength 0.8 · Cast Shadows with **Virtual Shadow Maps** · Forward Shading Priority 1 · Light Shaft Bloom OFF (use real volumetric fog instead) |
| **Directional Light – Moon** | Movable · **Atmosphere Sun Light Index 1** · Source Angle 0.5° · Intensity driven by moon phase × elevation · Cast Shadows ON (VSM, lower res: `r.Shadow.Virtual.ResolutionLodBiasDirectional 1.5` when moon is key light) |
| **Sky Atmosphere** | Physically based. Parameters vary by ToD/Dust: see §3.2–3.4 |
| **Sky Light** | **Real Time Capture ON** · Lower Hemisphere Is Solid Color ON (ground colour = red-loam `#5A3A28` dry / `#2E2A1E` wet) · Intensity 1.0 (physical) · Cast Shadows ON · Affects Lumen |
| **Volumetric Cloud** | Layer Bottom 1.6–2.5 km, Layer Height 8–12 km (cumulonimbus), Ground shadow ON, Tracing Max Distance 50 km, Sample count 2–4 (quality scaling) |
| **Exponential Height Fog** | Volumetric Fog ON · Two fog layers (dust low layer + atmospheric haze) · driven by `DustDensity` & ToD |
| **Post Process Volume (Unbound)** | Lumen GI & Reflections · Exposure: Histogram, **Apply Physical Camera Exposure ON** · Local Exposure ON · Film tonemapper defaults (ACES-like) · ToD-driven grading |
| **Sky Sphere (Night)** | Emissive star/Milky-Way HDRI dome (`M_NightSky_MilkyWay`) behind the atmosphere, brightness × `(1 − SunVisibility)` × `(1 − Moonlight × 0.7)` × `(1 − CloudCover)` |

### 3.1.1 Project-Level Rendering Settings

| Setting | Value | Why |
|---------|-------|-----|
| Dynamic GI | Lumen | — |
| Reflection Method | Lumen | Wet rocks, river, hides |
| **Hardware Ray Tracing** | ON (if supported) · `r.Lumen.HardwareRayTracing 1` | Grass-dense scenes break SDF tracing quality; HWRT handles thin foliage better |
| `r.LumenScene.FarField 1` | ON (HWRT) | Mara vistas see 10+ km. Far Field traces give GI/reflections on distant hills and treelines |
| `r.Lumen.TraceMeshSDFs` | 1 (Software path) | Fallback |
| Mesh Distance Fields | ON · grass **Affect Distance Field Lighting OFF** | Grass in SDFs is expensive and noisy |
| Shadow Map Method | Virtual Shadow Maps | — |
| `r.Shadow.Virtual.SMRT.RayCountDirectional` | 8 (Quality) / 4 (Perf) | Soft penumbra realism at sunrise |
| Substrate | ON (project start) | — |
| Anti-aliasing | TSR | Grass shimmer control |
| `r.Nanite.MaxPixelsPerEdge` | 1 (Quality) / 2 (Perf) | — |
| Auto Exposure Bias Curve | Use custom exposure compensation curve (see §3.5) | Gameplay-driven darkness |

---

## 3.2 GOLDEN HOUR (Sun Elevation −2° → +10°)

### 3.2.1 Visual Direction
- **Extreme long shadows:** at 3–5° elevation, a 6 m acacia throws a ~70–110 m shadow. Termite mounds, grass tufts and every herd animal draw long blue-violet stripes across glowing grass.
- **Colour script:** Sky top deep blue-violet `#3B4A7A` → horizon band `#FF8A3D` → sun disc `#FFB46B` (with a heavily dust-reddened lower limb). Grass rim-lit to **saturated amber `#E8A33C`**; shadows go cool blue-purple `#4C4F7E` (lit by the blue skylight). That warm/cool split *is* the Mara look.
- **Volumetric dust motes:** low-level dust raised by herds; light beams through acacia canopies and around animals; backlit wildebeest columns read as glowing dust ribbons.
- **Silhouettes:** acacias (*Vachellia tortilis*, *V. drepanolobium* whistling thorn, *Balanites*) silhouetted against the sun disc; flatten to near-black via local exposure contrast.

### 3.2.2 Parameters

| Component | Parameter | Sunrise (−2°…+3°) | Golden (+3°…+10°) |
|-----------|-----------|-------------------|--------------------|
| **Sun** | Intensity (lux) | 400 → 4,000 (atmosphere does the attenuation; author the *top-of-atmosphere* ~120,000 lux and let SkyAtmosphere transmittance redden/dim it, **or** if not using "Atmosphere and Cloud" transmittance, use these values) | 4,000 → 30,000 |
| | Temperature (K) | 2,000–2,600 (only if not relying on atmosphere transmittance; else leave 5,800 K) | 2,800–3,800 |
| | Volumetric Scattering Intensity | 4.0 | 2.0 |
| **Sky Atmosphere** | Rayleigh Scattering (color × scale) | (0.175, 0.410, 1.0) × 0.0331 (default) | default |
| | Rayleigh Exponential Distribution | 8 km | 8 km |
| | **Mie Scattering Scale** | **0.010–0.018** (dusty Dry) / 0.006 (Wet) | 0.006–0.012 |
| | Mie Absorption Scale | 0.0010–0.0020 | 0.0008 |
| | Mie Absorption colour | slight blue (absorbs blue → warmer haze) (0.45, 0.6, 1.0) | same |
| | **Mie Anisotropy** | **0.85** (strong forward glow around the sun) | 0.8 |
| | Mie Exponential Distribution | 1.6–2.0 km (dust lofted) | 1.4 km |
| | Multi-Scattering | 1.5 | 1.2 |
| | Aerial Perspective View Distance Scale | 1.5–2.5 (vast hazy depth) | 1.5 |
| **Height Fog** | Fog Density | 0.015–0.03 | 0.01 |
| | Height Falloff | 0.35 (dust hugging ground) | 0.25 |
| | Volumetric Fog Scattering Distribution | **0.75** (forward-scattering beams) | 0.7 |
| | Volumetric Fog Albedo | (1.0, 0.86, 0.70) warm dust | (1.0, 0.9, 0.8) |
| | Volumetric Fog Extinction Scale | 1.5 | 1.0 |
| | View Distance | 8,000 m | 6,000 m |
| | Inscattering Texture | OFF (rely on SkyAtmosphere) | — |
| **Local Fog Volumes** | Placed by PCG along herd paths & riverbanks | Density 0.3–0.6, Height falloff 2.0, warm albedo | — |
| **Exposure** | EV100 target | 9–11 | 11–13 |
| **Local Exposure** | Highlight Contrast Scale 0.8 · Shadow Contrast Scale 0.9 · Detail Strength 1.1 | | |
| **Bloom** | Method: Convolution (cinematics) / Standard (gameplay) · Intensity 0.8 | | |
| **Grading** | White Balance Temp 6,000 K (slightly warmer render), Global Saturation 1.08, Shadows tint toward (0.95, 0.97, 1.08) | | |
| **Lumen** | Final Gather Quality 2.0 (cinematic) / 1.0, Lumen Scene Detail 1.5, Max Trace Distance 20,000 | | |

### 3.2.3 Dust Motes & Light Shafts
- `NS_Atmos_DustMotes`: GPU sprites, 2–5k in a camera-attached 25 m sphere, **lit translucency** (Volumetric Directional mode), size 0.3–1.5 mm (rendered 2–6 px), slow curl-noise drift + wind. Spawn rate × `GoldenHourFactor` × `DustDensity`.
- `NS_Atmos_HerdDust`: per Mass herd cluster (1 emitter per ~200 animals), large soft sheets, writing into **volumetric fog** via a Niagara volumetric fog renderer (or Local Fog Volume actors following herd centroids at low LOD).
- **God rays:** volumetric fog + sun Volumetric Scattering Intensity is the primary method; avoid screen-space light shafts except as a cheap fallback on low specs.

---

## 3.3 MIDDAY HARSHNESS (Sun Elevation > 55°)

### 3.3.1 Visual Direction
- **Vertical shadows:** small dark pools at feet/under canopies; very little form shading on flat ground → the land looks *flat and bleached*. That's intentional: it's hard to read distance and spot predators lying in grass.
- **Overexposed dry grass:** the Dry season grass albedo is high (0.35–0.45 linear for cured grass tops). Let highlights roll toward white with a soft shoulder; skies desaturate toward pale cyan near the horizon.
- **High contrast:** deep shade under trees vs blinding open ground. When the player steps into shade, the eye adapts (exposure +1.5 EV over ~1.5 s) and the shade *opens up*, which is when you spot the leopard resting in the tree.
- **Heat shimmer:** wavering air close to the ground at distance > 60 m, strongest over bare soil/roads/lugga sand, 11:00–16:00, Dry season, and **inferior mirage** puddles at the horizon.

### 3.3.2 Parameters

| Component | Parameter | Value |
|-----------|-----------|-------|
| **Sun** | Intensity | **100,000–120,000 lux** (physical) |
| | Temperature | 5,800–6,000 K (or neutral if atmosphere drives colour) |
| | Volumetric Scattering Intensity | 0.4 |
| **Sky Atmosphere** | Mie Scattering Scale | 0.004 (Wet, crisp) – 0.008 (Dry, hazy) |
| | Mie Anisotropy | 0.75 |
| | Rayleigh Scattering Scale | 0.0331 (default) → 0.036 (Wet season deep blue after rain) |
| | Aerial Perspective View Distance Scale | 1.0 (Wet, crystal-clear distant hills) – 2.0 (Dry, hazy) |
| **Height Fog** | Fog Density | 0.002–0.006 |
| | Volumetric Fog | ON but low (Extinction 0.3) |
| **Sky Light** | Intensity 1.0, Real-time capture | — |
| **Exposure** | EV100 | **14.5–15.5** (Physical) · Min/Max brightness clamp ±1.5 EV around target · Speed Up 3.0, Speed Down 1.0 |
| **Local Exposure** | Highlight Contrast Scale **0.7** (keeps sky from clipping fully) · Shadow Contrast Scale **1.0** (keep shade dark) |
| **Grading** | Global Saturation 0.92 (bleached), Global Contrast 1.12, Highlights Gain (1.05, 1.03, 0.98), Film Shoulder 0.30 (harsher roll-off), Film Toe 0.55, White Balance Temp 6,700 K |
| **Lumen** | Final Gather Quality 1.0 · Lumen Scene Lighting Update Speed 1.0 · Skylight Leaking 0.05 (fill under canopies without flattening) |
| **Contact Shadows** | Sun Contact Shadow Length 0.03 (grass/fur micro-shadowing) |

### 3.3.3 Heat Shimmer Post-Process — `M_PP_HeatShimmer`
- **Blendable location:** Before Translucency (or *Scene Color Before DOF*), priority 0.5.
- **Mask** = `saturate((SceneDepth − 6000) / 8000)` × `GrazingAngleMask (view·up close to 0)` × `GroundProximity (pixel world-Z − landscape height < 3 m, via RVT WorldHeight)` × `MPC.HeatShimmer`.
- **Offset** = `(Noise3D(WorldPos × 0.02 + float3(0, 0, Time × 1.5)).xy − 0.5) × 0.0025 × Mask` applied to `ScreenUV` → sample `SceneTexture:PostProcessInput0`.
- **Inferior mirage:** in the 0–0.4° band just below the horizon over flat ground, blend a flipped, blurred sample of the sky above the horizon (`ScreenUV.y` mirrored around horizon line computed from camera pitch) at 15–30% opacity → "phantom water" lakes the player may walk toward (a dehydration trick).
- `MPC.HeatShimmer` = `smoothstep(26, 34, AirTempC) × SunElevationFactor × (1 − SoilMoisture) × (1 − CloudCover)`.

---

## 3.4 PITCH-BLACK NOCTURNAL (Sun Elevation < −12°)

### 3.4.1 Visual & Experience Direction
- **True darkness.** No "blue movie night." A moonless, overcast Mara night is close to black: you see the horizon line against stars and almost nothing on the ground. Fear comes from **sound and eyeshine**.
- **Moon phase is a gameplay variable.** Field studies of lion attacks on people in Tanzania found they peak in the **dark nights after the full moon** (when the moon rises late, leaving early evening black). The game uses the same rule: predator boldness is highest on the dark early hours of waning-moon nights.
- **Starlight:** with no moon and clear skies, the Milky Way core (prominent in the southern sky Jun–Aug, i.e. the Dry season) gives just enough to see silhouettes against the sky. Ground is unreadable.
- **The torch dilemma:** a torch shows the next 25–40 m but ruins the player's dark adaptation, lights the player up for every predator, and lights up eyeshine.

### 3.4.2 Parameters

| Component | Parameter | Full Moon (clear) | Quarter Moon | New Moon / Overcast |
|-----------|-----------|-------------------|--------------|---------------------|
| **Moon Light** | Intensity (lux) | **0.25** | 0.03–0.08 | 0 |
| | Temperature | 4,100 K (moonlight is physically slightly warmer than sunlight; the *perceived* blue comes from grading) | 4,100 K | — |
| | Source Angle | 0.5° | 0.5° | — |
| | Volumetric Scattering | 1.0 (moonbeam mist near rivers) | 0.5 | — |
| **Sky Light** | Intensity | 0.7 (atmosphere lit by moon) | 0.3 | **0.04** (starlight + airglow ~0.001–0.002 lux) |
| **Star Dome** | Emissive (cd/m²) | 0.0005 (washed by moon) | 0.002 | 0.004 (+ Milky Way) |
| **Exposure** | EV100 | **−2.0 to −1.0** | −3.0 | **Clamp at −3.5 minimum** (*don't* let auto-exposure brighten the image further: that clamp is what creates the darkness) |
| | Exposure Compensation (gameplay curve) | 0 | −0.5 | −1.0 |
| **Grading** | Global Saturation | **0.25–0.35** (scotopic vision: colour fades) | 0.2 | 0.1 |
| | White Balance Temp | 4,500 K (push cool: Purkinje shift) | 4,300 K | 4,300 K |
| | Shadows Gain | 0.9 | 0.85 | 0.8 |
| | Film Grain | Intensity 0.15–0.25, Response midtones (sensor-noise feel; also hides banding in dark gradients) | | |
| **Lumen** | Skylight Leaking | **0.0** (no artificial fill) | 0.0 | 0.0 |
| | Final Gather Quality | 1.0 (dark scenes are noisy: bump to 1.5 if torch GI flickers) | | |
| **Height Fog** | Density | 0.01 near water (valley mist), Volumetric ON so torch beams scatter | | |
| **Eyes** | `M_Eye_Tapetum` retroreflection | Visible at 60–120 m in torch beam | | |

### 3.4.3 Player Light Sources

| Source | Light Type & Settings | Gameplay |
|--------|------------------------|----------|
| **Campfire** | Point light 800–1,500 cd, attenuation 15 m, flicker via Light Function or Niagara-driven intensity, Lumen GI ON, **Cast Volumetric Shadow ON** | Safe radius (hyenas/lions keep ~15–25 m away unless very hungry), reveals the player for 2 km |
| **Torch (Ranger LED)** | Spot light 800–1,200 lm (author ~1,500 cd), inner 8° / outer 22°, IES profile, Volumetric Scattering 1.5 | 40 m view; predator `Noticed` chance ×3; eyeshine detection |
| **Red-filter Torch** | Same, colour (1, 0.05, 0.02), 30% intensity | Preserves dark adaptation; many animals are less disturbed by red light |
| **Burning Brand (Maasai)** | Point 200 cd + ember Niagara | Deters predators (raise above head: Prey-Classification −0.5) |
| **Headlamp** | Spot attached to camera/head socket | Hands free, but it lights wherever you look (giveaway) |

### 3.4.4 Dark-Adaptation System (`UMaraVisionComponent`)
- `DarkAdaptation` 0 → 1 over **~4 real minutes** (real rod adaptation takes 20–30 min; compressed). Raising adaptation lifts the *player's* exposure compensation from −1.0 to +0.8 EV, *within* the global night clamp.
- Looking at the fire or using a white torch: `DarkAdaptation −= 0.5` instantly, then you recover slowly. Red light barely affects it (−0.05).
- Peripheral vision bonus at night: a subtle "averted vision" shader brightens the periphery ~0.3 EV vs centre (the rod-dense retina is a real effect), which teaches the player to look *beside* a suspected threat.

### 3.4.5 Predator Night-Hunting Advantages (AI)

| Mechanic | Implementation |
|----------|----------------|
| **Sight Advantage** | `UAISenseConfig_Sight` range scaled per species by `SightRangeNightMultiplier` (lion 1.8, leopard 2.5, hyena 1.6, crocodile 1.2) vs human player effectively 0.05–0.25 |
| **Player Illumination Read** | Every 0.25 s, sample light at player: `Illum = SunVis + MoonLux×k + LocalLights(GetLightsInRange)` → AI detection ×`lerp(0.3, 3.0, Illum)` (lit players are seen from far away) |
| **Sound Advantage** | Night humidity ↑ & wind ↓ → hearing ranges ×1.4; player footstep noise unchanged |
| **Boldness** | `Predator.Boldness += (1 − MoonFactor) × 0.3 + NightFactor × 0.2` |
| **Hunting Schedule** | Lion `ActivityByHour` peaks 19:00–23:00 and 04:00–06:00; hyena 20:00–04:00; leopard 19:00–05:00 |
| **Ambush placement** | EQS `Context_DarkCover`: cells with low illumination (sampled from a low-res light-probe grid) near the player's predicted path |

---

## 3.5 Time-of-Day Driver (`UMaraTimeOfDaySubsystem`)

```cpp
// Drive all lighting from SUN ELEVATION, never from clock hours. Clock maps to elevation via ephemeris.
void UMaraTimeOfDaySubsystem::UpdateLighting(float GameTimeHours, int32 DayOfYear)
{
    FSunPosition Sun = MaraEphemeris::ComputeSun(-1.49, 35.14, DayOfYear, GameTimeHours); // lat, lon
    FMoonPosition Moon = MaraEphemeris::ComputeMoon(-1.49, 35.14, DayOfYear, GameTimeHours, /*phase out*/ MoonPhase);

    SunLight->SetWorldRotation(Sun.ToRotator());
    MoonLight->SetWorldRotation(Moon.ToRotator());
    MoonLight->SetIntensity(MoonLuxCurve->GetFloatValue(MoonPhase) * FMath::Clamp(FMath::Sin(FMath::DegreesToRadians(Moon.Elevation)), 0.f, 1.f));

    const float E = Sun.ElevationDeg;
    const FMaraToDRow Row = ToDCurveTable->EvaluateAtElevation(E, ClimateState.DustDensity, ClimateState.SeasonAlpha);

    SkyAtmo->SetMieScatteringScale(Row.MieScale);
    SkyAtmo->SetMieAnisotropy(Row.MieAnisotropy);
    SkyAtmo->SetMieExponentialDistribution(Row.MieExpKm);
    HeightFog->SetFogDensity(Row.FogDensity);
    HeightFog->SetVolumetricFogScatteringDistribution(Row.VolScatterDist);
    HeightFog->SetVolumetricFogAlbedo(Row.VolAlbedo);
    PPV->Settings.AutoExposureMinBrightness = Row.EVMin;   // EV100 when "Extended Default Luminance Range" is on
    PPV->Settings.AutoExposureMaxBrightness = Row.EVMax;
    PPV->Settings.ColorSaturation = Row.Saturation;
    PPV->Settings.WhiteTemp = Row.WhiteTemp;
    // ... local exposure, grain, bloom, heat shimmer
    SkyLight->RecaptureSky(); // Real Time Capture handles this automatically; only call for non-RTC fallback
}
```

**Curve Table `CT_ToD_Mara` keyed by Sun Elevation (°):** `−18, −12, −6, −3, 0, 3, 6, 10, 20, 35, 55, 90`, with a second axis for `DustDensity` (0, 0.5, 1) and `SeasonAlpha` (0, 1), trilinearly blended. This keeps the look stable whether the player changes the day length or not.

### 3.5.1 Quick-Reference: The Mara Day

| Clock (approx.) | Elevation | Phase | Mood | Gameplay |
|-----------------|-----------|-------|------|----------|
| 05:45–06:10 | −12° → −6° | Nautical → civil twilight | Deep blue, silhouettes | Predators finishing night hunts: most dangerous transit window |
| 06:10–06:30 | −6° → 0° | Civil twilight (short!) | Magenta-orange horizon band | Dawn chorus (ground hornbill, francolins), sandgrouse to water |
| 06:30–07:15 | 0° → 10° | **Golden hour** | Long shadows, dust motes | Cheetah hunt window opens; best tracking light (low-angle shadows reveal prints: tracking UI bonus +40%) |
| 07:15–10:00 | 10° → 50° | Morning | Clear, warm | Herds graze, cheetahs hunt |
| 10:00–15:30 | > 55° | **Midday harshness** | Flat, bleached, shimmer | Predators rest (safest travel *from predators*, worst for heat); elephants at water |
| 15:30–17:50 | 50° → 10° | Afternoon | Warming, storms build (Wet) | Storm risk peak (Wet season); cheetah second window |
| 17:50–18:40 | 10° → 0° | **Golden hour** | Saturated amber, longest shadows | Lions wake, hyenas leave dens |
| 18:40–19:05 | 0° → −6° | Civil twilight | Red-violet afterglow | Make camp NOW |
| 19:05–05:45 | < −12° | **Night** | True dark | Predators' world |
