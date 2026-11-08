"""The critic: judge a rendered reel from its frames and sound, not from what was meant.

  /home/user/gc-venv/bin/python tools/critic.py reels/day14-en/day14-english-no-music.mp4 [--lang en|ta] [--no-whisper]

Writes <reel>/reviews/:
  contact.jpg   2 frames per second, 6 across          (the whole film at a glance)
  phone.jpg     1 frame per second at 360 px wide      (can a phone viewer read it?)
  strip.jpg     12 consecutive frames around the fastest motion (does it ease, stutter or jump?)
  critique.md   measured facts + automatic flags + the scoring rubric to fill in
Automatic flags come from the house rules (content/reel-rules.md): dead stretches, frantic motion, pace of speech,
long silences, loudness, repeated sound effects, bells. Then: score 1-10 on each rubric line, list the 3 worst
defects with timestamp + evidence + local fix, patch, re-render, run the critic again until every score is 8+.
"""
import argparse
import collections
import json
import os
import re
import subprocess
import sys

import numpy as np


def sh(*cmd, text=True):
    return subprocess.run(cmd, capture_output=True, text=text, check=True).stdout


def probe_duration(f):
    return float(sh("ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f))


def loudness(f):
    out = subprocess.run(["ffmpeg", "-i", f, "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True).stderr
    i = re.findall(r"I:\s+(-?[\d.]+) LUFS", out)
    p = re.findall(r"Peak:\s+(-?[\d.]+) dBFS", out)
    return (float(i[-1]) if i else None), (float(p[-1]) if p else None)


def motion_signal(f, fps=10):
    """Mean absolute difference between consecutive small greyscale frames (0-255), one value per frame."""
    w, h = 108, 192
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", f, "-vf", f"fps={fps},scale={w}:{h},format=gray", "-f", "rawvideo", "-"],
                         capture_output=True, check=True).stdout
    frames = np.frombuffer(raw, np.uint8).reshape(-1, h, w).astype(np.float32)
    diff = np.abs(np.diff(frames, axis=0)).mean(axis=(1, 2))
    bright = frames.mean(axis=(1, 2))
    return diff, bright, fps


def sheets(f, outdir, dur):
    os.makedirs(outdir, exist_ok=True)
    n = int(dur * 2)
    rows = (n + 5) // 6
    sh("ffmpeg", "-v", "error", "-y", "-i", f, "-vf", f"fps=2,scale=180:-1,drawtext=text='%{{pts\\:hms}}':x=4:y=4:fontsize=14:fontcolor=white:box=1:boxcolor=black@0.6,tile=6x{rows}",
       "-frames:v", "1", os.path.join(outdir, "contact.jpg"))
    n1 = int(dur)
    rows1 = (n1 + 5) // 6
    sh("ffmpeg", "-v", "error", "-y", "-i", f, "-vf", f"fps=1,scale=360:-1,tile=6x{rows1}", "-frames:v", "1", os.path.join(outdir, "phone.jpg"))


def strip(f, outdir, t):
    t0 = max(t - 0.2, 0)
    sh("ffmpeg", "-v", "error", "-y", "-ss", f"{t0:.2f}", "-i", f, "-vf", "scale=180:-1,tile=12x1", "-frames:v", "1", os.path.join(outdir, "strip.jpg"))


def whisper(f, lang):
    py = "/home/user/gc-venv/bin/python"
    code = (
        "import sys,json,subprocess,numpy as np\n"
        "from faster_whisper import WhisperModel\n"
        "raw=subprocess.run(['ffmpeg','-v','error','-i',sys.argv[1],'-ac','1','-ar','16000','-f','f32le','-'],capture_output=True,check=True).stdout\n"
        "a=np.frombuffer(raw,np.float32)\n"
        "m=WhisperModel('medium',device='cpu',compute_type='int8')\n"
        "segs,_=m.transcribe(a,language=sys.argv[2],beam_size=5,word_timestamps=True)\n"
        "out=[{'start':s.start,'end':s.end,'text':s.text.strip(),'words':[[w.start,w.end,w.word] for w in (s.words or [])]} for s in segs]\n"
        "print(json.dumps(out))\n")
    env = dict(os.environ, HF_HUB_OFFLINE="1")
    res = subprocess.run([py, "-I", "-c", code, f, lang], capture_output=True, text=True, env=env)
    if res.returncode != 0:
        return None, res.stderr[-400:]
    return json.loads(res.stdout.strip().splitlines()[-1]), None


def sfx_counts(reel_dir):
    idx = os.path.join(reel_dir, "index.html")
    if not os.path.exists(idx):
        return {}
    srcs = re.findall(r'<audio[^>]+src="([^"]+)"', open(idx, encoding="utf-8").read())
    return collections.Counter(os.path.basename(s) for s in srcs if "/sfx/" in s)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("video")
    ap.add_argument("--lang", default="en")
    ap.add_argument("--no-whisper", action="store_true")
    a = ap.parse_args()
    reel_dir = os.path.dirname(os.path.abspath(a.video))
    outdir = os.path.join(reel_dir, "reviews")
    dur = probe_duration(a.video)
    sheets(a.video, outdir, dur)
    diff, bright, fps = motion_signal(a.video)
    t_fast = (int(np.argmax(diff)) + 1) / fps
    strip(a.video, outdir, t_fast)
    lufs, peak = loudness(a.video)

    flags = []
    # dead stretches: almost nothing changes on screen for more than 4 s
    still = diff < 0.35
    run = 0
    for k, s in enumerate(still):
        run = run + 1 if s else 0
        if run == int(4 * fps):
            flags.append(f"DEAD: nothing changes on screen for 4+ s around {(k - run + 1) / fps:.1f}-{(k + 1) / fps:.1f} s")
    # frantic: many sharp spikes per second over a 3 s window (the beat-shake problem)
    spikes = (diff[1:-1] > diff[:-2]) & (diff[1:-1] > diff[2:]) & (diff[1:-1] > max(4.0, np.percentile(diff, 90)))
    st = np.where(spikes)[0] / fps
    for t in np.arange(0, dur, 1.0):
        if ((st >= t) & (st < t + 3)).sum() >= 6:
            flags.append(f"FRANTIC: {int(((st >= t) & (st < t + 3)).sum())} motion spikes in 3 s at {t:.0f}-{t + 3:.0f} s (shakes/pulses on every beat?)")
            break
    # first frame
    if bright[0] < 25:
        flags.append(f"HOOK: frame 0 is very dark (mean brightness {bright[0]:.0f}/255): is there something to see in the first second?")
    # loudness
    if lufs is not None and not (-17.5 <= lufs <= -13.5):
        flags.append(f"LOUDNESS: {lufs} LUFS (target about -15.5, or -17 when there is no voice)")
    if peak is not None and peak > -1.0:
        flags.append(f"PEAK: {peak} dBFS (keep below -1)")
    # sound effects
    sfx = sfx_counts(reel_dir)
    for name, n in sfx.items():
        if "bell" in name:
            flags.append(f"BELL: {name} used ({n}x): bells are not a default (rule 7f)")
        elif n > 2 and name not in ("elec_tick.wav",):
            flags.append(f"REPEAT: {name} used {n}x (max 2 per reel, rule 7f)")
    # speech pace and silences
    speech = None
    if not a.no_whisper:
        speech, err = whisper(a.video, a.lang)
        if err:
            flags.append("WHISPER failed: " + err.strip().splitlines()[-1])
    pace_lines = []
    if speech:
        words = [w for s in speech for w in s["words"]]
        if words:
            spoken = sum(w[1] - w[0] for w in words)
            for s in speech:
                n = len(s["words"]) or len(s["text"].split())
                d = max(s["end"] - s["start"], 0.1)
                pace_lines.append(f"| {s['start']:.1f}-{s['end']:.1f} | {n / d:.1f} w/s | {s['text']} |")
            gaps = [(words[k][1], words[k + 1][0]) for k in range(len(words) - 1) if words[k + 1][0] - words[k][1] > 2.5]
            for g0, g1 in gaps:
                flags.append(f"SILENCE: no voice for {g1 - g0:.1f} s ({g0:.1f}-{g1:.1f} s): is the picture carrying it, or is it slow?")
            wps = len(words) / max(spoken, 0.1)
            if wps > 3.4:
                flags.append(f"FAST: speech at {wps:.1f} words per spoken second (comfortable 2.0-3.2)")
            if wps < 1.8:
                flags.append(f"SLOW: speech at {wps:.1f} words per spoken second (comfortable 2.0-3.2)")
            if words[-1][1] < dur - 4:
                flags.append(f"TAIL: the last word ends at {words[-1][1]:.1f} s but the reel runs to {dur:.1f} s")

    md = [f"# Critique: {os.path.basename(a.video)}", "",
          f"- duration **{dur:.1f} s**, loudness **{lufs} LUFS**, peak **{peak} dBFS**",
          f"- fastest motion at **{t_fast:.1f} s** (strip.jpg), mean motion {diff.mean():.2f}, frame-0 brightness {bright[0]:.0f}/255",
          f"- sound effects: {', '.join(f'{k} x{v}' for k, v in sorted(sfx.items())) or 'none found'}", "",
          "## Automatic flags", ""] + ([f"- {x}" for x in flags] or ["- none"]) + [""]
    if pace_lines:
        md += ["## Speech (Whisper)", "", "| time | pace | heard |", "|---|---|---|"] + pace_lines + [""]
    md += ["## Score from the frames (fill in; every line must reach 8 before the reel goes to the user)", "",
           "| | score | evidence |", "|---|---|---|",
           "| Hook in the first 2 s (frame 0 = thumbnail) | | |",
           "| Phone readability (phone.jpg) | | |",
           "| Motion: eases, no jumps, no frantic shakes (strip.jpg) | | |",
           "| Variety: something new every 2-4 s, no dead stretch | | |",
           "| Pace: neither rushed nor slow (rule 7h) | | |",
           "| Sound: voice clear, effects varied, sync with the picture | | |",
           "| Accuracy: scripture, iconography (namam, dress), spelling | | |", "",
           "## The 3 worst defects (timestamp, evidence, local fix)", "", "1. ", "2. ", "3. ", ""]
    open(os.path.join(outdir, "critique.md"), "w").write("\n".join(md))
    print("\n".join(md))
    print(f"\nreviews written to {outdir}", file=sys.stderr)


if __name__ == "__main__":
    main()
