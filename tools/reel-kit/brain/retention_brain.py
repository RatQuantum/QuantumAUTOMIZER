"""Retention brain (KB-13): measures what keeps short-form viewers watching, second by second, on ANY reel, and
compares ours with a reference. A light CPU stand-in for brain-encoding models such as Meta's TRIBE, which need a GPU.
Signals (per second): visual novelty (frame-difference energy), cut/reveal events, speech rate (words/s), silence,
audio onsets; plus script checks (hook stakes in 1 s, lock-in by 5 s, re-hooks every 8-10 s, open questions, numbers).
usage: python3 -I retention_brain.py <reel.mp4> [--ref ref.mp4] [--words words.json]   → prints a report + JSON"""
import sys, json, subprocess, numpy as np, re, os
def frames_energy(mp4):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", mp4, "-vf", "fps=10,scale=54:96,format=gray", "-f", "rawvideo", "-"], capture_output=True, check=True).stdout
    f = np.frombuffer(raw, np.uint8).reshape(-1, 96, 54).astype(np.float32); d = np.abs(np.diff(f, axis=0)).mean((1, 2))
    return np.concatenate([[0], d])                       # 10 Hz visual change
def audio(mp4):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", mp4, "-ac", "1", "-ar", "8000", "-f", "f32le", "-"], capture_output=True, check=True).stdout
    a = np.frombuffer(raw, np.float32); fr = a[: len(a) // 800 * 800].reshape(-1, 800); rms = np.sqrt((fr ** 2).mean(1)) + 1e-9
    db = 20 * np.log10(rms); flux = np.maximum(0, np.diff(db, prepend=db[0])); return db, flux   # 10 Hz
def per_sec(x, n): return np.array([x[i * 10:(i + 1) * 10].mean() if len(x[i * 10:(i + 1) * 10]) else 0 for i in range(n)])
def analyse(mp4, words=None):
    v = frames_energy(mp4); db, flux = audio(mp4); n = int(len(v) / 10)
    vs = per_sec(v, n); events = int((v > max(6, np.percentile(v, 92))).sum())
    silence = float((db < db.max() - 35).mean())
    r = {"duration_s": round(len(v) / 10, 1), "visual_change_mean": round(float(v.mean()), 2), "visual_change_first_3s": round(float(v[:30].mean()), 2),
         "big_visual_events_per_10s": round(events / max(1, len(v) / 100), 2), "dead_seconds": int((vs < 0.4).sum()), "silence_frac": round(silence, 3),
         "audio_onsets_per_s": round(float((flux > 6).sum() / max(1, len(flux) / 10)), 2), "per_second_visual": [round(float(x), 2) for x in vs]}
    if words:
        W = json.load(open(words)); txt = " ".join(w[2] for w in W).lower(); dur = W[-1][1] if W else 1
        first = " ".join(w[2] for w in W if w[0] < 1.5).lower()
        r["words_per_s"] = round(len(W) / dur, 2)
        r["numbers_spoken"] = len(re.findall(r"\b(\d[\d,.]*|one|two|three|five|seven|eight|ten|hundred|thousand|million|billion)\b", txt))
        r["questions"] = txt.count("?"); r["rehooks"] = [round(w[0], 1) for w in W if re.sub(r"[^a-z']", "", w[2].lower()) in ("but", "wait", "twist", "except", "until")]
        r["lock_in_by_5s"] = any(w[0] < 5.5 and "stay" in w[2].lower() for w in W) or "till the end" in " ".join(w[2] for w in W if w[0] < 6).lower()
        r["hook_first_1_5s"] = first
    return r
def score(r):
    s, notes = 100, []
    if r["visual_change_first_3s"] < 3: s -= 15; notes.append("hook frames too still: add motion/cut in the first 3 s")
    if r["big_visual_events_per_10s"] < 2: s -= 15; notes.append("too few visual reveals: aim for a new element every 2-3 s")
    if r["dead_seconds"] > 2: s -= 5 * min(4, r["dead_seconds"] - 2); notes.append(f"{r['dead_seconds']} near-static seconds: add drift/zoom or a reveal")
    if r.get("words_per_s", 3) < 2.4: s -= 10; notes.append("narration slow: tighten to ~2.8-3.2 words/s")
    if "lock_in_by_5s" in r and not r["lock_in_by_5s"]: s -= 10; notes.append("no lock-in line by 5 s")
    gaps = np.diff([0] + r.get("rehooks", []) + [r["duration_s"]]) if "rehooks" in r else []
    if len(gaps) and max(gaps) > 14: s -= 10; notes.append("a stretch over 14 s without a re-hook (but/wait/twist)")
    return max(0, s), notes
if __name__ == "__main__":
    a = sys.argv[1:]; mp4 = a[0]; ref = a[a.index("--ref") + 1] if "--ref" in a else None; words = a[a.index("--words") + 1] if "--words" in a else None
    R = analyse(mp4, words); sc, notes = score(R); R["score"] = sc; R["fix"] = notes
    out = {"reel": R}
    if ref: F = analyse(ref); F["score"], F["fix"] = score(F); out["reference"] = F
    for k in ("duration_s", "visual_change_mean", "visual_change_first_3s", "big_visual_events_per_10s", "dead_seconds", "audio_onsets_per_s", "words_per_s", "score"):
        print(f"{k:28s} ours {out['reel'].get(k, '-'):>8}" + (f"   ref {out['reference'].get(k, '-'):>8}" if ref else ""))
    print("fix:", "; ".join(notes) or "none")
    json.dump(out, open(os.path.splitext(mp4)[0] + ".brain.json", "w"), indent=1)
