// Day 31 · "Why did Yashoda almost faint?" · Why we do what we do #13 (as the story goes: the universe in Krishna's mouth)
// Sets: Yashoda's courtyard in Gokul (origin), the universe (inside a black sphere at U), a home with Laddu Gopal's swing today (x = 80).
import * as THREE from './three.module.js';
import { rng, mat, mesh, sm, seg, lerp, clamp, setupScene, makeCast, pose, lamp, roundTree, clayPot } from './kit.js';
import { makeStage, direct, wordTime } from './director.js';
import { addOutlines, makeConfetti } from './plus.js';
import { WORDS, DURATION } from './data.js';

const stage = makeStage(), { scene, camera } = stage, V = (x, y, z) => new THREE.Vector3(x, y, z), R = rng(31);
const S = setupScene(scene, [[0, 0], [80, 0]], 31);
const WT = wordTime(WORDS);
const E = { when: WT('when'), as: WT('as'), little: WT('little'), when2: WT('when', 2), mother: WT('mother'), yashoda2: WT('grabbed') - 0.54, open: WT('open', 2), krishna3: WT('shook') - 0.32, i: WT('didn') - 0.2,
  open2: WT('open', 3), so: WT('so'), and: WT('inside') - 0.2, stars: WT('stars'), planets: WT('planets'), oceans: WT('oceans'), mountains: WT('mountains'), the: WT('sun') - 0.16, and3: WT('herself') - 0.28,
  wait: WT('wait'), she3: WT('fainted') - 0.88, so2: WT('so', 2), because: WT('because'), she5: WT('needed') - 0.18, thats: WT("that's"), comment: WT('comment') };
const glow = (c, o = 0.5) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, depthWrite: false, blending: THREE.AdditiveBlending });
const noOut = (m) => { m.userData.noOutline = true; m.castShadow = false; return m; };

// ---------------- Gokul: Yashoda's courtyard with a patch of mud
mesh(new THREE.BoxGeometry(14, 0.1, 10), mat(0xd9b77a), 0, 0.05, 0, scene).castShadow = false;
mesh(new THREE.BoxGeometry(14, 3.4, 0.4), mat(0xe0b07a), 0, 1.7, -3.2, scene); mesh(new THREE.BoxGeometry(1.5, 2.3, 0.1), mat(0x7a4a22), -2.6, 1.15, -2.98, scene);
for (let i = 0; i < 9; i++) noOut(mesh(new THREE.CircleGeometry(0.18, 8), mat(i % 2 ? 0xffffff : 0xf6a531), -5.5 + i * 1.4, 2.6, -2.98, scene));
for (const x of [-6.6, 6.6]) mesh(new THREE.BoxGeometry(0.4, 3.4, 7), mat(0xe0b07a), x, 1.7, 0.3, scene);
roundTree(scene, -4.8, -1.6, R, 0.9); roundTree(scene, 5.2, -1.8, R, 0.8); [[-5.4, 1.4], [5.6, 2.4]].forEach(([x, z]) => clayPot(scene, x, 0.42, z, 0.6));
noOut(mesh(new THREE.CylinderGeometry(0.9, 0.95, 0.04, 14), mat(0x6b4a2a), 1.4, 0.11, 0.8, scene));
for (let i = 0; i < 5; i++) noOut(mesh(new THREE.DodecahedronGeometry(0.08, 0), mat(0x5a3a1a), 1.0 + i * 0.2, 0.16, 0.6 + (i % 2) * 0.3, scene));
const mudBall = noOut(mesh(new THREE.DodecahedronGeometry(0.07, 0), mat(0x5a3a1a), 0, 0, 0, scene));
const sparkle = []; for (let i = 0; i < 24; i++) sparkle.push(noOut(mesh(new THREE.OctahedronGeometry(0.05, 0), glow(0xffd23a, 0.9), 0, 0, 0, scene)));
const mouthGlow = noOut(mesh(new THREE.SphereGeometry(0.05, 16, 12), glow(0x8a6aff, 0), 0, 0, 0, scene));
// ---------------- the universe: a black sphere far up, with stars, planets, the earth, the sun and moon, and a tiny Gokul
const U = V(40, 120, 0);
const space = noOut(new THREE.Mesh(new THREE.SphereGeometry(45, 24, 16), new THREE.MeshBasicMaterial({ color: 0x05040f, side: THREE.BackSide, fog: false }))); space.position.copy(U); scene.add(space);
{ const n = 900, p = new Float32Array(n * 3), c = new Float32Array(n * 3); for (let i = 0; i < n; i++) { const a = R() * Math.PI * 2, b = Math.acos(2 * R() - 1), r = 8 + R() * 34; p.set([U.x + r * Math.sin(b) * Math.cos(a), U.y + r * Math.cos(b), U.z + r * Math.sin(b) * Math.sin(a)], i * 3); const col = new THREE.Color([0xffffff, 0xbfd8ff, 0xffe0a0, 0xffb0d0][i % 4]); c.set([col.r, col.g, col.b], i * 3); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3)); g.setAttribute('color', new THREE.BufferAttribute(c, 3)); const pts = new THREE.Points(g, new THREE.PointsMaterial({ size: 0.25, vertexColors: true, fog: false })); pts.userData.noOutline = true; scene.add(pts); }
const nebula = [0x8a3ab8, 0x2f6fd0, 0xd84a8a].map((c, i) => noOut(mesh(new THREE.SphereGeometry(9 + i * 3, 16, 12), new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.07, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }), U.x - 12 + i * 12, U.y + 6 - i * 5, U.z - 22, scene)));
const sun = noOut(mesh(new THREE.SphereGeometry(3.2, 24, 16), new THREE.MeshBasicMaterial({ color: 0xffd23a, fog: false }), U.x + 12, U.y + 5, U.z - 14, scene));
const sunGlow = noOut(mesh(new THREE.SphereGeometry(5.2, 24, 16), new THREE.MeshBasicMaterial({ color: 0xff9a2a, transparent: true, opacity: 0.25, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }), U.x + 12, U.y + 5, U.z - 14, scene));
const moon = mesh(new THREE.SphereGeometry(1.0, 20, 14), new THREE.MeshBasicMaterial({ color: 0xd8d8e0, fog: false }), U.x + 7, U.y + 2.2, U.z - 8, scene); moon.userData.noOutline = true;
const sat = new THREE.Group(); sat.position.set(U.x - 6, U.y + 3, U.z - 9); scene.add(sat); noOut(mesh(new THREE.SphereGeometry(1.6, 20, 14), new THREE.MeshBasicMaterial({ color: 0xe8b86a, fog: false }), 0, 0, 0, sat)); const ringM = noOut(mesh(new THREE.RingGeometry(2.1, 3.0, 40), new THREE.MeshBasicMaterial({ color: 0xd9c08a, side: THREE.DoubleSide, transparent: true, opacity: 0.85, fog: false }), 0, 0, 0, sat)); ringM.rotation.x = 1.2;
const smallPlanets = [[0xe0603a, -2.5, -4, -6, 0.6], [0x6ad0e0, 4, -2.5, -5, 0.5], [0x8a6ad8, -8, -3, -12, 0.9]].map(([c, x, y, z, r]) => noOut(mesh(new THREE.SphereGeometry(r, 16, 12), new THREE.MeshBasicMaterial({ color: c, fog: false }), U.x + x, U.y + y, U.z + z, scene)));
// the earth: oceans and mountains
const earth = new THREE.Group(); earth.position.set(U.x, U.y - 0.5, U.z - 3); scene.add(earth);
const sunL = new THREE.PointLight(0xffffff, 0, 60, 0.2); sunL.position.set(U.x + 8, U.y + 6, U.z + 6); scene.add(sunL);
mesh(new THREE.SphereGeometry(1.6, 32, 24), new THREE.MeshStandardMaterial({ color: 0x2f7ad8, roughness: 0.35, emissive: 0x0a2a5a, emissiveIntensity: 0.6 }), 0, 0, 0, earth).userData.noOutline = true;
for (let i = 0; i < 9; i++) { const a = R() * Math.PI * 2, b = 0.6 + R() * 1.9, v = V(Math.sin(b) * Math.cos(a), Math.cos(b), Math.sin(b) * Math.sin(a)); const land = noOut(mesh(new THREE.SphereGeometry(0.42 + R() * 0.3, 10, 8).scale(1, 0.25, 1), new THREE.MeshStandardMaterial({ color: 0x5cbf45, roughness: 0.8, emissive: 0x1a3a10, emissiveIntensity: 0.6 }), v.x * 1.52, v.y * 1.52, v.z * 1.52, earth)); land.lookAt(earth.position.clone().add(v.clone().multiplyScalar(5))); land.rotateX(Math.PI / 2);
  for (let k = 0; k < 2; k++) { const m = noOut(mesh(new THREE.ConeGeometry(0.12, 0.3, 5), new THREE.MeshStandardMaterial({ color: k ? 0xffffff : 0x9a8a7a, emissive: 0x2a2a2a, emissiveIntensity: 0.5 }), 0, 0, 0, earth)); const vv = v.clone().add(V((R() - 0.5) * 0.2, (R() - 0.5) * 0.2, (R() - 0.5) * 0.2)).normalize(); m.position.copy(vv.clone().multiplyScalar(1.66)); m.lookAt(vv.clone().multiplyScalar(5)); m.rotateX(Math.PI / 2); } }
// a tiny Gokul floating in space: Yashoda holding Krishna
const mini = new THREE.Group(); mini.position.set(U.x + 2.2, U.y - 3.2, U.z + 1.0); scene.add(mini);
noOut(mesh(new THREE.CylinderGeometry(1.3, 0.4, 0.5, 14), new THREE.MeshStandardMaterial({ color: 0xd9b77a, emissive: 0x3a2a10, emissiveIntensity: 0.5 }), 0, -0.25, 0, mini));
noOut(mesh(new THREE.BoxGeometry(1.0, 0.6, 0.6), new THREE.MeshStandardMaterial({ color: 0xe0b07a, emissive: 0x3a2a10, emissiveIntensity: 0.5 }), -0.5, 0.3, -0.5, mini));
const miniGlow = noOut(mesh(new THREE.SphereGeometry(1.6, 16, 12), new THREE.MeshBasicMaterial({ color: 0xffe0a0, transparent: true, opacity: 0.12, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }), 0, 0.4, 0, mini));
// ---------------- today: a home with Laddu Gopal on a little swing (x = 80)
const H = new THREE.Group(); H.position.set(80, 0, 0); scene.add(H);
mesh(new THREE.BoxGeometry(12, 0.1, 10), mat(0xe8d3a0), 0, 0.05, 0, H).castShadow = false; mesh(new THREE.BoxGeometry(12, 8, 0.3), mat(0xf6d9a0), 0, 4, -2.8, H);
for (const x of [-0.8, 0.8]) mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.0, 6), mat(0xd9a441, { m: 0.6, r: 0.35 }), x, 1.0, -1.2, H);
mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.8, 6).rotateZ(Math.PI / 2), mat(0xd9a441, { m: 0.6, r: 0.35 }), 0, 2.0, -1.2, H);
const swing = new THREE.Group(); swing.position.set(80, 2.0, -1.2); scene.add(swing);
for (const x of [-0.35, 0.35]) mesh(new THREE.CylinderGeometry(0.012, 0.012, 1.2, 4), mat(0x8a6a3a), x, -0.6, 0, swing);
mesh(new THREE.BoxGeometry(0.85, 0.08, 0.5), mat(0xc0213a), 0, -1.22, 0, swing); mesh(new THREE.BoxGeometry(0.85, 0.3, 0.05), mat(0xffd23a), 0, -1.05, -0.24, swing);
for (let i = 0; i < 14; i++) { const u = i / 13; noOut(mesh(new THREE.SphereGeometry(0.09, 6, 4), mat(i % 2 ? 0xf6a531 : 0xffffff), -1.8 + u * 3.6, 3.2 - Math.sin(u * Math.PI) * 0.4, -2.6, H)); }
const hl = [lamp(H, -1.6, 0.1, -1.6, 0.8), lamp(H, 1.6, 0.1, -1.6, 0.8)];
// ---------------- the cast
const C = makeCast(scene, [['k', 'kidKrishna'], ['y', 'yashoda'], ['f1', 'kid1'], ['f2', 'kid2'], ['f3', 'kid4'], ['miniY', 'yashoda'], ['miniK', 'kidKrishna'], ['laddu', 'kidKrishna'], ['mom', 'gopi2']]);
addOutlines(scene);
const confetti = makeConfetti(scene, 50, 31);
const K = V(1.2, 0, 0.9), DOOR = V(-2.6, 0, -2.4);

function update(s, t) {
  const cy = camera.position.y, inSpace = cy > 60, home = camera.position.x > 60 && !inSpace;
  S.mood(0); S.hemi.intensity = home ? 1.3 : 1.4; S.sun.target.position.set(home ? 80 : 0, 0, 0); S.sun.position.set((home ? 80 : 0) - 8, 14, 10); S.sun.target.updateMatrixWorld();
  sunL.intensity = inSpace ? 3 : 0;
  // Krishna eats mud, gets caught, shakes his head, opens his mouth
  const eating = s >= E.little && s < E.yashoda2 + 0.4;
  const hug = sm(seg(s, E.because - 0.2, E.because + 0.6));
  const ent = sm(seg(s, E.yashoda2 - 0.2, E.yashoda2 + 1.0)), Y = DOOR.clone().lerp(V(0.35, 0, 1.1), ent);
  const kp = K.clone().lerp(V(0.75, 0.5, 1.25), hug);
  const shake = s >= E.krishna3 && s < E.i ? Math.sin(t * 22) * 0.06 : 0;
  const kMood = s >= E.so && s < E.wait ? 'wow' : s >= E.krishna3 && s < E.open2 ? 'smug' : s >= E.so2 && s < E.because ? 'wink' : eating ? 'happy' : 'happy';
  pose(C.k, camera, { x: kp.x + shake, y: kp.y, z: kp.z, h: 1.15, sitting: s < E.yashoda2 + 0.5 && s >= E.little, mood: kMood, arm: eating && Math.sin(t * 4) > 0 ? 'up' : 'down', butter: false });
  mudBall.visible = eating; { const right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0); right.y = 0; right.normalize(); mudBall.position.copy(K).add(right.multiplyScalar(-0.16)).add(V(0, Math.sin(t * 4) > 0 ? 0.68 : 0.35, 0.05)); }
  mouthGlow.visible = s >= E.so + 0.6 && s < E.wait; mouthGlow.position.copy(K).add(V(0, 0.755, 0.08)); mouthGlow.material.opacity = 0.45 + 0.15 * Math.sin(t * 6); mouthGlow.scale.setScalar(1 + sm(seg(s, E.so + 0.6, E.and)) * 0.8); mouthGlow.position.y -= 0.04;
  // Yashoda: comes out, grabs him, sees the universe, almost faints, forgets, hugs him
  const faint = s >= E.she3 && s < E.so2 + 0.4 ? Math.sin((s - E.she3) * 3) * 0.25 : 0;
  pose(C.y, camera, { visible: s >= E.yashoda2 - 0.3 || s < E.as, x: Y.x, z: Y.z, h: 1.62, step: ent > 0 && ent < 1 ? s * 3 : 0,
    mood: s >= E.wait && s < E.so2 ? 'wow' : s >= E.open && s < E.so ? 'normal' : s >= E.so2 + 0.8 ? 'happy' : s >= E.so ? 'wow' : 'normal', arm: s >= E.open && s < E.so ? 'point' : hug > 0.5 ? 'offer' : 'down' });
  C.y.m.rotateZ(faint);
  sparkle.forEach((m, i) => { const u = s - E.so2 - 0.4 - (i % 8) * 0.06; m.visible = u > 0 && u < 1.6 && !inSpace; const a = i * 2.4 + u * 3; m.position.set(Y.x + Math.cos(a) * 0.45, 1.9 + Math.sin(u * 4 + i) * 0.15 - u * 0.2, Y.z + Math.sin(a) * 0.3); m.rotation.y = t * 4; });
  // friends play, then run to the door shouting
  const run = sm(seg(s, E.when2 - 0.2, E.mother));
  [['f1', 2.3, 1.6], ['f2', 0.2, 2.2], ['f3', 2.5, 0.0]].forEach(([n, x, z], i) => { const p = V(x, 0, z).lerp(V(-1.8 + i * 0.6, 0, -1.4 + i * 0.3), run); pose(C[n], camera, { x: p.x, z: p.z, h: 1.1, step: run > 0 && run < 1 ? s * 4 + i : 0, mood: s >= E.when2 && s < E.yashoda2 ? 'wow' : 'happy', arm: s >= E.mother && s < E.yashoda2 && i === 0 ? 'point' : 'down', flip: run > 0 && run < 1 }); });
  // --- the universe
  sat.rotation.y = t * 0.2; earth.rotation.y = t * 0.25; sunGlow.scale.setScalar(1 + 0.05 * Math.sin(t * 2)); nebula.forEach((n, i) => (n.rotation.y = t * 0.02 * (i + 1)));
  mini.rotation.y = Math.sin(t * 0.5) * 0.3; miniGlow.material.opacity = 0.12 + 0.04 * Math.sin(t * 3);
  pose(C.miniY, camera, { x: mini.position.x - 0.1, y: mini.position.y, z: mini.position.z + 0.2, h: 0.75, mood: 'happy', arm: 'offer' });
  pose(C.miniK, camera, { x: mini.position.x + 0.18, y: mini.position.y + 0.25, z: mini.position.z + 0.25, h: 0.45, mood: 'happy' });
  // --- today: a mother rocks Laddu Gopal's swing
  swing.rotation.x = Math.sin(t * 1.6) * 0.18;
  const sp = new THREE.Vector3(0, -1.2, 0).applyEuler(swing.rotation).add(swing.position);
  pose(C.laddu, camera, { x: sp.x, y: sp.y + 0.05, z: sp.z + 0.05, h: 0.6, sitting: true, mood: 'happy' });
  pose(C.mom, camera, { x: 81.0, z: -0.2, h: 1.62, mood: 'closed', arm: 'offer', flip: true });
  hl.forEach((l, i) => (l.flame.scale.y = 1 + 0.15 * Math.sin(t * 13 + i)));
  confetti(E.comment, s, V(80, 2.6, -0.8));
  S.clouds.forEach((c, i) => { c.position.x = -80 + i * 15 + ((t * 0.6 + i * 3) % 12); });
}

const G = (t) => t, SPACE = (t) => E.stars + t * 0.2, OPEN = (t) => E.so + 1.2 + (t - E.when) * 0.2;
const u = (x, y, z) => [U.x + x, U.y + y, U.z + z];
const SHOTS = [
  [0, E.when - 0.05, SPACE, [u(-4, 1, 8), u(-2, 1.5, -6)], [u(-2, 1.4, 5), u(0, 1, -6)]],
  [E.when - 0.05, E.as - 0.05, OPEN, [[1.25, 0.75, 2.4], [1.2, 0.62, 0.9]], [[1.22, 0.7, 1.8], [1.2, 0.62, 0.9]]],
  [E.as - 0.05, E.little - 0.05, G, [[0, 4.5, 10], [0.4, 0.8, 0]], [[0, 3.2, 8], [0.4, 0.8, 0]]],
  [E.little - 0.05, E.when2 - 0.05, G, [[2.0, 1.0, 3.2], [1.2, 0.55, 0.9]], [[1.9, 0.95, 2.9], [1.2, 0.55, 0.9]]],
  [E.when2 - 0.05, E.mother - 0.05, G, [[1.5, 1.6, 5.4], [-0.6, 1.0, -0.8]], [[1.2, 1.6, 5.0], [-1.0, 1.0, -1.0]]],
  [E.mother - 0.05, E.yashoda2 - 0.05, G, [[-1.4, 1.0, 0.8], [-1.8, 0.8, -1.4]], [[-1.4, 1.0, 0.6], [-1.8, 0.8, -1.4]]],
  [E.yashoda2 - 0.05, E.open - 0.05, G, [[1.4, 1.7, 5.4], [0.4, 1.0, 0.4]], [[1.3, 1.6, 4.8], [0.6, 1.0, 0.6]]],
  [E.open - 0.05, E.krishna3 - 0.05, G, [[0.1, 1.6, 2.9], [0.35, 1.4, 1.1]], [[0.15, 1.6, 2.7], [0.35, 1.4, 1.1]]],
  [E.krishna3 - 0.05, E.i - 0.05, G, [[1.25, 0.75, 2.4], [1.2, 0.6, 0.9]], [[1.25, 0.72, 2.2], [1.2, 0.6, 0.9]]],
  [E.i - 0.05, E.open2 - 0.05, G, [[1.25, 0.75, 2.2], [1.2, 0.6, 0.9]], [[1.25, 0.72, 2.0], [1.2, 0.6, 0.9]]],
  [E.open2 - 0.05, E.so - 0.05, G, [[0.1, 1.6, 2.7], [0.35, 1.4, 1.1]], [[0.12, 1.6, 2.5], [0.35, 1.4, 1.1]]],
  [E.so - 0.05, E.and - 0.05, G, [[1.25, 0.72, 2.4], [1.2, 0.62, 0.9]], [[1.21, 0.66, 1.65], [1.2, 0.62, 0.9]]],
  [E.and - 0.05, E.stars - 0.05, G, [u(0, 0, 30), u(0, 0, 0)], [u(0, 1, 14), u(0, 0, -4)]],
  [E.stars - 0.05, E.planets - 0.05, G, [u(-3, 4, 4), u(-12, 10, -20)], [u(-3.5, 4.4, 3), u(-12, 10, -20)]],
  [E.planets - 0.05, E.oceans - 0.05, G, [u(-2, 3.6, -2), u(-6, 3, -9)], [u(-2.6, 3.4, -3.2), u(-6, 3, -9)]],
  [E.oceans - 0.05, E.mountains - 0.05, G, [u(1.2, 0.4, 2.2), u(0, -0.5, -3)], [u(0.9, 0.2, 1.5), u(0, -0.5, -3)]],
  [E.mountains - 0.05, E.the - 0.05, G, [u(0.2, 1.4, -0.6), u(0, 0.6, -2.6)], [u(-0.2, 1.3, -0.8), u(0, 0.6, -2.6)]],
  [E.the - 0.05, E.and3 - 0.05, G, [u(4, 2, 0), u(10, 4.2, -12)], [u(5, 2.4, -2), u(10, 4.2, -12)]],
  [E.and3 - 0.05, E.wait - 0.05, G, [u(2.2, -2.2, 6.5), u(2.2, -3.0, 1.0)], [u(2.2, -2.6, 3.6), u(2.2, -3.0, 1.0)]],
  [E.wait - 0.05, E.she3 - 0.05, G, [[0.4, 1.6, 3.6], [0.35, 1.4, 1.1]], [[0.4, 1.6, 3.3], [0.35, 1.4, 1.1]]],
  [E.she3 - 0.05, E.so2 - 0.05, G, [[0.9, 1.5, 4.4], [0.6, 1.1, 1.0]], [[0.9, 1.5, 4.0], [0.6, 1.1, 1.0]]],
  [E.so2 - 0.05, E.because - 0.05, G, [[0.9, 1.6, 4.0], [0.7, 1.3, 1.0]], [[0.8, 1.6, 3.6], [0.6, 1.4, 1.0]]],
  [E.because - 0.05, E.thats - 0.05, G, [[0.6, 1.5, 3.6], [0.55, 1.3, 1.15]], [[0.6, 1.5, 3.1], [0.55, 1.35, 1.15]]],
  [E.thats - 0.05, E.comment - 0.05, G, [[80.3, 1.6, 3.4], [80.2, 1.1, -1.0]], [[80.3, 1.5, 2.8], [80.2, 1.0, -1.0]]],
  [E.comment - 0.05, DURATION + 0.1, G, [[80, 2.0, 5.0], [80, 1.3, -1.2]], [[80, 1.9, 4.6], [80, 1.3, -1.2]]],
];
direct({ stage, WORDS, DURATION, shots: SHOTS, update, title: E.when - 0.05, q: [E.wait, E.she3], cta: E.comment,
  key: ['yashoda', 'faint', 'mouth', 'story', 'krishna', 'friends', 'running', 'mother', 'mud', 'grabbed', 'open', 'shook', "didn't", 'tiny', 'universe', 'stars', 'planets', 'oceans', 'mountains', 'sun', 'moon', 'herself', 'gokul', 'wait', 'fainted', 'forget', 'god', 'boy', 'love', 'child', 'comment', 'chills'],
  loc: (t) => (t >= E.as - 0.05 && t < E.little - 0.05 ? '📍 GOKUL · LONG AGO' : t >= E.and - 0.05 && t < E.stars - 0.05 ? 'INSIDE HIS MOUTH' : t >= E.thats - 0.05 && t < E.comment ? 'EVEN TODAY' : ''), shakes: [], tick: () => {} });
