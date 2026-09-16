/**
 * Snake & Ladders - Storage, Statistics & Achievements Manager
 * Handles localStorage persistence, save/resume, error handling, and achievements
 */

(function() {
  'use strict';

  const STORAGE_KEYS = {
    SAVE: 'infinityplay_snake_ladders_save',
    SETTINGS: 'infinityplay_snake_ladders_settings',
    STATS: 'infinityplay_snake_ladders_stats',
    ACHIEVEMENTS: 'infinityplay_snake_ladders_achievements'
  };

  const DEFAULT_SETTINGS = {
    sound: true,
    music: false,
    animations: true,
    extraTurnOn6: true,
    exactFinish: true,
    difficulty: 'medium', // 'easy', 'medium', 'hard'
    theme: 'classic'      // 'classic', 'neon', 'emerald'
  };

  const DEFAULT_STATS = {
    gamesPlayed: 0,
    gamesWon: 0,
    gamesLost: 0,
    currentStreak: 0,
    bestStreak: 0,
    totalDiceRolls: 0,
    snakesEncountered: 0,
    laddersClimbed: 0,
    sixesRolled: 0,
    highestPosition: 0
  };

  const ACHIEVEMENTS_DEF = [
    {
      id: 'first-roll',
      title: 'First Roll',
      desc: 'Roll the dice and make your first move.',
      icon: '🎲',
      unlocked: false,
      progress: 0,
      max: 1
    },
    {
      id: 'ladder-master',
      title: 'Ladder Master',
      desc: 'Climb 5 ladders across all matches.',
      icon: '🪜',
      unlocked: false,
      progress: 0,
      max: 5
    },
    {
      id: 'snake-survivor',
      title: 'Snake Survivor',
      desc: 'Encounter and survive 3 snake bites.',
      icon: '🐍',
      unlocked: false,
      progress: 0,
      max: 3
    },
    {
      id: 'first-victory',
      title: 'First Victory',
      desc: 'Reach cell 100 and win your first game.',
      icon: '🏆',
      unlocked: false,
      progress: 0,
      max: 1
    },
    {
      id: 'winning-streak',
      title: 'Winning Streak',
      desc: 'Win 3 games in a row.',
      icon: '🔥',
      unlocked: false,
      progress: 0,
      max: 3
    },
    {
      id: 'bullseye',
      title: 'Bullseye',
      desc: 'Land directly on cell 100 with a roll of 1.',
      icon: '🎯',
      unlocked: false,
      progress: 0,
      max: 1
    },
    {
      id: 'lucky-six',
      title: 'Lucky Six',
      desc: 'Roll a 6 a total of 10 times.',
      icon: '✨',
      unlocked: false,
      progress: 0,
      max: 10
    },
    {
      id: 'grand-champion',
      title: 'Grand Champion',
      desc: 'Win a 4-player competitive match.',
      icon: '👑',
      unlocked: false,
      progress: 0,
      max: 1
    }
  ];

  class StorageManager {
    constructor() {
      this.settings = this.loadSettings();
      this.stats = this.loadStats();
      this.achievements = this.loadAchievements();
    }

    /* ---------------- SETTINGS ---------------- */
    loadSettings() {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        if (!raw) return { ...DEFAULT_SETTINGS };
        return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
      } catch (e) {
        console.warn('[Snake & Ladders Storage] Corrupted settings, resetting to defaults.', e);
        return { ...DEFAULT_SETTINGS };
      }
    }

    saveSettings(newSettings) {
      try {
        this.settings = { ...this.settings, ...newSettings };
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(this.settings));
      } catch (e) {
        console.error('[Snake & Ladders Storage] Could not save settings:', e);
      }
    }

    getSettings() {
      return { ...this.settings };
    }

    /* ---------------- ACTIVE GAME SAVE / RESUME ---------------- */
    saveGame(gameState) {
      if (!gameState || gameState.isGameOver) {
        this.clearSave();
        return;
      }
      try {
        const snapshot = {
          players: gameState.players,
          currentTurnIndex: gameState.currentTurnIndex,
          mode: gameState.mode,
          settings: gameState.settings,
          turnCount: gameState.turnCount,
          lastDice: gameState.lastDice,
          savedAt: Date.now()
        };
        localStorage.setItem(STORAGE_KEYS.SAVE, JSON.stringify(snapshot));
      } catch (e) {
        console.warn('[Snake & Ladders Storage] Could not save game state:', e);
      }
    }

    loadGame() {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.SAVE);
        if (!raw) return null;
        const data = JSON.parse(raw);
        if (!data || !Array.isArray(data.players) || data.players.length < 2) {
          this.clearSave();
          return null;
        }
        return data;
      } catch (e) {
        console.warn('[Snake & Ladders Storage] Corrupted save file, removing.', e);
        this.clearSave();
        return null;
      }
    }

    hasSavedGame() {
      const save = this.loadGame();
      return !!save;
    }

    clearSave() {
      try {
        localStorage.removeItem(STORAGE_KEYS.SAVE);
      } catch (e) {}
    }

    /* ---------------- STATISTICS ---------------- */
    loadStats() {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.STATS);
        if (!raw) return { ...DEFAULT_STATS };
        return { ...DEFAULT_STATS, ...JSON.parse(raw) };
      } catch (e) {
        return { ...DEFAULT_STATS };
      }
    }

    saveStats() {
      try {
        localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(this.stats));
      } catch (e) {}
    }

    getStats() {
      return { ...this.stats };
    }

    recordRoll(diceValue) {
      this.stats.totalDiceRolls++;
      if (diceValue === 6) {
        this.stats.sixesRolled++;
        this.updateAchievementProgress('lucky-six', this.stats.sixesRolled);
      }
      this.updateAchievementProgress('first-roll', 1);
      this.saveStats();
    }

    recordLadder() {
      this.stats.laddersClimbed++;
      this.updateAchievementProgress('ladder-master', this.stats.laddersClimbed);
      this.saveStats();
    }

    recordSnake() {
      this.stats.snakesEncountered++;
      this.updateAchievementProgress('snake-survivor', this.stats.snakesEncountered);
      this.saveStats();
    }

    recordGameEnd(winner, totalPlayers, rolledOneToWin) {
      this.stats.gamesPlayed++;
      const isHumanWinner = winner && !winner.isAI;

      if (isHumanWinner) {
        this.stats.gamesWon++;
        this.stats.currentStreak++;
        if (this.stats.currentStreak > this.stats.bestStreak) {
          this.stats.bestStreak = this.stats.currentStreak;
        }
        this.updateAchievementProgress('first-victory', 1);
        this.updateAchievementProgress('winning-streak', this.stats.currentStreak);

        if (rolledOneToWin) {
          this.updateAchievementProgress('bullseye', 1);
        }

        if (totalPlayers === 4) {
          this.updateAchievementProgress('grand-champion', 1);
        }
      } else {
        this.stats.gamesLost++;
        this.stats.currentStreak = 0;
      }

      this.saveStats();
      this.clearSave();
    }

    /* ---------------- ACHIEVEMENTS ---------------- */
    loadAchievements() {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
        if (!raw) return JSON.parse(JSON.stringify(ACHIEVEMENTS_DEF));
        const saved = JSON.parse(raw);
        return ACHIEVEMENTS_DEF.map(def => {
          const match = saved.find(s => s.id === def.id);
          return match ? { ...def, ...match } : def;
        });
      } catch (e) {
        return JSON.parse(JSON.stringify(ACHIEVEMENTS_DEF));
      }
    }

    saveAchievements() {
      try {
        localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(this.achievements));
      } catch (e) {}
    }

    getAchievements() {
      return [...this.achievements];
    }

    updateAchievementProgress(id, progress) {
      const ach = this.achievements.find(a => a.id === id);
      if (!ach || ach.unlocked) return;

      ach.progress = Math.min(progress, ach.max);
      if (ach.progress >= ach.max) {
        ach.unlocked = true;
        ach.unlockedAt = new Date().toISOString();
        this.saveAchievements();

        // Dispatch achievement unlocked event
        if (window.SNUI && typeof window.SNUI.showAchievementToast === 'function') {
          window.SNUI.showAchievementToast(ach);
        }
      } else {
        this.saveAchievements();
      }
    }
  }

  window.SNStorage = new StorageManager();
})();
