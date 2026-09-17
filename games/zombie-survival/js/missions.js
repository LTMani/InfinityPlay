/**
 * Zombie Survival - Missions and Achievements Tracker
 * 15 Persistent trackable missions and 12 tiered achievements with claimable rewards.
 */

const MISSIONS_LIST = [
  {
    id: 'survive_60',
    title: 'Hold the Line',
    desc: 'Survive at least 60 seconds in any game mode.',
    target: 60,
    unit: 'sec',
    reward: { coins: 150, xp: 200 }
  },
  {
    id: 'kill_50',
    title: 'Zombie Sweeper',
    desc: 'Eliminate 50 infected mutants in total.',
    target: 50,
    unit: 'kills',
    reward: { coins: 200, xp: 300 }
  },
  {
    id: 'kill_200',
    title: 'Horde Cleanser',
    desc: 'Eliminate 200 infected mutants across all matches.',
    target: 200,
    unit: 'kills',
    reward: { coins: 500, xp: 600 }
  },
  {
    id: 'combo_10',
    title: 'Rhythm of Fire',
    desc: 'Achieve a x10 combo multiplier in combat.',
    target: 10,
    unit: 'combo',
    reward: { coins: 300, xp: 400 }
  },
  {
    id: 'combo_20',
    title: 'Combo Legend',
    desc: 'Reach a devastating x20 kill streak combo.',
    target: 20,
    unit: 'combo',
    reward: { coins: 800, xp: 900 }
  },
  {
    id: 'no_damage',
    title: 'Untouchable',
    desc: 'Complete any campaign level without taking damage.',
    target: 1,
    unit: 'level',
    reward: { coins: 400, xp: 500 }
  },
  {
    id: 'collect_100_coins',
    title: 'Scavenger',
    desc: 'Collect 100 supply coins during gameplay.',
    target: 100,
    unit: 'coins',
    reward: { coins: 250, xp: 300 }
  },
  {
    id: 'defeat_elite',
    title: 'Apex Hunter',
    desc: 'Eliminate a high-threat Elite Commander zombie.',
    target: 1,
    unit: 'elite',
    reward: { coins: 350, xp: 450 }
  },
  {
    id: 'defeat_boss',
    title: 'Titan Breaker',
    desc: 'Defeat any Sector Boss in campaign or challenge.',
    target: 1,
    unit: 'boss',
    reward: { coins: 800, xp: 1000 }
  },
  {
    id: 'reach_level_10',
    title: 'Veteran Scout',
    desc: 'Clear campaign Sector 10 in Outbreak.',
    target: 10,
    unit: 'level',
    reward: { coins: 600, xp: 700 }
  },
  {
    id: 'reach_level_30',
    title: 'City Liberator',
    desc: 'Advance through 30 campaign sectors.',
    target: 30,
    unit: 'level',
    reward: { coins: 1200, xp: 1500 }
  },
  {
    id: 'reach_level_60',
    title: 'Championship Survivor',
    desc: 'Conquer the Level 60 Championship final confrontation.',
    target: 60,
    unit: 'level',
    reward: { coins: 3000, xp: 4000 }
  },
  {
    id: 'endless_wave_10',
    title: 'Infinity Vanguard',
    desc: 'Survive to Wave 10 in Endless Infinity Survival.',
    target: 10,
    unit: 'wave',
    reward: { coins: 1000, xp: 1200 }
  },
  {
    id: 'upgrade_weapon',
    title: 'Gunsmith',
    desc: 'Upgrade any weapon attribute in the Arsenal.',
    target: 1,
    unit: 'upgrade',
    reward: { coins: 300, xp: 400 }
  },
  {
    id: 'use_abilities_20',
    title: 'Cybernetic Mastery',
    desc: 'Trigger special abilities 20 times in battle.',
    target: 20,
    unit: 'uses',
    reward: { coins: 300, xp: 350 }
  }
];

const ACHIEVEMENTS_LIST = [
  { id: 'first_survivor',   title: 'First Survivor',   desc: 'Complete your first campaign level.', icon: '🌟' },
  { id: 'zombie_hunter',    title: 'Zombie Hunter',    desc: 'Eliminate 100 total zombies.',        icon: '🎯' },
  { id: 'hunter_elite',     title: 'Hunter Elite',     desc: 'Eliminate 500 total zombies.',        icon: '💀' },
  { id: 'survivor_10',      title: 'Survivor',         desc: 'Clear 10 campaign levels.',           icon: '🛡️' },
  { id: 'veteran_30',       title: 'Veteran',          desc: 'Clear 30 campaign levels.',           icon: '🎖️' },
  { id: 'master_survivor',  title: 'Master Survivor',  desc: 'Conquer all 60 campaign levels.',     icon: '👑' },
  { id: 'combo_king',       title: 'Combo King',       desc: 'Achieve a x10 combo multiplier.',     icon: '⚡' },
  { id: 'combo_legend',     title: 'Combo Legend',     desc: 'Achieve a x20 combo multiplier.',     icon: '🔥' },
  { id: 'perfect_mission',  title: 'Perfect Mission',  desc: 'Complete any level without damage.',  icon: '💎' },
  { id: 'boss_slayer',      title: 'Boss Slayer',      desc: 'Defeat your first Sector Boss.',      icon: '⚔️' },
  { id: 'final_survivor',   title: 'Final Survivor',   desc: 'Defeat the Level 60 Championship.',   icon: '🏆' },
  { id: 'infinity_survivor',title: 'Infinity Survivor',desc: 'Reach Wave 15 in Endless mode.',     icon: '♾️' }
];

class MissionManager {
  constructor() {
    this.initMissions();
  }

  initMissions() {
    const saved = window.Storage.data.missions || {};
    for (let m of MISSIONS_LIST) {
      if (!saved[m.id]) {
        saved[m.id] = { progress: 0, completed: false, claimed: false };
      }
    }
    window.Storage.data.missions = saved;
    window.Storage.save();
  }

  updateProgress(missionId, amount, isIncremental = true) {
    const saved = window.Storage.data.missions[missionId];
    const def = MISSIONS_LIST.find(m => m.id === missionId);
    if (!saved || !def || saved.completed) return;

    if (isIncremental) {
      saved.progress += amount;
    } else {
      saved.progress = Math.max(saved.progress, amount);
    }

    if (saved.progress >= def.target) {
      saved.progress = def.target;
      saved.completed = true;
      if (window.gameInstance && window.gameInstance.ui) {
        window.gameInstance.ui.showToast(`Mission Completed: ${def.title}!`, 'success');
      }
    }
    window.Storage.save();
  }

  claimReward(missionId) {
    const saved = window.Storage.data.missions[missionId];
    const def = MISSIONS_LIST.find(m => m.id === missionId);
    if (!saved || !def || !saved.completed || saved.claimed) return false;

    saved.claimed = true;
    window.Storage.addCoins(def.reward.coins);
    window.Storage.addXP(def.reward.xp);
    window.Sound.playUpgrade();
    window.Storage.save();
    return true;
  }

  unlockAchievement(achId) {
    const achs = window.Storage.data.achievements || {};
    if (!achs[achId]) {
      const def = ACHIEVEMENTS_LIST.find(a => a.id === achId);
      if (def) {
        achs[achId] = { unlocked: true, date: new Date().toISOString() };
        window.Storage.data.achievements = achs;
        window.Storage.save();
        window.Sound.playLevelComplete();
        if (window.gameInstance && window.gameInstance.ui) {
          window.gameInstance.ui.showToast(`Achievement Unlocked: ${def.title}!`, 'achievement');
        }
      }
    }
  }

  checkSessionAchievements(player, levelConfig, finalStats) {
    const stats = window.Storage.data.stats;
    const completed = window.Storage.data.completedLevels;
    const completedCount = Object.keys(completed).length;

    if (completedCount >= 1) this.unlockAchievement('first_survivor');
    if (completedCount >= 10) this.unlockAchievement('survivor_10');
    if (completedCount >= 30) this.unlockAchievement('veteran_30');
    if (completedCount >= 60) this.unlockAchievement('master_survivor');

    if (stats.totalKills >= 100) this.unlockAchievement('zombie_hunter');
    if (stats.totalKills >= 500) this.unlockAchievement('hunter_elite');

    if (finalStats.maxCombo >= 10) this.unlockAchievement('combo_king');
    if (finalStats.maxCombo >= 20) this.unlockAchievement('combo_legend');

    if (finalStats.damageTaken === 0 && finalStats.victory) {
      this.unlockAchievement('perfect_mission');
      this.updateProgress('no_damage', 1, false);
    }

    if (levelConfig && levelConfig.isBossLevel && finalStats.victory) {
      this.unlockAchievement('boss_slayer');
      this.updateProgress('defeat_boss', 1, true);
    }

    if (levelConfig && levelConfig.id === 60 && finalStats.victory) {
      this.unlockAchievement('final_survivor');
      this.updateProgress('reach_level_60', 60, false);
    }

    if (window.Storage.data.endlessStats.highestWave >= 15) {
      this.unlockAchievement('infinity_survivor');
    }
  }
}

window.MISSIONS_LIST = MISSIONS_LIST;
window.ACHIEVEMENTS_LIST = ACHIEVEMENTS_LIST;
window.Missions = new MissionManager();

