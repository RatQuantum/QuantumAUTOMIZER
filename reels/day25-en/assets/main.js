// Day 25 · "Why never go empty-handed?" · Why we do what we do #7 (as the story goes: Sudama's handful of rice)
// Sets: Dwarka's palace and gates (origin), a temple today (x = 40), the gurukul (x = -40), Sudama's hut (x = 80).
import * as THREE from './three.module.js';
import { rng, mat, mesh, sm, seg, lerp, clamp, setupScene, makeCast, pose, lamp, hut, roundTree, palm, clayPot } from './kit.js';
import { makeStage, direct, wordTime } from './director.js';
import { addOutlines, makeConfetti } from './plus.js';
import { WORDS, DURATION } from './data.js';

const stage = makeStage(), { scene, camera } = stage, V = (x, y, z) => new THREE.Vector3(x, y, z), R = rng(25);
const S = setupScene(scene, [[0, 0], [40, 0], [-40, 0], [80, 0]], 25);
const WT = wordTime(WORDS);
const E = { even: WT('even'), flower: WT('flower') - 0.28, spoon: WT('spoon') - 0.2, as: WT('as'), krishna: WT('krishna'), years: WT('years'), and: WT('and'), his: WT('his'),
  wife: WT('his', 2), but: WT('but'), so2: WT('so', 2), handful: WT('handful'), at2: WT('palace') - 0.42, guards: WT('guards'), but2: WT('but', 2), running: WT('running'), hugged: WT('hugged'),
  sudama4: WT('shy') - 0.58, grabbed: WT('grabbed'), wait: WT('wait'), not: WT('word') - 0.4, he: WT('walked') - 0.14, but3: WT('but', 3), palace2: WT('palace', 2), thats: WT("that's"),
  it: WT('size') - 0.82, love: WT('love'), send: WT('send'), comment: WT('comment') };
const glow = (c, o = 0.5) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, depthWrite: false, blending: THREE.AdditiveBlending });
const noOut = (m) => { m.userData.noOutline = true; m.castShadow = false; return m; };

function palace(parent, x, z, k = 1) {
  const P = new THREE.Group(); P.position.set(x, 0, z); P.scale.setScalar(k); parent.add(P);
  const cream = mat(0xf3e2b8), red = mat(0xd8573a), gold = mat(0xffd23a, { m: 0.5, r: 0.4 });
  mesh(new THREE.BoxGeometry(18, 4.5, 4), cream, 0, 2.25, 0, P); mesh(new THREE.BoxGeometry(6, 7, 4.4), cream, 0, 3.5, 0.2, P);
  for (const dx of [-7.5, 7.5]) { mesh(new THREE.CylinderGeometry(1.2, 1.4, 7.5, 8), cream, dx, 3.75, 1, P); mesh(new THREE.SphereGeometry(1.4, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), red, dx, 7.5, 1, P); mesh(new THREE.ConeGeometry(0.25, 0.9, 6), gold, dx, 9.3, 1, P); }
  mesh(new THREE.SphereGeometry(2.6, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), red, 0, 7, 0.2, P); mesh(new THREE.ConeGeometry(0.35, 1.3, 6), gold, 0, 10.1, 0.2, P);
  for (let i = 0; i < 8; i++) mesh(new THREE.CylinderGeometry(0.22, 0.22, 3.6, 8), cream, -6 + i * (12 / 7), 1.8, 2.3, P);
  mesh(new THREE.BoxGeometry(2.2, 3.4, 0.3), mat(0x7a3a1a), 0, 1.7, 2.45, P);
  for (let i = 0; i < 6; i++) mesh(new THREE.BoxGeometry(0.9, 1.1, 0.2), mat(0x2f6fa8), -7 + i * 2.8 + (i > 2 ? 1.4 : -1.4), 3.4, 2.1, P);
  for (const dx of [-2.6, 2.6]) { mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.2, 6), mat(0x6b4a2a), dx, 8.1, 0.4, P); mesh(new THREE.BoxGeometry(0.9, 0.5, 0.04), mat(0xff8a1e), dx + 0.47, 8.9, 0.4, P); }
  return P;
}
// ---------------- Dwarka (origin): the palace, a courtyard, the gates
palace(scene, 0, -9);
mesh(new THREE.BoxGeometry(16, 0.08, 12), mat(0xf6e8c8), 0, 0.04, -3, scene).castShadow = false;
noOut(mesh(new THREE.BoxGeometry(2.0, 0.03, 12), mat(0xd8263a), 0, 0.09, -2, scene));
const gold = mat(0xffd23a, { m: 0.5, r: 0.4 });
for (const x of [-2.4, 2.4]) { mesh(new THREE.BoxGeometry(0.9, 4.2, 0.9), mat(0xf3e2b8), x, 2.1, 3.0, scene); mesh(new THREE.ConeGeometry(0.6, 0.9, 4).rotateY(Math.PI / 4), gold, x, 4.65, 3.0, scene); }
mesh(new THREE.BoxGeometry(5.7, 0.6, 0.9), mat(0xd8573a), 0, 4.0, 3.0, scene);
for (const x of [-7, 7]) mesh(new THREE.BoxGeometry(8.2, 2.2, 0.5), mat(0xf3e2b8), x * 0.95 + (x > 0 ? 0.6 : -0.6), 1.1, 3.0, scene);
for (let i = 0; i < 8; i++) palm(scene, (i % 2 ? 1 : -1) * (6 + (i % 4) * 1.6), 6 + Math.floor(i / 2) * 2.2, R);
for (let i = 0; i < 6; i++) clayPot(scene, (i % 2 ? 1 : -1) * 3.2, 0.42, -1 - Math.floor(i / 2) * 2.5, 0.6);
// ---------------- the temple today (x = 40)
const T = new THREE.Group(); T.position.set(40, 0, 0); scene.add(T);
mesh(new THREE.BoxGeometry(12, 0.1, 10), mat(0xf3e6c8), 0, 0.05, 0, T).castShadow = false;
mesh(new THREE.BoxGeometry(12, 9, 0.3), mat(0xf6d9a0), 0, 4.5, -3.2, T);
mesh(new THREE.BoxGeometry(3.4, 0.9, 1.4), mat(0x8a4b20), 0, 0.45, -2.3, T); mesh(new THREE.BoxGeometry(3.5, 0.08, 1.5), mat(0xd8263a), 0, 0.93, -2.3, T);
mesh(new THREE.BoxGeometry(1.9, 2.5, 0.12), gold, 0, 2.35, -2.95, T); mesh(new THREE.BoxGeometry(1.65, 2.25, 0.14), mat(0x2f6fa8), 0, 2.35, -2.93, T);
for (let i = 0; i <= 18; i++) { const u = i / 18; noOut(mesh(new THREE.SphereGeometry(0.09, 6, 4), mat(i % 2 ? 0xf6a531 : 0xffffff), -0.95 + u * 1.9, 3.55 - Math.sin(u * Math.PI) * 0.35, -2.85, T)); }
const tl = [lamp(T, -1.3, 0.97, -2.1, 0.6), lamp(T, 1.3, 0.97, -2.1, 0.6)];
const altarGlow = noOut(mesh(new THREE.SphereGeometry(0.9, 16, 12), glow(0xffd06a, 0), 40, 1.2, -2.0, scene));
// offerings: a banana, a flower, a spoon of sugar (held, then placed)
const banana = new THREE.Group(); scene.add(banana); { const g = new THREE.TorusGeometry(0.16, 0.05, 6, 10, Math.PI * 0.9); mesh(g, mat(0xffd23a), 0, 0, 0, banana); mesh(new THREE.CylinderGeometry(0.015, 0.02, 0.05, 5), mat(0x6b4a2a), 0.16, 0.01, 0, banana); }
const flower = new THREE.Group(); scene.add(flower); { for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; mesh(new THREE.SphereGeometry(0.06, 6, 4), mat(0xff6a9a), Math.cos(a) * 0.07, Math.sin(a) * 0.07, 0, flower); } mesh(new THREE.SphereGeometry(0.05, 6, 4), mat(0xffd23a), 0, 0, 0.03, flower); }
const spoon = new THREE.Group(); scene.add(spoon); { mesh(new THREE.SphereGeometry(0.07, 8, 6).scale(1, 0.4, 1.2), mat(0xd9d9e0, { m: 0.7, r: 0.3 }), 0, 0, 0, spoon); mesh(new THREE.BoxGeometry(0.02, 0.02, 0.22), mat(0xd9d9e0, { m: 0.7, r: 0.3 }), 0, 0.02, 0.15, spoon); mesh(new THREE.SphereGeometry(0.05, 6, 4).scale(1, 0.5, 1), mat(0xffffff), 0, 0.02, 0, spoon); }
// ---------------- the gurukul (x = -40)
const GK = new THREE.Group(); GK.position.set(-40, 0, 0); scene.add(GK);
mesh(new THREE.CylinderGeometry(5, 5, 0.1, 20), mat(0xd9b77a), 0, 0.05, 0, GK).castShadow = false;
roundTree(GK, -1.2, -2.6, R, 1.5); roundTree(GK, 3.5, -3.5, R, 1.1); hut(GK, -4.6, -2.5, R, 0.4);
noOut(mesh(new THREE.BoxGeometry(2.6, 0.03, 1.4), mat(0x6bae4a), 0, 0.1, 0.4, GK));
for (const x of [-0.55, 0.55]) { mesh(new THREE.BoxGeometry(0.4, 0.05, 0.3), mat(0xc8a46a), x, 0.32, 0.85, GK); }
// ---------------- Sudama's hut (x = 80), which becomes a palace
const H = new THREE.Group(); H.position.set(80, 0, 0); scene.add(H);
mesh(new THREE.CylinderGeometry(6, 6, 0.08, 20), mat(0xc9a46a), 0, 0.04, 0, H).castShadow = false;
const sHut = new THREE.Group(); H.add(sHut); hut(sHut, 0, -2.2, R, 0);
for (let i = 0; i < 4; i++) noOut(mesh(new THREE.BoxGeometry(0.4, 0.3, 0.03), mat(0x8a6a3a), -0.8 + i * 0.5, 0.5 + (i % 2) * 0.8, -0.98, sHut));
const emptyPot = clayPot(H, 1.2, 0.3, 0.6, 0.55); emptyPot.rotation.z = 1.2;
roundTree(H, -3.6, -3, R, 1.0); roundTree(H, 3.8, -3.4, R, 0.9);
const newPal = palace(H, 0, -3.2, 1);
const sparks = []; for (let i = 0; i < 40; i++) sparks.push(noOut(mesh(new THREE.OctahedronGeometry(0.08, 0), glow(0xffd23a, 0.9), 0, 0, 0, scene)));
// the bundle of flattened rice: a cloth with rice on it, then tied
const cloth = new THREE.Group(); cloth.position.set(79.4, 0.55, 2.4); scene.add(cloth);
mesh(new THREE.BoxGeometry(0.8, 0.5, 0.6), mat(0x8a5a2a), 0, -0.3, 0, cloth);
const flat = mesh(new THREE.BoxGeometry(0.5, 0.01, 0.5), mat(0xc9b48a), 0, -0.04, 0, cloth);
const flakes = []; for (let i = 0; i < 18; i++) flakes.push(noOut(mesh(new THREE.BoxGeometry(0.035, 0.008, 0.025), mat(0xf6efe0), (R() - 0.5) * 0.18, -0.025, (R() - 0.5) * 0.18, cloth)));
const ball = mesh(new THREE.SphereGeometry(0.13, 10, 8), mat(0xc9b48a), 0, 0.06, 0, cloth);

// ---------------- the cast
const C = makeCast(scene, [['k', 'krishna'], ['sud', 'sudama'], ['wife', 'sudamaWife'], ['c1', 'kid2'], ['c2', 'kid4'], ['g1', 'guard'], ['g2', 'guard'], ['kk', 'kidKrishna'], ['ks', 'kidSudama'], ['guru', 'devotee'],
  ['d1', 'kid3'], ['d2', 'gopi1'], ['d3', 'crowd'], ['priest', 'priest'], ['picture', 'krishna'], ['q1', 'courtier'], ['q2', 'rukmini']]);
addOutlines(scene); newPal.scale.setScalar(0.001);
const confetti = makeConfetti(scene, 70, 25);

function update(s, t) {
  const cx = camera.position.x, set = cx > 60 ? 80 : cx > 20 ? 40 : cx < -20 ? -40 : 0;
  const night = set === 80 && s < E.but3 ? 0.55 : 0;
  S.mood(night); if (set === 40) S.hemi.intensity = 1.3;
  S.sun.target.position.set(set, 0, 0); S.sun.position.set(set - 8, 14, 10); S.sun.target.updateMatrixWorld();
  const right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0); right.y = 0; right.normalize();
  const handOf = (p, h = 1.7, offer = true) => p.clone().add(right.clone().multiplyScalar((offer ? 0.32 : 0.246) * h / 1.7)).add(V(0, (offer ? 0.84 : 0.5) * h / 1.7, 0.05));
  // --- temple today: three devotees and their small gifts; a child places a banana, the altar glows
  const place = sm(seg(s, E.it, E.it + 1.4)), D1 = V(lerp(39.0, 39.7, place), 0, lerp(0.6, -1.2, place));
  pose(C.d1, camera, { x: D1.x, z: D1.z, h: 1.25, mood: s >= E.love - 0.3 ? 'happy' : 'normal', arm: 'offer', step: place > 0 && place < 1 ? s * 3 : 0 });
  pose(C.d2, camera, { x: 40.3, z: 0.9, h: 1.6, mood: 'closed', arm: 'offer' });
  pose(C.d3, camera, { x: 41.4, z: 0.7, h: 1.7, mood: 'happy', arm: 'offer' });
  pose(C.picture, camera, { x: 40, y: 1.25, z: -2.78, h: 1.85, mood: 'happy' }); C.picture.m.quaternion.identity();
  pose(C.priest, camera, { x: 42.4, z: -1.2, h: 1.7, mood: 'happy', arm: 'down', flip: true });
  if (place < 1) banana.position.copy(handOf(D1, 1.25)); else banana.position.set(39.85, 1.02, -1.75);
  banana.rotation.set(0, 0, 0.3); flower.position.copy(handOf(V(40.3, 0, 0.9), 1.6)); spoon.position.copy(handOf(V(41.4, 0, 0.7), 1.7));
  altarGlow.material.opacity = sm(seg(s, E.love - 0.4, E.love + 0.4)) * 0.3 * (1 + 0.1 * Math.sin(t * 4)); altarGlow.position.y = 1.4;
  tl.forEach((l, i) => (l.flame.scale.y = 1 + 0.15 * Math.sin(t * 13 + i)));
  // --- the gurukul: two boys laughing over a lesson
  pose(C.kk, camera, { x: -40.55, z: 0.55, h: 1.2, sitting: true, mood: Math.sin(t * 3) > 0 ? 'happy' : 'wink' });
  pose(C.ks, camera, { x: -39.45, z: 0.55, h: 1.2, sitting: true, mood: 'happy' });
  pose(C.guru, camera, { x: -40, z: -1.0, h: 1.6, sitting: true, mood: 'closed', arm: 'up' });
  // --- Sudama's hut: hungry children, the wife, the bundle; Sudama walks to Dwarka and back
  const tieK = sm(seg(s, E.handful, E.handful + 1.4)), tied = sm(seg(s, E.at2 - 1.0, E.at2 - 0.4));
  flat.visible = tied < 0.5; flakes.forEach((f, i) => { f.visible = tied < 0.5 && i < tieK * flakes.length; }); ball.visible = tied >= 0.5 && s < E.at2 - 0.2; ball.scale.setScalar(sm(tied));
  const kidsSad = s < E.but3 + 0.8;
  pose(C.c1, camera, { x: 81.1, z: 0.5, h: 1.05, sitting: true, mood: kidsSad ? 'sad' : 'happy', arm: kidsSad ? 'down' : 'wave' });
  pose(C.c2, camera, { x: 81.8, z: 0.2, h: 1.0, sitting: true, mood: kidsSad ? 'closed' : 'happy', arm: kidsSad ? 'down' : 'wave' });
  pose(C.wife, camera, { x: 79.0, z: 0.8, h: 1.6, mood: s >= E.palace2 ? 'happy' : s >= E.wife && s < E.but ? 'normal' : 'sad', arm: s >= E.palace2 ? 'wave' : s >= E.wife + 0.4 && s < E.but ? 'point' : s >= E.so2 && s < E.at2 ? 'offer' : 'down' });
  // Sudama: at home -> at the gates (Dwarka) -> walking home -> at the new palace
  let sp, sps = {};
  if (s < E.at2) { sp = V(80.2, 0, 1.6); sps = { mood: s >= E.but && s < E.handful ? 'sad' : 'normal', bundle: s >= E.at2 - 0.6 }; }
  else if (s < E.wait) {
    const app = sm(seg(s, E.at2 - 0.2, E.guards + 0.3)); sp = V(0.4, 0, lerp(8.5, 4.6, app));
    sps = { mood: s >= E.hugged ? 'closed' : s >= E.guards ? 'sad' : 'normal', bundle: s < E.grabbed + 0.1, step: app > 0 && app < 1 ? s * 3 : 0 };
    if (s >= E.sudama4 && s < E.grabbed) sps.mood = 'sad';
    if (s >= E.grabbed + 0.3) sps.mood = 'wow';
  } else if (s < E.he) { const w = seg(s, E.wait, E.he); sp = V(0.4, 0, lerp(4.6, 9.5, w)); sps = { mood: 'happy', step: s * 3 }; }
  else { const w = sm(seg(s, E.he, E.but3 + 0.2)); sp = V(80.2, 0, lerp(8.5, 3.4, w)); sps = { mood: s >= E.palace2 - 0.6 ? 'wow' : 'happy', step: w < 1 ? s * 3 : 0, arm: s >= E.palace2 + 0.3 ? 'up' : 'down' }; }
  pose(C.sud, camera, { x: sp.x, z: sp.z, h: 1.62, ...sps });
  // the hut sinks and a palace rises with a shower of gold
  const rise = sm(seg(s, E.but3 + 0.3, E.palace2 + 0.2));
  sHut.position.y = -rise * 3.4; sHut.visible = rise < 0.99; newPal.scale.setScalar(Math.max(0.001, rise * 0.42));
  sparks.forEach((m, i) => { const u = s - E.but3 - 0.3 - (i % 10) * 0.08; m.visible = u > 0 && u < 2.2; const a = i * 2.4; m.position.set(80 + Math.cos(a) * (1.2 + (i % 5) * 0.6), 0.3 + u * (1.5 + (i % 4) * 0.5), -3 + Math.sin(a) * 1.2); m.rotation.y = t * 4; });
  // --- Dwarka: guards laugh; Krishna runs out barefoot, hugs him, eats the rice like a feast
  const laugh = s >= E.guards && s < E.but2 + 0.4;
  pose(C.g1, camera, { x: -1.6, z: 3.7, h: 1.75, mood: laugh ? 'happy' : s >= E.running ? 'wow' : 'normal', arm: laugh ? 'point' : 'down', flip: false });
  pose(C.g2, camera, { x: 2.0, z: 3.8, h: 1.75, mood: laugh ? 'happy' : s >= E.running ? 'wow' : 'normal', flip: true, arm: laugh ? 'point' : 'down' });
  const run = sm(seg(s, E.running - 0.3, E.hugged - 0.1));
  let kp = V(0, 0, lerp(-6.2, 3.95, run)), kps = { mood: s >= E.running ? 'happy' : 'normal', step: run > 0 && run < 1 ? s * 4.5 : 0 };
  if (s >= E.hugged - 0.1 && s < E.wait) { kp = V(-0.05, 0, 4.25); kps = { mood: s >= E.hugged && s < E.sudama4 ? 'closed' : 'happy', arm: s < E.sudama4 ? 'wave' : s >= E.grabbed && s < E.grabbed + 0.6 ? 'offer' : 'down', butter: s >= E.grabbed + 0.5, flip: true }; }
  if (s >= E.wait) { kp = V(0.2, 0, 3.6); kps = { mood: 'happy', arm: 'wave' }; }
  if (s < E.years - 0.3) kp = V(0, 0, -6.2);
  pose(C.k, camera, { x: kp.x, z: kp.z, h: 1.78, ...kps });
  pose(C.q1, camera, { x: -1.3, z: 0.6, h: 1.7, mood: s >= E.hugged ? 'wow' : 'normal' });
  pose(C.q2, camera, { x: 1.5, z: 0.4, h: 1.65, mood: s >= E.grabbed + 0.3 ? 'happy' : 'normal' });
  confetti(E.palace2 - 0.2, s, V(80, 3.2, -1));
  S.clouds.forEach((c, i) => { c.position.x = -80 + i * 15 + ((t * 0.6 + i * 3) % 12); });
}

const G = (t) => t, TODAY = (t) => E.it - 2 + t * 0.2;
const SHOTS = [
  [0, E.even - 0.05, TODAY, [[40, 2.0, 6.4], [40, 1.5, -1.2]], [[40, 1.9, 5.4], [40, 1.5, -1.2]]],
  [E.even - 0.05, E.flower - 0.05, TODAY, [[39.2, 1.0, 2.3], [39.1, 0.9, 0.6]], [[39.2, 1.0, 2.05], [39.1, 0.9, 0.6]]],
  [E.flower - 0.05, E.spoon - 0.05, TODAY, [[40.5, 1.55, 2.6], [40.4, 1.4, 0.9]], [[40.5, 1.55, 2.35], [40.4, 1.4, 0.9]]],
  [E.spoon - 0.05, E.as - 0.05, TODAY, [[41.6, 1.6, 2.5], [41.6, 1.45, 0.7]], [[41.6, 1.6, 2.25], [41.6, 1.45, 0.7]]],
  [E.as - 0.05, E.krishna - 0.05, G, [[-40, 3.4, 8.5], [-40, 1.4, -0.5]], [[-40, 2.6, 6.8], [-40, 1.2, -0.5]]],
  [E.krishna - 0.05, E.years - 0.05, G, [[-40, 1.2, 3.2], [-40, 0.8, 0.5]], [[-40, 1.15, 2.8], [-40, 0.8, 0.5]]],
  [E.years - 0.05, E.and - 0.05, G, [[0, 3.0, 17], [0, 3.5, -6]], [[0, 2.4, 14], [0, 3.0, -6]]],
  [E.and - 0.05, E.his - 0.05, G, [[80, 2.6, 9.5], [80, 1.2, -1]], [[80, 2.3, 8.3], [80, 1.2, -1]]],
  [E.his - 0.05, E.wife - 0.05, G, [[81.4, 1.0, 2.8], [81.4, 0.6, 0.3]], [[81.4, 1.0, 2.5], [81.4, 0.6, 0.3]]],
  [E.wife - 0.05, E.but - 0.05, G, [[79.6, 1.5, 4.4], [79.6, 1.2, 1.0]], [[79.6, 1.5, 4.0], [79.6, 1.2, 1.0]]],
  [E.but - 0.05, E.so2 - 0.05, G, [[80.3, 1.55, 3.6], [80.2, 1.4, 1.6]], [[80.3, 1.55, 3.3], [80.2, 1.4, 1.6]]],
  [E.so2 - 0.05, E.at2 - 0.05, G, [[79.45, 1.25, 3.5], [79.4, 0.55, 2.4]], [[79.45, 1.15, 3.2], [79.4, 0.55, 2.4]]],
  [E.at2 - 0.05, E.but2 - 0.05, G, [[0.6, 1.7, 11.2], [0.2, 1.7, 3.0]], [[0.6, 1.7, 10.2], [0.2, 1.7, 3.0]]],
  [E.but2 - 0.05, E.hugged + 0.3, G, [[1.9, 1.7, 9.4], [0, 1.1, 1.0]], [[1.7, 1.7, 8.8], [0, 1.1, 1.5]]],
  [E.hugged + 0.3, E.sudama4 - 0.05, G, [[0.2, 1.55, 7.0], [0.15, 1.3, 4.3]], [[0.2, 1.55, 6.6], [0.15, 1.3, 4.3]]],
  [E.sudama4 - 0.05, E.grabbed - 0.05, G, [[0.85, 1.3, 6.2], [0.45, 1.05, 4.6]], [[0.85, 1.3, 6.0], [0.45, 1.05, 4.6]]],
  [E.grabbed - 0.05, E.wait - 0.05, G, [[-0.4, 1.6, 7.2], [0.15, 1.3, 4.2]], [[-0.3, 1.6, 6.7], [0.15, 1.3, 4.2]]],
  [E.wait - 0.05, E.not - 0.05, G, [[0.3, 1.6, 12.5], [0.3, 1.3, 4]], [[0.3, 1.6, 11.8], [0.3, 1.3, 4]]],
  [E.not - 0.05, E.he - 0.05, G, [[0.6, 1.6, 11.8], [0.4, 1.35, 8.5]], [[0.6, 1.6, 11.5], [0.4, 1.35, 8.8]]],
  [E.he - 0.05, E.but3 - 0.05, G, [[80.6, 1.6, 12.5], [80.2, 1.4, 6.5]], [[80.5, 1.6, 11.6], [80.2, 1.4, 5.5]]],
  [E.but3 - 0.05, E.thats - 0.05, G, [[80.6, 1.6, 8.6], [80, 2.4, -2.5]], [[80.5, 1.8, 9.6], [80, 2.8, -2.5]]],
  [E.thats - 0.05, E.it - 0.05, G, [[40, 2.2, 6.6], [40, 1.5, -1.2]], [[40, 2.1, 5.6], [40, 1.5, -1.2]]],
  [E.it - 0.05, E.send - 0.05, G, [[39.0, 1.25, 1.6], [39.85, 1.0, -1.8]], [[39.15, 1.25, 1.2], [39.85, 1.0, -1.8]]],
  [E.send - 0.05, DURATION + 0.1, (t) => E.hugged + 0.4 + (t - E.send) * 0.3, [[0.2, 1.9, 9.0], [0.15, 1.4, 4.2]], [[0.2, 1.8, 8.2], [0.15, 1.4, 4.2]]],
];
direct({ stage, WORDS, DURATION, shots: SHOTS, update, title: E.even - 0.05, q: [E.wait, E.not], cta: E.comment,
  key: ['temple', 'empty-handed', 'banana', 'flower', 'sugar', 'story', 'friend', 'school', 'sudama', 'king', 'dwarka', 'poor', 'hungry', 'nothing', 'handful', 'flattened', 'rice', 'cloth', 'palace', 'guards', 'laughed', 'running', 'barefoot', 'hugged', 'shy', 'tiny', 'gift', 'grabbed', 'feast', 'wait', 'help', 'word', 'home', 'hut', 'love', 'oldest', 'comment'],
  loc: (t) => (t >= E.as - 0.05 && t < E.years - 0.05 ? '📍 GURUKUL · LONG AGO' : t >= E.years - 0.05 && t < E.and - 0.05 ? '📍 DWARKA · YEARS LATER' : t >= E.thats - 0.05 && t < E.it ? 'EVEN TODAY' : ''),
  shakes: [], tick: () => {} });
