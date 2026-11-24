// D-Day, 6 June 1944: flows converge. Routes schematic (FACTS.md).
export default function build(T, E, DUR) {
  const Z = [-1.0, 50.45];
  const PORTS = [['PLYMOUTH', [-4.14, 50.36]], ['DARTMOUTH', [-3.58, 50.34]], ['PORTLAND', [-2.45, 50.56]], ['POOLE', [-1.98, 50.70]], ['SOUTHAMPTON', [-1.40, 50.89]], ['PORTSMOUTH', [-1.09, 50.79]], ['NEWHAVEN', [0.06, 50.78]]];
  const VIA = { PLYMOUTH: [[-3.6, 50.15], [-2.4, 50.3]], DARTMOUTH: [[-3.3, 50.25], [-2.2, 50.35]], PORTLAND: [[-2.0, 50.45]], POOLE: [[-1.7, 50.55]], SOUTHAMPTON: [[-1.3, 50.75], [-1.15, 50.6]], PORTSMOUTH: [[-1.0, 50.65]], NEWHAVEN: [[-0.4, 50.6]] };
  const BEACH = [['UTAH', [-1.18, 49.415]], ['OMAHA', [-0.87, 49.372]], ['GOLD', [-0.57, 49.345]], ['JUNO', [-0.43, 49.338]], ['SWORD', [-0.28, 49.296]]];
  const PDH = [-0.989, 49.396];
  const bt = [0, .75, 1.45, 2.05, 2.65];
  return {
    ex: 3, fov: 38, drift: .2, haze: 0x4d5864,
    cam: [
      [0, 26, 8, 182, -0.8, 49.55, 0],
      [T('v02') - .4, 40, 14, 182, -0.8, 49.6, 0],
      [T('v02') + 2.0, 430, 60, 182, -1.7, 50.15, 0],
      [T('v03') + 4.5, 330, 58, 184, -1.3, 50.25, 0],
      [T('v04') + .6, 200, 48, 190, -0.9, 49.95, 0],
      [T('v04') + 3.3, 150, 44, 186, -0.85, 49.7, 0],
      [T('v05') + 1.6, 120, 62, 262, -0.73, 49.36, 0],
      [T('v06') + 3.2, 112, 60, 266, -0.73, 49.36, 0],
      [T('v07') - .2, 40, 30, 150, -0.95, 49.39, 0],
      [T('v07') + 1.0, 5.2, 6, 92, -0.989, 49.393, .12],
      [T('v08') - .4, 5.0, 7, 98, -0.989, 49.393, .12],
      [T('v08') + 1.4, 48, 20, 172, -0.72, 49.40, 3.5],
      [T('v09') - .3, 52, 24, 168, -0.72, 49.40, 3.5],
      [T('v09') + 2.6, 330, 60, 182, -1.3, 50.0, 0],
      [DUR, 345, 61, 184, -1.3, 50.0, 0]],
    aper: t => (t > T('v07') && t < T('v08')) ? 9 : 6,
    title: { ll: [-0.73, 49.36], t0: .6, t1: T('v02') - .1, x: 90, y: 430, text: 'D-DAY', sub: '6 JUNE 1944 · NORMANDY', coord: '49°22′N   0°44′W' },
    labels: [
      [-1.9, 51.05, 'ENGLAND', 'landL', T('v02') + 1.2, T('v04') + 1], [-0.6, 48.95, 'FRANCE', 'landL', T('v02') + 1.4, T('v04') + 1],
      [-2.6, 50.05, 'ENGLISH CHANNEL', 'sea', T('v02') + 1.2, T('v04') + 1], [-1.3, 50.665, 'ISLE OF WIGHT', 'landS', T('v03') + .4, T('v04') + .5],
      [-1.4, 49.50, 'BAY OF THE SEINE', 'sea', T('v05') + .4, T('v06') + 2]],
    dots: [
      ...PORTS.map(([n, ll], i) => ({ ll, t: T('v02') + .4 + i * .25, out: T('v04') + .6, label: n, side: i > 4 ? 'r' : 'l', size: 24 })),
      { ll: Z, t: T('v03') + 2.2, out: T('v04') + 1, label: 'PICCADILLY CIRCUS', side: 'r', size: 28 },
      ...BEACH.map(([n, ll], i) => ({ ll, t: T('v06') + bt[i], out: T('v07') + .4, label: n, side: 'r', size: 34 })),
      { ll: PDH, t: T('v07') - .2, out: T('v07') + 1.2, label: 'POINTE DU HOC', side: 'r', size: 30 }],
    lines: [
      ...PORTS.map(([n, ll], i) => ({ id: 'p' + i, ll: [ll, ...VIA[n], Z], sea: 1, t0: T('v02') + .6 + i * .25, t1: T('v03') + 2.2 + i * .1, out: [T('v09') + 3, T('v09') + 4], outTo: .5, w: 2.6, flow: 1, flowV: 25, flowSp: 30, flowLen: 8, step: .5 })),
      ...BEACH.map(([n, ll], i) => ({ id: 'b' + i, ll: [Z, [lerp(Z[0], ll[0], .45), 50.0], [ll[0], ll[1] + .14], [ll[0], ll[1] + .02]], sea: 1, t0: T('v04') + .2 + i * .12, t1: T('v04') + 3.0 + i * .12, w: 3, flow: 1, flowV: 20, flowSp: 22, flowLen: 6, step: .3, sound: i ? 'draw' : 'ignite' }))],
    movers: BEACH.map((b, i) => ({ line: 'b' + i, n: 9, t0: T('v04') + .4, t1: T('v06') + 1, v: 22, gap: 6, spread: .8, scale: .006 })),
    measures: [{ a: [-1.25, 49.43], b: [-0.22, 49.29], t0: T('v05') + 1.0, t1: T('v06') - .2, label: '≈ 80 KM', cap: 'FIVE BEACHES', dx: 40, dy: 0 }],
    section: { a: [-0.989, 49.383], b: [-0.989, 49.405], t0: T('v07') + .4, t1: T('v08') - .3, base: .12, vex: 3,
      cap: 'SECTION · POINTE DU HOC', head: ['THE CLIFFS'], note: 'CLIFF HEIGHT ×9 · ABOUT 30 M',
      marks: [[.55, 'CLIFF TOP', .05]] },
    pillars: [{ id: 'troops', sea: 1, at: [[0, -0.72, 49.45]], n: [[0, 15.6]], t0: T('v08') + .6, t1: T('v09') + 1.2, R: 1.3, SH: .55, grow: 2.4, label: '~156,000', sub: 'ALLIED TROOPS ASHORE · BY SEA AND AIR' }],
    credits: ['ELEVATION AWS TERRAIN TILES · IMAGERY SENTINEL-2 CLOUDLESS 2016 BY EOX (CC BY 4.0)', 'VERTICAL ×3 · ROUTES SCHEMATIC · 1 SLAB = 10,000 TROOPS'],
    ev: [{ t: T('v02') - .4, type: 'whoosh' }, { t: T('v05') - .2, type: 'dive' }, { t: T('v07') - .2, type: 'whoosh' }, { t: T('v08') + .2, type: 'whoosh' }, { t: T('v09'), type: 'rise' },
      ...BEACH.map((b, i) => ({ t: T('v06') + bt[i], type: 'beach', i }))],
  };
  function lerp(a, b, k) { return a + (b - a) * k; }
}
