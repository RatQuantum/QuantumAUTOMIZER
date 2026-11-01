# Next steps (handover for the next Claude session)

Read this first in a new session. The cloud container is wiped between sessions, so the tools
below must be rebuilt; everything else is in this repo.

## Status (31 Oct 2026)

**Day 5 format (1 Nov, the user's reference reel): cinematic, narrated, real-looking faces.** The user rejected
the fast slideshow and sent a reference: a moody Kurukshetra scene, deep Tamil narration, one Tamil line on
screen at a time with one word in gold, few cuts, emotional score. `reels/day5-ta` follows it: 4 shots (stills
from ElevenLabs gpt-image-2.5, 9:16 2K), two voices (Bharadwaj narrator + Ramaa as Krishna), a score that turns
at 9 s, wind, impact, chariot. The user chose the FREE route over Kling video (~14,930 credits for 4 clips):
wide shots move with tools/parallax.py (Depth Anything V2 small, ONNX). LivePortrait (cloned to
/home/user/LivePortrait, weights downloaded, venv /home/user/lp-venv) would animate the two faces, but running
it was blocked by the permission check; the user must allow it (see .claude/settings.json) before it can run:
  /home/user/lp-venv/bin/python inference.py -s <face.png> -d assets/examples/driving/d18.mp4 -o <dir> --flag-force-cpu
  (d18 = calm breathing/blink for Arjuna, d9 = gentle closed-mouth smile for Krishna)
Trending audio can only be added in the Instagram app: post day5-tamil-no-music.mp4 and add the sound there.

**Style change (1 Nov): fast cut, music first.** The user's grid showed the narrated AI-art reels at
117-1,206 views while their own real-footage text reels did 33.2K and 10.7K. The old reels opened on a fade
from black (frame-0 brightness 13-15 of 255), held shots 3-6 s and had no music. New rules, built into
`reels/day4-ta-fast/tools/build_fast.py` (copy that folder for every new reel and edit only its CONFIG):
- frame 0 bright and already moving, hook text on screen at frame 0 (it is the thumbnail); no fade-in
- 15-20 s, cuts on the beat every ~1 s (two beats at 128 BPM), zoom punch on every cut
- ElevenLabs Music v2.5 bed: fast mridangam/nadaswaram with the Hare Krishna mahamantra; conch at 0 s
- big Tamil text beats instead of a long narration; petals, golden rays and gold flashes on big moments
- end with a comment ask ("கமெண்ட்டில் கண்ணா") + FOLLOW
- Real temple footage beats AI art by 10-30x on this account: ask the temple for clips every week.

**Direction change (31 Oct): Tamil only from now on.** The temple is in Tamil Nadu, so each reel is made
in Tamil only (no English version). Voice: a high-quality Tamil ElevenLabs library voice picked per video
to suit its mood (male preferred; Day 3 uses "Aarumugam – Expressive Engaging Narrator", voice_id
yrFqUM5ku2rYJCdiBKFU, model eleven_v4, `[softly]` and `[pause]` tags), not the user's own cloned voice.
Write one continuous take with `[pause]` between lines and time the scene cuts to its pauses; get word
timings with ElevenLabs Scribe for the subtitles. Image nodes on ElevenLabs default to 16:9: always set
aspect_ratio 9:16 and resolution 2K before running them.

- Day 4 Tamil (`reels/day4-ta`): done 1 Nov, "why Kanha stole butter" (36.3 s, Aarumugam, 6 ElevenLabs stills).
  Caption in content/captions/day4-ta.txt. Next: Day 5 per content/plan-week-nov2.md.
- Day 3 Tamil (`reels/day3-ta`): done and approved by the user; `python3 tools/build_ta.py`. Script in
  `content/day3/script-ta.txt`.

- Day 1 (`reels/day1-gen`) and Day 2 English (`reels/day2`): done. Day 2 Arjuna stills fixed (male warrior).
- Day 2 Tamil (`reels/day2-ta`): re-voiced on 31 Oct with ElevenLabs "Ramaa - Expert Tamil Book Narrator"
  (voice_id jsxww9ngE2fwXHlkWgkm), one take cut into its seven lines at the pauses, +4.5 dB to match Day 3
  loudness (-17 LUFS), Scribe word timings for the subtitles. Done; `python3 tools/build_ta.py` rebuilds it.
- Viral research (/ig-viral): blocked here. youtube.com is denied by this environment's network policy and
  Instagram needs the user's own logged-in browser (Claude desktop app). Never install scrapers for it.
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
- **Cloned voice (IndicF5): ready for the next session.** `ai4bharat/IndicF5` is gated; the `RatGodG` account's
  access was granted on 31 Oct and the token was replaced, but the new `HF_TOKEN` only reaches a NEW session:
  start one, check `curl -H "Authorization: Bearer $HF_TOKEN" https://huggingface.co/api/whoami-v2`, then
  download the official model. Ungated mirrors exist but were deliberately not used.
  Then: Day 2 Tamil re-voice, and a Tamil Day 3 if wanted (needs a Tamil script).

- ElevenLabs: the user is upgrading to a paid plan (31 Oct). If they create an Instant Voice Clone of their
  own voice in the ElevenLabs app, it appears in `creative_list_voices` and can voice the English and Tamil
  lines (`creative_generate_speech`). Generations spend their credits: confirm before long or video jobs.
- `.claude/settings.json` pre-approves the exact stable-diffusion.cpp clone, build and model download
  commands below, so the local picture generator can be rebuilt without being blocked.

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
