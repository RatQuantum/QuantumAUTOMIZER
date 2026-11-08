"""Measure a music track so a reel can be cut to its REAL beats (not a tempo copied from a website).

  /home/user/gc-venv/bin/python tools/beats.py song.mp3 [--reel-drop 6.8] > beats.json

Prints JSON: bpm, beat times, downbeats (every 4th beat, aligned to the strongest phase), hits (strong onsets),
the drop (the biggest jump in loudness after a quiet stretch) and, with --reel-drop, where to start the song in the
Instagram music picker so its drop lands at that second of the reel, plus the beat grid inside the reel.
The track itself is only analysed; it is never mixed into the export (the user adds it in Instagram).
"""
import argparse
import json

import librosa
import numpy as np


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("audio")
    ap.add_argument("--reel-drop", type=float, default=None, help="second of the reel where the drop should land")
    ap.add_argument("--reel-length", type=float, default=30.0)
    a = ap.parse_args()

    y, sr = librosa.load(a.audio, sr=22050, mono=True)
    duration = len(y) / sr
    HOP = 128   # 5.8 ms steps (the default 23 ms rounds a 0.5 s beat to 0.511 s)
    onset = librosa.onset.onset_strength(y=y, sr=sr, hop_length=HOP)
    tempo, beat_frames = librosa.beat.beat_track(onset_envelope=onset, sr=sr, hop_length=HOP, units="frames", tightness=400)
    beats = librosa.frames_to_time(beat_frames, sr=sr, hop_length=HOP)
    # tempo from a straight-line fit through all the beat times (beat k at t0 + k * period)
    if len(beats) > 4:
        k = np.arange(len(beats))
        period, t0 = np.polyfit(k, beats, 1)
        bpm = 60.0 / period
    else:
        bpm = float(np.atleast_1d(tempo)[0])

    # downbeats: the phase (0-3) whose beats carry the most onset energy
    strength = onset[beat_frames] if len(beat_frames) else np.array([])
    phase = int(np.argmax([strength[p::4].sum() for p in range(4)])) if len(strength) >= 8 else 0
    downbeats = beats[phase::4]

    # hits: the strongest onsets (top 10 %), at least 0.25 s apart
    on_frames = librosa.onset.onset_detect(onset_envelope=onset, sr=sr, hop_length=HOP, units="frames")
    on_times = librosa.frames_to_time(on_frames, sr=sr, hop_length=HOP)
    on_vals = onset[on_frames] if len(on_frames) else np.array([])
    hits = []
    if len(on_vals):
        thr = np.quantile(on_vals, 0.9)
        for t, v in zip(on_times, on_vals):
            if v >= thr and (not hits or t - hits[-1] > 0.25):
                hits.append(float(t))

    # drop: scan every 20 ms for the biggest rise in loudness (next 1.5 s vs previous 3 s) after the first 3 s,
    # then place it where the loudness crosses halfway between the two levels, then snap to a beat if one is close
    hop = 441
    rms = librosa.feature.rms(y=y, frame_length=1024, hop_length=hop)[0]
    rt = librosa.frames_to_time(np.arange(len(rms)), sr=sr, hop_length=hop)
    c = np.concatenate([[0.0], np.cumsum(rms)])

    def mean_idx(i0, i1):
        i0, i1 = max(i0, 0), min(i1, len(rms))
        return (c[i1] - c[i0]) / max(i1 - i0, 1)
    fps = sr / hop
    best, drop = 0.0, None
    for i in range(int(3 * fps), len(rms) - int(1.5 * fps), 1):
        rise = mean_idx(i, i + int(1.5 * fps)) / (mean_idx(i - int(3 * fps), i) + 1e-6)
        if rise > best:
            best, bi = rise, i
    if best > 0:
        lo, hi = mean_idx(bi - int(3 * fps), bi), mean_idx(bi, bi + int(1.5 * fps))
        mid = (lo + hi) / 2
        j = bi - int(0.5 * fps)
        while j < bi + int(1.0 * fps) and rms[j] < mid:
            j += 1
        drop = float(rt[j])
        if len(beats):
            nb = float(beats[np.argmin(np.abs(beats - drop))])
            if abs(nb - drop) <= 0.15 * 60 / bpm:
                drop = nb
    # the full beat grid: the fitted line extended over the whole song (quiet intros often have no tracked beats);
    # bars (downbeats) are aligned so the drop is a downbeat, as in most phonk and trap drops
    period = 60.0 / bpm
    anchor = drop if drop is not None else (float(beats[0]) if len(beats) else 0.0)
    first = anchor - period * np.floor(anchor / period)
    grid = np.arange(first, duration, period)
    if drop is not None:
        di = int(np.argmin(np.abs(grid - drop)))
        downbeats = grid[di % 4::4]
    beats = grid
    out = {"file": a.audio, "duration": round(duration, 2), "bpm": round(bpm, 2), "beat": round(60 / bpm, 4),
           "drop": round(drop, 3) if drop else None, "drop_strength": round(best, 2),
           "beats": [round(float(t), 3) for t in beats], "downbeats": [round(float(t), 3) for t in downbeats],
           "hits": [round(t, 3) for t in hits]}
    if a.reel_drop is not None and drop:
        start = drop - a.reel_drop
        out["instagram_start"] = round(start, 2)
        out["reel_beats"] = [round(float(t - start), 3) for t in beats if 0 <= t - start <= a.reel_length]
        out["reel_downbeats"] = [round(float(t - start), 3) for t in downbeats if 0 <= t - start <= a.reel_length]
        out["reel_hits"] = [round(t - start, 3) for t in hits if 0 <= t - start <= a.reel_length]
        if start < 0:
            out["warning"] = "the drop comes too early in the song for that reel time: put the drop later in the reel"
    print(json.dumps(out, indent=1))


if __name__ == "__main__":
    main()
