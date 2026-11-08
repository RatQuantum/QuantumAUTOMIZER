"""Deepavali special (English, 8 Nov 2026): "One lamp is all it takes". Naraka Chaturdashi as celebrated in Tamil Nadu:
the night Krishna ended Narakasura's darkness. A new-moon night (no moon) at a temple courtyard with a South Indian
gopuram and a kolam ringed by unlit diyas. Krishna (the same ORIGINAL character as Day 14's cameo) walks in with one lit
lamp; a spark leaps to the centre diya; the light spreads ring by ring; the gopuram lights up; fireworks; "Happy Deepavali".
All drawn in SVG / HyperFrames; free voices; natural pace computed from the voice lengths; no bells, no beat shakes.

Run from reels/deepavali-en:  python3 tools/build_deepavali.py && npm run check && npm run render
"""
import math
import random
import subprocess

W, H = 1080, 1920
A, SFX = "assets/audio/", "assets/sfx/"


def dur(f):
    return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f],
                                capture_output=True, text=True, check=True).stdout)


D = {k: dur(A + k + ".wav") for k in ("n1", "n2", "n3", "k1", "n4")}
T = {"n1": 0.4, "walk": 0.6}
T["spark"] = T["n1"] + D["n1"] + 0.25
T["ignite"] = T["spark"] + 0.7
T["n2"] = T["ignite"] + 0.3
T["wave"] = T["n2"] + D["n2"] + 0.1          # the rings light up as the narrator finishes the story
T["n3"] = T["wave"] + 0.1
T["gopuram"] = T["wave"] + 2.3
T["fw"] = T["gopuram"] + 0.5
T["k1"] = T["fw"] + 0.4
T["wavehand"] = T["k1"] + D["k1"] + 0.1
T["card"] = T["wavehand"] + 0.2
T["n4"] = T["card"] + 0.3
T = {k: round(v, 2) for k, v in T.items()}
TOTAL = round(T["n4"] + D["n4"] + 1.6, 2)

CENTER = (540, 1520)
RINGS = [(150, 62, 8, 0.85), (290, 120, 14, 0.95), (430, 178, 20, 1.05)]   # rx, ry, count, diya scale
FIREWORKS = [(260, 560, "#ffd166", 0.0), (820, 500, "#ff5fa2", 0.55), (540, 420, "#7ae7ff", 1.15), (860, 700, "#9dff7a", 1.8),
             (200, 760, "#ffb347", 2.4)]

CAPS = [  # text, start, end, style
    ("One lamp… is all it takes.", 0.0, T["spark"] + 0.4, "n"),
    ("On this night, long ago,<br>Krishna ended the darkness<br>of <b>Narakasura</b>…", T["n2"], T["wave"], "n"),
    ("…and the world lit up<br>with <b>lamps.</b>", T["n3"], T["fw"], "n"),
    ("“Be the light…<br>for someone in the dark.”", T["k1"], T["card"], "k"),
]

AUDIO = [
    (A + "n1.wav", T["n1"], 1.0, 1, {}),
    (A + "n2.wav", T["n2"], 1.0, 1, {}),
    (A + "n3.wav", T["n3"], 1.0, 1, {}),
    (A + "k1.wav", T["k1"], 1.0, 2, {}),
    (A + "n4.wav", T["n4"], 1.0, 1, {}),
    (SFX + "ambi_glass_hum.wav", 0.0, 0.18, 10, {"fin": 0.5, "fout": 2.0}),
    (SFX + "perc_swash.wav", T["spark"], 0.5, 11, {}),
    (SFX + "ignite.wav", T["ignite"] - 0.05, 0.7, 12, {}),
    (SFX + "vinyl_hiss.wav", T["ignite"], 0.10, 13, {"fin": 0.5, "fout": 1.0}),
    (SFX + "loop_tabla.wav", T["wave"] - 0.1, 0.45, 14, {"fin": 0.3, "fout": 1.0}),
    (SFX + "guit_harmonics.wav", T["gopuram"], 0.4, 15, {"fout": 1.0}),
    *[(SFX + f, T["fw"] + dt - 0.45, 0.45, 16 + k, {}) for k, ((_, _, _, dt), f) in
      enumerate(zip(FIREWORKS, ["fw1.wav", "fw2.wav", "fw3.wav", "fw1.wav", "fw2.wav"]))],
    (SFX + "guit_em9.wav", T["card"], 0.25, 22, {"fin": 0.8, "fout": 1.5}),
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


def diya(did, x, y, sc):
    """A clay diya with a wick; the flame and its glow start hidden."""
    return (f'<g id="{did}" transform="translate({x:.0f} {y:.0f}) scale({sc:.2f})">'
            f'<circle id="{did}g" cx="0" cy="-26" r="46" fill="url(#flameglow)" opacity="0"/>'
            f'<path d="M-30 -4 Q0 26 30 -4 Q0 4 -30 -4 Z" fill="url(#clay)"/>'
            f'<ellipse cx="0" cy="-4" rx="30" ry="7" fill="#7a3a1c"/><ellipse cx="0" cy="-5" rx="24" ry="4.5" fill="#c9862e"/>'
            f'<path d="M18 -6 Q26 -12 30 -8" stroke="#7a3a1c" stroke-width="4" fill="none"/>'
            f'<line x1="22" y1="-8" x2="26" y2="-14" stroke="#2a1a10" stroke-width="2.5"/>'
            f'<g id="{did}f" transform="translate(26 -14) scale(0)">'
            f'<path d="M0 0 C-9 -8 -7 -22 0 -34 C7 -22 9 -8 0 0 Z" fill="url(#flame)"/>'
            f'<path d="M0 -2 C-4 -7 -3 -14 0 -20 C3 -14 4 -7 0 -2 Z" fill="#fffbe6"/></g></g>')


def krishna_full():
    """The original Krishna character from Day 14, full figure, holding a lit diya; the right arm waves."""
    return '''<g id="krishna">
      <g id="kbody">
        <!-- feet and dhoti -->
        <ellipse cx="-22" cy="0" rx="20" ry="9" fill="#4f7fc9"/><ellipse cx="22" cy="0" rx="20" ry="9" fill="#4f7fc9"/>
        <path d="M-52 -150 L52 -150 L60 -6 L-60 -6 Z" fill="#f2c230"/>
        <path d="M-6 -140 L6 -140 L10 -10 L-10 -10 Z" fill="#e3a91f"/>
        <!-- upper body, shawl, garland -->
        <path d="M-50 -232 Q-55 -160 -52 -150 L52 -150 Q55 -160 50 -232 Q0 -246 -50 -232 Z" fill="#4f7fc9"/>
        <path d="M-50 -232 Q0 -150 50 -232" fill="none" stroke="#f7f3ea" stroke-width="10" stroke-linecap="round"/>
        <circle cx="-38" cy="-212" r="6" fill="#e0475b"/><circle cx="0" cy="-176" r="7" fill="#e0475b"/><circle cx="38" cy="-212" r="6" fill="#e0475b"/>
        <path d="M-58 -232 Q-70 -190 -56 -150" fill="none" stroke="#f2c230" stroke-width="12" stroke-linecap="round"/>
        <!-- left arm forward, holding the lamp -->
        <path d="M44 -222 Q86 -196 92 -160" fill="none" stroke="#4f7fc9" stroke-width="20" stroke-linecap="round"/>
      </g>
      <!-- right arm (waves at the end) -->
      <g id="karm"><path d="M-44 -222 Q-70 -190 -66 -150" fill="none" stroke="#4f7fc9" stroke-width="20" stroke-linecap="round"/></g>
      <!-- head -->
      <g id="khead">
        <circle cx="0" cy="-290" r="52" fill="#4f7fc9"/>
        <path d="M-52 -285 Q-48 -342 0 -346 Q48 -342 52 -285 Q40 -318 0 -320 Q-40 -318 -52 -285 Z" fill="#1d1d2b"/>
        <circle cx="-48" cy="-276" r="12" fill="#1d1d2b"/><circle cx="48" cy="-276" r="12" fill="#1d1d2b"/>
        <path d="M-40 -330 L-34 -362 L-17 -348 L0 -374 L17 -348 L34 -362 L40 -330 Z" fill="#e6b53a" stroke="#b9862a" stroke-width="3"/>
        <circle cx="0" cy="-343" r="5" fill="#2b6fd6"/>
        <g transform="rotate(18 30 -362)"><path d="M30 -358 Q19 -400 30 -426 Q41 -400 30 -358 Z" fill="#1f7a4f"/>
          <ellipse cx="30" cy="-413" rx="8" ry="10" fill="#d4a017"/><ellipse cx="30" cy="-411" rx="4.5" ry="6" fill="#1e5aa8"/></g>
        <path d="M-6 -324 Q0 -306 6 -324" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
        <line x1="0" y1="-324" x2="0" y2="-311" stroke="#e0352b" stroke-width="3" stroke-linecap="round"/>
        <path d="M-24 -290 Q-16 -298 -8 -290" fill="none" stroke="#141420" stroke-width="4.5" stroke-linecap="round"/>
        <path id="kreye" d="M8 -290 Q16 -298 24 -290" fill="none" stroke="#141420" stroke-width="4.5" stroke-linecap="round"/>
        <path id="krwink" d="M8 -292 L24 -292" fill="none" stroke="#141420" stroke-width="4.5" stroke-linecap="round" opacity="0"/>
        <circle cx="-28" cy="-272" r="8" fill="#e98aa0" opacity="0.6"/><circle cx="28" cy="-272" r="8" fill="#e98aa0" opacity="0.6"/>
        <path d="M-14 -266 Q0 -252 14 -266" fill="none" stroke="#141420" stroke-width="4.5" stroke-linecap="round"/>
      </g>
      <!-- his lamp -->
      ''' + diya("kd", 96, -152, 0.9).replace('opacity="0"/>', 'opacity="1"/>', 1).replace('scale(0)', 'scale(1)') + '''
    </g>'''


def gopuram():
    """A simple South Indian temple tower in silhouette, with string lights along its tiers (hidden at first)."""
    tiers, lights = [], []
    base_y, width, height = 1135, 400, 88
    for k in range(6):
        y0 = base_y - k * height
        w0, w1 = width - k * 52, width - (k + 1) * 52
        tiers.append(f'<path d="M{540 - w0 / 2:.0f} {y0} L{540 + w0 / 2:.0f} {y0} L{540 + w1 / 2:.0f} {y0 - height} L{540 - w1 / 2:.0f} {y0 - height} Z" '
                     f'fill="#120d22" stroke="#2a1f45" stroke-width="3"/>')
        # a ledge on each tier and small niches, so it reads as a gopuram even before it is lit
        tiers.append(f'<rect x="{540 - w1 / 2 - 10:.0f}" y="{y0 - height - 5}" width="{w1 + 20:.0f}" height="10" rx="3" fill="#2b2148"/>')
        for j in range(5 - k // 2):
            nx = 540 - w0 / 2 + (j + 0.5) * w0 / (5 - k // 2)
            tiers.append(f'<path d="M{nx - 11:.0f} {y0 - 12} L{nx - 11:.0f} {y0 - 44} Q{nx:.0f} {y0 - 60} {nx + 11:.0f} {y0 - 44} L{nx + 11:.0f} {y0 - 12} Z" fill="#1d1638"/>')
        for j in range(9 - k):
            t = (j + 0.5) / (9 - k)
            x = 540 - w1 / 2 + t * w1
            lights.append((x, y0 - height + 4))
    top = base_y - 6 * height
    tiers.append(f'<path d="M{540 - 60} {top} Q540 {top - 70} {540 + 60} {top} Z" fill="#120d22" stroke="#2a1f45" stroke-width="3"/>')
    tiers.append(''.join(f'<circle cx="{540 + dx}" cy="{top - 52 - (10 if dx == 0 else 0)}" r="9" fill="#2a1f45"/>' for dx in (-30, 0, 30)))
    lights_svg = ''.join(f'<circle class="gl" cx="{x:.0f}" cy="{y:.0f}" r="5" fill="#ffd77a"/>' for x, y in lights)
    return ''.join(tiers), f'<g id="glights" opacity="0">{lights_svg}</g>'


def kolam():
    cx, cy = CENTER
    petals = ''.join(f'<ellipse cx="{cx}" cy="{cy - 48}" rx="22" ry="52" fill="none" stroke="#f4efe6" stroke-width="5" '
                     f'transform="rotate({a} {cx} {cy}) scale(1 0.42) translate(0 {cy / 0.42 - cy:.1f})"/>' for a in range(0, 360, 45))
    dots = ''.join(f'<circle cx="{cx + r * math.cos(math.radians(a)):.0f}" cy="{cy + r * 0.42 * math.sin(math.radians(a)):.0f}" r="5" fill="#f4efe6"/>'
                   for r in (210, 370) for a in range(0, 360, 20))
    return (f'<g id="kolam" opacity="0.55"><ellipse cx="{cx}" cy="{cy}" rx="70" ry="30" fill="none" stroke="#f4efe6" stroke-width="5"/>'
            f'<ellipse cx="{cx}" cy="{cy}" rx="500" ry="210" fill="none" stroke="#f4efe6" stroke-width="4" stroke-dasharray="14 12"/>'
            f'{petals}{dots}</g>')


def scene():
    rnd = random.Random(108)
    stars = ''.join(f'<circle class="st" cx="{rnd.randint(0, 1080)}" cy="{rnd.randint(0, 1000)}" r="{rnd.choice([1.2, 1.6, 2.2])}" fill="#fff6e0"/>'
                    for _ in range(90))
    tiers, glights = gopuram()
    diyas, order = [], []
    cx, cy = CENTER
    diyas.append(diya("dc", cx, cy - 6, 1.25))
    for r, (rx, ry, n, sc) in enumerate(RINGS):
        for k in range(n):
            a = -90 + k * 360 / n
            x, y = cx + rx * math.cos(math.radians(a)), cy + ry * math.sin(math.radians(a))
            did = f"d{r}_{k}"
            diyas.append(diya(did, x, y, sc * (0.85 + 0.25 * (y - (cy - ry)) / (2 * ry))))
            order.append((r, k, did))
    svg = f'''<svg viewBox="0 0 1080 1920" width="1080" height="1920" style="position:absolute;left:0;top:0">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05071a"/><stop offset="0.6" stop-color="#141038"/><stop offset="1" stop-color="#3a1d4a"/></linearGradient>
    <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a1a14"/><stop offset="1" stop-color="#0f0907"/></linearGradient>
    <linearGradient id="clay" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c0612b"/><stop offset="1" stop-color="#7a3416"/></linearGradient>
    <linearGradient id="flame" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ff5a1f"/><stop offset="0.5" stop-color="#ffb020"/><stop offset="1" stop-color="#fff2a8"/></linearGradient>
    <radialGradient id="flameglow"><stop offset="0" stop-color="rgba(255,200,90,0.85)"/><stop offset="1" stop-color="rgba(255,160,40,0)"/></radialGradient>
    <radialGradient id="courtglow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="rgba(255,170,60,0.55)"/><stop offset="1" stop-color="rgba(255,140,30,0)"/></radialGradient>
  </defs>
  <rect width="1080" height="1135" fill="url(#sky)"/>
  <g id="stars">{stars}</g>
  <g id="fwlayer"></g>
  <ellipse id="gglow" cx="540" cy="1000" rx="420" ry="420" fill="url(#courtglow)" opacity="0"/>
  <rect x="0" y="1060" width="1080" height="80" fill="#0f0b1c"/>
  {tiers}
  {glights}
  <rect x="0" y="1135" width="1080" height="785" fill="url(#ground)"/>
  <ellipse id="courtglow" cx="{cx}" cy="{cy}" rx="620" ry="330" fill="url(#courtglow)" opacity="0"/>
  {kolam()}
  {''.join(diyas)}
  <g id="kwrap" transform="translate(230 1390) scale(1.15)">{krishna_full()}</g>
  <circle id="spark" cx="0" cy="0" r="9" fill="#fff6c8" opacity="0"/>
</svg>'''
    css = '''    @font-face {
      font-family: "Nunito";
      src: url("assets/fonts/Nunito.ttf");
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
      font-family: "Noto Sans Tamil";
      src: url("assets/fonts/NotoSansTamil.ttf");
    }
    @font-face {
      font-family: "Noto Color Emoji";
      src: url("assets/fonts/NotoColorEmoji.ttf");
    }
    #cam {
      position: absolute;
      left: 0;
      top: 0;
      width: 1080px;
      height: 1920px;
    }
    .p {
      position: absolute;
      width: 7px;
      height: 7px;
      border-radius: 50%;
      opacity: 0;
    }
    .cap {
      position: absolute;
      left: 60px;
      width: 960px;
      top: 170px;
      text-align: center;
      font-family: "Nunito", sans-serif;
      font-weight: 800;
      font-size: 58px;
      line-height: 1.28;
      color: #ffffff;
      text-shadow: 0 4px 14px rgba(0, 0, 0, 0.9);
    }
    .cap b {
      color: #ffcf5a;
    }
    .cap.k {
      font-family: "Cormorant", serif;
      font-style: italic;
      font-weight: 600;
      font-size: 72px;
      color: #ffd77a;
    }
    #title {
      position: absolute;
      left: 0;
      width: 1080px;
      top: 150px;
      text-align: center;
      font-family: "Cinzel", serif;
      font-weight: 700;
      font-size: 104px;
      line-height: 1.05;
      color: #ffd56a;
      text-shadow: 0 0 30px rgba(255, 170, 60, 0.85), 0 6px 18px rgba(0, 0, 0, 0.9);
    }
    #tamil {
      position: absolute;
      left: 0;
      width: 1080px;
      top: 400px;
      text-align: center;
      font-family: "Noto Sans Tamil", sans-serif;
      font-weight: 700;
      font-size: 46px;
      color: #fff1d0;
      text-shadow: 0 3px 12px rgba(0, 0, 0, 0.9);
    }
    #cta {
      position: absolute;
      left: 40px;
      width: 1000px;
      top: 1755px;
      text-align: center;
      font-family: "Nunito", "Noto Color Emoji", sans-serif;
      font-weight: 800;
      font-size: 46px;
      color: #ffffff;
      text-shadow: 0 3px 12px rgba(0, 0, 0, 0.95);
    }
    #cta b {
      color: #ffcf5a;
    }
'''
    html = f'    <div id="cam" class="clip" data-start="0" data-duration="{TOTAL}" data-track-index="0">{svg}\n'
    js = '    tl.set("#cam", { transformOrigin: "540px 1300px", scale: 1.06 }, 0);\n'
    js += f'    tl.to("#cam", {{ scale: 1.0, duration: {TOTAL}, ease: "none" }}, 0);\n'
    # stars twinkle
    js += f'    tl.fromTo("#stars", {{ opacity: 0.6 }}, {{ opacity: 1, duration: 1.8, yoyo: true, repeat: {int(TOTAL / 1.8)}, ease: "sine.inOut" }}, 0);\n'
    # Krishna walks in with his lamp (a gentle bob), the lamp flame flickers
    js += f'    tl.fromTo("#krishna", {{ x: -380 }}, {{ x: 0, duration: 1.8, ease: "power2.out" }}, {T["walk"]});\n'
    js += f'    tl.fromTo("#kbody", {{ y: 0 }}, {{ y: -8, duration: 0.3, yoyo: true, repeat: 5, ease: "sine.inOut" }}, {T["walk"]});\n'
    js += f'    tl.fromTo("#kdf", {{ scaleY: 0.92 }}, {{ scaleY: 1.08, duration: 0.35, yoyo: true, repeat: {int(TOTAL / 0.35)}, ease: "sine.inOut" }}, 0);\n'
    # the spark leaps from his lamp to the centre diya
    kx, ky = 230 + 1.15 * (96 + 26 * 0.9), 1390 + 1.15 * (-152 - 14 * 0.9 - 20)
    tx, ty = cx + 26 * 1.25, cy - 6 - 14 * 1.25 - 20
    js += f'    tl.set("#spark", {{ attr: {{ cx: {kx:.0f}, cy: {ky:.0f} }}, opacity: 0 }}, 0);\n'
    js += f'    tl.to("#spark", {{ opacity: 1, duration: 0.1 }}, {T["spark"]});\n'
    js += (f'    tl.to("#spark", {{ keyframes: [{{ attr: {{ cx: {(kx + tx) / 2:.0f}, cy: {min(ky, ty) - 160:.0f} }}, duration: 0.35, ease: "sine.out" }}, '
           f'{{ attr: {{ cx: {tx:.0f}, cy: {ty:.0f} }}, duration: 0.35, ease: "sine.in" }}] }}, {T["spark"]});\n')
    js += f'    tl.to("#spark", {{ opacity: 0, duration: 0.15 }}, {T["ignite"]});\n'

    def light(did, t, flick):
        out = f'    tl.to("#{did}f", {{ scale: 1, duration: 0.25, ease: "back.out(2)" }}, {t:.2f});\n'
        out += f'    tl.to("#{did}g", {{ opacity: 1, duration: 0.4 }}, {t:.2f});\n'
        out += (f'    tl.to("#{did}f", {{ scaleY: 1.1, scaleX: 0.92, duration: {flick:.2f}, yoyo: true, repeat: {int((TOTAL - t) / flick)}, '
                f'ease: "sine.inOut" }}, {t + 0.25:.2f});\n')
        return out
    js += light("dc", T["ignite"], 0.4)
    js += f'    tl.to("#courtglow", {{ opacity: 0.35, duration: 0.8 }}, {T["ignite"]});\n'
    # ring by ring, around the kolam
    starts = [T["wave"], T["wave"] + 0.6, T["wave"] + 1.3]
    spans = [0.5, 0.65, 0.8]
    for r, k, did in order:
        n = RINGS[r][2]
        js += light(did, starts[r] + spans[r] * k / n, 0.3 + 0.03 * ((k * 7 + r) % 6))
    js += f'    tl.to("#courtglow", {{ opacity: 1, duration: 2.0 }}, {T["wave"]});\n'
    js += f'    tl.to("#kolam", {{ opacity: 0.95, duration: 2.0 }}, {T["wave"]});\n'
    # the gopuram's string lights
    js += f'    tl.to("#glights", {{ opacity: 1, duration: 0.8 }}, {T["gopuram"]});\n'
    js += f'    tl.to("#gglow", {{ opacity: 0.8, duration: 1.2 }}, {T["gopuram"]});\n'
    js += f'    tl.fromTo(".gl", {{ opacity: 0.6 }}, {{ opacity: 1, duration: 0.5, yoyo: true, repeat: 12, stagger: 0.03, ease: "sine.inOut" }}, {T["gopuram"] + 0.8:.2f});\n'
    # fireworks: a rising trail, then a burst of particles that drift down and fade
    html_fw = ""
    for b, (fx, fy, col, dt) in enumerate(FIREWORKS):
        t0 = T["fw"] + dt
        html_fw += (f'    <div id="tr{b}" class="clip p" style="left: {fx - 3}px; top: 1060px; background: {col}; box-shadow: 0 0 10px 3px {col};" '
                    f'data-start="{t0 - 0.45:.2f}" data-duration="0.5" data-track-index="2"></div>\n')
        js += f'    tl.fromTo("#tr{b}", {{ opacity: 1, y: 0 }}, {{ opacity: 0.4, y: {fy - 1060}, duration: 0.45, ease: "power2.out" }}, {t0 - 0.45:.2f});\n'
        for k in range(26):
            a = k * 360 / 26 + rnd.uniform(-5, 5)
            rad = rnd.uniform(150, 230)
            dx, dy = rad * math.cos(math.radians(a)), rad * math.sin(math.radians(a))
            pid = f"p{b}_{k}"
            html_fw += (f'    <div id="{pid}" class="clip p" style="left: {fx - 3}px; top: {fy - 3}px; background: {col}; box-shadow: 0 0 12px 3px {col};" '
                        f'data-start="{t0:.2f}" data-duration="1.8" data-track-index="{3 + b}"></div>\n')
            js += (f'    tl.fromTo("#{pid}", {{ opacity: 1, x: 0, y: 0, scale: 1.2 }}, {{ keyframes: [{{ x: {dx:.0f}, y: {dy:.0f}, duration: 0.7, ease: "power3.out" }}, '
                   f'{{ y: {dy + 70:.0f}, opacity: 0, scale: 0.6, duration: 1.0, ease: "sine.in" }}] }}, {t0:.2f});\n')
    html += '    </div>\n' + html_fw
    # Krishna waves and winks at the end
    js += f'    tl.to("#karm", {{ rotation: -120, svgOrigin: "-44 -222", duration: 0.35, ease: "power2.out" }}, {T["wavehand"]});\n'
    js += f'    tl.to("#karm", {{ rotation: -95, svgOrigin: "-44 -222", duration: 0.3, yoyo: true, repeat: 3, ease: "sine.inOut" }}, {T["wavehand"] + 0.35:.2f});\n'
    js += f'    tl.set("#kreye", {{ opacity: 0 }}, {T["card"] + 0.6:.2f});\n'
    js += f'    tl.set("#krwink", {{ opacity: 1 }}, {T["card"] + 0.6:.2f});\n'
    js += f'    tl.set("#kreye", {{ opacity: 1 }}, {T["card"] + 1.1:.2f});\n'
    js += f'    tl.set("#krwink", {{ opacity: 0 }}, {T["card"] + 1.1:.2f});\n'

    for k, (txt, a, b, style) in enumerate(CAPS):
        html += f'    <div id="c{k}" class="clip cap {style}" data-start="{a:.2f}" data-duration="{b - a:.2f}" data-track-index="{10 + k % 2}">{txt}</div>\n'
        if a > 0:
            js += f'    tl.fromTo("#c{k}", {{ opacity: 0, y: 14 }}, {{ opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }}, {a:.2f});\n'
        js += f'    tl.to("#c{k}", {{ opacity: 0, duration: 0.25 }}, {b - 0.25:.2f});\n'
    html += f'    <div id="title" class="clip" data-start="{T["card"]:.2f}" data-duration="{TOTAL - T["card"]:.2f}" data-track-index="12">Happy<br>Deepavali</div>\n'
    js += f'    tl.fromTo("#title", {{ opacity: 0, scale: 0.85 }}, {{ opacity: 1, scale: 1, duration: 0.7, ease: "power3.out" }}, {T["card"]:.2f});\n'
    html += f'    <div id="tamil" class="clip" data-start="{T["card"] + 0.4:.2f}" data-duration="{TOTAL - T["card"] - 0.4:.2f}" data-track-index="13">இனிய தீபாவளி நல்வாழ்த்துக்கள் 🪔</div>\n'
    js += f'    tl.fromTo("#tamil", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.6 }}, {T["card"] + 0.4:.2f});\n'
    html += f'    <div id="cta" class="clip" data-start="{T["n4"] + 1.2:.2f}" data-duration="{TOTAL - T["n4"] - 1.2:.2f}" data-track-index="14">Send this <b>light</b> to someone you love 🪔<br><span style="font-size: 30px; font-weight: 600; color: #f3dcae">@lordsrikrishnatemple</span></div>\n'
    js += f'    tl.fromTo("#cta", {{ opacity: 0, y: 12 }}, {{ opacity: 1, y: 0, duration: 0.5 }}, {T["n4"] + 1.2:.2f});\n'
    return wrap("scene", css, html, js)


def index():
    audio = ""
    for i, (f, st, vol, tr, o) in enumerate(AUDIO):
        du = min(dur(f), TOTAL - st)
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
      /* Deepavali special (English) · One lamp is all it takes, {TOTAL}s. A new-moon night, a gopuram, a kolam of diyas. */
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
        background: #05071a;
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

      <!-- Free voices (Microsoft Edge neural): narrator en-US-ChristopherNeural, Krishna en-US-AndrewMultilingualNeural (calm style). Effects: CC0 Sonic Pi + synthesized ignite and fireworks. -->
{audio}    </div>
    <script>
      window.__timelines = window.__timelines || {{}};
      window.__timelines["main"] = gsap.timeline({{ paused: true }});
    </script>
  </body>
</html>
'''


cx, cy = CENTER

if __name__ == "__main__":
    open("compositions/scene.html", "w", encoding="utf-8").write(scene())
    open("index.html", "w", encoding="utf-8").write(index())
    print("built", TOTAL, "s", T)
