#!/bin/sh
# resumable render: 5 s chunks (120 frames) via the page's t0/t1, skip finished chunks, concat, then mix + master + srt.
# usage: sh map-engine/render_chunks.sh <film> <output-name>
f=$1; o=$2; D=/home/user/fleeting/map-$f; C=$D/out/chunks; mkdir -p $C
DUR=$(/root/lemo-opuscar/.venv/bin/python -c "import json;print(json.load(open('$D/voice/cues.json'))['dur'])")
cd /root/lemo-opuscar
[ -f $D/events.json ] || node core/render/events.mjs $D --size 1080x1920 > $D/out/events.log 2>&1
a=0; i=0; : > $C/list.txt
while /root/lemo-opuscar/.venv/bin/python -c "import sys; sys.exit(0 if $a < $DUR - 0.01 else 1)"; do
  b=$(/root/lemo-opuscar/.venv/bin/python -c "print(min($a + 5, $DUR))")
  n=$(printf %03d $i)
  if [ ! -s $C/c_$n.mp4 ]; then
    rm -f $C/c_$n.mp4.lock $C/tmp_$n.mp4 $C/tmp_$n.mp4.lock
    node core/render/video.mjs $D --q "t0=$a&t1=$b" --fps 24 --workers 3 --size 1080x1920 --out $C/tmp_$n.mp4 > $C/log_$n.txt 2>&1 && mv $C/tmp_$n.mp4 $C/c_$n.mp4
  fi
  echo "file 'c_$n.mp4'" >> $C/list.txt
  a=$b; i=$((i + 1))
done
ffmpeg -v error -y -f concat -safe 0 -i $C/list.txt -c copy $D/out/video.mp4
.venv/bin/python /home/user/fleeting/map-engine/mix.py $D && cd $D && sh ../u7-uploads/mux6.sh out/video.mp4 out/mix.wav $o.mp4 > out/mux.log 2>&1
/root/lemo-opuscar/.venv/bin/python -c "
import json
c=json.load(open('$D/voice/cues.json'))['cues']
def ts(t): h=int(t//3600); m=int(t%3600//60); s=t%60; return f'{h:02d}:{m:02d}:{int(s):02d},{int(round((s-int(s))*1000)):03d}'
open('$D/subtitles_en.srt','w').write('\n'.join(f\"{i+1}\n{ts(x['t0'])} --> {ts(x['t1'])}\n{x['text']}\n\" for i,x in enumerate(c)))"
echo "$f done"
