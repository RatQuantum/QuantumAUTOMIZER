// Day 56 · "Why don't we look at the moon on Ganesh Chaturthi?" · Why we do what we do #38 (Syamantaka)
// KB brief: emotion = injustice → relief · lever = status (a good name) · odd detail: the moon's reflection in a cup of milk.
// Sets: Ganesha and the laughing moon (origin), Dwarka at night (x = 40), Jambavan's cave (x = 80), a Chaturthi home today (x = 120).
import * as THREE from './three.module.js';
import { rng, mat, mesh, sm, seg, lerp, clamp, setupScene, makeCast, pose, lamp, roundTree, hut } from './kit.js';
import { makeStage, direct, wordTime } from './director.js';
import { addOutlines, makeConfetti } from './plus.js';
import { WORDS, DURATION } from './data.js';

const stage = makeStage(), { scene, camera } = stage, V = (x, y, z) => new THREE.Vector3(x, y, z), R = rng(56);
const S = setupScene(scene, [[0, 0], [40, 0], [80, 0], [120, 0]], 56);
const WT = wordTime(WORDS);
const E = { stay: WT('stay'), as: WT('as'), ganesha: WT('ganesha'), laughed: WT('laughed'), so: WT('so'), years: WT('years'), k2: WT('krishna', 2), milk: WT('milk'), but: WT('but'), syam: WT('syamantaka'), stole: WT('stole'),
  forest: WT('forest'), cave: WT('cave'), fought: WT('fought'), wait: WT('wait'), jamb: WT('jambavan'), recog: WT('recognized'), fell: WT('fell'), thats: WT("that's"), and3: WT('if'), comment: WT('comment') };
const glow = (c, o = 0.5) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, depthWrite: false, blending: THREE.AdditiveBlending });
const noOut = (m) => { m.userData.noOutline = true; m.castShadow = false; return m; };
// a moon with a face (laughs, then frowns under the curse)
const mc = document.createElement('canvas'); mc.width = mc.height = 256; const mtex = new THREE.CanvasTexture(mc); mtex.colorSpace = THREE.SRGBColorSpace;
let moonMood = '';
function drawMoon(m) { if (m === moonMood) return; moonMood = m; const c = mc.getContext('2d'); c.clearRect(0, 0, 256, 256); c.beginPath(); c.arc(128, 128, 120, 0, 7); c.fillStyle = '#fff4c8'; c.fill(); c.lineWidth = 8; c.strokeStyle = '#1d1a24'; c.stroke();
  for (const [x, y, r] of [[70, 80, 14], [170, 170, 18], [190, 90, 10]]) { c.beginPath(); c.arc(x, y, r, 0, 7); c.fillStyle = '#efe0a8'; c.fill(); }
  c.lineCap = 'round'; c.lineWidth = 9; c.strokeStyle = '#1d1a24';
  if (m === 'laugh') { for (const x of [95, 160]) { c.beginPath(); c.arc(x, 112, 16, Math.PI * 1.1, Math.PI * 1.9); c.stroke(); } c.beginPath(); c.arc(128, 150, 40, 0.1 * Math.PI, 0.9 * Math.PI); c.closePath(); c.fillStyle = '#1d1a24'; c.fill(); }
  else if (m === 'sad') { for (const x of [95, 160]) { c.beginPath(); c.arc(x, 118, 9, 0, 7); c.fillStyle = '#1d1a24'; c.fill(); } c.beginPath(); c.arc(128, 190, 30, 1.2 * Math.PI, 1.8 * Math.PI); c.stroke(); }
  else { for (const x of [95, 160]) { c.beginPath(); c.arc(x, 118, 9, 0, 7); c.fillStyle = '#1d1a24'; c.fill(); } c.beginPath(); c.arc(128, 150, 24, 0.15 * Math.PI, 0.85 * Math.PI); c.stroke(); }
  mtex.needsUpdate = true; }
const moon = noOut(mesh(new THREE.PlaneGeometry(3.6, 3.6), new THREE.MeshBasicMaterial({ map: mtex, transparent: true, fog: false }), 0, 0, 0, scene));
const moonGlow = noOut(mesh(new THREE.CircleGeometry(2.6, 32), glow(0xfff0c0, 0.18), 0, 0, 0, scene));
// ---------------- the feast night (origin)
mesh(new THREE.CylinderGeometry(14, 14, 0.06, 28), mat(0x6aa84a), 0, 0.03, 0, scene).castShadow = false;
for (let i = 0; i < 6; i++) roundTree(scene, (i % 2 ? 1 : -1) * (5 + (i % 3)), -6 + i * 1.4, R, 1.1);
const modaks = []; for (let i = 0; i < 7; i++) modaks.push(noOut(mesh(new THREE.ConeGeometry(0.12, 0.2, 8), mat(0xfaf0d0), -0.9 + (i % 4) * 0.18, 0.11, 0.9 + Math.floor(i / 4) * 0.2, scene)));
const curse = noOut(mesh(new THREE.CylinderGeometry(0.06, 0.06, 1, 8).rotateX(Math.PI / 2).translate(0, 0, 0.5), glow(0xff5a3a, 0.7), 0, 0, 0, scene));
const people = [];
// ---------------- Dwarka at night (x = 40): Krishna, a cup of milk, the whispers
mesh(new THREE.BoxGeometry(14, 0.1, 10), mat(0xe8d8b8), 40, 0.05, 0, scene).castShadow = false; mesh(new THREE.BoxGeometry(14, 6, 0.3), mat(0xf3e2b8), 40, 3, -3.4, scene);
for (const x of [35.5, 44.5]) mesh(new THREE.CylinderGeometry(0.3, 0.34, 6, 10), mat(0xfaf5ea), x, 3, -2.6, scene);
const dl = [lamp(scene, 37.6, 0.1, -1.6, 0.9), lamp(scene, 42.4, 0.1, -1.6, 0.9)];
const cup = new THREE.Group(); scene.add(cup); noOut(mesh(new THREE.CylinderGeometry(0.11, 0.08, 0.16, 12), mat(0xc0c0c8, { m: 0.6, r: 0.3 }), 0, 0, 0, cup)); noOut(mesh(new THREE.CircleGeometry(0.095, 16).rotateX(-Math.PI / 2), mat(0xffffff), 0, 0.081, 0, cup)); const refl = noOut(mesh(new THREE.CircleGeometry(0.05, 12).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0xffd040 }), 0.02, 0.083, 0.01, cup));
const jewel = noOut(mesh(new THREE.OctahedronGeometry(0.12), mat(0xff3a4a, { m: 0.3, r: 0.1, e: 0x8a0010, ei: 1 }), 0, 0, 0, scene)), jGlow = noOut(mesh(new THREE.SphereGeometry(0.3, 12, 8), glow(0xff6a7a, 0.4), 0, 0, 0, scene));
// ---------------- Jambavan's cave (x = 80)
mesh(new THREE.CylinderGeometry(14, 14, 0.06, 28), mat(0x4a7a3a), 80, 0.03, 0, scene).castShadow = false;
const caveRock = mesh(new THREE.SphereGeometry(4.5, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), mat(0x6a6a72), 80, 0, -5.5, scene); caveRock.scale.set(1.3, 1, 1);
noOut(mesh(new THREE.CircleGeometry(1.8, 24, 0, Math.PI), new THREE.MeshBasicMaterial({ color: 0x0a0a10 }), 80, 0.02, -1.08, scene));
for (let i = 0; i < 8; i++) roundTree(scene, 80 + (i % 2 ? 1 : -1) * (5 + (i % 3) * 1.4), -3 + i * 0.8, R, 1.0);
const dust = []; for (let i = 0; i < 14; i++) dust.push(noOut(mesh(new THREE.SphereGeometry(0.25, 8, 6), new THREE.MeshBasicMaterial({ color: 0xc8b898, transparent: true, opacity: 0.4, depthWrite: false }), 0, 0, 0, scene)));
// ---------------- a Chaturthi home today (x = 120)
const T = new THREE.Group(); T.position.set(120, 0, 0); scene.add(T);
mesh(new THREE.BoxGeometry(12, 0.1, 9), mat(0xf3e6c8), 0, 0.05, 0, T).castShadow = false; mesh(new THREE.BoxGeometry(12, 8, 0.3), mat(0xf6a24a), 0, 4, -3, T);
mesh(new THREE.BoxGeometry(2.6, 0.9, 1.2), mat(0x8a4b20), 0, 0.45, -2.2, T); mesh(new THREE.BoxGeometry(2.7, 0.08, 1.3), mat(0xffd23a), 0, 0.92, -2.2, T);
for (let i = 0; i < 24; i++) { const a = i / 23 * Math.PI; noOut(mesh(new THREE.SphereGeometry(0.1, 6, 4), mat([0xff8a2a, 0xffffff, 0xffd23a][i % 3]), Math.cos(a) * 1.3, 1.8 + Math.sin(a) * 1.6, -2.6, T)); }
const tl = [lamp(T, -1.0, 0.96, -1.85, 0.55), lamp(T, 1.0, 0.96, -1.85, 0.55)];
mesh(new THREE.BoxGeometry(1.6, 1.6, 0.1), mat(0x1a2a5a), 3.4, 3.2, -2.84, T); const curtain = mesh(new THREE.BoxGeometry(1.7, 1.7, 0.06), mat(0xd8263a), 3.4, 3.2, -2.75, T);
const tModaks = []; for (let i = 0; i < 5; i++) tModaks.push(noOut(mesh(new THREE.ConeGeometry(0.1, 0.18, 8), mat(0xfaf0d0), 119.6 + i * 0.2, 1.05, -1.75, scene)));
// ---------------- the cast
const C = makeCast(scene, [['ga', 'ganesha'], ['k', 'krishna'], ['w1', 'courtier'], ['w2', 'gopi2'], ['w3', 'king'], ['jb', 'jambavan'], ['k3', 'krishna'], ['tg', 'ganesha'], ['d1', 'gopi3'], ['d2', 'kid1'], ['h1', 'devotee'], ['h2', 'gopi1'], ['h3', 'kid2'], ['h4', 'govinda']]);
addOutlines(scene);
const confetti = makeConfetti(scene, 50, 56);
const right = new THREE.Vector3();

function update(s, t) {
  const cx = camera.position.x, set = cx > 100 ? 120 : cx > 60 ? 80 : cx > 20 ? 40 : 0, hook = s < E.as;
  const night = set === 0 || set === 40 ? 0.75 : set === 80 ? 0.35 : 0;
  S.mood(night); S.hemi.intensity = 1.35 - night * 0.5; S.sun.target.position.set(set, 0, 0); S.sun.position.set(set - 8, 14, 10); S.sun.target.updateMatrixWorld();
  right.setFromMatrixColumn(camera.matrixWorld, 0); right.y = 0; right.normalize();
  // the moon: over the feast (laughing), over Dwarka (reflected), hidden today
  const mp = set === 0 ? V(1.2, 6.5, -9) : V(43, 6.5, -9); moon.visible = moonGlow.visible = set === 0 || set === 40;
  moon.position.copy(mp); moon.quaternion.copy(camera.quaternion); moonGlow.position.copy(mp).add(V(0, 0, -0.1)); moonGlow.quaternion.copy(camera.quaternion);
  drawMoon(s >= E.laughed && s < E.so + 0.6 && !hook ? 'laugh' : s >= E.so + 0.6 && s < E.years ? 'sad' : 'calm');
  // --- hook: people turn away from the moon, hands over their eyes
  [['h1', -1.6, 1.2], ['h2', -0.5, 1.6], ['h3', 0.6, 1.4], ['h4', 1.7, 1.1]].forEach(([n, x, z], i) => pose(C[n], camera, { visible: set === 0 && hook, x, z, h: n === 'h3' ? 1.1 : 1.62, mood: 'closed', arm: 'up', flip: i % 2 === 0 }));
  // --- Ganesha after the feast: trips; the moon laughs; the curse
  const trip = sm(seg(s, E.ganesha + 0.3, E.ganesha + 0.8)) * (1 - sm(seg(s, E.laughed + 0.4, E.so)));
  pose(C.ga, camera, { visible: set === 0 && !hook, x: -0.5, z: 0.4, h: 1.9, mood: s >= E.laughed && s < E.so ? 'sad' : s >= E.so ? 'normal' : 'happy', arm: s >= E.so && s < E.years ? 'point' : 'down' });
  if (set === 0 && !hook) C.ga.m.rotateZ(-trip * 0.5);
  modaks.forEach((m, i) => { m.visible = set === 0 && !hook; const sc = trip > 0.3 ? 1 : 0; m.position.y = 0.11; m.position.x = -0.9 + (i % 4) * 0.18 + sc * Math.sin(i * 3) * 0.3; });
  const cu = sm(seg(s, E.so + 0.2, E.so + 0.7)); curse.visible = set === 0 && s >= E.so + 0.2 && s < E.years - 0.2; curse.position.set(-0.3, 2.2, 0.4); curse.lookAt(mp); curse.scale.set(1, 1, V(-0.3, 2.2, 0.4).distanceTo(mp) * cu);
  // --- Dwarka: Krishna with the cup of milk; the moon in it; the whispers
  dl.forEach((l, i) => (l.flame.scale.y = 1 + 0.15 * Math.sin(t * 11 + i)));
  const accused = s >= E.but + 0.6 && s < E.forest;
  pose(C.k, camera, { visible: set === 40, x: 40, z: 0, h: 1.74, sitting: s < E.but, mood: accused ? 'normal' : 'happy', arm: s < E.but ? 'offer' : 'down', flip: true });
  cup.visible = set === 40 && s < E.but + 0.5; cup.position.set(40, 0.0 + 1.74 * 0.44, 0.08).add(right.clone().multiplyScalar(-0.4)); refl.visible = s >= E.k2;
  [['w1', 38.9, 1.3], ['w2', 41.1, 1.4], ['w3', 41.6, -0.4]].forEach(([n, x, z], i) => pose(C[n], camera, { visible: set === 40 && accused, x, z, h: 1.64, mood: 'smug', arm: i === 1 ? 'point' : 'hips', flip: x > 40 }));
  jewel.visible = jGlow.visible = (set === 40 && s >= E.syam - 0.3 && s < E.syam + 1.4) || (set === 80 && s >= E.fell);
  const jp = set === 40 ? V(40, 3.2, -1) : V(80.5, 1.1 + Math.sin(t * 2) * 0.05, 0.6); jewel.position.copy(jp); jGlow.position.copy(jp); jewel.rotation.y = t * 2;
  // --- the cave: the fight; Jambavan recognises Him and bows
  const fighting = s >= E.fought - 0.2 && s < E.recog, bowing = s >= E.recog;
  const jit = fighting ? Math.sin(t * 14) * 0.25 : 0;
  pose(C.k3, camera, { visible: set === 80, x: 79.2 - jit * 0.5, z: 0.2, h: 1.74, mood: fighting ? 'normal' : 'happy', arm: fighting ? 'offer' : bowing ? 'offer' : 'down', step: s >= E.forest && s < E.fought - 0.2 ? s * 3 : 0 });
  pose(C.jb, camera, { visible: set === 80 && s >= E.cave, x: 80.9 + jit * 0.5, z: 0.0, h: bowing ? 1.9 : 2.1, mood: bowing ? 'closed' : fighting ? 'sad' : 'normal', arm: bowing ? 'fold' : fighting ? 'up' : 'down', namaste: bowing, flip: true });
  if (set === 80 && bowing) C.jb.m.rotateZ(0.25);
  dust.forEach((d, i) => { const u = (t * 1.1 + i / 14) % 1; d.visible = set === 80 && fighting; d.position.set(80 + Math.sin(i * 2.3) * 1.2, 0.2 + u * 1.2, 0.2 + Math.cos(i * 1.7) * 0.6); d.scale.setScalar(0.5 + u * 1.5); d.material.opacity = 0.35 * (1 - u); });
  // --- today
  pose(C.tg, camera, { visible: set === 120, x: 120, y: 0.96, z: -2.3, h: 1.4, mood: 'happy' });
  tl.forEach((l, i) => (l.flame.scale.y = 1 + 0.15 * Math.sin(t * 13 + i)));
  tModaks.forEach((m) => (m.visible = set === 120));
  pose(C.d1, camera, { visible: set === 120, x: 121.1, z: 0.8, h: 1.6, mood: s >= E.and3 ? 'happy' : 'closed', arm: s >= E.comment ? 'up' : 'fold', namaste: s < E.comment, flip: true });
  pose(C.d2, camera, { visible: set === 120, x: 119.0, z: 1.0, h: 1.1, mood: 'happy', arm: s < E.and3 ? 'up' : 'offer' });
  confetti(E.comment, s, V(120, 3, -1));
  S.clouds.forEach((c, i) => { c.visible = night < 0.5; c.position.x = -80 + i * 15 + ((t * 0.6 + i * 3) % 12); });
}

const G = (t) => t;
const SHOTS = [
  [0, E.stay - 0.05, G, [[0.2, 1.4, 5.6], [0.6, 3.2, -3]], [[0.2, 1.4, 5.6], [0.6, 3.2, -3]], [62, 40], { move: 'dolly' }],
  [E.stay - 0.05, E.as - 0.05, G, [[1.0, 5.0, 1.0], [1.2, 6.5, -9]], [[1.0, 5.4, -1.0], [1.2, 6.5, -9]]],
  [E.as - 0.05, E.laughed - 0.05, G, [[0, 2.6, 7.6], [0, 1.6, -2]], [[-0.4, 1.8, 4.4], [-0.5, 1.4, 0.4]], 50, { move: 'pull' }],
  [E.laughed - 0.05, E.so - 0.05, G, [[0.4, 3.0, 2.0], [1.2, 6.5, -9]], [[0.4, 3.0, 1.6], [1.2, 6.5, -9]]],
  [E.so - 0.05, E.years - 0.05, G, [[-1.6, 1.4, 4.6], [0.2, 3.4, -4]], [[-1.4, 1.2, 4.2], [0.4, 3.8, -5]], 50, { move: 'crane', lift: 0.8 }],
  [E.years - 0.05, E.milk - 0.4, G, [[40.5, 1.6, 3.2], [40, 1.1, 0]], [[40.4, 1.5, 2.8], [40, 1.0, 0]]],
  [E.milk - 0.4, E.but - 0.05, G, [[39.62, 1.2, 0.55], [39.6, 0.78, 0.08]], [[39.62, 1.15, 0.45], [39.6, 0.78, 0.08]], [62, 40], { move: 'dolly' }],
  [E.but - 0.05, E.stole - 0.05, G, [[40, 2.8, 6], [40, 2.6, -1]], [[40, 2.4, 5.0], [40, 1.6, 0]]],
  [E.stole - 0.05, E.forest - 0.05, G, [[40, 2.0, 6.0], [40, 1.3, 0.3]], [[40, 2.0, 5.5], [40, 1.3, 0.3]]],
  [E.forest - 0.05, E.fought - 0.05, G, [[78, 2.4, 7], [80, 1.6, -2]], [[79, 2.0, 5.4], [80, 1.2, -1]]],
  [E.fought - 0.05, E.wait - 0.05, G, [[80, 1.6, 4.4], [80, 1.2, 0]], [[80, 1.5, 3.8], [80, 1.2, 0]]],
  [E.wait - 0.05, E.recog - 0.05, G, [[81.2, 1.9, 2.6], [80.9, 1.8, 0]], [[81.2, 1.9, 2.3], [80.9, 1.8, 0]]],
  [E.recog - 0.05, E.thats - 0.05, G, [[80, 1.4, 4.0], [80.2, 1.2, 0]], [[80, 1.4, 4.0], [80.2, 1.2, 0]], [62, 40], { move: 'dolly' }],
  [E.thats - 0.05, E.and3 - 0.05, G, [[120, 3.0, 8.0], [120, 1.8, -2]], [[121.4, 2.4, 4.4], [121.6, 3.0, -2]], 50, { move: 'land' }],
  [E.and3 - 0.05, E.comment - 0.05, G, [[120.4, 1.4, 3.6], [120.2, 1.1, 0.8]], [[120.4, 1.4, 3.2], [120.2, 1.1, 0.8]]],
  [E.comment - 0.05, DURATION + 0.1, G, [[120, 2.2, 5.6], [120, 1.4, -1.5]], [[120, 2.2, 5.1], [120, 1.4, -1.5]]],
];
direct({ stage, WORDS, DURATION, shots: SHOTS, update, title: 1.4, q: [E.wait, E.jamb], cta: E.comment, prog: [E.but, E.thats], pin: E.wait,
  key: ['moon', 'refuse', 'cursed', 'ganesha', 'tripped', 'laughed', 'falsely', 'accused', 'reflection', 'milk', 'jewel', 'syamantaka', 'stole', 'forest', 'cave', 'bear', 'twenty-eight', 'wait', 'jambavan', 'ram', 'feet', 'chaturthi', 'name', 'comment', 'send', 'blamed'],
  loc: (t) => (t >= E.years - 0.05 && t < E.milk - 0.4 ? '📍 DWARKA · CHATURTHI NIGHT' : t >= E.thats - 0.05 && t < E.and3 ? 'EVERY GANESH CHATURTHI' : ''), shakes: [E.so + 0.3, E.fought], tick: () => {} });
