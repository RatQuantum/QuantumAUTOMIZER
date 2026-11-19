# Build a Krishnaa Clinic reel. usage: build.sh <id>   (needs clinic/reels/<id>/docs/script.json + docs/beats.js)
# script.json = [["c1", "line", "mood"], ...]; beats.js = export const BEATS = [...]; export const KEY = [...]
set -e; id=$1; R=/home/user/QuantumAUTOMIZER; K=$R/clinic/kit; d=$R/clinic/reels/$id; T=$R/reels/day80-en
mkdir -p $d/assets/audio $d/assets/fonts
for f in package.json hyperframes.json CLAUDE.md AGENTS.md; do [ -f $d/$f ] || cp $T/$f $d/; done
sed -i "s/\"name\": \"[^\"]*\"/\"name\": \"clinic-$id\"/" $d/package.json
printf '{"id":"clinic-%s","name":"clinic-%s","createdAt":"2026-11-19T00:00:00.000Z"}\n' $id $id > $d/meta.json
cp $T/assets/gsap.min.js $K/explainer.js $d/assets/; cp $T/assets/fonts/{Nunito.ttf,NotoColorEmoji.ttf,OFL.txt} $d/assets/fonts/
cp $d/docs/beats.js $d/assets/beats.js
[ -f $d/assets/audio/voice.wav ] && [ $d/assets/audio/voice.wav -nt $d/docs/script.json ] || TIGHT=1 /home/user/gc-venv/bin/python $R/tools/reel-kit/voice_build.py $d ${VOICE:-af_heart} ${SPEED:-1.02} "Krishnaa Clinic health facts"
VD=$(grep -o 'VOICE_DUR = [0-9.]*' $d/assets/data.js | grep -o '[0-9.]*$'); DUR=$(python3 -c "print(round($VD+1.6,2))")
sed -i "s/DURATION = [0-9.]*/DURATION = $DUR/" $d/assets/data.js
desc=$(head -1 $d/docs/topic.txt 2>/dev/null || echo $id)
sed -e "s/{{DUR}}/$DUR/g" -e "s/{{VDUR}}/$VD/g" -e "s|{{DESC}}|$desc|" $K/index.tpl.html > $d/index.html
cat > $d/assets/main.js <<'EOF'
import { run } from './explainer.js'; import { BEATS, KEY } from './beats.js'; import { WORDS, DURATION } from './data.js';
run(BEATS, WORDS, DURATION, KEY);
EOF
# resolve beat times for the bed's pop accents (same rule as explainer.js)
node -e "
const fs=require('fs');const W=JSON.parse(fs.readFileSync('$d/assets/audio/words.json'));
const src=fs.readFileSync('$d/docs/beats.js','utf8').replace(/export const /g,'globalThis.');eval(src);
const cl=w=>w.replace(/[^A-Za-z0-9'%-]/g,'').toLowerCase();let p=0;const out=BEATS.map(b=>{let t=0;if(typeof b.at==='number')t=b.at;else if(b.at){const [w,n]=Array.isArray(b.at)?b.at:[b.at,1];let c=0;const h=W.find(x=>x[0]>=p-0.01&&cl(x[2])===w.toLowerCase()&&++c===n);t=h?h[0]:p;}p=t;return +t.toFixed(2);});
fs.writeFileSync('$d/docs/beat_times.json',JSON.stringify(out));console.log('beats at',out.join(' '));"
python3 $K/bed.py $d $DUR
echo "built $id: $DUR s"
