"""The Great Emu War: score, foley and voice → out/mix.wav (48 kHz stereo).
Run from $LIB:  .venv/bin/python <project>/mix.py <project>
Timing is the same as film.js load(): shot len = max(3.4, v+1.0), title max(4.2, v+1.6), END 4 s."""
import sys, os, json
import numpy as np
import soundfile as sf
sys.path.insert(0, os.getcwd())
from core.audio import sampler as S
from core.audio import sfx as X
from core.audio.sfx import SR, add, limit, lp, hp, bp, noise, brown, t_, env_exp, norm

P = os.path.abspath(sys.argv[1])
LINES = json.load(open(f'{P}/lines.json'))
DURS = json.load(open(f'{P}/voice/dur.json'))
END, VOFF = 4.0, 0.25
t = 0; SH = []
for l in LINES:
    v = DURS.get(l['id'], 3.6)
    ln = max(4.2, v + 1.6) if l['id'] == 'title' else max(3.4, v + 1.0)
    SH.append({**l, 't0': t, 'len': ln, 'vdur': v}); t += ln
TOTAL = t + END
N = int(TOTAL * SR)
by = {s['shot']: s for s in SH}
def T(shot): return by[shot]['t0']
def E(shot): return by[shot]['t0'] + by[shot]['len']
S.seed(1932); rng = np.random.default_rng(1932)

# ───────────────────────── score ─────────────────────────
ev = []
def n(t, inst, p, d, v, pan=0, g=1.0, **k): ev.append(dict(t=t, inst=inst, pitch=p, dur=d, vel=v, pan=pan, gain=g, **k))
MAJ = [('C', 'E', 'G', 'D'), ('A', 'C', 'E', 'B'), ('F', 'A', 'C', 'G'), ('G', 'B', 'D', 'A')]   # root, 3rd, 5th, 2nd
MIN = [('D', 'F', 'A', 'E'), ('Bb', 'D', 'F', 'C'), ('C', 'E', 'G', 'D'), ('A', 'C#', 'E', 'B')]
MEL = [(0, 1, 5), (2, 2, 5), (3, 1, 5), (5, 0, 5), (6, 3, 5)]   # (eighth, chord tone index, octave)

def section(a, b, bpm, prog, kind, mel=True):
    """kind: 'light' | 'pluck' | 'invade' | 'march' | 'ambush' | 'theme'"""
    beat = 60 / bpm; bar = 4 * beat; e8 = beat / 2
    k = 0; t0 = a
    while t0 + bar <= b + 0.01:
        ch = prog[k % len(prog)]; r, th, fi, se = ch
        bass = 'tuba_stac' if kind in ('march', 'ambush') else 'contrabass_pizz'
        # oom-pah bass
        for i in range(4):
            p = (r if i % 2 == 0 else fi) + ('2' if kind in ('march', 'ambush') else '2')
            n(t0 + i * beat, bass, p, beat * .6, .72 if i % 2 == 0 else .55, -.1, .9)
        # off-beat chord stabs
        for i in range(4):
            n(t0 + i * beat + e8, 'violas_pizz', th + '4', e8, .45, .25, .55)
        # melody (every other phrase of 4 bars rests, so the voice has room)
        if mel and (k // 4) % 2 == 0:
            inst = {'light': 'violins_pizz', 'pluck': 'violins_pizz', 'invade': 'clarinet_stac', 'march': 'trumpet_stac',
                    'ambush': 'violins_spic', 'theme': 'violins_pizz'}[kind]
            for pos, ti, o in MEL:
                if kind == 'theme' and k % 4 == 3 and pos == 6: continue
                n(t0 + pos * e8, inst, ch[[0, 1, 2, 3][ti]] + str(o), e8 * .9, .62, .15, .75 if inst == 'trumpet_stac' else .9)
                if kind in ('light', 'theme'):
                    n(t0 + pos * e8, 'piccolo', ch[ti] + '6', e8 * .5, .35, .3, .25)
        # percussion
        if kind in ('pluck', 'invade', 'theme', 'light'):
            for i in range(4): n(t0 + i * beat + e8, 'claves', None, None, .4, -.3, .45)
        if kind in ('march', 'theme'):
            for i in range(8):
                v = .55 if i % 2 == 0 else .3
                n(t0 + i * e8, 'snare', 'on', None, v, .1, .5)
            n(t0 + bar - e8 / 2, 'snare', 'on', None, .35, .1, .4)
        if kind == 'ambush':
            for i in range(16):
                n(t0 + i * e8 / 2, 'snare', 'on', None, .6 if i % 4 == 0 else .35, .1, .55)
            n(t0, 'bass_drum', None, None, .7, 0, .8); n(t0 + 2 * beat, 'bass_drum', None, None, .6, 0, .7)
            if k % 4 == 3: n(t0 + 3 * beat, 'timpani', 'A2', .8, .7, 0, .7)
        k += 1; t0 += bar
    return t0  # where the music actually stopped (whole bars)

def pad(a, b, chords, inst='cellos', oct_='3', g=.55):
    step = (b - a) / len(chords)
    for i, ch in enumerate(chords):
        for j, p in enumerate(ch):
            n(a + i * step, inst if j == 0 else 'violins', p, step + .4, .45, (-.3, .3, 0)[j % 3], g if j == 0 else g * .6, attack=.8, release=1.2)

def button(t, key='C'):
    """the comic button: low pizz + snare flam + high pizz"""
    n(t, 'contrabass_pizz', key + '2', .3, .8, 0, 1.0); n(t, 'violins_pizz', key + '5', .3, .8, .2, 1.0)
    n(t - .03, 'snare', 'on', None, .4, .1, .5); n(t, 'snare', 'on', None, .7, .1, .6)

# Cold open: light theme from the horde to the headline; stop dead for the stamp (silence 1)
section(T('field_fist') + .3, T('myth_stamp'), 100, MAJ, 'light')
button(T('emu_smug') + .2)
# Title flourish
for i, p in enumerate(['C5', 'E5', 'G5', 'C6']): n(T('title') + .15 + i * .09, 'violins_pizz', p, .2, .7, .2, 1.0)
n(T('title') + .5, 'timpani', 'C3', 1.2, .8, 0, .8)
# Farmers
end = section(T('ship_home') + .4, T('emu_fine'), 100, MAJ, 'pluck')
button(T('emu_fine') + by['emu_fine']['vdur'] + .35)
# Invasion
section(T('migration_map') + .2, T('meredith_intro'), 100, MAJ, 'invade')
# Operation: march
section(T('meredith_intro'), T('emu_fine2'), 100, MAJ, 'march')
button(T('emu_fine2') + by['emu_fine2']['vdur'] + .35)
# Ambush: fast march, minor
section(T('dam'), E('fence_crash'), 132, MIN, 'ambush')
button(E('fence_crash') - .5, 'D')
# Retreat: half-time, sparse, then out on the withdrawal (silence 2)
section(T('guerrilla'), T('withdraw'), 66, MIN, 'pluck', mel=False)
# Round two: march returns
section(T('complain') + .2, T('respect'), 100, MAJ, 'march')
# Dusk + Meredith's quote: one sustained pad
pad(T('respect'), E('quote2'), [('A2', 'C4', 'E4'), ('F2', 'A3', 'C4'), ('C3', 'E4', 'G4'), ('G2', 'B3', 'D4')])
section(T('leave'), E('leave'), 100, MAJ, 'pluck', mel=False)
# Verdict: full theme, stop before "and what about the emus?" tail; button on "fine"
section(T('who_won'), T('and_emus'), 100, MAJ, 'theme')
ff = by['final_fine']
fine_t = ff['t0'] + VOFF + ff['vdur'] - .25
button(fine_t + .25)
pad(fine_t + .3, TOTAL - .3, [('C3', 'E4', 'G4')], g=.4)

music = S.render(ev, TOTAL, master=False)
music = S.room(music, size=.35, mix=.18)

# ───────────────────────── foley ─────────────────────────
fx = np.zeros((N, 2), np.float32)
def put(x, at, g=1.0, pan=0.0): add(fx, np.asarray(x, np.float32), at, g, pan)
def gun(v=1.0):
    d = .09; x = hp(noise(d), 900) * env_exp(d, .012) + np.sin(2 * np.pi * 95 * t_(d)) * env_exp(d, .02) * .8
    return norm(x) * v
def burst(at, dur, rate, g=.5, pan=-.2):
    k = 0
    while k / rate < dur:
        put(gun(.7 + .3 * rng.random()), at + k / rate + rng.random() * .01, g, pan); k += 1
def engine(d, v=1.0, f=36):
    tt = t_(d); saw = 2 * ((tt * f * (1 + .04 * np.sin(2 * np.pi * 3 * tt))) % 1) - 1
    x = lp(saw, 500) * (1 + .4 * np.sin(2 * np.pi * 11 * tt)) + lp(brown(d), 300) * .5
    return norm(x) * v
def fade(x, a=.3, b=.6):
    x = np.asarray(x, np.float32).copy(); na, nb = int(a * SR), int(b * SR)
    if na: x[:na] *= np.linspace(0, 1, na)
    if nb: x[-nb:] *= np.linspace(1, 0, nb)
    return x
def horn(d=1.6):
    tt = t_(d); x = sum((2 * ((tt * f) % 1) - 1) for f in (110, 138.6)); return fade(norm(lp(x, 700)), .08, .5)
def coin(v=1.0):
    d = .45; tt = t_(d); return norm(sum(a * np.sin(2 * np.pi * f * tt) * env_exp(d, tau) for f, a, tau in [(2950, 1, .12), (4120, .6, .08), (6200, .3, .05)])) * v
def paper(v=1.0, d=.28):
    return norm(bp(noise(d), 1500, 7000) * np.sin(np.pi * t_(d) / d) ** 2 * (1 + rng.random(int(round(d * SR))) * .3)) * v
def tick(v=1.0): return X.click(1.4, v)
def slide_down(d=1.6):
    tt = t_(d); f = 1400 * (1 - .75 * tt / d); return fade(np.sin(2 * np.pi * np.cumsum(f) / SR) * .6, .02, .3)
def bed(kind, a, b, g):
    d = b - a
    if d <= 0: return
    if kind == 'wind':
        x = bp(brown(d), 150, 1400); tt = t_(d); x = norm(x) * (.7 + .3 * np.sin(2 * np.pi * tt / 7.3 + 1))
    elif kind == 'rain':
        x = norm(lp(hp(noise(d), 2500), 9000)) * .6; drops = (rng.random(len(x)) > .9993).astype(float)
        x = x + lp(drops, 3000) * 8
    elif kind == 'sea':
        tt = t_(d); x = norm(lp(brown(d), 900)) * (.55 + .45 * np.sin(2 * np.pi * tt / 4.5) ** 2)
    st = np.stack([x, np.roll(x, 2400)], 1).astype(np.float32) * g
    st = np.stack([fade(st[:, 0], .6, .6), fade(st[:, 1], .6, .6)], 1)
    s = int(a * SR); e = min(N, s + len(st)); fx[s:e] += st[:e - s]

# Ambience: wind everywhere outdoors, except the two hard silences
SIL = [(T('myth_stamp'), T('myth_stamp') + .78),                                  # stamp drop-out
       (ff['t0'] - .95, ff['t0'] + .05)]                                            # before "fine"
bed('wind', 0, T('ship_home'), .05)
bed('sea', T('ship_home'), T('official_land'), .09)
bed('wind', T('official_land'), T('rain'), .045)
bed('rain', T('rain'), E('rain') + .5, .10)
bed('wind', E('rain'), TOTAL - END + 1, .045)

# Cut transitions: a whoosh on every scene change
prev = None
for s in SH:
    if prev and s['scene'] != prev: put(X.whoosh(.45, 1), s['t0'] - .3, .12)
    prev = s['scene']

# Shot foley (times match the drawing in film.js)
for i in range(26): put(X.thump(.6 + .4 * rng.random(), 60 + rng.random() * 30), T('emu_horde') + .2 + i * .14 + rng.random() * .05, .16, rng.random() * 1.6 - .8)
put(paper(), T('headline') + .1, .18)
put(X.thump(1, 55), T('myth_stamp') + .78, .55); put(X.clack(.7), T('myth_stamp') + .78, .3)
put(X.thump(1, 55), T('not_war') + .58, .5); put(X.clack(.7), T('not_war') + .58, .28)
put(X.whoosh(.5), T('title') - .1, .25)
put(horn(), T('ship_home') + .3, .2, -.3)
for k in range(4): put(coin(.8), T('price_crash') + .1 + k * .07, .1, .3)
put(slide_down(), T('price_crash') + .3, .12)
put(paper(), T('empty_promise') + .2, .2)
for k in range(5): put(X.pop(.6), T('emu_peek') + .5 + k * .05, .04)
for k in range(int(by['emus_eat']['len'] * 2)):
    for j in range(3): put(X.click(.6 + rng.random() * .3, .7), T('emus_eat') + k * .5 + j * .05 + rng.random() * .1, .12, rng.random() * 1.4 - .7)
put(X.creak(1), T('fence_rabbits') + .4, .3); put(X.crash(.8), T('fence_rabbits') + .7, .2)
for k in range(6): put(X.step(.6), T('emus_march') + .2 + k * .4, .12, -.4 + k * .15)
put(X.thump(.9, 80), T('farmer_guns') + .3, .2)
put(X.thump(.8, 70), T('deal') + .4, .2)
for k in range(5): put(paper(.8, .12), T('calendar') + .3 + k * .35, .15)
for k in range(4): put(gun(.7), T('far_flock') + 1.2 + k * .7, .12, -.5)
burst(T('miss') + .2, min(2.2, by['miss']['len'] - .6), 6, .32)
for k in range(12): put(X.pop(.7), T('twelve') + .2 + k * .12, .1, -.5 + k * .08)
burst(T('fire') + .15, 1.1, 7, .45); burst(T('fire') + 1.6, min(1.4, by['fire']['len'] - 1.9), 7, .45)
burst(T('jam'), .55, 7, .45); put(X.clack(.45), T('jam') + .6, .5); put(X.thump(1, 120), T('jam') + .6, .35); put(X.clack(.35), T('jam') + .72, .4)
for k in range(10): put(X.step(.5), T('flee') + .1 + k * .2, .1, .3)
put(X.ding(.6), T('truck_idea') + .4, .08)
eng_a, eng_b = T('truck_chase'), E('fence_crash') - .2
put(fade(engine(eng_b - eng_a), .3, .3), eng_a, .22)
for k in range(int(by['bounce']['len'] / .52)): put(X.thump(.8, 65), T('bounce') + .1 + k * .52, .3)
for k in range(3): put(X.creak(.8), T('steering') + .3 + k * .7, .15)
put(X.crash(1), T('fence_crash') + .78, .5); put(X.thump(1, 50), T('fence_crash') + .78, .5)
for k in range(3): put(paper(), T('papers') + k * .5, .2, -.4 + k * .4)
put(X.thump(1, 90), T('parliament') + .5, .3); put(X.clack(.6), T('parliament') + .5, .3); put(X.clack(.6), T('parliament') + .75, .25)
wd = by['withdraw']['len']; put(fade(engine(wd + .5, f=32), .2, wd * .8), T('withdraw'), .2)
for k in range(25): put(tick(.6), T('tally') + k * .08, .08)
put(fade(engine(2.6), .2, 1.0), T('return'), .2)
for k in range(20): put(tick(.6), T('weekly') + .3 + k * .1, .07)
for k in range(10): put(X.pop(.7), T('per_emu') + .2 + k * .12, .1, -.3 + k * .06)
put(fade(engine(3.2), .2, 2.0), T('leave'), .18)
for k in range(6): put(coin(.9), T('bounty') + .4 + k * .25, .14, .3)
for k in range(27): put(tick(.6), T('bounty_count') + k * .08, .07)
for k in range(5): put(X.thump(.7, 85), T('barrier_fence') + .4 + k * .6, .18, -.6 + k * .3)

# ───────────────────────── voice ─────────────────────────
vo = np.zeros((N, 2), np.float32)
for s in SH:
    x, sr = sf.read(f"{P}/voice/{s['id']}.wav", dtype='float32')
    if x.ndim > 1: x = x.mean(1)
    if sr != SR:
        import soxr; x = soxr.resample(x, sr, SR).astype(np.float32)
    x = hp(x, 80).astype(np.float32)
    g, pan = 1.0, 0.0
    if s['voice'] != 'bm_george': pan = .12
    st = S.room(x, size=.5, mix=.22) if s['shot'] in ('quote1', 'quote2') else np.stack([x, x], 1)
    s0 = int((s['t0'] + VOFF) * SR); e = min(N, s0 + len(st)); vo[s0:e] += st[:e - s0] * g

# Ducking: music −8 dB under speech (40 ms attack, 350 ms release)
from scipy.ndimage import uniform_filter1d, maximum_filter1d
env = uniform_filter1d(np.abs(vo[:, 0]), int(.05 * SR))
env = maximum_filter1d((env > .01).astype(np.float32), int(.35 * SR))
env = uniform_filter1d(env, int(.12 * SR))
duck = 1 - env * (1 - 10 ** (-8 / 20))
music *= duck[:, None]

# Hard silences: music + ambience out
gate = np.ones(N, np.float32)
for a, b in SIL:
    sa, sb = int(a * SR), int(b * SR); r = int(.06 * SR)
    gate[sa:sb] = 0; gate[max(0, sa - r):sa] = np.linspace(1, 0, min(r, sa)); gate[sb:sb + r] = np.minimum(gate[sb:sb + r], np.linspace(0, 1, r))
# withdrawal: music out (it's already silent), fade the retreat pluck so it doesn't cut
music *= gate[:, None]
fx_g = gate.copy()
# stamp thuds land on the gate end, keep them
fx *= fx_g[:, None]

# Level music so the voice sits ~10 dB above it during speech
sp = env > .5
def rms(x): return float(np.sqrt(np.mean(x ** 2)) + 1e-9)
vr, mr = rms(vo[sp]), rms(music[sp])
music *= (vr / mr) * 10 ** (-10 / 20)
print(f'voice/music during speech: {20 * np.log10(rms(vo[sp]) / rms(music[sp])):.1f} dB')

mix = vo + music + fx
mix = np.stack([limit(mix[:, 0], .40, .008), limit(mix[:, 1], .40, .008)], 1).astype(np.float32)  # peaks tamed so loudnorm to −14 LUFS keeps true peak ≤ −1.2 dB
os.makedirs(f'{P}/out', exist_ok=True)
sf.write(f'{P}/out/mix.wav', mix, SR)
json.dump([{'t0': s['t0'] + VOFF, 't1': s['t0'] + VOFF + s['vdur'] + .3, 'text': s['sub'].replace('*', '')} for s in SH],
          open(f'{P}/cues.json', 'w'), indent=1, ensure_ascii=False)
json.dump({'instruments': sorted({e['inst'] for e in ev}), 'total': TOTAL}, open(f'{P}/out/mixinfo.json', 'w'))
print(f'wrote out/mix.wav  {TOTAL:.2f} s, {len(ev)} notes')
