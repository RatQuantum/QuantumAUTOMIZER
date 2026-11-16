// Day 55 · "Why does Hanuman sit on Arjuna's flag?" · Why we do what we do #37 (as the story goes: the bridge of arrows)
// Strategy 10: mid-action hook (the arrow bridge cracking under the monkey) + lock-in, "But…" re-hook, "Wait…?" re-hook, loop to the hook.
// Sets: the seashore with the arrow bridge (origin), Arjuna's chariot and its flag (x = 40).
import * as THREE from './three.module.js';
import { rng, mat, mesh, sm, seg, lerp, clamp, setupScene, makeCast, pose, roundTree } from './kit.js';
import { makeStage, direct, wordTime } from './director.js';
import { addOutlines, makeConfetti } from './plus.js';
import { WORDS, DURATION } from './data.js';

const stage = makeStage(), { scene, camera } = stage, V = (x, y, z) => new THREE.Vector3(x, y, z), R = rng(55);
const S = setupScene(scene, [[0, 0], [40, 0]], 55);
const WT = wordTime(WORDS);
const E = { stay: WT('stay'), as: WT('as'), arjuna: WT('arjuna', 2), laughed: WT('laughed'), but: WT('but'), a3: WT('arjuna', 3), stepped: WT('stepped'), cracked: WT('cracked'), wait: WT('wait'), krishna: WT('krishna'),
  tortoise: WT('tortoise'), time: WT('time'), hanuman: WT('hanuman'), bowed: WT('bowed'), thats: WT("that's"), pride: WT('pride'), comment: WT('comment') };
const glow = (c, o = 0.5) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, depthWrite: false, blending: THREE.AdditiveBlending });
const noOut = (m) => { m.userData.noOutline = true; m.castShadow = false; return m; };

// ---------------- the seashore (origin): sand on the left, the sea to the right, the arrow bridge across
mesh(new THREE.BoxGeometry(14, 0.3, 16), mat(0xe8d09a), -8.2, 0.0, -2, scene).castShadow = false;
const sea = noOut(mesh(new THREE.PlaneGeometry(40, 30, 40, 30).rotateX(-Math.PI / 2), mat(0x2f7ac8, { r: 0.15, m: 0.2 }), 17, 0.2, -2, scene)); const sb = sea.geometry.attributes.position.array.slice();
for (let i = 0; i < 5; i++) roundTree(scene, -6 - i * 1.4, -6 - (i % 2) * 2, R, 1.1);
for (let i = 0; i < 6; i++) { const st = mesh(new THREE.DodecahedronGeometry(0.35 + R() * 0.2), mat(0x9a9aa0), 6 + i * 2.2, 0.05, -5 - R() * 2, scene); st.rotation.set(R(), R(), R()); }
for (const x of [-1.3, 8.6]) mesh(new THREE.BoxGeometry(0.3, 0.9, 1.3), mat(0x8a6a3a), x, 0.2, 0, scene);
const N = 50, BR = []; for (let i = 0; i < N; i++) { const a = noOut(mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.25, 5).rotateX(Math.PI / 2), mat(i % 2 ? 0x8a5a2a : 0x9a6a3a), 0, 0, 0, scene)); a.castShadow = true; BR.push({ a, x: -1.2 + i * 0.195 }); }
const splash = []; for (let i = 0; i < 16; i++) splash.push(noOut(mesh(new THREE.SphereGeometry(0.06, 6, 4), mat(0xcfe8ff), 0, 0, 0, scene)));
// the tortoise rising under the bridge
const TT = new THREE.Group(); scene.add(TT);
mesh(new THREE.SphereGeometry(1.4, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2).scale(1.4, 0.55, 1.0), mat(0x5a8a3a), 0, 0, 0, TT);
for (let i = 0; i < 7; i++) { const a = i / 7 * Math.PI * 2; noOut(mesh(new THREE.CircleGeometry(0.3, 6).rotateX(-Math.PI / 2), mat(0x8ab04a), Math.cos(a) * 0.9, 0.62, Math.sin(a) * 0.6, TT)); }
mesh(new THREE.SphereGeometry(0.35, 10, 8), mat(0x7aa04a), -2.1, 0.1, 0, TT); for (const z of [-0.12, 0.12]) noOut(mesh(new THREE.SphereGeometry(0.05, 6, 4), mat(0x1d1a24), -2.35, 0.2, z, TT));
const ttGlow = noOut(mesh(new THREE.RingGeometry(1.6, 1.9, 40).rotateX(-Math.PI / 2), glow(0xbfe8ff, 0), 0, 0.05, 0, scene));
const flash = noOut(mesh(new THREE.SphereGeometry(1, 16, 10), glow(0xfff0c0, 0), 0, 0, 0, scene));
const aura = noOut(mesh(new THREE.RingGeometry(0.46, 0.52, 32), glow(0xffe08a, 0), 0, 0, 0, scene));
// ---------------- Arjuna's chariot and flag (x = 40)
mesh(new THREE.CylinderGeometry(16, 16, 0.06, 24), mat(0xc9a46a), 40, 0.03, 0, scene).castShadow = false;
const CA = new THREE.Group(); CA.position.set(40, 0, -0.6); scene.add(CA); const gold = mat(0xffd23a, { m: 0.6, r: 0.35 });
mesh(new THREE.BoxGeometry(2.0, 0.2, 1.3), gold, 0, 0.85, 0, CA); mesh(new THREE.BoxGeometry(0.08, 0.5, 1.3), gold, 1.0, 1.15, 0, CA);
for (const z of [-0.72, 0.72]) { const w = new THREE.Group(); w.position.set(-0.1, 0.62, z); CA.add(w); mesh(new THREE.TorusGeometry(0.58, 0.06, 6, 20), mat(0x8a5a2a), 0, 0, 0, w); for (let i = 0; i < 6; i++) { const sp = mesh(new THREE.BoxGeometry(0.04, 1.14, 0.04), gold, 0, 0, 0, w); sp.rotation.z = i / 6 * Math.PI; } }
mesh(new THREE.CylinderGeometry(0.05, 0.05, 3.6, 6), mat(0x8a5a2a), -0.6, 2.6, -0.4, CA);
const flagCloth = noOut(mesh(new THREE.PlaneGeometry(1.0, 0.7, 8, 2).translate(0.5, 0, 0), new THREE.MeshStandardMaterial({ color: 0xffa020, side: THREE.DoubleSide, flatShading: true }), -0.58, 3.9, -0.4, CA)); const fb = flagCloth.geometry.attributes.position.array.slice();
const flagGlow = noOut(mesh(new THREE.RingGeometry(0.5, 0.58, 32), glow(0xffe08a, 0.35), 0, 0, 0, scene));
// ---------------- the cast
const C = makeCast(scene, [['ar', 'arjuna'], ['mk', 'hanuman'], ['k', 'krishna'], ['ar2', 'arjuna'], ['kf', 'krishna'], ['hf', 'hanuman']]);
const hanumanTrue = C.mk.spec, oldMonkey = Object.assign({}, hanumanTrue, { body: '#a8987a', skin: '#a8987a', top: (c, cx, hy) => { for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(cx - 20 + i * 20, hy - 66, 10, Math.PI, 0); c.lineWidth = 6; c.strokeStyle = '#e8e8e8'; c.stroke(); } },
  bodyDeco: (c, cx, y, w, h) => { c.fillStyle = '#8a7a5a'; c.fillRect(cx - w / 2, y + h * 0.6, w, h); } });
addOutlines(scene);
const confetti = makeConfetti(scene, 50, 55);

function update(s, t) {
  const cx = camera.position.x, set = cx > 20 ? 40 : 0, hook = s < E.as, ending = s >= E.comment, loopK = hook || ending;
  S.mood(0); S.hemi.intensity = 1.35; S.sun.target.position.set(set, 0, 0); S.sun.position.set(set - 8, 14, 10); S.sun.target.updateMatrixWorld();
  const sp = sea.geometry.attributes.position; for (let i = 0; i < sp.count; i++) sp.setY(i, 0.0 + Math.sin(sb[i * 3] * 0.9 + t * 1.6) * 0.06 + Math.cos(sb[i * 3 + 2] * 0.8 + t * 1.2) * 0.05); sp.needsUpdate = true;
  // --- the bridge: shot arrow by arrow, cracks under the monkey, then holds on the tortoise
  const built = loopK || s >= E.cracked ? 1 : seg(s, E.a3 + 0.4, E.stepped);
  const crackLoop = loopK ? ((t * 0.6) % 1) : 0, crack = loopK ? sm(clamp(crackLoop * 2)) : sm(seg(s, E.cracked - 0.25, E.cracked + 0.4)) * (1 - sm(seg(s, E.krishna + 0.4, E.tortoise + 0.2)));
  const MX = 1.6;
  BR.forEach(({ a, x }, i) => { a.visible = set === 0 && i < built * N; const d = Math.abs(x - MX), k = crack * clamp(1 - d / 1.4); a.position.set(x, 0.45 - k * 0.5 + (i % 3) * 0.004, k * Math.sin(i * 7) * 0.2); a.rotation.set(k * Math.sin(i * 3) * 0.8, 0, k * (x < MX ? -0.6 : 0.6)); });
  splash.forEach((m, i) => { const u = (t * 1.6 + i / 16) % 1, a = i * 2.4; m.visible = set === 0 && crack > 0.3; m.position.set(MX + Math.cos(a) * u * 0.8, 0.05 + Math.sin(u * Math.PI) * 0.9, Math.sin(a) * u * 0.6); });
  // --- the old monkey (Hanuman in disguise)
  const onBridge = loopK || (s >= E.stepped - 0.2 && s < E.thats), revealed = s >= E.hanuman && !loopK;
  const want = revealed ? hanumanTrue : oldMonkey; if (C.mk.spec !== want) { C.mk.spec = want; C.mk.key = ''; }
  const mp = onBridge ? V(MX, 0.47 - crack * 0.4, 0.05) : V(-1.6, 0.15, 0.6);
  pose(C.mk, camera, { visible: set === 0 && (loopK || s >= E.arjuna - 0.3), x: mp.x, y: mp.y, z: mp.z, h: 1.55, mood: revealed ? 'happy' : s >= E.but && s < E.a3 ? 'smug' : 'normal', arm: revealed && s >= E.bowed ? 'fold' : s >= E.but && s < E.a3 ? 'point' : 'down', namaste: revealed && s >= E.bowed, flip: true });
  if (revealed && s >= E.bowed) C.mk.m.rotateZ(-0.15);
  const fu = s - E.hanuman; flash.visible = set === 0 && fu > 0 && fu < 0.6; flash.position.copy(mp).add(V(0, 0.9, 0.1)); flash.scale.setScalar(0.5 + fu * 2.5); flash.material.opacity = 0.6 * (1 - fu / 0.6);
  // --- Arjuna: proud, shoots the bridge, shocked
  const shooting = s >= E.a3 && s < E.stepped && !loopK;
  pose(C.ar, camera, { visible: set === 0, x: -3.0, y: 0.15, z: 1.0, h: 1.72, mood: loopK || (s >= E.cracked && s < E.time) ? 'wow' : s >= E.laughed && s < E.but ? 'smug' : s >= E.time ? 'happy' : 'normal', bow: true, arm: shooting ? 'offer' : 'down', flip: false });
  // --- Krishna arrives; the tortoise rises under the bridge
  const kOn = s >= E.krishna - 0.2 && !loopK;
  pose(C.k, camera, { visible: set === 0 && kOn, x: -2.0, y: 0.15, z: -0.6, h: 1.74, mood: 'happy', arm: s < E.tortoise + 0.5 ? 'point' : 'offer' });
  aura.visible = set === 0 && kOn; aura.position.set(-2.0, 1.55, -0.65); aura.quaternion.copy(camera.quaternion); aura.material.opacity = 0.35 + 0.1 * Math.sin(t * 3);
  const rise = sm(seg(s, E.krishna + 0.2, E.tortoise + 0.4)); TT.visible = set === 0 && rise > 0 && s < E.thats + 0.5 && !loopK; TT.position.set(MX + 0.6, lerp(-1.2, -0.32, rise), 0); TT.rotation.y = Math.PI;
  ttGlow.visible = TT.visible; ttGlow.position.set(MX + 0.6, 0.06, 0); ttGlow.material.opacity = 0.35 * rise * (0.7 + 0.3 * Math.sin(t * 4));
  // --- Arjuna's chariot: Hanuman on the flag
  pose(C.ar2, camera, { visible: set === 40, x: 40.2, y: 0.95, z: -0.4, h: 1.7, mood: 'happy', bow: true, arm: 'down' });
  pose(C.kf, camera, { visible: set === 40, x: 40.9, y: 0.95, z: -0.2, h: 1.72, mood: 'happy', arm: 'down', flip: true });
  pose(C.hf, camera, { visible: set === 40, x: 39.65, y: 4.25, z: -0.95, h: 0.95, mood: 'happy', arm: 'up', sitting: true });
  const fp = flagCloth.geometry.attributes.position; for (let i = 0; i < fp.count; i++) fp.setZ(i, Math.sin(fb[i * 3] * 6 + t * 5) * 0.08 * fb[i * 3]); fp.needsUpdate = true;
  flagGlow.visible = set === 40; flagGlow.position.set(39.65, 4.7, -0.9); flagGlow.quaternion.copy(camera.quaternion);
  confetti(E.comment, s, V(1.2, 3, 0));
  S.clouds.forEach((c, i) => { c.position.x = -80 + i * 15 + ((t * 0.6 + i * 3) % 12); });
}

const G = (t) => t;
const HOOK = [[0.6, 2.5, 3.8], [1.6, 0.85, 0.0]];
const SHOTS = [
  [0, E.stay - 0.05, G, HOOK, HOOK, [62, 34], { move: 'dolly' }],
  [E.stay - 0.05, E.as - 0.05, G, [[-2.8, 1.65, 3.6], [-3.0, 1.5, 1.0]], [[-2.8, 1.65, 3.3], [-3.0, 1.5, 1.0]]],
  [E.as - 0.05, E.arjuna - 0.05, G, [[2, 5, 13], [2, 0.5, -2]], [[0, 2.4, 8], [-1, 0.8, 0]], 50, { move: 'pull' }],
  [E.arjuna - 0.05, E.laughed - 0.05, G, [[-2.2, 1.5, 5.0], [-2.3, 1.1, 0.8]], [[-2.2, 1.5, 4.6], [-2.3, 1.1, 0.8]]],
  [E.laughed - 0.05, E.but - 0.05, G, [[-2.75, 1.7, 3.4], [-3.0, 1.5, 1.0]], [[-2.75, 1.7, 3.1], [-3.0, 1.5, 1.0]]],
  [E.but - 0.05, E.a3 - 0.05, G, [[-1.4, 1.2, 3.0], [-1.6, 1.2, 0.6]], [[-1.42, 1.2, 2.7], [-1.6, 1.2, 0.6]]],
  [E.a3 - 0.05, E.cracked - 0.05, G, [[0.4, 2.4, 6.0], [2.0, 0.5, 0]], [[1.0, 3.2, 6.6], [2.8, 0.5, 0]], 50, { move: 'crane', lift: 1.0 }],
  [E.cracked - 0.05, E.wait - 0.05, G, HOOK, [[1.5, 1.3, 4.2], [1.5, 0.9, 0.0]]],
  [E.wait - 0.05, E.krishna - 0.05, G, [[-2.8, 1.65, 3.4], [-3.0, 1.5, 1.0]], [[-2.8, 1.65, 3.1], [-3.0, 1.5, 1.0]]],
  [E.krishna - 0.05, E.time - 0.05, G, [[-0.2, 1.4, 7.6], [-0.1, 0.8, -0.2]], [[-0.2, 2.0, 8.6], [-0.1, 0.9, -0.2]], 50, { move: 'pull' }],
  [E.time - 0.05, E.hanuman - 0.05, G, [[1.6, 1.0, 4.4], [1.7, 0.8, 0.0]], [[1.6, 1.2, 4.6], [1.7, 0.9, 0.0]]],
  [E.hanuman - 0.05, E.thats - 0.05, G, [[1.6, 1.4, 3.6], [1.6, 1.2, 0.05]], [[1.6, 1.4, 3.6], [1.6, 1.2, 0.05]], [62, 38], { move: 'dolly' }],
  [E.thats - 0.05, E.pride - 0.05, G, [[40.4, 2.0, 9.0], [40.2, 2.4, -0.6]], [[40.2, 2.6, 6.4], [40.0, 2.6, -0.6]], 50, { move: 'land' }],
  [E.pride - 0.05, E.comment - 0.05, G, [[39.8, 4.2, 3.2], [39.65, 4.6, -0.9]], [[39.8, 4.2, 2.9], [39.65, 4.6, -0.9]]],
  [E.comment - 0.05, DURATION + 0.1, G, [[0.7, 2.6, 4.4], [1.6, 0.85, 0.0]], HOOK],
];
direct({ stage, WORDS, DURATION, shots: SHOTS, update, title: 1.4, q: [E.wait, E.krishna], cta: E.comment, prog: [E.but, E.thats], pin: E.wait,
  key: ['proud', 'bridge', 'broke', 'seconds', 'flag', 'forever', 'arjuna', 'monkey', 'laughed', 'stones', 'arrows', 'breaks', 'lose', 'cracked', 'wait', 'krishna', 'tortoise', 'held', 'hanuman', 'bowed', 'pride', 'faith', 'comment', 'send', 'strength'],
  loc: (t) => (t >= E.as - 0.05 && t < E.arjuna ? '📍 THE SOUTHERN SEA' : t >= E.thats - 0.05 && t < E.pride ? "ARJUNA'S FLAG" : ''), shakes: [E.cracked], tick: () => {} });
