class PongGame {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    canvas.width = W; canvas.height = H;
    this.ball = new Ball();
    this.padLeft = new Paddle(20, true);
    this.padRight = new Paddle(W - 20 - PAD_W, false);
    this.ai = null;
    this.keys = {};
    this.mode = null;
    this.state = 'idle';
    this.particles = new ParticleSystem();
    this.audioCtx = null;
    this.animId = null;
  }

  setMode(mode) {
    this.mode = mode;
    if (mode === '1p') this.ai = new PongAI(this.padRight);
    else this.ai = null;
    this.start();
  }

  start() {
    this.padLeft.score = 0;
    this.padRight.score = 0;
    this.padLeft.y = H/2 - PAD_H/2;
    this.padRight.y = H/2 - PAD_H/2;
    this.ball.reset(1);
    this.state = 'playing';
    document.getElementById('overlay').classList.remove('show');
    this.updateScoreUI();
    if (this.animId) cancelAnimationFrame(this.animId);
    this.loop();
  }

  beep(freq = 440, dur = 0.05) {
    try {
      if (!this.audioCtx) this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const o = this.audioCtx.createOscillator();
      const g = this.audioCtx.createGain();
      o.connect(g); g.connect(this.audioCtx.destination);
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + dur);
      o.start(); o.stop(this.audioCtx.currentTime + dur);
    } catch(e){}
  }

  loop() {
    this.update();
    this.draw();
    this.animId = requestAnimationFrame(() => this.loop());
  }

  update() {
    if (this.state !== 'playing') return;

    // left paddle
    if (this.keys['KeyW'] || this.keys['ArrowUp']) this.padLeft.moveUp();
    if (this.keys['KeyS'] || this.keys['ArrowDown']) this.padLeft.moveDown();

    // right paddle (2p only)
    if (this.mode === '2p') {
      if (this.keys['KeyI']) this.padRight.moveUp();
      if (this.keys['KeyK']) this.padRight.moveDown();
    } else if (this.ai) {
      this.ai.setDifficulty(this.padLeft.score + this.padRight.score);
      this.ai.update(this.ball);
    }

    this.ball.update(this.padLeft, this.padRight, this.particles);
    this.particles.update();

    const scored = this.ball.checkScore();
    if (scored !== 0) {
      if (scored === 1) { this.padRight.score++; this.beep(330, 0.15); }
      else { this.padLeft.score++; this.beep(330, 0.15); }
      this.updateScoreUI();
      if (this.padLeft.score >= WIN_SCORE || this.padRight.score >= WIN_SCORE) {
        this.endGame();
      } else {
        this.ball.reset(scored);
      }
    }
  }

  updateScoreUI() {
    document.getElementById('score-left').textContent = this.padLeft.score;
    document.getElementById('score-right').textContent = this.padRight.score;
  }

  endGame() {
    this.state = 'over';
    const winner = this.padLeft.score >= WIN_SCORE
      ? (this.mode === '1p' ? 'You Win! 🎉' : 'Player 1 Wins!')
      : (this.mode === '1p' ? 'AI Wins 🤖' : 'Player 2 Wins!');
    document.getElementById('overlay-sub').textContent = `${winner} — Click to play again`;
    document.getElementById('overlay').classList.add('show');
  }

  draw() {
    const ctx = this.ctx;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);
    // center dashed line
    ctx.setLineDash([10, 10]);
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(W/2, 0);
    ctx.lineTo(W/2, H);
    ctx.stroke();
    ctx.setLineDash([]);
    this.padLeft.draw(ctx);
    this.padRight.draw(ctx);
    this.ball.draw(ctx);
    this.particles.draw(ctx);
  }
}