# Next steps (handover for the next Claude session)

Read this first in a new session. The cloud container is wiped between sessions, so the tools
below must be rebuilt; everything else is in this repo.

## Status (31 Oct 2026)

- Day 1 (`reels/day1-gen`) and Day 2 English (`reels/day2`): done. Day 2 Arjuna stills fixed (male warrior).
- Day 2 Tamil (`reels/day2-ta`): built, but the Parler-TTS voice sounded robotic. Re-voice it with IndicF5
  and the temple's own recorded voice, then `python3 tools/build_ta.py` and render.
- Day 3 English (`reels/day3`): composition built and checked (30 s, 9 scenes, Kokoro `af_heart` voice like
  Day 2, PocketSphinx word timings). Kanha wakes at **4 AM**; morning services (confirmed by the temple):
  Suprabhatam, abhishekam, alankaram, then the first aarti.
  - Approved stills: 01-night-temple, 03-suprabhatam, 04-abhishekam, 05-alankaram (also the hook close-up).
    02-bell was rejected (a goddess figure got fused under the bell) and is re-prompted in `tools/gen_stills.sh`.
  - **Still missing: 02-bell, 06-aarti, 07-doors-open, 08-dawn.** The free ZeroGPU quota ran out after five
    pictures. Run `reels/day3/tools/gen_stills.sh` (it skips finished stills), check each picture, then
    `python3 tools/build_composition.py && npm run check && npm run render` from `reels/day3`.
    The local CPU generator build was blocked by this session's permission check; it needs the user's approval.
- Voice recording: received again on 31 Oct and checked (12.6 s, clean, male). It is NOT in git because this
  repo is public: ask the user to upload it again in each new session (`Claude_Voice_Clone.m4a`), then convert
  with `ffmpeg -i <upload> -ac 1 -ar 24000 /home/user/voice-ref/ref-full.wav`.
- **Blocked: the cloned voice (IndicF5).** `ai4bharat/IndicF5` is gated and the `RatGodG` Hugging Face account
  access was granted on 31 Oct and the token was replaced, but the new `HF_TOKEN` only reaches a NEW session:
  start one, check `curl -H "Authorization: Bearer $HF_TOKEN" https://huggingface.co/api/whoami-v2`, then
  download the official model. Ungated mirrors exist but were deliberately not used. Once access works: Day 2 Tamil re-voice, and a Tamil Day 3 if wanted (needs a
  Tamil script).

## Rebuild the tools (about 15 minutes)

```bash
# Instagram voice profile for the ig-* skills
mkdir -p ~/.claude/instagram && cp content/instagram-voice.md ~/.claude/instagram/voice.md

# Local image generator (stable-diffusion.cpp + Z-Image-Turbo, Apache-2.0)
git clone --depth 1 --recurse-submodules --shallow-submodules https://github.com/leejet/stable-diffusion.cpp /home/user/stable-diffusion.cpp
cmake -S /home/user/stable-diffusion.cpp -B /home/user/stable-diffusion.cpp/build -DCMAKE_BUILD_TYPE=Release -DGGML_NATIVE=ON
cmake --build /home/user/stable-diffusion.cpp/build -j4
mkdir -p /home/user/sd-models && cd /home/user/sd-models
curl -sSfLO https://huggingface.co/Comfy-Org/Z-Image-Turbo/resolve/main/split_files/vae/ae.safetensors
curl -sSfL -o qwen3-4b-q4km.gguf https://huggingface.co/unsloth/Qwen3-4B-Instruct-2507-GGUF/resolve/main/Qwen3-4B-Instruct-2507-Q4_K_M.gguf
curl -sSfLO https://huggingface.co/leejet/Z-Image-Turbo-GGUF/resolve/main/z_image_turbo-Q4_K.gguf

# Voice tools (Kokoro for English, PocketSphinx for English word timing)
pip install kokoro-onnx soundfile pocketsphinx gradio_client
mkdir -p /home/user/kokoro && cd /home/user/kokoro
curl -sSfLO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx
curl -sSfLO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin
```

With `HF_TOKEN` set, prefer the fast GPU route for pictures (Hugging Face ZeroGPU Spaces such as
`mcp-tools/Z-Image-Turbo` via `gradio_client`, ~30 s each) over the 12-minute local CPU route, and use
the official gated `ai4bharat/IndicF5` for the Tamil voice.

## Optional: Open Generative AI (user asked for it on 31 Oct)

```bash
git clone --depth 1 https://github.com/anil-matcha/open-generative-ai /home/user/open-generative-ai
cd /home/user/open-generative-ai && npm run setup && npx next dev -p 3000
```

The web version needs a MuAPI key (paid service) for every model. Its free local engine is the same
stable-diffusion.cpp + Z-Image as above, but only inside its desktop (Electron) app.

## Rules learned the hard way

- Check every generated picture for how each figure is dressed and depicted before using it
  (Arjuna came out in a saree-like drape once).
- Never invent temple facts; leave `{{placeholders}}` and ask.
- AI art is labelled "devotional art created digitally" in captions.
