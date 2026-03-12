class Ball {
  constructor() {
    this.r = BALL_R;
    this.reset(1);
    this.trail = [];
  }

  reset(dir) {
    this.x = W / 2; this.y = H / 2;
    const angle = (Math.random() * Math.PI / 3) - Math.PI / 6;
    this.vx = dir * BALL_INIT_SPEED * Math.cos(angle);
    this.vy = BALL_INIT_SPEED * Math.sin(angle);
    this.speed = BALL_INIT_SPEED;
    this.trail = [];
  }

  update(padLeft, padRight, particles) {
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > 10) this.trail.shift();

    this.x += this.vx;
    this.y += this.vy;

    // top / bottom bounce
    if (this.y - this.r < 0) { this.y = this.r; this.vy = Math.abs(this.vy); }
    if (this.y + this.r > H) { this.y = H - this.r; this.vy = -Math.abs(this.vy); }

    // paddle collisions
    if (this.hitPaddle(padLeft)) {
      this.vx = Math.abs(this.vx);
      this.deflect(padLeft);
      particles.emit(this.x, this.y, 8, '#0ff');
    }
    if (this.hitPaddle(padRight)) {
      this.vx = -Math.abs(this.vx);
      this.deflect(padRight);
      particles.emit(this.x, this.y, 8, '#0ff');
    }
  }

  hitPaddle(p) {
    return this.x - this.r < p.x + PAD_W && this.x + this.r > p.x &&
           this.y - this.r < p.y + PAD_H && this.y + this.r > p.y;
  }

  deflect(p) {
    const rel = (this.y - (p.y + PAD_H / 2)) / (PAD_H / 2);
    const maxAngle = Math.PI / 4;
    const angle = rel * maxAngle;
    this.speed = Math.min(this.speed + 0.3, 15);
    const dir = this.vx > 0 ? 1 : -1;
    this.vx = dir * this.speed * Math.cos(angle);
    this.vy = this.speed * Math.sin(angle);
  }

  // returns 0=in play, -1=left scored, 1=right scored
  checkScore() {
    if (this.x + this.r < 0) return 1;   // right scores
    if (this.x - this.r > W) return -1;  // left scores
    return 0;
  }

  draw(ctx) {
    // trail
    this.trail.forEach((t, i) => {
      ctx.beginPath();
      ctx.arc(t.x, t.y, this.r * (i / this.trail.length) * 0.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,255,255,${i / this.trail.length * 0.25})`;
      ctx.fill();
    });
    // ball
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.shadowColor = '#fff';
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}