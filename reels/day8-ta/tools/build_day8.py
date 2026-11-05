"""Day 8 (Tamil): Govardhan, "உன் புயலுக்கு நான் குடை". Checked against content/reel-rules.md (corrected 5 Nov):
frame 0 is an EPIC WIDE storm over a tiny village, the first line is a short warning about the viewer's future,
the turn at 6.6 s, Krishna's promise on screen at 9.9 s, the "கிருஷ்ணா" ask.

Run from reels/day8-ta:  NO_MUSIC=1 python3 tools/build_day8.py && npm run check && npm run render
Phonk/slowed drop in the Instagram app at 0:06.6 (the turn).
Clips: the user's Google Flow (Veo 3.1, Frames to Video from Nano Banana 2.1 stills). Each clip's own sound
(rain, wind, thunder) is extracted to assets/audio/ambience-vN.wav and mixed low. Until a clip exists its shot
falls back to a placeholder still.
"""
import json
import os
import random
import subprocess

TOTAL = 14.8
TURN = 6.6
DROP = TURN  # the fx layer (flash, rays, petals) keys off DROP
SHOTS_PLAN = [
    ("assets/video/v1-storm.mp4", "assets/img/placeholder-dark.png", 0.0, 3.65, 1.0, 1.06, "50% 60%"),
    ("assets/video/v2-people.mp4", "assets/img/placeholder-dark.png", 3.6, TURN - 3.6 + 0.05, 1.04, 1.0, "50% 45%"),
    ("assets/video/v3-hill.mp4", "assets/img/placeholder-krishna.png", TURN, 3.25, 1.0, 1.05, "50% 40%"),
    ("assets/video/v4-krishna.mp4", "assets/img/placeholder-krishna.png", 9.8, TOTAL - 9.8, 1.0, 1.05, "50% 25%"),
]
SHOTS = [(v if os.path.exists(v) else f, st, du, s0, s1, o) for v, f, st, du, s0, s1, o in SHOTS_PLAN]
LINES = [
    ("ஒரு நாள்… <b>புயல்</b> வரும்.", 0.0, 3.5),
    ("ஒதுங்க <b>இடமே</b> இருக்காது.", 3.75, 6.45),
    ("அன்று… அவன் <b>மலையையே</b><br>தூக்கினான்.", 6.85, 9.65),
    ("உன் புயலுக்கு…<br><b>நான்</b> குடை.", 9.95, 11.9),
    ("<b>கவலைப்படாதே.</b>", 12.0, 13.3),
    ('கமெண்ட்டில் <b>"கிருஷ்ணா"</b> 🙏', 13.4, TOTAL),
]
SFX = "assets/sfx/"
AUDIO = [
    # Bharadwaj: "ஒரு நாள்…" (Day 5 take) + "புயல் வரும்." (new, 12 credits); Ramaa: "கவலைப்படாதே" (Day 5 take)
    ("assets/audio/el-hook.wav", 0.2, 1.0, 7, {}),
    ("assets/audio/el-kavalai.wav", 12.1, 1.0, 7, {}),
    # the clips' own storm sound, low under the voice
    ("assets/audio/ambience-v1.wav", 0.0, 0.45, 9, {"dur": 3.65, "fout": 0.2}),
    ("assets/audio/ambience-v2.wav", 3.6, 0.5, 9, {"dur": TURN - 3.6, "fout": 0.15}),
    ("assets/audio/ambience-v3.wav", TURN, 0.35, 9, {"dur": 3.2, "fout": 0.4}),
    ("assets/audio/ambience-v4.wav", 9.8, 0.25, 9, {"dur": TOTAL - 9.8, "fout": 0.8}),
    ("assets/audio/wind.wav", 0.0, 0.2, 10, {"dur": TURN, "fin": 0.2, "fout": 0.4}),
    (SFX + "misc_cineboom.wav", 0.0, 0.45, 8, {"media": 1.4, "dur": 3.0, "fout": 1.2}),
    *[(SFX + "bd_boom.wav", t, 0.3, 13, {"dur": 0.5, "fout": 0.2}) for t in (4.6, 5.3, 5.85, 6.25)],
    (SFX + "drum_roll.wav", TURN - 1.6, 0.3, 15, {"dur": 1.6, "fin": 1.0, "fout": 0.05}),
    (SFX + "ambi_dark_woosh.wav", TURN - 1.27, 0.45, 16, {}),
    # the turn
    ("assets/audio/impact.wav", TURN - 1.27, 0.5, 17, {}),
    (SFX + "bd_boom.wav", TURN, 0.75, 18, {}),
    (SFX + "perc_bell.wav", TURN + 0.05, 0.9, 19, {"dur": 3.5, "fout": 1.5}),
    (SFX + "ambi_choir.wav", TURN + 0.1, 0.55, 20, {}),
    # Krishna
    (SFX + "perc_swoosh.wav", 9.8 - 0.14, 0.3, 12, {}),
    (SFX + "ambi_choir.wav", 9.85, 0.3, 20, {}),
    (SFX + "perc_bell2.wav", 12.0, 0.5, 22, {"dur": 2.8, "fout": 1.0}),
    (SFX + "perc_bell.wav", 13.4, 0.75, 19, {"fout": 0.8}),
]
AUDIO = [a for a in AUDIO if os.path.exists(a[0])]
SCORE = "assets/audio/score.wav"
if os.path.exists(SCORE) and not os.environ.get("NO_MUSIC"):
    AUDIO.insert(0, (SCORE, 0.0, 1.0, 6, {"lane": [(0, 0.4), (TURN - 0.05, 0.4), (TURN, 0.8), (7.0, 0.35),
                                                    (13.2, 0.35), (13.5, 0.6), (TOTAL, 0.6)]}))
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
    hs = 13.6
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
      /* Day 8 (Tamil) · Govardhan, {TOTAL}s. A black storm, then golden shelter at {TURN}s. */
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
