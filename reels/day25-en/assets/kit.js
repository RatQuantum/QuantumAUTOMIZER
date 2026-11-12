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

export function clayPot(parent, x, y, z, k = 1) {
  const g = new THREE.Group(); g.position.set(x, y, z); g.scale.setScalar(k); parent.add(g);
  const clay = mat(0xc8643a);
  mesh(new THREE.SphereGeometry(0.42, 12, 9).scale(1, 0.85, 1), clay, 0, 0, 0, g);
  mesh(new THREE.CylinderGeometry(0.22, 0.28, 0.2, 12), clay, 0, 0.38, 0, g);
  mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.06, 12), mat(0xfff6dc), 0, 0.5, 0, g);   // a white cloth on top
  for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; mesh(new THREE.SphereGeometry(0.05, 6, 4), mat([0xffd23a, 0xd8263a, 0x2f9d5a][i % 3]), Math.cos(a) * 0.43, 0.02, Math.sin(a) * 0.43, g); }   // painted dots
  return g;
}
export function hut(parent, x, z, R, ry = 0) {
  const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; parent.add(g);
  mesh(new THREE.BoxGeometry(2.6, 2.0, 2.4), mat([0xd9a066, 0xe0b07a, 0xc98f56][Math.floor(R() * 3)]), 0, 1.0, 0, g);
  const roof = mesh(new THREE.ConeGeometry(2.25, 1.5, 4), mat(0xd9b25a), 0, 2.75, 0, g); roof.rotation.y = Math.PI / 4;
  mesh(new THREE.BoxGeometry(0.8, 1.3, 0.1), mat(0x6b3b20), 0, 0.65, 1.21, g);
  for (let i = 0; i < 5; i++) mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.04, 8), mat(0xffffff), -0.9 + i * 0.45, 0.06, 1.5, g);   // a kolam at the door
  return g;
}
export function cow(parent, x, z, ry, R) {
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
export function palm(parent, x, z, R) {
  const t = new THREE.Group(); t.position.set(x, 0, z); parent.add(t);
  const lean = (R() - 0.5) * 0.3;
  for (let i = 0; i < 6; i++) mesh(new THREE.CylinderGeometry(0.22 - i * 0.02, 0.26 - i * 0.02, 0.8, 6), mat(0x9a6a3a), lean * i * 0.6, 0.4 + i * 0.78, 0, t);
  for (let i = 0; i < 6; i++) { const l = mesh(new THREE.ConeGeometry(0.5, 2.6, 4), mat(0x3fa83a), lean * 3.6, 4.7, 0, t); l.rotation.z = Math.PI / 2.3; l.rotation.y = i / 6 * Math.PI * 2; l.translateY(-1.2); }
}
export function roundTree(parent, x, z, R, k = 1) {
  mesh(new THREE.CylinderGeometry(0.25 * k, 0.35 * k, 2 * k, 6), mat(0x8a5a2a), x, 1 * k, z, parent);
  for (let i = 0; i < 4; i++) mesh(new THREE.IcosahedronGeometry((1.4 + R() * 0.5) * k, 0), mat([0x4fb83a, 0x5ccf45, 0x3fa83a, 0x6ad04a][i]), x + (R() - 0.5) * 1.6 * k, (2.8 + i * 0.5) * k, z + (R() - 0.5) * 1.2 * k, parent);
}
// shards + butter: precomputed flights, shown for 2 s after t0 (in story time)
export function burst(scene, n, geo, m, R, spread, up) {
  const items = [];
  for (let i = 0; i < n; i++) { const o = mesh(geo, m, 0, 0, 0, scene); o.visible = false; o.userData = { noOutline: true, v: new THREE.Vector3((R() - 0.5) * spread, up * (0.3 + R()), (R() - 0.5) * spread * 0.6), r: R() * 6 }; items.push(o); }
  return {
    set(t0, s, origin, ground = 0.05) {
      const tau = s - t0;
      for (const o of items) { o.visible = tau > 0 && tau < 2.2; if (!o.visible) continue; const u = o.userData; const y = origin.y + u.v.y * tau - 4.9 * tau * tau; o.position.set(origin.x + u.v.x * tau, Math.max(ground, y), origin.z + u.v.z * tau); o.rotation.set(u.r + tau * 5, u.r * 2 + tau * 3, 0); }
    },
  };
}


export function lamp(parent, x, y, z, k = 1) {
  const g = new THREE.Group(); g.position.set(x, y, z); g.scale.setScalar(k); parent.add(g);
  const brass = mat(0xd9a441, { m: 0.7, r: 0.35 });
  mesh(new THREE.CylinderGeometry(0.25, 0.32, 0.08, 10), brass, 0, 0.04, 0, g); mesh(new THREE.CylinderGeometry(0.04, 0.06, 0.9, 8), brass, 0, 0.5, 0, g); mesh(new THREE.CylinderGeometry(0.22, 0.12, 0.12, 10), brass, 0, 0.98, 0, g);
  const fl = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.18, 6), new THREE.MeshBasicMaterial({ color: 0xffc23a })); fl.position.set(0, 1.14, 0); g.add(fl);
  const pl = new THREE.PointLight(0xffa64a, 5, 6, 1.6); pl.position.set(0, 1.3, 0.2); g.add(pl);
  return { g, flame: fl, light: pl };
}
// the sky dome, sun, hemisphere light, ground with gentle hills (flat inside the given set circles), drifting clouds
export function setupScene(scene, flats, seed = 1) {
  const R = rng(seed), S = {};
  const g0 = new THREE.SphereGeometry(300, 24, 12); const col = []; const p = g0.attributes.position;
  for (let i = 0; i < p.count; i++) { const k = clamp(p.getY(i) / 160); col.push(k, k, k); }
  g0.setAttribute('kk', new THREE.Float32BufferAttribute(col, 3));
  S.skyTop = new THREE.Color(0x4a8fe0); S.skyHor = new THREE.Color(0xcfe9ff);
  const cols = new Float32Array(p.count * 3); g0.setAttribute('color', new THREE.BufferAttribute(cols, 3));
  S.sky = new THREE.Mesh(g0, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, fog: false })); scene.add(S.sky);
  S.paintSky = (top, hor) => { const c = g0.attributes.color, kk = g0.attributes.kk; const T = new THREE.Color(top), H = new THREE.Color(hor), tmp = new THREE.Color(); for (let i = 0; i < c.count; i++) { tmp.copy(H).lerp(T, Math.pow(kk.getX(i), 0.7)); c.setXYZ(i, tmp.r, tmp.g, tmp.b); } c.needsUpdate = true; };
  S.paintSky(0x4a8fe0, 0xcfe9ff);
  scene.fog = new THREE.Fog(0xbfe3ff, 30, 90);
  S.hemi = new THREE.HemisphereLight(0xdff2ff, 0x6a8a3a, 1.35); scene.add(S.hemi);
  S.sun = new THREE.DirectionalLight(0xfff1d6, 2.2); S.sun.position.set(-8, 14, 9); S.sun.castShadow = true;
  S.sun.shadow.mapSize.set(2048, 2048); Object.assign(S.sun.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16, near: 1, far: 50 }); S.sun.shadow.bias = -0.0005;
  scene.add(S.sun); scene.add(S.sun.target);
  const g = new THREE.PlaneGeometry(200, 200, 100, 100); g.rotateX(-Math.PI / 2);
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) { const x = pos.getX(i), z = pos.getZ(i); const flat = Math.min(...flats.map(([fx, fz]) => Math.hypot(x - fx, z - fz))); pos.setY(i, flat > 15 ? (R() * 0.5 + Math.sin(x * 0.2) * 0.4 + Math.cos(z * 0.17) * 0.4) * sm((flat - 15) / 10) : 0); }
  g.computeVertexNormals(); S.ground = mesh(g, mat(0x6ccf3e), 0, 0, 0, scene); S.ground.castShadow = false;
  S.clouds = [];
  for (let i = 0; i < 12; i++) { const cg = new THREE.Group(); for (let k = 0; k < 4; k++) mesh(new THREE.IcosahedronGeometry(1 + R() * 0.9, 0), mat(0xffffff, { r: 1 }), k * 1.2 - 1.8, R() * 0.5, R() * 0.6, cg).castShadow = false; cg.position.set(-80 + i * 15 + R() * 6, 14 + R() * 5, -30 - R() * 10); scene.add(cg); S.clouds.push(cg); }
  // day <-> night: 0 = sunny day, 1 = stormy blue night (still readable)
  S.mood = (k) => { S.paintSky(new THREE.Color(0x4a8fe0).lerp(new THREE.Color(0x10183a), k), new THREE.Color(0xcfe9ff).lerp(new THREE.Color(0x3a4a7a), k)); S.hemi.intensity = lerp(1.35, 0.85, k); S.hemi.color.set(new THREE.Color(0xdff2ff).lerp(new THREE.Color(0x8aa0e0), k)); S.sun.intensity = lerp(2.2, 0.9, k); S.sun.color.set(new THREE.Color(0xfff1d6).lerp(new THREE.Color(0xa8c0ff), k)); scene.fog.color.set(new THREE.Color(0xbfe3ff).lerp(new THREE.Color(0x2a3560), k)); S.clouds.forEach((c) => c.children.forEach((m) => m.material.color.set(new THREE.Color(0xffffff).lerp(new THREE.Color(0x5a6280), k)))); };
  return S;
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
  const T = window.__T || 0; if (ch.ph === undefined) ch.ph = (ch.m.id * 0.731) % 3.1;
  p.blink = ((T + ch.ph) % 3.3) < 0.12;
  const key = [p.blink, p.nofeather, p.flute, p.bandage, p.bleed, p.rakhi, p.mood, p.arm, Math.round((p.step || 0) * 4) / 4, p.sitting, p.pot, p.butter, p.bundle].join('|');
  if (key !== ch.key) { drawChar(ch.cv.getContext('2d'), ch.spec, p); ch.tex.needsUpdate = true; ch.key = key; }
  const h = p.h ?? 1.7, bob = p.step ? Math.abs(Math.sin(p.step * Math.PI)) * 0.06 : 0;
  ch.m.position.set(p.x, (p.y ?? 0) + bob, p.z); ch.m.scale.set((p.flip ? -1 : 1) * h / 1.7, h / 1.7 * (1 + 0.013 * Math.sin(T * 2.3 + ch.ph * 2)), 1);
  ch.m.quaternion.copy(cam.quaternion);
  ch.sh.position.set(p.x, (p.y ?? 0) + 0.13, p.z); ch.sh.scale.setScalar(h / 1.7); ch.sh.visible = (p.y ?? 0) < 0.05;
}

// a low-poly peacock: body, neck, crested head, and a tail fan of eyed feathers that opens (open 0..1)
export function peacock(parent, k = 1, king = false) {
  const g = new THREE.Group(); g.scale.setScalar(k); parent.add(g);
  const blue = mat(0x1e5aa8, { r: 0.4 }), teal = mat(0x16805a, { r: 0.4 }), gold = mat(0xe3b02a, { m: 0.3, r: 0.4 }), dark = mat(0x0b1f4d), white = mat(0xffffff);
  const body = new THREE.Group(); g.add(body);
  mesh(new THREE.SphereGeometry(0.32, 10, 8).scale(1, 0.9, 1.35), blue, 0, 0.62, 0, body);
  mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.6, 8), blue, 0, 1.0, 0.28, body).rotation.x = 0.35;
  mesh(new THREE.SphereGeometry(0.13, 8, 6), blue, 0, 1.32, 0.42, body);
  mesh(new THREE.ConeGeometry(0.04, 0.12, 5).rotateX(Math.PI / 2), gold, 0, 1.3, 0.58, body);
  for (const ex of [-0.07, 0.07]) { mesh(new THREE.SphereGeometry(0.03, 6, 4), white, ex, 1.36, 0.52, body).userData.noOutline = true; }
  for (let i = 0; i < 3; i++) { mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.16, 3), dark, -0.05 + i * 0.05, 1.5, 0.4, body).userData.noOutline = true; mesh(new THREE.SphereGeometry(king ? 0.05 : 0.035, 6, 4), king ? gold : blue, -0.05 + i * 0.05, 1.59, 0.4, body).userData.noOutline = true; }
  if (king) mesh(new THREE.CylinderGeometry(0.1, 0.13, 0.1, 6), gold, 0, 1.46, 0.42, body);
  for (const lx of [-0.12, 0.12]) mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.4, 4), mat(0x8a6a4a), lx, 0.2, 0, body).userData.noOutline = true;
  const tailClosed = mesh(new THREE.ConeGeometry(0.2, 1.4, 6).rotateX(-Math.PI / 2), teal, 0, 0.55, -0.95, body);
  const fan = new THREE.Group(); fan.position.set(0, 0.7, -0.35); body.add(fan);
  const F = [], n = king ? 24 : 18;
  for (let i = 0; i < n; i++) {
    const f = new THREE.Group(); fan.add(f);
    const blade = mesh(new THREE.PlaneGeometry(0.22, 1.5).translate(0, 0.75, 0), new THREE.MeshStandardMaterial({ color: 0x2e9d5a, side: THREE.DoubleSide, flatShading: true }), 0, 0, 0, f); blade.userData.noOutline = true;
    for (const [r, c, z] of [[0.13, 0xe3b02a, 0.01], [0.1, 0x16805a, 0.02], [0.07, 0x1e5aa8, 0.03], [0.035, 0x0b1f4d, 0.04]]) { const e = mesh(new THREE.CircleGeometry(r, 10), new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide }), 0, 1.38, z, f); e.userData.noOutline = true; }
    F.push(f);
  }
  return { g, body, fan, F, tailClosed, set(open, t, ph = 0) {
    tailClosed.visible = open < 0.2; fan.visible = open >= 0.05;
    F.forEach((f, i) => { const a = ((i / (F.length - 1)) - 0.5) * Math.PI * 1.05 * open; f.rotation.set(-0.15 - 0.25 * (1 - open), 0, a + Math.sin(t * 9 + i + ph) * 0.03 * open); f.scale.setScalar(0.35 + 0.65 * open); });
  } };
}
// a single 3D peacock feather (for props)
export function featherProp(parent, k = 1) {
  const f = new THREE.Group(); f.scale.setScalar(k); parent.add(f);
  mesh(new THREE.CylinderGeometry(0.012, 0.012, 1.1, 4).translate(0, 0.55, 0), mat(0xe6c46a), 0, 0, 0, f).userData.noOutline = true;
  const blade = mesh(new THREE.PlaneGeometry(0.2, 0.9).translate(0, 0.65, 0), new THREE.MeshStandardMaterial({ color: 0x2e9d5a, side: THREE.DoubleSide, flatShading: true }), 0, 0, 0, f); blade.userData.noOutline = true;
  for (const [r, c, z] of [[0.11, 0xe3b02a, 0.01], [0.085, 0x16805a, 0.02], [0.06, 0x1e5aa8, 0.03], [0.03, 0x0b1f4d, 0.04]]) mesh(new THREE.CircleGeometry(r, 12), new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide }), 0, 1.0, z, f).userData.noOutline = true;
  return f;
}
