"""Day 16 (English): "Your birth month, His name" · format G (this or that / quiz, new), built with /krishna-reel.

A golden wheel of the twelve months turns in the dark (the hook); the camera pushes through it; four pages of three
Tanjore-style cards (ruby, emerald, gold leaf) flip in one month at a time with Krishna's name for that month and its
meaning; then all twelve names sit on one screen to pause and screenshot, and the ask: comment your name.
No beat grid (no track file): paced to the voice and to reading time (rules 7g, 7h). Free voice: narrator_en.

Run from reels/day16-en:  python3 tools/build_day16.py && npm run check && npm run render
"""
import math
import random
import subprocess

W, H = 1080, 1920
A, SFX = "assets/audio/", "assets/sfx/"

MONTHS = [  # month, name, meaning (traditional meanings of names of Krishna)
    ("JAN", "Govinda", "the one who gives joy to all"),
    ("FEB", "Madhava", "sweet as honey"),
    ("MAR", "Keshava", "the one with beautiful hair"),
    ("APR", "Gopala", "protector of the cows"),
    ("MAY", "Mukunda", "the giver of liberation"),
    ("JUN", "Damodara", "bound by a mother's love"),
    ("JUL", "Shyam", "the dark, beautiful one"),
    ("AUG", "Vasudeva", "He who dwells in all"),
    ("SEP", "Achyuta", "the one who never falls"),
    ("OCT", "Hari", "He who takes away sorrow"),
    ("NOV", "Mohana", "the one who enchants all"),
    ("DEC", "Janardana", "protector of the people"),
]


def dur(f):
    return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f],
                                capture_output=True, text=True, check=True).stdout)


D = {k: dur(A + k + ".wav") for k in ("n1", "n2", "n3")}
PAGE = 4.3                     # three cards: about 1 s + 0.3 s per word each to find and read your month (rule 7g)
STAGGER = 0.45                 # the cards land one after another, never all at once
T = {"n1": 0.3}
T["push"] = round(T["n1"] + D["n1"] + 0.3, 2)           # the camera pushes through the wheel
PAGES = [round(T["push"] + 0.5 + k * PAGE, 2) for k in range(4)]
T["grid"] = round(PAGES[-1] + PAGE, 2)
T["n2"] = round(T["grid"] + 0.5, 2)
T["n3"] = round(T["n2"] + D["n2"] + 0.3, 2)
T["cta"] = round(T["n3"] - 0.1, 2)
TOTAL = round(T["n3"] + D["n3"] + 1.1, 2)

AUDIO = [  # file, start, volume, track, options (quiet: the user's track carries the reel)
    (A + "n1.wav", T["n1"], 1.0, 1, {}),
    (A + "n2.wav", T["n2"], 1.0, 1, {}),
    (A + "n3.wav", T["n3"], 1.0, 1, {}),
    (SFX + "tbd_pad_2.wav", 0.0, 0.22, 10, {"fin": 0.6, "fout": 1.5}),
    (SFX + "ambi_glass_hum.wav", 0.4, 0.16, 11, {"fout": 1.5}),
    (SFX + "perc_swoosh.wav", T["push"] - 0.1, 0.45, 12, {}),
    (SFX + "tabla_na_o.wav", PAGES[0], 0.5, 13, {}),
    (SFX + "tabla_te1.wav", PAGES[1], 0.5, 14, {}),
    (SFX + "tabla_dhec.wav", PAGES[2], 0.5, 15, {}),
    (SFX + "guit_harmonics.wav", PAGES[3], 0.35, 16, {"fout": 0.8}),
    (SFX + "ambi_swoosh.wav", T["grid"] - 0.2, 0.4, 17, {}),
    (SFX + "ambi_piano.wav", T["grid"] + 0.1, 0.25, 18, {"fout": 2.0}),
    (SFX + "elec_chime.wav", T["cta"] + 0.3, 0.25, 19, {}),
]

GOLD, RUBY, EMERALD, CREAM = "#e8b84a", "#b3122e", "#0f7a5a", "#fff1d6"


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


def wheel_svg():
    """An original golden wheel of the twelve months: lotus petals, gems, a glowing peacock-feather eye at the hub."""
    parts = []
    for k, (m, _, _) in enumerate(MONTHS):
        a = math.radians(k * 30 - 90)
        a1, a2 = math.radians(k * 30 - 90 - 13), math.radians(k * 30 - 90 + 13)
        r0, r1 = 230, 470
        x0, y0 = 540 + r0 * math.cos(a), 960 + r0 * math.sin(a)
        xt, yt = 540 + (r1 + 40) * math.cos(a), 960 + (r1 + 40) * math.sin(a)
        xa, ya = 540 + r1 * math.cos(a1), 960 + r1 * math.sin(a1)
        xb, yb = 540 + r1 * math.cos(a2), 960 + r1 * math.sin(a2)
        parts.append(f'<path d="M{x0:.0f} {y0:.0f} Q{xa:.0f} {ya:.0f} {xt:.0f} {yt:.0f} Q{xb:.0f} {yb:.0f} {x0:.0f} {y0:.0f}Z" '
                     f'fill="url(#petal)" stroke="{GOLD}" stroke-width="3"/>')
        xl, yl = 540 + 375 * math.cos(a), 960 + 375 * math.sin(a)
        parts.append(f'<text x="{xl:.0f}" y="{yl + 12:.0f}" text-anchor="middle" font-family="Cinzel" font-size="34" '
                     f'font-weight="700" fill="{CREAM}" transform="rotate({k * 30} {xl:.0f} {yl:.0f})">{m}</text>')
        xg, yg = 540 + 560 * math.cos(a + math.radians(15)), 960 + 560 * math.sin(a + math.radians(15))
        parts.append(f'<circle cx="{xg:.0f}" cy="{yg:.0f}" r="13" fill="{RUBY if k % 2 else EMERALD}" stroke="{GOLD}" stroke-width="4"/>')
    return f'''<svg viewBox="0 -120 1080 1920" width="1080" height="1920" style="position:absolute;left:0;top:0;overflow:visible">
  <defs>
    <radialGradient id="petal" cx="0.5" cy="0.5" r="0.7"><stop offset="0" stop-color="#5a0d1c"/><stop offset="1" stop-color="#2a0610"/></radialGradient>
    <radialGradient id="halo"><stop offset="0" stop-color="rgba(255,190,90,0.6)"/><stop offset="0.6" stop-color="rgba(232,140,40,0.18)"/><stop offset="1" stop-color="rgba(255,150,40,0)"/></radialGradient>
    <radialGradient id="eye"><stop offset="0" stop-color="#0b1f4d"/><stop offset="0.55" stop-color="#1e5aa8"/><stop offset="0.75" stop-color="#16805a"/><stop offset="0.9" stop-color="#d4a017"/><stop offset="1" stop-color="#7a5a12"/></radialGradient>
  </defs>
  <circle cx="540" cy="960" r="760" fill="url(#halo)"/>
  <circle cx="540" cy="960" r="560" fill="none" stroke="{GOLD}" stroke-width="5"/>
  <circle cx="540" cy="960" r="590" fill="none" stroke="{GOLD}" stroke-width="2" stroke-dasharray="4 14"/>
  {''.join(parts)}
  <circle cx="540" cy="960" r="215" fill="#1a050b" stroke="{GOLD}" stroke-width="6"/>
  <ellipse cx="540" cy="960" rx="120" ry="150" fill="#1f6b4f"/>
  <ellipse cx="540" cy="972" rx="94" ry="118" fill="url(#eye)"/>
  <ellipse cx="540" cy="992" rx="40" ry="54" fill="#0b1f4d"/>
  <ellipse cx="548" cy="980" rx="11" ry="14" fill="rgba(255,255,255,0.35)"/>
</svg>'''


def card(i, k, m, name, meaning, y):
    return (f'    <div id="c{i}" class="card" style="top: {y}px;">'
            f'<div class="gem g1"></div><div class="gem g2"></div><div class="gem g3"></div><div class="gem g4"></div>'
            f'<div class="badge">{m}</div><div class="txt"><div class="nm">{name}</div><div class="mn">{meaning}</div></div></div>\n')


def scene():
    rnd = random.Random(16)
    css = f'''    @font-face {{
      font-family: "Cinzel";
      src: url("assets/fonts/Cinzel.ttf");
    }}
    @font-face {{
      font-family: "Cormorant";
      font-style: italic;
      src: url("assets/fonts/Cormorant-Italic.ttf");
    }}
    @font-face {{
      font-family: "Nunito";
      src: url("assets/fonts/Nunito.ttf");
    }}
    @font-face {{
      font-family: "Noto Color Emoji";
      src: url("assets/fonts/NotoColorEmoji.ttf");
    }}
    #bg {{
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse at 50% 45%, #3a0a16 0%, #1a040a 55%, #070103 100%);
    }}
    .dust {{
      position: absolute;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #ffd27a;
      box-shadow: 0 0 10px 3px rgba(255, 190, 90, 0.6);
    }}
    #wheel {{
      position: absolute;
      inset: 0;
    }}
    .hook {{
      position: absolute;
      left: 60px;
      width: 960px;
      text-align: center;
      font-family: "Cinzel", serif;
      font-weight: 700;
      color: {CREAM};
      text-shadow: 0 4px 18px rgba(0, 0, 0, 0.95);
    }}
    #h1 {{
      top: 110px;
      font-size: 60px;
      line-height: 1.2;
    }}
    #h1 b {{
      color: {GOLD};
    }}
    #head {{
      top: 200px;
      font-size: 44px;
      letter-spacing: 6px;
      color: {GOLD};
    }}
    .card {{
      position: absolute;
      left: 60px;
      width: 960px;
      height: 340px;
      border-radius: 26px;
      background: linear-gradient(135deg, #4a0b18 0%, #2a0610 100%);
      border: 6px solid {GOLD};
      box-shadow: inset 0 0 0 10px #2a0610, inset 0 0 0 13px rgba(232, 184, 74, 0.7), 0 18px 40px rgba(0, 0, 0, 0.7);
    }}
    .gem {{
      position: absolute;
      width: 26px;
      height: 26px;
      border-radius: 50%;
      border: 4px solid {GOLD};
      background: {RUBY};
    }}
    .g1 {{
      left: -16px;
      top: -16px;
    }}
    .g2 {{
      right: -16px;
      top: -16px;
      background: {EMERALD};
    }}
    .g3 {{
      left: -16px;
      bottom: -16px;
      background: {EMERALD};
    }}
    .g4 {{
      right: -16px;
      bottom: -16px;
    }}
    .badge {{
      position: absolute;
      left: 44px;
      top: 90px;
      width: 160px;
      height: 160px;
      border-radius: 50%;
      background: radial-gradient(circle at 40% 35%, #ffe08a 0%, {GOLD} 55%, #9a6b12 100%);
      color: #3a0610;
      font-family: "Cinzel", serif;
      font-weight: 700;
      font-size: 48px;
      line-height: 160px;
      text-align: center;
    }}
    .txt {{
      position: absolute;
      left: 240px;
      top: 0;
      width: 680px;
      height: 340px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }}
    .nm {{
      font-family: "Cinzel", serif;
      font-weight: 700;
      font-size: 82px;
      color: {GOLD};
      line-height: 1.05;
    }}
    .mn {{
      font-family: "Cormorant", serif;
      font-style: italic;
      font-size: 56px;
      color: {CREAM};
      line-height: 1.1;
      margin-top: 8px;
    }}
    #grid {{
      position: absolute;
      inset: 0;
    }}
    .tile {{
      position: absolute;
      width: 316px;
      height: 260px;
      border-radius: 20px;
      background: linear-gradient(135deg, #4a0b18 0%, #2a0610 100%);
      border: 4px solid {GOLD};
      text-align: center;
    }}
    .tm {{
      margin-top: 44px;
      font-family: "Cinzel", serif;
      font-weight: 700;
      font-size: 38px;
      color: {CREAM};
      letter-spacing: 4px;
    }}
    .tn {{
      margin-top: 22px;
      font-family: "Cinzel", serif;
      font-weight: 700;
      font-size: 40px;
      color: {GOLD};
    }}
    #cta {{
      position: absolute;
      left: 40px;
      width: 1000px;
      top: 1570px;
      text-align: center;
      font-family: "Nunito", "Noto Color Emoji", sans-serif;
      font-weight: 800;
      font-size: 64px;
      line-height: 1.25;
      color: #ffffff;
      text-shadow: 0 4px 16px rgba(0, 0, 0, 0.95);
    }}
    #cta b {{
      color: {GOLD};
    }}
'''
    html = f'    <div id="bg" class="clip" data-start="0" data-duration="{TOTAL}" data-track-index="0"></div>\n'
    js = ""
    # gold dust rising slowly through the whole reel (never on a beat)
    html += f'    <div id="dustL" class="clip" data-start="0" data-duration="{TOTAL}" data-track-index="1" data-layout-ignore>\n'
    for k in range(36):
        x0, y0 = rnd.randint(0, 1070), rnd.randint(300, 1950)
        html += f'      <div id="d{k}" class="dust" style="left: {x0}px; top: {y0}px; opacity: 0;"></div>\n'
        js += (f'    tl.fromTo("#d{k}", {{ x: 0, y: 0, opacity: 0.8 }}, {{ x: {rnd.randint(-60, 60)}, y: {-rnd.randint(250, 700)}, '
               f'opacity: 0, duration: {rnd.uniform(6, 10):.2f}, repeat: 3, ease: "none" }}, {rnd.uniform(0, 4):.2f});\n')
    html += '    </div>\n'
    # the hook: an epic golden wheel turning slowly; at the push the camera flies through its hub
    html += f'    <div id="wheel" class="clip" data-start="0" data-duration="{T["push"] + 0.9:.2f}" data-track-index="2">{wheel_svg()}</div>\n'
    js += f'    tl.fromTo("#wheel", {{ rotation: -20, scale: 1.08, transformOrigin: "540px 1080px" }}, {{ rotation: 10, scale: 1.0, duration: {T["push"]:.2f}, ease: "spring-glide" }}, 0);\n'
    js += f'    tl.to("#wheel", {{ scale: 3.2, opacity: 0, duration: 0.9, ease: "power2.in" }}, {T["push"]:.2f});\n'
    html += f'    <div id="h1" class="clip hook" data-start="0" data-duration="{T["push"] + 0.4:.2f}" data-track-index="3">Your birth month already<br>chose one of <b>His names.</b></div>\n'
    js += f'    tl.to("#h1", {{ opacity: 0, y: -30, duration: 0.35, ease: "power1.in" }}, {T["push"]:.2f});\n'
    # four pages of three cards
    html += f'    <div id="head" class="clip hook" data-start="{PAGES[0]:.2f}" data-duration="{T["grid"] - PAGES[0]:.2f}" data-track-index="4">FIND YOUR MONTH</div>\n'
    js += f'    tl.fromTo("#head", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.5, ease: "sine.out" }}, {PAGES[0]:.2f});\n'
    js += f'    tl.to("#head", {{ opacity: 0, duration: 0.3, ease: "power1.in" }}, {T["grid"] - 0.35:.2f});\n'
    for p, t0 in enumerate(PAGES):
        html += f'    <div id="p{p}" class="clip" data-start="{t0 - 0.1:.2f}" data-duration="{PAGE + 0.1:.2f}" data-track-index="{5 + p % 2}">\n'
        for j in range(3):
            i = p * 3 + j
            m, name, meaning = MONTHS[i]
            html += "  " + card(i, j, m, name, meaning, 400 + j * 400)
            a = t0 - 0.05 + j * STAGGER
            js += (f'    tl.fromTo("#c{i}", {{ opacity: 0, x: 220, rotationY: -35, transformPerspective: 1400 }}, '
                   f'{{ opacity: 1, x: 0, rotationY: 0, duration: 0.7, ease: "spring-settle" }}, {a:.2f});\n')
            js += f'    tl.to("#c{i}", {{ opacity: 0, x: -160, duration: 0.3, ease: "power1.in" }}, {t0 + PAGE - 0.3 + j * 0.03:.2f});\n'
        html += '    </div>\n'
    # all twelve on one screen to pause and screenshot
    html += f'    <div id="grid" class="clip" data-start="{T["grid"]:.2f}" data-duration="{TOTAL - T["grid"]:.2f}" data-track-index="7">\n'
    for i, (m, name, _) in enumerate(MONTHS):
        c, r = i % 3, i // 3
        x, y = 60 + c * 332, 330 + r * 290
        html += f'      <div id="t{i}" class="tile" style="left: {x}px; top: {y}px;"><div class="tm">{m}</div><div class="tn">{name}</div></div>\n'
        js += f'    tl.fromTo("#t{i}", {{ opacity: 0, scale: 0.8 }}, {{ opacity: 1, scale: 1, duration: 0.55, ease: "spring-snap" }}, {T["grid"] + 0.06 * i:.2f});\n'
    html += '    </div>\n'
    html += f'    <div id="pause" class="clip hook" data-start="{T["grid"]:.2f}" data-duration="{TOTAL - T["grid"]:.2f}" data-track-index="8" style="top: 160px; font-size: 58px; color: {GOLD};">Pause. Find yours.</div>\n'
    js += f'    tl.fromTo("#pause", {{ opacity: 0, y: 20 }}, {{ opacity: 1, y: 0, duration: 0.5, ease: "spring-land" }}, {T["grid"] + 0.3:.2f});\n'
    html += (f'    <div id="cta" class="clip" data-start="{T["cta"]:.2f}" data-duration="{TOTAL - T["cta"]:.2f}" data-track-index="9">'
             f'Comment <b>your name</b> 👇<br><span style="font-size: 40px; font-weight: 700; color: #f3dcae">@lordsrikrishnatemple</span></div>\n')
    js += f'    tl.fromTo("#cta", {{ opacity: 0, y: 30 }}, {{ opacity: 1, y: 0, duration: 0.6, ease: "spring-settle" }}, {T["cta"]:.2f});\n'
    return wrap("scene", css, html, js)


def index():
    audio = ""
    for i, (f, st, vol, tr, o) in enumerate(AUDIO):
        du = min(dur(f), TOTAL - st)
        extra = f' data-fade-in="{o["fin"]}"' if "fin" in o else ""
        extra += f' data-fade-out="{o["fout"]}"' if "fout" in o else ""
        audio += f'      <audio id="a{i}" class="clip" src="{f}" data-start="{st:.3f}" data-duration="{du:.3f}" data-volume="{vol}" data-track-index="{tr}"{extra}></audio>\n'
    return f'''<!doctype html>
<html lang="en" data-resolution="portrait">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width={W}, height={H}" />
    <script src="assets/gsap.min.js"></script>
    <script src="assets/springs.js"></script>
    <style>
      /* Day 16 (English) · Your birth month, His name. Quiz format, Tanjore night look, {TOTAL}s. */
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
        background: #070103;
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

      <!-- Free voice (edge-tts narrator_en); effects: CC0 Sonic Pi samples. The user adds a calm track in Instagram. -->
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
    print("built", TOTAL, "s;", T, "pages", PAGES)
