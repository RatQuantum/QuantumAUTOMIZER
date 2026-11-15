// The episode director ("Why we do what we do"): renderer, shots on a story clock, karaoke captions, title card,
// question mark, call to action, location labels, impact shakes. An episode's main.js builds its world and cast, then
// calls direct({...}). Everything is drawn from time alone on hf-seek (deterministic).
import * as THREE from './three.module.js';
import { sm, seg, clamp } from './kit.js';
import { shake } from './plus.js';

export function makeStage() {
  const canvas = document.getElementById('gl');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1); renderer.setSize(1080, 1920, false);
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.08; renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1080 / 1920, 0.1, 500);
  return { renderer, scene, camera };
}
// a word's start time (n-th occurrence, matched on its start)
export const wordTime = (WORDS) => (word, n = 1) => { let k = 0; for (const w of WORDS) if (w[2].toLowerCase().replace(/[^a-z'-]/g, '').startsWith(word) && ++k === n) return w[0]; throw new Error('no word ' + word + ' #' + n); };

// cfg: { stage, WORDS, DURATION, shots: [[t0, t1, (t) => story, [pos, look], [pos, look], fov?]], update(story, t),
//        key: [...words], title: tEnd, q: [t0, t1], cta: t, loc: (t) => label, shakes: [t...], tick(t), mood(t) }
export function direct(cfg) {
  const { renderer, scene, camera } = cfg.stage, V = (x, y, z) => new THREE.Vector3(x, y, z);
  function camAt(t) {
    const sh = cfg.shots.find((x) => t >= x[0] && t < x[1]) || cfg.shots[cfg.shots.length - 1];
    const k = sm(seg(t, sh[0], sh[1]));
    camera.position.copy(V(...sh[3][0]).lerp(V(...sh[4][0]), k)); camera.lookAt(V(...sh[3][1]).lerp(V(...sh[4][1]), k));
    camera.fov = sh[5] || 50; camera.updateProjectionMatrix(); camera.updateMatrixWorld();
    return sh[2](t);
  }
  const KEY = new Set(cfg.key.map((w) => w.toLowerCase()));
  const W = cfg.WORDS, CH = [];
  { let cur = []; W.forEach((w, i) => { cur.push(i); if (/[.,?!:]$/.test(w[2]) || cur.length === 3) { CH.push(cur); cur = []; } }); if (cur.length) CH.push(cur); }
  const capEl = document.getElementById('cap'), titleEl = document.getElementById('title'), qEl = document.getElementById('q'), ctaEl = document.getElementById('cta'), locEl = document.getElementById('loc');
  let lastCap = '';
  function captions(t) {
    let ci = -1; for (let i = 0; i < CH.length; i++) if (t >= W[CH[i][0]][0] - 0.05) ci = i;
    let html = '';
    if (ci >= 0) { const ch = CH[ci], next = CH[ci + 1], lastEnd = W[ch[ch.length - 1]][1]; if (t < (next ? W[next[0]][0] : lastEnd + 0.6)) html = ch.map((i) => { const w = W[i], clean = w[2].replace(/[^A-Za-z'-]/g, '').toLowerCase(); const on = t >= w[0] - 0.03 && KEY.has(clean); return `<span class="${on ? 'y' : ''}">${w[2].replace(/[.,:]$/, '')}</span>`; }).join(' '); }
    if (html !== lastCap) { capEl.innerHTML = html; lastCap = html; }
    if (ci >= 0) capEl.style.transform = `scale(${1 + 0.16 * Math.exp(-Math.max(0, t - W[CH[ci][0]][0]) * 13)})`;
    titleEl.style.opacity = t < cfg.title ? 1 : 0;
    qEl.style.opacity = t >= cfg.q[0] && t < cfg.q[1] ? 1 : 0;
    qEl.style.transform = `translateY(${Math.sin(t * 4) * 8}px) rotate(${Math.sin(t * 3) * 6}deg)`;
    ctaEl.style.opacity = t >= cfg.cta ? 1 : 0;
    ctaEl.style.transform = `scale(${t >= cfg.cta ? 1 + 0.08 * Math.exp(-(t - cfg.cta) * 6) : 0.9})`;
    const lt = cfg.loc ? cfg.loc(t) : '';
    if (locEl.textContent !== lt) locEl.textContent = lt; locEl.style.opacity = lt ? 1 : 0;
  }
  function renderAt(t) {
    window.__T = t;
    const story = camAt(t);
    (cfg.shakes || []).forEach((t0) => shake(camera, t, t0));
    if (cfg.mood) cfg.mood(t, story);
    cfg.update(story, t);
    if (cfg.tick) cfg.tick(t);
    renderer.render(scene, camera);
    captions(t);
  }
  window.addEventListener('hf-seek', (e) => renderAt(e.detail.time));
  renderAt(0);
  if (window.__sceneReady) window.__sceneReady();
}
