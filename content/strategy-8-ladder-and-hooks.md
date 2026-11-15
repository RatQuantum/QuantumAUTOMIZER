# Strategy 8: the view ladder and the two-part hook

Source: two reference reels the owner sent (not stored in the repo).

## What the two videos say

**Video A: "the ladder"** (a creator talking to camera, with a checklist that fills in on screen and a view counter that climbs):

| Rung | What it takes | What it gets you |
|---|---|---|
| 1 | Good lighting | your first 1K-view video |
| 2 | + good editing (auto captions, cut the dead space) | first 5K |
| 3 | + a hook borrowed from another viral video | first 10K |
| 4 | + a script with a **unique perspective or story** | first 100K |
| 5 | + done **consistently for 90 days** | first 10,000 followers |
| 6 | + every video speaks to **one specific ideal viewer**, matched to **an offer** | a 10K month |

Each rung needs all the rungs below it. The on-screen checklist is itself an editing trick: viewers stay to see it fill up.

**Video B: "the hook"** (a podcast clip with a pinned "Comment AUDIT for help with your hooks" banner over the last third):

- A hook needs two things, no exceptions: a **curiosity gap** and an **emotion**.
- That applies to the opening line, the opening visual and the opening frames together.
- The enemy is half a second of disinterest, a thumb scroll.
- At every moment the viewer must feel "this is the best thing I could be watching right now".
- Assume they've just watched a cute puppy video. Yours has to beat that.

## Where we stand, rung by rung

| Rung | Our status | Gap |
|---|---|---|
| Lighting / picture quality | Bright, clean 3D. Some night scenes (court, cave, Naraka) are dim | Keep every scene's key subject in light; no frame darker than our Day 31 cosmos |
| Editing | Karaoke captions ✓, keyword colour ✓, new shot every 2-4 s ✓ | **Dead space**: Kokoro leaves ~0.3-0.6 s gaps between lines, plus 0.3 s padding we add. Cut it |
| Borrowed viral hook | "WHY ___?" title + a flash-forward | Curiosity ✓, **emotion weak**. The first line is a question, not a feeling. The first frame often shows the calm ending |
| Unique perspective / story | "Why we do what we do": a ritual explained by its story ✓ | Strong. Keep it |
| Consistent for 90 days | 5 a day from Day 21 | Day 21 → Day 110. Needs the batch pipeline plus scheduled posting (Posty or iHatePosting) |
| One ideal viewer + an offer | Not defined | **Open decision (owner).** See the end |

## The edit plan

### A. New hook template (from Day 41, plus re-cuts of 36-40 before they are posted)

First 1.5 seconds, all three at once:

1. **Opening frame = the most emotional moment**, not the calm ending. A demoness lifting baby Krishna, a chariot bursting into flames, a sari that never ends.
2. **Opening line = stakes + gap, not just "why".**
   - Old: "Why is Krishna blue?"
   - New: "A demoness fed baby Krishna poison… and that's not why He's blue."
3. **Title card = the gap in 3-4 words, shown for no more than 1.5 s.** Keep "WHY X?" but pair it with the emotional frame.

Hook formulas to rotate (from proven reels):

- **Contradiction**: "Krishna lost to no one. So why did He run?"
- **Stakes**: "One arrow decided the fate of 16,000 women."
- **Number**: "He counted to 100. At 101, everything changed."
- **You**: "You've seen this at every temple and never knew why."
- **Myth-bust**: "It wasn't the poison."

### B. Kill dead space (editing rung)

- voice_build.py: trim every inter-line silence to ≤ 0.15 s, drop the 0.3 s line padding, and add `atempo` 1.05 on top of speed 1.08. Target is 10-15% shorter reels: 40-45 s becomes 35-40 s.
- Ending: the CTA appears on the last spoken word, then a 0.4 s tail (now 0.6).
- Rule: no shot holds longer than 3 s without movement (camera push, character action or caption pop).

### C. "Best thing I could be watching", every second

- **Re-hook at 40-50% of the runtime**: our "Wait, …?" beat. Keep it, but make it the second-most emotional visual.
- **Progress device** (borrowed from Video A's checklist): a small tracker that fills as the story moves, e.g. a 3-dot "story / meaning / today" bar, or a live counter like Day 24's bowls and Day 39's 1-101.
- **Emotion in every story beat**: each scene names a feeling in the visual (fear, awe, laughter, tears). If a beat has no feeling, cut it.

### D. Beat the puppy video (polish)

- **Voice is our weakest link** (Kokoro TTS). Options, best first:
  - (1) ElevenLabs (connected; costs credits), one warm narrator voice for the whole series;
  - (2) Chatterbox (free, ~7 lines a day, so one reel a day);
  - (3) the owner's own voice recorded on a phone, which also builds a personal brand.
- Sound: keep a hit or chime on every caption keyword; keep the bed under the voice.

### E. CTA with a reason (from Video B's pinned banner)

- From the halfway point, a small pinned banner instead of only an end card: **"Comment GITA → I'll DM you the 5 best verses"**.
- The comment-to-DM needs automation. The Instagram plugin found in the directory does comment-to-DM through the official Graph API.
- Every reel's comment word maps to one free DM gift: a verse card, a festival date list, a temple timing PDF.

### F. Consistency engine (90 days)

- Batches of 5 a day (now ~2.5 h of build plus about 1.5 h of renders).
- Posting via a scheduler plugin, one approval per batch.
- Every Sunday, an audit of the week's numbers with the `ig-audit` skill: double down on the formats that beat the account's median and drop the bottom 20%.

## Rollout

1. **Pilot (next batch, Days 41-45):** new hook template, dead-space trim, mid-banner CTA. Re-cut Days 36 and 39 with the new hooks as A/B pairs against the old versions.
2. **Measure after 72 h:** 3-second hold rate, average watch %, shares, comments on the keyword.
3. **Lock** whatever wins into reel-rules.md as rules 27+ and the episode kit.

## Open decision (owner)

**Who is the one ideal viewer, and what is the offer?** Examples:

- NRI parents raising kids far from temples → offer: kids' story nights or a weekly WhatsApp story.
- Devotees near the temple → offer: festival darshan timings, prasadam, sevas, donations.
- Young seekers → offer: a free Gita-a-day DM series that leads to the temple's classes.

The answer changes the hooks ("You've seen this at every temple…" vs "Tell your kids why…"), the CTA gift and what we track.
