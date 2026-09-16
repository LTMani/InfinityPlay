/**
 * Color Match: Spectrum Arena - Level Progression Architecture
 * 
 * 100 Handcrafted & Deterministically Calibrated Playable Levels
 * Divided across 10 distinct Worlds, introducing new gameplay mechanics per world.
 * 
 * World 1: Basic Color Matching (Very Easy)
 * World 2: Faster Matching (Easy)
 * World 3: More Options and Combos (Easy/Medium)
 * World 4: Similar Colors/Shades (Medium)
 * World 5: Visual Distractions (Medium)
 * World 6: Reaction-Time Challenges (Medium/Hard)
 * World 7: Extremely Similar Shades (Hard)
 * World 8: Multiple Challenge Types (Hard)
 * World 9: Master-Level Precision (Very Hard)
 * World 10: Extreme Championship (Extreme - Level 100 is 20-round Championship)
 * 
 * Post-Level 100: Infinity Mode procedural scaling.
 */

(function(window) {
  'use strict';

  const WORLDS = [
    {
      id: 1,
      name: 'Basic Color Matching',
      difficulty: 'Very Easy',
      theme: '#38bdf8',
      icon: '◈',
      startLevel: 1,
      endLevel: 10,
      description: 'Foundational color recognition. High-contrast hues, clear labels, and relaxed reaction windows.'
    },
    {
      id: 2,
      name: 'Faster Matching',
      difficulty: 'Easy',
      theme: '#06b6d4',
      icon: '⚡',
      startLevel: 11,
      endLevel: 20,
      description: 'Accelerated matching cadence. Visual frequency recognition without text crutches.'
    },
    {
      id: 3,
      name: 'More Options & Combos',
      difficulty: 'Easy/Medium',
      theme: '#8b5cf6',
      icon: '🔥',
      startLevel: 21,
      endLevel: 30,
      description: 'Grid density expands up to 6 tiles. Combo multipliers unlock massive score acceleration.'
    },
    {
      id: 4,
      name: 'Similar Colors & Shades',
      difficulty: 'Medium',
      theme: '#f59e0b',
      icon: '🎨',
      startLevel: 31,
      endLevel: 40,
      description: 'Subtle hue differences. Distinguish closely adjacent spectral tones like ruby vs crimson and cyan vs sky.'
    },
    {
      id: 5,
      name: 'Visual Distractions',
      difficulty: 'Medium',
      theme: '#ec4899',
      icon: '🧠',
      startLevel: 41,
      endLevel: 50,
      description: 'Cognitive Stroop interference. Resist deceptive font colors, ink illusions, and visual noise.'
    },
    {
      id: 6,
      name: 'Reaction-Time Challenges',
      difficulty: 'Medium/Hard',
      theme: '#10b981',
      icon: '⏱️',
      startLevel: 51,
      endLevel: 60,
      description: 'High-speed reflex sprints with dynamic option shuffling. React before the micro-timer vanishes.'
    },
    {
      id: 7,
      name: 'Extremely Similar Shades',
      difficulty: 'Hard',
      theme: '#eab308',
      icon: '👁️',
      startLevel: 61,
      endLevel: 70,
      description: 'Micro-delta hue tolerances and luminance void trials. Discern peak brightness and darkest abyssal tones.'
    },
    {
      id: 8,
      name: 'Multiple Challenge Types',
      difficulty: 'Hard',
      theme: '#6366f1',
      icon: '🎲',
      startLevel: 71,
      endLevel: 80,
      description: 'Unpredictable multi-archetype gauntlet. Challenge mechanics mutate dynamically every single question.'
    },
    {
      id: 9,
      name: 'Master-Level Precision',
      difficulty: 'Very Hard',
      theme: '#f43f5e',
      icon: '🎯',
      startLevel: 81,
      endLevel: 90,
      description: 'Retinal memory flash trials and sub-second timers. Zero margin for error across dense 6-8 tile matrices.'
    },
    {
      id: 10,
      name: 'Extreme Championship',
      difficulty: 'Extreme',
      theme: '#ffffff',
      icon: '👑',
      startLevel: 91,
      endLevel: 100,
      description: 'The pinnacle of cognitive speed. Climaxing in the monumental 20-round Infinity Championship at Level 100.'
    }
  ];

  // Title templates per world for distinctive narrative flavor
  const WORLD_TITLES = {
    1: ['Pure Red Awakening', 'Cerulean First Step', 'Amber Contrast', 'Emerald Pulse', 'Violet Harmony', 'Dual Frequency', 'Tri-Tone Horizon', 'Spectrum Calibration', 'Prism Alignment', 'World 1 Trial: Basics Master'],
    2: ['Rapid Blink', 'Velocity Hue', 'Pace Accelerator', 'Swift Cyan', 'Visual Reflex', 'No-Text Sprint', 'Tempo Drift', 'Micro Reflex', 'Speedway Cadence', 'World 2 Trial: Velocity Overdrive'],
    3: ['Four-Way Fork', 'Combo Ignition', 'Hexa Spectrum', 'Multiplier Surge', 'Flow State', 'Density Escalation', 'Streak Dominance', 'Six-Pack Matrix', 'Chain Reaction', 'World 3 Trial: Combo Singularity'],
    4: ['Crimson & Ruby', 'Azure & Sapphire', 'Teal & Mint', 'Amber & Gold', 'Coral Nuance', 'Violet & Purple', 'Forest Subtlety', 'Rose Gradient', 'Monochrome Shift', 'World 4 Trial: Shade Sovereign'],
    5: ['Stroop Awakening', 'Semantic Deception', 'Ink Divergence', 'Neural Clash', 'Chromatic Paradox', 'Optical Mirage', 'Cognitive Dissonance', 'Mind Mirage', 'Inverse Logic', 'World 5 Trial: Stroop Champion'],
    6: ['Sub-Second Pulse', 'Shifting Vectors', 'Kinetic Flux', 'Tachyon Reflex', 'Moving Tiles', 'Micro-Second Crunch', 'Rapid Relocation', 'Dynamic Drift', 'Reflex Crucible', 'World 6 Trial: Flux Dominator'],
    7: ['Luminance Zenith', 'Abyssal Void', 'Delta-Hue Micro', 'Perceptual Edge', 'Photopic Vision', 'Shadow Discernment', 'Radiance Gradient', 'Subtle Tone Rift', 'Luma Mastery', 'World 7 Trial: Void Luminary'],
    8: ['Archetype Roulette', 'Rapid Mutation', 'Stroop to Anomaly', 'Memory to Shade', 'Hybrid Crucible', 'Chaotic Rhythm', 'Poly-Challenge Shift', 'Mutating Grid', 'Chaos Synthesis', 'World 8 Trial: Polymath Grandmaster'],
    9: ['Retinal Flash', 'Memory Vanish', 'Ephemeral Shade', 'Ghost Frequency', 'High-Stakes Flash', 'Split-Second Recall', 'Tachyon Memory', 'Phantom Matrix', 'Absolute Precision', 'World 9 Trial: Retinal Apex'],
    10: ['Singularity Gate', 'Cosmic Matrix', 'God-Speed Pulse', '8-Tile Labyrinth', 'Hyper-Stroop', 'Chaos Convergence', 'Absolute Void', 'Transcendent Reflex', 'Penultimate Trial', 'THE 20-ROUND INFINITY CHAMPIONSHIP']
  };

  const LEVELS = [];

  for (let levelNum = 1; levelNum <= 100; levelNum++) {
    const worldIndex = Math.floor((levelNum - 1) / 10);
    const world = WORLDS[worldIndex];
    const levelInWorld = ((levelNum - 1) % 10) + 1; // 1 to 10
    const isMilestone = (levelInWorld === 10);
    const isLevel100 = (levelNum === 100);

    let challengeType = 'exact_match';
    let mechanic = 'basic_matching';
    let optionsCount = 3;
    let timeLimit = 4.5;
    let roundsToComplete = 6;
    let scoreMultiplier = 1.0 + (levelNum * 0.02);
    let shuffleOptions = false;
    let similarShadeTolerance = 0;

    const title = WORLD_TITLES[world.id][levelInWorld - 1] || `Spectrum Phase ${levelNum}`;
    let description = '';

    // Specialized gameplay mechanics per world
    switch (world.id) {
      case 1: // Basic Color Matching (Levels 1-10: Very Easy)
        mechanic = 'basic_matching';
        challengeType = 'exact_match';
        optionsCount = levelInWorld <= 4 ? 2 : 3;
        timeLimit = Math.max(3.8, 5.0 - (levelInWorld * 0.12));
        roundsToComplete = isMilestone ? 8 : (5 + Math.floor(levelInWorld / 4));
        description = isMilestone
          ? 'World 1 Championship: Prove your fundamental color reflexes across 8 clear challenges!'
          : `Match the target color tile with high precision. Options: ${optionsCount}, Timer: ${timeLimit.toFixed(1)}s.`;
        break;

      case 2: // Faster Matching (Levels 11-20: Easy)
        mechanic = 'speed_matching';
        challengeType = (levelInWorld % 2 === 0) ? 'visual_only' : 'exact_match';
        optionsCount = levelInWorld <= 5 ? 3 : 4;
        timeLimit = Math.max(2.4, 3.6 - (levelInWorld * 0.12));
        roundsToComplete = isMilestone ? 9 : 7;
        description = isMilestone
          ? 'World 2 Championship: Ultra-fast visual matching without color name crutches!'
          : `Fast cadence: Timer drops to ${timeLimit.toFixed(1)}s. Match the color by eye alone.`;
        break;

      case 3: // More Options and Combos (Levels 21-30: Easy/Medium)
        mechanic = 'combo_acceleration';
        challengeType = 'exact_match';
        optionsCount = levelInWorld <= 5 ? 4 : 6;
        timeLimit = Math.max(2.3, 3.2 - (levelInWorld * 0.09));
        roundsToComplete = isMilestone ? 9 : 7;
        scoreMultiplier = 1.3 + (levelInWorld * 0.04);
        description = isMilestone
          ? 'World 3 Championship: Maintain a flawless combo streak across dense 6-tile grids!'
          : `Expanded grid with ${optionsCount} options. Consecutive streaks grant accelerated combo multipliers!`;
        break;

      case 4: // Similar Colors/Shades (Levels 31-40: Medium)
        mechanic = 'similar_shades';
        challengeType = 'similar_shades';
        optionsCount = 4;
        timeLimit = Math.max(2.2, 3.2 - (levelInWorld * 0.1));
        roundsToComplete = isMilestone ? 10 : 8;
        similarShadeTolerance = Math.max(20, 50 - (levelInWorld * 3));
        description = isMilestone
          ? 'World 4 Championship: Distinguish closely adjacent spectral hues under time pressure!'
          : 'Options share adjacent hue tones (e.g. crimson vs ruby, teal vs cyan). Inspect closely!';
        break;

      case 5: // Visual Distractions (Levels 41-50: Medium)
        mechanic = 'stroop_interference';
        challengeType = (levelInWorld % 2 === 1) ? 'stroop_name' : 'stroop_ink';
        optionsCount = 4;
        timeLimit = Math.max(2.0, 3.0 - (levelInWorld * 0.1));
        roundsToComplete = isMilestone ? 10 : 8;
        description = isMilestone
          ? 'World 5 Championship: Overcome maximum cognitive Stroop interference!'
          : (challengeType === 'stroop_name'
              ? 'Read the WORD and match the color named, completely ignoring its font ink color!'
              : 'Match the actual INK COLOR of the text, completely ignoring what word is written!');
        break;

      case 6: // Reaction-Time Challenges (Levels 51-60: Medium/Hard)
        mechanic = 'rapid_reflex_flux';
        challengeType = (levelInWorld % 3 === 0) ? 'visual_only' : 'exact_match';
        optionsCount = levelInWorld <= 5 ? 4 : 6;
        timeLimit = Math.max(1.15, 1.8 - (levelInWorld * 0.065)); // 1.73s down to 1.15s
        shuffleOptions = true;
        roundsToComplete = isMilestone ? 10 : 8;
        description = isMilestone
          ? 'World 6 Championship: Rapid-fire sub-second reaction with dynamically shifting option locations!'
          : `Speed crunch: Only ${timeLimit.toFixed(2)}s per question. Tile positions rearrange dynamically!`;
        break;

      case 7: // Extremely Similar Shades (Levels 61-70: Hard)
        mechanic = 'luminance_extreme_shades';
        challengeType = (levelInWorld % 2 === 1) ? 'brightest' : 'darkest';
        optionsCount = levelInWorld <= 5 ? 4 : 6;
        timeLimit = Math.max(1.8, 2.7 - (levelInWorld * 0.09));
        roundsToComplete = isMilestone ? 10 : 8;
        similarShadeTolerance = 15;
        description = isMilestone
          ? 'World 7 Championship: Peak visual acuity test discerning micro-luminance differences!'
          : (challengeType === 'brightest'
              ? 'Identify the tile with the HIGHEST perceived brightness among subtle variants!'
              : 'Identify the tile with the DARKEST / DEEPEST shade in the dark arena!');
        break;

      case 8: // Multiple Challenge Types (Levels 71-80: Hard)
        mechanic = 'poly_challenge_gauntlet';
        challengeType = 'mixed';
        optionsCount = 6;
        timeLimit = Math.max(1.2, 1.8 - (levelInWorld * 0.06));
        roundsToComplete = isMilestone ? 12 : 9;
        description = isMilestone
          ? 'World 8 Championship: Survive 12 consecutive multi-archetype trials without breaking focus!'
          : 'Dynamic gauntlet: Challenge type mutates randomly every single round. Adapt instantly.';
        break;

      case 9: // Master-Level Precision (Levels 81-90: Very Hard)
        mechanic = 'retinal_memory_flash';
        challengeType = 'memory_flash';
        optionsCount = levelInWorld <= 5 ? 6 : 8;
        timeLimit = Math.max(0.9, 1.4 - (levelInWorld * 0.05));
        roundsToComplete = isMilestone ? 12 : 9;
        scoreMultiplier = 2.4 + (levelInWorld * 0.05);
        description = isMilestone
          ? 'World 9 Championship: Flash memory trial with 8 options and vanishing retinal targets!'
          : `Target vanishes after a 0.8s pulse. Retain the hue in memory and pick from ${optionsCount} options!`;
        break;

      case 10: // Extreme Championship (Levels 91-100: Extreme)
        mechanic = isLevel100 ? 'infinity_championship' : 'extreme_mastery';
        challengeType = 'mixed';
        optionsCount = 8;
        shuffleOptions = true;
        roundsToComplete = isLevel100 ? 20 : 10;
        timeLimit = isLevel100 ? 0.75 : Math.max(0.70, 1.05 - (levelInWorld * 0.035));
        scoreMultiplier = isLevel100 ? 3.5 : (2.8 + (levelInWorld * 0.06));
        description = isLevel100
          ? 'THE 20-ROUND INFINITY CHAMPIONSHIP: The ultimate 20-round gauntlet featuring 8 options, sub-second micro-timer, and all challenge archetypes! Conquering this unlocks INFINITY MODE!'
          : `Extreme championship round ${levelInWorld}/10: 8 options, shifting layout, 0.75s reflex window.`;
        break;
    }

    // Calculated star thresholds
    const baseRoundPoints = Math.round(180 * scoreMultiplier);
    const threeStarScore = Math.round(roundsToComplete * baseRoundPoints);
    const twoStarScore = Math.round(threeStarScore * 0.65);
    const oneStarScore = Math.round(threeStarScore * 0.35);

    // Rewards scaling
    const xpReward = Math.round(75 + (levelNum * 9) + (isMilestone ? 250 : 0) + (isLevel100 ? 1000 : 0));
    const coinReward = Math.round(15 + (levelNum * 2) + (isMilestone ? 50 : 0) + (isLevel100 ? 200 : 0));

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
      mechanic: mechanic,
      challengeType: challengeType,
      optionsCount: optionsCount,
      timeLimit: Math.round(timeLimit * 100) / 100,
      roundsToComplete: roundsToComplete,
      scoreMultiplier: Math.round(scoreMultiplier * 100) / 100,
      shuffleOptions: shuffleOptions,
      similarShadeTolerance: similarShadeTolerance,
      isMilestone: isMilestone,
      isLevel100: isLevel100,
      starRequirements: {
        oneStar: oneStarScore,
        twoStars: twoStarScore,
        threeStars: threeStarScore
      },
      minScore3Stars: threeStarScore,
      xpReward: xpReward,
      coinReward: coinReward,
      unlockRequirement: levelNum === 1 ? 0 : levelNum - 1
    });
  }

  const LevelSystem = {
    worlds: WORLDS,
    levels: LEVELS,

    /**
     * Retrieve any level by ID (1-100 or beyond)
     */
    getLevel(id) {
      if (id > 100) {
        return this.generateInfinityLevel(id);
      }
      return LEVELS.find(l => l.id === id) || LEVELS[0];
    },

    /**
     * Seamless Infinity Mode generator for post-Level 100 progression (levels 101, 200, 500, 1000+)
     */
    generateInfinityLevel(id) {
      const challengePool = [
        'exact_match', 'visual_only', 'similar_shades', 'stroop_name', 
        'stroop_ink', 'brightest', 'darkest', 'odd_one', 'memory_flash', 'mixed'
      ];
      const randomChallenge = challengePool[Math.floor(Math.random() * challengePool.length)];
      const optionsCount = (id % 2 === 0) ? 8 : 6;
      const timeLimit = Math.max(0.60, 0.85 - ((id - 100) * 0.003));
      const rounds = 10 + (id % 5 === 0 ? 5 : 0);
      const mult = 3.5 + ((id - 100) * 0.05);
      const threeStar = Math.round(rounds * 280 * mult);

      return {
        id: id,
        worldId: 10,
        worldName: 'Infinity Singularity',
        difficultyLabel: 'Extreme',
        worldTheme: '#f43f5e',
        worldIcon: '♾️',
        levelInWorld: id - 100,
        title: `Singularity Wave ${id - 100}`,
        description: 'Infinite procedural spectrum wave. Survive and ascend through the limitless spectrum.',
        mechanic: 'infinity_wave',
        challengeType: randomChallenge,
        optionsCount: optionsCount,
        timeLimit: Math.round(timeLimit * 100) / 100,
        roundsToComplete: rounds,
        scoreMultiplier: Math.round(mult * 100) / 100,
        shuffleOptions: true,
        similarShadeTolerance: 20,
        isMilestone: (id % 10 === 0),
        isLevel100: false,
        starRequirements: {
          oneStar: Math.round(threeStar * 0.35),
          twoStars: Math.round(threeStar * 0.65),
          threeStars: threeStar
        },
        minScore3Stars: threeStar,
        xpReward: Math.round(500 + (id * 5)),
        coinReward: Math.round(100 + Math.floor(id / 5)),
        unlockRequirement: id - 1
      };
    },

    /**
     * Get all levels in a world
     */
    getLevelsForWorld(worldId) {
      return LEVELS.filter(l => l.worldId === worldId);
    },

    /**
     * Get world details by ID
     */
    getWorld(worldId) {
      return WORLDS.find(w => w.id === worldId) || WORLDS[0];
    }
  };

  window.LevelSystem = LevelSystem;
})(typeof window !== 'undefined' ? window : this);
