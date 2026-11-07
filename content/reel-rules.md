# Reel rules (checklist before every reel is handed to the user)

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

## What NOT to copy
8. The curtain/door reveal only works with REAL darshan footage (the 33.4K reel). With AI art there is nothing
   the viewer is waiting to see. Do not use reveal-of-a-place hooks with AI.
9. Real temple footage beats AI art 10-30x. Always ask the temple for real clips; AI is for stories that
   cannot be filmed.

## Quality
10. Voices: ElevenLabs eleven_v4, Bharadwaj (narrator) and Ramaa (Krishna). Never the free Edge TTS voice
    (the user rejected it on Day 6). The user cannot top up ElevenLabs: when credits run out, write the line from
    words already recorded in earlier takes (reels/day5-ta, day6-ta audio) and cut them out with Whisper word
    timings, as Day 7 did with "நீ தனியாக இல்லை… கவலைப்படாதே".
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
