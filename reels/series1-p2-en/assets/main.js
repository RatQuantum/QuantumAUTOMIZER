// Series 1 · "Arjuna's Charioteer" · Part 2: "The form no eye was meant to see" (viewers chose B in Part 1: 92%)
// Choice ending: A = look straight at Him · B = shut my eyes and fold my hands.
// Set: Kurukshetra at dawn. Pandava army behind (+z), Kaurava army ahead (-z); the chariot drives into the middle.
import * as THREE from './three.module.js';
import { rng, mat, mesh, sm, seg, lerp, clamp, setupScene, makeCast, pose } from './kit.js';
import { makeStage, direct, wordTime } from './director.js';
import { addOutlines } from './plus.js';
import { WORDS, DURATION } from './data.js';

const stage = makeStage(), { scene, camera } = stage, V = (x, y, z) => new THREE.Vector3(x, y, z), R = rng(101);
const S = setupScene(scene, [[0, 0]], 101);
const WT = wordTime(WORDS);
const E = { stay: WT('stay'), k2: WT('krishna', 2), smiled: WT('smiled'), soul: WT('soul'), weapons: WT('weapons'), fire: WT('fire'), water: WT('water'), wind: WT('wind'), wiped: WT('wiped'), show: WT('show'), looked: WT('looked'),
  silent: WT('silent'), wait: WT('wait'), every: WT('every'), arrow: WT('arrow'), grow: WT('grow'), taller: WT('taller'), suns: WT('suns'), thousands: WT('thousands'), universe: WT('universe'), fell: WT('fell'), light: WT('light'),
  so3: WT('should') - 0.3, comment: WT('comment'), c2: WT('comment', 2), part: WT('part') };
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
#chF{position:absolute;top:1240px;left:140px;width:800px;padding:16px 10px;border-radius:36px;background:#fff;text-align:center;font-family:"Nunito",sans-serif;font-weight:900;font-size:38px;color:#16121c}#chA{top:700px;background:#ffd23a}#chB{top:960px;background:#7fd0ff}#recap{position:absolute;top:640px;left:90px;width:900px;padding:30px;border-radius:44px;background:#7fd0ff;text-align:center;font-family:"Nunito",sans-serif;font-weight:900;font-size:64px;color:#16121c;box-shadow:0 12px 0 rgba(0,0,0,.35)}#chHead{position:absolute;top:560px;left:0;width:1080px;text-align:center;font-family:"Nunito",sans-serif;font-weight:900;font-size:62px;color:#fff;-webkit-text-stroke:10px #16121c;paint-order:stroke fill}`;
document.head.appendChild(css);
const mk = (id, html) => { const d = document.createElement('div'); d.id = id; d.innerHTML = html; d.style.opacity = 0; host.appendChild(d); return d; };
const head = mk('chHead', 'WHAT SHOULD ISHAN DO?'), chA = mk('chA', '<b>A</b><span>Look straight at Him</span>'), chB = mk('chB', '<b>B</b><span>Shut my eyes and fold my hands</span>');
chA.className = chB.className = 'choice'; const recap = mk('recap', 'YOU CHOSE <b>B</b> · 92%<br><span style="font-size:40px">Ishan stays and listens</span>'); const chF = mk('chF', 'FOLLOW · PART 3 TOMORROW');
function tickCards(t) { const pop = (el, t0) => { const u = clamp((t - t0) / 0.35); el.style.opacity = u; el.style.transform = `scale(${0.85 + 0.15 * (1 - Math.pow(1 - u, 3))})`; };
  pop(head, E.so3); { const u = clamp(Math.min(t / 0.25, (2.4 - t) / 0.3)); recap.style.opacity = u; recap.style.transform = `scale(${0.9 + 0.1 * u})`; } pop(chA, E.comment - 0.1); pop(chB, E.c2 - 0.1); pop(chF, E.part - 0.1); const pick = (t - E.part) % 1.2; chA.style.outline = t > E.part && pick < 0.6 ? '10px solid #fff' : 'none'; chB.style.outline = t > E.part && pick >= 0.6 ? '10px solid #fff' : 'none'; }


// ---------------- Part 2 extras: the soul light, the frozen arrows, the cosmic form
const soul = noOut(mesh(new THREE.SphereGeometry(0.16, 16, 12), glow(0xfff6c0, 0.9), 0, 0, 0, scene)), soulHalo = noOut(mesh(new THREE.SphereGeometry(0.24, 16, 12), glow(0xffe08a, 0.25), 0, 0, 0, scene));
const sword = noOut(mesh(new THREE.BoxGeometry(0.04, 0.7, 0.01), mat(0xd0d0d8, { m: 0.7, r: 0.2 }), 0, 0, 0, scene)), flameS = noOut(mesh(new THREE.ConeGeometry(0.12, 0.4, 8), new THREE.MeshBasicMaterial({ color: 0xff8a2a }), 0, 0, 0, scene));
const drops = []; for (let i = 0; i < 8; i++) drops.push(noOut(mesh(new THREE.SphereGeometry(0.03, 6, 4), mat(0x5ab0ff), 0, 0, 0, scene)));
const gusts = []; for (let i = 0; i < 5; i++) gusts.push(noOut(mesh(new THREE.TorusGeometry(0.22 + i * 0.03, 0.006, 4, 24, Math.PI * 1.2), new THREE.MeshBasicMaterial({ color: 0xffffff }), 0, 0, 0, scene)));
const frozen = []; for (let i = 0; i < 26; i++) { const g = new THREE.Group(); scene.add(g); noOut(mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.8, 4).rotateX(Math.PI / 2), mat(0x8a5a2a), 0, 0, 0, g)); noOut(mesh(new THREE.ConeGeometry(0.04, 0.12, 4).rotateX(-Math.PI / 2), mat(0xc0c0c8, { m: 0.6 }), 0, 0, -0.45, g)); g.position.set((R() - 0.5) * 9, 1.6 + R() * 3, -2 - R() * 6); g.rotation.set(0.1, (R() - 0.5) * 0.4, 0); frozen.push(g); }
const nose = new THREE.Group(); scene.add(nose); noOut(mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.8, 4).rotateX(Math.PI / 2), mat(0x8a5a2a), 0, 0, 0, nose)); noOut(mesh(new THREE.ConeGeometry(0.04, 0.12, 4).rotateX(-Math.PI / 2), mat(0xc0c0c8, { m: 0.6 }), 0, 0, -0.45, nose)); nose.rotation.y = Math.PI / 2;
const stars = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(Array.from({ length: 1500 }, (_, i) => (i % 3 === 1 ? 4 + R() * 40 : (R() - 0.5) * 120) + (i % 3 === 2 ? -40 : 0)), 3)), new THREE.PointsMaterial({ color: 0xffffff, size: 0.35, transparent: true, opacity: 0, fog: false })); stars.userData.noOutline = true; scene.add(stars);
const suns = []; for (let i = 0; i < 40; i++) { const a = i / 40 * Math.PI * 2, r = 6 + (i % 4) * 2.2; suns.push({ m: noOut(mesh(new THREE.SphereGeometry(0.3 + (i % 3) * 0.15, 10, 8), glow(i % 2 ? 0xfff0a0 : 0xffb050, 0.7), 0, 0, 0, scene)), a, r }); }
const rays = []; for (let i = 0; i < 24; i++) { const r = noOut(mesh(new THREE.PlaneGeometry(0.25, 12).translate(0, 6, 0), glow(0xffe08a, 0.18), 0, 0, 0, scene)); rays.push({ r, a: i / 24 * Math.PI * 2 }); }
const many = makeCast(scene, Array.from({ length: 12 }, (_, i) => ['m' + i, 'krishna']));
const right = new THREE.Vector3(), up = new THREE.Vector3();
const KG = V(0, 0, -3.2);
function update(s, t) {
  const cosmic = sm(seg(s, E.silent - 0.4, E.wait + 0.6)), growK = sm(seg(s, E.grow - 0.3, E.suns + 0.5));
  S.mood(cosmic * 0.92); S.hemi.intensity = 1.3 - cosmic * 0.6; S.sun.target.position.set(0, 0, 0); S.sun.position.set(-8, 10, 10); S.sun.target.updateMatrixWorld();
  S.paintSky(new THREE.Color(0x6a8ad8).lerp(new THREE.Color(0x0a0820), cosmic), new THREE.Color(0xffd8a0).lerp(new THREE.Color(0x3a1a5a), cosmic));
  stars.material.opacity = cosmic;
  right.setFromMatrixColumn(camera.matrixWorld, 0); right.y = 0; right.normalize(); up.setFromMatrixColumn(camera.matrixWorld, 1);
  const cz = 0; CH.position.set(0, 0, cz); wheels.forEach((w) => (w.rotation.x = 0)); legs.forEach((l, i) => (l.rotation.z = cosmic > 0.5 ? 0 : Math.sin(t * 1.5 + i) * 0.03));
  shield.visible = false; arrows.forEach(({ g }, i) => { g.visible = false; sparks[i].visible = false; }); dust.forEach((d) => (d.visible = false)); conch.visible = false; soundRings.forEach((r) => (r.visible = false));
  fallenBow.visible = true; fallenBow.position.set(0.55, 1.02, cz + 0.5); fallenBow.rotation.set(-Math.PI / 2, 0, 0.3);
  // --- Arjuna on his knees; Krishna teaching; then Krishna steps down and grows
  const kOnChariot = s < E.grow - 0.3;
  pose(C.ar, camera, { visible: true, x: 0.35, y: 0.95, z: cz + 0.35, h: 1.74, mood: s >= E.wiped && s < E.silent ? 'normal' : s >= E.grow ? 'wow' : 'sad', bow: false, arm: s >= E.show - 0.2 && s < E.silent ? 'offer' : s >= E.fell ? 'up' : 'down', sitting: true, flip: true });
  const kh = kOnChariot ? 1.72 : lerp(1.72, 15, growK);
  pose(C.k, camera, { visible: true, x: kOnChariot ? 0 : KG.x, y: kOnChariot ? 1.0 : 0, z: kOnChariot ? cz - 0.6 : KG.z, h: kh, mood: s >= E.looked && s < E.silent ? 'normal' : 'happy', arm: kOnChariot ? (s >= E.k2 && s < E.wiped ? 'offer' : 'down') : 'up', flip: s >= E.looked && kOnChariot });
  pose(C.is, camera, { visible: true, x: -0.45, y: 1.0, z: cz + 0.75, h: 1.22, mood: s >= E.wait ? 'wow' : s >= E.soul ? 'happy' : 'normal', arm: s >= E.fell ? 'up' : 'down' });
  [['bh', -1.6, 1.8], ['dr', 0, 1.74], ['du', 1.6, 1.8], ['c1', -3.0, 1.66], ['c2', 3.0, 1.7]].forEach(([n, x, h]) => pose(C[n], camera, { visible: !kOnChariot ? false : true, x, z: -6.5, h, mood: cosmic > 0.5 ? 'wow' : 'normal', bow: n === 'bh', arm: 'down' }));
  banners.forEach((b, i) => (b.rotation.y = cosmic > 0.5 ? 0.2 : Math.sin(t * 3 + i) * 0.3));
  // --- the soul: a light that weapons pass through, fire can't burn, water can't wet, wind can't dry
  const sp = V(-0.95, 2.95, cz - 0.3); const showSoul = s >= E.soul - 0.2 && s < E.wiped;
  soul.visible = soulHalo.visible = showSoul; soul.position.copy(sp); soulHalo.position.copy(sp); soulHalo.scale.setScalar(1 + 0.12 * Math.sin(t * 4));
  const wu = seg(s, E.weapons, E.fire); sword.visible = showSoul && wu > 0 && wu < 1; sword.position.copy(sp).add(right.clone().multiplyScalar(lerp(-0.6, 0.6, wu))); sword.quaternion.copy(camera.quaternion); sword.rotateZ(-0.9 + wu * 1.8);
  flameS.visible = showSoul && s >= E.fire && s < E.water; flameS.position.copy(sp).add(V(0, -0.3 + Math.sin(t * 20) * 0.02, 0)); flameS.scale.set(1, 0.8 + 0.3 * Math.sin(t * 17), 1);
  drops.forEach((d, i) => { const u = (t * 1.5 + i / 8) % 1; d.visible = showSoul && s >= E.water && s < E.wind; d.position.copy(sp).add(V(Math.cos(i * 2.4) * 0.3, 0.5 - u, Math.sin(i * 2.4) * 0.2)); });
  gusts.forEach((g, i) => { g.visible = showSoul && s >= E.wind && s < E.wiped; g.position.copy(sp); g.quaternion.copy(camera.quaternion); g.rotateZ(t * (3 + i) + i); });
  // --- the battlefield freezes: arrows hang in the air (one stops right in front of Ishan's nose)
  const fz = s >= E.every - 0.2; frozen.forEach((g) => (g.visible = fz && s < E.so3 + 2));
  nose.visible = s >= E.arrow - 0.2; nose.position.set(0.2, 1.0 + 1.22 * 0.86, cz + 0.85);
  // --- the cosmic form: suns, rays, a thousand faces
  const big = s >= E.grow - 0.3, top = V(KG.x, kh * 0.62, KG.z - 0.3);
  suns.forEach(({ m, a, r }, i) => { m.visible = big && s >= E.suns - 0.3; const k = sm(seg(s, E.suns - 0.3 + i * 0.02, E.suns + 0.6 + i * 0.02)); m.position.copy(top).add(right.clone().multiplyScalar(Math.cos(a + t * 0.1) * r * k)).add(up.clone().multiplyScalar(Math.sin(a + t * 0.1) * r * k)).add(V(0, 0, -1)); });
  rays.forEach(({ r, a }) => { r.visible = big; r.position.copy(top).add(V(0, 0, -1.2)); r.quaternion.copy(camera.quaternion); r.rotateZ(a + t * 0.15); r.material.opacity = 0.16 * growK; });
  Object.values(many).forEach((ch, i) => { const on = s >= E.thousands - 0.2 + i * 0.05, a = i / 12 * Math.PI * 2, rr = 8.5 * Math.min(1, growK);
    pose(ch, camera, { visible: big && on, x: top.x + Math.cos(a) * rr, y: Math.max(0, top.y - 1.4 + Math.sin(a) * rr), z: top.z - 0.6, h: 3.4, mood: i % 3 ? 'happy' : 'closed', arm: i % 2 ? 'up' : 'wave', flip: i % 2 === 1 }); });
  tickCards(s);
  S.clouds.forEach((c, i) => { c.visible = cosmic < 0.5; c.position.x = -80 + i * 15 + ((t * 0.6 + i * 3) % 12); });
}

const G = (t) => t;
const SHOTS = [
  [0, E.stay - 0.05, G, [[-0.2, 2.4, 3.6], [0, 1.9, 0]], [[-0.25, 2.3, 3.2], [0, 1.9, 0]]],
  [E.stay - 0.05, E.k2 - 0.05, G, [[-0.5, 1.95, 2.7], [-0.45, 1.85, 0.75]], [[-0.5, 1.95, 2.4], [-0.45, 1.85, 0.75]]],
  [E.k2 - 0.05, E.soul - 0.05, G, [[-0.7, 2.3, 1.7], [0, 2.1, -0.6]], [[-0.6, 2.3, 1.4], [0, 2.1, -0.6]]],
  [E.soul - 0.05, E.wiped - 0.05, G, [[-0.9, 2.6, 2.4], [-0.6, 2.4, -0.3]], [[-0.9, 2.6, 2.4], [-0.6, 2.4, -0.3]], [62, 40], { move: 'dolly' }],
  [E.wiped - 0.05, E.looked - 0.05, G, [[1.2, 2.2, -1.4], [0.35, 1.85, 0.35]], [[1.1, 2.2, -1.2], [0.35, 1.85, 0.35]]],
  [E.looked - 0.05, E.silent - 0.05, G, [[-0.4, 1.95, 1.1], [0, 2.1, -0.6]], [[-0.3, 2.0, 0.55], [0, 2.1, -0.6]]],
  [E.silent - 0.05, E.every - 0.05, G, [[0, 3, 6], [0, 1.6, -2]], [[0, 9, 14], [0, 1, -3]], 50, { move: 'pull' }],
  [E.every - 0.05, E.grow - 0.05, G, [[-0.3, 1.85, 2.6], [-0.4, 1.8, 0.8]], [[-0.3, 1.85, 2.3], [-0.4, 1.8, 0.8]]],
  [E.grow - 0.05, E.thousands - 0.05, G, [[0.6, 1.6, 7.0], [0, 3, -3]], [[0.3, 4.0, 20], [0, 7.5, -3.2]], 50, { move: 'pull' }],
  [E.thousands - 0.05, E.fell - 0.05, G, [[0, 4.2, 21], [0, 7.6, -3.2]], [[0, 4.2, 23], [0, 7.8, -3.2]], [50, 58]],
  [E.fell - 0.05, E.so3 - 0.05, G, [[0.6, 3.4, 17], [0, 6.6, -3.2]], [[0.6, 3.0, 15.5], [0, 6.2, -3.2]], 50],
  [E.so3 - 0.05, DURATION + 0.1, G, [[0.2, 4.2, 22], [0, 7.4, -3.2]], [[0.2, 4.2, 21], [0, 7.4, -3.2]]],
];
direct({ stage, WORDS, DURATION, shots: SHOTS, update, title: 1.6, q: [E.wait, E.every], cta: DURATION + 5, prog: [E.wiped, E.so3], pin: E.wait,
  key: ['b,', 'listened', 'thousand', 'krishna', 'grieve', 'soul', 'never', 'weapons', 'fire', 'water', 'wind', 'tears', 'really', 'silent', 'wait', 'freeze', 'arrow', 'grow', 'suns', 'arms', 'faces', 'universe', 'knees', 'light', 'me,', 'comment', 'a,'],
  loc: (t) => (t >= E.k2 - 0.05 && t < E.soul ? 'BHAGAVAD GITA · CHAPTER 2' : t >= E.grow - 0.05 && t < E.thousands ? 'CHAPTER 11 · THE UNIVERSAL FORM' : ''), shakes: [E.grow, E.suns], tick: () => {} });
