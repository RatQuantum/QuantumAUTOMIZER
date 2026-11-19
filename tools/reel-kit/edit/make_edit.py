"""Weekly beat-sync "edit" (owner's reference, KB-12): ~15 s of hero shots cut on the song's beats with punch zooms,
RGB glitch, flash frames, neon outlines, shake and negative hits. No subtitles. Pure ffmpeg, deterministic.
usage: python3 make_edit.py <song audio> <cuts: "t1 t2 ..." | file.json> <out.mp4> <title> <handle> <clip.mp4> [clip.mp4 ...]
The song is never committed (reference audio stays in the scratchpad); the owner may swap it for the same
sound from Instagram's audio library if the platform mutes it."""
import sys, json, os, subprocess, tempfile
song, cuts, out, title, handle, *clips = sys.argv[1:]
FONT = "/home/user/QuantumAUTOMIZER/reels/day80-en/assets/fonts/Nunito.ttf"
dur = lambda f: float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f], capture_output=True, text=True).stdout)
D = min(dur(song), 15.0)
T = json.load(open(cuts)) if cuts.endswith(".json") else [float(x) for x in cuts.split()]
grid = [0.0]
for t in sorted(T):                       # merge cuts closer than 0.22 s (they read as one hit)
    if t - grid[-1] >= 0.22 and t < D - 0.2: grid.append(t)
grid.append(D)
W, H = 1080, 1920
base = f"scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},setsar=1,fps=30"
def zoom(a, b, d): return f"scale=w='{W}*({a}+({b}-{a})*min(t/{d:.3f},1))':h=-2:eval=frame,crop={W}:{H}"
EFX = [
    lambda d: zoom(1.35, 1.0, d) + ",eq=brightness='if(lt(t,0.07),0.55,0)':eval=frame",                    # punch + flash
    lambda d: zoom(1.08, 1.18, d) + ",rgbashift=rh=-14:bh=14:gv=4",                                           # RGB split drift
    lambda d: "edgedetect=low=0.08:high=0.25:mode=colormix," + zoom(1.15, 1.05, d) + ",eq=saturation=2.2:contrast=1.3",  # neon outline
    lambda d: f"scale={int(W*1.12)}:-2,crop={W}:{H}:x='(iw-{W})/2+22*sin(t*70)':y='(ih-{H})/2+16*cos(t*55)'",  # shake
    lambda d: zoom(1.0, 1.3, d) + ",negate=enable='lt(t,0.067)'",  # negative hit
    lambda d: zoom(1.25, 1.1, d) + ",hue=h='40*sin(t*20)',eq=contrast=1.25:saturation=1.6",                  # colour pulse
]
tmp = tempfile.mkdtemp(dir=os.path.dirname(os.path.abspath(out))); parts = []; offs = {c: 0.0 for c in clips}; lens = {c: dur(c) for c in clips}
for k in range(len(grid) - 1):
    d = grid[k + 1] - grid[k]; c = clips[k % len(clips)]
    s = offs[c] if offs[c] + d < lens[c] else 0.0; offs[c] = s + d * 0.8
    vf = base + "," + (zoom(1.5, 1.0, d) + ",eq=brightness='if(lt(t,0.1),0.8,0)':eval=frame" if k == 0 else EFX[(k - 1) % len(EFX)](d))
    if k == 0:   # intro: the title slams in
        vf += f",drawtext=fontfile={FONT}:text='{title}':fontsize=190:fontcolor=white:borderw=10:bordercolor=black:x=(w-tw)/2:y=(h-th)/2-200"
    p = f"{tmp}/p{k:03d}.mp4"; parts.append(p)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{s:.3f}", "-i", c, "-t", f"{d:.3f}", "-an", "-vf", vf + f",trim=duration={d:.3f},setpts=PTS-STARTPTS",
                    "-c:v", "libx264", "-preset", "veryfast", "-crf", "17", "-pix_fmt", "yuv420p", "-r", "30", p], check=True)
open(f"{tmp}/list.txt", "w").write("".join(f"file '{p}'\n" for p in parts))
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", f"{tmp}/list.txt", "-i", song, "-t", f"{D:.3f}",
    "-vf", f"drawtext=fontfile={FONT}:text='{handle}':fontsize=44:fontcolor=white:borderw=6:bordercolor=black:x=(w-tw)/2:y=h-260:enable='gt(t,{D-2.2:.2f})'",
    "-af", f"afade=t=out:st={D-0.5:.2f}:d=0.5,loudnorm=I=-14.5:TP=-1.5", "-c:v", "libx264", "-preset", "veryfast", "-crf", "17", "-pix_fmt", "yuv420p",
    "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", "-shortest", out], check=True)
print(out, len(parts), "cuts,", round(D, 2), "s")
