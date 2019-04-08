let series = [];

let palette = [];

let pal;

let canvas;

function setup() {

  canvas = createCanvas(600, 600);
  // var canvas = createCanvas(800, 600);
  // let q = new Quadrato(200, 200, 100, 144);
  // series.push(q);
  for (let i = 0; i < 7; i++) {
    pal = floor(random(0, palettes.length));
    let s = new Serie(random(100, canvas.width - 100), random(100, canvas.height - 100), random(20, 45), pal);
    series.push(s);
  }
  

  angleMode(DEGREES);

  for (let i = 0; i < series.length; i++) {
    series[i].generate();
  }

  noLoop();
  frameRate(1);
}

function draw() {
  background(240, 255, 250);
  for (let i = 0; i < series.length; i++) {
    series[i].show();
  }
  // filter(BLUR,1);
  strokeWeight(10);
  stroke(127, 127, 127, 50);
  noFill();
  rect(30, 30, canvas.width - 60, canvas.height - 60);
}

function mousePressed() {
  for (let j = 0; j < 1; j++) {
    series = [];
    setup();
    redraw();
    // save('canvas' + j + '.jpg');
    //console.log('canvas' + j + '.jpg');
  }
}


function Serie(x, y, angle, pal) {
  this.x = x;
  this.y = y;
  this.angle = angle;
  this.quadrati = [];
  this.directionx = round(random(0, 1)) - 0.5;
  this.directiony = round(random(0, 1)) - 0.5;
  this.dimension = random(200, canvas.width * 1);
  this.pal = pal;
  let c = '#' + palettes[pal].colors[floor(random(0, palettes[pal].colors.length))];
  // console.log(palettes[pal].name);
  // // console.log(palettes[pal].colors.length);
  // console.log(c);
  this.color = color(c);
  this.color._array[3] = 100 / 255;

  this.generate = function() {
    for (let i = 0; i < 7; i++) {
      this.quadrati.push(new Quadrato(this.x, this.y, this.dimension / pow(3, i) * pow(2, i), this.color));
    }
  }

  this.show = function() {
    push();
    for (let i = 0; i < this.quadrati.length; i++) {
      if (i == 0) {
        rotate(0);
        translate(this.x, this.y);
        scale(this.directionx, this.directiony);
      } else {
        // scale(-1,1);
        rotate(this.angle);
        translate(-this.quadrati[i].dim, 0);
      }
      this.quadrati[i].show();
    }
    pop();
  }
  // end function Serie
}

function Quadrato(x, y, dim, color) {

  this.x = x;
  this.y = y;
  this.dim = dim;
  this.color = color;

  this.show = function() {
    fill(this.color);
    // stroke(0,100);
    noStroke();
    strokeWeight(2);
    // ellipseMode(CORNER);
    // ellipse(0,0,this.dim);
	rect(0, 0, this.dim, this.dim);
  }
  //end function Quadrato
}
