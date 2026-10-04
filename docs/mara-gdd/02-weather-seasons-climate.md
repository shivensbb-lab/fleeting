# 02 — Weather, Seasons & Climate Systems

## 2.0 Real-World Grounding → Game Abstraction

The real Mara has a **bimodal** rainfall pattern (~1,000–1,200 mm/yr, falling toward the southeast): *long rains* (Mar–May), *short rains* (Nov–Dec), and a main dry season (Jun–Oct, the peak of the Great Migration). The design brief calls for a **2-season cycle**, so we compress it into two macro-seasons with one transitional *Break* phase on each side. The game reads as two seasons but keeps the dramatic "first storm" and "last waterhole" moments.

| Game Season | Real-World Analogue | In-Game Length (default) | Signature |
|-------------|---------------------|---------------------------|-----------|
| **The Great Dry** (`Season.Dry`) | Jun–Oct | 14 in-game days | Golden grass, dust, migration river crossings, concentrated water, peak predator success, bushfires |
| ↳ *Break of Rains* (`Season.Transition.WetOnset`) | Late Oct–Nov | 2 days | Towering cumulonimbus, lightning fires, first-storm flash floods, termite alate emergence |
| **The Long Rains** (`Season.Wet`) | Mar–May (+ Nov–Dec merged) | 14 in-game days | Green flush, mud, swollen rivers, mosquitoes, dispersed herds, poor visibility, croc-filled floodwater |
| ↳ *Drying* (`Season.Transition.DryOnset`) | Jun | 2 days | Grass sets seed, rivers fall, waterholes shrink, herds start moving north |

> Default **1 in-game day = 48 real minutes** (Day 32 min / Night 16 min; tunable). One full annual cycle ≈ 32 in-game days ≈ 25.6 real hours.

### 2.0.1 Seasonal Parameter Table (Baselines; weather events add on top)

| Parameter | Great Dry | Long Rains | Unit / Notes |
|-----------|-----------|------------|--------------|
| Midday air temperature | 28–33 | 22–27 | °C (Mara sits at ~1,500–2,100 m elevation, so it isn't as hot as people expect) |
| Night minimum | 10–14 | 14–16 | °C (dry nights are *cold*: a real hypothermia risk) |
| Relative humidity (midday) | 25–40% | 60–90% | Drives sweat efficiency |
| Daily rain probability | 3–8% | 55–80% | Afternoon convective peak 14:00–18:00 |
| Mean storm intensity | — | 10–60 | mm/h |
| Wind (mean / gust) | 3–6 / 12 | 2–5 / 20 (storm outflow) | m/s; dry season prevailing E/SE trades |
| Grass height (open plains) | 20–120 (seed heads, golden) → grazed to 5 | 10 → 80 (green, fast growth) | cm |
| Soil moisture (0–1) | 0.05–0.2 | 0.5–1.0 | Feeds mud, wetness, grass growth |
| River stage (Mara River) | 0.6–1.5 | 2–5 (flash peaks 6+) | m depth at crossings |
| Waterhole count active | 15–30% | 100% | Of all authored waterhole Smart Objects |
| Fire risk index | 0.4–0.95 | 0.0–0.1 | Function of fuel load × dryness × wind |
| Disease vector index | 0.2 | 0.8–1.0 | Mosquito/tsetse/waterborne |

---

## 2.1 The Climate Simulation Core

### 2.1.1 `UMaraClimateSubsystem` (C++ `UTickableWorldSubsystem`)

```cpp
// MaraClimate/Public/MaraClimateSubsystem.h
USTRUCT(BlueprintType)
struct FMaraClimateState
{
    GENERATED_BODY()
    UPROPERTY(BlueprintReadOnly) FGameplayTag Season;          // Season.Dry / Season.Wet / Season.Transition.*
    UPROPERTY(BlueprintReadOnly) float SeasonAlpha = 0.f;      // 0 = full dry, 1 = full wet (smoothed)
    UPROPERTY(BlueprintReadOnly) float AirTempC = 25.f;
    UPROPERTY(BlueprintReadOnly) float RelativeHumidity = 0.4f;
    UPROPERTY(BlueprintReadOnly) float RainRate_mmh = 0.f;
    UPROPERTY(BlueprintReadOnly) float CloudCover = 0.f;        // 0..1
    UPROPERTY(BlueprintReadOnly) FVector2D WindDir = {1,0};    // normalized XY
    UPROPERTY(BlueprintReadOnly) float WindSpeed_ms = 3.f;
    UPROPERTY(BlueprintReadOnly) float DustDensity = 0.f;       // 0..1
    UPROPERTY(BlueprintReadOnly) float HeatIndexC = 25.f;
};

DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnSeasonChanged, FGameplayTag, NewSeason);
DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnWeatherEvent, const UMaraWeatherEventDefinition*, Event);

UCLASS()
class MARACLIMATE_API UMaraClimateSubsystem : public UTickableWorldSubsystem
{
    GENERATED_BODY()
public:
    virtual void Tick(float DeltaTime) override;
    virtual TStatId GetStatId() const override { RETURN_QUICK_DECLARE_CYCLE_STAT(UMaraClimateSubsystem, STATGROUP_Tickables); }

    UFUNCTION(BlueprintPure) const FMaraClimateState& GetState() const { return State; }
    UFUNCTION(BlueprintPure) float SampleSoilMoisture(const FVector& WorldPos) const;   // bilinear from grid
    UFUNCTION(BlueprintPure) float SampleRainfall7Day(const FVector& WorldPos) const;   // drives migration
    UFUNCTION(BlueprintCallable) void ForceWeatherEvent(UMaraWeatherEventDefinition* Event, FVector Origin);

    UPROPERTY(BlueprintAssignable) FOnSeasonChanged OnSeasonChanged;
    UPROPERTY(BlueprintAssignable) FOnWeatherEvent  OnWeatherEventStarted;

private:
    void StepSeason(float GameHoursDelta);
    void StepWeatherCells(float GameHoursDelta);     // moving convective cells (rain is local!)
    void StepSoilMoistureGrid(float GameHoursDelta); // rain in, evaporation + runoff out
    void PushToMPC();                                // ~10 Hz, not every frame
    void PushToRenderTargets();                      // wetness / puddle / burn RTs

    FMaraClimateState State;
    TArray<FMaraStormCell> StormCells;               // position, radius, intensity, velocity (advected by wind)
    TArray<float> SoilMoistureGrid;                  // 128×128 over 16 km (125 m cells)
    TArray<float> Rainfall7DayGrid;                  // rolling accumulation
    UPROPERTY() TObjectPtr<UMaterialParameterCollection> ClimateMPC;
    UPROPERTY() TObjectPtr<UTextureRenderTarget2D> WetnessRT;   // R=soil moisture, G=puddle, B=burn, A=snow-free(unused)/mud
};
```

**Key design decision: rain is *local*.** A storm is a moving `FMaraStormCell` (radius 2–8 km, lifespan 30–120 game-min, advected by wind). Your position may stay dry while the upstream catchment floods. That one decision powers the **flash-flood** mechanic and makes the sky readable: you can *see* a storm 20 km away and work out whether it's coming toward you.

### 2.1.2 Material Parameter Collection — `MPC_MaraClimate`

| Scalar / Vector | Range | Consumers |
|-----------------|-------|-----------|
| `SeasonAlpha` | 0–1 | Grass/foliage colour ramp (golden → green), landscape albedo, leaf density |
| `GlobalWetness` | 0–1 | Rain-surface darkening at player location (fast) |
| `RainIntensity` | 0–1 | Ripples, rain streaks on rocks/hides, splash Niagara spawn rate |
| `WindDirSpeed` | float4 (x, y, speed, gust) | Grass/tree WPO, dust, Niagara wind, Groom wind (animal fur) |
| `DustDensity` | 0–1 | Fog colour/density, dust coat on surfaces, character dust layer |
| `HeatShimmer` | 0–1 | Post-process distortion (§03) |
| `BurnFrontTime` | float | Ember/char animations |
| `WorldBoundsMinMax` | float4 | UV mapping for climate RTs (WetnessRT, GrassHeightRT, BurnRT) |
| `WaterLevelOffset_Mara` | −2…+6 m | River surface vertex offset & bank wetness line |
| `CloudShadowOffset` | float2 | Cloud shadow scroll (Volumetric Clouds already cast shadows; this drives a cheap far-field fallback) |

> **Update policy:** CPU writes the MPC at 10 Hz with critically-damped smoothing (`FMath::FInterpTo` with per-parameter speed). Wetness *rising* is fast (≈ 2–4 game-min to wet), *drying* is slow and depends on temperature, wind and sun (≈ 30–180 game-min).

---

## 2.2 Dynamic Weather Events

Each event is a `UMaraWeatherEventDefinition` data asset: trigger conditions, spawn shape, duration curve, MPC overrides, Niagara systems, audio, gameplay effects (GAS), and AI reactions.

### 2.2.1 Event Catalogue

| Event | Season / Trigger | Warning Signs (player-readable) | Duration | Gameplay Impact |
|-------|------------------|----------------------------------|----------|------------------|
| **Convective Thunderstorm** | Wet (55–80% daily), Transition | Cumulonimbus anvil towers from 11:00, wind shift + temperature drop 5–8 °C (outflow gust), petrichor audio | 30–120 min | Visibility 150–400 m, noise masking (stealth bonus), lightning strikes, local flooding |
| **Flash Flood (Lugga Surge)** | Wet/Transition; rain > 25 mm/h **upstream** within catchment | Distant storm over hills, rising roar (low rumble at −90 s), debris foam, sudden turbidity, animals leaving lugga | Wavefront arrives over 30–90 s; peak 15–40 min | Lethal in channels; carries the player (Water physics + drowning stamina); reshapes crossings; strands animals |
| **Dust Storm / Haboob-like Front** | Dry; WindSpeed > 12 m/s + soil moisture < 0.1 + low grass (grazed) | Brown wall on the horizon, birds flying ahead, pressure drop audio, herds bunching | 10–40 min | Visibility 10–50 m, eye/respiratory status, scent dispersal (scent range ×0.3: predators *and* player can't smell/see), navigation by compass/landmarks |
| **Dust Devils** | Dry, 11:00–16:00, high surface heating | Visible spiral columns | 1–5 min each | Ambient; minor eye irritation; can carry embers (fire spread) |
| **Severe Heatwave** | Dry, multi-day blocking high | Heat haze from 09:00, animals in shade all day, cicada audio peak | 2–5 days | +4–7 °C, dehydration ×1.8, predators rest deeper (safer midday), water sources evaporate 2× faster |
| **Lightning-Induced Bushfire** | Transition (dry fuel + first storms: "dry lightning"), Dry (rare) | Strike flash + smoke column; vultures/marabou/kori bustards and drongos fly *toward* fire (insect feast) | Hours; front advances 0.5–3 km/h (wind-driven up to ~10 km/h in grass) | Burns grass, inventory/camp loss, smoke inhalation, panicked animals (stampede), **post-burn green flush** draws grazers 3–7 days later |
| **Cold Clear Night** | Dry, clear sky radiative cooling | Clear stars, early dew | Night | Night min 8–10 °C, hypothermia if wet + windy |
| **Morning Ground Fog** | Transition / Wet mornings near rivers | Mist in valleys at dawn | Dawn → 08:30 | Visibility 30–80 m near rivers. Superb atmosphere, deadly croc/hippo encounters |
| **Hailstorm** **(R)** | Wet, high CAPE storms at elevation | Greenish storm light, roar | 5–15 min | Damage over time without shelter, flattens grass |

### 2.2.2 Flash-Flood Implementation

```
1. StormCell over catchment polygon C (authored per lugga/river: Spline + catchment area A_km²).
2. Runoff Q(t) = RainRate × A × RunoffCoeff(soil moisture)          // dry crusted soil → high runoff at first storm!
3. Route with a simple unit hydrograph: delay = ChannelLength / WaveCelerity (≈ 2–5 m/s)
4. At each channel segment: Stage(t) = StageBase + k × Q(t)^0.6     // Manning-like stage–discharge
5. Push Stage into:
   a) Water Body spline metadata (river segments) or water-level offset (MPC + physics volume)
   b) Flood hazard volumes (UMaraFloodVolume: current velocity → force on characters/animals)
   c) AI: herds/animals in channel get UrgentFlee; crocodiles/hippos are displaced downstream
6. Telegraph: MetaSound "Flood Roar" with distance attenuation along spline 60–90 s before arrival.
```

### 2.2.3 Bushfire Implementation — Cellular Fuel Grid
- **Grid:** 512×512 cells (31.25 m) over the map, streamed around the player at a finer 4 m local grid (128×128 = 512 m window) for visuals.
- **Cell state:** `FuelLoad` (from PCG grass biomass + `SeasonAlpha` curing), `Moisture`, `State {Unburnt, Igniting, Burning, Smouldering, Burnt}`.
- **Spread:** Rothermel-inspired simplification: `ROS = R0 × (1 + Cw × WindSpeed^b × cos(θ)) × (1 + Cs × tan(slope)) × (1 − Moisture/Mx)`.
- **Rendering:** Niagara fire-front ribbons spawned along burning cell borders (GPU); embers via sprite particles carried by wind; burnt cells write into `BurnRT` → landscape material blends char/ash; PCG grass reads `BurnRT` and swaps to stubble meshes (or GPU-cull instances where `Burn > 0.5`).
- **Ecology hooks:** fire front = `Stimulus.Fear` for Mass herds (flee perpendicular to front, upwind if possible). Post-burn: grazing quality spikes 3–7 days later (green flush) → attracts topi, Tommies, wildebeest, plus predators.
- **Player use:** players may set **controlled burns** (fire-stick) to create firebreaks around camp or flush game. Burns spread by the same rules and can escape.

---

## 2.3 Survival Penalties (Climate-Driven)

All implemented as **GAS Gameplay Effects** on `UMaraVitalsAttributeSet` (`CoreTempC`, `Hydration`, `Calories`, `Stamina`, `Fatigue`, `Health`, `Infection`), with HUD-less diegetic feedback first (breathing, vision, audio, animation), and an optional minimal HUD.

### 2.3.1 Thermal Model (Heat Balance)

> Applies to the guide **and every guest**. Guest heat stress lowers `Comfort` and can escalate to a medical emergency on long midday drives or walks (§07.7.2, §07.10). Shade stops, cold drinks and drive timing are guiding decisions.

```
dCoreTemp/dt = (M + R_sun + R_ground + C_air − E_sweat − E_resp) / (Mass × c_body)

M        = metabolic heat (rest 100 W, walk 300 W, run 800–1000 W, carrying load +20–60%)
R_sun    = SolarLoad × (1 − ShadeFactor) × ClothingSolarAbsorptance     // shúkà red: moderate absorptance, good coverage
C_air    = h × (AirTemp − SkinTemp) × ExposedArea × WindFactor
E_sweat  = min(SweatRate(Hydration), EvapCapacity(Humidity, Wind))     // high humidity → sweat doesn't evaporate
```

| Status | Trigger (Core Temp) | Effects |
|--------|---------------------|---------|
| Heat Stress | > 37.8 °C | Stamina regen −25%, mild vignette, heavier breathing audio |
| **Heat Exhaustion** | > 38.8 °C | Stamina max −40%, aim sway ×2, dizzy screen tilt, sweat sheen ↑ (Substrate skin wetness) |
| **Heat Stroke (Hyperthermia)** | > 40.0 °C | Confusion: HUD/compass jitter, auditory hallucinations, random stumbles, Health −1%/min; **collapse at 41.5 °C** (Fail state unless cooled) |
| Cold Stress | < 36.0 °C | Shivering (aim sway), stamina regen −15% |
| **Hypothermia** | < 35.0 °C | Movement −20%, fine-motor failure (crafting fails 30%), Health drain; mostly from wet clothes + wind on dry-season nights |

**Cooling actions:** shade (−60% solar), shúkà draped over head (−35% solar), wetting the shúkà (evaporative cooling ×1.5 in dry air, nearly useless in humid rain season), rest (M→100 W), drinking.

### 2.3.2 Dehydration

| Hydration % | Body water deficit | Effects |
|-------------|--------------------|---------|
| 100–80 | 0–2% | None |
| 80–60 | 2–4% | Thirst audio, sweat rate −10%, stamina −10% |
| 60–40 | 4–6% | Headache (subtle pulsing vignette), heat tolerance −1 °C, crafting time +20% |
| 40–20 | 6–10% | Blurred peripheral vision (radial blur PP), stumbles, Health −0.5%/min |
| < 20 | > 10% | Collapse risk, Health −2%/min |

Water loss rates: base 0.1 L/h at rest/night; walking in midday Dry 0.8–1.2 L/h; running up to 1.5–2 L/h; heatwave ×1.8. Maasai-craft calabash (gourd) holds 1.5 L; ranger bottle 1 L; jerrycan 20 L (camp only, heavy).

### 2.3.3 Mud-Tracking Physics (Wet Season)

**Data:** each landscape layer has a `UMaraSurfaceDefinition` (extends `UPhysicalMaterial`): `MudSusceptibility` (black cotton soil = 1.0, red loam = 0.6, sandy/kopje gravel = 0.1), `SinkDepthMax_cm`, `Suction`.

**Runtime mud factor (per foot trace):**
```
MudFactor = SoilMoisture(at position) × MudSusceptibility × (1 − GrassRootCover × 0.4)
SinkDepth = MudFactor × SinkDepthMax_cm × (CarriedWeight / BaseWeight)^0.5
SpeedMultiplier = lerp(1.0, 0.35, MudFactor)    // black cotton soil: famously deep and sticky
StaminaCostMultiplier = lerp(1.0, 2.2, MudFactor)
```

| System | Implementation |
|--------|----------------|
| **Movement** | Custom `UMaraCharacterMovementComponent` with `GetMaxSpeed()` × `SpeedMultiplier`; suction impulse on foot lift (anim notify `FootLift` → brief root-motion stall) |
| **Animation** | Locomotion blend space axis `MudDepth` → high-knee "slog" gait; Control Rig foot IK lets the foot sink (offset target −SinkDepth) |
| **Footprints** | Write to **RVT displacement + decal** (deep prints persist in mud for in-game days and fill with water → puddles; crisp prints in drying mud = *best tracking conditions*) |
| **Material** | Substrate layered mud slab on character boots/legs: `MudCoverage` param accumulates with distance walked in mud, washes off in rivers/rain |
| **Animals** | Mass agents read same `MudFactor`; heavy animals (buffalo, elephant) slowed less; **herd trails churn mud** (increase MudFactor along migration paths) |
| **Vehicles (late game)** | Chaos Vehicle tyre friction from same surface definition; vehicle-stuck states → winch/sand-ladder gameplay |
| **Tracking** | Mud makes the player *trackable* too: predators following scent + prints (Hyenas track the player's trail at night) |

### 2.3.4 Waterborne & Vector Disease Model

Every water source has a `UMaraWaterQualityComponent`:

| Property | Notes |
|----------|-------|
| `Flow` (0–1) | Flowing river > pool > stagnant waterhole |
| `Turbidity` | Rises after floods, wallowing, herd crossings |
| `FaecalLoad` | Rises with animal density (hippo pools, wildebeest crossings, carcasses in water) |
| `Stagnation Days` | Days since last flow/rain refresh |
| `PathogenRisk` = f(FaecalLoad, Stagnation, Temp, Carcass nearby) | 0–1 |

| Disease | Source | Incubation (game-hours) | Symptoms (gameplay) | Treatment |
|---------|--------|--------------------------|----------------------|-----------|
| **Gastroenteritis / Cholera-like** | Untreated stagnant/faecal water | 6–24 | Hydration drain ×3, stamina −30%, frequent "stops" | ORS (oral rehydration salts), boiled water, rest |
| **Typhoid-like fever** | Contaminated water/food | 48–96 | Fever (Core Temp +1.5 °C), fatigue, delirium visuals | Antibiotics (lodge clinic / flying-doctor evacuation) |
| **Giardiasis** | Clear-looking stream water | 24–72 | Calorie absorption −40% | Antibiotics |
| **Schistosomiasis (Bilharzia)** | *Wading/bathing* in still freshwater (snail habitat) | Long (days) | Slow fatigue/health max decline | Praziquantel (lodge clinic / flying-doctor evacuation); avoid still-water wading |
| **Leptospirosis** | Floodwater + rodent contamination (wet season) | 48–120 | Fever, muscle pain (stamina) | Antibiotics |
| **Malaria** | *Anopheles* bites, wet season, dusk–dawn | 7–14 game days (compressed) | Cyclic fever spikes, chills | Mosquito net (prevention), repellent, antimalarials |
| **Trypanosomiasis** | Tsetse bites (riverine/woodland) | Long | Progressive fatigue, sleep attacks | Ranger station; avoid dark blue/black clothing, tsetse traps |
| **Tick-borne fever** | Ticks in tall grass | 72–168 | Fever, rash | Tick checks at camp, doxycycline |

**Purification:** boiling (fuel + time), charcoal/sand gourd filter (reduces turbidity, *not* pathogens fully), chlorine tablets (ranger), solar disinfection (SODIS, clear bottle 6 h of sun, Dry season only), and digging a "sand well" in a dry lugga bed (sand-filtered: lower risk; real pastoralist technique).

---

## 2.4 UE5 Technical Implementation

### 2.4.1 Landscape Material Wetness (Substrate)

**Master material `M_Land_Savannah_Master` (Substrate, Landscape, RVT output):**

```
Layers (Landscape Layer Blend, weight-blended):
  L_RedLoam, L_BlackCottonSoil, L_SandyLugga, L_GraniteGravel, L_ShortGrassSoil, L_TrailCompacted, L_Burnt

Per-pixel climate inputs:
  SoilMoisture = Sample(WetnessRT.R, WorldUV)                 // from climate grid (slow)
  SurfaceWet   = max(SoilMoisture * 0.6, MPC.GlobalWetness * RainExposure)
  Puddle       = saturate((SoilMoisture - 0.7) * 6) * HeightMaskInverted(heightmap AO / material height)
  Burn         = Sample(WetnessRT.B, WorldUV)

Substrate graph:
  Base slab (per-layer albedo/roughness/normal)
     → Wet modification:
         Albedo      *= lerp(1.0, 0.45, SurfaceWet * Porosity)          // porous soils darken more
         Roughness    = lerp(Rough, 0.15, SurfaceWet)
         Normal       = lerp(Normal, FlatNormal, Puddle)
     → Vertical layer (Substrate "Coat"/top slab): Water film slab
         Thickness = Puddle * 0.02; Roughness 0.02; rain ripple normal (flipbook) * MPC.RainIntensity
     → Horizontal mix: Burnt char/ash slab by Burn mask
     → Dust coat (Dry season): thin top slab, albedo #C9A57A, rough 0.9, Coverage = (1 - SoilMoisture) * MPC.DustDensity * UpFacing
```

**Rules:**
- *Porosity map* per layer: black cotton soil darkens heavily (to near-black), granite barely changes but goes glossy.
- *Height-aware puddles:* sample the landscape heightfield's local curvature (precomputed "concavity" mask baked from heightmap via Gaea/World Machine or a PCG/Editor utility) so water collects in hollows, ruts, hippo trails and footprints (RVT displacement).
- *RVT:* output BaseColor/Specular/Roughness/Normal/WorldHeight into `RVT_Landscape` so grass and rocks can **blend into the ground** (grass base colour sampling, rock-ground contact wetness).
- Keep the wetness math in a **Material Function** `MF_Climate_Wetness` reused by rocks, trees (bark darkening), props, animal hides and character clothing (shúkà dark-red when wet).

### 2.4.2 Rivers & Water Volume Modulation

UE's Water plugin bakes the river mesh and the water info texture when a spline changes, which is expensive. Changing every spline point continuously at runtime is a hitch risk. Use a **three-tier approach**:

| Tier | Change Speed | Technique |
|------|--------------|-----------|
| **1. Continuous level offset (cheap, every frame)** | ± 1.5 m smooth | `MPC.WaterLevelOffset_<River>` → World Position Offset in a duplicated water material (`M_Water_River_Mara`), **plus** move a matching `APhysicsVolume`/custom buoyancy height and a post-process underwater volume |
| **2. Flood stages (discrete, World Partition Data Layers)** | Stage swaps 3–5 per season | Author 4 river states as separate Water Body splines in Data Layers: `DL_River_Low`, `DL_River_Normal`, `DL_River_High`, `DL_River_Flood`. Cross-fade during a heavy-rain whiteout or at night via a dissolve in the water material |
| **3. Runtime spline edit (rare, hero moments)** | One-off | Edit `UWaterSplineMetadata` (Depth, RiverWidth, WaterVelocityScalar per point) on a short local water body near the player, then refresh the water body; budget this to scripted or off-screen moments only |

```cpp
// Tier 1: driven from the climate subsystem each 0.1 s
void UMaraRiverController::ApplyStage(float StageMeters)
{
    const float Offset = StageMeters - BaselineStageMeters;
    UKismetMaterialLibrary::SetScalarParameterValue(this, ClimateMPC, RiverOffsetParamName, Offset);
    SurfaceProxy->SetSurfaceZ(BaselineSurfaceZ + Offset * 100.f);   // custom UMaraWaterSurfaceProxy: swim/buoyancy/underwater PP height (cm)
    CurrentVelocityScale = FMath::GetMappedRangeValueClamped({0.5f, 6.f}, {0.4f, 3.0f}, StageMeters);
    FloodHazard->SetForceScale(CurrentVelocityScale);                          // pushes characters/animals
    UpdateDataLayerStage(StageMeters);                                          // tier 2 thresholds with hysteresis
}
```

- **Bank wetness line:** landscape material samples `WaterLevelOffset` + water body distance field to paint a darkened, glossy band 0.3–1.0 m above the current surface (the "high-water mark" persists after the water recedes, decaying over days).
- **Turbidity:** water material absorption/scattering coefficients interpolate: Dry = greenish-brown clearer (visible crocs at < 1 m), Flood = opaque chocolate-brown (*Mara flood colour*), and foam/debris Niagara.
- **Waterholes:** these are Water Body Lakes with radius/level driven by `WaterholeVolume` (L) → surface area → level. They shrink to cracked-mud basins (decal + landscape "Dried Pan" layer weight via RVT) in the Dry season.

### 2.4.3 Rainfall → Animal Migration Triggers

```
Rainfall7DayGrid (Climate)
   └→ GrassGrowthModel (MaraEcology): GrassBiomass += Growth(SoilMoisture, Temp) − Grazing − Burn
         └→ GrazingQualityGrid = f(GrassBiomass, GreenFraction = SeasonAlpha-local, Nitrogen bonus post-burn/post-rain)
               └→ MigrationFlowField (eikonal solve every 6 game-hours, async on worker thread)
                     Cost = 1/(GrazingQuality + ε) + WaterDistanceCost + PredatorDensityCost×0.3 + SlopeCost
                     Attractors = top-N grazing quality cells + reachable water
                         └→ Mass herds read flow field (§01 Migration System)
```

| Trigger | Condition | Herd Response |
|---------|-----------|---------------|
| **Northward Pull** | Southern off-map pool `Rainfall7Day < 10 mm` AND northern grazing quality > 0.6 | Spawn waves from south boundary (statistical → Mass) |
| **Crossing Pressure** | Grazing quality across river > current side by 25%+ | Accumulate at crossing points (hesitation model) |
| **Return South** | `SeasonAlpha > 0.35` (rains returning) in the south pool | Flow field attractor flips south; herds stream out over 3–5 days |
| **Local Storm Attraction** | Distant storm visible (lightning) + subsequent green-up | Herds *walk toward storms*: wildebeest are thought to respond to distant rain/lightning, a real behaviour hypothesis worth using |
| **Burn Green Flush** | `BurnRT` cells 3–7 days old | Local short-term attractor (topi, gazelle, wildebeest) |
| **Drought Concentration** | < 20% waterholes active | Herds pinned within 3 km of the Mara River → predator density spike → "killing fields" |

### 2.4.4 Blueprint Exposure (Designer Hooks)
- `BP_WeatherDirector` (one per level): exposes `SeasonLengthDays`, `StormFrequencyCurve`, `EventDeck` (weighted list of `UMaraWeatherEventDefinition`), `DifficultyScalar` for penalty strengths.
- Event `OnWeatherEventStarted(Event)` → Level Blueprint/StateTree global tasks for narrative beats (for example a ranger radio warning before a flood: "Lugga is coming down!").
- Console commands (dev): `Mara.Climate.SetSeason Wet`, `Mara.Climate.SpawnStorm 2000 1.0`, `Mara.Climate.Flood TalekRiver 4.5`, `Mara.Climate.Ignite`.

### 2.4.5 Weather Visual Stack (Per Event)

| Layer | Technology |
|-------|-----------|
| Clouds | **Volumetric Cloud** component, material `M_VolCloud_Mara` with `CloudCoverage`, `CumulonimbusMask` (localised storm towers from StormCells written to a 2D RT → cloud weather map), anvil shaping by altitude gradient |
| Rain | Niagara GPU rain (camera-attached volume 60 m, 80–120k particles at peak) + screen-space droplets on camera only in first-person/photo mode + distant **rain shafts** (volumetric fog local volumes or "rain curtain" cards under storm cells) |
| Lightning | Directional light flash (secondary light, intensity spike 1–3 frames) + emissive bolt mesh + delayed thunder (distance / 343 m·s⁻¹) |
| Dust | Exponential Height Fog colour & density lerp + **Local Fog Volumes** (UE 5.3+) for dust fronts + Niagara dust sheets with depth fade |
| Wet surfaces | MPC → `MF_Climate_Wetness` everywhere |
| Wind | `MPC.WindDirSpeed` → grass/trees WPO, Groom wind on fur (Chaos/Groom physics wind), Chaos Cloth wind for the shúkà |
