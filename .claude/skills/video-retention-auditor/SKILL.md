---
name: video-retention-auditor
description: Use when evaluating rendered 9:16 short-form video clips from a viewer perspective. Audits 3-second hook strength, audience retention risk, visual framing, dead air pacing, and overall virality potential.
---

# Video Retention & Viewer Satisfaction Auditor

## Overview
This skill audits vertical 9:16 video clips from the perspective of an authentic TikTok, Reels, or YouTube Shorts viewer.
It shifts the AI focus from technical code execution to audience psychology: "Will the viewer stay or swipe away within 3 seconds?"

## When to Use
- After rendering a vertical 9:16 video clip with `render_adaptive_video` or `generate_and_burn_captions`.
- Before delivering the final video to the user.
- Whenever the user asks: "Apakah video ini menarik?", "Bagaimana retensi video ini?", or "Audit kualitas klip ini".

## Core Audit Criteria

### 1. The 3-Second Hook Rule (First 0.0s - 3.0s)
- Is there an intriguing question, dramatic revelation, or energetic opening line within the first 3 seconds?
- **Red Flag**: A slow start, silent throat-clearing, or polite greeting ("Halo semuanya, kembali lagi...") guarantees an instant swipe.
- **Action**: If hook is weak, advise advancing start offset by 1-2 seconds directly to the punchy statement.

### 2. Visual Framing & Head Room (9:16 Adaptation)
- Are the active speakers' heads and expressions comfortably visible in vertical format?
- Are any speakers awkwardly bisected or cropped at the ear/chin?
- In multi-person dialogue, did the layout maintain eye contact and conversation flow?

### 3. Pacing & Dead Air Audit
- Is there any silent pause longer than 1.5 seconds without motion or visual stimulus?
- Does the cutting cadence between shots maintain energy without feeling erratic?

### 4. Subtitle Safe Zone & Legibility
- Are animated word subtitles placed centrally in the safe zone (Y: 60%-75%)?
- Are captions clear of platform UI overlays (TikTok right sidebar icons, bottom caption box, Reels sound title)?

### 5. Punchline & Ending Payoff
- Does the clip conclude cleanly on a resonant realization or memorable punchline?
- Does it avoid abrupt mid-word cutoffs?

## Standard Audit Report Format

Always output the audit using this structured markdown presentation:

- Overall Retention Score: X.X / 10
- Virality Potential: HIGH / MEDIUM / LOW
- Hook Review (0-3s:Opener)

- Visual Framing & Split Screen Balance
- Pacing, Dead Air & Subtitle Safe Zones Quality
- Viewer Verdict & Actionable Next Steps
