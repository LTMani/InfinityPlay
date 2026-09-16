/**
 * Color Match: Spectrum Arena - Level Progression Architecture
 * 100 Playable Levels across 10 Worlds with Milestone Boss Challenges
 * and Post-Level 100 Infinity Mode procedural generator.
 */

(function(window) {
  'use strict';

  const WORLDS = [
    { id: 1, name: 'Spectrum Basics', theme: '#38bdf8', icon: '◈', startLevel: 1, endLevel: 10, description: 'Learn foundational color matching and simple contrasts.' },
    { id: 2, name: 'Chromatic Split', theme: '#06b6d4', icon: '▲', startLevel: 11, endLevel: 20, description: 'Navigate subtle hue differences and expand to 4 color options.' },
    { id: 3, name: 'Stroop Protocol', theme: '#8b5cf6', icon: '⬡', startLevel: 21, endLevel: 30, description: 'Cognitive interference: Match text meaning vs actual ink color.' },
    { id: 4, name: 'Luminance Void', theme: '#f59e0b', icon: '☀', startLevel: 31, endLevel: 40, description: 'Judge perceived brightness and darkest shades in the dark arena.' },
    { id: 5, name: 'Inverted Spectrum', theme: '#ec4899', icon: '◆', startLevel: 41, endLevel: 50, description: 'Reverse perception: Identify odd colors and anomalies.' },
    { id: 6, name: 'Chromatic Flux', theme: '#10b981', icon: '✚', startLevel: 51, endLevel: 60, description: 'Dynamic shifting positions and high-density 6-option grids.' },
    { id: 7, name: 'Memory Prism', theme: '#6366f1', icon: '★', startLevel: 61, endLevel: 70, description: 'Color flash memory: Retain target hues after visual vanish.' },
    { id: 8, name: 'Sub-Second Pulse', theme: '#ef4444', icon: '❖', startLevel: 71, endLevel: 80, description: 'Ultra-fast sub-second reflex challenges pushing human reaction limits.' },
    { id: 9, name: 'Chaos Palette', theme: '#d946ef', icon: '♥', startLevel: 81, endLevel: 90, description: 'All challenge archetypes combined with zero warning transitions.' },
    { id: 10, name: 'Spectrum Singularity', theme: '#ffffff', icon: '✦', startLevel: 91, endLevel: 100, description: 'The pinnacle of chromatic mastery: 8 options, sub-second timers, master trials.' }
  ];

  const LEVELS = [];

  // Helper to build 100 levels deterministically
  for (let levelNum = 1; levelNum <= 100; levelNum++) {
    const worldIndex = Math.floor((levelNum - 1) / 10);
    const world = WORLDS[worldIndex];
    const levelInWorld = ((levelNum - 1) % 10) + 1;
    const isMilestone = (levelInWorld === 10);

    let challengeType = 'exact_match';
    let optionsCount = 3;
    let timeLimit = 5.0;
    let roundsToComplete = 6;
    let shuffleOptions = false;
    let title = '';
    let description = '';

    // World-specific logic
    switch (world.id) {
      case 1: // Spectrum Basics (1-10)
        optionsCount = levelInWorld <= 4 ? 2 : (levelInWorld <= 8 ? 3 : 4);
        timeLimit = Math.max(3.2, 5.0 - (levelInWorld * 0.18));
        challengeType = levelInWorld <= 6 ? 'exact_match' : 'visual_only';
        roundsToComplete = 5 + Math.floor(levelInWorld / 3);
        title = isMilestone ? 'Spectrum Trial I' : `Basic Frequency ${levelInWorld}`;
        description = isMilestone
          ? 'Milestone: Prove your basic color reflex across 8 rapid questions!'
          : 'Match the target color tile with high accuracy.';
        break;

      case 2: // Chromatic Split (11-20)
        optionsCount = 4;
        timeLimit = Math.max(2.6, 3.8 - (levelInWorld * 0.12));
        challengeType = (levelInWorld % 2 === 0) ? 'visual_only' : 'exact_match';
        roundsToComplete = 6 + Math.floor(levelInWorld / 3);
        title = isMilestone ? 'Hue Master Crucible' : `Chromatic Gradient ${levelInWorld}`;
        description = isMilestone
          ? 'Milestone: Distinguish closely adjacent hue frequencies under pressure!'
          : 'Carefully inspect color saturation and hue variants.';
        break;

      case 3: // Stroop Protocol (21-30)
        optionsCount = 4;
        timeLimit = Math.max(2.2, 3.4 - (levelInWorld * 0.12));
        // Alternate between stroop name and ink
        challengeType = (levelInWorld % 2 === 1) ? 'stroop_name' : 'stroop_ink';
        roundsToComplete = 7;
        title = isMilestone ? 'Cognitive Overdrive' : `Neural Interfere ${levelInWorld}`;
        description = isMilestone
          ? 'Milestone: Overcome the Stroop effect with relentless accuracy!'
          : (challengeType === 'stroop_name'
              ? 'Read the WORD and match the color named, ignoring its ink!'
              : 'Match the INK COLOR of the word, ignoring what the text says!');
        break;

      case 4: // Luminance Void (31-40)
        optionsCount = levelInWorld <= 5 ? 4 : 6;
        timeLimit = Math.max(2.0, 3.0 - (levelInWorld * 0.1));
        challengeType = (levelInWorld % 2 === 1) ? 'brightest' : 'darkest';
        roundsToComplete = 7;
        title = isMilestone ? 'Luminance Pinnacle' : `Photon Radiance ${levelInWorld}`;
        description = isMilestone
          ? 'Milestone: Test your dark/light luminance acuity at maximum speed!'
          : (challengeType === 'brightest'
              ? 'Identify the tile with the HIGHEST perceived brightness!'
              : 'Identify the tile with the DARKEST / DEEPEST shade!');
        break;

      case 5: // Inverted Spectrum (41-50)
        optionsCount = levelInWorld <= 4 ? 4 : 6;
        timeLimit = Math.max(1.8, 2.8 - (levelInWorld * 0.1));
        challengeType = 'odd_one';
        roundsToComplete = 8;
        title = isMilestone ? 'Anomaly Overlord' : `Reverse Prism ${levelInWorld}`;
        description = isMilestone
          ? 'Milestone: Hunt down color anomalies across a dense grid!'
          : 'Find the single tile that does NOT belong with the others!';
        break;

      case 6: // Chromatic Flux (51-60)
        optionsCount = 6;
        timeLimit = Math.max(1.6, 2.5 - (levelInWorld * 0.09));
        shuffleOptions = true;
        challengeType = (levelInWorld % 3 === 0) ? 'odd_one' : ((levelInWorld % 2 === 0) ? 'visual_only' : 'exact_match');
        roundsToComplete = 8;
        title = isMilestone ? 'Flux Singularity' : `Vector Shift ${levelInWorld}`;
        description = isMilestone
          ? 'Milestone: Options continuously shift and reorganize in real-time!'
          : 'Target and option locations adapt rapidly. Keep your eyes sharp.';
        break;

      case 7: // Memory Prism (61-70)
        optionsCount = levelInWorld <= 5 ? 4 : 6;
        timeLimit = Math.max(1.8, 2.7 - (levelInWorld * 0.09));
        challengeType = 'memory_flash';
        roundsToComplete = 8;
        title = isMilestone ? 'Echo Spectrum Trial' : `Retinal Memory ${levelInWorld}`;
        description = isMilestone
          ? 'Milestone: Retain fleeting color flashes across 9 consecutive trials!'
          : 'The target color will vanish after a 1-second pulse. Recall and select it!';
        break;

      case 8: // Sub-Second Pulse (71-80)
        optionsCount = 4;
        timeLimit = Math.max(1.0, 1.6 - (levelInWorld * 0.06)); // 1.54s down to 1.0s
        challengeType = (levelInWorld % 2 === 1) ? 'exact_match' : 'visual_only';
        roundsToComplete = 9;
        title = isMilestone ? 'Tachyon Apex' : `Sub-Second Reflex ${levelInWorld}`;
        description = isMilestone
          ? 'Milestone: Extreme sub-second reflex test. React under 1.0s!'
          : 'Raw speed: Make your choice before the micro-timer runs dry!';
        break;

      case 9: // Chaos Palette (81-90)
        optionsCount = 6;
        timeLimit = Math.max(0.95, 1.4 - (levelInWorld * 0.05));
        challengeType = 'mixed';
        shuffleOptions = (levelInWorld >= 5);
        roundsToComplete = 10;
        title = isMilestone ? 'Chaos Crucible' : `Entropic Spectrum ${levelInWorld}`;
        description = isMilestone
          ? 'Milestone: Survive 10 unpredictable mixed challenges without pause!'
          : 'Challenge type mutates every question. Adapt instantly.';
        break;

      case 10: // The Spectrum Singularity (91-100)
        optionsCount = levelInWorld <= 4 ? 6 : 8;
        timeLimit = Math.max(0.75, 1.15 - (levelInWorld * 0.04)); // 1.11s down to 0.75s
        challengeType = 'mixed';
        shuffleOptions = true;
        roundsToComplete = isMilestone ? 15 : 10;
        title = isMilestone ? 'THE SPECTRUM SINGULARITY' : `Cosmic Frequency ${levelInWorld}`;
        description = isMilestone
          ? 'ULTIMATE MILESTONE: 15 rapid-fire challenges with 8 options and 0.75s timer. Become the Spectrum Grandmaster!'
          : 'Extreme high-density grid with lightning reflexes required.';
        break;
    }

    const minScore3Stars = Math.round(roundsToComplete * 180 * (1 + (levelNum * 0.02)));

    LEVELS.push({
      id: levelNum,
      worldId: world.id,
      worldName: world.name,
      worldTheme: world.theme,
      worldIcon: world.icon,
      levelInWorld: levelInWorld,
      title: title,
      description: description,
      challengeType: challengeType,
      optionsCount: optionsCount,
      timeLimit: Math.round(timeLimit * 10) / 10,
      roundsToComplete: roundsToComplete,
      shuffleOptions: shuffleOptions,
      isMilestone: isMilestone,
      minScore3Stars: minScore3Stars
    });
  }

  const LevelSystem = {
    worlds: WORLDS,
    levels: LEVELS,

    /**
     * Get level config by numeric id (1-100)
     */
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
      const challengePool = ['exact_match', 'visual_only', 'stroop_name', 'stroop_ink', 'brightest', 'darkest', 'odd_one', 'memory_flash', 'mixed'];
      const randomChallenge = challengePool[Math.floor(Math.random() * challengePool.length)];
      const optionsCount = (id % 2 === 0) ? 8 : 6;
      const timeLimit = Math.max(0.65, 0.9 - ((id - 100) * 0.005));

      return {
        id: id,
        worldId: 10,
        worldName: 'Infinity Singularity',
        worldTheme: '#f43f5e',
        worldIcon: '✦',
        levelInWorld: (id - 100),
        title: `Singularity Wave ${id - 100}`,
        description: 'Infinite procedural spectrum wave. How far can you survive?',
        challengeType: randomChallenge,
        optionsCount: optionsCount,
        timeLimit: Math.round(timeLimit * 100) / 100,
        roundsToComplete: 10,
        shuffleOptions: true,
        isMilestone: (id % 10 === 0),
        minScore3Stars: Math.round(10 * 250 * (1 + (id * 0.01)))
      };
    },

    /**
     * Get all levels belonging to a specific world (1-10)
     */
    getLevelsForWorld(worldId) {
      return LEVELS.filter(l => l.worldId === worldId);
    },

    /**
     * Get world info by id
     */
    getWorld(worldId) {
      return WORLDS.find(w => w.id === worldId) || WORLDS[0];
    }
  };

  window.LevelSystem = LevelSystem;
})(typeof window !== 'undefined' ? window : this);

