/**
 * CONNECTING Puzzle Game - Local Storage & Progress Persistence
 */

(function() {
  'use strict';

  const STORAGE_KEY = 'infinityplay_connecting_save_v1';

  const DEFAULT_DATA = {
    unlockedLevels: [1], // Level 1 unlocked by default
    levels: {}, // { [levelId]: { stars: 0, bestTime: 0, bestMoves: 0, completed: false } }
    settings: {
      sound: true,
      haptics: true,
      colorblind: false
    },
    stats: {
      totalPuzzlesSolved: 0,
      totalMoves: 0,
      bestStreak: 0,
      currentStreak: 0,
      hintsUsed: 0,
      totalTimePlayed: 0
    },
    achievements: {
      first_connection: false,
      flow_master_5x5: false,
      labyrinth_walker_6x6: false,
      color_conduit_7x7: false,
      grid_maestro_8x8: false,
      grandmaster_all: false,
      perfectionist_10: false,
      speed_demon: false,
      pure_intuition: false
    }
  };

  class StorageManager {
    constructor() {
      this.data = this.load();
    }

    load() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return JSON.parse(JSON.stringify(DEFAULT_DATA));
        const parsed = JSON.parse(raw);
        // Merge with defaults to guarantee all schema fields exist
        return {
          ...DEFAULT_DATA,
          ...parsed,
          settings: { ...DEFAULT_DATA.settings, ...(parsed.settings || {}) },
          stats: { ...DEFAULT_DATA.stats, ...(parsed.stats || {}) },
          achievements: { ...DEFAULT_DATA.achievements, ...(parsed.achievements || {}) },
          levels: parsed.levels || {},
          unlockedLevels: Array.isArray(parsed.unlockedLevels) && parsed.unlockedLevels.length > 0
            ? parsed.unlockedLevels
            : [1]
        };
      } catch (err) {
        console.warn('Could not read saved data from localStorage:', err);
        return JSON.parse(JSON.stringify(DEFAULT_DATA));
      }
    }

    save() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
      } catch (err) {
        console.warn('Could not save data to localStorage:', err);
      }
    }

    isLevelUnlocked(levelId) {
      if (levelId === 1) return true;
      return this.data.unlockedLevels.includes(levelId);
    }

    unlockLevel(levelId) {
      if (!this.data.unlockedLevels.includes(levelId)) {
        this.data.unlockedLevels.push(levelId);
        this.data.unlockedLevels.sort((a, b) => a - b);
        this.save();
      }
    }

    getLevelRecord(levelId) {
      return this.data.levels[levelId] || { stars: 0, bestTime: 0, bestMoves: 0, completed: false };
    }

    saveLevelResult(levelId, stars, timeSeconds, moves, usedHint) {
      const existing = this.getLevelRecord(levelId);
      const isFirstTimeCompletion = !existing.completed;

      const updated = {
        completed: true,
        stars: Math.max(existing.stars || 0, stars),
        bestTime: existing.bestTime ? Math.min(existing.bestTime, timeSeconds) : timeSeconds,
        bestMoves: existing.bestMoves ? Math.min(existing.bestMoves, moves) : moves
      };

      this.data.levels[levelId] = updated;

      // Unlock next level (up to 30)
      if (levelId < 30) {
        this.unlockLevel(levelId + 1);
      }

      // Update statistics
      if (isFirstTimeCompletion) {
        this.data.stats.totalPuzzlesSolved++;
      }
      this.data.stats.totalMoves += moves;
      this.data.stats.totalTimePlayed += timeSeconds;
      if (usedHint) {
        this.data.stats.hintsUsed++;
      }

      // Check achievements
      this.evaluateAchievements(levelId, stars, timeSeconds, usedHint);

      this.save();
      return updated;
    }

    evaluateAchievements(levelId, stars, timeSeconds, usedHint) {
      const ach = this.data.achievements;
      const lvls = this.data.levels;

      // 1. First Connection
      if (!ach.first_connection && lvls[1] && lvls[1].completed) {
        ach.first_connection = true;
      }

      // 2. Flow Master (all 5x5 levels 1-5)
      if (!ach.flow_master_5x5) {
        let all5x5 = true;
        for (let i = 1; i <= 5; i++) {
          if (!lvls[i] || !lvls[i].completed) { all5x5 = false; break; }
        }
        if (all5x5) ach.flow_master_5x5 = true;
      }

      // 3. Labyrinth Walker (all 6x6 levels 6-12)
      if (!ach.labyrinth_walker_6x6) {
        let all6x6 = true;
        for (let i = 6; i <= 12; i++) {
          if (!lvls[i] || !lvls[i].completed) { all6x6 = false; break; }
        }
        if (all6x6) ach.labyrinth_walker_6x6 = true;
      }

      // 4. Color Conduit (all 7x7 levels 13-20)
      if (!ach.color_conduit_7x7) {
        let all7x7 = true;
        for (let i = 13; i <= 20; i++) {
          if (!lvls[i] || !lvls[i].completed) { all7x7 = false; break; }
        }
        if (all7x7) ach.color_conduit_7x7 = true;
      }

      // 5. Grid Maestro (all 8x8 levels 21-26)
      if (!ach.grid_maestro_8x8) {
        let all8x8 = true;
        for (let i = 21; i <= 26; i++) {
          if (!lvls[i] || !lvls[i].completed) { all8x8 = false; break; }
        }
        if (all8x8) ach.grid_maestro_8x8 = true;
      }

      // 6. Grandmaster (all 30 levels)
      if (!ach.grandmaster_all) {
        let all30 = true;
        for (let i = 1; i <= 30; i++) {
          if (!lvls[i] || !lvls[i].completed) { all30 = false; break; }
        }
        if (all30) ach.grandmaster_all = true;
      }

      // 7. Perfectionist (10 levels with 3 stars)
      if (!ach.perfectionist_10) {
        let threeStarsCount = 0;
        for (const id in lvls) {
          if (lvls[id].stars >= 3) threeStarsCount++;
        }
        if (threeStarsCount >= 10) ach.perfectionist_10 = true;
      }

      // 8. Speed Demon (solve any level < 15s)
      if (!ach.speed_demon && timeSeconds < 15) {
        ach.speed_demon = true;
      }

      // 9. Pure Intuition (solve without hint)
      if (!ach.pure_intuition && !usedHint) {
        ach.pure_intuition = true;
      }
    }

    getSettings() {
      return this.data.settings;
    }

    updateSetting(key, val) {
      this.data.settings[key] = val;
      this.save();
    }

    getStats() {
      return this.data.stats;
    }

    getAchievements() {
      return this.data.achievements;
    }

    resetAllProgress() {
      this.data = JSON.parse(JSON.stringify(DEFAULT_DATA));
      this.save();
    }
  }

  window.ConnectingStorage = new StorageManager();
})();
