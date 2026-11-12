// Day 21 · "Why at midnight?" (Janmashtami) · Why we do what we do #3
// Sets: temple at midnight (x = 40), Kamsa's Mathura (x = -40), the prison (origin), the flooding Yamuna (x = 80).
import * as THREE from './three.module.js';
import { rng, mat, mesh, sm, seg, lerp, clamp, setupScene, makeCast, pose, lamp, palm, roundTree, burst } from './kit.js';
import { makeStage, direct, wordTime } from './director.js';
import { addOutlines, makeConfetti } from './plus.js';
import { WORDS, DURATION } from './data.js';

const stage = makeStage(), { scene, camera } = stage, V = (x, y, z) => new THREE.Vector3(x, y, z), R = rng(21);
const S = setupScene(scene, [[0, 0], [40, 0], [-40, 0], [80, 0]], 21);
const WT = wordTime(WORDS);
const E = { midnight1: WT('midnight'), rock: WT('rock'), why: WT('why'), because: WT('because'), mathura: WT('mathura'), king: WT('king'), his: WT('his'), so: WT('so'), iron: WT('iron'), guards: WT('guards'), and2: WT('and', 2), then: WT('then'), born: WT('born'), tiny: WT('tiny'), krishna: WT('krishna'), wait: WT('wait', 2), chains2: WT('chains', 2), guards2: WT('guards', 2), and4: WT('and', 3), vasudeva2: WT('vasudeva', 2), basket: WT('basket'), storm: WT('storm'), river: WT('river'), then2: WT('then', 2), rises: WT('rises'), spreads: WT('spreads'), thats: WT("that's"), conch: WT('conch'), cradle2: WT('cradle', 2), everyone: WT('everyone'), comment: WT('comment') };

// ---------------- the prison (origin)
const stone = mat(0x8a8796), stoneD = mat(0x6f6c7c);
mesh(new THREE.BoxGeometry(13, 0.1, 10), mat(0x9c98a6), 0, 0.05, 0, scene);
for (let i = 0; i < 13; i++) for (let j = 0; j < 4; j++) mesh(new THREE.BoxGeometry(0.98, 0.5, 0.3), (i + j) % 2 ? stone : stoneD, -6 + i, 0.25 + j * 0.52 + 2.0 * 0, -4.2, scene);
mesh(new THREE.BoxGeometry(13, 5.5, 0.4), stone, 0, 2.75, -4.5, scene);
for (const x of [-6.4, 6.4]) mesh(new THREE.BoxGeometry(0.4, 5.5, 10), stoneD, x, 2.75, 0, scene);
// a barred window with the storm outside
const winGlow = mesh(new THREE.PlaneGeometry(1.6, 1.4), new THREE.MeshBasicMaterial({ color: 0x3a4a8a }), 3.2, 3.4, -4.28, scene); winGlow.userData.noOutline = true;
for (let i = 0; i < 5; i++) mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.5, 6), mat(0x3a3840, { m: 0.6 }), 2.6 + i * 0.3, 3.4, -4.2, scene);
// the doors (two panels on hinges)
const doorL = new THREE.Group(), doorR = new THREE.Group(); doorL.position.set(-3.1, 0, -4.25); doorR.position.set(0.1, 0, -4.25); scene.add(doorL); scene.add(doorR);
const wood = mat(0x6b3b20); const iron = mat(0x3a3840, { m: 0.6, r: 0.5 });
for (const [g, sgn] of [[doorL, 1], [doorR, -1]]) { mesh(new THREE.BoxGeometry(1.6, 3.6, 0.18), wood, sgn * 0.8, 1.8, 0, g); for (let k = 0; k < 3; k++) mesh(new THREE.BoxGeometry(1.6, 0.12, 0.22), iron, sgn * 0.8, 0.6 + k * 1.2, 0, g); }
const doorway = mesh(new THREE.PlaneGeometry(3.2, 3.6), new THREE.MeshBasicMaterial({ color: 0x8aa8ff }), -1.5, 1.8, -4.4, scene); doorway.userData.noOutline = true;
const torchL = lamp(scene, -5.6, 1.6, -3.6, 1.3), torchR = lamp(scene, 5.6, 1.6, -3.6, 1.3);
// chains: links from wall rings to the wrists; they fall when the chains break
const links = [];
for (const [wx, px] of [[-2.0, -1.17], [1.8, 1.27]]) for (let i = 0; i < 9; i++) { const k = i / 8; const o = mesh(new THREE.TorusGeometry(0.07, 0.022, 5, 8), iron); const a = V(wx, 1.3, -4.1), b = V(px, 0.72, 0.95); o.userData = { home: a.clone().lerp(b, k).add(V(0, -Math.sin(k * Math.PI) * 0.35, 0)), i, rot: i % 2 ? Math.PI / 2 : 0 }; scene.add(o); links.push(o); }
// the baby's glow
const halo = new THREE.PointLight(0xffe2a0, 0, 5, 1.4); halo.position.set(-0.7, 1.4, 1.6); scene.add(halo);
const haloBall = mesh(new THREE.SphereGeometry(0.3, 16, 10), new THREE.MeshBasicMaterial({ color: 0xfff1c4, transparent: true, opacity: 0.0 }), -0.74, 0.92, 1.0, scene); haloBall.userData.noOutline = true;

// ---------------- Mathura, Kamsa's palace (x = -40)
{ const P = new THREE.Group(); P.position.set(-40, 0, -9); scene.add(P); const wall = mat(0x8a6aa8), dome = mat(0x4a2a6a), gold = mat(0xffd23a, { m: 0.5, r: 0.4 });
  mesh(new THREE.BoxGeometry(16, 5, 4), wall, 0, 2.5, 0, P); mesh(new THREE.BoxGeometry(5, 7.5, 4.4), wall, 0, 3.75, 0.2, P);
  for (const dx of [-7, 7]) { mesh(new THREE.CylinderGeometry(1.2, 1.4, 8, 8), wall, dx, 4, 1, P); mesh(new THREE.ConeGeometry(1.5, 2.6, 8), dome, dx, 9.3, 1, P); }
  mesh(new THREE.SphereGeometry(2.4, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), dome, 0, 7.5, 0.2, P); mesh(new THREE.ConeGeometry(0.3, 1.2, 6), gold, 0, 10.4, 0.2, P);
  mesh(new THREE.BoxGeometry(2.2, 3.4, 0.3), mat(0x2a1a3a), 0, 1.7, 2.45, P);
  for (let i = 0; i < 6; i++) mesh(new THREE.BoxGeometry(0.8, 1.2, 0.2), mat(0xffc23a, { e: 0x7a4a00, ei: 0.6 }), -6 + i * 2.4 + (i > 2 ? 0.5 : -0.5), 3.2, 2.1, P);
  mesh(new THREE.BoxGeometry(1.8, 0.5, 1.2), gold, 0, 0.25, 6.2, P); mesh(new THREE.BoxGeometry(1.8, 2.2, 0.3), mat(0xd8263a), 0, 1.4, 5.7, P);   // the throne
  for (const [x, z] of [[-8, 6], [8, 7], [-10, 2]]) palm(scene, -40 + x, z, R); }
// ---------------- the temple at midnight (x = 40)
const T = new THREE.Group(); T.position.set(40, 0, 0); scene.add(T);
mesh(new THREE.BoxGeometry(14, 0.12, 12), mat(0xe8d3a0), 0, 0.06, 0, T);
for (let i = 0; i < 7; i++) for (let j = 0; j < 6; j++) if ((i + j) % 2) mesh(new THREE.BoxGeometry(1.9, 0.02, 1.9), mat(0xd9b77a), -6 + i * 2, 0.13, -5 + j * 2, T).castShadow = false;
mesh(new THREE.BoxGeometry(16, 14, 0.4), mat(0xb8352a), 0, 7, -4.5, T); mesh(new THREE.BoxGeometry(16, 0.4, 12), mat(0x8a2a22), 0, 9.5, 1, T);
for (let i = 0; i < 9; i++) mesh(new THREE.BoxGeometry(0.4, 6.6, 0.2), mat(0xffd23a, { m: 0.4, r: 0.5 }), -6 + i * 1.5, 3.5, -4.25, T);
for (const x of [-5.5, -2.8, 2.8, 5.5]) { mesh(new THREE.CylinderGeometry(0.35, 0.4, 5.5, 10), mat(0xf3e2b8), x, 2.75, -2.6, T); mesh(new THREE.BoxGeometry(1, 0.3, 1), mat(0xffd23a, { m: 0.5 }), x, 5.6, -2.6, T); }
for (let i = 0; i < 26; i++) mesh(new THREE.SphereGeometry(0.13, 6, 4), mat(i % 2 ? 0xf6a531 : 0xffd23a), -5.5 + i * 0.44, 5.0 - Math.sin(i / 25 * Math.PI) * 0.9, -2.4, T);
// the clock: 12:00
const clock = new THREE.Group(); clock.position.set(0, 4.6, -4.2); T.add(clock);
mesh(new THREE.CylinderGeometry(1.0, 1.0, 0.16, 32).rotateX(Math.PI / 2), mat(0xfffbea), 0, 0, 0, clock); mesh(new THREE.TorusGeometry(1.0, 0.08, 6, 32), mat(0xffd23a, { m: 0.6 }), 0, 0, 0.05, clock);
for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; mesh(new THREE.BoxGeometry(0.06, i % 3 ? 0.12 : 0.22, 0.04), mat(0x1d1a24), Math.sin(a) * 0.82, Math.cos(a) * 0.82, 0.1, clock).rotation.z = -a; }
const hH = new THREE.Group(), hM = new THREE.Group(); hH.position.z = 0.12; hM.position.z = 0.14; clock.add(hH); clock.add(hM);
mesh(new THREE.BoxGeometry(0.09, 0.5, 0.03), mat(0x1d1a24), 0, 0.25, 0, hH); mesh(new THREE.BoxGeometry(0.06, 0.75, 0.03), mat(0x1d1a24), 0, 0.37, 0, hM);
// the cradle (jhula)
const swing = new THREE.Group(); swing.position.set(0, 2.6, -0.8); T.add(swing);
for (const x of [-1.2, 1.2]) mesh(new THREE.CylinderGeometry(0.08, 0.1, 2.7, 8), mat(0xffd23a, { m: 0.5, r: 0.4 }), x, 1.35, -0.8, T);
mesh(new THREE.CylinderGeometry(0.07, 0.07, 2.5, 8).rotateZ(Math.PI / 2), mat(0xffd23a, { m: 0.5, r: 0.4 }), 0, 2.65, -0.8, T);
for (const x of [-0.6, 0.6]) mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.4, 4), mat(0xd9b25a), x, -0.7, 0, swing);
const crib = mesh(new THREE.BoxGeometry(1.5, 0.45, 0.8), mat(0xd8263a), 0, -1.45, 0, swing); mesh(new THREE.BoxGeometry(1.6, 0.08, 0.9), mat(0xffd23a, { m: 0.5 }), 0, -1.2, 0, swing);
for (let i = 0; i < 9; i++) mesh(new THREE.SphereGeometry(0.08, 6, 4), mat(i % 2 ? 0xf6a531 : 0xffffff), -0.72 + i * 0.18, -1.15, 0.42, swing);
const babyAnchor = new THREE.Object3D(); babyAnchor.position.set(0, -1.25, 0.1); swing.add(babyAnchor);
const tLamps = [[-4.2, 1.2], [-2.0, 2.6], [2.0, 2.6], [4.2, 1.2], [-6, -1.5], [6, -1.5]].map(([x, z]) => lamp(T, x, 0, z, 1.2));
const conch = new THREE.Group(); T.add(conch); mesh(new THREE.ConeGeometry(0.16, 0.5, 8).rotateZ(Math.PI / 2), mat(0xfffbea), 0, 0, 0, conch); mesh(new THREE.TorusGeometry(0.11, 0.05, 6, 10), mat(0xf5d6c0), -0.18, 0, 0, conch);
// ---------------- the Yamuna in flood (x = 80)
const RV = V(80, 0, 0);
const waterG = new THREE.PlaneGeometry(60, 40, 48, 32); waterG.rotateX(-Math.PI / 2);
const water = mesh(waterG, new THREE.MeshStandardMaterial({ color: 0x2a5aa8, flatShading: true, roughness: 0.3, metalness: 0.1 }), RV.x, 0, RV.z - 4, scene); water.castShadow = false; water.userData.noOutline = true;
const wbase = Float32Array.from(waterG.attributes.position.array);
for (const [x, z] of [[-9, 9], [9, 10], [-12, -14], [12, -15]]) roundTree(scene, RV.x + x, RV.z + z, R, 1.2);
const basket = new THREE.Group(); scene.add(basket); mesh(new THREE.CylinderGeometry(0.42, 0.3, 0.3, 12, 1, true), mat(0xb8823a), 0, 0, 0, basket).material.side = THREE.DoubleSide; mesh(new THREE.TorusGeometry(0.42, 0.04, 5, 14).rotateX(Math.PI / 2), mat(0x8a5a2a), 0, 0.15, 0, basket);
const serpent = new THREE.Group(); scene.add(serpent);
const sCurve = new THREE.CatmullRomCurve3([V(1.5, -1.5, -1.2), V(0.6, 0.2, -1.6), V(-0.3, 1.6, -1.3), V(0.1, 3.0, -0.9), V(0.0, 3.8, -0.4)]);
const sMat = mat(0x2f8a5a, { r: 0.5 }), sBelly = mat(0xe8d38a);
mesh(new THREE.TubeGeometry(sCurve, 40, 0.42, 10), sMat, 0, 0, 0, serpent);
const hoods = new THREE.Group(); hoods.position.set(0, 3.9, -0.3); serpent.add(hoods);
for (let i = 0; i < 5; i++) { const a = (i - 2) * 0.42, h = new THREE.Group(); h.rotation.z = -a; hoods.add(h); const hd = mesh(new THREE.SphereGeometry(0.55, 12, 8).scale(0.75, 1.1, 0.32), sMat, 0, 0.75, 0, h); mesh(new THREE.SphereGeometry(0.34, 10, 6).scale(0.7, 1.0, 0.3), sBelly, 0, 0.7, 0.12, h); for (const ex of [-0.12, 0.12]) mesh(new THREE.SphereGeometry(0.05, 6, 4), mat(0xffd23a, { e: 0xffaa00, ei: 0.6 }), ex, 1.05, 0.17, h); }
// rain (instanced), lightning
const RAIN = 900, rain = new THREE.InstancedMesh(new THREE.BoxGeometry(0.02, 0.45, 0.02), new THREE.MeshBasicMaterial({ color: 0xbcd4ff, transparent: true, opacity: 0.55 }), RAIN); rain.userData.noOutline = true; scene.add(rain);
const rainBase = Array.from({ length: RAIN }, () => [R() * 24 - 12, R() * 14, R() * 18 - 9, R()]);
const bolt = new THREE.Line(new THREE.BufferGeometry().setFromPoints([V(0, 14, 0), V(0.8, 10, 0), V(-0.4, 7, 0), V(0.6, 4, 0), V(0, 0, 0)]), new THREE.LineBasicMaterial({ color: 0xffffff })); scene.add(bolt);
const FLASH = [E.then + 0.6, E.storm, E.river + 0.6, E.rises, E.king + 0.4, E.his + 0.5];
const flashAt = (t) => FLASH.reduce((a, t0) => a + (t >= t0 && t < t0 + 0.5 ? Math.exp(-(t - t0) * 9) * (1 + 0.6 * Math.sin((t - t0) * 60)) : 0), 0);

// ---------------- the cast
const C = makeCast(scene, [['kamsa', 'kamsa'], ['devaki', 'devaki'], ['vasudeva', 'vasudeva'], ['baby', 'baby'], ['g1', 'guard'], ['g2', 'guard'], ['g3', 'guard'], ['priest', 'priest'], ['babyIdol', 'baby'], ...Array.from({ length: 12 }, (_, i) => ['d' + i, ['gopi1', 'crowd', 'gopi2', 'devotee', 'gopi3', 'courtier'][i % 6]])]);
addOutlines(scene);
const confetti = makeConfetti(scene, 130, 21);
const petals = burst(scene, 40, new THREE.CircleGeometry(0.07, 5), new THREE.MeshBasicMaterial({ color: 0xf6a531, side: THREE.DoubleSide }), R, 3, 2.5);
const DEV = [[-4.2, 3.2], [-3.0, 4.0], [-1.6, 3.5], [1.6, 3.5], [3.0, 4.0], [4.2, 3.2], [-5.2, 1.6], [5.2, 1.6], [-3.6, 2.2], [3.6, 2.2], [-2.3, 5.0], [2.3, 5.0]];

function update(s, t) {
  // ---- temple: clock to 12, cradle rocking, devotees, priest and conch
  const tc = clamp((s < 20 ? s : s - E.thats + 4.5) / 4.6);
  hM.rotation.z = -(1 - sm(tc)) * 0.9; hH.rotation.z = -(1 - sm(tc)) * 0.08;
  const rockOn = s >= E.rock || s >= E.cradle2 - 0.4; swing.rotation.x = Math.sin(t * 2.4) * (rockOn ? 0.22 : 0.04);
  swing.updateMatrixWorld(true); const bp = babyAnchor.getWorldPosition(V(0, 0, 0));
  pose(C.babyIdol, camera, { x: bp.x, y: bp.y, z: bp.z, h: 0.7, sitting: true, mood: 'happy' });
  const cheer = s >= E.everyone - 0.2 || (s < 10 && s >= E.rock);
  DEV.forEach(([x, z], i) => pose(C['d' + i], camera, { x: 40 + x, z, flip: x > 0, mood: cheer ? 'happy' : 'closed', arm: cheer && i % 2 ? 'up' : 'down', y: cheer ? Math.abs(Math.sin(t * 5 + i)) * 0.12 : 0 }));
  pose(C.priest, camera, { x: 41.9, z: 1.0, mood: s >= E.conch && s < E.conch + 1.2 ? 'closed' : 'happy', arm: s >= E.conch - 0.2 && s < E.conch + 1.4 ? 'wave' : 'down' });
  conch.visible = s >= E.conch - 0.2 && s < E.conch + 1.4; conch.position.set(1.45, 1.55, 1.15);
  tLamps.forEach((l, i) => { l.flame.scale.y = 1 + 0.15 * Math.sin(t * 13 + i); l.light.intensity = 5 + Math.sin(t * 11 + i) * 0.6; });
  petals.set(E.everyone - 0.1, s, V(40, 4.8, 1.2)); confetti(E.everyone - 0.1, s, V(40, 3.6, 0));
  // ---- Mathura: Kamsa on the steps, then on his throne
  pose(C.kamsa, camera, { x: -40, y: s >= E.and2 - 0.2 ? 0.5 : 0, z: s >= E.and2 - 0.2 ? -2.6 : 0.5, mood: s < E.king + 0.6 ? 'smug' : s < E.so ? 'wow' : 'smug', arm: s >= E.and2 - 0.2 ? 'hips' : s < E.king + 0.6 ? 'hips' : 'down', h: 1.8 });
  // ---- prison
  const shut = sm(seg(s, E.so + 1.6, E.so + 2.4)), open = sm(seg(s, E.and4, E.and4 + 1.4));
  const ang = s < E.and4 ? (1 - shut) * 1.2 : open * 1.35; doorL.rotation.y = -ang; doorR.rotation.y = ang;
  doorway.material.color.set(new THREE.Color(0x8aa8ff).lerp(new THREE.Color(0xd8e4ff), flashAt(t) * 0.5));
  const inPrison = s >= E.so && s < E.vasudeva2;
  pose(C.devaki, camera, { visible: s >= E.so, x: s < E.so + 1.4 ? lerp(-1.6, -0.75, seg(s, E.so, E.so + 1.4)) : -0.75, z: s < E.so + 1.4 ? lerp(-2.6, 0.9, seg(s, E.so, E.so + 1.4)) : 0.9, step: s < E.so + 1.4 ? s * 3 : 0, mood: s >= E.born - 0.2 ? 'happy' : s >= E.then ? 'closed' : 'sad', arm: s >= E.born - 0.2 && s < E.vasudeva2 ? 'offer' : 'down' });
  const vasOut = s >= E.vasudeva2;
  pose(C.vasudeva, camera, inPrison ? { x: s < E.so + 1.4 ? lerp(-0.6, 0.85, seg(s, E.so, E.so + 1.4)) : 0.85, z: s < E.so + 1.4 ? lerp(-2.8, 0.9, seg(s, E.so, E.so + 1.4)) : 0.9, step: s < E.so + 1.4 ? s * 3 : 0, mood: s >= E.wait && s < E.chains2 ? 'wow' : s >= E.born - 0.2 ? 'happy' : 'sad', arm: s >= E.chains2 + 0.3 ? 'up' : 'down' } : { visible: false });
  const linksFall = seg(s, E.chains2 + 0.2, E.chains2 + 0.9);
  links.forEach((o) => { o.visible = s >= E.iron - 0.5 && s < E.vasudeva2; const u = o.userData; const k = clamp(linksFall * 1.6 - u.i * 0.06); o.position.copy(u.home); o.position.y = lerp(u.home.y, 0.12, k * k); o.rotation.set(u.rot + k * 3, k * 2, 0); });
  const asleep = s >= E.guards2 + 0.2;
  [['g1', -2.7, -2.7], ['g2', 2.6, -2.7], ['g3', 2.9, 1.5]].forEach(([g, x, z], i) => pose(C[g], camera, { visible: s >= E.so, x, z, y: asleep ? -0.35 : 0, sitting: asleep, mood: asleep ? 'closed' : 'normal', flip: x > 0 }));
  const glow = s >= E.born - 0.3 && s < E.vasudeva2 ? sm(seg(s, E.born - 0.3, E.born + 0.6)) : 0;
  halo.intensity = glow * 9; haloBall.material.opacity = glow * 0.22 * (0.8 + 0.2 * Math.sin(t * 3));
  // ---- the river: Vasudeva wades in, the basket on his head; the serpent rises and spreads its hoods
  const wk = seg(s, E.vasudeva2, E.river + 1.5), depth = sm(seg(s, E.storm - 0.4, E.river + 0.9));
  const vx = RV.x + lerp(-3.2, 0.6, wk), vz = lerp(5.5, 1.2, wk), vy = -depth * 0.25;
  pose(C.baby, camera, s >= E.born - 0.3 ? (vasOut ? { x: vx, y: vy + 1.5, z: vz + 0.06, h: 0.55, sitting: true, mood: 'happy' } : { x: -0.74, y: 0.78, z: 1.05, h: 0.6, sitting: true, mood: s >= E.tiny ? 'wink' : 'happy' }) : { visible: false });
  if (vasOut) pose(C.vasudeva, camera, { x: vx, y: vy, z: vz, step: wk < 1 ? s * 2.4 : 0, mood: s >= E.spreads ? 'happy' : 'normal', arm: 'up' });
  basket.visible = vasOut; basket.position.set(vx, vy + 1.5, vz + 0.02);
  const sr = sm(seg(s, E.rises - 0.2, E.rises + 1.3)), sp = sm(seg(s, E.spreads, E.spreads + 1.0));
  serpent.visible = s >= E.rises - 0.3; serpent.position.set(vx, lerp(-6, vy, sr), vz); hoods.scale.set(lerp(0.35, 1, sp), lerp(0.6, 1, sp), 1); hoods.rotation.x = lerp(0, 0.55, sp);
  const wp = waterG.attributes.position; for (let i = 0; i < wp.count; i++) { const x = wbase[i * 3], z = wbase[i * 3 + 2]; wp.setY(i, (0.1 + 0.3 * depth) + Math.sin(x * 0.7 + t * 2.2) * 0.18 + Math.cos(z * 0.9 - t * 1.7) * 0.14); } wp.needsUpdate = true; waterG.computeVertexNormals();
  // ---- rain around whichever outdoor set the camera is at; none under the hoods
  const cx = camera.position.x, near = Math.abs(cx - 80) < 20 ? 80 : Math.abs(cx + 40) < 20 ? -40 : null;
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0.15)), sc = V(1, 1, 1);
  for (let i = 0; i < RAIN; i++) { const [x, y0, z, ph] = rainBase[i]; const y = ((y0 - t * 13 - ph * 14) % 14 + 14) % 14; const px = (near ?? 9999) + x + (near === 80 ? 0 : 0), pz = z + (near === 80 ? 1 : 2); const shield = near === 80 && sp > 0.5 && Math.hypot(px - vx, pz - vz) < 1.3 && y < 4.2 + vy; m4.compose(V(px, y, pz), q, shield ? V(0, 0, 0) : sc); rain.setMatrixAt(i, m4); }
  rain.instanceMatrix.needsUpdate = true; rain.visible = near !== null;
  const fl = flashAt(t); bolt.visible = fl > 0.45; bolt.position.set((near ?? 0) + 6, 0, -14);
  // ---- light: day-ish temple warmth, a purple dusk at Mathura, night in the prison and storm; lightning flashes
  const set = cx > 60 ? 'river' : cx > 20 ? 'temple' : cx < -20 ? 'mathura' : 'prison';
  S.mood({ temple: 0.62, mathura: 0.55, prison: 0.78, river: 0.82 }[set]);
  S.hemi.intensity += fl * 1.6 + (set === 'temple' ? 0.25 : 0); S.sun.intensity += fl * 2;
  torchL.flame.scale.y = torchR.flame.scale.y = 1 + 0.2 * Math.sin(t * 14); winGlow.material.color.set(new THREE.Color(0x3a4a8a).lerp(new THREE.Color(0xeaf0ff), Math.min(1, fl)));
  S.clouds.forEach((c, i) => { c.position.x = -80 + i * 15 + ((t * 0.6 + i * 3) % 12); });
}

const G = (t) => t;
const SHOTS = [
  [0, 4.0, G, [[40, 2.4, 11.5], [40, 2.6, -1.0]], [[40, 2.3, 9.8], [40, 2.6, -1.2]]],
  [4.0, E.why - 0.05, G, [[40.2, 3.0, 4.6], [40, 2.6, -2.0]], [[40.15, 2.8, 4.0], [40, 2.3, -1.2]]],
  [E.why - 0.05, E.because - 0.05, (t) => t, [[40, 4.6, 0.6], [40, 4.6, -4.2]], [[40, 4.6, 0.2], [40, 4.6, -4.2]]],
  [E.because - 0.05, E.mathura - 0.05, (t) => E.iron + 0.3, [[2.2, 1.6, 2.6], [1.6, 1.3, -4.0]], [[2.0, 1.6, 2.2], [1.6, 1.3, -4.0]]],
  [E.mathura - 0.05, E.king - 0.05, G, [[-40, 6, 17], [-40, 3, -6]], [[-40, 5.4, 14.5], [-40, 3, -6]]],
  [E.king - 0.05, E.his - 0.05, G, [[-39.6, 1.5, 3.2], [-40, 1.4, 0.5]], [[-39.65, 1.5, 2.9], [-40, 1.4, 0.5]]],
  [E.his - 0.05, E.so - 0.05, G, [[-39.5, 1.2, 2.5], [-40, 1.5, 0.5]], [[-39.55, 1.2, 2.2], [-40, 1.5, 0.5]]],
  [E.so - 0.05, E.iron - 0.05, G, [[0.4, 3.0, 8.5], [-0.6, 1.4, -1.5]], [[0.3, 2.8, 7.6], [-0.4, 1.3, -1.0]]],
  [E.iron - 0.05, E.guards - 0.05, G, [[0.2, 1.2, 2.6], [-0.4, 1.05, 0.4]], [[0.15, 1.2, 2.3], [-0.4, 1.05, 0.4]]],
  [E.guards - 0.05, E.and2 - 0.05, G, [[0, 2.0, 7.2], [0, 1.3, -2.5]], [[0.5, 2.0, 6.5], [0.5, 1.3, -2.5]]],
  [E.and2 - 0.05, E.then - 0.05, G, [[-40, 1.8, 2.2], [-40, 1.6, -2.6]], [[-40, 1.8, 1.8], [-40, 1.6, -2.6]]],
  [E.then - 0.05, E.born - 0.4, G, [[2.0, 2.6, 1.0], [3.2, 3.3, -4.2]], [[1.4, 2.4, 1.6], [2.0, 2.4, -2.0]]],
  [E.born - 0.4, E.tiny - 0.05, G, [[-0.2, 1.5, 4.4], [-0.3, 1.1, 0.9]], [[-0.25, 1.45, 3.8], [-0.3, 1.1, 0.9]]],
  [E.tiny - 0.05, E.wait - 0.05, G, [[-0.68, 1.12, 2.15], [-0.74, 1.05, 1.05]], [[-0.68, 1.1, 1.9], [-0.74, 1.05, 1.05]]],
  [E.wait - 0.05, E.chains2 - 0.05, G, [[1.1, 1.55, 3.4], [0.85, 1.45, 0.9]], [[1.1, 1.55, 3.15], [0.85, 1.45, 0.9]]],
  [E.chains2 - 0.05, E.guards2 - 0.05, G, [[1.6, 1.0, 2.3], [0.6, 0.6, -0.5]], [[1.5, 1.0, 2.0], [0.6, 0.6, -0.5]]],
  [E.guards2 - 0.05, E.and4 - 0.05, G, [[3.6, 1.6, 5.2], [4.0, 0.9, -0.5]], [[3.4, 1.5, 4.6], [4.0, 0.9, -0.5]]],
  [E.and4 - 0.05, E.vasudeva2 - 0.05, G, [[-3.6, 2.0, 4.6], [-1.5, 1.8, -4.2]], [[-3.2, 1.9, 3.4], [-1.5, 1.8, -4.2]]],
  [E.vasudeva2 - 0.05, E.river - 0.05, G, [[74.5, 2.4, 10], [78, 1.4, 4]], [[75.5, 2.2, 8.8], [79.5, 1.2, 2.5]]],
  [E.river - 0.05, E.then2 - 0.05, G, [[80.5, 3.4, 9.5], [80.5, 1.0, 1.0]], [[80.6, 3.0, 8.4], [80.6, 1.0, 1.0]]],
  [E.then2 - 0.05, E.spreads - 0.05, G, [[83.2, 1.2, 8.2], [80.6, 2.4, 0.6]], [[82.8, 1.3, 7.4], [80.6, 2.8, 0.6]]],
  [E.spreads - 0.05, E.thats - 0.05, G, [[81.4, 2.2, 5.6], [80.6, 2.5, 0.9]], [[81.3, 2.2, 5.0], [80.6, 2.5, 0.9]]],
  [E.thats - 0.05, E.conch - 0.05, G, [[40, 3.0, 11.5], [40, 2.8, -1.5]], [[40, 2.8, 9.8], [40, 2.8, -1.5]]],
  [E.conch - 0.05, E.cradle2 - 0.1, G, [[41.5, 1.7, 3.4], [41.9, 1.5, 1.0]], [[41.55, 1.7, 3.15], [41.9, 1.5, 1.0]]],
  [E.cradle2 - 0.1, E.everyone - 0.05, G, [[40.3, 2.2, 2.5], [40, 1.4, -0.7]], [[40.25, 2.1, 2.2], [40, 1.4, -0.7]]],
  [E.everyone - 0.05, E.comment - 0.05, G, [[40, 2.0, 9.5], [40, 2.2, -0.5]], [[40, 2.1, 8.5], [40, 2.3, -0.5]]],
  [E.comment - 0.05, DURATION + 0.1, G, [[40, 2.6, 11], [40, 2.6, -1.2]], [[40, 2.5, 10], [40, 2.6, -1.2]]],
];
direct({ stage, WORDS, DURATION, shots: SHOTS, update, title: E.why - 0.05, q: [E.wait, E.chains2], cta: E.comment,
  key: ['janmashtami', 'midnight', 'cradle', 'prison', 'mathura', 'kamsa', 'prophecy', 'eighth', 'devaki', 'vasudeva', 'chains', 'guards', 'stormy', 'born', 'krishna', 'baby', 'escape', 'asleep', 'open', 'basket', 'storm', 'yamuna', 'flooding', 'serpent', 'umbrella', 'today', 'conch', 'here', 'comment', 'wait', 'why', 'blue', 'tiny', 'smiling', 'hoods', 'doors'],
  loc: (t) => (t >= E.mathura && t < E.king ? '📍 MATHURA · LONG AGO' : t >= E.vasudeva2 && t < E.river ? '📍 THE YAMUNA' : t >= E.thats && t < E.conch ? 'EVEN TODAY · 12:00 AM' : ''),
  shakes: [E.born - 0.3, E.rises + 0.6], tick: () => {} });
