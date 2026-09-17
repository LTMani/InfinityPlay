/**
 * Zombie Survival V2 - Player Character Controller
 * Smooth acceleration/deceleration physics, normalized diagonal movement, wall-safe dash sub-stepping,
 * knockback recoil, weapon modifiers, and damage feedback.
 */

class PlayerV2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.ax = 0;
    this.ay = 0;
    this.angle = 0;
    this.radius = 18;

    // Movement physics parameters
    this.friction = 0.82;
    this.accelerationRate = 18.0;

    // Load upgraded stats
    this.refreshStats();

    this.health = this.maxHealth;
    this.armor = this.maxArmor;
    this.stamina = this.maxStamina;

    // Weapon state
    this.weapon = null;
    this.ammo = 16;
    this.maxAmmo = 16;
    this.reserveAmmo = 140;
    this.fireTimer = 0;
    this.isReloading = false;
    this.reloadTimer = 0;

    // Dash state
    this.selectedSkill = window.Storage.data.equippedSkill || 'dash';
    this.skillCooldownTimer = 0;
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

    // Temporary Boosts (from V2 pickups)
    this.tempBoosts = {
      speed: 0,
      damage: 0,
      dash: 0
    };

    // Tracking & Stats
    this.kills = 0;
    this.shotsFired = 0;
    this.shotsHit = 0;
    this.score = 0;
    this.coinsCollected = 0;
    this.xpCollected = 0;
    this.alive = true;

    // Hit direction feedback (radians)
    this.lastHitAngle = null;
    this.hitFeedbackTimer = 0;

    this.trail = [];

    // Equip currently selected weapon
    this.equipWeapon(window.Storage.data.equippedWeapon || 'starter');
  }

  refreshStats() {
    const stats = window.Upgrades.getPlayerStats();
    this.maxHealth = stats.maxHealth;
    this.maxArmor = stats.maxArmor;
    this.baseSpeed = stats.moveSpeed;
    this.maxStamina = stats.maxStamina;
    this.dashCooldown = stats.dashCooldown;
    this.dashDistanceMult = stats.dashDistanceMult || 1.0;
    this.critChance = stats.critChance;
    this.damageResistance = stats.damageResistance || 0;
    this.magnetRange = stats.magnetRange || 140;
    this.bioRecoveryMult = stats.bioRecoveryMult || 1.0;
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

  takeDamage(amount, fromX = null, fromY = null) {
    if (!this.alive || this.invulnerableTimer > 0) return 0;

    // Shield barrier absorbs damage completely
    if (this.isShieldActive) {
      window.Sound.playHit(false, true);
      if (window.gameInstance && window.gameInstance.particles) {
        window.gameInstance.particles.createHitSparks(this.x, this.y, 0, '#38bdf8', 8);
      }
      return 0;
    }

    // Damage resistance perk
    let incoming = amount * (1 - this.damageResistance);

    // Hit direction calculation
    if (fromX !== null && fromY !== null) {
      this.lastHitAngle = Math.atan2(fromY - this.y, fromX - this.x);
      this.hitFeedbackTimer = 0.5;

      // Small knockback away from threat
      this.vx -= Math.cos(this.lastHitAngle) * 90;
      this.vy -= Math.sin(this.lastHitAngle) * 90;
    }

    // Camera shake & visual feedback
    if (window.gameInstance) {
      if (window.gameInstance.camera) window.gameInstance.camera.addTrauma(0.28);
      if (window.gameInstance.effects) window.gameInstance.effects.triggerHitFlash(0.25);
    }

    window.Sound.playHit(false, false);

    // Armor absorbs 70% of damage
    let actualDamage = incoming;
    if (this.armor > 0) {
      const absorbed = Math.min(this.armor, incoming * 0.7);
      this.armor -= absorbed;
      actualDamage -= absorbed;
    }

    this.health = Math.max(0, this.health - actualDamage);
    this.invulnerableTimer = 0.22; // Brief i-frames

    if (this.health <= 0) {
      this.health = 0;
      this.alive = false;
      window.Sound.playGameOver();
    }

    return actualDamage;
  }

  triggerAbility(obstacles) {
    const effectiveCooldown = this.tempBoosts.dash > 0 ? this.dashCooldown * 0.4 : this.dashCooldown;
    if (this.skillCooldownTimer > 0 || !this.alive) return false;

    const skill = this.selectedSkill;
    if (skill === 'dash') {
      if (this.stamina < 15) return false;
      this.stamina -= 15;
      this.isDashing = true;
      this.dashTimer = 0.22;
      this.invulnerableTimer = 0.26;

      const dashSpeed = this.baseSpeed * 3.2 * this.dashDistanceMult;

      let moveAngle = this.angle;
      if (Math.hypot(this.vx, this.vy) > 10) {
        moveAngle = Math.atan2(this.vy, this.vx);
      }
      this.dashVx = Math.cos(moveAngle) * dashSpeed;
      this.dashVy = Math.sin(moveAngle) * dashSpeed;

      window.Sound.playDash();
      this.skillCooldownTimer = effectiveCooldown;
      return true;
    } else if (skill === 'shield') {
      this.isShieldActive = true;
      this.shieldDurationTimer = 5.0;
      window.Sound.playShield();
      this.skillCooldownTimer = 14.0;
      return true;
    } else if (skill === 'emp') {
      window.Sound.playEMP();
      if (window.gameInstance) {
        window.gameInstance.particles.createShockwave(this.x, this.y, '#38bdf8', 300, 0.5);
        if (window.gameInstance.zombies) {
          for (let z of window.gameInstance.zombies) {
            z.applySlow(5.0, 0.2);
            z.takeDamage(45);
          }
        }
      }
      this.skillCooldownTimer = 16.0;
      return true;
    } else if (skill === 'heal') {
      this.isHealing = true;
      this.healTimer = 3.0;
      window.Sound.playPickup('health');
      this.skillCooldownTimer = 18.0;
      return true;
    } else if (skill === 'burst') {
      window.Sound.playShoot('burst');
      if (window.gameInstance) {
        window.gameInstance.particles.createShockwave(this.x, this.y, '#f43f5e', 220, 0.4);
        for (let i = 0; i < 16; i++) {
          const a = (Math.PI * 2 / 16) * i;
          window.gameInstance.projectiles.push(new window.Projectile(
            this.x, this.y, a,
            { damage: 95, speed: 520, range: 280, bulletColor: '#f43f5e', trailColor: 'rgba(244, 63, 94, 0.4)' },
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

    const damageMultiplier = this.tempBoosts.damage > 0 ? 1.4 : 1.0;
    this.fireTimer = 1.0 / this.weapon.fireRate;
    this.ammo--;
    this.shotsFired++;

    window.Sound.playShoot(this.weapon.soundType);

    // Muzzle flash / screenshake
    if (window.gameInstance && window.gameInstance.camera) {
      window.gameInstance.camera.addTrauma(0.06);
    }

    const isCrit = Math.random() < this.critChance;
    const barrelLength = 26;
    const spawnX = this.x + Math.cos(this.angle) * barrelLength;
    const spawnY = this.y + Math.sin(this.angle) * barrelLength;

    const modifiedWeapon = {
      ...this.weapon,
      damage: Math.round(this.weapon.damage * damageMultiplier)
    };

    if (this.weapon.pellets) {
      for (let i = 0; i < this.weapon.pellets; i++) {
        let shotAngle;
        if (this.weapon.isRadial) {
          shotAngle = (Math.PI * 2 / this.weapon.pellets) * i;
        } else {
          const spreadOffset = (Math.random() - 0.5) * this.weapon.spread * 2;
          shotAngle = this.angle + spreadOffset;
        }
        projectilesList.push(new window.Projectile(spawnX, spawnY, shotAngle, modifiedWeapon, isCrit, 'player', this.weapon.activeModifier));
      }
    } else {
      const spreadOffset = (Math.random() - 0.5) * (this.weapon.spread || 0) * 2;
      projectilesList.push(new window.Projectile(spawnX, spawnY, this.angle + spreadOffset, modifiedWeapon, isCrit, 'player', this.weapon.activeModifier));
    }

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
    if (this.hitFeedbackTimer > 0) this.hitFeedbackTimer -= dt;

    // Temporary boosts countdown
    for (let k in this.tempBoosts) {
      if (this.tempBoosts[k] > 0) {
        this.tempBoosts[k] -= dt;
        if (this.tempBoosts[k] <= 0) this.tempBoosts[k] = 0;
      }
    }

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

    // Shield ability countdown
    if (this.isShieldActive) {
      this.shieldDurationTimer -= dt;
      if (this.shieldDurationTimer <= 0) this.isShieldActive = false;
    }

    // Nanite heal
    if (this.isHealing) {
      this.healTimer -= dt;
      this.health = Math.min(this.maxHealth, this.health + 20 * dt);
      if (this.healTimer <= 0) this.isHealing = false;
    }

    // Stamina regen
    if (this.stamina < this.maxStamina && !this.isDashing) {
      this.stamina = Math.min(this.maxStamina, this.stamina + 25 * dt);
    }

    // MOVEMENT & DASH HANDLING
    if (this.isDashing) {
      this.dashTimer -= dt;

      // Sub-step dash movement to guarantee NO WALKING THROUGH WALLS
      const subSteps = 3;
      const subDt = dt / subSteps;
      for (let s = 0; s < subSteps; s++) {
        this.x += this.dashVx * subDt;
        this.y += this.dashVy * subDt;

        if (obstacles) {
          for (let o of obstacles) {
            Collision.resolveCircleRect(this, o);
          }
        }
      }

      this.trail.push({ x: this.x, y: this.y, alpha: 0.65 });
      if (this.trail.length > 6) this.trail.shift();

      if (this.dashTimer <= 0) {
        this.isDashing = false;
        this.trail = [];
      }
    } else {
      // Normal Input Acceleration & Deceleration
      let mx = 0;
      let my = 0;
      if (input.up) my -= 1;
      if (input.down) my += 1;
      if (input.left) mx -= 1;
      if (input.right) mx += 1;

      if (input.joystickActive) {
        mx = input.joystickX;
        my = input.joystickY;
      }

      // Diagonal normalization
      const len = Math.hypot(mx, my);
      const effectiveSpeed = this.tempBoosts.speed > 0 ? this.baseSpeed * 1.35 : this.baseSpeed;

      if (len > 0) {
        const nx = mx / (input.joystickActive ? 1 : len);
        const ny = my / (input.joystickActive ? 1 : len);
        const targetVx = nx * effectiveSpeed;
        const targetVy = ny * effectiveSpeed;

        // Smooth acceleration interpolation
        this.vx += (targetVx - this.vx) * Math.min(1.0, this.accelerationRate * dt);
        this.vy += (targetVy - this.vy) * Math.min(1.0, this.accelerationRate * dt);
      } else {
        // Smooth deceleration friction
        this.vx *= Math.pow(this.friction, dt * 60);
        this.vy *= Math.pow(this.friction, dt * 60);
        if (Math.abs(this.vx) < 1) this.vx = 0;
        if (Math.abs(this.vy) < 1) this.vy = 0;
      }

      this.x += this.vx * dt;
      this.y += this.vy * dt;

      // Obstacle collision resolution
      if (obstacles) {
        for (let o of obstacles) {
          Collision.resolveCircleRect(this, o);
        }
      }
    }

    // Aim angle
    if (input.aimAngle !== undefined && input.aimActive) {
      this.angle = input.aimAngle;
    } else if (input.targetWorldX !== undefined && input.targetWorldY !== undefined) {
      this.angle = Math.atan2(input.targetWorldY - this.y, input.targetWorldX - this.x);
    }

    // Boundary clamp
    Collision.clampToBounds(this, mapBounds);
  }

  render(ctx) {
    if (!this.alive) return;

    ctx.save();

    // Dash motion ghosting
    if (this.trail.length > 0) {
      for (let i = 0; i < this.trail.length; i++) {
        const pt = this.trail[i];
        ctx.save();
        ctx.translate(pt.x, pt.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = `rgba(0, 240, 255, ${0.12 * (i + 1)})`;
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
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius + 12, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
      ctx.fill();
    }

    // Damage indicator ring if hit recently
    if (this.hitFeedbackTimer > 0 && this.lastHitAngle !== null) {
      ctx.save();
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius + 18, this.lastHitAngle - 0.4, this.lastHitAngle + 0.4);
      ctx.stroke();
      ctx.restore();
    }

    // Temporary boost auras
    if (this.tempBoosts.damage > 0) {
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius + 6, 0, Math.PI * 2);
      ctx.stroke();
    }
    if (this.tempBoosts.speed > 0) {
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius + 9, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Invulnerability flicker
    if (this.invulnerableTimer > 0 && Math.floor(Date.now() / 60) % 2 === 0) {
      ctx.globalAlpha = 0.55;
    }

    ctx.rotate(this.angle);

    // Suit Body
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // Cyber chest armor plate
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

    // Weapon barrel
    ctx.fillStyle = '#475569';
    ctx.fillRect(8, -4, 18, 8);

    // Muzzle tip with weapon energy color
    ctx.fillStyle = (this.weapon && this.weapon.bulletColor) || '#00f0ff';
    ctx.fillRect(24, -3, 4, 6);

    ctx.restore();
  }
}

window.Player = PlayerV2;
