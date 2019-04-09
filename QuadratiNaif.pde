ArrayList<Serie> series;

boolean SAVE = false;
int NUM_SAVE = 1;

boolean PAPER_ON = false;

void setup() {
  int pal;
  size(3000, 2000);
  series = new ArrayList<Serie>();

  for (int i = 0; i < 7; i++) {
    pal = floor(random(0, palettes.length));
    Serie s = new Serie(random(100, width - 100), random(100, height - 100), random(radians(20), radians(45)), pal);
    series.add(s);
  }
  for (Serie s : series) {
    s.generate();
  }
}

void draw() {
  background(240, 255, 250);
  for (Serie s : series) {
    s.show();
  }

  strokeWeight(width/60);
  stroke(127, 127, 127, 50);
  noFill();
  rect( width/20, height/20, width - width/10, height - height/10);

  if (PAPER_ON) {
    push();
    paper(30);
    pop();
  }
  
  if (SAVE) {
    if (frameCount%NUM_SAVE == 0) {
      exit();
    }
    setup();
    saveFrame("canvas_#####_.jpg");
  }
}


void mousePressed() {
  for (int j = 0; j < 1; j++) {
    series = new ArrayList<Serie>();
    setup();
    redraw();
    saveFrame("canvas_#####_.jpg");
  }
}


void paper(int in_val) {
  noStroke();
  for (int i = 0; i<width-1; i+=(width/300)) {
    for (int j = 0; j<height-1; j+=(height/300)) {
      fill(random(85-10, 85+10), in_val);
      rect(i, j, width/300, height/300);
    }
  }

  for (int i = 0; i<width/20; i++) {
    fill(random(40, 60), random(in_val*2.5, in_val*3));
    rotate(random(TWO_PI));
    rect(random(0, width-2), random(0, height-2), random(1, width/300 + 1), random(1, height/300 +1));
  }
}

class Serie {
  float x, y;
  float angle;
  float directionx, directiony, dimension;
  ArrayList<Quadrato> quadrati;
  color c;
  int pal;

  Serie(float x_, float y_, float angle_, int pal_) {
    x= x_;
    y= y_;
    angle = angle_;
    pal = pal_;
    quadrati= new ArrayList<Quadrato>() ;
    directionx = round(random(0, 1)) - 0.5;
    directiony = round(random(0, 1)) - 0.5;
    dimension = random(200, width * 1);
    c = unhex("64" + palettes[pal][floor(random(1, palettes[pal].length))]);
  }

  void generate() {
    for (int i = 0; i < 7; i++) {
      quadrati.add(new Quadrato(x, y, dimension / pow(3, i) * pow(2, i), c));
    }
  }


  void show() {
    push();
    for (int i = 0; i < quadrati.size(); i++) {
      Quadrato q = quadrati.get(i);
      if (i == 0) {
        rotate(0);
        translate(x, y);
        scale(directionx, directiony);
      } else {
        // scale(-1,1);
        rotate(angle);
        translate(-q.dim, 0);
      }
      q.show();
    }
    pop();
  }
  // end class Serie
}

class Quadrato {
  float x, y, dim;
  color c;

  Quadrato(float x_, float y_, float dim_, color c_) {
    x = x_;
    y = y_;
    dim = dim_;
    c = c_;
  }
  void show() {
    fill(c);
    // stroke(0,100);
    noStroke();
    strokeWeight(2);
    rect(0, 0, dim, dim);
  }
  //end class Quadrato
}
