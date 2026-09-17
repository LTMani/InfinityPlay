/**
 * Zombie Survival V2 - Upgrades & Skill Tree System
 * Calculates modified stats for Player and Weapons, handles skill tree node unlocks and modifier equipping.
 */

const PLAYER_UPGRADE_CONFIG_V2 = {
  health: {
    name: 'Max Health',
    icon: '❤️',
    description: '+25 Max Health per level',
    maxLevel: 5,
    costs: [150, 300, 550, 900, 1400],
    bonusPerLevel: 25
  },
  armor: {
    name: 'Armor Plating',
    icon: '🛡️',
    description: '+20 Max Armor per level',
    maxLevel: 5,
    costs: [150, 300, 550, 900, 1400],
    bonusPerLevel: 20
  },
  speed: {
    name: 'Movement Thrusters',
    icon: '⚡',
    description: '+6% Movement Speed per level',
    maxLevel: 5,
    costs: [200, 400, 700, 1100, 1600],
    bonusPerLevel: 0.06
  },
  stamina: {
    name: 'Stamina Reservoir',
    icon: '🔋',
    description: '+20 Max Stamina per level',
    maxLevel: 5,
    costs: [150, 300, 550, 900, 1400],
    bonusPerLevel: 20
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
  },
  damageResistance: {
    name: 'Reflective Weave',
    icon: '🔰',
    description: '+5% Damage Resistance per level',
    maxLevel: 5,
    costs: [300, 600, 1000, 1500, 2200],
    bonusPerLevel: 0.05
  },
  pickupRange: {
    name: 'Magnetic Coil',
    icon: '🧲',
    description: '+25% Item Pickup Magnet Range',
    maxLevel: 5,
    costs: [150, 350, 600, 950, 1400],
    bonusPerLevel: 0.25
  }
};

const WEAPON_UPGRADE_CONFIG_V2 = {
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
  },
  critDmg: {
    name: 'Disruptor Lens',
    icon: '💎',
    desc: '+25% Critical Hit Damage',
    maxLevel: 5,
    costs: [250, 500, 850, 1300, 1900],
    mult: 0.25
  }
};

const SKILL_TREE_CONFIG = {
  survival: {
    id: 'survival',
    name: 'Survival Branch',
    icon: '🛡️',
    color: '#22c55e',
    description: 'Fortify survivor endurance, nanite armor, and biological recovery.',
    skills: [
      { id: 'ironFlesh', name: 'Iron Flesh', icon: '❤️', desc: '+20 Max Health per rank', cost: 1, maxRank: 3, bonus: 20 },
      { id: 'nanitePlating', name: 'Nanite Plating', icon: '🛡️', desc: '+15 Max Armor per rank', cost: 1, maxRank: 3, bonus: 15, requires: 'ironFlesh' },
      { id: 'bioRecovery', name: 'Bio Recovery', icon: '💉', desc: '+25% Healing from pickups', cost: 1, maxRank: 3, bonus: 0.25, requires: 'nanitePlating' }
    ]
  },
  combat: {
    id: 'combat',
    name: 'Combat Branch',
    icon: '⚔️',
    color: '#ef4444',
    description: 'Enhance plasma output, critical lethality, and combo score multiplier.',
    skills: [
      { id: 'overcharge', name: 'Overcharge', icon: '💥', desc: '+10% Overall Weapon Damage', cost: 1, maxRank: 3, bonus: 0.10 },
      { id: 'lethalTargeting', name: 'Lethal Targeting', icon: '🎯', desc: '+5% Critical Chance', cost: 1, maxRank: 3, bonus: 0.05, requires: 'overcharge' },
      { id: 'comboSurge', name: 'Combo Surge', icon: '⚡', desc: '+25% Combo Multiplier Score', cost: 1, maxRank: 3, bonus: 0.25, requires: 'lethalTargeting' }
    ]
  },
  mobility: {
    id: 'mobility',
    name: 'Mobility Branch',
    icon: '💨',
    color: '#38bdf8',
    description: 'Amplify thruster agility, warp dash distance, and coolant cycles.',
    skills: [
      { id: 'kineticDrive', name: 'Kinetic Drive', icon: '👟', desc: '+8% Movement Speed', cost: 1, maxRank: 3, bonus: 0.08 },
      { id: 'phaseDash', name: 'Phase Dash', icon: '🚀', desc: '+25% Dash Distance', cost: 1, maxRank: 3, bonus: 0.25, requires: 'kineticDrive' },
      { id: 'hyperCoolant', name: 'Hyper Coolant', icon: '❄️', desc: '-15% Dash Cooldown', cost: 1, maxRank: 3, bonus: 0.15, requires: 'phaseDash' }
    ]
  }
};

const UpgradesV2 = {
  getPlayerStats() {
    const up = window.Storage.data.playerUpgrades || {};
    const st = window.Storage.data.skillTree || {};

    // Helper to get bonus
    const getBonus = (branch, id) => {
      const node = SKILL_TREE_CONFIG[branch].skills.find(s => s.id === id);
      return node ? node.bonus : 0;
    };

    // Skill tree bonuses
    const skillHp = (st.ironFlesh || 0) * getBonus('survival', 'ironFlesh');
    const skillArmor = (st.nanitePlating || 0) * getBonus('survival', 'nanitePlating');
    const skillSpeed = (st.kineticDrive || 0) * getBonus('mobility', 'kineticDrive');
    const skillDashCool = (st.hyperCoolant || 0) * getBonus('mobility', 'hyperCoolant');
    const skillCrit = (st.lethalTargeting || 0) * getBonus('combat', 'lethalTargeting');
    const skillDmgMult = 1 + (st.overcharge || 0) * getBonus('combat', 'overcharge');
    const skillPhaseDash = (st.phaseDash || 0) * getBonus('mobility', 'phaseDash');
    const skillBioRecovery = (st.bioRecovery || 0) * getBonus('survival', 'bioRecovery');

    const baseHealth = 100 + (up.health || 0) * PLAYER_UPGRADE_CONFIG_V2.health.bonusPerLevel + skillHp;
    const baseArmor = 50 + (up.armor || 0) * PLAYER_UPGRADE_CONFIG_V2.armor.bonusPerLevel + skillArmor;
    const speedMult = (1 + (up.speed || 0) * PLAYER_UPGRADE_CONFIG_V2.speed.bonusPerLevel) * (1 + skillSpeed);
    const baseStamina = 100 + (up.stamina || 0) * PLAYER_UPGRADE_CONFIG_V2.stamina.bonusPerLevel;
    const dashCooldownMult = Math.max(0.35, (1 - (up.dashCooldown || 0) * PLAYER_UPGRADE_CONFIG_V2.dashCooldown.bonusPerLevel) * (1 - skillDashCool));
    const critBonus = (up.critChance || 0) * PLAYER_UPGRADE_CONFIG_V2.critChance.bonusPerLevel + skillCrit;
    const dmgResistance = Math.min(0.4, (up.damageResistance || 0) * PLAYER_UPGRADE_CONFIG_V2.damageResistance.bonusPerLevel);
    const magnetRange = 140 * (1 + (up.pickupRange || 0) * PLAYER_UPGRADE_CONFIG_V2.pickupRange.bonusPerLevel);

    return {
      maxHealth: baseHealth,
      maxArmor: baseArmor,
      moveSpeed: 235 * speedMult,
      maxStamina: baseStamina,
      dashCooldown: 3.5 * dashCooldownMult,
      dashDistanceMult: 1 + skillPhaseDash,
      critChance: 0.06 + critBonus,
      damageResistance: dmgResistance,
      magnetRange: magnetRange,
      damageMultiplier: skillDmgMult,
    };
  },

  getModifiedWeapon(weaponId) {
    const base = window.WEAPON_DEFINITIONS[weaponId] || window.WEAPON_DEFINITIONS.starter;
    const up = (window.Storage.data.weaponUpgrades && window.Storage.data.weaponUpgrades[weaponId]) || {};
    const modId = (window.Storage.data.weaponModifiers && window.Storage.data.weaponModifiers[weaponId]) || null;
    const playerStats = this.getPlayerStats();

    const dmgLvl = up.damage || 0;
    const frLvl = up.fireRate || 0;
    const magLvl = up.mag || 0;
    const relLvl = up.reload || 0;
    const rngLvl = up.range || 0;
    const critDmgLvl = up.critDmg || 0;

    let dmgMult = (1 + dmgLvl * WEAPON_UPGRADE_CONFIG_V2.damage.mult) * playerStats.damageMultiplier;
    let frMult = 1 + frLvl * WEAPON_UPGRADE_CONFIG_V2.fireRate.mult;
    let magMult = 1 + magLvl * WEAPON_UPGRADE_CONFIG_V2.mag.mult;
    let relMult = Math.max(0.35, 1 - relLvl * WEAPON_UPGRADE_CONFIG_V2.reload.mult);
    let rngMult = 1 + rngLvl * WEAPON_UPGRADE_CONFIG_V2.range.mult;
    let spreadMult = 1.0;

    // Apply active modifier perks
    let lifeSteal = 0;
    let chainChance = 0;
    let hasFreeze = false;
    let hasExplosive = false;

    if (modId === 'rapid') frMult *= 1.25;
    if (modId === 'power') dmgMult *= 1.25;
    if (modId === 'precision') spreadMult *= 0.50;
    if (modId === 'extended') magMult *= 1.40;
    if (modId === 'vampiric') lifeSteal = 0.04;
    if (modId === 'chain') chainChance = 0.25;
    if (modId === 'freeze') hasFreeze = true;
    if (modId === 'explosive') hasExplosive = true;

    const maxMag = Math.round(base.ammo * magMult);

    return {
      ...base,
      damage: Math.round(base.damage * dmgMult),
      fireRate: +(base.fireRate * frMult).toFixed(2),
      ammo: maxMag,
      maxAmmo: maxMag,
      reserveAmmo: Math.round(base.reserveAmmo * (1 + magLvl * 0.2)),
      reloadTime: +(base.reloadTime * relMult).toFixed(2),
      range: Math.round(base.range * rngMult),
      spread: +(base.spread * spreadMult).toFixed(3),
      critMultiplier: +( (base.critMultiplier || 1.8) * (1 + critDmgLvl * WEAPON_UPGRADE_CONFIG_V2.critDmg.mult) ).toFixed(2),
      activeModifier: modId,
      lifeSteal: lifeSteal || base.lifeSteal || 0,
      chainChance: chainChance || base.chainChance || 0,
      hasFreeze: hasFreeze || base.hasFreeze || false,
      hasExplosive: hasExplosive || base.hasExplosive || false
    };
  },

  buyPlayerUpgrade(attrKey) {
    const cfg = PLAYER_UPGRADE_CONFIG_V2[attrKey];
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

  buyWeaponUpgrade(weaponId, statKey) {
    const cfg = WEAPON_UPGRADE_CONFIG_V2[statKey];
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

  unlockSkill(skillId) {
    const st = window.Storage.data.skillTree || {};
    let skillConfig = null;

    for (let branchKey of Object.keys(SKILL_TREE_CONFIG)) {
      const branch = SKILL_TREE_CONFIG[branchKey];
      const found = branch.skills.find(s => s.id === skillId);
      if (found) {
        skillConfig = found;
        break;
      }
    }

    if (!skillConfig) return { success: false, msg: 'Unknown skill' };

    if (skillConfig.requires && (!st[skillConfig.requires] || st[skillConfig.requires] <= 0)) {
      return { success: false, msg: 'Prerequisite skill not unlocked yet!' };
    }

    const currentRank = st[skillId] || 0;
    if (currentRank >= skillConfig.maxRank) return { success: false, msg: 'Skill maxed' };

    if (window.Storage.spendSkillPoint()) {
      st[skillId] = currentRank + 1;
      window.Storage.data.skillTree = st;
      window.Storage.data.unlockedSkills = window.Storage.data.unlockedSkills || [];
      if (!window.Storage.data.unlockedSkills.includes(skillId)) {
        window.Storage.data.unlockedSkills.push(skillId);
      }
      window.Storage.save();
      window.Sound.playUpgrade();
      return { success: true, node: skillConfig, newRank: currentRank + 1 };
    }
    return { success: false, msg: 'No skill points available! Level up to earn points.' };
  },

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

UpgradesV2.unlockSkillNode = UpgradesV2.unlockSkill;

window.PLAYER_UPGRADE_CONFIG = PLAYER_UPGRADE_CONFIG_V2;
window.WEAPON_UPGRADE_CONFIG = WEAPON_UPGRADE_CONFIG_V2;
window.SKILL_TREE_CONFIG = SKILL_TREE_CONFIG;
window.SKILL_TREE_DEFINITIONS = SKILL_TREE_CONFIG;
window.Upgrades = UpgradesV2;
