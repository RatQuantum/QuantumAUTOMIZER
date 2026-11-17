// Shared polish for the 3D "Why we do what we do" reels: cartoon outlines (inverted hulls), ambient life (birds,
// butterflies, grass), confetti, an impact camera shake. Deterministic: everything is a function of time.
import * as THREE from './three.module.js';

export function addOutlines(root, t = 0.028) {
  root.updateMatrixWorld(true);
  const ink = new THREE.MeshBasicMaterial({ color: 0x1d1a24, side: THREE.BackSide });
  const list = [];
  root.traverse((o) => { if (o.isMesh && o.material && o.material.isMeshStandardMaterial && !o.userData.noOutline && o.castShadow) list.push(o); });
  for (const o of list) {
    const g = o.geometry; if (!g.boundingBox) g.computeBoundingBox();
    const s = g.boundingBox.getSize(new THREE.Vector3()); if (Math.max(s.x, s.y, s.z) > 40 || Math.min(s.x, s.y, s.z) < 0.004) continue;
    const c = g.boundingBox.getCenter(new THREE.Vector3()), ws = o.getWorldScale(new THREE.Vector3());
    const h = new THREE.Mesh(g, ink);
    h.scale.set(1 + 2 * t / (s.x * Math.abs(ws.x)), 1 + 2 * t / (s.y * Math.abs(ws.y)), 1 + 2 * t / (s.z * Math.abs(ws.z)));
    h.position.set(-c.x * (h.scale.x - 1), -c.y * (h.scale.y - 1), -c.z * (h.scale.z - 1));
    h.userData.noOutline = true; h.castShadow = false; h.receiveShadow = false; o.add(h);
  }
}
const rnd = (seed) => () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
// zones: [{ x, z, r0, r1 }] rings where grass and butterflies live; birds cross the sky above each zone
export function addLife(scene, zones, seed = 7) {
  const R = rnd(seed), items = [];
  const gm = new THREE.MeshStandardMaterial({ color: 0x4fb83a, flatShading: true }), gm2 = new THREE.MeshStandardMaterial({ color: 0x86d84a, flatShading: true });
  for (const zn of zones) {
    for (let i = 0; i < 70; i++) { const a = R() * Math.PI * 2, r = zn.r0 + R() * (zn.r1 - zn.r0); const m = new THREE.Mesh(new THREE.ConeGeometry(0.09 + R() * 0.06, 0.3 + R() * 0.3, 4), i % 2 ? gm : gm2); m.position.set(zn.x + Math.cos(a) * r, 0.15, zn.z + Math.sin(a) * r); m.userData.noOutline = true; scene.add(m); }
    for (let i = 0; i < 5; i++) {   // birds: two flapping wings
      const b = new THREE.Group(), wm = new THREE.MeshBasicMaterial({ color: 0x2a2630, side: THREE.DoubleSide });
      const wg = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.5, 0, -0.12), new THREE.Vector3(0.5, 0, 0.16)]);
      const l = new THREE.Mesh(wg, wm), r = new THREE.Mesh(wg, wm); r.scale.x = -1; b.add(l); b.add(r); scene.add(b);
      items.push((t) => { const u = (t * 2.6 + i * 11 + R.s) % 50; b.position.set(zn.x - 25 + u, 9 + i * 0.9 + Math.sin(t * 0.7 + i) * 0.5, zn.z - 10 - i * 2.2); const f = Math.sin(t * 9 + i * 2) * 0.7; l.rotation.z = f; r.rotation.z = -f; });
    }
    for (let i = 0; i < 6; i++) {   // butterflies
      const b = new THREE.Group(), col = [0xffd23a, 0xff7ab0, 0x7ad8ff, 0xffffff][i % 4], wm = new THREE.MeshBasicMaterial({ color: col, side: THREE.DoubleSide });
      const wg = new THREE.CircleGeometry(0.09, 6); const l = new THREE.Mesh(wg, wm), r = new THREE.Mesh(wg, wm); l.position.x = 0.08; r.position.x = -0.08; b.add(l); b.add(r); scene.add(b);
      const a0 = R() * 6.28, rr = zn.r0 + R() * (zn.r1 - zn.r0) * 0.5;
      items.push((t) => { b.position.set(zn.x + Math.cos(a0) * rr + Math.sin(t * 1.3 + i) * 1.1, 0.9 + Math.sin(t * 2.1 + i * 3) * 0.35, zn.z + Math.sin(a0) * rr + Math.cos(t * 1.1 + i * 2) * 1.1); const f = Math.sin(t * 16 + i) * 1.0; l.rotation.y = f; r.rotation.y = -f; b.rotation.y = t * 0.6 + i; });
    }
  }
  R.s = 0;
  return (t) => items.forEach((f) => f(t));
}
// confetti: n flat squares bursting from origin at t0, fluttering down for ~3.5 s
export function makeConfetti(scene, n = 90, seed = 3) {
  const R = rnd(seed), cols = [0xffd23a, 0xff5a8a, 0x5ad8ff, 0x8aff7a, 0xff8a1e, 0xffffff], P = [];
  for (let i = 0; i < n; i++) { const m = new THREE.Mesh(new THREE.PlaneGeometry(0.14, 0.09), new THREE.MeshBasicMaterial({ color: cols[i % 6], side: THREE.DoubleSide })); m.visible = false; scene.add(m); P.push({ m, vx: (R() - 0.5) * 7, vy: 3 + R() * 4, vz: (R() - 0.5) * 4, r: R() * 6 }); }
  return (t0, t, o) => { const u = t - t0; for (const p of P) { p.m.visible = u > 0 && u < 3.6; if (!p.m.visible) continue; const k = 1 - Math.exp(-u * 1.6); p.m.position.set(o.x + p.vx * k * 0.6 + Math.sin(u * 3 + p.r) * 0.25, o.y + p.vy * k * 0.5 - u * 1.3, o.z + p.vz * k * 0.6); p.m.rotation.set(u * 5 + p.r, u * 3 + p.r, p.r); } };
}
// one decaying shake for an impact at t0 (the single accent, rule 7e)
export function shake(camera, t, t0, amp = 0.09) { const u = t - t0; if (u < 0 || u > 0.6) return; const k = amp * Math.exp(-u * 8); camera.position.x += Math.sin(u * 70) * k; camera.position.y += Math.cos(u * 83) * k; }
