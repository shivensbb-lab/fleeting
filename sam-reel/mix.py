"""S.A.M — "The S.A.M Way": cool-jazz score + foley + voice → out/mix.wav (48 kHz stereo).
Run from $LIB:  .venv/bin/python <project>/mix.py <project>
Reads timeline.json (the film's clock) and events.json (exported from the page by events.mjs)."""
import sys, os, json
import numpy as np
import soundfile as sf
sys.path.insert(0, os.getcwd())
from core.audio import sampler as S
from core.audio import sfx as X
from core.audio.sfx import SR, add, limit, lp, hp, bp, noise, brown, t_, env_exp, norm
from scipy.ndimage import uniform_filter1d, maximum_filter1d

P = os.path.abspath(sys.argv[1])
T = json.load(open(f'{P}/timeline.json')); EV = json.load(open(f'{P}/events.json'))['ev']
DUR, BEAT, BAR = T['dur'], T['beat'], T['bar']; N = int(DUR * SR)
PT = {p['part']: p for p in T['parts']}
S.seed(2026); rng = np.random.default_rng(2026)

# ───────────────────────── score: cool-jazz combo, 120 BPM ─────────────────────────
ev = []
def n(t, inst, p, d, v, pan=0, g=1.0, **k): ev.append(dict(t=t, inst=inst, pitch=p, dur=d, vel=v, pan=pan, gain=g, **k))
CH = {  # vib voicing, bass root, walking tones
  'F6': (['F4', 'A4', 'C5', 'D5'], ['F2', 'A2', 'C3', 'E2']),
  'Bbmaj7': (['Bb3', 'D4', 'F4', 'A4'], ['Bb1', 'D2', 'F2', 'B1']),
  'C9': (['C4', 'E4', 'Bb4', 'D5'], ['C2', 'E2', 'G2', 'E2']),
  'Dm9': (['D4', 'F4', 'A4', 'C5', 'E5'], ['D2', 'F2', 'A2', 'C#2']),
  'G6': (['G4', 'B4', 'D5', 'E5'], ['G2', 'B2', 'D3', 'F#2']),
  'Cmaj7': (['C4', 'E4', 'G4', 'B4'], ['C2', 'E2', 'G2', 'C#2']),
  'D9': (['D4', 'F#4', 'C5', 'E5'], ['D2', 'F#2', 'A2', 'F#2']),
}
def comp(a, b, prog, feel='normal', mel=True, vib=True):
    """walking bass + brushes + vib comping + flute fills, whole bars from a to b"""
    k, t0 = 0, a
    while t0 + BAR <= b + 1e-3:
        c = prog[k % len(prog)]; vv, bs = CH[c]
        if feel == 'half':
            n(t0, 'contrabass_pizz', bs[0], BEAT * 1.6, .75, -.15); n(t0 + 2 * BEAT, 'contrabass_pizz', bs[2], BEAT * 1.6, .6, -.15)
        elif feel == 'double':
            for i in range(8): n(t0 + i * BEAT / 2, 'contrabass_pizz', bs[i % 4], BEAT * .45, .7 if i % 2 == 0 else .5, -.15)
        else:
            for i in range(4): n(t0 + i * BEAT, 'contrabass_pizz', bs[i], BEAT * .85, .72 if i == 0 else .58, -.15)
        # brushes: soft snare (snares off) on 2 and 4 + shaker swish on the 8ths; ride for double time
        for i in (1, 3):
            if feel != 'half' or i == 3: n(t0 + i * BEAT, 'snare', 'off', None, .32, .2, .5)
        for i in range(8):
            if feel == 'double': n(t0 + i * BEAT / 2, 'sus_cymbal', 'stick', .25, .28 if i % 2 else .38, .35, .35)
            elif i % 2 == 1 or feel == 'half': n(t0 + i * BEAT / 2 + (BEAT * .08 if i % 2 else 0), 'shaker', 'down', None, .22, .4, .3)
        # vibraphone: chord on 1 (and the "and" of 2), soft mallets
        if vib:
            for j, p in enumerate(vv): n(t0 + j * .012, 'vibraphone', p, BEAT * 1.4, .5, .25 - j * .12, .55)
            if feel != 'half':
                for j, p in enumerate(vv[:3]): n(t0 + 2.5 * BEAT, 'vibraphone', p, BEAT * .6, .38, .25 - j * .12, .45)
        # flute fill in the second bar of each two-bar phrase
        if mel and k % 2 == 1:
            line = [vv[-1], vv[-2], vv[1], vv[0]] if k % 4 == 1 else [vv[0], vv[1], vv[2], vv[-1]]
            for i, p in enumerate(line):
                q = p[:-1] + str(int(p[-1]) + 1) if int(p[-1]) < 5 else p
                n(t0 + (i * .5 + 1) * BEAT, 'flute', q, BEAT * .45, .5, .1, .5)
        k += 1; t0 += BAR

def vib_chord(t, c, v=.7, ring=2.4, arp=0.0):
    for j, p in enumerate(CH[c][0]): n(t + j * arp, 'vibraphone', p, ring, v, .3 - j * .15, .9)
    n(t, 'contrabass_pizz', CH[c][1][0], 1.2, .8, -.15)
def gliss(t, d=.45, up=True, lo=65, hi=89):
    ps = list(range(lo, hi, 2)) if up else list(range(hi, lo, -2))
    for i, m in enumerate(ps): n(t + i * d / len(ps), 'vibraphone', m, .4, .45, .3, .5)

sil = T['silences']          # [[a, b], ...] — everything out
hook, st1, st2, st3 = PT['hook'], PT['step1'], PT['step2'], PT['step3']
title_t = [e['t'] for e in EV if e['type'] == 'title']
comp(hook['t0'] + 0.0, sil[0][0], ['F6', 'C9'], mel=False)              # problem: quiet comping
gliss(title_t[0] - .45); vib_chord(title_t[0], 'F6', .8, 3.0)
comp(title_t[0] + BAR - (title_t[0] - sil[0][1]) % BAR, st1['t0'], ['F6'], mel=True)
for part, c in (('step1', 'F6'), ('step2', 'Bbmaj7'), ('step3', 'C9')):   # each step lands on its own vib chord
    p = PT[part]; vib_chord(p['t0'], c, .75)
    if part == 'step3':
        comp(p['t0'] + BAR, sil[1][0], [c, 'F6']); comp(sil[1][1] + BAR - (sil[1][1] - p['t0']) % BAR, p['t1'], [c, 'F6'])
    else: comp(p['t0'] + BAR, p['t1'], [c, 'F6' if c != 'F6' else 'C9'])
pay = PT['payoff']; gliss(pay['t0'] - .4); comp(pay['t0'], pay['t1'], ['G6', 'Cmaj7', 'D9', 'G6'], feel='double')   # up a step, double time
pr = PT['proof']; comp(pr['t0'], pr['t1'], ['Bbmaj7', 'C9', 'Bbmaj7'], feel='half', mel=False)
br = PT['branches']; comp(br['t0'], br['t1'], ['F6', 'C9'], mel=False, vib=False)
# branch medallions bring back the step chords, one each, and a fourth for AB Centre
stamps = [e for e in EV if e['type'] == 'stamp' and e['t'] >= br['t0'] and e['t'] < br['t1']]
for e, c in zip(stamps, ['F6', 'Bbmaj7', 'C9', 'Dm9']): vib_chord(e['t'], c, .7, 1.8, .03)
cta = PT['cta']; comp(cta['t0'] + BAR, cta['t1'], ['F6', 'Bbmaj7'], mel=False)
vib_chord(cta['t0'] + .1, 'F6', .8, 3.0, .02); gliss(cta['t0'] - .35)
end = PT['end']; vib_chord(end['t0'], 'F6', .7, 2.2, .06); n(end['t0'], 'flute', 'D6', 1.6, .45, .1, .5)

music = S.render(ev, DUR, master=False)
music = S.room(music, size=.4, mix=.2)

# ───────────────────────── foley (from the page's events) ─────────────────────────
fx = np.zeros((N, 2), np.float32)
def put(x, at, gain=1.0, pan=0.0): add(fx, np.asarray(x, np.float32), at, gain, pan)
def fade(x, a=.01, b=.05):
    x = np.asarray(x, np.float32).copy(); na, nb = int(a * SR), int(b * SR)
    if na: x[:na] *= np.linspace(0, 1, na)
    if nb: x[-nb:] *= np.linspace(1, 0, nb)
    return x
def clink(v=1.0):
    d = .35; tt = t_(d); f = 2600 + rng.random() * 1400
    return norm(sum(a * np.sin(2 * np.pi * f * m * tt) * env_exp(d, tau) for m, a, tau in [(1, 1, .09), (2.76, .5, .05), (5.4, .25, .03)])) * v
def slide(d=.55, up=True):
    tt = t_(d); f = (500 + 900 * (tt / d)) if up else (1400 - 900 * (tt / d)); f = f * (1 + .03 * np.sin(2 * np.pi * 7 * tt))
    return fade(np.sin(2 * np.pi * np.cumsum(f) / SR) * .6, .02, .12)
def boing():
    d = .5; tt = t_(d); f = 220 * (1 + .6 * np.exp(-tt * 6) * np.sin(2 * np.pi * 9 * tt))
    return fade(np.sin(2 * np.pi * np.cumsum(f) / SR) * env_exp(d, .25), .005, .1)
def scratch(d):
    x = bp(noise(d), 2500, 7000); tt = t_(d); am = .5 + .5 * np.abs(np.sin(2 * np.pi * 7 * tt + rng.random()))
    return fade(norm(x * am * (.7 + .3 * rng.random(len(x)))), .02, .06)
def swish(d=.3): return fade(norm(hp(X.whoosh(d, 1), 1200)), .01, .08)
def shhk(): return fade(norm(bp(noise(.22), 3000, 9000)) * np.linspace(1, .2, int(.22 * SR)), .03, .08)
def stamp(): return X.thump(1, 75) * .8 + np.pad(X.clack(.6) * .5, (0, max(0, len(X.thump(1, 75)) - len(X.clack(.6)))))[:len(X.thump(1, 75))]
def pip(f, d=.07): tt = t_(d); return fade(np.sin(2 * np.pi * f * tt) * .5, .004, .02)
for e in EV:
    t, k = e['t'], e['type']
    if k == 'stamp': put(stamp(), t, .45)
    elif k == 'marbles':
        for i in range(6): put(clink(.7 + .3 * rng.random()), t + i * .06 + rng.random() * .02, .14, rng.random() - .5)
    elif k == 'pop': put(X.pop(1), t, .16, .2)
    elif k == 'boing': put(boing(), t, .25)
    elif k == 'wipe': put(swish(), t - .05, .2, -.3)
    elif k == 'title': put(X.ding(.6), t, .08, .3)
    elif k == 'block':
        put(S.hit('woodblock', 'a', .8), t, .35, -.1)
        if e.get('n', 1) > 1: put(S.hit('woodblock', 'b', .7), t + .03, .3, .1); put(S.hit('woodblock', 'c', .6), t + .06, .25, .2)
    elif k in ('callout', 'iris'): put(shhk(), t, .18)
    elif k == 'pencil': put(scratch(e.get('d', .5)), t, .14, .1)
    elif k == 'chalk': put(scratch(.45), t, .12)
    elif k == 'check': put(stamp(), t, .4); put(X.ding(.6), t + .02, .07)
    elif k == 'count':
        d = e.get('d', 1.2)
        for i in range(12): put(pip(700 + i * 90), t + d * (1 - (1 - i / 12) ** 2), .12)
    if k == 'callout': put(slide(.5, True), t, .1)

# room tone + a quiet mantel-clock tick on the half notes
room = np.stack([lp(brown(DUR), 220), lp(brown(DUR), 220)], 1).astype(np.float32); room /= np.abs(room).max(); fx += room * .012
for i in range(int(DUR / (2 * BEAT))): put(X.click(.5, .4), i * 2 * BEAT, .025, -.6)

# ───────────────────────── voice ─────────────────────────
vo = np.zeros((N, 2), np.float32)
for s in T['shots']:
    x, sr = sf.read(f"{P}/voice/{s['id']}.wav", dtype='float32')
    if x.ndim > 1: x = x.mean(1)
    if sr != SR:
        import soxr; x = soxr.resample(x, sr, SR).astype(np.float32)
    x = hp(x, 80).astype(np.float32)
    add(vo, x, s['v0'], .5 ** .5, 0)

env = uniform_filter1d(np.abs(vo[:, 0]), int(.05 * SR))
env = maximum_filter1d((env > .01).astype(np.float32), int(.35 * SR)); env = uniform_filter1d(env, int(.12 * SR))
music *= (1 - env * (1 - 10 ** (-8 / 20)))[:, None]

# silences: music, foley and room tone all out
gate = np.ones(N, np.float32); r = int(.04 * SR)
for a, b in sil:
    sa, sb = int(a * SR), int(b * SR); gate[sa:sb] = 0
    gate[max(0, sa - r):sa] = np.linspace(1, 0, r)[-(sa - max(0, sa - r)):]
music *= gate[:, None]; fx *= gate[:, None]

sp = env > .5
rms = lambda x: float(np.sqrt(np.mean(x ** 2)) + 1e-9)
music *= (rms(vo[sp]) / rms(music[sp])) * 10 ** (-9 / 20)
print(f'voice over music during speech: {20 * np.log10(rms(vo[sp]) / rms(music[sp])):.1f} dB')
mix = vo + music + fx
mix = np.stack([limit(mix[:, 0], .27, .008), limit(mix[:, 1], .27, .008)], 1).astype(np.float32)
os.makedirs(f'{P}/out', exist_ok=True); sf.write(f'{P}/out/mix.wav', mix, SR)
json.dump([{'t0': s['v0'], 't1': min(s['t0'] + s['len'], s['v0'] + max(1.8, s['vdur'] + .6)), 'text': s['sub'].replace('*', '')} for s in T['shots']],
          open(f'{P}/cues.json', 'w'), indent=1, ensure_ascii=False)
json.dump({'instruments': sorted({e['inst'] for e in ev} | {'woodblock'})}, open(f'{P}/out/mixinfo.json', 'w'))
print(f'wrote out/mix.wav {DUR:.1f} s, {len(ev)} notes')
