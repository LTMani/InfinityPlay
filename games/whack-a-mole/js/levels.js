/**
 * Whack-a-Mole: Arcade Edition - Level Progression Architecture
 * 100 Playable Levels across 10 Worlds with calibrated difficulty,
 * strictly progressing from Very Easy to Extreme through actual gameplay mechanics.
 *
 * Levels 1–10: Very easy. Only normal moles, slow movement, large reaction window.
 * Levels 11–20: Easy. Faster normal moles.
 * Levels 21–30: Easy/Medium. Introduce Golden Mole and bonus scoring.
 * Levels 31–40: Medium. Introduce Speed Mole and shorter reaction windows.
 * Levels 41–50: Medium. Introduce multiple simultaneous moles.
 * Levels 51–60: Medium/Hard. Night environment, visual distractions, faster spawning.
 * Levels 61–70: Hard. Introduce Bomb Mole and dangerous targets.
 * Levels 71–80: Hard. Rapid spawning, 3 simultaneous moles, multiple special types.
 * Levels 81–90: Very Hard. Combine all major mechanics with strict accuracy requirements.
 * Levels 91–99: Extreme. Maximum speed, difficult patterns, multiple special moles, very short reaction windows.
 * Level 100: SPECIAL MOLE CHAMPIONSHIP (60s multi-phase finale).
 * After Level 100: INFINITY MODE unlocked!
 */

(function(window) {
  'use strict';

  const WORLDS = [
    {
      id: 1,
      name: 'Backyard Basics',
      difficulty: 'Very Easy',
      theme: '#22c55e',
      icon: '🌱',
      startLevel: 1,
      endLevel: 10,
      grid: { rows: 3, cols: 3 },
      description: 'Very easy. Only normal moles, slow movement, and generous reaction windows.'
    },
    {
      id: 2,
      name: 'Pace Acceleration',
      difficulty: 'Easy',
      theme: '#eab308',
      icon: '⚡',
      startLevel: 11,
      endLevel: 20,
      grid: { rows: 3, cols: 3 },
      description: 'Easy. Normal moles emerge with faster cadence, training sharper reaction reflexes.'
    },
    {
      id: 3,
      name: 'Golden Fortune',
      difficulty: 'Easy/Medium',
      theme: '#f59e0b',
      icon: '🪙',
      startLevel: 21,
      endLevel: 30,
      grid: { rows: 3, cols: 3 },
      description: 'Easy/Medium. Introduces the shimmering Golden Mole (+300 pts) and bonus scoring.'
    },
    {
      id: 4,
      name: 'Speed Velocity',
      difficulty: 'Medium',
      theme: '#06b6d4',
      icon: '🕶️',
      startLevel: 31,
      endLevel: 40,
      grid: { rows: 3, cols: 3 },
      description: 'Medium. Introduces the goggles-wearing Speed Mole with ultra-short reaction windows.'
    },
    {
      id: 5,
      name: 'Swarm Burrows',
      difficulty: 'Medium',
      theme: '#8b5cf6',
      icon: '🐾',
      startLevel: 41,
      endLevel: 50,
      grid: { rows: 3, cols: 3 },
      description: 'Medium. Multiple simultaneous moles pop up together. Prioritize high-value targets!'
    },
    {
      id: 6,
      name: 'Night Garden',
      difficulty: 'Medium/Hard',
      theme: '#6366f1',
      icon: '🌙',
      startLevel: 51,
      endLevel: 60,
      grid: { rows: 4, cols: 3 }, // 12 holes
      description: 'Medium/Hard. Night environment with reduced visibility, visual distractions, and fast spawning.'
    },
    {
      id: 7,
      name: 'Danger Zone',
      difficulty: 'Hard',
      theme: '#ef4444',
      icon: '💣',
      startLevel: 61,
      endLevel: 70,
      grid: { rows: 4, cols: 3 },
      description: 'Hard. Introduces Bomb Moles! Ticking explosives where wrong hits cost points and lives.'
    },
    {
      id: 8,
      name: 'Tri-Swarm Rush',
      difficulty: 'Hard',
      theme: '#ea580c',
      icon: '🛡️',
      startLevel: 71,
      endLevel: 80,
      grid: { rows: 4, cols: 3 },
      description: 'Hard. Rapid spawning with 3 simultaneous moles and armored/trick special types.'
    },
    {
      id: 9,
      name: 'Master Precision',
      difficulty: 'Very Hard',
      theme: '#d946ef',
      icon: '🏆',
      startLevel: 81,
      endLevel: 90,
      grid: { rows: 4, cols: 4 }, // 16 holes
      description: 'Very Hard. Combines all major mechanics on a 16-hole grid with strict accuracy thresholds.'
    },
    {
      id: 10,
      name: 'Supreme Apex',
      difficulty: 'Extreme',
      theme: '#f43f5e',
      icon: '👑',
      startLevel: 91,
      endLevel: 100,
      grid: { rows: 5, cols: 4 }, // 20 holes
      description: 'Extreme speed, difficult patterns, and the monumental 60-second Championship at Level 100.'
    }
  ];

  const WORLD_TITLES = {
    1: ['Gentle Meadow', 'First Burrow', 'Sunny Patch', 'Morning Whack', 'Green Lawn', 'Lazy Diggers', 'Garden Border', 'Patience Trail', 'Backyard Calm', 'Level 10: Backyard Sentry'],
    2: ['Brisk Lawn', 'Quicker Paws', 'Spring Reflex', 'Swift Dig', 'Pace Builder', 'Rapid Return', 'Tempo Shift', 'Speedy Turf', 'Furious Dirt', 'Level 20: Pace Crucible'],
    3: ['Gilded Burrow', 'Golden Glimmer', 'Crown Sighting', 'Lucky Strike', 'Gold Vein', 'Treasure Turf', 'Gilded Rush', 'Royal Dirt', 'Golden Cascade', 'Level 30: Golden Bonanza'],
    4: ['Goggles Flashing', 'Blink Strike', 'Sonic Mole', 'Flash Burrow', 'Aviator Blitz', 'Lightning Snout', 'Velocity Tunnel', 'Supersonic Mound', 'Tachyon Paws', 'Level 40: Velocity Sprint'],
    5: ['Twin Burrows', 'Double Emergence', 'Dual Threat', 'Pair Pursuit', 'Simultaneous Dig', 'Crossfire Mounds', 'Double Trouble', 'Two-Way Strike', 'Swarm Rhythm', 'Level 50: Swarm Overlord'],
    6: ['Twilight Turf', 'Firefly Shadows', 'Lantern Arc', 'Moonlit Burrow', 'Midnight Eyes', 'Nocturnal Whispers', 'Glow & Shadow', 'Dark Soil Rush', 'Witching Mounds', 'Level 60: Midnight Trial'],
    7: ['Fuse Ignition', 'Explosive Warning', 'Hazard Lawn', 'Detonation Ridge', 'Careful Mallet', 'Ticking Trap', 'Minefield Burrow', 'Hair-Trigger Soil', 'Bomb Squad', 'Level 70: Hazard Crucible'],
    8: ['Triple Emergence', 'Iron Helmets', 'Trickster Ambush', 'Double Strike Required', 'Armored Trio', 'Rapid Chaos', 'Shell Shock Lawn', 'Multi-Type Swarm', 'Heavy Metal Frenzy', 'Level 80: Tri-Swarm Apex'],
    9: ['Sixteen Chambers', 'Matrix Mayhem', 'Strict Precision', 'Flawless Mallet', 'Sub-Second Gauntlet', 'High-Density Dirt', 'Surgical Accuracy', 'Master Discipline', 'Apex Reflex', 'Level 90: Master Digger'],
    10: ['Colosseum Mounds', 'Twenty Chambers', 'Hyper-Speed Grid', 'Supreme Reflex', 'Grandmaster Fury', 'Ultimate Cadence', 'Final Approach', 'Crown Contender', 'Penultimate Whack', 'LEVEL 100: MOLE CHAMPIONSHIP']
  };

  const LEVELS = [];

  for (let levelNum = 1; levelNum <= 100; levelNum++) {
    const worldIndex = Math.floor((levelNum - 1) / 10);
    const world = WORLDS[worldIndex];
    const levelInWorld = ((levelNum - 1) % 10) + 1;
    const isChallenge = (levelInWorld === 10);
    const isLevel100 = (levelNum === 100);

    let duration = 30;
    let spawnInterval = 1400;
    let visibleDuration = 2000;
    let maxActiveMoles = 1;
    let allowedTypes = ['normal'];
    let grid = { ...world.grid };
    let requiredAccuracy = 50;
    let scoreMultiplier = 1.0 + (levelNum * 0.02);
    let isNightMode = false;

    const title = WORLD_TITLES[world.id][levelInWorld - 1] || `Level ${levelNum}`;
    let description = '';

    // Specialized gameplay mechanics progression
    switch (world.id) {
      case 1: // Levels 1–10: Very easy. Only normal moles, slow movement, large reaction window.
        duration = 30;
        spawnInterval = Math.max(1200, 1600 - (levelInWorld * 40));
        visibleDuration = Math.max(1700, 2200 - (levelInWorld * 50));
        maxActiveMoles = 1;
        allowedTypes = ['normal'];
        requiredAccuracy = 50;
        description = isChallenge
          ? 'World 1 Finale: Whack emerging normal moles with relaxed reaction windows.'
          : `Very Easy: Only normal moles. Large reaction window of ${(visibleDuration / 1000).toFixed(1)}s.`;
        break;

      case 2: // Levels 11–20: Easy. Faster normal moles.
        duration = 30;
        spawnInterval = Math.max(950, 1250 - (levelInWorld * 30));
        visibleDuration = Math.max(1250, 1650 - (levelInWorld * 40));
        maxActiveMoles = 1;
        allowedTypes = ['normal'];
        requiredAccuracy = 55;
        description = isChallenge
          ? 'World 2 Finale: Faster normal moles test your speed cadence.'
          : `Easy: Faster normal moles. Visible window drops to ${(visibleDuration / 1000).toFixed(2)}s.`;
        break;

      case 3: // Levels 21–30: Easy/Medium. Introduce Golden Mole and bonus scoring.
        duration = 35;
        spawnInterval = Math.max(800, 1100 - (levelInWorld * 30));
        visibleDuration = Math.max(1050, 1350 - (levelInWorld * 30));
        maxActiveMoles = 1;
        allowedTypes = ['normal', 'golden'];
        requiredAccuracy = 60;
        scoreMultiplier = 1.25 + (levelInWorld * 0.03);
        description = isChallenge
          ? 'Golden Challenge: Golden moles appear in high frequency! Seize bonus points!'
          : 'Easy/Medium: Golden Moles (+300 pts) introduced! High score reward for swift strikes.';
        break;

      case 4: // Levels 31–40: Medium. Introduce Speed Mole and shorter reaction windows.
        duration = 35;
        spawnInterval = Math.max(700, 950 - (levelInWorld * 25));
        visibleDuration = Math.max(850, 1100 - (levelInWorld * 25));
        maxActiveMoles = 1;
        allowedTypes = ['normal', 'golden', 'speed'];
        requiredAccuracy = 60;
        description = isChallenge
          ? 'Speed Challenge: Speed moles dart with ultra-short sub-second windows!'
          : 'Medium: Speed Moles wear aviator goggles and retreat rapidly. Strike decisively!';
        break;

      case 5: // Levels 41–50: Medium. Introduce multiple simultaneous moles.
        duration = 35;
        spawnInterval = Math.max(680, 900 - (levelInWorld * 22));
        visibleDuration = Math.max(900, 1150 - (levelInWorld * 25));
        maxActiveMoles = 2; // MULTIPLE SIMULTANEOUS MOLES
        allowedTypes = ['normal', 'golden', 'speed'];
        requiredAccuracy = 62;
        description = isChallenge
          ? 'Swarm Challenge: Dual simultaneous moles appear on the 3x3 board!'
          : 'Medium: 2 moles now emerge simultaneously! Prioritize Golden and Speed targets.';
        break;

      case 6: // Levels 51–60: Medium/Hard. Night environment, visual distractions, faster spawning.
        duration = 40;
        spawnInterval = Math.max(550, 780 - (levelInWorld * 22));
        visibleDuration = Math.max(720, 920 - (levelInWorld * 20));
        maxActiveMoles = 2;
        allowedTypes = ['normal', 'golden', 'speed', 'bonus'];
        requiredAccuracy = 65;
        isNightMode = true; // NIGHT ENVIRONMENT
        description = isChallenge
          ? 'Night Challenge: Darkened landscape with reduced ambient lighting and rapid spawns!'
          : 'Medium/Hard: Night Garden! Spot shining eyes and crowns in the darkness.';
        break;

      case 7: // Levels 61–70: Hard. Introduce Bomb Mole and dangerous targets.
        duration = 40;
        spawnInterval = Math.max(500, 720 - (levelInWorld * 22));
        visibleDuration = Math.max(680, 860 - (levelInWorld * 18));
        maxActiveMoles = 2;
        allowedTypes = ['normal', 'golden', 'speed', 'bomb']; // BOMB MOLE INTRODUCED
        requiredAccuracy = 70;
        description = isChallenge
          ? 'Hazard Challenge: Bomb moles with ticking fuses emerge alongside normal targets!'
          : 'Hard: DANGER! Bomb Moles introduced! Hitting a bomb costs -300 pts and 1 life.';
        break;

      case 8: // Levels 71–80: Hard. Rapid spawning, 3 simultaneous moles, multiple special types.
        duration = 45;
        spawnInterval = Math.max(420, 620 - (levelInWorld * 20));
        visibleDuration = Math.max(600, 760 - (levelInWorld * 16));
        maxActiveMoles = 3; // 3 SIMULTANEOUS MOLES
        allowedTypes = ['normal', 'golden', 'speed', 'armored', 'trick', 'bonus', 'bomb'];
        requiredAccuracy = 72;
        description = isChallenge
          ? 'Tri-Swarm Challenge: 3 moles simultaneous with Armored (2 hits) and Trick moles!'
          : 'Hard: 3 simultaneous moles! Armored moles need 2 hits; Trick moles feint emergence.';
        break;

      case 9: // Levels 81–90: Very Hard. Combine all major mechanics with strict accuracy requirements.
        duration = 45;
        spawnInterval = Math.max(360, 520 - (levelInWorld * 16));
        visibleDuration = Math.max(520, 680 - (levelInWorld * 16));
        maxActiveMoles = 3;
        grid = { rows: 4, cols: 4 }; // 16 HOLES
        allowedTypes = ['normal', 'golden', 'speed', 'armored', 'trick', 'bonus', 'bomb'];
        requiredAccuracy = 75; // STRICT ACCURACY
        description = isChallenge
          ? 'Master Challenge: 16-hole matrix under severe sub-second tempo and 75% accuracy!'
          : 'Very Hard: Expanded 4x4 matrix. All 7 mole species active with strict accuracy.';
        break;

      case 10: // Levels 91–99: Extreme. Maximum speed, difficult patterns, multiple special moles, very short reaction windows.
        duration = isLevel100 ? 60 : 45;
        spawnInterval = isLevel100 ? 380 : Math.max(300, 420 - (levelInWorld * 12));
        visibleDuration = isLevel100 ? 550 : Math.max(420, 560 - (levelInWorld * 14));
        maxActiveMoles = 4;
        grid = { rows: 5, cols: 4 }; // 20 HOLES
        allowedTypes = ['normal', 'golden', 'speed', 'armored', 'trick', 'bonus', 'bomb'];
        requiredAccuracy = isLevel100 ? 75 : 75;
        scoreMultiplier = isLevel100 ? 3.5 : (2.6 + (levelInWorld * 0.08));
        description = isLevel100
          ? 'SPECIAL MOLE CHAMPIONSHIP: The 60-second grand final across 20 holes! Progresses through 4 escalating phases: Speed Calibration, Hazard Grid, Chaos Swarm, and Singularity Overdrive. Conquering this unlocks INFINITY MODE!'
          : `Extreme: Maximum speed across 20 holes. Short visible window of ${(visibleDuration / 1000).toFixed(2)}s!`;
        break;
    }

    const estimatedMoles = Math.floor((duration * 1000) / spawnInterval);
    const targetHits = Math.round(estimatedMoles * 0.65);
    const oneStarScore = Math.round(targetHits * 100 * scoreMultiplier);
    const twoStarScore = Math.round(oneStarScore * 1.5);
    const threeStarScore = Math.round(oneStarScore * 2.2);

    const xpReward = Math.round(100 + (levelNum * 12) + (isChallenge ? 300 : 0) + (isLevel100 ? 1000 : 0));
    const coinReward = Math.round(20 + (levelNum * 3) + (isChallenge ? 75 : 0) + (isLevel100 ? 500 : 0));

    LEVELS.push({
      id: levelNum,
      worldId: world.id,
      worldName: world.name,
      difficultyLabel: world.difficulty,
      worldTheme: world.theme,
      worldIcon: world.icon,
      levelInWorld: levelInWorld,
      title: title,
      description: description,
      grid: grid,
      duration: duration,
      spawnInterval: spawnInterval,
      visibleDuration: visibleDuration,
      maxActiveMoles: maxActiveMoles,
      allowedTypes: allowedTypes,
      targetHits: targetHits,
      scoreMultiplier: Math.round(scoreMultiplier * 100) / 100,
      requiredAccuracy: requiredAccuracy,
      isChallenge: isChallenge,
      isLevel100: isLevel100,
      isNightMode: isNightMode,
      starRequirements: {
        oneStar: oneStarScore,
        twoStars: twoStarScore,
        threeStars: threeStarScore
      },
      xpReward: xpReward,
      coinReward: coinReward,
      unlockRequirement: levelNum === 1 ? 0 : levelNum - 1
    });
  }

  const LevelSystem = {
    worlds: WORLDS,
    levels: LEVELS,

    getLevel(id) {
      if (id > 100) {
        return this.generateInfinityLevel(id);
      }
      return LEVELS.find(l => l.id === id) || LEVELS[0];
    },

    /**
     * Procedural Infinity Level generator for level 101+
     */
    generateInfinityLevel(id) {
      const allTypes = ['normal', 'golden', 'speed', 'armored', 'bonus', 'trick', 'bomb'];
      const wave = id - 100;
      const duration = 60;
      const spawnInterval = Math.max(280, 380 - (wave * 2));
      const visibleDuration = Math.max(400, 520 - (wave * 3));
      const mult = 3.5 + (wave * 0.05);
      const estMoles = Math.floor((duration * 1000) / spawnInterval);
      const targetHits = Math.round(estMoles * 0.7);
      const oneStar = Math.round(targetHits * 130 * mult);

      return {
        id: id,
        worldId: 10,
        worldName: 'Infinity Championship',
        difficultyLabel: 'Infinity',
        worldTheme: '#f43f5e',
        worldIcon: '♾️',
        levelInWorld: wave,
        title: `Infinity Wave ${wave}`,
        description: 'Endless arcade singularity. How many waves can you survive?',
        grid: { rows: 5, cols: 4 },
        duration: duration,
        spawnInterval: spawnInterval,
        visibleDuration: visibleDuration,
        maxActiveMoles: 4,
        allowedTypes: allTypes,
        targetHits: targetHits,
        scoreMultiplier: Math.round(mult * 100) / 100,
        requiredAccuracy: 75,
        isChallenge: (id % 10 === 0),
        isLevel100: false,
        isNightMode: (id % 3 === 0),
        starRequirements: {
          oneStar: oneStar,
          twoStars: Math.round(oneStar * 1.5),
          threeStars: Math.round(oneStar * 2.2)
        },
        xpReward: 1000 + (wave * 25),
        coinReward: 300 + (wave * 12),
        unlockRequirement: id - 1
      };
    },

    getLevelsForWorld(worldId) {
      return LEVELS.filter(l => l.worldId === worldId);
    },

    getWorld(worldId) {
      return WORLDS.find(w => w.id === worldId) || WORLDS[0];
    }
  };

  window.LevelSystem = LevelSystem;
})(typeof window !== 'undefined' ? window : this);
