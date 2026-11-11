"""Day 19 sound bed: an original light, playful score (100 BPM, D major: marimba-like plucks, soft bass, shaker) and
synthesized/CC0 effects placed on the story beats. Writes assets/audio/bed.wav (music + effects, stereo 48 kHz)."""
import json, subprocess, numpy as np
SR = 48000
D = float(open("assets/data.js").read().split("DURATION = ")[1].split(";")[0])
N = int(D * SR)
music = np.zeros((N, 2)); fx = np.zeros((N, 2))
rng = np.random.default_rng(19)
def env(n, a=0.004, d=0.4):
    t = np.arange(n) / SR; return np.minimum(1, t / a) * np.exp(-t / d)
def place(buf, t, sig, pan=0.0, g=1.0):
    i = int(t * SR); n = min(len(sig), N - i)
    if n <= 0 or i < 0: return
    buf[i:i + n, 0] += sig[:n] * g * (1 - pan) / 1.0; buf[i:i + n, 1] += sig[:n] * g * (1 + pan) / 1.0
def hz(n): return 440 * 2 ** ((n - 69) / 12)
def marimba(f, dur=0.5):
    n = int(dur * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * f * 4 * t) * np.exp(-t / 0.03)) * env(n, 0.002, 0.18)
def bass(f, dur=0.55):
    n = int(dur * SR); t = np.arange(n) / SR
    return np.tanh(1.6 * np.sin(2 * np.pi * f * t)) * env(n, 0.01, 0.25)
def shaker(dur=0.06):
    n = int(dur * SR); return rng.standard_normal(n) * env(n, 0.003, 0.02) * np.hanning(n)
BPM = 100; B = 60 / BPM
prog = [(62, [62, 66, 69, 74]), (69, [69, 73, 76, 81]), (71, [71, 74, 78, 83]), (67, [67, 71, 74, 79])]   # D A Bm G
pent = [74, 76, 78, 81, 83, 86]
t = 0.0; bar = 0
while t < D - 0.5:
    root, ch = prog[bar % 4]
    for k in range(8):   # 8ths
        tt = t + k * B / 2
        if tt >= D - 0.3: break
        quiet = 28.55 <= tt < 29.75 or 40.0 <= tt < 40.3       # drop out for the record scratch and the tip
        if quiet: continue
        place(music, tt, marimba(hz(ch[[0, 2, 1, 3, 2, 0, 3, 1][k]] + 12)), pan=0.25 * (1 if k % 2 else -1), g=0.16)
        if k in (0, 3, 6): place(music, tt, bass(hz(root - 24)), g=0.22)
        place(music, tt, shaker(), pan=0.4, g=0.05 if k % 2 else 0.03)
        if bar % 2 == 1 and k == 4: place(music, tt, marimba(hz(pent[(bar * 3 + k) % 6] + 12), 0.8), g=0.10)
    t += 4 * B; bar += 1
# effects
def clink(f0=2600):
    n = int(0.25 * SR); t = np.arange(n) / SR
    return sum(np.sin(2 * np.pi * f0 * m * t) * np.exp(-t / (0.08 / m)) for m in (1, 1.58, 2.41)) * env(n, 0.001, 0.2) / 2
def boing():
    n = int(0.45 * SR); t = np.arange(n) / SR; f = 180 + 260 * np.exp(-t * 6) * (1 + 0.3 * np.sin(2 * np.pi * 14 * t))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.004, 0.2)
def sample(name):
    return np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", f"/home/user/sonic-pi/etc/samples/{name}.flac", "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout, np.float32).astype(float)
gold = [22.75 + i * 0.16 for i in range(6)] + [23.98 + i * 0.07 for i in range(9)] + [24.84 + i * 0.16 for i in range(4)] + [25.7 + i * 0.045 for i in range(18)] + [25.9, 26.2]
for i, td in enumerate(gold): place(fx, td + 0.35, clink(2200 + (i * 137) % 1400), pan=0.3, g=0.12 if td < 25.6 else 0.06)
place(fx, 20.25, boing(), g=0.35)
place(fx, 28.6, sample("vinyl_scratch"), g=0.5)
place(fx, 38.5, sample("ambi_swoosh"), g=0.35)
place(fx, 0.0, sample("ambi_swoosh"), g=0.25)
for tip in (40.3, 2.6 + (40.3 - 39.75) / 0.75):   # the tip, and its flash-forward in the hook
    place(fx, tip, sample("bd_boom"), g=0.6)
    for k in range(8): place(fx, tip + 0.05 + k * 0.05, clink(2400 + k * 210), pan=0.3 - k * 0.08, g=0.09)
place(fx, 4.55, sample("tabla_na_o"), g=0.35)   # Dwarka
place(fx, 49.1, sample("tabla_tun1"), g=0.35)   # Guruvayur
place(fx, 56.2, sample("elec_chime"), g=0.18)   # the ask
bed = music + fx
bed[-int(0.8 * SR):] *= np.linspace(1, 0, int(0.8 * SR))[:, None]
bed /= max(1e-6, np.abs(bed).max()) / 0.8
import wave
w = wave.open("assets/audio/bed.wav", "wb"); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((np.clip(bed, -1, 1) * 32767).astype("<i2").tobytes()); w.close()
print("bed", D, "s")
