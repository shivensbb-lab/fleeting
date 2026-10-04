# MARA — Savannah Survival
## Game Design & Technical Framework (Core Development Blueprint)

**Target:** Photoreal open-world survival · **Engine:** Unreal Engine 5.5+ (Nanite, Lumen, PCG, Substrate, Mass, StateTree, World Partition) · **DCC:** Blender 4.x
**Setting:** Maasai Mara National Reserve, its adjoining community conservancies, and the Mara River corridor (Narok County, Kenya)

---

### Document Map

| # | Document | Scope |
|---|----------|-------|
| 00 | [This file](./README.md) | Vision, pillars, global architecture, naming conventions, performance budgets |
| 01 | [Fauna Register](./01-fauna-register.md) | Every species by tier: threat level, AI behaviour, Blender modelling notes |
| 02 | [Weather, Seasons & Climate](./02-weather-seasons-climate.md) | Two-season cycle, dynamic events, survival penalties, UE5 implementation |
| 03 | [Lumen, Lighting & Time of Day](./03-lighting-time-of-day.md) | Golden hour, midday, nocturnal: exact component parameters |
| 04 | [Procedural Biomes (PCG)](./04-pcg-biomes.md) | Grasslands, riverine forest, kopjes: graph structures and density rules |
| 05 | [Inventory, Crafting & Survival](./05-survival-crafting-senses.md) | Traditional + ranger gear, health model, Stealth & Scent system |
| 06 | [Art Direction: Reference Board](./06-art-direction-references.md) | Mood-board breakdown → engine parameters, palette, accuracy warnings, look-dev tests |

---

## 1. Vision Statement

> *You are small. The Mara is not.*

A grounded, ecologically accurate survival game. The player is one human, on foot, in one of Earth's densest large-mammal ecosystems. The game isn't about killing the ecosystem. It's about **reading** it: wind, tracks, birds, the behaviour of herds. The Mara is beautiful and indifferent. Every system feeds one loop:

```
OBSERVE (senses, tracks, birds, wind) → DECIDE (route, shelter, water, risk)
     → ACT (move, craft, hide, deter) → CONSEQUENCE (ecosystem reacts) → OBSERVE
```

### Design Pillars

| Pillar | Meaning | Systems that serve it |
|--------|---------|------------------------|
| **Ecological Truth** | Animals behave like real animals: they flee, threat-display and bluff far more often than they attack. | Mass herds, StateTree predators, scent model, fear/flight-distance model |
| **The Land Is the Clock** | Season, rainfall and time of day decide everything: where water is, where herds are, who hunts. | Climate subsystem, MPC-driven materials, migration flow field |
| **Knowledge Is the Weapon** | The player gets stronger mostly by learning, not through stat levelling. | Tracking, field journal, bird-alarm interpretation, Maasai craft knowledge |
| **Respectful Authenticity** | Maasai culture is shown with consultation and accuracy, never as costume. | Cultural advisory board, crafting lore, voice casting, revenue/credit agreements |

> **Cultural & Conservation Note (production requirement):** Hire paid Maasai cultural consultants (for example through community conservancy partnerships) from pre-production onward. Don't make traditional lion hunting (*olamayio*) a gameplay reward. Today's Maasai-led conservation (for example the Lion Guardians model) is a much stronger and more respectful narrative frame. Poaching appears as something you oppose, never as a player option.

---

## 2. Global Technical Architecture

### 2.1 Module Layout (C++)

| Module | Type | Responsibility |
|--------|------|----------------|
| `MaraCore` | Runtime | Game instance, save system, global tags (`GameplayTags`), data registries |
| `MaraClimate` | Runtime | `UMaraClimateSubsystem` (season, rainfall, temperature, wind, soil moisture grid), MPC driver |
| `MaraTimeOfDay` | Runtime | Sun/moon ephemeris (lat −1.49°, long 35.14°), sky/light/fog/exposure driver |
| `MaraEcology` | Runtime | Mass Entity herds, migration flow fields, grazing-quality grid, carcass ecosystem |
| `MaraAI` | Runtime | StateTree tasks, custom AI senses (`UAISense_Scent`), EQS contexts, Smart Objects |
| `MaraSurvival` | Runtime | Vitals components (GAS attributes), status effects, disease model |
| `MaraCrafting` | Runtime | Recipe data assets, inventory component, gear thermal/scent modifiers |
| `MaraWorldGen` | Runtime + Editor | Custom PCG nodes (biome classifier, kopje generator, game-trail carver) |
| `MaraEditor` | Editor | Validation tools, biome painting utilities, fauna placement debuggers |

### 2.2 Engine Feature Matrix

| Feature | Use | Status / Notes |
|---------|-----|----------------|
| **World Partition** + One File Per Actor | 16 × 16 km playable map (Mara Triangle-inspired composite) | Grid cell 128 m (foliage/runtime), 256 m (static), streaming radius 512–768 m |
| **Nanite** | All rocks, trees, hero props, carcasses, termite mounds; Nanite foliage for grass where supported | Nanite + WPO for wind needs a budget (see §2.4); fall back to instanced non-Nanite for grass cards on low specs |
| **Lumen** | GI and reflections, Hardware RT where available | Software RT fallback with Global SDF; Lumen Scene Detail 1.0–2.0 |
| **Substrate** | Layered materials: wet mud over soil, dust coats on hide, sweat on skin, wet fur | Enable at project start: converting materials later is painful |
| **PCG** | Biome scatter, kopjes, riverine strata, game trails, carcass/bone fields | Hierarchical generation + runtime GPU PCG for grass near the player |
| **Mass Entity / MassAI** | Wildebeest/zebra/gazelle herds (10k–40k agents simulated, ~1–4k visible) | Mass LOD: High (skeletal) → Medium (Vertex Anim) → Low (ISM impostor) → Off (statistical) |
| **StateTree** | Individual predator/megafauna brains | One StateTree per archetype, shared tasks library |
| **Smart Objects** | Waterholes, shade trees, kopje dens, carcasses, wallows | Claimed by AI for drinking/resting/feeding behaviour |
| **Water Plugin** | Mara River, Talek River, seasonal luggas, waterholes | Water Zone + spline-driven Water Body River; runtime spline metadata changes |
| **Niagara** | Dust, rain, embers, fire fronts, insect swarms, heat shimmer volumes, blood/dust impacts | GPU sims with fluid (Niagara Fluids) for hero fire/dust events |
| **Chaos** | Vehicle (late-game ranger Land Cruiser), destruction (fallen trees), cloth (shúkà) | Chaos Cloth for the shúkà, with ML Deformer for hero animals optional |
| **MetaSounds** | Procedural dawn chorus, hyena whoops, lion roars, distance-based propagation | Audio propagation tied to wind and humidity |
| **GAS** | Vitals, status effects, gear modifiers | Attributes: Health, Hydration, Calories, CoreTemp, Stamina, Fear, Fatigue |

### 2.3 Naming Conventions

```
SK_Fauna_Lion_Male_A          Skeletal mesh
SKEL_Fauna_Felid              Shared skeleton (all big cats)
ABP_Fauna_Felid               Animation blueprint (Lion/Leopard/Cheetah use retargeted layers)
ST_Fauna_Lion                 StateTree
DA_Fauna_Lion                 UMaraFaunaDefinition data asset
M_Land_Savannah_Master        Landscape master (Substrate)
MPC_MaraClimate               Material Parameter Collection (global climate)
PCG_Biome_OpenSavannah        PCG Graph
PCGS_Kopje_Granite            PCG subgraph
BP_WaterBody_MaraRiver        Water body
NS_Weather_DustStorm          Niagara system
MS_Fauna_Lion_Roar            MetaSound
```

### 2.4 Performance Budgets (Target: PS5 / XSX / RTX 3070 @ 1440p TSR, 30 fps Quality / 60 fps Performance)

| Category | 30 fps budget (33.3 ms GPU) | 60 fps budget (16.6 ms GPU) |
|----------|-----------------------------|-----------------------------|
| Base pass + Nanite raster (incl. grass) | 7.0 ms | 4.0 ms |
| Lumen (GI + reflections) | 6.0 ms | 3.5 ms (Lumen GI "Medium", reflections reduced) |
| Virtual Shadow Maps | 4.0 ms | 2.5 ms |
| Volumetric fog + clouds + sky | 2.5 ms | 1.2 ms |
| Translucency + Niagara | 2.5 ms | 1.5 ms |
| Post (TSR, bloom, local exposure, PP materials) | 3.0 ms | 2.0 ms |
| Headroom | 8.3 ms | 1.9 ms |

| CPU / Memory | Budget |
|--------------|--------|
| Game thread | ≤ 12 ms @ 30 fps |
| Mass simulation (all herds) | ≤ 2.5 ms (time-sliced, LOD-throttled) |
| StateTree AI (all individuals) | ≤ 1.5 ms (≤ 60 active "High-LOD" brains) |
| Skeletal animated animals on screen | ≤ 150 full skeletal (rest VAT/impostor) |
| Streaming pool (textures) | 3.0 GB console |
| Nanite streaming pool | 512–1024 MB |

---

## 3. Core Data Model

Every animal, plant, item and weather event is defined in **Data Assets** so designers can tune without code changes.

```cpp
// MaraEcology/Public/MaraFaunaDefinition.h
UENUM(BlueprintType)
enum class EMaraThreatLevel : uint8 { Passive, Neutral, Aggressive, Ambush };

UENUM(BlueprintType)
enum class EMaraActivityPattern : uint8 { Diurnal, Nocturnal, Crepuscular, Cathemeral };

UCLASS(BlueprintType)
class MARAECOLOGY_API UMaraFaunaDefinition : public UPrimaryDataAsset
{
    GENERATED_BODY()
public:
    UPROPERTY(EditDefaultsOnly, Category="Identity")   FText CommonName;
    UPROPERTY(EditDefaultsOnly, Category="Identity")   FText ScientificName;
    UPROPERTY(EditDefaultsOnly, Category="Identity")   FGameplayTag TierTag;          // Fauna.Tier.Apex ...
    UPROPERTY(EditDefaultsOnly, Category="Threat")     EMaraThreatLevel ThreatLevel;
    UPROPERTY(EditDefaultsOnly, Category="Threat")     float FlightInitiationDistance_m = 50.f;  // flee if player closer
    UPROPERTY(EditDefaultsOnly, Category="Threat")     float CriticalDistance_m = 10.f;          // fight/charge if cornered
    UPROPERTY(EditDefaultsOnly, Category="Senses")     float SightRangeDay_m = 300.f;
    UPROPERTY(EditDefaultsOnly, Category="Senses")     float SightRangeNightMultiplier = 0.3f;   // >1 for nocturnal hunters
    UPROPERTY(EditDefaultsOnly, Category="Senses")     float ScentSensitivity = 1.f;            // 0..3
    UPROPERTY(EditDefaultsOnly, Category="Senses")     float HearingRange_m = 150.f;
    UPROPERTY(EditDefaultsOnly, Category="Activity")   EMaraActivityPattern Activity;
    UPROPERTY(EditDefaultsOnly, Category="Activity")   FRuntimeFloatCurve ActivityByHour;       // 0..24 → 0..1
    UPROPERTY(EditDefaultsOnly, Category="Social")     FInt32Range GroupSize;
    UPROPERTY(EditDefaultsOnly, Category="Ecology")    TArray<FGameplayTag> PreferredBiomes;
    UPROPERTY(EditDefaultsOnly, Category="Ecology")    TMap<FGameplayTag, float> SeasonalAbundance; // Season.Dry / Season.Wet
    UPROPERTY(EditDefaultsOnly, Category="AI")         TSoftObjectPtr<UStateTree> Brain;
    UPROPERTY(EditDefaultsOnly, Category="AI")         TSoftObjectPtr<UMassEntityConfigAsset> MassConfig; // herds
    UPROPERTY(EditDefaultsOnly, Category="Visual")     TSoftObjectPtr<USkeletalMesh> Mesh;
};
```
