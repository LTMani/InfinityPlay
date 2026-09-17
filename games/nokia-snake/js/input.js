/**
 * Nokia Snake - Input Management
 * Unified input handling: Keyboard (Arrows/WASD), Touch Swipe, On-screen D-Pad.
 * Features safe direction buffering and 180-degree reversal prevention.
 */

(function() {
  'use strict';

  class InputManager {
    constructor() {
      this.engine = null;
      this.snake = null;
      this.inputQueue = [];
      this.maxQueueSize = 2;

      // Touch tracking
      this.touchStartX = 0;
      this.touchStartY = 0;
      this.touchStartTime = 0;
      this.minSwipeDistance = 25; // px

      this.isBound = false;
    }

    init(engine, snake) {
      this.engine = engine;
      this.snake = snake;
      this.inputQueue = [];

      if (!this.isBound) {
        this.bindKeyboard();
        this.bindTouch();
        this.bindVirtualControls();
        this.isBound = true;
      }
    }

    reset() {
      this.inputQueue = [];
    }

    /**
     * Enqueues a requested direction with validation
     */
    enqueueDirection(dir) {
      if (!this.engine || !this.snake) return;

      // If in READY or GAME_OVER, pressing any movement key starts the game immediately
      if (this.engine.state === 'READY' || this.engine.state === 'GAME_OVER') {
        this.engine.start();
        if (this.snake.canChangeDirection(dir, this.snake.direction)) {
          this.snake.setDirection(dir);
        }
        return;
      }

      if (this.engine.state !== 'PLAYING') return;

      const DIRS = window.NokiaSnake.DIRS;

      // Reference direction is the last queued direction, or the snake's current direction
      let refDir = this.snake.direction;
      if (this.inputQueue.length > 0) {
        refDir = this.inputQueue[this.inputQueue.length - 1];
      }

      // Check if candidate direction is legal from the reference point
      if (this.snake.canChangeDirection(dir, refDir)) {
        if (this.inputQueue.length < this.maxQueueSize) {
          this.inputQueue.push(dir);
        }
      }
    }

    /**
     * Consumes and applies the next buffered direction for the current tick
     */
    processNextInput() {
      if (this.inputQueue.length > 0) {
        const nextDir = this.inputQueue.shift();
        this.snake.setDirection(nextDir);
      }
    }

    /**
     * Centralized key event processor (works for direct keyboard and forwarded iframe events)
     */
    handleKey(key, code = '') {
      if (!this.engine || !this.snake) return;
      const DIRS = window.NokiaSnake.DIRS;

      const isUp = key === 'ArrowUp' || key === 'w' || key === 'W' || key === '2' || code === 'Numpad8' || code === 'KeyW' || key === 'Up';
      const isDown = key === 'ArrowDown' || key === 's' || key === 'S' || key === '8' || code === 'Numpad2' || code === 'KeyS' || key === 'Down';
      const isLeft = key === 'ArrowLeft' || key === 'a' || key === 'A' || key === '4' || code === 'Numpad4' || code === 'KeyA' || key === 'Left';
      const isRight = key === 'ArrowRight' || key === 'd' || key === 'D' || key === '6' || code === 'Numpad6' || code === 'KeyD' || key === 'Right';
      const isAction = key === ' ' || key === 'Enter' || code === 'Space' || code === 'Enter' || code === 'NumpadEnter';
      const isPause = key === 'p' || key === 'P' || code === 'KeyP';
      const isRestart = key === 'r' || key === 'R' || code === 'KeyR';
      const isEscape = key === 'Escape';

      if (isUp) {
        this.enqueueDirection(DIRS.UP);
      } else if (isDown) {
        this.enqueueDirection(DIRS.DOWN);
      } else if (isLeft) {
        this.enqueueDirection(DIRS.LEFT);
      } else if (isRight) {
        this.enqueueDirection(DIRS.RIGHT);
      } else if (isAction) {
        if (this.engine.state === 'READY') {
          this.engine.start();
        } else if (this.engine.state === 'PLAYING' || this.engine.state === 'PAUSED') {
          this.engine.togglePause();
        } else if (this.engine.state === 'GAME_OVER') {
          this.engine.start();
        }
      } else if (isPause) {
        this.engine.togglePause();
      } else if (isRestart) {
        if (this.engine.state === 'PLAYING' || this.engine.state === 'PAUSED' || this.engine.state === 'GAME_OVER') {
          this.engine.restart();
        }
      } else if (isEscape) {
        if (this.engine.state === 'PLAYING') {
          this.engine.pause();
        }
      }
    }

    bindKeyboard() {
      // Auto-focus window on load and on any click to ensure keyboard events reach the game
      window.addEventListener('click', () => {
        try { window.focus(); } catch (e) {}
      });
      try { window.focus(); } catch (e) {}

      window.addEventListener('keydown', (e) => {
        // Ignore inputs if user is typing in an input field
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
          return;
        }

        const gameKeys = [
          'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ',
          'w', 'a', 's', 'd', 'W', 'A', 'S', 'D',
          '2', '4', '6', '8', 'Enter', 'p', 'P', 'r', 'R'
        ];
        if (gameKeys.includes(e.key)) {
          e.preventDefault();
        }

        this.handleKey(e.key, e.code);
      });

      // Also listen for parent window postMessage key events when embedded inside an iframe
      window.addEventListener('message', (e) => {
        if (e.data && e.data.type === 'parentKeyEvent') {
          this.handleKey(e.data.key, e.data.code);
        }
      });
    }

    bindTouch() {
      const touchTarget = document.getElementById('gameCanvas') || document.body;
      if (!touchTarget) return;
      const DIRS = window.NokiaSnake.DIRS;

      touchTarget.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
          const touch = e.touches[0];
          this.touchStartX = touch.clientX;
          this.touchStartY = touch.clientY;
          this.touchStartTime = Date.now();
        }
      }, { passive: true });

      touchTarget.addEventListener('touchmove', (e) => {
        // Prevent default scrolling on canvas area during active game
        if (this.engine && this.engine.state === 'PLAYING') {
          if (e.cancelable) e.preventDefault();
        }
      }, { passive: false });

      touchTarget.addEventListener('touchend', (e) => {
        if (e.changedTouches.length === 1) {
          const touch = e.changedTouches[0];
          const deltaX = touch.clientX - this.touchStartX;
          const deltaY = touch.clientY - this.touchStartY;
          const elapsed = Date.now() - this.touchStartTime;

          // Max 800ms for a swipe gesture
          if (elapsed < 800) {
            const absX = Math.abs(deltaX);
            const absY = Math.abs(deltaY);

            if (Math.max(absX, absY) >= this.minSwipeDistance) {
              if (absX > absY) {
                // Horizontal swipe
                if (deltaX > 0) {
                  this.enqueueDirection(DIRS.RIGHT);
                } else {
                  this.enqueueDirection(DIRS.LEFT);
                }
              } else {
                // Vertical swipe
                if (deltaY > 0) {
                  this.enqueueDirection(DIRS.DOWN);
                } else {
                  this.enqueueDirection(DIRS.UP);
                }
              }
            }
          }
        }
      }, { passive: true });
    }

    bindVirtualControls() {
      const DIRS = window.NokiaSnake.DIRS;

      const bindBtn = (id, action) => {
        const btn = document.getElementById(id);
        if (!btn) return;

        const handler = (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (window.NokiaSnake.audio) window.NokiaSnake.audio.playClick();
          action();
        };

        btn.addEventListener('pointerdown', handler);
      };

      bindBtn('dpadUp', () => this.enqueueDirection(DIRS.UP));
      bindBtn('dpadDown', () => this.enqueueDirection(DIRS.DOWN));
      bindBtn('dpadLeft', () => this.enqueueDirection(DIRS.LEFT));
      bindBtn('dpadRight', () => this.enqueueDirection(DIRS.RIGHT));

      bindBtn('dpadPause', () => {
        if (this.engine) this.engine.togglePause();
      });

      bindBtn('dpadRestart', () => {
        if (this.engine) this.engine.restart();
      });
    }
  }

  window.NokiaSnake = window.NokiaSnake || {};
  window.NokiaSnake.input = new InputManager();
})();
