#!/bin/sh
# render picture + events for each film given (sequential, 3 workers each)
cd /root/lemo-opuscar
for f in "$@"; do
  D=/home/user/fleeting/map-$f; mkdir -p $D/out
  node core/render/events.mjs $D --size 1080x1920 > $D/out/events.log 2>&1
  node core/render/video.mjs $D --fps 24 --workers 3 --size 1080x1920 --out $D/out/video.mp4 > $D/out/render.log 2>&1
  echo "$f exit $?"
done
