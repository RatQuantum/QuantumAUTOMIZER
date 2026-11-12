"""Kokoro voice for a reel: docs/script.json -> assets/audio/voice.wav + words.json + data.js (word timings)."""
import json, subprocess, sys, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
from faster_whisper import WhisperModel
reel, voice, speed, prompt = sys.argv[1], sys.argv[2], float(sys.argv[3]), sys.argv[4]
A = f"{reel}/assets/audio"
K = Kokoro("/home/user/kokoro/kokoro-v1.0.onnx", "/home/user/kokoro/voices-v1.0.bin")
FX = "highpass=f=65,equalizer=f=140:t=q:w=1:g=2,equalizer=f=3200:t=q:w=1.2:g=1.5,acompressor=threshold=-20dB:ratio=3:attack=6:release=120:makeup=2,aecho=0.85:0.4:40|90:0.1|0.05,silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse"
parts = []
for k, t in json.load(open(f"{reel}/docs/script.json")):
    a, sr = K.create(t, voice=voice, speed=speed, lang="en-us"); sf.write(f"{A}/kk_{k}.wav", a, sr)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"{A}/kk_{k}.wav", "-af", f"{FX},aresample=48000", "-ac", "1", f"{A}/p_{k}.wav"], check=True); parts.append(f"{A}/p_{k}.wav")
inputs = sum([["-i", p] for p in parts], [])
n = len(parts); fc = "".join(f"[{i}]apad=pad_dur=0.3[a{i}];" for i in range(n - 1)) + f"[{n-1}]anull[a{n-1}];" + "".join(f"[a{i}]" for i in range(n)) + f"concat=n={n}:v=0:a=1,adelay=300|300,loudnorm=I=-16:TP=-1.5:LRA=7"
subprocess.run(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", fc, "-ar", "48000", f"{A}/voice.wav"], check=True)
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
open(f"{reel}/assets/data.js", "w").write(f"// generated: word timings (faster-whisper) of assets/audio/voice.wav\nexport const VOICE_DUR = {round(d, 3)};\nexport const DURATION = {round(d + 0.6, 2)};\nexport const WORDS = {json.dumps(W)};\n")
print(reel, round(d, 2), "s,", len(W), "words"); print(" ".join(w[2] for w in W))
