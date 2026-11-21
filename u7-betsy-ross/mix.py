"""Under 7 Minutes short: voice + light pizzicato score + a swish on every cut → out/mix.wav (48 kHz stereo).
Run from $LIB:  .venv/bin/python <project>/mix.py <project> [seed]"""
import sys, os, json
import numpy as np
import soundfile as sf
sys.path.insert(0, os.getcwd())
from core.audio import sampler as S
from core.audio import sfx as X
from core.audio.sfx import SR, add, limit, hp, lp, bp, noise, brown, t_
from scipy.ndimage import uniform_filter1d, maximum_filter1d

P = os.path.abspath(sys.argv[1]); seed = int(sys.argv[2]) if len(sys.argv) > 2 else 7
SH = json.load(open(f'{P}/src/data/shots.json')); FPS = SH['fps']
L = {l['id']: l for l in json.load(open(f'{P}/lines.json'))}
t = 0.0; cuts = []
for s in SH['shots']: cuts.append((t, s['id'])); t += s['frames'] / FPS
DUR = t; N = int(DUR * SR) + SR // 2
S.seed(seed); rng = np.random.default_rng(seed)

# ---------- score: 100 bpm pizzicato theme, oom-pah bass, woodblock-like claves; one key per short ----------
KEYS = [('C', ['C', 'A', 'F', 'G']), ('D', ['D', 'B', 'G', 'A']), ('F', ['F', 'D', 'Bb', 'C']), ('G', ['G', 'E', 'C', 'D'])]
_, prog = KEYS[seed % 4]
TONES = {'C': ('C', 'E', 'G'), 'A': ('A', 'C', 'E'), 'F': ('F', 'A', 'C'), 'G': ('G', 'B', 'D'), 'D': ('D', 'F#', 'A'), 'B': ('B', 'D', 'F#'),
         'E': ('E', 'G', 'B'), 'Bb': ('Bb', 'D', 'F')}
BEAT = 0.6; BAR = 4 * BEAT
ev = []
def n(t, inst, p, d, v, pan=0, g=1.0): ev.append(dict(t=t, inst=inst, pitch=p, dur=d, vel=v, pan=pan, gain=g))
k, t0 = 0, 0.0
while t0 < DUR - BAR * 0.5:
    r, th, fi = TONES[prog[k % 4]]
    for i in range(4):
        n(t0 + i * BEAT, 'contrabass_pizz', (r if i % 2 == 0 else fi) + '2', BEAT * .6, .7 if i % 2 == 0 else .55, -.15, .9)
        n(t0 + i * BEAT + BEAT / 2, 'violas_pizz', th + '4', BEAT / 2, .4, .25, .5)
        n(t0 + i * BEAT + BEAT / 2, 'claves', None, None, .35, -.3, .4)
    if (k // 2) % 2 == 0:   # melody every other phrase so the voice has room
        for pos, tone, o in [(0, th, 5), (2, fi, 5), (3, th, 5), (5, r, 5), (6, fi, 4)]:
            n(t0 + pos * BEAT / 2, 'violins_pizz', tone + str(o), BEAT / 2 * .9, .6, .15, .85)
    k += 1; t0 += BAR
# button on the last cut (the loop gag)
n(cuts[-1][0], 'contrabass_pizz', prog[0] + '2', .3, .8, 0, 1.0); n(cuts[-1][0], 'violins_pizz', prog[0] + '5', .3, .8, .2, 1.0)
music = S.render(ev, N / SR, master=False)
music = S.room(music, size=.3, mix=.15)
music = np.pad(music, ((0, max(0, N - len(music))), (0, 0)))[:N]

# ---------- foley: a soft swish on every cut, a thump on the title card ----------
fx = np.zeros((N, 2), np.float32)
for i, (tc, sid) in enumerate(cuts):
    if i: add(fx, X.whoosh(.3, 1) * .12, tc - .18, 1, rng.random() * .6 - .3)
    add(fx, X.click(1.2, .5) * .06, tc, 1, 0)
add(fx, X.thump(1, 70) * .4, cuts[3][0] + .05, 1, 0)
room = np.stack([lp(brown(N / SR), 300), lp(brown(N / SR), 300)], 1).astype(np.float32)[:N]; fx[:len(room)] += room / np.abs(room).max() * .01

# ---------- voice ----------
vo = np.zeros((N, 2), np.float32)
for tc, sid in cuts:
    x, sr = sf.read(f'{P}/voice/{sid}.wav', dtype='float32')
    if x.ndim > 1: x = x.mean(1)
    if sr != SR:
        import soxr; x = soxr.resample(x, sr, SR).astype(np.float32)
    add(vo, hp(x, 80).astype(np.float32), tc + .1, .5 ** .5, 0)

env = uniform_filter1d(np.abs(vo[:, 0]), int(.05 * SR))
env = maximum_filter1d((env > .01).astype(np.float32), int(.35 * SR)); env = uniform_filter1d(env, int(.12 * SR))
music *= (1 - env * (1 - 10 ** (-8 / 20)))[:, None]
sp = env > .5; rms = lambda x: float(np.sqrt(np.mean(x ** 2)) + 1e-9)
music *= (rms(vo[sp]) / rms(music[sp])) * 10 ** (-10 / 20)
mix = vo + music + fx
mix = np.stack([limit(mix[:, 0], .3, .008), limit(mix[:, 1], .3, .008)], 1).astype(np.float32)[:int(DUR * SR)]
os.makedirs(f'{P}/out', exist_ok=True); sf.write(f'{P}/out/mix.wav', mix, SR)
print(f'{os.path.basename(P)}: mix {DUR:.1f} s, {len(ev)} notes')
