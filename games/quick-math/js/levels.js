/**
 * Quick Math: Infinity Challenge - Centralized Levels & Worlds Configuration
 * 100 Playable Levels organized across 10 Thematic Worlds.
 * Architecture is 100% data-driven and extensible up to 1,000+ levels without code rewrite.
 */

(function() {
  'use strict';

  const WORLDS = [
    {
      id: 1,
      name: 'NUMBER BASICS',
      subtitle: 'Single-Digit Foundations & Rapid Recognition',
      icon: '🌱',
      levelRange: [1, 10],
      themeColor: '#10b981', // Emerald
      bgGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(6, 78, 59, 0.05))',
      description: 'Master the fundamental building blocks of mental addition and rapid subtraction.'
    },
    {
      id: 2,
      name: 'FAST CALCULATION',
      subtitle: 'Double-Digit Addition & Subtraction',
      icon: '⚡',
      levelRange: [11, 20],
      themeColor: '#06b6d4', // Cyan
      bgGradient: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(8, 51, 68, 0.05))',
      description: 'Accelerate mental processing with two-digit regrouping, carries, and borrows.'
    },
    {
      id: 3,
      name: 'MULTIPLICATION',
      subtitle: 'Times Tables & Factor Mastery',
      icon: '✖️',
      levelRange: [21, 30],
      themeColor: '#8b5cf6', // Purple
      bgGradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(76, 29, 149, 0.05))',
      description: 'Internalize times tables up to 12×12 and multi-digit scaling factors.'
    },
    {
      id: 4,
      name: 'DIVISION',
      subtitle: 'Exact Quotients & Fraction Splitting',
      icon: '➗',
      levelRange: [31, 40],
      themeColor: '#3b82f6', // Blue
      bgGradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(30, 58, 138, 0.05))',
      description: 'Execute clean integer division and reverse multiplication with zero remainders.'
    },
    {
      id: 5,
      name: 'MIXED OPERATIONS',
      subtitle: 'Multi-Operator Fluidity',
      icon: '🔄',
      levelRange: [41, 50],
      themeColor: '#ec4899', // Pink
      bgGradient: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(131, 24, 67, 0.05))',
      description: 'Switch seamlessly between addition, subtraction, multiplication, and division.'
    },
    {
      id: 6,
      name: 'ADVANCED CALCULATION',
      subtitle: 'BODMAS & Parentheses',
      icon: '🧩',
      levelRange: [51, 60],
      themeColor: '#f59e0b', // Amber
      bgGradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(120, 53, 15, 0.05))',
      description: 'Navigate strict order of operations, compound brackets, and multi-step terms.'
    },
    {
      id: 7,
      name: 'SPEED ARENA',
      subtitle: 'High-Pressure Reflexes',
      icon: '⏱️',
      levelRange: [61, 70],
      themeColor: '#ef4444', // Red
      bgGradient: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(127, 29, 29, 0.05))',
      description: 'Extremely compressed timers designed to push mental reflex thresholds to the absolute limit.'
    },
    {
      id: 8,
      name: 'LOGIC MATH',
      subtitle: 'Missing Operands & Sequences',
      icon: '🧠',
      levelRange: [71, 80],
      themeColor: '#6366f1', // Indigo
      bgGradient: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(49, 46, 129, 0.05))',
      description: 'Deduce unknown variables, extrapolate numerical progressions, and solve algebraic constraints.'
    },
    {
      id: 9,
      name: 'MASTER CHALLENGE',
      subtitle: 'Grandmaster Complexity',
      icon: '🎖️',
      levelRange: [81, 90],
      themeColor: '#d946ef', // Fuchsia
      bgGradient: 'linear-gradient(135deg, rgba(217, 70, 239, 0.15), rgba(112, 26, 117, 0.05))',
      description: 'Formidable multi-term equations demanding peak concentration and calculation speed.'
    },
    {
      id: 10,
      name: 'INFINITY CHAMPIONSHIP',
      subtitle: 'The Ultimate Mathematical Gauntlet',
      icon: '👑',
      levelRange: [91, 100],
      themeColor: '#eab308', // Gold
      bgGradient: 'linear-gradient(135deg, rgba(234, 179, 8, 0.2), rgba(113, 63, 18, 0.08))',
      description: 'The pinnacle of mental computation. Perfect round challenges, maximum speed, and ultimate glory.'
    }
  ];

  /**
   * Systematically generates 100 Level configurations across all 10 Worlds.
   * Special milestone levels (10, 20, 30, 40, 50, 60, 70, 80, 90, 100) have custom rules.
   */
  function buildLevels() {
    const list = [];

    // Milestone rule definitions
    const MILESTONES = {
      10: { name: 'Time Trial', rule: 'TIME_TRIAL', badge: 'TIME TRIAL', timeLimit: 4, qCount: 15 },
      20: { name: 'Multiplication Rush', rule: 'MULTIPLICATION_RUSH', badge: 'RUSH', timeLimit: 5, qCount: 15 },
      30: { name: 'Division Master', rule: 'DIVISION_MASTER', badge: 'MASTER', timeLimit: 6, qCount: 15 },
      40: { name: 'No Mistake', rule: 'NO_MISTAKE', badge: '1 STRIKE FAIL', timeLimit: 7, qCount: 12 },
      50: { name: 'Mixed Math Rush', rule: 'MIXED_MATH', badge: 'QUAD COMBO', timeLimit: 6, qCount: 15 },
      60: { name: 'Double Speed', rule: 'DOUBLE_SPEED', badge: 'DOUBLE SPEED', timeLimit: 3.5, qCount: 15 },
      70: { name: '10-Second Survival', rule: 'SURVIVAL_CHALLENGE', badge: 'SURVIVAL', timeLimit: 3.0, qCount: 15 },
      80: { name: 'Logic Master', rule: 'LOGIC_MASTER', badge: 'LOGIC PUZZLE', timeLimit: 6, qCount: 15 },
      90: { name: 'Master Exam', rule: 'MASTER_EXAM', badge: 'EXAM', timeLimit: 4.5, qCount: 15 },
      100: { name: 'Infinity Championship', rule: 'INFINITY_CHAMPIONSHIP', badge: 'FINAL BOSS', timeLimit: 4.0, qCount: 20 }
    };

    // Level names per world
    const WORLD_LEVEL_NAMES = {
      1: ['First Steps', 'Quick Start', 'Single Digits', 'Add & Carry', 'Sub Runner', 'Takeaway', 'Double Check', 'Speed Count', 'Pace Setter', 'Time Trial'],
      2: ['Two-Digit Intro', 'Tens Addition', 'Tens Minus', 'Carry Over', 'Borrow Check', 'Regroup Sprint', 'Dual Power', 'Split Sums', 'Turbo Tens', 'Multiplication Rush'],
      3: ['Twos & Threes', 'Fives & Tens', 'Square Roots Prep', 'Sixes Sprint', 'Sevens Stride', 'Eights Power', 'Nines Magic', 'Elevens & Twelves', 'Times Gauntlet', 'Division Master'],
      4: ['Halves & Thirds', 'Exact Four', 'Even Splits', 'Clean Dividends', 'Factor Search', 'Quotient Rush', 'Even Division', 'High Dividends', 'Fraction Speed', 'No Mistake'],
      5: ['Triad Mix', 'Plus & Times', 'Minus & Div', 'Cross Operations', 'Dynamic Four', 'Operator Shift', 'Four Pillars', 'Calculation Storm', 'Blitz Mix', 'Mixed Math Rush'],
      6: ['Simple Brackets', 'Multiply First', 'Parentheses Priority', 'Dual Steps', 'Chain Math', 'Complex Order', 'Bracket Blitz', 'Multi-Layer', 'Deep Operations', 'Double Speed'],
      7: ['Flash Count', 'Light Speed', 'Sub-4 Seconds', 'Rapid Fire', 'Reflex Pulse', 'Split Second', 'Pressure Cooker', 'Supersonic', 'Hyper Velocity', '10-Second Survival'],
      8: ['Missing Addend', 'Hidden Subtrahend', 'Missing Factor', 'Missing Divisor', 'Simple Sequence', 'Step Progression', 'Dual Missing', 'Fibonacci Step', 'Deduction Grid', 'Logic Master'],
      9: ['Grandmaster Tier', 'Heavy Numbers', 'Three-Term BODMAS', 'Complex Variables', 'High Factorials', 'Extreme Sprint', 'Equation Solver', 'Dual Compound', 'Summit Push', 'Master Exam'],
      10: ['Ascension', 'Grand Arena', 'Omega Addition', 'Omega Multiplier', 'Cosmic Division', 'Hyper Logic', 'Godspeed Reflex', 'Final Crucible', 'Pinnacle Trial', 'Infinity Championship']
    };

    for (let id = 1; id <= 100; id++) {
      const worldId = Math.ceil(id / 10);
      const levelInWorld = ((id - 1) % 10) + 1;
      const milestone = MILESTONES[id] || null;

      let questionCount = milestone ? milestone.qCount : 10;
      let timeLimit = 10;
      let operations = ['addition'];
      let minNumber = 1;
      let maxNumber = 10;
      let difficulty = Math.min(10, Math.max(1, Math.ceil(id / 10)));

      // Configure World parameters
      switch (worldId) {
        case 1: // World 1: 1-10
          operations = levelInWorld <= 5 ? ['addition'] : ['addition', 'subtraction'];
          minNumber = 1;
          maxNumber = 5 + levelInWorld * 2;
          timeLimit = Math.max(8, 12 - Math.floor(levelInWorld * 0.4));
          break;

        case 2: // World 2: 11-20
          operations = ['addition', 'subtraction'];
          minNumber = 10;
          maxNumber = 20 + levelInWorld * 5;
          timeLimit = Math.max(7, 10 - Math.floor(levelInWorld * 0.3));
          break;

        case 3: // World 3: 21-30
          operations = ['multiplication'];
          minNumber = 2;
          maxNumber = Math.min(12, 3 + levelInWorld);
          timeLimit = Math.max(6, 9 - Math.floor(levelInWorld * 0.3));
          break;

        case 4: // World 4: 31-40
          operations = ['division'];
          minNumber = 2;
          maxNumber = 10 + levelInWorld * 3;
          timeLimit = Math.max(6, 9 - Math.floor(levelInWorld * 0.3));
          break;

        case 5: // World 5: 41-50
          operations = ['addition', 'subtraction', 'multiplication', 'division'];
          minNumber = 2;
          maxNumber = 25 + levelInWorld * 5;
          timeLimit = Math.max(6, 8 - Math.floor(levelInWorld * 0.2));
          break;

        case 6: // World 6: 51-60
          operations = ['bodmas', 'parentheses', 'mixed'];
          minNumber = 2;
          maxNumber = 40 + levelInWorld * 6;
          timeLimit = Math.max(5, 8 - Math.floor(levelInWorld * 0.3));
          break;

        case 7: // World 7: 61-70 (Speed Arena)
          operations = ['addition', 'subtraction', 'multiplication', 'division'];
          minNumber = 5;
          maxNumber = 35 + levelInWorld * 4;
          timeLimit = Math.max(2.8, 5.0 - (levelInWorld * 0.22));
          break;

        case 8: // World 8: 71-80 (Logic Math)
          operations = ['missing_number', 'pattern', 'logic'];
          minNumber = 2;
          maxNumber = 30 + levelInWorld * 5;
          timeLimit = Math.max(5.5, 9.0 - (levelInWorld * 0.35));
          break;

        case 9: // World 9: 81-90 (Master Challenge)
          operations = ['bodmas', 'mixed', 'missing_number', 'advanced'];
          minNumber = 10;
          maxNumber = 70 + levelInWorld * 8;
          timeLimit = Math.max(4.2, 7.0 - (levelInWorld * 0.28));
          break;

        case 10: // World 10: 91-100 (Infinity Championship)
          operations = ['addition', 'subtraction', 'multiplication', 'division', 'bodmas', 'missing_number', 'pattern', 'advanced'];
          minNumber = 15;
          maxNumber = 120 + levelInWorld * 10;
          timeLimit = Math.max(3.5, 6.0 - (levelInWorld * 0.25));
          break;
      }

      // Override with milestone specifics if applicable
      if (milestone) {
        timeLimit = milestone.timeLimit;
        questionCount = milestone.qCount;
      }

      // Rewards calculation: Exponentially higher rewards in higher worlds
      const baseXP = worldId * 150 + levelInWorld * 25;
      const baseCredits = worldId * 40 + levelInWorld * 10;

      const levelName = WORLD_LEVEL_NAMES[worldId] && WORLD_LEVEL_NAMES[worldId][levelInWorld - 1]
        ? WORLD_LEVEL_NAMES[worldId][levelInWorld - 1]
        : `Level ${id}`;

      list.push({
        id,
        world: worldId,
        levelInWorld,
        name: levelName,
        difficulty,
        questionCount,
        timeLimit: parseFloat(timeLimit.toFixed(1)),
        operations,
        minNumber,
        maxNumber,
        specialRule: milestone ? milestone.rule : null,
        specialBadge: milestone ? milestone.badge : null,
        rewards: {
          xp: milestone ? Math.round(baseXP * 1.5) : baseXP,
          credits: milestone ? Math.round(baseCredits * 1.5) : baseCredits
        }
      });
    }

    return list;
  }

  const LEVELS = buildLevels();

  /**
   * Public Levels Manager API
   */
  const LevelsEngine = {
    WORLDS,
    LEVELS,

    getAllLevels() {
      return LEVELS;
    },

    getLevelConfig(levelId) {
      const id = parseInt(levelId, 10);
      return LEVELS.find(l => l.id === id) || LEVELS[0];
    },

    getWorldLevels(worldId) {
      const wId = parseInt(worldId, 10);
      return LEVELS.filter(l => l.world === wId);
    },

    getWorldConfig(worldId) {
      const wId = parseInt(worldId, 10);
      return WORLDS.find(w => w.id === wId) || WORLDS[0];
    },

    getWorldForLevel(levelId) {
      const lvl = this.getLevelConfig(levelId);
      return this.getWorldConfig(lvl.world);
    },

    getTotalLevels() {
      return LEVELS.length;
    },

    /**
     * Extensibility method: dynamically register future levels (101, 102...)
     * without modifying core game loop.
     */
    registerLevel(customConfig) {
      if (!customConfig || !customConfig.id) return false;
      const existingIdx = LEVELS.findIndex(l => l.id === customConfig.id);
      if (existingIdx >= 0) {
        LEVELS[existingIdx] = customConfig;
      } else {
        LEVELS.push(customConfig);
        LEVELS.sort((a, b) => a.id - b.id);
      }
      return true;
    }
  };

  window.QuickMath = window.QuickMath || {};
  window.QuickMath.LevelsEngine = LevelsEngine;
})();

