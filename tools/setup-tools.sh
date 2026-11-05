#!/bin/bash
# Reinstall the reel-making toolbox in a fresh cloud container (the container is wiped between sessions).
#   bash tools/setup-tools.sh            (about 20-30 min; ~15 GB of disk, mostly two copies of torch)
# Skills (remotion-*, impeccable, hyperframes, ig-*) live in .claude/skills and MCP servers in .mcp.json:
# both come with the repo and need no install.
# Blocked hosts in this environment: download.blender.org, download.pytorch.org, impeccable.style,
# youtube.com. That is why Blender comes from apt and torch from PyPI.
set -x

# Python tools: yt-dlp, faster-whisper (Whisper checks), gradio_client (free Hugging Face Spaces)
python3 -m venv /home/user/gc-venv
/home/user/gc-venv/bin/pip -q install -U yt-dlp faster-whisper gradio_client pillow

# JavaScript libraries: GSAP, three.js, Remotion (CLI + renderer), Chrome DevTools MCP
mkdir -p /home/user/js-libs && cd /home/user/js-libs && npm init -y >/dev/null && \
  npm i -s gsap three remotion @remotion/cli @remotion/renderer chrome-devtools-mcp@1.12.0

# Blender 4.0.2 + MCP for Blender add-on (runs on a virtual screen, see tools/blender_mcp_headless.py)
DEBIAN_FRONTEND=noninteractive apt-get install -y -qq --no-install-recommends blender python3-requests xvfb xauth
mkdir -p ~/.config/blender/4.0/scripts/addons
curl -sSfL -o ~/.config/blender/4.0/scripts/addons/blender_mcp.py \
  https://raw.githubusercontent.com/ahujasid/mcp-for-blender/main/addon.py
#   start it:  xvfb-run -a blender --python tools/blender_mcp_headless.py &

# ComfyUI (CPU only here: slow, use it for small image jobs)
[ -d /home/user/ComfyUI ] || git clone -q --depth 1 https://github.com/Comfy-Org/ComfyUI /home/user/ComfyUI
python3 -m venv /home/user/comfy-venv
/home/user/comfy-venv/bin/pip -q install torch torchvision torchaudio
/home/user/comfy-venv/bin/pip -q install -r /home/user/ComfyUI/requirements.txt
#   start it:  /home/user/comfy-venv/bin/python /home/user/ComfyUI/main.py --cpu --listen 127.0.0.1 --port 8188

# Chatterbox TTS (Resemble AI). NOTE: no Tamil (23 languages incl. Hindi and English); Tamil stays on ElevenLabs.
python3 -m venv /home/user/tts-venv
/home/user/tts-venv/bin/pip -q install chatterbox-tts

# Open Generative AI (anil-matcha/open-generative-ai): web studio on port 3000. Every model in the web version runs
# through MuAPI (a paid API key); its free local engines (sd.cpp, Wan2GP) exist only in the Electron desktop app.
[ -d /home/user/open-generative-ai ] || git clone -q --depth 1 https://github.com/anil-matcha/open-generative-ai /home/user/open-generative-ai
(cd /home/user/open-generative-ai && npm run setup)
#   start it:  cd /home/user/open-generative-ai && npx next dev -p 3000   (opens at /studio)

# FFmpeg is preinstalled (/usr/bin/ffmpeg). HyperFrames runs through npx (pinned in each reel's package.json).
echo ALLDONE
