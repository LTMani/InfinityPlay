/**
 * Zombie Survival V2 - Save / Load Storage Manager
 * Handles persistent player profile, progress, weapon upgrades, skill tree, modifiers, loot, and settings.
 * Namespace: infinityplay_zombie_survival
 * Backward-compatible: automatically migrates V1 save data without resetting player progression.
 */

const STORAGE_KEY = 'infinityplay_zombie_survival';

const DEFAULT_SAVE_DATA_V2 = {
  version: 2,
  schemaVersion: 2,
  coins: 500,
  xp: 0,
  playerLevel: 1,
  skillPoints: 0,
  highestLevelUnlocked: 1,
  completedLevels: {}, // levelId -> { stars: 3, score: 12000, time: 65, kills: 42, accuracy: 92 }
  endlessStats: {
    highestWave: 0,
    bestScore: 0,
    mostKills: 0,
    longestTime: 0
  },
  playerUpgrades: {
    health: 0,           // Max 5
    armor: 0,            // Max 5
    speed: 0,            // Max 5
    stamina: 0,          // Max 5
    dashCooldown: 0,     // Max 5
    critChance: 0,       // Max 5
    damageResistance: 0, // Max 5 (V2 new)
    pickupRange: 0       // Max 5 (V2 new)
  },
  skillTree: {
    // Survival branch
    ironFlesh: 0,       // +HP
    nanitePlating: 0,   // +Armor
    bioRecovery: 0,     // +Pickup Healing
    // Combat branch
    overcharge: 0,      // +Damage
    lethalTargeting: 0, // +Crit Chance
    comboSurge: 0,      // +Combo Score Bonus
    // Mobility branch
    kineticDrive: 0,    // +Move Speed
    phaseDash: 0,       // +Dash Distance
    hyperCoolant: 0     // -Dash Cooldown
  },
  unlockedWeapons: ['starter'],
  equippedWeapon: 'starter',
  weaponUpgrades: {
    starter:  { damage: 0, fireRate: 0, mag: 0, reload: 0, range: 0, critDmg: 0 },
    pulse:    { damage: 0, fireRate: 0, mag: 0, reload: 0, range: 0, critDmg: 0 },
    shocksmg: { damage: 0, fireRate: 0, mag: 0, reload: 0, range: 0, critDmg: 0 },
    scatter:  { damage: 0, fireRate: 0, mag: 0, reload: 0, range: 0, critDmg: 0 },
    arc:      { damage: 0, fireRate: 0, mag: 0, reload: 0, range: 0, critDmg: 0 },
    freeze:   { damage: 0, fireRate: 0, mag: 0, reload: 0, range: 0, critDmg: 0 },
    energy:   { damage: 0, fireRate: 0, mag: 0, reload: 0, range: 0, critDmg: 0 },
    rail:     { damage: 0, fireRate: 0, mag: 0, reload: 0, range: 0, critDmg: 0 },
    nova:     { damage: 0, fireRate: 0, mag: 0, reload: 0, range: 0, critDmg: 0 },
    infinity: { damage: 0, fireRate: 0, mag: 0, reload: 0, range: 0, critDmg: 0 }
  },
  weaponModifiers: {
    starter: null,
    pulse: null,
    shocksmg: null,
    scatter: null,
    arc: null,
    freeze: null,
    energy: null,
    rail: null,
    nova: null,
    infinity: null
  },
  unlockedModifiers: ['rapid'], // Starter modifier available
  lootInventory: [],            // Dropped loot tokens & modifiers
  equippedSkill: 'dash',
  unlockedSkills: ['dash'],
  missions: {},
  achievements: {},
  stats: {
    totalKills: 0,
    totalCoinsEarned: 0,
    totalGamesPlayed: 0,
    totalSurvivalTime: 0,
    bestCombo: 0,
    bossesDefeated: 0,
    totalMissionsCompleted: 0
  },
  settings: {
    sfx: true,
    music: true,
    screenShake: true,
    showDamageNumbers: true,
    autoReload: true,
    highContrast: false,
    reducedMotion: false
  }
};

class SaveManager {
  constructor() {
    this.data = this.load();
  }

  init() {
    this.data = this.load();
    return this.data;
  }

  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return JSON.parse(JSON.stringify(DEFAULT_SAVE_DATA_V2));
      const parsed = JSON.parse(raw);
      return this.migrate(parsed);
    } catch (e) {
      console.warn('[SaveManager] Failed to read save data, restoring V2 defaults:', e);
      return JSON.parse(JSON.stringify(DEFAULT_SAVE_DATA_V2));
    }
  }

  migrate(oldData) {
    const v2Default = JSON.parse(JSON.stringify(DEFAULT_SAVE_DATA_V2));
    if (!oldData || typeof oldData !== 'object') return v2Default;

    // Deep merge to preserve existing progress
    const merged = this._deepMerge(v2Default, oldData);
    merged.version = 2;

    // Ensure V1 weapon IDs map to V2 IDs if needed
    if (merged.unlockedWeapons && merged.unlockedWeapons.includes('rapid')) {
      if (!merged.unlockedWeapons.includes('shocksmg')) merged.unlockedWeapons.push('shocksmg');
    }
    if (merged.unlockedWeapons && merged.unlockedWeapons.includes('plasma')) {
      if (!merged.unlockedWeapons.includes('energy')) merged.unlockedWeapons.push('energy');
    }

    // Award retroactive skill points based on player level
    const expectedPoints = Math.max(0, (merged.playerLevel || 1) - 1);
    let spentPoints = 0;
    if (merged.skillTree) {
      for (let k in merged.skillTree) {
        spentPoints += merged.skillTree[k] || 0;
      }
    }
    merged.skillPoints = Math.max(0, expectedPoints - spentPoints);

    this.data = merged;
    this.save();
    return merged;
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.error('[SaveManager] Could not write to localStorage:', e);
    }
  }

  reset() {
    this.data = JSON.parse(JSON.stringify(DEFAULT_SAVE_DATA_V2));
    this.save();
  }

  isLevelUnlocked(levelId) {
    if (levelId === 1) return true;
    return (this.data.highestLevelUnlocked >= levelId);
  }

  completeLevel(levelId, stars, score, time, kills, accuracy) {
    const prev = this.data.completedLevels[levelId] || { stars: 0, score: 0, time: 999999 };
    const newRecord = {
      stars: Math.max(prev.stars, stars),
      score: Math.max(prev.score, score),
      time: Math.min(prev.time, time),
      kills: Math.max(prev.kills || 0, kills),
      accuracy: Math.max(prev.accuracy || 0, accuracy)
    };

    this.data.completedLevels[levelId] = newRecord;

    if (levelId + 1 <= 60 && levelId >= this.data.highestLevelUnlocked) {
      this.data.highestLevelUnlocked = levelId + 1;
    }

    this.save();
    return newRecord;
  }

  addCoins(amt) {
    if (typeof amt !== 'number' || isNaN(amt) || amt < 0) return;
    this.data.coins += Math.round(amt);
    this.data.stats.totalCoinsEarned += Math.round(amt);
    this.save();
  }

  spendCoins(amt) {
    if (this.data.coins >= amt) {
      this.data.coins -= amt;
      this.save();
      return true;
    }
    return false;
  }

  addXP(amt) {
    if (typeof amt !== 'number' || isNaN(amt) || amt < 0) return;
    this.data.xp += Math.round(amt);
    const needed = this.getXPForNextLevel(this.data.playerLevel);
    if (this.data.xp >= needed) {
      this.data.playerLevel++;
      this.data.skillPoints++; // Award skill point on level up!
      this.data.coins += this.data.playerLevel * 100;
      if (window.gameInstance && window.gameInstance.ui) {
        window.gameInstance.ui.showToast(`LEVEL UP! Rank ${this.data.playerLevel} (+1 Skill Point, +${this.data.playerLevel * 100} Coins)`, 'achievement');
      }
    }
    this.save();
  }

  getXPForNextLevel(lvl) {
    return Math.floor(250 * Math.pow(lvl, 1.35));
  }

  spendSkillPoint() {
    if (this.data.skillPoints > 0) {
      this.data.skillPoints--;
      this.save();
      return true;
    }
    return false;
  }

  unlockWeapon(weaponId) {
    if (!this.data.unlockedWeapons.includes(weaponId)) {
      this.data.unlockedWeapons.push(weaponId);
      this.save();
    }
  }

  equipWeapon(weaponId) {
    if (this.data.unlockedWeapons.includes(weaponId)) {
      this.data.equippedWeapon = weaponId;
      this.save();
      return true;
    }
    return false;
  }

  equipModifier(weaponId, modifierId) {
    if (this.data.weaponModifiers && (this.data.unlockedModifiers.includes(modifierId) || modifierId === null)) {
      this.data.weaponModifiers[weaponId] = modifierId;
      this.save();
      return true;
    }
    return false;
  }

  addModifier(modifierId) {
    this.data.unlockedModifiers = this.data.unlockedModifiers || [];
    if (!this.data.unlockedModifiers.includes(modifierId)) {
      this.data.unlockedModifiers.push(modifierId);
    }
    this.data.inventory = this.data.inventory || { modifiers: [] };
    this.data.inventory.modifiers = this.data.inventory.modifiers || [];
    if (!this.data.inventory.modifiers.includes(modifierId)) {
      this.data.inventory.modifiers.push(modifierId);
    }
    this.save();
  }

  addLoot(lootItem) {
    this.data.lootInventory = this.data.lootInventory || [];
    this.data.lootInventory.push(lootItem);
    if (lootItem.type === 'modifier' && !this.data.unlockedModifiers.includes(lootItem.id)) {
      this.data.unlockedModifiers.push(lootItem.id);
    }
    this.save();
  }

  recordEndlessStats(wave, score, kills, time) {
    const cur = this.data.endlessStats;
    cur.highestWave = Math.max(cur.highestWave, wave);
    cur.bestScore = Math.max(cur.bestScore, score);
    cur.mostKills = Math.max(cur.mostKills, kills);
    cur.longestTime = Math.max(cur.longestTime, time);
    this.save();
  }

  recordStats(kills, combo, time, isBoss = false) {
    this.data.stats.totalKills += kills;
    this.data.stats.totalGamesPlayed += 1;
    this.data.stats.totalSurvivalTime += time;
    this.data.stats.bestCombo = Math.max(this.data.stats.bestCombo, combo);
    if (isBoss) this.data.stats.bossesDefeated += 1;
    this.save();
  }

  _deepMerge(target, source) {
    for (const key of Object.keys(source)) {
      if (source[key] instanceof Object && !Array.isArray(source[key])) {
        if (!target[key]) target[key] = {};
        Object.assign(source[key], this._deepMerge(target[key], source[key]));
      }
    }
    Object.assign(target || {}, source);
    return target;
  }
}

// Global Save Instance
window.Storage = new SaveManager();
