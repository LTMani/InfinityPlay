/**
 * InfinityPlay Ultimate Racing - Racing Achievements Dataset
 */

(function() {
  const RACING_ACHIEVEMENTS = [
    {
      id: 'first-race',
      title: 'First Race',
      description: 'Cross the finish line and complete your first official race session.',
      icon: '🏁',
      credits: 250,
      xp: 150
    },
    {
      id: 'first-win',
      title: 'First Win',
      description: 'Take 1st place on the podium in any Quick Race or Championship round.',
      icon: '🥇',
      credits: 500,
      xp: 300
    },
    {
      id: 'speed-demon',
      title: 'Speed Demon',
      description: 'Break 280 KM/H with active nitro boost on a straightaway.',
      icon: '⚡',
      credits: 400,
      xp: 250
    },
    {
      id: 'drift-master',
      title: 'Drift Master',
      description: 'Accumulate over 2,500 continuous drift points in a single drift chain.',
      icon: '🔥',
      credits: 600,
      xp: 350
    },
    {
      id: 'perfect-lap',
      title: 'Perfect Lap',
      description: 'Complete a full lap without a single barrier collision or off-track spin.',
      icon: '✨',
      credits: 500,
      xp: 300
    },
    {
      id: '10-races',
      title: '10 Races',
      description: 'Complete 10 total races across any tracks or game modes.',
      icon: '🏎',
      credits: 750,
      xp: 450
    },
    {
      id: '25-races',
      title: '25 Races',
      description: 'Become a seasoned veteran by completing 25 race sessions.',
      icon: '🎖',
      credits: 1500,
      xp: 800
    },
    {
      id: '100-km',
      title: '100 KM',
      description: 'Clock over 100 kilometers total driven distance on the odometer.',
      icon: '🛣',
      credits: 1000,
      xp: 500
    },
    {
      id: '1000-km',
      title: '1000 KM',
      description: 'Reach legendary endurance status with over 1,000 kilometers driven.',
      icon: '👑',
      credits: 5000,
      xp: 2500
    },
    {
      id: 'champion',
      title: 'Champion',
      description: 'Win 1st place overall in the 3-track Ultimate Racing Grand Championship.',
      icon: '🏆',
      credits: 3000,
      xp: 1500
    },
    {
      id: 'personal-best',
      title: 'Personal Best',
      description: 'Set a new all-time fastest lap record on any circuit.',
      icon: '⏱',
      credits: 400,
      xp: 250
    },
    {
      id: 'nitro-master',
      title: 'Nitro Master',
      description: 'Burn 5 full tanks of nitro boost in a single race match.',
      icon: '🚀',
      credits: 500,
      xp: 300
    }
  ];

  window.UR = window.UR || {};
  window.UR.ACHIEVEMENTS = RACING_ACHIEVEMENTS;
})();

