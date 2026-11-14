// Day 35 · "Why light lamps before Diwali?" · Why we do what we do #17 (as the story goes: Satyabhama defeats Narakasura)
// Sets: Naraka's dark fortress (origin) with the stolen earrings and the princesses' cage; the sky (Garuda flies in from -x);
// a town at night that lights lamps (x = 40), also used for "even today".
import * as THREE from './three.module.js';
import { rng, mat, mesh, sm, seg, lerp, clamp, setupScene, makeCast, pose, hut, roundTree } from './kit.js';
import { makeStage, direct, wordTime } from './director.js';
import { addOutlines, makeConfetti } from './plus.js';
import { WORDS, DURATION } from './data.js';

const stage = makeStage(), { scene, camera } = stage, V = (x, y, z) => new THREE.Vector3(x, y, z), R = rng(35);
const S = setupScene(scene, [[0, 0], [40, 0]], 35);
const WT = wordTime(WORDS);
const E = { as: WT('as'), a: WT('demon') - 0.14, stole: WT('stole'), and: WT('and'), krishna: WT('krishna'), and2: WT('next') - 0.16, the: WT('battle') - 0.22, krishna2: WT('krishna', 2), wait: WT('wait'),
  satyabhama2: WT('satyabhama', 2), she: WT('she'), and4: WT('one') - 0.38, narakasura2: WT('narakasura', 2), the5: WT('princesses', 2) - 0.14, and5: WT('people') - 0.38, thats: WT("that's"), light2: WT('light', 2), comment: WT('comment') };
const glow = (c, o = 0.5) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, depthWrite: false, blending: THREE.AdditiveBlending });
const noOut = (m) => { m.userData.noOutline = true; m.castShadow = false; return m; };

// ---------------- Naraka's fortress
mesh(new THREE.CylinderGeometry(14, 14, 0.06, 28), mat(0x5a4a4a), 0, 0.03, -2, scene).castShadow = false;
const darkM = mat(0x3a2a34); mesh(new THREE.BoxGeometry(12, 5, 1), darkM, 0, 2.5, -6, scene);
for (const x of [-5, -1.8, 1.8, 5]) { mesh(new THREE.CylinderGeometry(0.9, 1.1, 7, 6), darkM, x, 3.5, -5.6, scene); mesh(new THREE.ConeGeometry(1.0, 1.8, 6), mat(0x8a1a2a), x, 7.9, -5.6, scene); }
for (let i = 0; i < 12; i++) mesh(new THREE.ConeGeometry(0.15, 0.7, 4), mat(0x2a1a24), -5.5 + i, 5.3, -5.5, scene);
mesh(new THREE.BoxGeometry(4, 0.3, 2), darkM, 2.4, 0.15, -1.4, scene); mesh(new THREE.BoxGeometry(3, 0.3, 1.6), darkM, 2.4, 0.45, -1.6, scene);
// the stolen earrings on a pedestal
mesh(new THREE.CylinderGeometry(0.3, 0.4, 1.0, 8), darkM, 4.2, 0.5, -0.8, scene);
const rings = [-0.14, 0.14].map((dx) => mesh(new THREE.TorusGeometry(0.12, 0.035, 8, 20), mat(0xffd23a, { m: 0.8, r: 0.25 }), 4.2 + dx, 1.2, -0.8, scene)); const ringGlow = noOut(mesh(new THREE.SphereGeometry(0.4, 12, 8), glow(0xffd23a, 0.3), 4.2, 1.2, -0.8, scene));
// the cage of princesses
const cage = new THREE.Group(); cage.position.set(-4.0, 0, -2.6); scene.add(cage);
mesh(new THREE.BoxGeometry(3.6, 0.15, 1.6), mat(0x2a2a30), 0, 0.08, 0, cage); mesh(new THREE.BoxGeometry(3.6, 0.15, 1.6), mat(0x2a2a30), 0, 2.4, 0, cage);
const bars = new THREE.Group(); cage.add(bars); for (let i = 0; i < 12; i++) mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.3, 6), mat(0x6a6a74, { m: 0.6, r: 0.4 }), -1.7 + i * 0.31, 1.24, 0.78, bars);
// arrows (streaks) in the battle, and Satyabhama's one golden arrow
const streaks = []; for (let i = 0; i < 6; i++) streaks.push(noOut(mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.0, 4).rotateZ(Math.PI / 2), glow(i % 2 ? 0xff5a3a : 0x9fd4ff, 0.9), 0, 0, 0, scene)));
const goldArrow = new THREE.Group(); scene.add(goldArrow); noOut(mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.2, 6).rotateZ(Math.PI / 2), glow(0xffd23a, 1), 0, 0, 0, goldArrow)); noOut(mesh(new THREE.ConeGeometry(0.09, 0.22, 6).rotateZ(-Math.PI / 2), glow(0xffffff, 1), 0.7, 0, 0, goldArrow));
const trail = noOut(mesh(new THREE.CylinderGeometry(0.06, 0.01, 1, 6).rotateZ(Math.PI / 2), glow(0xffd23a, 0.5), 0, 0, 0, scene));
const blast = noOut(mesh(new THREE.SphereGeometry(1, 16, 12), glow(0xffd23a, 0), 2.4, 1.6, -1.4, scene));
const smoke = []; for (let i = 0; i < 10; i++) smoke.push(noOut(mesh(new THREE.SphereGeometry(0.35, 8, 6), new THREE.MeshBasicMaterial({ color: 0x4a4048, transparent: true, opacity: 0.5, depthWrite: false }), 0, 0, 0, scene)));
// ---------------- Garuda, the great eagle, with Krishna and Satyabhama on his back
const garuda = new THREE.Group(); scene.add(garuda);
const gold = mat(0xe8a020, { r: 0.6 }), red = mat(0xc0213a), white = mat(0xffffff);
mesh(new THREE.SphereGeometry(0.75, 14, 10).scale(1.6, 0.8, 0.9), gold, 0, 0, 0, garuda);
const head = new THREE.Group(); head.position.set(1.25, 0.45, 0); garuda.add(head); mesh(new THREE.SphereGeometry(0.42, 12, 8), white, 0, 0, 0, head); mesh(new THREE.ConeGeometry(0.16, 0.5, 6).rotateZ(-Math.PI / 2), mat(0xffd23a), 0.5, -0.05, 0, head);
for (const z of [-0.18, 0.18]) { mesh(new THREE.SphereGeometry(0.08, 8, 6), white, 0.28, 0.1, z * 1.6, head); mesh(new THREE.SphereGeometry(0.045, 6, 4), mat(0x1d1a24), 0.33, 0.1, z * 1.75, head); }
mesh(new THREE.CylinderGeometry(0.28, 0.32, 0.25, 8), mat(0xffd23a, { m: 0.6, r: 0.3 }), 0, 0.35, 0, head);
const wings = [-1, 1].map((sd) => { const w = new THREE.Group(); w.position.set(0, 0.2, sd * 0.6); garuda.add(w); const f = mesh(new THREE.BoxGeometry(1.4, 0.08, 2.4).translate(0, 0, sd * 1.2), red, 0, 0, 0, w); for (let i = 0; i < 4; i++) mesh(new THREE.BoxGeometry(0.3, 0.06, 0.9).translate(0, 0, sd * 0.45), gold, -0.5 + i * 0.32, 0, sd * 2.2, w); return w; });
mesh(new THREE.ConeGeometry(0.5, 1.1, 6).rotateZ(Math.PI / 2), red, -1.5, 0, 0, garuda);
noOut(mesh(new THREE.BoxGeometry(1.2, 0.1, 0.9), mat(0xd8263a), -0.05, 0.62, 0, garuda));
// ---------------- the town at night (x = 40): houses, a street of lamps that light up one by one
const T = new THREE.Group(); T.position.set(40, 0, 0); scene.add(T);
mesh(new THREE.BoxGeometry(18, 0.06, 14), mat(0xb89a6a), 0, 0.03, 0, T).castShadow = false;
[[-4.5, -3, 0.2], [0, -3.6, 0], [4.5, -3, -0.2], [-6.5, 1.5, 1.2], [6.5, 1.5, -1.2]].forEach(([x, z, r]) => hut(T, x, z, R, r)); roundTree(T, -2.4, -5.5, R, 0.9); roundTree(T, 2.6, -5.8, R, 0.9);
const DIYA = []; for (let i = 0; i < 28; i++) { const row = i % 2, k = Math.floor(i / 2); const g = new THREE.Group(); g.position.set(-6 + k * 0.92, 0.06, row ? 1.0 : -1.2); T.add(g); mesh(new THREE.CylinderGeometry(0.13, 0.08, 0.08, 10), mat(0xc8643a), 0, 0.04, 0, g); const f = noOut(mesh(new THREE.ConeGeometry(0.045, 0.16, 6), new THREE.MeshBasicMaterial({ color: 0xffc23a }), 0, 0.16, 0, g)); const h = noOut(mesh(new THREE.SphereGeometry(0.22, 10, 8), glow(0xffa040, 0.35), 0, 0.18, 0, g)); DIYA.push({ g, f, h, k }); }
const townL = [-4, 0, 4].map((x) => { const l = new THREE.PointLight(0xffa64a, 0, 9, 1.4); l.position.set(40 + x, 1.2, 0); scene.add(l); return l; });
const rangoli = new THREE.Group(); rangoli.position.set(40, 0.07, 2.6); scene.add(rangoli); [0xe0213a, 0xffd23a, 0x2f9d5a, 0x3f8fe0, 0xff8a1e].forEach((c, i) => noOut(mesh(new THREE.CylinderGeometry(1.0 - i * 0.18, 1.0 - i * 0.18, 0.01 + i * 0.002, i % 2 ? 8 : 16), mat(c), 0, i * 0.003, 0, rangoli)));
const heldDiya = new THREE.Group(); scene.add(heldDiya); mesh(new THREE.CylinderGeometry(0.11, 0.07, 0.07, 10), mat(0xc8643a), 0, 0, 0, heldDiya); noOut(mesh(new THREE.ConeGeometry(0.035, 0.12, 6), new THREE.MeshBasicMaterial({ color: 0xffc23a }), 0, 0.1, 0, heldDiya));
// ---------------- the cast
const C = makeCast(scene, [['k', 'krishna'], ['sat', 'satyabhama'], ['nar', 'naraka'], ['p1', 'gopi1'], ['p2', 'gopi2'], ['p3', 'gopi3'], ['p4', 'rukmini'], ['t1', 'kid3'], ['t2', 'gopi1'], ['t3', 'kid1']]);
addOutlines(scene);
const confetti = makeConfetti(scene, 70, 35);

function update(s, t) {
  const cx = camera.position.x, town = cx > 20;
  S.mood(town ? 0.9 : 0.75); S.hemi.intensity = town ? 0.75 : 0.9; S.sun.target.position.set(town ? 40 : 0, 0, 0); S.sun.position.set((town ? 40 : 0) - 8, 14, 10); S.sun.target.updateMatrixWorld();
  rings.forEach((r, i) => (r.rotation.y = t * 1.5 + i)); ringGlow.material.opacity = 0.25 + 0.1 * Math.sin(t * 3);
  // Garuda flies in, hovers through the battle
  const fly = sm(seg(s, E.krishna - 0.2, E.the + 0.4));
  const away = sm(seg(s, E.narakasura2 + 0.8, E.the5 + 0.4)); const gp = V(lerp(-18, -2.6, fly) - away * 3, lerp(7, 2.4, fly) + Math.sin(t * 2.2) * 0.12 + away * 4.5, lerp(6, 1.0, fly) - away * 3);
  garuda.visible = s >= E.krishna - 0.4; garuda.position.copy(gp); garuda.rotation.set(0, 0, lerp(-0.25, 0, fly));
  wings.forEach((w, i) => (w.rotation.x = (i ? -1 : 1) * Math.sin(t * (fly < 1 ? 7 : 4)) * 0.5));
  // Krishna and Satyabhama ride on his back; Krishna falls wounded; she stands and shoots
  const hurt = s >= E.krishna2 && s < E.the5, standUp = sm(seg(s, E.she - 0.3, E.she + 0.3));
  const onG = s >= E.krishna - 0.4 && s < E.and5;
  pose(C.k, camera, { visible: onG || s < E.as, x: gp.x - 0.35, y: gp.y + 0.55, z: gp.z, h: 1.6, sitting: true, mood: hurt ? 'closed' : 'happy', arm: s >= E.and4 && hurt ? 'down' : 'down', flip: false });
  if (hurt) C.k.m.rotateZ(sm(seg(s, E.krishna2, E.krishna2 + 0.4)) * 0.55);
  pose(C.sat, camera, { visible: onG || s < E.as, x: gp.x + 0.35, y: gp.y + 0.55, z: gp.z + 0.05, h: 1.62, sitting: standUp < 0.5, bow: s >= E.and2, mood: s >= E.wait && s < E.satyabhama2 ? 'wow' : s >= E.she ? 'smug' : 'happy', arm: s >= E.she && s < E.narakasura2 ? 'up' : 'down' });
  // Narakasura: proud, then struck by the golden arrow
  const fall = sm(seg(s, E.narakasura2, E.narakasura2 + 0.8));
  pose(C.nar, camera, { visible: !town && fall < 0.98, x: 2.4, y: 0.6, z: -1.5, h: 2.25 * (1 - fall * 0.3), mood: s >= E.and4 + 0.6 ? 'wow' : 'smug', arm: s >= E.stole && s < E.and ? 'offer' : 'hips' });
  if (fall > 0) C.nar.m.rotateZ(-fall * 1.4);
  smoke.forEach((m, i) => { const u = s - E.narakasura2 - 0.3 - (i % 5) * 0.08; m.visible = u > 0 && u < 2.4 && !town; m.position.set(2.4 + (i % 3 - 1) * 0.4, 0.8 + u * 1.4, -1.4 + (i % 2) * 0.3); m.scale.setScalar(0.6 + u); m.material.opacity = 0.5 * (1 - u / 2.4); });
  blast.material.opacity = Math.max(0, 1 - Math.abs(s - E.narakasura2 - 0.1) * 3) * 0.6; blast.scale.setScalar(0.5 + Math.max(0, s - E.narakasura2) * 2);
  // the battle: streaks fly both ways; one hits Krishna
  streaks.forEach((m, i) => { const u = ((s - E.the) * 1.3 + i * 0.29) % 1; m.visible = !town && s >= E.the && s < E.krishna2 + 0.5; const a = i % 2 ? V(2.2, 2.2, -1.4) : gp.clone(), b = i % 2 ? gp.clone().add(V(0.2, 0.6, 0)) : V(2.4, 2.0, -1.4); m.position.copy(a.clone().lerp(b, u)); m.lookAt(b); m.rotateY(-Math.PI / 2); });
  const shot = seg(s, E.and4 - 0.05, E.narakasura2), from = gp.clone().add(V(0.6, 1.4, 0)), to = V(2.4, 1.8, -1.4);
  goldArrow.visible = !town && shot > 0 && shot < 1; goldArrow.position.copy(from.clone().lerp(to, shot)); goldArrow.lookAt(to); goldArrow.rotateY(-Math.PI / 2);
  trail.visible = goldArrow.visible; { const mid = from.clone().lerp(goldArrow.position, 0.5); trail.position.copy(mid); trail.scale.set(from.distanceTo(goldArrow.position) || 0.01, 1, 1); trail.lookAt(goldArrow.position); trail.rotateY(-Math.PI / 2); }
  // the princesses: freed when the bars rise
  const free = sm(seg(s, E.the5, E.the5 + 0.8)), walk = sm(seg(s, E.the5 + 0.5, E.and5));
  bars.position.y = free * 2.4;
  [['p1', -5.2], ['p2', -4.4], ['p3', -3.6], ['p4', -2.8]].forEach(([n, x], i) => pose(C[n], camera, { visible: !town, x: x + walk * 1.2, z: -2.7 + walk * 2.6, h: 1.55, mood: free > 0.5 ? 'happy' : 'sad', arm: free > 0.5 && i % 2 ? 'wave' : 'down', step: walk > 0 && walk < 1 ? s * 3 + i : 0 }));
  // the town lights its lamps, one by one, all through the night; and still does today
  const lit = clamp((s - E.and5) / 2.2) * 14 + (s < E.as ? 14 : 0);
  DIYA.forEach(({ f, h, k }, i) => { const on = k < lit; f.visible = on; h.visible = on; f.scale.y = 1 + 0.2 * Math.sin(t * 13 + i); h.material.opacity = 0.3 + 0.08 * Math.sin(t * 7 + i); });
  townL.forEach((l, i) => (l.intensity = clamp(lit / 14 - i * 0.2) * 6));
  rangoli.visible = s >= E.thats || s < E.as;
  pose(C.t1, camera, { x: 40.8, z: 2.0, h: 1.15, mood: 'happy', arm: 'offer' });
  pose(C.t2, camera, { x: 39.0, z: 1.6, h: 1.6, mood: 'closed', arm: 'offer' });
  pose(C.t3, camera, { x: 41.9, z: 1.4, h: 1.15, mood: 'happy', arm: Math.sin(t * 4) > 0 ? 'up' : 'wave', y: Math.abs(Math.sin(t * 4)) * 0.06 });
  { const right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0); right.y = 0; right.normalize(); heldDiya.position.set(39.0, 0, 1.65).add(right.multiplyScalar(0.3)).add(V(0, 0.8, 0)); }
  confetti(E.light2, s, V(40.6, 3.0, 1.0));
  S.clouds.forEach((c, i) => { c.position.x = -80 + i * 15 + ((t * 0.6 + i * 3) % 12); });
}

const G = (t) => t;
const SHOTS = [
  [0, E.as - 0.05, G, [[40, 1.2, 5.6], [40, 0.4, 0]], [[40, 1.1, 4.8], [40, 0.4, 0]]],
  [E.as - 0.05, E.a - 0.05, G, [[0, 6, 16], [0, 3, -4]], [[0, 4.4, 13], [0, 2.6, -4]]],
  [E.a - 0.05, E.stole - 0.05, G, [[2.6, 2.6, 4.6], [2.4, 2.2, -1.5]], [[2.6, 2.5, 4.0], [2.4, 2.2, -1.5]]],
  [E.stole - 0.05, E.and - 0.05, G, [[4.6, 1.5, 1.6], [4.2, 1.2, -0.8]], [[4.5, 1.45, 1.3], [4.2, 1.2, -0.8]]],
  [E.and - 0.05, E.krishna - 0.05, G, [[-3.6, 1.8, 3.6], [-4.0, 1.2, -2.6]], [[-3.6, 1.7, 3.0], [-4.0, 1.2, -2.6]]],
  [E.krishna - 0.05, E.and2 - 0.05, G, [[-13.5, 7.6, 12.5], [-18, 7.2, 6]], [[-7.5, 6.0, 10.5], [-12, 5.6, 4]]],
  [E.and2 - 0.05, E.the - 0.05, G, [[-8.0, 6.4, 11.0], [-12, 5.6, 4]], [[-2.2, 5.4, 9.0], [-2.7, 3.2, 1]]],
  [E.the - 0.05, E.krishna2 - 0.05, G, [[0, 3.4, 9.5], [0, 2.0, -0.4]], [[0, 3.2, 8.8], [0, 2.0, -0.4]]],
  [E.krishna2 - 0.05, E.wait - 0.05, G, [[0.8, 4.0, 1.4], [-2.8, 3.4, 1.0]], [[0.6, 4.0, 1.3], [-2.8, 3.4, 1.0]]],
  [E.wait - 0.05, E.satyabhama2 - 0.05, G, [[-2.0, 3.4, 3.4], [-2.25, 3.2, 1.05]], [[-2.0, 3.4, 3.1], [-2.25, 3.2, 1.05]]],
  [E.satyabhama2 - 0.05, E.and4 - 0.05, G, [[-1.5, 3.3, 3.6], [-2.2, 3.3, 1.05]], [[-1.6, 3.3, 3.3], [-2.2, 3.3, 1.05]]],
  [E.and4 - 0.05, E.narakasura2 - 0.05, G, [[0, 3.0, 7.6], [0, 2.4, -0.4]], [[0.2, 3.0, 7.2], [0.2, 2.4, -0.4]]],
  [E.narakasura2 - 0.05, E.the5 - 0.05, G, [[3.4, 2.2, 5.0], [2.4, 1.4, -1.4]], [[3.2, 2.2, 4.6], [2.4, 1.2, -1.4]]],
  [E.the5 - 0.05, E.and5 - 0.05, G, [[-3.4, 1.8, 4.6], [-3.6, 1.2, -1.6]], [[-3.0, 1.8, 4.0], [-3.2, 1.2, -1.0]]],
  [E.and5 - 0.05, E.thats - 0.05, G, [[34.5, 2.6, 6.2], [40, 0.6, 0]], [[45.5, 2.6, 6.2], [40, 0.6, 0]]],
  [E.thats - 0.05, E.light2 - 0.05, G, [[40.2, 1.6, 6.0], [40.4, 0.9, 1.0]], [[40.2, 1.5, 5.2], [40.4, 0.9, 1.0]]],
  [E.light2 - 0.05, E.comment - 0.05, G, [[40.0, 1.0, 3.6], [40.0, 0.3, 0.6]], [[40.0, 1.0, 3.3], [40.0, 0.3, 0.6]]],
  [E.comment - 0.05, DURATION + 0.1, G, [[40.4, 2.0, 7.0], [40.4, 1.0, 0.8]], [[40.4, 2.0, 6.6], [40.4, 1.0, 0.8]]],
];
direct({ stage, WORDS, DURATION, shots: SHOTS, update, title: E.as - 0.05, q: [E.wait, E.satyabhama2], cta: E.comment,
  key: ['lamps', 'diwali', 'story', 'demon', 'narakasura', 'earrings', 'gods', '16,000', 'princesses', 'krishna', 'garuda', 'bow', 'queen', 'satyabhama', 'fierce', 'wounded', 'wait', 'saved', 'arrow', 'fell', 'free', 'night', 'naraka', 'chaturdashi', 'light', 'darkness', 'comment', 'fought'],
  loc: (t) => (t >= E.as - 0.05 && t < E.a - 0.05 ? '📍 NARAKA’S FORTRESS' : t >= E.and5 - 0.05 && t < E.thats - 0.05 ? 'ALL THROUGH THE NIGHT' : t >= E.thats - 0.05 && t < E.comment ? 'EVEN TODAY' : ''), shakes: [E.narakasura2], tick: () => {} });
