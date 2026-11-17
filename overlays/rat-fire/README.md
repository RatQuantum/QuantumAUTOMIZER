# Rat Fire overlay (Streamlabs Desktop)

Gold → orange → red slow-moving gradient, hard black "sticker" shadows, Bungee headings. Two layouts:

| File | Canvas | Gameplay slot |
|---|---|---|
| `horizontal.html` | 1920×1080 | x0 y0, 1600×900 |
| `vertical.html` | 1080×1920 | x0 y380, 1080×608 |

## 1. Set your GPay UPI ID
Open `shared.js` in Notepad and change `UPI_ID` to your UPI ID (for example `name@okhdfcbank`). The QR updates itself.
Scan it with your own phone before going live.

## 2. Add to Streamlabs
Sources → **+** → **Browser Source** → tick **Local file** → pick `horizontal.html` (width 1920, height 1080)
or `vertical.html` (1080×1920). In Dual Output, show each one only on its own canvas.

Set `SHOW_GUIDES = true` in `shared.js` while lining up sources, then set it back to `false`.

## 3. Source order (top of the list = in front)
1. Chat Box, Subscription Goal, Rat mascot image  ← sit inside their boxes
2. Rat Fire overlay (browser source)
3. Game capture  ← sits in the gameplay slot

The QR code library (`qrcode.js`, MIT, Kazuhiko Arase) is included, so the overlay works offline.
