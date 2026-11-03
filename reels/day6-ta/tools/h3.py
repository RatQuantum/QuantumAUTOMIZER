# Free MiniMax H3 image-to-video on Hugging Face (anonymous ZeroGPU). Usage: h3.py SPACE STILL PROMPT OUT SECONDS CANVAS
import sys, shutil
from gradio_client import Client, handle_file
sp, img, prompt, out, secs, canvas = sys.argv[1:7]
c = Client(sp)
args = dict(prompt=prompt, image_path=handle_file(img), last_image_path=None, canvas=canvas, duration=float(secs), seed=42)
if "flashgen" in sp: args["enhance_prompt"]=False
else: args.update(steps=28, upsample=False)
r = c.predict(**args, api_name="/generate")
print(r)
v = r[0]["video"] if isinstance(r[0], dict) else r[0]
shutil.copy(v, out); print("saved", out)
