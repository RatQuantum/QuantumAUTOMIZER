// "Real science of a superpower" engine (KB-13): gold-on-dark vector art, a rising comparison ladder, rolling
// counters, top captions with one bold key word, and KB-10 easing. Deterministic and seek-driven (hf-seek).
// run(SPEC, WORDS, DURATION). SPEC.beats = [{at, kind, ...}] (at = word | [word, n] | seconds; resolved in order)
//  portrait {char, label, from, to, unit}   · tag {text, sub, art}   · counter {text, sub}
//  ladder {items: [{at, art, label, h}]}  (items appear one by one on a ground line; the view zooms out to fit)
//  eq {parts: ['MASS', '÷', 'AREA', '=', 'PRESSURE'], hi: 4}   · space {art}   · end {handle, sub}
import { drawChar, CAST } from './cast.js';
const clamp = (k) => Math.max(0, Math.min(1, k));
const BO = (k) => { k = clamp(k); const c = 1.70158; return 1 + (c + 1) * Math.pow(k - 1, 3) + c * Math.pow(k - 1, 2); };
const QO = (k) => { k = clamp(k); return 1 - (1 - k) * (1 - k); };
const QI = (k) => { k = clamp(k); return k * k; };
const G = '#f5b82e', G2 = '#ffd76a', D1 = '#1a1a24', D2 = '#2a2a38', ST = 'stroke="#0a0a10" stroke-width="5" stroke-linejoin="round"';
// ---- flat art (viewBox 0 0 200 200, sits on y=200)
export const ART = {
  person: `<circle cx="100" cy="40" r="22" fill="#e0a57c" ${ST}/><rect x="74" y="66" width="52" height="80" rx="24" fill="${D2}" ${ST}/><path d="M86 146v52M114 146v52" stroke="#0a0a10" stroke-width="9"/>`,
  elephant: `<path d="M30 80q0-50 70-50t72 52v60h-18v56h-24v-40h-56v40h-24z" fill="#8a8a9a" ${ST}/><path d="M38 90q-28 20-18 80" fill="none" stroke="#8a8a9a" stroke-width="18" stroke-linecap="round"/><circle cx="62" cy="74" r="6" fill="#0a0a10"/>`,
  jet: `<path d="M10 120q90-30 180-6l-6 16q-80 10-170 6z" fill="#d8dce8" ${ST}/><path d="M80 118l40-60h18l-14 62zM70 136l30 40h16l-6-44z" fill="#b8bcc8" ${ST}/><path d="M172 112l18-40h8l-4 44z" fill="#b8bcc8" ${ST}/>`,
  pyramid: `<path d="M10 198L100 30l90 168z" fill="#d9b06a" ${ST}/><path d="M100 30l90 168h-60z" fill="#b88a48"/>`,
  mountain: `<path d="M4 198L58 70l30 40 34-78 74 166z" fill="#5f8a4a" ${ST}/><path d="M88 110l34-78 22 50-20-12-14 20z" fill="#86b468"/><circle cx="46" cy="160" r="10" fill="#3f6a2a"/><circle cx="150" cy="150" r="12" fill="#3f6a2a"/>`,
  finger: `<path d="M70 200v-70q0-14 12-14t12 14v-74q0-14 13-14t13 14v84q10-6 20 2l10 10q10-6 18 4v44z" fill="#4f86d9" ${ST}/>`,
  diamond: `<path d="M50 70h100l30 34-80 92-80-92z" fill="#bfe8ff" ${ST}/><path d="M50 70l20 34h60l20-34M20 104h160M70 104l30 92 30-92" fill="none" stroke="#7ab8e0" stroke-width="4"/>`,
  cow: `<rect x="34" y="70" width="124" height="70" rx="26" fill="#f4f1ea" ${ST}/><circle cx="60" cy="96" r="12" fill="#3a3a44"/><circle cx="120" cy="110" r="14" fill="#3a3a44"/><path d="M50 140v58M76 140v58M124 140v58M150 140v58" stroke="#0a0a10" stroke-width="9"/><circle cx="170" cy="84" r="22" fill="#f4f1ea" ${ST}/>`,
  cloud: `<path d="M40 120a30 30 0 0 1 20-56 40 40 0 0 1 76-6 30 30 0 0 1 24 62z" fill="#5a6278" ${ST}/><path d="M60 140l-8 20M100 140l-8 24M140 140l-8 20" stroke="#7ab8ff" stroke-width="6" stroke-linecap="round"/>`,
  heart: `<path d="M100 186C40 140 10 110 10 70a45 45 0 0 1 90-12 45 45 0 0 1 90 12c0 40-30 70-90 116z" fill="#e03a4a" ${ST}/><path d="M60 40a30 30 0 0 0-30 30" fill="none" stroke="#ff8a96" stroke-width="8" stroke-linecap="round"/>`,
  cup: `<path d="M60 90h80l-10 106H70z" fill="#bfe0ff" opacity=".9" ${ST}/><path d="M66 130h68l-6 64H72z" fill="#e03a4a"/>`,
  jar: `<path d="M56 50h88v20q16 10 16 30v96H40v-96q0-20 16-30z" fill="#bfe0ff" opacity=".9" ${ST}/><path d="M42 110h116v86H42z" fill="#e03a4a"/><text x="100" y="166" font-size="34" font-weight="900" text-anchor="middle" fill="#fff" font-family="Nunito">5 L</text>`,
  truck: `<rect x="10" y="70" width="128" height="90" rx="40" fill="#c8ccd8" ${ST}/><path d="M138 100h34l20 30v34h-54z" fill="${G}" ${ST}/><circle cx="46" cy="176" r="18" fill="#2a2a34" ${ST}/><circle cx="160" cy="176" r="18" fill="#2a2a34" ${ST}/>`,
  pool: `<rect x="4" y="120" width="192" height="76" rx="8" fill="#3f9ad8" ${ST}/><path d="M4 140h192M4 160h192M4 180h192" stroke="#bfe8ff" stroke-width="3" stroke-dasharray="10 8"/><path d="M20 120v-30h10M170 120v-30h10" stroke="#d8dce8" stroke-width="6" fill="none"/>`,
  ship: `<path d="M4 140h192l-24 56H28z" fill="#a83a3a" ${ST}/><rect x="130" y="80" width="40" height="60" fill="#f4f1ea" ${ST}/><path d="M20 140v-20h104v20" fill="#5a6278" ${ST}/>`,
  everest: `<path d="M2 198L70 60l24 30 30-70 74 178z" fill="#6a7488" ${ST}/><path d="M124 20l20 46-16-6-12 14-12-10z" fill="#fff"/><path d="M70 60l12 16-10 4z" fill="#fff"/>`,
  baby: `<circle cx="100" cy="100" r="80" fill="#3a2030" stroke="${G}" stroke-width="5"/><path d="M80 70q30-20 50 10t-10 60q-30 20-48-10" fill="#f0b0a0" ${ST}/><circle cx="108" cy="100" r="10" fill="#e03a4a"/>`,
};
const svg = (k, cls = '') => `<svg class="${cls}" viewBox="0 0 200 200" width="100%" height="100%">${ART[k] || ''}</svg>`;

export function resolve(SPEC, WORDS, DURATION) {
  const W = WORDS, norm = (w) => w.toLowerCase().replace(/[^a-z0-9'%,-]/g, '').replace(/,$/, '');
  let prev = 0; const at = (a) => { if (typeof a === 'number') return a; const [w, n] = Array.isArray(a) ? a : [a, 1]; let c = 0; const h = W.find((x) => x[0] >= prev - 0.01 && norm(x[2]).startsWith(w.toLowerCase()) && ++c === n); return h ? h[0] : prev; };
  const B = SPEC.beats.map((b) => { const t = (prev = at(b.at ?? 0)); const o = { ...b, t }; if (b.items) o.items = b.items.map((it) => ({ ...it, t: (prev = at(it.at ?? prev)) })); prev = Math.max(prev, t); return o; });
  B.forEach((b, i) => (b.end = i + 1 < B.length ? B[i + 1].t : DURATION));
  return B;
}

export function run(SPEC, WORDS, DURATION) {
  const W = WORDS, norm = (w) => w.toLowerCase().replace(/[^a-z0-9'%,-]/g, '').replace(/,$/, '');
  const B = resolve(SPEC, WORDS, DURATION);
  const stage = document.getElementById('stage2'), cap = document.getElementById('cap');
  const KEY = new Set((SPEC.key || []).map((k) => k.toLowerCase()));
  B.forEach((b, i) => {
    const el = document.createElement('div'); el.className = 'beat ' + b.kind; el.style.opacity = 0;
    if (b.kind === 'portrait') { const cv = document.createElement('canvas'); cv.width = 512; cv.height = 1024; const g = cv.getContext('2d'); g.setTransform(2, 0, 0, 2, 0, 0); drawChar(g, Object.assign({}, CAST[b.char], b.over || {}), { mood: b.mood || 'happy', arm: b.arm || 'down', flute: !!b.flute }); el.innerHTML = `<div class="glow"></div>`; el.appendChild(cv); if (b.label) el.insertAdjacentHTML('beforeend', `<div class="ctr"><span class="cl">${b.label}</span><span class="cn" id="n${i}"></span></div>`); }
    else if (b.kind === 'tag') el.innerHTML = (b.art ? `<div class="art">${svg(b.art)}</div>` : '') + `<div class="tt">${b.text}</div>` + (b.sub ? `<div class="ts">${b.sub}</div>` : '');
    else if (b.kind === 'counter') el.innerHTML = `<div class="big" style="font-size:${Math.min(200, Math.round(1500 / Math.max(4, b.text.length)))}px">${b.text}</div><div class="ts">${b.sub || ''}</div>`;
    else if (b.kind === 'eq') el.innerHTML = b.parts.map((p, j) => /^[×÷=+]$/.test(p) ? `<span class="op">${p}</span>` : `<span class="chip${j === b.hi ? ' hi' : ''}">${p}</span>`).join('');
    else if (b.kind === 'space') el.innerHTML = `<div class="grid"></div><div class="art sp">${svg(b.art)}</div>` + (b.sub ? `<div class="ts low">${b.sub}</div>` : '');
    else if (b.kind === 'ladder') el.innerHTML = `<div class="row" id="row${i}">` + b.items.map((it, j) => `<div class="it" id="it${i}_${j}" style="height:${it.h}px;width:${it.h}px">${svg(it.art)}<div class="il">${it.label.replace(" · ", "<br>")}</div></div>`).join('') + `</div><div class="ground"></div>`;
    else if (b.kind === 'end') el.innerHTML = `<div class="hd">${b.handle}</div><div class="fo">FOLLOW</div>` + (b.sub ? `<div class="ts">${b.sub}</div>` : '');
    stage.appendChild(el); b.el = el;
  });
  const P = []; for (let i = 0; i < 46; i++) { const d = document.createElement('i'); d.className = 'pt'; stage.parentElement.insertBefore(d, stage); P.push([d, (i * 7919 % 1000) / 1000, (i * 104729 % 1000) / 1000, 0.4 + (i % 5) * 0.25]); }
  const FL = document.createElement('div'); FL.id = 'flash'; stage.parentElement.appendChild(FL);
  const fmt = (v) => Math.round(v).toLocaleString('en-US');
  let lastCap = '';
  function renderAt(t) {
    document.getElementById('bg').style.transform = `scale(${1.08 + 0.05 * Math.sin(t * 0.6)}) translate(${Math.sin(t * 0.4) * 30}px, ${(-t * 26) % 60}px)`;
    P.forEach(([d, x, y, sp]) => { const yy = ((y - t * 0.03 * sp) % 1 + 1) % 1; d.style.transform = `translate(${x * 1080 + Math.sin(t * sp + x * 9) * 40}px, ${yy * 1920}px)`; d.style.opacity = 0.25 + 0.5 * Math.abs(Math.sin(t * sp * 2 + y * 7)); });
    let fl = 0; B.forEach((b) => { const k = t - b.t; if (k >= 0 && k < 0.12 && b.t > 0.1) fl = 0.35 * (1 - k / 0.12); }); FL.style.opacity = fl;
    B.forEach((b, i) => {
      const on = t >= b.t && t < b.end, k = t - b.t, out = QI((t - (b.end - 0.2)) / 0.2), el = b.el;
      if (!on) { el.style.opacity = 0; return; }
      el.style.opacity = QO(k / 0.22) * (1 - out);
      if (b.kind === 'portrait') { el.style.transform = `scale(${(0.9 + 0.1 * BO(k / 0.5)) * (1 + 0.04 * k)}) translateY(${Math.sin(t * 2.4) * 14}px)`; const n = document.getElementById('n' + i); if (n) n.textContent = fmt(b.from + (b.to - b.from) * (1 - Math.pow(1 - clamp(k / Math.max(0.6, b.end - b.t - 0.4)), 3))) + ' ' + (b.unit || ''); return; }
      if (b.kind === 'ladder') { let shown = 0; b.items.forEach((it, j) => { const e = document.getElementById(`it${i}_${j}`), kk = t - it.t; const vis = kk >= 0; if (vis) shown = j + 1; e.style.opacity = vis ? QO(kk / 0.25) : 0; e.style.transform = `translateY(${vis ? 80 * (1 - BO(kk / 0.45)) + Math.sin(t * 3 + j) * 10 : 80}px)`; e.style.display = vis || j === 0 ? 'block' : 'none'; });
        // zoom out so every visible item fits 900 px (the "camera pulls back" beat of the reference)
        const tot = b.items.slice(0, Math.max(1, shown)).reduce((s, it) => s + it.h + 70, 0), target = Math.min(2.4, 900 / tot), row = document.getElementById('row' + i);
        row.dataset.z = row.dataset.z ? +row.dataset.z + (target - +row.dataset.z) * 0.18 : target; row.style.transform = `scale(${target})`; return; }
      if (b.kind === 'space') { el.querySelector('.sp').style.transform = `scale(${0.6 + 0.4 * BO(k / 0.6) + 0.03 * k}) rotate(${k * 4}deg)`; el.querySelector('.grid').style.transform = `perspective(900px) rotateX(58deg) scale(${1.4 + 0.05 * k})`; return; }
      if (b.kind === 'eq') { [...el.children].forEach((c, j) => { const kk = QO((k - j * 0.18) / 0.3); c.style.opacity = kk; c.style.transform = `scale(${0.5 + 0.5 * BO((k - j * 0.18) / 0.45)})`; }); return; }
      el.style.transform = `scale(${(0.55 + 0.45 * BO(k / 0.5)) * (1 + 0.045 * k)}) rotate(${Math.sin(t * 1.3) * 1.5}deg) translateY(${Math.sin(t * 2.2) * 12}px)`;
    });
    // top captions: 2-4 word chunks, one bold key word (reference style)
    let ci = -1; for (let i = 0; i < CH.length; i++) if (t >= W[CH[i][0]][0] - 0.05) ci = i;
    let html = ''; if (ci >= 0) { const ch = CH[ci], nx = CH[ci + 1]; if (t < (nx ? W[nx[0]][0] : W[ch[ch.length - 1]][1] + 0.5)) html = ch.map((j) => { const w = W[j][2]; return KEY.has(norm(w).replace(/[.?!]/g, '')) ? `<b>${w}</b>` : w; }).join(' '); }
    if (html !== lastCap) { cap.innerHTML = html; lastCap = html; }
  }
  const CH = []; for (let i = 0; i < W.length;) { const c = [i++]; while (i < W.length && c.length < 3 && !/[.,?!]$/.test(W[i - 1][2])) c.push(i++); CH.push(c); }
  window.addEventListener('hf-seek', (e) => renderAt(e.detail.time));
  renderAt(0);
  if (window.__sceneReady) window.__sceneReady();
}
