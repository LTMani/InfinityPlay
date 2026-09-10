/**
 * InfinityPlay Ultimate Racing - Particle System
 * High performance pooled particle engine for tire smoke, nitro flame, sparks, rain, and speed lines
 */

(function() {
  class Particle {
    constructor() {
      this.active = false;
      this.type = 'smoke'; // 'smoke', 'nitro', 'spark', 'debris', 'rain', 'speedline'
      this.x = 0;
      this.y = 0;
      this.z = 0;
      this.vx = 0;
      this.vy = 0;
      this.vz = 0;
      this.size = 2;
      this.color = '#ffffff';
      this.alpha = 1.0;
      this.life = 1.0;
      this.maxLife = 1.0;
    }
  }

  class ParticleSystem {
    constructor() {
      this.maxParticles = 350;
      this.pool = [];
      for (let i = 0; i < this.maxParticles; i++) {
        this.pool.push(new Particle());
      }
      // Speed lines fixed pool
      this.speedLines = [];
      for (let i = 0; i < 40; i++) {
        this.speedLines.push({
          x: (Math.random() - 0.5) * 2.5,
          y: Math.random() * 0.8 + 0.1,
          len: Math.random() * 80 + 40,
          alpha: Math.random() * 0.4 + 0.1
        });
      }
      // Weather persistent particles (snow, dust, ash)
      this.weatherParticles = [];
      for (let i = 0; i < 60; i++) {
        this.weatherParticles.push({
          x: Math.random(),
          y: Math.random(),
          speed: 0.3 + Math.random() * 0.7,
          size: 1.5 + Math.random() * 2.5,
          wobble: Math.random() * Math.PI * 2
        });
      }
    }

    getFreeParticle() {
      for (let i = 0; i < this.pool.length; i++) {
        if (!this.pool[i].active) return this.pool[i];
      }
      return null;
    }

    spawnTireSmoke(x, z, intensity = 1.0) {
      const count = Math.min(4, Math.round(intensity * 3));
      for (let i = 0; i < count; i++) {
        const p = this.getFreeParticle();
        if (!p) break;
        p.active = true;
        p.type = 'smoke';
        p.x = x + (Math.random() - 0.5) * 0.15;
        p.y = 0.05 + Math.random() * 0.05;
        p.z = z - 20 - Math.random() * 30;
        p.vx = (Math.random() - 0.5) * 0.4;
        p.vy = 0.3 + Math.random() * 0.4;
        p.vz = -50 - Math.random() * 50;
        p.size = 8 + Math.random() * 10;
        p.color = 'rgba(200, 215, 235, 0.7)';
        p.alpha = 0.6;
        p.life = 0;
        p.maxLife = 0.45 + Math.random() * 0.3;
      }
    }

    spawnNitroFlame(x, z, flameColor = '#00f0ff') {
      for (let i = 0; i < 3; i++) {
        const p = this.getFreeParticle();
        if (!p) break;
        p.active = true;
        p.type = 'nitro';
        // Tail exhaust left/right
        const sideOffset = (Math.random() > 0.5 ? 0.08 : -0.08);
        p.x = x + sideOffset + (Math.random() - 0.5) * 0.04;
        p.y = 0.12 + Math.random() * 0.06;
        p.z = z - 40 - Math.random() * 20;
        p.vx = (Math.random() - 0.5) * 0.2;
        p.vy = (Math.random() - 0.5) * 0.2;
        p.vz = -200 - Math.random() * 150;
        p.size = 12 + Math.random() * 12;
        p.color = flameColor;
        p.alpha = 0.9;
        p.life = 0;
        p.maxLife = 0.2 + Math.random() * 0.15;
      }
    }

    spawnSparks(x, z, count = 15) {
      for (let i = 0; i < count; i++) {
        const p = this.getFreeParticle();
        if (!p) break;
        p.active = true;
        p.type = 'spark';
        p.x = x + (Math.random() - 0.5) * 0.2;
        p.y = 0.1 + Math.random() * 0.3;
        p.z = z + (Math.random() - 0.5) * 40;
        p.vx = (Math.random() - 0.5) * 2.5;
        p.vy = 1.0 + Math.random() * 2.0;
        p.vz = (Math.random() - 0.5) * 300;
        p.size = 2 + Math.random() * 2.5;
        p.color = Math.random() > 0.3 ? '#fef08a' : '#93c5fd';
        p.alpha = 1.0;
        p.life = 0;
        p.maxLife = 0.25 + Math.random() * 0.2;
      }
    }

    spawnDebris(x, z, count = 8) {
      for (let i = 0; i < count; i++) {
        const p = this.getFreeParticle();
        if (!p) break;
        p.active = true;
        p.type = 'debris';
        p.x = x + (Math.random() - 0.5) * 0.3;
        p.y = 0.15 + Math.random() * 0.4;
        p.z = z + (Math.random() - 0.5) * 50;
        p.vx = (Math.random() - 0.5) * 1.8;
        p.vy = 1.2 + Math.random() * 1.5;
        p.vz = -100 - Math.random() * 150;
        p.size = 4 + Math.random() * 5;
        p.color = Math.random() > 0.5 ? '#64748b' : '#334155';
        p.alpha = 0.9;
        p.life = 0;
        p.maxLife = 0.35 + Math.random() * 0.25;
      }
    }

    spawnOffroadDust(x, z) {
      const p = this.getFreeParticle();
      if (!p) return;
      p.active = true;
      p.type = 'smoke';
      p.x = x + (Math.random() - 0.5) * 0.2;
      p.y = 0.05 + Math.random() * 0.05;
      p.z = z - 20;
      p.vx = (Math.random() - 0.5) * 0.6;
      p.vy = 0.2 + Math.random() * 0.3;
      p.vz = -40;
      p.size = 10 + Math.random() * 10;
      p.color = 'rgba(180, 150, 110, 0.6)';
      p.alpha = 0.5;
      p.life = 0;
      p.maxLife = 0.4;
    }

    update(dt) {
      for (let i = 0; i < this.pool.length; i++) {
        const p = this.pool[i];
        if (!p.active) continue;

        p.life += dt;
        if (p.life >= p.maxLife) {
          p.active = false;
          continue;
        }

        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.z += p.vz * dt;

        if (p.type === 'spark' || p.type === 'debris') {
          p.vy -= 9.8 * dt; // gravity
        } else if (p.type === 'smoke') {
          p.size += 15 * dt; // expand
        }

        const progress = p.life / p.maxLife;
        p.alpha = Math.max(0, 1.0 - progress);
      }

      // Update screen weather positions
      for (let i = 0; i < this.weatherParticles.length; i++) {
        const wp = this.weatherParticles[i];
        wp.y += wp.speed * dt * 0.35;
        wp.wobble += dt * 2.0;
        if (wp.y > 1.05) {
          wp.y = -0.05;
          wp.x = Math.random();
        }
      }
    }

    renderScreenParticles(ctx, width, height, weatherOrConfig, isSpeeding, isNitro) {
      let hasRain = false;
      let hasSnow = false;
      let hasDust = false;
      let hasAsh = false;

      if (typeof weatherOrConfig === 'boolean') {
        hasRain = weatherOrConfig;
      } else if (weatherOrConfig && typeof weatherOrConfig === 'object') {
        hasRain = Boolean(weatherOrConfig.hasRain || weatherOrConfig.weather === 'rain');
        hasSnow = Boolean(weatherOrConfig.hasSnow || weatherOrConfig.weather === 'snow');
        hasDust = Boolean(weatherOrConfig.hasDust || weatherOrConfig.weather === 'dust');
        hasAsh = Boolean(weatherOrConfig.hasAsh || weatherOrConfig.weather === 'ash');
      }

      // 1. Rain effects (Neon City, Cyberpunk District)
      if (hasRain) {
        ctx.strokeStyle = 'rgba(200, 220, 245, 0.25)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        const rainCount = 45;
        for (let i = 0; i < rainCount; i++) {
          const rx = Math.random() * width;
          const ry = Math.random() * height;
          ctx.moveTo(rx, ry);
          ctx.lineTo(rx - 8, ry + 22);
        }
        ctx.stroke();
      }

      // 2. Snow effects (Arctic Run)
      if (hasSnow) {
        ctx.save();
        ctx.fillStyle = 'rgba(240, 248, 255, 0.85)';
        for (let i = 0; i < this.weatherParticles.length; i++) {
          const wp = this.weatherParticles[i];
          const px = (wp.x * width + Math.sin(wp.wobble) * 12) % width;
          const py = wp.y * height;
          ctx.beginPath();
          ctx.arc(px, py, wp.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // 3. Dust / Sandstorm haze (Desert Storm)
      if (hasDust) {
        ctx.save();
        ctx.fillStyle = 'rgba(245, 180, 80, 0.45)';
        for (let i = 0; i < this.weatherParticles.length; i++) {
          const wp = this.weatherParticles[i];
          const px = (wp.x * width + wp.y * 80) % width;
          const py = wp.y * height;
          ctx.beginPath();
          ctx.arc(px, py, wp.size * 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // 4. Ash & glowing embers (Volcanic Circuit)
      if (hasAsh) {
        ctx.save();
        for (let i = 0; i < this.weatherParticles.length; i++) {
          const wp = this.weatherParticles[i];
          const px = (wp.x * width + Math.cos(wp.wobble) * 15) % width;
          const py = (1.0 - wp.y) * height; // rise upwards
          ctx.fillStyle = i % 2 === 0 ? 'rgba(255, 120, 30, 0.85)' : 'rgba(120, 113, 108, 0.6)';
          ctx.beginPath();
          ctx.arc(px, py, wp.size * 1.1, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // 2. High-speed streaks / Nitro tunnel lines
      if (isSpeeding || isNitro) {
        ctx.save();
        const centerX = width / 2;
        const centerY = height * 0.52;
        const strokeColor = isNitro ? 'rgba(0, 240, 255, 0.45)' : 'rgba(255, 255, 255, 0.2)';
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = isNitro ? 2.5 : 1.5;

        for (const line of this.speedLines) {
          const sx = centerX + line.x * width * 0.4;
          const sy = centerY - line.y * height * 0.4;
          const dirX = sx - centerX;
          const dirY = sy - centerY;
          const dist = Math.sqrt(dirX * dirX + dirY * dirY);
          if (dist > 20) {
            const nx = dirX / dist;
            const ny = dirY / dist;
            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.lineTo(sx + nx * line.len, sy + ny * line.len);
            ctx.stroke();
          }
        }
        ctx.restore();
      }
    }

    clear() {
      for (const p of this.pool) {
        p.active = false;
      }
    }
  }

  window.UR = window.UR || {};
  window.UR.ParticleSystem = ParticleSystem;
})();

