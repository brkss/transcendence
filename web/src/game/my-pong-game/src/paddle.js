

class Paddle {
  constructor(isLeft, p5, height, width) {
    this.y = height / 2;
    this.w = 20;
    this.h = 100;
    this.ychange = 0;
    this.p5 = p5;
    this.canvasHeight = height; // Store the canvas height

    if (isLeft) {
      this.x = this.w;
    } else {
      this.x = width - this.w;
    }
  }

  update() {
    this.y += this.ychange;
    this.y = this.p5.constrain(this.y, this.h / 2, this.canvasHeight - this.h / 2); // Use canvasHeight
  }

  move(steps) {
    this.ychange = steps;
  }

  show() {
    this.p5.fill(255);
    this.p5.rectMode(this.p5.CENTER);
    this.p5.rect(this.x, this.y, this.w, this.h);
  }
}

export default Paddle;
