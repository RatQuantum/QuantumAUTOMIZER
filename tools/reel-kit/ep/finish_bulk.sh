# finish a bulk reel after its voice exists: index page, sound bed, queue it. usage: finish_bulk.sh <n>
n=$1; cd /home/user/QuantumAUTOMIZER; d=reels/day$n-en
python3 - "$n" <<'PY'
import json,sys,subprocess
n=sys.argv[1]; (idx,key)=json.load(open(f"reels/day{n}-en/docs/meta.txt"))
t,num,cta,emo,desc,who=idx
subprocess.run(["python3","tools/reel-kit/ep/make_index.py",f"reels/day{n}-en",t,num,cta,emo,desc,f"💬 Comment <b>“{cta}”</b> and send this to {who}",f"DAY {n} · FOLLOW FOR TOMORROW'S STORY"],check=True)
subprocess.run(["python3","tools/reel-kit/ep/autobed.py",f"reels/day{n}-en",key],check=True)
PY
