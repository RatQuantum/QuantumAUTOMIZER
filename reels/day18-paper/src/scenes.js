// =====================================================================
//  SCENES — one per era, world coords 1080x1920; content inside x 60–940, y 250–1500.
// =====================================================================
const cu = TIMELINE.cues;
function sky(bands, key) {   // full-bleed horizontal paper bands, top to bottom: [[y0, colour], ...]
  bands.forEach(([y0, c], i) => { const y1 = i + 1 < bands.length ? bands[i + 1][0] + 30 : H + 40; cut(rect(-40, y0 - 10, W + 80, y1 - y0 + 10, 0), c, { key: key + i, shadow: i > 0, sy: -4, sb: 10, tear: i ? 1.6 : 0, shade: false }); });
}
function birds(x, y, n, key) { for (let i = 0; i < n; i++) { const xx = x + i * 46 + mod(TT * 40, 600) - 100, yy = y + Math.sin(i * 1.7) * 22, f = (B + i) % 6 < 3 ? 10 : 2; ink([[xx - 16, yy], [xx - 6, yy - f], [xx, yy], [xx + 6, yy - f], [xx + 16, yy]], { w: 3.5, color: '#3a2030', amt: 0.3, key: key + i }); } }
function capNow(str, size = 54) { const f = () => tag(str, CX, H - SAFE.bottom - 60, size, { rot: 0.012, tape: false }); if (DEFER) DEFER.push(f); else f(); }   // a caption drawn finished (short shots)
function topTag(str, t0, size = 64) { const f = () => tag(str, 70 + (handW(str, size) + size) / 2, SAFE.top + 90, size, { rot: -0.04, s: popS(t0) }); if (DEFER) DEFER.push(f); else f(); }

// 1 · HOOK: dusk, a river, one small hut, a long line of monks coming
function sceneHook() {
  sky([[0, '#4a2456'], [420, '#8e3355'], [700, '#e2643c'], [930, '#f2a84a']], 'hk');
  cut(ellipsePts(300, 1010, 120, 120, 0, 30), '#ffd27a', { key: 'sun', shadow: false, crayon: '#f6b23a' });
  cut([[-40, 1010], [200, 930], [420, 980], [640, 900], [880, 960], [1120, 920], [1120, 1100], [-40, 1100]], '#5a2f4a', { key: 'hills', sb: 8 });
  cut(rect(-40, 1060, W + 80, 140, 0), '#3f6f7a', { key: 'river', pat: pat.stripes('rgba(255,200,140,0.25)', 3, 26, Math.PI / 2), sy: -4 });
  cut([[-40, 1180], [1120, 1150], [1120, 2000], [-40, 2000]], '#6b4a2a', { key: 'bank', pat: pat.stripes('rgba(255,220,160,0.10)', 4, 30, 0.2), sy: -6 });
  tree(140, 1190, 0.9, '#2f5a3a', 'tA'); tree(980, 1170, 1.0, '#2f5a3a', 'tB');
  hut(760, 1200, 0.62, { key: 'hutA', light: true });
  cut(capsulePts(760, 1150, 760, 1185, 16, 6), SAREE, { key: 'drsmall', sb: 3 }); dot(760, 1138, 8, PAL.skin2);   // a tiny woman at the door
  for (let k = 0; k < 13; k++) { const d = k / 13, x = -40 + d * 640 + TT * 22, y = 1250 - d * 50 + (k % 2) * 40; tinySage(x, y + (1 - d) * 160, 0.9 + (1 - d) * 0.9, k); }
  birds(380, 560, 4, 'bh');
  for (let i = 0; i < 6; i++) firefly(140 + i * 150, 1420 + Math.sin(i * 2 + TT) * 30, i);
  topTag('The forest exile', 0.15);
  capStrip("One day... nothing left to give");
}
// 2 · THE EMPTY POT: inside the hut, the crowd fills the window
function sceneEmptyPot() {
  cut(rect(-30, -30, W + 60, H + 60, 0), '#c48a55', { key: 'wall2', shadow: false, tear: 0, shade: false, pat: pat.dots('rgba(255,245,220,0.35)', 5, 64) });
  cut(rect(560, 360, 360, 330, 10), PAL.woodD, { key: 'win2' });
  cut(rect(584, 384, 312, 282, 4), '#e2643c', { key: 'win2s', shadow: false, pat: (bb) => { const n = Math.round(4 + 22 * ev(cu.sages, 2.2)); for (let k = 0; k < n; k++) tinySage(600 + (k * 37) % 300, 600 + Math.floor(k / 8) * -40 + 40, 0.42 + Math.floor(k / 8) * -0.06, 100 + k); } });
  cut(rect(560, 512, 360, 14, 2), PAL.woodD, { key: 'mullion', shadow: false });
  cut(rect(-30, 1240, W + 60, 800, 0), '#8a5a34', { key: 'floor2', tear: 0, pat: pat.grainWood('rgba(60,30,10,0.18)'), sy: -6 });
  cut(rect(90, 640, 250, 22, 4), PAL.wood, { key: 'shelf' }); diya(160, 636, 0.7, 'd2'); mug(270, 560, 0.7, '#9a4a22', 'cup2', false);
  for (let i = 0; i < 4; i++) cut(rot(ellipsePts(140 + i * 50, 420, 12, 40, 0, 12), 140 + i * 50, 390, Math.sin(TT * 2 + i) * 0.08), PAL.greenD, { key: 'herb' + i, sb: 4 });   // drying herbs
  ink([[100, 380], [340, 380]], { w: 3, color: PAL.ink, amt: 0.4, key: 'herbline' });
  draupadi(400, 1060, 1.05, { key: 'dr2', mood: TT < cu.sages ? 'smile' : 'wow' });
  pot(690, 1330, 1.0, { key: 'pot2' });
  cat(900, 1420, 0.6, '#5a4a40', 'cat2');
  if (TT >= cu.sages) { const f = () => tag('10,000 hungry sages', 740, 760, 46, { rot: 0.05, s: popS(cu.sages), fill: '#fff4d6' }); DEFER.push(f); }
  topTag('Her pot: empty', E0 + 0.1);
  capStrip('...and they were at her door');
}
// 3 · THE PRAYER: close, the lamp gutters
function scenePrayer() {
  cut(rect(-30, -30, W + 60, H + 60, 0), '#6e4530', { key: 'wall3', shadow: false, tear: 0, shade: false, pat: pat.stripes('rgba(255,220,180,0.06)', 30, 90, 0.2) });
  diya(860, 1330, 1.1, 'd3');
  const cw = Math.sin(TT * 3) * 30 * ev(cu.please, 0.5);
  cut([[80, 300], [300 + cw, 300], [280 + cw * 1.4, 1150], [80, 1150]], '#a8323e', { key: 'curtain', pat: pat.stripes('rgba(255,210,150,0.2)', 6, 40), sb: 10 });
  draupadi(560, 1180, 1.55, { key: 'dr3', mood: 'focus', pray: true, tear: cu.please });
  for (let i = 0; i < 5; i++) sparkle(700 + i * 50, 560 + Math.sin(TT * 2 + i) * 30, 6 + (B + i) % 3 * 2, 'rgba(255,230,170,0.7)');   // dust in the lamp light
  topTag('She called one name', E0 + 0.1, 58);
  capStrip('"Krishna... please."');
}
// 4 · HE CAME: the door bursts with light (the payoff; a short shot, drawn finished)
function sceneHeCame() {
  cut(rect(-30, -30, W + 60, H + 60, 0), '#ffe7a6', { key: 'light4', shadow: false, tear: 0, shade: false });
  ctx.save(); ctx.translate(540, 900); for (let i = 0; i < 18; i++) { ctx.rotate(TAU / 18); cut([[0, 0], [-60, -1300], [60, -1300]], i % 2 ? '#ffd36a' : '#fff1c4', { key: 'ray' + i, shadow: false, grain: 0.3, tear: 0.8 }); } ctx.restore();
  cut(rect(220, 330, 640, 1250, 300), 'rgba(255,250,230,0.55)', { key: 'doorglow', shadow: false, grain: false });
  krishna(540, 1180, 1.32, { key: 'kr4', glow: 1, mood: 'happy' });
  for (let i = 0; i < 10; i++) { const R = RNG('mote', i); sparkle(R.r(120, 960), R.r(320, 1450) - mod(TT * 40 + i * 30, 120), R.r(5, 10), '#fffbe8'); }
  capNow('He came.', 64);
}
// 5 · ONE LEAF: an extreme close-up on the rim
function sceneLeaf() {
  cut(rect(-30, -30, W + 60, H + 60, 0), '#b9773f', { key: 'wall5', shadow: false, tear: 0, shade: false, pat: pat.dots('rgba(255,235,200,0.25)', 6, 80) });
  pot(560, 1720, 3.2, { key: 'pot5' });
  const lift = springMove(E0 + 0.6, 0, 1, SPRING.heavy), eat = ev(cu.ate, 0.5);
  const lx = 540 + lift * 40 + eat * 200, ly = 1330 - lift * 330 - eat * 480;
  hand(lx + 230, ly - 70, 2.0, Math.PI + 0.5, BLUE_SKIN, SILK, { key: 'kh5', sleevePat: pat.stripes('rgba(200,130,20,0.22)', 5, 22, 0.4) });
  if (eat < 0.95) leafAt(lx, ly, 3.0 * (1 - eat * 0.6), -0.3 + lift * 0.3, 'leaf5');
  dot(lx + 250, ly - 30, 14, PAL.yellow);   // a gold ring
  for (let i = 0; i < 4; i++) sparkle(lx - 120 + i * 70, ly - 140 + Math.sin(TT * 3 + i) * 20, 8 * (B % 2 ? 1 : 0.7) * lift, '#fffbe8');
  steamUp(560, 1250, 'st5');
  topTag('One leaf', E0 + 0.1);
  capStrip('stuck to the pot. He ate it...');
}
function steamUp(x, y, key) { for (let i = 0; i < 3; i++) { const P = []; for (let k = 0; k <= 12; k++) P.push([x - 120 + i * 120 + Math.sin(k * 0.8 + i + TT * 3) * 14, y - k * 18]); ink(P, { w: 5, color: 'rgba(255,255,255,0.35)', amt: 0.6, key: key + i }); } }
// 6 · EVERY SAGE FULL: the river at sunset
function sceneFull() {
  sky([[0, '#f2a84a'], [520, '#f6cf55']], 'fs');
  cut(rect(-40, 760, W + 80, 1300, 0), '#3f8f9a', { key: 'water6', pat: pat.stripes('rgba(255,240,200,0.22)', 4, 34, Math.PI / 2), sy: -6 });
  const full = TT >= cu.full - 0.2;
  [[230, 1220, 0.85, 'sgA', PAL.skin3], [540, 1160, 1.0, 'sgB', PAL.skin2], [850, 1230, 0.85, 'sgC', PAL.skin1]].forEach(([x, y, s, k, sk], i) => {
    sage(x, y + (full ? Math.sin(TT * 6 + i) * 6 : 0), s, { key: k, skin: sk, mood: full ? (i === 1 ? 'happy' : 'happy') : 'wow' });
    if (full) handText('mmm!', x + 60 * s, y - 260 * s - ev(cu.full - 0.2, 0.5) * 30, 44 * s, '#5a2f1a', { key: 'mm' + i, rot: -0.1 });
  });
  cut([[-40, 1300], [300, 1285], [700, 1305], [1120, 1290], [1120, 2000], [-40, 2000]], '#3a8590', { key: 'water6f', sy: -5, pat: pat.stripes('rgba(255,240,200,0.22)', 4, 34, Math.PI / 2) });
  for (let i = 0; i < 5; i++) cut(ellipsePts(120 + i * 210, 1380 + (i % 2) * 40, 50, 18, 0, 18), PAL.greenD, { key: 'lily' + i, sb: 4 });
  birds(140, 380, 3, 'b6');
  cut(ellipsePts(860, 420, 90, 90, 0, 28), '#fff0b0', { key: 'sun6', shadow: false });
  topTag('10,000 sages', E0 + 0.1, 58);
  capStrip('...and every sage felt full');
}
// 7 · THE PROMISE: a leaf, a flower, a fruit, a little water (Gita 9.26)
function scenePromise() {
  cut(rect(-30, -30, W + 60, H + 60, 0), '#2f4f8a', { key: 'wall7', shadow: false, tear: 0, shade: false, pat: pat.dots('rgba(255,230,160,0.18)', 4, 60) });
  ctx.save(); ctx.translate(540, 1000); ctx.rotate(TT * 0.05); for (let i = 0; i < 16; i++) { ctx.rotate(TAU / 16); cut([[0, 0], [-50, -1100], [50, -1100]], 'rgba(255,220,130,0.16)', { key: 'pr' + i, shadow: false, grain: false, tear: 0.6 }); } ctx.restore();
  krishna(540, 1280, 1.18, { key: 'kr7', glow: 0.8, mood: 'smile' });
  const gifts = [[cu.leaf, 230, 620, (x, y, s) => leafAt(x, y, 1.6 * s, -0.4, 'leaf7')], [cu.flower, 850, 600, (x, y, s) => marigold(x, y, 1.6 * s)], [cu.fruit, 200, 960, (x, y, s) => mango(x, y, 1.5 * s)], [cu.water, 880, 960, (x, y, s) => waterCup(x, y, 1.3 * s)]];
  gifts.forEach(([t0, x, y, draw]) => { const k = popS(t0); if (k > 0) draw(x, y + Math.sin(TT * 2 + x) * 8, k); });
  topTag('Bhagavad Gita 9.26', E0 + 0.1, 58);
  if (TT >= cu.love - 0.2) { const f = () => tag('with love... I accept it', CX, H - SAFE.bottom - 60, 52, { rot: 0.012, tape: false, frac: ev(cu.love - 0.2, 0.6) }); DEFER.push(f); }
  else capStrip('a leaf, a flower, a fruit, water');
}
// 8 · ENOUGH: the hut again, now warm (the end is the start, changed)
function sceneEnd() {
  sky([[0, '#1f2350'], [520, '#4a2456'], [860, '#8e3355']], 'en');
  for (let i = 0; i < 30; i++) { const R = RNG('star', i); if ((B + i) % 9 < 7) sparkle(R.r(40, 1040), R.r(260, 820), R.r(4, 9)); }
  cut(ellipsePts(780, 560, 70, 70, 0, 26), '#f6ecc8', { key: 'moon8', shadow: false });
  cut([[-40, 1010], [200, 930], [420, 980], [640, 900], [880, 960], [1120, 920], [1120, 1100], [-40, 1100]], '#3a2040', { key: 'hills8', sb: 8 });
  cut(rect(-40, 1060, W + 80, 140, 0), '#2f4f6a', { key: 'river8', pat: pat.stripes('rgba(255,230,180,0.25)', 3, 26, Math.PI / 2), sy: -4 });
  cut([[-40, 1180], [1120, 1150], [1120, 2000], [-40, 2000]], '#4a3320', { key: 'bank8', sy: -6 });
  tree(140, 1190, 0.9, '#23402c', 'tA8'); tree(980, 1170, 1.0, '#23402c', 'tB8');
  hut(620, 1130, 0.9, { key: 'hut8', light: true });
  ctx.save(); const g = ctx.createRadialGradient(620, 1060, 20, 620, 1060, 420); g.addColorStop(0, 'rgba(255,214,120,0.55)'); g.addColorStop(1, 'rgba(255,200,100,0)'); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(200, 640, 840, 840); ctx.restore();
  draupadi(330, 1180, 0.62, { key: 'dr8', mood: 'happy' });
  pot(480, 1300, 0.45, { key: 'pot8', glow: true });
  leafAt(480, 1232, 0.6, 0.2, 'leaf8');
  for (let k = 0; k < 9; k++) { const x = 760 + (k % 3) * 80, y = 1290 + Math.floor(k / 3) * 34; cut(capsulePts(x - 30, y, x + 30, y, 26, 6), SAFFRON, { key: 'sl' + k, sb: 3, sy: 2, grain: 0.4 }); dot(x - 40, y - 4, 11, PAL.skin3); }   // monks asleep, full
  handText('z z', 820, 1240 - mod(TT * 12, 30), 34, 'rgba(255,255,255,0.7)', { key: 'zz8' });
  for (let i = 0; i < 7; i++) firefly(120 + i * 130, 1120 + Math.sin(i * 2 + TT) * 40, i);
  if (TT < cu.comment - 0.15) capStrip('whatever little you have... is enough');
  else { const f = () => tag('Comment "Krishna"', CX, H - SAFE.bottom - 60, 62, { rot: -0.02, s: popS(cu.comment - 0.15), fill: '#fff4d6' }); DEFER.push(f); }
  topTag('Enough.', cu.enough, 72);
}
