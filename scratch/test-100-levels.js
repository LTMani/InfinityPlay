const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

console.log('=== 100-LEVEL PROGRESSION SYSTEM VALIDATION SUITE ===\n');

const projectRoot = path.resolve(__dirname, '..');

// Setup VM context
const context = {
  window: {
    matchMedia: () => ({ matches: false }),
    dispatchEvent: () => {}
  },
  localStorage: {},
  Date,
  JSON,
  Math,
  performance: { now: () => Date.now() },
  console: { log: () => {}, warn: () => {}, error: () => {} },
  CustomEvent: class { constructor(name, opts) { this.name = name; this.detail = opts?.detail; } }
};
vm.createContext(context);

// Load scripts in dependency order
const scripts = [
  'games/quick-math/js/save.js',
  'games/quick-math/js/audio.js',
  'games/quick-math/js/effects.js',
  'games/quick-math/js/levels.js',
  'games/quick-math/js/questions.js',
  'games/quick-math/js/scoring.js',
  'games/quick-math/js/game.js'
];

for (const scriptPath of scripts) {
  const code = fs.readFileSync(path.join(projectRoot, scriptPath), 'utf8');
  vm.runInContext(code, context);
}

const { LevelsEngine, QuestionEngine, SaveManager, Scoring, GameManager, MODES } = context.window.QuickMath;

// 1. Verify Levels and Worlds Architecture
console.log('Test 1: LevelsEngine Architecture & 100 Levels Configuration...');
assert(LevelsEngine, 'LevelsEngine must be defined on window.QuickMath');
assert.strictEqual(LevelsEngine.WORLDS.length, 10, 'Must have exactly 10 Worlds');
assert.strictEqual(LevelsEngine.LEVELS.length, 100, 'Must have at least 100 Levels configured');

const milestoneLevels = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
for (let id = 1; id <= 100; id++) {
  const cfg = LevelsEngine.getLevelConfig(id);
  assert(cfg, `Level ${id} config must exist`);
  assert.strictEqual(cfg.id, id, `Level ${id} id must match`);
  assert(cfg.world >= 1 && cfg.world <= 10, `Level ${id} world must be between 1 and 10, got: ${cfg.world}`);
  assert(cfg.name && typeof cfg.name === 'string', `Level ${id} must have a name`);
  assert(cfg.difficulty >= 1 && cfg.difficulty <= 10, `Level ${id} difficulty must be between 1 and 10`);
  assert(cfg.questionCount >= 10, `Level ${id} question count must be at least 10`);
  assert(cfg.timeLimit > 0, `Level ${id} timeLimit must be positive`);
  assert(Array.isArray(cfg.operations) && cfg.operations.length > 0, `Level ${id} operations must be non-empty array`);
  assert(cfg.rewards && cfg.rewards.xp > 0 && cfg.rewards.credits > 0, `Level ${id} must award XP and credits`);

  if (milestoneLevels.includes(id)) {
    assert(cfg.specialRule, `Milestone Level ${id} must have a specialRule`);
    assert(cfg.specialBadge, `Milestone Level ${id} must have a specialBadge`);
  }
}
console.log('  ✓ All 10 Worlds & 100 Levels configured with valid schemas and milestone rules.');

// 2. Stress Test Question Generation across all 100 levels
console.log('Test 2: Generating questions across all 100 levels (30 Qs/level = 3,000 equations)...');
let totalGenerated = 0;
for (let id = 1; id <= 100; id++) {
  const cfg = LevelsEngine.getLevelConfig(id);
  for (let qIdx = 0; qIdx < 30; qIdx++) {
    const q = QuestionEngine.generateQuestion(cfg);
    assert(q.question && typeof q.question === 'string', `Level ${id} Q${qIdx} question string missing`);
    assert(typeof q.correctAnswer === 'number' && Number.isFinite(q.correctAnswer), `Level ${id} Q${qIdx} invalid answer: ${q.correctAnswer}`);
    assert(Array.isArray(q.options), `Level ${id} Q${qIdx} options must be array`);
    assert.strictEqual(q.options.length, 4, `Level ${id} Q${qIdx} options must have length 4`);
    
    const unique = new Set(q.options);
    assert.strictEqual(unique.size, 4, `Level ${id} Q${qIdx} options must be unique. Got: [${q.options.join(', ')}] for question "${q.question}"`);
    assert(q.options.includes(q.correctAnswer), `Level ${id} Q${qIdx} options must include correct answer ${q.correctAnswer}`);

    totalGenerated++;
  }
}
console.log(`  ✓ Successfully generated and verified ${totalGenerated.toLocaleString()} questions with 4 unique options!`);

// 3. Test Logic Math & Patterns explicitly (World 8)
console.log('Test 3: Logic Math & Sequences Verification...');
const world8Levels = LevelsEngine.getWorldLevels(8);
assert.strictEqual(world8Levels.length, 10, 'World 8 must have 10 levels');
let missingNumCount = 0;
let patternCount = 0;

for (let i = 0; i < 100; i++) {
  const q = QuestionEngine.generateQuestion(75); // Level 75 in World 8
  if (q.question.includes('?')) {
    if (q.question.includes(',')) patternCount++;
    else missingNumCount++;
  }
}
assert(missingNumCount > 0 || patternCount > 0, 'World 8 must generate missing number or pattern questions');
console.log(`  ✓ World 8 logic questions verified (${missingNumCount} missing-number, ${patternCount} pattern questions generated).`);

// 4. Test Progression, Unlocking, and Replay Non-Regression
console.log('Test 4: Progression Unlocking & Replay Non-Regression...');
const mockStorage = {};
context.localStorage = {
  getItem: (k) => mockStorage[k] || null,
  setItem: (k, v) => { mockStorage[k] = String(v); },
  removeItem: (k) => { delete mockStorage[k]; }
};

SaveManager.init();
assert.strictEqual(SaveManager.isLevelUnlocked(1), true, 'Level 1 must be unlocked initially');
assert.strictEqual(SaveManager.isLevelUnlocked(2), false, 'Level 2 must be locked initially');
assert.strictEqual(SaveManager.isWorldUnlocked(1), true, 'World 1 must be unlocked initially');
assert.strictEqual(SaveManager.isWorldUnlocked(2), false, 'World 2 must be locked initially');

// Complete Level 1 with 3 stars and 1,500 score
SaveManager.saveLevelResult(1, 1500, 3, 100, 1.2, 200, 50);
assert.strictEqual(SaveManager.isLevelUnlocked(2), true, 'Level 2 must now be unlocked');
assert.strictEqual(SaveManager.getLevelStars(1), 3);
assert.strictEqual(SaveManager.getLevelHighScore(1), 1500);
assert.strictEqual(SaveManager.getLevelBestAccuracy(1), 100);
assert.strictEqual(SaveManager.getLevelBestTime(1), 1.2);

// Replay Level 1 with worse performance (1 star, 800 score, 60% accuracy, 3.5s time)
SaveManager.saveLevelResult(1, 800, 1, 60, 3.5, 200, 50);
// Verify personal best was NOT downgraded
assert.strictEqual(SaveManager.getLevelStars(1), 3, 'Stars must NOT decrease on worse replay');
assert.strictEqual(SaveManager.getLevelHighScore(1), 1500, 'Score must NOT decrease on worse replay');
assert.strictEqual(SaveManager.getLevelBestAccuracy(1), 100, 'Accuracy must NOT decrease on worse replay');
assert.strictEqual(SaveManager.getLevelBestTime(1), 1.2, 'Best time must NOT worsen on slower replay');

// Replay Level 1 with better score (1,800 score, 1.0s time)
SaveManager.saveLevelResult(1, 1800, 3, 100, 1.0, 200, 50);
assert.strictEqual(SaveManager.getLevelHighScore(1), 1800, 'Score must update when higher');
assert.strictEqual(SaveManager.getLevelBestTime(1), 1.0, 'Best time must update when faster');

// Fast-forward complete Level 10
SaveManager.saveLevelResult(10, 2200, 3, 95, 1.5, 300, 80);
assert.strictEqual(SaveManager.isLevelUnlocked(11), true, 'Level 11 must unlock after completing Level 10');
assert.strictEqual(SaveManager.isWorldUnlocked(2), true, 'World 2 must unlock after completing Level 10');

// Complete Level 100
assert.strictEqual(SaveManager.isInfinityModeUnlocked(), false, 'Infinity Mode must be locked before Level 100');
SaveManager.saveLevelResult(100, 5000, 3, 100, 1.1, 1500, 500);
assert.strictEqual(SaveManager.isInfinityModeUnlocked(), true, 'Infinity Mode must unlock after Level 100');
console.log('  ✓ Progression, locking, non-regression replays, and Infinity Mode unlock verified.');

// 5. Test Extensibility (Adding Level 101+)
console.log('Test 5: Extensibility Architecture (Adding Level 101)...');
const customLevel101 = {
  id: 101,
  world: 10,
  levelInWorld: 11,
  name: 'Beyond the Void',
  difficulty: 10,
  questionCount: 25,
  timeLimit: 3.0,
  operations: ['addition', 'multiplication', 'missing_number'],
  minNumber: 20,
  maxNumber: 150,
  specialRule: 'DOUBLE_SPEED',
  specialBadge: 'EXTENDED',
  rewards: { xp: 2000, credits: 600 }
};
const registered = LevelsEngine.registerLevel(customLevel101);
assert.strictEqual(registered, true, 'Custom level must register cleanly');
assert.strictEqual(LevelsEngine.getTotalLevels(), 101, 'Total levels should now be 101');
const fetched101 = LevelsEngine.getLevelConfig(101);
assert.strictEqual(fetched101.name, 'Beyond the Void');

const q101 = QuestionEngine.generateQuestion(fetched101);
assert(q101 && q101.options.length === 4, 'Question generator must seamlessly generate for Level 101');
console.log('  ✓ Extensibility confirmed: Level 101 registered and generated without changing game logic.');

console.log('\nALL 100-LEVEL PROGRESSION TESTS PASSED FLAWLESSLY! ✓✓✓');
