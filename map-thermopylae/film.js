// Thermopylae: the pass that moved. Times follow the narration (T = line start, E = line end); see TREATMENT.md and FACTS.md.
export default function build(T, E, DUR) {
  const PASS = [22.536, 38.797];                       // the middle gate (monument); mountain foot at 20 m in the terrain data
  const COAST_NOW = [[22.48, 38.828], [22.50, 38.829], [22.52, 38.836], [22.54, 38.833], [22.56, 38.822], [22.58, 38.823], [22.60, 38.823], [22.62, 38.829], [22.64, 38.831], [22.66, 38.830], [22.70, 38.830]];
  // 480 BC shoreline (schematic): the foot of the mountain, where the plain falls below ~20 m today
  const SHORE_OLD = [[22.44, 38.8195], [22.46, 38.8130], [22.48, 38.8040], [22.50, 38.8025], [22.52, 38.8025], [22.536, 38.7975], [22.56, 38.8020], [22.58, 38.8030], [22.60, 38.8125], [22.62, 38.8155], [22.64, 38.8195], [22.66, 38.8100], [22.70, 38.8080]];
  const PERSIAN = [[22.42, 39.64], [22.47, 39.30], [22.43, 38.98], [22.46, 38.86], [22.50, 38.815], PASS];
  const PATH = [[22.455, 38.800], [22.468, 38.778], [22.495, 38.764], [22.53, 38.763], [22.562, 38.772], [22.585, 38.795]];
  const RIVER = [[22.20, 38.905], [22.32, 38.895], [22.43, 38.88], [22.50, 38.868], [22.57, 38.858]];
  return {
    ex: 3, fov: 38, drift: .25,
    cam: [
      [0.0, 9, 9, 186, 22.54, 38.80, .25],
      [5.6, 14, 20, 182, 22.54, 38.80, .25],
      [T('v02') - .3, 40, 38, 180, 22.52, 38.86, 0],
      [T('v02') + 2.2, 230, 62, 176, 22.45, 39.18, 0],
      [T('v03') - .6, 240, 63, 176, 22.45, 39.16, 0],
      [T('v03') + 1.8, 22, 38, 186, 22.536, 38.80, 0],
      [T('v04') + 2.5, 16, 30, 198, 22.53, 38.80, 0],
      [T('v05') + 4.0, 12, 33, 190, 22.536, 38.81, 0],
      [T('v06') + 1.4, 7.5, 18, 222, 22.536, 38.797, .3],
      [T('v07') - .4, 6.8, 22, 246, 22.536, 38.797, .3],
      [T('v07') + 1.2, 17, 60, 172, 22.495, 38.785, .3],
      [T('v08') + 1.0, 14, 62, 180, 22.545, 38.785, .3],
      [T('v09') - .2, 15, 60, 182, 22.545, 38.79, .3],
      [T('v09') + 1.0, 24, 6, 94, 22.536, 38.81, .8],
      [T('v11') - .4, 23, 7, 100, 22.536, 38.81, .8],
      [T('v11') + 1.6, 17, 50, 188, 22.54, 38.815, 0],
      [DUR, 24, 58, 196, 22.54, 38.815, 0]],
    aper: t => (t > T('v09') && t < T('v11')) ? 9 : 6,
    title: { ll: PASS, t0: T('v03') + .4, t1: T('v04') + 3.4, x: 90, y: 430, text: 'THERMOPYLAE', sub: '480 BC · THE HOT GATES', coord: '38°48′N   22°32′E' },
    labels: [
      [22.15, 39.48, 'THESSALY', 'land', T('v02') + .8, T('v03') - .2], [23.75, 39.12, 'AEGEAN SEA', 'sea', T('v02') + .9, T('v03') - .2],
      [23.62, 38.62, 'EUBOEA', 'landS', T('v02') + 1, T('v03') - .2], [22.62, 39.42, 'PERSIAN ARMY', 'note', T('v02') + 1.6, T('v03') - .2],
      [22.515, 38.762, 'KALLIDROMO', 'landL', T('v04'), T('v06')], [22.62, 38.858, 'MALIAN GULF', 'sea', T('v04') + .3, T('v06')],
      [22.51, 38.758, 'ANOPAEA PATH · SCHEMATIC', 'note', T('v07') + 1.4, T('v09') - .1],
      [22.45, 38.885, 'SPERCHEIOS RIVER', 'noteI', T('v10') + 1.5, T('v11') + 1.5]],
    dots: [
      { ll: PASS, t: T('v02') + 3.2, out: T('v03') + .2, label: 'THERMOPYLAE' },
      { ll: PASS, t: T('v05') + .2, out: T('v06'), label: 'ROOM FOR ONE CART', size: 28 },
      { ll: [22.585, 38.795], t: T('v08') + .5, out: T('v09') - .1, label: 'ALPENI', side: 'r' }],
    lines: [
      { id: 'persian', ll: PERSIAN, t0: T('v02') + .6, t1: T('v02') + 3.4, out: [T('v03') + 1.6, T('v03') + 2.6], w: 3.2, flow: 1, flowV: 30, step: .4, lift: .1 },
      { id: 'shore', ll: SHORE_OLD, t0: T('v05') + .3, t1: T('v05') + 2.6, out: [T('v11') + 1.8, T('v11') + 3], outTo: .3, w: 3, dash: .32, lift: .02, step: .05, ease: 'lin' },
      { id: 'path', ll: PATH, t0: T('v07') + .4, t1: T('v08') + 1.4, w: 3.4, flow: 1, flowV: 1.6, flowSp: 1.4, flowLen: .5, cased: 1, step: .03, lift: .03, sound: 'ignite' },
      { id: 'river', ll: RIVER, col: 'teal', t0: T('v10') + .3, t1: T('v10') + 3, out: [T('v12') + .6, T('v12') + 1.8], outTo: .4, w: 2.8, flow: 1, flowV: 4, flowSp: 3, flowLen: 1, step: .05, lift: .02 },
      { id: 'coast', ll: COAST_NOW, col: 'ice', t0: T('v11') + .1, t1: T('v11') + 2.1, w: 3.2, step: .05, lift: .02, sound: 'ignite' }],
    areas: [{ ll: [...SHORE_OLD, [22.70, 38.85], [22.44, 38.85]], t0: T('v05') + 1, t1: T('v09') + .4, op: .38, fill: 'rgb(28,96,102)' }],
    movers: [{ line: 'persian', n: 26, t0: T('v02') + 1, t1: T('v03') + 1.5, v: 26, gap: 2.2, spread: .9, scale: .0035 }],
    pillars: [{ id: 'greeks', at: [[0, ...PASS]], n: [[0, 7]], t0: T('v06') + .2, t1: T('v08') + 2.4, R: .2, SH: .09, grow: 1.4,
      label: '~7,000', sub: 'GREEKS · INCL. 300 SPARTANS' }],
    measures: [{ a: [PASS[0], PASS[1] + .0005], b: [PASS[0], 38.8329], t0: T('v11') + 1.2, t1: DUR - .3, label: '≈ 4 KM', cap: 'SHORE THEN → SHORE NOW', dx: 34 }],
    section: { a: [22.536, 38.775], b: [22.536, 38.845], t0: T('v09') + .2, t1: T('v11') - .2, base: .25,
      cap: 'SECTION · THROUGH THE PASS', head: ['THEN AND NOW'], note: 'LAND ×3 · 480 BC SHORE SCHEMATIC',
      marks: [[.321, 'SHORE · 480 BC', .06], [.827, 'SHORE TODAY', .03]] },
    texts: [{ t0: .6, t1: T('v02') - .2, x: 70, y: 300, lines: [['480 BC', 120, 'light'], ['THE ROAD INTO GREECE', 34, 'amberSoft', 500]] }],
    credits: ['ELEVATION AWS TERRAIN TILES · IMAGERY SENTINEL-2 CLOUDLESS 2016 BY EOX (CC BY 4.0)', 'VERTICAL ×3 · ROUTES, PATH, RIVER & 480 BC SHORE SCHEMATIC'],
    ev: [{ t: T('v02') - .3, type: 'whoosh' }, { t: T('v03') - .5, type: 'dive' }, { t: T('v07') - .2, type: 'whoosh' }, { t: T('v11') + .2, type: 'whoosh' }],
  };
}
