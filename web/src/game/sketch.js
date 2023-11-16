let leftscore = 0;
let rightscore = 0;

function keyReleased() {
  left.move(0);
  right.move(0);
}

function keyPressed() {
  console.log(keyCode);
  if (key == "A" || key.toLowerCase() == "a") {
    left.move(-10);
  } else if (key == "Z" || key.toLowerCase() == "z") {
    left.move(10);
  }

  if (key == "J" || key.toLowerCase() == "j") {
    right.move(-10);
  } else if (key == "M" || key.toLowerCase() == "m") {
    right.move(10);
  }
}

function setup() {
  createCanvas(600, 400);
  puck = new Puck();
  left = new Paddle(true);
  right = new Paddle(false);

  window.addEventListener("keydown", keyPressed);
  window.addEventListener("keyup", keyReleased);
}

function draw() {
  background(0);

  puck.checkPaddleRight(right);
  puck.checkPaddleLeft(left);

  left.show();
  right.show();
  left.update();
  right.update();

  puck.update();
  puck.edges();
  puck.show();

  fill(255);
  textSize(32);
  text(leftscore, 32, 40);
  text(rightscore, width - 64, 40);
}
