# Handoff: moving reel production to the owner's Windows laptop (Nov 23)

Read `CLAUDE.md`, `content/knowledge-base.md` (KB-15 to KB-17 are the newest) and `content/reel-rules.md` first.

## Where things stand
- Days 61-90 and Arjuna's Charioteer Parts 1-5 are delivered. Part 5 scored 100 on the retention brain.
- Next: **Days 91-95 with Blender** (owner's request: "elevate more with blender"), then Part 6 once the owner reports the Part 5 vote (A = ask Krishna why He's smiling, B = run to the fallen giant).
- Rules from the last batch: every shot in the first 3 s must move (push-in or hit); a "but/wait" twist at least every 14 s; water goes through `WATER()` in `tools/reel-kit/ep/storykit.js` (KB-17).
- Krishnaa Clinic: Day 1A/1B done; the real Instagram handle is still unknown (placeholder `@krishnaaclinic`). Build Days 2-7 only when the owner says go. The doctor reviews every clinic script.

## Laptop layout (everything on D:, C: is small)
```
D:\QuantumReels\QuantumAUTOMIZER   <- this repo, branch claude/quirky-euler-qhw92g
D:\QuantumReels\models\kokoro      <- kokoro-v1.0.onnx + voices-v1.0.bin
D:\QuantumReels\venv               <- Python venv
D:\QuantumReels\refs               <- owner's reference videos/songs (NEVER commit)
D:\QuantumReels\.cache             <- npm, temp, Blender temp, Hugging Face cache
```
Environment variables (set once with `setx`): `KOKORO_DIR`, `HF_HOME=D:\QuantumReels\.cache\hf`, `TEMP`/`TMP`.

## Pipeline (unchanged)
- Voice: `python tools/reel-kit/voice_build.py ...` (Kokoro, free). Narrator `am_michael` 1.08 for the temple series.
- Word timings: faster-whisper `medium`.
- Render: `npm run render` inside each `reels/<name>/` (HyperFrames). Finish with loudnorm -14.5 LUFS and a cover at 0.8 s.
- Score: `python -I tools/reel-kit/brain/retention_brain.py <mp4> --ref <ref mp4> --words <words.json>`.
- Blender: owner installs the `ahujasid/blender-mcp` addon; the `blender` MCP tools drive it. Use Blender (Cycles/EEVEE) for hero shots and render image sequences into the reel, keep captions and overlays in HyperFrames.

## Never
Commit mp4s, covers, renders, reference videos or songs, the owner's face or photos. Paste keys in chat. Post anywhere without approval. Use ElevenLabs or clone real voices.
