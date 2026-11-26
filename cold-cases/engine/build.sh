#!/bin/sh
# build one cold case: sh engine/build.sh <case> <output-name> <seed>
set -e
LIB=/root/lemo-opuscar; HERE=$(cd "$(dirname "$0")/.." && pwd); D=$HERE/$1; O=$2; SEED=${3:-1}
cp $HERE/engine/index.html $D/index.html; mkdir -p $D/fonts $D/out; cp $HERE/engine/fonts/* $D/fonts/
cd $LIB
node core/render/events.mjs $D --size 1080x1920 > $D/out/events.log 2>&1
node core/render/video.mjs $D --fps 30 --workers 3 --size 1080x1920 --out $D/out/video.mp4 > $D/out/render.log 2>&1
.venv/bin/python $HERE/engine/mix.py $D $SEED
cd $D && sh /home/user/fleeting/u7-uploads/mux6.sh out/video.mp4 out/mix.wav tmp_final.mp4 > out/mux.log 2>&1 && mv tmp_final.mp4 $O.mp4
$LIB/.venv/bin/python -c "
import json
c=json.load(open('$D/voice/cues.json'))['cues']
def ts(t): h=int(t//3600); m=int(t%3600//60); s=t%60; return f'{h:02d}:{m:02d}:{int(s):02d},{int(round((s-int(s))*1000)):03d}'
open('$D/subtitles_en.srt','w').write('\n'.join(f\"{i+1}\n{ts(x['t0'])} --> {ts(x['t1'])}\n{x['text'].replace('*','')}\n\" for i,x in enumerate(c)))"
grep LUFS $D/out/mux.log; echo "$1 done"
