# 05 — Inventory, Crafting & Core Survival Mechanics

## 5.0 Player Fantasy & Progression

> **Reframe:** the player is a **safari guide at a luxury lodge** (core loop in [07](./07-safari-guide-gameplay.md)). This document covers the **on-foot and survival layer**: what the guide carries, what they can make in the bush, and how body and senses work whenever the guide or guests leave the vehicle (walking safaris, bush meals, breakdowns, fly-camping, camp incidents).

Many Mara guides grew up Maasai, herding cattle in the same landscape, so the guide's skill set has two strands that meet:

| Track | Source | Progression Feel |
|-------|--------|------------------|
| **Traditional Knowledge** | Upbringing, elders, the lodge's Maasai spotter/askari team | Read the land: tracks, plant medicine, bushcraft, livestock-herder instincts about predators |
| **Professional Guiding Kit** | Lodge-issued and tip-funded gear | Information and comfort: binoculars, radio, spotlight, first aid, guest-safety equipment |

> **Cultural guardrail:** Maa-language names and every crafting recipe below must be checked by cultural consultants before shipping. Terms here use common English/Swahili/Maa forms as *placeholders*.

---

## 5.1 Inventory System

### 5.1.1 Model: Weight + Body Slots (no magic backpack)

| Container | Capacity | Notes |
|-----------|----------|-------|
| **Body Slots** | Head, Torso (shúkà layer), Waist (belt: 4 hang points), Back, Feet, Wrists ×2, Neck | Gear provides modifiers (thermal, scent, noise, protection) |
| **Hands** | 2 (main/off) | Spear needs both for a thrust stance; rungu one-handed |
| **Belt Hang Points** | 4 | Rungu, knife/seme, gourd, pouch |
| **Shoulder Bag (Enkidong-style leather bag / ranger daypack)** | 12–20 kg (soft cap) | Over soft cap: stamina drain ×1.5, noise +20%, speed −15% |
| **Camp Stash** | Unlimited weight, location-bound | Vulnerable to baboons, hyenas, honey badgers, floods, fire |

```cpp
USTRUCT(BlueprintType)
struct FMaraItemInstance
{
    GENERATED_BODY()
    UPROPERTY() TObjectPtr<UMaraItemDefinition> Def;
    UPROPERTY() float Condition = 1.f;      // 0..1 durability
    UPROPERTY() float Freshness = 1.f;      // perishables (meat spoils in 6–12 game-h in heat; dried meat days)
    UPROPERTY() float ScentLoad = 0.f;      // meat/blood items emit scent (feeds §5.4)
    UPROPERTY() float Wetness = 0.f;        // affects weight and thermal value
    UPROPERTY() int32 Quantity = 1;
};
```

### 5.1.2 Item Categories

| Category | Examples | Key Attributes |
|----------|----------|----------------|
| Tools & Weapons | Rungu, spear, seme (short sword), bow & arrows, knife, fire-sticks | Damage, reach, noise, durability |
| Clothing & Gear | Shúkà (several weights), sandals (tyre-rubber *akala*), beaded protective items, ranger fatigues, hat | Thermal insulation (clo), solar reflectance, scent masking, colour (tsetse attraction) |
| Water | Gourd calabash, ranger bottle, jerrycan, filter gourd | Volume, purification state |
| Food | Fresh/dried meat (*nyama*), milk (from ally herds), honey, wild fruit (*Grewia* berries, figs, *Balanites* dates), tubers, termite alates | Calories, spoilage, scent |
| Medicine | Plant medicine (consultant-verified), ORS, bandages, antivenom (rare), antimalarials, antibiotics | Treatment tables (§02) |
| Ranger Electronics | Radio, GPS, VHF telemetry receiver, camera traps, thermal monocular, drone, solar charger, batteries | Power use, data outputs |
| Materials | Hide, sinew, wood (olive *Olea*, *Acacia*), thorns, clay, ochre, resin, fibre (sisal/*Sansevieria*), beads, wire (salvaged snares!) | Crafting inputs |

---

## 5.2 Traditional Maasai Survival Gear

| Item | Description & Real Basis | Crafting Inputs | Gameplay Function |
|------|--------------------------|-----------------|-------------------|
| **Shúkà** | The iconic woven cloth wrap (red, often checked/striped; also blue and other colours). Red is said to be visible at distance and to signal confidence to wildlife. | Trade/find (not crafted from raw): repair with thread; dye-refresh with ochre (cosmetic) | **Thermal regulation hub** (see 5.2.1); can be *spread wide* as an intimidation display (predator Prey-Classification −0.3); sling; bandage in an emergency (reduces condition); water-soaking evaporative cooling; makeshift shade tarp; night blanket |
| **Rungu (Orinka)** | Throwing/striking club with a heavy knobbed head, carved from hardwood root/branch junction | Hardwood branch with root knob (*Olea* or acacia), knife carving 30 game-min, oil/fat polish | Thrown (range 15–30 m, aim with arc), melee strike (stun small predators/snakes), **snake-killing tool**, hunting small game; quiet |
| **Spear (Empere, placeholder)** | Long iron-bladed spear with a long, heavy butt-spike; held vertically when walking | Iron blade (trade/forge at blacksmith NPC), wooden shaft (*Olea*), sinew/wire binding | **Primary defence stance**: holding a planted spear vs a charging predator; thrust attack; **deterrent posture** (Prey-Classification −0.4 when held upright); long reach |
| **Seme / Simi** | Short double-edged sword in a red leather sheath | Blacksmith NPC; hide sheath crafting | Utility cutting, butchery, close defence; crafting speed bonus |
| **Fire-Sticks** | Hand-drill friction fire (hardwood drill + softwood hearth) | Two seasoned sticks (hearth soft, drill hard), tinder (dry grass, dung) | Fire minigame: fails in wet season unless tinder kept dry (inventory wetness) |
| **Thorn Boma** | Ring fence of cut acacia thorn branches around camp, the traditional livestock enclosure | 15–40 thorn branches (cut with seme; 1 per 2 game-min) | **Predator deterrence**: hyena/lion entry chance −85%; combine with fire |
| **Gourd Calabash** | Dried gourd container, traditionally for milk | Gourd (found/traded), cleaned, smoked inside with burning grass/twigs (smoke-sterilisation, real practice) | Water/milk storage (1.5 L), smoked gourd = −50% spoilage for milk |
| **Akala Sandals** | Sandals cut from old tyre rubber | Salvaged tyre (vehicle wrecks), knife, strap | Foot protection (thorns, scorpions, heat), noise −10% vs boots, mud penalty −10% |
| **Ochre & Fat** | Red ochre mixed with animal fat applied to body/hair (cultural/adornment) | Ochre (kopje deposits), fat | *Cultural only by default.* If consultants approve, a small sun/insect protection effect |
| **Beaded Ornaments** | Culturally significant beadwork | Trade only | Narrative/reputation with communities, **not** a stat item (avoid commodifying) |
| **Bow & Arrows** | Used historically by some East African groups; for Maasai, a *minor* tool (consult) | Wood, sinew string, arrow shafts, iron tips | Silent small-game hunting |
| **Hide Shield** | Historically, buffalo-hide shields (now ceremonial/historic) | Large hide, wood frame | Optional/historic DLC: block hyena bites |

### 5.2.1 Shúkà Thermal & Behaviour Model

| Wear Mode | Clo (insulation) | Solar Absorptance | Evap. Cooling | Movement | When |
|-----------|------------------|-------------------|---------------|----------|------|
| **Over shoulders (standard)** | 0.5 | 0.55 | — | 100% | Default day |
| **Draped over head** | 0.6 | 0.40 (shade on head/neck) | — | 100% | Midday sun: −35% solar load to head |
| **Wrapped full (night)** | 1.0–1.2 (double shúkà 1.6) | — | — | 90% | Cold dry-season nights, rain |
| **Soaked & worn** | 0.3 | 0.5 | **×1.5 cooling** in RH < 50% | 95% | Heat emergencies in the dry season |
| **Spread wide (display)** | — | — | — | 0% (stance) | Facing a predator: look bigger |
| **As tarp/shade** | — | Shade 70% | — | Static | Rest stop |
| **Wet (after rain)** | 0.2 | — | Unwanted cooling at night | 95% | Hypothermia risk; dry at fire |

**Chaos Cloth:** the shúkà is simulated with Chaos Cloth (Panel Cloth editor in 5.3+): wind from `MPC.WindDirSpeed`, wetness raises mass & damping (wet cloth clings and swings heavily), mode transitions via animation-driven cloth-config swaps.

---

## 5.3 Guide & Lodge Equipment (incl. conservancy/research kit)

| Item | Function | Power | Gameplay Systems |
|------|----------|-------|------------------|
| **VHF Telemetry Receiver + Yagi Antenna** | Track collared lions/elephants/rhinos: beep strength vs direction | AA batteries (8 h) | Directional audio minigame (rotate antenna, beep pitch/volume); finds collared animals within 2–8 km (terrain occlusion) |
| **GPS Handheld** | Waypoints, track logs | AA (12 h) | Map breadcrumbs; doesn't show animals |
| **Satellite GPS Collar Data (via research partnership)** | Historic movement tracks of collared animals (daily fixes) | Base station | Strategic layer: plan routes around prides; investigate "stationary collar" = possible dead/snared animal |
| **Camera Traps** | PIR-triggered stills/video at the lodge waterhole, dens (from a distance), trails | Lithium (weeks) | Overnight intel for the morning brief (what passed through camp?), guest slideshow at dinner, conservancy research data (and occasionally evidence of snaring for rangers) |
| **Thermal Monocular** | Heat signatures at night up to 300–800 m | Rechargeable (4 h) | Strongest anti-ambush tool; blocked by dense vegetation/heat of rocks after hot days (rocks glow!); power scarcity |
| **Night-Vision (Gen 2 equivalent)** | Light amplification | Rechargeable (6 h) | Useless in total darkness without IR illuminator; blooms with fire |
| **Handheld Radio** | Ranger network comms | Rechargeable (12 h) | Weather warnings, mission dispatch, call for vehicle extraction (if network/repeater in range) |
| **Drone (quadcopter, thermal)** | Aerial survey 2–3 km | Battery (25 min) | Find herds/predators/poachers; scares elephants (realistic: drones are used to deter elephants from crops) |
| **SMART-style Patrol Tablet** | Log observations (wildlife, snares, carcasses) | Rechargeable | Turns observation into progression: *Field Journal* completion |
| **Snare Cutter / Bolt Cutter** | Remove wire snares | — | Snare removal missions; salvaged wire = crafting material |
| **First-Aid & Antivenom Kit** | Treat bites, wounds | — | Limited antivenom (polyvalent): time-critical snakebite treatment |
| **Solar Charger** | Recharge electronics | Sun (Dry season efficient, Wet poor) | Climate-coupled power economy |
| **Binoculars (10×42)** | Observation | — | Identify species/sex/age/collar ID from range; spot vulture columns |
| **Armed Ranger Escort (NPC)** | Walking safaris are accompanied by an armed conservancy/KWS ranger | — | The guide never carries a firearm. The ranger NPC fires only as an absolute last resort; any shooting is a catastrophic outcome (investigation, suspension). The guide's job is to never let it get that far |
| **Guest Safety Kit** | Trauma first aid, snakebite protocol, epinephrine (bee stings), satellite messenger, evacuation contacts | — | Medical emergency events (§07.10) |
| **Red-filter Spotlight** | Night drives | Vehicle power | Minimise time on animals' eyes (etiquette stress §07.6) |
| **Field Guides & Journal** | Species ID, behaviour notes | — | Feeds interpretation menu (§07.7.3) |

### 5.3.1 Power Economy
`BatteryCharge` items decay with use; the solar charger gives `ChargeRate = SolarIrradiance × (1 − CloudCover) × PanelAngleFactor` (W). In the Wet season, power is scarce, so players lean on traditional knowledge. **This is the systemic bridge between the two gear tracks.**

---

## 5.4 Crafting System

### 5.4.1 Crafting Stations

| Station | Location | Unlocks |
|---------|----------|---------|
| **Hand (anywhere)** | — | Cordage, simple club, tinder bundle, splint, sharpened stick |
| **Campfire** | Camp | Cooking, smoking meat, fire-hardening wood, gourd smoking, boiling water |
| **Work Stone** | Kopje/camp | Carving (rungu), scraping hides, grinding ochre/medicine |
| **Drying Rack** | Camp | Dried meat (jerky), hide curing |
| **Blacksmith (NPC)** | Village/enkang (trade) | Spear blades, seme, arrowheads (trade-only: respects traditional craft roles) |
| **Ranger Workbench** | Ranger post | Electronics repair, camera trap config, battery management, med kits |

### 5.4.2 Sample Recipe Data

```cpp
UCLASS(BlueprintType)
class UMaraRecipeDefinition : public UPrimaryDataAsset
{
    GENERATED_BODY()
public:
    UPROPERTY(EditDefaultsOnly) FText DisplayName;
    UPROPERTY(EditDefaultsOnly) TMap<TObjectPtr<UMaraItemDefinition>, int32> Inputs;
    UPROPERTY(EditDefaultsOnly) TObjectPtr<UMaraItemDefinition> Output;
    UPROPERTY(EditDefaultsOnly) FGameplayTag RequiredStation;           // Craft.Station.Campfire
    UPROPERTY(EditDefaultsOnly) FGameplayTag RequiredKnowledge;         // Knowledge.Maasai.RunguCarving
    UPROPERTY(EditDefaultsOnly) float GameMinutes = 30.f;
    UPROPERTY(EditDefaultsOnly) float NoiseEmitted = 0.2f;              // chopping/carving attracts attention
    UPROPERTY(EditDefaultsOnly) float ScentEmitted = 0.f;               // butchery/cooking = high
    UPROPERTY(EditDefaultsOnly) FGameplayTagContainer FailConditions;   // Status.Hypothermia, Weather.HeavyRain
};
```

| Recipe | Inputs | Station | Time | Noise / Scent | Output |
|--------|--------|---------|------|---------------|--------|
| Rungu | Hardwood knob branch ×1, fat ×1 (opt.) | Work Stone | 45 min | 0.3 / 0 | Rungu (Condition 1.0; fat polish +20% durability) |
| Spear Shaft | Straight *Olea* sapling ×1 | Campfire (fire-straighten) | 40 min | 0.2 / 0.1 | Shaft |
| Spear (assembled) | Shaft + iron blade + butt-spike + sinew/wire | Hand | 20 min | 0.1 / 0 | Spear |
| Thorn Boma | Thorn branch ×20–40 | Hand (placement mode) | 2 min / branch | 0.4 / 0 | Boma ring (radius 4–8 m) |
| Fire-Sticks | Hard drill + soft hearth wood | Hand | 10 min | 0 / 0 | Fire kit (3–10 uses) |
| Dried Meat | Fresh meat ×1 (strips) | Drying Rack + sun/smoke | 6 game-h | 0 / **0.8** (attracts scavengers!) | Dried meat (lasts 10 days) |
| Smoked Gourd | Gourd + green twigs | Campfire | 15 min | 0 / 0.2 | Sterile gourd |
| Sand Filter Gourd | Gourd + charcoal + sand + grass | Hand | 20 min | 0 / 0 | Filter (turbidity −80%, pathogens −30%) |
| Snake Stick | Forked branch | Hand | 5 min | 0 / 0 | Pin snakes (reduces bite chance when handling) |
| Splint | Sticks ×2 + cordage | Hand | 5 min | 0 / 0 | Fracture treatment |
| Camera Trap (deploy) | Camera + batteries + strap | Ranger Bench (config) / Hand (place) | 5 min | 0.1 / 0.2 (human scent on device!) | Deployed trap |
| Dung Smudge (repellent) | Dried dung + green leaves | Campfire | 5 min | 0 / *masking* | Smoke reduces mosquitoes/tsetse in camp |

### 5.4.3 Knowledge Unlocks (instead of XP)
Recipes are gated by **Knowledge Tags** earned by: mentor conversations, observing animals (Field Journal: "Watched a leopard cache a kill" → unlocks the *Tree-Cache Awareness* perk: shows likely cache trees), failing safely (learning by doing: a recipe's success rate rises with attempts).

---

## 5.5 Health & Senses

### 5.5.1 Vitals (GAS Attribute Set `UMaraVitalsAttributeSet`)

| Attribute | Range | Drains | Restores | At Zero |
|-----------|-------|--------|----------|---------|
| Health | 0–100 | Injuries, disease, starvation, exposure | Rest, medicine, food | Death (permadeath option / ranger rescue checkpoint) |
| Hydration | 0–100 | See §02 | Water (quality-dependent) | Collapse |
| Calories | 0–3000 kcal reserve | 80–600 kcal/h by activity | Food | Health drain, weakness |
| Core Temp | 33–42 °C | Heat balance (§02) | Shade, water, shelter, fire | Hyperthermia/hypothermia states |
| Stamina | 0–100 | Running, swimming, mud, carrying | Rest; regen modified by heat/hydration | Stagger, can't sprint |
| Fatigue (sleep debt) | 0–100 | Time awake (rises 4/h) | Sleep (needs a secure camp or high-risk rest) | Microsleeps (screen blackouts), perception −50% |
| **Fear** | 0–100 | Predator proximity, night, injuries, sudden noises | Fire, companions, daylight, calm breathing action | Panic: shaky aim, heavy breathing (noise ↑), sprint urge |
| Infection | 0–100 | Wounds untreated, disease exposure | Clean water wound wash, antibiotics, plant medicine | Fever cascade |

**Injury Model (localised):** `Laceration` (bleed rate; blood trail = scent + visual), `Puncture` (bite: infection chance ↑), `Fracture` (movement −40%, needs splint), `Crush` (buffalo/hippo/elephant: often lethal; survivable only with fast treatment), `Envenomation` (neuro: progressive paralysis, vision tunnelling; cyto: swelling, limb dysfunction; spitting: blindness).

### 5.5.2 The "Stealth & Scent" System

The heart of the encounter design. The player has three **signatures** that animals sense: **Scent**, **Sound** and **Sight**. Wind turns scent from a radius into a **directional plume**, which makes positioning (being *downwind*) the main skill.

#### A. Scent Plume Model

```
Player Scent Emission (per second):
  E = BaseHumanScent (1.0)
    × Sweat(1 + 0.8 × SweatRate)
    × BloodFactor(1 + 3 × BleedRate)           // bleeding: massive
    × CarriedScent(1 + Σ ItemScentLoad)         // fresh meat, hides
    × Masking(1 − MaskStrength)                 // smoke, dung smudge, mud bath, crushed leaves
    × Hygiene(1 + DaysWithoutWashing × 0.05)

Plume Advection (Gaussian plume approximation, evaluated on query, no particles needed for gameplay):
  For an animal at relative position r (downwind distance x along WindDir, crosswind y):
    if x <= 0:  C ≈ near-field only (radius 6–10 m diffusive sniff)
    else:       C(x,y) = E / (2π σy σz u) × exp(−y² / 2σy²)
                σy = a × x^0.9 (stability class from ToD: day unstable → wide plume; night stable → narrow, long plume)
                u  = max(WindSpeed, 0.5)
  Rain: C × 0.4 (washes scent); Dust storm: C × 0.3; Calm night: plume travels far and narrow (danger!)
```

| Condition | Effect |
|-----------|--------|
| **Daytime thermals (unstable air)** | Scent rises and widens; detection range shorter but wider cone |
| **Night / dawn (stable, drainage winds)** | Scent flows *downhill* and along valleys/rivers (katabatic). Plume follows terrain (bias plume direction by slope gradient when wind < 1.5 m/s) |
| **Gusty wind** | Plume meanders: add low-frequency noise to wind direction (±25°) for unpredictability |
| **Swirling at kopjes/thickets** | Local wind turbulence volumes randomise plume direction |

**Implementation:**
- `UMaraScentSubsystem` keeps a short history ring buffer of the player's positions/emissions (last 10–20 min) → **scent trails** that predators (hyenas, lions, wild dogs) can *follow* (track the trail along recorded points, scent decays with half-life ~8–20 min, faster in rain/heat).
- **Custom AI Sense:** `UAISense_Scent` + `UAISenseConfig_Scent` (subclass `UAISense`, register in the AI perception system). On update (0.5 s, LOD-throttled), each listener queries `UMaraScentSubsystem::SampleConcentration(ListenerLocation)` → stimulus strength = C × `ScentSensitivity` (species). Threshold → `Perceived`.
- **Species sensitivity (`ScentSensitivity`):** Elephant 3.0 (elephants are thought to have one of the strongest senses of smell among mammals), Black Rhino 2.6, Hyena 2.5, Buffalo 2.0, Lion 1.4, Leopard 1.2, Wildebeest 1.5, Zebra 1.3, Giraffe 0.8, Crocodile 0.6, Vulture 0.2 (mostly sight).
- **Visualization (player-facing):** tossing dust/grass shows wind direction (an animation + Niagara puff drifting), smoke from fire, and an optional "Wind Sense" overlay unlocked via knowledge (subtle animated streaks). No permanent HUD arrow by default.

#### B. Fight-or-Flight Decision Model

When any sense crosses the detection threshold, the animal's StateTree evaluates:

```
ThreatAssessment = DetectionConfidence × PlayerThreatSignature × Proximity
   PlayerThreatSignature = PostureFactor (upright 1.0 / crouch 0.6 / prone 0.4)
                         × WeaponDisplay (spear raised 1.3) × GroupSize × FirePresence × ShúkàDisplay
   Proximity            = 1 − saturate((Distance − CriticalDistance) / (FID − CriticalDistance))

Response selection (species-weighted):
   Passive species:    Alert → Alarm call → Flee (direction = away from threat, biased toward herd/cover)
   Neutral species:    Alert → Threat display → (if player keeps approaching inside CriticalDistance) → Charge/Attack
                       → else: Withdraw. Defending young: skip display stage 50% of the time
   Aggressive species: Short alert → Charge (bluff chance by species: elephant 0.8, rhino 0.4, hippo 0.2, buffalo 0.3)
   Ambush predators:   If PreyClassification high → Stalk (stay hidden, close distance) → Strike
                       If PreyClassification low  → Avoid / slink away / observe
```

| Detection Channel | Best Counter | Typical Range (Day / Night) |
|-------------------|--------------|------------------------------|
| **Scent** | Stay downwind, mask, wash, don't carry meat | 100–500 m downwind / 300–1,000 m (stable night air) |
| **Sight** | Cover, crouch, slow movement, break silhouette (stay off skylines/ridges), shade | 50–400 m / species-dependent (predators better at night) |
| **Sound** | Slow walking, avoid dry grass/sticks (surface noise table), use storm/wind noise masking | 20–150 m / ×1.4 at night |
| **Indirect (alarm networks)** | Avoid flushing birds; don't spook herds near predators | Alarm calls propagate 100–400 m |

**Surface Noise Table (footstep loudness × movement speed):** Dry grass 1.0, leaf litter 1.2, dry sticks 1.6 (snap events), gravel 0.9, wet grass 0.4, mud 0.7 (squelch), sand 0.3, rock 0.5. Crouch-walk ×0.35, walk ×0.6, run ×1.6, sprint ×2.2.

#### C. Visibility (Sight) Model
`Visibility = SilhouetteSize(posture) × Movement(speed^0.7) × Contrast(against background: skyline 2.0, grass 0.6, thicket 0.3) × Lighting (§03 player illumination) × ClothingColour (red shúkà vs green grass: high contrast to humans/primates; most ungulates/carnivores are dichromats so red↔green contrast matters less to them → use a per-species colour-vision flag)`

> Nice-to-have realism: red shúkà is very visible to *people and primates* (baboons spot you) but less distinct to dichromatic predators. Brightness contrast and movement matter more to them.

### 5.5.3 Senses for the Player (Diegetic Information)

| Player Sense | Mechanic |
|--------------|----------|
| **Hearing** | HRTF spatialised audio (MetaSounds + Audio Gameplay Volumes); key cues: oxpecker hiss, impala snort, baboon bark, lion grunt at < 100 m (sub-bass), hyena giggle, branch snap, hippo honk |
| **Smell** | "Scent cues" in subtitles/UI hints when downwind of: carcass (rot), elephant dung, buffalo herd (cattle-like), lion (musky, ammonia at spray marks), smoke (fire upwind!). Smell range = player downwind detection 30–150 m |
| **Sight** | Binoculars, eye adaptation (§03), eyeshine reading, heat shimmer distortion |
| **Tracking ("Reading Sign")** | Tracks (species from footprint decals, age from edge crispness + weather since), dung freshness (moisture/warmth), bent grass direction, blood spoor, feeding sign, scratch marks. **Track age estimation:** compare the track's weather history (rain since? wind blown dust?) against what the player sees: real tracker logic |
| **Intuition (Knowledge perk)** | Late-game: subtle heartbeat/tension audio when an *unseen* predator has the player as a stalk target (the "being watched" feeling): optional for accessibility/difficulty |

---

## 5.6 Core Loop Integration Matrix

| System → Affects ↓ | Climate | Time of Day | Fauna AI | Crafting | Health |
|---------------------|---------|-------------|----------|----------|--------|
| **Climate** | — | Cloud cover dims light; storms darken | Migration, water concentration, scent dispersal | Wet tinder fails; solar charging | Heat/cold, disease vectors |
| **Time of Day** | Temp curve, thermals, katabatic winds | — | Activity curves, night advantages | Fire visibility at night | Fatigue cycle, cold nights |
| **Fauna AI** | Herds churn mud, grazing feeds fire fuel model | Dawn chorus/night calls | — | Hides/sinew/meat inputs (ethically gated) | Injuries, disease vectors |
| **Crafting** | Boma/fire/shelter protect from weather | Fire extends safe time | Deterrents change AI decisions | — | Medicine, water purification |
| **Health** | Status effects change thermal response | Fear peaks at night | Bleeding/scent attracts predators | Low stamina slows crafting | — |

---

## 5.7 Development Roadmap (Suggested Vertical Slice)

| Milestone | Duration | Deliverables |
|-----------|----------|--------------|
| **M0: Tech Spikes** | 6–8 weeks | Grass rendering path decision (Nanite vs HISM), Mass herd 10k prototype, Lumen Far Field test, Substrate wetness MF, Water stage tiers |
| **M1: Vertical Slice (2 × 2 km)** | 4–6 months | See [07 §7.11](./07-safari-guide-gameplay.md): one full guiding shift with guests, vehicle, sightings, radio, walking-safari prototype |
| **M2: Ecosystem Alpha** | 6–9 months | Full fauna roster LOD0–3, carcass guild, bird systems, disease model, season cycle, flash floods, fires |
| **M3: Lodge & Career Layer** | 4–6 months | Lodge economy and upgrades, certification path, guest archetype roster, Reserve day trips, conservation side-missions, fly-camping |
| **M4: Content & Polish** | 6–12 months | 16 × 16 km world, cultural review passes, accessibility, performance certification |

> **Top 5 Technical Risks:** (1) Grass rendering cost at 60 fps, (2) Mass herd + skeletal LOD transitions without pops, (3) Lumen noise/stability in dense foliage at night with torches, (4) Water plugin runtime level changes, (5) Groom fur cost on many animals (use groom only on LOD0 hero animals within 15–25 m; cards beyond).
