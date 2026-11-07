"""Day 12 (Tamil): "Chat with Kanna" at 3 a.m., format C in content/formats.md. A phone chat drawn in HyperFrames: the
viewer's messages, "seen", "கண்ணா is typing…", his replies, then a SHARE ask. No pictures, no faces, no voice, no beat
cuts (any calm track can go under it in Instagram; ZAKHELO is rested after three reels).

Run from reels/day12-ta:  python3 tools/build_day12.py && npm run check && npm run render
"""
import random
import subprocess

W, H = 1080, 1920
TOTAL = 19.0
TOP = 290          # first message y
GAP = 26           # space between bubbles
LINE = 74          # line height of bubble text (54 px font)
PAD = 44           # vertical padding inside a bubble

# who, text (lines split by <br>), appear time. "me" is the viewer, "k" is Kanna.
MSGS = [
    ("me", "கண்ணா… தூங்கிட்டியா?", 0.0),
    ("me", "யாருக்கும் என் மேல<br>அக்கறை இல்ல 😔", 1.5),
    ("me", "எல்லாம் தோத்துப் போச்சு…", 2.9),
    ("k", "நான் தூங்கவே இல்லை.", 6.0),
    ("k", "உன் ஒவ்வொரு கண்ணீரையும்<br>நான் பார்த்தேன்.", 8.3),
    ("k", "தோல்வி முடிவு இல்லை.<br>உன் தேரை இன்னும்<br>நான்தான் ஓட்டுறேன். 🦚", 10.7),
    ("me", "நிஜமாவா கண்ணா?", 12.9),
    ("k", "எப்போதும். 🙏", 14.6),
]
SEEN = 4.1                                     # the viewer's messages turn "seen"
TYPING = [(4.5, 6.0), (7.0, 8.3), (9.3, 10.7), (13.7, 14.6)]   # "typing…" before each reply
CTA = 15.9

FEATHER = ('<svg viewBox="0 0 90 220" width="{w}" height="{h}"><path d="M45 218 L45 40" stroke="#e6c46a" stroke-width="3"/>'
           '<path d="M45 20 C10 50 8 120 45 200 C82 120 80 50 45 20 Z" fill="#1f6b4f"/>'
           '<ellipse cx="45" cy="62" rx="24" ry="30" fill="#2e8b57"/><ellipse cx="45" cy="64" rx="16" ry="21" fill="#d4a017"/>'
           '<ellipse cx="45" cy="66" rx="10" ry="14" fill="#1e5aa8"/><ellipse cx="45" cy="68" rx="5" ry="7" fill="#0b1f4d"/></svg>')

SFX = "assets/sfx/"
SENT = ["elec_pop.wav", "elec_plip.wav", "elec_blip.wav", "elec_pop.wav"]
RECV = ["elec_twip.wav", "elec_ping.wav", "elec_blip2.wav", "elec_twip.wav"]


def audio_plan():
    plan = [(SFX + "ambi_drone.wav", 0.0, 0.22, 2, {"dur": 4.4, "fin": 0.2, "fout": 1.5})]
    si = ri = 0
    for k, (who, _, t, *_rest) in enumerate(MSGS):
        if who == "me":
            if t > 0:
                plan.append((SFX + SENT[si], t, 0.55, 10 + k, {}))
            si += 1
        else:
            plan.append((SFX + RECV[ri], t, 0.55, 10 + k, {}))
            ri += 1
    # soft keyboard ticks while the viewer is "typing" between their own messages
    for t in (1.0, 1.15, 1.3, 2.4, 2.55, 2.7, 12.4, 12.55, 12.7):
        plan.append((SFX + "elec_tick.wav", t, 0.35, 30 + int(t * 10), {}))
    plan.append((SFX + "guit_em9.wav", 6.0, 0.22, 3, {"dur": 9.5, "fin": 1.5, "fout": 2.5}))   # a warm pad under his replies
    plan.append((SFX + "ambi_glass_rub.wav", 14.6, 0.45, 4, {"fout": 1.2}))                     # his last word glows
    plan.append((SFX + "ambi_piano.wav", CTA, 0.4, 5, {"fout": 1.0}))
    return plan


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
    rnd = random.Random(12)
    css = '''    @font-face {
      font-family: "Noto Sans Tamil";
      src: url("assets/fonts/NotoSansTamil.ttf");
    }
    @font-face {
      font-family: "Noto Color Emoji";
      src: url("assets/fonts/NotoColorEmoji.ttf");
    }
    #bg {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, #0b1020 0%, #0d1428 60%, #121a33 100%);
    }
    .star {
      position: absolute;
      width: 3px;
      height: 3px;
      border-radius: 50%;
      background: #dfe6ff;
    }
    #status {
      position: absolute;
      left: 0;
      top: 0;
      width: 1080px;
      height: 80px;
      font-family: "Noto Sans Tamil", sans-serif;
      font-size: 34px;
      color: #e8ecff;
    }
    #status .time {
      position: absolute;
      left: 60px;
      top: 22px;
      font-weight: 700;
    }
    #status .batt {
      position: absolute;
      right: 60px;
      top: 30px;
      width: 58px;
      height: 26px;
      border: 3px solid #e8ecff;
      border-radius: 7px;
    }
    #status .batt i {
      position: absolute;
      left: 3px;
      top: 3px;
      width: 12px;
      height: 14px;
      background: #ff5a5a;
      border-radius: 2px;
    }
    #header {
      position: absolute;
      left: 0;
      top: 80px;
      width: 1080px;
      height: 150px;
      background: #141c36;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    #header .back {
      position: absolute;
      left: 38px;
      top: 38px;
      font-size: 60px;
      color: #c9d3ff;
      font-family: sans-serif;
    }
    #header .avatar {
      position: absolute;
      left: 110px;
      top: 25px;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: radial-gradient(circle at 50% 40%, #3a2a0e, #1a1206);
      border: 3px solid #d9b25a;
      overflow: hidden;
    }
    #header .avatar svg {
      position: absolute;
      left: 32px;
      top: 6px;
    }
    #header .name {
      position: absolute;
      left: 236px;
      top: 26px;
      font-family: "Noto Sans Tamil", "Noto Color Emoji", sans-serif;
      font-weight: 700;
      font-size: 46px;
      color: #ffffff;
    }
    #header .sub {
      position: absolute;
      left: 238px;
      top: 92px;
      font-family: "Noto Sans Tamil", sans-serif;
      font-size: 28px;
      color: #8fd19e;
    }
    .bubble {
      position: absolute;
      max-width: 960px;
      padding: 20px 30px;
      border-radius: 34px;
      font-family: "Noto Sans Tamil", "Noto Color Emoji", sans-serif;
      font-size: 54px;
      line-height: ''' + str(LINE) + '''px;
      white-space: nowrap;
    }
    .me {
      right: 46px;
      background: #1e6a58;
      color: #f2fff9;
      border-bottom-right-radius: 8px;
    }
    .k {
      left: 46px;
      background: linear-gradient(160deg, #fff5dc, #f1dfb2);
      color: #3b1d05;
      border: 3px solid #d9b25a;
      border-bottom-left-radius: 8px;
      box-shadow: 0 0 28px rgba(255, 196, 90, 0.35);
    }
    .tick {
      font-size: 30px;
      margin-left: 14px;
      color: #c9dcd3;
      font-family: sans-serif;
    }
    #typing {
      position: absolute;
      left: 46px;
      width: 170px;
      height: 100px;
      border-radius: 34px;
      background: #f6ead0;
      border: 3px solid #d9b25a;
    }
    #typing i {
      position: absolute;
      top: 40px;
      width: 20px;
      height: 18px;
      border-radius: 50%;
      background: #8a6a2a;
    }
    #hook {
      position: absolute;
      left: 40px;
      width: 1000px;
      top: 1640px;
      text-align: center;
      font-family: "Noto Sans Tamil", "Noto Color Emoji", sans-serif;
      font-weight: 700;
      font-size: 52px;
      line-height: 1.4;
      color: #ffffff;
      text-shadow: 0 3px 12px rgba(0, 0, 0, 0.9);
    }
    #hook b, #cta b {
      color: #ffd34d;
    }
    #cta {
      position: absolute;
      left: 0;
      top: 0;
      width: 1080px;
      height: 1920px;
      background: linear-gradient(180deg, rgba(8, 10, 22, 0) 0%, rgba(8, 10, 22, 0) 55%, rgba(8, 10, 22, 0.6) 100%);
    }
    #cta .t {
      position: absolute;
      left: 40px;
      width: 1000px;
      top: 1180px;
      text-align: center;
      font-family: "Noto Sans Tamil", "Noto Color Emoji", sans-serif;
      font-weight: 700;
      font-size: 56px;
      line-height: 1.45;
      color: #ffffff;
    }
    #cta .h {
      position: absolute;
      left: 0;
      width: 1080px;
      top: 1760px;
      text-align: center;
      font-family: "Noto Sans Tamil", sans-serif;
      font-size: 32px;
      color: #ffe7b0;
    }
    #glow {
      position: absolute;
      border-radius: 40px;
      box-shadow: 0 0 60px 20px rgba(255, 200, 90, 0.55);
      opacity: 0;
    }
'''
    html = f'    <div id="bg" class="clip" data-start="0" data-duration="{TOTAL}" data-track-index="0"></div>\n'
    js = ""
    html += f'    <div id="stars" class="clip" data-start="0" data-duration="{TOTAL}" data-track-index="1" data-layout-ignore>\n'
    for k in range(40):
        x, y = rnd.randint(0, 1075), rnd.randint(240, 1900)
        html += f'      <div id="s{k}" class="star" style="left: {x}px; top: {y}px;"></div>\n'
        js += f'    tl.fromTo("#s{k}", {{ opacity: 0.15 }}, {{ opacity: 0.7, duration: {rnd.uniform(1.2, 2.6):.2f}, yoyo: true, repeat: 5, ease: "sine.inOut" }}, {rnd.uniform(0, 2):.2f});\n'
    html += '    </div>\n'

    # status bar and chat header
    html += (f'    <div id="status" class="clip" data-start="0" data-duration="{TOTAL}" data-track-index="2">'
             f'<div class="time">3:07</div><div class="batt"><i></i></div></div>\n')
    html += (f'    <div id="header" class="clip" data-start="0" data-duration="{TOTAL}" data-track-index="3">'
             f'<div class="back">‹</div><div class="avatar">{FEATHER.format(w=36, h=88)}</div>'
             f'<div class="name">கண்ணா 🦚</div><div id="sub" class="sub">online</div></div>\n')

    # bubbles: stacked from TOP; each message's y comes from the heights of those above it
    y = TOP
    ticks = []
    for k, (who, text, t) in enumerate(MSGS):
        lines = text.count("<br>") + 1
        h = lines * LINE + PAD
        tick = '<span class="tick" id="tk{0}">✓✓</span>'.format(k) if who == "me" else ""
        if who == "me":
            ticks.append(k)
        html += (f'    <div id="b{k}" class="clip bubble {who}" style="top: {y}px;" data-start="{t:.2f}" '
                 f'data-duration="{TOTAL - t:.2f}" data-track-index="{4 + k % 2}">{text}{tick}</div>\n')
        if t > 0:
            ox = "100% 100%" if who == "me" else "0% 100%"
            js += f'    tl.fromTo("#b{k}", {{ opacity: 0, scale: 0.7, y: 30, transformOrigin: "{ox}" }}, {{ opacity: 1, scale: 1, y: 0, duration: 0.28, ease: "back.out(1.6)" }}, {t:.2f});\n'
        if k == len(MSGS) - 1:
            last_y, last_h = y, h
        y += h + GAP
        if k + 1 < len(MSGS):
            next_y = y
        # remember where the typing bubble sits before each reply
        MSGS[k] = (who, text, t, y - h - GAP)
    # "seen": the viewer's ticks turn gold
    for k in ticks:
        js += f'    tl.set("#tk{k}", {{ color: "#ffd34d" }}, {SEEN});\n'

    # typing indicator: one element moved to the slot of the next reply
    html += f'    <div id="typing" class="clip" data-start="{TYPING[0][0]}" data-duration="{TYPING[-1][1] - TYPING[0][0]:.2f}" data-track-index="6"><i style="left: 32px"></i><i style="left: 66px"></i><i style="left: 100px"></i></div>\n'
    replies = [m for m in MSGS if m[0] == "k"]
    js += '    tl.set("#typing", { opacity: 0 }, 0);\n'
    for (a, b), r in zip(TYPING, replies):
        js += f'    tl.set("#typing", {{ top: {r[3]}, opacity: 1 }}, {a});\n'
        js += f'    tl.set("#typing", {{ opacity: 0 }}, {b - 0.02:.2f});\n'
        js += f'    tl.set("#sub", {{ textContent: "typing…" }}, {a});\n'
        js += f'    tl.set("#sub", {{ textContent: "online" }}, {b:.2f});\n'
        for d in range(3):
            js += (f'    tl.fromTo("#typing i:nth-child({d + 1})", {{ y: 0 }}, {{ y: -12, duration: 0.22, yoyo: true, repeat: {int((b - a) / 0.44) * 2 - 1}, '
                   f'ease: "sine.inOut", immediateRender: false }}, {a + d * 0.12:.2f});\n')

    # his last word glows
    html += (f'    <div id="glow" class="clip" style="left: 46px; top: {last_y}px; width: 330px; height: {last_h}px;" '
             f'data-start="{MSGS[-1][2]:.2f}" data-duration="{TOTAL - MSGS[-1][2]:.2f}" data-track-index="7" data-layout-ignore></div>\n')
    js += f'    tl.fromTo("#glow", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.6, yoyo: true, repeat: 1, ease: "sine.inOut" }}, {MSGS[-1][2] + 0.2:.2f});\n'

    # hook (frame 0, the thumbnail) and the share ask
    html += (f'    <div id="hook" class="clip" data-start="0" data-duration="4.0" data-track-index="8">'
             f'<span style="white-space: nowrap">இரவு 3 மணிக்கு <b>கண்ணனுக்கு</b><br>மெசேஜ் அனுப்பினால்…</span></div>\n')
    js += '    tl.to("#hook", { opacity: 0, duration: 0.4 }, 3.6);\n'
    html += (f'    <div id="cta" class="clip" data-start="{CTA}" data-duration="{TOTAL - CTA:.2f}" data-track-index="9">'
             f'<div class="t">இதைப் படிக்கும்போது<br><b>யார்</b> ஞாபகம் வந்தாங்க?<br>அவங்களுக்கு அனுப்பு 💛</div>'
             f'<div class="h">@lordsrikrishnatemple</div></div>\n')
    for k in range(len(MSGS) - 1):
        js += f'    tl.to("#b{k}", {{ opacity: 0, duration: 0.45 }}, {CTA - 0.3:.2f});\n'
    js += '    tl.to("#typing", { opacity: 0, duration: 0.2 }, 0.0);\n' if False else ''
    js += f'    tl.to("#b{len(MSGS) - 1}", {{ x: 300, y: {900 - last_y}, scale: 1.5, duration: 0.6, ease: "power2.inOut" }}, {CTA - 0.3:.2f});\n'
    js += f'    tl.to("#glow", {{ opacity: 0, duration: 0.3 }}, {CTA - 0.3:.2f});\n'
    js += f'    tl.fromTo("#cta", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.6, ease: "power2.out" }}, {CTA});\n'
    return wrap("scene", css, html, js)


def index():
    audio = ""
    for i, (f, st, vol, tr, o) in enumerate(audio_plan()):
        du = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f],
                                  capture_output=True, text=True, check=True).stdout)
        du = min(du, o.get("dur", du), TOTAL - st)
        extra = f' data-fade-in="{o["fin"]}"' if "fin" in o else ""
        extra += f' data-fade-out="{o["fout"]}"' if "fout" in o else ""
        audio += f'      <audio id="a{i}" class="clip" src="{f}" data-start="{st:.2f}" data-duration="{du:.3f}" data-volume="{vol}" data-track-index="{tr}"{extra}></audio>\n'
    return f'''<!doctype html>
<html lang="ta" data-resolution="portrait">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width={W}, height={H}" />
    <script src="assets/gsap.min.js"></script>
    <style>
      /* Day 12 (Tamil) · Chat with Kanna at 3 a.m., {TOTAL}s. Night blue and gold. */
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
        background: #0b1020;
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

      <!-- No voice. Effects: CC0 Sonic Pi samples (assets/sfx/CREDITS.md). -->
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
