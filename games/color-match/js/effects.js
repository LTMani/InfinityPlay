/**
 * Color Match: Spectrum Arena - Visual Effects & Particle Engine
 * High-performance Canvas particle systems, dynamic color bursts,
 * screen shake, combo floats, and accessibility reduced-motion checks.
 */

(function(window) {
  'use strict';

  class EffectsEngine {
    constructor() {
      this.canvas = null;
      this.ctx = null;
      this.particles = [];
      this.animId = null;
      this.width = 0;
      this.height = 0;
      this.reducedMotion = false;

      // Check prefers-reduced-motion safely
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
     * Spawn colored particle burst from an element or coordinates
     */
    burst(x, y, colorHex = '#38bdf8', count = 28) {
      if (this.reducedMotion || !this.ctx) return;

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 6;
        const size = 3 + Math.random() * 5;
        const life = 35 + Math.random() * 25;

        this.particles.push({
          x: x,
          y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: colorHex,
          size: size,
          maxLife: life,
          life: life,
          alpha: 1,
          decay: 1 / life
        });
      }
    }

    /**
     * Spawn burst from a DOM button's center
     */
    burstFromElement(element, colorHex) {
      if (!element || !this.canvas) return;
      const rect = element.getBoundingClientRect();
      const canvasRect = this.canvas.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) - canvasRect.left;
      const y = (rect.top + rect.height / 2) - canvasRect.top;
      this.burst(x, y, colorHex);
    }

    /**
     * Trigger tactile screen shake on mistake
     */
    screenShake(container, intensity = 6, duration = 300) {
      if (this.reducedMotion || !container) return;
      container.classList.remove('screen-shake');
      // Trigger reflow
      void container.offsetWidth;
      container.classList.add('screen-shake');
      setTimeout(() => {
        container.classList.remove('screen-shake');
      }, duration);
    }

    /**
     * Create floating score / combo indicator text
     */
    spawnFloatingText(container, x, y, text, colorClass = 'accent') {
      if (!container) return;
      const el = document.createElement('div');
      el.className = `floating-feedback floating-${colorClass}`;
      el.textContent = text;
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;

      container.appendChild(el);
      setTimeout(() => {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, 900);
    }

    /**
     * Main animation loop
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
        p.vy += 0.08; // subtle gravity
        p.vx *= 0.98; // subtle drag
        p.life--;
        p.alpha = Math.max(0, p.life / p.maxLife);

        if (p.life <= 0) {
          this.particles.splice(i, 1);
          continue;
        }

        this.ctx.save();
        this.ctx.globalAlpha = p.alpha;
        this.ctx.fillStyle = p.color;
        this.ctx.shadowColor = p.color;
        this.ctx.shadowBlur = 8;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size * (p.life / p.maxLife), 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
      }

      this.animId = requestAnimationFrame(this.loop);
    }
  }

  window.EffectsEngine = new EffectsEngine();
})(typeof window !== 'undefined' ? window : this);

