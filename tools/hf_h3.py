# Free MiniMax H3 image-to-video on Hugging Face (ZeroGPU). Usage: HFTOK=hf_placeholder hf_h3.py SPACE STILL PROMPT OUT SECONDS CANVAS
# HFTOK is a placeholder: the environment proxy injects the real token (network secret) into the request.
import sys, shutil
from gradio_client import Client, handle_file
sp, img, prompt, out, secs, canvas = sys.argv[1:7]
import os
c = Client(sp, token=os.environ.get("HFTOK") or None)
args = dict(prompt=prompt, image_path=handle_file(img), last_image_path=None, canvas=canvas, duration=float(secs), seed=42)
if "flashgen" in sp: args["enhance_prompt"]=False
else: args.update(steps=28, upsample=False)
r = c.predict(**args, api_name="/generate")
print(r)
v = r[0]["video"] if isinstance(r[0], dict) else r[0]
shutil.copy(v, out); print("saved", out)
