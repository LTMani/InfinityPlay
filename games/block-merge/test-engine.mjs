import { GameEngine } from "./js/GameEngine.js";

function assert(condition, message) {
  if (!condition) {
    console.error("FAIL:", message);
    process.exit(1);
  } else {
    console.log("PASS:", message);
  }
}

console.log("=== Running 2048 Core Engine Verification Suite ===");

const engine = new GameEngine(4);

// Test 1: Start New Game spawns exactly 2 tiles
engine.startNewGame();
let tileCount = 0;
for (let r = 0; r < 4; r++) {
  for (let c = 0; c < 4; c++) {
    if (engine.grid[r][c]) tileCount++;
  }
}
assert(tileCount === 2, "Start new game spawns exactly 2 tiles");

// Test 2: 2 + 2 + 2 moving LEFT becomes 4 + 2 (NOT 8)
engine.initGrid();
engine.grid[0][0] = { id: 't1', r: 0, c: 0, value: 2 };
engine.grid[0][1] = { id: 't2', r: 0, c: 1, value: 2 };
engine.grid[0][2] = { id: 't3', r: 0, c: 2, value: 2 };
engine.score = 0;
// We disable random spawning during direct slideLine test or check row values
const slideRes1 = engine.slideLine([
  { value: 2 },
  { value: 2 },
  { value: 2 },
  null
]);
assert(slideRes1.result.length === 2, "2+2+2 merges into 2 tiles");
assert(slideRes1.result[0].value === 4 && slideRes1.result[1].value === 2, "2+2+2 becomes 4+2, NOT 8");
assert(slideRes1.scoreGained === 4, "Score gained for 2+2 merge is 4");

// Test 3: 2 + 2 + 2 + 2 moving LEFT becomes 4 + 4 (NOT 8)
const slideRes2 = engine.slideLine([
  { value: 2 },
  { value: 2 },
  { value: 2 },
  { value: 2 }
]);
assert(slideRes2.result.length === 2, "2+2+2+2 merges into 2 tiles");
assert(slideRes2.result[0].value === 4 && slideRes2.result[1].value === 4, "2+2+2+2 becomes 4+4, NOT 8");
assert(slideRes2.scoreGained === 8, "Score gained for 2+2+2+2 is 8 (4+4)");

// Test 4: No double merging in one move: 4 + 2 + 2 -> 4 + 4 (NOT 8)
const slideRes3 = engine.slideLine([
  { value: 4 },
  { value: 2 },
  { value: 2 },
  null
]);
assert(slideRes3.result.length === 2, "4+2+2 becomes 4+4");
assert(slideRes3.result[0].value === 4 && slideRes3.result[1].value === 4, "First 4 remains, 2+2 merges to 4");
assert(slideRes3.scoreGained === 4, "Score gained is 4");

// Test 5: Full Move LEFT on grid
engine.initGrid();
engine.grid[1][0] = { id: 'a', r: 1, c: 0, value: 2 };
engine.grid[1][1] = { id: 'b', r: 1, c: 1, value: 2 };
const moveRes = engine.move('left');
assert(moveRes.moved === true, "Move left was valid");
assert(engine.grid[1][0].value === 4, "Grid[1][0] is merged to 4");
assert(engine.score === 4, "Score updated to 4");
assert(engine.previousState !== null, "Undo snapshot was created");

// Test 6: Undo restores exact previous state
const undoSuccess = engine.undo();
assert(undoSuccess === true, "Undo executed successfully");
assert(engine.score === 0, "Score restored to 0 on undo");
assert(engine.grid[1][0].value === 2 && engine.grid[1][1].value === 2, "Original 2 and 2 restored");
assert(engine.previousState === null, "Previous state cleared after 1 undo");

// Test 7: Invalid move does NOT spawn or change board
engine.initGrid();
engine.grid[0][0] = { id: 'a', r: 0, c: 0, value: 2 };
engine.grid[1][0] = { id: 'b', r: 1, c: 0, value: 4 };
const invalidMove = engine.move('left');
assert(invalidMove.moved === false, "Moving left when against edge is invalid");
assert(invalidMove.newlySpawned === null, "No tile spawned on invalid move");

// Test 8: Game Over detection
engine.initGrid();
let val = 2;
for (let r = 0; r < 4; r++) {
  for (let c = 0; c < 4; c++) {
    // Alternating checkerboard without any adjacent matches:
    // e.g. 2 4 2 4 / 4 2 4 2 / 2 4 2 4 / 4 2 4 2
    engine.grid[r][c] = { id: `c_${r}_${c}`, r, c, value: (r + c) % 2 === 0 ? 2 : 4 };
  }
}
assert(engine.checkGameOver() === true, "Board full with no adjacent matches correctly detected as Game Over");

// Test 9: Win 2048 detection
engine.initGrid();
engine.grid[0][0] = { id: 'w1', r: 0, c: 0, value: 1024 };
engine.grid[0][1] = { id: 'w2', r: 0, c: 1, value: 1024 };
const winMove = engine.move('left');
assert(winMove.newlyReached2048 === true, "Creating 2048 tile triggers win event");
assert(engine.hasWon === true, "hasWon set to true");

console.log("=== ALL UNIT TESTS PASSED! ===");
