"""Day 11 (Tamil): "Pick a card", format B in content/formats.md (the user, 6 Nov: "every reel feels the same… be creative").
Three golden cards are shuffled on the beat; the viewer pauses and picks 1, 2 or 3; each card flips to a real promise from
the Bhagavad Gita (2.47, 9.22, 18.66). No pictures, no faces, no voice: everything is drawn in HyperFrames.
CTA: comment your number. Beat grid of "ZAKHELO (Slowed)" (71 BPM, drop on beat 8): start the song at 0:08.2 in Instagram.

Run from reels/day11-ta:  python3 tools/build_day11.py && npm run check && npm run render
"""
import json
import random
import subprocess

BPM = 71
BEAT = 60 / BPM


def B(n):
    return round(n * BEAT, 3)


TOTAL = B(35)          # 29.58 s: slower, so people can choose and read (the user, 7 Nov)
W, H = 1080, 1920
CW, CH = 300, 460      # card size, small
SLOT_X = [60, 390, 720]
CARD_Y = 640
BIG = 2.35             # scale of a revealed card (705 x 1081)
# choose (beats 6-10, 4.2 s), count 3-2-1 one number every 2 beats (1.7 s each), reveal on beat 16,
# 5 beats (4.2 s) to read each card. In Instagram, start ZAKHELO (Slowed) at 0:01.5 so its drop lands on the first reveal.
COUNT = [(10, "3"), (12, "2"), (14, "1")]
REVEAL = [B(16), B(21), B(26)]
CTA = B(31)

# The three promises (Tamil renderings of the verses; keep them faithful to the Gita, never invented)
CARDS = [
    ("உன் கடமையைச் செய்.<br>பலனைப் பற்றிக்<br><b>கவலைப்படாதே.</b>", "பகவத் கீதை 2.47"),
    ("என்னையே நினைப்பவரின்<br>தேவைகளை<br><b>நானே சுமக்கிறேன்.</b>", "பகவத் கீதை 9.22"),
    ("என்னைச் சரணடை.<br>நான் உன்னை விடுவிப்பேன்.<br><b>கவலைப்படாதே.</b>", "பகவத் கீதை 18.66"),
]

# shuffle: each step swaps two slots; the order ends back at 1, 2, 3 so the numbers read left to right
SWAPS = [(B(2), 0, 2), (B(3), 0, 1), (B(4), 1, 2), (B(5), 0, 1)]

FEATHER = ('<svg viewBox="0 0 90 220" width="{w}" height="{h}"><path d="M45 218 L45 40" stroke="#e6c46a" stroke-width="2.5"/>'
           '<path d="M45 20 C10 50 8 120 45 200 C82 120 80 50 45 20 Z" fill="#1f6b4f" opacity="0.9"/>'
           '<ellipse cx="45" cy="62" rx="24" ry="30" fill="#2e8b57"/><ellipse cx="45" cy="64" rx="16" ry="21" fill="#d4a017"/>'
           '<ellipse cx="45" cy="66" rx="10" ry="14" fill="#1e5aa8"/><ellipse cx="45" cy="68" rx="5" ry="7" fill="#0b1f4d"/></svg>')

SFX = "assets/sfx/"
AUDIO = [
    ("assets/audio/impact.wav", REVEAL[0] - 1.27, 0.45, 17, {}),           # its boom peaks on the drop
    (SFX + "ambi_drone.wav", 0.0, 0.3, 8, {"dur": 4.4, "fin": 0.2, "fout": 1.2}),
    *[(SFX + snd, t, 0.55, 12 + 10 * k, {}) for k, ((t, _, _), snd) in enumerate(zip(SWAPS, ["perc_snap.wav", "tabla_te1.wav", "perc_snap2.wav", "tabla_te2.wav"]))],
    *[(SFX + snd, B(n), 0.7, 13 + k * 10, {}) for k, (n, snd) in enumerate([(10, "tabla_dhec.wav"), (12, "tabla_na_s.wav"), (14, "tabla_ghe1.wav")])],
    *[(SFX + swish, t + 0.3, 0.5, 18 + 10 * k, {}) for k, (t, swish) in enumerate(zip(REVEAL, ["perc_swash.wav", "perc_swoosh.wav", "perc_swash.wav"]))],
    *[(SFX + snd, t + 0.55, vol, 19 + 10 * k, {"dur": 3.0, "fout": 1.2}) for k, (t, snd, vol) in enumerate(zip(REVEAL, ["ambi_glass_rub.wav", "guit_harmonics.wav", "elec_chime.wav"], [0.6, 0.5, 0.35]))],
    (SFX + "ambi_choir.wav", REVEAL[0] + 0.4, 0.45, 20, {}),
    (SFX + "tabla_ghe3.wav", CTA, 0.7, 49, {"fout": 0.6}),
]


def wrap(cid, css, html, js):
    return f'''<template>
  <style>
    #root {{
      position: absolute;
      inset: 0;
      overflow: hidden;
    }}
{css}  </style>
  <div id="root" data-composition-id="{cid}" data-width="{W}" data-height="{H}">
{html}  </div>
  <script>
    const tl = gsap.timeline({{ paused: true }});
{js}    window.__timelines["{cid}"] = tl;
  </script>
</template>
'''


def scene():
    rnd = random.Random(11)
    css = '''    @font-face {
      font-family: "Noto Sans Tamil";
      src: url("assets/fonts/NotoSansTamil.ttf");
    }
    @font-face {
      font-family: "Noto Serif Tamil";
      src: url("assets/fonts/NotoSerifTamil.ttf");
    }
    @font-face {
      font-family: "Noto Color Emoji";
      src: url("assets/fonts/NotoColorEmoji.ttf");
    }
    #bg {
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse at 50% 42%, #5c1020 0%, #2a0610 55%, #0d0205 100%);
    }
    #mandala {
      position: absolute;
      left: -420px;
      top: -180px;
      width: 1920px;
      height: 1920px;
      border-radius: 50%;
      background: repeating-conic-gradient(from 0deg, rgba(230, 190, 100, 0.10) 0deg 2deg, rgba(0, 0, 0, 0) 2deg 7.5deg);
      -webkit-mask-image: radial-gradient(circle, #000 20%, transparent 60%);
      mask-image: radial-gradient(circle, #000 20%, transparent 60%);
    }
    .mote {
      position: absolute;
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: #ffe3a0;
      box-shadow: 0 0 10px 3px rgba(255, 200, 100, 0.7);
    }
    .card {
      position: absolute;
      width: ''' + str(CW) + '''px;
      height: ''' + str(CH) + '''px;
      transform-style: preserve-3d;
    }
    .face {
      position: absolute;
      inset: 0;
      border-radius: 22px;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      overflow: hidden;
    }
    .back {
      background: linear-gradient(160deg, #7a1426 0%, #3d0912 100%);
      border: 5px solid #d9b25a;
      box-shadow: 0 0 34px 6px rgba(255, 190, 80, 0.45), inset 0 0 0 10px rgba(217, 178, 90, 0.25);
    }
    .back .inner {
      position: absolute;
      inset: 18px;
      border-radius: 14px;
      border: 2px solid rgba(217, 178, 90, 0.7);
      background: repeating-linear-gradient(45deg, rgba(217, 178, 90, 0.08) 0 6px, rgba(0, 0, 0, 0) 6px 14px);
    }
    .back .emblem {
      position: absolute;
      left: 105px;
      top: 70px;
    }
    .back .num {
      position: absolute;
      left: 0;
      width: 100%;
      bottom: 34px;
      text-align: center;
      font-family: "Noto Serif Tamil", serif;
      font-weight: 700;
      font-size: 64px;
      color: #ffe7a6;
      text-shadow: 0 0 16px rgba(255, 190, 80, 0.9);
    }
    .front {
      transform: rotateY(180deg);
      background-color: #f8ecd0;
      background-image: linear-gradient(170deg, #fff8e8 0%, #f3e2bd 100%);
      border: 5px solid #c99a3a;
      box-shadow: 0 0 40px 10px rgba(255, 200, 100, 0.55);
    }
    .front .emblem {
      position: absolute;
      left: 128px;
      top: 22px;
    }
    .front .msg {
      position: absolute;
      left: 16px;
      right: 16px;
      top: 196px;
      text-align: center;
      font-family: "Noto Serif Tamil", serif;
      font-size: 23px;
      line-height: 1.6;
      color: #4a0b16;
    }
    .front .msg b {
      color: #7a3d00;
    }
    .front .ref {
      position: absolute;
      left: 0;
      width: 100%;
      bottom: 22px;
      text-align: center;
      font-family: "Noto Sans Tamil", sans-serif;
      font-size: 13px;
      letter-spacing: 1px;
      color: #6b4210;
    }
    .front .tag {
      position: absolute;
      left: 0;
      width: 100%;
      top: 140px;
      text-align: center;
      font-family: "Noto Sans Tamil", sans-serif;
      font-size: 12px;
      color: #6b4210;
    }
    .title {
      position: absolute;
      left: 60px;
      width: 960px;
      text-align: center;
      font-family: "Noto Sans Tamil", "Noto Color Emoji", sans-serif;
      font-weight: 700;
      color: #ffffff;
      text-shadow: 0 3px 10px rgba(0, 0, 0, 0.9);
    }
    .title b {
      color: #ffd34d;
    }
    .count {
      position: absolute;
      left: 0;
      width: 1080px;
      top: 1170px;
      text-align: center;
      font-family: "Noto Serif Tamil", serif;
      font-weight: 700;
      font-size: 150px;
      color: #ffd34d;
      text-shadow: 0 0 40px rgba(255, 180, 60, 0.9);
      opacity: 0;
    }
    #flash {
      position: absolute;
      inset: 0;
      background: #fff3d0;
      opacity: 0;
    }
    #handle {
      position: absolute;
      left: 0;
      width: 1080px;
      top: 1720px;
      text-align: center;
      font-family: "Noto Sans Tamil", sans-serif;
      font-size: 32px;
      color: #ffe7b0;
      opacity: 0;
    }
'''
    html = f'    <div id="bg" class="clip" data-start="0" data-duration="{TOTAL}" data-track-index="0"></div>\n'
    html += f'    <div id="mandala" class="clip" data-start="0" data-duration="{TOTAL}" data-track-index="1" data-layout-ignore></div>\n'
    js = f'    tl.fromTo("#mandala", {{ rotation: 0 }}, {{ rotation: 60, duration: {TOTAL}, ease: "none" }}, 0);\n'
    html += f'    <div id="motes" class="clip" data-start="0" data-duration="{TOTAL}" data-track-index="2" data-layout-ignore>\n'
    for k in range(36):
        x0, y0 = rnd.randint(0, 1060), rnd.randint(0, 1900)
        dx, dy = rnd.randint(-80, 80), -rnd.randint(150, 500)
        html += f'      <div id="m{k}" class="mote" style="left: {x0}px; top: {y0}px;"></div>\n'
        js += f'    tl.fromTo("#m{k}", {{ x: 0, y: 0, opacity: 0.8 }}, {{ x: {dx}, y: {dy}, opacity: 0.1, duration: {TOTAL}, ease: "none" }}, 0);\n'
    html += '    </div>\n'

    # the cards (back: number + feather, front: the promise)
    for c, (msg, ref) in enumerate(CARDS):
        html += (f'    <div id="c{c}" class="clip card" style="left: {SLOT_X[c]}px; top: {CARD_Y}px;" data-start="0" '
                 f'data-duration="{TOTAL}" data-track-index="{3 + c}">\n'
                 f'      <div id="bk{c}" class="face back"><div class="inner"></div><div class="emblem">{FEATHER.format(w=90, h=220)}</div>'
                 f'<div class="num">{c + 1}</div></div>\n'
                 f'      <div id="fr{c}" class="face front"><div class="emblem">{FEATHER.format(w=44, h=108)}</div>'
                 f'<div class="tag">அட்டை {c + 1} · கண்ணனின் செய்தி</div><div class="msg">{msg}</div><div class="ref">— {ref}</div></div>\n'
                 f'    </div>\n')
        js += f'    tl.set("#c{c}", {{ transformPerspective: 1800, rotationY: 0, x: 0, y: 0, scale: 1, opacity: 1 }}, 0);\n'
        js += f'    tl.set("#fr{c}", {{ opacity: 0 }}, 0);\n'
        js += f'    tl.set("#fr{c}", {{ opacity: 1 }}, {REVEAL[c] + 0.55:.3f});\n'
        js += f'    tl.set("#bk{c}", {{ opacity: 0 }}, {REVEAL[c] + 0.55:.3f});\n'
        # gentle float before the shuffle
        js += f'    tl.fromTo("#c{c}", {{ y: 0 }}, {{ y: -14, duration: {BEAT:.3f}, ease: "sine.inOut", yoyo: true, repeat: 1, immediateRender: false }}, {0.05 * c:.2f});\n'

    # shuffle: track where each card is; animate x offsets relative to its home slot, with an arc
    order = [0, 1, 2]   # order[slot] = card
    for t, a, b in SWAPS:
        ca, cb = order[a], order[b]
        order[a], order[b] = cb, ca
        for card, slot, up in ((ca, b, -120), (cb, a, 120)):
            dx = SLOT_X[slot] - SLOT_X[card]
            js += f'    tl.to("#c{card}", {{ x: {dx}, duration: 0.36, ease: "power2.inOut" }}, {t:.3f});\n'
            js += f'    tl.to("#c{card}", {{ y: {up}, duration: 0.18, ease: "power2.out", yoyo: true, repeat: 1 }}, {t:.3f});\n'

    # countdown before the drop
    for k, (n, label) in enumerate(COUNT):
        t = B(n)
        html += f'    <div id="cd{k}" class="clip count" data-start="{t:.3f}" data-duration="{2 * BEAT - 0.05:.3f}" data-track-index="7">{label}</div>\n'
        js += f'    tl.fromTo("#cd{k}", {{ opacity: 0, scale: 1.5 }}, {{ opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" }}, {t:.3f});\n'
        js += f'    tl.to("#cd{k}", {{ opacity: 0, duration: 0.3, ease: "power1.in" }}, {t + 2 * BEAT - 0.35:.3f});\n'

    # reveals: the card rises to the centre, the others dim, it flips on the beat
    cx_left, cy_top = (W - CW) / 2, 640
    for c, t in enumerate(REVEAL):
        end = REVEAL[c + 1] if c + 1 < len(REVEAL) else CTA
        dx = cx_left - SLOT_X[c]
        js += f'    tl.to("#c{c}", {{ opacity: 1, duration: 0.15 }}, {t:.3f});\n'
        js += f'    tl.to("#c{c}", {{ x: {dx:.0f}, y: {cy_top - CARD_Y + 150}, scale: {BIG}, duration: 0.38, ease: "power3.out" }}, {t:.3f});\n'
        js += f'    tl.to("#c{c}", {{ rotationY: 180, duration: 0.5, ease: "power2.inOut" }}, {t + 0.3:.3f});\n'
        for o in range(3):
            if o != c:
                js += f'    tl.to("#c{o}", {{ opacity: 0.0, duration: 0.25 }}, {t:.3f});\n'
        # leave: shrink back to its slot face-up, small, so all three can be seen together at the end
        js += f'    tl.to("#c{c}", {{ x: 0, y: 0, scale: 1, duration: 0.35, ease: "power2.inOut" }}, {end - 0.38:.3f});\n'
        if end == CTA:
            for o in range(3):
                if o != c:
                    js += f'    tl.to("#c{o}", {{ opacity: 1, duration: 0.25 }}, {end + 0.02:.3f});\n'

    # the white flash on each flip
    html += f'    <div id="flash" class="clip" data-start="0" data-duration="{TOTAL}" data-track-index="8" data-layout-ignore></div>\n'
    for t in REVEAL:
        js += f'    tl.fromTo("#flash", {{ opacity: 0.55 }}, {{ opacity: 0, duration: 0.35, ease: "power2.out", immediateRender: false }}, {t + 0.55:.3f});\n'

    # titles
    texts = [
        ("t0", '<span style="white-space: nowrap">கண்ணன் இன்று உனக்கு<br>ஒரு <b>செய்தி</b> வைத்திருக்கிறான்</span>', 0.0, B(6) - 0.05, 230, 56),
        ("t1", 'ஒரு அட்டையைத் தேர்ந்தெடு 👇', 0.0, B(6) - 0.05, 1200, 50),
        ("t2", '✋ <b>நிறுத்து.</b><br>ஒரு அட்டையைத் தேர்ந்தெடு', B(6), B(16) - 0.05, 260, 58),
        ("t3", 'உனக்கு எந்த அட்டை?<br>கமெண்ட்டில் <b>1, 2 அல்லது 3</b> 👇', CTA + 0.1, TOTAL, 230, 56),
    ]
    for tid, txt, a, b, top, size in texts:
        html += (f'    <div id="{tid}" class="clip title" style="top: {top}px; font-size: {size}px; line-height: 1.4;" '
                 f'data-start="{a:.3f}" data-duration="{b - a:.3f}" data-track-index="9">{txt}</div>\n')
        if a > 0:
            js += f'    tl.fromTo("#{tid}", {{ opacity: 0, y: 20 }}, {{ opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }}, {a:.3f});\n'
    html += f'    <div id="handle" class="clip" data-start="{CTA:.3f}" data-duration="{TOTAL - CTA:.3f}" data-track-index="10">@lordsrikrishnatemple</div>\n'
    js += f'    tl.fromTo("#handle", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.4 }}, {CTA + 0.3:.3f});\n'
    return wrap("scene", css, html, js)


def index():
    audio = ""
    for i, (f, st, vol, tr, o) in enumerate(AUDIO):
        du = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f],
                                  capture_output=True, text=True, check=True).stdout) - o.get("media", 0)
        du = min(du, o.get("dur", du), TOTAL - st)
        extra = f' data-media-start="{o["media"]}"' if "media" in o else ""
        extra += f' data-fade-in="{o["fin"]}"' if "fin" in o else ""
        extra += f' data-fade-out="{o["fout"]}"' if "fout" in o else ""
        audio += f'      <audio id="a{i}" class="clip" src="{f}" data-start="{st:.3f}" data-duration="{du:.3f}" data-volume="{vol}" data-track-index="{tr}"{extra}></audio>\n'
    return f'''<!doctype html>
<html lang="ta" data-resolution="portrait">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width={W}, height={H}" />
    <script src="assets/gsap.min.js"></script>
    <style>
      /* Day 11 (Tamil) · Pick a card: three Gita promises, {TOTAL:.2f}s on a 71 BPM beat grid. Maroon and gold. */
      * {{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }}
      html,
      body {{
        margin: 0;
        width: {W}px;
        height: {H}px;
        overflow: hidden;
        background: #0d0205;
      }}
      #root {{
        width: 100%;
        height: 100%;
      }}
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="{TOTAL}" data-width="{W}" data-height="{H}">
      <div id="scene" data-composition-id="scene" data-composition-src="compositions/scene.html" data-start="0" data-duration="{TOTAL}" data-track-index="1" data-track-kind="graphics" data-width="{W}" data-height="{H}"></div>

      <!-- No voice. Effects: CC0 (assets/sfx/CREDITS.md) and ElevenLabs sound effects. -->
{audio}    </div>
    <script>
      window.__timelines = window.__timelines || {{}};
      window.__timelines["main"] = gsap.timeline({{ paused: true }});
    </script>
  </body>
</html>
'''


if __name__ == "__main__":
    open("compositions/scene.html", "w", encoding="utf-8").write(scene())
    open("index.html", "w", encoding="utf-8").write(index())
    print("built", TOTAL, "s")
