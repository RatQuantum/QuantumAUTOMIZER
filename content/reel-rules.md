# Reel rules (checklist before every reel is handed to the user)

**From 7 Nov the reels are in ENGLISH (voice and on-screen text), replacing the earlier Tamil-only rule.**

Learned from the grid on 4 Nov 2026: Day 5 = 7,422 views, Day 6 = 160. Real temple footage reel = 33.4K.
Every reel is checked against all of these. If one fails, fix it before rendering.

## The hook (frame 0 to 2 s) — this decides everything
1. **Frame 0 is an EPIC WIDE SHOT you never see in a daily feed** (corrected 5 Nov after checking the actual
   frames): Day 5's frame 0 is a burning battlefield under a blazing red-orange sky, smoke, banners, ONE small lone
   figure kneeling. High contrast, fiery colour, huge scale. NOT a close-up crying face: Day 7 opened on one and
   got 198 views with a 4 s average watch (it reads like a TV-serial still). Faces come later in the reel.
2. **The first line is SHORT (max 2 rows on screen) and warns the viewer about their own future**, in "you"
   form: "ஒரு நாள்… எல்லோரும் உன்னைக் கைவிடுவார்கள்." The viewer stays to learn what happens to them.
   Not a past event, not a long sentence (Day 7: 4 rows about a past humiliation).
3. **Dark and fiery, not dim**: strong orange/red against black. Bright-calm (Day 6) and dim-brown (Day 7) both failed.
   Music, posting time and the AI label were identical on Days 5, 6 and 7, so the opening itself is the difference.

## The arc (Day 5 pattern)
4. Pain (0 to ~8 s) -> a hard TURN on a beat (boom, flash, gold) -> Krishna's PROMISE to the viewer in his own
   voice ("நான் இருக்கிறேன்", "நான் வருவேன்", "கவலைப்படாதே").
5. The promise is one the viewer can send to someone (that is what drove Day 5's reposts and shares).
6. CTA that worked: கமெண்ட்டில் "கிருஷ்ணா" 🙏. Keep it.
7. 15 to 16 s. One Tamil line on screen at a time, one gold word.
7b. **Krishna's promise starts by ~10 s.** Day 5 insights (4 Nov): 7,535 views (typical reel ~1.2K), average
    watch 10 s of 20 s, 115 saves, 50 shares, 28 reposts, 33 follows. The promise is what people save and send,
    but on Day 5 it began at 9.6 s, so about half the viewers left before it. Close up narrator pauses
    (~0.15-0.3 s between lines), turn by ~7.5 s, promise at ~10 s.

7c. **Never resolve the tension early.** Day 6 insights: skip rate 54.8% (BETTER than typical), but average watch
    5 s of 17 s: viewers left right after the reveal at 3 s, never reached the share CTA, and the reel stopped
    at 165 views within hours. Keep the pain/question open until ~7 s; turn at ~7-7.5 s; promise at ~10 s.
7d. Do not post a new reel while the previous one is still climbing (Day 6 went up on 3 Nov while Day 5 was
    still rising; possible overlap, not proven). Check the views-over-time line has flattened first.

7e. **Edit to the beat of the track the user will add** (the user, 6 Nov: "edit the clips to the beats"). Get the
    track's BPM (Beatport / Shazam) and the drop time from the user. Build on a beat grid: B(n) = n * 60/BPM. The
    reel starts on a beat, the drop is beat 8, every CUT and text change lands on a beat.
    **NO punch-in zooms, shakes, pulsing or flashes on every beat** (the user, 6 Nov, on Days 9 and 10: "looks
    frantic", 0/10). Between cuts the picture moves slowly and smoothly; at most ONE accent (a flash) on the drop. Effects with their own rhythm
    (heartbeats, drum rolls) are left out so they cannot fight the track. Tell the user exactly where to start the
    song in Instagram so its drop lands on beat 8. Day 9 track: "ZAKHELO (Slowed)" by Rushex, 71 BPM, drop 0:15
    -> start the song at 0:08.2, drop at 0:06.8 in the reel.

7f. **Sound effects vary** (the user, 6 Nov: "the bell repeating is annoying… all the time bell is saturating").
    No temple bell by default; no single effect more than twice in a reel, and not the same set in consecutive reels.
    Palette (CC0, Sonic Pi samples, already in each reel's assets/sfx): tabla strokes (tabla_ghe*, tabla_na*, tabla_te*,
    tabla_dhec, tabla_tas*, loop_tabla), glass shimmers (ambi_glass_rub, ambi_glass_hum), guit_harmonics, ambi_piano,
    ambi_drone, ambi_lunar_land (huge rising rumble), perc_impact1/2, perc_snap/snap2, perc_swash, perc_swoosh,
    elec_chime (sparingly), ambi_choir (sparingly), misc_cineboom.

7g. **Never rushed** (the user, 7 Nov, on Day 11: "the 3-2-1 countdown was so quick people didn't have time to choose").
    Give every beat of the idea the time a person needs: at least 3-4 s to make a choice, at least 1-1.5 s per countdown
    number, reading time of about 1 s plus 0.3 s per word for every line on screen (never under 2.5 s), and let the
    payoff breathe for 2+ s before the next thing. A longer reel that people can follow beats a short one they cannot.
    The beat grid serves the pacing, not the other way round (use 2 or more beats per step when needed).

7h. **The right pace: neither rushed nor slow** (the user, 8 Nov: "first it was super fast, now it is super slow").
    Voices at natural speed (narrator -3%, Krishna -8% with 0.3 s inner pauses; tools/free_voice.sh trims the ~1 s of
    silence the TTS adds at both ends). Lines follow each other after ~0.35 s; a caption stays while it is spoken plus
    ~0.4 s; story beats get only the time they need (an appearance ~1 s, a reaction ~0.8 s). Compute the schedule from the
    real voice lengths, never from fixed guesses. Most voiced reels land at 22-30 s. Choices (cards) still get 3-4 s.

## What NOT to copy
8. The curtain/door reveal only works with REAL darshan footage (the 33.4K reel). With AI art there is nothing
   the viewer is waiting to see. Do not use reveal-of-a-place hooks with AI.
9. Real temple footage beats AI art 10-30x. Always ask the temple for real clips; AI is for stories that
   cannot be filmed.

## Quality
10. **Voices are FREE from now on** (the user, 7 Nov: "Use free voice instead of ElevenLabs"). Use tools/free_voice.sh:
    Microsoft Edge neural Tamil voices (edge-tts) with a polish chain (slightly deeper, warm EQ, compression, a small
    hall/room) so they are not flat like Day 6's raw take. Roles: narrator (ta-IN-ValluvarNeural or ta-LK-KumarNeural),
    Krishna (ta-MY-SuryaNeural or ta-SG-AnbuNeural); the user picks from content/free-voice-samples.mp3. Many formats
    need no voice at all. Better free option later: IndicF5 (AI4Bharat, open demo Space ai4bharat/IndicF5 works without a
    login) speaks any Tamil text in the voice of a reference recording; it needs a MALE Tamil reference we have the
    right to use (for example the user's own recording). Never clone a real person's voice without their consent.
    **ENGLISH voice from 7 Nov** (the user: "Use English voice, the most popular and widely used English voices"):
    roles narrator_en (default en-US-ChristopherNeural; also GuyNeural, en-GB-RyanNeural, en-IN-PrabhatNeural) and
    krishna_en (default en-US-AndrewMultilingualNeural; also BrianMultilingualNeural). Samples:
    content/free-voice-samples-english.mp3. **On-screen text: ENGLISH** (the user, 7 Nov). Defaults until the
    user picks: narrator en-US-ChristopherNeural, Krishna en-US-AndrewMultilingualNeural. Captions may add one Tamil line.
    "Divine" Krishna style (7 Nov): roles krishna_divine (Tamil) / krishna_divine_en: slower, deeper, soft, a faint
    chorus and a spacious reverb, with long pauses between "|"-separated phrases. It is an ORIGINAL style: never clone or
    imitate a specific actor or dubbing artist (the user asked for the Vijay TV Mahabharatham Krishna voice; declined).
    Samples: content/krishna-divine-voice-samples.mp3.
11. Real-looking AI video with faces (MiniMax H3 / Veo), never stills with zoom.
12. Check every figure: Krishna wears the Vaishnava namam (white U with a red centre line), never Shaiva
    horizontal lines; correct dress for every character; no extra fingers; same Krishna face as earlier reels
    (reference: reels/day6-ta/assets/img/s2-1.png).
13. Google Flow prompts: no deity or character names, no tight face crops (they trigger the
    "third-party content" block). Describe the look instead.
14. Export a no-music version, loudness -15 LUFS, Whisper check that the Tamil matches the script.
15. Label: "devotional art created digitally" in the caption.
16. **No face needed** (the user, 6 Nov: "You don't need my face. Use any art style necessary"). Krishna can be any art
    style: silhouette, painting, gold line art, Tanjore style, AI art. The user's own face is optional, and their photos and
    face clips are NEVER committed (this repo is public).

## Learned 8 Nov (Days 14-17 views "super low"; the user: "Need characters and better audio")
17. **Characters on screen, real-looking.** Code-drawn reels (Days 16-17: cards, a kolam) looked rich but had no person
    to feel for. Every reel needs a CHARACTER in a moment of need (Day 5's pattern): realistic AI clips (Flow / Veo on the
    user's phone, or Wan 2.2 on Hugging Face with PRO quota). Graphics may decorate, never replace, the characters.
18. **Better voices: Chatterbox, not raw edge-tts.** ResembleAI/Chatterbox (Hugging Face Space, via gradio_client from
    the container) gives natural, expressive delivery. Its base timbre comes from our OWN edge-tts reference clips in
    voices/ (no real person's voice). Settings: narrator exaggeration 0.6, cfg 0.45; Krishna 0.5 / 0.35; a whisper 0.75 /
    0.3; then a light polish (EQ, compressor, small room) and loudnorm -16. Whisper-check every line; regenerate with a
    new seed when a word is misheard. Free ZeroGPU quota is about 9 lines a day; HF PRO gives 40 min a day.
19. **Strategy 7: test hooks, don't guess** (the user, 9 Nov, from a reference reel: hooks x middles x CTAs, keep the
    winners, beat the control). Every story ships with 2-3 HOOK versions (same body, same CTA): the control posted
    normally, the others as Instagram Trial reels; after 48 h the lowest skip rate wins and its pattern becomes the next
    default. Full method, hook patterns and the results log: content/strategy-7-hook-testing.md.

## Learned 11 Nov from a reference in our niche ("Why exactly 56 dishes?", a 3D cartoon explainer; studied, not copied)
The user: "This is so well made and this is our niche. But our videos are not good. Why?" Measured: 59.5 s, 24 shots
(one every 2.5 s), loudness -14.2 LUFS with a 1.4 LU range (a constant bed), bright saturated daylight (brightness 0.49,
saturation 0.54, 1% dark). What it does that ours didn't:
20. **Hook = a WHY question about something people see every day + a paradox line.** Big title on screen ("WHY EXACTLY 56
    DISHES?") and a first line that makes no sense yet ("A boy held up a mountain for seven days, and all his mother could
    think about was his lunch."). The ending answers the question. Not a sad warning, not a verse.
21. **Explain a living tradition through the story** (a series: one tradition per episode). People save and share what
    they learned; they scroll past scripture they already know.
22. **Fast and funny.** A new shot every 2-3 s; a quick, warm narrator with modern asides ("Ever come home after a week
    away and your mom cooks everything you missed? Same love."). Reverence comes from the payoff, not from slowness.
23. **Bright daylight 3D world + flat cute characters** (low-poly hills, palms, palaces; pill-bodied stick figures with
    big eyes). Never dark, never dim.
24. **Karaoke captions**: 2-3 bold white words with a thick black outline at ~73% of the height, the key word in yellow,
    changing with every phrase. Big title card for the first ~4 s.
25. **A constant sound bed**: playful music under the whole voice plus a sound for every action (clinks, boings, a record
    scratch on the twist). Target -14 LUFS, small loudness range.
Our implementation: reels/day19-en (three.js world + canvas-drawn cast in HyperFrames; tools/make_audio.py for the bed).
