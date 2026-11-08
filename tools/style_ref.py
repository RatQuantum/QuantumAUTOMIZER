"""Turn a reference (one frame you love, or a short clip) into the evidence for a style guide: borrow the visual
GRAMMAR (palette, contrast, shot lengths, cuts, framing), never the subjects, logos, characters or copy.

  /home/user/gc-venv/bin/python tools/style_ref.py refs/launch.mp4 reels/day15-en/docs
  /home/user/gc-venv/bin/python tools/style_ref.py refs/frame.png  reels/day15-en/docs

Writes into the docs folder:
  ref_sheet.jpg     a frame every 0.5 s (video) or the image itself, to study
  style_guide.md    measured facts (palette in hex, brightness, contrast, saturation, cut times, average shot length)
                    + the sections to fill in after looking at ref_sheet.jpg (type, motion, transitions, camera, texture,
                    what to keep, what to avoid). Show it to the user and wait for an OK before any code (GATE 2).
"""
import os
import re
import subprocess
import sys

import numpy as np
from PIL import Image


def sh(*cmd):
    return subprocess.run(cmd, capture_output=True, text=True, check=True)


def main():
    src, out = sys.argv[1], sys.argv[2]
    os.makedirs(out, exist_ok=True)
    is_video = not src.lower().endswith((".png", ".jpg", ".jpeg", ".webp"))
    sheet = os.path.join(out, "ref_sheet.jpg")
    cuts, dur = [], None
    if is_video:
        dur = float(sh("ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", src).stdout)
        n = int(dur * 2)
        sh("ffmpeg", "-v", "error", "-y", "-i", src, "-vf", f"fps=2,scale=200:-1,tile=6x{(n + 5) // 6}", "-frames:v", "1", sheet)
        log = subprocess.run(["ffmpeg", "-i", src, "-vf", "select='gt(scene,0.30)',showinfo", "-f", "null", "-"],
                             capture_output=True, text=True).stderr
        cuts = [round(float(x), 2) for x in re.findall(r"pts_time:([\d.]+)", log)]
        sh("ffmpeg", "-v", "error", "-y", "-i", src, "-vf", "fps=2,scale=160:-1,tile=8x8", "-frames:v", "1", os.path.join(out, "_pal.png"))
        img = Image.open(os.path.join(out, "_pal.png")).convert("RGB")
    else:
        img = Image.open(src).convert("RGB")
        img.copy().resize((540, int(540 * img.height / img.width))).save(sheet)
    arr = np.asarray(img.resize((320, int(320 * img.height / img.width)))).astype(np.float32) / 255
    lum = 0.2126 * arr[..., 0] + 0.7152 * arr[..., 1] + 0.0722 * arr[..., 2]
    mx, mn = arr.max(axis=2), arr.min(axis=2)
    sat = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0)
    q = img.resize((200, int(200 * img.height / img.width))).quantize(colors=8, method=Image.Quantize.MEDIANCUT)
    pal = q.getpalette()[:24]
    counts = sorted(q.getcolors(), reverse=True)
    palette = [f"#{pal[3 * i]:02x}{pal[3 * i + 1]:02x}{pal[3 * i + 2]:02x} ({100 * c / sum(c for c, _ in counts):.0f}%)" for c, i in counts]
    if os.path.exists(os.path.join(out, "_pal.png")):
        os.remove(os.path.join(out, "_pal.png"))
    shots = np.diff([0] + cuts + ([dur] if dur else [])) if is_video else []
    md = [f"# Style guide (from {os.path.basename(src)})", "",
          "Borrow the grammar, never the subjects, logos, characters or copy of the reference.", "",
          "## Measured", "",
          f"- palette (8 colours by area): {', '.join(palette)}",
          f"- brightness {lum.mean():.2f} (0 black, 1 white), contrast (luminance std) {lum.std():.2f}, saturation {sat.mean():.2f}",
          f"- dark share {100 * (lum < 0.15).mean():.0f}%, highlight share {100 * (lum > 0.85).mean():.0f}%"]
    if is_video:
        md += [f"- duration {dur:.1f} s, cuts at {cuts if cuts else 'none detected (one continuous shot / morph)'}",
               f"- shots: {len(shots)}, average {np.mean(shots):.2f} s, shortest {np.min(shots):.2f} s, longest {np.max(shots):.2f} s" if len(shots) else ""]
    md += ["", "## Fill in after studying ref_sheet.jpg", "",
           "- **Type**: display face / UI face, weight, case, size on a phone, where text sits",
           "- **Motion**: which spring per object class (snap / settle / land / bounce / glide), how things enter and leave",
           "- **Transitions**: cut, match cut, morph, wipe, whip; how often",
           "- **Camera**: static, slow push, parallax, handheld",
           "- **Texture**: grain, paper, glow, shadows, outlines",
           "- **Keep**: the 3 things that make it feel like this",
           "- **Avoid**: our own clichés (centred title on a gradient, everything fading in, bells, beat shakes)", ""]
    open(os.path.join(out, "style_guide.md"), "w").write("\n".join(x for x in md if x is not None))
    print("\n".join(md))


if __name__ == "__main__":
    main()
