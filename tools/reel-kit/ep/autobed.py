"""Auto sound bed from word timings: python3 autobed.py <reel dir> [major|minor]"""
import sys, re, json, subprocess
reel = sys.argv[1]; key = sys.argv[2] if len(sys.argv) > 2 else 'minor'; mood = sys.argv[3] if len(sys.argv) > 3 else None
s = open(f"{reel}/assets/data.js").read(); W = json.loads(re.search(r'WORDS = (\[.*?\]);', s, re.S).group(1))
def t(w, n=1):
    k = 0
    for x in W:
        if re.sub(r"[^a-z'-]", '', x[2].lower()).startswith(w):
            k += 1
            if k == n: return x[0]
    return None
fx = [["thunder", 0.1, 0.25], ["elec_chime", 1.2, 0.3]]
for w, name, g in [("stay", "flute2", 0.25), ("as", "ambi_swoosh", 0.25), ("but", "vinyl_rewind", 0.25), ("wait", "vinyl_scratch", 0.4), ("that's", "elec_chime", 0.35), ("comment", "flute2", 0.3)]:
    v = t(w)
    if v is not None: fx.append([name, round(v, 2), g])
v = t("wait")
if v: fx += [["bd_boom", round(v + 2.2, 2), 0.35], ["flute", round(v + 3.0, 2), 0.3]]
quiet = [[round(v - 0.2, 2), round(v + 1.3, 2)]] if v else []
fx += [["bell", 0.05, 0.3], ["shimmer", round((t("that's") or 1) - 0.2, 2), 0.35]]
json.dump({"key": key, "mood": mood, "quiet": quiet, "fx": fx}, open(f"{reel}/docs/bed.json", "w"))
subprocess.run(["python3", "tools/reel-kit/ep/raga_bed.py", reel, f"{reel}/docs/bed.json"], check=True)
