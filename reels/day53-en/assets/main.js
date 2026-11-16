// Day 53 · "Why is Karna called Daanveer?" · Why we do what we do #35 (as the story goes: Karna's gold tooth)
// Strategy 10: mid-action hook (dying Karna strikes his tooth with a stone) + lock-in, "But…" re-hook, "Wait…?" re-hook, loop to the hook.
// Sets: the battlefield at dusk (origin), Karna's court of giving (x = 40), a temple hundi today (x = 80).
import * as THREE from './three.module.js';
import { rng, mat, mesh, sm, seg, lerp, clamp, setupScene, makeCast, pose, lamp } from './kit.js';
import { makeStage, direct, wordTime } from './director.js';
import { addOutlines, makeConfetti } from './plus.js';
import { WORDS, DURATION } from './data.js';

const stage = makeStage(), { scene, camera } = stage, V = (x, y, z) => new THREE.Vector3(x, y, z), R = rng(53);
const S = setupScene(scene, [[0, 0], [40, 0], [80, 0]], 53);
const WT = wordTime(WORDS);
const E = { stay: WT('stay'), as: WT('as'), karna: WT('karna'), last: WT('last'), but: WT('but'), brahmin: WT('brahmin'), gold2: WT('gold', 2), karna2: WT('karna', 2), broke2: WT('broke', 2), offered: WT('offered'),
  smile: WT('smile'), wait: WT('wait'), krishna: WT('krishna'), blessed: WT('blessed'), thats: WT("that's"), giving: WT('giving'), comment: WT('comment') };
const glow = (c, o = 0.5) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, depthWrite: false, blending: THREE.AdditiveBlending });
const noOut = (m) => { m.userData.noOutline = true; m.castShadow = false; return m; };

// ---------------- the battlefield at dusk (origin)
mesh(new THREE.CylinderGeometry(22, 22, 0.06, 28), mat(0xb08a5a), 0, 0.03, 0, scene).castShadow = false;
const CH = new THREE.Group(); CH.position.set(0.6, 0, -1.7); CH.rotation.z = 0.12; scene.add(CH); const gold = mat(0xffd23a, { m: 0.6, r: 0.35 });
mesh(new THREE.BoxGeometry(2.0, 0.2, 1.3), gold, 0, 0.75, 0, CH); mesh(new THREE.BoxGeometry(2.0, 0.6, 0.08), gold, 0, 1.1, 0.62, CH);
const sunk = new THREE.Group(); sunk.position.set(-0.6, 0.35, 0.75); CH.add(sunk); mesh(new THREE.TorusGeometry(0.58, 0.07, 6, 20), mat(0x8a5a2a), 0, 0, 0, sunk); for (let i = 0; i < 6; i++) { const sp = mesh(new THREE.BoxGeometry(0.05, 1.14, 0.05), gold, 0, 0, 0, sunk); sp.rotation.z = i / 6 * Math.PI; }
mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.4, 6), mat(0x8a5a2a), 0.7, 2.0, -0.4, CH); noOut(mesh(new THREE.PlaneGeometry(0.6, 0.4), new THREE.MeshStandardMaterial({ color: 0xffd23a, side: THREE.DoubleSide }), 1.0, 3.0, -0.4, CH));
for (let i = 0; i < 26; i++) { const a = R() * Math.PI * 2, r = 1.8 + R() * 6; const ar = noOut(mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.8, 4), mat(0x6a4a2a), Math.cos(a) * r, 0.3, Math.sin(a) * r - 1, scene)); ar.rotation.set((R() - 0.5) * 0.8, 0, (R() - 0.5) * 0.8); }
for (let i = 0; i < 5; i++) { const sh = mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.08, 12), mat(0x8a8a90, { m: 0.5 }), -3 + i * 1.6 + R(), 0.05, -3 - R() * 3, scene); sh.rotation.x = 0.3; }
const sunDisc = noOut(mesh(new THREE.SphereGeometry(2.2, 20, 14), new THREE.MeshBasicMaterial({ color: 0xff8a3a, fog: false }), -4, 3, -40, scene));
const rock = noOut(mesh(new THREE.DodecahedronGeometry(0.07), mat(0x8a8a90), 0, 0, 0, scene));
const tooth = noOut(mesh(new THREE.OctahedronGeometry(0.045), mat(0xffd23a, { m: 0.8, r: 0.2, e: 0x7a5a00, ei: 0.8 }), 0, 0, 0, scene));
const toothGlow = noOut(mesh(new THREE.SphereGeometry(0.075, 12, 8), glow(0xffe08a, 0.5), 0, 0, 0, scene));
const flash = noOut(mesh(new THREE.SphereGeometry(1, 16, 10), glow(0xfff0c0, 0), 0, 0, 0, scene));
const aura = noOut(mesh(new THREE.RingGeometry(0.5, 0.58, 32), glow(0xffe08a, 0), 0, 0, 0, scene));
// ---------------- Karna's court of giving (x = 40)
mesh(new THREE.BoxGeometry(14, 0.1, 10), mat(0xf3e2b8), 40, 0.05, 0, scene).castShadow = false; mesh(new THREE.BoxGeometry(14, 8, 0.3), mat(0xe8a040), 40, 4, -3.2, scene);
for (let i = 0; i < 3; i++) mesh(new THREE.BoxGeometry(4 - i * 0.6, 0.25, 1.0), mat(0xfaf5ea), 40, 0.12 + i * 0.25, -2.0 + i * 0.4, scene);
for (const x of [36.5, 43.5]) mesh(new THREE.CylinderGeometry(0.3, 0.34, 6, 10), mat(0xfaf5ea), x, 3, -2.4, scene);
const coins = []; for (let i = 0; i < 18; i++) coins.push({ m: noOut(mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.015, 10).rotateX(Math.PI / 2), mat(0xffd23a, { m: 0.7, r: 0.3 }), 0, 0, 0, scene)), ph: R(), tx: [-1.6, 0, 1.6][i % 3] });
// ---------------- a temple hundi today (x = 80)
const T = new THREE.Group(); T.position.set(80, 0, 0); scene.add(T);
mesh(new THREE.BoxGeometry(12, 0.1, 9), mat(0xf3e6c8), 0, 0.05, 0, T).castShadow = false; mesh(new THREE.BoxGeometry(12, 8, 0.3), mat(0xd86aa0), 0, 4, -3, T);
mesh(new THREE.BoxGeometry(3.0, 1.0, 1.3), mat(0x8a4b20), 0, 0.5, -2.2, T); mesh(new THREE.BoxGeometry(3.1, 0.08, 1.4), mat(0xffd23a), 0, 1.02, -2.2, T);
for (let i = 0; i < 24; i++) { const a = i / 23 * Math.PI; noOut(mesh(new THREE.SphereGeometry(0.1, 6, 4), mat([0xffd23a, 0xffffff, 0xf06aa0][i % 3]), Math.cos(a) * 1.3, 1.9 + Math.sin(a) * 1.5, -2.6, T)); }
const tl = [lamp(T, -1.2, 1.06, -1.8, 0.6), lamp(T, 1.2, 1.06, -1.8, 0.6)];
mesh(new THREE.BoxGeometry(0.8, 0.9, 0.6), mat(0xc9a227, { m: 0.5, r: 0.4 }), 0.2, 0.45, 0.2, T); mesh(new THREE.BoxGeometry(0.3, 0.02, 0.06), mat(0x1d1a24), 0.2, 0.91, 0.2, T);
const tcoin = noOut(mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.012, 10).rotateX(Math.PI / 2), mat(0xffd23a, { m: 0.7, r: 0.3 }), 0, 0, 0, scene));
// ---------------- the cast
const C = makeCast(scene, [['ka', 'karna'], ['br', 'brahmin'], ['k', 'krishna'], ['kc', 'karna'], ['p1', 'gopi1'], ['p2', 'sudama'], ['p3', 'kid2'], ['tk', 'krishna'], ['d1', 'kid1'], ['d2', 'gopi3']]);
addOutlines(scene);
const confetti = makeConfetti(scene, 50, 53);
const right = new THREE.Vector3();

function update(s, t) {
  const cx = camera.position.x, set = cx > 60 ? 80 : cx > 20 ? 40 : 0, hook = s < E.as, ending = s >= E.comment, loopK = hook || ending;
  const dusk = set === 0;
  S.mood(dusk ? 0.35 : 0); S.hemi.intensity = dusk ? 1.1 : 1.35; S.sun.target.position.set(set, 0, 0); S.sun.position.set(set - 8, 10, 10); S.sun.target.updateMatrixWorld();
  if (dusk) { S.paintSky(new THREE.Color(0x4a3a8a), new THREE.Color(0xff8a40)); S.sun.color.set(0xffa070); }
  sunDisc.visible = dusk;
  right.setFromMatrixColumn(camera.matrixWorld, 0); right.y = 0; right.normalize();
  // --- Karna, dying against his chariot
  const striking = loopK || (s >= E.broke2 - 0.3 && s < E.offered), hasGap = loopK || s >= E.broke2 + 0.6;
  const kp = V(0, 0, 0);
  pose(C.ka, camera, { visible: set === 0 && (loopK || s >= E.last - 0.3), x: kp.x, z: kp.z, h: 1.7, sitting: true, mood: s >= E.smile - 0.4 || s >= E.krishna ? 'happy' : striking ? 'closed' : s >= E.brahmin ? 'normal' : 'sad', arm: striking ? 'up' : s >= E.offered && s < E.krishna + 0.6 ? 'offer' : 'down', gap: hasGap, bleed: true });
  const face = kp.clone().add(V(0, 1.7 * 0.62, 0.06));
  rock.visible = set === 0 && striking; rock.position.copy(face).add(right.clone().multiplyScalar(0.18 + Math.abs(Math.sin(t * 9)) * 0.08)).add(V(0, -0.02, 0.05));
  // the gold tooth: in his palm, then floats to the brahmin
  const give = sm(seg(s, E.smile, E.wait)), hand = kp.clone().add(right.clone().multiplyScalar(0.62)).add(V(0, 0.82, 0.06)), recv = V(1.6, 0.95, 0.68);
  tooth.visible = toothGlow.visible = set === 0 && (s >= E.offered - 0.2 && s < E.thats || loopK);
  const tp = loopK ? face.clone().add(right.clone().multiplyScalar(0.05)) : hand.clone().lerp(recv, give).add(V(0, Math.sin(give * Math.PI) * 0.3, 0));
  tooth.position.copy(tp); tooth.rotation.y = t * 3; toothGlow.position.copy(tp); toothGlow.material.opacity = 0.22 + 0.1 * Math.sin(t * 6);
  // --- the old brahmin walks up; he is Krishna
  const walk = sm(seg(s, E.but, E.gold2)), revealed = s >= E.krishna && !loopK;
  const bp = V(lerp(5.0, 1.6, walk), 0, 0.6);
  pose(C.br, camera, { visible: set === 0 && ((s >= E.but - 0.1 && !revealed) || hook), x: hook ? 1.6 : bp.x, z: 0.6, h: 1.62, mood: s >= E.smile ? 'happy' : 'normal', arm: s >= E.brahmin + 0.4 && s < E.smile ? 'offer' : 'down', flip: true, step: walk > 0 && walk < 1 ? s * 2 : 0 });
  pose(C.k, camera, { visible: set === 0 && revealed, x: 1.6, z: 0.6, h: 1.75, mood: 'happy', arm: s >= E.blessed - 0.2 ? 'offer' : 'up', flip: true });
  const fu = s - E.krishna; flash.visible = set === 0 && fu > 0 && fu < 0.6; flash.position.set(1.6, 1.0, 0.7); flash.scale.setScalar(0.5 + fu * 2.5); flash.material.opacity = 0.6 * (1 - fu / 0.6);
  aura.visible = set === 0 && revealed; aura.position.set(1.6, 1.45, 0.55); aura.quaternion.copy(camera.quaternion); aura.material.opacity = 0.4 + 0.1 * Math.sin(t * 3);
  // --- the court of giving: coins fly to the people
  pose(C.kc, camera, { visible: set === 40, x: 40, y: 0.75, z: -1.2, h: 1.75, mood: 'happy', arm: 'offer' });
  [['p1', -1.6, 1.0, 1.6], ['p2', 0.2, 1.4, 1.62], ['p3', 1.6, 1.0, 1.1]].forEach(([n, x, z, h]) => pose(C[n], camera, { visible: set === 40, x: 40 + x, z, h, mood: 'happy', arm: 'up', flip: x > 0 }));
  coins.forEach(({ m, ph, tx }) => { const u = (t * 0.8 + ph) % 1; m.visible = set === 40; m.position.set(40 + lerp(0.3, tx, u), 1.9 + Math.sin(u * Math.PI) * 0.8 - u * 0.4, lerp(-1.1, 1.0, u)); m.rotation.y = t * 6 + ph; });
  // --- today: dropping a coin in the hundi
  pose(C.tk, camera, { visible: set === 80, x: 80, y: 1.06, z: -2.3, h: 1.55, mood: 'happy', flute: true });
  tl.forEach((l, i) => (l.flame.scale.y = 1 + 0.15 * Math.sin(t * 13 + i)));
  pose(C.d1, camera, { visible: set === 80, x: 80.85, z: 0.55, h: 1.1, mood: 'happy', arm: 'offer', flip: true });
  pose(C.d2, camera, { visible: set === 80, x: 79.0, z: 0.8, h: 1.6, mood: 'happy', arm: 'down' });
  const cu = ((s - E.thats) * 0.8) % 1; tcoin.visible = set === 80; tcoin.position.set(80.45 - cu * 0.25, 1.25 - cu * cu * 0.4, 0.3);
  confetti(E.comment, s, V(0.8, 3, 0.4));
  S.clouds.forEach((c, i) => { c.position.x = -80 + i * 15 + ((t * 0.6 + i * 3) % 12); });
}

const G = (t) => t;
const HOOK = [[0.45, 1.3, 3.2], [0.15, 1.1, 0]];
const SHOTS = [
  [0, E.stay - 0.05, G, HOOK, HOOK, [62, 34], { move: 'dolly' }],
  [E.stay - 0.05, E.as - 0.05, G, [[1.8, 1.4, 3.0], [1.6, 1.3, 0.6]], [[1.75, 1.4, 2.6], [1.6, 1.3, 0.6]]],
  [E.as - 0.05, E.karna - 0.05, G, [[0, 6, 14], [0, 0.6, -2]], [[0.4, 2.6, 7.6], [0.3, 0.9, -0.5]], 50, { move: 'pull' }],
  [E.karna - 0.05, E.last - 0.05, G, [[40, 2.0, 6.0], [40, 1.5, -0.6]], [[40, 2.0, 5.2], [40, 1.6, -0.8]]],
  [E.last - 0.05, E.but - 0.05, G, [[0.3, 2.8, 5.0], [0.1, 0.8, 0]], [[0.3, 1.4, 3.4], [0.1, 0.9, 0]], 50, { move: 'crane', lift: 0.6 }],
  [E.but - 0.05, E.karna2 - 0.05, G, [[2.0, 1.5, 5.6], [1.4, 1.0, 0.2]], [[1.6, 1.4, 5.0], [1.0, 1.0, 0.2]]],
  [E.karna2 - 0.05, E.offered - 0.05, G, [[0.35, 1.3, 2.4], [0.1, 1.08, 0]], [[0.3, 1.25, 2.1], [0.1, 1.08, 0]]],
  [E.offered - 0.05, E.wait - 0.05, G, [[0.9, 1.35, 3.6], [0.8, 1.0, 0.3]], [[0.9, 1.35, 3.3], [0.8, 1.0, 0.3]]],
  [E.wait - 0.05, E.krishna - 0.05, G, [[1.75, 1.45, 2.9], [1.6, 1.35, 0.6]], [[1.72, 1.45, 2.6], [1.6, 1.35, 0.6]]],
  [E.krishna - 0.05, E.thats - 0.05, G, [[1.4, 1.5, 3.4], [1.5, 1.35, 0.6]], [[1.4, 1.5, 3.4], [1.5, 1.35, 0.6]], [62, 40], { move: 'dolly' }],
  [E.thats - 0.05, E.giving - 0.05, G, [[80, 3.0, 8.0], [80, 1.6, -1.6]], [[80, 2.0, 4.4], [80, 1.2, -0.6]], 50, { move: 'land' }],
  [E.giving - 0.05, E.comment - 0.05, G, [[80.9, 1.7, 3.4], [80.5, 1.05, 0.3]], [[80.9, 1.7, 3.1], [80.5, 1.05, 0.3]]],
  [E.comment - 0.05, DURATION + 0.1, G, [[0.6, 1.4, 3.8], [0.15, 1.1, 0]], HOOK],
];
direct({ stage, WORDS, DURATION, shots: SHOTS, update, title: 1.4, q: [E.wait, E.krishna], cta: E.comment, prog: [E.but, E.thats], pin: E.wait,
  key: ['dying', 'warrior', 'gold', 'tooth', 'surprise', 'karna', 'never', 'no', 'last', 'battlefield', 'brahmin', 'nothing', 'stone', 'smile', 'wait', 'krishna', 'blessed', 'forever', 'daanveer', 'costs', 'comment', 'send', 'generous'],
  loc: (t) => (t >= E.as - 0.05 && t < E.karna ? '📍 KURUKSHETRA · DAY 17' : t >= E.thats - 0.05 && t < E.giving ? 'EVEN TODAY' : ''), shakes: [E.broke2 + 0.4], tick: () => {} });
