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
  // camera moves (Strategy 9): shot = [t0, t1, story, [pos, look], [pos, look], fov | [fov0, fov1], opts]
  //   opts.move: 'dolly'  dolly zoom: keeps the subject's size while the fov changes, so the world swells or shrinks behind it
  //              'crane'  rises on an arc (opts.lift extra height at mid-shot)
  //              'land'   overshoots a little and settles (ease-out-back)
  //              'pull'   fast start, gentle stop (ease-out-expo) for reveals
  //   opts.drift: handheld micro-drift amplitude (default 0.012; 0 to lock off)
  const ease = { inout: sm, out: (k) => 1 - Math.pow(1 - k, 3), pull: (k) => (k >= 1 ? 1 : 1 - Math.pow(2, -9 * k)), land: (k) => { const c = 1.4; return 1 + (c + 1) * Math.pow(k - 1, 3) + c * Math.pow(k - 1, 2); } };
  function camAt(t) {
    const sh = cfg.shots.find((x) => t >= x[0] && t < x[1]) || cfg.shots[cfg.shots.length - 1];
    const o = sh[6] || {}, u = seg(t, sh[0], sh[1]);
    const k = (ease[o.move === 'land' ? 'land' : o.move === 'pull' ? 'pull' : o.ease || 'inout'] || sm)(u);
    const f = Array.isArray(sh[5]) ? sh[5] : [sh[5] || 50, sh[5] || 50], fov = f[0] + (f[1] - f[0]) * sm(u);
    const look = V(...sh[3][1]).lerp(V(...sh[4][1]), k);
    if (o.move === 'dolly') { const p0 = V(...sh[3][0]), dir = p0.clone().sub(V(...sh[3][1])), d0 = dir.length(); const d = d0 * Math.tan((f[0] * Math.PI) / 360) / Math.tan((fov * Math.PI) / 360); camera.position.copy(look).add(dir.normalize().multiplyScalar(d)); }
    else { camera.position.copy(V(...sh[3][0]).lerp(V(...sh[4][0]), k)); if (o.move === 'crane') camera.position.y += (o.lift ?? 1.2) * Math.sin(Math.PI * Math.min(1, k)) * 0.35; }
    const dr = o.drift ?? cfg.drift ?? 0.012; if (dr) { camera.position.x += Math.sin(t * 1.3) * dr + Math.sin(t * 2.9) * dr * 0.4; camera.position.y += Math.cos(t * 1.7) * dr * 0.8; }
    camera.lookAt(look); camera.fov = fov; camera.updateProjectionMatrix(); camera.updateMatrixWorld();
    return sh[2](t);
  }
  const KEY = new Set(cfg.key.map((w) => w.toLowerCase()));
  const W = cfg.WORDS, CH = [];
  { let cur = []; W.forEach((w, i) => { cur.push(i); if (/[.,?!:]$/.test(w[2]) || cur.length === 3) { CH.push(cur); cur = []; } }); if (cur.length) CH.push(cur); }
  const capEl = document.getElementById('cap'), titleEl = document.getElementById('title'), qEl = document.getElementById('q'), ctaEl = document.getElementById('cta'), locEl = document.getElementById('loc');
  let lastCap = '';
  const progBox = document.getElementById('prog'), progEls = cfg.prog && progBox ? [...progBox.querySelectorAll('.bar i')] : null, pinEl = cfg.pin != null ? document.getElementById('pin') : null;
  const RED = new Set((cfg.red || []).map((w) => w.toLowerCase()));
  if (cfg.one) { const st = document.createElement('style'); st.textContent = '#cap{font-size:118px!important;color:#f4ff3a!important;letter-spacing:1px}#cap .y{color:#f4ff3a!important}#cap .r{color:#ff3b3b!important}'; document.head.appendChild(st); }
  function captions(t) {
    if (cfg.one) { // monster-video style: one big word at a time, red on the emphasis words
      let wi = -1; for (let i = 0; i < W.length; i++) if (t >= W[i][0] - 0.04) wi = i;
      const w = wi >= 0 && t < Math.max(W[wi][1] + 0.35, (W[wi + 1] || [Infinity])[0]) ? W[wi] : null;
      const clean = w ? w[2].replace(/[^A-Za-z0-9'%-]/g, '').toLowerCase() : '';
      const html = w ? `<span class="${RED.has(clean) ? 'r' : ''}">${w[2].replace(/[.,:;!?]+$/, '')}</span>` : '';
      if (html !== lastCap) { capEl.innerHTML = html; lastCap = html; }
      if (w) capEl.style.transform = `scale(${0.7 + 0.3 * (1 - Math.pow(1 - clamp((t - w[0]) / 0.12), 3)) + 0.08 * Math.exp(-Math.max(0, t - w[0]) * 10)})`;
      overlays(t); return;
    }
    let ci = -1; for (let i = 0; i < CH.length; i++) if (t >= W[CH[i][0]][0] - 0.05) ci = i;
    let html = '';
    if (ci >= 0) { const ch = CH[ci], next = CH[ci + 1], lastEnd = W[ch[ch.length - 1]][1]; if (t < (next ? W[next[0]][0] : lastEnd + 0.6)) html = ch.map((i) => { const w = W[i], clean = w[2].replace(/[^A-Za-z'-]/g, '').toLowerCase(); const on = t >= w[0] - 0.03 && KEY.has(clean); return `<span class="${on ? 'y' : ''}">${w[2].replace(/[.,:]$/, '')}</span>`; }).join(' '); }
    if (html !== lastCap) { capEl.innerHTML = html; lastCap = html; }
    if (ci >= 0) capEl.style.transform = `scale(${1 + 0.16 * Math.exp(-Math.max(0, t - W[CH[ci][0]][0]) * 13)})`;
    overlays(t);
  }
  function overlays(t) {
    // KB-10 easing per moment: hooks/CTAs rebound in (back-out), pop-ups quad-out, text leaves quad-in
    const BO = (k) => { k = clamp(k); const c = 1.70158; return 1 + (c + 1) * Math.pow(k - 1, 3) + c * Math.pow(k - 1, 2); };
    const QO = (k) => { k = clamp(k); return 1 - (1 - k) * (1 - k); }, QI = (k) => { k = clamp(k); return k * k; };
    const tOut = QI((t - (cfg.title - 0.25)) / 0.25);
    titleEl.style.opacity = t < cfg.title ? 1 - tOut : 0;
    titleEl.style.transform = `scale(${(0.82 + 0.18 * BO(t / 0.45)) * (1 - 0.15 * tOut)})`;
    const qa = cfg.q[0], qb = cfg.q[1], qIn = QO((t - qa) / 0.3), qOut = QI((t - (qb - 0.2)) / 0.2);
    qEl.style.opacity = t >= qa && t < qb ? qIn * (1 - qOut) : 0;
    qEl.style.transform = `translateY(${Math.sin(t * 4) * 8}px) rotate(${Math.sin(t * 3) * 6}deg) scale(${0.5 + 0.5 * qIn})`;
    ctaEl.style.opacity = t >= cfg.cta ? QO((t - cfg.cta) / 0.2) : 0;
    ctaEl.style.transform = `scale(${t >= cfg.cta ? 0.4 + 0.6 * BO((t - cfg.cta) / 0.5) : 0.4})`;
    const lt = cfg.loc ? cfg.loc(t) : '';
    if (locEl.textContent !== lt) locEl.textContent = lt;
    if (lt) { let s0 = t; for (let i = 1; i <= 8 && cfg.loc(t - i * 0.05) === lt; i++) s0 = t - i * 0.05; const out = cfg.loc(t + 0.25) !== lt ? QI(1 - (() => { let e = 0; for (let i = 1; i <= 5 && cfg.loc(t + i * 0.05) === lt; i++) e = i * 0.05; return e / 0.25; })()) : 0; const k = QO((t - s0) / 0.35); locEl.style.opacity = k * (1 - out); locEl.style.transform = `translateX(${(1 - k) * -60}px)`; } else locEl.style.opacity = 0;
    if (progEls) { const [a, b] = cfg.prog, ends = [0, a, b, cfg.cta]; progEls.forEach((el, i) => { el.style.width = (clamp((t - ends[i]) / (ends[i + 1] - ends[i])) * 100).toFixed(1) + '%'; }); progBox.style.opacity = t < cfg.title ? 0 : 1; }
    const followEl = document.getElementById('follow'); if (followEl) { const on = t >= cfg.cta + 0.3; followEl.style.opacity = on ? QO((t - cfg.cta - 0.3) / 0.2) : 0; followEl.style.transform = `translateY(${on ? 60 * (1 - BO((t - cfg.cta - 0.3) / 0.5)) : 60}px)`; }
    if (pinEl) { const on = t >= cfg.pin && t < cfg.cta; pinEl.style.opacity = on ? QO((t - cfg.pin) / 0.25) * (1 - QI((t - (cfg.cta - 0.2)) / 0.2)) : 0; pinEl.style.transform = `scale(${on ? 0.6 + 0.4 * BO((t - cfg.pin) / 0.5) : 0.6})`; }
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
