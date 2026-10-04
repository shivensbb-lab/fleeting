# 01 — The Complete Maasai Mara Fauna Register

> **Scope:** Species that actually occur in the Greater Mara ecosystem (Reserve, Mara Triangle, conservancies, Mara River, Siria/Oloololo Escarpment). Rare and vagrant species are marked **(R)**. Species that *don't* occur in the Mara and must not be placed there: Grévy's zebra, gerenuk, beisa oryx, reticulated giraffe, southern white rhino (absent from the Mara), gemsbok, springbok, chimpanzee.

---

## 1.0 Threat-Level Taxonomy

| Level | Definition | Default response to player | Gameplay read |
|-------|-----------|-----------------------------|---------------|
| **Passive** | Never initiates harm. Flees or ignores. | Flight at Flight Initiation Distance (FID) | Food, information source (alarm calls), environmental storytelling |
| **Neutral** | Harmless unless provoked, cornered, surprised at close range, or defending young. | Threat display → bluff → attack if the player keeps approaching | The *most* dangerous category in practice: megaherbivores kill more people than predators |
| **Aggressive** | Has a low threshold. Will charge or attack proactively when the player enters a territory/critical radius. | Charge (often real, not bluff) | Area denial: forces routing decisions |
| **Ambush** | Predates by concealment. The player is a potential prey item under specific conditions (night, alone, injured, crouched, near water). | Stalk → strike from cover; no warning | Fear engine of the game: reading cover, water edges, night |

> **Tuning law:** A threat level is a *baseline*, modulated at runtime by the **Disposition Modifiers** below. A "Neutral" buffalo becomes effectively "Aggressive" when wounded, old and solitary ("dagga boy").

| Disposition Modifier | Effect on aggression threshold |
|----------------------|--------------------------------|
| Has dependent young within 30 m | −40% (attacks sooner) |
| Wounded / diseased | −35% |
| Solitary male (buffalo, elephant in musth, hippo bull) | −30% |
| Hunger state > 0.8 (predators) | −25% (predators take bigger risks) |
| Player crouched / prone / small silhouette | Predators −20% (reads as prey); herbivores +15% (less alarming) |
| Player standing tall, arms raised, shúkà spread | Predators +40% (reads as dangerous); some herbivores −10% |
| Player in group of ≥ 3 NPC Maasai | Lions +60% (lions in the Mara really do avoid Maasai men) |
| Night (sun elevation < −6°) | Ambush predators −30% |
| Player carrying fresh meat / bleeding | Predators/scavengers −35% |

---

## 1.1 TIER I — APEX PREDATORS

| Species | Scientific Name | Threat | Activity | Group Size (Mara) | Key Mara Notes |
|---------|-----------------|--------|----------|-------------------|----------------|
| Lion | *Panthera leo* | **Ambush / Aggressive** | Nocturnal–crepuscular; rests 18–20 h | Prides 10–30 (e.g. "Marsh Pride"-style), coalitions of 2–6 males | Highest lion density in Africa in places; males defend territories ~30–400 km² |
| Leopard | *Panthera pardus pardus* | **Ambush** | Nocturnal | Solitary | Riverine forest, kopjes, luggas; caches kills in trees (sausage tree, *Kigelia*; fig; *Acacia/Vachellia*) |
| Cheetah | *Acinonyx jubatus* | **Neutral** (toward humans) | Diurnal | Solitary female + cubs; male coalitions of 2–5 | Open plains; loses up to 10–15% of kills to lions/hyenas; vulnerable to kleptoparasitism |
| Spotted Hyena | *Crocuta crocuta* | **Aggressive** (night) / Neutral (day) | Nocturnal | Clans 30–80+, matriarchal | Mara's most abundant large carnivore; hunts >60% of its own food; very bold around camps |
| Nile Crocodile | *Crocodylus niloticus* | **Ambush** | Cathemeral | Aggregations at crossings (dozens) | Up to 5–6 m in the Mara River; mass feeding during migration crossings |
| African Wild Dog **(R)** | *Lycaon pictus* | Neutral | Diurnal–crepuscular | Packs 6–20 | Occasional; dispersing packs from Loita/Serengeti; endgame "rare sighting" encounter |

### 1.1.1 AI Behaviour & Packing Logic — Apex

#### LION — `ST_Fauna_Lion`
**Social architecture (Pride Graph):**
```
Pride (FMaraPrideData)
 ├─ Resident Coalition (1–6 males)  → territory owner, patrol + scent-mark + roar
 ├─ Lionesses (3–12)                → hunting unit, ranked by age/experience
 │    └─ Role slots per hunt: WING_LEFT, WING_RIGHT, CENTRE (Stander's wing–centre model; individuals keep preferred positions)
 ├─ Sub-adults (nomadic at ~2.5–3.5 yrs males expelled)
 └─ Cubs (crèche; vulnerable; triggers lioness aggression)
```

| State (StateTree) | Entry Condition | Behaviour |
|------------------|-----------------|-----------|
| `Rest` | Daytime, satiation > 0.4, temp > 28 °C | Shade-seeking Smart Object (Balanites/acacia/croton thicket), panting anim, ear/tail flicks |
| `Patrol` | Males, dusk/night, every 2–4 days | Walk territory spline, spray-mark (scent emitter), roar chorus (audible 8 km, MetaSound with distance LPF) |
| `Stalk` | Hunger > 0.6, prey in EQS cone, wind *favourable* | Uses grass height/terrain cover; crouch locomotion; freezes when prey looks up (prey "vigilance" bool) |
| `CoordinatedHunt` | ≥ 3 lionesses | Wings circle out at 150–300 m; centre lionesses wait in ambush; herd is pushed toward centre |
| `Charge` | Distance < 30 m (lions are ambushers with low stamina) | Sprint 50–60 km/h (burst ≤ 200 m), abandons if not within reach in ~8 s |
| `Feed` | Kill made | Hierarchy: males feed first (if present), then lionesses, cubs last; growl/swat interactions |
| `DefendKill` | Hyenas > lion count × 3.5 → **flee**; else **defend** | Kleptoparasitism arithmetic, driven by clan size vs pride size |
| `Mate` / `Infanticide` | Coalition takeover | Narrative "takeover event": new males kill cubs → pride reorganises |

**Player-specific logic:**
- Lions read humans as *risky*, not prey. The engine computes a **Prey-Classification Score** each sense tick:
  `PCS = Crouched(0.35) + Alone(0.15) + Injured(0.2) + Night(0.2) + Fleeing(0.3) + BleedingScent(0.25) − StandingTall(0.3) − Group(0.4) − FireNearby(0.5)`
  `PCS > 0.6` → Stalk the player. `PCS < 0.2` → Avoid/move off.
- **Running from a lion is the worst action** (`Fleeing` +0.3 triggers the chase instinct). This must be taught through Maasai mentor dialogue in the tutorial.

#### LEOPARD — `ST_Fauna_Leopard`
- **Solitary territorial agent**, home range 10–40 km² (scaled ×0.25 for game).
- **Tree caching:** after a kill, query Smart Objects tagged `SO.Tree.Cache` within 300 m, haul carcass (two-bone IK neck/jaw attach + root motion climb).
- **Ambush points:** riverine thickets, kopje crevices, lugga banks. Leopards prefer to *wait* at prey paths (EQS: `Context_GameTrail` ∩ `Cover > 0.7`).
- **Night advantage:** `SightRangeNightMultiplier = 2.5` (tapetum lucidum); player torches reflect eyeshine (green-gold) at ≤ 60 m. This is your only warning.
- **Human interaction:** avoids adults; will strike a crouched/resting player at night within 15 m if hunger > 0.85 (rare, scripted-feeling but systemic).

#### CHEETAH — `ST_Fauna_Cheetah`
- **Diurnal sprinter**, hunts 08:00–10:00 and 16:00–18:00 to avoid lions/hyenas.
- **Hunt pattern:** vantage-point scan (termite mound/fallen log Smart Objects: `SO.Vantage`) → slow walk-stalk to ~60 m → sprint (up to ~100 km/h, ≤ 300 m, ~20 s) → trip with dewclaw → throat hold.
- **Post-sprint exhaustion:** 15–30 min panting state; very vulnerable. Kleptoparasitism check every 10 s (lion/hyena within 400 m → abandon).
- **Toward player:** no recorded wild cheetah human fatalities. Flees. Mothers hiss/slap the ground and bluff-charge near cubs.

#### SPOTTED HYENA — `ST_Fauna_Hyena` + `MassClan` hybrid
- **Clan fission-fusion:** the clan exists as an abstract Mass "clan" fragment; individuals spawn as subgroups of 1–15 around the den (`SO.Den.Hyena`, often in old aardvark burrows on low ridges).
- **Linear dominance hierarchy:** females dominant; rank inherited from mother. Rank = feeding priority + aggression threshold.
- **Recruitment:** whoop calls (audible 5 km) recruit clan members to kills; each whoop raises `ClanResponseCount`.
- **Hunting:** coursing chases up to 3 km at 40–50 km/h, targeting wildebeest calves/weak individuals (EQS scores prey by `Health`, `Age`, `IsolatedFromHerd`).
- **Player relationship:** the night antagonist. Hyenas are bold at night, test the player (approach to 10–20 m, retreat, approach), steal unattended meat/hide from camp, and will bite a sleeping exposed human. A **campfire + thorn boma** is the primary counter.

#### NILE CROCODILE — `ST_Fauna_Crocodile`
- **Static ambush predator:** spawns in water volumes tagged `Water.Deep` and `Water.Crossing`.
- **Detection:** vibration + sight at water surface; player standing in water up to knee (`WaterDepth > 0.3 m`) triggers `Investigate` (eyes-only submerged swim).
- **Strike:** lunge range 1–2 body lengths from the bank; grab → drag → **death roll** (paired animation with player, QTE limited to eye-gouge/rungu strike).
- **Migration crossings:** density ×4, coordinated feeding (shared-carcass tearing via rotational force).
- **Seasonal:** wet season disperses crocs into floodwater; dry season concentrates them in pools. *Murky floodwater = invisible crocs.*

#### AFRICAN WILD DOG (R)
- Pack of 6–20, highly cooperative (sneeze-vote to start hunts: implement as a "quorum" group decision in StateTree using a shared Mass fragment).
- Rarely hostile to humans. Serves as a reward/discovery event that unlocks a Field Journal entry.

### 1.1.2 Blender Modelling Notes — Apex

| Species | Topology & Rig Requirements | Fur/Hide Requirements | Special Assets |
|---------|----------------------------|------------------------|----------------|
| **Lion** | 35–45k quad base (sculpt 6–12M in ZBrush/Blender multires) · edge loops at scapula, elbow, carpal, hip, stifle, hock · **floating scapula** (a separate deform bone sliding along the ribcage, not attached to the clavicle) · 5 loops around each digit pad for retractable claws | Groom with **Blender Geometry Nodes hair curves** → export Alembic or UE Groom. Mane: 3 guide layers (base undercoat 3 cm, mid 10–15 cm, outer 20–30 cm), age-driven darkening (blond→black). Body coat 1–2 cm, tuft tail tip | Male mane variants (blond/dark/sparse, "Mara black mane"), scar decals, battle-damaged ears, gut-full blendshape |
| **Leopard** | Same felid skeleton as lion (`SKEL_Fauna_Felid`), proportions via retarget. Extra spine deform bones (min 7 lumbar) for low-crawl/climb flexion | Rosette pattern as **mask texture** driving groom root colour; 1–1.5 cm coat; whiskers as separate strand group | Climb anim set + tree-carcass pose, eyeshine emissive in eye shader |
| **Cheetah** | Separate `SKEL_Fauna_Cheetah` (very flexible spine, longer limbs); **non-retractile claws** (always visible geometry); counter-rotating spine flexion bones for the gallop | Coarse short fur (~1 cm), tear-line decals, solid spots (not rosettes), mantle on cubs (silver-grey ruff, 4–6 cm) | Sprint double-suspension gallop (the defining anim), dewclaw trip contact |
| **Spotted Hyena** | Sloping back: forelimbs longer than hind (adjust bind pose), thick neck with 3 deformation chains for bite/tug | Coarse sparse coat 2–4 cm, spotted variation by age, short mane along the neck/spine | Females larger and dominant (scale variants); den cubs are born uniformly dark brown |
| **Nile Crocodile** | Body 25–35k; scute rows as **Nanite-displaced** geometry on high LOD (osteoderms). 4 tail chains with ≥ 18 bones for swimming undulation | Substrate: wet/dry layer blend (dry scutes go matte/chalky grey-green), algae mask, mud mask | Death roll (synced with player), basking open-jaw thermoregulation, nictitating membrane blendshape |
| **African Wild Dog** | Canid skeleton (`SKEL_Fauna_Canid`, shared with jackals, scaled) | Patchwork tri-colour coat: unique per individual (procedural mask), large rounded ears with translucency (Substrate SSS slab) | Sneeze/greeting social anims |

**Universal Quadruped Rig Standard (`SKEL_Fauna_*`):**
1. **Root → Pelvis → Spine_01..07 → Neck_01..04 → Head** (big cats use 7 lumbar/thoracic deform bones; ungulates 5).
2. **Floating scapula bone** on every quadruped (critical for shoulder roll in walking felids/ungulates).
3. **Leg chains:** `Humerus → Radius → Metacarpal → Phalanx_01..03` (digitigrade cats/dogs) or `→ Cannon → Pastern → Hoof` (unguligrade). Add **twist bones** on humerus/radius and femur/tibia.
4. **IK targets:** 4 foot IK bones + 4 virtual pole bones (export as UE IK bones for **Control Rig foot placement on uneven terrain**).
5. **Facial:** minimum 12 bones (jaw, lips ×4, ears ×2 each with 2-bone chains, eyelids ×4) + ARKit-*like* blendshape set for snarls (≈ 20 shapes).
6. **Tail:** 12–25 bones, simulated with **UE Physics Control / AnimDynamics** or Rigid Body node.
7. **Bind pose:** neutral stance, all four feet flat, for clean retargeting through **IK Retargeter** (UE 5.4+ retargeter supports quadrupeds via chain mapping).
8. **Muscle sim:** bake **muscle jiggle/flex** in Blender (or use UE **ML Deformer** trained from a Houdini/Ziva-style muscle sim) for the 6 hero species: lion, leopard, cheetah, elephant, buffalo, hippo.

---

## 1.2 TIER II — LARGE HERBIVORES (Megafauna & Ungulates)

| Species | Scientific Name | Threat | Activity | Group Size | Key Mara Notes |
|---------|-----------------|--------|----------|------------|----------------|
| African Bush Elephant | *Loxodonta africana* | **Neutral → Aggressive** (musth bull, mother w/ calf) | Cathemeral | Family 6–20 (matriarchal); bulls solitary/bachelor groups | Kills more people annually in Kenya than any predator; mock vs real charge |
| Eastern Black Rhino | *Diceros bicornis michaeli* | **Aggressive** | Crepuscular–nocturnal | Solitary; cow + calf | Critically endangered; ~25–40 in the Mara; browser in thickets; poor eyesight, excellent smell/hearing |
| Common Hippopotamus | *Hippopotamus amphibius* | **Aggressive** | Nocturnal grazer, aquatic by day | Pods 10–30 (up to 100+) | Africa's deadliest large mammal toward humans; bulls territorial in water; night grazing up to 8–10 km inland |
| Masai Giraffe | *Giraffa tippelskirchi* | **Passive** | Diurnal | Loose groups 2–20 | Jagged, vine-leaf spots; browses *Vachellia*; lethal kick if cornered (Neutral if calf present) |
| Cape Buffalo | *Syncerus caffer caffer* | **Neutral → Aggressive** (lone bulls) | Cathemeral | Herds 50–500+; bachelor "dagga boys" 2–5 | Circles back to ambush pursuers when wounded; mobbing defence vs lions |
| Western White-bearded Wildebeest | *Connochaetes mearnsi* (*C. taurinus mearnsi*) | Passive | Diurnal (migrate at night too) | Migration: ~1.3 million total; local herds 50–10,000 | **The Great Migration engine**, arriving Jul–Oct |
| Plains Zebra (Grant's / Crawshay's) | *Equus quagga boehmi* | **Passive / Neutral** (stallion kicks/bites) | Diurnal | Harem 5–20 (stallion + mares), aggregations of thousands | Leads migration into long grass, eats coarse tops; ~200–300k migrate |
| Topi | *Damaliscus lunatus jimela* | Passive | Diurnal | 10–50; territorial males | Sentinel behaviour on termite mounds; purple-sheened hide |
| Common Eland | *Taurotragus oryx pattersonianus* | Passive | Diurnal | 10–60 | Largest antelope; clicks knees when walking (audio cue!) |
| Coke's Hartebeest (Kongoni) | *Alcelaphus buselaphus cokii* | Passive | Diurnal | 5–20 | Mound sentinels like topi |
| Defassa Waterbuck | *Kobus ellipsiprymnus defassa* | Passive | Diurnal | 6–30 | Riverine; oily, musky hide (strong scent emitter, easy for player and predators to detect) |
| Impala | *Aepyceros melampus* | Passive | Diurnal | Harems 15–100; bachelor herds | Woodland edges; "fountain" leaping escape; alarm snort |
| Thomson's Gazelle | *Eudorcas thomsonii* | Passive | Diurnal | 5–60 (migratory aggregations of thousands) | Stotting (pronking) to signal fitness; cheetah's main prey |
| Grant's Gazelle | *Nanger granti* | Passive | Diurnal | 5–30 | Water-independent; larger than Tommy, no dark side stripe in females |
| Bohor Reedbuck | *Redunca redunca* | Passive | Crepuscular | Pairs | Tall grass and swamp edges; whistling alarm |
| Common Warthog | *Phacochoerus africanus* | **Neutral** (tusks; sows defend piglets) | Diurnal | Sounders 4–16 | Kneels to graze; reverses into burrows tusks-out; tail-up flight |
| Bushbuck | *Tragelaphus scriptus* | Neutral (males dangerous when cornered) | Nocturnal–crepuscular | Solitary | Riverine thicket |
| Kirk's Dik-dik | *Madoqua kirkii* | Passive | Crepuscular | Pairs | Dense thickets; dung middens |
| Oribi | *Ourebia ourebi* | Passive | Diurnal | Pairs/trios | Short grass plains |
| Steenbok | *Raphicerus campestris* | Passive | Crepuscular | Solitary/pairs | Lies flat until nearly stepped on |
| Klipspringer | *Oreotragus oreotragus* | Passive | Diurnal | Pairs | Kopjes and the Oloololo Escarpment only; tip-toe hooves |
| Common Duiker | *Sylvicapra grimmia* | Passive | Crepuscular | Solitary | Bush edges |
| Giant Forest Hog **(R)** | *Hylochoerus meinertzhageni* | Neutral → Aggressive | Nocturnal | Sounders | Dense forest edges near escarpment |
| Roan Antelope **(R)** | *Hippotragus equinus* | Neutral | Diurnal | 5–15 | Very rare / historic in the Mara; Easter-egg sighting only |

### 1.2.1 AI Behaviour & Packing Logic — Large Herbivores

#### THE GREAT MIGRATION — `MaraEcology::FMigrationSystem` (Mass Entity)

**Architecture:**
```
UMaraMigrationSubsystem (WorldSubsystem)
 ├─ GrazingQualityGrid    (256×256 cells @ 62.5 m, fed by Climate soil moisture + grass biomass)
 ├─ MigrationFlowField    (vector field recomputed every in-game 6 h; Dijkstra/eikonal toward "green" attractors)
 ├─ CrossingPoints[]      (river Smart-Object zones: "Main Crossing", "Lookout", "Cul-de-sac", "Paradise" etc. — use your own names)
 └─ Mass Archetypes
      ├─ Wildebeest   (Fragments: Transform, Velocity, Herd ID, Fear, Thirst, Hunger, Fatigue, LOD, AgeClass)
      ├─ Zebra        (adds Harem ID; stallion leader fragment)
      └─ Gazelle      (Thomson's; follows behind wildebeest to eat new shoots)
```

**Grazing succession (real ecological sequence, drives herd ordering):**
`Zebra (eat tall coarse tops) → Wildebeest (mid-sward leaves) → Thomson's Gazelle (short new shoots)`
Implement as a **grass-height consumption pipeline:** each archetype reads `GrassHeight` and writes `GrassHeight −= ConsumptionRate × dt` into the grid. Zebra prefer > 40 cm, wildebeest 10–40 cm, Tommies < 10 cm. Grass-height grid feeds the PCG runtime grass via a Render Target (§04).

**Mass Processors (execution order):**

| # | Processor | Function | Tick |
|---|-----------|----------|------|
| 1 | `UMigrationFlowFieldProcessor` | Sample flow field → desired heading | 0.5 s (LOD-scaled) |
| 2 | `UHerdBoidsProcessor` | Separation (1.5 m), alignment, cohesion (radius 8 m), leader-follow (lead cows/stallions) | Every frame (High LOD), 0.25 s (Med) |
| 3 | `UHerdFearProcessor` | Propagates fear via spatial hash: alarm snorts spread at ~15 m/s; stampede at Fear > 0.7 | 0.1 s |
| 4 | `UHerdThirstProcessor` | Drives herd toward river/waterhole Smart Object; **crossing hesitation logic** | 1 s |
| 5 | `UHerdGrazingProcessor` | Writes grass consumption into grid | 2 s |
| 6 | `UHerdLODProcessor` | Mass Representation switching: Skeletal (< 80 m) → VAT (< 400 m) → ISM impostor (< 1.5 km) → simulated-only | 0.25 s |

**River crossing hesitation model (signature set-piece):**
```
Crowd accumulates on bank → BankDensity rises
CrossingPressure += BankDensity × Thirst × (Rainfall_Gradient_Pull) × dt
CrossingPressure -= CrocVisible × 2 + PredatorNearby × 3 + RecentDeaths × 1.5

if (CrossingPressure > Threshold && LeaderBrave) → "First Jumper" event
   → cascade: 90% of nearby entities follow within 20–60 s
   → steep-bank Smart Objects: physics-ragdoll fall chance 2–5% per entity
   → croc density ×4, drowning chance in deep current (Water.Velocity > 2 m/s)
```
Herds may cross, then **cross back** the same day. This is real behaviour, not a bug. Keep it.

**Seasonal path (game-world compression):** Wet season → herds concentrated in the southern map edge (the "Serengeti boundary"; off-map statistical pool); Dry season (in-game "Jul–Oct") → mass pours north across Sand River and Mara River into the Triangle/Reserve.

#### ELEPHANT — `ST_Fauna_Elephant`
- **Family unit led by a matriarch** (oldest female; memory fragment stores waterhole locations across seasons → in drought she leads the herd to the *last* remaining water, an emergent clue for the player).
- **Threat escalation ladder** (readable by player):
  1. Head up, ears spread, trunk raised sniffing (*Alert*)
  2. Head shake, dust throw, trumpet (*Warning*)
  3. Mock charge: ears out, stops short, kicks dust (*Bluff*: 80% at stage 3)
  4. Real charge: **ears pinned back, trunk curled in, head low, silent** (*Lethal*)
- **Musth bulls:** temporal gland streaking (decal), urine dribble trail (scent emitter), aggression threshold −50%.
- **Infrasound rumble:** gameplay "felt not heard": controller haptics + subtle low-frequency audio at < 2 km.

#### CAPE BUFFALO — `ST_Fauna_Buffalo` (herds via Mass, bulls via StateTree)
- **Herd mobbing:** when a lion attacks, `MobDefence` triggers: up to 30 bulls charge the lion with heads low. Lions are killed by buffalo in the real world, so this outcome must be possible.
- **Dagga boys:** old bulls wallowing in mud (`SO.Wallow`) in reed beds/luggas, dried mud caked on (Substrate mud layer). Aggressive threshold low; **circle-back ambush** if wounded (pathfind *behind* the player's approach vector, wait in cover).
- **Tracking tell:** cattle-like dung, oxpeckers flushing indicates presence.

#### HIPPO — `ST_Fauna_Hippo`
- **Day:** pod in `Water.Pool` (river bends); bulls defend 50–100 m of river length; yawn display (= threat, not tiredness).
- **Night:** solo grazing along fixed **hippo trails** (PCG generates deep paired-rut trails from river to grassland; see §04). **Never stand between a hippo and water**: the AI path back to water is a "rail", and anything on it gets charged.
- **Speed:** ~30 km/h on land over short distance. Faster than a running human.
- **Dung showering:** tail-spreading dung scatter as territory marker (Niagara + decal).

#### BLACK RHINO — `ST_Fauna_Rhino`
- Poor vision (sight range 25–30 m), excellent hearing/smell → charges at **sounds/scent** it can't identify, often in a wrong direction (the player can sidestep).
- Thicket browser (euclea, croton). The player meets them on narrow paths in dense cover.
- **Ranger narrative anchor:** each rhino has an ID (ear-notch pattern), GPS/VHF telemetry tag; monitoring them is a core ranger mission chain.

#### GIRAFFE / ANTELOPE (Passive Info-Broadcasters)
- **Vigilance network:** each Passive species has `VigilanceRadius` and `AlarmCall` (impala snort, topi snort, Tommy stotting, giraffe staring + snort, zebra bark). Alarm events are **world-space events** the player can read: "Giraffes are all staring at the same thicket → a predator is there."
- **Sentinels:** topi and hartebeest on termite mounds (`SO.Vantage`) extend herd sight ×1.5.
- **Stotting:** Thomson's gazelle pronk when a predator is detected but not close. Implement as a readable signal to the player *and* AI (cheetahs abandon hunts on stotting gazelles at a 60% chance).

### 1.2.2 Blender Modelling Notes — Large Herbivores

| Species | Topology & Rig | Hide/Fur | Special |
|---------|----------------|----------|---------|
| **Elephant** | 60–80k base; skin folds as **sculpted displacement** (Nanite tessellation or baked normal + wrinkle maps driven by joint angle: "wrinkle map blending" via Material Parameter from Control Rig). Trunk: **≥ 24-bone spline IK chain** + 8 tip bones for finger-like grasp; ears with 6×4 bone grid for flapping (thermoregulation anim at temp > 30 °C) | Substrate: dry dusty grey ↔ wet dark slate; mud/dust bathing layer (red Mara soil, `#8C4A2F`) applied via mask; sparse hair cards on the head/tail tip | Tusks as separate meshes (variation, broken tusks); temporal gland decal; footprint decal 40–50 cm diameter |
| **Black Rhino** | 50k base; skin "plates" folds at shoulder/hip; prehensile **hooked upper lip** blendshape | Grey hide with dust/mud layers; heavy specular breakup | Two horns as separate swappable meshes (anterior longer); ear-notch variants |
| **Hippo** | 45k base; barrel body volume preservation (corrective blendshapes on huge mouth open: jaw gape ~150°); short legs with weight-bearing compression shapes | Substrate: **"blood sweat"** (hipposudoric acid: red-orange secretion) as wet layer; pink-grey skin; scar overlays (fighting bulls) | Huge canines/incisors; yawn anim; dung-spray Niagara; underwater "walk" (they gallop along riverbeds) |
| **Masai Giraffe** | Long neck: **7 cervical bones** (same as all mammals), long. Use spline IK on neck plus counter-weight on spine; leg ragdoll constraints prevent knee inversion | Jagged leaf/star-shaped patches, procedurally varied per individual (Voronoi + noise mask in Substrate); ossicones with hair tufts (females) vs bald (males) | Splayed-leg drinking pose; necking fights (males); 45 cm prehensile tongue blendshape |
| **Cape Buffalo** | 40k; **boss** (horn base fused shield) as separate mesh LODs; heavy neck dewlap folds | Sparse black hair (cards/groom) over dark grey hide, balding with age; Substrate mud crust (cracked, flaking dry mud: animated mask erodes over time) | Oxpecker attach sockets (8 per animal) |
| **Wildebeest** | **Crowd-optimised:** 12–18k LOD0, 4k LOD1, 800 LOD2, impostor LOD3. Animation via **VAT (Vertex Animation Textures)** baked in Blender (OpenVAT add-on or Houdini) for Mass medium LOD | Groom only on LOD0 (beard, mane); card-based for LOD1; silver-grey brindling bands | ≥ 6 body variants × 3 age classes; calf "golden" coat |
| **Zebra** | Shared equid skeleton; stripe pattern **unique per individual** (procedural stripe texture via Geometry Nodes UV-space noise; also a Substrate parametric stripe function) | Short coat (≤ 1 cm), Grant's zebra lack "shadow stripes"; mane erect 10 cm | Stallion bite/kick fight anims; foal brown-striped variant |
| **Topi / Hartebeest / Eland** | Shared `SKEL_Fauna_Bovid` with morph-target proportions | Topi: glossy purple-red with dark "tar" patches (Substrate sheen/fuzz lobe); Eland: twisted spiral horns, dewlap | Eland knee "click" foley tied to anim notify |
| **Impala / Gazelles** | Light, fast: deformation focus on hip/stifle, leap/stot anims require root-motion with high apex | Black-red flank stripe (Tommy), tail flick; impala "M" rump marking | Stotting and leap anim sets; fawn "lying-out" hiding pose |
| **Warthog** | 20k; warts (facial protrusions) as sculpted forms; carpal **calluses** for kneeling-graze | Sparse bristles + long dorsal mane groom | Reverse-into-burrow anim (backwards entry, tusks out) |

**Hoof/Footprint Pipeline (for Tracking system):** Each species gets a footprint **decal + displacement stamp** (Runtime Virtual Texture write via `RVT_Displacement`) with variants: walk/trot/gallop spacing, mud (deep), dust (shallow), wet sand (crisp edges). Store stride lengths per gait in `UMaraFaunaDefinition` for the tracking minigame.

---

## 1.3 TIER III — MESOPREDATORS & PRIMATES

| Species | Scientific Name | Threat | Activity | Group | Notes |
|---------|-----------------|--------|----------|-------|-------|
| Serval | *Leptailurus serval* | Passive | Crepuscular | Solitary | Tall wet grass; vertical pounce on rodents (audio-guided) |
| Caracal | *Caracal caracal* | Passive | Nocturnal | Solitary | Leaps to catch birds; rare sighting |
| African Wildcat | *Felis lybica* | Passive | Nocturnal | Solitary | Camp-edge rodent hunter |
| Black-backed Jackal | *Lupulella mesomelas* | Neutral (rabies vector!) | Crepuscular | Pairs | Scavenges at kills; steals from camp |
| Side-striped Jackal | *Lupulella adusta* | Passive | Nocturnal | Pairs | Wetter/wooded areas |
| African Golden Wolf | *Canis lupaster* | Neutral | Crepuscular | Pairs/family | Formerly "golden jackal" |
| Bat-eared Fox | *Otocyon megalotis* | Passive | Nocturnal–crepuscular | Family 2–6 | Termite specialist; huge ears (thermoregulation + hearing) |
| Aardwolf | *Proteles cristatus* | Passive | Nocturnal | Solitary | Licks up to ~250k termites per night; erects mane when threatened |
| Striped Hyena **(R)** | *Hyaena hyaena* | Neutral | Nocturnal | Solitary | Rarely seen; drier fringe areas |
| Honey Badger | *Mellivora capensis* | **Aggressive** | Cathemeral | Solitary/pairs | Fearless; will charge the player; partnership myth with honeyguide (contested science: present as folklore) |
| African Civet | *Civettictis civetta* | Passive | Nocturnal | Solitary | Latrine sites ("civetries"), strong musk |
| Common / Large-spotted Genet | *Genetta genetta* / *G. maculata* | Passive | Nocturnal | Solitary | Climbs; camp visitor |
| Zorilla (Striped Polecat) | *Ictonyx striatus* | Passive (defensive spray) | Nocturnal | Solitary | Skunk-like spray → scent "contamination" status effect |
| Banded Mongoose | *Mungos mungo* | Passive | Diurnal | Troops 10–40 | Lives in termite mounds; mobs snakes |
| Dwarf Mongoose | *Helogale parvula* | Passive | Diurnal | 8–20 | Termite mound dens; hornbill mutualism |
| Slender Mongoose | *Herpestes sanguineus* | Passive | Diurnal | Solitary | Black tail-tip |
| White-tailed Mongoose | *Ichneumia albicauda* | Passive | Nocturnal | Solitary | White tail visible in torchlight |
| Marsh Mongoose | *Atilax paludinosus* | Passive | Nocturnal | Solitary | Riverine |
| **Olive Baboon** | *Papio anubis* | **Neutral → Aggressive** (males; food raiding) | Diurnal; sleeps in trees/cliffs | Troops 20–150 | Steals from inventory/camp; 4–5 cm canines; alarm barks warn of leopards |
| Vervet Monkey | *Chlorocebus pygerythrus* | Passive (raider) | Diurnal | 10–50 | **Predator-specific alarm calls** (leopard / eagle / snake): real, documented, a perfect gameplay signal |
| Black-and-white Colobus | *Colobus guereza* | Passive | Diurnal | 5–15 | Riverine canopy only; roaring dawn chorus |
| Blue / Sykes' Monkey | *Cercopithecus mitis* | Passive | Diurnal | 10–30 | Riverine forest, escarpment |
| Northern Lesser Galago (Bushbaby) | *Galago senegalensis* | Passive | Nocturnal | Small groups | Eyeshine in canopy; crying calls at night |

### 1.3.1 AI Behaviour — Mesopredators & Primates
- **Scavenger Guild Queue** (`UMaraCarcassSubsystem`): every carcass is a Smart Object with a **succession timeline**:
  `Predator (0–6 h) → Hyena/Lion contest → Vultures land (once predators < 2 and > 50 m away) → Jackals dart in → Marabou → Insects/Maggots (24–72 h) → Bones (bleaching over days; PCG "bone field" persistence)`
  Players can read carcass age by guild composition → information about predator proximity.
- **Baboon Troop Raids:** troop fragment with `Boldness` stat that rises with each unpunished raid; they target unattended inventory containers (`UMaraStashComponent`). Deterrents: fire, thrown stones, slingshot, a dog companion (optional).
- **Vervet Semantic Alarm Grammar:** `Alarm.Leopard` (all flee *up* trees), `Alarm.Eagle` (look *up*, dive into bushes), `Alarm.Snake` (stand bipedal, look *down*). The player learns to read each and gets Field Journal unlocks.
- **Honey Badger:** if within 8 m, `Charge` regardless of player size. Thick loose skin = reduced damage from player strikes (×0.4).
- **Rabies Vector Logic:** 2–5% of jackals spawn `Rabid` (erratic pathing, daytime aggression, drooling material) → bite inflicts `Status.RabiesExposure` (requires ranger-station post-exposure treatment within N in-game days, else fatal: a long-tail tension mechanic).

### 1.3.2 Blender Modelling Notes — Mesopredators & Primates
- **Shared small-carnivore skeletons:** `SKEL_Fauna_SmallFelid` (serval/caracal/wildcat), `SKEL_Fauna_Canid` (jackals, wolf, bat-eared fox, wild dog), `SKEL_Fauna_Mustelid` (honey badger, zorilla: long spine chain ≥ 10 bones), `SKEL_Fauna_Herpestid` (mongooses).
- **Primates:** `SKEL_Fauna_Primate` with **full hand rig (5 digits × 3 bones)** and feet as hands; facial rig with ≥ 30 blendshapes (baboon threat yawns, lip-smacks, eyebrow-flash eyelid displays: male baboons have pale eyelids used as a signal).
- **Fur:** baboon olive-grey agouti banding (groom root-to-tip gradient), long male mantle; colobus long white mantle and tail plume (simulated strands, higher LOD only).
- **Eyeshine** (all nocturnal species): eye shader with a `Tapetum` parameter: retroreflection colour by species (green: cats; yellow-orange: canids; red-orange: galagos). Driven by torch light vector vs view vector dot product → **the core night-reading mechanic**.

---

## 1.4 TIER IV — SMALL MAMMALS

| Species | Scientific Name | Threat | Activity | Gameplay Role |
|---------|-----------------|--------|----------|---------------|
| Rock Hyrax | *Procavia capensis* | Passive | Diurnal | Kopje sentinel; latrine "hyraceum" deposits; leopard prey, alarm shriek |
| Bush (Yellow-spotted) Hyrax | *Heterohyrax brucei* | Passive | Diurnal | Kopjes |
| Aardvark | *Orycteropus afer* | Passive | Nocturnal | **Ecosystem engineer:** burrows reused by hyenas, warthogs, porcupines → den Smart Object generator |
| Ground Pangolin (Temminck's) | *Smutsia temminckii* | Passive | Nocturnal | Ultra-rare; anti-trafficking ranger quest; rolls into ball |
| Cape Hare / Scrub Hare | *Lepus capensis* / *L. saxatilis* | Passive | Nocturnal | Small game (snare/trap), serval/eagle prey |
| Crested Porcupine | *Hystrix cristata* | **Neutral** (quill reverse-charge) | Nocturnal | Quills = crafting resource (needles, fletching) |
| Springhare | *Pedetes surdaster* | Passive | Nocturnal | Kangaroo-like hopping; eyeshine bounce at night |
| Unstriped Ground Squirrel | *Xerus rutilus* | Passive | Diurnal | Burrow fields (trip hazard while running) |
| Gambian Pouched Rat | *Cricetomys gambianus* | Passive | Nocturnal | Raids food stores |
| Four-toed Hedgehog | *Atelerix albiventris* | Passive | Nocturnal | Ambient |
| Straw-coloured & Epauletted Fruit Bats | *Eidolon helvum* / *Epomophorus* spp. | Passive | Nocturnal | Riverine fig trees; dusk emergence; disease lore |
| Insectivorous Bats (various) | *Chaerephon*, *Nycteris* spp. | Passive | Nocturnal | Kopje caves; guano (fertiliser/fire accelerant resource) |
| Multimammate Mouse, Gerbils | *Mastomys*, *Gerbilliscus* spp. | Passive | Nocturnal | Food-store pests; disease (plague/Lassa-like) lore vector |

### 1.4.1 AI & Tech — Small Mammals
- **Mass "Ambient Life" archetype:** lightweight Mass entities (no StateTree), behaviour via simple processors (`Wander`, `FleeFromThreat`, `BurrowSeek`). Up to 2,000 within 200 m, culled beyond.
- **Burrow network generator:** aardvark PCG node places burrow entrances (`SO.Burrow`), later tenancy assigned (warthog 40%, hyena 15%, porcupine 15%, empty 30%). Empty burrows are snake/mongoose habitat.

### 1.4.2 Blender Notes — Small Mammals
- 2–8k tris LOD0. **Skeletal for near**, **VAT for flocks/groups** (e.g., hyrax colonies).
- Pangolin: overlapping **scales as instanced geometry** along a curve (Geometry Nodes instance-on-points with rotation aligned to body normal), exported as a single Nanite mesh + skinned (or rigid-skinned scale cards per bone).
- Porcupine: quills as **hair curves with high stiffness** (UE Groom with physics disabled at rest, raised via blendshape-equivalent groom "raise" morph).

---

## 1.5 TIER V — BIRDS

| Species | Scientific Name | Threat | Gameplay Role |
|---------|-----------------|--------|---------------|
| Rüppell's Vulture | *Gyps rueppelli* | Passive | Carcass beacon: circling columns visible 5+ km (thermal-soaring Niagara + flock AI) |
| White-backed Vulture | *Gyps africanus* | Passive | Most common carcass vulture |
| Lappet-faced Vulture | *Torgos tracheliotos* | Passive | Dominant at carcasses; opens tough hides |
| White-headed Vulture | *Trigonoceps occipitalis* | Passive | Often first to find carcasses |
| Hooded Vulture | *Necrosyrtes monachus* | Passive | Scraps |
| Marabou Stork | *Leptoptilos crumenifer* | Passive | Carcass, fire-front follower |
| Martial Eagle | *Polemaetus bellicosus* | Passive | Takes hyrax, young gazelle; vervet "eagle alarm" trigger |
| Tawny Eagle | *Aquila rapax* | Passive | Kleptoparasite at kills |
| Bateleur | *Terathopius ecaudatus* | Passive | Iconic rocking flight |
| African Fish Eagle | *Icthyophaga vocifer* | Passive | River-bend call: "sound of Africa" ambient audio |
| Long-crested Eagle, Augur Buzzard | *Lophaetus occipitalis*, *Buteo augur* | Passive | Riverine/escarpment |
| Secretarybird | *Sagittarius serpentarius* | Passive | Stomps snakes: snake-presence indicator |
| Common Ostrich (Masai Ostrich) | *Struthio camelus massaicus* | **Neutral → Aggressive** (breeding males) | Forward kick can disembowel; pink-necked breeding males |
| Kori Bustard | *Ardeotis kori* | Passive | Heaviest flying bird; follows herds/fire |
| Southern Ground Hornbill | *Bucorvus leadbeateri* | Passive | Booming dawn call (audible 3 km); hunts reptiles on foot |
| Grey Crowned Crane | *Balearica regulorum* | Passive | Wet grassland, dancing displays |
| Helmeted Guineafowl | *Numida meleagris* | Passive | Food source; **loud alarm flush** reveals player to predators |
| Crested Francolin, Coqui Francolin | *Ortygornis sephaena*, *Campocolinus coqui* | Passive | Food source; flush |
| Yellow-throated Sandgrouse | *Pterocles gutturalis* | Passive | Dawn flights to water: **follow them to find water** (real bushcraft) |
| Red-billed & Yellow-billed Oxpecker | *Buphagus erythrorynchus* / *B. africanus* | Passive | Hiss/flush when the player approaches buffalo/rhino: **acts as an alarm** for the host animal |
| Cattle Egret | *Bubulcus ibis* | Passive | Follows elephants/buffalo |
| Lilac-breasted Roller | *Coracias caudatus* | Passive | Visual colour accent |
| Superb Starling | *Lamprotornis superbus* | Passive | Camp scavenger |
| Hamerkop | *Scopus umbretta* | Passive | Giant nests (Smart Object: nest material resource) |
| Saddle-billed Stork | *Ephippiorhynchus senegalensis* | Passive | Wetlands |
| Egyptian Goose | *Alopochen aegyptiaca* | Passive | River |
| Greater Honeyguide | *Indicator indicator* | Passive | **Guides humans to bee nests** (well documented in East African cultures): a mini-game if a guiding call is answered |
| Verreaux's (Giant) Eagle-Owl | *Ketupa lactea* | Passive | Pink eyelids; night ambient |
| Spotted Eagle-Owl | *Bubo africanus* | Passive | Night ambient |
| Red-billed Quelea | *Quelea quelea* | Passive | Mega-flocks (Niagara boids, 50k+ particles) |

### 1.5.1 AI & Tech — Birds
- **Thermal Soaring System:** `UMaraThermalField` generated from surface heating (sun elevation × albedo grid, max around 13:00–15:00). Vultures (Niagara-driven boid flock with mesh renderer + skeletal LOD0 when < 50 m) ride thermals, then glide (−1 m/s sink rate) toward carcasses. **A rising vulture column = a fresh kill (danger and opportunity).**
- **Ground-Bird Flush Events:** guineafowl/francolin/sandgrouse coveys flush when the player is within 6–12 m (less when crouched). The flush emits a `Noise` event with radius 120 m → predators investigate.
- **Oxpecker Sentinels:** attached via sockets to buffalo/rhino/giraffe; when the player is detected they hiss + fly → host enters `Alert`.
- **Bird LOD:** Niagara mesh particle flocks beyond 50 m; < 50 m spawn skeletal actors from a pool (handoff with the same transform/velocity).

### 1.5.2 Blender Notes — Birds
- `SKEL_Fauna_Bird_Raptor`, `SKEL_Fauna_Bird_Ground`, `SKEL_Fauna_Bird_Small`: wings with **primary/secondary feather bone groups** (≥ 10 primaries individually rotatable for vulture "finger" tips while soaring).
- Feathers: card-based shells with alpha (Substrate with two-sided foliage-like slab) for LOD0, baked to opaque geometry for LOD1+. For the vulture's bald head/neck, use SSS skin.
- Ostrich: separate `SKEL_Fauna_Ratite` (2-toed foot with a large claw: kick attack anim).

---

## 1.6 TIER VI — REPTILES, AMPHIBIANS & INVERTEBRATES

### Reptiles & Amphibians

| Species | Scientific Name | Threat | Notes |
|---------|-----------------|--------|-------|
| Nile Crocodile | *Crocodylus niloticus* | Ambush | (See Tier I) |
| Nile Monitor | *Varanus niloticus* | Neutral | Up to 2 m; raids croc nests; tail whip |
| Black Mamba | *Dendroaspis polylepis* | **Aggressive (when cornered)** | Fastest snake in Africa (~15–20 km/h burst); kopjes/termite mounds; **neurotoxic**: death in hours without antivenom |
| Puff Adder | *Bitis arietans* | **Ambush** | Doesn't flee: relies on camouflage → most bites happen by stepping on it; **cytotoxic** |
| Black-necked Spitting Cobra | *Naja nigricollis* | Aggressive | Spits venom at eyes (2–3 m): `Status.Blinded` (vision blur PP for minutes, wash eyes with water/milk) |
| Egyptian Cobra | *Naja haje* | Aggressive (cornered) | Hood display |
| Central African Rock Python | *Python sebae* | Ambush (small prey) | Up to 5 m+; constricts; can take gazelle/young antelope |
| Boomslang | *Dispholidus typus* | Passive (rear-fanged, shy) | Trees; haemotoxic; birds mob it |
| Red-headed Rock Agama | *Agama lionotus* | Passive | Kopje colour accent; head-bobbing |
| Leopard Tortoise | *Stigmochelys pardalis* | Passive | Slow, food/lore |
| Helmeted Terrapin | *Pelomedusa subrufa* | Passive | Waterholes; aestivates in mud during dry season |
| Tree Frogs / Reed Frogs | *Hyperolius* spp. | Passive | **Wet-season night chorus** (audio = rain-season ambient driver) |
| African Bullfrog | *Pyxicephalus adspersus* | Neutral (bites!) | Emerges after first heavy rains: event-driven spawn |

### Invertebrates

| Species / Group | Scientific Name | Threat | Systemic Role |
|-----------------|-----------------|--------|---------------|
| Mound-building Termites | *Macrotermes* spp. (*M. subhyalinus*, *M. michaelseni*) | Passive | **Termite mounds** (PCG): sentinel vantage points, aardvark/mongoose dens, clay crafting resource; alates swarm after the first rains (protein food event) |
| Siafu / Safari Ants (Driver Ants) | *Dorylus* spp. | **Aggressive (swarm)** | Column hazard: DoT if standing in a column; forces camp relocation (Niagara swarm + decals) |
| Tsetse Fly | *Glossina* spp. | Aggressive (biting) | Riverine/woodland zones; attracted to dark blue/black colours (real); `Status.Trypanosomiasis` (sleeping sickness) chance |
| Anopheles Mosquito | *Anopheles* spp. | Aggressive (biting) | Wet season, dusk–dawn near standing water → `Status.Malaria` |
| Dung Beetles | *Scarabaeinae* | Passive | Ambient + ecological ("dung is cleared" visual over time) |
| African Honey Bee | *Apis mellifera scutellata* | **Aggressive** (if hive disturbed) | Honey resource; swarm attack (smoke reduces aggression) |
| Desert Locust **(R)** | *Schistocerca gregaria* | Passive (crop/grass) | Rare plague event: mass grazing loss |
| Emperor / Giant Scorpion | *Pandinus* spp. | Neutral | Under rocks/logs at night; glows under UV torch (gear feature) |
| Thick-tailed Scorpion | *Parabuthus* spp. | Aggressive | More venomous; drier kopjes |
| Baboon Spider (Tarantula) | *Pterinochilus* spp. | Neutral | Burrows |
| Camel Spider (Solifuge) | Solifugae | Passive | Fast, scary, harmless: horror tension "fake-out" |
| Ticks | *Rhipicephalus*, *Amblyomma* spp. | Passive (attach) | Tall grass; `Status.TickBorneFever` (check/remove at camp) |
| Army Worms | *Spodoptera exempta* | Passive | Rainy season outbreaks |

### 1.6.1 AI & Tech — Reptiles/Invertebrates
- **Snake Encounter Volumes:** PCG spawns `Hazard.Snake` probability fields: puff adder (grass/game trail edges, 15%/ha), mamba (termite mounds/kopje crevices), cobra (burrows), python (riverine/water edges). Snakes are mostly *hidden* until within 2–4 m: **audio first** (puff adder hiss at 3 m, cobra hood rustle).
- **Insect Swarms:** Niagara GPU (no AI); gameplay through overlap volumes and status-effect probabilities per second exposed.
- **Termite Mound Lifecycle:** mounds are persistent (decades-old) PCG actors with optional `Active` state (alate emergence event post-rain).

### 1.6.2 Blender Notes — Reptiles/Invertebrates
- **Snakes:** `SKEL_Fauna_Serpent`, 60–120 bones along a spline; locomotion via **spline-following procedural animation in Control Rig** (lateral undulation, rectilinear for puff adder, sidewinding not needed), not keyframes.
- **Scales:** baked high-res normals from a Geometry Nodes scale scatter; Substrate with a thin iridescent clear-coat (puff adder chevrons via mask).
- **Insects:** individual meshes 100–500 tris for Niagara mesh renderer; hero termite/beetle at 2–5k with simple bone rigs.

---

## 1.7 Master Spawn & Population Budget

| Group | Simulated (Statistical) | Mass Active (< 1.5 km) | Full Actor (< 150 m) |
|-------|-------------------------|-------------------------|----------------------|
| Wildebeest (Dry season peak) | 40,000 | 4,000 | 80 |
| Zebra | 8,000 | 1,000 | 30 |
| Gazelle (Tommy + Grant's) | 6,000 | 800 | 30 |
| Buffalo | 1,500 | 300 | 15 |
| Elephants | 150 | 60 | 12 |
| Lions | 60 (6 prides + nomads) | 30 | 10 |
| Hyenas | 200 (4 clans) | 40 | 10 |
| Leopards | 15 | 4 | 2 |
| Cheetahs | 10 | 4 | 3 |
| Crocodiles | 120 (river-bound) | 40 | 10 |
| Hippos | 400 (pods) | 80 | 20 |
| Birds (flock agents) | — | 50k particles | 30 skeletal |
| Ambient small life | — | 2,000 | 40 |

**Fauna Validation Rule (editor tool `MaraEditor`):** fail the build if any `DA_Fauna_*` asset lacks: threat level, activity curve, ≥ 1 biome tag, FID, LODs 0–3 (or VAT), footprint decal, and an audio set (idle, alarm, threat, pain, death).
