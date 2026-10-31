"""Generate a still with Z-Image-Turbo (Apache-2.0) on the Hugging Face ZeroGPU Space mcp-tools/Z-Image-Turbo.
Usage: python zimage_gen.py <out.png> <seed> <prompt>"""
import sys

from gradio_client import Client
from PIL import Image

STYLE = ("Traditional Indian devotional painting in Tanjore style with rich gold leaf details, palette of saffron, "
         "gold and deep indigo blue, soft glowing oil-lamp light, ultra detailed, vertical composition. ")
out, seed, prompt = sys.argv[1], int(sys.argv[2]), sys.argv[3]
webp, used = Client("mcp-tools/Z-Image-Turbo", verbose=False).predict(
    prompt=STYLE + prompt + " No text, no letters.", resolution="1152x2048 ( 9:16 )", seed=seed,
    random_seed=False, shift=3, steps=8, api_name="/generate")
Image.open(webp).convert("RGB").save(out)
print(out, used)
