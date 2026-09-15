/**
 * Tic-Tac-Toe: Ultimate Arena - Particle & Visual Effects Engine
 * Lightweight, high-performance HTML5 Canvas particles and tactile board responses
 */

(function() {
  'use strict';

  class EffectsEngine {
    constructor() {
      this.canvas = null;
      this.ctx = null;
      this.particles = [];
      this.animationFrameId = null;
      this.width = 0;
      this.height = 0;
      this.isReducedMotion = false;
    }

    init(canvasId = 'effectsCanvas') {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.resize();

      window.addEventListener('resize', () => this.resize());

      // Check system reduced motion
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.isReducedMotion = mediaQuery.matches;
      mediaQuery.addEventListener('change', (e) => {
        this.isReducedMotion = e.matches;
      });
    }

    resize() {
      if (!this.canvas) return;
      const rect = this.canvas.parentElement ? this.canvas.parentElement.getBoundingClientRect() : { width: window.innerWidth, height: window.innerHeight };
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.width = rect.width;
      this.height = rect.height;
      this.canvas.width = Math.floor(rect.width * dpr);
      this.canvas.height = Math.floor(rect.height * dpr);
      if (this.ctx) {
        this.ctx.scale(dpr, dpr);
      }
    }

    shouldAnimate() {
      if (this.isReducedMotion) return false;
      if (window.TTTSave) {
        const s = window.TTTSave.getSettings();
        if (s.animation === 'reduced') return false;
      }
      return true;
    }

    // Trigger subtle cell placement impact particles
    triggerPlacementImpact(cellX, cellY, color = '#38bdf8') {
      if (!this.shouldAnimate() || !this.ctx) return;

      const count = 10;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.2 + Math.random() * 2.8;
        this.particles.push({
          x: cellX,
          y: cellY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: 1.5 + Math.random() * 2,
          color: color,
          alpha: 0.9,
          decay: 0.035 + Math.random() * 0.025,
          gravity: 0.04
        });
      }

      this.startLoop();
    }

    // Trigger victory confetti/sparkle shower
    triggerVictory(centerX, centerY) {
      if (!this.shouldAnimate() || !this.ctx) return;

      const colors = ['#38bdf8', '#fbbf24', '#f43f5e', '#a855f7', '#34d399', '#ffffff'];
      const count = 65;

      const spawnX = centerX || this.width / 2;
      const spawnY = centerY || this.height / 2;

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2.5 + Math.random() * 6.5;
        this.particles.push({
          x: spawnX + (Math.random() - 0.5) * 60,
          y: spawnY + (Math.random() - 0.5) * 40,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2.5,
          radius: 2.0 + Math.random() * 3.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1.0,
          decay: 0.012 + Math.random() * 0.015,
          gravity: 0.12,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.2
        });
      }

      this.startLoop();
    }

    startLoop() {
      if (this.animationFrameId) return;
      this.loop();
    }

    loop() {
      if (!this.ctx) return;

      this.ctx.clearRect(0, 0, this.width, this.height);

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.98;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          this.particles.splice(i, 1);
          continue;
        }

        this.ctx.save();
        this.ctx.globalAlpha = Math.max(0, p.alpha);
        this.ctx.fillStyle = p.color;

        if (p.rotation !== undefined) {
          this.ctx.translate(p.x, p.y);
          p.rotation += p.rotSpeed;
          this.ctx.rotate(p.rotation);
          this.ctx.fillRect(-p.radius, -p.radius, p.radius * 2, p.radius * 1.5);
        } else {
          this.ctx.beginPath();
          this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          this.ctx.fill();
        }

        this.ctx.restore();
      }

      if (this.particles.length > 0) {
        this.animationFrameId = requestAnimationFrame(() => this.loop());
      } else {
        this.animationFrameId = null;
        this.ctx.clearRect(0, 0, this.width, this.height);
      }
    }

    clear() {
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }
      this.particles = [];
      if (this.ctx) {
        this.ctx.clearRect(0, 0, this.width, this.height);
      }
    }
  }

  window.TTTEffects = new EffectsEngine();
})();

