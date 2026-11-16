// Day 48 · "Why do we sing bhajans?" · Why we do what we do #30 (as the story goes: Meera and the cup of poison)
// Strategy 8 hook/tracker/pinned CTA + Strategy 9 camera moves.
// Sets: the Krishna temple (origin), the royal hall (x = 40), the street (x = 80), a bhajan circle today (x = 120).
import * as THREE from './three.module.js';
import { rng, mat, mesh, sm, seg, lerp, clamp, setupScene, makeCast, pose, lamp, hut, roundTree } from './kit.js';
import { makeStage, direct, wordTime } from './director.js';
import { addOutlines, makeConfetti } from './plus.js';
import { WORDS, DURATION } from './data.js';

const stage = makeStage(), { scene, camera } = stage, V = (x, y, z) => new THREE.Vector3(x, y, z), R = rng(48);
const S = setupScene(scene, [[0, 0], [40, 0], [80, 0], [120, 0]], 48);
const WT = wordTime(WORDS);
const E = { as: WT('as'), meera: WT('meera'), little: WT('little'), danced: WT('danced'), royal: WT('royal'), furious: WT('furious'), queen2: WT('queen', 2), shameful: WT('shameful'), golden: WT('golden'),
  drink: WT('drink'), poison2: WT('poison', 2), knew: WT('knew'), smiled: WT('smiled'), offered: WT('offered'), drank2: WT('drank', 2), wait: WT('wait'), nothing: WT('nothing'), nectar2: WT('nectar', 2), kept: WT('kept'),
  thats: WT("that's"), when: WT('when'), comment: WT('comment') };
const glow = (c, o = 0.5) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, depthWrite: false, blending: THREE.AdditiveBlending });
const noOut = (m) => { m.userData.noOutline = true; m.castShadow = false; return m; };
function cup(parent, k = 1) {
  const g = new THREE.Group(); parent.add(g); g.scale.setScalar(k); const gold = mat(0xffd23a, { m: 0.6, r: 0.3 });
  noOut(mesh(new THREE.CylinderGeometry(0.12, 0.07, 0.14, 12), gold, 0, 0.16, 0, g)); noOut(mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.1, 6), gold, 0, 0.05, 0, g)); noOut(mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.02, 10), gold, 0, 0.0, 0, g));
  const liquid = noOut(mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.01, 12), new THREE.MeshBasicMaterial({ color: 0x5ad84a }), 0, 0.225, 0, g)); return { g, liquid };
}
// music notes (canvas sprite)
const nc = document.createElement('canvas'); nc.width = nc.height = 64; { const c = nc.getContext('2d'); c.font = 'bold 54px serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineWidth = 6; c.strokeStyle = '#1d1a24'; c.strokeText('♪', 32, 34); c.fillStyle = '#ffd23a'; c.fillText('♪', 32, 34); }
const noteTex = new THREE.CanvasTexture(nc); noteTex.colorSpace = THREE.SRGBColorSpace;
const notes = (n) => { const a = []; for (let i = 0; i < n; i++) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: noteTex, transparent: true, depthWrite: false })); sp.scale.setScalar(0.28); scene.add(sp); a.push({ sp, ph: R(), x: R() }); } return a; };

// ---------------- the temple (origin)
mesh(new THREE.BoxGeometry(14, 0.1, 10), mat(0xf3e6c8), 0, 0.05, 0, scene).castShadow = false; mesh(new THREE.BoxGeometry(14, 8, 0.3), mat(0xe8a040), 0, 4, -3.2, scene);
for (const x of [-4, 4]) { mesh(new THREE.CylinderGeometry(0.3, 0.34, 6, 10), mat(0xfaf5ea), x, 3, -2.4, scene); }
mesh(new THREE.BoxGeometry(3.0, 1.0, 1.3), mat(0x8a4b20), 0, 0.5, -2.4, scene); mesh(new THREE.BoxGeometry(3.1, 0.08, 1.4), mat(0xffd23a), 0, 1.02, -2.4, scene);
for (let i = 0; i < 24; i++) { const a = i / 23 * Math.PI; noOut(mesh(new THREE.SphereGeometry(0.1, 6, 4), mat([0xf06aa0, 0xffffff, 0xffd23a][i % 3]), Math.cos(a) * 1.3, 1.9 + Math.sin(a) * 1.5, -2.9, scene)); }
const tl = [lamp(scene, -1.3, 1.06, -2.0, 0.6), lamp(scene, 1.3, 1.06, -2.0, 0.6)];
const CUP = cup(scene, 1.0), nectarGlow = noOut(mesh(new THREE.SphereGeometry(0.3, 12, 8), glow(0xffe08a, 0), 0, 0, 0, scene));
const tNotes = notes(10);
// ---------------- the royal hall (x = 40)
mesh(new THREE.BoxGeometry(14, 0.1, 10), mat(0x7a2a3a), 40, 0.05, 0, scene).castShadow = false; mesh(new THREE.BoxGeometry(14, 8, 0.3), mat(0x3a1a3a), 40, 4, -3.2, scene);
for (let i = 0; i < 5; i++) { const x = 34.6 + i * 2.7; mesh(new THREE.CylinderGeometry(0.28, 0.32, 6, 10), mat(0xc9a227, { m: 0.4, r: 0.4 }), x, 3, -2.6, scene); }
mesh(new THREE.BoxGeometry(1.8, 0.9, 1.0), mat(0xc9a227, { m: 0.6, r: 0.35 }), 40, 0.45, -2.2, scene); mesh(new THREE.BoxGeometry(1.4, 2.0, 0.2), mat(0xc9a227, { m: 0.6, r: 0.35 }), 40, 1.8, -2.65, scene);
mesh(new THREE.BoxGeometry(1.2, 0.7, 0.7), mat(0x5a2a1a), 41.8, 0.35, 0.4, scene);
const poisonVial = noOut(mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.26, 8), mat(0x2a8a3a), 0, 0, 0, scene));
const hallLamps = [lamp(scene, 37.4, 0.1, -1.6, 0.9), lamp(scene, 42.6, 0.1, -1.6, 0.9)];
// ---------------- the street (x = 80)
mesh(new THREE.BoxGeometry(18, 0.06, 16), mat(0xd9c08a), 80, 0.03, 0, scene).castShadow = false;
[[75.2, -3, 0.2], [84.6, -3.4, -0.3], [74.4, 2.5, 0.5], [85.4, 2.0, -0.5]].forEach(([x, z, r]) => hut(scene, x, z, R, r));
roundTree(scene, 78, -6, R, 1.2); roundTree(scene, 83, -6.5, R, 1.0);
const sNotes = notes(8);
// ---------------- the bhajan circle today (x = 120)
mesh(new THREE.BoxGeometry(12, 0.1, 9), mat(0xf3e6c8), 120, 0.05, 0, scene).castShadow = false; mesh(new THREE.BoxGeometry(12, 8, 0.3), mat(0xd86aa0), 120, 4, -3, scene);
mesh(new THREE.BoxGeometry(2.4, 0.8, 1.0), mat(0x8a4b20), 120, 0.4, -2.3, scene); mesh(new THREE.BoxGeometry(2.5, 0.08, 1.1), mat(0xffd23a), 120, 0.82, -2.3, scene);
const tl2 = [lamp(scene, 119, 0.86, -1.95, 0.55), lamp(scene, 121, 0.86, -1.95, 0.55)];
const harm = new THREE.Group(); harm.position.set(118.9, 0, 0.8); scene.add(harm); mesh(new THREE.BoxGeometry(0.7, 0.3, 0.4), mat(0x8a4b20), 0, 0.15, 0, harm); noOut(mesh(new THREE.BoxGeometry(0.6, 0.02, 0.14), mat(0xfaf5ea), 0, 0.31, 0.12, harm));
const cym = [0, 1].map(() => noOut(mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.02, 12), mat(0xffd23a, { m: 0.6, r: 0.3 }), 0, 0, 0, scene)));
const bNotes = notes(12);
// ---------------- the cast
const C = makeCast(scene, [['m', 'meera'], ['km', 'krishna'], ['lm', 'gopi3'], ['lk', 'kidKrishna'], ['rana', 'king'], ['rm', 'devaki'], ['ct', 'courtier'], ['sm', 'meera'], ['v1', 'gopi1'], ['v2', 'kid1'], ['v3', 'govinda'],
  ['bk', 'krishna'], ['b1', 'devotee'], ['b2', 'gopi2'], ['b3', 'priest'], ['b4', 'kid2']]);
C.rm.spec = Object.assign({}, C.rm.spec, { body: '#7a2a9a' });
C.lm.spec = Object.assign({}, C.m.spec, { bodyH: 170, headR: 74 });
addOutlines(scene);
const confetti = makeConfetti(scene, 50, 48);
const right = new THREE.Vector3();

function update(s, t) {
  const cx = camera.position.x, set = cx > 100 ? 120 : cx > 60 ? 80 : cx > 20 ? 40 : 0, hook = s < E.as;
  S.mood(set === 40 ? 0.45 : 0); S.hemi.intensity = set === 40 ? 1.0 : 1.35; S.sun.target.position.set(set, 0, 0); S.sun.position.set(set - 8, 14, 10); S.sun.target.updateMatrixWorld();
  right.setFromMatrixColumn(camera.matrixWorld, 0); right.y = 0; right.normalize();
  tl.forEach((l, i) => (l.flame.scale.y = 1 + 0.15 * Math.sin(t * 13 + i))); tl2.forEach((l, i) => (l.flame.scale.y = 1 + 0.15 * Math.sin(t * 12 + i))); hallLamps.forEach((l, i) => (l.flame.scale.y = 1 + 0.15 * Math.sin(t * 11 + i)));
  // --- the temple: Krishna on the altar; Meera dances; a little girl with her doll; the cup arrives; she offers, drinks, sings on
  pose(C.km, camera, { visible: set === 0, x: 0, y: 1.06, z: -2.5, h: 1.5, mood: s >= E.nothing || hook ? 'happy' : 'normal', flute: true });
  const girl = s >= E.little - 0.6 && s < E.danced - 0.05;
  pose(C.lm, camera, { visible: set === 0 && girl, x: 0.5, z: 0.4, h: 1.05, mood: 'happy', arm: 'offer' });
  pose(C.lk, camera, { visible: set === 0 && girl, x: 0.5, y: 0.0, z: 0.5, h: 0.0001 });
  const dancing = (s >= E.danced && s < E.royal) || (s >= E.kept && s < E.thats), msg = s >= E.drink - 0.3 && s < E.knew + 0.4;
  const mpos = V(0.7, 0, 0.5);
  const drinking = hook || (s >= E.drank2 && s < E.wait + 0.3), offering = s >= E.offered && s < E.drank2;
  pose(C.m, camera, { visible: set === 0 && !girl && (s < E.royal || s >= E.golden), x: mpos.x + (dancing ? Math.sin(s * 3) * 0.25 : 0), z: mpos.z, h: 1.62, mood: s >= E.knew && s < E.smiled ? 'normal' : s >= E.nothing || dancing || hook ? 'closed' : s >= E.smiled ? 'happy' : 'closed',
    arm: drinking ? 'offer' : offering ? 'offer' : dancing ? (Math.sin(s * 3) > 0 ? 'up' : 'wave') : 'down', tanpura: !dancing && !drinking && !offering && !msg && !(s >= E.knew && s < E.offered), step: dancing ? s * 3 : 0, flip: offering });
  C.m.m.rotation.z += dancing ? Math.sin(s * 3) * 0.06 : 0;
  // the courtier brings the cup
  const walkIn = sm(seg(s, E.drink - 0.4, E.drink + 0.5));
  pose(C.ct, camera, { visible: set === 0 && msg, x: lerp(-4.5, -0.6, walkIn), z: 0.7, h: 1.66, mood: s >= E.poison2 - 0.3 ? 'smug' : 'normal', arm: 'offer', step: walkIn > 0 && walkIn < 1 ? s * 4 : 0 });
  // the cup: on the courtier's tray, Meera's hand, toward Krishna, to her lips; in the hall it's filled
  let cp = null; const mH = V(mpos.x, 0, mpos.z);
  if (set === 0) {
    if (msg && s < E.smiled) cp = V(lerp(-4.5, -0.6, walkIn), 0, 0.72).add(right.clone().multiplyScalar(0.42)).add(V(0, 1.08, 0.02));
    else if (s >= E.smiled && s < E.offered) cp = mH.clone().add(right.clone().multiplyScalar(0.42)).add(V(0, 1.06, 0.03));
    else if (offering) cp = mH.clone().add(right.clone().multiplyScalar(-0.42)).add(V(0, 1.15 + 0.1 * sm(seg(s, E.offered, E.offered + 0.5)), 0.03));
    else if (drinking) cp = mH.clone().add(right.clone().multiplyScalar(0.2)).add(V(0, 0.98, 0.15));
  } else if (set === 40 && s >= E.golden - 0.4 && s < E.drink) cp = V(41.8, 0.72, 0.4);
  CUP.g.visible = !!cp; if (cp) { CUP.g.position.copy(cp); CUP.g.quaternion.copy(camera.quaternion); CUP.g.rotateZ(drinking && set === 0 ? 0.55 : 0); }
  const turned = sm(seg(s, E.nectar2 - 0.6, E.nectar2 + 0.2));
  CUP.liquid.material.color.setHex(turned > 0.5 ? 0xffd23a : 0x5ad84a);
  nectarGlow.visible = set === 0 && (s >= E.nothing && s < E.thats); if (nectarGlow.visible) { nectarGlow.position.copy(mH).add(V(0, 1.3, 0.2)); nectarGlow.scale.setScalar(1 + turned * 0.7); nectarGlow.material.opacity = 0.08 + 0.12 * turned; }
  tNotes.forEach(({ sp, ph, x }) => { const u = (t * 0.35 + ph) % 1; sp.visible = set === 0 && (hook || dancing || (s >= E.drank2 && s < E.thats)); sp.position.set(mpos.x - 0.4 + x * 1.2, 1.6 + u * 2.2, 0.7); sp.material.opacity = 1 - u; });
  // --- the royal hall: the rana and his mother, furious; the vial poured into the golden cup
  const pour = sm(seg(s, E.golden - 0.2, E.golden + 0.5));
  pose(C.rana, camera, { visible: set === 40, x: 40, y: 0.9, z: -2.0, h: 1.9, mood: s >= E.furious - 0.2 ? 'sad' : 'smug', arm: s >= E.furious ? 'point' : 'hips' });
  pose(C.rm, camera, { visible: set === 40, x: 41.3, z: 0.0, h: 1.62, mood: 'smug', arm: s >= E.golden - 0.4 ? 'offer' : 'hips', flip: true });
  poisonVial.visible = set === 40 && s >= E.golden - 0.4; poisonVial.position.set(41.65, 1.0 + (1 - pour) * 0.1, 0.42); poisonVial.rotation.z = pour * 1.9;
  // --- the street: Meera sings with the villagers
  pose(C.sm, camera, { visible: set === 80, x: 80, z: 0, h: 1.62, mood: 'closed', tanpura: true });
  [['v1', -1.6, 0.8, 1.6], ['v2', 1.2, 1.2, 1.1], ['v3', 1.9, -0.3, 1.62]].forEach(([n, x, z, h], i) => pose(C[n], camera, { visible: set === 80, x: 80 + x, z, h, mood: 'happy', arm: Math.sin(t * 5 + i) > 0 ? 'up' : 'wave', flip: x > 0 }));
  sNotes.forEach(({ sp, ph, x }) => { const u = (t * 0.35 + ph) % 1; sp.visible = set === 80; sp.position.set(79.4 + x * 1.2, 1.6 + u * 2.2, 0.3); sp.material.opacity = 1 - u; });
  // --- today: a bhajan circle
  pose(C.bk, camera, { visible: set === 120, x: 120, y: 0.86, z: -2.4, h: 1.4, mood: 'happy', flute: true });
  [['b1', -1.2, 0.6], ['b2', 1.2, 0.6], ['b3', -0.5, 1.5], ['b4', 0.6, 1.6]].forEach(([n, x, z], i) => pose(C[n], camera, { visible: set === 120, x: 120 + x, z, h: n === 'b4' ? 1.1 : 1.6, sitting: true, mood: 'closed', arm: s >= E.comment ? 'up' : i === 1 ? 'offer' : 'down', flip: x > 0 }));
  const clap = Math.abs(Math.sin(t * 6)) * 0.08; cym.forEach((c, i) => { c.visible = set === 120; c.position.set(121.55 + (i ? clap : -clap), 0.95, 0.65); c.rotation.z = Math.PI / 2; });
  bNotes.forEach(({ sp, ph, x }) => { const u = (t * 0.3 + ph) % 1; sp.visible = set === 120; sp.position.set(118.5 + x * 3, 1.2 + u * 2.6, 0.8); sp.material.opacity = 1 - u; });
  confetti(E.comment, s, V(120, 3, -1));
  S.clouds.forEach((c, i) => { c.position.x = -80 + i * 15 + ((t * 0.6 + i * 3) % 12); });
}

const G = (t) => t;
const SHOTS = [
  [0, E.as - 0.05, G, [[0.85, 1.55, 3.2], [0.75, 1.4, 0.5]], [[0.85, 1.55, 3.2], [0.75, 1.4, 0.5]], [62, 32], { move: 'dolly' }],
  [E.as - 0.05, E.little - 0.6, G, [[0, 4, 11], [0, 1.6, -2]], [[0.4, 1.8, 5.6], [0.4, 1.3, -0.5]], 50, { move: 'pull' }],
  [E.little - 0.6, E.danced - 0.05, G, [[0.6, 0.9, 2.6], [0.5, 0.7, 0.4]], [[0.6, 0.9, 2.3], [0.5, 0.7, 0.4]]],
  [E.danced - 0.05, E.royal - 0.05, G, [[2.4, 1.4, 4.6], [0.4, 1.3, -0.8]], [[-1.4, 1.4, 4.4], [0.4, 1.3, -0.8]]],
  [E.royal - 0.05, E.queen2 - 0.05, G, [[40, 2.0, 6.5], [40, 1.6, -1.6]], [[40, 1.7, 4.8], [40, 1.6, -1.6]], 50, { move: 'pull' }],
  [E.queen2 - 0.05, E.shameful + 0.3, G, [[80, 1.6, 5.4], [80, 1.3, 0]], [[80, 1.6, 4.4], [80, 1.3, 0]]],
  [E.shameful + 0.3, E.golden - 0.3, G, [[40.4, 1.9, 2.6], [40, 1.9, -2.0]], [[40.3, 1.9, 2.3], [40, 1.9, -2.0]]],
  [E.golden - 0.3, E.drink - 0.05, G, [[43.0, 1.4, 2.6], [41.6, 0.9, 0.3]], [[42.8, 1.3, 2.3], [41.6, 0.9, 0.3]]],
  [E.drink - 0.05, E.knew - 0.05, G, [[-1.0, 1.5, 5.2], [-1.0, 1.1, 0.4]], [[-0.4, 1.5, 4.6], [0, 1.1, 0.4]]],
  [E.knew - 0.05, E.offered - 0.05, G, [[0.8, 1.5, 2.6], [0.7, 1.35, 0.5]], [[0.8, 1.5, 2.3], [0.7, 1.35, 0.5]]],
  [E.offered - 0.05, E.drank2 - 0.05, G, [[1.3, 1.5, 3.6], [0.1, 1.3, -0.8]], [[1.0, 1.6, 3.9], [0.1, 1.3, -0.8]], 50, { move: 'crane', lift: 0.8 }],
  [E.drank2 - 0.05, E.wait - 0.05, G, [[0.85, 1.55, 2.6], [0.75, 1.4, 0.5]], [[0.85, 1.55, 2.4], [0.75, 1.4, 0.5]]],
  [E.wait - 0.05, E.nothing - 0.05, G, [[0.8, 1.4, 2.9], [0.72, 1.3, 0.5]], [[0.8, 1.4, 2.6], [0.72, 1.3, 0.5]]],
  [E.nothing - 0.05, E.kept - 0.05, G, [[0.8, 1.5, 2.8], [0.72, 1.35, 0.5]], [[0.8, 1.5, 2.8], [0.72, 1.35, 0.5]], [62, 36], { move: 'dolly' }],
  [E.kept - 0.05, E.thats - 0.05, G, [[0.4, 1.6, 5.4], [0.3, 1.3, -1]], [[0.4, 2.6, 7.4], [0.3, 1.3, -1]], 50, { move: 'pull' }],
  [E.thats - 0.05, E.when - 0.05, G, [[120, 3.4, 8.4], [120, 1.2, -0.5]], [[120, 2.2, 5.4], [120, 1.1, -0.5]], 50, { move: 'land' }],
  [E.when - 0.05, E.comment - 0.05, G, [[121.6, 1.2, 3.6], [120.6, 0.9, 0.4]], [[121.3, 1.2, 3.2], [120.6, 0.9, 0.4]]],
  [E.comment - 0.05, DURATION + 0.1, G, [[120, 2.3, 6.2], [120, 1.4, -1]], [[120, 2.3, 5.6], [120, 1.4, -1]]],
];
direct({ stage, WORDS, DURATION, shots: SHOTS, update, title: 1.6, q: [E.wait, E.nothing], cta: E.comment, prog: [E.wait, E.thats], pin: E.wait,
  key: ['queen', 'poison', 'singing', 'meera', 'princess', 'krishna', 'little', 'danced', 'temple', 'royal', 'furious', 'street', 'shameful', 'golden', 'nectar', 'knew', 'smiled', 'drop', 'wait', 'nothing', 'bhajans', 'heart', 'harm', 'comment'],
  loc: (t) => (t >= E.as - 0.05 && t < E.meera + 1.2 ? '📍 RAJASTHAN · 500 YEARS AGO' : t >= E.royal - 0.05 && t < E.queen2 - 0.05 ? '📍 THE ROYAL PALACE' : t >= E.thats - 0.05 && t < E.when ? 'EVEN TODAY' : ''), shakes: [E.poison2], tick: () => {} });
