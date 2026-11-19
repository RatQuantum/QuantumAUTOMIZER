"""Science-explainer bed (KB-13): a 'confident, cool' funk-electronic groove (plucked synth bass, tight kick/snare/hat,
soft keys) at 100 BPM, ducked under the narrator, with earshot bank SFX placed on every visual beat
(beat_times.json + kinds from the spec). usage: bed.py <reel> <duration>"""
import sys, json, os, re, subprocess, numpy as np, soundfile as sf
reel, D = sys.argv[1], float(sys.argv[2]); SR = 48000; N = int(SR * D); t = np.arange(N) / SR; A = f"{reel}/assets/audio"
note = lambda m: 440 * 2 ** ((m - 69) / 12); out = np.zeros(N); BPM = 100; b = 60 / BPM; R = np.random.default_rng(5)
def put(sig, at, g=1.0):
    s = int(at * SR)
    if s >= N or s < 0: return
    e = min(N, s + len(sig)); out[s:e] += g * sig[: e - s]
def kick():  tt = np.arange(int(SR * 0.35)) / SR; return np.sin(2 * np.pi * (48 + 110 * np.exp(-tt * 28)) * tt) * np.exp(-tt * 9)
def snare(): tt = np.arange(int(SR * 0.22)) / SR; return (R.standard_normal(len(tt)) * 0.6 + 0.4 * np.sin(2 * np.pi * 190 * tt)) * np.exp(-tt * 18)
def hat():   tt = np.arange(int(SR * 0.05)) / SR; n = R.standard_normal(len(tt)); n = np.diff(n, prepend=0); return n * np.exp(-tt * 70) * 0.5
def bass(m, L): tt = np.arange(int(SR * L)) / SR; f = note(m); x = np.sign(np.sin(2 * np.pi * f * tt)) * 0.35 + np.sin(2 * np.pi * f * tt); return x * np.exp(-tt * 5) * np.minimum(1, tt / 0.004)
def key(ms, L): tt = np.arange(int(SR * L)) / SR; return sum(np.sin(2 * np.pi * note(m) * tt) * np.exp(-tt * 2.2) for m in ms) / len(ms)
PROG = [(40, [64, 67, 71]), (43, [67, 71, 74]), (45, [69, 72, 76]), (38, [62, 66, 69])]   # Em  G  Am  D
BASSLINE = [0, None, 0, 12, None, 7, None, 10]                                         # funk 8ths, relative
bar = 4 * b
for i in range(int(D / bar) + 1):
    t0 = i * bar; root, ch = PROG[i % 4]
    for k in range(4): put(kick(), t0 + k * b, 0.9 if k % 2 == 0 else 0.5)
    for k in (1, 3): put(snare(), t0 + k * b, 0.45)
    for k in range(8): put(hat(), t0 + k * b / 2 + (0.02 if k % 2 else 0), 0.35 if k % 2 else 0.2)
    for k, r in enumerate(BASSLINE):
        if r is not None: put(bass(root + r, b / 2 * 0.9), t0 + k * b / 2, 0.32)
    put(key(ch, bar), t0, 0.12); put(key(ch, b), t0 + 2.5 * b, 0.07)
out *= np.minimum(1, t / 0.4) * np.clip((D - t) / 1.0, 0, 1)
music = out / max(1e-6, np.abs(out).max()) * 0.7
# ---- SFX from the earshot bank on each beat (kind -> sound)
CUE = {"portrait": "whoosh_big/swell", "tag": "pro_pop_in/round", "counter": "pro_typing_run/tick", "ladder": "whoosh_fast/crisp", "item": "pro_pop/thup",
       "eq": "pro_click/glass", "space": "impact/deep", "end": "logo_sting/soft_bloom", "riser": "riser/tension"}
spec = open(f"{reel}/assets/spec.js").read(); kinds = re.findall(r"kind: '(\w+)'", spec)
bt = json.load(open(f"{reel}/docs/beat_times.json")) if os.path.exists(f"{reel}/docs/beat_times.json") else {"beats": [], "items": []}
sfx = np.zeros(N); cache = {}
def bank(sid):
    if sid not in cache:
        p = f"{A}/_sfx_{sid.replace('/', '_')}.wav"
        subprocess.run(["/home/user/gc-venv/bin/earshot", "sfx", "render", sid, "-o", p, "--sr", "48000"], check=True, capture_output=True)
        y, sr = sf.read(p); y = y.mean(1) if y.ndim > 1 else y; cache[sid] = y; os.remove(p)
    return cache[sid]
def place(sid, at, g):
    y = bank(sid); s = int(at * SR); e = min(N, s + len(y))
    if 0 <= s < N: sfx[s:e] += g * y[: e - s]
for k, tm in zip(kinds, bt["beats"]):
    if tm > 0.05: place(CUE.get(k, "pro_pop_in/round"), tm, 0.5)
    if k == "space": place(CUE["riser"], max(0, tm - 1.6), 0.35)
for tm in bt["items"]: place(CUE["item"], tm, 0.55)
sf.write(f"{A}/_m.wav", music, SR); sf.write(f"{A}/_s.wav", sfx / max(1, np.abs(sfx).max()) * 0.9, SR)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"{A}/_m.wav", "-i", f"{A}/voice.wav", "-i", f"{A}/_s.wav", "-filter_complex",
  "[1]aresample=48000,asplit=1[sc];[0][sc]sidechaincompress=threshold=0.04:ratio=5:attack=15:release=250[m];[m]volume=0.55[mm];[mm][2]amix=inputs=2:normalize=0[o];[o]loudnorm=I=-22:TP=-2[f]",
  "-map", "[f]", "-ar", "48000", f"{A}/bed.wav"], check=True)
for f in ("_m.wav", "_s.wav"): os.remove(f"{A}/{f}")
print("bed", D, "s,", len(bt["beats"]), "beat cues,", len(bt["items"]), "item cues")
