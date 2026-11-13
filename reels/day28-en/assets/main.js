// Day 28 · "Why does Krishna dance on a snake?" · Why we do what we do #10 (as the story goes: Kaliya, the poisoned Yamuna)
// One set: the Yamuna at Vrindavan (water at z < 1.5), a sandy bank with the kadamba tree, friends, birds, fish.
import * as THREE from './three.module.js';
import { rng, mat, mesh, sm, seg, lerp, clamp, setupScene, makeCast, pose, palm } from './kit.js';
import { makeStage, direct, wordTime } from './director.js';
import { addOutlines, makeConfetti } from './plus.js';
import { WORDS, DURATION } from './data.js';

const stage = makeStage(), { scene, camera } = stage, V = (x, y, z) => new THREE.Vector3(x, y, z), R = rng(28);
const S = setupScene(scene, [[0, 2]], 28);
const WT = wordTime(WORDS);
const E = { as: WT('as'), a: WT('serpent') - 0.1, poisoned: WT('poisoned'), the2: WT('water') - 0.18, fish: WT('fish'), birds: WT('birds'), even: WT('even'), little: WT('little'), and: WT('and'),
  his: WT('his'), kaliya2: WT('kaliya', 2), then: WT('then'), slipped: WT('slipped'), leapt: WT('leapt'), and3: WT('danced') - 0.32, with: WT('with'), wait: WT('wait'), no: WT('no'),
  wives: WT('wives') - 0.5, and6: WT('let') - 0.58, thats: WT("that's"), not: WT('not'), to2: WT('clean') - 0.29, and8: WT('forgive') - 0.48, comment: WT('comment') };
const glow = (c, o = 0.5) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, depthWrite: false, blending: THREE.AdditiveBlending });
const noOut = (m) => { m.userData.noOutline = true; m.castShadow = false; return m; };

// ---------------- the river and its bank
const WATER = noOut(mesh(new THREE.PlaneGeometry(46, 16, 46, 16).rotateX(-Math.PI / 2), mat(0x3f9fd8, { r: 0.25 }), 0, 0.24, -6.5, scene)); const wbase = WATER.geometry.attributes.position.array.slice();
mesh(new THREE.BoxGeometry(46, 0.12, 5), mat(0xe8cf98), 0, 0.06, 4.0, scene).castShadow = false;
// trees on the bank (their leaves dry up), palms behind
const leafMats = [];
function bankTree(x, z, k) { mesh(new THREE.CylinderGeometry(0.25 * k, 0.35 * k, 2 * k, 6), mat(0x8a5a2a), x, k, z, scene); for (let i = 0; i < 4; i++) { const m = mat([0x4fb83a, 0x5ccf45, 0x3fa83a, 0x6ad04a][i]); leafMats.push(m); mesh(new THREE.IcosahedronGeometry((1.3 + R() * 0.4) * k, 0), m, x + (R() - 0.5) * 1.4 * k, (2.7 + i * 0.45) * k, z + (R() - 0.5) * 1.0 * k, scene); } }
bankTree(4.2, 4.4, 1.0); bankTree(6.6, 5.2, 1.2); bankTree(8.8, 4.6, 0.9); bankTree(-8.5, 5.0, 1.1);
for (let i = 0; i < 6; i++) palm(scene, -14 + i * 5.5, 9 + R() * 2, R);
// the kadamba tree, its branch out over the water, birds on it
const kad = new THREE.Group(); kad.position.set(-3.8, 0, 3.4); scene.add(kad);
mesh(new THREE.CylinderGeometry(0.3, 0.42, 3.2, 7), mat(0x7a4a22), 0, 1.6, 0, kad);
const br = mesh(new THREE.CylinderGeometry(0.12, 0.18, 3.0, 6), mat(0x7a4a22), 0.9, 2.6, -1.1, kad); br.rotation.set(-0.9, 0, -0.6);
for (let i = 0; i < 5; i++) { const m = mat([0x3f9a3a, 0x4fb83a, 0x2f8f3a][i % 3]); leafMats.push(m); mesh(new THREE.IcosahedronGeometry(1.2 + R() * 0.3, 0), m, (R() - 0.5) * 1.8, 3.6 + R() * 0.8, (R() - 0.5) * 1.2, kad); }
for (let i = 0; i < 8; i++) mesh(new THREE.SphereGeometry(0.12, 8, 6), mat(0xffb02a), (R() - 0.5) * 2, 3.2 + R(), 0.9 + R() * 0.3, kad);
const birds = []; for (let i = 0; i < 4; i++) { const b = new THREE.Group(); b.position.set(-2.4 + i * 0.42, 2.9 - i * 0.18, 2.3 - i * 0.32); scene.add(b); const c = [0xff8a1e, 0x5ad8ff, 0xffd23a, 0xe8462c][i]; mesh(new THREE.SphereGeometry(0.14, 8, 6).scale(1, 0.9, 1.2), mat(c), 0, 0, 0, b); mesh(new THREE.SphereGeometry(0.09, 8, 6), mat(c), 0, 0.14, 0.07, b); mesh(new THREE.ConeGeometry(0.025, 0.07, 4).rotateX(Math.PI / 2), mat(0xffd23a), 0, 0.13, 0.17, b); birds.push(b); }
const bnotes = []; for (let i = 0; i < 6; i++) { const n = new THREE.Group(); scene.add(n); const m = glow(0xffffff, 0.9); noOut(mesh(new THREE.SphereGeometry(0.05, 8, 6).scale(1.2, 0.9, 0.5), m, 0, 0, 0, n)); noOut(mesh(new THREE.BoxGeometry(0.012, 0.16, 0.012), m, 0.05, 0.08, 0, n)); bnotes.push(n); }
// fish: they float belly-up in the poison, and swim again when the river is clean
const fish = []; for (let i = 0; i < 9; i++) { const f = new THREE.Group(); scene.add(f); const c = [0xff8a1e, 0xffd23a, 0xe8462c][i % 3]; mesh(new THREE.SphereGeometry(0.16, 10, 6).scale(1.5, 0.8, 0.5), mat(c), 0, 0, 0, f); mesh(new THREE.ConeGeometry(0.11, 0.18, 4).rotateZ(Math.PI / 2), mat(c), -0.3, 0, 0, f); mesh(new THREE.SphereGeometry(0.03, 6, 4), mat(0x1d1a24), 0.15, 0.04, 0.07, f); fish.push({ f, x: 0.4 + (i % 3) * 0.75 + R() * 0.3, z: -0.2 - Math.floor(i / 3) * 0.7 + R() * 0.2, ph: R() * 6 }); }
// ---------------- Kaliya: a dark serpent with five hoods (and a marker on top where Krishna dances)
const serp = new THREE.Group(); serp.scale.setScalar(0.62); scene.add(serp);
const sMat = mat(0x3a2a5a, { r: 0.5 }), sBelly = mat(0xb8c86a);
mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([V(1.5, -1.5, -1.2), V(0.6, 0.2, -1.6), V(-0.3, 1.6, -1.3), V(0.1, 3.0, -0.9), V(0.0, 3.8, -0.4)]), 40, 0.42, 10), sMat, 0, 0, 0, serp);
for (let i = 0; i < 3; i++) mesh(new THREE.TorusGeometry(1.2 + i * 0.3, 0.32, 8, 20, Math.PI * 1.2).rotateX(Math.PI / 2), sMat, (i - 1) * 1.6, -0.1, -1.2 - i * 0.9, serp);
const hoods = new THREE.Group(); hoods.position.set(0, 3.9, -0.3); serp.add(hoods);
const hoodG = [], eyeMats = [];
for (let i = 0; i < 5; i++) { const a = (i - 2) * 0.42, h = new THREE.Group(); h.rotation.z = -a; hoods.add(h); const b = new THREE.Group(); h.add(b); mesh(new THREE.SphereGeometry(0.55, 12, 8).scale(0.75, 1.1, 0.32), sMat, 0, 0.75, 0, b); mesh(new THREE.SphereGeometry(0.34, 10, 6).scale(0.7, 1.0, 0.3), sBelly, 0, 0.7, 0.12, b); for (const ex of [-0.12, 0.12]) { const em = new THREE.MeshBasicMaterial({ color: 0xff3a3a }); eyeMats.push(em); mesh(new THREE.SphereGeometry(0.06, 6, 4), em, ex, 1.05, 0.17, b); } hoodG.push(b); }
const top = new THREE.Object3D(); top.position.set(0, 0.3, 0.3); hoodG[2].add(top);
// the coils that wrap around Krishna in the water
const helix = []; for (let i = 0; i <= 60; i++) { const u = i / 60, a = u * Math.PI * 2 * 3; helix.push(V(Math.cos(a) * 0.42, u * 1.2 - 0.1, Math.sin(a) * 0.42)); }
const coil = mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(helix), 120, 0.11, 8), sMat, 0, 0, 0, scene);
// Kaliya's wives: three smaller serpents
const wives = [0xd86aa0, 0xa07ad8, 0x3fae9a].map((c, i) => { const g = new THREE.Group(); g.scale.setScalar(0.55); scene.add(g); const m = mat(c, { r: 0.5 }); mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([V(0, -1, 0), V(0.2, 0.6, 0), V(0, 1.6, 0.2)]), 20, 0.25, 8), m, 0, 0, 0, g); const hd = new THREE.Group(); hd.position.set(0, 1.7, 0.2); g.add(hd); mesh(new THREE.SphereGeometry(0.5, 12, 8).scale(0.8, 1.0, 0.35), m, 0, 0.3, 0, hd); for (const ex of [-0.13, 0.13]) { mesh(new THREE.SphereGeometry(0.08, 6, 4), mat(0xffffff), ex, 0.45, 0.17, hd); } mesh(new THREE.BoxGeometry(0.36, 0.04, 0.04), mat(0x1d1a24), 0, 0.42, 0.21, hd); return { g, hd, pos: [V(-2.3, 0, -3.6), V(2.4, 0, -3.8), V(-0.6, 0, -4.9)][i] }; });
// splash and sparkles
const splash = noOut(mesh(new THREE.TorusGeometry(1, 0.06, 6, 24).rotateX(Math.PI / 2), glow(0xffffff, 0.9), 0, 0.12, 0, scene));
const sparkles = []; for (let i = 0; i < 40; i++) sparkles.push(noOut(mesh(new THREE.OctahedronGeometry(0.06, 0), glow(0x9fe8ff, 0.9), 0, 0, 0, scene)));
// ---------------- the cast
const C = makeCast(scene, [['k', 'kidKrishna'], ['f1', 'kid1'], ['f2', 'kid2'], ['f3', 'kid4'], ['f4', 'govinda']]);
addOutlines(scene);
const confetti = makeConfetti(scene, 60, 28);
const KW = V(0.7, -0.45, -1.0); // where Krishna fights in the water

function update(s, t) {
  S.mood(0); S.hemi.intensity = 1.4;
  // the river: blue -> black with poison -> blue again, clean
  const poison = sm(seg(s, E.poisoned, E.the2 + 0.6)) * (1 - sm(seg(s, E.to2, E.to2 + 1.4)));
  WATER.material.color.set(new THREE.Color(0x3f9fd8).lerp(new THREE.Color(0x1c1630), poison));
  const wp = WATER.geometry.attributes.position; for (let i = 0; i < wp.count; i++) wp.setY(i, Math.sin(wbase[i * 3] * 0.8 + t * 1.6) * 0.035 + Math.cos(wbase[i * 3 + 2] * 0.9 - t * 1.2) * 0.03); wp.needsUpdate = true;
  // dry trees, silent birds, floating fish; all come back when the river is clean
  const dry = sm(seg(s, E.even, E.even + 1.2)) * (1 - sm(seg(s, E.to2 + 0.4, E.to2 + 1.6)));
  leafMats.forEach((m, i) => m.color.set(new THREE.Color([0x4fb83a, 0x5ccf45, 0x3fa83a, 0x6ad04a][i % 4]).lerp(new THREE.Color(0xa88a4a), dry * 0.85)));
  const silent = s >= E.birds && s < E.to2 + 0.8;
  birds.forEach((b, i) => { b.rotation.x = silent ? 0.5 : 0; b.position.y = 2.9 - i * 0.18 + (silent ? 0 : Math.abs(Math.sin(t * 7 + i)) * 0.05); b.rotation.y = silent ? 0 : Math.sin(t * 5 + i) * 0.4; });
  bnotes.forEach((n, i) => { const ph = (t * 0.6 + i / 6) % 1; n.visible = !silent; n.position.set(-2.4 + (i % 4) * 0.42 + ph * 0.4, 3.1 + ph * 1.0 - (i % 4) * 0.18, 2.3 - (i % 4) * 0.32); n.scale.setScalar(Math.sin(ph * Math.PI)); n.quaternion.copy(camera.quaternion); });
  const dead = s >= E.fish && s < E.to2 + 0.6;
  fish.forEach(({ f, x, z, ph }, i) => { if (dead) { f.visible = true; f.position.set(x + Math.sin(t * 0.5 + ph) * 0.1, 0.3, z); f.rotation.set(Math.PI, ph, 0.2); } else { const jump = Math.max(0, Math.sin(t * 2.2 + ph)); f.visible = s >= E.to2; f.position.set(x + Math.sin(t + ph) * 0.4, 0.15 + jump * 0.5, z); f.rotation.set(0, ph + t * 0.6, Math.cos(t * 2.2 + ph) * 0.8); } });
  // Kaliya rises, poisons, coils, carries the dance, and leaves for the ocean
  const rise = sm(seg(s, E.a - 0.1, E.poisoned + 0.2)), leave = sm(seg(s, E.and6 + 0.4, E.thats - 0.2));
  serp.visible = s >= E.a - 0.2 && leave < 0.99;
  serp.position.set(lerp(0, -12, leave), lerp(-3.4, -0.25, rise) - leave * 1.2 + Math.sin(t * 1.4) * 0.05, lerp(-2.6, -10, leave)); serp.rotation.y = leave * 0.8;
  const dancing = s >= E.leapt + 0.6 && s < E.and6 + 0.4, calm = s >= E.no;
  hoods.rotation.x = dancing ? lerp(0, -0.95, sm(seg(s, E.leapt, E.leapt + 0.6))) : calm ? 0.25 : 0;
  hoodG.forEach((h, i) => { const stepI = Math.floor(s * 2.6) % 5; h.rotation.x = dancing && s >= E.with && stepI === i ? 0.45 * Math.sin(((s * 2.6) % 1) * Math.PI) : 0; });
  eyeMats.forEach((m) => m.color.set(calm ? 0xffe08a : 0xff3a3a));
  coil.visible = s >= E.kaliya2 - 0.1 && s < E.slipped + 0.25; const ck = sm(seg(s, E.kaliya2 - 0.1, E.kaliya2 + 0.8)), heavy = sm(seg(s, E.then, E.slipped));
  coil.position.copy(KW).add(V(0, 0.15, 0)); coil.scale.set(lerp(1.8, 1, ck) + heavy * 0.35, 1, lerp(1.8, 1, ck) + heavy * 0.35); coil.rotation.y = t * (s >= E.then ? 2.5 : 0.6);
  // Krishna: on the bank, up the kadamba, into the water, onto the hoods, back on the bank
  serp.updateMatrixWorld(true); const topW = top.getWorldPosition(V(0, 0, 0));
  let kp, kh = 1.3, kpose = { mood: 'happy' };
  if (s < WT('climbed') - 0.1) { kp = V(-2.6, 0.12, 3.9); kpose = { mood: s >= E.poisoned ? 'wow' : 'happy', arm: s >= E.fish && s < E.little ? 'point' : 'down' }; }
  else if (s < E.and) { const u = sm(seg(s, WT('climbed') - 0.1, E.and - 0.1)); kp = V(lerp(-3.3, -2.3, u), lerp(0.12, 2.25, u), lerp(3.2, 1.0, u)); kpose = { mood: 'normal', arm: 'up', step: s * 4 }; }
  else if (s < E.his) { const u = sm(seg(s, E.and + 0.2, E.his - 0.2)); kp = V(lerp(-2.3, KW.x, u), lerp(2.25, KW.y, u) + Math.sin(u * Math.PI) * 1.4, lerp(1.0, KW.z, u)); kpose = { mood: 'happy', arm: 'up' }; }
  else if (s < E.leapt) { kp = KW.clone(); kh = 1.3 + heavy * 0.35; kpose = { mood: s >= E.then ? 'smug' : 'wow' }; }
  else if (s < E.and6 + 0.4) { const u = sm(seg(s, E.leapt, E.leapt + 0.7)); kp = KW.clone().lerp(topW, u); kp.y += Math.sin(u * Math.PI) * 1.2; kpose = dancing ? { mood: s >= E.no ? 'happy' : 'closed', arm: Math.sin(s * 8) > 0 ? 'up' : 'wave', step: s * 2.6, flip: Math.sin(s * 2.6) > 0 } : { mood: 'happy', arm: 'up' }; if (dancing) kp.y += Math.abs(Math.sin(s * 8)) * 0.12; }
  else { kp = V(0.3, 0.12, 5.5); kpose = { mood: 'happy', arm: s >= E.and8 ? 'wave' : 'down' }; }
  pose(C.k, camera, { x: kp.x, y: kp.y, z: kp.z, h: kh, ...kpose });
  // friends on the bank
  const scream = s >= E.his - 0.3 && s < E.leapt, cheer = s >= E.and3 || s >= E.and6;
  [['f1', -1.2, 4.3], ['f2', -0.3, 4.6], ['f3', 0.8, 4.4], ['f4', 1.8, 4.9]].forEach(([n, x, z], i) => pose(C[n], camera, { x, y: 0.12, z, h: n === 'f4' ? 1.6 : 1.2, flip: x > 0,
    mood: scream ? 'wow' : s >= E.poisoned && s < E.and3 ? 'sad' : 'happy', arm: scream || (cheer && Math.sin(t * 6 + i) > 0) ? 'up' : 'down', y: cheer && !scream ? 0.12 + Math.abs(Math.sin(t * 6 + i)) * 0.08 : 0.12 }));
  // the wives rise and plead
  wives.forEach(({ g, hd, pos }, i) => { const r = sm(seg(s, E.wives - 0.2 + i * 0.15, E.wives + 0.5 + i * 0.15)) * (1 - leave); g.visible = r > 0.01; g.position.set(pos.x, lerp(-1.6, 0, r), pos.z); hd.rotation.x = s >= E.wives + 0.4 && s < E.and6 + 0.6 ? 0.35 + Math.sin(t * 4 + i) * 0.25 : 0; });
  // splash where he lands; sparkles as the river turns clean
  const su = s - (E.his - 0.2); splash.visible = su > 0 && su < 1.0; splash.position.set(KW.x, 0.3, KW.z); splash.scale.setScalar(0.3 + su * 2.2); splash.material.opacity = 0.9 * (1 - su);
  sparkles.forEach((m, i) => { const u = s - E.to2 - (i % 10) * 0.1; m.visible = u > 0 && u < 2.0; const a = i * 2.4; m.position.set(Math.cos(a) * (1 + (i % 6) * 1.2), 0.2 + u * (0.5 + (i % 3) * 0.3), -2 + Math.sin(a) * 1.5); m.rotation.y = t * 4; });
  confetti(E.and8, s, V(0.4, 2.8, 3.6));
  S.clouds.forEach((c, i) => { c.position.x = -80 + i * 15 + ((t * 0.6 + i * 3) % 12); });
}

const G = (t) => t, DANCE = (t) => E.with + 0.4 + t * 0.4, DANCE2 = (t) => E.with + 0.8 + (t - E.thats) * 0.4;
const SHOTS = [
  [0, E.as - 0.05, DANCE, [[1.4, 3.0, 3.8], [0, 2.5, -2.4]], [[0.8, 3.0, 3.4], [0, 2.5, -2.4]]],
  [E.as - 0.05, E.a - 0.05, G, [[0, 6, 14], [0, 0.6, -2]], [[0, 4.5, 12], [0, 0.6, -2]]],
  [E.a - 0.05, E.the2 - 0.05, G, [[-0.4, 2.6, 9.6], [0, 1.8, -2.6]], [[-0.3, 2.5, 8.8], [0, 2.0, -2.6]]],
  [E.the2 - 0.05, E.fish - 0.05, G, [[-1.5, 0.8, 4.0], [0, 0.2, -3]], [[-1.0, 0.75, 3.6], [0.5, 0.2, -3]]],
  [E.fish - 0.05, E.birds - 0.05, G, [[1.6, 1.3, 1.9], [1.2, 0.1, -0.6]], [[1.5, 1.2, 1.7], [1.2, 0.1, -0.6]]],
  [E.birds - 0.05, E.even - 0.05, G, [[-1.6, 3.0, 4.6], [-1.9, 2.6, 1.9]], [[-1.65, 3.0, 4.35], [-1.9, 2.6, 1.9]]],
  [E.even - 0.05, E.little - 0.05, G, [[3.0, 2.2, 10.5], [6.0, 2.4, 4.6]], [[3.4, 2.2, 10.0], [6.2, 2.4, 4.6]]],
  [E.little - 0.05, E.and - 0.05, G, [[-0.4, 2.0, 7.4], [-2.8, 1.6, 2.2]], [[-0.6, 2.2, 6.8], [-2.6, 2.0, 1.6]]],
  [E.and - 0.05, E.his - 0.05, G, [[2.2, 2.4, 8.4], [-0.6, 1.2, -0.3]], [[2.0, 2.3, 7.8], [-0.2, 1.0, -0.5]]],
  [E.his - 0.05, E.kaliya2 - 0.05, G, [[-0.2, 1.3, 7.2], [0.2, 1.0, 4.4]], [[-0.2, 1.3, 6.8], [0.2, 1.0, 4.4]]],
  [E.kaliya2 - 0.05, E.then - 0.05, G, [[1.5, 1.2, 1.8], [0.7, 0.4, -1.0]], [[1.4, 1.15, 1.6], [0.7, 0.4, -1.0]]],
  [E.then - 0.05, E.slipped - 0.05, G, [[1.9, 1.4, 2.4], [0.7, 0.5, -1.0]], [[1.7, 1.3, 2.0], [0.7, 0.5, -1.0]]],
  [E.slipped - 0.05, E.and3 - 0.05, G, [[1.8, 2.6, 8.4], [0.2, 1.6, -2.2]], [[1.6, 2.6, 7.8], [0.2, 2.0, -2.2]]],
  [E.and3 - 0.05, E.wait - 0.05, G, [[1.4, 3.0, 3.8], [0, 2.5, -2.4]], [[-1.2, 3.0, 3.7], [0, 2.5, -2.4]]],
  [E.wait - 0.05, E.no - 0.05, G, [[1.9, 2.7, 1.2], [0, 2.2, -2.6]], [[1.8, 2.7, 1.0], [0, 2.2, -2.6]]],
  [E.no - 0.05, E.wives - 0.05, G, [[0.3, 3.0, 1.3], [0, 2.8, -2.4]], [[0.3, 3.0, 1.1], [0, 2.8, -2.4]]],
  [E.wives - 0.05, E.and6 - 0.05, G, [[0, 1.8, 6.2], [0, 1.2, -3.4]], [[0, 1.7, 5.6], [0, 1.2, -3.4]]],
  [E.and6 - 0.05, E.thats - 0.05, G, [[3.6, 3.2, 9.5], [-3, 0.8, -5]], [[3.2, 3.0, 9.0], [-5, 0.6, -6]]],
  [E.thats - 0.05, E.not - 0.05, DANCE2, [[-1.2, 3.0, 3.7], [0, 2.5, -2.4]], [[0.6, 3.0, 3.6], [0, 2.5, -2.4]]],
  [E.not - 0.05, E.and8 - 0.05, G, [[-0.8, 1.0, 3.6], [0.8, 0.1, -1.5]], [[-0.4, 0.95, 3.3], [1.0, 0.1, -1.5]]],
  [E.and8 - 0.05, E.comment - 0.05, G, [[0.4, 1.4, 8.2], [0.3, 1.0, 5.5]], [[0.4, 1.4, 7.8], [0.3, 1.0, 5.5]]],
  [E.comment - 0.05, DURATION + 0.1, G, [[0, 3.4, 11.5], [0, 1.4, 1]], [[0, 3.2, 10.6], [0, 1.4, 1]]],
];
direct({ stage, WORDS, DURATION, shots: SHOTS, update, title: E.as - 0.05, q: [E.wait, E.no], cta: E.comment,
  key: ['krishna', 'dance', 'snake', 'story', 'serpent', 'kaliya', "kaliya's", 'poisoned', 'yamuna', 'black', 'fish', 'birds', 'trees', 'kadamba', 'jumped', 'screamed', 'coils', 'heavier', 'free', 'hoods', 'danced', 'bowed', 'wait', 'destroy', 'no', 'wives', 'mercy', 'ocean', 'kill', 'clean', 'forgive', 'comment'],
  loc: (t) => (t >= E.as - 0.05 && t < E.a - 0.05 ? '📍 YAMUNA · VRINDAVAN' : ''), shakes: [], tick: () => {} });
