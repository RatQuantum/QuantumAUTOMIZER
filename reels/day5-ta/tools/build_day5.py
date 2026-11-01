"""Day 5 (Tamil): "when everyone leaves you, Krishna drives your chariot". A cinematic reel modelled on the
user's reference: moving shots with real-looking faces, a film grade, a deep Tamil narration in two voices, one
Tamil line on screen at a time with one word in gold, a score that turns from despair to hope at 9 s.

Run from reels/day5-ta:  python3 tools/build_day5.py
The shots are videos made for free on the CPU: the two wide shots with tools/parallax.py (depth-based dolly),
the two faces with LivePortrait (open source) driven by its calm expression templates.
"""
import random

TOTAL = 20.0
TURN = 9.0  # the impact: everything changes from despair to hope here
# video, start, duration, scale from, scale to (a slow push on top of the shot's own motion)
SHOTS = [
    ("assets/video/v1-arjuna-alone.mp4", 0.0, 5.3, 1.0, 1.03),
    ("assets/video/v2-arjuna-face.mp4", 5.3, 3.7, 1.0, 1.06),
    ("assets/video/v3-krishna-chariot.mp4", 9.0, 4.8, 1.0, 1.03),
    ("assets/video/v4-krishna-face.mp4", 13.8, 6.2, 1.0, 1.06),
]
# Tamil line, start, end; <b> marks the gold word. Times follow the voice (narrator at 0.4 s, Krishna at 9.6 s).
LINES = [
    ("ஒரு நாள்…<br>எல்லோரும் உன்னைக் <b>கைவிடுவார்கள்</b>.", 0.0, 5.1),
    ("நீ நம்பியவர்கள் <b>கூட</b>.", 5.7, 8.8),
    ("அன்று… உன் தேரை<br><b>நான்</b> ஓட்டுவேன்.", 9.5, 13.7),
    ("நீ தனியாக இல்லை.<br><b>கவலைப்படாதே.</b>", 14.6, 17.9),
    ('கமெண்ட்டில் <b>"கிருஷ்ணா"</b> 🙏', 18.1, TOTAL),
]
AUDIO = [  # file, start, volume, track
    ("assets/audio/score.wav", 0.0, 0.42, 6),
    ("assets/audio/vo-narrator.wav", 0.4, 1.0, 7),
    ("assets/audio/vo-krishna.wav", 9.6, 1.0, 7),
    ("assets/audio/wind.wav", 0.0, 0.3, 8),
    ("assets/audio/impact.wav", TURN - 1.27, 0.55, 9),   # its boom peaks 1.27 s in
    ("assets/audio/chariot.wav", TURN + 0.2, 0.3, 10),
]
HANDLE = "@lordsrikrishnatemple"
# NO_MUSIC=1 builds the version without the score, to put a trending Instagram sound under it in the app
import os
if os.environ.get("NO_MUSIC"):
    AUDIO = [a for a in AUDIO if "score" not in a[0]]


def wrap(cid, css, html, js):
    return f'''<template>
  <style>
    #root {{
      position: absolute;
      inset: 0;
      overflow: hidden;
    }}
{css}  </style>
  <div id="root" data-composition-id="{cid}" data-width="1080" data-height="1920">
{html}  </div>
  <script>
    const tl = gsap.timeline({{ paused: true }});
{js}    window.__timelines["{cid}"] = tl;
  </script>
</template>
'''


def shots():
    css = '''    .shot {
      position: absolute;
      left: 0;
      top: 0;
      width: 1080px;
      height: 1920px;
      object-fit: cover;
      transform-origin: 50% 45%;
    }
'''
    html = js = ""
    for i, (src, st, du, s0, s1) in enumerate(SHOTS):
        html += f'    <video id="v{i}" class="clip shot" src="{src}" muted playsinline data-start="{st}" data-duration="{du}" data-track-index="{i % 2}"></video>\n'
        js += f'    tl.fromTo("#v{i}", {{ scale: {s0} }}, {{ scale: {s1}, duration: {du}, ease: "none" }}, {st});\n'
    return wrap("shots", css, html, js)


def fx():
    rnd = random.Random(5)
    css = '''    #vignette {
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse at 50% 42%, rgba(0, 0, 0, 0) 45%, rgba(0, 0, 0, 0.7));
    }
    #burst {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 50% 30%, #fff8e1, #ffd27a 35%, rgba(255, 170, 60, 0) 75%);
      opacity: 0;
    }
    #rays {
      position: absolute;
      left: -420px;
      top: -1150px;
      width: 1920px;
      height: 1920px;
      background: repeating-conic-gradient(from 0deg, rgba(255, 220, 150, 0.2) 0deg 5deg, rgba(255, 220, 150, 0) 5deg 15deg);
      mix-blend-mode: screen;
      -webkit-mask-image: radial-gradient(circle, #000 12%, transparent 62%);
      mask-image: radial-gradient(circle, #000 12%, transparent 62%);
      opacity: 0;
    }
    .ember {
      position: absolute;
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #ffb347;
      box-shadow: 0 0 10px 3px rgba(255, 140, 40, 0.8);
    }
'''
    html = f'    <div id="vignette" class="clip" data-start="0" data-duration="{TOTAL}" data-track-index="0" data-layout-ignore></div>\n'
    html += f'    <div id="rays" class="clip" data-start="{TURN}" data-duration="{TOTAL - TURN}" data-track-index="1" data-layout-ignore></div>\n'
    html += f'    <div id="burst" class="clip" data-start="{TURN - 0.1}" data-duration="1.4" data-track-index="2" data-layout-ignore></div>\n'
    js = f'    tl.fromTo("#rays", {{ opacity: 0, rotation: 0 }}, {{ opacity: 1, rotation: 25, duration: {TOTAL - TURN}, ease: "power1.out" }}, {TURN});\n'
    js += f'    tl.fromTo("#burst", {{ opacity: 0 }}, {{ opacity: 0.95, duration: 0.12, ease: "power2.in" }}, {TURN - 0.1});\n'
    js += f'    tl.to("#burst", {{ opacity: 0, duration: 1.1, ease: "power2.out" }}, {TURN + 0.05});\n'
    html += f'    <div id="embers" class="clip" data-start="0" data-duration="{TOTAL}" data-track-index="3" data-layout-ignore>\n'
    for i in range(36):
        start = round(rnd.uniform(-4, TOTAL - 1), 2)
        rise = round(rnd.uniform(3.5, 6.5), 2)
        x = rnd.randint(30, 1050)
        drift = rnd.choice([-1, 1]) * rnd.randint(40, 180)
        sc = round(rnd.uniform(0.5, 1.4), 2)
        y0 = 1980 if start >= 0 else int(1980 - 2100 * (-start / rise))
        at, dur = (start, rise) if start >= 0 else (0, round(rise + start, 2))
        html += f'      <div id="e{i}" class="ember" style="left: {x}px; top: 0; transform: scale({sc});"></div>\n'
        js += f'    tl.fromTo("#e{i}", {{ y: {y0}, x: 0, opacity: 0.9 }}, {{ y: -120, x: {drift}, opacity: 0.2, duration: {dur}, ease: "none" }}, {at});\n'
    html += '    </div>\n'
    return wrap("fx", css, html, js)


def texts():
    css = '''    @font-face {
      font-family: "Noto Sans Tamil";
      src: url("assets/fonts/NotoSansTamil.ttf");
    }
    @font-face {
      font-family: "Noto Color Emoji";
      src: url("assets/fonts/NotoColorEmoji.ttf");
    }
    .line {
      position: absolute;
      left: 70px;
      width: 940px;
      top: 1240px;
      text-align: center;
      font-family: "Noto Sans Tamil", "Noto Color Emoji", sans-serif;
      font-weight: 700;
      font-size: 62px;
      line-height: 1.4;
      color: #ffffff;
      text-shadow: 0 3px 6px rgba(0, 0, 0, 0.95), 0 0 30px rgba(0, 0, 0, 0.8);
    }
    .line b {
      color: #ffd34d;
    }
    #handle {
      position: absolute;
      left: 0;
      width: 1080px;
      top: 1470px;
      text-align: center;
      font-family: "Noto Sans Tamil", sans-serif;
      font-size: 34px;
      color: #ffe7b0;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);
    }
'''
    html = js = ""
    for i, (txt, a, b) in enumerate(LINES):
        html += f'    <div id="t{i}" class="clip line" data-start="{a}" data-duration="{b - a:.2f}" data-track-index="{i % 2}">{txt}</div>\n'
        if a > 0:  # the first line is already on screen at frame 0: it is the thumbnail
            js += f'    tl.fromTo("#t{i}", {{ opacity: 0, y: 24, filter: "blur(6px)" }}, {{ opacity: 1, y: 0, filter: "blur(0px)", duration: 0.5, ease: "power2.out" }}, {a});\n'
        if b < TOTAL:
            js += f'    tl.to("#t{i}", {{ opacity: 0, duration: 0.3, ease: "power1.in" }}, {b - 0.3:.2f});\n'
    html += f'    <div id="handle" class="clip" data-start="18.4" data-duration="{TOTAL - 18.4:.1f}" data-track-index="2">{HANDLE}</div>\n'
    js += '    tl.fromTo("#handle", { opacity: 0 }, { opacity: 1, duration: 0.4 }, 18.4);\n'
    return wrap("texts", css, html, js)


def index():
    layers = "\n".join(
        f'      <div id="{c}" data-composition-id="{c}" data-composition-src="compositions/{c}.html" data-start="0" data-duration="{TOTAL}" data-track-index="{n}" data-track-kind="{k}" data-width="1080" data-height="1920"></div>'
        for n, (c, k) in enumerate([("shots", "graphics"), ("fx", "graphics"), ("texts", "captions")], start=1))
    audio = ""
    for i, (f, st, vol, tr) in enumerate(AUDIO):
        import subprocess
        du = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f],
                                  capture_output=True, text=True, check=True).stdout)
        du = min(du, TOTAL - st)
        audio += f'      <audio id="a{i}" class="clip" src="{f}" data-start="{st:.2f}" data-duration="{du:.2f}" data-volume="{vol}" data-track-index="{tr}"></audio>\n'
    return f'''<!doctype html>
<html lang="ta" data-resolution="portrait">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <script src="assets/gsap.min.js"></script>
    <style>
      /* Day 5 (Tamil) · Krishna drives your chariot, {TOTAL}s. Cinematic: dusk and crimson, then divine gold at {TURN}s. */
      * {{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }}
      html,
      body {{
        margin: 0;
        width: 1080px;
        height: 1920px;
        overflow: hidden;
        background: #000000;
      }}
      #root {{
        width: 100%;
        height: 100%;
      }}
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="{TOTAL}" data-width="1080" data-height="1920">
{layers}

      <!-- Voices: ElevenLabs eleven_v4, "Bharadwaj" (narrator) and "Ramaa" (Krishna). Score and effects: ElevenLabs Music and Sound Effects. -->
{audio}    </div>
    <script>
      window.__timelines = window.__timelines || {{}};
      window.__timelines["main"] = gsap.timeline({{ paused: true }});
    </script>
  </body>
</html>
'''


if __name__ == "__main__":
    for name, fn in (("shots", shots), ("fx", fx), ("texts", texts)):
        open(f"compositions/{name}.html", "w", encoding="utf-8").write(fn())
    open("index.html", "w", encoding="utf-8").write(index())
    print("built", TOTAL, "s")
