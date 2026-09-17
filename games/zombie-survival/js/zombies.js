/**
 * Zombie Survival V2 - Enemy & Boss Engine
 * 10 distinct zombie archetypes and 5 multi-phase bosses with complete FSM artificial intelligence.
 * Non-graphic violence: neon sparks, smoke puffs, hit flashes, and knockback (zero blood/gore).
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
    slamCooldown: 4.8,
    dropRates: { coin: 0.9, xp: 1.0, ammo: 0.45, health: 0.35, armor: 0.25 }
  },
  swarmer: {
    type: 'swarmer',
    name: 'Swarmer',
    hp: 28,
    speed: 190,
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
    attackRange: 300,      // Ranged standoff
    preferredDistance: 240,
    isRanged: true,
    dropRates: { coin: 0.8, xp: 1.0, ammo: 0.40, health: 0.20 }
  },
  exploder: {
    type: 'exploder',
    name: 'Volatile Exploder',
    hp: 85,
    speed: 115,
    radius: 15,
    damage: 48,
    score: 200,
    xp: 45,
    color: '#ef4444',      // Fiery red volatile
    eyeColor: '#fde047',
    attackCooldown: 1.0,
    attackRange: 90,
    isExploder: true,
    fuseDuration: 1.2,
    dropRates: { coin: 0.65, xp: 0.9, ammo: 0.25, health: 0.15 }
  },
  healer: {
    type: 'healer',
    name: 'Necro Healer',
    hp: 130,
    speed: 92,
    radius: 17,
    damage: 10,
    score: 260,
    xp: 55,
    color: '#10b981',      // Emerald healer
    eyeColor: '#6ee7b7',
    attackCooldown: 1.2,
    attackRange: 30,
    isHealer: true,
    healCooldown: 3.0,
    healRadius: 180,
    healAmount: 40,
    dropRates: { coin: 0.75, xp: 1.0, ammo: 0.35, health: 0.40 }
  },
  elite: {
    type: 'elite',
    name: 'Elite Commander',
    hp: 460,
    speed: 110,
    radius: 22,
    damage: 24,
    score: 600,
    xp: 140,
    color: '#ec4899',      // Hot neon pink aura
    eyeColor: '#ffffff',
    attackCooldown: 1.0,
    attackRange: 32,
    auraRadius: 190,
    dropRates: { coin: 1.0, xp: 1.0, ammo: 0.7, health: 0.5, armor: 0.5 }
  },
  boss: {
    type: 'boss',
    name: 'Sector Boss',
    hp: 2400,
    speed: 78,
    radius: 40,
    damage: 42,
    score: 3500,
    xp: 850,
    color: '#dc2626',      // Crimson powerhouse
    eyeColor: '#facc15',
    attackCooldown: 1.2,
    attackRange: 55,
    isBoss: true,
    dropRates: { coin: 1.0, xp: 1.0, ammo: 1.0, health: 1.0, armor: 1.0 }
  }
};

const BOSS_CONFIGS = {
  brute: {
    name: 'The Brute',
    title: 'Heavy Subdermal Behemoth',
    color: '#b91c1c',
    eyeColor: '#fde047',
    hpMult: 1.1,
    speedMult: 0.95,
    specialCooldown: 4.2
  },
  ravager: {
    name: 'The Ravager',
    title: 'High-Velocity Slasher',
    color: '#c026d3',
    eyeColor: '#38bdf8',
    hpMult: 0.9,
    speedMult: 1.35,
    specialCooldown: 3.5
  },
  warden: {
    name: 'The Warden',
    title: 'Kinetic Shield Arbiter',
    color: '#0284c7',
    eyeColor: '#4ade80',
    hpMult: 1.25,
    speedMult: 0.9,
    specialCooldown: 4.8
  },
  mutant: {
    name: 'The Mutant',
    title: 'Bio-Toxic Spore Hive',
    color: '#16a34a',
    eyeColor: '#a855f7',
    hpMult: 1.15,
    speedMult: 1.05,
    specialCooldown: 3.8
  },
  overlord: {
    name: 'The Overlord',
    title: 'Apex Sovereign of Citadel Zero',
    color: '#7c3aed',
    eyeColor: '#fbbf24',
    hpMult: 1.5,
    speedMult: 1.15,
    specialCooldown: 3.2
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
    this.shieldAngleWidth = base.shieldAngleWidth || 1.6;
    this.isRanged = base.isRanged || false;
    this.preferredDistance = base.preferredDistance || 240;
    this.auraRadius = base.auraRadius || 0;

    // Exploder feature
    this.isExploder = base.isExploder || false;
    this.isPrimed = false;
    this.fuseTimer = base.fuseDuration || 1.2;
    this.explosionRadius = 110;

    // Healer feature
    this.isHealer = base.isHealer || false;
    this.healCooldown = base.healCooldown || 3.0;
    this.healTimer = Math.random() * 2;
    this.healRadius = base.healRadius || 180;
    this.healAmount = base.healAmount || 40;

    // Boss features
    this.isBoss = base.isBoss || false;
    this.bossVariant = bossVariant || (this.isBoss ? 'brute' : null);

    if (this.isBoss) {
      const bConf = BOSS_CONFIGS[this.bossVariant] || BOSS_CONFIGS.brute;
      this.name = bConf.name;
      this.bossTitle = bConf.title;
      this.color = bConf.color;
      this.eyeColor = bConf.eyeColor;
      this.maxHp = Math.round(this.maxHp * bConf.hpMult);
      this.hp = this.maxHp;
      this.speed = this.speed * bConf.speedMult;
      this.baseSpeed = this.speed;

      this.bossPhase = 1; // 1, 2, 3, 4
      this.specialAttackTimer = bConf.specialCooldown || 4.0;
      this.chargeTimer = 0;
      this.isCharging = false;
      this.chargeAngle = 0;
      this.shieldOrbitAngle = 0;
      this.hasWardenShield = (this.bossVariant === 'warden');
    }

    // AI Finite State Machine
    this.state = 'CHASE'; // IDLE, CHASE, ATTACK, HIT, DEFEATED
    this.hitStun = 0;
    this.slowTimer = 0;
    this.slowFactor = 1.0;
    this.alive = true;
    this.dropRates = base.dropRates;
  }

  takeDamage(amount, hitAngle = null, isCrit = false) {
    if (!this.alive) return { deflected: false, damage: 0, killed: false };

    // Shielded zombie frontal deflection
    if (this.hasShield && hitAngle !== null) {
      const angleDiff = Math.abs(Math.atan2(Math.sin(hitAngle - this.angle), Math.cos(hitAngle - this.angle)));
      if (angleDiff > Math.PI - 1.0) {
        amount = Math.round(amount * 0.25);
        window.Sound.playHit(false, true);
        return { deflected: true, damage: amount, killed: false };
      }
    }

    // Warden Boss energy shield deflection in Phase 2+
    if (this.isBoss && this.hasWardenShield && this.bossPhase >= 2 && Math.random() < 0.25) {
      amount = Math.round(amount * 0.3);
      window.Sound.playHit(false, true);
      return { deflected: true, damage: amount, killed: false };
    }

    this.hp -= amount;
    this.state = 'HIT';
    this.hitStun = 0.07;

    window.Sound.playHit(isCrit, false);

    // Exploder triggers fuse when severely damaged
    if (this.isExploder && !this.isPrimed && this.hp <= this.maxHp * 0.4) {
      this.isPrimed = true;
      this.fuseTimer = Math.min(this.fuseTimer, 0.8);
      window.Sound.playBossAlarm();
    }

    if (this.hp <= 0) {
      this.hp = 0;
      this.alive = false;
      this.state = 'DEFEATED';
      window.Sound.playZombieDefeat(this.isBoss);

      // Exploder detonates immediately on defeat
      if (this.isExploder) {
        this.triggerExplosion();
      }

      return { deflected: false, damage: amount, killed: true };
    }

    // 4 Boss Phase Transitions: 100-75% (P1), 75-50% (P2), 50-25% (P3), <25% (P4 Enraged)
    if (this.isBoss) {
      const healthPct = this.hp / this.maxHp;
      let newPhase = 1;
      if (healthPct < 0.25) newPhase = 4;
      else if (healthPct < 0.50) newPhase = 3;
      else if (healthPct < 0.75) newPhase = 2;

      if (newPhase > this.bossPhase) {
        this.bossPhase = newPhase;
        this.onBossPhaseChange(newPhase);
      }
    }

    return { deflected: false, damage: amount, killed: false };
  }

  onBossPhaseChange(phase) {
    window.Sound.playBossAlarm();
    if (window.gameInstance && window.gameInstance.ui) {
      const bannerText = phase === 4 
        ? `⚠️ ENRAGED! ${this.name.toUpperCase()} PHASE 4!` 
        : `⚠️ ${this.name.toUpperCase()} ENTERED PHASE ${phase}!`;
      window.gameInstance.ui.showWaveBanner(bannerText);
    }

    // Phase scaling
    if (phase === 2) {
      this.speed = this.baseSpeed * 1.15;
    } else if (phase === 3) {
      this.speed = this.baseSpeed * 1.30;
      this.specialAttackTimer = Math.min(this.specialAttackTimer, 1.0);
    } else if (phase === 4) {
      this.speed = this.baseSpeed * 1.45;
      this.specialAttackTimer = 0.5;
      if (window.gameInstance && window.gameInstance.camera) {
        window.gameInstance.camera.addTrauma(0.6);
      }
    }
  }

  triggerExplosion() {
    if (!window.gameInstance) return;
    const gi = window.gameInstance;

    // Visual shockwave & spark explosion
    if (gi.particles) {
      gi.particles.createShockwave(this.x, this.y, '#ef4444', this.explosionRadius, 0.45);
      gi.particles.createExplosion(this.x, this.y, '#f97316', 24);
    }
    if (gi.camera) {
      gi.camera.addTrauma(0.4);
    }
    window.Sound._playNoise(0.4, 0.6, 280);

    // Damage player if in blast radius
    if (gi.player && gi.player.alive) {
      const d = Math.hypot(gi.player.x - this.x, gi.player.y - this.y);
      if (d < this.explosionRadius) {
        const falloff = 1 - (d / this.explosionRadius) * 0.5;
        gi.player.takeDamage(Math.round(this.damage * falloff));
      }
    }

    // Damage other zombies in blast radius (chain explosions!)
    if (gi.zombies) {
      for (let z of gi.zombies) {
        if (z !== this && z.alive) {
          const zd = Math.hypot(z.x - this.x, z.y - this.y);
          if (zd < this.explosionRadius) {
            z.takeDamage(Math.round(this.damage * 0.7));
          }
        }
      }
    }
  }

  applySlow(duration, factor) {
    this.slowTimer = Math.max(this.slowTimer, duration);
    this.slowFactor = factor;
  }

  update(dt, player, obstacles, enemyProjectiles, allZombies) {
    if (!this.alive) return false;

    // Slow decay
    if (this.slowTimer > 0) {
      this.slowTimer -= dt;
      if (this.slowTimer <= 0) this.slowFactor = 1.0;
    }

    // Hit stun
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

    let currentSpeed = this.speed * this.slowFactor;

    // 1. Elite Commander Aura Buff
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

    // 2. Necro Healer Aura Pulse
    if (this.isHealer && allZombies) {
      this.healTimer -= dt;
      if (this.healTimer <= 0) {
        this.healTimer = this.healCooldown;
        let healedAny = false;

        for (let i = 0; i < allZombies.length; i++) {
          const other = allZombies[i];
          if (other !== this && other.alive && other.hp < other.maxHp) {
            const d = Math.hypot(other.x - this.x, other.y - this.y);
            if (d < this.healRadius) {
              other.hp = Math.min(other.maxHp, other.hp + this.healAmount);
              healedAny = true;
              if (window.gameInstance && window.gameInstance.particles) {
                window.gameInstance.particles.addFloatingText(other.x, other.y - 15, `+${this.healAmount} HP`, '#10b981', 12);
              }
            }
          }
        }

        if (healedAny && window.gameInstance && window.gameInstance.particles) {
          window.gameInstance.particles.createShockwave(this.x, this.y, '#10b981', this.healRadius, 0.4);
        }
      }
    }

    // 3. Volatile Exploder behavior
    if (this.isExploder) {
      if (!this.isPrimed && distToPlayer <= this.attackRange) {
        this.isPrimed = true;
        this.fuseTimer = 1.2;
        window.Sound.playBossAlarm();
      }

      if (this.isPrimed) {
        this.fuseTimer -= dt;
        // Faster sprint when ticking
        currentSpeed = this.speed * 1.35;
        if (this.fuseTimer <= 0) {
          this.alive = false;
          this.state = 'DEFEATED';
          this.triggerExplosion();
          return false;
        }
      }
    }

    // 4. Branch by archetype
    if (this.isBoss) {
      this.updateBoss(dt, player, distToPlayer, enemyProjectiles);
    } else if (this.isRanged) {
      // Hunter behavior: keep standoff distance & fire spines
      if (distToPlayer < this.preferredDistance - 40) {
        this.x -= Math.cos(this.angle) * currentSpeed * dt;
        this.y -= Math.sin(this.angle) * currentSpeed * dt;
      } else if (distToPlayer > this.preferredDistance + 40) {
        this.x += Math.cos(this.angle) * currentSpeed * dt;
        this.y += Math.sin(this.angle) * currentSpeed * dt;
      }

      this.attackTimer -= dt;
      if (this.attackTimer <= 0 && distToPlayer <= this.attackRange) {
        this.attackTimer = this.attackCooldown;
        if (enemyProjectiles) {
          enemyProjectiles.push(new EnemyProjectile(
            this.x, this.y, this.angle,
            { speed: 380, damage: this.damage, radius: 5, color: '#f97316', trailColor: 'rgba(249, 115, 22, 0.4)', range: 450 }
          ));
        }
      }
    } else {
      // Standard Melee / Exploder / Healer Chaser
      let moveAngle = this.angle;
      if (this.zigZag) {
        this.zigZagTimer += dt * 4.5;
        moveAngle += Math.sin(this.zigZagTimer) * 0.48;
      }

      this.x += Math.cos(moveAngle) * currentSpeed * dt;
      this.y += Math.sin(moveAngle) * currentSpeed * dt;

      // Tank Ground Stomp
      if (this.hasSlam) {
        this.slamTimer -= dt;
        if (this.slamTimer <= 0 && distToPlayer < 120) {
          this.slamTimer = 4.8;
          window.Sound._playNoise(0.4, 0.5, 300);
          if (window.gameInstance && window.gameInstance.particles) {
            window.gameInstance.particles.createShockwave(this.x, this.y, '#a855f7', 110, 0.4);
          }
          if (distToPlayer < 100) {
            player.takeDamage(this.damage * 0.7, this.angle);
          }
        }
      }

      // Contact Attack
      if (distToPlayer <= this.radius + player.radius + 6) {
        this.attackTimer -= dt;
        if (this.attackTimer <= 0) {
          this.attackTimer = this.attackCooldown;
          player.takeDamage(this.damage, this.angle);
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
    if (this.hasWardenShield) {
      this.shieldOrbitAngle += dt * 3.0;
    }

    // Charging state
    if (this.isCharging) {
      this.chargeTimer -= dt;
      this.x += Math.cos(this.chargeAngle) * (this.speed * 2.8) * dt;
      this.y += Math.sin(this.chargeAngle) * (this.speed * 2.8) * dt;

      if (distToPlayer < this.radius + player.radius) {
        player.takeDamage(this.damage * 1.4, this.chargeAngle);
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

    // Contact damage
    if (distToPlayer <= this.radius + player.radius + 10) {
      this.attackTimer -= dt;
      if (this.attackTimer <= 0) {
        this.attackTimer = this.attackCooldown;
        player.takeDamage(this.damage, this.angle);
      }
    }

    // Trigger Boss Special Attacks based on variant
    if (this.specialAttackTimer <= 0) {
      const cooldownBase = (BOSS_CONFIGS[this.bossVariant] || {}).specialCooldown || 4.0;
      this.specialAttackTimer = cooldownBase - (this.bossPhase - 1) * 0.65;

      const variant = this.bossVariant || 'brute';

      if (variant === 'brute') {
        // The Brute: Sprint Charge + Ground Stomp Shockwave
        this.isCharging = true;
        this.chargeAngle = this.angle;
        this.chargeTimer = 1.2;
        window.Sound.playBossAlarm();
        if (window.gameInstance && window.gameInstance.particles) {
          window.gameInstance.particles.createShockwave(this.x, this.y, '#b91c1c', 140, 0.4);
        }
      } else if (variant === 'ravager') {
        // The Ravager: 6-way blade spread + rapid dash
        const count = this.bossPhase >= 3 ? 10 : 6;
        for (let i = 0; i < count; i++) {
          const a = this.angle + (i - count / 2) * 0.18;
          enemyProjectiles.push(new EnemyProjectile(
            this.x, this.y, a,
            { speed: 360, damage: 20, radius: 6, color: '#c026d3', trailColor: 'rgba(192, 38, 211, 0.5)', range: 550 }
          ));
        }
        window.Sound._playNoise(0.3, 0.4, 400);
      } else if (variant === 'warden') {
        // The Warden: Repulsor Shockwave + 4-way energy orbs
        if (window.gameInstance && window.gameInstance.particles) {
          window.gameInstance.particles.createShockwave(this.x, this.y, '#0284c7', 160, 0.5);
        }
        if (distToPlayer < 140) {
          player.takeDamage(this.damage * 0.8);
        }
        for (let i = 0; i < 4; i++) {
          const a = (Math.PI / 2) * i + this.shieldOrbitAngle;
          enemyProjectiles.push(new EnemyProjectile(
            this.x, this.y, a,
            { speed: 300, damage: 24, radius: 8, color: '#0284c7', trailColor: 'rgba(2, 132, 199, 0.5)', range: 600 }
          ));
        }
      } else if (variant === 'mutant') {
        // The Mutant: 7-way toxic needle spread + biohazard puddle
        const count = this.bossPhase >= 3 ? 9 : 7;
        for (let i = -Math.floor(count / 2); i <= Math.floor(count / 2); i++) {
          enemyProjectiles.push(new EnemyProjectile(
            this.x, this.y, this.angle + i * 0.2,
            { speed: 320, damage: 22, radius: 7, color: '#16a34a', trailColor: 'rgba(22, 163, 74, 0.5)', range: 520 }
          ));
        }
        if (window.gameInstance && window.gameInstance.particles) {
          window.gameInstance.particles.createShockwave(this.x, this.y, '#16a34a', 90, 0.3);
        }
      } else {
        // The Overlord: 12-way nova bullet storm + screen shake
        const count = this.bossPhase >= 4 ? 16 : 12;
        for (let i = 0; i < count; i++) {
          const a = (Math.PI * 2 / count) * i;
          enemyProjectiles.push(new EnemyProjectile(
            this.x, this.y, a,
            { speed: 350, damage: 28, radius: 7, color: '#7c3aed', trailColor: 'rgba(124, 58, 237, 0.5)', range: 650 }
          ));
        }
        window.Sound.playBossAlarm();
        if (window.gameInstance && window.gameInstance.camera) {
          window.gameInstance.camera.addTrauma(0.4);
        }
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

    // Exploder danger zone telegraph (pulsing red expanding circle)
    if (this.isExploder && this.isPrimed) {
      const pulse = 1 + Math.sin(performance.now() * 0.02) * 0.15;
      ctx.save();
      ctx.rotate(-this.angle); // Render unrotated in world space
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.arc(0, 0, this.explosionRadius * pulse, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
      ctx.fill();
      ctx.restore();
    }

    // Cryo slow tint / ice ring
    if (this.slowTimer > 0) {
      ctx.strokeStyle = '#67e8f9';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius + 4, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Healer ambient green pulse ring
    if (this.isHealer) {
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius + 8, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Elite Commander aura
    if (this.auraRadius > 0) {
      ctx.fillStyle = 'rgba(236, 72, 153, 0.12)';
      ctx.beginPath();
      ctx.arc(0, 0, this.auraRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Boss warning shadow / aura
    if (this.isBoss) {
      const bossAuraColor = this.bossPhase === 4 ? 'rgba(239, 68, 68, 0.4)' : 'rgba(124, 58, 237, 0.25)';
      ctx.fillStyle = bossAuraColor;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius * 1.6, 0, Math.PI * 2);
      ctx.fill();

      // Warden orbital energy shield
      if (this.hasWardenShield && this.bossPhase >= 2) {
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius + 14, this.shieldOrbitAngle, this.shieldOrbitAngle + Math.PI * 0.8);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, this.radius + 14, this.shieldOrbitAngle + Math.PI, this.shieldOrbitAngle + Math.PI * 1.8);
        ctx.stroke();
      }
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

    // Health bar above head (for Tank, Elite, Boss, or damaged enemies)
    if (this.isBoss || this.type === 'tank' || this.type === 'elite' || this.hp < this.maxHp) {
      const barW = this.isBoss ? 80 : 34;
      const barH = this.isBoss ? 8 : 4;
      const pct = Math.max(0, this.hp / this.maxHp);
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
      ctx.fillRect(this.x - barW / 2, this.y - this.radius - 14, barW, barH);
      ctx.fillStyle = this.isBoss ? (this.bossPhase === 4 ? '#ef4444' : '#f59e0b') : '#22c55e';
      ctx.fillRect(this.x - barW / 2, this.y - this.radius - 14, barW * pct, barH);

      // Boss name & phase label
      if (this.isBoss) {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${this.name} [P${this.bossPhase}]`, this.x, this.y - this.radius - 18);
      }
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
window.BOSS_CONFIGS = BOSS_CONFIGS;
window.Zombie = Zombie;
window.EnemyProjectile = EnemyProjectile;
