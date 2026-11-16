// Day 51 · "Why does Vitthal stand on a brick?" · Why we do what we do #33 (as the story goes: Pundalik)
// Strategy 10: mid-action hook + lock-in line, re-hook "But…", "Wait…?" re-hook, payoff late, loop back to the hook frame.
// Sets: Pundalik's open-front home with the brick outside the door (origin), Pandharpur temple today (x = 40).
import * as THREE from './three.module.js';
import { rng, mat, mesh, sm, seg, lerp, clamp, setupScene, makeCast, pose, lamp, roundTree } from './kit.js';
import { makeStage, direct, wordTime } from './director.js';
import { addOutlines, makeConfetti } from './plus.js';
import { WORDS, DURATION } from './data.js';

const stage = makeStage(), { scene, camera } = stage, V = (x, y, z) => new THREE.Vector3(x, y, z), R = rng(51);
const S = setupScene(scene, [[0, 0], [40, 0]], 51);
const WT = wordTime(WORDS);
const E = { stay: WT('stay'), as: WT('as'), served: WT('served'), washing: WT('washing'), feeding: WT('feeding'), but: WT('but'), knocked: WT('knocked'), pun2: WT('pundalik', 2), threw: WT('threw'), stand: WT('stand'),
  wait: WT('wait', 2), k2: WT('krishna', 2), smiled: WT('smiled'), hips: WT('hips'), never2: WT('never', 2), thats: WT("that's"), serving: WT('serving'), comment: WT('comment') };
const glow = (c, o = 0.5) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, depthWrite: false, blending: THREE.AdditiveBlending });
const noOut = (m) => { m.userData.noOutline = true; m.castShadow = false; return m; };

// ---------------- Pundalik's home (origin): open front so we see inside; a door in the front fence; the brick outside
mesh(new THREE.CylinderGeometry(14, 14, 0.06, 28), mat(0x7ac84a), 0, 0.0, 0, scene).castShadow = false;
mesh(new THREE.BoxGeometry(7, 0.12, 5), mat(0xd9b88a), 0, 0.06, -0.6, scene).castShadow = false;
mesh(new THREE.BoxGeometry(7, 3.2, 0.25), mat(0xe8c890), 0, 1.6, -3.1, scene); for (const x of [-3.5, 3.5]) mesh(new THREE.BoxGeometry(0.25, 3.2, 5), mat(0xe0bc84), x, 1.6, -0.6, scene);
const roof = mesh(new THREE.BoxGeometry(7.8, 0.25, 5.8), mat(0x9a6a3a), 0, 3.3, -0.6, scene);
mesh(new THREE.BoxGeometry(2.4, 0.04, 1.4), mat(0xc8463a), -0.4, 0.13, -1.2, scene).castShadow = false;
for (const x of [-3.0, 3.0]) mesh(new THREE.BoxGeometry(0.6, 0.6, 0.12), mat(0x8a5a2a), x, 0.45, 2.1, scene);
for (let i = 0; i < 9; i++) { const x = -3.4 + i * 0.5; if (x > 1.4 && x < 3.0) continue; mesh(new THREE.BoxGeometry(0.1, 0.8, 0.1), mat(0x8a5a2a), x, 0.4, 2.1, scene); }
mesh(new THREE.BoxGeometry(4.4, 0.08, 0.08), mat(0x8a5a2a), -1.2, 0.75, 2.1, scene);
for (const x of [1.5, 2.9]) mesh(new THREE.BoxGeometry(0.16, 2.4, 0.16), mat(0x6a4020), x, 1.2, 2.1, scene); mesh(new THREE.BoxGeometry(1.7, 0.2, 0.2), mat(0x6a4020), 2.2, 2.45, 2.1, scene);
const door = new THREE.Group(); door.position.set(1.58, 0, 2.1); scene.add(door); mesh(new THREE.BoxGeometry(1.24, 2.2, 0.08).translate(0.62, 1.1, 0), mat(0x8a5a2a), 0, 0, 0, door);
const hl = [lamp(scene, -2.6, 0.12, -2.4, 0.8), lamp(scene, 2.4, 0.12, -2.4, 0.8)];
const footBowl = noOut(mesh(new THREE.CylinderGeometry(0.22, 0.16, 0.12, 12), mat(0xc9a227, { m: 0.5, r: 0.4 }), -1.15, 0.2, -0.3, scene));
const plate = noOut(mesh(new THREE.CylinderGeometry(0.2, 0.18, 0.03, 12), mat(0xd0d0d8, { m: 0.6, r: 0.3 }), 0, 0, 0, scene));
const brick = noOut(mesh(new THREE.BoxGeometry(0.62, 0.15, 0.36), mat(0xb8502a), 0, 0, 0, scene)); brick.castShadow = true;
for (let i = 0; i < 6; i++) roundTree(scene, (i % 2 ? 1 : -1) * (6 + (i % 3)), -8 + i * 1.6, R, 1.1);
const moon = noOut(mesh(new THREE.SphereGeometry(0.9, 16, 12), new THREE.MeshBasicMaterial({ color: 0xfff6dc, fog: false }), 0, 0, 0, scene));
const sunBall = noOut(mesh(new THREE.SphereGeometry(1.1, 16, 12), new THREE.MeshBasicMaterial({ color: 0xffd060, fog: false }), 0, 0, 0, scene));
const knock = noOut(mesh(new THREE.RingGeometry(0.2, 0.32, 24), glow(0xfff0c0, 0), 0, 0, 0, scene));
const halo = noOut(mesh(new THREE.RingGeometry(0.4, 0.46, 32), glow(0xffe08a, 0.0), 0, 0, 0, scene));
// ---------------- Pandharpur today (x = 40): Vitthal on a brick, warkaris with saffron flags
const T = new THREE.Group(); T.position.set(40, 0, 0); scene.add(T);
mesh(new THREE.BoxGeometry(14, 0.1, 12), mat(0xf3e6c8), 0, 0.05, 0, T).castShadow = false; mesh(new THREE.BoxGeometry(14, 8, 0.3), mat(0xe8a040), 0, 4, -3.2, T);
mesh(new THREE.BoxGeometry(2.4, 1.0, 1.2), mat(0x8a4b20), 0, 0.5, -2.3, T); mesh(new THREE.BoxGeometry(2.5, 0.08, 1.3), mat(0xffd23a), 0, 1.02, -2.3, T);
noOut(mesh(new THREE.BoxGeometry(0.62, 0.15, 0.36), mat(0xb8502a), 0, 1.13, -2.3, T));
for (let i = 0; i < 24; i++) { const a = i / 23 * Math.PI; noOut(mesh(new THREE.SphereGeometry(0.1, 6, 4), mat([0xffd23a, 0xffffff, 0xf06aa0][i % 3]), Math.cos(a) * 1.3, 1.9 + Math.sin(a) * 1.6, -2.6, T)); }
const tl = [lamp(T, -1.0, 1.06, -1.9, 0.6), lamp(T, 1.0, 1.06, -1.9, 0.6)];
const flags = []; for (let i = 0; i < 4; i++) { const g = new THREE.Group(); scene.add(g); mesh(new THREE.CylinderGeometry(0.03, 0.03, 2.4, 6), mat(0x8a5a2a), 0, 1.2, 0, g); const f = noOut(mesh(new THREE.PlaneGeometry(0.6, 0.4, 6, 1).translate(0.3, 0, 0), new THREE.MeshStandardMaterial({ color: 0xf08a1a, side: THREE.DoubleSide, flatShading: true }), 0.03, 2.2, 0, g)); flags.push({ g, f, b: f.geometry.attributes.position.array.slice() }); }
// ---------------- the cast
const C = makeCast(scene, [['k', 'krishna'], ['pu', 'pundalik'], ['fa', 'oldFather'], ['mo', 'oldMother'], ['vi', 'krishna'], ['w1', 'devotee'], ['w2', 'gopi1'], ['w3', 'govinda'], ['w4', 'gopi2']]);
C.vi.spec = Object.assign({}, C.vi.spec, { skin: '#34406a' });
addOutlines(scene);
const confetti = makeConfetti(scene, 50, 51);
const right = new THREE.Vector3();
const BRICK = V(2.2, 0.075, 3.4);

function update(s, t) {
  const cx = camera.position.x, set = cx > 20 ? 40 : 0, hook = s < E.as, ending = s >= E.comment;
  const lapse = hook || (s >= E.never2 && s < E.thats) || ending;
  // time-lapse: day and night racing past the waiting God; otherwise evening, then night for the knock
  const cyc = (s * (s < E.stay ? 0.9 : 0.5)) % 1, dayAmt = 0.5 + 0.5 * Math.cos(cyc * Math.PI * 2);
  const night = set === 0 ? (lapse ? 0.85 * (1 - dayAmt) : s >= E.but - 0.3 ? 0.78 : 0.2) : 0;
  S.mood(night); S.hemi.intensity = 1.35 - night * 0.5; S.sun.target.position.set(set, 0, 0); S.sun.position.set(set - 8, 14, 10); S.sun.target.updateMatrixWorld();
  const arc = cyc * Math.PI * 2; moon.visible = sunBall.visible = set === 0 && lapse;
  sunBall.position.set(2.2 + Math.cos(arc) * 12, 1 + Math.sin(arc) * 9, 26); moon.position.set(2.2 - Math.cos(arc) * 12, 1 - Math.sin(arc) * 9, 26);
  right.setFromMatrixColumn(camera.matrixWorld, 0); right.y = 0; right.normalize();
  hl.forEach((l, i) => (l.flame.scale.y = 1 + 0.15 * Math.sin(t * 11 + i)));
  // --- the parents on the mat, Pundalik at their feet
  pose(C.fa, camera, { visible: set === 0, x: -1.0, z: -1.2, h: 1.55, sitting: true, mood: s >= E.washing && !lapse ? 'happy' : 'closed', arm: 'down' });
  pose(C.mo, camera, { visible: set === 0, x: 0.3, z: -1.25, h: 1.5, sitting: true, mood: s >= E.feeding && s < E.but ? 'happy' : 'closed', arm: 'down' });
  const feeding = s >= E.feeding && s < E.but;
  const pux = feeding ? -0.1 : -0.45;
  pose(C.pu, camera, { visible: set === 0, x: pux, z: -0.35, h: 1.5, sitting: true, mood: s >= E.k2 ? 'happy' : 'closed', arm: s >= E.threw - 0.2 && s < E.threw + 0.5 ? 'up' : feeding ? 'offer' : 'offer', flip: !feeding });
  footBowl.visible = set === 0 && s >= E.washing && s < E.feeding;
  plate.visible = set === 0 && feeding; plate.position.set(pux, 0.95, -0.25).add(right.clone().multiplyScalar(0.42));
  // --- Krishna: on the brick (hook, and after He smiles), at the door before
  const onBrick = hook || s >= E.hips - 0.3, atDoor = s >= E.but + 0.5;
  const kp = onBrick ? BRICK.clone().add(V(0, 0.075, 0)) : V(2.2, 0, 2.75);
  pose(C.k, camera, { visible: set === 0 && (onBrick || atDoor), x: kp.x, y: kp.y, z: kp.z, h: 1.72, mood: s >= E.stand && s < E.smiled ? 'wow' : 'happy', arm: onBrick ? 'hips' : s >= E.knocked - 0.3 && s < E.knocked + 0.6 ? 'point' : 'down' });
  halo.visible = set === 0 && onBrick; halo.position.copy(kp).add(V(0, 1.42, -0.06)); halo.quaternion.copy(camera.quaternion); halo.material.opacity = 0.35 + 0.1 * Math.sin(t * 3);
  const ku = s - E.knocked; knock.visible = set === 0 && ku > 0 && ku < 0.9; knock.position.set(2.2, 1.4, 2.2); knock.scale.setScalar(1 + (ku % 0.3) * 4); knock.material.opacity = 0.6 * (1 - (ku % 0.3) / 0.3);
  door.rotation.y = ku > 0 && ku < 0.9 ? Math.sin(t * 40) * 0.03 : (s >= E.stand - 0.4 || hook) ? 1.4 : 0;
  // the brick: thrown out of the door, lands outside; stays there for ever
  const fly = seg(s, E.threw, E.threw + 0.7);
  const bFrom = V(pux + 0.3, 1.2, -0.3), bp = fly > 0 && fly < 1 ? bFrom.clone().lerp(BRICK, fly).add(V(0, Math.sin(fly * Math.PI) * 1.6, 0)) : BRICK;
  brick.visible = set === 0 && (hook || s >= E.threw); brick.position.copy(bp); brick.rotation.set(fly < 1 ? fly * 8 : 0, fly < 1 ? fly * 5 : 0, 0);
  // --- Pandharpur today
  pose(C.vi, camera, { visible: set === 40, x: 40, y: 1.2, z: -2.3, h: 1.5, mood: 'happy', arm: 'hips' });
  tl.forEach((l, i) => (l.flame.scale.y = 1 + 0.15 * Math.sin(t * 13 + i)));
  const walk = (s - E.thats) * 0.5;
  [['w1', -2.2, 1.6, 1.65], ['w2', -0.8, 1.2, 1.6], ['w3', 0.8, 1.3, 1.62], ['w4', 2.2, 1.7, 1.6]].forEach(([n, x, z, h], i) => {
    pose(C[n], camera, { visible: set === 40, x: 40 + x, z, h, mood: s >= E.serving ? 'happy' : 'closed', arm: ending ? 'up' : i % 2 ? 'wave' : 'up', step: s * 3 + i, flip: x > 0 });
    const F = flags[i]; F.g.visible = set === 40 && (i === 0 || i === 3); F.g.position.set(40 + x + (x > 0 ? -0.32 : 0.32), 0, z - 0.05); const pa = F.f.geometry.attributes.position; for (let j = 0; j < pa.count; j++) pa.setZ(j, Math.sin(F.b[j * 3] * 8 + t * 6 + i) * 0.05 * F.b[j * 3] * 3); pa.needsUpdate = true; });
  confetti(E.comment, s, V(2.2, 3, 3));
  S.clouds.forEach((c, i) => { c.position.x = -80 + i * 15 + ((t * (lapse ? 6 : 0.6) + i * 3) % 12); });
}

const G = (t) => t;
const HOOK = [[2.15, 1.05, -0.4], [2.2, 1.45, 3.4]];
const SHOTS = [
  [0, E.stay - 0.05, G, HOOK, HOOK, [62, 34], { move: 'dolly' }],
  [E.stay - 0.05, E.as - 0.05, G, [[2.2, 1.45, 1.6], [2.2, 1.62, 3.4]], [[2.2, 1.5, 2.1], [2.2, 1.62, 3.4]]],
  [E.as - 0.05, E.served - 0.05, G, [[0, 4.6, 11], [0, 1.0, -1]], [[0, 2.4, 6.6], [0, 0.9, -1]], 50, { move: 'pull' }],
  [E.served - 0.05, E.washing - 0.05, G, [[-0.4, 1.3, 3.6], [-0.4, 0.8, -1]], [[-0.4, 1.3, 3.2], [-0.4, 0.8, -1]]],
  [E.washing - 0.05, E.feeding - 0.05, G, [[-0.5, 0.9, 1.9], [-1.0, 0.45, -0.7]], [[-0.5, 0.9, 1.7], [-1.0, 0.45, -0.7]]],
  [E.feeding - 0.05, E.but - 0.05, G, [[0.4, 1.1, 2.6], [0.1, 0.9, -0.8]], [[0.3, 1.1, 2.3], [0.1, 0.9, -0.8]]],
  [E.but - 0.05, E.pun2 - 0.05, G, [[3.6, 1.6, 6.6], [2.2, 1.3, 2.4]], [[3.2, 1.5, 5.6], [2.2, 1.3, 2.4]]],
  [E.pun2 - 0.05, E.threw - 0.05, G, [[-0.6, 1.0, 2.6], [-0.9, 0.7, -0.6]], [[-0.6, 1.0, 2.3], [-0.9, 0.7, -0.6]]],
  [E.threw - 0.05, E.stand - 0.05, G, [[0.6, 2.2, 6.4], [1.2, 0.8, 1.2]], [[1.0, 2.0, 6.6], [1.8, 0.6, 2.4]]],
  [E.stand - 0.05, E.wait - 0.05, G, [[2.4, 1.7, 6.6], [2.2, 1.0, 2.9]], [[2.35, 1.65, 6.1], [2.2, 1.0, 2.9]]],
  [E.wait - 0.05, E.k2 - 0.05, G, [[-0.7, 0.95, 2.0], [-0.85, 0.8, -0.35]], [[-0.7, 0.95, 1.8], [-0.85, 0.8, -0.35]]],
  [E.k2 - 0.05, E.never2 - 0.05, G, [[2.3, 0.9, 5.8], [2.2, 0.9, 3.2]], [[2.4, 2.2, 6.6], [2.2, 1.3, 3.3]], 50, { move: 'crane', lift: 1.0 }],
  [E.never2 - 0.05, E.thats - 0.05, G, [[2.15, 1.05, -0.4], [2.2, 1.45, 3.4]], [[2.15, 1.05, -0.4], [2.2, 1.45, 3.4]], [62, 40], { move: 'dolly' }],
  [E.thats - 0.05, E.serving - 0.05, G, [[40, 3.2, 9.0], [40, 1.8, -2]], [[40, 2.4, 6.0], [40, 1.8, -2]], 50, { move: 'land' }],
  [E.serving - 0.05, E.comment - 0.05, G, [[40.6, 1.6, 4.6], [40, 1.4, 0.5]], [[40.5, 1.6, 4.2], [40, 1.4, 0.5]]],
  [E.comment - 0.05, DURATION + 0.1, G, [[2.15, 1.1, 0.2], [2.2, 1.45, 3.4]], HOOK],
];
direct({ stage, WORDS, DURATION, shots: SHOTS, update, title: 1.4, q: [E.wait, E.k2], cta: E.comment, prog: [E.but, E.thats], pin: E.wait,
  key: ['god', 'brick', 'thousands', 'never', 'heart', 'pundalik', 'parents', 'feet', 'hand', 'krishna', 'knocked', "didn't", 'stop', 'stand', 'wait', 'god', 'smiled', 'hips', 'left', 'vitthal', 'pandharpur', 'worship', 'comment', 'send'],
  loc: (t) => (t >= E.as - 0.05 && t < E.served + 0.5 ? '📍 PANDHARPUR · LONG AGO' : t >= E.thats - 0.05 && t < E.serving ? 'EVEN TODAY' : ''), shakes: [E.knocked], tick: () => {} });
