"""Day 16 (English) v2: "Your birth month, His name" · format G (quiz), the rich-visual remake.

The user, 8 Nov: "Make day 16. Make it the most detailed, rich in visual."
Layers, back to front:
  1. a live GLSL shader sky (seek-driven WebGL, drawn from time alone): a domain-warped nebula, god rays from a moving
     light, twinkling stars, a warp-speed tunnel when the camera dives through the wheel; a colour season per page
     (winter rose-indigo, summer amber, monsoon teal, festive violet-gold) and royal ruby for the final grid
  2. bokeh gold dust at three depths
  3. an ornate Tanjore wheel of the months (filigree rings, beads, gem facets, a counter-turning inner sun, an
     iridescent peacock-feather eye) that the camera flies through
  4. gold-leaf cards: damask panel, beaded inner frame, faceted corner gems, a gold medallion with an original icon for
     each name (flute, lotus, feather, cowbell, lamp, butter pot, rain cloud, sun, hill, discus, crown, conch) and a
     single light sweep as each card lands (never on a beat)
  5. all twelve on one screen with their icons; the ask.
Paced to the voice and reading time (rules 7g, 7h); no beat effects (7e); each sound effect once (7f).

Run from reels/day16-en:  python3 tools/build_day16.py && npm run check && npm run render
"""
import json
import math
import random
import subprocess

W, H = 1080, 1920
A, SFX = "assets/audio/", "assets/sfx/"

MONTHS = [  # month, name, meaning, icon (traditional names of Krishna and their common meanings)
    ("JANUARY", "Govinda", "the one who gives joy to all", "flute"),
    ("FEBRUARY", "Madhava", "sweet as honey", "lotus"),
    ("MARCH", "Keshava", "the one with beautiful hair", "feather"),
    ("APRIL", "Gopala", "protector of the cows", "cowbell"),
    ("MAY", "Mukunda", "the giver of liberation", "lamp"),
    ("JUNE", "Damodara", "bound by a mother's love", "pot"),
    ("JULY", "Shyam", "the dark, beautiful one", "cloud"),
    ("AUGUST", "Vasudeva", "He who dwells in all", "sun"),
    ("SEPTEMBER", "Achyuta", "the one who never falls", "hill"),
    ("OCTOBER", "Hari", "He who takes away sorrow", "chakra"),
    ("NOVEMBER", "Mohana", "the one who enchants all", "crown"),
    ("DECEMBER", "Janardana", "protector of the people", "conch"),
]


def dur(f):
    return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f],
                                capture_output=True, text=True, check=True).stdout)


D = {k: dur(A + k + ".wav") for k in ("n1", "n2", "n3")}
PAGE = 4.3                     # three cards: about 1 s + 0.3 s per word each to find and read your month (rule 7g)
STAGGER = 0.45                 # the cards land one after another, never all at once
T = {"n1": 0.3}
T["push"] = round(T["n1"] + D["n1"] + 0.3, 2)           # the camera dives through the wheel
PAGES = [round(T["push"] + 0.5 + k * PAGE, 2) for k in range(4)]
T["grid"] = round(PAGES[-1] + PAGE, 2)
T["n2"] = round(T["grid"] + 0.5, 2)
T["n3"] = round(T["n2"] + D["n2"] + 0.3, 2)
T["cta"] = round(T["n3"] - 0.1, 2)
TOTAL = round(T["n3"] + D["n3"] + 1.1, 2)

AUDIO = [  # file, start, volume, track, options (quiet: the user's track carries the reel)
    (A + "n1.wav", T["n1"], 1.0, 1, {}),
    (A + "n2.wav", T["n2"], 1.0, 1, {}),
    (A + "n3.wav", T["n3"], 1.0, 1, {}),
    (SFX + "tbd_pad_2.wav", 0.0, 0.22, 10, {"fin": 0.6, "fout": 1.5}),
    (SFX + "ambi_glass_hum.wav", 0.4, 0.16, 11, {"fout": 1.5}),
    (SFX + "perc_swoosh.wav", T["push"] - 0.1, 0.5, 12, {}),
    (SFX + "tabla_na_o.wav", PAGES[0], 0.5, 13, {}),
    (SFX + "tabla_te1.wav", PAGES[1], 0.5, 14, {}),
    (SFX + "tabla_dhec.wav", PAGES[2], 0.5, 15, {}),
    (SFX + "guit_harmonics.wav", PAGES[3], 0.35, 16, {"fout": 0.8}),
    (SFX + "ambi_swoosh.wav", T["grid"] - 0.2, 0.4, 17, {}),
    (SFX + "ambi_piano.wav", T["grid"] + 0.1, 0.25, 18, {"fout": 2.0}),
    (SFX + "elec_chime.wav", T["cta"] + 0.3, 0.25, 19, {}),
]

GOLD, GOLD_HI, GOLD_LO, RUBY, EMERALD, CREAM, INK = "#efc15a", "#ffe9a8", "#9a6b12", "#c0142f", "#0f8a63", "#fff1d6", "#3a0610"

# the sky: one palette per section (dark base, mid nebula, highlight/light colour), light position in shader space
# (x right, y up, 0 = centre, 0.5 = top edge), ray strength, swirl
SKY = [  # time, palette, light, rays, swirl
    (0.0, ("#12030a", "#5a0f2a", "#ffbf5a"), (0.0, -0.06), 1.0, 0.6),
    (PAGES[0] - 0.2, ("#070a24", "#40307a", "#ffc7a0"), (-0.15, 0.55), 0.8, 0.3),      # Jan-Mar: winter dawn
    (PAGES[1] - 0.2, ("#1a0703", "#8a2a0c", "#ffb340"), (0.18, 0.55), 0.9, 0.3),       # Apr-Jun: summer sun
    (PAGES[2] - 0.2, ("#02121a", "#0d5a5e", "#bff5e6"), (-0.12, 0.6), 0.7, 0.5),       # Jul-Sep: monsoon
    (PAGES[3] - 0.2, ("#0f0420", "#5a1a6e", "#ffd36a"), (0.1, 0.55), 0.9, 0.4),        # Oct-Dec: festival of lamps
    (T["grid"] - 0.2, ("#160308", "#6a0f24", "#ffcf6a"), (0.0, 0.62), 0.8, 0.3),       # all twelve: royal ruby
]

FRAG = r"""
precision highp float;
uniform vec2 uRes;
uniform float uT;
uniform vec3 uA, uB, uC;
uniform vec2 uLight;
uniform float uRays, uWarp, uSwirl;
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
void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  vec2 p = uv - uLight;
  float r = length(p);
  float ang = atan(p.y, p.x);
  // the dive: everything rushes out of the light
  vec2 z = uLight + p / (1.0 + uWarp * 2.2);
  vec2 q = z * 1.7 + vec2(0.0, uT * 0.035);
  vec2 w = vec2(fbm(q + vec2(0.0, uT * 0.05)), fbm(q + vec2(5.2, 1.3) - uT * 0.04));
  float n = fbm(q + 1.9 * w + uSwirl * vec2(sin(ang * 2.0 + uT * 0.12), cos(r * 3.0 - uT * 0.1)));
  vec3 col = mix(uA, uB, smoothstep(0.25, 0.85, n));
  col = mix(col, uC, pow(smoothstep(0.5, 0.95, n * (0.6 + w.x)), 2.0) * 0.75);
  col *= 0.35 + 1.0 * n * n;
  // god rays from the light
  float rays = pow(noise(vec2(ang * 5.0, uT * 0.12)) * 0.6 + noise(vec2(ang * 15.0, -uT * 0.09)) * 0.4, 3.0);
  col += uC * rays * exp(-r * 1.5) * uRays * 1.5;
  col += uC * exp(-r * r * 12.0) * 0.5 * uRays;
  // warp streaks
  float st = pow(noise(vec2(ang * 38.0, 3.0)), 5.0) * smoothstep(0.04, 0.7, r);
  col += mix(uC, vec3(1.0), 0.4) * st * uWarp * 2.2;
  // stars, twinkling slowly (never on a beat)
  vec2 sg = uv * 220.0; vec2 id = floor(sg); float h = hash(id);
  float d = length(fract(sg) - 0.5);
  float star = step(0.985, h) * smoothstep(0.32, 0.0, d) * (0.55 + 0.45 * sin(uT * 1.3 + h * 90.0));
  col += vec3(1.0, 0.95, 0.85) * star * 0.9 * (1.0 - uWarp);
  // vignette and a little grain
  col *= 1.0 - 0.6 * smoothstep(0.35, 1.05, length(uv * vec2(1.25, 0.85)));
  col += (hash(gl_FragCoord.xy + uT) - 0.5) * 0.025;
  gl_FragColor = vec4(max(col, 0.0), 1.0);
}
"""


def hexrgb(h):
    return [int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)]


def sky_js():
    keys = [{"t": t, "a": hexrgb(p[0]), "b": hexrgb(p[1]), "c": hexrgb(p[2]), "l": list(l), "r": r, "s": s} for t, p, l, r, s in SKY]
    return f'''
    (function () {{
      const KEYS = {json.dumps(keys)};
      const PUSH = {T["push"]}, BLEND = 0.9;
      const cv = document.getElementById("sky");
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
      const U = {{}}; ["uRes", "uT", "uA", "uB", "uC", "uLight", "uRays", "uWarp", "uSwirl"].forEach((n) => (U[n] = gl.getUniformLocation(pr, n)));
      const sm = (x) => x * x * (3 - 2 * x);
      const mix = (a, b, k) => a.map((v, i) => v + (b[i] - v) * k);
      function state(t) {{
        let i = 0; while (i < KEYS.length - 1 && t >= KEYS[i + 1].t) i++;
        const a = KEYS[i], b = KEYS[Math.min(i + 1, KEYS.length - 1)];
        let k = 0; if (i > 0) k = 0; // a key holds until the next key's time
        const prev = KEYS[Math.max(i - 1, 0)];
        let m = Math.min(Math.max((t - a.t) / BLEND, 0), 1); m = sm(m);
        const from = i > 0 ? prev : a;
        return {{ a: mix(from.a, a.a, m), b: mix(from.b, a.b, m), c: mix(from.c, a.c, m), l: mix(from.l, a.l, m),
                  r: from.r + (a.r - from.r) * m, s: from.s + (a.s - from.s) * m }};
      }}
      function renderAt(t) {{
        const s = state(t);
        const warp = Math.exp(-Math.pow((t - PUSH - 0.4) / 0.32, 2));
        gl.viewport(0, 0, cv.width, cv.height);
        gl.uniform2f(U.uRes, cv.width, cv.height); gl.uniform1f(U.uT, t);
        gl.uniform3fv(U.uA, s.a); gl.uniform3fv(U.uB, s.b); gl.uniform3fv(U.uC, s.c);
        gl.uniform2fv(U.uLight, s.l); gl.uniform1f(U.uRays, s.r); gl.uniform1f(U.uWarp, warp); gl.uniform1f(U.uSwirl, s.s);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }}
      window.addEventListener("hf-seek", (e) => renderAt(e.detail.time));
      renderAt(0);
    }})();
'''


def icon(kind, ink=INK, acc=RUBY, size=100):
    """Original line-and-fill icons, 100x100, drawn in deep ruby ink on gold."""
    s = f'stroke="{ink}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"'
    g = ""
    if kind == "flute":
        holes = "".join(f'<circle cx="{30 + 9 * k}" cy="50" r="2.6" fill="{GOLD_HI}"/>' for k in range(5))
        g = (f'<g transform="rotate(-32 50 50)"><rect x="8" y="44" width="84" height="12" rx="6" fill="{ink}"/>{holes}'
             f'<rect x="20" y="43" width="4" height="14" fill="{acc}"/><rect x="76" y="43" width="4" height="14" fill="{acc}"/></g>'
             f'<path d="M22 70 q-2 10 3 18 M22 70 q4 9 0 18" {s} fill="none"/><circle cx="22" cy="68" r="4" fill="{acc}"/>')
    elif kind == "lotus":
        pet = "".join(f'<ellipse cx="50" cy="52" rx="10" ry="26" transform="rotate({a} 50 78)" fill="{acc if a % 60 == 0 else ink}" {s}/>'
                      for a in (-64, -32, 0, 32, 64))
        g = pet + f'<path d="M20 80 Q50 92 80 80" {s} fill="none"/><circle cx="50" cy="66" r="4" fill="{GOLD_HI}"/>'
    elif kind == "feather":
        barbs = "".join(f'<path d="M50 {30 + 6 * k} q{-14 - k} 6 {-20 - k} 4 M50 {30 + 6 * k} q{14 + k} 6 {20 + k} 4" {s} stroke-width="2" fill="none"/>' for k in range(8))
        g = (barbs + f'<ellipse cx="50" cy="32" rx="15" ry="19" fill="{EMERALD}" {s}/><ellipse cx="50" cy="34" rx="9" ry="12" fill="#1e5aa8"/>'
             f'<ellipse cx="50" cy="36" rx="4" ry="6" fill="{ink}"/><path d="M50 50 L50 94" {s}/>')
    elif kind == "cowbell":
        g = (f'<path d="M36 18 q14 -10 28 0" {s} fill="none"/><path d="M34 30 h32 l8 44 h-48z" fill="{ink}" {s}/>'
             f'<rect x="30" y="26" width="40" height="7" rx="3" fill="{acc}"/><circle cx="50" cy="80" r="6" fill="{acc}" {s}/>'
             f'<path d="M42 40 l-3 26" stroke="{GOLD_HI}" stroke-width="3" stroke-linecap="round"/>')
    elif kind == "lamp":
        g = (f'<path d="M50 14 Q64 36 50 52 Q36 36 50 14Z" fill="{acc}" {s}/><path d="M50 28 Q56 40 50 48 Q44 40 50 28Z" fill="{GOLD_HI}"/>'
             f'<path d="M14 58 Q50 96 86 58 Z" fill="{ink}" {s}/><path d="M24 64 Q50 84 76 64" stroke="{GOLD_HI}" stroke-width="2.5" fill="none"/>')
    elif kind == "pot":
        g = (f'<circle cx="50" cy="62" r="25" fill="{ink}" {s}/><rect x="38" y="26" width="24" height="14" rx="3" fill="{ink}" {s}/>'
             f'<ellipse cx="50" cy="26" rx="15" ry="5" fill="{acc}" {s}/><path d="M28 50 L72 74 M72 50 L28 74" stroke="{GOLD_HI}" stroke-width="3"/>'
             f'<path d="M40 22 q10 -12 22 -2" stroke="#fff6e0" stroke-width="5" stroke-linecap="round" fill="none"/>')
    elif kind == "cloud":
        drops = "".join(f'<path d="M{30 + 14 * k} {72 + 6 * (k % 2)} l-3 9" {s} stroke-width="3"/>' for k in range(4))
        g = (f'<path d="M24 62 a14 14 0 0 1 6 -27 a18 18 0 0 1 34 -4 a14 14 0 0 1 12 31 z" fill="{ink}" {s}/>'
             f'<path d="M58 40 l-8 12 h8 l-6 12" stroke="{GOLD_HI}" stroke-width="3" fill="none" stroke-linecap="round"/>' + drops)
    elif kind == "sun":
        rays = "".join(f'<path d="M{50 + 24 * math.cos(math.radians(a)):.1f} {50 + 24 * math.sin(math.radians(a)):.1f} L{50 + 40 * math.cos(math.radians(a)):.1f} {50 + 40 * math.sin(math.radians(a)):.1f}" {s}/>' for a in range(0, 360, 30))
        g = rays + f'<circle cx="50" cy="50" r="17" fill="{acc}" {s}/><circle cx="50" cy="50" r="7" fill="{GOLD_HI}"/>'
    elif kind == "hill":
        g = (f'<path d="M8 84 L38 36 L52 54 L64 40 L92 84Z" fill="{ink}" {s}/><path d="M38 36 L44 46 L34 50" stroke="{GOLD_HI}" stroke-width="3" fill="none"/>'
             f'<path d="M20 30 Q50 6 80 30" stroke="{acc}" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="50" cy="16" r="4" fill="{acc}"/>')
    elif kind == "chakra":
        spokes = "".join(f'<path d="M50 50 L{50 + 24 * math.cos(math.radians(a)):.1f} {50 + 24 * math.sin(math.radians(a)):.1f}" {s} stroke-width="2.5"/>' for a in range(0, 360, 30))
        teeth = "".join(f'<path d="M{50 + 30 * math.cos(math.radians(a - 8)):.1f} {50 + 30 * math.sin(math.radians(a - 8)):.1f} L{50 + 42 * math.cos(math.radians(a)):.1f} {50 + 42 * math.sin(math.radians(a)):.1f} L{50 + 30 * math.cos(math.radians(a + 8)):.1f} {50 + 30 * math.sin(math.radians(a + 8)):.1f}Z" fill="{acc}"/>' for a in range(0, 360, 30))
        g = teeth + f'<circle cx="50" cy="50" r="30" fill="none" {s}/>' + spokes + f'<circle cx="50" cy="50" r="8" fill="{ink}"/>'
    elif kind == "crown":
        g = (f'<path d="M18 80 L14 40 L32 56 L50 30 L68 56 L86 40 L82 80Z" fill="{ink}" {s}/><rect x="18" y="76" width="64" height="10" rx="3" fill="{acc}"/>'
             f'<circle cx="50" cy="62" r="6" fill="{acc}"/><circle cx="32" cy="66" r="4" fill="{EMERALD}"/><circle cx="68" cy="66" r="4" fill="{EMERALD}"/>'
             f'<path d="M50 30 Q60 14 56 4" stroke="{EMERALD}" stroke-width="4" fill="none" stroke-linecap="round"/><ellipse cx="57" cy="8" rx="5" ry="6" fill="#1e5aa8"/>')
    elif kind == "conch":
        g = (f'<path d="M30 78 Q12 50 34 28 Q52 12 70 26 Q86 40 76 60 Q66 80 44 84 Z" fill="{ink}" {s}/>'
             f'<path d="M58 36 Q48 36 48 46 Q48 56 58 56 Q66 56 66 48 Q66 42 60 42 Q55 42 55 47" stroke="{GOLD_HI}" stroke-width="3" fill="none" stroke-linecap="round"/>'
             f'<path d="M30 78 L22 90 L40 84" fill="{acc}" {s}/>')
    return f'<svg viewBox="0 0 100 100" width="{size}" height="{size}">{g}</svg>'


def wheel_svg():
    """An ornate golden wheel of the twelve months (original design): filigree rings, beads, faceted gems,
    gilded petals with veins, a sun ring, and an iridescent peacock-feather eye at the hub. Centre (540, 1080)."""
    cx, cy = 540, 1080
    parts = []
    for k in range(72):  # bead ring
        a = math.radians(k * 5)
        parts.append(f'<circle cx="{cx + 610 * math.cos(a):.1f}" cy="{cy + 610 * math.sin(a):.1f}" r="{6 if k % 6 == 0 else 3.5}" fill="{GOLD_HI if k % 6 == 0 else GOLD}"/>')
    for k in range(24):  # filigree scallops between the rings
        a1, a2 = math.radians(k * 15), math.radians(k * 15 + 15)
        x1, y1 = cx + 560 * math.cos(a1), cy + 560 * math.sin(a1)
        x2, y2 = cx + 560 * math.cos(a2), cy + 560 * math.sin(a2)
        am = math.radians(k * 15 + 7.5)
        xm, ym = cx + 592 * math.cos(am), cy + 592 * math.sin(am)
        parts.append(f'<path d="M{x1:.0f} {y1:.0f} Q{xm:.0f} {ym:.0f} {x2:.0f} {y2:.0f}" stroke="{GOLD}" stroke-width="3" fill="none"/>')
    for k, m in enumerate(MONTHS):
        a = math.radians(k * 30 - 90)
        a1, a2 = math.radians(k * 30 - 90 - 13), math.radians(k * 30 - 90 + 13)
        r0, r1 = 235, 475
        x0, y0 = cx + r0 * math.cos(a), cy + r0 * math.sin(a)
        xt, yt = cx + (r1 + 45) * math.cos(a), cy + (r1 + 45) * math.sin(a)
        xa, ya = cx + r1 * math.cos(a1), cy + r1 * math.sin(a1)
        xb, yb = cx + r1 * math.cos(a2), cy + r1 * math.sin(a2)
        parts.append(f'<path d="M{x0:.0f} {y0:.0f} Q{xa:.0f} {ya:.0f} {xt:.0f} {yt:.0f} Q{xb:.0f} {yb:.0f} {x0:.0f} {y0:.0f}Z" '
                     f'fill="url(#petal)" stroke="url(#goldEdge)" stroke-width="5"/>')
        for v in (-1, 0, 1):  # veins
            av = math.radians(k * 30 - 90 + v * 5)
            parts.append(f'<path d="M{cx + 260 * math.cos(a):.0f} {cy + 260 * math.sin(a):.0f} Q{cx + 330 * math.cos(av):.0f} {cy + 330 * math.sin(av):.0f} '
                         f'{cx + (300 + 15 * (v == 0)) * math.cos(av):.0f} {cy + (300 + 15 * (v == 0)) * math.sin(av):.0f}" stroke="{GOLD}" stroke-width="2" opacity="0.55" fill="none"/>')
        xl, yl = cx + 395 * math.cos(a), cy + 395 * math.sin(a)
        parts.append(f'<text x="{xl:.0f}" y="{yl + 12:.0f}" text-anchor="middle" font-family="Cinzel" font-size="34" '
                     f'font-weight="700" fill="{CREAM}" transform="rotate({k * 30} {xl:.0f} {yl:.0f})">{m[0][:3]}</text>')
        xg, yg = cx + 535 * math.cos(a + math.radians(15)), cy + 535 * math.sin(a + math.radians(15))
        parts.append(f'<circle cx="{xg:.0f}" cy="{yg:.0f}" r="17" fill="{GOLD}"/>'
                     f'<circle cx="{xg:.0f}" cy="{yg:.0f}" r="12" fill="url(#{"ruby" if k % 2 else "emer"})"/>'
                     f'<circle cx="{xg - 4:.0f}" cy="{yg - 4:.0f}" r="3.5" fill="#fff" opacity="0.85"/>')
    sun = "".join(f'<path d="M{cx + 222 * math.cos(math.radians(a)):.1f} {cy + 222 * math.sin(math.radians(a)):.1f} '
                  f'L{cx + 200 * math.cos(math.radians(a - 4)):.1f} {cy + 200 * math.sin(math.radians(a - 4)):.1f} '
                  f'L{cx + 200 * math.cos(math.radians(a + 4)):.1f} {cy + 200 * math.sin(math.radians(a + 4)):.1f}Z" fill="{GOLD}"/>' for a in range(0, 360, 10))
    return f'''<svg viewBox="0 0 1080 1920" width="1080" height="1920" style="position:absolute;left:0;top:0;overflow:visible">
  <defs>
    <radialGradient id="petal" cx="0.5" cy="0.6" r="0.75"><stop offset="0" stop-color="#7a1428"/><stop offset="0.7" stop-color="#3e0815"/><stop offset="1" stop-color="#22040c"/></radialGradient>
    <linearGradient id="goldEdge" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{GOLD_HI}"/><stop offset="0.5" stop-color="{GOLD}"/><stop offset="1" stop-color="{GOLD_LO}"/></linearGradient>
    <radialGradient id="ruby" cx="0.35" cy="0.3"><stop offset="0" stop-color="#ff8a9a"/><stop offset="0.35" stop-color="{RUBY}"/><stop offset="1" stop-color="#4a0010"/></radialGradient>
    <radialGradient id="emer" cx="0.35" cy="0.3"><stop offset="0" stop-color="#8affd2"/><stop offset="0.35" stop-color="{EMERALD}"/><stop offset="1" stop-color="#003a26"/></radialGradient>
    <radialGradient id="eye"><stop offset="0" stop-color="#06143a"/><stop offset="0.5" stop-color="#1e5aa8"/><stop offset="0.66" stop-color="#2fb3c8"/><stop offset="0.78" stop-color="#16805a"/><stop offset="0.9" stop-color="#e3b02a"/><stop offset="1" stop-color="#6a4a0c"/></radialGradient>
    <radialGradient id="hub" cx="0.5" cy="0.45"><stop offset="0" stop-color="#3a0a16"/><stop offset="1" stop-color="#12030a"/></radialGradient>
  </defs>
  <circle cx="{cx}" cy="{cy}" r="568" fill="rgba(20,3,9,0.55)" stroke="url(#goldEdge)" stroke-width="8"/>
  <circle cx="{cx}" cy="{cy}" r="540" fill="none" stroke="{GOLD}" stroke-width="2" stroke-dasharray="2 10"/>
  {''.join(parts)}
  <g id="sunring">{sun}</g>
  <circle cx="{cx}" cy="{cy}" r="200" fill="url(#hub)" stroke="url(#goldEdge)" stroke-width="8"/>
  <circle cx="{cx}" cy="{cy}" r="184" fill="none" stroke="{GOLD}" stroke-width="2" stroke-dasharray="3 7"/>
  <ellipse cx="{cx}" cy="{cy}" rx="118" ry="148" fill="#1f6b4f" stroke="{GOLD}" stroke-width="3"/>
  <ellipse cx="{cx}" cy="{cy + 12}" rx="94" ry="118" fill="url(#eye)"/>
  <ellipse cx="{cx}" cy="{cy + 32}" rx="38" ry="52" fill="#06143a"/>
  <ellipse cx="{cx + 10}" cy="{cy + 14}" rx="12" ry="16" fill="#fff" opacity="0.5"/>
</svg>'''


DAMASK = ("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'>"
          "<g fill='none' stroke='%23efc15a' stroke-width='1.4' opacity='0.16'>"
          "<path d='M40 10 Q50 25 40 40 Q30 25 40 10Z'/><path d='M40 40 Q55 45 70 40 Q55 35 40 40Z'/>"
          "<path d='M40 40 Q25 45 10 40 Q25 35 40 40Z'/><path d='M40 40 Q50 55 40 70 Q30 55 40 70Z'/>"
          "<circle cx='40' cy='40' r='4'/><circle cx='0' cy='0' r='3'/><circle cx='80' cy='0' r='3'/><circle cx='0' cy='80' r='3'/><circle cx='80' cy='80' r='3'/></g></svg>")


def card(i, m, name, meaning, ic, y):
    return (f'    <div id="c{i}" class="card" style="top: {y}px;"><div class="inner"><div id="sh{i}" class="sheen"></div></div>'
            f'<div class="beads"></div>'
            f'<div class="gem g1"></div><div class="gem g2"></div><div class="gem g3"></div><div class="gem g4"></div>'
            f'<div class="medal">{icon(ic, size=124)}</div>'
            f'<div class="txt"><div class="mo">{m}</div><div class="nm">{name}</div><div class="mn">{meaning}</div></div></div>\n')


def scene():
    rnd = random.Random(16)
    css = f'''    @font-face {{
      font-family: "Cinzel";
      src: url("assets/fonts/Cinzel.ttf");
    }}
    @font-face {{
      font-family: "Cormorant";
      font-style: italic;
      src: url("assets/fonts/Cormorant-Italic.ttf");
    }}
    @font-face {{
      font-family: "Nunito";
      src: url("assets/fonts/Nunito.ttf");
    }}
    @font-face {{
      font-family: "Noto Color Emoji";
      src: url("assets/fonts/NotoColorEmoji.ttf");
    }}
    #skyw {{
      position: absolute;
      inset: 0;
      background: #12030a;
    }}
    #sky {{
      position: absolute;
      left: 0;
      top: 0;
      width: 1080px;
      height: 1920px;
    }}
    .dust {{
      position: absolute;
      border-radius: 50%;
      background: #ffe2a0;
    }}
    #wheel {{
      position: absolute;
      inset: 0;
    }}
    .hook {{
      position: absolute;
      left: 50px;
      width: 980px;
      text-align: center;
      font-family: "Cinzel", serif;
      font-weight: 700;
      color: {CREAM};
      text-shadow: 0 4px 14px rgba(0, 0, 0, 0.95), 0 0 30px rgba(0, 0, 0, 0.6);
    }}
    #h1 {{
      top: 110px;
      font-size: 62px;
      line-height: 1.2;
    }}
    #h1 b {{
      color: {GOLD};
      text-shadow: 0 4px 14px rgba(0, 0, 0, 0.95), 0 0 26px rgba(255, 190, 80, 0.55);
    }}
    #head {{
      top: 210px;
      font-size: 44px;
      letter-spacing: 8px;
      color: {GOLD};
    }}
    .card {{
      position: absolute;
      left: 60px;
      width: 960px;
      height: 340px;
      border-radius: 28px;
      border: 7px solid {GOLD};
      background: #2a0610;
      box-shadow: 0 0 0 3px {GOLD_LO}, 0 22px 50px rgba(0, 0, 0, 0.75), 0 0 60px rgba(255, 190, 90, 0.18);
    }}
    .inner {{
      position: absolute;
      inset: 0;
      border-radius: 21px;
      overflow: hidden;
      background-color: #3a0815;
      background-image: url("{DAMASK}"), radial-gradient(ellipse at 30% 20%, #6a1226 0%, #3a0815 55%, #22040c 100%);
    }}
    .sheen {{
      position: absolute;
      top: -120px;
      left: 0;
      width: 240px;
      height: 600px;
      background: linear-gradient(90deg, rgba(255, 233, 168, 0) 0%, rgba(255, 233, 168, 0.3) 50%, rgba(255, 233, 168, 0) 100%);
      opacity: 0;
    }}
    .beads {{
      position: absolute;
      inset: 12px;
      border-radius: 18px;
      border: 3px dotted {GOLD};
      opacity: 0.8;
    }}
    .gem {{
      position: absolute;
      width: 34px;
      height: 34px;
      border-radius: 50%;
      border: 5px solid {GOLD};
      background: radial-gradient(circle at 35% 30%, #ffffff 0 9%, #ff8a9a 16%, {RUBY} 42%, #4a0010 100%);
      box-shadow: 0 3px 8px rgba(0, 0, 0, 0.6);
    }}
    .g1 {{
      left: -21px;
      top: -21px;
    }}
    .g2 {{
      right: -21px;
      top: -21px;
      background: radial-gradient(circle at 35% 30%, #ffffff 0 9%, #8affd2 16%, {EMERALD} 42%, #003a26 100%);
    }}
    .g3 {{
      left: -21px;
      bottom: -21px;
      background: radial-gradient(circle at 35% 30%, #ffffff 0 9%, #8affd2 16%, {EMERALD} 42%, #003a26 100%);
    }}
    .g4 {{
      right: -21px;
      bottom: -21px;
    }}
    .medal {{
      position: absolute;
      left: 40px;
      top: 70px;
      width: 186px;
      height: 186px;
      border-radius: 50%;
      background: radial-gradient(circle at 38% 30%, {GOLD_HI} 0%, {GOLD} 45%, {GOLD_LO} 100%);
      box-shadow: inset 0 -6px 12px rgba(80, 40, 0, 0.55), inset 0 6px 10px rgba(255, 250, 220, 0.6), 0 0 0 5px #2a0610, 0 0 0 9px {GOLD};
      display: flex;
      align-items: center;
      justify-content: center;
    }}
    .txt {{
      position: absolute;
      left: 262px;
      top: 0;
      width: 670px;
      height: 340px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }}
    .mo {{
      font-family: "Cinzel", serif;
      font-weight: 700;
      font-size: 32px;
      letter-spacing: 7px;
      color: #f6d9a8;
    }}
    .nm {{
      font-family: "Cinzel", serif;
      font-weight: 700;
      font-size: 84px;
      color: {GOLD};
      line-height: 1.05;
      text-shadow: 0 3px 0 #5a2a00, 0 0 22px rgba(255, 200, 90, 0.35);
    }}
    .mn {{
      font-family: "Cormorant", serif;
      font-style: italic;
      font-size: 54px;
      color: {CREAM};
      line-height: 1.1;
      margin-top: 4px;
    }}
    #grid {{
      position: absolute;
      inset: 0;
    }}
    .tile {{
      position: absolute;
      width: 316px;
      height: 270px;
      border-radius: 20px;
      border: 5px solid {GOLD};
      box-shadow: 0 0 0 2px {GOLD_LO}, 0 12px 30px rgba(0, 0, 0, 0.7);
      background-color: #3a0815;
      background-image: url("{DAMASK}"), radial-gradient(ellipse at 30% 20%, #6a1226 0%, #3a0815 60%, #22040c 100%);
      text-align: center;
    }}
    .ti {{
      margin: 18px auto 0;
      width: 86px;
      height: 86px;
      border-radius: 50%;
      background: radial-gradient(circle at 38% 30%, {GOLD_HI} 0%, {GOLD} 45%, {GOLD_LO} 100%);
      display: flex;
      align-items: center;
      justify-content: center;
    }}
    .tm {{
      margin-top: 12px;
      font-family: "Cinzel", serif;
      font-weight: 700;
      font-size: 30px;
      color: #f6d9a8;
      letter-spacing: 4px;
    }}
    .tn {{
      margin-top: 6px;
      font-family: "Cinzel", serif;
      font-weight: 700;
      font-size: 40px;
      color: {GOLD};
      text-shadow: 0 2px 0 #5a2a00;
    }}
    #cta {{
      position: absolute;
      left: 40px;
      width: 1000px;
      top: 1560px;
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
    html = (f'    <div id="skyw" class="clip" data-start="0" data-duration="{TOTAL}" data-track-index="0">'
            f'<canvas id="sky" width="540" height="960"></canvas></div>\n')
    js = ""
    # bokeh gold dust at three depths, rising slowly (never on a beat)
    html += f'    <div id="dustL" class="clip" data-start="0" data-duration="{TOTAL}" data-track-index="1" data-layout-ignore>\n'
    for k in range(54):
        depth = k % 3
        sz = (3, 7, 14)[depth]
        x0, y0 = rnd.randint(0, 1070), rnd.randint(300, 1950)
        glow = (4, 10, 22)[depth]
        op = (0.9, 0.7, 0.35)[depth]
        html += (f'      <div id="d{k}" class="dust" style="left: {x0}px; top: {y0}px; width: {sz}px; height: {sz}px; '
                 f'box-shadow: 0 0 {glow}px {glow // 3}px rgba(255, 190, 90, 0.6); opacity: 0;"></div>\n')
        js += (f'    tl.fromTo("#d{k}", {{ x: 0, y: 0, opacity: {op} }}, {{ x: {rnd.randint(-60, 60)}, y: {-rnd.randint(200, 700) * (depth + 1) // 2}, '
               f'opacity: 0, duration: {rnd.uniform(6, 10):.2f}, repeat: 3, ease: "none" }}, {rnd.uniform(0, 4):.2f});\n')
    html += '    </div>\n'
    # the hook: the ornate wheel turning slowly, its inner sun turning the other way; then the dive through the hub
    html += f'    <div id="wheel" class="clip" data-start="0" data-duration="{T["push"] + 0.9:.2f}" data-track-index="2">{wheel_svg()}</div>\n'
    js += f'    tl.fromTo("#wheel", {{ rotation: -18, scale: 1.1, transformOrigin: "540px 1080px" }}, {{ rotation: 8, scale: 1.0, duration: {T["push"]:.2f}, ease: "spring-glide" }}, 0);\n'
    js += f'    tl.fromTo("#sunring", {{ rotation: 0, svgOrigin: "540 1080" }}, {{ rotation: -60, duration: {T["push"] + 0.9:.2f}, ease: "none" }}, 0);\n'
    js += f'    tl.to("#wheel", {{ scale: 3.6, opacity: 0, duration: 0.9, ease: "power2.in" }}, {T["push"]:.2f});\n'
    html += f'    <div id="h1" class="clip hook" data-start="0" data-duration="{T["push"] + 0.4:.2f}" data-track-index="3">Your birth month already<br>chose one of <b>His names.</b></div>\n'
    js += f'    tl.to("#h1", {{ opacity: 0, y: -30, duration: 0.35, ease: "power1.in" }}, {T["push"]:.2f});\n'
    # four pages of three cards
    html += f'    <div id="head" class="clip hook" data-start="{PAGES[0]:.2f}" data-duration="{T["grid"] - PAGES[0]:.2f}" data-track-index="4">FIND YOUR MONTH</div>\n'
    js += f'    tl.fromTo("#head", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.5, ease: "sine.out" }}, {PAGES[0]:.2f});\n'
    js += f'    tl.to("#head", {{ opacity: 0, duration: 0.3, ease: "power1.in" }}, {T["grid"] - 0.35:.2f});\n'
    for p, t0 in enumerate(PAGES):
        html += f'    <div id="p{p}" class="clip" data-start="{t0 - 0.1:.2f}" data-duration="{PAGE + 0.1:.2f}" data-track-index="{5 + p % 2}">\n'
        for j in range(3):
            i = p * 3 + j
            m, name, meaning, ic = MONTHS[i]
            html += "  " + card(i, m, name, meaning, ic, 380 + j * 410)
            a = t0 - 0.05 + j * STAGGER
            js += (f'    tl.fromTo("#c{i}", {{ opacity: 0, x: 240, rotationY: -38, transformPerspective: 1400 }}, '
                   f'{{ opacity: 1, x: 0, rotationY: 0, duration: 0.75, ease: "spring-settle" }}, {a:.2f});\n')
            js += f'    tl.fromTo("#sh{i}", {{ x: -320, rotation: 16, opacity: 1 }}, {{ x: 1040, rotation: 16, opacity: 1, duration: 1.1, ease: "power2.inOut" }}, {a + 0.35:.2f});\n'
            js += f'    tl.to("#c{i}", {{ opacity: 0, x: -160, duration: 0.3, ease: "power1.in" }}, {t0 + PAGE - 0.3 + j * 0.03:.2f});\n'
        html += '    </div>\n'
    # all twelve on one screen to pause and screenshot
    html += f'    <div id="grid" class="clip" data-start="{T["grid"]:.2f}" data-duration="{TOTAL - T["grid"]:.2f}" data-track-index="7">\n'
    for i, (m, name, _, ic) in enumerate(MONTHS):
        c, r = i % 3, i // 3
        x, y = 60 + c * 332, 300 + r * 290
        html += (f'      <div id="t{i}" class="tile" style="left: {x}px; top: {y}px;"><div class="ti">{icon(ic, size=62)}</div>'
                 f'<div class="tm">{m[:3]}</div><div class="tn">{name}</div></div>\n')
        js += f'    tl.fromTo("#t{i}", {{ opacity: 0, scale: 0.8 }}, {{ opacity: 1, scale: 1, duration: 0.55, ease: "spring-snap" }}, {T["grid"] + 0.06 * i:.2f});\n'
    html += '    </div>\n'
    html += f'    <div id="pause" class="clip hook" data-start="{T["grid"]:.2f}" data-duration="{TOTAL - T["grid"]:.2f}" data-track-index="8" style="top: 170px; font-size: 60px; color: {GOLD};">Pause. Find yours.</div>\n'
    js += f'    tl.fromTo("#pause", {{ opacity: 0, y: 20 }}, {{ opacity: 1, y: 0, duration: 0.5, ease: "spring-land" }}, {T["grid"] + 0.3:.2f});\n'
    html += (f'    <div id="cta" class="clip" data-start="{T["cta"]:.2f}" data-duration="{TOTAL - T["cta"]:.2f}" data-track-index="9">'
             f'Comment <b>your name</b> 👇<br><span style="font-size: 40px; font-weight: 700; color: #f3dcae">@lordsrikrishnatemple</span></div>\n')
    js += f'    tl.fromTo("#cta", {{ opacity: 0, y: 30 }}, {{ opacity: 1, y: 0, duration: 0.6, ease: "spring-settle" }}, {T["cta"]:.2f});\n'
    out = wrap("scene", css, html, js)
    return out.replace("  </script>\n</template>", f"  </script>\n  <script>{sky_js()}  </script>\n</template>")


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
      /* Day 16 (English) v2 · Your birth month, His name. Quiz format, shader sky + Tanjore gold, {TOTAL}s. */
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
        background: #070103;
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

      <!-- Free voice (edge-tts narrator_en); effects: CC0 Sonic Pi samples. The user adds a calm track in Instagram. -->
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
    print("built", TOTAL, "s;", T, "pages", PAGES)
