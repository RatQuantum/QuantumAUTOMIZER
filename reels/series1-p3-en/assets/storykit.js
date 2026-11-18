// storykit: a spec-driven episode. One spec (sets, cast, scenes keyed to spoken words) → sets, poses, camera, fx, captions.
// Used for Days 61+ (bulk mode). Hand-built main.js stays the path for special reels.
import * as THREE from './three.module.js';
import { rng, mat, mesh, sm, seg, lerp, clamp, setupScene, makeCast, pose, lamp, hut, cow, roundTree } from './kit.js';
import { makeStage, direct } from './director.js';
import { addOutlines, makeConfetti } from './plus.js';
import { CAST } from './cast.js';

export function run(spec, WORDS, DURATION) {
  const stage = makeStage(), { scene, camera } = stage, V = (x, y, z) => new THREE.Vector3(x, y, z), R = rng(spec.seed || 7);
  const names = Object.keys(spec.sets), SX = {}; names.forEach((n, i) => (SX[n] = i * 40));
  const S = setupScene(scene, names.map((n) => [SX[n], 0]), spec.seed || 7);
  // ---- word times (safe: a missing word falls back to an even split)
  const norm = (w) => w.toLowerCase().replace(/[^a-z'-]/g, '');
  const WT = (word, n = 1) => { if (typeof word === 'number') return word; let k = 0; for (const w of WORDS) if (norm(w[2]).startsWith(word) && ++k === n) return w[0]; return null; };
  const at = (a, after = -1) => { if (typeof a === 'number') return a; const [w, n] = Array.isArray(a) ? a : [a, 1]; let k = 0; for (const x of WORDS) if (x[0] > after && norm(x[2]).startsWith(w) && ++k === n) return x[0]; return null; };
  const glow = (c, o = 0.5) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, depthWrite: false, blending: THREE.AdditiveBlending });
  const noOut = (m) => { m.userData.noOutline = true; m.castShadow = false; return m; };
  // ---- set library
  const lamps = [];
  const BUILD = {
    village: (x) => { mesh(new THREE.CylinderGeometry(14, 14, 0.06, 28), mat(0x8ad84a), x, 0.03, 0, scene).castShadow = false; noOut(mesh(new THREE.BoxGeometry(2.4, 0.02, 14), mat(0xd9c08a), x + 2.4, 0.07, -2, scene)); [[-4.6, -3.6, 0.3], [5.2, -4.2, -0.4], [-5.6, 1.6, 0.6]].forEach(([a, b, r]) => hut(scene, x + a, b, R, r)); for (let i = 0; i < 6; i++) roundTree(scene, x + (i % 2 ? 1 : -1) * (7 + (i % 3)), -8 + i * 1.6, R, 1.1); cow(scene, x + 3.6, -2.6, 2.0, R); },
    field: (x) => { mesh(new THREE.CylinderGeometry(14, 14, 0.06, 28), mat(0x8ad84a), x, 0.03, 0, scene).castShadow = false; for (let i = 0; i < 9; i++) roundTree(scene, x + (i % 2 ? 1 : -1) * (5 + (i % 4)), -9 + i * 1.4, R, 1.2); cow(scene, x - 3, -3.2, 1.0, R); cow(scene, x + 3.4, -2.2, 2.6, R); },
    forest: (x) => { mesh(new THREE.CylinderGeometry(14, 14, 0.06, 28), mat(0x3f6a2a), x, 0.03, 0, scene).castShadow = false; for (let i = 0; i < 16; i++) { const a = R() * Math.PI * 2, r = 4.2 + R() * 8; roundTree(scene, x + Math.cos(a) * r, Math.sin(a) * r - 3, R, 1.3 + R() * 0.6); } },
    river: (x) => { mesh(new THREE.CylinderGeometry(14, 14, 0.06, 28), mat(0x7ac84a), x, 0.03, 2, scene).castShadow = false; noOut(mesh(new THREE.PlaneGeometry(40, 6).rotateX(-Math.PI / 2), mat(0x3f7fc8, { r: 0.15, m: 0.2 }), x, 0.06, -3.6, scene)); roundTree(scene, x - 4.5, 2.4, R, 1.3); roundTree(scene, x + 5, 3, R, 1.1); roundTree(scene, x + 3.5, -0.4, R, 1.2); },
    palace: (x, c = [0x8a3a3a, 0x4a2030, 0xc9a227]) => { mesh(new THREE.BoxGeometry(16, 0.1, 12), mat(c[0]), x, 0.05, -2, scene).castShadow = false; mesh(new THREE.BoxGeometry(16, 7, 0.4), mat(c[1]), x, 3.5, -6, scene); for (let i = 0; i < 6; i++) { const px = x - 6.5 + i * 2.6; mesh(new THREE.CylinderGeometry(0.3, 0.34, 6, 10), mat(0xfaf5ea), px, 3, -4.6, scene); mesh(new THREE.BoxGeometry(0.8, 0.3, 0.8), mat(c[2], { m: 0.5, r: 0.4 }), px, 6.1, -4.6, scene); } mesh(new THREE.BoxGeometry(2.4, 0.6, 1.4), mat(c[2], { m: 0.5, r: 0.4 }), x, 0.3, -3, scene); mesh(new THREE.BoxGeometry(1.6, 2.4, 0.2), mat(c[2], { m: 0.5, r: 0.4 }), x, 1.8, -3.6, scene); lamps.push(lamp(scene, x - 2.4, 0.1, -2.4, 0.9), lamp(scene, x + 2.4, 0.1, -2.4, 0.9)); },
    court: (x) => BUILD.palace(x, [0x5a3a6a, 0x2a1a3a, 0xffd23a]),
    battlefield: (x) => { mesh(new THREE.CylinderGeometry(24, 24, 0.06, 28), mat(0xc9a46a), x, 0.03, 0, scene).castShadow = false; const r = rng(3), n = 260, body = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.16, 0.2, 0.7, 6), mat(0x8a1a2a), n), head = new THREE.InstancedMesh(new THREE.SphereGeometry(0.13, 8, 6), mat(0xc98a5e), n); [body, head].forEach((m) => { m.userData.noOutline = true; scene.add(m); }); const m4 = new THREE.Matrix4(); for (let i = 0; i < n; i++) { const px = x + (r() - 0.5) * 24, pz = -7 - r() * 8; m4.makeTranslation(px, 0.35, pz); body.setMatrixAt(i, m4); m4.makeTranslation(px, 0.83, pz); head.setMatrixAt(i, m4); } },
    arena: (x) => { mesh(new THREE.CylinderGeometry(16, 16, 0.06, 28), mat(0xd9c08a), x, 0.03, 0, scene).castShadow = false; mesh(new THREE.CylinderGeometry(3.4, 3.4, 0.3, 24), mat(0xc8a070), x, 0.15, 0, scene); for (let i = 0; i < 14; i++) { const a = Math.PI * (1.05 + i / 13 * 0.9); mesh(new THREE.BoxGeometry(1.6, 1.4 + (i % 3) * 0.4, 1.0), mat(0xf3e2b8), x + Math.cos(a) * 9, 0.7, Math.sin(a) * 7, scene); } mesh(new THREE.BoxGeometry(2, 3, 1.4), mat(0x5a2a3a), x, 1.5, -7.5, scene); mesh(new THREE.BoxGeometry(1.4, 0.8, 1), mat(0xffd23a, { m: 0.5 }), x, 3.4, -7.4, scene); },
    cloud: (x) => { for (let i = 0; i < 14; i++) noOut(mesh(new THREE.SphereGeometry(1 + R() * 0.8, 12, 8), mat(0xfaf8f0), x + (R() - 0.5) * 12, -1.1 + R() * 0.3, (R() - 0.5) * 8 - 3, scene)); mesh(new THREE.BoxGeometry(1.6, 0.6, 1.0), mat(0xffd23a, { m: 0.5, r: 0.4 }), x, 0.3, -2.2, scene); },
    temple: (x, wall = 0xe8a040) => { mesh(new THREE.BoxGeometry(12, 0.1, 9), mat(0xf3e6c8), x, 0.05, 0, scene).castShadow = false; mesh(new THREE.BoxGeometry(12, 8, 0.3), mat(wall), x, 4, -3, scene); mesh(new THREE.BoxGeometry(3.0, 1.0, 1.3), mat(0x8a4b20), x, 0.5, -2.2, scene); mesh(new THREE.BoxGeometry(3.1, 0.08, 1.4), mat(0xffd23a), x, 1.02, -2.2, scene); for (let i = 0; i < 24; i++) { const a = i / 23 * Math.PI; noOut(mesh(new THREE.SphereGeometry(0.1, 6, 4), mat([0xffd23a, 0xffffff, 0xf06aa0][i % 3]), x + Math.cos(a) * 1.4, 1.9 + Math.sin(a) * 1.6, -2.6, scene)); } lamps.push(lamp(scene, x - 1.2, 1.06, -1.8, 0.6), lamp(scene, x + 1.2, 1.06, -1.8, 0.6)); },
    home: (x) => BUILD.temple(x, 0x9ab8d8),
    sea: (x) => { mesh(new THREE.BoxGeometry(14, 0.3, 16), mat(0xe8d09a), x - 8, 0, -2, scene).castShadow = false; noOut(mesh(new THREE.PlaneGeometry(40, 30).rotateX(-Math.PI / 2), mat(0x2f7ac8, { r: 0.15, m: 0.2 }), x + 9, 0.05, -2, scene)); },
  };
  names.forEach((n) => (BUILD[spec.sets[n]] || BUILD.village)(SX[n]));
  // ---- props
  const P = {};
  const prop = {
    fire: () => { const g = new THREE.Group(); scene.add(g); for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; noOut(mesh(new THREE.ConeGeometry(0.22, 1, 7).translate(0, 0.5, 0), new THREE.MeshBasicMaterial({ color: i % 3 ? 0xff7a1a : 0xffc23a }), Math.cos(a) * 0.5, 0, Math.sin(a) * 0.5, g)); } return g; },
    pillar: () => { const g = new THREE.Group(); scene.add(g); mesh(new THREE.CylinderGeometry(0.35, 0.4, 3.4, 10), mat(0xfaf5ea), 0, 1.7, 0, g); return g; },
    swing: () => { const g = new THREE.Group(); scene.add(g); for (const x of [-1, 1]) noOut(mesh(new THREE.CylinderGeometry(0.02, 0.02, 2.4, 4), mat(0x8a5a2a), x, 2.0, 0, g)); mesh(new THREE.BoxGeometry(2.3, 0.08, 0.6), mat(0xd8263a), 0, 0.8, 0, g); for (let i = 0; i < 12; i++) noOut(mesh(new THREE.SphereGeometry(0.07, 6, 4), mat([0xf06aa0, 0xffd23a, 0xffffff][i % 3]), -1 + (i % 2) * 2, 1.0 + Math.floor(i / 2) * 0.35, 0, g)); return g; },
    pot: () => { const g = new THREE.Group(); scene.add(g); noOut(mesh(new THREE.SphereGeometry(0.28, 12, 8).scale(1, 0.85, 1), mat(0xc8643a), 0, 0, 0, g)); noOut(mesh(new THREE.CircleGeometry(0.18, 12).rotateX(-Math.PI / 2), mat(0xfffbea), 0, 0.22, 0, g)); return g; },
    tulsi: () => { const g = new THREE.Group(); scene.add(g); mesh(new THREE.BoxGeometry(0.7, 0.7, 0.7), mat(0xd86a3a), 0, 0.35, 0, g); for (let i = 0; i < 18; i++) noOut(mesh(new THREE.SphereGeometry(0.1, 6, 4), mat(0x3f9a3a), (R() - 0.5) * 0.5, 0.8 + R() * 0.6, (R() - 0.5) * 0.5, g)); return g; },
    stone: () => { const g = new THREE.Group(); scene.add(g); noOut(mesh(new THREE.SphereGeometry(0.16, 12, 8).scale(1, 0.8, 1), mat(0x1d1a24, { m: 0.4, r: 0.3 }), 0, 0.12, 0, g)); return g; },
    arrows: () => { const g = new THREE.Group(); scene.add(g); for (let i = 0; i < 26; i++) { const a = noOut(mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.1, 4), mat(0x8a5a2a), -0.9 + (i % 13) * 0.15, 0.55, (i < 13 ? -0.2 : 0.2), g)); a.rotation.z = (R() - 0.5) * 0.2; } return g; },
    kheer: () => { const g = new THREE.Group(); scene.add(g); noOut(mesh(new THREE.CylinderGeometry(0.22, 0.16, 0.12, 12), mat(0xc0c0c8, { m: 0.6 }), 0, 0.06, 0, g)); noOut(mesh(new THREE.CircleGeometry(0.2, 12).rotateX(-Math.PI / 2), mat(0xfaf3dc), 0, 0.125, 0, g)); return g; },
    berries: () => { const g = new THREE.Group(); scene.add(g); noOut(mesh(new THREE.CylinderGeometry(0.3, 0.22, 0.14, 12, 1, true), new THREE.MeshStandardMaterial({ color: 0xb08040, side: THREE.DoubleSide }), 0, 0.07, 0, g)); for (let i = 0; i < 10; i++) noOut(mesh(new THREE.SphereGeometry(0.05, 6, 4), mat(0xd8263a), (R() - 0.5) * 0.4, 0.14, (R() - 0.5) * 0.4, g)); return g; },
    book: () => { const g = new THREE.Group(); scene.add(g); for (const sd of [-1, 1]) { const p = noOut(mesh(new THREE.BoxGeometry(0.26, 0.34, 0.02), mat(0xfaf5ea), sd * 0.13, 0, 0, g)); p.rotation.y = sd * 0.3; } noOut(mesh(new THREE.BoxGeometry(0.54, 0.36, 0.01), mat(0xd8263a), 0, 0, -0.02, g)); return g; },
    cloth: () => { const g = new THREE.Group(); scene.add(g); for (let i = 0; i < 9; i++) noOut(mesh(new THREE.TorusGeometry(0.35 + i * 0.06, 0.08, 6, 20).rotateX(Math.PI / 2), mat([0xf06aa0, 0xffd23a, 0xd8263a][i % 3]), 0, 0.08 + i * 0.1, 0, g)); return g; },
    star: () => { const g = new THREE.Group(); scene.add(g); noOut(mesh(new THREE.OctahedronGeometry(0.35), new THREE.MeshBasicMaterial({ color: 0xfff6c0, fog: false }), 0, 0, 0, g)); noOut(mesh(new THREE.SphereGeometry(0.9, 12, 8), glow(0xfff0a0, 0.25), 0, 0, 0, g)); return g; },
    moon: () => { const g = new THREE.Group(); scene.add(g); noOut(mesh(new THREE.SphereGeometry(1.2, 20, 14), new THREE.MeshBasicMaterial({ color: 0xfff6dc, fog: false }), 0, 0, 0, g)); noOut(mesh(new THREE.SphereGeometry(2.2, 20, 14), glow(0xfff0c0, 0.18), 0, 0, 0, g)); return g; },
    umbrella: () => { const g = new THREE.Group(); scene.add(g); noOut(mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.2, 4), mat(0x8a5a2a), 0, 0.6, 0, g)); noOut(mesh(new THREE.ConeGeometry(0.5, 0.25, 12, 1, true), new THREE.MeshStandardMaterial({ color: 0xf6f1e2, side: THREE.DoubleSide }), 0, 1.25, 0, g)); return g; },
    chariot: () => { const g = new THREE.Group(); scene.add(g); const gold = mat(0xffd23a, { m: 0.6, r: 0.35 }); mesh(new THREE.BoxGeometry(1.5, 0.2, 1.9), gold, 0, 0.9, 0, g); mesh(new THREE.BoxGeometry(1.5, 0.5, 0.08), gold, 0, 1.25, -0.95, g); for (const x of [-0.88, 0.88]) { const w = new THREE.Group(); w.position.set(x, 0.72, 0.3); g.add(w); mesh(new THREE.TorusGeometry(0.66, 0.06, 6, 20).rotateY(Math.PI / 2), mat(0x8a5a2a), 0, 0, 0, w); for (let i = 0; i < 6; i++) { const sp = mesh(new THREE.BoxGeometry(0.04, 1.3, 0.04), gold, 0, 0, 0, w); sp.rotation.x = i / 6 * Math.PI; } } mesh(new THREE.CylinderGeometry(0.05, 0.05, 3.2, 6), mat(0x8a5a2a), 0.6, 2.4, 0.8, g); noOut(mesh(new THREE.PlaneGeometry(0.8, 0.55), new THREE.MeshStandardMaterial({ color: 0xffa020, side: THREE.DoubleSide }), 1.0, 3.75, 0.8, g)); return g; },
    sun: () => { const g = new THREE.Group(); scene.add(g); noOut(mesh(new THREE.SphereGeometry(1.4, 20, 14), new THREE.MeshBasicMaterial({ color: 0xffa040, fog: false }), 0, 0, 0, g)); noOut(mesh(new THREE.SphereGeometry(2.6, 20, 14), glow(0xffb060, 0.25), 0, 0, 0, g)); return g; },
    chakra: () => { const g = new THREE.Group(); scene.add(g); noOut(mesh(new THREE.TorusGeometry(1.5, 0.18, 8, 32), mat(0xffd23a, { e: 0xffa020, ei: 0.9 }), 0, 0, 0, g)); for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2; noOut(mesh(new THREE.ConeGeometry(0.16, 0.5, 4).rotateZ(-Math.PI / 2 + a), mat(0xffd23a, { e: 0xffa020, ei: 0.9 }), Math.cos(a) * 1.85, Math.sin(a) * 1.85, 0, g)); } noOut(mesh(new THREE.CircleGeometry(1.4, 32), new THREE.MeshBasicMaterial({ color: 0x1a1a2a, fog: false }), 0, 0, -0.05, g)); return g; },
    elephant: () => { const g = new THREE.Group(); scene.add(g); const gr = mat(0x6a6a7a); mesh(new THREE.BoxGeometry(2.0, 1.2, 1.1), gr, 0, 1.6, 0, g); mesh(new THREE.BoxGeometry(0.8, 0.85, 0.85), gr, -1.25, 1.9, 0, g); for (const [x, z] of [[-0.7, -0.35], [-0.7, 0.35], [0.7, -0.35], [0.7, 0.35]]) mesh(new THREE.CylinderGeometry(0.2, 0.22, 1.1, 8), gr, x, 0.55, z, g); mesh(new THREE.CylinderGeometry(0.12, 0.17, 1.1, 8), gr, -1.65, 1.2, 0, g); return g; },
  };
  // props declared per scene: 'name@set:x,y,z[:scale]'
  const props = []; (spec.props || []).forEach((p) => { const [k, rest] = p.split('@'); const [set, xyz, sc] = rest.split(':'); const [x, y, z] = xyz.split(',').map(Number); const g = prop[k](); g.position.set(SX[set] + x, y, z); if (sc) g.scale.setScalar(+sc); props.push({ g, set, k, base: g.position.clone() }); });
  // ---- cast
  const C = makeCast(scene, Object.entries(spec.cast).map(([id, v]) => [id, Array.isArray(v) ? v[0] : v]));
  Object.entries(spec.cast).forEach(([id, v]) => { if (Array.isArray(v) && v[1]) C[id].spec = Object.assign({}, CAST[v[0]], v[1]); });
  // ---- fx
  const halos = {}; Object.keys(spec.cast).forEach((id) => (halos[id] = noOut(mesh(new THREE.RingGeometry(0.3, 0.34, 32), glow(0xffe08a, 0), 0, 0, 0, scene))));
  const petals = []; for (let i = 0; i < 28; i++) petals.push({ m: noOut(mesh(new THREE.CircleGeometry(0.07, 6), new THREE.MeshBasicMaterial({ color: [0xf06aa0, 0xffffff, 0xffd23a][i % 3], side: THREE.DoubleSide }), 0, 0, 0, scene)), ph: R(), x: R() });
  const rain = []; for (let i = 0; i < 60; i++) rain.push({ m: noOut(mesh(new THREE.BoxGeometry(0.012, 0.35, 0.012), new THREE.MeshBasicMaterial({ color: 0xbfd8ff, transparent: true, opacity: 0.6 }), 0, 0, 0, scene)), ph: R(), x: R(), z: R() });
  const stars = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(Array.from({ length: 1200 }, (_, i) => (i % 3 === 1 ? 6 + R() * 30 : (R() - 0.5) * 90) + (i % 3 === 2 ? -30 : 0)), 3)), new THREE.PointsMaterial({ color: 0xffffff, size: 0.3, transparent: true, opacity: 0, fog: false })); stars.userData.noOutline = true; scene.add(stars);
  const flash = noOut(mesh(new THREE.SphereGeometry(1, 16, 10), glow(0xfff0c0, 0), 0, 0, 0, scene));
  addOutlines(scene);
  const confetti = makeConfetti(scene, 50, spec.seed || 7);
  // ---- scenes: resolve times
  const SC = spec.scenes.map((s, i) => ({ ...s, t: i === 0 ? 0 : null }));
  SC.forEach((s, i) => { if (i === 0) return; const v = at(s.at, SC[i - 1].t + 0.3); s.t = v != null ? v - 0.05 : SC[i - 1].t + 2.5; });
  const E = { wait: at(spec.wait || 'wait'), but: at(spec.but || 'but'), thats: at(spec.thats || "that's"), comment: at(spec.comment || 'comment') ?? DURATION - 3 };
  const ending = { ...SC[0], t: E.comment - 0.05, loop: true };
  const ALL = spec.choice ? SC : [...SC.filter((s) => s.t < E.comment - 0.05), ending];
  const sceneAt = (s) => { let k = ALL[0]; for (const c of ALL) if (s >= c.t) k = c; return k; };
  const actorPos = (sc, id) => { const a = sc.actors.find((a) => a[0] === id); if (!a) return null; const o = a[3] || {}; return { x: SX[sc.set] + a[1], z: a[2], y: o.y || 0, h: o.h || (C[id].spec.bodyH < 180 ? 1.15 : 1.7) }; };
  const right = new THREE.Vector3();
  function update(s, t) {
    const sc = sceneAt(s), set = sc.set, ox = SX[set], night = sc.night ? 0.78 : sc.dusk ? 0.35 : 0;
    S.mood(night); S.hemi.intensity = 1.35 - night * 0.55; S.sun.target.position.set(ox, 0, 0); S.sun.position.set(ox - 8, 14, 10); S.sun.target.updateMatrixWorld();
    if (sc.dusk) S.paintSky(new THREE.Color(0x5a4aa0), new THREE.Color(0xff9a60));
    stars.material.opacity = sc.night ? 1 : 0; stars.position.x = ox;
    right.setFromMatrixColumn(camera.matrixWorld, 0); right.y = 0; right.normalize();
    const u = clamp((s - sc.t) / 2.5);
    Object.keys(spec.cast).forEach((id) => { const a = sc.actors.find((a) => a[0] === id); halos[id].visible = false;
      if (!a) { pose(C[id], camera, { visible: false }); return; } const o = a[3] || {}, p = actorPos(sc, id);
      let x = p.x, z = p.z; if (o.to) { const k = sm(u); x = lerp(p.x, ox + o.to[0], k); z = lerp(p.z, o.to[1], k); }
      pose(C[id], camera, { visible: true, x, y: p.y, z, h: p.h, mood: o.mood || 'normal', arm: o.arm || 'down', flip: !!o.flip, sitting: !!o.sitting, namaste: o.arm === 'fold', flute: !!o.flute, bow: !!o.bow, step: o.to && u < 1 ? s * 3 : o.walk ? s * 3 : 0 });
      if (o.tilt) C[id].m.rotateZ(o.tilt);
      if ((sc.fx || []).includes('glow:' + id)) { halos[id].visible = true; halos[id].position.set(x, p.y + p.h * 0.84, z - 0.05); halos[id].quaternion.copy(camera.quaternion); halos[id].scale.setScalar(p.h / 1.7); halos[id].material.opacity = 0.22 + 0.06 * Math.sin(t * 3); } });
    props.forEach(({ g, set: ps, k, base }) => { g.visible = ps === set && !(sc.hide || []).includes(k) && (!(spec.only || {})[k] || (sc.show || []).includes(k)); if (k === 'fire') g.children.forEach((f, i) => (f.scale.y = 0.8 + 0.35 * Math.sin(t * 9 + i))); if (k === 'swing') g.rotation.x = Math.sin(t * 1.6) * 0.35; if (k === 'star' || k === 'moon' || k === 'sun' || k === 'chakra') { g.lookAt(camera.position); if (k === 'chakra') g.rotateZ(-t * 3); } });
    lamps.forEach((l, i) => (l.flame.scale.y = 1 + 0.15 * Math.sin(t * 12 + i)));
    const fx = sc.fx || [];
    petals.forEach(({ m, ph, x }) => { const w = (t * 0.22 + ph) % 1; m.visible = fx.includes('petals'); m.position.set(ox - 3 + x * 6, 4 - w * 3.8, -1 + Math.sin(ph * 7) * 1.5); m.rotation.set(t + ph * 6, t * 0.7, 0); });
    rain.forEach(({ m, ph, x, z }) => { const w = (t * 1.6 + ph) % 1; m.visible = fx.includes('rain'); m.position.set(ox - 5 + x * 10, 6 - w * 6, -3 + z * 6); });
    const fu = s - sc.t; flash.visible = fx.includes('flash') && fu > 0 && fu < 0.6; flash.position.set(ox + (sc.flashAt ? sc.flashAt[0] : 0), sc.flashAt ? sc.flashAt[1] : 1.2, sc.flashAt ? sc.flashAt[2] : 0); flash.scale.setScalar(0.5 + fu * 3); flash.material.opacity = 0.6 * (1 - fu / 0.6);
    confetti(E.comment, s, V(SX[ALL[0].set], 3, 0));
    S.clouds.forEach((c, i) => { c.visible = !sc.night; c.position.x = -80 + i * 15 + ((t * 0.6 + i * 3) % 12); });
  }
  // ---- camera: each scene's span split among its shots
  const G = (t) => t, SHOTS = [];
  const framing = (sc, kind) => {
    const ox = SX[sc.set], ids = sc.actors.map((a) => a[0]); const [k, arg] = kind.split(':');
    const pick = (id) => actorPos(sc, id) || actorPos(sc, ids[0]) || { x: ox, z: 0, y: 0, h: 1.7 };
    if (k === 'close' || k === 'dolly') { const p = pick(arg); const fy = p.y + p.h * 0.78, d = 2.3 * (p.h / 1.7) + 0.6; return [[[p.x + 0.12, fy + 0.15, p.z + d], [p.x, fy, p.z]], [[p.x + 0.1, fy + 0.15, p.z + d - 0.35], [p.x, fy, p.z]], k === 'dolly' ? [62, 38] : 50, k === 'dolly' ? { move: 'dolly' } : undefined]; }
    if (k === 'two') { const [a, b] = (arg || ids.slice(0, 2).join(',')).split(',').map(pick); const mx = (a.x + b.x) / 2, mz = (a.z + b.z) / 2, sep = Math.hypot(a.x - b.x, a.z - b.z), hy = Math.max(a.y + a.h, b.y + b.h) * 0.62, d = Math.max(3.4, sep * 1.9 + 2.2); return [[[mx + 0.3, hy + 0.5, mz + d], [mx, hy, mz]], [[mx + 0.2, hy + 0.45, mz + d - 0.5], [mx, hy, mz]]]; }
    if (k === 'crane') { const p = pick(arg); return [[[p.x, 0.7, p.z + 4.6], [p.x, p.y + p.h * 0.7, p.z]], [[p.x + 0.3, p.y + 3.2, p.z + 6.2], [p.x, p.y + p.h * 0.6, p.z]], 50, { move: 'crane', lift: 1.0 }]; }
    if (k === 'pull') { const p = pick(arg); return [[[p.x, p.y + p.h * 0.8, p.z + 2.8], [p.x, p.y + p.h * 0.75, p.z]], [[ox, 4.5, 12], [ox, 1.0, -1]], 50, { move: 'pull' }]; }
    if (k === 'at') { const [x, y, z] = arg.split(',').map(Number); return [[[ox + 0.4, 1.6, 5.5], [ox + x, y, z]], [[ox + 0.3, 1.5, 5.0], [ox + x, y, z]]]; }
    if (k === 'top') return [[[ox, 11, 5], [ox, 0, -0.5]], [[ox, 9.5, 4], [ox, 0, -0.5]]];
    if (k === 'sky') { const p = pick(arg); return [[[p.x, 1.2, p.z + 5.5], [p.x + (+arg2(kind) || 0), 5.5, p.z - 6]], [[p.x, 1.2, p.z + 5], [p.x, 6, p.z - 6]]]; }
    const land = k === 'land'; return [[[ox, land ? 4 : 3.0, land ? 11 : 9.0], [ox, 1.3, -1.2]], [[ox, 2.3, land ? 6.6 : 7.8], [ox, 1.3, -1.0]], 50, land ? { move: 'land' } : undefined];
  };
  const arg2 = () => 0;
  ALL.forEach((sc, i) => { const t0 = sc.t, t1 = i + 1 < ALL.length ? ALL[i + 1].t : DURATION + 0.1; const shots = sc.loop ? [sc.shots[0]] : sc.shots || ['wide']; const span = (t1 - t0) / shots.length;
    shots.forEach((kind, j) => { const [a, b, fov, opt] = framing(sc, kind); SHOTS.push([t0 + j * span, t0 + (j + 1) * span, G, a, b, fov || 50, opt]); }); });
  // ---- choice cards (series)
  let tickCards = () => {};
  if (spec.choice) { const ch = spec.choice, host = document.getElementById('cta').parentElement;
    const css = document.createElement('style'); css.textContent = `.choice{position:absolute;left:80px;width:920px;padding:26px 30px;border-radius:44px;font-family:"Nunito",sans-serif;font-weight:900;font-size:50px;line-height:1.15;color:#16121c;display:flex;align-items:center;gap:28px;box-shadow:0 12px 0 rgba(0,0,0,.35)}.choice b{flex:none;width:120px;height:120px;border-radius:60px;background:#16121c;color:#fff;font-size:84px;display:flex;align-items:center;justify-content:center}#chA{top:700px;background:#ffd23a}#chB{top:960px;background:#7fd0ff}#chHead{position:absolute;top:560px;left:0;width:1080px;text-align:center;font-family:"Nunito",sans-serif;font-weight:900;font-size:62px;color:#fff;-webkit-text-stroke:10px #16121c;paint-order:stroke fill}#chF{position:absolute;top:1240px;left:140px;width:800px;padding:16px 10px;border-radius:36px;background:#fff;text-align:center;font-family:"Nunito",sans-serif;font-weight:900;font-size:38px;color:#16121c}#recap{position:absolute;top:640px;left:90px;width:900px;padding:30px;border-radius:44px;background:#7fd0ff;text-align:center;font-family:"Nunito",sans-serif;font-weight:900;font-size:64px;color:#16121c;box-shadow:0 12px 0 rgba(0,0,0,.35)}`; document.head.appendChild(css);
    const mk = (id, html, cls) => { const d = document.createElement('div'); d.id = id; d.innerHTML = html; d.style.opacity = 0; if (cls) d.className = cls; host.appendChild(d); return d; };
    const head = mk('chHead', ch.head), A = mk('chA', '<b>A</b><span>' + ch.a + '</span>', 'choice'), B = mk('chB', '<b>B</b><span>' + ch.b + '</span>', 'choice'), F = mk('chF', ch.follow), RC = ch.recap ? mk('recap', ch.recap) : null;
    const tq = at(ch.at || 'should') - 0.3, ta = at(ch.atA || ['comment', 1]) - 0.1, tb = at(ch.atB || ['comment', 2]) - 0.1, tf = at(ch.atF || 'part') - 0.1;
    tickCards = (t) => { const pop = (el, t0) => { const u = clamp((t - t0) / 0.35); el.style.opacity = u; el.style.transform = `scale(${0.85 + 0.15 * (1 - Math.pow(1 - u, 3))})`; }; pop(head, tq); pop(A, ta); pop(B, tb); pop(F, tf);
      const pk = (t - tf) % 1.2; A.style.outline = t > tf && pk < 0.6 ? '10px solid #fff' : 'none'; B.style.outline = t > tf && pk >= 0.6 ? '10px solid #fff' : 'none';
      if (RC) { const u = clamp(Math.min(t / 0.25, (2.4 - t) / 0.3)); RC.style.opacity = u; RC.style.transform = `scale(${0.9 + 0.1 * u})`; } }; }
  const upd0 = update; const updateAll = (s, t) => { upd0(s, t); tickCards(s); };
  // ---- go
  direct({ stage, WORDS, DURATION, shots: SHOTS, update: updateAll, title: 1.4, q: [E.wait, E.wait + 1.4], cta: spec.choice ? DURATION + 5 : E.comment, prog: [E.but || E.wait - 4, E.thats || E.comment - 4], pin: E.wait,
    key: spec.key, loc: (t) => { for (const [w, label, w2] of spec.loc || []) { const a = at(w), b = w2 ? at(w2) : a + 3; if (a != null && t >= a - 0.05 && t < b) return label; } return ''; }, shakes: (spec.shakes || []).map(at).filter((v) => v != null), tick: () => {} });
}
