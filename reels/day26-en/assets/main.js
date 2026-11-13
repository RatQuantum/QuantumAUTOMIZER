// Day 26 · "Why is the flute hollow?" · Why we do what we do #8 (as the story goes: the bamboo that gave its heart)
// One set: a garden by the Yamuna with plants that can talk (eyes), a bamboo grove, cows, a river.
import * as THREE from './three.module.js';
import { rng, mat, mesh, sm, seg, lerp, clamp, setupScene, makeCast, pose, roundTree, palm, cow } from './kit.js';
import { makeStage, direct, wordTime } from './director.js';
import { addOutlines, makeConfetti } from './plus.js';
import { WORDS, DURATION } from './data.js';

const stage = makeStage(), { scene, camera } = stage, V = (x, y, z) => new THREE.Vector3(x, y, z), R = rng(26);
const S = setupScene(scene, [[0, 0]], 26);
const WT = wordTime(WORDS);
const E = { of: WT('of'), as: WT('as'), every: WT('every'), rose: WT('the', 2), mango: WT('mango') - 0.34, but: WT('but'), will: WT('will'), trembled: WT('bamboo', 3) - 0.24, then: WT('then'), yes: WT('yes'),
  so: WT('so'), hollowed: WT('hollowed'), pierced: WT('pierced'), wait: WT('wait'), because: WT('because'), put: WT('put'), sweetest: WT('sweetest'), cows: WT('cows'), river: WT('river') - 0.24,
  thats: WT("that's"), when: WT('when'), comment: WT('comment') };
const glow = (c, o = 0.5) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, depthWrite: false, blending: THREE.AdditiveBlending });
const noOut = (m) => { m.userData.noOutline = true; m.castShadow = false; return m; };
// a pair of cartoon eyes (the plants can look, blink and close their eyes)
function eyesOn(parent, x, y, z, k = 1) {
  const g = new THREE.Group(); g.position.set(x, y, z); g.scale.setScalar(k); parent.add(g);
  const E2 = [-0.22, 0.22].map((ex) => { const e = new THREE.Group(); e.position.x = ex; g.add(e); mesh(new THREE.SphereGeometry(0.17, 12, 8), mat(0xffffff), 0, 0, 0, e); const p = mesh(new THREE.SphereGeometry(0.085, 10, 6), mat(0x1d1a24), 0, 0, 0.12, e); return { e, p }; });
  const lids = [-0.22, 0.22].map((ex) => noOut(mesh(new THREE.BoxGeometry(0.36, 0.05, 0.05), mat(0x1d1a24), ex, 0, 0.17, g)));
  return { g, set(open, look = 0) { E2.forEach(({ e, p }) => { e.scale.y = Math.max(0.08, open); p.position.x = look * 0.05; }); lids.forEach((l) => (l.visible = open < 0.3)); } };
}

// ---------------- the garden
mesh(new THREE.CylinderGeometry(9, 9, 0.08, 28), mat(0x8ad84a), 0, 0.04, 0, scene).castShadow = false;
for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2, r = 10 + R() * 3; if (Math.sin(a) > 0.55) continue; (i % 3 ? roundTree : palm)(scene, Math.cos(a) * r, Math.sin(a) * r - 1, R, 1 + R() * 0.3); }
for (let i = 0; i < 60; i++) { const a = R() * Math.PI * 2, r = 1.5 + R() * 7; noOut(mesh(new THREE.IcosahedronGeometry(0.1 + R() * 0.08, 0), mat([0xe8462c, 0xffd23a, 0xffffff, 0xf5a6c0, 0xb07ad8][i % 5]), Math.cos(a) * r, 0.12, Math.sin(a) * r, scene)); }
const river = noOut(mesh(new THREE.PlaneGeometry(60, 5, 60, 5).rotateX(-Math.PI / 2), mat(0x3f9fd8, { r: 0.3 }), 0, 0.09, -8.5, scene)); const rbase = river.geometry.attributes.position.array.slice();
// the rose bush
const rose = new THREE.Group(); rose.position.set(-2.4, 0, 0.4); scene.add(rose);
for (let i = 0; i < 6; i++) mesh(new THREE.IcosahedronGeometry(0.42 + R() * 0.15, 0), mat(0x3f9a3a), (R() - 0.5) * 0.9, 0.4 + R() * 0.5, (R() - 0.5) * 0.5, rose);
for (let i = 0; i < 9; i++) mesh(new THREE.DodecahedronGeometry(0.13, 0), mat(0xe0213a), (R() - 0.5) * 1.1, 0.5 + R() * 0.6, 0.25 + R() * 0.2, rose);
const roseEyes = eyesOn(rose, 0, 0.75, 0.48, 0.8);
// the mango tree
const mango = new THREE.Group(); mango.position.set(-0.6, 0, -3.0); scene.add(mango);
mesh(new THREE.CylinderGeometry(0.28, 0.4, 2.4, 7), mat(0x8a5a2a), 0, 1.2, 0, mango);
for (let i = 0; i < 5; i++) mesh(new THREE.IcosahedronGeometry(1.1 + R() * 0.3, 0), mat([0x3fa83a, 0x4fb83a, 0x2f8f3a][i % 3]), (R() - 0.5) * 1.6, 3.0 + R() * 0.8, (R() - 0.5) * 0.8, mango);
for (let i = 0; i < 10; i++) mesh(new THREE.SphereGeometry(0.13, 8, 6).scale(0.8, 1.1, 0.8), mat(i % 2 ? 0xffb02a : 0xf6d23a), (R() - 0.5) * 2.2, 2.5 + R() * 1.0, 0.7 + R() * 0.3, mango);
const mangoEyes = eyesOn(mango, 0, 3.2, 1.25, 1.1);
// the bamboo grove, and the one bamboo
const bambooMat = mat(0x8ac43a), nodeMat = mat(0x5a8a2a);
function bamboo(parent, x, z, h) { const g = new THREE.Group(); g.position.set(x, 0, z); parent.add(g); const n = Math.round(h / 0.6); for (let i = 0; i < n; i++) { mesh(new THREE.CylinderGeometry(0.1, 0.11, 0.58, 8), bambooMat, 0, 0.3 + i * 0.6, 0, g); mesh(new THREE.CylinderGeometry(0.125, 0.125, 0.05, 8), nodeMat, 0, 0.6 + i * 0.6, 0, g); } for (let i = 0; i < 4; i++) { const l = mesh(new THREE.ConeGeometry(0.08, 0.7, 4), mat(0x5ab83a), 0, h - 0.2 - i * 0.5, 0, g); l.rotation.z = (i % 2 ? 1 : -1) * 1.0; l.position.x = (i % 2 ? 0.3 : -0.3); } return g; }
[[2.6, -2.0, 4.2], [3.3, -1.3, 3.8], [3.0, -2.8, 4.6], [2.1, -3.0, 4.0], [3.9, -2.4, 4.4]].forEach(([x, z, h]) => bamboo(scene, x, z, h));
const B = bamboo(scene, 1.8, -1.1, 4.2); const bEyes = eyesOn(B, 0, 2.2, 0.12, 0.7);
// the flute it becomes
const flute = new THREE.Group(); scene.add(flute);
mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.95, 10).rotateZ(Math.PI / 2), mat(0xc9a227, { r: 0.4 }), 0, 0, 0, flute);
for (const x of [-0.46, 0.46]) mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.04, 10).rotateZ(Math.PI / 2), mat(0xe8462c), x, 0, 0, flute);
const holes = []; for (let i = 0; i < 6; i++) holes.push(noOut(mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.02, 8).rotateX(Math.PI / 2), mat(0x1d1a24), -0.05 + i * 0.07, 0, 0.032, flute)));
noOut(mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.02, 8).rotateX(Math.PI / 2), mat(0x1d1a24), -0.36, 0, 0.032, flute));
const fGlow = noOut(mesh(new THREE.SphereGeometry(0.6, 16, 12).scale(1.2, 0.5, 0.5), glow(0xffd06a, 0), 0, 0, 0, flute));
// music notes
const notes = []; for (let i = 0; i < 16; i++) { const n = new THREE.Group(); scene.add(n); const m = glow(i % 2 ? 0xffd23a : 0xffffff, 0.95); noOut(mesh(new THREE.SphereGeometry(0.07, 8, 6).scale(1.2, 0.9, 0.5), m, 0, 0, 0, n)); noOut(mesh(new THREE.BoxGeometry(0.018, 0.24, 0.018), m, 0.07, 0.12, 0, n)); if (i % 3 === 0) noOut(mesh(new THREE.BoxGeometry(0.1, 0.03, 0.018), m, 0.11, 0.23, 0, n)); notes.push(n); }
// lotus flowers drifting on the river (they slow down when the river listens)
const lotus = []; for (let i = 0; i < 9; i++) { const g = new THREE.Group(); scene.add(g); mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.03, 10), mat(0x3f9a3a), 0, 0, 0, g); for (let p = 0; p < 6; p++) { const a = p / 6 * Math.PI * 2; const pe = mesh(new THREE.ConeGeometry(0.07, 0.24, 4), mat(0xf5a6c0), Math.cos(a) * 0.08, 0.12, Math.sin(a) * 0.08, g); pe.rotation.set(Math.sin(a) * 0.5, 0, -Math.cos(a) * 0.5); } lotus.push({ g, x0: -15 + i * 3.4, z: -8.5 + ((i * 7) % 5 - 2) * 0.6 }); }
// cows that come running
const cows = [cow(scene, -5.5, 7, 0.8, R), cow(scene, 5.5, 7, -0.8, R), cow(scene, -4.5, 9.5, 1.4, R)];
const cowFrom = cows.map((c) => c.position.clone()), cowTo = [V(-1.7, 0, 2.4), V(2.1, 0, 2.2), V(-2.9, 0, 1.2)];
// ---------------- the cast
const C = makeCast(scene, [['k', 'krishna']]);
addOutlines(scene);
const confetti = makeConfetti(scene, 50, 26);
const K = V(0.9, 0, -0.35);

function update(s, t) {
  const playing = s >= E.put + 0.3;
  const dusk = sm(seg(s, E.put, E.sweetest + 1));
  S.mood(0); S.paintSky(new THREE.Color(0x4a8fe0).lerp(new THREE.Color(0xf08a4a), dusk * 0.65), new THREE.Color(0xcfe9ff).lerp(new THREE.Color(0xffd08a), dusk));
  S.sun.color.set(new THREE.Color(0xfff1d6).lerp(new THREE.Color(0xffb36a), dusk));
  // Krishna walks through the garden and stops at the bamboo
  const w = sm(seg(s, E.as - 0.3, E.but + 0.5)), path = [V(-4.6, 0, 2.6), V(-1.6, 0, 1.4), V(-0.4, 0, 0.2), K];
  const u = w * 3, i0 = Math.min(2, Math.floor(u)), kp = path[i0].clone().lerp(path[i0 + 1], u - i0);
  const holding = s >= E.hollowed + 1.4 && !playing;
  pose(C.k, camera, { x: kp.x, z: kp.z, h: 1.75, step: w > 0 && w < 1 ? s * 3 : 0, flute: playing, nofeather: false,
    mood: playing ? 'closed' : s >= E.yes - 0.2 && s < E.so ? 'happy' : s >= E.will && s < E.then ? 'normal' : 'happy', arm: s >= E.will && s < E.trembled ? 'offer' : holding ? 'offer' : 'down', flip: false });
  // the plants want to be chosen: they bounce and look at him; then close their eyes to the music
  const want = s >= E.every - 0.2 && s < E.but + 0.6, roseHop = s >= E.rose && s < E.mango ? Math.abs(Math.sin(t * 9)) : want ? Math.abs(Math.sin(t * 6)) * 0.4 : 0;
  rose.scale.set(1, 1 + roseHop * 0.12, 1); rose.position.y = roseHop * 0.08;
  const mangoHop = s >= E.mango && s < E.but ? Math.abs(Math.sin(t * 8)) : want ? Math.abs(Math.sin(t * 6 + 1)) * 0.4 : 0; mango.rotation.z = Math.sin(t * 8) * 0.03 * mangoHop;
  const blink = (ph) => (((t + ph) % 3.1) < 0.12 ? 0.1 : 1);
  roseEyes.set(playing ? 0.1 : blink(0.4), 0.6); mangoEyes.set(playing ? 0.1 : blink(1.3), 0.4);
  // the bamboo trembles, whispers yes, is cut, hollowed and pierced
  const tremble = s >= E.trembled && s < E.then ? Math.sin(t * 40) * 0.025 : 0, fall = sm(seg(s, E.so + 0.5, E.hollowed - 0.1));
  B.rotation.z = tremble - fall * 1.45; B.visible = s < E.hollowed + 0.3; B.scale.setScalar(1 - sm(seg(s, E.hollowed - 0.1, E.hollowed + 0.3)));
  bEyes.set(s >= E.then && s < E.hollowed ? 0.1 : s >= E.trembled ? 1.25 : blink(2.1), s >= E.will && s < E.then ? -1 : 0); B.position.y = s >= E.yes && s < E.so ? Math.abs(Math.sin(t * 7)) * 0.05 : 0;
  const form = sm(seg(s, E.hollowed - 0.1, E.hollowed + 0.7));
  flute.visible = form > 0.01 && !playing;
  if (holding) { const right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0); right.y = 0; right.normalize(); flute.position.copy(K).add(right.multiplyScalar(0.4)).add(V(0, 0.95, 0.1)); flute.rotation.set(0, 0, 0.9); flute.scale.setScalar(1); }
  else { flute.position.set(1.6, 1.12 + Math.sin(t * 2) * 0.03, 0.45); flute.rotation.set(0.15, Math.sin(t * 0.8) * 0.4, 0.05); flute.scale.setScalar(form); }
  holes.forEach((h, i) => (h.visible = s >= E.pierced + i * 0.12));
  fGlow.material.opacity = form * 0.18 * (1 + 0.2 * Math.sin(t * 3));
  // the music: notes rise from his flute; cows come running; the river slows to listen
  notes.forEach((n, i) => { const ph = (t * 0.45 + i / notes.length) % 1; n.visible = playing; n.position.set(K.x + 0.55 + Math.sin(ph * 6 + i) * 0.5 + ph * (i % 2 ? 1.2 : -0.6), 1.55 + ph * 2.2, K.z + 0.2 + Math.cos(i) * 0.3); n.scale.setScalar(Math.sin(ph * Math.PI) * 1.1); n.quaternion.copy(camera.quaternion); });
  const run = sm(seg(s, E.cows - 0.2, E.cows + 1.4));
  cows.forEach((c, i) => { const p = cowFrom[i].clone().lerp(cowTo[i], run); c.position.copy(p); c.rotation.y = Math.atan2(K.x - p.x, K.z - p.z) - Math.PI / 2; c.position.y = run > 0 && run < 1 ? Math.abs(Math.sin(t * 12 + i)) * 0.08 : 0; c.children[1].rotation.z = run >= 1 ? 0.25 : 0; });
  const flow = lerp(2.2, 0.25, sm(seg(s, E.river, E.river + 1.6))); const rp = river.geometry.attributes.position;
  for (let i = 0; i < rp.count; i++) rp.setY(i, Math.sin(rbase[i * 3] * 0.9 + t * flow * 2) * 0.06 + Math.cos(rbase[i * 3 + 2] * 1.2 - t * flow) * 0.04); rp.needsUpdate = true;
  const rr = E.river, drift = s < rr ? s * 1.1 : rr * 1.1 + (s - rr) * 0.15 + 0.95 * (1 - Math.exp(-(s - rr) * 1.1));
  lotus.forEach((l, i) => { l.g.position.set(((l.x0 + drift + 15) % 30 + 30) % 30 - 15, 0.14 + Math.sin(t * 2 + i) * 0.02, l.z); l.g.rotation.y = drift * 0.3 + i; });
  S.clouds.forEach((c, i) => { c.position.x = -80 + i * 15 + ((t * 0.6 + i * 3) % 12); });
}

const G = (t) => t, HOOK = (t) => E.pierced + 1.0 + t * 0.1, PLAY = (t) => E.sweetest + 1 + t * 0.2;
const SHOTS = [
  [0, E.of - 0.05, HOOK, [[1.75, 1.3, 1.5], [1.4, 1.2, 0.45]], [[1.7, 1.28, 1.25], [1.4, 1.2, 0.45]]],
  [E.of - 0.05, E.as - 0.05, PLAY, [[1.0, 1.7, 3.2], [0.9, 1.5, -0.3]], [[1.0, 1.75, 2.7], [0.9, 1.6, -0.3]]],
  [E.as - 0.05, E.every - 0.05, G, [[0, 6.5, 14], [0, 1.2, -1]], [[-1, 4.0, 10], [-1, 1.2, 0]]],
  [E.every - 0.05, E.rose - 0.05, G, [[-1.0, 2.0, 6.6], [-1.0, 1.2, 0]], [[-1.2, 1.9, 6.0], [-1.0, 1.2, 0]]],
  [E.rose - 0.05, E.mango - 0.05, G, [[-2.3, 1.0, 2.6], [-2.4, 0.75, 0.4]], [[-2.3, 1.0, 2.35], [-2.4, 0.75, 0.4]]],
  [E.mango - 0.05, E.but - 0.05, G, [[-0.5, 2.2, 2.6], [-0.6, 3.0, -3]], [[-0.5, 2.0, 2.2], [-0.6, 3.0, -3]]],
  [E.but - 0.05, E.will - 0.05, G, [[0.2, 1.6, 4.4], [1.2, 1.6, -0.8]], [[0.4, 1.6, 4.0], [1.2, 1.6, -0.8]]],
  [E.will - 0.05, E.trembled - 0.05, G, [[0.6, 1.55, 1.6], [0.9, 1.45, -0.35]], [[0.62, 1.55, 1.4], [0.9, 1.45, -0.35]]],
  [E.trembled - 0.05, E.so - 0.05, G, [[1.75, 2.2, 0.6], [1.8, 2.2, -1.1]], [[1.75, 2.2, 0.4], [1.8, 2.2, -1.1]]],
  [E.so - 0.05, E.hollowed - 0.05, G, [[-0.6, 2.2, 5.6], [1.6, 1.5, -1]], [[-0.4, 2.1, 5.0], [1.6, 1.4, -1]]],
  [E.hollowed - 0.05, E.wait - 0.05, G, [[1.75, 1.3, 1.5], [1.4, 1.2, 0.45]], [[1.7, 1.28, 1.25], [1.4, 1.2, 0.45]]],
  [E.wait - 0.05, E.because - 0.05, G, [[1.2, 1.6, 2.2], [0.95, 1.45, -0.35]], [[1.15, 1.6, 2.0], [0.95, 1.45, -0.35]]],
  [E.because - 0.05, E.sweetest - 0.05, G, [[1.0, 1.65, 1.6], [0.9, 1.55, -0.35]], [[1.0, 1.65, 1.35], [0.9, 1.55, -0.35]]],
  [E.sweetest - 0.05, E.cows - 0.05, G, [[0.6, 2.6, 6.5], [0.9, 1.8, -0.5]], [[0.7, 2.3, 5.5], [0.9, 1.8, -0.5]]],
  [E.cows - 0.05, E.river - 0.05, G, [[0, 4.2, 13.5], [0, 0.6, 2]], [[0, 3.8, 12.5], [0, 0.6, 2]]],
  [E.river - 0.05, E.thats - 0.05, G, [[2.5, 1.2, -4.8], [0, 0.1, -8.5]], [[2.2, 1.0, -5.0], [-0.5, 0.1, -8.5]]],
  [E.thats - 0.05, E.when - 0.05, HOOK, [[1.75, 1.3, 1.5], [1.4, 1.2, 0.45]], [[1.7, 1.28, 1.25], [1.4, 1.2, 0.45]]],
  [E.when - 0.05, E.comment - 0.05, G, [[1.6, 1.7, 3.0], [0.9, 1.6, -0.35]], [[1.3, 1.7, 2.2], [0.9, 1.6, -0.35]]],
  [E.comment - 0.05, DURATION + 0.1, G, [[0, 3.0, 9.5], [0.4, 1.4, -0.5]], [[0, 2.8, 8.6], [0.4, 1.4, -0.5]]],
];
direct({ stage, WORDS, DURATION, shots: SHOTS, update, title: E.of - 0.05, q: [E.wait, E.because], cta: E.comment,
  key: ['krishna', "krishna's", 'flute', 'hollow', 'empty', 'bamboo', 'story', 'garden', 'chosen', 'rose', 'mango', 'life', 'trembled', 'yes', 'cut', 'heart', 'holes', 'wait', 'lips', 'sweetest', 'music', 'cows', 'river', 'listen', 'pride', 'comment', 'muralidhar'],
  loc: (t) => (t >= E.as - 0.05 && t < E.every - 0.05 ? '📍 VRINDAVAN · LONG AGO' : ''), shakes: [], tick: () => {} });
