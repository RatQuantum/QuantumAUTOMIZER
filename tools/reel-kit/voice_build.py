"""Kokoro voice for a reel: docs/script.json -> assets/audio/voice.wav + words.json + data.js (word timings)."""
import json, os, subprocess, sys, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
from faster_whisper import WhisperModel
reel, voice, speed, prompt = sys.argv[1], sys.argv[2], float(sys.argv[3]), sys.argv[4]
A = f"{reel}/assets/audio"
K = Kokoro("/home/user/kokoro/kokoro-v1.0.onnx", "/home/user/kokoro/voices-v1.0.bin")
TIGHT = os.environ.get("TIGHT") == "1"
FX = "highpass=f=65,equalizer=f=140:t=q:w=1:g=2,equalizer=f=3200:t=q:w=1.2:g=1.5,acompressor=threshold=-20dB:ratio=3:attack=6:release=120:makeup=2,aecho=0.85:0.4:40|90:0.1|0.05,silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse"
# KB-9 acted read (free): an optional 3rd item per line sets its mood -> (speed x, pause after s, gain dB)
MOOD = {"shout": (1.12, 0.08, 3), "pant": (1.05, 0.15, 0), "awe": (0.9, 0.42, 0), "whisper": (0.93, 0.3, -5), "urgent": (1.12, 0.06, 1.5), "warm": (0.97, 0.2, 0), "calm": (0.94, 0.3, -1), "punch": (1.0, 0.5, 2)}
parts = []; pauses = []
for row in json.load(open(f"{reel}/docs/script.json")):
    k, t = row[0], row[1]; sx, pz, gn = MOOD.get(row[2] if len(row) > 2 else "", (1.0, None, 0)); pz = row[5] if len(row) > 5 else pz; pauses.append(pz)
    vv = row[3] if len(row) > 3 else voice; vs = row[4] if len(row) > 4 else speed   # per-line voice (multi-speaker POV series)
    a, sr = K.create(t, voice=vv, speed=vs * sx, lang="en-us"); sf.write(f"{A}/kk_{k}.wav", a * (10 ** (gn / 20)), sr)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"{A}/kk_{k}.wav", "-af", f"{FX}{',silenceremove=stop_periods=-1:stop_duration=0.18:stop_threshold=-42dB,atempo=1.05' if TIGHT else ''},aresample=48000", "-ac", "1", f"{A}/p_{k}.wav"], check=True); parts.append(f"{A}/p_{k}.wav")
inputs = sum([["-i", p] for p in parts], [])
n = len(parts); fc = "".join(f"[{i}]apad=pad_dur={pauses[i] if pauses[i] is not None else (0.12 if TIGHT else 0.3)}[a{i}];" for i in range(n - 1)) + f"[{n-1}]anull[a{n-1}];" + "".join(f"[a{i}]" for i in range(n)) + f"concat=n={n}:v=0:a=1,adelay={60 if TIGHT else 300}|{60 if TIGHT else 300},loudnorm=I=-16:TP=-1.5:LRA=7"
subprocess.run(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", fc, "-ar", "48000", f"{A}/voice.wav"], check=True)
import soundfile as _sf
_rows = json.load(open(f"{reel}/docs/script.json")); _t = (0.06 if TIGHT else 0.3); _L = []
for i, pth in enumerate(parts):
    _d = _sf.info(pth).duration; _L.append([round(_t, 3), round(_t + _d, 3), _rows[i][0], _rows[i][3] if len(_rows[i]) > 3 else voice]); _t += _d + (pauses[i] if pauses[i] is not None else (0.12 if TIGHT else 0.3)) * (i < len(parts) - 1)
json.dump(_L, open(f"{A}/lines.json", "w"))   # speaker timeline: [start, end, line id, voice]
subprocess.run(["bash", "-c", f"rm -f {A}/p_*.wav {A}/kk_*.wav"])
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", f"{A}/voice.wav", "-ac", "1", "-ar", "16000", "-f", "f32le", "-"], capture_output=True, check=True).stdout
m = WhisperModel("medium", device="cpu", compute_type="int8")
segs, _ = m.transcribe(np.frombuffer(raw, np.float32), language="en", beam_size=5, word_timestamps=True, initial_prompt=prompt)
W = []
for s in segs:
    for w in s.words:
        t = w.word.strip()
        if t.startswith("-") and W: W[-1][1] = round(w.end, 3); W[-1][2] += t
        else: W.append([round(w.start, 3), round(w.end, 3), t])
json.dump(W, open(f"{A}/words.json", "w"))
d = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f"{A}/voice.wav"], capture_output=True, text=True).stdout)
open(f"{reel}/assets/data.js", "w").write(f"// generated: word timings (faster-whisper) of assets/audio/voice.wav\nexport const VOICE_DUR = {round(d, 3)};\nexport const DURATION = {round(d + (0.4 if TIGHT else 0.6), 2)};\nexport const WORDS = {json.dumps(W)};\n")
print(reel, round(d, 2), "s,", len(W), "words"); print(" ".join(w[2] for w in W))
