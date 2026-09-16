/**
 * Automated Verification Script for Snake & Ladders Logic
 */

const assert = require('assert');

// 1. Serpentine Board Mapping Logic
function getCellCoords(cellNum, boardSize = 10) {
  if (cellNum < 1) cellNum = 1;
  if (cellNum > 100) cellNum = 100;
  const rowFromBottom = Math.floor((cellNum - 1) / boardSize);
  const rowY = (boardSize - 1) - rowFromBottom;
  const isEvenRow = (rowFromBottom % 2 === 0);
  const colRemainder = (cellNum - 1) % boardSize;
  const colX = isEvenRow ? colRemainder : (boardSize - 1) - colRemainder;
  return { col: colX, row: rowY, rowFromBottom };
}

console.log('Testing Board Coordinates...');
// Cell 1 must be bottom-left: rowY = 9, col = 0
const c1 = getCellCoords(1);
assert.strictEqual(c1.row, 9, 'Cell 1 must be at bottom row (row 9)');
assert.strictEqual(c1.col, 0, 'Cell 1 must be at column 0');

// Cell 10 must be bottom-right: rowY = 9, col = 9
const c10 = getCellCoords(10);
assert.strictEqual(c10.row, 9, 'Cell 10 must be at bottom row (row 9)');
assert.strictEqual(c10.col, 9, 'Cell 10 must be at column 9');

// Cell 11 must be row 8, col 9 (reversed)
const c11 = getCellCoords(11);
assert.strictEqual(c11.row, 8, 'Cell 11 must be at row 8');
assert.strictEqual(c11.col, 9, 'Cell 11 must be at column 9 (serpentine right)');

// Cell 20 must be row 8, col 0
const c20 = getCellCoords(20);
assert.strictEqual(c20.row, 8, 'Cell 20 must be at row 8');
assert.strictEqual(c20.col, 0, 'Cell 20 must be at column 0 (serpentine left)');

// Cell 91 must be row 0, col 9
const c91 = getCellCoords(91);
assert.strictEqual(c91.row, 0, 'Cell 91 must be at top row (row 0)');
assert.strictEqual(c91.col, 9, 'Cell 91 must be at column 9');

// Cell 100 must be row 0, col 0
const c100 = getCellCoords(100);
assert.strictEqual(c100.row, 0, 'Cell 100 must be at top row (row 0)');
assert.strictEqual(c100.col, 0, 'Cell 100 must be at column 0 (top-left)');

console.log('✔ Serpentine 10x10 mapping passed 100%');

// 2. Snakes and Ladders Graph Integrity
const SNAKES = {
  16: 6,
  47: 26,
  49: 11,
  56: 53,
  62: 19,
  64: 60,
  87: 34,
  92: 73,
  95: 75,
  98: 78
};

const LADDERS = {
  1: 38,
  4: 14,
  9: 31,
  21: 42,
  28: 84,
  36: 44,
  51: 67,
  71: 91,
  80: 100
};

console.log('Testing Snakes & Ladders Graph Integrity...');
// Every snake starts higher than it ends
for (const [head, tail] of Object.entries(SNAKES)) {
  const h = parseInt(head, 10);
  const t = parseInt(tail, 10);
  assert(h > t, `Snake head ${h} must be greater than tail ${t}`);
  assert(h <= 100 && t >= 1, `Snake boundaries must be valid (${h} -> ${t})`);
  assert(!LADDERS[h], `Snake head ${h} cannot also be a ladder bottom`);
  assert(!LADDERS[t], `Snake tail ${t} should not drop directly into a ladder bottom to avoid instant cascade`);
}

// Every ladder starts lower than it ends
for (const [bottom, top] of Object.entries(LADDERS)) {
  const b = parseInt(bottom, 10);
  const tp = parseInt(top, 10);
  assert(b < tp, `Ladder bottom ${b} must be lower than top ${tp}`);
  assert(b >= 1 && tp <= 100, `Ladder boundaries must be valid (${b} -> ${tp})`);
  assert(!SNAKES[b], `Ladder bottom ${b} cannot also be a snake head`);
  assert(!SNAKES[tp], `Ladder top ${tp} should not climb directly into a snake head`);
}

console.log('✔ Snakes & Ladders configuration passed 100% without cycles or conflicts');

// 3. Dice Randomness Distribution
console.log('Testing Dice Randomness over 12,000 rolls...');
const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
for (let i = 0; i < 12000; i++) {
  const val = Math.floor(Math.random() * 6) + 1;
  assert(val >= 1 && val <= 6, `Dice value ${val} out of bounds`);
  counts[val]++;
}
// Each face expected ~2000 times (between 1600 and 2400)
for (let face = 1; face <= 6; face++) {
  assert(counts[face] > 1600 && counts[face] < 2400, `Face ${face} count ${counts[face]} unexpected deviation`);
}
console.log('✔ Dice PRNG distribution verified:', counts);

// 4. Exact Finish Rule
console.log('Testing Exact Finish Rule...');
function canMove(currentPos, roll, exactFinish) {
  if (exactFinish && currentPos + roll > 100) {
    return { allowed: false, required: 100 - currentPos };
  }
  return { allowed: true, newPos: currentPos + roll };
}

const resOvershoot = canMove(97, 4, true);
assert.strictEqual(resOvershoot.allowed, false, 'Roll of 4 from 97 must be blocked with exact finish ON');
assert.strictEqual(resOvershoot.required, 3, 'Required roll from 97 must be 3');

const resWin = canMove(97, 3, true);
assert.strictEqual(resWin.allowed, true, 'Roll of 3 from 97 must be allowed');
assert.strictEqual(resWin.newPos, 100, 'Roll of 3 from 97 lands on 100');

console.log('✔ Exact finish rule verified');
console.log('====================================');
console.log('ALL UNIT LOGIC TESTS PASSED SUCCESSFULLY! 🚀');
console.log('====================================');
