// Day 29 · "Why Damodar?" · Why we do what we do #11 (as the story goes: the rope that was always two fingers short)
// Sets: Yashoda's courtyard in Gokul (origin), a home altar with Kartik lamps today (x = 40).
import * as THREE from './three.module.js';
import { rng, mat, mesh, sm, seg, lerp, clamp, setupScene, makeCast, pose, lamp, roundTree, clayPot } from './kit.js';
import { makeStage, direct, wordTime } from './director.js';
import { addOutlines, makeConfetti } from './plus.js';
import { WORDS, DURATION } from './data.js';

const stage = makeStage(), { scene, camera } = stage, V = (x, y, z) => new THREE.Vector3(x, y, z), R = rng(29);
const S = setupScene(scene, [[0, 0], [40, 0]], 29);
const WT = wordTime(WORDS);
const E = { dam: WT('dam', 2), udar: WT('udar'), the: WT('the'), as: WT('as'), little: WT('little'), and: WT('fed') - 0.26, mother: WT('mother'), and2: WT('decided') - 0.18, she: WT('she'),
  she2: WT('she', 2), she3: WT('she', 3), wait: WT('wait'), he: WT('was') - 0.12, but: WT('but', 2), he2: WT('let') - 0.08, one: WT('one', 2), the6: WT('other') - 0.16, thats: WT("that's"),
  he3: WT('only') - 0.34, comment: WT('comment') };
const glow = (c, o = 0.5) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, depthWrite: false, blending: THREE.AdditiveBlending });
const noOut = (m) => { m.userData.noOutline = true; m.castShadow = false; return m; };

// ---------------- Yashoda's courtyard
mesh(new THREE.BoxGeometry(14, 0.1, 10), mat(0xd9b77a), 0, 0.05, 0, scene).castShadow = false;
mesh(new THREE.BoxGeometry(14, 3.4, 0.4), mat(0xe0b07a), 0, 1.7, -3.2, scene);
mesh(new THREE.BoxGeometry(1.5, 2.3, 0.1), mat(0x7a4a22), -2.6, 1.15, -2.98, scene);
for (let i = 0; i < 9; i++) noOut(mesh(new THREE.CircleGeometry(0.18, 8), mat(i % 2 ? 0xffffff : 0xf6a531), -5.5 + i * 1.4, 2.6, -2.98, scene));
for (const x of [-6.6, 6.6]) mesh(new THREE.BoxGeometry(0.4, 3.4, 7), mat(0xe0b07a), x, 1.7, 0.3, scene);
roundTree(scene, -4.8, -1.6, R, 0.9); roundTree(scene, 5.2, -1.8, R, 0.8);
[[-5.4, 1.4], [-5.0, 2.2], [5.6, 2.4]].forEach(([x, z]) => clayPot(scene, x, 0.42, z, 0.6));
// the butter pot hanging in a sling, which falls and breaks
const sling = new THREE.Group(); sling.position.set(1.9, 2.5, -0.6); scene.add(sling);
for (const a of [0, 2.1, 4.2]) { const l = mesh(new THREE.CylinderGeometry(0.012, 0.012, 1.0, 4), mat(0x8a6a3a), Math.cos(a) * 0.15, 0.4, Math.sin(a) * 0.15, sling); }
const hpot = clayPot(scene, 1.9, 2.0, -0.6, 0.55);
const shards = []; for (let i = 0; i < 7; i++) { const m = mesh(new THREE.TetrahedronGeometry(0.12 + R() * 0.06, 0), mat(0xc8643a), 1.9 + (R() - 0.5) * 1.0, 0.16, -0.6 + (R() - 0.5) * 0.8, scene); m.rotation.set(R() * 3, R() * 3, R() * 3); shards.push(m); }
const butter = noOut(mesh(new THREE.CylinderGeometry(0.5, 0.55, 0.05, 16), mat(0xfff6dc), 1.9, 0.12, -0.6, scene));
// monkeys
const monkeys = [[2.9, -0.2], [3.5, 0.8], [2.5, 1.3]].map(([x, z], i) => { const g = new THREE.Group(); g.position.set(x, 0, z); scene.add(g); const fur = mat(0x8a5a3a), face = mat(0xe0b08a);
  mesh(new THREE.SphereGeometry(0.28, 10, 8).scale(1, 1.1, 0.9), fur, 0, 0.32, 0, g); const h = new THREE.Group(); h.position.set(0, 0.72, 0.04); g.add(h); mesh(new THREE.SphereGeometry(0.2, 10, 8), fur, 0, 0, 0, h); mesh(new THREE.SphereGeometry(0.14, 10, 8).scale(1, 0.8, 0.5), face, 0, -0.03, 0.14, h);
  for (const ex of [-0.06, 0.06]) mesh(new THREE.SphereGeometry(0.03, 6, 4), mat(0x1d1a24), ex, 0.02, 0.21, h); for (const ex of [-0.21, 0.21]) mesh(new THREE.SphereGeometry(0.07, 6, 4), face, ex, 0.02, 0, h);
  mesh(new THREE.TorusGeometry(0.2, 0.035, 5, 12, Math.PI * 1.3), fur, -0.2, 0.25, -0.2, g); const blob = noOut(mesh(new THREE.SphereGeometry(0.07, 6, 4), mat(0xfff6dc), 0.14, 0.5, 0.22, g)); return { g, h, blob, i }; });
// the heavy grinding stone (ulukhal)
const M = V(0.95, 0, -0.35);
mesh(new THREE.CylinderGeometry(0.34, 0.4, 0.75, 10), mat(0x6b4a2a), M.x, 0.4, M.z, scene); mesh(new THREE.CylinderGeometry(0.26, 0.2, 0.06, 10), mat(0x3a2a1a), M.x, 0.79, M.z, scene);
// the rope ring around his belly: segments of different ropes, always two fingers short (until he lets it close)
const ropeCols = [0xb8864a, 0xd9b25a, 0xa0522d, 0xc9a46a, 0x8a6a3a, 0xe0c080, 0x9a7a4a];
const ring = new THREE.Group(); scene.add(ring); let ringKey = '';
function buildRing(n, gap) { const key = n + ':' + gap.toFixed(3); if (key === ringKey) return; ringKey = key; while (ring.children.length) { const c = ring.children.pop(); c.geometry.dispose(); }
  const arc = Math.PI * 2 - gap, per = arc / n; for (let i = 0; i < n; i++) { const g = new THREE.TorusGeometry(0.27, 0.045, 6, 16, per * 0.985); g.rotateZ(i * per); g.rotateX(Math.PI / 2); ring.add(new THREE.Mesh(g, mat(ropeCols[i % ropeCols.length], { r: 0.9 }))); } }
const ropeTail = mesh(new THREE.CylinderGeometry(0.035, 0.035, 1, 6), mat(0xb8864a, { r: 0.9 }), 0, 0, 0, scene);
const pile = []; for (let i = 0; i < 9; i++) pile.push(mesh(new THREE.TorusGeometry(0.22 + R() * 0.08, 0.04, 5, 14).rotateX(Math.PI / 2), mat(ropeCols[i % 7], { r: 0.9 }), -1.6 + (R() - 0.5) * 0.4, 0.14 + Math.floor(i / 3) * 0.08, 0.7 + (R() - 0.5) * 0.4, scene));
const aura = noOut(mesh(new THREE.SphereGeometry(0.9, 16, 12), glow(0x9fd4ff, 0), 0, 0.8, 0.2, scene));
const sweat = [0, 1, 2].map(() => noOut(mesh(new THREE.SphereGeometry(0.035, 6, 4).scale(0.8, 1.3, 0.8), mat(0x7fc8ff), 0, 0, 0, scene)));
// the board: DAM = rope, UDAR = belly, two fingers short...
const bc = document.createElement('canvas'); bc.width = 768; bc.height = 256; const bTex = new THREE.CanvasTexture(bc); bTex.colorSpace = THREE.SRGBColorSpace; let bKey = '';
function boardText(a, b, col = '#ffd23a') { const k = a + '|' + b + col; if (k === bKey) return; bKey = k; const c = bc.getContext('2d'); c.clearRect(0, 0, 768, 256); c.fillStyle = 'rgba(60,20,10,0.82)'; c.beginPath(); c.roundRect(8, 8, 752, 240, 44); c.fill(); c.lineWidth = 10; c.strokeStyle = '#ffd23a'; c.stroke(); c.textAlign = 'center'; c.textBaseline = 'middle';
  c.font = `900 ${b ? 104 : 120}px Nunito, Arial Black, sans-serif`; c.lineWidth = 12; c.strokeStyle = '#1d1a24'; c.strokeText(a, 384, b ? 100 : 132); c.fillStyle = col; c.fillText(a, 384, b ? 100 : 132);
  if (b) { c.font = '800 60px Nunito, Arial, sans-serif'; c.lineWidth = 8; c.strokeText(b, 384, 200); c.fillStyle = '#ffffff'; c.fillText(b, 384, 200); } bTex.needsUpdate = true; }
const board = noOut(new THREE.Mesh(new THREE.PlaneGeometry(2.1, 0.7), new THREE.MeshBasicMaterial({ map: bTex, transparent: true }))); scene.add(board);
// ---------------- a home altar with Kartik lamps today (x = 40)
const T = new THREE.Group(); T.position.set(40, 0, 0); scene.add(T);
mesh(new THREE.BoxGeometry(12, 0.1, 10), mat(0xe8d3a0), 0, 0.05, 0, T).castShadow = false; mesh(new THREE.BoxGeometry(12, 9, 0.3), mat(0x8a3a4a), 0, 4.5, -3, T);
mesh(new THREE.BoxGeometry(3.4, 1.0, 1.3), mat(0x7a4a22), 0, 0.5, -2.2, T); mesh(new THREE.BoxGeometry(3.5, 0.08, 1.4), mat(0xffd23a), 0, 1.02, -2.2, T);
mesh(new THREE.BoxGeometry(1.7, 2.3, 0.1), mat(0xffd23a, { m: 0.5, r: 0.4 }), 0, 2.4, -2.8, T); mesh(new THREE.BoxGeometry(1.45, 2.05, 0.12), mat(0x2f6fa8), 0, 2.4, -2.78, T);
const picRing = mesh(new THREE.TorusGeometry(0.2, 0.035, 6, 16), mat(0xb8864a, { r: 0.9 }), 40, 2.05, -2.62, scene);
const diyas = []; for (let r = 0; r < 2; r++) for (let i = 0; i < 9; i++) { const g = new THREE.Group(); g.position.set(-2.4 + i * 0.6, r ? 1.08 : 0.12, r ? -1.85 : 0.2 + (i % 2) * 0.25); T.add(g); mesh(new THREE.CylinderGeometry(0.11, 0.07, 0.07, 10), mat(0xc8643a), 0, 0.035, 0, g); const f = noOut(mesh(new THREE.ConeGeometry(0.035, 0.12, 6), new THREE.MeshBasicMaterial({ color: 0xffc23a }), 0, 0.13, 0, g)); diyas.push({ g, f }); }
const kl = new THREE.PointLight(0xffa64a, 6, 7, 1.6); kl.position.set(40, 1.2, 0.6); scene.add(kl);
const heldDiya = new THREE.Group(); scene.add(heldDiya); mesh(new THREE.CylinderGeometry(0.11, 0.07, 0.07, 10), mat(0xc8643a), 0, 0, 0, heldDiya); const hf = noOut(mesh(new THREE.ConeGeometry(0.035, 0.12, 6), new THREE.MeshBasicMaterial({ color: 0xffc23a }), 0, 0.1, 0, heldDiya));
// ---------------- the cast
const C = makeCast(scene, [['k', 'kidKrishna'], ['y', 'yashoda'], ['picture', 'kidKrishna'], ['girl', 'kid3'], ['mom', 'gopi2']]);
addOutlines(scene);
const confetti = makeConfetti(scene, 50, 29);
const K = V(0, 0, 0.25);

function update(s, t) {
  const home = camera.position.x > 20;
  S.mood(home ? 0.55 : 0); S.hemi.intensity = home ? 1.0 : 1.4; S.sun.target.position.set(home ? 40 : 0, 0, 0); S.sun.position.set((home ? 40 : 0) - 8, 14, 10); S.sun.target.updateMatrixWorld();
  // the pot breaks, the monkeys feast
  const fall = seg(s, E.little + 0.3, E.little + 0.75), broken = s >= E.little + 0.75;
  hpot.visible = !broken; hpot.position.y = lerp(2.0, 0.3, fall * fall); sling.visible = true;
  shards.forEach((m) => (m.visible = broken)); butter.visible = broken;
  monkeys.forEach(({ g, h, blob, i }) => { const eat = s >= E.and; g.visible = s >= E.little - 0.4; h.rotation.x = eat ? Math.sin(t * 9 + i) * 0.25 : 0; g.position.y = Math.abs(Math.sin(t * 4 + i)) * 0.05; blob.visible = eat; g.rotation.y = -0.6 + i * 0.3; });
  // the rope: one, two, every rope; always two fingers short, until he lets it close
  const nR = s < E.she ? 1 : s < E.she2 ? 1 : s < E.she3 ? 2 : 2 + Math.min(5, Math.floor((s - E.she3) * 2.5));
  const closing = sm(seg(s, E.he2, E.he2 + 0.9)), gap = lerp(0.62, 0, closing);
  const ringOn = (s >= E.she && s < E.as) || s >= E.she || s < E.as;
  ring.visible = s < E.as || s >= E.she; buildRing(s < E.as ? 3 : nR, s < E.as ? 0 : gap);
  ring.position.copy(K).add(V(0, 0.6, 0)); ring.rotation.y = -Math.PI / 2;
  const tiedNow = s < E.as || s >= E.he2 + 0.8;
  ropeTail.visible = tiedNow; { const a = K.clone().add(V(0.18, 0.6, -0.1)), b = M.clone().add(V(-0.2, 0.55, 0)), mid = a.clone().add(b).multiplyScalar(0.5); ropeTail.position.copy(mid); ropeTail.scale.set(1, a.distanceTo(b), 1); ropeTail.lookAt(b); ropeTail.rotateX(Math.PI / 2); }
  pile.forEach((m, i) => (m.visible = s >= E.she3 + i * 0.25 && s >= E.as));
  // Krishna: naughty, then caught, then smug at the rope, glowing as God, then lets himself be tied
  const god = sm(seg(s, E.he - 0.1, E.he + 0.5)) * (1 - sm(seg(s, E.but, E.but + 0.6)));
  aura.material.opacity = god * 0.25; aura.scale.setScalar(1 + god * 0.4 + Math.sin(t * 4) * 0.05);
  const kMood = s < E.as ? 'happy' : s < E.mother ? 'wink' : s < E.and2 ? 'wow' : s < E.wait ? 'smug' : s < E.but ? 'happy' : s < E.he2 ? 'sad' : 'closed';
  pose(C.k, camera, { x: K.x, z: K.z, h: 1.25, mood: s >= E.he3 || s < E.as ? 'happy' : kMood, arm: s >= E.and && s < E.mother ? 'offer' : s >= E.little && s < E.and ? 'up' : 'down', butter: s >= E.little + 0.8 && s < E.mother + 1.2 });
  // Yashoda: comes in, ties, gets tired, hugs
  const enter = sm(seg(s, E.mother - 0.1, E.mother + 1.0)), Y = V(lerp(-3.4, -0.75, enter), 0, lerp(1.8, 0.55, enter));
  const tired = s >= E.but && s < E.he2 + 0.6, tying = s >= E.she && s < E.he2 + 0.8;
  pose(C.y, camera, { visible: s >= E.mother - 0.2 || s < E.as, x: s < E.as ? -0.75 : Y.x, z: s < E.as ? 0.55 : Y.z, h: 1.62, step: enter > 0 && enter < 1 ? s * 3 : 0,
    mood: s < E.as || s >= E.he2 + 0.6 ? 'happy' : tired ? 'sad' : s >= E.mother && s < E.she ? 'normal' : 'normal', arm: s >= E.he3 || s < E.as ? 'offer' : tying ? 'offer' : 'down' });
  sweat.forEach((d, i) => { d.visible = tired; const u = (t * 0.8 + i / 3) % 1; d.position.set(Y.x - 0.25 + i * 0.25, 1.62 - u * 0.4, Y.z + 0.15); });
  // the board
  const B = (txt, sub, col) => { boardText(txt, sub, col); board.visible = true; };
  board.visible = false; { const fwd = V(0, 0, -1).applyQuaternion(camera.quaternion), up = V(0, 1, 0).applyQuaternion(camera.quaternion); board.position.copy(camera.position).add(fwd.multiplyScalar(2.0)).add(up.multiplyScalar(0.55)); board.quaternion.copy(camera.quaternion); board.scale.setScalar(0.42); }
  if (s < E.as) { if (t < E.dam) {} else if (t < E.udar) B('DAM', '= rope'); else if (t < E.the) B('UDAR', '= belly'); else B('DAMODAR', 'rope around his belly'); }
  else if (s >= E.she + 0.9 && s < E.wait) B('2 fingers', s >= E.she3 ? 'STILL too short!' : 'too short!', '#ff8a6a');
  else if (s >= E.one && s < E.the6) B('1 finger', 'her effort');
  else if (s >= E.the6 && s < E.thats) B('1 finger', 'his grace', '#9fe8ff');
  else if (s >= E.thats && s < E.he3) B('DAMODAR');
  // --- today: a girl lights a Kartik lamp before Damodar
  pose(C.picture, camera, { x: 40, y: 1.35, z: -2.72, h: 1.6, mood: 'happy' }); C.picture.m.quaternion.identity();
  const light = sm(seg(s, E.comment + 0.2, E.comment + 1.6));
  diyas.forEach(({ f }, i) => { f.visible = i < 6 + Math.floor(light * 12); f.scale.y = 1 + 0.2 * Math.sin(t * 13 + i); });
  pose(C.girl, camera, { x: 39.4, z: 0.9, h: 1.2, mood: 'closed', arm: 'offer' }); pose(C.mom, camera, { x: 41.2, z: 0.8, h: 1.62, mood: 'happy', arm: 'down', flip: true });
  { const right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0); right.y = 0; right.normalize(); heldDiya.position.set(39.4, 0, 0.95).add(right.multiplyScalar(0.23)).add(V(0, 0.62, 0)); hf.scale.y = 1 + 0.2 * Math.sin(t * 11); }
  confetti(E.he2 + 0.8, s, V(0, 2.4, 0.3));
  S.clouds.forEach((c, i) => { c.position.x = -80 + i * 15 + ((t * 0.6 + i * 3) % 12); });
}

const G = (t) => t, TIED = (t) => t;
const SHOTS = [
  [0, E.dam - 0.05, TIED, [[0.3, 1.5, 4.2], [0.2, 1.3, 0]], [[0.3, 1.45, 3.7], [0.2, 1.3, 0]]],
  [E.dam - 0.05, E.udar - 0.05, TIED, [[0.6, 1.6, 2.6], [0.4, 1.4, 0]], [[0.6, 1.6, 2.4], [0.4, 1.4, 0]]],
  [E.udar - 0.05, E.the - 0.05, TIED, [[0.15, 1.5, 2.6], [0.1, 1.4, 0]], [[0.15, 1.5, 2.4], [0.1, 1.4, 0]]],
  [E.the - 0.05, E.as - 0.05, TIED, [[0.2, 1.7, 4.6], [0.2, 1.3, 0]], [[0.2, 1.7, 4.0], [0.2, 1.3, 0]]],
  [E.as - 0.05, E.little - 0.05, G, [[0, 5.0, 10.5], [0.5, 0.8, -0.5]], [[0, 3.6, 8.5], [0.5, 0.8, -0.5]]],
  [E.little - 0.05, E.and - 0.05, G, [[1.2, 1.5, 4.2], [1.5, 1.1, -0.4]], [[1.1, 1.4, 3.8], [1.5, 0.9, -0.4]]],
  [E.and - 0.05, E.mother - 0.05, G, [[2.6, 1.2, 3.4], [2.9, 0.6, 0.3]], [[2.5, 1.15, 3.1], [2.9, 0.6, 0.3]]],
  [E.mother - 0.05, E.and2 - 0.05, G, [[-0.6, 1.5, 5.2], [-1.0, 1.1, 0.5]], [[-0.4, 1.5, 4.6], [-0.6, 1.1, 0.5]]],
  [E.and2 - 0.05, E.she - 0.05, G, [[1.6, 1.3, 3.2], [0.6, 0.7, -0.2]], [[1.5, 1.25, 2.9], [0.6, 0.7, -0.2]]],
  [E.she - 0.05, E.she2 - 0.05, G, [[0.1, 1.5, 3.0], [0.0, 1.2, 0.2]], [[0.1, 1.5, 2.7], [0.0, 1.2, 0.2]]],
  [E.she2 - 0.05, E.she3 - 0.05, G, [[0.3, 1.5, 2.9], [0.0, 1.2, 0.2]], [[0.25, 1.5, 2.6], [0.0, 1.2, 0.2]]],
  [E.she3 - 0.05, E.wait - 0.05, G, [[0.2, 2.2, 5.4], [-0.4, 1.1, 0.3]], [[0.0, 2.1, 4.8], [-0.4, 1.1, 0.3]]],
  [E.wait - 0.05, E.he - 0.05, G, [[0.15, 1.0, 1.9], [0.0, 0.9, 0.25]], [[0.15, 1.0, 1.7], [0.0, 0.9, 0.25]]],
  [E.he - 0.05, E.but - 0.05, G, [[0.2, 1.2, 2.8], [0.0, 1.0, 0.25]], [[0.2, 1.3, 2.3], [0.0, 1.0, 0.25]]],
  [E.but - 0.05, E.he2 - 0.05, G, [[-0.5, 1.5, 2.6], [-0.75, 1.35, 0.55]], [[-0.5, 1.5, 2.4], [-0.75, 1.35, 0.55]]],
  [E.he2 - 0.05, E.one - 0.05, G, [[0.1, 1.1, 2.2], [0.0, 0.8, 0.25]], [[0.1, 1.1, 2.0], [0.0, 0.8, 0.25]]],
  [E.one - 0.05, E.thats - 0.05, G, [[0.1, 1.7, 3.6], [0.1, 1.5, 0.2]], [[0.1, 1.7, 3.3], [0.1, 1.5, 0.2]]],
  [E.thats - 0.05, E.he3 - 0.05, G, [[0.2, 1.8, 4.8], [0.2, 1.3, 0]], [[0.2, 1.7, 4.2], [0.2, 1.3, 0]]],
  [E.he3 - 0.05, E.comment - 0.05, G, [[-0.3, 1.3, 2.6], [-0.35, 1.1, 0.4]], [[-0.3, 1.3, 2.35], [-0.35, 1.1, 0.4]]],
  [E.comment - 0.05, DURATION + 0.1, G, [[40, 1.7, 5.6], [40, 1.3, -1.0]], [[40, 1.6, 4.8], [40, 1.3, -1.0]]],
];
direct({ stage, WORDS, DURATION, shots: SHOTS, update, title: E.dam - 0.05, q: [E.wait, E.he], cta: E.comment,
  key: ['damodar', 'dam', 'rope', 'udar', 'belly', 'story', 'butter', 'monkeys', 'yashoda', 'grinding', 'stone', 'fingers', 'short', 'another', 'every', 'house', 'wait', 'god', 'hold', 'tired', 'sweating', 'tied', 'effort', 'grace', 'love', 'comment', 'lamp', 'kartik'],
  loc: (t) => (t >= E.as - 0.05 && t < E.little - 0.05 ? '📍 GOKUL · LONG AGO' : t >= E.comment - 0.05 ? 'KARTIK · TODAY' : ''), shakes: [], tick: () => {} });
