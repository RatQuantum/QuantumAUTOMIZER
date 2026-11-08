"""Day 13 (English): "One verse" (format D in content/formats.md) · Bhagavad Gita 2.14, "this too shall pass".
A palm-leaf manuscript (olai chuvadi) look: the Sanskrit verse is written onto a palm leaf, then Krishna (free voice,
en-US-AndrewMultilingualNeural) speaks its meaning phrase by phrase while each Sanskrit phrase lights up; the narrator
(en-US-ChristopherNeural) opens and closes. CTA: save. Calm and unhurried (rule 7g): every line holds 3+ s.
No pictures, no faces; voices free (tools/free_voice.sh); no bells, no beat shakes.

Run from reels/day13-ta:  python3 tools/build_day13.py && npm run check && npm run render
"""
import random
import subprocess

W, H = 1080, 1920
TOTAL = 0  # set below from the voice lengths


def dur(f):
    return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f],
                                capture_output=True, text=True, check=True).stdout)


A = "assets/audio/"
# PACE (8 Nov, the user: "first super fast, now super slow"): natural-speed voices, 0.35 s between lines, every caption
# on screen while it is spoken plus ~0.4 s. The schedule is computed from the real voice lengths.
GAPL = 0.35
HOOK_T = 0.3
LEAF_T = HOOK_T + dur(A + "n1-hook.wav") + 0.2
_texts = [("k1.wav", "Heat and cold.<br><b>Pleasure and pain.</b>", "p1"),
          ("k2.wav", "They come…<br>and they <b>go.</b>", "p2"),
          ("k3.wav", "None of them<br><b>will last.</b>", "p3"),
          ("k4.wav", "So bear them…<br>with <b>patience.</b>", "p4")]
PHRASES, _t = [], LEAF_T + 2.2
for _f, _txt, _pid in _texts:
    PHRASES.append([_f, round(_t, 2), _txt, 0, _pid])
    _t += dur(A + _f) + GAPL
for _k in range(len(PHRASES)):
    PHRASES[_k][3] = round(PHRASES[_k + 1][1] - 0.05, 2) if _k + 1 < len(PHRASES) else round(_t + 0.1, 2)
PHRASES = [tuple(x) for x in PHRASES]
TAKE_T = round(_t + 0.1, 2)
TAKE_END = round(TAKE_T + dur(A + "n2-takeaway.wav") + 0.4, 2)
CTA_T = round(TAKE_END + 0.1, 2)
TOTAL = round(CTA_T + 0.15 + dur(A + "n3-save.wav") + 1.3, 2)

SFX = "assets/sfx/"
AUDIO = [
    (A + "n1-hook.wav", HOOK_T, 1.0, 1, {}),
    *[(A + f, t, 1.0, 2, {}) for f, t, _, _, _ in PHRASES],
    (A + "n2-takeaway.wav", TAKE_T, 1.0, 1, {}),
    (A + "n3-save.wav", CTA_T + 0.2, 1.0, 1, {}),
    # beds: a glass hum and a faint parchment hiss, two each; soft pads under the takeaway and the save
    (SFX + "tabla_ghe5.wav", 0.0, 0.45, 10, {"fout": 1.5}),
    (SFX + "ambi_glass_hum.wav", LEAF_T - 0.2, 0.22, 11, {"fin": 1.0, "fout": 2.0}),
    (SFX + "ambi_glass_hum.wav", LEAF_T + 9.0, 0.22, 12, {"fin": 2.0, "fout": 2.5}),
    (SFX + "vinyl_hiss.wav", LEAF_T, 0.12, 13, {"fin": 0.8, "fout": 1.5}),
    (SFX + "vinyl_hiss.wav", LEAF_T + 7.5, 0.12, 14, {"fin": 1.5, "fout": 1.5}),
    (SFX + "perc_swash.wav", LEAF_T - 0.1, 0.45, 15, {}),
    # a different deep tabla tone as each Sanskrit phrase lights up
    *[(SFX + s, t - 0.05, 0.4, 16 + k, {"fout": 1.0}) for k, ((_, t, _, _, _), s) in
      enumerate(zip(PHRASES, ["tabla_tun1.wav", "tabla_tun2.wav", "tabla_tun3.wav", "tabla_na_o.wav"]))],
    (SFX + "tbd_pad_2.wav", TAKE_T - 0.2, 0.3, 21, {"fin": 0.5, "fout": 1.2}),
    (SFX + "tbd_pad_3.wav", CTA_T, 0.3, 22, {"fin": 0.4, "fout": 1.2}),
]

SANSKRIT_1 = '<span id="p0">मात्रास्पर्शास्तु कौन्तेय </span><span id="p1">शीतोष्णसुखदुःखदाः</span> ।'
SANSKRIT_2 = ('<span id="p2">आगमापायिनो</span><span id="p3">ऽनित्यास्</span><span id="p4">तांस्तितिक्षस्व</span>'
              ' भारत ॥')
TRANSLIT = "mātrā-sparśās tu kaunteya śītoṣṇa-sukha-duḥkha-dāḥ<br>āgamāpāyino 'nityās tāṁs titikṣasva bhārata"


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
    rnd = random.Random(13)
    css = '''    @font-face {
      font-family: "Cormorant";
      src: url("assets/fonts/Cormorant.ttf");
    }
    @font-face {
      font-family: "Cormorant";
      font-style: italic;
      src: url("assets/fonts/Cormorant-Italic.ttf");
    }
    @font-face {
      font-family: "Cinzel";
      src: url("assets/fonts/Cinzel.ttf");
    }
    @font-face {
      font-family: "Tiro";
      src: url("assets/fonts/TiroDevanagariSanskrit-Regular.ttf");
    }
    #bg {
      position: absolute;
      inset: 0;
      background-color: #120a05;
      background-image: radial-gradient(ellipse 80% 45% at 50% 30%, #4a2c12 0%, #24140a 55%, #0d0704 100%);
    }
    #candle {
      position: absolute;
      left: 140px;
      top: -200px;
      width: 800px;
      height: 800px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255, 190, 100, 0.28) 0%, rgba(255, 160, 60, 0) 65%);
    }
    .mote {
      position: absolute;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: #f3d9a4;
      box-shadow: 0 0 6px 2px rgba(255, 210, 140, 0.5);
    }
    #leaf {
      position: absolute;
      left: 50px;
      top: 390px;
      width: 980px;
      height: 330px;
      border-radius: 165px / 60px;
      background-color: #d8b884;
      background-image:
        repeating-linear-gradient(180deg, rgba(120, 80, 30, 0.10) 0 2px, rgba(0, 0, 0, 0) 2px 9px),
        linear-gradient(180deg, #e6caa0 0%, #d4b07a 55%, #c49a62 100%);
      box-shadow: 0 18px 50px rgba(0, 0, 0, 0.6), inset 0 0 30px rgba(110, 70, 25, 0.45);
    }
    #leaf .hole {
      position: absolute;
      top: 150px;
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: #1a0f07;
      box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.8);
    }
    .sk {
      position: absolute;
      left: 0;
      width: 980px;
      text-align: center;
      font-family: "Tiro", serif;
      font-size: 50px;
      color: #4a2a10;
      white-space: nowrap;
    }
    .sk span {
      border-radius: 10px;
      padding: 0 4px;
    }
    #translit {
      position: absolute;
      left: 40px;
      width: 1000px;
      top: 760px;
      text-align: center;
      font-family: "Cormorant", serif;
      font-style: italic;
      font-size: 34px;
      line-height: 1.45;
      color: #e9d4ad;
    }
    .big {
      position: absolute;
      left: 40px;
      width: 1000px;
      text-align: center;
      font-family: "Cormorant", serif;
      font-weight: 600;
      color: #fbf1dc;
      text-shadow: 0 4px 18px rgba(0, 0, 0, 0.8);
    }
    .big b {
      color: #f0bf5a;
      font-weight: 700;
    }
    #ref {
      position: absolute;
      left: 0;
      width: 1080px;
      top: 1470px;
      text-align: center;
      font-family: "Cinzel", serif;
      font-size: 32px;
      letter-spacing: 6px;
      color: #d9b46a;
    }
    #handle {
      position: absolute;
      left: 0;
      width: 1080px;
      top: 1720px;
      text-align: center;
      font-family: "Cinzel", serif;
      font-size: 28px;
      letter-spacing: 3px;
      color: #e6cf9f;
    }
'''
    html = f'    <div id="bg" class="clip" data-start="0" data-duration="{TOTAL}" data-track-index="0"></div>\n'
    html += f'    <div id="candle" class="clip" data-start="0" data-duration="{TOTAL}" data-track-index="1" data-layout-ignore></div>\n'
    js = f'    tl.fromTo("#candle", {{ opacity: 0.7, scale: 1 }}, {{ opacity: 1, scale: 1.08, duration: 2.4, yoyo: true, repeat: {int(TOTAL / 2.4)}, ease: "sine.inOut" }}, 0);\n'
    html += f'    <div id="motes" class="clip" data-start="0" data-duration="{TOTAL}" data-track-index="2" data-layout-ignore>\n'
    for k in range(30):
        x0, y0 = rnd.randint(0, 1070), rnd.randint(100, 1900)
        dx, dy = rnd.randint(-60, 60), -rnd.randint(120, 380)
        html += f'      <div id="m{k}" class="mote" style="left: {x0}px; top: {y0}px;"></div>\n'
        js += f'    tl.fromTo("#m{k}", {{ x: 0, y: 0, opacity: 0.7 }}, {{ x: {dx}, y: {dy}, opacity: 0.1, duration: {TOTAL}, ease: "none" }}, 0);\n'
    html += '    </div>\n'

    # hook (frame 0 and the thumbnail)
    html += (f'    <div id="hook" class="clip big" style="top: 760px; font-size: 92px; line-height: 1.2;" data-start="0" '
             f'data-duration="{LEAF_T - 0.2:.2f}" data-track-index="3">On your <b>worst</b> day…<br>'
             f'<span style="font-size: 64px; font-weight: 500">remember what Krishna said.</span></div>\n')
    js += f'    tl.to("#hook", {{ opacity: 0, y: -20, duration: 0.5, ease: "power1.in" }}, {LEAF_T - 0.7:.2f});\n'

    # the palm leaf slides in, the Sanskrit is "written" line by line, the transliteration follows
    holes = '<div class="hole" style="left: 230px"></div><div class="hole" style="left: 724px"></div>'
    html += (f'    <div id="leaf" class="clip" data-start="{LEAF_T - 0.1:.2f}" data-duration="{TOTAL - LEAF_T + 0.1:.2f}" data-track-index="4">{holes}'
             f'<div id="sk1" class="sk" style="top: 62px;">{SANSKRIT_1}</div>'
             f'<div id="sk2" class="sk" style="top: 196px;">{SANSKRIT_2}</div></div>\n')
    js += f'    tl.fromTo("#leaf", {{ opacity: 0, y: 60, rotation: -2 }}, {{ opacity: 1, y: 0, rotation: 0, duration: 0.9, ease: "power2.out" }}, {LEAF_T - 0.1:.2f});\n'
    js += f'    tl.to("#leaf", {{ y: -8, duration: 3.0, yoyo: true, repeat: 11, ease: "sine.inOut" }}, {LEAF_T + 0.8:.2f});\n'
    js += f'    tl.fromTo("#sk1", {{ clipPath: "inset(0% 100% 0% 0%)" }}, {{ clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "none" }}, {LEAF_T + 0.4:.2f});\n'
    js += f'    tl.fromTo("#sk2", {{ clipPath: "inset(0% 100% 0% 0%)" }}, {{ clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "none" }}, {LEAF_T + 1.2:.2f});\n'
    html += (f'    <div id="translit" class="clip" data-start="{LEAF_T + 1.6:.2f}" data-duration="{TOTAL - LEAF_T - 1.6:.2f}" '
             f'data-track-index="5">{TRANSLIT}</div>\n')
    js += f'    tl.fromTo("#translit", {{ opacity: 0 }}, {{ opacity: 0.9, duration: 0.6 }}, {LEAF_T + 1.6:.2f});\n'

    # each phrase: the Sanskrit lights up gold while Krishna speaks the English meaning
    for k, (_, t, text, end, pid) in enumerate(PHRASES):
        html += (f'    <div id="e{k}" class="clip big" style="top: 1110px; font-size: 86px; line-height: 1.18;" '
                 f'data-start="{t:.2f}" data-duration="{end - t:.2f}" data-track-index="6">{text}</div>\n')
        js += f'    tl.fromTo("#e{k}", {{ opacity: 0, y: 24 }}, {{ opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }}, {t:.2f});\n'
        js += f'    tl.to("#e{k}", {{ opacity: 0, duration: 0.35 }}, {end - 0.35:.2f});\n'
        js += (f'    tl.to("#{pid}", {{ backgroundColor: "rgba(214, 150, 40, 0.38)", color: "#2a1404", duration: 0.4 }}, {t:.2f});\n'
               f'    tl.to("#{pid}", {{ backgroundColor: "rgba(214, 150, 40, 0)", color: "#4a2a10", duration: 0.5 }}, {end - 0.3:.2f});\n')
    html += (f'    <div id="ref" class="clip" data-start="{PHRASES[-1][1]:.2f}" data-duration="{TAKE_T - PHRASES[-1][1]:.2f}" '
             f'data-track-index="7">BHAGAVAD GITA 2.14</div>\n')
    js += f'    tl.fromTo("#ref", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.6 }}, {PHRASES[-1][1]:.2f});\n'

    # the takeaway, then the save ask
    html += (f'    <div id="take" class="clip big" style="top: 1110px; font-size: 84px; line-height: 1.2;" data-start="{TAKE_T - 0.2:.2f}" '
             f'data-duration="{TAKE_END - TAKE_T + 0.2:.2f}" data-track-index="6">Your hardest day<br>is not your <b>whole life.</b></div>\n')
    js += f'    tl.fromTo("#take", {{ opacity: 0, y: 24 }}, {{ opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }}, {TAKE_T - 0.2:.2f});\n'
    js += f'    tl.to("#take", {{ opacity: 0, duration: 0.35 }}, {TAKE_END - 0.35:.2f});\n'
    html += (f'    <div id="cta" class="clip big" style="top: 1090px; font-size: 80px; line-height: 1.22;" data-start="{CTA_T:.2f}" '
             f'data-duration="{TOTAL - CTA_T:.2f}" data-track-index="8"><b>Save this</b><br>'
             f'<span style="font-size: 62px; font-weight: 500">for the day you need it.</span></div>\n')
    js += f'    tl.fromTo("#cta", {{ opacity: 0, y: 24 }}, {{ opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }}, {CTA_T:.2f});\n'
    html += f'    <div id="handle" class="clip" data-start="{CTA_T + 0.4:.2f}" data-duration="{TOTAL - CTA_T - 0.4:.2f}" data-track-index="9">@LORDSRIKRISHNATEMPLE</div>\n'
    js += f'    tl.fromTo("#handle", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.6 }}, {CTA_T + 0.4:.2f});\n'
    return wrap("scene", css, html, js)


def index():
    audio = ""
    for i, (f, st, vol, tr, o) in enumerate(AUDIO):
        du = min(dur(f), o.get("dur", 99), TOTAL - st)
        extra = f' data-fade-in="{o["fin"]}"' if "fin" in o else ""
        extra += f' data-fade-out="{o["fout"]}"' if "fout" in o else ""
        audio += f'      <audio id="a{i}" class="clip" src="{f}" data-start="{st:.2f}" data-duration="{du:.3f}" data-volume="{vol}" data-track-index="{tr}"{extra}></audio>\n'
    return f'''<!doctype html>
<html lang="en" data-resolution="portrait">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width={W}, height={H}" />
    <script src="assets/gsap.min.js"></script>
    <style>
      /* Day 13 (English) · One verse: Bhagavad Gita 2.14 on a palm leaf, {TOTAL}s. Candlelight and gold. */
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
        background: #0d0704;
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

      <!-- Free voices (Microsoft Edge neural): narrator en-US-ChristopherNeural, Krishna en-US-AndrewMultilingualNeural in the calm "divine" style. Effects: CC0 Sonic Pi. -->
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
