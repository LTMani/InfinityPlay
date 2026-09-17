/**
 * CONNECTING Puzzle Game - Core Game Logic & State Machine
 */

(function() {
  'use strict';

  class GameEngine {
    constructor() {
      this.levels = window.CONNECTING_LEVELS || [];
      this.currentLevel = null;
      this.status = 'READY'; // READY | PLAYING | PAUSED | COMPLETE
      this.paths = {}; // { [colorId]: [{r, c}, ...] }
      this.grid = []; // [r][c] -> colorId | null
      this.activeColorId = null;
      this.isDragging = false;
      this.moves = 0;
      this.timer = 0;
      this.timerInterval = null;
      this.usedHint = false;

      // Event listeners / callbacks
      this.onStateChange = null;
      this.onLevelComplete = null;
    }

    loadLevel(levelId) {
      const lvl = this.levels.find(l => l.id === levelId);
      if (!lvl) {
        console.error('Level not found:', levelId);
        return false;
      }

      this.currentLevel = lvl;
      this.resetLevel();
      return true;
    }

    resetLevel() {
      if (!this.currentLevel) return;

      this.stopTimer();
      this.timer = 0;
      this.moves = 0;
      this.usedHint = false;
      this.status = 'PLAYING';
      this.activeColorId = null;
      this.isDragging = false;

      const size = this.currentLevel.size;
      this.grid = Array(size).fill(null).map(() => Array(size).fill(null));
      this.paths = {};

      // Register endpoint locations into grid mapping
      for (const pair of this.currentLevel.pairs) {
        this.paths[pair.id] = [];
        this.grid[pair.start.r][pair.start.c] = pair.id;
        this.grid[pair.end.r][pair.end.c] = pair.id;
      }

      this.startTimer();
      this.notifyChange();
    }

    startTimer() {
      this.stopTimer();
      this.timerInterval = setInterval(() => {
        if (this.status === 'PLAYING') {
          this.timer++;
          this.notifyChange('timer');
        }
      }, 1000);
    }

    stopTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
    }

    pauseGame() {
      if (this.status === 'PLAYING') {
        this.status = 'PAUSED';
        this.notifyChange();
      }
    }

    resumeGame() {
      if (this.status === 'PAUSED') {
        this.status = 'PLAYING';
        this.notifyChange();
      }
    }

    // Helper: is cell an endpoint for a pair?
    getEndpointAt(r, c) {
      if (!this.currentLevel) return null;
      for (const pair of this.currentLevel.pairs) {
        if ((pair.start.r === r && pair.start.c === c) || (pair.end.r === r && pair.end.c === c)) {
          return pair;
        }
      }
      return null;
    }

    isCellEndpoint(pair, r, c) {
      return (pair.start.r === r && pair.start.c === c) || (pair.end.r === r && pair.end.c === c);
    }

    // Start drawing a path from cell (r, c)
    startPath(r, c) {
      if (this.status !== 'PLAYING' || !this.currentLevel) return;
      const size = this.currentLevel.size;
      if (r < 0 || r >= size || c < 0 || c >= size) return;

      const endpoint = this.getEndpointAt(r, c);

      if (endpoint) {
        // Player tapped an endpoint
        const colorId = endpoint.id;
        this.activeColorId = colorId;
        this.isDragging = true;

        // Clear existing path for this color from grid
        this.clearPath(colorId);

        // Start path with this endpoint cell
        this.paths[colorId] = [{ r, c }];
        this.grid[r][c] = colorId;

        const colorIndex = this.currentLevel.pairs.findIndex(p => p.id === colorId);
        window.ConnectingAudio.playStep();
        this.notifyChange();
        return;
      }

      // Check if player clicked mid-path of an existing pipe
      const existingColor = this.grid[r][c];
      if (existingColor && this.paths[existingColor] && this.paths[existingColor].length > 0) {
        const path = this.paths[existingColor];
        const idx = path.findIndex(pt => pt.r === r && pt.c === c);
        if (idx !== -1) {
          // Truncate from this cell forward
          for (let i = idx + 1; i < path.length; i++) {
            const pt = path[i];
            const ep = this.getEndpointAt(pt.r, pt.c);
            if (!ep) {
              this.grid[pt.r][pt.c] = null;
            }
          }
          this.paths[existingColor] = path.slice(0, idx + 1);
          this.activeColorId = existingColor;
          this.isDragging = true;
          window.ConnectingAudio.playStep();
          this.notifyChange();
        }
      }
    }

    // Drag move to cell (r, c)
    extendPath(r, c) {
      if (this.status !== 'PLAYING' || !this.isDragging || !this.activeColorId) return;
      const size = this.currentLevel.size;
      if (r < 0 || r >= size || c < 0 || c >= size) return;

      const path = this.paths[this.activeColorId];
      if (!path || path.length === 0) return;

      const last = path[path.length - 1];
      // Already on current head
      if (last.r === r && last.c === c) return;

      // Must be orthogonally adjacent (Manhattan dist === 1)
      const dist = Math.abs(last.r - r) + Math.abs(last.c - c);
      if (dist !== 1) return;

      const pair = this.currentLevel.pairs.find(p => p.id === this.activeColorId);
      const colorIndex = this.currentLevel.pairs.findIndex(p => p.id === this.activeColorId);

      // Backtracking: if player moves to the cell directly preceding head
      if (path.length > 1) {
        const prev = path[path.length - 2];
        if (prev.r === r && prev.c === c) {
          // Remove last cell
          const popped = path.pop();
          const ep = this.getEndpointAt(popped.r, popped.c);
          if (!ep) {
            this.grid[popped.r][popped.c] = null;
          }
          window.ConnectingAudio.playStep();
          this.notifyChange();
          return;
        }
      }

      // Check if cell is an endpoint of another color (blocked)
      const hitEndpoint = this.getEndpointAt(r, c);
      if (hitEndpoint && hitEndpoint.id !== this.activeColorId) {
        return; // Cannot pass through other color's endpoints
      }

      // Check if cell is the OTHER endpoint of the current color
      if (hitEndpoint && hitEndpoint.id === this.activeColorId) {
        const startEp = path[0];
        // Must be the other endpoint, not the start
        if (startEp.r !== r || startEp.c !== c) {
          // Reached goal!
          path.push({ r, c });
          this.grid[r][c] = this.activeColorId;
          this.isDragging = false;
          this.activeColorId = null;
          this.moves++;

          window.ConnectingAudio.playConnect(colorIndex);
          this.notifyChange();
          this.checkWinCondition();
          return;
        } else {
          // Looped back to own start endpoint
          return;
        }
      }

      // Check if cell is already in the current path (looping into self)
      const selfIdx = path.findIndex(pt => pt.r === r && pt.c === c);
      if (selfIdx !== -1) {
        // Truncate own path back to selfIdx
        for (let i = selfIdx + 1; i < path.length; i++) {
          const pt = path[i];
          const ep = this.getEndpointAt(pt.r, pt.c);
          if (!ep) {
            this.grid[pt.r][pt.c] = null;
          }
        }
        this.paths[this.activeColorId] = path.slice(0, selfIdx + 1);
        window.ConnectingAudio.playStep();
        this.notifyChange();
        return;
      }

      // Check if cell is occupied by ANOTHER color's path (collision / cut)
      const otherColor = this.grid[r][c];
      if (otherColor && otherColor !== this.activeColorId) {
        const otherPath = this.paths[otherColor];
        if (otherPath) {
          const hitIdx = otherPath.findIndex(pt => pt.r === r && pt.c === c);
          if (hitIdx !== -1) {
            // Cut other path from hitIdx onwards
            for (let i = hitIdx; i < otherPath.length; i++) {
              const pt = otherPath[i];
              const ep = this.getEndpointAt(pt.r, pt.c);
              if (!ep) {
                this.grid[pt.r][pt.c] = null;
              }
            }
            this.paths[otherColor] = otherPath.slice(0, hitIdx);
            window.ConnectingAudio.playBreak();
          }
        }
      }

      // Extend current path
      path.push({ r, c });
      this.grid[r][c] = this.activeColorId;
      window.ConnectingAudio.playStep();
      this.notifyChange();
    }

    endPath() {
      if (!this.isDragging) return;
      this.isDragging = false;
      this.activeColorId = null;
      this.moves++;
      this.notifyChange();
      this.checkWinCondition();
    }

    clearPath(colorId) {
      const path = this.paths[colorId];
      if (path) {
        for (const pt of path) {
          const ep = this.getEndpointAt(pt.r, pt.c);
          if (!ep) {
            this.grid[pt.r][pt.c] = null;
          }
        }
      }
      this.paths[colorId] = [];
    }

    isPathCompleted(colorId) {
      if (!this.currentLevel) return false;
      const pair = this.currentLevel.pairs.find(p => p.id === colorId);
      const path = this.paths[colorId];
      if (!pair || !path || path.length < 2) return false;

      const first = path[0];
      const last = path[path.length - 1];

      const startToEnd = (first.r === pair.start.r && first.c === pair.start.c && last.r === pair.end.r && last.c === pair.end.c);
      const endToStart = (first.r === pair.end.r && first.c === pair.end.c && last.r === pair.start.r && last.c === pair.start.c);

      return startToEnd || endToStart;
    }

    getFlowsStatus() {
      if (!this.currentLevel) return { completed: 0, total: 0 };
      let completed = 0;
      for (const pair of this.currentLevel.pairs) {
        if (this.isPathCompleted(pair.id)) completed++;
      }
      return { completed, total: this.currentLevel.pairs.length };
    }

    getBoardFillPercentage() {
      if (!this.currentLevel) return 0;
      const size = this.currentLevel.size;
      const totalCells = size * size;
      let filled = 0;

      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if (this.grid[r][c] !== null) filled++;
        }
      }
      return Math.round((filled / totalCells) * 100);
    }

    checkWinCondition() {
      if (this.status !== 'PLAYING' || !this.currentLevel) return false;

      // 1. All pairs must be connected
      const flows = this.getFlowsStatus();
      if (flows.completed !== flows.total) return false;

      // 2. 100% of the board must be filled
      const size = this.currentLevel.size;
      const totalCells = size * size;
      let filled = 0;
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if (this.grid[r][c] !== null) filled++;
        }
      }

      if (filled !== totalCells) return false;

      // Level won!
      this.status = 'COMPLETE';
      this.stopTimer();

      // Calculate stars
      const numPairs = this.currentLevel.pairs.length;
      let stars = 1;
      if (this.moves <= numPairs + 2) {
        stars = 3;
      } else if (this.moves <= numPairs * 2) {
        stars = 2;
      }

      window.ConnectingAudio.playLevelComplete();

      // Save progress
      const record = window.ConnectingStorage.saveLevelResult(
        this.currentLevel.id,
        stars,
        this.timer,
        this.moves,
        this.usedHint
      );

      if (this.onLevelComplete) {
        this.onLevelComplete({
          level: this.currentLevel,
          stars,
          time: this.timer,
          moves: this.moves,
          record
        });
      }

      this.notifyChange();
      return true;
    }

    // Reveal hint for one color from level.solution
    applyHint() {
      if (this.status !== 'PLAYING' || !this.currentLevel) return false;

      // Find first color that is incomplete or routing doesn't match solution
      let targetColorId = null;
      for (const sol of this.currentLevel.solution) {
        const curPath = this.paths[sol.colorId];
        if (!this.isPathCompleted(sol.colorId) || !this.pathMatches(curPath, sol.path)) {
          targetColorId = sol.colorId;
          break;
        }
      }

      if (!targetColorId) return false;

      const sol = this.currentLevel.solution.find(s => s.colorId === targetColorId);
      if (!sol) return false;

      this.usedHint = true;

      // Clear any other colors that occupy the target solution path cells
      for (const pt of sol.path) {
        const occColor = this.grid[pt.r][pt.c];
        if (occColor && occColor !== targetColorId) {
          this.clearPath(occColor);
        }
      }

      // Clear existing path for target color
      this.clearPath(targetColorId);

      // Apply target solution path
      this.paths[targetColorId] = sol.path.map(p => ({ r: p.r, c: p.c }));
      for (const pt of sol.path) {
        this.grid[pt.r][pt.c] = targetColorId;
      }

      const colorIndex = this.currentLevel.pairs.findIndex(p => p.id === targetColorId);
      window.ConnectingAudio.playHint();
      window.ConnectingAudio.playConnect(colorIndex);

      this.notifyChange();
      this.checkWinCondition();
      return true;
    }

    pathMatches(p1, p2) {
      if (!p1 || !p2 || p1.length !== p2.length) return false;
      const forward = p1.every((pt, i) => pt.r === p2[i].r && pt.c === p2[i].c);
      if (forward) return true;
      const reverse = p1.every((pt, i) => pt.r === p2[p2.length - 1 - i].r && pt.c === p2[p2.length - 1 - i].c);
      return reverse;
    }

    notifyChange(type = 'all') {
      if (this.onStateChange) {
        this.onStateChange(type, this);
      }
    }
  }

  window.ConnectingEngine = new GameEngine();
})();
