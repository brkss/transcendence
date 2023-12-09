class Particle {
  constructor(x, y, p5, socket) {
    this.socket = socket;
    this.x = x;
    this.y = y;
    this.p5 = p5;
    this.lifespan = 255;
    this.vel = p5.createVector(p5.random(-1, 1), p5.random(-1, 1));
    this.acc = p5.createVector(0, 0.05);
  }

  update() {
    this.vel.add(this.acc);
    this.x += this.vel.x;
    this.y += this.vel.y;
    this.lifespan -= 2;
  }

  show() {
    this.p5.noStroke();
    this.p5.fill(255, this.lifespan);
    this.p5.ellipse(this.x, this.y, 8, 8);
  }

  isDead() {
    return this.lifespan <= 0;
  }
}

function radians(degrees) {
  return degrees * (Math.PI / 180);
}

export class Puck {
  constructor(
    canvasWidth,
    canvasHeight,
    p5,
    sound,
    servingPlayer,
    socket,
    isHost
  ) {
    this.r = 12;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.p5 = p5;
    this.isGameOver = false;
    this.sound = new Audio(sound);
    this.servingPlayer = servingPlayer;
    this.particles = [];
    this.reset(isHost);
    this.socket = socket;
    console.log("isHost:", this.x, isHost);
    this.isHost = isHost;
    if (isHost) {
      socket.emit("initPuck", {
        x: this.x,
        y: this.y,
        servingPlayer: this.servingPlayer,
      });
    } else {
      socket.on("initPuck", (data) => {
        this.x = data.x;
        this.y = data.y;
        this.servingPlayer = data.servingPlayer;
      });
    }
  }

  checkPaddleLeft(p) {
    if (
      this.y - this.r < p.y + p.h / 2 &&
      this.y + this.r > p.y - p.h / 2 &&
      this.x - this.r < p.x + p.w / 2
    ) {
      if (this.x > p.x) {
        let diff = this.y - (p.y - p.h / 2);
        let rad = radians(45);
        let angle = this.p5.map(diff, 0, p.h, -rad, rad);
        this.xspeed = 5 * Math.cos(angle);
        this.yspeed = 5 * Math.sin(angle);
        this.x = p.x + p.w / 2 + this.r;
      }
    }
  }
  
  checkPaddleRight(p) {
    if (
      this.y - this.r < p.y + p.h / 2 &&
      this.y + this.r > p.y - p.h / 2 &&
      this.x + this.r > p.x - p.w / 2
    ) {
      if (this.x < p.x) {
        let diff = this.y - (p.y - p.h / 2);
        let angle = this.p5.map(diff, 0, p.h, radians(225), radians(135));
        this.xspeed = 5 * Math.cos(angle);
        this.yspeed = 5 * Math.sin(angle);
        this.x = p.x - p.w / 2 - this.r;
      }
    }
  }

  update() {
    if (this.isHost) {
      this.x += this.xspeed;
      this.y += this.yspeed;

      this.socket.emit("initPuck", {
        x: this.x,
        y: this.y,
        servingPlayer: this.servingPlayer,
      });
    }

    for (let i = 0; i < 1; i++) {
      this.particles.push(new Particle(this.x, this.y, this.p5));
    }
  }

  showParticles() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      particle.update();
      particle.show();
      if (particle.isDead()) {
        this.particles.splice(i, 1);
      }
    }
  }

  reset(serving) {
    this.x = this.canvasWidth / 2;
    this.y = this.canvasHeight / 2;
    console.log(this.servingPlayer);
    if (this.servingPlayer === "left") {
      this.xspeed = 5; // Serve to the left
    } else {
      this.xspeed = -5; // Serve to the right
    }
    this.yspeed = Math.random() < 5 ? -5 : 5;
    if (this.isHost) {
      this.socket.emit("initPuck", {
        x: this.x,
        y: this.y,
        servingPlayer: this.servingPlayer,
      });
    }
  }

  getServingPlayer() {
    return this.servingPlayer;
  }

  edges(serving) {
    if (this.isGameOver === false) {
      if (this.y < 0 || this.y > this.canvasHeight) {
        this.yspeed *= -1;
      }

      if (this.x - this.r > this.canvasWidth) {
        this.servingPlayer = "left";
        this.reset(serving); // Player who was scored against serves the ball
        this.sound.play();
        return true;
      }

      if (this.x + this.r < 0) {
        this.servingPlayer = "right";
        this.reset(serving); // Player who was scored against serves the ball
        this.sound.play();
        return true;
      }
    }
  }

  show() {
    if (this.isGameOver) return;
    this.p5.fill(255);
    this.p5.ellipse(this.x, this.y, this.r * 2);
    this.showParticles();
  }
  destroy() {
    this.isGameOver = true;
  }
}
``