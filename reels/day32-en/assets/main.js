// Day 32 · "Why choose Krishna over an army?" · Why we do what we do #14 (as the story goes: Arjuna at His feet, Duryodhana at His head)
// Sets: Krishna's bedroom in Dwarka (origin), the palace outside (z = 14), Kurukshetra with an army (x = 40).
import * as THREE from './three.module.js';
import { rng, mat, mesh, sm, seg, lerp, clamp, setupScene, makeCast, pose, lamp, palm } from './kit.js';
import { makeStage, direct, wordTime } from './director.js';
import { addOutlines, makeConfetti } from './plus.js';
import { WORDS, DURATION } from './data.js';

const stage = makeStage(), { scene, camera } = stage, V = (x, y, z) => new THREE.Vector3(x, y, z), R = rng(32);
const S = setupScene(scene, [[0, 6], [40, -6]], 32);
const WT = wordTime(WORDS);
const E = { before: WT('before'), duryodhana: WT('duryodhana'), to2: WT('ask') - 0.16, as: WT('as', 2), krishna3: WT('asleep') - 0.54, duryodhana2: WT('duryodhana', 2), arjuna3: WT('quietly') - 0.92,
  when: WT('when'), who: WT('who'), arjuna4: WT('arjuna', 4), so: WT('so'), on: WT('on'), a: WT('million') - 0.14, on2: WT('other') - 0.34, and: WT('will') - 0.3, wait: WT('wait'), arjuna5: WT('arjuna', 5),
  duryodhana3: WT('duryodhana', 3), but: WT('but'), thats: WT("that's"), choose3: WT('choose', 3), comment: WT('comment') };
const glow = (c, o = 0.5) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, depthWrite: false, blending: THREE.AdditiveBlending });
const noOut = (m) => { m.userData.noOutline = true; m.castShadow = false; return m; };

// ---------------- the bedroom
mesh(new THREE.BoxGeometry(10, 0.1, 8), mat(0xf3e2b8), 0, 0.05, 0, scene).castShadow = false;
noOut(mesh(new THREE.BoxGeometry(4.2, 0.02, 2.6), mat(0xc0213a), 0, 0.11, 0.2, scene));
mesh(new THREE.BoxGeometry(10, 5, 0.3), mat(0xf6e1c0), 0, 2.5, -2.4, scene);
mesh(new THREE.BoxGeometry(1.4, 1.6, 0.1), mat(0xffffff), 2.8, 2.6, -2.24, scene); noOut(mesh(new THREE.BoxGeometry(1.2, 1.4, 0.12), mat(0x7fb8ff), 2.8, 2.6, -2.22, scene));
for (const x of [2.0, 3.6]) mesh(new THREE.BoxGeometry(0.5, 2.4, 0.08), mat(0x8a3ab8), x, 2.5, -2.15, scene);
// the bed and the pillow; a chair at the head; Krishna's flute on the side table
mesh(new THREE.BoxGeometry(2.6, 0.45, 1.3), mat(0x8a5a2a), 0, 0.3, -0.6, scene); mesh(new THREE.BoxGeometry(2.6, 0.12, 1.3), mat(0xfff6dc), 0, 0.58, -0.6, scene);
mesh(new THREE.BoxGeometry(0.15, 1.1, 1.3), mat(0x8a5a2a), -1.35, 0.6, -0.6, scene); mesh(new THREE.BoxGeometry(0.5, 0.18, 0.7), mat(0xffd23a), -0.95, 0.72, -0.6, scene);
mesh(new THREE.BoxGeometry(0.9, 0.08, 0.9), mat(0xd9a441, { m: 0.5, r: 0.4 }), -2.0, 0.6, 0.1, scene); for (const [dx, dz] of [[-0.35, -0.35], [0.35, -0.35], [-0.35, 0.35], [0.35, 0.35]]) mesh(new THREE.BoxGeometry(0.08, 0.6, 0.08), mat(0xd9a441, { m: 0.5, r: 0.4 }), -2.0 + dx, 0.3, 0.1 + dz, scene);
mesh(new THREE.BoxGeometry(0.9, 1.2, 0.1), mat(0xd9a441, { m: 0.5, r: 0.4 }), -2.0, 1.2, -0.32, scene);
const zz = []; { for (let i = 0; i < 3; i++) { const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d'); x.font = '900 52px Nunito, Arial Black'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.lineWidth = 6; x.strokeStyle = '#1d1a24'; x.strokeText('z', 32, 34); x.fillStyle = '#ffffff'; x.fillText('z', 32, 34); const t = new THREE.CanvasTexture(c); const m = noOut(new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.3), new THREE.MeshBasicMaterial({ map: t, transparent: true }))); scene.add(m); zz.push(m); } }
const rl = [lamp(scene, -3.6, 0.1, -1.6, 1.0), lamp(scene, 3.8, 0.1, -1.4, 1.0)];
// ---------------- outside the palace (z = 14)
function palace(parent, x, z, k = 1) { const P = new THREE.Group(); P.position.set(x, 0, z); P.scale.setScalar(k); parent.add(P); const cream = mat(0xf3e2b8), red = mat(0xd8573a), gold = mat(0xffd23a, { m: 0.5, r: 0.4 });
  mesh(new THREE.BoxGeometry(18, 4.5, 4), cream, 0, 2.25, 0, P); mesh(new THREE.BoxGeometry(6, 7, 4.4), cream, 0, 3.5, 0.2, P);
  for (const dx of [-7.5, 7.5]) { mesh(new THREE.CylinderGeometry(1.2, 1.4, 7.5, 8), cream, dx, 3.75, 1, P); mesh(new THREE.SphereGeometry(1.4, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), red, dx, 7.5, 1, P); mesh(new THREE.ConeGeometry(0.25, 0.9, 6), gold, dx, 9.3, 1, P); }
  mesh(new THREE.SphereGeometry(2.6, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), red, 0, 7, 0.2, P); mesh(new THREE.ConeGeometry(0.35, 1.3, 6), gold, 0, 10.1, 0.2, P);
  for (let i = 0; i < 8; i++) mesh(new THREE.CylinderGeometry(0.22, 0.22, 3.6, 8), cream, -6 + i * (12 / 7), 1.8, 2.3, P); mesh(new THREE.BoxGeometry(2.2, 3.4, 0.3), mat(0x7a3a1a), 0, 1.7, 2.45, P); return P; }
palace(scene, 0, 10, 1); mesh(new THREE.BoxGeometry(3, 0.03, 12), mat(0xd8263a), 0, 0.06, 18, scene).castShadow = false;
for (let i = 0; i < 8; i++) palm(scene, (i % 2 ? 1 : -1) * (5 + (i % 4) * 1.4), 14 + Math.floor(i / 2) * 3, R);
// ---------------- Kurukshetra and the army (x = 40)
mesh(new THREE.CylinderGeometry(30, 30, 0.06, 32), mat(0xc9a46a), 40, 0.03, -6, scene).castShadow = false;
const NS = 420, soldierBody = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.16, 0.2, 0.7, 6), mat(0x8a1a2a), NS), soldierHead = new THREE.InstancedMesh(new THREE.SphereGeometry(0.13, 8, 6), mat(0xc98a5e), NS), helmet = new THREE.InstancedMesh(new THREE.ConeGeometry(0.14, 0.18, 6), mat(0xd9a441, { m: 0.5, r: 0.4 }), NS), spear = new THREE.InstancedMesh(new THREE.BoxGeometry(0.03, 1.4, 0.03), mat(0x8a6a3a), NS);
[soldierBody, soldierHead, helmet, spear].forEach((m) => { m.userData.noOutline = true; scene.add(m); });
const SP = []; for (let i = 0; i < NS; i++) { const c = i % 28, r = Math.floor(i / 28); SP.push([30.5 + c * 0.55 + (r % 2) * 0.27, -2 - r * 0.85, R() * 6]); }
const flags = []; for (let i = 0; i < 7; i++) { const g = new THREE.Group(); g.position.set(31 + i * 2.4, 0, -2.6 - (i % 3) * 3); scene.add(g); mesh(new THREE.CylinderGeometry(0.04, 0.04, 3, 6), mat(0x6b4a2a), 0, 1.5, 0, g); flags.push(mesh(new THREE.BoxGeometry(0.9, 0.55, 0.03), mat(i % 2 ? 0xe0213a : 0xffd23a), 0.46, 2.7, 0, g)); }
const confettiArmy = makeConfetti(scene, 50, 33);
// ---------------- the cast
const C = makeCast(scene, [['k', 'krishna'], ['arj', 'arjuna'], ['dur', 'duryodhana'], ['k2', 'krishna'], ['arj2', 'arjuna'], ['dur2', 'duryodhana']]);
addOutlines(scene);
const confetti = makeConfetti(scene, 60, 32);
const m4 = new THREE.Matrix4(), q = new THREE.Quaternion();

function update(s, t) {
  const cx = camera.position.x, field = cx > 20, outside = !field && camera.position.z > 6;
  S.mood(0); S.hemi.intensity = field ? 1.4 : 1.35; S.sun.target.position.set(field ? 40 : 0, 0, field ? -6 : 4); S.sun.position.set((field ? 40 : 0) - 8, 14, 12); S.sun.target.updateMatrixWorld();
  // the army: a million soldiers (well, a few hundred), standing, then cheering for the side they chose
  const cheer = s >= E.duryodhana3 && s < E.but ? 1 : 0;
  SP.forEach(([x, z, ph], i) => { const bob = cheer ? Math.abs(Math.sin(t * 6 + ph)) * 0.12 : Math.sin(t * 2 + ph) * 0.01;
    m4.makeTranslation(x, 0.45 + bob, z); soldierBody.setMatrixAt(i, m4); m4.makeTranslation(x, 0.93 + bob, z); soldierHead.setMatrixAt(i, m4); m4.makeTranslation(x, 1.1 + bob, z); helmet.setMatrixAt(i, m4); m4.makeTranslation(x + 0.2, 0.8 + bob + (cheer ? 0.25 : 0), z); spear.setMatrixAt(i, m4); });
  [soldierBody, soldierHead, helmet, spear].forEach((m) => (m.instanceMatrix.needsUpdate = true));
  flags.forEach((f, i) => (f.rotation.y = Math.sin(t * 3 + i) * 0.25));
  // --- the bedroom: Krishna asleep, Duryodhana at his head, Arjuna at his feet; Krishna wakes and sees Arjuna first
  const wake = sm(seg(s, E.when, E.when + 1.0));
  const kIn = !field && !outside;
  if (kIn) {
    pose(C.k, camera, { x: lerp(0.95, 0.2, wake), y: lerp(0.62, 0.3, wake), z: -0.6, h: 1.75, sitting: wake > 0.5, mood: s < E.when + 0.3 ? 'closed' : 'happy', arm: s >= E.so && s < E.wait ? 'offer' : 'down', flip: false });
    C.k.m.rotateZ(lerp(Math.PI / 2, 0, wake)); C.k.m.position.y += lerp(0.2, 0, wake);
  } else pose(C.k, camera, { visible: false });
  zz.forEach((z, i) => { const u = (t * 0.5 + i / 3) % 1; z.visible = kIn && s < E.when + 0.2; z.position.set(-0.7 + u * 0.4, 1.0 + u * 0.8, -0.5); z.scale.setScalar(0.6 + u * 0.8); z.quaternion.copy(camera.quaternion); });
  const dIn = sm(seg(s, E.duryodhana2 - 0.2, E.duryodhana2 + 1.2)), aIn = sm(seg(s, E.arjuna3 - 0.2, E.arjuna3 + 1.3));
  pose(C.dur, camera, { visible: kIn && s >= E.duryodhana2 - 0.3, x: lerp(-4.2, -2.0, dIn), y: dIn >= 1 ? 0.62 : 0, z: lerp(1.6, 0.0, dIn), h: 1.78, sitting: dIn >= 1, step: dIn > 0 && dIn < 1 ? s * 3 : 0,
    mood: s >= E.duryodhana3 ? 'happy' : s >= E.arjuna4 ? 'sad' : 'smug', arm: 'down' });
  pose(C.arj, camera, { visible: kIn && s >= E.arjuna3 - 0.3, x: lerp(4.2, 1.85, aIn), y: 0, z: lerp(1.8, 0.0, aIn), h: 1.7, sitting: aIn >= 1 && s < E.arjuna5, step: aIn > 0 && aIn < 1 ? s * 2 : 0, flip: true,
    mood: s >= E.arjuna5 ? 'happy' : aIn >= 1 ? 'closed' : 'normal', arm: s >= E.arjuna5 ? 'offer' : 'down' });
  rl.forEach((l, i) => (l.flame.scale.y = 1 + 0.15 * Math.sin(t * 13 + i)));
  // --- outside the palace and on the field
  const rush = seg(s, E.duryodhana - 0.1, E.as);
  pose(C.dur2, camera, { visible: outside || field, x: outside ? -1.2 : 36.5, z: outside ? lerp(24, 15.5, rush) : 2.2, h: 1.78, step: outside ? s * 4 : 0, mood: field ? 'happy' : 'smug', arm: field && cheer ? 'up' : 'down' });
  pose(C.arj2, camera, { visible: outside || (field && s >= E.duryodhana3), x: outside ? 1.2 : 43.6, z: outside ? lerp(25, 16, rush) : 3.0, h: 1.7, step: outside ? s * 4 + 1 : 0, mood: 'happy', bow: field && s >= E.but, arm: field && s >= E.but ? 'up' : 'down' });
  pose(C.k2, camera, { visible: field, x: 44.5, z: 3.1, h: 1.75, mood: 'happy', flute: s >= E.on2 + 0.4 && s < E.wait, arm: 'down', flip: true });
  confettiArmy(E.but + 0.2, s, V(44, 3.4, 2.8));
  confetti(E.arjuna5, s, V(1.2, 2.4, -0.2));
  S.clouds.forEach((c, i) => { c.position.x = -80 + i * 15 + ((t * 0.6 + i * 3) % 12); });
}

const G = (t) => t, HOOK = (t) => E.on2 + 0.6 + t * 0.2;
const SHOTS = [
  [0, E.before - 0.05, HOOK, [[42.2, 2.2, 10.5], [43.4, 1.3, 0]], [[42.4, 2.1, 9.6], [43.6, 1.3, 0]]],
  [E.before - 0.05, E.duryodhana - 0.05, G, [[40, 8, 14], [38, 0.5, -6]], [[40, 6.5, 12], [38, 0.5, -6]]],
  [E.duryodhana - 0.05, E.to2 - 0.05, G, [[0, 1.8, 30], [0, 1.4, 16]], [[0, 1.8, 27], [0, 1.4, 14]]],
  [E.to2 - 0.05, E.as - 0.05, G, [[0, 4.5, 32], [0, 4, 10]], [[0, 3.6, 28], [0, 3.5, 10]]],
  [E.as - 0.05, E.duryodhana2 - 0.05, G, [[0, 2.6, 5.8], [0, 0.8, -0.6]], [[0, 2.2, 4.8], [0, 0.8, -0.6]]],
  [E.duryodhana2 - 0.05, E.arjuna3 - 0.05, G, [[-0.6, 1.8, 5.2], [-1.6, 1.0, 0]], [[-0.8, 1.7, 4.6], [-1.6, 1.0, 0]]],
  [E.arjuna3 - 0.05, E.when - 0.05, G, [[1.2, 1.4, 4.6], [1.8, 0.8, 0.2]], [[1.3, 1.4, 4.0], [1.8, 0.8, 0.2]]],
  [E.when - 0.05, E.arjuna4 - 0.05, G, [[0, 2.0, 5.0], [0, 1.0, -0.4]], [[0, 1.9, 4.6], [0, 1.0, -0.4]]],
  [E.arjuna4 - 0.05, E.so - 0.05, G, [[1.6, 1.05, 2.4], [1.85, 0.6, 0.0]], [[1.6, 1.05, 2.2], [1.85, 0.6, 0.0]]],
  [E.so - 0.05, E.on - 0.05, G, [[0.3, 1.5, 2.8], [0.2, 1.2, -0.6]], [[0.3, 1.5, 2.5], [0.2, 1.2, -0.6]]],
  [E.on - 0.05, E.on2 - 0.05, G, [[37, 3.0, 4.5], [37, 0.8, -6]], [[42, 3.4, 4.0], [40, 0.8, -8]]],
  [E.on2 - 0.05, E.wait - 0.05, G, [[45.4, 1.6, 6.2], [44.5, 1.3, 3.1]], [[45.2, 1.6, 5.4], [44.5, 1.3, 3.1]]],
  [E.wait - 0.05, E.arjuna5 - 0.05, G, [[-1.4, 1.6, 2.8], [-2.0, 1.4, 0.0]], [[-1.4, 1.6, 2.6], [-2.0, 1.4, 0.0]]],
  [E.arjuna5 - 0.05, E.duryodhana3 - 0.05, G, [[0.8, 1.7, 4.4], [1.0, 1.3, -0.2]], [[0.9, 1.7, 4.0], [1.0, 1.3, -0.2]]],
  [E.duryodhana3 - 0.05, E.but - 0.05, G, [[36.4, 1.6, 6.6], [36.5, 1.3, 1.0]], [[36.6, 1.8, 7.4], [36.5, 1.3, 0]]],
  [E.but - 0.05, E.thats - 0.05, G, [[44.0, 1.6, 7.0], [44.0, 1.4, 3.0]], [[44.0, 1.6, 6.4], [44.0, 1.4, 3.0]]],
  [E.thats - 0.05, E.comment - 0.05, G, [[43.2, 1.9, 8.4], [43.9, 1.3, 2.4]], [[43.0, 2.1, 9.4], [43.6, 1.3, 2.0]]],
  [E.comment - 0.05, DURATION + 0.1, G, [[42.8, 2.4, 10.4], [43.4, 1.5, 1.6]], [[42.8, 2.4, 10.0], [43.4, 1.5, 1.6]]],
];
direct({ stage, WORDS, DURATION, shots: SHOTS, update, title: E.before - 0.05, q: [E.wait, E.arjuna5], cta: E.comment,
  key: ['arjuna', 'krishna', 'army', 'war', 'duryodhana', 'dwarka', 'help', 'story', 'asleep', 'proudly', 'head', 'quietly', 'feet', 'eyes', 'first', 'offer', 'million', 'soldiers', 'me', 'fight', 'wait', 'weapon', 'thought', 'laughed', 'won', 'everything', 'comment', 'partha'],
  loc: (t) => (t >= E.before - 0.05 && t < E.duryodhana - 0.05 ? '📍 KURUKSHETRA' : t >= E.duryodhana - 0.05 && t < E.as - 0.05 ? '📍 DWARKA' : ''), shakes: [], tick: () => {} });
