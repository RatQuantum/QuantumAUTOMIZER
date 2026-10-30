"""Median speaking pitch of a WAV (autocorrelation per 40 ms frame), to check a voice is low and male."""
import sys, numpy as np, soundfile as sf
for path in sys.argv[1:]:
    x, sr = sf.read(path)
    x = x if x.ndim == 1 else x.mean(1)
    n, hop, f0s = int(0.04 * sr), int(0.01 * sr), []
    lo, hi = int(sr / 300), int(sr / 60)  # search 60-300 Hz
    for i in range(0, len(x) - n, hop):
        f = x[i:i + n] * np.hanning(n)
        if np.sqrt((f ** 2).mean()) < 0.02:
            continue
        ac = np.correlate(f, f, "full")[n - 1:]
        lag = lo + int(np.argmax(ac[lo:hi]))
        if ac[lag] > 0.45 * ac[0]:
            f0s.append(sr / lag)
    f0s = np.array(f0s)
    print(f"{path}: median pitch {np.median(f0s):.0f} Hz (25-75%: {np.percentile(f0s,25):.0f}-{np.percentile(f0s,75):.0f} Hz), voiced frames {len(f0s)}, duration {len(x)/sr:.2f}s")
