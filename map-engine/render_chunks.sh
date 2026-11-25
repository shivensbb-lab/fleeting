#!/bin/sh
# resumable render in 2 s chunks named by start/end (tenths of a second); skips finished chunks and finished films.
f=$1; o=$2; D=/home/user/fleeting/map-$f; C=$D/out/chunks; mkdir -p $C
[ -s $D/$o.mp4 ] && { echo "$f already done"; exit 0; }
PY=/root/lemo-opuscar/.venv/bin/python
DUR10=$($PY -c "import json;print(round(json.load(open('$D/voice/cues.json'))['dur']*10))")
cd /root/lemo-opuscar
[ -f $D/events.json ] || node core/render/events.mjs $D --size 1080x1920 > $D/out/events.log 2>&1
a=0; : > $C/list.txt
while [ $a -lt $DUR10 ]; do
  A=$(printf %05d $a); ex=$(ls $C/k_${A}_*.mp4 2>/dev/null | head -1)
  if [ -n "$ex" ]; then b=$(basename $ex .mp4 | cut -d_ -f3 | sed 's/^0*//'); [ -z "$b" ] && b=0
  else
    b=$((a + 20)); [ $b -gt $DUR10 ] && b=$DUR10; B=$(printf %05d $b)
    rm -f $C/tmp.mp4 $C/tmp.mp4.lock
    node core/render/video.mjs $D --q "t0=$($PY -c "print($a/10)")&t1=$($PY -c "print($b/10)")" --fps 24 --workers 3 --size 1080x1920 --out $C/tmp.mp4 > $C/log.txt 2>&1 || exit 1
    mv $C/tmp.mp4 $C/k_${A}_${B}.mp4; ex=$C/k_${A}_${B}.mp4
  fi
  echo "file '$(basename $ex)'" >> $C/list.txt; a=$b
done
ffmpeg -v error -y -f concat -safe 0 -i $C/list.txt -c copy $D/out/video.mp4
.venv/bin/python /home/user/fleeting/map-engine/mix.py $D && cd $D && sh ../u7-uploads/mux6.sh out/video.mp4 out/mix.wav $o.mp4 > out/mux.log 2>&1
$PY -c "
import json
c=json.load(open('$D/voice/cues.json'))['cues']
def ts(t): h=int(t//3600); m=int(t%3600//60); s=t%60; return f'{h:02d}:{m:02d}:{int(s):02d},{int(round((s-int(s))*1000)):03d}'
open('$D/subtitles_en.srt','w').write('\n'.join(f\"{i+1}\n{ts(x['t0'])} --> {ts(x['t1'])}\n{x['text']}\n\" for i,x in enumerate(c)))"
echo "$f done"
