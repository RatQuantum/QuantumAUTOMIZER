// Day 43 · "Why is Khatu Shyam worshipped?" · Why we do what we do #25 (as the story goes: Barbarik's gift)
// Strategy 8: opening on the moment of the gift (a kneeling warrior, a flash of gold, Krishna blessing); tracker; pinned banner.
// No gore: the gift is a flash of light; Barbarik then watches the war, glowing, from the hilltop.
// Sets: the road to Kurukshetra (origin), the battlefield with two armies (x = 40), the hilltop (x = 80), Khatu Shyam's shrine today (x = 120).
import * as THREE from './three.module.js';
import { rng, mat, mesh, sm, seg, lerp, clamp, setupScene, makeCast, pose, lamp, roundTree, palm } from './kit.js';
import { makeStage, direct, wordTime } from './director.js';
import { addOutlines, makeConfetti } from './plus.js';
import { WORDS, DURATION } from './data.js';

const stage = makeStage(), { scene, camera } = stage, V = (x, y, z) => new THREE.Vector3(x, y, z), R = rng(43);
const S = setupScene(scene, [[0, 0], [40, 0], [80, 0], [120, 0]], 43);
const WT = wordTime(WORDS);
const E = { as: WT('as'), before: WT('before'), named: WT('named'), but: WT('but'), and: WT('and', 2), mother: WT('mother'), krishna2: WT('knew') - 0.32, whichever: WT('whichever'), so: WT('so'), wait: WT('wait'),
  he: WT('asked') - 0.14, and2: WT('gave', 3) - 0.7, smiling: WT('smiling'), krishna4: WT('placed') - 0.42, blessed: WT('blessed'), in: WT('in', 2), shyam: WT('shyam'), thats: WT("that's"), comment: WT('comment') };
const glow = (c, o = 0.5) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, depthWrite: false, blending: THREE.AdditiveBlending });
const noOut = (m) => { m.userData.noOutline = true; m.castShadow = false; return m; };

// ---------------- the road: a dusty path, trees, Barbarik's blue horse
mesh(new THREE.CylinderGeometry(10, 10, 0.06, 24), mat(0xc9a46a), 0, 0.03, 0, scene).castShadow = false;
noOut(mesh(new THREE.BoxGeometry(2.4, 0.02, 20), mat(0xd9c08a), 0, 0.07, 0, scene));
for (let i = 0; i < 8; i++) (i % 2 ? roundTree : palm)(scene, (i % 2 ? 1 : -1) * (4 + (i % 3)), -8 + i * 2.2, R, 1);
function horse(x, z, col) { const g = new THREE.Group(); g.position.set(x, 0, z); scene.add(g); const w = mat(col); mesh(new THREE.BoxGeometry(1.0, 0.45, 0.32), w, 0, 1.0, 0, g); const nk = mesh(new THREE.BoxGeometry(0.22, 0.6, 0.22), w, 0.5, 1.35, 0, g); nk.rotation.z = -0.5; mesh(new THREE.BoxGeometry(0.42, 0.2, 0.2), w, 0.72, 1.62, 0, g); noOut(mesh(new THREE.BoxGeometry(0.5, 0.06, 0.36), mat(0xd8263a), 0, 1.25, 0, g)); for (const [dx, dz] of [[-0.38, -0.1], [-0.38, 0.1], [0.38, -0.1], [0.38, 0.1]]) mesh(new THREE.BoxGeometry(0.1, 0.8, 0.1).translate(0, -0.4, 0), w, dx, 0.82, dz, g); return g; }
const blueHorse = horse(1.6, -0.6, 0x3f6fd0); blueHorse.rotation.y = -0.4;
// the three arrows
const arrows = []; for (let i = 0; i < 3; i++) { const g = new THREE.Group(); scene.add(g); noOut(mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.0, 5).rotateZ(Math.PI / 2), glow(0x9fe8ff, 1), 0, 0, 0, g)); noOut(mesh(new THREE.ConeGeometry(0.07, 0.18, 5).rotateZ(-Math.PI / 2), glow(0xffffff, 1), 0.56, 0, 0, g)); noOut(mesh(new THREE.SphereGeometry(0.22, 10, 8), glow(0x6ac8ff, 0.35), 0, 0, 0, g)); arrows.push(g); }
const flash = noOut(mesh(new THREE.SphereGeometry(1, 20, 14), glow(0xfff0c0, 0), 0, 0, 0, scene));
// ---------------- the battlefield (x = 40): two armies that shrink as he switches sides
mesh(new THREE.CylinderGeometry(20, 20, 0.06, 28), mat(0xc9a46a), 40, 0.03, 0, scene).castShadow = false;
function army(x0, col, n, seed) { const r = rng(seed), body = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.16, 0.2, 0.7, 6), mat(col), n), head = new THREE.InstancedMesh(new THREE.SphereGeometry(0.13, 8, 6), mat(0xc98a5e), n); [body, head].forEach((m) => { m.userData.noOutline = true; scene.add(m); }); const P = []; for (let i = 0; i < n; i++) P.push([x0 + (r() - 0.5) * 6, (r() - 0.5) * 7 - 1, r()]); return { body, head, P }; }
const armies = [army(35.5, 0x2f6fa8, 220, 1), army(44.5, 0x8a1a2a, 220, 2)];
const m4 = new THREE.Matrix4(), zero = new THREE.Matrix4().makeScale(0, 0, 0);
// ---------------- the hilltop (x = 80)
const hill = mesh(new THREE.ConeGeometry(4.5, 3.6, 10), mat(0x6fbf45), 80, 1.8, -1, scene); hill.scale.z = 0.8;
for (let i = 0; i < 5; i++) roundTree(scene, 76 + i * 2, -4.6 - (i % 2), R, 0.7);
const aura = noOut(mesh(new THREE.RingGeometry(0.75, 0.95, 32), glow(0xffd88a, 0.5), 80, 4.75, -1.15, scene));
const miniArmies = [army(77.5, 0x2f6fa8, 60, 3), army(82.5, 0x8a1a2a, 60, 4)]; miniArmies.forEach((a) => a.P.forEach((p) => (p[1] = p[1] * 0.4 + 5.2)));
// ---------------- Khatu Shyam's shrine today (x = 120)
const T = new THREE.Group(); T.position.set(120, 0, 0); scene.add(T);
mesh(new THREE.BoxGeometry(12, 0.1, 9), mat(0xf3e6c8), 0, 0.05, 0, T).castShadow = false; mesh(new THREE.BoxGeometry(12, 8, 0.3), mat(0x2f3fa8), 0, 4, -3, T);
mesh(new THREE.BoxGeometry(3.2, 1.0, 1.4), mat(0x8a4b20), 0, 0.5, -2.2, T); mesh(new THREE.BoxGeometry(3.3, 0.08, 1.5), mat(0xffd23a), 0, 1.02, -2.2, T);
for (let i = 0; i < 26; i++) { const a = i / 25 * Math.PI; noOut(mesh(new THREE.SphereGeometry(0.11, 6, 4), mat([0xf6a531, 0xffffff, 0xe0213a][i % 3]), Math.cos(a) * 1.3, 2.0 + Math.sin(a) * 1.5, -2.6, T)); }
const flags = []; for (const x of [-3.6, 3.6]) { mesh(new THREE.CylinderGeometry(0.04, 0.04, 3.4, 6), mat(0x8a5a2a), x, 1.7, -1.6, T); flags.push(mesh(new THREE.ConeGeometry(0.5, 1.1, 3).rotateZ(-Math.PI / 2), mat(0xf6a531), x + 0.55, 3.0, -1.6, T)); }
const tl = [lamp(T, -1.4, 1.06, -1.8, 0.6), lamp(T, 1.4, 1.06, -1.8, 0.6)];
// ---------------- the cast
const C = makeCast(scene, [['b', 'arjuna'], ['k', 'krishna'], ['mom', 'yashoda'], ['bHill', 'arjuna'], ['shrine', 'arjuna'], ['d1', 'devotee'], ['d2', 'gopi1'], ['d3', 'kid2'], ['d4', 'crowd']]);
const barb = Object.assign({}, C.b.spec, { body: '#2f9d5a', skin: '#a8714c', bodyDeco: (c, cx, y, w, h) => { c.fillStyle = '#ffd23a'; c.fillRect(cx - w / 2, y + 30, w, 16); c.fillRect(cx - w / 2, y + h * 0.55, w, 14); } });
C.b.spec = barb; C.bHill.spec = barb; C.shrine.spec = Object.assign({}, barb, { skin: '#3a5ab0' });
addOutlines(scene);
const confetti = makeConfetti(scene, 60, 43);

function update(s, t) {
  const cx = camera.position.x, set = cx > 100 ? 120 : cx > 60 ? 80 : cx > 20 ? 40 : 0;
  S.mood(set === 80 ? 0.25 : 0); S.hemi.intensity = 1.4; S.sun.target.position.set(set, 0, 0); S.sun.position.set(set - 8, 14, 10); S.sun.target.updateMatrixWorld();
  const right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0); right.y = 0; right.normalize();
  // --- the road: Barbarik walks with three arrows; his mother (flashback); Krishna meets him and asks for the gift
  const gift = s >= E.he, gone = s >= E.and2 + 0.5 && s < E.thats;
  const walk = sm(seg(s, E.before, E.named + 1.4));
  const BP = gift ? V(0.6, 0, 0.6) : V(0.6, 0, lerp(6, 0.6, walk));
  pose(C.b, camera, { visible: set === 0 && !gone || (set === 0 && s < E.as), x: BP.x, z: BP.z, h: 1.78, bow: true, sitting: gift && s >= E.and2 - 0.3, step: walk > 0 && walk < 1 && !gift ? s * 3 : 0, mood: s >= E.smiling - 0.4 || s < E.as ? 'happy' : s >= E.mother - 0.3 && s < E.krishna2 ? 'closed' : 'normal', arm: s >= E.and2 - 0.3 || s < E.as ? 'up' : 'down' });
  pose(C.k, camera, { visible: set === 0 && (s >= E.krishna2 - 0.3 || s < E.as), x: -0.9, z: 0.5, h: 1.78, mood: s >= E.smiling ? 'closed' : 'happy', arm: s >= E.he && s < E.and2 ? 'offer' : s >= E.and2 || s < E.as ? 'up' : 'down', flip: false });
  pose(C.mom, camera, { visible: set === 0 && s >= E.and - 0.1 && s < E.krishna2 - 0.1, x: 2.3, z: 1.4, h: 1.62, mood: 'closed', arm: 'offer', flip: true });
  blueHorse.visible = set === 0; blueHorse.children.forEach((c, i) => { if (i > 5) c.rotation.z = walk > 0 && walk < 1 ? Math.sin(t * 9 + i) * 0.3 : 0; });
  // the three arrows orbit him, then race over the field
  arrows.forEach((g, i) => { const a = t * 2 + i * 2.1; g.visible = (set === 0 && s >= E.named && s < E.krishna2) || (set === 40 && s >= E.but && s < E.and); if (set === 0) { g.position.set(BP.x + Math.cos(a) * 0.8, 1.6 + Math.sin(a * 1.3) * 0.2, BP.z + Math.sin(a) * 0.5); g.rotation.y = -a; }
    else { const u = (s - E.but) / 3.0; g.position.set(32 + ((u * 16 + i * 3) % 16), 2.4 + i * 0.5, -3 + i * 2); g.rotation.y = 0; } });
  // the gift: a flash of gold, and he is gone from the road
  const fu = s - E.and2 - 0.2; flash.visible = set === 0 && fu > 0 && fu < 1.0; flash.position.set(BP.x, 1.3, BP.z); flash.scale.setScalar(0.4 + fu * 1.6); flash.material.opacity = 0.7 * (1 - fu);
  if (set === 0 && s < E.as) { flash.visible = true; flash.position.set(BP.x, 1.3, BP.z); flash.scale.setScalar(0.7 + 0.05 * Math.sin(t * 6)); flash.material.opacity = 0.18; }
  // --- the battlefield: whichever side he joins starts winning; he switches again and again; the armies dwindle
  const sw = s >= E.whichever ? Math.floor((s - E.whichever) * 1.2) : 0, side = sw % 2;
  const left = s < E.whichever ? 1 : Math.max(0.05, 1 - (s - E.whichever) / (E.wait - E.whichever));
  armies.forEach(({ body, head, P }, k) => { P.forEach(([x, z, ph], i) => { const on = ph < left || set !== 40; if (!on) { body.setMatrixAt(i, zero); head.setMatrixAt(i, zero); return; } const b = Math.sin(t * 3 + ph * 9) * 0.02; m4.makeTranslation(x, 0.45 + b, z); body.setMatrixAt(i, m4); m4.makeTranslation(x, 0.93 + b, z); head.setMatrixAt(i, m4); }); body.instanceMatrix.needsUpdate = head.instanceMatrix.needsUpdate = true; body.visible = head.visible = set === 40; });
  // Barbarik on the field: hops from side to side
  if (set === 40) pose(C.b, camera, { visible: s >= E.whichever - 0.2, x: side ? 42.4 : 37.6, y: Math.abs(Math.sin(((s - E.whichever) * 1.2 % 1) * Math.PI)) * 0.6, z: 2.4, h: 1.78, bow: true, mood: 'normal', arm: 'up', flip: !side });
  // --- the hilltop: he watches the whole war, glowing
  miniArmies.forEach(({ body, head, P }) => { P.forEach(([x, z, ph], i) => { const b = Math.abs(Math.sin(t * 6 + ph * 9)) * 0.05; m4.makeTranslation(x, 0.45 + b - 0.0, z - 12.5); body.setMatrixAt(i, m4); m4.makeTranslation(x, 0.93 + b, z - 12.5); head.setMatrixAt(i, m4); }); body.instanceMatrix.needsUpdate = head.instanceMatrix.needsUpdate = true; body.visible = head.visible = set === 80; });
  pose(C.bHill, camera, { visible: set === 80, x: 80, y: 3.55, z: -1, h: 1.4, mood: s >= E.blessed ? 'happy' : 'closed', arm: s >= E.in ? 'up' : 'down' });
  aura.visible = set === 80; aura.quaternion.copy(camera.quaternion); aura.scale.setScalar(1 + 0.08 * Math.sin(t * 3)); aura.material.opacity = 0.35 + sm(seg(s, E.blessed, E.blessed + 0.6)) * 0.35;
  // --- today: Khatu Shyam's shrine; devotees with saffron flags
  pose(C.shrine, camera, { visible: set === 120, x: 120, y: 1.06, z: -2.4, h: 1.9, mood: 'happy' }); C.shrine.m.quaternion.identity();
  [['d1', 118.2, 0.8], ['d2', 119.3, 1.3], ['d3', 120.6, 1.4], ['d4', 121.7, 0.9]].forEach(([n, x, z], i) => pose(C[n], camera, { visible: set === 120, x, z, h: n === 'd3' ? 1.2 : 1.65, mood: 'closed', arm: Math.sin(t * 3 + i) > -0.3 ? 'up' : 'offer' }));
  flags.forEach((f, i) => (f.rotation.y = Math.sin(t * 3 + i) * 0.3)); tl.forEach((l, i) => (l.flame.scale.y = 1 + 0.15 * Math.sin(t * 13 + i)));
  confetti(E.shyam, s, V(80, 5.6, 0));
  S.clouds.forEach((c, i) => { c.position.x = -80 + i * 15 + ((t * 0.6 + i * 3) % 12); });
}

const G = (t) => t, GIFT = (t) => E.and2 + 0.05 + t * 0.08;
const SHOTS = [
  [0, E.as - 0.05, GIFT, [[-0.15, 1.5, 4.6], [-0.15, 1.3, 0.5]], [[-0.15, 1.5, 4.6], [-0.15, 1.3, 0.5]], [55, 30], { move: 'dolly' }],
  [E.as - 0.05, E.before - 0.05, G, [[0, 5, 14], [0, 1, 0]], [[0, 3.6, 12], [0, 1, 2]]],
  [E.before - 0.05, E.named + 1.0, G, [[2.6, 1.8, 9.5], [0.6, 1.2, 4.0]], [[2.6, 1.8, 8.0], [0.6, 1.2, 2.6]]],
  [E.named + 1.0, E.but - 0.05, G, [[0.9, 1.9, 3.4], [0.6, 1.6, 0.6]], [[0.9, 1.9, 3.0], [0.6, 1.6, 0.6]]],
  [E.but - 0.05, E.and - 0.05, G, [[40, 1.6, 4.0], [40, 1.0, -1]], [[40, 8, 15], [40, 0.5, -1]], 50, { move: 'pull' }],
  [E.and - 0.05, E.krishna2 - 0.05, G, [[1.6, 1.8, 4.4], [1.6, 1.4, 0.9]], [[1.6, 1.8, 4.0], [1.6, 1.4, 0.9]]],
  [E.krishna2 - 0.05, E.whichever - 0.05, G, [[-0.8, 1.85, 3.0], [-0.9, 1.65, 0.5]], [[-0.8, 1.85, 2.7], [-0.9, 1.65, 0.5]]],
  [E.whichever - 0.05, E.wait - 0.05, G, [[40, 4.5, 11], [40, 1.0, 0]], [[40, 3.8, 9.5], [40, 1.0, 0]]],
  [E.wait - 0.05, E.he - 0.05, G, [[0.6, 1.9, 3.2], [0.6, 1.6, 0.6]], [[0.6, 1.9, 2.9], [0.6, 1.6, 0.6]]],
  [E.he - 0.05, E.and2 - 0.05, G, [[-0.2, 1.6, 4.6], [-0.1, 1.3, 0.5]], [[-0.2, 1.6, 4.0], [-0.1, 1.3, 0.5]]],
  [E.and2 - 0.05, E.krishna4 - 0.05, G, [[0.0, 1.4, 3.6], [0.0, 1.1, 0.55]], [[0.0, 1.4, 3.6], [0.0, 1.1, 0.55]], [50, 24], { move: 'dolly' }],
  [E.krishna4 - 0.05, E.blessed - 0.05, G, [[80, 2.4, 12.5], [80, 1.8, -1]], [[80, 4.6, 6.5], [80, 4.4, -1]], 50, { move: 'crane', lift: 1.6 }],
  [E.blessed - 0.05, E.thats - 0.05, G, [[80, 4.6, 3.4], [80, 4.4, -1]], [[80, 4.6, 3.0], [80, 4.4, -1]]],
  [E.thats - 0.05, E.comment - 0.05, G, [[120, 2.6, 8.4], [120, 1.8, -1.5]], [[120, 2.0, 5.6], [120, 1.8, -1.5]], 50, { move: 'land' }],
  [E.comment - 0.05, DURATION + 0.1, G, [[120, 1.7, 6.6], [120, 2.2, -1.5]], [[120, 1.7, 6.2], [120, 2.2, -1.5]]],
];
direct({ stage, WORDS, DURATION, shots: SHOTS, update, title: 1.6, q: [E.wait, E.he], cta: E.comment, prog: [E.wait, E.thats], pin: E.wait,
  key: ['warrior', 'head', 'krishna', 'name', 'story', 'barbarik', 'kurukshetra', 'three', 'arrows', 'war', 'minute', 'promised', 'mother', 'losing', 'switch', 'left', 'wait', 'gift', 'smiling', 'hilltop', 'blessed', 'worshipped', 'shyam', 'khatu', 'comment'],
  loc: (t) => (t >= E.as - 0.05 && t < E.before - 0.05 ? '📍 ON THE WAY TO KURUKSHETRA' : t >= E.and - 0.05 && t < E.krishna2 - 0.05 ? 'HIS PROMISE' : t >= E.thats - 0.05 && t < E.comment ? '📍 KHATU, RAJASTHAN · TODAY' : ''), shakes: [E.and2 + 0.2], tick: () => {} });
