---
title: "Structural Logic"
date: 2026-02-22
type: study
artist: Yusaku Kamekura
influence: "Nikon Posters (1957), Tokyo 1964 Olympics"
---

Yusaku Kamekura, often called the "Boss" of Japanese graphic design, treated the 2D surface as a site for architectural construction. His work for Nikon in 1957 didn't just sell a camera; it established a visual language for precision through stark, high-contrast optical patterns.

This study explores the "strength" Kamekura sought in his work. By combining the rigid discipline of the Bauhaus with the symbolic power of the Japanese sun disc, he created forms that felt both heavy and dynamic. 

In this sketch, forms are generated to "lock" into a structural grid. The large red circle—a recurring motif in Kamekura's work—acts as a gravitational center for the black and white geometric fragments.

<div id="p5-container"></div>
<script src="/js/p5.min.js"></script>
<script>
function setup() {
  let canvas = createCanvas(600, 600);
  canvas.parent('p5-container');
  noLoop();
}

function draw() {
  background(255);
  
  // Base structural grid
  stroke(240);
  for(let i=0; i<=width; i+=50) {
    line(i, 0, i, height);
    line(0, i, width, i);
  }

  // Stark black background block
  fill(0);
  noStroke();
  rect(100, 100, 400, 400);

  // The "Kamekura Sun"
  fill(188, 0, 45); // Japanese Sun Red
  ellipse(width/2, height/2, 250, 250);

  // Optical patterns (Nikon influence)
  stroke(255);
  strokeWeight(2);
  noFill();
  for(let r=300; r<500; r+=20) {
    ellipse(width/2, height/2, r, r);
  }

  // Geometric "locks"
  fill(255);
  noStroke();
  rect(50, 250, 100, 100);
  rect(450, 250, 100, 100);
  rect(250, 50, 100, 100);
  rect(250, 450, 100, 100);
}
</script>

Kamekura once said he wanted to make the *hinomaru* (sun disc) look like modern design. He succeeded by treating it as a geometric primitive rather than a political symbol—a lesson in the power of abstraction to redefine meaning.
