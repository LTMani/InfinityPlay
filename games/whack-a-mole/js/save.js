/**
 * Whack-a-Mole: Arcade Edition - Save & Progression Manager
 * Handles local storage persistence under 'infinityplay_whack_a_mole',
 * star non-regression, replay bests, XP, coins, and 15 achievements.
 */

(function(window) {
  'use strict';

  const STORAGE_KEY = 'infinityplay_whack_a_mole';

  const ACHIEVEMENTS_DEF = [
    { id: 'first_hit', title: 'First Blood', desc: 'Whack your first mole', icon: '🔨' },
    { id: 'hits_10', title: 'Tenacious Mallet', desc: 'Whack 10 moles total', icon: '🐾' },
    { id: 'hits_100', title: 'Mole Buster', desc: 'Whack 100 moles total', icon: '💥' },
    { id: 'hits_500', title: 'Centurion Striker', desc: 'Whack 500 moles total', icon: '🎖️' },
    { id: 'hits_1000', title: 'Arcade Legend', desc: 'Whack 1,000 moles total', icon: '👑' },
    { id: 'combo_starter', title: 'Combo Starter', desc: 'Reach a 3x combo multiplier', icon: '⚡' },
    { id: 'combo_master', title: 'Combo Master', desc: 'Reach a 10x combo multiplier', icon: '🔥' },
    { id: 'combo_legend', title: 'Combo Legend', desc: 'Reach a 20x combo multiplier', icon: '🌪️' },
    { id: 'golden_hunter', title: 'Gilded Hands', desc: 'Whack 10 Golden Moles', icon: '🪙' },
    { id: 'speed_demon', title: 'Lightning Mallet', desc: 'Whack a mole in under 0.35s', icon: '⏱️' },
    { id: 'perfect_level', title: 'Flawless Lawn', desc: 'Complete any level with 100% accuracy', icon: '🎯' },
    { id: 'levels_10', title: 'Backyard Conquered', desc: 'Complete World 1 (Level 10)', icon: '🌱' },
    { id: 'levels_50', title: 'Halfway Champion', desc: 'Complete World 5 (Level 50)', icon: '⭐' },
    { id: 'levels_100', title: 'MOLE CHAMPION', desc: 'Conquer the Level 100 Championship!', icon: '🏆' },
    { id: 'infinity_master', title: 'Limitless Singularity', desc: 'Survive Wave 10 in Infinity Mode', icon: '♾️' }
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
      infinityModeUnlocked: false,
      timeAttackHighScore: 0,
      survivalHighScore: 0,
      endlessHighScore: 0,
      achievements: {},
      stats: {
        totalHits: 0,
        totalMisses: 0,
        highestCombo: 0,
        fastestReactionMs: 9999,
        goldenMolesHit: 0,
        speedMolesHit: 0,
        bombsHit: 0
      }
    };
  }

  class SaveManager {
    constructor() {
      this.state = this.load();
    }

    getStorage() {
      if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
      if (typeof localStorage !== 'undefined') return localStorage;
      return null;
    }

    load() {
      try {
        const storage = this.getStorage();
        if (storage) {
          const raw = storage.getItem(STORAGE_KEY);
          if (raw) {
            const parsed = JSON.parse(raw);
            return Object.assign(getDefaultState(), parsed);
          }
        }
      } catch (e) {
        console.warn('Could not read localStorage for whack-a-mole:', e);
      }
      return getDefaultState();
    }

    save() {
      try {
        const storage = this.getStorage();
        if (storage) {
          storage.setItem(STORAGE_KEY, JSON.stringify(this.state));
        }
      } catch (e) {
        console.warn('Could not save to localStorage:', e);
      }
    }

    completeLevel(levelId, score, stars, accuracy, reactionTimes = []) {
      if (!this.state.completedLevels.includes(levelId)) {
        this.state.completedLevels.push(levelId);
      }

      // Star non-regression
      const prevStars = this.state.levelStars[levelId] || 0;
      if (stars > prevStars) {
        this.state.levelStars[levelId] = stars;
      }

      // High score non-regression
      const prevScore = this.state.levelHighScores[levelId] || 0;
      if (score > prevScore) {
        this.state.levelHighScores[levelId] = score;
      }

      // Unlock next level
      if (levelId >= this.state.unlockedLevel) {
        this.state.unlockedLevel = Math.max(this.state.unlockedLevel, levelId + 1);
      }

      // Level 100 unlocks Infinity Mode
      if (levelId >= 100) {
        this.state.infinityModeUnlocked = true;
        this.unlockAchievement('levels_100');
      }

      // Rewards
      const earnedXP = Math.round(score * 0.1) + (stars * 75);
      const earnedCoins = stars * 25;
      this.state.totalXP += earnedXP;
      this.state.coins += earnedCoins;

      // Accuracy achievement check
      if (accuracy >= 100) {
        this.unlockAchievement('perfect_level');
      }

      // Level milestone achievements
      if (levelId >= 10) this.unlockAchievement('levels_10');
      if (levelId >= 50) this.unlockAchievement('levels_50');

      this.save();
      return {
        isNewBestScore: score > prevScore,
        isNewBestStars: stars > prevStars,
        earnedXP,
        earnedCoins
      };
    }

    recordHit(moleType, reactionTimeMs) {
      this.state.stats.totalHits++;
      this.unlockAchievement('first_hit');

      if (this.state.stats.totalHits >= 10) this.unlockAchievement('hits_10');
      if (this.state.stats.totalHits >= 100) this.unlockAchievement('hits_100');
      if (this.state.stats.totalHits >= 500) this.unlockAchievement('hits_500');
      if (this.state.stats.totalHits >= 1000) this.unlockAchievement('hits_1000');

      if (moleType === 'golden') {
        this.state.stats.goldenMolesHit++;
        if (this.state.stats.goldenMolesHit >= 10) this.unlockAchievement('golden_hunter');
      } else if (moleType === 'speed') {
        this.state.stats.speedMolesHit++;
      } else if (moleType === 'bomb') {
        this.state.stats.bombsHit++;
      }

      if (reactionTimeMs > 0 && reactionTimeMs < this.state.stats.fastestReactionMs) {
        this.state.stats.fastestReactionMs = Math.round(reactionTimeMs);
      }
      if (reactionTimeMs > 0 && reactionTimeMs <= 350) {
        this.unlockAchievement('speed_demon');
      }

      this.save();
    }

    recordMiss() {
      this.state.stats.totalMisses++;
      this.save();
    }

    recordCombo(combo) {
      if (combo > this.state.stats.highestCombo) {
        this.state.stats.highestCombo = combo;
      }
      if (combo >= 3) this.unlockAchievement('combo_starter');
      if (combo >= 10) this.unlockAchievement('combo_master');
      if (combo >= 20) this.unlockAchievement('combo_legend');
      this.save();
    }

    saveModeScore(mode, score, wave = 0) {
      let isNew = false;
      if (mode === 'time_attack') {
        if (score > this.state.timeAttackHighScore) {
          this.state.timeAttackHighScore = score;
          isNew = true;
        }
      } else if (mode === 'survival') {
        if (score > this.state.survivalHighScore) {
          this.state.survivalHighScore = score;
          isNew = true;
        }
      } else if (mode === 'endless') {
        if (score > this.state.endlessHighScore) {
          this.state.endlessHighScore = score;
          isNew = true;
        }
        if (wave >= 10) this.unlockAchievement('infinity_master');
      }
      this.save();
      return isNew;
    }

    getTotalStars() {
      return Object.values(this.state.levelStars).reduce((sum, s) => sum + s, 0);
    }

    unlockAchievement(id) {
      if (!this.state.achievements[id]) {
        this.state.achievements[id] = Date.now();
        const def = ACHIEVEMENTS_DEF.find(a => a.id === id);
        if (def && typeof window !== 'undefined') {
          const ev = new CustomEvent('achievementUnlocked', { detail: def });
          window.dispatchEvent(ev);
        }
        this.save();
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
