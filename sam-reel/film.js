// S.A.M — "The S.A.M Way". Mid-century Cartoon, 1080×1920 (Reels). Page contract: READY, render(t), DUR, EV, TEXTS.
import { PAL, setClock, shape, ink, plane, ellipse, rrect, rect, spline, xform, move, star, sparkle, rays, starPts,
  text, fit, measure, arrow, dashed, paperFinish, textures, clamp, lerp, seg, ss, eo, eio, back, twos, TAU, REG } from './engine/toon.js';
import { drawHand } from './engine/chars.js';

const W = 1080, H = 1920;
const cv = document.getElementById('c'); cv.width = W; cv.height = H;
const g = cv.getContext('2d');
const Q = new URLSearchParams(location.search);

// colour: the unit (block / bar) is always mustard; the accent (sleeve, stars, highlights) is coral
const COL = {
  paper: PAL.paper, ink: PAL.ink, unit: PAL.mustard, unitD: PAL.mustardD, unitL: PAL.mustardL, accent: PAL.coral,
  hook: '#B5C8DE', title: PAL.coral, s1: PAL.teal, s2: PAL.blue, s3: PAL.avocado, pay: PAL.pink, proof: PAL.tealL,
  branches: PAL.paper, cta: PAL.blue, med: [PAL.teal, PAL.blue, PAL.avocado, PAL.coral],
};
const hx = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
const mixc = (a, b, k) => { const A = hx(a), B = hx(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * k).toString(16).padStart(2, '0')).join(''); };
const tint = (c, k) => mixc(c, '#FFFFFF', k), shade = (c, k) => mixc(c, '#2B2420', k);

let T, WD, SH = {}, PT = {};
const pop = (t, t0, d = 0.28) => back(seg(t, t0, t0 + d), 1.9);
// time of word i of line id (absolute); before the first word the ASR reports -0.6, so clamp to the line start
const wt = (id, i) => SH[id].v0 + Math.max(0, (WD[id] && WD[id][i] ? WD[id][i][1] : 0));

// ---------------------------------------------------------------- shared drawing
function ground(col) {
  plane(g, rect(-200, -200, W + 400, H + 400), col, { grain: 0.18 });
  plane(g, rect(-200, 1380, W + 400, 800), shade(col, 0.1), { grain: 0.22 });   // floor band
  ink(g, [[-40, 1380], [300, 1382]], 4, { seed: 5 }); ink(g, [[380, 1381], [W + 40, 1379]], 4, { seed: 6 });
}
function ornaments(t, col, seed = 1) {
  const r = (i, k) => Math.abs(Math.sin(seed * 31.7 + i * 12.9 + k)) % 1;
  for (let i = 0; i < 6; i++) sparkle(g, 80 + r(i, 1) * 920, 260 + r(i, 2) * 1050, 14 + r(i, 3) * 16, { fill: tint(col, 0.55), rot: twos(t) * 0.4 + i, alpha: 0.9 });
}
function header(t, t0, n, title, kind) {
  const k = eo(seg(twos(t), t0 + 0.05, t0 + 0.4)); if (k <= 0) return;
  g.save(); g.translate(-(1 - k) * 700, 0);
  shape(g, ellipse(118, 300, 56, 56, 40), { fill: COL.ink, line: 0, seed: 700, grain: 0.1, off: [0, 0] });
  text(g, String(n), 118, 323, { font: '64px Slab', fill: COL.paper, align: 'center' });
  text(g, `STEP ${n} OF 3  ·  ${kind}`, 196, 270, { font: '600 26px Jost', fill: COL.ink, track: 5 });
  text(g, title, 194, 344, { font: '70px Slab', fill: COL.ink, plate: PAL.white, off: [4, 4] });
  g.restore();
}
function tag(t, t0, str, x, y, o = {}) {
  const k = pop(t, t0); if (k <= 0) return;
  const px = o.px || 40, font = `${o.w || 600} ${px}px Jost`;
  const w = measure(g, str, font) + 100, h = px * 1.2 + 34, X = o.align === 'center' ? x - w / 2 : o.align === 'right' ? x - w : x;
  g.save(); g.translate(X + w / 2, y + h / 2); g.scale(k, k); g.rotate(o.rot || 0); g.translate(-(X + w / 2), -(y + h / 2));
  shape(g, rrect(X, y, w, h, 16), { fill: o.fill || COL.paper, line: 3.8, seed: 710 + (o.seed || 0), grain: 0.15, off: [6, 5] });
  star(g, X + 40, y + h / 2, 17, { n: 8, inner: 0.42, fill: o.star || COL.accent, off: [0, 0], rot: t * 0.6 });
  text(g, str, X + 70, y + h / 2 + px * 0.36, { font, fill: COL.ink });
  g.restore();
}
function medallion(t, t0, x, y, i, label, r = 96) {
  const k = pop(t, t0, 0.26); if (k <= 0) return;
  g.save(); g.translate(x, y); g.scale(k, k); g.rotate((1 - k) * 0.4);
  star(g, 0, 0, r * 1.2, { n: 16, inner: 0.84, fill: PAL.white, off: [0, 0], rot: i * 0.2 });
  shape(g, ellipse(0, 0, r, r, 64), { fill: COL.med[i % 4], line: 5, seed: 730 + i, grain: 0.3 });
  text(g, label, 0, r * 0.36, { font: `${Math.round(r * (label.length > 1 ? 0.7 : 1.05))}px Slab`, fill: COL.ink, plate: PAL.white, off: [5, 5], align: 'center' });
  g.restore();
}
// a wooden-toy unit block: front square + top and side faces, all flat planes
function block(x, y, s, o = {}) {
  const d = s * 0.22, k = o.flat ?? 0;           // k: 0 = cube, 1 = flattened into a drawn bar
  const front = rect(x, y, s, s * lerp(1, 0.7, k));
  if (k < 1) {
    g.save(); g.globalAlpha *= 1 - k;
    shape(g, [[x, y], [x + d, y - d], [x + s + d, y - d], [x + s, y]], { fill: COL.unitL, line: 3.6, seed: 801 + (o.seed || 0), grain: 0.25 });
    shape(g, [[x + s, y], [x + s + d, y - d], [x + s + d, y + s - d], [x + s, y + s]], { fill: COL.unitD, line: 3.6, seed: 802 + (o.seed || 0), grain: 0.25 });
    g.restore();
  }
  shape(g, front, { fill: COL.unit, line: 4.2, seed: 803 + (o.seed || 0), grain: 0.3,
    shade: k < 1 ? [{ pts: rect(x, y + s * 0.72, s, s * 0.3), color: COL.unitD, alpha: 0.35 * (1 - k) }] : null });
}
// the drawn bar: units side by side, outline draws on (u)
function bars(x, y, uw, h, n, u = 1, o = {}) {
  for (let i = 0; i < n; i++) {
    const ui = clamp(u * n - i); if (ui <= 0) continue;
    const r = rect(x + i * uw, y, uw, h);
    if (ui >= 1) shape(g, r, { fill: o.fill || COL.unit, line: 4.4, seed: 820 + i + (o.seed || 0), grain: 0.3 });
    else { plane(g, rect(x + i * uw, y, uw * ui, h), o.fill || COL.unit, { off: [6, 4] }); ink(g, [...r, r[0]], 4.4, { upto: ui, seed: 830 + i }); }
    if (o.label && ui >= 1) text(g, o.label(i), x + i * uw + uw / 2, y + h / 2 + 18, { font: '50px Slab', fill: COL.ink, align: 'center', plate: PAL.white, off: [3, 3] });
  }
}
// arm + glove: sleeve ribbon from off-screen to the wrist
function hand(x, y, a, kind = 'open', side = 1, k = 1.9) {
  const L = 900, sx = x - Math.cos(a) * L, sy = y - Math.sin(a) * L;
  ink(g, [[sx, sy], [x - Math.cos(a) * 8, y - Math.sin(a) * 8]], 64, { taper: false, wob: 0.06, seed: 850 });
  ink(g, move([[sx, sy], [x - Math.cos(a) * 16, y - Math.sin(a) * 16]], 5, 4), 50, { taper: false, wob: 0.05, seed: 851, color: COL.accent });
  shape(g, ellipse(x - Math.cos(a) * 14, y - Math.sin(a) * 14, 30, 30, 20), { fill: PAL.white, line: 4, seed: 852, grain: 0.1 });   // cuff
  drawHand(g, x, y, a, kind, side, k);
}
function cam(cx, cy, z = 1, r = 0) { g.translate(W / 2, H / 2); g.scale(z, z); g.rotate(r); g.translate(-cx, -cy); }

// ---------------------------------------------------------------- HOOK: the word problem
function sHook(t) {
  const p = PT.hook; ground(COL.hook); ornaments(t, COL.hook, 1);
  g.save(); cam(W / 2, 900, lerp(1, 1.05, ss(seg(t, p.t0, SH.h4.t0))));
  const shake = t > SH.h4.v0 && t < SH.h4.v0 + 0.4 ? Math.sin(twos(t) * 60) * 6 : 0;
  g.translate(shake, 0);
  shape(g, rrect(90, 420, 900, 880, 26), { fill: COL.paper, line: 5, seed: 100, grain: 0.15, off: [10, 8] });
  for (let i = 0; i < 9; i++) ink(g, [[140, 640 + i * 70], [940, 640 + i * 70]], 2, { color: PAL.blueL, seed: 110 + i, taper: false, wob: 0.1 });
  const k1 = pop(t, wt('h1', 1));
  if (k1 > 0) { g.save(); g.translate(540, 520); g.scale(k1, k1);
    text(g, "Here's a", 0, -10, { font: '700 54px Oleo', fill: COL.accent, align: 'center' });
    text(g, 'MATHS PROBLEM', 0, 64, { font: '64px Slab', fill: COL.ink, plate: PAL.white, off: [4, 4], align: 'center' }); g.restore(); }
  // line 1 + marbles
  if (t > SH.h2.v0) {
    const f = fit(g, 'Mia has 3 times as many marbles as Ben.', '500 {px}px Jost', 50, 780, 2, 40);
    f.lines.forEach((l, i) => text(g, l, 540, 690 + i * 66, { font: f.font, fill: COL.ink, align: 'center', alpha: ss(seg(t, SH.h2.v0, SH.h2.v0 + 0.25)) }));
    // two jars
    const jar = (x, n, t0, lab, seed) => {
      shape(g, rrect(x - 110, 860, 220, 200, 40), { fill: tint(PAL.blueL, 0.5), line: 4.4, seed, grain: 0.1, alpha: 0.95 });
      shape(g, rrect(x - 80, 836, 160, 34, 10), { fill: PAL.kraft, line: 3.6, seed: seed + 1 });
      for (let i = 0; i < n; i++) { const k = pop(t, t0 + i * 0.06, 0.2); if (k <= 0) continue;
        const mx = x - 70 + (i % 5) * 35, my = 1030 - Math.floor(i / 5) * 34;
        shape(g, ellipse(mx, my, 15 * k, 15 * k, 16), { fill: [PAL.coral, PAL.teal, PAL.mustard, PAL.plum][i % 4], line: 2.6, seed: seed + 10 + i, grain: 0 }); }
      text(g, lab, x, 1110, { font: '600 40px Jost', fill: COL.ink, align: 'center' });
    };
    jar(310, 3, wt('h2', 8), 'Ben', 120); jar(770, 9, wt('h2', 2), 'Mia', 140);
  }
  if (t > SH.h3.v0) {
    text(g, 'Together: 24', 540, 1190, { font: '62px Slab', fill: COL.ink, plate: COL.unitL, off: [4, 4], align: 'center', alpha: ss(seg(t, wt('h3', 3) - 0.1, wt('h3', 3) + 0.15)) });
    const kq = pop(t, wt('h3', 4));
    if (kq > 0) { g.save(); g.translate(310, 960); g.scale(kq, kq); star(g, 0, 0, 120, { n: 14, inner: 0.7, fill: COL.accent, line: 4, off: [0, 0], rot: t * 0.3 });
      text(g, '?', 0, 40, { font: '120px Slab', fill: PAL.white, align: 'center' }); g.restore();
      text(g, 'How many does Ben have?', 540, 1262, { font: '600 40px Jost', fill: COL.accent, align: 'center', alpha: clamp(kq) }); }
  }
  g.restore();
  tag(t, SH.h4.v0 + 0.02, 'Tricky?', 540, 300, { align: 'center', px: 56, rot: -0.05 });
  return { focus: [540, 860] };
}
// TITLE (inside h4, after "Tricky?"): the S.A.M way
function sTitle(t) {
  const t0 = wt('h4', 1);
  plane(g, rect(-100, -100, W + 200, H + 200), COL.title);
  rays(g, 540, 860, 30, 1500, tint(COL.title, 0.2), { rot: t * 0.05, alpha: 0.55 });
  const k = pop(t, wt('h4', 3), 0.34);
  g.save(); g.translate(540, 860); g.scale(k, k);
  star(g, 0, 0, 380, { n: 18, inner: 0.84, fill: PAL.white, line: 4.4, off: [0, 0], rot: 0.1 });
  text(g, 'the', 0, -150, { font: '700 96px Oleo', fill: COL.accent, align: 'center' });
  text(g, 'S.A.M', 0, 50, { font: '190px Slab', fill: COL.ink, plate: COL.unit, off: [7, 6], align: 'center' });
  text(g, 'way', 0, 170, { font: '700 110px Oleo', fill: COL.accent, align: 'center' });
  g.restore();
  if (t > t0 + 1.2) text(g, 'SINGAPORE MATHS', 540, 1330, { font: '600 44px Jost', fill: PAL.white, align: 'center', track: 10, alpha: ss(seg(t, t0 + 1.2, t0 + 1.5)) });
  ornaments(t, COL.title, 2);
  return { focus: [540, 860] };
}
// rows shared by steps 1–2
const ROW = { ben: 800, mia: 1110, x0: 230, s: 170 };
function rowLabels(a = 1) {
  text(g, 'Ben', 120, ROW.ben + ROW.s / 2 + 16, { font: '600 46px Jost', fill: COL.ink, align: 'center', alpha: a });
  text(g, 'Mia', 120, ROW.mia + ROW.s / 2 + 16, { font: '600 46px Jost', fill: COL.ink, align: 'center', alpha: a });
}
// ---------------------------------------------------------------- STEP 1: make it real (blocks)
function sStep1(t) {
  const p = PT.step1; ground(COL.s1); ornaments(t, COL.s1, 3);
  header(t, p.t0, 1, 'Make it real', 'CONCRETE');
  rowLabels(ss(seg(t, p.t0 + 0.3, p.t0 + 0.6)));
  const tb = wt('s1b', 3) - 0.1, tm = wt('s1b', 4);    // Ben's block lands on "Ben", Mia's three on "3"
  // a block carried in by a grip hand: anticipation lift, fast move, settle
  const carry = (tLand, x, y, n) => {
    const u = seg(t, tLand - 0.45, tLand), out = seg(t, tLand + 0.08, tLand + 0.4);
    const ex = lerp(1250, x, eo(u)), ey = y - 90 * Math.sin(Math.PI * clamp(u)) - (u < 1 ? 0 : 0);
    if (t < tLand - 0.45) return;
    for (let i = 0; i < n; i++) block(t < tLand ? ex + i * (ROW.s + 20) : x + i * (ROW.s + 20), t < tLand ? ey : y, ROW.s, { seed: n * 10 + i });
    if (out < 1) { const hx2 = (t < tLand ? ex : x) + n * (ROW.s + 20) - 20 + out * 500, hy = (t < tLand ? ey : y) + 60 - out * 120;
      hand(hx2 + 30, hy, Math.PI + 0.15, u < 1 ? 'grip' : 'open', 1, 3.4); }
  };
  carry(tb, ROW.x0, ROW.ben, 1); carry(tm, ROW.x0, ROW.mia, 3);
  // same size: call-out with the two blocks measured
  const tc = wt('s1c', 4);
  if (t > tc - 0.2) {
    const k = back(seg(t, tc - 0.2, tc + 0.12), 1.5), cx = 790, cy = 560, R = 150 * k;
    dashed(g, [[cx - R * 0.8, cy + R * 0.6], [ROW.x0 + ROW.s * 0.7, ROW.ben + 30]], 4, 14, 10, -t * 40, COL.ink, clamp(k));
    shape(g, ellipse(cx, cy, R + 14, R + 14, 64), { fill: COL.paper, line: 4.5, seed: 720, grain: 0.15 });
    g.save(); g.beginPath(); g.arc(cx, cy, R, 0, TAU); g.clip(); g.translate(cx, cy); g.scale(k, k);
    block(-95, -30, 80, { seed: 70 }); block(20, -30, 80, { seed: 71 });
    arrow(g, [-90, 80], [-15, 80], { u: seg(t, tc, tc + 0.3), w: 4, head: 16, bend: 0, fill: COL.accent });
    arrow(g, [25, 80], [100, 80], { u: seg(t, tc, tc + 0.3), w: 4, head: 16, bend: 0, fill: COL.accent });
    g.restore(); ink(g, ellipse(cx, cy, R, R, 64), 4, { closed: true, seed: 721 });
  }
  tag(t, tc + 0.15, 'same size', 790, 760, { align: 'center' });
  return { focus: [ROW.x0 + ROW.s / 2, ROW.ben + ROW.s / 2] };
}
// ---------------------------------------------------------------- STEP 2: draw a picture (bar model)
const UW = 190, BH = 130;
function sStep2(t) {
  const p = PT.step2; ground(COL.s2); ornaments(t, COL.s2, 4);
  header(t, p.t0, 2, 'Draw a picture', 'PICTORIAL');
  rowLabels();
  // the blocks from step 1 flatten into bars on "bar"; the pencil draws the outline
  const tf = wt('s2b', 4), kf = ss(seg(t, tf - 0.5, tf + 0.1));
  const by = ROW.ben + 20, my = ROW.mia + 20;
  if (kf < 1) { block(ROW.x0, ROW.ben, ROW.s, { flat: kf, seed: 10 }); for (let i = 0; i < 3; i++) block(ROW.x0 + i * (ROW.s + 20), ROW.mia, ROW.s, { flat: kf, seed: 30 + i }); }
  const du = seg(t, tf - 0.1, tf + 0.9);
  if (kf >= 1 || du > 0) {
    bars(ROW.x0, by, UW, BH, 1, clamp(du * 4)); bars(ROW.x0, my, UW, BH, 3, clamp(du * 1.33 - 0.33));
    if (du > 0 && du < 1) { // pencil hand at the drawing tip
      const ben = du < 0.25, uu = ben ? du * 4 : (du - 0.25) / 0.75, n = ben ? 1 : 3, yy = ben ? by : my;
      const per = 2 * (UW * n + BH), d = uu * per; let px, py;
      if (d < UW * n) { px = ROW.x0 + d; py = yy; } else if (d < UW * n + BH) { px = ROW.x0 + UW * n; py = yy + d - UW * n; }
      else if (d < 2 * UW * n + BH) { px = ROW.x0 + UW * n - (d - UW * n - BH); py = yy + BH; } else { px = ROW.x0; py = yy + BH - (d - 2 * UW * n - BH); }
      ink(g, [[px, py], [px + 46, py - 96]], 16, { color: PAL.coralD, taper: false, seed: 860 });
      shape(g, ellipse(px + 3, py - 6, 6, 6, 10), { fill: COL.ink, line: 0, off: [0, 0], grain: 0 });
      hand(px + 70, py - 120, 2.25, 'grip', 1, 3.0);
    }
  }
  // "we call it a unit"
  const tu = wt('s2b', 9);
  if (t > tu) for (let i = 0; i < 4; i++) { const k = pop(t, tu + i * 0.08, 0.22); const x = ROW.x0 + (i ? (i - 1) * UW : 0) + UW / 2, y = (i ? my : by) + BH / 2 + 18;
    g.save(); g.translate(x, y - 18); g.scale(k, k); text(g, '1u', 0, 18, { font: '52px Slab', fill: COL.ink, align: 'center', plate: PAL.white, off: [3, 3] }); g.restore(); }
  tag(t, tu - 0.05, '1 unit', ROW.x0 + UW + 50, by + 20);
  // bracket + 24
  const t24 = wt('s2c', 5), kb = seg(t, t24 - 0.6, t24 - 0.1);
  if (kb > 0) {
    const x = ROW.x0 + 3 * UW + 40, y0 = by, y1 = my + BH;
    ink(g, spline([[x, y0], [x + 30, y0 + 10], [x + 30, (y0 + y1) / 2 - 30], [x + 60, (y0 + y1) / 2], [x + 30, (y0 + y1) / 2 + 30], [x + 30, y1 - 10], [x, y1]], false, 8), 7, { upto: kb, seed: 870 });
    const k = pop(t, t24);
    if (k > 0) { g.save(); g.translate(x + 140, (y0 + y1) / 2); g.scale(k, k); shape(g, ellipse(0, 0, 76, 76, 40), { fill: PAL.white, line: 4.5, seed: 871 });
      text(g, '24', 0, 30, { font: '84px Slab', fill: COL.ink, align: 'center', plate: COL.accent, off: [4, 4] }); g.restore(); }
  }
  return { focus: [ROW.x0 + UW / 2, by + BH / 2] };
}
// ---------------------------------------------------------------- STEP 3: now the numbers
function writeOn(str, x, y, t0, o = {}) {
  if (g.__t < t0) return;
  const font = o.font || '92px Slab', w = measure(g, str, font), u = eo(seg(g.__t, t0, t0 + (o.d || 0.5)));
  g.save(); g.beginPath(); g.rect(x - w / 2 - 20, y - 140, (w + 40) * u, 200); g.clip();
  text(g, str, x, y, { font, fill: o.fill || COL.ink, plate: o.plate ?? PAL.white, off: [5, 4], align: 'center' }); g.restore();
}
function check(t, t0, x, y, r = 56) {
  const k = pop(t, t0, 0.22); if (k <= 0) return;
  g.save(); g.translate(x, y); g.scale(k, k); g.rotate(-0.15);
  star(g, 0, 0, r * 1.25, { n: 12, inner: 0.78, fill: COL.accent, line: 3.6, off: [0, 0] });
  ink(g, [[-r * 0.45, 0], [-r * 0.1, r * 0.35], [r * 0.5, -r * 0.4]], 11, { taper: false, color: PAL.white, seed: 880 });
  g.restore();
}
function sStep3(t) {
  const p = PT.step3; g.__t = t; ground(COL.s3); ornaments(t, COL.s3, 5);
  header(t, p.t0, 3, 'Now the numbers', 'ABSTRACT');
  // the bar model, small, at the top
  g.save(); g.translate(150, 470); g.scale(0.62, 0.62);
  text(g, 'Ben', -10, 90, { font: '600 54px Jost', fill: COL.ink, align: 'right' }); text(g, 'Mia', -10, 290, { font: '600 54px Jost', fill: COL.ink, align: 'right' });
  const t6 = wt('s3c', 4), lab = i => (t > t6 ? '6' : '1u');
  bars(20, 20, UW, BH, 1, 1, { label: lab }); bars(20, 220, UW, BH, 3, 1, { label: lab, seed: 5 });
  g.restore();
  writeOn('4 units = 24', 540, 960, wt('s3b', 1));
  writeOn('1 unit = 6', 540, 1140, wt('s3c', 2), { plate: COL.unitL });
  tag(t, wt('s3c', 4) + 0.1, '24 ÷ 4 = 6', 540, 1160, { align: 'center', px: 30 });
  check(t, wt('s3c', 4), 900, 1090);
  const kb = pop(t, wt('s3d', 2)), km = pop(t, wt('s3d', 6));
  const card = (k, x, str, i) => { if (k <= 0) return; g.save(); g.translate(x, 1316); g.scale(k, k);
    shape(g, rrect(-200, -60, 400, 120, 20), { fill: COL.paper, line: 4.4, seed: 890 + i, off: [6, 5] });
    text(g, str, 0, 24, { font: '64px Slab', fill: COL.ink, align: 'center', plate: COL.unitL, off: [3, 3] }); g.restore(); };
  card(kb, 300, 'Ben = 6', 0); card(km, 780, 'Mia = 18', 1);
  return { focus: [540, 1140] };
}
// ---------------------------------------------------------------- PAYOFF: one bar model becomes a textile
function sPayoff(t) {
  const p = PT.payoff, u = seg(t, p.t0, p.t0 + 3.2);
  plane(g, rect(-100, -100, W + 200, H + 200), COL.pay);
  const z = lerp(4.2, 0.62, eio(u)), r = lerp(-0.12, 0, eio(u));
  g.save(); cam(540, 900, z, r);
  const cols = [PAL.mustard, PAL.teal, PAL.coral, PAL.blue, PAL.avocado, PAL.plum];
  for (let j = -6; j <= 6; j++) for (let i = -2; i <= 2; i++) {
    const ox = 540 + i * 620 + (j % 2 ? 310 : 0), oy = 900 + j * 300, n = 1 + ((i * 7 + j * 3 + 21) % 4), c = cols[(i * 5 + j * 2 + 30) % cols.length];
    const isMain = i === 0 && j === 0;
    const dot = (i + j + 20) % 3;
    if (isMain) { bars(ox - 300, oy - 120, 150, 100, 1, 1, { seed: 1 }); bars(ox - 300, oy + 20, 150, 100, 3, 1, { seed: 2 }); continue; }
    bars(ox - 300, oy - 120, 150, 100, n, 1, { fill: c, seed: i * 9 + j }); bars(ox - 300, oy + 20, 150, 100, Math.max(1, 4 - n), 1, { fill: tint(c, 0.35), seed: i * 9 + j + 4 });
    if (dot === 0) star(g, ox + 230, oy - 60, 34, { n: 8, inner: 0.4, fill: PAL.white, off: [0, 0], rot: i + j });
    else if (dot === 1) sparkle(g, ox + 240, oy + 80, 40, { fill: PAL.white, rot: i });
  }
  g.restore();
  const words = [['Concrete', 0, PAL.teal], ['Pictorial', 1, PAL.blue], ['Abstract', 2, PAL.avocado]];
  words.forEach(([w, i, c]) => tag(t, wt('pay', i), w, 540, 560 + i * 150, { align: 'center', px: 60, fill: PAL.white, star: c, seed: i }));
  const ks = pop(t, wt('pay', 5), 0.34);
  if (ks > 0) { g.save(); g.translate(540, 1110); g.scale(ks, ks);
    shape(g, rrect(-400, -110, 800, 220, 40), { fill: COL.accent, line: 5, seed: 900, off: [8, 7] });
    text(g, 'Singapore', 0, -6, { font: '700 92px Oleo', fill: PAL.white, align: 'center' });
    text(g, 'MATHS', 0, 82, { font: '72px Slab', fill: COL.ink, align: 'center', plate: COL.unit, off: [4, 4], track: 8 }); g.restore(); }
}
// ---------------------------------------------------------------- PROOF: 180+ at J3 Mall
function pin(x, y, col, k = 1) {
  g.save(); g.translate(x, y); g.scale(k, k);
  shape(g, [...spline([[0, 0], [-48, -78], [-56, -122], [-30, -164], [0, -172], [30, -164], [56, -122], [48, -78]], true, 6)], { fill: col, line: 4.6, seed: 910, grain: 0.25 });
  shape(g, ellipse(0, -118, 22, 22, 20), { fill: PAL.white, line: 3.4, seed: 911, grain: 0 });
  g.restore();
}
function sProof(t) {
  const p = PT.proof; ground(COL.proof); ornaments(t, COL.proof, 6);
  const t0 = wt('proof', 2), n = Math.round(180 * eo(seg(t, t0, t0 + 1.2)));
  rays(g, 540, 760, 26, 900, tint(COL.proof, 0.4), { rot: t * 0.05, alpha: 0.6 });
  if (t > t0 - 0.1) {
    text(g, n + (n >= 180 ? '+' : ''), 540, 860, { font: '300px Slab', fill: COL.ink, plate: COL.unit, off: [9, 8], align: 'center' });
    text(g, 'STUDENTS', 540, 960, { font: '600 64px Jost', fill: COL.ink, align: 'center', track: 14, alpha: ss(seg(t, wt('proof', 3), wt('proof', 3) + 0.2)) });
  }
  const tj = wt('proof', 10) - 0.1, k = pop(t, tj, 0.3);
  if (k > 0) { pin(260, 1290, COL.accent, k); g.save(); g.globalAlpha = clamp(k);
    text(g, 'J3 Mall', 350, 1210, { font: '76px Slab', fill: COL.ink, plate: PAL.white, off: [4, 4] });
    text(g, 'Al Wasl Rd, Dubai', 354, 1272, { font: '500 40px Jost', fill: COL.ink }); g.restore(); }
}
// ---------------------------------------------------------------- BRANCHES
function sBranches(t) {
  const p = PT.branches; plane(g, rect(-100, -100, W + 200, H + 200), COL.branches); ornaments(t, PAL.paperDD, 7);
  text(g, 'S.A.M is growing', 540, 330, { font: '78px Slab', fill: COL.ink, plate: COL.unit, off: [4, 4], align: 'center', alpha: ss(seg(t, wt('b1', 1) - 0.2, wt('b1', 1) + 0.1)) });
  const ys = [560, 790, 1020, 1250], road = spline([[250, 470], [190, 680], [300, 900], [190, 1130], [250, 1340]], false, 14);
  dashed(g, road, 9, 22, 16, 0, PAL.paperDD, eo(seg(t, p.t0 + 0.2, wt('b3', 1))));
  const items = [['J3 Mall', 'Al Wasl Rd', wt('b1', 1), null], ['Meydan', 'NEW', wt('b2', 3), PAL.teal], ['Al Barsha', 'NEW', wt('b2', 6), PAL.avocado], ['AB Centre', 'OPENING SOON', wt('b3', 1), PAL.blue]];
  const xs = [250, 225, 245, 225];
  items.forEach(([name, note, t0, nc], i) => {
    const k = pop(t, t0, 0.3); if (k <= 0) return;
    medallion(t, t0, xs[i], ys[i], i, i === 3 ? '★' : String.fromCharCode(9679), 62);
    g.save(); g.globalAlpha = clamp(k); g.translate((1 - clamp(k)) * 60, 0);
    text(g, name, 360, ys[i] + 8, { font: '70px Slab', fill: COL.ink, plate: PAL.white, off: [4, 4] });
    if (!nc) text(g, note, 364, ys[i] + 62, { font: '500 38px Jost', fill: COL.ink });
    g.restore();
    if (nc) { const tn = i === 3 ? wt('b3', 3) : t0 + 0.2; tag(t, tn, note, 360, ys[i] + 30, { px: 32, w: 700, fill: i === 3 ? COL.unitL : PAL.white, star: nc, seed: i, rot: i === 3 ? -0.04 : 0 }); }
  });
}
// ---------------------------------------------------------------- CTA + iris-out
function sCta(t) {
  plane(g, rect(-100, -100, W + 200, H + 200), COL.cta);
  rays(g, 540, 800, 30, 1500, tint(COL.cta, 0.25), { rot: 0.2, alpha: 0.6 });
  const k = pop(t, PT.cta.t0 + 0.1, 0.34);
  g.save(); g.translate(540, 800); g.scale(k, k);
  star(g, 0, 0, 360, { n: 18, inner: 0.84, fill: PAL.white, line: 4.4, off: [0, 0], rot: 0.1 });
  text(g, 'S.A.M', 0, 10, { font: '180px Slab', fill: COL.ink, plate: COL.unit, off: [7, 6], align: 'center' });
  text(g, 'Singapore Maths', 0, 130, { font: '700 76px Oleo', fill: COL.accent, align: 'center' });
  g.restore();
  tag(t, wt('cta', 3), '@sam.j3malldubai', 540, 1190, { align: 'center', px: 50, w: 600 });
  if (t > wt('cta', 3) + 0.2) text(g, 'J3 Mall · Meydan · Al Barsha · AB Centre (soon)', 540, 1340, { font: '500 34px Jost', fill: COL.ink, align: 'center', alpha: ss(seg(t, wt('cta', 3) + 0.2, wt('cta', 3) + 0.5)) });
}
function sEnd(t) {
  sCta(t);
  const k = eio(seg(t, PT.end.t0 + 0.2, PT.end.t1 - 0.4)), r = lerp(1300, 0, k);
  g.save(); g.fillStyle = COL.ink; g.beginPath(); g.rect(-50, -50, W + 100, H + 100); g.arc(540, 800, Math.max(0.1, r), 0, TAU, true); g.fill(); g.restore();
  if (r > 4) ink(g, ellipse(540, 800, r, r, 90), 7, { closed: true, seed: 990, color: PAL.paperDD });
}

// ---------------------------------------------------------------- caption card
function caption(t) {
  const s = T.shots.find(s => t >= s.v0 - 0.05 && t < Math.min(s.t0 + s.len, s.v0 + Math.max(1.8, s.vdur + 0.6)));
  if (!s) return;
  const t1 = Math.min(s.t0 + s.len, s.v0 + Math.max(1.8, s.vdur + 0.6));
  const a = Math.min(ss(seg(t, s.v0 - 0.05, s.v0 + 0.12)), 1 - ss(seg(t, t1 - 0.14, t1)));
  const raw = s.sub.replace(/\*/g, '');
  const f = fit(g, raw, '500 {px}px Jost', 46, 860, 2, 36);
  const lh = f.px * 1.25, w = Math.max(...f.lines.map(l => measure(g, l, f.font))) + 130, h = 36 + f.lines.length * lh;
  const x = W / 2 - w / 2, y = 1600 - h;
  // accent words: the *starred* words of the sub, in coral
  const acc = new Set([...s.sub.matchAll(/\*([^*]+)\*/g)].flatMap(m => m[1].split(/\s+/)).map(w => w.replace(/[^\w.+]/g, '')));
  g.save(); g.globalAlpha = a; g.translate(0, (1 - a) * 12);
  shape(g, rrect(x, y, w, h, 16), { fill: COL.paper, line: 3.4, seed: 901, grain: 0.15, breaks: 0.08, off: [5, 5] });
  star(g, x + 34, y + h / 2, 15, { n: 8, inner: 0.4, fill: COL.accent, off: [0, 0], rot: t * 0.8 });
  star(g, x + w - 34, y + h / 2, 15, { n: 8, inner: 0.4, fill: COL.accent, off: [0, 0], rot: -t * 0.8 });
  f.lines.forEach((l, i) => {
    const words = l.split(' '), total = measure(g, l, f.font); let cx = W / 2 - total / 2;
    const yy = y + 18 + lh * i + f.px * 0.98;
    words.forEach((wd, j) => { const s2 = (j ? ' ' : '') + wd, ww = measure(g, s2, f.font);
      text(g, s2, cx, yy, { font: f.font, fill: acc.has(wd.replace(/[^\w.+]/g, '')) ? PAL.coralD : COL.ink }); cx += ww; });
  });
  g.restore();
}

// ---------------------------------------------------------------- sections + transitions
const DRAW = { hook: sHook, step1: sStep1, step2: sStep2, step3: sStep3, payoff: sPayoff, proof: sProof, branches: sBranches, cta: sCta, end: sEnd };
function drawPart(name, t) {
  g.save(); let r = {};
  if (name === 'hook' && t >= wt('h4', 1)) {
    // colour-block wipe up from the problem card into the title
    const k = eio(seg(t, wt('h4', 1), wt('h4', 1) + 0.3));
    if (k < 1) { sHook(t); g.save(); g.beginPath(); g.rect(0, H * (1 - k), W, H); g.clip(); sTitle(t); g.restore(); ink(g, [[-10, H * (1 - k)], [W + 10, H * (1 - k)]], 6, { seed: 963 }); }
    else r = sTitle(t);
  } else r = DRAW[name](t) || {};
  g.restore(); return r;
}
const BEAT = () => T.beat;
function renderFilm(t) {
  setClock(t);
  const P = T.parts, i = Math.max(0, P.findIndex(p => t >= p.t0 && t < p.t1)), s = i < 0 ? P[P.length - 1] : P[i], nx = P[i + 1], pv = P[i - 1];
  const steps = ['step1', 'step2', 'step3'];
  const irisOut = nx && steps.includes(nx.part) && t >= nx.t0 - BEAT() * 0.6 ? nx : null;
  const irisIn = steps.includes(s.part) && pv && t < s.t0 + BEAT() * 0.4 ? s : null;
  const wipeSide = ['proof', 'cta'].includes(s.part) && t < s.t0 + 0.3, wipeUp = s.part === 'branches' && t < s.t0 + 0.3;
  if (irisOut || irisIn) {
    const inc = irisOut || irisIn, prev = P[P.indexOf(inc) - 1], n = steps.indexOf(inc.part);
    const tStamp = inc.t0 - BEAT() * 0.6, k = eio(seg(t, inc.t0 - BEAT() * 0.25, inc.t0 + BEAT() * 0.4));
    const f = drawPart(prev.part, Math.min(t, inc.t0 - 1e-3)).focus || [W / 2, H / 2];
    medallion(t, tStamp, f[0], f[1], n, String(n + 1), 96);
    if (k > 0) {
      const cx = lerp(f[0], W / 2, k), cy = lerp(f[1], H / 2, k), r = lerp(96, 2300, k * k);
      g.save(); g.beginPath(); g.arc(cx, cy, r, 0, TAU); g.clip(); drawPart(inc.part, Math.max(t, inc.t0 + 1e-3)); g.restore();
      ink(g, ellipse(cx, cy, r, r, 90), 7, { closed: true, seed: 960 });
    }
  } else if (wipeSide || wipeUp) {
    const k = eio(seg(t, s.t0, s.t0 + 0.3));
    drawPart(pv.part, pv.t1 - 1e-3);
    g.save(); g.beginPath(); if (wipeSide) g.rect(W * (1 - k), 0, W, H); else g.rect(0, H * (1 - k), W, H); g.clip(); drawPart(s.part, t); g.restore();
    if (wipeSide) ink(g, [[W * (1 - k), -10], [W * (1 - k), H + 10]], 6, { seed: 962 }); else ink(g, [[-10, H * (1 - k)], [W + 10, H * (1 - k)]], 6, { seed: 963 });
  } else drawPart(s.part, t);
  paperFinish(g, W, H, 1);
  if (!Q.has('nosubs')) caption(t);
}

// ---------------------------------------------------------------- load
await Promise.all(['700 80px Oleo', '400 80px Oleo', '80px Slab', '400 40px Jost', '500 40px Jost', '600 40px Jost', '700 40px Jost'].map(f => document.fonts.load(f)));
textures();
T = await (await fetch('timeline.json')).json();
WD = await (await fetch('voice/words.json')).json();
T.shots.forEach(s => (SH[s.id] = s)); T.parts.forEach(p => (PT[p.part] = p));
// sound events = the same times the pictures use
const EV = [];
T.parts.forEach(p => EV.push({ t: p.t0, type: 'part', part: p.part }));
const E = (t, type, o = {}) => EV.push({ t: +t.toFixed(3), type, ...o });
E(wt('h1', 1), 'stamp'); E(wt('h2', 2), 'marbles'); E(wt('h2', 8), 'marbles'); E(wt('h3', 4), 'pop'); E(SH.h4.v0, 'boing');
E(wt('h4', 1), 'wipe'); E(wt('h4', 3), 'title');
E(wt('s1b', 3) - 0.1, 'block', { n: 1 }); E(wt('s1b', 4), 'block', { n: 3 }); E(wt('s1c', 4) - 0.2, 'callout'); E(wt('s1c', 4) + 0.15, 'pop');
['step1', 'step2', 'step3'].forEach((n, i) => { E(PT[n].t0 - T.beat * 0.6, 'stamp', { step: i }); E(PT[n].t0 - T.beat * 0.25, 'iris'); });
E(wt('s2b', 4) - 0.1, 'pencil', { d: 1.0 }); E(wt('s2b', 9), 'pop'); E(wt('s2c', 5) - 0.6, 'pencil', { d: 0.5 }); E(wt('s2c', 5), 'pop');
E(wt('s3b', 1), 'chalk'); E(wt('s3c', 2), 'chalk'); E(wt('s3c', 4), 'check'); E(wt('s3d', 2), 'pop'); E(wt('s3d', 6), 'check');
[0, 1, 2].forEach(i => E(wt('pay', i), 'pop')); E(wt('pay', 5), 'title');
E(PT.proof.t0, 'wipe'); E(wt('proof', 2), 'count', { d: 1.2 }); E(wt('proof', 10) - 0.1, 'stamp');
E(PT.branches.t0, 'wipe'); E(wt('b1', 1), 'stamp', { step: 0 }); E(wt('b2', 3), 'stamp', { step: 1 }); E(wt('b2', 6), 'stamp', { step: 2 }); E(wt('b3', 1), 'stamp', { step: 3 }); E(wt('b3', 3), 'pop');
E(PT.cta.t0, 'wipe'); E(PT.cta.t0 + 0.1, 'title'); E(wt('cta', 3), 'pop'); E(PT.end.t0 + 0.2, 'iris');
EV.sort((a, b) => a.t - b.t);
window.DUR = T.dur; window.EV = EV;
window.TEXTS = () => [];
window.render = t => { g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, W, H); renderFilm(t); };
window.READY = true;
