window.CASE = (T) => ({
  C: { ink: '#16233A', ink2: '#26395A', paper: '#EEF0EC', cream: '#F8FAF6', hi: '#F2C531', hi2: '#7FC4E8', red: '#E2364A', shadow: '#7FC4E8', dot: '#7FC4E8', wood: '#8C6A4A', stone: '#A6B0BC' },
  caseNo: 'CASE No.1959-DP', year: '1959', title: ['DYATLOV', 'PASS'],
  hook: g => { const s = el('g', { transform: 'translate(0 40) scale(1.0)' }, g); P.tent(s); },
  exhibits: [
    { head: ['CUT FROM', 'THE INSIDE'], draw: g => P.tent(g), stamp: 'FROM INSIDE', stampAt: 2.0, sy: 1360 },
    { head: ['-30°C.', 'NO SHOES.'], draw: g => { const a = el('g', { transform: 'translate(-150 0)' }, g); P.thermo(a); const b = el('g', { transform: 'translate(170 0)' }, g); P.prints(b); } },
    { head: ['BROKEN', 'BONES'], dark: true, draw: g => P.bones(g), stamp: 'NO FIGHT', stampAt: 2.4, sx: 680, sy: 1380 },
  ],
  options: ['AN AVALANCHE', 'WEAPONS TEST', 'SOMETHING ELSE'], optT: [0.4, 1.5, 2.5],
});
