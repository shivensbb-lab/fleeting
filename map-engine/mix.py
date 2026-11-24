"""Score + foley + narration for one map film, from <film>/events.json, <film>/voice/cues.json and <film>/score.json.

score.json: {"bpm": 84, "key": "D", "minor": true, "seed": 3, "states": [["v01", -1.0, "pad"], ["v02", 0, "pulse"], ...],
             "beds": {"sea": [["v01", 0, .03], ...], "wind": [...], "fire": [...]}}
States: pad (bowed vibraphone + low strings), pulse (+ contrabass pizzicato, frame drum), drive (+ cello spiccato),
thin (a low pedal only), silence, resolve (harp arpeggios, held chord). Palette per the 3D Map Explainer style.
usage (from the library root): .venv/bin/python map-engine/mix.py <film>   -> <film>/out/mix.wav
"""
import json, os, sys
import numpy as np, soundfile as sf, soxr, time
_T0 = time.time()
def LOG(m): print(f'[{time.time()-_T0:7.1f}s] {m}', flush=True)
LIB = os.environ.get('LIB', '/root/lemo-opuscar'); sys.path.insert(0, LIB)
from core.audio import sampler as S
from core.audio.sfx import SR, bp, lp, hp, add, compress, limit, click, whoosh, thump

F = os.path.abspath(sys.argv[1])
EVJ = json.load(open(os.path.join(F, 'events.json'))); FULL = float(EVJ['dur']); EV = EVJ['ev']
CJ = json.load(open(os.path.join(F, 'voice', 'cues.json'))); CUES = CJ['cues']; T = {c['id']: c['t0'] for c in CUES}
SC = json.load(open(os.path.join(F, 'score.json')))
N = int(FULL * SR) + SR; tt = np.arange(N) / SR
rng = np.random.default_rng(SC.get('seed', 3))
BEAT = 60 / SC['bpm']; BAR = 4 * BEAT
at = lambda ref, off=0: (T[ref] if isinstance(ref, str) else ref) + off
def env_lin(points): ts, vs = zip(*sorted(points)); return np.interp(tt, ts, vs)
def st(x): return np.stack([x, np.roll(x, 1733)], 1)

# ---------- harmony ----------
NOTE = {'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5, 'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11}
root = 36 + NOTE[SC.get('key', 'D')]
minor = SC.get('minor', True)
DEG = [0, 2, 3, 5, 7, 8, 10] if minor else [0, 2, 4, 5, 7, 9, 11]
def chord(deg):     # triad + 9th voiced low → [bass, fifth, root+12, third+12, fifth+12]
    s = lambda d: root + DEG[d % 7] + 12 * (d // 7)
    return [s(deg), s(deg + 4), s(deg + 7), s(deg + 9), s(deg + 11)]
PROG = [chord(d) for d in SC.get('prog', [0, 5, 3, 4] if minor else [0, 3, 5, 4])]
PENTA = [root + 24 + i for i in ([0, 3, 5, 7, 10, 12, 15, 17, 19] if minor else [0, 2, 4, 7, 9, 12, 14, 16, 19])]

states = sorted([(at(r, o), s) for r, o, s in SC['states']])
def state(t):
    s = 'pad'
    for a, k in states:
        if t >= a: s = k
    return s

ev = []
nb = int(FULL / BAR) + 1
for b in range(nb):
    t0 = b * BAR; c = PROG[b % len(PROG)]; s = state(t0 + .01)
    if s == 'silence': continue
    if s in ('pad', 'pulse', 'drive'):
        ev.append((t0, 'vibraphone_bowed', c[3] + 12, BAR * 1.02, .26, -.3, .2))
        ev.append((t0, 'cellos', c[0] + 12, BAR * 1.02, .26, 0, .22))
    if s in ('pulse', 'drive'):
        for q in range(4):
            if state(t0 + q * BEAT + .01) == 'silence': break
            ev.append((t0 + q * BEAT, 'contrabass_pizz', c[0] if q % 2 == 0 else c[1], .5, .5 if q == 0 else .38, -.05, .55))
        ev.append((t0, 'frame_drum', 'large_muted', None, .4, 0, .45))
    if s == 'drive':
        pat = [2, 3, 2, 1, 2, 3, 2, 3] if b % 2 else [2, 3, 2, 3, 2, 3, 3, 2]
        for i, k in enumerate(pat): ev.append((t0 + i * BEAT / 2, 'cellos_spic', c[k] + 12, .25, .32 + .1 * (i % 2 == 0), .25, .5))
    if s == 'thin':
        ev.append((t0, 'contrabass', c[0], BAR * 1.02, .4, 0, .34))
    if s == 'resolve':
        for i, k in enumerate([1, 2, 3, 4, 3, 2, 3, 4]): ev.append((t0 + i * BEAT / 2, 'harp', c[k] + 12, 1.2, .34 + .05 * (i == 0), -.2 + .05 * i, .4))
        ev.append((t0, 'contrabass', c[0], BAR, .36, 0, .3)); ev.append((t0, 'vibraphone_bowed', c[3] + 12, BAR, .24, .2, .16))
# final chord on the last bar boundary before the end
fin = max(0, FULL - 3.2)
for i, p in enumerate([PROG[0][0], PROG[0][1] + 12, PROG[0][2] + 12, PROG[0][3] + 12, PROG[0][4] + 12]): ev.append((fin + i * .03, 'harp', p, 3.0, .45, -.3 + i * .15, .5))
ev.append((fin, 'vibraphone_bowed', PROG[0][3] + 12, 3.0, .3, .2, .2))

# ---------- events → musical hits ----------
pin_i = slab_i = 0
for e in EV:
    k, t = e['type'], e['t']
    if k == 'pin': ev.append((t, 'hand_chimes', PENTA[pin_i % len(PENTA)], 2.0, .42, .3 if pin_i % 2 else -.3, .45)); pin_i += 1
    elif k == 'beach': ev.append((t, 'hand_chimes', PENTA[2 + e['i']], 2.0, .5, -.4 + .2 * e['i'], .5))
    elif k == 'ignite':
        ev += [(t, 'contrabass', PROG[0][0], 2.4, .45, 0, .38), (t, 'frame_drum', 'large', None, .55, 0, .65)]
        for i, p in enumerate(PENTA[3:7]): ev.append((t + i * BEAT / 2, 'glockenspiel', p, .9, .28 + .04 * i, .35 - .2 * i, .32))
    elif k == 'slab':
        if e.get('col') == 'ghost': continue
        ev.append((t, 'violins_pizz', PENTA[min(len(PENTA) - 1, slab_i % 9)] + 12, .4, .3, .2, .36)); slab_i += 1
    elif k == 'cut': ev += [(t, 'contrabass', PROG[0][0] - 12 + 12, 4.0, .42, 0, .38)]
pillars = sorted({round(e['t'] - .2, 1) for e in EV if e['type'] == 'slab'})
done = -9
for t in pillars:
    if t - done < 3: continue
    done = t; ev += [(t, 'horn', PROG[0][1] + 12, 2.6, .36, -.1, .28), (t, 'horn', PROG[0][2] + 12, 2.6, .32, .1, .24)]
LOG('score events %d' % len(ev))
S.seed(SC.get('seed', 3))
sc = S.render(ev, dur=FULL + 1, master=False)[:N]
f0 = 440 * 2 ** ((root - 12 - 69) / 12)
drone = np.sin(2 * np.pi * f0 * tt) + .45 * np.sin(4 * np.pi * f0 * tt) + .22 * np.sin(6 * np.pi * f0 * tt)
drone *= env_lin([(0, 0), (1.0, .02), (FULL - 1, .022), (FULL, 0)])
sc += st(drone)
LOG('rendered score')
sc = np.stack([hp(sc[:, c], 32, 2) for c in range(2)], 1)
music = S.room(sc, size=.55, mix=.22)

LOG('room done')
# ---------- ambience ----------
mix = np.zeros((N, 2))
air = bp(rng.standard_normal(N), 250, 5200, 2) * .012
mix += st(air)
beds = SC.get('beds', {})
def bed(name, src):
    if name not in beds: return
    mix[:] += st(src * env_lin([(at(r, o), v) for r, o, v in beds[name]]))
bed('sea', lp(bp(rng.standard_normal(N), 120, 900, 1), 700) * (1 + .5 * np.sin(2 * np.pi * tt / 6.5)))
bed('wind', bp(rng.standard_normal(N), 300, 2400, 2) * (1 + .6 * np.sin(2 * np.pi * tt / 4.1) * np.sin(2 * np.pi * tt / 2.3)))
bed('fire', hp(rng.standard_normal(N) * (rng.random(N) < .004) * 8, 1500) + lp(rng.standard_normal(N), 300) * .4)
under = np.zeros(N)

LOG('beds done')
# ---------- foley ----------
for e in EV:
    k, t = e['type'], e['t']
    if k in ('whoosh', 'rise'): add(mix, lp(whoosh(1.8, 1.0), 1800) * .09, t, 1, 0)
    elif k == 'dive': add(mix, lp(whoosh(1.4, 1.0), 2400) * .12, t, 1, 0)
    elif k == 'draw': add(mix, lp(whoosh(min(2.5, max(.6, e.get('d', 1))), .6), 1400) * .04, t, 1, -.2)
    elif k == 'pin': add(mix, hp(click(pitch=1.6, v=1.0), 2500) * .05, t, 1, .2)
    elif k == 'beach': add(mix, hp(click(pitch=1.4, v=1.0), 2200) * .06, t, 1, 0)
    elif k == 'measure':
        for i in range(6): add(mix, hp(click(pitch=1.2 + .08 * i, v=1.0), 1800) * .045, t + i * .1, 1, .2)
    elif k == 'ignite':
        add(mix, thump(1.0, 52) * .24, t, 1, 0)
        n = int(2.0 * SR); x = np.arange(n) / SR
        add(mix, bp(np.sin(2 * np.pi * 110 * x) + .5 * np.sin(2 * np.pi * 220.7 * x) + .3 * rng.standard_normal(n), 150, 2400, 1) * np.exp(-x / .7) * np.minimum(1, x / .05) * .03, t, 1, .15)
    elif k == 'cut':
        n = int(1.3 * SR); x = np.arange(n) / SR
        add(mix, bp(rng.standard_normal(n), 80, 900, 2) * np.exp(-x / .5) * np.minimum(1, x / .02) * .16, t, 1, 0); add(mix, thump(1.0, 40) * .2, t, 1, 0)
    elif k == 'slab': pass
sec = [e['t'] for e in EV if e['type'] == 'cut']
if sec and 'section_len' in SC:
    a = sec[0]; under = lp(rng.standard_normal(N), 260, 2) * env_lin([(0, 0), (a, 0), (a + .4, .05), (a + SC['section_len'] - .3, .05), (a + SC['section_len'], 0), (FULL, 0)])
    mix += st(under)

LOG('foley done')
# ---------- narration, duck, balance ----------
mid = np.stack([bp(music[:, c], 300, 4000, 2) for c in range(2)], 1)
music = music - mid * (1 - 10 ** (-4 / 20))
voice = np.zeros(N); active = np.zeros(N)
for c in CUES:
    x, sr = sf.read(os.path.join(F, 'out', 'voice', c['id'] + '.wav'), dtype='float64')
    if x.ndim > 1: x = x.mean(1)
    if sr != SR: x = soxr.resample(x, sr, SR)
    i = int(c['t0'] * SR); j = min(N, i + len(x)); voice[i:j] += x[:j - i]; active[i:j] = 1
voice = compress(hp(voice, 80, 2), thr=.18, ratio=3.0)
from scipy.ndimage import uniform_filter1d
duck = uniform_filter1d(active, int(.25 * SR), mode='constant')
music = music * (1 - .45 * np.clip(duck * 1.4, 0, 1))[:, None]
vr = np.sqrt((voice[active > 0] ** 2).mean()); voice *= .16 / vr
mr = np.sqrt((music[active > 0] ** 2).mean()); music *= (.16 * 10 ** (-10 / 20)) / mr
fx = np.sqrt((mix[active > 0] ** 2).mean()); mix *= min(1.0, (.16 * 10 ** (-12 / 20)) / max(fx, 1e-9))
out = mix + music + np.stack([voice, voice], 1)
out = out[:int(FULL * SR)]
nf = int(1.0 * SR); out[-nf:] *= np.linspace(1, 0, nf)[:, None] ** 1.5
out = np.stack([limit(compress(out[:, c], thr=.35, ratio=2.0)) for c in range(2)], 1)
LOG('master done')
sf.write(os.path.join(F, 'out', 'mix.wav'), out.astype(np.float32), SR)
used = ['hand_chimes', 'vibraphone_bowed', 'contrabass_pizz', 'cellos_spic', 'contrabass', 'cellos', 'glockenspiel', 'harp', 'frame_drum', 'violins_pizz', 'horn']
cr = S.credits(used); open(os.path.join(F, 'out', 'instruments.txt'), 'w').write('\n'.join(cr) if isinstance(cr, list) else str(cr))
vo = 20 * np.log10(np.sqrt((voice[active > 0] ** 2).mean())); mu = 20 * np.log10(np.sqrt((music[active > 0] ** 2).mean()))
print(f'{os.path.basename(F)} mix {FULL:.1f}s peak {np.abs(out).max():.3f} voice {vo:.1f} dB music {mu:.1f} dB gap {vo - mu:.1f}')
