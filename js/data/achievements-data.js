/**
 * InfinityPlay - Achievements Data
 */

(function() {
  const achievements = [
    {
      id: 'first-blood',
      title: 'First Blood',
      category: 'General',
      description: 'Launch and play your very first game on the InfinityPlay platform.',
      icon: '🎮',
      xp: 100,
      unlocked: true,
      unlockedAt: '2026-08-15',
      progress: 1,
      maxProgress: 1,
      progressText: 'Completed'
    },
    {
      id: 'speed-demon',
      title: 'Speed Demon',
      category: 'Racing',
      description: 'Complete high-speed track sessions in Ultimate Racing.',
      icon: '🏎',
      xp: 250,
      unlocked: true,
      unlockedAt: '2026-08-20',
      progress: 5,
      maxProgress: 5,
      progressText: 'Completed'
    },
    {
      id: 'star-collector',
      title: 'Star Collector',
      category: 'Favorites',
      description: 'Bookmark at least 3 games to your personal library favorites.',
      icon: '⭐',
      xp: 200,
      unlocked: true,
      unlockedAt: '2026-08-28',
      progress: 3,
      maxProgress: 3,
      progressText: 'Completed'
    },
    {
      id: 'high-roller',
      title: 'High Roller',
      category: 'Progression',
      description: 'Surpass 25,000 total player experience points (XP).',
      icon: '💎',
      xp: 500,
      unlocked: true,
      unlockedAt: '2026-09-02',
      progress: 42800,
      maxProgress: 25000,
      progressText: '42.8K / 25K XP'
    },
    {
      id: 'category-master',
      title: 'Category Master',
      category: 'Explorer',
      description: 'Explore titles from at least 5 different gaming categories.',
      icon: '🧭',
      xp: 350,
      unlocked: true,
      unlockedAt: '2026-09-04',
      progress: 6,
      maxProgress: 5,
      progressText: '6 / 5 Categories'
    },
    {
      id: 'night-owl',
      title: 'Night Owl',
      category: 'General',
      description: 'Play a gaming match between midnight and 4:00 AM.',
      icon: '🦉',
      xp: 200,
      unlocked: true,
      unlockedAt: '2026-09-05',
      progress: 1,
      maxProgress: 1,
      progressText: 'Completed'
    },
    {
      id: 'social-star',
      title: 'Social Contender',
      category: 'Community',
      description: 'Check out the top players on the Global Leaderboard.',
      icon: '🏆',
      xp: 150,
      unlocked: true,
      unlockedAt: '2026-09-07',
      progress: 1,
      maxProgress: 1,
      progressText: 'Completed'
    },
    {
      id: 'daily-streak',
      title: 'Triple Threat Streak',
      category: 'Loyalty',
      description: 'Login to InfinityPlay for 3 consecutive days in a row.',
      icon: '🔥',
      xp: 300,
      unlocked: true,
      unlockedAt: '2026-09-08',
      progress: 3,
      maxProgress: 3,
      progressText: '3 / 3 Days'
    },
    {
      id: 'grandmaster',
      title: 'Grandmaster Ascent',
      category: 'Progression',
      description: 'Reach Level 30 and unlock the Master Champion avatar border.',
      icon: '👑',
      xp: 1000,
      unlocked: false,
      unlockedAt: null,
      progress: 28,
      maxProgress: 30,
      progressText: 'Level 28 / 30'
    },
    {
      id: 'perfectionist',
      title: 'Perfectionist',
      category: 'Skill',
      description: 'Attain a flawless 5-star rating in 5 consecutive challenges.',
      icon: '🎯',
      xp: 750,
      unlocked: false,
      unlockedAt: null,
      progress: 3,
      maxProgress: 5,
      progressText: '3 / 5 Challenges'
    },
    {
      id: 'champions-circle',
      title: "Champion's Podium",
      category: 'Rankings',
      description: 'Climb into the Top 3 positions of the Global Leaderboard.',
      icon: '🥇',
      xp: 1500,
      unlocked: false,
      unlockedAt: null,
      progress: 4,
      maxProgress: 3,
      progressText: 'Current Rank: #4'
    },
    {
      id: 'veteran-explorer',
      title: 'All-Terrain Legend',
      category: 'Library',
      description: 'Play all 14 arcade and simulation titles in InfinityPlay.',
      icon: '🚀',
      xp: 800,
      unlocked: false,
      unlockedAt: null,
      progress: 9,
      maxProgress: 14,
      progressText: '9 / 14 Games'
    }
  ];

  window.InfinityPlay = window.InfinityPlay || {};
  window.InfinityPlay.achievementsData = achievements;
})();
