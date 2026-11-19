# Krishnaa Clinic: reels for the owner's doctor account

A separate account and pipeline from the temple reels. The owner is a general physician.
English, 2 reels a day for 365 days, covering all 19 MBBS subjects.

**Format (owner, Nov 19): entertaining first, educational second.** Each reel is a little *patient story* told in the first person by our original cartoon **male doctor** ("A man ran into my clinic holding the left side of his chest…"), in 3D storykit scenes (clinic, inside the body with giant organs) that cut every 1-2 s, like the owner's monster reference video. Subtitles: **one big word at a time** in yellow, with **red on 1-2 emphasis words** only. Voice: Kokoro `am_onyx` (deep male), with mood tags per line. Patients are fictional. The text-only gold explainer (`kit/explainer.js`) is retired: the owner scrolls past it in a second.

## Rules (read before every clinic reel)
1. **The doctor reviews every script before it is posted.** Claude drafts; nothing medical goes out unreviewed.
2. Education only: no diagnosis or drug doses for individuals, no "cure" claims, no brand names. Red-flag symptoms always end with "see a doctor today".
3. The last line on screen (small): "Educational only · not a substitute for a consultation".
4. **CTA (owner's rule):** don't sell, don't push appointments. Ask people to **follow** for daily health facts and **share** with someone it helps. Revisit later.
5. No patient faces, names or photos, and no real case details. Original graphics only.
6. Same retention rules as the temple reels (content/knowledge-base.md): a hook in 1 s with stakes, a lock-in line by 5 s, a re-hook every 8-10 s, the payoff late, KB-10 easing.
7. 25-40 s per reel. One idea per reel.

## Two daily slots
- **Reel A (morning) · "Myth or Fact / Warning sign"**: a fast, punchy, shareable one.
- **Reel B (evening) · "How your body works"**: a calm, curious explainer that leaves people amazed.
Each topic in the bank is used once in each slot, on different days (two angles per topic = 730 reels).

## Files
- `plan-365.md`: the year: subject rotation, monthly health-calendar themes, formats.
- `topics.py` → `calendar.csv`: day-by-day plan (date, slot, subject, topic, angle).
- Reels live in `reels/<id>/` as storykit specs (`assets/spec.js`: `one: true`, `red: [...]`; sets `clinic`, `body`, `city`; cast `doctor`, `patientM`, `patientF`, `kidP`; props `heart`, `eye`, `brain`, `monitor`, `pill`). `kit/bed.py` makes the music bed.
