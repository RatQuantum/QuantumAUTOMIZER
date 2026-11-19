# Golden Dragon bottom banner (Streamlabs Desktop)

Red lacquer strip with gold trim and cloud pattern, a golden dragon in the centre with the
animated Rat riding it. The dragon body ripples like it is swimming (dragon.js) and the Rat rides the wave. It also has a gold light sweep, swinging lanterns and rising gold sparks. No text.

| File | Canvas | Strip height |
|---|---|---|
| `horizontal.html` | 1920×1080 | 90px |
| `vertical.html` | 1080×1920 | 140px |

## Add to Streamlabs
1. Keep this whole folder together (`dragon.png`, `rat.webm`, `style.css` are used by both pages).
2. Sources → **+** → **Browser Source** → tick **Local file** → pick `horizontal.html`, width 1920, height 1080.
   In Dual Output show it on the **horizontal** canvas only.
3. Add a second Browser Source with `vertical.html`, width 1080, height 1920, on the **vertical** canvas only.
4. Put both above your game capture in the Sources list. The rest of the page is transparent.

To make it bigger or smaller, change `--strip` (bar height) and `--dw` (dragon width) at the top of each HTML file.

Dragon art: generated with MiniMax-H3 FlashGen, then keyed and cropped. Rat: your own mascot animation.

## Webcam layouts (dual output, like a classic "cam on top" vertical)
| File | Canvas | Where things go |
|---|---|---|
| `vertical-cam.html` | 1080×1920 | Webcam x0 y0 1080×700 · Gameplay x0 y706 1080×608 · banner below · bottom left empty for the app's buttons |
| `horizontal-cam.html` | 1920×1080 | Gameplay full screen · webcam x1500 y170 384×216, no border · premium banner y944-1080 |

Edit `config.js` for your UPI ID, YouTube handle and big name. Styling lives in `premium.css` (burgundy + metallic gold, Cinzel / Cormorant Garamond / Montserrat). No border on the webcam.
Open the page with `?guides=1` in a browser to see the slot labels while lining up sources.

Coiled dragon (`dragon-coil.png`): made with SDXL + SDXL-Lightning (OpenRAIL++) on CPU and cut out with rembg.

## Animation
- `text-anim.js`: RAT letters pop in, UPI/YouTube rows slide in, the YouTube handle waves, and everything re-pops every 9 s.
- `coil.js`: the coiled dragon's body slithers around the ring (head and top stay still so the Rat keeps its footing).
- The Rat plays its own loop and hops every 7 s.
Preview videos: `preview-horizontal-cam.mp4`, `preview-vertical-cam.mp4`.

## Green-screen version
- Ready-made 20 s seamless loops (H.264, 30 fps, solid #00FF00 background):
  `greenscreen/rat-banner-horizontal-greenscreen.mp4` (1920×1080) and `greenscreen/rat-banner-vertical-greenscreen.mp4` (1080×1920).
  In Streamlabs: add as **Media Source** with **Loop** ticked, then **Filters → + → Chroma Key** (Key Color Type: Green).
  Keep **Spill Reduction** low (about 30–50), or the Rat's dark green suit turns bluish.
- Or use the live HTML pages on green: set `GREEN_SCREEN = true` in `config.js` (or add `?green=1` to the file address).
- Every character has its own entrance, idle motion, pop-out and exit (generated in `text-anim.js`); all motion loops on 20 s.
