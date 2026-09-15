/**
 * Tic-Tac-Toe: Ultimate Arena - Save System & Persistent Storage
 * Safe localStorage manager with validation, fallback, and achievement tracking
 */

(function() {
  'use strict';

  const STORAGE_KEY = 'infinityplay_tic_tac_toe';

  // 10 Progressive Campaign Levels
  const CAMPAIGN_LEVELS = [
    { id: 1, name: 'Training Ground', difficulty: 'easy', desc: 'Warm up against beginner tactical play.', parMoves: 5 },
    { id: 2, name: 'Rookie Arena', difficulty: 'easy', desc: 'Sharpen your instincts and basic alignments.', parMoves: 5 },
    { id: 3, name: 'Tactical Room', difficulty: 'medium', desc: 'Opponent defends lines and seizes opportunities.', parMoves: 5 },
    { id: 4, name: 'Strategist', difficulty: 'medium', desc: 'Sharp pressure with tactical counters.', parMoves: 5 },
    { id: 5, name: 'Elite Arena', difficulty: 'hard', desc: 'Minimax heuristic AI seeking forks.', parMoves: 5 },
    { id: 6, name: 'Battle Grid', difficulty: 'hard', desc: 'Relentless defense and offensive positioning.', parMoves: 5 },
    { id: 7, name: "Master's Table", difficulty: 'hard', desc: 'Near-perfect calculations punishing every mistake.', parMoves: 5 },
    { id: 8, name: 'Grandmaster Hall', difficulty: 'grandmaster', desc: 'Flawless game-theoretic Minimax AI.', parMoves: 5 },
    { id: 9, name: 'Championship', difficulty: 'grandmaster', desc: 'Unbeatable calculation with optimal fork defense.', parMoves: 5 },
    { id: 10, name: 'Infinity Arena', difficulty: 'grandmaster', desc: 'The pinnacle showdown. Can you hold the line?', parMoves: 5 }
  ];

  // Defined Achievements
  const ACHIEVEMENTS_DEF = [
    { id: 'first_blood', name: 'First Blood', desc: 'Win your first match.', icon: '⚔️' },
    { id: 'tactician', name: 'Tactician', desc: 'Win 5 matches.', icon: '🧠' },
    { id: 'unstoppable', name: 'Unstoppable', desc: 'Win 5 consecutive matches.', icon: '🔥' },
    { id: 'perfect', name: 'Perfect', desc: 'Win in 3 moves without opponent blocking.', icon: '💎' },
    { id: 'grandmaster', name: 'Grandmaster', desc: 'Beat Grandmaster AI.', icon: '👑' },
    { id: 'champion', name: 'Champion', desc: 'Complete all 10 levels.', icon: '🏆' },
    { id: 'infinity_player', name: 'Infinity Player', desc: 'Reach a 10-win streak.', icon: '♾️' }
  ];

  const DEFAULT_DATA = {
    version: 1,
    unlockedLevels: [1],
    completedLevels: {}, // levelId -> { stars, score, moves, date }
    stats: {
      wins: 0,
      losses: 0,
      draws: 0,
      winStreak: 0,
      maxStreak: 0,
      totalXP: 0,
      totalScore: 0
    },
    settings: {
      sound: true,
      music: true,
      animation: 'full', // 'full' or 'reduced'
      theme: 'dark',      // 'dark' or 'premium'
      confirmRestart: true
    },
    achievements: {} // id -> { unlocked: true, timestamp }
  };

  const SaveManager = {
    data: null,

    init() {
      this.load();
    },

    load() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object' && Array.isArray(parsed.unlockedLevels)) {
            // Merge with defaults to guarantee all schema fields exist
            this.data = {
              version: DEFAULT_DATA.version,
              unlockedLevels: Array.from(new Set(parsed.unlockedLevels.map(Number))).filter(n => n >= 1 && n <= 10),
              completedLevels: parsed.completedLevels && typeof parsed.completedLevels === 'object' ? parsed.completedLevels : {},
              stats: Object.assign({}, DEFAULT_DATA.stats, parsed.stats),
              settings: Object.assign({}, DEFAULT_DATA.settings, parsed.settings),
              achievements: parsed.achievements && typeof parsed.achievements === 'object' ? parsed.achievements : {}
            };
            if (!this.data.unlockedLevels.includes(1)) {
              this.data.unlockedLevels.push(1);
            }
            return this.data;
          }
        }
      } catch (err) {
        console.warn('[Tic-Tac-Toe] Corrupted save data detected. Resetting to defaults.', err);
      }

      this.data = JSON.parse(JSON.stringify(DEFAULT_DATA));
      this.save();
      return this.data;
    },

    save() {
      try {
        if (!this.data) return false;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
        return true;
      } catch (err) {
        console.error('[Tic-Tac-Toe] Failed to save game data:', err);
        return false;
      }
    },

    resetAll() {
      this.data = JSON.parse(JSON.stringify(DEFAULT_DATA));
      this.save();
      return this.data;
    },

    // Campaign levels
    getLevels() {
      return CAMPAIGN_LEVELS;
    },

    getLevel(levelId) {
      return CAMPAIGN_LEVELS.find(l => l.id === Number(levelId)) || null;
    },

    isLevelUnlocked(levelId) {
      const id = Number(levelId);
      return this.data.unlockedLevels.includes(id);
    },

    unlockNextLevel(currentLevelId) {
      const current = Number(currentLevelId);
      const next = current + 1;
      if (next <= CAMPAIGN_LEVELS.length && !this.data.unlockedLevels.includes(next)) {
        this.data.unlockedLevels.push(next);
        this.save();
        return true;
      }
      return false;
    },

    recordLevelCompletion(levelId, stars, score, moves) {
      const id = Number(levelId);
      const existing = this.data.completedLevels[id];
      const bestStars = existing ? Math.max(existing.stars, stars) : stars;
      const bestScore = existing ? Math.max(existing.score, score) : score;

      this.data.completedLevels[id] = {
        stars: bestStars,
        score: bestScore,
        moves: existing ? Math.min(existing.moves, moves) : moves,
        completedAt: Date.now()
      };

      const unlockedNext = this.unlockNextLevel(id);
      this.save();

      // Check champion achievement (all 10 completed)
      const completedCount = Object.keys(this.data.completedLevels).length;
      if (completedCount >= CAMPAIGN_LEVELS.length) {
        this.unlockAchievement('champion');
      }

      return { unlockedNext, bestStars };
    },

    // Stats & scoring
    recordMatch({ result, difficulty, moves, scoreGained, xpGained, playerSymbol }) {
      if (!this.data) this.init();

      if (result === 'win') {
        this.data.stats.wins += 1;
        this.data.stats.winStreak += 1;
        if (this.data.stats.winStreak > this.data.stats.maxStreak) {
          this.data.stats.maxStreak = this.data.stats.winStreak;
        }

        // Check Achievements
        this.unlockAchievement('first_blood');
        if (this.data.stats.wins >= 5) {
          this.unlockAchievement('tactician');
        }
        if (this.data.stats.winStreak >= 5) {
          this.unlockAchievement('unstoppable');
        }
        if (this.data.stats.winStreak >= 10) {
          this.unlockAchievement('infinity_player');
        }
        if (difficulty === 'grandmaster') {
          this.unlockAchievement('grandmaster');
        }
        if (moves <= 3) {
          this.unlockAchievement('perfect');
        }
      } else if (result === 'loss') {
        this.data.stats.losses += 1;
        this.data.stats.winStreak = 0;
      } else if (result === 'draw') {
        this.data.stats.draws += 1;
        // Streak remains, neither increments nor resets
      }

      this.data.stats.totalScore += (scoreGained || 0);
      this.data.stats.totalXP += (xpGained || 0);

      this.save();
      return this.data.stats;
    },

    // Achievements
    getAchievements() {
      return ACHIEVEMENTS_DEF.map(def => {
        const entry = this.data.achievements[def.id];
        return {
          ...def,
          unlocked: !!(entry && entry.unlocked),
          unlockedAt: entry ? entry.timestamp : null
        };
      });
    },

    unlockAchievement(id) {
      if (!this.data.achievements[id] || !this.data.achievements[id].unlocked) {
        const def = ACHIEVEMENTS_DEF.find(a => a.id === id);
        if (!def) return false;

        this.data.achievements[id] = {
          unlocked: true,
          timestamp: Date.now()
        };
        this.save();

        // Dispatch window event for UI notifications
        window.dispatchEvent(new CustomEvent('tictactoe:achievement', {
          detail: { achievement: def }
        }));
        return true;
      }
      return false;
    },

    // Settings
    getSettings() {
      return this.data.settings;
    },

    updateSettings(partialSettings) {
      this.data.settings = Object.assign({}, this.data.settings, partialSettings);
      this.save();
      window.dispatchEvent(new CustomEvent('tictactoe:settingsChanged', {
        detail: { settings: this.data.settings }
      }));
      return this.data.settings;
    }
  };

  SaveManager.init();

  window.TTTSave = SaveManager;
})();

