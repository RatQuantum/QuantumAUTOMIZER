# Strategy 7: test hooks, keep the winners, beat the control

From a reference reel the user shared on 9 Nov (an ad-agency lecture, studied, not copied): *make about 50 hooks (the
first 5 seconds), 3-5 "meaty" middles and 3 CTAs; post the combinations; read which hooks won ("17 and 34 were the
best"); the next round keeps the winning hooks, changes the middle and the CTA, and tries new hooks to beat the control.*

**For @lordsrikrishnatemple:** we stop betting each day on one reel. Every story is built so its **hook (0-3 s), body
and CTA are separate parts**. We post 2-3 hook versions of the same story, keep the winner, and the next story starts
from that hook's pattern. Views were low on Days 14-17 for reasons we could only guess; this turns guesses into data.

## The parts

| part | what changes | how many per story |
|---|---|---|
| **Hook** (0-3 s) | the first line spoken, the first image (the thumbnail), the first caption | 3 (later 5) |
| **Body** | the story itself (the "meaty middle") | 1 per story; new story = new body |
| **CTA** | comment "Krishna" / send to someone / save it | 1 at first; test CTAs only with a winning hook |

## How to run it on Instagram

1. Post the **control** (version A) as a normal reel at the usual time.
2. Post the other hook versions as **Trial reels** (Instagram: Create → Reel → "Trial" toggle before sharing). A trial is
   shown only to non-followers, so it doesn't spam the followers and each version gets a fair, separate audience.
3. After **48 hours**, open each reel's insights and write down: views, **skip rate**, **average watch time**, shares,
   saves, comments. (Skip rate and average watch time judge the HOOK; shares, saves and comments judge the body and CTA.)
4. The version with the **lowest skip rate** (if two are close, the higher average watch time) is the winner. If a
   trial beats the control, Instagram offers to share it with followers too: say yes.
5. Log the result below. The winning hook's **pattern** (not its words) becomes the default for the next story.

## Hook patterns we can test

| id | pattern | example (Day 18) |
|---|---|---|
| A | **future warning**, "you" form (Day 5's winner) | "One day... you'll have nothing left to give." |
| B | **story-first**, the stakes in one line | "Draupadi's pot was empty. And ten thousand hungry sages were at her door." |
| C | **emotion-first cold open**, a character's voice | "Krishna... please. I have no one else." |
| D | **payoff tease** (the impossible result first) | "He ate one leaf... and ten thousand people felt full." |
| E | **POV / imagine** | "Imagine ten thousand guests at your door... and your pot is empty." |
| F | **number contrast** | "Ten thousand hungry sages. One empty pot." |
| G | **question** | "What would you do with nothing left to give?" |
| H | **direct promise** | "Krishna said: give Me a leaf, and I'll accept it." |

D, E and F need new voice lines (Chatterbox quota: about 9 lines a day free; HF PRO gives 40 min a day).

## Log

| story | version | hook pattern | posted | trial? | views 48h | skip rate | avg watch | shares | saves | comments | verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Day 18 cut paper "One leaf" | A | future warning | | no (control) | | | | | | | |
| Day 18 cut paper "One leaf" | B | story-first | | yes | | | | | | | |
| Day 18 cut paper "One leaf" | C | emotion cold open | | yes | | | | | | | |

## Rules for the builders

- Build every reel so the hook is a swappable part (reels/day18-paper: `VOICE.hook` picks the opening; variants live in
  reels/day18-hooks/<id>/ with their own voice order and share the source).
- The first frame of every version is a thumbnail: its caption and tag are drawn **finished** on frame 0.
- Change ONLY the hook between versions of one test; otherwise we can't tell what won.
- Post the versions at least a few hours apart (Instagram may treat near-identical reels posted together as duplicates).
