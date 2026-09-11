/**
 * InputManager.js
 * Handles Desktop Keyboard (Arrows + WASD) and Mobile Multi-Touch Swipe Gestures.
 * Prevents default page scrolling while interacting with the game board.
 */

export class InputManager {
  constructor(boardElement, onMoveCallback) {
    this.boardElement = boardElement;
    this.onMove = onMoveCallback || (() => {});
    this.enabled = true;

    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchStartTime = 0;
    this.minSwipeDistance = 30; // Minimum pixels to qualify as a swipe
    this.maxSwipeTime = 1000;   // Maximum ms for swipe gesture

    this.keyMap = {
      ArrowLeft: 'left',
      KeyA: 'left',
      ArrowRight: 'right',
      KeyD: 'right',
      ArrowUp: 'up',
      KeyW: 'up',
      ArrowDown: 'down',
      KeyS: 'down'
    };

    this.initKeyboard();
    this.initTouch();
  }

  setEnabled(enabled) {
    this.enabled = Boolean(enabled);
  }

  initKeyboard() {
    window.addEventListener('keydown', (e) => {
      if (!this.enabled) return;

      const direction = this.keyMap[e.code];
      if (direction) {
        // Prevent window scrolling on arrow keys or space/WASD
        e.preventDefault();
        this.onMove(direction);
      }
    });
  }

  initTouch() {
    if (!this.boardElement) return;

    this.boardElement.addEventListener('touchstart', (e) => {
      if (!this.enabled || e.touches.length === 0) return;

      const touch = e.touches[0];
      this.touchStartX = touch.clientX;
      this.touchStartY = touch.clientY;
      this.touchStartTime = Date.now();
    }, { passive: true });

    // Prevent scrolling while actively swiping on board
    this.boardElement.addEventListener('touchmove', (e) => {
      if (this.enabled) {
        e.preventDefault();
      }
    }, { passive: false });

    this.boardElement.addEventListener('touchend', (e) => {
      if (!this.enabled || e.changedTouches.length === 0) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - this.touchStartX;
      const deltaY = touch.clientY - this.touchStartY;
      const deltaTime = Date.now() - this.touchStartTime;

      if (deltaTime > this.maxSwipeTime) return;

      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      if (Math.max(absX, absY) < this.minSwipeDistance) return;

      let direction = null;
      if (absX > absY) {
        direction = deltaX > 0 ? 'right' : 'left';
      } else {
        direction = deltaY > 0 ? 'down' : 'up';
      }

      if (direction) {
        this.onMove(direction);
      }
    }, { passive: true });
  }
}
