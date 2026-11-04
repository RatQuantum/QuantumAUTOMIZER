"""Day 7 (Tamil): Draupadi in the court, "நீ தனியாக இல்லை". The Day 5 arc (7,422 views), checked against
content/reel-rules.md: frame 0 is a tearful FACE in a dark torch-lit court with a pain line, a hard turn to gold on a
boom at 8.5 s, then Krishna's promise in his own voice and the "கிருஷ்ணா" comment ask.

Run from reels/day7-ta:  NO_MUSIC=1 python3 tools/build_day7.py && npm run check && npm run render
When the phonk/slowed track is added in the Instagram app, its drop must land at 0:08.5 (the turn).

Clips come from Google Flow (Veo 3.1, the user's Google AI Pro). Until a clip exists its shot falls back to a still
with a slow push (the source in FALLBACK), so the reel can be checked at any stage.
"""
import json
import os
import random
import subprocess

TOTAL = 18.0
TURN = 8.5  # despair -> gold: boom, flash, bell
DROP = TURN  # the fx layer (flash, rays, petals) keys off DROP
# video, fallback still, start, duration, scale from, scale to, transform origin
SHOTS_PLAN = [
    ("assets/video/v1-face.mp4", "assets/img/s1-face.png", 0.0, 4.6, 1.0, 1.05, "50% 30%"),
    ("assets/video/v2-court.mp4", "assets/img/s1-face.png", 4.5, 4.05, 1.08, 1.0, "50% 40%"),
    ("assets/video/v3-golden-silk.mp4", "assets/img/s1-face.png", TURN, 4.05, 1.0, 1.06, "50% 35%"),
    ("assets/video/v4-krishna.mp4", "assets/img/krishna-ref.png", 12.5, TOTAL - 12.5, 1.0, 1.05, "50% 25%"),
]
SHOTS = [(v if os.path.exists(v) else f, st, du, s0, s1, o) for v, f, st, du, s0, s1, o in SHOTS_PLAN]
# Tamil line, start, end; <b> marks the gold word. The first line is the thumbnail (on screen at frame 0).
LINES = [
    ("நீ அவமானப்பட்ட நாளில்…<br>எல்லோரும் <b>மௌனமாக</b> இருந்தார்கள்.", 0.0, 5.6),
    ("உனக்காக <b>ஒருவரும்</b> பேசவில்லை.", 5.85, 8.4),
    ("அன்று… <b>அவன்</b> வந்தான்.", 8.75, 12.3),
    ("நீ தனியாக <b>இல்லை.</b>", 12.8, 14.55),
    ("<b>கவலைப்படாதே.</b>", 14.65, 16.3),
    ('கமெண்ட்டில் <b>"கிருஷ்ணா"</b> 🙏', 16.4, TOTAL),
]
SFX = "assets/sfx/"  # real CC0 recordings from freesound.org via Sonic Pi, see assets/sfx/CREDITS.md
# file, start, volume, track, options: media (offset into the file), dur, fin/fout (fades), lane
AUDIO = [
    # ElevenLabs eleven_v4, the Day 5 voices: narrator "Bharadwaj" (speech 0.2-8.0 s), Krishna "Ramaa"
    ("assets/audio/el-narrator.wav", 0.15, 1.0, 7, {}),
    # Krishna: "நீ தனியாக இல்லை… கவலைப்படாதே", cut from the Day 5 Ramaa take (5.18 s to the end, no new credits)
    ("assets/audio/el-krishna.wav", 12.9, 1.0, 7, {}),
    # despair: a boom on frame 0, wind, a dark hum, a heartbeat that speeds up toward the turn
    (SFX + "misc_cineboom.wav", 0.0, 0.45, 8, {"media": 1.4, "dur": 4.0, "fout": 1.5}),
    ("assets/audio/wind.wav", 0.0, 0.2, 9, {"dur": TURN, "fin": 0.4, "fout": 0.5}),
    (SFX + "ambi_haunted_hum.wav", 0.0, 0.35, 10, {"dur": TURN, "fin": 0.5, "fout": 0.5}),
    (SFX + "ambi_swoosh.wav", 4.5 - 0.89, 0.35, 12, {}),
    *[(SFX + "bd_boom.wav", t, 0.3, 13, {"dur": 0.5, "fout": 0.2}) for t in (5.9, 6.7, 7.35, 7.85, 8.2)],
    (SFX + "drum_roll.wav", TURN - 2.0, 0.3, 15, {"dur": 2.0, "fin": 1.2, "fout": 0.05}),
    (SFX + "ambi_dark_woosh.wav", TURN - 1.27, 0.45, 16, {}),
    # the turn: boom, temple bell, choir
    ("assets/audio/impact.wav", TURN - 1.27, 0.5, 17, {}),
    (SFX + "bd_boom.wav", TURN, 0.75, 18, {}),
    (SFX + "perc_bell.wav", TURN + 0.05, 0.9, 19, {"dur": 4.0, "fout": 1.5}),
    (SFX + "ambi_choir.wav", TURN + 0.1, 0.55, 20, {}),
    # Krishna's face: a swoosh on the cut, a soft choir, a soft bell under "இனியும் வருவேன்"
    (SFX + "perc_swoosh.wav", 12.5 - 0.14, 0.3, 12, {}),
    (SFX + "ambi_choir.wav", 12.55, 0.3, 20, {}),
    (SFX + "perc_bell2.wav", 14.75, 0.5, 22, {"dur": 3.0, "fout": 1.0}),
    # the ask
    (SFX + "perc_bell.wav", 16.4, 0.75, 19, {"fout": 0.8}),
]
AUDIO = [a for a in AUDIO if os.path.exists(a[0])]  # the Krishna line joins once it is recorded
SCORE = "assets/audio/score.wav"  # optional; leave it out of the folder (or NO_MUSIC=1) for the no-music version
if os.path.exists(SCORE) and not os.environ.get("NO_MUSIC"):
    AUDIO.insert(0, (SCORE, 0.0, 1.0, 6, {"lane": [(0, 0.4), (TURN - 0.05, 0.4), (TURN, 0.8), (9.0, 0.35),
                                                    (16.2, 0.35), (16.5, 0.6), (TOTAL, 0.6)]}))
HANDLE = "@lordsrikrishnatemple"


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
    }
'''
    html = js = ""
    for i, (src, st, du, s0, s1, origin) in enumerate(SHOTS):
        tag = "img" if src.endswith(".png") else "video"
        attrs = 'alt=""' if tag == "img" else "muted playsinline"
        end = "" if tag == "img" else "</video>"
        html += (f'    <{tag} id="v{i}" class="clip shot" src="{src}" {attrs} style="transform-origin: {origin};" '
                 f'data-start="{st}" data-duration="{du:.2f}" data-track-index="{i % 2}">{end}\n')
        js += f'    tl.fromTo("#v{i}", {{ scale: {s0} }}, {{ scale: {s1}, duration: {du:.2f}, ease: "none" }}, {st});\n'
    return wrap("shots", css, html, js)


def fx():
    rnd = random.Random(6)
    css = '''    #vignette {
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse at 50% 42%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.6));
    }
    #flash {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 50% 35%, #ffffff, #fff1c4 40%, rgba(255, 200, 90, 0.6) 80%);
      opacity: 0;
    }
    #rays {
      position: absolute;
      left: -420px;
      top: -1150px;
      width: 1920px;
      height: 1920px;
      background: repeating-conic-gradient(from 0deg, rgba(255, 225, 160, 0.18) 0deg 5deg, rgba(255, 225, 160, 0) 5deg 15deg);
      mix-blend-mode: screen;
      -webkit-mask-image: radial-gradient(circle, #000 12%, transparent 62%);
      mask-image: radial-gradient(circle, #000 12%, transparent 62%);
      opacity: 0;
    }
    .petal {
      position: absolute;
      width: 16px;
      height: 10px;
      border-radius: 50% 50% 50% 0;
      background: #ff5d73;
      opacity: 0.85;
    }
'''
    html = f'    <div id="vignette" class="clip" data-start="0" data-duration="{TOTAL}" data-track-index="0" data-layout-ignore></div>\n'
    html += f'    <div id="rays" class="clip" data-start="{DROP}" data-duration="{TOTAL - DROP}" data-track-index="1" data-layout-ignore></div>\n'
    html += f'    <div id="flash" class="clip" data-start="{DROP - 0.06}" data-duration="0.9" data-track-index="2" data-layout-ignore></div>\n'
    js = f'    tl.fromTo("#rays", {{ opacity: 0, rotation: 0 }}, {{ opacity: 1, rotation: 20, duration: {TOTAL - DROP}, ease: "power1.out" }}, {DROP});\n'
    js += f'    tl.fromTo("#flash", {{ opacity: 0 }}, {{ opacity: 0.9, duration: 0.06, ease: "power2.in" }}, {DROP - 0.06});\n'
    js += f'    tl.to("#flash", {{ opacity: 0, duration: 0.7, ease: "power2.out" }}, {DROP + 0.02});\n'
    # petals fall after the reveal
    html += f'    <div id="petals" class="clip" data-start="{DROP}" data-duration="{TOTAL - DROP}" data-track-index="3" data-layout-ignore>\n'
    for i in range(28):
        at = round(DROP + rnd.uniform(0, TOTAL - DROP - 2.5), 2)
        fall = round(rnd.uniform(3.5, 6.0), 2)
        fall = min(fall, round(TOTAL - at, 2))
        x = rnd.randint(20, 1060)
        drift = rnd.choice([-1, 1]) * rnd.randint(60, 220)
        spin = rnd.randint(180, 540)
        sc = round(rnd.uniform(0.7, 1.6), 2)
        col = rnd.choice(["#ff5d73", "#ffb703", "#ff8fab", "#fb8500"])
        html += f'      <div id="p{i}" class="petal" style="left: {x}px; top: 0; background: {col}; transform: scale({sc});"></div>\n'
        js += (f'    tl.fromTo("#p{i}", {{ y: -40, x: 0, rotation: 0 }}, {{ y: 1980, x: {drift}, rotation: {spin}, '
               f'duration: {fall}, ease: "none" }}, {at});\n')
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
      font-size: 64px;
      line-height: 1.4;
      color: #ffffff;
      text-shadow: 0 3px 6px rgba(0, 0, 0, 0.95), 0 0 30px rgba(0, 0, 0, 0.85);
    }
    .line b {
      color: #ffd34d;
    }
    #handle {
      position: absolute;
      left: 0;
      width: 1080px;
      top: 1490px;
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
        if a > 0:
            js += f'    tl.fromTo("#t{i}", {{ opacity: 0, y: 24, filter: "blur(6px)" }}, {{ opacity: 1, y: 0, filter: "blur(0px)", duration: 0.45, ease: "power2.out" }}, {a});\n'
        if b < TOTAL:
            js += f'    tl.to("#t{i}", {{ opacity: 0, duration: 0.25, ease: "power1.in" }}, {b - 0.25:.2f});\n'
    hs = 16.7
    html += f'    <div id="handle" class="clip" data-start="{hs}" data-duration="{TOTAL - hs:.1f}" data-track-index="2">{HANDLE}</div>\n'
    js += f'    tl.fromTo("#handle", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.4 }}, {hs});\n'
    return wrap("texts", css, html, js)


def index():
    layers = "\n".join(
        f'      <div id="{c}" data-composition-id="{c}" data-composition-src="compositions/{c}.html" data-start="0" data-duration="{TOTAL}" data-track-index="{n}" data-track-kind="{k}" data-width="1080" data-height="1920"></div>'
        for n, (c, k) in enumerate([("shots", "graphics"), ("fx", "graphics"), ("texts", "captions")], start=1))
    audio = ""
    for i, (f, st, vol, tr, o) in enumerate(AUDIO):
        du = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f],
                                  capture_output=True, text=True, check=True).stdout) - o.get("media", 0)
        du = min(du, o.get("dur", du), TOTAL - st)
        extra = f' data-media-start="{o["media"]}"' if "media" in o else ""
        extra += f' data-fade-in="{o["fin"]}"' if "fin" in o else ""
        extra += f' data-fade-out="{o["fout"]}"' if "fout" in o else ""
        if "lane" in o:
            lane = {"version": 1, "lanes": [{"target": "volume", "points": [{"t": round(t - st, 2), "v": v} for t, v in o["lane"]]}]}
            extra += ' data-automation="' + json.dumps(lane, separators=(",", ":")).replace('"', "&quot;") + '"'
        audio += f'      <audio id="a{i}" class="clip" src="{f}" data-start="{st:.2f}" data-duration="{du:.2f}" data-volume="{vol}" data-track-index="{tr}"{extra}></audio>\n'
    return f'''<!doctype html>
<html lang="ta" data-resolution="portrait">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <script src="assets/gsap.min.js"></script>
    <style>
      /* Day 7 (Tamil) · Draupadi in the court, {TOTAL}s. Dark torchlight, then divine gold at {TURN}s. */
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

      <!-- Voices: ElevenLabs eleven_v4, "Bharadwaj" (narrator) and "Ramaa" (Krishna). Effects: CC0 (assets/sfx/CREDITS.md). -->
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
