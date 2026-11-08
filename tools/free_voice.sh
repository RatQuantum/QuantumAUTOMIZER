#!/bin/bash
# Free Tamil voice (Microsoft Edge neural TTS via edge-tts) with a polish chain so it sounds less flat.
# The user, 7 Nov: "Use free voice instead of ElevenLabs".
#   tools/free_voice.sh ROLE "TEXT" OUT.wav [VOICE]
#   ROLE narrator: deep storyteller (default voice ta-IN-ValluvarNeural), a slightly deeper tone, warm low end, a hall.
#   ROLE krishna:  warm and close (default voice ta-MY-SuryaNeural), a softer, shorter room.
#   ROLE narrator_en / krishna_en: the same in English (defaults en-US-ChristopherNeural / en-US-AndrewMultilingualNeural).
# Male Tamil voices: ta-IN-ValluvarNeural, ta-LK-KumarNeural, ta-MY-SuryaNeural, ta-SG-AnbuNeural.
# Needs: python3 -m venv /home/user/gc-venv && /home/user/gc-venv/bin/pip install edge-tts
# edge-tts ignores the proxy environment, so the proxy is passed explicitly.
set -e
ROLE=$1 TEXT=$2 OUT=$3
case $ROLE in
  narrator) VOICE=${4:-ta-IN-ValluvarNeural}; RATE=-18%; PITCH=-10Hz; SHIFT=0.95
            FX="highpass=f=70,equalizer=f=130:t=q:w=1:g=3.5,equalizer=f=3200:t=q:w=1.2:g=2,equalizer=f=7500:t=q:w=1:g=-3,acompressor=threshold=-20dB:ratio=3:attack=8:release=120:makeup=2,aecho=0.85:0.55:70|140:0.22|0.12" ;;
  krishna)  VOICE=${4:-ta-MY-SuryaNeural}; RATE=-15%; PITCH=-6Hz; SHIFT=0.97
            FX="highpass=f=80,equalizer=f=220:t=q:w=1:g=2.5,equalizer=f=2800:t=q:w=1.2:g=1.5,equalizer=f=7000:t=q:w=1:g=-4,acompressor=threshold=-22dB:ratio=2.5:attack=10:release=150:makeup=2,aecho=0.8:0.4:40|90:0.18|0.08" ;;
  # English (the user, 7 Nov: "Use English voice, the most popular and widely used English voices")
  narrator_en) VOICE=${4:-en-US-ChristopherNeural}; RATE=-3%; PITCH=-5Hz; SHIFT=0.97
            FX="highpass=f=70,equalizer=f=130:t=q:w=1:g=3,equalizer=f=3200:t=q:w=1.2:g=1.5,equalizer=f=7500:t=q:w=1:g=-3,acompressor=threshold=-20dB:ratio=3:attack=8:release=120:makeup=2,aecho=0.85:0.5:70|140:0.2|0.1" ;;
  krishna_en) VOICE=${4:-en-US-AndrewMultilingualNeural}; RATE=-12%; PITCH=-4Hz; SHIFT=0.98
            FX="highpass=f=80,equalizer=f=220:t=q:w=1:g=2,equalizer=f=2800:t=q:w=1.2:g=1.5,equalizer=f=7000:t=q:w=1:g=-4,acompressor=threshold=-22dB:ratio=2.5:attack=10:release=150:makeup=2,aecho=0.8:0.4:40|90:0.16|0.07" ;;
  # "Divine" Krishna: an ORIGINAL calm style (slow, deep, soft, spacious), not a copy of any actor or dubbing artist.
  # Split phrases with "|" to get long, deliberate pauses between them.
  krishna_divine)    VOICE=${4:-ta-MY-SuryaNeural}; RATE=-26%; PITCH=-9Hz; SHIFT=0.95; GAP=0.75
            FX="highpass=f=75,equalizer=f=180:t=q:w=1:g=3,equalizer=f=2600:t=q:w=1.2:g=1,equalizer=f=6500:t=q:w=1:g=-5,acompressor=threshold=-24dB:ratio=2.2:attack=15:release=200:makeup=2,chorus=0.6:0.9:45:0.25:0.25:2,aecho=0.8:0.55:90|180|300:0.25|0.15|0.08" ;;
  krishna_divine_en) VOICE=${4:-en-US-AndrewMultilingualNeural}; RATE=-8%; PITCH=-6Hz; SHIFT=0.97; GAP=0.3
            FX="highpass=f=75,equalizer=f=180:t=q:w=1:g=3,equalizer=f=2600:t=q:w=1.2:g=1,equalizer=f=6500:t=q:w=1:g=-5,acompressor=threshold=-24dB:ratio=2.2:attack=15:release=200:makeup=2,chorus=0.6:0.9:45:0.25:0.25:2,aecho=0.8:0.55:90|180|300:0.25|0.15|0.08" ;;
  *) echo "ROLE must be narrator, krishna, narrator_en, krishna_en, krishna_divine or krishna_divine_en"; exit 1 ;;
esac
TMP=$(mktemp --suffix=.wav)
# each "|"-separated phrase is spoken separately and joined with a pause of GAP seconds (default 0.35)
GAP=${GAP:-0.35}; PARTS=(); IFS='|' read -ra SEGS <<< "$TEXT"
for seg in "${SEGS[@]}"; do
  P=$(mktemp --suffix=.mp3)
  SSL_CERT_FILE=/root/.ccr/ca-bundle.crt /home/user/gc-venv/bin/edge-tts --proxy "$HTTPS_PROXY" --voice "$VOICE" \
    --rate=$RATE --pitch=$PITCH --text "$seg" --write-media "$P" >/dev/null
  PARTS+=("$P")
done
ARGS=(); FC=""; n=0
for P in "${PARTS[@]}"; do
  ARGS+=(-i "$P"); FC="$FC[$n:a]aresample=44100,aformat=channel_layouts=mono[s$n];"; n=$((n+1))
done
SIL=$(mktemp --suffix=.wav); ffmpeg -v error -y -f lavfi -t "$GAP" -i anullsrc=r=44100:cl=mono "$SIL"
CAT=""; m=0
for k in $(seq 0 $((n-1))); do CAT="$CAT[s$k]"; m=$((m+1)); if [ $k -lt $((n-1)) ]; then ARGS+=(-i "$SIL"); FC="$FC[$((n+k)):a]anull[g$k];"; CAT="$CAT[g$k]"; m=$((m+1)); fi; done
ffmpeg -v error -y "${ARGS[@]}" -filter_complex "${FC}${CAT}concat=n=$m:v=0:a=1" "$TMP"
rm -f "${PARTS[@]}" "$SIL"
# deepen slightly (resample trick, length kept with atempo), then the polish chain, then -16 LUFS mono 44.1 kHz
ffmpeg -v error -y -i "$TMP" -af "aresample=44100,asetrate=44100*$SHIFT,aresample=44100,atempo=1/$SHIFT,$FX,loudnorm=I=-16:TP=-1.5:LRA=7" \
  -ac 1 -ar 44100 "$OUT.full.wav"
# trim leading silence and all but a 0.25 s tail (the TTS pads ~1 s at both ends; it made reels drag)
ffmpeg -v error -y -i "$OUT.full.wav" -af "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05,areverse,silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.25,areverse" -ar 44100 "$OUT"
rm -f "$OUT.full.wav"
rm -f "$TMP"
ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT"
