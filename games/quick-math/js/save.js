/**
 * Quick Math: Infinity Challenge - Save Manager
 * Safe localStorage persistence for 100-Level progression, World unlocking,
 * Star ratings (1-3 permanent), XP, Credits, High Scores, Achievements & Leaderboards.
 */

(function() {
  'use strict';

  const STORAGE_KEY = 'infinityplay_quick_math';

  const ACHIEVEMENTS_DEF = [
    { id: 'FIRST_SOLVE', name: 'First Solve', description: 'Solve your first question correctly.', icon: '⚡' },
    { id: 'SPEED_DEMON', name: 'Speed Demon', description: 'Answer correctly in under 1.0 second.', icon: '⏱️' },
    { id: 'STREAK_MASTER', name: 'Streak Master', description: 'Achieve a 10-question correct streak.', icon: '🔥' },
    { id: 'CALCULATOR', name: 'Human Calculator', description: 'Solve 100 total questions across any mode.', icon: '🧠' },
    { id: 'PERFECT_ROUND', name: 'Flawless Precision', description: 'Complete a level or round with 100% accuracy.', icon: '🎯' },
    { id: 'WORLD_5_CLEAR', name: 'Halfway Hero', description: 'Conquer World 5 (Level 50).', icon: '🛡️' },
    { id: 'SPEED_ARENA_SURVIVOR', name: 'Supersonic Mind', description: 'Survive the Speed Arena milestone (Level 70).', icon: '🚀' },
    { id: 'LOGIC_MASTER', name: 'Master of Deduction', description: 'Conquer the World 8 Logic Exam (Level 80).', icon: '🔮' },
    { id: 'TIME_LORD', name: 'Time Lord', description: 'Score over 3,000 points in a 60s Time Attack round.', icon: '⏳' },
    { id: 'INFINITY_CHAMPION', name: 'Infinity Champion', description: 'Triumph over Level 100 and unlock Infinity Mode.', icon: '👑' }
  ];

  function getDefaultData() {
    return {
      version: 2,
      unlockedLevel: 1,
      unlockedLevels: 1, // Legacy compatibility
      completedLevels: [],
      highestWorld: 1,
      levelStars: {}, // { '1': 3, '2': 2 }
      levelHighScores: {}, // { '1': 2400 }
      levelBestTimes: {}, // { '1': 1.8 }
      levelBestAccuracy: {}, // { '1': 100 }
      xp: 0,
      credits: 0,
      infinityModeUnlocked: false,
      modeHighScores: {
        classic: 0,
        time_attack: 0,
        survival: 0,
        endless: 0,
        daily: 0,
        infinity: 0
      },
      dailyCompletedDate: null,
      stats: {
        totalQuestions: 0,
        totalCorrect: 0,
        totalWrong: 0,
        totalTimeouts: 0,
        highestStreak: 0,
        gamesPlayed: 0
      },
      achievements: {}, // { 'FIRST_SOLVE': 1726480000000 }
      leaderboard: [
        { rank: 1, player: 'Alex Gamer', score: 9850, accuracy: 98, mode: 'Championship', date: '2026-09-14' },
        { rank: 2, player: 'ShadowX', score: 8200, accuracy: 95, mode: 'World 9 L88', date: '2026-09-14' },
        { rank: 3, player: 'MaxPlay', score: 6890, accuracy: 92, mode: 'World 7 L65', date: '2026-09-15' },
        { rank: 4, player: 'NeoKing', score: 5450, accuracy: 90, mode: 'Time Attack', date: '2026-09-15' },
        { rank: 5, player: 'GameBeast', score: 4100, accuracy: 88, mode: 'World 5 L50', date: '2026-09-16' }
      ],
      settings: {
        sound: true,
        music: true,
        motion: true,
        confirmRestart: true,
        playerName: 'Player'
      }
    };
  }

  const SaveManager = {
    _data: null,

    init() {
      this._data = this.load();
    },

    load() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return getDefaultData();
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object') return getDefaultData();

        const defaults = getDefaultData();
        const unlockedLvl = Math.max(1, parsed.unlockedLevel || parsed.unlockedLevels || 1);

        return {
          ...defaults,
          ...parsed,
          version: 2,
          unlockedLevel: unlockedLvl,
          unlockedLevels: unlockedLvl,
          completedLevels: Array.isArray(parsed.completedLevels) ? parsed.completedLevels : [],
          highestWorld: Math.min(10, Math.max(1, parsed.highestWorld || Math.ceil(unlockedLvl / 10))),
          xp: typeof parsed.xp === 'number' ? parsed.xp : 0,
          credits: typeof parsed.credits === 'number' ? parsed.credits : 0,
          infinityModeUnlocked: Boolean(parsed.infinityModeUnlocked || unlockedLvl > 100),
          stats: { ...defaults.stats, ...(parsed.stats || {}) },
          modeHighScores: { ...defaults.modeHighScores, ...(parsed.modeHighScores || {}) },
          settings: { ...defaults.settings, ...(parsed.settings || {}) },
          achievements: parsed.achievements || {},
          levelStars: parsed.levelStars || {},
          levelHighScores: parsed.levelHighScores || {},
          levelBestTimes: parsed.levelBestTimes || {},
          levelBestAccuracy: parsed.levelBestAccuracy || {},
          leaderboard: Array.isArray(parsed.leaderboard) ? parsed.leaderboard : defaults.leaderboard
        };
      } catch (err) {
        console.warn('[QuickMath Save] LocalStorage parse error, using defaults:', err);
        return getDefaultData();
      }
    },

    save() {
      try {
        if (!this._data) this._data = getDefaultData();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this._data));
      } catch (err) {
        console.warn('[QuickMath Save] Unable to persist to localStorage:', err);
      }
    },

    getData() {
      if (!this._data) this.init();
      return this._data;
    },

    getSettings() {
      return this.getData().settings;
    },

    updateSettings(newSettings) {
      const data = this.getData();
      data.settings = { ...data.settings, ...newSettings };
      this.save();
    },

    isLevelUnlocked(lvl) {
      const id = parseInt(lvl, 10);
      if (id <= 1) return true;
      return id <= this.getData().unlockedLevel;
    },

    isWorldUnlocked(worldId) {
      const wId = parseInt(worldId, 10);
      if (wId <= 1) return true;
      // World W is unlocked when Level (W-1)*10 is completed (i.e. unlockedLevel >= (W-1)*10 + 1)
      const reqLevel = (wId - 1) * 10 + 1;
      return this.getData().unlockedLevel >= reqLevel;
    },

    getLevelStars(lvl) {
      return this.getData().levelStars[lvl] || 0;
    },

    getLevelHighScore(lvl) {
      return this.getData().levelHighScores[lvl] || 0;
    },

    getLevelBestTime(lvl) {
      return this.getData().levelBestTimes[lvl] || 0;
    },

    getLevelBestAccuracy(lvl) {
      return this.getData().levelBestAccuracy[lvl] || 0;
    },

    isLevelCompleted(lvl) {
      return this.getLevelStars(lvl) >= 1;
    },

    getWorldProgress(worldId) {
      const wId = parseInt(worldId, 10);
      const startLvl = (wId - 1) * 10 + 1;
      const endLvl = wId * 10;
      let completedCount = 0;
      let totalStars = 0;

      for (let i = startLvl; i <= endLvl; i++) {
        const s = this.getLevelStars(i);
        if (s >= 1) completedCount++;
        totalStars += s;
      }

      return {
        completedCount,
        totalCount: 10,
        totalStars,
        maxStars: 30,
        isUnlocked: this.isWorldUnlocked(wId)
      };
    },

    isInfinityModeUnlocked() {
      return Boolean(this.getData().infinityModeUnlocked);
    },

    getPlayerEconomy() {
      const data = this.getData();
      return {
        xp: data.xp,
        credits: data.credits
      };
    },

    /**
     * Saves result of a level attempt.
     * Guarantees non-regression: never overwrites personal bests with worse results.
     */
    saveLevelResult(lvl, score, stars, accuracy = 0, avgTime = 0, xpEarned = 0, creditsEarned = 0) {
      const data = this.getData();
      const levelId = parseInt(lvl, 10);

      // 1. Update permanent Stars (only if better)
      const currentStars = data.levelStars[levelId] || 0;
      const isFirstClear = currentStars === 0 && stars >= 1;
      if (stars > currentStars) {
        data.levelStars[levelId] = stars;
      }

      // 2. Update High Score (only if better)
      const currentScore = data.levelHighScores[levelId] || 0;
      if (score > currentScore) {
        data.levelHighScores[levelId] = score;
      }

      // 3. Update Best Accuracy (only if better)
      const currentAccuracy = data.levelBestAccuracy[levelId] || 0;
      if (accuracy > currentAccuracy) {
        data.levelBestAccuracy[levelId] = Math.round(accuracy);
      }

      // 4. Update Best Average Time (only if faster and non-zero)
      const currentTime = data.levelBestTimes[levelId] || 0;
      if (avgTime > 0 && (currentTime === 0 || avgTime < currentTime)) {
        data.levelBestTimes[levelId] = parseFloat(avgTime.toFixed(2));
      }

      // 5. Track Completed Levels
      if (stars >= 1 && !data.completedLevels.includes(levelId)) {
        data.completedLevels.push(levelId);
        data.completedLevels.sort((a, b) => a - b);
      }

      // 6. Award Economy Rewards (Full rewards on first clear, small replay bonus on replay)
      if (isFirstClear) {
        data.xp += xpEarned;
        data.credits += creditsEarned;
      } else if (stars >= 1) {
        data.xp += Math.round(xpEarned * 0.25);
        data.credits += Math.round(creditsEarned * 0.25);
      }

      // 7. Progressive Level Unlocking (Level N unlocks Level N+1)
      if (stars >= 1) {
        if (levelId + 1 > data.unlockedLevel) {
          data.unlockedLevel = levelId + 1;
          data.unlockedLevels = data.unlockedLevel; // Legacy sync
        }
      }

      // 8. World Unlocking
      data.highestWorld = Math.min(10, Math.ceil(data.unlockedLevel / 10));

      // 9. Level 100 / Infinity Mode Check
      if (levelId >= 100 && stars >= 1) {
        data.infinityModeUnlocked = true;
        this.unlockAchievement('INFINITY_CHAMPION');
      }

      // 10. Milestone Achievements Check
      if (accuracy === 100) {
        this.unlockAchievement('PERFECT_ROUND');
      }
      if (levelId >= 50 && stars >= 1) {
        this.unlockAchievement('WORLD_5_CLEAR');
      }
      if (levelId >= 70 && stars >= 1) {
        this.unlockAchievement('SPEED_ARENA_SURVIVOR');
      }
      if (levelId >= 80 && stars >= 1) {
        this.unlockAchievement('LOGIC_MASTER');
      }

      this.save();
    },

    saveModeHighScore(mode, score) {
      const data = this.getData();
      if (!data.modeHighScores[mode] || score > data.modeHighScores[mode]) {
        data.modeHighScores[mode] = score;
        this.save();
      }
    },

    addLeaderboardEntry(entry) {
      const data = this.getData();
      const newEntry = {
        player: entry.player || data.settings.playerName || 'Player',
        score: entry.score || 0,
        accuracy: Math.round(entry.accuracy || 0),
        mode: entry.mode || 'Classic',
        date: new Date().toISOString().split('T')[0]
      };

      data.leaderboard.push(newEntry);
      data.leaderboard.sort((a, b) => b.score - a.score);
      data.leaderboard = data.leaderboard.slice(0, 10);
      data.leaderboard.forEach((item, idx) => {
        item.rank = idx + 1;
      });

      this.save();
    },

    recordGameStats(stats) {
      const data = this.getData();
      data.stats.totalQuestions += (stats.total || 0);
      data.stats.totalCorrect += (stats.correct || 0);
      data.stats.totalWrong += (stats.wrong || 0);
      data.stats.totalTimeouts += (stats.timedOut || 0);
      data.stats.gamesPlayed += 1;

      if (stats.bestStreak && stats.bestStreak > data.stats.highestStreak) {
        data.stats.highestStreak = stats.bestStreak;
      }

      if (data.stats.totalCorrect >= 1) {
        this.unlockAchievement('FIRST_SOLVE');
      }
      if (data.stats.totalCorrect >= 100) {
        this.unlockAchievement('CALCULATOR');
      }
      if (stats.bestStreak >= 10) {
        this.unlockAchievement('STREAK_MASTER');
      }
      if (stats.mode === 'time_attack' && stats.score >= 3000) {
        this.unlockAchievement('TIME_LORD');
      }

      this.save();
    },

    unlockAchievement(id) {
      const data = this.getData();
      if (data.achievements[id]) return; // Already unlocked

      const def = ACHIEVEMENTS_DEF.find(a => a.id === id);
      if (!def) return;

      data.achievements[id] = Date.now();
      this.save();

      window.dispatchEvent(new CustomEvent('qm_achievement_unlocked', {
        detail: { ...def, timestamp: data.achievements[id] }
      }));
    },

    getAchievementsDef() {
      return ACHIEVEMENTS_DEF;
    },

    getUnlockedAchievements() {
      return this.getData().achievements;
    },

    resetAllData() {
      this._data = getDefaultData();
      this.save();
    }
  };

  window.QuickMath = window.QuickMath || {};
  window.QuickMath.SaveManager = SaveManager;
})();
