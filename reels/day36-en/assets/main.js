// Day 36 · "Why is Krishna blue?" · Why we do what we do #18 (as the story goes: Putana; and what the sages say)
// Sets: Gokul (origin) with Yashoda's porch and the cradle; the sea under an endless sky (x = 80).
import * as THREE from './three.module.js';
import { rng, mat, mesh, sm, seg, lerp, clamp, setupScene, makeCast, pose, hut, cow, roundTree, palm } from './kit.js';
import { makeStage, direct, wordTime } from './director.js';
import { addOutlines, makeConfetti } from './plus.js';
import { WORDS, DURATION } from './data.js';

const stage = makeStage(), { scene, camera } = stage, V = (x, y, z) => new THREE.Vector3(x, y, z), R = rng(36);
const S = setupScene(scene, [[0, 0], [80, 0]], 36);
const WT = wordTime(WORDS);
const E = { as: WT('as'), when: WT('when'), a: WT('beautiful') - 0.16, her: WT('her'), she: WT('she'), let: WT('let'), but: WT('but'), and2: WT('milk') - 0.38, baby2: WT('baby', 3), until: WT('until'),
  her3: WT('disguise') - 0.26, and4: WT('whole') - 0.54, wait: WT('wait'), some: WT('some'), but2: WT('but', 2), the4: WT('sky') - 0.44, the5: WT('ocean') - 0.12, anything: WT('anything'), thats: WT("that's"), he3: WT('endless', 2) - 0.52, comment: WT('comment') };
const glow = (c, o = 0.5) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, depthWrite: false, blending: THREE.AdditiveBlending });
const noOut = (m) => { m.userData.noOutline = true; m.castShadow = false; return m; };

// ---------------- Gokul
mesh(new THREE.CylinderGeometry(12, 12, 0.06, 28), mat(0xd9b77a), 0, 0.03, -1, scene).castShadow = false;
[[-5.5, -3.5, 0.3], [5.6, -3.2, -0.3], [-7, 2, 1.0], [7, 2.5, -1.0]].forEach(([x, z, r]) => hut(scene, x, z, R, r));
mesh(new THREE.BoxGeometry(4.2, 0.25, 2.2), mat(0xc98f56), 0, 0.12, -1.0, scene); mesh(new THREE.BoxGeometry(4.2, 2.8, 0.3), mat(0xe0b07a), 0, 1.4, -2.2, scene);
for (const x of [-1.9, 1.9]) mesh(new THREE.CylinderGeometry(0.1, 0.1, 2.6, 6), mat(0x8a5a2a), x, 1.3, 0.0, scene); mesh(new THREE.BoxGeometry(4.4, 0.25, 2.6), mat(0xd9b25a), 0, 2.7, -1.0, scene);
for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2, r = 13 + R() * 3; (i % 2 ? roundTree : palm)(scene, Math.cos(a) * r, Math.sin(a) * r - 4, R, 1); }
const cows = [cow(scene, -7.5, 6.5, 0.4, R), cow(scene, 7.0, 6.5, -0.5, R)];
// the cradle
const cradle = new THREE.Group(); cradle.position.set(1.0, 0.25, -0.9); scene.add(cradle);
for (const x of [-0.45, 0.45]) mesh(new THREE.BoxGeometry(0.06, 1.1, 0.06), mat(0x8a5a2a), x, 0.55, 0, cradle); mesh(new THREE.BoxGeometry(1.0, 0.06, 0.06), mat(0x8a5a2a), 0, 1.1, 0, cradle);
const swingC = new THREE.Group(); swingC.position.set(0, 1.1, 0); cradle.add(swingC); mesh(new THREE.BoxGeometry(0.7, 0.18, 0.45), mat(0xc0213a), 0, -0.75, 0, swingC); for (const x of [-0.3, 0.3]) mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.65, 4), mat(0x8a6a3a), x, -0.35, 0, swingC);
// poison mist, the life drawn out, the flash of the disguise falling
const mist = []; for (let i = 0; i < 18; i++) mist.push(noOut(mesh(new THREE.SphereGeometry(0.16, 8, 6), new THREE.MeshBasicMaterial({ color: i % 2 ? 0x7a3ab8 : 0x3a8a4a, transparent: true, opacity: 0.45, depthWrite: false }), 0, 0, 0, scene)));
const flash = noOut(mesh(new THREE.SphereGeometry(1, 16, 12), glow(0xffffff, 0), 0, 1.5, 0, scene));
const babyGlow = noOut(mesh(new THREE.SphereGeometry(0.45, 16, 12), glow(0x6aa8ff, 0), 0, 0, 0, scene));
// ---------------- the sea under an endless sky (x = 80)
const sea = noOut(mesh(new THREE.PlaneGeometry(400, 200, 80, 40).rotateX(-Math.PI / 2), mat(0x1f6fd0, { r: 0.25 }), 80, 0.05, -100, scene)); const sbase = sea.geometry.attributes.position.array.slice();
mesh(new THREE.BoxGeometry(30, 0.1, 8), mat(0xf0dca8), 80, 0.05, 4, scene).castShadow = false;
const foam = noOut(mesh(new THREE.BoxGeometry(30, 0.04, 0.3), mat(0xffffff), 80, 0.1, 0.05, scene));
// ---------------- the cast
const C = makeCast(scene, [['baby', 'baby'], ['y', 'yashoda'], ['put', 'putana'], ['giant', 'demoness'], ['v1', 'gopi1'], ['v2', 'govinda'], ['v3', 'kid1'], ['kk', 'kidKrishna']]);
addOutlines(scene);
const confetti = makeConfetti(scene, 50, 36);

function update(s, t) {
  const sea0 = camera.position.x > 40;
  // the sky: a deep endless blue when the sages speak; otherwise a soft day
  const deep = sea0 || (s >= E.the4 - 0.1);
  S.mood(0); S.hemi.intensity = 1.4; S.sun.target.position.set(sea0 ? 80 : 0, 0, 0); S.sun.position.set((sea0 ? 80 : 0) - 8, 14, 10); S.sun.target.updateMatrixWorld();
  if (deep) S.paintSky(new THREE.Color(0x0e4fd0), new THREE.Color(0x7fc0ff));
  const sp = sea.geometry.attributes.position; for (let i = 0; i < sp.count; i++) sp.setY(i, Math.sin(sbase[i * 3] * 0.15 + t * 1.2) * 0.12 + Math.cos(sbase[i * 3 + 2] * 0.2 - t) * 0.1); sp.needsUpdate = true; foam.position.z = 0.05 + Math.sin(t * 1.2) * 0.15;
  swingC.rotation.x = Math.sin(t * 1.4) * 0.12;
  // Putana walks in, beautiful; takes the baby; the poison; the life drawn out; the disguise falls
  const walk = sm(seg(s, E.a - 0.1, E.her + 0.4)), take = sm(seg(s, E.let + 0.2, E.let + 0.9)), fell = s >= E.her3 + 0.2;
  const P = V(lerp(-6.5, -0.9, walk), 0.25 * walk, lerp(3.6, -0.3, walk));
  pose(C.put, camera, { visible: !fell && !sea0 && s >= E.a - 0.2, x: P.x, y: P.y, z: P.z, h: 1.7, step: walk > 0 && walk < 1 ? s * 3 : 0, mood: s >= E.until ? 'wow' : s >= E.but ? 'smug' : 'happy', arm: take > 0.5 ? 'offer' : 'down' });
  if (s >= E.until && !fell) C.put.m.rotateZ(Math.sin(t * 9) * 0.06 * sm(seg(s, E.until, E.until + 0.6)));
  pose(C.y, camera, { visible: !sea0, x: -0.3, y: 0.25, z: -0.4, h: 1.62, mood: s >= E.her3 ? 'wow' : s >= E.she ? 'happy' : 'normal', arm: s >= E.let && s < E.let + 0.8 ? 'offer' : 'down', flip: true });
  // the baby: in the cradle; in Putana's arms; then sitting happily on the fallen giant
  const right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0); right.y = 0; right.normalize();
  const cradleP = V(1.0, 0.25 + 1.1 - 0.75 + 0.1, -0.9), armP = P.clone().add(right.clone().multiplyScalar(0.3)).add(V(0, 0.75, 0.06));
  const GI = V(-2.0, 0.03, 4.5), onGiant = GI.clone().add(V(0.2, 1.05, 0.25));
  const bp = fell ? onGiant : take > 0 ? cradleP.clone().lerp(armP, take) : cradleP;
  pose(C.baby, camera, { visible: !sea0, x: bp.x, y: bp.y, z: bp.z, h: 0.6, sitting: true, mood: s >= E.baby2 && !fell ? 'closed' : fell ? 'happy' : 'happy' });
  babyGlow.visible = !sea0 && s >= E.baby2 && s < E.her3 + 0.6; babyGlow.position.copy(bp).add(V(0, 0.25, 0)); babyGlow.material.opacity = 0.25 + 0.1 * Math.sin(t * 5);
  mist.forEach((m, i) => { const u = (t * 0.6 + i / 18) % 1; const show = !sea0 && !fell && ((s >= E.and2 && s < E.baby2 + 0.5) || (s >= E.until && s < E.her3 + 0.2)); m.visible = show; const drain = s >= E.until; m.position.set(P.x + Math.cos(i * 2.4) * (0.3 + u * (drain ? 0.4 : 0.2)), P.y + 0.6 + u * (drain ? 2.4 : 1.0), P.z + Math.sin(i * 2.4) * 0.25); m.scale.setScalar((drain ? 1.4 : 1) * (0.6 + u)); m.material.opacity = 0.45 * (1 - u); });
  const fu = s - E.her3 - 0.1; flash.visible = !sea0 && fu > 0 && fu < 0.7; flash.position.copy(P).add(V(0, 1, 0)); flash.scale.setScalar(0.5 + fu * 8); flash.material.opacity = 0.8 * (1 - fu / 0.7);
  pose(C.giant, camera, { visible: !sea0 && fell, x: GI.x + 1.8, y: GI.y + 0.0, z: GI.z, h: 4.2, mood: 'closed' }); if (fell) { C.giant.m.rotateZ(Math.PI / 2); C.giant.m.position.y += 0.55; }
  [['v1', -6.6, 2.6], ['v2', 3.4, 3.2], ['v3', -6.0, 5.2]].forEach(([n, x, z], i) => pose(C[n], camera, { visible: !sea0 && s >= E.a, x, y: 0.03, z, h: n === 'v3' ? 1.15 : 1.62, mood: fell ? 'wow' : 'happy', arm: fell ? 'up' : 'down', flip: x > 0 }));
  cows.forEach((c, i) => (c.children[1].rotation.z = Math.sin(t * 5 + i) * 0.12));
  // the endless blue: Krishna stands by the sea
  pose(C.kk, camera, { visible: sea0 || s < E.as, x: sea0 ? 80 : 0.0, y: sea0 ? 0.1 : 0, z: sea0 ? 3.2 : 0, h: 1.3, mood: 'happy', arm: s >= E.he3 ? 'up' : 'down', flute: false });
  confetti(E.comment, s, V(80, 2.6, 3));
  S.clouds.forEach((c, i) => { c.position.x = -80 + i * 15 + ((t * 0.6 + i * 3) % 12); });
}

const G = (t) => t;
const SHOTS = [
  [0, E.as - 0.05, (t) => E.thats + 0.5, [[80.15, 1.05, 4.6], [80.0, 1.05, 3.2]], [[80.15, 1.05, 4.3], [80.0, 1.05, 3.2]]],
  [E.as - 0.05, E.a - 0.05, G, [[0, 5.5, 13], [0, 1.2, -1]], [[0, 3.8, 10], [0, 1.2, -1]]],
  [E.a - 0.05, E.her - 0.05, G, [[-1.6, 1.8, 7.6], [-4.4, 1.2, 2.4]], [[-1.4, 1.8, 7.0], [-2.6, 1.2, 1.2]]],
  [E.her - 0.05, E.she - 0.05, G, [[-1.0, 1.7, 2.8], [-1.0, 1.55, -0.3]], [[-1.0, 1.7, 2.5], [-1.0, 1.55, -0.3]]],
  [E.she - 0.05, E.let - 0.05, G, [[-0.6, 1.8, 4.6], [-0.5, 1.3, -0.4]], [[-0.6, 1.75, 4.1], [-0.5, 1.3, -0.4]]],
  [E.let - 0.05, E.but - 0.05, G, [[0.4, 1.6, 4.0], [0.0, 1.0, -0.6]], [[0.3, 1.6, 3.6], [-0.2, 1.0, -0.5]]],
  [E.but - 0.05, E.baby2 - 0.05, G, [[-0.7, 1.7, 2.6], [-0.75, 1.4, -0.3]], [[-0.7, 1.7, 2.3], [-0.75, 1.4, -0.3]]],
  [E.baby2 - 0.05, E.until - 0.05, G, [[-0.5, 1.15, 1.5], [-0.6, 1.05, -0.2]], [[-0.5, 1.15, 1.35], [-0.6, 1.05, -0.2]]],
  [E.until - 0.05, E.her3 - 0.05, G, [[-0.6, 2.0, 4.6], [-0.8, 1.6, -0.3]], [[-0.6, 2.2, 5.2], [-0.8, 1.8, -0.3]]],
  [E.her3 - 0.05, E.and4 - 0.05, G, [[1.5, 2.6, 11.0], [-1.0, 1.0, 1.0]], [[1.5, 3.4, 13.0], [-1.6, 0.8, 4.5]]],
  [E.and4 - 0.05, E.wait - 0.05, G, [[-1.0, 4.6, 12.0], [-1.8, 0.6, 4.5]], [[-1.4, 4.0, 11.0], [-1.8, 0.6, 4.5]]],
  [E.wait - 0.05, E.some - 0.05, G, [[-1.8, 1.7, 7.4], [-1.8, 1.35, 4.75]], [[-1.8, 1.7, 7.1], [-1.8, 1.35, 4.75]]],
  [E.some - 0.05, E.but2 - 0.05, G, [[-1.9, 1.75, 7.8], [-1.8, 1.35, 4.75]], [[-1.85, 1.75, 7.4], [-1.8, 1.35, 4.75]]],
  [E.but2 - 0.05, E.the4 - 0.05, G, [[0, 2.0, 8], [0, 2.4, 0]], [[0, 2.0, 8], [0, 6.0, 0]]],
  [E.the4 - 0.05, E.the5 - 0.05, G, [[0, 2.0, 8], [0, 6.0, 0]], [[0, 2.0, 8], [0, 9.0, -2]]],
  [E.the5 - 0.05, E.anything - 0.05, G, [[80, 3.0, 8], [80, 0.5, -20]], [[80, 2.4, 6], [80, 0.6, -20]]],
  [E.anything - 0.05, E.thats - 0.05, G, [[80, 1.6, 10], [80, 1.6, -40]], [[80, 1.2, 14], [80, 1.4, -40]]],
  [E.thats - 0.05, E.he3 - 0.05, G, [[80.15, 1.05, 4.9], [80.0, 1.05, 3.2]], [[80.15, 1.05, 4.5], [80.0, 1.05, 3.2]]],
  [E.he3 - 0.05, E.comment - 0.05, G, [[80, 1.0, 6.0], [80, 1.6, 2]], [[80, 1.0, 7.0], [80, 2.2, 2]]],
  [E.comment - 0.05, DURATION + 0.1, G, [[80, 1.2, 7.4], [80, 1.8, 0]], [[80, 1.2, 7.8], [80, 1.9, 0]]],
];
direct({ stage, WORDS, DURATION, shots: SHOTS, update, title: E.as - 0.05, q: [E.wait, E.some], cta: E.comment,
  key: ['krishna', 'blue', 'story', 'baby', 'gokul', 'beautiful', 'putana', 'yashoda', 'feed', 'demoness', 'poison', 'drank', 'life', 'disguise', 'giant', 'wait', 'sages', 'deeper', 'sky', 'ocean', 'endless', 'comment', 'shyam'],
  loc: (t) => (t >= E.as - 0.05 && t < E.a - 0.05 ? '📍 GOKUL · LONG AGO' : ''), shakes: [E.her3 + 0.1], tick: () => {} });
