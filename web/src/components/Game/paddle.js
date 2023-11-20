// Import necessary libraries or classes if not already imported
// ...

class Paddle {
  constructor(isLeft, p5, height, width, isSecondaryModeOn) {
    this.y = height / 2;
    this.w = 20;
    this.h = 100;
    this.ychange = 0;
    this.p5 = p5;
    this.canvasHeight = height; // Store the canvas height
    this.isLeft = isLeft;
    this.color = this.p5.color(255); // Initial color
    this.isSecondaryModeOn = isSecondaryModeOn;

    if (isLeft) {
      this.x = this.w;
    } else {
      this.x = width - this.w;
    }
  }

  update() {
    this.y += this.ychange;
    this.y = this.p5.constrain(
      this.y,
      this.h / 2,
      this.canvasHeight - this.h / 2
    ); // Use canvasHeight
  }

  move(steps) {
    this.ychange = steps;

    // Change color when the paddle moves
    if (this.isSecondaryModeOn) {
      this.color = this.p5.color(
        this.p5.random(255),
        this.p5.random(255),
        this.p5.random(255)
      );
    }
  }

  show() {
    this.p5.fill(this.color); // Use the dynamic color
    this.p5.rectMode(this.p5.CENTER);
    this.p5.rect(this.x, this.y, this.w, this.h);
  }
}

export default Paddle;
