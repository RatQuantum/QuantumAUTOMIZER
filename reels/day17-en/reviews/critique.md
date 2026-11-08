# Critique: day17-english-no-music.mp4

- duration **26.1 s**, loudness **-15.5 LUFS**, peak **-3.4 dBFS**
- fastest motion at **11.6 s** (strip.jpg), mean motion 1.19, frame-0 brightness 28/255
- sound effects: ambi_choir.wav x1, ambi_drone.wav x1, flour_draw.wav x1, guit_em9.wav x1, perc_impact2.wav x1, tabla_na_s.wav x1, tabla_tun1.wav x1

## Automatic flags

- none

## Score from the frames (fill in; every line must reach 8 before the reel goes to the user)

| | score | evidence |
|---|---|---|
| Hook in the first 2 s (frame 0 = thumbnail) | 8 | 49 dots, four lit diyas, an 82 px two-line hook; the line starts at 0.5 s with a glowing tip. The lower half is quiet at frame 0 |
| Phone readability (phone.jpg) | 8 | hook 82 px, captions 60-74 px, verse in cream (66 px) with a dark halo after the dawn brightens; reference 34 px |
| Motion: eases, no jumps, no frantic shakes (strip.jpg) | 9 | constant-speed pen, one light run at the close, a slow flame flicker; no beat effects |
| Variety: something new every 2-4 s, no dead stretch | 8 | the line always moves for 10 s; then gold, dawn, verse lines, dots lighting up, CTA |
| Pace: neither rushed nor slow (rule 7h) | 8 | 1.9-3.1 words/s (Whisper); 0.35-0.45 s gaps; 26 s |
| Sound: voice clear, effects varied, sync with the picture | 8 | Whisper hears every word as written; 7 effects, each once, none from Day 16's set; the flour whisper runs under the drawing; -15.5 LUFS |
| Accuracy: scripture, iconography (namam, dress), spelling | 8 | Gita 9.22 paraphrase (yoga-ksemam vahamy aham); a real sikku kolam structure (one closed line around all dots); no figures |

## The 3 worst defects (timestamp, evidence, local fix)

1. FIXED: 0 s and 10.4 s, the closing light run showed early (GSAP applied its start state at load). Now immediateRender: false.
2. FIXED: the diyas were too small to read as lamps. Now 1.5x.
3. FIXED: 15-18 s, the gold verse was low in contrast on the dawn floor. Now cream with a dark halo.
