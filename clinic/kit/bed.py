"""Clinic music bed: a calm modern pad + soft pluck arpeggio + light pulse, ducked under the voice, with a soft
'pop' at each beat (from docs/beats.json, resolved times in docs/beat_times.json). usage: bed.py <reel> <duration>"""
import sys, json, subprocess, numpy as np, wave
reel, D = sys.argv[1], float(sys.argv[2]); SR = 48000; N = int(SR * D); t = np.arange(N) / SR
def note(m): return 440 * 2 ** ((m - 69) / 12)
CH = [[48, 55, 59, 64], [45, 52, 55, 60], [41, 48, 52, 57], [43, 50, 55, 59]]   # Cmaj7 Am7 Fmaj7 G
BAR = 60 / 84 * 4; out = np.zeros(N)
for i in range(int(D / BAR) + 1):
    s, e = int(i * BAR * SR), min(N, int((i + 1) * BAR * SR + SR * 0.6))
    if s >= N: break
    tt = t[s:e] - t[s]; env = np.minimum(1, tt / 0.8) * np.exp(-np.maximum(0, tt - BAR) * 3)
    for m in CH[i % 4]:
        f = note(m); out[s:e] += 0.05 * env * (np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(2 * np.pi * f * 2.003 * tt))
    for j, m in enumerate((CH[i % 4] * 2)[:8]):          # pluck arpeggio in eighths, an octave up
        ps = s + int(j * BAR / 8 * SR); pe = min(N, ps + int(SR * 0.5))
        if ps >= N: break
        pt = t[ps:pe] - t[ps]; out[ps:pe] += 0.035 * np.exp(-pt * 9) * np.sin(2 * np.pi * note(m + 12) * pt)
    for j in range(4):                                     # soft pulse on each beat
        ks = s + int(j * BAR / 4 * SR); ke = min(N, ks + int(SR * 0.18))
        if ks >= N: break
        kt = t[ks:ke] - t[ks]; out[ks:ke] += 0.10 * np.exp(-kt * 30) * np.sin(2 * np.pi * (55 + 60 * np.exp(-kt * 40)) * kt)
try: bt = json.load(open(f"{reel}/docs/beat_times.json"))
except Exception: bt = []
for b in bt:                                               # 'pop' accent on every beat card
    ps = int(b * SR); pe = min(N, ps + int(SR * 0.12))
    if 0 <= ps < N: pt = t[ps:pe] - t[ps]; out[ps:pe] += 0.12 * np.exp(-pt * 40) * np.sin(2 * np.pi * (900 - 2500 * pt) * pt)
out *= np.minimum(1, t / 0.5) * np.minimum(1, (D - t) / 1.2).clip(0, 1)
open(f"{reel}/assets/audio/_m.raw", "wb").write((out / max(1e-6, np.abs(out).max()) * 0.8).astype(np.float32).tobytes())
A = f"{reel}/assets/audio"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", f"{A}/_m.raw", "-i", f"{A}/voice.wav", "-filter_complex",
  "[1]aresample=48000,asplit=1[sc];[0][sc]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=300[m];[m]loudnorm=I=-26:TP=-3[o]", "-map", "[o]", "-ar", "48000", f"{A}/bed.wav"], check=True)
subprocess.run(["rm", "-f", f"{A}/_m.raw"]); print("bed", D)
