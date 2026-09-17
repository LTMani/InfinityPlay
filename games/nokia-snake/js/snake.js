/**
 * Nokia Snake - Snake Model & Logic
 * Handles segment tracking, movement, direction constraints, and collision testing.
 */

(function() {
  'use strict';

  const DIRS = {
    UP: { x: 0, y: -1, name: 'UP' },
    DOWN: { x: 0, y: 1, name: 'DOWN' },
    LEFT: { x: -1, y: 0, name: 'LEFT' },
    RIGHT: { x: 1, y: 0, name: 'RIGHT' }
  };

  class Snake {
    constructor(gridSize = 20) {
      this.gridSize = gridSize;
      this.reset();
    }

    reset() {
      // Start in middle of grid, length 3, heading right
      const startY = Math.floor(this.gridSize / 2);
      const startX = Math.floor(this.gridSize / 2);

      this.segments = [
        { x: startX, y: startY },       // Head
        { x: startX - 1, y: startY },   // Body
        { x: startX - 2, y: startY }    // Tail
      ];

      this.direction = DIRS.RIGHT;
      this.previousDirection = DIRS.RIGHT;
    }

    get head() {
      return this.segments[0];
    }

    get length() {
      return this.segments.length;
    }

    getNextHeadPosition(dir = this.direction) {
      return {
        x: this.head.x + dir.x,
        y: this.head.y + dir.y
      };
    }

    /**
     * Tests if changing to target direction is an invalid 180-degree turn
     */
    isOppositeDirection(dir1, dir2) {
      return (dir1.x + dir2.x === 0) && (dir1.y + dir2.y === 0);
    }

    /**
     * Validates and applies a direction change.
     * Prevents reversing directly into oneself.
     */
    canChangeDirection(newDir, referenceDir = this.direction) {
      if (!newDir) return false;
      // Cannot move in exact same direction (redundant) or opposite direction (suicide)
      if (newDir.name === referenceDir.name) return false;
      if (this.isOppositeDirection(newDir, referenceDir)) return false;
      return true;
    }

    setDirection(newDir) {
      if (this.canChangeDirection(newDir, this.direction)) {
        this.direction = newDir;
        return true;
      }
      return false;
    }

    /**
     * Checks if coordinates hit board wall boundaries
     */
    checkWallCollision(pos) {
      return pos.x < 0 || pos.x >= this.gridSize || pos.y < 0 || pos.y >= this.gridSize;
    }

    /**
     * Checks if coordinates collide with snake body
     * If willGrow is false, tail segment moves away this turn.
     */
    checkSelfCollision(pos, willGrow = false) {
      const checkSegments = willGrow ? this.segments : this.segments.slice(0, -1);
      return checkSegments.some(seg => seg.x === pos.x && seg.y === pos.y);
    }

    /**
     * Checks if a point (x, y) is occupied by any segment of the snake
     */
    occupies(x, y) {
      return this.segments.some(seg => seg.x === x && seg.y === y);
    }

    /**
     * Advances snake by one tick in current direction
     */
    step(newHead, grow = false) {
      this.segments.unshift(newHead);
      if (!grow) {
        this.segments.pop();
      }
      this.previousDirection = this.direction;
    }
  }

  window.NokiaSnake = window.NokiaSnake || {};
  window.NokiaSnake.DIRS = DIRS;
  window.NokiaSnake.Snake = Snake;
})();
