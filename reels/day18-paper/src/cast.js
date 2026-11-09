// =====================================================================
//  THE CAST (original cut-paper characters for this piece) and the props
//  draupadi(x, y, s, o)  a bust, shoulders at (x, y): long black hair, ochre sari with a red-bordered pallu, bindi
//  krishna(x, y, s, o)   a bust: blue skin, gold crown with a peacock feather, white U namam with a red line,
//                         yellow silk, a flower garland
//  sage(x, y, s, o)      a bust: saffron cloth, grey matted hair in a top-knot, white beard, ash lines on the forehead
//  tinySage(x, y, s, k)  a far-away walking monk (for crowds)
//  pot, leafAt, diya, hut, tree, marigold, mango, waterCup, firefly
// =====================================================================
const SAREE = '#d98a2b', SAREE_D = '#b06a1c', BORDER = '#b3283b', BLUE_SKIN = '#5b86c8', SILK = '#f2c230', SAFFRON = '#e3913f', COPPER = '#c46a3a', STRAW = '#d9b25a', MUD = '#a8744a';

function namaste(x, y, s, skin, key) {   // two hands joined at the chest
  cut(rot(ellipsePts(x - 14 * s, y, 22 * s, 58 * s, 0, 18), x - 14 * s, y, 0.18), skin, { key: key + 'nl', sb: 6 });
  cut(rot(ellipsePts(x + 14 * s, y, 22 * s, 58 * s, 0, 18), x + 14 * s, y, -0.18), skin, { key: key + 'nr', sb: 6 });
}
function tear(x, y, s, t0, key) {        // a tear that runs down the cheek
  const k = clamp((TT - t0) / 1.4); if (k <= 0) return;
  const yy = y + k * 46 * s;
  cut(ellipsePts(x, yy, 6 * s, 9 * s, 0, 12), '#bfe3f2', { key: key + 'tr', sb: 3, sy: 2, grain: false });
}
function draupadi(x, y, s, o = {}) {
  const key = o.key ?? 'dr', skin = PAL.skin2;
  // long hair behind the shoulders
  cut([[x - 92 * s, y - 150 * s], [x - 120 * s, y + 40 * s], [x - 100 * s, y + 230 * s], [x + 100 * s, y + 230 * s], [x + 120 * s, y + 40 * s], [x + 92 * s, y - 150 * s]], '#1e1714', { key: key + 'lh', sb: 8 });
  person(x, y, s, { key, skin, hair: '#1e1714', shirt: SAREE, shirtPat: pat.dots('rgba(255,235,180,0.25)', 3 * s, 26 * s), mood: o.mood ?? 'sad' });
  // the pallu: a red-bordered drape across the body
  cut([[x - 120 * s, y + 40 * s], [x - 70 * s, y + 10 * s], [x + 110 * s, y + 250 * s], [x + 60 * s, y + 300 * s]], SAREE_D, { key: key + 'pl', pat: pat.stripes('rgba(255,220,160,0.18)', 6 * s, 30 * s, 0.8), sb: 6 });
  ink([[x - 70 * s, y + 10 * s], [x + 110 * s, y + 250 * s]], { w: 10 * s, color: BORDER, amt: 0.6, key: key + 'bd' });
  dot(x, y - 150 * s, 7 * s, '#c81e3a');                                          // bindi
  dot(x - 76 * s, y - 92 * s, 7 * s, PAL.yellow); dot(x + 76 * s, y - 92 * s, 7 * s, PAL.yellow);   // earrings
  cut(rect(x - 70 * s, y - 214 * s, 140 * s, 22 * s, 10 * s), '#1e1714', { key: key + 'pt', shadow: false });  // centre parting
  ink([[x, y - 214 * s], [x, y - 190 * s]], { w: 5 * s, color: '#c81e3a', amt: 0.2, key: key + 'sd' });       // sindoor
  if (o.pray) namaste(x, y + 70 * s, s, skin, key);
  if (o.tear) tear(x + 18 * s, y - 108 * s, s, o.tear, key);
}
function crown(x, y, s, key) {
  cut([[x - 74 * s, y], [x - 82 * s, y - 70 * s], [x - 40 * s, y - 50 * s], [x, y - 104 * s], [x + 40 * s, y - 50 * s], [x + 82 * s, y - 70 * s], [x + 74 * s, y]], PAL.yellow, { key: key + 'cw', crayon: PAL.mustard, crAl: 0.5, sb: 6 });
  dot(x, y - 34 * s, 10 * s, '#c81e3a'); dot(x - 44 * s, y - 22 * s, 7 * s, PAL.green); dot(x + 44 * s, y - 22 * s, 7 * s, PAL.green);
  // the peacock feather, tucked in and swaying a little
  const sw = Math.sin(TT * 1.6) * 0.06;
  ctx.save(); ctx.translate(x + 30 * s, y - 80 * s); ctx.rotate(0.35 + sw);
  ink([[0, 40 * s], [0, -90 * s]], { w: 4 * s, color: '#e6c46a', amt: 0.3, key: key + 'fq' });
  cut(ellipsePts(0, -110 * s, 30 * s, 42 * s, 0, 22), '#2e8b57', { key: key + 'f1', sb: 5, pat: pat.stripes('rgba(200,255,200,0.25)', 3 * s, 9 * s, 0.4) });
  cut(ellipsePts(0, -104 * s, 18 * s, 25 * s, 0, 18), '#d4a017', { key: key + 'f2', shadow: false });
  cut(ellipsePts(0, -102 * s, 12 * s, 17 * s, 0, 16), '#1e5aa8', { key: key + 'f3', shadow: false });
  dot(0, -100 * s, 6 * s, '#0b1f4d');
  ctx.restore();
}
function namam(x, y, s, key) {           // the Vaishnava namam: a white U with a red centre line
  ink([[x - 14 * s, y - 46 * s], [x - 13 * s, y - 6 * s], [x, y + 4 * s], [x + 13 * s, y - 6 * s], [x + 14 * s, y - 46 * s]], { w: 6 * s, color: '#ffffff', amt: 0.2, key: key + 'nm' });
  ink([[x, y - 44 * s], [x, y - 6 * s]], { w: 5 * s, color: '#d0213a', amt: 0.2, key: key + 'nr' });
}
function garland(x, y, s, key) {
  const cols = ['#ffffff', '#f3a3bf', '#f6cf55', '#ffffff', '#e86a7a'];
  for (let i = 0; i <= 14; i++) {
    const a = Math.PI * (0.08 + 0.84 * i / 14), r = 120 * s;
    cut(ellipsePts(x + Math.cos(a) * r, y - 20 * s + Math.sin(a) * r * 1.1, 13 * s, 13 * s, 0, 12), cols[i % 5], { key: key + 'gl' + i, sb: 3, sy: 3, grain: 0.5 });
  }
}
function krishna(x, y, s, o = {}) {
  const key = o.key ?? 'kr';
  cut([[x - 86 * s, y - 150 * s], [x - 110 * s, y + 20 * s], [x - 70 * s, y + 90 * s], [x + 70 * s, y + 90 * s], [x + 110 * s, y + 20 * s], [x + 86 * s, y - 150 * s]], '#1e1714', { key: key + 'lh', sb: 8 });
  person(x, y, s, { key, skin: BLUE_SKIN, hair: '#1e1714', shirt: SILK, shirtPat: pat.stripes('rgba(200,130,20,0.22)', 5 * s, 22 * s, 0.4), mood: o.mood ?? 'smile' });
  cut([[x - 125 * s, y + 60 * s], [x + 125 * s, y + 60 * s], [x + 125 * s, y + 90 * s], [x - 125 * s, y + 90 * s]], '#c0392b', { key: key + 'sh', shadow: false, grain: 0.5 });   // a red sash
  garland(x, y + 30 * s, s, key);
  namam(x, y - 150 * s, s, key);
  dot(x - 76 * s, y - 92 * s, 9 * s, PAL.yellow); dot(x + 76 * s, y - 92 * s, 9 * s, PAL.yellow);
  crown(x, y - 196 * s, s, key);
  if (o.glow) { ctx.save(); const g = ctx.createRadialGradient(x, y - 100 * s, 50 * s, x, y - 100 * s, 420 * s); g.addColorStop(0, 'rgba(255,230,150,0)'); g.addColorStop(0.5, `rgba(255,220,120,${0.25 * o.glow})`); g.addColorStop(1, 'rgba(255,210,100,0)'); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(x - 450 * s, y - 520 * s, 900 * s, 900 * s); ctx.restore(); }
}
function sage(x, y, s, o = {}) {
  const key = o.key ?? 'sg', skin = o.skin ?? PAL.skin2;
  cut(ellipsePts(x, y - 225 * s, 40 * s, 34 * s, 0, 16), '#a8a29a', { key: key + 'kn', sb: 4 });   // the top-knot
  person(x, y, s, { key, skin, hair: '#a8a29a', shirt: SAFFRON, beard: true, mood: o.mood ?? 'smile' });
  for (let i = 0; i < 3; i++) ink([[x - 30 * s, y - 166 * s + i * 9 * s], [x + 30 * s, y - 166 * s + i * 9 * s]], { w: 3.5 * s, color: '#f2efe6', amt: 0.3, key: key + 'ash' + i });
  ink(arcPts(x, y + 20 * s, 90 * s, 0.25, Math.PI - 0.25, 10), { w: 6 * s, color: '#6b3b20', amt: 0.4, key: key + 'rd' });   // rudraksha string
}
function tinySage(x, y, s, k) {           // a far-away walking monk: a walking bob on 2s
  const bob = Math.abs(Math.sin((TT * 3 + k * 0.7) * Math.PI)) * 4 * s;
  cut(capsulePts(x, y - 66 * s - bob, x, y - 8 * s, 44 * s, 6), SAFFRON, { key: 'ts' + k + 'b', sb: 4, sy: 3, grain: 0.4 });
  cut(ellipsePts(x, y - 104 * s - bob, 20 * s, 21 * s, 0, 14), PAL.skin3, { key: 'ts' + k + 'h', sb: 3, sy: 2, grain: 0.3 });
  cut(ellipsePts(x, y - 128 * s - bob, 11 * s, 10 * s, 0, 10), '#8f8a82', { key: 'ts' + k + 'k', shadow: false, grain: 0.3 });
  dot(x - 6 * s, y - 106 * s - bob, 2.5 * s); dot(x + 6 * s, y - 106 * s - bob, 2.5 * s);
  ink([[x + 24 * s, y - 120 * s - bob], [x + 30 * s, y + 4 * s]], { w: 3 * s, color: PAL.woodD, amt: 0.3, key: 'ts' + k + 's' });   // a staff
}
function pot(x, y, s, o = {}) {           // a big copper cooking pot; o.empty shows the dark inside
  const key = o.key ?? 'pot';
  cut(ellipsePts(x, y, 150 * s, 120 * s, 0, 30), COPPER, { key: key + 'b', crayon: '#a8522a', crAl: 0.45, pat: pat.stripes('rgba(255,210,170,0.18)', 10 * s, 60 * s, 1.2) });
  cut(ellipsePts(x, y - 110 * s, 118 * s, 30 * s, 0, 26), '#b45f32', { key: key + 'r', sb: 5 });
  cut(ellipsePts(x, y - 108 * s, 100 * s, 22 * s, 0, 24), o.glow ? '#ffe7a0' : '#3a2018', { key: key + 'in', shadow: false, grain: 0.5 });
  ink(arcPts(x - 50 * s, y - 20 * s, 60 * s, Math.PI * 1.1, Math.PI * 1.45, 8), { w: 8 * s, color: 'rgba(255,230,200,0.55)', amt: 0.4, key: key + 'hl' });
}
function leafAt(x, y, s, a = 0, key = 'lf') {   // THE LEAF (reserved colour)
  cut(rot([[x - 46 * s, y], [x - 20 * s, y - 22 * s], [x + 20 * s, y - 20 * s], [x + 50 * s, y], [x + 20 * s, y + 20 * s], [x - 20 * s, y + 22 * s]], x, y, a), LEAF, { key: key + 'l', crayon: LEAFD, crAl: 0.35, sb: 6, tear: 0.6 });
  ink(rot([[x - 40 * s, y], [x + 44 * s, y]], x, y, a), { w: 3 * s, color: LEAFD, amt: 0.3, key: key + 'v' });
  for (let i = -1; i <= 1; i += 2) for (let j = 0; j < 3; j++) ink(rot([[x - 18 * s + j * 18 * s, y], [x - 6 * s + j * 18 * s, y + i * 14 * s]], x, y, a), { w: 2 * s, color: LEAFD, amt: 0.2, key: key + 'vv' + i + j });
}
function diya(x, y, s, key = 'dy') {
  const fl = 1 + 0.12 * Math.sin(B * 1.7) + 0.06 * Math.sin(B * 3.1);
  ctx.save(); const g = ctx.createRadialGradient(x, y - 40 * s, 10 * s, x, y - 40 * s, 260 * s); g.addColorStop(0, `rgba(255,200,90,${0.35 * fl})`); g.addColorStop(1, 'rgba(255,170,60,0)'); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(x - 280 * s, y - 300 * s, 560 * s, 560 * s); ctx.restore();
  cut([[x - 60 * s, y - 10 * s], [x + 60 * s, y - 10 * s], [x + 40 * s, y + 24 * s], [x - 40 * s, y + 24 * s]], '#9a4a22', { key: key + 'b', sb: 5 });
  cut([[x, y - 12 * s], [x - 14 * s, y - 40 * s * fl], [x, y - 80 * s * fl], [x + 14 * s, y - 40 * s * fl]], '#ffcf4a', { key: key + 'f', shadow: false, grain: false, tear: 0.4 });
  cut([[x, y - 16 * s], [x - 6 * s, y - 34 * s], [x, y - 54 * s * fl], [x + 6 * s, y - 34 * s]], '#fff3c4', { key: key + 'f2', shadow: false, grain: false, tear: 0.2 });
}
function hut(x, y, s, o = {}) {           // a forest hut, base centre (x, y)
  const key = o.key ?? 'hut';
  cut(rect(x - 150 * s, y - 180 * s, 300 * s, 180 * s, 8 * s), MUD, { key: key + 'w', crayon: '#8a5a34', crAl: 0.35 });
  cut([[x - 200 * s, y - 160 * s], [x, y - 330 * s], [x + 200 * s, y - 160 * s]], STRAW, { key: key + 'r', pat: pat.stripes('rgba(140,90,30,0.28)', 4 * s, 16 * s, 0.3), sb: 8 });
  cut(rect(x - 45 * s, y - 120 * s, 90 * s, 120 * s, 40 * s), o.light ? '#ffe39a' : '#3a2418', { key: key + 'd', shadow: false, grain: 0.5 });
}
function tree(x, y, s, c = PAL.greenD, key = 'tr') {
  cut(rect(x - 16 * s, y - 220 * s, 32 * s, 220 * s, 6 * s), PAL.woodD, { key: key + 't', pat: pat.grainWood('rgba(60,30,10,0.2)') });
  const R = RNG('tree', key);
  for (let i = 0; i < 5; i++) cut(ellipsePts(x + R.n(70) * s, y - 260 * s - R.r(0, 90) * s, R.r(70, 100) * s, R.r(55, 80) * s, 0, 20), [c, PAL.green, '#4c8f4a'][i % 3], { key: key + 'c' + i, sb: 8 });
}
function marigold(x, y, s, key = 'mg') {
  for (let p = 0; p < 10; p++) { const a = p / 10 * TAU; cut(ellipsePts(x + Math.cos(a) * 24 * s, y + Math.sin(a) * 24 * s, 20 * s, 13 * s, a, 12), p % 2 ? '#f6a531' : '#f6cf55', { key: key + p, sb: 4, sy: 3 }); }
  dot(x, y, 14 * s, '#d9781f');
}
function mango(x, y, s, key = 'mn') {
  cut(rot(ellipsePts(x, y, 46 * s, 34 * s, 0, 22), x, y, 0.5), '#f2b632', { key: key + 'b', crayon: '#e07a2a', crAl: 0.4 });
  cut(rot(ellipsePts(x + 30 * s, y - 34 * s, 18 * s, 8 * s, 0, 12), x + 30 * s, y - 34 * s, -0.6), PAL.green, { key: key + 'l', sb: 3 });
}
function waterCup(x, y, s, key = 'wc') {
  cut([[x - 50 * s, y - 20 * s], [x + 50 * s, y - 20 * s], [x + 36 * s, y + 30 * s], [x - 36 * s, y + 30 * s]], COPPER, { key: key + 'c', crayon: '#a8522a', crAl: 0.4 });
  cut(ellipsePts(x, y - 20 * s, 50 * s, 12 * s, 0, 18), '#7ec8e3', { key: key + 'w', shadow: false });
  const k = mod(TT * 1.2, 1); cut(ellipsePts(x, y - 70 * s + k * 40 * s, 8 * s, 12 * s, 0, 12), '#9fd8ee', { key: key + 'dp', sb: 3, grain: false });
}
function firefly(x, y, i) { const on = (B + i * 5) % 11 < 6; if (on) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(x, y, 1, x, y, 22); g.addColorStop(0, 'rgba(255,240,150,0.9)'); g.addColorStop(1, 'rgba(255,230,120,0)'); ctx.fillStyle = g; ctx.fillRect(x - 24, y - 24, 48, 48); ctx.restore(); } }
