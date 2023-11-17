import Sketch from 'react-p5';
import Paddle from './paddle';
import sound from './ding.mp3';
import Puck from './puck';

interface Event {
  key: string;
  keyLower?: string;
}

const canvasWidth = 600;
const canvasHeight = 400;
let leftscore = 0;
let rightscore = 0;
let puck: Puck;
let left: Paddle;
let right: Paddle;
let isGameStarted = false;

const keyReleased = (p5: any) => {
  left.move(0);
  right.move(0);
};

const keyPressed = (p5: any, event: Event) => {
  if (event.key === 'A' || event.keyLower === 'a') {
    left.move(-10);
  } else if (event.key === 'Z' || event.keyLower === 'z') {
    left.move(10);
  }

  if (event.key === 'J' || event.keyLower === 'j') {
    right.move(-10);
  } else if (event.key === 'M' || event.keyLower === 'm') {
    right.move(10);
  }
};

const setup = (p5: any, canvasParentRef: any) => {
  p5.createCanvas(600, 400).parent(canvasParentRef);
  leftscore = 0;
  rightscore = 0;
  puck = new Puck(canvasWidth, canvasHeight, leftscore, rightscore, p5, sound); // Pass scores to the Puck object
  left = new Paddle(true, p5, canvasHeight, canvasWidth);
  right = new Paddle(false, p5, canvasHeight, canvasWidth);
  window.addEventListener('keydown', (ev) => {
    keyPressed(p5, { key: ev.key, keyLower: ev.key.toLowerCase() });
    if (ev.key === 'Enter') {
      isGameStarted = true;
    }
  });
  window.addEventListener('keyup', () => keyReleased(p5));
};

const draw = (p5: any) => {
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

const PongSketch: React.FC = () => {
  return <Sketch setup={setup} draw={draw} />;
};

export default PongSketch;
