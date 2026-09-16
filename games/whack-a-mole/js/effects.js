/**
 * Whack-a-Mole: Arcade Edition - Visual Effects & Particle Engine
 * High-performance Canvas particles, flying splinters, golden stars,
 * bomb explosion smoke, floating score popups, and tactile screen shake.
 */

(function(window) {
  'use strict';

  class EffectsEngine {
    constructor() {
      this.canvas = null;
      this.ctx = null;
      this.particles = [];
      this.floatingTexts = [];
      this.animId = null;
      this.width = 0;
      this.height = 0;
      this.reducedMotion = false;

      if (typeof window !== 'undefined' && window.matchMedia) {
        try {
          this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        } catch (e) {}
      }
    }

    init(canvasElement) {
      if (!canvasElement) return;
      this.canvas = canvasElement;
      this.ctx = this.canvas.getContext('2d');
      this.resize();

      window.addEventListener('resize', () => this.resize());
      this.loop = this.loop.bind(this);
      this.loop();
    }

    resize() {
      if (!this.canvas) return;
      this.width = this.canvas.clientWidth || window.innerWidth;
      this.height = this.canvas.clientHeight || window.innerHeight;
      this.canvas.width = this.width;
      this.canvas.height = this.height;
    }

    /**
     * Spawn burst of particles tailored by hit type
     */
    spawnHitParticles(x, y, moleType = 'normal') {
      if (this.reducedMotion || !this.ctx) return;

      if (moleType === 'bomb') {
        // Heavy explosive smoke & red embers
        for (let i = 0; i < 40; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 3 + Math.random() * 8;
          const size = 6 + Math.random() * 12;
          const life = 30 + Math.random() * 25;
          const isEmber = Math.random() > 0.4;

          this.particles.push({
            x, y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color: isEmber ? '#ef4444' : (Math.random() > 0.5 ? '#f97316' : '#27272a'),
            size,
            maxLife: life,
            life,
            isSmoke: !isEmber,
            isStar: false
          });
        }
        return;
      }

      if (moleType === 'golden' || moleType === 'bonus') {
        // Golden sparkling stars
        for (let i = 0; i < 30; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 2 + Math.random() * 6;
          const size = 5 + Math.random() * 6;
          const life = 35 + Math.random() * 20;

          this.particles.push({
            x, y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color: Math.random() > 0.3 ? '#facc15' : '#ffffff',
            size,
            maxLife: life,
            life,
            isStar: true
          });
        }
      }

      // Standard wood splinters & soil dust
      const count = moleType === 'armored' ? 24 : 18;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 5;
        const size = 3 + Math.random() * 4;
        const life = 25 + Math.random() * 20;

        const isSplinter = Math.random() > 0.4;
        this.particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.5, // Slight upward bias
          color: isSplinter ? '#b45309' : '#3d1d0c',
          size,
          maxLife: life,
          life,
          isStar: false,
          isSplinter
        });
      }
    }

    /**
     * Spawn floating score / combo text
     */
    spawnFloatingText(container, x, y, text, typeClass = 'score-normal') {
      if (!container) return;
      const el = document.createElement('div');
      el.className = `floating-feedback ${typeClass}`;
      el.textContent = text;
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;

      container.appendChild(el);
      setTimeout(() => {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, 900);
    }

    /**
     * Screen shake effect
     */
    screenShake(container, intensity = 8, duration = 250) {
      if (this.reducedMotion || !container) return;
      container.classList.remove('screen-shake');
      void container.offsetWidth; // Reflow
      container.classList.add('screen-shake');
      setTimeout(() => {
        container.classList.remove('screen-shake');
      }, duration);
    }

    /**
     * Main animation render loop
     */
    loop() {
      if (!this.ctx || !this.canvas) {
        this.animId = requestAnimationFrame(this.loop);
        return;
      }

      this.ctx.clearRect(0, 0, this.width, this.height);

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.12; // Gravity
        p.vx *= 0.97; // Friction
        p.life--;

        const alpha = Math.max(0, p.life / p.maxLife);
        if (p.life <= 0) {
          this.particles.splice(i, 1);
          continue;
        }

        this.ctx.save();
        this.ctx.globalAlpha = alpha;
        this.ctx.fillStyle = p.color;

        if (p.isStar) {
          // Draw 4-point star
          this.ctx.shadowColor = '#facc15';
          this.ctx.shadowBlur = 8;
          this.drawStar(p.x, p.y, p.size * (p.life / p.maxLife));
        } else if (p.isSplinter) {
          // Wood splinter rectangle
          this.ctx.translate(p.x, p.y);
          this.ctx.rotate(p.vx * 0.2);
          this.ctx.fillRect(-p.size, -p.size / 2, p.size * 2, p.size);
        } else {
          // Soil / smoke puff circle
          this.ctx.beginPath();
          this.ctx.arc(p.x, p.y, p.size * (p.life / p.maxLife), 0, Math.PI * 2);
          this.ctx.fill();
        }

        this.ctx.restore();
      }

      this.animId = requestAnimationFrame(this.loop);
    }

    drawStar(cx, cy, r) {
      this.ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const a = (i * Math.PI) / 2;
        this.ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
        const a2 = a + Math.PI / 4;
        this.ctx.lineTo(cx + Math.cos(a2) * (r * 0.35), cy + Math.sin(a2) * (r * 0.35));
      }
      this.ctx.closePath();
      this.ctx.fill();
    }
  }

  window.EffectsEngine = new EffectsEngine();
})(typeof window !== 'undefined' ? window : this);

