#!/bin/sh
# One-command build of "The S.A.M Way" (9:16 Reel): voice → timeline → picture → events → mix → final film, subtitles, poster.
# Needs the Lemo-Opuscar library with core + voice deps and the vsco2ce and vcsl instrument samples, plus ffmpeg.
set -e
LIB=/root/lemo-opuscar
P="$(cd "$(dirname "$0")" && pwd)"
cd "$LIB"
.venv/bin/python core/tts/tts.py "$P/lines.json" "$P/voice"
.venv/bin/python core/tts/asr_check.py "$P/lines.json" "$P/voice" --lang en
python3 "$P/timeline.py"
node core/render/events.mjs "$P" --size 1080x1920
node core/render/video.mjs "$P" --fps 24 --workers 4 --size 1080x1920 --out "$P/out/video.mp4"
.venv/bin/python "$P/mix.py" "$P"
.venv/bin/python core/render/srt.py "$P/cues.json" "$P/sam-the-sam-way.srt"
sh core/render/mux.sh "$P/out/video.mp4" "$P/out/mix.wav" "$P/sam-the-sam-way.mp4" 24 3
node core/render/still.mjs "$P" 16.5 --size 1080x1920 --out "$P/out" --prefix poster_ && cp "$P/out/poster_16.5.jpg" "$P/poster.jpg"
