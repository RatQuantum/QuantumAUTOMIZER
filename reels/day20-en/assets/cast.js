// The cast: flat 2D characters (pill bodies, stick limbs, bold outlines, big eyes) drawn on canvases and shown as
// billboards inside the 3D world. Original designs for @lordsrikrishnatemple. Every pose is a key; textures are cached.
const OUT = '#1d1a24';

function rr(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
function fillStroke(c, fill, lw = 7) { c.fillStyle = fill; c.fill(); c.lineWidth = lw; c.strokeStyle = OUT; c.stroke(); }
function circ(c, x, y, r) { c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); }
function line(c, pts, w = 7, col = OUT) { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (const p of pts.slice(1)) c.lineTo(p[0], p[1]); c.lineWidth = w; c.strokeStyle = col; c.lineCap = 'round'; c.lineJoin = 'round'; c.stroke(); }

// eyes: normal | smug (half-lidded) | wow (big) | happy (closed arcs) | closed (devotion) | sad | wink
function face(c, x, y, mood, skin, blink) {
  const ex = 24, ey = y;
  const eye = (cx, open = 1) => {
    if (blink && mood !== 'happy' && mood !== 'closed') { line(c, [[cx - 12, ey + 2], [cx + 12, ey + 2]], 6); return; }
    if (mood === 'happy' || mood === 'closed') { c.beginPath(); c.arc(cx, ey + (mood === 'happy' ? 6 : 2), 10, Math.PI * (mood === 'happy' ? 1.1 : 0.1), Math.PI * (mood === 'happy' ? 1.9 : 0.9)); c.lineWidth = 6; c.strokeStyle = OUT; c.lineCap = 'round'; c.stroke(); return; }
    const r = mood === 'wow' ? 17 : 13;
    circ(c, cx, ey, r); c.fillStyle = '#fff'; c.fill(); c.lineWidth = 4; c.strokeStyle = OUT; c.stroke();
    circ(c, cx + (mood === 'smug' ? 3 : 1), ey + (mood === 'wow' ? 0 : 2), mood === 'wow' ? 7 : 7); c.fillStyle = OUT; c.fill();
    if (mood === 'smug') { c.beginPath(); c.moveTo(cx - r - 2, ey - 1); c.lineTo(cx + r + 2, ey - 1); c.lineTo(cx + r + 2, ey - r - 3); c.lineTo(cx - r - 2, ey - r - 3); c.closePath(); c.fillStyle = skin; c.fill(); line(c, [[cx - r, ey - 1], [cx + r, ey - 1]], 4); }
  };
  if (mood === 'wink') { eye(x - ex); c.beginPath(); c.arc(x + ex, ey + 4, 10, Math.PI * 1.1, Math.PI * 1.9); c.lineWidth = 6; c.strokeStyle = OUT; c.stroke(); }
  else { eye(x - ex); eye(x + ex); }
  if (mood === 'sad') { line(c, [[x - 40, y - 26], [x - 14, y - 20]], 5); line(c, [[x + 40, y - 26], [x + 14, y - 20]], 5); }
  if (mood === 'smug') { line(c, [[x - 40, y - 24], [x - 12, y - 28]], 5); line(c, [[x + 40, y - 24], [x + 12, y - 28]], 5); }
  // mouth
  if (mood === 'wow') { c.beginPath(); c.ellipse(x, y + 40, 9, 12, 0, 0, Math.PI * 2); c.fillStyle = OUT; c.fill(); }
  else if (mood === 'happy' || mood === 'wink') { c.beginPath(); c.arc(x, y + 30, 16, 0.1 * Math.PI, 0.9 * Math.PI); c.closePath(); c.fillStyle = OUT; c.fill(); }
  else if (mood === 'sad') { c.beginPath(); c.arc(x, y + 46, 12, 1.15 * Math.PI, 1.85 * Math.PI); c.lineWidth = 5; c.strokeStyle = OUT; c.stroke(); }
  else if (mood === 'smug') { c.beginPath(); c.arc(x + 6, y + 30, 12, 0.15 * Math.PI, 0.7 * Math.PI); c.lineWidth = 5; c.strokeStyle = OUT; c.stroke(); }
  else { c.beginPath(); c.arc(x, y + 30, 11, 0.2 * Math.PI, 0.8 * Math.PI); c.lineWidth = 5; c.strokeStyle = OUT; c.stroke(); }
  c.fillStyle = 'rgba(240,110,120,0.35)'; c.beginPath(); c.ellipse(x - 40, y + 22, 9, 6, 0, 0, Math.PI * 2); c.ellipse(x + 40, y + 22, 9, 6, 0, 0, Math.PI * 2); c.fill();
}

// one character on a 256x512 canvas; feet at y=500, head centre around y=150
export function drawChar(c, s, pose) {
  const W = 256, cx = W / 2, mood = pose.mood || 'normal', step = pose.step || 0, arm = pose.arm || 'down';
  c.clearRect(0, 0, W, 512);
  const bodyTop = 220, bodyH = s.bodyH || 200, bodyW = s.bodyW || 130, legTop = bodyTop + bodyH - 20;
  // legs (a walking step swings them)
  if (!pose.sitting) {
    const sw = Math.sin(step * Math.PI) * 18;
    line(c, [[cx - 22, legTop], [cx - 24 - sw, 492]], 8); line(c, [[cx + 22, legTop], [cx + 24 + sw, 492]], 8);
    line(c, [[cx - 24 - sw, 494], [cx - 40 - sw, 496]], 8); line(c, [[cx + 24 + sw, 494], [cx + 40 + sw, 496]], 8);
  }
  if (s.under) s.under(c, cx, bodyTop, bodyW, bodyH);
  // arms
  const armL = arm === 'up' ? [[cx - bodyW / 2 + 6, bodyTop + 50], [cx - 84, bodyTop - 40], [cx - 70, bodyTop - 110]] : arm === 'wave' ? [[cx - bodyW / 2 + 6, bodyTop + 50], [cx - 92, bodyTop - 10], [cx - 100, bodyTop - 50]] : arm === 'point' ? [[cx - bodyW / 2 + 6, bodyTop + 50], [cx - 110, bodyTop + 30]] : [[cx - bodyW / 2 + 6, bodyTop + 50], [cx - bodyW / 2 - 14, bodyTop + 140]];
  const armR = arm === 'up' ? [[cx + bodyW / 2 - 6, bodyTop + 50], [cx + 84, bodyTop - 40], [cx + 70, bodyTop - 110]] : arm === 'offer' ? [[cx + bodyW / 2 - 6, bodyTop + 50], [cx + 96, bodyTop + 40]] : arm === 'hips' ? [[cx + bodyW / 2 - 6, bodyTop + 50], [cx + bodyW / 2 + 22, bodyTop + 90], [cx + bodyW / 2 - 4, bodyTop + 120]] : [[cx + bodyW / 2 - 6, bodyTop + 50], [cx + bodyW / 2 + 14, bodyTop + 140]];
  line(c, armL, 7); line(c, armR, 7);
  if (s.handsSkin) { const hl = armL[armL.length - 1], hr = armR[armR.length - 1]; circ(c, hl[0], hl[1], 9); fillStroke(c, s.skin, 4); circ(c, hr[0], hr[1], 9); fillStroke(c, s.skin, 4); }
  // body
  rr(c, cx - bodyW / 2, bodyTop, bodyW, bodyH, bodyW / 2); fillStroke(c, s.body);
  if (s.bodyDeco) { c.save(); rr(c, cx - bodyW / 2, bodyTop, bodyW, bodyH, bodyW / 2); c.clip(); s.bodyDeco(c, cx, bodyTop, bodyW, bodyH); c.restore(); rr(c, cx - bodyW / 2, bodyTop, bodyW, bodyH, bodyW / 2); c.lineWidth = 7; c.strokeStyle = OUT; c.stroke(); }
  // head
  const hy = 150, hr = s.headR || 74;
  if (s.hairBack) s.hairBack(c, cx, hy, hr);
  circ(c, cx, hy, hr); fillStroke(c, s.skin);
  if (s.hair) s.hair(c, cx, hy, hr);
  face(c, cx, hy + 6, mood, s.skin, pose.blink);
  if (s.top) s.top(c, cx, hy, hr, pose);
  if (s.prop) s.prop(c, cx, bodyTop, bodyW, bodyH, pose);
  if (pose.pot) { c.beginPath(); c.ellipse(cx, bodyTop + 70, 56, 48, 0, 0, Math.PI * 2); fillStroke(c, '#c8643a', 6); rr(c, cx - 30, bodyTop + 10, 60, 22, 8); fillStroke(c, '#b4552f', 5); c.beginPath(); c.ellipse(cx, bodyTop + 14, 26, 9, 0, 0, Math.PI * 2); c.fillStyle = '#fffbe8'; c.fill(); }
  if (pose.butter) { const B = [[cx - 30, 120, 22], [cx + 34, 170, 18], [cx - 10, 88, 16], [cx + 40, 110, 12], [cx - 46, 300, 26], [cx + 30, 340, 20], [cx, 250, 16]]; for (const [x, y, r] of B) { c.beginPath(); c.ellipse(x, y, r, r * 0.8, 0.3, 0, Math.PI * 2); c.fillStyle = '#fffbea'; c.fill(); c.lineWidth = 3; c.strokeStyle = 'rgba(29,26,36,0.5)'; c.stroke(); } }
}

// ---- the people
const hairCap = (col) => (c, cx, hy, hr) => { c.beginPath(); c.arc(cx, hy, hr, Math.PI * 1.02, Math.PI * 1.98); c.quadraticCurveTo(cx + hr * 0.4, hy - hr * 0.55, cx, hy - hr * 0.45); c.quadraticCurveTo(cx - hr * 0.4, hy - hr * 0.55, cx - hr * 0.99, hy - 6); c.closePath(); fillStroke(c, col, 6); };
const goldDots = (c, cx, y0, n, r, col = '#ffd23a') => { for (let i = 0; i < n; i++) { const a = Math.PI * (0.15 + 0.7 * i / (n - 1)); circ(c, cx + Math.cos(a) * 52, y0 + Math.sin(a) * 34, r); fillStroke(c, col, 3); } };
const kid = (skin, body, hair = '#1d1a24', extra = {}) => Object.assign({ skin, body, bodyW: 116, bodyH: 160, headR: 80, handsSkin: true, hair: hairCap(hair) }, extra);
export const CAST = {
  krishna: {
    skin: '#4f86d9', body: '#ffcf3a', bodyW: 120, bodyH: 190, handsSkin: true,
    bodyDeco: (c, cx, y, w, h) => { c.fillStyle = '#e8462c'; c.fillRect(cx - w / 2, y + h * 0.42, w, 18); goldDots(c, cx, y + 6, 9, 7, '#ffffff'); },
    hairBack: (c, cx, hy, hr) => { c.beginPath(); c.ellipse(cx, hy + 20, hr + 10, hr + 18, 0, 0, Math.PI * 2); fillStroke(c, '#1d1a24', 6); },
    hair: hairCap('#1d1a24'),
    top: (c, cx, hy, hr) => {
      rr(c, cx - 52, hy - hr - 14, 104, 30, 10); fillStroke(c, '#ffd23a', 5); circ(c, cx, hy - hr, 8); fillStroke(c, '#e8462c', 3);   // a gold band
      c.save(); c.translate(cx + 28, hy - hr - 6); c.rotate(0.35);                                                                      // peacock feather
      line(c, [[0, 0], [0, -70]], 4, '#c9a227'); c.beginPath(); c.ellipse(0, -84, 20, 28, 0, 0, Math.PI * 2); fillStroke(c, '#2e9d5a', 4);
      c.beginPath(); c.ellipse(0, -80, 12, 16, 0, 0, Math.PI * 2); c.fillStyle = '#e3b02a'; c.fill(); c.beginPath(); c.ellipse(0, -78, 7, 10, 0, 0, Math.PI * 2); c.fillStyle = '#1e5aa8'; c.fill();
      c.restore();
      line(c, [[cx - 9, hy - 46], [cx - 8, hy - 26], [cx, hy - 20], [cx + 8, hy - 26], [cx + 9, hy - 46]], 4, '#ffffff');               // namam: white U
      line(c, [[cx, hy - 44], [cx, hy - 26]], 3.5, '#e0213a');                                                                           // ...with a red line
    },
  },
  satyabhama: {
    skin: '#e2a27a', body: '#d8263a', bodyW: 132, bodyH: 210, handsSkin: true,
    bodyDeco: (c, cx, y, w, h) => { c.fillStyle = '#ffd23a'; c.save(); c.translate(cx, y + h * 0.5); c.rotate(-0.6); c.fillRect(-w, -9, w * 2, 18); c.restore(); c.fillStyle = '#ffd23a'; c.fillRect(cx - w / 2, y + h - 22, w, 14); goldDots(c, cx, y + 4, 9, 9); goldDots(c, cx, y + 20, 7, 7); },
    hairBack: (c, cx, hy, hr) => { circ(c, cx, hy - hr + 4, 34); fillStroke(c, '#1d1a24', 6); },
    hair: hairCap('#1d1a24'),
    top: (c, cx, hy, hr) => {
      c.beginPath(); c.moveTo(cx - 44, hy - hr + 16); c.lineTo(cx - 30, hy - hr - 22); c.lineTo(cx - 12, hy - hr + 4); c.lineTo(cx, hy - hr - 30); c.lineTo(cx + 12, hy - hr + 4); c.lineTo(cx + 30, hy - hr - 22); c.lineTo(cx + 44, hy - hr + 16); c.closePath(); fillStroke(c, '#ffd23a', 5);
      circ(c, cx, hy - hr - 4, 7); fillStroke(c, '#2e9d5a', 3); circ(c, cx, hy - 40, 6); c.fillStyle = '#d8263a'; c.fill();
      circ(c, cx - hr - 2, hy + 24, 10); fillStroke(c, '#ffd23a', 3); circ(c, cx + hr + 2, hy + 24, 10); fillStroke(c, '#ffd23a', 3);
    },
  },
  rukmini: {
    skin: '#d99a72', body: '#3fae7a', bodyW: 124, bodyH: 205, handsSkin: true,
    bodyDeco: (c, cx, y, w, h) => { c.fillStyle = '#f5a6c0'; c.save(); c.translate(cx, y + h * 0.5); c.rotate(-0.6); c.fillRect(-w, -10, w * 2, 20); c.restore(); c.fillStyle = '#f5a6c0'; c.fillRect(cx - w / 2, y + h - 22, w, 14); },
    hairBack: (c, cx, hy, hr) => { rr(c, cx + hr - 30, hy, 26, 170, 13); fillStroke(c, '#1d1a24', 5); },
    hair: hairCap('#1d1a24'),
    top: (c, cx, hy) => { circ(c, cx, hy - 40, 6); c.fillStyle = '#d8263a'; c.fill(); for (let i = 0; i < 5; i++) { circ(c, cx - 50 + i * 8, hy - 52 - Math.sin(i / 4 * Math.PI) * 10, 6); fillStroke(c, '#ffffff', 2); } },
    prop: (c, cx, y, w, h, pose) => { if (!pose.leaf) return; const lx = pose.arm === 'offer' ? cx + 100 : cx - 78, ly = pose.arm === 'offer' ? y + 30 : y + 150; c.beginPath(); c.ellipse(lx, ly, 20, 11, -0.5, 0, Math.PI * 2); fillStroke(c, '#5cc04a', 4); line(c, [[lx - 14, ly + 8], [lx + 14, ly - 8]], 2.5, '#2f7a2a'); },
  },
  narada: {
    skin: '#e0a57c', body: '#f08a2c', bodyW: 118, bodyH: 210, handsSkin: true,
    bodyDeco: (c, cx, y, w, h) => { for (let i = 0; i < 7; i++) { circ(c, cx - 40 + i * 13, y + 26 + Math.sin(i / 6 * Math.PI) * 18, 5); c.fillStyle = '#6b3b20'; c.fill(); } },
    hair: (c, cx, hy, hr) => { circ(c, cx, hy - hr - 4, 22); fillStroke(c, '#f2f2f2', 5); },
    top: (c, cx, hy) => {
      c.beginPath(); c.moveTo(cx - 50, hy + 30); c.quadraticCurveTo(cx, hy + 130, cx + 50, hy + 30); c.quadraticCurveTo(cx, hy + 60, cx - 50, hy + 30); fillStroke(c, '#f2f2f2', 5);   // white beard
      for (let i = 0; i < 3; i++) line(c, [[cx - 26, hy - 40 + i * 8], [cx + 26, hy - 40 + i * 8]], 3, '#ffffff');
    },
    prop: (c, cx, y) => { line(c, [[cx - 96, y - 120], [cx - 70, y + 200]], 9, '#8a4b20'); circ(c, cx - 98, y - 130, 26); fillStroke(c, '#c97a3a', 5); circ(c, cx - 68, y + 206, 32); fillStroke(c, '#c97a3a', 5); },   // the veena
  },
  courtier: {
    skin: '#c98a5e', body: '#f4f1ea', bodyW: 116, bodyH: 190,
    bodyDeco: (c, cx, y, w) => { c.fillStyle = '#d9a441'; c.fillRect(cx - w / 2, y + 60, w, 12); },
    hair: (c, cx, hy, hr) => { rr(c, cx - hr + 4, hy - hr - 16, hr * 2 - 8, 42, 18); fillStroke(c, '#f4b23a', 5); },
  },
  guard: {
    skin: '#a8714c', body: '#3f5fa8', bodyW: 116, bodyH: 200,
    hair: (c, cx, hy, hr) => { rr(c, cx - hr + 4, hy - hr - 16, hr * 2 - 8, 42, 18); fillStroke(c, '#d8263a', 5); },
    prop: (c, cx, y) => { line(c, [[cx + 86, y - 160], [cx + 86, y + 270]], 7, '#6b4a2a'); c.beginPath(); c.moveTo(cx + 86, y - 200); c.lineTo(cx + 74, y - 160); c.lineTo(cx + 98, y - 160); c.closePath(); fillStroke(c, '#c9ccd4', 4); },
  },
  kidKrishna: kid('#4f86d9', '#ffcf3a', '#1d1a24', {
    bodyDeco: (c, cx, y, w, h) => { c.fillStyle = '#e8462c'; c.fillRect(cx - w / 2, y + h * 0.45, w, 16); goldDots(c, cx, y + 4, 7, 6, '#ffffff'); },
    top: (c, cx, hy, hr) => { rr(c, cx - 44, hy - hr - 10, 88, 26, 10); fillStroke(c, '#ffd23a', 5); c.save(); c.translate(cx + 24, hy - hr - 4); c.rotate(0.35); line(c, [[0, 0], [0, -56]], 4, '#c9a227'); c.beginPath(); c.ellipse(0, -68, 17, 24, 0, 0, Math.PI * 2); fillStroke(c, '#2e9d5a', 4); c.beginPath(); c.ellipse(0, -64, 10, 13, 0, 0, Math.PI * 2); c.fillStyle = '#e3b02a'; c.fill(); c.beginPath(); c.ellipse(0, -62, 6, 8, 0, 0, Math.PI * 2); c.fillStyle = '#1e5aa8'; c.fill(); c.restore();
      line(c, [[cx - 9, hy - 48], [cx - 8, hy - 28], [cx, hy - 22], [cx + 8, hy - 28], [cx + 9, hy - 48]], 4, '#ffffff'); line(c, [[cx, hy - 46], [cx, hy - 28]], 3.5, '#e0213a'); },
  }),
  kid1: kid('#c98a5e', '#3fae4a'), kid2: kid('#8f5a3a', '#f08a2c', '#3a2a1a'), kid3: kid('#e0a57c', '#e85a8a'), kid4: kid('#a8714c', '#8a6ad8'),
  gopi1: { skin: '#d99a72', body: '#f06aa0', bodyW: 122, bodyH: 205, handsSkin: true, hairBack: (c, cx, hy, hr) => { circ(c, cx + hr - 6, hy - 20, 26); fillStroke(c, '#1d1a24', 5); }, hair: hairCap('#1d1a24'), bodyDeco: (c, cx, y, w, h) => { c.fillStyle = '#ffd23a'; c.fillRect(cx - w / 2, y + h - 22, w, 14); }, top: (c, cx, hy) => { circ(c, cx, hy - 40, 5); c.fillStyle = '#d8263a'; c.fill(); } },
  gopi2: { skin: '#c98a5e', body: '#3f8fe0', bodyW: 122, bodyH: 205, handsSkin: true, hairBack: (c, cx, hy, hr) => { circ(c, cx - hr + 6, hy - 20, 26); fillStroke(c, '#1d1a24', 5); }, hair: hairCap('#1d1a24'), bodyDeco: (c, cx, y, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(cx - w / 2, y + h - 22, w, 14); }, top: (c, cx, hy) => { circ(c, cx, hy - 40, 5); c.fillStyle = '#d8263a'; c.fill(); } },
  gopi3: { skin: '#e2a27a', body: '#ffcf3a', bodyW: 122, bodyH: 205, handsSkin: true, hairBack: (c, cx, hy, hr) => { circ(c, cx, hy - hr + 2, 28); fillStroke(c, '#1d1a24', 5); }, hair: hairCap('#1d1a24'), bodyDeco: (c, cx, y, w, h) => { c.fillStyle = '#d8263a'; c.fillRect(cx - w / 2, y + h - 22, w, 14); }, top: (c, cx, hy) => { circ(c, cx, hy - 40, 5); c.fillStyle = '#d8263a'; c.fill(); } },
  yashoda: { skin: '#d99a72', body: '#2f9d5a', bodyW: 150, bodyH: 210, handsSkin: true, hairBack: (c, cx, hy, hr) => { circ(c, cx, hy - hr + 4, 34); fillStroke(c, '#1d1a24', 6); for (let i = 0; i < 6; i++) { circ(c, cx - 26 + i * 10, hy - hr - 18 + Math.abs(i - 2.5) * 3, 6); fillStroke(c, '#ffffff', 2); } }, hair: hairCap('#1d1a24'), bodyDeco: (c, cx, y, w, h) => { c.fillStyle = '#f08a2c'; c.save(); c.translate(cx, y + h * 0.5); c.rotate(-0.6); c.fillRect(-w, -10, w * 2, 20); c.restore(); c.fillStyle = '#f08a2c'; c.fillRect(cx - w / 2, y + h - 22, w, 14); }, top: (c, cx, hy) => { circ(c, cx, hy - 40, 6); c.fillStyle = '#d8263a'; c.fill(); circ(c, cx + 12, hy + 12, 5); fillStroke(c, '#ffd23a', 2); } },
  govinda: { skin: '#a8714c', body: '#f08a2c', bodyW: 130, bodyH: 200, handsSkin: true, hair: (c, cx, hy, hr) => { hairCap('#1d1a24')(c, cx, hy, hr); rr(c, cx - hr, hy - hr * 0.55, hr * 2, 18, 8); fillStroke(c, '#d8263a', 4); }, bodyDeco: (c, cx, y, w) => { c.fillStyle = '#ffffff'; c.fillRect(cx - w / 2, y + 50, w, 10); } },
  crowd: { skin: '#c98a5e', body: '#e8e4dc', bodyW: 120, bodyH: 190, handsSkin: true, hair: hairCap('#1d1a24') },
  devotee: {
    skin: '#a8714c', body: '#f6f1e2', bodyW: 150, bodyH: 190,
    bodyDeco: (c, cx, y, w) => { c.fillStyle = '#d9a441'; c.fillRect(cx - w / 2, y + 150, w, 12); },
    hair: (c, cx, hy, hr) => { c.beginPath(); c.arc(cx, hy, hr, Math.PI * 1.15, Math.PI * 1.85); c.lineWidth = 14; c.strokeStyle = '#1d1a24'; c.stroke(); },
    top: (c, cx, hy) => { for (let i = 0; i < 3; i++) line(c, [[cx - 24, hy - 42 + i * 7], [cx + 24, hy - 42 + i * 7]], 3, '#ffffff'); circ(c, cx, hy - 34, 4); c.fillStyle = '#e0213a'; c.fill(); },
  },
};
