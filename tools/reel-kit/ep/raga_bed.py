"""Raga sound bed: tanpura drone + real tabla (keherwa theka) + a generated bansuri melody on a raga, bell accents,
   real-sample SFX, and the music ducked under the narrator. Drop-in replacement for make_bed.py (same events.json).
   python3 raga_bed.py <reel dir> <events.json>
   events: {"key": "major|minor", "mood": "devotional|festive|epic" (optional), "quiet": [[t0, t1]], "fx": [[name, t, gain]]}"""
import json, sys, subprocess, wave, numpy as np
SR = 48000; reel, evf = sys.argv[1], sys.argv[2]
EV = json.load(open(evf))
D = float(open(f"{reel}/assets/data.js").read().split("DURATION = ")[1].split(";")[0]); N = int(D * SR)
seed = sum(map(ord, reel)); rng = np.random.default_rng(seed)
mood = EV.get("mood") or ("festive" if EV.get("key", "major") == "major" else "epic" if "battle" in json.dumps(EV) else "devotional")
quiet = EV.get("quiet", [])
inq = lambda t: any(a <= t < b for a, b in quiet)
music = np.zeros((N, 2)); drone = np.zeros((N, 2)); fx = np.zeros((N, 2))
def place(buf, t, sig, pan=0.0, g=1.0):
    i = int(t * SR); n = min(len(sig), N - i)
    if n <= 0 or i < 0: return
    buf[i:i + n, 0] += sig[:n] * g * (1 - pan); buf[i:i + n, 1] += sig[:n] * g * (1 + pan)
def env(n, a=0.004, d=0.4): t = np.arange(n) / SR; return np.minimum(1, t / a) * np.exp(-t / d)
def noise(n, sm=1): x = rng.standard_normal(n); return np.convolve(x, np.ones(sm) / sm, mode="same") if sm > 1 else x
_cache = {}
def sample(name):
    if name not in _cache: _cache[name] = np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", f"/home/user/sonic-pi/etc/samples/{name}.flac", "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout, np.float32).astype(float)
    return _cache[name]
SA = 146.83  # D3
# ---- scales (semitones from Sa) per mood
SCALE = {"festive": [0, 2, 4, 7, 9], "devotional": [0, 2, 4, 6, 7, 9, 11], "epic": [0, 1, 3, 5, 7, 8, 10]}[mood]
BPM = {"festive": 112, "devotional": 84, "epic": 96}[mood]
MATRA = 60 / BPM / 2
# ---- tanpura: Pa Sa Sa Sa(low), each pluck a rich, slowly beating string
def tstring(f, dur=2.6):
    n = int(dur * SR); t = np.arange(n) / SR; s = np.zeros(n)
    for h in range(1, 14):
        a = (1 / h ** 0.8) * (1.3 if h in (3, 5, 7) else 1.0)
        s += a * (np.sin(2 * np.pi * f * h * t) + 0.5 * np.sin(2 * np.pi * f * h * 1.0015 * t)) * np.exp(-t * (0.6 + 0.08 * h))
    return np.tanh(s * 0.35) * np.minimum(1, t / 0.01)
cyc = [SA * 1.5 / 2 * 2 * 0.5 * 2, SA, SA, SA / 2]  # Pa (A2), Sa, Sa, low Sa
t = 0.0; k = 0
while t < D:
    place(drone, t, tstring(cyc[k % 4]), pan=[-0.3, 0.1, 0.3, -0.1][k % 4], g=0.12); t += 0.62; k += 1
# ---- tabla keherwa: dha ge na ti | na ka dhi na
BOL = {"dha": ["tabla_ghe2", "tabla_na"], "ge": ["tabla_ghe1"], "na": ["tabla_na"], "ti": ["tabla_te1"], "ka": ["tabla_ke1"], "dhi": ["tabla_ghe3", "tabla_tun1"], "tin": ["tabla_tun2"], "te": ["tabla_te2"]}
THEKA = ["dha", "ge", "na", "ti", "na", "ka", "dhi", "na"]
start_tabla = 2.0 if mood != "devotional" else 3.2
t = start_tabla; m = 0
while t < D - 1.2:
    if not inq(t):
        bol = THEKA[m % 8]
        if mood == "festive" and m % 2 and rng.random() < 0.35: bol = "te"
        for smp in BOL[bol]: place(music, t, sample(smp), pan=-0.15, g=0.5 if m % 8 == 0 else 0.36)
        if mood == "epic" and m % 4 == 0: place(music, t, sample("drum_tom_lo_hard"), g=0.35); place(music, t, sample("bd_boom"), g=0.25 if m % 8 == 0 else 0)
        if mood == "festive" and m % 2 == 0: place(music, t + MATRA / 2, sample("drum_cymbal_pedal"), pan=0.4, g=0.08)
    t += MATRA; m += 1
# ---- bansuri: generated raga phrases with glides, vibrato and breath
def bansuri(seq):  # seq: [(freq, dur)], legato with portamento
    total = sum(d for _, d in seq) + 0.6; n = int(total * SR); out = np.zeros(n)
    f_track = np.zeros(n); a_track = np.zeros(n); i = 0; prev = seq[0][0]
    for f, d in seq:
        m = int(d * SR); gl = min(int(0.07 * SR), m // 3)
        f_track[i:i + gl] = np.linspace(prev, f, gl); f_track[i + gl:i + m] = f
        tt = np.arange(m) / SR; a = np.minimum(1, tt / 0.06) * np.minimum(1, (d - tt) / 0.08 + 0.25); a_track[i:i + m] = np.clip(a, 0, 1)
        i += m; prev = f
    f_track[i:] = prev; tt = np.arange(n) / SR
    vib = 1 + 0.008 * np.sin(2 * np.pi * 5.2 * tt) * np.minimum(1, (tt % 1.5) / 0.4)
    ph = 2 * np.pi * np.cumsum(f_track * vib) / SR
    tone = np.sin(ph) + 0.18 * np.sin(2 * ph) + 0.06 * np.sin(3 * ph)
    breath = noise(n, 4); breath -= np.convolve(breath, np.ones(30) / 30, mode="same")
    out = (tone + 0.06 * breath) * a_track
    rel = int(0.4 * SR); out[i:i + rel] *= np.linspace(1, 0, min(rel, n - i))[:len(out[i:i + rel])]
    return out
def deg2f(d):
    o, r = divmod(d, len(SCALE)); return SA * 2 * 2 ** ((SCALE[r] + 12 * o) / 12)  # bansuri sits an octave above the drone
beat = 60 / BPM
t = start_tabla + 4 * beat; deg = 0
while t < D - 2.5:
    if inq(t): t += beat; continue
    L = int(rng.integers(4, 8)); seq = []
    for j in range(L):
        deg = int(np.clip(deg + rng.choice([-2, -1, -1, 1, 1, 2, 0]), -2, len(SCALE) + 3))
        dur = beat * rng.choice([0.5, 1, 1, 1.5, 2]) * (1.4 if mood == "devotional" else 1)
        seq.append((deg2f(deg), dur))
    seq.append((deg2f(0 if rng.random() < 0.6 else 4 if len(SCALE) > 5 else 3), beat * 2.5))
    if t + sum(d for _, d in seq) > D - 1.5: break
    if not any(inq(t + x) for x in np.linspace(0, sum(d for _, d in seq), 6)):
        place(music, t, bansuri(seq), pan=0.12, g=0.22)
    t += sum(d for _, d in seq) + beat * rng.choice([1, 2])
# ---- bells at the start and every 8 bars, a santoor shimmer in festive mood
place(music, 0.05, sample("perc_bell"), g=0.35)
for tb in np.arange(start_tabla, D - 2, 16 * MATRA):
    if not inq(tb): place(music, tb, sample("perc_bell2"), pan=0.3, g=0.12)
    if mood == "festive" and not inq(tb):
        for q in range(6): place(music, tb + q * 0.07, np.sin(2 * np.pi * deg2f(q + 2) * 2 * np.arange(int(0.6 * SR)) / SR) * env(int(0.6 * SR), 0.002, 0.25), pan=0.5, g=0.05)
# ---- effects: old names keep working; new real-sample names
def shimmer():
    n = int(1.8 * SR); s = np.zeros(n)
    for q in range(14):
        f = deg2f(q + 3) * 2; j = int(q * 0.06 * SR); m = n - j; tt = np.arange(m) / SR
        s[j:] += np.sin(2 * np.pi * f * tt) * env(m, 0.002, 0.5) * 0.25
    return s
def whoosh(dur=0.9):
    n = int(dur * SR); x = noise(n); out = np.zeros(n); w = np.sin(np.pi * np.arange(n) / n) ** 2
    for c in range(1, 6): out += np.convolve(x, np.ones(c * 12) / (c * 12), mode="same") * (1 if c % 2 else -1)
    return out * w * 1.6
def thunder(): n = int(2.6 * SR); x = noise(n, 400) * 6; t = np.arange(n) / SR; return x * (np.exp(-t * 1.6) * (1 + 0.6 * np.sin(t * 9))) * np.minimum(1, t / 0.02)
def conch(): n = int(2.4 * SR); t = np.arange(n) / SR; f = 233 * (1 + 0.012 * np.sin(2 * np.pi * 5 * t)) * (1 + 0.04 * np.minimum(1, t / 0.4)); s = sum(np.sin(2 * np.pi * np.cumsum(f) * m / SR) / m ** 1.1 for m in range(1, 10)); return np.tanh(s * 0.9) * np.minimum(1, t / 0.3) * np.minimum(1, (2.4 - t) / 0.5)
def crowd(dur=2.4): n = int(dur * SR); return noise(n, 60) * 1.5 * np.hanning(n)
def flute_lick(seq_deg, step=0.28): return bansuri([(deg2f(d), step) for d in seq_deg] + [(deg2f(seq_deg[-1]), step * 2)])
LIB = {"thunder": thunder, "conch": conch, "crowd": crowd, "shimmer": shimmer, "whoosh": whoosh,
       "flute": lambda: flute_lick([0, 1, 2, 3, 4, 3, 2, 1, 0]), "flute2": lambda: flute_lick([4, 3, 2, 3, 1, 2, 0], 0.36),
       "bell": lambda: sample("perc_bell"), "boom": lambda: sample("misc_cineboom"), "impact": lambda: sample("perc_impact1"),
       "elec_chime": shimmer, "vinyl_scratch": lambda: np.concatenate([whoosh(0.5) * 0.6, sample("perc_impact2") * 0.8]),
       "vinyl_rewind": lambda: whoosh(0.8), "ambi_swoosh": lambda: whoosh(0.9), "perc_swoosh": lambda: whoosh(0.6),
       "clink": lambda: sample("perc_bell2") * 0.6, "splat": lambda: sample("perc_impact2"), "boing": lambda: whoosh(0.4)}
for name, t0, g, *rest in EV["fx"]:
    try: sig = LIB[name]() if name in LIB else sample(name)
    except Exception: continue
    place(fx, t0, sig, g=g * (1.0 if name in ("bd_boom", "thunder") else 1.1))
# ---- duck the music under the narrator (sidechain from the voice track)
try:
    v = np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", f"{reel}/assets/audio/voice.wav", "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout, np.float32).astype(float)
    v = np.pad(v, (0, max(0, N - len(v))))[:N]; hop = int(0.02 * SR)
    e = np.sqrt(np.convolve(v ** 2, np.ones(hop) / hop, mode="same")); e = np.convolve(e, np.ones(hop * 8) / (hop * 8), mode="same")
    gmus = 1 - 0.45 * np.clip(e / (np.percentile(e[e > 0], 60) + 1e-6), 0, 1)
except Exception: gmus = np.ones(N)
# quiet zones (the "Wait…?" beat): everything but a soft drone drops out
qmask = np.ones(N)
for a, b in quiet:
    i0, i1 = int(a * SR), int(b * SR); f = int(0.15 * SR)
    qmask[i0:i1] = 0.12; qmask[max(0, i0 - f):i0] = np.linspace(1, 0.12, len(qmask[max(0, i0 - f):i0])); qmask[i1:i1 + f] = np.linspace(0.12, 1, len(qmask[i1:i1 + f]))
bed = (music * gmus[:, None] + drone * (0.7 + 0.3 * gmus[:, None])) * qmask[:, None] + fx
# a little room: two short echoes
for dl, gg in ((0.11, 0.18), (0.23, 0.09)):
    k = int(dl * SR); bed[k:] += bed[:-k] * gg
bed[-int(0.9 * SR):] *= np.linspace(1, 0, int(0.9 * SR))[:, None]
bed /= max(1e-6, np.abs(bed).max()) / 0.8
w = wave.open(f"{reel}/assets/audio/bed_raw.wav", "wb"); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(bed, -1, 1) * 32767).astype("<i2").tobytes()); w.close()
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"{reel}/assets/audio/bed_raw.wav", "-af", "loudnorm=I=-23:TP=-3", "-ar", "48000", f"{reel}/assets/audio/bed.wav"], check=True)
subprocess.run(["rm", f"{reel}/assets/audio/bed_raw.wav"]); print("raga bed", reel, mood, D)
