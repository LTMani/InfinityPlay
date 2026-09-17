/**
 * Zombie Survival - Save / Load Storage Manager
 * Handles persistent player profile, progress, weapon upgrades, achievements, and settings.
 * Namespace: infinityplay_zombie_survival
 */

const STORAGE_KEY = 'infinityplay_zombie_survival';

const DEFAULT_SAVE_DATA = {
  version: 1,
  coins: 500, // Starting bonus coins to get first upgrade
  xp: 0,
  playerLevel: 1,
  highestLevelUnlocked: 1,
  completedLevels: {}, // levelId -> { stars: 3, score: 12000, time: 65, kills: 42, accuracy: 92 }
  endlessStats: {
    highestWave: 0,
    bestScore: 0,
    mostKills: 0,
    longestTime: 0
  },
  playerUpgrades: {
    health: 0,     // Max Level 5 (+20 HP each)
    armor: 0,      // Max Level 5 (+15 Armor each)
    speed: 0,      // Max Level 5 (+5% speed each)
    stamina: 0,    // Max Level 5 (+15 stamina)
    dashCooldown: 0, // Max Level 5 (-10% cooldown)
    critChance: 0  // Max Level 5 (+3% crit)
  },
  unlockedWeapons: ['starter'],
  equippedWeapon: 'starter',
  weaponUpgrades: {
    starter: { damage: 0, fireRate: 0, mag: 0, reload: 0, range: 0 },
    rapid:   { damage: 0, fireRate: 0, mag: 0, reload: 0, range: 0 },
    pulse:   { damage: 0, fireRate: 0, mag: 0, reload: 0, range: 0 },
    scatter: { damage: 0, fireRate: 0, mag: 0, reload: 0, range: 0 },
    plasma:  { damage: 0, fireRate: 0, mag: 0, reload: 0, range: 0 },
    shock:   { damage: 0, fireRate: 0, mag: 0, reload: 0, range: 0 },
    arc:     { damage: 0, fireRate: 0, mag: 0, reload: 0, range: 0 },
    burst:   { damage: 0, fireRate: 0, mag: 0, reload: 0, range: 0 },
    freeze:  { damage: 0, fireRate: 0, mag: 0, reload: 0, range: 0 }
  },
  equippedSkill: 'dash',
  unlockedSkills: ['dash'],
  missions: {}, // missionId -> { progress: 0, completed: false, claimed: false }
  achievements: {}, // achievementId -> { unlocked: true, date: '...' }
  stats: {
    totalKills: 0,
    totalCoinsEarned: 0,
    totalGamesPlayed: 0,
    totalSurvivalTime: 0,
    bestCombo: 0,
    bossesDefeated: 0
  },
  settings: {
    sfx: true,
    music: true,
    screenShake: true,
    showDamageNumbers: true,
    autoReload: true
  }
};

class SaveManager {
  constructor() {
    this.data = this.load();
  }

  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return JSON.parse(JSON.stringify(DEFAULT_SAVE_DATA));
      const parsed = JSON.parse(raw);
      // Merge with defaults to prevent undefined on new fields
      return this._deepMerge(JSON.parse(JSON.stringify(DEFAULT_SAVE_DATA)), parsed);
    } catch (e) {
      console.warn('[SaveManager] Failed to read save data, restoring defaults:', e);
      return JSON.parse(JSON.stringify(DEFAULT_SAVE_DATA));
    }
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.error('[SaveManager] Could not write to localStorage:', e);
    }
  }

  reset() {
    this.data = JSON.parse(JSON.stringify(DEFAULT_SAVE_DATA));
    this.save();
  }

  // --- PROGRESS HELPERS ---

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
    // Level scaling: lvl 1 = 200, lvl 2 = 500, lvl 3 = 900, etc.
    const needed = this.getXPForNextLevel(this.data.playerLevel);
    if (this.data.xp >= needed) {
      this.data.playerLevel++;
      // Bonus coins on player level up
      this.data.coins += this.data.playerLevel * 100;
    }
    this.save();
  }

  getXPForNextLevel(lvl) {
    return Math.floor(200 * Math.pow(lvl, 1.35));
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

  unlockSkill(skillId) {
    if (!this.data.unlockedSkills.includes(skillId)) {
      this.data.unlockedSkills.push(skillId);
      this.save();
    }
  }

  equipSkill(skillId) {
    if (this.data.unlockedSkills.includes(skillId)) {
      this.data.equippedSkill = skillId;
      this.save();
      return true;
    }
    return false;
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

