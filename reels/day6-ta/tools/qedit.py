# Free Qwen-Image-Edit-2511 (several input pictures). Usage: qedit.py OUT PROMPT LORA IMG1 [IMG2 ...]
import sys, json, base64, io
from PIL import Image
from gradio_client import Client
out, prompt, lora, *imgs = sys.argv[1:]
def b64(p):
    im = Image.open(p).convert("RGB"); im.thumbnail((1152,1152)); b = io.BytesIO(); im.save(b, "JPEG", quality=92)
    return "data:image/jpeg;base64," + base64.b64encode(b.getvalue()).decode()
c = Client("prithivMLmods/Qwen-Image-Edit-2511-LoRAs-Fast")
r = c.predict(json.dumps([b64(p) for p in imgs]), prompt, lora, 7, False, 1.0, 4, api_name="/edit_image")
print({k:(v if k!="image" else len(v)) for k,v in r.items()})
open(out,"wb").write(base64.b64decode(r["image"].split(",",1)[1])); print("saved", out, Image.open(out).size)
