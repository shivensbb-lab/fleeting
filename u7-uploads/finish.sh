#!/bin/sh
# finish.sh <project-dir> <output-name>: subtitles + final MP4 (mux with loudnorm to -14 LUFS)
set -e
LIB=/root/lemo-opuscar; P="$(cd "$1" && pwd)"; O="$2"
cd "$LIB"
.venv/bin/python core/render/srt.py "$P/cues.json" "/home/user/fleeting/u7-uploads/${O%.mp4}.srt"
sh /home/user/fleeting/u7-uploads/mux6.sh "$P/out/$( [ -f "$P/out/video.mp4" ] && echo video.mp4 || echo cake-video.mp4 )" "$P/out/mix.wav" "/home/user/fleeting/u7-uploads/$O"
