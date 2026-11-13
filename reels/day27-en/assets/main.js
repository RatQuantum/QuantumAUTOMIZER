// Day 27 · "Why Govinda?" · Why we do what we do #9 (as the story goes: after Govardhan, Indra bows; Surabhi bathes Krishna in milk)
// Sets: Vraj after the storm (origin; Govardhan back on the ground at z = -6), a kirtan today (x = 40).
import * as THREE from './three.module.js';
import { rng, mat, mesh, sm, seg, lerp, clamp, setupScene, makeCast, pose, lamp, hut, cow, roundTree, palm } from './kit.js';
import { makeStage, direct, wordTime } from './director.js';
import { addOutlines, makeConfetti } from './plus.js';
import { WORDS, DURATION } from './data.js';

const stage = makeStage(), { scene, camera } = stage, V = (x, y, z) => new THREE.Vector3(x, y, z), R = rng(27);
const S = setupScene(scene, [[0, 2], [40, 0]], 27);
const WT = wordTime(WORDS);
const E = { it: WT('it'), as: WT('as'), indra: WT('indra'), he: WT('came') - 0.18, but: WT('but'), behind: WT('behind'), she: WT('she'), wait: WT('wait'), poured: WT('poured'), then: WT('then'),
  govinda2: WT('govinda', 2), thats: WT("that's"), when: WT('when'), we3: WT('thanking') - 0.3, comment: WT('comment') };
const glow = (c, o = 0.5) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, depthWrite: false, blending: THREE.AdditiveBlending });
const noOut = (m) => { m.userData.noOutline = true; m.castShadow = false; return m; };

// ---------------- Vraj, the morning after the storm
mesh(new THREE.CylinderGeometry(9, 9, 0.08, 28), mat(0xd9b77a), 0, 0.04, 6, scene).castShadow = false;
[[-6, 6, 0.4], [6.2, 6.5, -0.4], [-6.5, 11, 0.2], [6.5, 11.5, -0.2]].forEach(([x, z, r]) => hut(scene, x, z, R, r));
for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2, r = 12 + R() * 3; (i % 3 ? roundTree : palm)(scene, Math.cos(a) * r, 4 + Math.sin(a) * r, R, 1 + R() * 0.3); }
const hill = new THREE.Group(); hill.position.set(0, 0, -6); scene.add(hill);
{ const g = new THREE.ConeGeometry(4.6, 4.2, 9, 2); g.translate(0, 2.1, 0); const p = g.attributes.position; for (let i = 0; i < p.count; i++) if (p.getY(i) > 0.1 && p.getY(i) < 4.1) { p.setX(i, p.getX(i) * (0.9 + R() * 0.25)); p.setZ(i, p.getZ(i) * (0.9 + R() * 0.25)); } g.computeVertexNormals(); mesh(g, mat(0x6fbf45), 0, 0, 0, hill); }
for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2 + 0.3; roundTree(hill, Math.cos(a) * 2.4, Math.sin(a) * 2.2, R, 0.45); }
const rainbow = new THREE.Group(); rainbow.position.set(0, 0, -16); scene.add(rainbow);
[0xe8462c, 0xf6a531, 0xffd23a, 0x5ccf45, 0x3f8fe0, 0x8a6ad8].forEach((c, i) => noOut(mesh(new THREE.TorusGeometry(11 - i * 0.45, 0.22, 6, 40, Math.PI), new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.75 }), 0, 0, 0, rainbow)));
const cows = [cow(scene, -3.2, 3.6, 0.6, R), cow(scene, 3.4, 3.4, -0.6, R), cow(scene, -2.6, 7.6, 1.6, R), cow(scene, 2.9, 7.8, -2.0, R)];
// ---------------- Indra: the crowned cloud, ashamed now
const indra = new THREE.Group(); scene.add(indra);
const cloudMat = mat(0xeef2ff, { r: 1 });
for (let i = 0; i < 9; i++) mesh(new THREE.IcosahedronGeometry(1.1 + R() * 0.7, 0), cloudMat, (i - 4) * 0.9, (R() - 0.3) * 0.8, R() * 0.6, indra);
const eyes = [-0.8, 0.8].map((x) => { const e = new THREE.Group(); e.position.set(x, 0.3, 1.6); indra.add(e); mesh(new THREE.SphereGeometry(0.42, 12, 8), mat(0xffffff), 0, 0, 0, e); const pu = mesh(new THREE.SphereGeometry(0.2, 10, 6), mat(0x1d1a24), 0, -0.1, 0.3, e); return { e, pu }; });
const brows = [-0.8, 0.8].map((x) => mesh(new THREE.BoxGeometry(0.75, 0.14, 0.12), mat(0x1d1a24), x, 0.9, 1.9, indra));
const crownG = new THREE.Group(); crownG.position.set(0, 1.55, 0.6); indra.add(crownG); { const gm = mat(0xffd23a, { m: 0.6, r: 0.3 }); mesh(new THREE.CylinderGeometry(0.9, 0.95, 0.45, 10, 1, true), gm, 0, 0, 0, crownG); for (let p = 0; p < 7; p++) { const a = p / 7 * Math.PI * 2; mesh(new THREE.ConeGeometry(0.15, 0.45, 4), gm, Math.cos(a) * 0.88, 0.4, Math.sin(a) * 0.88, crownG); } mesh(new THREE.SphereGeometry(0.15, 8, 6), mat(0x2fa8e0), 0, 0.05, 0.95, crownG); }
// ---------------- Surabhi: the mother of all cows (white, gold horns, garland, halo)
const sura = cow(scene, 9, -4, 0, R); sura.scale.setScalar(1.35);
sura.traverse((o) => { if (o.isMesh && o.material && o.material.color && [0xf4f1ea, 0x3a3330].includes(o.material.color.getHex())) o.material = mat(0xffffff, { r: 0.6 }); });
const garland = new THREE.Group(); garland.visible = false; sura.add(garland); for (let i = 0; i < 12; i++) { const a = i / 11 * Math.PI; mesh(new THREE.SphereGeometry(0.07, 6, 4), mat(i % 2 ? 0xf6a531 : 0xffd23a), 0.75, 1.1 - Math.sin(a) * 0.35, -0.32 + i * 0.058, garland); }
const sHalo = noOut(mesh(new THREE.TorusGeometry(0.32, 0.04, 6, 24), glow(0xffd23a, 0.8), 0.85, 1.75, 0, sura)); sHalo.rotation.x = Math.PI / 2;
const sGlow = noOut(mesh(new THREE.SphereGeometry(1.4, 16, 12), glow(0xfff0c0, 0.12), 0, 1.0, 0, sura));
// the milk: a waterfall from a little cloud over Krishna, a splash and a pool
const milkSrc = new THREE.Group(); milkSrc.position.set(0, 5.2, 4.6); scene.add(milkSrc);
for (let i = 0; i < 4; i++) mesh(new THREE.IcosahedronGeometry(0.5 + R() * 0.3, 0), mat(0xffffff, { r: 1 }), (i - 1.5) * 0.5, R() * 0.2, 0, milkSrc);
const FALL = 70, drops = noOut(new THREE.InstancedMesh(new THREE.SphereGeometry(0.06, 6, 4), new THREE.MeshStandardMaterial({ color: 0xfffaf0, roughness: 0.3 }), FALL)); scene.add(drops);
const dropBase = Array.from({ length: FALL }, () => [(R() - 0.5) * 0.5, R(), (R() - 0.5) * 0.5]);
const column = noOut(mesh(new THREE.CylinderGeometry(0.2, 0.32, 4.0, 12, 1, true), new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.75, roughness: 0.3, side: THREE.DoubleSide }), 0, 3.0, 4.6, scene));
const pool = noOut(mesh(new THREE.CylinderGeometry(1, 1, 0.03, 24), new THREE.MeshStandardMaterial({ color: 0xfffaf0, roughness: 0.2 }), 0, 0.1, 4.6, scene));
// the name: a golden board in the sky
const nc = document.createElement('canvas'); nc.width = 1024; nc.height = 360; const nTex = new THREE.CanvasTexture(nc); nTex.colorSpace = THREE.SRGBColorSpace;
{ const c = nc.getContext('2d'); c.fillStyle = 'rgba(60,20,10,0.82)'; c.beginPath(); c.roundRect(10, 10, 1004, 340, 60); c.fill(); c.lineWidth = 14; c.strokeStyle = '#ffd23a'; c.stroke(); c.textAlign = 'center'; c.textBaseline = 'middle';
  c.font = '900 170px Nunito, Arial Black, sans-serif'; c.lineWidth = 16; c.strokeStyle = '#1d1a24'; c.strokeText('GOVINDA', 512, 150); c.fillStyle = '#ffd23a'; c.fillText('GOVINDA', 512, 150);
  c.font = '800 62px Nunito, Arial, sans-serif'; c.lineWidth = 8; c.strokeText('protector of cows', 512, 285); c.fillStyle = '#ffffff'; c.fillText('protector of cows', 512, 285); nTex.needsUpdate = true; }
const board = noOut(new THREE.Mesh(new THREE.PlaneGeometry(3.4, 1.2), new THREE.MeshBasicMaterial({ map: nTex, transparent: true }))); scene.add(board);
const sparks = []; for (let i = 0; i < 30; i++) sparks.push(noOut(mesh(new THREE.OctahedronGeometry(0.06, 0), glow(0xffd23a, 0.9), 0, 0, 0, scene)));
// ---------------- a kirtan today (x = 40)
const T = new THREE.Group(); T.position.set(40, 0, 0); scene.add(T);
mesh(new THREE.BoxGeometry(12, 0.1, 10), mat(0xf3e6c8), 0, 0.05, 0, T).castShadow = false;
mesh(new THREE.BoxGeometry(12, 9, 0.3), mat(0xf6d9a0), 0, 4.5, -3.2, T);
mesh(new THREE.BoxGeometry(3.4, 0.9, 1.4), mat(0x8a4b20), 0, 0.45, -2.3, T); mesh(new THREE.BoxGeometry(3.5, 0.08, 1.5), mat(0xd8263a), 0, 0.93, -2.3, T);
const gold = mat(0xffd23a, { m: 0.5, r: 0.4 }); mesh(new THREE.BoxGeometry(1.9, 2.5, 0.12), gold, 0, 2.35, -2.95, T); mesh(new THREE.BoxGeometry(1.65, 2.25, 0.14), mat(0x2f9d5a), 0, 2.35, -2.93, T);
for (let i = 0; i <= 18; i++) { const u = i / 18; noOut(mesh(new THREE.SphereGeometry(0.09, 6, 4), mat(i % 2 ? 0xf6a531 : 0xffffff), -0.95 + u * 1.9, 3.55 - Math.sin(u * Math.PI) * 0.35, -2.85, T)); }
const tl = [lamp(T, -1.3, 0.97, -2.1, 0.6), lamp(T, 1.3, 0.97, -2.1, 0.6)];
const calf = cow(T, 1.1, -2.0, 0, R); calf.scale.setScalar(0.32); calf.position.y = 0.95;
// ---------------- the cast
const C = makeCast(scene, [['k', 'kidKrishna'], ['yashoda', 'yashoda'], ['g1', 'gopi1'], ['m1', 'govinda'], ['b1', 'kid1'], ['b2', 'kid2'], ['picture', 'kidKrishna'], ['s1', 'devotee'], ['s2', 'gopi3'], ['s3', 'kid4'], ['s4', 'crowd'], ['s5', 'gopi2']]);
addOutlines(scene);
const confetti = makeConfetti(scene, 70, 27);
const KP = V(0, 0, 4.6);

function update(s, t) {
  const temple = camera.position.x > 20;
  S.mood(0); S.hemi.intensity = temple ? 1.3 : 1.4; S.sun.target.position.set(temple ? 40 : 0, 0, temple ? 0 : 4); S.sun.position.set((temple ? 40 : 0) - 8, 14, 12); S.sun.target.updateMatrixWorld();
  rainbow.visible = !temple;
  // Indra comes down from the sky, ashamed, and later bows
  const down = sm(seg(s, E.he - 0.3, E.but + 0.4)), bow = sm(seg(s, E.then, E.then + 0.8));
  indra.position.set(lerp(5, 2.9, down), lerp(10.5, 2.6, down) + Math.sin(t * 1.3) * 0.08, lerp(-12, 3.4, down)); indra.scale.setScalar(lerp(1, 0.55, down)); indra.rotation.y = lerp(0, -0.5, down);
  indra.rotation.x = bow * 0.55; crownG.rotation.x = -bow * 0.2;
  brows.forEach((b, i) => { b.rotation.z = (i ? -1 : 1) * 0.35 * down; b.position.y = 0.92 + 0.08 * down; });
  eyes.forEach(({ e, pu }) => { pu.position.y = -0.1 - 0.08 * down; e.scale.y = s >= E.then + 0.3 ? 0.15 : 1; });
  // Surabhi walks behind him and stands by Krishna
  const walk = sm(seg(s, E.behind - 0.4, E.she));
  sura.position.set(lerp(7.5, -1.9, walk), 0, lerp(-1.0, 4.4, walk)); sura.rotation.y = walk < 1 ? Math.atan2(-1.9 - 7.5, 4.4 + 1.0) - Math.PI / 2 : -0.35;
  sura.position.y = walk > 0 && walk < 1 ? Math.abs(Math.sin(t * 6)) * 0.04 : 0;  sGlow.material.opacity = 0.1 + 0.03 * Math.sin(t * 3);
  sura.visible = s >= E.behind - 0.5;
  // the milk waterfall over Krishna
  const pour = sm(seg(s, E.poured - 0.1, E.poured + 0.5)) * (1 - sm(seg(s, E.then + 0.4, E.then + 1.2)));
  milkSrc.visible = pour > 0.01 || (s >= E.poured - 0.5 && s < E.then + 1.2); milkSrc.position.y = 5.2 + Math.sin(t * 2) * 0.05; milkSrc.scale.setScalar(sm(seg(s, E.poured - 0.6, E.poured)) * (1 - sm(seg(s, E.then + 0.6, E.then + 1.3))));
  column.visible = pour > 0.02; column.scale.set(pour, 1, pour);
  const m4 = new THREE.Matrix4(), one = V(1, 1, 1), zero = V(0, 0, 0), q = new THREE.Quaternion();
  for (let i = 0; i < FALL; i++) { const [x, ph, z] = dropBase[i]; const u = (ph + t * 0.9) % 1; const out = u > 0.8; const py = out ? 0.15 + Math.sin((u - 0.8) * 5 * Math.PI) * 0.4 : 5 - u / 0.8 * 4.9; const r = out ? (u - 0.8) * 5 * 1.1 : 1; m4.compose(V(KP.x + x * r * (out ? 3 : 1), py, KP.z + z * r * (out ? 3 : 1)), q, pour > 0.1 ? one : zero); drops.setMatrixAt(i, m4); }
  drops.instanceMatrix.needsUpdate = true;
  const poolK = sm(seg(s, E.poured, E.then + 1.0)) * (1 - sm(seg(s, E.thats - 0.2, E.thats)));
  pool.visible = poolK > 0.01; pool.scale.set(0.2 + poolK * 1.4, 1, 0.2 + poolK * 1.4);
  // Krishna: little boy among the cows; bathed in milk; named
  pose(C.k, camera, { x: KP.x, z: KP.z, h: 1.45, mood: s >= E.poured && s < E.then ? 'closed' : s >= E.he && s < E.behind ? 'normal' : 'happy', arm: s >= E.govinda2 - 0.3 ? 'up' : pour > 0.5 ? 'up' : 'down' });
  [['yashoda', -1.6, 6.6], ['g1', 1.8, 6.8], ['m1', -3.6, 6.0], ['b1', 1.0, 7.4], ['b2', -0.9, 7.6]].forEach(([n, x, z], i) => pose(C[n], camera, { x, z, h: n[0] === 'b' ? 1.2 : 1.62, flip: x > 0,
    mood: s >= E.he && s < E.poured ? 'wow' : s >= E.poured && s < E.then ? 'happy' : 'happy', arm: s >= E.govinda2 && s < E.thats ? 'up' : 'down' }));
  cows.forEach((c, i) => { c.children[1].rotation.z = Math.sin(t * 5 + i) * 0.12; });
  // the name appears in the sky
  const nameK = sm(seg(s, E.govinda2 - 0.15, E.govinda2 + 0.35)) * (1 - sm(seg(s, E.thats - 0.2, E.thats)));
  board.visible = nameK > 0.01; board.position.set(0, 3.7 + (1 - nameK) * 0.6, 4.2); board.scale.setScalar(0.6 + nameK * 0.4); board.material.opacity = nameK;
  sparks.forEach((m, i) => { const u = s - E.govinda2 - (i % 10) * 0.06; m.visible = u > 0 && u < 2.2; const a = i * 2.4; m.position.set(Math.cos(a) * (1.0 + (i % 5) * 0.4), 3.4 + u * (0.6 + (i % 4) * 0.3), 4.2 + Math.sin(a) * 0.5); m.rotation.y = t * 4; });
  // --- the kirtan today: everyone sings Govinda
  pose(C.picture, camera, { x: 40, y: 1.25, z: -2.8, h: 1.8, mood: 'happy', arm: 'up' }); C.picture.m.quaternion.identity();
  const sing = (i) => Math.sin(t * 4 + i * 1.3) > 0;
  [['s1', 38.4, 0.4], ['s2', 39.4, 0.9], ['s3', 40.4, 1.1], ['s4', 41.4, 0.9], ['s5', 42.2, 0.4]].forEach(([n, x, z], i) => pose(C[n], camera, { x, z, h: n === 's3' ? 1.2 : 1.65, mood: sing(i) ? 'closed' : 'happy', arm: sing(i) ? 'up' : 'wave', y: Math.abs(Math.sin(t * 4 + i)) * 0.06 }));
  tl.forEach((l, i) => (l.flame.scale.y = 1 + 0.15 * Math.sin(t * 13 + i)));
  confetti(E.govinda2, s, V(0, 3.6, 4.2));
  S.clouds.forEach((c, i) => { c.position.x = -80 + i * 15 + ((t * 0.6 + i * 3) % 12); });
}

const G = (t) => t, NAMED = (t) => E.govinda2 + 1.0 + t * 0.1;
const SHOTS = [
  [0, E.it - 0.05, G, [[40, 1.8, 6.4], [40, 1.4, -0.5]], [[40, 1.7, 5.4], [40, 1.4, -0.5]]],
  [E.it - 0.05, E.as - 0.05, NAMED, [[0, 2.8, 11.8], [0, 2.9, 4.4]], [[0, 2.7, 11.0], [0, 2.9, 4.4]]],
  [E.as - 0.05, E.indra - 0.05, G, [[0, 7, 19], [0, 2, 0]], [[0, 4.5, 15], [0, 1.6, 2]]],
  [E.indra - 0.05, E.he - 0.05, G, [[4.6, 8.3, -2], [5, 10.5, -12]], [[4.6, 8.8, -4.2], [5, 10.5, -12]]],
  [E.he - 0.05, E.behind - 0.05, G, [[0.6, 2.4, 11.5], [1.6, 3.0, 1.0]], [[0.6, 1.9, 10.2], [2.2, 2.4, 2.5]]],
  [E.behind - 0.05, E.she - 0.05, G, [[-2.6, 1.8, 10.5], [1.5, 1.2, 1.0]], [[-2.4, 1.7, 9.6], [-0.2, 1.2, 3.0]]],
  [E.she - 0.05, E.wait - 0.05, G, [[-0.4, 1.7, 9.0], [-0.8, 1.15, 4.5]], [[-0.4, 1.65, 8.4], [-0.7, 1.15, 4.5]]],
  [E.wait - 0.05, E.poured - 0.05, G, [[0.2, 1.3, 7.2], [0, 1.1, 4.6]], [[0.2, 1.3, 6.8], [0, 1.1, 4.6]]],
  [E.poured - 0.05, E.then - 0.05, G, [[0, 2.0, 11.0], [0, 2.6, 4.6]], [[0, 1.6, 9.0], [0, 2.2, 4.6]]],
  [E.then - 0.05, E.govinda2 - 0.3, G, [[5.4, 2.4, 10.6], [1.4, 1.8, 3.6]], [[5.0, 2.3, 10.0], [1.4, 1.8, 3.6]]],
  [E.govinda2 - 0.3, E.thats - 0.05, G, [[0, 2.8, 12.2], [0, 2.9, 4.4]], [[0, 2.7, 11.2], [0, 2.9, 4.4]]],
  [E.thats - 0.05, E.when - 0.05, G, [[40, 2.4, 8.4], [40, 1.6, -1]], [[40, 2.2, 7.2], [40, 1.6, -1]]],
  [E.when - 0.05, E.we3 - 0.05, G, [[39.6, 1.5, 3.4], [39.6, 1.3, 0.8]], [[40.4, 1.5, 3.2], [40.4, 1.3, 0.8]]],
  [E.we3 - 0.05, E.comment - 0.05, (t) => E.govinda2 - 0.6 + (t - E.we3) * 0.2, [[-2.4, 1.4, 9.4], [0, 1.1, 4.4]], [[-1.8, 1.4, 8.6], [0, 1.1, 4.4]]],
  [E.comment - 0.05, DURATION + 0.1, (t) => E.govinda2 + 2.2 + (t - E.comment) * 0.5, [[0, 2.6, 12.5], [0, 1.6, 4]], [[0, 2.4, 11.5], [0, 1.6, 4]]],
];
direct({ stage, WORDS, DURATION, shots: SHOTS, update, title: E.it - 0.05, q: [E.wait, E.poured], cta: E.comment,
  key: ['krishna', 'govinda', 'name', 'story', 'govardhan', 'seven', 'indra', 'rain', 'understood', 'sky', 'ashamed', 'alone', 'surabhi', 'mother', 'cows', 'boy', 'protected', 'vraj', 'wait', 'milk', 'waterfall', 'bathed', 'bowed', 'protector', 'today', 'sing', 'thanking', 'comment', 'share'],
  loc: (t) => (t >= E.as - 0.05 && t < E.indra - 0.05 ? '📍 VRAJ · AFTER THE STORM' : t >= E.thats - 0.05 && t < E.when ? 'EVEN TODAY' : ''), shakes: [], tick: () => {} });
