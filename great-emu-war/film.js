// The Great Emu War — picture. Canvas 2D, 1920x1080, deterministic: every frame is a pure function of t.
// Timing: one shot per line of lines.json; a shot lasts its voice line + a tail (voice/dur.json), so picture and voice lock.
import { mulberry, clamp, lerp, seg } from '/core/lib.js';

const W = 1920, H = 1080, GROUND = 820, CAP_TOP = 905;
const C = {
  line: '#151413', sky: '#CFE1E3', skyLo: '#E7EEE6', cloud: '#F7F4EC', hill: '#A9B892', field: '#C9B266', fieldLo: '#AE9650',
  dry: '#D8BF8C', dryLo: '#C2A574', parch: '#EADFC8', parchLo: '#D8CCB0', timber: '#C6A57A', beam: '#6E4C2E', slate: '#5D6470',
  khaki: '#8E8456', khakiLo: '#6F6741', navy: '#2E3F73', red: '#B83A32', yellow: '#F2CF5B', skin: '#F6E4CC', white: '#FAF7EF',
  emu: '#5E534B', emuLo: '#463E38', neck: '#7D8EA6', sea: '#7FA6B0', wheat: '#E2C25E', grey: '#9A9C9F', brown: '#7A5A3C',
};
const LW = 11;
let ctx, LINES = [], SHOTS = [], DUR = 0;

/* ---------- drawing primitives ---------- */
const P = (d, fill, w = LW, stroke = C.line) => {
  const p = typeof d === 'string' ? new Path2D(d) : d;
  if (fill) { ctx.fillStyle = fill; ctx.fill(p); }
  if (w > 0) { ctx.lineWidth = w; ctx.strokeStyle = stroke; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.stroke(p); }
};
const L = (pts, w = LW, col = C.line) => { ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.lineWidth = w; ctx.strokeStyle = col; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke(); };
const O = (x, y, rx, ry, fill, w = LW) => { const p = new Path2D(); p.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); P(p, fill, w); };
const R = (x, y, w, h, r, fill, lw = LW) => { const p = new Path2D(); p.roundRect(x, y, w, h, r); P(p, fill, lw); };
const save = (fn) => { ctx.save(); fn(); ctx.restore(); };
const at = (x, y, s, fn, rot = 0, flip = false) => save(() => { ctx.translate(x, y); if (rot) ctx.rotate(rot); ctx.scale(flip ? -s : s, s); fn(); });
const wob = (t, sp = 0.2, amp = 1, ph = 0) => Math.sin(t / sp + ph) * amp;
const pop = (t, a, d = 0.25) => clamp(seg(t, a, a + d), 0, 1);
const backOut = (x) => { const s = 1.7; x -= 1; return x * x * ((s + 1) * x + s) + 1; };
const ease = (x) => x * x * (3 - 2 * x);

/** Outlined lettering: white fill over a heavy black stroke (the style's captions and cards). */
function big(text, x, y, size, fill = C.white, align = 'center', weight = 900) {
  ctx.font = `${weight} ${size}px "Inter Tight"`; ctx.textAlign = align; ctx.textBaseline = 'alphabetic';
  ctx.lineJoin = 'round'; ctx.lineWidth = size * 0.16; ctx.strokeStyle = C.line; ctx.strokeText(text, x, y);
  ctx.fillStyle = fill; ctx.fillText(text, x, y);
}

/* ---------- characters ---------- */
/** A bean person. Feet at (0,0) in local space; s scales. */
function bean(x, y, o = {}) {
  const { s = 1, coat = C.khaki, legCol = C.khakiLo, hat = 'none', face = 'deadpan', hair = null, tache = false, armL = 18, armR = 18,
    legs = 22, flip = false, blank = false, holdR = null, look = 0, step = 0 } = o;
  at(x, y, s, () => {
    const limb = (x1, y1, x2, y2, col) => { L([[x1, y1], [x2, y2]], 30); L([[x1, y1], [x2, y2]], 13, col); };
    const sw = Math.sin(step * Math.PI * 2) * 16;
    limb(-16, -78, -legs - sw, -6, legCol); limb(16, -78, legs + sw, -6, legCol);
    O(-legs - 8 - sw, 0, 24, 11, C.line, 0); O(legs + 8 + sw, 0, 24, 11, C.line, 0);
    const arm = (side, a) => { const sx = side * 52, sy = -188, r = a * Math.PI / 180; const ex = sx + Math.sin(r) * side * 92, ey = sy + Math.cos(r) * 92; limb(sx, sy, ex, ey, coat); return [ex, ey]; };
    arm(-1, armL);
    P('M-64 -150 C -70 -230 -40 -262 0 -262 C 40 -262 70 -230 64 -150 C 60 -92 36 -70 0 -70 C -36 -70 -60 -92 -64 -150 Z', coat);
    if (coat === C.khaki) { L([[-40, -150], [40, -150]], 7, C.khakiLo); L([[0, -255], [0, -80]], 5, C.khakiLo); }
    if (coat === C.navy) { P('M-26 -258 L0 -215 L26 -258', null, 12, C.white); L([[0, -230], [0, -205]], 10, C.red); }
    const [hx, hy] = arm(1, armR);
    if (holdR) save(() => { ctx.translate(hx, hy); holdR(); });
    const hdy = -300;
    O(0, hdy, 58, 58, blank ? C.white : C.skin);
    if (hair) P(`M-52 ${hdy - 18} C -50 ${hdy - 64} 40 ${hdy - 74} 54 ${hdy - 20} C 30 ${hdy - 40} -20 ${hdy - 44} -52 ${hdy - 18} Z`, hair, 8);
    if (!blank) expr(face, hdy, look, tache);
    hatShape(hat, hdy - 52);
  }, 0, flip);
}
function expr(face, y, look, tache) {
  const ex = look * 6;
  const dot = (x, yy, r = 6) => O(x + ex, yy, r, r, C.line, 0);
  const st = (pts, w = 7) => L(pts, w);
  if (face === 'smug') { st([[-28, y + 2], [-18, y - 8], [-8, y + 2]]); st([[8, y + 2], [18, y - 8], [28, y + 2]]); st([[-12, y + 26], [6, y + 30], [20, y + 20]]); }
  else if (face === 'panic') { dot(-18, y - 6, 5); dot(18, y - 6, 5); O(0, y + 26, 16, 18, C.line, 0); st([[-34, y - 26], [-12, y - 20]]); st([[12, y - 20], [34, y - 26]]); }
  else if (face === 'angry') { dot(-18, y); dot(18, y); st([[-34, y - 22], [-8, y - 10]]); st([[8, y - 10], [34, y - 22]]); st([[-14, y + 28], [0, y + 20], [14, y + 28]]); }
  else if (face === 'happy') { dot(-18, y - 2); dot(18, y - 2); st([[-20, y + 16], [0, y + 32], [20, y + 16]]); }
  else if (face === 'sad') { dot(-18, y); dot(18, y); st([[-30, y - 10], [-8, y - 18]]); st([[8, y - 18], [30, y - 10]]); st([[-14, y + 30], [0, y + 22], [14, y + 30]]); }
  else { dot(-18, y); dot(18, y); st([[-30, y - 12], [-8, y - 12]]); st([[8, y - 12], [30, y - 12]]); if (!tache) st([[-12, y + 26], [12, y + 26]]); }
  if (tache) P(`M-34 ${y + 22} C -20 ${y + 6} -4 ${y + 12} 0 ${y + 18} C 4 ${y + 12} 20 ${y + 6} 34 ${y + 22} C 20 ${y + 30} 6 ${y + 24} 0 ${y + 22} C -6 ${y + 24} -20 ${y + 30} -34 ${y + 22} Z`, '#4A3523', 5);
}
function hatShape(h, y) {
  if (h === 'slouch') { P(`M-90 ${y + 22} Q0 ${y + 4} 90 ${y + 22} L80 ${y + 30} Q0 ${y + 18} -80 ${y + 30} Z`, C.khakiLo, 8); P(`M-50 ${y + 18} C -52 ${y - 40} 52 ${y - 40} 50 ${y + 18} Z`, C.khaki, 9); P(`M50 ${y + 20} Q80 ${y - 20} 92 ${y - 34} L84 ${y + 14} Z`, C.khakiLo, 8); L([[-48, y + 6], [48, y + 6]], 8, '#3E3A2A'); }
  else if (h === 'cap') { P(`M-56 ${y + 20} C -60 ${y - 34} 60 ${y - 34} 56 ${y + 20} Z`, C.khaki, 9); P(`M-10 ${y + 20} L70 ${y + 22} Q60 ${y + 36} -10 ${y + 30} Z`, C.line, 0); L([[-56, y + 6], [56, y + 6]], 9, C.red); O(0, y - 4, 9, 9, C.yellow, 4); }
  else if (h === 'farmer') { P(`M-96 ${y + 24} Q0 ${y + 8} 96 ${y + 24} Q0 ${y + 36} -96 ${y + 24} Z`, '#B58A4E', 8); P(`M-52 ${y + 18} C -50 ${y - 36} 50 ${y - 36} 52 ${y + 18} Z`, '#C99C58', 9); L([[-50, y + 8], [50, y + 8]], 7, C.beam); }
  else if (h === 'tophat') { R(-44, y - 70, 88, 90, 6, C.line, 0); L([[-70, y + 20], [70, y + 20]], 12); }
}

/** The emu: shaggy body, slate-blue neck, beady eye, long legs. pose: stand | peck | run. Feet at (0,0). */
function emu(x, y, o = {}) {
  const { s = 1, pose = 'stand', t = 0, flip = false, eye = 'dot', bob = 0 } = o;
  at(x, y, s, () => {
    const run = pose === 'run' ? t * 2.4 : 0;
    const legA = pose === 'run' ? Math.sin(run * Math.PI * 2) * 34 : 0;
    const leg = (dx, sw) => { L([[dx, -150], [dx + 22 + sw * 0.4, -80], [dx + sw, -6]], 10); L([[dx + sw - 22, 0], [dx + sw + 26, 0]], 9); L([[dx + sw, 0], [dx + sw + 18, -14]], 7); };
    leg(-18, legA); leg(18, -legA);
    const by = -170 + (pose === 'run' ? Math.abs(Math.sin(run * Math.PI * 2)) * -12 : 0);
    P(`M-118 ${by} C -128 ${by - 90} -30 ${by - 120} 50 ${by - 90} C 96 ${by - 74} 110 ${by - 30} 96 ${by + 8} C 70 ${by + 40} -40 ${by + 46} -96 ${by + 22} L-130 ${by + 34} L-112 ${by + 6} L-140 ${by + 4} Z`, C.emu);
    L([[-80, by - 30], [-30, by - 10]], 6, C.emuLo); L([[-60, by + 2], [0, by + 14]], 6, C.emuLo);
    const peck = pose === 'peck' ? 1 : 0;
    const nx = 66, ny = by - 74;
    const hx = lerp(nx + 40, nx + 170, peck) + bob * 6, hy = lerp(ny - 170, by + 120, peck) + bob * 4;
    ctx.beginPath(); ctx.moveTo(nx - 10, ny + 20); ctx.quadraticCurveTo(lerp(nx + 70, nx + 140, peck), lerp(ny - 40, ny - 20, peck), hx, hy);
    ctx.lineWidth = 40; ctx.strokeStyle = C.line; ctx.lineCap = 'round'; ctx.stroke(); ctx.lineWidth = 22; ctx.strokeStyle = C.neck; ctx.stroke();
    at(hx, hy, 1, () => {
      O(0, 0, 34, 28, C.neck, 9);
      P('M24 -4 L70 6 L24 14 Z', '#3E3A36', 6);
      O(-2, -6, 13, 13, C.white, 5);
      if (eye === 'smug') L([[-12, -8], [8, -8]], 6); else if (eye === 'wide') O(0, -6, 6, 6, C.line, 0); else O(2, -5, 5.5, 5.5, C.line, 0);
      if (eye === 'smug') O(0, -2, 5, 3, C.line, 0);
    }, peck ? 0.5 : 0);
  }, 0, flip);
}

/* ---------- props ---------- */
const lewisGun = (x, y, s = 1, flash = 0, flip = false) => at(x, y, s, () => {
  L([[-20, 0], [-60, 70]], 12); L([[-20, 0], [10, 70]], 12);
  R(-120, -36, 210, 44, 16, '#4B5146');
  R(70, -24, 150, 18, 8, C.line, 0);
  P('M-60 -38 C -60 -96 40 -96 40 -38 Z', '#3B3F37');
  P('M-150 -20 L-120 -30 L-120 6 L-160 26 Z', C.beam, 9);
  if (flash > 0) P(`M224 -16 L${280 + flash * 60} ${-60 - flash * 20} L262 -16 L${300 + flash * 70} -14 L262 -8 L${280 + flash * 60} ${34 + flash * 20} Z`, C.yellow, 6);
}, 0, flip);
const truck = (x, y, s = 1, tt = 0, flip = false) => at(x, y, s, () => {
  const w = (wx) => { O(wx, -40, 46, 46, '#2B2A28'); O(wx, -40, 18, 18, C.grey, 6); L([[wx, -40], [wx + Math.cos(tt * 9) * 18, -40 + Math.sin(tt * 9) * 18]], 6); };
  R(-260, -170, 330, 100, 10, C.khaki); R(80, -230, 170, 160, 18, C.khakiLo); R(120, -210, 90, 64, 8, '#BFD6DD', 8); R(240, -140, 60, 70, 10, C.khakiLo);
  w(-170); w(190);
}, 0, flip);
const fence = (x0, x1, y, broken = 0) => {
  for (let x = x0; x <= x1; x += 150) { const k = Math.floor((x - x0) / 150); const fall = broken && k % 2 === 1 ? broken : 0; at(x, y, 1, () => { R(-12, -150, 24, 150, 6, C.timber, 8); }, fall * 1.2); }
  for (const yy of [y - 110, y - 60]) L([[x0, yy], [x1, yy + (broken ? 30 : 0)]], 6, C.line);
};
const wheatRow = (y, t, density = 1, sc = 1) => { for (let i = 0; i < 26 * density; i++) { const x = (i * 83) % (W + 60) - 30, h = 70 + (i * 37) % 40; const sway = wob(t + i * 0.13, 0.5, 6); L([[x, y], [x + sway, y - h * sc]], 7, C.fieldLo); O(x + sway, y - h * sc - 14, 10, 20, C.wheat, 5); } };
const cloud = (x, y, s) => at(x, y, s, () => P('M-120 30 C -150 30 -150 -14 -112 -18 C -104 -64 -40 -70 -24 -36 C -6 -80 70 -74 74 -24 C 120 -28 134 30 96 30 Z', C.cloud, 9));
const rays = (x, y, t, a = 0.4) => save(() => { ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(t * 0.15); ctx.fillStyle = C.yellow; for (let k = 0; k < 12; k++) { ctx.rotate(Math.PI / 6); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-90, -1600); ctx.lineTo(90, -1600); ctx.closePath(); ctx.fill(); } });
const coin = (x, y, s = 1) => at(x, y, s, () => { O(0, 0, 40, 40, C.yellow, 9); O(0, 0, 26, 26, null, 5); });
const card = (x, y, w, h, fill = C.white) => R(x - w / 2, y - h / 2, w, h, 24, fill, LW);

/* ---------- backgrounds ---------- */
function sky(t, top = C.sky, bottom = C.skyLo) {
  const g = ctx.createLinearGradient(0, 0, 0, GROUND); g.addColorStop(0, top); g.addColorStop(1, bottom); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  cloud(300 + t * 8, 170, 1.3); cloud(1500 - t * 6, 260, 1); cloud(960 + t * 5, 110, 0.8);
}
function field(t, opts = {}) {
  sky(t); P(`M0 ${GROUND - 120} C 400 ${GROUND - 220} 800 ${GROUND - 80} 1200 ${GROUND - 150} C 1500 ${GROUND - 200} 1750 ${GROUND - 130} 1920 ${GROUND - 160} L1920 1080 L0 1080 Z`, C.hill);
  P(`M0 ${GROUND} C 500 ${GROUND - 30} 1300 ${GROUND + 20} 1920 ${GROUND - 10} L1920 1080 L0 1080 Z`, opts.dry ? C.dry : C.field);
  if (!opts.dry) wheatRow(GROUND + 40, t, 1, 1);
}
function dryland(t) { sky(t, '#D7E2DF', '#F1EAD8'); P(`M0 ${GROUND} C 500 ${GROUND - 30} 1300 ${GROUND + 20} 1920 ${GROUND - 10} L1920 1080 L0 1080 Z`, C.dry); for (let i = 0; i < 9; i++) { const x = 100 + i * 210; at(x, GROUND + 60 + (i % 3) * 40, 0.7, () => P('M-40 0 C -30 -40 30 -40 40 0 Z', '#9FA77A', 7)); } }
function interior(wall = C.timber, floor = '#8B6440', windowOn = true) {
  ctx.fillStyle = wall; ctx.fillRect(0, 0, W, H);
  for (const x of [180, 960, 1740]) R(x - 26, 0, 52, GROUND, 0, C.beam, 8);
  if (windowOn) { R(1260, 200, 330, 380, 6, '#BFD6DD'); L([[1425, 200], [1425, 580]], 9); L([[1260, 390], [1590, 390]], 9); }
  R(-10, GROUND, W + 20, H - GROUND + 10, 0, floor);
}
function parchment() { ctx.fillStyle = C.parch; ctx.fillRect(0, 0, W, H); ctx.strokeStyle = C.parchLo; ctx.lineWidth = 3; for (let y = 60; y < H; y += 72) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); } }
function sea(t) { sky(t); R(-10, 560, W + 20, 280, 0, C.sea); for (let k = 0; k < 6; k++) L([[120 + k * 300 + wob(t + k, 0.6, 20), 640 + (k % 3) * 60], [200 + k * 300 + wob(t + k, 0.6, 20), 640 + (k % 3) * 60]], 7, C.cloud); }
function parliamentHall() { ctx.fillStyle = '#7C6A57'; ctx.fillRect(0, 0, W, H); for (let i = 0; i < 6; i++) R(120 + i * 300, 120, 140, 520, 70, '#C9B79A', 9); R(-10, GROUND - 120, W + 20, 400, 0, '#4E6A4B'); }
function dusk(t) { const g = ctx.createLinearGradient(0, 0, 0, GROUND); g.addColorStop(0, '#5A5878'); g.addColorStop(1, '#E3A877'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); O(1400, GROUND - 60, 120, 120, '#F4C57A', 0); P(`M0 ${GROUND} C 500 ${GROUND - 30} 1300 ${GROUND + 20} 1920 ${GROUND - 10} L1920 1080 L0 1080 Z`, '#6E5A48'); }
function australiaMap(t, arrows = 0) {
  ctx.fillStyle = '#9FC1C8'; ctx.fillRect(0, 0, W, H);
  // a simplified coastline, no borders
  P('M520 300 C 600 220 760 240 820 200 C 900 150 980 210 1040 180 C 1120 140 1180 170 1240 240 C 1320 230 1400 260 1440 360 C 1500 470 1520 560 1460 660 C 1420 740 1330 800 1240 790 C 1150 800 1090 760 1040 720 C 980 690 900 720 820 700 C 720 680 620 700 560 640 C 480 580 440 470 470 400 C 480 350 490 330 520 300 Z', '#D9C38E', LW);
  P('M1300 830 C 1330 820 1360 840 1350 870 C 1330 890 1300 880 1300 830 Z', '#D9C38E', 8);
  O(610, 520, 16, 16, C.red, 6);
  if (arrows > 0) for (let k = 0; k < 3; k++) { const a = clamp(arrows * 1.4 - k * 0.2, 0, 1); const y = 420 + k * 90, x0 = 1080, x1 = lerp(x0, 680, a); L([[x0, y], [x1, y]], 16, C.emuLo); if (a > 0.05) P(`M${x1 - 30} ${y} L${x1 + 10} ${y - 22} L${x1 + 10} ${y + 22} Z`, C.emuLo, 6); }
}

/* ---------- casting ---------- */
const FARMER = { coat: '#8A6A44', legCol: '#5C4A36', hat: 'farmer', hair: null };
const SOLDIER = { coat: C.khaki, hat: 'slouch' };
const MEREDITH = { coat: C.khaki, hat: 'cap', tache: true };
const SUIT = { coat: C.navy, legCol: '#23305A' };

/* ---------- the shots (lt = local time, D = shot length) ---------- */
const S = {};
const herd = (t, n, x0, x1, y0, sc, pose = 'stand', seed = 3) => { const r = mulberry(seed); const list = []; for (let i = 0; i < n; i++) list.push([lerp(x0, x1, r()), y0 + r() * 60, sc * (0.8 + r() * 0.3), r() * 6]); list.sort((a, b) => a[1] - b[1]).forEach(([x, y, s, ph], i) => emu(x, y, { s, pose, t: t + ph, bob: wob(t, 0.3, 1, ph), flip: i % 3 === 0 && pose !== 'run' })); };

S.field_fist = (t) => { field(t); bean(560, GROUND + 30, { ...FARMER, s: 1.45, face: 'angry', armR: 165 + wob(t, 0.12, 12), armL: 30 }); herd(t, 4, 1300, 1800, GROUND - 160, 0.45, 'peck'); };
S.emu_horde = (t) => { field(t); herd(t, 40, -100, 2000, GROUND - 180 + (1 - ease(clamp(t / 2, 0, 1))) * 120, 0.55, 'stand', 7); };
S.emu_stats = (t) => { field(t); emu(700, GROUND + 60, { s: 1.6, eye: 'smug', bob: wob(t, 0.4) }); [['6 ft', 0.3], ['50 km/h', 1.1], ['0 fear', 1.9]].forEach(([s, a], i) => { const p = pop(t, a); if (p > 0) at(1380, 260 + i * 190, backOut(p), () => big(s, 0, 40, 120, i === 2 ? C.yellow : C.white)); }); };
S.headline = (t) => { parchment(); at(960, 470, 1 + t * 0.01, () => { card(0, 0, 1200, 640, '#F3EEDF'); big('THE GREAT', 0, -100, 120); big('EMU WAR', 0, 60, 170, C.yellow); L([[-500, 160], [500, 160]], 8); for (let k = 0; k < 3; k++) L([[-480, 210 + k * 34], [480 - k * 120, 210 + k * 34]], 10, C.parchLo); }); };
S.myth_stamp = (t) => { S.headline(t + 4); const p = pop(t, 0.6, 0.18); if (p > 0) at(960, 470, lerp(2.4, 1, p), () => { ctx.globalAlpha = p; R(-380, -100, 760, 200, 20, null, 18); ctx.strokeStyle = C.red; ctx.lineWidth = 18; ctx.strokeRect(-380, -100, 760, 200); big('NOT A WAR', 0, 44, 120, C.red); }, -0.12); };
S.emu_smug = (t) => { field(t); rays(960, 700, t, 0.35); at(960, 0, 1 + t * 0.015, () => emu(-200, GROUND + 80, { s: 2.2, eye: 'smug', bob: wob(t, 0.5) })); };
S.title = (t) => { field(t); emu(1300, GROUND + 40, { s: 1.5, eye: 'smug' }); bean(520, GROUND + 30, { ...SOLDIER, s: 1.4, face: 'deadpan', holdR: () => L([[0, 0], [60, -170]], 14) }); const p = pop(t, 0.2, 0.4); at(960, 380, lerp(1.4, 1, backOut(p)), () => { big('THE GREAT', 0, -40, 130); big('EMU WAR', 0, 140, 210, C.yellow); }); };

S.ship_home = (t) => { sea(t); at(lerp(-200, 900, ease(clamp(t / 4, 0, 1))), 650, 1, () => { P('M-400 0 L400 0 L330 120 L-340 120 Z', '#3C4A5E'); R(-260, -140, 420, 140, 10, C.white); for (let k = 0; k < 4; k++) R(-230 + k * 100, -110, 50, 40, 8, '#9FC1C8', 6); R(40, -280, 70, 150, 6, C.red); for (let k = 0; k < 6; k++) at(-200 + k * 70, -140, 0.35, () => bean(0, 0, { ...SOLDIER, face: 'happy', armR: 160 })); }); };
S.soldiers_dock = (t) => { sea(t); R(-10, GROUND - 60, W + 20, 400, 0, C.timber); for (let k = 0; k < 5; k++) bean(260 + k * 340, GROUND + 40, { ...SOLDIER, s: 1.15, face: k === 2 ? 'deadpan' : 'blank', blank: k !== 2, armL: 20, armR: 20 }); const q = pop(t, 1.6); if (q > 0) at(960 + 0, 230, backOut(q), () => big('?', 0, 60, 200)); };
S.official_land = (t) => { interior(); R(580, 560, 900, 70, 12, C.beam); bean(500, GROUND + 30, { ...SUIT, s: 1.45, face: 'smug', tache: true, armR: 75, armL: 20 }); at(1150, 470, 1, () => { R(-260, -170, 520, 300, 12, '#E9DFC2'); P('M-200 -100 C -100 -160 120 -140 200 -80 C 220 20 160 100 40 100 C -100 110 -220 40 -200 -100 Z', '#C9B266', 8); const p = pop(t, 1.2); if (p > 0) at(40, -20, backOut(p), () => { L([[0, 0], [0, -90]], 8); P('M0 -90 L70 -70 L0 -50 Z', C.red, 6); }); }); };
S.empty_land = (t) => { dryland(t); save(() => { ctx.translate(-t * 30, 0); for (let i = 0; i < 4; i++) at(400 + i * 500, GROUND + 40, 0.6, () => P('M-60 0 L-50 -60 L50 -60 L60 0 Z', '#9B8E70', 8)); }); bean(1300, GROUND + 40, { ...FARMER, s: 1.1, face: 'deadpan', armL: 20, armR: 20, look: -1 }); };
S.plant_wheat = (t) => { field(t); for (let k = 0; k < 3; k++) bean(380 + k * 560, GROUND + 50, { ...FARMER, s: 1.2, face: k === 1 ? 'happy' : 'blank', blank: k !== 1, armR: 100 + wob(t + k, 0.15, 25), armL: 20, holdR: () => L([[0, 0], [70, 120]], 12, C.beam) }); };
S.price_crash = (t) => { parchment(); R(300, 180, 1320, 620, 20, C.white); L([[360, 740], [1560, 740]], 9); L([[360, 740], [360, 220]], 9); const k = ease(clamp(t / 2.4, 0, 1)); const pts = [[400, 300], [700, 330], [950, 360]]; pts.push([lerp(950, 1500, k), lerp(360, 700, k)]); L(pts, 18, C.red); if (k > 0.95) at(1500, 690, 1, () => big('↓', 0, 0, 120, C.red)); big('WHEAT PRICE', 960, 170, 64); };
S.empty_promise = (t) => { interior(); const p = ease(clamp(t / 1.5, 0, 1)); at(960, 470, 1, () => { R(-300, -190, 600, 380, 16, C.white); P('M-300 -190 L0 40 L300 -190', null, 9); }); const f = pop(t, 1.8); if (f > 0) at(960, 380 + p * 0, 1, () => { ctx.globalAlpha = f; big('(empty)', 0, 300, 70, C.white); }); bean(300, GROUND + 30, { ...FARMER, s: 1.2, face: 'sad', armL: 20, armR: 60 }); };
S.broke_farmers = (t) => { dryland(t); for (let k = 0; k < 3; k++) bean(560 + k * 400, GROUND + 40, { ...FARMER, s: 1.25, face: 'sad', armL: 10, armR: 10, blank: false }); };
S.emu_peek = (t) => { field(t); fence(0, 1920, GROUND + 20); const up = ease(clamp(t / 1.2, 0, 1)); emu(1100, GROUND + 230 - up * 160, { s: 1.5, eye: 'wide', bob: wob(t, 0.4) }); };
S.emu_fine = (t) => { field(t); rays(1100, 640, t, 0.3); emu(1100, GROUND + 70, { s: 1.9, eye: 'smug' }); };

S.migration_map = (t) => australiaMap(t, clamp(t / 3, 0, 1));
S.emus_march = (t) => { dryland(t); save(() => { ctx.translate(-t * 120, 0); herd(t, 14, 700, 2600, GROUND - 120, 0.6, 'run', 11); }); };
S.emus_see_wheat = (t) => { field(t); fence(0, 1920, GROUND + 30); for (let k = 0; k < 3; k++) at(200 + k * 120, GROUND + 260, 1, () => emu(0, 0, { s: 1.3, flip: true, eye: 'wide' })); O(1500, GROUND + 30, 160, 40, C.sea, 8); };
S.emus_eat = (t) => { field(t); herd(t, 9, 100, 1800, GROUND - 120, 0.75, Math.floor(t * 2) % 2 ? 'peck' : 'stand', 5); };
S.fence_rabbits = (t) => { field(t); const b = ease(clamp((t - 0.4) / 0.6, 0, 1)); fence(0, 1920, GROUND + 20, b); emu(500, GROUND + 60, { s: 1.2, pose: 'run', t }); for (let k = 0; k < 6; k++) { const x = (k * 300 + t * 300) % 2100 - 100, hop = Math.abs(Math.sin((t + k) * 6)) * 40; at(x, GROUND + 120 - hop, 0.9, () => { O(0, -40, 50, 34, '#A39787', 8); O(40, -70, 24, 22, '#A39787', 8); P('M36 -88 L30 -150 L48 -150 L50 -90 Z', '#A39787', 7); O(48, -74, 4, 4, C.line, 0); }); } };
S.farmer_meeting = (t) => { interior(); for (let k = 0; k < 4; k++) bean(300 + k * 440, GROUND + 30, { ...FARMER, s: 1.2, face: 'blank', blank: k !== 1, armL: k === 1 ? 150 : 20, armR: 20 }); };
S.farmer_guns = (t) => { interior(); bean(800, GROUND + 40, { ...FARMER, s: 1.7, face: 'smug', armR: 120 + wob(t, 0.2, 6), armL: 20 }); const p = pop(t, 1.0); if (p > 0) lewisGun(1450, 560, backOut(p) * 1.1); };
S.canberra = (t) => { sky(t); R(380, 360, 1160, 460, 10, C.white); for (let k = 0; k < 8; k++) R(440 + k * 140, 430, 60, 300, 8, '#E5DFD2', 8); P('M340 360 L960 200 L1580 360 Z', '#E5DFD2'); R(-10, GROUND, W + 20, 300, 0, '#7FA05A'); };
S.pearce_yes = (t) => { interior(C.navy === C.navy ? '#B9A88A' : C.timber); bean(960, GROUND + 50, { ...SUIT, s: 1.8, face: t > 0.5 ? 'smug' : 'deadpan', tache: true, hat: 'none', armR: 60 + wob(t, 0.3, 4), armL: 20 }); };
S.pearce_reasons = (t) => { parchment(); L([[960, 120], [960, 860]], 8); at(480, 460, 1, () => { big('PUBLICITY', 0, 220, 80); for (let k = 0; k < 3; k++) R(-180 + k * 130, -200, 100, 140, 10, C.white, 8); }); at(1440, 460, 1, () => { big('TARGET PRACTICE', 0, 220, 70); for (let r = 3; r > 0; r--) O(0, -100, r * 60, r * 60, r % 2 ? C.red : C.white); }); };

S.meredith_intro = (t) => { field(t); rays(960, 560, t, 0.35); at(960, GROUND + 60, 1, () => bean(0, 0, { ...MEREDITH, s: 2.1, face: 'smug', armL: 20, armR: 30 })); };
S.kit = (t) => { parchment(); for (let k = 0; k < 2; k++) bean(260 + k * 260, GROUND + 30, { ...SOLDIER, s: 1.1, face: 'deadpan' }); for (let k = 0; k < 2; k++) lewisGun(900 + k * 420, 560, 0.9); const p = pop(t, 1.8); if (p > 0) at(1500, 300, backOut(p), () => big('10,000', 0, 0, 140, C.yellow)); };
S.deal = (t) => { field(t); bean(640, GROUND + 30, { ...MEREDITH, s: 1.4, face: 'smug', armR: 70 }); bean(1280, GROUND + 30, { ...FARMER, s: 1.4, face: 'deadpan', armL: 70, flip: true }); const p = pop(t, 2.2); if (p > 0) { coin(960, 380, backOut(p)); coin(1030, 340, backOut(p) * 0.9); } };
S.rain = (t) => { sky(t, '#8C98A0', '#B9C2C4'); P(`M0 ${GROUND} C 500 ${GROUND - 30} 1300 ${GROUND + 20} 1920 ${GROUND - 10} L1920 1080 L0 1080 Z`, C.fieldLo); const r = mulberry(4); for (let i = 0; i < 90; i++) { const x = r() * W, y = ((r() * H + t * 900) % H); L([[x, y], [x - 8, y + 40]], 5, '#E4ECEE'); } herd(t, 4, 300, 1600, GROUND - 60, 0.9, 'stand'); for (let k = 0; k < 4; k++) O(330 + k * 430, GROUND + 140, 70, 18, '#6E8CA0', 6); };
S.calendar = (t) => { parchment(); at(960, 460, 1, () => { R(-320, -320, 640, 600, 24, C.white); R(-320, -320, 640, 140, 24, C.red); big('NOVEMBER', 0, -225, 72); big('2', 0, 160, 300, C.line === C.line ? C.white : C.white); big('1932', 0, 260, 70, C.yellow); }); };
S.far_flock = (t) => { field(t); herd(t, 9, 1300, 1800, GROUND - 160, 0.3, 'stand', 9); bean(420, GROUND + 60, { ...SOLDIER, s: 1.5, face: 'deadpan', look: 1, armR: 140, armL: 20 }); };
S.herding = (t) => { field(t); save(() => { ctx.translate(t * 160 - 300, 0); herd(t, 7, 800, 1300, GROUND - 60, 0.75, 'run', 13); for (let k = 0; k < 2; k++) bean(300 + k * 200, GROUND + 50, { ...FARMER, s: 1.1, face: 'angry', armR: 150, armL: 150, step: t * 2.5 + k }); }); };
S.scatter = (t) => { ctx.fillStyle = C.field; ctx.fillRect(0, 0, W, H); const r = mulberry(21); const k = ease(clamp(t / 2.5, 0, 1)); for (let i = 0; i < 24; i++) { const a = r() * Math.PI * 2, d = 80 + r() * 900 * k; const x = 960 + Math.cos(a) * d, y = 470 + Math.sin(a) * d * 0.55; at(x, y, 0.5, () => { O(0, 0, 60, 40, C.emu); O(Math.cos(a) * 60, Math.sin(a) * 30, 22, 22, C.neck, 8); }); } };
S.miss = (t) => { field(t); lewisGun(520, 660, 1.4, Math.floor(t * 12) % 2 ? 0.8 : 0); const r = mulberry(5); for (let i = 0; i < 4; i++) emu(1100 + i * 210 + wob(t, 0.12, 30, i), GROUND + 40, { s: 0.6, pose: 'run', t: t + i, flip: i % 2 === 1 }); for (let i = 0; i < 5; i++) { const x = 1000 + r() * 800, y = GROUND + 30 + r() * 80; O(x, y, 10, 6, C.parchLo, 0); } };
S.emu_fine2 = S.emu_fine;

S.dam = (t) => { field(t); O(1250, GROUND + 70, 420, 70, C.sea); bean(520, GROUND + 40, { ...MEREDITH, s: 1.4, face: 'smug', armR: 110 }); lewisGun(820, GROUND - 40, 0.9); };
S.thousand = (t) => { field(t); const k = ease(clamp(t / 3, 0, 1)); at(960, GROUND, lerp(1.4, 1, k), () => herd(t, 60, -1100, 1100, -160, 0.5, 'stand', 17)); bean(260, GROUND + 70, { ...SOLDIER, s: 1.3, face: 'panic' }); lewisGun(520, GROUND - 30, 0.9); const p = pop(t, 2.4); if (p > 0) at(1400, 260, backOut(p), () => big('~1,000', 0, 0, 140, C.yellow)); };
S.waiting = (t) => { field(t); bean(500, GROUND + 60, { ...SOLDIER, s: 1.6, face: 'deadpan', look: 1 }); lewisGun(940, GROUND - 40, 1.2); herd(t, 8, 1400, 1900, GROUND - 120, 0.55, 'stand'); };
S.fire = (t) => { field(t); const f = Math.floor(t * 14) % 2 ? 1 : 0; at(wob(t, 0.02, 4 * f), 0, 1, () => { bean(480, GROUND + 60, { ...SOLDIER, s: 1.5, face: 'angry', armR: 80, armL: 70 }); lewisGun(820, GROUND - 40, 1.2, f); }); herd(t, 8, 1400, 1900, GROUND - 120, 0.55, 'run'); };
S.twelve = (t) => { parchment(); for (let i = 0; i < 12; i++) { const p = pop(t, 0.2 + i * 0.12, 0.15); if (p > 0) at(380 + (i % 6) * 230, 330 + Math.floor(i / 6) * 260, backOut(p) * 0.8, () => { O(0, 0, 70, 46, C.emu); L([[-40, 0], [40, 0]], 8, C.white); }); } at(960, 860, 1, () => big('12', 0, 0, 130, C.yellow)); };
S.jam = (t) => { field(t); const j = t > 0.6; lewisGun(900, 600, 2, 0); if (j) { const p = pop(t, 0.6, 0.2); at(1380, 420, backOut(p), () => { O(0, 0, 70, 60, '#EDEDED', 8); O(60, -50, 50, 44, '#EDEDED', 8); }); at(960, 260, backOut(p), () => big('CLUNK', 0, 0, 120, C.red)); } };
S.flee = (t) => { field(t); save(() => { ctx.translate(t * 400, 0); herd(t, 18, 200, 1500, GROUND - 120, 0.55, 'run', 23); }); bean(300, GROUND + 60, { ...SOLDIER, s: 1.3, face: 'sad', armR: 60, holdR: () => L([[0, 0], [40, -60]], 10, C.grey) }); };
S.truck_idea = (t) => { field(t); truck(1200, GROUND + 50, 1.1); bean(480, GROUND + 50, { ...MEREDITH, s: 1.5, face: 'smug', armR: 100 + wob(t, 0.3, 6) }); const p = pop(t, 0.8); if (p > 0) at(560, 260, backOut(p), () => { O(0, 0, 60, 60, C.yellow); L([[0, 60], [0, 90]], 14); }); };
S.truck_chase = (t) => { field(t); save(() => { ctx.translate(-((t * 600) % 400), 0); wheatRow(GROUND + 120, t, 1.3, 0.6); }); truck(700, GROUND + 70 - Math.abs(wob(t, 0.07, 26)), 1.0, t, false); herd(t, 4, 1300, 1800, GROUND - 40, 0.6, 'run'); };
S.bounce = (t) => { field(t); const b = Math.abs(wob(t, 0.06, 40)); at(960, GROUND + 80 - b, 1.6, () => { R(-300, -170, 600, 110, 10, C.khaki); bean(-60, -170, { ...SOLDIER, s: 0.9, face: 'panic', armR: 160 + wob(t, 0.05, 20), armL: 150 }); lewisGun(160, -230, 0.6); }, wob(t, 0.07, 0.08)); };
S.steering = (t) => { interior('#BFD6DD', C.khakiLo, false); at(960, 640, 1, () => { O(0, 0, 220, 220, null, 26); L([[-220, 0], [220, 0]], 22); L([[0, 0], [0, 220]], 22); }, wob(t, 0.12, 0.35)); emu(1250, 980, { s: 1.4, pose: 'stand', eye: 'wide', flip: true }); };
S.fence_crash = (t) => { field(t); const k = ease(clamp(t / 0.8, 0, 1)); fence(900, 1920, GROUND + 20, k); truck(lerp(300, 1100, k), GROUND + 60, 1.0, t); if (t > 0.8) { const p = pop(t, 0.8, 0.2); at(1250, 400, backOut(p), () => big('CRUNCH', 0, 0, 130, C.red)); } emu(1700, GROUND + 50, { s: 1.0, eye: 'smug' }); };

S.guerrilla = (t) => { field(t); bean(560, GROUND + 50, { coat: '#5C7A4E', legCol: '#3E5536', hat: 'none', hair: C.hair || '#4A3523', s: 1.4, face: 'smug', armR: 140, holdR: () => { O(0, -20, 26, 20, C.line, 0); O(40, -20, 26, 20, C.line, 0); } }); herd(t, 3, 1300, 1700, GROUND - 60, 0.7, 'stand'); };
S.lookout = (t) => { dusk(t); P(`M1000 ${GROUND} C 1200 ${GROUND - 260} 1500 ${GROUND - 260} 1700 ${GROUND} Z`, '#5A4A3C'); emu(1340, GROUND - 210, { s: 1.4, eye: 'smug', bob: wob(t, 0.6) }); herd(t, 5, 200, 900, GROUND - 60, 0.6, 'peck'); };
S.papers = (t) => { parchment(); const heads = ['EMUS WIN AGAIN', 'BIRDS 1, ARMY 0', 'THE EMU WAR']; heads.forEach((h, i) => { const p = pop(t, i * 0.5, 0.2); if (p > 0) at(560 + i * 400, 380 + i * 90, backOut(p), () => { R(-300, -200, 600, 400, 8, '#F3EEDF'); big(h, 0, -110, 52); for (let k = 0; k < 4; k++) L([[-250, -40 + k * 50], [250 - (k % 2) * 80, -40 + k * 50]], 12, C.parchLo); }, (i - 1) * 0.08); }); };
S.parliament = (t) => { parliamentHall(); for (let k = 0; k < 7; k++) bean(160 + k * 270, GROUND + 70, { ...SUIT, s: 0.95, face: 'blank', blank: true, armL: k % 3 === 0 ? 150 + wob(t, 0.2, 10, k) : 20 }); const p = pop(t, 0.8); if (p > 0) at(960, 230, backOut(p), () => big('?!', 0, 60, 200)); };
S.withdraw = (t) => { dusk(t); truck(lerp(900, 2300, ease(clamp(t / D(), 0, 1))), GROUND + 60, 0.8, t); emu(400, GROUND + 40, { s: 1.1, eye: 'smug' }); };
S.tally = (t) => { parchment(); const n = Math.round(2500 * ease(clamp(t / 2, 0, 1))); at(960, 380, 1, () => big(n.toLocaleString('en-US') + ' rounds', 0, 0, 120)); const p = pop(t, 2.6); if (p > 0) at(960, 640, backOut(p), () => big('Emus: ???', 0, 0, 120, C.yellow)); };

S.complain = (t) => { field(t); herd(t, 6, 1100, 1800, GROUND - 100, 0.6, 'peck'); for (let k = 0; k < 2; k++) bean(300 + k * 340, GROUND + 50, { ...FARMER, s: 1.3, face: 'angry', armL: 150 + wob(t, 0.12, 15, k), armR: 160 - wob(t, 0.12, 15, k) }); };
S.premier = (t) => { interior(); R(500, 600, 920, 60, 10, C.beam); bean(960, GROUND + 30, { ...SUIT, s: 1.6, face: 'deadpan', hat: 'tophat', armR: 70 + wob(t, 0.25, 10) }); R(1140, 520, 140, 90, 8, C.white, 8); };
S.return = (t) => { field(t); truck(lerp(-500, 800, ease(clamp(t / 2, 0, 1))), GROUND + 60, 1.0, t); const p = pop(t, 2.4); if (p > 0) at(1400, 300, backOut(p), () => big('ROUND 2', 0, 0, 150, C.yellow)); };
S.better = (t) => { field(t); bean(760, GROUND + 50, { ...MEREDITH, s: 1.6, face: t < 1.5 ? 'smug' : 'deadpan', armR: 160, armL: 20 }); lewisGun(1200, GROUND - 30, 1); };
S.weekly = (t) => { parchment(); for (let w = 0; w < 4; w++) { const h = [80, 160, 260, 380][w] * ease(clamp(t / 2 - w * 0.15, 0, 1)); R(460 + w * 280, 760 - h, 180, h, 10, C.emu); } L([[400, 760], [1560, 760]], 9); big('~100 / week', 960, 230, 110, C.yellow); };
S.claims = (t) => { parchment(); const a = Math.round(986 * ease(clamp(t / 1.6, 0, 1))); const b = Math.round(9860 * ease(clamp((t - 1.4) / 1.6, 0, 1))); big(a + ' emus', 960, 380, 130); if (t > 1.4) big(b.toLocaleString('en-US') + ' bullets', 960, 620, 130, C.yellow); };
S.per_emu = (t) => { parchment(); emu(560, 820, { s: 1.4, eye: 'smug' }); for (let k = 0; k < 10; k++) { const p = pop(t, 0.2 + k * 0.12, 0.12); if (p > 0) at(1000 + (k % 5) * 140, 420 + Math.floor(k / 5) * 220, backOut(p), () => { R(-22, -70, 44, 120, 20, C.yellow, 8); }); } big('10 : 1', 1280, 900, 110, C.white); };
S.wounded = (t) => { parchment(); at(960, 450, 1, () => { R(-500, -260, 1000, 520, 20, C.white); big('"thousands wounded"', 0, -40, 72); }); const p = pop(t, 2.6); if (p > 0) at(960, 700, backOut(p), () => big('? ? ?', 0, 0, 130, C.yellow)); };
S.respect = (t) => { dusk(t); bean(700, GROUND + 50, { ...MEREDITH, s: 1.5, face: 'deadpan', armL: 20, armR: 20, look: 1 }); emu(1250, GROUND + 50, { s: 1.2, eye: 'dot', flip: true }); };
S.quote1 = (t) => { dusk(t); at(960, 0, 1 + t * 0.02, () => { bean(-280, GROUND + 70, { ...MEREDITH, s: 1.8, face: 'happy', armR: 110, armL: 20, look: 1 }); emu(330, GROUND + 70, { s: 1.5, eye: 'smug', flip: true }); }); };
S.quote2 = (t) => { dusk(t); rays(1250, 600, t, 0.3); at(960, 0, 1.06 + t * 0.02, () => { bean(-280, GROUND + 70, { ...MEREDITH, s: 1.8, face: 'happy', armR: 150, armL: 20, look: 1 }); emu(330, GROUND + 70, { s: 1.5, eye: 'smug', flip: true }); }); };
S.leave = (t) => { field(t); truck(lerp(800, 2300, ease(clamp(t / 3, 0, 1))), GROUND + 60, 0.9, t); herd(t, 5, 100, 700, GROUND - 60, 0.6, 'stand'); };

S.who_won = (t) => { field(t); P(`M600 ${GROUND} C 800 ${GROUND - 260} 1100 ${GROUND - 260} 1300 ${GROUND} Z`, C.hill); herd(t, 6, 650, 1250, GROUND - 230, 0.55, 'stand', 31); rays(950, 520, t, 0.3); };
S.bounty = (t) => { interior(); bean(560, GROUND + 30, { ...FARMER, s: 1.4, face: 'happy', armR: 80 }); for (let k = 0; k < 6; k++) { const p = pop(t, 0.4 + k * 0.25, 0.2); if (p > 0) coin(1100 + (k % 3) * 120, 640 - Math.floor(k / 3) * 70, backOut(p)); } };
S.bounty_count = (t) => { parchment(); const n = Math.round(57034 * ease(clamp(t / 2.2, 0, 1))); big(n.toLocaleString('en-US'), 960, 420, 190, C.yellow); big('bounties in 6 months (1934)', 960, 620, 64); };
S.barrier_fence = (t) => { dryland(t); save(() => { ctx.translate(-t * 80, 0); fence(-200, 2400, GROUND + 40); for (let x = -200; x < 2400; x += 60) L([[x, GROUND - 110], [x + 30, GROUND - 60]], 4, C.grey); }); herd(t, 3, 1400, 1800, GROUND - 40, 0.6, 'stand'); };
S.not_war = (t) => S.myth_stamp(t + 0.2);
S.cull = (t) => { parchment(); at(960, 450, 1, () => { R(-520, -240, 1040, 480, 20, C.white); big('A CULL', 0, -60, 120); big('by soldiers, that mostly failed', 0, 80, 60, C.yellow); }); };
S.name_stuck = (t) => { parchment(); at(960, 460, 1 + wob(t, 0.5, 0.01), () => { big('THE GREAT', 0, -40, 130); big('EMU WAR', 0, 140, 210, C.yellow); }); const p = pop(t, 1.6); if (p > 0) at(1500, 820, backOut(p), () => big('10/10', 0, 0, 90, C.white)); };
S.coat_of_arms = (t) => { parchment(); rays(960, 560, t, 0.35); R(760, 760, 400, 80, 10, C.beam); emu(980, 760, { s: 1.6, eye: 'smug' }); for (let k = 0; k < 6; k++) { const a = Math.PI * (0.15 + k * 0.14); O(960 + Math.cos(a) * 520, 560 - Math.sin(a) * 420, 22, 40, '#7FA05A', 7); } };
S.meredith_footnote = (t) => { parchment(); at(960, 420, 1, () => { R(-560, -260, 1120, 520, 16, C.white); for (let k = 0; k < 4; k++) L([[-480, -180 + k * 70], [480, -180 + k * 70]], 14, C.parchLo); L([[-480, 170], [200, 170]], 6); }); bean(1180, 650, { ...MEREDITH, s: 0.55, face: 'deadpan' }); big('*', 760, 600, 120, C.yellow); };
S.and_emus = (t) => { field(t); const k = ease(clamp(t / 2, 0, 1)); at(960, GROUND + 60, lerp(1, 1.3, k), () => emu(0, 0, { s: 1.3, eye: 'dot', bob: wob(t, 0.5) })); };
S.final_fine = (t) => { field(t); rays(1100, 640, t, 0.35); emu(1100, GROUND + 70, { s: 1.9, eye: 'smug' }); };

let Dcur = 5; const D = () => Dcur;

/* ---------- captions ---------- */
function caption(text, lt, len) {
  if (!text) return;
  const parts = []; const re = /\*([^*]+)\*|([^*]+)/g; let m;
  while ((m = re.exec(text))) parts.push(m[1] !== undefined ? [m[1], true] : [m[2], false]);
  const plain = parts.map((p) => p[0]).join('');
  let size = 60; ctx.font = `900 ${size}px "Inter Tight"`;
  const words = plain.split(' '); const lines = []; let cur = '';
  for (const w of words) { const nx = cur ? cur + ' ' + w : w; if (ctx.measureText(nx).width > 1500 && cur) { lines.push(cur); cur = w; } else cur = nx; }
  lines.push(cur);
  const bare = (w) => w.replace(/[^A-Za-z0-9-]/g, '').toLowerCase();
  const accent = new Set(); parts.forEach(([s, a]) => { if (a) s.split(' ').forEach((w) => accent.add(bare(w))); });
  const a = pop(lt, 0, 0.15), sc = lerp(0.9, 1, backOut(a));
  save(() => {
    ctx.translate(960, CAP_TOP + 40); ctx.scale(sc, sc);
    lines.forEach((ln, i) => {
      const y = (i - (lines.length - 1) / 2) * 72 + 20;
      ctx.font = `900 ${size}px "Inter Tight"`; const total = ctx.measureText(ln).width; let x = -total / 2;
      ln.split(' ').forEach((w, j, arr) => { const piece = j < arr.length - 1 ? w + ' ' : w; big(piece, x, y, size, accent.has(bare(w)) ? C.yellow : C.white, 'left'); x += ctx.measureText(piece).width; });
    });
  });
}

/* ---------- timeline + render ---------- */
async function load() {
  LINES = await (await fetch('lines.json')).json();
  let dur = {}; try { const r = await fetch('voice/dur.json'); if (r.ok) dur = await r.json(); } catch (e) { /* no voice yet: placeholder lengths */ }
  let t = 0; SHOTS = LINES.map((l) => { const v = dur[l.id] ?? 3.6; const len = l.id === 'title' ? Math.max(4.2, v + 1.6) : Math.max(3.4, v + 1.0); const s = { ...l, t0: t, len, vdur: v }; t += len; return s; });
  const END = 4.0; DUR = t + END; window.DUR = DUR;
  window.EV = SHOTS.map((s) => ({ t: s.t0, type: 'cut', id: s.id, scene: s.scene, shot: s.shot })).concat([{ t, type: 'end' }]);
  window.SHOTS = SHOTS;
}
function endCard(lt) { parchment(); const p = pop(lt, 0.1, 0.4); at(960, 470, lerp(1.3, 1, backOut(p)), () => { big('UNDER 7 MINUTES', 0, -30, 130); big('Big history, shorter stories.', 0, 80, 64, C.yellow); }); }
window.render = (t) => {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
  const i = SHOTS.findIndex((s) => t >= s.t0 && t < s.t0 + s.len);
  if (i < 0) { endCard(t - (SHOTS.length ? SHOTS[SHOTS.length - 1].t0 + SHOTS[SHOTS.length - 1].len : 0)); return; }
  const s = SHOTS[i], lt = t - s.t0; Dcur = s.len;
  const snap = lerp(1.04, 1, ease(clamp(lt / 0.2, 0, 1)));
  save(() => { ctx.translate(960, 540); ctx.scale(snap, snap); ctx.translate(-960, -540); (S[s.shot] || S.emu_fine)(lt); });
  // the caption band: a soft dark scrim so white lettering reads on any ground
  const g = ctx.createLinearGradient(0, CAP_TOP - 60, 0, H); g.addColorStop(0, 'rgba(20,18,16,0)'); g.addColorStop(1, 'rgba(20,18,16,0.35)'); ctx.fillStyle = g; ctx.fillRect(0, CAP_TOP - 60, W, H);
  caption(s.sub, lt, s.len);
};
window.TEXTS = (t) => [];
(async () => {
  const cv = document.getElementById('c'); cv.width = W; cv.height = H; ctx = cv.getContext('2d');
  await load();
  await document.fonts.load('900 60px "Inter Tight"'); await document.fonts.ready;
  window.render(0); window.READY = true;
})();
