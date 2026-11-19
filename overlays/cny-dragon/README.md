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
