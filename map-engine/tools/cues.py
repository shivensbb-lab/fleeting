"""Lay the narration on the film timeline: each line starts `pre` seconds after the previous one ends.
<film>/voice/lines.json + <film>/out/voice/dur.json -> <film>/voice/cues.json ({dur, cues:[{id,t0,t1,vo_end,text}]})
Subtitles hold until just before the next line, never shorter than max(1.8 s, spoken + 0.6 s)."""
import json, os, sys
F = sys.argv[1]; TAIL = float(sys.argv[2]) if len(sys.argv) > 2 else 3.0
L = json.load(open(os.path.join(F, 'voice', 'lines.json'))); D = json.load(open(os.path.join(F, 'out', 'voice', 'dur.json')))
t = 0.0; cues = []
for l in L:
    t += l.get('pre', .5); d = D[l['id']]
    cues.append({'id': l['id'], 't0': round(t, 3), 'vo_end': round(t + d, 3), 'text': l['sub']}); t += d
for i, c in enumerate(cues):
    nxt = cues[i + 1]['t0'] - .08 if i + 1 < len(cues) else c['vo_end'] + 1.6
    c['t1'] = round(max(nxt, c['t0'] + max(1.8, c['vo_end'] - c['t0'] + .6)), 3)
dur = round(cues[-1]['vo_end'] + TAIL, 2)
json.dump({'dur': dur, 'cues': cues}, open(os.path.join(F, 'voice', 'cues.json'), 'w'), indent=1, ensure_ascii=False)
print(os.path.basename(F), 'dur', dur, ' '.join(f"{c['id']}@{c['t0']}" for c in cues))
