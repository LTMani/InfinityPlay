/**
 * InfinityPlay Ultimate Racing - Save & Progression System
 * Resilient persistence with memory fallback and safe JSON recovery
 */

(function() {
  const STORAGE_KEY = 'infinityplay_ultimate_racing';

  const DEFAULT_SAVE = {
    selectedCar: 'velocity-x',
    unlockedCars: ['velocity-x'],
    carUpgrades: {
      'velocity-x': { engine: 1, turbo: 1, brakes: 1, handling: 1, nitro: 1 },
      'nitro-gt': { engine: 1, turbo: 1, brakes: 1, handling: 1, nitro: 1 },
      'phantom-r': { engine: 1, turbo: 1, brakes: 1, handling: 1, nitro: 1 },
      'cyberbolt': { engine: 1, turbo: 1, brakes: 1, handling: 1, nitro: 1 },
      'apex-rs': { engine: 1, turbo: 1, brakes: 1, handling: 1, nitro: 1 }
    },
    credits: 1200,
    xp: 0,
    wins: 0,
    races: 0,
    unlockedLevels: [1],
    completedLevels: [],
    currentLevel: 1,
    bestTimes: {
      'neon-city': null,
      'mountain-pass': null,
      'coastal-highway': null,
      'desert-storm': null,
      'arctic-run': null,
      'jungle-rush': null,
      'volcanic-circuit': null,
      'cyberpunk-district': null,
      'skyway-extreme': null,
      'infinity-grand-prix': null
    },
    bestLaps: {
      'neon-city': null,
      'mountain-pass': null,
      'coastal-highway': null,
      'desert-storm': null,
      'arctic-run': null,
      'jungle-rush': null,
      'volcanic-circuit': null,
      'cyberpunk-district': null,
      'skyway-extreme': null,
      'infinity-grand-prix': null
    },
    championshipProgress: {
      inProgress: false,
      trackIndex: 0,
      scores: {}
    },
    totalDistance: 0, // In km
    highestDriftScore: 0,
    achievements: {},
    settings: {
      soundEffects: true,
      music: true,
      graphicsQuality: 'HIGH', // 'LOW', 'MEDIUM', 'HIGH'
      screenShake: true,
      showFPS: false,
      showMinimap: true,
      controlSensitivity: 1.0
    }
  };

  let memoryStore = null;

  const SaveSystem = {
    data: null,

    init() {
      this.load();
    },

    load() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          // Merge with defaults safely in case of new schema keys
          this.data = this.deepMerge(JSON.parse(JSON.stringify(DEFAULT_SAVE)), parsed);
        } else {
          this.data = JSON.parse(JSON.stringify(DEFAULT_SAVE));
          this.save();
        }
      } catch (err) {
        console.warn('Ultimate Racing: LocalStorage unavailable or corrupt, falling back to memory store.', err);
        this.data = memoryStore || JSON.parse(JSON.stringify(DEFAULT_SAVE));
      }
      return this.data;
    },

    save() {
      if (!this.data) return;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
      } catch (err) {
        memoryStore = JSON.parse(JSON.stringify(this.data));
      }
    },

    deepMerge(target, source) {
      if (!source || typeof source !== 'object') return target;
      for (const key of Object.keys(source)) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
          if (!target[key] || typeof target[key] !== 'object') target[key] = {};
          this.deepMerge(target[key], source[key]);
        } else if (source[key] !== undefined) {
          target[key] = source[key];
        }
      }
      return target;
    },

    getData() {
      if (!this.data) this.init();
      return this.data;
    },

    addCredits(amount) {
      if (!this.data) this.init();
      this.data.credits = Math.max(0, (this.data.credits || 0) + amount);
      this.save();
      return this.data.credits;
    },

    addXP(amount) {
      if (!this.data) this.init();
      this.data.xp = (this.data.xp || 0) + amount;
      this.save();

      // Synchronize with InfinityPlay current user progression if available
      try {
        const userRaw = localStorage.getItem('infinityplay_current_user');
        if (userRaw) {
          const user = JSON.parse(userRaw);
          user.xp = (user.xp || 0) + amount;
          user.level = Math.max(user.level || 1, Math.floor(user.xp / 1500) + 1);
          localStorage.setItem('infinityplay_current_user', JSON.stringify(user));
        }
      } catch (e) {
        // ignore sync error
      }

      return this.data.xp;
    },

    recordDistance(km) {
      if (!this.data) this.init();
      this.data.totalDistance = (this.data.totalDistance || 0) + km;
      this.save();
      this.checkAchievements();
    },

    recordDriftScore(score) {
      if (!this.data) this.init();
      if (score > (this.data.highestDriftScore || 0)) {
        this.data.highestDriftScore = score;
        this.save();
      }
      this.checkAchievements();
    },

    isLevelUnlocked(levelNum) {
      if (!this.data) this.init();
      if (levelNum === 1) return true;
      const unlocked = this.data.unlockedLevels || [1];
      return unlocked.includes(levelNum);
    },

    unlockLevel(levelNum) {
      if (!this.data) this.init();
      if (!this.data.unlockedLevels) this.data.unlockedLevels = [1];
      if (!this.data.unlockedLevels.includes(levelNum)) {
        this.data.unlockedLevels.push(levelNum);
        this.save();
        return true;
      }
      return false;
    },

    completeLevel(levelNum) {
      if (!this.data) this.init();
      if (!this.data.completedLevels) this.data.completedLevels = [];
      let unlockedNew = false;
      if (!this.data.completedLevels.includes(levelNum)) {
        this.data.completedLevels.push(levelNum);
      }
      // Progressive unlocking: beating levelNum unlocks levelNum + 1 (up to 10)
      if (levelNum < 10) {
        unlockedNew = this.unlockLevel(levelNum + 1);
      }
      this.save();
      return unlockedNew;
    },

    isLevelCompleted(levelNum) {
      if (!this.data) this.init();
      return (this.data.completedLevels || []).includes(levelNum);
    },

    isCarUnlocked(carId) {
      if (!this.data) this.init();
      return this.data.unlockedCars.includes(carId);
    },

    unlockCar(carId) {
      if (!this.data) this.init();
      if (!this.data.unlockedCars.includes(carId)) {
        this.data.unlockedCars.push(carId);
        this.save();
        return true;
      }
      return false;
    },

    getCarUpgrades(carId) {
      if (!this.data) this.init();
      if (!this.data.carUpgrades[carId]) {
        this.data.carUpgrades[carId] = { engine: 1, turbo: 1, brakes: 1, handling: 1, nitro: 1 };
      }
      return this.data.carUpgrades[carId];
    },

    getUpgradeCost(currentLevel) {
      // Level 1->2: 400, 2->3: 800, 3->4: 1500, 4->5: 3000
      const costs = [0, 400, 800, 1500, 3000];
      return costs[currentLevel] || 5000;
    },

    upgradePart(carId, part) {
      if (!this.data) this.init();
      const upgrades = this.getCarUpgrades(carId);
      const currentLevel = upgrades[part] || 1;
      if (currentLevel >= 5) return { success: false, reason: 'Max Level Reached' };

      const cost = this.getUpgradeCost(currentLevel);
      if (this.data.credits < cost) {
        return { success: false, reason: 'Insufficient Credits', cost };
      }

      this.data.credits -= cost;
      upgrades[part] = currentLevel + 1;
      this.save();
      return { success: true, newLevel: upgrades[part], remainingCredits: this.data.credits };
    },

    recordRaceResult(result) {
      // result: { trackId, position, totalTime, bestLap, driftScore, isChampionship }
      if (!this.data) this.init();
      this.data.races = (this.data.races || 0) + 1;
      if (result.position === 1) {
        this.data.wins = (this.data.wins || 0) + 1;
      }

      // Check track personal bests
      let isPersonalBest = false;
      const trackId = result.trackId;
      if (result.totalTime) {
        const prevBest = this.data.bestTimes[trackId];
        if (!prevBest || result.totalTime < prevBest) {
          this.data.bestTimes[trackId] = result.totalTime;
          isPersonalBest = true;
        }
      }
      if (result.bestLap) {
        const prevLap = this.data.bestLaps[trackId];
        if (!prevLap || result.bestLap < prevLap) {
          this.data.bestLaps[trackId] = result.bestLap;
        }
      }
      if (result.driftScore && result.driftScore > (this.data.highestDriftScore || 0)) {
        this.data.highestDriftScore = result.driftScore;
      }
      if (result.distance) {
        this.data.totalDistance = (this.data.totalDistance || 0) + result.distance;
      }

      // Unlock check based on wins
      const wins = this.data.wins;
      if (wins >= 5) this.unlockCar('nitro-gt');
      if (wins >= 10) this.unlockCar('phantom-r');
      if (wins >= 15) this.unlockCar('cyberbolt');
      if (result.championshipWon) this.unlockCar('apex-rs');

      this.save();
      this.checkAchievements(result);

      return { isPersonalBest };
    },

    checkAchievements(recentResult = {}) {
      if (!this.data) this.init();
      const unlockedNow = [];
      const ach = this.data.achievements;

      const unlock = (id) => {
        if (!ach[id]) {
          ach[id] = Date.now();
          unlockedNow.push(id);
        }
      };

      if (this.data.races >= 1) unlock('first-race');
      if (this.data.wins >= 1) unlock('first-win');
      if (this.data.races >= 10) unlock('10-races');
      if (this.data.races >= 25) unlock('25-races');
      if (this.data.totalDistance >= 100) unlock('100-km');
      if (this.data.totalDistance >= 1000) unlock('1000-km');
      if (this.data.highestDriftScore >= 2500) unlock('drift-master');

      if (recentResult.topSpeed >= 280) unlock('speed-demon');
      if (recentResult.perfectLap) unlock('perfect-lap');
      if (recentResult.championshipWon) unlock('champion');
      if (recentResult.isPersonalBest) unlock('personal-best');
      if (recentResult.nitroUses >= 5) unlock('nitro-master');

      if (unlockedNow.length > 0) {
        this.save();
        // Trigger notification event
        if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function' && typeof CustomEvent === 'function') {
          window.dispatchEvent(new CustomEvent('urAchievementsUnlocked', { detail: { ids: unlockedNow } }));
        }
      }

      return unlockedNow;
    },

    saveSettings(newSettings) {
      if (!this.data) this.init();
      this.data.settings = { ...this.data.settings, ...newSettings };
      this.save();
    },

    getSettings() {
      if (!this.data) this.init();
      return this.data.settings;
    }
  };

  window.UR = window.UR || {};
  window.UR.SaveSystem = SaveSystem;
  SaveSystem.init();
})();
