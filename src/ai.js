class PongAI {
  constructor(paddle) {
    this.paddle = paddle;
    this.reactionDelay = 6;
    this.timer = 0;
    this.targetY = H / 2;
    this.errorMargin = 30;
  }

  setDifficulty(totalScore) {
    // Gets harder as game progresses
    const lvl = Math.min(totalScore, 10);
    this.reactionDelay = Math.max(1, 6 - Math.floor(lvl / 2));
    this.errorMargin = Math.max(4, 30 - lvl * 2);
  }

  update(ball) {
    this.timer++;
    if (this.timer >= this.reactionDelay) {
      this.timer = 0;
      // predict ball position
      const targetY = ball.y + (Math.random() * 2 - 1) * this.errorMargin;
      this.targetY = targetY;
    }
    const center = this.paddle.y + PAD_H / 2;
    if (center < this.targetY - 4) this.paddle.moveDown();
    else if (center > this.targetY + 4) this.paddle.moveUp();
  }
}