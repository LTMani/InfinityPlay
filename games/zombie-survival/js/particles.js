/**
 * Zombie Survival - Particle System
 * Blood-free, high-intensity neon sparks, dust, shockwaves, and floating combat text.
 */

class Particle {
  constructor(x, y, vx, vy, color, size, life, shape = 'circle', alpha = 1) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.size = size;
    this.maxLife = life;
    this.life = life;
    this.shape = shape; // 'circle', 'spark', 'ring', 'smoke'
    this.alpha = alpha;
    this.drag = 0.94;
  }

  update(dt) {
    this.x += this.vx * dt * 60;
    this.y += this.vy * dt * 60;
    this.vx *= Math.pow(this.drag, dt * 60);
    this.vy *= Math.pow(this.drag, dt * 60);
    this.life -= dt;
    return this.life > 0;
  }

  render(ctx) {
    const progress = Math.max(0, this.life / this.maxLife);
    const currentAlpha = progress * this.alpha;
    ctx.save();
    ctx.globalAlpha = currentAlpha;

    if (this.shape === 'ring') {
      const currentRadius = this.size * (2.2 - progress * 1.2);
      ctx.strokeStyle = this.color;
      ctx.lineWidth = Math.max(1, 3 * progress);
      ctx.beginPath();
      ctx.arc(this.x, this.y, currentRadius, 0, Math.PI * 2);
      ctx.stroke();
    } else if (this.shape === 'spark') {
      const speed = Math.hypot(this.vx, this.vy);
      const angle = Math.atan2(this.vy, this.vx);
      ctx.fillStyle = this.color;
      ctx.translate(this.x, this.y);
      ctx.rotate(angle);
      ctx.fillRect(-this.size * 2, -this.size * 0.5, this.size * 4 + speed * 2, this.size);
    } else if (this.shape === 'smoke') {
      ctx.fillStyle = this.color;
      const smokeRadius = this.size * (1.8 - progress * 0.8);
      ctx.beginPath();
      ctx.arc(this.x, this.y, smokeRadius, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * progress, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

class FloatingText {
  constructor(x, y, text, color = '#ffffff', fontSize = 16, isCrit = false) {
    this.x = x + (Math.random() - 0.5) * 12;
    this.y = y - 10;
    this.text = text;
    this.color = color;
    this.fontSize = fontSize;
    this.isCrit = isCrit;
    this.life = 0.8;
    this.maxLife = 0.8;
    this.vy = isCrit ? -1.8 : -1.1;
  }

  update(dt) {
    this.y += this.vy * dt * 60;
    this.vy *= 0.95;
    this.life -= dt;
    return this.life > 0;
  }

  render(ctx) {
    const progress = Math.max(0, this.life / this.maxLife);
    ctx.save();
    ctx.globalAlpha = Math.min(1, progress * 1.5);
    ctx.font = `900 ${this.isCrit ? this.fontSize * 1.3 : this.fontSize}px 'Inter', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Text outline
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.strokeText(this.text, this.x, this.y);

    // Main text
    ctx.fillStyle = this.color;
    ctx.fillText(this.text, this.x, this.y);
    ctx.restore();
  }
}

class ParticleSystem {
  constructor() {
    this.particles = [];
    this.texts = [];
  }

  reset() {
    this.particles = [];
    this.texts = [];
  }

  // Neon hit sparks on bullet impact
  createHitSparks(x, y, normalAngle, color = '#00f0ff', count = 8, isCrit = false) {
    const baseCount = isCrit ? count * 1.8 : count;
    for (let i = 0; i < baseCount; i++) {
      const spread = (Math.random() - 0.5) * Math.PI * 0.9;
      const angle = (normalAngle !== undefined ? normalAngle + Math.PI : Math.random() * Math.PI * 2) + spread;
      const speed = (isCrit ? 4.5 : 2.5) + Math.random() * 4.5;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      const size = isCrit ? 2.5 + Math.random() * 2 : 1.5 + Math.random() * 1.5;
      const life = 0.2 + Math.random() * 0.25;
      const pColor = isCrit ? '#ffb703' : color;
      this.particles.push(new Particle(x, y, vx, vy, pColor, size, life, 'spark'));
    }
  }

  // Energy smoke puff
  createSmokePuff(x, y, color = 'rgba(100, 116, 139, 0.4)', count = 4) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.4 + Math.random() * 0.8;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      const size = 6 + Math.random() * 8;
      const life = 0.35 + Math.random() * 0.3;
      this.particles.push(new Particle(x, y, vx, vy, color, size, life, 'smoke'));
    }
  }

  // Shockwave ring (explosions, EMP, ground slams)
  createShockwave(x, y, color = '#00f0ff', maxRadius = 45, duration = 0.35) {
    this.particles.push(new Particle(x, y, 0, 0, color, maxRadius, duration, 'ring'));
  }

  // Defeat burst for zombies (energy vaporization)
  createDefeatVapor(x, y, color = '#38bdf8', count = 16) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 3.5;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      const size = 2 + Math.random() * 3;
      const life = 0.35 + Math.random() * 0.35;
      this.particles.push(new Particle(x, y, vx, vy, color, size, life, 'circle'));
    }
    this.createShockwave(x, y, color, 35, 0.3);
  }

  // Area explosion with spark particles, smoke, and shockwave
  createExplosion(x, y, color = '#f97316', count = 20) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2.0 + Math.random() * 5.0;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      const size = 2 + Math.random() * 3.5;
      const life = 0.3 + Math.random() * 0.35;
      const pColor = Math.random() > 0.4 ? color : '#fbbf24';
      this.particles.push(new Particle(x, y, vx, vy, pColor, size, life, 'spark'));
    }
    this.createSmokePuff(x, y, 'rgba(100, 116, 139, 0.5)', Math.max(3, Math.floor(count / 4)));
    this.createShockwave(x, y, color, 50, 0.4);
  }

  // Floating text (Damage, XP, Coins)
  addFloatingText(x, y, text, color = '#ffffff', fontSize = 16, isCrit = false) {
    if (this.texts.length > 30) this.texts.shift();
    this.texts.push(new FloatingText(x, y, text, color, fontSize, isCrit));
  }

  update(dt) {
    this.particles = this.particles.filter(p => p.update(dt));
    this.texts = this.texts.filter(t => t.update(dt));
  }

  render(ctx) {
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].render(ctx);
    }
    for (let i = 0; i < this.texts.length; i++) {
      this.texts[i].render(ctx);
    }
  }
}

window.ParticleSystem = ParticleSystem;

