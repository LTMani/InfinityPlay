const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

console.log('=== QUICK MATH: INFINITY CHALLENGE TEST SUITE ===\n');

const projectRoot = path.resolve(__dirname, '..');

// 1. Test Questions Generator
console.log('Test 1: QuestionEngine across all 10 levels...');
const questionsCode = fs.readFileSync(path.join(projectRoot, 'games/quick-math/js/questions.js'), 'utf8');
const questionsContext = { window: {}, Math };
vm.createContext(questionsContext);
vm.runInContext(questionsCode, questionsContext);
const QuestionEngine = questionsContext.window.QuickMath?.QuestionEngine;

assert(QuestionEngine, 'QuickMath.QuestionEngine module should be defined on window');

for (let lvl = 1; lvl <= 10; lvl++) {
  for (let i = 0; i < 100; i++) {
    const q = QuestionEngine.generateQuestion(lvl);
    assert(q.question && typeof q.question === 'string', `Level ${lvl} question text must be non-empty string`);
    assert(typeof q.correctAnswer === 'number' && Number.isFinite(q.correctAnswer), `Level ${lvl} correctAnswer must be finite number, got: ${q.correctAnswer}`);
    assert(Array.isArray(q.options), `Level ${lvl} options must be array`);
    assert.strictEqual(q.options.length, 4, `Level ${lvl} options must have length 4`);
    const unique = new Set(q.options);
    assert.strictEqual(unique.size, 4, `Level ${lvl} options must all be unique: [${q.options.join(', ')}] for question "${q.question}"`);
    assert(q.options.includes(q.correctAnswer), `Level ${lvl} options must contain correctAnswer ${q.correctAnswer}: [${q.options.join(', ')}]`);
  }
}
console.log('  ✓ Generated 1,000 questions (100 per level 1-10). All 1,000 valid, 4 unique options, answer present.');

// Test Daily Seeded RNG
console.log('Test 2: Daily Challenge Seeded RNG...');
const daily1 = QuestionEngine.generateDailyChallenge('2026-09-16');
const daily2 = QuestionEngine.generateDailyChallenge('2026-09-16');
const daily3 = QuestionEngine.generateDailyChallenge('2026-09-17');

assert.strictEqual(daily1.questions.length, 10, 'Daily challenge should have 10 questions');
assert.strictEqual(daily1.questions[0].question, daily2.questions[0].question, 'Daily challenge question on same date must be identical');
assert.deepStrictEqual([...daily1.questions[0].options], [...daily2.questions[0].options], 'Daily challenge options on same date must be identical');
console.log(`  Daily 2026-09-16 Q1: ${daily1.questions[0].question} (ans: ${daily1.questions[0].correctAnswer})`);
console.log(`  Daily 2026-09-17 Q1: ${daily3.questions[0].question} (ans: ${daily3.questions[0].correctAnswer})`);
console.log('  ✓ Daily challenge determinism verified.');

// 2. Test Scoring Engine
console.log('Test 3: Scoring Engine...');
const scoringCode = fs.readFileSync(path.join(projectRoot, 'games/quick-math/js/scoring.js'), 'utf8');
const scoringContext = { window: {}, Math };
vm.createContext(scoringContext);
vm.runInContext(scoringCode, scoringContext);
const Scoring = scoringContext.window.QuickMath?.Scoring;

assert(Scoring, 'QuickMath.Scoring module should be defined');

// Accuracy edge cases
assert.strictEqual(Scoring.calculateAccuracy(0, 0), 0, '0 questions should be 0% accuracy, not NaN');
assert.strictEqual(Scoring.calculateAccuracy(5, 10), 50, '5/10 should be 50%');
assert.strictEqual(Scoring.calculateAccuracy(10, 10), 100, '10/10 should be 100%');

// Points calculation
const pointsFast = Scoring.calculateScore(8.5, 10, 5); // 8.5s left out of 10, streak 5
assert(pointsFast.totalEarned > 100, 'Fast answer with streak should award bonus points');
assert(pointsFast.speedBonus > 0, 'Speed bonus should be > 0');
assert.strictEqual(pointsFast.multiplier, 3.0, 'Streak of 5 should give 3.0x multiplier');

// Star rating
assert.strictEqual(Scoring.evaluateStars(2000, 95, 10), 3);
assert.strictEqual(Scoring.evaluateStars(1300, 75, 10), 2);
assert.strictEqual(Scoring.evaluateStars(800, 60, 10), 1);
assert.strictEqual(Scoring.evaluateStars(400, 30, 10), 0);
console.log('  ✓ Scoring calculations, accuracy edge cases, and multipliers verified.');

// 3. Test Save Manager
console.log('Test 4: Save Manager & LocalStorage...');
const mockStorage = {};
const saveCode = fs.readFileSync(path.join(projectRoot, 'games/quick-math/js/save.js'), 'utf8');
const saveContext = {
  window: {
    dispatchEvent: () => {}
  },
  CustomEvent: class { constructor(name, opts) { this.name = name; this.detail = opts?.detail; } },
  localStorage: {
    getItem: (key) => mockStorage[key] || null,
    setItem: (key, val) => { mockStorage[key] = String(val); },
    removeItem: (key) => { delete mockStorage[key]; }
  },
  Date,
  JSON,
  console: { warn: () => {}, log: () => {} }
};
vm.createContext(saveContext);
vm.runInContext(saveCode, saveContext);
const SaveManager = saveContext.window.QuickMath?.SaveManager;

assert(SaveManager, 'SaveManager should be defined');
SaveManager.init();
const initialData = SaveManager.getData();
assert(typeof initialData.levelStars === 'object', 'Initial levelStars should be an object');
assert.strictEqual(initialData.unlockedLevels, 1, 'Level 1 unlocked by default');

// Save level progress
SaveManager.saveLevelResult(1, 1200, 3);
const afterLvl1 = SaveManager.getData();
assert.strictEqual(afterLvl1.levelStars[1], 3, 'Level 1 stars should be 3');
assert.strictEqual(afterLvl1.unlockedLevels, 2, 'Level 2 should now be unlocked');

// Save Highscore
SaveManager.saveModeHighScore('time_attack', 4500);
assert.strictEqual(SaveManager.getData().modeHighScores.time_attack, 4500);

// Check achievements
SaveManager.unlockAchievement('SPEED_DEMON');
assert(SaveManager.getData().achievements['SPEED_DEMON']);

// Corrupted JSON resiliency
mockStorage['infinityplay_quick_math'] = 'CORRUPTED{{JSON';
SaveManager.init();
const fallbackData = SaveManager.getData();
assert(fallbackData && fallbackData.unlockedLevels >= 1, 'Corrupted JSON should cleanly fallback to default');
console.log('  ✓ Save manager, progress unlocking, high scores, and error resiliency verified.');

// 4. Test Catalog Integration
console.log('Test 5: Catalog and Server Integration...');
const gamesDataCode = fs.readFileSync(path.join(projectRoot, 'js/data/games-data.js'), 'utf8');
const gamesContext = { window: {} };
vm.createContext(gamesContext);
vm.runInContext(gamesDataCode, gamesContext);
const gamesData = gamesContext.window.InfinityPlay.gamesData;

const quickMathInCatalog = gamesData.find(g => g.id === 'quick-math');
assert(quickMathInCatalog, 'quick-math must be present in js/data/games-data.js');
assert.strictEqual(quickMathInCatalog.category, 'Puzzle');
assert.strictEqual(quickMathInCatalog.gameUrl, 'games/quick-math/index.html');
assert.strictEqual(quickMathInCatalog.playMode, 'embed');

const storeCode = fs.readFileSync(path.join(projectRoot, 'server/data/store.js'), 'utf8');
assert(storeCode.includes("id: 'quick-math'"), 'quick-math must be present in server/data/store.js');

const categoriesCode = fs.readFileSync(path.join(projectRoot, 'js/data/categories-data.js'), 'utf8');
const catContext = { window: {} };
vm.createContext(catContext);
vm.runInContext(categoriesCode + '\nwindow.categoriesData = categoriesData;', catContext);
const puzzleCat = catContext.window.categoriesData.find(c => c.id === 'puzzle');
assert(puzzleCat, 'Puzzle category must exist');
assert.strictEqual(puzzleCat.gameCount, 5, 'Puzzle category gameCount should be 5');

// Check all assets referenced by quick-math exist
const htmlPath = path.join(projectRoot, quickMathInCatalog.gameUrl);
assert(fs.existsSync(htmlPath), `Game index.html must exist at ${htmlPath}`);

const thumbPath = path.join(projectRoot, quickMathInCatalog.thumbnail);
assert(fs.existsSync(thumbPath), `Game thumbnail must exist at ${thumbPath}`);

const topThumbPath = path.join(projectRoot, quickMathInCatalog.topThumbnail);
assert(fs.existsSync(topThumbPath), `Game top thumbnail must exist at ${topThumbPath}`);

const logoPath = path.join(projectRoot, 'games/quick-math/assets/images/logo.svg');
assert(fs.existsSync(logoPath), `Game logo must exist at ${logoPath}`);

console.log('  ✓ All catalog entries, categories, and asset files verified.');

// 5. Total game count check
console.log('Test 6: Total Game Count...');
console.log(`  Total games in gamesData: ${gamesData.length}`);
assert.strictEqual(gamesData.length, 14, 'Total games count in gamesData should be 14');

console.log('\nALL QUICK MATH TESTS PASSED SUCCESSFULLY! ✓✓✓');
