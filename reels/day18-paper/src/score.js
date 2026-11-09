  // =====================================================================
  //  SCORE — thin and low while the pot is empty, near-silence after her prayer, the loudest hit on "He came",
  //  a rising-fifth flute motif for the leaf, a pluck on each gift, the pad resolving at the end.
  // =====================================================================
  const TL = TIMELINE, c = TL.cues, TM = { hut: ERA_LIST[1][0], pray: ERA_LIST[2][0], came: ERA_LIST[3][0], leaf: ERA_LIST[4][0], full: ERA_LIST[5][0], gita: ERA_LIST[6][0], end: ERA_LIST[7][0] };
  to = 'm';
  drone(0.0, TM.pray + 1.2, nz('D2'), 0.05);
  pad(0.0, TM.pray, ['D3', 'A3', 'F4'], 0.03, { type: 'triangle', cut: 700, att: 0.6, rel: 0.4 });
  [0.4, TM.hut, c.sages, c.door].forEach((t, i) => pluck(t, nz(['D3', 'F3', 'A3', 'C4'][i]), 0.12, 0, 0.9, 1400, 0.3));
  pad(TM.pray, TM.came - 0.55, ['D3', 'F3', 'A3'], 0.022, { cut: 600, att: 0.2, rel: 0.15 });           // thins, then stops before the slam
  // the payoff: a short stab + sub, then a flat warm chord
  pluck(TM.came, nz('D4'), 0.5, -0.2, 0.4, 3200, 0.2); pluck(TM.came, nz('A4'), 0.45, 0.2, 0.4, 3200, 0.2); pluck(TM.came, nz('Fs4'), 0.4, 0, 0.4, 3200, 0.2);
  sub(TM.came, 0.9);
  chime(TM.came + 0.02, [nz('D5'), nz('A5'), nz('D6')], 0.12);
  pad(TM.came + 0.3, TM.full, ['D3', 'A3', 'Fs4'], 0.03, { cut: 1300, att: 0.4, rel: 0.4, send: 0.4 });
  [['A4', 0], ['E5', E8]].forEach(([n, dt], i) => pluck(TM.leaf + 0.6 + dt, nz(n), 0.18, i ? 0.2 : -0.2, 0.7, 2600, 0.35));   // the leaf: a rising fifth
  pluck(c.ate, nz('A5'), 0.12, 0, 0.6, 3600, 0.4);
  pad(TM.full, TM.gita + 0.2, ['G3', 'D4', 'B4'], 0.035, { cut: 1600, att: 0.2, rel: 0.4, send: 0.4 });
  for (let i = 0; i < 5; i++) pluck(c.full + i * E16 * 1.5, nz(['D5', 'Fs5', 'A5', 'B5', 'D6'][i]), 0.07, 0.3 - i * 0.15, 0.4, 4200, 0.3);
  pad(TM.gita, TM.end + 0.2, ['D3', 'A3', 'D4', 'Fs4'], 0.035, { cut: 1400, att: 0.5, rel: 0.4, send: 0.45 });
  [c.leaf, c.flower, c.fruit, c.water].forEach((t, i) => pluck(t, nz(['A4', 'B4', 'D5', 'E5'][i]), 0.13, i % 2 ? 0.25 : -0.25, 0.6, 3000, 0.35));
  pad(TM.end, DURATION + 0.4, ['D3', 'A3', 'Fs4', 'A4'], 0.016, { cut: 1100, att: 0.8, rel: 1.4, send: 0.5 });
  [['D4', 0], ['A4', E8], ['D5', BEAT]].forEach(([n, dt]) => pluck(c.enough + dt, nz(n), 0.1, 0, 0.9, 2400, 0.4));
  to = 's';
  sweep(TM.came - 0.25, TM.came + 0.02, 0.012, 400, 3000, 0);
  noiseHit(TM.leaf, 0.12, 'bandpass', 2400, 2, 0.05, 0.2);
  noiseHit(c.ate, 0.08, 'bandpass', 3200, 3, 0.04, 0);
