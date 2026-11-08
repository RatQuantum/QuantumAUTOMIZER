/* Springs for HyperFrames reels: motion with mass (speeds up, overshoots a hair, settles), still a pure function of
   time, so any frame renders on its own (GSAP tweens are seekable).
   Load after gsap:  <script src="assets/gsap.min.js"></script><script src="assets/springs.js"></script>
   Use:  tl.to(el, { y: 0, duration: 0.6, ease: "spring-land" }, t)
   Each object class gets its own spring (do not make everything overshoot):
     spring-snap    small UI, chips, icons          ~2% overshoot
     spring-settle  panels, cards, bubbles          ~8% overshoot
     spring-land    headlines, titles               ~4% overshoot, fast
     spring-bounce  characters, mascots (on purpose) ~25% overshoot
     spring-glide   the camera                      no overshoot (critically damped)
   window.springTrack(keys, preset) gives a value that changes target several times without restarting:
     track(t) = v0 + sum((v_i - v_(i-1)) * spring((t - t_i) / dur_i))   with keys = [[t0, v0, dur], [t1, v1, dur], ...]
*/
(function () {
  function makeSpring(zeta, settle) {
    // underdamped (zeta < 1) or critically damped (zeta = 1) step response, normalised so it has settled by p = 1
    var w = settle / zeta;                 // natural frequency so that e^(-zeta*w) = e^(-settle)
    var wd = w * Math.sqrt(Math.max(1 - zeta * zeta, 1e-9));
    return function (p) {
      if (p <= 0) return 0;
      if (p >= 1) return 1;
      if (zeta >= 1) return 1 - Math.exp(-w * p) * (1 + w * p);
      var e = Math.exp(-zeta * w * p);
      return 1 - e * (Math.cos(wd * p) + (zeta * w / wd) * Math.sin(wd * p));
    };
  }
  var SPRINGS = {
    "spring-snap": makeSpring(0.78, 7.5),
    "spring-settle": makeSpring(0.62, 6.9),
    "spring-land": makeSpring(0.72, 8.5),
    "spring-bounce": makeSpring(0.40, 6.2),
    "spring-glide": makeSpring(1.0, 7.0),
  };
  if (window.gsap) {
    Object.keys(SPRINGS).forEach(function (name) { window.gsap.registerEase(name, SPRINGS[name]); });
  }
  window.SPRINGS = SPRINGS;
  window.springTrack = function (keys, preset) {
    var f = SPRINGS[preset || "spring-settle"];
    return function (t) {
      var v = keys[0][1];
      for (var i = 1; i < keys.length; i++) {
        var ti = keys[i][0], d = keys[i][2] || 0.6;
        if (t > ti) v += (keys[i][1] - keys[i - 1][1]) * f(Math.min((t - ti) / d, 1));
      }
      return v;
    };
  };
})();
