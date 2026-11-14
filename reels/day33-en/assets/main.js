// Day 33 · "Why did Arjuna's chariot burn?" · Why we do what we do #15 (as the story goes: after the war, Krishna steps down last)
// One set: Kurukshetra at sunset after the war; the chariot faces +x with four white horses and Hanuman on the flag.
import * as THREE from './three.module.js';
import { rng, mat, mesh, sm, seg, lerp, clamp, setupScene, makeCast, pose } from './kit.js';
import { makeStage, direct, wordTime } from './director.js';
import { addOutlines, makeConfetti } from './plus.js';
import { WORDS, DURATION } from './data.js';

const stage = makeStage(), { scene, camera } = stage, V = (x, y, z) => new THREE.Vector3(x, y, z), R = rng(33);
const S = setupScene(scene, [[0, 0]], 33);
const WT = wordTime(WORDS);
const E = { after: WT('after'), arjuna2: WT('arjuna', 2), as: WT('as'), krishna: WT('krishna'), arjuna3: WT('arjuna', 3), arjuna4: WT('arjuna', 4), the2: WT('charioteer') - 0.28, but: WT('but'),
  then: WT('then'), krishna2: WT('krishna', 2), and2: WT('moment') - 0.36, the4: WT('burst', 2) - 0.58, wait: WT('wait'), for: WT('for'), only: WT('only'), the6: WT('moment', 2) - 0.18, thats: WT("that's"), comment: WT('comment') };
const glow = (c, o = 0.5) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, depthWrite: false, blending: THREE.AdditiveBlending });
const noOut = (m) => { m.userData.noOutline = true; m.castShadow = false; return m; };

// ---------------- the field after the war: arrows in the ground, a fallen flag, a broken wheel
mesh(new THREE.CylinderGeometry(30, 30, 0.06, 32), mat(0xc9a46a), 0, 0.03, 0, scene).castShadow = false;
for (let i = 0; i < 70; i++) { const a = R() * Math.PI * 2, r = 3 + R() * 14, g = new THREE.Group(); g.position.set(Math.cos(a) * r, 0, Math.sin(a) * r * 0.7 - 3); g.rotation.set((R() - 0.5) * 0.8, R() * 3, (R() - 0.5) * 0.8); scene.add(g); noOut(mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.8, 4), mat(0x8a6a3a), 0, 0.3, 0, g)); noOut(mesh(new THREE.ConeGeometry(0.04, 0.1, 4), mat(0xe0e0e8), 0, 0.72, 0, g)); }
{ const w = mesh(new THREE.TorusGeometry(0.6, 0.06, 6, 16), mat(0x6b4a2a), -5, 0.08, -4, scene); w.rotation.x = Math.PI / 2; const f = mesh(new THREE.BoxGeometry(0.9, 0.5, 0.03), mat(0xe0213a), 4.5, 0.06, -5, scene); f.rotation.x = -Math.PI / 2; }
// ---------------- the chariot
const CH = new THREE.Group(); scene.add(CH);
const wood = mat(0x8a5a2a), goldM = mat(0xffd23a, { m: 0.6, r: 0.35 }), chMats = [wood, goldM];
mesh(new THREE.BoxGeometry(1.7, 0.18, 1.2), wood, 0, 0.92, 0, CH);
mesh(new THREE.BoxGeometry(0.08, 0.55, 1.2), goldM, 0.85, 1.25, 0, CH); for (const z of [-0.6, 0.6]) mesh(new THREE.BoxGeometry(1.7, 0.35, 0.06), wood, 0, 1.15, z, CH);
mesh(new THREE.BoxGeometry(1.72, 0.06, 0.08), goldM, 0, 1.34, 0.62, CH);
for (const z of [-0.72, 0.72]) { const wh = new THREE.Group(); wh.position.set(-0.1, 0.72, z); CH.add(wh); mesh(new THREE.TorusGeometry(0.66, 0.06, 6, 20), wood, 0, 0, 0, wh); for (let i = 0; i < 6; i++) { const sp = mesh(new THREE.BoxGeometry(0.04, 1.3, 0.04), goldM, 0, 0, 0, wh); sp.rotation.z = i / 6 * Math.PI; } mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.12, 8).rotateX(Math.PI / 2), goldM, 0, 0, 0, wh); }
const pole = mesh(new THREE.BoxGeometry(2.0, 0.07, 0.07), wood, 1.8, 0.8, 0, CH);
mesh(new THREE.CylinderGeometry(0.04, 0.04, 3.2, 6), wood, -0.75, 2.4, -0.45, CH);
// Hanuman's flag
const fc = document.createElement('canvas'); fc.width = 256; fc.height = 160; { const c = fc.getContext('2d'); c.fillStyle = '#f6a531'; c.beginPath(); c.moveTo(0, 0); c.lineTo(256, 30); c.lineTo(256, 130); c.lineTo(0, 160); c.closePath(); c.fill();
  c.fillStyle = '#c0601a'; c.beginPath(); c.arc(110, 80, 46, 0, 7); c.fill(); c.fillStyle = '#f2d2a0'; c.beginPath(); c.ellipse(110, 92, 28, 24, 0, 0, 7); c.fill(); c.fillStyle = '#1d1a24'; for (const ex of [96, 124]) { c.beginPath(); c.arc(ex, 72, 6, 0, 7); c.fill(); } c.lineWidth = 4; c.strokeStyle = '#1d1a24'; c.beginPath(); c.arc(110, 96, 10, 0.1 * Math.PI, 0.9 * Math.PI); c.stroke();
  c.fillStyle = '#ffd23a'; c.fillRect(80, 24, 60, 14); c.fillStyle = '#e0213a'; c.beginPath(); c.arc(110, 30, 6, 0, 7); c.fill(); c.fillStyle = '#8a5a2a'; c.fillRect(170, 40, 12, 80); c.beginPath(); c.arc(176, 40, 20, 0, 7); c.fillStyle = '#ffd23a'; c.fill(); }
const fTex = new THREE.CanvasTexture(fc); fTex.colorSpace = THREE.SRGBColorSpace;
const flag = noOut(new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.75, 8, 1), new THREE.MeshBasicMaterial({ map: fTex, side: THREE.DoubleSide, transparent: true }))); flag.position.set(-0.13, 3.6, -0.45); CH.add(flag); const fbase = flag.geometry.attributes.position.array.slice();
const flagGlow = noOut(mesh(new THREE.SphereGeometry(0.38, 16, 12), glow(0xffd23a, 0), -0.15, 3.6, -0.45, CH));
// four white horses
function horse(x, z) { const g = new THREE.Group(); g.position.set(x, 0, z); CH.add(g); const w = mat(0xf6f3ec); mesh(new THREE.BoxGeometry(1.0, 0.45, 0.32), w, 0, 1.0, 0, g); const nk = mesh(new THREE.BoxGeometry(0.22, 0.6, 0.22), w, 0.5, 1.35, 0, g); nk.rotation.z = -0.5; mesh(new THREE.BoxGeometry(0.42, 0.2, 0.2), w, 0.72, 1.62, 0, g); noOut(mesh(new THREE.BoxGeometry(0.3, 0.12, 0.24), mat(0xd9a441), 0.45, 1.6, 0, g));
  const legs = []; for (const [dx, dz] of [[-0.38, -0.1], [-0.38, 0.1], [0.38, -0.1], [0.38, 0.1]]) legs.push(mesh(new THREE.BoxGeometry(0.1, 0.8, 0.1).translate(0, -0.4, 0), w, dx, 0.82, dz, g)); mesh(new THREE.BoxGeometry(0.06, 0.4, 0.06), mat(0xd9d4c8), -0.55, 0.95, 0, g).rotation.z = 0.6; return { g, legs }; }
const horses = [[2.9, -0.5], [2.9, -0.17], [2.9, 0.17], [2.9, 0.5]].map(([x, z]) => horse(x, z));
const reins = new THREE.LineSegments(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0x5a3a1a })); reins.userData.noOutline = true; scene.add(reins);
// fire, smoke, the shield, the arrows
const fires = []; for (let i = 0; i < 46; i++) fires.push({ m: noOut(mesh(new THREE.ConeGeometry(0.16 + R() * 0.14, 0.6 + R() * 0.6, 6), new THREE.MeshBasicMaterial({ color: [0xff5a1e, 0xffb02a, 0xffd23a, 0xff7a1e][i % 4], transparent: true, opacity: 0.92 }), 0, 0, 0, scene)), p: V((R() - 0.5) * 2.0, 0.9 + R() * 0.8 + (i % 7 === 0 ? 1.8 : 0), (R() - 0.5) * 1.4), ph: R() * 6 });
const fireL = new THREE.PointLight(0xff8a2a, 0, 12, 1.4); fireL.position.set(0, 2, 1); scene.add(fireL);
const smoke = []; for (let i = 0; i < 16; i++) smoke.push(noOut(mesh(new THREE.SphereGeometry(0.35, 8, 6), new THREE.MeshBasicMaterial({ color: 0x5a5a60, transparent: true, opacity: 0.35, depthWrite: false }), 0, 0, 0, scene)));
const shield = noOut(mesh(new THREE.SphereGeometry(2.6, 32, 20), new THREE.MeshBasicMaterial({ color: 0xffd23a, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }), 0.6, 1.3, 0, scene));
const arrows = []; for (let i = 0; i < 14; i++) { const g = new THREE.Group(); scene.add(g); noOut(mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.9, 4).rotateZ(Math.PI / 2), glow(0xfff0c0, 0.95), 0, 0, 0, g)); noOut(mesh(new THREE.ConeGeometry(0.05, 0.14, 4).rotateZ(-Math.PI / 2), glow(0xffffff, 1), 0.5, 0, 0, g)); const a = (i / 14) * Math.PI * 2; arrows.push({ g, dir: V(Math.cos(a), 0.25 + (i % 3) * 0.12, -Math.abs(Math.sin(a)) * 0.8 - 0.2).normalize(), ph: i * 0.37 }); }
const sparks = []; for (let i = 0; i < 14; i++) sparks.push(noOut(mesh(new THREE.OctahedronGeometry(0.12, 0), glow(0xffe08a, 0.9), 0, 0, 0, scene)));
const hSpark = []; for (let i = 0; i < 18; i++) hSpark.push(noOut(mesh(new THREE.OctahedronGeometry(0.05, 0), glow(0xffd23a, 0.9), 0, 0, 0, scene)));
const feetGlow = noOut(mesh(new THREE.RingGeometry(0.2, 0.32, 24).rotateX(-Math.PI / 2), glow(0xffd23a, 0), 0.9, 0.08, 1.4, scene));
// ---------------- the cast
const C = makeCast(scene, [['k', 'krishna'], ['a', 'arjuna']]);
addOutlines(scene);

function update(s, t) {
  // flashback (the 18 days) and the closing image: the chariot whole, both aboard, the shield up
  const shielded = (s >= E.for && s < E.the6) || s >= E.thats;
  const night = s >= E.for && s < E.the6 ? 0.75 : 0;
  S.mood(night); if (!night) { S.paintSky(new THREE.Color(0x6a7ad0), new THREE.Color(0xffb46a)); S.sun.color.set(0xffc080); S.sun.position.set(-12, 8, 6); S.hemi.intensity = 1.25; }
  const burn = shielded ? 0 : sm(seg(s, E.the4 + 0.1, E.the4 + 0.9)), charred = !shielded && s >= E.wait;
  chMats.forEach((m, i) => m.color.set(new THREE.Color(i ? 0xffd23a : 0x8a5a2a).lerp(new THREE.Color(0x2a2220), charred ? 0.85 : burn * 0.4)));
  fires.forEach(({ m, p, ph }, i) => { const on = !shielded && burn > 0.02 && s < E.the6 + 1.6; m.visible = on; if (!on) return; const k = burn * (s >= E.wait + 0.5 ? 0.55 : 1); m.position.copy(p).add(V(0, Math.sin(t * 7 + ph) * 0.05, 0)); m.scale.set(k, k * (1 + 0.35 * Math.sin(t * 11 + ph)), k); m.rotation.y = t + ph; });
  fireL.intensity = shielded ? 0 : burn * 8 * (1 + 0.15 * Math.sin(t * 13));
  smoke.forEach((m, i) => { const u = (t * 0.25 + i / 16) % 1; m.visible = !shielded && burn > 0.3; m.position.set((i % 4 - 1.5) * 0.4 + u * 0.6, 1.6 + u * 4, (i % 3 - 1) * 0.3); m.scale.setScalar(0.6 + u * 1.8); m.material.opacity = 0.35 * (1 - u); });
  // horses: they shy away from the flames
  const shy = shielded ? 0 : sm(seg(s, E.the4 + 0.2, E.the4 + 1.6));
  horses.forEach(({ g, legs }, i) => { g.position.x = 2.9 + shy * 2.4; g.position.z = [-0.5, -0.17, 0.17, 0.5][i] + shy * (i - 1.5) * 0.5; const gait = shy > 0 && shy < 1 ? Math.sin(t * 14 + i) * 0.4 : Math.sin(t * 2 + i) * 0.03; legs.forEach((l, k) => (l.rotation.z = (k % 2 ? 1 : -1) * gait)); g.rotation.y = shy * (i - 1.5) * 0.15; });
  pole.visible = shy < 0.5;
  // the flag waves; Hanuman bows, glows and vanishes
  const fp = flag.geometry.attributes.position; for (let i = 0; i < fp.count; i++) { const x = fbase[i * 3]; fp.setZ(i, Math.sin(x * 4 - t * 5) * 0.06 * (x + 0.6)); } fp.needsUpdate = true;
  const gone = shielded ? 0 : sm(seg(s, E.then + 1.4, E.krishna2 - 0.3));
  flag.material.opacity = 1 - gone * (s >= E.krishna2 ? 1 : 0.6); flag.visible = shielded || s < E.krishna2 + 0.4; flag.rotation.x = !shielded && s >= E.then + 0.5 && s < E.then + 1.4 ? 0.35 : 0;
  flagGlow.material.opacity = shielded ? 0 : sm(seg(s, E.then + 0.4, E.then + 1.4)) * (1 - sm(seg(s, E.krishna2 - 0.3, E.krishna2 + 0.3))) * 0.5;
  hSpark.forEach((m, i) => { const u = s - E.then - 1.3 - (i % 9) * 0.06; m.visible = !shielded && u > 0 && u < 1.8; const a = i * 2.4; m.position.set(-0.85 + Math.cos(a) * 0.4, 3.6 + u * 1.6, -0.45 + Math.sin(a) * 0.3); m.rotation.y = t * 4; });
  // Krishna and Arjuna: aboard, then Arjuna down, then Krishna down; both aboard in the flashback
  const aDown = shielded ? 0 : sm(seg(s, E.but, E.then)), kDown = shielded ? 0 : sm(seg(s, E.krishna2, E.and2 - 0.1));
  const aP = V(lerp(-0.4, -1.4, aDown), lerp(1.0, 0, aDown) + Math.sin(aDown * Math.PI) * 0.3, lerp(0.05, 1.4, aDown)), kP = V(lerp(0.55, 0.9, kDown), lerp(1.0, 0, kDown) + Math.sin(kDown * Math.PI) * 0.3, lerp(0.05, 1.4, kDown));
  const aboard = kDown < 0.05;
  pose(C.k, camera, { x: kP.x, y: kP.y, z: kP.z, h: 1.7, sitting: aboard, mood: s >= E.only && s < E.the6 ? 'closed' : 'happy', arm: s >= E.arjuna3 && s < E.arjuna4 ? 'point' : 'down', flip: true });
  pose(C.a, camera, { x: aP.x, y: aP.y, z: aP.z, h: 1.7, bow: true, mood: s >= E.arjuna4 && s < E.the2 ? 'wow' : s >= E.the4 && s < E.the6 && !shielded ? 'wow' : 'happy', arm: s >= E.arjuna2 && s < E.as ? 'up' : 'down' });
  // reins from Krishna's hands to the horses while he holds them
  { const kh = kP.clone().add(V(0.25, 0.75, 0)), pts = []; if (aboard && shy < 0.3) horses.forEach(({ g }) => { const hp = g.position.clone().add(V(0.7, 1.55, 0)); pts.push(kh.x, kh.y, kh.z, hp.x, hp.y, hp.z); }); reins.geometry.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3)); }
  feetGlow.material.opacity = shielded ? 0 : sm(seg(s, E.and2 - 0.1, E.and2 + 0.3)) * (1 - sm(seg(s, E.the4, E.the4 + 0.5))) * 0.9; feetGlow.scale.setScalar(1 + (s - E.and2) * 0.8);
  // the shield and the arrows that never get through
  shield.material.opacity = shielded ? 0.12 + 0.04 * Math.sin(t * 3) : 0;
  arrows.forEach(({ g, dir, ph }, i) => { const u = ((t * 0.7 + ph) % 1); g.visible = shielded; const start = V(0.6, 1.3, 0).add(dir.clone().multiplyScalar(9)), hit = V(0.6, 1.3, 0).add(dir.clone().multiplyScalar(2.6)); g.position.copy(start.lerp(hit, Math.min(1, u * 1.25))); g.lookAt(V(0.6, 1.3, 0)); g.rotateY(-Math.PI / 2);
    const sp = sparks[i]; sp.visible = shielded && u > 0.8; sp.position.copy(hit); sp.scale.setScalar(1 + (u - 0.8) * 6); sp.material.opacity = 0.9 * (1 - (u - 0.8) * 5); });
  S.clouds.forEach((c, i) => { c.position.x = -80 + i * 15 + ((t * 0.6 + i * 3) % 12); });
}

const G = (t) => t, HOOK = (t) => E.the4 + 1.2 + t * 0.2;
const SHOTS = [
  [0, E.after - 0.05, HOOK, [[0.6, 2.4, 8.5], [0.6, 1.5, 0]], [[0.6, 2.2, 7.4], [0.6, 1.6, 0]]],
  [E.after - 0.05, E.arjuna2 - 0.05, G, [[-3, 6, 16], [0.6, 1, 0]], [[-2, 4.5, 13], [0.6, 1, 0]]],
  [E.arjuna2 - 0.05, E.as - 0.05, G, [[-0.2, 1.9, 3.0], [-0.4, 1.8, 0]], [[-0.25, 1.9, 2.7], [-0.4, 1.8, 0]]],
  [E.as - 0.05, E.krishna - 0.05, G, [[1.4, 2.0, 8.4], [1.2, 1.4, 0]], [[1.2, 1.9, 7.6], [1.2, 1.4, 0]]],
  [E.krishna - 0.05, E.arjuna4 - 0.05, G, [[1.1, 1.7, 2.8], [0.6, 1.5, 0]], [[1.05, 1.7, 2.5], [0.6, 1.5, 0]]],
  [E.arjuna4 - 0.05, E.the2 - 0.05, G, [[-0.1, 1.9, 2.8], [-0.4, 1.8, 0]], [[-0.12, 1.9, 2.6], [-0.4, 1.8, 0]]],
  [E.the2 - 0.05, E.but - 0.05, G, [[1.3, 1.6, 3.4], [0.7, 1.4, 0]], [[1.2, 1.6, 3.0], [0.7, 1.4, 0]]],
  [E.but - 0.05, E.then - 0.05, G, [[-1.0, 1.6, 5.6], [-0.9, 1.0, 0.6]], [[-1.0, 1.5, 5.2], [-1.0, 1.0, 0.8]]],
  [E.then - 0.05, E.krishna2 - 0.05, G, [[-0.2, 3.6, 2.4], [-0.15, 3.6, -0.45]], [[-0.2, 3.7, 2.0], [-0.15, 3.8, -0.45]]],
  [E.krishna2 - 0.05, E.and2 - 0.05, G, [[1.8, 1.6, 5.4], [0.8, 1.0, 0.6]], [[1.6, 1.5, 5.0], [0.8, 0.9, 0.9]]],
  [E.and2 - 0.05, E.the4 - 0.05, G, [[1.0, 0.45, 3.0], [0.9, 0.2, 1.4]], [[1.0, 0.4, 2.8], [0.9, 0.2, 1.4]]],
  [E.the4 - 0.05, E.wait - 0.05, G, [[0.4, 2.2, 9.0], [0.4, 1.6, 0]], [[0.4, 2.4, 9.8], [0.4, 1.8, 0]]],
  [E.wait - 0.05, E.for - 0.05, G, [[-1.3, 1.6, 3.6], [-1.4, 1.3, 1.4]], [[-1.3, 1.6, 3.4], [-1.4, 1.3, 1.4]]],
  [E.for - 0.05, E.only - 0.05, G, [[3.5, 3.0, 9.5], [0.6, 1.4, 0]], [[1.0, 3.4, 10.0], [0.6, 1.4, 0]]],
  [E.only - 0.05, E.the6 - 0.05, G, [[1.2, 1.7, 3.0], [0.6, 1.5, 0]], [[1.1, 1.7, 2.6], [0.6, 1.5, 0]]],
  [E.the6 - 0.05, E.thats - 0.05, G, [[0.2, 2.0, 7.4], [0.2, 1.2, 0.6]], [[0.2, 1.9, 6.8], [0.2, 1.2, 0.6]]],
  [E.thats - 0.05, E.comment - 0.05, G, [[5.0, 2.0, 6.0], [1.2, 1.4, 0]], [[3.8, 2.2, 7.4], [1.0, 1.4, 0]]],
  [E.comment - 0.05, DURATION + 0.1, G, [[3.6, 2.4, 8.6], [1.0, 1.6, 0]], [[3.4, 2.4, 8.2], [1.0, 1.6, 0]]],
];
direct({ stage, WORDS, DURATION, shots: SHOTS, update, title: E.after - 0.05, q: [E.wait, E.for], cta: E.comment,
  key: ['arjuna', "arjuna's", 'chariot', 'flames', 'war', 'won', 'story', 'krishna', 'first', 'surprised', 'charioteer', 'obeyed', 'hanuman', 'flag', 'vanished', 'ground', 'burst', 'wait', 'weapons', 'held', 'burned', 'reins', 'nothing', 'touch', 'comment'],
  loc: (t) => (t >= E.after - 0.05 && t < E.arjuna2 - 0.05 ? '📍 KURUKSHETRA · DAY 18' : t >= E.for - 0.05 && t < E.the6 - 0.05 ? '18 DAYS OF WAR' : ''), shakes: [], tick: () => {} });
