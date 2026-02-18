new p5(function(p) {
  var container = document.getElementById('sketch-a-quiet-corner');
  var W = 640;
  var H = 480;

  // Palette: Yoshimura's 'Green' album cover vibes
  // Deep forest greens, soft teals, warm yellows
  var palette = [
    [40, 60, 50],   // dark moss
    [60, 90, 75],   // forest
    [100, 140, 120],// sage
    [180, 200, 160],// light green
    [220, 215, 180],// pale yellow/sunlight
    [20, 35, 30]    // almost black green
  ];

  var particles = [];
  var flowField;
  var cols, rows;
  var scl = 20;
  var zoff = 0;

  p.setup = function() {
    var canvas = p.createCanvas(W, H);
    if (container) {
      canvas.parent(container);
    }
    p.background(240, 242, 235); // warm off-white paper
    p.noStroke();

    cols = p.floor(W / scl);
    rows = p.floor(H / scl);

    for (var i = 0; i < 200; i++) {
      particles.push(new Particle());
    }
  };

  p.draw = function() {
    // Very slow fade for trails
    // p.background(240, 242, 235, 2); 
    // Actually, let's not clear. Let it accumulate like moss.
    
    // Only occasionally fade slightly to prevent total saturation
    if (p.frameCount % 60 === 0) {
      p.fill(240, 242, 235, 5);
      p.rect(0, 0, W, H);
    }

    var yoff = 0;
    for (var y = 0; y < rows; y++) {
      var xoff = 0;
      for (var x = 0; x < cols; x++) {
        var index = x + y * cols;
        var angle = p.noise(xoff, yoff, zoff) * p.TWO_PI * 2;
        var v = p5.Vector.fromAngle(angle);
        v.setMag(0.5); // Very gentle force
        // flowField[index] = v; // We'll just calculate on the fly for particles
        xoff += 0.1;
      }
      yoff += 0.1;
    }
    zoff += 0.002; // Slow evolution of the field

    for (var i = 0; i < particles.length; i++) {
      particles[i].follow(cols, rows, scl, zoff);
      particles[i].update();
      particles[i].show();
      particles[i].edges();
    }
  };

  function Particle() {
    this.pos = p.createVector(p.random(W), p.random(H));
    this.vel = p.createVector(0, 0);
    this.acc = p.createVector(0, 0);
    this.maxSpeed = p.random(0.2, 0.8);
    
    var colIdx = p.floor(p.random(palette.length));
    this.col = palette[colIdx];
    this.alpha = p.random(5, 20); // Very transparent
    this.size = p.random(2, 8);

    this.prevPos = this.pos.copy();

    this.update = function() {
      this.vel.add(this.acc);
      this.vel.limit(this.maxSpeed);
      this.pos.add(this.vel);
      this.acc.mult(0);
    };

    this.follow = function(cols, rows, scl, zoff) {
      var x = p.floor(this.pos.x / scl);
      var y = p.floor(this.pos.y / scl);
      
      // Calculate flow field vector at this position
      var xoff = x * 0.1;
      var yoff = y * 0.1;
      var angle = p.noise(xoff, yoff, zoff) * p.TWO_PI * 2;
      var force = p5.Vector.fromAngle(angle);
      force.mult(0.1); // Low force
      this.applyForce(force);
    };

    this.applyForce = function(force) {
      this.acc.add(force);
    };

    this.show = function() {
      p.fill(this.col[0], this.col[1], this.col[2], this.alpha);
      p.noStroke();
      p.ellipse(this.pos.x, this.pos.y, this.size);
    };

    this.edges = function() {
      if (this.pos.x > W) { this.pos.x = 0; this.prevPos = this.pos.copy(); }
      if (this.pos.x < 0) { this.pos.x = W; this.prevPos = this.pos.copy(); }
      if (this.pos.y > H) { this.pos.y = 0; this.prevPos = this.pos.copy(); }
      if (this.pos.y < 0) { this.pos.y = H; this.prevPos = this.pos.copy(); }
    };
  }
});
