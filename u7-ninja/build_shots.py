"""lines.json + voice/dur.json → src/data/shots.json (each shot = its voice line + a beat) and cues.json for the .srt"""
import json, os, sys
P = os.path.dirname(os.path.abspath(__file__)); FPS = 30
L = json.load(open(f'{P}/lines.json')); D = json.load(open(f'{P}/voice/dur.json'))
shots, cues, t = [], [], 0.0
for i, l in enumerate(L):
    sec = max(2.2, D[l['id']] + 0.55) + (0.4 if i == len(L) - 1 else 0)
    fr = round(sec * FPS); shots.append({'id': l['id'], 'text': l['sub'], 'frames': fr})
    cues.append({'t0': t + 0.1, 't1': t + fr / FPS - 0.05, 'text': l['sub'].replace('*', '')}); t += fr / FPS
json.dump({'fps': FPS, 'shots': shots}, open(f'{P}/src/data/shots.json', 'w'), indent=1, ensure_ascii=False)
json.dump(cues, open(f'{P}/cues.json', 'w'), indent=1, ensure_ascii=False)
print(f'{os.path.basename(P)}: {t:.1f} s, {len(shots)} shots')
