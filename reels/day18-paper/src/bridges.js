// =====================================================================
//  ERAS, CAMERAS, BRIDGES — a character story: hard cuts on the voice, no morphs (craft.md -> Transitions)
// =====================================================================
const ERA_BG = ['#8e3355', '#c48a55', '#6e4530', '#ffe7a6', '#b9773f', '#f2a84a', '#2f4f8a', '#4a2456'];
function pieceCam(era, t) {
  const [a, b] = ERA_LIST[era];
  const k = ERA_KEYS[era];
  if (k === 'hook') return push(t, a, b + 0.4, { z: 1.12, p: [700, 1150], to: [640, 1080] });          // drift toward the hut
  if (k === 'pray') return push(t, a, b + 0.3, { z: 1.12, p: [560, 960], to: [540, 900] });            // close in on her prayer
  if (k === 'gita') return push(t, a, b + 0.6, { z: 1.08, p: [540, 1000], to: [540, 980] });           // slow push on Him
  if (k === 'end') return push(t, a, b, { z: 1.0001, p: [540, 960], to: [540, 960] });
  return null;
}
const BRIDGES = [];
