"""Writes the Day 3 HyperFrames composition: index.html, one scene file per picture, fx.html and subs.html.

Run from reels/day3:  python3 tools/build_composition.py
Timings come from the voice files (assets/vo/*.wav) and their word alignment (assets/vo/alignment.json).
"""
import json
import subprocess

# id, image, start, duration, camera from, camera to (x/y/scale of the image's top-left corner on a 1080x1920 frame)
SCENES = [
    ("hook", "05-alankaram.png", 0.0, 3.6, (-435, 0, 1.75), (-490, -88, 1.85)),  # close on Kanha's face, below the title
    ("town", "01-night-temple.png", 3.6, 3.4, (-54, 0, 1.1), (-81, -288, 1.15)),  # tilts down from the moon to the lit door
    ("bell", "02-bell.png", 7.0, 2.0, (-108, -150, 1.2), (-54, -96, 1.1)),
    ("suprabhatam", "03-suprabhatam.png", 9.0, 3.0, (-27, -48, 1.05), (-260, -260, 1.25)),  # pushes in on the priest
    ("abhishekam", "04-abhishekam.png", 12.0, 2.8, (-300, -330, 1.3), (-160, -160, 1.15)),
    ("alankaram", "05-alankaram.png", 14.8, 3.0, (-108, -150, 1.12), (-36, -48, 1.04)),
    ("aarti", "06-aarti.png", 17.8, 2.2, (-54, -96, 1.1), (-120, -180, 1.18)),
    ("doors", "07-doors-open.png", 20.0, 4.4, (-36, -48, 1.04), (-216, -330, 1.3)),
    ("cta", "08-dawn.png", 24.4, 5.6, (0, 0, 1.0), (-54, -96, 1.08)),
]
VO = [("l1-hook", 0.6), ("l2-town", 3.9), ("l3-bell", 7.2), ("l4-suprabhatam", 9.3), ("l5-abhishekam", 12.3),
      ("l6-alankaram", 15.1), ("l7-aarti", 18.1), ("l8-doors", 20.3), ("l9-cta", 24.8)]
# id, file, start, duration, volume, track
SFX = [("bell-open", "temple-bell.mp3", 0.0, 2.0, 0.35, 7), ("bell-once", "temple-bell.mp3", 7.0, 2.0, 0.6, 8),
       ("sparkle-alankaram", "sparkle.mp3", 14.6, 1.4, 0.25, 9), ("whoosh-doors", "whoosh-short.mp3", 19.75, 0.55, 0.3, 8),
       ("chime-doors", "chime.mp3", 20.2, 2.1, 0.35, 7), ("bell-cta", "temple-bell.mp3", 24.3, 2.0, 0.45, 8)]
LEAKS = [("leak1", 3.0), ("leak2", 11.4), ("leak3", 14.2), ("leak4", 19.4), ("leak5", 23.8)]  # peak = start + 0.6 = the cut
FLASH = ("flash1", 17.5)  # peak = start + 0.3 = the first aarti
TOTAL = 30.0
# Subtitle spelling for spoken tokens (None drops the token)
NO_SUBS = {"l1-hook"}  # the hook title already shows this line
DISPLAY = {"l2-town": {"Four": "4", "AM.": "AM."}, "l8-doors": {"four,": "4,"}}


def duration(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path],
                         capture_output=True, text=True, check=True).stdout
    return float(out)


def scene(sid, img, dur, a, b, css="", html="", js=""):
    (fx, fy, fs), (tx, ty, ts) = a, b
    return f'''<template>
  <style>
    #root {{
      position: absolute;
      inset: 0;
      overflow: hidden;
      background: #05070f;
    }}
    #{sid}-photo {{
      position: absolute;
      left: 0;
      top: 0;
      width: 1080px;
      height: 1920px;
    }}
{css}  </style>
  <div id="root" data-composition-id="{sid}" data-width="1080" data-height="1920">
    <img id="{sid}-photo" class="clip" data-layout-allow-overflow src="assets/img/{img}" alt="" data-start="0" data-duration="{dur}" data-track-index="0" />
{html}  </div>
  <script>
    const tl = gsap.timeline({{ paused: true }});
    tl.fromTo("#{sid}-photo", {{ x: {fx}, y: {fy}, scale: {fs}, transformOrigin: "0 0" }}, {{ x: {tx}, y: {ty}, scale: {ts}, duration: {dur}, ease: "sine.inOut" }}, 0);
{js}    window.__timelines["{sid}"] = tl;
  </script>
</template>
'''


HOOK_CSS = '''    #hook-dip {
      position: absolute;
      inset: 0;
      background: #05070f;
    }
    #hook-scrim {
      position: absolute;
      left: 0;
      top: 0;
      width: 1080px;
      height: 860px;
      background: linear-gradient(to bottom, rgba(5, 7, 15, 0.85), rgba(5, 7, 15, 0.45) 60%, rgba(5, 7, 15, 0));
    }
    #hook-title {
      position: absolute;
      left: 90px;
      width: 900px;
      top: 330px;
      text-align: center;
    }
    #hook-text {
      font-family: "Playfair Display", serif;
      font-weight: 700;
      font-size: 96px;
      line-height: 1.06;
      color: #ffffff;
      text-wrap: balance;
      text-shadow: 0 6px 30px rgba(0, 0, 0, 0.7);
    }
    #hook-rule {
      width: 160px;
      height: 6px;
      margin: 36px auto 0;
      background: linear-gradient(to right, #f28c28, #e9b949);
      border-radius: 3px;
    }
'''
HOOK_HTML = '''    <div id="hook-dip" class="clip" data-start="0" data-duration="2.2" data-track-index="1" data-layout-ignore></div>
    <div id="hook-scrim" class="clip" data-start="0" data-duration="3.6" data-track-index="2" data-layout-ignore></div>
    <div id="hook-title" class="clip" data-start="0" data-duration="3.6" data-track-index="3">
      <div id="hook-text">Nobody tells you Kanha wakes before you</div>
      <div id="hook-rule"></div>
    </div>
'''
HOOK_JS = '''    // Starts in near darkness with the hook already readable, so frame 0 works as the thumbnail
    tl.fromTo("#hook-dip", { opacity: 0.94 }, { opacity: 0, duration: 1.9, ease: "sine.inOut" }, 0.1);
    tl.fromTo("#hook-text", { y: 0 }, { y: -8, duration: 3.6, ease: "none" }, 0);
    tl.fromTo("#hook-rule", { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: "power2.out" }, 0.4);
'''
CTA_CSS = '''    #cta-scrim {
      position: absolute;
      left: 0;
      top: 0;
      width: 1080px;
      height: 1150px;
      background: linear-gradient(to bottom, rgba(14, 31, 77, 0.92), rgba(14, 31, 77, 0.85) 62%, rgba(14, 31, 77, 0));
    }
    #cta-block {
      position: absolute;
      left: 90px;
      width: 900px;
      top: 340px;
      text-align: center;
    }
    #cta-head {
      font-family: "Playfair Display", serif;
      font-weight: 700;
      font-size: 92px;
      line-height: 1.1;
      color: #ffffff;
    }
    #cta-word {
      display: inline-block;
      margin-top: 18px;
      padding: 10px 38px 14px;
      border-radius: 22px;
      background: #c4600f;
      font-family: "Montserrat", sans-serif;
      font-weight: 700;
      font-size: 96px;
      letter-spacing: 0.06em;
      color: #ffffff;
    }
    #cta-sub {
      margin-top: 30px;
      font-family: "Montserrat", sans-serif;
      font-weight: 700;
      font-size: 40px;
      line-height: 1.3;
      color: #f6dfa0;
    }
    #cta-handle {
      margin-top: 18px;
      font-family: "Montserrat", sans-serif;
      font-weight: 400;
      font-size: 32px;
      color: #ffffff;
    }
'''
CTA_HTML = '''    <div id="cta-scrim" class="clip" data-start="0" data-duration="5.6" data-track-index="1" data-layout-ignore></div>
    <div id="cta-block" class="clip" data-start="0.2" data-duration="5.4" data-track-index="2">
      <div id="cta-head">Daily darshan</div>
      <div id="cta-word">FOLLOW</div>
      <div id="cta-sub">Wake up with Kanha every morning</div>
      <div id="cta-handle">@lordsrikrishnatemple</div>
    </div>
'''
CTA_JS = '''    tl.fromTo("#cta-head", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, 0.3);
    tl.fromTo("#cta-word", { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)" }, 0.6);
    // A few gentle pulses on FOLLOW (finite, so every frame stays seekable)
    tl.to("#cta-word", { scale: 1.06, duration: 0.35, ease: "sine.inOut", yoyo: true, repeat: 3 }, 2.2);
    tl.fromTo("#cta-sub", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, 1.0);
    tl.fromTo("#cta-handle", { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "sine.out" }, 1.4);
'''
EXTRAS = {"hook": (HOOK_CSS, HOOK_HTML, HOOK_JS), "cta": (CTA_CSS, CTA_HTML, CTA_JS)}


def subtitle_groups():
    script = {l.split("|")[0]: l.split("|")[1].strip() for l in open("assets/vo/script.txt") if "|" in l}
    align = json.load(open("assets/vo/alignment.json"))
    groups = []
    for name, off in VO:
        if name in NO_SUBS:
            continue
        toks = script[name].replace("...", "…").split()
        segs = align[name]
        assert len(toks) == len(segs), (name, toks, segs)
        cur = []
        for tok, (_, s, e) in zip(toks, segs):
            tok = DISPLAY.get(name, {}).get(tok, tok)
            if tok is None:
                continue
            cur.append((tok, off + s, off + e))
            # one group per sentence; the doors line also splits after "4,"
            if tok.endswith((".", "?", "…")) or tok == "4,":
                groups.append(cur)
                cur = []
        if cur:
            groups.append(cur)
    return groups


def subs_html():
    groups = subtitle_groups()
    html = js = ""
    for gi, g in enumerate(groups):
        a = g[0][1] - 0.08
        nxt = groups[gi + 1][0][1] - 0.1 if gi + 1 < len(groups) else TOTAL - 0.2
        b = min(g[-1][2] + 0.9, nxt)
        gid = f"s{gi + 1}"
        spans = " ".join(f'<span id="{gid}-w{i}" class="sub-word">{w}</span>' for i, (w, _, _) in enumerate(g))
        html += f'''    <div id="{gid}" class="clip sub-group" data-start="{a:.2f}" data-duration="{b - a:.2f}" data-track-index="{gi % 2}">
      <div id="{gid}-line" class="sub-line">{spans}</div>
    </div>
'''
        for i, (_, s, _) in enumerate(g):
            js += f'''    tl.fromTo("#{gid}-w{i}", {{ opacity: 0, y: 18, scale: 0.86, color: "#E9B949" }}, {{ opacity: 1, y: 0, scale: 1, duration: 0.16, ease: "back.out(2.4)" }}, {s:.2f});
    tl.to("#{gid}-w{i}", {{ color: "#FFFFFF", duration: 0.25, ease: "sine.out" }}, {s + 0.3:.2f});
'''
        js += f'''    tl.to("#{gid}-line", {{ opacity: 0, duration: 0.18, ease: "power1.in" }}, {b - 0.2:.2f});
'''
    return f'''<template>
  <style>
    #root {{
      position: absolute;
      inset: 0;
      pointer-events: none;
    }}
    .sub-group {{
      position: absolute;
      left: 108px;
      width: 864px;
      top: 1120px;
      text-align: center;
    }}
    .sub-line {{
      display: inline-block;
      max-width: 864px;
      padding: 14px 28px 18px;
      border-radius: 28px;
      background: rgba(14, 31, 77, 0.62);
      font-family: "Montserrat", sans-serif;
      font-weight: 700;
      font-size: 60px;
      line-height: 1.2;
      color: #ffffff;
      text-wrap: balance;
      text-shadow: 0 3px 0 rgba(14, 31, 77, 0.9), 0 0 24px rgba(5, 7, 15, 0.85);
    }}
    .sub-word {{
      display: inline-block;
      margin: 0 0.12em;
    }}
  </style>
  <div id="root" data-composition-id="subs" data-width="1080" data-height="1920">
{html}  </div>
  <script>
    const tl = gsap.timeline({{ paused: true }});
    // Each word pops in gold as it is spoken (times from assets/vo/alignment.json), then settles to white
{js}    window.__timelines["subs"] = tl;
  </script>
</template>
'''


def fx_html():
    base = open("compositions/fx.html").read()
    css = base[base.index("<style>") + len("<style>\n"):base.index("  </style>")]
    html = js = ""
    for lid, t in LEAKS:
        html += f'''    <div id="{lid}" class="clip fx-leak" data-start="{t}" data-duration="1.2" data-track-index="0" data-layout-ignore>
      <div id="{lid}-inner" class="fx-leak-inner">
        <div id="{lid}-amber" class="fx-layer fx-amber"></div>
        <div id="{lid}-rose" class="fx-layer fx-rose"></div>
        <div id="{lid}-gold" class="fx-layer fx-gold"></div>
      </div>
    </div>
'''
        js += f'''    tl.fromTo("#{lid}-inner", {{ opacity: 0 }}, {{ opacity: 0.95, duration: 0.55, ease: "sine.out" }}, {t});
    tl.to("#{lid}-inner", {{ opacity: 0, duration: 0.6, ease: "sine.in" }}, {t + 0.58:.2f});
    tl.fromTo("#{lid}-amber", {{ xPercent: -22, scale: 0.92, rotation: -4 }}, {{ xPercent: 18, scale: 1.1, rotation: 2, duration: 1.2, ease: "sine.inOut" }}, {t});
    tl.fromTo("#{lid}-rose", {{ xPercent: 20, yPercent: -8, scale: 1.08 }}, {{ xPercent: -16, yPercent: 8, scale: 0.94, duration: 1.2, ease: "sine.inOut" }}, {t});
    tl.fromTo("#{lid}-gold", {{ xPercent: -28, rotation: -6 }}, {{ xPercent: 24, rotation: 4, duration: 1.2, ease: "sine.inOut" }}, {t});
'''
    fid, t = FLASH
    html += f'''    <div id="{fid}" class="clip fx-flash" data-start="{t}" data-duration="0.6" data-track-index="1" data-layout-ignore>
      <div id="{fid}-inner" class="fx-flash-inner"></div>
    </div>
'''
    js += f'''    tl.fromTo("#{fid}-inner", {{ opacity: 0 }}, {{ opacity: 0.92, duration: 0.28, ease: "power2.in" }}, {t});
    tl.to("#{fid}-inner", {{ opacity: 0, duration: 0.3, ease: "power2.out" }}, {t + 0.29:.2f});
'''
    return f'''<template>
  <style>
{css}  </style>
  <div id="root" data-composition-id="fx" data-width="1080" data-height="1920">
{html}  </div>
  <script>
    const tl = gsap.timeline({{ paused: true }});
    // Light leaks peak on the cuts at 3.6, 12.0, 14.8, 20.0 and 24.4s; the flash lights the first aarti at 17.8s
{js}    window.__timelines["fx"] = tl;
  </script>
</template>
'''


def index_html():
    hosts = "\n".join(
        f'      <div id="{sid}" data-composition-id="{sid}" data-composition-src="compositions/{sid}.html" data-start="{st}" data-duration="{dur}" data-track-index="1" data-track-kind="graphics" data-width="1080" data-height="1920"></div>'
        for sid, _, st, dur, _, _ in SCENES)
    vo = "\n".join(
        f'      <audio id="vo-{n.split("-")[0]}" class="clip" src="assets/vo/{n}.wav" data-start="{o}" data-duration="{duration(f"assets/vo/{n}.wav"):.2f}" data-volume="1" data-track-index="6"></audio>'
        for n, o in VO)
    sfx = "\n".join(
        f'      <audio id="sfx-{i}" class="clip" src="assets/sfx/{f}" data-start="{s}"'
        + (' data-media-start="0.4"' if f == "chime.mp3" else "")
        + f' data-duration="{du}" data-volume="{v}" data-track-index="{tr}" data-fade-out="0.4"></audio>'
        for i, f, s, du, v, tr in SFX)
    return f'''<!doctype html>
<html lang="en" data-resolution="portrait">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <script src="assets/gsap.min.js"></script>
    <style>
      /* Day 3 · Kanha's morning · "Nobody tells you Kanha wakes before you", {TOTAL}s. Brand: saffron, gold, deep blue. */
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
    <div
      id="root"
      data-composition-id="main"
      data-start="0"
      data-duration="{TOTAL}"
      data-width="1080"
      data-height="1920"
    >
      <!-- Picture scenes; the cuts sit under the fx layer -->
{hosts}

      <!-- Light leaks and the aarti flash -->
      <div id="fx" data-composition-id="fx" data-composition-src="compositions/fx.html" data-start="0" data-duration="{TOTAL}" data-track-index="2" data-track-kind="graphics" data-width="1080" data-height="1920"></div>

      <!-- Every subtitle group -->
      <div id="subs" data-composition-id="subs" data-composition-src="compositions/subs.html" data-start="0" data-duration="{TOTAL}" data-track-index="3" data-track-kind="captions" data-width="1080" data-height="1920"></div>

      <!-- Voiceover: Kokoro-82M (Apache-2.0), voice af_heart -->
{vo}

      <!-- Sound effects: temple bell made with ElevenLabs (from Day 2); the rest bundled with media-use (Pixabay licence) -->
{sfx}
    </div>
    <script>
      window.__timelines = window.__timelines || {{}};
      window.__timelines["main"] = gsap.timeline({{ paused: true }});
    </script>
  </body>
</html>
'''


if __name__ == "__main__":
    for sid, img, _, dur, a, b in SCENES:
        open(f"compositions/{sid}.html", "w").write(scene(sid, img, dur, a, b, *EXTRAS.get(sid, ("", "", ""))))
    fx = fx_html()  # reads the existing fx.html styles, so build it before opening the file
    open("compositions/fx.html", "w").write(fx)
    open("compositions/subs.html", "w").write(subs_html())
    open("index.html", "w").write(index_html())
    for g in subtitle_groups():
        print(f"{g[0][1]:5.2f}s  " + " ".join(w for w, _, _ in g))
