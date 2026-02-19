function setup() {
  let canvas = createCanvas(600, 600);
  canvas.parent('sketch-container');
  noLoop();
  angleMode(DEGREES);
}

function draw() {
  // Rinpa Gold Background with "Paper" Texture
  background(218, 165, 32); // Goldenrod base
  
  // Add noise for gold leaf texture
  loadPixels();
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (random(1) < 0.2) {
        let index = (x + y * width) * 4;
        let c = color(230, 190, 60); // Lighter gold highlight
        pixels[index] = red(c);
        pixels[index + 1] = green(c);
        pixels[index + 2] = blue(c);
        pixels[index + 3] = 255;
      }
    }
  }
  updatePixels();

  // Color Palette
  const indigo = color(20, 30, 60);
  const verdigris = color(60, 120, 100);
  const ochre = color(180, 100, 40);
  const white = color(240, 240, 235);

  // Composition: Asymmetrical balance
  // Large bold shape (The Mountain / The Wave)
  noStroke();
  fill(indigo);
  beginShape();
  vertex(0, height);
  vertex(width * 0.8, height);
  vertex(width * 0.4, height * 0.4);
  vertex(0, height * 0.6);
  endShape(CLOSE);

  // Geometric "Flowers" (Circles in Verdigris)
  fill(verdigris);
  let circleCount = 5;
  for(let i=0; i<circleCount; i++) {
    let x = width * 0.6 + random(-50, 50);
    let y = height * 0.3 + (i * 60) + random(-20, 20);
    let r = random(40, 80);
    ellipse(x, y, r, r);
  }

  // The "River" (Ochre rectangle, strictly vertical)
  fill(ochre);
  rect(width * 0.75, 0, 40, height);

  // Modernist interjection: A pure white thin line
  stroke(white);
  strokeWeight(2);
  line(0, height * 0.4, width, height * 0.4);
}
