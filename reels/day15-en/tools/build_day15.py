"""Day 15 (English): "He came. Every time." · format K, a saga montage (new), built with the /krishna-reel pipeline.
References (the user's two reels: an epic Ganesha action film and a Krishna life saga) were studied for their grammar:
photoreal epic shots, fire-gold against deep teal, macro symbol inserts, a hero ending, music-led with few words.
Footage: our own earlier AI shots (Days 5-8, no user-face clips). Opening: an original code-drawn peacock feather.
Track: ZAKHELO (Slowed), measured with tools/beats.py: 70.6 BPM (bar 1.699 s), drop at 0:14.95 in the song.
The reel's drop is 6.0 s, so the song starts at 0:09.0 in Instagram. Cuts and words land on DOWNBEATS only;
no shakes or pulses on the beat (rule 7e); every shot holds 2 bars (3.4 s) so it can be seen (rule 7g/7h).

Run from reels/day15-en:  python3 tools/build_day15.py && npm run check && npm run render
"""
import math
import random
import subprocess

W, H = 1080, 1920
DROP = 6.0
BAR = 1.6987                      # measured: 4 tracked beats of 0.4247 s (double-time 141.3 BPM = 70.6 BPM half-time)


def D(n):                         # downbeat n relative to the drop (n may be negative)
    return round(DROP + n * BAR, 3)


TOTAL = round(D(14) + 0.2, 2)     # about 30 s
SHOTS = [  # file, start, duration
    ("assets/video/s1-silk.mp4", D(0), 2 * BAR),
    ("assets/video/s2-storm.mp4", D(2), 2 * BAR),
    ("assets/video/s3a-doors.mp4", D(4), BAR),
    ("assets/video/s3b-runs.mp4", D(5), BAR),
    ("assets/video/s4-arjuna.mp4", D(6), 2 * BAR),
    ("assets/video/s5-krishna.mp4", D(8), 4 * BAR),
]
WORDS = [  # text, start, end, style
    ("Every time", 0.0, D(-2), "pre"),
    ("the world<br>called Him…", D(-2), DROP - 0.05, "pre"),
    ("When the court<br>went silent —", D(0) + 0.15, D(2) - 0.1, "line"),
    ("When the storm<br>came —", D(2) + 0.15, D(4) - 0.1, "line"),
    ("When a friend<br>had nothing —", D(4) + 0.15, D(6) - 0.1, "line"),
    ("When the warrior<br>broke —", D(6) + 0.15, D(8) - 0.1, "line"),
    ("He came.", D(8), D(10) - 0.1, "big"),
    ("Every time.", D(10), D(11) - 0.1, "big2"),
    ("He still does.", D(11), D(12) - 0.1, "big2"),
]
CTA_T = D(12)
SFX = "assets/sfx/"
AUDIO = [  # file, start, volume, track, options  (quiet: the user's track carries the reel)
    (SFX + "ambi_drone.wav", 0.0, 0.25, 10, {"fin": 0.4, "fout": 1.2}),
    (SFX + "ambi_glass_rub.wav", 0.2, 0.3, 11, {"fout": 1.0}),
    (SFX + "ambi_dark_woosh.wav", DROP - 1.27, 0.4, 12, {}),
    (SFX + "perc_impact1.wav", DROP, 0.6, 13, {}),
    (SFX + "ambi_lunar_land.wav", D(6), 0.25, 14, {"fin": 0.5, "fout": 1.0}),
    (SFX + "misc_cineboom.wav", D(8), 0.4, 15, {"fout": 1.5}),
    (SFX + "tabla_ghe3.wav", CTA_T, 0.5, 16, {"fout": 0.6}),
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


def feather_svg():
    """An original, detailed peacock feather (macro), drawn with barbs around a jewel-toned eye."""
    rnd = random.Random(15)
    barbs = []
    for k in range(70):
        y = 1500 - k * 16
        spread = 60 + 260 * math.sin(math.pi * min(k / 62, 1)) if k < 62 else 60
        for side in (-1, 1):
            x2 = 540 + side * spread * rnd.uniform(0.85, 1.0)
            y2 = y - 120 - rnd.uniform(0, 40)
            col = rnd.choice(["#1f6b4f", "#2e8b57", "#3a9d6a", "#b8952e"])
            barbs.append(f'<path d="M540 {y} Q{540 + side * spread * 0.5:.0f} {y - 40} {x2:.0f} {y2:.0f}" stroke="{col}" stroke-width="2.2" fill="none" opacity="0.75"/>')
    return f'''<svg viewBox="0 0 1080 1920" width="1080" height="1920" style="position:absolute;left:0;top:0">
  <defs>
    <radialGradient id="eyeA"><stop offset="0" stop-color="#0b1f4d"/><stop offset="0.55" stop-color="#1e5aa8"/><stop offset="0.75" stop-color="#16805a"/><stop offset="0.9" stop-color="#d4a017"/><stop offset="1" stop-color="#7a5a12"/></radialGradient>
    <radialGradient id="glow"><stop offset="0" stop-color="rgba(255,190,90,0.55)"/><stop offset="1" stop-color="rgba(255,150,40,0)"/></radialGradient>
  </defs>
  <circle cx="540" cy="700" r="620" fill="url(#glow)"/>
  <g id="feather">
    <path d="M540 1900 Q548 1200 540 380" stroke="#e6c46a" stroke-width="6" fill="none"/>
    {''.join(barbs)}
    <ellipse cx="540" cy="560" rx="150" ry="190" fill="#1f6b4f"/>
    <ellipse cx="540" cy="575" rx="118" ry="150" fill="url(#eyeA)"/>
    <ellipse cx="540" cy="600" rx="52" ry="70" fill="#0b1f4d"/>
    <ellipse cx="548" cy="585" rx="14" ry="18" fill="rgba(255,255,255,0.35)"/>
  </g>
</svg>'''


def scene():
    rnd = random.Random(150)
    css = '''    @font-face {
      font-family: "Cinzel";
      src: url("assets/fonts/Cinzel.ttf");
    }
    @font-face {
      font-family: "Cormorant";
      font-style: italic;
      src: url("assets/fonts/Cormorant-Italic.ttf");
    }
    @font-face {
      font-family: "Nunito";
      src: url("assets/fonts/Nunito.ttf");
    }
    @font-face {
      font-family: "Noto Color Emoji";
      src: url("assets/fonts/NotoColorEmoji.ttf");
    }
    #bg {
      position: absolute;
      inset: 0;
      background: #050302;
    }
    #intro {
      position: absolute;
      inset: 0;
    }
    .shot {
      position: absolute;
      left: 0;
      top: 0;
      width: 1080px;
      height: 1920px;
      object-fit: cover;
    }
    #grade {
      position: absolute;
      inset: 0;
      background:
        radial-gradient(ellipse at 50% 40%, rgba(0, 0, 0, 0) 45%, rgba(0, 0, 0, 0.55) 100%),
        linear-gradient(180deg, rgba(0, 0, 0, 0) 55%, rgba(0, 0, 0, 0.75) 100%);
      pointer-events: none;
    }
    .ember {
      position: absolute;
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: #ffb347;
      box-shadow: 0 0 10px 3px rgba(255, 150, 50, 0.8);
    }
    .w {
      position: absolute;
      left: 40px;
      width: 1000px;
      text-align: center;
      color: #fff6e6;
      text-shadow: 0 4px 18px rgba(0, 0, 0, 0.95);
    }
    .pre {
      top: 1330px;
      font-family: "Cormorant", serif;
      font-style: italic;
      font-weight: 600;
      font-size: 84px;
      line-height: 1.1;
    }
    .line {
      top: 1420px;
      font-family: "Cinzel", serif;
      font-weight: 700;
      font-size: 64px;
      line-height: 1.18;
      letter-spacing: 2px;
    }
    .big {
      top: 1330px;
      font-family: "Cinzel", serif;
      font-weight: 700;
      font-size: 132px;
      color: #ffd56a;
      text-shadow: 0 0 34px rgba(255, 170, 60, 0.7), 0 6px 20px rgba(0, 0, 0, 0.95);
    }
    .big2 {
      top: 1360px;
      font-family: "Cormorant", serif;
      font-style: italic;
      font-weight: 600;
      font-size: 96px;
      color: #fff1d0;
    }
    #flash {
      position: absolute;
      inset: 0;
      background: #fff4d6;
      opacity: 0;
    }
    #cta {
      position: absolute;
      left: 40px;
      width: 1000px;
      top: 1300px;
      text-align: center;
      font-family: "Nunito", "Noto Color Emoji", sans-serif;
      font-weight: 800;
      font-size: 68px;
      line-height: 1.25;
      color: #ffffff;
      text-shadow: 0 4px 16px rgba(0, 0, 0, 0.95);
    }
    #cta b {
      color: #ffd56a;
    }
'''
    html = f'    <div id="bg" class="clip" data-start="0" data-duration="{TOTAL}" data-track-index="0"></div>\n'
    js = ""
    # the opening: a macro peacock feather turning slowly in gold light, embers rising (pre-drop, and again under the ask)
    html += f'    <div id="intro" class="clip" data-start="0" data-duration="{DROP + 0.05:.2f}" data-track-index="1">{feather_svg()}</div>\n'
    js += f'    tl.fromTo("#intro", {{ scale: 1.35, rotation: -8, transformOrigin: "540px 620px" }}, {{ scale: 1.05, rotation: 4, duration: {DROP}, ease: "spring-glide" }}, 0);\n'
    html += f'    <div id="outro" class="clip" data-start="{CTA_T - 0.3:.2f}" data-duration="{TOTAL - CTA_T + 0.3:.2f}" data-track-index="1">{feather_svg().replace("id=", "data-x=")}</div>\n'
    js += f'    tl.fromTo("#outro", {{ opacity: 0.7, scale: 1.0, transformOrigin: "540px 620px" }}, {{ opacity: 1, scale: 1.12, duration: {TOTAL - CTA_T + 0.3:.2f}, ease: "none" }}, {CTA_T - 0.3:.2f});\n'
    html += f'    <div id="embers" class="clip" data-start="0" data-duration="{TOTAL}" data-track-index="2" data-layout-ignore>\n'
    for k in range(40):
        x0, y0 = rnd.randint(0, 1070), rnd.randint(500, 1950)
        dx, dy = rnd.randint(-90, 90), -rnd.randint(300, 900)
        html += f'      <div id="e{k}" class="ember" style="left: {x0}px; top: {y0}px;"></div>\n'
        js += f'    tl.fromTo("#e{k}", {{ x: 0, y: 0, opacity: 0.9 }}, {{ x: {dx}, y: {dy}, opacity: 0.0, duration: {rnd.uniform(5, 9):.2f}, repeat: 3, ease: "none" }}, {rnd.uniform(0, 3):.2f});\n'
    html += '    </div>\n'
    # the montage: hard cuts on downbeats, a slow push inside each shot (the camera glides; it never pulses)
    for k, (src, st, du) in enumerate(SHOTS):
        html += (f'    <video id="v{k}" class="clip shot" src="{src}" muted playsinline data-start="{st:.3f}" '
                 f'data-duration="{du + (0.2 if k == 5 else 0.03):.3f}" data-track-index="{3 + k % 2}"></video>\n')
        js += f'    tl.fromTo("#v{k}", {{ scale: 1.0 }}, {{ scale: 1.06, duration: {du:.3f}, ease: "none" }}, {st:.3f});\n'
    js += f'    tl.to("#v5", {{ opacity: 0, duration: 0.7, ease: "sine.inOut" }}, {CTA_T - 0.5:.3f});\n'
    js += f'    tl.to("#v5", {{ filter: "brightness(0.55)", duration: {BAR:.2f}, ease: "sine.inOut" }}, {D(11):.3f});\n'
    html += f'    <div id="grade" class="clip" data-start="0" data-duration="{TOTAL}" data-track-index="5"></div>\n'
    # the single flash: on the drop only
    html += f'    <div id="flash" class="clip" data-start="{DROP - 0.04:.3f}" data-duration="0.6" data-track-index="6"></div>\n'
    js += f'    tl.fromTo("#flash", {{ opacity: 0.85 }}, {{ opacity: 0, duration: 0.55, ease: "power2.out" }}, {DROP - 0.04:.3f});\n'
    # the words: land on their downbeat with a spring, leave quickly before the next
    for k, (txt, a, b, style) in enumerate(WORDS):
        html += f'    <div id="t{k}" class="clip w {style}" data-start="{a:.3f}" data-duration="{b - a:.3f}" data-track-index="{7 + k % 2}">{txt}</div>\n'
        if a > 0:
            ease = "spring-land"
            js += f'    tl.fromTo("#t{k}", {{ opacity: 0, y: 40, scale: 0.94 }}, {{ opacity: 1, y: 0, scale: 1, duration: 0.55, ease: "{ease}" }}, {a:.3f});\n'
        js += f'    tl.to("#t{k}", {{ opacity: 0, duration: 0.18, ease: "power1.in" }}, {b - 0.18:.3f});\n'
    html += (f'    <div id="cta" class="clip" data-start="{CTA_T:.3f}" data-duration="{TOTAL - CTA_T:.3f}" data-track-index="9">'
             f'Comment <b>🙏</b><br>if He came for you too<br><span style="font-size: 40px; font-weight: 700; color: #f3dcae">@lordsrikrishnatemple</span></div>\n')
    js += f'    tl.fromTo("#cta", {{ opacity: 0, y: 30 }}, {{ opacity: 1, y: 0, duration: 0.6, ease: "spring-settle" }}, {CTA_T + 0.2:.3f});\n'
    return wrap("scene", css, html, js)


def dur(f):
    return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f],
                                capture_output=True, text=True, check=True).stdout)


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
      /* Day 15 (English) · He came. Every time. A saga montage cut on the bars of ZAKHELO (Slowed), {TOTAL}s. */
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
        background: #050302;
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

      <!-- No voice: music-led (the user adds ZAKHELO (Slowed) in Instagram from 0:09.0). Effects: CC0 Sonic Pi. -->
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
    print("built", TOTAL, "s; drop", DROP, "; downbeats", [D(n) for n in range(-3, 13)])
