/**
 * PSEUDOKO — 100 Campaign Levels
 * Progressive difficulty curve from Beginner (1-10) to Grandmaster (76-100)
 */

(function(global) {
  'use strict';

  const LEVEL_TIERS = {
    BEGINNER: { id: 'beginner', name: 'Sector I: Beginner', range: [1, 10], color: '#00f0ff' },
    EASY:     { id: 'easy',     name: 'Sector II: Easy',     range: [11, 25], color: '#38bdf8' },
    MEDIUM:   { id: 'medium',   name: 'Sector III: Medium',   range: [26, 50], color: '#a855f7' },
    HARD:     { id: 'hard',     name: 'Sector IV: Hard',     range: [51, 75], color: '#f59e0b' },
    MASTER:   { id: 'master',   name: 'Sector V: Master',    range: [76, 100], color: '#ef4444' }
  };

  // Deterministic generator helper for levels 1..100
  function createCampaignLevel(num) {
    let tier = 'beginner';
    if (num > 75) tier = 'master';
    else if (num > 50) tier = 'hard';
    else if (num > 25) tier = 'medium';
    else if (num > 10) tier = 'easy';

    const names = [
      // 1-10
      'Genesis Pulse', 'Frequency Shift', 'Quadratic Lock', 'Core Awaken', 'Circuit Bridge',
      'Harmonic Wave', 'Neural Alignment', 'Power Surge', 'Sector Resonance', 'First Protocol',
      // 11-25
      'Cipher Gate', 'Matrix Weave', 'Dual Conduits', 'Firewall Breach', 'Overclocked Grid',
      'Vector Divergence', 'Binary Cascade', 'Quantum Lattice', 'Prism Synthesis', 'Relay Nexus',
      'Phase Shift', 'Territory Surge', 'Subnet Intrusion', 'Feedback Loop', 'Firewall Cluster',
      // 26-50
      'Cyber Overload', 'Vortex Induction', 'Tri-Core Nexus', 'Glitch Cleansing', 'Parity Enigma',
      'Synapse Array', 'Echo Chamber', 'AI Skirmish Alpha', 'Flux Capacitor', 'Neural Labyrinth',
      'Sector Lockdown', 'Spectrum Split', 'Dynamic Cascade', 'Zero-Day Barrier', 'Logic Storm',
      'Tactical Maneuver', 'Entropy Chamber', 'AI Skirmish Beta', 'Circuit Convergence', 'Hyper-Threading',
      'Grid Partition', 'Data Stream', 'Overdrive Matrix', 'Fractal Conduit', 'Midway Defense',
      // 51-75
      'Nanite Swarm', 'Void Gateway', 'Recursive Loop', 'AI Tactical Duel', 'Deep Freeze',
      'Quantum Entanglement', 'Firewall Gauntlet', 'Neural Disruption', 'Omega Core', 'Matrix Inversion',
      'Critical Threshold', 'Vortex Overcharge', 'Sub-Zero Logic', 'AI Blitzkrieg', 'Silicon Bastion',
      'Pulse Resonance', 'Superposition', 'Dark Conduit', 'Cyberpunk Showdown', 'Terminal Matrix',
      'Titanium Shield', 'Nexus Collapse', 'Vector Ambush', 'Zero Defect Protocol', 'Penultimate Breach',
      // 76-100
      'Grandmaster Gambit', 'Black Ice Defense', 'Quantum Supremacy', 'Singularity Core', 'Neural Dominion',
      'Overlord Protocol', 'Hyper-Matrix War', 'Absolute Zero', 'Omni-Directional Trap', 'Chrono Disruption',
      'Spectral Nexus', 'AI Grandmaster Duel', 'Infinite Horizon', 'Dark Matter Array', 'Total Lockdown',
      'Ascension Point', 'Cyber Apocalypse', 'Neural Godhead', 'The Archon Core', 'Apex Predator',
      'Omega Cascade', 'Mastermind Verdict', 'Zero Entropy', 'The Eternal Circuit', 'Singularity Overlord'
    ];

    const title = names[num - 1] || `Tactical Sector ${num}`;

    // Objective types rotation
    const objectiveTypes = ['score', 'territory', 'circuits', 'cores', 'firewall'];
    const objType = (num % 10 === 0) ? 'ai_duel' : objectiveTypes[(num * 3 + 2) % objectiveTypes.length];

    let target = 1000;
    let desc = '';
    let moves = 16;
    const preplacedNodes = [];
    const specialCells = [];
    let aiOpponent = null;

    if (objType === 'score') {
      target = 1200 + (num * 110);
      desc = `Achieve a score of ${target.toLocaleString()} points`;
      moves = Math.max(10, 22 - Math.floor(num / 10));
    } else if (objType === 'territory') {
      target = Math.min(85, 45 + Math.floor(num * 0.45));
      desc = `Seize control of at least ${target}% of the tactical board`;
      moves = Math.max(10, 18 - Math.floor(num / 15));
    } else if (objType === 'circuits') {
      target = Math.min(6, 1 + Math.floor(num / 18));
      desc = `Synthesize ${target} Harmonic Circuits (2x2 sectors or 4-lines)`;
      moves = 14 + target * 2;
    } else if (objType === 'cores') {
      const coreCount = Math.min(5, 2 + Math.floor(num / 25));
      target = coreCount;
      desc = `Capture and activate all ${coreCount} Power Cores`;
      moves = 12 + coreCount * 2;
    } else if (objType === 'firewall') {
      const fwCount = Math.min(6, 2 + Math.floor(num / 20));
      target = fwCount;
      desc = `Bypass and purge ${fwCount} Encrypted Firewalls`;
      moves = 14 + fwCount * 2;
    } else if (objType === 'ai_duel') {
      let aiLevel = 'easy';
      if (num >= 80) aiLevel = 'master';
      else if (num >= 60) aiLevel = 'expert';
      else if (num >= 40) aiLevel = 'hard';
      else if (num >= 20) aiLevel = 'medium';

      desc = `Out-maneuver the ${aiLevel.toUpperCase()} AI in territory and score`;
      moves = 18;
      aiOpponent = { enabled: true, difficulty: aiLevel };
    }

    // Special cell placements based on level seed
    if (objType === 'cores' || num % 3 === 0) {
      const corePositions = [
        [2, 2], [5, 5], [2, 5], [5, 2], [3, 4], [4, 3]
      ];
      const count = objType === 'cores' ? target : Math.min(3, 1 + Math.floor(num / 30));
      for (let i = 0; i < count; i++) {
        const [r, c] = corePositions[i % corePositions.length];
        specialCells.push({ row: r, col: c, type: 'core' });
      }
    }

    if (objType === 'firewall' || (num > 15 && num % 4 === 0)) {
      const fwPositions = [
        [1, 3], [1, 4], [6, 3], [6, 4], [3, 1], [4, 1], [3, 6], [4, 6]
      ];
      const count = objType === 'firewall' ? target : Math.min(4, Math.floor(num / 20));
      for (let i = 0; i < count; i++) {
        const [r, c] = fwPositions[i % fwPositions.length];
        specialCells.push({ row: r, col: c, type: 'firewall' });
      }
    }

    if (num > 25 && num % 5 === 0) {
      specialCells.push({ row: 3, col: 3, type: 'vortex' });
      specialCells.push({ row: 4, col: 4, type: 'vortex' });
    }

    // Preplaced puzzle nodes (constraints to deduce around)
    const preplacedCount = Math.min(10, 2 + Math.floor(num / 12));
    for (let i = 0; i < preplacedCount; i++) {
      const pr = (num * 3 + i * 2) % 8;
      const pc = (num * 5 + i * 3) % 8;
      const typeId = (i % 4) + 1;
      // Ensure no overlap with special cells
      if (!specialCells.some(sc => sc.row === pr && sc.col === pc)) {
        preplacedNodes.push({ row: pr, col: pc, type: typeId, locked: true });
      }
    }

    // Star score thresholds
    const baseStar = Math.max(1200, 800 + num * 90);
    const starThresholds = [
      baseStar,
      Math.round(baseStar * 1.4),
      Math.round(baseStar * 2.0)
    ];

    return {
      id: num,
      name: title,
      tier: tier,
      tierInfo: LEVEL_TIERS[tier.toUpperCase()],
      objective: {
        type: objType,
        target: target,
        description: desc
      },
      moves: moves,
      starThresholds: starThresholds,
      preplacedNodes: preplacedNodes,
      specialCells: specialCells,
      aiOpponent: aiOpponent
    };
  }

  // Generate all 100 levels
  const levels = [];
  for (let i = 1; i <= 100; i++) {
    levels.push(createCampaignLevel(i));
  }

  // Accessor API
  const LevelsManager = {
    getAllLevels() {
      return levels;
    },

    getLevelById(id) {
      const num = parseInt(id, 10);
      return levels[num - 1] || levels[0];
    },

    getLevelsByTier(tierName) {
      return levels.filter(l => l.tier.toLowerCase() === tierName.toLowerCase());
    },

    getTiers() {
      return LEVEL_TIERS;
    }
  };

  global.Pseudoko = global.Pseudoko || {};
  global.Pseudoko.Levels = LevelsManager;
  global.Pseudoko.LEVEL_TIERS = LEVEL_TIERS;

})(typeof window !== 'undefined' ? window : global);

