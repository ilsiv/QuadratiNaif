function Particle(x, y, n) {
  this.pos = createVector(x, y);
  this.posnext = createVector();
  this.vel = createVector(int(random(0, 3)), int(random(0, 3)));
  this.acc = createVector(int(random(0, 3)), int(random(0, 3)));
  this.Raggio = floor(random(MINRAGGIO, MAXRAGGIO));
  this.m = this.Raggio;
  this.num = n;
  this.COR = 1.00; //coefficient of restitution COR = Vel aftercollision/ vel before collision
  this.AIR = createVector(0.0, random(-0.015, 0));

  this.show = function() {
    // noFill();
    push();
    if (this.num % 2 == 0) {
      stroke(0, 0, 255, 100);
      fill(255, 255, 200);
    } else {
      stroke(130, 130, 255, 100);
      fill(255, 0, 255);
    }
    strokeWeight(1);
    stroke(255, 255, 255);
    ellipse(this.pos.x, this.pos.y, this.Raggio * 2, this.Raggio * 2);
    pop();

    // push();
    // stroke(0, 240, 0);
    // strokeWeight(2);
    // translate(this.pos.x, this.pos.y);
    // line(0, 0, this.vel.x * 10, this.vel.y * 10);
    // // text('' +this.n);
    // pop();

    // push();
    // stroke(255, 255, 0);
    // strokeWeight(10);
    // fill(255, 255, 0);
    // line(0, canvas.heigth / 2, canvas.width, canvas.heigth / 2);
    // pop();
  }

  this.checkBorders = function() {

    if (this.pos.y >= (canvas.height - this.Raggio - SPAN)) {
      this.vel.y *= -this.COR;
      this.pos.y = (canvas.height - this.Raggio - SPAN);
    }

    if (this.pos.y <= (this.Raggio + SPAN)) {
      this.vel.y *= -this.COR;
      this.pos.y = (this.Raggio + SPAN);
    }

    if (this.pos.x <= (this.Raggio + SPAN)) {
      this.vel.x *= -this.COR;
      this.pos.x = (this.Raggio + SPAN);
    }
  }


  this.checkObstacles = function() {
    let prox = createVector();
    prox = this.pos.copy();
    let nextvel = this.vel.copy();
    nextvel.add(this.acc);
    nextvel.add(this.AIR);
    prox.add(this.vel);

    for (let i = 0; i < obstacles.length; i++) {
      if ((prox.y + this.Raggio + SPAN >= obstacles[i].y) &&
        (prox.y - this.Raggio - SPAN <= obstacles[i].y + obstacles[i].h) &&
        (prox.x + this.Raggio + SPAN >= obstacles[i].x) &&
        (prox.x - this.Raggio - SPAN <= obstacles[i].x + obstacles[i].w)) {
        if ((prox.y + this.Raggio + SPAN - obstacles[i].y <= 10)) {
          this.vel.y *= -this.COR;
          this.pos.y -= SPAN;
        } else if ((prox.x + this.Raggio + SPAN - obstacles[i].x <= 10)) {
          this.vel.x *= -this.COR;
          this.pos.x -= SPAN;
        } else if ((prox.y - this.Raggio - SPAN - (obstacles[i].y + obstacles[i].h) >= -10)) {
          this.vel.y *= -this.COR;
          this.pos.y += SPAN;
        } else if ((prox.x - this.Raggio - SPAN - (obstacles[i].x + obstacles[i].w) >= -10)) {
          this.pos.x += SPAN;
          this.vel.x *= -this.COR;
        }
      }
    }

  }


  this.update = function() {

    this.checkBorders();
    this.checkObstacles();
    // for (let i = 0; i < obstacles.length; i++) {
    //   obstacles[i].checkObstacles();
    // }

    // cicla per verificare che la particella non collida con le altre
    for (let i = 0; i < particles.length; i++) {
      let other = particles[i];
      if (this != other) {
        this.collision(other);
      }
    }
    this.vel.add(this.acc);
    this.vel.add(this.AIR);
    this.vel.limit(SPAN);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  this.offScreen = function() {
    let prox = createVector();
    prox = this.pos.copy();
    prox.add(this.vel);
    if (((this.x - this.Raggio) <= 0) || ((this.pos.x - this.Raggio) >= canvas.width)) {
      return true;
    }
    for (let i = 0; i < obstacles.length; i++) {
      if ((prox.y >= obstacles[i].y) &&
        (prox.y <= obstacles[i].y + obstacles[i].h) &&
        (prox.x >= obstacles[i].x) &&
        (prox.x <= obstacles[i].x + obstacles[i].w)) {
        return true;
      }
    }
    return false;
  }

  this.applyforce = function(force) {
    let f = force.copy();
    this.acc.add(f);
  }

  this.applyforcemap = function() {
    if (this.pos.x >= 0 && this.pos.y >= 0 && this.pos.x <= canvas.width && this.pos.y <= canvas.height) {
      let x = floor(this.pos.x / WINDDIMENSION);
      let y = floor(this.pos.y / WINDDIMENSION);
      this.applyforce(windmap[x][y]);
    }
  }

  this.rotateVelocities = function(velocity, theta) {
    const rotatedVelocity = {
      x: velocity.x * Math.cos(theta) - velocity.y * Math.sin(theta),
      y: velocity.x * Math.sin(theta) + velocity.y * Math.cos(theta)
    };
    return rotatedVelocity;
  }

  this.collision = function(target) {

    if (this.pos.dist(target.pos) - (this.Raggio + target.Raggio) <= SPAN) {

      // preso da codepen.io
      //https://codepen.io/silvio_news/pen/LXwdKr
      let res = createVector();
      res.x = this.vel.x - target.vel.x;
      res.y = this.vel.y - target.vel.y;

      if (res.x * ((target.pos.x + 2 * target.vel.x) - (this.pos.x + 2 * this.vel.x)) + res.y * ((target.pos.y + 2 * target.vel.y) - (this.pos.y + 2 * this.vel.y)) > SPAN) {
        const m1 = this.m;
        const m2 = target.m;
        const theta = -Math.atan2(target.pos.y - this.pos.y, target.pos.x - this.pos.x);

        const rotatedVelocity1 = this.rotateVelocities(this.vel, theta);
        const rotatedVelocity2 = this.rotateVelocities(target.vel, theta);

        const swapVelocity1 = {
          x: rotatedVelocity1.x * (m1 - m2) / (m1 + m2) + rotatedVelocity2.x * 2 * m2 / (m1 + m2),
          y: rotatedVelocity1.y
        };
        const swapVelocity2 = {
          x: rotatedVelocity2.x * (m1 - m2) / (m1 + m2) + rotatedVelocity1.x * 2 * m1 / (m1 + m2),
          y: rotatedVelocity2.y
        };

        const u1 = this.rotateVelocities(swapVelocity1, -theta);
        const u2 = this.rotateVelocities(swapVelocity2, -theta);

        this.vel.x = u1.x * this.COR;
        this.vel.y = u1.y * this.COR;
        target.vel.x = u2.x * this.COR;
        target.vel.y = u2.y * this.COR;

        this.acc.x = 0;
        this.acc.y = 0;
        // target.acc.x = 0;
        // target.acc.x = 0;

        // //1
        // let un = p5.Vector.sub(target.pos, this.pos);
        // un.normalize();
        // let ut = createVector(-un.y, un.x);
        // //2
        // //3
        // let v1n = un.dot(this.vel);
        // let v1t = ut.dot(this.vel);
        // let v2n = un.dot(target.vel);
        // let v2t = ut.dot(target.vel);
        // //4
        // //5
        // // v1n = (v1n * (this.m - target.m) + (2 * target.m * v2n)) / (this.m + target.m);
        // // v2n = (v2n * (target.m - this.m) + (2 * this.m * v1n)) / (this.m + target.m);
        // let v1np=v2n;
        // let v2np=v1n;
        // let v1tp = v2t;
        // let v2tp=v1t;
        // //6
        // let v1nv = un.mult(v1np);
        // let v1tv = ut.mult(v1tp);
        // let v2nv = un.mult(v2np);
        // let v2tv = ut.mult(v2tp);
        // //7
        // this.vel = v1nv.add(v1tv);
        // target.vel = v2nv.add(v2tv);
        // this.acc.mult(0);
        // target.acc.mult(0);

      }
      return true;
    }
  }
  return false;
}

function Obstacle(x, y, w, h) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;

  this.show = function() {
    if (DEBUG) {
      push();
      fill(0, 240, 0, 140);
      stroke(0, 255, 0);
      strokeWeight(3);
      rect(this.x, this.y, this.w, this.h);
      pop();
    }
  }


  // this.checkObstacles = function() {
  //   let prox;
  //   let nextvel;
  //   for (let i = 0; i < particles.length; i++) {
  //     prox = particles[i].pos.copy();
  //     nextvel = particles[i].vel.copy();
  //     nextvel.add(particles[i].acc);
  //     nextvel.add(particles[i].AIR);
  //     prox.add(particles[i].vel);
  //
  //     if ((prox.y + particles[i].Raggio + SPAN >= this.y) &&
  //       (prox.y - particles[i].Raggio - SPAN <= this.y + this.h) &&
  //       (prox.x + particles[i].Raggio + SPAN >= this.x) &&
  //       (prox.x - particles[i].Raggio - SPAN <= this.x + this.w)) {
  //       if ((prox.y + particles[i].Raggio + SPAN - this.y <= 10)) {
  //         particles[i].vel.y *= -particles[i].COR;
  //         particles[i].pos.y -= SPAN;
  //       } else if ((prox.x + particles[i].Raggio + SPAN - this.x <= 10)) {
  //         particles[i].vel.x *= -particles[i].COR;
  //         particles[i].pos.x -= SPAN;
  //       } else if ((prox.y - particles[i].Raggio - SPAN - (this.y + this.h) >= -10)) {
  //         particles[i].vel.y *= -particles[i].COR;
  //         particles[i].pos.y += SPAN;
  //       } else if ((prox.x - particles[i].Raggio - SPAN - (this.x + this.w) >= -10)) {
  //         particles[i].pos.x += SPAN;
  //         particles[i].vel.x *= -particles[i].COR;
  //       }
  //     }
  //   }
  // }

}
