/**
 * app.js
 * Main bootstrap and coordinator for BLOCK MERGE.
 * Wires GameEngine, StorageManager, SoundManager, InputManager, and UIManager.
 */

import { GameEngine } from './GameEngine.js';
import { StorageManager } from './StorageManager.js';
import { SoundManager } from './SoundManager.js';
import { InputManager } from './InputManager.js';
import { UIManager } from './UIManager.js';

class BlockMergeApp {
  constructor() {
    this.storage = new StorageManager();
    this.sound = new SoundManager(this.storage.getSoundEnabled());
    this.engine = new GameEngine(4);
    this.ui = null;
    this.input = null;

    this.initDOM();
    this.bindEvents();
    this.bootstrapGame();
  }

  initDOM() {
    this.ui = new UIManager({
      boardElement: document.getElementById('board-container'),
      gridBackground: document.getElementById('grid-background'),
      tileContainer: document.getElementById('tile-container'),
      scoreElement: document.getElementById('score-value'),
      scoreContainer: document.getElementById('score-box'),
      bestScoreElement: document.getElementById('best-score-value'),
      undoButton: document.getElementById('btn-undo'),
      soundButton: document.getElementById('btn-sound'),
      winModal: document.getElementById('win-modal'),
      gameOverModal: document.getElementById('game-over-modal'),
      confirmModal: document.getElementById('confirm-modal'),
      continueModal: document.getElementById('continue-modal')
    });

    this.input = new InputManager(
      document.getElementById('board-container'),
      (direction) => this.handleMove(direction)
    );

    this.ui.updateSoundButton(this.sound.enabled);
    this.ui.updateScore(0, this.storage.getBestScore());
    this.ui.setUndoEnabled(false);
  }

  bootstrapGame() {
    const saved = this.storage.getSavedGameState();
    // Check if saved state has a meaningful non-gameover game
    if (saved && !saved.isGameOver && (saved.score > 0 || this.countTiles(saved.grid) > 2)) {
      this.ui.showContinueModal();
    } else {
      this.startNewGame(false);
    }
  }

  countTiles(grid) {
    if (!grid) return 0;
    let count = 0;
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (grid[r] && grid[r][c]) count++;
      }
    }
    return count;
  }

  bindEvents() {
    // New Game button
    const btnNewGame = document.getElementById('btn-new-game');
    if (btnNewGame) {
      btnNewGame.addEventListener('click', () => {
        this.sound.playClick();
        if (this.engine.score > 50 && !this.engine.isGameOver) {
          this.ui.showConfirmModal();
        } else {
          this.startNewGame(true);
        }
      });
    }

    // Confirm Modal actions
    const btnConfirmYes = document.getElementById('btn-confirm-yes');
    if (btnConfirmYes) {
      btnConfirmYes.addEventListener('click', () => {
        this.sound.playClick();
        this.ui.hideConfirmModal();
        this.startNewGame(true);
      });
    }

    const btnConfirmCancel = document.getElementById('btn-confirm-cancel');
    if (btnConfirmCancel) {
      btnConfirmCancel.addEventListener('click', () => {
        this.sound.playClick();
        this.ui.hideConfirmModal();
      });
    }

    // Continue Saved Game Modal actions
    const btnContinueYes = document.getElementById('btn-continue-yes');
    if (btnContinueYes) {
      btnContinueYes.addEventListener('click', () => {
        this.sound.playClick();
        this.ui.hideContinueModal();
        const saved = this.storage.getSavedGameState();
        if (this.engine.loadState(saved)) {
          this.ui.renderBoard(this.engine.grid);
          this.ui.updateScore(this.engine.score, this.storage.getBestScore());
          this.ui.setUndoEnabled(false);
        } else {
          this.startNewGame(false);
        }
      });
    }

    const btnContinueNew = document.getElementById('btn-continue-new');
    if (btnContinueNew) {
      btnContinueNew.addEventListener('click', () => {
        this.sound.playClick();
        this.ui.hideContinueModal();
        this.startNewGame(true);
      });
    }

    // Undo button
    const btnUndo = document.getElementById('btn-undo');
    if (btnUndo) {
      btnUndo.addEventListener('click', () => {
        this.handleUndo();
      });
    }

    // Sound button
    const btnSound = document.getElementById('btn-sound');
    if (btnSound) {
      btnSound.addEventListener('click', () => {
        const enabled = this.sound.toggle();
        this.storage.setSoundEnabled(enabled);
        this.ui.updateSoundButton(enabled);
        if (enabled) this.sound.playClick();
      });
    }

    // Win Modal actions
    const btnWinContinue = document.getElementById('btn-win-continue');
    if (btnWinContinue) {
      btnWinContinue.addEventListener('click', () => {
        this.sound.playClick();
        this.engine.keepPlaying = true;
        this.ui.hideWinModal();
        this.storage.saveGameState(this.engine.getState());
      });
    }

    const btnWinNew = document.getElementById('btn-win-new');
    if (btnWinNew) {
      btnWinNew.addEventListener('click', () => {
        this.sound.playClick();
        this.ui.hideWinModal();
        this.startNewGame(true);
      });
    }

    // Game Over Modal actions
    const btnGameOverRetry = document.getElementById('btn-gameover-retry');
    if (btnGameOverRetry) {
      btnGameOverRetry.addEventListener('click', () => {
        this.sound.playClick();
        this.ui.hideGameOverModal();
        this.startNewGame(true);
      });
    }

    // Exit to Platform
    const btnExit = document.getElementById('btn-exit-portal');
    if (btnExit) {
      btnExit.addEventListener('click', (e) => {
        // PostMessage to parent frame if embedded
        if (window.parent && window.parent !== window) {
          e.preventDefault();
          window.parent.postMessage({ type: 'exitGame' }, '*');
        }
      });
    }
  }

  startNewGame(playClickSound = true) {
    if (playClickSound) this.sound.playClick();
    this.engine.startNewGame();
    this.storage.clearSavedGameState();

    this.ui.renderBoard(this.engine.grid);
    this.ui.updateScore(this.engine.score, this.storage.getBestScore());
    this.ui.setUndoEnabled(false);
    this.ui.hideWinModal();
    this.ui.hideGameOverModal();

    this.storage.saveGameState(this.engine.getState());
  }

  handleMove(direction) {
    if (this.engine.isGameOver) return;

    const res = this.engine.move(direction);
    if (!res.moved) return;

    // Play appropriate sound
    if (res.scoreGained > 0) {
      this.sound.playMerge(res.scoreGained);
    } else {
      this.sound.playMove();
    }

    // Update best score
    this.storage.setBestScore(this.engine.score);

    // Render updated board & score additions
    this.ui.renderBoard(this.engine.grid, res.scoreGained);
    this.ui.updateScore(this.engine.score, this.storage.getBestScore());
    this.ui.setUndoEnabled(true);

    // Auto-save state
    this.storage.saveGameState(this.engine.getState());

    // Win 2048 detection
    if (res.newlyReached2048) {
      setTimeout(() => {
        this.sound.playWin();
        this.ui.showWinModal();
      }, 300);
    }

    // Game over detection
    if (res.isGameOver) {
      setTimeout(() => {
        this.sound.playGameOver();
        this.ui.showGameOverModal(this.engine.score, this.storage.getBestScore());
        this.storage.clearSavedGameState();
      }, 400);
    }
  }

  handleUndo() {
    if (!this.engine.previousState) return;

    const ok = this.engine.undo();
    if (ok) {
      this.sound.playUndo();
      this.ui.renderBoard(this.engine.grid);
      this.ui.updateScore(this.engine.score, this.storage.getBestScore());
      this.ui.setUndoEnabled(false);
      this.storage.saveGameState(this.engine.getState());
    }
  }
}

// Instantiate and expose globally for responsive recalibrations
window.addEventListener('DOMContentLoaded', () => {
  window.blockMergeApp = new BlockMergeApp();
});
