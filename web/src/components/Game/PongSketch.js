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
let isReady = false;
const keyReleased = (p5, socket) => {
  socket.emit("moveLeftRelease");
  socket.emit("moveRightRelease");
};

const keyPressed = (p5, event, socket) => {
  if (event.key === "A" || event.key.toLowerCase() === "a") {
    socket.emit("moveLeft", { value: -10 });
  } else if (event.key === "Z" || event.key.toLowerCase() === "z") {
    socket.emit("moveLeft", { value: 10 });
  }

  if (event.key === "J" || event.key.toLowerCase() === "j") {
    right.move(-10);
  } else if (event.key === "M" || event.key.toLowerCase() === "m") {
    right.move(10);
  }
};
let pucks = [];

const setup = (p5, canvasParentRef, isSecondaryModeOn, socket, isHost) => {
  p5.createCanvas(canvasWidth, canvasHeight).parent(canvasParentRef);
  crazyModePuck = undefined;
  socket.on("moveX", () => {
    console.log("MOVE X");
  });
  console.log("isHost", isHost);
  puck = new Puck(
    canvasWidth,
    canvasHeight,
    p5,
    sound,
    undefined,
    socket,
    isHost
  );
  left = new Paddle(
    true,
    p5,
    canvasHeight,
    canvasWidth,
    isSecondaryModeOn,
    socket
  );
  right = new Paddle(
    false,
    p5,
    canvasHeight,
    canvasWidth,
    isSecondaryModeOn,
    socket
  );

  socket.on("moveLeftPaddleUp", (data) => {
    console.log("move paddle left", data);
    left.move(data.value);
  });
  socket.on("moveLeftPaddleDown", (data) => {
    console.log("move paddle left", data);
    left.move(data.value);
  });

  socket.on("moveLeftRelease", () => {
    left.move(0);
    right.move(0);
  });

  socket.on("startGame", () => {
    isGameStarted = true;
  });

  window.addEventListener("keydown", (ev) => {
    keyPressed(p5, ev, socket);
    if (ev.key === "Enter") {
      socket.emit("userReady");
    }
  });
  window.addEventListener("keyup", () => keyReleased(p5, socket));
  if (isGameStarted) {
    leftscore = 0;
    rightscore = 0;
    resetGame(p5, isSecondaryModeOn, socket);
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
  !isReady && p5.text("USE 'A' and 'Z' OR 'J' and 'M' TO MOVE ", 100, 150);
  p5.text(
    !isReady ? "PRESS ENTER TO START GAME" : "1/2 PLAYERS READY AWAITING",
    150,
    235
  );
};

const handleDrawSecondaryMode = (p5) => {
  const c = p5.color(255, 0, 0);
  p5.fill(c);
  p5.textSize(20);
  p5.text("CRAZY MODE", 350, 20);
};
const resetGame = (p5, isSecondaryModeOn, socket) => {
  isGameStarted = false;
  isGameOver = false;
  crazyModePuck = undefined;
  puck = new Puck(canvasWidth, canvasHeight, p5, sound, crazyModePuck, socket);
  left = new Paddle(true, p5, canvasHeight, canvasWidth, isSecondaryModeOn);
  right = new Paddle(false, p5, canvasHeight, canvasWidth, isSecondaryModeOn);
};

const draw = (p5, isSecondaryModeOn, socket) => {
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
  left.update(socket, true);
  right.update(socket);
  puck.update();
  const res = puck.edges();
  if (res == true) {
    if (puck.getServingPlayer() === "left") leftscore++;
    else if (puck.getServingPlayer() === "right") rightscore++;
  }
  if (res === true && !crazyModePuck && isSecondaryModeOn) {
    crazyModePuck = new Puck(
      canvasWidth,
      canvasHeight,
      p5,
      sound,
      undefined,
      socket
    );
  }
  if (crazyModePuck && isSecondaryModeOn) {
    crazyModePuck.checkPaddleRight(right);
    crazyModePuck.checkPaddleLeft(left);
    crazyModePuck.show();
    crazyModePuck.update();
    const goal = crazyModePuck.edges(
      crazyModePuck?.getServingPlayer() === "left" ? "right" : "left"
    );
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

const sketch = (p5, isSecondary, socket, isHost) => {
  p5.setup = () => setup(p5, undefined, isSecondary, socket, isHost);
  p5.draw = () => draw(p5, isSecondary, socket);
};

const PongSketch = ({ isSecondaryModeOn, socket, isHost }) => {
  useEffect(() => {
    isGameStarted = false;
  }, [isSecondaryModeOn]);
  console.log(socket, isHost);

  return (
    <NextReactP5Wrapper
      sketch={(p5) => sketch(p5, isSecondaryModeOn, socket, isHost)}
    />
  );
};

export default PongSketch;
