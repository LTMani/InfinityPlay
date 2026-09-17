/**
 * Nokia Snake - Game Engine
 * Authoritative game loop, state management, difficulty tuning, and collision processing.
 */

(function() {
  'use strict';

  const GRID_SIZE = 20;

  const DIFFICULTY_SETTINGS = {
    easy: {
      baseInterval: 185,      // ms per step
      reductionPerFood: 1.5,  // ms speedup per food eaten
      minInterval: 110        // fastest speed floor
    },
    classic: {
      baseInterval: 145,
      reductionPerFood: 2.0,
      minInterval: 65
    },
    hard: {
      baseInterval: 105,
      reductionPerFood: 2.5,
      minInterval: 40
    }
  };

  class GameEngine {
    constructor() {
      this.gridSize = GRID_SIZE;
      this.snake = new window.NokiaSnake.Snake(GRID_SIZE);
      this.food = new window.NokiaSnake.Food(GRID_SIZE);
      this.storage = window.NokiaSnake.storage;
      this.audio = window.NokiaSnake.audio;
      this.input = window.NokiaSnake.input;
      this.ui = null; // Bound by ui.js

      this.state = 'READY'; // 'READY' | 'PLAYING' | 'PAUSED' | 'GAME_OVER'
      this.score = 0;
      this.foodCollected = 0;
      this.isNewHighScore = false;

      // Loop timing
      this.lastFrameTime = 0;
      this.accumulatedTime = 0;
      this.stepInterval = 145; // ms
      this.animationFrameId = null;

      this.input.init(this, this.snake);
    }

    setUI(ui) {
      this.ui = ui;
    }

    getDifficultyConfig() {
      const mode = this.storage.settings.difficulty || 'classic';
      return DIFFICULTY_SETTINGS[mode] || DIFFICULTY_SETTINGS.classic;
    }

    calculateStepInterval() {
      const config = this.getDifficultyConfig();
      const speedup = this.foodCollected * config.reductionPerFood;
      return Math.max(config.minInterval, config.baseInterval - speedup);
    }

    /**
     * Starts a new game from READY or restarts
     */
    start() {
      this.stopLoop();

      this.snake.reset();
      this.score = 0;
      this.foodCollected = 0;
      this.isNewHighScore = false;
      this.stepInterval = this.calculateStepInterval();
      this.accumulatedTime = 0;
      this.lastFrameTime = performance.now();

      this.food.spawn(this.snake);
      this.input.reset();

      this.state = 'PLAYING';
      this.storage.recordGameStart();
      this.audio.playStart();

      if (this.ui) {
        this.ui.onGameStart();
      }

      this.loop(this.lastFrameTime);
    }

    /**
     * Pause game
     */
    pause() {
      if (this.state !== 'PLAYING') return;
      this.state = 'PAUSED';
      this.stopLoop();
      this.audio.playPause();
      if (this.ui) this.ui.onGamePause();
    }

    /**
     * Resume paused game
     */
    resume() {
      if (this.state !== 'PAUSED') return;
      this.state = 'PLAYING';
      this.lastFrameTime = performance.now();
      this.accumulatedTime = 0;
      this.audio.playPause();
      if (this.ui) this.ui.onGameResume();
      this.loop(this.lastFrameTime);
    }

    togglePause() {
      if (this.state === 'PLAYING') {
        this.pause();
      } else if (this.state === 'PAUSED') {
        this.resume();
      }
    }

    /**
     * Restarts game cleanly
     */
    restart() {
      this.start();
    }

    /**
     * Returns to main menu
     */
    toMenu() {
      this.stopLoop();
      this.state = 'READY';
      if (this.ui) this.ui.showScreen('menu');
    }

    /**
     * Game Over handler
     */
    gameOver(reason) {
      this.stopLoop();
      this.state = 'GAME_OVER';

      // Check if new high score
      this.isNewHighScore = this.storage.saveHighScore(this.score);

      // Record statistics
      this.storage.recordGameOver(this.score, this.snake.length, this.foodCollected);

      if (this.isNewHighScore && this.score > 0) {
        this.audio.playHighScore();
      } else {
        this.audio.playGameOver();
      }

      if (this.ui) {
        this.ui.onGameOver(reason, this.score, this.storage.highScore, this.isNewHighScore);
      }
    }

    /**
     * Authoritative game tick
     */
    tick() {
      if (this.state !== 'PLAYING') return;

      // 1. Process queued direction input
      this.input.processNextInput();

      // 2. Predict next head position
      const nextHead = this.snake.getNextHeadPosition();

      // 3. Wall Collision
      if (this.snake.checkWallCollision(nextHead)) {
        this.gameOver('wall');
        return;
      }

      // 4. Food Collision check
      const willEatFood = this.food.isAt(nextHead);

      // 5. Self Collision
      if (this.snake.checkSelfCollision(nextHead, willEatFood)) {
        this.gameOver('self');
        return;
      }

      // 6. Advance snake
      this.snake.step(nextHead, willEatFood);

      // 7. Process food eaten
      if (willEatFood) {
        this.score += 10;
        this.foodCollected++;
        this.audio.playEat();

        // Check if high score reached during play
        if (this.score > this.storage.highScore) {
          this.storage.saveHighScore(this.score);
          this.isNewHighScore = true;
        }

        // Spawn next food
        const spawned = this.food.spawn(this.snake);
        if (!spawned) {
          // Snake filled entire 20x20 board (perfect win)
          this.gameOver('victory');
          return;
        }

        // Update movement interval for progressive speedup
        this.stepInterval = this.calculateStepInterval();
      }

      // 8. Update UI HUD
      if (this.ui) {
        this.ui.updateHUD(this.score, this.storage.highScore, this.foodCollected);
      }
    }

    /**
     * Authoritative animation frame game loop
     */
    loop(currentTime) {
      if (this.state !== 'PLAYING') return;

      const delta = currentTime - this.lastFrameTime;
      this.lastFrameTime = currentTime;

      // Cap delta time to prevent spiral of death if tab was unfocused
      this.accumulatedTime += Math.min(delta, 250);

      while (this.accumulatedTime >= this.stepInterval) {
        this.tick();
        this.accumulatedTime -= this.stepInterval;
        if (this.state !== 'PLAYING') break;
      }

      // Render updated state
      if (this.ui) {
        this.ui.render(this.snake, this.food);
      }

      if (this.state === 'PLAYING') {
        this.animationFrameId = requestAnimationFrame((time) => this.loop(time));
      }
    }

    stopLoop() {
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }
    }
  }

  window.NokiaSnake = window.NokiaSnake || {};
  window.NokiaSnake.engine = new GameEngine();
})();
