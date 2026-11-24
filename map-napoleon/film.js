// Napoleon in Russia, 1812. Figures from Minard's 1869 chart; route schematic (FACTS.md).
export default function build(T, E, DUR) {
  const KAU = [23.90, 54.90], VIL = [25.28, 54.69], VIT = [30.20, 55.19], SMO = [32.05, 54.78], VYA = [34.29, 55.21], BOR = [35.82, 55.52], MOS = [37.62, 55.75];
  const MAL = [36.47, 55.01], ORS = [30.42, 54.51], BER = [28.36, 54.33];
  const ADV = [KAU, VIL, [27.6, 55.0], VIT, SMO, VYA, BOR, MOS];
  const RET = [MOS, MAL, [34.29, 55.12], [32.05, 54.70], ORS, BER, [26.6, 54.55], VIL, [24.6, 54.82], [23.92, 54.86]];
  const fmt = n => (Math.round(n) * 1000).toLocaleString('en-US');
  return {
    ex: 3, fov: 38, drift: .15,
    cam: [
      [0, 7, 10, 182, 23.92, 54.895, .5],
      [T('v02') + 3, 16, 24, 190, 23.92, 54.895, 1.2],
      [T('v03') + .2, 30, 30, 190, 23.95, 54.9, 1],
      [T('v03') + 3.0, 660, 58, 270, 30.6, 55.0, 0],
      [T('v04') + .4, 630, 56, 270, 30.4, 55.0, 0],
      [T('v05') + 2.4, 560, 50, 268, 32.6, 55.05, 0],
      [T('v06') + 1.6, 230, 40, 262, 37.1, 55.6, 20],
      [T('v07') + 3.2, 210, 40, 256, 37.3, 55.6, 20],
      [T('v08') + 1.8, 640, 56, 90, 32.0, 54.9, 0],
      [T('v09') + 3.4, 600, 52, 92, 27.5, 54.8, 0],
      [T('v10') + .6, 640, 5, 180, 24.3, 54.9, 120],
      [DUR, 600, 6, 184, 24.3, 54.9, 120]],
    aper: t => t > T('v10') ? 2 : 5,
    bloomNear: 40,
    snow: [[0, 0], [T('v08') + .6, 0], [T('v09') + 1.5, .7], [DUR, .7]],
    title: { ll: [23.92, 54.895], t0: .6, t1: T('v02') - .1, x: 90, y: 430, text: 'NIEMEN', sub: 'JUNE 1812 · INTO RUSSIA', coord: '54°54′N   23°54′E · KOVNO' },
    labels: [
      [30.6, 56.15, 'TO MOSCOW', 'note', T('v03') + 2.2, T('v04') + 1],
      [35.4, 54.55, 'SCORCHED EARTH', 'note', T('v03') + 2.6, T('v04') + 1]],
    dots: [
      { ll: VIT, t: T('v04') + 1.7, out: T('v06'), label: 'VITEBSK', side: 'l' },
      { ll: SMO, t: T('v04') + 2.6, out: T('v06'), label: 'SMOLENSK', side: 'r', dy: 34 },
      { ll: BOR, t: T('v04') + 3.5, out: T('v06') + 2, label: 'BORODINO', side: 'l' },
      { ll: MOS, t: T('v06') + .4, out: T('v08') + 1.2, label: 'MOSCOW', side: 'r', size: 34 },
      { ll: BER, t: T('v09') + 1.8, out: T('v10'), label: 'BEREZINA', side: 'r', col: 'teal' },
      { ll: KAU, t: T('v10') - .4, out: DUR, label: 'NIEMEN', side: 'r' }],
    lines: [
      { id: 'adv', ll: ADV, t0: T('v04') - .2, t1: T('v06') + .6, w: 3.4, flow: 1, flowV: 40, flowSp: 60, flowLen: 14, step: 1, lift: .3, ease: 'lin', sound: 'ignite' },
      { id: 'ret', ll: RET, col: 'teal', t0: T('v08') + .2, t1: T('v10') + .2, w: 3.4, flow: 1, flowV: 40, flowSp: 60, flowLen: 14, step: 1, lift: .4, ease: 'lin', sound: 'ignite' }],
    areas: [{ ll: [[37.2, 55.9], [37.95, 55.95], [38.1, 55.6], [37.5, 55.5], [37.15, 55.6]], t0: T('v07') - .2, t1: T('v08') + 1.6, op: .42, fill: 'rgb(214,84,40)' }],
    pillars: [
      { id: 'open', at: [[0, 23.95, 54.905]], n: [[0, 42.2]], t0: T('v01') + .6, t1: T('v03') + 2.6, R: .32, SH: .085, grow: 3.2, slabEv: false, label: '422,000', sub: "MEN · BY MINARD'S COUNT" },
      { id: 'army', at: [[T('v03') + 2.6, ...KAU], [T('v04') - .2, ...KAU], [T('v04') + 2.6, ...VIT], [T('v05') + 2.2, ...SMO], [T('v06') + .6, ...MOS], [T('v08') + .2, ...MOS], [T('v09') + 1.8, ...BER], [T('v10') - .2, 23.95, 54.88]],
        n: [[T('v03'), 42.2], [T('v04') - .2, 42.2], [T('v06') + .6, 10], [T('v08') + .2, 10], [T('v10') - .2, 1]], t0: T('v03') + 2.6, R: 14, SH: 4.4, grow: .6, slabEv: false,
        label: (t, n) => [[42.2, '422,000'], [10, '100,000'], [1, '10,000']].find(([v]) => Math.abs(n - v) < .06)?.[1] || '', sub: 'MEN' },
      { id: 'ghost', col: 'ghost', at: [[0, 23.0, 54.9]], n: [[0, 42.2]], t0: T('v10') + .2, R: 14, SH: 4.4, grow: 1.6, slabEv: false, label: '422,000', sub: 'IN JUNE' }],
    credits: ['ELEVATION AWS TERRAIN TILES · IMAGERY SENTINEL-2 CLOUDLESS 2016 BY EOX (CC BY 4.0)', 'VERTICAL ×3 · ROUTES SCHEMATIC · 1 SLAB = 10,000 MEN · FIGURES: MINARD (1869)'],
    ev: [{ t: T('v03') + .2, type: 'whoosh' }, { t: T('v06') - .2, type: 'dive' }, { t: T('v08') + .4, type: 'whoosh' }, { t: T('v10'), type: 'whoosh' }, { t: T('v07'), type: 'fire' }, { t: T('v08') + .6, type: 'wind' }],
  };
}
