// Day 20 director: shots keyed to the voice's words; story clock s (Gokul) and m (Mumbai); karaoke captions.
import * as THREE from './three.module.js';
import { buildWorld, makeCast, pose, sm, seg, lerp, clamp } from './world.js';
import { WORDS, DURATION } from './data.js';
import { addOutlines, addLife, makeConfetti, shake } from './plus.js';

const canvas = document.getElementById('gl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1); renderer.setSize(1080, 1920, false);
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.08; renderer.outputColorSpace = THREE.SRGBColorSpace;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, 1080 / 1920, 0.1, 400);
{ const g = new THREE.SphereGeometry(300, 24, 12); const col = []; const p = g.attributes.position; const top = new THREE.Color(0x4a8fe0), hor = new THREE.Color(0xcfe9ff); for (let i = 0; i < p.count; i++) { const k = clamp(p.getY(i) / 160); const c = hor.clone().lerp(top, Math.pow(k, 0.7)); col.push(c.r, c.g, c.b); } g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); scene.add(new THREE.Mesh(g, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, fog: false }))); }
const W = buildWorld(scene);
const GOV = [5, 4, 3, 2, 1];
const castList = [['krishna', 'kidKrishna'], ['k1', 'kid1'], ['k2', 'kid2'], ['k3', 'kid3'], ['k4', 'kid4'], ['g1', 'gopi1'], ['g2', 'gopi2'], ['g3', 'gopi3'], ['yashoda', 'yashoda']];
GOV.forEach((n, tier) => { for (let i = 0; i < n; i++) castList.push([`gv${tier}_${i}`, 'govinda']); });
for (let i = 0; i < 4; i++) castList.push([`v${i}`, ['gopi2', 'crowd', 'gopi3', 'crowd'][i]]);
for (let i = 0; i < 14; i++) castList.push([`cr${i}`, i % 3 === 0 ? 'gopi1' : i % 3 === 1 ? 'crowd' : 'govinda']);
const C = makeCast(scene, castList);
addOutlines(scene);
const life = addLife(scene, [{ x: 0, z: 0, r0: 7.5, r1: 13 }]);
const confetti = makeConfetti(scene, 120);
const V = (x, y, z) => new THREE.Vector3(x, y, z);
// a word's start time (n-th occurrence)
function WT(word, n = 1) { let k = 0; for (const w of WORDS) if (w[2].toLowerCase().replace(/[^a-z'-]/g, '').startsWith(word) && ++k === n) return w[0]; throw new Error('no word ' + word); }
const E = {
  smash: WT('smash'), why: WT('why'), gokul: WT('gokul'), krishna1: WT('krishna'), so: WT('so'), women: WT('women'), plan: WT('their'), hang: WT('hang'),
  problem: WT('problem'), looks: WT('krishna', 2), whistles: WT('whistles'), one: WT('one', 2), climbs: WT('climbs'), then: WT('then'), wait: WT('wait'), because: WT('because'),
  little: WT('little'), reaches: WT('reaches'), crack: WT('crack'), butter: WT('butter', 4), mother: WT('mother'), hands: WT('hands', 2), covered: WT('krishna', 4), she: WT('and', 3),
  today: WT('today', 2), wall: WT('women', 2), team: WT('and', 4), comment: WT('comment'),
};
const POT = V(0, 3.75, -1);

// ---- Gokul, story clock s
function gokul(s, t) {
  // the pot: lifted by a woman, then hung; cracked by Krishna
  const hk = sm(seg(s, E.hang, E.hang + 1.8));
  W.handPot.visible = s >= E.plan && hk < 1;
  if (W.handPot.visible) W.handPot.position.lerpVectors(V(-0.1, 1.25, 2.0), POT, hk);
  W.pot.visible = hk >= 1 && s < E.crack + 0.15; W.pot.position.copy(POT); W.pot.rotation.z = Math.sin(t * 2.2) * 0.06;
  W.sidePots.forEach((p) => (p.visible = s >= E.hang + 1));
  W.string.visible = W.pot.visible; W.string.position.set(0, 4.35, -1); W.string.scale.y = 0.2;
  W.shards.set(E.crack + 0.15, s, POT); W.butter.set(E.crack + 0.15, s, POT.clone().add(V(0, -0.2, 0.3)));
  const buttered = s >= E.crack + 0.5;
  const tumble = sm(seg(s, E.butter + 0.9, E.butter + 1.6));
  // the kids: friends nearby, then the pyramid (two kneel, one on their shoulders, another on his), then Krishna on top
  const BASE = [V(-0.45, 0, -0.55), V(0.45, 0, -0.55)], MID = V(0, 0.72, -0.5), MID2 = V(0, 1.42, -0.45), TOP = V(0, 2.12, -0.4);
  const idle = [V(-2.4, 0, 1.3), V(-1.7, 0, 1.6), V(-2.1, 0, 2.3), V(-1.3, 0, 2.6)];
  const after = [V(-1.6, 0, 0.1), V(-0.9, 0, -0.4), V(1.4, 0, -0.3), V(2.0, 0, 0.3)];
  const kids = ['k1', 'k2', 'k3', 'k4'];
  const tgt = [BASE[0], BASE[1], MID, MID2], tIn = [E.one, E.one + 0.2, E.climbs, E.then];
  kids.forEach((k, i) => {
    const vis = s >= E.whistles - 0.6;
    let p = idle[i].clone(), kneel = false;
    const kk = sm(seg(s, tIn[i], tIn[i] + 0.7));
    if (kk > 0) { p.lerpVectors(idle[i], tgt[i], kk); if (i >= 2) p.y = lerp(0, tgt[i].y, kk) + Math.sin(kk * Math.PI) * 0.3; kneel = i < 2 && kk > 0.8; }
    if (tumble > 0) { p.lerpVectors(tgt[i], after[i], tumble); p.y = lerp(tgt[i].y, 0, tumble) + Math.sin(tumble * Math.PI) * 0.4; kneel = false; }
    pose(C[k], camera, { visible: vis, x: p.x, y: kneel ? -0.25 : p.y, z: p.z, h: 1.25, sitting: kneel, mood: buttered ? 'happy' : s >= E.wait && s < E.because ? 'wow' : 'normal', arm: buttered ? 'up' : 'down', butter: buttered, step: kk > 0 && kk < 1 ? (s - tIn[i]) * 3 : 0 });
  });
  // Krishna
  let kp, km = 'normal', ka = 'down', kpot = false, kstep = 0;
  if (s < E.so) { kp = V(-1.2, 0, 1.4); km = 'happy'; kpot = true; }
  else if (s < E.women) { const k = seg(s, E.so, E.women - 0.2); kp = V(lerp(-3.4, 3.4, k), 0, lerp(4.2, 0.8, k)); km = 'wink'; kpot = true; kstep = (s - E.so) * 3; }
  else if (s < E.hang) { kp = V(3.0, 0, 3.2); km = 'normal'; }
  else if (s < E.problem) { kp = V(0.25, Math.abs(Math.sin((s - E.hang) * 5)) * 0.45 * seg(s, E.hang + 1.6, E.hang + 1.9), 0.3); km = s > E.hang + 1.6 ? 'wow' : 'normal'; ka = s > E.hang + 1.6 ? 'up' : 'down'; }
  else if (s < E.whistles) { kp = V(0.6, 0, 0.6); km = s > E.looks ? 'normal' : 'sad'; }
  else if (s < E.little) { kp = V(1.25, 0, 0.5); km = s < E.one ? 'wink' : 'happy'; }
  else if (s < E.butter + 0.9) { const k = sm(seg(s, E.little, E.little + 1.2)); kp = V(lerp(1.25, TOP.x, k), lerp(0, TOP.y, k) + Math.sin(k * Math.PI) * 0.5, lerp(0.5, TOP.z, k)); ka = s > E.reaches ? 'up' : 'down'; km = s > E.crack ? 'happy' : 'wow'; }
  else { const k = tumble; kp = V(lerp(TOP.x, 0.2, k), lerp(TOP.y, 0, k) + Math.sin(k * Math.PI) * 0.5, lerp(TOP.z, 0.5, k)); km = 'happy'; ka = s < E.covered ? 'up' : 'down'; }
  pose(C.krishna, camera, { x: kp.x, y: kp.y, z: kp.z, h: 1.25, mood: km, arm: ka, pot: kpot, butter: buttered, step: kstep });
  // the women of Gokul
  const gw = sm(seg(s, E.problem + 0.3, E.looks));
  [['g1', -1.05, 2.4, -6], ['g2', -0.25, 1.9, 0], ['g3', 0.95, 2.5, 6]].forEach(([g, x, z, ex], i) => {
    const vis = s >= E.women - 0.1 && s < E.looks + 0.2;
    pose(C[g], camera, { visible: vis, x: lerp(x, x + ex * 0.4 + (i === 1 ? -6 : 0), gw), z, mood: s < E.plan ? 'smug' : s < E.problem ? 'smug' : 'happy', arm: s < E.plan ? 'hips' : i === 1 && s < E.hang + 1.8 ? 'up' : 'down', step: gw > 0 && gw < 1 ? s * 3 : 0 });
  });
  [[-2.7, 3.7], [2.8, 4.0], [-2.9, -2.7], [2.9, -3.0]].forEach(([x, z], i) => pose(C['v' + i], camera, { visible: s >= E.problem && s < E.mother + 1.5 || i > 1, x, z, flip: x > 0, mood: buttered ? 'happy' : s >= E.one ? 'wow' : 'normal', arm: buttered && i < 2 ? 'up' : 'down' }));
  // Yashoda
  const yk = seg(s, E.mother, E.mother + 1.0);
  pose(C.yashoda, camera, { visible: s >= E.mother, x: lerp(0.9, 1.6, yk), z: lerp(6.5, 1.1, yk), step: yk > 0 && yk < 1 ? s * 3 : 0, mood: s < E.hands ? 'normal' : s < E.she ? 'smug' : 'happy', arm: s >= E.hands && s < E.she + 0.6 ? 'hips' : 'down' });
}
// ---- Mumbai, story clock m: the pyramid stands, the top climber smashes the pot at m = E.smash + 0.6
function mumbai(m, t) {
  const crackM = E.smash + 0.6, MO = V(40, 0, -1.6);
  W.mPot.position.set(0, 7.3, -2); W.mPot.visible = m < crackM; W.mPot.rotation.z = Math.sin(t * 2) * 0.05;
  W.mString.position.set(0, 8.1, -2); W.mString.visible = W.mPot.visible;
  W.mShards.set(crackM, m, V(40, 7.3, -2)); W.spray.set(Math.floor(t / 1.6) * 1.6, t, V(43, 1.5, 2));
  GOV.forEach((n, tier) => { for (let i = 0; i < n; i++) { const x = (i - (n - 1) / 2) * 0.62, y = tier * 1.18; const top = tier === 4; pose(C[`gv${tier}_${i}`], camera, { x: MO.x + x, y, z: MO.z + tier * 0.03, h: 1.6, arm: top && m > crackM - 0.9 ? 'up' : 'down', mood: m > crackM ? 'happy' : top ? 'wow' : 'normal' }); } });
  confetti(crackM, m, V(40, 7.3, -2));
  for (let i = 0; i < 14; i++) { const a = (i < 8 ? -2.6 + i * 0.75 : -2.9 + (i - 8) * 1.15); pose(C[`cr${i}`], camera, { x: 40 + a + (i % 2) * 0.2, y: Math.abs(Math.sin(t * 4 + i)) * 0.12 * (m > crackM ? 1 : 0.3), z: (i < 8 ? 1.8 : 3.4) + (i % 3) * 0.5, h: 1.6, mood: m > crackM ? 'happy' : 'wow', arm: m > crackM ? 'up' : 'down', flip: i % 2 === 0 }); }
  W.lights.forEach((l, i) => l.material.color.setHSL(((i * 0.13 + t * 0.2) % 1), 0.9, 0.62));
}

// ---- shots: [t0, t1, (t) => [s, m], from [pos, look], to [pos, look]]
const G = (t) => [t, 0], MB = (f) => (t) => [0, f(t)];
const SHOTS = [
  [0, 3.0, MB((t) => t), [[40.4, 1.4, 9.5], [40, 4.6, -1.6]], [[40.3, 1.5, 8.6], [40, 4.8, -1.6]]],
  [3.0, E.why - 0.1, MB((t) => t), [[41.6, 6.4, 3.4], [40, 6.6, -1.8]], [[41.4, 6.5, 3.0], [40, 6.8, -1.9]]],
  [E.why - 0.1, E.gokul - 0.05, (t) => [E.butter + 3.2, 0], [[0.9, 1.0, 3.6], [0.3, 0.9, 0.5]], [[0.85, 1.0, 3.2], [0.3, 0.9, 0.5]]],
  [E.gokul - 0.05, E.krishna1 - 0.05, G, [[0, 7, 18], [0, 1.5, -4]], [[0, 6.4, 16], [0, 1.5, -4]]],
  [E.krishna1 - 0.05, E.so - 0.05, G, [[-0.6, 1.1, 3.9], [-1.2, 0.8, 1.4]], [[-0.7, 1.1, 3.5], [-1.2, 0.8, 1.4]]],
  [E.so - 0.05, E.women - 0.1, G, [[0, 3.4, 10], [-1, 0.8, 2]], [[0, 3.2, 9], [1.5, 0.8, 1.5]]],
  [E.women - 0.1, E.plan - 0.05, G, [[0, 1.5, 7.2], [0, 1.2, 2.4]], [[0, 1.5, 6.6], [0, 1.2, 2.4]]],
  [E.plan - 0.05, E.problem - 0.05, G, [[0.4, 1.6, 6.8], [0, 2.4, 0.5]], [[0.3, 1.4, 6.0], [0, 2.8, 0]]],
  [E.problem - 0.05, E.looks - 0.05, G, [[0, 2.0, 7.6], [0, 1.4, 1.5]], [[0, 2.0, 7.0], [0, 1.4, 1.5]]],
  [E.looks - 0.05, E.one - 0.05, G, [[1.1, 0.95, 2.9], [0.8, 0.95, 0.5]], [[1.15, 0.95, 2.6], [0.9, 0.95, 0.5]]],
  [E.one - 0.05, E.climbs - 0.1, G, [[-0.6, 1.6, 6.5], [-0.8, 0.8, 0.5]], [[-0.4, 1.6, 6.0], [-0.4, 0.8, 0]]],
  [E.climbs - 0.1, E.wait - 0.05, G, [[0.8, 1.7, 5.4], [0, 1.4, -0.5]], [[0.7, 1.8, 4.8], [0, 1.6, -0.5]]],
  [E.wait - 0.05, E.because - 0.05, G, [[-0.35, 0.75, 1.75], [-0.45, 0.7, -0.55]], [[-0.36, 0.75, 1.6], [-0.45, 0.7, -0.55]]],
  [E.because - 0.05, E.little - 0.05, G, [[1.55, 0.95, 2.8], [1.25, 0.95, 0.5]], [[1.55, 0.95, 2.6], [1.25, 0.95, 0.5]]],
  [E.little - 0.05, E.crack - 0.1, G, [[0.8, 0.6, 5.2], [0, 2.6, -0.5]], [[0.6, 0.8, 4.4], [0, 3.0, -0.6]]],
  [E.crack - 0.1, E.butter - 0.05, G, [[0.6, 3.3, 2.6], [0, 3.4, -0.8]], [[0.6, 3.3, 2.5], [0, 3.4, -0.8]]],
  [E.butter - 0.05, E.mother - 0.05, G, [[0, 2.2, 6.2], [0, 1.2, -0.2]], [[0, 2.1, 5.6], [0, 1.1, 0]]],
  [E.mother - 0.05, E.hands - 0.05, G, [[-0.8, 2.0, 8.6], [1.0, 1.0, 3.0]], [[-0.7, 1.9, 7.8], [1.3, 1.0, 1.6]]],
  [E.hands - 0.05, E.covered - 0.05, G, [[1.75, 1.55, 3.6], [1.6, 1.45, 1.1]], [[1.74, 1.55, 3.35], [1.6, 1.45, 1.1]]],
  [E.covered - 0.05, E.she - 0.05, G, [[0.5, 0.95, 2.6], [0.2, 0.9, 0.5]], [[0.5, 0.95, 2.35], [0.2, 0.9, 0.5]]],
  [E.she - 0.05, E.today - 0.05, G, [[1.8, 1.55, 3.5], [1.6, 1.45, 1.1]], [[1.76, 1.55, 3.2], [1.6, 1.45, 1.1]]],
  [E.today - 0.05, E.wall - 0.05, MB((t) => t - E.today), [[40, 2.2, 12], [40, 4.4, -1.6]], [[40, 2.4, 10.5], [40, 4.6, -1.6]]],
  [E.wall - 0.05, E.team - 0.05, (t) => [E.hang + 2.4, 0], [[0, 2.4, 7.5], [0, 2.2, 0.5]], [[0, 2.4, 7.0], [0, 2.4, 0.5]]],
  [E.team - 0.05, E.comment - 0.05, (t) => [E.reaches + 0.3, 0], [[0.9, 0.9, 5.4], [0, 2.2, -0.5]], [[0.8, 1.0, 5.0], [0, 2.3, -0.5]]],
  [E.comment - 0.05, DURATION + 0.1, MB((t) => E.smash + 0.6 - 2.0 + (t - E.comment)), [[40.4, 1.5, 9.2], [40, 4.8, -1.6]], [[40.3, 1.6, 8.4], [40, 5.0, -1.6]]],
];
function camAt(t) {
  const sh = SHOTS.find((x) => t >= x[0] && t < x[1]) || SHOTS[SHOTS.length - 1];
  const k = sm(seg(t, sh[0], sh[1]));
  camera.position.copy(V(...sh[3][0]).lerp(V(...sh[4][0]), k)); camera.lookAt(V(...sh[3][1]).lerp(V(...sh[4][1]), k));
  camera.fov = 50; camera.updateProjectionMatrix(); camera.updateMatrixWorld();
  return sh[2](t);
}

// ---- captions
const KEY = new Set(['janmashtami', 'nine', 'pot', 'smash', 'five-year-old', 'gokul', 'krishna', 'butter', 'steals', 'women', 'high', 'reach', 'whistles', 'kneels', 'shoulders', 'govindas', 'name', 'top', 'crack', 'gang', 'yashoda', 'hips', 'smile', 'angry', 'mumbai', 'mathura', 'wall', 'team', 'govinda', 'comment', 'wait', 'why']);
const CHUNKS = [];
{ let cur = []; WORDS.forEach((w, i) => { cur.push(i); if (/[.,?!]$/.test(w[2]) || cur.length === 3) { CHUNKS.push(cur); cur = []; } }); if (cur.length) CHUNKS.push(cur); }
const capEl = document.getElementById('cap'), titleEl = document.getElementById('title'), qEl = document.getElementById('q'), ctaEl = document.getElementById('cta');
let lastCap = '';
function captions(t) {
  let ci = -1; for (let i = 0; i < CHUNKS.length; i++) if (t >= WORDS[CHUNKS[i][0]][0] - 0.05) ci = i;
  let html = '';
  if (ci >= 0) { const ch = CHUNKS[ci], next = CHUNKS[ci + 1], lastEnd = WORDS[ch[ch.length - 1]][1]; if (t < (next ? WORDS[next[0]][0] : lastEnd + 0.6)) html = ch.map((i) => { const w = WORDS[i], clean = w[2].replace(/[^A-Za-z'-]/g, '').toLowerCase(); const on = t >= w[0] - 0.03 && KEY.has(clean); return `<span class="${on ? 'y' : ''}">${w[2].replace(/[.,]$/, '')}</span>`; }).join(' '); }
  if (html !== lastCap) { capEl.innerHTML = html; lastCap = html; }
  if (ci >= 0) capEl.style.transform = `scale(${1 + 0.16 * Math.exp(-Math.max(0, t - WORDS[CHUNKS[ci][0]][0]) * 13)})`;
  titleEl.style.opacity = t < E.why - 0.1 ? 1 : 0;
  qEl.style.opacity = t >= E.wait && t < E.because ? 1 : 0;
  qEl.style.transform = `translateY(${Math.sin(t * 4) * 8}px) rotate(${Math.sin(t * 3) * 6}deg)`;
  ctaEl.style.opacity = t >= E.comment ? 1 : 0;
  ctaEl.style.transform = `scale(${t >= E.comment ? 1 + 0.08 * Math.exp(-(t - E.comment) * 6) : 0.9})`;
}
const locEl = document.getElementById('loc');
function renderAt(t) {
  window.__T = t;
  const [s, m] = camAt(t);
  shake(camera, t, E.smash + 0.6); shake(camera, t, E.crack + 0.15); shake(camera, t, E.comment + 2.0);
  life(t);
  const lt = t >= E.gokul && t < E.so ? '📍 GOKUL · LONG AGO' : t >= E.today && t < E.wall ? 'EVEN TODAY' : '';
  if (locEl.textContent !== lt) locEl.textContent = lt; locEl.style.opacity = lt ? 1 : 0;
  gokul(s, t); mumbai(m, t);
  W.clouds.forEach((c, i) => { c.position.x = -60 + i * 15 + ((t * 0.6 + i * 3) % 12); });
  W.cows.forEach((c, i) => { c.rotation.y += 0; c.position.y = 0; c.children[1].rotation.z = Math.sin(t * 1.5 + i) * 0.15; });
  renderer.render(scene, camera);
  captions(t);
}
window.__E = E;
window.addEventListener('hf-seek', (e) => renderAt(e.detail.time));
renderAt(0);
if (window.__sceneReady) window.__sceneReady();
