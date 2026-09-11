/**
 * UIManager.js
 * DOM renderer and animation coordinator for BLOCK MERGE.
 * Manages responsive 4x4 tiles, CSS hardware-accelerated transforms, score popups, and modals.
 */

export class UIManager {
  constructor(elements) {
    this.boardElement = elements.boardElement;
    this.gridBackground = elements.gridBackground;
    this.tileContainer = elements.tileContainer;
    this.scoreElement = elements.scoreElement;
    this.scoreContainer = elements.scoreContainer;
    this.bestScoreElement = elements.bestScoreElement;
    this.undoButton = elements.undoButton;
    this.soundButton = elements.soundButton;

    // Modals
    this.winModal = elements.winModal;
    this.gameOverModal = elements.gameOverModal;
    this.confirmModal = elements.confirmModal;
    this.continueModal = elements.continueModal;

    this.gap = 12; // Pixels
    this.cellSize = 0;
    this.tileElements = new Map(); // id -> HTMLElement

    this.initGridBackground();
    this.updateMetrics();

    window.addEventListener('resize', () => {
      this.updateMetrics();
      this.repositionAllTiles();
    });
  }

  initGridBackground() {
    if (!this.gridBackground) return;
    this.gridBackground.innerHTML = '';
    for (let i = 0; i < 16; i++) {
      const cell = document.createElement('div');
      cell.className = 'grid-cell';
      cell.setAttribute('aria-hidden', 'true');
      this.gridBackground.appendChild(cell);
    }
  }

  updateMetrics() {
    if (!this.boardElement) return;
    const width = this.boardElement.clientWidth;
    // Responsive gap adjustment
    this.gap = width < 360 ? 8 : (width < 480 ? 10 : 14);
    // Board padding is equal to gap
    const totalGaps = this.gap * 5; // 2 outer paddings + 3 inner gaps
    this.cellSize = Math.floor((width - totalGaps) / 4);
  }

  getTilePosition(r, c) {
    const x = this.gap + c * (this.cellSize + this.gap);
    const y = this.gap + r * (this.cellSize + this.gap);
    return { x, y };
  }

  renderBoard(grid, scoreGained = 0) {
    this.updateMetrics();
    const currentTileIds = new Set();

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const tile = grid[r][c];
        if (!tile) continue;

        currentTileIds.add(tile.id);
        let el = this.tileElements.get(tile.id);

        if (!el) {
          // New Tile Creation
          el = document.createElement('div');
          el.className = `tile tile-${tile.value} ${tile.isNew ? 'tile-spawn' : ''}`;
          el.setAttribute('data-id', tile.id);
          el.setAttribute('data-value', tile.value);
          el.setAttribute('role', 'img');
          el.setAttribute('aria-label', `Tile ${tile.value}`);

          const inner = document.createElement('div');
          inner.className = 'tile-inner';
          inner.textContent = tile.value;
          el.appendChild(inner);

          this.tileContainer.appendChild(el);
          this.tileElements.set(tile.id, el);
        } else {
          // Existing Tile Update
          el.className = `tile tile-${tile.value} ${tile.isMerged ? 'tile-merged' : ''}`;
          el.setAttribute('data-value', tile.value);
          el.setAttribute('aria-label', `Tile ${tile.value}`);
          const inner = el.querySelector('.tile-inner');
          if (inner && inner.textContent !== String(tile.value)) {
            inner.textContent = tile.value;
          }
        }

        // Apply physical metrics & translation
        const pos = this.getTilePosition(r, c);
        el.style.width = `${this.cellSize}px`;
        el.style.height = `${this.cellSize}px`;
        el.style.transform = `translate(${pos.x}px, ${pos.y}px)`;

        // Adjust font size dynamically for large numbers
        this.adjustFontSize(el, tile.value);
      }
    }

    // Remove obsolete tiles
    for (const [id, el] of this.tileElements.entries()) {
      if (!currentTileIds.has(id)) {
        el.remove();
        this.tileElements.delete(id);
      }
    }

    if (scoreGained > 0) {
      this.showScoreAddition(scoreGained);
    }
  }

  adjustFontSize(el, val) {
    const inner = el.querySelector('.tile-inner');
    if (!inner) return;

    if (val >= 1024) {
      inner.style.fontSize = this.cellSize < 70 ? '1.1rem' : '1.5rem';
    } else if (val >= 128) {
      inner.style.fontSize = this.cellSize < 70 ? '1.3rem' : '1.8rem';
    } else {
      inner.style.fontSize = this.cellSize < 70 ? '1.6rem' : '2.2rem';
    }
  }

  repositionAllTiles() {
    this.updateMetrics();
    for (const [id, el] of this.tileElements.entries()) {
      const parentGrid = window.blockMergeApp?.engine?.grid;
      if (!parentGrid) continue;

      let found = false;
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          if (parentGrid[r][c] && parentGrid[r][c].id === id) {
            const pos = this.getTilePosition(r, c);
            el.style.width = `${this.cellSize}px`;
            el.style.height = `${this.cellSize}px`;
            el.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
            this.adjustFontSize(el, parentGrid[r][c].value);
            found = true;
            break;
          }
        }
        if (found) break;
      }
    }
  }

  updateScore(score, bestScore) {
    if (this.scoreElement) {
      this.scoreElement.textContent = score.toLocaleString();
    }
    if (this.bestScoreElement) {
      this.bestScoreElement.textContent = bestScore.toLocaleString();
    }
  }

  showScoreAddition(points) {
    if (!this.scoreContainer) return;

    const popup = document.createElement('div');
    popup.className = 'score-addition';
    popup.textContent = `+${points}`;
    this.scoreContainer.appendChild(popup);

    setTimeout(() => {
      popup.remove();
    }, 700);
  }

  setUndoEnabled(enabled) {
    if (this.undoButton) {
      this.undoButton.disabled = !enabled;
      this.undoButton.setAttribute('aria-disabled', String(!enabled));
    }
  }

  updateSoundButton(enabled) {
    if (!this.soundButton) return;
    this.soundButton.innerHTML = enabled ? '🔊' : '🔇';
    this.soundButton.setAttribute('aria-label', enabled ? 'Mute Sound' : 'Enable Sound');
    this.soundButton.title = enabled ? 'Sound: ON' : 'Sound: OFF';
    this.soundButton.classList.toggle('muted', !enabled);
  }

  // Modals
  showWinModal() {
    if (this.winModal) {
      this.winModal.classList.add('active');
    }
  }

  hideWinModal() {
    if (this.winModal) {
      this.winModal.classList.remove('active');
    }
  }

  showGameOverModal(finalScore, bestScore) {
    if (this.gameOverModal) {
      const finalEl = document.getElementById('final-score-val');
      const bestEl = document.getElementById('gameover-best-val');
      if (finalEl) finalEl.textContent = finalScore.toLocaleString();
      if (bestEl) bestEl.textContent = bestScore.toLocaleString();
      this.gameOverModal.classList.add('active');
    }
  }

  hideGameOverModal() {
    if (this.gameOverModal) {
      this.gameOverModal.classList.remove('active');
    }
  }

  showConfirmModal() {
    if (this.confirmModal) {
      this.confirmModal.classList.add('active');
    }
  }

  hideConfirmModal() {
    if (this.confirmModal) {
      this.confirmModal.classList.remove('active');
    }
  }

  showContinueModal() {
    if (this.continueModal) {
      this.continueModal.classList.add('active');
    }
  }

  hideContinueModal() {
    if (this.continueModal) {
      this.continueModal.classList.remove('active');
    }
  }
}
