"""Synth pop-print score + foley + narration for one cold case (Halftone Dossier palette), all synthesized with numpy.
usage (library root): .venv/bin/python <case>/mix.py <case-dir> [seed]  -> <case>/out/mix.wav
Reads <case>/events.json (page EV: stamp, bigstamp, wipe) and <case>/voice/cues.json.
"""
import json, os, sys
import numpy as np, soundfile as sf, soxr
from scipy.ndimage import uniform_filter1d
LIB = os.environ.get('LIB', '/root/lemo-opuscar'); sys.path.insert(0, LIB)
from core.audio.sfx import SR, bp, lp, hp, add, compress, limit, click, whoosh, thump

D = os.path.abspath(sys.argv[1]); seed = int(sys.argv[2]) if len(sys.argv) > 2 else 1
EVJ = json.load(open(os.path.join(D, 'events.json'))); DUR = float(EVJ['dur']); EV = EVJ['ev']
CUES = json.load(open(os.path.join(D, 'voice', 'cues.json')))['cues']; T = {c['id']: c['t0'] for c in CUES}
N = int(DUR * SR) + SR; tt = np.arange(N) / SR; rng = np.random.default_rng(seed)
BPM = 110; BEAT = 60 / BPM; E8 = BEAT / 2
KEYS = [(45, [0, 3, 7, 10]), (43, [0, 3, 7, 10]), (40, [0, 4, 7, 11]), (38, [0, 3, 7, 10])]   # A, G, E, D roots (minor-ish)
root, _ = KEYS[seed % 4]
PROG = [0, -4, -2, -5]          # semitone offsets per bar: i - VI - VII - v
hz = lambda m: 440 * 2 ** ((m - 69) / 12)
def env(n, a, d): x = np.arange(n) / SR; return np.minimum(1, x / max(a, 1e-4)) * np.exp(-x / d)
def kick(): n = int(.35 * SR); x = np.arange(n) / SR; f = 50 + 90 * np.exp(-x / .04); return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, .002, .12)
def snare(): n = int(.25 * SR); return bp(rng.standard_normal(n), 900, 6000, 2) * env(n, .001, .06) * .7 + np.sin(2 * np.pi * 190 * np.arange(n) / SR) * env(n, .001, .05) * .4
def clap():
    n = int(.22 * SR); b = bp(rng.standard_normal(n), 1100, 4000, 2); e = np.zeros(n)
    for o in (0, .011, .022):
        i = int(o * SR); e[i:] += env(n - i, .001, .03 if o < .02 else .09)
    return b * e * .6
def hat(): n = int(.06 * SR); return hp(rng.standard_normal(n), 7000, 2) * env(n, .001, .015) * .35
def snap(): n = int(.08 * SR); return bp(rng.standard_normal(n), 2000, 5000, 2) * env(n, .0005, .012)
def pluck(m, dur=.35):    # marimba-like: fundamental + ~4x partial
    n = int(dur * SR); x = np.arange(n) / SR; f = hz(m)
    return (np.sin(2 * np.pi * f * x) * env(n, .002, .22) + .35 * np.sin(2 * np.pi * f * 3.93 * x) * env(n, .001, .05)) * .5
def bass(m, dur):
    n = int(dur * SR); x = np.arange(n) / SR; f = hz(m); ph = 2 * np.pi * f * x
    sq = np.sign(np.sin(ph)) * .35 + np.sin(ph) * .65
    return lp(sq, 900, 2) * np.minimum(1, x / .005) * np.exp(-x / (dur * .9)) * .55
def bell(m, dur=1.6):
    n = int(dur * SR); x = np.arange(n) / SR; f = hz(m)
    return (np.sin(2 * np.pi * f * x) + .4 * np.sin(2 * np.pi * f * 2.76 * x) + .2 * np.sin(2 * np.pi * f * 5.4 * x)) * env(n, .002, .5) * .35
def pad(m, dur):
    n = int(dur * SR); x = np.arange(n) / SR; tri = lambda f: 2 / np.pi * np.arcsin(np.sin(2 * np.pi * f * x))
    return (tri(hz(m)) + tri(hz(m + 7)) * .6 + tri(hz(m + 3)) * .5) * np.minimum(1, x / .3) * np.minimum(1, (dur - x) / .3) * .12

music = np.zeros((N, 2)); fx = np.zeros((N, 2))
stamp1 = 0.9; verdict = T['v5']; endv = T['v6']; endstamp = endv + 0.5
def section(t):
    if t < stamp1: return 'none'
    if verdict - E8 * 2 <= t < verdict: return 'drop'          # half-bar breath into the verdict
    if t < verdict: return 'groove'
    if endstamp - BEAT * 2 <= t < endstamp: return 'drop'
    if t < endstamp: return 'thin'
    return 'tag'
mel = [0, 3, 7, 10, 7, 3, 5, 7]
t = stamp1; i = 0
while t < DUR - .3:
    bar = int((t - stamp1) / (4 * BEAT)); pos = i % 8; s = section(t); off = PROG[bar % 4]
    if s == 'groove':
        if pos in (0, 4): add(music, kick() * .9, t, 1, 0)
        if pos in (2, 6): add(music, clap() * .55, t, 1, .1); add(music, snare() * .35, t, 1, -.1)
        add(music, hat() * (.5 if pos % 2 else .3), t, 1, .3)
        add(music, bass(root + off + (12 if pos in (3, 7) else 0), E8 * .95), t, 1, 0)
        if pos in (0, 3, 5) and bar % 2 == 0: add(music, pluck(root + 24 + off + mel[(bar * 3 + pos) % 8]), t, 1, -.3)
    elif s == 'thin':
        if pos in (2, 6): add(music, snap() * .7, t, 1, .4)
        if pos % 2 == 0: add(music, bass(root + off, E8 * 1.8), t, 1, 0)
        if pos == 0: add(music, pad(root + 12 + off, 4 * BEAT), t, 1, 0)
    t += E8; i += 1
for k, m in enumerate([0, 7, 12, 15, 19, 24]): add(music, bell(root + 36 + m), endstamp + .15 + k * .09, 1, -.4 + k * .16)
add(music, pad(root + 12, DUR - endstamp), endstamp, 1, 0)

def stamp_sfx(big=False):
    n = int(.6 * SR); x = np.arange(n) / SR; f = 120 * np.exp(-x / .08) + 40
    boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, .001, .18)
    s = boom * .9 + lp(rng.standard_normal(n), 2500) * env(n, .0005, .02) * .6
    if big: s += hp(rng.standard_normal(n) * (rng.random(n) < .02), 2000) * env(n, .001, .25) * .5
    return s
for e in EV:
    k, t0 = e['type'], e['t']
    if k == 'stamp': add(fx, stamp_sfx() * .8, t0, 1, 0); add(fx, hp(click(pitch=1.2, v=1.0), 1500) * .3, t0 - .01, 1, 0)
    elif k == 'bigstamp': add(fx, stamp_sfx(True), t0, 1, 0)
    elif k == 'wipe': add(fx, lp(whoosh(.45, 1.0), 4000) * .25, t0 - .2, 1, 0)
# shutter on the opening flash, paper slide at the first exhibit, pops on each verdict card
n = int(.12 * SR); add(fx, hp(rng.standard_normal(n), 3000) * env(n, .0005, .02) * .4, 0.88, 1, .2)
for k in range(3): add(fx, pluck(root + 31 + k * 4, .2) * .7, verdict + .6 + k * .9, 1, -.3 + .3 * k)

# narration
voice = np.zeros(N); active = np.zeros(N)
for c in CUES:
    x, sr = sf.read(os.path.join(D, 'out', 'voice', c['id'] + '.wav'), dtype='float64')
    if x.ndim > 1: x = x.mean(1)
    if sr != SR: x = soxr.resample(x, sr, SR)
    i0 = int(c['t0'] * SR); j = min(N, i0 + len(x)); voice[i0:j] += x[:j - i0]; active[i0:j] = 1
voice = compress(hp(voice, 80, 2), thr=.18, ratio=3.0)
mid = np.stack([bp(music[:, c], 300, 4000, 2) for c in range(2)], 1); music = music - mid * (1 - 10 ** (-4 / 20))
duck = uniform_filter1d(active, int(.2 * SR), mode='constant'); music *= (1 - .45 * np.clip(duck * 1.4, 0, 1))[:, None]
vr = np.sqrt((voice[active > 0] ** 2).mean()); voice *= .16 / vr
mr = np.sqrt((music[active > 0] ** 2).mean()); music *= (.16 * 10 ** (-9 / 20)) / mr
out = music + fx * .5 + np.stack([voice, voice], 1)
out = out[:int(DUR * SR)]; nf = int(.4 * SR); out[-nf:] *= np.linspace(1, 0, nf)[:, None]
out = np.stack([limit(compress(out[:, c], thr=.4, ratio=2.0)) for c in range(2)], 1)
os.makedirs(os.path.join(D, 'out'), exist_ok=True); sf.write(os.path.join(D, 'out', 'mix.wav'), out.astype(np.float32), SR)
print(os.path.basename(D), f'mix {DUR:.1f}s peak {np.abs(out).max():.2f}')
