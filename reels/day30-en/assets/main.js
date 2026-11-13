// Day 30 · "Why does Jagannath have no hands?" · Why we do what we do #12 (as the story goes: the unfinished statues of Puri)
// Sets: King Indradyumna's courtyard at Puri by the sea (origin), the locked workshop (x = 40), the temple today (x = 80).
import * as THREE from './three.module.js';
import { rng, mat, mesh, sm, seg, lerp, clamp, setupScene, makeCast, pose, lamp, palm } from './kit.js';
import { makeStage, direct, wordTime } from './director.js';
import { addOutlines, makeConfetti } from './plus.js';
import { WORDS, DURATION } from './data.js';

const stage = makeStage(), { scene, camera } = stage, V = (x, y, z) => new THREE.Vector3(x, y, z), R = rng(30);
const S = setupScene(scene, [[0, 0], [40, 0], [80, 0]], 30);
const WT = wordTime(WORDS);
const E = { and: WT('and'), as: WT('as'), king: WT('king'), an: WT('old') - 0.14, and2: WT('said') - 0.18, but: WT('but'), nobody: WT('nobody'), days: WT('days', 2), then: WT('then'), the4: WT('queen') - 0.22,
  what: WT('what'), so: WT('opened') - 0.46, the6: WT('carpenter', 2) - 0.58, the7: WT('statues') - 0.5, no2: WT('no', 2), just: WT('just'), wait: WT('wait'), he: WT('wanted', 2) - 0.18, but2: WT('but', 2),
  and8: WT('keep') - 0.38, with: WT('with'), with2: WT('with', 2), thats: WT("that's"), comment: WT('comment') };
const glow = (c, o = 0.5) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, depthWrite: false, blending: THREE.AdditiveBlending });
const noOut = (m) => { m.userData.noOutline = true; m.castShadow = false; return m; };

// ---------------- the three deities (Jagannath, Balabhadra, Subhadra): big heads, big round eyes, arms with no hands
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
// ---------------- Puri: the king's courtyard by the sea
mesh(new THREE.BoxGeometry(16, 0.08, 12), mat(0xf3e2b8), 0, 0.04, -2, scene).castShadow = false;
const sea = noOut(mesh(new THREE.PlaneGeometry(200, 60, 40, 10).rotateX(-Math.PI / 2), mat(0x2f8fd0, { r: 0.3 }), 0, 0.02, -45, scene));
const cream = mat(0xf3e2b8), red = mat(0xd8573a), gold = mat(0xffd23a, { m: 0.5, r: 0.4 });
mesh(new THREE.BoxGeometry(14, 4, 3), cream, 0, 2, -7.5, scene); mesh(new THREE.BoxGeometry(5, 6.5, 3.4), cream, 0, 3.25, -7.3, scene);
mesh(new THREE.SphereGeometry(2.2, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), red, 0, 6.5, -7.3, scene); mesh(new THREE.ConeGeometry(0.3, 1.1, 6), gold, 0, 9.2, -7.3, scene);
for (let i = 0; i < 7; i++) mesh(new THREE.CylinderGeometry(0.2, 0.2, 3.4, 8), cream, -5 + i * (10 / 6), 1.7, -5.8, scene);
for (let i = 0; i < 6; i++) palm(scene, (i % 2 ? 1 : -1) * (7 + (i % 3) * 1.5), -3 + Math.floor(i / 2) * 3, R);
const appear = []; for (let i = 0; i < 24; i++) appear.push(noOut(mesh(new THREE.OctahedronGeometry(0.06, 0), glow(0xffd23a, 0.9), 0, 0, 0, scene)));
// ---------------- the workshop (x = 40): a hut with a locked door; inside, the three statues and the tools
const W = new THREE.Group(); W.position.set(40, 0, 0); scene.add(W);
mesh(new THREE.BoxGeometry(12, 0.08, 10), mat(0xd9b77a), 0, 0.04, 0, W).castShadow = false;
const wall = mat(0xc98f56); mesh(new THREE.BoxGeometry(7, 3.6, 0.3), wall, 0, 1.8, -4.5, W); for (const x of [-3.5, 3.5]) mesh(new THREE.BoxGeometry(0.3, 3.6, 4.5), wall, x, 1.8, -2.3, W);
for (const x of [-2.25, 2.25]) mesh(new THREE.BoxGeometry(2.5, 3.6, 0.3), wall, x, 1.8, 0, W); mesh(new THREE.BoxGeometry(2.0, 1.2, 0.3), wall, 0, 3.0, 0, W);
const roof = mesh(new THREE.ConeGeometry(5.2, 2.0, 4), mat(0xd9b25a), 0, 4.6, -2.25, W); roof.rotation.y = Math.PI / 4; roof.scale.z = 0.7;
const doorL = new THREE.Group(); doorL.position.set(-1.0, 0, 0.17); W.add(doorL); mesh(new THREE.BoxGeometry(1.0, 2.4, 0.1), mat(0x7a4a22), 0.5, 1.2, 0, doorL);
const doorR = new THREE.Group(); doorR.position.set(1.0, 0, 0.17); W.add(doorR); mesh(new THREE.BoxGeometry(1.0, 2.4, 0.1), mat(0x6b4020), -0.5, 1.2, 0, doorR);
const lock = new THREE.Group(); lock.position.set(0, 1.25, 0.28); W.add(lock); mesh(new THREE.BoxGeometry(0.22, 0.2, 0.08), gold, 0, 0, 0, lock); mesh(new THREE.TorusGeometry(0.08, 0.02, 6, 12, Math.PI), mat(0xb0b0b8, { m: 0.8, r: 0.3 }), 0, 0.1, 0, lock);
const inner = new THREE.PointLight(0xffd8a0, 0, 7, 1.4); inner.position.set(40, 2.4, -2); scene.add(inner);
const D = [deity(W, -1.5, -2.8, 'bala', 0.85), deity(W, 0.0, -3.0, 'subhadra', 0.75), deity(W, 1.5, -2.8, 'jagannath', 0.9)];
for (let i = 0; i < 4; i++) mesh(new THREE.BoxGeometry(0.3, 0.04, 0.05), mat(0x8a5a2a), -1 + i * 0.6, 0.1, -1.0 + (i % 2) * 0.3, W);
const chips = []; for (let i = 0; i < 16; i++) chips.push(noOut(mesh(new THREE.BoxGeometry(0.06, 0.02, 0.04), mat(0xe0b07a), 0, 0, 0, scene)));
const vanish = []; for (let i = 0; i < 20; i++) vanish.push(noOut(mesh(new THREE.OctahedronGeometry(0.05, 0), glow(0xfff0a0, 0.9), 0, 0, 0, scene)));
// the dream: a glowing bubble over the sleeping king with the Lord inside
const bubble = noOut(mesh(new THREE.SphereGeometry(1.5, 24, 16), glow(0xbfd8ff, 0.18), 0.6, 3.3, -1.2, scene));
const dreamJ = deity(scene, 0.6, -1.4, 'jagannath', 0.75);
const halo = noOut(mesh(new THREE.RingGeometry(0.9, 1.1, 32), glow(0xffd23a, 0.5), 0.6, 3.6, -1.6, scene));
// ---------------- the temple today (x = 80)
const T = new THREE.Group(); T.position.set(80, 0, 0); scene.add(T);
mesh(new THREE.BoxGeometry(14, 0.1, 12), mat(0xf3e6c8), 0, 0.05, 0, T).castShadow = false; mesh(new THREE.BoxGeometry(14, 9, 0.3), mat(0x9a2a3a), 0, 4.5, -4.5, T);
mesh(new THREE.BoxGeometry(6, 0.7, 2.4), mat(0x7a4a22), 0, 0.35, -3.1, T); mesh(new THREE.BoxGeometry(6.1, 0.08, 2.5), mat(0xffd23a), 0, 0.72, -3.1, T);
const TD = [deity(T, -1.8, -3.1, 'bala', 1.05), deity(T, 0.0, -3.3, 'subhadra', 0.9), deity(T, 1.8, -3.1, 'jagannath', 1.1)]; TD.forEach((d) => (d.g.position.y = 0.76));
for (let i = 0; i < 24; i++) { const u = i / 23; noOut(mesh(new THREE.SphereGeometry(0.1, 6, 4), mat(i % 2 ? 0xf6a531 : 0xffffff), -3.2 + u * 6.4, 4.6 - Math.sin(u * Math.PI) * 0.7, -4.2, T)); }
const tl = [lamp(T, -3.4, 0.1, -1.6, 1.0), lamp(T, 3.4, 0.1, -1.6, 1.0)];
const armGlows = [-1, 1].map((sd) => noOut(mesh(new THREE.SphereGeometry(0.24, 16, 12), glow(0xffd23a, 0), 81.8 + sd * 0.46, 1.86, -2.55, scene)));
// ---------------- the cast
const C = makeCast(scene, [['king', 'king'], ['queen', 'rukmini'], ['carp', 'carpenter'], ['p1', 'devotee'], ['p2', 'gopi1'], ['p3', 'kid2'], ['p4', 'crowd'], ['p5', 'gopi3'], ['p6', 'kid3']]);
addOutlines(scene);
const confetti = makeConfetti(scene, 70, 30);

function update(s, t) {
  const cx = camera.position.x, set = cx > 60 ? 80 : cx > 20 ? 40 : 0;
  // days and nights pass while he carves; silence on day fifteen; the dream is at night
  const cycling = s >= E.days && s < E.then, night = s >= E.but2 && s < E.with && set === 0;
  const cyc = cycling ? 0.5 - 0.5 * Math.cos((s - E.days) / (E.then - E.days) * Math.PI * 2 * 4) : 0;
  S.mood(set === 80 ? 0.1 : night ? 0.85 : cyc * 0.8); S.hemi.intensity = set === 80 ? 1.3 : night ? 0.7 : 1.35 - cyc * 0.5;
  S.sun.target.position.set(set, 0, 0); S.sun.position.set(set - 8, 14, 10); S.sun.target.updateMatrixWorld();
  // --- the courtyard: the king wants a statue; an old carpenter appears
  const carpIn = sm(seg(s, E.an - 0.1, E.an + 0.6));
  pose(C.king, camera, { visible: set !== 40 || s >= E.the4, x: set === 40 ? 39.0 : night ? -0.9 : -1.0, z: set === 40 ? 1.4 : night ? -1.0 : 0.6, h: 1.78, sitting: night,
    mood: night ? 'closed' : s >= E.wait - 0.2 && s < E.he ? 'wow' : s >= E.he && s < E.but2 ? 'sad' : s >= E.the6 && s < E.wait ? 'wow' : 'normal', arm: s >= E.king && s < E.an ? 'offer' : 'down' });
  pose(C.queen, camera, { visible: set === 0 ? !night : set === 40 && s >= E.the4, x: set === 40 ? (s >= E.so ? 40.2 : 40.9) : -2.0, z: set === 40 ? (s >= E.so ? 0.9 : 1.5) : 0.9, h: 1.68,
    mood: s >= E.the4 && s < E.so + 0.5 ? 'sad' : s >= E.the6 ? 'wow' : 'happy', arm: s >= E.so - 0.2 && s < E.the6 ? 'offer' : 'down' });
  pose(C.carp, camera, { visible: set === 0 && s >= E.an - 0.1 && s < E.nobody + 0.3, x: 0.9, z: 0.4, h: 1.62 * Math.max(0.01, carpIn), mood: s >= E.and2 ? 'happy' : 'normal', arm: s >= E.and2 && s < E.but ? 'up' : 'down' });
  appear.forEach((m, i) => { const u = s - E.an + 0.1 - (i % 8) * 0.05; m.visible = set === 0 && u > 0 && u < 1.4; const a = i * 2.4; m.position.set(0.9 + Math.cos(a) * (0.3 + u * 0.6), 0.2 + (i % 6) * 0.3 + u * 0.4, 0.4 + Math.sin(a) * 0.3); m.rotation.y = t * 4; });
  // --- the workshop: door locks; chips fly while he carves; silence; the queen opens it; he has vanished
  const shut = s < E.so, open = sm(seg(s, E.so + 0.1, E.so + 1.0));
  doorL.rotation.y = lerp(0, -1.7, open); doorR.rotation.y = lerp(0, 1.7, open); lock.visible = s >= E.but && s < E.so + 0.1;
  inner.intensity = open * 6;
  chips.forEach((m, i) => { const u = (t * 1.3 + i / 16) % 1; m.visible = cycling; m.position.set(40 + (i % 2 ? 0.15 : -0.15) + (i % 2 ? 1 : -1) * u * 1.2, 0.2 + Math.sin(u * Math.PI) * 0.9, 0.3 + u * 0.8); m.rotation.set(t * 5 + i, t * 3, 0); });
  doorL.position.x = -1.0 + (cycling ? Math.sin(t * 40) * 0.006 : 0);
  vanish.forEach((m, i) => { const u = s - E.the6 - (i % 10) * 0.05; m.visible = u > 0 && u < 1.6; const a = i * 2.4; m.position.set(40 + Math.cos(a) * 0.4, 0.4 + u * 1.2 + (i % 4) * 0.2, -1.4 + Math.sin(a) * 0.3); m.rotation.y = t * 4; });
  // --- the dream
  const dream = sm(seg(s, E.but2 + 0.3, E.but2 + 1.2)) * (1 - sm(seg(s, E.with - 0.2, E.with)));
  bubble.visible = dreamJ.g.visible = halo.visible = dream > 0.01; bubble.material.opacity = 0.18 * dream; halo.material.opacity = 0.5 * dream; halo.rotation.z = t * 0.5;
  dreamJ.g.position.set(0.6, 2.35 + Math.sin(t * 1.5) * 0.06, -1.3); dreamJ.g.scale.setScalar(0.75 * dream);
  // --- the temple today: devotees raise their arms; his arms glow when he says "I still hold you"
  const ag = sm(seg(s, E.with, E.with + 0.5)) * (1 - sm(seg(s, E.with2, E.with2 + 0.4))) * 0.35 * (1 + 0.15 * Math.sin(t * 4)); armGlows.forEach((m) => { m.material.opacity = ag * 1.6; m.scale.setScalar(1 + 0.15 * Math.sin(t * 5)); });
  const jai = s >= E.thats || s < E.as;
  [['p1', 77.6, 0.6, 1.7], ['p2', 78.8, 1.2, 1.62], ['p3', 79.8, 1.6, 1.15], ['p4', 80.8, 1.4, 1.7], ['p5', 81.9, 1.0, 1.62], ['p6', 82.8, 0.5, 1.2]].forEach(([n, x, z, h], i) => pose(C[n], camera, { x, z, h,
    mood: Math.sin(t * 3 + i) > 0 ? 'closed' : 'happy', arm: jai && Math.sin(t * 4 + i * 1.3) > -0.2 ? 'up' : 'down', y: jai ? Math.abs(Math.sin(t * 4 + i)) * 0.06 : 0 }));
  tl.forEach((l, i) => (l.flame.scale.y = 1 + 0.15 * Math.sin(t * 13 + i)));
  sea.position.y = 0.02 + Math.sin(t) * 0.02;
  confetti(E.comment, s, V(80, 3.8, -1));
  S.clouds.forEach((c, i) => { c.position.x = -80 + i * 15 + ((t * 0.6 + i * 3) % 12); });
}

const G = (t) => t;
const SHOTS = [
  [0, E.and - 0.05, G, [[80, 2.2, 6.5], [80, 2.0, -3]], [[80, 2.1, 5.4], [80, 2.0, -3]]],
  [E.and - 0.05, E.as - 0.05, G, [[81.85, 2.45, -0.4], [81.8, 2.45, -3.1]], [[81.83, 2.45, -0.75], [81.8, 2.45, -3.1]]],
  [E.as - 0.05, E.king - 0.05, G, [[0, 5, 14], [0, 3, -6]], [[0, 3.4, 11], [0, 2.6, -6]]],
  [E.king - 0.05, E.an - 0.05, G, [[-1.2, 1.7, 4.2], [-1.4, 1.5, 0.6]], [[-1.1, 1.7, 3.8], [-1.4, 1.5, 0.6]]],
  [E.an - 0.05, E.and2 - 0.05, G, [[0.2, 1.6, 5.0], [0.4, 1.2, 0.4]], [[0.3, 1.6, 4.4], [0.6, 1.2, 0.4]]],
  [E.and2 - 0.05, E.but - 0.05, G, [[1.0, 1.6, 2.8], [0.9, 1.45, 0.4]], [[1.0, 1.6, 2.5], [0.9, 1.45, 0.4]]],
  [E.but - 0.05, E.days - 0.05, G, [[40, 2.0, 6.6], [40, 1.6, 0]], [[40, 1.6, 4.2], [40, 1.3, 0]]],
  [E.days - 0.05, E.then - 0.05, G, [[42.6, 2.6, 7.6], [40, 1.6, -1]], [[41.6, 2.4, 6.6], [40, 1.6, -1]]],
  [E.then - 0.05, E.the4 - 0.05, G, [[40, 1.5, 3.4], [40, 1.3, 0]], [[40, 1.5, 3.2], [40, 1.3, 0]]],
  [E.the4 - 0.05, E.so - 0.05, G, [[39.6, 1.7, 4.4], [40.4, 1.4, 1.2]], [[39.7, 1.7, 4.0], [40.4, 1.4, 1.2]]],
  [E.so - 0.05, E.the6 - 0.05, G, [[40.3, 1.9, 6.0], [40, 1.4, 0]], [[40.2, 1.8, 5.2], [40, 1.4, 0]]],
  [E.the6 - 0.05, E.the7 - 0.05, G, [[39.7, 1.6, 0.6], [40, 1.0, -1.6]], [[39.7, 1.6, 0.3], [40, 1.0, -1.6]]],
  [E.the7 - 0.05, E.just - 0.05, G, [[38.2, 1.5, 0.6], [40, 1.2, -2.9]], [[41.6, 1.5, 0.4], [40, 1.2, -2.9]]],
  [E.just - 0.05, E.wait - 0.05, G, [[41.35, 1.4, -0.5], [41.35, 1.35, -2.9]], [[41.35, 1.4, -0.8], [41.35, 1.35, -2.9]]],
  [E.wait - 0.05, E.he - 0.05, G, [[39.2, 1.7, 3.4], [39.0, 1.5, 1.4]], [[39.2, 1.7, 3.1], [39.0, 1.5, 1.4]]],
  [E.he - 0.05, E.but2 - 0.05, G, [[38.4, 1.8, 3.8], [39.6, 1.2, -1.4]], [[38.6, 1.8, 3.4], [39.8, 1.2, -1.4]]],
  [E.but2 - 0.05, E.and8 - 0.05, G, [[-0.2, 2.2, 5.4], [0, 2.0, -1.2]], [[-0.1, 2.2, 4.8], [0, 2.1, -1.2]]],
  [E.and8 - 0.05, E.with - 0.05, G, [[0.6, 2.6, 2.6], [0.6, 2.6, -1.3]], [[0.6, 2.6, 2.3], [0.6, 2.6, -1.3]]],
  [E.with - 0.05, E.with2 - 0.05, G, [[82.4, 2.0, 0.8], [81.8, 1.9, -2.6]], [[82.3, 2.0, 0.5], [81.8, 1.9, -2.6]]],
  [E.with2 - 0.05, E.thats - 0.05, G, [[81.85, 2.45, -0.5], [81.8, 2.45, -3.1]], [[81.83, 2.45, -0.8], [81.8, 2.45, -3.1]]],
  [E.thats - 0.05, E.comment - 0.05, G, [[80, 2.6, 8.4], [80, 2.0, -3]], [[80, 2.4, 7.2], [80, 2.0, -3]]],
  [E.comment - 0.05, DURATION + 0.1, G, [[80, 2.8, 9.0], [80, 2.2, -3]], [[80, 2.7, 8.4], [80, 2.2, -3]]],
];
direct({ stage, WORDS, DURATION, shots: SHOTS, update, title: E.and - 0.05, q: [E.wait, E.he], cta: E.comment,
  key: ['jagannath', 'hands', 'eyes', 'story', 'indradyumna', 'puri', 'statue', 'carpenter', 'carve', 'twenty-one', 'nobody', 'door', 'chisel', 'fifteen', 'silence', 'queen', 'worried', 'died', 'opened', 'vanished', 'unfinished', 'feet', 'wait', 'dream', 'keep', 'hold', 'everyone', 'today', 'comment', 'jai'],
  loc: (t) => (t >= E.as - 0.05 && t < E.king - 0.05 ? '📍 PURI · LONG AGO' : t >= E.but - 0.05 && t < E.days - 0.05 ? '21 DAYS · NOBODY OPENS' : t >= E.days - 0.05 && t < E.then - 0.05 ? 'DAY ' + Math.min(14, 1 + Math.floor((t - E.days) / (E.then - E.days) * 14)) : t >= E.then - 0.05 && t < E.the4 - 0.05 ? 'DAY 15 · SILENCE' : t >= E.but2 - 0.05 && t < E.with - 0.05 ? 'THAT NIGHT' : t >= E.thats - 0.05 && t < E.comment ? 'EVEN TODAY' : ''),
  shakes: [], tick: () => {} });
