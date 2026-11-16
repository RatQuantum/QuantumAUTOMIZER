// Day 50 · "Why do we give to God first?" · Why we do what we do #32 (as the story goes: the fruit seller of Gokul)
// Strategy 8 hook/tracker/pinned CTA + Strategy 9 camera moves.
// Sets: a Gokul lane with Nanda's grain store (origin), a home shrine today (x = 40).
import * as THREE from './three.module.js';
import { rng, mat, mesh, sm, seg, lerp, clamp, setupScene, makeCast, pose, lamp, hut, cow, roundTree, clayPot } from './kit.js';
import { makeStage, direct, wordTime } from './director.js';
import { addOutlines, makeConfetti } from './plus.js';
import { WORDS, DURATION } from './data.js';

const stage = makeStage(), { scene, camera } = stage, V = (x, y, z) => new THREE.Vector3(x, y, z), R = rng(50);
const S = setupScene(scene, [[0, -2], [40, 0]], 50);
const WT = wordTime(WORDS);
const E = { as: WT('as'), old: WT('old'), gokul: WT('gokul'), fruits: WT('fruits'), little: WT('little'), heard: WT('heard'), grabbed: WT('grabbed'), ran: WT('ran'), but: WT('but'), slipped: WT('slipped'), just: WT('just'),
  laughed: WT('laughed'), filled2: WT('filled', 2), wait: WT('wait'), lifted: WT('lifted'), heavy: WT('heavy'), gold: WT('gold'), rubies: WT('rubies'), pearls: WT('pearls'), those: WT('those'),
  thats: WT("that's"), however: WT('however'), comment: WT('comment') };
const glow = (c, o = 0.5) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, depthWrite: false, blending: THREE.AdditiveBlending });
const noOut = (m) => { m.userData.noOutline = true; m.castShadow = false; return m; };

// ---------------- the Gokul lane (origin)
mesh(new THREE.BoxGeometry(22, 0.06, 18), mat(0x8ad84a), 0, 0.03, -2, scene).castShadow = false; noOut(mesh(new THREE.BoxGeometry(3.0, 0.02, 18), mat(0xd9c08a), 1.5, 0.07, -2, scene));
[[-5.4, -4.5, 0.3], [6.0, -4.0, -0.4], [6.4, 1.5, -0.8]].forEach(([x, z, r]) => hut(scene, x, z, R, r));
for (let i = 0; i < 6; i++) roundTree(scene, (i % 2 ? 1 : -1) * (8 + (i % 3)), -10 + i * 1.2, R, 1.1);
cow(scene, 6.8, -9.0, 2.2, R);
// Nanda's open grain store: a thatched shelter with sacks and a heap of grain
const ST = new THREE.Group(); ST.position.set(-3.6, 0, -0.6); scene.add(ST);
for (const [x, z] of [[-1.1, -0.8], [1.1, -0.8], [-1.1, 0.8], [1.1, 0.8]]) mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.2, 6), mat(0x8a5a2a), x, 1.1, z, ST);
const roof = mesh(new THREE.ConeGeometry(1.9, 0.9, 4), mat(0xc9a050), 0, 2.6, 0, ST); roof.rotation.y = Math.PI / 4;
for (let i = 0; i < 3; i++) mesh(new THREE.CylinderGeometry(0.32, 0.36, 0.8, 10), mat(0xc8a878), -0.7 + i * 0.6, 0.4, -0.5, ST);
mesh(new THREE.ConeGeometry(0.7, 0.5, 14), mat(0xe8c060), 0.3, 0.25, 0.4, ST);
// the basket: woven bowl with fruit that turns to jewels
const BK = new THREE.Group(); scene.add(BK);
noOut(mesh(new THREE.CylinderGeometry(0.42, 0.3, 0.26, 14, 1, true), new THREE.MeshStandardMaterial({ color: 0xb08040, side: THREE.DoubleSide, flatShading: true }), 0, 0.13, 0, BK)); noOut(mesh(new THREE.CircleGeometry(0.3, 14).rotateX(-Math.PI / 2), mat(0x8a6030), 0, 0.01, 0, BK));
noOut(mesh(new THREE.TorusGeometry(0.42, 0.03, 6, 20).rotateX(Math.PI / 2), mat(0x8a6030), 0, 0.26, 0, BK));
const fruitM = [], jewelM = [];
for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2 * 1.618, r = 0.08 + (i % 4) * 0.07, p = V(Math.cos(a) * r, 0.28 + (i % 3) * 0.06, Math.sin(a) * r);
  fruitM.push(noOut(mesh(new THREE.SphereGeometry(0.09, 8, 6), mat([0xff6a2a, 0xffd23a, 0x8ad84a, 0xd8263a][i % 4]), p.x, p.y, p.z, BK)));
  jewelM.push(noOut(mesh(new THREE.OctahedronGeometry(i % 3 === 2 ? 0.07 : 0.09), i % 3 === 0 ? mat(0xffd23a, { m: 0.8, r: 0.2, e: 0x7a5a00, ei: 0.6 }) : i % 3 === 1 ? mat(0xe0203a, { m: 0.3, r: 0.2, e: 0x5a0010, ei: 0.6 }) : mat(0xfaf8f0, { m: 0.2, r: 0.15, e: 0x404040, ei: 0.6 }), p.x, p.y + 0.02, p.z, BK))); }
const bGlow = noOut(mesh(new THREE.SphereGeometry(0.5, 14, 10), glow(0xfff0a0, 0), 0, 0, 0, scene));
const sparks = []; for (let i = 0; i < 16; i++) sparks.push({ m: noOut(mesh(new THREE.OctahedronGeometry(0.04), new THREE.MeshBasicMaterial({ color: 0xfff2a0 }), 0, 0, 0, scene)), ph: R(), a: R() * 6.3 });
// grains slipping through Krishna's fingers; fruits in his arms
const grains = []; for (let i = 0; i < 26; i++) grains.push({ m: noOut(mesh(new THREE.SphereGeometry(0.025, 5, 4), mat(0xf2d070), 0, 0, 0, scene)), ph: R() });
const armsFruit = []; for (let i = 0; i < 5; i++) armsFruit.push(noOut(mesh(new THREE.SphereGeometry(0.075, 8, 6), mat([0xff6a2a, 0xffd23a, 0x8ad84a, 0xd8263a, 0xff6a2a][i]), 0, 0, 0, scene)));
const palmGrains = noOut(mesh(new THREE.SphereGeometry(0.06, 8, 6).scale(1, 0.4, 1), mat(0xf2d070), 0, 0, 0, scene));
// ---------------- a home shrine today (x = 40)
const T = new THREE.Group(); T.position.set(40, 0, 0); scene.add(T);
mesh(new THREE.BoxGeometry(12, 0.1, 9), mat(0xf3e6c8), 0, 0.05, 0, T).castShadow = false; mesh(new THREE.BoxGeometry(12, 8, 0.3), mat(0x7ab0d8), 0, 4, -3, T);
mesh(new THREE.BoxGeometry(2.4, 0.9, 1.1), mat(0x8a4b20), 0, 0.45, -2.2, T); mesh(new THREE.BoxGeometry(2.5, 0.08, 1.2), mat(0xffd23a), 0, 0.92, -2.2, T);
for (let i = 0; i < 20; i++) { const a = i / 19 * Math.PI; noOut(mesh(new THREE.SphereGeometry(0.09, 6, 4), mat([0xffd23a, 0xffffff, 0xf06aa0][i % 3]), Math.cos(a) * 1.1, 1.6 + Math.sin(a) * 1.2, -2.6, T)); }
const tl = [lamp(T, -1.0, 0.96, -1.85, 0.5), lamp(T, 1.0, 0.96, -1.85, 0.5)];
const plate = new THREE.Group(); scene.add(plate); noOut(mesh(new THREE.CylinderGeometry(0.28, 0.24, 0.04, 14), mat(0xd0d0d8, { m: 0.6, r: 0.3 }), 0, 0, 0, plate));
for (let i = 0; i < 5; i++) noOut(mesh(new THREE.SphereGeometry(0.07, 8, 6), mat([0xff6a2a, 0xffd23a, 0x8ad84a, 0xd8263a, 0xffd23a][i]), Math.cos(i * 1.3) * 0.13, 0.06, Math.sin(i * 1.3) * 0.13, plate));
// ---------------- the cast
const C = makeCast(scene, [['fs', 'fruitSeller'], ['k', 'kidKrishna'], ['gk', 'kidKrishna'], ['m1', 'gopi3'], ['m2', 'kid2']]);
addOutlines(scene);
const confetti = makeConfetti(scene, 50, 50);
const right = new THREE.Vector3();

function update(s, t) {
  const cx = camera.position.x, set = cx > 20 ? 40 : 0, hook = s < E.as;
  S.mood(0); S.hemi.intensity = 1.35; S.sun.target.position.set(set, 0, 0); S.sun.position.set(set - 8, 14, 10); S.sun.target.updateMatrixWorld();
  right.setFromMatrixColumn(camera.matrixWorld, 0); right.y = 0; right.normalize();
  // --- the seller: walks the lane with the basket on her head, sets it down, lifts it — heavy with jewels
  const walk = sm(seg(s, E.as, E.little)), fsx = lerp(2.8, 2.0, walk), fsz = lerp(-9, 0.6, walk);
  const down = s >= E.but && s < E.lifted, lifting = sm(seg(s, E.lifted, E.heavy));
  const jewels = hook || s >= E.heavy - 0.1;
  pose(C.fs, camera, { visible: set === 0, x: hook ? 2.0 : fsx, z: hook ? 0.6 : fsz, h: 1.55, mood: jewels ? 'wow' : s >= E.laughed && s < E.wait ? 'happy' : s >= E.fruits - 0.4 && s < E.little ? 'happy' : 'normal', arm: hook || (s >= E.lifted) ? 'up' : s >= E.filled2 - 0.2 && s < E.wait ? 'offer' : 'up', flip: true, step: walk > 0 && walk < 1 ? s * 2.4 : 0 });
  const fsp = V(hook ? 2.0 : fsx, 0, hook ? 0.6 : fsz);
  const onHead = fsp.clone().add(V(0, 1.47, 0.02)), onGround = fsp.clone().add(right.clone().multiplyScalar(0.62)).add(V(0, 0, -0.3)), held = fsp.clone().add(V(0, 1.15 - 0.2 * Math.sin(Math.min(1, lifting) * Math.PI) * 0.4, 0.3));
  BK.visible = set === 0; BK.position.copy(hook ? held : down ? onGround : s >= E.lifted ? onGround.clone().lerp(held, lifting) : onHead);
  BK.rotation.set(s >= E.heavy && s < E.gold ? Math.sin(t * 20) * 0.05 : 0, 0, 0);
  fruitM.forEach((f) => (f.visible = !jewels)); jewelM.forEach((j, i) => { j.visible = jewels; j.rotation.y = t * 1.5 + i; });
  const gl = jewels ? 1 : 0; bGlow.visible = set === 0 && gl > 0; bGlow.position.copy(BK.position).add(V(0, 0.3, 0)); bGlow.material.opacity = 0.14 + 0.05 * Math.sin(t * 6); bGlow.scale.setScalar(1 + 0.08 * Math.sin(t * 4));
  sparks.forEach(({ m, ph, a }) => { const u = (t * 0.6 + ph) % 1; m.visible = set === 0 && jewels && s < E.thats; m.position.copy(BK.position).add(V(Math.cos(a + u * 2) * (0.25 + u * 0.4), 0.3 + u * 1.0, Math.sin(a + u * 2) * (0.25 + u * 0.3))); m.rotation.set(t * 3, t * 2, 0); });
  // --- Krishna: hears, grabs grain at the store, runs to her; the grain slips; arms full of fruit
  const run = sm(seg(s, E.ran, E.slipped + 0.6)), atStore = s >= E.grabbed - 0.5 && s < E.ran;
  const kpos = hook ? V(1.0, 0, 0.9) : s < E.heard - 0.3 ? V(-1.2, 0, 1.4) : s < E.ran ? V(lerp(-1.2, -3.2, sm(seg(s, E.heard, E.grabbed))), 0, lerp(1.4, 0.3, sm(seg(s, E.heard, E.grabbed)))) : V(lerp(-3.2, 1.0, run), 0, lerp(0.3, 0.9, run));
  const fruitful = hook || s >= E.filled2 + 0.3;
  pose(C.k, camera, { visible: set === 0 && (hook || s >= E.little - 0.3), x: kpos.x, z: kpos.z, h: 1.05, mood: fruitful ? 'happy' : s >= E.just && s < E.laughed ? 'sad' : s >= E.heard ? 'happy' : 'normal', arm: atStore || (s >= E.ran && s < E.laughed) || fruitful ? 'offer' : s >= E.heard && s < E.grabbed ? 'point' : 'down', step: run > 0 && run < 1 ? s * 5 : s >= E.heard && s < E.grabbed ? s * 4 : 0 });
  const hand = kpos.clone().add(right.clone().multiplyScalar(0.27)).add(V(0, 0.56, 0.04));
  palmGrains.visible = set === 0 && s >= E.grabbed && s < E.laughed && !hook; palmGrains.position.copy(hand); palmGrains.scale.setScalar(lerp(1.6, 0.6, sm(seg(s, E.slipped - 0.6, E.just))));
  grains.forEach(({ m, ph }) => { const u = (t * 1.4 + ph) % 1; m.visible = set === 0 && s >= E.ran && s < E.just + 0.4; m.position.set(hand.x + Math.sin(ph * 20) * 0.05 - u * 0.4, hand.y - u * hand.y, hand.z + Math.cos(ph * 15) * 0.05); });
  armsFruit.forEach((f, i) => { f.visible = set === 0 && fruitful; f.position.copy(kpos).add(V(Math.cos(i * 1.4) * 0.14, 0.5 + (i % 3) * 0.07, 0.08)); });
  // --- today: offering the first plate of fruit at the home shrine
  pose(C.gk, camera, { visible: set === 40, x: 40, y: 0.96, z: -2.3, h: 1.0, mood: 'happy' });
  tl.forEach((l, i) => (l.flame.scale.y = 1 + 0.15 * Math.sin(t * 13 + i)));
  const give = sm(seg(s, E.thats + 0.3, E.however - 0.2));
  pose(C.m1, camera, { visible: set === 40, x: 40.8, z: lerp(1.0, -0.7, give), h: 1.6, mood: 'closed', arm: 'offer', flip: true });
  plate.visible = set === 40; plate.position.set(lerp(40.5, 40.3, give), lerp(1.08, 1.0, give), lerp(1.1, -1.95, give));
  pose(C.m2, camera, { visible: set === 40, x: 39.2, z: 1.0, h: 1.1, mood: 'happy', arm: s >= E.comment ? 'up' : 'down' });
  confetti(E.comment, s, V(40, 3, -1));
  S.clouds.forEach((c, i) => { c.position.x = -80 + i * 15 + ((t * 0.6 + i * 3) % 12); });
}

const G = (t) => t;
const SHOTS = [
  [0, E.as - 0.05, G, [[1.6, 1.4, 3.8], [1.5, 1.1, 0.7]], [[1.6, 1.4, 3.8], [1.5, 1.1, 0.7]], [62, 34], { move: 'dolly' }],
  [E.as - 0.05, E.old - 0.05, G, [[0, 6, 13], [1, 0.8, -3]], [[0.6, 2.6, 8], [1.5, 1.2, -2]], 50, { move: 'pull' }],
  [E.old - 0.05, E.little - 0.05, G, [[1.2, 1.6, 4.4], [2.6, 1.3, -5.0]], [[1.0, 1.6, 4.8], [2.3, 1.2, -2.0]]],
  [E.little - 0.05, E.grabbed - 0.05, G, [[-1.2, 0.8, 3.6], [-1.25, 0.65, 1.4]], [[-1.6, 0.8, 3.4], [-2.2, 0.65, 0.9]]],
  [E.grabbed - 0.05, E.ran - 0.05, G, [[-2.4, 1.0, 2.6], [-3.4, 0.6, 0.0]], [[-2.5, 1.0, 2.3], [-3.3, 0.6, 0.0]]],
  [E.ran - 0.05, E.slipped - 0.05, G, [[-1.0, 1.0, 4.6], [-2.2, 0.6, 0.4]], [[0.8, 1.0, 4.2], [0.4, 0.6, 0.8]]],
  [E.slipped - 0.05, E.just - 0.05, G, [[1.4, 0.75, 2.2], [1.15, 0.55, 0.9]], [[1.35, 0.75, 2.0], [1.15, 0.55, 0.9]]],
  [E.just - 0.05, E.laughed - 0.05, G, [[1.2, 0.8, 2.4], [1.05, 0.62, 0.9]], [[1.2, 0.8, 2.4], [1.05, 0.62, 0.9]], [62, 40], { move: 'dolly' }],
  [E.laughed - 0.05, E.wait - 0.05, G, [[1.5, 1.2, 4.4], [1.5, 0.95, 0.7]], [[1.5, 1.6, 4.8], [1.5, 1.0, 0.7]], 50, { move: 'crane', lift: 0.8 }],
  [E.wait - 0.05, E.lifted - 0.05, G, [[1.4, 1.3, 3.2], [1.4, 1.05, 0.7]], [[1.4, 1.3, 2.9], [1.4, 1.05, 0.7]]],
  [E.lifted - 0.05, E.gold - 0.05, G, [[1.9, 1.2, 3.0], [1.55, 1.0, 0.7]], [[1.8, 1.25, 2.7], [1.55, 1.05, 0.7]]],
  [E.gold - 0.05, E.those - 0.05, G, [[2.0, 1.7, 3.2], [2.0, 1.4, 0.6]], [[2.0, 1.7, 2.9], [2.0, 1.4, 0.6]]],
  [E.those - 0.05, E.thats - 0.05, G, [[1.5, 1.2, 3.6], [1.5, 1.0, 0.7]], [[1.5, 2.4, 6.4], [1.5, 1.0, 0.7]], 50, { move: 'pull' }],
  [E.thats - 0.05, E.however - 0.05, G, [[40, 2.6, 7.0], [40, 1.4, -2]], [[40, 1.9, 4.2], [40, 1.3, -1.6]], 50, { move: 'land' }],
  [E.however - 0.05, E.comment - 0.05, G, [[40.6, 1.6, 2.8], [40.2, 1.2, -1.6]], [[40.5, 1.6, 2.5], [40.2, 1.2, -1.6]]],
  [E.comment - 0.05, DURATION + 0.1, G, [[40, 2.1, 5.4], [40, 1.4, -1.5]], [[40, 2.1, 4.9], [40, 1.4, -1.5]]],
];
direct({ stage, WORDS, DURATION, shots: SHOTS, update, title: 1.6, q: [E.wait, E.lifted], cta: E.comment, prog: [E.wait, E.thats], pin: E.wait,
  key: ['fruit', 'handful', 'grain', 'basket', 'jewels', 'old', 'gokul', 'fruits', 'little', 'krishna', 'grabbed', 'ran', 'slipped', 'tiny', 'few', 'laughed', 'anyway', 'wait', 'heavy', 'gold', 'rubies', 'pearls', 'first', 'small', 'thousand', 'gopal', 'comment'],
  loc: (t) => (t >= E.as - 0.05 && t < E.old + 1.0 ? '📍 GOKUL' : t >= E.thats - 0.05 && t < E.however ? 'EVEN TODAY' : ''), shakes: [E.heavy], tick: () => {} });
