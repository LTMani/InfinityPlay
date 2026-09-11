/**
 * GameEngine.js
 * Pure, high-performance 2048 algorithmic state manager.
 * Handles 4x4 matrix, deterministic sliding/merging, spawning, win/game over detection, and undo.
 */

export class GameEngine {
  constructor(size = 4) {
    this.size = size;
    this.grid = [];
    this.score = 0;
    this.hasWon = false;
    this.keepPlaying = false;
    this.isGameOver = false;
    this.previousState = null;
    this.tileIdCounter = 1;
    this.initGrid();
  }

  /**
   * Initializes an empty size x size grid
   */
  initGrid() {
    this.grid = [];
    for (let r = 0; r < this.size; r++) {
      this.grid[r] = [];
      for (let c = 0; c < this.size; c++) {
        this.grid[r][c] = null;
      }
    }
  }

  /**
   * Starts a brand new game with exactly 2 random tiles
   */
  startNewGame() {
    this.initGrid();
    this.score = 0;
    this.hasWon = false;
    this.keepPlaying = false;
    this.isGameOver = false;
    this.previousState = null;

    this.spawnRandomTile();
    this.spawnRandomTile();

    return this.getState();
  }

  /**
   * Returns list of empty cell coordinates { r, c }
   */
  getEmptyCells() {
    const empty = [];
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (!this.grid[r][c]) {
          empty.push({ r, c });
        }
      }
    }
    return empty;
  }

  /**
   * Spawns a random tile (90% chance of 2, 10% chance of 4) in an empty cell
   */
  spawnRandomTile() {
    const empty = this.getEmptyCells();
    if (empty.length === 0) return null;

    const chosen = empty[Math.floor(Math.random() * empty.length)];
    const value = Math.random() < 0.9 ? 2 : 4;
    const tile = {
      id: `tile_${this.tileIdCounter++}`,
      r: chosen.r,
      c: chosen.c,
      value,
      isNew: true,
      isMerged: false
    };

    this.grid[chosen.r][chosen.c] = tile;
    return tile;
  }

  /**
   * Clear transient animation flags (isNew, isMerged) before next move
   */
  clearTileFlags() {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.grid[r][c]) {
          this.grid[r][c].isNew = false;
          this.grid[r][c].isMerged = false;
        }
      }
    }
  }

  /**
   * Creates a deep snapshot for Undo functionality
   */
  createSnapshot() {
    return {
      grid: this.serializeGrid(),
      score: this.score,
      hasWon: this.hasWon,
      keepPlaying: this.keepPlaying,
      isGameOver: this.isGameOver
    };
  }

  /**
   * Serializes current grid to a 2D matrix of { id, value }
   */
  serializeGrid() {
    const serialized = [];
    for (let r = 0; r < this.size; r++) {
      serialized[r] = [];
      for (let c = 0; c < this.size; c++) {
        if (this.grid[r][c]) {
          serialized[r][c] = {
            id: this.grid[r][c].id,
            value: this.grid[r][c].value
          };
        } else {
          serialized[r][c] = null;
        }
      }
    }
    return serialized;
  }

  /**
   * Restores grid from serialized snapshot
   */
  restoreGrid(serialized) {
    this.initGrid();
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (serialized[r] && serialized[r][c]) {
          this.grid[r][c] = {
            id: serialized[r][c].id,
            r,
            c,
            value: serialized[r][c].value,
            isNew: false,
            isMerged: false
          };
        }
      }
    }
  }

  /**
   * Executes Undo if a previous state exists
   */
  undo() {
    if (!this.previousState) return false;

    this.restoreGrid(this.previousState.grid);
    this.score = this.previousState.score;
    this.hasWon = this.previousState.hasWon;
    this.keepPlaying = this.previousState.keepPlaying;
    this.isGameOver = this.previousState.isGameOver;
    this.previousState = null;

    return true;
  }

  /**
   * Slide line algorithm:
   * Correctly merges equal adjacent numbers, merging at most ONCE per move.
   * e.g. [2, 2, 2] -> [4, 2], [2, 2, 2, 2] -> [4, 4]
   */
  slideLine(line) {
    // line is array of items: Tile | null
    const nonNulls = line.filter(t => t !== null);
    const result = [];
    let scoreGained = 0;
    let i = 0;

    while (i < nonNulls.length) {
      if (i + 1 < nonNulls.length && nonNulls[i].value === nonNulls[i + 1].value) {
        const mergedVal = nonNulls[i].value * 2;
        scoreGained += mergedVal;
        result.push({
          value: mergedVal,
          merged: true,
          sourceTiles: [nonNulls[i], nonNulls[i + 1]]
        });
        i += 2; // Advance by 2 so merged tile cannot merge again in this move
      } else {
        result.push({
          value: nonNulls[i].value,
          merged: false,
          sourceTiles: [nonNulls[i]]
        });
        i += 1;
      }
    }

    return { result, scoreGained };
  }

  /**
   * Executes move in direction: 'left', 'right', 'up', 'down'
   * Returns: { moved: boolean, scoreGained: number, newlyCreatedTile: Tile|null, reached2048: boolean, isGameOver: boolean }
   */
  move(direction) {
    if (this.isGameOver) return { moved: false };

    this.clearTileFlags();
    const snapshotBefore = this.createSnapshot();

    let moved = false;
    let totalScoreGained = 0;
    let newlyReached2048 = false;

    const newGrid = [];
    for (let r = 0; r < this.size; r++) {
      newGrid[r] = new Array(this.size).fill(null);
    }

    const isHorizontal = direction === 'left' || direction === 'right';
    const isForward = direction === 'left' || direction === 'up';

    for (let i = 0; i < this.size; i++) {
      // Extract line
      const line = [];
      for (let j = 0; j < this.size; j++) {
        const r = isHorizontal ? i : j;
        const c = isHorizontal ? j : i;
        line.push(this.grid[r][c]);
      }

      // If moving right or down, reverse line before sliding
      if (!isForward) {
        line.reverse();
      }

      const { result, scoreGained } = this.slideLine(line);
      totalScoreGained += scoreGained;

      // Re-place into new line
      const newLine = new Array(this.size).fill(null);
      for (let k = 0; k < result.length; k++) {
        const res = result[k];
        let tile;
        if (res.merged) {
          tile = {
            id: `tile_${this.tileIdCounter++}`,
            value: res.value,
            isNew: false,
            isMerged: true
          };
          if (res.value === 2048 && !this.hasWon && !this.keepPlaying) {
            newlyReached2048 = true;
            this.hasWon = true;
          }
        } else {
          tile = {
            id: res.sourceTiles[0].id,
            value: res.value,
            isNew: false,
            isMerged: false
          };
        }
        newLine[k] = tile;
      }

      // If reversed, reverse back
      if (!isForward) {
        newLine.reverse();
      }

      // Assign to newGrid and check if changed
      for (let j = 0; j < this.size; j++) {
        const r = isHorizontal ? i : j;
        const c = isHorizontal ? j : i;
        const targetTile = newLine[j];
        if (targetTile) {
          targetTile.r = r;
          targetTile.c = c;
        }
        newGrid[r][c] = targetTile;

        const originalTile = this.grid[r][c];
        if (!originalTile && targetTile) moved = true;
        else if (originalTile && !targetTile) moved = true;
        else if (originalTile && targetTile && (originalTile.value !== targetTile.value || originalTile.id !== targetTile.id)) {
          moved = true;
        }
      }
    }

    if (!moved) {
      return { moved: false, scoreGained: 0, newlySpawned: null };
    }

    // Apply new grid & score
    this.previousState = snapshotBefore;
    this.grid = newGrid;
    this.score += totalScoreGained;

    // Spawn new random tile after successful move
    const newlySpawned = this.spawnRandomTile();

    // Check game over
    this.isGameOver = this.checkGameOver();

    return {
      moved: true,
      scoreGained: totalScoreGained,
      newlySpawned,
      newlyReached2048,
      isGameOver: this.isGameOver
    };
  }

  /**
   * Check if any moves are possible
   */
  checkGameOver() {
    if (this.getEmptyCells().length > 0) return false;

    // Check for adjacent matching numbers horizontally or vertically
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const val = this.grid[r][c].value;
        // Right neighbor
        if (c + 1 < this.size && this.grid[r][c + 1] && this.grid[r][c + 1].value === val) {
          return false;
        }
        // Bottom neighbor
        if (r + 1 < this.size && this.grid[r + 1][c] && this.grid[r + 1][c].value === val) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Export complete state for serialization
   */
  getState() {
    return {
      grid: this.serializeGrid(),
      score: this.score,
      hasWon: this.hasWon,
      keepPlaying: this.keepPlaying,
      isGameOver: this.isGameOver,
      canUndo: this.previousState !== null
    };
  }

  /**
   * Load from saved state
   */
  loadState(state) {
    if (!state || !state.grid) return false;
    try {
      this.restoreGrid(state.grid);
      this.score = typeof state.score === 'number' ? state.score : 0;
      this.hasWon = Boolean(state.hasWon);
      this.keepPlaying = Boolean(state.keepPlaying);
      this.isGameOver = Boolean(state.isGameOver);
      this.previousState = null;
      return true;
    } catch (e) {
      console.warn('Corrupted state detected in loadState, starting fresh:', e);
      this.startNewGame();
      return false;
    }
  }
}
