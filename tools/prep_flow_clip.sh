#!/bin/bash
# Clean a Google Flow (Veo 3.1, 1080x1920) clip for a reel: cover the Gemini sparkle (baked in from a Nano Banana
# start frame) with a soft-edged patch cloned from just left of it, crop off the "Veo" text mark, 1080x1920 30 fps.
#   tools/prep_flow_clip.sh IN OUT START DURATION [slow] [hflip]
#   slow = stretch factor (e.g. 2.05, motion-interpolated); hflip = 1 to mirror (the crop then keeps the left side clean).
set -e
IN=$1 OUT=$2 SS=$3 T=$4 SLOW=${5:-1} FLIP=${6:-0}
P="split[m][s];[s]crop=110:120:766:1716,format=rgba,geq=r='r(X,Y)':g='g(X,Y)':b='b(X,Y)':a='255*min(1,min(min(X,W-1-X),min(Y,H-1-Y))/18)'[p];[m][p]overlay=876:1716"
CROP="crop=1010:1796:8:62"; [ "$FLIP" = 1 ] && CROP="hflip,crop=1010:1796:62:62"
SP=""; [ "$SLOW" != 1 ] && SP=",setpts=(PTS-STARTPTS)*$SLOW,minterpolate=fps=30:mi_mode=mci:mc_mode=aobmc"
END=$(python3 -c "print($SS+$T/$SLOW+0.15)")
ffmpeg -v error -y -i "$IN" -filter_complex "[0:v]trim=$SS:$END,setpts=PTS-STARTPTS,$P,$CROP$SP,scale=1080:1920:flags=lanczos,fps=30[v]" \
  -map "[v]" -t "$T" -an -c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p "$OUT"
ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT"
