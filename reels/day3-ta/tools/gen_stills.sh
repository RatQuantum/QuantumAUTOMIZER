#!/usr/bin/env bash
# Generates the Day 3 stills on the Z-Image-Turbo ZeroGPU Space (tools/zimage_gen.py). Skips stills already made.
set -u
cd "$(dirname "$0")/.."
gen() { # name seed prompt
  [ -s "assets/img/$1.png" ] && { echo "skip $1"; return; }
  python3 tools/zimage_gen.py "assets/img/$1.png" "$2" "$3" 2>&1 | tail -1
}
gen 01-night-temple 4 "A small South Indian Krishna temple at four in the morning, deep indigo night sky with fading stars and a thin crescent moon, the sleeping town of tiled roofs dark around it, a single warm oil lamp glowing at the temple entrance, a tall gopuram silhouette, misty and peaceful, calm empty sky in the upper half."
gen 02-bell 15 "Close-up of a large polished brass temple bell hanging alone from a carved wooden beam in a dark South Indian temple corridor before dawn, a thick rope tied to the bell clapper, a man's hand gripping the rope and pulling it, the bell swinging, warm oil lamp glow on the brass, stone pillars in deep shadow, nothing below the bell but the stone floor."
gen 03-suprabhatam 21 "Inside a dark South Indian temple before dawn, an elderly male priest with a white veshti, a bare chest with a sacred thread and a folded angavastram on his shoulder, standing before the closed carved wooden doors of the inner sanctum, eyes closed and hands folded, singing softly, a row of small brass oil lamps glowing on the stone floor."
gen 04-abhishekam 33 "A small black stone idol of child Krishna playing the flute on a stone pedestal, a male priest's hands pouring a stream of white milk over the idol from a brass kalasha vessel, milk flowing down in a smooth stream, brass lamps glowing, flowers and a silver plate beside it, warm devotional light."
gen 05-alankaram 47 "A small idol of child Krishna playing the flute, beautifully adorned in fresh yellow silk dhoti and an orange silk shawl, a peacock feather crown, garlands of jasmine, marigold and tulsi, gold jewellery, sitting in a decorated silver shrine, glowing brass lamps on both sides, rich colourful details."
gen 06-aarti 58 "A male priest's hand raising a brass aarti lamp with bright camphor flames in a circle before an adorned idol of child Krishna wearing silk and flower garlands, the flames glowing gold, light smoke rising, devotional warm glow, deep indigo darkness around."
gen 07-doors-open 64 "The tall carved wooden doors of a South Indian temple sanctum swinging open, warm golden light pouring out from inside onto a stone floor, silhouettes of a few devotees with folded hands looking in, soft light rays, early morning blue light at the edges."
gen 08-dawn 71 "A South Indian Krishna temple gopuram at sunrise, saffron and gold sky, birds flying, a few devotees walking up the stone steps, marigold garlands on the gate, peaceful and welcoming mood, calm sky in the upper half."
