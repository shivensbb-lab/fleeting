"""Builds timeline.json from lines.json + voice/dur.json. Film and mix both read it (one clock).
120 BPM, bar = 2 s. Each line gets whole bars: ceil((voice + 0.8) / bar) + extra bars."""
import json, math, os, sys
P = os.path.dirname(os.path.abspath(__file__))
L = json.load(open(f'{P}/lines.json')); D = json.load(open(f'{P}/voice/dur.json'))
BPM = 120; BEAT = 60 / BPM; BAR = 4 * BEAT
EXTRA = {'h4': 1, 'pay': 1, 'cta': 1}          # bars added for title, payoff, last branch, CTA hold
VOFF = {'h4': 2 * BEAT, 's3c': 2 * BEAT}                 # silence A before "Tricky?", silence B before "1 unit = 6"
t = 0.0; shots = []
for l in L:
    v = D[l['id']]; off = VOFF.get(l['id'], 0.25)
    bars = math.ceil((v + off + 0.55) / BAR) + EXTRA.get(l['id'], 0)
    shots.append({'id': l['id'], 'part': l['part'], 'sub': l['sub'], 't0': t, 'len': bars * BAR, 'v0': t + off, 'vdur': v})
    t += bars * BAR
END = BAR
parts = []
for s in shots:
    if not parts or parts[-1]['part'] != s['part']: parts.append({'part': s['part'], 't0': s['t0'], 't1': s['t0'] + s['len']})
    else: parts[-1]['t1'] = s['t0'] + s['len']
parts.append({'part': 'end', 't0': t, 't1': t + END})
json.dump({'bpm': BPM, 'beat': BEAT, 'bar': BAR, 'dur': t + END, 'shots': shots, 'parts': parts,
           'silences': [[shots[i]['t0'], shots[i]['v0']] for i, s in enumerate(shots) if s['id'] in VOFF]},
          open(f'{P}/timeline.json', 'w'), indent=1)
print(f'dur {t + END:.1f} s'); [print(f"{p['part']:9s} {p['t0']:6.1f}-{p['t1']:6.1f}") for p in parts]
