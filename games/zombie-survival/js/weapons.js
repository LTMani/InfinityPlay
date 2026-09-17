/**
 * Zombie Survival V2 - Weapons & Modifiers System
 * 10 Fictional Arcade Energy Weapons with distinctive ballistic behaviors and 8 modular upgrades.
 */

const WEAPON_DEFINITIONS_V2 = {
  starter: {
    id: 'starter',
    name: 'Starter Blaster',
    category: 'Pistol',
    damage: 35,
    fireRate: 3.8,
    range: 560,
    ammo: 16,
    maxAmmo: 16,
    reserveAmmo: 140,
    reloadTime: 1.1,
    spread: 0.03,
    speed: 760,
    bulletRadius: 4,
    bulletColor: '#00f0ff',
    trailColor: 'rgba(0, 240, 255, 0.4)',
    criticalChance: 0.08,
    critMultiplier: 1.8,
    pierce: 0,
    soundType: 'starter',
    unlockCost: 0,
    unlockLevel: 1,
    description: 'Precision sidearm with high baseline accuracy and rapid charge cycles.'
  },
  pulse: {
    id: 'pulse',
    name: 'Pulse Rifle',
    category: 'Rifle',
    damage: 48,
    fireRate: 5.0,
    burstCount: 3,
    burstDelay: 0.06,
    range: 780,
    ammo: 30,
    maxAmmo: 30,
    reserveAmmo: 240,
    reloadTime: 1.5,
    spread: 0.025,
    speed: 980,
    bulletRadius: 4.5,
    bulletColor: '#818cf8',
    trailColor: 'rgba(129, 140, 248, 0.5)',
    criticalChance: 0.12,
    critMultiplier: 2.0,
    pierce: 1,
    soundType: 'pulse',
    unlockCost: 900,
    unlockLevel: 5,
    description: '3-round burst tactical energy rifle delivering armor-piercing kinetic rounds.'
  },
  shocksmg: {
    id: 'shocksmg',
    name: 'Shock SMG',
    category: 'SMG',
    damage: 24,
    fireRate: 9.5,
    range: 460,
    ammo: 36,
    maxAmmo: 36,
    reserveAmmo: 280,
    reloadTime: 1.3,
    spread: 0.08,
    speed: 820,
    bulletRadius: 3.5,
    bulletColor: '#facc15',
    trailColor: 'rgba(250, 204, 21, 0.4)',
    criticalChance: 0.10,
    critMultiplier: 1.7,
    pierce: 0,
    soundType: 'rapid',
    unlockCost: 1500,
    unlockLevel: 10,
    description: 'High-cycle submachine gun spraying electrifying ionized needles at blistering velocity.'
  },
  scatter: {
    id: 'scatter',
    name: 'Plasma Scatter',
    category: 'Shotgun',
    damage: 26, // Per pellet (7 pellets)
    pellets: 7,
    fireRate: 1.6,
    range: 400,
    ammo: 8,
    maxAmmo: 8,
    reserveAmmo: 80,
    reloadTime: 1.8,
    spread: 0.24,
    speed: 680,
    bulletRadius: 4,
    bulletColor: '#fb923c',
    trailColor: 'rgba(251, 146, 60, 0.4)',
    criticalChance: 0.08,
    critMultiplier: 1.9,
    pierce: 0,
    soundType: 'scatter',
    unlockCost: 2400,
    unlockLevel: 16,
    description: 'Wide-bore scatter blaster releasing high-density cones of superheated kinetic plasma.'
  },
  arc: {
    id: 'arc',
    name: 'Arc Cannon',
    category: 'Beam',
    damage: 22, // Continuous tick
    fireRate: 14.0,
    range: 440,
    ammo: 60,
    maxAmmo: 60,
    reserveAmmo: 360,
    reloadTime: 2.0,
    spread: 0.01,
    speed: 1500,
    isBeam: true,
    bulletRadius: 6,
    bulletColor: '#c084fc',
    trailColor: 'rgba(192, 132, 252, 0.6)',
    criticalChance: 0.15,
    critMultiplier: 1.8,
    pierce: 99,
    soundType: 'arc',
    unlockCost: 3600,
    unlockLevel: 22,
    description: 'Focused electromagnetic singularity stream channeling continuous voltage through multiple foes.'
  },
  freeze: {
    id: 'freeze',
    name: 'Freeze Blaster',
    category: 'Cryo',
    damage: 42,
    fireRate: 4.2,
    range: 540,
    ammo: 24,
    maxAmmo: 24,
    reserveAmmo: 190,
    reloadTime: 1.5,
    spread: 0.05,
    speed: 640,
    bulletRadius: 6,
    bulletColor: '#67e8f9',
    trailColor: 'rgba(103, 232, 249, 0.5)',
    slowDuration: 3.0,
    slowFactor: 0.35,
    criticalChance: 0.10,
    critMultiplier: 1.75,
    soundType: 'freeze',
    unlockCost: 4800,
    unlockLevel: 28,
    description: 'Cryogenic projector flash-freezing zombie flesh to severely retard enemy advance.'
  },
  energy: {
    id: 'energy',
    name: 'Energy Cannon',
    category: 'Heavy',
    damage: 150,
    fireRate: 1.2,
    range: 680,
    ammo: 6,
    maxAmmo: 6,
    reserveAmmo: 48,
    reloadTime: 2.1,
    spread: 0.02,
    speed: 480,
    bulletRadius: 11,
    bulletColor: '#22c55e',
    trailColor: 'rgba(34, 197, 94, 0.5)',
    splashRadius: 85,
    criticalChance: 0.15,
    critMultiplier: 2.2,
    soundType: 'plasma',
    unlockCost: 6200,
    unlockLevel: 35,
    description: 'Heavy artillery projector firing compressed plasma bombs that detonate in lethal shockwaves.'
  },
  rail: {
    id: 'rail',
    name: 'Rail Pulse',
    category: 'Sniper',
    damage: 220,
    fireRate: 1.0,
    range: 1100,
    ammo: 5,
    maxAmmo: 5,
    reserveAmmo: 35,
    reloadTime: 2.2,
    spread: 0.005,
    speed: 2200,
    bulletRadius: 5,
    bulletColor: '#ec4899',
    trailColor: 'rgba(236, 72, 153, 0.7)',
    pierce: 5, // Pierces straight through 5 zombies in a line
    criticalChance: 0.25,
    critMultiplier: 2.8,
    soundType: 'pulse',
    unlockCost: 8000,
    unlockLevel: 42,
    description: 'Hyper-accelerated rail accelerator driving hyperdense slugs through entire columns of mutants.'
  },
  nova: {
    id: 'nova',
    name: 'Nova Blaster',
    category: 'Exotic',
    damage: 120,
    fireRate: 1.4,
    range: 350,
    ammo: 8,
    maxAmmo: 8,
    reserveAmmo: 64,
    reloadTime: 2.0,
    spread: 0,
    speed: 420,
    isRadial: true,
    pellets: 16, // 16 radiating orbs
    bulletRadius: 5,
    bulletColor: '#f43f5e',
    trailColor: 'rgba(244, 63, 94, 0.5)',
    criticalChance: 0.12,
    critMultiplier: 1.8,
    soundType: 'burst',
    unlockCost: 10500,
    unlockLevel: 50,
    description: 'Multi-directional nova core that erupts into a 360-degree perimeter wave of concussive plasma.'
  },
  infinity: {
    id: 'infinity',
    name: 'Infinity Cannon',
    category: 'Legendary',
    damage: 280,
    fireRate: 2.5,
    range: 900,
    ammo: 20,
    maxAmmo: 20,
    reserveAmmo: 160,
    reloadTime: 1.8,
    spread: 0.015,
    speed: 1600,
    bulletRadius: 8,
    bulletColor: '#38bdf8',
    trailColor: 'rgba(56, 189, 248, 0.8)',
    splashRadius: 70,
    pierce: 3,
    criticalChance: 0.30,
    critMultiplier: 3.0,
    soundType: 'plasma',
    unlockCost: 15000,
    unlockLevel: 60,
    description: 'Legendary InfinityPlay antimatter emitter delivering cataclysmic energy discharges.'
  }
};

const WEAPON_MODIFIERS = {
  rapid: {
    id: 'rapid',
    name: 'Rapid Cycler',
    icon: '⚡',
    rarity: 'Common',
    color: '#38bdf8',
    desc: '+25% Fire Rate'
  },
  power: {
    id: 'power',
    name: 'Power Core',
    icon: '💥',
    rarity: 'Common',
    color: '#fb7185',
    desc: '+25% Damage'
  },
  precision: {
    id: 'precision',
    name: 'Precision Sight',
    icon: '🎯',
    rarity: 'Common',
    color: '#34d399',
    desc: '-50% Spread'
  },
  extended: {
    id: 'extended',
    name: 'Extended Mag',
    icon: '🔋',
    rarity: 'Common',
    color: '#facc15',
    desc: '+40% Magazine Size'
  },
  vampiric: {
    id: 'vampiric',
    name: 'Vampiric Nano',
    icon: '🩸',
    rarity: 'Rare',
    color: '#ec4899',
    desc: 'Restores 4% Health on hit'
  },
  chain: {
    id: 'chain',
    name: 'Chain Conduit',
    icon: '⚡',
    rarity: 'Rare',
    color: '#a855f7',
    desc: '25% chance to chain lightning'
  },
  freeze: {
    id: 'freeze',
    name: 'Cryo Infusion',
    icon: '❄️',
    rarity: 'Epic',
    color: '#67e8f9',
    desc: 'Slows enemies by 45%'
  },
  explosive: {
    id: 'explosive',
    name: 'Explosive Payload',
    icon: '💣',
    rarity: 'Legendary',
    color: '#f97316',
    desc: 'Bullets explode on impact'
  }
};

class ProjectileV2 {
  constructor(x, y, angle, weapon, isCrit = false, owner = 'player', activeModifier = null) {
    this.x = x;
    this.y = y;
    this.startX = x;
    this.startY = y;
    this.angle = angle;
    this.weapon = weapon;
    this.isCrit = isCrit;
    this.owner = owner;
    this.modifier = activeModifier;

    this.speed = weapon.speed || 750;
    this.damage = weapon.damage * (isCrit ? (weapon.critMultiplier || 1.8) : 1);
    this.radius = weapon.bulletRadius || 4;
    this.color = weapon.bulletColor || '#00f0ff';
    this.trailColor = weapon.trailColor || 'rgba(0, 240, 255, 0.4)';
    this.range = weapon.range || 550;
    this.pierceLeft = weapon.pierce || 0;
    this.hitEntities = new Set();
    this.life = this.range / this.speed;
    this.alive = true;

    // Apply modifier perks
    if (this.modifier === 'power') {
      this.damage *= 1.25;
    }

    this.history = [];
    this.maxHistory = 4;
  }

  update(dt) {
    if (!this.alive) return false;

    this.history.push({ x: this.x, y: this.y });
    if (this.history.length > this.maxHistory) this.history.shift();

    const step = this.speed * dt;
    this.x += Math.cos(this.angle) * step;
    this.y += Math.sin(this.angle) * step;

    const traveled = Math.hypot(this.x - this.startX, this.y - this.startY);
    if (traveled >= this.range) {
      this.alive = false;
    }

    return this.alive;
  }

  render(ctx) {
    if (!this.alive) return;

    ctx.save();
    // Trail
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

    // Glowing bullet head
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

// Global registry mapping
window.WEAPON_DEFINITIONS = WEAPON_DEFINITIONS_V2;
window.WEAPON_MODIFIERS = WEAPON_MODIFIERS;
window.Projectile = ProjectileV2;
