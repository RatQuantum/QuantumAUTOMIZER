// Series 1 · "Arjuna's Charioteer" · Part 1: "The bow hits the ground" (narrator: Ishan, 12, keeper of the chariot's horses)
// Choice ending: A = run to Arjuna and pick up his bow · B = stay still and listen to Krishna.
// Set: Kurukshetra at dawn. Pandava army behind (+z), Kaurava army ahead (-z); the chariot drives into the middle.
import * as THREE from './three.module.js';
import { rng, mat, mesh, sm, seg, lerp, clamp, setupScene, makeCast, pose } from './kit.js';
import { makeStage, direct, wordTime } from './director.js';
import { addOutlines } from './plus.js';
import { WORDS, DURATION } from './data.js';

const stage = makeStage(), { scene, camera } = stage, V = (x, y, z) => new THREE.Vector3(x, y, z), R = rng(101);
const S = setupScene(scene, [[0, 0]], 101);
const WT = wordTime(WORDS);
const E = { stay: WT('stay'), my: WT('my'), first: WT('first'), held: WT('held'), two: WT('two'), conches: WT('conches'), a2: WT('arjuna', 2), so2: WT('so', 3), grand: WT('grandfather'), drona: WT('drona'),
  cousins: WT('cousins'), but: WT('but'), hands: WT('hands'), bow: WT('bow'), greatest: WT('greatest'), sat: WT('sat'), wait: WT('wait'), turned: WT('turned'), so3: WT('should') - 0.3, comment: WT('comment'), c2: WT('comment', 2), part: WT('part') };
const glow = (c, o = 0.5) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, depthWrite: false, blending: THREE.AdditiveBlending });
const noOut = (m) => { m.userData.noOutline = true; m.castShadow = false; return m; };

// ---------------- Kurukshetra
mesh(new THREE.CylinderGeometry(30, 30, 0.06, 32), mat(0xc9a46a), 0, 0.03, 0, scene).castShadow = false;
function army(z0, col, n, seed) { const r = rng(seed), body = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.16, 0.2, 0.7, 6), mat(col), n), head = new THREE.InstancedMesh(new THREE.SphereGeometry(0.13, 8, 6), mat(0xc98a5e), n), spear = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.015, 0.015, 1.4, 4), mat(0x8a8a90), n);
  [body, head, spear].forEach((m) => { m.userData.noOutline = true; scene.add(m); }); const m4 = new THREE.Matrix4();
  for (let i = 0; i < n; i++) { const x = (r() - 0.5) * 26, z = z0 + Math.sign(z0) * r() * 9; m4.makeTranslation(x, 0.35, z); body.setMatrixAt(i, m4); m4.makeTranslation(x, 0.83, z); head.setMatrixAt(i, m4); m4.makeTranslation(x + 0.18, 0.9, z); spear.setMatrixAt(i, m4); }
  return [body, head, spear]; }
army(9, 0x2f6fa8, 420, 1); army(-9, 0x8a1a2a, 420, 2);
const banners = []; for (let i = 0; i < 10; i++) { const z = i < 5 ? 10 : -10, x = -10 + (i % 5) * 5; mesh(new THREE.CylinderGeometry(0.04, 0.04, 3, 6), mat(0x8a5a2a), x, 1.5, z, scene); banners.push(noOut(mesh(new THREE.PlaneGeometry(0.8, 0.5), new THREE.MeshStandardMaterial({ color: i < 5 ? 0x3f8fe0 : 0xd8263a, side: THREE.DoubleSide }), x + 0.4, 2.8, z, scene))); }
// ---------------- Arjuna's chariot (faces -z), four white horses, Hanuman's flag
const CH = new THREE.Group(); scene.add(CH); const gold = mat(0xffd23a, { m: 0.6, r: 0.35 });
mesh(new THREE.BoxGeometry(1.5, 0.2, 1.9), gold, 0, 0.9, 0, CH); mesh(new THREE.BoxGeometry(1.5, 0.5, 0.08), gold, 0, 1.25, -0.95, CH); for (const x of [-0.75, 0.75]) mesh(new THREE.BoxGeometry(0.06, 0.4, 1.9), gold, x, 1.15, 0, CH);
const wheels = [-0.88, 0.88].map((x) => { const w = new THREE.Group(); w.position.set(x, 0.72, 0.3); CH.add(w); mesh(new THREE.TorusGeometry(0.66, 0.06, 6, 20).rotateY(Math.PI / 2), mat(0x8a5a2a), 0, 0, 0, w); for (let i = 0; i < 6; i++) { const sp = mesh(new THREE.BoxGeometry(0.04, 1.3, 0.04), gold, 0, 0, 0, w); sp.rotation.x = i / 6 * Math.PI; } return w; });
mesh(new THREE.CylinderGeometry(0.05, 0.05, 3.2, 6), mat(0x8a5a2a), 0.6, 2.4, 0.8, CH); noOut(mesh(new THREE.PlaneGeometry(0.8, 0.55), new THREE.MeshStandardMaterial({ color: 0xffa020, side: THREE.DoubleSide }), 1.0, 3.75, 0.8, CH));
const legs = []; [[-0.55, -2.4], [-0.18, -2.4], [0.18, -2.4], [0.55, -2.4]].forEach(([x, z]) => { const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = Math.PI / 2; CH.add(g); const w = mat(0xffffff, { e: 0x5a5a5a, ei: 1 }); mesh(new THREE.BoxGeometry(0.1, 0.25, 0.3), mat(0x3a2a1a), -0.5, 1.6, 0, g); mesh(new THREE.BoxGeometry(0.08, 0.5, 0.08), mat(0x3a2a1a), 0.55, 0.9, 0, g).rotation.z = 0.5; mesh(new THREE.BoxGeometry(1.0, 0.42, 0.28), w, 0, 1.0, 0, g); const nk = mesh(new THREE.BoxGeometry(0.2, 0.6, 0.2), w, -0.5, 1.35, 0, g); nk.rotation.z = 0.5; mesh(new THREE.BoxGeometry(0.4, 0.2, 0.2), w, -0.72, 1.62, 0, g); for (const [dx, dz] of [[-0.36, -0.08], [-0.36, 0.08], [0.36, -0.08], [0.36, 0.08]]) legs.push(mesh(new THREE.BoxGeometry(0.09, 0.8, 0.09).translate(0, -0.4, 0), w, dx, 0.82, dz, g)); });
const reins = noOut(mesh(new THREE.BoxGeometry(0.02, 0.02, 2.0), mat(0x6a4020), 0, 1.25, -1.6, CH));
const shield = noOut(mesh(new THREE.SphereGeometry(2.6, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), glow(0xffd88a, 0.08), 0, 0, 0, scene));
const arrows = []; for (let i = 0; i < 12; i++) { const g = new THREE.Group(); scene.add(g); noOut(mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.8, 4).rotateX(Math.PI / 2), mat(0x8a5a2a), 0, 0, 0, g)); noOut(mesh(new THREE.ConeGeometry(0.04, 0.12, 4).rotateX(-Math.PI / 2), mat(0xc0c0c8, { m: 0.6 }), 0, 0, -0.45, g)); arrows.push({ g, ph: i / 12, a: R() * 2 - 1, b: 0.4 + R() * 0.8 }); }
const sparks = arrows.map(() => noOut(mesh(new THREE.SphereGeometry(0.12, 8, 6), glow(0xfff0a0, 0.8), 0, 0, 0, scene)));
const conch = new THREE.Group(); scene.add(conch); noOut(mesh(new THREE.ConeGeometry(0.1, 0.32, 10).rotateZ(Math.PI / 2), mat(0xfaf8f0), 0, 0, 0, conch)); noOut(mesh(new THREE.SphereGeometry(0.11, 10, 8), mat(0xfaf8f0), 0.14, 0, 0, conch));
const soundRings = [0, 1, 2].map(() => noOut(mesh(new THREE.RingGeometry(0.3, 0.36, 32), glow(0xffffff, 0), 0, 0, 0, scene)));
const fallenBow = new THREE.Group(); scene.add(fallenBow); { const c = new THREE.EllipseCurve(0, 0, 0.7, 0.7, -1.1, 1.1); const pts = c.getPoints(16).map((p) => V(p.x - 0.4, p.y, 0)); noOut(mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 16, 0.035, 5), mat(0x8a4b20), 0, 0, 0, fallenBow)); }
const tear = noOut(mesh(new THREE.SphereGeometry(0.03, 6, 4).scale(0.8, 1.3, 0.8), mat(0x7fc8ff), 0, 0, 0, scene));
const dust = []; for (let i = 0; i < 14; i++) dust.push(noOut(mesh(new THREE.SphereGeometry(0.25, 8, 6), new THREE.MeshBasicMaterial({ color: 0xe8d8b0, transparent: true, opacity: 0.4, depthWrite: false }), 0, 0, 0, scene)));
// ---------------- the cast
const C = makeCast(scene, [['is', 'ishan'], ['ar', 'arjuna'], ['k', 'krishna'], ['bh', 'bhishma'], ['dr', 'priest'], ['du', 'duryodhana'], ['c1', 'courtier'], ['c2', 'king']]);
C.dr.spec = Object.assign({}, C.bh.spec, { body: '#e8a020', top: (c, cx, hy, hr) => { c.beginPath(); c.moveTo(cx - hr * 0.72, hy + 18); c.quadraticCurveTo(cx, hy + hr + 30, cx + hr * 0.72, hy + 18); c.closePath(); c.fillStyle = '#d8d8d8'; c.fill(); for (let i = 0; i < 3; i++) line(c, [[cx - 22, hy - 42 + i * 7], [cx + 22, hy - 42 + i * 7]], 3, '#ffffff'); } });
function line(c, pts, w, col) { c.beginPath(); c.moveTo(...pts[0]); for (const p of pts.slice(1)) c.lineTo(...p); c.lineWidth = w; c.strokeStyle = col; c.lineCap = 'round'; c.stroke(); }
addOutlines(scene);

// ---------------- the choice cards (DOM overlay)
const host = document.getElementById('cta').parentElement;
const css = document.createElement('style'); css.textContent = `.choice{position:absolute;left:80px;width:920px;padding:26px 30px;border-radius:44px;font-family:"Nunito",sans-serif;font-weight:900;font-size:50px;line-height:1.15;color:#16121c;display:flex;align-items:center;gap:28px;box-shadow:0 12px 0 rgba(0,0,0,.35)}
.choice b{flex:none;width:120px;height:120px;border-radius:60px;background:#16121c;color:#fff;font-size:84px;display:flex;align-items:center;justify-content:center}
#chF{position:absolute;top:1240px;left:140px;width:800px;padding:16px 10px;border-radius:36px;background:#fff;text-align:center;font-family:"Nunito",sans-serif;font-weight:900;font-size:38px;color:#16121c}#chA{top:700px;background:#ffd23a}#chB{top:960px;background:#7fd0ff}#chHead{position:absolute;top:560px;left:0;width:1080px;text-align:center;font-family:"Nunito",sans-serif;font-weight:900;font-size:62px;color:#fff;-webkit-text-stroke:10px #16121c;paint-order:stroke fill}`;
document.head.appendChild(css);
const mk = (id, html) => { const d = document.createElement('div'); d.id = id; d.innerHTML = html; d.style.opacity = 0; host.appendChild(d); return d; };
const head = mk('chHead', 'WHAT SHOULD ISHAN DO?'), chA = mk('chA', '<b>A</b><span>Run to Arjuna and pick up his bow</span>'), chB = mk('chB', '<b>B</b><span>Stay still and listen to Krishna</span>');
chA.className = chB.className = 'choice'; const chF = mk('chF', 'FOLLOW · PART 2 TOMORROW');
function tickCards(t) { const pop = (el, t0) => { const u = clamp((t - t0) / 0.35); el.style.opacity = u; el.style.transform = `scale(${0.85 + 0.15 * (1 - Math.pow(1 - u, 3))})`; };
  pop(head, E.so3); pop(chA, E.comment - 0.1); pop(chB, E.c2 - 0.1); pop(chF, E.part - 0.1); const pick = (t - E.part) % 1.2; chA.style.outline = t > E.part && pick < 0.6 ? '10px solid #fff' : 'none'; chB.style.outline = t > E.part && pick >= 0.6 ? '10px solid #fff' : 'none'; }

const right = new THREE.Vector3();
function update(s, t) {
  S.mood(0); S.hemi.intensity = 1.3; S.sun.target.position.set(0, 0, 0); S.sun.position.set(-8, 10, 10); S.sun.target.updateMatrixWorld();
  S.paintSky(new THREE.Color(0x6a8ad8), new THREE.Color(s < E.two ? 0xffb070 : 0xffd8a0));
  right.setFromMatrixColumn(camera.matrixWorld, 0); right.y = 0; right.normalize();
  const hook = s < E.stay;
  // the chariot: charging in the hook, at the Pandava front, then driven into the middle
  const drive = sm(seg(s, E.so2, E.grand)), cz = hook ? 2 : lerp(5.5, 0, drive), moving = hook || (drive > 0 && drive < 1);
  CH.position.set(0, 0, cz); wheels.forEach((w) => (w.rotation.x = -(moving ? t * 6 : cz * 1.5))); legs.forEach((l, i) => (l.rotation.z = moving ? Math.sin(t * 12 + i) * 0.4 : Math.sin(t * 1.5 + i) * 0.03));
  dust.forEach((d, i) => { const u = (t * 0.9 + i / 14) % 1; d.visible = moving; d.position.set(Math.sin(i * 2.3) * 0.9, 0.2 + u * 0.8, cz + 1.0 + u * 2); d.scale.setScalar(0.6 + u * 1.4); d.material.opacity = 0.4 * (1 - u); });
  // arrows bounce off the golden shield in the hook
  shield.visible = hook; shield.position.set(0, 0, cz);
  arrows.forEach(({ g, ph, a, b }, i) => { const u = (t * 0.8 + ph) % 1, from = V(a * 6, 3 + b, cz - 12), hit = V(a * 1.4, 1.2 + b, cz - 1.9); g.visible = hook;
    if (u < 0.6) { g.position.copy(from.clone().lerp(hit, u / 0.6)); g.lookAt(hit.clone().add(hit.clone().sub(from))); } else { const k = (u - 0.6) / 0.4; g.position.copy(hit).add(V(a * 2 * k, 1.5 * k, -1.5 * k)); g.rotation.set(k * 10, k * 6, 0); }
    sparks[i].visible = hook && u > 0.58 && u < 0.72; sparks[i].position.copy(hit); sparks[i].scale.setScalar(0.5 + (u - 0.58) * 6); });
  // --- the people on the chariot
  const shaking = s >= E.hands && s < E.bow + 0.4, dropped = s >= E.bow + 0.2, sitting = s >= E.sat - 0.2;
  pose(C.k, camera, { visible: true, x: 0, y: 1.0, z: cz - 0.6, h: 1.72, mood: s >= E.turned ? 'happy' : s >= E.hands ? 'normal' : 'happy', arm: s >= E.conches - 0.1 && s < E.a2 ? 'offer' : 'down', flip: s >= E.turned });
  pose(C.ar, camera, { visible: true, x: shaking ? 0.35 + Math.sin(t * 40) * 0.02 : 0.35, y: sitting ? 0.95 : 1.0, z: cz + 0.35, h: 1.74, mood: sitting || s >= E.hands ? 'sad' : s >= E.a2 ? 'normal' : 'smug', bow: !dropped, arm: dropped ? 'down' : 'offer', sitting, flip: true });
  pose(C.is, camera, { visible: true, x: -0.45, y: 1.0, z: cz + 0.75, h: 1.22, mood: s >= E.wait && s < E.so3 ? 'wow' : s >= E.but ? 'normal' : 'happy', arm: s >= E.held && s < E.two ? 'offer' : 'down' });
  reins.visible = true;
  const cu = s - E.conches, kp = V(0, 1.0 + 1.72 * 0.66, cz - 0.55); conch.visible = cu > -0.1 && s < E.a2; conch.position.copy(kp).add(right.clone().multiplyScalar(0.28)); conch.rotation.y = 0;
  soundRings.forEach((r, i) => { const u = ((cu + i * 0.3) % 0.9) / 0.9; r.visible = cu > 0 && s < E.a2; r.position.copy(conch.position).add(right.clone().multiplyScalar(0.3)); r.quaternion.copy(camera.quaternion); r.scale.setScalar(0.4 + u * 3); r.material.opacity = 0.6 * (1 - u); });
  const fb = seg(s, E.bow, E.bow + 0.7); fallenBow.visible = dropped; fallenBow.position.set(0.55, lerp(1.6, 1.02, fb * fb), cz + 0.5); fallenBow.rotation.set(-Math.PI / 2 * fb, 0, 0.3);
  tear.visible = s >= E.greatest; { const u = (t * 0.9) % 1; tear.position.set(0.35, 0.95 + 1.74 * 0.66 - u * 0.25, cz + 0.42).add(right.clone().multiplyScalar(-0.1)); }
  // --- the Kaurava front line
  [['bh', -1.6, 1.8], ['dr', 0, 1.74], ['du', 1.6, 1.8], ['c1', -3.0, 1.66], ['c2', 3.0, 1.7]].forEach(([n, x, h]) => pose(C[n], camera, { visible: true, x, z: -6.5, h, mood: n === 'du' ? 'smug' : 'normal', bow: n === 'bh', arm: n === 'du' ? 'hips' : 'down' }));
  banners.forEach((b, i) => (b.rotation.y = Math.sin(t * 3 + i) * 0.3));
  tickCards(s);
  S.clouds.forEach((c, i) => { c.position.x = -80 + i * 15 + ((t * 0.6 + i * 3) % 12); });
}

const G = (t) => t;
const SHOTS = [
  [0, E.stay - 0.05, G, [[2.0, 2.5, -4.2], [0, 1.8, 1.8]], [[2.0, 2.5, -4.2], [0, 1.8, 1.8]], [62, 36], { move: 'dolly' }],
  [E.stay - 0.05, E.my - 0.05, G, [[-0.5, 1.95, 7.8], [-0.45, 1.85, 5.9]], [[-0.5, 1.95, 7.5], [-0.45, 1.85, 5.9]]],
  [E.my - 0.05, E.first - 0.05, G, [[-0.2, 1.9, 8.2], [-0.4, 1.8, 6.2]], [[-0.25, 1.9, 7.9], [-0.4, 1.8, 6.2]]],
  [E.first - 0.05, E.held - 0.05, G, [[0, 9, 18], [0, 0.5, 0]], [[0, 5, 14], [0, 1, 2]], 50, { move: 'crane', lift: 1.2 }],
  [E.held - 0.05, E.two - 0.05, G, [[4.2, 2.6, 0.6], [0, 1.3, 3.6]], [[3.8, 2.4, 0.9], [0, 1.3, 3.8]]],
  [E.two - 0.05, E.conches - 0.05, G, [[0, 4, 12], [0, 1, 0]], [[0, 14, 22], [0, 0, -2]], 50, { move: 'pull' }],
  [E.conches - 0.05, E.a2 - 0.05, G, [[0.6, 2.4, 2.8], [0, 2.3, 4.9]], [[0.55, 2.4, 3.1], [0, 2.3, 4.9]]],
  [E.a2 - 0.05, E.so2 - 0.05, G, [[1.4, 2.2, 3.4], [0.35, 2.1, 5.85]], [[1.3, 2.2, 3.7], [0.35, 2.1, 5.85]]],
  [E.so2 - 0.05, E.grand - 0.05, G, [[2.6, 1.4, 1.8], [0, 1.4, 4.5]], [[2.6, 1.4, -2.2], [0, 1.4, 0]]],
  [E.grand - 0.05, E.cousins - 0.05, G, [[-1.6, 1.9, -3.0], [-1.6, 1.5, -6.5]], [[0.2, 1.9, -3.0], [0.0, 1.5, -6.5]]],
  [E.cousins - 0.05, E.but - 0.05, G, [[0.0, 2.2, -1.6], [0, 1.2, -9]], [[0.0, 2.6, -0.8], [0, 1.0, -10]]],
  [E.but - 0.05, E.bow - 0.05, G, [[0.9, 2.2, -1.8], [0.35, 2.15, 0.35]], [[0.85, 2.2, -1.5], [0.35, 2.15, 0.35]]],
  [E.bow - 0.05, E.greatest - 0.05, G, [[2.0, 2.3, 1.8], [0.45, 1.75, 0.45]], [[1.9, 2.2, 1.7], [0.45, 1.6, 0.45]]],
  [E.greatest - 0.05, E.wait - 0.05, G, [[0.9, 2.1, -1.6], [0.35, 1.95, 0.35]], [[0.9, 2.1, -1.6], [0.35, 1.95, 0.35]], [62, 38], { move: 'dolly' }],
  [E.wait - 0.05, E.turned - 0.05, G, [[-2.2, 2.4, 3.4], [-0.3, 1.8, 0.4]], [[-1.8, 2.3, 2.8], [-0.4, 1.8, 0.6]]],
  [E.turned - 0.05, E.so3 - 0.05, G, [[-0.4, 1.95, 1.1], [0, 2.1, -0.6]], [[-0.3, 2.0, 0.55], [0, 2.1, -0.6]]],
  [E.so3 - 0.05, DURATION + 0.1, G, [[0.4, 3.0, 5.2], [0, 1.6, 0]], [[0.4, 3.0, 4.8], [0, 1.6, 0]]],
];
direct({ stage, WORDS, DURATION, shots: SHOTS, update, title: 1.6, q: [E.wait, E.turned], cta: DURATION + 5, prog: [E.but, E.so3], pin: E.wait,
  key: ['chariot', 'arrow', 'god', 'horses', 'decide', 'ishan', 'twelve', 'kurukshetra', 'white', 'armies', 'millions', 'conches', 'krishna', 'middle', 'bhishma', 'drona', 'family', 'shake', 'bow', 'ground', 'cried', 'wait', 'me', 'comment', 'a,', 'b,'],
  loc: (t) => (t >= E.my - 0.05 && t < E.first ? 'ISHAN · 12 · KEEPER OF THE HORSES' : t >= E.first - 0.05 && t < E.held ? '📍 KURUKSHETRA · DAY 1 · DAWN' : ''), shakes: [E.conches, E.bow + 0.6], tick: () => {} });
