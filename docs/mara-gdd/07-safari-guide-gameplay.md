# 07 — Safari Guide Gameplay (Core Loop)

> **Player fantasy:** You are a professional safari guide employed by a luxury tented lodge in a private Mara conservancy. Guests have flown in from around the world for the trip of a lifetime, and you're the one who gives it to them. You read the bush better than anyone, you know the individual animals (names, prides, histories), you put the vehicle in exactly the right place when the light is perfect, and you bring everyone home safe.

All the ecosystem, weather, lighting and biome systems in docs 01–04 exist so that **sightings are earned, not spawned**. The guide's skill is to predict where the systemic simulation will produce a moment and to get the guests there in time.

---

## 7.1 The Setting: Conservancy vs Reserve

Real Mara conservancies (community-owned land leased to a small number of lodges) run under different rules from the National Reserve. This contrast is a core gameplay lever.

| Rule / Feature | Private Conservancy (lodge's "home" area) | National Reserve (day trips) |
|----------------|-------------------------------------------|-------------------------------|
| Off-road driving | Allowed to approach sightings, *with rules* (not on wet black cotton soil, not through breeding/den areas) | **Not allowed:** stay on roads/tracks |
| Vehicles per sighting | **Capped** (commonly 5): extra vehicles wait their turn | No hard cap: crowding is your reputational risk |
| Night drives | Allowed (red-filter spotlight) | Not allowed; gate times enforced |
| Walking safaris | Allowed (with armed ranger / Maasai escort) | Generally not allowed |
| Bush meals / sundowners out of vehicle | Allowed at designated or guide-chosen safe spots | Restricted |
| Guest density | Low (few lodges, large land per tent) | High at famous sightings and river crossings |
| Fees | Conservancy fees fund landowners (story hook: community relationship) | Park fees; the crossing points are the draw |

> The rules values (vehicle cap, minimum distances, gate times) live in `DA_ConservancyRules` / `DA_ReserveRules` so designers can tune them and stay accurate. **Validate them against current conservancy and reserve regulations with the consultants:** the numbers here are typical, not legal text.

---

## 7.2 The Daily Lodge Schedule (Game Structure)

One in-game day = one **guiding shift**. Fast-travel/skip during lodge downtime; full simulation during drives and walks.

| Time | Activity | Player Role | Systems |
|------|----------|-------------|---------|
| 05:30 | Wake-up call, coffee at the fire | Check overnight reports: askari (night guard) notes, tracks in camp, radio chatter, sky/weather | Overnight sim results, climate forecast |
| 06:15 | **Morning game drive** | Drive, search, sight, narrate | Vehicle, sightings, guests (§7.4–7.7) |
| 08:30 | Bush breakfast (optional) | Pick a safe, scenic spot; manage perimeter | On-foot safety layer (§05 Scent & Senses) |
| 10:30 | Return / brunch / siesta | Lodge downtime: vehicle maintenance, journal, guest chats | Lodge & career (§7.9) |
| 15:00 | Walking safari (optional) | Lead on foot with ranger escort: tracks, plants, insects, dung | Survival layer, tracking minigame |
| 16:00 | Afternoon tea | Guest preference updates | Guest profile model |
| 16:30 | **Afternoon game drive** | Prime predator-activity window at golden hour | Lighting §03, activity curves §01 |
| 18:30 | Sundowner | Choose the spot: view, light, safety | Composition/light scoring |
| 19:00 | Night drive (conservancy only) | Spotlight work: eyeshine, nocturnal species | Night systems §03.4 |
| 20:30 | Dinner, campfire stories | Retell the day's sightings: boosts satisfaction if accurate | Interpretation recall |
| 22:00 | Askari escort to tents | Lodge security events (elephant in camp, hippo grazing on lawn, lion roaring nearby) | Camp incidents |

**Season shapes the content:** the **Great Dry** brings migration river crossings, high guest volume and premium rates. The **Long Rains** bring green season: fewer guests, cheaper, newborns (wildebeest calving happens further south, but there are many young animals), birding, mud, stuck vehicles, dramatic storms, and **flash floods closing lugga crossings** on your route home.

---

## 7.3 The Game-Drive Vehicle (`MaraVehicle`)

A generic open-sided 4×4 game-drive vehicle (don't use real manufacturer branding without a licence). It is the player's **primary tool and home base**.

### 7.3.1 Driving Model
- **Chaos Vehicle** with a custom `UMaraTerrainResponseComponent` that reads the same `UMaraSurfaceDefinition` used for on-foot mud (§02 2.3.3): black cotton soil in rain = very low traction and sinking; red loam = good; lugga sand = needs momentum and lower tyre pressure (a real guide technique, exposed as a dashboard action).
- Low-range gearbox, diff-lock, tyre-pressure setting, winch, sand ladders, high-lift jack.
- **Approach speed and engine noise matter:** fast approaches or revving near animals raise the animals' stress (§7.6).
- **Engine off at sightings** for quiet and stable photos; restart noise is an event the AI hears.

### 7.3.2 Vehicle Silhouette & Habituation (critical AI rule)
Wildlife in heavily visited areas is **habituated to vehicles**: they read a vehicle as a large, non-threatening object, *not* as people. Breaking the vehicle silhouette changes everything.

| Silhouette State | Animal Interpretation | Example Effect |
|------------------|------------------------|----------------|
| Vehicle, guests seated | Habituated object | Lions sleep 10 m away; cheetah uses the bonnet as a lookout (real: happens) |
| Guest standing up through a pop-top / leaning out | Human shapes appear | Flight distance ×2 for antelope, lions alert |
| Loud voices / phone ringing / flash | Disturbance | Stress +, may abandon hunt or move off |
| Person **exits** the vehicle | Human on foot: full threat model of §01 applies | Lions may charge; elephants alert |

Implement as a player/guest `SilhouetteState` gameplay tag feeding the `ThreatAssessment` and `PreyClassification` formulas (§01, §05.5.2). `VehicleHabituation` per animal is stored in the individual's profile (conservancy animals higher, rarely seen animals lower).

### 7.3.3 Vehicle Upgrades (lodge-funded)
Beanbags/camera mounts (photography stability), charging ports, cool box (sundowner quality), red-filter spotlight, better tyres, snorkel (river crossings), spare-wheel capacity, ground clearance kit, hybrid/electric drivetrain (quieter: some Mara camps now run electric safari vehicles).

---

## 7.4 Finding Wildlife: The Search Loop

Sightings come from the **simulation**, not scripts. The guide stacks information sources:

| Source | What it tells you | Reliability |
|--------|-------------------|-------------|
| **Fresh tracks on the road** | Species, direction, age (crisp vs dusty edges, rain overnight?) | High, if you read age correctly |
| **Alarm calls** | Impala snort, vervet/baboon bark, guineafowl, oxpecker flush, giraffes all staring one way | High for "predator nearby", vague on location |
| **Vulture behaviour** | Circling = something's dying/dead; dropping steeply = carcass now; perched in trees = predators still on it | Medium–high |
| **Herd behaviour** | Bunched herd, all heads up, stotting gazelles | High |
| **Guide radio network** | Other lodges' guides report sightings | Varies: rivals may hold back, exaggerate, or flood a sighting |
| **Maasai spotter/tracker (crew NPC)** | Spots at long range and finds tracks; skill grows with relationship | High; speaks Maa/Swahili cues to you |
| **Animal knowledge (Field Journal)** | "The Marsh Pride rests in the croton thicket on hot days", "Leopardess *Ntito* caches in the sausage trees along the lugga" | High: this is your career knowledge |
| **Collar data (research partnership)** | Some lions/elephants carry research collars; the lodge may get coarse location sharing | Story-gated, ethical limits |

### 7.4.1 Guide Radio Network (`UMaraRadioSubsystem`)
- Simulated **AI guides** from 3–6 rival/friendly lodges drive their own routes (Mass-lite agents with a planner), report sightings and converge on them.
- Radio uses **in-world code language** (real Mara guides often talk in Maa or coded Swahili so guests don't overhear and get impatient). The player learns the codes, which are culturally reviewed.
- **Reciprocity:** share sightings and others share back. Hoarding raises short-term guest satisfaction and lowers long-term network goodwill.
- **Congestion feedback:** reporting a sensitive sighting (a den, a cheetah mid-hunt) brings vehicles that disturb it. That's an ethical choice with ecosystem consequences.

---

## 7.5 The Sighting

Every notable occurrence registers in `UMaraSightingRegistry`:

```cpp
USTRUCT(BlueprintType)
struct FMaraSighting
{
    GENERATED_BODY()
    UPROPERTY() FGuid Id;
    UPROPERTY() TArray<TWeakObjectPtr<AActor>> Subjects;   // individuals (StateTree) or Mass handles via proxy
    UPROPERTY() FGameplayTag Species;                       // Fauna.Lion
    UPROPERTY() FGameplayTag Behaviour;                     // Behaviour.Hunt.Stalk, Behaviour.Crossing, Behaviour.Mating, Behaviour.CubsPlaying
    UPROPERTY() float Rarity = 0.f;                         // species rarity × behaviour rarity
    UPROPERTY() float Sensitivity = 0.f;                    // den/hunt/kill/rhino → high: vehicle pressure harms it
    UPROPERTY() float PredictedDuration_min = 10.f;         // e.g. sleeping lions: hours; cheetah hunt: minutes
    UPROPERTY() int32 VehiclesPresent = 0;
    UPROPERTY() FVector Location;
};
```

### 7.5.1 Sighting Value (what guests experience)

```
SightingValue = SpeciesValue (guest wishlist weight)
              × BehaviourMultiplier   (sleeping ×1, walking ×1.5, hunting ×4, kill ×5, crossing ×5, cubs ×3)
              × ExclusivityFactor     (1 vehicle ×1.5 … 10+ vehicles ×0.5)
              × LightQuality          (from §03: golden hour ×1.5, harsh midday ×0.8, night spotlight ×1.2)
              × ViewQuality           (distance, obstruction by grass/branches, angle, animal facing)
              × InterpretationBonus   (did the guide explain what's happening and what might happen next?)
```

### 7.5.2 Positioning (the core "skill shot")
The guide chooses where to park. A good guide **predicts** where the animal is going and positions ahead of it, not on top of it.

| Factor | Good | Bad |
|--------|------|-----|
| Light | Sun behind the guests (front-lit) or deliberate backlight at golden hour (R6 look, §06) | Shooting into midday glare |
| Angle | Low, eye-level, side-on or animal approaching | Looking down on a sleeping animal through grass |
| Prediction | Ahead of a walking lion's line, so it passes the vehicle | Chasing from behind (stress, poor photos) |
| Distance | Species-appropriate (rules minimum) | Too close (stress, rule breach) or too far |
| Escape routes | Animal has open space to move | Blocking its path, boxing in a hunt, cutting off a herd from water |
| Background | Clean sky/plain, acacia framing | Other vehicles in frame (guests hate this) |

AI uses an **EQS query** (`EQS_Guide_BestViewpoint`) to show an optional "guide hint" at low difficulty. At high difficulty there are no hints.

---

## 7.6 Sighting Etiquette & Wildlife Welfare (`UMaraEtiquetteComponent`)

Every animal tracks **Disturbance Stress** (0–1), raised by vehicle count, proximity, approach speed, engine noise, guest noise, flash, spotlight-on-eyes duration and blocking.

| Stress Level | Behavioural Effect |
|--------------|--------------------|
| 0.0–0.3 | Natural behaviour continues |
| 0.3–0.6 | Vigilance ↑, hunting success ↓ (cheetahs are especially sensitive: tourist crowding of hunting cheetahs is a real Mara conservation concern) |
| 0.6–0.8 | Abandons hunt/kill, moves off, mother moves cubs from den |
| 0.8–1.0 | Flees or charges vehicle (elephant), long-term avoidance of area/vehicles (habituation drops) |

**Rules engine:** breaching conservancy rules (exceeding the vehicle cap, off-roading in the wet, going too close, chasing, blocking a crossing) is detected by the conservancy ranger NPCs and by other guides reporting you. It leads to warnings, fines, suspension from the conservancy, and lodge reputation loss. **Ethical guiding is the long-game win:** animals in your area stay relaxed and behave naturally, which produces better sightings for years.

---

## 7.7 Guests (`MaraGuests`)

### 7.7.1 Guest Profiles

| Archetype | Wants | Pain Points | Bonus Behaviour |
|-----------|-------|-------------|-----------------|
| **First-time safari** | Big Five checklist, lions, elephants | Long empty stretches, dust, bumpy roads | Overjoyed by "common" animals if you interpret well |
| **Pro photographer** | Light, angle, behaviour, low positions, patience | Other vehicles in frame, impatience, engine vibration | Will wait 2 h for a leopard to come down a tree |
| **Honeymooners** | Romance, sundowners, private moments | Crowds | Bush dinner spot quality |
| **Family with children** | Engagement, safety, short drives | Boredom, long waits | Kids love dung beetles, tracks, termite mounds (interpretation minigames) |
| **Birder** | Lifers, specific species (§01 Birds list) | Guide ignoring birds for lions | Rewards bird ID skill |
| **Nervous guest** | Safety reassurance | Close elephants, night drives | Calm narration lowers their Fear |
| **Repeat / VIP** | Rare behaviour, exclusivity, something new | Repeats of past sightings | High tips; brings reputation |

### 7.7.2 Guest State (per guest)

| Attribute | Driven By |
|-----------|-----------|
| `Satisfaction` | Sighting values vs their wishlist, interpretation, comfort, surprises |
| `Comfort` | Heat (§02 thermal model applies to guests!), dust, road roughness, time since break, hunger/thirst |
| `Fear` | Proximity of dangerous animals, elephant mock charges, night, guide calmness |
| `Patience` | Drains during waiting and empty driving; restored by small interpretive moments (birds, plants, tracks) |
| `Knowledge` | Rises as you explain; enables deeper questions (good guides teach) |
| `Photos` | Each shot scored (§7.8); best shots shown at dinner and in their review |

**Guest AI:** StateTree per guest with seat-bound animation (pointing, raising binoculars or camera, whispering, gasping, standing up: the guide may need to tell them to sit, §7.3.2). Guest gaze uses a look-at system targeting the most salient sighting element. Voice lines come from a context database (`Behaviour × Emotion × Archetype`).

### 7.7.3 Interpretation (the guide's voice)
At a sighting, the player picks **interpretation beats** from a radial menu populated by their Field Journal knowledge:
`Identify` (species/individual) → `Explain behaviour` ("she's stalking: see how she freezes when they look up") → `Predict` ("if the wind holds she'll try from that termite mound") → `Story` (the pride's history) → `Ecology` (why it matters) → `Quiet` (sometimes the best guiding is silence).

Correct predictions that come true give a big satisfaction spike. Wrong or invented facts are penalised when guests later read the field guide at the lodge, so **accuracy is gameplay**.

---

## 7.8 Photography System
- Guests (and the player in photo mode) take shots scored by `UMaraPhotoScorer`: subject visibility (% unoccluded, via line traces against Nanite/grass proxies), subject size in frame, **eye visible/in focus**, behaviour tag, light direction vs camera (from the sun vector), golden-hour factor, background clutter (other vehicles, horizon tilt), motion blur (vehicle engine on = vibration).
- Hero shots are saved to the **lodge gallery** and guest reviews. A "photo of the season" competition among the lodge guides gives a career bonus.
- Photo mode uses Cine Camera parameters (focal length, aperture, shutter for motion blur, ISO noise via film grain at night).

---

## 7.9 Career, Lodge & Economy

### 7.9.1 Guide Certification Path
Kenya runs a real professional guide qualification scheme with tiered levels (Kenya Professional Safari Guides Association: Bronze, Silver, Gold). Model the career on it, with permission and accuracy review, or use a fictionalised equivalent:

| Level | Unlocks |
|-------|---------|
| Trainee / Spotter | Ride with a senior guide, learn tracks and radio code, no solo guests |
| Bronze-equivalent | Solo game drives, conservancy only |
| Silver-equivalent | Walking safaris, night drives, Reserve day trips, photography guests |
| Gold-equivalent | VIP/private-vehicle guests, training junior guides, research partnerships, fly-camping expeditions |

Exams are **in-world practical tests**: identify 20 birds by call, age 5 tracks, lead a walk without incident, a written-style quiz on ecology. They pull from the same Field Journal knowledge.

### 7.9.2 Economy & Reputation

| Currency | Earned From | Spent On |
|----------|-------------|----------|
| **Tips** (personal) | Guest satisfaction | Personal gear: binoculars, field guides, camera, clothing |
| **Lodge Reputation** | Reviews, sightings quality, safety record, ethics | Lodge upgrades (vehicles, fly-camp, hide/blind at a waterhole, more guests) |
| **Community Goodwill** | Respecting conservancy rules, hiring/training local guides, conservation actions | Access to new areas, landowner storylines, Maasai cultural experiences (consultant-designed) |
| **Network Goodwill** | Sharing sightings, helping stuck vehicles | Better radio info from other guides |

### 7.9.3 Conservation Side-Missions
Report snares to conservancy rangers, assist with collaring (vet team NPCs), monitor a known leopard, log sightings for researchers, handle human-wildlife conflict (a lion near a Maasai *boma* at night: compensation and deterrent stories). These tie the guide to the real Mara conservation model, where tourism revenue pays for land leases.

---

## 7.10 Where the Survival Layer Lives

The survival systems from §02 and §05 (heat, dehydration, scent, fight-or-flight, injuries, disease) apply to the guide **and the guests** whenever the vehicle silhouette is broken or the vehicle fails:

| Situation | Survival Systems in Play |
|-----------|--------------------------|
| **Walking safari** | Full scent/wind model, threat ladders (buffalo in thickets, elephant charges), guest group management: guests must follow single file, stay quiet, never run |
| **Bush breakfast / sundowner** | Perimeter awareness, hyenas/baboons after food, choosing a site with sightlines |
| **Breakdown / stuck in mud** | Getting out to dig/jack/winch near wildlife, heat and dehydration if stranded, radio for help, night falling |
| **Flash flood at a lugga** | Read upstream storms (§02 2.2.2): wait or detour; crossing wrong = vehicle swept, guests in danger |
| **Night camp incidents** | Elephant in camp, lion near tents, hippo on the lawn, a guest walking alone after dark (askari escort rules) |
| **Fly-camping expedition (Gold)** | Multi-day remote trips: thorn boma, fire, water purification, the full bushcraft layer (§05.2) |
| **Medical emergencies** | Guest heatstroke, snakebite, allergic reaction to a bee sting: first aid, evacuation call (flying doctors / airstrip) |

> **Fail states:** a guest injury is the worst outcome: suspension, lodge reputation crash, story consequences. The guide's own death is possible on foot but rare; the design centres on *responsibility*, not combat.

---

## 7.11 Updated Vertical Slice (replaces §05.7 M1)

| Content | Scope |
|---------|-------|
| Map | 2 × 2 km conservancy edge + Mara River section with 1 crossing point, 1 kopje, 1 lugga |
| Lodge | Small luxury tented camp (6 tents), mess tent, fire pit, askari routes |
| Day | 1 full shift: morning drive → bush breakfast → afternoon drive → sundowner → night drive |
| Fauna | 1 lion pride (named individuals), 1 leopard, 1 cheetah mother + cubs, hyena clan, wildebeest/zebra herd (Mass), elephants, buffalo, hippos, crocs, vultures, ambient birds |
| Guests | 3 archetypes (first-timer, photographer, family) in one vehicle |
| Systems | Vehicle + terrain response, sightings registry, radio with 3 AI guides, etiquette/stress, interpretation menu, photo scorer, walking-safari prototype with scent model |
| Look | Golden hour → midday → golden hour → night presets from §03, validated against the reference-board shots in §06.4 |
