"""2.5D camera move on a still: Depth Anything V2 (small, ONNX, Apache-2.0) estimates depth, then each frame is
re-sampled so near things grow and slide more than far things, which reads as a real dolly shot.

Usage: python3 parallax.py <image> <out.mp4> <seconds> [--zoom 1.10 1.22] [--pan 0 0] [--depth 0.10]
  --zoom   base zoom at the start and the end (above 1 so the frame never shows an edge)
  --pan    horizontal and vertical drift over the shot, in output pixels
  --depth  how much extra the nearest things grow by the end (0 = flat zoom)
"""
import argparse
import subprocess

import cv2
import numpy as np
import onnxruntime as ort

MODEL = "/home/user/depth/onnx/model.onnx"
W, H, FPS = 1080, 1920, 30

ap = argparse.ArgumentParser()
ap.add_argument("image")
ap.add_argument("out")
ap.add_argument("seconds", type=float)
ap.add_argument("--zoom", nargs=2, type=float, default=[1.10, 1.22])
ap.add_argument("--pan", nargs=2, type=float, default=[0, 0])
ap.add_argument("--depth", type=float, default=0.10)
a = ap.parse_args()

img = cv2.imread(a.image)
img = cv2.resize(img, (W, H), interpolation=cv2.INTER_AREA)

# depth: the model takes 518 px on the short side, rounded to multiples of 14, ImageNet-normalised RGB
sess = ort.InferenceSession(MODEL, providers=["CPUExecutionProvider"])
ih, iw = 518 * H // W // 14 * 14, 518
x = cv2.resize(cv2.cvtColor(img, cv2.COLOR_BGR2RGB), (iw, ih)).astype(np.float32) / 255
x = (x - [0.485, 0.456, 0.406]) / [0.229, 0.224, 0.225]
x = x.transpose(2, 0, 1)[None].astype(np.float32)
d = sess.run(None, {sess.get_inputs()[0].name: x})[0].squeeze()
d = cv2.resize(d, (W, H))
d = (d - d.min()) / (d.max() - d.min() + 1e-6)          # 1 = nearest
d = cv2.GaussianBlur(d, (0, 0), 9)                      # soft edges so the warp never tears

ys, xs = np.mgrid[0:H, 0:W].astype(np.float32)
cx, cy = W / 2, H / 2
n = int(round(a.seconds * FPS))
ff = subprocess.Popen(["ffmpeg", "-loglevel", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{W}x{H}",
                       "-r", str(FPS), "-i", "-", "-c:v", "libx264", "-preset", "medium", "-crf", "17",
                       "-pix_fmt", "yuv420p", a.out], stdin=subprocess.PIPE)
for i in range(n):
    t = i / max(n - 1, 1)
    e = t * t * (3 - 2 * t)                              # ease in-out
    z = a.zoom[0] + (a.zoom[1] - a.zoom[0]) * e
    s = z * (1 + a.depth * e * d)                        # near pixels are magnified more
    px, py = a.pan[0] * e * (0.4 + 0.6 * d), a.pan[1] * e * (0.4 + 0.6 * d)
    mx = cx + (xs - cx - px) / s
    my = cy + (ys - cy - py) / s
    frame = cv2.remap(img, mx, my, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
    ff.stdin.write(frame.tobytes())
ff.stdin.close()
ff.wait()
print(a.out, n, "frames")
