new p5(function (p) {
  var container = document.getElementById('sketch-nine-post-cards');
  var seed;
  var elements = [];
  var W = 640;
  var H = 480;

  // Palette
  var bg = [247, 244, 240];       // warm off-white
  var grays = [
    [220, 216, 210],
    [205, 200, 193],
    [190, 185, 178],
    [230, 226, 220],
  ];
  var accent = [188, 120, 90, 40]; // muted ochre-red, very transparent

  function makeElement(i) {
    var isAccent = p.random() < 0.12;
    var col = isAccent ? accent : grays[p.floor(p.random(grays.length))];
    var alpha = isAccent ? col[3] : p.random(15, 50);

    // Grid-aligned origin with drift
    var cols = p.floor(p.random(3, 7));
    var rows = p.floor(p.random(3, 6));
    var cellW = W / cols;
    var cellH = H / rows;
    var gx = p.floor(p.random(cols)) * cellW;
    var gy = p.floor(p.random(rows)) * cellH;

    var isCircle = p.random() < 0.3;

    return {
      x: gx + p.random(-20, 20),
      y: gy + p.random(-20, 20),
      w: p.random(cellW * 0.4, cellW * 1.2),
      h: p.random(cellH * 0.4, cellH * 1.2),
      col: col,
      alpha: alpha,
      phase: p.random(p.TWO_PI),
      speedX: p.random(0.0003, 0.0012) * (p.random() < 0.5 ? 1 : -1),
      speedY: p.random(0.0002, 0.0008) * (p.random() < 0.5 ? 1 : -1),
      driftX: p.random(8, 25),
      driftY: p.random(5, 18),
      alphaPhase: p.random(p.TWO_PI),
      alphaSpeed: p.random(0.0002, 0.0006),
      alphaRange: p.random(5, 15),
      circle: isCircle,
      cornerR: isCircle ? 0 : p.random(0, 6),
    };
  }

  p.setup = function () {
    seed = p.floor(p.random(999999));
    p.randomSeed(seed);
    p.noiseSeed(seed);

    var canvas = p.createCanvas(W, H);
    canvas.parent(container);
    p.frameRate(30);
    p.noStroke();

    var count = p.floor(p.random(8, 15));
    for (var i = 0; i < count; i++) {
      elements.push(makeElement(i));
    }
  };

  p.draw = function () {
    p.background(bg[0], bg[1], bg[2]);

    var t = p.frameCount;

    for (var i = 0; i < elements.length; i++) {
      var e = elements[i];
      var dx = p.sin(t * e.speedX + e.phase) * e.driftX;
      var dy = p.cos(t * e.speedY + e.phase * 0.7) * e.driftY;
      var da = p.sin(t * e.alphaSpeed + e.alphaPhase) * e.alphaRange;

      p.fill(e.col[0], e.col[1], e.col[2], e.alpha + da);

      var ex = e.x + dx;
      var ey = e.y + dy;

      if (e.circle) {
        var r = (e.w + e.h) * 0.25;
        p.ellipse(ex + e.w * 0.5, ey + e.h * 0.5, r * 2, r * 2);
      } else {
        p.rect(ex, ey, e.w, e.h, e.cornerR);
      }
    }
  };
});
