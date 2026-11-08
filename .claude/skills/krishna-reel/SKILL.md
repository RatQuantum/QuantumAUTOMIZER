---
name: krishna-reel
description: Make the next @lordsrikrishnatemple Instagram reel end to end with the house pipeline (brief, reference style guide, shot list, beat grid, HyperFrames build with springs, free voices, the critic loop, render, caption). Use when the user asks for "day N", a new reel, a festival special, or "make a reel about X". Arguments - topic, length, track, reference, e.g. "/krishna-reel Day 15, Gita 4.7, 25s, track ./refs/song.mp3, reference ./refs/frame.png".
---

# /krishna-reel

The decisions live in files, not in the chat, so every reel starts where the last one ended.
Read first: `content/reel-rules.md` (house rules, every one learned from the user's feedback), `content/formats.md`
(rotate formats; log each reel), `content/NEXT-STEPS.md` (state of the project).

## The pipeline

1. **Scaffold**: `tools/reel-kit/new_reel.sh <name> "<title>"` -> `reels/<name>/` with gsap, `springs.js`, fonts, docs/.
2. **Brief** (`docs/brief.md`): one sentence the viewer keeps, format id (different from the last reel), length,
   track, real assets, scripture sources, hard lines, ONE call to action. Never invent scripture or temple facts.
3. **Reference** (optional, recommended): the user's frame or clip ->
   `/home/user/gc-venv/bin/python tools/style_ref.py <ref> reels/<name>/docs` -> fill in `style_guide.md` from
   `ref_sheet.jpg`. Take the grammar, never the subjects.
4. **Shot list** (`docs/shotlist.md`): every beat with what the viewer knows, entry/exit and why it exists.
   **GATE**: for a new format or a special, show brief + shot list to the user before building; for a routine reel
   in an approved format, go straight on.
5. **Track**: if the user supplies the audio file:
   `/home/user/gc-venv/bin/python tools/beats.py song.mp3 --reel-drop <s> --reel-length <s>` -> real bpm, beat grid,
   drop, and the Instagram start time. Cuts and text changes go on beats; big moments on downbeats; NO shakes or
   pulses on every beat (rule 7e). Without a file, do not invent a grid: pace to the voice (rule 7h).
6. **Voices** (free): `tools/free_voice.sh narrator_en|krishna_divine_en|krishna_en "<text, | = pause>" out.wav`
   (it trims silence). Natural pace (rule 7h). Never imitate a real actor or dubbing artist.
7. **Build** (`reels/<name>/tools/build_<name>.py`): follow the newest reel builder (`reels/deepavali-en`,
   `reels/day14-en`): compute every time from `dur()` of the voice files; one sub-composition `scene`;
   `<script src="assets/springs.js">` after gsap and springs per object class: `spring-snap` small UI,
   `spring-settle` panels/cards, `spring-land` headlines, `spring-bounce` characters, `spring-glide` camera.
   Characters are ORIGINAL designs (the recurring Krishna character from Day 14 / Deepavali), never copies of a
   show's or cartoon's characters. Effects: vary them (rule 7f), synthesize what the library lacks with ffmpeg.
8. **Check**: `npm run check` (fix every error), `npx hyperframes snapshot --at ...` on the key moments.
9. **Render**: `npm run render`, then loudnorm to about -15.5 LUFS (-17 with no voice), peak below -1 dBFS.
10. **Critic**: `/home/user/gc-venv/bin/python tools/critic.py reels/<name>/<file>.mp4 --lang en` -> read
    `reviews/contact.jpg`, `phone.jpg`, `strip.jpg`; fill the scores in `reviews/critique.md` honestly from the frames;
    list the 3 worst defects with timestamp + evidence + local fix; patch, re-render, run the critic again until every
    line is 8+. Do not send the reel before that.
11. **Deliver**: caption in `content/captions/`, script in `content/<name>/`, log the reel in `content/formats.md`,
    commit (never the user's face), push, send the MP4 + caption with posting notes (track start time, posting day).

## Overnight / long runs
Work between gates without asking; stop and ask only for a real blocker (a missing real asset, an unclear reference,
a scripture question). One test frame before 900 polished wrong ones.
