window.CASE = (T) => ({
  C: { ink: '#1E3A2B', ink2: '#2F5640', paper: '#F2EEDF', cream: '#FBF7EA', hi: '#E9A93B', hi2: '#5DA9D6', red: '#E0533A', shadow: '#E0533A', dot: '#5DA9D6', wood: '#B07A45', stone: '#A7A99A' },
  caseNo: 'CASE No.1590-RC', year: '1590', title: ['THE LOST', 'COLONY'],
  hook: g => { P.house(g, -110, 40, 1.3); P.house(g, 120, 90, 1.05); },
  exhibits: [
    { head: ['100+', 'SETTLERS'], draw: g => { for (let i = 0; i < 12; i++) P.person(g, -270 + (i % 4) * 180, -150 + Math.floor(i / 4) * 170, i === 11 ? 0.55 : 0.8, i === 11 ? '#E9A93B' : null); }, stamp: 'ALL GONE', stampAt: 2.6, sy: 1380 },
    { head: ['NO BODIES.', 'NO GRAVES.'], draw: g => { P.house(g, -150, 0, 1.2); P.house(g, 150, 30, 1.0); }, stamp: 'NOTHING', stampAt: 1.6, sy: 1300 },
    { head: ['ONE WORD', 'ON A POST'], dark: true, draw: g => P.post(g, 'CROATOAN'), py: 1060, ps: 1.4 },
  ],
  options: ['JOINED CROATOAN', 'LOST AT SEA', 'MOVED INLAND'], optT: [0.8, 2.1, 2.9],
});
