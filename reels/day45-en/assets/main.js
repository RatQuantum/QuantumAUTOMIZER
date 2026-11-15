// Day 45 · "Why did Krishna never play the flute again?" · Why we do what we do #27 (as the story goes: leaving Vrindavan)
// Strategy 8 hook/tracker/pinned CTA + Strategy 9 camera moves.
// Sets: Vrindavan's road (origin; the chariot leaves toward -z), the riverbank at dusk (x = 40), a Dwarka balcony at night (x = 80),
// a Radha-Krishna altar today (x = 120).
import * as THREE from './three.module.js';
import { rng, mat, mesh, sm, seg, lerp, clamp, setupScene, makeCast, pose, lamp, hut, cow, roundTree } from './kit.js';
import { makeStage, direct, wordTime } from './director.js';
import { addOutlines, makeConfetti } from './plus.js';
import { WORDS, DURATION } from './data.js';

const stage = makeStage(), { scene, camera } = stage, V = (x, y, z) => new THREE.Vector3(x, y, z), R = rng(45);
const S = setupScene(scene, [[0, -6], [40, 0], [80, 0], [120, 0]], 45);
const WT = wordTime(WORDS);
const E = { as: WT('as'), one: WT('one'), akrura: WT('akrura'), the: WT('whole') - 0.18, the2: WT('cows') - 0.26, mother: WT('mother'), and: WT('radha') - 0.18, she: WT('she'), wait: WT('wait'), duty: WT('duty'),
  and2: WT('years') - 0.16, broke: WT('broke'), thats: WT("that's"), they: WT('they'), comment: WT('comment') };
const glow = (c, o = 0.5) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, depthWrite: false, blending: THREE.AdditiveBlending });
const noOut = (m) => { m.userData.noOutline = true; m.castShadow = false; return m; };

// ---------------- Vrindavan's road
mesh(new THREE.BoxGeometry(18, 0.06, 40), mat(0x8ad84a), 0, 0.03, -6, scene).castShadow = false; noOut(mesh(new THREE.BoxGeometry(2.6, 0.02, 40), mat(0xd9c08a), 0, 0.07, -6, scene));
[[-4.5, 2, 0.4], [4.6, 1.5, -0.4], [-5.5, -4, 0.2], [5.4, -5, -0.2]].forEach(([x, z, r]) => hut(scene, x, z, R, r));
for (let i = 0; i < 10; i++) roundTree(scene, (i % 2 ? 1 : -1) * (7 + (i % 3)), -24 + i * 3.4, R, 1);
const cows = [cow(scene, -2.6, -1.5, 1.2, R), cow(scene, 2.8, -2.4, 2.0, R), cow(scene, -3.2, 1.0, 0.8, R)];
// the golden chariot (faces -z) with two white horses
const CH = new THREE.Group(); scene.add(CH);
const gold = mat(0xffd23a, { m: 0.6, r: 0.35 });
mesh(new THREE.BoxGeometry(1.4, 0.2, 1.8), gold, 0, 0.95, 0, CH); mesh(new THREE.BoxGeometry(1.4, 0.5, 0.08), gold, 0, 1.3, -0.9, CH); for (const x of [-0.7, 0.7]) mesh(new THREE.BoxGeometry(0.06, 0.4, 1.8), gold, x, 1.2, 0, CH);
mesh(new THREE.ConeGeometry(1.0, 0.8, 8), mat(0xd8263a), 0, 2.9, 0, CH); for (const [x, z] of [[-0.6, -0.8], [0.6, -0.8], [-0.6, 0.8], [0.6, 0.8]]) mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.6, 6), gold, x, 1.85, z, CH);
const wheels = [-0.85, 0.85].map((x) => { const w = new THREE.Group(); w.position.set(x, 0.72, 0.2); CH.add(w); mesh(new THREE.TorusGeometry(0.66, 0.06, 6, 20).rotateY(Math.PI / 2), mat(0x8a5a2a), 0, 0, 0, w); for (let i = 0; i < 6; i++) { const sp = mesh(new THREE.BoxGeometry(0.04, 1.3, 0.04), gold, 0, 0, 0, w); sp.rotation.x = i / 6 * Math.PI; } return w; });
const legs = []; [[-0.3, -2.4], [0.3, -2.4]].forEach(([x, z]) => { const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = Math.PI / 2; CH.add(g); const w = mat(0xf6f3ec); mesh(new THREE.BoxGeometry(1.0, 0.45, 0.32), w, 0, 1.0, 0, g); const nk = mesh(new THREE.BoxGeometry(0.22, 0.6, 0.22), w, -0.5, 1.35, 0, g); nk.rotation.z = 0.5; mesh(new THREE.BoxGeometry(0.42, 0.2, 0.2), w, -0.72, 1.62, 0, g); for (const [dx, dz] of [[-0.38, -0.1], [-0.38, 0.1], [0.38, -0.1], [0.38, 0.1]]) legs.push(mesh(new THREE.BoxGeometry(0.1, 0.8, 0.1).translate(0, -0.4, 0), w, dx, 0.82, dz, g)); });
const dust = []; for (let i = 0; i < 14; i++) dust.push(noOut(mesh(new THREE.SphereGeometry(0.25, 8, 6), new THREE.MeshBasicMaterial({ color: 0xe8d8b0, transparent: true, opacity: 0.4, depthWrite: false }), 0, 0, 0, scene)));
// ---------------- the riverbank at dusk (x = 40)
mesh(new THREE.CylinderGeometry(9, 9, 0.06, 24), mat(0x7ac84a), 40, 0.03, 2, scene).castShadow = false;
const river = noOut(mesh(new THREE.PlaneGeometry(40, 6, 40, 6).rotateX(-Math.PI / 2), mat(0x3f7fc8, { r: 0.15, m: 0.2 }), 40, 0.06, -3.5, scene)); const rb = river.geometry.attributes.position.array.slice();
roundTree(scene, 35.5, 2.4, R, 1.3); roundTree(scene, 45, 3, R, 1.1);
const kadamba = []; for (let i = 0; i < 16; i++) kadamba.push({ m: noOut(mesh(new THREE.SphereGeometry(0.06, 6, 4), mat(0xffb02a), 0, 0, 0, scene)), ph: R(), x: R() });
// ---------------- Dwarka balcony at night (x = 80)
mesh(new THREE.BoxGeometry(8, 0.2, 5), mat(0xf3e2b8), 80, 2.0, 0, scene); for (let i = 0; i < 9; i++) mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.4, 6), mat(0xffd23a, { m: 0.4, r: 0.4 }), 76.4 + i * 0.9, 2.3, 2.3, scene);
mesh(new THREE.BoxGeometry(8, 0.08, 0.12), mat(0xffd23a, { m: 0.4, r: 0.4 }), 80, 2.5, 2.3, scene); mesh(new THREE.BoxGeometry(8, 6, 0.3), mat(0xe8d8b8), 80, 3.0, -2.6, scene);
for (const x of [77, 83]) mesh(new THREE.CylinderGeometry(0.25, 0.28, 4, 10), mat(0xfaf5ea), x, 4, -1.8, scene);
const sea = noOut(mesh(new THREE.PlaneGeometry(120, 60).rotateX(-Math.PI / 2), mat(0x1a3a70, { r: 0.2 }), 80, 0.05, 30, scene));
const moon = noOut(mesh(new THREE.SphereGeometry(1.4, 20, 14), new THREE.MeshBasicMaterial({ color: 0xfff6dc, fog: false }), 74, 11, 30, scene)); const moonGlow = noOut(mesh(new THREE.SphereGeometry(2.6, 20, 14), new THREE.MeshBasicMaterial({ color: 0xfff0c0, transparent: true, opacity: 0.2, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }), 74, 11, 30, scene));
const bl = lamp(scene, 82.6, 2.1, -1.0, 0.8);
// the flute that breaks: two halves
const halves = [0, 1].map((i) => { const g = new THREE.Group(); scene.add(g); noOut(mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.46, 10).rotateZ(Math.PI / 2).translate(i ? 0.23 : -0.23, 0, 0), mat(0xc9a227, { r: 0.4 }), 0, 0, 0, g)); noOut(mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.04, 10).rotateZ(Math.PI / 2), mat(0xe8462c), i ? 0.44 : -0.44, 0, 0, g)); return g; });
const snap = noOut(mesh(new THREE.SphereGeometry(0.3, 12, 8), glow(0xfff0c0, 0), 0, 0, 0, scene));
const tear = noOut(mesh(new THREE.SphereGeometry(0.03, 6, 4).scale(0.8, 1.3, 0.8), mat(0x7fc8ff), 0, 0, 0, scene));
// ---------------- the altar today (x = 120)
const T = new THREE.Group(); T.position.set(120, 0, 0); scene.add(T);
mesh(new THREE.BoxGeometry(12, 0.1, 9), mat(0xf3e6c8), 0, 0.05, 0, T).castShadow = false; mesh(new THREE.BoxGeometry(12, 8, 0.3), mat(0xd86aa0), 0, 4, -3, T);
mesh(new THREE.BoxGeometry(3.4, 1.0, 1.4), mat(0x8a4b20), 0, 0.5, -2.2, T); mesh(new THREE.BoxGeometry(3.5, 0.08, 1.5), mat(0xffd23a), 0, 1.02, -2.2, T);
for (let i = 0; i < 26; i++) { const a = i / 25 * Math.PI; noOut(mesh(new THREE.SphereGeometry(0.11, 6, 4), mat([0xf06aa0, 0xffffff, 0xffd23a][i % 3]), Math.cos(a) * 1.5, 2.0 + Math.sin(a) * 1.6, -2.6, T)); }
const tl = [lamp(T, -1.5, 1.06, -1.8, 0.6), lamp(T, 1.5, 1.06, -1.8, 0.6)];
const petals = []; for (let i = 0; i < 30; i++) petals.push({ m: noOut(mesh(new THREE.CircleGeometry(0.07, 6), new THREE.MeshBasicMaterial({ color: i % 2 ? 0xf06aa0 : 0xffffff, side: THREE.DoubleSide }), 0, 0, 0, scene)), ph: R(), x: R() });
// ---------------- the cast
const C = makeCast(scene, [['k', 'kidKrishna'], ['akr', 'courtier'], ['y', 'yashoda'], ['radha', 'gopi3'], ['v1', 'kid1'], ['v2', 'gopi1'], ['v3', 'govinda'], ['v4', 'gopi2'], ['dk', 'krishna'], ['rk', 'krishna'], ['rr', 'gopi3'], ['d1', 'devotee']]);
const radhaSpec = Object.assign({}, C.radha.spec, { skin: '#f6d0b0', body: '#f6f1e2', top: (c, cx, hy) => { c.beginPath(); c.arc(cx, hy - 40, 6, 0, 7); c.fillStyle = '#d8263a'; c.fill(); } });
C.radha.spec = radhaSpec; C.rr.spec = Object.assign({}, radhaSpec, { body: '#f06aa0' });
addOutlines(scene);
const confetti = makeConfetti(scene, 50, 45);

function update(s, t) {
  const cx = camera.position.x, set = cx > 100 ? 120 : cx > 60 ? 80 : cx > 20 ? 40 : 0;
  const night = set === 80, dusk = set === 40;
  S.mood(night ? 0.85 : 0); S.hemi.intensity = night ? 0.85 : 1.35; S.sun.target.position.set(set, 0, 0); S.sun.position.set(set - 8, 14, 10); S.sun.target.updateMatrixWorld();
  if (dusk) { S.paintSky(new THREE.Color(0x6a5ab0), new THREE.Color(0xffa060)); S.sun.color.set(0xffb070); }
  const right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0); right.y = 0; right.normalize();
  // --- the chariot arrives, Krishna climbs in, and it leaves down the road; the village runs after it
  const arrive = sm(seg(s, E.one, E.akrura)), leave = clamp((s - E.the) / (E.and - E.the + 3));
  const cz = s < E.the ? lerp(-18, -1.5, arrive) : -1.5 - leave * leave * 22;
  CH.position.set(0, 0, cz); wheels.forEach((w) => (w.rotation.x = -cz * 1.5)); const moving = (arrive > 0 && arrive < 1) || s >= E.the; legs.forEach((l, i) => (l.rotation.z = moving ? Math.sin(t * 12 + i) * 0.35 : 0));
  CH.visible = set === 0 || set === 40; if (set === 40) CH.position.set(40 + 2, 0, -14 - leave * 10);
  dust.forEach((d, i) => { const u = (t * 0.8 + i / 14) % 1; d.visible = set === 0 && moving; d.position.set(CH.position.x + Math.sin(i * 2.3) * 0.8, 0.2 + u * 0.8, CH.position.z + 1.2 + u * 1.6); d.scale.setScalar(0.6 + u * 1.4); d.material.opacity = 0.4 * (1 - u); });
  pose(C.akr, camera, { visible: set === 0 && s >= E.akrura - 0.5 && s < E.the, x: 0.9, z: cz + 1.4, h: 1.7, mood: 'normal', arm: 'offer', flip: true });
  const inChariot = s >= E.the - 0.2;
  pose(C.k, camera, { visible: set === 0 || set === 40, x: inChariot ? CH.position.x : -0.6, y: inChariot ? 0.95 : 0, z: inChariot ? CH.position.z + 0.3 : 1.2, h: 1.2, mood: inChariot ? 'sad' : 'happy', flute: !inChariot && s >= E.as, arm: inChariot ? 'wave' : 'down', flip: inChariot });
  // the village runs after it; the cows stand still; Yashoda holds the wheel
  const run = sm(seg(s, E.the, E.the2));
  [['v1', -1.4, 2.6], ['v2', 1.2, 3.0], ['v3', -2.2, 3.6], ['v4', 2.0, 3.8]].forEach(([n, x, z], i) => pose(C[n], camera, { visible: set === 0, x, z: lerp(z, z - 4, run), h: n === 'v1' ? 1.1 : 1.62, step: run > 0 && run < 1 ? s * 4 + i : 0, mood: s >= E.the ? 'sad' : 'happy', arm: s >= E.the ? 'up' : 'down' }));
  cows.forEach((c, i) => { c.children[1].rotation.z = s >= E.the2 ? 0.0 : Math.sin(t * 5 + i) * 0.12; c.rotation.y = [1.2, 2.0, 0.8][i] + (s >= E.the2 ? 0.6 : 0); });
  const hold = s >= E.mother && s < E.and + 0.4;
  pose(C.y, camera, { visible: set === 0 && s >= E.the, x: hold ? CH.position.x + 1.25 : 1.8, z: hold ? CH.position.z + 0.8 : 2.2, h: 1.62, mood: 'sad', arm: hold ? 'offer' : 'up', flip: true });
  // --- Radha by the river: does not cry; just watches him go
  const rp = river.geometry.attributes.position; for (let i = 0; i < rp.count; i++) rp.setY(i, Math.sin(rb[i * 3] * 1.1 + t * 1.0) * 0.025); rp.needsUpdate = true;
  pose(C.radha, camera, { visible: set === 40, x: 39.6, z: 1.0, h: 1.3, mood: 'normal', arm: 'down' });
  kadamba.forEach(({ m, ph, x }) => { const u = (t * 0.15 + ph) % 1; m.visible = set === 40; m.position.set(36 + x * 8, 4 - u * 4, 1 + Math.sin(ph * 9) * 1.5); });
  // --- years later, Dwarka: he hears she is gone, and breaks his flute
  const breakK = sm(seg(s, E.broke, E.broke + 0.5)), hook = s < E.as;
  pose(C.dk, camera, { visible: set === 80, x: 80, y: 2.1, z: 0.6, h: 1.75, mood: s >= E.and2 + 1.0 || hook ? 'sad' : 'closed', arm: 'offer' });
  const handP = V(80, 2.1, 0.6).add(right.clone().multiplyScalar(0.33)).add(V(0, 0.84 + 0.0, 0.08)), split = hook ? 1 : breakK;
  halves.forEach((h, i) => { h.visible = set === 80 && (s >= E.and2 || hook); h.position.copy(handP).add(right.clone().multiplyScalar((i ? 1 : -1) * split * 0.15)).add(V(0, -split * (i ? 0.25 : 0.1), 0)); h.rotation.set(0, 0, (i ? -1 : 1) * split * 0.5); h.quaternion.premultiply(new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().extractRotation(camera.matrixWorld))); });
  const su = s - E.broke; snap.visible = set === 80 && su > 0 && su < 0.6; snap.position.copy(handP); snap.scale.setScalar(0.4 + su * 2); snap.material.opacity = 0.8 * (1 - su / 0.6);
  tear.visible = set === 80 && (s >= E.broke + 0.3 || hook); { const u = (t * 0.9) % 1; tear.position.set(80, 2.1, 0.62).add(right.clone().multiplyScalar(-0.12)).add(V(0, 1.42 - u * 0.25, 0.05)); }
  moon.visible = moonGlow.visible = set === 80; bl.flame.scale.y = 1 + 0.15 * Math.sin(t * 11);
  // --- today: Radha and Krishna together on the altar
  pose(C.rk, camera, { visible: set === 120, x: 120.4, y: 1.06, z: -2.3, h: 1.55, mood: 'happy', flute: true }); pose(C.rr, camera, { visible: set === 120, x: 119.6, y: 1.06, z: -2.3, h: 1.45, mood: 'happy', flip: true });
  pose(C.d1, camera, { visible: set === 120, x: 121.4, z: 0.8, h: 1.65, mood: 'closed', arm: 'up', flip: true });
  tl.forEach((l, i) => (l.flame.scale.y = 1 + 0.15 * Math.sin(t * 13 + i)));
  petals.forEach(({ m, ph, x }) => { const u = (t * 0.2 + ph) % 1; m.visible = set === 120 && s >= E.they; m.position.set(118 + x * 4, 4 - u * 3.6, -1.5 + Math.sin(ph * 7) * 1.2); m.rotation.set(t + ph * 6, t * 0.7, 0); });
  confetti(E.comment, s, V(120, 3, -1));
  S.clouds.forEach((c, i) => { c.position.x = -80 + i * 15 + ((t * 0.6 + i * 3) % 12); });
}

const G = (t) => t;
const SHOTS = [
  [0, E.as - 0.05, G, [[80.1, 3.3, 2.4], [80.05, 3.0, 0.6]], [[80.1, 3.3, 2.4], [80.05, 3.0, 0.6]], [62, 34], { move: 'dolly' }],
  [E.as - 0.05, E.one - 0.05, G, [[-0.4, 1.0, 3.4], [-0.6, 0.95, 1.2]], [[-0.4, 1.0, 3.0], [-0.6, 0.95, 1.2]]],
  [E.one - 0.05, E.akrura - 0.05, G, [[1.6, 2.2, 6.0], [0, 1.4, -9]], [[1.2, 1.8, 4.6], [0, 1.2, -3]]],
  [E.akrura - 0.05, E.the - 0.05, G, [[1.6, 1.6, 2.4], [0.6, 1.2, -0.2]], [[1.4, 1.6, 2.0], [0.6, 1.2, -0.2]]],
  [E.the - 0.05, E.mother - 0.05, G, [[0, 1.4, 6.5], [0, 1.0, 0]], [[0, 8, 14], [0, 0, -6]], 50, { move: 'pull' }],
  [E.mother - 0.05, E.and - 0.05, G, [[3.8, 1.8, -3.0], [1.0, 1.1, -6.6]], [[3.6, 1.8, -4.6], [1.0, 1.1, -8.6]]],
  [E.and - 0.05, E.she - 0.05, G, [[39.7, 0.9, 2.6], [39.6, 0.85, 1.0]], [[39.7, 0.9, 2.3], [39.6, 0.85, 1.0]]],
  [E.she - 0.05, E.wait - 0.05, G, [[39.0, 0.9, 3.6], [39.6, 1.0, 1.0]], [[38.6, 6.0, 7.0], [41, 0.8, -12]], 50, { move: 'crane', lift: 1.5 }],
  [E.wait - 0.05, E.duty - 0.05, G, [[0, 2.6, 5], [0, 1.5, -12]], [[0, 2.6, 4], [0, 1.5, -14]]],
  [E.duty - 0.05, E.and2 - 0.05, G, [[80, 4.0, 9], [80, 3.0, 0]], [[80, 3.6, 7.6], [80, 3.0, 0]]],
  [E.and2 - 0.05, E.broke - 0.05, G, [[80.6, 3.2, 3.0], [80, 3.0, 0.6]], [[80.4, 3.1, 2.6], [80, 3.0, 0.6]]],
  [E.broke - 0.05, E.thats - 0.05, G, [[80.15, 3.3, 2.4], [80.1, 3.0, 0.6]], [[80.15, 3.3, 2.4], [80.1, 3.0, 0.6]], [62, 34], { move: 'dolly' }],
  [E.thats - 0.05, E.they - 0.05, G, [[120, 3.0, 7.6], [120, 2.0, -2]], [[120, 2.4, 5.0], [120, 2.0, -2]], 50, { move: 'land' }],
  [E.they - 0.05, E.comment - 0.05, G, [[120, 2.2, 3.4], [120, 2.0, -2.3]], [[120, 2.2, 3.0], [120, 2.0, -2.3]]],
  [E.comment - 0.05, DURATION + 0.1, G, [[120, 2.4, 5.8], [120, 2.2, -2]], [[120, 2.4, 5.4], [120, 2.2, -2]]],
];
direct({ stage, WORDS, DURATION, shots: SHOTS, update, title: 1.6, q: [E.wait, E.duty], cta: E.comment, prog: [E.wait, E.thats], pin: E.wait,
  key: ['krishna', 'vrindavan', 'never', 'flute', 'golden', 'chariot', 'akrura', 'mathura', 'village', 'cows', 'still', 'yashoda', 'wheel', 'radha', 'cry', 'river', 'watched', 'wait', 'duty', 'dwarka', 'world', 'gone', 'broke', 'together', 'apart', 'hearts', 'comment'],
  loc: (t) => (t >= E.as - 0.05 && t < E.one + 1.0 ? '📍 VRINDAVAN' : t >= E.duty - 0.05 && t < E.and2 - 0.05 ? '📍 DWARKA · YEARS LATER' : t >= E.thats - 0.05 && t < E.they ? 'EVEN TODAY' : ''), shakes: [E.broke], tick: () => {} });
