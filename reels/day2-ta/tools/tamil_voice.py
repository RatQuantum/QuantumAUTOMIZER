"""Tamil voiceover with AI4Bharat Indic Parler-TTS (Apache-2.0), run locally on the CPU.
Usage: tts-venv/bin/python tamil_voice.py <script.txt> <out_dir> [name ...]
Each script line is "name|text"; the voice comes from the DESCRIPTION below."""
import sys, torch, soundfile as sf
from parler_tts import ParlerTTSForConditionalGeneration
from transformers import AutoTokenizer

MODEL = "/home/user/sd-models/indic-parler-tts"
DESCRIPTION = ("A male speaker with a deep, low-pitched, calm and resonant voice delivers a slow, devotional "
               "narration in Tamil. The recording is very clear and close-up, with no background noise.")
script, out_dir, only = sys.argv[1], sys.argv[2], set(sys.argv[3:])
torch.manual_seed(7)
model = ParlerTTSForConditionalGeneration.from_pretrained(MODEL)
tok = AutoTokenizer.from_pretrained(MODEL)
desc_tok = AutoTokenizer.from_pretrained(model.config.text_encoder._name_or_path)  # flan-t5 tokenizer for the voice description
desc = desc_tok(DESCRIPTION, return_tensors="pt")
for line in open(script, encoding="utf-8"):
    if "|" not in line:
        continue
    name, text = line.rstrip("\n").split("|", 1)
    if only and name not in only:
        continue
    prompt = tok(text, return_tensors="pt")
    audio = model.generate(input_ids=desc.input_ids, attention_mask=desc.attention_mask,
                           prompt_input_ids=prompt.input_ids, prompt_attention_mask=prompt.attention_mask)
    sf.write(f"{out_dir}/{name}.wav", audio.cpu().numpy().squeeze(), model.config.sampling_rate)
    print(name, round(audio.shape[-1] / model.config.sampling_rate, 2), "s")
