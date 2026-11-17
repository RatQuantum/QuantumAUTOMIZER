// Day 59 · "Why does a small prayer every day matter?" · Why we do what we do #41 (Narada and the farmer)
// KB brief: emotion = surprise → humility · lever = status (God's greatest devotee) · odd detail: the oil pot shows Narada's reflection, never Krishna's.
// Sets: the cloud court (origin), the farmer's field (x = 40), the city with the oil pot (x = 80), a morning prayer today (x = 120).
import * as THREE from './three.module.js';
import { rng, mat, mesh, sm, seg, lerp, clamp, setupScene, makeCast, pose, lamp, hut, cow, roundTree } from './kit.js';
import { makeStage, direct, wordTime } from './director.js';
import { addOutlines, makeConfetti } from './plus.js';
import { WORDS, DURATION } from './data.js';

const stage = makeStage(), { scene, camera } = stage, V = (x, y, z) => new THREE.Vector3(x, y, z), R = rng(59);
const S = setupScene(scene, [[0, 0], [40, 0], [80, 0], [120, 0]], 59);
const WT = wordTime(WORDS);
const E = { stay: WT('stay'), as: WT('as'), chanted: WT('chanted'), asked: WT('asked'), k2: WT('krishna', 2), farmer2: WT('farmer', 2), laughed: WT('laughed'), so: WT('so'), carry: WT('carry'), walked: WT('walked'),
  came: WT('came'), wait: WT('wait'), how: WT('how'), silent: WT('silent'), farmer3: WT('farmer', 3), thats: WT("that's"), comment: WT('comment') };
const glow = (c, o = 0.5) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, depthWrite: false, blending: THREE.AdditiveBlending });
const noOut = (m) => { m.userData.noOutline = true; m.castShadow = false; return m; };
const nc = document.createElement('canvas'); nc.width = 512; nc.height = 128; const ntex = new THREE.CanvasTexture(nc); ntex.colorSpace = THREE.SRGBColorSpace;
let nshown = -1; function drawCount(n) { if (n === nshown) return; nshown = n; const c = nc.getContext('2d'); c.clearRect(0, 0, 512, 128); c.font = '900 84px Nunito, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineWidth = 14; c.strokeStyle = '#16121c'; c.strokeText(n, 256, 66); c.fillStyle = '#ffd23a'; c.fillText(n, 256, 66); ntex.needsUpdate = true; }
const counter = noOut(new THREE.Mesh(new THREE.PlaneGeometry(2.4, 0.6), new THREE.MeshBasicMaterial({ map: ntex, transparent: true, depthTest: false }))); scene.add(counter);
// ---------------- the cloud court (origin)
for (let i = 0; i < 14; i++) noOut(mesh(new THREE.SphereGeometry(1 + R() * 0.8, 12, 8), mat(0xfaf8f0), (R() - 0.5) * 12, -1.1 + R() * 0.3, (R() - 0.5) * 8 - 3, scene));
const throne = mesh(new THREE.BoxGeometry(1.6, 0.6, 1.0), mat(0xffd23a, { m: 0.5, r: 0.4 }), 0.6, 0.3, -1.6, scene); mesh(new THREE.BoxGeometry(1.4, 1.6, 0.2), mat(0xffd23a, { m: 0.5, r: 0.4 }), 0.6, 1.1, -2.1, scene);
const halo = noOut(mesh(new THREE.RingGeometry(0.5, 0.58, 40), glow(0xffe08a, 0.35), 0.6, 1.95, -1.9, scene));
const vision = noOut(mesh(new THREE.CircleGeometry(0.9, 32), new THREE.MeshBasicMaterial({ color: 0x8ad84a }), -1.6, 2.6, -1.0, scene)), visionRing = noOut(mesh(new THREE.RingGeometry(0.9, 1.0, 40), glow(0xfff0a0, 0.6), -1.6, 2.6, -0.99, scene));
const visFarmer = makeCast(scene, [['vf', 'sudama']]);
// ---------------- the farmer's field (x = 40)
mesh(new THREE.CylinderGeometry(16, 16, 0.06, 28), mat(0x8ad84a), 40, 0.03, 0, scene).castShadow = false;
for (let r = 0; r < 6; r++) noOut(mesh(new THREE.BoxGeometry(10, 0.12, 0.35), mat(0x6a4a2a), 40, 0.08, -1.5 - r * 0.9, scene));
for (let i = 0; i < 40; i++) noOut(mesh(new THREE.ConeGeometry(0.06, 0.4, 4), mat(0x5ab83a), 35.5 + (i % 10) * 1.0, 0.22, -1.5 - Math.floor(i / 10) * 0.9, scene));
hut(scene, 44.5, -4.2, R, -0.4); cow(scene, 36.4, -3.2, 1.2, R); roundTree(scene, 36, 1.6, R, 1.2);
const plough = new THREE.Group(); scene.add(plough); noOut(mesh(new THREE.BoxGeometry(1.2, 0.06, 0.06), mat(0x8a5a2a), 0, 0.6, 0, plough)).rotation.z = 0.5; noOut(mesh(new THREE.ConeGeometry(0.08, 0.3, 4).rotateZ(Math.PI), mat(0x8a8a90), 0.5, 0.25, 0, plough));
const hut2 = hut(scene, 38.0, -5.5, R, 0.3);
// ---------------- the city with the oil pot (x = 80)
mesh(new THREE.BoxGeometry(20, 0.06, 18), mat(0xd9c08a), 80, 0.03, -2, scene).castShadow = false;
for (let i = 0; i < 4; i++) for (const sd of [-1, 1]) { const x = 80 + sd * (3.6 + (i % 2) * 0.3), z = -8 + i * 3.0, h = 2.4 + (i % 3) * 0.6; mesh(new THREE.BoxGeometry(2.4, h, 2.4), mat([0xf3e2b8, 0xe8c890, 0xf6d8c8][(i + (sd > 0 ? 1 : 0)) % 3]), x, h / 2, z, scene); mesh(new THREE.BoxGeometry(2.6, 0.2, 2.6), mat(0xc9a227), x, h + 0.1, z, scene); }
const market = []; for (let i = 0; i < 4; i++) { const g = makeCast(scene, [['m' + i, ['gopi1', 'kid1', 'courtier', 'gopi2'][i]]]); market.push(g['m' + i]); }
const POT = new THREE.Group(); scene.add(POT); noOut(mesh(new THREE.SphereGeometry(0.2, 14, 10).scale(1, 0.8, 1), mat(0xc8643a), 0, 0, 0, POT)); noOut(mesh(new THREE.CylinderGeometry(0.1, 0.13, 0.08, 12), mat(0xc8643a), 0, 0.16, 0, POT)); const oil = noOut(mesh(new THREE.CircleGeometry(0.095, 16).rotateX(-Math.PI / 2), mat(0xe8b020, { r: 0.1, m: 0.4 }), 0, 0.2, 0, POT));
const shine = noOut(mesh(new THREE.SphereGeometry(0.03, 8, 6), glow(0xfff0a0, 0.6), 0, 0, 0, scene));
// ---------------- a morning prayer today (x = 120)
const T = new THREE.Group(); T.position.set(120, 0, 0); scene.add(T);
mesh(new THREE.BoxGeometry(12, 0.1, 9), mat(0xf3e6c8), 0, 0.05, 0, T).castShadow = false; mesh(new THREE.BoxGeometry(12, 8, 0.3), mat(0xb0d0f0), 0, 4, -3, T);
mesh(new THREE.BoxGeometry(1.6, 1.0, 0.8), mat(0x8a4b20), -1.8, 0.5, -2.4, T); mesh(new THREE.BoxGeometry(1.7, 0.08, 0.9), mat(0xffd23a), -1.8, 1.02, -2.4, T);
const tl = lamp(T, -1.3, 1.06, -2.1, 0.5);
mesh(new THREE.BoxGeometry(1.6, 0.9, 0.7), mat(0x6a8a9a), 2.2, 0.45, -2.3, T); const bag = mesh(new THREE.BoxGeometry(0.6, 0.45, 0.2), mat(0x3a3a5a), 1.4, 0.25, 0.6, T);
// ---------------- the cast
const C = makeCast(scene, [['na', 'narada'], ['k', 'krishna'], ['fa', 'sudama'], ['fw', 'gopi2'], ['fk', 'kid1'], ['na2', 'narada'], ['tk', 'krishna'], ['p1', 'gopi3'], ['p2', 'kid2']]);
C.fa.spec = Object.assign({}, C.fa.spec, { body: '#c8a878' }); visFarmer.vf.spec = C.fa.spec;
C.p1.spec = Object.assign({}, C.p1.spec, { body: '#5a7ac8' });
addOutlines(scene);
const confetti = makeConfetti(scene, 50, 59);
const right = new THREE.Vector3();

function update(s, t) {
  const cx = camera.position.x, set = cx > 100 ? 120 : cx > 60 ? 80 : cx > 20 ? 40 : 0, hook = s < E.as, ending = s >= E.comment;
  S.mood(0); S.hemi.intensity = set === 0 ? 1.6 : 1.35; S.sun.target.position.set(set, 0, 0); S.sun.position.set(set - 8, 14, 10); S.sun.target.updateMatrixWorld();
  if (set === 0) S.paintSky(new THREE.Color(0x8ab8f0), new THREE.Color(0xffe8c0));
  right.setFromMatrixColumn(camera.matrixWorld, 0); right.y = 0; right.normalize();
  // --- the cloud court: Narada chanting, asking; Krishna shows the farmer in a vision
  const chanting = s >= E.chanted && s < E.asked;
  pose(C.na, camera, { visible: set === 0, x: -0.6, y: 0.4, z: 0.4, h: 1.66, mood: s >= E.laughed && s < E.so ? 'happy' : chanting ? 'closed' : s >= E.farmer2 ? 'smug' : 'happy', arm: chanting ? 'up' : s >= E.asked && s < E.k2 ? 'offer' : 'down' });
  pose(C.k, camera, { visible: set === 0, x: 0.6, y: 0.6, z: -1.5, h: 1.74, mood: 'happy', arm: s >= E.k2 && s < E.so ? 'point' : s >= E.so ? 'offer' : 'down', flip: true });
  halo.visible = set === 0; halo.quaternion.copy(camera.quaternion);
  const vis = set === 0 && s >= E.k2 + 0.4 && s < E.carry; vision.visible = visionRing.visible = vis; vision.quaternion.copy(camera.quaternion); visionRing.quaternion.copy(camera.quaternion);
  pose(visFarmer.vf, camera, { visible: vis, x: -1.6, y: 2.0, z: -0.95, h: 1.0, mood: 'closed', arm: 'fold', namaste: true });
  const count = chanting ? Math.floor((s - E.chanted) * 900 + 108) : s >= E.farmer2 && s < E.laughed + 0.8 ? 3 : -1;
  counter.visible = set === 0 && count > 0; if (counter.visible) { drawCount(count > 100 ? count.toLocaleString() + ' ×' : '3 ×'); counter.position.set(chanting ? -0.6 : -1.6, chanting ? 2.35 : 3.8, chanting ? 0.5 : -1.0); counter.quaternion.copy(camera.quaternion); }
  // --- the field: the busy farmer (hook + payoff)
  const busy = (k) => Math.sin(t * 3 + k) * 0.06;
  pose(C.fa, camera, { visible: set === 40, x: 40 + busy(0), z: -0.6, h: 1.66, mood: s >= E.farmer3 + 2 || hook ? 'closed' : 'happy', arm: hook || s >= E.farmer3 + 2 ? 'fold' : 'offer', namaste: hook || s >= E.farmer3 + 2, step: hook || s >= E.farmer3 + 2 ? 0 : s * 2 });
  plough.visible = set === 40 && !(hook || s >= E.farmer3 + 2); plough.position.set(40.5, 0, -0.5);
  pose(C.fw, camera, { visible: set === 40, x: 42.0, z: -2.2, h: 1.6, mood: 'happy', arm: 'offer', flip: true });
  pose(C.fk, camera, { visible: set === 40, x: 41.3, z: -1.6, h: 1.1, mood: 'happy', arm: 'up', flip: true });
  // the hook: Krishna points at the farmer; Narada surprised (in the field)
  pose(C.na2, camera, { visible: set === 40 && hook, x: 38.6, z: 0.6, h: 1.66, mood: 'wow', arm: 'down' });
  pose(C.tk, camera, { visible: set === 40 && hook, x: 40.55, z: 0.7, h: 1.74, mood: 'happy', arm: 'point', flip: false });
  // --- the city: Narada walks, eyes glued to the pot; the market ignored
  const walk = sm(seg(s, E.walked - 0.3, E.came)), proud = s >= E.came, guilty = s >= E.how;
  const np = set === 80 ? V(80, 0, lerp(-6.5, 1.2, walk)) : V(-0.6, 0.4, 0.4);
  if (set === 80) pose(C.na, camera, { visible: true, x: np.x, z: np.z, h: 1.66, mood: guilty ? 'sad' : proud ? 'smug' : 'normal', arm: guilty ? 'down' : 'offer', step: walk > 0 && walk < 1 ? s * 2 : 0 });
  POT.visible = set === 80 && !guilty || (set === 0 && s >= E.carry && s < E.walked); const pp = set === 80 ? np.clone().add(right.clone().multiplyScalar(0.48)).add(V(0, 1.05, 0.08)) : V(0.15, 1.4, -0.6); POT.position.copy(pp);
  shine.visible = POT.visible; shine.position.copy(pp).add(V(0.03, 0.22, 0.02)); shine.scale.setScalar(0.8 + 0.4 * Math.abs(Math.sin(t * 5)));
  market.forEach((m, i) => pose(m, camera, { visible: set === 80, x: 80 + (i % 2 ? 2.2 : -2.2), z: -5 + i * 1.8, h: i === 1 ? 1.1 : 1.62, mood: 'happy', arm: i % 2 ? 'wave' : 'offer', flip: i % 2 === 1 }));
  // --- today: a quick prayer before school/work
  tl.flame.scale.y = 1 + 0.15 * Math.sin(t * 13);
  if (set !== 40) pose(C.tk, camera, { visible: set === 120, x: 118.2, y: 1.06, z: -2.4, h: 1.2, mood: 'happy', flute: true });
  pose(C.p1, camera, { visible: set === 120, x: 119.0, z: 0.0, h: 1.66, mood: 'closed', arm: ending ? 'up' : 'fold', namaste: !ending });
  pose(C.p2, camera, { visible: set === 120, x: 120.2, z: 0.4, h: 1.12, mood: 'closed', arm: ending ? 'up' : 'fold', namaste: !ending, flip: true });
  confetti(E.comment, s, V(120, 3, -1));
  S.clouds.forEach((c, i) => { c.position.x = -80 + i * 15 + ((t * 0.6 + i * 3) % 12); });
}

const G = (t) => t;
const HOOK = [[39.75, 1.6, 5.2], [39.65, 1.2, 0]];
const SHOTS = [
  [0, E.stay - 0.05, G, HOOK, HOOK, [62, 40], { move: 'dolly' }],
  [E.stay - 0.05, E.as - 0.05, G, [[38.7, 1.6, 2.6], [38.6, 1.45, 0.6]], [[38.7, 1.6, 2.3], [38.6, 1.45, 0.6]]],
  [E.as - 0.05, E.asked - 0.05, G, [[0, 3.2, 8], [0, 1.6, -1]], [[-0.5, 2.0, 4.0], [-0.5, 1.6, 0.2]], 50, { move: 'pull' }],
  [E.asked - 0.05, E.k2 - 0.05, G, [[-0.2, 1.8, 4.4], [0, 1.5, -0.6]], [[-0.2, 1.8, 4.0], [0, 1.5, -0.6]]],
  [E.k2 - 0.05, E.laughed - 0.05, G, [[-1.2, 2.6, 3.6], [-1.4, 2.6, -1.0]], [[-1.2, 2.6, 3.2], [-1.4, 2.6, -1.0]]],
  [E.laughed - 0.05, E.so - 0.05, G, [[-0.6, 1.6, 2.6], [-0.6, 1.6, 0.4]], [[-0.6, 1.6, 2.3], [-0.6, 1.6, 0.4]], [62, 40], { move: 'dolly' }],
  [E.so - 0.05, E.walked - 0.05, G, [[0, 2.0, 4.4], [0, 1.5, -0.6]], [[0, 2.0, 4.0], [0, 1.5, -0.6]]],
  [E.walked - 0.05, E.came - 0.05, G, [[80, 2.2, 4.2], [80, 1.2, -2]], [[80.4, 1.6, 4.6], [80, 1.3, 0.6]]],
  [E.came - 0.05, E.wait - 0.05, G, [[80.5, 1.6, 3.6], [80.2, 1.3, 1.2]], [[80.5, 1.6, 3.4], [80.2, 1.3, 1.2]]],
  [E.wait - 0.05, E.how - 0.05, G, [[80.9, 1.5, 2.2], [80.45, 1.15, 1.3]], [[80.9, 1.5, 2.0], [80.45, 1.15, 1.3]], [62, 40], { move: 'dolly' }],
  [E.how - 0.05, E.farmer3 - 0.05, G, [[80.3, 1.6, 3.6], [80.1, 1.4, 1.2]], [[80.3, 1.6, 3.3], [80.1, 1.4, 1.2]]],
  [E.farmer3 - 0.05, E.thats - 0.05, G, [[40, 2.6, 6], [40.6, 1.0, -1.2]], [[40, 1.6, 3.6], [40, 1.2, -0.6]], 50, { move: 'land' }],
  [E.thats - 0.05, E.comment - 0.05, G, [[119.6, 2.4, 6.0], [119.4, 1.2, -1]], [[119.6, 1.8, 3.6], [119.5, 1.2, 0]], 50, { move: 'land' }],
  [E.comment - 0.05, DURATION + 0.1, G, [[119.4, 2.2, 5.0], [119.2, 1.4, -1.2]], [[119.4, 2.2, 4.6], [119.2, 1.4, -1.2]]],
];
direct({ stage, WORDS, DURATION, shots: SHOTS, update, title: 1.4, q: [E.wait, E.how], cta: E.comment, prog: [E.so, E.thats], pin: E.wait,
  key: ['narada', 'greatest', 'devotee', 'farmer', 'surprise', 'narayana', 'loves', 'three', 'laughed', 'test', 'oil', 'city', 'spill', 'drop', 'proud', 'wait', 'smiling', 'think', 'silent', 'once', 'family', 'remembered', 'prayer', 'matters', 'comment', 'busy'],
  loc: (t) => (t >= E.as - 0.05 && t < E.asked ? '📍 VAIKUNTHA' : t >= E.walked - 0.05 && t < E.came ? 'THE TEST' : t >= E.thats - 0.05 && t < E.comment ? 'EVERY MORNING' : ''), shakes: [E.silent], tick: () => {} });
