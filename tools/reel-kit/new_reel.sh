#!/bin/bash
# Scaffold a new reel:  tools/reel-kit/new_reel.sh day15-en "Day 15 (English): ..."
# Creates reels/<name>/ with the HyperFrames project files, gsap + springs.js, fonts, sfx/audio/compositions/tools
# folders, docs/brief.md and docs/shotlist.md from the templates, and reviews/ for the critic.
set -e
NAME=$1; TITLE=${2:-$1}
ROOT=$(cd "$(dirname "$0")/../.." && pwd)
R=$ROOT/reels/$NAME
[ -e "$R" ] && { echo "reels/$NAME exists"; exit 1; }
mkdir -p "$R"/{tools,compositions,docs,reviews,assets/{audio,sfx,fonts,img,video}}
SRC=$ROOT/reels/deepavali-en
cp "$SRC"/{AGENTS.md,CLAUDE.md,hyperframes.json} "$R"/
sed "s/deepavali-en/$NAME/" "$SRC/package.json" > "$R/package.json"
printf '{\n  "id": "%s",\n  "name": "%s",\n  "createdAt": "%s"\n}\n' "$NAME" "$NAME" "$(date -u +%Y-%m-%dT%H:%M:%S.000Z)" > "$R/meta.json"
cp "$SRC/assets/gsap.min.js" "$R/assets/"
cp "$ROOT/tools/reel-kit/springs.js" "$R/assets/"
cp "$SRC"/assets/fonts/* "$R/assets/fonts/"
for t in brief shotlist; do sed "s/{{NAME}}/$TITLE/" "$ROOT/tools/reel-kit/templates/$t.md" > "$R/docs/$t.md"; done
echo "Sonic Pi built-in samples are CC0 (github.com/sonic-pi-net/sonic-pi/tree/dev/etc/samples); list each one used here." > "$R/assets/sfx/CREDITS.md"
echo "created reels/$NAME"
