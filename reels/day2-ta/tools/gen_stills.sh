#!/usr/bin/env bash
# Generates the Day 2 stills locally with stable-diffusion.cpp + Z-Image-Turbo (Apache-2.0), one after another.
# Expects sd-cli at $SD and the models in $MODELS (see reels/day2/README section in the commit message).
set -u
SD=${SD:-/home/user/stable-diffusion.cpp/build/bin/sd-cli}
MODELS=${MODELS:-/home/user/sd-models}
OUT=$(cd "$(dirname "$0")/../assets/img" && pwd)
STYLE="Traditional Indian devotional painting in Tanjore style with rich gold leaf details, palette of saffron, gold and deep indigo blue, ultra detailed."
gen() { # name seed prompt
  [ -s "$OUT/$1.png" ] && { echo "skip $1"; return; }
  "$SD" --diffusion-model "$MODELS/z_image_turbo-Q4_K.gguf" --vae "$MODELS/ae.safetensors" --llm "$MODELS/qwen3-4b-q4km.gguf" \
    --cfg-scale 1.0 --steps 8 -H 1024 -W 576 -t 4 -s "$2" -o "$OUT/$1.png" -p "$STYLE $3 No text, no letters." > "$OUT/../../tools/$1.log" 2>&1
  echo "$1 done: $(ls -la "$OUT/$1.png" 2>/dev/null | awk '{print $5}') bytes"
}
gen 03-krishna-teaching 11 "Lord Krishna as the divine charioteer, blue-skinned, peacock feather crown, turning on the chariot toward Arjuna with a serene compassionate smile, right hand raised in a gentle teaching gesture, radiant golden halo, white horses and the battlefield softly blurred behind."
gen 04-arjuna-rises 23 "Arjuna standing tall in his golden chariot at sunrise, calm and resolute, lifting his bow with steady hands, golden rays breaking through the clouds behind him, Krishna holding the reins in front, a sense of clarity and peace."
gen 05-lotus 31 "Two cupped hands gently releasing a pink lotus with a small lit diya onto a calm sacred river at dawn, ripples of gold light on the water, other floating diyas drifting away, mood of surrender and letting go."
gen 06-mala 47 "A tulsi japa mala of wooden prayer beads coiled beside a closed holy book wrapped in saffron cloth on a small altar, marigold petals, a brass diya and incense smoke curling upward, a small Krishna idol softly glowing in the background, calm deep blue space in the upper half."
