#!/bin/bash
# Free Tamil voice (Microsoft Edge neural TTS via edge-tts) with a polish chain so it sounds less flat.
# The user, 7 Nov: "Use free voice instead of ElevenLabs".
#   tools/free_voice.sh ROLE "TEXT" OUT.wav [VOICE]
#   ROLE narrator: deep storyteller (default voice ta-IN-ValluvarNeural), a slightly deeper tone, warm low end, a hall.
#   ROLE krishna:  warm and close (default voice ta-MY-SuryaNeural), a softer, shorter room.
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
  *) echo "ROLE must be narrator or krishna"; exit 1 ;;
esac
TMP=$(mktemp --suffix=.mp3)
SSL_CERT_FILE=/root/.ccr/ca-bundle.crt /home/user/gc-venv/bin/edge-tts --proxy "$HTTPS_PROXY" --voice "$VOICE" \
  --rate=$RATE --pitch=$PITCH --text "$TEXT" --write-media "$TMP" >/dev/null
# deepen slightly (resample trick, length kept with atempo), then the polish chain, then -16 LUFS mono 44.1 kHz
ffmpeg -v error -y -i "$TMP" -af "aresample=44100,asetrate=44100*$SHIFT,aresample=44100,atempo=1/$SHIFT,$FX,loudnorm=I=-16:TP=-1.5:LRA=7" \
  -ac 1 -ar 44100 "$OUT"
rm -f "$TMP"
ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT"
