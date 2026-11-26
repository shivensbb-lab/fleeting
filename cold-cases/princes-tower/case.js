window.CASE = (T) => ({
  C: { ink: '#2B1D14', ink2: '#4A3426', paper: '#EFE2C4', cream: '#FFF6E0', hi: '#E8B22E', hi2: '#2A8C88', red: '#D9442B', shadow: '#2A8C88', dot: '#2A8C88', wood: '#A8743E', stone: '#B9B0A0' },
  caseNo: 'CASE No.1483-PT', year: '1483', title: ['THE PRINCES', 'IN THE TOWER'],
  hook: g => { const s = el('g', { transform: 'translate(0 20) scale(1.0)' }, g); P.tower(s); },
  exhibits: [
    { head: ['EDWARD, 12:', 'NEARLY KING'], draw: g => P.crown(g), stamp: 'AGED 12', stampAt: 2.2, sy: 1360 },
    { head: ['THEIR UNCLE', 'TOOK IT'], draw: g => { P.person(g, 0, 160, 2.6, '#7A2E2E'); const c = el('g', { transform: 'translate(0 -150) scale(0.7)' }, g); P.crown(c); }, stamp: 'RICHARD III', stampAt: 2.0, sx: 600, sy: 1380 },
    { head: ['1674:', 'UNDER THE', 'STAIRS'], dark: true, hsize: 92, draw: g => P.stairs(g), py: 1110 },
  ],
  options: ['RICHARD III', 'HENRY TUDOR', 'THEY ESCAPED'], optT: [0.6, 1.9, 2.9],
});
