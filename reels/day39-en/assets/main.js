// Day 39 · "Why did Krishna forgive 100 insults?" · Why we do what we do #21 (as the story goes: Shishupala)
// Sets: the nursery in Chedi (origin), the royal court years later (x = 40).
import * as THREE from './three.module.js';
import { rng, mat, mesh, sm, seg, lerp, clamp, setupScene, makeCast, pose, lamp } from './kit.js';
import { makeStage, direct, wordTime } from './director.js';
import { addOutlines, makeConfetti } from './plus.js';
import { WORDS, DURATION } from './data.js';

const stage = makeStage(), { scene, camera } = stage, V = (x, y, z) => new THREE.Vector3(x, y, z), R = rng(39);
const S = setupScene(scene, [[0, 0], [40, 0]], 39);
const WT = wordTime(WORDS), WX = (txt) => WORDS.find((w) => w[2].startsWith(txt))[0];
const E = { as: WT('as'), a: WT('prince') - 0.08, third: WT('third'), extra: WT('extra'), a2: WT('voice') - 0.1, when: WT('when'), they: WT('disappeared') - 0.1, his: WT('mother') - 0.22, so: WT('promised') - 0.28, i: WT('forgive') - 0.3,
  years: WT('years'), shishupala2: WT('shishupala', 2), again: WT('again'), krishna4: WT('kept') - 0.14, n98: WX('98'), n99: WX('99'), n100: WX('100'), wait: WT('wait'), n101: WX('101'), krishna5: WT('raised') - 0.38,
  sud: WT('sudarshan'), flew: WT('flew'), thats: WT("that's"), comment: WT('comment') };
const glow = (c, o = 0.5) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, depthWrite: false, blending: THREE.AdditiveBlending });
const noOut = (m) => { m.userData.noOutline = true; m.castShadow = false; return m; };

// ---------------- the nursery
mesh(new THREE.BoxGeometry(10, 0.1, 8), mat(0xf3e2b8), 0, 0.05, 0, scene).castShadow = false; mesh(new THREE.BoxGeometry(10, 5, 0.3), mat(0xb8d8c0), 0, 2.5, -2.6, scene);
mesh(new THREE.BoxGeometry(1.6, 1.8, 0.1), mat(0xffffff), 2.4, 2.6, -2.44, scene); noOut(mesh(new THREE.BoxGeometry(1.4, 1.6, 0.12), mat(0x7fb8ff), 2.4, 2.6, -2.42, scene));
const nl = lamp(scene, -3.0, 0.1, -1.6, 1.0);
const skyBeam = noOut(mesh(new THREE.CylinderGeometry(0.3, 1.1, 6, 16, 1, true), glow(0xfff0c0, 0), 0.0, 3.5, 0.2, scene));
const thirdEye = noOut(mesh(new THREE.SphereGeometry(0.022, 10, 8), mat(0xd0213a), 0, 0, 0, scene));
const extraArms = [-1, 1].map(() => noOut(mesh(new THREE.CapsuleGeometry(0.018, 0.07, 4, 6), mat(0xe0a57c), 0, 0, 0, scene)));
const vanishFx = []; for (let i = 0; i < 16; i++) vanishFx.push(noOut(mesh(new THREE.OctahedronGeometry(0.04, 0), glow(0xffd23a, 0.9), 0, 0, 0, scene)));
// ---------------- the royal court (x = 40)
mesh(new THREE.BoxGeometry(14, 0.1, 10), mat(0xf3e2b8), 40, 0.05, 0, scene).castShadow = false; mesh(new THREE.BoxGeometry(14, 6, 0.3), mat(0x7a1f5a), 40, 3, -4, scene);
for (const x of [-5.5, -2.8, 2.8, 5.5]) { mesh(new THREE.CylinderGeometry(0.3, 0.34, 5.5, 10), mat(0xfaf5ea), 40 + x, 2.75, -2.6, scene); mesh(new THREE.BoxGeometry(0.8, 0.3, 0.8), mat(0xffd23a, { m: 0.5, r: 0.4 }), 40 + x, 5.6, -2.6, scene); }
noOut(mesh(new THREE.BoxGeometry(2.2, 0.02, 8), mat(0xc0213a), 40, 0.11, 0, scene));
const havan = []; mesh(new THREE.CylinderGeometry(0.6, 0.5, 0.4, 4).rotateY(Math.PI / 4), mat(0xb5562c), 40, 0.25, -1.6, scene); for (let i = 0; i < 3; i++) havan.push(noOut(mesh(new THREE.ConeGeometry(0.18, 0.6, 6), glow([0xffb02a, 0xff7a1e, 0xffd23a][i], 0.85), 40 + (i - 1) * 0.12, 0.75, -1.6, scene)));
for (const x of [-4.4, 4.4]) mesh(new THREE.BoxGeometry(1.6, 0.45, 4), mat(0x8a5a2a), 40 + x, 0.25, 0.2, scene);
// the insult bubbles and the counter
function bubbleTex() { const c = document.createElement('canvas'); c.width = 256; c.height = 160; const x = c.getContext('2d'); x.fillStyle = '#ffffff'; x.strokeStyle = '#d0213a'; x.lineWidth = 8; x.beginPath(); for (let i = 0; i <= 16; i++) { const a = i / 16 * Math.PI * 2, r = i % 2 ? 60 : 74; x.lineTo(128 + Math.cos(a) * r * 1.55, 75 + Math.sin(a) * r * 0.9); } x.closePath(); x.fill(); x.stroke(); x.font = '900 64px Nunito, Arial Black'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = '#d0213a'; x.fillText('#@%!', 128, 78); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; }
const bTex = bubbleTex(); const bubbles = []; for (let i = 0; i < 6; i++) { const m = noOut(new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.56), new THREE.MeshBasicMaterial({ map: bTex, transparent: true }))); scene.add(m); bubbles.push(m); }
const cc = document.createElement('canvas'); cc.width = 512; cc.height = 256; const cTex = new THREE.CanvasTexture(cc); cTex.colorSpace = THREE.SRGBColorSpace; let cKey = '';
function counter(n, red) { const k = n + '' + red; if (k === cKey) return; cKey = k; const c = cc.getContext('2d'); c.clearRect(0, 0, 512, 256); c.fillStyle = red ? 'rgba(120,10,20,0.88)' : 'rgba(40,20,60,0.84)'; c.beginPath(); c.roundRect(8, 8, 496, 240, 44); c.fill(); c.lineWidth = 10; c.strokeStyle = '#ffd23a'; c.stroke(); c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = '900 150px Nunito, Arial Black'; c.lineWidth = 14; c.strokeStyle = '#1d1a24'; c.strokeText(n, 256, 136); c.fillStyle = red ? '#ff5a3a' : '#ffd23a'; c.fillText(n, 256, 136); cTex.needsUpdate = true; }
const board = noOut(new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.7), new THREE.MeshBasicMaterial({ map: cTex, transparent: true }))); scene.add(board);
// the Sudarshan Chakra
const chakra = new THREE.Group(); scene.add(chakra);
mesh(new THREE.TorusGeometry(0.28, 0.05, 8, 24), mat(0xffd23a, { m: 0.7, r: 0.25, e: 0xffa020, ei: 0.5 }), 0, 0, 0, chakra); for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; const tth = mesh(new THREE.ConeGeometry(0.05, 0.14, 4), mat(0xffd23a, { m: 0.7, r: 0.25, e: 0xffa020, ei: 0.5 }), Math.cos(a) * 0.36, Math.sin(a) * 0.36, 0, chakra); tth.rotation.z = a - Math.PI / 2; } for (let i = 0; i < 6; i++) { const sp = mesh(new THREE.BoxGeometry(0.03, 0.5, 0.02), mat(0xffe08a, { e: 0xffa020, ei: 0.4 }), 0, 0, 0, chakra); sp.rotation.z = i / 6 * Math.PI; }
const chGlow = noOut(mesh(new THREE.SphereGeometry(0.55, 16, 12), glow(0xffd23a, 0.35), 0, 0, 0, chakra));
const flash = noOut(mesh(new THREE.SphereGeometry(1, 16, 12), glow(0xffffff, 0), 0, 0, 0, scene));
const lightPillar = noOut(mesh(new THREE.CylinderGeometry(0.5, 0.5, 8, 16, 1, true), glow(0xfff0c0, 0), 0, 4, 0, scene));
// ---------------- the cast
const C = makeCast(scene, [['baby', 'kidKrishna'], ['mom', 'rukmini'], ['kk', 'krishna'], ['k', 'krishna'], ['sp', 'shishupala'], ['g1', 'courtier'], ['g2', 'arjuna'], ['g3', 'priest'], ['g4', 'courtier']]);
C.baby.spec = Object.assign({}, C.baby.spec, { skin: '#e0a57c', body: '#f6f1e2', top: (c, cx, hy, hr, pose) => { if (pose.nofeather) return; c.beginPath(); c.ellipse(cx, hy - hr * 0.45, 9, 14, 0, 0, Math.PI * 2); c.fillStyle = '#ffffff'; c.fill(); c.lineWidth = 4; c.strokeStyle = '#1d1a24'; c.stroke(); c.beginPath(); c.arc(cx, hy - hr * 0.45, 5, 0, 7); c.fillStyle = '#d0213a'; c.fill(); for (const sd of [-1, 1]) { c.lineCap = 'round'; c.lineWidth = 9; c.strokeStyle = '#1d1a24'; c.beginPath(); c.moveTo(cx + sd * 50, hy + hr + 50); c.lineTo(cx + sd * 92, hy + hr + 10); c.stroke(); c.beginPath(); c.arc(cx + sd * 94, hy + hr + 6, 11, 0, 7); c.fillStyle = '#e0a57c'; c.fill(); c.lineWidth = 4; c.stroke(); } }, bodyDeco: undefined, hair: (c, cx, hy, hr) => { c.beginPath(); c.arc(cx, hy, hr, Math.PI * 1.1, Math.PI * 1.9); c.lineWidth = 12; c.strokeStyle = '#1d1a24'; c.stroke(); } });
addOutlines(scene);
const confetti = makeConfetti(scene, 50, 39);
const SPp = V(42.2, 0.11, 0.6), KP = V(37.8, 0.11, 0.6);

function update(s, t) {
  const court = camera.position.x > 20;
  S.mood(0); S.hemi.intensity = 1.4; S.sun.target.position.set(court ? 40 : 0, 0, 0); S.sun.position.set((court ? 40 : 0) - 8, 14, 10); S.sun.target.updateMatrixWorld();
  nl.flame.scale.y = 1 + 0.15 * Math.sin(t * 13); havan.forEach((f, i) => (f.scale.y = 1 + 0.25 * Math.sin(t * 11 + i * 2)));
  const right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0); right.y = 0; right.normalize();
  // --- nursery: the mother holds the baby; the voice from the sky; Krishna holds him and the marks vanish
  const hand = sm(seg(s, E.when, E.when + 0.6)), vanished = s >= E.they + 0.3;
  const MOM = V(-0.6, 0.1, 0.2), KK = V(0.8, 0.1, 0.2), momH = MOM.clone().add(right.clone().multiplyScalar(0.3)).add(V(0, 0.82, 0.05)), kkH = KK.clone().add(right.clone().multiplyScalar(-0.3)).add(V(0, 0.84, 0.05));
  const bp = momH.clone().lerp(kkH, hand); if (s >= E.his + 0.4) bp.copy(kkH.clone().lerp(momH, sm(seg(s, E.his + 0.4, E.his + 1.0))));
  pose(C.baby, camera, { visible: !court, x: bp.x, y: bp.y - 0.15, z: bp.z, h: 0.55, sitting: true, mood: vanished ? 'happy' : 'normal', nofeather: vanished || s < E.third - 0.1 });
  pose(C.mom, camera, { visible: !court, x: MOM.x, y: MOM.y, z: MOM.z, h: 1.65, mood: s >= E.his ? 'sad' : s >= E.a2 ? 'wow' : 'happy', arm: hand < 0.5 || s >= E.his + 0.6 ? 'offer' : 'down' });
  pose(C.kk, camera, { visible: !court && s >= E.when - 0.4, x: KK.x, y: KK.y, z: KK.z, h: 1.6, mood: s >= E.so ? 'closed' : 'happy', arm: hand > 0.5 && s < E.his + 0.6 ? 'offer' : 'down', flip: true });
  const headP = V(bp.x, bp.y - 0.15 + 0.42, bp.z + 0.04);
  thirdEye.visible = false; thirdEye.position.copy(headP).add(V(0, 0.07, 0.03)); thirdEye.scale.setScalar(1 + 0.2 * Math.sin(t * 6));
  extraArms.forEach((a, i) => { a.visible = false; a.position.copy(headP).add(right.clone().multiplyScalar(i ? 0.2 : -0.2)).add(V(0, -0.2, 0.02)); a.rotation.set(0, 0, i ? -0.8 : 0.8); });
  vanishFx.forEach((m, i) => { const u = s - E.they - (i % 8) * 0.04; m.visible = !court && u > 0 && u < 1.2; const a = i * 2.4; m.position.copy(headP).add(V(Math.cos(a) * (0.1 + u * 0.4), u * 0.6, Math.sin(a) * 0.1)); m.rotation.y = t * 4; });
  skyBeam.material.opacity = court ? 0 : Math.max(0, Math.sin(clamp((s - E.a2 + 0.2) / (E.when - E.a2 + 0.2)) * Math.PI)) * 0.22;
  // --- the court: Shishupala insults, again and again; Krishna counts calmly
  const insulting = s >= E.shishupala2 + 0.4 && s < E.wait + 0.4;
  pose(C.sp, camera, { visible: court && !(s >= E.flew + 0.3), x: SPp.x, y: SPp.y, z: SPp.z, h: 1.78, mood: s >= E.krishna5 ? 'wow' : 'smug', arm: insulting && Math.sin(t * 5) > 0 ? 'point' : 'hips', flip: true });
  pose(C.k, camera, { visible: court || s < E.as, x: KP.x, y: KP.y, z: KP.z, h: 1.75, mood: s >= E.krishna5 ? 'normal' : 'closed', arm: s >= E.krishna5 ? 'up' : 'down' });
  [['g1', 35.6, 0.4], ['g2', 36.6, -1.0], ['g3', 43.4, -1.0], ['g4', 44.4, 0.2]].forEach(([n, x, z], i) => pose(C[n], camera, { visible: court, x, y: 0.5, z, h: 1.62, sitting: true, mood: s >= E.flew ? 'wow' : insulting ? 'sad' : 'normal', flip: x > 40 }));
  bubbles.forEach((b, i) => { const u = ((s - E.again) * 1.4 + i / 6) % 1; b.visible = court && insulting && s >= E.again; b.position.set(SPp.x - 0.5 - u * 2.6, 1.9 + Math.sin(u * 7 + i) * 0.25 + (i % 2) * 0.3, SPp.z + 0.1); b.scale.setScalar(0.6 + Math.sin(u * Math.PI) * 0.6); b.quaternion.copy(camera.quaternion); });
  // the counter above Krishna
  let n = 0; if (s >= E.again) n = Math.min(97, Math.floor(1 + (s - E.again) / (E.n98 - E.again) * 96)); if (s >= E.n98) n = 98; if (s >= E.n99) n = 99; if (s >= E.n100) n = 100; if (s >= E.n101) n = 101;
  board.visible = court && s >= E.again && s < E.krishna5 + 0.4; counter(n, n > 100); board.position.copy(KP).add(V(0, 2.45, 0.1)); board.quaternion.copy(camera.quaternion); board.scale.setScalar(n >= 98 ? 1 + 0.12 * Math.exp(-((s - [E.n98, E.n99, E.n100, E.n101][n - 98]) || 0) * 8) : 1);
  // the chakra rises from his finger and flies; a flash of light
  const rise = sm(seg(s, E.krishna5 + 0.4, E.sud)), fly = sm(seg(s, E.flew - 0.2, E.flew + 0.4));
  chakra.visible = court && s >= E.krishna5 + 0.3; const fingertip = KP.clone().add(V(0, 2.25 + rise * 0.3, 0.1));
  chakra.position.copy(fingertip.clone().lerp(SPp.clone().add(V(0, 1.3, 0.1)), fly)); if (s >= E.flew + 0.5) chakra.position.copy(fingertip); chakra.rotation.set(0, 0, -t * 12); chakra.scale.setScalar(rise * (s >= E.thats ? 0.8 : 1)); chakra.quaternion.multiplyQuaternions(camera.quaternion, new THREE.Quaternion().setFromAxisAngle(V(0, 0, 1), -t * 12)); chGlow.material.opacity = 0.35 + 0.1 * Math.sin(t * 9);
  const fu = s - E.flew - 0.25; flash.visible = court && fu > 0 && fu < 0.8; flash.position.copy(SPp).add(V(0, 1.2, 0)); flash.scale.setScalar(0.5 + fu * 5); flash.material.opacity = 0.9 * (1 - fu / 0.8);
  lightPillar.visible = court && fu > 0 && fu < 2.0; lightPillar.position.set(SPp.x, 4, SPp.z); lightPillar.material.opacity = 0.25 * (1 - fu / 2);
  confetti(E.comment, s, V(40, 3.2, 0.5));
  S.clouds.forEach((c, i) => { c.position.x = -80 + i * 15 + ((t * 0.6 + i * 3) % 12); });
}

const G = (t) => t, HOOK = (t) => E.n99 + 0.2 + t * 0.4;
const SHOTS = [
  [0, E.as - 0.05, HOOK, [[40, 2.3, 7.0], [40, 1.6, 0.2]], [[40, 2.2, 6.2], [40, 1.6, 0.2]]],
  [E.as - 0.05, E.third - 0.05, G, [[0, 2.6, 6.0], [0, 1.2, -0.5]], [[0, 2.2, 5.0], [0, 1.2, -0.5]]],
  [E.third - 0.05, E.a2 - 0.05, G, [[-0.25, 1.05, 1.5], [-0.3, 0.9, 0.25]], [[-0.25, 1.0, 1.25], [-0.3, 0.9, 0.25]]],
  [E.a2 - 0.05, E.when - 0.05, G, [[0, 1.2, 5.4], [0, 2.8, 0]], [[0, 1.4, 5.0], [0, 2.4, 0]]],
  [E.when - 0.05, E.his - 0.05, G, [[0.4, 1.3, 2.2], [0.3, 1.0, 0.2]], [[0.4, 1.25, 2.0], [0.3, 1.0, 0.2]]],
  [E.his - 0.05, E.so - 0.05, G, [[-0.8, 1.7, 2.6], [-0.6, 1.5, 0.2]], [[-0.8, 1.7, 2.3], [-0.6, 1.5, 0.2]]],
  [E.so - 0.05, E.years - 0.05, G, [[0.9, 1.75, 2.6], [0.8, 1.55, 0.2]], [[0.9, 1.75, 2.3], [0.8, 1.55, 0.2]]],
  [E.years - 0.05, E.shishupala2 - 0.05, G, [[40, 5.0, 11], [40, 1.2, -1]], [[40, 3.6, 9], [40, 1.2, -1]]],
  [E.shishupala2 - 0.05, E.again - 0.05, G, [[41.6, 1.8, 3.4], [42.2, 1.5, 0.6]], [[41.7, 1.8, 3.0], [42.2, 1.5, 0.6]]],
  [E.again - 0.05, E.krishna4 - 0.05, G, [[40, 2.2, 6.4], [40, 1.6, 0.4]], [[40, 2.1, 5.8], [40, 1.6, 0.4]]],
  [E.krishna4 - 0.05, E.n98 - 0.05, G, [[37.9, 2.3, 3.6], [37.8, 2.0, 0.6]], [[37.9, 2.3, 3.2], [37.8, 2.0, 0.6]]],
  [E.n98 - 0.05, E.n99 - 0.05, G, [[42.0, 1.8, 3.0], [42.2, 1.6, 0.6]], [[42.0, 1.8, 2.8], [42.2, 1.6, 0.6]]],
  [E.n99 - 0.05, E.n100 - 0.05, G, [[37.9, 2.4, 3.0], [37.8, 2.2, 0.6]], [[37.9, 2.4, 2.8], [37.8, 2.2, 0.6]]],
  [E.n100 - 0.05, E.wait - 0.05, G, [[38.2, 2.4, 4.8], [37.8, 2.1, 0.6]], [[38.1, 2.4, 4.4], [37.8, 2.1, 0.6]]],
  [E.wait - 0.05, E.krishna5 - 0.05, G, [[42.0, 1.8, 2.8], [42.2, 1.6, 0.6]], [[42.0, 1.8, 2.6], [42.2, 1.6, 0.6]]],
  [E.krishna5 - 0.05, E.flew - 0.25, G, [[37.6, 2.0, 3.4], [37.8, 2.0, 0.6]], [[37.6, 2.0, 3.0], [37.8, 2.1, 0.6]]],
  [E.flew - 0.25, E.thats - 0.05, G, [[40, 2.4, 7.4], [40, 1.6, 0.4]], [[40, 2.4, 7.0], [40.6, 1.6, 0.4]]],
  [E.thats - 0.05, E.comment - 0.05, G, [[38.4, 2.1, 3.6], [37.8, 1.8, 0.6]], [[38.4, 2.0, 3.2], [37.8, 1.8, 0.6]]],
  [E.comment - 0.05, DURATION + 0.1, G, [[38.0, 2.3, 5.0], [37.8, 2.0, 0.6]], [[38.0, 2.3, 4.6], [37.8, 2.0, 0.6]]],
];
direct({ stage, WORDS, DURATION, shots: SHOTS, update, title: E.as - 0.05, q: [E.wait, E.krishna5], cta: E.comment,
  key: ['krishna', 'forgive', 'hundred', 'insults', 'story', 'shishupala', 'third', 'eye', 'arms', 'voice', 'sky', 'disappear', 'disappeared', 'mother', 'begged', 'spare', 'promised', 'royal', 'insulted', 'again', 'counting', 'calmly', 'wait', 'finger', 'sudarshan', 'chakra', 'flew', 'patience', 'endless', 'limit', 'comment'],
  loc: (t) => (t >= E.as - 0.05 && t < E.third - 0.05 ? '📍 CHEDI · LONG AGO' : t >= E.years - 0.05 && t < E.shishupala2 - 0.05 ? 'YEARS LATER' : ''), shakes: [E.flew + 0.25], tick: () => {} });
