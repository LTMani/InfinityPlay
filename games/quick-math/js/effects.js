/**
 * Quick Math: Infinity Challenge - Visual Effects Engine
 * Ambient background particles, screen vibration, correct light pulse,
 * victory bursts, "PERFECT 100% ACCURACY" fireworks, and Championship fanfare.
 */

(function() {
  'use strict';

  const prefersReducedMotion = typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  const Effects = {
    canvas: null,
    ctx: null,
    particles: [],
    animId: null,
    motionEnabled: !prefersReducedMotion,

    init(canvasId = 'bgCanvas') {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.resize();
      window.addEventListener('resize', () => this.resize());
      this.createParticles(35);
      this.loop();
    },

    setMotionEnabled(val) {
      this.motionEnabled = !!val && !prefersReducedMotion;
    },

    resize() {
      if (!this.canvas) return;
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    },

    createParticles(count) {
      const symbols = ['+', '−', '×', '÷', '=', '∑', 'π', '∞', '√', '?'];
      this.particles = [];
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: Math.random() * (this.canvas ? this.canvas.width : 800),
          y: Math.random() * (this.canvas ? this.canvas.height : 600),
          size: 10 + Math.random() * 16,
          symbol: symbols[Math.floor(Math.random() * symbols.length)],
          vx: (Math.random() - 0.5) * 0.4,
          vy: -0.2 - Math.random() * 0.4,
          alpha: 0.03 + Math.random() * 0.08,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.01
        });
      }
    },

    loop() {
      if (!this.ctx || !this.canvas) return;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      if (this.motionEnabled) {
        this.ctx.font = '14px "JetBrains Mono", monospace';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        for (let i = 0; i < this.particles.length; i++) {
          const p = this.particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.rotation += p.vRot;

          if (p.y < -20) p.y = this.canvas.height + 20;
          if (p.x < -20) p.x = this.canvas.width + 20;
          if (p.x > this.canvas.width + 20) p.x = -20;

          this.ctx.save();
          this.ctx.translate(p.x, p.y);
          this.ctx.rotate(p.rotation);
          this.ctx.fillStyle = `rgba(0, 240, 255, ${p.alpha})`;
          this.ctx.fillText(p.symbol, 0, 0);
          this.ctx.restore();
        }
      }

      this.animId = requestAnimationFrame(() => this.loop());
    },

    triggerShake(containerId = 'gameContainer') {
      if (!this.motionEnabled) return;
      const el = document.getElementById(containerId);
      if (!el) return;

      el.classList.remove('effect-shake');
      void el.offsetWidth;
      el.classList.add('effect-shake');
      setTimeout(() => el.classList.remove('effect-shake'), 320);
    },

    triggerCorrectPulse(panelId = 'questionCard') {
      const el = document.getElementById(panelId);
      if (!el) return;

      el.classList.remove('effect-correct');
      void el.offsetWidth;
      el.classList.add('effect-correct');
      setTimeout(() => el.classList.remove('effect-correct'), 400);
    },

    triggerTimeoutFlash(panelId = 'questionCard') {
      const el = document.getElementById(panelId);
      if (!el) return;

      el.classList.remove('effect-timeout');
      void el.offsetWidth;
      el.classList.add('effect-timeout');
      setTimeout(() => el.classList.remove('effect-timeout'), 500);
    },

    burstVictory(x = window.innerWidth / 2, y = window.innerHeight / 2) {
      if (!this.motionEnabled || !this.ctx) return;
      const burstColors = ['#00f0ff', '#10b981', '#f59e0b', '#ec4899', '#ffffff'];
      const bursts = [];

      for (let i = 0; i < 60; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 3 + Math.random() * 6;
        bursts.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: burstColors[Math.floor(Math.random() * burstColors.length)],
          size: 4 + Math.random() * 4,
          alpha: 1,
          decay: 0.02 + Math.random() * 0.02
        });
      }

      const animateBurst = () => {
        let active = false;
        for (let b of bursts) {
          b.x += b.vx;
          b.y += b.vy;
          b.vy += 0.15;
          b.alpha -= b.decay;

          if (b.alpha > 0) {
            active = true;
            this.ctx.fillStyle = b.color;
            this.ctx.globalAlpha = Math.max(0, b.alpha);
            this.ctx.beginPath();
            this.ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
            this.ctx.fill();
          }
        }
        this.ctx.globalAlpha = 1;
        if (active) requestAnimationFrame(animateBurst);
      };
      animateBurst();
    },

    /**
     * Special celebration for 100% Accuracy rounds
     */
    triggerPerfectCelebration() {
      this.burstVictory(window.innerWidth * 0.35, window.innerHeight * 0.45);
      setTimeout(() => {
        this.burstVictory(window.innerWidth * 0.65, window.innerHeight * 0.45);
      }, 200);
      window.QuickMath.SoundFX?.playFanfare();

      // Show temporary screen banner if element exists
      const banner = document.getElementById('perfectBannerToast');
      if (banner) {
        banner.classList.remove('hidden');
        banner.classList.add('visible');
        setTimeout(() => {
          banner.classList.remove('visible');
          banner.classList.add('hidden');
        }, 3000);
      }
    },

    /**
     * Grand Championship victory fireworks for Level 100 clear
     */
    triggerChampionshipVictory() {
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          const rx = window.innerWidth * (0.2 + Math.random() * 0.6);
          const ry = window.innerHeight * (0.2 + Math.random() * 0.5);
          this.burstVictory(rx, ry);
        }, i * 350);
      }
      window.QuickMath.SoundFX?.playFanfare();
    }
  };

  window.QuickMath = window.QuickMath || {};
  window.QuickMath.Effects = Effects;
})();
