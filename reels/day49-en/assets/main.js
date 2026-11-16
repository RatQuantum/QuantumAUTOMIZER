// Day 49 · "Why do we offer chandan to Krishna?" · Why we do what we do #31 (as the story goes: Kubja of Mathura)
// Strategy 8 hook/tracker/pinned CTA + Strategy 9 camera moves.
// Sets: a Mathura street (origin), Kamsa's palace (x = 40), a Krishna altar today (x = 80).
import * as THREE from './three.module.js';
import { rng, mat, mesh, sm, seg, lerp, clamp, setupScene, makeCast, pose, lamp, hut, roundTree } from './kit.js';
import { makeStage, direct, wordTime } from './director.js';
import { addOutlines, makeConfetti } from './plus.js';
import { WORDS, DURATION } from './data.js';

const stage = makeStage(), { scene, camera } = stage, V = (x, y, z) => new THREE.Vector3(x, y, z), R = rng(49);
const S = setupScene(scene, [[0, -2], [40, 0], [80, 0]], 49);
const WT = wordTime(WORDS);
const E = { as: WT('as'), mathura: WT('mathura'), kubja: WT('kubja'), sandal: WT('sandalwood'), kamsa: WT('kamsa'), people: WT('people'), blue: WT('blue'), will: WT('will'), every2: WT('everyone', 2), kings: WT("king's"),
  but: WT('but'), smeared: WT('smeared'), wait: WT('wait'), stepped: WT('stepped'), lifted: WT('lifted'), pull: WT('pull'), straight: WT('straight'), beautiful: WT('beautiful'),
  thats: WT("that's"), what2: WT('what', 2), comment: WT('comment') };
const glow = (c, o = 0.5) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, depthWrite: false, blending: THREE.AdditiveBlending });
const noOut = (m) => { m.userData.noOutline = true; m.castShadow = false; return m; };

// ---------------- the Mathura street (origin)
mesh(new THREE.BoxGeometry(20, 0.06, 18), mat(0xd9c08a), 0, 0.03, -2, scene).castShadow = false; noOut(mesh(new THREE.BoxGeometry(3.4, 0.02, 18), mat(0xc8a870), 0, 0.07, -2, scene));
for (let i = 0; i < 4; i++) for (const sd of [-1, 1]) { const x = sd * (4.2 + (i % 2) * 0.4), z = -8 + i * 3.2, h = 2.6 + (i % 3) * 0.6; mesh(new THREE.BoxGeometry(2.6, h, 2.6), mat([0xf3e2b8, 0xe8c890, 0xf6d8c8][(i + (sd > 0 ? 1 : 0)) % 3]), x, h / 2, z, scene); mesh(new THREE.BoxGeometry(2.8, 0.2, 2.8), mat(0xc9a227), x, h + 0.1, z, scene); noOut(mesh(new THREE.BoxGeometry(0.05, 1.2, 0.7), mat(0x8a4b20), x - sd * 1.31, 0.6, z, scene)); }
roundTree(scene, -2.4, -11, R, 1.2); roundTree(scene, 2.6, -12, R, 1.0);
const bowl = new THREE.Group(); scene.add(bowl); noOut(mesh(new THREE.SphereGeometry(0.16, 12, 6, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), mat(0xc9a227, { m: 0.5, r: 0.4 }), 0, 0, 0, bowl)); noOut(mesh(new THREE.CircleGeometry(0.15, 12).rotateX(-Math.PI / 2), mat(0xf2c38a), 0, -0.02, 0, bowl));
const tilak = noOut(mesh(new THREE.PlaneGeometry(0.06, 0.13), new THREE.MeshBasicMaterial({ color: 0xf2b84a }), 0, 0, 0, scene));
const sparkle = noOut(mesh(new THREE.RingGeometry(0.5, 0.75, 32), glow(0xfff0c0, 0), 0, 0, 0, scene));
const stars = []; for (let i = 0; i < 18; i++) stars.push({ m: noOut(mesh(new THREE.OctahedronGeometry(0.05), new THREE.MeshBasicMaterial({ color: 0xfff2a0 }), 0, 0, 0, scene)), ph: R(), a: R() * 6.3 });
// ---------------- Kamsa's palace (x = 40)
mesh(new THREE.BoxGeometry(14, 0.1, 10), mat(0x5a2a2a), 40, 0.05, 0, scene).castShadow = false; mesh(new THREE.BoxGeometry(14, 8, 0.3), mat(0x2a1a2a), 40, 4, -3.2, scene);
mesh(new THREE.BoxGeometry(1.8, 0.9, 1.0), mat(0x6a2a1a), 40, 0.45, -2.2, scene); mesh(new THREE.BoxGeometry(1.4, 2.2, 0.2), mat(0xc9a227, { m: 0.6, r: 0.35 }), 40, 1.9, -2.65, scene);
const kl = [lamp(scene, 38, 0.1, -1.6, 0.9), lamp(scene, 42, 0.1, -1.6, 0.9)];
// ---------------- the altar today (x = 80)
const T = new THREE.Group(); T.position.set(80, 0, 0); scene.add(T);
mesh(new THREE.BoxGeometry(12, 0.1, 9), mat(0xf3e6c8), 0, 0.05, 0, T).castShadow = false; mesh(new THREE.BoxGeometry(12, 8, 0.3), mat(0xe8a040), 0, 4, -3, T);
mesh(new THREE.BoxGeometry(3.0, 1.0, 1.3), mat(0x8a4b20), 0, 0.5, -2.2, T); mesh(new THREE.BoxGeometry(3.1, 0.08, 1.4), mat(0xffd23a), 0, 1.02, -2.2, T);
for (let i = 0; i < 24; i++) { const a = i / 23 * Math.PI; noOut(mesh(new THREE.SphereGeometry(0.1, 6, 4), mat([0xffd23a, 0xffffff, 0xf06aa0][i % 3]), Math.cos(a) * 1.3, 1.9 + Math.sin(a) * 1.5, -2.6, T)); }
const tl = [lamp(T, -1.3, 1.06, -1.8, 0.6), lamp(T, 1.3, 1.06, -1.8, 0.6)];
const stone = new THREE.Group(); stone.position.set(0.9, 0, 0.9); T.add(stone); mesh(new THREE.CylinderGeometry(0.4, 0.45, 0.14, 14), mat(0x9a9aa0), 0, 0.07, 0, stone); const stick = noOut(mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.5, 8), mat(0xb08050), 0, 0.3, 0, stone)); noOut(mesh(new THREE.CircleGeometry(0.3, 14).rotateX(-Math.PI / 2), mat(0xf2c38a), 0, 0.15, 0, stone));
const tilak2 = noOut(mesh(new THREE.PlaneGeometry(0.05, 0.11), new THREE.MeshBasicMaterial({ color: 0xf2b84a }), 0, 0, 0, scene));
// ---------------- the cast
const C = makeCast(scene, [['kb', 'kubja'], ['k', 'krishna'], ['p1', 'gopi1'], ['p2', 'kid1'], ['p3', 'courtier'], ['p4', 'gopi2'], ['ks', 'kamsa'], ['ak', 'krishna'], ['d1', 'gopi3'], ['d2', 'devotee'], ['kf', 'kubjaFair']]);
const kubjaBent = C.kb.spec, kubjaFair = C.kf.spec;
addOutlines(scene);
const confetti = makeConfetti(scene, 50, 49);
const right = new THREE.Vector3(), up = new THREE.Vector3();

function update(s, t) {
  const cx = camera.position.x, set = cx > 60 ? 80 : cx > 20 ? 40 : 0, hook = s < E.as;
  S.mood(set === 40 ? 0.5 : 0); S.hemi.intensity = set === 40 ? 1.0 : 1.35; S.sun.target.position.set(set, 0, 0); S.sun.position.set(set - 8, 14, 10); S.sun.target.updateMatrixWorld();
  right.setFromMatrixColumn(camera.matrixWorld, 0); right.y = 0; right.normalize();
  // --- Kubja walks the street, bent; people mock; Krishna asks; she gives; he straightens her
  const walkK = s >= E.mathura && s < E.blue + 0.4, kbx = walkK ? lerp(-1.6, 0.2, seg(s, E.mathura, E.blue + 0.4)) : 0.2;
  const fixed = sm(seg(s, E.pull, E.straight)), lift = sm(seg(s, E.lifted, E.pull)) * 0.25;
  const bend = hook ? 0.5 : 0.5 * (1 - fixed) - lift * (1 - fixed);
  const want = s >= E.straight - 0.1 && !hook ? kubjaFair : kubjaBent; if (C.kb.spec !== want) { C.kb.spec = want; C.kb.key = ''; }
  const giving = s >= E.but && s < E.wait;
  pose(C.kb, camera, { visible: set === 0, x: kbx, z: 0.6, h: 1.6, mood: s >= E.but ? 'happy' : s >= E.people && s < E.blue ? 'sad' : 'closed', arm: giving ? 'offer' : 'down', bowl: !hook && s < E.wait && s >= E.mathura, step: walkK ? s * 2.5 : 0 });
  C.kb.m.rotateZ(-bend * 0.8);
  bowl.visible = false; pose(C.kf, camera, { visible: false });
  // Krishna arrives on the road
  const kIn = sm(seg(s, E.blue - 0.5, E.blue + 0.5)), kOn = hook || s >= E.blue - 0.5;
  const kx = hook ? 1.05 : lerp(4.0, 1.05, kIn);
  const touch = hook || (s >= E.stepped && s < E.beautiful);
  pose(C.k, camera, { visible: set === 0 && kOn, x: kx, z: 0.65, h: 1.72, mood: s >= E.every2 && s < E.but ? 'smug' : 'happy', arm: touch ? 'offer' : s >= E.will && s < E.every2 ? 'offer' : 'down', flip: true, step: kIn > 0 && kIn < 1 ? s * 3 : 0 });
  tilak.visible = set === 0 && kOn && s >= E.smeared + 0.3; tilak.position.set(kx, 1.72 * 0.8, 0.72); tilak.quaternion.copy(camera.quaternion);
  // the mocking crowd: laugh and point, gasp, then are amazed
  const crowd = [['p1', -1.6, 1.8, 1.6], ['p2', -2.9, 1.4, 1.1], ['p3', -2.4, 0.2, 1.66], ['p4', 2.6, 0.0, 1.6]];
  crowd.forEach(([n, x, z, h], i) => { const mock = hook || (s >= E.people && s < E.blue), gasp = s >= E.every2 && s < E.but + 0.5, wow = s >= E.straight;
    pose(C[n], camera, { visible: set === 0 && (hook || s >= E.people - 0.3), x, z, h, mood: wow || gasp ? 'wow' : mock ? 'happy' : 'normal', arm: mock ? (i % 2 ? 'point' : 'hips') : wow ? 'up' : 'down', flip: x > 0 }); });
  // the transformation sparkle
  const su = s - E.straight; sparkle.visible = set === 0 && su > -0.2 && su < 0.9; sparkle.position.set(kbx, 1.0, 0.7); sparkle.quaternion.copy(camera.quaternion); sparkle.scale.setScalar(0.6 + Math.max(0, su) * 1.6); sparkle.material.opacity = 0.7 * (1 - Math.max(0, su) / 0.9);
  stars.forEach(({ m, ph, a }) => { const u = (t * 0.5 + ph) % 1; m.visible = set === 0 && s >= E.straight - 0.2 && s < E.thats; m.position.set(kbx + Math.cos(a + u) * 0.55, 0.2 + u * 1.8, 0.75 + Math.sin(a + u) * 0.3); m.rotation.set(t * 3, t * 2, 0); });
  // --- Kamsa's palace
  kl.forEach((l, i) => (l.flame.scale.y = 1 + 0.15 * Math.sin(t * 11 + i)));
  pose(C.ks, camera, { visible: set === 40, x: 40, y: 0.9, z: -2.0, h: 1.9, mood: 'smug', arm: 'hips' });
  // --- today: chandan on Krishna, a devotee grinding sandalwood
  pose(C.ak, camera, { visible: set === 80, x: 80, y: 1.06, z: -2.3, h: 1.55, mood: 'happy', flute: true });
  tilak2.visible = set === 80; tilak2.position.set(80, 1.06 + 1.55 * 0.8, -2.24); tilak2.quaternion.copy(camera.quaternion);
  tl.forEach((l, i) => (l.flame.scale.y = 1 + 0.15 * Math.sin(t * 13 + i)));
  stick.position.set(Math.cos(t * 4) * 0.12, 0.3, Math.sin(t * 4) * 0.12); stick.rotation.set(Math.sin(t * 4) * 0.3, 0, -Math.cos(t * 4) * 0.3);
  pose(C.d1, camera, { visible: set === 80, x: 81.5, z: 1.0, h: 1.6, sitting: true, mood: 'closed', arm: 'offer', flip: true });
  pose(C.d2, camera, { visible: set === 80, x: 78.8, z: 0.9, h: 1.65, mood: s >= E.what2 ? 'happy' : 'closed', arm: s >= E.comment ? 'up' : 'down' });
  confetti(E.comment, s, V(80, 3, -1));
  S.clouds.forEach((c, i) => { c.position.x = -80 + i * 15 + ((t * 0.6 + i * 3) % 12); });
}

const G = (t) => t;
const SHOTS = [
  [0, E.as - 0.05, G, [[0.5, 1.4, 4.4], [0.55, 1.1, 0.6]], [[0.5, 1.4, 4.4], [0.55, 1.1, 0.6]], [62, 34], { move: 'dolly' }],
  [E.as - 0.05, E.kubja - 0.05, G, [[0, 5, 12], [0, 1.6, -6]], [[0, 2.4, 7], [0, 1.4, -2]], 50, { move: 'pull' }],
  [E.kubja - 0.05, E.sandal - 0.05, G, [[-1.0, 1.2, 4.0], [-1.1, 0.8, 0.6]], [[-0.8, 1.2, 3.6], [-0.9, 0.8, 0.6]]],
  [E.sandal - 0.05, E.kamsa - 0.3, G, [[-0.5, 1.0, 3.0], [-0.6, 0.75, 0.6]], [[-0.4, 1.0, 2.7], [-0.5, 0.75, 0.6]]],
  [E.kamsa - 0.3, E.people - 0.05, G, [[40, 1.6, 4.0], [40, 1.8, -2]], [[40, 1.7, 3.4], [40, 1.9, -2]]],
  [E.people - 0.05, E.blue - 0.05, G, [[0, 2.4, 7.4], [-0.2, 1.0, 0.6]], [[0, 2.0, 6.4], [-0.2, 1.0, 0.6]]],
  [E.blue - 0.05, E.will - 0.05, G, [[3.4, 1.4, 4.8], [2.4, 1.2, 0.6]], [[2.6, 1.4, 4.6], [1.2, 1.2, 0.6]]],
  [E.will - 0.05, E.every2 - 0.05, G, [[0.65, 1.4, 4.0], [0.65, 1.15, 0.6]], [[0.65, 1.4, 3.6], [0.65, 1.15, 0.6]]],
  [E.every2 - 0.05, E.but - 0.05, G, [[0.4, 2.2, 7.2], [0.4, 1.1, 0.8]], [[0.4, 1.8, 6.0], [0.4, 1.1, 0.8]], 50, { move: 'pull' }],
  [E.but - 0.05, E.wait - 0.05, G, [[1.4, 1.5, 3.4], [0.8, 1.35, 0.6]], [[1.2, 1.5, 3.0], [0.8, 1.35, 0.6]]],
  [E.wait - 0.05, E.stepped - 0.05, G, [[0.62, 1.3, 4.4], [0.62, 1.0, 0.6]], [[0.62, 1.3, 4.0], [0.62, 1.0, 0.6]]],
  [E.stepped - 0.05, E.pull - 0.05, G, [[0.62, 0.7, 3.8], [0.62, 0.6, 0.6]], [[0.62, 1.3, 4.2], [0.62, 1.05, 0.6]], 50, { move: 'crane', lift: 0.8 }],
  [E.pull - 0.05, E.beautiful - 0.05, G, [[0.5, 1.2, 3.8], [0.5, 1.05, 0.6]], [[0.5, 1.2, 3.8], [0.5, 1.05, 0.6]], [62, 38], { move: 'dolly' }],
  [E.beautiful - 0.05, E.thats - 0.05, G, [[0.4, 1.6, 6.4], [0.3, 1.1, 0.6]], [[0.4, 2.6, 8.4], [0.3, 1.1, 0.6]], 50, { move: 'pull' }],
  [E.thats - 0.05, E.what2 - 0.05, G, [[80, 2.8, 7.6], [80, 1.9, -2]], [[80, 2.3, 4.0], [80, 1.9, -2.2]], 50, { move: 'land' }],
  [E.what2 - 0.05, E.comment - 0.05, G, [[81.2, 1.4, 3.8], [80.9, 0.6, 0.9]], [[81.0, 1.4, 3.4], [80.9, 0.6, 0.9]]],
  [E.comment - 0.05, DURATION + 0.1, G, [[80, 2.4, 6.0], [80, 1.6, -1.5]], [[80, 2.4, 5.4], [80, 1.6, -1.5]]],
];
direct({ stage, WORDS, DURATION, shots: SHOTS, update, title: 1.6, q: [E.wait, E.stepped], cta: E.comment, prog: [E.wait, E.thats], pin: E.wait,
  key: ['laughed', 'bent', 'touched', 'mathura', 'kubja', 'half', 'sandalwood', 'kamsa', 'mocked', 'blue', 'boy', 'gasped', "king's", 'hesitate', 'forehead', 'love', 'wait', 'toes', 'chin', 'pull', 'straight', 'beautiful', 'chandan', 'thousand', 'comment'],
  loc: (t) => (t >= E.as - 0.05 && t < E.kubja + 0.6 ? '📍 MATHURA' : t >= E.kamsa - 0.3 && t < E.people - 0.05 ? "KAMSA'S PALACE" : t >= E.thats - 0.05 && t < E.what2 ? 'EVEN TODAY' : ''), shakes: [E.every2], tick: () => {} });
