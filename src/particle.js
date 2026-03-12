class Particle {
  constructor(x, y, vx, vy, life, color, size) {
    this.x = x; this.y = y;
    this.vx = vx; this.vy = vy;
    this.life = life; this.maxLife = life;
    this.color = color;
    this.size = size || 3;
  }
  update() { this.x += this.vx; this.y += this.vy; this.vx *= 0.96; this.vy *= 0.96; this.life--; }
  get alpha() { return this.life / this.maxLife; }
  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * this.alpha, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

class ParticleSystem {
  constructor() { this.particles = []; }
  emit(x, y, count, color) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = Math.random() * 3 + 1;
      this.particles.push(new Particle(x, y, Math.cos(angle)*spd, Math.sin(angle)*spd, 30 + Math.random()*20, color, 2 + Math.random()*2));
    }
  }
  update() { this.particles = this.particles.filter(p => { p.update(); return p.life > 0; }); }
  draw(ctx) { this.particles.forEach(p => p.draw(ctx)); }
}