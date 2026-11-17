// Day 58 · "Why do girls pray to Krishna and Rukmini for a life partner?" · Why we do what we do #40 (Rukmini's letter)
// KB brief: emotion = longing → joy · lever = fear (a forced wedding) → love · odd detail: the letter is tied with a peacock feather.
// Sets: Rukmini's room at night (origin), the road to Dwarka (x = 40), the wedding square + Ambika temple (x = 80), an altar today (x = 120).
import * as THREE from './three.module.js';
import { rng, mat, mesh, sm, seg, lerp, clamp, setupScene, makeCast, pose, lamp, roundTree, hut } from './kit.js';
import { makeStage, direct, wordTime } from './director.js';
import { addOutlines, makeConfetti } from './plus.js';
import { WORDS, DURATION } from './data.js';

const stage = makeStage(), { scene, camera } = stage, V = (x, y, z) => new THREE.Vector3(x, y, z), R = rng(58);
const S = setupScene(scene, [[0, 0], [40, 0], [80, 0], [120, 0]], 58);
const WT = wordTime(WORDS);
const E = { stay: WT('stay'), as: WT('as'), loved: WT('loved'), but: WT('but'), shishu: WT('shishupala'), so: WT('so'), wrote2: WT('wrote', 2), gave: WT('gave'), ran: WT('ran'), but2: WT('but', 2), walked: WT('walked'), tears: WT('tears'),
  wait: WT('wait'), stepped: WT('stepped'), golden: WT('golden'), reached: WT('reached'), took: WT('took'), thats: WT("that's"), god2: WT('god', 2), comment: WT('comment') };
const glow = (c, o = 0.5) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, depthWrite: false, blending: THREE.AdditiveBlending });
const noOut = (m) => { m.userData.noOutline = true; m.castShadow = false; return m; };
// the letter (rolled, tied with a peacock feather)
function letter(parent) { const g = new THREE.Group(); parent.add(g); noOut(mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.3, 10).rotateZ(Math.PI / 2), mat(0xf6ecd0), 0, 0, 0, g)); noOut(mesh(new THREE.TorusGeometry(0.045, 0.01, 4, 10).rotateY(Math.PI / 2), mat(0xd8263a), 0, 0, 0, g));
  const f = noOut(mesh(new THREE.PlaneGeometry(0.05, 0.22), new THREE.MeshBasicMaterial({ color: 0x2f9a5a, side: THREE.DoubleSide }), 0.02, 0.1, 0.02, g)); f.rotation.z = -0.4; noOut(mesh(new THREE.CircleGeometry(0.03, 10), new THREE.MeshBasicMaterial({ color: 0x2a5ac8, side: THREE.DoubleSide }), 0.06, 0.2, 0.03, g)); return g; }
// ---------------- Rukmini's room at night (origin)
mesh(new THREE.BoxGeometry(12, 0.1, 9), mat(0x8a5a4a), 0, 0.05, 0, scene).castShadow = false; mesh(new THREE.BoxGeometry(12, 6, 0.3), mat(0x3f6a5a), 0, 3, -3.4, scene);
mesh(new THREE.BoxGeometry(1.4, 2.2, 0.1), mat(0x1a2a5a), 2.6, 2.6, -3.2, scene); const moonW = noOut(mesh(new THREE.CircleGeometry(0.3, 20), new THREE.MeshBasicMaterial({ color: 0xfff4c8 }), 2.8, 3.1, -3.12, scene));
mesh(new THREE.BoxGeometry(1.2, 0.4, 0.7), mat(0x8a4b20), 0.4, 0.2, -0.6, scene);
const rlamp = lamp(scene, -0.1, 0.42, -0.7, 0.6);
const parch = noOut(mesh(new THREE.PlaneGeometry(0.42, 0.3).rotateX(-Math.PI / 2), mat(0xf6ecd0), 0.5, 0.42, -0.55, scene));
const L1 = letter(scene);
// ---------------- the road to Dwarka (x = 40)
mesh(new THREE.BoxGeometry(18, 0.06, 18), mat(0x8ad84a), 40, 0.03, -2, scene).castShadow = false; noOut(mesh(new THREE.BoxGeometry(2.4, 0.02, 18), mat(0xd9c08a), 40, 0.07, -2, scene));
for (let i = 0; i < 10; i++) roundTree(scene, 40 + (i % 2 ? 1 : -1) * (3 + (i % 3)), -10 + i * 1.8, R, 1.1);
const GATE = new THREE.Group(); GATE.position.set(40, 0, -9); scene.add(GATE); for (const x of [-1.6, 1.6]) mesh(new THREE.BoxGeometry(0.8, 4.4, 0.8), mat(0xffd23a, { m: 0.5, r: 0.4 }), x, 2.2, 0, GATE); mesh(new THREE.BoxGeometry(4.2, 0.7, 0.9), mat(0xffd23a, { m: 0.5, r: 0.4 }), 0, 4.6, 0, GATE);
const L2 = letter(scene);
// ---------------- the wedding square and Ambika's temple (x = 80)
mesh(new THREE.BoxGeometry(18, 0.06, 16), mat(0xe8d8b8), 80, 0.03, -1, scene).castShadow = false;
const MAN = new THREE.Group(); MAN.position.set(77.4, 0, -2.4); scene.add(MAN); for (const [x, z] of [[-1.2, -1], [1.2, -1], [-1.2, 1], [1.2, 1]]) mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.6, 8), mat(0xd8263a), x, 1.3, z, MAN);
mesh(new THREE.BoxGeometry(2.8, 0.15, 2.4), mat(0xffd23a), 0, 2.65, 0, MAN); for (let i = 0; i < 16; i++) noOut(mesh(new THREE.SphereGeometry(0.09, 6, 4), mat([0xff8a2a, 0xffd23a][i % 2]), -1.3 + i * 0.17, 2.45, 1.15, MAN));
const TEM = new THREE.Group(); TEM.position.set(82.2, 0, -1.6); scene.add(TEM); mesh(new THREE.BoxGeometry(2.2, 0.3, 1.6), mat(0xfaf5ea), 0, 0.15, 0, TEM); mesh(new THREE.BoxGeometry(1.8, 1.9, 1.4), mat(0xf3e2b8), 0, 1.25, -0.1, TEM); mesh(new THREE.ConeGeometry(1.1, 1.6, 4), mat(0xd8263a), 0, 3.0, -0.1, TEM).rotation.y = Math.PI / 4;
noOut(mesh(new THREE.PlaneGeometry(0.7, 1.2), mat(0x2a1a1a), 0, 0.95, 0.61, TEM)); const tLamp = lamp(TEM, 0.7, 0.3, 0.7, 0.5);
const CH = new THREE.Group(); scene.add(CH); const gold = mat(0xffd23a, { m: 0.6, r: 0.35 });
mesh(new THREE.BoxGeometry(1.8, 0.2, 1.3), gold, 0, 0.85, 0, CH); mesh(new THREE.BoxGeometry(0.08, 0.5, 1.3), gold, -0.9, 1.15, 0, CH); mesh(new THREE.ConeGeometry(0.9, 0.7, 8), mat(0xd8263a), 0, 2.7, 0, CH); for (const [x, z] of [[-0.6, -0.5], [0.6, -0.5], [-0.6, 0.5], [0.6, 0.5]]) mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.6, 6), gold, x, 1.75, z, CH);
const cw = [-0.72, 0.72].map((z) => { const w = new THREE.Group(); w.position.set(0, 0.62, z); CH.add(w); mesh(new THREE.TorusGeometry(0.58, 0.06, 6, 20), mat(0x8a5a2a), 0, 0, 0, w); for (let i = 0; i < 6; i++) { const sp = mesh(new THREE.BoxGeometry(0.04, 1.14, 0.04), gold, 0, 0, 0, w); sp.rotation.z = i / 6 * Math.PI; } return w; });
const legs = []; [[-2.3, -0.3], [-2.3, 0.3]].forEach(([x, z]) => { const g = new THREE.Group(); g.position.set(x, 0, z); CH.add(g); const w = mat(0xffffff, { e: 0x5a5a5a, ei: 1 }); mesh(new THREE.BoxGeometry(1.0, 0.42, 0.28), w, 0, 1.0, 0, g); const nk = mesh(new THREE.BoxGeometry(0.2, 0.6, 0.2), w, -0.5, 1.35, 0, g); nk.rotation.z = 0.5; mesh(new THREE.BoxGeometry(0.4, 0.2, 0.2), w, -0.72, 1.62, 0, g); mesh(new THREE.BoxGeometry(0.1, 0.25, 0.3), mat(0x3a2a1a), -0.5, 1.6, 0, g); for (const [dx, dz] of [[-0.36, -0.08], [-0.36, 0.08], [0.36, -0.08], [0.36, 0.08]]) legs.push(mesh(new THREE.BoxGeometry(0.09, 0.8, 0.09).translate(0, -0.4, 0), w, dx, 0.82, dz, g)); });
const dust = []; for (let i = 0; i < 14; i++) dust.push(noOut(mesh(new THREE.SphereGeometry(0.25, 8, 6), new THREE.MeshBasicMaterial({ color: 0xe8d8b0, transparent: true, opacity: 0.4, depthWrite: false }), 0, 0, 0, scene)));
const petals = []; for (let i = 0; i < 26; i++) petals.push({ m: noOut(mesh(new THREE.CircleGeometry(0.06, 6), new THREE.MeshBasicMaterial({ color: i % 2 ? 0xf06aa0 : 0xffd23a, side: THREE.DoubleSide }), 0, 0, 0, scene)), ph: R(), x: R() });
// ---------------- an altar today (x = 120)
const T = new THREE.Group(); T.position.set(120, 0, 0); scene.add(T);
mesh(new THREE.BoxGeometry(12, 0.1, 9), mat(0xf3e6c8), 0, 0.05, 0, T).castShadow = false; mesh(new THREE.BoxGeometry(12, 8, 0.3), mat(0xf06aa0), 0, 4, -3, T);
mesh(new THREE.BoxGeometry(3.0, 1.0, 1.3), mat(0x8a4b20), 0, 0.5, -2.2, T); mesh(new THREE.BoxGeometry(3.1, 0.08, 1.4), mat(0xffd23a), 0, 1.02, -2.2, T);
for (let i = 0; i < 24; i++) { const a = i / 23 * Math.PI; noOut(mesh(new THREE.SphereGeometry(0.1, 6, 4), mat([0xffd23a, 0xffffff, 0xf06aa0][i % 3]), Math.cos(a) * 1.4, 1.9 + Math.sin(a) * 1.6, -2.6, T)); }
const tl = [lamp(T, -1.2, 1.06, -1.8, 0.6), lamp(T, 1.2, 1.06, -1.8, 0.6)];
// ---------------- the cast
const C = makeCast(scene, [['ru', 'rukmini'], ['br', 'brahmin'], ['kd', 'krishna'], ['sh', 'shishupala'], ['rb', 'king'], ['g1', 'courtier'], ['k', 'krishna'], ['ak', 'krishna'], ['ar', 'rukmini'], ['d1', 'gopi3'], ['d2', 'kid2']]);
addOutlines(scene);
const confetti = makeConfetti(scene, 50, 58);
const right = new THREE.Vector3();

function update(s, t) {
  const cx = camera.position.x, set = cx > 100 ? 120 : cx > 60 ? 80 : cx > 20 ? 40 : 0, hook = s < E.as, ending = s >= E.comment;
  const night = set === 0 ? 0.75 : 0;
  S.mood(night); S.hemi.intensity = 1.35 - night * 0.5; S.sun.target.position.set(set, 0, 0); S.sun.position.set(set - 8, 14, 10); S.sun.target.updateMatrixWorld();
  right.setFromMatrixColumn(camera.matrixWorld, 0); right.y = 0; right.normalize();
  rlamp.flame.scale.y = 1 + 0.15 * Math.sin(t * 11);
  // --- Rukmini writes the letter
  const writing = s >= E.so && s < E.gave;
  pose(C.ru, camera, { visible: set === 0, x: 0.55, z: -0.1, h: 1.62, sitting: true, mood: s >= E.but && s < E.wrote2 ? 'sad' : writing ? 'closed' : 'happy', arm: writing ? 'offer' : s >= E.gave ? 'offer' : 'down' });
  pose(C.br, camera, { visible: (set === 0 && s >= E.gave - 0.3) || set === 40, x: set === 40 ? 40.3 : 1.5, z: set === 40 ? lerp(4, -6, sm(seg(s, E.ran, E.but2))) : 0.3, h: 1.6, mood: 'normal', arm: 'offer', flip: set === 0, step: set === 40 ? s * 5 : 0 });
  L1.visible = set === 0 && s >= E.so; L1.position.copy(s >= E.gave ? V(1.05, 1.0, 0.35) : V(0.55, 0.47, -0.45)); L1.quaternion.copy(camera.quaternion);
  // --- the road: the brahmin runs; Krishna at the gate reads it
  L2.visible = set === 40; const bz = lerp(4, -6, sm(seg(s, E.ran, E.but2))); L2.position.set(40.3, 0, bz).add(right.clone().multiplyScalar(0.42)).add(V(0, 1.0, 0.04)); L2.quaternion.copy(camera.quaternion);
  pose(C.kd, camera, { visible: set === 40, x: 39.6, z: -7.6, h: 1.74, mood: 'happy', arm: 'down' });
  // --- the wedding square: the groom waits; Rukmini walks to Ambika's temple in tears; the golden chariot thunders in
  pose(C.sh, camera, { visible: set === 80 && !hook && s < E.golden, x: 77.4, z: -2.0, h: 1.76, mood: 'smug', arm: 'hips' });
  pose(C.rb, camera, { visible: set === 80 && !hook && s < E.golden, x: 76.2, z: -1.2, h: 1.72, mood: 'smug', arm: 'point' });
  pose(C.g1, camera, { visible: set === 80 && !hook && s < E.golden, x: 78.6, z: -1.0, h: 1.66, mood: 'normal', arm: 'down', flip: true });
  tLamp.flame.scale.y = 1 + 0.15 * Math.sin(t * 13);
  const walk = sm(seg(s, E.walked - 0.2, E.wait)), took = hook || s >= E.took;
  const rp = took ? CH.position.clone().add(V(0.35, 0.95, 0.2)) : V(lerp(79.2, 81.9, walk), s >= E.stepped ? 0.3 : 0, lerp(0.6, -0.4, walk) + (s >= E.stepped ? 0.4 : 0));
  pose(C.ar, camera, { visible: set === 80 && (s >= E.walked - 0.3 || hook), x: rp.x, y: rp.y, z: rp.z, h: 1.62, mood: s >= E.golden || hook ? 'happy' : 'sad', arm: s >= E.reached || hook ? 'offer' : 'down', flip: true, step: walk > 0 && walk < 1 ? s * 3 : 0 });
  const arrive = hook ? 1 : sm(seg(s, E.golden - 0.4, E.reached));
  CH.visible = set === 80 && (hook || s >= E.golden - 0.4); CH.position.set(lerp(72, 80.6, arrive), 0, 1.4); cw.forEach((w) => (w.rotation.z = -CH.position.x * 1.6));
  const gallop = hook || (arrive > 0 && arrive < 1); legs.forEach((l, i) => (l.rotation.z = gallop ? Math.sin(t * 12 + i) * 0.4 : 0));
  pose(C.k, camera, { visible: CH.visible, x: CH.position.x + 0.2, y: 0.95, z: CH.position.z + 0.1, h: 1.74, mood: 'happy', arm: s >= E.reached - 0.3 || hook ? 'offer' : 'up' });
  dust.forEach((d, i) => { const u = (t * 0.9 + i / 14) % 1; d.visible = CH.visible && gallop; d.position.set(CH.position.x + 1.0 + u * 2, 0.2 + u * 0.8, 1.4 + Math.sin(i * 2.3) * 0.8); d.scale.setScalar(0.6 + u * 1.4); d.material.opacity = 0.4 * (1 - u); });
  petals.forEach(({ m, ph, x }) => { const u = (t * 0.25 + ph) % 1; m.visible = set === 80 && took && !hook; m.position.set(78.5 + x * 4, 4 - u * 3.6, -0.5 + Math.sin(ph * 7) * 1.5); m.rotation.set(t + ph * 6, t * 0.7, 0); });
  // --- today
  pose(C.ak, camera, { visible: set === 120, x: 120.4, y: 1.06, z: -2.3, h: 1.55, mood: 'happy', flute: true });
  pose(C.d1, camera, { visible: set === 120, x: 119.6, y: 1.06, z: -2.3, h: 1.45, mood: 'happy', flip: true });
  C.d1.spec = C.ar.spec;
  tl.forEach((l, i) => (l.flame.scale.y = 1 + 0.15 * Math.sin(t * 13 + i)));
  pose(C.d2, camera, { visible: set === 120, x: 120.0, z: 0.9, h: 1.55, mood: s >= E.god2 ? 'happy' : 'closed', arm: ending ? 'up' : 'fold', namaste: !ending });
  confetti(E.comment, s, V(120, 3, -1));
  S.clouds.forEach((c, i) => { c.visible = night < 0.5; c.position.x = -80 + i * 15 + ((t * 0.6 + i * 3) % 12); });
}

const G = (t) => t;
const HOOK = [[82.2, 1.4, 5.0], [80.9, 1.5, 1.2]];
const SHOTS = [
  [0, E.stay - 0.05, G, HOOK, HOOK, [62, 38], { move: 'dolly' }],
  [E.stay - 0.05, E.as - 0.05, G, [[0.9, 1.0, 1.4], [0.6, 0.55, -0.5]], [[0.85, 0.95, 1.2], [0.6, 0.5, -0.5]]],
  [E.as - 0.05, E.but - 0.05, G, [[0.4, 2.6, 5.6], [0.4, 1.2, -1.2]], [[0.5, 1.5, 3.0], [0.55, 1.0, -0.2]], 50, { move: 'pull' }],
  [E.but - 0.05, E.so - 0.05, G, [[77.0, 1.8, 3.6], [77.0, 1.4, -1.6]], [[77.0, 1.8, 3.2], [77.0, 1.4, -1.6]]],
  [E.so - 0.05, E.gave - 0.05, G, [[0.7, 1.3, 1.6], [0.55, 0.85, -0.2]], [[0.7, 1.25, 1.4], [0.55, 0.8, -0.3]], [62, 40], { move: 'dolly' }],
  [E.gave - 0.05, E.ran - 0.05, G, [[1.0, 1.4, 3.0], [1.0, 1.0, 0]], [[1.0, 1.4, 2.7], [1.0, 1.0, 0]]],
  [E.ran - 0.05, E.but2 - 0.05, G, [[41.6, 1.6, 7.0], [40.3, 1.1, 2]], [[41.2, 2.2, 1.0], [40, 2.4, -9]], 50, { move: 'pull' }],
  [E.but2 - 0.05, E.walked - 0.05, G, [[78, 3.2, 8], [78.4, 1.4, -1.5]], [[78, 2.6, 6.4], [78.4, 1.4, -1.5]]],
  [E.walked - 0.05, E.wait - 0.05, G, [[80.6, 1.5, 3.4], [80.6, 1.3, 0.2]], [[81.6, 1.5, 3.2], [81.6, 1.3, -0.2]]],
  [E.wait - 0.05, E.golden - 0.05, G, [[82.0, 1.6, 1.8], [81.9, 1.45, 0]], [[82.0, 1.6, 1.6], [81.9, 1.45, 0]]],
  [E.golden - 0.05, E.reached - 0.05, G, [[83.5, 1.4, 6.4], [77, 1.4, 1.4]], [[83.0, 1.6, 6.0], [80.4, 1.4, 1.4]]],
  [E.reached - 0.05, E.thats - 0.05, G, HOOK, [[82.0, 1.6, 4.4], [80.9, 1.5, 1.2]], [62, 40], { move: 'land' }],
  [E.thats - 0.05, E.god2 - 0.05, G, [[120, 3.0, 8.0], [120, 1.8, -2]], [[120, 2.3, 4.8], [120, 1.7, -1.6]], 50, { move: 'land' }],
  [E.god2 - 0.05, E.comment - 0.05, G, [[120.3, 1.7, 4.6], [120, 1.4, 0]], [[120.3, 1.7, 4.2], [120, 1.4, 0]]],
  [E.comment - 0.05, DURATION + 0.1, G, [[120, 2.2, 5.6], [120, 1.5, -1.5]], [[120, 2.2, 5.1], [120, 1.5, -1.5]]],
];
direct({ stage, WORDS, DURATION, shots: SHOTS, update, title: 1.4, q: [E.wait, E.stepped], cta: E.comment, prog: [E.but, E.thats], pin: E.wait,
  key: ['princess', 'secret', 'letter', 'god,', 'forced', 'reply', 'rukmini', 'loved', 'krishna', 'shishupala', 'cruel', 'life.', 'brahmin', 'dwarka', 'ambika', 'tears', 'wait', 'late?', 'golden', 'chariot', 'hand', 'partner', 'heart', 'comment', 'send'],
  loc: (t) => (t >= E.as - 0.05 && t < E.but ? '📍 VIDARBHA · THE NIGHT BEFORE' : t >= E.ran - 0.05 && t < E.but2 ? '📍 THE ROAD TO DWARKA' : t >= E.thats - 0.05 && t < E.god2 ? 'EVEN TODAY' : ''), shakes: [E.golden + 0.3], tick: () => {} });
