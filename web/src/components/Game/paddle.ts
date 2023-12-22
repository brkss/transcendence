// Import necessary libraries or classes if not already imported
// ...

import { Socket } from "socket.io-client";

class Paddle {
  y: number;
  w: number;
  h: number;
  ychange: number;
  p5: any;
  canvasHeight: number;
  isLeft: boolean;
  color: string;
  isSecondaryModeOn: boolean;
  lastEmittedValue: undefined | number;
  x: number;

  constructor(
    isLeft: boolean,
    p5: any,
    height: number,
    width: number,
    isSecondaryModeOn: boolean,
    socket: Socket
  ) {
    this.y = height / 2;
    this.w = 20;
    this.h = 100;
    this.ychange = 0;
    this.p5 = p5;
    this.canvasHeight = height; // Store the canvas height
    this.isLeft = isLeft;
    this.color = this.p5.color(255); // Initial color
    this.isSecondaryModeOn = isSecondaryModeOn;
    this.lastEmittedValue = undefined;

    if (isLeft) {
      this.x = this.w;
    } else {
      this.x = width - this.w;
    }

    socket.on("setLeftPos", (data) => {
      if (this.isLeft) {
        //console.log('is left', this.isLeft);
        this.y = data.value;
      }
    });

    socket.on("setRightPos", (data) => {
      if (!this.isLeft) {
        //console.log('not left', this.isLeft);
        this.y = data.value;
      }
    });
  }

  update(socket: Socket, isLeft: boolean) {
    this.y += this.ychange;

    this.y = this.p5.constrain(
      this.y,
      this.h / 2,
      this.canvasHeight - this.h / 2
    ); // Use canvasHeight
    if (this.ychange !== 0 && isLeft && this.lastEmittedValue !== this.y) {
      this.lastEmittedValue = this.y;
      socket.emit("paddleLeftPos", { value: this.y });
    } else if (!isLeft && this.lastEmittedValue !== this.y) {
      this.lastEmittedValue = this.y;
      socket.emit("paddleRightPos", { value: this.y });
    }
  }

  move(steps: number) {
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
