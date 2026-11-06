"""Day 9 (Tamil): Kurukshetra, the cosmic form, "அப்போது… அவன் எழுவான்". Checked against content/reel-rules.md:
frame 0 is an EPIC WIDE dawn battlefield with one small chariot, the first line is a short warning about the viewer's
future, the turn at 6.6 s, Krishna's promise in his own voice at 10.2 s. No narrator (text + phonk, like the 33.4K reel).

Run from reels/day9-ta:  NO_MUSIC=1 python3 tools/build_day9.py && npm run check && npm run render
Phonk/slowed drop in the Instagram app at 0:06.6 (the turn).
Clips: the user's Google Flow (Veo 3.1, Frames to Video from Nano Banana 2.1 stills); each clip's own sound is extracted
to assets/audio/ambience-vN.wav. Until a clip exists its shot falls back to a placeholder still.
"""
import json
import os
import random
import subprocess

# BEAT GRID (6 Nov, the user's ask: "edit the clips to the beats"). Track: "ZAKHELO (Slowed)" by Rushex (on YouTube as
# PHANT X), 71 BPM (Beatport; Shazam says 70), drop at 0:15 in the track. One beat = 60/71 s. The reel starts on a beat;
# the drop is beat 8. In Instagram, start the song at 0:08.2 so its drop lands at 0:06.8 (= TURN).
BPM = 71
BEAT = 60 / BPM


def B(n):
    return round(n * BEAT, 3)


TOTAL = B(18)   # 15.21 s
TURN = B(8)     # 6.76 s, the drop
DROP = TURN  # the fx layer (flash, rays, petals) keys off DROP
# HyperFrames-only version (6 Nov, the user's ask: "use HyperFrames to generate video, any style"): shots 1-3 are the
# battlefield still animated in CSS/GSAP (push-ins, a tight dark crop on the lone chariot, the cosmic-form motion graphic
# on top at the drop); shot 4 is the user's golden Krishna clip from Day 7 (local only, never committed).
BF = "assets/img/s1-battlefield-1080.png"
SHOTS_PLAN = [
    (BF, BF, 0.0, B(4) + 0.03, 1.0, 1.10, "50% 52%"),
    (BF, BF, B(4), B(8) - B(4) + 0.03, 2.1, 2.45, "50% 51%"),
    (BF, BF, B(8), B(12) - B(8) + 0.03, 1.15, 1.0, "50% 60%"),
    ("assets/video/v4-krishna.mp4", "assets/img/placeholder-krishna.png", B(12), TOTAL - B(12), 1.0, 1.05, "50% 25%"),
]
SHOTS = [(v if os.path.exists(v) else f, st, du, s0, s1, o) for v, f, st, du, s0, s1, o in SHOTS_PLAN]
# per-shot look: shot 2 is the lone chariot, dark and drained (despair); shot 3 is the battlefield in shadow under the
# blazing cosmic form
SHOT_FILTER = {1: "saturate(0.45) brightness(0.62) contrast(1.15)", 2: "brightness(0.5) saturate(0.8) contrast(1.1)"}
LINES = [
    ("ஒரு நாள்… நீ <b>உடைந்து</b> போவாய்.", 0.0, B(4) - 0.1),
    ("எல்லாம் <b>முடிந்தது</b><br>என்று நினைப்பாய்.", B(4) + 0.1, B(8) - 0.1),
    ("அப்போது… அவன் <b>எழுவான்.</b>", B(8) + 0.15, B(12) - 0.15),
    ("நீ தனியாக <b>இல்லை.</b>", B(12) + 0.3, B(12) + 1.85),
    ("<b>கவலைப்படாதே.</b>", B(12) + 1.95, B(16) - 0.1),
    ('கமெண்ட்டில் <b>"கிருஷ்ணா"</b> 🙏', B(16), TOTAL),
]
SFX = "assets/sfx/"
AUDIO = [
    # no narrator; Krishna (Ramaa, Day 5 take): "நீ தனியாக இல்லை… கவலைப்படாதே", 0.3 s after the cut on beat 12
    ("assets/audio/el-krishna.wav", B(12) + 0.3, 1.0, 7, {}),
    # the clips' own sound, low; effects only where they cannot fight the track's beat (build, drop, bells)
    ("assets/audio/ambience-v1.wav", 0.0, 0.45, 9, {"dur": B(4), "fout": 0.15}),
    ("assets/audio/ambience-v2.wav", B(4), 0.5, 9, {"dur": B(8) - B(4), "fout": 0.1}),
    ("assets/audio/ambience-v3.wav", B(8), 0.35, 9, {"dur": B(4), "fout": 0.3}),
    ("assets/audio/ambience-v4.wav", B(12), 0.25, 9, {"dur": TOTAL - B(12), "fout": 0.8}),
    ("assets/audio/wind.wav", 0.0, 0.2, 10, {"dur": TURN, "fin": 0.2, "fout": 0.3}),
    (SFX + "misc_cineboom.wav", 0.0, 0.4, 8, {"media": 1.4, "dur": 3.0, "fout": 1.2}),
    (SFX + "ambi_dark_woosh.wav", TURN - 1.27, 0.45, 16, {}),
    ("assets/audio/impact.wav", TURN - 1.27, 0.5, 17, {}),
    (SFX + "bd_boom.wav", TURN, 0.75, 18, {}),
    (SFX + "perc_bell.wav", TURN + 0.02, 0.85, 19, {"dur": 3.0, "fout": 1.2}),
    (SFX + "ambi_choir.wav", TURN + 0.05, 0.5, 20, {}),
    (SFX + "perc_swoosh.wav", B(12) - 0.14, 0.3, 12, {}),
    (SFX + "perc_bell2.wav", B(12) + 1.95, 0.45, 22, {"dur": 2.5, "fout": 1.0}),
    (SFX + "perc_bell.wav", B(16), 0.7, 19, {"fout": 0.8}),
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
    css += '''    #stage {
      position: absolute;
      inset: 0;
      transform-origin: 50% 45%;
    }
'''
    html = '    <div id="stage">\n'
    js = ""
    for i, (src, st, du, s0, s1, origin) in enumerate(SHOTS):
        tag = "img" if src.endswith(".png") else "video"
        attrs = 'alt=""' if tag == "img" else "muted playsinline"
        end = "" if tag == "img" else "</video>"
        html += (f'    <{tag} id="v{i}" class="clip shot" src="{src}" {attrs} style="transform-origin: {origin};{(' filter: ' + SHOT_FILTER[i] + ';') if i in SHOT_FILTER else ''}" '
                 f'data-start="{st}" data-duration="{du:.2f}" data-track-index="{i % 2}">{end}\n')
        js += f'    tl.fromTo("#v{i}", {{ scale: {s0} }}, {{ scale: {s1}, duration: {du:.2f}, ease: "none" }}, {st});\n'
    html += '    </div>\n'
    js += '    tl.set("#stage", { scale: 1 }, 0);\n'
    # punch on the beat: a quick zoom-in that settles before the next beat. Soft pulses build to the drop,
    # a big hit on the drop, a hit on every beat after it, softer pulses under Krishna's line.
    for n, amt in [*((k, 0.012) for k in range(1, 6)), (6, 0.02), (7, 0.03), (8, 0.09), (9, 0.045), (10, 0.045),
                   (11, 0.05), (12, 0.06), (14, 0.02), (16, 0.03)]:
        js += f'    tl.fromTo("#stage", {{ scale: {1 + amt:.3f} }}, {{ scale: 1, duration: {min(0.5, BEAT * 0.7):.2f}, ease: "power3.out", immediateRender: false }}, {B(n)});\n'
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
    # white flashes on the beats after the drop, and on the cut to Krishna
    for n in (9, 10, 11, 12):
        t = B(n) - 0.02
        html += f'    <div id="bf{n}" class="clip beatflash" data-start="{t:.3f}" data-duration="0.3" data-track-index="4" data-layout-ignore></div>\n'
        js += f'    tl.fromTo("#bf{n}", {{ opacity: {0.35 if n < 12 else 0.6} }}, {{ opacity: 0, duration: 0.28, ease: "power2.out" }}, {t:.3f});\n'
    css += '''    .beatflash {
      position: absolute;
      inset: 0;
      background: #fff6dc;
      opacity: 0;
    }
'''
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


def cosmic():
    rnd = random.Random(9)
    cx, cy = 540, 640          # centre of the cosmic form in the sky
    css = '''    #mandala {
      position: absolute;
      left: -360px;
      top: -260px;
      width: 1800px;
      height: 1800px;
      border-radius: 50%;
      background: repeating-conic-gradient(from 0deg, rgba(255, 214, 120, 0.55) 0deg 3deg, rgba(255, 170, 60, 0) 3deg 10deg);
      -webkit-mask-image: radial-gradient(circle, #000 18%, rgba(0, 0, 0, 0.6) 38%, transparent 62%);
      mask-image: radial-gradient(circle, #000 18%, rgba(0, 0, 0, 0.6) 38%, transparent 62%);
      mix-blend-mode: screen;
      opacity: 0;
    }
    #halo {
      position: absolute;
      left: 40px;
      top: 140px;
      width: 1000px;
      height: 1000px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255, 200, 110, 0) 30%, rgba(255, 214, 130, 0.75) 44%, rgba(255, 150, 50, 0.3) 58%, rgba(255, 120, 30, 0) 70%);
      mix-blend-mode: screen;
      opacity: 0;
    }
    .ring {
      position: absolute;
      border-radius: 50%;
      border: 4px solid rgba(255, 220, 140, 0.85);
      box-shadow: 0 0 40px 8px rgba(255, 190, 80, 0.6), inset 0 0 40px 8px rgba(255, 190, 80, 0.45);
      mix-blend-mode: screen;
      opacity: 0;
    }
    #skyface {
      position: absolute;
      left: 120px;
      top: 150px;
      width: 840px;
      height: 966px;
      object-fit: cover;
      -webkit-mask-image: radial-gradient(ellipse 46% 48% at 50% 46%, #000 58%, transparent 100%);
      mask-image: radial-gradient(ellipse 46% 48% at 50% 46%, #000 58%, transparent 100%);
      opacity: 0;
    }
    .star {
      position: absolute;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #fffbe8;
      box-shadow: 0 0 12px 4px rgba(255, 230, 160, 0.9);
      opacity: 0;
    }
    .dust {
      position: absolute;
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: #ffb35a;
      box-shadow: 0 0 8px 2px rgba(255, 140, 40, 0.7);
    }
'''
    on, off = B(8), B(12)
    du = off - on
    html = js = ""
    # embers and dust drifting across the battlefield before the drop
    html += f'    <div id="dustlayer" class="clip" data-start="0" data-duration="{on:.3f}" data-track-index="0" data-layout-ignore>\n'
    for k in range(34):
        x0, y0 = rnd.randint(-80, 1000), rnd.randint(700, 1900)
        dx, dy = rnd.randint(140, 420), -rnd.randint(60, 260)
        sc = round(rnd.uniform(0.5, 1.5), 2)
        html += f'      <div id="d{k}" class="dust" style="left: {x0}px; top: {y0}px; transform: scale({sc});"></div>\n'
        js += f'    tl.fromTo("#d{k}", {{ x: 0, y: 0, opacity: 0.85 }}, {{ x: {dx}, y: {dy}, opacity: 0.15, duration: {on:.3f}, ease: "none" }}, 0);\n'
    html += '    </div>\n'
    # the cosmic form: halo, rotating sunburst of rays, rings that hit on each beat, the face in the sky, stars
    html += f'    <div id="halo" class="clip" data-start="{on:.3f}" data-duration="{du:.3f}" data-track-index="1" data-layout-ignore></div>\n'
    html += f'    <div id="mandala" class="clip" data-start="{on:.3f}" data-duration="{du:.3f}" data-track-index="2" data-layout-ignore></div>\n'
    js += f'    tl.fromTo("#halo", {{ opacity: 0, scale: 0.3 }}, {{ opacity: 1, scale: 1, duration: 0.55, ease: "power3.out" }}, {on:.3f});\n'
    js += f'    tl.fromTo("#mandala", {{ opacity: 0, rotation: -30, scale: 0.4 }}, {{ opacity: 1, scale: 1, duration: 0.6, ease: "power3.out" }}, {on:.3f});\n'
    js += f'    tl.to("#mandala", {{ rotation: 40, duration: {du:.3f}, ease: "none" }}, {on:.3f});\n'
    for r, (size, n) in enumerate([(560, 9), (820, 10), (1080, 11)]):
        x, y = cx - size // 2, cy - size // 2
        html += (f'    <div id="ring{r}" class="clip ring" style="left: {x}px; top: {y}px; width: {size}px; height: {size}px;" '
                 f'data-start="{on:.3f}" data-duration="{du:.3f}" data-track-index="3" data-layout-ignore></div>\n')
        js += f'    tl.fromTo("#ring{r}", {{ opacity: 0, scale: 0.2 }}, {{ opacity: 0.9, scale: 1, duration: 0.5, ease: "power3.out" }}, {on + 0.05 * r:.3f});\n'
        # a pulse on each beat after the drop, one ring per beat
        js += f'    tl.fromTo("#ring{r}", {{ scale: 1.12, opacity: 1 }}, {{ scale: 1, opacity: 0.7, duration: 0.45, ease: "power2.out", immediateRender: false }}, {B(n):.3f});\n'
    html += (f'    <img id="skyface" class="clip" src="assets/img/krishna-face-sky.png" alt="" '
             f'data-start="{on:.3f}" data-duration="{du:.3f}" data-track-index="4" data-layout-ignore>\n')
    js += f'    tl.fromTo("#skyface", {{ opacity: 0, scale: 0.75, y: 140 }}, {{ opacity: 1, scale: 1, y: 0, duration: 0.9, ease: "power3.out" }}, {on + 0.1:.3f});\n'
    js += f'    tl.to("#skyface", {{ scale: 1.08, duration: {du - 1.0:.3f}, ease: "none" }}, {on + 1.0:.3f});\n'
    for k in range(40):
        ang = rnd.uniform(0, 6.283)
        rad = rnd.uniform(200, 620)
        import math
        x, y = int(cx + rad * math.cos(ang)), int(cy + rad * math.sin(ang) * 1.1)
        at = round(on + rnd.uniform(0.1, du - 0.6), 3)
        html += (f'    <div id="st{k}" class="clip star" style="left: {x}px; top: {y}px;" data-start="{on:.3f}" '
                 f'data-duration="{du:.3f}" data-track-index="5" data-layout-ignore></div>\n')
        js += f'    tl.fromTo("#st{k}", {{ opacity: 0, scale: 0.3 }}, {{ opacity: 1, scale: 1.3, duration: 0.25, yoyo: true, repeat: 1, ease: "sine.inOut" }}, {at});\n'
    return wrap("cosmic", css, html, js)


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
    hs = B(16) + 0.3
    html += f'    <div id="handle" class="clip" data-start="{hs}" data-duration="{TOTAL - hs:.1f}" data-track-index="2">{HANDLE}</div>\n'
    js += f'    tl.fromTo("#handle", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.4 }}, {hs});\n'
    return wrap("texts", css, html, js)


def index():
    layers = "\n".join(
        f'      <div id="{c}" data-composition-id="{c}" data-composition-src="compositions/{c}.html" data-start="0" data-duration="{TOTAL}" data-track-index="{n}" data-track-kind="{k}" data-width="1080" data-height="1920"></div>'
        for n, (c, k) in enumerate([("shots", "graphics"), ("cosmic", "graphics"), ("fx", "graphics"), ("texts", "captions")], start=1))
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
      /* Day 9 (Tamil) · Kurukshetra, the cosmic form, {TOTAL:.2f}s on a 71 BPM beat grid. A blood-red dawn, then divine gold at {TURN}s. */
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
    for name, fn in (("shots", shots), ("cosmic", cosmic), ("fx", fx), ("texts", texts)):
        open(f"compositions/{name}.html", "w", encoding="utf-8").write(fn())
    open("index.html", "w", encoding="utf-8").write(index())
    print("built", TOTAL, "s")
