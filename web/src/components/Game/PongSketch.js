'use client'

import React, { useEffect } from 'react';
import { NextReactP5Wrapper } from "@p5-wrapper/next";
import Paddle from './paddle.js';
import sound from './ding.mp3'
import { Puck } from './puck.js';

const canvasWidth = 600;
const canvasHeight = 400;
let leftscore = 0;
let rightscore = 0;
let puck;
let left;
let right;
let isGameStarted = false;

const keyReleased = (p5) => {
  left.move(0);
  right.move(0);
};

const keyPressed = (p5, event) => {
  if (event.key === 'A' || event.key.toLowerCase() === 'a') {
    left.move(-10);
  } else if (event.key === 'Z' || event.key.toLowerCase() === 'z') {
    left.move(10);
  }

  if (event.key === 'J' || event.key.toLowerCase() === 'j') {
    right.move(-10);
  } else if (event.key === 'M' || event.key.toLowerCase() === 'm') {
    right.move(10);
  }
};

const setup = (p5, canvasParentRef) => {
  p5.createCanvas(600, 400).parent(canvasParentRef);
  leftscore = 0;
  rightscore = 0;
  puck = new Puck(canvasWidth, canvasHeight, leftscore, rightscore, p5, sound);
  left = new Paddle(true, p5, canvasHeight, canvasWidth);
  right = new Paddle(false, p5, canvasHeight, canvasWidth);

  window.addEventListener('keydown', (ev) => {
    keyPressed(p5, ev);
    if (ev.key === 'Enter') {
      isGameStarted = true;
    }
  });
  window.addEventListener('keyup', () => keyReleased(p5));
};

const draw = (p5) => {
  p5.background(0);
  puck.checkPaddleRight(right);
  puck.checkPaddleLeft(left);
  left.show();
  right.show();
  puck.show();
  if (isGameStarted) {
    left.update();
    right.update();
    puck.update();
    puck.edges();
  }
  if (!isGameStarted) {
    p5.fill(200);
    p5.textSize(32);
    p5.text('PRESS ENTER TO START GAME', 55, 200);
  }
};

const sketch = p5 => {
  p5.setup = () => setup(p5, undefined)
  p5.draw = () => draw(p5)
}


const PongSketch = () => {
  return <NextReactP5Wrapper sketch={sketch} />;
};

export default PongSketch;
