// write docs/beat_times.json for bed.py: node times.mjs <reel dir>
const d0 = process.argv[2]; const { resolve } = await import(d0 + '/assets/sci.js');
import fs from 'fs';
const d = process.argv[2]; const { SPEC } = await import(d + '/assets/spec.js'); const { WORDS, DURATION } = await import(d + '/assets/data.js');
const B = resolve(SPEC, WORDS, DURATION);
fs.writeFileSync(d + '/docs/beat_times.json', JSON.stringify({ beats: B.map((b) => +b.t.toFixed(2)), items: B.flatMap((b) => (b.items || []).map((i) => +i.t.toFixed(2))) }));
console.log(B.map((b) => b.kind + '@' + b.t.toFixed(1)).join(' '));
