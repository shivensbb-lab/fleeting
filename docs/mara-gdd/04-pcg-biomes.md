# 04 — Environment & Procedural Biomes (UE5 PCG)

## 4.0 World Structure

| Layer | Tool | Output |
|-------|------|--------|
| **Macro terrain** (16 × 16 km) | Gaea / World Machine / Houdini from real SRTM/Copernicus 30 m DEM of the Mara as a *reference*, upsampled and art-directed | 16-bit heightmap (8161² @ ~2 m/px across landscape components), flow/erosion masks, deposition, slope, concavity |
| **Hydrology** | Houdini/Gaea flow maps → splines | Mara River, Talek River, Sand River equivalent, 30–60 seasonal **luggas** (dry sand riverbeds), waterholes, swamp (Musiara-like marsh) |
| **Biome map** | Painted + derived masks → **Biome ID texture** (RGBA8, 4 m/px) | Open Savannah / Bushed Grassland / Riverine Forest / Kopje / Swamp / Escarpment / Lugga / Burnt (runtime) |
| **Landscape** | UE Landscape, World Partition, Landscape Edit Layers | Material layers painted *from* masks via editor utility |
| **Population** | **PCG framework** (hierarchical, partitioned) | All vegetation, rocks, trails, termite mounds, carcass/bone fields, Smart Objects |
| **Runtime layer** | **GPU PCG / Runtime Generation** | Near-player grass and micro-detail responding to grazing, burn and season |

### 4.0.1 Master PCG Graph Topology

```
PCG_World_Master  (Partitioned, Hierarchical Generation; grid sizes 512 m / 128 m / 32 m)
 ├─ [512 m]  PCGS_Macro_Trees         (Acacia/Balanites/fig, kopje placement, termite mounds, game trails)
 ├─ [128 m]  PCGS_Meso_Shrubs         (Croton thickets, whistling thorn, fallen logs, rocks)
 ├─ [32 m]   PCGS_Micro_Detail        (debris, dung, bones, flowers, grass clumps outside runtime radius)
 ├─ Runtime  PCGS_Runtime_Grass       (GPU, generated within 120–200 m of the player, reads GrassHeightRT/BurnRT)
 └─ Biome subgraphs (selected per point by Biome ID sampling)
       ├─ PCG_Biome_OpenSavannah
       ├─ PCG_Biome_RiverineForest
       ├─ PCG_Biome_Kopje
       ├─ PCG_Biome_Lugga
       └─ PCG_Biome_Swamp
```

**Shared inputs to every biome graph** (via `Get Texture Data` / `Get Landscape Data` / attribute sampling):
`Slope`, `Height`, `Concavity`, `FlowAccumulation`, `DistanceToWater` (SDF texture from water splines), `BiomeID`, `SoilType`, `TrailMask`, `ExclusionMask` (gameplay-authored: camps, quest areas), `SeasonAlpha` (runtime only).

> **Engine note:** recent UE versions ship a **PCG Biome Core** sample plugin (biome definitions as data assets + layered generation). Prototype on it, but keep Mara-specific rules in our own subgraphs so engine upgrades don't break the world.

---

## 4.1 OPEN SAVANNAH GRASSLANDS (`PCG_Biome_OpenSavannah`)

The iconic Mara plain: rolling red-oat grass (*Themeda triandra*) with scattered flat-topped acacias, drainage-line thickets, termite mounds and game trails converging on water.

### 4.1.1 Species Palette (Vegetation)

| Layer | Species | Density / Rule | Asset Type |
|-------|---------|----------------|------------|
| **Dominant grass** | Red oat grass *Themeda triandra* (Dry: rust-gold seed heads; Wet: green) | Base coverage 85–95% | Nanite foliage clumps / instanced cards (see §4.1.3) |
| Secondary grasses | *Pennisetum mezianum*, *Digitaria macroblephara*, *Cynodon* (lawn grazing patches), *Sporobolus* | Short-grass "lawns" where grazing is heavy (GrassHeightRT < 10 cm) | Low clumps |
| **Signature tree** | Umbrella thorn *Vachellia tortilis* | 0.5–3 per ha, clustered on well-drained rises | Nanite hero trees (4–6 variants + age classes) |
| Gall acacia | Whistling thorn *Vachellia drepanolobium* | Dense stands on **black cotton soil** (SoilType mask) 50–400/ha, 1–3 m tall | Nanite shrubs with ant-gall swollen thorns (audio: whistling in wind) |
| Desert date | *Balanites aegyptiaca* | 0.2–1/ha, near drainage | Nanite trees |
| Shrubs | *Croton dichogamus* thickets, *Rhus natalensis*, *Grewia* | Clustered along drainage (FlowAccumulation mid) | Nanite shrubs |
| Forbs/flowers | Fireball lily, *Aspilia*, *Ipomoea* (Wet only) | Seasonal spawn `SeasonAlpha > 0.5` | Small instanced meshes |
| **Termite mounds** | *Macrotermes* | 2–8 per ha, Poisson spacing min 25 m; on mid-slopes, avoid concavities | Nanite meshes; spawn `SO.Vantage` + `SO.Den` (if burrow) + mongoose colony chance 20% |
| Dung/bones/debris | Wildebeest/zebra dung, skulls, horns | Density follows **historical herd density** map + migration paths | Nanite decals/small meshes |

### 4.1.2 Graph Breakdown

```
1  Get Landscape Data → Surface Sampler (Points/m² = 0.02 for trees, Looseness 1.0)
2  Attribute: Sample BiomeID → Filter == OpenSavannah
3  Density Filter chain:
     Density = Noise(Perlin, scale 400 m)        // macro clustering ("tree islands")
             × SlopeCurve(0–12° → 1, 25° → 0)
             × DistanceToWaterCurve(50 m → 0.6, 400 m → 1.0, 3 km → 0.4)
             × (1 − TrailMask)
             × SoilTypeCurve(RedLoam 1.0, BlackCotton 0.15 → trees replaced by whistling thorn)
4  Self Pruning (radius = canopy radius × 1.2, prefer larger)  // canopy competition
5  Age Class: Random weighted (seedling 10%, young 25%, mature 55%, dead/snag 10% ← elephant-damaged)
6  Transform: Rotation random Z, tilt ≤ 3° aligned 30% to slope normal, scale 0.8–1.25
7  Static Mesh Spawner (weighted mesh entries per age class, Nanite)
8  Spawn sub-features around each mature tree:
     - Shade patch: Smart Object SO.Shade (radius = canopy × 0.8) → used by lions, player, antelope
     - Leaf litter / bare trampled ring (landscape RVT decal or projected Nanite decal mesh)
     - 15%: Vulture/eagle nest (crown); 5%: leopard cache candidate if near riverine/lugga (< 400 m)
9  Elephant damage pass: in elephant-density mask, 20% trees → broken/pushed-over variants + debarked trunks
```

### 4.1.3 Nanite Grass Density Strategy

Grass is the single most expensive, most important visual. Use a **three-ring system**:

| Ring | Radius | Technique | Density | Notes |
|------|--------|-----------|---------|-------|
| **R0 Hero** | 0–30 m | Nanite (or skeletal-free WPO) **geometry clumps** of 2–6k tris each, individual blades, with interaction (player/animal bending via `GrassInteractionRT` from a pooled trail render target) | 2–4 clumps / m² | GPU-generated via runtime PCG. Wind WPO, bending, footprint flattening, burn/grazing height |
| **R1 Mid** | 30–200 m | Nanite clumps, lower-poly variants (500–1.5k tris), WPO amplitude reduced with distance (`r.Nanite` WPO disable distance per-mesh: *World Position Offset Disable Distance* 150–200 m) | 0.6–1.5 / m² | Merged clumps; no interaction |
| **R2 Far** | 200 m – ∞ | **No geometry.** Landscape material "grass-coat" (RVT colour + anisotropic sheen + parallax-free fuzz/shell normal) + PCG-spawned **impostor tufts** at 4–8 m spacing near the horizon line for silhouette breakup | — | The horizon "grass texture" must match R1 colour exactly → both sample `RVT_Landscape` base colour |

**Height & state coupling:** each clump instance reads `GrassHeightRT` (from grazing grid §02) and `BurnRT` at spawn (Runtime PCG regenerates a 32 m cell when the RT changes beyond a threshold) and scales Z: `Scale.Z = GrassHeight / AuthoredHeight`. Under 5 cm → swap to "lawn" mesh; Burn > 0.5 → stubble/ash mesh; `SeasonAlpha` lerps a colour ramp in the material (`Dry gold #C7A15A → Wet green #6E8B3D`), with seed-head mask on Dry/transition.

**Performance guardrails:**
- Grass should be **Nanite** only where your target UE version supports Nanite foliage efficiently with WPO. Otherwise, use **non-Nanite HISM with LODs + aggressive cull distance** for R0/R1 (and still Nanite for trees/rocks). Profile both paths in week 1 of pre-production; this is the #1 tech risk.
- Grass: `Cast Shadow` ON for R0 only (VSM), R1 contact-shadows only, `Affect Distance Field Lighting` OFF, `Evaluate WPO` only in R0/R1, `Visible in Ray Tracing` OFF (use Lumen Far Field + screen traces).
- Keep overdraw down: avoid masked alpha cards in R0 (Nanite masked is costly). Use **opaque geometry blades**.

### 4.1.4 Game Trails & Hippo Paths (Custom PCG Node `UPCGMaraTrailCarver`)
- **Inputs:** water points (destinations), herd-density map, slope cost.
- **Algorithm:** least-cost paths (A* on a 16 m grid) from random savannah sources to water, with path *reinforcement* (paths reuse earlier paths: cost × 0.6) → realistic converging, braided trails.
- **Outputs:** spline data → `TrailMask` texture (writes landscape layer `L_TrailCompacted`), grass exclusion, dung scatter, and `Context_GameTrail` for AI EQS (predators ambush along trails near water).
- **Hippo paths:** from river pools 1–8 km inland, distinctive **paired ruts** (two parallel tracks ~0.6 m apart), dung-marked. Hippos use them at night (AI rail system §01).

---

## 4.2 RIPARIAN / RIVERINE FORESTS (`PCG_Biome_RiverineForest`)

Gallery forest lining the Mara and Talek rivers: a narrow (50–400 m) band of tall evergreen canopy, deep shade, steep muddy banks, fallen trees, hippo pools and croc-filled bends. **Leopard, baboon, colobus, bushbuck, buffalo dagga boys, crocs, hippos.**

### 4.2.1 Vertical Strata

| Stratum | Height | Species | Density / Rule |
|---------|--------|---------|----------------|
| **Emergent/Canopy** | 15–30 m | *Ficus sycomorus* (sycamore fig), *Diospyros abyssinica*, *Warburgia ugandensis*, *Euclea divinorum* (smaller), **Sausage tree *Kigelia africana*** (leopard cache, fruit) | Continuous canopy within 0–80 m of the channel, thinning outward |
| **Sub-canopy** | 5–15 m | *Teclea*, *Croton macrostachyus*, *Acacia (Vachellia) xanthophloea* (fever tree: yellow bark, swamp/riverbank) | 60–80% cover |
| **Understorey** | 1–5 m | *Croton*, *Grewia*, *Carissa spinarum*, lianas (*Capparis*), wild date palm *Phoenix reclinata* (on banks) | Dense: limits sight to 5–20 m |
| **Ground** | 0–1 m | Ferns, leaf litter, fallen logs, nettles, sedge (*Cyperus*) on banks | Logs and debris piles |
| **Bank** | — | Exposed roots, erosion scarps, **mud flats**, sand bars, croc slides, hippo exit ramps | Procedural from bank-slope mask |

### 4.2.2 Graph Breakdown

```
1  Input: Water Body River splines → "Spline Sampler" (interior/border modes)
2  Distance bands from spline edge:
      Band A (0–15 m)    → Bank features: mud flats, roots, croc slides, Phoenix palms, sedges
      Band B (15–80 m)   → Canopy core: figs/Kigelia/Diospyros (Points/m² 0.004, self-prune 9–14 m)
      Band C (80–250 m)  → Edge: fever trees, Croton thickets, Euclea, transition to savannah
      Width modulation:   band widths × Noise(scale 600 m) × FlowAccumulation  (wider at bends/confluences)
3  Bank Generation (Custom node UPCGMaraBankProfiler):
      - Reads terrain slope perpendicular to the spline
      - Steep (> 35°): erosion scarp mesh kit (Nanite), exposed root curtains, burrows (kingfisher/bee-eater holes)
      - Moderate (15–35°): **crossing-point candidates** (scored by herd approach paths + bank height) → Smart Objects SO.Crossing
      - Gentle (< 15°): mud flats + sand bars (spawn croc basking SOs, hippo exit ramps)
4  Fallen Log Pass:
      - 4–12 logs per 100 m of channel; 40% spanning partially into water (natural bridges/croc hides)
      - Physics: static Nanite, with a few "loose" dynamic logs that move in floods (Chaos, sleep until StageMeters > 3)
5  Flood Debris Line: driftwood/grass wrack spawned along the "high-water contour" (WaterLevel max authored)
6  Canopy Light: dense canopy → no Local Fog Volume over water at dawn/dusk (mist), lowered skylight via
      Lumen naturally; place 'leaf gap' light shafts with volumetric fog in clearing points
7  Smart Objects: leopard cache (Kigelia/fig with suitable horizontal limb), baboon sleeping trees, colobus troops,
      SO.Wallow (buffalo) in sedge mud, SO.Pool (hippo) at bends > 3 m deep
```

### 4.2.3 Muddy Banks (Material & Physics)
- **Landscape layer `L_RiverMud`** (Substrate): wet black-brown, roughness 0.2–0.5, puddle slab ON; dries into cracked polygonal mud (Dry season mask driven by `WaterLevelOffset` + `SoilMoisture`).
- **Displacement:** Nanite-tessellated landscape (where enabled) or Nanite mesh "bank kits" for hero crossings; RVT displacement for footprints/hoof churn (**crossings become churned mud pits after herd events**).
- **Physics material:** `PM_RiverMud` with `MudSusceptibility 1.0`, `SinkDepthMax 35 cm`, slide-down-bank behaviour on slopes > 30° (custom movement: forced slide toward water → *croc danger*).

---

## 4.3 ROCKY KOPJES (`PCG_Biome_Kopje`)

Isolated granite inselbergs ("kopjes", from Afrikaans *koppie*): rounded boulder piles 5–40 m high rising from the plain. Rich micro-ecosystems: **lion/leopard dens and lookouts, hyrax colonies, klipspringers, agamas, black mambas, eagle-owls, figs rooted in cracks, caves and overhangs.**

### 4.3.1 Kopje Archetypes

| Archetype | Size | Form | Gameplay |
|-----------|------|------|----------|
| **Boulder Pile** | 30–80 m diameter, 5–15 m high | Stacked rounded boulders with gaps | Hyrax, agamas, snakes; lion lookouts |
| **Whaleback Dome** | 50–150 m, 10–30 m | Exfoliating granite dome, sheet joints, potholes (rain pools "gnammas") | Rainwater pools (temporary clean water!), vantage point |
| **Tor Cluster** | 100–300 m | Multiple tors with caves and overhangs | **Predator den complex**, rock art site (fictionalised, respectfully), shelter |
| **Escarpment Talus** | Linear | Boulder field at the base of the escarpment | Klipspringer, leopard |

### 4.3.2 Graph Breakdown (`PCGS_Kopje_Granite`)

```
1  Kopje Seeds: authored points or Poisson on BiomeID == Kopje mask (min spacing 600 m)
2  Footprint Shape: per seed, generate a 2D blob (Spline from noise-perturbed ellipse) → point grid inside
3  Height Field: radial falloff × noise → target height map for boulder stacking
4  Boulder Stacking (custom node UPCGMaraBoulderStacker, CPU, editor-time):
      for each layer (bottom→top):
         sample positions on footprint scaled by layer (shrinks with height)
         choose boulder from kit by size class (L: 6–12 m, M: 2–6 m, S: 0.5–2 m)
         rest boulder on underlying surface (downward trace against already-placed Nanite meshes)
         reject if overlap > 15% volume (bounds approximation) or unstable (CoM outside support polygon)
      bake result → static Nanite instances (stable, deterministic seed)
5  Weathering/Material: world-aligned lichen mask (top-facing, north-facing for moisture), dark streak mask
      ("desert varnish"/rain streaks) along vertical faces, hyrax-urine white/orange streak decals near crevices
6  Cavities: identify voids between boulders (raymarch probes) → if volume ≥ 6 m³ and entrance ≤ 2 m:
      spawn SO.Den (leopard/hyena/lion) or SO.Shelter (player) + cave interior kit + darkness volume (PPV)
7  Vegetation: rock figs (Ficus) rooted in cracks, Euphorbia candelabrum, aloes, Commiphora, grass in soil pockets
8  Fauna Smart Objects: SO.Vantage on tops (lion lookout, cheetah scan), hyrax colony spawner, agama basking,
      snake hazard volume (black mamba, cobra), eagle-owl roost
9  Apron: boulder scatter + gravel landscape layer + denser shrubs 20–60 m around the base (moisture runoff)
```

### 4.3.3 Caves as Predator Dens — Rules

| Den Type | Size | Occupant Selection | Signs (for tracking) |
|----------|------|--------------------|----------------------|
| Lioness birthing den | Medium cave/thicket in kopje | Pride with a pregnant lioness: hidden 6–8 weeks | Fresh prints, cub vocalisations, lioness making repeated visits |
| Leopard lair | Narrow crevice / overhang | Leopard home-range centre | Scratch marks, scat with hair, cached remains, baboon alarm barks |
| Hyena den | Enlarged burrow at kopje base / termite mound | Clan den (communal) | Bones scattered, white calcium-rich scat (hyenas digest bone), whoops |
| Porcupine/warthog burrows | Small | Mass ambient spawns | Quills, tusk-rub marks |
| **Player shelter** | Overhang/cave ≥ 6 m³ | Unclaimed after a den-check | Must check first: entering an occupied den = encounter at point-blank range |

**Den-check mechanic:** before entering, player can: smell (scent hint UI: "musky / ammonia / rot"), look for prints, throw a stone (audio response), use torch at entrance (eyeshine), or wait at a distance. Dens are **Smart Objects with occupancy state** persisted in save data.

---

## 4.4 Supplementary Biomes (Brief)

| Biome | PCG Features |
|-------|--------------|
| **Luggas (seasonal sand rivers)** | Sand channel landscape layer, flanking dense *Croton*/fever-tree strips, sand-well dig spots (SO.Dig.Water in Dry season), flash-flood hazard volumes, leopard & elephant corridors |
| **Swamp / Marsh** (Musiara-like) | Papyrus/sedge Nanite clumps, standing-water Water Body Lakes with seasonal level, buffalo/elephant wallows, crowned cranes, high mosquito index |
| **Escarpment (Oloololo / Siria)** | Steep cliffs, forest strips, klipspringer, baboon cliffs, panoramic vantage points (sweeping valley vistas: a showcase for Lumen Far Field) |
| **Pastoral Fringe / Conservancy Edge** | Maasai *enkang* (homestead) with thorn-fence *boma*, cattle trails, community conservancy signage, ranger posts. **Built with cultural consultation; never procedurally "decorated".** |

---

## 4.5 PCG Production Rules & Performance

| Rule | Detail |
|------|--------|
| **Determinism** | All graphs seeded from cell coordinates + global seed; editor-time generation for Macro/Meso (baked to partitioned actors), runtime only for Grass/Micro near player |
| **Partitioning** | `Is Partitioned` ON, grid sizes 512/128/32 m (Hierarchical Generation). Generation radius: Macro 2 km (streamed by WP), Meso 512 m, Micro 128 m, Runtime grass 120–200 m |
| **Exclusions** | Gameplay `ExclusionMask` + per-actor "PCG Exclusion" tags (camps, quest locations, roads, crossing set-pieces) |
| **Art direction override** | `PCG_Override` volumes: designers paint "more trees here", "keep sightline clear", with priority over noise |
| **Debug** | PCG Debug Display (attribute colour), custom MaraEditor "Biome Heatmap" overlay, density stats per km² |
| **Budgets** | Max 1.2M Nanite instances in view (incl. grass clumps); trees ≤ 8,000 within 2 km; rocks ≤ 20,000 |
| **HLOD** | World Partition HLOD layers: trees/rocks → Nanite-merged HLOD 1 (> 512 m), impostor HLOD 2 (> 2 km); grass excluded from HLOD (landscape material covers far ring) |
| **Runtime hooks** | Grazing/Burn/Season RT changes trigger `UPCGComponent::GenerateLocal` on affected runtime cells only (dirty-rect tracking) |
| **Validation** | Editor tool fails if: canopy overlap > threshold, Smart Object without navmesh access, kopje den unreachable, crossing SO without both banks reachable |

### 4.5.1 Blender → UE Asset Pipeline (Environment)

| Asset | Blender Workflow | UE Settings |
|-------|------------------|-------------|
| Acacia/tree hero | Geometry Nodes branch generator or **Sapling Tree Gen** base → sculpt trunk (elephant debarking, scars) → leaf clusters as *real geometry* (small leaflets instanced; acacia pinnate leaves) | Nanite ON, Preserve Area ON (foliage), WPO wind (pivot painter-style data baked into UV channels: Pivot Painter 2 workflow) |
| Grass clump | Hair curves → convert to mesh blades (3–5 segments, tapered), vertex colour R = height gradient, G = random per-blade, B = AO | Nanite or HISM; WPO wind using vertex colour |
| Boulder kit | Sculpt in Blender (multires/dyntopo) from photogrammetry bases; exfoliation sheets; 16–24 unique boulders across 3 size classes | Nanite, 1–4M tris source, world-aligned lichen/dust via Substrate layers |
| Termite mound | Sculpt with chimney vents, erosion rills; variants: active (fresh red clay), old (grassed), eroded (aardvark-excavated hole) | Nanite; SO sockets |
| Bank kits | Modular erosion scarps, root curtains (hair-curve roots → mesh) | Nanite; landscape blending via RVT |
| Logs/debris | Photogrammetry or sculpt; termite-eaten variants | Nanite; few with simple collision for physics |
| Textures | 4K–8K atlases; scan reference: red Mara soil `#8C4A2F`, black cotton soil `#2B2622`, granite `#8E857B`, cured grass `#C7A15A` | Virtual Textures (streaming), Substrate materials |
