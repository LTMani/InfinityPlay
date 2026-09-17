/**
 * Zombie Survival - Visual Effects & Camera Engine
 * Screen shake trauma, hit flashes, atmospheric lighting, and smooth camera tracking.
 */

class Camera {
  constructor(viewportWidth, viewportHeight) {
    this.x = 0;
    this.y = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.vw = viewportWidth;
    this.vh = viewportHeight;
    this.bounds = { minX: 0, minY: 0, maxX: 2000, maxY: 2000 };
    this.zoom = 1;
    this.lerpSpeed = 0.12;

    // Shake
    this.trauma = 0; // 0 to 1
    this.maxAngle = 0.05; // radians
    this.maxOffset = 18;  // pixels
    this.shakeX = 0;
    this.shakeY = 0;
    this.shakeAngle = 0;
  }

  resize(w, h) {
    this.vw = w;
    this.vh = h;
  }

  setBounds(bounds) {
    this.bounds = bounds;
  }

  addTrauma(amt) {
    this.trauma = Math.min(1, this.trauma + amt);
  }

  follow(targetX, targetY) {
    this.targetX = targetX;
    this.targetY = targetY;
  }

  update(dt) {
    // Smooth camera lag
    this.x += (this.targetX - this.x) * this.lerpSpeed;
    this.y += (this.targetY - this.y) * this.lerpSpeed;

    // Clamp camera within map bounds
    const halfW = (this.vw / 2) / this.zoom;
    const halfH = (this.vh / 2) / this.zoom;

    if (this.bounds.maxX - this.bounds.minX > this.vw) {
      this.x = Math.max(this.bounds.minX + halfW, Math.min(this.bounds.maxX - halfW, this.x));
    } else {
      this.x = (this.bounds.minX + this.bounds.maxX) / 2;
    }

    if (this.bounds.maxY - this.bounds.minY > this.vh) {
      this.y = Math.max(this.bounds.minY + halfH, Math.min(this.bounds.maxY - halfH, this.y));
    } else {
      this.y = (this.bounds.minY + this.bounds.maxY) / 2;
    }

    // Screen shake calculation: offset = trauma^2 * maxOffset
    if (this.trauma > 0) {
      const shake = this.trauma * this.trauma;
      this.shakeX = (Math.random() * 2 - 1) * this.maxOffset * shake;
      this.shakeY = (Math.random() * 2 - 1) * this.maxOffset * shake;
      this.shakeAngle = (Math.random() * 2 - 1) * this.maxAngle * shake;
      this.trauma = Math.max(0, this.trauma - dt * 1.5);
    } else {
      this.shakeX = 0;
      this.shakeY = 0;
      this.shakeAngle = 0;
    }
  }

  // Applies camera matrix translation and shake to Canvas Context
  apply(ctx) {
    ctx.save();
    ctx.translate(this.vw / 2 + this.shakeX, this.vh / 2 + this.shakeY);
    ctx.rotate(this.shakeAngle);
    ctx.scale(this.zoom, this.zoom);
    ctx.translate(-this.x, -this.y);
  }

  // Restores Context
  restore(ctx) {
    ctx.restore();
  }

  // Convert Screen pixel coordinates to World coordinates
  screenToWorld(sx, sy) {
    const cx = this.vw / 2;
    const cy = this.vh / 2;
    const wx = (sx - cx) / this.zoom + this.x;
    const wy = (sy - cy) / this.zoom + this.y;
    return { x: wx, y: wy };
  }

  // Convert World coordinates to Screen pixel coordinates
  worldToScreen(wx, wy) {
    const cx = this.vw / 2;
    const cy = this.vh / 2;
    const sx = (wx - this.x) * this.zoom + cx;
    const sy = (wy - this.y) * this.zoom + cy;
    return { x: sx, y: sy };
  }
}

class EnvironmentEffects {
  constructor() {
    this.fogParticles = [];
    this.hitFlashAlpha = 0;
    this.nightDarkness = 0.55; // Dark abandoned ambiance
  }

  initFog(bounds, count = 25) {
    this.fogParticles = [];
    for (let i = 0; i < count; i++) {
      this.fogParticles.push({
        x: bounds.minX + Math.random() * (bounds.maxX - bounds.minX),
        y: bounds.minY + Math.random() * (bounds.maxY - bounds.minY),
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 6,
        radius: 80 + Math.random() * 120,
        alpha: 0.04 + Math.random() * 0.06
      });
    }
  }

  triggerHitFlash(alpha = 0.35) {
    this.hitFlashAlpha = Math.min(0.6, this.hitFlashAlpha + alpha);
  }

  update(dt, bounds) {
    // Decay hit flash
    if (this.hitFlashAlpha > 0) {
      this.hitFlashAlpha = Math.max(0, this.hitFlashAlpha - dt * 2.2);
    }

    // Drift fog
    for (let i = 0; i < this.fogParticles.length; i++) {
      const fog = this.fogParticles[i];
      fog.x += fog.vx * dt;
      fog.y += fog.vy * dt;

      if (fog.x < bounds.minX - 100) fog.x = bounds.maxX + 100;
      if (fog.x > bounds.maxX + 100) fog.x = bounds.minX - 100;
      if (fog.y < bounds.minY - 100) fog.y = bounds.maxY + 100;
      if (fog.y > bounds.maxY + 100) fog.y = bounds.minY - 100;
    }
  }

  // Renders dynamic atmospheric darkness layer with light cutouts
  renderLighting(ctx, camera, player, lights = [], streetLamps = []) {
    // Screen darkness canvas overlay
    ctx.save();
    ctx.fillStyle = `rgba(5, 8, 18, ${this.nightDarkness})`;
    ctx.fillRect(
      camera.x - camera.vw,
      camera.y - camera.vh,
      camera.vw * 2,
      camera.vh * 2
    );

    // Cut out player flashlight / vision circle
    ctx.globalCompositeOperation = 'destination-out';

    // Player central light cone
    if (player) {
      const playerGrad = ctx.createRadialGradient(
        player.x, player.y, 10,
        player.x, player.y, 220
      );
      playerGrad.addColorStop(0, 'rgba(0, 0, 0, 1.0)');
      playerGrad.addColorStop(0.7, 'rgba(0, 0, 0, 0.6)');
      playerGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = playerGrad;
      ctx.beginPath();
      ctx.arc(player.x, player.y, 220, 0, Math.PI * 2);
      ctx.fill();

      // Directional flashlight cone
      ctx.beginPath();
      ctx.moveTo(player.x, player.y);
      const spread = 0.55; // Radians
      ctx.arc(player.x, player.y, 340, player.angle - spread, player.angle + spread);
      ctx.closePath();
      const flashGrad = ctx.createRadialGradient(
        player.x, player.y, 20,
        player.x, player.y, 340
      );
      flashGrad.addColorStop(0, 'rgba(0, 0, 0, 0.9)');
      flashGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = flashGrad;
      ctx.fill();
    }

    // Street lamps / static lights
    for (let i = 0; i < streetLamps.length; i++) {
      const lamp = streetLamps[i];
      const lampGrad = ctx.createRadialGradient(
        lamp.x, lamp.y, 5,
        lamp.x, lamp.y, lamp.radius || 140
      );
      lampGrad.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
      lampGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = lampGrad;
      ctx.beginPath();
      ctx.arc(lamp.x, lamp.y, lamp.radius || 140, 0, Math.PI * 2);
      ctx.fill();
    }

    // Dynamic lights (projectiles, muzzle flashes, boss auras)
    for (let i = 0; i < lights.length; i++) {
      const lit = lights[i];
      const grad = ctx.createRadialGradient(
        lit.x, lit.y, 0,
        lit.x, lit.y, lit.radius || 60
      );
      grad.addColorStop(0, `rgba(0, 0, 0, ${lit.intensity || 0.8})`);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(lit.x, lit.y, lit.radius || 60, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();

    // Subtle drifting fog
    ctx.save();
    for (let i = 0; i < this.fogParticles.length; i++) {
      const f = this.fogParticles[i];
      ctx.fillStyle = `rgba(148, 163, 184, ${f.alpha})`;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  renderScreenOverlay(ctx, vw, vh) {
    if (this.hitFlashAlpha > 0) {
      ctx.save();
      ctx.fillStyle = `rgba(239, 68, 68, ${this.hitFlashAlpha})`;
      ctx.fillRect(0, 0, vw, vh);
      ctx.restore();
    }
  }
}

window.Camera = Camera;
window.EnvironmentEffects = EnvironmentEffects;

