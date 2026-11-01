"""Fast, music-driven reel: cuts on the beat, a zoom punch on every cut, big Tamil text beats, marigold
petals, golden light and flashes. Built after the first four reels were skipped: the slow fade-in made the
first frame almost black, the cuts were 3-6 s long, and there was no music.

Run from the reel folder:  python3 tools/build_fast.py
Everything about this reel is in the CONFIG block; the rest is the reusable template.
"""

# ----------------------------------------------------------------------------------------------- CONFIG
TITLE = "Day 4 (Tamil, fast cut) · why Kanha stole butter"
BPM, PHASE = 128.0, 0.06          # beat grid of the music (from its chanted phrases)
TOTAL = 18.9
MUSIC = ("assets/audio/music-mahamantra.mp3", 0.9)   # ElevenLabs Music v2.5, Hare Krishna mahamantra
SFX = [  # file, start, duration, volume
    ("assets/audio/conch.mp3", 0.0, 2.4, 0.5),
    ("assets/audio/temple-bell.mp3", None, 2.0, 0.35),   # None = on the CTA beat
]
# image, first beat, last beat, camera: (scale_from, scale_to, x_from, y_from, x_to, y_to), origin is the centre
SHOTS = [
    ("kanha2.jpg", 0, 6, (1.6, 1.68, 61, 356, 50, 330)),      # hook: close on Kanha's face, below the title
    ("yashoda4.jpg", 6, 8, (1.08, 1.14, 0, 0, -20, 30)),
    ("yashoda2.jpg", 8, 10, (1.1, 1.04, -20, -30, 0, 0)),
    ("uri3.jpg", 10, 12, (1.12, 1.05, 0, 60, 0, -20)),
    ("uri1.jpg", 12, 14, (1.05, 1.12, 0, -30, 20, 40)),
    ("monkeys3.jpg", 14, 16, (1.1, 1.04, 20, 0, -10, 20)),
    ("monkeys2.jpg", 16, 18, (1.04, 1.1, -10, 20, 20, -30)),
    ("churn2.jpg", 18, 22, (1.05, 1.18, 0, 0, -30, -60)),
    ("churn3.jpg", 22, 24, (1.12, 1.05, 0, 40, 0, 0)),
    ("offering3.jpg", 24, 26, (1.04, 1.12, 0, 0, 0, -50)),
    ("offering1.jpg", 26, 28, (1.12, 1.05, 0, -40, 0, 0)),
    ("kanha4.jpg", 28, 30, (1.35, 1.42, 0, 160, 0, 150)),
    ("kanha1.jpg", 30, 32, (1.42, 1.35, 0, 150, 0, 160)),
    ("kanha2.jpg", 32, 40, (1.12, 1.16, 0, -110, 0, -140)),  # CTA: face lifted clear of the end card
]
# text, first beat, last beat, place ("top" = hook title, "mid" = beat text)
TEXTS = [
    ('கண்ணன் ஏன் வெண்ணெய்<br><span class="hl">திருடினான்?</span> <span class="emoji">🤔</span>', 0, 6, "top"),
    ('யசோதா திரும்பிப் பார்த்தாள்…<br><span class="hl">பானை காலி!</span> <span class="emoji">😄</span>', 6, 10, "mid"),
    ('நண்பர்கள் தோளில் ஏறி…<br><span class="hl">உறியில் கை!</span> <span class="emoji">🙌</span>', 10, 14, "mid"),
    ('குரங்குகளுக்கும்<br><span class="hl">ஒரு பங்கு!</span> <span class="emoji">🐒</span>', 14, 18, "mid"),
    ('ஆனால்… <span class="hl">ரகசியம்</span><br>தெரியுமா? <span class="emoji">✨</span>', 18, 22, "mid"),
    ('தயிரைக் கடைந்தால்தான்<br><span class="hl">வெண்ணெய்</span>', 22, 24, "mid"),
    ('பக்தியால் கடைந்த<br><span class="hl">மனதின் அன்பு</span> <span class="emoji">❤️</span>', 24, 28, "mid"),
    ('அதைத்தான் கண்ணன்<br><span class="hl">திருடுகிறான்</span> <span class="emoji">🦚</span>', 28, 32, "mid"),
]
CTA = ('கமெண்ட்டில் <span class="hl">"கண்ணா"</span> 🙏', "FOLLOW", "தினமும் கண்ணனின் கதைகள்", 32, 40)
FLASH_BEATS = [18, 28, 32]      # gold flashes on the big moments
GLOW_FROM = 18                  # the golden light pulses on every second beat from here
HANDLE = "@lordsrikrishnatemple"
# ------------------------------------------------------------------------------------------- TEMPLATE
import random

BEAT = 60.0 / BPM


def t(k):
    """Time of beat k (beat 0 is the video start, so the first frame is already on the beat)."""
    return 0.0 if k == 0 else round(PHASE + k * BEAT, 3)


def end(k):
    return TOTAL if t(k) > TOTAL else t(k)


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


FONTS = '''    @font-face {
      font-family: "Noto Serif Tamil";
      src: url("assets/fonts/NotoSerifTamil.ttf");
    }
    @font-face {
      font-family: "Noto Sans Tamil";
      src: url("assets/fonts/NotoSansTamil.ttf");
    }
    @font-face {
      font-family: "Noto Color Emoji";
      src: url("assets/fonts/NotoColorEmoji.ttf");
    }
'''


def shots():
    css = '''    .shot {
      position: absolute;
      left: 0;
      top: 0;
      width: 1080px;
      height: 1920px;
      object-fit: cover;
      transform-origin: 50% 50%;
    }
'''
    html = js = ""
    for i, (img, a, b, (s0, s1, x0, y0, x1, y1)) in enumerate(SHOTS):
        st, du = t(a), end(b) - t(a)
        sid = f"shot{i}"
        html += f'    <img id="{sid}" class="clip shot" data-layout-allow-overflow src="assets/img/{img}" alt="" data-start="{st}" data-duration="{du:.3f}" data-track-index="{i % 2}" />\n'
        # zoom punch: lands 12% too close and snaps back in 0.28 s, then drifts for the rest of the shot
        js += f'    tl.fromTo("#{sid}", {{ scale: {s0 * 1.12:.3f}, x: {x0}, y: {y0} }}, {{ scale: {s0}, duration: 0.28, ease: "power3.out" }}, {st});\n'
        js += f'    tl.to("#{sid}", {{ scale: {s1}, x: {x1}, y: {y1}, duration: {max(du - 0.28, 0.1):.3f}, ease: "none" }}, {st + 0.28:.3f});\n'
    return wrap("shots", css, html, js)


def fx():
    rnd = random.Random(7)  # fixed seed: the petals fall the same way on every render
    css = '''    .petal {
      position: absolute;
      top: -60px;
      width: 30px;
      height: 18px;
      border-radius: 50%;
      background: linear-gradient(135deg, #ffd27a, #f28c28 55%, #c4600f);
    }
    #glow {
      position: absolute;
      left: -200px;
      top: -300px;
      width: 1480px;
      height: 1480px;
      background: radial-gradient(circle, rgba(255, 214, 120, 0.55), rgba(255, 170, 60, 0.18) 40%, rgba(255, 170, 60, 0) 70%);
      mix-blend-mode: screen;
    }
    #rays {
      position: absolute;
      left: -420px;
      top: -1000px;
      width: 1920px;
      height: 1920px;
      background: repeating-conic-gradient(from 0deg, rgba(255, 220, 140, 0.16) 0deg 6deg, rgba(255, 220, 140, 0) 6deg 18deg);
      mix-blend-mode: screen;
      -webkit-mask-image: radial-gradient(circle, #000 15%, transparent 65%);
      mask-image: radial-gradient(circle, #000 15%, transparent 65%);
    }
    .flash {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle, #fff6d8, #ffd27a 60%, #f2a23a);
    }
    #vignette {
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse at 50% 45%, rgba(0, 0, 0, 0) 55%, rgba(5, 7, 15, 0.55));
    }
'''
    html = f'    <div id="vignette" class="clip" data-start="0" data-duration="{TOTAL}" data-track-index="0" data-layout-ignore></div>\n'
    html += f'    <div id="rays" class="clip" data-start="{t(GLOW_FROM)}" data-duration="{TOTAL - t(GLOW_FROM):.3f}" data-track-index="1" data-layout-ignore></div>\n'
    html += f'    <div id="glow" class="clip" data-start="{t(GLOW_FROM)}" data-duration="{TOTAL - t(GLOW_FROM):.3f}" data-track-index="2" data-layout-ignore></div>\n'
    js = f'    tl.set("#glow", {{ opacity: 0.35 }}, 0);\n'
    js += f'    tl.fromTo("#rays", {{ rotation: 0, opacity: 0 }}, {{ rotation: 40, opacity: 1, duration: {TOTAL - t(GLOW_FROM):.3f}, ease: "none" }}, {t(GLOW_FROM)});\n'
    k = GLOW_FROM
    while t(k) < TOTAL - 0.3:
        js += f'    tl.set("#glow", {{ opacity: 0.9 }}, {t(k)});\n'
        js += f'    tl.to("#glow", {{ opacity: 0.35, duration: {2 * BEAT - 0.05:.3f}, ease: "power2.out" }}, {t(k)});\n'
        k += 2
    for i, kb in enumerate(FLASH_BEATS):
        fid = f"flash{i}"
        html += f'    <div id="{fid}" class="clip flash" data-start="{max(t(kb) - 0.06, 0):.3f}" data-duration="0.42" data-track-index="3" data-layout-ignore></div>\n'
        js += f'    tl.fromTo("#{fid}", {{ opacity: 0.85 }}, {{ opacity: 0, duration: 0.36, ease: "power2.out" }}, {max(t(kb) - 0.06, 0):.3f});\n'
    html += f'    <div id="petals" class="clip" data-start="0" data-duration="{TOTAL}" data-track-index="4" data-layout-ignore>\n'
    for i in range(30):
        start = round(rnd.uniform(-3.0, TOTAL - 1.0), 2)
        fall = round(rnd.uniform(3.5, 6.0), 2)
        x = rnd.randint(20, 1040)
        sway = rnd.choice([-1, 1]) * rnd.randint(60, 160)
        spin = rnd.choice([-1, 1]) * rnd.randint(180, 540)
        sc = round(rnd.uniform(0.7, 1.4), 2)
        # petals already mid-fall at t=0 so the first frame is never empty
        y0 = -60 if start >= 0 else int(-60 + 2040 * (-start / fall))
        at = max(start, 0)
        dur = fall if start >= 0 else round(fall + start, 2)
        html += f'      <div id="p{i}" class="petal" style="left: {x}px; transform: scale({sc});"></div>\n'
        js += f'    tl.fromTo("#p{i}", {{ y: {y0}, x: 0, rotation: 0 }}, {{ y: 1980, x: {sway}, rotation: {spin}, duration: {dur}, ease: "none" }}, {at});\n'
    html += '    </div>\n'
    return wrap("fx", css, html, js)


def texts():
    css = FONTS + '''    .beat {
      position: absolute;
      left: 60px;
      width: 960px;
      text-align: center;
    }
    .beat.top {
      top: 300px;
    }
    .beat.mid {
      top: 1170px;
    }
    .line {
      display: inline-block;
      padding: 18px 34px 24px;
      border-radius: 30px;
      font-family: "Noto Serif Tamil", serif;
      font-weight: 700;
      color: #ffffff;
      text-wrap: balance;
      text-shadow: 0 4px 0 rgba(10, 14, 40, 0.9), 0 0 28px rgba(5, 7, 15, 0.9);
    }
    .top .line {
      font-size: 84px;
      line-height: 1.3;
      background: rgba(10, 14, 40, 0.5);
    }
    .mid .line {
      font-size: 64px;
      line-height: 1.32;
      background: rgba(10, 14, 40, 0.66);
      border: 3px solid rgba(233, 185, 73, 0.9);
    }
    .hl {
      color: #ffc94d;
    }
    .emoji {
      font-family: "Noto Color Emoji", sans-serif;
    }
    #cta {
      position: absolute;
      left: 60px;
      width: 960px;
      top: 1040px;
      text-align: center;
    }
    #cta-ask {
      display: inline-block;
      padding: 16px 34px 22px;
      border-radius: 30px;
      background: rgba(10, 14, 40, 0.72);
      font-family: "Noto Serif Tamil", serif;
      font-weight: 700;
      font-size: 64px;
      line-height: 1.3;
      color: #ffffff;
    }
    #cta-btn {
      display: inline-block;
      margin-top: 26px;
      padding: 10px 46px 14px;
      border-radius: 22px;
      background: #c4600f;
      font-family: "Montserrat", sans-serif;
      font-weight: 700;
      font-size: 84px;
      letter-spacing: 0.06em;
      color: #ffffff;
    }
    #cta-sub {
      margin-top: 22px;
      font-family: "Noto Sans Tamil", sans-serif;
      font-weight: 700;
      font-size: 40px;
      color: #ffe3a3;
      text-shadow: 0 2px 10px rgba(5, 7, 15, 0.9);
    }
    #cta-handle {
      margin-top: 10px;
      font-family: "Montserrat", sans-serif;
      font-size: 32px;
      color: #ffffff;
      text-shadow: 0 2px 10px rgba(5, 7, 15, 0.9);
    }
'''
    html = js = ""
    for i, (txt, a, b, place) in enumerate(TEXTS):
        bid = f"b{i}"
        st, du = t(a), end(b) - t(a)
        html += f'    <div id="{bid}" class="clip beat {place}" data-start="{st}" data-duration="{du:.3f}" data-track-index="{i % 2}">\n      <div id="{bid}-line" class="line">{txt}</div>\n    </div>\n'
        if a == 0:
            # the hook is fully on screen at frame 0 (it is the thumbnail), then pulses on the beat
            for kk in range(a, b, 2):
                js += f'    tl.set("#{bid}-line", {{ scale: 1.06 }}, {t(kk)});\n'
                js += f'    tl.to("#{bid}-line", {{ scale: 1, duration: 0.3, ease: "power2.out" }}, {t(kk)});\n'
        else:
            js += f'    tl.fromTo("#{bid}-line", {{ opacity: 0, scale: 0.6, y: 40 }}, {{ opacity: 1, scale: 1, y: 0, duration: 0.26, ease: "back.out(2.6)" }}, {st});\n'
        js += f'    tl.to("#{bid}-line", {{ opacity: 0, scale: 1.08, duration: 0.12, ease: "power1.in" }}, {end(b) - 0.12:.3f});\n'
    ask, btn, sub, a, b = CTA
    st, du = t(a), end(b) - t(a)
    html += f'''    <div id="cta" class="clip" data-start="{st}" data-duration="{du:.3f}" data-track-index="2">
      <div id="cta-ask">{ask}</div>
      <div><div id="cta-btn">{btn}</div></div>
      <div id="cta-sub">{sub}</div>
      <div id="cta-handle">{HANDLE}</div>
    </div>
'''
    js += f'    tl.fromTo("#cta-ask", {{ opacity: 0, scale: 0.6 }}, {{ opacity: 1, scale: 1, duration: 0.26, ease: "back.out(2.6)" }}, {st});\n'
    js += f'    tl.fromTo("#cta-btn", {{ opacity: 0, scale: 0.5 }}, {{ opacity: 1, scale: 1, duration: 0.3, ease: "back.out(3)" }}, {t(a + 1)});\n'
    js += f'    tl.fromTo("#cta-sub", {{ opacity: 0, y: 20 }}, {{ opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }}, {t(a + 2)});\n'
    js += f'    tl.fromTo("#cta-handle", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.3 }}, {t(a + 2)});\n'
    for kk in range(a + 3, b - 1, 2):  # FOLLOW pulses on the beat
        js += f'    tl.set("#cta-btn", {{ scale: 1.1 }}, {t(kk)});\n'
        js += f'    tl.to("#cta-btn", {{ scale: 1, duration: 0.3, ease: "power2.out" }}, {t(kk)});\n'
    return wrap("texts", css, html, js)


def index():
    audio = f'      <audio id="music" class="clip" src="{MUSIC[0]}" data-start="0" data-duration="{TOTAL}" data-volume="{MUSIC[1]}" data-track-index="6" data-fade-out="0.6"></audio>\n'
    for i, (f, st, du, vol) in enumerate(SFX):
        st = t(CTA[3]) if st is None else st
        audio += f'      <audio id="sfx{i}" class="clip" src="{f}" data-start="{st}" data-duration="{du}" data-volume="{vol}" data-track-index="{7 + i}" data-fade-out="0.4"></audio>\n'
    layers = "\n".join(
        f'      <div id="{c}" data-composition-id="{c}" data-composition-src="compositions/{c}.html" data-start="0" data-duration="{TOTAL}" data-track-index="{n}" data-track-kind="{k}" data-width="1080" data-height="1920"></div>'
        for n, (c, k) in enumerate([("shots", "graphics"), ("fx", "graphics"), ("texts", "captions")], start=1))
    return f'''<!doctype html>
<html lang="ta" data-resolution="portrait">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <script src="assets/gsap.min.js"></script>
    <style>
      /* {TITLE}, {TOTAL}s, {BPM:g} BPM. Brand: saffron, gold, deep blue. */
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
        background: #05070f;
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

      <!-- Music: ElevenLabs Music v2.5 (Hare Krishna mahamantra); conch: ElevenLabs Sound Effects; bell from Day 2 -->
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
    cuts = [t(a) for _, a, _, _ in SHOTS]
    print(f"{len(SHOTS)} shots, cuts at {cuts}, {TOTAL}s")
