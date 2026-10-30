"""Generate stills with FLUX.1-schnell (Apache-2.0) on the free Hugging Face Space evalstate/flux1_schnell.
Usage: python flux_gen.py <out.png> <prompt> [seed]"""
import sys, shutil
from gradio_client import Client

STYLE = ("Tanjore style Indian devotional painting with rich gold leaf, palette of saffron, gold and deep indigo blue, "
         "soft glowing lamp light, ultra detailed, vertical composition, no text. ")
out, prompt = sys.argv[1], sys.argv[2]
seed = int(sys.argv[3]) if len(sys.argv) > 3 else 0
result, used_seed = Client("evalstate/flux1_schnell", verbose=False).predict(
    prompt=STYLE + prompt, seed=seed, randomize_seed=seed == 0,
    width=768, height=1344, num_inference_steps=4, api_name="/infer")
shutil.copy(result if isinstance(result, str) else result["path"], out)
print(out, "seed", int(used_seed))
