// Day 52 · "Why did Krishna break His promise?" · Why we do what we do #34 (as the story goes: Bhishma's vow)
// Strategy 10: mid-action hook (Krishna charging with the wheel) + lock-in, "But…" re-hook, "Wait…?" re-hook, loop to the hook frame.
// Sets: Kurukshetra (origin), a Krishna altar today (x = 40).
import * as THREE from './three.module.js';
import { rng, mat, mesh, sm, seg, lerp, clamp, setupScene, makeCast, pose, lamp } from './kit.js';
import { makeStage, direct, wordTime } from './director.js';
import { addOutlines, makeConfetti } from './plus.js';
import { WORDS, DURATION } from './data.js';

const stage = makeStage(), { scene, camera } = stage, V = (x, y, z) => new THREE.Vector3(x, y, z), R = rng(52);
const S = setupScene(scene, [[0, 0], [40, 0]], 52);
const WT = wordTime(WORDS);
const E = { stay: WT('stay'), as: WT('as'), bhishma: WT('bhishma'), arjuna: WT('arjuna'), but: WT('but'), so: WT('so'), leapt: WT('leapt'), lifted: WT('lifted'), ran: WT('ran'), wait: WT('wait'),
  b4: WT('bhishma', 4), dropped: WT('dropped'), smiled: WT('smiled'), k4: WT('krishna', 4), thats: WT("that's"), comment: WT('comment') };
const glow = (c, o = 0.5) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, depthWrite: false, blending: THREE.AdditiveBlending });
const noOut = (m) => { m.userData.noOutline = true; m.castShadow = false; return m; };

// ---------------- Kurukshetra (origin)
mesh(new THREE.CylinderGeometry(24, 24, 0.06, 28), mat(0xc9a46a), 0, 0.03, 0, scene).castShadow = false;
function army(x0, col, n, seed) { const r = rng(seed), body = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.16, 0.2, 0.7, 6), mat(col), n), head = new THREE.InstancedMesh(new THREE.SphereGeometry(0.13, 8, 6), mat(0xc98a5e), n); [body, head].forEach((m) => { m.userData.noOutline = true; scene.add(m); }); const P = []; for (let i = 0; i < n; i++) P.push([x0 + Math.sign(x0) * r() * 6, (r() - 0.5) * 9 - 4, r()]); return { body, head, P }; }
const armies = [army(-7, 0x8a1a2a, 200, 1), army(7, 0x2f6fa8, 200, 2)];
const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e3 = new THREE.Euler(), one = new THREE.Vector3(1, 1, 1);
function chariot(col) {
  const g = new THREE.Group(); scene.add(g); const gold = mat(0xffd23a, { m: 0.6, r: 0.35 });
  mesh(new THREE.BoxGeometry(1.8, 0.2, 1.3), gold, 0, 0.85, 0, g); mesh(new THREE.BoxGeometry(0.08, 0.5, 1.3), gold, 0.9, 1.15, 0, g);
  for (const z of [-0.72, 0.72]) { const w = new THREE.Group(); w.position.set(-0.1, 0.62, z); g.add(w); mesh(new THREE.TorusGeometry(0.58, 0.06, 6, 20), mat(0x8a5a2a), 0, 0, 0, w); for (let i = 0; i < 6; i++) { const sp = mesh(new THREE.BoxGeometry(0.04, 1.14, 0.04), gold, 0, 0, 0, w); sp.rotation.z = i / 6 * Math.PI; } }
  mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.6, 6), mat(0x8a5a2a), -0.7, 2.2, -0.5, g); noOut(mesh(new THREE.PlaneGeometry(0.7, 0.45), new THREE.MeshStandardMaterial({ color: col, side: THREE.DoubleSide }), -0.35, 3.25, -0.5, g));
  return g;
}
const CB = chariot(0xd8263a); CB.position.set(-4.2, 0, -0.8); CB.rotation.y = Math.PI;
const CA = chariot(0x3f8fe0); CA.position.set(3.6, 0, 0.3);
const flagMonkey = noOut(mesh(new THREE.CircleGeometry(0.12, 12), mat(0xe08a3a), 3.25, 3.25, -0.18, scene));
// the broken wheel Krishna lifts
const WH = new THREE.Group(); scene.add(WH); noOut(mesh(new THREE.TorusGeometry(0.55, 0.07, 6, 20), mat(0x8a5a2a), 0, 0, 0, WH)); for (let i = 0; i < 5; i++) { const sp = noOut(mesh(new THREE.BoxGeometry(0.05, 1.08, 0.05), mat(0xffd23a, { m: 0.5, r: 0.4 }), 0, 0, 0, WH)); sp.rotation.z = i / 5 * Math.PI + (i === 2 ? 0.3 : 0); }
const whGlow = noOut(mesh(new THREE.RingGeometry(0.6, 0.68, 32), glow(0xffe08a, 0.0), 0, 0, 0, scene));
const arrows = []; for (let i = 0; i < 14; i++) { const g = new THREE.Group(); scene.add(g); noOut(mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.8, 4).rotateZ(Math.PI / 2), mat(0x8a5a2a), 0, 0, 0, g)); noOut(mesh(new THREE.ConeGeometry(0.04, 0.12, 4).rotateZ(-Math.PI / 2), mat(0xc0c0c8, { m: 0.6 }), 0.45, 0, 0, g)); arrows.push({ g, ph: R(), z: (R() - 0.5) * 4, y: 1.4 + R() * 1.2 }); }
const dust = []; for (let i = 0; i < 12; i++) dust.push(noOut(mesh(new THREE.SphereGeometry(0.2, 8, 6), new THREE.MeshBasicMaterial({ color: 0xe8d8b0, transparent: true, opacity: 0.4, depthWrite: false }), 0, 0, 0, scene)));
// ---------------- the altar today (x = 40)
const T = new THREE.Group(); T.position.set(40, 0, 0); scene.add(T);
mesh(new THREE.BoxGeometry(12, 0.1, 9), mat(0xf3e6c8), 0, 0.05, 0, T).castShadow = false; mesh(new THREE.BoxGeometry(12, 8, 0.3), mat(0x5a8ac8), 0, 4, -3, T);
mesh(new THREE.BoxGeometry(3.0, 1.0, 1.3), mat(0x8a4b20), 0, 0.5, -2.2, T); mesh(new THREE.BoxGeometry(3.1, 0.08, 1.4), mat(0xffd23a), 0, 1.02, -2.2, T);
for (let i = 0; i < 24; i++) { const a = i / 23 * Math.PI; noOut(mesh(new THREE.SphereGeometry(0.1, 6, 4), mat([0xffd23a, 0xffffff, 0x3f8fe0][i % 3]), Math.cos(a) * 1.3, 1.9 + Math.sin(a) * 1.5, -2.6, T)); }
const tl = [lamp(T, -1.2, 1.06, -1.8, 0.6), lamp(T, 1.2, 1.06, -1.8, 0.6)];
// ---------------- the cast
const C = makeCast(scene, [['k', 'krishna'], ['bh', 'bhishma'], ['ar', 'arjuna'], ['ak', 'krishna'], ['d1', 'devotee'], ['d2', 'gopi3'], ['d3', 'kid1']]);
addOutlines(scene);
const confetti = makeConfetti(scene, 50, 52);

function update(s, t) {
  const cx = camera.position.x, set = cx > 20 ? 40 : 0, hook = s < E.as, ending = s >= E.comment;
  const loopK = hook || ending;
  S.mood(0); S.hemi.intensity = 1.3; S.sun.target.position.set(set, 0, 0); S.sun.position.set(set - 8, 14, 10); S.sun.target.updateMatrixWorld();
  // armies: Pandava soldiers fall while Bhishma fights
  const fallen = Math.floor(clamp((s - E.bhishma) / (E.but - E.bhishma)) * 80);
  armies.forEach((A, ai) => A.P.forEach(([x, z, r], i) => { const down = ai === 1 && i < fallen && !loopK; e3.set(0, 0, down ? (r > 0.5 ? 1.4 : -1.4) : Math.sin(t * 3 + i) * 0.03); q.setFromEuler(e3);
    m4.compose(V(x, down ? 0.2 : 0.35, z), q, one); A.body.setMatrixAt(i, m4); m4.compose(V(x + (down ? (r > 0.5 ? -0.4 : 0.4) : 0), down ? 0.2 : 0.83, z), q, one); A.head.setMatrixAt(i, m4); }));
  armies.forEach((A) => { A.body.visible = A.head.visible = set === 0; A.body.instanceMatrix.needsUpdate = A.head.instanceMatrix.needsUpdate = true; });
  // arrows from Bhishma's chariot across the field
  const volley = loopK || (s >= E.bhishma - 0.3 && s < E.dropped);
  arrows.forEach(({ g, ph, z, y }) => { const u = (t * 0.9 + ph) % 1; g.visible = set === 0 && volley; g.position.set(lerp(-3.6, 9, u), y + Math.sin(u * Math.PI) * 0.8, z); g.rotation.z = Math.cos(u * Math.PI) * -0.5; });
  // --- Bhishma on his chariot: the bow; drops it and smiles
  const dropped = s >= E.dropped && !loopK;
  pose(C.bh, camera, { visible: set === 0, x: -4.2, y: 0.95, z: -0.8, h: 1.78, mood: dropped || s >= E.k4 ? 'happy' : (s >= E.stay && s < E.as) ? 'happy' : s >= E.but && s < E.so ? 'smug' : 'normal', bow: !dropped, arm: dropped ? 'up' : 'offer', flip: false });
  // --- Arjuna and Krishna on their chariot
  const onChariot = !loopK && s < E.leapt;
  pose(C.ar, camera, { visible: set === 0, x: 3.95, y: 0.95, z: 0.15, h: 1.72, mood: s >= E.arjuna && s < E.but ? 'sad' : s >= E.leapt ? 'wow' : 'normal', bow: true, arm: 'offer', flip: true });
  const jump = seg(s, E.leapt, E.leapt + 0.6), runU = sm(seg(s, E.ran - 0.2, E.wait));
  const kp = loopK ? V(-0.4, 0, 0.6) : onChariot ? V(3.0, 0.95, 0.6) : s < E.lifted ? V(lerp(3.0, 1.9, jump), 0.95 * (1 - jump) + Math.sin(jump * Math.PI) * 0.6, lerp(0.6, 0.9, jump)) : V(lerp(1.7, -2.0, runU), 0, lerp(0.9, 0.5, runU));
  const raised = loopK || (s >= E.lifted + 0.2 && s < E.k4 + 0.6), lowered = s >= E.k4 + 0.6 && !loopK;
  const running = loopK || (runU > 0 && runU < 1);
  pose(C.k, camera, { visible: set === 0, x: kp.x, y: kp.y, z: kp.z, h: 1.72, mood: s >= E.smiled && !loopK ? 'happy' : 'normal', arm: raised ? 'up' : s >= E.lifted - 0.2 && s < E.lifted + 0.2 ? 'offer' : 'down', step: running ? s * 4 : 0, flip: true });
  WH.visible = set === 0 && (loopK || s >= E.as); const lift = sm(seg(s, E.lifted - 0.2, E.lifted + 0.3));
  if (raised || (s >= E.lifted - 0.2 && !lowered)) WH.position.copy(kp).add(V(0, lerp(0.55, 2.2, loopK ? 1 : lift), 0.08)); else if (lowered) WH.position.copy(kp).add(V(0.7, 0.55, 0.2)); else WH.position.set(1.6, 0.08, 1.0);
  WH.quaternion.copy(camera.quaternion); if (!raised && !lowered && s < E.lifted - 0.2) WH.rotation.set(-Math.PI / 2, 0, 0.4); WH.rotateZ(running ? Math.sin(t * 8) * 0.08 : 0);
  whGlow.visible = WH.visible && raised; whGlow.position.copy(WH.position); whGlow.quaternion.copy(camera.quaternion); whGlow.material.opacity = 0.18 + 0.06 * Math.sin(t * 5);
  dust.forEach((d, i) => { const u = (t * 1.2 + i / 12) % 1; d.visible = set === 0 && running; d.position.set(kp.x + 0.3 + u * 0.8, 0.15 + u * 0.4, kp.z + Math.sin(i * 2.3) * 0.3); d.scale.setScalar(0.5 + u); d.material.opacity = 0.35 * (1 - u); });
  // --- today
  pose(C.ak, camera, { visible: set === 40, x: 40, y: 1.06, z: -2.3, h: 1.55, mood: 'happy', flute: true });
  tl.forEach((l, i) => (l.flame.scale.y = 1 + 0.15 * Math.sin(t * 13 + i)));
  pose(C.d1, camera, { visible: set === 40, x: 41.3, z: 0.9, h: 1.65, sitting: true, mood: 'closed', arm: 'up', flip: true });
  pose(C.d2, camera, { visible: set === 40, x: 38.8, z: 0.8, h: 1.6, mood: 'happy', arm: 'down' });
  pose(C.d3, camera, { visible: set === 40, x: 38.4, z: 1.2, h: 1.1, mood: 'happy', arm: 'up' });
  confetti(E.comment, s, V(-1, 3, 0.6));
  S.clouds.forEach((c, i) => { c.position.x = -80 + i * 15 + ((t * 0.6 + i * 3) % 12); });
}

const G = (t) => t;
const HOOK = [[-2.0, 1.6, 3.6], [-0.4, 1.75, 0.6]];
const SHOTS = [
  [0, E.stay - 0.05, G, HOOK, HOOK, [62, 34], { move: 'dolly' }],
  [E.stay - 0.05, E.as - 0.05, G, [[-3.4, 2.5, 2.2], [-4.2, 2.4, -0.8]], [[-3.5, 2.5, 1.8], [-4.2, 2.4, -0.8]]],
  [E.as - 0.05, E.bhishma - 0.05, G, [[0, 7, 19], [0, 0.6, -1.5]], [[0, 4.0, 15], [0, 1.2, -1]], 50, { move: 'pull' }],
  [E.bhishma - 0.05, E.arjuna - 0.05, G, [[-1.6, 2.3, 4.6], [-3.6, 1.9, -0.6]], [[-1.2, 2.2, 4.4], [-3.0, 1.9, -0.6]]],
  [E.arjuna - 0.05, E.but - 0.05, G, [[3.6, 2.2, 3.6], [3.7, 1.9, 0.3]], [[3.6, 2.2, 3.2], [3.7, 1.9, 0.3]]],
  [E.but - 0.05, E.so - 0.05, G, [[-3.2, 1.7, 2.4], [-4.2, 2.4, -0.8]], [[-3.3, 1.7, 2.1], [-4.2, 2.4, -0.8]]],
  [E.so - 0.05, E.lifted - 0.05, G, [[5.4, 1.8, 5.0], [2.6, 1.3, 0.6]], [[5.0, 1.6, 4.6], [2.4, 1.2, 0.7]]],
  [E.lifted - 0.05, E.ran - 0.05, G, [[1.9, 1.4, 4.0], [1.7, 1.5, 0.9]], [[1.9, 1.4, 3.6], [1.7, 1.7, 0.9]]],
  [E.ran - 0.05, E.wait - 0.05, G, [[1.8, 1.7, 5.4], [1.4, 1.5, 0.8]], [[-1.0, 1.7, 5.2], [-1.9, 1.5, 0.5]]],
  [E.wait - 0.05, E.b4 - 0.05, G, [[-1.4, 2.0, 5.2], [-2.0, 2.25, 0.5]], [[-1.45, 2.0, 4.8], [-2.0, 2.25, 0.5]]],
  [E.b4 - 0.05, E.k4 - 0.05, G, [[-3.4, 2.3, 2.4], [-4.2, 2.4, -0.8]], [[-3.4, 2.3, 2.4], [-4.2, 2.4, -0.8]], [62, 38], { move: 'dolly' }],
  [E.k4 - 0.05, E.thats - 0.05, G, [[-0.8, 1.4, 5.4], [-2.8, 1.5, -0.1]], [[-0.4, 3.2, 7.2], [-2.8, 1.4, -0.1]], 50, { move: 'crane', lift: 1.0 }],
  [E.thats - 0.05, E.comment - 0.05, G, [[40, 3.0, 8.0], [40, 1.8, -2]], [[40, 2.3, 4.8], [40, 1.6, -1.2]], 50, { move: 'land' }],
  [E.comment - 0.05, DURATION + 0.1, G, [[-2.4, 1.5, 4.0], [-0.4, 1.7, 0.6]], HOOK],
];
direct({ stage, WORDS, DURATION, shots: SHOTS, update, title: 1.4, q: [E.wait, E.b4], cta: E.comment, prog: [E.but, E.thats], pin: E.wait,
  key: ['krishna', 'swore', 'weapon', 'broke', 'promise', 'beautiful', 'bhishma', 'unstoppable', 'arjuna', 'grandfather', 'heart', 'vowed', 'leapt', 'wheel', 'ran', 'wait', 'word', 'dropped', 'smiled', "devotee's", 'bends', 'devotee', 'comment', 'send'],
  loc: (t) => (t >= E.as - 0.05 && t < E.bhishma ? '📍 KURUKSHETRA' : t >= E.thats - 0.05 && t < E.comment ? 'EVEN TODAY' : ''), shakes: [E.leapt + 0.5, E.dropped], tick: () => {} });
