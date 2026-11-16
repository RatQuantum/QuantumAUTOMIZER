// Day 46 · "Why burn a bonfire before Holi?" · Why we do what we do #28 (as the story goes: Prahlad and Holika)
// Strategy 8 hook/tracker/pinned CTA + Strategy 9 camera moves.
// Sets: Hiranyakashipu's palace with a cliff behind it (origin), Holika's bonfire at dusk (x = 40), a Holika Dahan bonfire tonight (x = 80).
import * as THREE from './three.module.js';
import { rng, mat, mesh, sm, seg, lerp, clamp, setupScene, makeCast, pose, lamp, roundTree } from './kit.js';
import { makeStage, direct, wordTime } from './director.js';
import { addOutlines, makeConfetti } from './plus.js';
import { WORDS, DURATION } from './data.js';

const stage = makeStage(), { scene, camera } = stage, V = (x, y, z) => new THREE.Vector3(x, y, z), R = rng(46);
const S = setupScene(scene, [[0, -3], [40, 0], [80, 0]], 46);
const WT = wordTime(WORDS);
const E = { as: WT('as'), demon: WT('demon'), hir: WT('hiranya'), pra: WT('prahlad'), tried: WT('tried'), snakes: WT('snakes'), ele: WT('elephants'), cliffs: WT('cliffs'), smiled: WT('smiled'),
  called: WT('called'), shawl: WT('shawl'), sat: WT('sat'), wait: WT('wait'), wind: WT('wind'), flew: WT('flew'), wrapped: WT('wrapped'), burned: WT('burned'), walked: WT('walked'),
  thats: WT("that's"), faith: WT('faith'), comment: WT('comment') };
const glow = (c, o = 0.5) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, depthWrite: false, blending: THREE.AdditiveBlending });
const noOut = (m) => { m.userData.noOutline = true; m.castShadow = false; return m; };

// a low-poly elephant facing -x (trunk pivot exposed)
function elephant(parent, k = 1) {
  const g = new THREE.Group(); parent.add(g); g.scale.setScalar(k); const gr = mat(0x8c8c9a);
  mesh(new THREE.BoxGeometry(2.0, 1.2, 1.1), gr, 0, 1.6, 0, g); mesh(new THREE.BoxGeometry(0.8, 0.85, 0.85), gr, -1.25, 1.9, 0, g);
  for (const z of [-0.5, 0.5]) { const ear = mesh(new THREE.BoxGeometry(0.1, 0.8, 0.6), mat(0x9a9aaa), -1.0, 1.95, z, g); ear.rotation.y = z * 0.6; }
  for (const [x, z] of [[-0.7, -0.35], [-0.7, 0.35], [0.7, -0.35], [0.7, 0.35]]) mesh(new THREE.CylinderGeometry(0.2, 0.22, 1.1, 8), gr, x, 0.55, z, g);
  const trunk = new THREE.Group(); trunk.position.set(-1.6, 1.8, 0); g.add(trunk); mesh(new THREE.CylinderGeometry(0.12, 0.17, 1.1, 8).translate(0, -0.55, 0), gr, 0, 0, 0, trunk);
  for (const z of [-0.22, 0.22]) noOut(mesh(new THREE.ConeGeometry(0.06, 0.4, 6).rotateZ(Math.PI / 2 + 0.5), mat(0xfaf5ea), -1.7, 1.55, z, g));
  for (const z of [-0.3, 0.3]) noOut(mesh(new THREE.SphereGeometry(0.05, 6, 4), mat(0x1d1a24), -1.66, 2.05, z, g));
  return { g, trunk };
}

// ---------------- the palace (origin)
mesh(new THREE.BoxGeometry(16, 0.1, 12), mat(0x8a3a3a), 0, 0.05, -2, scene).castShadow = false; noOut(mesh(new THREE.BoxGeometry(5, 0.02, 9), mat(0xc9a227), 0, 0.11, -1, scene));
mesh(new THREE.BoxGeometry(16, 7, 0.4), mat(0x4a2030), 0, 3.5, -6, scene);
for (let i = 0; i < 6; i++) { const x = -6.5 + i * 2.6; mesh(new THREE.CylinderGeometry(0.3, 0.34, 6, 10), mat(0x2a1a22), x, 3, -4.6, scene); mesh(new THREE.BoxGeometry(0.8, 0.3, 0.8), mat(0xc9a227, { m: 0.5, r: 0.4 }), x, 6.1, -4.6, scene); }
mesh(new THREE.BoxGeometry(2.6, 0.6, 1.6), mat(0x2a1a22), 0, 0.3, -3, scene); mesh(new THREE.BoxGeometry(1.6, 0.5, 1.0), mat(0xc9a227, { m: 0.6, r: 0.35 }), 0, 0.85, -3, scene);
mesh(new THREE.BoxGeometry(1.8, 2.6, 0.2), mat(0xc9a227, { m: 0.6, r: 0.35 }), 0, 2.1, -3.5, scene);
const pl = [lamp(scene, -2.4, 0.1, -2.4, 0.9), lamp(scene, 2.4, 0.1, -2.4, 0.9)];
// the snakes (rise around Prahlad), the charging elephant, and the cliff behind the palace
const snakes = [0, 1, 2].map((i) => { const g = new THREE.Group(); scene.add(g); noOut(mesh(new THREE.TorusGeometry(0.28 + i * 0.05, 0.06, 6, 14, Math.PI * 1.6).rotateX(Math.PI / 2), mat(0x2f8a3a), 0, 0, 0, g)); noOut(mesh(new THREE.SphereGeometry(0.1, 8, 6).scale(1, 0.7, 1.4), mat(0x2f8a3a), 0.3 + i * 0.05, 0.08, 0, g)); return g; });
const EL = elephant(scene, 0.9);
mesh(new THREE.BoxGeometry(5, 7, 4), mat(0x8a7a6a), -11, 3.5, -10, scene); mesh(new THREE.BoxGeometry(4, 1.2, 3), mat(0x7a6a5a), -10.5, 0.6, -6.6, scene);
// ---------------- Holika's bonfire at dusk (x = 40)
mesh(new THREE.CylinderGeometry(10, 10, 0.06, 24), mat(0xb08a5a), 40, 0.03, 0, scene).castShadow = false;
const logs = new THREE.Group(); logs.position.set(40, 0, 0); scene.add(logs);
for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2, l = mesh(new THREE.CylinderGeometry(0.1, 0.12, 2.0, 6), mat(0x6a4020), Math.cos(a) * 0.5, 0.45, Math.sin(a) * 0.5, logs); l.rotation.set(Math.sin(a) * 1.1, 0, -Math.cos(a) * 1.1); }
mesh(new THREE.CylinderGeometry(0.9, 1.1, 0.75, 10), mat(0x5a3418), 0, 0.38, 0, logs);
const flames = []; for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2, r = 1.05 + (i % 2) * 0.25; const f = noOut(mesh(new THREE.ConeGeometry(0.22, 1, 7).translate(0, 0.5, 0), new THREE.MeshBasicMaterial({ color: i % 3 ? 0xff7a1a : 0xffc23a }), 40 + Math.cos(a) * r, 0.3, Math.sin(a) * r, scene)); flames.push({ f, a, ph: R() * 6 }); }
const fireGlow = noOut(mesh(new THREE.SphereGeometry(1.6, 16, 10), glow(0xff8a2a, 0.12), 40, 1.0, 0, scene));
const fireLight = new THREE.PointLight(0xffa050, 0, 12, 1.4); scene.add(fireLight);
// the magic shawl (a cloth that flies from Holika to Prahlad)
const shawl = noOut(mesh(new THREE.PlaneGeometry(0.9, 0.6, 6, 4), new THREE.MeshStandardMaterial({ color: 0xe8a020, emissive: 0x6a3a00, side: THREE.DoubleSide, flatShading: true }), 0, 0, 0, scene)); const sb = shawl.geometry.attributes.position.array.slice();
const shawlGlow = noOut(mesh(new THREE.RingGeometry(0.45, 0.62, 24), glow(0xffe08a, 0.4), 0, 0, 0, scene));
const flash = noOut(mesh(new THREE.SphereGeometry(1, 16, 10), glow(0xfff0c0, 0), 40, 1.2, 0, scene));
const smoke = []; for (let i = 0; i < 16; i++) smoke.push({ m: noOut(mesh(new THREE.SphereGeometry(0.35, 8, 6), new THREE.MeshBasicMaterial({ color: 0x6a6a72, transparent: true, opacity: 0.35, depthWrite: false }), 0, 0, 0, scene)), ph: R() });
// ---------------- the Holika Dahan bonfire tonight (x = 80)
mesh(new THREE.CylinderGeometry(12, 12, 0.06, 24), mat(0x7a6a50), 80, 0.03, 0, scene).castShadow = false;
const pyre = []; for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2, l = mesh(new THREE.CylinderGeometry(0.08, 0.1, 2.6, 6), mat(0x6a4020), 80 + Math.cos(a) * 0.4, 0.9, Math.sin(a) * 0.4, scene); l.rotation.set(Math.sin(a) * 0.4, 0, -Math.cos(a) * 0.4); pyre.push(l); }
const tflames = []; for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; tflames.push({ f: noOut(mesh(new THREE.ConeGeometry(0.35, 1.8, 7).translate(0, 0.9, 0), new THREE.MeshBasicMaterial({ color: i % 3 ? 0xff7a1a : 0xffc23a }), 80 + Math.cos(a) * 0.55, 0.2, Math.sin(a) * 0.55, scene)), ph: R() * 6 }); }
const tGlow = noOut(mesh(new THREE.SphereGeometry(2.2, 16, 10), glow(0xff8a2a, 0.15), 80, 1.6, 0, scene));
const tLight = new THREE.PointLight(0xffa050, 0, 16, 1.2); tLight.position.set(80, 2.5, 0.5); scene.add(tLight);
const sparks = []; for (let i = 0; i < 30; i++) sparks.push({ m: noOut(mesh(new THREE.SphereGeometry(0.04, 4, 3), new THREE.MeshBasicMaterial({ color: 0xffd060 }), 0, 0, 0, scene)), ph: R(), a: R() * 6.3 });
for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2 + 0.3; roundTree(scene, 80 + Math.cos(a) * 10, Math.sin(a) * 10 - 2, R, 1.1); }
// ---------------- the cast
const C = makeCast(scene, [['p', 'prahlad'], ['hk', 'hiranya'], ['ho', 'holika'], ['p2', 'prahlad'], ['g1', 'devotee'], ['g2', 'gopi1'], ['g3', 'govinda'], ['g4', 'kid1'], ['g5', 'gopi2']]);
const holikaFull = C.ho.spec, holikaBare = Object.assign({}, holikaFull, { bodyDeco: (c, cx, y, w, h) => { c.fillStyle = '#a03050'; c.fillRect(cx - w / 2, y + h * 0.5, w, 12); } });
addOutlines(scene);
const confetti = makeConfetti(scene, 50, 46);

function update(s, t) {
  const cx = camera.position.x, set = cx > 60 ? 80 : cx > 20 ? 40 : 0, hook = s < E.as;
  const night = set === 80, dusk = set === 40;
  S.mood(night ? 0.85 : dusk ? 0.35 : 0); S.hemi.intensity = night ? 0.7 : 1.35; S.sun.target.position.set(set, 0, 0); S.sun.position.set(set - 8, 14, 10); S.sun.target.updateMatrixWorld();
  if (dusk) { S.paintSky(new THREE.Color(0x5a4aa0), new THREE.Color(0xff8a50)); S.sun.color.set(0xffa070); }
  // --- the palace: the king on his throne; Prahlad chanting; snakes, an elephant, a cliff
  pl.forEach((l, i) => (l.flame.scale.y = 1 + 0.15 * Math.sin(t * 11 + i)));
  const point = s >= E.tried && s < E.called + 1.5;
  pose(C.hk, camera, { visible: set === 0, x: 0, y: 0.6, z: -2.7, h: 2.1, mood: s >= E.smiled && s < E.called ? 'sad' : 'smug', arm: point ? 'point' : 'hips', flip: s >= E.called && s < E.sat });
  const onCliff = s >= E.cliffs - 0.05 && s < E.smiled - 0.1, fall = seg(s, E.cliffs + 0.3, E.smiled - 0.2);
  const pp = onCliff ? V(-10.2 + fall * 0.6, lerp(7.05, 1.2, sm(fall)), -8.3 + sm(seg(fall, 0, 0.15)) * 1.5) : V(1.5, 0, 0.5);
  pose(C.p, camera, { visible: set === 0, x: pp.x, y: pp.y, z: pp.z, h: 1.05, mood: s >= E.smiled - 0.6 || s < E.tried ? 'closed' : 'happy', arm: 'down', flip: true });
  const sk = sm(seg(s, E.snakes - 0.1, E.snakes + 0.4)) * (1 - sm(seg(s, E.ele - 0.2, E.ele + 0.1)));
  snakes.forEach((g, i) => { g.visible = set === 0 && sk > 0.01; g.position.set(1.5, 0.05 + i * 0.22 * sk, 0.5); g.scale.setScalar(Math.max(0.01, sk)); g.rotation.y = t * (i % 2 ? 1.5 : -1.5) + i; });
  const charge = seg(s, E.ele - 0.1, E.ele + 0.5), bow = sm(seg(s, E.ele + 0.45, E.cliffs - 0.05));
  EL.g.visible = set === 0 && s >= E.ele - 0.15 && s < E.cliffs; EL.g.position.set(lerp(9, 3.4, sm(charge)), 0, 0.5); EL.g.rotation.z = bow * 0.18; EL.trunk.rotation.z = -bow * 0.9 + Math.sin(t * 3) * 0.1;
  const hEnter = sm(seg(s, E.called, E.called + 0.9));
  pose(C.ho, camera, { visible: (set === 0 && s >= E.called - 0.1) || (set === 40 && !hook && s < E.burned), x: set === 40 ? 39.9 : lerp(-5, -1.4, hEnter), y: set === 40 ? 0.62 : 0, z: set === 40 ? -0.15 : 0.6, h: 1.7, mood: set === 40 && s >= E.flew ? 'wow' : 'smug', arm: set === 0 ? 'hips' : 'down', sitting: set === 40, step: set === 0 && hEnter > 0 && hEnter < 1 ? s * 4 : 0 });
  const want = s >= E.flew ? holikaBare : holikaFull; if (C.ho.spec !== want) { C.ho.spec = want; C.ho.key = ''; }
  // --- the bonfire: Prahlad on Holika's lap; the wind; the shawl flies to him; Holika is gone; he walks out
  const burning = s >= E.sat || hook, high = hook ? 1 : sm(seg(s, E.sat, E.sat + 1.2)) * (1 + 0.3 * sm(seg(s, E.burned - 0.3, E.burned + 0.3)) - 0.3 * sm(seg(s, E.walked, E.thats)));
  const wind = sm(seg(s, E.wind - 0.2, E.wind + 0.6)) * (1 - sm(seg(s, E.wrapped, E.burned)));
  flames.forEach(({ f, a, ph }) => { f.visible = set === 40 && burning; const k = high * (0.8 + 0.3 * Math.sin(t * 9 + ph)) * (Math.sin(a) > 0.3 ? 0.7 : 1.1); f.scale.set(1, Math.max(0.01, k), 1); f.rotation.z = -wind * 0.7 + Math.sin(t * 7 + ph) * 0.08; });
  fireGlow.visible = set === 40 && burning; fireGlow.material.opacity = 0.1 * high; fireLight.intensity = set === 40 && burning ? 2.2 * high : 0; fireLight.position.set(40, 1.4, 1.4);
  const walkOut = sm(seg(s, E.walked, E.thats - 0.2)), pOnLap = V(40.0, 0.62 + 0.35, 0.18);
  const pp2 = hook ? V(40, 0.8, 0.1) : s < E.walked ? pOnLap : V(40, lerp(0.97, 0, sm(seg(s, E.walked, E.walked + 0.4))), lerp(0.18, 3.2, walkOut));
  pose(C.p2, camera, { visible: set === 40 && (s >= E.sat || hook), x: pp2.x, y: pp2.y, z: pp2.z, h: 1.0, mood: 'closed', arm: 'down', step: s >= E.walked + 0.4 && walkOut < 1 ? s * 3.5 : 0, sitting: s < E.walked + 0.2 });
  const fly = sm(seg(s, E.flew, E.wrapped + 0.2)), onP = hook || s >= E.wrapped + 0.2;
  const from = V(39.9, 1.55, -0.05), to = V(pp2.x, pp2.y + 0.36, pp2.z + 0.06);
  shawl.visible = (set === 40 && s >= E.flew && s < E.thats) || (set === 40 && hook);
  if (shawl.visible) { const p = onP ? to : from.clone().lerp(to, fly).add(V(Math.sin(fly * Math.PI) * 0.9, Math.sin(fly * Math.PI) * 1.2, 0)); shawl.position.copy(p); shawl.quaternion.copy(camera.quaternion); if (!onP) shawl.rotateZ(fly * Math.PI * 2);
    shawl.scale.set(onP ? 0.62 : 1, onP ? 0.5 : 1, 1); const pa = shawl.geometry.attributes.position; for (let i = 0; i < pa.count; i++) pa.setZ(i, Math.sin(sb[i * 3] * 6 + t * (onP ? 3 : 14)) * (onP ? 0.02 : 0.08)); pa.needsUpdate = true; }
  shawlGlow.visible = shawl.visible && (onP || s >= E.shawl); shawlGlow.position.copy(shawl.position); shawlGlow.quaternion.copy(camera.quaternion); shawlGlow.scale.setScalar((onP ? 0.75 : 1) + 0.05 * Math.sin(t * 5));
  const fu = s - E.burned; flash.visible = set === 40 && fu > 0 && fu < 0.6; flash.scale.setScalar(0.8 + fu * 3); flash.material.opacity = 0.5 * (1 - fu / 0.6);
  smoke.forEach(({ m, ph }) => { const u = (t * 0.25 + ph) % 1; m.visible = set === 40 && s >= E.burned && s < E.thats; m.position.set(40 + Math.sin(ph * 9) * 0.6 - wind, 1.6 + u * 4, -0.6 + Math.cos(ph * 7) * 0.4); m.scale.setScalar(0.6 + u * 1.6); m.material.opacity = 0.3 * (1 - u); });
  // --- Holika Dahan tonight: the crowd around the bonfire
  tflames.forEach(({ f, ph }) => { f.visible = set === 80; f.scale.set(1, 0.85 + 0.25 * Math.sin(t * 8 + ph), 1); });
  tGlow.visible = set === 80; tGlow.material.opacity = 0.12 + 0.03 * Math.sin(t * 6); tLight.intensity = set === 80 ? 3.0 : 0;
  sparks.forEach(({ m, ph, a }) => { const u = (t * 0.45 + ph) % 1; m.visible = set === 80; m.position.set(80 + Math.cos(a + u * 2) * (0.3 + u * 1.2), 1.2 + u * 5, Math.sin(a + u * 2) * (0.3 + u * 1.2)); });
  [['g1', -1.5, 1.5, 1.65], ['g2', 1.5, 1.5, 1.6], ['g3', -2.2, 0.4, 1.62], ['g4', 0.8, 2.4, 1.1], ['g5', 2.2, 0.3, 1.6]].forEach(([n, x, z, h], i) =>
    pose(C[n], camera, { visible: set === 80, x: 80 + x, z, h, mood: s >= E.faith ? 'happy' : 'closed', arm: s >= E.comment ? 'up' : i % 2 ? 'down' : 'offer', flip: x > 0 }));
  confetti(E.comment, s, V(80, 3, 1));
  S.clouds.forEach((c, i) => { c.position.x = -80 + i * 15 + ((t * 0.6 + i * 3) % 12); });
}

const G = (t) => t;
const SHOTS = [
  [0, E.as - 0.05, G, [[40.0, 1.95, 2.7], [40.0, 1.25, 0.1]], [[40.0, 1.95, 2.7], [40.0, 1.25, 0.1]], [62, 34], { move: 'dolly' }],
  [E.as - 0.05, E.hir - 0.05, G, [[0, 3.6, 12], [0, 2.4, -3]], [[0, 2.4, 6.5], [0, 1.8, -3]], 50, { move: 'pull' }],
  [E.hir - 0.05, E.pra - 0.05, G, [[0.9, 1.1, 1.2], [0, 2.1, -2.7]], [[0.6, 1.1, 0.7], [0, 2.1, -2.7]]],
  [E.pra - 0.05, E.tried - 0.05, G, [[1.9, 0.9, 3.0], [1.5, 0.75, 0.5]], [[1.8, 0.9, 2.5], [1.5, 0.75, 0.5]]],
  [E.tried - 0.05, E.snakes - 0.05, G, [[3.6, 2.0, 5.2], [0.7, 1.2, -1.2]], [[3.2, 1.9, 4.6], [0.7, 1.2, -1.2]]],
  [E.snakes - 0.05, E.ele - 0.05, G, [[1.6, 0.9, 2.5], [1.5, 0.55, 0.5]], [[1.6, 0.9, 2.2], [1.5, 0.55, 0.5]]],
  [E.ele - 0.05, E.cliffs - 0.05, G, [[-0.6, 1.4, 5.2], [2.6, 1.0, 0.3]], [[-0.4, 1.4, 4.8], [2.6, 1.0, 0.3]]],
  [E.cliffs - 0.05, E.smiled - 0.05, G, [[-4.2, 5.0, 3.6], [-9.8, 5.6, -7.8]], [[-4.6, 3.0, 2.8], [-9.6, 2.0, -7.0]]],
  [E.smiled - 0.05, E.called - 0.05, G, [[1.6, 1.0, 2.3], [1.5, 0.9, 0.5]], [[1.55, 1.0, 1.9], [1.5, 0.9, 0.5]]],
  [E.called - 0.05, E.shawl - 0.05, G, [[-0.6, 1.7, 5.0], [-1.0, 1.2, -0.6]], [[-0.8, 1.6, 4.4], [-1.0, 1.2, -0.6]]],
  [E.shawl - 0.05, E.sat - 0.05, G, [[-1.3, 1.4, 3.4], [-1.4, 1.15, 0.6]], [[-1.3, 1.4, 3.0], [-1.4, 1.15, 0.6]]],
  [E.sat - 0.05, E.wait - 0.05, G, [[40, 1.8, 6.5], [40, 1.2, 0]], [[40, 6.0, 12], [40, 1.0, 0]], 50, { move: 'pull' }],
  [E.wait - 0.05, E.wind - 0.05, G, [[40.2, 1.5, 2.9], [40, 1.35, 0]], [[40.2, 1.5, 2.6], [40, 1.35, 0]]],
  [E.wind - 0.05, E.flew - 0.05, G, [[42.8, 1.2, 4.0], [40, 1.3, 0]], [[42.4, 1.2, 3.6], [40, 1.3, 0]]],
  [E.flew - 0.05, E.burned - 0.05, G, [[40, 1.7, 4.4], [40, 1.6, 0]], [[40.8, 2.0, 4.6], [40, 1.4, 0]], 50, { move: 'crane', lift: 1.4 }],
  [E.burned - 0.05, E.walked - 0.05, G, [[40, 2.6, 7.0], [40, 1.5, 0]], [[40, 2.6, 6.4], [40, 1.5, 0]]],
  [E.walked - 0.05, E.thats - 0.05, G, [[40, 1.2, 7.4], [40, 0.8, 1.5]], [[40, 1.0, 6.4], [40, 0.7, 2.6]]],
  [E.thats - 0.05, E.faith - 0.05, G, [[80, 4.0, 13], [80, 1.6, 0]], [[80, 2.4, 8.4], [80, 1.6, 0]], 50, { move: 'land' }],
  [E.faith - 0.05, E.comment - 0.05, G, [[80.6, 1.6, 6.0], [80.4, 1.3, 1.5]], [[80.5, 1.6, 5.5], [80.4, 1.3, 1.5]]],
  [E.comment - 0.05, DURATION + 0.1, G, [[80, 2.6, 9.4], [80, 1.8, 0]], [[80, 2.6, 8.8], [80, 1.8, 0]]],
];
direct({ stage, WORDS, DURATION, shots: SHOTS, update, title: 1.6, q: [E.wait, E.wind], cta: E.comment, prog: [E.wait, E.thats], pin: E.wait,
  key: ['father', 'fire', 'refused', 'demon', 'hiranyakashipu', 'worship', 'prahlad', 'narayana', 'everything', 'snakes', 'elephants', 'cliffs', 'smiled', 'holika', 'shawl', 'bonfire', 'lap', 'wait', 'wind', 'flew', 'wrapped', 'burned', 'walked', 'holi', 'faith', 'tested', 'comment'],
  loc: (t) => (t >= E.as - 0.05 && t < E.hir + 1.0 ? "📍 THE DEMON KING'S PALACE" : t >= E.thats - 0.05 && t < E.faith ? 'EVERY YEAR · THE NIGHT BEFORE HOLI' : ''), shakes: [E.burned], tick: () => {} });
