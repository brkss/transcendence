// paddle.ts

class Paddle {
    private y: number;
    private w: number;
    private h: number;
    private ychange: number;
    private p5: any; // Replace 'any' with the appropriate type for your p5 library
    private canvasHeight: number;
    private x: number;
  
    constructor(isLeft: boolean, p5: any, height: number, width: number) {
      this.y = height / 2;
      this.w = 20;
      this.h = 100;
      this.ychange = 0;
      this.p5 = p5;
      this.canvasHeight = height;
  
      if (isLeft) {
        this.x = this.w;
      } else {
        this.x = width - this.w;
      }
    }
  
    update() {
      this.y += this.ychange;
      this.y = this.p5.constrain(this.y, this.h / 2, this.canvasHeight - this.h / 2);
    }
  
    move(steps: number) {
      this.ychange = steps;
    }
  
    show() {
      this.p5.fill(255);
      this.p5.rectMode(this.p5.CENTER);
      this.p5.rect(this.x, this.y, this.w, this.h);
    }
  }
  
  export default Paddle;
  