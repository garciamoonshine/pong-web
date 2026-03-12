class Paddle {
  constructor(x, isLeft) {
    this.x = x;
    this.y = H / 2 - PAD_H / 2;
    this.w = PAD_W; this.h = PAD_H;
    this.isLeft = isLeft;
    this.vy = 0;
    this.score = 0;
  }

  moveUp() { this.y = Math.max(0, this.y - PAD_SPEED); }
  moveDown() { this.y = Math.min(H - this.h, this.y + PAD_SPEED); }

  draw(ctx) {
    ctx.fillStyle = '#fff';
    ctx.shadowColor = '#0ff';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.roundRect(this.x, this.y, this.w, this.h, 4);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}