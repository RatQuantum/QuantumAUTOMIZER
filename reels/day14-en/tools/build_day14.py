"""Day 14 (English): "Krishna's cameo" — a short animated skit with ORIGINAL flat-illustration characters drawn in SVG
(not copied from any show or cartoon). 2 a.m.: a tired young person gets another rejection; Krishna peeks in at the
window, blows a peacock feather onto the desk, says "Rest now… tomorrow, we try again", winks at the camera and
vanishes; morning: they find the feather and smile. Free voices; no bells; calm pacing (rule 7g).

Run from reels/day14-en:  python3 tools/build_day14.py && npm run check && npm run render
"""
import random
import subprocess

W, H = 1080, 1920
TOTAL = 41.0
A, SFX = "assets/audio/", "assets/sfx/"

# timeline (seconds)
T = dict(n1=0.5, buzz=6.0, n2=6.6, headdown=11.6, glow=12.8, kin=13.2, blow=14.4, feather=14.6, k1=17.6,
         lampoff=23.0, wink=23.6, kout=24.4, morning=25.2, n3=27.2, headup=27.4, smile=29.6, n4=33.6, cta=33.4)

LINES = [  # caption, start, end, style
    ("Two A.M.… Everything is falling apart.", 0.5, 6.0, "n"),
    ("Another no. Another closed door.", 6.6, 12.2, "n"),
    ("“Rest now… Tomorrow, we try again.”", 17.6, 23.0, "k"),
    ("He never leaves the room.<br>You just don't always see Him.", 27.2, 33.2, "n"),
]

AUDIO = [
    (A + "n1.wav", T["n1"], 1.0, 1, {}),
    (A + "n2.wav", T["n2"], 1.0, 1, {}),
    (A + "k1.wav", T["k1"], 1.0, 2, {}),
    (A + "n3.wav", T["n3"], 1.0, 1, {}),
    (A + "n4.wav", T["n4"], 1.0, 1, {}),
    (SFX + "vinyl_hiss.wav", 0.0, 0.10, 10, {"fin": 0.5, "fout": 1.0}),
    *[(SFX + "elec_tick.wav", 0.6 + k, 0.3, 30 + k, {}) for k in range(5)],          # the clock at 2 a.m.
    (SFX + "phone_buzz.wav", T["buzz"], 0.5, 11, {}),
    (SFX + "ambi_glass_rub.wav", T["glow"], 0.45, 12, {"fout": 1.0}),
    (SFX + "guit_harmonics.wav", T["kin"] + 0.2, 0.35, 13, {"fout": 1.2}),
    (SFX + "perc_swash.wav", T["blow"], 0.4, 14, {}),
    (SFX + "perc_snap2.wav", T["lampoff"], 0.5, 15, {}),
    (SFX + "tbd_pad_2.wav", T["morning"], 0.3, 16, {"fin": 0.8, "fout": 1.5}),
    (SFX + "ambi_piano.wav", T["smile"], 0.35, 17, {"fout": 1.0}),
    (SFX + "tabla_na.wav", T["cta"] + 0.1, 0.6, 18, {}),
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


def svg_room():
    rnd = random.Random(14)
    stars = "".join(f'<circle cx="{rnd.randint(640, 960)}" cy="{rnd.randint(350, 790)}" r="{rnd.choice([1.5, 2, 2.5])}" fill="#fff6d8"/>'
                    for _ in range(14))
    return f'''<svg id="room" viewBox="0 0 1080 1920" width="1080" height="1920">
  <defs>
    <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2246"/><stop offset="1" stop-color="#2a2f55"/></linearGradient>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1233"/><stop offset="1" stop-color="#1d2a5e"/></linearGradient>
    <linearGradient id="dawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fb2e6"/><stop offset="0.6" stop-color="#f7c58a"/><stop offset="1" stop-color="#ffb37a"/></linearGradient>
    <radialGradient id="lampglow" cx="0.5" cy="0" r="0.9"><stop offset="0" stop-color="rgba(255,214,140,0.55)"/><stop offset="1" stop-color="rgba(255,214,140,0)"/></radialGradient>
    <radialGradient id="divine" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="rgba(255,226,150,0.95)"/><stop offset="1" stop-color="rgba(255,190,90,0)"/></radialGradient>
    <clipPath id="winclip"><rect x="629" y="339" width="342" height="462" rx="6"/></clipPath>
  </defs>
  <rect width="1080" height="1920" fill="url(#wall)"/>
  <!-- shelf with books -->
  <rect x="80" y="560" width="320" height="16" rx="4" fill="#3b2a22"/>
  <rect x="100" y="470" width="34" height="90" rx="4" fill="#8f3b3b"/><rect x="138" y="485" width="28" height="75" rx="4" fill="#3b6b8f"/>
  <rect x="170" y="462" width="38" height="98" rx="4" fill="#c99a3a"/><rect x="212" y="490" width="30" height="70" rx="4" fill="#4f7a4a"/>
  <!-- wall clock showing 2:00 -->
  <circle cx="300" cy="330" r="62" fill="#efe6d2" stroke="#3b2a22" stroke-width="8"/>
  <line x1="300" y1="330" x2="300" y2="285" stroke="#222" stroke-width="6" stroke-linecap="round"/>
  <line x1="300" y1="330" x2="326" y2="315" stroke="#222" stroke-width="8" stroke-linecap="round"/>
  <!-- window: night sky, moon, stars; the dawn sky fades in later -->
  <g clip-path="url(#winclip)">
    <rect x="629" y="339" width="342" height="462" fill="url(#sky)"/>
    <rect id="dawnsky" x="629" y="339" width="342" height="462" fill="url(#dawn)" opacity="0"/>
    <g id="stars">{stars}</g>
    <circle id="moon" cx="880" cy="430" r="46" fill="#fff3c4"/>
    <circle id="winglow" cx="800" cy="600" r="260" fill="url(#divine)" opacity="0"/>
    {svg_krishna()}
  </g>
  <rect x="620" y="330" width="360" height="480" rx="12" fill="none" stroke="#3a4170" stroke-width="18"/>
  <line x1="800" y1="335" x2="800" y2="805" stroke="#3a4170" stroke-width="10"/>
  <line x1="625" y1="560" x2="975" y2="560" stroke="#3a4170" stroke-width="10"/>
  <rect x="600" y="805" width="400" height="26" rx="6" fill="#4b3a5e"/>
  <path d="M560 320 Q600 560 575 850 L610 850 Q640 560 620 320 Z" fill="#6a4078"/>
  <!-- lamp -->
  <polygon id="lampcone" points="150,980 330,980 470,1335 20,1335" fill="url(#lampglow)"/>
  <rect x="170" y="1300" width="90" height="32" rx="10" fill="#2a2a2a"/>
  <line x1="215" y1="1300" x2="250" y2="1060" stroke="#2a2a2a" stroke-width="12" stroke-linecap="round"/>
  <polygon points="160,980 330,980 290,1060 200,1060" fill="#e8b04a" transform="rotate(-8 245 1020)"/>
</svg>'''


def svg_krishna():
    """An original Krishna design: youthful, blue skin, peacock-feather crown, white U-shaped tilak with a red line,
    yellow silk, a flower garland, a flute. Peeks in at the window, arms folded on the sill."""
    return '''<g id="krishna" opacity="0">
      <!-- body / yellow silk -->
      <path d="M700 805 Q705 715 760 700 L840 700 Q895 715 900 805 Z" fill="#f2c230"/>
      <path d="M735 715 Q800 800 865 715" fill="none" stroke="#f7f3ea" stroke-width="12" stroke-linecap="round"/>
      <circle cx="745" cy="728" r="7" fill="#e0475b"/><circle cx="800" cy="760" r="8" fill="#e0475b"/><circle cx="855" cy="728" r="7" fill="#e0475b"/>
      <!-- folded arms on the sill -->
      <rect x="712" y="770" width="176" height="36" rx="18" fill="#4f7fc9"/>
      <!-- flute -->
      <rect x="690" y="760" width="230" height="10" rx="5" fill="#8a5a2b" transform="rotate(-8 805 765)"/>
      <!-- head -->
      <circle cx="800" cy="630" r="62" fill="#4f7fc9"/>
      <path d="M738 625 Q742 560 800 556 Q858 560 862 625 Q850 590 800 588 Q750 590 738 625 Z" fill="#1d1d2b"/>
      <circle cx="742" cy="640" r="14" fill="#1d1d2b"/><circle cx="858" cy="640" r="14" fill="#1d1d2b"/>
      <!-- crown with a peacock feather -->
      <path d="M752 580 L760 545 L780 562 L800 532 L820 562 L840 545 L848 580 Z" fill="#e6b53a" stroke="#b9862a" stroke-width="3"/>
      <circle cx="800" cy="566" r="6" fill="#2b6fd6"/>
      <g transform="rotate(18 835 545)"><path d="M835 548 Q822 500 835 470 Q848 500 835 548 Z" fill="#1f7a4f"/>
        <ellipse cx="835" cy="485" rx="9" ry="12" fill="#d4a017"/><ellipse cx="835" cy="487" rx="5" ry="7" fill="#1e5aa8"/></g>
      <!-- tilak: white U with a red centre line -->
      <path d="M792 588 Q800 612 808 588" fill="none" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round"/>
      <line x1="800" y1="588" x2="800" y2="604" stroke="#e0352b" stroke-width="3.5" stroke-linecap="round"/>
      <!-- eyes: happy arcs; the right one becomes a wink -->
      <path d="M772 628 Q781 619 790 628" fill="none" stroke="#141420" stroke-width="5" stroke-linecap="round"/>
      <path id="keye" d="M810 628 Q819 619 828 628" fill="none" stroke="#141420" stroke-width="5" stroke-linecap="round"/>
      <path id="kwink" d="M810 625 L828 625" fill="none" stroke="#141420" stroke-width="5" stroke-linecap="round" opacity="0"/>
      <circle cx="768" cy="648" r="9" fill="#e98aa0" opacity="0.6"/><circle cx="832" cy="648" r="9" fill="#e98aa0" opacity="0.6"/>
      <path id="kmouth" d="M783 655 Q800 672 817 655" fill="none" stroke="#141420" stroke-width="5" stroke-linecap="round"/>
      <circle cx="738" cy="660" r="6" fill="#e6b53a"/><circle cx="862" cy="660" r="6" fill="#e6b53a"/>
    </g>'''


def svg_person():
    """The viewer: a young person in a red hoodie at a desk, laptop to the left, phone on a stand to the right."""
    return '''<svg id="person" viewBox="0 0 1080 1920" width="1080" height="1920">
  <!-- body / hoodie -->
  <path d="M480 1335 Q470 1175 560 1150 L720 1150 Q810 1175 800 1335 Z" fill="#b8473f"/>
  <path d="M590 1150 Q640 1205 690 1150" fill="none" stroke="#8f332d" stroke-width="10" stroke-linecap="round"/>
  <!-- head group (droops, goes down, comes back up) -->
  <g id="head">
    <path d="M555 1010 Q545 900 640 890 Q735 900 725 1010 Q715 960 640 958 Q565 960 555 1010 Z" fill="#b8473f"/>
    <circle cx="640" cy="1030" r="100" fill="#c98a5e"/>
    <path d="M540 1015 Q545 920 640 918 Q735 920 740 1015 Q720 965 680 960 Q660 985 610 975 Q565 975 540 1015 Z" fill="#231a16"/>
    <g id="eyes-open"><ellipse cx="605" cy="1040" rx="8" ry="10" fill="#1b1410"/><ellipse cx="675" cy="1040" rx="8" ry="10" fill="#1b1410"/></g>
    <g id="eyes-closed" opacity="0"><path d="M595 1042 Q605 1050 615 1042" fill="none" stroke="#1b1410" stroke-width="5" stroke-linecap="round"/>
      <path d="M665 1042 Q675 1050 685 1042" fill="none" stroke="#1b1410" stroke-width="5" stroke-linecap="round"/></g>
    <path d="M590 1018 L620 1024 M660 1024 L690 1018" stroke="#231a16" stroke-width="6" stroke-linecap="round"/>
    <path id="frown" d="M618 1085 Q640 1072 662 1085" fill="none" stroke="#5a2e22" stroke-width="5" stroke-linecap="round"/>
    <path id="smile" d="M615 1076 Q640 1098 665 1076" fill="none" stroke="#5a2e22" stroke-width="5" stroke-linecap="round" opacity="0"/>
  </g>
  <!-- arms on the desk -->
  <rect x="470" y="1285" width="160" height="50" rx="25" fill="#a63e37"/>
  <rect x="650" y="1285" width="160" height="50" rx="25" fill="#a63e37"/>
  <!-- desk -->
  <rect x="0" y="1330" width="1080" height="38" fill="#7a5434"/>
  <rect x="0" y="1368" width="1080" height="560" fill="#4a3220"/>
  <!-- laptop (we see the back of the lid) with a blue glow -->
  <ellipse cx="400" cy="1250" rx="200" ry="120" fill="rgba(110,160,255,0.18)"/>
  <rect x="290" y="1150" width="220" height="180" rx="12" fill="#c3c9d4"/>
  <circle cx="400" cy="1240" r="12" fill="#9aa2b0"/>
  <!-- phone on a stand -->
  <g id="phone">
    <rect x="850" y="1170" width="96" height="164" rx="16" fill="#151515"/>
    <rect x="858" y="1182" width="80" height="136" rx="10" fill="#22305e"/>
    <text x="898" y="1240" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="15" fill="#ff9a9a">Not</text>
    <text x="898" y="1260" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="15" fill="#ff9a9a">selected</text>
    <text x="898" y="1292" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="26" fill="#ff9a9a">✕</text>
  </g>
  <!-- the peacock feather that lands on the desk -->
  <g id="feather" opacity="0">
    <path d="M0 0 Q-16 -55 0 -95 Q16 -55 0 0 Z" fill="#1f7a4f"/>
    <line x1="0" y1="0" x2="0" y2="22" stroke="#d9b25a" stroke-width="3"/>
    <ellipse cx="0" cy="-72" rx="12" ry="15" fill="#d4a017"/><ellipse cx="0" cy="-70" rx="7" ry="9" fill="#1e5aa8"/><ellipse cx="0" cy="-69" rx="3" ry="4" fill="#0b1f4d"/>
  </g>
</svg>'''


def scene():
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
      font-family: "Nunito";
      src: url("assets/fonts/Nunito.ttf");
    }
    @font-face {
      font-family: "Noto Color Emoji";
      src: url("assets/fonts/NotoColorEmoji.ttf");
    }
    svg {
      position: absolute;
      left: 0;
      top: 0;
    }
    #cam, #roomwrap, #personwrap {
      position: absolute;
      left: 0;
      top: 0;
      width: 1080px;
      height: 1920px;
    }
    #night {
      position: absolute;
      inset: 0;
      background: rgba(5, 8, 25, 0.0);
      pointer-events: none;
    }
    #warm {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(255, 190, 120, 0.22), rgba(255, 160, 90, 0.10));
      opacity: 0;
    }
    #hookband {
      position: absolute;
      left: 0;
      top: 0;
      width: 1080px;
      height: 360px;
      background: linear-gradient(180deg, rgba(8, 10, 28, 0.92) 0%, rgba(8, 10, 28, 0.75) 60%, rgba(8, 10, 28, 0) 100%);
    }
    #hook {
      position: absolute;
      left: 50px;
      width: 980px;
      top: 120px;
      text-align: center;
      font-family: "Nunito", sans-serif;
      font-weight: 800;
      font-size: 58px;
      line-height: 1.25;
      color: #ffffff;
      text-shadow: 0 4px 14px rgba(0, 0, 0, 0.8);
    }
    #hook b {
      color: #ffcf5a;
    }
    .cap {
      position: absolute;
      left: 60px;
      width: 960px;
      top: 1520px;
      text-align: center;
      font-family: "Nunito", sans-serif;
      font-weight: 700;
      font-size: 54px;
      line-height: 1.3;
      color: #ffffff;
      text-shadow: 0 3px 10px rgba(0, 0, 0, 0.9);
    }
    .cap.k {
      font-family: "Cormorant", serif;
      font-style: italic;
      font-weight: 600;
      font-size: 66px;
      color: #ffd77a;
    }
    #cta {
      position: absolute;
      left: 60px;
      width: 960px;
      top: 1500px;
      text-align: center;
      font-family: "Nunito", "Noto Color Emoji", sans-serif;
      font-weight: 800;
      font-size: 58px;
      line-height: 1.3;
      color: #ffffff;
      text-shadow: 0 3px 10px rgba(0, 0, 0, 0.9);
    }
    #cta b {
      color: #ffcf5a;
    }
    #handle {
      position: absolute;
      left: 0;
      width: 1080px;
      top: 1790px;
      text-align: center;
      font-family: "Nunito", sans-serif;
      font-size: 30px;
      color: #f3dcae;
    }
'''
    html = f'    <div id="cam" class="clip" data-start="0" data-duration="{TOTAL}" data-track-index="0">\n'
    html += f'      <div id="roomwrap">{svg_room()}</div>\n'
    html += f'      <div id="personwrap">{svg_person()}</div>\n'
    html += '    </div>\n'
    html += f'    <div id="night" class="clip" data-start="0" data-duration="{TOTAL}" data-track-index="2"></div>\n'
    html += f'    <div id="warm" class="clip" data-start="0" data-duration="{TOTAL}" data-track-index="3"></div>\n'
    # a slow camera: close on the person, push into the window for the cameo, follow the feather down, wider while
    # Krishna speaks, a quick push in for the wink, back to the person for the morning
    js = '    tl.set("#cam", { transformOrigin: "620px 1050px", scale: 1.25, x: 0, y: 0 }, 0);\n'
    js += '    tl.to("#cam", { scale: 1.32, duration: 11, ease: "none" }, 0.2);\n'
    js += f'    tl.to("#cam", {{ transformOrigin: "800px 620px", scale: 1.75, duration: 1.4, ease: "power2.inOut" }}, {T["glow"] - 0.2:.2f});\n'
    js += f'    tl.to("#cam", {{ transformOrigin: "700px 980px", scale: 1.25, duration: 2.6, ease: "power1.inOut" }}, {T["feather"] + 0.4:.2f});\n'
    js += f'    tl.to("#cam", {{ transformOrigin: "700px 900px", scale: 1.15, duration: 1.2, ease: "power1.inOut" }}, {T["k1"] - 0.6:.2f});\n'
    js += f'    tl.to("#cam", {{ transformOrigin: "800px 640px", scale: 1.7, duration: 0.7, ease: "power2.inOut" }}, {T["wink"] - 0.75:.2f});\n'
    js += f'    tl.to("#cam", {{ transformOrigin: "620px 1050px", scale: 1.25, duration: 1.6, ease: "power2.inOut" }}, {T["kout"] + 0.6:.2f});\n'
    js += f'    tl.to("#cam", {{ scale: 1.35, duration: {TOTAL - T["kout"] - 2.4:.2f}, ease: "none" }}, {T["kout"] + 2.3:.2f});\n'
    # --- 2 a.m.: slow sad sway, lamp breathing
    js += '    tl.set("#head", { svgOrigin: "640 1130", rotation: 0, y: 0 }, 0);\n'
    js += '    tl.to("#head", { rotation: -4, duration: 2.8, yoyo: true, repeat: 1, ease: "sine.inOut" }, 0.3);\n'
    js += '    tl.fromTo("#lampcone", { opacity: 0.85 }, { opacity: 1, duration: 1.6, yoyo: true, repeat: 6, ease: "sine.inOut" }, 0);\n'
    # --- the phone buzzes
    js += f'    tl.fromTo("#phone", {{ x: -6 }}, {{ x: 6, duration: 0.06, yoyo: true, repeat: 11, ease: "none" }}, {T["buzz"]});\n'
    js += f'    tl.set("#phone", {{ x: 0 }}, {T["buzz"] + 0.75});\n'
    # --- head goes down on the desk, eyes close
    js += f'    tl.to("#head", {{ rotation: 8, y: 190, duration: 1.0, ease: "power2.inOut" }}, {T["headdown"]});\n'
    js += f'    tl.set("#eyes-open", {{ opacity: 0 }}, {T["headdown"] + 0.5});\n'
    js += f'    tl.set("#eyes-closed", {{ opacity: 1 }}, {T["headdown"] + 0.5});\n'
    # --- the window glows; Krishna peeks in, smiling
    js += f'    tl.to("#winglow", {{ opacity: 1, duration: 1.0, ease: "power1.out" }}, {T["glow"]});\n'
    js += f'    tl.fromTo("#krishna", {{ opacity: 0, y: 120 }}, {{ opacity: 1, y: 0, duration: 1.0, ease: "power2.out" }}, {T["kin"]});\n'
    js += f'    tl.to("#krishna", {{ y: -6, duration: 1.4, yoyo: true, repeat: 5, ease: "sine.inOut" }}, {T["kin"] + 1.0:.2f});\n'
    # he blows: the mouth becomes small for a moment
    js += f'    tl.to("#kmouth", {{ scaleX: 0.4, svgOrigin: "800 662", duration: 0.25 }}, {T["blow"]});\n'
    js += f'    tl.to("#kmouth", {{ scaleX: 1, svgOrigin: "800 662", duration: 0.3 }}, {T["blow"] + 0.9:.2f});\n'
    # --- the feather drifts from the window down to the desk beside the head
    js += f'    tl.set("#feather", {{ x: 800, y: 760, rotation: -40, opacity: 0 }}, 0);\n'
    js += f'    tl.to("#feather", {{ opacity: 1, duration: 0.3 }}, {T["feather"]});\n'
    js += (f'    tl.to("#feather", {{ keyframes: [{{ x: 700, y: 900, rotation: 20, duration: 0.9 }}, {{ x: 820, y: 1060, rotation: -25, duration: 0.9 }}, '
           f'{{ x: 760, y: 1225, rotation: 70, duration: 0.8 }}], ease: "sine.inOut" }}, {T["feather"]});\n')
    # --- the lamp goes out; Krishna winks at the camera and fades
    js += f'    tl.to("#lampcone", {{ opacity: 0, duration: 0.2 }}, {T["lampoff"]});\n'
    js += f'    tl.to("#night", {{ backgroundColor: "rgba(5, 8, 25, 0.35)", duration: 0.3 }}, {T["lampoff"]});\n'
    js += f'    tl.set("#keye", {{ opacity: 0 }}, {T["wink"]});\n'
    js += f'    tl.set("#kwink", {{ opacity: 1 }}, {T["wink"]});\n'
    js += f'    tl.set("#keye", {{ opacity: 1 }}, {T["wink"] + 0.5:.2f});\n'
    js += f'    tl.set("#kwink", {{ opacity: 0 }}, {T["wink"] + 0.5:.2f});\n'
    js += f'    tl.to("#krishna", {{ opacity: 0, y: -20, duration: 0.8, ease: "power1.in" }}, {T["kout"]});\n'
    js += f'    tl.to("#winglow", {{ opacity: 0, duration: 0.8 }}, {T["kout"]});\n'
    # --- morning
    js += f'    tl.to("#dawnsky", {{ opacity: 1, duration: 1.8, ease: "sine.inOut" }}, {T["morning"]});\n'
    js += f'    tl.to(["#moon", "#stars"], {{ opacity: 0, duration: 1.4 }}, {T["morning"]});\n'
    js += f'    tl.to("#night", {{ backgroundColor: "rgba(5, 8, 25, 0)", duration: 1.8 }}, {T["morning"]});\n'
    js += f'    tl.to("#warm", {{ opacity: 1, duration: 1.8 }}, {T["morning"]});\n'
    # --- they lift their head, open their eyes, see the feather, smile; the feather glows
    js += f'    tl.to("#head", {{ rotation: 0, y: 0, duration: 1.0, ease: "power2.inOut" }}, {T["headup"]});\n'
    js += f'    tl.set("#eyes-closed", {{ opacity: 0 }}, {T["headup"] + 0.6:.2f});\n'
    js += f'    tl.set("#eyes-open", {{ opacity: 1 }}, {T["headup"] + 0.6:.2f});\n'
    js += f'    tl.to("#head", {{ rotation: 6, duration: 0.8, ease: "sine.inOut" }}, {T["headup"] + 1.3:.2f});\n'
    js += f'    tl.to("#frown", {{ opacity: 0, duration: 0.4 }}, {T["smile"]});\n'
    js += f'    tl.to("#smile", {{ opacity: 1, duration: 0.4 }}, {T["smile"]});\n'
    js += f'    tl.to("#feather", {{ filter: "drop-shadow(0 0 14px rgba(255,214,120,0.95))", duration: 0.8, yoyo: true, repeat: 3 }}, {T["smile"]});\n'

    # captions and texts
    html += f'    <div id="hookband" class="clip" data-start="0" data-duration="{T["buzz"] - 0.3:.2f}" data-track-index="4"></div>\n'
    js += f'    tl.to("#hookband", {{ opacity: 0, duration: 0.4 }}, {T["buzz"] - 0.7:.2f});\n'
    html += (f'    <div id="hook" class="clip" data-start="0" data-duration="{T["buzz"] - 0.3:.2f}" data-track-index="4">'
             f'POV: it\'s <b>2 A.M.</b><br>and you\'re about to give up</div>\n')
    js += f'    tl.to("#hook", {{ opacity: 0, duration: 0.4 }}, {T["buzz"] - 0.7:.2f});\n'
    for k, (txt, a, b, style) in enumerate(LINES):
        html += f'    <div id="c{k}" class="clip cap {style}" data-start="{a:.2f}" data-duration="{b - a:.2f}" data-track-index="{5 + k % 2}">{txt}</div>\n'
        js += f'    tl.fromTo("#c{k}", {{ opacity: 0, y: 16 }}, {{ opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }}, {a:.2f});\n'
        js += f'    tl.to("#c{k}", {{ opacity: 0, duration: 0.3 }}, {b - 0.3:.2f});\n'
    html += (f'    <div id="cta" class="clip" data-start="{T["cta"]:.2f}" data-duration="{TOTAL - T["cta"]:.2f}" data-track-index="7">'
             f'Send this to someone<br>who needs a <b>sign</b> today 🦚</div>\n')
    js += f'    tl.fromTo("#cta", {{ opacity: 0, y: 16 }}, {{ opacity: 1, y: 0, duration: 0.5 }}, {T["cta"]:.2f});\n'
    html += f'    <div id="handle" class="clip" data-start="{T["cta"] + 0.4:.2f}" data-duration="{TOTAL - T["cta"] - 0.4:.2f}" data-track-index="8">@lordsrikrishnatemple</div>\n'
    js += f'    tl.fromTo("#handle", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.5 }}, {T["cta"] + 0.4:.2f});\n'
    return wrap("scene", css, html, js)


def dur(f):
    return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f],
                                capture_output=True, text=True, check=True).stdout)


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
      /* Day 14 (English) · Krishna's cameo: an animated skit with original SVG characters, {TOTAL}s. */
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
        background: #1c2246;
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

      <!-- Free voices (Microsoft Edge neural): narrator en-US-ChristopherNeural, Krishna en-US-AndrewMultilingualNeural (calm style). Effects: CC0 Sonic Pi + a synthesized phone buzz. -->
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
