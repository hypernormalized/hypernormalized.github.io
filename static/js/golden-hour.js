new p5(function(p) {
  let container = document.getElementById('sketch-golden-hour');
  let W = 600;
  let H = 600;

  p.setup = function() {
    let canvas = p.createCanvas(W, H);
    if (container) {
      canvas.parent(container);
    }
    p.noLoop();
    p.angleMode(p.DEGREES);
  };

  p.draw = function() {
    // Rinpa Gold Background with "Paper" Texture
    p.background(218, 165, 32); // Goldenrod base
    
    // Add noise for gold leaf texture
    p.loadPixels();
    for (let x = 0; x < W; x++) {
      for (let y = 0; y < H; y++) {
        if (p.random(1) < 0.2) {
          let index = (x + y * W) * 4;
          // Note: p.color in instance mode returns a color object
          // but pixel access is faster using direct values
          p.pixels[index] = 230;     // R
          p.pixels[index + 1] = 190; // G
          p.pixels[index + 2] = 60;  // B
          p.pixels[index + 3] = 255; // A
        }
      }
    }
    p.updatePixels();

    // Color Palette
    const indigo = p.color(20, 30, 60);
    const verdigris = p.color(60, 120, 100);
    const ochre = p.color(180, 100, 40);
    const white = p.color(240, 240, 235);

    // Composition: Asymmetrical balance
    // Large bold shape (The Mountain / The Wave)
    p.noStroke();
    p.fill(indigo);
    p.beginShape();
    p.vertex(0, H);
    p.vertex(W * 0.8, H);
    p.vertex(W * 0.4, H * 0.4);
    p.vertex(0, H * 0.6);
    p.endShape(p.CLOSE);

    // Geometric "Flowers" (Circles in Verdigris)
    p.fill(verdigris);
    let circleCount = 5;
    for(let i=0; i<circleCount; i++) {
      let x = W * 0.6 + p.random(-50, 50);
      let y = H * 0.3 + (i * 60) + p.random(-20, 20);
      let r = p.random(40, 80);
      p.ellipse(x, y, r, r);
    }

    // The "River" (Ochre rectangle, strictly vertical)
    p.fill(ochre);
    p.rect(W * 0.75, 0, 40, H);

    // Modernist interjection: A pure white thin line
    p.stroke(white);
    p.strokeWeight(2);
    p.line(0, H * 0.4, W, H * 0.4);
  };
});
