/**
 * Zombie Survival - Enemy & Boss Engine
 * 8 distinct zombie archetypes and 4 multi-phase boss variants with full FSM artificial intelligence.
 */

const ZOMBIE_TYPES = {
  normal: {
    type: 'normal',
    name: 'Normal Zombie',
    hp: 75,
    speed: 95,
    radius: 16,
    damage: 12,
    score: 100,
    xp: 20,
    color: '#34d399',      // Toxic neon green
    eyeColor: '#facc15',
    attackCooldown: 1.0,
    attackRange: 26,
    dropRates: { coin: 0.45, xp: 0.9, ammo: 0.15, health: 0.08 }
  },
  runner: {
    type: 'runner',
    name: 'Runner',
    hp: 45,
    speed: 175,
    radius: 13,
    damage: 9,
    score: 140,
    xp: 25,
    color: '#fb7185',      // Crimson runner
    eyeColor: '#ffffff',
    attackCooldown: 0.7,
    attackRange: 22,
    zigZag: true,
    dropRates: { coin: 0.50, xp: 0.95, ammo: 0.20, health: 0.06 }
  },
  tank: {
    type: 'tank',
    name: 'Tank',
    hp: 340,
    speed: 62,
    radius: 26,
    damage: 28,
    score: 350,
    xp: 75,
    color: '#a855f7',      // Heavy purple brute
    eyeColor: '#ef4444',
    attackCooldown: 1.5,
    attackRange: 36,
    hasSlam: true,
    slamCooldown: 5.0,
    dropRates: { coin: 0.9, xp: 1.0, ammo: 0.45, health: 0.35, armor: 0.25 }
  },
  swarmer: {
    type: 'swarmer',
    name: 'Swarmer',
    hp: 28,
    speed: 185,
    radius: 11,
    damage: 6,
    score: 70,
    xp: 15,
    color: '#38bdf8',      // Cyan micro-fiend
    eyeColor: '#fde047',
    attackCooldown: 0.6,
    attackRange: 18,
    dropRates: { coin: 0.30, xp: 0.8, ammo: 0.10, health: 0.03 }
  },
  shielded: {
    type: 'shielded',
    name: 'Shielded Zombie',
    hp: 160,
    speed: 85,
    radius: 19,
    damage: 16,
    score: 240,
    xp: 50,
    color: '#eab308',      // Amber armored
    eyeColor: '#38bdf8',
    attackCooldown: 1.1,
    attackRange: 28,
    hasShield: true,
    shieldAngleWidth: 1.6, // Radians front arc
    dropRates: { coin: 0.75, xp: 1.0, ammo: 0.35, health: 0.20, armor: 0.25 }
  },
  hunter: {
    type: 'hunter',
    name: 'Hunter Spitter',
    hp: 110,
    speed: 120,
    radius: 16,
    damage: 14,
    score: 280,
    xp: 60,
    color: '#f97316',      // Orange predator
    eyeColor: '#a855f7',
    attackCooldown: 2.2,
    attackRange: 280,      // Ranged standoff
    preferredDistance: 240,
    isRanged: true,
    dropRates: { coin: 0.8, xp: 1.0, ammo: 0.40, health: 0.20 }
  },
  elite: {
    type: 'elite',
    name: 'Elite Commander',
    hp: 450,
    speed: 110,
    radius: 22,
    damage: 24,
    score: 600,
    xp: 140,
    color: '#ec4899',      // Hot neon pink aura
    eyeColor: '#ffffff',
    attackCooldown: 1.0,
    attackRange: 32,
    auraRadius: 180,
    dropRates: { coin: 1.0, xp: 1.0, ammo: 0.7, health: 0.5, armor: 0.5 }
  },
  boss: {
    type: 'boss',
    name: 'Boss Overlord',
    hp: 2200,
    speed: 78,
    radius: 40,
    damage: 40,
    score: 3000,
    xp: 800,
    color: '#dc2626',      // Blood-orange fiery boss
    eyeColor: '#facc15',
    attackCooldown: 1.2,
    attackRange: 55,
    isBoss: true,
    dropRates: { coin: 1.0, xp: 1.0, ammo: 1.0, health: 1.0, armor: 1.0 }
  }
};

class Zombie {
  constructor(x, y, configKey = 'normal', levelScaling = 1.0, bossVariant = null) {
    const base = ZOMBIE_TYPES[configKey] || ZOMBIE_TYPES.normal;
    this.type = configKey;
    this.name = base.name;
    this.x = x;
    this.y = y;
    this.angle = 0;

    // Scaling
    const hpMult = levelScaling;
    const spdMult = Math.min(1.45, 1 + (levelScaling - 1) * 0.15);
    const dmgMult = Math.min(2.5, 1 + (levelScaling - 1) * 0.25);

    this.maxHp = Math.round(base.hp * hpMult);
    this.hp = this.maxHp;
    this.speed = base.speed * spdMult;
    this.baseSpeed = this.speed;
    this.radius = base.radius;
    this.damage = Math.round(base.damage * dmgMult);
    this.score = Math.round(base.score * levelScaling);
    this.xp = Math.round(base.xp * levelScaling);
    this.color = base.color;
    this.eyeColor = base.eyeColor;
    this.attackCooldown = base.attackCooldown;
    this.attackTimer = 0;
    this.attackRange = base.attackRange;

    // Specialized features
    this.zigZag = base.zigZag || false;
    this.zigZagTimer = Math.random() * 10;
    this.hasSlam = base.hasSlam || false;
    this.slamTimer = 3.0;
    this.hasShield = base.hasShield || false;
    this.isRanged = base.isRanged || false;
    this.preferredDistance = base.preferredDistance || 240;
    this.auraRadius = base.auraRadius || 0;
    this.isBoss = base.isBoss || false;
    this.bossVariant = bossVariant; // 'abomination', 'cybertitan', 'harvester', 'overlord'

    if (this.isBoss) {
      this.bossPhase = 1;
      this.specialAttackTimer = 4.0;
      this.chargeTimer = 0;
      this.isCharging = false;
    }

    // AI Finite State Machine
    this.state = 'CHASE'; // IDLE, SEARCH, CHASE, ATTACK, HIT, DEFEATED
    this.hitStun = 0;
    this.slowTimer = 0;
    this.slowFactor = 1.0;
    this.alive = true;
    this.dropRates = base.dropRates;
  }

  takeDamage(amount, hitAngle = null, isCrit = false) {
    if (!this.alive) return;

    // Check shielded zombie frontal angle
    if (this.hasShield && hitAngle !== null) {
      const angleDiff = Math.abs(Math.atan2(Math.sin(hitAngle - this.angle), Math.cos(hitAngle - this.angle)));
      if (angleDiff > Math.PI - 1.0) {
        // Frontal hit deflected!
        amount = Math.round(amount * 0.25);
        window.Sound.playHit(false, true);
        return { deflected: true, damage: amount };
      }
    }

    this.hp -= amount;
    this.state = 'HIT';
    this.hitStun = 0.08;

    window.Sound.playHit(isCrit, false);

    if (this.hp <= 0) {
      this.hp = 0;
      this.alive = false;
      this.state = 'DEFEATED';
      window.Sound.playZombieDefeat(this.isBoss);
    }

    // Boss phase transitions
    if (this.isBoss) {
      const healthPct = this.hp / this.maxHp;
      if (healthPct < 0.35 && this.bossPhase < 3) {
        this.bossPhase = 3;
        this.speed = this.baseSpeed * 1.35;
      } else if (healthPct < 0.70 && this.bossPhase < 2) {
        this.bossPhase = 2;
        this.speed = this.baseSpeed * 1.18;
      }
    }

    return { deflected: false, damage: amount, killed: !this.alive };
  }

  applySlow(duration, factor) {
    this.slowTimer = Math.max(this.slowTimer, duration);
    this.slowFactor = factor;
  }

  update(dt, player, obstacles, enemyProjectiles, allZombies) {
    if (!this.alive) return false;

    // Manage slow
    if (this.slowTimer > 0) {
      this.slowTimer -= dt;
      if (this.slowTimer <= 0) this.slowFactor = 1.0;
    }

    // Manage hit stun
    if (this.hitStun > 0) {
      this.hitStun -= dt;
      return true;
    }

    if (!player || !player.alive) {
      this.state = 'IDLE';
      return true;
    }

    const distToPlayer = Math.hypot(player.x - this.x, player.y - this.y);
    this.angle = Math.atan2(player.y - this.y, player.x - this.x);

    // Current movement speed
    let currentSpeed = this.speed * this.slowFactor;

    // Elite buffing nearby zombies
    if (this.auraRadius > 0 && allZombies) {
      for (let i = 0; i < allZombies.length; i++) {
        const other = allZombies[i];
        if (other !== this && other.alive) {
          const d = Math.hypot(other.x - this.x, other.y - this.y);
          if (d < this.auraRadius) {
            other.speed = other.baseSpeed * 1.25;
          }
        }
      }
    }

    // Boss special behaviors
    if (this.isBoss) {
      this.updateBoss(dt, player, distToPlayer, enemyProjectiles);
    } else if (this.isRanged) {
      // Hunter behavior: maintain standoff distance and shoot venom spines
      if (distToPlayer < this.preferredDistance - 40) {
        // Back away
        this.x -= Math.cos(this.angle) * currentSpeed * dt;
        this.y -= Math.sin(this.angle) * currentSpeed * dt;
      } else if (distToPlayer > this.preferredDistance + 40) {
        // Move closer
        this.x += Math.cos(this.angle) * currentSpeed * dt;
        this.y += Math.sin(this.angle) * currentSpeed * dt;
      }

      this.attackTimer -= dt;
      if (this.attackTimer <= 0 && distToPlayer <= this.attackRange) {
        this.attackTimer = this.attackCooldown;
        // Shoot venom projectile toward player
        if (enemyProjectiles) {
          enemyProjectiles.push(new EnemyProjectile(
            this.x, this.y, this.angle,
            { speed: 380, damage: this.damage, radius: 5, color: '#f97316', trailColor: 'rgba(249, 115, 22, 0.4)', range: 450 }
          ));
        }
      }
    } else {
      // Melee Chaser behavior
      let moveAngle = this.angle;
      if (this.zigZag) {
        this.zigZagTimer += dt * 4;
        moveAngle += Math.sin(this.zigZagTimer) * 0.45;
      }

      this.x += Math.cos(moveAngle) * currentSpeed * dt;
      this.y += Math.sin(moveAngle) * currentSpeed * dt;

      // Tank ground stomp
      if (this.hasSlam) {
        this.slamTimer -= dt;
        if (this.slamTimer <= 0 && distToPlayer < 120) {
          this.slamTimer = 5.0;
          window.Sound._playNoise(0.4, 0.5, 300);
          if (window.gameInstance && window.gameInstance.particles) {
            window.gameInstance.particles.createShockwave(this.x, this.y, '#a855f7', 110, 0.4);
          }
          if (distToPlayer < 100) {
            player.takeDamage(this.damage * 0.7);
          }
        }
      }

      // Attack player within range
      if (distToPlayer <= this.radius + player.radius + 6) {
        this.attackTimer -= dt;
        if (this.attackTimer <= 0) {
          this.attackTimer = this.attackCooldown;
          player.takeDamage(this.damage);
        }
      }
    }

    // Resolve collision with obstacles
    if (obstacles) {
      for (let i = 0; i < obstacles.length; i++) {
        Collision.resolveCircleRect(this, obstacles[i]);
      }
    }

    return true;
  }

  updateBoss(dt, player, distToPlayer, enemyProjectiles) {
    this.specialAttackTimer -= dt;

    if (this.isCharging) {
      this.chargeTimer -= dt;
      this.x += Math.cos(this.chargeAngle) * (this.speed * 2.8) * dt;
      this.y += Math.sin(this.chargeAngle) * (this.speed * 2.8) * dt;

      if (distToPlayer < this.radius + player.radius) {
        player.takeDamage(this.damage * 1.5);
        this.isCharging = false;
      }

      if (this.chargeTimer <= 0) {
        this.isCharging = false;
      }
      return;
    }

    // Standard chase
    this.x += Math.cos(this.angle) * this.speed * dt;
    this.y += Math.sin(this.angle) * this.speed * dt;

    // Contact attack
    if (distToPlayer <= this.radius + player.radius + 10) {
      this.attackTimer -= dt;
      if (this.attackTimer <= 0) {
        this.attackTimer = this.attackCooldown;
        player.takeDamage(this.damage);
      }
    }

    // Trigger Boss special attacks
    if (this.specialAttackTimer <= 0) {
      this.specialAttackTimer = 4.5 - this.bossPhase * 0.7;

      const variant = this.bossVariant || 'abomination';
      if (variant === 'abomination') {
        // Sprint Charge
        this.isCharging = true;
        this.chargeAngle = this.angle;
        this.chargeTimer = 1.2;
        window.Sound.playBossAlarm();
      } else if (variant === 'cybertitan') {
        // 8-way missile spread
        for (let i = 0; i < 8; i++) {
          const a = (Math.PI * 2 / 8) * i;
          enemyProjectiles.push(new EnemyProjectile(
            this.x, this.y, a,
            { speed: 340, damage: 25, radius: 7, color: '#ef4444', trailColor: 'rgba(239, 68, 68, 0.5)', range: 600 }
          ));
        }
        window.Sound._playNoise(0.3, 0.4, 400);
      } else if (variant === 'harvester') {
        // Toxic spread + shockwave
        for (let i = -2; i <= 2; i++) {
          enemyProjectiles.push(new EnemyProjectile(
            this.x, this.y, this.angle + i * 0.22,
            { speed: 320, damage: 22, radius: 8, color: '#22c55e', trailColor: 'rgba(34, 197, 94, 0.5)', range: 500 }
          ));
        }
      } else {
        // Overlord multi-spread
        for (let i = 0; i < 12; i++) {
          const a = (Math.PI * 2 / 12) * i;
          enemyProjectiles.push(new EnemyProjectile(
            this.x, this.y, a,
            { speed: 360, damage: 30, radius: 7, color: '#f59e0b', trailColor: 'rgba(245, 158, 11, 0.5)', range: 650 }
          ));
        }
        window.Sound.playBossAlarm();
      }
    }
  }

  render(ctx) {
    if (!this.alive) return;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    // Hit stun white flash
    if (this.hitStun > 0) {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, this.radius * 1.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      return;
    }

    // Cryo slow tint / ice ring
    if (this.slowTimer > 0) {
      ctx.strokeStyle = '#67e8f9';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius + 4, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Elite aura
    if (this.auraRadius > 0) {
      ctx.fillStyle = 'rgba(236, 72, 153, 0.12)';
      ctx.beginPath();
      ctx.arc(0, 0, this.auraRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Boss warning shadow / aura
    if (this.isBoss) {
      ctx.fillStyle = 'rgba(220, 38, 38, 0.25)';
      ctx.beginPath();
      ctx.arc(0, 0, this.radius * 1.6, 0, Math.PI * 2);
      ctx.fill();
    }

    // Zombie body
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // Darker outline
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Shield graphic for shielded zombie
    if (this.hasShield) {
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius + 6, -this.shieldAngleWidth / 2, this.shieldAngleWidth / 2);
      ctx.stroke();
    }

    // Glowing Eyes
    ctx.fillStyle = this.eyeColor;
    ctx.beginPath();
    ctx.arc(this.radius * 0.55, -this.radius * 0.35, this.radius * 0.2, 0, Math.PI * 2);
    ctx.arc(this.radius * 0.55, this.radius * 0.35, this.radius * 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Arms
    ctx.fillStyle = this.color;
    ctx.fillRect(this.radius * 0.5, -this.radius * 0.7, this.radius * 0.8, this.radius * 0.35);
    ctx.fillRect(this.radius * 0.5, this.radius * 0.35, this.radius * 0.8, this.radius * 0.35);

    ctx.restore();

    // Health bar above head (for Tank, Elite, or Boss)
    if (this.isBoss || this.type === 'tank' || this.type === 'elite' || this.hp < this.maxHp) {
      const barW = this.isBoss ? 70 : 34;
      const barH = this.isBoss ? 7 : 4;
      const pct = Math.max(0, this.hp / this.maxHp);
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(this.x - barW / 2, this.y - this.radius - 12, barW, barH);
      ctx.fillStyle = this.isBoss ? '#ef4444' : '#22c55e';
      ctx.fillRect(this.x - barW / 2, this.y - this.radius - 12, barW * pct, barH);
      ctx.restore();
    }
  }
}

class EnemyProjectile {
  constructor(x, y, angle, config) {
    this.x = x;
    this.y = y;
    this.startX = x;
    this.startY = y;
    this.angle = angle;
    this.speed = config.speed || 350;
    this.damage = config.damage || 15;
    this.radius = config.radius || 6;
    this.color = config.color || '#f97316';
    this.trailColor = config.trailColor || 'rgba(249, 115, 22, 0.4)';
    this.range = config.range || 500;
    this.alive = true;
  }

  update(dt) {
    if (!this.alive) return false;
    const step = this.speed * dt;
    this.x += Math.cos(this.angle) * step;
    this.y += Math.sin(this.angle) * step;
    if (Math.hypot(this.x - this.startX, this.y - this.startY) >= this.range) {
      this.alive = false;
    }
    return this.alive;
  }

  render(ctx) {
    if (!this.alive) return;
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

window.ZOMBIE_TYPES = ZOMBIE_TYPES;
window.Zombie = Zombie;
window.EnemyProjectile = EnemyProjectile;

