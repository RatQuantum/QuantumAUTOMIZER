"""Day 6 (Tamil): Kuchela (Sudama) at Dwarka, "நீ வந்ததே எனக்குப் போதும்". Built on the top reel (33.3K views):
frame 0 is a closed door; on the music drop at 3.0 s shot 1 is pulled off to the RIGHT (the curtain move),
with a flash and a boom, and reveals Krishna running out. Then the embrace, the aval, one line from Krishna.

Run from reels/day6-ta:  python3 tools/build_day6.py && npm run check && npm run render
NO_MUSIC=1 builds the version without a score (the user lays a phonk/slowed track in the Instagram app;
its drop must land at 0:03).

Clips: free MiniMax H3 on Hugging Face (Space hugging-apps/minimax-h3-flashgen-4step, 544x960 9:16 fast,
4 steps, seed 42), upscaled to 1080x1920 30 fps. A shot whose source ends in .png is a still placeholder
that gets a slow push until its clip is made.
"""
import json
import os
import random
import subprocess

TOTAL = 17.0
DROP = 3.0  # the curtain move: shot 1 leaves to the right, Krishna is revealed
PULL = 0.42  # how long the pull takes; it ends exactly on the drop so the frame is clear on the beat
# source, start, duration, scale from, scale to, transform origin
SHOTS = [
    ("assets/video/v1-doors.mp4", 0.0, DROP + PULL, 1.0, 1.04, "50% 55%"),
    ("assets/video/v2-krishna-runs.mp4", DROP - 0.1, 4.1, 1.0, 1.05, "50% 35%"),
    ("assets/img/s2-2.png", 7.0, 3.5, 1.04, 1.12, "50% 30%"),  # placeholder: s3 embrace clip (v3)
    ("assets/img/s2-1.png", 10.5, TOTAL - 10.5, 1.35, 1.48, "50% 18%"),  # placeholder: s4 Krishna eats the aval (v4)
]
# Tamil line, start, end; <b> marks the gold word. The first line is the thumbnail (on screen at frame 0).
LINES = [
    ("கொடுக்க உன்னிடம்<br><b>ஒன்றுமில்லையா?</b>", 0.0, DROP - 0.08),
    ("அவன் <b>ஓடி வருவான்.</b>", 3.35, 6.85),
    ("ஒரு பிடி <b>அவல்</b> தான்…", 7.2, 10.3),
    ("நீ வந்ததே…<br><b>எனக்குப் போதும்.</b>", 10.8, 14.85),
    ("உன் உண்மையான <b>நண்பனுக்கு</b><br>அனுப்பு 🙏", 15.0, TOTAL),
]
SFX = "assets/sfx/"  # real CC0 recordings from freesound.org via Sonic Pi, see assets/sfx/CREDITS.md
# file, start, volume, track, options: media (offset into the file), dur, fin/fout (fades), lane
AUDIO = [
    # free Edge TTS: narrator ta-IN-ValluvarNeural (pauses tightened), Krishna ta-SG-AnbuNeural
    ("assets/audio/vo-n1-tight.wav", 0.2, 1.0, 7, {}),        # ends 2.76 s, before the drop
    ("assets/audio/vo-n2-tight.wav", 3.45, 1.0, 7, {}),       # "அவன் ஓடி வருவான்"
    ("assets/audio/vo-k1.wav", 10.85, 1.0, 7, {}),            # "நீ வந்ததே… எனக்குப் போதும், நண்பா."
    # before the drop: wind at the doors, a low hum, a build that peaks on the beat
    ("assets/audio/wind.wav", 0.0, 0.25, 9, {"dur": DROP + 0.3, "fin": 0.3, "fout": 0.4}),
    (SFX + "ambi_haunted_hum.wav", 0.0, 0.25, 10, {"dur": DROP, "fin": 0.4, "fout": 0.3}),
    (SFX + "drum_roll.wav", DROP - 1.6, 0.3, 15, {"dur": 1.6, "fin": 1.0, "fout": 0.05}),
    (SFX + "ambi_swoosh.wav", DROP - 0.89, 0.5, 12, {}),     # its peak is 0.89 s in: on the pull
    # the drop: boom, temple bell, choir
    ("assets/audio/impact.wav", DROP - 1.27, 0.5, 17, {}),   # its boom peaks 1.27 s in
    (SFX + "bd_boom.wav", DROP, 0.75, 18, {}),
    (SFX + "misc_cineboom.wav", DROP, 0.4, 8, {"media": 1.4, "dur": 3.0, "fout": 1.2}),
    (SFX + "perc_bell.wav", DROP + 0.05, 0.85, 19, {"dur": 4.0, "fout": 1.5}),
    (SFX + "ambi_choir.wav", DROP + 0.1, 0.5, 20, {}),
    # the embrace and the aval: soft swooshes on the cuts, a soft choir, a soft bell under Krishna's line
    (SFX + "perc_swoosh.wav", 7.0 - 0.14, 0.3, 12, {}),
    (SFX + "ambi_choir.wav", 7.05, 0.3, 20, {}),
    (SFX + "perc_swoosh.wav", 10.5 - 0.14, 0.3, 12, {}),
    (SFX + "perc_bell2.wav", 10.6, 0.5, 22, {"dur": 3.2, "fout": 1.0}),
    # the ask
    (SFX + "perc_bell.wav", 15.0, 0.75, 19, {"fout": 0.8}),
]
SCORE = "assets/audio/score.wav"  # optional; leave it out of the folder (or NO_MUSIC=1) for the no-music version
if os.path.exists(SCORE) and not os.environ.get("NO_MUSIC"):
    AUDIO.insert(0, (SCORE, 0.0, 1.0, 6, {"lane": [(0, 0.45), (DROP - 0.05, 0.45), (DROP, 0.8), (3.4, 0.35),
                                                    (14.8, 0.35), (15.1, 0.6), (TOTAL, 0.6)]}))
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
    #v0 {
      box-shadow: -30px 0 60px rgba(0, 0, 0, 0.85);
    }
'''
    html = js = ""
    # shot 1 goes last so it paints on top of the reveal (no z-index: it would cover the text layer)
    for i, (src, st, du, s0, s1, origin) in [*list(enumerate(SHOTS))[1:], (0, SHOTS[0])]:
        tag = "img" if src.endswith(".png") else "video"
        attrs = 'alt=""' if tag == "img" else "muted playsinline"
        end = "" if tag == "img" else "</video>"
        html += (f'    <{tag} id="v{i}" class="clip shot" src="{src}" {attrs} style="transform-origin: {origin};" '
                 f'data-start="{st}" data-duration="{du:.2f}" data-track-index="{i % 2}">{end}\n')
        js += f'    tl.fromTo("#v{i}", {{ scale: {s0} }}, {{ scale: {s1}, duration: {du:.2f}, ease: "none" }}, {st});\n'
    # the curtain move: shot 1 is pulled off to the right, fast at the end, clear of the frame on the beat
    js += f'    tl.fromTo("#v0", {{ x: 0 }}, {{ x: 1180, duration: {PULL}, ease: "power2.in" }}, {DROP - PULL:.2f});\n'
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
    hs = 15.3
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
      /* Day 6 (Tamil) · Kuchela at Dwarka, {TOTAL}s. Closed golden doors, pulled off to the right on the drop at {DROP}s. */
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

      <!-- Voices: free Edge TTS, ta-IN-ValluvarNeural (narrator) and ta-SG-AnbuNeural (Krishna). Effects: CC0 (assets/sfx/CREDITS.md). -->
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
