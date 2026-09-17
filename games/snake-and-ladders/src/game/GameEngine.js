// GameEngine.js - Core State Machine and Deterministic Rules

import { BOARD_CONFIG, getSquareCoordinates } from './BoardData.js';

export const GAME_STATES = {
  MENU: 'MENU',
  IDLE: 'IDLE',
  ROLLING: 'ROLLING',
  MOVING: 'MOVING',
  LADDER: 'LADDER',
  SNAKE: 'SNAKE',
  GAME_OVER: 'GAME_OVER',
  PAUSED: 'PAUSED'
};

export class GameEngine {
  constructor() {
    this.state = GAME_STATES.MENU;
    this.previousState = GAME_STATES.MENU;
    this.players = [];
    this.currentPlayerIndex = 0;
    this.diceValue = 1;
    this.winner = null;
    this.totalTurns = 0;
    this.isVsAI = false;
    this.aiDifficulty = 'medium';
    this.history = [];

    // Listeners / Callbacks
    this.listeners = {
      stateChange: [],
      diceRoll: [],
      stepMove: [],
      ladderClimb: [],
      snakeSlide: [],
      turnChange: [],
      gameOver: [],
      message: []
    };
  }

  on(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event].push(callback);
    }
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data));
    }
  }

  setState(newState) {
    this.previousState = this.state;
    this.state = newState;
    this.emit('stateChange', { state: this.state, previousState: this.previousState });
  }

  logMessage(text, type = 'info') {
    this.emit('message', { text, type, timestamp: Date.now() });
  }

  startNewGame({ numPlayers = 2, isVsAI = false, aiDifficulty = 'medium', customNames = [] }) {
    this.isVsAI = isVsAI;
    this.aiDifficulty = aiDifficulty;
    this.winner = null;
    this.totalTurns = 0;
    this.currentPlayerIndex = 0;
    this.history = [];

    this.players = [];
    for (let i = 0; i < numPlayers; i++) {
      const colorDef = BOARD_CONFIG.playerColors[i % BOARD_CONFIG.playerColors.length];
      const isAI = isVsAI && i > 0;
      const defaultName = isAI ? `AI Player ${i + 1}` : `Player ${i + 1}`;
      const name = customNames[i] || defaultName;

      this.players.push({
        id: i,
        name,
        color: colorDef.name,
        colorHex: colorDef.hex,
        emissiveHex: colorDef.emissive,
        isAI,
        position: 1, // Start at square 1
        previousPosition: 1,
        turns: 0,
        laddersClimbed: 0,
        snakesBitten: 0
      });
    }

    this.setState(GAME_STATES.IDLE);
    this.logMessage(`Game started! ${this.players[0].name}'s turn. Roll the dice!`, 'highlight');
    this.emit('turnChange', { player: this.getCurrentPlayer() });
  }

  getCurrentPlayer() {
    return this.players[this.currentPlayerIndex];
  }

  canRoll() {
    return this.state === GAME_STATES.IDLE && !this.winner;
  }

  rollDice(presetValue = null) {
    if (!this.canRoll()) return null;

    this.setState(GAME_STATES.ROLLING);
    const rolled = presetValue !== null ? presetValue : Math.floor(Math.random() * 6) + 1;
    this.diceValue = rolled;

    const player = this.getCurrentPlayer();
    player.turns++;
    this.totalTurns++;

    this.logMessage(`${player.name} is rolling the dice...`, 'info');

    return rolled;
  }

  announceRoll(rolled = this.diceValue) {
    const player = this.getCurrentPlayer();
    this.emit('diceRoll', { player, value: rolled });
    this.logMessage(`${player.name} rolled a ${rolled}!`, 'action');
  }

  async processMove(rolledValue) {
    const player = this.getCurrentPlayer();
    const currentPos = player.position;
    const targetPos = currentPos + rolledValue;

    // Rule: Exact roll required to reach 100
    if (targetPos > 100) {
      this.logMessage(`${player.name} needed an exact roll to reach 100! Stays at ${currentPos}.`, 'warning');
      await this.wait(1000);
      this.finishTurn();
      return;
    }

    this.setState(GAME_STATES.MOVING);

    // Generate step by step sequence
    const path = [];
    for (let pos = currentPos + 1; pos <= targetPos; pos++) {
      path.push(pos);
    }

    for (let i = 0; i < path.length; i++) {
      const stepSquare = path[i];
      player.position = stepSquare;
      this.emit('stepMove', { player, square: stepSquare, stepIndex: i, totalSteps: path.length });
      await this.wait(350); // Natural hop pace
    }

    // Check Win at 100
    if (player.position === 100) {
      this.handleVictory(player);
      return;
    }

    // Check Ladder
    if (BOARD_CONFIG.ladders[player.position]) {
      const ladderTop = BOARD_CONFIG.ladders[player.position];
      this.setState(GAME_STATES.LADDER);
      player.laddersClimbed++;
      this.logMessage(`${player.name} climbed a ladder from ${player.position} to ${ladderTop}!`, 'success');
      
      this.emit('ladderClimb', {
        player,
        fromSquare: player.position,
        toSquare: ladderTop
      });

      player.position = ladderTop;
      await this.wait(1400); // Ladder climb duration

      if (player.position === 100) {
        this.handleVictory(player);
        return;
      }
    }
    // Check Snake
    else if (BOARD_CONFIG.snakes[player.position]) {
      const snakeTail = BOARD_CONFIG.snakes[player.position];
      this.setState(GAME_STATES.SNAKE);
      player.snakesBitten++;
      this.logMessage(`Oh no! ${player.name} got bitten by a snake at ${player.position} and slid down to ${snakeTail}!`, 'danger');

      this.emit('snakeSlide', {
        player,
        fromSquare: player.position,
        toSquare: snakeTail
      });

      player.position = snakeTail;
      await this.wait(1600); // Snake slide duration
    }

    await this.wait(500);
    this.finishTurn();
  }

  handleVictory(player) {
    this.winner = player;
    this.setState(GAME_STATES.GAME_OVER);
    this.logMessage(`🎉 ${player.name} reached square 100 and WON the game!`, 'celebrate');
    this.emit('gameOver', {
      winner: player,
      totalTurns: this.totalTurns,
      players: this.players
    });
  }

  finishTurn() {
    if (this.state === GAME_STATES.GAME_OVER) return;

    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    this.setState(GAME_STATES.IDLE);

    const nextPlayer = this.getCurrentPlayer();
    this.emit('turnChange', { player: nextPlayer });
    this.logMessage(`It is now ${nextPlayer.name}'s turn.`, 'info');
  }

  pause() {
    if (this.state !== GAME_STATES.PAUSED) {
      this.previousState = this.state;
      this.state = GAME_STATES.PAUSED;
      this.emit('stateChange', { state: this.state, previousState: this.previousState });
      this.logMessage('Game paused.', 'info');
    }
  }

  resume() {
    if (this.state === GAME_STATES.PAUSED) {
      this.state = this.previousState || GAME_STATES.IDLE;
      this.emit('stateChange', { state: this.state, previousState: this.previousState });
      this.logMessage('Game resumed.', 'info');
    }
  }

  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
