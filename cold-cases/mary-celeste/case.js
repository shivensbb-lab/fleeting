window.CASE = (T) => ({
  C: { ink: '#1D2340', ink2: '#2A3568', paper: '#F4ECDD', cream: '#FFF4E2', hi: '#FFC628', hi2: '#2E55D6', red: '#E8384F', shadow: '#FF5A87', dot: '#2E55D6', wood: '#C98B4E', stone: '#9AA0A8' },
  caseNo: 'CASE No.1872-MC', year: '1872', title: ['THE MARY', 'CELESTE'],
  hook: g => { const s = el('g', { transform: 'translate(0 40) scale(1.15)' }, g); P.ship(s); },
  exhibits: [
    { head: ['SIX MONTHS', 'OF SUPPLIES'], draw: g => P.crate(g), stamp: 'UNTOUCHED', stampAt: 2.0, sy: 1340 },
    { head: ['1,700', 'BARRELS'], draw: g => { [[-180, -90], [0, -90], [180, -90], [-180, 90], [0, 90], [180, 90]].forEach(([x, y], i) => P.barrel(g, x, y, 0.9, i % 2 === 1)); }, stamp: '9 EMPTY', stampAt: 2.4, sx: 740, sy: 1360 },
    { head: ['THE LIFEBOAT:', 'GONE'], dark: true, draw: (g, t0) => { const lb = el('g', { transform: 'translate(0 -120)' }, g); P.lifeboat(lb);
        window._mc = [...Array(10)].map((_, i) => P.person(g, -270 + (i % 5) * 135, 130 + Math.floor(i / 5) * 170, 0.8)); window._mc0 = t0; },
      anim: (t, t0) => (window._mc || []).forEach((p, i) => op(p, 1 - seg(t, t0 + 1.2 + i * 0.15, t0 + 1.5 + i * 0.15) * 0.85)) },
  ],
  options: ['PIRATES', 'CARGO FUMES', 'A WATERSPOUT'], optT: [0.5, 1.4, 2.6],
});
