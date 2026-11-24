#!/bin/sh
# wait for each film's picture, then mix + master + subtitles
for pair in hannibal:hannibal-crosses-the-alps dday:dday-five-beaches napoleon:napoleon-1812-march; do
  f=${pair%%:*}; o=${pair##*:}; D=/home/user/fleeting/map-$f
  while [ ! -f $D/out/video.mp4 ] || [ -f $D/out/video.mp4.lock ]; do sleep 60; done
  sleep 20
  cd /root/lemo-opuscar && .venv/bin/python /home/user/fleeting/map-engine/mix.py $D && cd $D && sh ../u7-uploads/mux6.sh out/video.mp4 out/mix.wav $o.mp4 && \
  /root/lemo-opuscar/.venv/bin/python -c "
import json
c=json.load(open('voice/cues.json'))['cues']
def ts(t): h=int(t//3600); m=int(t%3600//60); s=t%60; return f'{h:02d}:{m:02d}:{int(s):02d},{int(round((s-int(s))*1000)):03d}'
open('subtitles_en.srt','w').write('\n'.join(f\"{i+1}\n{ts(x['t0'])} --> {ts(x['t1'])}\n{x['text']}\n\" for i,x in enumerate(c)))"
  echo "$f finished $?"
done
