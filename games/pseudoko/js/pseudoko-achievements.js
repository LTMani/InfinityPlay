/**
 * PSEUDOKO — Achievements System
 * 16 In-Game Trophies with tracking, XP bonuses, and unlock notification toasts.
 */

(function(global) {
  'use strict';

  const ACHIEVEMENTS_LIST = [
    {
      id: 'first_victory',
      title: 'First Victory',
      icon: '🏆',
      description: 'Achieve your first victory in Campaign or Skirmish mode.',
      xp: 100
    },
    {
      id: 'puzzle_solver',
      title: 'Puzzle Solver',
      icon: '🧩',
      description: 'Successfully complete 10 campaign levels.',
      xp: 250
    },
    {
      id: 'strategic_mind',
      title: 'Strategic Mind',
      icon: '🧠',
      description: 'Achieve 75% or greater board territory dominance in any match.',
      xp: 300
    },
    {
      id: 'win_streak_10',
      title: '10 Win Streak',
      icon: '🔥',
      description: 'Maintain an unbroken streak of 10 victories across any mode.',
      xp: 500
    },
    {
      id: 'speed_solver',
      title: 'Speed Solver',
      icon: '⚡',
      description: 'Complete a level or daily challenge in under 60 seconds.',
      xp: 350
    },
    {
      id: 'logic_master',
      title: 'Logic Master',
      icon: '🌀',
      description: 'Synthesize 5 Harmonic Circuits in a single match.',
      xp: 400
    },
    {
      id: 'perfect_victory',
      title: 'Perfect Victory',
      icon: '⭐',
      description: 'Earn a 3-Star victory without triggering any frequency conflicts.',
      xp: 450
    },
    {
      id: 'strategy_legend',
      title: 'Strategy Legend',
      icon: '👑',
      description: 'Progress to Sector IV by conquering 50 campaign levels.',
      xp: 800
    },
    {
      id: 'core_overlord',
      title: 'Core Overlord',
      icon: '🔋',
      description: 'Capture and activate 30 total Power Cores across all games.',
      xp: 300
    },
    {
      id: 'combo_cascade',
      title: 'Combo Cascade',
      icon: '💥',
      description: 'Achieve a maximum 5x Resonance Combo multiplier.',
      xp: 350
    },
    {
      id: 'ai_slayer',
      title: 'Neural Nemesis',
      icon: '🤖',
      description: 'Defeat the Master Strategy AI in a tactical confrontation.',
      xp: 600
    },
    {
      id: 'endless_voyager',
      title: 'Endless Voyager',
      icon: '🌌',
      description: 'Survive and reach Wave 10 in Endless Mode.',
      xp: 500
    },
    {
      id: 'daily_devotee',
      title: 'Daily Devotee',
      icon: '📅',
      description: 'Complete 3 deterministic Daily Challenges.',
      xp: 400
    },
    {
      id: 'firewall_breaker',
      title: 'Zero-Day Exploit',
      icon: '🛡',
      description: 'Breach and bypass 20 encrypted firewall barriers.',
      xp: 300
    },
    {
      id: 'star_hoarder',
      title: 'Celestial Matrix',
      icon: '✨',
      description: 'Earn 100 or more campaign stars.',
      xp: 750
    },
    {
      id: 'grandmaster_tier',
      title: 'Singularity Overlord',
      icon: '🔱',
      description: 'Conquer all 100 campaign levels and master the PSEUDOKO grid.',
      xp: 2500
    }
  ];

  class AchievementsManager {
    constructor() {
      this.achievements = ACHIEVEMENTS_LIST;
    }

    getAll() {
      const storage = global.Pseudoko.Storage;
      return this.achievements.map(a => ({
        ...a,
        unlocked: storage.isAchievementUnlocked(a.id)
      }));
    }

    checkAndUnlock(achId, onUnlockToast = null) {
      const storage = global.Pseudoko.Storage;
      if (storage.isAchievementUnlocked(achId)) return false;

      const ach = this.achievements.find(a => a.id === achId);
      if (!ach) return false;

      const unlocked = storage.unlockAchievement(achId);
      if (unlocked) {
        if (typeof onUnlockToast === 'function') {
          onUnlockToast(ach);
        } else if (global.Pseudoko.UI && global.Pseudoko.UI.showAchievementToast) {
          global.Pseudoko.UI.showAchievementToast(ach);
        }
        if (global.Pseudoko.Audio) {
          global.Pseudoko.Audio.playCircuitCombo(3);
        }
      }
      return unlocked;
    }

    evaluateGameplayTriggers(gameState) {
      // Check first victory
      if (gameState.isVictory) {
        this.checkAndUnlock('first_victory');
      }

      // Check level completions
      const completedCount = Object.keys(global.Pseudoko.Storage.data.campaign.completedLevels).length;
      if (completedCount >= 10) this.checkAndUnlock('puzzle_solver');
      if (completedCount >= 50) this.checkAndUnlock('strategy_legend');
      if (completedCount >= 100) this.checkAndUnlock('grandmaster_tier');

      // Check stars
      if (global.Pseudoko.Storage.data.campaign.totalStars >= 100) {
        this.checkAndUnlock('star_hoarder');
      }

      // Check territory
      if (gameState.territoryPercent >= 75) {
        this.checkAndUnlock('strategic_mind');
      }

      // Check combo
      if (gameState.combo >= 5) {
        this.checkAndUnlock('combo_cascade');
      }

      // Check perfect victory
      if (gameState.isVictory && gameState.stars === 3 && gameState.perfectDeductions) {
        this.checkAndUnlock('perfect_victory');
      }

      // Check speed solver
      if (gameState.isVictory && gameState.timeSeconds && gameState.timeSeconds < 60) {
        this.checkAndUnlock('speed_solver');
      }

      // Check AI master duel win
      if (gameState.isVictory && gameState.mode === 'ai' && gameState.aiLevel === 'master') {
        this.checkAndUnlock('ai_slayer');
      }

      // Check Endless wave
      if (gameState.mode === 'endless' && gameState.wave >= 10) {
        this.checkAndUnlock('endless_voyager');
      }
    }
  }

  global.Pseudoko = global.Pseudoko || {};
  global.Pseudoko.Achievements = new AchievementsManager();

})(typeof window !== 'undefined' ? window : global);

