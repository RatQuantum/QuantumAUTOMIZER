// char3d (KB-16): real 3D characters (no flat cut-outs) for the "rich 3D" look. Same API as kit.js makeCast/pose,
// so storykit can swap them in with spec.render3d. Pixar-style chibi proportions; PBR skin, fabric sheen, metal gold.
import * as THREE from './three.module.js';
const FEM = /gopi|yashoda|satyabhama|rukmini|draupadi|meera|devaki|kunti|gandhari|radha|sister|patientF|holika|putana|uttara|kubja|sudamaWife|oldMother|shabari/i;
const CROWN = /krishna|arjuna|king|karna|kamsa|duryodhana|satyabhama|rukmini|shishupala|naraka|jarasandha|indra|bali/i;
const BEARD = /narada|bhishma|oldFather|priest|brahmin|vasudeva|drona|vyasa|sage/i;
const KRISHNA = /krishna/i;
const std = (c, o = {}) => new THREE.MeshPhysicalMaterial({ color: c, roughness: o.r ?? 0.55, metalness: o.m ?? 0, sheen: o.sheen ?? 0, sheenColor: new THREE.Color(o.sc ?? 0xffffff), sheenRoughness: 0.5, clearcoat: o.cc ?? 0, clearcoatRoughness: 0.3, emissive: new THREE.Color(o.e ?? 0x000000), emissiveIntensity: o.ei ?? 1, transparent: o.op != null, opacity: o.op ?? 1 });
const GOLD = () => std(0xf2c03a, { m: 1, r: 0.22 });
function add(parent, geo, m, x = 0, y = 0, z = 0, sx = 1, sy = 1, sz = 1) { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); o.scale.set(sx, sy, sz); o.castShadow = true; o.receiveShadow = true; o.userData.noOutline = true; parent.add(o); return o; }
function featherTex() {
  const c = document.createElement('canvas'); c.width = 128; c.height = 256; const g = c.getContext('2d');
  g.strokeStyle = '#2a8a3a'; g.lineWidth = 4; g.beginPath(); g.moveTo(64, 256); g.lineTo(64, 40); g.stroke();
  for (let i = 0; i < 40; i++) { const y = 250 - i * 5.2, w = 18 + Math.sin(i / 40 * Math.PI) * 36; g.strokeStyle = i % 2 ? '#3fae4a' : '#2a8a6a'; g.lineWidth = 2; g.beginPath(); g.moveTo(64, y); g.lineTo(64 - w, y - 14); g.moveTo(64, y); g.lineTo(64 + w, y - 14); g.stroke(); }
  const eye = (r, col) => { g.fillStyle = col; g.beginPath(); g.ellipse(64, 70, r * 0.8, r, 0, 0, Math.PI * 2); g.fill(); };
  eye(30, '#1f8a4a'); eye(23, '#d8b23a'); eye(17, '#1a6ad8'); eye(10, '#0a1a4a');
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
export function makeChar3d(scene, base, spec) {
  const root = new THREE.Group(), body = new THREE.Group(); root.add(body); scene.add(root);
  const skinC = new THREE.Color(spec.skin || '#c98a5e'), clothC = new THREE.Color(spec.body || '#e8e4dc');
  const skin = std(skinC, { r: 0.5, sheen: 0.4, sc: 0xffc8a0 }), cloth = std(clothC, { r: 0.75, sheen: 1, sc: clothC.clone().lerp(new THREE.Color(0xffffff), 0.5) });
  const dark = std(0x161218, { r: 0.35, cc: 0.5 }), white = std(0xffffff, { r: 0.15, cc: 1 }), kid = (spec.bodyH || 200) < 180;
  // torso: a flared robe (lathe), legs, feet
  const prof = [[0.0, 0.13], [0.2, 0.14], [0.17, 0.3], [0.135, 0.45], [0.12, 0.53], [0.06, 0.57]].map(([r, y]) => new THREE.Vector2(r, y));
  add(body, new THREE.LatheGeometry(prof, 32), cloth);
  add(body, new THREE.TorusGeometry(0.198, 0.016, 8, 40).rotateX(Math.PI / 2), GOLD(), 0, 0.142, 0);   // zari hem
  add(body, new THREE.TorusGeometry(0.165, 0.014, 8, 32).rotateX(Math.PI / 2), KRISHNA.test(base) ? std(0xd8263a, { sheen: 1 }) : GOLD(), 0, 0.34, 0);   // sash / belt
  const legs = [-1, 1].map((sd) => { const l = new THREE.Group(); l.position.set(sd * 0.06, 0.14, 0); body.add(l); add(l, new THREE.CapsuleGeometry(0.042, 0.08, 6, 12), skin, 0, -0.07, 0); add(l, new THREE.SphereGeometry(0.05, 12, 8), dark, 0, -0.13, 0.025, 1, 0.55, 1.5); return l; });
  // arms (shoulder pivots)
  const arms = [-1, 1].map((sd) => { const a = new THREE.Group(); a.position.set(sd * 0.135, 0.5, 0); body.add(a); add(a, new THREE.CapsuleGeometry(0.038, 0.15, 6, 12), cloth, 0, -0.1, 0); add(a, new THREE.SphereGeometry(0.048, 14, 10), skin, 0, -0.21, 0); add(a, new THREE.TorusGeometry(0.04, 0.009, 6, 16).rotateX(Math.PI / 2), GOLD(), 0, -0.175, 0); return a; });
  // head
  const head = new THREE.Group(); head.position.y = 0.77; body.add(head);
  add(head, new THREE.SphereGeometry(0.2, 40, 28), skin, 0, 0, 0, 1, 0.95, 0.97);
  for (const sd of [-1, 1]) add(head, new THREE.SphereGeometry(0.04, 12, 8), skin, sd * 0.2, -0.01, 0, 0.5, 1, 0.8);            // ears
  const eyes = [-1, 1].map((sd) => { const e = new THREE.Group(); e.position.set(sd * 0.072, 0.01, 0.168); head.add(e); add(e, new THREE.SphereGeometry(0.046, 20, 14), white, 0, 0, 0, 1, 1.15, 0.55); const iris = add(e, new THREE.SphereGeometry(0.03, 18, 12), std(KRISHNA.test(base) ? 0x1a1030 : 0x2a1a12, { r: 0.2, cc: 1 }), 0, -0.004, 0.02, 1, 1.1, 0.5); add(e, new THREE.SphereGeometry(0.009, 8, 6), std(0xffffff, { e: 0xffffff, ei: 1.5 }), 0.012, 0.016, 0.036); return { e, iris }; });
  const lids = [-1, 1].map((sd) => add(head, new THREE.TorusGeometry(0.036, 0.008, 6, 16, Math.PI), dark, sd * 0.072, 0.0, 0.19));
  const brows = [-1, 1].map((sd) => add(head, new THREE.CapsuleGeometry(0.008, 0.05, 4, 8).rotateZ(Math.PI / 2), dark, sd * 0.075, 0.075, 0.18));
  const smile = add(head, new THREE.TorusGeometry(0.04, 0.009, 6, 18, Math.PI), std(0x6a1a1a), 0, -0.075, 0.185); smile.rotation.z = Math.PI;
  const frown = add(head, new THREE.TorusGeometry(0.03, 0.008, 6, 18, Math.PI), std(0x6a1a1a), 0, -0.095, 0.185);
  const open = add(head, new THREE.SphereGeometry(0.03, 14, 10), std(0x4a0a12), 0, -0.085, 0.18, 1, 1.2, 0.5);
  for (const sd of [-1, 1]) add(head, new THREE.SphereGeometry(0.03, 12, 8), std(0xff8a8a, { op: 0.45 }), sd * 0.12, -0.05, 0.155, 1, 0.6, 0.3);   // cheeks
  // hair
  const hairM = std(spec.hairC || (BEARD.test(base) ? 0xe8e8e8 : 0x141018), { r: 0.45, sheen: 0.25, sc: 0x3a3048 });
  add(head, new THREE.SphereGeometry(0.212, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.42), hairM, 0, 0.012, -0.012);
  for (let i = 0; i < 8; i++) { const a = -0.5 + (i % 4) * 0.33, sd = i < 4 ? -1 : 1; add(head, new THREE.SphereGeometry(0.045, 14, 10), hairM, sd * (0.19 - (i % 4) * 0.012), 0.05 - (i % 4) * 0.055, -0.02 + Math.sin(a) * 0.02); }   // curly locks
  if (FEM.test(base)) { add(head, new THREE.CapsuleGeometry(0.11, 0.18, 8, 16), hairM, 0, -0.17, -0.12, 1.4, 1, 0.6); add(head, new THREE.SphereGeometry(0.012, 8, 6), std(0xd8263a, { e: 0x601010 }), 0, 0.09, 0.19); }
  if (BEARD.test(base)) { add(head, new THREE.ConeGeometry(0.09, 0.2, 16).rotateX(Math.PI), hairM, 0, -0.19, 0.09); add(head, new THREE.SphereGeometry(0.06, 12, 8), hairM, 0, 0.22, -0.02); }
  if (CROWN.test(base)) {
    const cr = new THREE.Group(); cr.position.y = 0.16; head.add(cr); add(cr, new THREE.CylinderGeometry(0.13, 0.15, 0.1, 24, 1, true), GOLD(), 0, 0.03, 0);
    for (let i = 0; i < 7; i++) { const a = (i / 7) * Math.PI * 2; add(cr, new THREE.ConeGeometry(0.03, 0.08, 8), GOLD(), Math.sin(a) * 0.13, 0.11, Math.cos(a) * 0.13); add(cr, new THREE.SphereGeometry(0.016, 10, 8), std([0xd8263a, 0x1a8a4a, 0x2a5ad8][i % 3], { r: 0.1, cc: 1, e: [0x400808, 0x08300a, 0x0a1a50][i % 3] }), Math.sin(a) * 0.15, 0.03, Math.cos(a) * 0.15); }
    if (KRISHNA.test(base)) { const f = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 0.32), new THREE.MeshStandardMaterial({ map: featherTex(), transparent: true, alphaTest: 0.3, side: THREE.DoubleSide, roughness: 0.4 })); f.position.set(0.05, 0.27, -0.03); f.rotation.z = -0.35; f.userData.noOutline = true; cr.add(f); }
  }
  for (const sd of [-1, 1]) add(head, new THREE.SphereGeometry(0.018, 10, 8), GOLD(), sd * 0.205, -0.07, 0.01);   // earrings
  if (KRISHNA.test(base)) {   // tilak, Kaustubha, Vaijayanti garland
    add(head, new THREE.CapsuleGeometry(0.006, 0.05, 4, 8), std(0xf4f1ea, { e: 0x404040 }), -0.012, 0.12, 0.19); add(head, new THREE.CapsuleGeometry(0.006, 0.05, 4, 8), std(0xf4f1ea, { e: 0x404040 }), 0.012, 0.12, 0.19);
    for (let i = 0; i < 26; i++) { const a = -0.15 + (i / 25) * (Math.PI + 0.3), r = 0.15; add(body, new THREE.SphereGeometry(0.019, 10, 8), std([0xffd23a, 0xf06aa0, 0xffffff, 0xd8263a, 0x3fae4a][i % 5], { r: 0.4, sheen: 1 }), Math.cos(a) * r, 0.5 - Math.sin(a) * 0.17, 0.11 + Math.sin(a) * 0.05); }
    add(body, new THREE.OctahedronGeometry(0.03), std(0x1a6ad8, { r: 0.05, cc: 1, e: 0x0a2a80 }), 0, 0.47, 0.135);
  } else add(body, new THREE.TorusGeometry(0.1, 0.01, 8, 24, Math.PI).rotateX(-0.5).rotateZ(Math.PI), GOLD(), 0, 0.53, 0.06);
  const flute = add(body, new THREE.CylinderGeometry(0.012, 0.012, 0.36, 10).rotateZ(Math.PI / 2), std(0x8a5a2a, { r: 0.4, cc: 0.6 }), 0.13, 0.7, 0.2); flute.visible = false;
  const bow = add(body, new THREE.TorusGeometry(0.22, 0.012, 6, 24, Math.PI).rotateZ(Math.PI / 2), std(0x7a4a22, { r: 0.4 }), -0.2, 0.45, 0.06); bow.visible = false;
  root.traverse((o) => { o.userData.noOutline = true; });
  return { m: root, body, head, arms, legs, eyes, lids, brows, smile, frown, open, flute, bow, spec, kid };
}
export function makeCast3d(scene, list) { const C = {}; list.forEach(([id, base, spec]) => (C[id] = makeChar3d(scene, base, spec))); return C; }
const ARM = { down: [[0, 0, 0.12], [0, 0, -0.12]], up: [[0, 0, 2.6], [0, 0, -2.6]], offer: [[-1.2, 0, 0.3], [-1.2, 0, -0.3]], point: [[0, 0, 0.15], [-1.55, 0, -0.1]], hips: [[0, 0, 0.7], [0, 0, -0.7]], fold: [[-1.15, 0, -0.55], [-1.15, 0, 0.55]], wave: [[0, 0, 0.12], [0, 0, -2.5]] };
export function pose3d(ch, camera, p) {
  ch.m.visible = !!p.visible; if (!p.visible) return;
  const h = p.h || 1.7; ch.m.position.set(p.x || 0, (p.y || 0) + (p.sitting ? -0.1 * h : 0), p.z || 0); ch.m.scale.setScalar(h); ch.m.rotation.set(0, 0, 0);
  const dx = camera.position.x - ch.m.position.x, dz = camera.position.z - ch.m.position.z; ch.m.rotation.y = Math.atan2(dx, dz) + (p.flip ? -0.45 : 0.15);
  const t = window.__T || 0, st = p.step || 0, mood = p.mood || 'normal';
  ch.body.position.y = Math.abs(Math.sin(st * 2)) * 0.02 + Math.sin(t * 2.1 + ch.m.position.x) * 0.004;     // idle breathing / walk bob
  ch.body.rotation.z = Math.sin(t * 1.3 + ch.m.position.z) * 0.015;
  ch.legs.forEach((l, i) => { l.rotation.x = p.sitting ? -1.5 : Math.sin(st * 2 + i * Math.PI) * 0.5; });
  let a = ARM[p.namaste ? 'fold' : p.arm || 'down'] || ARM.down;
  if (p.flute) a = [[-1.25, 0, -0.75], [-1.3, 0, 0.6]]; if (p.bow) a = [[-1.3, 0, 0.2], a[1]];
  ch.arms.forEach((ar, i) => { const [x, y, z] = a[i]; ar.rotation.set(x + (p.arm === 'wave' && i === 1 ? Math.sin(t * 8) * 0.25 : 0), y, z + Math.sin(t * 1.7 + i) * 0.03); });
  ch.flute.visible = !!p.flute; ch.bow.visible = !!p.bow;
  // face: brows, lids, mouth
  const closed = mood === 'closed' || mood === 'happy' && Math.sin(t * 0.7) > 0.995, wow = mood === 'wow', sad = mood === 'sad', smug = mood === 'smug';
  ch.eyes.forEach(({ e }, i) => { e.visible = !closed && !(mood === 'wink' && i === 0); e.scale.y = wow ? 1.15 : smug ? 0.7 : 1; });
  ch.lids.forEach((l, i) => { l.visible = closed || (mood === 'wink' && i === 0); l.rotation.z = mood === 'happy' || mood === 'closed' ? 0 : Math.PI; });
  ch.brows.forEach((b, i) => { const sd = i ? 1 : -1; b.rotation.z = sad ? sd * -0.35 : smug ? sd * 0.12 : wow ? 0 : mood === 'angry' ? sd * 0.4 : sd * 0.05; b.position.y = wow ? 0.09 : 0.075; });
  ch.smile.visible = mood === 'happy' || smug || mood === 'normal' || closed || mood === 'wink'; ch.smile.scale.setScalar(mood === 'normal' ? 0.6 : 1);
  ch.frown.visible = sad || mood === 'angry'; ch.open.visible = wow;
}
