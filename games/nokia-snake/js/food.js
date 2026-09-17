/**
 * Nokia Snake - Food Spawning & Management
 * Handles spawning food strictly in valid, unoccupied grid positions.
 */

(function() {
  'use strict';

  class Food {
    constructor(gridSize = 20) {
      this.gridSize = gridSize;
      this.x = 0;
      this.y = 0;
    }

    /**
     * Spawns food at a random position not occupied by the snake
     * @param {Object} snake - Instance of Snake
     * @returns {Object|null} The spawned food position or null if grid is full
     */
    spawn(snake) {
      const emptyCells = [];

      for (let y = 0; y < this.gridSize; y++) {
        for (let x = 0; x < this.gridSize; x++) {
          if (!snake.occupies(x, y)) {
            emptyCells.push({ x, y });
          }
        }
      }

      if (emptyCells.length === 0) {
        // Grid completely filled by snake
        return null;
      }

      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const chosen = emptyCells[randomIndex];
      this.x = chosen.x;
      this.y = chosen.y;

      return { x: this.x, y: this.y };
    }

    /**
     * Checks if coordinates match current food position
     */
    isAt(pos) {
      return this.x === pos.x && this.y === pos.y;
    }
  }

  window.NokiaSnake = window.NokiaSnake || {};
  window.NokiaSnake.Food = Food;
})();
