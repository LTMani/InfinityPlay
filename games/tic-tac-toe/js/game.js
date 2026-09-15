/**
 * Tic-Tac-Toe: Ultimate Arena - Game Controller & State Machine
 * Single Source of Truth managing board, turns, scoring, keyboard navigation, and rules
 */

(function() {
  'use strict';

  const WIN_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  const CELL_NAMES = [
    'Top Left', 'Top Center', 'Top Right',
    'Middle Left', 'Center', 'Middle Right',
    'Bottom Left', 'Bottom Center', 'Bottom Right'
  ];

  class GameController {
    constructor() {
      this.state = this.getInitialState();
      this.focusedCellIndex = 4; // Start at center for keyboard nav
      this.callbacks = {};
      this.isAIThinking = false;
      this.pausedAIResume = null;
    }

    getInitialState() {
      return {
        board: Array(9).fill(null),
        currentPlayer: 'X',
        mode: 'AI', // 'AI', 'PVP', 'DEMO'
        difficulty: 'medium',
        playerSymbol: 'X',
        opponentSymbol: 'O',
        firstMove: 'PLAYER', // 'PLAYER', 'AI', 'RANDOM'
        currentLevel: null,
        gameStatus: 'idle', // 'idle', 'playing', 'paused', 'ended'
        round: 1,
        scores: {
          player: 0,
          opponent: 0,
          draws: 0
        },
        streak: 0,
        winner: null,
        winningLine: null,
        moveCount: 0,
        playerMoves: 0
      };
    }

    on(event, handler) {
      if (!this.callbacks[event]) this.callbacks[event] = [];
      this.callbacks[event].push(handler);
    }

    emit(event, data) {
      if (this.callbacks[event]) {
        this.callbacks[event].forEach(fn => fn(data));
      }
    }

    // Start a fresh match session
    startMatch(config = {}) {
      if (window.TTTAI) window.TTTAI.cancelThinking();
      if (window.TTTEffects) window.TTTEffects.clear();

      this.isAIThinking = false;
      this.pausedAIResume = null;

      const playerSymbol = config.playerSymbol || 'X';
      const opponentSymbol = playerSymbol === 'X' ? 'O' : 'X';
      const mode = config.mode || 'AI';
      const difficulty = config.difficulty || 'medium';
      const currentLevel = config.level || null;
      const firstMove = config.firstMove || 'PLAYER';

      // Load existing streak from SaveManager if playing campaign/AI
      let currentStreak = 0;
      if (window.TTTSave && mode === 'AI') {
        currentStreak = window.TTTSave.data.stats.winStreak || 0;
      }

      this.state = {
        board: Array(9).fill(null),
        currentPlayer: 'X',
        mode: mode,
        difficulty: difficulty,
        playerSymbol: playerSymbol,
        opponentSymbol: opponentSymbol,
        firstMove: firstMove,
        currentLevel: currentLevel,
        gameStatus: 'playing',
        round: config.round || 1,
        scores: config.scores || { player: 0, opponent: 0, draws: 0 },
        streak: currentStreak,
        winner: null,
        winningLine: null,
        moveCount: 0,
        playerMoves: 0
      };

      // Determine who moves first
      let startingPlayer = 'X';
      if (mode === 'AI') {
        if (firstMove === 'AI') {
          startingPlayer = opponentSymbol;
        } else if (firstMove === 'RANDOM') {
          startingPlayer = Math.random() < 0.5 ? playerSymbol : opponentSymbol;
        } else {
          startingPlayer = playerSymbol;
        }
      }

      this.state.currentPlayer = startingPlayer;
      this.emit('stateChanged', this.state);
      this.announce(`Match started. Round ${this.state.round}. ${startingPlayer === playerSymbol ? 'Your move' : 'Opponent move'}.`);

      // If AI goes first
      if (this.isCurrentTurnAI()) {
        this.triggerAIMove();
      }
    }

    restartRound() {
      if (window.TTTAI) window.TTTAI.cancelThinking();
      if (window.TTTEffects) window.TTTEffects.clear();

      this.isAIThinking = false;
      this.pausedAIResume = null;

      this.state.board = Array(9).fill(null);
      this.state.gameStatus = 'playing';
      this.state.winner = null;
      this.state.winningLine = null;
      this.state.moveCount = 0;
      this.state.playerMoves = 0;

      // Starting turn alternates or follows setup
      let startingPlayer = this.state.playerSymbol;
      if (this.state.mode === 'AI') {
        if (this.state.firstMove === 'AI') startingPlayer = this.state.opponentSymbol;
        else if (this.state.firstMove === 'RANDOM') startingPlayer = Math.random() < 0.5 ? this.state.playerSymbol : this.state.opponentSymbol;
      }

      this.state.currentPlayer = startingPlayer;
      this.emit('stateChanged', this.state);
      this.announce(`Round restarted. ${startingPlayer === this.state.playerSymbol ? 'Your move' : 'Opponent move'}.`);

      if (this.isCurrentTurnAI()) {
        this.triggerAIMove();
      }
    }

    isCurrentTurnAI() {
      if (this.state.gameStatus !== 'playing') return false;
      if (this.state.mode === 'DEMO') return true;
      if (this.state.mode === 'AI' && this.state.currentPlayer === this.state.opponentSymbol) {
        return true;
      }
      return false;
    }

    // Handle user or programmatic click on cell
    handleCellClick(index) {
      if (this.state.gameStatus !== 'playing') return false;
      if (this.isAIThinking && this.state.mode !== 'DEMO') {
        if (window.TTTAudio) window.TTTAudio.playInvalid();
        return false;
      }

      // In Player vs AI, player can only move on their turn
      if (this.state.mode === 'AI' && this.state.currentPlayer !== this.state.playerSymbol) {
        return false;
      }

      if (this.state.mode === 'DEMO') {
        return false; // Watch AI mode is non-interactive
      }

      return this.placePiece(index, this.state.currentPlayer);
    }

    placePiece(index, player) {
      if (this.state.board[index] !== null || this.state.gameStatus !== 'playing') {
        if (window.TTTAudio) window.TTTAudio.playInvalid();
        return false;
      }

      // Update state
      this.state.board[index] = player;
      this.state.moveCount += 1;
      if (player === this.state.playerSymbol) {
        this.state.playerMoves += 1;
      }

      // Sound
      if (window.TTTAudio) {
        window.TTTAudio.playPiecePlacement(player);
      }

      // Visual placement feedback
      this.emit('piecePlaced', { index, player });
      this.announce(`${player} placed in ${CELL_NAMES[index]}`);

      // Check win or draw
      const winResult = this.checkWin(this.state.board);
      if (winResult) {
        this.handleGameEnd(winResult);
        return true;
      }

      // Toggle turn
      this.state.currentPlayer = player === 'X' ? 'O' : 'X';
      this.emit('turnChanged', this.state);

      // Trigger AI turn if applicable
      if (this.isCurrentTurnAI()) {
        this.triggerAIMove();
      }

      return true;
    }

    triggerAIMove() {
      if (this.state.gameStatus !== 'playing') return;
      this.isAIThinking = true;
      this.emit('aiThinking', { isThinking: true });

      const aiPiece = this.state.currentPlayer;
      const difficulty = this.state.difficulty;

      window.TTTAI.requestMove(
        this.state.board,
        aiPiece,
        difficulty,
        (chosenIndex) => {
          this.isAIThinking = false;
          this.emit('aiThinking', { isThinking: false });

          if (this.state.gameStatus === 'playing') {
            this.placePiece(chosenIndex, aiPiece);
          }
        }
      );
    }

    checkWin(board) {
      for (let i = 0; i < WIN_COMBINATIONS.length; i++) {
        const [a, b, c] = WIN_COMBINATIONS[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
          return { winner: board[a], line: WIN_COMBINATIONS[i] };
        }
      }
      if (board.every(c => c !== null)) {
        return { winner: 'draw', line: null };
      }
      return null;
    }

    handleGameEnd(result) {
      this.state.gameStatus = 'ended';
      this.state.winner = result.winner;
      this.state.winningLine = result.line;

      let matchResult = 'draw';
      let stars = 0;
      let scoreGained = 0;
      let xpGained = 0;

      if (result.winner === 'draw') {
        matchResult = 'draw';
        this.state.scores.draws += 1;
        scoreGained = 25 * this.getDifficultyMultiplier();
        xpGained = 15;
        if (window.TTTAudio) window.TTTAudio.playDraw();
        this.announce('Game is a draw!');
      } else if (
        (this.state.mode === 'AI' && result.winner === this.state.playerSymbol) ||
        (this.state.mode === 'PVP' && result.winner === 'X')
      ) {
        matchResult = 'win';
        this.state.scores.player += 1;
        this.state.streak += 1;

        // Calculate Stars
        if (this.state.playerMoves <= 4) {
          stars = 3; // Fast, optimal win
        } else {
          stars = 2; // Standard win
        }

        // Scoring: Base + Speed Bonus + Streak Bonus * Difficulty
        const baseScore = 100;
        const speedBonus = this.state.playerMoves <= 4 ? 50 : 20;
        const streakBonus = (this.state.streak - 1) * 25;
        scoreGained = Math.round((baseScore + speedBonus + streakBonus) * this.getDifficultyMultiplier());
        xpGained = 50 + (stars * 15);

        if (window.TTTAudio) window.TTTAudio.playVictory();
        this.announce(`Victory! Player ${result.winner} wins!`);
      } else {
        // Loss
        matchResult = 'loss';
        this.state.scores.opponent += 1;
        this.state.streak = 0;
        stars = 0;
        scoreGained = 0;
        xpGained = 10;

        if (window.TTTAudio) window.TTTAudio.playDefeat();
        this.announce(`Defeat! Opponent ${result.winner} wins!`);
      }

      // Record in SaveManager
      let levelUnlockInfo = null;
      if (window.TTTSave && this.state.mode === 'AI') {
        window.TTTSave.recordMatch({
          result: matchResult,
          difficulty: this.state.difficulty,
          moves: this.state.playerMoves,
          scoreGained,
          xpGained,
          playerSymbol: this.state.playerSymbol
        });

        // Campaign Level completion
        if (this.state.currentLevel && matchResult === 'win') {
          levelUnlockInfo = window.TTTSave.recordLevelCompletion(
            this.state.currentLevel,
            stars,
            scoreGained,
            this.state.playerMoves
          );
          if (levelUnlockInfo.unlockedNext && window.TTTAudio) {
            setTimeout(() => window.TTTAudio.playLevelUnlocked(), 800);
          }
        }
      }

      this.emit('gameOver', {
        winner: result.winner,
        line: result.line,
        matchResult: matchResult,
        stars: stars,
        scoreGained: scoreGained,
        xpGained: xpGained,
        streak: this.state.streak,
        levelUnlockInfo: levelUnlockInfo,
        level: this.state.currentLevel
      });
    }

    getDifficultyMultiplier() {
      switch (this.state.difficulty) {
        case 'easy': return 1.0;
        case 'medium': return 1.5;
        case 'hard': return 2.0;
        case 'grandmaster': return 3.0;
        default: return 1.0;
      }
    }

    pauseGame() {
      if (this.state.gameStatus !== 'playing') return false;
      this.state.gameStatus = 'paused';

      if (this.isAIThinking) {
        if (window.TTTAI) window.TTTAI.cancelThinking();
        this.pausedAIResume = true;
      }

      this.emit('gamePaused', true);
      this.announce('Game paused.');
      return true;
    }

    resumeGame() {
      if (this.state.gameStatus !== 'paused') return false;
      this.state.gameStatus = 'playing';
      this.emit('gamePaused', false);
      this.announce('Game resumed.');

      if (this.pausedAIResume) {
        this.pausedAIResume = false;
        this.triggerAIMove();
      }
      return true;
    }

    // Keyboard navigation
    navigateCell(direction) {
      if (this.state.gameStatus !== 'playing') return;

      const row = Math.floor(this.focusedCellIndex / 3);
      const col = this.focusedCellIndex % 3;

      let newRow = row;
      let newCol = col;

      if (direction === 'up' && row > 0) newRow--;
      else if (direction === 'down' && row < 2) newRow++;
      else if (direction === 'left' && col > 0) newCol--;
      else if (direction === 'right' && col < 2) newCol++;

      this.focusedCellIndex = newRow * 3 + newCol;
      this.emit('cellFocused', this.focusedCellIndex);
      this.announce(`Focused on ${CELL_NAMES[this.focusedCellIndex]}`);
    }

    activateFocusedCell() {
      if (this.state.gameStatus === 'playing') {
        this.handleCellClick(this.focusedCellIndex);
      }
    }

    announce(message) {
      const liveRegion = document.getElementById('srAnnouncements');
      if (liveRegion) {
        liveRegion.textContent = '';
        setTimeout(() => {
          liveRegion.textContent = message;
        }, 30);
      }
    }
  }

  window.TTTGame = new GameController();
})();

