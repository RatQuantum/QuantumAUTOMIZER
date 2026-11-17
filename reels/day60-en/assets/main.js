// Day 60 · "Why should anger never make your choices?" · Why we do what we do #42 (Ashwatthama's curse)
// KB brief: emotion = dread → awe · lever = fear · odd detail: the wound on his forehead still glows faintly, five thousand years later.
// Sets: the dark forest today/forever (origin, the hook), the Pandava camp at night (x = 40), a calm corner today (x = 80).
import * as THREE from './three.module.js';
import { rng, mat, mesh, sm, seg, lerp, clamp, setupScene, makeCast, pose, lamp, roundTree } from './kit.js';
import { makeStage, direct, wordTime } from './director.js';
import { addOutlines, makeConfetti } from './plus.js';
import { WORDS, DURATION } from './data.js';

const stage = makeStage(), { scene, camera } = stage, V = (x, y, z) => new THREE.Vector3(x, y, z), R = rng(60);
const S = setupScene(scene, [[0, 0], [40, 0], [80, 0]], 60);
const WT = wordTime(WORDS);
const E = { stay: WT('stay'), as: WT('as'), ashwa: WT('ashwatthama'), dead: WT('dead'), but: WT('but'), fired: WT('fired'), brahm: WT('brahmastra'), k2: WT('krishna', 2), saved: WT('saved'), turned: WT('turned'), wait: WT('wait'),
  took: WT('took'), wander: WT('wander'), some: WT('some'), thats: WT("that's"), anger2: WT('anger', 2), comment: WT('comment') };
const glow = (c, o = 0.5) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, depthWrite: false, blending: THREE.AdditiveBlending });
const noOut = (m) => { m.userData.noOutline = true; m.castShadow = false; return m; };
// ---------------- the dark forest (origin)
mesh(new THREE.CylinderGeometry(16, 16, 0.06, 28), mat(0x2a3a2a), 0, 0.03, 0, scene).castShadow = false;
for (let i = 0; i < 18; i++) { const a = R() * Math.PI * 2, r = 4.5 + R() * 8; roundTree(scene, Math.cos(a) * r, Math.sin(a) * r - 3, R, 1.3 + R() * 0.6); }
const fog = []; for (let i = 0; i < 10; i++) fog.push({ m: noOut(mesh(new THREE.SphereGeometry(1.4, 10, 8), new THREE.MeshBasicMaterial({ color: 0x8a9ab0, transparent: true, opacity: 0.12, depthWrite: false }), 0, 0, 0, scene)), ph: R() });
const woundGlow = noOut(mesh(new THREE.SphereGeometry(0.08, 10, 8), glow(0xff3a4a, 0.7), 0, 0, 0, scene));
// ---------------- the Pandava camp at night (x = 40)
mesh(new THREE.CylinderGeometry(16, 16, 0.06, 28), mat(0x6a5a40), 40, 0.03, 0, scene).castShadow = false;
for (let i = 0; i < 6; i++) { const x = 36 + (i % 3) * 3, z = -3 - Math.floor(i / 3) * 3; const tnt = mesh(new THREE.ConeGeometry(1.0, 1.6, 4), mat([0xe8d8b0, 0xd8c8a0][i % 2]), x, 0.8, z, scene); tnt.rotation.y = Math.PI / 4; }
const flames = []; for (let i = 0; i < 4; i++) flames.push(noOut(mesh(new THREE.ConeGeometry(0.4, 1.4, 7).translate(0, 0.7, 0), new THREE.MeshBasicMaterial({ color: i % 2 ? 0xff7a1a : 0xffc23a }), 36 + i * 2.2, 0.8, -5.5 - (i % 2), scene)));
const fireLight = new THREE.PointLight(0xff8a3a, 0, 14, 1.4); fireLight.position.set(39, 2, -4); scene.add(fireLight);
// the Brahmastra: a blade of grass that becomes a blazing weapon
const BW = new THREE.Group(); scene.add(BW); noOut(mesh(new THREE.ConeGeometry(0.06, 0.9, 6).rotateZ(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0xfff0a0 }), 0, 0, 0, BW)); const bwGlow = noOut(mesh(new THREE.SphereGeometry(0.35, 12, 8), glow(0xffb040, 0.6), 0, 0, 0, BW));
const trail = []; for (let i = 0; i < 12; i++) trail.push(noOut(mesh(new THREE.SphereGeometry(0.12 - i * 0.008, 8, 6), glow(0xffa030, 0.45 - i * 0.03), 0, 0, 0, scene)));
const shield = noOut(mesh(new THREE.SphereGeometry(0.5, 20, 14), glow(0x7fd0ff, 0), 0, 0, 0, scene));
const gem = noOut(mesh(new THREE.OctahedronGeometry(0.07), mat(0x7fe8ff, { m: 0.3, r: 0.1, e: 0x1a8aaa, ei: 1 }), 0, 0, 0, scene)), gemGlow = noOut(mesh(new THREE.SphereGeometry(0.18, 10, 8), glow(0x9ff0ff, 0.5), 0, 0, 0, scene));
const flash = noOut(mesh(new THREE.SphereGeometry(1, 16, 10), glow(0xfff0c0, 0), 0, 0, 0, scene));
// ---------------- a calm corner today (x = 80)
const T = new THREE.Group(); T.position.set(80, 0, 0); scene.add(T);
mesh(new THREE.BoxGeometry(12, 0.1, 9), mat(0xf3e6c8), 0, 0.05, 0, T).castShadow = false; mesh(new THREE.BoxGeometry(12, 8, 0.3), mat(0x9ab8d8), 0, 4, -3, T);
mesh(new THREE.BoxGeometry(2.0, 0.8, 0.9), mat(0x8a4b20), 0, 0.4, -2.3, T); mesh(new THREE.BoxGeometry(2.1, 0.08, 1.0), mat(0xffd23a), 0, 0.82, -2.3, T);
const tl = [lamp(T, -0.7, 0.86, -2.0, 0.5), lamp(T, 0.7, 0.86, -2.0, 0.5), lamp(T, -1.3, 0.1, 0.4, 0.7)];
mesh(new THREE.CylinderGeometry(1.0, 1.0, 0.05, 20), mat(0xd86aa0), 0, 0.08, 0.0, T);
const breath = noOut(mesh(new THREE.RingGeometry(0.42, 0.46, 40), glow(0xbfe0ff, 0.0), 0, 0, 0, scene));
// ---------------- the cast
const C = makeCast(scene, [['as', 'ashwatthama'], ['as2', 'ashwatthama'], ['k', 'krishna'], ['ut', 'uttara'], ['ar', 'arjuna'], ['dr', 'draupadi'], ['tk', 'krishna'], ['p1', 'devotee'], ['p2', 'gopi1']]);
addOutlines(scene);
const confetti = makeConfetti(scene, 50, 60);
const right = new THREE.Vector3(), up = new THREE.Vector3();

function update(s, t) {
  const cx = camera.position.x, set = cx > 60 ? 80 : cx > 20 ? 40 : 0, hook = s < E.as, ending = s >= E.comment;
  const night = set === 0 ? 0.8 : set === 40 ? 0.85 : 0;
  S.mood(night); S.hemi.intensity = 1.35 - night * 0.6; S.sun.target.position.set(set, 0, 0); S.sun.position.set(set - 8, 14, 10); S.sun.target.updateMatrixWorld();
  right.setFromMatrixColumn(camera.matrixWorld, 0); right.y = 0; right.normalize(); up.setFromMatrixColumn(camera.matrixWorld, 1);
  // --- the forest: he wanders, limping, with a wound that never heals
  const wanderOn = hook || (s >= E.some - 0.2 && s < E.thats) || ending;
  const wz = 0.6 - ((s * 0.05) % 1) * 0.8;
  pose(C.as2, camera, { visible: set === 0, x: 0, z: wz, h: 1.74, mood: 'sad', arm: 'down', wound: true, step: s * 1.5 });
  if (set === 0) C.as2.m.rotateZ(0.08 + Math.sin(s * 3) * 0.04);
  woundGlow.visible = set === 0; woundGlow.position.set(0, 1.74 * 0.8, wz + 0.05); woundGlow.material.opacity = 0.35 + 0.25 * Math.sin(t * 3);
  fog.forEach(({ m, ph }) => { const u = (t * 0.04 + ph) % 1; m.visible = set === 0; m.position.set(-6 + u * 12, 0.6 + Math.sin(ph * 9) * 0.4, -2 + Math.cos(ph * 7) * 3); });
  // --- the camp: the attack, the Brahmastra, Krishna's shield, the gem
  const burning = s >= E.dead + 0.4 && s < E.thats;
  flames.forEach((f, i) => { f.visible = set === 40 && burning; f.scale.set(1, 0.8 + 0.3 * Math.sin(t * 9 + i), 1); }); fireLight.intensity = set === 40 && burning ? 2.5 : 0;
  const attacking = s >= E.dead && s < E.k2, cursed = s >= E.took + 0.3;
  const ap = V(38.4, 0, 0.6);
  pose(C.as, camera, { visible: set === 40, x: ap.x, z: ap.z, h: 1.76, mood: cursed ? 'sad' : 'smug', arm: s >= E.fired - 0.2 && s < E.k2 ? 'point' : cursed ? 'down' : attacking ? 'up' : 'down', wound: cursed, step: s >= E.dead && s < E.but ? s * 4 : 0 });
  if (set === 40 && cursed) C.as.m.rotateZ(0.1);
  pose(C.ut, camera, { visible: set === 40 && s >= E.fired - 0.3, x: 41.8, z: 0.2, h: 1.62, mood: s >= E.saved ? 'closed' : 'wow', arm: 'down', flip: true });
  pose(C.ar, camera, { visible: set === 40 && s >= E.k2 - 0.3, x: 42.9, z: -0.4, h: 1.74, mood: 'normal', arm: 'down', flip: true });
  pose(C.dr, camera, { visible: set === 40 && s >= E.turned, x: 43.6, z: -1.0, h: 1.62, mood: 'sad', arm: 'down', flip: true });
  const kIn = sm(seg(s, E.k2 - 0.4, E.k2 + 0.4));
  pose(C.k, camera, { visible: set === 40 && s >= E.k2 - 0.4, x: lerp(43, 40.6, kIn), z: 0.6, h: 1.76, mood: s >= E.turned && s < E.wander + 1 ? 'normal' : 'happy', arm: s >= E.took - 0.2 && s < E.wander ? 'offer' : s < E.turned ? 'up' : 'down', flip: s < E.turned });
  // the weapon flies from his hand toward the womb, stops at Krishna's shield
  const fly = seg(s, E.brahm, E.k2 + 0.3), womb = V(41.8, 1.62 * 0.36, 0.25), from = ap.clone().add(V(-0.5, 1.2, 0));
  const stop = from.clone().lerp(womb, 0.86), bp = from.clone().lerp(womb, Math.min(fly, 0.86)).add(V(0, Math.sin(Math.min(fly, 0.86) * Math.PI) * 0.6, 0));
  BW.visible = set === 40 && s >= E.fired && s < E.saved + 0.3; BW.position.copy(bp); BW.lookAt(womb); BW.rotateY(Math.PI / 2);
  trail.forEach((m, i) => { m.visible = BW.visible && fly < 1; m.position.copy(from.clone().lerp(womb, Math.max(0, Math.min(fly, 0.86) - i * 0.03))); });
  const sh = sm(seg(s, E.k2, E.saved + 0.2)) * (1 - sm(seg(s, E.turned, E.wait))); shield.visible = set === 40 && sh > 0.01; shield.position.copy(womb); shield.material.opacity = 0.2 * sh;
  const fu = s - E.saved; flash.visible = set === 40 && fu > 0 && fu < 0.5; flash.position.copy(stop); flash.scale.setScalar(0.4 + fu * 2.5); flash.material.opacity = 0.6 * (1 - fu / 0.5);
  // the gem leaves his forehead into Krishna's hand
  const gu = sm(seg(s, E.took, E.took + 0.8)), head = ap.clone().add(V(0, 1.76 * 0.86, 0.05)), kh = V(lerp(43, 40.6, kIn), 0, 0.6).add(right.clone().multiplyScalar(-0.62)).add(V(0, 1.0, 0.1));
  gem.visible = gemGlow.visible = set === 40 && s >= E.took - 0.1 && s < E.thats; gem.position.copy(head.clone().lerp(kh, gu).add(V(0, Math.sin(gu * Math.PI) * 0.3, 0))); gemGlow.position.copy(gem.position); gem.rotation.y = t * 3;
  // --- today: a breath, a lamp, a calm face
  tl.forEach((l, i) => (l.flame.scale.y = 1 + 0.15 * Math.sin(t * 13 + i)));
  pose(C.tk, camera, { visible: set === 80, x: 80, y: 0.86, z: -2.4, h: 1.3, mood: 'happy', flute: true });
  const calm = s >= E.anger2;
  pose(C.p1, camera, { visible: set === 80, x: 79.6, y: 0.1, z: 0.0, h: 1.66, sitting: true, mood: calm ? 'closed' : 'sad', arm: ending ? 'up' : calm ? 'fold' : 'down', namaste: calm && !ending });
  pose(C.p2, camera, { visible: set === 80, x: 81.4, z: 0.6, h: 1.6, mood: 'happy', arm: 'offer', flip: true });
  breath.visible = set === 80 && calm; breath.position.set(79.6, 1.3, 0.05); breath.quaternion.copy(camera.quaternion); breath.scale.setScalar(1 + 0.25 * Math.sin(t * 1.6)); breath.material.opacity = 0.25;
  confetti(E.comment, s, V(80, 3, -1));
  S.clouds.forEach((c, i) => { c.visible = set === 80; c.position.x = -80 + i * 15 + ((t * 0.6 + i * 3) % 12); });
}

const G = (t) => t;
const SHOTS = [
  [0, E.stay - 0.05, G, [[0.6, 1.5, 4.4], [0, 1.3, 0.6]], [[0.6, 1.5, 4.4], [0, 1.3, 0.6]], [62, 38], { move: 'dolly' }],
  [E.stay - 0.05, E.as - 0.05, G, [[0.2, 1.5, 2.6], [0, 1.4, 0.0]], [[0.15, 1.5, 2.2], [0, 1.4, -0.1]]],
  [E.as - 0.05, E.dead - 0.05, G, [[40, 5, 11], [40, 0.8, -2]], [[39, 2.2, 5.6], [38.6, 1.2, 0.4]], 50, { move: 'pull' }],
  [E.dead - 0.05, E.but - 0.05, G, [[37.4, 1.6, 4.6], [38.8, 1.2, -2]], [[37.8, 1.6, 4.2], [39.4, 1.4, -3]]],
  [E.but - 0.05, E.fired - 0.05, G, [[38.8, 1.6, 3.0], [38.4, 1.4, 0.6]], [[38.8, 1.6, 2.7], [38.4, 1.4, 0.6]]],
  [E.fired - 0.05, E.k2 - 0.05, G, [[40.1, 1.6, 6.0], [40.1, 1.0, 0.3]], [[40.1, 1.5, 5.2], [40.6, 0.9, 0.3]]],
  [E.k2 - 0.05, E.turned - 0.05, G, [[41.6, 1.3, 4.2], [41.2, 1.0, 0.3]], [[41.6, 1.3, 3.8], [41.2, 1.0, 0.3]], [62, 42], { move: 'dolly' }],
  [E.turned - 0.05, E.wait - 0.05, G, [[39.5, 1.7, 4.4], [39.5, 1.3, 0.6]], [[39.5, 1.7, 4.0], [39.5, 1.3, 0.6]]],
  [E.wait - 0.05, E.took - 0.05, G, [[38.6, 1.7, 2.6], [38.4, 1.55, 0.6]], [[38.6, 1.7, 2.4], [38.4, 1.55, 0.6]]],
  [E.took - 0.05, E.wander - 0.05, G, [[39.4, 1.7, 4.6], [39.4, 1.45, 0.6]], [[39.4, 1.7, 4.3], [39.4, 1.45, 0.6]], [62, 44], { move: 'dolly' }],
  [E.wander - 0.05, E.some - 0.05, G, [[38.5, 1.6, 2.8], [38.4, 1.5, 0.6]], [[38.5, 2.6, 4.6], [38.4, 1.4, 0.6]], 50, { move: 'crane', lift: 0.8 }],
  [E.some - 0.05, E.thats - 0.05, G, [[0.3, 1.6, 4.6], [0, 1.3, 0.2]], [[0.3, 1.9, 7.4], [0, 1.2, 0.2]], 50, { move: 'pull' }],
  [E.thats - 0.05, E.anger2 - 0.05, G, [[80, 3.0, 7.4], [80, 1.6, -1.6]], [[80, 2.0, 4.4], [79.8, 1.2, -0.2]], 50, { move: 'land' }],
  [E.anger2 - 0.05, E.comment - 0.05, G, [[79.7, 1.3, 2.4], [79.6, 1.1, 0]], [[79.7, 1.3, 2.4], [79.6, 1.1, 0]], [62, 42], { move: 'dolly' }],
  [E.comment - 0.05, DURATION + 0.1, G, [[80, 2.1, 5.2], [80, 1.3, -1.0]], [[80, 2.1, 4.7], [80, 1.3, -1.0]]],
];
direct({ stage, WORDS, DURATION, shots: SHOTS, update, title: 1.4, q: [E.wait, E.took], cta: E.comment, prog: [E.but, E.thats], pin: E.wait,
  key: ['five', 'thousand', 'wound', 'heals', 'krishna', 'curse', 'ashwatthama', 'rage', 'night', 'slept', 'brahmastra', 'unborn', 'saved', 'wait', 'gem', 'forehead', 'wander', 'alone', 'today', 'anger', 'moment', 'forever', 'comment', 'calm'],
  loc: (t) => (t >= E.as - 0.05 && t < E.dead ? '📍 KURUKSHETRA · THE LAST NIGHT' : t >= E.some - 0.05 && t < E.thats ? 'SOME SAY · EVEN NOW' : t >= E.thats - 0.05 && t < E.anger2 ? 'EVEN TODAY' : ''), shakes: [E.saved, E.took + 0.3], tick: () => {} });
