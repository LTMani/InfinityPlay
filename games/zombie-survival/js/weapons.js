/**
 * Zombie Survival - Weapons System
 * 9 Arcade Energy Weapons with unique ballistic mechanics, upgrades, and projectile behaviors.
 */

const WEAPON_DEFINITIONS = {
  starter: {
    id: 'starter',
    name: 'Starter Blaster',
    category: 'Pistol',
    damage: 32,
    fireRate: 3.5, // Shots/sec
    range: 550,
    ammo: 15,
    maxAmmo: 15,
    reserveAmmo: 120,
    reloadTime: 1.2, // Seconds
    spread: 0.04,
    speed: 720,
    bulletRadius: 4,
    bulletColor: '#00f0ff',
    trailColor: 'rgba(0, 240, 255, 0.4)',
    pierce: 0,
    soundType: 'starter',
    unlockCost: 0,
    unlockLevel: 1,
    description: 'Standard issue military plasma sidearm. Highly accurate with fast reload cycle.'
  },
  rapid: {
    id: 'rapid',
    name: 'Rapid Energy Pistol',
    category: 'SMG',
    damage: 22,
    fireRate: 8.5,
    range: 480,
    ammo: 32,
    maxAmmo: 32,
    reserveAmmo: 250,
    reloadTime: 1.4,
    spread: 0.09,
    speed: 780,
    bulletRadius: 3,
    bulletColor: '#38bdf8',
    trailColor: 'rgba(56, 189, 248, 0.4)',
    pierce: 0,
    soundType: 'rapid',
    unlockCost: 600,
    unlockLevel: 4,
    description: 'Twin-cycle plasma repeater capable of shredding approaching swarms at close to medium range.'
  },
  pulse: {
    id: 'pulse',
    name: 'Pulse Rifle',
    category: 'Rifle',
    damage: 48,
    fireRate: 4.8,
    burstCount: 3,
    burstDelay: 0.07,
    range: 750,
    ammo: 30,
    maxAmmo: 30,
    reserveAmmo: 210,
    reloadTime: 1.6,
    spread: 0.03,
    speed: 950,
    bulletRadius: 4,
    bulletColor: '#818cf8',
    trailColor: 'rgba(129, 140, 248, 0.5)',
    pierce: 1,
    soundType: 'pulse',
    unlockCost: 1200,
    unlockLevel: 10,
    description: 'High-velocity 3-round burst precision battle rifle with armor-penetrating energy cells.'
  },
  scatter: {
    id: 'scatter',
    name: 'Scatter Blaster',
    category: 'Shotgun',
    damage: 24, // Per pellet (6 pellets)
    pellets: 6,
    fireRate: 1.5,
    range: 380,
    ammo: 8,
    maxAmmo: 8,
    reserveAmmo: 72,
    reloadTime: 1.8,
    spread: 0.26,
    speed: 640,
    bulletRadius: 3.5,
    bulletColor: '#fb923c',
    trailColor: 'rgba(251, 146, 60, 0.4)',
    pierce: 0,
    soundType: 'scatter',
    unlockCost: 1800,
    unlockLevel: 16,
    description: 'Heavy wide-bore kinetic scattergun firing lethal multi-pellet cones of compressed energy.'
  },
  plasma: {
    id: 'plasma',
    name: 'Plasma Cannon',
    category: 'Heavy',
    damage: 130,
    fireRate: 1.1,
    range: 650,
    ammo: 6,
    maxAmmo: 6,
    reserveAmmo: 42,
    reloadTime: 2.2,
    spread: 0.02,
    speed: 460,
    bulletRadius: 10,
    bulletColor: '#22c55e',
    trailColor: 'rgba(34, 197, 94, 0.5)',
    splashRadius: 75,
    pierce: 0,
    soundType: 'plasma',
    unlockCost: 2800,
    unlockLevel: 22,
    description: 'Devastating heavy ordnance launcher that detonates in a corrosive green plasma shockwave.'
  },
  shock: {
    id: 'shock',
    name: 'Shock Launcher',
    category: 'Energy',
    damage: 65,
    fireRate: 2.0,
    range: 520,
    ammo: 12,
    maxAmmo: 12,
    reserveAmmo: 96,
    reloadTime: 1.7,
    spread: 0.05,
    speed: 680,
    bulletRadius: 5,
    bulletColor: '#facc15',
    trailColor: 'rgba(250, 204, 21, 0.5)',
    chainCount: 3,
    chainRange: 130,
    soundType: 'shock',
    unlockCost: 3800,
    unlockLevel: 28,
    description: 'Electrified Tesla projector whose discharges leap violently across up to 3 adjacent zombies.'
  },
  arc: {
    id: 'arc',
    name: 'Arc Cannon',
    category: 'Beam',
    damage: 18, // Continuous per tick
    fireRate: 15.0, // Ticks/sec
    range: 420,
    ammo: 60,
    maxAmmo: 60,
    reserveAmmo: 360,
    reloadTime: 2.0,
    spread: 0.01,
    speed: 1400,
    isBeam: true,
    bulletRadius: 6,
    bulletColor: '#c084fc',
    trailColor: 'rgba(192, 132, 252, 0.6)',
    pierce: 99, // Pierces all enemies in beam
    soundType: 'arc',
    unlockCost: 5200,
    unlockLevel: 36,
    description: 'Focused singularity stream that channels high-voltage laser radiation through entire hordes.'
  },
  burst: {
    id: 'burst',
    name: 'Energy Burst',
    category: 'Exotic',
    damage: 110,
    fireRate: 1.3,
    range: 320,
    ammo: 8,
    maxAmmo: 8,
    reserveAmmo: 56,
    reloadTime: 2.0,
    spread: 0,
    speed: 400,
    isRadial: true,
    pellets: 12, // 12 orbs in 360 degree circle
    bulletRadius: 5,
    bulletColor: '#f43f5e',
    trailColor: 'rgba(244, 63, 94, 0.5)',
    soundType: 'burst',
    unlockCost: 6800,
    unlockLevel: 44,
    description: 'Radial defense emitter discharging a 360-degree perimeter ring of high-explosive energy charges.'
  },
  freeze: {
    id: 'freeze',
    name: 'Freeze Blaster',
    category: 'Cryo',
    damage: 40,
    fireRate: 4.0,
    range: 520,
    ammo: 24,
    maxAmmo: 24,
    reserveAmmo: 180,
    reloadTime: 1.5,
    spread: 0.06,
    speed: 620,
    bulletRadius: 6,
    bulletColor: '#67e8f9',
    trailColor: 'rgba(103, 232, 249, 0.5)',
    slowDuration: 3.0,
    slowFactor: 0.4, // Slows enemy by 60%
    soundType: 'freeze',
    unlockCost: 8500,
    unlockLevel: 52,
    description: 'Sub-zero cryo projector that flash-freezes zombie tissues, drastically reducing enemy velocity.'
  }
};

class Projectile {
  constructor(x, y, angle, weapon, isCrit = false, owner = 'player') {
    this.x = x;
    this.y = y;
    this.startX = x;
    this.startY = y;
    this.angle = angle;
    this.weapon = weapon;
    this.isCrit = isCrit;
    this.owner = owner;

    this.speed = weapon.speed || 700;
    this.damage = weapon.damage * (isCrit ? 1.75 : 1);
    this.radius = weapon.bulletRadius || 4;
    this.color = weapon.bulletColor || '#00f0ff';
    this.trailColor = weapon.trailColor || 'rgba(0, 240, 255, 0.4)';
    this.range = weapon.range || 500;
    this.pierceLeft = weapon.pierce || 0;
    this.hitEntities = new Set(); // Prevent multi-hits from same frame
    this.life = this.range / this.speed;
    this.alive = true;

    // Trail history
    this.history = [];
    this.maxHistory = 4;
  }

  update(dt) {
    if (!this.alive) return false;

    this.history.push({ x: this.x, y: this.y });
    if (this.history.length > this.maxHistory) this.history.shift();

    const moveStep = this.speed * dt;
    this.x += Math.cos(this.angle) * moveStep;
    this.y += Math.sin(this.angle) * moveStep;

    const traveled = Math.hypot(this.x - this.startX, this.y - this.startY);
    if (traveled >= this.range) {
      this.alive = false;
    }

    return this.alive;
  }

  render(ctx) {
    if (!this.alive) return;

    ctx.save();
    // Render fading trail
    if (this.history.length > 1) {
      ctx.strokeStyle = this.trailColor;
      ctx.lineWidth = this.radius * 1.5;
      ctx.beginPath();
      ctx.moveTo(this.history[0].x, this.history[0].y);
      for (let i = 1; i < this.history.length; i++) {
        ctx.lineTo(this.history[i].x, this.history[i].y);
      }
      ctx.stroke();
    }

    // Render glowing bullet head
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 8;
    ctx.fillStyle = this.isCrit ? '#ffb703' : this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // Hot white core
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 0.45, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

window.WEAPON_DEFINITIONS = WEAPON_DEFINITIONS;
window.Projectile = Projectile;

