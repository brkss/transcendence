



function radians(degrees) {
  return degrees * (Math.PI / 180);
}

export class Puck {
  constructor(canvasWidth, canvasHeight, updateLeftScore, updateRightScore, p5, sound) {
    this.r = 12;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.updateLeftScore = updateLeftScore;
    this.updateRightScore = updateRightScore;
    this.p5 = p5;
    this.isGameOver = false;
    this.sound = new Audio(sound);
    this.servingPlayer = ''; 
    this.reset();
  }

  checkPaddleLeft(p) {
    if (this.y - this.r < p.y + p.h/2 &&
        this.y + this.r > p.y - p.h/2 &&
        this.x - this.r < p.x + p.w/2) {
            
        if (this.x > p.x) {
            let diff = this.y - (p.y - p.h/2);
            let rad = radians(45);
            let angle = this.p5.map(diff, 0, p.h, -rad, rad);
            this.xspeed = 5 * Math.cos(angle);
            this.yspeed = 5 * Math.sin(angle);
            this.x = p.x + p.w/2 + this.r;
        }
        
    }
}
checkPaddleRight(p) {
    if (this.y - this.r < p.y + p.h/2 &&
        this.y + this.r > p.y - p.h/2 &&
        this.x + this.r > p.x - p.w/2) {
            
        if (this.x < p.x) {
            let diff = this.y - (p.y - p.h/2);
            let angle = this.p5.map(diff, 0, p.h, radians(225), radians(135));
            this.xspeed = 5 * Math.cos(angle);
            this.yspeed = 5 * Math.sin(angle);
            this.x = p.x - p.w/2 - this.r;
        }
    }
}

  update() {
    this.x += this.xspeed;
    this.y += this.yspeed;
  }

  reset() {

    if (this.updateLeftScore >= 11 || this.updateRightScore >= 11) {
      // Set isGameOver to true when the game is over
      this.isGameOver = true;
    }
    else
    {
      this.x = this.canvasWidth / 2;
      this.y = this.canvasHeight / 2;

      if (this.servingPlayer === 'left') {
        this.xspeed = 5; // Serve to the left
      } else {
        this.xspeed = -5; // Serve to the right
      }
      this.yspeed = Math.random() < 0.5 ? -5 : 5;
    }
   
  }
  
  edges() {
    if(!this.isGameOver)
    { 
    if (this.y < 0 || this.y > this.canvasHeight) {
      this.yspeed *= -1;
    }

    if (this.x - this.r > this.canvasWidth) {
      this.updateLeftScore++;
      this.servingPlayer = 'left';
      this.reset(); // Player who was scored against serves the ball
      this.sound.play();
    }
  
    if (this.x + this.r < 0) {
      this.updateRightScore++;
      this.servingPlayer = 'right';
      this.reset(); // Player who was scored against serves the ball
      this.sound.play();
    }
    }
  }

  showGameOverMessage() {
    this.p5.fill(255);
    this.p5.textSize(64);
    this.p5.text('Game Over!', this.canvasWidth / 2 - 150, this.canvasHeight / 2);
  }
  show() {
    this.p5.fill(255);
    this.p5.ellipse(this.x, this.y, this.r * 2);
    this.p5.fill(255);
    this.p5.textSize(32);
    this.p5.text(this.updateLeftScore, 32, 40); 
    this.p5.text(this.updateRightScore, this.canvasWidth - 64, 40);
  
    if (this.isGameOver) {
      // Display game over message
      this.p5.fill(255);
      this.p5.textSize(64);
      this.p5.text('Game Over!', this.canvasWidth / 2 - 150, this.canvasHeight / 2);
    }
  }
  
}
