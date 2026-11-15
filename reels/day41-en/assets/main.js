// Day 41 · "Why do we play Holi with colors?" · Why we do what we do #23 (as the story goes: Krishna, Yashoda, Radha)
// Strategy 8: emotional opening frame (Krishna crying), stakes-and-gap line, progress tracker, pinned comment banner.
// Sets: the riverbank in Vrindavan (origin), Yashoda's courtyard (x = 40), the village square (x = 80) that turns into Holi.
import * as THREE from './three.module.js';
import { rng, mat, mesh, sm, seg, lerp, clamp, setupScene, makeCast, pose, hut, roundTree, cow } from './kit.js';
import { makeStage, direct, wordTime } from './director.js';
import { addOutlines, makeConfetti } from './plus.js';
import { WORDS, DURATION } from './data.js';

const stage = makeStage(), { scene, camera } = stage, V = (x, y, z) => new THREE.Vector3(x, y, z), R = rng(41);
const S = setupScene(scene, [[0, 0], [40, 0], [80, 0]], 41);
const WT = wordTime(WORDS);
const E = { and: WT('and'), as: WT('as'), krishna2: WT('looked') - 0.18, then: WT('then'), he: WT('ran') - 0.1, mother: WT('mother', 2), shell: WT("she'll"), yashoda2: WT('laughed') - 0.44, wait: WT('wait'), go: WT('go', 3),
  so: WT('grabbed') - 0.52, she: WT('laughed', 2) - 0.22, soon: WT('soon'), thats: WT("that's", 2), love: WT('love'), comment: WT('comment') };
const glow = (c, o = 0.5) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, depthWrite: false, blending: THREE.AdditiveBlending });
const noOut = (m) => { m.userData.noOutline = true; m.castShadow = false; return m; };
const COLS = ['#e8306a', '#ffd23a', '#3fbf5a', '#3f8fe0', '#ff7a1e', '#b04ad8'], COLN = COLS.map((c) => new THREE.Color(c).getHex());

// ---------------- the riverbank
mesh(new THREE.CylinderGeometry(8, 8, 0.06, 24), mat(0x8ad84a), 0, 0.03, 2, scene).castShadow = false;
const river = noOut(mesh(new THREE.PlaneGeometry(30, 5, 30, 5).rotateX(-Math.PI / 2), mat(0x3f9fd8, { r: 0.15, m: 0.2 }), 0, 0.06, -1.5, scene)); const rb = river.geometry.attributes.position.array.slice();
roundTree(scene, -4, -4.5, R, 1.2); roundTree(scene, 4.2, -5, R, 1.0); roundTree(scene, -5.5, 3, R, 0.9);
// ---------------- Yashoda's courtyard (x = 40)
const Y = new THREE.Group(); Y.position.set(40, 0, 0); scene.add(Y);
mesh(new THREE.BoxGeometry(12, 0.1, 9), mat(0xd9b77a), 0, 0.05, 0, Y).castShadow = false; mesh(new THREE.BoxGeometry(12, 3.2, 0.4), mat(0xe0b07a), 0, 1.6, -3, Y);
for (let i = 0; i < 8; i++) noOut(mesh(new THREE.CircleGeometry(0.17, 8), mat(i % 2 ? 0xffffff : 0xf6a531), -4.9 + i * 1.4, 2.4, -2.78, Y));
const pots = []; for (let i = 0; i < 6; i++) { const g = new THREE.Group(); g.position.set(-1.6 + i * 0.32, 0.1, -2.3); Y.add(g); mesh(new THREE.CylinderGeometry(0.13, 0.1, 0.18, 10), mat(0xc8643a), 0, 0.09, 0, g); noOut(mesh(new THREE.SphereGeometry(0.12, 8, 6).scale(1, 0.45, 1), mat(COLN[i]), 0, 0.2, 0, g)); pots.push(g); }
const tears = [0, 1].map(() => noOut(mesh(new THREE.SphereGeometry(0.03, 6, 4).scale(0.8, 1.3, 0.8), mat(0x7fc8ff), 0, 0, 0, scene)));
// ---------------- the village square (x = 80)
const H = new THREE.Group(); H.position.set(80, 0, 0); scene.add(H);
mesh(new THREE.CylinderGeometry(9, 9, 0.06, 24), mat(0xd9b77a), 0, 0.03, 0, H).castShadow = false;
[[-5, -3.5, 0.3], [0, -4.6, 0], [5, -3.5, -0.3], [-6.5, 2, 1], [6.5, 2.5, -1]].forEach(([x, z, r]) => hut(H, x, z, R, r)); cow(H, 5.6, -0.6, -0.6, R);
const groundPaint = []; for (let i = 0; i < 40; i++) { const a = R() * Math.PI * 2, r = R() * 5; const m = noOut(mesh(new THREE.CircleGeometry(0.25 + R() * 0.45, 10).rotateX(-Math.PI / 2), mat(COLN[i % 6]), 80 + Math.cos(a) * r, 0.065 + i * 0.0004, Math.sin(a) * r * 0.7, scene)); groundPaint.push(m); }
// colour clouds (gulal): soft puffs thrown in arcs, and drifting haze
const puffs = []; for (let i = 0; i < 70; i++) puffs.push({ m: noOut(mesh(new THREE.SphereGeometry(0.22, 10, 8), new THREE.MeshBasicMaterial({ color: COLN[i % 6], transparent: true, opacity: 0, depthWrite: false }), 0, 0, 0, scene)), ph: R(), a: R() * Math.PI * 2, r: 1 + R() * 4, h: R() });
const handPuff = noOut(mesh(new THREE.SphereGeometry(0.12, 10, 8), mat(0xe8306a), 0, 0, 0, scene));
const thrown = []; for (let i = 0; i < 14; i++) thrown.push(noOut(mesh(new THREE.SphereGeometry(0.16, 10, 8), new THREE.MeshBasicMaterial({ color: 0xe8306a, transparent: true, opacity: 0.8, depthWrite: false }), 0, 0, 0, scene)));
// ---------------- the cast
const C = makeCast(scene, [['k', 'kidKrishna'], ['radha', 'gopi3'], ['y', 'yashoda'], ['v1', 'kid1'], ['v2', 'kid2'], ['v3', 'gopi1'], ['v4', 'govinda'], ['v5', 'gopi2'], ['v6', 'kid4'], ['reflect', 'kidKrishna']]);
C.radha.spec = Object.assign({}, C.radha.spec, { skin: '#f6d0b0', body: '#f6f1e2', top: (c, cx, hy) => { c.beginPath(); c.arc(cx, hy - 40, 6, 0, 7); c.fillStyle = '#d8263a'; c.fill(); } });
addOutlines(scene);
const confetti = makeConfetti(scene, 90, 41);

function update(s, t) {
  const cx = camera.position.x, set = cx > 60 ? 80 : cx > 20 ? 40 : 0, holi = set === 80 && s >= E.soon - 0.3;
  S.mood(0); S.hemi.intensity = 1.45; S.sun.target.position.set(set, 0, 0); S.sun.position.set(set - 8, 14, 10); S.sun.target.updateMatrixWorld();
  const rp = river.geometry.attributes.position; for (let i = 0; i < rp.count; i++) rp.setY(i, Math.sin(rb[i * 3] * 1.2 + t * 1.2) * 0.02); rp.needsUpdate = true;
  const right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0); right.y = 0; right.normalize();
  // --- riverbank: Krishna looks at his reflection, then at fair Radha
  pose(C.k, camera, set === 0 ? { x: -0.6, z: 0.8, h: 1.2, mood: s >= E.then + 0.6 ? 'sad' : 'normal', arm: 'down' } : set === 40 ? { x: 40.5, z: 0.5, h: 1.2, mood: s >= E.yashoda2 + 0.4 ? 'happy' : 'sad', arm: s >= E.mother && s < E.shell + 0.6 ? 'point' : 'down', step: s >= E.he - 0.1 && s < E.he + 0.8 ? s * 4 : 0 }
    : { x: lerp(78.6, 80.3, sm(seg(s, E.so, E.so + 1.2))), z: 1.2, h: 1.2, mood: 'happy', arm: s >= E.so + 1.0 && s < E.she ? 'up' : holi ? (Math.sin(t * 5) > 0 ? 'up' : 'wave') : 'offer', paint: s >= E.she + 0.3 ? COLS.slice(0, 3).join(',') : undefined, step: s >= E.so && s < E.so + 1.2 ? s * 4 : 0, y: holi ? Math.abs(Math.sin(t * 5)) * 0.08 : 0 });
  pose(C.reflect, camera, { visible: set === 0 && s < E.then + 0.6, x: -0.6, y: 0.08, z: -0.25, h: 1.2, mood: 'normal' }); if (C.reflect.m.visible) { C.reflect.m.scale.y *= -1; C.reflect.m.material.opacity = 0.55; C.reflect.m.material.transparent = true; }
  const radhaPaint = s >= E.so + 1.3 ? '#e8306a,#e8306a,#ff7a1e' : undefined;
  pose(C.radha, camera, set === 0 ? { x: 1.4, z: 0.6, h: 1.25, mood: 'happy', arm: 'down', flip: true } : set === 80 ? { x: 81.2, z: 1.0, h: 1.25, mood: s >= E.so + 1.2 && s < E.she ? 'wow' : 'happy', arm: s >= E.she && s < E.soon ? 'offer' : holi ? 'wave' : 'down', flip: true, paint: radhaPaint, y: holi ? Math.abs(Math.sin(t * 5 + 1)) * 0.08 : 0 } : { visible: false });
  // --- Yashoda: listens, laughs, whispers the secret; pots of colour
  pose(C.y, camera, { visible: set === 40, x: 39.3, z: 0.2, h: 1.65, mood: s >= E.yashoda2 ? 'happy' : 'normal', arm: s >= E.go - 0.2 && s < E.so ? 'point' : s >= E.yashoda2 ? 'offer' : 'down' });
  tears.forEach((d, i) => { d.visible = set === 40 && s >= E.he && s < E.yashoda2 + 0.2 || (s < E.and && set === 40); const u = (t * 1.1 + i * 0.5) % 1; d.position.set(40.5 + (i ? 0.13 : -0.13) * 1.2 / 1.7, 1.02 - u * 0.25, 0.58); });
  // --- the village square: the first handful of red, then everyone
  handPuff.visible = set === 80 && s >= E.so && s < E.so + 1.3; handPuff.position.set(80.3, 0, 1.2).add(right.clone().multiplyScalar(0.28 * 1.2 / 1.7)).add(V(0, 0.7, 0.05));
  thrown.forEach((p, i) => { const u = s - E.so - 1.1 - i * 0.012; p.visible = set === 80 && u > 0 && u < 0.7; p.position.set(80.6 + u * 1.0 + Math.cos(i) * u * 0.4, 1.05 + Math.sin(i * 2) * u * 0.4, 1.1 + Math.sin(i) * u * 0.3); p.scale.setScalar(0.5 + u * 2); p.material.opacity = 0.8 * (1 - u / 0.7); });
  const vill = [['v1', 77.6, 0.2], ['v2', 82.6, 0.4], ['v3', 78.4, -1.3], ['v4', 81.8, -1.4], ['v5', 76.6, -0.6], ['v6', 83.4, -0.5]];
  vill.forEach(([n, x, z], i) => pose(C[n], camera, { visible: set === 80, x, z, h: n.length && (n === 'v1' || n === 'v2' || n === 'v6') ? 1.15 : 1.6, flip: x > 80, mood: holi ? 'happy' : 'normal', arm: holi ? (Math.sin(t * 4 + i) > 0 ? 'up' : 'wave') : 'down', paint: holi ? [COLS[i % 6], COLS[(i + 2) % 6], COLS[(i + 4) % 6]].join(',') : undefined, y: holi ? Math.abs(Math.sin(t * 4 + i)) * 0.08 : 0 }));
  const spread = sm(seg(s, E.soon - 0.2, E.soon + 2.4));
  groundPaint.forEach((m, i) => { m.visible = spread > i / groundPaint.length; });
  puffs.forEach(({ m, ph, a, r, h }) => { const u = (t * 0.35 + ph) % 1; m.visible = set === 80 && spread > 0.05; m.position.set(80 + Math.cos(a + u) * r, 0.4 + h * 2.2 + u * 1.2, 0.2 + Math.sin(a + u) * r * 0.5); m.scale.setScalar((0.8 + u * 2.4) * spread); m.material.opacity = 0.55 * Math.sin(u * Math.PI) * spread; });
  confetti(E.thats, s, V(80, 3.2, 0.8));
  S.clouds.forEach((c, i) => { c.position.x = -80 + i * 15 + ((t * 0.6 + i * 3) % 12); });
}

const G = (t) => t, CRY = (t) => E.he + 0.4 + t * 0.15, PARTY = (t) => E.soon + 2.4 + (t - E.and) * 0.5;
const SHOTS = [
  [0, E.and - 0.05, CRY, [[40.55, 1.0, 2.0], [40.5, 0.85, 0.5]], [[40.55, 0.98, 1.75], [40.5, 0.85, 0.5]]],
  [E.and - 0.05, E.as - 0.05, PARTY, [[80, 2.4, 6.6], [80, 1.1, 0]], [[80, 2.2, 5.8], [80, 1.1, 0]]],
  [E.as - 0.05, E.krishna2 - 0.05, G, [[0, 3.6, 9], [0, 0.8, -0.5]], [[0, 2.6, 7], [0, 0.8, 0]]],
  [E.krishna2 - 0.05, E.then - 0.05, G, [[-0.55, 1.5, 2.6], [-0.6, 0.3, -0.2]], [[-0.55, 1.45, 2.3], [-0.6, 0.3, -0.2]]],
  [E.then - 0.05, E.he - 0.05, G, [[1.3, 1.1, 3.0], [1.4, 0.85, 0.6]], [[1.3, 1.1, 2.7], [1.4, 0.85, 0.6]]],
  [E.he - 0.05, E.mother - 0.05, G, [[40, 2.4, 6.4], [40, 1.0, 0]], [[40, 2.2, 5.6], [40, 1.0, 0]]],
  [E.mother - 0.05, E.yashoda2 - 0.05, G, [[40.55, 1.0, 2.0], [40.5, 0.85, 0.5]], [[40.55, 0.98, 1.8], [40.5, 0.85, 0.5]]],
  [E.yashoda2 - 0.05, E.wait - 0.05, G, [[39.7, 1.7, 3.2], [39.6, 1.3, 0.2]], [[39.7, 1.7, 2.9], [39.6, 1.3, 0.2]]],
  [E.wait - 0.05, E.go - 0.05, G, [[40.3, 1.1, 2.4], [40.4, 0.9, 0.5]], [[40.3, 1.1, 2.2], [40.4, 0.9, 0.5]]],
  [E.go - 0.05, E.so - 0.05, G, [[40.2, 0.9, 1.0], [39.0, 0.3, -2.3]], [[40.0, 0.85, 0.8], [39.0, 0.3, -2.3]]],
  [E.so - 0.05, E.she - 0.05, G, [[80.7, 1.3, 4.2], [80.7, 0.9, 1.1]], [[80.75, 1.25, 3.8], [80.75, 0.9, 1.1]]],
  [E.she - 0.05, E.soon - 0.05, G, [[81.2, 1.0, 2.6], [81.2, 0.9, 1.0]], [[81.1, 1.0, 2.4], [81.1, 0.9, 1.0]]],
  [E.soon - 0.05, E.thats - 0.05, G, [[80, 4.0, 9], [80, 1.0, 0]], [[80, 2.6, 7.0], [80, 1.1, 0]]],
  [E.thats - 0.05, E.love - 0.05, G, [[80.75, 1.3, 3.6], [80.75, 0.95, 1.1]], [[80.75, 1.3, 3.3], [80.75, 0.95, 1.1]]],
  [E.love - 0.05, E.comment - 0.05, G, [[79.6, 1.8, 5.4], [80.6, 1.0, 0.8]], [[80.4, 1.8, 5.2], [80.6, 1.0, 0.8]]],
  [E.comment - 0.05, DURATION + 0.1, G, [[80, 2.4, 6.6], [80, 1.1, 0]], [[80, 2.3, 6.2], [80, 1.1, 0]]],
];
direct({ stage, WORDS, DURATION, shots: SHOTS, update, title: 1.6, q: [E.wait, E.go], cta: E.comment, prog: [E.wait, E.thats], pin: E.wait,
  key: ['krishna', 'cried', 'mother', 'girl', 'holi', 'colors', 'story', 'blue', 'radha', 'fair', 'bright', 'yashoda', 'tears', 'dark', 'never', 'laughed', 'secret', 'wait', 'color', 'red', 'powder', 'cheeks', 'village', 'yellow', 'green', 'pink', 'love', 'comment', 'tag'],
  loc: (t) => (t >= E.as - 0.05 && t < E.krishna2 - 0.05 ? '📍 VRINDAVAN · LONG AGO' : ''), shakes: [], tick: () => {} });
