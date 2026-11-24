// Hannibal crosses the Alps, 218 BC. Route schematic; the Alpine pass is disputed (FACTS.md).
export default function build(T, E, DUR) {
  const NC = [-0.986, 37.600], PYR = [2.86, 42.46], RHONE = [4.75, 44.02], GREN = [5.72, 45.19], CLAP = [6.92, 45.18], SUSA = [7.05, 45.14], TURIN = [7.68, 45.07];
  const LEG1 = [NC, [-0.45, 38.75], [-0.27, 39.68], [0.52, 40.81], [1.6, 41.35], [2.4, 41.9], PYR];
  const LEG2 = [PYR, [3.0, 43.18], [4.0, 43.7], RHONE];
  const LEG3 = [RHONE, [4.85, 44.6], [4.88, 44.97], [5.3, 45.12], GREN];
  const LEG4 = [GREN, [6.05, 45.45], [6.35, 45.28], [6.65, 45.22], CLAP, SUSA, [7.35, 45.1], TURIN];
  const ALT1 = [[4.9, 44.1], [5.6, 44.45], [6.3, 44.62], [7.04, 44.70], [7.49, 44.64]];    // Durance / Col de la Traversette
  const ALT2 = [[6.35, 45.28], [6.78, 45.30], [6.90, 45.25], [7.05, 45.14]];              // Mont Cenis
  const PO_A = [7.83, 45.02], PO_G = [7.68, 45.02];
  return {
    ex: 3, fov: 38, drift: .2,
    cam: [
      [0, 260, 58, 0, NC[0], NC[1], 0],
      [T('v02') - .2, 420, 60, 0, -0.5, 38.4, 0],
      [T('v02') + 2.4, 1250, 68, 225, 4.6, 41.4, 0],
      [T('v03') - .2, 1200, 68, 225, 4.6, 41.4, 0],
      [T('v03') + 2.4, 760, 55, 222, 2.3, 41.9, 0],
      [T('v04') - .2, 700, 52, 222, 2.9, 42.5, 0],
      [T('v04') + 2.0, 330, 48, 225, 4.4, 43.9, 0],
      [T('v05') - .1, 300, 46, 230, 5.0, 44.6, 0],
      [T('v05') + 1.6, 120, 34, 245, 6.0, 45.3, 1],
      [T('v06') + 3.4, 70, 26, 262, 6.6, 45.24, 1],
      [T('v07') + 1.4, 250, 58, 200, 6.4, 45.0, 0],
      [T('v08') - .1, 240, 58, 205, 6.4, 45.0, 0],
      [T('v08') + 1.4, 70, 28, 268, 6.95, 45.17, 1.2],
      [T('v09') + 2.0, 95, 36, 258, 7.55, 45.06, .5],
      [T('v10') + .4, 72, 7, 180, 7.755, 45.02, 5.5],
      [DUR, 68, 8, 184, 7.755, 45.02, 5.5]],
    aper: t => t > T('v10') ? 3 : 6,
    snow: [[0, 0], [T('v06') - .4, 0], [T('v06') + .8, .14], [T('v09'), .14], [T('v09') + 1.5, 0]],
    title: { ll: NC, t0: .6, t1: T('v02') - .1, x: 90, y: 460, text: 'HANNIBAL', sub: '218 BC · SPAIN TO ITALY', coord: '37°36′N   0°59′W · NEW CARTHAGE' },
    labels: [
      [-3.8, 40.2, 'IBERIA', 'landL', T('v02') + 1.2, T('v03') + 2], [3.0, 46.2, 'GAUL', 'landL', T('v02') + 1.3, T('v03') + 2],
      [11.8, 43.6, 'ITALY', 'landL', T('v02') + 1.4, T('v03') + 2], [5.5, 39.6, 'MEDITERRANEAN SEA', 'sea', T('v02') + 1.2, T('v03') + 2],
      [7.2, 38.3, 'ROME RULES THE SEA', 'noteI', T('v02') + 1.8, T('v03') + 1.2],
      [6.2, 45.55, 'THE ALPS', 'landL', T('v05') + .6, T('v06') + 2],
      [7.04, 44.70, 'TRAVERSETTE?', 'noteI', T('v07') + 1.8, T('v08') + 1], [6.90, 45.27, 'MONT CENIS?', 'noteI', T('v07') + 2.1, T('v08') + 1],
      [6.92, 45.15, 'CLAPIER?', 'note', T('v07') + 1.5, T('v08') + 1],
      [7.9, 45.25, 'PO VALLEY', 'landS', T('v09') + .6, T('v10')]],
    dots: [
      { ll: NC, t: .8, out: T('v03') + 2, label: 'NEW CARTHAGE', side: 'r' },
      { ll: [12.48, 41.90], t: T('v02') + 1.2, out: T('v03') + 2, label: 'ROME', side: 'r' },
      { ll: PYR, t: T('v03') + 2.4, out: T('v04') + 2, label: 'PYRENEES', side: 'r' },
      { ll: RHONE, t: T('v04') + 1.4, out: T('v05') + .5, label: 'RHÔNE CROSSING', side: 'r' },
      { ll: TURIN, t: T('v09') + .8, out: T('v10'), label: 'TAURINI', side: 'r' }],
    lines: [
      { id: 'l1', ll: LEG1, t0: T('v03') - .2, t1: T('v03') + 2.6, w: 3.2, flow: 1, flowV: 30, flowSp: 40, flowLen: 10, step: 1, lift: .3, cased: 1, sound: 'ignite' },
      { id: 'l2', ll: LEG2, t0: T('v04') - .1, t1: T('v04') + 1.6, w: 3.2, flow: 1, flowV: 30, flowSp: 40, flowLen: 10, step: 1, lift: .3, cased: 1 },
      { id: 'l3', ll: LEG3, t0: T('v04') + 1.6, t1: T('v05') + .4, w: 3.2, flow: 1, flowV: 30, flowSp: 40, flowLen: 10, step: .5, lift: .3, cased: 1 },
      { id: 'l4', ll: LEG4, t0: T('v06') - .4, t1: T('v09') + 1.2, w: 3.4, flow: 1, flowV: 6, flowSp: 8, flowLen: 2, step: .2, lift: .15, cased: 1, ease: 'lin', sound: 'ignite' },
      { id: 'a1', ll: ALT1, col: 'ice', dash: 1.5, t0: T('v07') + .4, t1: T('v07') + 2, out: [T('v08') + .6, T('v08') + 1.4], w: 2.4, step: .2, lift: .15 },
      { id: 'a2', ll: ALT2, col: 'ice', dash: 1.0, t0: T('v07') + .8, t1: T('v07') + 2.2, out: [T('v08') + .6, T('v08') + 1.4], w: 2.4, step: .1, lift: .15 }],
    movers: [{ line: 'l2', n: 8, t0: T('v04') + .2, t1: T('v05'), v: 90, gap: 9, spread: .8, scale: .004 },
             { line: 'l4', n: 14, t0: T('v06'), t1: T('v09') + 2, v: 14, gap: 1.6, spread: .7, scale: .005 }],
    pillars: [
      { id: 'p59', at: [[0, ...PYR]], n: [[0, 11.8]], t0: T('v03') + 2.3, t1: T('v04') + .4, R: 14, SH: 7, label: '~59,000', sub: 'MEN · POLYBIUS' },
      { id: 'g59', col: 'ghost', at: [[0, ...PO_G]], n: [[0, 11.8]], t0: T('v10') - .2, R: 2.1, SH: 1.15, label: '59,000', sub: 'AT THE PYRENEES' },
      { id: 'p26', at: [[0, ...PO_A]], n: [[0, 5.2]], t0: T('v09') + 1.0, R: 2.1, SH: 1.15, label: '~26,000', sub: 'INTO ITALY · POLYBIUS' }],
    texts: [
      { t0: T('v08') + .3, t1: T('v09') - .1, x: 70, y: 330, lines: [['15 DAYS', 120, 'light'], ['TO CROSS THE ALPS · POLYBIUS', 30, 'amberSoft', 500]] },
      { t0: T('v07') + .3, t1: T('v08') - .1, x: 70, y: 330, lines: [['WHICH PASS?', 96, 'light'], ['STILL DEBATED · ROUTES SCHEMATIC', 30, 'amberSoft', 500]] }],
    credits: ['ELEVATION AWS TERRAIN TILES · IMAGERY SENTINEL-2 CLOUDLESS 2016 BY EOX (CC BY 4.0)', 'VERTICAL ×3 · ROUTE SCHEMATIC · 1 SLAB = 5,000 MEN · FIGURES: POLYBIUS'],
    ev: [{ t: T('v02') - .2, type: 'whoosh' }, { t: T('v05') - .1, type: 'dive' }, { t: T('v07') + .2, type: 'whoosh' }, { t: T('v08') + .2, type: 'whoosh' }, { t: T('v10'), type: 'whoosh' }],
  };
}
