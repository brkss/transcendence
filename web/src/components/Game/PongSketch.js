"use client";

import React, { useEffect } from "react";
import { NextReactP5Wrapper, color } from "@p5-wrapper/next";
import Paddle from "./paddle.js";
import sound from "./ding.mp3";
import { Puck } from "./puck.js";

const canvasWidth = 800;
const canvasHeight = 500;
const PI = 3.1415;
let leftscore = 0;
let rightscore = 0;
let puck;
let left;
let right;
let crazyModePuck;
let isGameStarted = false;
let isGameOver = false;
const keyReleased = (p5) => {
  left.move(0);
  right.move(0);
};

const keyPressed = (p5, event) => {
  if (event.key === "A" || event.key.toLowerCase() === "a") {
    left.move(-10);
  } else if (event.key === "Z" || event.key.toLowerCase() === "z") {
    left.move(10);
  }

  if (event.key === "J" || event.key.toLowerCase() === "j") {
    right.move(-10);
  } else if (event.key === "M" || event.key.toLowerCase() === "m") {
    right.move(10);
  }
};
let pucks = [];

const setup = (p5, canvasParentRef, isSecondaryModeOn) => {
  p5.createCanvas(canvasWidth, canvasHeight).parent(canvasParentRef);
  crazyModePuck = undefined;
  puck = new Puck(canvasWidth, canvasHeight, p5, sound);
  left = new Paddle(true, p5, canvasHeight, canvasWidth, isSecondaryModeOn);
  right = new Paddle(false, p5, canvasHeight, canvasWidth, isSecondaryModeOn);

  window.addEventListener("keydown", (ev) => {
    keyPressed(p5, ev);
    if (ev.key === "Enter") {
      isGameStarted = true;
    }
  });
  window.addEventListener("keyup", () => keyReleased(p5));
  if (isGameStarted) {
    leftscore = 0;
    rightscore = 0;
    resetGame(p5, isSecondaryModeOn);
  }
};

function showGameOverMessage(p5) {
  p5.fill(255);
  p5.textSize(64);
  p5.text("Game Over!", canvasWidth / 2 - 180, canvasHeight / 2 + 25);
}

const handleDrawMainMenu = (p5) => {
  p5.fill(200);
  p5.textSize(32);
  p5.text("USE 'A' and 'Z' OR 'J' and 'M' TO MOVE ", 100, 150);
  p5.text("PRESS ENTER TO START GAME", 150, 235);
};

const handleDrawSecondaryMode = (p5) => {
  const c = p5.color(255, 0, 0);
  p5.fill(c);
  p5.textSize(20);
  p5.text("CRAZY MODE", 350, 20);
};
const resetGame = (p5, isSecondaryModeOn) => {
  isGameStarted = false;
  isGameOver = false;
  crazyModePuck = undefined;
  puck = new Puck(canvasWidth, canvasHeight, p5, sound,crazyModePuck);
  left = new Paddle(true, p5, canvasHeight, canvasWidth, isSecondaryModeOn);
  right = new Paddle(false, p5, canvasHeight, canvasWidth, isSecondaryModeOn);
};

const draw = (p5, isSecondaryModeOn) => {
  p5.background(0);
  puck.checkPaddleRight(right);
  puck.checkPaddleLeft(left);
  left.show();
  right.show();
  puck.show();

  if (!isGameStarted) {
    return handleDrawMainMenu(p5);
  }
  if (isSecondaryModeOn) {
    handleDrawSecondaryMode(p5);
  }
  left.update();
  right.update();
  puck.update();
  const res = puck.edges();
  if (res == true) {
    if (puck.getServingPlayer() === "left") leftscore++;
    else if (puck.getServingPlayer() === "right") rightscore++;
  }
  if (res === true && !crazyModePuck && isSecondaryModeOn) {
    crazyModePuck = new Puck(canvasWidth, canvasHeight, p5, sound,undefined);
  }
  if (crazyModePuck && isSecondaryModeOn) {
    crazyModePuck.checkPaddleRight(right);
    crazyModePuck.checkPaddleLeft(left);
    crazyModePuck.show();
    crazyModePuck.update();
    const goal = crazyModePuck.edges( crazyModePuck?.getServingPlayer() === "left" ? "right" : "left");
    if (goal) {
      if (crazyModePuck.getServingPlayer() === "left") leftscore++;
      else if (crazyModePuck.getServingPlayer() === "right") rightscore++;
    }
  }

  p5.fill(255);
  p5.textSize(32);
  p5.text(leftscore, 32, 40);
  p5.text(rightscore, canvasWidth - 64, 40);
  if (leftscore >= 5 || rightscore >= 5) {
    // Set isGameOver to true when the game is over
    isGameOver = true;
  }
  if (isGameOver) {
    crazyModePuck = undefined;
    puck.destroy();
    showGameOverMessage(p5);
  }
};

const sketch = (p5, isSecondary) => {
  p5.setup = () => setup(p5, undefined, isSecondary);
  p5.draw = () => draw(p5, isSecondary);
};

const PongSketch = ({ isSecondaryModeOn }) => {
  useEffect(() => {
    isGameStarted = false;
  }, [isSecondaryModeOn]);
  console.log(isSecondaryModeOn);
  return <NextReactP5Wrapper sketch={(p5) => sketch(p5, isSecondaryModeOn)} />;
};

export default PongSketch;
