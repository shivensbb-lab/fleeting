#!/bin/sh
# One-command build of "The Great Emu War": voice → mix → picture → final film, poster and subtitles.
# Needs the Lemo-Opuscar library with its core tools and voice deps installed (sh setup.sh deps voice) and ffmpeg.
set -e
LIB=/root/lemo-opuscar
P="$(cd "$(dirname "$0")" && pwd)"
cd "$LIB"
.venv/bin/python core/tts/tts.py "$P/lines.json" "$P/voice"
.venv/bin/python core/tts/asr_check.py "$P/lines.json" "$P/voice" --lang en
.venv/bin/python "$P/mix.py" "$P"
.venv/bin/python core/render/srt.py "$P/cues.json" "$P/great-emu-war.srt"
node core/render/video.mjs "$P" --fps 24 --workers 4 --out "$P/out/video.mp4"
sh core/render/mux.sh "$P/out/video.mp4" "$P/out/mix.wav" "$P/great-emu-war.mp4" 24 0
node core/render/still.mjs "$P" 33.5 --out "$P/out" --prefix poster_ && cp "$P"/out/poster_*.jpg "$P/poster.jpg"
