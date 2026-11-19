# Build a science-explainer reel (KB-13). usage: build.sh <reel dir> [voice] [speed]
# needs <reel>/docs/script.json ([[id, line, mood?], ...]) and <reel>/assets/spec.js (export const SPEC = {beats, key})
set -e; d=$1; V=${2:-am_michael}; SPD=${3:-1.0}; R=/home/user/QuantumAUTOMIZER; K=$R/tools/reel-kit/sci; T=$R/reels/day80-en
mkdir -p $d/assets/audio $d/assets/fonts
for f in package.json hyperframes.json CLAUDE.md AGENTS.md; do [ -f $d/$f ] || cp $T/$f $d/; done
n=$(basename $d); sed -i "s/\"name\": \"[^\"]*\"/\"name\": \"$n\"/" $d/package.json
printf '{"id":"%s","name":"%s","createdAt":"2026-11-19T00:00:00.000Z"}\n' $n $n > $d/meta.json
cp $T/assets/gsap.min.js $K/sci.js $R/tools/reel-kit/ep/cast.js $d/assets/; cp $T/assets/fonts/{Nunito.ttf,OFL.txt} $d/assets/fonts/
[ -f $d/assets/audio/voice.wav ] && [ $d/assets/audio/voice.wav -nt $d/docs/script.json ] || TIGHT=1 /home/user/gc-venv/bin/python $R/tools/reel-kit/voice_build.py $d $V $SPD "${PROMPT:-}"
/home/user/gc-venv/bin/python - $d <<'PY'
import sys,json,re
d=sys.argv[1]; p=f"{d}/assets/data.js"; s=open(p).read(); m=re.search(r"WORDS = (\[.*\]);",s); W=json.loads(m.group(1)); o=[]
for w in W:
    if o and re.match(r"^,\d{3}",w[2]) and re.match(r"^[\d,]+$",o[-1][2]): o[-1][1]=w[1]; o[-1][2]+=w[2]
    else: o.append(w)
open(p,"w").write(s.replace(m.group(1),json.dumps(o))); json.dump(o,open(f"{d}/assets/audio/words.json","w"))
PY
VD=$(grep -o 'VOICE_DUR = [0-9.]*' $d/assets/data.js | grep -o '[0-9.]*$'); DUR=$(python3 -c "print(round($VD+1.2,2))")
sed -i "s/DURATION = [0-9.]*/DURATION = $DUR/" $d/assets/data.js
sed -e "s/{{DUR}}/$DUR/g" -e "s/{{VDUR}}/$VD/g" -e "s|{{DESC}}|$n|" $K/index.tpl.html > $d/index.html
printf "import { run } from './sci.js'; import { SPEC } from './spec.js'; import { WORDS, DURATION } from './data.js';\nrun(SPEC, WORDS, DURATION);\n" > $d/assets/main.js
echo "built $n: $DUR s"
dd=$(cd $d && pwd); (cd $K && node times.mjs $dd) && /home/user/gc-venv/bin/python $K/bed.py $d $DUR
