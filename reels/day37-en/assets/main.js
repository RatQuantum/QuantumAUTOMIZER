// Day 37 · "Why did Arjuna drop his bow?" · Why we do what we do #19 (the Gita begins on the battlefield)
// One set: Kurukshetra; two armies face each other across z (Pandavas z > 6, Kauravas z < -6); the chariot drives to the middle.
import * as THREE from './three.module.js';
import { rng, mat, mesh, sm, seg, lerp, clamp, setupScene, makeCast, pose } from './kit.js';
import { makeStage, direct, wordTime } from './director.js';
import { addOutlines, makeConfetti } from './plus.js';
import { WORDS, DURATION } from './data.js';

const stage = makeStage(), { scene, camera } = stage, V = (x, y, z) => new THREE.Vector3(x, y, z), R = rng(37);
const S = setupScene(scene, [[0, 0]], 37);
const WT = wordTime(WORDS);
const E = { the: WT('the', 2), two: WT('two'), as: WT('as'), krishna: WT('krishna'), i: WT('want') - 0.18, and: WT('and'), his2: WT('grandfather') - 0.24, his3: WT('teacher') - 0.22, his4: WT('cousins') - 0.24,
  his5: WT('hands') - 0.2, his6: WT('bow', 2) - 0.24, i2: WT('cannot') - 0.16, wait: WT('wait'), he2: WT('scold') - 0.26, right: WT('right'), do2: WT('duty') - 0.38, dont2: WT('worry') - 0.36, that: WT('talk') - 0.24,
  thats: WT("that's"), because: WT('because'), and3: WT('every') - 0.54, comment: WT('comment') };
const glow = (c, o = 0.5) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, depthWrite: false, blending: THREE.AdditiveBlending });
const noOut = (m) => { m.userData.noOutline = true; m.castShadow = false; return m; };

mesh(new THREE.CylinderGeometry(40, 40, 0.06, 32), mat(0xc9a46a), 0, 0.03, 0, scene).castShadow = false;
// two armies (instanced): front rows face the middle
function army(z0, dir, col, n) {
  const body = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.16, 0.2, 0.7, 6), mat(col), n), head = new THREE.InstancedMesh(new THREE.SphereGeometry(0.13, 8, 6), mat(0xc98a5e), n), helm = new THREE.InstancedMesh(new THREE.ConeGeometry(0.14, 0.18, 6), mat(0xd9a441, { m: 0.5, r: 0.4 }), n), spear = new THREE.InstancedMesh(new THREE.BoxGeometry(0.03, 1.4, 0.03), mat(0x8a6a3a), n);
  const P = []; for (let i = 0; i < n; i++) { const c = i % 34, r = Math.floor(i / 34); P.push([-9.5 + c * 0.58 + (r % 2) * 0.29, z0 + dir * r * 0.85, R() * 6]); }
  [body, head, helm, spear].forEach((m) => { m.userData.noOutline = true; scene.add(m); }); return { body, head, helm, spear, P };
}
const A = [army(7.0, 1, 0x2f6fa8, 340), army(-7.0, -1, 0x8a1a2a, 340)];
const flags = []; for (const [z, col] of [[9.5, 0xffd23a], [-9.5, 0xe0213a]]) for (let i = 0; i < 5; i++) { const g = new THREE.Group(); g.position.set(-8 + i * 4, 0, z); scene.add(g); mesh(new THREE.CylinderGeometry(0.04, 0.04, 3, 6), mat(0x6b4a2a), 0, 1.5, 0, g); flags.push(mesh(new THREE.BoxGeometry(0.9, 0.55, 0.03), mat(col), 0.46, 2.7, 0, g)); }
// the chariot (faces -z, toward the Kauravas)
const CH = new THREE.Group(); scene.add(CH);
const wood = mat(0x8a5a2a), gold = mat(0xffd23a, { m: 0.6, r: 0.35 });
mesh(new THREE.BoxGeometry(1.2, 0.18, 1.7), wood, 0, 0.92, 0, CH); mesh(new THREE.BoxGeometry(1.2, 0.55, 0.08), gold, 0, 1.25, -0.85, CH); for (const x of [-0.6, 0.6]) mesh(new THREE.BoxGeometry(0.06, 0.35, 1.7), wood, x, 1.15, 0, CH);
const wheels = [-0.72, 0.72].map((x) => { const wh = new THREE.Group(); wh.position.set(x, 0.72, 0.1); CH.add(wh); mesh(new THREE.TorusGeometry(0.66, 0.06, 6, 20).rotateY(Math.PI / 2), wood, 0, 0, 0, wh); for (let i = 0; i < 6; i++) { const sp = mesh(new THREE.BoxGeometry(0.04, 1.3, 0.04), gold, 0, 0, 0, wh); sp.rotation.x = i / 6 * Math.PI; } return wh; });
mesh(new THREE.BoxGeometry(0.07, 0.07, 2.0), wood, 0, 0.8, -1.8, CH); mesh(new THREE.CylinderGeometry(0.04, 0.04, 3.2, 6), wood, -0.55, 2.4, 0.82, CH);
const fc = document.createElement('canvas'); fc.width = 256; fc.height = 160; { const c = fc.getContext('2d'); c.fillStyle = '#f6a531'; c.beginPath(); c.moveTo(0, 0); c.lineTo(256, 30); c.lineTo(256, 130); c.lineTo(0, 160); c.closePath(); c.fill(); c.fillStyle = '#c0601a'; c.beginPath(); c.arc(110, 80, 46, 0, 7); c.fill(); c.fillStyle = '#f2d2a0'; c.beginPath(); c.ellipse(110, 92, 28, 24, 0, 0, 7); c.fill(); c.fillStyle = '#1d1a24'; for (const ex of [96, 124]) { c.beginPath(); c.arc(ex, 72, 6, 0, 7); c.fill(); } }
const fTex = new THREE.CanvasTexture(fc); fTex.colorSpace = THREE.SRGBColorSpace; const flag = noOut(new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.75), new THREE.MeshBasicMaterial({ map: fTex, side: THREE.DoubleSide }))); flag.position.set(-1.15, 3.6, 0.82); CH.add(flag);
function horse(x, z) { const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = Math.PI / 2; CH.add(g); const w = mat(0xf6f3ec); mesh(new THREE.BoxGeometry(1.0, 0.45, 0.32), w, 0, 1.0, 0, g); const nk = mesh(new THREE.BoxGeometry(0.22, 0.6, 0.22), w, 0.5, 1.35, 0, g); nk.rotation.z = -0.5; mesh(new THREE.BoxGeometry(0.42, 0.2, 0.2), w, 0.72, 1.62, 0, g); const legs = []; for (const [dx, dz] of [[-0.38, -0.1], [-0.38, 0.1], [0.38, -0.1], [0.38, 0.1]]) legs.push(mesh(new THREE.BoxGeometry(0.1, 0.8, 0.1).translate(0, -0.4, 0), w, dx, 0.82, dz, g)); return legs; }
const horseLegs = [[-0.5, -2.9], [-0.17, -2.9], [0.17, -2.9], [0.5, -2.9]].flatMap(([x, z]) => horse(x, z));
// the fallen bow, the light of the Gita, the verse board
const bow = new THREE.Group(); scene.add(bow); mesh(new THREE.TorusGeometry(0.75, 0.04, 6, 24, Math.PI * 0.9), mat(0x8a4b20), 0, 0, 0, bow); noOut(mesh(new THREE.BoxGeometry(0.01, 1.45, 0.01), mat(0xf2f2f2), 0.1, 0, 0, bow));
const light = noOut(mesh(new THREE.SphereGeometry(1.6, 24, 16), glow(0xffd88a, 0), 0, 2.2, 0, scene));
const rays = []; for (let i = 0; i < 12; i++) { const r = noOut(mesh(new THREE.BoxGeometry(0.06, 4.5, 0.02).translate(0, 2.25, 0), glow(0xffe0a0, 0), 0, 2.2, 0, scene)); r.rotation.z = i / 12 * Math.PI * 2; rays.push(r); }
const bc = document.createElement('canvas'); bc.width = 768; bc.height = 256; const bTex = new THREE.CanvasTexture(bc); bTex.colorSpace = THREE.SRGBColorSpace; let bKey = '';
function boardText(a, b) { const k = a + b; if (k === bKey) return; bKey = k; const c = bc.getContext('2d'); c.clearRect(0, 0, 768, 256); c.fillStyle = 'rgba(60,20,10,0.84)'; c.beginPath(); c.roundRect(8, 8, 752, 240, 44); c.fill(); c.lineWidth = 10; c.strokeStyle = '#ffd23a'; c.stroke(); c.textAlign = 'center'; c.textBaseline = 'middle';
  c.font = '900 92px Nunito, Arial Black, sans-serif'; c.lineWidth = 12; c.strokeStyle = '#1d1a24'; c.strokeText(a, 384, b ? 100 : 128); c.fillStyle = '#ffd23a'; c.fillText(a, 384, b ? 100 : 128); if (b) { c.font = '800 54px Nunito, Arial, sans-serif'; c.lineWidth = 8; c.strokeText(b, 384, 196); c.fillStyle = '#ffffff'; c.fillText(b, 384, 196); } bTex.needsUpdate = true; }
const board = noOut(new THREE.Mesh(new THREE.PlaneGeometry(2.1, 0.7), new THREE.MeshBasicMaterial({ map: bTex, transparent: true }))); scene.add(board);
// the cast: Krishna drives, Arjuna stands behind; across the field: grandfather, teacher, cousins
const C = makeCast(scene, [['k', 'krishna'], ['a', 'arjuna'], ['gf', 'muchukunda'], ['tc', 'carpenter'], ['c1', 'duryodhana'], ['c2', 'shishupala'], ['c3', 'courtier']]);
addOutlines(scene);
const confetti = makeConfetti(scene, 40, 37);
const m4 = new THREE.Matrix4();

function update(s, t) {
  const glowK = sm(seg(s, E.right, E.right + 0.8)) * (1 - sm(seg(s, E.comment + 0.5, E.comment + 1.5)));
  S.mood(0); S.paintSky(new THREE.Color(0x5a7ad0).lerp(new THREE.Color(0xf0c070), glowK * 0.5), new THREE.Color(0xffc890).lerp(new THREE.Color(0xfff0c0), glowK * 0.4)); S.hemi.intensity = 1.35 + glowK * 0.2;
  A.forEach(({ body, head, helm, spear, P }, k) => { P.forEach(([x, z, ph], i) => { const bob = Math.sin(t * 2 + ph) * 0.015; m4.makeTranslation(x, 0.45 + bob, z); body.setMatrixAt(i, m4); m4.makeTranslation(x, 0.93 + bob, z); head.setMatrixAt(i, m4); m4.makeTranslation(x, 1.1 + bob, z); helm.setMatrixAt(i, m4); m4.makeTranslation(x + 0.2, 0.8 + bob, z); spear.setMatrixAt(i, m4); }); [body, head, helm, spear].forEach((m) => (m.instanceMatrix.needsUpdate = true)); });
  flags.forEach((f, i) => (f.rotation.y = Math.sin(t * 3 + i) * 0.25));
  // the chariot drives from the Pandava lines to the middle
  const drive = sm(seg(s, E.krishna + 0.6, E.and)); CH.position.set(0, 0, lerp(5.2, 0.8, drive));
  wheels.forEach((w) => (w.rotation.x = -CH.position.z * 1.5)); horseLegs.forEach((l, i) => (l.rotation.z = drive > 0 && drive < 1 ? Math.sin(t * 12 + i) * 0.35 : 0));
  const cz = CH.position.z;
  pose(C.k, camera, { x: 0, y: 1.0, z: cz - 0.55, h: 1.7, sitting: true, mood: s >= E.right ? 'happy' : 'normal', arm: s >= E.right && s < E.thats ? 'offer' : 'down' });
  const drop = s >= E.his6 + 0.4, shake = s >= E.his5 && s < E.i2 ? Math.sin(t * 30) * 0.03 : 0;
  pose(C.a, camera, { x: 0.05 + shake, y: 1.0, z: cz + 0.35, h: 1.72, bow: !drop, sitting: s >= E.i2, mood: s >= E.his2 && s < E.right ? 'sad' : s >= E.thats ? 'happy' : 'normal', arm: s >= E.because + 0.6 ? 'up' : 'down' });
  { const fall = sm(seg(s, E.his6 + 0.3, E.his6 + 0.9)); bow.visible = drop; bow.position.set(0.5, lerp(1.6, 1.05, fall), cz + 0.35); bow.rotation.set(Math.PI / 2 * fall, 0, 0.3 + fall * 0.6); }
  // across the field: those he loves
  [['gf', -1.8, 1.8], ['tc', -0.3, 1.7], ['c1', 1.2, 1.8], ['c2', 2.6, 1.7], ['c3', 3.9, 1.6]].forEach(([n, x, h], i) => pose(C[n], camera, { x, y: 0.03, z: -5.0, h, mood: n === 'gf' || n === 'tc' ? 'closed' : 'smug', arm: 'down', bow: n === 'tc' }));
  // the Gita: light pours from Krishna
  light.position.set(0, 2.2, cz - 0.55); light.material.opacity = glowK * 0.22 * (1 + 0.1 * Math.sin(t * 3)); rays.forEach((r, i) => { r.position.copy(light.position); r.rotation.z = i / 12 * Math.PI * 2 + t * 0.1; r.material.opacity = glowK * 0.12; });
  board.visible = false; { const fwd = V(0, 0, -1).applyQuaternion(camera.quaternion), up = V(0, 1, 0).applyQuaternion(camera.quaternion); board.position.copy(camera.position).add(fwd.multiplyScalar(2.0)).add(up.multiplyScalar(0.55)); board.quaternion.copy(camera.quaternion); board.scale.setScalar(0.42); }
  if (s >= E.do2 - 0.2 && s < E.dont2 - 0.1) { boardText('DO YOUR DUTY', ''); board.visible = true; } else if (s >= E.dont2 - 0.1 && s < E.that) { boardText("DON'T WORRY", 'about the results'); board.visible = true; } else if (s >= E.that && s < E.thats) { boardText('BHAGAVAD GITA', 'the song of God'); board.visible = true; }
  confetti(E.that + 0.6, s, V(0, 3.6, cz));
  S.clouds.forEach((c, i) => { c.position.x = -80 + i * 15 + ((t * 0.6 + i * 3) % 12); });
}

const G = (t) => t, HOOK = (t) => E.his6 + t * 0.16;
const SHOTS = [
  [0, E.the - 0.05, HOOK, [[1.6, 1.8, 3.0], [0.2, 1.4, 1.0]], [[1.4, 1.7, 2.6], [0.3, 1.2, 1.1]]],
  [E.the - 0.05, E.two - 0.05, G, [[0, 5.5, 17], [0, 0.8, 0]], [[0, 4.5, 15], [0, 0.8, 0]]],
  [E.two - 0.05, E.as - 0.05, G, [[9, 11, 17], [0, 0, -1]], [[7, 13, 15], [0, 0, -1]]],
  [E.as - 0.05, E.krishna - 0.05, G, [[1.2, 2.2, 8.0], [0.0, 1.8, 5.2]], [[1.0, 2.2, 7.4], [0.0, 1.8, 5.2]]],
  [E.krishna - 0.05, E.i - 0.05, G, [[0.6, 1.9, 2.2], [0.0, 1.6, 4.6]], [[0.6, 1.9, 2.0], [0.0, 1.6, 4.3]]],
  [E.i - 0.05, E.and - 0.05, G, [[4.5, 2.6, 4.0], [0, 1.4, 1.5]], [[3.6, 2.4, 2.6], [0, 1.4, 0.8]]],
  [E.and - 0.05, E.his2 - 0.05, G, [[0.6, 2.3, 2.2], [0.8, 1.2, -5]], [[0.6, 2.3, 1.9], [0.8, 1.2, -5]]],
  [E.his2 - 0.05, E.his3 - 0.05, G, [[-1.8, 1.6, -3.0], [-1.8, 1.5, -5.0]], [[-1.8, 1.6, -3.2], [-1.8, 1.5, -5.0]]],
  [E.his3 - 0.05, E.his4 - 0.05, G, [[-0.3, 1.5, -3.0], [-0.3, 1.45, -5.0]], [[-0.3, 1.5, -3.2], [-0.3, 1.45, -5.0]]],
  [E.his4 - 0.05, E.his5 - 0.05, G, [[2.6, 1.6, -1.6], [2.6, 1.3, -5.0]], [[2.6, 1.6, -1.9], [2.6, 1.3, -5.0]]],
  [E.his5 - 0.05, E.his6 - 0.05, G, [[0.5, 1.9, 3.0], [0.05, 1.7, 1.15]], [[0.45, 1.9, 2.8], [0.05, 1.7, 1.15]]],
  [E.his6 - 0.05, E.i2 - 0.05, G, [[1.6, 1.8, 3.0], [0.2, 1.4, 1.0]], [[1.4, 1.7, 2.6], [0.3, 1.2, 1.1]]],
  [E.i2 - 0.05, E.wait - 0.05, G, [[0.6, 1.7, 3.2], [0.05, 1.5, 1.15]], [[0.6, 1.7, 2.9], [0.05, 1.5, 1.15]]],
  [E.wait - 0.05, E.right - 0.05, G, [[-0.6, 1.9, -1.4], [0.0, 1.7, 0.25]], [[-0.55, 1.9, -1.2], [0.0, 1.7, 0.25]]],
  [E.right - 0.05, E.do2 - 0.05, G, [[0, 6, 11], [0, 1.5, 0.5]], [[0, 4.5, 9], [0, 1.6, 0.5]]],
  [E.do2 - 0.05, E.that - 0.05, G, [[-1.4, 1.9, 3.2], [-0.1, 1.6, 0.3]], [[-1.2, 1.9, 2.8], [-0.1, 1.6, 0.3]]],
  [E.that - 0.05, E.thats - 0.05, G, [[0, 2.6, 6.8], [0, 2.0, 0.5]], [[0, 2.4, 6.0], [0, 2.0, 0.5]]],
  [E.thats - 0.05, E.because - 0.05, G, [[-9, 4, 9], [0, 1.4, 0.5]], [[-7, 3.5, 8], [0, 1.4, 0.5]]],
  [E.because - 0.05, E.comment - 0.05, G, [[1.2, 2.0, 4.0], [0, 1.6, 0.8]], [[1.0, 2.0, 3.6], [0, 1.6, 0.8]]],
  [E.comment - 0.05, DURATION + 0.1, G, [[3.6, 2.4, 5.0], [0, 1.7, 0.6]], [[3.4, 2.4, 4.7], [0, 1.7, 0.6]]],
];
direct({ stage, WORDS, DURATION, shots: SHOTS, update, title: E.the - 0.05, q: [E.wait, E.he2], cta: E.comment,
  key: ['archer', 'bow', 'war', 'armies', 'story', 'arjuna', 'krishna', 'chariot', 'middle', 'grandfather', 'teacher', 'cousins', 'shake', 'gandiva', 'family', 'wait', 'scold', 'duty', 'results', 'bhagavad', 'gita', 'battlefield', 'life', 'comment', 'verse'],
  loc: (t) => (t >= E.the - 0.05 && t < E.as - 0.05 ? '📍 KURUKSHETRA · DAY 1' : ''), shakes: [], tick: () => {} });
