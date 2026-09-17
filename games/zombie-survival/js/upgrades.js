/**
 * Zombie Survival - Upgrade Manager
 * Calculates real-time modified stats for Player and Weapons with coin economics.
 */

const PLAYER_UPGRADE_CONFIG = {
  health: {
    name: 'Max Health',
    icon: '❤️',
    description: '+20 Max Health per level',
    maxLevel: 5,
    costs: [150, 300, 550, 900, 1400],
    bonusPerLevel: 20
  },
  armor: {
    name: 'Armor Plating',
    icon: '🛡️',
    description: '+15 Max Armor per level',
    maxLevel: 5,
    costs: [150, 300, 550, 900, 1400],
    bonusPerLevel: 15
  },
  speed: {
    name: 'Movement Thrusters',
    icon: '⚡',
    description: '+5% Movement Speed per level',
    maxLevel: 5,
    costs: [200, 400, 700, 1100, 1600],
    bonusPerLevel: 0.05
  },
  stamina: {
    name: 'Stamina Tank',
    icon: '🔋',
    description: '+15 Max Stamina per level',
    maxLevel: 5,
    costs: [150, 300, 550, 900, 1400],
    bonusPerLevel: 15
  },
  dashCooldown: {
    name: 'Dash Coolant',
    icon: '💨',
    description: '-10% Dash Cooldown per level',
    maxLevel: 5,
    costs: [250, 500, 850, 1300, 1900],
    bonusPerLevel: 0.10
  },
  critChance: {
    name: 'Targeting Computer',
    icon: '🎯',
    description: '+3% Critical Hit Chance per level',
    maxLevel: 5,
    costs: [250, 500, 850, 1300, 1900],
    bonusPerLevel: 0.03
  }
};

const WEAPON_UPGRADE_CONFIG = {
  damage: {
    name: 'Plasma Core',
    icon: '💥',
    desc: '+15% Base Damage',
    maxLevel: 5,
    costs: [200, 400, 750, 1200, 1800],
    mult: 0.15
  },
  fireRate: {
    name: 'Cycler Booster',
    icon: '⚡',
    desc: '+12% Fire Rate',
    maxLevel: 5,
    costs: [200, 400, 750, 1200, 1800],
    mult: 0.12
  },
  mag: {
    name: 'Extended Clip',
    icon: '🔋',
    desc: '+25% Magazine Capacity',
    maxLevel: 5,
    costs: [150, 350, 600, 950, 1450],
    mult: 0.25
  },
  reload: {
    name: 'Quick Release',
    icon: '🔄',
    desc: '-15% Reload Duration',
    maxLevel: 5,
    costs: [150, 350, 600, 950, 1450],
    mult: 0.15
  },
  range: {
    name: 'Beam Collimator',
    icon: '🔭',
    desc: '+15% Projectile Range',
    maxLevel: 5,
    costs: [150, 300, 550, 850, 1300],
    mult: 0.15
  }
};

const Upgrades = {
  // Compute full player stats including upgrades
  getPlayerStats() {
    const up = window.Storage.data.playerUpgrades;
    const baseHealth = 100 + (up.health || 0) * PLAYER_UPGRADE_CONFIG.health.bonusPerLevel;
    const baseArmor = 50 + (up.armor || 0) * PLAYER_UPGRADE_CONFIG.armor.bonusPerLevel;
    const speedMult = 1 + (up.speed || 0) * PLAYER_UPGRADE_CONFIG.speed.bonusPerLevel;
    const baseStamina = 100 + (up.stamina || 0) * PLAYER_UPGRADE_CONFIG.stamina.bonusPerLevel;
    const dashCooldownMult = Math.max(0.4, 1 - (up.dashCooldown || 0) * PLAYER_UPGRADE_CONFIG.dashCooldown.bonusPerLevel);
    const critBonus = (up.critChance || 0) * PLAYER_UPGRADE_CONFIG.critChance.bonusPerLevel;

    return {
      maxHealth: baseHealth,
      maxArmor: baseArmor,
      moveSpeed: 230 * speedMult,
      maxStamina: baseStamina,
      dashCooldown: 3.5 * dashCooldownMult,
      critChance: 0.05 + critBonus
    };
  },

  // Compute full weapon stats including upgrades
  getModifiedWeapon(weaponId) {
    const base = window.WEAPON_DEFINITIONS[weaponId] || window.WEAPON_DEFINITIONS.starter;
    const up = (window.Storage.data.weaponUpgrades && window.Storage.data.weaponUpgrades[weaponId]) || {};

    const dmgLvl = up.damage || 0;
    const frLvl = up.fireRate || 0;
    const magLvl = up.mag || 0;
    const relLvl = up.reload || 0;
    const rngLvl = up.range || 0;

    const dmgMult = 1 + dmgLvl * WEAPON_UPGRADE_CONFIG.damage.mult;
    const frMult = 1 + frLvl * WEAPON_UPGRADE_CONFIG.fireRate.mult;
    const magMult = 1 + magLvl * WEAPON_UPGRADE_CONFIG.mag.mult;
    const relMult = Math.max(0.4, 1 - relLvl * WEAPON_UPGRADE_CONFIG.reload.mult);
    const rngMult = 1 + rngLvl * WEAPON_UPGRADE_CONFIG.range.mult;

    const maxMag = Math.round(base.ammo * magMult);

    return {
      ...base,
      damage: Math.round(base.damage * dmgMult),
      fireRate: +(base.fireRate * frMult).toFixed(2),
      ammo: maxMag,
      maxAmmo: maxMag,
      reserveAmmo: Math.round(base.reserveAmmo * (1 + magLvl * 0.2)),
      reloadTime: +(base.reloadTime * relMult).toFixed(2),
      range: Math.round(base.range * rngMult)
    };
  },

  // Upgrade player attribute
  buyPlayerUpgrade(attrKey) {
    const cfg = PLAYER_UPGRADE_CONFIG[attrKey];
    if (!cfg) return { success: false, msg: 'Invalid upgrade' };

    const curLvl = window.Storage.data.playerUpgrades[attrKey] || 0;
    if (curLvl >= cfg.maxLevel) return { success: false, msg: 'Max level reached' };

    const cost = cfg.costs[curLvl];
    if (window.Storage.spendCoins(cost)) {
      window.Storage.data.playerUpgrades[attrKey] = curLvl + 1;
      window.Storage.save();
      window.Sound.playUpgrade();
      return { success: true, newLevel: curLvl + 1 };
    }
    return { success: false, msg: 'Not enough coins' };
  },

  // Upgrade weapon attribute
  buyWeaponUpgrade(weaponId, statKey) {
    const cfg = WEAPON_UPGRADE_CONFIG[statKey];
    if (!cfg) return { success: false, msg: 'Invalid stat' };

    window.Storage.data.weaponUpgrades[weaponId] = window.Storage.data.weaponUpgrades[weaponId] || {};
    const curLvl = window.Storage.data.weaponUpgrades[weaponId][statKey] || 0;
    if (curLvl >= cfg.maxLevel) return { success: false, msg: 'Max level reached' };

    const cost = cfg.costs[curLvl];
    if (window.Storage.spendCoins(cost)) {
      window.Storage.data.weaponUpgrades[weaponId][statKey] = curLvl + 1;
      window.Storage.save();
      window.Sound.playUpgrade();
      return { success: true, newLevel: curLvl + 1 };
    }
    return { success: false, msg: 'Not enough coins' };
  },

  // Buy new weapon
  unlockWeapon(weaponId) {
    const def = window.WEAPON_DEFINITIONS[weaponId];
    if (!def) return { success: false, msg: 'Unknown weapon' };

    if (window.Storage.data.unlockedWeapons.includes(weaponId)) {
      return { success: true, alreadyUnlocked: true };
    }

    if (window.Storage.spendCoins(def.unlockCost)) {
      window.Storage.unlockWeapon(weaponId);
      window.Sound.playUpgrade();
      return { success: true };
    }
    return { success: false, msg: 'Not enough coins' };
  }
};

window.PLAYER_UPGRADE_CONFIG = PLAYER_UPGRADE_CONFIG;
window.WEAPON_UPGRADE_CONFIG = WEAPON_UPGRADE_CONFIG;
window.Upgrades = Upgrades;

