// Day 40 · "Why 16,000 wives?" · Why we do what we do #22 (as the story goes: the princesses freed from Narakasura)
// Sets: outside Naraka's broken fortress (origin) with the freed princesses; a kingdom's shut gate and whispering people (x = 40);
// Dwarka with a wedding pavilion and many palaces (x = 80).
import * as THREE from './three.module.js';
import { rng, mat, mesh, sm, seg, lerp, clamp, setupScene, makeCast, pose, lamp, palm } from './kit.js';
import { makeStage, direct, wordTime } from './director.js';
import { addOutlines, makeConfetti } from './plus.js';
import { WORDS, DURATION } from './data.js';

const stage = makeStage(), { scene, camera } = stage, V = (x, y, z) => new THREE.Vector3(x, y, z), R = rng(40);
const S = setupScene(scene, [[0, 0], [40, 0], [80, 0]], 40);
const WT = wordTime(WORDS);
const E = { remember: WT('remember'), as: WT('as'), the3: WT('princesses', 3) - 0.12, but: WT('but'), their: WT('their'), people: WT('people'), who: WT('who', 2), wait: WT('wait'), he: WT('he'), he2: WT('married') - 0.6,
  gave: WT('gave'), and2: WT('gave', 2) - 0.14, so: WT('so'), thats: WT("that's"), not: WT('not', 2), comment: WT('comment') };
const glow = (c, o = 0.5) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, depthWrite: false, blending: THREE.AdditiveBlending });
const noOut = (m) => { m.userData.noOutline = true; m.castShadow = false; return m; };
const sariCols = [0xe8462c, 0xf06aa0, 0xffd23a, 0x3fae7a, 0x3f8fe0, 0x8a6ad8, 0xf6a531, 0x2fb8b0];

// a crowd of princesses (instanced): body + head + hair bun
function crowd(n, cx, cz, w, d, seed) {
  const r = rng(seed), body = new THREE.InstancedMesh(new THREE.CapsuleGeometry(0.16, 0.42, 4, 8), new THREE.MeshStandardMaterial({ roughness: 0.8 }), n), head = new THREE.InstancedMesh(new THREE.SphereGeometry(0.14, 10, 8), mat(0xd99a72), n), bun = new THREE.InstancedMesh(new THREE.SphereGeometry(0.09, 8, 6), mat(0x1d1a24), n);
  const P = []; const c = new THREE.Color(); for (let i = 0; i < n; i++) { P.push([cx + (r() - 0.5) * w, cz + (r() - 0.5) * d, r() * 6]); body.setColorAt(i, c.set(sariCols[i % sariCols.length])); }
  [body, head, bun].forEach((m) => { m.userData.noOutline = true; scene.add(m); }); return { body, head, bun, P };
}
const m4 = new THREE.Matrix4();
function placeCrowd(C, t, dx = 0, dz = 0, bobAmp = 0.02, vis = true) { C.body.visible = C.head.visible = C.bun.visible = vis; if (!vis) return; C.P.forEach(([x, z, ph], i) => { const b = Math.abs(Math.sin(t * 2 + ph)) * bobAmp; m4.makeTranslation(x + dx, 0.38 + b, z + dz); C.body.setMatrixAt(i, m4); m4.makeTranslation(x + dx, 0.86 + b, z + dz); C.head.setMatrixAt(i, m4); m4.makeTranslation(x + dx, 1.0 + b, z + dz - 0.05); C.bun.setMatrixAt(i, m4); }); [C.body, C.head, C.bun].forEach((m) => (m.instanceMatrix.needsUpdate = true)); }
// ---------------- outside the broken fortress
mesh(new THREE.CylinderGeometry(16, 16, 0.06, 28), mat(0x8a7a6a), 0, 0.03, -2, scene).castShadow = false;
const darkM = mat(0x3a2a34); for (const x of [-6, -2.5, 2.5, 6]) { mesh(new THREE.CylinderGeometry(0.9, 1.1, 6, 6), darkM, x, 3, -9, scene); mesh(new THREE.ConeGeometry(1.0, 1.6, 6), mat(0x8a1a2a), x, 6.8, -9, scene); }
mesh(new THREE.BoxGeometry(14, 4.5, 1), darkM, 0, 2.25, -9.4, scene); const gateL = mesh(new THREE.BoxGeometry(1.4, 3, 0.2), mat(0x2a1a24), -1.2, 1.5, -8.8, scene), gateR = mesh(new THREE.BoxGeometry(1.4, 3, 0.2), mat(0x2a1a24), 1.2, 1.5, -8.8, scene); gateL.rotation.y = 1.0; gateR.rotation.y = -1.0;
const freed = crowd(220, 0, -4.5, 13, 6.5, 41);
// the counter: 16,000
const cc = document.createElement('canvas'); cc.width = 768; cc.height = 256; const cTex = new THREE.CanvasTexture(cc); cTex.colorSpace = THREE.SRGBColorSpace; let cKey = '';
function boardText(a, b) { const k = a + b; if (k === cKey) return; cKey = k; const c = cc.getContext('2d'); c.clearRect(0, 0, 768, 256); c.fillStyle = 'rgba(60,20,60,0.84)'; c.beginPath(); c.roundRect(8, 8, 752, 240, 44); c.fill(); c.lineWidth = 10; c.strokeStyle = '#ffd23a'; c.stroke(); c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = '900 120px Nunito, Arial Black'; c.lineWidth = 14; c.strokeStyle = '#1d1a24'; c.strokeText(a, 384, b ? 104 : 132); c.fillStyle = '#ffd23a'; c.fillText(a, 384, b ? 104 : 132); if (b) { c.font = '800 54px Nunito, Arial'; c.lineWidth = 8; c.strokeText(b, 384, 200); c.fillStyle = '#ffffff'; c.fillText(b, 384, 200); } cTex.needsUpdate = true; }
const board = noOut(new THREE.Mesh(new THREE.PlaneGeometry(2.1, 0.7), new THREE.MeshBasicMaterial({ map: cTex, transparent: true }))); scene.add(board);
// ---------------- a kingdom's gate that stays shut (x = 40), and the whisperers
const K = new THREE.Group(); K.position.set(40, 0, 0); scene.add(K);
mesh(new THREE.BoxGeometry(14, 0.06, 10), mat(0xd9c08a), 0, 0.03, 0, K).castShadow = false; for (const x of [-4.5, 4.5]) mesh(new THREE.BoxGeometry(6, 3.8, 0.8), mat(0xd9a066), x, 1.9, -4, K);
for (const x of [-1.6, 1.6]) { mesh(new THREE.CylinderGeometry(0.75, 0.85, 5, 8), mat(0xd9a066), x, 2.5, -4, K); mesh(new THREE.ConeGeometry(0.95, 1.2, 8), mat(0xd8573a), x, 5.6, -4, K); }
const kDoorL = mesh(new THREE.BoxGeometry(1.1, 2.8, 0.2), mat(0x6b4020), -0.55, 1.4, -3.8, K), kDoorR = mesh(new THREE.BoxGeometry(1.1, 2.8, 0.2), mat(0x7a4a22), 0.55, 1.4, -3.8, K);
const bar = mesh(new THREE.BoxGeometry(2.4, 0.18, 0.12), mat(0x3a2a1a), 0, 1.5, -3.6, K);
const waiting = crowd(26, 40, 0.6, 4.5, 1.6, 42);
const dots = []; for (let i = 0; i < 5; i++) { const c = document.createElement('canvas'); c.width = 128; c.height = 80; const x = c.getContext('2d'); x.fillStyle = '#ffffff'; x.beginPath(); x.roundRect(4, 4, 120, 56, 26); x.fill(); x.beginPath(); x.moveTo(30, 58); x.lineTo(20, 76); x.lineTo(46, 58); x.fill(); x.fillStyle = '#5a5a6a'; for (let k = 0; k < 3; k++) { x.beginPath(); x.arc(38 + k * 26, 32, 8, 0, 7); x.fill(); } const m = noOut(new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.31), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true }))); scene.add(m); dots.push(m); }
// ---------------- Dwarka (x = 80): a wedding pavilion, many palaces on the hills, lamps
const D = new THREE.Group(); D.position.set(80, 0, 0); scene.add(D);
mesh(new THREE.BoxGeometry(16, 0.06, 12), mat(0xf3e2b8), 0, 0.03, 0, D).castShadow = false;
const pav = new THREE.Group(); pav.position.set(0, 0, -1.2); D.add(pav); mesh(new THREE.BoxGeometry(3.6, 0.3, 3.0), mat(0xc0213a), 0, 0.15, 0, pav);
for (const [x, z] of [[-1.6, -1.3], [1.6, -1.3], [-1.6, 1.3], [1.6, 1.3]]) { mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.8, 8), mat(0xffd23a, { m: 0.5, r: 0.4 }), x, 1.7, z, pav); for (let k = 0; k < 6; k++) noOut(mesh(new THREE.SphereGeometry(0.09, 6, 4), mat(k % 2 ? 0xf6a531 : 0xffffff), x, 0.6 + k * 0.4, z + 0.09, pav)); }
mesh(new THREE.ConeGeometry(2.6, 1.0, 4), mat(0xd8263a), 0, 3.6, 0, pav).rotation.y = Math.PI / 4;
const fire = []; mesh(new THREE.CylinderGeometry(0.35, 0.3, 0.25, 4).rotateY(Math.PI / 4), mat(0xb5562c), 1.0, 0.42, 0.6, pav); for (let i = 0; i < 3; i++) fire.push(noOut(mesh(new THREE.ConeGeometry(0.12, 0.42, 6), glow([0xffb02a, 0xff7a1e, 0xffd23a][i], 0.9), 1.0 + (i - 1) * 0.1, 0.75, 0.6, pav)));
const palaces = []; for (let i = 0; i < 26; i++) { const g = new THREE.Group(); const a = i / 26 * Math.PI * 1.3 - Math.PI * 0.65, r = 9 + (i % 3) * 2.2; g.position.set(80 + Math.sin(a) * r, 0, -6 - Math.cos(a) * r * 0.6 - (i % 3)); g.scale.setScalar(0.7 + (i % 3) * 0.15); scene.add(g); mesh(new THREE.BoxGeometry(1.4, 1.4, 1.2), mat(0xf3e2b8), 0, 0.7, 0, g); mesh(new THREE.SphereGeometry(0.55, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), mat(0xd8573a), 0, 1.4, 0, g); mesh(new THREE.ConeGeometry(0.1, 0.4, 5), mat(0xffd23a, { m: 0.5, r: 0.4 }), 0, 2.1, 0, g); const win = noOut(mesh(new THREE.BoxGeometry(0.35, 0.45, 0.05), glow(0xffc860, 0), 0, 0.7, 0.62, g)); palaces.push({ g, win, i }); }

const bride = crowd(40, 80, 3.4, 9, 1.6, 43);
const garland = new THREE.Group(); scene.add(garland); for (let i = 0; i <= 14; i++) { const a = i / 14 * Math.PI; noOut(mesh(new THREE.SphereGeometry(0.05, 6, 4), mat(i % 2 ? 0xf6a531 : 0xffffff), Math.cos(a) * 0.22, -Math.sin(a) * 0.32, 0, garland)); }
const nameRays = []; for (let i = 0; i < 12; i++) { const r = noOut(mesh(new THREE.BoxGeometry(0.06, 5, 0.02).translate(0, 2.5, 0), glow(0xffe0a0, 0), 80, 2.0, -1.0, scene)); r.rotation.z = i / 12 * Math.PI * 2; nameRays.push(r); }
// ---------------- the cast
const C = makeCast(scene, [['k', 'krishna'], ['sat', 'satyabhama'], ['p1', 'gopi1'], ['p2', 'gopi2'], ['p3', 'gopi3'], ['p4', 'rukmini'], ['gd', 'guard'], ['w1', 'crowd'], ['w2', 'courtier'], ['w3', 'gopi2']]);
addOutlines(scene);
const confetti = makeConfetti(scene, 80, 40);

function update(s, t) {
  const cx = camera.position.x, set = cx > 60 ? 80 : cx > 20 ? 40 : 0;
  S.mood(set === 40 ? 0.3 : 0); S.hemi.intensity = set === 40 ? 1.1 : 1.4; S.sun.target.position.set(set, 0, 0); S.sun.position.set(set - 8, 14, 10); S.sun.target.updateMatrixWorld();
  const right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0); right.y = 0; right.normalize();
  // --- freed princesses walk out of the broken fortress
  const out = sm(seg(s, E.the3 - 0.6, E.but)); placeCrowd(freed, t, 0, out * 3.0, 0.03, set === 0);
  [['p1', -1.2, 1.4], ['p2', -0.4, 1.8], ['p3', 0.6, 1.6], ['p4', 1.4, 1.2]].forEach(([n, x, z], i) => {
    if (set === 0) pose(C[n], camera, { x, y: 0.03, z: z - 2.2 + out * 2.2, h: 1.55, mood: s >= E.but ? 'sad' : s >= E.the3 ? 'happy' : 'sad', arm: s >= E.the3 && s < E.but && i % 2 ? 'wave' : 'down', step: out > 0 && out < 1 ? s * 3 + i : 0 });
    else if (set === 40) pose(C[n], camera, { x: 38.6 + i * 0.9, y: 0.03, z: 1.6, h: 1.55, mood: 'sad', arm: 'down' });
    else pose(C[n], camera, { x: 80 + (i - 1.5) * 0.85 + (i > 1 ? 0.9 : -0.9), y: 0.33, z: -0.6, h: 1.5, mood: 'happy', arm: s >= E.thats ? 'wave' : 'down' });
  });
  pose(C.sat, camera, { visible: set === 0 && s < E.but + 0.5, x: 2.6, y: 0.03, z: 1.2, h: 1.62, bow: true, mood: 'smug', arm: 'down' });
  board.visible = false; { const fwd = V(0, 0, -1).applyQuaternion(camera.quaternion), up = V(0, 1, 0).applyQuaternion(camera.quaternion); board.position.copy(camera.position).add(fwd.multiplyScalar(2.0)).add(up.multiplyScalar(0.55)); board.quaternion.copy(camera.quaternion); board.scale.setScalar(0.42); }
  // --- the shut gate; the whisperers
  placeCrowd(waiting, t, 0, 0, 0.0, set === 40);
  bar.visible = s >= E.their + 0.4; kDoorL.position.x = -0.55; kDoorR.position.x = 0.55;
  pose(C.gd, camera, { visible: set === 40, x: 41.6, y: 0.03, z: -2.8, h: 1.75, mood: 'smug', arm: 'hips', flip: Math.sin(t * 4) > 0 && s >= E.their && s < E.people });
  [['w1', 36.0, -1.4], ['w2', 36.9, -1.8], ['w3', 44.2, -1.4]].forEach(([n, x, z], i) => pose(C[n], camera, { visible: set === 40 && s >= E.people - 0.3, x, y: 0.03, z, h: 1.65, mood: 'smug', arm: i === 1 ? 'point' : 'down', flip: x > 40 }));
  dots.forEach((d, i) => { d.visible = set === 40 && s >= E.people && s < E.wait; const [x, z] = [[36.2, -1.4], [37.1, -1.8], [44.0, -1.4], [36.6, -1.6], [43.6, -1.5]][i]; d.position.set(x + Math.sin(t * 3 + i) * 0.05, 2.15 + (i > 2 ? 0.35 : 0) + Math.sin(t * 4 + i) * 0.04, z + 0.1); d.quaternion.copy(camera.quaternion); });
  // --- Krishna: "I will"; the wedding in Dwarka; a palace for each; his name
  const kSet = set === 40 ? V(39.0, 0.03, 3.4) : V(80, 0.33, -0.9);
  const walkIn = set === 40 ? sm(seg(s, E.he - 0.6, E.he + 0.2)) : 1;
  pose(C.k, camera, { visible: (set === 40 && s >= E.wait) || set === 80 || s < E.remember, x: set === 40 ? lerp(34, kSet.x, walkIn) : kSet.x, y: kSet.y, z: kSet.z, h: 1.78, step: walkIn < 1 ? s * 3 : 0, mood: 'happy', arm: set === 40 && s >= E.he ? 'offer' : set === 80 && s >= E.and2 ? 'up' : 'down' });
  fire.forEach((f, i) => (f.scale.y = 1 + 0.25 * Math.sin(t * 11 + i * 2)));
  placeCrowd(bride, t, 0, 0, 0.04, set === 80);
  const lit = clamp((s - E.gave) / (E.and2 - E.gave)) * palaces.length; palaces.forEach(({ win, i }) => { win.material.opacity = i < lit ? 0.9 : 0; });
  garland.visible = set === 80 && s >= E.he2 && s < E.thats + 3; garland.position.set(80, 0.33 + 1.38, -0.8); garland.quaternion.copy(camera.quaternion);
  const nameK = sm(seg(s, E.and2, E.and2 + 0.6)) * (1 - sm(seg(s, E.thats + 0.5, E.thats + 1.5)));
  nameRays.forEach((r, i) => { r.material.opacity = set === 80 ? nameK * 0.14 : 0; r.rotation.z = i / 12 * Math.PI * 2 + t * 0.1; });
  confetti(E.he2 + 0.2, s, V(80, 3.4, -0.6));
  S.clouds.forEach((c, i) => { c.position.x = -80 + i * 15 + ((t * 0.6 + i * 3) % 12); });
}

const G = (t) => t, WED = (t) => E.he2 + 1.0 + t * 0.2;
const SHOTS = [
  [0, E.remember - 0.05, WED, [[80, 3.2, 8.4], [80, 1.6, -1.5]], [[80, 3.0, 7.4], [80, 1.6, -1.5]]],
  [E.remember - 0.05, E.as - 0.05, G, [[0, 4.5, 10], [0, 2.2, -8]], [[0, 3.8, 8.5], [0, 2.0, -6]]],
  [E.as - 0.05, E.the3 - 0.05, G, [[3.4, 2.4, 6.4], [1.6, 1.4, 0]], [[3.0, 2.2, 5.8], [1.6, 1.4, 0]]],
  [E.the3 - 0.05, E.but - 0.05, G, [[0, 2.6, 9.0], [0, 1.0, -2]], [[0, 2.4, 7.6], [0, 1.0, -1]]],
  [E.but - 0.05, E.their - 0.05, G, [[0, 3.4, 8.0], [0, 1.2, 0.4]], [[0, 3.2, 7.4], [0, 1.2, 0.4]]],
  [E.their - 0.05, E.people - 0.05, G, [[40, 2.2, 7.0], [40, 1.6, -3.6]], [[40, 2.0, 6.0], [40, 1.6, -3.6]]],
  [E.people - 0.05, E.who - 0.05, G, [[38.4, 1.9, 2.0], [36.6, 1.7, -1.6]], [[38.2, 1.9, 1.7], [36.6, 1.7, -1.6]]],
  [E.who - 0.05, E.wait - 0.05, G, [[40.0, 1.6, 4.8], [40.0, 1.2, 1.6]], [[40.0, 1.6, 4.4], [40.0, 1.2, 1.6]]],
  [E.wait - 0.05, E.he - 0.05, G, [[37.0, 1.9, 6.6], [38.8, 1.3, 2.4]], [[37.4, 1.9, 6.2], [39.0, 1.3, 2.6]]],
  [E.he - 0.05, E.he2 - 0.05, G, [[39.3, 1.8, 5.8], [39.0, 1.6, 3.4]], [[39.3, 1.8, 5.5], [39.0, 1.6, 3.4]]],
  [E.he2 - 0.05, E.gave - 0.05, G, [[80, 3.0, 7.4], [80, 1.6, -1.0]], [[80, 2.8, 6.4], [80, 1.6, -1.0]]],
  [E.gave - 0.05, E.and2 - 0.05, G, [[80, 6, 12], [80, 1.5, -8]], [[80, 5, 10], [80, 1.5, -8]]],
  [E.and2 - 0.05, E.so - 0.05, G, [[80.2, 2.1, 3.2], [80, 1.9, -0.9]], [[80.2, 2.1, 2.9], [80, 1.9, -0.9]]],
  [E.so - 0.05, E.thats - 0.05, G, [[80, 3.6, 9.0], [80, 1.5, -1]], [[80, 3.4, 8.4], [80, 1.5, -1]]],
  [E.thats - 0.05, E.not - 0.05, G, [[78.6, 2.6, 6.0], [80, 1.6, -0.9]], [[79.0, 2.5, 5.6], [80, 1.6, -0.9]]],
  [E.not - 0.05, E.comment - 0.05, G, [[80.2, 2.1, 3.4], [80, 1.9, -0.9]], [[80.2, 2.1, 3.1], [80, 1.9, -0.9]]],
  [E.comment - 0.05, DURATION + 0.1, G, [[80, 3.4, 8.2], [80, 1.7, -1]], [[80, 3.3, 7.8], [80, 1.7, -1]]],
];
direct({ stage, WORDS, DURATION, shots: SHOTS, update, title: E.remember - 0.05, q: [E.wait, E.he], cta: E.comment,
  key: ['krishna', 'marry', '16,000', 'princesses', 'narakasura', 'demon', 'story', 'satyabhama', 'free', 'nowhere', 'kingdoms', 'back', 'whispered', 'prisoners', 'accept', 'wait', 'will', 'married', 'every', 'palace', 'name', 'whisper', 'wives', 'himself', 'honor', 'comment', 'dwarkadhish'],
  loc: (t) => (t >= E.as - 0.05 && t < E.the3 - 0.05 ? '📍 NARAKA’S FORTRESS · AFTER THE BATTLE' : t >= E.he2 - 0.05 && t < E.gave - 0.05 ? '📍 DWARKA' : ''), shakes: [], tick: () => {} });
