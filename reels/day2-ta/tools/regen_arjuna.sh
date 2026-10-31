#!/usr/bin/env bash
# Re-generates the two Arjuna stills: the first versions draped him like a saree.
# The prompts now spell out a male warrior's dress and armour.
set -u
SD=${SD:-/home/user/stable-diffusion.cpp/build/bin/sd-cli}
MODELS=${MODELS:-/home/user/sd-models}
OUT=$(cd "$(dirname "$0")/../assets/img" && pwd)
STYLE="Traditional Indian devotional painting in Tanjore style with rich gold leaf details, palette of saffron, gold and deep indigo blue, ultra detailed."
MALE="Arjuna is a muscular adult male warrior prince with a moustache, broad bare chest, golden armour breastplate and arm guards, a short warrior's dhoti tied at the waist, a quiver of arrows on his back, a warrior's crown."
gen() { # name seed prompt
  "$SD" --diffusion-model "$MODELS/z_image_turbo-Q4_K.gguf" --vae "$MODELS/ae.safetensors" --llm "$MODELS/qwen3-4b-q4km.gguf" \
    --cfg-scale 1.0 --steps 8 -H 1024 -W 576 -t 4 -s "$2" -o "$OUT/$1.png" \
    -p "$STYLE $3 $MALE No saree, no women's clothing, no drapes over the shoulder. No text, no letters." > "$OUT/../../tools/$1.log" 2>&1
  echo "$1 done"
}
gen 02-arjuna-frozen 101 "Arjuna sits in his golden war chariot on the Kurukshetra battlefield at dusk, head bowed in despair, his great bow lowered and slipping from his hand, armies and banners hazy behind, dramatic saffron sky."
gen 04-arjuna-rises 202 "Arjuna stands tall and resolute in his golden war chariot at sunrise, raising his great bow with steady hands, golden rays breaking through the clouds, Krishna as charioteer holding the reins of white horses."
