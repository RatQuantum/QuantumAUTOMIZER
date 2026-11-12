// Day 22 · "Why a peacock feather?" · Why we do what we do #4 (as the story goes: a folk tale, told as one)
// Sets: a forest clearing in Vrindavan (origin) with a rock, cows, birds and a growing crowd of peacocks; a home altar (x = 40).
import * as THREE from './three.module.js';
import { rng, mat, mesh, sm, seg, lerp, clamp, setupScene, makeCast, pose, lamp, roundTree, palm, cow, peacock, featherProp } from './kit.js';
import { makeStage, direct, wordTime } from './director.js';
import { addOutlines, addLife, makeConfetti } from './plus.js';
import { WORDS, DURATION } from './data.js';

const stage = makeStage(), { scene, camera } = stage, V = (x, y, z) => new THREE.Vector3(x, y, z), R = rng(22);
const S = setupScene(scene, [[0, 0], [40, 0]], 22);
const WT = wordTime(WORDS);
const E = { theres: WT("there's"), not: WT('not'), a3: WT('peacock'), why: WT('why'), as: WT('as'), young: WT('young'), and2: WT('and', 2), the4: WT('birds') - 0.2, cows: WT('cows'), then: WT('then'), one: WT('one', 2), ten: WT('ten'), hundred: WT('hundred'), dance: WT('dance'), tails: WT('tails'), wait: WT('wait'), when: WT('when'), king: WT('king'), drops: WT('drops'), krishna3: WT('krishna', 3), tucks: WT('tucks'), thats: WT("that's"), crown2: WT('crown', 2), and8: WT('homes') - 0.6, not2: WT('not', 2), comment: WT('comment') };

// ---------------- the forest clearing in Vrindavan (origin)
mesh(new THREE.CylinderGeometry(7.5, 7.5, 0.1, 28), mat(0x8ad84a), 0, 0.05, 0, scene).castShadow = false;
const rock = mesh(new THREE.DodecahedronGeometry(0.75, 0), mat(0x9a96b0), 0, 0.35, -0.6, scene); rock.scale.set(1.3, 0.75, 1.0);
for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2 + R() * 0.2, r = 9 + R() * 3; if (Math.sin(a) * r - 1 > -1) continue; (i % 3 ? roundTree : palm)(scene, Math.cos(a) * r, Math.sin(a) * r - 1, R, 1 + R() * 0.4); }
roundTree(scene, -4.6, -5.2, R, 1.5); roundTree(scene, 4.8, -5.5, R, 1.4);
const river = mesh(new THREE.PlaneGeometry(60, 5).rotateX(-Math.PI / 2), mat(0x3f9fd8, { r: 0.35 }), 0, 0.07, -11, scene); river.castShadow = false; river.userData.noOutline = true;
for (let i = 0; i < 50; i++) { const a = R() * Math.PI * 2, r = 2 + R() * 6; mesh(new THREE.IcosahedronGeometry(0.12 + R() * 0.1, 0), mat([0xe8462c, 0xffd23a, 0xffffff, 0xf5a6c0, 0xb07ad8][i % 5]), Math.cos(a) * r, 0.14, Math.sin(a) * r, scene).userData.noOutline = true; }
const cows = [cow(scene, -3.6, 1.8, 0.6, R), cow(scene, 3.8, 2.2, 2.4, R), cow(scene, -5.2, -2.0, 1.2, R)];
// birds on a low branch (they turn to listen)
const branch = mesh(new THREE.CylinderGeometry(0.07, 0.09, 3.2, 6).rotateZ(Math.PI / 2), mat(0x8a5a2a), -3.2, 2.6, -2.2, scene);
const perch = [];
for (let i = 0; i < 4; i++) { const b = new THREE.Group(); b.position.set(-4.4 + i * 0.8, 2.75, -2.2); scene.add(b); mesh(new THREE.SphereGeometry(0.16, 8, 6).scale(1, 0.9, 1.2), mat([0xff8a1e, 0x5ad8ff, 0xffd23a, 0xe8462c][i]), 0, 0, 0, b); const h = mesh(new THREE.SphereGeometry(0.1, 8, 6), mat([0xff8a1e, 0x5ad8ff, 0xffd23a, 0xe8462c][i]), 0, 0.16, 0.08, b); mesh(new THREE.ConeGeometry(0.03, 0.08, 4).rotateX(Math.PI / 2), mat(0xffd23a), 0, 0.15, 0.2, b); perch.push(b); }
// the peacocks: positions in rings around the rock, each with its arrival time
const P = [];
for (let i = 0; i < 34; i++) {
  const ring = i < 1 ? 0 : i < 10 ? 1 : 2, a = Math.PI * (0.92 + ((i * 0.618) % 1) * 1.16), r = [2.4, 3.2, 4.6][ring] + R() * 0.8;
  const pc = peacock(scene, 0.9 + R() * 0.2);
  P.push({ pc, home: V(Math.cos(a) * r * 1.15, 0, Math.sin(a) * r * 0.75 + 0.6), arrive: i < 1 ? 0 : i < 10 ? 1 : 2, ph: R() * 6 });
}
const kingP = peacock(scene, 1.35, true);
const feather = featherProp(scene, 0.9);
// ---------------- the home altar (x = 40)
const H = new THREE.Group(); H.position.set(40, 0, 0); scene.add(H);
mesh(new THREE.BoxGeometry(12, 0.1, 10), mat(0xe8d3a0), 0, 0.05, 0, H);
mesh(new THREE.BoxGeometry(12, 9, 0.3), mat(0xf6e1b8), 0, 4.5, -3, H);
for (let i = 0; i < 6; i++) mesh(new THREE.BoxGeometry(12, 0.05, 0.02), mat(0xe8c890), 0, 1 + i * 1.3, -2.84, H).userData.noOutline = true;
mesh(new THREE.BoxGeometry(3.6, 1.1, 1.4), mat(0x8a4b20), 0, 0.55, -2.2, H); mesh(new THREE.BoxGeometry(3.7, 0.08, 1.5), mat(0xd8263a), 0, 1.12, -2.2, H);
const frame = mesh(new THREE.BoxGeometry(1.7, 2.3, 0.1), mat(0xffd23a, { m: 0.5, r: 0.4 }), 0, 2.6, -2.8, H); mesh(new THREE.BoxGeometry(1.45, 2.05, 0.12), mat(0x2f6fa8), 0, 2.6, -2.78, H);
for (let i = 0; i < 18; i++) mesh(new THREE.SphereGeometry(0.09, 6, 4), mat(i % 2 ? 0xf6a531 : 0xffffff), -0.85 + i * 0.1, 3.7 - Math.sin(i / 17 * Math.PI) * 0.35, -2.7, H).userData.noOutline = true;
const crown = new THREE.Group(); crown.position.set(-1.25, 1.3, -2.1); H.add(crown); const gm = mat(0xffd23a, { m: 0.7, r: 0.3 }); mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.18, 10, 1, true), gm, 0, 0, 0, crown); for (let p = 0; p < 6; p++) { const a = p / 6 * Math.PI * 2; mesh(new THREE.ConeGeometry(0.05, 0.16, 4), gm, Math.cos(a) * 0.21, 0.14, Math.sin(a) * 0.21, crown); }
mesh(new THREE.BoxGeometry(0.6, 0.12, 0.6), mat(0xd8263a), -1.25, 1.18, -2.1, H);
const vase = new THREE.Group(); vase.position.set(1.25, 1.16, -2.1); H.add(vase); mesh(new THREE.CylinderGeometry(0.16, 0.22, 0.55, 10).translate(0, 0.27, 0), mat(0x2f6fa8, { r: 0.3 }), 0, 0, 0, vase);
const vf = [-0.35, -0.12, 0.12, 0.35].map((a, i) => { const f = featherProp(vase, 0.8); f.position.y = 0.3; f.rotation.z = a; f.rotation.y = i * 0.3; return f; });
const hl = lamp(H, 0.6, 1.16, -1.8, 0.7), hl2 = lamp(H, -0.6, 1.16, -1.8, 0.7);
// ---------------- the cast
const C = makeCast(scene, [['krishna', 'krishna'], ['picture', 'krishna'], ['mom', 'gopi2'], ['kid', 'kid3']]);
addOutlines(scene);
const life = addLife(scene, [{ x: 0, z: 0, r0: 8, r1: 13 }]);
const confetti = makeConfetti(scene, 60, 22);

function update(s, t) {
  // dusk comes "for hours" during the dance, and stays gold
  const dusk = sm(seg(s, E.tails, E.wait + 0.5));
  S.mood(0); S.paintSky(new THREE.Color(0x4a8fe0).lerp(new THREE.Color(0xf08a4a), dusk * 0.7), new THREE.Color(0xcfe9ff).lerp(new THREE.Color(0xffd08a), dusk));
  S.sun.color.set(new THREE.Color(0xfff1d6).lerp(new THREE.Color(0xffb36a), dusk)); S.sun.position.set(-8 - dusk * 6, 14 - dusk * 7, 9);
  // Krishna on the rock with his flute; no feather until he tucks it in
  const hasFeather = s >= E.tucks + 0.3;
  const playing = s >= E.young + 1.4 && s < E.when + 0.9;
  pose(C.krishna, camera, { x: 0, y: 0.55, z: -0.5, h: 1.6, sitting: true, nofeather: !hasFeather, flute: playing, mood: playing ? 'closed' : s >= E.krishna3 ? 'happy' : 'normal', arm: s >= E.krishna3 && s < E.tucks + 0.4 ? 'offer' : 'down' });
  // the forest listens: birds turn, cows stop chewing
  const quiet = s >= E.and2 + 0.4;
  perch.forEach((b, i) => { b.rotation.y = quiet ? 0.6 * (i % 2 ? 1 : -1) * sm(seg(s, E.the4, E.the4 + 0.6)) : Math.sin(t * 6 + i) * 0.4; b.position.y = 2.75 + (quiet ? 0 : Math.abs(Math.sin(t * 8 + i)) * 0.05); });
  cows.forEach((c, i) => { c.children[1].rotation.z = s >= E.cows + 0.3 ? 0.25 : Math.sin(t * 6 + i) * 0.12; c.children[2].position.y = 1.05 + (s >= E.cows + 0.3 ? 0 : Math.sin(t * 10 + i) * 0.02); });
  // peacocks: one, ten, a hundred; then they dance
  const arrive = [E.then + 0.3, E.ten, E.hundred], danceK = sm(seg(s, E.dance - 0.2, E.dance + 0.8));
  P.forEach((p, i) => {
    const ta = arrive[p.arrive] + (i % 9) * 0.07, k = sm(seg(s, ta, ta + 0.9));
    p.pc.g.visible = k > 0;
    if (!p.pc.g.visible) return;
    const from = p.home.clone().multiplyScalar(2.6).add(V(0, 0, -4)), pos = from.lerp(p.home, k);
    p.pc.g.position.copy(pos); p.pc.g.position.y = danceK * Math.abs(Math.sin(t * 3 + p.ph)) * 0.18;
    const face = Math.atan2(-pos.x, -0.5 - pos.z);
    p.pc.g.rotation.y = face + danceK * (t * 1.6 + p.ph) * (s >= E.tails + 0.6 ? 1 : 0.3) * (s < E.when + 0.4 ? 1 : 0);
    p.pc.set(danceK * (s < E.when + 1.2 ? 1 : 0.9), t, p.ph);
  });
  // the king walks up, bows, drops a feather; Krishna picks it up and tucks it into his hair
  const kw = sm(seg(s, E.king, E.king + 1.3)), bow = sm(seg(s, E.king + 1.5, E.king + 1.9)) * (1 - sm(seg(s, E.drops + 1.0, E.drops + 1.5)));
  // the train folds while he walks and bows (so it never walls off the camera), then he steps aside and fans it out proudly
  const aside = sm(seg(s, E.tucks + 0.3, E.tucks + 1.3)), fold = sm(seg(s, E.when + 0.3, E.when + 0.9)) * (1 - sm(seg(s, E.tucks + 0.9, E.tucks + 1.6)));
  kingP.g.visible = s >= E.when - 0.3; kingP.g.position.set(lerp(lerp(3.6, 0.95, kw), 2.3, aside), 0, lerp(lerp(3.2, 0.8, kw), 0.3, aside));
  kingP.g.rotation.y = lerp(Math.atan2(-kingP.g.position.x, -0.5 - kingP.g.position.z), -0.5, aside); kingP.body.rotation.x = bow * 0.5;
  kingP.set(1 - fold, t, 1.3);
  const fall = seg(s, E.drops, E.drops + 1.0), pick = sm(seg(s, E.krishna3, E.krishna3 + 0.6)), tuck = sm(seg(s, E.tucks, E.tucks + 0.5));
  feather.visible = s >= E.drops && s < E.tucks + 0.35;
  const ground = V(0.35, 0.15, 0.25), inHand = V(0.55, 1.35, -0.35), onHead = V(0.18, 2.35, -0.45);
  if (s < E.krishna3) { feather.position.set(lerp(0.9, ground.x, fall), lerp(1.4, ground.y, fall) + Math.sin(fall * 8) * 0.06 * (1 - fall), lerp(0.7, ground.z, fall)); feather.rotation.set(-Math.PI / 2 * fall, 0, Math.sin(s * 7) * 0.5 * (1 - fall)); }
  else { const p = ground.clone().lerp(inHand, pick).lerp(onHead, tuck); feather.position.copy(p); feather.rotation.set(lerp(-Math.PI / 2, 0, pick), 0, lerp(0, 0.35, tuck)); }
  // home: the picture on the wall, the family at the altar
  pose(C.picture, camera, { x: 40, y: 1.65, z: -2.68, h: 1.85, mood: 'happy' });
  C.picture.m.quaternion.identity();
  const homeOn = s >= E.and8 - 0.2;
  pose(C.mom, camera, { visible: homeOn, x: 39.0, z: 0.2, mood: 'closed', arm: 'down' });
  pose(C.kid, camera, { visible: homeOn, x: 40.9, z: 0.4, h: 1.25, mood: 'happy', arm: 'down' });
  [hl, hl2].forEach((l, i) => { l.flame.scale.y = 1 + 0.15 * Math.sin(t * 13 + i); });
  vf.forEach((f, i) => (f.rotation.y = i * 0.3 + Math.sin(t * 0.8 + i) * 0.1));
  crown.rotation.y = t * 0.5;
  confetti(E.not2 + 0.2, s, V(0.5, 3.2, -0.2));
  life(t); S.clouds.forEach((c, i) => { c.position.x = -80 + i * 15 + ((t * 0.6 + i * 3) % 12); });
}

const G = (t) => t;
const SHOTS = [
  [0, E.theres - 0.05, G, [[40, 2.4, 7.5], [40, 2.4, -2.5]], [[40, 2.4, 6.2], [40, 2.4, -2.5]]],
  [E.theres - 0.05, E.not - 0.05, G, [[40.05, 3.3, 0.9], [40, 3.2, -2.7]], [[40.05, 3.3, 0.6], [40, 3.25, -2.7]]],
  [E.not - 0.05, E.a3 - 0.6, G, [[38.6, 1.6, -0.6], [38.75, 1.35, -2.1]], [[38.65, 1.6, -0.8], [38.75, 1.35, -2.1]]],
  [E.a3 - 0.6, E.as - 0.05, G, [[41.0, 1.9, -0.7], [41.25, 1.9, -2.1]], [[41.05, 1.95, -0.95], [41.25, 2.0, -2.1]]],
  [E.as - 0.05, E.young - 0.05, G, [[0, 6.5, 15], [0, 1.5, -1]], [[0, 5.2, 12], [0, 1.4, -1]]],
  [E.young - 0.05, E.and2 - 0.05, G, [[0.6, 1.7, 3.4], [0, 1.6, -0.5]], [[0.5, 1.65, 3.0], [0, 1.6, -0.5]]],
  [E.and2 - 0.05, E.the4 - 0.05, G, [[0, 3.0, 9.5], [0, 1.6, -1]], [[0, 2.8, 8.5], [0, 1.6, -1]]],
  [E.the4 - 0.05, E.cows - 0.15, G, [[-3.0, 2.8, 0.2], [-3.2, 2.7, -2.2]], [[-3.05, 2.8, 0.0], [-3.2, 2.7, -2.2]]],
  [E.cows - 0.15, E.then - 0.05, G, [[-1.2, 1.7, 6.4], [-3.6, 1.0, 1.8]], [[-1.4, 1.7, 5.9], [-3.6, 1.0, 1.8]]],
  [E.then - 0.05, E.one - 0.05, G, [[1.5, 1.4, 6.2], [0.5, 0.8, 1.0]], [[1.3, 1.4, 5.6], [0.4, 0.8, 1.0]]],
  [E.one - 0.05, E.dance - 0.4, G, [[0, 5.0, 12], [0, 0.6, 0]], [[0, 4.6, 10.5], [0, 0.6, 0]]],
  [E.dance - 0.4, E.tails - 0.05, G, [[2.6, 1.4, 5.0], [1.0, 1.0, 0.5]], [[2.4, 1.4, 4.4], [1.0, 1.0, 0.5]]],
  [E.tails - 0.05, E.wait - 0.05, G, [[0, 3.6, 9.5], [0, 1.0, 0]], [[-1.5, 3.0, 8.4], [0, 1.0, 0]]],
  [E.wait - 0.05, E.when - 0.05, G, [[0, 2.3, 6.4], [0, 1.3, -0.5]], [[0, 2.2, 5.6], [0, 1.3, -0.5]]],
  [E.when - 0.05, E.king - 0.05, G, [[0.35, 1.75, 2.6], [0, 1.65, -0.5]], [[0.33, 1.75, 2.35], [0, 1.65, -0.5]]],
  [E.king - 0.05, E.drops - 0.05, G, [[-2.6, 2.1, 6.6], [1.4, 0.9, 1.2]], [[-2.3, 2.0, 6.0], [1.1, 0.9, 0.9]]],
  [E.drops - 0.05, E.krishna3 - 0.05, G, [[-1.9, 1.5, 4.4], [0.6, 0.6, 0.4]], [[-1.7, 1.4, 4.0], [0.5, 0.5, 0.4]]],
  [E.krishna3 - 0.05, E.tucks - 0.1, G, [[-0.9, 1.7, 3.1], [0.0, 1.45, -0.5]], [[-0.85, 1.7, 2.9], [0.0, 1.45, -0.5]]],
  [E.tucks - 0.1, E.thats - 0.05, G, [[0.25, 2.05, 1.9], [0.05, 1.95, -0.5]], [[0.22, 2.05, 1.7], [0.05, 1.95, -0.5]]],
  [E.thats - 0.05, E.crown2 - 0.05, G, [[40, 2.4, 7.5], [40, 2.3, -2.5]], [[40, 2.4, 6.8], [40, 2.3, -2.5]]],
  [E.crown2 - 0.05, E.and8 - 0.05, G, [[40.05, 3.3, 0.8], [40, 3.25, -2.7]], [[40.05, 3.3, 0.55], [40, 3.25, -2.7]]],
  [E.and8 - 0.05, E.not2 - 0.05, G, [[41.6, 1.9, 2.6], [40.6, 1.4, -1.6]], [[41.3, 1.8, 2.2], [40.6, 1.4, -1.6]]],
  [E.not2 - 0.05, E.comment - 0.05, (t) => E.comment + 2, [[1.8, 1.6, 4.2], [0.4, 1.2, -0.2]], [[1.6, 1.6, 3.8], [0.4, 1.2, -0.2]]],
  [E.comment - 0.05, DURATION + 0.1, (t) => E.tails + 1 + (t - E.comment), [[0, 3.2, 10], [0, 1.2, 0]], [[0, 3.0, 9], [0, 1.2, 0]]],
];
direct({ stage, WORDS, DURATION, shots: SHOTS, update, title: E.why - 0.05, q: [E.wait, E.when], cta: E.comment,
  key: ['krishna', 'head', 'crown', 'gold', 'peacock', 'feather', 'why', 'story', 'vrindavan', 'young', 'rock', 'flute', 'quiet', 'birds', 'cows', 'peacocks', 'hundred', 'dance', 'tails', 'spinning', 'shimmering', 'hours', 'wait', 'gift', 'god', 'king', 'bows', 'perfect', 'feet', 'smiles', 'hair', 'never', 'today', 'homes', 'altar', 'friend', 'comment', 'mor', 'pankh'],
  loc: (t) => (t >= E.as && t < E.young ? '📍 VRINDAVAN · LONG AGO' : t >= E.thats && t < E.crown2 ? 'EVEN TODAY' : ''),
  shakes: [], tick: () => {} });
