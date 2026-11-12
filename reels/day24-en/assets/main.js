// Day 24 · "Why 56 dishes?" · Why we do what we do #6 (as the story goes: Govardhan, told as one)
// Sets: the village of Vraj with Govardhan hill (origin; the hill stands at z = -3), a temple bhog of 56 bowls today (x = 40).
import * as THREE from './three.module.js';
import { rng, mat, mesh, sm, seg, lerp, clamp, setupScene, makeCast, pose, lamp, hut, cow, roundTree, palm, clayPot } from './kit.js';
import { makeStage, direct, wordTime } from './director.js';
import { addOutlines, makeConfetti } from './plus.js';
import { WORDS, DURATION } from './data.js';

const stage = makeStage(), { scene, camera } = stage, V = (x, y, z) => new THREE.Vector3(x, y, z), R = rng(24);
const S = setupScene(scene, [[0, 2], [40, 0]], 24);
const WT = wordTime(WORDS);
const E = { not: WT('not'), not2: WT('not', 2), exactly: WT('exactly'), as: WT('as'), village: WT('village'), indra: WT('indra'), little: WT('little'), mountain: WT('mountain'),
  lets: WT("let's"), so: WT('so'), and: WT('and'), indra2: WT('indra', 2), sent: WT('sent'), thunder: WT('thunder'), lightning: WT('lightning'), village2: WT('village', 2),
  so2: WT('so', 2), lifted: WT('lifted'), finger: WT('finger'), every: WT('every'), wait: WT('wait'), seven: WT('seven'), and3: WT('ate') - 0.66, eight2: WT('eight', 2),
  fifty: WT('fifty-six', 3), sun: WT('sun'), mothers: WT('mothers'), thats: WT("that's"), krishna5: WT('gets') - 0.22, comment: WT('comment') };
const glow = (c, o = 0.5) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, depthWrite: false, blending: THREE.AdditiveBlending });
const noOut = (m) => { m.userData.noOutline = true; m.castShadow = false; return m; };
const MC = V(0, 0, -3); // Govardhan's centre

// ---------------- Vraj: huts, trees, a feast square, cows
mesh(new THREE.CylinderGeometry(9, 9, 0.08, 28), mat(0xd9b77a), 0, 0.04, 8, scene).castShadow = false;
[[-6, 7, 0.4], [6.2, 7.5, -0.4], [-6.5, 12, 0.2], [6.5, 12.5, -0.2], [-3.4, 14.5, 0.1], [3.4, 14.5, -0.1]].forEach(([x, z, r]) => hut(scene, x, z, R, r));
for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2, r = 11 + R() * 3; (i % 3 ? roundTree : palm)(scene, Math.cos(a) * r, 6 + Math.sin(a) * r, R, 1 + R() * 0.3); }
// the feast for Indra: a cloth, pots on cooking fires
noOut(mesh(new THREE.BoxGeometry(3.2, 0.02, 1.6), mat(0xe8462c), 0, 0.1, 8, scene));
const fires = [], pots = [];
[[-1.0, 8.0], [0, 8.0], [1.0, 8.0]].forEach(([x, z], i) => { pots.push(clayPot(scene, x, 0.55, z, 0.7)); for (let k = 0; k < 3; k++) fires.push(noOut(mesh(new THREE.ConeGeometry(0.12, 0.38, 5), glow(k % 2 ? 0xff8a1e : 0xffd23a, 0.9), x + (k - 1) * 0.12, 0.25, z, scene))); });
const cows = [cow(scene, -3.0, 3.4, 0.5, R), cow(scene, 3.2, 3.0, -0.6, R), cow(scene, -1.6, 4.6, 1.2, R), cow(scene, 2.0, 5.2, 2.6, R)];
const cowHome = cows.map((c) => c.position.clone()), cowUnder = [V(-2.4, 0, -1.6), V(2.5, 0, -1.8), V(-1.6, 0, -4.6), V(1.9, 0, -4.4)];
// ---------------- Govardhan: a green hill with a brown underside, trees and rocks on top; a rock to stand on beneath it
const hill = new THREE.Group(); hill.position.copy(MC); scene.add(hill);
{ const g = new THREE.ConeGeometry(4.6, 4.2, 9, 2); g.translate(0, 2.1, 0); const p = g.attributes.position; for (let i = 0; i < p.count; i++) if (p.getY(i) > 0.1 && p.getY(i) < 4.1) { p.setX(i, p.getX(i) * (0.9 + R() * 0.25)); p.setZ(i, p.getZ(i) * (0.9 + R() * 0.25)); } g.computeVertexNormals(); mesh(g, mat(0x6fbf45), 0, 0, 0, hill); }
mesh(new THREE.CylinderGeometry(4.5, 3.6, 0.9, 9), mat(0xa87a52), 0, -0.4, 0, hill);
const underL = new THREE.PointLight(0xffe0b0, 0, 9, 1.2); scene.add(underL);
for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2 + 0.3; roundTree(hill, Math.cos(a) * 2.4, Math.sin(a) * 2.4 * 0.9, R, 0.45); }
roundTree(hill, 0.3, 0.2, R, 0.55);
for (let i = 0; i < 7; i++) { const a = R() * Math.PI * 2; mesh(new THREE.DodecahedronGeometry(0.25 + R() * 0.2, 0), mat(0x9a96b0), Math.cos(a) * 3.3, 0.9, Math.sin(a) * 3.0, hill); }
const rock = mesh(new THREE.CylinderGeometry(0.55, 0.75, 1.0, 7), mat(0x9a96b0), MC.x, 0.5, MC.z, scene);
// ---------------- Indra: a storm cloud with a crown (cheerful king of rain, then furious)
const indra = new THREE.Group(); indra.position.set(4, 10.5, -11); scene.add(indra);
const cloudMat = mat(0xffffff, { r: 1 }), cloudParts = [];
for (let i = 0; i < 9; i++) cloudParts.push(mesh(new THREE.IcosahedronGeometry(1.1 + R() * 0.7, 0), cloudMat, (i - 4) * 0.9, (R() - 0.3) * 0.8, R() * 0.6, indra));
const eyes = [-0.8, 0.8].map((x) => { const e = new THREE.Group(); e.position.set(x, 0.3, 1.6); indra.add(e); mesh(new THREE.SphereGeometry(0.42, 12, 8), mat(0xffffff), 0, 0, 0, e); mesh(new THREE.SphereGeometry(0.2, 10, 6), mat(0x1d1a24), 0, -0.04, 0.3, e); return e; });
const brows = [-0.8, 0.8].map((x) => mesh(new THREE.BoxGeometry(0.75, 0.14, 0.12), mat(0x1d1a24), x, 0.95, 1.9, indra));
const crownG = new THREE.Group(); crownG.position.set(0, 1.55, 0.6); indra.add(crownG); { const gm = mat(0xffd23a, { m: 0.6, r: 0.3 }); mesh(new THREE.CylinderGeometry(0.9, 0.95, 0.45, 10, 1, true), gm, 0, 0, 0, crownG); for (let p = 0; p < 7; p++) { const a = p / 7 * Math.PI * 2; mesh(new THREE.ConeGeometry(0.15, 0.45, 4), gm, Math.cos(a) * 0.88, 0.4, Math.sin(a) * 0.88, crownG); } mesh(new THREE.SphereGeometry(0.15, 8, 6), mat(0x2fa8e0), 0, 0.05, 0.95, crownG); }
// rain, lightning, a flood
const RAIN = 1100, rain = noOut(new THREE.InstancedMesh(new THREE.BoxGeometry(0.02, 0.45, 0.02), new THREE.MeshBasicMaterial({ color: 0xbcd4ff, transparent: true, opacity: 0.55 }), RAIN)); scene.add(rain);
const rainBase = Array.from({ length: RAIN }, () => [R() * 26 - 13, R() * 14, R() * 24 - 9, R()]);
const bolt = noOut(new THREE.Line(new THREE.BufferGeometry().setFromPoints([V(0, 14, 0), V(0.8, 10, 0), V(-0.4, 7, 0), V(0.6, 4, 0), V(0, 0, 0)]), new THREE.LineBasicMaterial({ color: 0xffffff }))); scene.add(bolt);
const flood = noOut(mesh(new THREE.PlaneGeometry(30, 16, 30, 16).rotateX(-Math.PI / 2), mat(0x4f8fc8, { r: 0.3 }), 0, 0, 10, scene)); flood.material.transparent = true; flood.material.opacity = 0.85;
const fbase = flood.geometry.attributes.position.array.slice();

// ---------------- today: a temple bhog of 56 bowls (x = 40), 8 a day for 7 days
const T = new THREE.Group(); T.position.set(40, 0, 0); scene.add(T);
mesh(new THREE.BoxGeometry(12, 0.1, 10), mat(0xf3e6c8), 0, 0.05, 0, T).castShadow = false;
mesh(new THREE.BoxGeometry(12, 9, 0.3), mat(0x9a2a3a), 0, 4.5, -3.2, T);
for (const x of [-2.2, 2.2]) { mesh(new THREE.CylinderGeometry(0.22, 0.26, 4.4, 8), mat(0xffd23a, { m: 0.4, r: 0.4 }), x, 2.2, -2.7, T); }
mesh(new THREE.TorusGeometry(2.2, 0.16, 6, 18, Math.PI), mat(0xffd23a, { m: 0.4, r: 0.4 }), 0, 4.4, -2.75, T);
for (let i = 0; i <= 22; i++) { const u = i / 22; noOut(mesh(new THREE.SphereGeometry(0.1, 6, 4), mat(i % 2 ? 0xf6a531 : 0xffffff), -2.2 + u * 4.4, 4.3 - Math.sin(u * Math.PI) * 0.6, -2.6, T)); }
const BOWLS = [], foodCols = [0xffd23a, 0xf6a531, 0xffffff, 0xe8462c, 0x8ad84a, 0xf5c27a, 0xd9a066, 0xffe08a];
for (let r = 0; r < 7; r++) {
  mesh(new THREE.BoxGeometry(3.9, 0.22, 0.38), mat(r % 2 ? 0xc0213a : 0xd8463a), 0, 0.11 + r * 0.22, 0.55 - r * 0.38, T);
  for (let c = 0; c < 8; c++) { const b = new THREE.Group(); b.position.set(-1.68 + c * 0.48, 0.24 + r * 0.22, 0.55 - r * 0.38); T.add(b); mesh(new THREE.CylinderGeometry(0.17, 0.12, 0.09, 10), mat(0xffd23a, { m: 0.7, r: 0.3 }), 0, 0.04, 0, b); mesh(new THREE.SphereGeometry(0.13, 8, 6).scale(1, 0.7, 1), mat(foodCols[(c * 3 + r) % 8]), 0, 0.12, 0, b); BOWLS.push(b); }
}
const tl = [lamp(T, -2.7, 0.1, 0.6, 0.9), lamp(T, 2.7, 0.1, 0.6, 0.9)];
// the counter board: 50? 100? 56! and 8 × 7 = 56
const cc = document.createElement('canvas'); cc.width = 512; cc.height = 256; const cTex = new THREE.CanvasTexture(cc); cTex.colorSpace = THREE.SRGBColorSpace;
const board = noOut(new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.3), new THREE.MeshBasicMaterial({ map: cTex, transparent: true }))); board.position.set(40, 3.55, -2.4); scene.add(board);
let lastTxt = null;
function boardText(txt, col, strike) {
  const key = txt + col + strike; if (key === lastTxt) return; lastTxt = key;
  const c = cc.getContext('2d'); c.clearRect(0, 0, 512, 256); c.fillStyle = 'rgba(40,10,20,0.78)'; c.beginPath(); c.roundRect(8, 8, 496, 240, 40); c.fill(); c.lineWidth = 10; c.strokeStyle = '#ffd23a'; c.stroke();
  c.font = '900 150px Nunito, Arial Black, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineWidth = 14; c.strokeStyle = '#1d1a24'; c.strokeText(txt, 256, 136); c.fillStyle = col; c.fillText(txt, 256, 136);
  if (strike) { c.lineWidth = 18; c.strokeStyle = '#ff3a4a'; c.beginPath(); c.moveTo(80, 60); c.lineTo(432, 200); c.stroke(); }
  cTex.needsUpdate = true;
}

// ---------------- the cast
const C = makeCast(scene, [['k', 'kidKrishna'], ['yashoda', 'yashoda'], ['g1', 'gopi1'], ['g2', 'gopi2'], ['g3', 'gopi3'], ['m1', 'crowd'], ['m2', 'govinda'], ['b1', 'kid1'], ['b2', 'kid2'], ['picture', 'kidKrishna'], ['priest', 'priest']]);
addOutlines(scene);
const confetti = makeConfetti(scene, 70, 24);
// where the villagers stand: around the feast, then under the hill, then bringing food
const VIL = [['yashoda', [1.6, 9.2], [1.2, -1.2], [-1.0, 6.4]], ['g1', [-1.8, 9.4], [-1.4, -1.0], [1.0, 6.4]], ['g2', [-0.6, 9.9], [-2.4, -2.6], [-1.7, 7.2]], ['g3', [0.6, 9.9], [2.4, -2.8], [1.7, 7.2]],
  ['m1', [-2.8, 8.4], [-0.9, -4.6], [-2.6, 8.2]], ['m2', [2.8, 8.4], [0.9, -4.8], [2.6, 8.2]], ['b1', [-2.2, 10.6], [-0.5, -1.7], [-0.9, 9.2]], ['b2', [2.2, 10.6], [0.6, -1.6], [0.9, 9.2]]];
const FLASH = [E.thunder, E.lightning + 0.1, E.sent + 0.5, E.village2 + 0.6, E.so2 + 0.8, E.wait + 0.2, E.seven + 0.5, E.seven + 1.7];
const flashAt = (t) => FLASH.reduce((a, t0) => a + (t >= t0 && t < t0 + 0.5 ? Math.exp(-(t - t0) * 9) * (1 + 0.6 * Math.sin((t - t0) * 60)) : 0), 0);

function update(s, t) {
  const cx = camera.position.x, temple = cx > 20;
  // weather: sunny, then storm (Indra furious) until the sun comes out; seven days and nights pass in a blink
  const storm = sm(seg(s, E.indra2, E.sent + 0.4)) * (1 - sm(seg(s, E.sun - 0.2, E.sun + 0.8)));
  const days = s >= E.seven && s < E.and3 ? 0.5 + 0.5 * Math.cos((s - E.seven) / (E.and3 - E.seven) * Math.PI * 2 * 7) : 1;
  const fl = temple ? 0 : flashAt(t);
  S.mood(temple ? 0.15 : storm * (0.55 + 0.4 * (1 - days)) + (s >= E.seven && s < E.and3 ? (1 - days) * 0.3 : 0));
  S.hemi.intensity += fl * 1.6; S.sun.intensity += fl * 2; if (temple) S.hemi.intensity = 1.25;
  S.sun.target.position.set(temple ? 40 : 0, 0, temple ? 0 : 3); S.sun.position.set((temple ? 40 : 0) - 8, 14, 12); S.sun.target.updateMatrixWorld();
  bolt.visible = fl > 0.45 && !temple; bolt.position.set(6 - (Math.floor(t * 3) % 3) * 5, 0, -12);
  // Indra: smiling white cloud, then dark and furious
  const fur = sm(seg(s, E.indra2, E.indra2 + 0.6));
  cloudMat.color.set(new THREE.Color(0xffffff).lerp(new THREE.Color(0x4a5070), fur)); indra.position.y = 10.5 + Math.sin(t * 1.2) * 0.2; indra.rotation.z = fur * Math.sin(t * 9) * 0.03;
  brows.forEach((b, i) => { b.rotation.z = (i ? 1 : -1) * lerp(-0.15, 0.45, fur); b.position.y = lerp(1.05, 0.8, fur); });
  eyes.forEach((e) => e.scale.set(1, lerp(1, 0.75, fur), 1));
  indra.visible = s >= E.indra - 0.4 && s < E.sun + 0.6;
  // the feast fires and pots
  fires.forEach((f, i) => { f.visible = storm < 0.6; f.scale.y = 1 + 0.25 * Math.sin(t * 12 + i); });
  // the hill rises on one little finger, and comes down when the sun is out
  const lift = sm(seg(s, E.lifted - 0.05, E.lifted + 0.5)) * (1 - sm(seg(s, E.sun + 0.2, E.sun + 1.4)));
  const kH = 1.45, onRock = s >= E.lifted - 0.2 && s < E.sun + 1.4;
  const right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0); right.y = 0; right.normalize();
  const handY = 1.0 + 1.335 * kH / 1.7, hand = V(MC.x, 0, MC.z).add(right.clone().multiplyScalar(-0.232 * kH / 1.7));
  hill.position.set(lerp(MC.x, hand.x, lift), lift * (handY + 0.86) + Math.sin(t * 1.5) * 0.04 * lift, lerp(MC.z, hand.z, lift));
  underL.position.set(MC.x, 1.4, MC.z + 1.5); underL.intensity = lift * 7;
  hill.rotation.z = Math.sin(t * 1.1) * 0.015 * lift;
  // Krishna: by Yashoda, walks to the hill, holds it up, then eats with everyone
  const walk = seg(s, E.so2, E.lifted - 0.2);
  let kp, kpose;
  if (s >= E.sun + 1.4) { kp = V(0, 0, 9.3); kpose = { mood: 'happy', sitting: true, butter: s >= E.mothers }; }
  else if (onRock) { kp = V(MC.x, 1.0, MC.z); kpose = { mood: s >= E.finger ? 'happy' : 'normal', arm: lift > 0.02 ? 'up' : 'down', wink: false }; if (s >= E.wait + 0.6 && s < E.seven + 0.5) kpose.mood = 'wink'; }
  else if (s >= E.so2) { kp = V(lerp(0.4, 0, walk), 0, lerp(7.6, MC.z + 4.9, walk)); kpose = { mood: 'normal', step: walk < 1 ? s * 3 : 0 }; }
  else { kp = V(0.4, 0, 7.6); kpose = { mood: s >= E.little && s < E.lets ? 'wow' : s >= E.sent && s < E.so2 ? 'sad' : 'happy', arm: s >= E.mountain && s < E.so ? 'point' : 'down', flip: s >= E.mountain && s < E.so }; }
  pose(C.k, camera, { x: kp.x, y: kp.y, z: kp.z, h: kH, ...kpose });
  // villagers
  const under = sm(seg(s, E.every, E.every + 1.6)) * (1 - sm(seg(s, E.sun + 0.6, E.sun + 1.8)));
  VIL.forEach(([n, a, b, c], i) => {
    const home = s >= E.sun + 1.0 ? c : a, p = V(lerp(home[0], b[0], under), 0, lerp(home[1], b[1], under)), moving = (under > 0.02 && under < 0.98);
    const pray = s >= E.lets && s < E.indra2;
    const feeding = s >= E.mothers - 0.3 && ['yashoda', 'g1', 'g2', 'g3'].includes(n);
    pose(C[n], camera, { x: p.x, z: p.z, h: n[0] === 'b' ? 1.2 : n === 'yashoda' ? 1.65 : 1.6, step: moving ? s * 3.5 + i : 0, flip: p.x > 0,
      mood: pray ? 'closed' : storm > 0.5 && under < 0.5 ? 'wow' : under > 0.5 && s >= E.wait ? 'happy' : storm > 0.5 ? 'sad' : 'happy', arm: feeding ? 'offer' : pray ? 'up' : 'down', pot: feeding });
  });
  // cows: graze at the foot of the hill, shelter beneath it, then home
  cows.forEach((c, i) => { const p = cowHome[i].clone().lerp(cowUnder[i], under); c.position.set(p.x, 0, p.z); c.children[1].rotation.z = storm < 0.3 ? Math.sin(t * 5 + i) * 0.12 : 0.25; });
  // the flood rises in the village and drains away
  const fd = sm(seg(s, E.village2 - 0.3, E.so2)) * (1 - sm(seg(s, E.sun, E.sun + 1.6)));
  flood.visible = fd > 0.01; flood.position.y = 0.02 + fd * 0.32; const fp = flood.geometry.attributes.position; for (let i = 0; i < fp.count; i++) fp.setY(i, Math.sin(fbase[i * 3] * 0.8 + t * 2) * 0.05 + Math.cos(fbase[i * 3 + 2] * 0.9 - t * 1.6) * 0.04); fp.needsUpdate = true;
  // rain everywhere in the village, none under the hill once it is up
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0.12)), one = V(1, 1, 1), zero = V(0, 0, 0), roof = hill.position.y;
  for (let i = 0; i < RAIN; i++) { const [x, y0, z, ph] = rainBase[i]; const y = ((y0 - t * 13 - ph * 14) % 14 + 14) % 14; const shield = lift > 0.5 && Math.hypot(x - MC.x, z - MC.z) < 4.4 && y < roof + 4.6; m4.compose(V(x, y, z), q, shield || (lift < 0.5 && Math.hypot(x - MC.x, z - MC.z) < 4.2 && y < 4.2) ? zero : one); rain.setMatrixAt(i, m4); }
  rain.instanceMatrix.needsUpdate = true; rain.visible = storm > 0.25 && !temple;
  // the bhog: bowls fill 8 a day for 7 days; the board counts
  const fillA = clamp((s - E.and3 - 0.3) / (E.eight2 - E.and3 - 0.3)) * 8, fillB = 8 + clamp((s - E.eight2) / (E.fifty - E.eight2)) * 48, nB = s >= E.fifty ? 56 : s >= E.eight2 ? Math.floor(fillB) : Math.floor(fillA);
  BOWLS.forEach((b, j) => { const i = j < 8 ? [3, 4, 2, 5, 1, 6, 0, 7].indexOf(j) : j; const k = clamp((nB - i) * 1.0); b.visible = k > 0; b.scale.setScalar(sm(clamp(nB - i)) * 0.9 + 0.1 * (k > 0)); });
  board.visible = !(t < E.not && t < E.as);
  if (t < E.as) { if (t < E.not) boardText('56?', '#ffd23a'); else if (t < E.not2) boardText('50', '#ffffff', true); else if (t < E.exactly) boardText('100', '#ffffff', true); else boardText('56', '#ffd23a'); }
  else if (s < E.eight2) boardText('8 / day', '#ffffff'); else if (s < E.fifty - 0.1) boardText('8 × 7', '#ffffff'); else boardText('56', '#ffd23a');
  pose(C.picture, camera, { x: 40, y: 1.15, z: -2.9, h: 1.7, mood: 'happy', arm: 'up' }); C.picture.m.quaternion.identity();
  pose(C.priest, camera, { visible: s >= E.thats - 0.3 || t < E.as, x: 42.6, z: 0.9, mood: 'closed', arm: 'wave', flip: true });
  tl.forEach((l, i) => (l.flame.scale.y = 1 + 0.15 * Math.sin(t * 13 + i)));
  confetti(E.fifty, s, V(40, 3.4, -0.6));
  S.clouds.forEach((c, i) => { c.position.x = -80 + i * 15 + ((t * 0.6 + i * 3) % 12); });
}

const G = (t) => t, FULL = (t) => 60 + t;
const SHOTS = [
  [0, E.not - 0.05, FULL, [[40, 2.2, 6.8], [40, 1.6, -1.2]], [[40, 2.1, 5.8], [40, 1.6, -1.2]]],
  [E.not - 0.05, E.as - 0.05, FULL, [[40.4, 2.9, 3.3], [40, 2.6, -2.2]], [[40.2, 2.8, 2.8], [40, 2.5, -2.2]]],
  [E.as - 0.05, E.village + 1.1, G, [[0, 12, 26], [0, 2, 2]], [[0, 7.5, 21], [0, 1.5, 3]]],
  [E.village + 1.1, E.indra - 0.05, G, [[2.4, 1.7, 12.2], [0, 0.8, 8.4]], [[1.9, 1.6, 11.4], [0, 0.8, 8.2]]],
  [E.indra - 0.05, E.little - 0.05, G, [[4, 8.2, -0.5], [4, 10.6, -11]], [[4, 8.6, -2.5], [4, 10.6, -11]]],
  [E.little - 0.05, E.mountain - 0.25, G, [[1.4, 1.35, 10.3], [0.6, 1.0, 7.6]], [[1.2, 1.3, 9.8], [0.6, 1.0, 7.6]]],
  [E.mountain - 0.25, E.lets - 0.05, G, [[3.5, 2.4, 11.5], [-0.5, 1.8, 0]], [[2.8, 2.2, 10.2], [-0.5, 1.8, 0]]],
  [E.lets - 0.05, E.and - 0.05, G, [[0, 2.0, 13.5], [0, 2.4, -2]], [[0, 2.3, 12.4], [0, 2.6, -2]]],
  [E.and - 0.05, E.sent - 0.05, G, [[4, 8.5, -1], [4, 10.6, -11]], [[4, 9.2, -3.6], [4, 10.6, -11]]],
  [E.sent - 0.05, E.thunder - 0.05, G, [[0, 6, 19], [0, 3, -2]], [[0, 5, 17], [0, 3, -2]]],
  [E.thunder - 0.05, E.village2 - 0.05, G, [[-2.6, 1.2, 12.6], [-0.4, 1.3, 8.5]], [[-2.2, 1.2, 12.0], [-0.4, 1.3, 8.5]]],
  [E.village2 - 0.05, E.so2 - 0.05, G, [[4.5, 1.7, 12.8], [0, 0.4, 8]], [[4.1, 1.6, 12.2], [0, 0.4, 8]]],
  [E.so2 - 0.05, E.lifted - 0.25, G, [[0.5, 3.2, 9.0], [0, 1.4, -1]], [[0.4, 3.0, 8.2], [0, 1.6, -1]]],
  [E.lifted - 0.25, E.finger - 0.3, G, [[0, 2.5, 9.6], [0, 2.6, -3]], [[0, 2.4, 8.8], [0, 2.7, -3]]],
  [E.finger - 0.3, E.every - 0.05, G, [[0.6, 1.5, 0.9], [0, 1.95, -3]], [[0.55, 1.55, 0.5], [0, 1.95, -3]]],
  [E.every - 0.05, E.wait - 0.05, G, [[5.5, 1.5, 6.5], [0, 1.4, -2.5]], [[5.0, 1.5, 5.8], [0, 1.4, -2.5]]],
  [E.wait - 0.05, E.seven - 0.05, G, [[0.6, 1.9, -0.1], [0, 1.8, -3]], [[0.55, 1.9, -0.4], [0, 1.8, -3]]],
  [E.seven - 0.05, E.and3 - 0.05, G, [[0, 3.6, 12], [0, 2.4, -3]], [[0, 3.3, 10.5], [0, 2.4, -3]]],
  [E.and3 - 0.05, E.eight2 - 0.05, G, [[40, 2.7, 6.4], [40, 1.3, -0.8]], [[40, 2.6, 5.9], [40, 1.3, -0.8]]],
  [E.eight2 - 0.05, E.sun - 0.4, G, [[40, 3.0, 5.6], [40, 1.8, -1.5]], [[40, 2.9, 5.0], [40, 1.9, -1.5]]],
  [E.sun - 0.4, E.mothers - 0.05, G, [[0, 4.5, 17], [0, 2.5, 0]], [[0, 4.0, 15.5], [0, 2.2, 0]]],
  [E.mothers - 0.05, E.thats - 0.05, G, [[1.8, 1.6, 12.8], [0, 0.8, 8.4]], [[1.6, 1.5, 12.2], [0, 0.8, 8.4]]],
  [E.thats - 0.05, E.krishna5 - 0.05, G, [[40, 2.6, 8.5], [40, 1.8, -1.5]], [[40, 2.4, 7.2], [40, 1.7, -1.5]]],
  [E.krishna5 - 0.05, E.comment - 0.05, G, [[41.2, 1.3, 2.4], [39.8, 0.9, -0.6]], [[40.9, 1.3, 2.1], [39.6, 0.9, -0.6]]],
  [E.comment - 0.05, DURATION + 0.1, (t) => E.mothers + 1.5 + (t - E.comment), [[0, 2.8, 15], [0, 1.6, 2]], [[0, 2.6, 13.8], [0, 1.6, 2]]],
];
direct({ stage, WORDS, DURATION, shots: SHOTS, update, title: E.not - 0.05, q: [E.wait, E.seven], cta: E.comment,
  key: ['krishna', 'fifty-six', 'dishes', 'fifty', 'hundred', 'exactly', 'story', 'vraj', 'feast', 'indra', 'rain', 'mountain', 'grass', 'govardhan', 'furious', 'storm', 'thunder', 'lightning', 'flood', 'lifted', 'finger', 'family', 'cow', 'wait', 'seven', 'days', 'bite', 'eight', 'meals', 'sun', 'mothers', 'missed', 'today', 'comment', 'bhog'],
  loc: (t) => (t >= E.as - 0.05 && t < E.village + 1.1 ? '📍 VRAJ · LONG AGO' : t >= E.seven - 0.05 && t < E.and3 - 0.05 ? 'DAY ' + Math.min(7, 1 + Math.floor((t - E.seven) / (E.and3 - E.seven) * 7)) : t >= E.thats - 0.05 && t < E.krishna5 ? 'EVEN TODAY' : ''),
  shakes: [], tick: () => {} });
