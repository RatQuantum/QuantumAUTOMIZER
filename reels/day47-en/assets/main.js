// Day 47 · "Why do we offer God a lotus?" · Why we do what we do #29 (as the story goes: Gajendra Moksha)
// Strategy 8 hook/tracker/pinned CTA + Strategy 9 camera moves.
// Sets: the lake (origin), a Vishnu altar today (x = 40).
import * as THREE from './three.module.js';
import { rng, mat, mesh, sm, seg, lerp, clamp, setupScene, makeCast, pose, lamp, roundTree } from './kit.js';
import { makeStage, direct, wordTime } from './director.js';
import { addOutlines, makeConfetti } from './plus.js';
import { WORDS, DURATION } from './data.js';

const stage = makeStage(), { scene, camera } = stage, V = (x, y, z) => new THREE.Vector3(x, y, z), R = rng(47);
const S = setupScene(scene, [[0, -2], [40, 0]], 47);
const WT = wordTime(WORDS);
const E = { as: WT('as'), gaj: WT('gajendra'), family: WT('family'), croc: WT('crocodile'), pulled: WT('pulled'), thousand: WT('thousand'), family2: WT('family', 2), left: WT('left'), strength: WT('strength'),
  wait: WT('wait'), plucked: WT('plucked'), raised: WT('raised'), called: WT('called'), vishnu: WT('vishnu'), garuda: WT('garuda'), forgot: WT('forgot'), spin: WT('spin'), free: WT('free'),
  thats: WT("that's"), everyone: WT('everyone'), comment: WT('comment') };
const glow = (c, o = 0.5) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, depthWrite: false, blending: THREE.AdditiveBlending });
const noOut = (m) => { m.userData.noOutline = true; m.castShadow = false; return m; };

function elephant(parent, k = 1) {
  const g = new THREE.Group(); parent.add(g); g.scale.setScalar(k); const gr = mat(0x8c8c9a);
  mesh(new THREE.BoxGeometry(2.0, 1.2, 1.1), gr, 0, 1.6, 0, g); mesh(new THREE.BoxGeometry(0.8, 0.85, 0.85), gr, -1.25, 1.9, 0, g);
  for (const z of [-0.5, 0.5]) { const ear = mesh(new THREE.BoxGeometry(0.1, 0.8, 0.6), mat(0x9a9aaa), -1.0, 1.95, z, g); ear.rotation.y = z * 0.6; }
  for (const [x, z] of [[-0.7, -0.35], [-0.7, 0.35], [0.7, -0.35], [0.7, 0.35]]) mesh(new THREE.CylinderGeometry(0.2, 0.22, 1.1, 8), gr, x, 0.55, z, g);
  const trunk = new THREE.Group(); trunk.position.set(-1.6, 1.8, 0); g.add(trunk); mesh(new THREE.CylinderGeometry(0.12, 0.17, 1.1, 8).translate(0, -0.55, 0), gr, 0, 0, 0, trunk);
  for (const z of [-0.22, 0.22]) noOut(mesh(new THREE.ConeGeometry(0.06, 0.4, 6).rotateZ(Math.PI / 2 + 0.5), mat(0xfaf5ea), -1.7, 1.55, z, g));
  for (const z of [-0.43, 0.43]) noOut(mesh(new THREE.SphereGeometry(0.06, 6, 4), mat(0x1d1a24), -1.5, 2.05, z, g));
  return { g, trunk };
}
function lotus(parent, k = 1) {
  const g = new THREE.Group(); parent.add(g); g.scale.setScalar(k);
  for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2, p = noOut(mesh(new THREE.SphereGeometry(0.12, 6, 4).scale(0.6, 1.4, 0.35).translate(0, 0.14, 0), mat(i % 2 ? 0xf27aa8 : 0xfaa0c4), 0, 0, 0, g)); p.rotation.set(0.5 * Math.cos(a), a, 0.5 * Math.sin(a)); }
  noOut(mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.05, 8), mat(0xffd23a), 0, 0.08, 0, g)); return g;
}

// ---------------- the lake (origin)
mesh(new THREE.CylinderGeometry(22, 22, 0.06, 32), mat(0x7ac84a), 0, 0.0, -2, scene).castShadow = false;
const lake = noOut(mesh(new THREE.CircleGeometry(7, 40, 0).rotateX(-Math.PI / 2), mat(0x3f7fc8, { r: 0.15, m: 0.2 }), 1, 0.06, 0.5, scene));
const lakeSeg = new THREE.PlaneGeometry(14, 14, 28, 28).rotateX(-Math.PI / 2); const water = noOut(mesh(lakeSeg, new THREE.MeshStandardMaterial({ color: 0x4f8fd8, transparent: true, opacity: 0.55, flatShading: true, roughness: 0.2 }), 1, 0.35, 0.5, scene)); const wb = lakeSeg.attributes.position.array.slice();
for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2 + 0.3; const L = lotus(scene, 1.3); L.position.set(1 + Math.cos(a) * (4 + (i % 2)), 0.36, 0.5 + Math.sin(a) * (4 + (i % 2))); noOut(mesh(new THREE.CircleGeometry(0.35, 10).rotateX(-Math.PI / 2), mat(0x3f9a3a), L.position.x + 0.3, 0.37, L.position.z + 0.2, scene)); }
for (let i = 0; i < 9; i++) { const a = Math.PI * (1.08 + i / 8 * 0.84); roundTree(scene, 1 + Math.cos(a) * 12, -1 + Math.sin(a) * 8, R, 1.3); }
const GJ = elephant(scene, 1.2);
const fam = [0, 1, 2].map(() => elephant(scene, 0.62));
// the crocodile (faces -x) with its jaw on Gajendra's back leg
const CR = new THREE.Group(); scene.add(CR); CR.scale.setScalar(1.3); const cg = mat(0x3f6a2a);
mesh(new THREE.BoxGeometry(2.4, 0.4, 0.7), cg, 0.6, 0, 0, CR); mesh(new THREE.BoxGeometry(1.0, 0.18, 0.45), cg, -1.0, 0.05, 0, CR); const jaw = mesh(new THREE.BoxGeometry(1.0, 0.12, 0.42).translate(-0.5, 0, 0), cg, -0.5, -0.12, 0, CR);
mesh(new THREE.BoxGeometry(1.6, 0.2, 0.3), cg, 2.4, -0.02, 0, CR); for (const z of [-0.18, 0.18]) noOut(mesh(new THREE.SphereGeometry(0.09, 8, 6), mat(0xffd23a), -0.3, 0.24, z, CR));
for (let i = 0; i < 6; i++) noOut(mesh(new THREE.ConeGeometry(0.07, 0.2, 4), cg, 0 + i * 0.4, 0.28, 0, CR));
const flowerL = lotus(scene, 1.4);
// Garuda and Vishnu, the chakra
const GA = new THREE.Group(); scene.add(GA); const gred = mat(0xd8402a), ggold = mat(0xffc23a, { m: 0.4, r: 0.4 });
mesh(new THREE.SphereGeometry(0.6, 12, 8).scale(1.4, 0.8, 0.8), gred, 0, 0, 0, GA); mesh(new THREE.SphereGeometry(0.32, 10, 8), mat(0xe0a57c), -0.95, 0.45, 0, GA); noOut(mesh(new THREE.ConeGeometry(0.1, 0.4, 6).rotateZ(Math.PI / 2), ggold, -1.35, 0.4, 0, GA));
const wings = [-1, 1].map((sd) => { const w = new THREE.Group(); w.position.set(0, 0.2, sd * 0.4); GA.add(w); for (let i = 0; i < 3; i++) mesh(new THREE.BoxGeometry(0.9 - i * 0.2, 0.06, 1.0 + i * 0.25), i % 2 ? ggold : gred, 0.2 + i * 0.15, 0, sd * (0.5 + i * 0.7), w); return { w, sd }; });
mesh(new THREE.ConeGeometry(0.4, 1.0, 6).rotateZ(-Math.PI / 2), ggold, 1.2, 0, 0, GA);
const chakra = new THREE.Group(); scene.add(chakra); noOut(mesh(new THREE.TorusGeometry(0.3, 0.05, 6, 24), mat(0xffd23a, { e: 0xffa020, ei: 0.8 }), 0, 0, 0, chakra));
for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; noOut(mesh(new THREE.ConeGeometry(0.05, 0.16, 4).rotateZ(-Math.PI / 2 + a), mat(0xffd23a, { e: 0xffa020, ei: 0.8 }), Math.cos(a) * 0.38, Math.sin(a) * 0.38, 0, chakra)); }
const chakraGlow = noOut(mesh(new THREE.RingGeometry(0.42, 0.62, 24), glow(0xfff0a0, 0.45), 0, 0, 0, scene));
const flash = noOut(mesh(new THREE.SphereGeometry(1, 16, 10), glow(0xfff0c0, 0), 0, 0, 0, scene));
const splash = []; for (let i = 0; i < 14; i++) splash.push(noOut(mesh(new THREE.SphereGeometry(0.08, 6, 4), mat(0xcfe8ff), 0, 0, 0, scene)));
// ---------------- the altar today (x = 40)
const T = new THREE.Group(); T.position.set(40, 0, 0); scene.add(T);
mesh(new THREE.BoxGeometry(12, 0.1, 9), mat(0xf3e6c8), 0, 0.05, 0, T).castShadow = false; mesh(new THREE.BoxGeometry(12, 8, 0.3), mat(0x4a7ac8), 0, 4, -3, T);
mesh(new THREE.BoxGeometry(3.4, 1.0, 1.4), mat(0x8a4b20), 0, 0.5, -2.2, T); mesh(new THREE.BoxGeometry(3.5, 0.08, 1.5), mat(0xffd23a), 0, 1.02, -2.2, T);
for (let i = 0; i < 26; i++) { const a = i / 25 * Math.PI; noOut(mesh(new THREE.SphereGeometry(0.11, 6, 4), mat([0xf27aa8, 0xffffff, 0xffd23a][i % 3]), Math.cos(a) * 1.5, 2.0 + Math.sin(a) * 1.7, -2.6, T)); }
const tl = [lamp(T, -1.5, 1.06, -1.8, 0.6), lamp(T, 1.5, 1.06, -1.8, 0.6)];
const altarLotus = [-0.7, 0.7].map((x) => { const L = lotus(T, 1.6); L.position.set(x, 1.06, -1.7); return L; });
const offerLotus = lotus(scene, 1.4);
// ---------------- the cast
const C = makeCast(scene, [['vi', 'krishna'], ['av', 'krishna'], ['d1', 'devotee'], ['d2', 'gopi2'], ['d3', 'kid2']]);
C.vi.spec = Object.assign({}, C.vi.spec, { top: undefined });
addOutlines(scene);
const confetti = makeConfetti(scene, 50, 47);
const tip = new THREE.Vector3();

function update(s, t) {
  const cx = camera.position.x, set = cx > 20 ? 40 : 0, hook = s < E.as;
  // a thousand years pass: the sky flickers day-night
  const years = seg(s, E.thousand, E.family2), flick = years > 0 && years < 1 ? 0.5 + 0.5 * Math.sin(years * Math.PI * 8 - Math.PI / 2) : 0;
  const dim = set === 0 ? (hook ? 0.45 : Math.max(flick * 0.8, 0.45 * sm(seg(s, E.left, E.strength + 0.6)) * (1 - sm(seg(s, E.vishnu, E.garuda))))) : 0;
  S.mood(dim); S.hemi.intensity = 1.35 - dim * 0.6; S.sun.target.position.set(set, 0, 0); S.sun.position.set(set - 8, 14, 10); S.sun.target.updateMatrixWorld();
  const wp = water.geometry.attributes.position; for (let i = 0; i < wp.count; i++) wp.setY(i, Math.sin(wb[i * 3] * 1.3 + t * 1.2) * 0.03 + Math.cos(wb[i * 3 + 2] * 1.1 + t) * 0.03); wp.needsUpdate = true;
  // --- Gajendra: drinks, is grabbed, the tug, sinks, raises a lotus, is freed
  const grabbed = (s >= E.croc && s < E.free) || hook, freed = sm(seg(s, E.free, E.free + 0.8));
  const tug = grabbed && !hook ? Math.sin(t * 3.2) * 0.25 * (1 - sm(seg(s, E.left, E.strength))) : 0;
  const sink = hook ? 0.5 : sm(seg(s, E.pulled, E.strength + 0.4)) * 0.5 * (1 - freed);
  GJ.g.position.set(0.4 + tug, -0.35 - sink + freed * 0.15, 0); GJ.g.rotation.z = grabbed ? -0.05 - tug * 0.15 : 0;
  const drink = s >= E.gaj && s < E.croc ? 1 : 0, raise = hook ? 1 : sm(seg(s, E.raised, E.raised + 0.9)) * (1 - sm(seg(s, E.thats - 1.2, E.thats - 0.2)) * 0.4);
  const pluck = sm(seg(s, E.plucked, E.plucked + 0.5));
  GJ.trunk.rotation.z = drink ? -0.2 + Math.sin(t * 2) * 0.12 : lerp(lerp(-0.3, 0.5, pluck * (1 - raise)), -2.5, raise) + (grabbed ? Math.sin(t * 4) * 0.08 : 0);
  GJ.g.updateMatrixWorld(true); tip.set(0, -1.15, 0); GJ.trunk.localToWorld(tip);
  flowerL.visible = set === 0 && (hook || s >= E.plucked); flowerL.position.copy(tip); flowerL.rotation.set(0, t * 0.3, raise > 0.5 ? 0 : Math.PI * 0.3);
  // the crocodile clamps the back leg; vanishes at "free"
  const cIn = sm(seg(s, E.croc - 0.3, E.croc + 0.4));
  CR.visible = set === 0 && (hook || (s >= E.croc - 0.3 && s < E.free + 0.2)); CR.position.set(GJ.g.position.x + 0.84 * 1.2 + 0.75 + (hook ? 0 : (1 - cIn) * 2.5) + tug * 0.3, 0.5, 0.45); CR.rotation.y = 0.15; jaw.rotation.z = -0.12 + Math.sin(t * 6) * 0.05;
  splash.forEach((m, i) => { const u = (t * 1.6 + i / 14) % 1, a = i * 2.4; m.visible = set === 0 && ((s >= E.croc && s < E.croc + 0.9) || (s >= E.free && s < E.free + 0.9)); const c0 = s < E.free ? CR.position : V(2.4, 0.3, 0.45); m.position.set(c0.x - 0.6 + Math.cos(a) * u * 0.9, 0.4 + Math.sin(u * Math.PI) * 1.2, c0.z + Math.sin(a) * u * 0.9); });
  // the family: drinks beside him, pulls, gives up, walks away
  const away = sm(seg(s, E.left, E.left + 2.2));
  fam.forEach((f, i) => { f.g.visible = set === 0 && !hook && s < E.wait; const x0 = -4.6 - i * 1.4, z0 = 3.0 + i * 0.9; f.g.position.set(x0 - away * 3, 0.0, z0 + away * 4); f.g.rotation.y = away > 0 ? -Math.PI / 2 + 0.5 : 0.4; f.trunk.rotation.z = s >= E.family2 && s < E.left ? -0.9 + Math.sin(t * 5 + i) * 0.3 : -0.2; });
  // Vishnu on Garuda dives down from the sky
  const dive = hook ? 0 : sm(seg(s, E.vishnu - 0.3, E.forgot - 0.2)), gaVis = set === 0 && s >= E.vishnu - 0.3;
  const gp = V(-14, 12, -14).lerp(V(-3.4, 3.2, -1.6), dive); GA.visible = gaVis; GA.position.copy(gp); GA.rotation.set(0, lerp(-0.4, Math.PI / 2, dive), 0.2 * (1 - dive));
  wings.forEach(({ w, sd }) => (w.rotation.x = dive < 1 ? sd * Math.sin(t * 12) * 0.45 : -sd * (0.35 + Math.sin(t * 4) * 0.08)));
  pose(C.vi, camera, { visible: gaVis, x: gp.x, y: gp.y + 0.35, z: gp.z + 0.2, h: 1.55, mood: s >= E.free ? 'happy' : 'normal', arm: s >= E.spin && s < E.free ? 'point' : s >= E.free ? 'offer' : 'up', nofeather: true });
  const fl = seg(s, E.spin, E.free), cp = V(gp.x + 0.5, gp.y + 1.2, gp.z + 0.3).lerp(V(CR.position.x - 0.4, 0.7, 0.45), sm(fl));
  chakra.visible = chakraGlow.visible = set === 0 && s >= E.spin && s < E.free + 0.15; chakra.position.copy(cp); chakra.quaternion.copy(camera.quaternion); chakra.rotateZ(-t * 18); chakraGlow.position.copy(cp); chakraGlow.quaternion.copy(camera.quaternion);
  const fu = s - E.free; flash.visible = set === 0 && fu > 0 && fu < 0.6; flash.position.set(2.4, 0.7, 0.45); flash.scale.setScalar(0.6 + fu * 3); flash.material.opacity = 0.6 * (1 - fu / 0.6);
  // --- today: a lotus offered at the altar
  pose(C.av, camera, { visible: set === 40, x: 40, y: 1.06, z: -2.3, h: 1.6, mood: 'happy' });
  tl.forEach((l, i) => (l.flame.scale.y = 1 + 0.15 * Math.sin(t * 13 + i)));
  const give = sm(seg(s, E.thats + 0.3, E.everyone - 0.3));
  pose(C.d1, camera, { visible: set === 40, x: 40.9, z: lerp(1.2, -0.6, give), h: 1.65, mood: 'closed', arm: 'offer', flip: true });
  offerLotus.visible = set === 40; offerLotus.position.set(lerp(40.55, 40.45, give), lerp(1.4, 1.1, give), lerp(1.3, -1.55, give));
  pose(C.d2, camera, { visible: set === 40, x: 38.8, z: 0.8, h: 1.6, mood: s >= E.everyone ? 'happy' : 'closed', arm: s >= E.comment ? 'up' : 'down' });
  pose(C.d3, camera, { visible: set === 40, x: 39.6, z: 1.6, h: 1.1, mood: 'happy', arm: s >= E.comment ? 'up' : 'down' });
  confetti(E.comment, s, V(40, 3, -1));
  S.clouds.forEach((c, i) => { c.position.x = -80 + i * 15 + ((t * (years > 0 && years < 1 ? 8 : 0.6) + i * 3) % 12); });
}

const G = (t) => t;
const SHOTS = [
  [0, E.as - 0.05, G, [[-1.6, 2.4, 5.6], [-1.7, 2.5, 0]], [[-1.6, 2.4, 5.6], [-1.7, 2.5, 0]], [62, 34], { move: 'dolly' }],
  [E.as - 0.05, E.gaj - 0.05, G, [[1, 7, 17], [1, 0.4, 0]], [[1, 3.2, 10], [0.5, 1.2, 0]], 50, { move: 'pull' }],
  [E.gaj - 0.05, E.family - 0.05, G, [[-2.4, 1.6, 4.6], [-1.4, 1.2, 0]], [[-2.2, 1.5, 4.2], [-1.4, 1.1, 0]]],
  [E.family - 0.05, E.croc - 0.05, G, [[-3.2, 2.2, 9.5], [-4.8, 0.9, 2.6]], [[-2.8, 2.0, 9.0], [-4.6, 0.9, 2.6]]],
  [E.croc - 0.05, E.pulled - 0.05, G, [[2.6, 2.2, 6.8], [1.6, 0.8, 0.4]], [[2.5, 2.0, 6.2], [1.6, 0.8, 0.4]]],
  [E.pulled - 0.05, E.thousand - 0.05, G, [[0.6, 2.0, 9], [0.8, 1.2, 0]], [[0.6, 1.8, 7.6], [0.8, 1.2, 0]]],
  [E.thousand - 0.05, E.family2 - 0.05, G, [[1, 5, 13], [0.6, 0.6, 0]], [[1, 9, 15], [0.6, 0.6, 0]], 50, { move: 'crane', lift: 1.2 }],
  [E.family2 - 0.05, E.left - 0.05, G, [[-2.0, 2.0, 9.5], [-4.2, 1.0, 2.4]], [[-2.4, 2.0, 9.0], [-4.4, 1.0, 2.6]]],
  [E.left - 0.05, E.wait - 0.05, G, [[-1.2, 1.8, 6.4], [-1.0, 1.6, 0]], [[-1, 4.5, 13], [-2.5, 0.8, 2]], 50, { move: 'pull' }],
  [E.wait - 0.05, E.plucked - 0.05, G, [[-2.4, 2.1, 3.4], [-1.5, 1.95, 0]], [[-2.3, 2.1, 3.0], [-1.5, 1.95, 0]]],
  [E.plucked - 0.05, E.called - 0.05, G, [[-2.6, 1.4, 5.4], [-1.7, 1.6, 0]], [[-2.6, 2.4, 6.2], [-1.7, 2.8, 0]], 50, { move: 'crane', lift: 1.2 }],
  [E.called - 0.05, E.vishnu - 0.05, G, [[-0.4, 0.7, 6.4], [-2.0, 3.4, -1.5]], [[-0.4, 0.7, 6.0], [-2.0, 3.6, -1.5]]],
  [E.vishnu - 0.05, E.forgot - 0.05, G, [[1.6, 2.2, 10], [-7, 7, -7]], [[0.8, 2.2, 8.6], [-3.4, 3.6, -1.6]]],
  [E.forgot - 0.05, E.spin - 0.05, G, [[-3.1, 4.4, 1.6], [-3.4, 4.3, -1.5]], [[-3.1, 4.4, 1.3], [-3.4, 4.3, -1.5]]],
  [E.spin - 0.05, E.free - 0.05, G, [[0, 2.8, 10], [0, 1.6, -0.4]], [[0, 2.6, 9], [0.4, 1.2, 0]]],
  [E.free - 0.05, E.thats - 0.05, G, [[-0.4, 3.4, 11], [-2.2, 3.0, -0.8]], [[-0.6, 3.0, 9.0], [-2.2, 3.0, -0.8]], 50, { move: 'land' }],
  [E.thats - 0.05, E.everyone - 0.05, G, [[40, 3.0, 8.0], [40, 1.8, -2]], [[40, 2.4, 5.2], [40, 1.6, -1.2]], 50, { move: 'land' }],
  [E.everyone - 0.05, E.comment - 0.05, G, [[40, 2.0, 3.6], [40, 1.8, -2.3]], [[40, 2.0, 3.2], [40, 1.8, -2.3]]],
  [E.comment - 0.05, DURATION + 0.1, G, [[40, 2.4, 6.2], [40, 2.0, -2]], [[40, 2.4, 5.6], [40, 2.0, -2]]],
];
direct({ stage, WORDS, DURATION, shots: SHOTS, update, title: 1.6, q: [E.wait, E.plucked], cta: E.comment, prog: [E.wait, E.thats], pin: E.wait,
  key: ['elephant', 'dying', 'flower', 'gajendra', 'king', 'family', 'crocodile', 'pulled', 'thousand', 'gave', 'left', 'strength', 'wait', 'lotus', 'sky', 'narayana', 'breath', 'vishnu', 'garuda', 'crown', 'chakra', 'free', 'offer', 'everyone', 'comes', 'hari', 'comment'],
  loc: (t) => (t >= E.as - 0.05 && t < E.gaj + 1.0 ? '📍 THE LOTUS LAKE' : t >= E.thousand - 0.05 && t < E.family2 ? '⏳ A THOUSAND YEARS' : t >= E.thats - 0.05 && t < E.everyone ? 'EVEN TODAY' : ''), shakes: [E.croc, E.free], tick: () => {} });
