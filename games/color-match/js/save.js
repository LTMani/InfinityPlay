/**
 * Color Match: Spectrum Arena - Save & Progression Manager
 * Handles local storage persistence under 'infinityplay_color_match',
 * star non-regression, replay bests, XP, coins, and 12 achievements.
 */

(function(window) {
  'use strict';

  const STORAGE_KEY = 'infinityplay_color_match';

  const ACHIEVEMENTS_DEF = [
    { id: 'first_step', title: 'First Frequency', desc: 'Complete Level 1', icon: '◈' },
    { id: 'world_1', title: 'Spectrum Initiate', desc: 'Conquer World 1 (Level 10)', icon: '▲' },
    { id: 'speed_demon', title: 'Speed Demon', desc: 'Answer a challenge in under 0.45s', icon: '⚡' },
    { id: 'combo_10', title: 'Flawless Flow', desc: 'Reach a 10x combo multiplier', icon: '🔥' },
    { id: 'world_5', title: 'Anomaly Hunter', desc: 'Conquer World 5 (Level 50)', icon: '◆' },
    { id: 'world_8', title: 'Sub-Second Veteran', desc: 'Conquer World 8 (Level 80)', icon: '❖' },
    { id: 'grandmaster', title: 'Spectrum Singularity', desc: 'Conquer Level 100 Milestone', icon: '✦' },
    { id: 'stars_50', title: 'Starlight Novice', desc: 'Earn 50 Total Stars', icon: '★' },
    { id: 'stars_150', title: 'Spectrum Vanguard', desc: 'Earn 150 Total Stars', icon: '★' },
    { id: 'stars_300', title: 'Constellation Master', desc: 'Earn 300 Stars (All 3 Stars!)', icon: '👑' },
    { id: 'time_attack_2k', title: 'Chronos Victor', desc: 'Score 2,500+ in Time Attack', icon: '⏳' },
    { id: 'survival_25', title: 'Indomitable Prism', desc: 'Reach 25 streak in Survival Mode', icon: '🛡️' }
  ];

  function getDefaultState() {
    return {
      unlockedLevel: 1,
      completedLevels: [],
      levelStars: {},
      levelHighScores: {},
      levelBestTimes: {},
      totalXP: 0,
      coins: 0,
      colorBlindMode: false,
      soundMuted: false,
      endlessHighScore: 0,
      survivalHighScore: 0,
      timeAttackHighScore: 0,
      dailyCompleted: {},
      achievements: {},
      stats: {
        totalAnswers: 0,
        totalCorrect: 0,
        totalWrong: 0,
        highestCombo: 0,
        fastestReactionMs: 9999
      }
    };
  }

  class SaveManager {
    constructor() {
      this.state = this.load();
    }

    load() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return Object.assign(getDefaultState(), parsed);
        }
      } catch (e) {
        console.warn('Could not read localStorage for color match:', e);
      }
      return getDefaultState();
    }

    save() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Could not save to localStorage:', e);
      }
    }

    /**
     * Record level completion with star non-regression
     */
    completeLevel(levelId, score, stars, timeSeconds) {
      if (!this.state.completedLevels.includes(levelId)) {
        this.state.completedLevels.push(levelId);
      }

      // Star non-regression: keep best stars
      const prevStars = this.state.levelStars[levelId] || 0;
      if (stars > prevStars) {
        this.state.levelStars[levelId] = stars;
      }

      // High score non-regression
      const prevScore = this.state.levelHighScores[levelId] || 0;
      if (score > prevScore) {
        this.state.levelHighScores[levelId] = score;
      }

      // Best time non-regression (lower is better)
      const prevTime = this.state.levelBestTimes[levelId] || 9999;
      if (timeSeconds < prevTime) {
        this.state.levelBestTimes[levelId] = timeSeconds;
      }

      // Unlock next level
      if (levelId >= this.state.unlockedLevel) {
        this.state.unlockedLevel = Math.max(this.state.unlockedLevel, levelId + 1);
      }

      // Rewards
      const earnedXP = Math.round(score * 0.1) + (stars * 50);
      const earnedCoins = stars * 15;
      this.state.totalXP += earnedXP;
      this.state.coins += earnedCoins;

      // Check achievements
      this.checkAchievementsAfterLevel(levelId);

      this.save();
      return {
        isNewBestScore: score > prevScore,
        isNewBestStars: stars > prevStars,
        earnedXP,
        earnedCoins
      };
    }

    saveModeScore(mode, score) {
      let isNewRecord = false;
      if (mode === 'endless') {
        if (score > this.state.endlessHighScore) {
          this.state.endlessHighScore = score;
          isNewRecord = true;
        }
      } else if (mode === 'survival') {
        if (score > this.state.survivalHighScore) {
          this.state.survivalHighScore = score;
          isNewRecord = true;
        }
        if (score >= 25) this.unlockAchievement('survival_25');
      } else if (mode === 'time_attack') {
        if (score > this.state.timeAttackHighScore) {
          this.state.timeAttackHighScore = score;
          isNewRecord = true;
        }
        if (score >= 2500) this.unlockAchievement('time_attack_2k');
      }
      this.save();
      return isNewRecord;
    }

    saveDaily(dateKey, score, stars) {
      this.state.dailyCompleted[dateKey] = {
        score,
        stars,
        timestamp: Date.now()
      };
      this.save();
    }

    recordReaction(reactionTimeMs, isCorrect) {
      this.state.stats.totalAnswers++;
      if (isCorrect) {
        this.state.stats.totalCorrect++;
        if (reactionTimeMs < this.state.stats.fastestReactionMs) {
          this.state.stats.fastestReactionMs = Math.round(reactionTimeMs);
        }
        if (reactionTimeMs <= 450) {
          this.unlockAchievement('speed_demon');
        }
      } else {
        this.state.stats.totalWrong++;
      }
      this.save();
    }

    recordCombo(combo) {
      if (combo > this.state.stats.highestCombo) {
        this.state.stats.highestCombo = combo;
      }
      if (combo >= 10) {
        this.unlockAchievement('combo_10');
      }
      this.save();
    }

    getTotalStars() {
      return Object.values(this.state.levelStars).reduce((sum, s) => sum + s, 0);
    }

    checkAchievementsAfterLevel(levelId) {
      if (levelId >= 1) this.unlockAchievement('first_step');
      if (levelId >= 10) this.unlockAchievement('world_1');
      if (levelId >= 50) this.unlockAchievement('world_5');
      if (levelId >= 80) this.unlockAchievement('world_8');
      if (levelId >= 100) this.unlockAchievement('grandmaster');

      const totalStars = this.getTotalStars();
      if (totalStars >= 50) this.unlockAchievement('stars_50');
      if (totalStars >= 150) this.unlockAchievement('stars_150');
      if (totalStars >= 300) this.unlockAchievement('stars_300');
    }

    unlockAchievement(id) {
      if (!this.state.achievements[id]) {
        this.state.achievements[id] = Date.now();
        const def = ACHIEVEMENTS_DEF.find(a => a.id === id);
        if (def && typeof window !== 'undefined') {
          // Dispatch custom event for UI toast
          const event = new CustomEvent('achievementUnlocked', { detail: def });
          window.dispatchEvent(event);
        }
      }
    }

    getAchievements() {
      return ACHIEVEMENTS_DEF.map(def => ({
        ...def,
        unlocked: !!this.state.achievements[def.id],
        unlockedAt: this.state.achievements[def.id] || null
      }));
    }

    resetAll() {
      this.state = getDefaultState();
      this.save();
    }
  }

  window.SaveManager = new SaveManager();
})(typeof window !== 'undefined' ? window : this);

