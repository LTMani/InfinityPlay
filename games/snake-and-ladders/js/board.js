/**
 * Snake & Ladders - Board & Coordinate System
 * Handles deterministic serpentine 10x10 mapping and responsive SVG rendering.
 */

(function() {
  'use strict';

  // Configured Snakes: start cell (higher) -> end cell (lower)
  const SNAKES = {
    16: 6,
    47: 26,
    49: 11,
    56: 53,
    62: 19,
    64: 60,
    87: 34,
    92: 73,
    95: 75,
    98: 78
  };

  // Configured Ladders: start cell (lower) -> end cell (higher)
  const LADDERS = {
    1: 38,
    4: 14,
    9: 31,
    21: 42,
    28: 84,
    36: 44,
    51: 67,
    71: 91,
    80: 100
  };

  class Board {
    constructor() {
      this.snakes = SNAKES;
      this.ladders = LADDERS;
      this.boardSize = 10; // 10x10
      this.totalCells = 100;
    }

    /**
     * Converts a cell number (1-100) to grid row and column index (0-9).
     * Row 0 is the top, Row 9 is the bottom.
     * Column 0 is the left, Column 9 is the right.
     */
    getCellCoords(cellNum) {
      if (cellNum < 1) cellNum = 1;
      if (cellNum > 100) cellNum = 100;

      const rowFromBottom = Math.floor((cellNum - 1) / this.boardSize); // 0 (bottom) to 9 (top)
      const rowY = (this.boardSize - 1) - rowFromBottom; // 9 at bottom, 0 at top

      const isEvenRow = (rowFromBottom % 2 === 0);
      const colRemainder = (cellNum - 1) % this.boardSize;
      const colX = isEvenRow ? colRemainder : (this.boardSize - 1) - colRemainder;

      return { col: colX, row: rowY, rowFromBottom };
    }

    /**
     * Returns the normalized center coordinates in a 1000x1000 viewBox.
     */
    getNormalizedCenter(cellNum) {
      const coords = this.getCellCoords(cellNum);
      const cellSize = 1000 / this.boardSize; // 100
      return {
        x: coords.col * cellSize + (cellSize / 2),
        y: coords.row * cellSize + (cellSize / 2)
      };
    }

    /**
     * Checks whether a cell triggers a snake or ladder.
     */
    checkEncounter(cellNum) {
      if (this.snakes[cellNum]) {
        return { type: 'snake', from: cellNum, to: this.snakes[cellNum] };
      }
      if (this.ladders[cellNum]) {
        return { type: 'ladder', from: cellNum, to: this.ladders[cellNum] };
      }
      return null;
    }

    /**
     * Generates the 100 board cell elements inside the grid container.
     */
    renderCells(container, tokensContainer = null) {
      if (!container) return;
      container.innerHTML = '';
      if (tokensContainer) tokensContainer.innerHTML = '';

      // Grid is rendered top-to-bottom (row 0 to 9) and left-to-right (col 0 to 9)
      for (let r = 0; r < this.boardSize; r++) {
        for (let c = 0; c < this.boardSize; c++) {
          const rowFromBottom = (this.boardSize - 1) - r;
          const isEven = (rowFromBottom % 2 === 0);
          const colRemainder = isEven ? c : (this.boardSize - 1) - c;
          const cellNum = (rowFromBottom * this.boardSize) + colRemainder + 1;

          const cellEl = document.createElement('div');
          cellEl.className = `board-cell cell-${cellNum}`;
          cellEl.setAttribute('data-cell', cellNum);
          cellEl.setAttribute('role', 'gridcell');
          cellEl.setAttribute('aria-label', `Cell ${cellNum}`);

          // Color checker pattern
          const isChecker = (r + c) % 2 === 0;
          cellEl.classList.add(isChecker ? 'tile-light' : 'tile-dark');

          // Highlight special cells
          let badgeHtml = '';
          if (cellNum === 1) {
            cellEl.classList.add('cell-start');
            badgeHtml = '<span class="cell-tag tag-start">START</span>';
          } else if (cellNum === 100) {
            cellEl.classList.add('cell-win');
            badgeHtml = '<span class="cell-tag tag-win">🏆 WIN</span>';
          } else if (this.snakes[cellNum]) {
            cellEl.classList.add('cell-snake-head');
            badgeHtml = `<span class="cell-tag tag-snake" title="Snake drops to ${this.snakes[cellNum]}">🐍 ${this.snakes[cellNum]}</span>`;
          } else if (this.ladders[cellNum]) {
            cellEl.classList.add('cell-ladder-bottom');
            badgeHtml = `<span class="cell-tag tag-ladder" title="Ladder climbs to ${this.ladders[cellNum]}">🪜 ${this.ladders[cellNum]}</span>`;
          }

          cellEl.innerHTML = `
            <div class="cell-header">
              <span class="cell-number">${cellNum}</span>
              ${badgeHtml}
            </div>
          `;
          container.appendChild(cellEl);

          if (tokensContainer) {
            const tokenCell = document.createElement('div');
            tokenCell.className = 'token-grid-cell';
            tokenCell.innerHTML = `<div class="cell-token-slot" id="slot-cell-${cellNum}"></div>`;
            tokensContainer.appendChild(tokenCell);
          } else {
            const slot = document.createElement('div');
            slot.className = 'cell-token-slot';
            slot.id = `slot-cell-${cellNum}`;
            cellEl.appendChild(slot);
          }
        }
      }
    }

    /**
     * Renders responsive SVG ladders and snakes overlay.
     */
    renderSvgOverlay(svgEl) {
      if (!svgEl) return;
      svgEl.setAttribute('viewBox', '0 0 1000 1000');
      svgEl.setAttribute('preserveAspectRatio', 'none');

      let defsHtml = `
        <defs>
          <filter id="svgDropShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="8" stdDeviation="6" flood-color="#000000" flood-opacity="0.85"/>
          </filter>
          <filter id="ladderGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="#facc15" flood-opacity="0.45"/>
          </filter>
          <filter id="snakeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="#22c55e" flood-opacity="0.45"/>
          </filter>

          <!-- Ladder Rail Gradient -->
          <linearGradient id="ladderRailGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fef08a"/>
            <stop offset="35%" stop-color="#eab308"/>
            <stop offset="70%" stop-color="#ca8a04"/>
            <stop offset="100%" stop-color="#713f12"/>
          </linearGradient>

          <!-- Snake Gradients -->
          <linearGradient id="snakeSkinGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#86efac"/>
            <stop offset="30%" stop-color="#22c55e"/>
            <stop offset="70%" stop-color="#15803d"/>
            <stop offset="100%" stop-color="#052e16"/>
          </linearGradient>
          <linearGradient id="snakeSkinGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fca5a5"/>
            <stop offset="30%" stop-color="#ef4444"/>
            <stop offset="70%" stop-color="#991b1b"/>
            <stop offset="100%" stop-color="#450a0a"/>
          </linearGradient>
          <linearGradient id="snakeSkinGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#c084fc"/>
            <stop offset="30%" stop-color="#9333ea"/>
            <stop offset="70%" stop-color="#6b21a8"/>
            <stop offset="100%" stop-color="#3b0764"/>
          </linearGradient>
        </defs>
      `;

      let laddersHtml = '<g id="svgLaddersGroup" class="svg-ladders">';
      Object.entries(this.ladders).forEach(([startStr, endStr]) => {
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        laddersHtml += this.generateLadderSvg(start, end);
      });
      laddersHtml += '</g>';

      let snakesHtml = '<g id="svgSnakesGroup" class="svg-snakes">';
      const snakeKeys = Object.keys(this.snakes);
      snakeKeys.forEach((startStr, idx) => {
        const start = parseInt(startStr, 10);
        const end = this.snakes[start];
        const gradId = idx % 3 === 0 ? 'snakeSkinGrad1' : (idx % 3 === 1 ? 'snakeSkinGrad2' : 'snakeSkinGrad3');
        snakesHtml += this.generateSnakeSvg(start, end, gradId, idx);
      });
      snakesHtml += '</g>';

      svgEl.innerHTML = defsHtml + laddersHtml + snakesHtml;
    }

    /**
     * Generates twin rails and cross rungs for a ladder.
     */
    generateLadderSvg(startCell, endCell) {
      const p1 = this.getNormalizedCenter(startCell);
      const p2 = this.getNormalizedCenter(endCell);

      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const len = Math.hypot(dx, dy);
      if (len === 0) return '';

      // Perpendicular vector for rail width (14 units wide)
      const nx = -(dy / len) * 11;
      const ny = (dx / len) * 11;

      const rail1 = { x1: p1.x + nx, y1: p1.y + ny, x2: p2.x + nx, y2: p2.y + ny };
      const rail2 = { x1: p1.x - nx, y1: p1.y - ny, x2: p2.x - nx, y2: p2.y - ny };

      // Generate cross rungs every 28 units
      const numRungs = Math.max(3, Math.floor(len / 28));
      let rungsHtml = '';
      for (let i = 1; i < numRungs; i++) {
        const t = i / numRungs;
        const rx1 = rail1.x1 + (rail1.x2 - rail1.x1) * t;
        const ry1 = rail1.y1 + (rail1.y2 - rail1.y1) * t;
        const rx2 = rail2.x1 + (rail2.x2 - rail2.x1) * t;
        const ry2 = rail2.y1 + (rail2.y2 - rail2.y1) * t;
        rungsHtml += `<line x1="${rx1.toFixed(1)}" y1="${ry1.toFixed(1)}" x2="${rx2.toFixed(1)}" y2="${ry2.toFixed(1)}" stroke="url(#ladderRailGrad)" stroke-width="4" stroke-linecap="round" />`;
      }

      return `
        <g class="ladder-item" id="ladder-${startCell}-${endCell}" filter="url(#svgDropShadow)">
          <!-- Ladder Shadow Rails -->
          <line x1="${rail1.x1.toFixed(1)}" y1="${rail1.y1.toFixed(1)}" x2="${rail1.x2.toFixed(1)}" y2="${rail1.y2.toFixed(1)}" stroke="#000000" stroke-width="7" opacity="0.4" stroke-linecap="round" />
          <line x1="${rail2.x1.toFixed(1)}" y1="${rail2.y1.toFixed(1)}" x2="${rail2.x2.toFixed(1)}" y2="${rail2.y2.toFixed(1)}" stroke="#000000" stroke-width="7" opacity="0.4" stroke-linecap="round" />
          <!-- Rails -->
          <line x1="${rail1.x1.toFixed(1)}" y1="${rail1.y1.toFixed(1)}" x2="${rail1.x2.toFixed(1)}" y2="${rail1.x2.toFixed(1)}" stroke="url(#ladderRailGrad)" stroke-width="5" stroke-linecap="round" />
          <line x1="${rail2.x1.toFixed(1)}" y1="${rail2.y1.toFixed(1)}" x2="${rail2.x2.toFixed(1)}" y2="${rail2.y2.toFixed(1)}" stroke="url(#ladderRailGrad)" stroke-width="5" stroke-linecap="round" />
          <!-- Rungs -->
          ${rungsHtml}
        </g>
      `;
    }

    /**
     * Generates a sinusoidal curving snake with head, eyes, tongue and tail.
     */
    generateSnakeSvg(startCell, endCell, gradId, index) {
      const pHead = this.getNormalizedCenter(startCell);
      const pTail = this.getNormalizedCenter(endCell);

      const dx = pTail.x - pHead.x;
      const dy = pTail.y - pHead.y;
      const len = Math.hypot(dx, dy);

      // Create wavy control points for natural slithering
      const sign = (index % 2 === 0) ? 1 : -1;
      const waveAmplitude = Math.min(80, Math.max(35, len * 0.22));

      // Unit perpendicular vector
      const nx = -(dy / len) * sign;
      const ny = (dx / len) * sign;

      // 2 cubic Bézier control points
      const cp1x = pHead.x + (dx * 0.33) + (nx * waveAmplitude);
      const cp1y = pHead.y + (dy * 0.33) + (ny * waveAmplitude);
      const cp2x = pHead.x + (dx * 0.66) - (nx * waveAmplitude);
      const cp2y = pHead.y + (dy * 0.66) - (ny * waveAmplitude);

      const pathD = `M ${pHead.x.toFixed(1)},${pHead.y.toFixed(1)} C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${pTail.x.toFixed(1)},${pTail.y.toFixed(1)}`;

      // Head orientation angle
      const headAngle = Math.atan2(cp1y - pHead.y, cp1x - pHead.x) * (180 / Math.PI) + 180;

      return `
        <g class="snake-item" id="snake-${startCell}-${endCell}" filter="url(#svgDropShadow)">
          <!-- Under-body ambient shadow -->
          <path d="${pathD}" fill="none" stroke="#000000" stroke-width="15" opacity="0.35" stroke-linecap="round" />
          <!-- Thick Reptile Body -->
          <path d="${pathD}" fill="none" stroke="url(#${gradId})" stroke-width="12" stroke-linecap="round" />
          <!-- Decorative Dorsal Scale Pattern -->
          <path d="${pathD}" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-dasharray="5,8" opacity="0.65" stroke-linecap="round" />
          
          <!-- Snake Tail -->
          <circle cx="${pTail.x.toFixed(1)}" cy="${pTail.y.toFixed(1)}" r="4.5" fill="#facc15" stroke="#000000" stroke-width="1.2" />

          <!-- Snake Head Group -->
          <g transform="translate(${pHead.x.toFixed(1)}, ${pHead.y.toFixed(1)}) rotate(${headAngle.toFixed(1)})">
            <!-- Forked Red Tongue -->
            <path d="M 12,0 L 22,-3 M 12,0 L 22,3" stroke="#ef4444" stroke-width="2" stroke-linecap="round" />
            <!-- Head Shape -->
            <ellipse cx="4" cy="0" rx="11" ry="8.5" fill="url(#${gradId})" stroke="#000000" stroke-width="1.2" />
            <!-- Eyes -->
            <circle cx="3" cy="-4" r="2.8" fill="#facc15" />
            <circle cx="3" cy="4" r="2.8" fill="#facc15" />
            <!-- Pupils -->
            <circle cx="3.8" cy="-4" r="1.3" fill="#000000" />
            <circle cx="3.8" cy="4" r="1.3" fill="#000000" />
          </g>
        </g>
      `;
    }
  }

  window.SNBoard = new Board();
})();
