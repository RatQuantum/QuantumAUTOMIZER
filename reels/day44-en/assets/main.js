// Day 44 · "Why Rath Yatra?" · Why we do what we do #26 (as the story goes: Subhadra wants to see the city)
// Strategy 8 hook/tracker/pinned CTA + Strategy 9 camera moves (dolly zoom, crane, pull back, land).
// Sets: inside the Puri temple (origin), the Grand Road (x = 40) with three chariots facing +z toward the crowd.
import * as THREE from './three.module.js';
import { rng, mat, mesh, sm, seg, lerp, clamp, setupScene, makeCast, pose, lamp } from './kit.js';
import { makeStage, direct, wordTime } from './director.js';
import { addOutlines, makeConfetti } from './plus.js';
import { WORDS, DURATION } from './data.js';

const stage = makeStage(), { scene, camera } = stage, V = (x, y, z) => new THREE.Vector3(x, y, z), R = rng(44);
const S = setupScene(scene, [[0, 0], [40, 2]], 44);
const WT = wordTime(WORDS);
const E = { as: WT('as'), subhadra: WT('subhadra'), brothers: WT('brothers'), so: WT('so'), built: WT('built'), sixteen: WT('sixteen'), fourteen: WT('fourteen'), twelve: WT('twelve'), wait: WT('wait'), not: WT('not'),
  us: WT('us'), lakhs: WT('lakhs'), and2: WT('even') - 0.08, king: WT('king', 2), golden: WT('golden'), thats: WT("that's"), once2: WT('once', 2), anyone: WT('anyone'), comment: WT('comment') };
const glow = (c, o = 0.5) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, depthWrite: false, blending: THREE.AdditiveBlending });
const noOut = (m) => { m.userData.noOutline = true; m.castShadow = false; return m; };
function faceTex(bg, eye, rim, small) {
  const c = document.createElement('canvas'); c.width = 256; c.height = 256; const x = c.getContext('2d');
  x.fillStyle = bg; x.fillRect(0, 0, 256, 256);
  const r = small ? 34 : 46, ey = small ? 112 : 104;
  for (const ex of [70, 186]) { x.beginPath(); if (eye === 'round') x.arc(ex, ey, r, 0, 7); else x.ellipse(ex, ey, r * 1.1, r * 0.8, 0, 0, 7); x.fillStyle = '#ffffff'; x.fill(); x.lineWidth = 9; x.strokeStyle = rim; x.stroke(); x.beginPath(); x.arc(ex, ey, r * 0.45, 0, 7); x.fillStyle = '#111111'; x.fill(); }
  x.beginPath(); x.arc(128, 170, 52, 0.15 * Math.PI, 0.85 * Math.PI); x.lineWidth = 14; x.strokeStyle = '#e0213a'; x.stroke();
  x.fillStyle = '#e0213a'; x.beginPath(); x.moveTo(128, 20); x.lineTo(116, 62); x.lineTo(140, 62); x.closePath(); x.fill(); x.fillStyle = '#ffffff'; x.fillRect(122, 40, 12, 26);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
function deity(parent, x, z, kind, k = 1) {
  const g = new THREE.Group(); g.position.set(x, 0, z); g.scale.setScalar(k); parent.add(g);
  const spec = { jagannath: ['#1a1a1a', 'round', '#e0213a', 0x1a1a1a, 0xffd23a, false], bala: ['#f2efe6', 'oval', '#e0213a', 0xf2efe6, 0x2f6fa8, false], subhadra: ['#f6c83a', 'oval', '#e0213a', 0xf6c83a, 0xe0213a, true] }[kind];
  const skin = mat(spec[3], { r: 0.6 }), cloth = mat(spec[4], { r: 0.6 }), small = spec[5];
  mesh(new THREE.CylinderGeometry(0.42, 0.5, 1.0, 10), cloth, 0, 0.5, 0, g);
  for (let i = 0; i < 3; i++) noOut(mesh(new THREE.CylinderGeometry(0.43 + i * 0.02, 0.43 + i * 0.02, 0.06, 10), mat([0xe0213a, 0xffd23a, 0x2f9d5a][i]), 0, 0.2 + i * 0.3, 0, g));
  const head = new THREE.Group(); head.position.y = small ? 1.45 : 1.55; g.add(head);
  mesh(new THREE.BoxGeometry(small ? 0.85 : 1.1, small ? 0.85 : 1.05, 0.8), skin, 0, 0, 0, head);
  noOut(mesh(new THREE.PlaneGeometry(small ? 0.8 : 1.04, small ? 0.8 : 1.0), new THREE.MeshBasicMaterial({ map: faceTex(spec[0], spec[1], spec[2], small) }), 0, 0, 0.405, head));
  const crown = mesh(new THREE.CylinderGeometry(small ? 0.36 : 0.5, small ? 0.44 : 0.58, 0.32, 10), mat(0xffd23a, { m: 0.6, r: 0.35 }), 0, small ? 0.58 : 0.68, 0, head);
  for (let i = 0; i < 7; i++) { const a = i / 7 * Math.PI * 2; mesh(new THREE.ConeGeometry(0.07, 0.24, 4), mat(0xffd23a, { m: 0.6, r: 0.35 }), Math.cos(a) * (small ? 0.36 : 0.5), small ? 0.85 : 0.95, Math.sin(a) * (small ? 0.36 : 0.5), head); }
  const arms = small ? [] : [-1, 1].map((sd) => { const a = mesh(new THREE.CylinderGeometry(0.11, 0.13, 0.62, 8).rotateX(Math.PI / 2), skin, sd * 0.42, 1.0, 0.36, g); return a; });
  return { g, head, arms };
}

// ---------------- inside the temple: the three deities on the jewelled platform
mesh(new THREE.BoxGeometry(12, 0.1, 9), mat(0xf3e6c8), 0, 0.05, 0, scene).castShadow = false; mesh(new THREE.BoxGeometry(12, 8, 0.3), mat(0x9a2a3a), 0, 4, -3.6, scene);
mesh(new THREE.BoxGeometry(6, 0.7, 2.2), mat(0x7a4a22), 0, 0.35, -2.4, scene); mesh(new THREE.BoxGeometry(6.1, 0.08, 2.3), mat(0xffd23a), 0, 0.72, -2.4, scene);
const TD = [deity(scene, -1.8, -2.4, 'bala', 1.0), deity(scene, 0.0, -2.6, 'subhadra', 0.85), deity(scene, 1.8, -2.4, 'jagannath', 1.05)]; TD.forEach((d) => (d.g.position.y = 0.76));
for (let i = 0; i < 24; i++) { const u = i / 23; noOut(mesh(new THREE.SphereGeometry(0.1, 6, 4), mat(i % 2 ? 0xf6a531 : 0xffffff), -3.2 + u * 6.4, 4.5 - Math.sin(u * Math.PI) * 0.7, -3.3, scene)); }
const tl = [lamp(scene, -3.4, 0.1, -1.0, 1.0), lamp(scene, 3.4, 0.1, -1.0, 1.0)];
const door = noOut(mesh(new THREE.PlaneGeometry(3, 5), glow(0xfff0c0, 0), 0, 2.5, 4.4, scene)); door.rotation.y = Math.PI;
// ---------------- the Grand Road (x = 40)
mesh(new THREE.BoxGeometry(16, 0.06, 60), mat(0xd9c08a), 40, 0.03, -6, scene).castShadow = false;
for (let i = 0; i < 10; i++) for (const sd of [-1, 1]) { const g = new THREE.Group(); g.position.set(40 + sd * 7.6, 0, -30 + i * 5.5); scene.add(g); mesh(new THREE.BoxGeometry(2.4, 2.4 + (i % 3) * 0.6, 2.6), mat([0xf3e2b8, 0xe0b07a, 0xf6d9a0][i % 3]), 0, 1.2 + (i % 3) * 0.3, 0, g); mesh(new THREE.BoxGeometry(2.6, 0.2, 2.8), mat(0xd8573a), 0, 2.5 + (i % 3) * 0.6, 0, g); }
const STRIPE = { jagannath: [0xd8263a, 0xffd23a], bala: [0xd8263a, 0x2f9d5a], subhadra: [0xd8263a, 0x1d1a24] };
function chariot(x, z, kind, wheels, k) {
  const g = new THREE.Group(); g.position.set(x, 0, z); g.scale.setScalar(k); scene.add(g);
  const wood = mat(0x8a5a2a), cols = STRIPE[kind];
  mesh(new THREE.BoxGeometry(3.4, 0.6, 4.2), wood, 0, 1.5, 0, g); mesh(new THREE.BoxGeometry(3.0, 1.0, 3.6), mat(0xffd23a), 0, 2.3, 0, g);
  const W = []; for (let i = 0; i < wheels / 2; i++) for (const sd of [-1, 1]) { const w = new THREE.Group(); w.position.set(sd * 1.85, 0.95, -1.8 + i * (3.6 / (wheels / 2 - 1))); g.add(w); mesh(new THREE.TorusGeometry(0.9, 0.12, 6, 18).rotateY(Math.PI / 2), wood, 0, 0, 0, w); for (let s = 0; s < 6; s++) { const sp = mesh(new THREE.BoxGeometry(0.06, 1.7, 0.06), mat(0xd9a441), 0, 0, 0, w); sp.rotation.x = s / 6 * Math.PI; } W.push(w); }
  for (let i = 0; i < 6; i++) mesh(new THREE.CylinderGeometry(1.9 - i * 0.28, 2.0 - i * 0.28, 0.85, 12), mat(cols[i % 2]), 0, 4.7 + i * 0.85, 0, g);
  mesh(new THREE.ConeGeometry(0.35, 1.2, 10), mat(0xffd23a, { m: 0.5, r: 0.4 }), 0, 10.3, 0, g); const flag = mesh(new THREE.BoxGeometry(0.9, 0.5, 0.04), mat(cols[0]), 0.5, 11.0, 0, g); for (const [px, pz] of [[-1.3, -1.5], [1.3, -1.5], [-1.3, 1.5], [1.3, 1.5]]) mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.6, 8), mat(0xffd23a, { m: 0.4, r: 0.4 }), px, 3.6, pz, g);
  for (let i = 0; i < 4; i++) { const h = mesh(new THREE.BoxGeometry(0.5, 0.7, 1.4), mat([0xffffff, 0x1d1a24, 0xd8463a, 0x6b4a2a][i % 4]), -1.2 + i * 0.8, 1.6, 2.9, g); }
  const d = deity(g, 0, 0.6, kind, 0.85); d.g.position.y = 2.8;
  return { g, W, flag };
}
const CH = [chariot(40, -16, 'bala', 14, 0.9), chariot(40, -24, 'subhadra', 12, 0.8), chariot(40, -6, 'jagannath', 16, 1.0)];
const ropes = []; for (const sd of [-0.6, 0.6]) { const r = mesh(new THREE.CylinderGeometry(0.08, 0.08, 1, 6), mat(0xc9a46a), 0, 0, 0, scene); ropes.push({ r, sd }); }
// the crowd pulling (instanced), in two lines along the ropes, and a sea behind
const N = 520, body = new THREE.InstancedMesh(new THREE.CapsuleGeometry(0.16, 0.42, 4, 8), new THREE.MeshStandardMaterial({ roughness: 0.8 }), N), head = new THREE.InstancedMesh(new THREE.SphereGeometry(0.14, 10, 8), mat(0xc98a5e), N), arms = new THREE.InstancedMesh(new THREE.BoxGeometry(0.06, 0.06, 0.5), mat(0xc98a5e), N);
[body, head, arms].forEach((m) => { m.userData.noOutline = true; scene.add(m); });
const CP = []; const cc = new THREE.Color(); for (let i = 0; i < N; i++) { const onRope = i < 120; const zr = 0.5 + Math.floor(i / 2) * 0.55; CP.push(onRope ? [40 + (i % 2 ? 0.6 : -0.6) + (i % 4 < 2 ? 0.3 : -0.3), zr < 3.0 ? zr + 26 : zr > 11.2 && zr < 15.2 ? zr + 4.2 : zr, R() * 6, 1] : [40 + (R() - 0.5) * 13, 2 + R() * 34, R() * 6, 0]); body.setColorAt(i, cc.set([0xf6f1e2, 0xffd23a, 0xe8462c, 0xf06aa0, 0x3f8fe0, 0xf6a531][i % 6])); }
const m4 = new THREE.Matrix4(), q = new THREE.Quaternion();
const gulal = []; for (let i = 0; i < 30; i++) gulal.push(noOut(mesh(new THREE.SphereGeometry(0.3, 8, 6), new THREE.MeshBasicMaterial({ color: [0xffd23a, 0xe8306a, 0xf6a531][i % 3], transparent: true, opacity: 0.4, depthWrite: false }), 0, 0, 0, scene)));
const broom = new THREE.Group(); scene.add(broom); mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.4, 6), mat(0xffd23a, { m: 0.8, r: 0.25 }), 0, 0, 0, broom); mesh(new THREE.ConeGeometry(0.22, 0.5, 8), mat(0xffd23a, { m: 0.6, r: 0.3, e: 0xffa020, ei: 0.3 }), 0, -0.85, 0, broom);
const sweepDust = []; for (let i = 0; i < 12; i++) sweepDust.push(noOut(mesh(new THREE.SphereGeometry(0.12, 6, 4), glow(0xffe08a, 0.6), 0, 0, 0, scene)));
// ---------------- the cast
const C = makeCast(scene, [['king', 'king'], ['p1', 'devotee'], ['kid', 'kid2'], ['girl', 'kid3'], ['granny', 'yashoda']]);
addOutlines(scene);
const confetti = makeConfetti(scene, 80, 44);

function update(s, t) {
  const road = camera.position.x > 20;
  S.mood(0); S.hemi.intensity = road ? 1.5 : 1.3; S.sun.target.position.set(road ? 40 : 0, 0, road ? -6 : 0); S.sun.position.set((road ? 40 : 0) - 8, 16, 10); S.sun.target.updateMatrixWorld();
  tl.forEach((l, i) => (l.flame.scale.y = 1 + 0.15 * Math.sin(t * 13 + i)));
  // Subhadra looks out: the doorway glows
  door.material.opacity = sm(seg(s, E.subhadra, E.subhadra + 1)) * (1 - sm(seg(s, E.so, E.so + 0.6))) * 0.5;
  TD[1].head.rotation.y = sm(seg(s, E.subhadra, E.subhadra + 0.8)) * (1 - sm(seg(s, E.so, E.so + 0.6))) * -0.5;
  // the chariots roll when the crowd pulls; wheels turn; flags wave
  const pulling = s >= E.us - 0.2 || s < E.as, roll = pulling ? (s < E.as ? s : s - E.us + 0.2) * 0.35 : 0;
  CH.forEach((c, i) => { c.g.position.z = [-16, -24, -6][i] + roll; c.W.forEach((w) => (w.rotation.x = roll / 0.9)); c.flag.rotation.y = Math.sin(t * 3 + i) * 0.3; });
  // build-up: the chariots grow tier by tier while the wheels are counted
  const jag = CH[2];
  ropes.forEach(({ r, sd }) => { const a = V(40 + sd, 0.9, jag.g.position.z + 3.4), b = V(40 + sd, 0.6, jag.g.position.z + 3.4 + 34); r.position.copy(a.clone().add(b).multiplyScalar(0.5)); r.scale.set(1, a.distanceTo(b), 1); r.lookAt(b); r.rotateX(Math.PI / 2); r.visible = road; });
  for (let i = 0; i < N; i++) { const [x, z0, ph, onRope] = CP[i]; const z = jag.g.position.z + 3.4 + z0; const lean = onRope && pulling ? 0.35 + Math.sin(t * 5 + ph) * 0.08 : 0; const bob = Math.abs(Math.sin(t * 4 + ph)) * (pulling ? 0.08 : 0.02);
    q.setFromAxisAngle(V(1, 0, 0), lean); m4.compose(V(x, 0.38 + bob, z), q, V(1, 1, 1)); body.setMatrixAt(i, m4); m4.compose(V(x, 0.86 + bob, z + lean * 0.4), q, V(1, 1, 1)); head.setMatrixAt(i, m4);
    m4.compose(V(x, onRope ? 0.85 : 1.2 + Math.sin(t * 3 + ph) * 0.15, z - (onRope ? 0.25 : 0)), q, onRope || ph > 3 ? V(1, 1, 1) : V(0, 0, 0)); arms.setMatrixAt(i, m4); }
  [body, head, arms].forEach((m) => { m.instanceMatrix.needsUpdate = true; m.visible = road; });
  gulal.forEach((m, i) => { const u = (t * 0.3 + i / 30) % 1; m.visible = road && pulling; m.position.set(40 + Math.sin(i * 2.3) * 5, 1.5 + u * 4, jag.g.position.z + 6 + (i % 10) * 2.5); m.scale.setScalar(1 + u * 2); m.material.opacity = 0.35 * (1 - u); });
  // the king sweeps the road with a golden broom
  const KZ = jag.g.position.z + 5.2, sweep = Math.sin(t * 4);
  pose(C.king, camera, { visible: road, x: 40.6, z: KZ, h: 1.75, mood: 'closed', arm: 'offer' });
  { const right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0); right.y = 0; right.normalize(); broom.visible = road; broom.position.set(40.6, 0, KZ).add(right.multiplyScalar(0.55 + sweep * 0.15)).add(V(0, 0.95, 0.15)); broom.rotation.set(0.2, 0, -0.5 - sweep * 0.35); }
  sweepDust.forEach((d, i) => { const u = (t * 1.3 + i / 12) % 1; d.visible = road && s >= E.and2; d.position.set(41.2 + sweep * 0.3 + u * 0.6, 0.1 + u * 0.4, KZ + 0.4 + (i % 3) * 0.1); d.scale.setScalar(0.4 + u); d.material.opacity = 0.5 * (1 - u); });
  // anyone can touch the rope: a granny, a kid, a girl
  [['granny', 39.15, 0.0], ['kid', 40.85, 0.8], ['girl', 39.1, 1.6], ['p1', 40.9, 2.4]].forEach(([n, x, dz], i) => pose(C[n], camera, { visible: road && s >= E.once2 - 0.3, x, z: jag.g.position.z + 3.4 + 12 + dz, h: n === 'kid' || n === 'girl' ? 1.15 : 1.6, mood: 'happy', arm: 'offer', flip: x > 40 }));
  confetti(E.once2, s, V(40, 4, jag.g.position.z + 10));
  S.clouds.forEach((c, i) => { c.position.x = -80 + i * 15 + ((t * 0.6 + i * 3) % 12); });
}

const G = (t) => t, ROLL = (t) => E.lakhs + 1 + t * 0.6;
const SHOTS = [
  [0, E.as - 0.05, ROLL, [[40, 3.2, 10], [40, 4.8, -4]], [[40, 3.2, 10], [40, 4.8, -4]], [60, 30], { move: 'dolly' }],
  [E.as - 0.05, E.subhadra - 0.05, G, [[0, 3.2, 9], [0, 2.2, -2.4]], [[0, 2.6, 6.6], [0, 2.0, -2.4]], 50, { move: 'land' }],
  [E.subhadra - 0.05, E.so - 0.05, G, [[0.3, 2.3, 1.6], [0, 2.2, -2.6]], [[0.2, 2.3, 1.3], [0, 2.2, -2.6]]],
  [E.so - 0.05, E.sixteen - 0.05, G, [[45.2, 1.4, 0], [40, 2.5, -6]], [[47, 8.0, 2], [40, 7.0, -6]], 50, { move: 'crane', lift: 2 }],
  [E.sixteen - 0.05, E.fourteen - 0.05, G, [[43.4, 1.2, -2.5], [41.85, 0.95, -6]], [[43.2, 1.2, -3.2], [41.85, 0.95, -6]]],
  [E.fourteen - 0.05, E.twelve - 0.05, G, [[44.6, 3.0, -9.5], [40, 3.2, -16]], [[44.2, 3.0, -10], [40, 3.2, -16]]],
  [E.twelve - 0.05, E.wait - 0.05, G, [[44.6, 3.0, -17.5], [40, 3.0, -24]], [[44.2, 3.0, -18], [40, 3.0, -24]]],
  [E.wait - 0.05, E.us - 0.05, G, [[40, 2.0, 3.6], [40, 3.0, -6]], [[40, 2.0, 3.2], [40, 3.2, -6]]],
  [E.us - 0.05, E.and2 - 0.05, G, [[40, 2.0, 6], [40, 1.5, 0]], [[40, 16, 34], [40, 0, 6]], 50, { move: 'pull' }],
  [E.and2 - 0.05, E.thats - 0.05, G, [[44.4, 3.0, 4.6], [40.6, 1.2, 0.3]], [[42.8, 2.0, 4.8], [40.6, 1.1, 1.3]], 50, { move: 'land' }],
  [E.thats - 0.05, E.once2 - 0.05, G, [[34, 9, 30], [40, 3, 0]], [[46, 9, 30], [40, 3, 0]]],
  [E.once2 - 0.05, E.anyone - 0.05, G, [[40, 4.0, 6.0], [40, 4.6, -3]], [[40, 4.0, 6.0], [40, 4.6, -3]], [62, 30], { move: 'dolly' }],
  [E.anyone - 0.05, E.comment - 0.05, G, [[43.6, 2.4, 18.4], [40, 0.9, 14.0]], [[42.6, 1.8, 17.4], [40, 0.9, 14.0]], 50, { move: 'land' }],
  [E.comment - 0.05, DURATION + 0.1, G, [[40, 3.2, 12], [40, 3.8, -4]], [[40, 3.2, 11], [40, 3.8, -4]]],
];
direct({ stage, WORDS, DURATION, shots: SHOTS, update, title: 1.6, q: [E.wait, E.not], cta: E.comment, prog: [E.wait, E.thats], pin: E.wait,
  key: ['god', 'temple', 'sister', 'story', 'puri', 'subhadra', 'brothers', 'city', 'jagannath', 'balabhadra', 'chariots', 'sixteen', 'fourteen', 'twelve', 'wheels', 'wait', 'pulls', 'horses', 'kings', 'us', 'lakhs', 'ropes', 'king', 'sweeps', 'golden', 'broom', 'rath', 'yatra', 'people', 'anyone', 'rope', 'comment'],
  loc: (t) => (t >= E.as - 0.05 && t < E.subhadra - 0.05 ? '📍 JAGANNATH TEMPLE · PURI' : t >= E.so - 0.05 && t < E.sixteen - 0.05 ? '📍 THE GRAND ROAD' : ''), shakes: [], tick: () => {} });
