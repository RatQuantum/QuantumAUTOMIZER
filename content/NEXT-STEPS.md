# Next steps (handover for the next Claude session)

**READ content/reel-rules.md FIRST and check every reel against it** (Day 6 flopped at 160 views next to
Day 5's 7,422: no face, no pain, a bright calm frame 0, a door reveal copied from real footage).

Read this first in a new session. The cloud container is wiped between sessions, so the tools
below must be rebuilt; everything else is in this repo.

## Day 6 DONE (3 Nov): Kuchela at Dwarka. Next: Day 7

Shots 1-2 free MiniMax H3 on Hugging Face, shot 3 Google Flow (Veo 3.1 via the user's Google AI Pro; the user makes
the clip and uploads it). Flow rules: no deity or character names in the prompt and no tight face crops (they trigger
"interests of third-party content providers"); describe the look instead. Always check Krishna's tilak is the
Vaishnava namam (white U with a red centre line), never Shaiva horizontal lines.

## (old) Day 6 notes, free pipeline

**3 Nov, later: free MiniMax H3 works** (Space `hugging-apps/minimax-h3-flashgen-4step`, anonymous, no token,
~2 clips per day of free quota). v1 and v2 are done and `reels/day6-ta/tools/build_day6.py` builds the reel with
the drop at 3.0 s; shots 3 and 4 are still placeholders. Next: on a fresh quota day make the s3 embrace still
(Qwen-Image-Edit-2511 with s2-1 + s1-1) and v3, then s4 and v4, swap them into SHOTS, re-render, loudnorm, Whisper.
Full details at the end of content/day6/script-ta.txt. The Wan 2.2 notes below are superseded.

Read content/day6/script-ta.txt first. Stills are in reels/day6-ta/assets/img (s1-2 hook, s2-1/s2-2 Krishna runs),
free Edge TTS narration in reels/day6-ta/assets/audio (vo-n1, vo-n2 narrator Valluvar; vo-k1 Krishna Anbu).
ElevenLabs is AUDIO ONLY. Video: Wan 2.2 Space `zerogpu-aoti/wan2-2-fp8da-aoti-faster` through gradio_client
(pip install gradio_client into a venv; pass `token=os.environ["HF_TOKEN"]` to Client; api_name="/generate_video";
args: image, prompt, steps 8, negative prompt, seconds, 1, 1, seed, False). First check the token:
  curl -s -H "Authorization: Bearer $HF_TOKEN" https://huggingface.co/api/whoami-v2   (must show RatGodG)
Free ZeroGPU quota is a few minutes a day. Clips: v1 Kuchela at closed doors (s1-2), v2 Krishna runs (s2-1),
v3 embrace and v4 Krishna eating aval (make stills with the free HF image Spaces, e.g. FLUX.1-Kontext-Dev
editing s2-1 so Krishna's face stays the same). Then build like reels/day5-ta (tools/build_day5.py): shot 1
pulled off to the RIGHT at 3.0 s on the drop, flash and boom, text lines from the script, CTA to send to a friend,
render with and without music, loudnorm -15 LUFS, Whisper check.

**RULE (3 Nov): ElevenLabs is for AUDIO ONLY (voice, music, SFX). Never use it for images or video.**

## Free Tamil voice (3 Nov 2026): Edge TTS via MoneyPrinterTurbo

**The user rejected the Edge TTS voice on Day 6 (flat next to Day 5). Use ElevenLabs eleven_v4 voices (Bharadwaj
narrator, Ramaa Krishna) for every reel; short reels cost only ~100-150 credits of voice. Edge TTS is a last resort.**

The user allowed `speech.platform.bing.com`. MoneyPrinterTurbo (github.com/harry0703/MoneyPrinterTurbo) is cloned
to /home/user/MoneyPrinterTurbo with a venv at /home/user/mpt-venv (`pip install -r requirements.txt`). Its
stock footage (Pexels) has no Krishna or temple content, so only its free edge-tts voice is used. edge-tts ignores
the proxy env, so run:
  SSL_CERT_FILE=/root/.ccr/ca-bundle.crt /home/user/mpt-venv/bin/edge-tts --proxy "$HTTPS_PROXY" \
    --voice ta-IN-ValluvarNeural --rate=-15% --pitch=-8Hz --text "..." --write-media out.mp3
Male Tamil voices: ta-IN-ValluvarNeural, ta-LK-KumarNeural, ta-MY-SuryaNeural, ta-SG-AnbuNeural (all transcribe
cleanly with Whisper). No emotion tags, so it is flatter than ElevenLabs eleven_v4 but costs nothing.

## Best reel on the page (3 Nov 2026): real temple footage, curtain reveal on the beat

33.3K views, 5,420 likes (about 16% of views), 15 comments, 25 reposts. The user filmed it and edited it:
- **Real footage** from the temple sanctum. Nothing AI-made.
- **The hook is a closed white curtain (thirai).** The viewer waits to see what is behind it.
- **The curtain is pulled to the right exactly on the music drop**, revealing Sri Krishna in full alankaram,
  the aarti flame, and the priests mid-aarti. The payoff lands on the beat.
- **One hopeful line on screen** in English capitals: "BELIEVE ME HE CAN FLIP THE SCRIPT OVERNIGHT"
  (the second half in gold). Audio was original (the user's own sound with music).
Lesson: real darshan footage with a built-in reveal beats AI art. Ask the temple for more reveal moments
(curtain opening before darshan, alankaram, abhishekam, lamp lighting, deepa aradhanai). Use AI video only for
stories (Kurukshetra and so on) that cannot be filmed. When editing the user's footage, put the reveal on a
known beat time and tell the user where the drop must land when they pick the in-app track segment.
Note: this text was English. Tamil-only is the narration rule; test English vs Tamil on-screen text.

## What works (3 Nov 2026): Day 5 is the template

Day 5 (Kurukshetra, "அன்று… உன் தேரை நான் ஓட்டுவேன்") reached 2.6K views, 203 likes, 5 comments,
10 reposts and 15 shares. Earlier slideshow reels were skipped. The user credits two things:
1. **Real-looking AI video with faces** (MiniMax H3 from 9:16 stills), not parallax or animated stills.
2. **A phonk track added in the Instagram app**: "FUNK POWER (Ultra Slowed)" by yatashi and LLOYDS PH, over the
   no-music export with the Tamil narration on top.
Keep for Day 6 onwards: one emotional "Krishna speaks to you" line arc, a dark-to-light turn mid-reel, 4 MiniMax
clips (~7,300 credits), Tamil narration plus CC0 SFX, a bright first frame, and always export a no-music version
so the user can lay a trending phonk or slowed track in the app. Repeat what drew reposts and shares: a
promise from Krishna the viewer can send to someone.

## Status (31 Oct 2026)

**Video model chosen (2 Nov): MiniMax H3** (the user compared it against Veo 3.1 Lite and preferred MiniMax).
Use it for real AI video clips from our stills: ElevenLabs model `minimax-h3`, `resolution: 768p`,
`duration_secs` 5-6, and NO `aspect_ratio` (it follows the 9:16 still). About 1,818 credits per 5 s clip.
Price check (2 Nov, one ~5 s clip): Veo 3.1 Lite 1,091 · LTX 2 Fast 1,454 · MiniMax H3 1,818 ·
Kling 2.5 Turbo 2,121 · MiniMax H3 Max 2,424 · Wan 2.6 3,030 · Kling 3.0 Pro 3,393 · Seedance 2 Fast 7,332.
**Day 5 done (2 Nov) with the MiniMax H3 clips** (`elevenlabsusercontent.com` now downloads fine). Source
generations on flow NHhr5sLty3TT2iJmcwTD: v1 SeYDkahriM9Hv23eJUJq, v2 bYemJYR80uyQtbjbbsd7, v3 LE4ElOcBUodbpszekrdz,
v4 jcgyaOzRdiibBs5EEBgU. Processing (768x1344 24fps -> 1080x1920 30fps, `scale=-2:1920:flags=lanczos,crop=1080:1920`):
v1 from 0.4 s for 5.3 s; v2 from 1.45 s for 3.72 s (tear + gaze lift); v3 from 0.3 s for 4.82 s;
v4 whole clip slowed `setpts=PTS*1.24,minterpolate=fps=30:mi_mode=mci:mc_mode=aobmc` (6.33 s).
Renders: day5-tamil.mp4 and day5-tamil-no-music.mp4, loudnorm -15 LUFS, Whisper transcript matches the script.
Next reels: same pipeline (stills -> MiniMax H3 start_frame clips, no aspect_ratio).

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
LivePortrait now runs (permission rule in .claude/settings.json). Lessons: most driving templates TALK, so use
--animation-region eyes (blinks, gaze) and, for a head tilt, a second pass with the first output as the
source and --animation-region pose. Trim drivers to the shot length (2K on CPU: ~6 s per frame). Stretch
with ffmpeg setpts + minterpolate for slow motion. Real CC0 effects: /home/user/sonic-pi/etc/samples
(git sparse clone of sonic-pi-net/sonic-pi), credits in reels/day5-ta/assets/sfx/CREDITS.md. Openverse and
the HF datasets server are blocked here. After rendering, loudnorm the mp4 to -15 LUFS (video copied).

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
