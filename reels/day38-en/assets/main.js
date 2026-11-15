// Day 38 · "Why did Krishna eat banana peels?" · Why we do what we do #20 (as the story goes: Vidura's wife)
// Sets: Duryodhana's feast hall in Hastinapur (origin); the road and Vidura's small home (x = 40; inside at z < 0).
import * as THREE from './three.module.js';
import { rng, mat, mesh, sm, seg, lerp, clamp, setupScene, makeCast, pose, lamp, hut, roundTree, palm } from './kit.js';
import { makeStage, direct, wordTime } from './director.js';
import { addOutlines, makeConfetti } from './plus.js';
import { WORDS, DURATION } from './data.js';

const stage = makeStage(), { scene, camera } = stage, V = (x, y, z) => new THREE.Vector3(x, y, z), R = rng(38);
const S = setupScene(scene, [[0, 0], [40, 0]], 38);
const WT = wordTime(WORDS);
const E = { as: WT('as'), krishna2: WT('came') - 0.26, duryodhana: WT('duryodhana'), gold: WT('gold'), fifty: WT('fifty'), but: WT('but'), vidura2: WT('vidura', 2), only: WT('only'), she: WT('she'),
  she3: WT('peeled') - 0.52, but2: WT('but', 2), and2: WT('handed') - 0.24, and3: WT('ate') - 0.36, wait: WT('wait'), vidura3: WT('vidura', 3), but3: WT('but', 3), thats: WT("that's"), comment: WT('comment') };
const glow = (c, o = 0.5) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, depthWrite: false, blending: THREE.AdditiveBlending });
const noOut = (m) => { m.userData.noOutline = true; m.castShadow = false; return m; };

// ---------------- the feast hall
mesh(new THREE.BoxGeometry(14, 0.1, 10), mat(0xf3e2b8), 0, 0.05, 0, scene).castShadow = false; mesh(new THREE.BoxGeometry(14, 6, 0.3), mat(0x8a1a2a), 0, 3, -4, scene);
for (const x of [-5.5, -2.8, 2.8, 5.5]) { mesh(new THREE.CylinderGeometry(0.3, 0.34, 5.5, 10), mat(0xfaf5ea), x, 2.75, -2.6, scene); mesh(new THREE.BoxGeometry(0.8, 0.3, 0.8), mat(0xffd23a, { m: 0.5, r: 0.4 }), x, 5.6, -2.6, scene); }
mesh(new THREE.BoxGeometry(6, 0.12, 1.6), mat(0x8a5a2a), 0, 0.75, -0.6, scene); for (const [x, z] of [[-2.8, -1.2], [2.8, -1.2], [-2.8, 0], [2.8, 0]]) mesh(new THREE.BoxGeometry(0.12, 0.7, 0.12), mat(0x8a5a2a), x, 0.38, z, scene);
const foodC = [0xffd23a, 0xf6a531, 0xffffff, 0xe8462c, 0x8ad84a, 0xf5c27a];
for (let i = 0; i < 20; i++) { const x = -2.6 + (i % 10) * 0.58, z = -1.0 + Math.floor(i / 10) * 0.75; mesh(new THREE.CylinderGeometry(0.22, 0.18, 0.05, 14), mat(0xffd23a, { m: 0.75, r: 0.25 }), x, 0.84, z, scene); mesh(new THREE.SphereGeometry(0.15, 8, 6).scale(1, 0.6, 1), mat(foodC[i % 6]), x, 0.92, z, scene); }
const fl = [lamp(scene, -4.2, 0.1, -1.6, 1.1), lamp(scene, 4.2, 0.1, -1.6, 1.1)];
// ---------------- the road and Vidura's small home (x = 40)
mesh(new THREE.CylinderGeometry(9, 9, 0.06, 24), mat(0xd9b77a), 40, 0.03, 2, scene).castShadow = false;
roundTree(scene, 35.5, -3.5, R, 1.0); roundTree(scene, 45, -4, R, 1.1); palm(scene, 46.5, 2, R);
// the home: a room with an open front (we look in from +z); a mat, a low stool, a basket of bananas
const H = new THREE.Group(); H.position.set(40, 0, 0); scene.add(H);
mesh(new THREE.BoxGeometry(5, 0.12, 4), mat(0xc98f56), 0, 0.06, -1.6, H); mesh(new THREE.BoxGeometry(5, 2.8, 0.25), mat(0xd9a066), 0, 1.4, -3.6, H);
for (const x of [-2.5, 2.5]) mesh(new THREE.BoxGeometry(0.25, 2.8, 4), mat(0xd9a066), x, 1.4, -1.6, H);
const roof = mesh(new THREE.ConeGeometry(3.9, 1.8, 4), mat(0xd9b25a), 0, 3.6, -1.6, H); roof.rotation.y = Math.PI / 4; roof.scale.z = 0.8;
noOut(mesh(new THREE.BoxGeometry(2.2, 0.02, 1.2), mat(0x4a8a3a), 0.3, 0.13, -1.2, H));
mesh(new THREE.BoxGeometry(0.7, 0.35, 0.5), mat(0x8a5a2a), -0.7, 0.3, -1.4, H);
const basket = new THREE.Group(); basket.position.set(-1.4, 0.13, -0.9); H.add(basket); mesh(new THREE.CylinderGeometry(0.32, 0.24, 0.22, 12, 1, true), mat(0xb8864a), 0, 0.11, 0, basket);
const yellow = mat(0xffd23a, { e: 0xffc020, ei: 0.45 }), brownTip = mat(0x6b4a2a);
function makeBanana() { const g = new THREE.Group(); noOut(mesh(new THREE.TorusGeometry(0.14, 0.042, 6, 10, Math.PI * 0.8), yellow, 0, 0, 0, g)); noOut(mesh(new THREE.CylinderGeometry(0.014, 0.018, 0.05, 5), brownTip, 0.14, 0.01, 0, g)); g.scale.setScalar(1.1); return g; }
function makePeel() { const g = new THREE.Group(); for (let i = 0; i < 4; i++) { const f = noOut(mesh(new THREE.BoxGeometry(0.07, 0.24, 0.015).translate(0, 0.12, 0), mat(0xffe04a, { e: 0xffd040, ei: 0.45 }), 0, 0, 0, g)); f.rotation.set(0.5 * Math.cos(i * Math.PI / 2), i * Math.PI / 2, 0.5 * Math.sin(i * Math.PI / 2)); } noOut(mesh(new THREE.CylinderGeometry(0.02, 0.025, 0.06, 5), brownTip, 0, -0.02, 0, g)); g.scale.setScalar(1.4); return g; }
const inBasket = []; for (let i = 0; i < 6; i++) { const b = makeBanana(); b.position.set((i % 3 - 1) * 0.12, 0.26 + Math.floor(i / 3) * 0.06, (i % 2) * 0.08 - 0.04); b.rotation.set(0, i, 0.3); basket.add(b); inBasket.push(b); }
const flying = []; for (let i = 0; i < 4; i++) { const b = makeBanana(); scene.add(b); flying.push(b); }
const peels = []; for (let i = 0; i < 4; i++) { const p = makePeel(); scene.add(p); peels.push(p); }
const thrown = []; for (let i = 0; i < 4; i++) { const b = makeBanana(); b.position.set(41.8 + (i % 2) * 0.25, 0.18, -0.4 + i * 0.12); b.rotation.set(Math.PI / 2, i, 0); scene.add(b); thrown.push(b); }
const hearts = []; for (let i = 0; i < 10; i++) { const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d'); x.fillStyle = '#ff5a8a'; x.beginPath(); x.moveTo(32, 54); x.bezierCurveTo(4, 34, 8, 8, 32, 20); x.bezierCurveTo(56, 8, 60, 34, 32, 54); x.fill(); const m = noOut(new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.22), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true }))); scene.add(m); hearts.push(m); }
const hl = lamp(H, 1.9, 0.12, -2.8, 0.7);
// ---------------- the cast
const C = makeCast(scene, [['k', 'krishna'], ['dur', 'duryodhana'], ['s1', 'courtier'], ['s2', 'courtier'], ['w', 'gopi3'], ['vid', 'devotee']]);
addOutlines(scene);
const confetti = makeConfetti(scene, 40, 38);
const KS = V(39.3, 0.15, -1.4); // Krishna seated on the stool

function update(s, t) {
  const home = camera.position.x > 20;
  S.mood(0); S.hemi.intensity = 1.4; S.sun.target.position.set(home ? 40 : 0, 0, 0); S.sun.position.set((home ? 40 : 0) - 8, 14, 10); S.sun.target.updateMatrixWorld();
  fl.forEach((l, i) => (l.flame.scale.y = 1 + 0.15 * Math.sin(t * 13 + i))); hl.flame.scale.y = 1 + 0.15 * Math.sin(t * 11);
  const right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0); right.y = 0; right.normalize();
  // --- the hall: Duryodhana waits proudly; servants with plates
  pose(C.dur, camera, { visible: !home, x: 0.0, z: 0.9, h: 1.8, mood: s >= E.but && s < E.vidura2 ? 'wow' : 'smug', arm: s >= E.duryodhana && s < E.but ? 'offer' : 'hips' });
  [['s1', -2.0, 1.3], ['s2', 2.0, 1.3]].forEach(([n, x, z], i) => pose(C[n], camera, { visible: !home, x, z, h: 1.65, mood: 'happy', arm: 'offer', flip: x > 0 }));
  // --- Krishna: walks past the palace, along the road, into Vidura's home, sits and eats
  let kp, kps = {};
  if (!home) { const w = sm(seg(s, E.but, E.vidura2)); kp = V(lerp(-6, 6.5, w), 0, 2.4); kps = { step: w > 0 && w < 1 ? s * 3 : 0, mood: 'happy', flip: false }; if (s < E.but) kp = V(-5.5, 0, 2.4); }
  else { const w = sm(seg(s, E.vidura2 - 0.2, E.only - 0.1)); kp = w < 1 ? V(lerp(34, 39.3, w), 0, lerp(4.0, -1.4, w)) : KS.clone(); kps = w < 1 ? { step: s * 3, mood: 'happy' } : { sitting: true, mood: s >= E.and3 && Math.sin(t * 6) > 0.3 ? 'closed' : 'happy', arm: s >= E.and2 && s < E.thats ? 'offer' : 'down' }; }
  pose(C.k, camera, { x: kp.x, y: kp.y ?? 0, z: kp.z, h: 1.72, ...kps });
  // --- Vidura's wife: delighted; peels the bananas; throws the bananas, hands him the peels
  const giddy = s >= E.she && s < E.wait ? Math.abs(Math.sin(t * 7)) * 0.08 : 0;
  pose(C.w, camera, { visible: home, x: 40.6, y: giddy, z: -0.8, h: 1.62, mood: s >= E.vidura3 + 0.4 && s < E.but3 ? 'wow' : 'happy', arm: s >= E.she3 && s < E.and3 + 1 ? 'offer' : s >= E.only && s < E.she3 ? 'up' : 'down', flip: true });
  const wHand = V(40.6, 0, -0.8).add(right.clone().multiplyScalar(-0.3)).add(V(0, 0.82, 0.05)), kHand = KS.clone().add(right.clone().multiplyScalar(0.3)).add(V(0, 0.55, 0.05)), kMouth = KS.clone().add(V(0, 1.05, 0.08));
  const peelStart = E.she3 + 0.2, period = (E.and3 - peelStart) / 4;
  inBasket.forEach((b, i) => (b.visible = i >= Math.min(4, Math.floor((s - peelStart) / period + 1))));
  flying.forEach((b, i) => { const t0 = peelStart + i * period, u = (s - t0) / period; b.visible = u > 0.2 && u < 0.85; const throwU = clamp((u - 0.45) / 0.4); b.position.copy(wHand.clone().lerp(V(41.9, 0.2, -0.3 + i * 0.12), throwU)); b.position.y += Math.sin(throwU * Math.PI) * 0.6; b.rotation.set(throwU * 6, i, 0); });
  thrown.forEach((b, i) => (b.visible = s >= peelStart + (i + 0.85) * period));
  peels.forEach((p, i) => { const t0 = peelStart + i * period, give = clamp((s - t0 - period * 0.6) / (period * 0.4)), eat = clamp((s - E.and3 - i * 0.5) / 0.45);
    p.visible = s >= t0 + period * 0.2 && eat < 0.95; const pos = s < t0 + period * 0.6 ? wHand.clone() : wHand.clone().lerp(kHand, give); if (eat > 0) pos.lerp(kMouth, eat); p.position.copy(pos); p.scale.setScalar(1 - eat * 0.8); p.rotation.set(0, t * 0.5 + i, 0); });
  // --- Vidura comes home and gasps; Krishna says it was given with love
  const vIn = sm(seg(s, E.vidura3 - 0.2, E.vidura3 + 0.9));
  pose(C.vid, camera, { visible: home && s >= E.vidura3 - 0.3, x: lerp(43.5, 41.5, vIn), z: lerp(3.0, 0.2, vIn), h: 1.7, step: vIn > 0 && vIn < 1 ? s * 3 : 0, mood: s >= E.but3 + 1 ? 'happy' : 'wow', arm: s >= E.vidura3 + 0.8 && s < E.but3 ? 'up' : 'down', flip: true });
  hearts.forEach((h, i) => { const u = (t * 0.5 + i / 10) % 1; h.visible = home && s >= E.but3 + 0.6; h.position.set(KS.x + Math.sin(i * 2.1 + u * 3) * 0.5, KS.y + 1.0 + u * 1.8, KS.z + 0.2); h.scale.setScalar(Math.sin(u * Math.PI)); h.quaternion.copy(camera.quaternion); });
  confetti(E.comment, s, V(40, 2.6, -0.6));
  S.clouds.forEach((c, i) => { c.position.x = -80 + i * 15 + ((t * 0.6 + i * 3) % 12); });
}

const G = (t) => t, HOOK = (t) => E.and3 + 0.6 + t * 0.15;
const SHOTS = [
  [0, E.as - 0.05, HOOK, [[39.6, 1.25, 1.4], [39.4, 1.0, -1.4]], [[39.55, 1.22, 1.1], [39.4, 1.0, -1.4]]],
  [E.as - 0.05, E.duryodhana - 0.05, G, [[0, 4.4, 11], [0, 1.6, -1]], [[0, 3.2, 9], [0, 1.6, -1]]],
  [E.duryodhana - 0.05, E.gold - 0.05, G, [[0.4, 1.9, 4.6], [0.0, 1.4, 0.6]], [[0.3, 1.9, 4.0], [0.0, 1.4, 0.6]]],
  [E.gold - 0.05, E.fifty - 0.05, G, [[-2.2, 1.6, 1.2], [-1.4, 0.85, -0.6]], [[-1.8, 1.55, 1.0], [-1.0, 0.85, -0.6]]],
  [E.fifty - 0.05, E.but - 0.05, G, [[0, 3.6, 3.0], [0, 0.85, -0.6]], [[0, 3.4, 2.2], [0, 0.85, -0.6]]],
  [E.but - 0.05, E.vidura2 - 0.05, G, [[2.0, 1.9, 7.4], [0, 1.2, 1.5]], [[3.6, 1.9, 7.4], [3.0, 1.2, 1.5]]],
  [E.vidura2 - 0.05, E.only - 0.05, G, [[40, 3.0, 10], [40, 1.4, -1]], [[40, 2.4, 8], [40, 1.2, -1]]],
  [E.only - 0.05, E.she - 0.05, G, [[41.0, 1.6, 2.6], [40.6, 1.3, -0.8]], [[40.9, 1.6, 2.2], [40.6, 1.3, -0.8]]],
  [E.she - 0.05, E.she3 - 0.05, G, [[40.0, 1.7, 3.6], [40.0, 1.1, -1.0]], [[40.0, 1.6, 3.2], [40.0, 1.1, -1.0]]],
  [E.she3 - 0.05, E.but2 - 0.05, G, [[40.3, 1.3, 1.4], [40.3, 0.8, -0.9]], [[40.3, 1.3, 1.2], [40.3, 0.8, -0.9]]],
  [E.but2 - 0.05, E.and2 - 0.05, G, [[41.3, 1.7, 3.4], [41.1, 0.9, -0.6]], [[41.3, 1.7, 3.1], [41.1, 0.9, -0.6]]],
  [E.and2 - 0.05, E.and3 - 0.05, G, [[40.0, 1.3, 1.6], [39.9, 0.95, -1.0]], [[40.0, 1.3, 1.4], [39.9, 0.95, -1.0]]],
  [E.and3 - 0.05, E.wait - 0.05, G, [[39.6, 1.25, 1.2], [39.4, 1.0, -1.4]], [[39.55, 1.22, 1.0], [39.4, 1.0, -1.4]]],
  [E.wait - 0.05, E.vidura3 - 0.05, G, [[40.0, 1.9, 4.6], [40.2, 1.0, -1.0]], [[40.0, 1.8, 4.0], [40.2, 1.0, -1.0]]],
  [E.vidura3 - 0.05, E.but3 - 0.05, G, [[41.6, 1.7, 2.8], [41.5, 1.4, 0.2]], [[41.6, 1.7, 2.5], [41.5, 1.4, 0.2]]],
  [E.but3 - 0.05, E.thats - 0.05, G, [[39.5, 1.4, 1.8], [39.35, 1.15, -1.4]], [[39.5, 1.4, 1.5], [39.35, 1.15, -1.4]]],
  [E.thats - 0.05, E.comment - 0.05, G, [[40.2, 1.8, 4.8], [40.2, 1.1, -1.0]], [[40.2, 1.7, 4.2], [40.2, 1.1, -1.0]]],
  [E.comment - 0.05, DURATION + 0.1, G, [[40.2, 2.0, 5.4], [40.2, 1.2, -1.0]], [[40.2, 2.0, 5.0], [40.2, 1.2, -1.0]]],
];
direct({ stage, WORDS, DURATION, shots: SHOTS, update, title: E.as - 0.05, q: [E.wait, E.vidura3], cta: E.comment,
  key: ['krishna', 'banana', 'peels', 'story', 'war', 'hastinapur', 'peace', 'duryodhana', 'feast', 'gold', 'fifty', 'palace', 'vidura', 'humble', 'wife', 'overjoyed', 'forgot', 'bananas', 'threw', 'smiling', 'wait', 'gasped', 'sweeter', 'love', 'god', 'plate', 'comment', 'agree'],
  loc: (t) => (t >= E.as - 0.05 && t < E.duryodhana - 0.05 ? '📍 HASTINAPUR' : t >= E.vidura2 - 0.05 && t < E.only - 0.05 ? "VIDURA'S HOME" : ''), shakes: [], tick: () => {} });
