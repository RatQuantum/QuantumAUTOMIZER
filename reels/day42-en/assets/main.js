// Day 42 · "Why is Vrindavan's dust sacred?" · Why we do what we do #24 (as the story goes: Krishna's headache)
// Strategy 8: opening on Krishna in pain; tracker; pinned comment banner.
// Sets: Krishna's chamber in Dwarka (origin) with the queens, Vrindavan (x = 40) with the gopis.
import * as THREE from './three.module.js';
import { rng, mat, mesh, sm, seg, lerp, clamp, setupScene, makeCast, pose, lamp, roundTree, cow } from './kit.js';
import { makeStage, direct, wordTime } from './director.js';
import { addOutlines, makeConfetti } from './plus.js';
import { WORDS, DURATION } from './data.js';

const stage = makeStage(), { scene, camera } = stage, V = (x, y, z) => new THREE.Vector3(x, y, z), R = rng(42);
const S = setupScene(scene, [[0, 0], [40, 0]], 42);
const WT = wordTime(WORDS);
const E = { as: WT('as'), dwarka: WT('dwarka'), narada: WT('narada'), krishna3: WT('said') - 0.32, place: WT('place'), narada2: WT('narada', 2), they: WT('they'), put: WT('put'), wait: WT('wait'), narada3: WT('narada', 3),
  gopis: WT('gopis') - 0.36, scooped: WT('scooped') - 0.26, if: WT('if'), moment: WT('moment') - 0.08, thats2: WT("that's", 2), love: WT('love'), comment: WT('comment') };
const glow = (c, o = 0.5) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, depthWrite: false, blending: THREE.AdditiveBlending });
const noOut = (m) => { m.userData.noOutline = true; m.castShadow = false; return m; };

// ---------------- the chamber in Dwarka
mesh(new THREE.BoxGeometry(12, 0.1, 9), mat(0xf3e2b8), 0, 0.05, 0, scene).castShadow = false; mesh(new THREE.BoxGeometry(12, 5, 0.3), mat(0x2f6fa8), 0, 2.5, -3, scene);
for (const x of [-4.6, 4.6]) { mesh(new THREE.CylinderGeometry(0.28, 0.32, 4.6, 10), mat(0xfaf5ea), x, 2.3, -2.4, scene); mesh(new THREE.BoxGeometry(0.7, 0.26, 0.7), mat(0xffd23a, { m: 0.5, r: 0.4 }), x, 4.7, -2.4, scene); }
mesh(new THREE.BoxGeometry(2.6, 0.5, 1.2), mat(0xd9a441, { m: 0.4, r: 0.4 }), 0, 0.3, -1.0, scene); mesh(new THREE.BoxGeometry(2.6, 0.14, 1.2), mat(0xc0213a), 0, 0.62, -1.0, scene); mesh(new THREE.BoxGeometry(0.5, 0.2, 0.9), mat(0xffd23a), -1.0, 0.78, -1.0, scene);
const cl = [lamp(scene, -2.6, 0.1, -2.0, 1.0), lamp(scene, 2.6, 0.1, -2.0, 1.0)];
const pain = noOut(mesh(new THREE.TorusGeometry(0.42, 0.04, 8, 28), glow(0xff4a3a, 0), 0, 0, 0, scene));
const relief = noOut(mesh(new THREE.SphereGeometry(0.5, 16, 12), glow(0xffe08a, 0), 0, 0, 0, scene));
// ---------------- Vrindavan (x = 40): a dusty clearing by the river
mesh(new THREE.CylinderGeometry(9, 9, 0.06, 24), mat(0xd9c08a), 40, 0.03, 0, scene).castShadow = false;
noOut(mesh(new THREE.PlaneGeometry(30, 4).rotateX(-Math.PI / 2), mat(0x3f9fd8, { r: 0.2 }), 40, 0.06, -5.5, scene));
roundTree(scene, 35, -3.2, R, 1.1); roundTree(scene, 45.5, -3.5, R, 1.2); cow(scene, 44.5, 1.6, -0.6, R);
const dust = []; for (let i = 0; i < 60; i++) dust.push({ m: noOut(mesh(new THREE.OctahedronGeometry(0.03 + (i % 3) * 0.012, 0), glow(0xffd88a, 0.9), 0, 0, 0, scene)), a: R() * Math.PI * 2, r: R(), h: R() });
const cloth = new THREE.Group(); scene.add(cloth); mesh(new THREE.SphereGeometry(0.16, 10, 8).scale(1.2, 0.8, 1), mat(0xf6a531), 0, 0, 0, cloth); noOut(mesh(new THREE.SphereGeometry(0.28, 12, 8), glow(0xffd88a, 0.35), 0, 0, 0, cloth));
// ---------------- the cast
const C = makeCast(scene, [['k', 'krishna'], ['nar', 'narada'], ['q1', 'rukmini'], ['q2', 'satyabhama'], ['q3', 'gopi2'], ['g1', 'gopi1'], ['g2', 'gopi3'], ['g3', 'gopi2'], ['radha', 'gopi3'], ['dev', 'devotee']]);
C.radha.spec = Object.assign({}, C.radha.spec, { skin: '#f6d0b0', body: '#f6f1e2', top: (c, cx, hy) => { c.beginPath(); c.arc(cx, hy - 40, 6, 0, 7); c.fillStyle = '#d8263a'; c.fill(); } });
addOutlines(scene);
const confetti = makeConfetti(scene, 60, 42);

function update(s, t) {
  const v = camera.position.x > 20;
  S.mood(0); S.hemi.intensity = 1.4; S.sun.target.position.set(v ? 40 : 0, 0, 0); S.sun.position.set((v ? 40 : 0) - 8, 14, 10); S.sun.target.updateMatrixWorld();
  cl.forEach((l, i) => (l.flame.scale.y = 1 + 0.15 * Math.sin(t * 13 + i)));
  const right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0); right.y = 0; right.normalize();
  // --- Krishna in pain on the couch; healed the moment the dust touches his head
  const healed = s >= E.moment + 0.4, sitUp = sm(seg(s, E.moment, E.moment + 0.6));
  const KP = V(0.1, 0.32, -0.9);
  pose(C.k, camera, { visible: !v, x: KP.x, y: KP.y, z: KP.z, h: 1.75, sitting: true, mood: healed ? 'happy' : 'sad', arm: healed ? 'wave' : 'up' });
  if (!healed && !v) C.k.m.rotateZ(Math.sin(t * 7) * 0.05);
  const head = KP.clone().add(V(0, 0.32 + 1.3, 0.05));
  pain.visible = !v && !healed; pain.position.copy(head); pain.quaternion.copy(camera.quaternion); pain.scale.setScalar(1 + 0.18 * Math.sin(t * 9)); pain.material.opacity = 0.55 + 0.25 * Math.sin(t * 9);
  relief.visible = !v && s >= E.moment - 0.2 && s < E.thats2 + 0.5; relief.position.copy(head); relief.scale.setScalar(0.5 + sm(seg(s, E.moment - 0.2, E.moment + 0.6)) * 0.5); relief.material.opacity = 0.45 * (1 - sm(seg(s, E.moment + 0.6, E.thats2 + 0.5)));
  // --- Narada: asks, runs to the queens, runs to Vrindavan, brings back the dust
  let np, nps;
  if (!v) { if (s < E.narada2) { np = V(1.6, 0, 0.4); nps = { mood: 'wow', arm: s >= E.narada && s < E.krishna3 ? 'offer' : 'down', flip: true }; }
    else if (s < E.wait) { const w = sm(seg(s, E.narada2, E.narada2 + 0.6)); np = V(lerp(1.6, -1.5, w), 0, lerp(0.4, 1.4, w)); nps = { mood: s >= E.put ? 'sad' : 'normal', step: w < 1 ? s * 4 : 0, arm: 'offer' }; }
    else { const w = sm(seg(s, E.moment - 1.3, E.moment - 0.3)); np = V(lerp(-3, 0.7, w), 0, lerp(1.4, -0.4, w)); nps = { mood: 'happy', step: w < 1 ? s * 4 : 0, arm: 'offer', flip: true }; } }
  else { np = V(41.6, 0, 1.4); nps = { mood: s >= E.if ? 'wow' : 'normal', arm: s >= E.scooped ? 'offer' : 'down', flip: true }; }
  pose(C.nar, camera, { x: np.x, z: np.z, h: 1.7, ...nps });
  // the queens: gasp and refuse
  const refuse = s >= E.they && s < E.wait;
  [['q1', -2.2, 0.9], ['q2', -3.0, 0.2], ['q3', -1.4, 0.1]].forEach(([n, x, z], i) => pose(C[n], camera, { visible: !v && s >= E.narada2 - 0.3, x, z, h: 1.65, mood: refuse ? (s >= E.put + 0.8 ? 'sad' : 'wow') : 'normal', arm: refuse && s >= E.put + 1.2 && i === 0 ? 'point' : refuse ? 'up' : 'down' }));
  // --- the gopis: scoop dust from their feet without a second thought
  const scoop = s >= E.scooped;
  [['radha', 39.0, 0.4], ['g1', 38.1, 0.9], ['g2', 39.9, 1.0], ['g3', 40.8, 0.5]].forEach(([n, x, z], i) => pose(C[n], camera, { visible: v, x, z, h: n === 'radha' ? 1.62 : 1.58, mood: s >= E.if ? 'closed' : 'happy', arm: scoop && s < E.if + 0.8 ? 'offer' : s >= E.if ? 'up' : 'down', sitting: scoop && s < E.if }));
  dust.forEach(({ m, a, r, h }, i) => { const u = (t * 0.6 + h) % 1; m.visible = v && s >= E.scooped - 0.2; m.position.set(39.5 + Math.cos(a) * (0.4 + r * 1.4), 0.1 + u * 1.4, 0.7 + Math.sin(a) * 0.5); m.rotation.y = t * 3; });
  // the cloth of dust: from the gopis' hands to Krishna's head
  const gather = s >= E.if && v, carry = !v && s >= E.wait;
  cloth.visible = gather || (carry && s < E.moment + 0.4); if (gather) cloth.position.set(41.6, 0, 1.4).add(right.clone().multiplyScalar(-0.32)).add(V(0, 0.95, 0.05));
  if (carry) { const lay = sm(seg(s, E.moment - 0.3, E.moment + 0.1)); const hand = np.clone().add(right.clone().multiplyScalar(-0.32)).add(V(0, 0.95, 0.05)); cloth.position.copy(hand.lerp(head.clone().add(V(0, 0.05, 0)), lay)); }
  // --- the dust of Vrindavan today: a pilgrim touches it to the forehead
  pose(C.dev, camera, { visible: v && s >= E.thats2 - 0.2, x: 40.2, z: 1.8, h: 1.68, mood: 'closed', arm: 'up' });
  confetti(E.moment + 0.1, s, V(0.2, 2.8, -0.6));
  S.clouds.forEach((c, i) => { c.position.x = -80 + i * 15 + ((t * 0.6 + i * 3) % 12); });
}

const G = (t) => t, PAIN = (t) => E.dwarka + 1.0 + t * 0.2;
const SHOTS = [
  [0, E.as - 0.05, PAIN, [[0.3, 2.0, 2.4], [0.1, 1.85, -0.9]], [[0.28, 1.98, 2.0], [0.1, 1.85, -0.9]]],
  [E.as - 0.05, E.dwarka - 0.05, G, [[0, 3.2, 8], [0, 1.4, -1]], [[0, 2.6, 6.5], [0, 1.4, -1]]],
  [E.dwarka - 0.05, E.narada - 0.05, G, [[0.6, 1.9, 3.4], [0.1, 1.5, -0.9]], [[0.5, 1.9, 3.0], [0.1, 1.6, -0.9]]],
  [E.narada - 0.05, E.krishna3 - 0.05, G, [[1.0, 1.8, 3.6], [1.6, 1.5, 0.4]], [[1.1, 1.8, 3.3], [1.6, 1.5, 0.4]]],
  [E.krishna3 - 0.05, E.narada2 - 0.05, G, [[0.4, 2.0, 2.6], [0.1, 1.85, -0.9]], [[0.35, 2.0, 2.3], [0.1, 1.85, -0.9]]],
  [E.narada2 - 0.05, E.put - 0.05, G, [[-1.4, 2.0, 5.6], [-2.0, 1.4, 0.6]], [[-1.6, 1.9, 5.0], [-2.0, 1.4, 0.6]]],
  [E.put - 0.05, E.wait - 0.05, G, [[-2.2, 1.7, 3.2], [-2.2, 1.5, 0.9]], [[-2.2, 1.7, 2.9], [-2.2, 1.5, 0.9]]],
  [E.wait - 0.05, E.narada3 - 0.05, G, [[0.3, 2.0, 2.6], [0.1, 1.85, -0.9]], [[0.3, 2.0, 2.3], [0.1, 1.85, -0.9]]],
  [E.narada3 - 0.05, E.scooped - 0.05, G, [[40, 3.2, 8.5], [40, 1.0, 0]], [[40, 2.4, 6.6], [40, 1.0, 0.4]]],
  [E.scooped - 0.05, E.if - 0.05, G, [[39.3, 1.1, 3.2], [39.3, 0.6, 0.6]], [[39.3, 1.05, 2.9], [39.3, 0.6, 0.6]]],
  [E.if - 0.05, E.moment - 0.05, G, [[39.6, 1.8, 3.8], [39.6, 1.4, 0.6]], [[39.6, 1.8, 3.4], [39.6, 1.4, 0.6]]],
  [E.moment - 0.05, E.thats2 - 0.05, G, [[0.5, 2.0, 2.8], [0.2, 1.8, -0.9]], [[0.45, 2.0, 2.5], [0.2, 1.8, -0.9]]],
  [E.thats2 - 0.05, E.love - 0.05, G, [[40.2, 1.4, 4.2], [40.2, 1.0, 1.8]], [[40.2, 1.3, 3.8], [40.2, 0.9, 1.8]]],
  [E.love - 0.05, E.comment - 0.05, G, [[39.6, 2.2, 6.0], [39.6, 1.2, 0.6]], [[39.6, 2.0, 5.4], [39.6, 1.2, 0.6]]],
  [E.comment - 0.05, DURATION + 0.1, G, [[39.6, 2.3, 6.6], [39.6, 1.3, 0.6]], [[39.6, 2.3, 6.2], [39.6, 1.3, 0.6]]],
];
direct({ stage, WORDS, DURATION, shots: SHOTS, update, title: 1.6, q: [E.wait, E.narada3], cta: E.comment, prog: [E.wait, E.thats2], pin: E.wait,
  key: ['krishna', 'pain', 'cure', 'nobody', 'story', 'dwarka', 'headache', 'narada', 'dust', 'feet', 'loves', 'head', 'queens', 'gasped', 'sin', 'never', 'wait', 'vrindavan', 'gopis', 'second', 'scooped', 'gone', 'sacred', 'love', 'forgets', 'comment', 'radhe'],
  loc: (t) => (t >= E.as - 0.05 && t < E.dwarka + 0.6 ? '📍 DWARKA' : t >= E.narada3 - 0.05 && t < E.scooped - 0.05 ? '📍 VRINDAVAN' : t >= E.thats2 - 0.05 && t < E.love ? 'EVEN TODAY' : ''), shakes: [], tick: () => {} });
