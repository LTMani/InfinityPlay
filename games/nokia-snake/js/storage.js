/**
 * Nokia Snake - Storage Manager
 * Handles local persistence of high scores, difficulty, audio settings, and gameplay statistics.
 */

(function() {
  'use strict';

  const STORAGE_KEYS = {
    HIGH_SCORE: 'nokia_snake_highscore',
    SETTINGS: 'nokia_snake_settings',
    STATS: 'nokia_snake_stats'
  };

  const DEFAULT_SETTINGS = {
    sound: true,
    difficulty: 'classic', // 'easy' | 'classic' | 'hard'
    scanlines: true,
    theme: 'green' // 'green' | 'amber' | 'mono'
  };

  const DEFAULT_STATS = {
    gamesPlayed: 0,
    gamesOver: 0,
    highestScore: 0,
    totalFoodCollected: 0,
    longestSnake: 3,
    bestScore: 0
  };

  class StorageManager {
    constructor() {
      this.highScore = this.loadHighScore();
      this.settings = this.loadSettings();
      this.stats = this.loadStats();
    }

    loadHighScore() {
      try {
        const val = localStorage.getItem(STORAGE_KEYS.HIGH_SCORE);
        const parsed = parseInt(val, 10);
        return isNaN(parsed) ? 0 : Math.max(0, parsed);
      } catch (e) {
        console.warn('[NokiaSnake] Could not access localStorage for high score:', e);
        return 0;
      }
    }

    saveHighScore(score) {
      if (typeof score !== 'number' || isNaN(score)) return false;
      if (score > this.highScore) {
        this.highScore = score;
        try {
          localStorage.setItem(STORAGE_KEYS.HIGH_SCORE, score.toString());
        } catch (e) {
          console.warn('[NokiaSnake] Failed to save high score:', e);
        }
        return true; // Indicates new high score
      }
      return false;
    }

    loadSettings() {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        if (!raw) return { ...DEFAULT_SETTINGS };
        const parsed = JSON.parse(raw);
        return {
          sound: typeof parsed.sound === 'boolean' ? parsed.sound : DEFAULT_SETTINGS.sound,
          difficulty: ['easy', 'classic', 'hard'].includes(parsed.difficulty) ? parsed.difficulty : DEFAULT_SETTINGS.difficulty,
          scanlines: typeof parsed.scanlines === 'boolean' ? parsed.scanlines : DEFAULT_SETTINGS.scanlines,
          theme: ['green', 'amber', 'mono'].includes(parsed.theme) ? parsed.theme : DEFAULT_SETTINGS.theme
        };
      } catch (e) {
        return { ...DEFAULT_SETTINGS };
      }
    }

    saveSettings(patch) {
      this.settings = { ...this.settings, ...patch };
      try {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(this.settings));
      } catch (e) {
        console.warn('[NokiaSnake] Failed to save settings:', e);
      }
      return this.settings;
    }

    loadStats() {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.STATS);
        if (!raw) return { ...DEFAULT_STATS };
        const parsed = JSON.parse(raw);
        return {
          gamesPlayed: Number(parsed.gamesPlayed) || 0,
          gamesOver: Number(parsed.gamesOver) || 0,
          highestScore: Number(parsed.highestScore) || this.highScore,
          totalFoodCollected: Number(parsed.totalFoodCollected) || 0,
          longestSnake: Math.max(3, Number(parsed.longestSnake) || 3),
          bestScore: Number(parsed.bestScore) || this.highScore
        };
      } catch (e) {
        return { ...DEFAULT_STATS };
      }
    }

    recordGameStart() {
      this.stats.gamesPlayed++;
      this.saveStats();
    }

    recordGameOver(score, snakeLength, foodCollected) {
      this.stats.gamesOver++;
      if (foodCollected) {
        this.stats.totalFoodCollected += foodCollected;
      }
      if (snakeLength > this.stats.longestSnake) {
        this.stats.longestSnake = snakeLength;
      }
      if (score > this.stats.highestScore) {
        this.stats.highestScore = score;
        this.stats.bestScore = score;
      }
      this.saveStats();
    }

    saveStats() {
      try {
        localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(this.stats));
      } catch (e) {
        console.warn('[NokiaSnake] Failed to save stats:', e);
      }
    }

    resetStats() {
      this.stats = { ...DEFAULT_STATS };
      this.highScore = 0;
      try {
        localStorage.removeItem(STORAGE_KEYS.STATS);
        localStorage.removeItem(STORAGE_KEYS.HIGH_SCORE);
      } catch (e) {}
    }
  }

  window.NokiaSnake = window.NokiaSnake || {};
  window.NokiaSnake.storage = new StorageManager();
})();
