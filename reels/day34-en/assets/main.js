// Day 34 · "Why Ranchhod?" · Why we do what we do #16 (as the story goes: Kalayavana chases Krishna into Muchukunda's cave)
// Sets: Mathura's gate (origin), the hills (x = 40, running along +x to a cave mouth at x = 48), inside the cave (x = 80).
import * as THREE from './three.module.js';
import { rng, mat, mesh, sm, seg, lerp, clamp, setupScene, makeCast, pose, roundTree, palm } from './kit.js';
import { makeStage, direct, wordTime } from './director.js';
import { addOutlines, makeConfetti } from './plus.js';
import { WORDS, DURATION } from './data.js';

const stage = makeStage(), { scene, camera } = stage, V = (x, y, z) => new THREE.Vector3(x, y, z), R = rng(34);
const S = setupScene(scene, [[0, 0], [40, 0], [80, 0]], 34);
const WT = wordTime(WORDS);
const E = { the: WT('the'), as: WT('as'), a: WT('fearsome') - 0.16, he: WT('had') - 0.06, no: WT('no'), so: WT('so'), he2: WT('turned') - 0.18, kalayavana2: WT('kalayavana', 2), out: WT('out'),
  over: WT('over'), and2: WT('into') - 0.2, inside: WT('inside'), kalayavana3: WT('kalayavana', 3), kicked: WT('kicked'), but: WT('but'), who2: WT('who', 2), whoever: WT('whoever'), wait: WT('wait'),
  muchukunda2: WT('muchukunda', 2), and4: WT('kalayavana', 4) - 0.26, krishna4: WT('need') - 0.58, he4: WT('needed') - 0.14, thats: WT("that's"), comment: WT('comment') };
const glow = (c, o = 0.5) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, depthWrite: false, blending: THREE.AdditiveBlending });
const noOut = (m) => { m.userData.noOutline = true; m.castShadow = false; return m; };

// ---------------- Mathura: walls, towers and the gate
mesh(new THREE.BoxGeometry(16, 0.06, 12), mat(0xd9c08a), 0, 0.03, 0, scene).castShadow = false;
const wallM = mat(0xd9a066); for (const x of [-5, 5]) mesh(new THREE.BoxGeometry(7, 3.6, 0.8), wallM, x, 1.8, -4, scene);
mesh(new THREE.BoxGeometry(3, 1.2, 0.8), wallM, 0, 3.0, -4, scene); for (const x of [-1.6, 1.6, -8.4, 8.4]) { mesh(new THREE.CylinderGeometry(0.8, 0.9, 4.6, 8), wallM, x, 2.3, -4, scene); mesh(new THREE.ConeGeometry(1.0, 1.2, 8), mat(0xd8573a), x, 5.2, -4, scene); }
mesh(new THREE.BoxGeometry(2.2, 2.4, 0.2), mat(0x3a2a1a), 0, 1.2, -3.7, scene);
for (let i = 0; i < 3; i++) palm(scene, 6 + i * 1.5, 2 + i * 1.2, R);
const arrowsM = []; for (let i = 0; i < 8; i++) { const g = new THREE.Group(); scene.add(g); noOut(mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.8, 4).rotateZ(Math.PI / 2), mat(0x8a6a3a), 0, 0, 0, g)); noOut(mesh(new THREE.ConeGeometry(0.05, 0.12, 4).rotateZ(-Math.PI / 2), mat(0xd0d0d8), 0.45, 0, 0, g)); arrowsM.push(g); }
const clinks = []; for (let i = 0; i < 8; i++) clinks.push(noOut(mesh(new THREE.OctahedronGeometry(0.1, 0), glow(0xffe08a, 0.9), 0, 0, 0, scene)));
// ---------------- the hills (x = 40), the path, the cave mouth at x = 48
for (let i = 0; i < 9; i++) noOut(mesh(new THREE.SphereGeometry(4 + R() * 3, 12, 8).scale(1, 0.35, 1), mat([0x6fbf45, 0x5cb83a, 0x7ac84a][i % 3]), 30 + i * 3, -0.5, -9 - R() * 6, scene));
noOut(mesh(new THREE.BoxGeometry(18, 0.04, 1.6), mat(0xd9c08a), 40, 0.05, 0, scene));
for (let i = 0; i < 6; i++) roundTree(scene, 33 + i * 3, -3.5 - (i % 2) * 1.5, R, 0.8);
const caveRock = mat(0x6a6070); for (let i = 0; i < 7; i++) { const a = Math.PI * (i / 6); mesh(new THREE.DodecahedronGeometry(1.1 + R() * 0.4, 0), caveRock, 48 + Math.cos(a) * 2.2 * 0 , Math.sin(a) * 2.6 + 0.3, Math.cos(a) * 2.2, scene); }
mesh(new THREE.DodecahedronGeometry(3.4, 0), caveRock, 49.6, 1.4, 0, scene); noOut(mesh(new THREE.CircleGeometry(1.3, 16), mat(0x0a0810), 47.95, 1.2, 0, scene)).rotation.y = -Math.PI / 2;
// ---------------- inside the cave (x = 80)
const cave = noOut(new THREE.Mesh(new THREE.DodecahedronGeometry(7, 1), new THREE.MeshStandardMaterial({ color: 0x4a4250, roughness: 1, side: THREE.BackSide, flatShading: true }))); cave.position.set(80, 2.5, -1); cave.scale.set(1.3, 0.75, 1); scene.add(cave);
mesh(new THREE.BoxGeometry(24, 0.1, 20), mat(0x3a3440), 80, 0.05, 0, scene).castShadow = false;
mesh(new THREE.BoxGeometry(2.4, 0.6, 1.0), mat(0x7a7080), 80, 0.3, -1.2, scene);
const hideRock = mesh(new THREE.DodecahedronGeometry(0.75, 0), mat(0x6a6070), 82.1, 0.6, 0.6, scene);
const shaft = noOut(mesh(new THREE.ConeGeometry(2.2, 7, 16, 1, true), glow(0xfff0c0, 0.08), 81.5, 3.5, 2.5, scene)); shaft.rotation.z = 0.5;
const caveL = new THREE.PointLight(0xffe0b0, 6, 12, 1.4); caveL.position.set(81.5, 3.2, 2.5); scene.add(caveL);
// the yellow shawl Krishna leaves over the sleeper
const shawl = noOut(mesh(new THREE.BoxGeometry(1.9, 0.08, 0.7), mat(0xffcf3a), 80, 0.78, -1.1, scene));
// the eyes' fire and the ashes
const beams = [-1, 1].map(() => noOut(mesh(new THREE.ConeGeometry(0.16, 2.6, 10, 1, true).rotateZ(-Math.PI / 2).translate(1.3, 0, 0), glow(0xff8a2a, 0), 0, 0, 0, scene)));
const flames = []; for (let i = 0; i < 26; i++) flames.push({ m: noOut(mesh(new THREE.ConeGeometry(0.14 + R() * 0.1, 0.5 + R() * 0.5, 6), new THREE.MeshBasicMaterial({ color: [0xff5a1e, 0xffb02a, 0xffd23a][i % 3], transparent: true, opacity: 0.92 }), 0, 0, 0, scene)), p: V((R() - 0.5) * 0.8, R() * 1.8, (R() - 0.5) * 0.4), ph: R() * 6 });
const ash = noOut(mesh(new THREE.ConeGeometry(0.5, 0.35, 10), mat(0x5a5a5a), 0, 0.18, 0, scene));
const fireL = new THREE.PointLight(0xff7a2a, 0, 8, 1.4); scene.add(fireL);
const smokeP = []; for (let i = 0; i < 10; i++) smokeP.push(noOut(mesh(new THREE.SphereGeometry(0.3, 8, 6), new THREE.MeshBasicMaterial({ color: 0x6a6a70, transparent: true, opacity: 0.4, depthWrite: false }), 0, 0, 0, scene)));
// ---------------- the cast
const C = makeCast(scene, [['k', 'krishna'], ['kal', 'kalayavana'], ['mu', 'muchukunda'], ['s1', 'guard'], ['s2', 'guard']]);
addOutlines(scene);
const confetti = makeConfetti(scene, 50, 34);
const KAL_C = V(81.5, 0, -0.35); // where Kalayavana stands in the cave

function update(s, t) {
  const cx = camera.position.x, set = cx > 60 ? 80 : cx > 20 ? 40 : 0, inCave = set === 80;
  S.mood(inCave ? 0.4 : 0); S.hemi.intensity = inCave ? 0.8 : 1.4; S.sun.target.position.set(set, 0, 0); S.sun.position.set(set - 8, 14, 10); S.sun.target.updateMatrixWorld();
  // where everyone is depends on the set: gate (before the chase), hills (the chase), cave
  const runG = seg(s, E.he2 + 0.3, E.over), runH = seg(s, E.over - 0.2, E.and2 + 1.2);
  let kp, kpose = {}, lp, lpose = {}, kalVis = true;
  if (set === 0) { kp = V(lerp(0, -9, sm(runG)), 0, lerp(0.6, 2.5, sm(runG))); kpose = { mood: s >= E.so && s < E.he2 + 0.3 ? 'wink' : s >= E.he2 ? 'happy' : 'normal', step: runG > 0 && runG < 1 ? s * 5 : 0, flip: true };
    const chase = seg(s, E.kalayavana2 + 0.3, E.over); lp = chase > 0 ? V(Math.min(2.4, kp.x + 1.6), 0, kp.z + 0.2) : V(2.4, 0, 0.8); lpose = { mood: s >= E.kalayavana2 ? 'happy' : 'smug', arm: s >= E.he && s < E.so ? 'hips' : 'down', step: chase > 0 && chase < 1 ? s * 4 : 0, flip: chase > 0 }; }
  else if (set === 40) { const u = sm(runH); kp = V(lerp(33, 47.9, u), 0, Math.sin(u * 6) * 0.2); kpose = { mood: 'happy', step: s * 5 }; lp = V(lerp(31.2, 46.7, sm(seg(s, E.over - 0.2, E.and2 + 1.6))), 0, 0.3); lpose = { mood: 'happy', arm: 'up', step: s * 4 }; if (u >= 0.99) kpose.visible = false; }
  else { // the cave
    const enterL = sm(seg(s, E.kalayavana3 - 0.2, E.kalayavana3 + 0.9));
    kp = s < E.krishna4 ? V(82.3, 0, 0.9) : V(lerp(82.3, 81.4, sm(seg(s, E.krishna4, E.krishna4 + 0.8))), 0, 1.4); kpose = { mood: s >= E.he4 && s < E.thats ? 'wink' : s < E.krishna4 ? 'smug' : 'happy', arm: s >= E.krishna4 && s < E.he4 ? 'wave' : 'down', flip: true };
    lp = V(lerp(84.5, KAL_C.x, enterL), 0, lerp(2.8, KAL_C.z, enterL)); lpose = { mood: s >= E.wait ? 'wow' : 'smug', step: enterL > 0 && enterL < 1 ? s * 3 : 0, arm: s >= E.kicked && s < E.kicked + 0.6 ? 'point' : 'down', flip: true };
    kalVis = s >= E.kalayavana3 - 0.3 && s < E.and4 + 0.9; }
  pose(C.k, camera, { x: kp.x, y: kp.y ?? 0, z: kp.z, h: 1.75, ...kpose, visible: kpose.visible !== false && (set !== 80 || s >= E.inside - 0.2) });
  const burnK = sm(seg(s, E.and4, E.and4 + 0.9));
  pose(C.kal, camera, { x: lp.x, z: lp.z, h: 2.05 * (set === 80 ? 1 - burnK * 0.9 : 1), ...lpose, visible: kalVis && burnK < 0.95 });
  if (set === 80 && s >= E.kicked && s < E.kicked + 0.5) C.kal.m.rotateZ(-0.2);
  // soldiers on Mathura's wall shoot; the arrows bounce off him
  pose(C.s1, camera, { visible: set === 0, x: -3.2, y: 3.6, z: -3.6, h: 1.5, mood: s >= E.no + 0.3 ? 'wow' : 'normal' }); pose(C.s2, camera, { visible: set === 0, x: 3.4, y: 3.6, z: -3.6, h: 1.5, mood: s >= E.no + 0.3 ? 'wow' : 'normal', flip: true });
  arrowsM.forEach((g, i) => { const u = ((s - E.no) * 1.4 + i * 0.13); g.visible = set === 0 && s >= E.no && s < E.so && u > 0 && u < 1; const from = V(i % 2 ? 3.4 : -3.2, 4.2, -3.4), to = V(2.4, 1.4 + (i % 3) * 0.2, 0.8); g.position.copy(from.clone().lerp(to, Math.min(1, u))); g.lookAt(to); g.rotateY(-Math.PI / 2); const c = clinks[i]; c.visible = g.visible && u > 0.85; c.position.copy(to); c.scale.setScalar(1 + (u - 0.85) * 8); });
  // the sleeping king under Krishna's yellow shawl; the kick; the shawl slides off; his eyes open and burn
  const reveal = sm(seg(s, E.but - 0.2, E.but + 0.5)), wake = s >= E.muchukunda2 - 0.2;
  pose(C.mu, camera, { visible: inCave, x: lerp(80.85, 80.4, wake ? 1 : 0), y: wake ? 0.0 : 0.62, z: -1.1, h: 1.78, sitting: wake, mood: wake ? (s >= E.thats ? 'closed' : 'normal') : 'closed', arm: s >= E.thats ? 'up' : 'down' });
  if (!wake) { C.mu.m.rotateZ(Math.PI / 2); C.mu.m.position.y += 0.22; } else C.mu.m.position.y = 0.62;
  shawl.visible = inCave && s >= E.inside - 0.3 && reveal < 0.99; shawl.position.set(80 + reveal * 1.2, 0.86 - reveal * 0.6, -1.1 + reveal * 0.6); shawl.rotation.z = -reveal * 0.6;
  const beam = sm(seg(s, E.muchukunda2 + 0.4, E.muchukunda2 + 0.8)) * (1 - sm(seg(s, E.and4 + 0.8, E.and4 + 1.3)));
  { const eye = V(80.4, 1.48, -0.95), dir = KAL_C.clone().add(V(0, 1.2, 0)).sub(eye); beams.forEach((b, i) => { b.visible = beam > 0.01 && inCave; b.position.copy(eye).add(V(i ? 0.09 : -0.09, 0, 0)); b.rotation.y = -Math.atan2(dir.z, dir.x); b.rotation.z = Math.atan2(dir.y, Math.hypot(dir.x, dir.z)); b.scale.set(dir.length() / 2.6, 1, 1); b.material.opacity = beam * 0.7; }); }
  flames.forEach(({ m, p, ph }) => { const on = inCave && burnK > 0.02 && s < E.and4 + 1.8; m.visible = on; if (!on) return; m.position.copy(KAL_C).add(p.clone().multiplyScalar(1 - burnK * 0.6)); const k = Math.sin(burnK * Math.PI) + 0.2; m.scale.set(k, k * (1 + 0.3 * Math.sin(t * 11 + ph)), k); });
  fireL.position.copy(KAL_C).add(V(0, 1, 0.4)); fireL.intensity = inCave ? Math.sin(burnK * Math.PI) * 8 : 0;
  ash.visible = inCave && burnK > 0.6; ash.position.set(KAL_C.x, 0.18, KAL_C.z); ash.scale.setScalar(Math.min(1, (burnK - 0.6) * 2.5));
  smokeP.forEach((m, i) => { const u = (t * 0.3 + i / 10) % 1; m.visible = inCave && burnK > 0.4 && s < E.thats + 2; m.position.set(KAL_C.x + (i % 3 - 1) * 0.2, 0.4 + u * 2.5, KAL_C.z); m.scale.setScalar(0.5 + u * 1.5); m.material.opacity = 0.4 * (1 - u); });
  shaft.material.opacity = 0.06 + 0.02 * Math.sin(t * 2);
  confetti(E.thats, s, V(81, 2.5, 0.8));
  S.clouds.forEach((c, i) => { c.position.x = -80 + i * 15 + ((t * 0.6 + i * 3) % 12); });
}

const G = (t) => t, CHASE = (t) => E.over + 0.9 + t * 0.15;
const SHOTS = [
  [0, E.the - 0.05, CHASE, [[37.6, 1.6, 6.6], [39.6, 1.2, 0]], [[38.4, 1.6, 6.4], [40.4, 1.2, 0]]],
  [E.the - 0.05, E.as - 0.05, CHASE, [[40.2, 1.3, 3.8], [40.8, 1.1, 0]], [[40.6, 1.3, 3.8], [41.2, 1.1, 0]]],
  [E.as - 0.05, E.a - 0.05, G, [[0, 5, 14], [0, 2, -3]], [[0, 3.4, 11], [0, 1.8, -3]]],
  [E.a - 0.05, E.he - 0.05, G, [[2.6, 1.6, 6.4], [2.4, 1.7, 0.8]], [[2.6, 1.4, 5.4], [2.4, 1.6, 0.8]]],
  [E.he - 0.05, E.no - 0.05, G, [[2.0, 2.1, 4.0], [2.4, 2.0, 0.8]], [[2.0, 2.1, 3.7], [2.4, 2.0, 0.8]]],
  [E.no - 0.05, E.so - 0.05, G, [[4.6, 2.4, 7.6], [1.0, 2.0, -1.0]], [[4.2, 2.4, 7.0], [1.0, 2.0, -1.0]]],
  [E.so - 0.05, E.he2 - 0.05, G, [[0.2, 1.6, 3.0], [0.0, 1.45, 0.6]], [[0.2, 1.6, 2.7], [0.0, 1.45, 0.6]]],
  [E.he2 - 0.05, E.kalayavana2 - 0.05, G, [[-1.2, 3.0, 11.5], [-1.6, 1.0, 1.2]], [[-1.8, 3.0, 11.5], [-2.4, 1.0, 1.2]]],
  [E.kalayavana2 - 0.05, E.over - 0.05, G, [[-1.6, 3.0, 11.5], [-2.2, 1.0, 1.6]], [[-6.4, 3.0, 11.5], [-7.0, 1.0, 2.2]]],
  [E.over - 0.05, E.and2 - 0.05, G, [[34, 2.4, 7], [36, 1.0, 0]], [[42, 2.4, 7], [43, 1.0, 0]]],
  [E.and2 - 0.05, E.inside - 0.05, G, [[42.6, 2.4, 8.2], [46.6, 1.3, 0]], [[43.4, 2.3, 7.6], [47.2, 1.3, 0]]],
  [E.inside - 0.05, E.kalayavana3 - 0.05, G, [[80.4, 1.8, 3.8], [80.4, 0.8, -1.1]], [[80.4, 1.6, 3.0], [80.4, 0.8, -1.1]]],
  [E.kalayavana3 - 0.05, E.but - 0.05, G, [[81.2, 1.9, 4.6], [81.0, 1.0, -0.4]], [[81.2, 1.9, 4.2], [81.0, 1.0, -0.4]]],
  [E.but - 0.05, E.whoever - 0.05, G, [[79.7, 1.3, 1.5], [80.2, 0.85, -1.1]], [[79.7, 1.3, 1.25], [80.2, 0.85, -1.1]]],
  [E.whoever - 0.05, E.wait - 0.05, G, [[79.4, 1.4, 1.8], [80.2, 0.9, -1.1]], [[79.5, 1.35, 1.5], [80.2, 0.9, -1.1]]],
  [E.wait - 0.05, E.muchukunda2 - 0.05, G, [[81.6, 2.2, 3.0], [81.5, 2.0, -0.35]], [[81.6, 2.2, 2.7], [81.5, 2.0, -0.35]]],
  [E.muchukunda2 - 0.05, E.and4 - 0.05, G, [[79.4, 1.6, 2.6], [80.6, 1.2, -0.4]], [[79.5, 1.6, 2.3], [80.6, 1.2, -0.4]]],
  [E.and4 - 0.05, E.krishna4 - 0.05, G, [[80.8, 1.8, 4.6], [80.8, 0.9, 0]], [[80.8, 1.7, 4.2], [80.8, 0.9, 0]]],
  [E.krishna4 - 0.05, E.thats - 0.05, G, [[81.4, 1.7, 4.0], [81.4, 1.4, 1.2]], [[81.4, 1.7, 3.6], [81.4, 1.4, 1.2]]],
  [E.thats - 0.05, E.comment - 0.05, G, [[80.9, 1.8, 5.4], [80.9, 1.1, -0.4]], [[80.9, 1.7, 4.8], [80.9, 1.1, -0.4]]],
  [E.comment - 0.05, DURATION + 0.1, G, [[80.9, 2.0, 5.8], [80.9, 1.3, -0.4]], [[80.9, 2.0, 5.5], [80.9, 1.3, -0.4]]],
];
direct({ stage, WORDS, DURATION, shots: SHOTS, update, title: E.the - 0.05, q: [E.wait, E.muchukunda2], cta: E.comment,
  key: ['krishna', 'ranchhod', 'ran', 'battle', 'story', 'kalayavana', 'mathura', 'boon', 'weapon', 'strange', 'laughed', 'chased', 'city', 'hills', 'cave', 'sleeping', 'kicked', 'muchukunda', 'burn', 'wait', 'eyes', 'ashes', 'plan', 'lovingly', 'comment'],
  loc: (t) => (t >= E.as - 0.05 && t < E.a - 0.05 ? '📍 MATHURA · LONG AGO' : t >= E.inside - 0.05 && t < E.kalayavana3 - 0.05 ? 'INSIDE THE CAVE' : ''), shakes: [E.kicked], tick: () => {} });
