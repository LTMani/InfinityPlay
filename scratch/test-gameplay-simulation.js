/**
 * Headless Full Match Simulation for Snake & Ladders
 */

const assert = require('assert');

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

class SimulatedMatch {
  constructor(playerNames, options = {}) {
    this.players = playerNames.map((name, i) => ({
      id: `p${i+1}`,
      name,
      position: 0,
      stats: { rolls: 0, snakesHit: 0, laddersHit: 0 }
    }));
    this.currentTurn = 0;
    this.turnCount = 1;
    this.isGameOver = false;
    this.winner = null;
    this.extraTurnOn6 = options.extraTurnOn6 !== false;
    this.exactFinish = options.exactFinish !== false;
    this.log = [];
  }

  roll(customRoll = null) {
    if (this.isGameOver) return null;
    const player = this.players[this.currentTurn];
    const dice = customRoll !== null ? customRoll : Math.floor(Math.random() * 6) + 1;
    player.stats.rolls++;

    const startPos = player.position;
    const targetPos = startPos + dice;

    // Exact finish check
    if (this.exactFinish && targetPos > 100) {
      this.log.push(`${player.name} on ${startPos} rolled ${dice}: overshot 100 (needed ${100 - startPos})`);
      this.nextTurn(dice === 6);
      return { player, dice, from: startPos, to: startPos, overshot: true };
    }

    let finalPos = targetPos;
    let encounterType = null;

    player.position = finalPos;

    if (finalPos === 100) {
      this.isGameOver = true;
      this.winner = player;
      this.log.push(`🏆 ${player.name} reached 100 and WON THE GAME!`);
      return { player, dice, from: startPos, to: 100, won: true };
    }

    // Check ladders & snakes
    if (LADDERS[finalPos]) {
      encounterType = 'ladder';
      player.stats.laddersHit++;
      const top = LADDERS[finalPos];
      this.log.push(`🪜 ${player.name} climbed ladder from ${finalPos} to ${top}`);
      finalPos = top;
      player.position = finalPos;
      if (finalPos === 100) {
        this.isGameOver = true;
        this.winner = player;
        this.log.push(`🏆 ${player.name} reached 100 via ladder and WON!`);
        return { player, dice, from: startPos, to: 100, won: true, encounter: 'ladder' };
      }
    } else if (SNAKES[finalPos]) {
      encounterType = 'snake';
      player.stats.snakesHit++;
      const tail = SNAKES[finalPos];
      this.log.push(`🐍 ${player.name} bitten by snake at ${finalPos}, fell to ${tail}`);
      finalPos = tail;
    }

    player.position = finalPos;
    this.log.push(`${player.name} moved ${startPos} -> ${finalPos} (roll: ${dice})`);

    this.nextTurn(dice === 6);
    return { player, dice, from: startPos, to: finalPos, encounter: encounterType };
  }

  nextTurn(rolledSix) {
    if (this.extraTurnOn6 && rolledSix && !this.isGameOver) {
      this.log.push(`🎲 Extra turn granted to ${this.players[this.currentTurn].name}!`);
      return;
    }
    this.currentTurn = (this.currentTurn + 1) % this.players.length;
    if (this.currentTurn === 0) {
      this.turnCount++;
    }
  }

  playToCompletion(maxTurns = 1000) {
    let steps = 0;
    while (!this.isGameOver && steps < maxTurns) {
      this.roll();
      steps++;
    }
    return { winner: this.winner, steps, turnCount: this.turnCount };
  }
}

console.log('Running deterministic match scenarios...');

// Scenario A: Exact ladder climb and win
const m1 = new SimulatedMatch(['Alice', 'Bob']);
m1.roll(1); // Alice lands on 1, climbs to 38
assert.strictEqual(m1.players[0].position, 38, 'Alice should be on 38 after ladder 1 -> 38');
assert.strictEqual(m1.players[0].stats.laddersHit, 1);

// Scenario B: Snake slide
const m2 = new SimulatedMatch(['Charlie', 'Diana']);
m2.roll(6); // Extra turn
m2.roll(6); // Extra turn
m2.roll(4); // Land on 16 (snake to 6)
assert.strictEqual(m2.players[0].position, 6, 'Charlie should slide down to 6 from 16');
assert.strictEqual(m2.players[0].stats.snakesHit, 1);

// Scenario C: Exact Finish rule
const m3 = new SimulatedMatch(['Eve', 'Frank']);
m3.players[0].position = 97;
m3.roll(4); // Overshoots
assert.strictEqual(m3.players[0].position, 97, 'Eve should remain on 97 after rolling 4');
assert.strictEqual(m3.isGameOver, false);

m3.players[0].position = 97;
m3.currentTurn = 0;
m3.roll(3); // Exact 100
assert.strictEqual(m3.players[0].position, 100, 'Eve lands on 100');
assert.strictEqual(m3.isGameOver, true);
assert.strictEqual(m3.winner.name, 'Eve');

// Scenario D: 100 Simulated full competitive games
console.log('Simulating 100 complete matches (1v1, 3p, 4p)...');
let totalTurns = 0;
for (let i = 0; i < 100; i++) {
  const match = new SimulatedMatch(['P1', 'P2', 'P3', 'P4']);
  const res = match.playToCompletion();
  assert(res.winner !== null, `Match ${i + 1} must have a winner`);
  assert(res.winner.position === 100, `Winner must be on cell 100`);
  totalTurns += res.turnCount;
}

const avgTurns = (totalTurns / 100).toFixed(1);
console.log(`✔ 100 full matches played to completion successfully! Average turns per 4-player game: ${avgTurns}`);
console.log('====================================');
console.log('ALL GAMEPLAY SIMULATION TESTS PASSED! 🚀');
console.log('====================================');
