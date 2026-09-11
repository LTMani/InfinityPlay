/**
 * PSEUDOKO — Persistent Save System
 * Robust LocalStorage manager for campaign progression, 100 levels, stars,
 * daily streaks, endless records, achievements, and player preferences.
 */

(function(global) {
  'use strict';

  const STORAGE_KEY = 'infinityplay_pseudoko_save_v1';

  const DEFAULT_STATE = {
    version: 1,
    campaign: {
      unlockedLevels: 1, // 1 to 100
      completedLevels: {}, // { [levelId]: { stars: 1..3, bestScore: number, date: string } }
      totalStars: 0
    },
    endless: {
      highScore: 0,
      highestWave: 1,
      totalRuns: 0
    },
    daily: {
      lastCompletedDate: null,
      currentStreak: 0,
      bestStreak: 0,
      history: {} // { [dateStr]: { score: number, timeSeconds: number, date: string } }
    },
    stats: {
      totalGamesPlayed: 0,
      totalWins: 0,
      totalDefeats: 0,
      totalScoreEarned: 0,
      totalCircuitsCompleted: 0,
      totalCoresCaptured: 0,
      highestCombo: 1,
      aiWins: { easy: 0, medium: 0, hard: 0, expert: 0, master: 0 }
    },
    achievements: {
      unlocked: [],
      progress: {}
    },
    settings: {
      masterVolume: 0.8,
      bgmVolume: 0.45,
      sfxVolume: 0.8,
      bgmEnabled: true,
      sfxEnabled: true,
      theme: 'cyan', // 'cyan' | 'matrix' | 'synthwave' | 'gold'
      highQualityVFX: true
    }
  };

  class PseudokoStorage {
    constructor() {
      this.data = this.load();
    }

    load() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return JSON.parse(JSON.stringify(DEFAULT_STATE));
        const parsed = JSON.parse(raw);
        // Deep merge with default state to ensure backward compatibility
        return {
          ...DEFAULT_STATE,
          ...parsed,
          campaign: { ...DEFAULT_STATE.campaign, ...(parsed.campaign || {}) },
          endless: { ...DEFAULT_STATE.endless, ...(parsed.endless || {}) },
          daily: { ...DEFAULT_STATE.daily, ...(parsed.daily || {}) },
          stats: { ...DEFAULT_STATE.stats, ...(parsed.stats || {}) },
          achievements: { ...DEFAULT_STATE.achievements, ...(parsed.achievements || {}) },
          settings: { ...DEFAULT_STATE.settings, ...(parsed.settings || {}) }
        };
      } catch (e) {
        console.warn('LocalStorage error or unavailable, falling back to in-memory state:', e);
        return JSON.parse(JSON.stringify(DEFAULT_STATE));
      }
    }

    save() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
      } catch (e) {
        console.warn('Unable to persist PSEUDOKO state to LocalStorage:', e);
      }
    }

    // Campaign Progression
    isLevelUnlocked(levelId) {
      const num = parseInt(levelId, 10);
      return num <= this.data.campaign.unlockedLevels;
    }

    getLevelData(levelId) {
      return this.data.campaign.completedLevels[levelId] || null;
    }

    completeLevel(levelId, starsEarned, score) {
      const num = parseInt(levelId, 10);
      const existing = this.data.campaign.completedLevels[num] || { stars: 0, bestScore: 0 };

      const newStars = Math.max(existing.stars, Math.min(3, starsEarned));
      const newBestScore = Math.max(existing.bestScore, score);

      this.data.campaign.completedLevels[num] = {
        stars: newStars,
        bestScore: newBestScore,
        date: new Date().toISOString()
      };

      // Unlock next level up to 100
      if (num === this.data.campaign.unlockedLevels && num < 100) {
        this.data.campaign.unlockedLevels = num + 1;
      }

      // Recalculate total stars
      let totalStars = 0;
      for (const k of Object.keys(this.data.campaign.completedLevels)) {
        totalStars += this.data.campaign.completedLevels[k].stars || 0;
      }
      this.data.campaign.totalStars = totalStars;

      this.data.stats.totalWins++;
      this.data.stats.totalScoreEarned += score;

      this.save();

      return {
        levelId: num,
        stars: newStars,
        bestScore: newBestScore,
        isNewUnlock: num + 1 === this.data.campaign.unlockedLevels,
        totalStars: totalStars
      };
    }

    // Endless Mode
    recordEndlessRun(wave, score) {
      this.data.endless.totalRuns++;
      if (score > this.data.endless.highScore) {
        this.data.endless.highScore = score;
      }
      if (wave > this.data.endless.highestWave) {
        this.data.endless.highestWave = wave;
      }
      this.data.stats.totalScoreEarned += score;
      this.save();
    }

    // Daily Challenge
    isDailyCompletedToday(dateStr) {
      return !!this.data.daily.history[dateStr];
    }

    recordDailyChallenge(dateStr, score, timeSeconds) {
      if (this.data.daily.history[dateStr]) {
        // Already recorded today, update best score only
        if (score > this.data.daily.history[dateStr].score) {
          this.data.daily.history[dateStr].score = score;
          this.save();
        }
        return false; // Not a first-time bonus
      }

      // Calculate streak
      const prevDate = new Date();
      prevDate.setDate(prevDate.getDate() - 1);
      const prevStr = prevDate.toISOString().split('T')[0];

      if (this.data.daily.lastCompletedDate === prevStr) {
        this.data.daily.currentStreak++;
      } else {
        this.data.daily.currentStreak = 1;
      }

      if (this.data.daily.currentStreak > this.data.daily.bestStreak) {
        this.data.daily.bestStreak = this.data.daily.currentStreak;
      }

      this.data.daily.lastCompletedDate = dateStr;
      this.data.daily.history[dateStr] = {
        score,
        timeSeconds,
        date: new Date().toISOString()
      };

      this.data.stats.totalWins++;
      this.data.stats.totalScoreEarned += score;
      this.save();

      return true; // First-time completion today
    }

    // AI Duels
    recordAIDuelWin(diff) {
      const d = diff.toLowerCase();
      if (this.data.stats.aiWins[d] !== undefined) {
        this.data.stats.aiWins[d]++;
      }
      this.data.stats.totalWins++;
      this.save();
    }

    // Achievements
    isAchievementUnlocked(achId) {
      return this.data.achievements.unlocked.includes(achId);
    }

    unlockAchievement(achId) {
      if (this.isAchievementUnlocked(achId)) return false;
      this.data.achievements.unlocked.push(achId);
      this.save();
      return true;
    }

    // Settings
    getSettings() {
      return this.data.settings;
    }

    updateSettings(newSettings) {
      this.data.settings = { ...this.data.settings, ...newSettings };
      this.save();
    }

    // Reset Progress
    resetAll() {
      this.data = JSON.parse(JSON.stringify(DEFAULT_STATE));
      this.save();
    }
  }

  global.Pseudoko = global.Pseudoko || {};
  global.Pseudoko.Storage = new PseudokoStorage();

})(typeof window !== 'undefined' ? window : global);

