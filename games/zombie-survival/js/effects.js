/**
 * Zombie Survival V2 - Visual Effects & Camera Engine
 * Screen shake trauma, Day/Dusk/Night atmosphere, dynamic weather,
 * low-health vignette, directional damage feedback, and real-coordinate minimap radar.
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
    this.x += (this.targetX - this.x) * this.lerpSpeed;
    this.y += (this.targetY - this.y) * this.lerpSpeed;

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

    if (this.trauma > 0) {
      const shake = this.trauma * this.trauma;
      this.shakeX = (Math.random() * 2 - 1) * this.maxOffset * shake;
      this.shakeY = (Math.random() * 2 - 1) * this.maxOffset * shake;
      this.shakeAngle = (Math.random() * 2 - 1) * this.maxAngle * shake;
      this.trauma = Math.max(0, this.trauma - dt * 1.6);
    } else {
      this.shakeX = 0;
      this.shakeY = 0;
      this.shakeAngle = 0;
    }
  }

  apply(ctx) {
    ctx.save();
    ctx.translate(this.vw / 2 + this.shakeX, this.vh / 2 + this.shakeY);
    ctx.rotate(this.shakeAngle);
    ctx.scale(this.zoom, this.zoom);
    ctx.translate(-this.x, -this.y);
  }

  restore(ctx) {
    ctx.restore();
  }

  screenToWorld(sx, sy) {
    const cx = this.vw / 2;
    const cy = this.vh / 2;
    const wx = (sx - cx) / this.zoom + this.x;
    const wy = (sy - cy) / this.zoom + this.y;
    return { x: wx, y: wy };
  }

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
    this.rainDrops = [];
    this.hitFlashAlpha = 0;
    this.timeOfDay = 'day'; // day, dusk, night
    this.weather = 'clear';   // clear, rain, fog, storm
    this.lightningTimer = 0;
    this.lightningAlpha = 0;
    this.damageIndicators = []; // { angle, alpha }
  }

  init(bounds, timeOfDay = 'day', weather = 'clear') {
    this.timeOfDay = timeOfDay;
    this.weather = weather;
    this.lightningTimer = 4 + Math.random() * 8;
    this.lightningAlpha = 0;

    // Init Fog
    this.fogParticles = [];
    const fogCount = (weather === 'fog') ? 45 : 20;
    for (let i = 0; i < fogCount; i++) {
      this.fogParticles.push({
        x: bounds.minX + Math.random() * (bounds.maxX - bounds.minX),
        y: bounds.minY + Math.random() * (bounds.maxY - bounds.minY),
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.5) * 8,
        radius: 90 + Math.random() * 140,
        alpha: (weather === 'fog' ? 0.08 : 0.04) + Math.random() * 0.05
      });
    }

    // Init Rain
    this.rainDrops = [];
    if (weather === 'rain' || weather === 'storm') {
      const count = (weather === 'storm') ? 160 : 100;
      for (let i = 0; i < count; i++) {
        this.rainDrops.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          speed: 700 + Math.random() * 300,
          len: 15 + Math.random() * 12
        });
      }
    }
  }

  triggerHitFlash(alpha = 0.35) {
    this.hitFlashAlpha = Math.min(0.65, this.hitFlashAlpha + alpha);
  }

  addDamageIndicator(angle) {
    this.damageIndicators.push({ angle, alpha: 1.0 });
  }

  update(dt, bounds) {
    // Hit flash decay
    if (this.hitFlashAlpha > 0) {
      this.hitFlashAlpha = Math.max(0, this.hitFlashAlpha - dt * 2.4);
    }

    // Lightning in Storm
    if (this.weather === 'storm') {
      this.lightningTimer -= dt;
      if (this.lightningTimer <= 0) {
        this.lightningTimer = 5 + Math.random() * 7;
        this.lightningAlpha = 0.7;
        window.Sound._playNoise(0.5, 0.4, 180);
      }
      if (this.lightningAlpha > 0) {
        this.lightningAlpha = Math.max(0, this.lightningAlpha - dt * 3.5);
      }
    }

    // Damage indicators decay
    for (let i = this.damageIndicators.length - 1; i >= 0; i--) {
      const ind = this.damageIndicators[i];
      ind.alpha -= dt * 2.0;
      if (ind.alpha <= 0) this.damageIndicators.splice(i, 1);
    }

    // Update Fog particles
    for (let i = 0; i < this.fogParticles.length; i++) {
      const fog = this.fogParticles[i];
      fog.x += fog.vx * dt;
      fog.y += fog.vy * dt;

      if (fog.x < bounds.minX - 100) fog.x = bounds.maxX + 100;
      if (fog.x > bounds.maxX + 100) fog.x = bounds.minX - 100;
      if (fog.y < bounds.minY - 100) fog.y = bounds.maxY + 100;
      if (fog.y > bounds.maxY + 100) fog.y = bounds.minY - 100;
    }

    // Update Rain particles
    const w = window.innerWidth;
    const h = window.innerHeight;
    const slant = (this.weather === 'storm') ? 140 : 60;
    for (let i = 0; i < this.rainDrops.length; i++) {
      const drop = this.rainDrops[i];
      drop.y += drop.speed * dt;
      drop.x += slant * dt;

      if (drop.y > h) {
        drop.y = -20;
        drop.x = Math.random() * (w + 200) - 100;
      }
      if (drop.x > w + 100) {
        drop.x = -50;
      }
    }
  }

  // Dynamic Day/Dusk/Night atmospheric lighting overlay
  renderLighting(ctx, camera, player, lights = [], streetLamps = []) {
    let baseDarkness = 0.06; // Day default
    let tintColor = 'rgba(5, 8, 18, 0.08)';

    if (this.timeOfDay === 'dusk') {
      baseDarkness = 0.36;
      tintColor = 'rgba(25, 14, 28, 0.36)';
    } else if (this.timeOfDay === 'night') {
      baseDarkness = 0.68;
      tintColor = 'rgba(3, 5, 12, 0.68)';
    }

    ctx.save();
    ctx.fillStyle = tintColor;
    ctx.fillRect(
      camera.x - camera.vw,
      camera.y - camera.vh,
      camera.vw * 2,
      camera.vh * 2
    );

    // If dusk or night, cut out lights using destination-out
    if (this.timeOfDay !== 'day') {
      ctx.globalCompositeOperation = 'destination-out';

      // Player central light cone & flashlight
      if (player) {
        const pRadius = this.timeOfDay === 'night' ? 240 : 320;
        const playerGrad = ctx.createRadialGradient(
          player.x, player.y, 10,
          player.x, player.y, pRadius
        );
        playerGrad.addColorStop(0, 'rgba(0, 0, 0, 1.0)');
        playerGrad.addColorStop(0.7, 'rgba(0, 0, 0, 0.6)');
        playerGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = playerGrad;
        ctx.beginPath();
        ctx.arc(player.x, player.y, pRadius, 0, Math.PI * 2);
        ctx.fill();

        // Directional flashlight cone
        ctx.beginPath();
        ctx.moveTo(player.x, player.y);
        const spread = 0.58;
        const fRange = this.timeOfDay === 'night' ? 380 : 440;
        ctx.arc(player.x, player.y, fRange, player.angle - spread, player.angle + spread);
        ctx.closePath();
        const flashGrad = ctx.createRadialGradient(
          player.x, player.y, 20,
          player.x, player.y, fRange
        );
        flashGrad.addColorStop(0, 'rgba(0, 0, 0, 0.95)');
        flashGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = flashGrad;
        ctx.fill();
      }

      // Street lamps
      for (let i = 0; i < streetLamps.length; i++) {
        const lamp = streetLamps[i];
        const lampGrad = ctx.createRadialGradient(
          lamp.x, lamp.y, 5,
          lamp.x, lamp.y, lamp.radius || 170
        );
        lampGrad.addColorStop(0, 'rgba(0, 0, 0, 0.88)');
        lampGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = lampGrad;
        ctx.beginPath();
        ctx.arc(lamp.x, lamp.y, lamp.radius || 170, 0, Math.PI * 2);
        ctx.fill();
      }

      // Dynamic lights (projectiles, explosions, auras)
      for (let i = 0; i < lights.length; i++) {
        const lit = lights[i];
        const grad = ctx.createRadialGradient(
          lit.x, lit.y, 0,
          lit.x, lit.y, lit.radius || 70
        );
        grad.addColorStop(0, `rgba(0, 0, 0, ${lit.intensity || 0.85})`);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(lit.x, lit.y, lit.radius || 70, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();

    // Drifting Fog in world space
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

  // Screen-space overlays: rain, lightning, red damage vignette, directional indicator
  renderScreenOverlay(ctx, vw, vh, player) {
    // 1. Rain streaks
    if (this.weather === 'rain' || this.weather === 'storm') {
      ctx.save();
      ctx.strokeStyle = 'rgba(186, 230, 253, 0.35)';
      ctx.lineWidth = 1.2;
      const slant = (this.weather === 'storm') ? 6 : 2.5;
      ctx.beginPath();
      for (let i = 0; i < this.rainDrops.length; i++) {
        const d = this.rainDrops[i];
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + slant, d.y + d.len);
      }
      ctx.stroke();
      ctx.restore();
    }

    // 2. Storm Lightning Flash
    if (this.lightningAlpha > 0) {
      ctx.save();
      ctx.fillStyle = `rgba(255, 255, 255, ${this.lightningAlpha})`;
      ctx.fillRect(0, 0, vw, vh);
      ctx.restore();
    }

    // 3. Hit Flash (Red screen flash on receiving damage)
    if (this.hitFlashAlpha > 0) {
      ctx.save();
      ctx.fillStyle = `rgba(239, 68, 68, ${this.hitFlashAlpha})`;
      ctx.fillRect(0, 0, vw, vh);
      ctx.restore();
    }

    // 4. Low Health Vignette (Pulsing crimson border when HP < 30%)
    if (player && player.alive && (player.health / player.maxHealth) < 0.3) {
      const pulse = 0.5 + Math.sin(performance.now() * 0.008) * 0.3;
      ctx.save();
      const grad = ctx.createRadialGradient(
        vw / 2, vh / 2, Math.min(vw, vh) * 0.35,
        vw / 2, vh / 2, Math.max(vw, vh) * 0.75
      );
      grad.addColorStop(0, 'rgba(239, 68, 68, 0)');
      grad.addColorStop(1, `rgba(220, 38, 38, ${0.45 * pulse})`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, vw, vh);
      ctx.restore();
    }

    // 5. Directional Damage Arc
    if (this.damageIndicators.length > 0) {
      ctx.save();
      ctx.translate(vw / 2, vh / 2);
      for (let ind of this.damageIndicators) {
        ctx.rotate(ind.angle);
        ctx.strokeStyle = `rgba(239, 68, 68, ${ind.alpha})`;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(0, 0, 90, -0.3, 0.3);
        ctx.stroke();
        ctx.rotate(-ind.angle);
      }
      ctx.restore();
    }
  }

  // Real-Coordinate Minimap Radar Renderer
  renderMinimap(canvas, map, player, zombies, objectiveBeacons = []) {
    if (!canvas || !map) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const scaleX = cw / map.width;
    const scaleY = ch / map.height;

    // Clear minimap background
    ctx.fillStyle = '#060a12';
    ctx.fillRect(0, 0, cw, ch);

    // Subtle map border
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(0, 0, cw, ch);

    // Draw obstacles
    if (map.obstacles) {
      ctx.fillStyle = '#1e293b';
      for (let o of map.obstacles) {
        ctx.fillRect(o.x * scaleX, o.y * scaleY, o.w * scaleX, o.h * scaleY);
      }
    }

    // Draw Objective Beacons / Exit
    for (let b of objectiveBeacons) {
      if (b.isExit) {
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.arc(b.x * scaleX, b.y * scaleY, 5, 0, Math.PI * 2);
        ctx.fill();
      } else if (!b.collected) {
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect((b.x - 8) * scaleX, (b.y - 8) * scaleY, 4, 4);
      }
    }

    // Draw Zombies (red dots, bosses as larger pulsing crimson icons)
    if (zombies) {
      for (let z of zombies) {
        if (!z.alive) continue;
        const zx = z.x * scaleX;
        const zy = z.y * scaleY;
        if (z.isBoss) {
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(zx, zy, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1;
          ctx.stroke();
        } else {
          ctx.fillStyle = (z.type === 'tank' || z.type === 'elite') ? '#c084fc' : '#f87171';
          ctx.fillRect(zx - 1.5, zy - 1.5, 3, 3);
        }
      }
    }

    // Draw Player (cyan triangle pointing in aim direction)
    if (player && player.alive) {
      const px = player.x * scaleX;
      const py = player.y * scaleY;
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(player.angle);
      ctx.fillStyle = '#00f0ff';
      ctx.beginPath();
      ctx.moveTo(6, 0);
      ctx.lineTo(-4, -4);
      ctx.lineTo(-2, 0);
      ctx.lineTo(-4, 4);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }
}

window.Camera = Camera;
window.EnvironmentEffects = EnvironmentEffects;
