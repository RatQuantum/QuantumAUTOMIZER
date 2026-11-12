// Day 23 · "Why tie a rakhi?" · Why we do what we do #5 (as the story goes: Krishna and Draupadi, told as one)
// Sets: the palace hall at Indraprastha (origin), the cruel court years later (x = 40), a home today (x = 80).
import * as THREE from './three.module.js';
import { rng, mat, mesh, sm, seg, lerp, clamp, setupScene, makeCast, pose, lamp } from './kit.js';
import { makeStage, direct, wordTime } from './director.js';
import { addOutlines, makeConfetti } from './plus.js';
import { WORDS, DURATION } from './data.js';

const stage = makeStage(), { scene, camera } = stage, V = (x, y, z) => new THREE.Vector3(x, y, z), R = rng(23);
const S = setupScene(scene, [[0, 0], [40, 0], [80, 0]], 23);
const WT = wordTime(WORDS);
const E = { but: WT('but'), as: WT('as'), it: WT('it'), indra: WT('indraprastha'), royal: WT('royal'), krishna: WT('krishna'), cut: WT('cut'), bleed: WT('bleed'),
  everyone: WT('everyone'), servants: WT('servants'), ministers: WT('ministers'), nobody: WT('nobody'), draupadi: WT('draupadi'), tears: WT('tears'), silk: WT('silk'),
  ties: WT('ties'), krishna2: WT('krishna', 2), knot: WT('knot'), smiles: WT('smiles'), for2: WT('every', 3) - 0.25, protect: WT('protect'), wait: WT('wait'), years: WT('years'),
  pull: WT('pull'), calls: WT('calls'), never: WT('never'), ends: WT('ends'), tft: WT('thread', 4), thats: WT("that's"), today: WT('today'), rakhi2: WT('rakhi', 2),
  promise2: WT('promise', 2), send: WT('send'), comment: WT('comment') };
const HT = E.rakhi2 + 0.1; // the home rakhi is tied over [HT, HT + 1]
const glow = (c, o = 0.5) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, depthWrite: false, blending: THREE.AdditiveBlending });
const noOut = (m) => { m.userData.noOutline = true; m.castShadow = false; return m; };

// ---------------- the palace hall at Indraprastha (origin)
const P = new THREE.Group(); scene.add(P);
mesh(new THREE.BoxGeometry(14, 0.2, 16), mat(0xf3ead8), 0, 0.1, -2, P).castShadow = false;
for (let i = 0; i < 7; i++) for (let j = 0; j < 8; j++) if ((i + j) % 2) noOut(mesh(new THREE.BoxGeometry(2, 0.02, 2), mat(0xe2d3b4), -6 + i * 2, 0.21, -9 + j * 2, P));
noOut(mesh(new THREE.BoxGeometry(2.2, 0.03, 13), mat(0xc0213a), 0, 0.22, -1.5, P));
for (const z of [-8, -5, -2, 1]) for (const x of [-4, 4]) {
  mesh(new THREE.CylinderGeometry(0.32, 0.38, 5, 10), mat(0xfaf5ea), x, 2.7, z, P);
  mesh(new THREE.BoxGeometry(0.95, 0.3, 0.95), mat(0xe8b23a, { m: 0.4, r: 0.4 }), x, 5.3, z, P); mesh(new THREE.BoxGeometry(0.95, 0.3, 0.95), mat(0xe8b23a, { m: 0.4, r: 0.4 }), x, 0.35, z, P);
}
for (const x of [-4, 4]) mesh(new THREE.BoxGeometry(0.9, 0.5, 10.5), mat(0xf3ead8), x, 5.65, -3.5, P);
mesh(new THREE.BoxGeometry(14, 7, 0.4), mat(0xf6e6c8), 0, 3.5, -9.6, P);
const arch = mesh(new THREE.TorusGeometry(2.2, 0.25, 6, 18, Math.PI), mat(0xe8b23a, { m: 0.4, r: 0.4 }), 0, 3.4, -9.35, P);
mesh(new THREE.BoxGeometry(4.4, 3.4, 0.1), mat(0x7a1f5a), 0, 1.9, -9.37, P);
// the throne platform and the throne
mesh(new THREE.BoxGeometry(5, 0.35, 2.4), mat(0xe2d3b4), 0, 0.37, -8.0, P); mesh(new THREE.BoxGeometry(4, 0.3, 1.8), mat(0xe2d3b4), 0, 0.65, -8.2, P);
mesh(new THREE.BoxGeometry(1.3, 0.6, 1.0), mat(0xe8b23a, { m: 0.5, r: 0.35 }), 0, 1.1, -8.3, P); mesh(new THREE.BoxGeometry(1.3, 1.6, 0.2), mat(0xe8b23a, { m: 0.5, r: 0.35 }), 0, 1.8, -8.75, P);
mesh(new THREE.BoxGeometry(1.0, 0.18, 0.8), mat(0xc0213a), 0, 1.45, -8.25, P);
// garland strings between the pillars
for (const x of [-4, 4]) for (let k = 0; k < 3; k++) { const z0 = -8 + k * 3; for (let i = 0; i <= 12; i++) { const u = i / 12; noOut(mesh(new THREE.SphereGeometry(0.1, 6, 4), mat(i % 2 ? 0xf6a531 : 0xffe9a8), x, 4.9 - Math.sin(u * Math.PI) * 0.7, z0 + u * 3, P)); } }
// the ceremony: the fire altar, offerings, lamps
const havan = new THREE.Group(); havan.position.set(0, 0.2, -3.6); P.add(havan);
mesh(new THREE.CylinderGeometry(0.7, 0.55, 0.45, 4).rotateY(Math.PI / 4), mat(0xb5562c), 0, 0.22, 0, havan);
const fire = []; for (let i = 0; i < 4; i++) fire.push(noOut(mesh(new THREE.ConeGeometry(0.22 - i * 0.03, 0.7, 6), glow([0xffb02a, 0xff7a1e, 0xffd23a, 0xff5a1e][i], 0.85), (i - 1.5) * 0.13, 0.75, (i % 2) * 0.1 - 0.05, havan)));
const fireL = new THREE.PointLight(0xffa040, 4, 7, 1.6); fireL.position.set(0, 1.4, -3.6); P.add(fireL);
for (let i = 0; i < 5; i++) mesh(new THREE.SphereGeometry(0.12, 6, 4), mat([0xffd23a, 0xe8462c, 0xffffff, 0xf6a531, 0xffd23a][i]), -0.6 + i * 0.3, 0.32, -2.6, P);
const pl = [lamp(P, -1.6, 0.2, -3.6, 1.2), lamp(P, 1.6, 0.2, -3.6, 1.2)];
// the torn strip of silk (purple with a gold edge)
const strip = new THREE.Group(); scene.add(strip);
mesh(new THREE.BoxGeometry(0.42, 0.07, 0.02), mat(0x9a2a72, { r: 0.35 }), 0, 0, 0, strip); noOut(mesh(new THREE.BoxGeometry(0.42, 0.018, 0.025), mat(0xffd23a, { m: 0.5, r: 0.3 }), 0, -0.035, 0, strip));
const sparks = []; for (let i = 0; i < 14; i++) sparks.push(noOut(mesh(new THREE.OctahedronGeometry(0.035 + (i % 3) * 0.01, 0), glow(0xffd23a, 0.9), 0, 0, 0, scene)));

// ---------------- the cruel court, years later (x = 40)
const Q = new THREE.Group(); Q.position.set(40, 0, 0); scene.add(Q);
mesh(new THREE.BoxGeometry(14, 0.2, 14), mat(0x4a3a44), 0, 0.1, -1, Q).castShadow = false;
mesh(new THREE.BoxGeometry(14, 7, 0.4), mat(0x3a2a34), 0, 3.5, -6.5, Q);
for (const x of [-4.5, 4.5]) for (const z of [-5, -1.5, 2]) mesh(new THREE.CylinderGeometry(0.34, 0.4, 6, 8), mat(0x5a4652), x, 3, z, Q);
for (const x of [-2.6, 2.6]) noOut(mesh(new THREE.BoxGeometry(1.1, 3.4, 0.05), mat(0x8a1a2a), x, 4.2, -6.25, Q));
mesh(new THREE.BoxGeometry(4, 0.4, 1.8), mat(0x5a4652), 0, 0.4, -5.2, Q); mesh(new THREE.BoxGeometry(1.2, 1.6, 0.25), mat(0x8a6a2a, { m: 0.4, r: 0.5 }), 0, 1.4, -5.8, Q);
for (const x of [-4.2, 4.2]) mesh(new THREE.BoxGeometry(1.4, 0.45, 5), mat(0x5a4652), x, 0.42, -1.5, Q);
const torches = [-3.4, 3.4].map((x) => { mesh(new THREE.CylinderGeometry(0.06, 0.08, 1.6, 6), mat(0x4a2a1a), x, 2.4, -6.2, Q); return noOut(mesh(new THREE.ConeGeometry(0.16, 0.45, 6), glow(0xff8a2a, 0.9), x, 3.4, -6.2, Q)); });
// the endless sari: a ribbon from Draupadi to the man pulling it, and a heap that only grows
const sc = document.createElement('canvas'); sc.width = 256; sc.height = 32; { const c = sc.getContext('2d'); c.fillStyle = '#9a2a72'; c.fillRect(0, 0, 256, 32); c.fillStyle = '#ffd23a'; c.fillRect(0, 0, 256, 5); c.fillRect(0, 27, 256, 5); for (let i = 0; i < 8; i++) { c.beginPath(); c.arc(16 + i * 32, 16, 4, 0, 7); c.fill(); } }
const sTex = new THREE.CanvasTexture(sc); sTex.colorSpace = THREE.SRGBColorSpace; sTex.wrapS = THREE.RepeatWrapping; sTex.repeat.set(6, 1);
const NR = 40, rGeo = new THREE.BufferGeometry(), rPos = new Float32Array((NR + 1) * 2 * 3), rUv = new Float32Array((NR + 1) * 2 * 2), rIdx = [];
for (let i = 0; i <= NR; i++) { rUv.set([i / NR, 0, i / NR, 1], i * 4); if (i < NR) { const a = i * 2; rIdx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); } }
rGeo.setAttribute('position', new THREE.BufferAttribute(rPos, 3)); rGeo.setAttribute('uv', new THREE.BufferAttribute(rUv, 2)); rGeo.setIndex(rIdx);
const ribbon = noOut(new THREE.Mesh(rGeo, new THREE.MeshStandardMaterial({ map: sTex, side: THREE.DoubleSide, roughness: 0.45, emissive: 0xffc04a, emissiveIntensity: 0 }))); scene.add(ribbon);
const heap = []; for (let i = 0; i < 30; i++) { const m = noOut(mesh(new THREE.TorusGeometry(0.22 + R() * 0.12, 0.07, 5, 12).rotateX(Math.PI / 2).scale(1, 0.6, 1), new THREE.MeshStandardMaterial({ color: i % 3 ? 0x9a2a72 : 0xb8408a, roughness: 0.45, emissive: 0xffc04a, emissiveIntensity: 0 }), 0, 0, 0, scene)); m.userData.off = [(R() - 0.5) * 0.9, (R() - 0.5) * 0.7, R() * Math.PI]; heap.push(m); }
const beam = noOut(mesh(new THREE.CylinderGeometry(0.5, 1.3, 9, 16, 1, true), glow(0xffd88a, 0), 39.8, 4.5, -1.0, scene));
const halo = noOut(mesh(new THREE.SphereGeometry(1.0, 16, 12), glow(0xffd06a, 0), 39.8, 1.0, -1.0, scene));
const graceL = new THREE.PointLight(0xffc860, 0, 8, 1.4); graceL.position.set(39.8, 2.2, 0.2); scene.add(graceL);

// ---------------- a home today (x = 80)
const H = new THREE.Group(); H.position.set(80, 0, 0); scene.add(H);
mesh(new THREE.BoxGeometry(12, 0.1, 10), mat(0xe8d3a0), 0, 0.05, 0, H).castShadow = false;
noOut(mesh(new THREE.BoxGeometry(3.4, 0.02, 2.2), mat(0xd8463a), 0, 0.11, 0.6, H));
mesh(new THREE.BoxGeometry(12, 8, 0.3), mat(0xfbe3c4), 0, 4, -2.6, H);
mesh(new THREE.BoxGeometry(1.8, 1.6, 0.1), mat(0xffffff), -2.6, 2.6, -2.42, H); noOut(mesh(new THREE.BoxGeometry(1.6, 1.4, 0.12), mat(0x9fd4ff), -2.6, 2.6, -2.41, H));
mesh(new THREE.BoxGeometry(3.4, 0.55, 0.9), mat(0x3f8fa0), 0, 0.42, -1.9, H); mesh(new THREE.BoxGeometry(3.4, 0.9, 0.25), mat(0x3f8fa0), 0, 0.95, -2.3, H);
for (const x of [-1.55, 1.55]) mesh(new THREE.BoxGeometry(0.3, 0.75, 0.9), mat(0x2f7a8a), x, 0.55, -1.9, H);
for (let i = 0; i <= 20; i++) { const u = i / 20; noOut(mesh(new THREE.SphereGeometry(0.1, 6, 4), mat(i % 2 ? 0xf6a531 : 0xffd23a), -2.4 + u * 4.8, 3.4 - Math.sin(u * Math.PI) * 0.5, -2.4, H)); }
for (const x of [-2.4, 2.4]) for (let i = 0; i < 6; i++) noOut(mesh(new THREE.SphereGeometry(0.09, 6, 4), mat(i % 2 ? 0xf6a531 : 0xffd23a), x, 3.3 - i * 0.18, -2.4, H));
// low table with the thali: plate, lamp, sweets, kumkum and the rakhi
mesh(new THREE.BoxGeometry(1.2, 0.4, 0.7), mat(0x8a4b20), 0, 0.2, 1.5, H);
mesh(new THREE.CylinderGeometry(0.36, 0.33, 0.04, 20), mat(0xffd23a, { m: 0.7, r: 0.3 }), 0, 0.43, 1.5, H);
const hlamp = lamp(H, -0.15, 0.5, 1.5, 0.16);
for (let i = 0; i < 4; i++) mesh(new THREE.SphereGeometry(0.05, 6, 4), mat(0xffa94a), 0.12 + (i % 2) * 0.08, 0.48, 1.4 + Math.floor(i / 2) * 0.09, H);
mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.04, 10), mat(0xd8263a), 0.05, 0.47, 1.7, H);
const tRakhi = new THREE.Group(); tRakhi.position.set(-0.05, 0.48, 1.3); H.add(tRakhi);
mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.02, 12), mat(0xffd23a, { m: 0.5, r: 0.35 }), 0, 0, 0, tRakhi); noOut(mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.03, 8), mat(0xe8462c), 0, 0.01, 0, tRakhi));

// ---------------- the cast
const C = makeCast(scene, [['krishna', 'krishna'], ['draupadi', 'draupadi'], ['priest', 'priest'], ['s1', 'crowd'], ['s2', 'crowd'], ['s3', 'crowd'], ['s4', 'crowd'], ['m1', 'courtier'], ['m2', 'courtier'], ['m3', 'courtier'],
  ['puller', 'courtier'], ['w1', 'crowd'], ['w2', 'crowd'], ['w3', 'crowd'], ['dq', 'draupadi'], ['sister', 'sister'], ['brother', 'brother']]);
addOutlines(scene);
const confetti = makeConfetti(scene, 70, 23);
const K0 = V(1.3, 0.2, -0.6);

function update(s, t) {
  // light follows the set the camera is in (and the court is dim, lit by torches and, later, by grace)
  const cx = camera.position.x, set = cx > 60 ? 80 : cx > 20 ? 40 : 0, court = set === 40;
  S.mood(court ? 0.6 : 0); if (court) S.hemi.intensity = 1.25; S.sun.target.position.set(set, 0, 0); S.sun.position.set(set - 8, 14, 9); S.sun.target.updateMatrixWorld();
  if (set === 80) S.hemi.intensity = 1.5;
  const right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0); right.y = 0; right.normalize();
  const handOf = (p, h = 1.7, offer = false) => p.clone().add(right.clone().multiplyScalar((offer ? 0.32 : 0.246) * h / 1.7)).add(V(0, (offer ? 0.84 : 0.5) * h / 1.7, 0));
  // --- palace
  fire.forEach((f, i) => { f.scale.set(1, 1 + 0.25 * Math.sin(t * 11 + i * 2), 1); f.rotation.y = t * 2 + i; }); fireL.intensity = 4 + Math.sin(t * 13) * 0.6;
  pl.forEach((l, i) => (l.flame.scale.y = 1 + 0.15 * Math.sin(t * 13 + i)));
  const cutK = s >= E.cut + 0.15, bound = s >= E.ties + 0.8;
  pose(C.krishna, camera, { x: K0.x, y: 0.2, z: K0.z, mood: s >= E.smiles ? 'happy' : cutK && s < E.ties ? 'wow' : 'normal', bleed: cutK && !bound, bandage: bound, arm: 'down' });
  const dWalk = sm(seg(s, E.silk - 0.3, E.ties - 0.1)), D = V(lerp(-1.1, 0.5, dWalk), 0.2, lerp(-0.4, -0.35, dWalk));
  pose(C.draupadi, camera, { x: D.x, y: 0.2, z: D.z, mood: s >= E.draupadi && s < E.ties ? 'normal' : s >= E.smiles ? 'happy' : cutK ? 'wow' : 'happy', arm: s >= E.tears && s < E.ties + 0.9 ? 'offer' : 'down', step: dWalk > 0 && dWalk < 1 ? s * 3 : 0 });
  pose(C.priest, camera, { x: -0.9, y: 0.2, z: -4.6, mood: s >= E.cut + 0.2 && s < E.smiles ? 'wow' : 'closed', arm: s < E.cut ? 'up' : 'down' });
  // everyone runs for a cloth; nobody finds one
  const runners = [['s1', -2.2, 0.0, E.everyone], ['s2', 2.4, 0.6, E.everyone + 0.15], ['s3', -2.8, -2.4, E.everyone + 0.3], ['s4', 2.9, -1.8, E.servants - 0.3], ['m1', -1.6, 1.6, E.ministers - 0.4], ['m2', 2.0, 2.0, E.ministers - 0.2], ['m3', -3.0, 1.0, E.ministers]];
  runners.forEach(([n, x, z, t0], i) => {
    const run = s >= t0 && s < E.nobody, u = Math.max(0, s - t0), sw = run ? Math.sin(u * 2.2 + i) * 1.6 : 0, dir = Math.cos(u * 2.2 + i);
    const shrug = s >= E.nobody && s < E.draupadi + 0.3;
    pose(C[n], camera, { x: x + sw, y: 0.2, z: z, h: n[0] === 'm' ? 1.75 : 1.65, mood: run ? 'wow' : shrug ? 'sad' : s >= E.tears && s < E.smiles ? 'wow' : s >= E.smiles ? 'happy' : 'normal', arm: shrug ? 'up' : 'down', step: run ? u * 4 : 0, flip: run && dir < 0 });
  });
  // the strip: torn from her sari, carried to his hand, tied round his finger
  const tear = s >= E.tears + 0.1, fly = sm(seg(s, E.ties - 0.5, E.ties + 0.25));
  strip.visible = tear && !bound;
  if (strip.visible) { const from = handOf(D, 1.7, true), to = handOf(K0, 1.7); strip.position.copy(from.lerp(to, fly)); strip.position.y += Math.sin(fly * Math.PI) * 0.15; strip.quaternion.copy(camera.quaternion); strip.rotateZ(Math.sin(s * 9) * 0.25 * (1 - fly) + fly * 1.2); }
  // the promise: little sparks of gold around the bound finger
  const sp = sm(seg(s, E.for2 - 0.2, E.for2 + 0.6)) * (1 - sm(seg(s, E.wait + 1.0, E.wait + 1.6))), hc = handOf(K0);
  sparks.forEach((m, i) => { m.visible = sp > 0.01; const a = t * 1.7 + i * 0.45, r = 0.12 + (i % 4) * 0.07; m.position.set(hc.x + Math.cos(a) * r, hc.y + 0.05 + Math.sin(t * 2 + i) * 0.12 + (i % 3) * 0.07, hc.z + Math.sin(a) * r); m.scale.setScalar(sp); m.rotation.y = t * 3; });
  // --- the cruel court
  torches.forEach((f, i) => (f.scale.y = 1 + 0.2 * Math.sin(t * 12 + i)));
  const pullK = sm(seg(s, E.pull - 0.2, E.pull + 0.6)), grace = sm(seg(s, E.calls + 0.3, E.never)), endless = clamp((s - E.pull) / (E.thats - E.pull)), tired = sm(seg(s, E.tft - 0.2, E.tft + 0.6));
  const DQ = V(39.8, 0.2, -1.0), PU = V(lerp(41.6, 42.6, pullK) - tired * 0.2, 0.2, lerp(-0.6, 0.2, pullK));
  pose(C.dq, camera, { x: DQ.x, y: 0.2, z: DQ.z, h: 1.75, mood: s >= E.calls ? 'closed' : 'sad', arm: s >= E.calls ? 'up' : 'down' });
  pose(C.puller, camera, { x: PU.x, y: 0.2, z: PU.z, h: 1.8, mood: tired > 0.5 ? 'sad' : grace > 0.3 ? 'wow' : 'smug', arm: 'offer', sitting: tired > 0.5, step: pullK > 0 && tired < 0.5 ? s * 2.5 : 0 });
  [['w1', 36.2, -2.8], ['w2', 36.4, -0.8], ['w3', 43.8, -2.6]].forEach(([n, x, z]) => pose(C[n], camera, { x, y: 0.62, z, h: 1.6, mood: grace > 0.3 ? 'wow' : 'sad', arm: 'down' }));
  ribbon.visible = s >= E.pull - 0.1 && !window.__noRib;
  if (ribbon.visible) {
    const a = DQ.clone().add(V(0.12, 0.75, 0.05)), b = handOf(PU, 1.8, true).add(V(0, tired * -0.45, 0)), sag = 0.18 + 0.2 * tired;
    for (let i = 0; i <= NR; i++) { const u = i / NR, p = a.clone().lerp(b, u); p.y -= Math.sin(u * Math.PI) * sag; p.y += Math.sin(u * 12 - t * 6) * 0.025 * (1 - tired); rPos.set([p.x, p.y + 0.09, p.z, p.x, p.y - 0.09, p.z + 0.02], i * 6); }
    rGeo.attributes.position.needsUpdate = true; rGeo.computeVertexNormals(); sTex.offset.x = -(s - E.pull) * 1.6 * (1 - 0.5 * tired);
    ribbon.material.emissiveIntensity = grace * 0.55;
  }
  const nH = Math.floor(sm(endless) * heap.length);
  heap.forEach((m, i) => { m.visible = i < nH && s >= E.pull; const [ox, oz, ry] = m.userData.off; m.position.set(PU.x + 0.15 + ox * (0.5 + i / heap.length), 0.24 + Math.floor(i / 5) * 0.07, PU.z + 0.35 + oz); m.rotation.y = ry; m.material.emissiveIntensity = grace * 0.45; });
  beam.material.opacity = grace * 0.22 * (1 + 0.1 * Math.sin(t * 3)); halo.material.opacity = grace * 0.13; halo.scale.setScalar(1 + 0.06 * Math.sin(t * 4)); graceL.intensity = grace * 5;
  // --- home today
  hlamp.flame.scale.y = 1 + 0.15 * Math.sin(t * 13);
  const tie = sm(seg(s, HT, HT + 1.0)), tied = s >= HT + 0.95, waving = s >= E.send && s < E.comment + 0.6;
  tRakhi.visible = s < HT + 0.2;
  pose(C.sister, camera, { x: 79.5, z: 0.2, h: 1.3, mood: s >= HT + 1.0 ? 'happy' : 'normal', arm: waving ? 'wave' : s >= HT - 0.6 && s < HT + 1.2 ? 'offer' : 'down' });
  pose(C.brother, camera, { x: 80.45 - tie * 0.05, z: 0.2, h: 1.38, mood: s >= HT + 1.0 ? 'happy' : 'normal', rakhi: tied, arm: waving ? 'wave' : 'down' });
  confetti(E.promise2 - 0.3, s, V(80, 2.6, 0.2));
  S.clouds.forEach((c, i) => { c.position.x = -80 + i * 15 + ((t * 0.6 + i * 3) % 12); });
}

const G = (t) => t, HOOK = (t) => HT - 1.6 + t * 0.75;
const SHOTS = [
  [0, E.as - 0.05, HOOK, [[80, 1.5, 4.2], [80, 1.05, 0.2]], [[80, 1.3, 3.1], [80, 1.0, 0.2]]],
  [E.as - 0.05, E.it - 0.05, HOOK, [[80.85, 0.85, 1.25], [80.6, 0.5, 0.2]], [[80.82, 0.8, 1.1], [80.6, 0.48, 0.2]]],
  [E.it - 0.05, E.indra - 0.05, (t) => E.knot + 0.3 + (t - E.it) * 0.4, [[1.75, 1.15, 1.5], [1.5, 0.85, -0.6]], [[1.72, 1.1, 1.3], [1.5, 0.85, -0.6]]],
  [E.indra - 0.05, E.krishna - 0.05, G, [[0, 7.5, 13], [0, 2.2, -4]], [[0, 3.6, 8.5], [0, 1.6, -3]]],
  [E.krishna - 0.05, E.everyone - 0.05, G, [[1.75, 1.55, 2.4], [1.3, 1.2, -0.6]], [[1.6, 1.4, 1.5], [1.35, 1.0, -0.6]]],
  [E.everyone - 0.05, E.servants - 0.1, G, [[0, 3.8, 8.4], [0, 1.0, -1.2]], [[0.4, 3.4, 7.6], [0, 1.0, -1.2]]],
  [E.servants - 0.1, E.ministers - 0.1, G, [[-3.0, 1.5, 3.4], [-1.6, 1.0, -0.6]], [[-2.8, 1.5, 3.1], [-1.4, 1.0, -0.6]]],
  [E.ministers - 0.1, E.nobody - 0.05, G, [[2.8, 1.6, 4.6], [0.8, 1.1, 1.4]], [[2.6, 1.6, 4.3], [0.6, 1.1, 1.4]]],
  [E.nobody - 0.05, E.draupadi - 0.05, G, [[0, 2.6, 7.0], [0, 1.1, -0.5]], [[0, 2.4, 6.2], [0, 1.1, -0.5]]],
  [E.draupadi - 0.05, E.tears - 0.3, G, [[-0.9, 1.55, 1.9], [-1.1, 1.4, -0.4]], [[-0.95, 1.55, 1.5], [-1.1, 1.4, -0.4]]],
  [E.tears - 0.3, E.ties - 0.05, G, [[-0.3, 1.6, 5.4], [-0.1, 1.0, -0.5]], [[-0.1, 1.55, 4.9], [0.4, 1.0, -0.5]], 55],
  [E.ties - 0.05, E.krishna2 - 0.05, G, [[1.62, 0.95, 0.95], [1.55, 0.72, -0.6]], [[1.6, 0.92, 0.75], [1.55, 0.72, -0.6]]],
  [E.krishna2 - 0.05, E.for2 - 0.05, G, [[1.45, 1.6, 1.5], [1.3, 1.3, -0.6]], [[1.42, 1.55, 1.2], [1.3, 1.3, -0.6]]],
  [E.for2 - 0.05, E.wait - 0.05, G, [[0.4, 1.45, 2.9], [0.95, 1.1, -0.5]], [[1.1, 1.4, 2.5], [0.95, 1.1, -0.5]]],
  [E.wait - 0.05, E.years - 0.05, G, [[0.35, 1.6, 1.6], [0.5, 1.4, -0.35]], [[0.4, 1.6, 1.35], [0.5, 1.4, -0.35]]],
  [E.years - 0.05, E.pull - 0.4, G, [[40.6, 2.8, 7.2], [40.6, 1.2, -1.2]], [[40.6, 2.3, 5.8], [40.6, 1.2, -1.2]]],
  [E.pull - 0.4, E.calls - 0.2, G, [[41.2, 1.8, 7.4], [41.2, 1.0, -0.4]], [[41.2, 1.7, 6.8], [41.2, 1.0, -0.4]], 55],
  [E.calls - 0.2, E.never - 0.3, G, [[39.85, 1.65, 1.9], [39.8, 1.6, -1]], [[39.85, 1.7, 1.45], [39.8, 1.65, -1]]],
  [E.never - 0.3, E.tft - 0.05, G, [[41.3, 2.2, 7.6], [41.2, 0.8, -0.5]], [[41.2, 2.1, 7.0], [41.2, 0.8, -0.5]], 55],
  [E.tft - 0.05, E.thats - 0.05, G, [[40.8, 5.0, 7.5], [40.9, 0.6, -0.6]], [[40.8, 5.4, 7.9], [40.9, 0.6, -0.6]]],
  [E.thats - 0.05, E.rakhi2 - 0.1, G, [[80, 1.6, 4.6], [80, 1.05, 0.2]], [[80, 1.45, 3.7], [80, 1.0, 0.2]]],
  [E.rakhi2 - 0.1, E.promise2 - 0.45, G, [[80.85, 0.85, 1.25], [80.6, 0.5, 0.2]], [[80.82, 0.8, 1.1], [80.6, 0.48, 0.2]]],
  [E.promise2 - 0.45, E.send - 0.05, G, [[80, 1.45, 3.0], [80, 1.15, 0.2]], [[80, 1.4, 2.7], [80, 1.15, 0.2]]],
  [E.send - 0.05, E.comment - 0.05, G, [[80, 1.5, 3.8], [80, 1.05, 0.2]], [[80, 1.45, 3.3], [80, 1.05, 0.2]]],
  [E.comment - 0.05, DURATION + 0.1, (t) => E.smiles + 2.5 + (t - E.comment), [[0.9, 1.9, 4.6], [0.9, 1.2, -0.5]], [[0.9, 1.8, 4.0], [0.9, 1.2, -0.5]]],
];
direct({ stage, WORDS, DURATION, shots: SHOTS, update, title: E.but - 0.05, q: [E.wait, E.years], cta: E.comment,
  key: ['raksha', 'bandhan', 'thread', 'wrists', 'story', 'rakhi', 'torn', 'sari', 'indraprastha', 'royal', 'finger', 'cut', 'bleed', 'cloth', 'servants', 'ministers', 'nobody', 'draupadi', 'twice', 'tears', 'strip', 'silk', 'ties', 'knot', 'smiles', 'protect', 'wait', 'promise', 'years', 'cruel', 'pull', 'calls', 'name', 'never', 'ends', 'today', 'brother', 'sister', 'comment'],
  loc: (t) => (t >= E.indra - 0.05 && t < E.krishna ? '📍 INDRAPRASTHA · LONG AGO' : t >= E.years - 0.05 && t < E.pull - 0.4 ? 'YEARS LATER' : t >= E.thats - 0.05 && t < E.rakhi2 ? 'EVEN TODAY' : ''),
  shakes: [], tick: () => {} });
