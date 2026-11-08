"""Day 17 (English): "One line, never lifted" · format F (live line drawing, new), built with /krishna-reel.

A sikku kolam, the Tamil dawn floor drawing: one unbroken line loops around every one of 49 dots and is never lifted.
It is drawn live in glowing rice-flour white on a dark wet earthen floor (a GLSL shader) lit by four flickering clay
diyas; as the line closes, dawn breaks, the line turns gold and a light runs once around it. Then Krishna's promise,
Bhagavad Gita 9.22 ("yoga-ksemam vahamy aham": I carry what they lack and protect what they have), and the tie: not one
dot is left out. Neither are you. The kolam is generated (tools/kolam.py): a mirror curve with 4-fold symmetry, kept
only when the whole design is ONE closed line.
Paced to the voices (rule 7h); no beat effects; effects each once and a different set from Day 16 (rule 7f).

Run from reels/day17-en:  python3 tools/build_day17.py && npm run check && npm run render
"""
import json
import random
import subprocess

import kolam

W, H = 1080, 1920
A, SFX = "assets/audio/", "assets/sfx/"
N, SEED, PROB = 7, 3, 0.2
CX, CY, SP = 540, 860, 124          # kolam centre and dot spacing


def dur(f):
    return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f],
                                capture_output=True, text=True, check=True).stdout)


D = {k: dur(A + k + ".wav") for k in ("n1", "n2", "k1", "n3", "n4")}
T = {"n1": 0.3, "draw": 0.5}
T["n2"] = round(T["n1"] + D["n1"] + 0.35, 2)
T["close"] = round(T["n2"] + D["n2"] - 0.4, 2)        # the line closes as the narrator finishes
T["k1"] = round(T["close"] + 0.8, 2)
T["n3"] = round(T["k1"] + D["k1"] + 0.45, 2)
T["n4"] = round(T["n3"] + D["n3"] + 0.4, 2)
TOTAL = round(T["n4"] + D["n4"] + 1.4, 2)
DRAW = T["close"] - T["draw"]

AUDIO = [  # file, start, volume, track, options
    (A + "n1.wav", T["n1"], 1.0, 1, {}),
    (A + "n2.wav", T["n2"], 1.0, 1, {}),
    (A + "k1.wav", T["k1"], 1.0, 2, {}),
    (A + "n3.wav", T["n3"], 1.0, 1, {}),
    (A + "n4.wav", T["n4"], 1.0, 1, {}),
    (SFX + "ambi_drone.wav", 0.0, 0.16, 10, {"fin": 1.0, "fout": 2.0}),
    (SFX + "flour_draw.wav", T["draw"], 0.12, 11, {"fout": 0.6}),
    (SFX + "tabla_tun1.wav", T["close"], 0.45, 12, {}),
    (SFX + "ambi_choir.wav", T["close"] + 0.1, 0.16, 13, {"fin": 0.4, "fout": 2.0}),
    (SFX + "guit_em9.wav", T["k1"] - 0.2, 0.18, 14, {"fout": 2.0}),
    (SFX + "perc_impact2.wav", T["n3"], 0.22, 15, {}),
    (SFX + "tabla_na_s.wav", T["n4"], 0.4, 16, {}),
]

GOLD, CREAM = "#ffd36a", "#fff3dc"
DIYAS = [(110, 330), (970, 330), (110, 1385), (970, 1385)]

FRAG = r"""
precision highp float;
uniform vec2 uRes;
uniform float uT, uDawn, uGlow;
uniform vec2 uL0, uL1, uL2, uL3;
uniform vec4 uF;
float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5; mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = m * p; a *= 0.5; }
  return v;
}
float lamp(vec2 uv, vec2 L, float f) {
  float d = length((uv - L) * vec2(1.0, 1.25));
  return f * (0.55 * exp(-d * 9.0) + 0.35 * exp(-d * 3.2));
}
void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  // the floor: dark wet earth, swept smooth, with cow-dung-wash mottling and fine grit
  float n = fbm(uv * 3.0 + 7.0);
  float m = fbm(uv * 9.0 - 3.0);
  float grit = noise(uv * 400.0);
  vec3 earth = mix(vec3(0.055, 0.03, 0.02), vec3(0.16, 0.085, 0.045), n);
  earth = mix(earth, vec3(0.10, 0.07, 0.04), m * 0.5);
  earth *= 0.85 + 0.25 * grit;
  // light: four diyas (warm, flickering) + the kolam glow + dawn from the top
  float li = lamp(uv, uL0, uF.x) + lamp(uv, uL1, uF.y) + lamp(uv, uL2, uF.z) + lamp(uv, uL3, uF.w);
  vec3 col = earth * (0.35 + 2.2 * li * vec3(1.0, 0.72, 0.42));
  // wet sheen: the floor was washed before the kolam, so the lamps glint in it
  float sheen = pow(max(0.0, fbm(uv * 5.0 + 1.3) - 0.45), 2.0) * 6.0;
  col += vec3(1.0, 0.75, 0.45) * sheen * li * 0.9;
  float g = exp(-length(uv - vec2(0.0, 0.052)) * 3.0) * uGlow;
  col += vec3(1.0, 0.8, 0.45) * g * 0.35;
  float dawn = smoothstep(-0.2, 0.55, uv.y) * uDawn;
  col = mix(col, col + vec3(0.42, 0.24, 0.20) * (0.4 + n), dawn * 0.55);
  col *= 1.0 + uDawn * 0.25;
  col *= 1.0 - 0.5 * smoothstep(0.4, 1.05, length(uv * vec2(1.3, 0.85)));
  col += (hash(gl_FragCoord.xy + uT) - 0.5) * 0.02;
  gl_FragColor = vec4(max(col, 0.0), 1.0);
}
"""


def floor_js():
    lights = [[(x - 540) / 1920, (960 - y) / 1920] for x, y in DIYAS]
    return f'''
    (function () {{
      const L = {json.dumps(lights)};
      const CLOSE = {T["close"]};
      const cv = document.getElementById("floor");
      const gl = cv.getContext("webgl", {{ preserveDrawingBuffer: true, antialias: false }});
      const vs = "attribute vec2 p; void main() {{ gl_Position = vec4(p, 0.0, 1.0); }}";
      const fs = {json.dumps(FRAG)};
      function sh(type, src) {{ const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; }}
      const pr = gl.createProgram();
      gl.attachShader(pr, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, fs));
      gl.linkProgram(pr); gl.useProgram(pr);
      const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(pr, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      const U = {{}}; ["uRes", "uT", "uDawn", "uGlow", "uL0", "uL1", "uL2", "uL3", "uF"].forEach((n) => (U[n] = gl.getUniformLocation(pr, n)));
      const sm = (a, b, x) => {{ const k = Math.min(Math.max((x - a) / (b - a), 0), 1); return k * k * (3 - 2 * k); }};
      const flick = (t, i) => 1 + 0.10 * Math.sin(7.3 * t + i * 1.7) + 0.06 * Math.sin(13.1 * t + i * 2.9) + 0.04 * Math.sin(23.7 * t + i);
      function renderAt(t) {{
        gl.viewport(0, 0, cv.width, cv.height);
        gl.uniform2f(U.uRes, cv.width, cv.height); gl.uniform1f(U.uT, t);
        gl.uniform1f(U.uDawn, sm(CLOSE - 2.5, CLOSE + 3.0, t)); gl.uniform1f(U.uGlow, sm(CLOSE - 0.2, CLOSE + 1.5, t));
        gl.uniform2fv(U.uL0, L[0]); gl.uniform2fv(U.uL1, L[1]); gl.uniform2fv(U.uL2, L[2]); gl.uniform2fv(U.uL3, L[3]);
        gl.uniform4f(U.uF, flick(t, 0), flick(t, 1), flick(t, 2), flick(t, 3));
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }}
      window.addEventListener("hf-seek", (e) => renderAt(e.detail.time));
      renderAt(0);
    }})();
'''


def diya_svg(k):
    return f'''<svg viewBox="0 0 120 140" width="120" height="140" style="position:absolute;left:0;top:0;overflow:visible">
  <defs>
    <radialGradient id="fl{k}" cx="0.5" cy="0.7" r="0.6"><stop offset="0" stop-color="#fffbe8"/><stop offset="0.35" stop-color="#ffd36a"/><stop offset="0.75" stop-color="#ff8a1e"/><stop offset="1" stop-color="rgba(255,90,0,0)"/></radialGradient>
    <radialGradient id="ha{k}"><stop offset="0" stop-color="rgba(255,200,90,0.55)"/><stop offset="1" stop-color="rgba(255,140,30,0)"/></radialGradient>
    <linearGradient id="cl{k}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c4602a"/><stop offset="0.6" stop-color="#8a3a14"/><stop offset="1" stop-color="#4a1c08"/></linearGradient>
  </defs>
  <circle id="halo{k}" cx="60" cy="62" r="62" fill="url(#ha{k})"/>
  <path d="M10 92 Q60 140 110 92 Q60 104 10 92Z" fill="url(#cl{k})"/>
  <path d="M10 92 Q60 104 110 92" stroke="#e08a4a" stroke-width="3" fill="none"/>
  <path d="M100 92 Q114 86 116 78" stroke="#c4602a" stroke-width="6" fill="none" stroke-linecap="round"/>
  <ellipse cx="60" cy="94" rx="40" ry="5" fill="#2a1206" opacity="0.6"/>
  <path d="M100 82 l2 10" stroke="#3a2a1a" stroke-width="3"/>
  <g id="flame{k}"><path d="M101 82 Q88 62 101 28 Q114 62 101 82Z" fill="url(#fl{k})"/>
  <path d="M101 80 Q95 68 101 50 Q107 68 101 80Z" fill="#fffbe8" opacity="0.9"/></g>
</svg>'''


def scene():
    rnd = random.Random(17)
    mirrors, curve = kolam.search(N, SEED, p=PROB, tries=120)
    P = [(CX + (x / 2 - N / 2) * SP, CY + (y / 2 - N / 2) * SP) for x, y in curve]
    d, segs = kolam.catmull_path(P, 0.8)
    fine, L = kolam.sample_cubic(segs)
    LEN = L[-1]
    # evenly spaced points along the line for the glowing tip of the "hand"
    K = 200
    tip, j = [], 0
    for s in range(K + 1):
        target = LEN * s / K
        while j < len(L) - 1 and L[j + 1] < target:
            j += 1
        tip.append(fine[j])
    dots = [(CX + (i + 0.5 - N / 2) * SP, CY + (k + 0.5 - N / 2) * SP) for i in range(N) for k in range(N)]
    dots.sort(key=lambda p: (p[0] - CX) ** 2 + (p[1] - CY) ** 2)

    css = f'''    @font-face {{
      font-family: "Cormorant";
      font-style: italic;
      src: url("assets/fonts/Cormorant-Italic.ttf");
    }}
    @font-face {{
      font-family: "Cinzel";
      src: url("assets/fonts/Cinzel.ttf");
    }}
    @font-face {{
      font-family: "Nunito";
      src: url("assets/fonts/Nunito.ttf");
    }}
    @font-face {{
      font-family: "Noto Color Emoji";
      src: url("assets/fonts/NotoColorEmoji.ttf");
    }}
    #floorw {{
      position: absolute;
      inset: 0;
      background: #0e0704;
    }}
    #floor {{
      position: absolute;
      left: 0;
      top: 0;
      width: 1080px;
      height: 1920px;
    }}
    #kolam {{
      position: absolute;
      inset: 0;
    }}
    .diya {{
      position: absolute;
      width: 120px;
      height: 140px;
    }}
    .cap {{
      position: absolute;
      left: 60px;
      font-weight: 400;
      width: 960px;
      text-align: center;
      font-family: "Cormorant", serif;
      font-style: italic;
      color: {CREAM};
      text-shadow: 0 3px 12px rgba(0, 0, 0, 0.95), 0 0 30px rgba(0, 0, 0, 0.7);
    }}
    #hook {{
      top: 120px;
      font-size: 82px;
      line-height: 1.1;
    }}
    #hook b {{
      color: {GOLD};
      font-weight: 400;
    }}
    #c2 {{
      top: 1440px;
      font-size: 60px;
      line-height: 1.18;
    }}
    #verse {{
      top: 1420px;
      font-size: 66px;
      line-height: 1.2;
      color: #fff6e6;
      text-shadow: 0 3px 10px rgba(30, 10, 0, 1), 0 0 34px rgba(40, 12, 0, 0.9);
    }}
    #ref {{
      top: 1690px;
      font-family: "Cinzel", serif;
      font-style: normal;
      font-size: 34px;
      letter-spacing: 5px;
      color: #f6d9a8;
    }}
    #c3 {{
      top: 1450px;
      font-size: 74px;
      line-height: 1.15;
    }}
    #c3 b {{
      color: {GOLD};
      font-weight: 400;
    }}
    #cta {{
      position: absolute;
      left: 40px;
      width: 1000px;
      top: 1480px;
      text-align: center;
      font-family: "Nunito", "Noto Color Emoji", sans-serif;
      font-weight: 800;
      font-size: 66px;
      line-height: 1.25;
      color: #ffffff;
      text-shadow: 0 4px 16px rgba(0, 0, 0, 0.95);
    }}
    #cta b {{
      color: {GOLD};
    }}
'''
    html = (f'    <div id="floorw" class="clip" data-start="0" data-duration="{TOTAL}" data-track-index="0">'
            f'<canvas id="floor" width="540" height="960"></canvas></div>\n')
    js = ""
    # the kolam: dots, a soft glow line, the rice-flour line, the hand's glowing tip, and the closing light
    svg = [f'<svg viewBox="0 0 1080 1920" width="1080" height="1920" style="position:absolute;left:0;top:0">',
           '<defs><filter id="blur" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="9"/></filter>'
           '<filter id="blur2" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>'
           '<radialGradient id="dotg"><stop offset="0" stop-color="#fff"/><stop offset="0.5" stop-color="#ffe7b0"/><stop offset="1" stop-color="rgba(255,210,120,0)"/></radialGradient></defs>']
    for i, (x, y) in enumerate(dots):
        svg.append(f'<circle id="dg{i}" cx="{x:.1f}" cy="{y:.1f}" r="26" fill="url(#dotg)" opacity="0"/>'
                   f'<circle id="dt{i}" cx="{x:.1f}" cy="{y:.1f}" r="7.5" fill="#fff8ec"/>')
    svg.append(f'<path id="glowline" d="{d}" fill="none" stroke="#ffcf7a" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" '
               f'opacity="0.35" filter="url(#blur)" stroke-dasharray="{LEN:.1f} {LEN:.1f}" stroke-dashoffset="{LEN:.1f}"/>')
    svg.append(f'<path id="line" d="{d}" fill="none" stroke="#fff6e6" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" '
               f'stroke-dasharray="{LEN:.1f} {LEN:.1f}" stroke-dashoffset="{LEN:.1f}"/>')
    svg.append(f'<path id="comet" d="{d}" fill="none" stroke="#ffffff" stroke-width="14" stroke-linecap="round" opacity="0" '
               f'filter="url(#blur2)" stroke-dasharray="420 {LEN:.1f}" stroke-dashoffset="0"/>')
    svg.append(f'<g id="tip" opacity="0"><circle cx="0" cy="0" r="22" fill="#ffd27a" opacity="0.5" filter="url(#blur2)"/><circle cx="0" cy="0" r="8" fill="#fff"/></g>')
    svg.append('</svg>')
    html += f'    <div id="kolam" class="clip" data-start="0" data-duration="{TOTAL}" data-track-index="1">{"".join(svg)}</div>\n'
    # the drawing: constant pen speed (ease none), the tip riding the same line
    js += f'    tl.fromTo(["#line", "#glowline"], {{ strokeDashoffset: {LEN:.1f} }}, {{ strokeDashoffset: 0, duration: {DRAW:.2f}, ease: "none" }}, {T["draw"]:.2f});\n'
    js += f'    tl.set("#tip", {{ x: {tip[0][0]:.1f}, y: {tip[0][1]:.1f}, opacity: 1 }}, {T["draw"]:.2f});\n'
    js += (f'    tl.to("#tip", {{ keyframes: {json.dumps([{"x": round(x, 1), "y": round(y, 1)} for x, y in tip[1:]])}, '
           f'duration: {DRAW:.2f}, ease: "none" }}, {T["draw"]:.2f});\n')
    js += f'    tl.to("#tip", {{ opacity: 0, scale: 2.5, duration: 0.5, ease: "power1.out" }}, {T["close"]:.2f});\n'
    # the close: the line turns gold, a light runs once around it, dawn rises (in the shader)
    js += f'    tl.to("#line", {{ stroke: "{GOLD}", duration: 1.4, ease: "sine.inOut" }}, {T["close"]:.2f});\n'
    js += f'    tl.to("#glowline", {{ opacity: 0.6, duration: 1.4, ease: "sine.inOut" }}, {T["close"]:.2f});\n'
    js += f'    tl.fromTo("#comet", {{ strokeDashoffset: 0, opacity: 0.95 }}, {{ strokeDashoffset: {-LEN:.1f}, duration: 2.6, ease: "power1.inOut", immediateRender: false }}, {T["close"] + 0.1:.2f});\n'
    js += f'    tl.to("#comet", {{ opacity: 0, duration: 0.4 }}, {T["close"] + 2.4:.2f});\n'
    # "not one dot is left out": every dot lights up, from the centre outwards
    for i in range(len(dots)):
        js += f'    tl.fromTo("#dg{i}", {{ opacity: 0 }}, {{ opacity: 0.9, duration: 0.5, ease: "sine.out" }}, {T["n3"] + 0.03 * i:.2f});\n'
    # diyas with a slow, irregular flame flicker (seeded; never on a beat)
    for k, (x, y) in enumerate(DIYAS):
        mirror = ' style="transform: scaleX(-1);"' if x > 540 else ""
        html += (f'    <div id="dy{k}" class="clip diya" data-start="0" data-duration="{TOTAL}" data-track-index="2" '
                 f'style="left: {x - 60}px; top: {y - 80}px;"><div style="transform: scale(1.5){' scaleX(-1)' if x > 540 else ''};">{diya_svg(k)}</div></div>\n')
        t, keys = 0.0, []
        while t < TOTAL:
            dt = rnd.uniform(0.18, 0.42)
            keys.append({"scaleY": round(rnd.uniform(0.88, 1.12), 3), "scaleX": round(rnd.uniform(0.94, 1.05), 3),
                         "skewX": round(rnd.uniform(-4, 4), 2), "duration": round(dt, 3)})
            t += dt
        js += f'    tl.set("#flame{k}", {{ svgOrigin: "101 82" }}, 0);\n'
        js += f'    tl.to("#flame{k}", {{ keyframes: {json.dumps(keys)}, ease: "sine.inOut" }}, 0);\n'
    # words
    html += (f'    <div id="hook" class="clip cap" data-start="0" data-duration="{T["n2"]:.2f}" data-track-index="3">'
             f'Watch this line.<br><b>It never lifts.</b></div>\n')
    js += f'    tl.to("#hook", {{ opacity: 0, y: -20, duration: 0.35, ease: "power1.in" }}, {T["n2"] - 0.35:.2f});\n'
    html += (f'    <div id="c2" class="clip cap" data-start="{T["n2"]:.2f}" data-duration="{T["k1"] - T["n2"]:.2f}" data-track-index="4">'
             f'Every dawn, in Tamil homes,<br>one line circles every dot…<br>and lets none go.</div>\n')
    js += f'    tl.fromTo("#c2", {{ opacity: 0, y: 20 }}, {{ opacity: 1, y: 0, duration: 0.5, ease: "spring-settle" }}, {T["n2"]:.2f});\n'
    js += f'    tl.to("#c2", {{ opacity: 0, duration: 0.3, ease: "power1.in" }}, {T["k1"] - 0.35:.2f});\n'
    words = ["Those who think of Me…", "I carry what they lack…", "and protect what they have."]
    share = [0.0, 0.33, 0.67]
    html += (f'    <div id="verse" class="clip cap" data-start="{T["k1"]:.2f}" data-duration="{T["n3"] - T["k1"]:.2f}" data-track-index="5">'
             + "<br>".join(f'<span id="v{i}" style="display: inline-block;">{w}</span>' for i, w in enumerate(words)) + '</div>\n')
    for i, s in enumerate(share):
        js += f'    tl.fromTo("#v{i}", {{ opacity: 0, y: 16 }}, {{ opacity: 1, y: 0, duration: 0.6, ease: "spring-land" }}, {T["k1"] + s * D["k1"]:.2f});\n'
    js += f'    tl.to("#verse", {{ opacity: 0, duration: 0.35, ease: "power1.in" }}, {T["n3"] - 0.4:.2f});\n'
    html += (f'    <div id="ref" class="clip cap" data-start="{T["k1"]:.2f}" data-duration="{T["n3"] - T["k1"]:.2f}" data-track-index="6">'
             f'BHAGAVAD GITA 9.22</div>\n')
    js += f'    tl.fromTo("#ref", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.6, ease: "sine.out" }}, {T["k1"] + 0.4:.2f});\n'
    js += f'    tl.to("#ref", {{ opacity: 0, duration: 0.35 }}, {T["n3"] - 0.4:.2f});\n'
    html += (f'    <div id="c3" class="clip cap" data-start="{T["n3"]:.2f}" data-duration="{T["n4"] - T["n3"]:.2f}" data-track-index="7">'
             f'Not one dot is left out.<br><b>Neither are you.</b></div>\n')
    js += f'    tl.fromTo("#c3", {{ opacity: 0, y: 20 }}, {{ opacity: 1, y: 0, duration: 0.55, ease: "spring-land" }}, {T["n3"]:.2f});\n'
    js += f'    tl.to("#c3", {{ opacity: 0, duration: 0.3, ease: "power1.in" }}, {T["n4"] - 0.35:.2f});\n'
    html += (f'    <div id="cta" class="clip" data-start="{T["n4"]:.2f}" data-duration="{TOTAL - T["n4"]:.2f}" data-track-index="8">'
             f'<b>Save this</b> for a hard day 🪔<br><span style="font-size: 40px; font-weight: 700; color: #f3dcae">@lordsrikrishnatemple</span></div>\n')
    js += f'    tl.fromTo("#cta", {{ opacity: 0, y: 30 }}, {{ opacity: 1, y: 0, duration: 0.6, ease: "spring-settle" }}, {T["n4"]:.2f});\n'
    out = wrap("scene", css, html, js)
    return out.replace("  </script>\n</template>", f"  </script>\n  <script>{floor_js()}  </script>\n</template>"), LEN


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


def index():
    audio = ""
    for i, (f, st, vol, tr, o) in enumerate(AUDIO):
        du = min(dur(f), TOTAL - st)
        extra = f' data-fade-in="{o["fin"]}"' if "fin" in o else ""
        extra += f' data-fade-out="{o["fout"]}"' if "fout" in o else ""
        audio += f'      <audio id="a{i}" class="clip" src="{f}" data-start="{st:.3f}" data-duration="{du:.3f}" data-volume="{vol}" data-track-index="{tr}"{extra}></audio>\n'
    return f'''<!doctype html>
<html lang="en" data-resolution="portrait">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width={W}, height={H}" />
    <script src="assets/gsap.min.js"></script>
    <script src="assets/springs.js"></script>
    <style>
      /* Day 17 (English) · One line, never lifted. A sikku kolam drawn live, Gita 9.22, {TOTAL}s. */
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
        background: #0e0704;
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

      <!-- Free voices (edge-tts narrator_en, krishna_divine_en); effects: CC0 Sonic Pi + one synthesized. -->
{audio}    </div>
    <script>
      window.__timelines = window.__timelines || {{}};
      window.__timelines["main"] = gsap.timeline({{ paused: true }});
    </script>
  </body>
</html>
'''


if __name__ == "__main__":
    sc, LEN = scene()
    open("compositions/scene.html", "w", encoding="utf-8").write(sc)
    open("index.html", "w", encoding="utf-8").write(index())
    print("built", TOTAL, "s; line", round(LEN), "px;", T)
