"""Episode sound bed: an original marimba score (D major, or B minor for night) + synthesized/CC0 effects at given times.
   python3 make_bed.py <reel dir> <events.json>   events: {"key": "major|minor", "quiet": [[t0, t1]...], "fx": [[name, t, gain]...]}"""
import json, sys, subprocess, wave, numpy as np
SR = 48000; reel, evf = sys.argv[1], sys.argv[2]
EV = json.load(open(evf))
D = float(open(f"{reel}/assets/data.js").read().split("DURATION = ")[1].split(";")[0]); N = int(D * SR)
music = np.zeros((N, 2)); fx = np.zeros((N, 2)); rng = np.random.default_rng(7)
def env(n, a=0.004, d=0.4): t = np.arange(n) / SR; return np.minimum(1, t / a) * np.exp(-t / d)
def place(buf, t, sig, pan=0.0, g=1.0):
    i = int(t * SR); n = min(len(sig), N - i)
    if n <= 0 or i < 0: return
    buf[i:i + n, 0] += sig[:n] * g * (1 - pan); buf[i:i + n, 1] += sig[:n] * g * (1 + pan)
hz = lambda n: 440 * 2 ** ((n - 69) / 12)
def marimba(f, dur=0.5):
    n = int(dur * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * f * 4 * t) * np.exp(-t / 0.03)) * env(n, 0.002, 0.18)
def bass(f, dur=0.55): n = int(dur * SR); t = np.arange(n) / SR; return np.tanh(1.6 * np.sin(2 * np.pi * f * t)) * env(n, 0.01, 0.25)
def noise(n, sm=1): x = rng.standard_normal(n); return np.convolve(x, np.ones(sm) / sm, mode="same") if sm > 1 else x
def shaker(): n = int(0.06 * SR); return noise(n) * env(n, 0.003, 0.02) * np.hanning(n)
B = 60 / 100
prog = [(62, [62, 66, 69, 74]), (69, [69, 73, 76, 81]), (71, [71, 74, 78, 83]), (67, [67, 71, 74, 79])] if EV.get("key", "major") == "major" else \
       [(59, [59, 62, 66, 71]), (55, [55, 59, 62, 67]), (62, [62, 66, 69, 74]), (57, [57, 61, 64, 69])]
quiet = EV.get("quiet", [])
t = 0.0; bar = 0
while t < D - 0.5:
    root, ch = prog[bar % 4]
    for k in range(8):
        tt = t + k * B / 2
        if tt >= D - 0.3 or any(a <= tt < b for a, b in quiet): continue
        place(music, tt, marimba(hz(ch[[0, 2, 1, 3, 2, 0, 3, 1][k]] + 12)), pan=0.25 * (1 if k % 2 else -1), g=0.16)
        if k in (0, 3, 6): place(music, tt, bass(hz(root - 24)), g=0.22)
        place(music, tt, shaker(), pan=0.4, g=0.05 if k % 2 else 0.03)
    t += 4 * B; bar += 1
def sample(name): return np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", f"/home/user/sonic-pi/etc/samples/{name}.flac", "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout, np.float32).astype(float)
def clink(f0=2600): n = int(0.25 * SR); t = np.arange(n) / SR; return sum(np.sin(2 * np.pi * f0 * m * t) * np.exp(-t / (0.08 / m)) for m in (1, 1.58, 2.41)) * env(n, 0.001, 0.2) / 2
def boing(): n = int(0.45 * SR); t = np.arange(n) / SR; f = 180 + 260 * np.exp(-t * 6) * (1 + 0.3 * np.sin(2 * np.pi * 14 * t)); return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.004, 0.2)
def thunder(): n = int(2.6 * SR); x = noise(n, 400) * 6; t = np.arange(n) / SR; return x * (np.exp(-t * 1.6) * (1 + 0.6 * np.sin(t * 9))) * np.minimum(1, t / 0.02)
def rain(dur): n = int(dur * SR); x = noise(n, 3) * 0.5; x = x - np.convolve(x, np.ones(40) / 40, mode="same"); w = np.minimum(1, np.minimum(np.arange(n), n - np.arange(n)) / (0.6 * SR)); return x * w
def conch(): n = int(2.2 * SR); t = np.arange(n) / SR; f = 233 * (1 + 0.01 * np.sin(2 * np.pi * 5 * t)); s = sum(np.sin(2 * np.pi * f * m * t) / m ** 1.2 for m in range(1, 9)); return np.tanh(s * 0.8) * np.minimum(1, t / 0.25) * np.minimum(1, (2.2 - t) / 0.4)
def crowd(dur=3.2): n = int(dur * SR); return noise(n, 60) * 1.5 * np.hanning(n)
def whistle(): n = int(0.7 * SR); t = np.arange(n) / SR; f = 1800 + 700 * np.sin(np.pi * t / 0.7) - 400 * (t > 0.35); return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.02, 0.5) * 0.6
def splat(): n = int(0.5 * SR); return noise(n, 30) * env(n, 0.002, 0.12) * 2
def flute(notes, step=0.32):
    out = np.zeros(int((len(notes) * step + 0.8) * SR))
    for i, nt in enumerate(notes):
        n = int((step + 0.5) * SR); t = np.arange(n) / SR; f = hz(nt) * (1 + 0.006 * np.sin(2 * np.pi * 5.5 * t)); s = (np.sin(2 * np.pi * f * t) + 0.25 * np.sin(4 * np.pi * f * t)) * np.minimum(1, t / 0.05) * np.exp(-t / 0.5) + noise(n) * 0.01
        j = int(i * step * SR); out[j:j + n] += s
    return out * 0.5
def peacock(): n = int(0.6 * SR); t = np.arange(n) / SR; f = 900 + 500 * np.sin(np.pi * t / 0.6); return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.01, 0.3) * (1 + 0.5 * np.sign(np.sin(2 * np.pi * 30 * t)))
LIB = {"thunder": thunder, "conch": conch, "crowd": crowd, "whistle": whistle, "splat": splat, "boing": boing, "peacock": peacock,
       "clink": lambda: clink(), "flute": lambda: flute([74, 76, 78, 81, 78, 76, 74, 71, 74]), "flute2": lambda: flute([81, 78, 76, 78, 74, 76, 71], 0.4)}
for name, t0, g, *rest in EV["fx"]:
    if name == "rain": place(fx, t0, rain(rest[0]), g=g)
    elif name in LIB: place(fx, t0, LIB[name](), g=g)
    else: place(fx, t0, sample(name), g=g)
bed = music + fx
bed[-int(0.8 * SR):] *= np.linspace(1, 0, int(0.8 * SR))[:, None]
bed /= max(1e-6, np.abs(bed).max()) / 0.8
w = wave.open(f"{reel}/assets/audio/bed_raw.wav", "wb"); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(bed, -1, 1) * 32767).astype("<i2").tobytes()); w.close()
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"{reel}/assets/audio/bed_raw.wav", "-af", "loudnorm=I=-24:TP=-3", "-ar", "48000", f"{reel}/assets/audio/bed.wav"], check=True)
subprocess.run(["rm", f"{reel}/assets/audio/bed_raw.wav"]); print("bed", reel, D)
