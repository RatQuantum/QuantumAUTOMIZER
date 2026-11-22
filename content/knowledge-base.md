# Knowledge base: what we've learned about making reels grow

Read this before planning any reel or series. Every entry is either a reference video the owner sent (summarised,
never stored) or our own account data. Each entry ends with **→ For us**: what it changes in how we build.
Newest first. When a new lesson contradicts an old one, our own data wins over any reference.

---

## KB-17 · Water bug fix (owner feedback, Nov 22)

Owner: "the river or water is bugging" in all clips. Cause: the water was a flat plane at the exact height of the grass disc (z-fighting) and it cut through the bumpy ground, so its edges showed as blocky stair-steps.
Fixed in `ep/storykit.js` with the `WATER()` helper (river and sea sets): water raised to 0.11 with polygon offset, a glossy smooth surface, and sand banks that hide where water meets ground.

**→ For us:** never place a flat plane at the same height as another surface; any water, floor or decal goes through `WATER()` or gets its own height plus polygon offset. Check one wide frame of any water scene before rendering. Earlier reels stay as they are (owner: no remake).

---

## KB-16 · Rich 3D look, free on CPU (Nov 22)

Owner asked for "3D, ultra realistic" for Days 86-90 and chose "Rich 3D, free". Built in the kit, no paid tools:
- `render3d: true` in a storykit spec swaps the toon cast for real 3D chibi characters (`ep/char3d.js`): PBR skin, sheen fabric, gold crown, textured peacock feather, 3D eyes, brows and mouth moods, curly hair, zari hem.
- Post stack (`ep/post3d.js`, bundled from three@0.187.0): RoomEnvironment reflections, soft shadows, depth of field focused on the centre actor, light bloom.
- Tuning that fixed the first washed-out test: env 0.28, exposure 0.92, bloom 0.16 at threshold 0.93, fog halved, less hair sheen.
- Retention lesson from Part 5 (scored 85 vs reference 100): the brain flagged a still hook. The 2nd shot was a locked-off wide. Every shot in the first 3 s needs a dolly or push (`pov:` with dx,dy,dz) and one hit.

**→ For us:** use `render3d` for special days and series finales; keep 2D toon for speed on normal days. Never leave a shot static in the first 3 s. Blender on the owner's laptop is the next step up (Days 91-95) once it is attached.

---

## KB-15 · House rules from the new skills (Nov 22)

From motion-design (LottieFiles), video-shotcraft, huashu-art-motion, mg-styles-15 and video-talkcraft, now in the shared kit (`ep/director.js`, `ep/storykit.js`):
- **Hit-stop:** the camera holds for 3 frames on every impact (`shakes`), so hits read as heavy.
- **Impact frame:** 2 frames of an inverted picture on each hit (anime/shotcraft impact cut).
- **Speed lines:** radial streaks for 0.2 s on every POV whip pan.
- **Running POV:** arms pump with `arms: 'run'`.
- **Every opening scene moves from frame one** (dolly + a second shot inside 2 s) so the retention brain's "first 3 s" stays high; every scene has 2 shots, a cut every 2-3 s.
- **Next to add:** an anticipation pose before big actions, overlap on garlands and hair, and video-talkcraft's still-frame detector as a pre-render gate (the retention brain already flags dead seconds).

## KB-14 · POV disaster choice series + "the harness" (owner sent, Nov 19)

**1. The format (4 videos, 31M+ views, 18.8M on one):** a first-person disaster story that ends on a choice ("boat or helicopter?"). Comments push every video; the cliffhanger makes people follow.
- **True POV:** your two arms always visible in the bottom corners (reach, grab, point, shield); a 100° lens; head bob, panic sway, hard shakes on impact, whip pans; look up and down a lot.
- **Cut every 1.2-2.2 s,** one action and one line per shot. Lines of 1-4 words, **shouted**; the friend's name said twice; **one planted mystery** ("Is that really Jay?").
- **Beats:** 0-2 s mid-panic + HUD + red "YOU CHOSE X" badge · 2-12 s the plan works, then fails · 12-22 s trapped, the audio muffles, 0.5 s of silence · 22-34 s you surface, someone calls your name, a new threat, "One pass!" · 34-40 s cliffhanger, cut to black · 40-45 s a choice card for 3 s+.
- **Text:** a HUD at top-left ("[PLACE] · [TIME]" + the series and part in yellow); captions at 72% height, one colour per speaker. End card "WHAT WOULD YOU DO?", blue and red buttons, "Comment below ↓".
- **Audio:** 2-3 shouted voices, panting, impacts, a heartbeat while muffled; **only a tense drone** until the end-card swell.
**→ For us:** Arjuna's Charioteer from Part 4 is POV (you are Ishan). storykit `pov: {sleeve, skin, colors}`, `pov:x,y,z,tx,ty,tz[,dx,dy,dz]` shots (100° FOV), per-scene `arms` (grip, reach, up, point, shield, down, fall), `panic`, `roll`, `noArms`; voice_build takes per-line voices `[id, line, mood, voice, speed, pause]` and writes `lines.json` for the speaker colours; `ep/pov_bed.py` makes the drone, SFX, muffle and swell.

**2. "Good vs bad AI animation: the harness":** the same scene from a bad prompt vs a good one. The good one runs: a structured prompt (concept · beats · rules · assets · review) → a /motion-director skill → **house rules** (anticipation, arcs, overlap, squash and stretch, hit-stop) + tokens + rig/VFX → the renderer (deterministic, every value a function of the frame) → per-frame checks.
**→ For us:** this is our pipeline (spec → storykit/sci → HyperFrames → snapshot + retention brain + earshot). House rules to keep adding: an anticipation pose before big actions, hit-stop (2-3 held frames) on impacts, overlap on hair and garlands.

## KB-13 · "Real science of a superpower" explainer (owner sent, Nov 19)

58 s, gold-on-dark vector art. One shocking claim (a character turns into a black hole), then a **rising ladder of comparisons** (60 kg → car → blue whale → the Moon → Earth → a black hole), rolling counters ("922,184,710 kg"), formula chips (MASS × SPEED), and a **twist ending** that reframes the claim ("her final move wasn't a punch, it was a star"). Captions sit at the top in 2-4 word chunks with one bold key word. The narration is calm and confident; earshot hears "confident, cool" funk-electronic music with a bass groove under it (-14.2 LUFS, ~4.9 onsets/s).
- **→ For us:** a new format on both accounts: temple *"the real numbers of Krishna's miracles"* (Govardhan first), clinic *"your body, explained"* (the heart's lifetime first). Engine: `tools/reel-kit/sci/` (`sci.js` beats: portrait · tag · counter · ladder · eq · space · end; `bed.py` = funk groove + earshot SFX bank on every beat).
- **→ For us:** the retention brain (`tools/reel-kit/brain/retention_brain.py`) measured the reference vs our Day 70: **visual change in the first 3 s 2.56 vs 0.98, big reveals per 10 s 8.1 vs 3.8.** Our hooks are 2.6× too still and we reveal half as often. Rule: a new visual element every 1-2 s, and motion in frame 1.
- **→ Voice:** we never clone a real narrator. earshot + MFCC picked the closest free voice (Kokoro `am_onyx`).
- **→ Not possible here:** Meta's TRIBE brain-encoding model needs a GPU and ~3 large models; the retention brain is the CPU stand-in.

## KB-12 · The beat-sync "edit" (owner sent, Nov 19)

A 14.6 s fan edit: an icon intro, then **27 cuts** (one every ~0.5 s, often 2-3 in 0.3 s) on the beats of a song, with RGB/chromatic glitch, flash frames, diagonal wipes, zoom punches and neon outline frames. No words.
- **→ For us:** **one edit a week on each account** (temple and Krishnaa Clinic), from that week's best hero shots, re-rendered clean (no subtitles). Engine: `tools/reel-kit/edit/make_edit.py` (cuts from the song's beat grid, cuts under 0.22 s merged, six rotating effects, the handle in the last 2 s).
- **→ For us:** the owner chose the song from their reference video. It stays in the scratchpad, never committed; if Instagram mutes it, they add the same sound in-app.

## KB-11 · Owner feedback on the clinic test + the monster video again (Nov 19)

"Just text makes me want to scroll to the next reel in 1 second. It has to be more entertaining than educational." The gold-on-dark text explainer failed the owner's own scroll test.
- **→ For us (all accounts):** never a text-only reel. Every fact is wrapped in a **character story** with real scenes, and the camera cuts every 1-2 s.
- **→ For us:** monster-video subtitles: **one big word at a time**, bright yellow with a black stroke, and **red on 1-2 emphasis words** per reel (storykit `one: true`, `red: [...]`).
- **→ For us:** a deep male narrator for the clinic (`am_onyx`); the doctor tells it in first person.

## KB-10 · "Which easing for which moment" (owner sent, Nov 19)

A creator to camera, 18 s, with a gold curve icon for each rule ("Use this… for this"):

| Moment | Easing | → For us |
|---|---|---|
| Hooks and intros | **cubic-out** or **rebound-out** (back-out overshoot) | Title card and the first overlay slam in with back-out, not a hard pop. |
| Hard cuts and comedy beats | **none** (instant) | Scene cuts and "Wait…?" stay hard cuts. |
| Image or icon pop-ups | **ease-out / quad-out** | The "?" icons, location tag and badges scale up with quad-out. |
| Removing text | **ease-in / quad-in** | Title, location and comment pill leave fast with quad-in, never just vanish. |
| Long clips | **linear** (a slow, constant push) | Shots held over 3 s get a slow linear push-in so nothing sits still. |
| Animated CTAs | **rebound-out** | The comment word and follow badge bounce in with back-out. |

## KB-9 · "13.5M views from AI explainers made in Claude" (owner sent, Nov 19)

A creator to camera over dark/gold motion graphics: view counts (2.7M, 7.8M, 16.7M), "made with one Claude skill in 20 minutes", script + animations + captions + voice all automated. The voice is **Fish Audio Drama 3**, directed in plain English with tags like *[quiet wonder, slow build]*. The CTA is "comment EXPLAINER and I'll send the skill" (a keyword-for-gift DM).

- **→ For us:** we already have that pipeline (the krishna-reel skill + storykit). The gap is **acted narration**: Kokoro reads flat. Directed emotion per line (awe, whisper, urgency) is the upgrade.
- **→ For us:** the gold-on-dark kinetic word style ("13", "20 min", "SKILL" chips) works for list or "facts" formats.
- **→ For us:** keyword-for-gift CTA (KB-7 #29-30) proven again; still needs DM automation first.

---

## KB-8 · Production upgrade (Nov 18)

- **Krishna, detailed** (`tools/reel-kit/ep/cast.js`): a jewelled tiered mukut with a pearl rim, a full peacock feather, curly locks, makara kundala earrings, gold necklaces, the Kaustubha gem, a five-colour Vaijayanti garland, a pitambar with a zari border, a red sash with tassels and a green angavastram. Every character is now drawn at double resolution (512×1024).
- **Music** (`tools/reel-kit/ep/raga_bed.py`, replaces make_bed for new reels): a tanpura drone, a real tabla keherwa from samples, a bansuri melody generated on a raga (festive = Bhupali, devotional = Yaman-like, epic = Bhairavi-like), bell accents, a santoor shimmer, two short echoes, and **the music ducks under the narrator**. Each reel has a mood: devotional, festive or epic.
- **Sound effects**: real-sample bell, cinematic boom and impacts; synthesized shimmer, whoosh, conch and thunder.
- **ElevenLabs** music/SFX: wired up, but the account had only 10 credits (one music track costs about 900-1,650 credits). Top up to use it.
- **Skills**: skills.sh and GitHub are blocked by this environment's network policy; plugins come from the claude.ai catalog (Motion Reel, animation-studio, parallax-threejs and an AI music generator were suggested to the owner).

---

## KB-7 · "30 lessons from 80 billion views" (owner sent, Nov 17)

A creator with 45M followers, talking to camera. On-screen numbers count up 1-30, and a caption pinned at the top says "Number 25 will make you the most money 💰". That caption is a curiosity hook that holds people to the end.

**The lessons that apply to us** (her numbering, in her words, paraphrased):

| # | Lesson | → For us |
|---|---|---|
| 1 | Decide the exact **emotion** you want the viewer to feel before you make the video. | Every brief starts with one emotion word (awe, tears, laughter, pride, fear) and every shot serves it. |
| 2 | People are moved by four levers: **time, money, status, fear**. | Devotional versions: *fear* (danger, loss), *status* (being chosen by God), *time* ("for 5,000 years…"), *gain* ("He returns it a thousand times"). Name the lever in the brief. |
| 3 | **Write the comment section you want before you script.** | Write the 3 comments we hope to see ("A! Ishan must listen", "Jai Shri Krishna 🙏") and write the script so viewers will want to type them. |
| 4 | Reps beat waiting for the perfect message. | Keep 5 a day. Volume is how we learn. |
| 5 | The **first 3 seconds** matter more than the other 30. | Already our Strategy 8/10 hook rules; keep them strict. |
| 6 | **Split-test hook variations** before trusting your gut. | For the best stories, make 2 hook versions (two openings, same body) and post them as A/B over two days (see Strategy 7). |
| 7 | **Data over opinion.** | Every batch decision is checked against Insights (retention graph, shares, follows), never just against how we feel about it. |
| 8 | Niching down too early kills reach. | Don't narrow to one sub-topic yet. Krishna stories plus real temple footage plus series keeps it wide. |
| 9 | Consistent strong posting lifts everything after it. | 5 a day continues. |
| 10 | **Going wide** opens more doors than staying perfectly on brand. | Allow formats beyond "Why we do what we do": series, real temple clips, choice stories. |
| 11-12 | Not everything will resonate; stop trying to please everyone. | Commit to a strong POV and emotion rather than safe, flat retellings. |
| 13 | **Attention → trust → sale**, in that order. | Reach first (stories, series), then trust (real temple footage, consistency), then the offer (visits, sevas, classes). Don't sell in early reels. |
| 14 | Confidence in an idea is not proof. | New formats are tests until the numbers say otherwise; keep the checkpoint system. |
| 15 | **Entertaining earns the right to educate.** | Story first, the "why we do it" lesson only after the payoff. Already our structure; never lead with the lesson. |
| 16 | The version of you that built the audience isn't always the one that scales it. | Expect to evolve the format (checkpoint 1 → Strategy 10 → series). |
| 17 | **Reverse-engineer what already works** instead of inventing. | Study the owner's reference reels and our own top posts (the 34K real-temple video!) before inventing. |
| 18 | **Repackage a winner ~10 ways and repost every 90 days.** | Keep a "winners" list. Every 90 days, remake the top stories with a new hook, angle or format (story → series part → real-temple version). Day 41 (Krishna cried) and Day 40 (16,000 wives) are the first candidates. |
| 19 | What people *say* they want ≠ what they *watch*. | Trust the retention graph over comments. |
| 20 | **Design every video in reverse, starting from the opening shot**, not the topic and not the payoff. | Shot 0 (the hook frame) gets designed first, then the payoff, then the middle. |
| 21 | **Suspense separates the best creators.** | Every reel needs an unanswered question that holds until the end. |
| 22 | **Tension = retention.** | Add a stake at each re-hook (danger, a clock, a choice). |
| 23 | A retention drop almost always has a **specific, fixable cause**. | When a graph dips, find the exact second and fix that beat (we did this: the 4-5 s cliff led to the lock-in line). |
| 24 | The **first hour of the comment section** sets its tone. | Pin our own comment the moment we post, and reply to the first comments fast (the owner, within the first hour). |
| 25 | **Ask the audience what they want.** | Story polls ("Which story next?"), plus the A/B choice series. |
| 26 | **A struggle × a topic × a desire** mixes into ~90 fresh ideas. | Idea grid: struggles (grief, doubt, fear, family conflict, poverty, pride) × Krishna stories × desires (peace, protection, love, purpose). |
| 27 | The version of yourself you're most afraid to post is often the most magnetic. | The owner's own voice and face (optional) and real temple moments: test them. |
| 28 | The **smallest, weirdest detail** makes people stay and comment. | Plant one odd detail per reel (Krishna's crown left behind, a single grain of rice, a feather in the wrong place) that viewers will point out in the comments. |
| 29-30 | A comment keyword ("comment DOUBLE") repeated 3× with a promised gift. | Our comment word plus a reason works; promise a real gift only once there's DM automation. |

**Structure lesson:** a long list (30 items, 2:17) holds because of the visible counter, the pinned "#25 is the best" teaser, and the CTA repeated 3 times. **→ For us:** list formats ("10 times Krishna broke the rules") need a visible counter and a teaser.

---

## KB-6 · Our own account data (Nov 17)

- **A real temple clip ("Believe me, He can flip the…") got 34K views**, about 25× any animated reel.
  → Real footage and the owner's own voice are our strongest asset. Combine them: a real opening plus an animated story, and end on the real deity.
- Animated reels sit at **1.2K-1.6K views**, 99.9% non-followers (the test batch, no breakout).
- Day 45 retention: about half left by 4-5 s, then flat (~40% → 30%), with a drop at the end card.
- Shares 0-6 a reel; the emotional surprises (Day 41 "Krishna cried", Day 40 "16,000 wives") share best.

## KB-5 · Blockframe-style series ("the monster can only move in the dark") (owner sent)

- A **world rule** in the first line; a **first-person kid narrator**; constant escalation; a **cliffhanger** every part; the same cast and town every part; about 2 min long.
  → Series 1 "Arjuna's Charioteer" (Ishan, 12), with A/B comment choices.

## KB-4 · The script format: hook → lock-in → body → re-hook → body → re-hook → CTA (owner sent)

→ Strategy 10 (`content/strategy-10-lock-in-and-loop.md`).

## KB-3 · The watch-time ladder: 100 / 1k / 10k / 100k views (owner sent)

1.8 s means the hook failed · 6.2 s means the body loses people (re-hook with "but") · 13.5 s means the payoff came too early · 24 s means repeat what worked.
→ We're around 13-14 s average watch: hold the payoff back, keep re-hooking.

## KB-2 · The view ladder and the two-part hook (owner sent)

Lighting → editing → borrowed hook → unique story → 90 days of consistency → one ideal viewer + an offer. A hook = curiosity gap + emotion.
→ Strategy 8 (`content/strategy-8-ladder-and-hooks.md`).

## KB-1 · Camera moves (owner sent)

Dolly zoom, crane, pull-back, landing.
→ Strategy 9 (`content/strategy-9-camera-moves.md`).

---

## Checklist before any new reel (distilled from all of the above)

1. One **emotion** + one **lever** written in the brief.
2. The **3 comments** we want, written down.
3. **Shot 0 designed first**: mid-action, emotional, readable at thumbnail size.
4. Hook line = stakes + curiosity gap, spoken from 0.06 s; the lock-in by 5 s.
5. A re-hook ("But…", "Wait…?") every 8-10 s, each adding **tension**.
6. One **weird small detail** planted.
7. Payoff late (70-80%); the lesson only after the story.
8. CTA: comment word + reason, a share line, follow for the next part.
9. After posting: pin our comment within minutes; check the retention graph at 72 h; find the exact second of any dip and fix that beat next time.
10. Every 90 days: repackage the top winners.
11. **Visual QA before render** (KB-16, KB-17): every shot in the first 3 s moves; water and floors have no z-fighting or blocky edges; check one wide frame of each set.
