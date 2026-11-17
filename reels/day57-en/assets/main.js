// Day 57 · "Why do mothers listen to stories while pregnant?" · Why we do what we do #39 (Abhimanyu and the Chakravyuha)
// KB brief: emotion = awe → tears · lever = time (he learned it before birth) · odd detail: the glow in the womb pulses with Arjuna's words, then stops when Subhadra sleeps.
// Sets: the palace room at night (origin), the Chakravyuha on day 13 (x = 40), a mother-to-be today (x = 80).
import * as THREE from './three.module.js';
import { rng, mat, mesh, sm, seg, lerp, clamp, setupScene, makeCast, pose, lamp } from './kit.js';
import { makeStage, direct, wordTime } from './director.js';
import { addOutlines, makeConfetti } from './plus.js';
import { WORDS, DURATION } from './data.js';

const stage = makeStage(), { scene, camera } = stage, V = (x, y, z) => new THREE.Vector3(x, y, z), R = rng(57);
const S = setupScene(scene, [[0, 0], [40, 0], [80, 0]], 57);
const WT = wordTime(WORDS);
const E = { stay: WT('stay'), as: WT('as'), arjuna: WT('arjuna'), chakra: WT('chakravyuha'), baby: WT('baby'), listening: WT('listening'), but: WT('but'), asleep: WT('asleep'), so: WT('so'), sixteen: WT('sixteen'),
  abhi: WT('abhimanyu'), thirteenth: WT('thirteenth'), wait: WT('wait'), seven: WT('seven'), sword: WT('sword'), never: WT('never'), forgotten: WT('forgotten'), thats: WT("that's"), child: WT('child'), comment: WT('comment') };
const glow = (c, o = 0.5) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, depthWrite: false, blending: THREE.AdditiveBlending });
const noOut = (m) => { m.userData.noOutline = true; m.castShadow = false; return m; };
function wheel(parent) { const g = new THREE.Group(); parent.add(g); noOut(mesh(new THREE.TorusGeometry(0.5, 0.06, 6, 20), mat(0x8a5a2a), 0, 0, 0, g)); for (let i = 0; i < 6; i++) { const sp = noOut(mesh(new THREE.BoxGeometry(0.045, 0.98, 0.045), mat(0xffd23a, { m: 0.5, r: 0.4 }), 0, 0, 0, g)); sp.rotation.z = i / 6 * Math.PI; } return g; }
// the spiral formation, reused small (drawn by Arjuna) and full size (the battlefield)
function spiral(n, scale, col, seed) { const r = rng(seed), body = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.16, 0.2, 0.7, 6), mat(col), n), head = new THREE.InstancedMesh(new THREE.SphereGeometry(0.13, 8, 6), mat(0xc98a5e), n), spear = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.015, 0.015, 1.4, 4), mat(0x8a8a90), n);
  [body, head, spear].forEach((m) => { m.userData.noOutline = true; scene.add(m); });
  const P = []; for (let i = 0; i < n; i++) { const ring = Math.floor(i / (n / 7)), a = (i % (n / 7)) / (n / 7) * Math.PI * 2 + ring * 0.4; P.push({ ring, a, rad: (2.9 + ring * 0.85) }); }
  return { body, head, spear, P, scale }; }
const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), one = new THREE.Vector3(1, 1, 1);
function placeSpiral(SP, cx, cz, t, vis, k = 1) { const { body, head, spear, P, scale } = SP; const sc = new THREE.Vector3(scale, scale, scale); body.visible = head.visible = spear.visible = vis;
  if (!vis) return; P.forEach(({ ring, a, rad }, i) => { const dir = ring % 2 ? 1 : -1, ang = a + dir * t * 0.25, r = rad * scale * k, x = cx + Math.cos(ang) * r, z = cz + Math.sin(ang) * r;
    m4.compose(V(x, 0.35 * scale, z), q, sc); body.setMatrixAt(i, m4); m4.compose(V(x, 0.83 * scale, z), q, sc); head.setMatrixAt(i, m4); m4.compose(V(x + 0.18 * scale, 0.9 * scale, z), q, sc); spear.setMatrixAt(i, m4); });
  body.instanceMatrix.needsUpdate = head.instanceMatrix.needsUpdate = spear.instanceMatrix.needsUpdate = true; }
// ---------------- the palace room at night (origin)
mesh(new THREE.BoxGeometry(12, 0.1, 9), mat(0x8a5a4a), 0, 0.05, 0, scene).castShadow = false; mesh(new THREE.BoxGeometry(12, 6, 0.3), mat(0x4a3a6a), 0, 3, -3.4, scene);
mesh(new THREE.BoxGeometry(3.2, 0.5, 1.6), mat(0xd8a050), -1.4, 0.25, -2.0, scene); mesh(new THREE.BoxGeometry(3.2, 0.25, 1.6), mat(0xf6f1e2), -1.4, 0.6, -2.0, scene);
mesh(new THREE.CircleGeometry(2.0, 40).rotateX(-Math.PI / 2), mat(0xc8463a), 0.6, 0.11, 0.4, scene).castShadow = false;
const rl = [lamp(scene, -3.2, 0.1, -2.2, 0.9), lamp(scene, 3.0, 0.1, -2.2, 0.9)];
const small = spiral(105, 0.22, 0xd8263a, 3);
const womb = noOut(mesh(new THREE.SphereGeometry(0.07, 14, 10), glow(0xfff0b0, 0.7), 0, 0, 0, scene)), wombHalo = noOut(mesh(new THREE.SphereGeometry(0.15, 14, 10), glow(0xffd88a, 0.22), 0, 0, 0, scene));
const stars = []; for (let i = 0; i < 12; i++) stars.push({ m: noOut(mesh(new THREE.OctahedronGeometry(0.035), new THREE.MeshBasicMaterial({ color: 0xfff2a0 }), 0, 0, 0, scene)), ph: R() });
// ---------------- the Chakravyuha (x = 40)
mesh(new THREE.CylinderGeometry(20, 20, 0.06, 28), mat(0xc9a46a), 40, 0.03, 0, scene).castShadow = false;
const big = spiral(280, 1, 0x8a1a2a, 4);
const WH = wheel(scene), whGlow = noOut(mesh(new THREE.RingGeometry(0.4, 0.46, 32), glow(0xffe08a, 0.2), 0, 0, 0, scene));
const sword = new THREE.Group(); scene.add(sword); noOut(mesh(new THREE.BoxGeometry(0.05, 0.5, 0.01), mat(0xd0d0d8, { m: 0.7 }), 0, 0.25, 0, sword)); const swordTip = noOut(mesh(new THREE.BoxGeometry(0.05, 0.3, 0.01), mat(0xd0d0d8, { m: 0.7 }), 0, 0, 0, scene));
const dust = []; for (let i = 0; i < 14; i++) dust.push(noOut(mesh(new THREE.SphereGeometry(0.25, 8, 6), new THREE.MeshBasicMaterial({ color: 0xe8d8b0, transparent: true, opacity: 0.4, depthWrite: false }), 0, 0, 0, scene)));
// ---------------- a mother-to-be today (x = 80)
const T = new THREE.Group(); T.position.set(80, 0, 0); scene.add(T);
mesh(new THREE.BoxGeometry(12, 0.1, 9), mat(0xf3e6c8), 0, 0.05, 0, T).castShadow = false; mesh(new THREE.BoxGeometry(12, 8, 0.3), mat(0x9ad0b0), 0, 4, -3, T);
mesh(new THREE.BoxGeometry(2.0, 0.8, 0.9), mat(0x8a4b20), 1.6, 0.4, -2.3, T); mesh(new THREE.BoxGeometry(2.1, 0.08, 1.0), mat(0xffd23a), 1.6, 0.82, -2.3, T);
const tl = [lamp(T, 0.9, 0.86, -2.0, 0.5), lamp(T, 2.3, 0.86, -2.0, 0.5)];
mesh(new THREE.BoxGeometry(2.6, 0.45, 1.1), mat(0xd86aa0), -0.6, 0.22, -0.4, T);
const book = new THREE.Group(); scene.add(book); for (const sd of [-1, 1]) { const p = noOut(mesh(new THREE.BoxGeometry(0.22, 0.3, 0.02), mat(0xfaf5ea), sd * 0.11, 0, 0, book)); p.rotation.y = sd * 0.3; } noOut(mesh(new THREE.BoxGeometry(0.46, 0.32, 0.01), mat(0xd8263a), 0, 0, -0.02, book));
const tWomb = noOut(mesh(new THREE.SphereGeometry(0.06, 14, 10), glow(0xfff0b0, 0.7), 0, 0, 0, scene)), tHalo = noOut(mesh(new THREE.SphereGeometry(0.13, 14, 10), glow(0xffd88a, 0.22), 0, 0, 0, scene));
// ---------------- the cast
const C = makeCast(scene, [['ar', 'arjuna'], ['su', 'uttara'], ['ab', 'abhimanyu'], ['w1', 'duryodhana'], ['w2', 'karna'], ['w3', 'priest'], ['w4', 'ashwatthama'], ['w5', 'king'], ['w6', 'kamsa'], ['w7', 'courtier'], ['mo', 'uttara'], ['gm', 'oldMother'], ['tk', 'krishna']]);
C.su.spec = Object.assign({}, C.su.spec, { body: '#e8a020' });
addOutlines(scene);
const confetti = makeConfetti(scene, 50, 57);
const right = new THREE.Vector3();

function update(s, t) {
  const cx = camera.position.x, set = cx > 60 ? 80 : cx > 20 ? 40 : 0, hook = s < E.as, ending = s >= E.comment;
  const night = set === 0 ? 0.7 : 0;
  S.mood(night); S.hemi.intensity = 1.35 - night * 0.5; S.sun.target.position.set(set, 0, 0); S.sun.position.set(set - 8, 14, 10); S.sun.target.updateMatrixWorld();
  right.setFromMatrixColumn(camera.matrixWorld, 0); right.y = 0; right.normalize();
  rl.forEach((l, i) => (l.flame.scale.y = 1 + 0.15 * Math.sin(t * 11 + i)));
  // --- the room: Arjuna explains the spiral; Subhadra listens; the baby listens; she falls asleep
  const asleep = s >= E.asleep - 0.2;
  pose(C.ar, camera, { visible: set === 0, x: 1.4, z: 0.6, h: 1.74, sitting: true, mood: 'normal', arm: s >= E.arjuna && s < E.so ? 'point' : 'down', flip: true });
  pose(C.su, camera, { visible: set === 0, x: -0.6, z: -0.2, h: 1.66, sitting: true, mood: asleep ? 'closed' : 'happy', arm: 'down' });
  if (set === 0 && asleep) C.su.m.rotateZ(0.12);
  placeSpiral(small, 0.4, 0.6, t, set === 0 && s >= E.chakra - 0.4 && s < E.sixteen);
  const wp = V(-0.6, 1.66 * 0.36, -0.12); const talking = s >= E.arjuna && s < E.asleep; const pulse = talking ? 0.5 + 0.5 * Math.abs(Math.sin(t * 7)) : asleep ? 0.15 : 0.4;
  womb.visible = wombHalo.visible = set === 0 && s >= E.baby - 0.4 && s < E.sixteen; womb.position.copy(wp); wombHalo.position.copy(wp); wombHalo.scale.setScalar(0.8 + pulse * 0.6); womb.material.opacity = 0.3 + pulse * 0.4;
  stars.forEach(({ m, ph }) => { const u = (t * 0.5 + ph) % 1; m.visible = set === 0 && s >= E.listening - 0.2 && s < E.but; m.position.set(lerp(1.3, -0.6, u), 1.4 - u * 0.8 + Math.sin(u * Math.PI) * 0.3, lerp(0.6, -0.1, u)); });
  // --- day 13: Abhimanyu inside the spinning formation, the seven warriors, the wheel
  const inside = hook || ending || s >= E.thirteenth, enter = sm(seg(s, E.thirteenth, E.wait));
  placeSpiral(big, 40, 0, t, set === 40);
  const ap = inside ? V(40, 0, hook || ending ? 0 : lerp(11, 0, enter)) : V(40, 0, 11);
  const wheelUp = hook || ending || s >= E.sword + 0.3;
  pose(C.ab, camera, { visible: set === 40, x: ap.x, z: ap.z, h: 1.62, mood: s >= E.never && !ending ? 'closed' : 'normal', arm: wheelUp ? 'up' : 'offer', step: enter > 0 && enter < 1 ? s * 4 : 0 });
  WH.visible = whGlow.visible = set === 40 && wheelUp; WH.scale.setScalar(0.72); WH.position.copy(ap).add(V(0, 2.05, 0.05)); WH.quaternion.copy(camera.quaternion); WH.rotateZ(Math.sin(t * 6) * 0.1); whGlow.position.copy(WH.position); whGlow.quaternion.copy(camera.quaternion);
  sword.visible = set === 40 && !wheelUp && s >= E.thirteenth; sword.position.copy(ap).add(right.clone().multiplyScalar(0.62)).add(V(0, 0.95, 0.05)); sword.quaternion.copy(camera.quaternion);
  const broke = s >= E.sword + 0.15; swordTip.visible = set === 40 && broke && s < E.sword + 1.2; swordTip.position.copy(ap).add(right.clone().multiplyScalar(0.9)).add(V(0, 0.6 - (s - E.sword) * 0.4, 0.05)); swordTip.quaternion.copy(camera.quaternion); swordTip.rotateZ((s - E.sword) * 6);
  const ring = hook || ending || s >= E.seven - 0.3; ['w1', 'w2', 'w3', 'w4', 'w5', 'w6', 'w7'].forEach((n, i) => { const a = i / 7 * Math.PI * 2 + 0.2; pose(C[n], camera, { visible: set === 40 && ring, x: 40 + Math.cos(a) * 1.9, z: Math.sin(a) * 1.9 - 0.3, h: 1.74, mood: 'smug', arm: 'point', bow: i % 3 === 0, flip: Math.cos(a) > 0 }); });
  dust.forEach((d, i) => { const u = (t * 1.1 + i / 14) % 1; d.visible = set === 40 && (hook || (s >= E.seven && s < E.never + 1)); d.position.set(40 + Math.sin(i * 2.3) * 1.2, 0.2 + u * 1.2, Math.cos(i * 1.7) * 1.2); d.scale.setScalar(0.5 + u * 1.5); d.material.opacity = 0.35 * (1 - u); });
  // --- today
  tl.forEach((l, i) => (l.flame.scale.y = 1 + 0.15 * Math.sin(t * 13 + i)));
  pose(C.tk, camera, { visible: set === 80, x: 81.6, y: 0.86, z: -2.4, h: 1.2, mood: 'happy', flute: true });
  pose(C.mo, camera, { visible: set === 80, x: 79.0, y: 0.45, z: -0.3, h: 1.62, sitting: true, mood: 'happy', arm: s >= E.comment ? 'up' : 'down' });
  pose(C.gm, camera, { visible: set === 80, x: 80.2, y: 0.45, z: -0.3, h: 1.56, sitting: true, mood: 'happy', arm: 'offer', flip: true });
  book.visible = set === 80; book.position.set(79.75, 1.15, 0.0); book.quaternion.copy(camera.quaternion);
  const tw = V(79.0, 0.45 + 1.62 * 0.36, -0.22); tWomb.visible = tHalo.visible = set === 80; tWomb.position.copy(tw); tHalo.position.copy(tw); tHalo.scale.setScalar(0.9 + 0.3 * Math.abs(Math.sin(t * 6)));
  confetti(E.comment, s, V(40, 3, 0));
  S.clouds.forEach((c, i) => { c.visible = night < 0.5; c.position.x = -80 + i * 15 + ((t * 0.6 + i * 3) % 12); });
}

const G = (t) => t;
const HOOK = [[40.3, 2.0, 3.1], [40, 1.45, 0]];
const SHOTS = [
  [0, E.stay - 0.05, G, HOOK, HOOK, [62, 38], { move: 'dolly' }],
  [E.stay - 0.05, E.as - 0.05, G, [[40, 14, 9], [40, 0, 0]], [[40, 11, 7], [40, 0, 0]]],
  [E.as - 0.05, E.chakra - 0.05, G, [[0.4, 2.6, 6.4], [0.2, 1.0, -0.6]], [[0.4, 2.0, 4.8], [0.4, 0.9, -0.2]], 50, { move: 'pull' }],
  [E.chakra - 0.05, E.baby - 0.05, G, [[0.4, 3.6, 2.6], [0.4, 0, 0.6]], [[0.4, 3.0, 2.2], [0.4, 0, 0.6]]],
  [E.baby - 0.05, E.but - 0.05, G, [[-0.4, 1.0, 1.8], [-0.6, 0.75, -0.15]], [[-0.45, 0.95, 1.5], [-0.6, 0.7, -0.15]], [62, 40], { move: 'dolly' }],
  [E.but - 0.05, E.so - 0.05, G, [[-0.3, 1.5, 2.6], [-0.6, 1.2, -0.2]], [[-0.3, 1.5, 2.3], [-0.6, 1.2, -0.2]]],
  [E.so - 0.05, E.sixteen - 0.05, G, [[0.4, 2.8, 3.4], [0, 0.5, 0]], [[0.2, 2.2, 2.6], [-0.4, 0.6, -0.2]]],
  [E.sixteen - 0.05, E.thirteenth - 0.05, G, [[40, 1.6, 14.5], [40, 1.2, 11]], [[40, 1.6, 14], [40, 1.2, 11]]],
  [E.thirteenth - 0.05, E.wait - 0.05, G, [[40, 6, 16], [40, 0.6, 2]], [[40, 3, 7], [40, 1.2, 0]], 50, { move: 'crane', lift: 1.0 }],
  [E.wait - 0.05, E.sword - 0.05, G, [[40.5, 1.5, 2.5], [40, 1.3, 0]], [[40.45, 1.5, 2.3], [40, 1.3, 0]]],
  [E.sword - 0.05, E.never - 0.05, G, [[40.35, 2.0, 3.1], [40, 1.45, 0]], [[40.3, 2.0, 2.9], [40, 1.5, 0]]],
  [E.never - 0.05, E.thats - 0.05, G, [[40, 2.4, 6], [40, 1.6, 0]], [[40, 9, 10], [40, 1.2, 0]], 50, { move: 'pull' }],
  [E.thats - 0.05, E.child - 0.05, G, [[80, 3.0, 7.0], [80, 1.6, -1.5]], [[79.6, 1.8, 3.6], [79.6, 0.9, -0.3]], 50, { move: 'land' }],
  [E.child - 0.05, E.comment - 0.05, G, [[79.1, 1.1, 1.8], [79.0, 0.9, -0.25]], [[79.1, 1.1, 1.8], [79.0, 0.9, -0.25]], [62, 40], { move: 'dolly' }],
  [E.comment - 0.05, DURATION + 0.1, G, [[80.2, 2.0, 5.0], [80.2, 1.2, -1.0]], [[80.2, 2.0, 4.6], [80.2, 1.2, -1.0]]],
];
direct({ stage, WORDS, DURATION, shots: SHOTS, update, title: 1.4, q: [E.wait, E.seven], cta: E.comment, prog: [E.but, E.thats], pin: E.wait,
  key: ['boy', 'deadliest', 'born', 'mothers', 'cry', 'arjuna', 'subhadra', 'chakravyuha', 'escape', 'baby', 'womb', 'listening', 'asleep', 'in,', 'out.', 'abhimanyu', 'alone', 'wait', 'seven', 'sword', 'wheel', 'forgotten', 'courage', 'pregnant', 'child', 'comment'],
  loc: (t) => (t >= E.as - 0.05 && t < E.chakra ? '📍 INDRAPRASTHA · LONG BEFORE THE WAR' : t >= E.thirteenth - 0.05 && t < E.wait ? '📍 KURUKSHETRA · DAY 13' : t >= E.thats - 0.05 && t < E.child ? 'EVEN TODAY' : ''), shakes: [E.sword + 0.1, E.never], tick: () => {} });
