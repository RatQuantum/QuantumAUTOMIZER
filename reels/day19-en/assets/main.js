// Day 19 director: 26 shots cut on the voice, a story clock per shot (the hook flashes forward to the payoff),
// karaoke captions (2-3 words, the spoken word turns yellow), the title card. Drawn from time alone on hf-seek.
import * as THREE from './three.module.js';
import { buildWorld, makeCast, pose, sm, seg, lerp, clamp } from './world.js';
import { WORDS, DURATION } from './data.js';

const canvas = document.getElementById('gl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true, alpha: false });
renderer.setPixelRatio(1); renderer.setSize(1080, 1920, false);
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.08; renderer.outputColorSpace = THREE.SRGBColorSpace;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, 1080 / 1920, 0.1, 400);
// a sky dome: deep blue at the top to pale at the horizon
{ const g = new THREE.SphereGeometry(300, 24, 12); const col = []; const p = g.attributes.position; const top = new THREE.Color(0x4a8fe0), hor = new THREE.Color(0xcfe9ff); for (let i = 0; i < p.count; i++) { const k = clamp(p.getY(i) / 160); const c = hor.clone().lerp(top, Math.pow(k, 0.7)); col.push(c.r, c.g, c.b); } g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); scene.add(new THREE.Mesh(g, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, fog: false }))); }
const W = buildWorld(scene);
const C = makeCast(scene);
const V = (x, y, z) => new THREE.Vector3(x, y, z);

// ---- the story clock (s): world state
const spring = (t, k = 120, d = 9) => { if (t <= 0) return 0; const w = Math.sqrt(k), z = d / (2 * w), wd = w * Math.sqrt(1 - z * z); return 1 - Math.exp(-z * w * t) * (Math.cos(wd * t) + z * w / wd * Math.sin(wd * t)); };
function theta(s) {
  let th = 0.3 * spring(s - 20.75);
  for (const g of W.gold) th += 0.012 * Math.exp(-Math.max(0, s - g.userData.td - 0.35) * 8) * (s > g.userData.td + 0.35 ? Math.sin((s - g.userData.td) * 30) : 0);   // it shivers, but it doesn't move
  th -= 0.62 * spring(s - 40.25, 90, 7);
  return th;
}
const worldOf = (o) => o.getWorldPosition(new THREE.Vector3());
function walk(s, a, b, p0, p1) { const k = seg(s, a, b); return { x: lerp(p0[0], p1[0], k), z: lerp(p0[2], p1[2], k), step: k > 0 && k < 1 ? (s - a) * 2.2 : 0 }; }
function state(s, t) {
  W.scale.set(theta(s)); W.scale.group.updateMatrixWorld(true);
  // gold falls in, piece by piece
  for (const g of W.gold) { const u = g.userData, k = seg(s, u.td, u.td + 0.35); g.visible = s >= u.td; if (!g.visible) continue; g.position.copy(u.home).add(V(0, (1 - k * k) * 2.6, 0)); g.rotation.y = u.spin + k * 3; }
  // coins fly when it tips
  const tp = s - 40.3; const pR = worldOf(W.scale.panR);
  W.fly.forEach((o) => { o.visible = tp > 0 && tp < 1.4; if (!o.visible) return; const u = o.userData; o.position.set(pR.x + u.vx * tp, pR.y + 0.4 + u.vy * tp - 4.9 * tp * tp, pR.z + u.vz * tp); o.rotation.x = tp * 9; });
  // the leaf: from Rukmini's hand, fluttering down onto the pile
  const pile = pR.clone().add(V(0, 0.62, 0));
  const hand = V(2.05, 1.2, 1.15);
  if (s < 38.5) W.leaf.visible = false;
  else { W.leaf.visible = true; const k = sm(seg(s, 38.5, 40.2)); W.leaf.position.lerpVectors(hand, pile, k); W.leaf.position.x += Math.sin(s * 7) * 0.12 * (1 - k); W.leaf.rotation.set(-1.2 + Math.sin(s * 5) * 0.5 * (1 - k), s * 0.6 * (1 - k), Math.sin(s * 6) * 0.4 * (1 - k)); }
  if (s >= 40.2) W.leaf.position.copy(pile);
  // characters
  const pL = worldOf(W.scale.panL);
  const kSit = sm(seg(s, 20.05, 20.7));
  const kStand = [-1.7, 0, 1.9];
  pose(C.krishna, camera, s < 20.05 ? { x: kStand[0], z: kStand[2], mood: s >= 8.4 && s < 9.8 ? 'happy' : 'normal', arm: s >= 8.4 && s < 9.8 ? 'wave' : 'down' }
    : { x: lerp(kStand[0], pL.x, kSit), y: lerp(0, pL.y + 0.06, kSit) + Math.sin(kSit * Math.PI) * 0.8, z: lerp(kStand[2], pL.z + 0.15, kSit), h: lerp(1.7, 1.45, kSit), sitting: kSit > 0.9, mood: s > 40.3 ? 'happy' : s > 27 ? 'wink' : 'normal', arm: s > 41.6 && s < 44 ? 'wave' : 'down' });
  const satMood = s < 5.4 ? 'normal' : s < 10.9 ? 'smug' : s < 18 ? 'normal' : s < 20 ? 'smug' : s < 27 ? 'happy' : s < 31 ? 'wow' : s < 40.3 ? 'sad' : s < 41.5 ? 'wow' : s < 43.6 ? 'sad' : 'happy';
  pose(C.satyabhama, camera, { x: 3.0, z: 2.0, mood: satMood, arm: satMood === 'smug' ? 'hips' : 'down' });
  const nw = walk(s, 10.95, 12.9, [7.5, 0, -3.5], [4.1, 0, 2.6]);
  pose(C.narada, camera, { visible: s >= 10.95, x: nw.x, z: nw.z, step: nw.step, mood: s >= 13.9 && s < 18.2 ? 'wink' : 'normal', arm: s >= 16.6 && s < 18 ? 'point' : 'down' });
  const rw = walk(s, 33.25, 35.4, [-8, 0, -2.5], [1.55, 0, 1.0]);
  pose(C.rukmini, camera, { visible: s >= 33.2, x: rw.x, z: rw.z, step: rw.step, mood: s >= 35.4 && s < 41 ? 'closed' : 'happy', arm: s >= 38.2 && s < 39.4 ? 'offer' : 'down', leaf: s < 38.5 });
  pose(C.courtier, camera, { x: -5.2, z: 2.6, mood: s > 26.6 && s < 31 ? 'wow' : 'normal' });
  pose(C.guard, camera, { x: -1.9, z: -8.6, h: 1.8 });
  pose(C.guard2, camera, { x: 1.9, z: -8.6, h: 1.8, flip: true });
  // Guruvayur: a devotee on the scale, balanced against bananas
  W.scale2.set(0.03 * Math.sin(t * 1.3)); W.scale2.group.updateMatrixWorld(true);
  const dL = worldOf(W.scale2.panL);
  pose(C.devotee, camera, { x: dL.x, y: dL.y + 0.05, z: dL.z + 0.12, h: 1.5, sitting: true, mood: 'happy' });
  // small life
  W.clouds.forEach((c, i) => { c.position.x = -60 + i * 15 + ((t * 0.6 + i * 3) % 12); });
  W.lamp.flame.scale.y = 1 + 0.15 * Math.sin(t * 13) + 0.08 * Math.sin(t * 29); W.lamp.light.intensity = 6 + Math.sin(t * 11) * 0.8;
}

// ---- shots: [t0, t1, story clock, camera from [pos, look], camera to [pos, look], fov]
const S = (t) => t;
const SHOTS = [
  [0, 2.6, (t) => 37.95 + t * 0.2, [[0.6, 3.4, 11.5], [0.4, 2.7, 0]], [[0.4, 3.2, 9.8], [0.4, 2.6, 0]]],
  [2.6, 4.55, (t) => 39.75 + (t - 2.6) * 0.75, [[3.6, 3.2, 4.6], [1.5, 2.2, -0.6]], [[3.2, 3.0, 4.0], [1.4, 2.1, -0.6]]],
  [4.55, 5.5, S, [[0, 10, 25], [0, 3.4, -8]], [[0, 9.2, 22.5], [0, 3.4, -8]]],
  [5.5, 8.45, S, [[3.9, 1.65, 5.0], [3.0, 1.35, 2.0]], [[3.75, 1.6, 4.5], [3.0, 1.35, 2.0]]],
  [8.45, 9.7, S, [[-1.0, 1.5, 5.0], [-1.7, 1.25, 1.9]], [[-1.1, 1.5, 4.7], [-1.7, 1.25, 1.9]]],
  [9.7, 10.9, S, [[3.4, 1.62, 3.5], [3.0, 1.5, 2.0]], [[3.3, 1.62, 3.25], [3.0, 1.5, 2.0]]],
  [10.9, 13.9, S, [[-2.5, 2.4, 9.5], [3.2, 1.2, 0.5]], [[-2.2, 2.3, 9.0], [3.6, 1.2, 1.2]]],
  [13.9, 16.6, S, [[4.8, 1.6, 5.2], [4.1, 1.4, 2.6]], [[4.7, 1.6, 4.8], [4.1, 1.4, 2.6]]],
  [16.6, 18.1, S, [[0, 2.6, 9.0], [0, 2.7, -0.6]], [[0, 2.8, 7.4], [0, 2.7, -0.6]]],
  [18.1, 19.95, S, [[3.45, 1.62, 3.7], [3.0, 1.45, 2.0]], [[3.35, 1.62, 3.4], [3.0, 1.45, 2.0]]],
  [19.95, 22.35, S, [[-0.6, 3.0, 8.4], [-0.3, 2.2, 0]], [[-0.5, 3.0, 7.8], [-0.3, 2.2, 0]]],
  [22.35, 23.85, S, [[3.6, 3.5, 3.4], [2.15, 1.9, -0.6]], [[3.4, 3.3, 3.0], [2.15, 1.9, -0.6]]],
  [23.85, 24.6, S, [[3.0, 3.0, 2.2], [2.15, 1.8, -0.6]], [[2.95, 2.95, 2.0], [2.15, 1.8, -0.6]]],
  [24.6, 25.5, S, [[1.1, 3.1, 2.7], [2.15, 1.8, -0.6]], [[1.2, 3.0, 2.5], [2.15, 1.8, -0.6]]],
  [25.5, 26.65, S, [[0.2, 4.2, 9.6], [0.4, 2.2, 0]], [[0.2, 4.0, 9.0], [0.4, 2.2, 0]]],
  [26.65, 28.5, S, [[3.4, 1.9, 7.4], [1.2, 2.2, 0.2]], [[3.3, 1.85, 6.8], [1.3, 2.1, 0.4]]],
  [28.5, 29.8, S, [[-4.65, 1.6, 4.7], [-5.2, 1.45, 2.6]], [[-4.7, 1.6, 4.5], [-5.2, 1.45, 2.6]]],
  [29.8, 33.2, S, [[40.0, 3.9, 2.9], [40.0, 0.95, 0.1]], [[40.0, 3.4, 2.4], [40.0, 0.95, 0.1]]],
  [33.2, 35.2, S, [[-2.4, 2.2, 9.0], [-2.6, 1.2, 0]], [[-2.0, 2.1, 8.6], [-1.6, 1.2, 0.4]]],
  [35.2, 37.9, S, [[1.0, 1.55, 3.4], [1.55, 1.35, 1.0]], [[1.05, 1.55, 3.1], [1.55, 1.35, 1.0]]],
  [37.9, 40.1, S, [[3.3, 3.0, 3.2], [1.9, 1.9, -0.2]], [[3.1, 2.9, 2.8], [2.0, 1.9, -0.4]]],
  [40.1, 41.5, S, [[0, 3.0, 9.2], [0, 2.4, 0]], [[0, 3.0, 8.6], [0, 2.4, 0]]],
  [41.5, 44.8, S, [[-1.2, 3.25, 3.2], [-2.0, 3.0, -0.4]], [[-1.3, 3.2, 2.9], [-2.0, 3.0, -0.4]]],
  [44.8, 49.1, S, [[41.6, 2.6, 3.4], [40.0, 1.0, 0.1]], [[40.9, 2.1, 2.4], [39.6, 1.1, 0.2]]],
  [49.1, 53.9, S, [[-40, 3.0, 8.5], [-40, 1.8, -0.6]], [[-39.7, 2.5, 5.6], [-40.3, 1.6, -0.6]]],
  [53.9, DURATION + 0.1, (t) => 46 + (t - 53.9) * 0.2, [[0.5, 3.5, 12], [0.3, 2.6, 0]], [[0.4, 3.3, 10.2], [0.3, 2.6, 0]]],
];
window.SHOT_CUTS = SHOTS.map((s) => s[0]);
function camAt(t) {
  const sh = SHOTS.find((x) => t >= x[0] && t < x[1]) || SHOTS[SHOTS.length - 1];
  const k = sm(seg(t, sh[0], sh[1]));
  const p = V(...sh[3][0]).lerp(V(...sh[4][0]), k), l = V(...sh[3][1]).lerp(V(...sh[4][1]), k);
  camera.position.copy(p); camera.lookAt(l); camera.fov = 50; camera.updateProjectionMatrix(); camera.updateMatrixWorld();
  return sh[2](t);
}

// ---- captions: 2-3 words, the spoken word in yellow
const KEY = new Set(['gold', 'leaf', 'scale', 'satyabhama', 'narada', 'rukmini', 'krishna', 'tulsi', 'guruvayur', 'bananas', 'treasury', 'loved', 'bought', 'won', 'lost', 'dwarka', 'jewelry', 'husband', 'weight', 'tips', 'move', 'necklaces', 'bangles', 'crowns', 'food', 'wait', 'easy', 'gift', 'comment']);
const CHUNKS = [];
{ let cur = []; WORDS.forEach((w, i) => { cur.push(i); const end = /[.,?!]$/.test(w[2]); if (end || cur.length === 3) { CHUNKS.push(cur); cur = []; } }); if (cur.length) CHUNKS.push(cur); }
const capEl = document.getElementById('cap'), titleEl = document.getElementById('title'), qEl = document.getElementById('q'), ctaEl = document.getElementById('cta');
let lastCap = '';
function captions(t) {
  let ci = -1; for (let i = 0; i < CHUNKS.length; i++) if (t >= WORDS[CHUNKS[i][0]][0] - 0.05) ci = i;
  let html = '';
  if (ci >= 0) { const ch = CHUNKS[ci], lastEnd = WORDS[ch[ch.length - 1]][1]; const next = CHUNKS[ci + 1]; if (t < (next ? WORDS[next[0]][0] : lastEnd + 0.6)) html = ch.map((i) => { const w = WORDS[i], clean = w[2].replace(/[^A-Za-z']/g, '').toLowerCase(); const on = t >= w[0] - 0.03 && (KEY.has(clean) || clean.length > 6); return `<span class="${on ? 'y' : ''}">${w[2].replace(/[.,]$/, '')}</span>`; }).join(' '); }
  if (html !== lastCap) { capEl.innerHTML = html; lastCap = html; }
  titleEl.style.opacity = t < 4.45 ? 1 : 0;
  qEl.style.opacity = (t >= 28.55 && t < 33.2) ? 1 : 0;
  qEl.style.transform = `translateY(${Math.sin(t * 4) * 8}px) rotate(${Math.sin(t * 3) * 6}deg)`;
  ctaEl.style.opacity = t >= 56.2 ? 1 : 0;
  ctaEl.style.transform = `scale(${t >= 56.2 ? 1 + 0.08 * Math.exp(-(t - 56.2) * 6) : 0.9})`;
}

function renderAt(t) {
  const s = camAt(t);
  state(s, t);
  renderer.render(scene, camera);
  captions(t);
}
window.addEventListener('hf-seek', (e) => renderAt(e.detail.time));
window.__renderAt = renderAt;
renderAt(0);
if (window.__sceneReady) window.__sceneReady();
