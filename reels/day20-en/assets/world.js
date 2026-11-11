// Day 20 world (low-poly, sunny): Gokul village by the river (origin) with a rope across the lane and the butter pot;
// a Mumbai street on festival day (x = 40) with a tall pot, lights and a crowd. All state comes from story time.
import * as THREE from './three.module.js';
import { drawChar, CAST } from './cast.js';

export const rng = (seed) => () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
export const mat = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, flatShading: true, roughness: o.r ?? 0.85, metalness: o.m ?? 0, emissive: o.e ?? 0x000000, emissiveIntensity: o.ei ?? 1 });
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const sm = (x) => { x = clamp(x); return x * x * (3 - 2 * x); };
export const seg = (s, a, b) => clamp((s - a) / (b - a));
export const lerp = (a, b, k) => a + (b - a) * k;
export function mesh(geo, m, x = 0, y = 0, z = 0, parent) { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); o.castShadow = true; o.receiveShadow = true; if (parent) parent.add(o); return o; }

function clayPot(parent, x, y, z, k = 1) {
  const g = new THREE.Group(); g.position.set(x, y, z); g.scale.setScalar(k); parent.add(g);
  const clay = mat(0xc8643a);
  mesh(new THREE.SphereGeometry(0.42, 12, 9).scale(1, 0.85, 1), clay, 0, 0, 0, g);
  mesh(new THREE.CylinderGeometry(0.22, 0.28, 0.2, 12), clay, 0, 0.38, 0, g);
  mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.06, 12), mat(0xfff6dc), 0, 0.5, 0, g);   // a white cloth on top
  for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; mesh(new THREE.SphereGeometry(0.05, 6, 4), mat([0xffd23a, 0xd8263a, 0x2f9d5a][i % 3]), Math.cos(a) * 0.43, 0.02, Math.sin(a) * 0.43, g); }   // painted dots
  return g;
}
function hut(parent, x, z, R, ry = 0) {
  const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; parent.add(g);
  mesh(new THREE.BoxGeometry(2.6, 2.0, 2.4), mat([0xd9a066, 0xe0b07a, 0xc98f56][Math.floor(R() * 3)]), 0, 1.0, 0, g);
  const roof = mesh(new THREE.ConeGeometry(2.25, 1.5, 4), mat(0xd9b25a), 0, 2.75, 0, g); roof.rotation.y = Math.PI / 4;
  mesh(new THREE.BoxGeometry(0.8, 1.3, 0.1), mat(0x6b3b20), 0, 0.65, 1.21, g);
  for (let i = 0; i < 5; i++) mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.04, 8), mat(0xffffff), -0.9 + i * 0.45, 0.06, 1.5, g);   // a kolam at the door
  return g;
}
function cow(parent, x, z, ry, R) {
  const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; parent.add(g);
  const w = mat(0xf4f1ea);
  mesh(new THREE.BoxGeometry(1.4, 0.7, 0.6), w, 0, 0.95, 0, g);
  mesh(new THREE.BoxGeometry(0.45, 0.45, 0.4), w, 0.85, 1.15, 0, g);
  mesh(new THREE.BoxGeometry(0.2, 0.18, 0.3), mat(0xf5a6c0), 1.1, 1.05, 0, g);
  for (const [dx, dz] of [[-0.5, -0.2], [-0.5, 0.2], [0.5, -0.2], [0.5, 0.2]]) mesh(new THREE.BoxGeometry(0.14, 0.65, 0.14), w, dx, 0.33, dz, g);
  for (const dz of [-0.15, 0.15]) { const h = mesh(new THREE.ConeGeometry(0.05, 0.25, 5), mat(0xd9b25a), 0.85, 1.45, dz, g); h.rotation.z = -0.4; }
  mesh(new THREE.SphereGeometry(0.12, 6, 4), mat(0xffd23a), 0.75, 0.86, 0, g);   // a bell on its neck
  mesh(new THREE.BoxGeometry(0.4, 0.3, 0.62), mat(0x3a3330), -0.2, 1.05, 0, g);   // a patch
  return g;
}
function palm(parent, x, z, R) {
  const t = new THREE.Group(); t.position.set(x, 0, z); parent.add(t);
  const lean = (R() - 0.5) * 0.3;
  for (let i = 0; i < 6; i++) mesh(new THREE.CylinderGeometry(0.22 - i * 0.02, 0.26 - i * 0.02, 0.8, 6), mat(0x9a6a3a), lean * i * 0.6, 0.4 + i * 0.78, 0, t);
  for (let i = 0; i < 6; i++) { const l = mesh(new THREE.ConeGeometry(0.5, 2.6, 4), mat(0x3fa83a), lean * 3.6, 4.7, 0, t); l.rotation.z = Math.PI / 2.3; l.rotation.y = i / 6 * Math.PI * 2; l.translateY(-1.2); }
}
function roundTree(parent, x, z, R, k = 1) {
  mesh(new THREE.CylinderGeometry(0.25 * k, 0.35 * k, 2 * k, 6), mat(0x8a5a2a), x, 1 * k, z, parent);
  for (let i = 0; i < 4; i++) mesh(new THREE.IcosahedronGeometry((1.4 + R() * 0.5) * k, 0), mat([0x4fb83a, 0x5ccf45, 0x3fa83a, 0x6ad04a][i]), x + (R() - 0.5) * 1.6 * k, (2.8 + i * 0.5) * k, z + (R() - 0.5) * 1.2 * k, parent);
}
// shards + butter: precomputed flights, shown for 2 s after t0 (in story time)
function burst(scene, n, geo, m, R, spread, up) {
  const items = [];
  for (let i = 0; i < n; i++) { const o = mesh(geo, m, 0, 0, 0, scene); o.visible = false; o.userData = { v: new THREE.Vector3((R() - 0.5) * spread, up * (0.3 + R()), (R() - 0.5) * spread * 0.6), r: R() * 6 }; items.push(o); }
  return {
    set(t0, s, origin, ground = 0.05) {
      const tau = s - t0;
      for (const o of items) { o.visible = tau > 0 && tau < 2.2; if (!o.visible) continue; const u = o.userData; const y = origin.y + u.v.y * tau - 4.9 * tau * tau; o.position.set(origin.x + u.v.x * tau, Math.max(ground, y), origin.z + u.v.z * tau); o.rotation.set(u.r + tau * 5, u.r * 2 + tau * 3, 0); }
    },
  };
}

export function buildWorld(scene) {
  const R = rng(20); const W = {};
  scene.fog = new THREE.Fog(0xbfe3ff, 30, 90);
  scene.add(new THREE.HemisphereLight(0xdff2ff, 0x6a8a3a, 1.35));
  const sun = new THREE.DirectionalLight(0xfff1d6, 2.2); sun.position.set(-8, 14, 9); sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16, near: 1, far: 50 }); sun.shadow.bias = -0.0005;
  scene.add(sun); scene.add(sun.target); W.sun = sun;
  const g = new THREE.PlaneGeometry(160, 160, 80, 80); g.rotateX(-Math.PI / 2);
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) { const x = pos.getX(i), z = pos.getZ(i), flat = Math.min(Math.hypot(x, z), Math.hypot(x - 40, z)); pos.setY(i, flat > 15 ? (R() * 0.5 + Math.sin(x * 0.2) * 0.4 + Math.cos(z * 0.17) * 0.4) * sm((flat - 15) / 10) : 0); }
  g.computeVertexNormals(); mesh(g, mat(0x6ccf3e), 0, 0, 0, scene).castShadow = false;
  W.clouds = [];
  for (let i = 0; i < 9; i++) { const cg = new THREE.Group(); for (let k = 0; k < 4; k++) mesh(new THREE.IcosahedronGeometry(1 + R() * 0.9, 0), mat(0xffffff, { r: 1 }), k * 1.2 - 1.8, R() * 0.5, R() * 0.6, cg).castShadow = false; cg.position.set(-60 + i * 15 + R() * 6, 14 + R() * 5, -30 - R() * 10); scene.add(cg); W.clouds.push(cg); }
  // ---- GOKUL (origin): a dirt lane between huts, the river behind, a banyan, cows
  mesh(new THREE.BoxGeometry(5, 0.1, 22), mat(0xe2c48a), 0, 0.05, 0, scene);
  const river = mesh(new THREE.PlaneGeometry(90, 9).rotateX(-Math.PI / 2), mat(0x3f9fd8, { r: 0.35 }), 0, 0.08, -15, scene); river.castShadow = false;
  for (const [x, z, ry] of [[-3.5, -3.2, 0.5], [3.5, -3.2, -0.5], [-3.7, 1.6, 1.3], [3.7, 1.8, -1.3], [-3.4, 6.5, 1.5], [3.6, 6.8, -1.5], [0, -7.2, 0], [-6.5, -6, 0.3], [6.5, -6.2, -0.3]]) hut(scene, x, z, R, ry);
  for (const [x, z] of [[-2.4, -5.4], [2.6, -5.2], [-2.3, 4.2], [2.4, 4.6]]) { mesh(new THREE.ConeGeometry(0.75, 1.2, 7), mat(0xe6c25a), x, 0.6, z, scene); }   // haystacks
  for (const [x, z] of [[-2.3, -1.6], [2.3, -1.8], [-2.4, 3.0], [2.5, 3.1]]) clayPot(scene, x, 0.32, z, 0.5);   // pots by the doors
  roundTree(scene, -9, -6, R, 1.5); for (const [x, z] of [[9, -7], [-10, 5], [10, 6]]) palm(scene, x, z, R);
  W.cows = [cow(scene, -7.5, -9.5, 0.4, R), cow(scene, 7.2, -10, 2.6, R)];
  for (let i = 0; i < 30; i++) { const a = R() * Math.PI * 2, r = 7 + R() * 7; mesh(new THREE.IcosahedronGeometry(0.2 + R() * 0.2, 0), mat([0xe8462c, 0xffd23a, 0xffffff, 0xf5a6c0][i % 4]), Math.cos(a) * r, 0.18, Math.sin(a) * r, scene); }
  for (let i = 0; i < 10; i++) { const a = R() * Math.PI * 2, r = 12 + R() * 6; mesh(new THREE.DodecahedronGeometry(0.4 + R() * 0.5, 0), mat(0x9a96b0), Math.cos(a) * r, 0.2, Math.sin(a) * r, scene); }
  // the rope across the lane between two posts, and the pot that hangs from it
  for (const x of [-2.9, 2.9]) mesh(new THREE.CylinderGeometry(0.12, 0.14, 4.6, 6), mat(0x8a5a2a), x, 2.3, -1, scene);
  W.rope = mesh(new THREE.CylinderGeometry(0.035, 0.035, 5.8, 5), mat(0xd9b25a), 0, 4.45, -1, scene); W.rope.rotation.z = Math.PI / 2;
  W.string = mesh(new THREE.CylinderGeometry(0.02, 0.02, 1, 4), mat(0xd9b25a), 0, 4, -1, scene);
  W.pot = clayPot(scene, 0, 3.6, -1, 1);
  W.sidePots = [clayPot(scene, -4.4, 3.1, -1.7, 0.6), clayPot(scene, 4.4, 3.1, -1.7, 0.6)];   // more pots hung at the eaves
  W.handPot = clayPot(scene, 0, 0, 0, 0.55);   // the pot a woman lifts / Krishna carries
  for (let i = 0; i < 14; i++) { const x = -2.6 + i * 0.4; const f = mesh(new THREE.ConeGeometry(0.15, 0.32, 3), mat([0xd8263a, 0xffd23a, 0x2f9fd8, 0x3fae7a][i % 4]), x, 4.3 - Math.sin(i / 13 * Math.PI) * 0.15, -0.95, scene); f.rotation.x = Math.PI; }
  const potM = mat(0xc8643a), butM = mat(0xfff6d6, { r: 0.5 });
  W.shards = burst(scene, 12, new THREE.TetrahedronGeometry(0.16, 0), potM, R, 3.2, 2.2);
  W.butter = burst(scene, 34, new THREE.IcosahedronGeometry(0.11, 0), butM, R, 2.4, 1.2);
  // ---- MUMBAI (x = 40): buildings, lights, a tall rope and pot
  const M = new THREE.Group(); M.position.set(40, 0, 0); scene.add(M); W.mumbai = M;
  mesh(new THREE.BoxGeometry(14, 0.1, 30), mat(0x6f6f78), 0, 0.05, 0, M);
  const pastel = [0xf6c7a0, 0xa8d8e8, 0xf5e0a0, 0xd8b8e8, 0xf0a8a8, 0xb8e0b0];
  for (let side of [-1, 1]) for (let i = 0; i < 5; i++) {
    const h = 9 + R() * 7, z = -12 + i * 5.6, x = side * 6.6;
    mesh(new THREE.BoxGeometry(4.8, h, 5.2), mat(pastel[(i * 2 + (side > 0)) % 6]), x, h / 2, z, M);
    for (let fy = 0; fy < Math.floor(h / 1.6) - 1; fy++) for (let fz = 0; fz < 3; fz++) mesh(new THREE.BoxGeometry(0.1, 0.7, 0.9), mat(0x3f5f8a), x - side * 2.42, 1.4 + fy * 1.6, z - 1.6 + fz * 1.6, M).castShadow = false;
  }
  for (const x of [-7, 7]) mesh(new THREE.CylinderGeometry(0.1, 0.1, 9, 6), mat(0x4a4a52), x, 4.5, -2, M);
  mesh(new THREE.CylinderGeometry(0.04, 0.04, 14, 5), mat(0xd9b25a), 0, 8.6, -2, M).rotation.z = Math.PI / 2;
  W.mPot = clayPot(M, 0, 7.5, -2, 1.2);
  W.mString = mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.9, 4), mat(0xd9b25a), 0, 8.15, -2, M);
  W.lights = [];
  for (let k = 0; k < 2; k++) for (let i = 0; i < 26; i++) { const x = -7 + i * 0.56, l = mesh(new THREE.SphereGeometry(0.08, 6, 4), new THREE.MeshBasicMaterial({ color: [0xffd23a, 0xff5a8a, 0x5ad8ff, 0x8aff7a][i % 4] }), x, 9.4 + k * 1.2 - Math.sin(i / 25 * Math.PI) * 0.6, -2.4 + k * 4, M); l.castShadow = false; W.lights.push(l); }
  W.mShards = burst(scene, 12, new THREE.TetrahedronGeometry(0.2, 0), potM, R, 4, 2.4);
  W.spray = burst(scene, 40, new THREE.IcosahedronGeometry(0.07, 0), new THREE.MeshBasicMaterial({ color: 0xcfefff, transparent: true, opacity: 0.8 }), R, 5, 5);
  return W;
}
// ---- characters as billboards (several instances may share one drawing spec)
export function makeCast(scene, list) {
  const C = {};
  for (const [name, spec] of list) {
    const cv = document.createElement('canvas'); cv.width = 256; cv.height = 512;
    const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
    const geo = new THREE.PlaneGeometry(0.85, 1.7); geo.translate(0, 0.85, 0);
    const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: tex, transparent: true, alphaTest: 0.3, side: THREE.DoubleSide }));
    const sh = new THREE.Mesh(new THREE.CircleGeometry(0.32, 16).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.22 }));
    scene.add(m); scene.add(sh);
    C[name] = { m, sh, cv, tex, key: '', spec: CAST[spec] };
  }
  return C;
}
export function pose(ch, cam, p) {
  ch.m.visible = ch.sh.visible = p.visible !== false;
  if (!ch.m.visible) return;
  const key = [p.mood, p.arm, Math.round((p.step || 0) * 4) / 4, p.sitting, p.pot, p.butter].join('|');
  if (key !== ch.key) { drawChar(ch.cv.getContext('2d'), ch.spec, p); ch.tex.needsUpdate = true; ch.key = key; }
  const h = p.h ?? 1.7, bob = p.step ? Math.abs(Math.sin(p.step * Math.PI)) * 0.06 : 0;
  ch.m.position.set(p.x, (p.y ?? 0) + bob, p.z); ch.m.scale.set((p.flip ? -1 : 1) * h / 1.7, h / 1.7, 1);
  ch.m.quaternion.copy(cam.quaternion);
  ch.sh.position.set(p.x, (p.y ?? 0) + 0.13, p.z); ch.sh.scale.setScalar(h / 1.7); ch.sh.visible = (p.y ?? 0) < 0.05;
}
