/**
 * Zombie Survival - Player Character Controller
 * Survivor physics, weapons, dash ability, stamina, health/armor absorption, and rendering.
 */

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.angle = 0;
    this.radius = 18;

    // Load upgraded stats
    this.refreshStats();

    this.health = this.maxHealth;
    this.armor = this.maxArmor;
    this.stamina = this.maxStamina;

    // Weapon state
    this.weapon = null;
    this.ammo = 15;
    this.maxAmmo = 15;
    this.reserveAmmo = 120;
    this.fireTimer = 0;
    this.isReloading = false;
    this.reloadTimer = 0;

    // Active Skill state
    this.selectedSkill = window.Storage.data.equippedSkill || 'dash';
    this.skillCooldownTimer = 0;
    this.skillCooldownDuration = this.dashCooldown;
    this.isDashing = false;
    this.dashTimer = 0;
    this.dashVx = 0;
    this.dashVy = 0;
    this.invulnerableTimer = 0;

    // Shield ability
    this.isShieldActive = false;
    this.shieldDurationTimer = 0;

    // Healing nanite
    this.isHealing = false;
    this.healTimer = 0;

    // Stats & Tracking
    this.kills = 0;
    this.shotsFired = 0;
    this.shotsHit = 0;
    this.score = 0;
    this.coinsCollected = 0;
    this.xpCollected = 0;
    this.alive = true;

    // Dash trail history
    this.trail = [];

    // Equip current weapon
    this.equipWeapon(window.Storage.data.equippedWeapon || 'starter');
  }

  refreshStats() {
    const stats = window.Upgrades.getPlayerStats();
    this.maxHealth = stats.maxHealth;
    this.maxArmor = stats.maxArmor;
    this.baseSpeed = stats.moveSpeed;
    this.maxStamina = stats.maxStamina;
    this.dashCooldown = stats.dashCooldown;
    this.critChance = stats.critChance;
  }

  equipWeapon(weaponId) {
    this.weapon = window.Upgrades.getModifiedWeapon(weaponId);
    this.ammo = this.weapon.ammo;
    this.maxAmmo = this.weapon.maxAmmo;
    this.reserveAmmo = this.weapon.reserveAmmo;
    this.isReloading = false;
    this.reloadTimer = 0;
    this.fireTimer = 0;
  }

  takeDamage(amount) {
    if (!this.alive || this.invulnerableTimer > 0) return 0;

    // If shield skill is active, absorb completely!
    if (this.isShieldActive) {
      window.Sound.playHit(false, true);
      if (window.gameInstance && window.gameInstance.particles) {
        window.gameInstance.particles.createHitSparks(this.x, this.y, 0, '#38bdf8', 6);
      }
      return 0;
    }

    // Camera shake and hit flash
    if (window.gameInstance) {
      if (window.gameInstance.camera) window.gameInstance.camera.addTrauma(0.35);
      if (window.gameInstance.effects) window.gameInstance.effects.triggerHitFlash(0.35);
    }

    window.Sound.playHit(false, false);

    // Armor absorbs 70% of damage
    let actualDamage = amount;
    if (this.armor > 0) {
      const absorbed = Math.min(this.armor, amount * 0.7);
      this.armor -= absorbed;
      actualDamage -= absorbed;
    }

    this.health = Math.max(0, this.health - actualDamage);
    this.invulnerableTimer = 0.25; // Brief i-frames

    if (this.health <= 0) {
      this.health = 0;
      this.alive = false;
      window.Sound.playGameOver();
    }

    return actualDamage;
  }

  triggerAbility() {
    if (this.skillCooldownTimer > 0 || !this.alive) return false;

    const skill = this.selectedSkill;
    if (skill === 'dash') {
      // Dash roll
      if (this.stamina < 20) return false;
      this.stamina -= 20;
      this.isDashing = true;
      this.dashTimer = 0.22;
      this.invulnerableTimer = 0.3;
      const speed = this.baseSpeed * 3.0;

      // Dash direction (towards movement or aim)
      let moveAngle = this.angle;
      if (Math.hypot(this.vx, this.vy) > 10) {
        moveAngle = Math.atan2(this.vy, this.vx);
      }
      this.dashVx = Math.cos(moveAngle) * speed;
      this.dashVy = Math.sin(moveAngle) * speed;

      window.Sound.playDash();
      this.skillCooldownTimer = this.dashCooldown;
      return true;
    } else if (skill === 'shield') {
      // Energy Shield Barrier
      this.isShieldActive = true;
      this.shieldDurationTimer = 4.5;
      window.Sound.playShield();
      this.skillCooldownTimer = 12.0;
      return true;
    } else if (skill === 'emp') {
      // EMP Blast: stun all zombies on screen
      window.Sound.playEMP();
      if (window.gameInstance) {
        window.gameInstance.particles.createShockwave(this.x, this.y, '#38bdf8', 280, 0.5);
        if (window.gameInstance.zombies) {
          for (let z of window.gameInstance.zombies) {
            z.applySlow(5.0, 0.2); // Heavy slow
            z.takeDamage(40);
          }
        }
      }
      this.skillCooldownTimer = 16.0;
      return true;
    } else if (skill === 'heal') {
      // Nanite Heal
      this.isHealing = true;
      this.healTimer = 3.0;
      window.Sound.playPickup('health');
      this.skillCooldownTimer = 18.0;
      return true;
    } else if (skill === 'burst') {
      // Omnidirectional Energy Burst
      window.Sound.playShoot('burst');
      if (window.gameInstance) {
        window.gameInstance.particles.createShockwave(this.x, this.y, '#f43f5e', 200, 0.4);
        // Spawn 16 radial projectiles
        for (let i = 0; i < 16; i++) {
          const a = (Math.PI * 2 / 16) * i;
          window.gameInstance.projectiles.push(new Projectile(
            this.x, this.y, a,
            { damage: 85, speed: 500, range: 260, bulletColor: '#f43f5e', trailColor: 'rgba(244, 63, 94, 0.4)' },
            false, 'player'
          ));
        }
      }
      this.skillCooldownTimer = 14.0;
      return true;
    }

    return false;
  }

  reload() {
    if (this.isReloading || this.ammo >= this.maxAmmo || this.reserveAmmo <= 0) return;
    this.isReloading = true;
    this.reloadTimer = this.weapon.reloadTime;
    window.Sound.playReload();
  }

  shoot(projectilesList) {
    if (!this.alive || this.isReloading) return false;

    if (this.ammo <= 0) {
      this.reload();
      return false;
    }

    if (this.fireTimer > 0) return false;

    this.fireTimer = 1.0 / this.weapon.fireRate;
    this.ammo--;
    this.shotsFired++;

    window.Sound.playShoot(this.weapon.soundType);

    // Muzzle flash / screenshake
    if (window.gameInstance && window.gameInstance.camera) {
      window.gameInstance.camera.addTrauma(0.08);
    }

    const isCrit = Math.random() < this.critChance;
    const barrelLength = 26;
    const spawnX = this.x + Math.cos(this.angle) * barrelLength;
    const spawnY = this.y + Math.sin(this.angle) * barrelLength;

    if (this.weapon.pellets) {
      // Shotgun / Scatter / Radial
      for (let i = 0; i < this.weapon.pellets; i++) {
        let shotAngle;
        if (this.weapon.isRadial) {
          shotAngle = (Math.PI * 2 / this.weapon.pellets) * i;
        } else {
          const spreadOffset = (Math.random() - 0.5) * this.weapon.spread * 2;
          shotAngle = this.angle + spreadOffset;
        }
        projectilesList.push(new Projectile(spawnX, spawnY, shotAngle, this.weapon, isCrit, 'player'));
      }
    } else {
      // Single precision projectile
      const spreadOffset = (Math.random() - 0.5) * (this.weapon.spread || 0) * 2;
      projectilesList.push(new Projectile(spawnX, spawnY, this.angle + spreadOffset, this.weapon, isCrit, 'player'));
    }

    // Auto-reload on empty clip
    if (this.ammo <= 0 && window.Storage.data.settings.autoReload) {
      this.reload();
    }

    return true;
  }

  update(dt, input, mapBounds, obstacles) {
    if (!this.alive) return;

    // Timers
    if (this.fireTimer > 0) this.fireTimer -= dt;
    if (this.invulnerableTimer > 0) this.invulnerableTimer -= dt;
    if (this.skillCooldownTimer > 0) this.skillCooldownTimer -= dt;

    // Reload completion
    if (this.isReloading) {
      this.reloadTimer -= dt;
      if (this.reloadTimer <= 0) {
        this.isReloading = false;
        const needed = this.maxAmmo - this.ammo;
        const take = Math.min(needed, this.reserveAmmo);
        this.ammo += take;
        this.reserveAmmo -= take;
      }
    }

    // Shield skill duration
    if (this.isShieldActive) {
      this.shieldDurationTimer -= dt;
      if (this.shieldDurationTimer <= 0) {
        this.isShieldActive = false;
      }
    }

    // Nanite heal tick
    if (this.isHealing) {
      this.healTimer -= dt;
      this.health = Math.min(this.maxHealth, this.health + 15 * dt);
      if (this.healTimer <= 0) this.isHealing = false;
    }

    // Stamina regeneration
    if (this.stamina < this.maxStamina && !this.isDashing) {
      this.stamina = Math.min(this.maxStamina, this.stamina + 20 * dt);
    }

    // Manage dash movement
    if (this.isDashing) {
      this.dashTimer -= dt;
      this.x += this.dashVx * dt;
      this.y += this.dashVy * dt;

      // Particle trail
      this.trail.push({ x: this.x, y: this.y, alpha: 0.6 });
      if (this.trail.length > 5) this.trail.shift();

      if (this.dashTimer <= 0) {
        this.isDashing = false;
        this.trail = [];
      }
    } else {
      // Standard input movement
      let mx = 0;
      let my = 0;
      if (input.up) my -= 1;
      if (input.down) my += 1;
      if (input.left) mx -= 1;
      if (input.right) mx += 1;

      // Virtual joystick
      if (input.joystickActive) {
        mx = input.joystickX;
        my = input.joystickY;
      }

      const len = Math.hypot(mx, my);
      if (len > 0) {
        const nx = mx / (input.joystickActive ? 1 : len);
        const ny = my / (input.joystickActive ? 1 : len);
        this.vx = nx * this.baseSpeed;
        this.vy = ny * this.baseSpeed;
      } else {
        this.vx *= 0.8;
        this.vy *= 0.8;
      }

      this.x += this.vx * dt;
      this.y += this.vy * dt;
    }

    // Aiming angle
    if (input.aimAngle !== undefined && input.aimActive) {
      this.angle = input.aimAngle;
    } else if (input.targetWorldX !== undefined && input.targetWorldY !== undefined) {
      this.angle = Math.atan2(input.targetWorldY - this.y, input.targetWorldX - this.x);
    }

    // Collision with obstacles
    if (obstacles) {
      for (let i = 0; i < obstacles.length; i++) {
        Collision.resolveCircleRect(this, obstacles[i]);
      }
    }

    // Map bounds clamp
    Collision.clampToBounds(this, mapBounds);
  }

  render(ctx) {
    if (!this.alive) return;

    ctx.save();

    // Dash ghost trail
    if (this.trail.length > 0) {
      for (let i = 0; i < this.trail.length; i++) {
        const pt = this.trail[i];
        ctx.save();
        ctx.translate(pt.x, pt.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = `rgba(0, 240, 255, ${0.15 * (i + 1)})`;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    ctx.translate(this.x, this.y);

    // Active Shield Sphere
    if (this.isShieldActive) {
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 4;
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius + 12, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
      ctx.fill();
    }

    // Invulnerability flicker
    if (this.invulnerableTimer > 0 && Math.floor(Date.now() / 60) % 2 === 0) {
      ctx.globalAlpha = 0.5;
    }

    ctx.rotate(this.angle);

    // Survivor Body
    ctx.fillStyle = '#1e293b'; // Tactical suit
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // Cyber armor chest plate
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.arc(-2, 0, this.radius * 0.75, 0, Math.PI * 2);
    ctx.fill();

    // Helmet / Visor
    ctx.fillStyle = '#00f0ff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(this.radius * 0.35, 0, this.radius * 0.35, -Math.PI / 2, Math.PI / 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Weapon barrel extending outward
    ctx.fillStyle = '#475569';
    ctx.fillRect(8, -4, 18, 8);

    // Weapon muzzle tip glowing with weapon energy color
    ctx.fillStyle = (this.weapon && this.weapon.bulletColor) || '#00f0ff';
    ctx.fillRect(24, -3, 4, 6);

    ctx.restore();
  }
}

window.Player = Player;

