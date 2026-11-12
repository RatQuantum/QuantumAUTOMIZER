// The 3D world (low-poly, sunny): Dwarka's palace courtyard by the sea with the giant scale (tulabharam), a temple
// altar, and a Kerala temple courtyard for Guruvayur. Everything is a function of story time s (deterministic).
import * as THREE from './three.module.js';
import { drawChar, CAST } from './cast.js';

const rng = (seed) => () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const mat = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, flatShading: true, roughness: o.r ?? 0.85, metalness: o.m ?? 0, emissive: o.e ?? 0x000000, emissiveIntensity: o.ei ?? 1 });
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const sm = (x) => { x = clamp(x); return x * x * (3 - 2 * x); };
const seg = (s, a, b) => clamp((s - a) / (b - a));
const lerp = (a, b, k) => a + (b - a) * k;
function mesh(geo, m, x = 0, y = 0, z = 0, parent) { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); o.castShadow = true; o.receiveShadow = true; if (parent) parent.add(o); return o; }

export function buildWorld(scene) {
  const R = rng(19);
  scene.background = null;
  scene.fog = new THREE.Fog(0xbfe3ff, 30, 90);
  scene.add(new THREE.HemisphereLight(0xdff2ff, 0x6a8a3a, 1.35));
  const sun = new THREE.DirectionalLight(0xfff1d6, 2.2); sun.position.set(-8, 14, 9); sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16, near: 1, far: 50 }); sun.shadow.bias = -0.0005;
  scene.add(sun); scene.add(sun.target);
  const W = {};
  // ground: gentle low-poly hills of grass
  const g = new THREE.PlaneGeometry(160, 160, 80, 80); g.rotateX(-Math.PI / 2);
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) { const x = pos.getX(i), z = pos.getZ(i), d = Math.hypot(x, z), d2 = Math.hypot(x - 40, z), d3 = Math.hypot(x + 40, z); const flat = Math.min(d, d2, d3); pos.setY(i, flat > 14 ? (R() * 0.5 + Math.sin(x * 0.2) * 0.4 + Math.cos(z * 0.17) * 0.4) * sm((flat - 12) / 10) : 0); }
  g.computeVertexNormals();
  mesh(g, mat(0x6ccf3e), 0, 0, 0, scene).castShadow = false;
  // the sea behind Dwarka
  const sea = mesh(new THREE.PlaneGeometry(200, 60, 40, 12).rotateX(-Math.PI / 2), mat(0x2f9fd8, { r: 0.4 }), 0, 0.05, -48, scene); sea.castShadow = false; W.sea = sea;
  // sky clouds
  W.clouds = [];
  for (let i = 0; i < 9; i++) { const cg = new THREE.Group(); for (let k = 0; k < 4; k++) mesh(new THREE.IcosahedronGeometry(1 + R() * 0.9, 0), mat(0xffffff, { r: 1 }), k * 1.2 - 1.8, R() * 0.5, R() * 0.6, cg).castShadow = false; cg.position.set(-60 + i * 15 + R() * 6, 14 + R() * 5, -30 - R() * 10); scene.add(cg); W.clouds.push(cg); }
  // ---- DWARKA courtyard (origin)
  mesh(new THREE.CylinderGeometry(6.2, 6.2, 0.12, 24), mat(0xefdcab), 0, 0.06, 0, scene);
  mesh(new THREE.CylinderGeometry(2.6, 2.6, 0.14, 24), mat(0xe2c48a), 0, 0.08, 0, scene);
  for (let i = 0; i < 40; i++) { const a = R() * Math.PI * 2, r = 6.8 + R() * 6; mesh(new THREE.IcosahedronGeometry(0.25 + R() * 0.25, 0), mat([0xe8462c, 0xffd23a, 0xffffff, 0xf5a6c0][i % 4]), Math.cos(a) * r, 0.2, Math.sin(a) * r * 0.8 + 2, scene); }   // flowers in the grass
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.16, 8), mat([0xd8263a, 0xffd23a, 0x3fae7a][i % 3]), Math.cos(a) * 2.35, 0.12, Math.sin(a) * 2.35, scene); }   // a rangoli ring
  palace(scene, 0, -11, R);
  for (const [x, z] of [[-9, -4], [9, -4], [-11, 4], [11, 5], [-7, 9], [8, 10]]) palm(scene, x, z, R);
  for (const [x, z] of [[-14, -2], [14, -1], [-15, 8], [16, 9]]) roundTree(scene, x, z, R);
  for (let i = 0; i < 14; i++) { const a = R() * Math.PI * 2, r = 12 + R() * 8; mesh(new THREE.DodecahedronGeometry(0.4 + R() * 0.6, 0), mat(0x9a96b0), Math.cos(a) * r, 0.2, Math.sin(a) * r, scene); }
  // bunting over the courtyard
  for (let i = 0; i < 16; i++) { const x = -7 + i * 0.9; const f = mesh(new THREE.ConeGeometry(0.22, 0.45, 3), mat([0xd8263a, 0xffd23a, 0x2f9fd8, 0x3fae7a][i % 4]), x, 6.2 - Math.sin(i / 15 * Math.PI) * 0.8, -5, scene); f.rotation.x = Math.PI; }
  W.scale = makeScale(scene, 0, 0, 1);
  // gold: necklaces, bangles, crowns, then the treasury (coins and chests); each lands on the right pan in turn
  W.gold = [];
  const gm = mat(0xffc22e, { r: 0.3, m: 0.85, e: 0x5a3a00, ei: 0.35 });
  const kinds = [];
  for (let i = 0; i < 6; i++) kinds.push(['neck', 22.75 + i * 0.16]);
  for (let i = 0; i < 9; i++) kinds.push(['bangle', 23.98 + i * 0.07]);
  for (let i = 0; i < 4; i++) kinds.push(['crown', 24.84 + i * 0.16]);
  for (let i = 0; i < 18; i++) kinds.push(['coin', 25.7 + i * 0.045]);
  for (let i = 0; i < 2; i++) kinds.push(['chest', 25.9 + i * 0.3]);
  kinds.forEach(([k, td], i) => {
    let o;
    if (k === 'neck') { o = mesh(new THREE.TorusGeometry(0.26, 0.05, 6, 16), gm); o.rotation.x = Math.PI / 2; }
    else if (k === 'bangle') { o = mesh(new THREE.TorusGeometry(0.13, 0.04, 6, 12), gm); o.rotation.x = Math.PI / 2 + R() * 0.6; }
    else if (k === 'crown') { o = new THREE.Group(); mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.14, 10, 1, true), gm, 0, 0, 0, o); for (let p = 0; p < 5; p++) { const a = p / 5 * Math.PI * 2; mesh(new THREE.ConeGeometry(0.05, 0.14, 4), gm, Math.cos(a) * 0.16, 0.12, Math.sin(a) * 0.16, o); } mesh(new THREE.SphereGeometry(0.04, 6, 4), mat(0xd8263a), 0.17, 0.03, 0, o); }
    else if (k === 'coin') { o = mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.025, 10), gm); o.rotation.z = R() * 0.5; }
    else { o = new THREE.Group(); mesh(new THREE.BoxGeometry(0.5, 0.3, 0.32), mat(0x8a4b20), 0, 0, 0, o); mesh(new THREE.BoxGeometry(0.52, 0.06, 0.34), gm, 0, 0.08, 0, o); mesh(new THREE.SphereGeometry(0.16, 6, 4), gm, 0, 0.18, 0, o); }
    const ring = i % 6, layer = Math.floor(i / 6);
    o.userData = { td, home: new THREE.Vector3(Math.cos(ring * 1.05 + layer) * 0.4 * (layer % 2 ? 0.6 : 1), 0.1 + layer * 0.09, Math.sin(ring * 1.05 + layer) * 0.4 * (layer % 2 ? 0.6 : 1)), spin: R() * 6 };
    o.visible = false; W.scale.panR.add(o); W.gold.push(o);
  });
  // flying coins when the scale tips
  W.fly = []; for (let i = 0; i < 10; i++) { const o = mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.025, 10), gm); o.visible = false; o.userData = { vx: (R() - 0.3) * 2.5, vy: 2 + R() * 2, vz: (R() - 0.5) * 2 }; scene.add(o); W.fly.push(o); }
  // the tulsi leaf
  const ls = new THREE.Shape(); ls.moveTo(0, -0.12); ls.quadraticCurveTo(0.11, 0, 0, 0.14); ls.quadraticCurveTo(-0.11, 0, 0, -0.12);
  W.leaf = mesh(new THREE.ShapeGeometry(ls), new THREE.MeshStandardMaterial({ color: 0x4fc04a, side: THREE.DoubleSide, emissive: 0x1a5a10, emissiveIntensity: 0.4 }), 0, 0, 0, scene); W.leaf.scale.setScalar(2.6);
  // ---- TEMPLE ALTAR (x = 40): a banana leaf with the food, and one tulsi leaf on top
  const T = new THREE.Group(); T.position.set(40, 0, 0); scene.add(T); W.temple = T;
  mesh(new THREE.BoxGeometry(8, 6, 0.4), mat(0xb8352a), 0, 3, -2.2, T);
  for (let i = 0; i < 7; i++) mesh(new THREE.BoxGeometry(0.3, 5.6, 0.2), mat(0xffd23a, { m: 0.4, r: 0.5 }), -3 + i, 3, -1.9, T);
  mesh(new THREE.BoxGeometry(5, 0.9, 2.4), mat(0x8a4b20), 0, 0.45, 0, T);
  const bl = mesh(new THREE.PlaneGeometry(2.6, 1.0).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0x3fae4a, side: THREE.DoubleSide, flatShading: true }), 0, 0.92, 0.2, T);
  mesh(new THREE.SphereGeometry(0.32, 8, 5).scale(1, 0.6, 1), mat(0xfaf6ea), -0.6, 1.05, 0.2, T);   // rice
  for (let i = 0; i < 4; i++) mesh(new THREE.SphereGeometry(0.13, 8, 6), mat(0xf2a53a), 0.1 + (i % 2) * 0.26, 1.04 + Math.floor(i / 2) * 0.2, 0.05 + (i % 2) * 0.2, T);   // laddoos
  mesh(new THREE.CylinderGeometry(0.22, 0.16, 0.14, 10), mat(0xd9a441, { m: 0.6, r: 0.4 }), 0.85, 1.0, 0.25, T);   // a bowl of payasam
  W.altarLeaf = mesh(new THREE.ShapeGeometry(ls), new THREE.MeshStandardMaterial({ color: 0x4fc04a, side: THREE.DoubleSide, emissive: 0x2a8a20, emissiveIntensity: 0.5 }), -0.6, 1.24, 0.25, T); W.altarLeaf.rotation.x = -0.5; W.altarLeaf.scale.setScalar(2.4);
  W.lamp = lamp(T, 1.9, 0.9, 0.0);
  // ---- GURUVAYUR (x = -40): a Kerala temple with sloping copper roofs, a tall lamp tower, and a scale with bananas
  const G = new THREE.Group(); G.position.set(-40, 0, 0); scene.add(G); W.guru = G;
  mesh(new THREE.CylinderGeometry(9, 9, 0.12, 24), mat(0xd9c49a), 0, 0.06, 0, G);
  mesh(new THREE.BoxGeometry(10, 3, 4), mat(0xf3ead6), 0, 1.5, -9, G);
  for (let k = 0; k < 3; k++) { const r = mesh(new THREE.ConeGeometry(7.6 - k * 2.2, 1.7, 4, 1), mat(0x9a4a2a, { r: 0.6 }), 0, 3.85 + k * 1.25, -9, G); r.rotation.y = Math.PI / 4; r.scale.z = 0.42; mesh(new THREE.BoxGeometry(9.6 - k * 3, 1.0, 3.4 - k * 0.6), mat(0xf3ead6), 0, 3.0 + k * 1.25, -9, G); }
  mesh(new THREE.ConeGeometry(0.3, 1.0, 6), mat(0xffd23a, { m: 0.5, r: 0.4 }), 0, 7.6, -9, G);
  const dl = mesh(new THREE.CylinderGeometry(0.18, 0.35, 5.5, 8), mat(0xc98a3a, { m: 0.7, r: 0.4 }), -5, 2.75, -4, G); for (let k = 0; k < 7; k++) mesh(new THREE.CylinderGeometry(0.6 - k * 0.05, 0.6 - k * 0.05, 0.06, 10), mat(0xc98a3a, { m: 0.7, r: 0.4 }), -5, 0.8 + k * 0.7, -4, G);
  for (const [x, z] of [[-9, 3], [9, 2], [8, -3]]) palm(G, x, z, R);
  W.scale2 = makeScale(G, 0, 0, 0.85);
  W.bananas = new THREE.Group(); W.scale2.panR.add(W.bananas);
  const bm = mat(0xffd23a);
  for (let i = 0; i < 26; i++) { const b = mesh(new THREE.TorusGeometry(0.2, 0.055, 5, 8, Math.PI * 0.7), bm, 0, 0, 0, W.bananas); const ring = i % 7, layer = Math.floor(i / 7); b.position.set(Math.cos(ring) * 0.42 * (1 - layer * 0.2), 0.1 + layer * 0.12, Math.sin(ring) * 0.42 * (1 - layer * 0.2)); b.rotation.set(R() * 3, R() * 3, R() * 3); }

  // tulsi in its pedestal (a tulsi vrindavan), at the palace, the altar and Guruvayur
  const tulsi = (parent, x, z) => { mesh(new THREE.BoxGeometry(0.9, 0.9, 0.9), mat(0xf3e2b8), x, 0.45, z, parent); mesh(new THREE.BoxGeometry(1.1, 0.14, 1.1), mat(0xd8573a), x, 0.95, z, parent); for (let i = 0; i < 5; i++) mesh(new THREE.IcosahedronGeometry(0.26 + R() * 0.1, 0), mat([0x3fa83a, 0x4fc04a, 0x2f8a2a][i % 3]), x + (R() - 0.5) * 0.4, 1.3 + i * 0.16, z + (R() - 0.5) * 0.4, parent); };
  tulsi(scene, -6.4, -1.2); tulsi(T, -3.0, 0.6); tulsi(G, -6.5, 2.5);
  // the altar: a canopy, marigold strings and a second lamp (the idol is a billboard posed in main.js)
  mesh(new THREE.BoxGeometry(3.4, 0.3, 1.2), mat(0xffd23a, { m: 0.5, r: 0.4 }), 0, 4.4, -1.5, T);
  for (let i = 0; i < 16; i++) mesh(new THREE.SphereGeometry(0.11, 6, 4), mat(i % 2 ? 0xf6a531 : 0xffd23a), -1.5 + i * 0.2, 4.1 - Math.sin(i / 15 * Math.PI) * 0.5, -1.4, T);
  lamp(T, -1.9, 0.9, 0.0);
  // an elephant with a gold forehead ornament at Guruvayur
  { const e = new THREE.Group(); e.position.set(3.4, 0, -5.2); e.rotation.y = -1.25; e.scale.setScalar(0.8); G.add(e); const grey = mat(0x8f8f9a), gold = mat(0xffd23a, { m: 0.6, r: 0.35 });
    mesh(new THREE.BoxGeometry(2.6, 1.9, 1.6), grey, 0, 2.0, 0, e); mesh(new THREE.BoxGeometry(1.3, 1.4, 1.3), grey, 1.7, 2.5, 0, e);
    for (let i = 0; i < 4; i++) mesh(new THREE.BoxGeometry(0.34 - i * 0.03, 0.55, 0.34 - i * 0.03), grey, 2.35 + i * 0.07, 1.75 - i * 0.5, 0, e);
    for (const dz of [-0.8, 0.8]) { const ear = mesh(new THREE.BoxGeometry(0.12, 1.1, 0.9), grey, 1.5, 2.6, dz * 1.05, e); ear.rotation.x = dz * 0.25; mesh(new THREE.ConeGeometry(0.07, 0.6, 5), mat(0xfff6dc), 2.3, 1.9, dz * 0.4, e).rotation.z = -1.9; }
    for (const [dx, dz] of [[-0.9, -0.5], [-0.9, 0.5], [0.8, -0.5], [0.8, 0.5]]) mesh(new THREE.BoxGeometry(0.5, 1.2, 0.5), grey, dx, 0.6, dz, e);
    mesh(new THREE.BoxGeometry(0.1, 1.1, 0.8), gold, 2.38, 2.7, 0, e); mesh(new THREE.BoxGeometry(2.0, 0.1, 1.7), mat(0xd8263a), 0, 2.98, 0, e); mesh(new THREE.BoxGeometry(2.1, 0.06, 1.8), gold, 0, 2.92, 0, e); W.elephant = e; }
  return W;
}

function palace(scene, x, z, R) {
  const P = new THREE.Group(); P.position.set(x, 0, z); scene.add(P);
  const cream = mat(0xf3e2b8), red = mat(0xd8573a), gold = mat(0xffd23a, { m: 0.5, r: 0.4 });
  mesh(new THREE.BoxGeometry(18, 4.5, 4), cream, 0, 2.25, 0, P);
  mesh(new THREE.BoxGeometry(6, 7, 4.4), cream, 0, 3.5, 0.2, P);
  for (const dx of [-7.5, 7.5]) { mesh(new THREE.CylinderGeometry(1.2, 1.4, 7.5, 8), cream, dx, 3.75, 1, P); mesh(new THREE.SphereGeometry(1.4, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), red, dx, 7.5, 1, P); mesh(new THREE.ConeGeometry(0.25, 0.9, 6), gold, dx, 9.3, 1, P); }
  mesh(new THREE.SphereGeometry(2.6, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), red, 0, 7, 0.2, P); mesh(new THREE.ConeGeometry(0.35, 1.3, 6), gold, 0, 10.1, 0.2, P);
  for (let i = 0; i < 8; i++) mesh(new THREE.CylinderGeometry(0.22, 0.22, 3.6, 8), cream, -6 + i * (12 / 7), 1.8, 2.3, P);
  mesh(new THREE.BoxGeometry(2.2, 3.4, 0.3), mat(0x7a3a1a), 0, 1.7, 2.45, P);   // the door
  for (let i = 0; i < 6; i++) mesh(new THREE.BoxGeometry(0.9, 1.1, 0.2), mat(0x2f6fa8), -7 + i * 2.8 + (i > 2 ? 1.4 : -1.4), 3.4, 2.1, P);   // windows
  for (const dx of [-2.6, 2.6]) { const pole = mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.2, 6), mat(0x6b4a2a), dx, 8.1, 0.4, P); const flag = mesh(new THREE.BoxGeometry(0.9, 0.5, 0.04), mat(0xff8a1e), dx + 0.47, 8.9, 0.4, P); flag.userData.flag = true; }
}
function palm(parent, x, z, R) {
  const t = new THREE.Group(); t.position.set(x, 0, z); parent.add(t);
  const lean = (R() - 0.5) * 0.3;
  for (let i = 0; i < 6; i++) mesh(new THREE.CylinderGeometry(0.22 - i * 0.02, 0.26 - i * 0.02, 0.8, 6), mat(0x9a6a3a), lean * i * 0.6, 0.4 + i * 0.78, 0, t);
  for (let i = 0; i < 6; i++) { const l = mesh(new THREE.ConeGeometry(0.5, 2.6, 4), mat(0x3fa83a), lean * 3.6, 4.7, 0, t); l.rotation.z = Math.PI / 2.3; l.rotation.y = i / 6 * Math.PI * 2; l.translateY(-1.2); }
}
function roundTree(parent, x, z, R) {
  mesh(new THREE.CylinderGeometry(0.25, 0.35, 2, 6), mat(0x8a5a2a), x, 1, z, parent);
  for (let i = 0; i < 3; i++) mesh(new THREE.IcosahedronGeometry(1.4 + R() * 0.5, 0), mat([0x4fb83a, 0x5ccf45, 0x3fa83a][i]), x + (R() - 0.5) * 1.2, 2.8 + i * 0.6, z + (R() - 0.5) * 1.2, parent);
}
function lamp(parent, x, y, z) {
  const g = new THREE.Group(); g.position.set(x, y, z); parent.add(g);
  const brass = mat(0xd9a441, { m: 0.7, r: 0.35 });
  mesh(new THREE.CylinderGeometry(0.25, 0.32, 0.08, 10), brass, 0, 0.04, 0, g); mesh(new THREE.CylinderGeometry(0.04, 0.06, 0.9, 8), brass, 0, 0.5, 0, g); mesh(new THREE.CylinderGeometry(0.22, 0.12, 0.12, 10), brass, 0, 0.98, 0, g);
  const fl = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.18, 6), new THREE.MeshBasicMaterial({ color: 0xffc23a })); fl.position.set(0, 1.14, 0); g.add(fl);
  const pl = new THREE.PointLight(0xffa64a, 6, 6, 1.6); pl.position.set(0, 1.3, 0.2); g.add(pl);
  return { flame: fl, light: pl };
}
// the giant scale: a post, a beam that tilts, two pans hanging from chains
function makeScale(parent, x, z, k) {
  const S = new THREE.Group(); S.position.set(x, 0, z); S.scale.setScalar(k); parent.add(S);
  const wood = mat(0x8a4b20), brass = mat(0xd9a441, { m: 0.75, r: 0.35 });
  mesh(new THREE.BoxGeometry(1.2, 0.3, 1.2), wood, 0, 0.15, -0.6, S);
  mesh(new THREE.BoxGeometry(0.26, 4.2, 0.26), wood, 0, 2.2, -0.6, S);
  mesh(new THREE.SphereGeometry(0.22, 8, 6), brass, 0, 4.35, -0.6, S);
  const beam = new THREE.Group(); beam.position.set(0, 4.2, -0.6); S.add(beam);
  mesh(new THREE.BoxGeometry(4.4, 0.18, 0.2), brass, 0, 0, 0, beam);
  for (const dx of [-2.15, 2.15]) mesh(new THREE.SphereGeometry(0.13, 8, 6), brass, dx, 0, 0, beam);
  const pans = [];
  for (const side of [-1, 1]) {
    const pan = new THREE.Group(); S.add(pan);
    mesh(new THREE.CylinderGeometry(0.85, 0.7, 0.14, 16), brass, 0, 0, 0, pan);
    const chains = [];
    for (let i = 0; i < 3; i++) { const c = mesh(new THREE.CylinderGeometry(0.018, 0.018, 1, 4), brass, 0, 0, 0, S); chains.push(c); }
    pans.push({ pan, chains, side });
  }
  const api = { group: S, beam, panL: pans[0].pan, panR: pans[1].pan, tilt: 0 };
  api.set = (theta) => {   // theta > 0: the left pan goes down
    beam.rotation.z = theta;
    for (const p of pans) {
      const ex = p.side * 2.15 * Math.cos(theta), ey = 4.2 + p.side * 2.15 * Math.sin(theta);
      p.pan.position.set(ex, ey - 2.4, -0.6);
      p.chains.forEach((c, i) => { const a = i / 3 * Math.PI * 2, rx = ex + Math.cos(a) * 0.75, rz = -0.6 + Math.sin(a) * 0.75, ry = ey - 2.4; const top = new THREE.Vector3(ex, ey, -0.6), bot = new THREE.Vector3(rx, ry, rz); c.position.copy(top).add(bot).multiplyScalar(0.5); c.scale.set(1, top.distanceTo(bot), 1); c.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), bot.clone().sub(top).normalize()); });
    }
  };
  api.set(0);
  return api;
}

// ---- characters as billboards
export function makeCast(scene) {
  const C = {};
  for (const name of ['krishna', 'satyabhama', 'rukmini', 'narada', 'courtier', 'guard', 'guard2', 'devotee', 'idol', 'ex0', 'ex1', 'ex2', 'ex3', 'ex4', 'ex5', 'gd0', 'gd1', 'gd2', 'gd3']) {
    const cv = document.createElement('canvas'); cv.width = 256; cv.height = 512;
    const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
    const geo = new THREE.PlaneGeometry(0.85, 1.7); geo.translate(0, 0.85, 0);
    const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: tex, transparent: true, alphaTest: 0.3, side: THREE.DoubleSide }));
    const sh = new THREE.Mesh(new THREE.CircleGeometry(0.32, 16).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.22 }));
    scene.add(m); scene.add(sh);
    C[name] = { m, sh, cv, tex, key: '', spec: CAST[name === 'guard2' ? 'guard' : name === 'idol' ? 'krishna' : name.startsWith('ex') ? ['courtier', 'guard', 'devotee'][+name[2] % 3] : name.startsWith('gd') ? (+name[2] % 2 ? 'courtier' : 'devotee') : name] };
  }
  return C;
}
export function pose(ch, cam, p) {   // p: { x, y, z, h, mood, arm, step, visible, sitting, leaf, flip }
  ch.m.visible = ch.sh.visible = p.visible !== false;
  if (!ch.m.visible) return;
  const T = window.__T || 0; if (ch.ph === undefined) ch.ph = (ch.m.id * 0.731) % 3.1;
  p.blink = ((T + ch.ph) % 3.3) < 0.12;
  const key = [p.blink, p.mood, p.arm, Math.round((p.step || 0) * 4) / 4, p.sitting, p.leaf].join('|');
  if (key !== ch.key) { drawChar(ch.cv.getContext('2d'), ch.spec, p); ch.tex.needsUpdate = true; ch.key = key; }
  const h = p.h ?? 1.7, bob = p.step ? Math.abs(Math.sin(p.step * Math.PI)) * 0.06 : 0;
  ch.m.position.set(p.x, (p.y ?? 0) + bob, p.z); ch.m.scale.set((p.flip ? -1 : 1) * h / 1.7, h / 1.7 * (1 + 0.013 * Math.sin(T * 2.3 + ch.ph * 2)), 1);
  ch.m.quaternion.copy(cam.quaternion);
  ch.sh.position.set(p.x, (p.y ?? 0) + 0.13, p.z); ch.sh.scale.setScalar(h / 1.7); ch.sh.visible = !p.sitting && ch.m.visible;
}
export { sm, seg, lerp, clamp };
