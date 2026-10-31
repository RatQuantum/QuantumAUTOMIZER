"""Voice every script line with Kokoro-82M (Apache-2.0), voice af_heart, as in Day 2.
Usage (from assets/vo): python3 speak.py script.txt
SAY respells the Sanskrit words so the English voice says them right; the subtitles keep script.txt."""
import sys
import soundfile as sf
from kokoro_onnx import Kokoro

SAY = {"Kanha": "Kaanhaa", "Suprabhatam": "Suprabaatum", "Abhishekam": "Uh-bee-shay-kum",
       "Alankaram": "Ullun-kaa-rum", "AM": "A M"}
kokoro = Kokoro("/home/user/kokoro/kokoro-v1.0.onnx", "/home/user/kokoro/voices-v1.0.bin")
for line in open(sys.argv[1]):
    name, text = line.rstrip("\n").split("|", 1)
    for word, said in SAY.items():
        text = text.replace(word, said)
    audio, sr = kokoro.create(text, voice="af_heart", speed=0.9, lang="en-us")
    sf.write(f"{name}.wav", audio, sr)
    print(name, round(len(audio) / sr, 2), "s", text)
