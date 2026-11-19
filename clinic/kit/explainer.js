// Krishnaa Clinic explainer engine: gold-on-dark kinetic text (KB-9) with KB-10 easing. Deterministic, seek-driven.
// run(BEATS, WORDS, DURATION, KEY): BEATS = [{at: 'word' | ['word', n] | seconds, kind, text, sub}]
// kinds: title (hook, from 0) · big (huge number/word) · chip (gold label) · list ('a|b|c', revealed one by one)
//        icon (emoji card + label) · warn (red-flag card) · myth (MYTH crossed → FACT) · cta (follow + share)
const clamp = (k) => Math.max(0, Math.min(1, k));
const BO = (k) => { k = clamp(k); const c = 1.70158; return 1 + (c + 1) * Math.pow(k - 1, 3) + c * Math.pow(k - 1, 2); };
const QO = (k) => { k = clamp(k); return 1 - (1 - k) * (1 - k); };
const QI = (k) => { k = clamp(k); return k * k; };
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

export function run(BEATS, WORDS, DURATION, KEY = []) {
  const W = WORDS, keys = new Set(KEY.map((k) => k.toLowerCase()));
  const clean = (w) => w.replace(/[^A-Za-z0-9'%-]/g, '').toLowerCase();
  // resolve beat times: a word matches its first occurrence after the previous beat
  let prev = 0;
  const B = BEATS.map((b) => {
    let t = 0;
    if (typeof b.at === 'number') t = b.at;
    else if (b.at) { const [word, n] = Array.isArray(b.at) ? b.at : [b.at, 1]; let c = 0; const hit = W.find((w) => w[0] >= prev - 0.01 && clean(w[2]) === word.toLowerCase() && ++c === n); t = hit ? hit[0] : prev; }
    prev = t; return { ...b, t };
  });
  B.forEach((b, i) => { b.end = i + 1 < B.length ? B[i + 1].t : DURATION; });
  const stage = document.getElementById('beats');
  B.forEach((b, i) => {
    const el = document.createElement('div'); el.className = 'beat ' + b.kind; el.id = 'b' + i;
    if (b.kind === 'list') el.innerHTML = b.text.split('|').map((x, j) => `<div class="li" id="b${i}l${j}"><span class="n">${j + 1}</span>${esc(x)}</div>`).join('');
    else if (b.kind === 'icon') el.innerHTML = `<div class="ic">${b.text}</div><div class="lab">${esc(b.sub || '')}</div>`;
    else if (b.kind === 'myth') el.innerHTML = `<div class="mm"><span class="tag">MYTH</span>${esc(b.text)}<i class="x"></i></div><div class="ff"><span class="tag">FACT</span>${esc(b.sub || '')}</div>`;
    else if (b.kind === 'warn') el.innerHTML = `<div class="wt">⚠ SEE A DOCTOR TODAY IF</div><div class="wb">${esc(b.text)}</div>`;
    else if (b.kind === 'cta') el.innerHTML = `<div class="c1">${esc(b.text || 'Follow for one health fact every day')}</div><div class="c2">${esc(b.sub || 'Share this with someone who needs it ↗')}</div>`;
    else el.innerHTML = `<div class="tx">${esc(b.text)}</div>` + (b.sub ? `<div class="sb">${esc(b.sub)}</div>` : '');
    stage.appendChild(el); b.el = el;
  });
  const cap = document.getElementById('cap'), bg = document.getElementById('bg'), disc = document.getElementById('disc');
  const CH = []; for (let i = 0; i < W.length;) { const c = [i++]; while (i < W.length && c.length < 3 && !/[.,?!]$/.test(W[i - 1][2])) c.push(i++); CH.push(c); }
  let lastCap = '';
  function renderAt(t) {
    // long clips: a slow linear drift of the glow so nothing sits still (KB-10)
    bg.style.backgroundPosition = `${50 + 8 * Math.sin(t * 0.21)}% ${30 + t * 0.6}%`;
    B.forEach((b) => {
      const on = t >= b.t && t < b.end, k = t - b.t, out = QI((t - (b.end - 0.22)) / 0.22);
      const el = b.el;
      if (!on) { el.style.opacity = 0; return; }
      if (b.kind === 'title') { el.style.opacity = 1 - out; el.style.transform = `scale(${(0.8 + 0.2 * BO(k / 0.45)) * (1 - 0.12 * out)})`; return; }
      if (b.kind === 'cta') { el.style.opacity = QO(k / 0.2); el.style.transform = `scale(${0.4 + 0.6 * BO(k / 0.55)})`; return; }
      if (b.kind === 'list') { el.style.opacity = 1 - out; const n = b.text.split('|').length, gap = Math.min(0.9, (b.end - b.t - 0.4) / n); for (let j = 0; j < n; j++) { const li = document.getElementById(`b${b.el.id.slice(1)}l${j}`), kk = QO((k - j * gap) / 0.3); li.style.opacity = kk; li.style.transform = `translateX(${(1 - kk) * -80}px)`; } return; }
      if (b.kind === 'myth') { el.style.opacity = (QO(k / 0.25)) * (1 - out); const x = el.querySelector('.x'), ff = el.querySelector('.ff'), r = clamp((k - 0.9) / 0.3); x.style.width = (r * 100) + '%'; const f = QO((k - 1.3) / 0.35); ff.style.opacity = f; ff.style.transform = `scale(${0.6 + 0.4 * BO((k - 1.3) / 0.5)})`; return; }
      // big / chip / icon / warn pop in with quad-out (big and warn get the rebound), leave with quad-in
      const ein = b.kind === 'big' || b.kind === 'warn' ? BO(k / 0.45) : QO(k / 0.3);
      el.style.opacity = QO(k / 0.2) * (1 - out);
      el.style.transform = `scale(${(0.5 + 0.5 * ein) * (1 - 0.2 * out)}) translateY(${-30 * out}px)`;
    });
    let ci = -1; for (let i = 0; i < CH.length; i++) if (t >= W[CH[i][0]][0] - 0.05) ci = i;
    let html = '';
    if (ci >= 0) { const ch = CH[ci], nx = CH[ci + 1]; if (t < (nx ? W[nx[0]][0] : W[ch[ch.length - 1]][1] + 0.6)) html = ch.map((i) => `<span class="${t >= W[i][0] - 0.03 && keys.has(clean(W[i][2])) ? 'y' : ''}">${esc(W[i][2])}</span>`).join(' '); }
    if (html !== lastCap) { cap.innerHTML = html; lastCap = html; }
    if (ci >= 0) cap.style.transform = `scale(${1 + 0.14 * Math.exp(-Math.max(0, t - W[CH[ci][0]][0]) * 13)})`;
    disc.style.opacity = t > DURATION - 4 ? QO((t - DURATION + 4) / 0.4) : 0;
  }
  window.addEventListener('hf-seek', (e) => renderAt(e.detail.time));
  renderAt(0);
  if (window.__sceneReady) window.__sceneReady();
}
