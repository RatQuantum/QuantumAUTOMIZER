# Strategy 9: camera moves (from the owner's reference reel)

The reference reel put a static shot next to a moving one ("no camera" vs "camera"), then named three moves and a finish:

1. **Pull back**: start tight, rush out to reveal the world (ease-out-expo). Use it for reveals: an army, a crowd, a whole village.
2. **Dolly zoom**: the camera travels while the lens zooms the other way, so the subject keeps its size and the world swells or shrinks behind it. Use it on the emotional hook frame and on shock beats (a gift, a broken flute).
3. **Crane up**: rise on an arc from ground level to the subject. Use it for a hilltop, a chariot, someone watching from afar.
4. **And land**: arrive with a slight overshoot and settle (ease-out-back). Use it on the final "today" image before the CTA.

Built into tools/reel-kit/ep/director.js. A shot entry is `[t0, t1, story, [pos, look], [pos, look], fov | [fov0, fov1], { move: 'dolly' | 'crane' | 'pull' | 'land', lift, drift }]`, plus a subtle handheld drift on every shot (`drift`, default 0.012).

Rule (reel-rules 27): every reel uses at least one dolly zoom on the hook, one pull or crane reveal in the story, and a land on the ending image. Never put two dolly zooms back to back.
