"""Free local TTS (Kokoro-82M via kokoro-onnx, Apache 2.0): voice.json chunks -> polished wav files."""
import json, sys, soundfile as sf
from kokoro_onnx import Kokoro
K = Kokoro("/home/user/kokoro/kokoro-v1.0.onnx", "/home/user/kokoro/voices-v1.0.bin")
voice, speed, out = sys.argv[1], float(sys.argv[2]), sys.argv[3]
for k, t in json.load(open("docs/script.json")):
    a, sr = K.create(t, voice=voice, speed=speed, lang="en-us")
    sf.write(f"{out}/{k}.wav", a, sr); print(k, round(len(a) / sr, 2))
