# Free Z-Image Turbo picture on Hugging Face (ZeroGPU). Usage: hf_zimage.py OUT PROMPT SEED  (run with the gc-venv python)
import sys, shutil
from gradio_client import Client
out, prompt, seed = sys.argv[1], sys.argv[2], int(sys.argv[3])
c = Client("mcp-tools/Z-Image-Turbo")
r = c.predict(prompt, "864x1536 ( 9:16 )", seed, 8, 3.0, False, api_name="/generate")
print(r); shutil.copy(r[0], out)
