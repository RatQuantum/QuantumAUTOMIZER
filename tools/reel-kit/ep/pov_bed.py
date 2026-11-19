"""POV choice-series bed (KB-14): a tense drone only, earshot-bank SFX on the action words, an army roar, the
underwater-style muffle (voice + bed low-passed, 0.5 s silence, heartbeat) after the fall, and a swell under the
end card. usage: pov_bed.py <reel> <duration> <cue json: {"impact":[t..],"whoosh":[..],"riser":[..],"arrows":[..],
"drop":[..],"roar":[[t0,t1]],"muffle":[t0,t1],"swell":t}>"""
import sys, json, os, subprocess, numpy as np, soundfile as sf
reel, D, C = sys.argv[1], float(sys.argv[2]), json.loads(sys.argv[3]); A = f"{reel}/assets/audio"; SR = 48000; N = int(SR * D); t = np.arange(N) / SR
R = np.random.default_rng(9); out = np.zeros(N)
f0 = 55; drone = (np.sin(2 * np.pi * f0 * t) + 0.5 * np.sin(2 * np.pi * f0 * 1.5 * t) + 0.3 * np.sin(2 * np.pi * f0 * 2.01 * t)) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.11 * t))
pulse = np.sin(2 * np.pi * 110 * t) * (np.sin(2 * np.pi * 1.6 * t) > 0.6) * 0.25
out += 0.22 * drone + pulse * 0.5
def lp(x, a=0.02):
    y = np.empty_like(x); s = 0.0
    for i in range(0, len(x), 1): s += a * (x[i] - s); y[i] = s
    return y
for a, b in C.get("roar", []):                                   # army roar: band-limited noise swell
    s, e = int(a * SR), min(N, int(b * SR)); n = R.standard_normal(e - s); n = np.convolve(n, np.ones(40) / 40, "same"); env = np.sin(np.linspace(0, np.pi, e - s)) ** 0.6
    out[s:e] += 0.9 * n * env
cache = {}
def bank(sid):
    if sid not in cache:
        p = f"{A}/_s.wav"; subprocess.run(["/home/user/gc-venv/bin/earshot", "sfx", "render", sid, "-o", p, "--sr", "48000"], check=True, capture_output=True)
        y, _ = sf.read(p); cache[sid] = y.mean(1) if y.ndim > 1 else y; os.remove(p)
    return cache[sid]
def place(sid, at, g):
    y = bank(sid); s = int(at * SR); e = min(N, s + len(y))
    if 0 <= s < N: out[s:e] += g * y[: e - s] / max(1e-6, np.abs(y).max())
for k, sid, g in (("impact", "impact/deep", 1.0), ("whoosh", "whoosh_fast/whip", 0.5), ("riser", "riser/tension", 0.6), ("drop", "sub_drop/808", 1.0)):
    for tm in C.get(k, []): place(sid, tm, g)
for tm in C.get("arrows", []):
    for j in range(6): place("whoosh_fast/whistle", tm + j * 0.13, 0.35)
if "swell" in C: place("reverse_swell/cymbal", C["swell"] - 1.2, 0.6); place("pro_shimmer/m2", C["swell"], 0.5)
m0, m1 = C.get("muffle", [D, D]); s0, s1 = int(m0 * SR), int(m1 * SR)
if s1 > s0:                                                        # muffle + 0.5 s silence + heartbeat
    out[s0:s1] = lp(out[s0:s1], 0.01) * 0.5; out[s0:s0 + int(0.5 * SR)] = 0
    for hb in np.arange(m0 + 0.5, m1, 0.85):
        for dt, g in ((0, 1.0), (0.22, 0.7)):
            s = int((hb + dt) * SR); tt = np.arange(int(0.15 * SR)) / SR
            if s + len(tt) < N: out[s:s + len(tt)] += 0.8 * g * np.sin(2 * np.pi * 50 * tt) * np.exp(-tt * 25)
out *= np.minimum(1, t / 0.3) * np.clip((D - t) / 0.8, 0, 1)
sf.write(f"{A}/_m.wav", out / max(1e-6, np.abs(out).max()) * 0.8, SR)
# muffle the voice too (low-pass the fall section), keeping the original as voice_dry.wav
if s1 > s0:
    if not os.path.exists(f"{A}/voice_dry.wav"): os.rename(f"{A}/voice.wav", f"{A}/voice_dry.wav")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"{A}/voice_dry.wav", "-af", f"lowpass=f=700:enable='between(t,{m0},{m1})',volume=0.7:enable='between(t,{m0},{m1})'", f"{A}/voice.wav"], check=True)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"{A}/_m.wav", "-i", f"{A}/voice.wav", "-filter_complex",
  "[1]aresample=48000[sc];[0][sc]sidechaincompress=threshold=0.05:ratio=4:attack=10:release=200[m];[m]loudnorm=I=-21:TP=-2[o]", "-map", "[o]", "-ar", "48000", f"{A}/bed.wav"], check=True)
os.remove(f"{A}/_m.wav"); print("pov bed", D)
