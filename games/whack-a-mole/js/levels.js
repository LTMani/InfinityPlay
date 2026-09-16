/**
 * Whack-a-Mole: Arcade Edition - Level Progression Architecture
 * 100 Playable Levels across 10 Worlds with calibrated difficulty,
 * grid scaling (3x3 to 5x4), mole type unlocks, Level 100 Championship,
 * and procedural Infinity Mode scaling.
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
      description: 'Foundational arcade whacking. Slow normal moles on a standard 3x3 board.'
    },
    {
      id: 2,
      name: 'Mole Rush',
      difficulty: 'Easy',
      theme: '#eab308',
      icon: '⚡',
      startLevel: 11,
      endLevel: 20,
      grid: { rows: 3, cols: 3 },
      description: 'Accelerated spawning cadence. Introduces the elusive Golden Mole (+300 pts).'
    },
    {
      id: 3,
      name: 'Fast Diggers',
      difficulty: 'Easy/Medium',
      theme: '#06b6d4',
      icon: '🕶️',
      startLevel: 21,
      endLevel: 30,
      grid: { rows: 3, cols: 3 },
      description: 'Ultra-short visible windows. Introduces the goggles-wearing Speed Mole.'
    },
    {
      id: 4,
      name: 'Night Garden',
      difficulty: 'Medium',
      theme: '#6366f1',
      icon: '🌙',
      startLevel: 31,
      endLevel: 40,
      grid: { rows: 3, cols: 3 },
      description: 'Atmospheric nocturnal garden with lantern lighting. Focus through darkness!'
    },
    {
      id: 5,
      name: 'Golden Hunt',
      difficulty: 'Medium',
      theme: '#f59e0b',
      icon: '👑',
      startLevel: 41,
      endLevel: 50,
      grid: { rows: 3, cols: 3 },
      description: 'High reward zone! Bonus Gems and Golden Moles galore. Build massive combos!'
    },
    {
      id: 6,
      name: 'Chaos Farm',
      difficulty: 'Medium/Hard',
      theme: '#ea580c',
      icon: '🚜',
      startLevel: 51,
      endLevel: 60,
      grid: { rows: 4, cols: 3 }, // 12 holes
      description: 'The board expands to 4x3! Multiple simultaneous moles pop up together.'
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
      description: 'Introduces Bomb Moles! Whacking a bomb costs points and a precious life.'
    },
    {
      id: 8,
      name: 'Extreme Rush',
      difficulty: 'Hard',
      theme: '#ec4899',
      icon: '🛡️',
      startLevel: 71,
      endLevel: 80,
      grid: { rows: 4, cols: 3 },
      description: 'Introduces Armored Moles (requires 2 hits!) and deceptive Trick Moles.'
    },
    {
      id: 9,
      name: 'Master Digger',
      difficulty: 'Very Hard',
      theme: '#8b5cf6',
      icon: '🏆',
      startLevel: 81,
      endLevel: 90,
      grid: { rows: 4, cols: 4 }, // 16 holes
      description: 'Expanded 4x4 matrix with sub-second reaction windows and strict accuracy.'
    },
    {
      id: 10,
      name: 'Mole Championship',
      difficulty: 'Extreme',
      theme: '#f43f5e',
      icon: '⭐',
      startLevel: 91,
      endLevel: 100,
      grid: { rows: 5, cols: 4 }, // 20 holes
      description: 'The ultimate arcade battleground culminating in the 60s Level 100 Championship!'
    }
  ];

  const WORLD_TITLES = {
    1: ['Backyard Awakening', 'Lawn Patrol', 'Sunny Burrow', 'Green Acres', 'Garden Sentry', 'Turf Defender', 'Mole Ridge', 'Spring Awakening', 'Backyard Sprint', 'Level 10: Speed Challenge'],
    2: ['Rush Hour', 'Gilded Whispers', 'Rapid Burrows', 'Gold Prospector', 'Furious Claws', 'Golden Trail', 'Swift Turf', 'Sprint Cadence', 'Gold Fever', 'Level 20: Golden Mole Challenge'],
    3: ['Goggles On', 'Velociraptor Moles', 'Sonic Tunnel', 'Blink and Miss', 'Supersonic Dig', 'Aviator Ambush', 'Tachyon Dirt', 'Hyper Mole', 'Flash Burrow', 'Level 30: Rapid Mole Challenge'],
    4: ['Twilight Lawn', 'Firefly Shadows', 'Midnight Peepers', 'Lantern Glow', 'Moonlit Mounds', 'Dark Soil', 'Nocturnal Claws', 'Shadow Diggers', 'Witching Hour', 'Level 40: Night Challenge'],
    5: ['Treasure Burrow', 'Crown Jewels', 'Gilded Surge', 'Bonus Bonanza', 'Gem Rush', 'Royal Court', 'Golden Horizon', 'Diamond Dirt', 'Wealthy Moles', 'Level 50: Golden Hunt Final'],
    6: ['Barnyard Blitz', 'Twelve Mounds', 'Double Trouble', 'Triple Threat', 'Tractor Chaos', 'Swarm Season', 'Haystack Frenzy', 'Crowded Soil', 'Farm Frenzy', 'Level 60: Chaos Challenge'],
    7: ['Fuse Ignited', 'Explosive Lawn', 'Careful Strike', 'Hazard Warning', 'Detonation Ridge', 'Minefield Moles', 'Bomb Squad', 'Hair-Trigger Claws', 'Ticking Soil', 'Level 70: Danger Challenge'],
    8: ['Steel Helmets', 'Double Strike', 'Iron Claws', 'Trickster Feint', 'Armored Battalion', 'Deceptive Shadows', 'Ironclad Lawn', 'Shell Shock', 'Heavy Metal Dig', 'Level 80: Extreme Rush Final'],
    9: ['Sixteen Chambers', 'Matrix Mayhem', 'Surgical Mallet', 'Tachyon Grid', 'Master Reflex', 'Flawless Sentry', 'Grand Slam', 'High-Density Dirt', 'Apex Hunter', 'Level 90: Master Challenge'],
    10: ['Colosseum Mounds', 'Twenty Holes', 'Hall of Champions', 'Hyper-Speed Gauntlet', 'Grandmaster Fury', 'Crown Contender', 'Final Ascent', 'Supreme Arena', 'Penultimate Whack', 'LEVEL 100: MOLE CHAMPIONSHIP']
  };

  const LEVELS = [];

  for (let levelNum = 1; levelNum <= 100; levelNum++) {
    const worldIndex = Math.floor((levelNum - 1) / 10);
    const world = WORLDS[worldIndex];
    const levelInWorld = ((levelNum - 1) % 10) + 1;
    const isChallenge = (levelInWorld === 10);
    const isLevel100 = (levelNum === 100);

    let duration = 30;
    let spawnInterval = 1200;
    let visibleDuration = 1600;
    let maxActiveMoles = 1;
    let allowedTypes = ['normal'];
    let grid = { ...world.grid };
    let requiredAccuracy = 50;
    let scoreMultiplier = 1.0 + (levelNum * 0.02);

    const title = WORLD_TITLES[world.id][levelInWorld - 1] || `Level ${levelNum}`;
    let description = '';

    // Mechanics per world
    switch (world.id) {
      case 1: // Backyard Basics
        duration = 30;
        spawnInterval = Math.max(900, 1400 - (levelInWorld * 50));
        visibleDuration = Math.max(1300, 1900 - (levelInWorld * 60));
        maxActiveMoles = 1;
        allowedTypes = ['normal'];
        requiredAccuracy = 50;
        description = isChallenge
          ? 'Speed Challenge: Whack at least 20 normal moles before time expires!'
          : `Standard 3x3 board. Whack emerging normal moles within ${Math.round(visibleDuration / 100) / 10}s.`;
        break;

      case 2: // Mole Rush
        duration = 30;
        spawnInterval = Math.max(800, 1200 - (levelInWorld * 40));
        visibleDuration = Math.max(1100, 1600 - (levelInWorld * 50));
        maxActiveMoles = levelInWorld >= 6 ? 2 : 1;
        allowedTypes = ['normal', 'golden'];
        requiredAccuracy = 55;
        description = isChallenge
          ? 'Golden Challenge: Golden moles appear in abundance. Snag high-value targets!'
          : 'Faster moles! Keep your eyes peeled for the shiny Golden Mole (+300 pts).';
        break;

      case 3: // Fast Diggers
        duration = 35;
        spawnInterval = Math.max(700, 1100 - (levelInWorld * 40));
        visibleDuration = Math.max(900, 1400 - (levelInWorld * 50));
        maxActiveMoles = 2;
        allowedTypes = ['normal', 'golden', 'speed'];
        requiredAccuracy = 60;
        description = isChallenge
          ? 'Rapid Challenge: Speed Moles emerge and vanish in sub-second flashes!'
          : 'Speed Moles wear blue goggles and dart quickly. Strike decisively!';
        break;

      case 4: // Night Garden
        duration = 35;
        spawnInterval = Math.max(700, 1050 - (levelInWorld * 35));
        visibleDuration = Math.max(950, 1350 - (levelInWorld * 40));
        maxActiveMoles = 2;
        allowedTypes = ['normal', 'golden', 'speed'];
        requiredAccuracy = 60;
        description = isChallenge
          ? 'Night Challenge: Moonlit arena with reduced ambient illumination!'
          : 'Night environment. Spot glowing mole eyes and golden crowns in the dark!';
        break;

      case 5: // Golden Hunt
        duration = 40;
        spawnInterval = Math.max(650, 1000 - (levelInWorld * 35));
        visibleDuration = Math.max(900, 1300 - (levelInWorld * 40));
        maxActiveMoles = 2;
        allowedTypes = ['normal', 'golden', 'bonus'];
        requiredAccuracy = 65;
        scoreMultiplier = 1.4 + (levelInWorld * 0.04);
        description = isChallenge
          ? 'Golden Hunt Finale: Massive bonus frenzy with Golden & Gem Moles!'
          : 'High scoring zone! Chain consecutive hits to trigger up to 10x combo multipliers!';
        break;

      case 6: // Chaos Farm
        duration = 40;
        spawnInterval = Math.max(600, 950 - (levelInWorld * 35));
        visibleDuration = Math.max(850, 1200 - (levelInWorld * 35));
        maxActiveMoles = 3;
        allowedTypes = ['normal', 'golden', 'speed', 'bonus'];
        requiredAccuracy = 65;
        description = isChallenge
          ? 'Chaos Challenge: 12 holes with up to 3 simultaneous moles on screen!'
          : 'Grid expanded to 4x3 (12 holes)! Multiple moles emerge simultaneously.';
        break;

      case 7: // Danger Zone
        duration = 40;
        spawnInterval = Math.max(550, 900 - (levelInWorld * 35));
        visibleDuration = Math.max(800, 1150 - (levelInWorld * 35));
        maxActiveMoles = 3;
        allowedTypes = ['normal', 'golden', 'speed', 'bomb'];
        requiredAccuracy = 70;
        description = isChallenge
          ? 'Danger Challenge: Bomb Moles everywhere! Strict target discipline required!'
          : 'DANGER! Bomb Moles have a ticking fuse. Whacking them causes -300 pts and life loss!';
        break;

      case 8: // Extreme Rush
        duration = 45;
        spawnInterval = Math.max(500, 850 - (levelInWorld * 35));
        visibleDuration = Math.max(750, 1100 - (levelInWorld * 35));
        maxActiveMoles = 3;
        allowedTypes = ['normal', 'golden', 'speed', 'armored', 'trick', 'bomb'];
        requiredAccuracy = 70;
        description = isChallenge
          ? 'Extreme Rush Challenge: Armored & Trick moles test multi-tap speed!'
          : 'Armored Moles require 2 mallet strikes to crack their steel helmets!';
        break;

      case 9: // Master Digger
        duration = 45;
        spawnInterval = Math.max(450, 800 - (levelInWorld * 35));
        visibleDuration = Math.max(700, 1000 - (levelInWorld * 30));
        maxActiveMoles = 4;
        allowedTypes = ['normal', 'golden', 'speed', 'armored', 'bonus', 'trick', 'bomb'];
        requiredAccuracy = 75;
        description = isChallenge
          ? 'Master Challenge: Full 16-hole matrix under relentless sub-second cadence!'
          : 'Grid expanded to 4x4 (16 holes)! Supreme reflexes and discipline required.';
        break;

      case 10: // Mole Championship
        duration = isLevel100 ? 60 : 45;
        spawnInterval = isLevel100 ? 400 : Math.max(400, 700 - (levelInWorld * 30));
        visibleDuration = isLevel100 ? 650 : Math.max(650, 900 - (levelInWorld * 25));
        maxActiveMoles = isLevel100 ? 4 : 4;
        allowedTypes = ['normal', 'golden', 'speed', 'armored', 'bonus', 'trick', 'bomb'];
        requiredAccuracy = isLevel100 ? 75 : 72;
        scoreMultiplier = isLevel100 ? 3.5 : (2.5 + (levelInWorld * 0.08));
        description = isLevel100
          ? 'THE MOLE CHAMPIONSHIP: 60-second grand final across 20 holes! Rapid multi-type spawns, Golden Moles, Speed Moles, Armored Moles, and Bombs. Conquering this unlocks INFINITY MODE!'
          : `Championship stage ${levelInWorld}/10: 20-hole matrix at maximum arcade velocity.`;
        break;
    }

    // Calibrated target hits & score requirements
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
      isNightMode: (world.id === 4),
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
      const spawnInterval = Math.max(350, 450 - (wave * 2));
      const visibleDuration = Math.max(550, 680 - (wave * 3));
      const mult = 3.5 + (wave * 0.05);
      const estMoles = Math.floor((duration * 1000) / spawnInterval);
      const targetHits = Math.round(estMoles * 0.7);
      const oneStar = Math.round(targetHits * 120 * mult);

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
        isNightMode: (id % 4 === 0),
        starRequirements: {
          oneStar: oneStar,
          twoStars: Math.round(oneStar * 1.5),
          threeStars: Math.round(oneStar * 2.2)
        },
        xpReward: 1000 + (wave * 20),
        coinReward: 300 + (wave * 10),
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

