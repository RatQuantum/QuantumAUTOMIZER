// Day 54 · "Why is Krishna the ocean of compassion?" · Why we do what we do #36 (as the story goes: Gandhari's curse)
// Strategy 10: mid-action hook (the curse swirling, Krishna bowing) + lock-in, "But…" re-hook, "Wait…?" re-hook, loop to the hook.
// Sets: the field after the war (origin), golden Dwarka sinking (x = 40), a lamp for loved ones today (x = 80).
import * as THREE from './three.module.js';
import { rng, mat, mesh, sm, seg, lerp, clamp, setupScene, makeCast, pose, lamp } from './kit.js';
import { makeStage, direct, wordTime } from './director.js';
import { addOutlines, makeConfetti } from './plus.js';
import { WORDS, DURATION } from './data.js';

const stage = makeStage(), { scene, camera } = stage, V = (x, y, z) => new THREE.Vector3(x, y, z), R = rng(54);
const S = setupScene(scene, [[0, 0], [40, 0], [80, 0]], 54);
const WT = wordTime(WORDS);
const E = { stay: WT('stay'), as: WT('as'), gandhari: WT('gandhari'), blind: WT('blindfolded'), but: WT('but'), family: WT('family'), golden: WT('golden'), wait: WT('wait'), k2: WT('krishna', 2),
  bowed: WT('bowed'), thats: WT("that's"), pain: WT('pain'), comment: WT('comment') };
const glow = (c, o = 0.5) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, depthWrite: false, blending: THREE.AdditiveBlending });
const noOut = (m) => { m.userData.noOutline = true; m.castShadow = false; return m; };

// ---------------- the field after the war (origin): broken chariots, smoke, dusk
mesh(new THREE.CylinderGeometry(22, 22, 0.06, 28), mat(0x9a7a5a), 0, 0.03, 0, scene).castShadow = false;
for (const [x, z, r] of [[-4.5, -4, 0.4], [4.8, -5, -0.6], [-2.2, -8, 1.2]]) { const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.set(0, r, 0.2); scene.add(g); mesh(new THREE.BoxGeometry(1.8, 0.2, 1.2), mat(0x8a6a3a), 0, 0.5, 0, g); const w = mesh(new THREE.TorusGeometry(0.55, 0.06, 6, 18), mat(0x6a4a2a), -0.4, 0.3, 0.7, g); w.rotation.x = 1.2; }
for (let i = 0; i < 20; i++) { const a = Math.PI + R() * Math.PI, r = 2.5 + R() * 7; const ar = noOut(mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.8, 4), mat(0x5a4a3a), Math.cos(a) * r, 0.3, Math.sin(a) * r - 2, scene)); ar.rotation.set((R() - 0.5) * 0.9, 0, (R() - 0.5) * 0.9); }
const smoke = []; for (let i = 0; i < 14; i++) smoke.push({ m: noOut(mesh(new THREE.SphereGeometry(0.5, 8, 6), new THREE.MeshBasicMaterial({ color: 0x5a5a66, transparent: true, opacity: 0.3, depthWrite: false }), 0, 0, 0, scene)), ph: R(), x: [-4.5, 4.8, -2.2][i % 3], z: [-4, -5, -8][i % 3] });
// the curse: dark wisps spiralling from Gandhari toward Krishna
const wisps = []; for (let i = 0; i < 22; i++) wisps.push({ m: noOut(mesh(new THREE.SphereGeometry(0.055, 8, 6), glow(0x8a3aff, 0.4), 0, 0, 0, scene)), ph: i / 22 });
const bolt = noOut(mesh(new THREE.PlaneGeometry(40, 40), new THREE.MeshBasicMaterial({ color: 0xd8c8ff, transparent: true, opacity: 0, depthWrite: false, fog: false }), 0, 10, -20, scene));
const softGlow = noOut(mesh(new THREE.RingGeometry(0.46, 0.52, 32), glow(0xbfe0ff, 0), 0, 0, 0, scene));
// ---------------- golden Dwarka sinking (x = 40)
const sea = noOut(mesh(new THREE.PlaneGeometry(60, 40, 30, 20).rotateX(-Math.PI / 2), mat(0x2a5a9a, { r: 0.2, m: 0.2 }), 40, 0.6, 0, scene)); const sb = sea.geometry.attributes.position.array.slice();
const CITY = new THREE.Group(); CITY.position.set(40, 0, -4); scene.add(CITY); const gold = mat(0xffd23a, { m: 0.6, r: 0.35 });
for (let i = 0; i < 9; i++) { const x = -4 + i, h = 2 + (i % 3) * 1.2 + (i === 4 ? 1.6 : 0); mesh(new THREE.BoxGeometry(0.8, h, 0.8), mat(i % 2 ? 0xf3e2b8 : 0xe8c890), x, h / 2, (i % 2) * 0.8, CITY); mesh(new THREE.ConeGeometry(0.55, 0.9, 4), gold, x, h + 0.45, (i % 2) * 0.8, CITY); }
// ---------------- a lamp for loved ones today (x = 80)
const T = new THREE.Group(); T.position.set(80, 0, 0); scene.add(T);
mesh(new THREE.BoxGeometry(12, 0.1, 9), mat(0xf3e6c8), 0, 0.05, 0, T).castShadow = false; mesh(new THREE.BoxGeometry(12, 8, 0.3), mat(0x6a8ac8), 0, 4, -3, T);
mesh(new THREE.BoxGeometry(3.0, 1.0, 1.3), mat(0x8a4b20), 0, 0.5, -2.2, T); mesh(new THREE.BoxGeometry(3.1, 0.08, 1.4), mat(0xffd23a), 0, 1.02, -2.2, T);
for (let i = 0; i < 24; i++) { const a = i / 23 * Math.PI; noOut(mesh(new THREE.SphereGeometry(0.1, 6, 4), mat([0xffffff, 0xbfe0ff, 0xffd23a][i % 3]), Math.cos(a) * 1.3, 1.9 + Math.sin(a) * 1.5, -2.6, T)); }
const tl = [lamp(T, -1.2, 1.06, -1.8, 0.6), lamp(T, 1.2, 1.06, -1.8, 0.6), lamp(T, 0.35, 0.1, 0.9, 0.7)];
// ---------------- the cast
const C = makeCast(scene, [['ga', 'gandhari'], ['k', 'krishna'], ['m1', 'gopi2'], ['m2', 'devaki'], ['ak', 'krishna'], ['d1', 'gopi3'], ['d2', 'devotee']]);
C.m1.spec = Object.assign({}, C.m1.spec, { body: '#f4f1ea' }); C.m2.spec = Object.assign({}, C.m2.spec, { body: '#f4f1ea' });
addOutlines(scene);
const confetti = makeConfetti(scene, 50, 54);
const GP = V(-0.85, 0, 0.1);

function update(s, t) {
  const cx = camera.position.x, set = cx > 60 ? 80 : cx > 20 ? 40 : 0, hook = s < E.as, ending = s >= E.comment, loopK = hook || ending;
  const cursing = loopK || (s >= E.but && s < E.wait + 0.3), storm = cursing ? 1 : 0;
  const dark = set === 0 ? 0.45 + 0.25 * storm : set === 40 ? 0.55 : 0;
  S.mood(dark); S.hemi.intensity = 1.35 - dark * 0.5; S.sun.target.position.set(set, 0, 0); S.sun.position.set(set - 8, 12, 10); S.sun.target.updateMatrixWorld();
  if (set === 0) { S.paintSky(new THREE.Color(cursing ? 0x2a1a4a : 0x4a3a6a), new THREE.Color(cursing ? 0x6a4a8a : 0xd88a6a)); }
  const lt = (t * 0.7) % 2.3; bolt.visible = set !== 80 && cursing && lt < 0.12; bolt.material.opacity = 0.5 * (1 - lt / 0.12);
  smoke.forEach(({ m, ph, x, z }) => { const u = (t * 0.2 + ph) % 1; m.visible = set === 0; m.position.set(x + Math.sin(ph * 9) * 0.5, 0.6 + u * 4, z); m.scale.setScalar(0.6 + u * 1.6); m.material.opacity = 0.28 * (1 - u); });
  // --- Gandhari: grieving, accusing, cursing
  pose(C.ga, camera, { visible: set === 0, x: GP.x, z: GP.z, h: 1.68, mood: cursing ? 'sad' : 'sad', arm: cursing || (s >= E.blind + 0.6 && s < E.but) ? 'point' : 'down' });
  pose(C.m1, camera, { visible: set === 0 && !loopK && s < E.but, x: -2.4, z: -1.4, h: 1.58, sitting: true, mood: 'sad', arm: 'down' });
  pose(C.m2, camera, { visible: set === 0 && !loopK && s < E.but, x: -3.3, z: -1.0, h: 1.58, sitting: true, mood: 'sad', arm: 'down' });
  // --- Krishna arrives; bows with folded hands
  const kIn = sm(seg(s, E.blind - 0.3, E.blind + 1.0)), kx = loopK ? 0.85 : lerp(4.2, 0.85, kIn), bowing = loopK || s >= E.bowed;
  pose(C.k, camera, { visible: set === 0 && (loopK || s >= E.blind - 0.3), x: kx, z: 0.3, h: 1.74, mood: bowing ? 'closed' : s >= E.wait ? 'normal' : 'sad', arm: bowing ? 'fold' : 'down', namaste: bowing, flip: true, step: kIn > 0 && kIn < 1 ? s * 3 : 0 });
  if (bowing && set === 0) C.k.m.rotateZ(0.16);
  softGlow.visible = false; softGlow.position.set(kx - 0.1, 1.5, 0.25); softGlow.quaternion.copy(camera.quaternion); softGlow.material.opacity = 0.3 + 0.1 * Math.sin(t * 3);
  wisps.forEach(({ m, ph }) => { const u = (t * 0.45 + ph) % 1; m.visible = set === 0 && cursing; const a = u * Math.PI * 4 + ph * 6; m.position.set(lerp(GP.x + 0.3, kx - 0.2, u) + Math.cos(a) * 0.25, 0.75 + Math.sin(a) * 0.2 + Math.sin(u * Math.PI) * 0.35, 0.3 + Math.sin(a) * 0.2); m.scale.setScalar(1 - u * 0.5); });
  // --- Dwarka sinks
  const sink = sm(seg(s, E.golden - 0.2, E.wait)); CITY.position.y = -sink * 4.6; CITY.rotation.z = sink * 0.05;
  const sp = sea.geometry.attributes.position; for (let i = 0; i < sp.count; i++) sp.setY(i, Math.sin(sb[i * 3] * 0.8 + t * 1.6) * 0.12 + Math.cos(sb[i * 3 + 2] * 0.7 + t) * 0.1); sp.needsUpdate = true; sea.visible = CITY.visible = set === 40;
  // --- today: a lamp lit, Krishna with them
  pose(C.ak, camera, { visible: set === 80, x: 80, y: 1.06, z: -2.3, h: 1.55, mood: 'happy', flute: true });
  tl.forEach((l, i) => (l.flame.scale.y = 1 + 0.15 * Math.sin(t * 13 + i)));
  pose(C.d1, camera, { visible: set === 80, x: 79.3, z: 0.9, h: 1.6, sitting: true, mood: s >= E.pain + 0.4 ? 'happy' : 'sad', arm: 'fold', namaste: true });
  pose(C.d2, camera, { visible: set === 80, x: 81.0, z: 0.7, h: 1.65, mood: 'closed', arm: ending ? 'up' : 'down', flip: true });
  confetti(E.comment, s, V(0, 3, 0.4));
  S.clouds.forEach((c, i) => { c.position.x = -80 + i * 15 + ((t * (cursing ? 3 : 0.6) + i * 3) % 12); });
}

const G = (t) => t;
const HOOK = [[0.0, 1.45, 4.6], [0.0, 1.3, 0.2]];
const SHOTS = [
  [0, E.stay - 0.05, G, HOOK, HOOK, [62, 36], { move: 'dolly' }],
  [E.stay - 0.05, E.as - 0.05, G, [[1.0, 1.6, 2.7], [0.85, 1.42, 0.3]], [[1.0, 1.6, 2.4], [0.85, 1.42, 0.3]]],
  [E.as - 0.05, E.gandhari - 0.05, G, [[0, 6, 14], [0, 0.8, -3]], [[-0.4, 2.4, 7.6], [-0.8, 1.0, -0.5]], 50, { move: 'pull' }],
  [E.gandhari - 0.05, E.blind - 0.05, G, [[-0.85, 1.6, 2.8], [-0.85, 1.42, 0.1]], [[-0.85, 1.6, 2.5], [-0.85, 1.42, 0.1]]],
  [E.blind - 0.05, E.but - 0.05, G, [[1.4, 1.6, 5.2], [0.4, 1.2, 0.2]], [[0.6, 1.6, 5.0], [0.0, 1.2, 0.2]]],
  [E.but - 0.05, E.family - 0.05, G, [[-0.5, 0.9, 2.6], [-0.85, 1.6, 0.1]], [[-0.55, 0.9, 2.3], [-0.85, 1.6, 0.1]]],
  [E.family - 0.05, E.golden - 0.05, G, [[0, 1.4, 4.6], [0, 1.3, 0.2]], [[0.3, 3.0, 6.2], [0, 1.2, 0.2]], 50, { move: 'crane', lift: 1.0 }],
  [E.golden - 0.05, E.wait - 0.05, G, [[40, 3.6, 10], [40, 2.4, -4]], [[40, 2.4, 9], [40, 1.2, -4]]],
  [E.wait - 0.05, E.k2 - 0.05, G, [[0.95, 1.6, 2.6], [0.85, 1.42, 0.3]], [[0.95, 1.6, 2.3], [0.85, 1.42, 0.3]]],
  [E.k2 - 0.05, E.thats - 0.05, G, [[0.4, 1.5, 3.8], [0.4, 1.3, 0.2]], [[0.4, 1.5, 3.8], [0.4, 1.3, 0.2]], [62, 38], { move: 'dolly' }],
  [E.thats - 0.05, E.pain - 0.05, G, [[80, 3.0, 8.0], [80, 1.6, -1.8]], [[80, 2.2, 4.6], [80, 1.2, -0.8]], 50, { move: 'land' }],
  [E.pain - 0.05, E.comment - 0.05, G, [[79.9, 1.5, 4.4], [79.6, 1.1, 0.6]], [[79.9, 1.5, 4.0], [79.6, 1.1, 0.6]]],
  [E.comment - 0.05, DURATION + 0.1, G, [[0.2, 1.55, 5.4], [0.0, 1.3, 0.2]], HOOK],
];
direct({ stage, WORDS, DURATION, shots: SHOTS, update, title: 1.4, q: [E.wait, E.k2], cta: E.comment, prog: [E.but, E.thats], pin: E.wait,
  key: ['mother', 'cursed', 'god', 'folded', 'accept', 'answer', 'gandhari', 'hundred', 'blindfolded', 'broken', 'stopped', 'expected', 'family', 'fall', 'golden', 'sink', 'sea', 'wait', 'angry', 'bowed', 'ocean', 'compassion', 'pain', 'sits', 'comment', 'send'],
  loc: (t) => (t >= E.as - 0.05 && t < E.gandhari + 0.6 ? '📍 KURUKSHETRA · AFTER THE WAR' : t >= E.golden - 0.05 && t < E.wait ? '📍 DWARKA · YEARS LATER' : t >= E.thats - 0.05 && t < E.pain ? 'EVEN TODAY' : ''), shakes: [E.but + 0.2], tick: () => {} });
